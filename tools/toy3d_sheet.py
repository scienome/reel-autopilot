#!/usr/bin/env python3
"""Contact sheet for a 3D toy reel, before it is voiced: python3 tools/toy3d_sheet.py <id> [t ...]
Writes out/<id>/sheet.png. Uses out/<id>/timing.js if the voice exists, otherwise estimates line times from the text
(about 15.5 characters a second, the same gaps as the real voice). Needs playwright, ffmpeg and three.js: if
dioramareels/kit/references/three.min.js is missing (the CDN is blocked in cloud sessions) it is fetched from GitHub
with a sparse git clone of mrdoob/three.js r149. The fetched copy is not committed (.gitignore)."""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rid, times = sys.argv[1], sys.argv[2:]
HOMEDIR = 'dioramareels' if os.path.isdir(os.path.join(ROOT, 'dioramareels', 'reels', rid)) and not os.path.isdir(os.path.join(ROOT, 'toyreels', 'reels', rid)) else 'toyreels'  # Elites Endgame reels live in dioramareels/
reel, out = os.path.join(ROOT, HOMEDIR, 'reels', rid), os.path.join(ROOT, 'out', rid)
os.makedirs(out, exist_ok=True)
three = os.path.join(ROOT, 'dioramareels', 'kit', 'references', 'three.min.js')
if not os.path.exists(three):
    tmp = '/tmp/three-r149'
    if not os.path.exists(os.path.join(tmp, 'build', 'three.min.js')):
        subprocess.run(['git', 'clone', '-q', '--depth', '1', '--branch', 'r149', '--filter=blob:none', '--sparse', 'https://github.com/mrdoob/three.js', tmp], check=True)
        subprocess.run(['git', '-C', tmp, 'sparse-checkout', 'set', 'build'], check=True)
    open(three, 'wb').write(open(os.path.join(tmp, 'build', 'three.min.js'), 'rb').read())
timing = os.path.join(out, 'timing.js')
if not os.path.exists(timing):
    L = json.load(open(os.path.join(reel, 'script.json'), encoding='utf-8'))['lines']
    t, last, lines, shots = 0.25, None, [], {}
    for ln in L:
        if last is not None:
            t += 0.42 if ln['shot'] != last else 0.2
        d = max(0.7, len(ln['say']) / 15.5)
        lines.append({'shot': ln['shot'], 'cap': ln['cap'], 't0': round(t, 3), 't1': round(t + d, 3)})
        shots.setdefault(ln['shot'], round(max(0, t - 0.25), 3))
        t += d
        last = ln['shot']
    timing = os.path.join(out, 'timing_estimate.js')
    open(timing, 'w').write('window.TIMING = ' + json.dumps({'lines': lines, 'shots': shots, 'duration': round(t + 1.8, 2)}) + ';\n')
    print(f'estimated timing ({round(t + 1.8, 1)} s): {shots}')
if not times:
    tm = json.loads(open(timing).read().split('=', 1)[1].rstrip().rstrip(';'))
    order = sorted(tm['shots'].items(), key=lambda x: x[1])
    times = []
    for i, (n, s) in enumerate(order):
        e = order[i + 1][1] if i + 1 < len(order) else tm['duration']
        times += [round(s + (e - s) * 0.35, 2), round(s + (e - s) * 0.85, 2)]
sheet = os.path.join(out, 'sheet.png')
subprocess.run([sys.executable, '-I', os.path.join(ROOT, 'dioramareels', 'kit', 'scripts', 'render.py'), 'sheet', os.path.join(reel, 'reel.js'), sheet, *map(str, times), '--timing', timing], check=True)
print('wrote', sheet)
