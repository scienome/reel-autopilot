#!/usr/bin/env python3
"""Measure where a voiceover is actually speaking.

Usage: python3 voice_segments.py voice.mp3 [--gap 0.12] [--floor 38] [--dips START END]

Prints speech segments (start-end, plus the pause before each) from the loudness envelope, so a known script can be
mapped onto the audio phrase by phrase. --dips lists the deep quiet points inside one stretch, for splitting a long
segment at a word boundary. Needs ffmpeg and numpy; no speech recognition required.
"""
import argparse, subprocess, wave, os, tempfile
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('audio'); ap.add_argument('--gap', type=float, default=0.12, help='merge pauses shorter than this (s)')
ap.add_argument('--floor', type=float, default=38, help='speech = louder than (peak - floor) dB')
ap.add_argument('--dips', nargs=2, type=float, metavar=('START', 'END'))
a = ap.parse_args()
tmp = os.path.join(tempfile.mkdtemp(), 'v16.wav')
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', a.audio, '-ac', '1', '-ar', '16000', tmp], check=True)
w = wave.open(tmp); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
hop = 160; n = len(x) // hop
e = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1)); db = 20 * np.log10(e + 1e-9); mx = db.max()
print(f'duration {len(x) / 16000:.2f}s  peak {mx:.1f} dB')
if a.dips:
    s0, s1 = int(a.dips[0] * 100), int(a.dips[1] * 100); seg = np.convolve(db[s0:s1], np.ones(5) / 5, 'same')
    for i in range(3, len(seg) - 3):
        if seg[i] == seg[i - 3:i + 4].min() and seg[i] - mx < -26: print(f'dip {a.dips[0] + i / 100:.2f}s  {seg[i] - mx:.1f} dB')
    raise SystemExit
sp = db > mx - a.floor; segs = []; i = 0
while i < n:
    if sp[i]:
        j = i
        while j < n and sp[j]: j += 1
        segs.append([i / 100, j / 100]); i = j
    else: i += 1
m = [segs[0]]
for s, t in segs[1:]:
    if s - m[-1][1] < a.gap: m[-1][1] = t
    else: m.append([s, t])
m = [s for s in m if s[1] - s[0] > 0.06]
print(f'{len(m)} speech segments (start-end, pause before):')
for k, (s, t) in enumerate(m): print(f'  {k + 1:2d}  {s:6.2f}-{t:6.2f}  ({s - m[k - 1][1] if k else 0:.2f})')
