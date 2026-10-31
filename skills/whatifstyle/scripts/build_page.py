#!/usr/bin/env python3
"""Assemble a self-contained HTML page: a body template with /*__LIBS__*/ replaced by the given JS files.

Usage: python3 build_page.py BODY.html OUT.html lib1.js lib2.js ... [--voice voice.mp3] [--title "Name"] [--poster 4.5]

--voice embeds the audio as window.VO_DEFAULT (the player loads it as the built-in voiceover).
Build one page with --voice for the artifact and one without it for frame-by-frame rendering.
"""
import argparse, base64, json, os
ap = argparse.ArgumentParser(); ap.add_argument('body'); ap.add_argument('out'); ap.add_argument('libs', nargs='+')
ap.add_argument('--voice'); ap.add_argument('--title', default='What If Reel'); ap.add_argument('--poster', type=float)
a = ap.parse_args()
b = open(a.body, encoding='utf-8').read().replace('__TITLE__', a.title)
# the font travels inside the page, so every browser and renderer shows the same captions
font = base64.b64encode(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'Montserrat.ttf'), 'rb').read()).decode()
b = b.replace('</head>', '<style>@font-face{font-family:Montserrat;font-weight:100 900;src:url(data:font/ttf;base64,' + font + ')}</style></head>', 1)
js = '\n'.join(open(f, encoding='utf-8').read() for f in a.libs)
if a.poster is not None: js += f'\nwindow.POSTER_T = {a.poster};'
if a.voice:
    mime = 'audio/mpeg' if a.voice.lower().endswith('.mp3') else 'audio/wav' if a.voice.lower().endswith('.wav') else 'audio/mp4'
    js += '\nwindow.VO_DEFAULT = ' + json.dumps(f'data:{mime};base64,' + base64.b64encode(open(a.voice, 'rb').read()).decode()) + ';'
assert '/*__LIBS__*/' in b, 'body template needs a /*__LIBS__*/ marker inside a <script>'
open(a.out, 'w', encoding='utf-8').write(b.replace('/*__LIBS__*/', js))
print('wrote', a.out)
