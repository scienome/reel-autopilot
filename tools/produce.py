#!/usr/bin/env python3
"""Make every reel that has no video yet: voiceover (ElevenLabs), timing, render, preview strip.

Usage: python3 tools/produce.py [reels/<id> ...] [--workers 4] [--no-voice]

For each reel folder without out/<id>.mp4:
  1. voice.mp3 + timing.json via tools/voice.py (skipped when both already exist, or with --no-voice)
  2. render out/<id>.mp4 (frames + effects + voice) via tools/render_reel.py
  3. out/<id>.jpg, a strip of 6 frames for quick review in the pull request
"""
import argparse, glob, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import build  # noqa: E402

ap = argparse.ArgumentParser(); ap.add_argument('reels', nargs='*'); ap.add_argument('--workers', type=int, default=4); ap.add_argument('--no-voice', action='store_true')
a = ap.parse_args()
reels = a.reels or sorted(glob.glob(os.path.join(ROOT, 'reels', '*')))
os.makedirs(os.path.join(ROOT, 'out'), exist_ok=True)
made, failed = [], []
for reel in reels:
    reel = os.path.abspath(reel); rid = os.path.basename(reel); mp4 = os.path.join(ROOT, 'out', rid + '.mp4')
    if os.path.exists(mp4) or not os.path.exists(os.path.join(reel, 'story.js')):
        continue
    try:
        voice = os.path.join(reel, 'voice.mp3')
        if not a.no_voice and not (os.path.exists(voice) and os.path.exists(os.path.join(reel, 'timing.json'))):
            subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'voice.py'), reel], check=True)
        page = build(reel, os.path.join(tempfile.mkdtemp(), 'render.html'))
        cmd = [sys.executable, os.path.join(ROOT, 'tools', 'render_reel.py'), page, mp4, '--workers', str(a.workers)]
        if os.path.exists(voice):
            cmd += ['--voice', voice]
        subprocess.run(cmd, check=True)
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], capture_output=True, text=True).stdout)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp4, '-vf', f'fps=6/{dur:.2f},scale=180:-1,tile=6x1', '-frames:v', '1', os.path.join(ROOT, 'out', rid + '.jpg')], check=True)
        made.append(rid); print('made', rid)
    except subprocess.CalledProcessError as e:
        failed.append(rid); print('FAILED', rid, e, file=sys.stderr)
print(json.dumps({'made': made, 'failed': failed}))
sys.exit(1 if failed else 0)
