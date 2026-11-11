#!/usr/bin/env python3
"""Voice and render one 3D diorama reel: python3 tools/diorama_make.py <id>, writes out/<id>/<id>.mp4. It never posts.

One voice reads script.json line by line. Takes are kept in the reel's voice_lines/ folder, so a re-render pays only for
lines whose text changed. Timing uses the same gaps as the noirstyle kit. Needs ELEVENLABS_API_KEY (or CARTESIA_API_KEY when
the reel's voice.json says "provider": "cartesia"), ffmpeg and playwright.
"""
import hashlib, json, os, subprocess, sys, urllib.request, wave
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = os.path.join(ROOT, 'dioramareels')
KIT = os.path.join(ROOT, 'dioramareels', 'kit')  # the 3D engine; tools/toy3d_make.py points HOME at toyreels/
LINE_GAP, SHOT_GAP, LEAD_IN, TAIL = 0.2, 0.42, 0.25, 1.8


def tts(text, cfg, path):
    if cfg.get('provider') == 'cartesia':  # a reel's voice.json can pick Cartesia: {"provider": "cartesia", "voice_id", "model_id"}
        import tempfile, cartesia_tts
        with tempfile.TemporaryDirectory() as d:
            wav = cartesia_tts.tts(text, os.path.join(d, 'take.wav'), voice=cfg['voice_id'])
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-b:a', '128k', path], check=True)
        return
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}?output_format=mp3_44100_128",
        data=json.dumps({'text': text, 'model_id': cfg['model_id']}).encode(),
        headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    open(path, 'wb').write(urllib.request.urlopen(req, timeout=300).read())


def main(rid):
    reel, out = os.path.join(HOME, 'reels', rid), os.path.join(ROOT, 'out', rid)
    takes = os.path.join(reel, 'voice_lines')
    os.makedirs(out, exist_ok=True)
    os.makedirs(takes, exist_ok=True)
    cfg = json.load(open(os.path.join(HOME, 'config.json')))['voice']
    vo = os.path.join(reel, 'voice.json')  # a reel may name its own voice (a test of a new voice or a toy reel)
    if os.path.exists(vo):
        cfg = dict(cfg, **json.load(open(vo)))
    lines = json.load(open(os.path.join(reel, 'script.json'), encoding='utf-8'))['lines']
    keep, pcm, timed, last, t = set(), [b'\0\0' * int(LEAD_IN * 44100)], [], None, LEAD_IN
    for ln in lines:
        if last is not None:
            gap = SHOT_GAP if ln['shot'] != last else LINE_GAP
            t += gap
            pcm.append(b'\0\0' * int(gap * 44100))
        name = hashlib.sha1(f"{cfg['voice_id']}|{cfg['model_id']}|{ln['say']}".encode()).hexdigest()[:16] + '.mp3'
        mp3 = os.path.join(takes, name)
        keep.add(name)
        if not os.path.exists(mp3):
            print('voicing:', ln['say'], flush=True)
            tts(ln['say'], cfg, mp3)
        wav = os.path.join(out, name + '.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '44100', '-sample_fmt', 's16', wav], check=True)
        with wave.open(wav) as w:
            pcm.append(w.readframes(w.getnframes()))
            dur = w.getnframes() / 44100
        timed.append({'shot': ln['shot'], 'cap': ln['cap'], 't0': round(t, 3), 't1': round(t + dur, 3)})
        t += dur
        last = ln['shot']
    for f in set(os.listdir(takes)) - keep:
        os.remove(os.path.join(takes, f))
    shots = {}
    for ln in timed:
        shots.setdefault(ln['shot'], round(max(0, ln['t0'] - LEAD_IN), 3))
    voice, timing = os.path.join(out, 'voice.wav'), os.path.join(out, 'timing.js')
    with wave.open(voice, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(44100)
        w.writeframes(b''.join(pcm))
    open(timing, 'w', encoding='utf-8').write('window.TIMING = ' + json.dumps({'lines': timed, 'shots': shots, 'duration': round(t + TAIL, 2)}, ensure_ascii=False) + ';\n')
    if '--voice-only' in sys.argv:  # voice.wav and timing.js are written, so the PC (or a contact sheet) can use them
        print(f'{rid}: voice saved, video skipped')
        return
    subprocess.run([sys.executable, os.path.join(KIT, 'scripts', 'render.py'), 'video', os.path.join(reel, 'reel.js'), os.path.join(out, rid + '.mp4'), '--timing', timing, '--voice', voice], check=True)
    print(f'{rid}: {round(t + TAIL, 1)} s')


if __name__ == '__main__':
    main(sys.argv[1])
