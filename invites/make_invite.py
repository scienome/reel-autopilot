#!/usr/bin/env python3
"""Griha Pravesh invitation videos (Hindi + English), 1080x1920, with synthesized traditional instrumental music.

Usage: python3 invites/make_invite.py invites/grah-pravesh out/invites
Writes music.wav, griha-pravesh-hindi.mp4 and griha-pravesh-english.mp4. Needs Pillow, numpy, ffmpeg; uses
PlayfairDisplay fonts in <dir>/fonts if present (the workflow downloads them), otherwise fonts/Montserrat.ttf.
"""
import math, os, random, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SR, FPS, DUR, W, H = 44100, 30, 30.0, 1080, 1920
SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# ------------------------------------------------------------------ music (no voice)
def music(path):
    t = np.arange(int(SR * DUR)) / SR
    out = np.zeros((len(t), 2))
    sa = 146.83  # D

    def add(sig, start, pan=0.0, gain=1.0):
        i = int(start * SR); n = min(len(sig), len(t) - i)
        if n <= 0: return
        out[i:i + n, 0] += sig[:n] * gain * (1 - pan) ** 0.5
        out[i:i + n, 1] += sig[:n] * gain * (1 + pan) ** 0.5

    def tanpura(f, d=3.2):
        tt = np.arange(int(SR * d)) / SR
        s = sum((1 / k) * np.sin(2 * np.pi * f * k * tt * (1 + 0.0007 * k) + k) * np.exp(-tt * (0.6 + 0.12 * k)) * (1 + 0.3 * np.sin(2 * np.pi * 0.8 * tt * k)) for k in range(1, 14))
        return s * np.minimum(1, tt / 0.01)

    for i, st in enumerate(np.arange(0, DUR, 0.9)):  # Pa Sa Sa Sa(low)
        f = [sa * 1.5 / 2, sa, sa, sa / 2][i % 4]
        add(tanpura(f), st, pan=[-0.4, 0.2, 0.3, -0.2][i % 4], gain=0.05)

    def bell(at, f=880.0):
        tt = np.arange(int(SR * 5)) / SR
        s = sum(a * np.sin(2 * np.pi * f * r * tt) * np.exp(-tt * dcy) for r, a, dcy in [(1, 1, 0.7), (2.76, 0.5, 1.4), (5.4, 0.3, 2.5), (8.93, 0.15, 4)])
        add(s * np.minimum(1, tt / 0.002), at, pan=0.3, gain=0.13)

    for at in (0.2, 8.2, 16.2, 24.2): bell(at); bell(at + 0.05, 1320)

    beat = 0.8  # bansuri melody, raga Bhupali (S R G P D)
    phr = [(12, 2), (9, 1), (7, 1), (4, 2), (2, 1), (0, 1), (2, 1), (4, 1), (7, 2), (9, 1), (7, 1), (4, 4),
           (0, 1), (2, 1), (4, 2), (7, 1), (9, 1), (12, 2), (9, 1), (12, 1), (14, 2), (12, 4), (9, 1), (7, 1), (4, 1), (2, 1), (0, 4)]
    pos = 2.4
    while pos < DUR - 1:
        for semi, b in phr:
            d = b * beat; f = sa * 4 * 2 ** (semi / 12); tt = np.arange(int(SR * (d + 0.25))) / SR
            vib = np.sin(2 * np.pi * 5.2 * tt) * 0.006 * np.minimum(1, tt / 0.4)
            ph = 2 * np.pi * f * np.cumsum(1 + vib) / SR
            env = np.minimum(1, tt / 0.07) * np.clip((d + 0.25 - tt) / 0.25, 0, 1)
            s = (np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)) * env
            s += np.random.randn(len(tt)) * 0.02 * env  # breath
            add(s, pos, pan=-0.1, gain=0.09)
            pos += d
            if pos > DUR - 1: break

    def drum(f0, f1, dcy, at, g):
        tt = np.arange(int(SR * 0.6)) / SR
        f = f1 + (f0 - f1) * np.exp(-tt * 18)
        add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * dcy), at, pan=0.15, gain=g)

    keherwa = [('ge', 1), ('na', .5), ('na', .5), ('na', 1), ('na', 1), ('ge', 1), ('na', .5), ('ge', .5), ('na', 1), ('na', 1)]
    pos = 4.0
    while pos < DUR - 2:
        for k, b in keherwa:
            if k == 'ge': drum(150, 70, 6, pos, 0.25)
            else: drum(420, 330, 14, pos, 0.1)
            pos += b * beat
    ir = np.random.randn(int(SR * 0.9)) * np.exp(-np.arange(int(SR * 0.9)) / SR * 6) * 0.02
    for c in range(2):
        out[:, c] += np.convolve(out[:, c], ir)[:len(t)] * 0.6
    fade = np.minimum(1, np.minimum(t / 1.0, (DUR - t) / 2.5))[:, None]
    out = out * fade; out = out / np.abs(out).max() * 0.85
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype('<i2').tobytes())


# ------------------------------------------------------------------ picture helpers
def font(name, px, var=None):
    for p in [os.path.join(SRC, 'fonts', name), os.path.join(ROOT, 'fonts', 'Montserrat.ttf')]:
        if os.path.exists(p):
            f = ImageFont.truetype(p, px)
            if var:
                try: f.set_variation_by_name(var)
                except Exception: pass
            return f


rng = random.Random(7)
PETALS = [dict(x=rng.uniform(0, W), y=rng.uniform(-H, H), v=rng.uniform(60, 140), a=rng.uniform(0, 6.3), w=rng.uniform(-2, 2),
               s=rng.uniform(14, 26), c=rng.choice([(255, 140, 0), (255, 190, 20), (245, 110, 20), (230, 60, 40)])) for _ in range(38)]
SPR = {}


def petal(s, c, ang):
    key = (int(s), c, int(ang * 12 / 6.283) % 12)
    if key not in SPR:
        im = Image.new('RGBA', (int(s * 2.2), int(s * 2.2)), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.ellipse([s * 0.6, s * 0.3, s * 1.6, s * 1.9], fill=c + (230,))
        SPR[key] = im.rotate(key[2] * 30, resample=Image.BICUBIC)
    return SPR[key]


GLOW = Image.new('RGBA', (160, 160), (0, 0, 0, 0))
for r in range(80, 0, -2):
    ImageDraw.Draw(GLOW).ellipse([80 - r, 80 - r, 80 + r, 80 + r], fill=(255, 190, 80, int(90 * (1 - r / 80) ** 2)))


def star(sz):  # a soft four-point golden twinkle
    im = Image.new('RGBA', (sz * 2, sz * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im); c = sz
    d.polygon([(c, 0), (c + sz * 0.16, c - sz * 0.16), (2 * c, c), (c + sz * 0.16, c + sz * 0.16), (c, 2 * c), (c - sz * 0.16, c + sz * 0.16), (0, c), (c - sz * 0.16, c - sz * 0.16)], fill=(255, 236, 170, 255))
    return Image.alpha_composite(im.filter(ImageFilter.GaussianBlur(1.2)), im)


STARS = [dict(x=rng.uniform(140, 884), y=rng.uniform(60, 1480), ph=rng.random(), sp=rng.uniform(0.3, 0.6), im=star(rng.randint(9, 18))) for _ in range(34)]
DUST = [dict(x=rng.uniform(0, W), y=rng.uniform(0, H), v=rng.uniform(25, 60), r=rng.randint(3, 8), ph=rng.random()) for _ in range(30)]
DOT = {r: (lambda r: (lambda im: (ImageDraw.Draw(im).ellipse([r, r, 3 * r, 3 * r], fill=(255, 215, 120, 150)), im.filter(ImageFilter.GaussianBlur(r * 0.6)))[1])(Image.new('RGBA', (4 * r, 4 * r), (0, 0, 0, 0))))(r) for r in range(3, 9)}
BAND = Image.new('RGBA', (260, 260), (0, 0, 0, 0))
for i in range(260):
    ImageDraw.Draw(BAND).line([(i, 0), (i, 259)], fill=(255, 250, 225, int(110 * math.exp(-((i - 130) / 45) ** 2))))
BAND = BAND.rotate(-25, resample=Image.BICUBIC, expand=True)
CAMS = {'hi': [(0, 1, 768), (4.5, 1, 768), (6.5, 1.25, 300), (9.5, 1.3, 300), (11.5, 1.3, 700), (15, 1.32, 760), (17, 1.3, 1060), (22, 1.32, 1060), (24.5, 1.0, 768), (30, 1.04, 768)],
        'en': [(0, 1, 768), (11.5, 1, 768), (13, 1.25, 300), (15.5, 1.3, 300), (17, 1.3, 700), (19.5, 1.32, 760), (21, 1.3, 1060), (24, 1.32, 1060), (26, 1.0, 768), (30, 1.03, 768)]}


def cam(keys, t):  # smooth camera tour: (zoom, centre y on the card)
    for (t0, s0, y0), (t1, s1, y1) in zip(keys, keys[1:]):
        if t <= t1:
            k = (t - t0) / max(1e-6, t1 - t0); k = k * k * (3 - 2 * k)
            return s0 + (s1 - s0) * k, y0 + (y1 - y0) * k
    return keys[-1][1], keys[-1][2]


def frame(card, t, bgcache, keys):
    s, cy = cam(keys, t)
    cw, ch = card.size; vw = cw / s; vh = min(ch, vw * H / W); x0 = (cw - vw) / 2; y0 = min(max(0, cy - vh / 2), ch - vh)
    view = card.crop((int(x0), int(y0), int(x0 + vw), int(y0 + vh))).resize((W, min(H, int(W * vh / vw))), Image.BILINEAR)
    fr = bgcache.copy(); fr.paste(view, (0, (H - view.height) // 2))
    for p in DUST:  # golden dust drifting up
        y = (p['y'] - p['v'] * t) % H; x = p['x'] + 20 * math.sin(t * 0.6 + p['ph'] * 6)
        sp = DOT[p['r']]; fr.paste(sp, (int(x), int(y)), sp)
    for p in PETALS:
        y = (p['y'] + p['v'] * t) % (H + 200) - 100; x = p['x'] + 30 * math.sin(t * 0.8 + p['a'])
        sp = petal(p['s'], p['c'], p['a'] + p['w'] * t); fr.paste(sp, (int(x), int(y)), sp)
    if t < 2.5:  # opening flower shower
        for p in PETALS[:20]:
            y = -60 + (t * 900) * (0.6 + p['v'] / 300) + p['x'] * 0.1; x = p['x'] + 60 * math.sin(t * 3 + p['a'])
            sp = petal(p['s'] * 1.3, p['c'], p['a'] + t * 5); fr.paste(sp, (int(x), int(y)), sp)
    a = min(1, t / 1.2)
    if a < 1: fr = Image.blend(Image.new('RGB', fr.size, (252, 244, 222)), fr, a)
    e = min(1, max(0, (DUR - t) / 1.5))
    if e < 1: fr = Image.blend(Image.new('RGB', fr.size, (20, 10, 5)), fr, e)
    return fr


def glow(card, t):
    c = card.copy().convert('RGBA')
    for i, (x, y) in enumerate([(268, 1388), (757, 1388)]):  # diyas flicker
        k = 0.75 + 0.25 * math.sin(t * 11 + i * 2) * math.sin(t * 7.3 + i)
        g = GLOW.resize((int(160 * k), int(160 * k))); c.alpha_composite(g, (x - g.width // 2, y - g.height // 2))
    k = 1.6 + 0.5 * math.sin(t * 2.2)  # Om pulse
    g = GLOW.resize((int(160 * k), int(160 * k))); c.alpha_composite(g, (512 - g.width // 2, 92 - g.height // 2))
    for p in STARS:  # twinkles
        v = max(0.0, math.sin(2 * math.pi * (t * p['sp'] + p['ph']))) ** 6
        if v > 0.05:
            im = p['im'].resize((max(2, int(p['im'].width * (0.4 + 0.6 * v))),) * 2); c.alpha_composite(im, (int(p['x'] - im.width / 2), int(p['y'] - im.height / 2)))
    for st in (5.0, 15.5, 26.0):  # light sweep over the title
        if st <= t < st + 1.3:
            x = int(150 + (t - st) / 1.3 * 760 - BAND.width / 2); box = (150, 140, 880, 350)
            reg = c.crop(box); layer = Image.new('RGBA', reg.size, (0, 0, 0, 0)); layer.paste(BAND, (x - 150, -40), BAND)
            c.paste(Image.alpha_composite(reg, layer), box[:2])
    return c.convert('RGB')


def render(name, card_at, keys):
    bg = card_at(DUR).resize((W, H)).filter(ImageFilter.GaussianBlur(40))
    bg = Image.blend(bg, Image.new('RGB', bg.size, (40, 20, 10)), 0.35)
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-i', os.path.join(OUT, 'music.wav'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium',
                           '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', os.path.join(OUT, name)], stdin=subprocess.PIPE)
    for i in range(int(DUR * FPS)):
        t = i / FPS
        ff.stdin.write(frame(glow(card_at(t), t), t, bg, keys).tobytes())
    ff.stdin.close(); ff.wait()
    print('wrote', name)


# ------------------------------------------------------------------ the two cards
base = Image.open(os.path.join(SRC, 'card_hi.jpg')).convert('RGB')


def hindi_at(t):  # the original card, revealed top to bottom
    if t >= 4.5: return base
    cream = Image.new('RGB', base.size, (250, 241, 210)); edge = 130
    y = (t / 4.5) * (base.height + edge)
    m = np.clip((y - np.arange(base.height)) / edge, 0, 1)
    mask = Image.fromarray((np.repeat(m[:, None], base.width, 1) * 255).astype('uint8'))
    return Image.composite(base, cream, mask)


CREAM, GREEN, MAROON, GOLD = (250, 241, 210), (21, 70, 38), (128, 18, 28), (176, 132, 52)
def fill_box(img, x0, y0, x1, y1):  # cover old text: blend each row between the colours just outside the box
    a = np.asarray(img).astype(float); L = a[y0:y1, x0 - 7:x0 - 1].mean(1); R = a[y0:y1, x1 + 1:x1 + 7].mean(1)
    k = np.linspace(0, 1, x1 - x0)[None, :, None]; patch = L[:, None] * (1 - k) + R[:, None] * k
    out = a.copy(); out[y0:y1, x0:x1] = patch; m = Image.new('L', img.size, 0); ImageDraw.Draw(m).rectangle((x0, y0, x1, y1), fill=255)
    return Image.composite(Image.fromarray(out.astype('uint8')).filter(ImageFilter.GaussianBlur(2)), img, m.filter(ImageFilter.GaussianBlur(4)))


blank = base.copy()
for box in [(165, 142, 860, 215), (150, 215, 892, 346), (118, 336, 205, 376), (820, 336, 912, 376), (200, 346, 825, 486), (285, 525, 742, 622),
            (330, 640, 700, 990), (268, 990, 893, 1230), (280, 1230, 744, 1296)]:
    blank = fill_box(blank, *box)
d = ImageDraw.Draw(blank)
F = lambda px, var='Regular', it=False: font('PlayfairDisplay-Italic.ttf' if it else 'PlayfairDisplay.ttf', px, var)
ITEMS = [  # (text, y, size, colour, weight, italic, x or None = centred, align)
    ('You are cordially invited to the', 178, 30, GREEN, 'Regular', True, None),
    ('Griha Pravesh', 250, 88, MAROON, 'Bold', False, None),
    ('CEREMONY', 318, 34, GOLD, 'Bold', False, None),
    ('By the infinite grace of God and the', 372, 27, GREEN, 'Regular', False, None),
    ('blessings of Lord Ram, we seek your presence', 410, 27, GREEN, 'Regular', False, None),
    ('and blessings at our new home.', 448, 27, GREEN, 'Regular', False, None),
    ('The Dabad Family', 577, 50, (255, 255, 255), 'Bold', False, None),
    ('Head of the Family', 672, 26, MAROON, 'Regular', True, None),
    ('Shri Ram Chandra', 720, 50, MAROON, 'Bold', False, None),
    ('Shri Anil Yadav', 790, 40, MAROON, 'Bold', False, None),
    ('Son of Shri Ram Chandra', 830, 24, GREEN, 'Regular', False, None),
    ('Ankit Yadav', 898, 40, MAROON, 'Bold', False, None),
    ('Son of Shri Anil Yadav', 938, 24, GREEN, 'Regular', False, None),
    ('Griha Pravesh Date', 1016, 28, GREEN, 'Regular', False, 285), ('06 November 2026', 1016, 32, MAROON, 'Bold', False, 625),
    ('Havan Time', 1079, 28, GREEN, 'Regular', False, 285), ('8:00 AM', 1079, 32, MAROON, 'Bold', False, 625),
    ('Village / Venue', 1141, 28, GREEN, 'Regular', False, 285), ('Patan Aahir', 1141, 32, MAROON, 'Bold', False, 625),
    ('Mobile Number', 1203, 28, GREEN, 'Regular', False, 285), ('+91 99500 94235', 1203, 32, MAROON, 'Bold', False, 625),
    ('Your presence will bring us', 1252, 26, GREEN, 'Regular', True, None),
    ('joy and good fortune.', 1284, 26, GREEN, 'Regular', True, None),
]
for y in (492, 752, 862, 968):  # gold dividers
    d.line((360, y, 664, y), fill=GOLD, width=2); d.polygon([(512, y - 7), (519, y), (512, y + 7), (505, y)], fill=GOLD)
for y in (1016, 1079, 1141, 1203):
    d.text((590, y), ':', font=F(30, 'Bold'), fill=GREEN, anchor='mm')
SPRITES = []
for i, (txt, y, px, col, wt, it, x) in enumerate(ITEMS):
    f = F(px, wt, it); l, tp, r, b = f.getbbox(txt, anchor='lm')
    im = Image.new('RGBA', (r - l + 8, b - tp + 8), (0, 0, 0, 0)); ImageDraw.Draw(im).text((4 - l, 4 - tp), txt, font=f, fill=col, anchor='lm')
    px0 = (512 - im.width // 2) if x is None else x
    SPRITES.append((im, px0, y + tp - 4, 1.2 + i * 0.42))


def english_at(t):
    c = blank.copy()
    for im, x, y, st in SPRITES:
        a = min(1, max(0, (t - st) / 0.5))
        if a <= 0: continue
        if a < 1:
            sc = 1 + 0.25 * (1 - a) * math.cos(a * 6)  # pop with a little bounce
            w0, h0 = im.size; im = im.resize((max(1, int(w0 * sc)), max(1, int(h0 * sc))), Image.BICUBIC)
            im.putalpha(im.getchannel('A').point(lambda v: int(v * a))); x, y = x - (im.width - w0) / 2, y - (im.height - h0) / 2
        c.paste(im, (int(x), int(y)), im)
    return c


music(os.path.join(OUT, 'music.wav'))
render('griha-pravesh-hindi.mp4', hindi_at, CAMS['hi'])
render('griha-pravesh-english.mp4', english_at, CAMS['en'])
