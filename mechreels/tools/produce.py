#!/usr/bin/env python3
"""Make one finished Mechanic reel: voiceover (ElevenLabs) -> word timing -> 720x1280 render -> cover -> caption.

Usage: python3 tools/produce.py reels/<id> [--no-voice] [--workers N] [--end SECONDS]

Output in out/<id>/: <id>.mp4 (9:16, 30 fps, voice + workshop sound effects), cover.jpg, caption.txt, and
<id>_player.html (the interactive player with the voice built in). --no-voice renders a silent cut on estimated timing.
"""
import argparse, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import build  # noqa: E402

ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('--no-voice', action='store_true')
ap.add_argument('--workers', type=int, default=os.cpu_count() or 2); ap.add_argument('--end', type=float)
a = ap.parse_args()
reel = os.path.abspath(a.reel); rid = os.path.basename(reel); out = os.path.join(ROOT, 'out', rid); os.makedirs(out, exist_ok=True)
meta = json.load(open(os.path.join(reel, 'meta.json')))

if not a.no_voice:
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'voice.py'), reel], check=True)
page = build(reel, os.path.join(tempfile.mkdtemp(), 'render.html'))
mp4 = os.path.join(out, rid + '.mp4')
cmd = [sys.executable, os.path.join(ROOT, 'tools', 'render_video.py'), page, mp4, '--workers', str(a.workers)]
if not a.no_voice: cmd += ['--voice', os.path.join(reel, 'voice.mp3')]
if a.end: cmd += ['--end', str(a.end)]
subprocess.run(cmd, check=True)
if not a.no_voice:
    build(reel, os.path.join(out, rid + '_player.html'), voice=True, poster=meta.get('cover_t', 2.0))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(meta.get('cover_t', 2.0)), '-i', mp4, '-frames:v', '1', '-q:v', '2', os.path.join(out, 'cover.jpg')], check=True)
tags = ' '.join('#' + t.lstrip('#') for t in meta.get('hashtags', []))
open(os.path.join(out, 'caption.txt'), 'w').write(f"{meta['title']}\n\n{meta['caption'].strip()}\n\n{tags}\n" + (f"\nSources: {'; '.join(meta['sources'])}\n" if meta.get('sources') else ''))
print('done:', out)
