#!/usr/bin/env python3
"""Voice audition: every candidate ElevenLabs voice reads the same test lines, so the owner can pick one voice for all
channels by ear. Also lists the voices saved in the account (My Voices) so they can be auditioned too.

Usage: python3 tools/voice_audition.py OUT_DIR [--voices id1,id2,...] [--mine]     (needs ELEVENLABS_API_KEY)

Writes OUT_DIR/NN-<name>.mp3 (one per voice), OUT_DIR/all.mp3 (all takes in a row, a short beep between them, in the
same order as voices.txt) and OUT_DIR/voices.txt (number, name, voice id, description).
"""
import argparse, json, os, subprocess, sys, time
import requests

API = 'https://api.elevenlabs.io/v1'
LINES = ("You're the only person on Earth who can hear what dogs think. "
         "Day one. Your dog stares at you and thinks: he talks to the toaster like it owes him money. "
         "Your neighbour's poodle saw everything. The plumber came twice. There was no leak. "
         "Three a.m. Your old dog climbs into your bed and thinks: I'm old. I'm scared. But I'll stay until you're okay. "
         "You cry into his fur. He thinks: works every time. Bacon tomorrow.")
# well-known ElevenLabs default voices that suit storytelling / comedy narration, plus the ones already in use here
CANDIDATES = [
    ('s3TPKV1kjDlVtZbl4Ksh', 'current: Dave + toy + POV (owner pick, 29 Oct)'), ('c6SfcYrb2t09NHXiT80T', 'current: CouchSarcasm'),
    ('n1PvBOwxb8X6m7tahp2h', 'previous toy voice'), ('nPczCjzI2devNBz1zQrb', 'Brian: deep, resonant narrator'),
    ('JBFqnCBsd6RMkjVDRZzb', 'George: warm British storyteller'), ('onwK4e9ZLuTAKqWW03F9', 'Daniel: authoritative British broadcaster'),
    ('pNInz6obpgDQGcFmaJgB', 'Adam: deep American narrator'), ('TX3LPaxmHKxFdv7VPQKM', 'Liam: young, energetic American'),
    ('iP95p4xoKVk53GoZ742B', 'Chris: casual, natural American'), ('bIHbv24MWmeRgasZH58o', 'Will: friendly, upbeat American'),
    ('cjVigY5qzO86Huf0OWal', 'Eric: smooth, trustworthy American'), ('CwhRBWXzGAHq8TQ4Fs17', 'Roger: confident, classy'),
    ('N2lVS1w4EtoT3dr4eOWO', 'Callum: intense, husky'), ('XB0fDUnXU5powFXDhCwa', 'Charlotte: seductive, British'),
    ('cgSgspJ2msm6clMCkdW9', 'Jessica: expressive, playful American'), ('Xb7hH8MSUJpSbSDYk0k2', 'Alice: confident British'),
]


# --lang hi: a Hindi mythology story line, read by the account's main voices plus the most-used Hindi narrators of the
# ElevenLabs Voice Library (added to the account only if the API needs that before it will speak with them)
LINES_HI = ("क्या आप जानते हैं, बचपन में हनुमान जी ने सूरज को एक पका हुआ फल समझकर निगल लिया था? "
            "पूरी धरती पर अंधेरा छा गया। देवता घबरा गए। इंद्र ने क्रोध में अपना वज्र चलाया... "
            "और फिर जो हुआ, उसने तीनों लोकों को हिला दिया। जय श्री राम। भाग दो देखना है?")
HI_BASE = [('s3TPKV1kjDlVtZbl4Ksh', 'current main narrator (Adam), speaking Hindi'), ('nPczCjzI2devNBz1zQrb', 'Brian: deep narrator, speaking Hindi'),
           ('JBFqnCBsd6RMkjVDRZzb', 'George: warm storyteller, speaking Hindi')]


def library_hi(key, n):
    """The most-used Hindi voices in the shared Voice Library, storytelling ones first."""
    out, seen = [], set()
    for uc in ('narrative_story', 'characters_animation', None):
        ps = dict(language='hi', page_size=30, sort='usage_character_count_1y')
        if uc: ps['use_cases'] = uc
        try:
            vs = get('shared-voices', key, **ps).get('voices', [])
        except Exception as e:
            print('::warning::voice library search failed:', e, flush=True); vs = []
        for v in vs:
            if v['voice_id'] in seen: continue
            seen.add(v['voice_id']); out.append((v['voice_id'], v.get('public_owner_id'), f"Library: {v.get('name')} ({v.get('gender')}, {v.get('age')}, {v.get('accent')}, {v.get('use_case')}) {(v.get('description') or '')[:80]}"))
    return out[:n]


def get(path, key, **params):
    r = requests.get(f'{API}/{path}', headers={'xi-api-key': key}, params=params, timeout=60)
    r.raise_for_status(); return r.json()


def tts(vid, key, model, text=None, owner=None):
    for attempt in range(4):
        r = requests.post(f'{API}/text-to-speech/{vid}?output_format=mp3_44100_128', headers={'xi-api-key': key, 'Content-Type': 'application/json'},
                          json={'text': text or LINES, 'model_id': model}, timeout=300)
        if r.status_code in (400, 404) and owner:  # a library voice the account must add first (free, uses a voice slot)
            a = requests.post(f'{API}/voices/add/{owner}/{vid}', headers={'xi-api-key': key}, json={'new_name': 'hi-' + vid[:6]}, timeout=60)
            print(f'adding library voice {vid}: {a.status_code} {a.text[:150]}', flush=True); owner = None
            if a.status_code == 200:
                vid = a.json().get('voice_id', vid); continue
        if r.status_code == 200:
            return r.content
        print(f'::warning::{vid}: ElevenLabs {r.status_code} {r.text[:200]}', flush=True)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(15 * (attempt + 1)); continue
        return None


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--voices', default=''); ap.add_argument('--mine', action='store_true')
    ap.add_argument('--model', default='eleven_v4'); ap.add_argument('--lang', default=''); ap.add_argument('--find', default='')
    a = ap.parse_args(); key = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('ELEVENLABS_API_KEY is not set')
    os.makedirs(a.out, exist_ok=True)
    cands = [(v.strip(), 'requested') for v in a.voices.split(',') if v.strip()] or list(HI_BASE if a.lang == 'hi' else CANDIDATES)
    owners = {}
    if a.find:  # only voices whose name matches: the account's own first, else the shared Voice Library
        cands = [(v['voice_id'], f"My Voices: {v.get('name')} ({v.get('category')})") for v in get('voices', key).get('voices', []) if a.find.lower() in (v.get('name') or '').lower()]
        if not cands:
            for v in get('shared-voices', key, search=a.find, page_size=10, **({'language': a.lang} if a.lang else {})).get('voices', []):
                cands.append((v['voice_id'], f"Library: {v.get('name')} ({v.get('gender')}, {v.get('age')}, {v.get('accent')}) {(v.get('description') or '')[:80]}")); owners[v['voice_id']] = v.get('public_owner_id')
        print('matches:', *cands, sep='\n  ', flush=True)
    if a.lang == 'hi' and not a.voices.strip() and not a.find:
        for vid, own, desc in library_hi(key, 9):
            cands.append((vid, desc)); owners[vid] = own
    if a.mine and not a.find:
        have = {v for v, _ in cands}
        for v in get('voices', key).get('voices', []):
            if v['voice_id'] not in have and v.get('category') != 'premade':
                cands.append((v['voice_id'], f"My Voices: {v.get('name')} ({v.get('category')}) {json.dumps(v.get('labels') or {})}"))
    rows, takes = [], []
    beep = os.path.join(a.out, '_beep.mp3')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'lavfi', '-i', 'sine=f=1200:d=0.25', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-filter_complex', '[0][1]concat=n=2:v=0:a=1,atrim=0:1.2', '-ar', '44100', '-ac', '1', beep], check=True)
    for vid, desc in cands:
        try:
            name = get(f'voices/{vid}', key).get('name', vid)
        except Exception:
            name = vid
        audio = tts(vid, key, a.model, LINES_HI if a.lang == 'hi' else None, owners.get(vid))
        if not audio:
            rows.append(f'--  {name:28s} {vid}  FAILED  {desc}'); continue
        n = len(takes) + 1; f = os.path.join(a.out, f"{n:02d}-{''.join(c for c in name if c.isalnum() or c in '-_')[:30] or vid}.mp3")
        open(f, 'wb').write(audio); takes.append(f); rows.append(f'{n:02d}  {name:28s} {vid}  {desc}'); print(rows[-1], flush=True)
    open(os.path.join(a.out, 'voices.txt'), 'w').write('\n'.join(rows) + '\n')
    if takes:
        seq = [x for f in takes for x in (beep, f)]; ins = [y for f in seq for y in ('-i', f)]
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', *ins, '-filter_complex', ''.join(f'[{i}:a]aresample=44100,aformat=channel_layouts=mono[a{i}];' for i in range(len(seq))) + ''.join(f'[a{i}]' for i in range(len(seq))) + f'concat=n={len(seq)}:v=0:a=1[o]',
                        '-map', '[o]', '-b:a', '128k', os.path.join(a.out, 'all.mp3')], check=True)
    os.remove(beep)


if __name__ == '__main__':
    main()
