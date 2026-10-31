  // ==================== ADULT: the couch sitcom's adult-cartoon look ====================
  // Bulgy eyes with tiny pupils, long faces with big chins, bulb noses, thick ink outlines that "boil" (wobble a
  // little, 8 times a second, like hand-drawn animation), muted colours. Everything is plain 2D canvas.
  //
  // ADULT.person(ctx, x, y, s, o): x, y = the feet, s = scale (1 is about 600 px tall), o = {
  //   who: 'maya' | 'sam' | 'mum', t (time, for blinks / talking / boil), flip (face left),
  //   pose: 'stand' | 'kneel' | 'sit' | 'bed' (from the waist up), lean (rad), bob (px),
  //   arms: 'down' | 'hips' | 'cross' | 'point' | 'shrug' | 'wave' | 'facepalm' | 'hold' | 'cheeks' | 'up' | [[ex, ey, hx, hy], [..]] (elbow + hand, relative to each shoulder),
  //   hold: 'doughnut' | 'phone' | 'box' | 'ring' | 'paper' | 'baby' | 'nappy' | 'tongs' | 'cake' | 'cakeout' | 'pan' | 'mug' | 'suitcase' | 'remote' (in the right hand),
  //   style: overrides for this shot's CAST traits, e.g. { outfit: 'gown', top: '#fff', veil: true },
  //   face: { eyes: 'open' | 'half' | 'wide' | 'angry' | 'sad' | 'closed' | 'happy', look: [dx, dy], brows: -1 (angry) .. 1 (worried),
  //           mouth: 'smile' | 'smirk' | 'flat' | 'frown' | 'open' | 'shout' | 'grin' | 'o' | 'chew', talk (true: the mouth flaps), tears, blush, sweat } }
  // ADULT.sets[name](ctx, W, H_, t, o): painted backgrounds: 'living' | 'cafe' | 'hospital' (o.xray) | 'kitchen' (o.fire, o.smoke: start times; o.note) | 'plane' (o.night).
  const ADULT = (() => {
    const INK = '#17121c', LW = 5;
    // hs = hair style ('long' | 'spiky' | 'curls' | 'bald' | 'slick' | 'cap' | 'bun'), outfit ('crop' | 'hoodie' | 'cardigan' | 'suit' | 'tee'),
    // plus extras: hoops, glasses, pearls, stubble, mustache, derp (eyes look apart), eyes (default lids), capCol, tie
    const CAST = {
      maya: { skin: '#d39b74', sh: '#bb825d', hair: '#211519', top: '#d63b4b', top2: '#b52c3b', legs: '#2e3b5e', shoe: '#f1ede4', h: 1.0, girl: true, hs: 'long', outfit: 'crop', hoops: true, eyes: 'half', seed: 1 },
      sam: { skin: '#f0c6a0', sh: '#d9a87f', hair: '#5a3a22', top: '#e6b03a', top2: '#c99223', legs: '#3b4a6b', shoe: '#d9473a', h: 1.07, hs: 'spiky', outfit: 'hoodie', stubble: true, derp: true, seed: 40 },
      mum: { skin: '#c48c66', sh: '#a87250', hair: '#b3b3bc', top: '#4f8a78', top2: '#3e6f60', legs: '#5a4a5e', shoe: '#6a3a4a', h: 0.93, girl: true, hs: 'curls', outfit: 'cardigan', glasses: true, pearls: true, browCol: '#6a6a74', seed: 80 },
      boss: { skin: '#e8b894', sh: '#d09a74', hair: '#35353d', top: '#2e3340', top2: '#22262f', legs: '#2e3340', shoe: '#1a1a1e', h: 1.1, hs: 'slick', outfit: 'suit', tie: '#c0283a', seed: 120 },
      date: { skin: '#f0c8a8', sh: '#dca888', hair: '#e2b860', top: '#7a5cff', top2: '#5e43e0', legs: '#2e2e3e', shoe: '#e86a8a', h: 0.98, girl: true, hs: 'long', outfit: 'crop', hoops: true, seed: 160 },
      dad: { skin: '#d8a07c', sh: '#c08560', hair: '#a8a8b0', top: '#8a6a4a', top2: '#6e523a', legs: '#4a4a52', shoe: '#3a2a22', h: 1.05, hs: 'bald', outfit: 'tee', mustache: true, browCol: '#6a6a74', seed: 200 },
      grandma: { skin: '#e0b090', sh: '#c89474', hair: '#efeff4', top: '#b85a8a', top2: '#9a4672', legs: '#6a5a6e', shoe: '#7a4a5a', h: 0.88, girl: true, hs: 'curls', outfit: 'cardigan', glasses: true, pearls: true, browCol: '#9a9aa4', seed: 240 },
      friend: { skin: '#b97d58', sh: '#9e6644', hair: '#1e1612', top: '#2fa88a', top2: '#23866e', legs: '#3b3b4a', shoe: '#f2f2f2', h: 1.04, hs: 'cap', capCol: '#d8443a', outfit: 'tee', stubble: true, seed: 280 },
      sister: { skin: '#e2ae88', sh: '#c8946e', hair: '#5a3020', top: '#4a8ad8', top2: '#3a70b8', legs: '#3a3a4e', shoe: '#f1ede4', h: 0.97, girl: true, hs: 'bun', outfit: 'tee', seed: 320 },
    };
    let T = 0; // current time, for the line boil
    const boil = (k) => { const b = Math.floor(T * 8), v = Math.sin(k * 12.9898 + b * 78.233) * 43758.5453; return ((v - Math.floor(v)) - 0.5) * 3.2; };
    // a closed smooth outline through points (quadratic midpoints), boiled, filled and inked
    const blobPath = (ctx, pts, k = 0) => { const P = pts.map(([x, y], i) => [x + boil(k + i * 3.1), y + boil(k + i * 7.7)]), n = P.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      ctx.beginPath(); const m = mid(P[n - 1], P[0]); ctx.moveTo(...m); for (let i = 0; i < n; i++) { const q = mid(P[i], P[(i + 1) % n]); ctx.quadraticCurveTo(P[i][0], P[i][1], q[0], q[1]); } ctx.closePath(); };
    // cel shading: a darker crescent on the side away from the light (screen right), clipped to the shape, re-inked
    const shadeIn = (ctx, pts, k, col, x0, a = 0.55) => { const ys = pts.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
      ctx.save(); blobPath(ctx, pts, k); ctx.clip(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x0 + 160, (y0 + y1) / 2, 170, (y1 - y0) * 0.75, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      blobPath(ctx, pts, k); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.stroke(); };
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
      else if (kind === 'tongs') { line(ctx, [[x - 10, y + 40], [x - 4, y - 90]], 9, '#b8c0c8', 100); line(ctx, [[x + 10, y + 40], [x + 4, y - 90]], 9, '#b8c0c8', 101); ctx.lineWidth = 6; ctx.strokeStyle = '#f2c230'; ctx.beginPath(); ctx.arc(x, y - 100, 13, 0, Math.PI * 2); ctx.stroke(); blob(ctx, '#bfefff', [[x, y - 132], [x + 11, y - 120], [x, y - 111], [x - 11, y - 120]], 102, 3); }
      else if (kind === 'cake' || kind === 'cakeout') { poly(ctx, '#f6e2ea', [[x - 80, y - 50], [x + 80, y - 50], [x + 80, y + 30], [x - 80, y + 30]], 103); blob(ctx, '#e86a8a', [[x - 82, y - 52], [x + 82, y - 52], [x + 70, y - 30], [x + 40, y - 40], [x, y - 28], [x - 40, y - 40], [x - 70, y - 30]], 104, 4); poly(ctx, '#f2f2f6', [[x - 100, y + 30], [x + 100, y + 30], [x + 90, y + 42], [x - 90, y + 42]], 105, 4);
        for (let i = 0; i < 7; i++) { const cx = x - 60 + i * 20; poly(ctx, i % 2 ? '#7ad0f2' : '#ffd23f', [[cx - 4, y - 92], [cx + 4, y - 92], [cx + 4, y - 50], [cx - 4, y - 50]], 106 + i, 2); if (kind === 'cake') { ctx.fillStyle = '#ffb030'; ctx.beginPath(); ctx.ellipse(cx + Math.sin(t * 20 + i) * 1.5, y - 102, 5, 10, 0, 0, Math.PI * 2); ctx.fill(); } } }
      else if (kind === 'pan') { line(ctx, [[x - 20, y + 10], [x - 150, y + 30]], 16, '#2a2a30', 110); oval(ctx, '#3a3a42', x + 50, y, 90, 28, 111); oval(ctx, '#2a1a12', x + 50, y - 4, 74, 18, 112, 3); }
      else if (kind === 'mug') { poly(ctx, '#f2efe6', [[x - 26, y - 34], [x + 26, y - 34], [x + 22, y + 26], [x - 22, y + 26]], 113); ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(x + 30, y - 4, 14, -1.2, 1.2); ctx.stroke(); for (let i = 0; i < 2; i++) curve(ctx, [x - 8 + i * 16, y - 44], [x - 18 + i * 16 + Math.sin(t * 3 + i) * 8, y - 70], [x - 6 + i * 16, y - 96], 4, 'rgba(255,255,255,0.6)', 114 + i); }
      else if (kind === 'suitcase') { poly(ctx, '#c0583a', [[x - 70, y - 20], [x + 70, y - 20], [x + 70, y + 130], [x - 70, y + 130]], 116); line(ctx, [[x - 24, y - 20], [x - 24, y - 40], [x + 24, y - 40], [x + 24, y - 20]], 8, INK, 117); line(ctx, [[x - 70, y + 50], [x + 70, y + 50]], 4, '#8a3a24', 118); }
      else if (kind === 'remote') { poly(ctx, '#2a2a30', [[x - 14, y - 50], [x + 14, y - 50], [x + 14, y + 40], [x - 14, y + 40]], 119); oval(ctx, '#e8384f', x, y - 34, 6, 6, 120, 2, 8); }
      else if (kind === 'paper') { poly(ctx, '#fbf8ee', [[x - 50, y - 70], [x + 50, y - 70], [x + 50, y + 60], [x - 50, y + 60]], 121); for (let i = 0; i < 6; i++) line(ctx, [[x - 38, y - 50 + i * 18], [x + 38, y - 50 + i * 18]], 3, '#8a8a96', 122 + i); }
      else if (kind === 'baby') { blob(ctx, '#f6c8d8', [[x - 52, y - 30], [x + 48, y - 40], [x + 62, y + 20], [x + 20, y + 58], [x - 40, y + 50], [x - 62, y + 10]], 130); oval(ctx, '#f0c6a0', x - 8, y - 22, 26, 24, 131); for (const sd of [-1, 1]) oval(ctx, '#17121c', x - 8 + sd * 9, y - 26, 3, 3, 132 + sd, 0, 8); curve(ctx, [x - 16, y - 12], [x - 8, y - 6], [x, y - 12], 3, INK, 134); }
      else if (kind === 'nappy') { blob(ctx, '#f8f8f4', [[x - 40, y - 30], [x + 40, y - 30], [x + 30, y + 30], [x - 30, y + 30]], 135); oval(ctx, '#c8a050', x, y - 6, 14, 10, 136, 0, 8); }
      else if (kind === 'ring') { ctx.lineWidth = 7; ctx.strokeStyle = '#f2c230'; ctx.beginPath(); ctx.arc(x, y + 6, 16, 0, Math.PI * 2); ctx.stroke(); blob(ctx, '#bfefff', [[x, y - 28], [x + 13, y - 14], [x, y - 4], [x - 13, y - 14]], 99, 3); }
    };
    const person = (ctx, x, y, s, o = {}) => {
      const c = Object.assign({}, CAST[o.who || 'maya'], o.style || {}), f = o.face || {}, t = o.t || 0; T = t;
      const seed = c.seed || 1;
      ctx.save(); ctx.translate(x, y + (o.bob || 0)); const sq = o.squash || 1; ctx.scale(s * c.h * (o.flip ? -1 : 1) / Math.sqrt(sq), s * c.h * sq); ctx.rotate(o.lean || 0);
      const pose = o.pose || 'stand', drop = pose === 'kneel' ? 110 : pose === 'sit' ? 120 : 0;
      ctx.translate(0, drop + (o.walk != null ? -Math.abs(Math.sin(o.walk)) * 12 : 0));
      // shadow + legs
      if (pose !== 'bed' && c.outfit === 'gown') { ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, -drop + 4, 190, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        const GP = [[-90, -250], [90, -250], [150, -120], [190, -6], [0, 6], [-190, -6], [-150, -120]]; blob(ctx, c.top, GP, seed + 1); shadeIn(ctx, GP, seed + 1, c.top2, 60, 0.5); for (let i = 0; i < 4; i++) curve(ctx, [-60 + i * 40, -200], [-80 + i * 52, -100], [-120 + i * 80, -10], 3, 'rgba(0,0,0,0.15)', seed + 2 + i); }
      else if (pose !== 'bed') {
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, -drop + 4, 130, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        if (pose === 'kneel') { noodle(ctx, [-32, -235], [-40, -150], [-36, -100], 52, c.legs); noodle(ctx, [-36, -100], [-80, -100], [-130, -105], 50, c.legs); oval(ctx, c.shoe, -150, -100, 30, 22, seed + 2);
          noodle(ctx, [32, -235], [80, -230], [110, -160], 52, c.legs); noodle(ctx, [110, -160], [112, -60], [108, -110 + 110], 50, c.legs); oval(ctx, c.shoe, 128, -6, 40, 20, seed + 3); }
        else if (pose === 'sit') { for (const sd of [-1, 1]) { noodle(ctx, [sd * 32, -235], [sd * 40, -200], [sd * 44, -130], 52, c.legs); oval(ctx, c.shoe, sd * 50, -112, 36, 20, seed + 4 + sd); } }
        else for (const sd of [-1, 1]) { const wk = o.walk, ph = wk == null ? 0 : Math.sin(wk + (sd > 0 ? Math.PI : 0)), lift = wk == null ? 0 : Math.max(0, Math.cos(wk + (sd > 0 ? Math.PI : 0))) * 22, fx = sd * 36 + ph * 40;
          noodle(ctx, [sd * 30, -235], [sd * 34 + ph * 16, -120 - lift * 0.5], [fx, -24 - lift], 50, c.legs); oval(ctx, c.shoe, fx + sd * 8, -12 - lift, 42, 22, seed + 5 + sd); }
      }
      ctx.translate(0, Math.sin(t * 2.4 + seed) * (pose === 'bed' ? 2 : 3.5));
      // torso
      const TP = c.outfit === 'cardigan' ? [[-85, -425], [85, -425], [105, -330], [112, -230], [0, -222], [-112, -230], [-105, -330]] : c.girl ? [[-80, -428], [80, -428], [95, -330], [88, -232], [0, -226], [-88, -232], [-95, -330]] : [[-90, -428], [90, -428], [108, -330], [102, -226], [0, -220], [-102, -226], [-108, -330]];
      blob(ctx, c.top, TP, seed + 10); shadeIn(ctx, TP, seed + 10, c.top2, 40, 0.6);
      if (pose !== 'bed' && c.outfit !== 'gown') { ctx.fillStyle = c.legs; ctx.save(); ctx.globalAlpha = 1; blob(ctx, c.legs, [[-88, -240], [88, -240], [92, -210], [-92, -210]], seed + 11); ctx.restore(); }
      if (c.outfit === 'hoodie') { blob(ctx, c.top2, [[-55, -330], [55, -330], [62, -270], [-62, -270]], seed + 12, 4); for (const sd of [-1, 1]) { line(ctx, [[sd * 22, -425], [sd * 26, -365]], 4, INK, seed + 13 + sd); oval(ctx, '#f2efe6', sd * 26, -360, 6, 6, seed + 15, 3, 8); } }
      if (c.outfit === 'suit') { blob(ctx, '#f4f2ee', [[-40, -428], [40, -428], [0, -330]], seed + 12, 4); poly(ctx, c.tie, [[-10, -420], [10, -420], [16, -340], [0, -318], [-16, -340]], seed + 13, 4); line(ctx, [[-40, -428], [-6, -300]], 4, INK, seed + 14); line(ctx, [[40, -428], [6, -300]], 4, INK, seed + 15); }
      if (c.outfit === 'tee') blob(ctx, c.skin, [[-34, -428], [34, -428], [0, -400]], seed + 12, 4);
      if (c.outfit === 'crop') { blob(ctx, c.skin, [[-48, -428], [48, -428], [20, -392], [-20, -392]], seed + 12, 4); line(ctx, [[-60, -300], [60, -300]], 4, c.top2, seed + 13); }
      if (c.outfit === 'slip') { blob(ctx, c.skin, [[-66, -428], [66, -428], [46, -362], [0, -340], [-46, -362]], seed + 12, 4); curve(ctx, [-2, -376], [0, -360], [0, -346], 4, c.sh, seed + 13); for (const sd of [-1, 1]) line(ctx, [[sd * 56, -372], [sd * 62, -430]], 5, c.top2, seed + 14 + sd); }
      if (c.outfit === 'bare') { for (const sd of [-1, 1]) curve(ctx, [sd * 8, -352], [sd * 50, -336], [sd * 76, -372], 4, c.sh, seed + 13 + sd); line(ctx, [[0, -345], [0, -250]], 3, c.sh, seed + 16); }
      if (c.outfit === 'cardigan') { line(ctx, [[0, -425], [0, -228]], 4, INK, seed + 12); for (let i = 0; i < 4; i++) oval(ctx, '#f2efe6', -16, -395 + i * 42, 7, 7, seed + 13 + i, 3, 8); }
      if (c.pearls) for (let i = 0; i < 9; i++) oval(ctx, '#f4f0ea', -40 + i * 10, -418 + Math.abs(i - 4) * 4, 6, 6, seed + 20 + i, 2, 8);
      // arms
      const A = Array.isArray(o.arms) ? o.arms : ARMS[o.arms || 'down'];
      A.forEach((a, i) => { const sd = i ? 1 : -1, sh = [sd * 82, -405], el = [sh[0] + a[0], sh[1] + a[1]], hd = [sh[0] + a[2], sh[1] + a[3]];
        noodle(ctx, sh, el, hd, 34, c.armCol || c.top); hand(ctx, hd[0], hd[1], c.skin, seed + 30 + i); if (i === 1 && o.hold) prop(ctx, o.hold, hd[0] + 6, hd[1] - 30, t); });
      // neck + head
      blob(ctx, c.skin, [[-24, -440], [24, -440], [28, -470], [-28, -470]], seed + 40);
      ctx.save(); ctx.translate(0, -575 + (f.talk ? -Math.abs(Math.sin(t * 6.5 + seed)) * 6 : 0)); ctx.rotate((o.tilt || 0) + (f.talk ? Math.sin(t * 6.5 + seed) * 0.05 : Math.sin(t * 1.1 + seed) * 0.018));
      if (c.veil) { ctx.save(); ctx.globalAlpha = 0.75; blob(ctx, '#ffffff', [[-90, -150], [90, -150], [170, 120], [190, 330], [-190, 330], [-170, 120]], seed + 39, 3); ctx.restore(); }
      if (c.hs === 'long') blob(ctx, c.hair, [[-112, -60], [-150, 60], [-130, 140], [-80, 150], [80, 150], [130, 140], [150, 60], [112, -60]], seed + 41);
      if (c.hs === 'curls') for (let i = 0; i < 11; i++) { const a = Math.PI * 0.95 + (i / 10) * Math.PI * 1.1; oval(ctx, c.hair, Math.cos(a) * 112, Math.sin(a) * 112 - 24, 34, 32, seed + 42 + i, LW, 10); }
      // ears + face (long, big chin)
      for (const sd of [-1, 1]) oval(ctx, c.skin, sd * 104, 4, 20, 28, seed + 55 + sd, LW, 10);
      const FP = [[-104, -70], [-112, 30], [-84, 110], [-40, 150], [0, 158], [40, 150], [84, 110], [112, 30], [104, -70], [60, -128], [0, -138], [-60, -128]];
      blob(ctx, c.skin, FP, seed + 60); shadeIn(ctx, FP, seed + 60, c.sh, 50, 0.6);
      if (c.stubble) { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#6a5040'; for (let i = 0; i < 70; i++) { const a = Math.sin(i * 91.7) * 0.5 + 0.5, b = Math.sin(i * 37.3) * 0.5 + 0.5; ctx.fillRect(-80 + a * 160, 92 + b * 50 - Math.abs(-80 + a * 160) * 0.12, 3, 3); } ctx.restore(); }
      // hair on top
      if (c.hs === 'long') { blob(ctx, c.hair, [[-112, -40], [-104, -110], [-40, -150], [40, -150], [104, -110], [112, -40], [70, -88], [20, -96], [-30, -70]], seed + 70); }
      else if (c.hs === 'bun') { oval(ctx, c.hair, 0, -170, 48, 42, seed + 69); blob(ctx, c.hair, [[-112, -30], [-104, -110], [-40, -146], [40, -146], [104, -110], [112, -30], [60, -100], [-60, -100]], seed + 70); }
      else if (c.hs === 'bald') { for (const sd of [-1, 1]) blob(ctx, c.hair, [[sd * 112, -60], [sd * 96, -20], [sd * 110, 20], [sd * 118, -20]], seed + 70 + sd); curve(ctx, [-50, -118], [-10, -136], [30, -124], 9, 'rgba(255,255,255,0.35)', seed + 72); }
      else if (c.hs === 'slick') blob(ctx, c.hair, [[-112, -40], [-108, -112], [-50, -150], [50, -152], [108, -112], [112, -40], [90, -96], [-20, -110], [-80, -90]], seed + 70);
      else if (c.hs === 'cap') { blob(ctx, c.capCol, [[-114, -50], [-104, -120], [-40, -152], [40, -152], [104, -120], [114, -50]], seed + 70); poly(ctx, c.capCol, [[-114, -52], [130, -52], [150, -36], [-110, -36]], seed + 71); oval(ctx, '#ffffff', 0, -110, 18, 14, seed + 72, 3, 10); }
      else if (c.hs === 'spiky') { const pts = [[-108, -50]]; for (let i = 0; i <= 10; i++) { const a = Math.PI + (i / 10) * Math.PI; pts.push([Math.cos(a) * (i % 2 ? 140 : 108), -60 + Math.sin(a) * (i % 2 ? 125 : 98)]); } pts.push([108, -50], [40, -96], [-40, -96]); blob(ctx, c.hair, pts, seed + 70); }
      else if (c.hs === 'curls') for (let i = 0; i < 6; i++) oval(ctx, c.hair, -90 + i * 36, -112 + Math.abs(i - 2.5) * 10, 30, 28, seed + 75 + i, LW, 10);
      if (c.hs !== 'bald' && c.hs !== 'cap') curve(ctx, [-62, c.hs === 'spiky' ? -150 : -126], [-10, c.hs === 'spiky' ? -178 : -146], [40, c.hs === 'spiky' ? -160 : -132], 9, 'rgba(255,255,255,0.22)', seed + 79);
      // eyes
      const eyes = f.eyes || c.eyes || 'open', blink = Math.sin(t * 1.7 + seed) > 0.985 && eyes !== 'closed', look = f.look || [0, 0];
      for (const sd of [-1, 1]) { const ex = sd * 44, ey = -22, wide = eyes === 'wide', rx = wide ? 46 : 40, ry = wide ? 54 : 46;
        if (eyes === 'closed' || blink) { curve(ctx, [ex - 32, ey], [ex, ey + 20], [ex + 32, ey], LW + 1, INK, seed + 80 + sd); continue; }
        if (eyes === 'happy') { curve(ctx, [ex - 30, ey + 10], [ex, ey - 22], [ex + 30, ey + 10], LW + 1, INK, seed + 80 + sd); continue; }
        oval(ctx, '#ffffff', ex, ey, rx, ry, seed + 82 + sd);
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + look[0] * 14 + (c.derp ? sd * -3 : 0), ey + 4 + look[1] * 14, wide ? 5 : 8, 0, Math.PI * 2); ctx.fill();
        if (eyes === 'half') { ctx.fillStyle = c.skin; ctx.beginPath(); ctx.ellipse(ex, ey - 10, rx + 3, ry * 0.62, 0, Math.PI, 0); ctx.lineTo(ex + rx + 3, ey - 6); ctx.lineTo(ex - rx - 3, ey - 6); ctx.fill(); line(ctx, [[ex - rx + 2, ey - 6], [ex + rx - 2, ey - 6]], LW, INK, seed + 84 + sd); }
        if (eyes === 'angry' || eyes === 'sad') { const inX = ex - sd * rx, outX = ex + sd * rx, inY = eyes === 'angry' ? ey + 2 : ey - ry * 0.8, outY = eyes === 'angry' ? ey - ry * 0.8 : ey - 2;
          ctx.fillStyle = c.skin; ctx.beginPath(); ctx.moveTo(inX, inY); ctx.lineTo(outX, outY); ctx.lineTo(outX, ey - ry - 6); ctx.lineTo(inX, ey - ry - 6); ctx.closePath(); ctx.fill(); line(ctx, [[inX + sd * 4, inY], [outX - sd * 4, outY]], LW + 1, INK, seed + 86 + sd); }
        // brows
        const b = f.brows || 0; line(ctx, [[ex - sd * 30, ey - ry - 14 + b * 14 * 1], [ex + sd * 30, ey - ry - 18 - b * 6]], 6, c.browCol || INK, seed + 88 + sd);
        if (c.glasses) { ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.beginPath(); ctx.ellipse(ex, ey, rx + 8, ry + 6, 0, 0, Math.PI * 2); ctx.stroke(); }
      }
      if (c.glasses) line(ctx, [[-4, -22], [4, -22]], 5, INK, seed + 90);
      // nose (bulb) and mouth
      oval(ctx, c.skin, 4, 48, 26, 32, seed + 91, LW, 12); ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = c.sh; ctx.beginPath(); ctx.ellipse(12, 58, 12, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (c.mustache) blob(ctx, c.hair, [[-56, 90], [-20, 76], [0, 84], [20, 76], [56, 90], [30, 98], [0, 92], [-30, 98]], seed + 95);
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
      if (c.hoops) for (const sd of [-1, 1]) { ctx.lineWidth = 6; ctx.strokeStyle = '#e8b830'; ctx.beginPath(); ctx.arc(sd * 108, 46, 15, 0, Math.PI * 2); ctx.stroke(); }
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
        oval(ctx, '#c0a080', 360, 1100, 300, 60, 311, LW, 18);
        for (let i = 1; i < 6; i++) line(ctx, [[0, H_ * 0.72 + i * 62], [W, H_ * 0.72 + i * 62]], 3, 'rgba(0,0,0,0.18)', 312 + i);
        for (const [x, y] of [[110, 270], [170, 275]]) { oval(ctx, x < 150 ? '#d39b74' : '#f0c6a0', x, y, 22, 26, 318 + x, 3, 10); }
        poly(ctx, '#b0643c', [[30, 820], [110, 820], [100, 900], [40, 900]], 320); for (let i = 0; i < 5; i++) oval(ctx, '#4f8a4a', 70 + Math.cos(i * 1.3) * 34, 760 - i * 22, 26, 44, 321 + i, 4, 10);
        const lg = ctx.createRadialGradient(640, 640, 10, 640, 640, 260); lg.addColorStop(0, 'rgba(255,230,150,0.35)'); lg.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = lg; ctx.fillRect(380, 380, 520, 520); },
      cafe: (ctx, W, H_, t, o = {}) => { T = t; wall(ctx, W, H_, '#e8d2a8', '#7a5a3c', 0.7);
        poly(ctx, '#2a2a30', [[120, 150], [600, 150], [600, 400], [120, 400]], 320); ctx.fillStyle = '#f2efe6'; ctx.font = '900 44px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('DONUTS', 360, 230); ctx.font = '700 30px sans-serif'; ctx.fillText('glazed  2.50', 360, 300); ctx.fillText('ring box  free', 360, 350);
        for (const x of [180, 360, 540]) { line(ctx, [[x, 0], [x, 70]], 4, INK, 321 + x); blob(ctx, '#f2d06a', [[x - 40, 70], [x + 40, 70], [x + 30, 110], [x - 30, 110]], 322 + x); }
        poly(ctx, '#c98a5a', [[0, 760], [720, 760], [720, 900], [0, 900]], 330); poly(ctx, '#a86a3a', [[0, 740], [720, 740], [720, 780], [0, 780]], 331);
        poly(ctx, '#5a5f6a', [[40, 600], [180, 600], [180, 740], [40, 740]], 332); poly(ctx, '#2a2a30', [[70, 630], [150, 630], [150, 680], [70, 680]], 333); oval(ctx, '#f4efe6', 110, 715, 24, 18, 334, 4, 10);
        poly(ctx, 'rgba(200,235,255,0.55)', [[470, 620], [700, 620], [700, 740], [470, 740]], 335); for (let i = 0; i < 4; i++) { oval(ctx, '#e0a050', 505 + i * 55, 700, 24, 15, 336 + i, 4, 10); oval(ctx, ['#f29ac0', '#6a3a2a', '#f2e6c0', '#9ad0f2'][i], 505 + i * 55, 695, 20, 10, 340 + i, 0, 10); }
        for (let i = 0; i < 8; i++) line(ctx, [[i * 100, H_ * 0.7 + 260], [i * 100 - 60, H_]], 3, 'rgba(0,0,0,0.15)', 345 + i); },
      hospital: (ctx, W, H_, t, o = {}) => { T = t; wall(ctx, W, H_, '#a8c8b8', '#c8d0cc', 0.7);
        ctx.save(); ctx.translate(250, 0);poly(ctx, '#e8f0ee', [[40, 140], [200, 140], [200, 360], [40, 360]], 340); if (o.xray) { ctx.fillStyle = '#10161c'; ctx.fillRect(56, 156, 128, 188); ctx.strokeStyle = '#dfe8ee'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(120, 250, 40, 60, 0, 0, Math.PI * 2); ctx.stroke(); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(84, 200 + i * 20); ctx.quadraticCurveTo(120, 190 + i * 20, 156, 200 + i * 20); ctx.stroke(); } ctx.strokeStyle = '#f2c230'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(120, 268, 14, 0, Math.PI * 2); ctx.stroke(); } ctx.restore();
        poly(ctx, '#2a3036', [[520, 160], [690, 160], [690, 300], [520, 300]], 341); ctx.strokeStyle = '#4af08a'; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const x = 530 + i * 3.7, ph = ((i / 40) + t * 0.8) % 1, y = 230 - (ph > 0.45 && ph < 0.5 ? 50 : ph > 0.5 && ph < 0.55 ? -30 : 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        for (let i = 0; i < 6; i++) poly(ctx, '#e6eef8', [[i * 40 - 10, 0], [i * 40 + 30, 0], [i * 40 + 30, 900], [i * 40 - 10, 900]], 350 + i, 3);
        poly(ctx, '#d0d8e0', [[300, 720], [720, 720], [720, 780], [300, 780]], 360);
        // (the X-ray lightbox sits where a window would be)
        line(ctx, [[680, 900], [680, 420]], 6, INK, 371); poly(ctx, 'rgba(200,235,255,0.8)', [[650, 430], [710, 430], [705, 520], [655, 520]], 372); line(ctx, [[680, 520], [600, 700]], 3, '#9ab', 373);
        for (let i = 0; i < 6; i++) line(ctx, [[0, H_ * 0.7 + i * 64], [W, H_ * 0.7 + i * 64]], 3, 'rgba(0,0,0,0.1)', 374 + i); },
      // kitchen: cabinets, a stove (o.fire: flames on the hob from that time), a fridge with a note (o.note)
      kitchen: (ctx, W, H_, t, o = {}) => { T = t; wall(ctx, W, H_, '#e6c86a', '#7a8a9a', 0.7);
        ctx.save(); ctx.globalAlpha = 0.2; for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { ctx.fillStyle = (i + j) % 2 ? '#fff' : '#d8b048'; ctx.fillRect(i * 64, 420 + j * 64, 62, 62); } ctx.restore();
        for (let i = 0; i < 3; i++) poly(ctx, '#5a8a7a', [[40 + i * 150, 120], [180 + i * 150, 120], [180 + i * 150, 360], [40 + i * 150, 360]], 400 + i); for (let i = 0; i < 3; i++) oval(ctx, '#f2c230', 160 + i * 150, 330, 8, 8, 404 + i, 3, 8);
        poly(ctx, '#e8eef2', [[520, 160], [690, 160], [690, 900], [520, 900]], 410); line(ctx, [[520, 420], [690, 420]], 5, INK, 411); line(ctx, [[540, 220], [540, 380]], 9, '#9aa4ac', 412); line(ctx, [[540, 470], [540, 640]], 9, '#9aa4ac', 413);
        if (o.note) { poly(ctx, '#fff6a8', [[560, 240], [680, 240], [680, 360], [560, 360]], 414, 3); ctx.save(); ctx.translate(620, 300); ctx.rotate(-0.06); ctx.fillStyle = INK; ctx.font = '900 22px sans-serif'; ctx.textAlign = 'center'; o.note.split('\n').forEach((l, i, a) => ctx.fillText(l, 0, (i - (a.length - 1) / 2) * 28 + 8)); ctx.restore(); }
        poly(ctx, '#c9a27a', [[0, 760], [510, 760], [510, 920], [0, 920]], 420); poly(ctx, '#e8e2d8', [[0, 730], [510, 730], [510, 770], [0, 770]], 421);
        poly(ctx, '#3a3a42', [[170, 700], [400, 700], [400, 735], [170, 735]], 422); for (const x of [225, 345]) { ctx.strokeStyle = o.fire != null && t > o.fire ? '#ff6a30' : '#555'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, 712, 40, 9, 0, 0, Math.PI * 2); ctx.stroke(); }
        poly(ctx, '#2a2a30', [[200, 790], [370, 790], [370, 880], [200, 880]], 423); ctx.fillStyle = o.fire != null && t > o.fire ? '#ff8a40' : '#4a3a30'; ctx.fillRect(214, 804, 142, 62);
        for (let i = 0; i < 6; i++) line(ctx, [[0, H_ * 0.7 + i * 64], [W, H_ * 0.7 + i * 64]], 3, 'rgba(0,0,0,0.12)', 430 + i);
        if (o.fire != null && t > o.fire) fire(ctx, 285, 700, Math.min(1, (t - o.fire) / 0.5) * (o.fireSize || 1), t);
        if (o.smoke != null && t > o.smoke) { ctx.save(); for (let i = 0; i < 9; i++) { const u = ((t - o.smoke) * 0.5 + i / 9) % 1; ctx.globalAlpha = 0.35 * (1 - u); ctx.fillStyle = '#5a5a62'; ctx.beginPath(); ctx.arc(285 + Math.sin(i * 2 + t) * 60, 680 - u * 560, 50 + u * 90, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); } },
      // plane cabin: curved wall with oval windows (sky or night), seat backs in a row
      plane: (ctx, W, H_, t, o = {}) => { T = t; wall(ctx, W, H_, '#dfe2e8', '#5a6070', 0.72);
        for (let i = 0; i < 3; i++) { const x = 120 + i * 240; oval(ctx, '#9aa4b4', x, 330, 62, 92, 440 + i); oval(ctx, o.night ? '#1a2048' : '#9fd4ff', x, 330, 48, 76, 444 + i, 4); if (!o.night) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(x - 10 + Math.sin(t * 0.5 + i) * 14, 350, 22, 9, 0, 0, Math.PI * 2); ctx.fill(); } }
        poly(ctx, '#c8ccd6', [[0, 120], [720, 120], [720, 150], [0, 150]], 448);
        for (let i = 0; i < 3; i++) { const x = 130 + i * 230; blob(ctx, '#3a5a9a', [[x - 105, 560], [x + 105, 560], [x + 110, 960], [x - 110, 960]], 450 + i); blob(ctx, '#f2f2f6', [[x - 70, 560], [x + 70, 560], [x + 70, 620], [x - 70, 620]], 454 + i, 3); } },
    };
    // cartoon flames, bottom centre at x, y; s = size (1 is about 200 px tall)
    const fire = (ctx, x, y, s, t) => { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [col, k] of [['#e8382a', 1], ['#ff9a2a', 0.72], ['#ffe060', 0.42]]) { const pts = []; for (let i = 0; i <= 8; i++) { const a = (i / 8) * Math.PI, r = (i % 2 ? 0.55 : 1) * k; pts.push([Math.cos(a) * 110 * k, -Math.sin(a) * (120 + 90 * Math.abs(Math.sin(t * 9 + i * 1.7))) * r]); } pts.push([0, 10]); blob(ctx, col, pts, 700 + k * 10, k === 1 ? LW : 0); } ctx.restore(); };
    // hospital bed blanket over a person in pose 'bed' (draw after the person)
    const blanket = (ctx, x, y, t) => { T = t; poly(ctx, '#f2f6fa', [[x - 230, y - 180], [x + 230, y - 180], [x + 250, y + 60], [x - 250, y + 60]], 370); line(ctx, [[x - 220, y - 150], [x + 220, y - 150]], 4, '#9ab', 371); };
    // a big comic sound word ("CRUNCH")
    const sfxWord = (ctx, txt, x, y, u, col = '#ffd23f', rot = -0.12) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(u, u); ctx.font = '900 110px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 18; ctx.strokeStyle = INK; ctx.strokeText(txt, 0, 0); ctx.fillStyle = col; ctx.fillText(txt, 0, 0); ctx.restore(); };
    const bed = (ctx, x, y, t) => { T = t; poly(ctx, '#8a9aa8', [[x - 240, y - 420], [x + 240, y - 420], [x + 240, y - 120], [x - 240, y - 120]], 380); poly(ctx, '#f6f8fa', [[x - 200, y - 330], [x - 30, y - 330], [x - 30, y - 240], [x - 200, y - 240]], 381); };
    // ---------------- animals ----------------
    // bulgy eyes for any face: f = { eyes, look, brows }, skin = lid colour
    const eyePair = (ctx, f, skin, seed, dx, ey, rx, ry, t) => { const eyes = f.eyes || 'open', blink = Math.sin(t * 1.9 + seed) > 0.985 && eyes !== 'closed', look = f.look || [0, 0];
      for (const sd of [-1, 1]) { const ex = sd * dx, wide = eyes === 'wide', RX = wide ? rx * 1.15 : rx, RY = wide ? ry * 1.15 : ry;
        if (eyes === 'closed' || blink) { curve(ctx, [ex - RX * 0.8, ey], [ex, ey + RY * 0.45], [ex + RX * 0.8, ey], LW + 1, INK, seed + 80 + sd); continue; }
        if (eyes === 'happy') { curve(ctx, [ex - RX * 0.75, ey + RY * 0.2], [ex, ey - RY * 0.5], [ex + RX * 0.75, ey + RY * 0.2], LW + 1, INK, seed + 80 + sd); continue; }
        oval(ctx, '#ffffff', ex, ey, RX, RY, seed + 82 + sd); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + look[0] * RX * 0.35, ey + 3 + look[1] * RY * 0.3, wide ? 5 : 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + look[0] * RX * 0.35 - 3, ey - 1 + look[1] * RY * 0.3, 2.5, 0, Math.PI * 2); ctx.fill();
        if (eyes === 'half') { ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(ex, ey - 8, RX + 3, RY * 0.62, 0, Math.PI, 0); ctx.lineTo(ex + RX + 3, ey - 4); ctx.lineTo(ex - RX - 3, ey - 4); ctx.fill(); line(ctx, [[ex - RX + 2, ey - 4], [ex + RX - 2, ey - 4]], LW, INK, seed + 84 + sd); }
        if (eyes === 'angry' || eyes === 'sad') { const inX = ex - sd * RX, outX = ex + sd * RX, inY = eyes === 'angry' ? ey + 2 : ey - RY * 0.8, outY = eyes === 'angry' ? ey - RY * 0.8 : ey - 2;
          ctx.fillStyle = skin; ctx.beginPath(); ctx.moveTo(inX, inY); ctx.lineTo(outX, outY); ctx.lineTo(outX, ey - RY - 6); ctx.lineTo(inX, ey - RY - 6); ctx.closePath(); ctx.fill(); line(ctx, [[inX + sd * 4, inY], [outX - sd * 4, outY]], LW + 1, INK, seed + 86 + sd); }
        const b = f.brows || 0; line(ctx, [[ex - sd * RX * 0.7, ey - RY - 12 + b * 12], [ex + sd * RX * 0.7, ey - RY - 15 - b * 5]], 6, INK, seed + 88 + sd); } };
    const mouthShape = (ctx, f, t, seed, y, w = 1) => { let m = f.mouth || 'smile'; if (f.talk) { const ph = Math.floor(t * 11 + seed) % 3; m = ph === 0 ? 'open' : ph === 1 ? 'o' : m === 'open' ? 'smile' : m; }
      if (m === 'smile') curve(ctx, [-30 * w, y - 4], [0, y + 18], [30 * w, y - 4], LW, INK, seed + 92);
      else if (m === 'smirk') curve(ctx, [-26 * w, y + 4], [8, y + 10], [32 * w, y - 12], LW, INK, seed + 92);
      else if (m === 'flat') line(ctx, [[-26 * w, y + 2], [28 * w, y]], LW, INK, seed + 92);
      else if (m === 'frown') curve(ctx, [-26 * w, y + 10], [0, y - 8], [28 * w, y + 12], LW, INK, seed + 92);
      else { const big = m === 'shout' ? 1.5 : m === 'o' ? 0.65 : 1; oval(ctx, '#4a1622', 0, y + 6, (m === 'o' ? 16 : 26) * big * w, 17 * big, seed + 94, LW, 12); ctx.fillStyle = '#e8687a'; ctx.beginPath(); ctx.ellipse(0, y + 6 + 9 * big, 12 * big, 5 * big, 0, 0, Math.PI * 2); ctx.fill(); }
      if (f.tongue) { blob(ctx, '#ef7a90', [[-14, y + 8], [14, y + 8], [16, y + 40], [0, y + 50], [-16, y + 40]], seed + 96, 4); line(ctx, [[0, y + 14], [0, y + 38]], 3, '#c8506a', seed + 97); } };
    const BREEDS = {
      lab: { col: '#d9a35c', col2: '#f2d6a8', ear: '#b8803e', ears: 'flop', h: 1 }, mutt: { col: '#a8764a', col2: '#e8c8a0', ear: '#6e4a2c', ears: 'flop', h: 1 },
      pug: { col: '#e2c49a', col2: '#f2e2c8', ear: '#2a2024', ears: 'fold', mask: '#2a2024', h: 0.82 }, husky: { col: '#7a828e', col2: '#f4f4f6', ear: '#5a626e', ears: 'up', h: 1.05 },
      chihuahua: { col: '#e8b880', col2: '#f6e2c4', ear: '#d09a62', ears: 'big', h: 0.62 }, poodle: { col: '#f4f2ee', col2: '#ffffff', ear: '#e6e2da', ears: 'puff', h: 0.95 },
      shiba: { col: '#e08a3c', col2: '#f6ead8', ear: '#c06a28', ears: 'up', h: 0.95 },
    };
    // a sitting (or lying) dog facing the camera; x, y = where it sits; o = { breed, t, face: {...}, tilt, wag, pose: 'sit' | 'lie', grey, collar, bob, squash, flip }
    const dog = (ctx, x, y, s, o = {}) => { const b = BREEDS[o.breed || 'lab'], f = o.face || {}, t = o.t || 0, seed = 400 + Object.keys(BREEDS).indexOf(o.breed || 'lab') * 30; T = t;
      ctx.save(); ctx.translate(x, y + (o.bob || 0)); const sq = o.squash || 1; ctx.scale(s * b.h * (o.flip ? -1 : 1) / Math.sqrt(sq), s * b.h * sq);
      ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, 4, 150, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      const lie = o.pose === 'lie', wag = Math.sin(t * (o.wag ? 18 : 3)) * (o.wag ? 0.5 : 0.12);
      ctx.save(); ctx.translate(lie ? 150 : 90, lie ? -50 : -40); ctx.rotate(-0.9 + wag); noodle(ctx, [0, 0], [30, -40], [20, -110], o.breed === 'pug' ? 22 : 30, b.col); if (o.breed === 'poodle') oval(ctx, b.col2, 20, -116, 26, 24, seed + 1); ctx.restore();
      const BP = lie ? [[-180, -10], [-150, -110], [0, -130], [150, -110], [190, -10], [0, 4]] : [[-110, -10], [-100, -150], [-60, -230], [60, -230], [100, -150], [110, -10], [0, 4]];
      blob(ctx, b.col, BP, seed + 2); shadeIn(ctx, BP, seed + 2, shade2(b.col), 30, 0.45);
      if (!lie) blob(ctx, b.col2, [[-50, -40], [-46, -150], [0, -190], [46, -150], [50, -40], [0, -20]], seed + 3, 0);
      if (o.breed === 'poodle') for (const [px, py] of [[-90, -40], [90, -40], [-70, -170], [70, -170]]) oval(ctx, b.col2, px, py, 40, 36, seed + 4 + px, LW, 12);
      for (const sd of [-1, 1]) { if (!lie) noodle(ctx, [sd * 40, -120], [sd * 44, -70], [sd * 46, -20], 36, b.col); oval(ctx, b.col2, sd * (lie ? 120 : 50), -12, 30, 18, seed + 6 + sd, LW, 10); }
      if (o.collar) { poly(ctx, o.collar, [[-62, -222], [62, -222], [58, -200], [-58, -200]], seed + 8); oval(ctx, '#f2c230', 0, -192, 12, 12, seed + 9, 4, 10); }
      ctx.save(); ctx.translate(0, lie ? -150 : -300); ctx.rotate((o.tilt || 0) + (f.talk ? Math.sin(t * 6.5 + seed) * 0.05 : Math.sin(t * 1.3 + seed) * 0.03));
      if (b.ears === 'flop' || b.ears === 'fold') for (const sd of [-1, 1]) blob(ctx, b.ear, [[sd * 70, -70], [sd * 128, -40], [sd * 136, 50], [sd * 108, 80], [sd * 84, 10]], seed + 10 + sd);
      if (b.ears === 'up') for (const sd of [-1, 1]) { blob(ctx, b.ear, [[sd * 50, -80], [sd * 110, -170], [sd * 112, -50]], seed + 10 + sd); blob(ctx, '#f2c6c8', [[sd * 66, -86], [sd * 100, -140], [sd * 100, -70]], seed + 12 + sd, 3); }
      if (b.ears === 'big') for (const sd of [-1, 1]) { blob(ctx, b.ear, [[sd * 40, -70], [sd * 170, -190], [sd * 150, -20]], seed + 10 + sd); blob(ctx, '#f2c6c8', [[sd * 66, -70], [sd * 150, -160], [sd * 134, -40]], seed + 12 + sd, 3); }
      const HP = [[-104, -40], [-96, -100], [-40, -128], [40, -128], [96, -100], [104, -40], [92, 40], [40, 76], [-40, 76], [-92, 40]];
      blob(ctx, b.col, HP, seed + 14); shadeIn(ctx, HP, seed + 14, shade2(b.col), 40, 0.45);
      if (b.ears === 'puff') for (const sd of [-1, 1]) oval(ctx, b.col2, sd * 110, 0, 40, 60, seed + 16 + sd, LW, 12);
      if (b.ears === 'puff') oval(ctx, b.col2, 0, -120, 60, 40, seed + 18, LW, 12);
      if (o.breed === 'husky') blob(ctx, b.col2, [[-60, -40], [-30, -70], [0, -40], [30, -70], [60, -40], [70, 50], [-70, 50]], seed + 19, 0);
      blob(ctx, b.mask || b.col2, [[-58, 10], [-50, -14], [0, -24], [50, -14], [58, 10], [40, 60], [-40, 60]], seed + 20, 4);
      if (o.grey) { ctx.save(); ctx.globalAlpha = 0.55; blob(ctx, '#dcdce2', [[-50, 0], [0, -14], [50, 0], [36, 50], [-36, 50]], seed + 21, 0); ctx.restore(); }
      eyePair(ctx, f, b.col, seed, 46, -48, 30, 34, t);
      oval(ctx, INK, 0, 2, 22, 15, seed + 22, 0, 10); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(-6, -3, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.translate(0, -6); mouthShape(ctx, f, t, seed, 42, 0.9); ctx.restore();
      if (f.tears) for (const sd of [-1, 1]) { const k = (t * 1.2 + (sd > 0 ? 0.5 : 0)) % 1; ctx.fillStyle = '#8fd6ff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(sd * 50, -20 + k * 70, 8, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      if (f.sweat) { ctx.fillStyle = '#8fd6ff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(-100, -80 + ((t * 40) % 40), 9, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      if (f.blush) { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#ff6a8a'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 74, 14, 20, 11, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
      ctx.restore(); ctx.restore(); };
    const shade2 = (hex) => { const n = parseInt(hex.slice(1), 16); return `rgb(${((n >> 16) & 255) * 0.72 | 0},${((n >> 8) & 255) * 0.72 | 0},${(n & 255) * 0.72 | 0})`; };
    // a sitting cat facing the camera: o = { col, col2, stripes, t, face, tilt, tail, pose: 'sit' | 'loaf', collar, flip }
    const cat = (ctx, x, y, s, o = {}) => { const col = o.col || '#7a7a86', col2 = o.col2 || '#e8e6ea', f = o.face || {}, t = o.t || 0, seed = 600 + (o.seed || 0); T = t;
      ctx.save(); ctx.translate(x, y + (o.bob || 0)); const sq = o.squash || 1; ctx.scale(s * (o.flip ? -1 : 1) / Math.sqrt(sq), s * sq);
      ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, 4, 120, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      const tw = Math.sin(t * 2.2 + seed) * 0.25; ctx.save(); ctx.translate(70, -20); ctx.rotate(-0.4 + tw); noodle(ctx, [0, 0], [80, -20], [70, -150], 22, col); ctx.restore();
      const loaf = o.pose === 'loaf', BP = loaf ? [[-130, -6], [-110, -110], [0, -130], [110, -110], [130, -6], [0, 4]] : [[-86, -8], [-80, -130], [-50, -200], [50, -200], [80, -130], [86, -8], [0, 4]];
      blob(ctx, col, BP, seed + 2); shadeIn(ctx, BP, seed + 2, shade2(col), 20, 0.45); if (!loaf) blob(ctx, col2, [[-36, -40], [-34, -140], [0, -170], [34, -140], [36, -40], [0, -24]], seed + 3, 0);
      if (o.stripes) for (let i = 0; i < 3; i++) for (const sd of [-1, 1]) line(ctx, [[sd * 80, -60 - i * 40], [sd * 50, -70 - i * 40]], 7, shade2(col), seed + 4 + i);
      for (const sd of [-1, 1]) { if (!loaf) noodle(ctx, [sd * 30, -100], [sd * 32, -60], [sd * 34, -18], 28, col); oval(ctx, col2, sd * (loaf ? 70 : 36), -10, 24, 14, seed + 6 + sd, LW, 10); }
      if (o.collar) { poly(ctx, o.collar, [[-50, -196], [50, -196], [46, -178], [-46, -178]], seed + 8); oval(ctx, '#f2c230', 0, -170, 10, 10, seed + 9, 4, 10); }
      ctx.save(); ctx.translate(0, loaf ? -170 : -270); ctx.rotate((o.tilt || 0) + (f.talk ? Math.sin(t * 6.5 + seed) * 0.05 : Math.sin(t * 1.1 + seed) * 0.03));
      for (const sd of [-1, 1]) { blob(ctx, col, [[sd * 46, -70], [sd * 100, -150], [sd * 108, -30]], seed + 10 + sd); blob(ctx, '#f2c6c8', [[sd * 60, -74], [sd * 92, -126], [sd * 96, -50]], seed + 12 + sd, 3); }
      const HP = [[-108, -20], [-96, -84], [-40, -108], [40, -108], [96, -84], [108, -20], [90, 40], [40, 66], [-40, 66], [-90, 40]];
      blob(ctx, col, HP, seed + 14); shadeIn(ctx, HP, seed + 14, shade2(col), 40, 0.45);
      if (o.stripes) for (let i = 0; i < 3; i++) line(ctx, [[-20 + i * 20, -104], [-16 + i * 16, -76]], 6, shade2(col), seed + 15 + i);
      blob(ctx, col2, [[-48, 14], [-30, -8], [0, -2], [30, -8], [48, 14], [30, 54], [-30, 54]], seed + 16, 0);
      const ff = Object.assign({}, f); if (!ff.eyes) ff.eyes = 'half';
      eyePair(ctx, ff, col, seed, 44, -34, 28, 30, t);
      blob(ctx, '#e88aa0', [[-12, 6], [12, 6], [0, 18]], seed + 17, 3);
      for (const sd of [-1, 1]) for (const k of [-1, 1]) line(ctx, [[sd * 40, 24 + k * 6], [sd * 120, 16 + k * 18]], 3, '#f4f4f4', seed + 18 + sd + k);
      ctx.save(); ctx.translate(0, -16); mouthShape(ctx, Object.assign({ mouth: 'flat' }, f), t, seed, 48, 0.75); ctx.restore();
      if (f.blush) { ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#ff6a8a'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 72, 26, 18, 10, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
      if (f.tears) for (const sd of [-1, 1]) { const k = (t * 1.2 + (sd > 0 ? 0.5 : 0)) % 1; ctx.fillStyle = '#8fd6ff'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(sd * 48, -10 + k * 60, 7, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.restore(); ctx.restore(); };
    // a thought (or speech) cloud with a tail of puffs down to (px, py); W wide max 520
    const thought = (ctx, txt, px, py, u, o = {}) => { if (u <= 0) return; ctx.save(); ctx.font = '800 38px sans-serif'; const lines = []; let ln = ''; for (const w of txt.split(' ')) { const tt = ln ? ln + ' ' + w : w; if (ctx.measureText(tt).width > 480 && ln) { lines.push(ln); ln = w; } else ln = tt; } lines.push(ln);
      const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 70, h = lines.length * 48 + 50, cx = Math.min(720 - w / 2 - 18, Math.max(w / 2 + 18, (o.x != null ? o.x : px))), cy = o.y != null ? o.y : Math.max(h / 2 + 300, py - 120 - h / 2);
      ctx.translate(cx, cy); ctx.scale(u, u); ctx.lineWidth = LW; ctx.strokeStyle = INK; ctx.fillStyle = o.col || '#ffffff';
      ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 44); ctx.fill(); ctx.stroke();
      if (o.speech) { ctx.beginPath(); ctx.moveTo(-20, h / 2 - 2); ctx.lineTo(px - cx, py - cy); ctx.lineTo(20, h / 2 - 2); ctx.fill(); ctx.stroke(); ctx.fillRect(-18, h / 2 - 8, 36, 10); }
      else for (let i = 0; i < 3; i++) { const k = (i + 1) / 4, q = [(px - cx) * k, h / 2 + (py - cy - h / 2) * k]; ctx.beginPath(); ctx.arc(q[0], q[1], 16 - i * 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, 0, -((lines.length - 1) * 48) / 2 + i * 48 + 2)); ctx.restore(); };
    // a title card ("3 A.M.", "PART 2?")
    const card = (ctx, txt, x, y, u, fill = '#ffd23f', ink = INK, px = 60, rot = -0.04) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.rotate(rot); ctx.font = `900 ${px}px sans-serif`; const w = ctx.measureText(txt).width + px * 1.2;
      poly(ctx, fill, [[-w / 2, -px * 0.95], [w / 2, -px * 0.95], [w / 2, px * 0.95], [-w / 2, px * 0.95]], 520); ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
    // night: a deep blue wash over the whole frame
    const night = (ctx, W, H_, a = 0.45) => { ctx.save(); ctx.fillStyle = `rgba(14,18,60,${a})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
    // arms that move from pose to pose: keys = [[time, pose], ...]; blends over `blend` seconds
    const armsAt = (t, keys, blend = 0.2) => { let i = 0; for (let k = 0; k < keys.length; k++) if (t >= keys[k][0]) i = k; const get = (p) => (Array.isArray(p) ? p : ARMS[p]);
      const cur = get(keys[i][1]); if (i === 0) return cur; const prev = get(keys[i - 1][1]), u = H.ease.inOut(Math.min(1, (t - keys[i][0]) / blend));
      return cur.map((a, j) => a.map((v, n) => prev[j][n] + (v - prev[j][n]) * u)); };
    // warm key light from the top left + a soft vignette, over the whole frame
    const light = (ctx, W, H_, warm = 'rgba(255,214,150,0.22)') => { let g = ctx.createRadialGradient(W * 0.2, H_ * 0.15, 40, W * 0.2, H_ * 0.15, H_ * 0.9); g.addColorStop(0, warm); g.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
      g = ctx.createRadialGradient(W / 2, H_ / 2, H_ * 0.35, W / 2, H_ / 2, H_ * 0.75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,5,20,0.38)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); };
    return { person, fire, dog, cat, thought, card, night, sets, bed, blanket, sfxWord, prop, armsAt, light, CAST, BREEDS, INK, oval, blob, poly, line, curve };
  })();
