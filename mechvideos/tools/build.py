#!/usr/bin/env python3
"""Assemble one Mechanic YouTube video into a self-contained HTML page (the player, or a bare page for rendering).

Usage: python3 tools/build.py videos/<id> OUT.html [--voice] [--poster SECONDS]

engine = style/mech_base.js + any shared prop files listed in meta.json "libs" (paths from the repo root)
         + videos/<id>/story.js + the closing brace.
script.json -> window.SCRIPT; timing.json (if present) -> window.WORD_TIMES / VOICE_END (else estimated timing).
"""
import argparse, base64, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
STYLE = os.path.join(ROOT, 'style')


def read(*p):
    return open(os.path.join(*p), encoding='utf-8').read()


def meta_of(video):
    p = os.path.join(video, 'meta.json')
    return json.load(open(p)) if os.path.exists(p) else {}


def engine_js(video):
    pre = 'window.SCRIPT = ' + json.dumps(json.load(open(os.path.join(video, 'script.json')))) + ';\n'
    pre += 'window.CAPTION_STYLE = { px: 84, y: 0.84 };\n'
    tp = os.path.join(video, 'timing.json')
    if os.path.exists(tp):
        tm = json.load(open(tp))
        pre += 'window.WORD_TIMES = ' + json.dumps(tm['words']) + ';\nwindow.VOICE_END = ' + json.dumps(tm.get('end', 0)) + ';\n'
    else:
        pre += 'window.WORD_TIMES = null;\n'
    shared = ''.join(read(REPO, l) + '\n' for l in meta_of(video).get('libs', []))
    return pre + read(STYLE, 'mech_base.js') + '\n' + shared + read(video, 'story.js') + '\n}\n'


def libs(video):
    return '\n'.join([read(STYLE, 'harness.js'), read(STYLE, 'sound.js'), engine_js(video)])


def build(video, out, voice=False, poster=None):
    body = read(STYLE, 'player_body.html').replace('__TITLE__', meta_of(video).get('title', os.path.basename(video.rstrip('/'))))
    body = body.replace('const W0 = 720, H0 = 1280; // vertical 9:16 reel', 'const W0 = 1920, H0 = 1080; // 16:9 video').replace('width="720" height="1280"', 'width="1920" height="1080"')
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
