#!/usr/bin/env python3
"""Draw the Pulse channel art with the kit: python3 pulsereels/brand/make_brand.py -> profile.png (1080x1080), yt_banner.png
(2560x1440, text inside YouTube's 1546x423 safe area), ig_highlight_*.png. No channel name on any of them, so they fit any handle."""
import os
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); KIT = os.path.join(HERE, '..', 'kit')
libs = ''.join(f'<script>{open(os.path.join(KIT, f)).read()}</script>' for f in ['harness.js', 'sound.js', 'pulse.js'])
ART = r'''
<script>
const PAL = P.PAL;
function profile(c) { const W = 1080, t = 1.3;
  const g = c.createRadialGradient(540, 470, 60, 540, 540, 760); g.addColorStop(0, '#4a47ec'); g.addColorStop(1, '#17097a'); c.fillStyle = g; c.fillRect(0, 0, W, W);
  P.bgCells(c, W, W, 2, '#ffffff', 3, 0.06);
  P.glow(c, 540, 520, 520, PAL.cyan, 0.25);
  P.lifter(c, 540, 1290, 2.35, { arms: 'flex', bulk: 1, smile: true });
  P.sparkles(c, 540, 380, 420, t, 1, 4);
}
function banner(c) { const W = 2560, H_ = 1440, t = 2;
  const g = c.createLinearGradient(0, 0, W, H_); g.addColorStop(0, '#17097a'); g.addColorStop(0.5, '#3b1ec0'); g.addColorStop(1, '#6d1cc9'); c.fillStyle = g; c.fillRect(0, 0, W, H_);
  P.bgCells(c, W, H_, 3, '#ffffff', 5, 0.05);
  // left: fibres and nuclei; right: molecules and a mitochondrion
  P.fiber(c, -80, 560, 700, 120, -0.25, { color: '#ff4a5c', seed: 2, slide: 10 }); P.nuclei(c, -80, 560, 700, 120, -0.25, 6, 1, 0, 2);
  P.fiber(c, -40, 900, 640, 90, -0.12, { color: '#d8305e', seed: 3 });
  P.mito(c, 2180, 560, 420, 200, 0.2, t, 0.8);
  [[1950, 830, 'co2'], [2330, 880, 'h2o'], [2100, 360, 'o2'], [2420, 300, 'co2']].forEach(([x, y, k], i) => P.molecule(c, x, y, 1.6, k, i));
  P.cellStar(c, 2380, 1020, 70, t, { color: PAL.sky });
  // centre (safe area 507..2053 x 508..931): lifter + tagline
  P.glow(c, 1280, 720, 700, PAL.cyan, 0.18);
  P.lifter(c, 760, 1060, 1.35, { arms: 'flex', bulk: 1, smile: true });
  P.title(c, ['Your Body,', 'Explained.'], 1420, 650, 1, { size: 120 });
  P.label(c, 'Fitness science in 45 seconds', 1420, 870, 1, { color: PAL.magenta, size: 44 });
}
function highlight(c, kind) { const W = 1080;
  const g = c.createRadialGradient(540, 480, 40, 540, 540, 760); g.addColorStop(0, '#4a47ec'); g.addColorStop(1, '#17097a'); c.fillStyle = g; c.fillRect(0, 0, W, W);
  c.save(); c.translate(540, 540); c.scale(2.2, 2.2);
  if (kind === 'muscle') P.fiber(c, -170, 0, 340, 80, -0.2, { color: '#ff4a5c', seed: 1 });
  if (kind === 'fat') P.fatCell(c, 0, 0, 130, 1, { drop: 1 });
  if (kind === 'myths') { P.stampX(c, 0, 0, 120, 1); }
  if (kind === 'recovery') P.moon(c, 0, 0, 120);
  c.restore();
}
</script>'''
def shot(pg, js, w, h, path):
    pg.set_viewport_size({'width': min(w, 2560), 'height': min(h, 1440)})
    pg.evaluate(f'''() => {{ document.body.innerHTML = '<canvas id="c" width="{w}" height="{h}"></canvas>'; const c = document.getElementById('c').getContext('2d'); {js}; }}''')
    pg.locator('#c').screenshot(path=path); print('wrote', path)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.set_content('<!doctype html><html><body style="margin:0">' + libs + ART + '</body></html>')
    pg.evaluate("document.fonts.load('900 60px Nunito')"); pg.wait_for_timeout(500)
    shot(pg, 'profile(c)', 1080, 1080, os.path.join(HERE, 'profile.png'))
    shot(pg, 'banner(c)', 2560, 1440, os.path.join(HERE, 'yt_banner.png'))
    for k in ['muscle', 'fat', 'myths', 'recovery']: shot(pg, f"highlight(c, '{k}')", 1080, 1080, os.path.join(HERE, f'ig_highlight_{k}.png'))
    b.close()
