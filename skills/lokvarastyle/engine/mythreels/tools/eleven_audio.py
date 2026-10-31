#!/usr/bin/env python3
"""ElevenLabs background music and sound effects for a reel, placed on the voiceover's word timing.

Usage: python3 tools/eleven_audio.py reels/<id> OUT_DIR      (needs ELEVENLABS_API_KEY for anything not cached yet)

reels/<id>/audio.json (optional; nothing happens without it):
  { "music": { "prompt": "tense, quirky orchestral underscore, no vocals", "gain": 0, "tail": 4 },
    "sfx": [ { "beat": "hook", "word": "torpedo", "n": 1, "offset": -0.1, "prompt": "deep underwater torpedo whoosh",
               "dur": 1.5, "gain": 0 }, { "t": 12.3, "prompt": "...", "dur": 2 } ] }
  music: made once with the Eleven Music API, as long as the voice plus `tail` seconds (instrumental only).
  sfx: made with the Sound Effects API; each lands at a word of the script (beat + word, the n-th time it is said,
       + offset seconds) or at an absolute time t. gain is in dB on top of the default level.
Every generated file is kept in reels/<id>/eleven/ (with manifest.json), so a re-render never pays for it twice.
Writes OUT_DIR/music.mp3 and OUT_DIR/sfx_bed.wav when there is something to write, and prints what it made.
A failed API call (no credit, a plan without music, ...) is a warning, not an error: the reel renders without it.
"""
import hashlib, json, os, re, subprocess, sys, time

API = 'https://api.elevenlabs.io/v1'


def norm(w):  # Hindi-safe: drop punctuation only (Devanagari vowel signs are not "alphanumeric")
    return re.sub(r"[\s.,!?;:\"'“”‘’()…।॥\-–—]", '', w.lower())


def word_list(reel):
    """[(beat, word, t)] in speaking order, from either timing.json layout."""
    tm = json.load(open(os.path.join(reel, 'timing.json')))
    if isinstance(tm['words'], list):
        return [(w.get('beat'), w['w'], w['t']) for w in tm['words']], tm.get('end') or tm['words'][-1]['e']
    sc = json.load(open(os.path.join(reel, 'script.json')))
    beats = [b for ch in sc for b in ch['beats']] if sc and 'beats' in sc[0] else sc
    out = []
    for b in beats:
        ws = [w for ph in b.get('phrases', [b.get('text', '')]) for w in (ph if isinstance(ph, str) else ph[0]).split()]
        for w, (t, _e) in zip(ws, tm['words'].get(b['id'], [])):
            out.append((b['id'], w, t))
    return out, tm.get('end') or max(e for v in tm['words'].values() for _t, e in v)


def at_time(s, words):
    if 't' in s:
        return float(s['t'])
    hits = [t for b, w, t in words if (s.get('beat') in (None, b)) and norm(w) == norm(s['word'])]
    n = s.get('n', 1)
    if len(hits) < n:
        raise KeyError(f"word {s['word']!r} (#{n}) not found in beat {s.get('beat')!r}")
    return hits[n - 1] + s.get('offset', 0.0)


def call(path, body):
    import requests
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        print('::warning::ELEVENLABS_API_KEY is not set: no ElevenLabs music or sound effects'); return None
    for attempt in range(4):
        r = requests.post(f'{API}/{path}?output_format=mp3_44100_128', headers={'xi-api-key': key, 'Content-Type': 'application/json'}, json=body, timeout=600)
        if r.status_code == 200 and r.content:
            return r.content
        print(f'::warning::ElevenLabs {path} {r.status_code}: {r.text[:300]}', flush=True)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(15 * (attempt + 1)); continue
        return None
    return None


def cached(reel, man, kind, body, path):
    key = hashlib.sha1(json.dumps([kind, body], sort_keys=True).encode()).hexdigest()[:12]
    d = os.path.join(reel, 'eleven'); f = os.path.join(d, f'{kind}-{key}.mp3')
    if os.path.exists(f):
        return f
    audio = call(path, body)
    if not audio:
        return None
    os.makedirs(d, exist_ok=True); open(f, 'wb').write(audio)
    man[os.path.basename(f)] = body; json.dump(man, open(os.path.join(d, 'manifest.json'), 'w'), indent=1)
    print(f'made {kind}: {body.get("prompt") or body.get("text")!r}')
    return f


def main(reel, out):
    spec_f = os.path.join(reel, 'audio.json')
    if not os.path.exists(spec_f):
        return
    spec = json.load(open(spec_f)); os.makedirs(out, exist_ok=True)
    mf = os.path.join(reel, 'eleven', 'manifest.json'); man = json.load(open(mf)) if os.path.exists(mf) else {}
    words, end = word_list(reel)
    m = spec.get('music')
    if m:
        ms = int(min(300, max(10, end + m.get('tail', 4))) * 1000)
        body = {'prompt': m['prompt'], 'music_length_ms': ms, 'model_id': 'music_v1', 'force_instrumental': True}
        f = cached(reel, man, 'music', body, 'music')
        if f:
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f, '-c', 'copy', os.path.join(out, 'music.mp3')], check=True)
            json.dump({'gain': m.get('gain', 0)}, open(os.path.join(out, 'music.json'), 'w'))
    placed = []
    for s in spec.get('sfx', []):
        try:
            t = max(0.0, at_time(s, words))
        except KeyError as e:
            print(f'::warning::sfx skipped: {e}'); continue
        body = {'text': s['prompt'], 'duration_seconds': s.get('dur', 2.0), 'prompt_influence': s.get('influence', 0.5)}
        f = cached(reel, man, 'sfx', body, 'sound-generation')
        if f:
            placed.append((t, f, s.get('gain', 0)))
    if placed:
        ins, chains = [], []
        for i, (t, f, g) in enumerate(placed):
            ins += ['-i', f]; ms = int(t * 1000)
            chains.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g}dB,adelay={ms}|{ms}[s{i}]')
        mix = ''.join(f'[s{i}]' for i in range(len(placed)))
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *ins, '-filter_complex', ';'.join(chains) + f';{mix}amix=inputs={len(placed)}:normalize=0:duration=longest[a]',
                        '-map', '[a]', '-ar', '48000', os.path.join(out, 'sfx_bed.wav')], check=True)
        for t, f, g in placed:
            print(f'  sfx at {t:6.2f}s  {man.get(os.path.basename(f), {}).get("text", os.path.basename(f))}')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2]))
