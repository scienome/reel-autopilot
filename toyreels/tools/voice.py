#!/usr/bin/env python3
"""Make a video's voiceover with ElevenLabs, one chapter at a time, and time every word.

Usage: python3 tools/voice.py videos/<id>            (needs ELEVENLABS_API_KEY)
       python3 tools/voice.py videos/<id> --offline  (reuse videos/<id>/voice_chunks/*.json, no API calls)

Each chapter is one request to the text-to-speech "with-timestamps" endpoint (long scripts stay under the per-request
limit), with the neighbouring chapters passed as previous_text / next_text so the delivery flows across the joins.
The chapters are joined with a short pause. Writes:
  videos/<id>/voice.mp3     the full take
  videos/<id>/timing.json   { "words": { beatId: [[start, end], ...] }, "end": seconds, "chapters": [{title, t}] }
  videos/<id>/voice_chunks/ the raw API responses (kept, so a re-render never pays for the voice twice)
"""
import argparse, base64, difflib, json, os, re, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP = 0.6  # seconds between chapters (style/kit.js CHAPTER_GAP matches this for estimated timing)


def chapter_text(ch):
    text, words = '', []
    for beat in ch['beats']:
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
    idx = list(range(len(text))) if spoken == text else [None] * len(text)
    if spoken != text:
        for a, b, n in difflib.SequenceMatcher(None, text, spoken, autojunk=False).get_matching_blocks():
            for k in range(n):
                idx[a + k] = b + k
    out, prev = [], 0.0
    for beat, a, b in words:
        js = [idx[i] for i in range(a, b) if idx[i] is not None]
        t0, t1 = (st[js[0]], en[js[-1]]) if js else (prev, prev + 0.25)
        prev = t1; out.append((beat, round(t0, 3), round(t1, 3)))
    return out


def call_api(text, prev_text, next_text, cfg):
    import requests
    key = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('ELEVENLABS_API_KEY is not set')
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}/with-timestamps?output_format=mp3_44100_128"
    body = {'text': text, 'model_id': cfg.get('model_id', 'eleven_multilingual_v2')}
    if prev_text: body['previous_text'] = prev_text
    if next_text: body['next_text'] = next_text
    if cfg.get('voice_settings'): body['voice_settings'] = cfg['voice_settings']
    for attempt in range(5):
        r = requests.post(url, headers={'xi-api-key': key, 'Content-Type': 'application/json'}, json=body, timeout=600)
        if r.status_code == 200:
            return r.json()
        print(f'::error::ElevenLabs {r.status_code}: {r.text[:300]}', flush=True)
        if r.status_code == 422 and ('previous_text' in body or 'next_text' in body):  # a model that refuses context: retry without it
            body.pop('previous_text', None); body.pop('next_text', None); continue
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(20 * (attempt + 1)); continue
        sys.exit(1)
    sys.exit('ElevenLabs kept failing')


def dur(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('video'); ap.add_argument('--offline', action='store_true')
    a = ap.parse_args()
    cfg = json.load(open(os.path.join(ROOT, 'config.json')))['voice']
    script = json.load(open(os.path.join(a.video, 'script.json')))
    cdir = os.path.join(a.video, 'voice_chunks'); os.makedirs(cdir, exist_ok=True)
    tmp = tempfile.mkdtemp(); parts, words, chapters, offset = [], {}, [], 0.0
    texts = [chapter_text(ch)[0] for ch in script]
    for i, ch in enumerate(script):
        text, wl = chapter_text(ch)
        cache = os.path.join(cdir, f'{i:02d}.json')
        if os.path.exists(cache) and json.load(open(cache)).get('text') == text and json.load(open(cache)).get('voice') == cfg['voice_id'] + '/' + cfg.get('model_id', ''):
            res = json.load(open(cache))
        elif a.offline:
            sys.exit(f'no saved voice for chapter {i} ("{ch["chapter"]}")')
        else:
            print(f'voicing chapter {i + 1}/{len(script)}: {ch["chapter"]} ({len(text)} chars)')
            res = call_api(text, ' '.join(texts[max(0, i - 1):i])[-1000:], (texts[i + 1] if i + 1 < len(texts) else '')[:1000], cfg)
            res['text'] = text; res['voice'] = cfg['voice_id'] + '/' + cfg.get('model_id', ''); json.dump(res, open(cache, 'w'))
        mp3 = os.path.join(tmp, f'{i:02d}.mp3'); open(mp3, 'wb').write(base64.b64decode(res['audio_base64']))
        wav = os.path.join(tmp, f'{i:02d}.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-ar', '44100', '-ac', '1', wav], check=True)
        al = res.get('alignment') or res.get('normalized_alignment') or sys.exit('no alignment in the response')
        for beat, t0, t1 in word_times(text, wl, al):
            words.setdefault(beat, []).append([round(t0 + offset, 3), round(t1 + offset, 3)])
        chapters.append({'title': ch['chapter'], 't': round(words[ch['beats'][0]['id']][0][0] + 0, 3)})
        parts.append(wav); offset += dur(wav)
        if i + 1 < len(script):
            sil = os.path.join(tmp, f'{i:02d}_gap.wav')
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', f'anullsrc=r=44100:cl=mono', '-t', str(GAP), sil], check=True)
            parts.append(sil); offset += GAP
    lst = os.path.join(tmp, 'list.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    out = os.path.join(a.video, 'voice.mp3')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c:a', 'libmp3lame', '-b:a', '160k', out], check=True)
    end = max(t1 for v in words.values() for _, t1 in v)
    json.dump({'words': words, 'end': round(end, 3), 'chapters': chapters}, open(os.path.join(a.video, 'timing.json'), 'w'))
    print(f'{a.video}: {sum(len(v) for v in words.values())} words timed, voice {dur(out):.1f}s')
