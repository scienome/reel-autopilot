#!/usr/bin/env python3
"""Make one riddle reel from its folder: voice line by line, time the shots to the voice, render with music.

Usage: python3 tools/riddle_make.py riddles/reels/<id> --sheet OUT.jpg     check frames, no voice needed, no credits
       python3 tools/riddle_make.py riddles/reels/<id> --render OUT.mp4    voice (needs ELEVENLABS_API_KEY unless cached) + MP4

The folder holds lines.json, story.js and meta.json (riddles/PLAYBOOK.md). Takes are kept in <folder>/voice, so a re-render
never pays twice. Needs playwright with chromium, and ffmpeg.
"""
import argparse, asyncio, base64, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SK = os.path.join(ROOT, 'skills', 'whatifstyle')
sys.path.insert(0, os.path.join(ROOT, 'tools'))
LIBS = [os.path.join(SK, 'references', f) for f in ('harness.js', 'sound.js', 'flatkit.js', 'animals.js', 'riddlekit.js', 'riddleengine.js')]


def duration(p):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True, check=True).stdout)


def make_voice(reel, lines):
    missing = [l for l in lines if not os.path.exists(os.path.join(reel, 'voice', l['id'] + '.mp3'))]
    if not missing:
        return
    import voice_audition as va
    key = os.environ.get('ELEVENLABS_API_KEY') or sys.exit('ELEVENLABS_API_KEY is not set')
    cfg = json.load(open(os.path.join(ROOT, 'riddles', 'config.json'), encoding='utf-8'))['voice']
    owner = None
    try:
        for v in va.get('shared-voices', key, search=cfg['voice_id'], page_size=5).get('voices', []):
            if v['voice_id'] == cfg['voice_id']:
                owner = v.get('public_owner_id')
    except Exception as e:  # noqa: BLE001
        print('::warning::voice library lookup failed:', e, flush=True)
    os.makedirs(os.path.join(reel, 'voice'), exist_ok=True)
    for l in missing:
        audio = va.tts(cfg['voice_id'], key, cfg['model_id'], l['text'], owner) or sys.exit(f"no audio for {l['id']}")
        open(os.path.join(reel, 'voice', l['id'] + '.mp3'), 'wb').write(audio)


def build(reel, lengths):
    work = tempfile.mkdtemp()
    pre = os.path.join(work, 'lengths.js'); open(pre, 'w', encoding='utf-8').write('window.VOICE_D = ' + json.dumps(lengths) + ';')
    tail = os.path.join(work, 'tail.js'); open(tail, 'w', encoding='utf-8').write('var scoreSound = window.scoreSound, LESSON = window.LESSON;')
    page = os.path.join(work, 'render.html')
    subprocess.run([sys.executable, os.path.join(SK, 'scripts', 'build_page.py'), os.path.join(SK, 'assets', 'player_body.html'), page,
                    *LIBS, pre, os.path.join(reel, 'story.js'), tail, '--title', os.path.basename(reel)], check=True, stdout=subprocess.DEVNULL)
    return page


async def inspect(page, sheet=None):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 720, 'height': 1280}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///' + page.replace('\\', '/').lstrip('/')); await pg.wait_for_timeout(2000)
        if errs:
            sys.exit('page errors: ' + '; '.join(errs[:5]))
        info = await pg.evaluate('({s: window.SHOT_STARTS, d: window.DURATION})')
        if sheet:
            ss = sorted(info['s'].values()); ts = [a + ((ss[i + 1] if i + 1 < len(ss) else info['d']) - a) * 0.72 for i, a in enumerate(ss)]
            work = tempfile.mkdtemp()
            for i, t in enumerate(ts):
                d = await pg.evaluate(f'(()=>{{seek({t});return document.getElementById("c").toDataURL("image/jpeg",.8)}})()')
                open(os.path.join(work, f'{i:02d}.jpg'), 'wb').write(base64.b64decode(d.split(',')[1]))
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', os.path.join(work, '%02d.jpg'), '-vf', f'scale=240:-1,tile={len(ts)}x1', '-frames:v', '1', sheet], check=True)
        if errs:
            sys.exit('page errors: ' + '; '.join(errs[:5]))
        await b.close()
    return info


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('reel'); ap.add_argument('--sheet'); ap.add_argument('--render'); ap.add_argument('--workers', default='4')
    a = ap.parse_args(); reel = os.path.abspath(a.reel)
    lines = json.load(open(os.path.join(reel, 'lines.json'), encoding='utf-8'))
    if a.sheet:
        page = build(reel, {})
        info = asyncio.run(inspect(page, a.sheet)); print(f"{os.path.basename(reel)}: about {info['d']:.1f}s before voice timing, sheet {a.sheet}")
    if a.render:
        make_voice(reel, lines)
        vp = {l['id']: os.path.join(reel, 'voice', l['id'] + '.mp3') for l in lines}
        page = build(reel, {k: duration(p) for k, p in vp.items()})
        info = asyncio.run(inspect(page))
        ins, flt, mix = [], '', ''
        for i, l in enumerate(lines):
            ms = int(info['s'][l['id']] * 1000 + 120); ins += ['-i', vp[l['id']]]
            flt += f'[{i}:a]aresample=44100,aformat=channel_layouts=mono,adelay={ms}[a{i}];'; mix += f'[a{i}]'
        track = os.path.join(tempfile.mkdtemp(), 'voice.mp3')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', *ins, '-filter_complex', f'{flt}{mix}amix=inputs={len(lines)}:normalize=0[o]', '-map', '[o]', '-b:a', '160k', track], check=True)
        subprocess.run([sys.executable, os.path.join(SK, 'scripts', 'render_reel.py'), page, a.render, '--voice', track, '--music', '--workers', a.workers], check=True)
        print(f"{os.path.basename(reel)}: {duration(a.render):.1f}s {a.render}")


if __name__ == '__main__':
    main()
