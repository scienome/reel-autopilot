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
from voice import script_text, word_times, call_api  # noqa: E402

GAP = 0.28  # seconds of silence between two lines


def main(reel):
    cfg = json.load(open(os.path.join(ROOT, 'config.json')))
    base, cast = cfg['voice'], cfg.get('cast', {})
    script = json.load(open(os.path.join(reel, 'script.json')))
    ldir = os.path.join(reel, 'voice_lines'); os.makedirs(ldir, exist_ok=True)
    tmp = tempfile.mkdtemp(); parts, words, t = [], {}, 0.0
    for beat in script:
        who = beat.get('who', 'narrator'); vcfg = dict(base, voice_id=cast.get(who, base['voice_id']))
        text, wl = script_text([beat]); tag = vcfg['voice_id'] + '/' + vcfg.get('model_id', '')
        cache = os.path.join(ldir, beat['id'] + '.json')
        res = json.load(open(cache)) if os.path.exists(cache) else None
        if not (res and res.get('text') == text and res.get('voice') == tag):
            print(f'voicing {beat["id"]} ({who}): {text}', flush=True)
            res = call_api(text, vcfg); res['text'] = text; res['voice'] = tag; json.dump(res, open(cache, 'w'))
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
