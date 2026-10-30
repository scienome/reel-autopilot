  // ==================== MYTH: the Hindi mythology channel's 2D look ====================
  // Clean storybook style (think modern Indian 2D animation): warm brown ink outlines, soft gradient shading, gold
  // jewellery, glowing auras. Deities are always drawn dignified: calm almond eyes, gentle smiles, no comic faces.
  //
  // MYTH.person(ctx, x, y, s, o): x, y = the feet, s = scale (1 is about 620 px tall; child: true ~470). o = {
  //   who: a CAST key (hanuman, balhanuman, krishna, balkrishna, rama, sita, shiva, parvati, ganesha, indra, vayu, deva,
  //        brahma, vishnu, arjuna, ravana, sage, asura, yashoda, villager), t (time: blinks, talking, cloth sway),
  //   flip (face left), pose: 'stand' | 'sit' (lotus) | 'fly' (body tilts with lean), lean (rad), bob (px),
  //   arms: a pose name for both arms, or { r: name, l: name } (names below in ARM), or MYTH.armsAt(t, [[t0, arms], ...]),
  //   hold / holdL: item in the right / left hand: gada | flute | bow | trishul | chakra | lotus | conch | pot | modak |
  //        mountain | vajra | damru | sunfruit | kamandal | arrow,
  //   halo: true (golden disc + rays behind the head), glow: colour (soft body glow),
  //   face: { eyes: 'calm' | 'open' | 'wide' | 'happy' | 'closed' | 'angry' | 'sad', look: [dx, dy] (-1..1),
  //           mouth: 'smile' | 'calm' | 'open' | 'shout' | 'grin' | 'o' | 'frown' | 'puff', talk (mouth flaps), tears },
  //   style: overrides for this shot's CAST traits }. Returns { head: [x, y], hands: { r: [x, y], l: [x, y] } } in canvas space.
  // MYTH.sets[name](ctx, W, H_, t, o): painted backgrounds (720 x 1280): space (o.sun), sky (o.time: dawn|day|dusk|night),
  //   heaven, forest (o.time), palace, kailash, ocean, battle, lanka, village, river (o.night).
  // FX: MYTH.aura, rays, petals, lightning, shock, speed, dark, sun, flame, om, card (gold title card), banner.
  const MYTH = (() => {
    const INK = '#2b160c', GOLD = '#f4c03e', GOLD_D = '#c48a1c', GOLD_L = '#fff0a8', TAU = Math.PI * 2;
    // skin, shade, hair, cloth (dhoti / saree), cloth2 (sash), and traits
    const CAST = {
      hanuman: { skin: '#e8763a', sh: '#c0552a', muzzle: '#f7cfa0', hair: '#7a3416', cloth: '#d8342c', cloth2: '#f4b23a', monkey: true, crown: 'small', tail: true, muscle: 1.15, tilak: 'vaishnav', h: 1.04 },
      balhanuman: { skin: '#ef8540', sh: '#cc6330', muzzle: '#f9d4a8', hair: '#8a3c18', cloth: '#d8342c', cloth2: '#f4b23a', monkey: true, tuft: true, tail: true, child: true, tilak: 'dot' },
      krishna: { skin: '#3d74c2', sh: '#2a5598', hair: '#16121e', cloth: '#f4c430', cloth2: '#e05a2a', crown: 'krishna', feather: true, garland: true, tilak: 'vaishnav', longHair: true },
      balkrishna: { skin: '#4a82cc', sh: '#3363a8', hair: '#16121e', cloth: '#f4c430', cloth2: '#e05a2a', feather: true, child: true, tilak: 'vaishnav', curls: true },
      rama: { skin: '#3f86a8', sh: '#2c6886', hair: '#16121e', cloth: '#f0a030', cloth2: '#c8332a', crown: 'tall', tilak: 'vaishnav', longHair: true },
      vishnu: { skin: '#3a6ec0', sh: '#28528e', hair: '#16121e', cloth: '#f4c430', cloth2: '#c8332a', crown: 'tall', tilak: 'vaishnav', longHair: true, garland: true },
      shiva: { skin: '#8fb2d4', sh: '#6a8fb4', hair: '#2a1e1a', cloth: '#e09440', cloth2: '#8a5a2a', tiger: true, jata: true, snake: true, tilak: 'shaiv', beads: true },
      parvati: { skin: '#e9b48a', sh: '#cf9468', hair: '#1c1214', cloth: '#d8283c', cloth2: '#f4c430', girl: true, crown: 'small', tilak: 'dot' },
      sita: { skin: '#eebd94', sh: '#d49c72', hair: '#1c1214', cloth: '#f08a2a', cloth2: '#c8283c', girl: true, crown: 'small', tilak: 'dot' },
      yashoda: { skin: '#dba27a', sh: '#bf845c', hair: '#1c1214', cloth: '#2f9a6a', cloth2: '#f4c430', girl: true, tilak: 'dot', bun: true },
      ganesha: { skin: '#f0a07c', sh: '#d07e5c', hair: '#16121e', cloth: '#e8b020', cloth2: '#c8332a', elephant: true, crown: 'tall', belly: true, tilak: 'shaiv' },
      indra: { skin: '#f2c49c', sh: '#d8a47a', hair: '#2a1a14', cloth: '#f6e6b0', cloth2: '#d8a020', crown: 'tall', tilak: 'dot', mustache: true, longHair: true },
      vayu: { skin: '#cfe4f6', sh: '#a6c6e2', hair: '#6a8ab0', cloth: '#7ab8e8', cloth2: '#ffffff', crown: 'small', tilak: 'dot', longHair: true, scarf: '#e8f6ff' },
      deva: { skin: '#f0c098', sh: '#d6a076', hair: '#2a1a14', cloth: '#f0d070', cloth2: '#4a9ad8', crown: 'small', tilak: 'dot', longHair: true },
      brahma: { skin: '#f2b07a', sh: '#d48e58', hair: '#f4f4f4', cloth: '#f4e8c8', cloth2: '#d83a2a', crown: 'tall', beard: '#f4f4f4', tilak: 'dot', heads: 3 },
      arjuna: { skin: '#d9a07a', sh: '#bb805a', hair: '#1c1214', cloth: '#f2f2f2', cloth2: '#c8332a', crown: 'small', armor: true, tilak: 'vaishnav', longHair: true, mustache: true },
      ravana: { skin: '#9a6248', sh: '#7a4834', hair: '#120c0c', cloth: '#5a1a2a', cloth2: '#f4c430', crown: 'tall', heads: 10, mustache: true, armor: true, tilak: 'shaiv', muscle: 1.15 },
      sage: { skin: '#d8a27a', sh: '#bc845c', hair: '#f2f2f2', cloth: '#e8742a', cloth2: '#c85a1a', beard: '#f2f2f2', topknot: true, beads: true, tilak: 'shaiv' },
      asura: { skin: '#5a7a4a', sh: '#435e36', hair: '#120c0c', cloth: '#3a2a3a', cloth2: '#a02828', horns: true, tusks: true, muscle: 1.2, h: 1.1, redEyes: true },
      shani: { skin: '#3a4466', sh: '#283050', hair: '#0e1020', cloth: '#1e2a6a', cloth2: '#f4c430', crown: 'tall', tilak: 'dot', longHair: true, mustache: true },
      kumbhakarna: { skin: '#8a5a3e', sh: '#6a422c', hair: '#120c0c', cloth: '#6a2a1a', cloth2: '#f4c430', crown: 'small', mustache: true, muscle: 1.4, h: 1.12, belly: true, tilak: 'shaiv' },
      saraswati: { skin: '#f2c8a4', sh: '#d8a882', hair: '#1c1214', cloth: '#f8f6ee', cloth2: '#f4c430', girl: true, crown: 'small', tilak: 'dot' },
      barbarik: { skin: '#c8906a', sh: '#a8724c', hair: '#1c1214', cloth: '#f4c430', cloth2: '#c8332a', crown: 'tall', tilak: 'vaishnav', longHair: true, armor: true, mustache: true },
      mandodari: { skin: '#e9b48a', sh: '#cf9468', hair: '#1c1214', cloth: '#7a1a4a', cloth2: '#f4c430', girl: true, crown: 'small', tilak: 'dot' },
      villager: { skin: '#c88c62', sh: '#aa6e46', hair: '#1c1214', cloth: '#f2ead8', cloth2: '#d8a030', turban: '#d8402a', mustache: true },
    };
    // ---------- drawing helpers (all in local units; the person's transform already applies the scale) ----------
    const path = (ctx, fill, build, lw = 5, stroke = INK) => { ctx.beginPath(); build(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); } };
    const ell = (ctx, fill, x, y, rx, ry, rot = 0, lw = 5) => path(ctx, fill, () => ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU), lw);
    const poly = (ctx, fill, pts, lw = 5) => path(ctx, fill, () => { ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]); ctx.closePath(); }, lw);
    // a closed smooth shape through points (quadratic midpoints)
    const smooth = (ctx, fill, pts, lw = 5) => path(ctx, fill, () => { const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; ctx.moveTo(...mid(pts[n - 1], pts[0])); for (let i = 0; i < n; i++) { const q = mid(pts[i], pts[(i + 1) % n]); ctx.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]); } ctx.closePath(); }, lw);
    const line = (ctx, col, w, pts, ink = true) => { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const go = () => { ctx.beginPath(); ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]); };
      if (ink) { go(); ctx.strokeStyle = INK; ctx.lineWidth = w + 9; ctx.stroke(); } go(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.restore(); };
    const curve = (ctx, col, w, a, c, b, ink = true) => { ctx.save(); ctx.lineCap = 'round'; const go = () => { ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(...c, ...b); };
      if (ink) { go(); ctx.strokeStyle = INK; ctx.lineWidth = w + 9; ctx.stroke(); } go(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.restore(); };
    // soft side shading: light on the left (key light top-left), darker on the right
    const lg = (ctx, x0, x1, c0, c1) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, c0); g.addColorStop(0.55, c0); g.addColorStop(1, c1); return g; };
    const vg = (ctx, y0, y1, c0, c1) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; };
    const gold = (ctx, y0, y1) => { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, GOLD_L); g.addColorStop(0.45, GOLD); g.addColorStop(1, GOLD_D); return g; };
    const mix = (a, b, k) => a + (b - a) * k;
    const blinkAt = (t, seed) => { const p = (t + seed * 0.37) % 3.7; return p > 3.55; };

    // ---------- arm poses: [elbow, hand] relative to the shoulder, for the RIGHT arm (screen right); the left arm mirrors x ----------
    const ARM = {
      down: [[12, 105], [16, 205]], hips: [[58, 92], [6, 160]], bless: [[58, 96], [52, 0]], namaste: [[44, 100], [-74, 52]],
      up: [[42, -72], [48, -178]], point: [[92, 18], [196, -4]], open: [[78, 62], [152, 18]], fly: [[22, -92], [8, -196]],
      fist: [[52, 96], [-12, 42]], chin: [[50, 100], [-58, -50]], cover: [[34, 86], [-46, -62]], rest: [[52, 100], [14, 26]],
      flute: [[60, 42], [12, -46]], fluteL: [[-38, 48], [-116, -50]], draw: [[104, -26], [-38, -62]], bowL: [[100, -10], [196, -22]],
      belly: [[48, 96], [-30, 120]], wave: [[70, 20], [96, -88]], carry: [[38, -86], [18, -196]], back: [[-6, 96], [-34, 170]],
    };
    const resolveArms = (a) => { if (!a) a = 'down'; if (typeof a === 'string') return { r: ARM[a] || ARM.down, l: ARM[a] || ARM.down }; return { r: Array.isArray(a.r) ? a.r : ARM[a.r] || ARM.down, l: Array.isArray(a.l) ? a.l : ARM[a.l] || ARM.down }; };
    const lerpArm = (A, B, k) => A.map((p, i) => [mix(p[0], B[i][0], k), mix(p[1], B[i][1], k)]);
    // arms that change on cue: AT(t, [[t0, arms], [t1, arms], ...]) blends over 0.3 s
    const armsAt = (t, keys) => { let cur = resolveArms(keys[0][1]); for (let i = 1; i < keys.length; i++) { const [t0, a] = keys[i]; if (t < t0) break; const k = Math.min(1, (t - t0) / 0.3), e = k * k * (3 - 2 * k), nx = resolveArms(a); cur = { r: lerpArm(cur.r, nx.r, e), l: lerpArm(cur.l, nx.l, e) }; } return cur; };

    // ---------- props, drawn at a hand (local units) ----------
    const ITEMS = {
      gada(ctx) { ctx.save(); ctx.rotate(-0.5); line(ctx, '#b8781c', 12, [[0, 40], [0, -120]]); ell(ctx, gold(ctx, -230, -120), 0, -170, 52, 62); for (let i = -1; i <= 1; i++) path(ctx, null, () => { ctx.moveTo(i * 26 - 8, -226); ctx.quadraticCurveTo(i * 30, -170, i * 26 - 8, -114); }, 3, GOLD_D); ell(ctx, GOLD, 0, -240, 12, 12); ell(ctx, GOLD_D, 0, -112, 22, 9); ctx.restore(); },
      flute(ctx) { ctx.save(); ctx.rotate(-0.12); line(ctx, '#8a4a1c', 9, [[-110, 0], [70, 0]]); for (let i = 0; i < 5; i++) ell(ctx, INK, -60 + i * 22, 0, 2.6, 2.6, 0, 0); ell(ctx, '#e8402a', 40, 8, 6, 10, 0, 2); ctx.restore(); },
      bow(ctx) { path(ctx, null, () => { ctx.moveTo(10, -170); ctx.quadraticCurveTo(-70, 0, 10, 170); }, 13, INK); path(ctx, null, () => { ctx.moveTo(10, -170); ctx.quadraticCurveTo(-70, 0, 10, 170); }, 7, '#9a5a22'); path(ctx, null, () => { ctx.moveTo(10, -170); ctx.lineTo(10, 170); }, 1.6, '#f4e8c8'); },
      arrow(ctx) { line(ctx, '#c89a5a', 5, [[-150, 0], [80, 0]]); poly(ctx, '#d0d0d8', [[80, -10], [108, 0], [80, 10]], 3); },
      trishul(ctx) { line(ctx, '#7a5a3a', 9, [[0, 160], [0, -240]]); path(ctx, null, () => { ctx.moveTo(-50, -250); ctx.quadraticCurveTo(-46, -190, 0, -186); ctx.quadraticCurveTo(46, -190, 50, -250); }, 11, INK); path(ctx, null, () => { ctx.moveTo(-50, -250); ctx.quadraticCurveTo(-46, -190, 0, -186); ctx.quadraticCurveTo(46, -190, 50, -250); }, 6, '#d8dce4');
        poly(ctx, '#d8dce4', [[-58, -246], [-50, -280], [-40, -244]], 3); poly(ctx, '#d8dce4', [[40, -244], [50, -280], [58, -246]], 3); poly(ctx, '#d8dce4', [[-8, -180], [0, -296], [8, -180]], 3); ITEMS.damru(ctx, 22, -150, 0.6); },
      damru(ctx, x = 0, y = 0, k = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); poly(ctx, '#a8642a', [[-22, -28], [22, -28], [0, 0]], 4); poly(ctx, '#a8642a', [[-22, 28], [22, 28], [0, 0]], 4); ell(ctx, '#f0dcb0', 0, -28, 22, 6, 0, 3); ell(ctx, '#f0dcb0', 0, 28, 22, 6, 0, 3); ctx.restore(); },
      chakra(ctx, x = 0, y = -40, t = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 9); const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 70); g.addColorStop(0, 'rgba(255,240,160,0.9)'); g.addColorStop(1, 'rgba(255,200,60,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fill();
        poly(ctx, gold(ctx, -46, 46), Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * TAU, r = i % 2 ? 36 : 46; return [Math.cos(a) * r, Math.sin(a) * r]; }), 3); ell(ctx, '#fff6c8', 0, 0, 22, 22, 0, 3); ell(ctx, '#e8402a', 0, 0, 7, 7, 0, 2); ctx.restore(); },
      lotus(ctx) { for (let i = -2; i <= 2; i++) { ctx.save(); ctx.rotate(i * 0.38); smooth(ctx, i % 2 ? '#f58fb0' : '#ffb3cb', [[0, 0], [-16, -30], [0, -62], [16, -30]], 3); ctx.restore(); } ell(ctx, '#3a9a4a', 0, 8, 30, 8, 0, 3); },
      conch(ctx) { smooth(ctx, '#fbf4ea', [[-30, 10], [-26, -26], [6, -40], [36, -14], [26, 22], [-6, 30]], 4); path(ctx, null, () => { ctx.arc(0, -4, 14, 0.5, 4.6); }, 3, '#d8b89a'); },
      pot(ctx) { ell(ctx, lg(ctx, -50, 50, '#c8662a', '#9a4618'), 0, -10, 48, 42); ell(ctx, '#b8561c', 0, -48, 28, 9); ell(ctx, '#fff6e0', 0, -54, 24, 12, 0, 3); line(ctx, '#f4c430', 5, [[-44, -14], [44, -14]], false); },
      modak(ctx) { smooth(ctx, '#fff2d6', [[-26, 6], [-22, -18], [0, -44], [22, -18], [26, 6], [0, 14]], 4); for (let i = -1; i <= 1; i++) path(ctx, null, () => { ctx.moveTo(i * 12, 8); ctx.quadraticCurveTo(i * 10, -14, 0, -40); }, 2, '#d8c09a'); },
      kamandal(ctx) { ell(ctx, '#8a5a2a', 0, 0, 34, 30); line(ctx, '#8a5a2a', 7, [[20, -20], [44, -50]]); path(ctx, null, () => { ctx.moveTo(-26, -20); ctx.quadraticCurveTo(0, -70, 26, -20); }, 5); },
      vajra(ctx, x = 0, y = 0, t = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.3); const g = ctx.createRadialGradient(0, -60, 4, 0, -60, 120); g.addColorStop(0, `rgba(190,230,255,${0.5 + 0.3 * Math.sin(t * 20)})`); g.addColorStop(1, 'rgba(150,200,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -60, 120, 0, TAU); ctx.fill();
        line(ctx, GOLD, 12, [[0, 0], [0, -120]]); for (const e of [-1, 1]) { const yy = e < 0 ? 0 : -120; poly(ctx, gold(ctx, yy - 50, yy + 50), [[-22, yy], [0, yy + e * 58], [22, yy], [0, yy - e * 10]], 4); line(ctx, GOLD_D, 4, [[-22, yy], [-30, yy + e * 40]], false); line(ctx, GOLD_D, 4, [[22, yy], [30, yy + e * 40]], false); } ell(ctx, '#e8402a', 0, -60, 10, 10, 0, 3); ctx.restore(); },
      mountain(ctx) { smooth(ctx, lg(ctx, -150, 150, '#8a6a4a', '#5a4430'), [[-150, 20], [-110, -90], [-40, -170], [20, -130], [80, -200], [150, -60], [140, 30], [0, 50]], 6); for (const [x, y] of [[-70, -100], [30, -110], [90, -120], [-20, -40]]) { line(ctx, '#5a3a22', 5, [[x, y], [x, y + 24]], false); ell(ctx, '#3e9a4a', x, y - 8, 18, 20, 0, 3); } ell(ctx, '#ffe28a', 70, -60, 12, 12, 0, 2); },
      sunfruit(ctx, x = 0, y = 0, t = 0) { MYTH.sun(ctx, x, y, 60, t); },
      veena(ctx) { ctx.save(); ctx.rotate(-0.9); line(ctx, '#8a4a1c', 10, [[-150, 0], [130, 0]]); ell(ctx, lg(ctx, -60, 60, '#c8762a', '#8a4a1c'), -150, 10, 44, 40); ell(ctx, lg(ctx, -40, 40, '#c8762a', '#8a4a1c'), 120, 14, 30, 28); for (let i = 0; i < 4; i++) line(ctx, '#f4e8c8', 1.2, [[-140, -4 + i * 3], [110, -4 + i * 3]], false); ctx.restore(); },
      sword(ctx) { ctx.save(); ctx.rotate(-0.4); poly(ctx, '#dfe4ec', [[-6, -10], [6, -10], [4, -170], [0, -186], [-4, -170]], 3.5); line(ctx, GOLD, 8, [[-26, -10], [26, -10]]); line(ctx, '#6a3a1a', 8, [[0, -6], [0, 30]]); ctx.restore(); },
    };

    // ---------- the head ----------
    const eyes = (ctx, c, hx, hy, f, t, s0, rx) => {
      const ex = rx * 0.4, ey = hy - 2, look = f.look || [0, 0], blink = blinkAt(t, s0) && !['closed', 'happy'].includes(f.eyes), kind = blink ? 'closed' : (f.eyes || 'calm');
      for (const sd of [-1, 1]) {
        const x = hx + sd * ex;
        if (kind === 'happy') { path(ctx, null, () => { ctx.moveTo(x - 12, ey + 3); ctx.quadraticCurveTo(x, ey - 10, x + 12, ey + 3); }, 4.5); continue; }
        if (kind === 'closed') { path(ctx, null, () => { ctx.moveTo(x - 13, ey); ctx.quadraticCurveTo(x, ey + 8, x + 13, ey); }, 4.5); if (c.girl) line(ctx, INK, 2, [[x + sd * 12, ey], [x + sd * 17, ey - 3]], false); continue; }
        const w = kind === 'wide' ? 15 : 14, top = kind === 'wide' ? 14 : kind === 'calm' ? 10.5 : 12, bot = kind === 'wide' ? 11 : 7;
        path(ctx, '#fffaf2', () => { ctx.moveTo(x - w, ey); ctx.quadraticCurveTo(x - 2, ey - top * 1.5, x + w, ey - 1); ctx.quadraticCurveTo(x + 2, ey + bot * 1.3, x - w, ey); }, 0);
        ctx.save(); ctx.beginPath(); ctx.moveTo(x - w, ey); ctx.quadraticCurveTo(x - 2, ey - top * 1.5, x + w, ey - 1); ctx.quadraticCurveTo(x + 2, ey + bot * 1.3, x - w, ey); ctx.clip();
        const ir = kind === 'wide' ? 6.5 : 7.5, ix = x + look[0] * 5, iy = ey + look[1] * 3 + (kind === 'calm' ? 1.5 : 0);
        ell(ctx, c.redEyes ? '#b02020' : '#3a1e10', ix, iy, ir, ir, 0, 0); ell(ctx, '#0e0806', ix, iy, ir * 0.5, ir * 0.5, 0, 0); ell(ctx, '#ffffff', ix - 2.4, iy - 2.6, 2.2, 2.2, 0, 0); ctx.restore();
        // upper lid (thick) and lashes
        path(ctx, null, () => { ctx.moveTo(x - w - 1, ey + 1); ctx.quadraticCurveTo(x - 2, ey - top * 1.5, x + w + 1, ey - 2); }, c.girl ? 5 : 4.2);
        if (c.girl) line(ctx, INK, 2.4, [[x + sd * (w - 1), ey - 3], [x + sd * (w + 6), ey - 7]], false);
        if (f.tears) { ctx.fillStyle = 'rgba(140,200,255,0.85)'; ctx.beginPath(); ctx.ellipse(x + 4, ey + 16 + ((t * 40) % 20), 3.5, 6, 0, 0, TAU); ctx.fill(); }
      }
      // brows
      const bk = kind === 'angry' ? -1 : kind === 'sad' ? 1 : f.brows || 0;
      for (const sd of [-1, 1]) { const x = hx + sd * ex; path(ctx, null, () => { ctx.moveTo(x - sd * 13, ey - 18 + bk * 6); ctx.quadraticCurveTo(x, ey - 26 - (kind === 'wide' ? 5 : 0), x + sd * 14, ey - 20 - bk * 3); }, c.girl ? 3.5 : 5.5, c.monkey ? '#5a2410' : c.beard || '#1e1410'); }
    };
    const mouth = (ctx, c, hx, my, f, t) => {
      let m = f.mouth || 'smile'; if (f.talk && !['shout', 'puff'].includes(m)) { const k = Math.sin(t * 22) * 0.5 + 0.5; m = k > 0.55 ? 'open' : k > 0.25 ? 'o' : 'calm'; }
      const lip = c.girl ? '#c8323c' : INK;
      if (m === 'smile') path(ctx, null, () => { ctx.moveTo(hx - 13, my - 2); ctx.quadraticCurveTo(hx, my + 8, hx + 13, my - 2); }, c.girl ? 4.5 : 3.8, lip);
      else if (m === 'calm') path(ctx, null, () => { ctx.moveTo(hx - 9, my); ctx.quadraticCurveTo(hx, my + 3, hx + 9, my); }, 3.6, lip);
      else if (m === 'frown') path(ctx, null, () => { ctx.moveTo(hx - 12, my + 4); ctx.quadraticCurveTo(hx, my - 5, hx + 12, my + 4); }, 3.8, lip);
      else if (m === 'grin') { path(ctx, '#5a1a14', () => { ctx.moveTo(hx - 16, my - 3); ctx.quadraticCurveTo(hx, my + 18, hx + 16, my - 3); ctx.closePath(); }, 3.5); path(ctx, '#fff', () => { ctx.moveTo(hx - 14, my - 2); ctx.lineTo(hx + 14, my - 2); ctx.lineTo(hx + 10, my + 4); ctx.lineTo(hx - 10, my + 4); ctx.closePath(); }, 0); }
      else if (m === 'puff') { ell(ctx, c.muzzle || c.skin, hx - 24, my - 6, 16, 14, 0, 3); ell(ctx, c.muzzle || c.skin, hx + 24, my - 6, 16, 14, 0, 3); path(ctx, null, () => { ctx.moveTo(hx - 6, my); ctx.lineTo(hx + 6, my); }, 3.5); }
      else { const big = m === 'shout' ? 1.6 : m === 'o' ? 0.75 : 1; ell(ctx, '#5a1a14', hx, my + 3 * big, (m === 'o' ? 7 : 11) * big, 8 * big, 0, 3.5); ell(ctx, '#e0626a', hx, my + 7 * big, 6 * big, 3 * big, 0, 0); }
    };
    const crown = (ctx, c, hx, top, rx) => {
      if (c.crown === 'tall') {
        poly(ctx, gold(ctx, top - 96, top + 10), [[hx - rx * 0.95, top + 8], [hx - rx * 0.9, top - 30], [hx - rx * 0.55, top - 52], [hx - rx * 0.35, top - 84], [hx, top - 112], [hx + rx * 0.35, top - 84], [hx + rx * 0.55, top - 52], [hx + rx * 0.9, top - 30], [hx + rx * 0.95, top + 8]], 4.5);
        ell(ctx, '#d8283c', hx, top - 40, 10, 13, 0, 3); ell(ctx, '#2a9a6a', hx - rx * 0.55, top - 18, 6, 7, 0, 2.5); ell(ctx, '#2a9a6a', hx + rx * 0.55, top - 18, 6, 7, 0, 2.5); ell(ctx, GOLD_L, hx, top - 112, 7, 7, 0, 3);
        line(ctx, GOLD_D, 5, [[hx - rx * 0.95, top + 2], [hx + rx * 0.95, top + 2]], false);
      } else if (c.crown === 'krishna' || c.crown === 'small') {
        poly(ctx, gold(ctx, top - 50, top + 10), [[hx - rx * 0.85, top + 8], [hx - rx * 0.8, top - 22], [hx - rx * 0.35, top - 32], [hx, top - 56], [hx + rx * 0.35, top - 32], [hx + rx * 0.8, top - 22], [hx + rx * 0.85, top + 8]], 4.5);
        ell(ctx, '#d8283c', hx, top - 20, 8, 10, 0, 3);
      }
      if (c.feather) { // peacock feather leaning right
        ctx.save(); ctx.translate(hx + rx * 0.35, top - 16); ctx.rotate(0.35); line(ctx, '#3a7a3a', 3, [[0, 0], [0, -70]], false);
        for (let i = 0; i < 9; i++) line(ctx, '#2f8a4a', 2.2, [[0, -18 - i * 6], [-16 + i * 0.5, -30 - i * 7]], false), line(ctx, '#2f8a4a', 2.2, [[0, -18 - i * 6], [16 - i * 0.5, -30 - i * 7]], false);
        ell(ctx, '#2a9a5a', 0, -82, 20, 28, 0, 3); ell(ctx, '#2a7ac8', 0, -80, 13, 18, 0, 0); ell(ctx, '#f4c430', 0, -78, 8, 11, 0, 0); ell(ctx, '#18284a', 0, -78, 5, 7, 0, 0); ctx.restore();
      }
    };
    const head = (ctx, c, hx, hy, f, t, seed, scale = 1, layer = 'all') => {
      ctx.save(); ctx.translate(hx, hy); ctx.scale(scale, scale); ctx.translate(-hx, -hy);
      const rx = c.child ? 54 : c.elephant ? 56 : 46, ry = c.child ? 58 : c.elephant ? 60 : 55, top = hy - ry;
      // back hair (drawn behind the body: layer 'back')
      if (layer !== 'front') {
      if (c.longHair || c.girl) smooth(ctx, c.hair, [[hx - rx - 6, hy - 10], [hx - rx * 0.8, top - 6], [hx + rx * 0.8, top - 6], [hx + rx + 6, hy - 10], [hx + rx + 14, hy + 70], [hx + rx * 0.6, hy + 96], [hx - rx * 0.6, hy + 96], [hx - rx - 14, hy + 70]], 4.5);
      if (c.girl) { line(ctx, c.hair, 18, [[hx + rx * 0.6, hy + 60], [hx + rx * 1.3, hy + 200], [hx + rx * 1.2, hy + 300]]); for (let i = 0; i < 5; i++) ell(ctx, '#f4f0e0', hx + rx * (1.0 + i * 0.06), hy + 140 + i * 30, 5, 4, 0, 0); }
      if (c.jata) { // Shiva: tall matted bun with the crescent moon and Ganga
        smooth(ctx, c.hair, [[hx - rx * 0.9, top + 20], [hx - rx * 0.6, top - 70], [hx - 10, top - 110], [hx + 26, top - 96], [hx + rx * 0.7, top - 60], [hx + rx * 0.9, top + 20]], 4.5);
        for (let i = -2; i <= 2; i++) path(ctx, null, () => { ctx.moveTo(hx + i * 12, top + 4); ctx.quadraticCurveTo(hx + i * 16, top - 50, hx + i * 6, top - 90); }, 2.5, '#4a3a32');
        path(ctx, '#f8f6e8', () => { ctx.arc(hx + 30, top - 62, 22, -2.2, 1.1); ctx.arc(hx + 38, top - 66, 18, 1.0, -2.0, true); ctx.closePath(); }, 3.5);
        ctx.save(); ctx.globalAlpha = 0.8; line(ctx, '#bfe6ff', 6, [[hx - 6, top - 104], [hx - 26, top - 150], [hx - 10, top - 190]], false); ctx.restore();
      }
      }
      if (layer === 'back') { ctx.restore(); return; }
      if (c.jata) { line(ctx, '#2c2a3a', 20, [[hx - rx - 2, hy - 10], [hx - rx - 12, hy + 90]]); line(ctx, '#2c2a3a', 20, [[hx + rx + 2, hy - 10], [hx + rx + 12, hy + 90]]); }
      if (c.bun) ell(ctx, c.hair, hx, top - 6, 30, 22, 0, 4.5);
      // ears (elephant ears are huge and sit behind)
      if (c.elephant) { for (const sd of [-1, 1]) smooth(ctx, lg(ctx, hx - 130, hx + 130, c.skin, c.sh), [[hx + sd * 40, hy - 50], [hx + sd * 120, hy - 70], [hx + sd * 135, hy + 10], [hx + sd * 100, hy + 70], [hx + sd * 40, hy + 40]], 5); }
      else if (c.monkey) for (const sd of [-1, 1]) { ell(ctx, c.skin, hx + sd * (rx + 4), hy - 4, 14, 18, 0, 4.5); ell(ctx, c.muzzle, hx + sd * (rx + 4), hy - 2, 7, 10, 0, 0); }
      else for (const sd of [-1, 1]) { ell(ctx, c.skin, hx + sd * (rx - 2), hy + 4, 9, 15, 0, 4); ell(ctx, gold(ctx, hy + 14, hy + 40), hx + sd * (rx - 1), hy + 28, 7, 9, 0, 3); }
      // face
      const fill = lg(ctx, hx - rx, hx + rx, c.skin, c.sh);
      if (c.monkey) smooth(ctx, fill, [[hx - rx, hy - 6], [hx - rx * 0.8, top + 4], [hx, top - 4], [hx + rx * 0.8, top + 4], [hx + rx, hy - 6], [hx + rx * 0.9, hy + ry * 0.8], [hx, hy + ry + 6], [hx - rx * 0.9, hy + ry * 0.8]], 5);
      else ell(ctx, fill, hx, hy, rx, ry, 0, 5);
      if (c.monkey) { smooth(ctx, c.muzzle, [[hx - rx * 0.82, hy + 14], [hx - rx * 0.5, hy - 2], [hx, hy + 4], [hx + rx * 0.5, hy - 2], [hx + rx * 0.82, hy + 14], [hx + rx * 0.7, hy + ry * 0.9], [hx, hy + ry + 4], [hx - rx * 0.7, hy + ry * 0.9]], 4); ell(ctx, '#5a2410', hx, hy + 18, 7, 4.5, 0, 0); }
      if (c.tuft) path(ctx, c.hair, () => { ctx.moveTo(hx - 14, top + 6); ctx.quadraticCurveTo(hx - 6, top - 26, hx + 18, top - 30); ctx.quadraticCurveTo(hx + 4, top - 12, hx + 14, top + 6); ctx.closePath(); }, 4);
      if (c.curls) for (let i = -3; i <= 3; i++) ell(ctx, c.hair, hx + i * 14, top + 10 + Math.abs(i) * 5, 13, 12, 0, 3.5);
      if (c.topknot) { ell(ctx, c.hair, hx, top - 8, 18, 16, 0, 4); for (const sd of [-1, 1]) smooth(ctx, c.hair, [[hx + sd * rx * 0.8, hy - 30], [hx + sd * (rx + 10), hy - 10], [hx + sd * (rx + 8), hy + 30], [hx + sd * rx * 0.85, hy + 20]], 3.5); }
      if (c.turban) { smooth(ctx, c.turban, [[hx - rx - 6, top + 30], [hx - rx * 0.8, top - 16], [hx, top - 30], [hx + rx * 0.8, top - 16], [hx + rx + 6, top + 30], [hx, top + 22]], 4.5); for (let i = 0; i < 3; i++) path(ctx, null, () => { ctx.moveTo(hx - rx + 6, top + 16 - i * 12); ctx.quadraticCurveTo(hx, top - 2 - i * 14, hx + rx - 6, top + 16 - i * 12); }, 2.5, 'rgba(0,0,0,0.25)'); }
      // front hair line under the crown
      if ((c.longHair || c.girl || c.jata) && !c.monkey) path(ctx, c.hair, () => { ctx.moveTo(hx - rx, hy - 8); ctx.quadraticCurveTo(hx - rx * 0.9, top - 4, hx, top + 2); ctx.quadraticCurveTo(hx + rx * 0.9, top - 4, hx + rx, hy - 8); ctx.quadraticCurveTo(hx + rx * 0.6, top + 22, hx, top + 16); ctx.quadraticCurveTo(hx - rx * 0.6, top + 22, hx - rx, hy - 8); ctx.closePath(); }, 4);
      if (c.horns) for (const sd of [-1, 1]) poly(ctx, '#e8dcc0', [[hx + sd * 22, top + 12], [hx + sd * 56, top - 40], [hx + sd * 40, top + 18]], 4);
      eyes(ctx, c, hx, hy, f, t, seed, rx);
      // tilak
      const fy = hy - ry * 0.55;
      if (c.tilak === 'vaishnav') { line(ctx, '#fff4dc', 3, [[hx - 7, fy + 12], [hx - 7, fy - 12]], false); line(ctx, '#fff4dc', 3, [[hx + 7, fy + 12], [hx + 7, fy - 12]], false); line(ctx, '#e0302a', 3.5, [[hx, fy + 12], [hx, fy - 8]], false); }
      else if (c.tilak === 'shaiv') { for (let i = 0; i < 3; i++) line(ctx, '#f4f0e8', 2.6, [[hx - 18, fy - 6 + i * 6], [hx + 18, fy - 6 + i * 6]], false); ell(ctx, '#e0302a', hx, fy + 2, 4, 4, 0, 0); }
      else if (c.tilak === 'dot') ell(ctx, '#e0302a', hx, fy + 6, 4.5, 4.5, 0, 0);
      // nose, moustache / beard, mouth
      const my = c.monkey ? hy + 36 : c.elephant ? hy + 44 : hy + ry * 0.55;
      if (!c.monkey && !c.elephant) path(ctx, null, () => { ctx.moveTo(hx - 2, hy + 6); ctx.quadraticCurveTo(hx + 6, hy + 18, hx - 4, hy + 20); }, 3, 'rgba(60,24,10,0.7)');
      if (c.beard) smooth(ctx, c.beard, [[hx - rx * 0.85, hy + 10], [hx - rx * 0.7, hy + ry + 30], [hx, hy + ry + 70], [hx + rx * 0.7, hy + ry + 30], [hx + rx * 0.85, hy + 10], [hx, my + 6]], 4);
      if (c.elephant) { // trunk curling to the viewer's left, one tusk
        poly(ctx, '#fffaf0', [[hx + 22, hy + 24], [hx + 46, hy + 60], [hx + 30, hy + 30]], 3.5);
        curve(ctx, c.skin, 30, [hx, hy + 14], [hx - 6, hy + 110], [hx - 56, hy + 104]); curve(ctx, c.skin, 18, [hx - 56, hy + 104], [hx - 76, hy + 96], [hx - 66, hy + 76]);
        for (let i = 0; i < 4; i++) line(ctx, c.sh, 2, [[hx - 12, hy + 40 + i * 14], [hx + 12, hy + 40 + i * 14]], false);
      } else mouth(ctx, c, hx, my, f, t);
      if (c.mustache && !c.beard) path(ctx, c.hair, () => { ctx.moveTo(hx, my - 8); ctx.quadraticCurveTo(hx - 16, my - 14, hx - 30, my - 2); ctx.quadraticCurveTo(hx - 14, my - 6, hx, my - 4); ctx.quadraticCurveTo(hx + 14, my - 6, hx + 30, my - 2); ctx.quadraticCurveTo(hx + 16, my - 14, hx, my - 8); ctx.closePath(); }, 3);
      if (c.tusks) for (const sd of [-1, 1]) poly(ctx, '#fffaf0', [[hx + sd * 12, my], [hx + sd * 16, my - 18], [hx + sd * 22, my]], 3);
      if (c.girl) { ell(ctx, 'rgba(240,110,110,0.28)', hx - rx * 0.55, hy + 16, 10, 6, 0, 0); ell(ctx, 'rgba(240,110,110,0.28)', hx + rx * 0.55, hy + 16, 10, 6, 0, 0); }
      crown(ctx, c, hx, top + (c.monkey ? 10 : 14), rx);
      ctx.restore();
    };

    // ---------- the whole figure ----------
    const person = (ctx, x, y, s, o = {}) => {
      const c = Object.assign({}, CAST[o.who] || CAST.deva, o.style || {}), t = o.t || 0, f = o.face || {}, seed = (o.who || '').length * 7 + x * 0.01;
      const B = c.child ? { hy: -402, sh: -310, sw: 56, wy: -205, ww: 42, arm: 0.66, dh: -36, hs: 1 } : { hy: -548 * (c.h || 1), sh: -462 * (c.h || 1), sw: 80 * (c.muscle || 1), wy: -300 * (c.h || 1), ww: 52 * (c.muscle || 1) * (c.belly ? 1.25 : 1), arm: 1, dh: -40, hs: 1 };
      const arms = o.arms && o.arms.r && Array.isArray(o.arms.r) ? o.arms : resolveArms(o.arms);
      const pose = o.pose || 'stand', sit = pose === 'sit';
      const sway = Math.sin(t * 2.2 + seed) * 4;
      ctx.save(); ctx.translate(x, y + (o.bob || 0)); ctx.scale(s * (o.flip ? -1 : 1), s); if (o.lean) ctx.rotate(o.lean);
      if (sit) ctx.translate(0, -B.wy - 110 * B.arm - 30);  // hips sit on the ground
      const cx = 0, shL = [cx - B.sw, B.sh], shR = [cx + B.sw, B.sh], hy = B.hy;
      // aura behind everything
      if (o.halo) MYTH.aura(ctx, cx, hy - 10, c.child ? 110 : 120, t, o.haloCol);
      if (o.glow) { const g = ctx.createRadialGradient(0, B.wy, 20, 0, B.wy, 420); g.addColorStop(0, o.glow); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(-440, B.wy - 440, 880, 880); }
      // tail (behind)
      if (c.tail) { const k = c.child ? 0.75 : 1, w = Math.sin(t * 2.5 + seed) * 18; ctx.save(); ctx.scale(k, k); curve(ctx, c.skin, 16, [30, B.wy / k + 20], [170, B.wy / k + 60 + w], [150, B.wy / k - 120]); curve(ctx, c.skin, 14, [150, B.wy / k - 120], [130, B.wy / k - 240 - w], [190, B.wy / k - 250]); ell(ctx, c.hair, 192, B.wy / k - 250, 14, 12, 0, 4); ctx.restore(); }
      // Ravana's extra heads, behind the main one
      if (c.heads) { const ex = c.heads >= 10 ? [-4, -3, -2, -1, 1, 2, 3, 4, 5] : [-1, 1], sp = c.heads >= 10 ? 74 : 66; for (const i of ex.sort((a, b) => Math.abs(b) - Math.abs(a))) head(ctx, c, cx + i * sp, hy + Math.abs(i) * 8 + 10, Object.assign({}, f, { talk: false }), t + i, seed + i, 0.82); }
      head(ctx, c, cx, hy, f, t, seed, 1, 'back');
      // legs + lower cloth
      if (sit) {
        smooth(ctx, lg(ctx, -190, 190, c.cloth, shade(c.cloth)), [[-180, B.wy + 150], [-150, B.wy + 80], [-40, B.wy + 40], [40, B.wy + 40], [150, B.wy + 80], [180, B.wy + 150], [0, B.wy + 175]], 5);
        ell(ctx, c.skin, -110, B.wy + 150, 26, 14, -0.2, 4); ell(ctx, c.skin, 110, B.wy + 150, 26, 14, 0.2, 4);
      } else if (c.girl) {
        const sw2 = Math.sin(t * 2 + seed) * 6;
        smooth(ctx, lg(ctx, -150, 150, c.cloth, shade(c.cloth)), [[-B.ww - 4, B.wy], [B.ww + 4, B.wy], [B.ww + 70, -20], [B.ww + 70 + sw2, 0], [-B.ww - 70 + sw2, 0], [-B.ww - 70, -20]], 5);
        line(ctx, c.cloth2, 12, [[-B.ww - 60, -24], [B.ww + 60, -24]], false); for (let i = -2; i <= 2; i++) path(ctx, null, () => { ctx.moveTo(i * 22, B.wy + 30); ctx.quadraticCurveTo(i * 28 + sw2, -120, i * 36, -2); }, 2.5, 'rgba(0,0,0,0.18)');
        ell(ctx, c.skin, -28, 0, 20, 9, 0, 4); ell(ctx, c.skin, 28, 0, 20, 9, 0, 4);
      } else {
        const legW = c.child ? 22 : 28 * (c.muscle || 1);
        for (const sd of [-1, 1]) { line(ctx, c.skin, legW, [[sd * 26, B.wy + 120], [sd * 30, -14]]); ell(ctx, c.skin, sd * 38, -6, 26, 11, 0, 4); line(ctx, GOLD, 5, [[sd * 30 - 14, -30], [sd * 30 + 14, -30]], false); }
        if (c.tiger) { smooth(ctx, lg(ctx, -110, 110, c.cloth, shade(c.cloth)), [[-B.ww - 6, B.wy], [B.ww + 6, B.wy], [B.ww + 40, B.wy + 170], [0, B.wy + 196], [-B.ww - 40, B.wy + 170]], 5); for (let i = 0; i < 6; i++) line(ctx, '#2a1a10', 5, [[-B.ww + i * 22, B.wy + 40 + (i % 2) * 30], [-B.ww + i * 22 + 14, B.wy + 70 + (i % 2) * 30]], false); }
        else { const dh = c.child ? B.wy + 140 : B.dh - 40; smooth(ctx, lg(ctx, -120, 120, c.cloth, shade(c.cloth)), [[-B.ww - 6, B.wy], [B.ww + 6, B.wy], [B.ww + 34, dh], [12, dh + 14], [-B.ww - 34, dh]], 5);
          for (let i = -1; i <= 1; i++) path(ctx, null, () => { ctx.moveTo(i * 16, B.wy + 20); ctx.quadraticCurveTo(i * 20 + sway, (B.wy + dh) / 2, i * 26, dh); }, 2.5, 'rgba(0,0,0,0.2)');
          poly(ctx, c.cloth2, [[-12, B.wy + 4], [12, B.wy + 4], [18 + sway, B.wy + 150], [-18 + sway, B.wy + 150]], 4); }
      }
      // torso
      const sk = lg(ctx, -B.sw - 20, B.sw + 20, c.skin, c.sh);
      if (c.girl) {
        smooth(ctx, sk, [[shL[0] + 6, shL[1] + 6], [0, B.sh - 14], [shR[0] - 6, shR[1] + 6], [B.ww + 6, B.wy], [-B.ww - 6, B.wy]], 5);
        smooth(ctx, c.cloth2, [[shL[0] + 14, shL[1] + 12], [shR[0] - 14, shR[1] + 12], [B.ww - 6, B.sh + 66], [-B.ww + 6, B.sh + 66]], 4);
        poly(ctx, lg(ctx, -90, 90, c.cloth, shade(c.cloth)), [[shL[0] + 2, shL[1] + 4], [shL[0] + 40, shL[1] - 2], [B.ww + 10, B.wy + 4], [B.ww - 22, B.wy + 4]], 4);
      } else {
        smooth(ctx, sk, [[shL[0] - 8, shL[1] + 10], [shL[0] + 10, B.sh - 14], [0, B.sh - 20], [shR[0] - 10, B.sh - 14], [shR[0] + 8, shR[1] + 10], [B.ww + (c.belly ? 30 : 4), B.wy - 40], [B.ww + 4, B.wy + 6], [-B.ww - 4, B.wy + 6], [-B.ww - (c.belly ? 30 : 4), B.wy - 40]], 5);
        if (c.belly) ell(ctx, lg(ctx, -80, 80, c.skin, c.sh), 0, B.wy - 46, 74, 62, 0, 4);
        if (!c.child && !c.belly) { path(ctx, null, () => { ctx.moveTo(-B.sw * 0.55, B.sh + 64); ctx.quadraticCurveTo(-B.sw * 0.2, B.sh + 80, -4, B.sh + 64); }, 3, 'rgba(60,24,10,0.35)'); path(ctx, null, () => { ctx.moveTo(4, B.sh + 64); ctx.quadraticCurveTo(B.sw * 0.2, B.sh + 80, B.sw * 0.55, B.sh + 64); }, 3, 'rgba(60,24,10,0.35)'); }
        if (c.armor) smooth(ctx, gold(ctx, B.sh, B.wy), [[shL[0] + 6, shL[1] + 16], [shR[0] - 6, shR[1] + 16], [B.ww, B.wy - 6], [-B.ww, B.wy - 6]], 4);
        if (c.tilak === 'vaishnav' || c.tilak === 'shaiv' || c.sage) line(ctx, '#fff6e0', 2.4, [[shL[0] + 26, B.sh + 6], [B.ww - 6, B.wy - 10]], false);  // sacred thread
      }
      // belt, sash and jewellery
      line(ctx, GOLD, 9, [[-B.ww - 4, B.wy + 4], [B.ww + 4, B.wy + 4]]);
      if (!c.girl && !c.child) path(ctx, null, () => { ctx.moveTo(shL[0] + 10, shL[1] + 8); ctx.bezierCurveTo(shL[0] - 30, B.wy - 30, shR[0] + 30, B.wy - 30, shR[0] - 10, shR[1] + 8); }, 9, c.cloth2);
      const neck = B.sh - 6;
      ell(ctx, sk, 0, neck - 10, c.child ? 20 : 22, 22, 0, 0);
      path(ctx, null, () => { ctx.moveTo(-B.sw * 0.5, neck); ctx.quadraticCurveTo(0, neck + 46, B.sw * 0.5, neck); }, 7, GOLD); path(ctx, null, () => { ctx.moveTo(-B.sw * 0.5, neck); ctx.quadraticCurveTo(0, neck + 46, B.sw * 0.5, neck); }, 2, GOLD_D);
      ell(ctx, '#d8283c', 0, neck + 24, 6, 7, 0, 2);
      if (c.beads) for (let i = 0; i <= 10; i++) { const k = i / 10, xx = mix(-B.sw * 0.6, B.sw * 0.6, k), yy = neck + Math.sin(k * Math.PI) * 80; ell(ctx, '#6a2a1a', xx, yy, 5, 5, 0, 1.5); }
      if (c.garland) for (let i = 0; i <= 14; i++) { const k = i / 14, xx = mix(-B.sw * 0.7, B.sw * 0.7, k), yy = neck + Math.sin(k * Math.PI) * 150; ell(ctx, i % 2 ? '#f4c430' : '#f2f2f2', xx, yy, 7, 7, 0, 1.5); }
      if (c.snake) { curve(ctx, '#3a8a5a', 9, [-B.sw * 0.5, neck + 6], [0, neck + 40], [B.sw * 0.5, neck + 6]); curve(ctx, '#3a8a5a', 9, [B.sw * 0.5, neck + 6], [B.sw * 0.7, neck - 30], [B.sw * 0.45, neck - 44]); ell(ctx, '#3a8a5a', B.sw * 0.42, neck - 48, 11, 8, 0.4, 3); }
      if (c.scarf) { const w = Math.sin(t * 4) * 20; curve(ctx, c.scarf, 12, [shL[0] + 6, shL[1] + 6], [shL[0] - 120, B.sh - 40 + w], [shL[0] - 200, B.sh + 40 - w], false); curve(ctx, c.scarf, 12, [shR[0] - 6, shR[1] + 6], [shR[0] + 120, B.sh - 40 - w], [shR[0] + 200, B.sh + 40 + w], false); }
      // arms
      const hands = {};
      for (const [sd, sh, A] of [[-1, shL, arms.l], [1, shR, arms.r]]) {
        const e = [sh[0] + sd * A[0][0] * B.arm, sh[1] + A[0][1] * B.arm], h = [sh[0] + sd * A[1][0] * B.arm, sh[1] + A[1][1] * B.arm], w = (c.child ? 20 : 25) * (c.muscle || 1);
        line(ctx, c.skin, w, [sh, e, h]);
        const mid = [(sh[0] + e[0]) / 2, (sh[1] + e[1]) / 2], ang = Math.atan2(e[1] - sh[1], e[0] - sh[0]);
        ell(ctx, GOLD, mid[0], mid[1], 5, w * 0.55 + 2, ang, 2.5); const bp = [mix(e[0], h[0], 0.8), mix(e[1], h[1], 0.8)], ang2 = Math.atan2(h[1] - e[1], h[0] - e[0]);
        ell(ctx, GOLD, bp[0], bp[1], 5, w * 0.5 + 2, ang2, 2.5);
        ell(ctx, c.skin, h[0], h[1], c.child ? 13 : 15, c.child ? 13 : 15, 0, 4);
        if (c.armor) ell(ctx, gold(ctx, sh[1] - 20, sh[1] + 20), sh[0], sh[1] + 4, 26, 20, 0, 4);
        hands[sd > 0 ? 'r' : 'l'] = h;
      }
      // held items
      const hold = (item, h, sd) => { if (!item) return; ctx.save(); ctx.translate(...h); if (sd < 0) ctx.scale(-1, 1); const fn = ITEMS[item]; if (item === 'chakra') fn(ctx, 0, -60, t); else if (item === 'vajra') fn(ctx, 0, 20, t); else if (item === 'sunfruit') fn(ctx, 0, -70, t); else fn(ctx); ctx.restore(); };
      hold(o.hold, hands.r, 1); hold(o.holdL, hands.l, -1);
      // head
      head(ctx, c, cx, hy, f, t, seed, 1, 'front');
      ctx.restore();
      // canvas-space anchors for the story (approximate when leaning)
      const k = s * (o.flip ? -1 : 1), oy = sit ? -B.wy - 110 * B.arm - 30 : 0, tx = (p) => [x + p[0] * k, y + (o.bob || 0) + (p[1] + oy) * s];
      return { head: tx([0, hy]), mouth: tx([0, hy + 30]), hands: { r: tx(hands.r), l: tx(hands.l) }, chest: tx([0, B.sh + 60]) };
    };
    const shade = (hex) => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, d = (v) => Math.round(v * 0.78).toString(16).padStart(2, '0'); return '#' + d(r) + d(g) + d(b); };

    // ---------- FX ----------
    const aura = (ctx, x, y, r, t, col = 'rgba(255,214,110,') => {
      ctx.save(); ctx.translate(x, y);
      let g = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 2.2); g.addColorStop(0, col + '0.55)'); g.addColorStop(1, col + '0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 2.2, 0, TAU); ctx.fill();
      ctx.rotate(t * 0.25); ctx.fillStyle = col + '0.22)'; for (let i = 0; i < 16; i++) { ctx.rotate(TAU / 16); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 2.1, -r * 0.12); ctx.lineTo(r * 2.1, r * 0.12); ctx.closePath(); ctx.fill(); }
      ctx.rotate(-t * 0.25); ctx.lineWidth = 6; ctx.strokeStyle = col + '0.9)'; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, r - 12, 0, TAU); ctx.stroke(); ctx.restore(); };
    const sun = (ctx, x, y, r, t, face = false) => {
      ctx.save(); ctx.translate(x, y);
      let g = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 3); g.addColorStop(0, 'rgba(255,190,60,0.75)'); g.addColorStop(1, 'rgba(255,120,30,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 3, 0, TAU); ctx.fill();
      ctx.save(); ctx.rotate(t * 0.3); ctx.fillStyle = 'rgba(255,170,40,0.85)'; for (let i = 0; i < 18; i++) { ctx.rotate(TAU / 18); ctx.beginPath(); ctx.moveTo(r * 0.9, -r * 0.16); ctx.lineTo(r * 1.45 + Math.sin(t * 4 + i) * r * 0.08, 0); ctx.lineTo(r * 0.9, r * 0.16); ctx.closePath(); ctx.fill(); } ctx.restore();
      g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r); g.addColorStop(0, '#fff6c0'); g.addColorStop(0.5, '#ffc83a'); g.addColorStop(1, '#f07a1c'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.lineWidth = Math.max(2, r * 0.04); ctx.strokeStyle = '#c85a14'; ctx.stroke();
      if (face) { ctx.fillStyle = '#c85a14'; ctx.lineWidth = r * 0.05; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * r * 0.32, -r * 0.08, r * 0.12, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } ctx.beginPath(); ctx.arc(0, r * 0.18, r * 0.3, 0.2, Math.PI - 0.2); ctx.stroke(); }
      ctx.restore(); };
    const rays = (ctx, W, H_, t, x, y, col = 'rgba(255,230,150,', a = 0.18) => { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.05); for (let i = 0; i < 14; i++) { ctx.rotate(TAU / 14); ctx.fillStyle = col + (a * (i % 2 ? 1 : 0.55)) + ')'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1600, -120); ctx.lineTo(1600, 120); ctx.closePath(); ctx.fill(); } ctx.restore(); };
    const petals = (ctx, W, t, at, n = 26) => { if (t < at) return; for (let i = 0; i < n; i++) { const u = t - at - (i % 7) * 0.12, yy = -40 + u * (120 + (i * 37) % 90), xx = ((i * 97) % W) + Math.sin(u * 2 + i) * 30; if (yy > 1320 || u < 0) continue; ctx.save(); ctx.translate(xx, yy); ctx.rotate(u * 2 + i); ctx.fillStyle = i % 3 ? '#ff8a3a' : '#f4c430'; ctx.beginPath(); ctx.ellipse(0, 0, 9, 5, 0, 0, TAU); ctx.fill(); ctx.restore(); } };
    const lightning = (ctx, x0, y0, x1, y1, t, w = 8) => { const n = 9, pts = []; for (let i = 0; i <= n; i++) { const k = i / n, j = i && i < n ? (Math.sin(i * 91.7 + Math.floor(t * 18) * 13.1) * 40) : 0; pts.push([mix(x0, x1, k) + j, mix(y0, y1, k)]); }
      ctx.save(); ctx.shadowColor = '#9ad8ff'; ctx.shadowBlur = 30; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(150,210,255,0.7)'; ctx.lineWidth = w * 2.4; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = w; ctx.stroke(); ctx.restore(); };
    const shock = (ctx, x, y, t, at, col = 'rgba(255,240,200,') => { const u = (t - at) / 0.6; if (u < 0 || u > 1) return; ctx.save(); ctx.strokeStyle = col + (1 - u) + ')'; ctx.lineWidth = 18 * (1 - u) + 2; ctx.beginPath(); ctx.arc(x, y, 40 + u * 420, 0, TAU); ctx.stroke(); ctx.fillStyle = col + (0.6 * (1 - u) * (1 - u)) + ')'; ctx.beginPath(); ctx.arc(x, y, 60 + u * 200, 0, TAU); ctx.fill(); ctx.restore(); };
    const speed = (ctx, W, H_, t, dir = 1, a = 0.5) => { ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { const x = (i * 131) % W, len = 120 + (i * 53) % 200, y = (((i * 211) + t * 2400 * dir) % (H_ + 400)) - 200; ctx.lineWidth = 2 + (i % 3) * 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + len); ctx.stroke(); } ctx.restore(); };
    // the nine planets (navagraha) as glowing orbs on a ring; spin: speed, k: 0..1 visible
    const GRAHA = ['#ffb43a', '#f4f4ff', '#e8402a', '#3ab06a', '#f4d03a', '#f8f8f8', '#3a4a9a', '#6a4a7a', '#8a6a5a'];
    const grahas = (ctx, x, y, r, t, spin = 0.3, k = 1, skip = -1) => { for (let i = 0; i < 9; i++) { if (i === skip) continue; const a = (i / 9) * TAU + t * spin, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.45, s = 22 * k;
      const g = ctx.createRadialGradient(px, py, 2, px, py, s * 2.4); g.addColorStop(0, GRAHA[i]); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, s * 2.4, 0, TAU); ctx.fill(); ell(ctx, GRAHA[i], px, py, s, s, 0, 3); } };
    const chains = (ctx, x0, y0, x1, y1, n = 10) => { for (let i = 0; i <= n; i++) { const k = i / n; ell(ctx, null, mix(x0, x1, k), mix(y0, y1, k) + Math.sin(k * Math.PI) * 30, 10, 6, i % 2 ? 0 : Math.PI / 2, 5); ctx.save(); ell(ctx, null, mix(x0, x1, k), mix(y0, y1, k) + Math.sin(k * Math.PI) * 30, 10, 6, i % 2 ? 0 : Math.PI / 2, 2.5); ctx.restore(); } };
    const dark = (ctx, W, H_, a) => { if (a <= 0) return; ctx.fillStyle = `rgba(4,4,16,${Math.min(0.92, a)})`; ctx.fillRect(0, 0, W, H_); };
    const flame = (ctx, x, y, s, t) => { for (let i = 0; i < 3; i++) { const k = 1 - i * 0.3, fl = Math.sin(t * 14 + i) * 6; ctx.fillStyle = ['#e8401c', '#f4a020', '#fff0a0'][i]; ctx.beginPath(); ctx.moveTo(x - 30 * s * k, y); ctx.quadraticCurveTo(x - 34 * s * k, y - 50 * s * k, x + fl, y - 100 * s * k); ctx.quadraticCurveTo(x + 34 * s * k, y - 50 * s * k, x + 30 * s * k, y); ctx.closePath(); ctx.fill(); } };
    const om = (ctx, x, y, size, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.font = `${size}px "Noto Sans Devanagari", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = 'rgba(255,200,80,0.9)'; ctx.shadowBlur = 30; ctx.fillStyle = '#ffe08a'; ctx.fillText('ॐ', x, y); ctx.restore(); };
    // a gold-framed card with Hindi text (pops in at `at`)
    const card = (ctx, W, H_, t, at, txt, o = {}) => { const u = popU(t, at, 0.35); if (u <= 0) return; const y = o.y || 560, size = o.size || 64; ctx.save(); ctx.translate(W / 2, y); ctx.scale(u, u); ctx.font = `${size}px "Yatra One", "Noto Sans Devanagari", sans-serif`; const w = Math.min(330, ctx.measureText(txt).width / 2 + 54), hh = size * 0.95;
      ctx.fillStyle = 'rgba(70,14,10,0.92)'; ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-w, -hh, w * 2, hh * 2, 22); ctx.fill(); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = GOLD_L; ctx.beginPath(); ctx.roundRect(-w + 10, -hh + 10, w * 2 - 20, hh * 2 - 20, 14); ctx.stroke();
      ctx.fillStyle = gold(ctx, -size * 0.6, size * 0.6); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, size * 0.08); ctx.restore(); };
    // the series title banner at the top (first seconds)
    const banner = (ctx, W, t, txt, until = 3.2) => { const a = Math.min(1, t / 0.3) * Math.min(1, Math.max(0, (until - t) / 0.4)); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = '58px "Yatra One", "Noto Sans Devanagari", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(60,10,6,0.95)'; ctx.lineJoin = 'round'; ctx.strokeText(txt, W / 2, 214); ctx.fillStyle = gold(ctx, 180, 250); ctx.fillText(txt, W / 2, 214); ctx.restore(); };

    // ---------- sets (720 x 1280 world) ----------
    const sky = (ctx, W, H_, cols) => { const g = ctx.createLinearGradient(0, 0, 0, H_); cols.forEach((c, i) => g.addColorStop(i / (cols.length - 1), c)); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H_ + 400); };
    const stars = (ctx, W, H_, t, n = 90, a = 1) => { for (let i = 0; i < n; i++) { const x = (i * 197) % (W + 300) - 150, y = (i * 113) % (H_ * 0.8) - 100, tw = 0.5 + 0.5 * Math.sin(t * 2 + i); ctx.fillStyle = `rgba(255,255,240,${a * (0.3 + 0.6 * tw)})`; ctx.beginPath(); ctx.arc(x, y, 1.2 + (i % 3), 0, TAU); ctx.fill(); } };
    const cloud = (ctx, x, y, s, col = '#ffffff', a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; for (const [dx, dy, r] of [[-60, 10, 40], [-20, -14, 52], [32, -6, 46], [70, 14, 34], [0, 18, 46]]) { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill(); } ctx.restore(); };
    const hills = (ctx, W, y, col, amp, seed) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-200, 1500); for (let x = -200; x <= W + 200; x += 40) ctx.lineTo(x, y - amp * (0.5 + 0.5 * Math.sin(x * 0.006 + seed) * Math.cos(x * 0.011 + seed * 2))); ctx.lineTo(W + 200, 1500); ctx.closePath(); ctx.fill(); };
    const tree = (ctx, x, y, s, col = '#2f8a4a', col2 = '#22693a') => { line(ctx, '#6a4426', 26 * s, [[x, y], [x + 6 * s, y - 180 * s]]); for (const [dx, dy, r, cc] of [[-60, -200, 70, col2], [60, -210, 66, col2], [0, -260, 86, col], [-40, -170, 56, col], [46, -176, 56, col]]) ell(ctx, cc, x + dx * s, y + dy * s, r * s, r * s * 0.86, 0, 4 * s); };
    const SKIES = { dawn: ['#3a3a7a', '#e87a5a', '#ffc87a'], day: ['#5aa8e8', '#9ad0f4', '#e8f4fa'], dusk: ['#2a1a4a', '#b8445a', '#f49a4a'], night: ['#060a24', '#16204a', '#2a3466'] };
    const sets = {
      space(ctx, W, H_, t, o) { sky(ctx, W, H_, ['#05040f', '#120a2a', '#1c0e30']); const g = ctx.createRadialGradient(W * 0.7, H_ * 0.3, 10, W * 0.7, H_ * 0.3, 700); g.addColorStop(0, 'rgba(160,60,200,0.25)'); g.addColorStop(1, 'rgba(160,60,200,0)'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H_ + 400); stars(ctx, W, H_ * 1.3, t, 140);
        if (o.sun !== false) sun(ctx, o.sx ?? W * 0.5, o.sy ?? 420, o.sr ?? 170, t, o.face); if (o.earth) { const gg = ctx.createRadialGradient(W * 0.3, H_ + 260, 100, W * 0.5, H_ + 500, 900); gg.addColorStop(0, '#5ab0e8'); gg.addColorStop(0.6, '#2a6ab0'); gg.addColorStop(1, '#0a1a3a'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(W * 0.5, H_ + 600, 820, 0, TAU); ctx.fill(); } },
      sky(ctx, W, H_, t, o) { const tm = o.time || 'day'; sky(ctx, W, H_, SKIES[tm]); if (tm === 'night') stars(ctx, W, H_, t); if (o.sun) sun(ctx, o.sx ?? W * 0.7, o.sy ?? 300, o.sr ?? 80, t);
        for (let i = 0; i < 7; i++) { const sp = o.rush ? 900 : 12, y = ((i * 260 + t * sp) % (H_ + 500)) - 250; cloud(ctx, ((i * 233) % (W + 200)) - 100, y, 1 + (i % 3) * 0.4, tm === 'night' ? '#4a5480' : tm === 'dusk' ? '#f4b0a0' : '#ffffff', 0.85); } },
      heaven(ctx, W, H_, t, o) { sky(ctx, W, H_, ['#f6c27a', '#fbe0b0', '#fff4dc']); rays(ctx, W, H_, t, W / 2, 200, 'rgba(255,255,230,', 0.25);
        for (const sd of [-1, 1]) { const x = W / 2 + sd * 300; ctx.fillStyle = lg(ctx, x - 40, x + 40, '#fff0c8', '#e0b870'); ctx.fillRect(x - 36, 260, 72, 900); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(x - 36, 260, 72, 900); ctx.fillStyle = GOLD; ctx.fillRect(x - 50, 230, 100, 36); ctx.strokeRect(x - 50, 230, 100, 36); ctx.fillRect(x - 50, 1120, 100, 30); }
        for (let i = 0; i < 9; i++) cloud(ctx, ((i * 120 + t * 10) % (W + 300)) - 150, 1140 + (i % 2) * 40, 1.5, '#fffaf0', 0.95); if (o.om) om(ctx, W / 2, 330, 130, 0.5); },
      forest(ctx, W, H_, t, o) { const tm = o.time || 'day'; sky(ctx, W, H_, SKIES[tm]); if (tm === 'night') stars(ctx, W, H_, t); if (o.sun) sun(ctx, o.sx ?? W * 0.72, o.sy ?? 520, o.sr ?? 70, t);
        hills(ctx, W, 820, tm === 'night' ? '#1a2a3a' : '#7ab08a', 120, 1); hills(ctx, W, 920, tm === 'night' ? '#14222a' : '#4a9a5a', 90, 3);
        ctx.fillStyle = vg(ctx, 980, H_, tm === 'night' ? '#1a3a2a' : '#5aa04a', tm === 'night' ? '#0e2418' : '#3a7a34'); ctx.fillRect(-200, 980, W + 400, 600);
        if (o.hut) { const x = o.hut; poly(ctx, '#c8945a', [[x - 120, 1040], [x + 120, 1040], [x + 120, 900], [x - 120, 900]], 5); poly(ctx, '#d8b060', [[x - 160, 910], [x, 780], [x + 160, 910]], 5); poly(ctx, '#5a3a22', [[x - 30, 1040], [x + 30, 1040], [x + 30, 950], [x - 30, 950]], 4); }
        tree(ctx, -30, 1060, 1.3); tree(ctx, W + 20, 1080, 1.4); tree(ctx, 150, 1000, 0.7, '#3a9a52'); tree(ctx, W - 160, 990, 0.65, '#3a9a52');
        for (let i = 0; i < 14; i++) ell(ctx, i % 2 ? '#f4c430' : '#ff8a8a', (i * 61) % W, 1100 + (i * 37) % 120, 5, 5, 0, 0); },
      palace(ctx, W, H_, t, o) { sky(ctx, W, H_, ['#6a1a1a', '#a8402a', '#c8643a']); ctx.fillStyle = 'rgba(255,200,120,0.12)'; for (let i = 0; i < 3; i++) { const x = 120 + i * 240; ctx.beginPath(); ctx.moveTo(x - 80, 1000); ctx.lineTo(x - 80, 420); ctx.quadraticCurveTo(x - 80, 300, x, 260); ctx.quadraticCurveTo(x + 80, 300, x + 80, 420); ctx.lineTo(x + 80, 1000); ctx.fill(); }
        for (const x of [0, 240, 480, 720]) { ctx.fillStyle = lg(ctx, x - 34, x + 34, '#f0c070', '#b07a30'); ctx.fillRect(x - 30, 200, 60, 900); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(x - 30, 200, 60, 900); ctx.fillStyle = GOLD; ctx.fillRect(x - 44, 190, 88, 30); ctx.fillRect(x - 44, 1080, 88, 30); }
        for (let i = 0; i < 4; i++) { const x = 120 + i * 160, y = 160 + Math.sin(t * 1.5 + i) * 4; line(ctx, GOLD_D, 2, [[x, 0], [x, y]], false); ell(ctx, GOLD, x, y + 14, 16, 18, 0, 3); flame(ctx, x, y + 2, 0.18, t + i); }
        ctx.fillStyle = vg(ctx, 1080, H_, '#8a1e2a', '#5a1018'); ctx.fillRect(-200, 1080, W + 400, 400); ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.strokeRect(80, 1120, W - 160, 300);
        if (o.throne) { const x = o.throne; poly(ctx, gold(ctx, 700, 1100), [[x - 110, 1100], [x - 110, 820], [x - 70, 760], [x, 720], [x + 70, 760], [x + 110, 820], [x + 110, 1100]], 5); ctx.fillStyle = '#c8283c'; ctx.fillRect(x - 80, 840, 160, 200); } },
      kailash(ctx, W, H_, t, o) { sky(ctx, W, H_, SKIES.night); stars(ctx, W, H_, t, 120); path(ctx, '#f8f6e8', () => { ctx.arc(W * 0.78, 220, 46, -2.2, 1.1); ctx.arc(W * 0.78 + 14, 210, 40, 1.0, -2.0, true); ctx.closePath(); }, 0);
        poly(ctx, lg(ctx, 100, 620, '#e8eef8', '#9aaac8'), [[-100, 1000], [200, 520], [300, 600], [380, 380], [520, 640], [820, 1000]], 5); poly(ctx, '#7a8aa8', [[380, 380], [520, 640], [440, 560], [400, 700]], 0);
        hills(ctx, W, 1000, '#3a4a6a', 60, 2); ctx.fillStyle = vg(ctx, 1020, H_, '#4a5a7a', '#2a3450'); ctx.fillRect(-200, 1030, W + 400, 500); for (let i = 0; i < 40; i++) ell(ctx, 'rgba(255,255,255,0.8)', (i * 97 + t * 20) % W, (i * 211 + t * 60) % H_, 2.5, 2.5, 0, 0); },
      ocean(ctx, W, H_, t, o) { const tm = o.time || 'day'; sky(ctx, W, H_, SKIES[tm]); if (tm === 'night') stars(ctx, W, H_, t); if (o.sun) sun(ctx, W * 0.5, 700, 90, t);
        for (let k = 0; k < 6; k++) { const y = 760 + k * 90; ctx.fillStyle = ['#2a6ab0', '#2860a0', '#225692', '#1c4c84', '#184276', '#143868'][k]; ctx.beginPath(); ctx.moveTo(-200, y); for (let x = -200; x <= W + 200; x += 20) ctx.lineTo(x, y + Math.sin(x * 0.02 + t * 2 + k) * 10); ctx.lineTo(W + 200, 1500); ctx.lineTo(-200, 1500); ctx.closePath(); ctx.fill(); }
        if (o.lanka) { ctx.fillStyle = '#d8a030'; for (let i = 0; i < 7; i++) { const x = 420 + i * 40, hh = 60 + (i * 37) % 70; ctx.fillRect(x, 760 - hh, 30, hh); ctx.beginPath(); ctx.arc(x + 15, 760 - hh, 15, Math.PI, 0); ctx.fill(); } } },
      battle(ctx, W, H_, t, o) { sky(ctx, W, H_, ['#3a1410', '#a8441c', '#e89a4a']); sun(ctx, W * 0.3, 560, 60, t); hills(ctx, W, 900, '#6a3a20', 50, 4);
        for (let i = 0; i < 18; i++) { const x = (i * 53) % (W + 100) - 50, y = 900 + (i % 3) * 8; ctx.fillStyle = '#3a1a10'; ctx.fillRect(x, y - 40, 6, 40); line(ctx, '#3a1a10', 2, [[x + 3, y - 40], [x + 3, y - 80]], false); if (i % 4 === 0) { ctx.fillStyle = i % 8 ? '#f4c430' : '#d8283c'; ctx.beginPath(); ctx.moveTo(x + 3, y - 80); ctx.lineTo(x + 40 + Math.sin(t * 5 + i) * 6, y - 70); ctx.lineTo(x + 3, y - 60); ctx.fill(); } }
        ctx.fillStyle = vg(ctx, 920, H_, '#a8743a', '#6a4422'); ctx.fillRect(-200, 920, W + 400, 600); ctx.fillStyle = 'rgba(230,180,120,0.25)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse((i * 170 + t * 30) % (W + 200) - 100, 1000 + i * 30, 160, 30, 0, 0, TAU); ctx.fill(); } },
      village(ctx, W, H_, t, o) { sets.forest(ctx, W, H_, t, Object.assign({}, o, { hut: o.hut ?? 520 }));
        for (const [x, y] of [[90, 1060], [160, 1080]]) { ctx.save(); ctx.translate(x, y); ITEMS.pot(ctx); ctx.restore(); } },
      river(ctx, W, H_, t, o) { const tm = o.night ? 'night' : 'dusk'; sky(ctx, W, H_, SKIES[tm]); if (tm === 'night') stars(ctx, W, H_, t); hills(ctx, W, 760, '#1a2a2a', 80, 5); tree(ctx, -20, 860, 1, '#1e4a30', '#163a26'); tree(ctx, W + 10, 870, 1.1, '#1e4a30', '#163a26');
        for (let k = 0; k < 8; k++) { const y = 860 + k * 60; ctx.fillStyle = `rgb(${20 + k * 4},${50 + k * 5},${80 + k * 6})`; ctx.beginPath(); ctx.moveTo(-200, y); for (let x = -200; x <= W + 200; x += 20) ctx.lineTo(x, y + Math.sin(x * 0.025 + t * 2.4 + k) * 8); ctx.lineTo(W + 200, 1500); ctx.lineTo(-200, 1500); ctx.closePath(); ctx.fill(); } },
    };
    // warm storybook light + vignette over the frame
    const light = (ctx, W, H_) => { let g = ctx.createRadialGradient(W * 0.25, H_ * 0.12, 40, W * 0.25, H_ * 0.12, H_ * 0.9); g.addColorStop(0, 'rgba(255,214,150,0.16)'); g.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
      g = ctx.createRadialGradient(W / 2, H_ / 2, H_ * 0.32, W / 2, H_ / 2, H_ * 0.78); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(20,6,2,0.45)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); };
    return { person, head, armsAt, grahas, chains, ARM, ITEMS, CAST, sets, light, aura, sun, rays, petals, lightning, shock, speed, dark, flame, om, card, banner, cloud, tree, stars, INK, GOLD, ell, poly, smooth, line, curve };
  })();
