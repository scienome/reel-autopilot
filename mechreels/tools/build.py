#!/usr/bin/env python3
"""Assemble one Mechanic reel into a self-contained HTML page (the player, or a bare page for rendering).

Usage: python3 tools/build.py reels/<id> OUT.html [--voice] [--poster SECONDS]

engine = style/mech_base.js + reels/<id>/story.js + the closing brace.
script.json -> window.SCRIPT; timing.json (if present) -> window.WORD_TIMES / VOICE_END (else estimated timing).
--voice embeds reels/<id>/voice.mp3 in the player (big: only for previews you open in a browser).
"""
import argparse, base64, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
STYLE = os.path.join(ROOT, 'style')


def read(*p):
    return open(os.path.join(*p), encoding='utf-8').read()


def engine_js(reel):
    pre = 'window.SCRIPT = ' + json.dumps(json.load(open(os.path.join(reel, 'script.json')))) + ';\n'
    tp = os.path.join(reel, 'timing.json')
    if os.path.exists(tp):
        tm = json.load(open(tp))
        pre += 'window.WORD_TIMES = ' + json.dumps(tm['words']) + ';\nwindow.VOICE_END = ' + json.dumps(tm.get('end', 0)) + ';\n'
    else:
        pre += 'window.WORD_TIMES = null;\n'
    mp = os.path.join(reel, 'meta.json')
    shared = ''.join(read(REPO, l) + '\n' for l in (json.load(open(mp)).get('libs', []) if os.path.exists(mp) else []))
    return pre + read(STYLE, 'mech_base.js') + '\n' + shared + read(reel, 'story.js') + '\n}\n'


def libs(reel):
    return '\n'.join([read(STYLE, 'harness.js'), read(STYLE, 'sound.js'), engine_js(reel)])


def build(reel, out, voice=False, poster=None):
    meta = json.load(open(os.path.join(reel, 'meta.json'))) if os.path.exists(os.path.join(reel, 'meta.json')) else {}
    body = read(STYLE, 'player_body.html').replace('__TITLE__', meta.get('title', os.path.basename(reel.rstrip('/'))))
    js = libs(reel)
    if poster is not None:
        js += f'\nwindow.POSTER_T = {poster};'
    if voice:
        js += '\nwindow.VO_DEFAULT = ' + json.dumps('data:audio/mpeg;base64,' + base64.b64encode(open(os.path.join(reel, 'voice.mp3'), 'rb').read()).decode()) + ';'
    open(out, 'w', encoding='utf-8').write(body.replace('/*__LIBS__*/', js))
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('out'); ap.add_argument('--voice', action='store_true'); ap.add_argument('--poster', type=float)
    a = ap.parse_args()
    print('wrote', build(a.reel, a.out, a.voice, a.poster))
