#!/usr/bin/env python3
"""Voice a multi-character reel: every beat is one line by one character (script.json beat "who"), voiced with that
character's ElevenLabs voice (config.json "cast"), then joined into one track with a short gap between lines.

Usage: python3 tools/dialogue_voice.py reels/<id>            (needs ELEVENLABS_API_KEY for lines not voiced yet)

Writes reels/<id>/voice.mp3 and reels/<id>/timing.json ({ "words": { beatId: [[t0, t1], ...] }, "end" }), the same
timing format as tools/voice.py. Each line's API response is kept in reels/<id>/voice_lines/<beatId>.json, keyed by
its text and voice, so changing one line re-voices only that line.
"""
import base64, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from voice import script_text, word_times  # noqa: E402

GAP = 0.06  # seconds between two lines: the dialogue snaps (the owner found 0.28 s too slow)


def speak(text, vcfg):
    """call_api, but if the model rejects the expressive settings, fall back to the voice's defaults (a warning)."""
    import requests, time
    key = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('ELEVENLABS_API_KEY is not set')
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{vcfg['voice_id']}/with-timestamps?output_format=mp3_44100_128"
    body = {'text': text, 'model_id': vcfg.get('model_id', 'eleven_multilingual_v2')}
    if vcfg.get('voice_settings'):
        body['voice_settings'] = vcfg['voice_settings']
    for attempt in range(5):
        r = requests.post(url, headers={'xi-api-key': key, 'Content-Type': 'application/json'}, json=body, timeout=300)
        if r.status_code == 200:
            return r.json()
        print(f'ElevenLabs {r.status_code}: {r.text[:300]}', file=sys.stderr, flush=True)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(20 * (attempt + 1)); continue
        if 'voice_settings' in body:
            print('::warning::voice settings rejected; using the voice defaults for this line', flush=True); body.pop('voice_settings'); continue
        sys.exit(1)
    sys.exit('ElevenLabs kept failing')


def is_cartesia(vid):
    return isinstance(vid, str) and vid.count('-') == 4 and len(vid) == 36  # Cartesia voice ids are UUIDs; ElevenLabs ids are 20 letters


def speak_cartesia(text, vcfg):
    """Cartesia over SSE with word timestamps, returned in the same shape as an ElevenLabs with-timestamps response."""
    import requests
    key = os.environ.get('CARTESIA_API_KEY')
    if not key:
        env = os.path.join(os.path.dirname(ROOT), '.env')
        if os.path.exists(env):
            for ln in open(env):
                k, _, v = ln.strip().partition('=')
                if k == 'CARTESIA_API_KEY': key = v.strip().strip('"\'')
    if not key:
        sys.exit('CARTESIA_API_KEY is not set')
    body = {'model_id': vcfg.get('cartesia_model', 'sonic-3.6-2026-08-27'), 'transcript': text, 'voice': {'mode': 'id', 'id': vcfg['voice_id']}, 'language': vcfg.get('language', 'hi'),
            'output_format': {'container': 'raw', 'encoding': 'pcm_s16le', 'sample_rate': 44100}, 'add_timestamps': True}
    for attempt in range(4):
        r = requests.post('https://api.cartesia.ai/tts/sse', headers={'X-API-Key': key, 'Cartesia-Version': '2026-08-14', 'Content-Type': 'application/json'}, json=body, stream=True, timeout=180)
        if r.status_code == 200: break
        print(f'Cartesia {r.status_code}: {r.text[:300]}', file=sys.stderr, flush=True); import time; time.sleep(5 * (attempt + 1))
    else:
        sys.exit('Cartesia failed')
    pcm, W = b'', []
    for ln in r.iter_lines():
        if not ln or not ln.startswith(b'data:'): continue
        d = json.loads(ln[5:])
        if d.get('type') == 'chunk': pcm += base64.b64decode(d['data'])
        elif d.get('type') == 'timestamps': w = d['word_timestamps']; W += list(zip(w['words'], w['start'], w['end']))
    d = tempfile.mkdtemp(); raw = os.path.join(d, 'a.raw'); mp3 = os.path.join(d, 'a.mp3'); open(raw, 'wb').write(pcm)
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', '44100', '-ac', '1', '-i', raw, '-b:a', '128k', mp3], check=True)
    st, en = [0.0] * len(text), [0.0] * len(text); cur, last = 0, 0.0
    for w, a, b in W:
        k = text.find(w, cur)
        if k < 0: k = text.find(w.strip('.,!?।'), cur)
        if k < 0: continue
        for i in range(cur, k): st[i] = en[i] = last
        for i in range(k, k + len(w)): st[i], en[i] = float(a), float(b)
        cur, last = k + len(w), float(b)
    for i in range(cur, len(text)): st[i] = en[i] = last
    return {'audio_base64': base64.b64encode(open(mp3, 'rb').read()).decode(), 'alignment': {'characters': list(text), 'character_start_times_seconds': st, 'character_end_times_seconds': en}}


def main(reel):
    cfg = json.load(open(os.path.join(ROOT, 'config.json')))
    base, cast = cfg['voice'], cfg.get('cast', {})
    script = json.load(open(os.path.join(reel, 'script.json')))
    ldir = os.path.join(reel, 'voice_lines'); os.makedirs(ldir, exist_ok=True)
    tmp = tempfile.mkdtemp(); parts, words, t = [], {}, 0.0
    for beat in script:
        who = beat.get('who', 'narrator'); vcfg = dict(base, voice_id=cast.get(who, base['voice_id']), voice_settings=cfg.get('cast_settings', {}).get(who) or base.get('voice_settings'))
        text, wl = script_text([beat]); tag = vcfg['voice_id'] + '/' + vcfg.get('model_id', '') + '/' + json.dumps(vcfg.get('voice_settings'), sort_keys=True)
        cache = os.path.join(ldir, beat['id'] + '.json')
        res = json.load(open(cache)) if os.path.exists(cache) else None
        if not (res and res.get('text') == text and res.get('voice') == tag):
            print(f'voicing {beat["id"]} ({who}): {text}', flush=True)
            res = (speak_cartesia if is_cartesia(vcfg['voice_id']) else speak)(text, vcfg); res['text'] = text; res['voice'] = tag; json.dump(res, open(cache, 'w'))
        mp3 = os.path.join(tmp, beat['id'] + '.mp3'); open(mp3, 'wb').write(base64.b64decode(res['audio_base64']))
        wav = os.path.join(tmp, f'{len(parts):03d}.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-af', f'apad=pad_dur={GAP}', '-ar', '44100', '-ac', '1', wav], check=True)
        al = res.get('alignment') or res.get('normalized_alignment') or sys.exit(f'no alignment for {beat["id"]}')
        wt, _ = word_times(text, wl, al)
        words[beat['id']] = [[round(a + t, 3), round(b + t, 3)] for a, b in wt[beat['id']]]
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], capture_output=True, text=True).stdout)
        parts.append(wav); t += dur
    lst = os.path.join(tmp, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-b:a', '128k', os.path.join(reel, 'voice.mp3')], check=True)
    end = max(b for v in words.values() for _a, b in v)
    json.dump({'words': words, 'end': round(end, 3)}, open(os.path.join(reel, 'timing.json'), 'w'))
    print(f'{reel}: {len(script)} lines, voice ends at {end:.1f}s')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(os.path.abspath(sys.argv[1]))
