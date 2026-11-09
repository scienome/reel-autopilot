#!/usr/bin/env python3
"""Voice and render one 3D toy reel (toyreels/reels/<id>/ with reel.js and a line-by-line script.json):
python3 tools/toy3d_make.py <id> [--voice-only]. Same engine and voice takes as tools/diorama_make.py, with the toy voice from
toyreels/config.json (a reel's own voice.json wins). Writes out/<id>/<id>.mp4, cover.jpg and caption.txt. It never posts.
"""
import json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import diorama_make as dm

dm.HOME = os.path.join(dm.ROOT, 'toyreels')
rid = sys.argv[1]
dm.main(rid)
if '--voice-only' not in sys.argv:
    out, meta = os.path.join(dm.ROOT, 'out', rid), json.load(open(os.path.join(dm.HOME, 'reels', rid, 'meta.json'), encoding='utf-8'))
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(meta.get('cover_t', 3)), '-i', os.path.join(out, rid + '.mp4'), '-frames:v', '1', '-q:v', '3', os.path.join(out, 'cover.jpg')], check=True)
    tags = ' '.join('#' + h for h in meta.get('hashtags', []))
    open(os.path.join(out, 'caption.txt'), 'w', encoding='utf-8').write(f"{meta['title']}\n\n{meta['caption']}\n\n{tags}\n")
