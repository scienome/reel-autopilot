  // ==================== elevator props (video 003 and Shorts 08-10) ====================
  // A cutaway elevator shaft (car, hoist ropes over a sheave to a counterweight, the governor and its rope, safety wedges
  // on the guide rails, pit buffers), Otis's 1854 platform (toothed wooden rails, wagon spring with pawls), a simple
  // figure in a top hat, a low-poly Art Deco tower, a twin-engine bomber, and a fog overlay. Needs gimli.js (slab, jetT).
  const EV = { car: [214, 92, 70], door: [200, 204, 214], rail: [80, 84, 96], rope: [70, 70, 78], wall: [222, 210, 192], wood: [168, 112, 70], stone: [214, 204, 186], olive: [104, 112, 84] };
  // ---------- the shaft ----------
  // c: the pit floor centre. o: h (shaft height), carY (car floor height above the pit), ropes (count), snap (0..1 hoist
  // ropes cut), govSpin (angle), fly (0..1 flyweights out), brake (0..1 wedges up against the rails), coil (0..1 cables
  // piled in the pit), wall (false = no back wall), floors (paint floor lines with this spacing), glassCar (0..1)
  const shaft = (S, c, o = {}) => {
    const h = o.h ?? 3.0, cy = o.carY ?? 1.2, top = h, P_ = (x, y, z) => add(c, [x, y, z]), carH = 0.6, carW = 0.25;
    if (o.wall !== false) S.quad([P_(-0.75, 0, -0.42), P_(0.8, 0, -0.42), P_(0.8, h + 0.4, -0.42), P_(-0.75, h + 0.4, -0.42)], EV.wall, {});
    // floor landings near the car (a slab line and a door frame on the back wall each floor)
    if (o.floors) { const fl = o.floors, i0 = Math.max(0, Math.floor((cy - 4) / fl)), i1 = Math.floor(Math.min(h, cy + 4) / fl); for (let i = i0; i <= i1; i++) { S.box((q) => add(q, P_(0, i * fl, -0.4)), 0.75, 0.018, 0.02, [150, 130, 116], { bevel: 0, noShadow: true }); S.box((q) => add(q, P_(-0.02, i * fl + 0.3, -0.405)), 0.2, 0.29, 0.01, [120, 100, 92], { bevel: 0, noShadow: true }); } }
    // guide rails for the car and for the counterweight
    for (const sx of [-1, 1]) S.box((q) => add(q, P_(sx * (carW + 0.06), h / 2, 0)), 0.018, h / 2, 0.03, EV.rail, { bevel: 0.1, noShadow: true });
    for (const sz of [-1, 1]) S.rod(P_(0.56, 0, sz * 0.13), P_(0.56, h, sz * 0.13), 0.012, EV.rail, 5, { noShadow: true });
    // the car: a box with sliding doors; a crosshead on top; safety wedges under the frame
    S.box((q) => add(q, P_(0, cy + carH / 2, 0)), carW, carH / 2, 0.24, EV.car, { bevel: 0.06, alpha: o.glassCar ? 1 - 0.7 * o.glassCar : undefined, paint: (cc, w, hh) => { cc.fillStyle = '#c8ccd6'; cc.fillRect(w * 0.12, hh * 0.1, w * 0.36, hh * 0.86); cc.fillRect(w * 0.52, hh * 0.1, w * 0.36, hh * 0.86); cc.fillStyle = 'rgba(0,0,0,0.25)'; cc.fillRect(w * 0.495, hh * 0.1, w * 0.01, hh * 0.86); } });
    S.box((q) => add(q, P_(0, cy + carH + 0.03, 0)), carW + 0.04, 0.025, 0.06, P.dark, { bevel: 0.2 });
    const br = o.brake || 0;
    for (const sx of [-1, 1]) S.box((q) => add(q, P_(sx * (carW + 0.03), cy - 0.02 + 0.03 * br, 0)), 0.03, 0.035, 0.04, P.orange, { bevel: 0.2, glow: br > 0.5 });
    S.box((q) => add(q, P_(0, cy - 0.03, 0)), carW + 0.02, 0.02, 0.06, P.dark, { bevel: 0.2 });
    // machine on top: the sheave (drive wheel) and motor; the hoist ropes; the counterweight
    const sx0 = 0.28, sr = 0.28, sy = top - 0.05, n = o.ropes ?? 4;
    S.cyl((q) => add(rotX(q, Math.PI / 2), P_(sx0, sy, -0.08)), sr, 0.16, P.steel, 20, { cap: [150, 156, 168] });
    S.box((q) => add(q, P_(sx0, sy + 0.05, -0.28)), 0.16, 0.12, 0.1, P.blue, { bevel: 0.15 });
    S.box((q) => add(q, P_(0.15, top + 0.3, 0)), 0.75, 0.04, 0.32, P.dark, { bevel: 0.1 });
    const cwY = Math.max(0.05, h - 0.75 - (cy - 0.0) * 0.85);
    S.box((q) => add(q, P_(0.56, cwY + 0.2, 0)), 0.07, 0.2, 0.11, [120, 124, 136], { bevel: 0.15 });
    for (let i = 0; i < n; i++) {
      const z = -0.07 + (n > 1 ? (0.14 * i) / (n - 1) : 0.07);
      const snap = o.snap > 0 ? o.snap : i === 0 ? o.cut1 || 0 : 0;
      if (snap <= 0) { S.rod(P_(0, cy + carH + 0.05, z), P_(0, sy, z), 0.008, EV.rope, 4, { noShadow: true }); S.rod(P_(0.56, cwY + 0.4, z), P_(0.56, sy, z), 0.008, EV.rope, 4, { noShadow: true }); }
      else { const stub = 0.12 + 0.2 * (1 - snap); S.rod(P_(0, cy + carH + 0.05, z), P_(0.02 * i, cy + carH + 0.05 + stub, z), 0.008, EV.rope, 4, { noShadow: true }); S.rod(P_(0, sy - 0.3 - (1 - snap) * (sy - 0.3 - cy - carH - 0.4), z), P_(0, sy, z), 0.008, EV.rope, 4, { noShadow: true }); }
    }
    // the governor: a small wheel at the top left, its rope loop down to a tension pulley; the car grips one side
    const gx = -0.48, gr = 0.09, gy = top - 0.1;
    if (o.gov !== false) {
      const gs = o.govSpin || 0, fly = o.fly || 0, GT = (q) => add(rotZ(q, gs), P_(gx, gy, 0));
      S.cyl((q) => add(rotX(q, Math.PI / 2), P_(gx, gy, -0.02)), gr, 0.04, [200, 70, 60], 16, { cap: [220, 90, 70] });
      for (const s of [-1, 1]) S.box((q) => GT(add(rotZ(q, s * 0.9 * fly), [s * (0.03 + 0.03 * fly), 0, 0.03])), 0.035, 0.012, 0.01, P.yellow, { bevel: 0.2, noShadow: true });
      S.cyl((q) => add(rotX(q, Math.PI / 2), P_(gx, 0.12, -0.02)), 0.06, 0.04, P.dark, 12);
      S.rod(P_(gx - gr, gy, 0), P_(gx - 0.06, 0.12, 0), 0.006, [230, 200, 80], 4, { noShadow: true }); S.rod(P_(gx + gr, gy, 0), P_(gx + 0.06, 0.12, 0), 0.006, [230, 200, 80], 4, { noShadow: true });
      S.rod(P_(-carW, cy + 0.05, 0), P_(gx + 0.075, cy + 0.08 + 0.05 * br, 0), 0.01, P.dark, 4); // the safety lever arm
    }
    // pit buffers (springs) under the car and the counterweight
    for (const bx of [0, 0.56]) for (let k = 0; k < 4; k++) S.cyl((q) => add(q, P_(bx, 0.02 + k * 0.045, 0)), 0.06, 0.02, [200, 180, 60], 10, { caps: k === 3 });
    if (o.coil > 0) { const pts = []; const turns = 6 * o.coil; for (let i = 0; i <= 48 * o.coil; i++) { const a = (i / 8) * TAU * 0.5, yy = 0.03 + (i / 48) * 0.3; pts.push(P_(Math.cos(a) * 0.16, yy, Math.sin(a) * 0.14)); } void turns; if (pts.length > 1) S.tube(pts, 0.012, EV.rope, 4, { noShadow: true }); }
    return { car: P_(0, cy + carH / 2, 0), carTop: P_(0, cy + carH, 0), carBot: P_(0, cy, 0), gov: P_(gx, gy, 0.05), wedge: P_(carW + 0.03, cy, 0.05), sheave: P_(sx0, sy, 0.05), cw: P_(0.56, cwY + 0.2, 0.1), pit: P_(0, 0.1, 0.1) };
  };
  // a dark real-scale shaft setting (no garage): side walls + bg
  const shaftEnv = (ctx, W, H_) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#3a3036'); g.addColorStop(1, '#241e24'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); };

  // ---------- Otis's safety platform ----------
  // c: ground centre. o: platY (platform height), flat (0 = spring bent .. 1 = sprung flat, pawls in the teeth), cut (0..1 the
  // rope above recoils), plain (no spring: an old hoist), load ('man' | 'crates'), hi (0..1 highlights the teeth)
  const otisRig = (S, c, o = {}) => {
    const H2 = o.height ?? 2.6, py = o.platY ?? 1.2, P_ = (x, y, z) => add(c, [x, y, z]), fl = o.flat || 0;
    for (const sx of [-1, 1]) { S.box((q) => add(q, P_(sx * 0.42, H2 / 2, 0)), 0.05, H2 / 2, 0.06, EV.wood, { bevel: 0.15 }); if (!o.plain) for (let i = 0; i < 22; i++) S.box((q) => add(q, P_(sx * 0.365, 0.2 + i * (H2 - 0.3) / 22, 0)), 0.012, 0.03, 0.04, o.hi ? [255, 200, 80] : P.dark, { bevel: 0, noShadow: true, glow: (o.hi || 0) > 0.5 }); }
    S.box((q) => add(q, P_(0, H2 + 0.05, 0)), 0.55, 0.05, 0.08, EV.wood, { bevel: 0.15 });
    S.cyl((q) => add(rotX(q, Math.PI / 2), P_(0, H2 + 0.16, -0.04)), 0.08, 0.08, P.steel, 14);
    // the platform and its frame
    S.box((q) => add(q, P_(0, py, 0)), 0.33, 0.03, 0.3, EV.wood, { bevel: 0.15 });
    for (const sx of [-1, 1]) S.rod(P_(sx * 0.3, py, 0), P_(sx * 0.3, py + 0.6, 0), 0.015, P.dark, 6);
    S.rod(P_(-0.3, py + 0.6, 0), P_(0.3, py + 0.6, 0), 0.015, P.dark, 6);
    // the wagon spring: an arc of steel; flat pushes its ends (pawls) out into the teeth
    let ropeLow = P_(0, py + 0.6, 0);
    if (!o.plain) { const ex = 0.27 + 0.07 * fl, mid = 0.13 * (1 - fl), pts = []; for (let i = 0; i <= 6; i++) { const u = i / 6 - 0.5; pts.push(P_(u * 2 * ex, py + 0.66 + mid * (1 - 4 * u * u), 0)); } S.tube(pts, 0.018, P.chrome, 6); for (const sx of [-1, 1]) S.box((q) => add(q, P_(sx * (ex + 0.02), py + 0.66, 0)), 0.03, 0.015, 0.03, P.red, { bevel: 0.2 }); ropeLow = P_(0, py + 0.66 + mid, 0); }
    // the rope up over the pulley and down the side; cut makes the upper part spring away
    const cut = o.cut || 0, top = P_(0, H2 + 0.08, 0);
    if (cut <= 0) S.rod(ropeLow, top, 0.01, [200, 180, 140], 4, { noShadow: true });
    else { S.rod(ropeLow, add(ropeLow, [0.04, 0.12, 0]), 0.01, [200, 180, 140], 4, { noShadow: true }); S.rod(add(top, [0, -0.25 - (1 - cut) * (H2 - py - 1.0), 0]), top, 0.01, [200, 180, 140], 4, { noShadow: true }); }
    S.rod(P_(0.08, H2 + 0.16, 0), P_(0.6, 0.3, 0.1), 0.01, [200, 180, 140], 4, { noShadow: true }); S.cyl((q) => add(rotX(q, Math.PI / 2), P_(0.62, 0.25, 0.04)), 0.07, 0.12, EV.wood, 10);
    if (o.load === 'man') figure(S, P_(0.05, py + 0.03, 0.05), { hat: true, s: 0.7, arm: o.arm || 0 });
    else if (o.load === 'crates') { S.box((q) => add(q, P_(-0.1, py + 0.12, 0)), 0.1, 0.09, 0.1, P.cork, { bevel: 0.1 }); S.box((q) => add(q, P_(0.12, py + 0.1, 0.05)), 0.08, 0.07, 0.08, [176, 120, 80], { bevel: 0.1 }); }
    return { plat: P_(0, py, 0.3), spring: P_(0.3, py + 0.66, 0.05), rope: P_(0, (py + 0.66 + H2) / 2, 0.05), teeth: P_(0.37, py + 0.6, 0.05) };
  };
  // a simple low-poly person; o: s (scale), hat (top hat), coat colour, arm (0..1 raises the right arm)
  const figure = (S, p, o = {}) => {
    const s = o.s ?? 1, Q = (x, y, z) => add(p, [x * s, y * s, z * s]), coat = o.coat || [50, 52, 64];
    for (const sx of [-1, 1]) S.rod(Q(sx * 0.05, 0, 0), Q(sx * 0.05, 0.42, 0), 0.04 * s, [40, 40, 48], 6);
    S.cyl((q) => add(mul(q, s), Q(0, 0.4, 0)), 0.11, 0.42, coat, 8, { r2: 0.09 });
    S.ico(Q(0, 0.92, 0), 0.085 * s, o.skin || [236, 190, 160], { sub: 1 });
    if (o.hat) { S.cyl((q) => add(mul(q, s), Q(0, 0.98, 0)), 0.1, 0.012, [26, 26, 30], 10); S.cyl((q) => add(mul(q, s), Q(0, 0.99, 0)), 0.065, 0.14, [26, 26, 30], 10); }
    S.rod(Q(-0.12, 0.78, 0), Q(-0.15, 0.48, 0.03), 0.03 * s, coat, 5); const ar = o.arm || 0; S.rod(Q(0.12, 0.78, 0), Q(0.15 + 0.08 * ar, 0.48 + 0.55 * ar, 0.03), 0.03 * s, coat, 5);
  };
  const crowd = (S, cx, cz, n, seed = 3, spread = 1.4) => { const r = H.rng(seed), cols = [[60, 64, 90], [110, 60, 60], [70, 90, 70], [90, 80, 60], [40, 40, 50]]; for (let i = 0; i < n; i++) figure(S, [cx + r.range(-spread, spread), 0, cz + r.range(0, spread * 0.8)], { s: 0.6 + r() * 0.1, hat: r() < 0.5, coat: cols[i % cols.length] }); };

  // ---------- the city ----------
  const towerPaint = (cols, rows) => (cc, w, h) => { cc.fillStyle = 'rgba(60,64,80,0.55)'; for (let i = 0; i < cols; i++) cc.fillRect(((i + 0.3) * w) / cols, 0, (0.35 * w) / cols, h); cc.fillStyle = 'rgba(255,255,255,0.08)'; for (let j = 0; j < rows; j++) cc.fillRect(0, (j * h) / rows, w, 1.5); };
  // an Art Deco tower with setbacks and a mast (the base at c, about 10 units tall)
  const tower = (S, c, o = {}) => {
    const T = (x, y, z) => add(c, [x, y, z]), col = o.col || EV.stone, sp = towerPaint(10, 30);
    S.box((q) => add(q, T(0, 0.6, 0)), 1.4, 0.6, 1.0, col, { bevel: 0.02, paint: towerPaint(14, 6), sidePaint: towerPaint(10, 6) });
    S.box((q) => add(q, T(0, 1.2 + 3.2, 0)), 0.85, 3.2, 0.62, col, { bevel: 0.02, paint: sp, sidePaint: sp });
    S.box((q) => add(q, T(0, 7.6 + 0.9, 0)), 0.62, 0.9, 0.45, col, { bevel: 0.02, paint: towerPaint(8, 8), sidePaint: towerPaint(6, 8) });
    S.box((q) => add(q, T(0, 9.4 + 0.3, 0)), 0.36, 0.3, 0.28, col, { bevel: 0.04 });
    S.cyl((q) => add(q, T(0, 10.0, 0)), 0.14, 0.7, [190, 196, 206], 10, { r2: 0.09 }); S.cyl((q) => add(q, T(0, 10.7, 0)), 0.06, 1.0, [190, 196, 206], 8, { r2: 0.01 });
    return { f79: T(0, 7.9, 0.46), top: T(0, 11.5, 0), shaft: T(0.2, 5, 0.63) };
  };
  const cityBlocks = (S, seed = 4, grow = 1, avoid = null) => { const r = H.rng(seed); for (let i = 0; i < 26; i++) { const x = r.range(-16, 16), z = r.range(-18, -2), hh = r.range(0.8, 4.5) * grow; if (avoid && Math.abs(x - avoid[0]) < 2.2 && Math.abs(z - avoid[1]) < 2.2) continue; if (hh < 0.05) continue; const w = r.range(0.4, 1.0); S.box((q) => add(q, [x, hh, z]), w, hh, w * 0.8, [r.range(170, 215), r.range(160, 200), r.range(150, 190)], { bevel: 0.02, paint: towerPaint(5, 10), sidePaint: towerPaint(4, 10) }); } };
  const fog = (ctx, W, H_, a = 0.45) => { ctx.save(); const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, `rgba(222,224,230,${a})`); g.addColorStop(1, `rgba(200,204,212,${a * 0.6})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const fogSky = (ctx, W, H_) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#a8acb8'); g.addColorStop(1, '#cfd0d6'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); };
  // a twin-engine WWII bomber (olive drab, no markings) along +x; o as jetT plus prop (angle)
  const bomber = (S, P0, o = {}) => {
    const T = jetT(P0, o), AXL = (q) => rotZ(q, -Math.PI / 2);
    S.cyl((q) => T(add(AXL(q), [-0.9, 0, 0])), 0.1, 1.6, EV.olive, 10);
    S.cyl((q) => T(add(AXL(q), [0.7, 0, 0])), 0.1, 0.2, [150, 170, 190], 10, { r2: 0.05, alpha: 0.7 });
    S.cyl((q) => T(add(rotZ(q, Math.PI / 2), [-0.9, 0, 0])), 0.1, 0.25, EV.olive, 10, { r2: 0.04 });
    for (const sd of [-1, 1]) {
      slab(S, T, [0.3, 0.07, sd * 0.08], [0.0, 0.07, sd * 0.08], [-0.08, 0.06, sd * 1.0], [0.12, 0.06, sd * 1.0], [0.025, 0.01], [0.015, 0.006], EV.olive);
      S.cyl((q) => T(add(AXL(q), [-0.05, 0.03, sd * 0.33])), 0.06, 0.42, EV.olive, 10, { r2: 0.05 });
      for (const k of [0, 1, 2]) S.box((q) => T(add(rotX(add(q, [0, 0.11, 0]), (o.prop || 0) + (k * TAU) / 3), [0.39, 0.03, sd * 0.33])), 0.006, 0.11, 0.015, [40, 40, 46], { bevel: 0, noShadow: true });
      slab(S, T, [-0.82, 0.05, sd * 0.06], [-1.02, 0.05, sd * 0.06], [-1.06, 0.06, sd * 0.42], [-0.9, 0.06, sd * 0.42], [0.01, 0.005], [0.008, 0.004], EV.olive);
      S.box((q) => T(add(q, [-0.98, 0.14, sd * 0.42])), 0.07, 0.11, 0.008, EV.olive, { bevel: 0.2 });
    }
    return { nose: T([0.9, 0, 0]) };
  };
