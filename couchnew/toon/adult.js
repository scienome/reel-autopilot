  // ==================== ADULT: the couch sitcom's adult-cartoon look ====================
  // Bulgy eyes with tiny pupils, long faces with big chins, bulb noses, thick ink outlines that "boil" (wobble a
  // little, 8 times a second, like hand-drawn animation), muted colours. Everything is plain 2D canvas.
  //
  // ADULT.person(ctx, x, y, s, o): x, y = the feet, s = scale (1 is about 600 px tall), o = {
  //   who: 'maya' | 'sam' | 'mum', t (time, for blinks / talking / boil), flip (face left),
  //   pose: 'stand' | 'kneel' | 'sit' | 'bed' (from the waist up), lean (rad), bob (px),
  //   arms: 'down' | 'hips' | 'cross' | 'point' | 'shrug' | 'wave' | 'facepalm' | 'hold' | 'cheeks' | 'up' | [[ex, ey, hx, hy], [..]] (elbow + hand, relative to each shoulder),
  //   hold: 'doughnut' | 'phone' | 'box' | 'ring' (in the right hand),
  //   face: { eyes: 'open' | 'half' | 'wide' | 'angry' | 'sad' | 'closed' | 'happy', look: [dx, dy], brows: -1 (angry) .. 1 (worried),
  //           mouth: 'smile' | 'smirk' | 'flat' | 'frown' | 'open' | 'shout' | 'grin' | 'o' | 'chew', talk (true: the mouth flaps), tears, blush, sweat } }
  // ADULT.sets[name](ctx, W, H_, t, o): painted backgrounds: 'living' | 'cafe' | 'hospital' (o.monitor beeps etc.).
  const ADULT = (() => {
    const INK = '#17121c', LW = 5;
    const CAST = {
      maya: { skin: '#d39b74', sh: '#bb825d', hair: '#211519', top: '#d63b4b', top2: '#b52c3b', legs: '#2e3b5e', shoe: '#f1ede4', h: 1.0, girl: true },
      sam: { skin: '#f0c6a0', sh: '#d9a87f', hair: '#5a3a22', top: '#e6b03a', top2: '#c99223', legs: '#3b4a6b', shoe: '#d9473a', h: 1.07 },
      mum: { skin: '#c48c66', sh: '#a87250', hair: '#b3b3bc', top: '#4f8a78', top2: '#3e6f60', legs: '#5a4a5e', shoe: '#6a3a4a', h: 0.93, girl: true },
    };
    let T = 0; // current time, for the line boil
    const boil = (k) => { const b = Math.floor(T * 8), v = Math.sin(k * 12.9898 + b * 78.233) * 43758.5453; return ((v - Math.floor(v)) - 0.5) * 3.2; };
    // a closed smooth outline through points (quadratic midpoints), boiled, filled and inked
    const blob = (ctx, fill, pts, k = 0, lw = LW) => {
      const P = pts.map(([x, y], i) => [x + boil(k + i * 3.1), y + boil(k + i * 7.7)]), n = P.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      ctx.beginPath(); let m = mid(P[n - 1], P[0]); ctx.moveTo(...m);
      for (let i = 0; i < n; i++) { const q = mid(P[i], P[(i + 1) % n]); ctx.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); }
      ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); }
    };
    // straight-edged polygon (still boiled), for furniture, boards, screens
    const poly = (ctx, fill, pts, k = 0, lw = LW) => { ctx.beginPath(); pts.forEach(([x, y], i) => { const X = x + boil(k + i * 3.1), Y = y + boil(k + i * 7.7); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); } };
    const oval = (ctx, fill, x, y, rx, ry, k = 0, lw = LW, n = 14) => blob(ctx, fill, Array.from({ length: n }, (_, i) => [x + Math.cos((i / n) * Math.PI * 2) * rx, y + Math.sin((i / n) * Math.PI * 2) * ry]), k, lw);
    const line = (ctx, pts, w = LW, col = INK, k = 0) => { ctx.beginPath(); pts.forEach(([x, y], i) => { const X = x + boil(k + i), Y = y + boil(k + i * 2); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
    const curve = (ctx, a, c, b, w = LW, col = INK, k = 0) => { ctx.beginPath(); ctx.moveTo(a[0] + boil(k), a[1] + boil(k + 1)); ctx.quadraticCurveTo(c[0], c[1], b[0] + boil(k + 2), b[1] + boil(k + 3)); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); };
    // a noodle limb: ink tube with a coloured core
    const noodle = (ctx, a, c, b, w, col) => { for (const [lw, cl] of [[w + LW * 2, INK], [w, col]]) { ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(...c, ...b); ctx.lineWidth = lw; ctx.strokeStyle = cl; ctx.lineCap = 'round'; ctx.stroke(); } };
    const ARMS = { // per arm (left of screen first): [elbow dx, dy, hand dx, dy] from the shoulder; the right arm is mirrored
      down: [[-20, 100, -10, 200], [20, 100, 10, 200]], hips: [[-80, 70, -10, 140], [80, 70, 10, 140]], cross: [[-10, 110, 90, 80], [10, 110, -90, 90]],
      point: [[-20, 100, -10, 200], [100, -10, 210, -40]], shrug: [[-100, 40, -120, -50], [100, 40, 120, -50]], wave: [[-20, 100, -10, 200], [90, -30, 70, -160]],
      facepalm: [[-20, 100, -10, 200], [30, 60, -60, -130]], hold: [[-20, 100, -10, 200], [50, 80, 40, 150]], cheeks: [[-40, 90, 30, -110], [40, 90, -30, -110]],
      up: [[-90, -40, -110, -170], [90, -40, 110, -170]], phone: [[-30, 100, 40, 120], [30, 100, -10, 110]],
    };
    const hand = (ctx, x, y, col, k) => { oval(ctx, col, x, y, 22, 20, k, LW, 10); line(ctx, [[x - 18, y - 6], [x - 30, y - 18]], 12, INK, k); line(ctx, [[x - 18, y - 6], [x - 29, y - 17]], 4, col, k); };
    const prop = (ctx, kind, x, y, t) => {
      if (kind === 'doughnut') { oval(ctx, '#e0a050', x, y, 46, 30, 91); oval(ctx, '#f29ac0', x, y - 6, 40, 22, 92, 0); line(ctx, [[x - 30, y - 8], [x - 24, y - 2]], 4, '#fff6', 93); line(ctx, [[x + 14, y - 16], [x + 20, y - 10]], 4, '#7ad', 94); oval(ctx, '#e0a050', x, y - 4, 12, 7, 95, 4, 10); }
      else if (kind === 'phone') { poly(ctx, '#222', [[x - 26, y - 50], [x + 26, y - 50], [x + 26, y + 50], [x - 26, y + 50]], 96); ctx.fillStyle = '#7fd0ff'; ctx.fillRect(x - 19, y - 42, 38, 80); }
      else if (kind === 'box') { poly(ctx, '#f4e2c8', [[x - 60, y - 40], [x + 60, y - 40], [x + 60, y + 30], [x - 60, y + 30]], 97); line(ctx, [[x - 60, y - 22], [x + 60, y - 22]], 4, '#e86a8a', 98); }
      else if (kind === 'ring') { ctx.lineWidth = 7; ctx.strokeStyle = '#f2c230'; ctx.beginPath(); ctx.arc(x, y + 6, 16, 0, Math.PI * 2); ctx.stroke(); blob(ctx, '#bfefff', [[x, y - 28], [x + 13, y - 14], [x, y - 4], [x - 13, y - 14]], 99, 3); }
    };
    const person = (ctx, x, y, s, o = {}) => {
      const c = CAST[o.who || 'maya'], f = o.face || {}, t = o.t || 0; T = t;
      const seed = { maya: 1, sam: 40, mum: 80 }[o.who || 'maya'];
      ctx.save(); ctx.translate(x, y + (o.bob || 0)); ctx.scale(s * c.h * (o.flip ? -1 : 1), s * c.h); ctx.rotate(o.lean || 0);
      const pose = o.pose || 'stand', drop = pose === 'kneel' ? 110 : pose === 'sit' ? 120 : 0;
      ctx.translate(0, drop);
      // shadow + legs
      if (pose !== 'bed') {
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, -drop + 4, 130, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        if (pose === 'kneel') { noodle(ctx, [-32, -235], [-40, -150], [-36, -100], 52, c.legs); noodle(ctx, [-36, -100], [-80, -100], [-130, -105], 50, c.legs); oval(ctx, c.shoe, -150, -100, 30, 22, seed + 2);
          noodle(ctx, [32, -235], [80, -230], [110, -160], 52, c.legs); noodle(ctx, [110, -160], [112, -60], [108, -110 + 110], 50, c.legs); oval(ctx, c.shoe, 128, -6, 40, 20, seed + 3); }
        else if (pose === 'sit') { for (const sd of [-1, 1]) { noodle(ctx, [sd * 32, -235], [sd * 40, -200], [sd * 44, -130], 52, c.legs); oval(ctx, c.shoe, sd * 50, -112, 36, 20, seed + 4 + sd); } }
        else for (const sd of [-1, 1]) { noodle(ctx, [sd * 30, -235], [sd * 34, -120], [sd * 36, -24], 50, c.legs); oval(ctx, c.shoe, sd * 44, -12, 42, 22, seed + 5 + sd); }
      }
      // torso
      if (o.who === 'mum') blob(ctx, c.top, [[-85, -425], [85, -425], [105, -330], [112, -230], [0, -222], [-112, -230], [-105, -330]], seed + 10);
      else if (c.girl) blob(ctx, c.top, [[-80, -428], [80, -428], [95, -330], [88, -232], [0, -226], [-88, -232], [-95, -330]], seed + 10);
      else blob(ctx, c.top, [[-90, -428], [90, -428], [108, -330], [102, -226], [0, -220], [-102, -226], [-108, -330]], seed + 10);
      if (pose !== 'bed') { ctx.fillStyle = c.legs; ctx.save(); ctx.globalAlpha = 1; blob(ctx, c.legs, [[-88, -240], [88, -240], [92, -210], [-92, -210]], seed + 11); ctx.restore(); }
      if (o.who === 'sam') { blob(ctx, c.top2, [[-55, -330], [55, -330], [62, -270], [-62, -270]], seed + 12, 4); for (const sd of [-1, 1]) { line(ctx, [[sd * 22, -425], [sd * 26, -365]], 4, INK, seed + 13 + sd); oval(ctx, '#f2efe6', sd * 26, -360, 6, 6, seed + 15, 3, 8); } }
      if (o.who === 'maya') { blob(ctx, c.skin, [[-48, -428], [48, -428], [20, -392], [-20, -392]], seed + 12, 4); line(ctx, [[-60, -300], [60, -300]], 4, c.top2, seed + 13); }
      if (o.who === 'mum') { line(ctx, [[0, -425], [0, -228]], 4, INK, seed + 12); for (let i = 0; i < 4; i++) oval(ctx, '#f2efe6', -16, -395 + i * 42, 7, 7, seed + 13 + i, 3, 8); for (let i = 0; i < 9; i++) oval(ctx, '#f4f0ea', -40 + i * 10, -418 + Math.abs(i - 4) * 4, 6, 6, seed + 20 + i, 2, 8); }
      // arms
      const A = Array.isArray(o.arms) ? o.arms : ARMS[o.arms || 'down'];
      A.forEach((a, i) => { const sd = i ? 1 : -1, sh = [sd * 82, -405], el = [sh[0] + a[0], sh[1] + a[1]], hd = [sh[0] + a[2], sh[1] + a[3]];
        noodle(ctx, sh, el, hd, 34, c.top); hand(ctx, hd[0], hd[1], c.skin, seed + 30 + i); if (i === 1 && o.hold) prop(ctx, o.hold, hd[0] + 6, hd[1] - 30, t); });
      // neck + head
      blob(ctx, c.skin, [[-24, -440], [24, -440], [28, -470], [-28, -470]], seed + 40);
      ctx.save(); ctx.translate(0, -575); ctx.rotate(o.tilt || 0);
      if (c.girl && o.who === 'maya') blob(ctx, c.hair, [[-112, -60], [-150, 60], [-130, 140], [-80, 150], [80, 150], [130, 140], [150, 60], [112, -60]], seed + 41);
      if (o.who === 'mum') for (let i = 0; i < 11; i++) { const a = Math.PI * 0.95 + (i / 10) * Math.PI * 1.1; oval(ctx, c.hair, Math.cos(a) * 112, Math.sin(a) * 112 - 24, 34, 32, seed + 42 + i, LW, 10); }
      // ears + face (long, big chin)
      for (const sd of [-1, 1]) oval(ctx, c.skin, sd * 104, 4, 20, 28, seed + 55 + sd, LW, 10);
      blob(ctx, c.skin, [[-104, -70], [-112, 30], [-84, 110], [-40, 150], [0, 158], [40, 150], [84, 110], [112, 30], [104, -70], [60, -128], [0, -138], [-60, -128]], seed + 60);
      if (o.who === 'sam') { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#6a5040'; for (let i = 0; i < 70; i++) { const a = Math.sin(i * 91.7) * 0.5 + 0.5, b = Math.sin(i * 37.3) * 0.5 + 0.5; ctx.fillRect(-80 + a * 160, 92 + b * 50 - Math.abs(-80 + a * 160) * 0.12, 3, 3); } ctx.restore(); }
      // hair on top
      if (o.who === 'maya') { blob(ctx, c.hair, [[-112, -40], [-104, -110], [-40, -150], [40, -150], [104, -110], [112, -40], [70, -88], [20, -96], [-30, -70]], seed + 70); }
      else if (o.who === 'sam') { const pts = [[-108, -50]]; for (let i = 0; i <= 10; i++) { const a = Math.PI + (i / 10) * Math.PI; pts.push([Math.cos(a) * (i % 2 ? 140 : 108), -60 + Math.sin(a) * (i % 2 ? 125 : 98)]); } pts.push([108, -50], [40, -96], [-40, -96]); blob(ctx, c.hair, pts, seed + 70); }
      else for (let i = 0; i < 6; i++) oval(ctx, c.hair, -90 + i * 36, -112 + Math.abs(i - 2.5) * 10, 30, 28, seed + 75 + i, LW, 10);
      // eyes
      const eyes = f.eyes || (o.who === 'maya' ? 'half' : 'open'), blink = Math.sin(t * 1.7 + seed) > 0.985 && eyes !== 'closed', look = f.look || [0, 0];
      for (const sd of [-1, 1]) { const ex = sd * 44, ey = -22, wide = eyes === 'wide', rx = wide ? 46 : 40, ry = wide ? 54 : 46;
        if (eyes === 'closed' || blink) { curve(ctx, [ex - 32, ey], [ex, ey + 20], [ex + 32, ey], LW + 1, INK, seed + 80 + sd); continue; }
        if (eyes === 'happy') { curve(ctx, [ex - 30, ey + 10], [ex, ey - 22], [ex + 30, ey + 10], LW + 1, INK, seed + 80 + sd); continue; }
        oval(ctx, '#ffffff', ex, ey, rx, ry, seed + 82 + sd);
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + look[0] * 14 + (o.who === 'sam' ? sd * -3 : 0), ey + 4 + look[1] * 14, wide ? 5 : 8, 0, Math.PI * 2); ctx.fill();
        if (eyes === 'half') { ctx.fillStyle = c.skin; ctx.beginPath(); ctx.ellipse(ex, ey - 10, rx + 3, ry * 0.62, 0, Math.PI, 0); ctx.lineTo(ex + rx + 3, ey - 6); ctx.lineTo(ex - rx - 3, ey - 6); ctx.fill(); line(ctx, [[ex - rx + 2, ey - 6], [ex + rx - 2, ey - 6]], LW, INK, seed + 84 + sd); }
        if (eyes === 'angry' || eyes === 'sad') { const inX = ex - sd * rx, outX = ex + sd * rx, inY = eyes === 'angry' ? ey + 2 : ey - ry * 0.8, outY = eyes === 'angry' ? ey - ry * 0.8 : ey - 2;
          ctx.fillStyle = c.skin; ctx.beginPath(); ctx.moveTo(inX, inY); ctx.lineTo(outX, outY); ctx.lineTo(outX, ey - ry - 6); ctx.lineTo(inX, ey - ry - 6); ctx.closePath(); ctx.fill(); line(ctx, [[inX + sd * 4, inY], [outX - sd * 4, outY]], LW + 1, INK, seed + 86 + sd); }
        // brows
        const b = f.brows || 0; line(ctx, [[ex - sd * 30, ey - ry - 14 + b * 14 * 1], [ex + sd * 30, ey - ry - 18 - b * 6]], 6, o.who === 'mum' ? '#6a6a74' : INK, seed + 88 + sd);
        if (o.who === 'mum') { ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.beginPath(); ctx.ellipse(ex, ey, rx + 8, ry + 6, 0, 0, Math.PI * 2); ctx.stroke(); }
      }
      if (o.who === 'mum') line(ctx, [[-4, -22], [4, -22]], 5, INK, seed + 90);
      // nose (bulb) and mouth
      oval(ctx, c.skin, 4, 48, 26, 32, seed + 91, LW, 12); ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = c.sh; ctx.beginPath(); ctx.ellipse(12, 58, 12, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      let m = f.mouth || 'flat'; if (f.talk) { const ph = Math.floor(t * 11 + seed) % 3; m = ph === 0 ? 'open' : ph === 1 ? 'o' : m === 'open' ? 'flat' : m; }
      if (m === 'chew') m = Math.sin(t * 14) > 0 ? 'flat' : 'o';
      const my = 112;
      if (m === 'smile') curve(ctx, [-40, my - 6], [0, my + 22], [44, my - 10], LW, INK, seed + 92);
      else if (m === 'smirk') curve(ctx, [-36, my + 4], [10, my + 12], [44, my - 14], LW, INK, seed + 92);
      else if (m === 'flat') line(ctx, [[-36, my + 4], [40, my]], LW, INK, seed + 92);
      else if (m === 'frown') curve(ctx, [-36, my + 12], [0, my - 10], [38, my + 14], LW, INK, seed + 92);
      else if (m === 'grin') { blob(ctx, '#ffffff', [[-46, my - 10], [46, my - 10], [36, my + 20], [-36, my + 20]], seed + 92); line(ctx, [[-42, my + 4], [42, my + 4]], 3, INK, seed + 93); }
      else { const big = m === 'shout' ? 1.6 : m === 'o' ? 0.7 : 1; oval(ctx, '#4a1622', 0, my + 6, (m === 'o' ? 20 : 34) * big, 22 * big, seed + 94, LW, 12); ctx.fillStyle = '#e8687a'; ctx.beginPath(); ctx.ellipse(0, my + 6 + 12 * big, 15 * big, 7 * big, 0, 0, Math.PI * 2); ctx.fill(); if (m === 'shout') { ctx.fillStyle = '#fff'; ctx.fillRect(-26, my - 24, 52, 10); } }
      if (f.blush) { ctx.save(); ctx.globalAlpha = 0.3 * f.blush; ctx.fillStyle = '#e8506a'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 70, 60, 22, 12, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
      if (f.tears) for (const sd of [-1, 1]) { const k = (t * 1.2 + (sd > 0 ? 0.5 : 0)) % 1; ctx.fillStyle = '#8fd6ff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(sd * 66, 20 + k * 90, 9, 13, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      if (f.sweat) { ctx.fillStyle = '#8fd6ff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(-112, -60 + ((t * 40) % 40), 9, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      if (o.who === 'maya') for (const sd of [-1, 1]) { ctx.lineWidth = 6; ctx.strokeStyle = '#e8b830'; ctx.beginPath(); ctx.arc(sd * 108, 46, 15, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore(); ctx.restore();
    };
    // ---------------- sets ----------------
    const wall = (ctx, W, H_, col, floorCol, fy = 0.72) => { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H_ * fy); ctx.fillStyle = floorCol; ctx.fillRect(0, H_ * fy, W, H_ * (1 - fy)); line(ctx, [[0, H_ * fy], [W, H_ * fy]], LW, INK, 300); };
    const sets = {
      living: (ctx, W, H_, t, o = {}) => { T = t; wall(ctx, W, H_, '#8a6f9e', '#6b4f3c');
        ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff'; for (let i = 0; i < 9; i++) ctx.fillRect(i * 90, 0, 40, H_ * 0.72); ctx.restore();
        poly(ctx, '#2a3a6a', [[470, 180], [680, 180], [680, 470], [470, 470]], 301); blob(ctx, '#f2e2a0', [[560, 250], [600, 250], [600, 290], [560, 290]], 302, 0); line(ctx, [[575, 180], [575, 470]], 6, INK, 303); line(ctx, [[470, 325], [680, 325]], 6, INK, 304);
        poly(ctx, '#d8c098', [[60, 220], [220, 220], [220, 340], [60, 340]], 305); poly(ctx, '#7aa8c8', [[80, 240], [200, 240], [200, 320], [80, 320]], 306, 3);
        line(ctx, [[640, 920], [640, 640]], 6, INK, 307); poly(ctx, '#f2d06a', [[590, 560], [690, 560], [710, 650], [570, 650]], 308);
        blob(ctx, '#b84a3a', [[40, 700], [680, 700], [700, 860], [20, 860]], 309); blob(ctx, '#9c3a2c', [[60, 600], [660, 600], [660, 720], [60, 720]], 310);
        oval(ctx, '#c0a080', 360, 1100, 300, 60, 311, LW, 18); },
      cafe: (ctx, W, H_, t, o = {}) => { T = t; wall(ctx, W, H_, '#e8d2a8', '#7a5a3c', 0.7);
        poly(ctx, '#2a2a30', [[120, 150], [600, 150], [600, 400], [120, 400]], 320); ctx.fillStyle = '#f2efe6'; ctx.font = '900 44px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('DONUTS', 360, 230); ctx.font = '700 30px sans-serif'; ctx.fillText('glazed  2.50', 360, 300); ctx.fillText('ring box  free', 360, 350);
        for (const x of [180, 360, 540]) { line(ctx, [[x, 0], [x, 70]], 4, INK, 321 + x); blob(ctx, '#f2d06a', [[x - 40, 70], [x + 40, 70], [x + 30, 110], [x - 30, 110]], 322 + x); }
        poly(ctx, '#c98a5a', [[0, 760], [720, 760], [720, 900], [0, 900]], 330); poly(ctx, '#a86a3a', [[0, 740], [720, 740], [720, 780], [0, 780]], 331); },
      hospital: (ctx, W, H_, t, o = {}) => { T = t; wall(ctx, W, H_, '#a8c8b8', '#c8d0cc', 0.7);
        poly(ctx, '#e8f0ee', [[40, 140], [200, 140], [200, 360], [40, 360]], 340); if (o.xray) { ctx.fillStyle = '#10161c'; ctx.fillRect(56, 156, 128, 188); ctx.strokeStyle = '#dfe8ee'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(120, 250, 40, 60, 0, 0, Math.PI * 2); ctx.stroke(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(84, 200 + i * 20); ctx.quadraticCurveTo(120, 190 + i * 20, 156, 200 + i * 20); ctx.stroke(); } ctx.strokeStyle = '#f2c230'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(120, 268, 14, 0, Math.PI * 2); ctx.stroke(); }
        poly(ctx, '#2a3036', [[520, 160], [690, 160], [690, 300], [520, 300]], 341); ctx.strokeStyle = '#4af08a'; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = 530 + i * 3.7, ph = ((i / 40) + t * 0.8) % 1, y = 230 - (ph > 0.45 && ph < 0.5 ? 50 : ph > 0.5 && ph < 0.55 ? -30 : 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        for (let i = 0; i < 6; i++) poly(ctx, '#e6eef8', [[i * 40 - 10, 0], [i * 40 + 30, 0], [i * 40 + 30, 900], [i * 40 - 10, 900]], 350 + i, 3);
        poly(ctx, '#d0d8e0', [[300, 720], [720, 720], [720, 780], [300, 780]], 360); },
    };
    // hospital bed blanket over a person in pose 'bed' (draw after the person)
    const blanket = (ctx, x, y, t) => { T = t; poly(ctx, '#f2f6fa', [[x - 230, y - 180], [x + 230, y - 180], [x + 250, y + 60], [x - 250, y + 60]], 370); line(ctx, [[x - 220, y - 150], [x + 220, y - 150]], 4, '#9ab', 371); };
    // a big comic sound word ("CRUNCH")
    const sfxWord = (ctx, txt, x, y, u, col = '#ffd23f', rot = -0.12) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(u, u); ctx.font = '900 110px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.strokeText(txt, 0, 0); ctx.fillStyle = col; ctx.fillText(txt, 0, 0); ctx.restore(); };
    const bed = (ctx, x, y, t) => { T = t; poly(ctx, '#8a9aa8', [[x - 240, y - 420], [x + 240, y - 420], [x + 240, y - 120], [x - 240, y - 120]], 380); poly(ctx, '#f6f8fa', [[x - 200, y - 330], [x - 30, y - 330], [x - 30, y - 240], [x - 200, y - 240]], 381); };
    return { person, sets, bed, blanket, sfxWord, prop, CAST, INK, oval, blob, poly, line };
  })();
