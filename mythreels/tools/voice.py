#!/usr/bin/env python3
"""Generate a reel's voiceover with ElevenLabs and measure every word's timing.

Usage: python3 tools/voice.py reels/<id>          (needs ELEVENLABS_API_KEY in the environment)
       python3 tools/voice.py reels/<id> --alignment saved.json   (offline: reuse a saved API response)

Reads reels/<id>/script.json and config.json (voice_id, model_id, voice_settings). Writes:
  reels/<id>/voice.mp3     the take
  reels/<id>/timing.json   { "words": { beatId: [[start, end], ...] }, "end": seconds } from the character alignment
The script's phrases are joined with spaces and sent as one take, so pauses come from the punctuation.
"""
import argparse, base64, difflib, json, os, re, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def script_text(script):
    """The full text sent to the voice, plus each word's (beatId, char start, char end) in order."""
    text, words = '', []
    for beat in script:
        for ph in beat['phrases']:
            if text:
                text += ' '
            for m in re.finditer(r'\S+', ph):
                words.append((beat['id'], len(text) + m.start(), len(text) + m.end()))
            text += ph
    return text, words


def word_times(text, words, al):
    chars, st, en = al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']
    spoken = ''.join(chars)
    # map each input character to an aligned character (identical in the normal case; difflib covers small differences)
    idx = [None] * len(text)
    if spoken == text:
        idx = list(range(len(text)))
    else:
        for a, b, n in difflib.SequenceMatcher(None, text, spoken, autojunk=False).get_matching_blocks():
            for k in range(n):
                idx[a + k] = b + k
    out, prev_end = {}, 0.0
    for beat, a, b in words:
        js = [idx[i] for i in range(a, b) if idx[i] is not None]
        if js:
            t0, t1 = st[js[0]], en[js[-1]]
        else:  # unmatched word: place it right after the previous one
            t0, t1 = prev_end, prev_end + 0.25
        prev_end = t1
        out.setdefault(beat, []).append([round(t0, 3), round(t1, 3)])
    return out, round(max(en) if en else prev_end, 3)


def call_api(text, cfg):
    import requests
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        sys.exit('ELEVENLABS_API_KEY is not set')
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}/with-timestamps?output_format=mp3_44100_128"
    body = {'text': text, 'model_id': cfg.get('model_id', 'eleven_multilingual_v2')}
    if cfg.get('voice_settings'):
        body['voice_settings'] = cfg['voice_settings']
    for attempt in range(4):
        r = requests.post(url, headers={'xi-api-key': key, 'Content-Type': 'application/json'}, json=body, timeout=300)
        if r.status_code == 200:
            return r.json()
        print(f'ElevenLabs {r.status_code}: {r.text[:300]}', file=sys.stderr)
        if r.status_code in (429, 500, 502, 503):
            time.sleep(20 * (attempt + 1)); continue
        sys.exit(1)
    sys.exit('ElevenLabs kept failing')


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('--alignment')
    a = ap.parse_args()
    cfg = json.load(open(os.path.join(ROOT, 'config.json')))['voice']
    script = json.load(open(os.path.join(a.reel, 'script.json')))
    text, words = script_text(script)
    res = json.load(open(a.alignment)) if a.alignment else call_api(text, cfg)
    if res.get('audio_base64'):
        open(os.path.join(a.reel, 'voice.mp3'), 'wb').write(base64.b64decode(res['audio_base64']))
    al = res.get('alignment') or res.get('normalized_alignment')
    if not al:
        sys.exit('the response had no alignment')
    wt, end = word_times(text, words, al)
    json.dump({'words': wt, 'end': end}, open(os.path.join(a.reel, 'timing.json'), 'w'))
    if not a.alignment:
        json.dump({'alignment': al}, open(os.path.join(a.reel, 'alignment.json'), 'w'))
    print(f'{a.reel}: {len(words)} words timed, voice ends at {end}s')
