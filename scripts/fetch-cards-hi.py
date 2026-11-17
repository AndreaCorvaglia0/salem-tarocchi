#!/usr/bin/env python3
"""Fetch high-resolution Rider-Waite-Smith scans (public domain, Wikimedia Commons) and
produce public/cards-hi/<id>.webp (700x1200, WEBP q60 (q82 = 17 MB, over the 12 MB budget)) aligned to the framing of public/cards/<id>.webp.

Usage: python3 scripts/fetch-cards-hi.py [--cache DIR] [--no-download] [--only id,id]
Downloads are sequential, 4 s apart, retry on 429 (60 s, max 5). Cards whose best alignment
is not good enough are skipped and listed (and removed from cards-hi if present).
Writes scripts/cards-hi-report.json and prints the HI id list for src/ui/daycard.js.
"""
import argparse, json, os, subprocess, sys, time, urllib.parse
import numpy as np
import cv2
from PIL import Image
from scipy.optimize import minimize

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = 'salem-tarocchi/1.0 (private hobby project)'
MAJ = ['00 Fool', '01 Magician', '02 High Priestess', '03 Empress', '04 Emperor', '05 Hierophant', '06 Lovers',
       '07 Chariot', '08 Strength', '09 Hermit', '10 Wheel of Fortune', '11 Justice', '12 Hanged Man', '13 Death',
       '14 Temperance', '15 Devil', '16 Tower', '17 Star', '18 Moon', '19 Sun', '20 Judgement', '21 World']
SUITS = {'w': 'Wands', 'c': 'Cups', 's': 'Swords', 'p': 'Pents'}
MAX_NCC_COST = 0.6   # 1-NCC of edge maps above which a card is rejected as a different drawing/edition
MAX_SHIFT = 1.5      # percent of width: allowed local residual (90th percentile of patches)

def names():
    out = {}
    for i, n in enumerate(MAJ): out['m%02d' % i] = 'RWS Tarot %s.jpg' % n
    for k, s in SUITS.items():
        for i in range(1, 15): out['%s%02d' % (k, i)] = '%s%02d.jpg' % (s, i)
    return out

def curl(url, dest):
    for attempt in range(6):
        r = subprocess.run(['curl', '-sS', '-L', '-m', '60', '-A', UA, '-o', dest, '-w', '%{http_code}', url],
                           capture_output=True, text=True)
        code = r.stdout.strip()
        if code == '429':
            if attempt == 5: return code
            print('  429, wait 60s'); time.sleep(60); continue
        return code
    return '429'

def download(cid, fname, cache, overrides):
    fname = overrides.get(cid, fname)
    dest = os.path.join(cache, cid + '.jpg')
    if os.path.exists(dest) and os.path.getsize(dest) > 20000: return dest, fname
    url = 'https://commons.wikimedia.org/wiki/Special:FilePath/%s?width=900' % urllib.parse.quote(fname)
    code = curl(url, dest); time.sleep(4)
    if code != '200':
        print('  %s: HTTP %s for %s' % (cid, code, fname)); 
        if os.path.exists(dest): os.remove(dest)
        return None, fname
    return dest, fname

def sample(img, box, size):
    return img.transform(size, Image.EXTENT, box, Image.BILINEAR)

def grey(img): return np.asarray(img.convert('L'), dtype=np.float32)

def feat(img):
    """colour-invariant feature: gradient magnitude of the blurred grey image, normalised.
    (the current files are the 1971 recoloured scan, Commons has the aged 1909 scan: tones differ, line art is the same)"""
    g = cv2.GaussianBlur(grey(img), (0, 0), 1.2)
    gx = cv2.Sobel(g, cv2.CV_32F, 1, 0); gy = cv2.Sobel(g, cv2.CV_32F, 0, 1)
    m = np.sqrt(gx * gx + gy * gy)
    return (m - m.mean()) / (m.std() + 1e-6)

def align(old, new):
    """box (x0,y0,x1,y1) in new pixel coords so that sample(new, box) ~ old. Returns box, 1-NCC."""
    W, H = new.size
    def mk(sz):
        o = feat(old.resize(sz, Image.LANCZOS))
        def cost(p):
            x0, y0, x1, y1 = p
            if x1 - x0 < W * .5 or y1 - y0 < H * .5: return 2.0
            return 1.0 - float((feat(sample(new, (x0, y0, x1, y1), sz)) * o).mean())
        return cost
    c1 = mk((88, 150)); cands = []
    for mx in np.arange(-.04, .13, .02):
        for my in np.arange(-.04, .13, .02):
            for dx in (-.02, 0, .02):
                for dy in (-.02, 0, .02):
                    p = (W * (mx + dx), H * (my + dy), W * (1 - mx + dx), H * (1 - my + dy))
                    cands.append((c1(p), p))
    cands.sort(key=lambda t: t[0]); c2 = mk((175, 300)); c3 = mk((350, 600)); res = None
    for _, p0 in cands[:6]:  # multi-start refinement
        r = minimize(c2, p0, method='Nelder-Mead', options=dict(xatol=.05, fatol=1e-5, maxiter=800))
        r = minimize(c3, r.x, method='Nelder-Mead', options=dict(xatol=.05, fatol=1e-6, maxiter=400))
        if res is None or r.fun < res.fun: res = r
    return tuple(res.x), float(res.fun)

def residual(old, new, box):
    """local shifts (percent of width) between old and the aligned new crop, phase correlation on 80px patches."""
    a = feat(old); b = feat(sample(new, box, old.size))
    win = cv2.createHanningWindow((80, 80), cv2.CV_32F); sh = []
    for y in range(20, 600 - 80, 60):
        for x in range(10, 350 - 80, 55):
            pa, pb = a[y:y + 80, x:x + 80], b[y:y + 80, x:x + 80]
            if pa.std() < .6 or pb.std() < .6: continue
            (dx, dy), resp = cv2.phaseCorrelate(pa.astype(np.float32), pb.astype(np.float32), win)
            if resp > .15: sh.append(float(np.hypot(dx, dy)) / 350 * 100)
    return (max(sh), float(np.mean(sh)), len(sh), float(np.percentile(sh, 90))) if sh else (99.0, 99.0, 0, 99.0)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default='/tmp/rws-hi-cache'); ap.add_argument('--no-download', action='store_true')
    ap.add_argument('--only', default=''); ap.add_argument('--quality', type=int, default=60)
    ap.add_argument('--resave', action='store_true', help='re-encode from cache using boxes in the report (no alignment)')
    a = ap.parse_args()
    os.makedirs(a.cache, exist_ok=True)
    out_dir = os.path.join(ROOT, 'public', 'cards-hi'); os.makedirs(out_dir, exist_ok=True)
    ov_path = os.path.join(ROOT, 'scripts', 'cards-hi-names.json')
    overrides = json.load(open(ov_path)) if os.path.exists(ov_path) else {}
    nm = names(); ids = [i for i in nm if not a.only or i in a.only.split(',')]
    rp = os.path.join(ROOT, 'scripts', 'cards-hi-report.json')
    report = json.load(open(rp)) if os.path.exists(rp) else {}
    if a.resave:
        for cid, v in report.items():
            if v['status'] == 'ok':
                sample(Image.open(os.path.join(a.cache, cid + '.jpg')).convert('RGB'), tuple(v['box']), (700, 1200)).save(
                    os.path.join(out_dir, cid + '.webp'), 'WEBP', quality=a.quality, method=6)
        return
    for cid in ids:
        src = os.path.join(a.cache, cid + '.jpg'); fname = overrides.get(cid, nm[cid])
        if not a.no_download: src, fname = download(cid, nm[cid], a.cache, overrides)
        if not src or not os.path.exists(src):
            report[cid] = dict(status='missing', file=fname); continue
        new = Image.open(src).convert('RGB'); old = Image.open(os.path.join(ROOT, 'public', 'cards', cid + '.webp')).convert('RGB')
        box, cst = align(old, new)
        rmax, rmean, npatch, p90 = residual(old, new, box)
        # p90 (not max): the odd low-contrast patch on the card border gives phase-correlation noise
        ok = cst <= MAX_NCC_COST and p90 <= MAX_SHIFT
        dest = os.path.join(out_dir, cid + '.webp')
        if ok:
            sample(new, box, (700, 1200)).save(dest, 'WEBP', quality=a.quality, method=6)
        elif os.path.exists(dest): os.remove(dest)
        report[cid] = dict(status='ok' if ok else 'mismatch', file=fname, cost=round(cst, 3), shift_max=round(rmax, 2),
                           shift_mean=round(rmean, 2), shift_p90=round(p90, 2), patches=npatch, box=[round(v, 1) for v in box], src=list(new.size))
        print(cid, report[cid]['status'], 'cost %.3f shift max %.2f mean %.2f (%d)' % (cst, rmax, rmean, npatch), flush=True)
    json.dump(report, open(rp, 'w'), indent=1)
    good = sorted(k for k, v in report.items() if v['status'] == 'ok')
    print('HI =', json.dumps(good))
    print('bad:', {k: v['status'] for k, v in report.items() if v['status'] != 'ok'})

main()
