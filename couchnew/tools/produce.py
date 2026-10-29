#!/usr/bin/env python3
"""Make one finished POV reel: voiceover (ElevenLabs, config.json) -> word timing -> ElevenLabs music + sound effects
(audio.json) -> 720x1280 render -> cover -> caption.

Usage: python3 tools/produce.py reels/<id> [--no-voice] [--workers N]

Output in out/<id>/: <id>.mp4, cover.jpg, caption.txt. The voice (voice.mp3, timing.json) and the ElevenLabs pieces
(eleven/) are written into the reel folder so a re-render never pays twice.
"""
import argparse, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from build import build  # noqa: E402

ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('--no-voice', action='store_true')
ap.add_argument('--workers', type=int, default=os.cpu_count() or 2)
a = ap.parse_args()
reel = os.path.abspath(a.reel); rid = os.path.basename(reel); out = os.path.join(ROOT, 'out', rid); os.makedirs(out, exist_ok=True)
meta = json.load(open(os.path.join(reel, 'meta.json')))
voice = os.path.join(reel, 'voice.mp3')
if not a.no_voice and not (os.path.exists(voice) and os.path.exists(os.path.join(reel, 'timing.json'))):
    dialogue = any('who' in b for b in json.load(open(os.path.join(reel, 'script.json'))))  # one voice per character
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'dialogue_voice.py' if dialogue else 'voice.py'), reel], check=True)
page = build(reel, os.path.join(tempfile.mkdtemp(), 'render.html'))
mp4 = os.path.join(out, rid + '.mp4')
cmd = [sys.executable, os.path.join(ROOT, 'tools', 'render_reel.py'), page, mp4, '--workers', str(a.workers)]
if not a.no_voice:
    cmd += ['--voice', voice]
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'eleven_audio.py'), reel, out], check=True)
    if os.path.exists(os.path.join(out, 'music.mp3')):
        cmd += ['--music', os.path.join(out, 'music.mp3'), '--music-gain', str(json.load(open(os.path.join(out, 'music.json')))['gain'])]
    if os.path.exists(os.path.join(out, 'sfx_bed.wav')):
        cmd += ['--sfx', os.path.join(out, 'sfx_bed.wav')]
subprocess.run(cmd, check=True)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(meta.get('cover_t', 2.0)), '-i', mp4, '-frames:v', '1', '-q:v', '2', os.path.join(out, 'cover.jpg')], check=True)
tags = ' '.join('#' + t.lstrip('#') for t in meta.get('hashtags', []))
open(os.path.join(out, 'caption.txt'), 'w').write(f"{meta['title']}\n\n{meta['caption'].strip()}\n\n{tags}\n")
print('done:', out)
