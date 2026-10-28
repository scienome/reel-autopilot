#!/usr/bin/env python3
"""Make one finished toy reel: voiceover (ElevenLabs, the voice in config.json) -> word timing -> 720x1280 render -> cover -> caption.

Usage: python3 tools/produce.py reels/<id> [--no-voice] [--workers N] [--end SECONDS]

Output in out/<id>/:  <id>.mp4 (9:16, 30 fps, voice + sound effects), cover.jpg (a frame to use as the cover),
caption.txt (title, caption and hashtags to paste). --no-voice renders a silent cut on estimated timing.
"""
import argparse, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import build  # noqa: E402

ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--no-voice', action='store_true')
ap.add_argument('--workers', type=int, default=os.cpu_count() or 2); ap.add_argument('--end', type=float)
a = ap.parse_args()
video = os.path.abspath(a.video); vid = os.path.basename(video); out = os.path.join(ROOT, 'out', vid); os.makedirs(out, exist_ok=True)
meta = json.load(open(os.path.join(video, 'meta.json')))

if not a.no_voice:
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'voice.py'), video], check=True)
page = build(video, os.path.join(tempfile.mkdtemp(), 'render.html'))
mp4 = os.path.join(out, vid + '.mp4')
cmd = [sys.executable, os.path.join(ROOT, 'tools', 'render_video.py'), page, mp4, '--workers', str(a.workers)]
if not a.no_voice: cmd += ['--voice', os.path.join(video, 'voice.mp3')]
if a.end: cmd += ['--end', str(a.end)]
subprocess.run(cmd, check=True)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(meta.get('cover_t', 2.0)), '-i', mp4, '-frames:v', '1', '-q:v', '2', os.path.join(out, 'cover.jpg')], check=True)
tags = ' '.join('#' + t.lstrip('#') for t in meta.get('hashtags', []))
open(os.path.join(out, 'caption.txt'), 'w').write(f"{meta['title']}\n\n{meta['caption'].strip()}\n\n{tags}\n" + (f"\nSources: {'; '.join(meta['sources'])}\n" if meta.get('sources') else ''))
print('done:', out)
