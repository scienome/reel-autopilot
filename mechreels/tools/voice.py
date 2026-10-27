#!/usr/bin/env python3
"""Make a Mechanic reel's voiceover with ElevenLabs and time every word.

Usage: python3 tools/voice.py reels/<id>            (needs ELEVENLABS_API_KEY)
       python3 tools/voice.py reels/<id> --offline  (reuse reels/<id>/voice_raw.json, no API call)

script.json is [{ "id": beatId, "text": "..." }, ...]. The beats are joined with spaces and sent as ONE request to
the text-to-speech "with-timestamps" endpoint (a reel is well under the per-request limit). Writes:
  reels/<id>/voice.mp3      the take
  reels/<id>/timing.json    { "words": [{ "w", "t", "e", "beat" }, ...], "end": seconds }
  reels/<id>/voice_raw.json the raw API response (kept, so a re-render never pays for the voice twice)
"""
import argparse, base64, difflib, json, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def script_text(script):
    text, words = '', []
    for beat in script:
        if text:
            text += ' '
        for m in re.finditer(r'\S+', beat['text']):
            words.append((beat['id'], m.group(0), len(text) + m.start(), len(text) + m.end()))
        text += beat['text']
    return text, words


def word_times(text, words, al):
    chars, st, en = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    spoken = ''.join(chars)
    idx = list(range(len(text))) if spoken == text else [None] * len(text)
    if spoken != text:
        for a, b, n in difflib.SequenceMatcher(None, text, spoken, autojunk=False).get_matching_blocks():
            for k in range(n):
                idx[a + k] = b + k
    out, prev = [], 0.0
    for beat, w, a, b in words:
        js = [idx[i] for i in range(a, b) if idx[i] is not None]
        t0, t1 = (st[js[0]], en[js[-1]]) if js else (prev, prev + 0.25)
        prev = t1
        out.append({'w': w, 't': round(t0, 3), 'e': round(t1, 3), 'beat': beat})
    return out


def call_api(text, cfg):
    import requests
    key = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('ELEVENLABS_API_KEY is not set')
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}/with-timestamps?output_format=mp3_44100_128"
    body = {'text': text, 'model_id': cfg.get('model_id', 'eleven_multilingual_v2')}
    if cfg.get('voice_settings'):
        body['voice_settings'] = cfg['voice_settings']
    for attempt in range(5):
        r = requests.post(url, headers={'xi-api-key': key, 'Content-Type': 'application/json'}, json=body, timeout=600)
        if r.status_code == 200:
            return r.json()
        print(f'::error::ElevenLabs {r.status_code}: {r.text[:300]}', flush=True)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(20 * (attempt + 1)); continue
        sys.exit(1)
    sys.exit('ElevenLabs kept failing')


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('--offline', action='store_true')
    a = ap.parse_args()
    cfg = json.load(open(os.path.join(ROOT, 'config.json')))['voice']
    script = json.load(open(os.path.join(a.reel, 'script.json')))
    text, wl = script_text(script)
    raw = os.path.join(a.reel, 'voice_raw.json'); tag = cfg['voice_id'] + '/' + cfg.get('model_id', '')
    res = json.load(open(raw)) if os.path.exists(raw) else None
    if not (res and res.get('text') == text and res.get('voice') == tag):
        if a.offline:
            sys.exit('no saved voice matches this script')
        print(f'voicing {len(text)} characters with {tag}')
        res = call_api(text, cfg); res['text'] = text; res['voice'] = tag
        json.dump(res, open(raw, 'w'))
    open(os.path.join(a.reel, 'voice.mp3'), 'wb').write(base64.b64decode(res['audio_base64']))
    al = res.get('alignment') or res.get('normalized_alignment') or sys.exit('no alignment in the response')
    words = word_times(text, wl, al)
    json.dump({'words': words, 'end': words[-1]['e']}, open(os.path.join(a.reel, 'timing.json'), 'w'))
    print(f'{a.reel}: {len(words)} words timed, voice ends at {words[-1]["e"]:.1f}s')
