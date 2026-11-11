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


def align_lines(wav, lines):
    """Line start/end times from word timestamps (faster-whisper, tiny.en, CPU). None if it is not installed."""
    try:
        import numpy as np, difflib, re as _re
        from faster_whisper import WhisperModel
    except Exception:
        return None
    w16 = wav[:-4] + '_16k.wav'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-ar', '16000', '-ac', '1', w16], check=True)
    with wave.open(w16) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    segs, _ = WhisperModel('tiny.en', device='cpu', compute_type='int8').transcribe(x, word_timestamps=True)
    words = [w for sg in segs for w in sg.words]
    norm = lambda t: _re.sub(r"[^a-z0-9]", '', t.lower())
    heard = [norm(w.word) for w in words]
    said, owner = [], []
    for i, ln in enumerate(lines):
        for t in ln['say'].split():
            said.append(norm(t)); owner.append(i)
    m = difflib.SequenceMatcher(None, said, heard, autojunk=False)
    at = {}
    for blk in m.get_matching_blocks():
        for k in range(blk.size):
            at[blk.a + k] = blk.b + k
    lo, hi, wt = [], [], []
    for i in range(len(lines)):
        idx = [j for j, o in enumerate(owner) if o == i and j in at]
        if not idx:
            return None
        lo.append(float(words[at[idx[0]]].start)); hi.append(float(words[at[idx[-1]]].end))
        mine = [j for j, o in enumerate(owner) if o == i]
        known = {j: (float(words[at[j]].start), float(words[at[j]].end)) for j in mine if j in at}
        row, last = [], lo[-1]
        for j in mine:  # words the recogniser missed take the time of the word before
            row.append([round(known[j][0], 3), round(known[j][1], 3)] if j in known else [round(last, 3), round(last + 0.2, 3)])
            last = row[-1][1]
        wt.append(row)
    for i in range(1, len(lines)):  # keep them in order
        lo[i] = max(lo[i], hi[i - 1]); hi[i] = max(hi[i], lo[i] + 0.3)
    return lo, hi, wt


def one_take(rid, reel, out, takes, cfg, lines):
    """Cartesia reels: the whole script in ONE request (no tone reset between lines), then each line's start and end is
    found from the natural pauses: for every line break, the pause nearest to where it should fall by text length."""
    text = ' '.join(ln['say'].strip() for ln in lines)
    name = hashlib.sha1(f"{cfg['voice_id']}|{cfg['model_id']}|onetake|{text}".encode()).hexdigest()[:16] + '.mp3'
    mp3 = os.path.join(takes, name)
    if not os.path.exists(mp3):
        print('voicing the whole script in one take', flush=True)
        tts(text, cfg, mp3)
    for f in set(os.listdir(takes)) - {name, name[:-4] + '.json'}:
        os.remove(os.path.join(takes, f))
    wav = os.path.join(out, 'take.wav')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-ac', '1', '-ar', '44100', '-sample_fmt', 's16', wav], check=True)
    with wave.open(wav) as w:
        audio = w.readframes(w.getnframes())
        dur = w.getnframes() / 44100
    lo = hi = None
    aj = mp3[:-4] + '.json'  # word-aligned line times, cached next to the take (made locally with faster-whisper)
    if os.path.exists(aj):
        al = json.load(open(aj)); lo, hi, wt = al['lo'], al['hi'], al.get('words')
    else:
        al = align_lines(wav, lines)
        if al:
            lo, hi, wt = al
            json.dump({'lo': lo, 'hi': hi, 'words': wt}, open(aj, 'w'))
    if lo is not None:
        return finish(rid, reel, out, lines, audio, dur, lo, hi, wt)
    import array, math
    smp = array.array('h', audio)
    win = 441  # 10 ms
    db = [20 * math.log10(math.sqrt(sum(x * x for x in smp[i:i + win]) / win) + 1) for i in range(0, len(smp) - win, win)]
    th = sorted(db)[len(db) // 10] + 3  # quiet = within 3 dB of the quietest tenth of the take
    pauses, st0 = [], None
    for i, v in enumerate(db + [999]):
        if v < th and st0 is None:
            st0 = i
        elif v >= th and st0 is not None:
            if i - st0 >= 5 and st0 > 5:
                pauses.append((st0 / 100, i / 100))
            st0 = None
    merged = []  # quiet runs split by a blip of breath are one pause
    for pa in pauses:
        if merged and pa[0] - merged[-1][1] <= 0.05:
            merged[-1] = (merged[-1][0], pa[1])
        else:
            merged.append(pa)
    pauses = merged
    n = [len(ln['say']) + 1 for ln in lines]
    want, acc = [], 0
    for i in range(len(lines) - 1):
        acc += n[i]
        want.append(dur * acc / sum(n))
    # monotonic match of line breaks to pauses: close to where the text says, longer pauses preferred (dynamic programming)
    B, P = len(want), len(pauses)
    cost = lambda i, j: abs((pauses[j][0] + pauses[j][1]) / 2 - want[i]) - 3 * (pauses[j][1] - pauses[j][0])
    INF = float('inf')
    dp = [[INF] * (P + 1) for _ in range(B + 1)]
    for j in range(P + 1):
        dp[0][j] = 0
    for i in range(1, B + 1):
        for j in range(1, P + 1):
            dp[i][j] = min(dp[i][j - 1], dp[i - 1][j - 1] + cost(i - 1, j - 1))
    cuts, i, j = [], B, P
    while i > 0 and j > 0:
        if dp[i][j] == dp[i][j - 1]:
            j -= 1
        else:
            cuts.append(pauses[j - 1]); i -= 1; j -= 1
    cuts.reverse()
    if len(cuts) < B:  # not enough pauses: fall back to text-length positions
        cuts = [(w_, w_) for w_ in want]
    lo = [0.0] + [b for a, b in cuts]
    hi = [a for a, b in cuts] + [dur]
    return finish(rid, reel, out, lines, audio, dur, lo, hi)


def finish(rid, reel, out, lines, audio, dur, lo, hi, wt=None):
    timed = [{'shot': ln['shot'], 'cap': ln['cap'], 't0': round(LEAD_IN + lo[i], 3), 't1': round(LEAD_IN + hi[i], 3)} for i, ln in enumerate(lines)]
    if wt:  # word times (captions pop on their own words)
        for i, ln in enumerate(timed):
            ln['words'] = [[round(LEAD_IN + a_, 3), round(LEAD_IN + b_, 3)] for a_, b_ in wt[i]]
    shots = {}
    for i, ln in enumerate(timed):  # a shot cuts in the middle of the pause before its line
        shots.setdefault(ln['shot'], round(max(0, (LEAD_IN + (hi[i - 1] + lo[i]) / 2) if i else 0), 3))
    voice, timing = os.path.join(out, 'voice.wav'), os.path.join(out, 'timing.js')
    with wave.open(voice, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(44100)
        w.writeframes(b'\0\0' * int(LEAD_IN * 44100) + audio)
    total = round(LEAD_IN + dur + TAIL, 2)
    open(timing, 'w', encoding='utf-8').write('window.TIMING = ' + json.dumps({'lines': timed, 'shots': shots, 'duration': total}, ensure_ascii=False) + ';\n')
    if '--voice-only' in sys.argv:
        print(f'{rid}: voice saved (one take, {round(dur, 1)} s), video skipped')
        return
    subprocess.run([sys.executable, os.path.join(KIT, 'scripts', 'render.py'), 'video', os.path.join(reel, 'reel.js'), os.path.join(out, rid + '.mp4'), '--timing', timing, '--voice', voice], check=True)
    print(f'{rid}: {total} s')


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
    if cfg.get('provider') == 'cartesia' and cfg.get('one_take', True):
        return one_take(rid, reel, out, takes, cfg, lines)
    keep, pcm, timed, last, t = set(), [b'\0\0' * int(LEAD_IN * 44100)], [], None, LEAD_IN
    for ln in lines:
        if last is not None:
            gap = cfg.get('shot_gap', SHOT_GAP) if ln['shot'] != last else cfg.get('line_gap', LINE_GAP)  # voice.json can tighten the pauses
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
