#!/usr/bin/env python3
"""Measure music candidates for the smoke rite (notes/rito/musica.md): the ear we do not have.

    python3 -I scripts/audio/measure.py <dir-with-air--title.mp3> [--json out.json] [--secs 150]

For each file (named `<air>--<title>.mp3`): decode to mono PCM with ffmpeg, then compute, on the whole
excerpt and on the first 20 s (what she hears first):
  tempo     beats per minute from the onset envelope (librosa), and the catalogue's own figure if known
  mode      major/minor from the mean chroma against the Krumhansl-Kessler profiles; `modeScore` is
            (best major r) - (best minor r): > 0 major, < 0 minor, near 0 ambiguous; key is the best fit
  register  energy-weighted mean pitch of the constant-Q spectrum, as a MIDI number (60 = middle C)
  centroid  mean spectral centroid in Hz (bright/dark timbre)
  onsets    onsets per second (legato: few; pizzicato / staccato: many)
  perc      share of energy in the percussive part (HPSS): plucked and struck sounds are high
  space     share of frames more than 25 dB under the loudest (silence, room between the notes)
  poly      mean chroma entropy per frame, 0..1 (one voice: low; full chords: high)
  loudness  integrated LUFS and loudness range (LU), with ffmpeg's ebur128
Then the distance of each candidate from its air's recipe (PROGETTO.md, «Le arie»), and the pairwise
distance between the airs' best candidates on the normalised features.
"""
import json, os, re, subprocess, sys
import numpy as np
import librosa

SR = 22050
KK_MAJOR = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
KK_MINOR = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

# The recipes of PROGETTO.md as ranges on the measured features: (lo, hi, scale). Outside the range the
# distance grows by (how far) / scale. None = this feature does not matter for this air.
RECIPE = {
    # Calibrated on the 25 measured candidates (notes/rito/musica.md): the percussive share of plucked pieces
    # is small in absolute terms (0.03-0.05 against 0.00-0.02 for bowed and sung ones), and the onset detector
    # also fires on bow changes and choir syllables, so "legato" allows up to 3 onsets a second.
    #            tempo             modeScore            register           onsets             perc                 space               poly
    'rosa':     dict(tempo=(40, 75, 15), mode=(0.05, 1, 0.1), reg=(48, 66, 4), ons=(0, 3.0, 0.8), perc=(0, 0.025, 0.01), space=None, poly=None),
    'alloro':   dict(tempo=(84, 120, 15), mode=(0.05, 1, 0.1), reg=(55, 74, 4), ons=(2.0, 9, 0.8), perc=(0.03, 1, 0.01), space=None, poly=None),
    'cipresso': dict(tempo=(36, 72, 15), mode=(-1, -0.03, 0.1), reg=(36, 52, 4), ons=(0, 3.0, 0.8), perc=(0, 0.025, 0.01), space=None, poly=None),
    'salvia':   dict(tempo=None, mode=None, reg=(64, 90, 4), ons=(0, 2.0, 0.6), perc=None, space=(0.10, 1, 0.05), poly=None),
    'mirra':    dict(tempo=(36, 75, 15), mode=(-0.12, 0.12, 0.1), reg=None, ons=(0, 3.0, 0.8), perc=(0, 0.025, 0.01), space=None, poly=(0, 0.75, 0.05)),
}
FEATS = [('tempo', 'tempo'), ('mode', 'modeScore'), ('reg', 'register'), ('ons', 'onsets'), ('perc', 'perc'), ('space', 'space'), ('poly', 'poly')]


def decode(path, secs):
    raw = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-t', str(secs), '-i', path,
                          '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype='<f4').astype(np.float32)


def loudness(path, secs):
    out = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-t', str(secs), '-i', path, '-af', 'ebur128', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    tail = out[out.rfind('Summary:'):]
    i = re.search(r'I:\s+(-?[\d.]+) LUFS', tail); lra = re.search(r'LRA:\s+([\d.]+) LU', tail)
    return (float(i.group(1)) if i else None), (float(lra.group(1)) if lra else None)


def features(y):
    if len(y) < SR * 3:
        return None
    onset = librosa.onset.onset_strength(y=y, sr=SR)
    tempo = float(np.atleast_1d(librosa.feature.tempo(onset_envelope=onset, sr=SR, aggregate=np.median))[0])
    onsets = librosa.onset.onset_detect(onset_envelope=onset, sr=SR, units='time')
    chroma = librosa.feature.chroma_cqt(y=y, sr=SR)
    prof = chroma.mean(axis=1)
    rmaj = [np.corrcoef(prof, np.roll(KK_MAJOR, k))[0, 1] for k in range(12)]
    rmin = [np.corrcoef(prof, np.roll(KK_MINOR, k))[0, 1] for k in range(12)]
    kM, km = int(np.argmax(rmaj)), int(np.argmax(rmin))
    mode_score = float(rmaj[kM] - rmin[km])
    key = f"{NOTES[kM]} maggiore" if mode_score >= 0 else f"{NOTES[km]} minore"
    C = np.abs(librosa.cqt(y, sr=SR, fmin=librosa.note_to_hz('C1'), n_bins=84, bins_per_octave=12)) ** 2
    midi = np.arange(84) + 24
    register = float((C.sum(axis=1) * midi).sum() / max(C.sum(), 1e-12))
    centroid = float(librosa.feature.spectral_centroid(y=y, sr=SR).mean())
    H, P = librosa.effects.hpss(y)
    perc = float((P ** 2).sum() / max((H ** 2).sum() + (P ** 2).sum(), 1e-12))
    rms = librosa.feature.rms(y=y)[0]
    db = 20 * np.log10(np.maximum(rms, 1e-9))
    space = float((db < db.max() - 25).mean())
    cn = chroma / np.maximum(chroma.sum(axis=0, keepdims=True), 1e-9)
    ent = -(cn * np.log(np.maximum(cn, 1e-12))).sum(axis=0) / np.log(12)
    loud = db > db.max() - 25
    poly = float(ent[loud[:ent.shape[0]]].mean()) if loud.any() else float(ent.mean())
    return dict(tempo=round(tempo, 1), modeScore=round(mode_score, 3), key=key, modeConf=round(abs(mode_score), 3),
                register=round(register, 1), centroid=round(centroid), onsets=round(len(onsets) / (len(y) / SR), 2),
                perc=round(perc, 3), space=round(space, 3), poly=round(poly, 3))


def distance(air, f, catalogue_bpm=None):
    """How far a candidate is from its air's recipe, and the features that miss."""
    r, d, miss = RECIPE[air], 0.0, []
    for k, name in FEATS:
        rng = r.get(k)
        if not rng:
            continue
        v = f[name]
        if k == 'tempo' and catalogue_bpm:  # the composer's figure is more reliable than an estimate on rubato
            v = catalogue_bpm
        lo, hi, sc = rng
        out = (lo - v) / sc if v < lo else (v - hi) / sc if v > hi else 0.0
        if out > 0:
            d += out; miss.append(f"{name} {v}")
    return round(d, 2), miss


def pairs(json_path, picks):
    """Distance between the chosen pieces on z-scored features (all candidates give the scale)."""
    rows = json.load(open(json_path))
    keys = ['tempo', 'modeScore', 'register', 'centroid', 'onsets', 'perc', 'space', 'poly']
    def vec(r):
        f = dict(r['whole']); f['tempo'] = r['catalogueBpm'] or f['tempo']; f['centroid'] = np.log(f['centroid']); return np.array([f[k] for k in keys], float)
    M = np.array([vec(r) for r in rows]); mu, sd = M.mean(0), M.std(0) + 1e-9
    chosen = {}
    for p in picks:
        air, title = p.split(':', 1)
        chosen[air] = next(r for r in rows if r['air'] == air and r['title'] == title)
    names = list(chosen)
    print('pairwise distance (z-scored, euclidean over ' + ', '.join(keys) + ')')
    print(' ' * 10 + ''.join(f'{n:>10}' for n in names))
    for a in names:
        print(f'{a:10}' + ''.join(f'{np.linalg.norm((vec(chosen[a]) - vec(chosen[b])) / sd):10.2f}' for b in names))


def main():
    if '--pairs' in sys.argv:
        return pairs(sys.argv[1], sys.argv[sys.argv.index('--pairs') + 1].split(','))
    src = sys.argv[1]
    out_json = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else None
    secs = float(sys.argv[sys.argv.index('--secs') + 1]) if '--secs' in sys.argv else 150
    cat = {}
    tsv = os.path.join(os.path.dirname(__file__), 'candidates.tsv')
    if os.path.exists(tsv):
        for line in open(tsv, encoding='utf8'):
            if line.startswith('#') or not line.strip():
                continue
            air, title, _f, why = line.rstrip('\n').split('\t')
            m = re.match(r'(\d+) bpm', why)
            cat[(air, title)] = float(m.group(1)) if m else None
    rows = []
    for name in sorted(os.listdir(src)):
        if not name.endswith('.mp3') or '--' not in name:
            continue
        air, title = name[:-4].split('--', 1)
        path = os.path.join(src, name)
        y = decode(path, secs)
        whole, first = features(y), features(y[: SR * 20])
        I, LRA = loudness(path, secs)
        bpm = cat.get((air, title))
        d, miss = distance(air, whole, bpm)
        d20, miss20 = distance(air, first, bpm)
        rows.append(dict(air=air, title=title, file=name, catalogueBpm=bpm, whole=whole, first20=first, lufs=I, lra=LRA,
                         dist=d, miss=miss, dist20=d20, miss20=miss20))
        print(f"{air:9} {title[:30]:30} d={d:5.2f} d20={d20:5.2f} tempo={whole['tempo']:6} cat={bpm} mode={whole['modeScore']:+.2f} ({whole['key']}) "
              f"reg={whole['register']} cen={whole['centroid']} ons={whole['onsets']} perc={whole['perc']} space={whole['space']} poly={whole['poly']} I={I} LRA={LRA} miss={miss}", flush=True)
    if out_json:
        json.dump(rows, open(out_json, 'w'), indent=1, ensure_ascii=False)


if __name__ == '__main__':
    main()
