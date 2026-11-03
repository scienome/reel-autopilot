#!/usr/bin/env python3
"""Voice, check and render one Pulse reel (bodybuilding science channel, folder pulsereels/).

  python3 tools/pulse_make.py <id>              voice (ElevenLabs, cached in voice_lines/) + render out/<id>/<id>.mp4
  python3 tools/pulse_make.py <id> --no-voice   silent render on estimated timing (local test)
  python3 tools/pulse_make.py <id> --sheet      contact sheet out/<id>/sheet.png only (local check, no render)

One voice (pulsereels/config.json) reads script.json line by line. Line start/end times go to the story as
window.TIMING; the story places each word inside its line by syllables. Outputs next to the MP4: cover.jpg (meta cover_t),
caption.txt, player.html (interactive player with the take embedded). Needs ffmpeg and playwright (chromium) and the
Nunito font (pulsereels/fonts, copied into ~/.local/share/fonts by this script).
"""
import base64, glob, hashlib, json, os, shutil, subprocess, sys, urllib.request, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = os.path.join(ROOT, 'pulsereels')
KIT = os.path.join(HOME, 'kit')
LEAD_IN, LINE_GAP, TAIL = 0.3, 0.28, 1.4
LIBS = ['harness.js', 'sound.js', 'pulse.js']


def fonts():
    dst = os.path.expanduser('~/.local/share/fonts'); os.makedirs(dst, exist_ok=True)
    for f in glob.glob(os.path.join(HOME, 'fonts', '*.ttf')):
        if not os.path.exists(os.path.join(dst, os.path.basename(f))): shutil.copy(f, dst)
    subprocess.run(['fc-cache', '-f'], capture_output=True)


def tts(text, cfg, path):
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}?output_format=mp3_44100_128",
        data=json.dumps({'text': text, 'model_id': cfg['model_id']}).encode(),
        headers={'xi-api-key': os.environ['ELEVENLABS_API_KEY'], 'Content-Type': 'application/json'})
    open(path, 'wb').write(urllib.request.urlopen(req, timeout=300).read())


def voice(reel, out, lines, cfg):
    takes = os.path.join(reel, 'voice_lines'); os.makedirs(takes, exist_ok=True)
    keep, pcm, timed, t = set(), [b'\0\0' * int(LEAD_IN * 44100)], [], LEAD_IN
    for i, ln in enumerate(lines):
        if i:
            pcm.append(b'\0\0' * int(LINE_GAP * 44100)); t += LINE_GAP
        name = hashlib.sha1(f"{cfg['voice_id']}|{cfg['model_id']}|{ln['say']}".encode()).hexdigest()[:16] + '.mp3'
        mp3 = os.path.join(takes, name); keep.add(name)
        if not os.path.exists(mp3):
            print('voicing:', ln['say'], flush=True); tts(ln['say'], cfg, mp3)
        wav = os.path.join(out, name + '.wav')
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', mp3, '-af', 'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse',
                        '-ac', '1', '-ar', '44100', '-sample_fmt', 's16', wav], check=True)
        with wave.open(wav) as w:
            pcm.append(w.readframes(w.getnframes())); dur = w.getnframes() / 44100
        timed.append({'t0': round(t, 3), 't1': round(t + dur, 3)}); t += dur
    for f in set(os.listdir(takes)) - keep: os.remove(os.path.join(takes, f))
    path = os.path.join(out, 'voice.wav')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(44100); w.writeframes(b''.join(pcm))
    return path, {'lines': timed, 'duration': round(t + TAIL, 2)}


def page(reel, lines, timing, title, voice_mp3=None, poster=None, full=False):
    body = open(os.path.join(KIT, 'player_body.html'), encoding='utf-8').read().replace('__TITLE__', title)
    js = '\n'.join(open(os.path.join(KIT, f), encoding='utf-8').read() for f in LIBS)
    js += '\nwindow.REEL_LINES = ' + json.dumps(lines, ensure_ascii=False) + ';'
    if timing: js += '\nwindow.TIMING = ' + json.dumps(timing) + ';'
    js += '\n' + open(os.path.join(reel, 'story.js'), encoding='utf-8').read() + '\n})();'
    if poster is not None: js += f'\nwindow.POSTER_T = {poster};'
    if voice_mp3: js += '\nwindow.VO_DEFAULT = ' + json.dumps('data:audio/mpeg;base64,' + base64.b64encode(open(voice_mp3, 'rb').read()).decode()) + ';'
    html = body.replace('/*__LIBS__*/', js)
    if full: html = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>'
    return html


def sheet(render_html, out_png, extra=()):
    from playwright.sync_api import sync_playwright
    from PIL import Image
    shots = []
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 720, 'height': 1280})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.set_content('<!doctype html><html><body>' + open(render_html, encoding='utf-8').read() + '</body></html>'); pg.wait_for_timeout(1200)
        dur = pg.evaluate('DURATION'); beats = pg.evaluate('LESSON.BEATS.map(b => b.t)')
        ts = sorted(set([0.0] + [round(x + 0.9, 2) for x in beats] + [round(x, 2) for x in extra] + [round(dur - 0.6, 2)]))
        slow = []
        for i, t in enumerate(ts):
            ms = pg.evaluate(f'(()=>{{const s=performance.now();seek({t});return performance.now()-s}})()')
            if ms > 150: slow.append((t, round(ms)))
            f = out_png + f'.{i}.png'; pg.locator('#c').screenshot(path=f); shots.append((t, f))
        b.close()
    tw, th, cols = 240, 427, 6
    rows = (len(shots) + cols - 1) // cols
    im = Image.new('RGB', (tw * cols, th * rows), (20, 10, 60))
    for i, (t, f) in enumerate(shots):
        im.paste(Image.open(f).resize((tw, th)), ((i % cols) * tw, (i // cols) * th)); os.remove(f)
    im.save(out_png)
    print(f'sheet: {out_png} ({len(shots)} frames, duration {dur}s) errors={errs} slow={slow}')
    return errs


def main():
    args = sys.argv[1:]; rid = args[0]
    reel, out = os.path.join(HOME, 'reels', rid), os.path.join(ROOT, 'out', rid)
    os.makedirs(out, exist_ok=True); fonts()
    cfg = json.load(open(os.path.join(HOME, 'config.json')))
    meta = json.load(open(os.path.join(reel, 'meta.json'), encoding='utf-8'))
    lines = json.load(open(os.path.join(reel, 'script.json'), encoding='utf-8'))['lines']
    title = meta.get('title', rid)
    render = os.path.join(out, 'render.html')
    if '--sheet' in args:
        open(render, 'w', encoding='utf-8').write(page(reel, lines, None, title))
        extra = [float(a) for a in args if a.replace('.', '', 1).isdigit()]
        sys.exit(1 if sheet(render, os.path.join(out, 'sheet.png'), extra) else 0)
    timing, vwav = None, None
    if '--no-voice' not in args:
        vwav, timing = voice(reel, out, lines, cfg['voice'])
    open(render, 'w', encoding='utf-8').write(page(reel, lines, timing, title))
    mp4 = os.path.join(out, rid + '.mp4')
    cmd = [sys.executable, os.path.join(KIT, 'render_reel.py'), render, mp4, '--fps', str(cfg.get('fps', 30))]
    if vwav: cmd += ['--voice', vwav]
    subprocess.run(cmd, check=True)
    vmp3 = None
    if vwav:
        vmp3 = os.path.join(out, 'voice.mp3'); subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', vwav, '-b:a', '96k', vmp3], check=True)
    open(os.path.join(out, 'player.html'), 'w', encoding='utf-8').write(page(reel, lines, timing, title, vmp3, meta.get('cover_t', 1), full=True))
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(meta.get('cover_t', 1)), '-i', mp4, '-frames:v', '1', '-q:v', '3', os.path.join(out, 'cover.jpg')], check=True)
    open(os.path.join(out, 'caption.txt'), 'w', encoding='utf-8').write(meta.get('caption', '') + '\n\n' + ' '.join(meta.get('hashtags', [])) + '\n')
    print(f'{rid}: done -> {mp4}')


if __name__ == '__main__':
    main()
