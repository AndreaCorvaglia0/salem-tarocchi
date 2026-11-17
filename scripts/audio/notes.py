#!/usr/bin/env python3
"""Cut the real instrument notes of the smoke rite out of the University of Iowa recordings (one file holds a
chromatic run: the notes are separated by silence), check their pitch, and encode them for the game.

    python3 -I scripts/audio/notes.py <dir with the Iowa files> <out dir: public/rite/notes>

Each note: the n-th sounding segment of the run, pitch checked with pYIN (median f0 within 40 cents of the
note wanted), at most `secs` long with a fade-out, tuned onto the note when more than 12 cents off, -20 LUFS (the notes sit a little above the music, which is
-24, because they are short), mono 44.1 kHz 96 kbit/s mp3.
"""
import os, subprocess, sys
import numpy as np
import librosa

SR = 44100
# out name: (file, index of the note in the run, note wanted, seconds kept, fade-out seconds)
NOTES = {
    'rosa': ('Cello.arco.mf.sulD.D3B3.aiff', 7, 'A3', 2.6, 1.0),
    'alloro': ('Guitar.mf.sulA.C4E4.mono.aif', 2, 'D4', 2.4, 1.0),
    'cipresso': ('Bass.arco.mf.sulD.D2B2.aiff', 0, 'D2', 2.8, 1.2),
    'salvia': ('crotale.A6.pp.aif', 0, 'A6', 3.0, 1.5),
    'mirra': ('AltoFlute.mf.C4B4.aiff', 4, 'E4', 2.6, 1.0),
    'knock': ('thaigong.D4.mf.aif', 0, 'D4', 4.5, 2.0),  # the opening motif: one stroke of a tuned gong
}


def decode(path):
    raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype='<f4').astype(np.float32)


def segments(y):
    iv = librosa.effects.split(y, top_db=38, frame_length=4096, hop_length=1024)
    return [(a, b) for a, b in iv if (b - a) > SR * 0.4]


def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    for name, (f, idx, want, secs, fade) in NOTES.items():
        y = decode(os.path.join(src, f))
        seg = segments(y)
        target = librosa.note_to_hz(want)

        def f0of(a, b):
            f0, _v, _p = librosa.pyin(y[a: a + min(b - a, SR)], sr=SR, fmin=target / 1.6, fmax=target * 1.6, frame_length=4096)
            return float(np.nanmedian(f0)) if np.isfinite(f0).any() else float('nan')
        # the segment at `idx`, unless another one is clearly nearer the note wanted (decays can split a run)
        meds = [f0of(a, b) for a, b in seg] if len(seg) > 1 else [f0of(*seg[0])]
        near = [abs(np.log2(m / target)) if m == m else 9 for m in meds]
        k = idx if near[idx] < 40 / 1200 else int(np.argmin(near))
        a, b = seg[k]
        x = y[a: min(b, a + int(SR * secs))]
        med = meds[k]
        cents = 1200 * np.log2(med / target) if med == med else float('nan')
        ok = abs(cents) < 60 if cents == cents else False  # tuned below when more than 12 cents off
        print(f"{name:9} {f} segment {k} of {len(seg)}: want {want} ({target:.1f} Hz), median f0 {med:.1f} Hz, {cents:+.0f} cents {'ok' if ok else 'CHECK'}{' (tuned)' if cents == cents and abs(cents) > 12 else ''}; {len(x) / SR:.2f} s")
        tmp = os.path.join(out, f'.{name}.f32')
        x.astype('<f4').tofile(tmp)
        dur = len(x) / SR
        # tune it onto the note (a gong is never exactly on pitch; the notes must agree with each other)
        tune = f"asetrate={SR * target / med:.1f},aresample={SR}," if med == med and abs(cents) > 12 else ''
        af = tune + f"afade=t=in:d=0.005,afade=t=out:st={max(0, dur - fade):.3f}:d={fade},loudnorm=I=-20:TP=-3:LRA=7"
        subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', tmp, '-af', af,
                        '-ar', str(SR), '-ac', '1', '-b:a', '96k', '-map_metadata', '-1', os.path.join(out, f'{name}.mp3')], check=True)
        os.remove(tmp)


if __name__ == '__main__':
    main()
