#!/usr/bin/env python3
"""Assemble one POV reel into a self-contained HTML page (engine: the repo's style/ Violet Room kit, read-only).

Usage: python3 tools/build.py reels/<id> OUT.html [--voice] [--poster SECONDS]

The page = style/player_body.html + harness.js + sound.js + the engine, where the engine is
style/violet_base.js + style/kit_timing.js + style/kit_props.js + style/kit_couch.js + reels/<id>/story.js (+ the closing brace).
reels/<id>/script.json becomes window.SCRIPT; reels/<id>/timing.json (if present) becomes window.WORD_TIMES.
--voice embeds reels/<id>/voice.mp3 so the player has the voiceover built in. Leave it off for the render page.
"""
import argparse, base64, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLE = os.path.join(os.path.dirname(ROOT), 'style')  # the shared Violet Room engine at the repo root


def read(*p):
    return open(os.path.join(*p), encoding='utf-8').read()


def engine_js(reel):
    meta = json.load(open(os.path.join(reel, 'meta.json'))) if os.path.exists(os.path.join(reel, 'meta.json')) else {}
    pre = 'window.SCRIPT = ' + json.dumps(json.load(open(os.path.join(reel, 'script.json')))) + ';\n'
    tp = os.path.join(reel, 'timing.json')
    if os.path.exists(tp):
        tm = json.load(open(tp))
        pre += 'window.WORD_TIMES = ' + json.dumps(tm['words']) + ';\nwindow.VOICE_END = ' + json.dumps(tm.get('end', 0)) + ';\n'
    else:
        pre += 'window.WORD_TIMES = null;\n'
    eng = read(STYLE, 'violet_base.js') + read(STYLE, 'kit_timing.js') + read(STYLE, 'kit_props.js') + read(STYLE, 'kit_couch.js') + read(reel, 'story.js') + '\n}\n'
    return pre + eng, meta


def build(reel, out, voice=False, poster=None):
    eng, meta = engine_js(reel)
    title = meta.get('title', os.path.basename(reel.rstrip('/')))
    body = read(STYLE, 'player_body.html').replace('__TITLE__', title)
    js = '\n'.join([read(STYLE, 'harness.js'), read(STYLE, 'sound.js'), eng])
    if poster is not None:
        js += f'\nwindow.POSTER_T = {poster};'
    if voice:
        vp = os.path.join(reel, 'voice.mp3')
        js += '\nwindow.VO_DEFAULT = ' + json.dumps('data:audio/mpeg;base64,' + base64.b64encode(open(vp, 'rb').read()).decode()) + ';'
    assert '/*__LIBS__*/' in body
    open(out, 'w', encoding='utf-8').write(body.replace('/*__LIBS__*/', js))
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('reel'); ap.add_argument('out'); ap.add_argument('--voice', action='store_true'); ap.add_argument('--poster', type=float)
    a = ap.parse_args()
    print('wrote', build(a.reel, a.out, a.voice, a.poster))
