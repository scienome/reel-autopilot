  // ==================== DIWA: Diwali additions to MYTH (series "दिवाली के रहस्य"). Add 'kit/diwali.js' to a reel's meta.json libs. ====================
  // Extra CAST, sets (diwali, ayodhya, street, road) and props, all drawn in the same folk style. A separate file, so the other reels are not touched.
  Object.assign(MYTH.CAST, {
    lakshmi: { skin: '#f2c8a4', sh: '#d8a882', hair: '#1c1214', cloth: '#d8283c', cloth2: '#f4c430', girl: true, crown: 'tall', tilak: 'dot', garland: true },
    satyabhama: { skin: '#e9b48a', sh: '#cf9468', hair: '#1c1214', cloth: '#e8742a', cloth2: '#f4c430', girl: true, crown: 'small', tilak: 'dot' },
    narakasura: { skin: '#4a5a6a', sh: '#364552', hair: '#120c0c', cloth: '#3a1a2a', cloth2: '#f4c430', crown: 'tall', horns: true, tusks: true, muscle: 1.3, h: 1.1, redEyes: true, armor: true },
    bali: { skin: '#b07a52', sh: '#90603e', hair: '#1c1214', cloth: '#6a1a4a', cloth2: '#f4c430', crown: 'tall', armor: true, mustache: true, longHair: true, tilak: 'shaiv', muscle: 1.15 },
    vamana: { skin: '#3a6ec0', sh: '#28528e', hair: '#16121e', cloth: '#f4c430', cloth2: '#e8742a', child: true, topknot: true, tilak: 'vaishnav', beads: true },
    prince: { skin: '#e0a87e', sh: '#c48a60', hair: '#1c1214', cloth: '#f2f2f2', cloth2: '#c8332a', crown: 'small', tilak: 'dot', longHair: true },
    bride: { skin: '#eebd94', sh: '#d49c72', hair: '#1c1214', cloth: '#c8283c', cloth2: '#f4c430', girl: true, crown: 'small', tilak: 'dot' },
    king: { skin: '#d9a07a', sh: '#bb805a', hair: '#1c1214', cloth: '#f4f0e0', cloth2: '#d8a020', crown: 'tall', mustache: true, longHair: true, tilak: 'dot' },
    gramin: { skin: '#c88c62', sh: '#aa6e46', hair: '#1c1214', cloth: '#e8742a', cloth2: '#f4c430', turban: '#f4c430', mustache: true },
    gramin2: { skin: '#b07a52', sh: '#90603e', hair: '#1c1214', cloth: '#f2ead8', cloth2: '#2a7a4a', turban: '#2a7a9a', mustache: true },
    pandit: { skin: '#d8a27a', sh: '#bc845c', hair: '#e8e8e8', cloth: '#f2ead8', cloth2: '#e8742a', topknot: true, beard: '#e8e8e8', beads: true, tilak: 'shaiv' },
  });
  const DIWA = (() => {
    const { ell, poly, smooth, line, curve, flame, INK, GOLD } = MYTH, TAU = Math.PI * 2;
    const glow = (ctx, x, y, r, col = '255,190,90', a = 0.55) => { const g = ctx.createRadialGradient(x, y, 2, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
    const diya = (ctx, x, y, s, t, k = 1) => { if (k > 0) glow(ctx, x, y - 26 * s, 90 * s * k); path3(ctx, x, y, s); if (k > 0) flame(ctx, x, y - 14 * s, 0.34 * s * k, t + x); };
    const path3 = (ctx, x, y, s) => { smooth(ctx, '#c8602a', [[x - 34 * s, y - 16 * s], [x, y - 6 * s], [x + 34 * s, y - 16 * s], [x + 22 * s, y + 8 * s], [x - 22 * s, y + 8 * s]], 3); ell(ctx, '#f4c430', x, y - 12 * s, 22 * s, 5 * s, 0, 1.5); };
    // a row of lamps; lit = how many have lit so far (0..1)
    const row = (ctx, y, t, lit = 1, n = 9, s = 0.9, x0 = 40, x1 = 680) => { for (let i = 0; i < n; i++) diya(ctx, x0 + (x1 - x0) * i / (n - 1), y + (i % 2) * 14, s, t, i / n < lit ? 1 : 0); };
    const dog = (ctx, x, y, s, t, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); const c = o.col || '#c8924a', c2 = o.col2 || '#a87430', wag = Math.sin(t * 12) * 0.5;
      ctx.save(); ctx.translate(-92, -120); ctx.rotate(-0.8 + wag); line(ctx, c, 16, [[0, 0], [-46, -36]]); ctx.restore();
      for (const lx of [-70, -38, 40, 70]) line(ctx, c2, 20, [[lx, -80], [lx, -8]]);
      smooth(ctx, c, [[-104, -130], [-30, -146], [66, -146], [92, -86], [40, -66], [-80, -66]], 5); ell(ctx, c, 92, -176, 56, 50, 0, 5);
      smooth(ctx, c2, [[56, -220], [34, -196], [40, -140], [64, -160]], 4); ell(ctx, '#f0d0a0', 134, -160, 30, 22, 0, 4); ell(ctx, INK, 158, -168, 9, 8, 0, 0);
      ell(ctx, '#fff', 102, -188, 11, 12, 0, 3); ell(ctx, INK, 106, -188, 6, 7, 0, 0); if (o.tika) ell(ctx, '#d81c2a', 90, -212, 8, 11, 0, 1.5);
      if (o.tongue !== false) ell(ctx, '#e87a8a', 142, -142, 11, 16, 0, 2);
      if (o.garland) for (let i = 0; i <= 12; i++) { const a = Math.PI * (i / 12), mx = 66 + Math.cos(a) * 54, my = -128 + Math.sin(a) * 42; ell(ctx, i % 2 ? '#f4a020' : '#e8402a', mx, my, 11, 11, 0, 2); }
      ctx.restore(); };
    const crow = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); smooth(ctx, '#20202e', [[-70, -30], [0, -70], [66, -40], [40, 10], [-40, 10]], 4); ell(ctx, '#20202e', 66, -70, 34, 30, 0, 4); poly(ctx, '#3a3a44', [[94, -74], [136, -62], [94, -56]], 3); ell(ctx, '#fff', 74, -76, 7, 7, 0, 1.5); ell(ctx, INK, 76, -76, 3.5, 3.5, 0, 0); poly(ctx, '#20202e', [[-66, -20], [-120, 6 + Math.sin(t * 8) * 8], [-54, 6]], 4); line(ctx, '#d8a020', 5, [[-8, 10], [-8, 38]], false); line(ctx, '#d8a020', 5, [[18, 10], [18, 38]], false); ctx.restore(); };
    // a decorated cow walking (feet at y), facing right
    const cow = (ctx, x, y, s, t, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); const st = Math.sin(t * 8 + x * 0.05) * 16;
      for (const [lx, d] of [[-92, 1], [-56, -1], [72, -1], [108, 1]]) line(ctx, '#d8d0c0', 24, [[lx, -130], [lx + st * d, -8]]);
      curve(ctx, '#d8d0c0', 8, [-130, -196], [-170, -150], [-156, -96]);
      smooth(ctx, o.col || '#f6f2e8', [[-130, -220], [-20, -240], [110, -230], [150, -170], [120, -116], [-120, -116]], 5);
      smooth(ctx, '#d8283c', [[-70, -232], [50, -236], [60, -130], [-60, -126]], 3.5); line(ctx, GOLD, 7, [[-64, -180], [56, -182]], false);
      ell(ctx, o.col || '#f6f2e8', 178, -226, 50, 46, 0, 5); ell(ctx, '#f0c8b0', 214, -206, 26, 20, 0, 3.5); poly(ctx, '#e8a020', [[150, -264], [136, -318], [172, -270]], 3.5); poly(ctx, '#e8a020', [[192, -268], [212, -322], [212, -262]], 3.5);
      ell(ctx, INK, 186, -236, 6, 6, 0, 0); ell(ctx, '#d81c2a', 170, -258, 7, 9, 0, 1.5); for (let i = 0; i <= 8; i++) ell(ctx, i % 2 ? '#f4a020' : '#e8402a', 132 + i * 9, -176 + Math.sin(i / 8 * Math.PI) * 26, 8, 8, 0, 1.5);
      ctx.restore(); };
    // the demon effigy on a bamboo frame; burn 0..1
    const effigy = (ctx, x, y, s, t, burn = 0) => { MYTH.person(ctx, x, y, s, { who: 'narakasura', t, arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); line(ctx, '#8a6a3a', 12 * s, [[x - 90 * s, y], [x - 90 * s, y - 420 * s]]); line(ctx, '#8a6a3a', 12 * s, [[x + 90 * s, y], [x + 90 * s, y - 420 * s]]);
      if (burn > 0) { for (let i = 0; i < 11; i++) { const fx = x + (i - 5) * 42 * s, fy = y - (i * 53 % 5) * 46 * s * burn; flame(ctx, fx, fy + 20, (0.8 + (i % 3) * 0.35) * s * (0.5 + burn), t + i); } glow(ctx, x, y - 280 * s, 520 * s, '255,140,50', 0.5 * burn); } };
    // a burning hingot fruit flying (ang in rad, trailing sparks behind)
    const hingot = (ctx, x, y, ang, s, t) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); glow(ctx, -30 * s, 0, 190 * s, '255,170,60', 0.95); for (let i = 0; i < 10; i++) { const k = i / 10; ctx.fillStyle = i % 2 ? '#ffd24a' : '#ff7a20'; ctx.beginPath(); ctx.arc(-40 * s - k * 170 * s, Math.sin(t * 30 + i) * 12 * k * s, (11 - i) * 0.9 * s, 0, TAU); ctx.fill(); } ell(ctx, '#ff9a2a', 0, 0, 40 * s, 19 * s, 0, 3); ell(ctx, '#fff0a0', 8 * s, -3 * s, 20 * s, 8 * s, 0, 0); ctx.restore(); };
    const rocketsFlying = (ctx, t, t0, n = 7) => { for (let i = 0; i < n; i++) { const p = (((t - t0) * 0.75 + i * 0.27) % 1 + 1) % 1, dir = i % 2 ? 1 : -1, sx = dir > 0 ? -80 : 800, ex = dir > 0 ? 800 : -80, x = sx + (ex - sx) * p, y = 860 - i * 28 - Math.sin(p * Math.PI) * (260 + i * 22); hingot(ctx, x, y, dir > 0 ? -0.5 + p : Math.PI + 0.5 - p, 1.15, t + i); } };
    // a game board with two dice, top view
    const board = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s * 0.6); poly(ctx, '#8a1e2a', [[-200, -200], [200, -200], [200, 200], [-200, 200]], 6); for (const a of [0, 1]) { ctx.save(); ctx.rotate(a * Math.PI / 2); poly(ctx, '#f4c430', [[-46, -196], [46, -196], [46, 196], [-46, 196]], 3); ctx.restore(); } poly(ctx, '#c8332a', [[-46, -46], [46, -46], [46, 46], [-46, 46]], 3); ctx.restore(); };
    const die = (ctx, x, y, s, n, spin = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(spin); ctx.scale(s, s); ctx.fillStyle = '#fbf6e6'; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-30, -30, 60, 60, 10); ctx.fill(); ctx.stroke(); const P = { 1: [[0, 0]], 2: [[-13, -13], [13, 13]], 3: [[-14, -14], [0, 0], [14, 14]], 4: [[-13, -13], [13, -13], [-13, 13], [13, 13]], 5: [[-14, -14], [14, -14], [0, 0], [-14, 14], [14, 14]], 6: [[-13, -16], [13, -16], [-13, 0], [13, 0], [-13, 16], [13, 16]] }; for (const [dx, dy] of P[n] || P[6]) ell(ctx, '#c8283c', dx, dy, 6, 6, 0, 0); ctx.restore(); };
    const jewels = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(ctx, 0, -60, 240, '255,220,110', 0.7); for (let k = 0; k < 42; k++) { const a = k * 2.399, r = 16 + k * 3.2, px = Math.cos(a) * r * 1.9, py = -Math.abs(Math.sin(a)) * (100 - r * 0.55) - 6; ell(ctx, k % 5 === 0 ? '#e8e8f4' : '#f4c03e', px, py, 17, 11, a, 2.5); if (k % 7 === 0) ell(ctx, k % 2 ? '#d81c3a' : '#28a86a', px, py, 6, 6, 0, 1.5); } const sp = (t * 3) % 1; ctx.fillStyle = `rgba(255,255,255,${1 - sp})`; for (let i = 0; i < 5; i++) { const a = i * 1.3 + Math.floor(t * 3); ctx.beginPath(); ctx.arc(Math.cos(a) * 120, -50 + Math.sin(a) * 40, 7 * (1 - sp), 0, TAU); ctx.fill(); } ctx.restore(); };
    const snake = (ctx, x, y, s, t, flip = false) => { ctx.save(); ctx.translate(x, y); ctx.scale(s * (flip ? -1 : 1), s); ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const go = () => { ctx.beginPath(); ctx.moveTo(-230, 0); for (let i = 1; i <= 14; i++) ctx.lineTo(-230 + i * 22, Math.sin(i * 0.9 + t * 5) * 18 * (1 - i / 16)); ctx.lineTo(110, -60); ctx.lineTo(120, -140); }; go(); ctx.strokeStyle = INK; ctx.lineWidth = 36; ctx.stroke(); go(); ctx.strokeStyle = '#2a4a3a'; ctx.lineWidth = 26; ctx.stroke(); ctx.restore(); smooth(ctx, '#3a6a4a', [[60, -180], [120, -226], [180, -180], [170, -112], [70, -112]], 5); ell(ctx, '#ffd23f', 104, -172, 11, 13, 0, 2.5); ell(ctx, '#ffd23f', 138, -172, 11, 13, 0, 2.5); ell(ctx, INK, 106, -172, 4, 9, 0, 0); ell(ctx, INK, 140, -172, 4, 9, 0, 0); line(ctx, '#e8284a', 3.5, [[122, -130], [122, -92]], false); ctx.restore(); };
    // houses for the night sets
    const houses = (ctx, W, y, t) => { const C = ['#c8945a', '#b86a4a', '#d8a860', '#a8583a', '#c87a4a']; for (let i = 0; i < 5; i++) { const x = -40 + i * 190, hh = 160 + (i * 47) % 110, c = C[i]; poly(ctx, c, [[x - 90, y], [x + 90, y], [x + 90, y - hh], [x - 90, y - hh]], 5); poly(ctx, '#7a3a2a', [[x - 106, y - hh], [x, y - hh - 76], [x + 106, y - hh]], 5); ell(ctx, '#ffe08a', x - 30, y - hh + 54, 17, 23, 0, 3); ell(ctx, '#ffe08a', x + 34, y - hh + 54, 17, 23, 0, 3); poly(ctx, '#4a2a18', [[x - 22, y], [x + 22, y], [x + 22, y - 84], [x - 22, y - 84]], 3); glow(ctx, x, y - hh + 54, 110, '255,190,90', 0.32); }
      for (let i = 0; i < 18; i++) { const k = i / 17, x = -30 + k * (W + 60), yy = y - 290 + Math.sin(k * Math.PI * 3) * 22; ell(ctx, i % 3 === 0 ? '#ffd23f' : i % 3 === 1 ? '#ff7a4a' : '#7ae0ff', x, yy, 7, 7, 0, 1.5); } };
    const ground = (ctx, W, H_, y, c0, c1) => { const g = ctx.createLinearGradient(0, y, 0, H_); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(-200, y, W + 400, 700); };
    Object.assign(MYTH.sets, {
      // a village at night, full of lamps
      diwali(ctx, W, H_, t, o) { MYTH.sets.sky(ctx, W, H_, t, { time: 'night' }); houses(ctx, W, 1000, t); ground(ctx, W, H_, 1000, '#4a2a1e', '#22120c'); row(ctx, 1120, t, o.lit ?? 1); },
      // Ayodhya: the palace hall with rows of lamps
      ayodhya(ctx, W, H_, t, o) { MYTH.sets.palace(ctx, W, H_, t, o); row(ctx, 1110, t, o.lit ?? 1); row(ctx, 1190, t, o.lit ?? 1, 8, 1.05, 70, 650); },
      // the street before dawn (o.time = night | dawn)
      street(ctx, W, H_, t, o) { MYTH.sets.sky(ctx, W, H_, t, { time: o.time || 'night' }); houses(ctx, W, 1000, t); ground(ctx, W, H_, 1000, '#3a3a44', '#1c1c24'); },
      // an open field under a dark war sky (no smiling sun, for tense scenes); o.embers adds floating sparks
      field(ctx, W, H_, t, o) { MYTH.sets.sky(ctx, W, H_, t, { time: 'dusk' }); ctx.fillStyle = 'rgba(30,6,20,0.5)'; ctx.fillRect(-200, -200, W + 400, H_ + 400); ground(ctx, W, H_, 930, '#6a4422', '#2e1a10'); for (let i = 0; i < 26; i++) { const ex = (i * 89 + t * 30) % W, ey = 1000 - ((i * 137 + t * 90) % 900); ctx.fillStyle = i % 2 ? '#ffb040' : '#ff6a20'; ctx.beginPath(); ctx.arc(ex, ey, 2 + i % 3, 0, TAU); ctx.fill(); } },
      // a village road in daylight, packed earth
      road(ctx, W, H_, t, o) { MYTH.sets.sky(ctx, W, H_, t, { time: o.time || 'day' }); MYTH.tree(ctx, -10, 960, 1.2); MYTH.tree(ctx, W + 10, 960, 1.25); houses(ctx, W, 960, t); ground(ctx, W, H_, 960, '#c89a62', '#8a6638'); },
    });
    return { glow, diya, row, dog, crow, cow, effigy, hingot, rocketsFlying, board, die, jewels, snake };
  })();
