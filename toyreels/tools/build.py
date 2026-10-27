#!/usr/bin/env python3
"""Assemble one video into a self-contained HTML page (the player, or a bare page for rendering).

Usage: python3 tools/build.py reels/<id> OUT.html [--voice] [--poster SECONDS]

engine = style/bricktoy_base.js + style/kit.js + style/props.js + reels/<id>/story.js + the closing brace.
reels/<id>/script.json -> window.SCRIPT; reels/<id>/timing.json (if present) -> window.WORD_TIMES / VOICE_END.
--voice embeds reels/<id>/voice.mp3 in the player (big: only for previews you open in a browser).
"""
import argparse, base64, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLE = os.path.join(ROOT, 'style')


def read(*p):
    return open(os.path.join(*p), encoding='utf-8').read()


def engine_js(video):
    pre = 'window.SCRIPT = ' + json.dumps(json.load(open(os.path.join(video, 'script.json')))) + ';\n'
    tp = os.path.join(video, 'timing.json')
    if os.path.exists(tp):
        tm = json.load(open(tp))
        pre += 'window.WORD_TIMES = ' + json.dumps(tm['words']) + ';\nwindow.VOICE_END = ' + json.dumps(tm.get('end', 0)) + ';\n'
    else:
        pre += 'window.WORD_TIMES = null;\n'
    return pre + read(STYLE, 'bricktoy_base.js') + read(STYLE, 'kit.js') + read(STYLE, 'props.js') + read(video, 'story.js') + '\n}\n'


def libs(video):
    return '\n'.join([read(STYLE, 'harness.js'), read(STYLE, 'sound.js'), engine_js(video)])


def build(video, out, voice=False, poster=None):
    meta = json.load(open(os.path.join(video, 'meta.json'))) if os.path.exists(os.path.join(video, 'meta.json')) else {}
    body = read(STYLE, 'player_body.html').replace('__TITLE__', meta.get('title', os.path.basename(video.rstrip('/'))))
    js = libs(video)
    if poster is not None:
        js += f'\nwindow.POSTER_T = {poster};'
    if voice:
        js += '\nwindow.VO_DEFAULT = ' + json.dumps('data:audio/mpeg;base64,' + base64.b64encode(open(os.path.join(video, 'voice.mp3'), 'rb').read()).decode()) + ';'
    open(out, 'w', encoding='utf-8').write(body.replace('/*__LIBS__*/', js))
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('out'); ap.add_argument('--voice', action='store_true'); ap.add_argument('--poster', type=float)
    a = ap.parse_args()
    print('wrote', build(a.video, a.out, a.voice, a.poster))
