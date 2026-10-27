  // ==================== Gimli Glider props (shared by the 16:9 video and the 9:16 Shorts) ====================
  // A low-poly Boeing 767 (generic white/red livery, no logos), sky + clouds, the Gimli runway with a car race, and garage
  // explainers: fuel tank + dipstick, balance scale (kg vs lb), turbofan cutaway, ram air turbine + control surface,
  // instrument panel. All units: 1 = 10 m on the jet (fuselage ~4.9 long, span ~4.8).
  const GL = { body: [238, 238, 242], belly: [206, 210, 218], red: [212, 54, 50], wing: [214, 218, 226], dark: [44, 48, 58], win: [36, 44, 62] };
  // local -> world for the jet: scale, roll (x), pitch (z), yaw (y), then translate
  const jetT = (P0, o = {}) => { const s = o.s ?? 1; return (p) => add(rotY(rotZ(rotX(mul(p, s), o.roll || 0), o.pitch || 0), o.yaw || 0), P0); };
  const slab = (S, T, A, B2, C2, D, thTop, thBot, col, o = {}) => { // a thin wing-like panel from 4 corner points (root LE, root TE, tip TE, tip LE)
    const up = (p, h) => [p[0], p[1] + h, p[2]];
    const ta = [A, B2, C2, D].map((p, i) => up(p, i < 2 ? thTop[0] : thTop[1])), ba = [A, B2, C2, D].map((p, i) => up(p, i < 2 ? -thBot[0] : -thBot[1]));
    const tw = ta.map(T), bw = ba.map(T), cc = T(mul(add(add(A, B2), add(C2, D)), 0.25));
    S.face(tw, col, { ...o, c: cc }); S.face(bw.slice().reverse(), shade(col, 0.92), { ...o, c: cc });
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; S.face([tw[i], tw[j], bw[j], bw[i]], shade(col, 0.95), { ...o, c: cc }); }
  };
  const jet767 = (S, P0, o = {}) => {
    const T = jetT(P0, o), al = o.glass ? 1 - 0.8 * o.glass : undefined, G = { alpha: al };
    const AXL = (q) => rotZ(q, -Math.PI / 2), AXR = (q) => rotZ(q, Math.PI / 2);
    // fuselage, nose, upswept tail cone
    S.cyl((q) => T(add(AXL(q), [-1.9, 0, 0])), 0.25, 3.8, o.col || GL.body, 14, { ...G, gloss: 0.25, caps: false });
    S.cyl((q) => T(add(AXL(q), [1.9, 0, 0])), 0.25, 0.5, o.col || GL.body, 14, { ...G, r2: 0.06, gloss: 0.25 });
    S.cyl((q) => T(add(add(AXR(q), [-1.9, 0, 0]), [0, q[1] * 0.2, 0])), 0.25, 0.62, o.col || GL.body, 14, { ...G, r2: 0.05, gloss: 0.2 });
    // cheatline + window rows (flat strips just outside the hull), cockpit windows
    for (const sd of [-1, 1]) {
      S.box((q) => T(add(sd > 0 ? q : rotY(q, Math.PI), [0.1, 0.07, sd * 0.247])), 1.75, 0.022, 0.004, GL.win, { bevel: 0, noShadow: true, alpha: al, paint: (c, w, h) => { c.fillStyle = '#e8ecf2'; c.fillRect(0, 0, w, h); c.fillStyle = '#26324a'; for (let x = 6; x < w - 6; x += 13) c.fillRect(x, h * 0.18, 7, h * 0.64); } });
      S.box((q) => T(add(sd > 0 ? q : rotY(q, Math.PI), [0.15, -0.03, sd * 0.25])), 1.95, 0.014, 0.004, GL.red, { bevel: 0, noShadow: true, alpha: al });
    }
    S.box((q) => T(add(rotZ(q, -0.5), [2.1, 0.12, 0])), 0.09, 0.03, 0.15, GL.win, { bevel: 0.2, noShadow: true, gloss: 0.6 });
    // wings (swept, dihedral) and horizontal stabilisers
    for (const sd of [-1, 1]) {
      slab(S, T, [0.62, -0.14, sd * 0.2], [-0.38, -0.14, sd * 0.2], [-0.86, -0.0, sd * 2.4], [-0.62, -0.0, sd * 2.4], [0.035, 0.012], [0.02, 0.008], GL.wing, { gloss: 0.2, alpha: al });
      slab(S, T, [-1.95, 0.12, sd * 0.07], [-2.45, 0.15, sd * 0.07], [-2.64, 0.21, sd * 0.95], [-2.4, 0.21, sd * 0.95], [0.018, 0.008], [0.012, 0.006], GL.wing, { alpha: al });
      // engine nacelle under the wing, pylon, fan face (spins with o.fan)
      const ez = sd * 0.82, ey = -0.33;
      S.cyl((q) => T(add(AXL(q), [0.1, ey, ez])), 0.145, 0.66, GL.belly, 14, { r2: 0.13, gloss: 0.3, cap: [60, 62, 70], capPaint: (c, w, h) => { const f = o.fan || 0; c.fillStyle = '#3a3d46'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.47, 0, TAU); c.fill(); c.strokeStyle = '#9aa0ac'; c.lineWidth = w * 0.035; for (let k = 0; k < 14; k++) { const a = f + (k / 14) * TAU; c.beginPath(); c.moveTo(w / 2 + Math.cos(a) * w * 0.1, h / 2 + Math.sin(a) * h * 0.1); c.lineTo(w / 2 + Math.cos(a + 0.25) * w * 0.44, h / 2 + Math.sin(a + 0.25) * h * 0.44); c.stroke(); } c.fillStyle = '#c8ccd4'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.09, 0, TAU); c.fill(); } });
      S.box((q) => T(add(q, [0.25, -0.2, ez])), 0.2, 0.06, 0.025, GL.belly, { bevel: 0.2 });
      if (o.burn > 0.02) S.ico(T([0.06, ey, ez]), 0.09 * o.burn, [255, 150, 60], { sub: 0, glow: true, noShadow: true });
    }
    // vertical fin (red)
    { const fin = [[-1.55, 0.2], [-2.38, 0.24], [-2.62, 1.1], [-2.22, 1.1]], th = 0.025, A2 = fin.map(([x, y]) => T([x, y, -th])), B3 = fin.map(([x, y]) => T([x, y, th])), cc = T([-2.2, 0.6, 0]); S.face(A2.slice().reverse(), GL.red, { c: cc, gloss: 0.2 }); S.face(B3, GL.red, { c: cc, gloss: 0.2 }); for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; S.face([A2[i], A2[j], B3[j], B3[i]], shade(GL.red, 0.9), { c: cc }); } }
    // fuel in the wing tanks (x-ray): orange beads along each wing, o.fuel = how full
    if (o.glass && o.fuel != null) for (const sd of [-1, 1]) { const n = 7; const pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push(T([0.1 - 0.75 * u, -0.1 + 0.08 * u, sd * (0.25 + 2.0 * u)])); } S.beads(pts, P.orange, 0, { reveal: o.fuel, spacing: 0.12 * (o.s ?? 1), r: 0.035 * (o.s ?? 1) }); }
    // landing gear: main (two legs, 4 wheels each simplified to 2) and nose; g = 0 stowed .. 1 down; noseCollapse folds the nose leg back
    const g = o.gear ?? 0, ng = o.nose ?? g, nc = o.noseCollapse || 0;
    if (g > 0.02) for (const sd of [-1, 1]) { const top = [-0.05, -0.16, sd * 0.5], bot = lerp3([-0.05, -0.2, sd * 0.12], [-0.05, -0.58, sd * 0.5], g); S.rod(T(top), T(bot), 0.025 * (o.s ?? 1), [150, 154, 164], 6); for (const dx of [-0.07, 0.07]) S.cyl((q) => T(add(rotX(q, Math.PI / 2), add(bot, [dx, 0, -0.04]))), 0.07, 0.08, P.tire, 10, { cap: [120, 124, 132] }); }
    if (ng > 0.02) { const top = [1.72, -0.2, 0], ext = lerp3([1.45, -0.22, 0], [1.72, -0.55, 0], ng), bot = lerp3(ext, [1.5, -0.27, 0], nc); S.rod(T(top), T(bot), 0.022 * (o.s ?? 1), [150, 154, 164], 6); S.cyl((q) => T(add(rotX(q, Math.PI / 2), add(bot, [0, 0, -0.04]))), 0.055, 0.08, P.tire, 10, { cap: [120, 124, 132] }); }
    // ram air turbine: a strut drops from the belly, a two-blade prop spins in the wind
    if (o.rat > 0.02) { const top = [0.05, -0.22, 0.3], bot = add(top, [0.02, -0.26 * o.rat, 0.03]); S.rod(T(top), T(bot), 0.016 * (o.s ?? 1), [180, 184, 192], 6); const sp = o.ratSpin || 0; for (const k of [0, 1]) S.box((q) => T(add(rotX(add(q, [0, 0.085, 0]), sp + k * Math.PI), add(bot, [0.05, 0, 0]))), 0.01, 0.085, 0.022, P.yellow, { bevel: 0.2, noShadow: true }); S.ico(T(add(bot, [0.06, 0, 0])), 0.026 * (o.s ?? 1), [200, 204, 212], { sub: 0 }); }
    return { T, nose: T([2.4, 0, 0]), tail: T([-2.5, 0.1, 0]), engL: T([0.4, -0.33, -0.82]), engR: T([0.4, -0.33, 0.82]), ratP: T([0.08, -0.48, 0.33]), noseGear: T([1.6, -0.3, 0]), cockpit: T([2.05, 0.1, 0]) };
  };

  // ---------- sky world: clouds over a land of lakes ----------
  const clouds = (S, cx, cz, y, n, seed, spread = 30, drift = 0) => { const r = H.rng(seed); for (let i = 0; i < n; i++) { const x = cx + ((((r.range(-spread, spread) - drift) % (2 * spread)) + 3 * spread) % (2 * spread)) - spread, z = cz + r.range(-spread * 0.6, spread * 0.6), s = r.range(1.2, 3.2); for (let k = 0; k < 3; k++) S.ico([x + (k - 1) * s * 0.9, y + r.range(-0.2, 0.3), z + r.range(-0.4, 0.4)], [s, s * 0.42, s * 0.8], [252, 244, 246], { sub: 0, jit: 0.2, seed: i * 3 + k, noShadow: true, gloss: 0.05 }); } };
  const landBelow = (S, y = 0) => {
    S.quad([[-400, y, -400], [400, y, -400], [400, y, 400], [-400, y, 400]], [96, 132, 84], { bg: true });
    const r = H.rng(77); for (let i = 0; i < 26; i++) { const x = r.range(-200, 200), z = r.range(-220, -40), w = r.range(5, 18), d = r.range(3, 9); S.quad([[x - w, y + 0.01, z - d * 0.4], [x + w * 0.6, y + 0.01, z - d], [x + w, y + 0.01, z + d * 0.3], [x - w * 0.4, y + 0.01, z + d]], [120, 168, 206], { bg: true, flat: true }); }
  };

  // ---------- Gimli: the old runway with a car race on it ----------
  const raceCar = (S, x, z, yaw, col) => { const T = (p) => add(rotY(p, yaw), [x, 0, z]); S.box((p) => T(add(p, [0, 0.09, 0])), 0.26, 0.05, 0.12, col, { bevel: 0.3 }); S.box((p) => T(add(p, [-0.04, 0.16, 0])), 0.1, 0.035, 0.09, [60, 66, 80], { bevel: 0.3 }); for (const [u, w] of [[0.16, 1], [-0.16, 1]]) for (const sd of [-1, 1]) S.cyl((p) => T(add(rotX(p, Math.PI / 2), [u, 0.05, sd * 0.13 - (sd > 0 ? 0.03 : 0)])), 0.05, 0.03, P.tire, 8); };
  const tent = (S, x, z, col) => { const a = [x - 0.25, 0, z - 0.2], b = [x + 0.25, 0, z - 0.2], c = [x + 0.25, 0, z + 0.2], d = [x - 0.25, 0, z + 0.2], t1 = [x - 0.25, 0.3, z], t2 = [x + 0.25, 0.3, z], C = [x, 0.1, z]; S.face([a, b, t2, t1], col, { c: C }); S.face([d, c, t2, t1], shade(col, 0.9), { c: C }); S.face([a, d, t1], shade(col, 0.8), { c: C }); S.face([b, c, t2], shade(col, 0.8), { c: C }); };
  const gimliField = (S, o = {}) => {
    S.quad([[-200, 0, -200], [200, 0, -200], [200, 0, 200], [-200, 0, 200]], P.grass, { bg: true });
    S.quad([[-120, 0.002, -2.6], [120, 0.002, -2.6], [120, 0.002, 2.6], [-120, 0.002, 2.6]], [92, 92, 100], { bg: true, paint: (c, w, h) => { c.fillStyle = 'rgba(255,255,255,0.8)'; for (let x = 0; x < w; x += 18) c.fillRect(x, h * 0.485, 8, h * 0.03); c.fillRect(0, h * 0.04, w, h * 0.01); c.fillRect(0, h * 0.95, w, h * 0.01); } });
    // the drag-strip guardrail down the middle, from x = -6 onward
    for (let x = -6; x < 40; x += 1.2) S.box((p) => add(p, [x + 0.6, 0.12, 0]), 0.6, 0.04, 0.025, [200, 204, 212], { bevel: 0.2 });
    for (let x = -6; x < 40; x += 1.2) S.rod([x, 0, 0], [x, 0.14, 0], 0.015, [150, 154, 164], 5);
    // race cars, campers and tents near the far end; spectators' trees
    const cols = [[236, 92, 70], [70, 140, 230], [250, 200, 70], [120, 200, 120], [240, 240, 240], [180, 90, 200]];
    const r = H.rng(5); for (let i = 0; i < 9; i++) raceCar(S, 22 + i * 1.4 + r.range(-0.3, 0.3), (i % 2 ? 1.2 : -1.3) + r.range(-0.2, 0.2), r.range(-0.2, 0.2), cols[i % cols.length]);
    for (let i = 0; i < 10; i++) tent(S, 20 + i * 2.1, (i % 2 ? 4.2 : -4.4) + r.range(-0.5, 0.5), cols[(i + 2) % cols.length]);
    const tr = H.rng(11); for (let i = 0; i < 30; i++) tree(S, -30 + i * 3.2 + tr.range(-1, 1), -8 - tr.range(0, 10), 1.2 + tr.range(0, 0.8), i);
    for (let i = 0; i < 14; i++) tree(S, -10 + i * 4 + tr.range(-1, 1), 9 + tr.range(0, 8), 1.1 + tr.range(0, 0.7), i + 40);
    const hr = H.rng(9); for (let i = 0; i < 7; i++) S.ico([-60 + i * 22 + hr.range(-4, 4), -3, -60 - hr.range(0, 20)], [14 + hr.range(0, 8), 7 + hr.range(0, 4), 10], i % 2 ? [92, 140, 74] : [80, 128, 66], { sub: 0, jit: 0.15, seed: i, noShadow: true });
  };

  // ---------- garage explainers ----------
  // a glass fuel tank with fuel to `level` and a dipstick pushed in by `dip`
  const fuelTank = (S, c, level, dip = 0, o = {}) => {
    const w = 0.55, h = 0.32, d = 0.3, lv = Math.max(0.02, level);
    S.box((p) => add(p, add(c, [0, -h + lv * h, 0])), w - 0.02, lv * h, d - 0.02, o.fuelCol || P.orange, { bevel: 0.05, glow: false, gloss: 0.4 });
    S.box((p) => add(p, c), w, h, d, P.glass, { alpha: 0.25, bevel: 0.08, gloss: 0.5 });
    if (dip > 0) { const top = add(c, [0.25, h + 0.55 - 0.55 * dip, 0]); S.rod(top, add(top, [0, -0.62, 0]), 0.012, [210, 214, 222], 6); for (let k = 0; k < 6; k++) S.box((p) => add(p, add(top, [0, -0.62 + k * 0.08, 0.012])), 0.018, 0.004, 0.004, P.red, { bevel: 0, noShadow: true }); }
  };
  // a balance scale: tilt > 0 drops the left pan. blocks: [leftSize, rightSize]
  const balance = (S, c, tilt, L, R) => {
    S.cyl((p) => add(p, c), 0.18, 0.04, P.dark, 14); S.rod(add(c, [0, 0.04, 0]), add(c, [0, 0.9, 0]), 0.025, P.steel, 8);
    const piv = add(c, [0, 0.92, 0]), arm = (sd) => add(piv, [sd * 0.6 * Math.cos(tilt), -sd * 0.6 * Math.sin(tilt), 0]);
    S.rod(arm(-1), arm(1), 0.022, P.chrome, 8); S.ico(piv, 0.04, P.red, { sub: 0 });
    for (const [sd, sz] of [[-1, L], [1, R]]) { const a = arm(sd), pan = add(a, [0, -0.38, 0]); S.rod(a, pan, 0.006, P.dark, 4); S.cyl((p) => add(p, pan), 0.17, 0.02, P.steel, 14); if (sz > 0) S.box((p) => add(p, add(pan, [0, 0.02 + sz, 0])), sz, sz, sz, sd < 0 ? P.orange : [250, 200, 120], { bevel: 0.15 }); }
  };
  // a turbofan cutaway on the stand: fan (spins), glass nacelle, core, flame (burn 0..1), fuel line beads (flow 0..1)
  const turbofan = (S, c, t, o = {}) => {
    const AX = (q) => rotZ(q, -Math.PI / 2), fan = o.fan ?? t * 8, burn = o.burn ?? 1;
    S.cyl((q) => add(AX(q), add(c, [-0.55, 0, 0])), 0.36, 1.05, P.glass, 18, { alpha: 0.22, caps: false, gloss: 0.5 });
    S.cyl((q) => add(rotX(AX(q), fan), add(c, [0.38, 0, 0])), 0.33, 0.04, P.steel, 22, { stripes: [150, 156, 168], cap: [80, 84, 94], capPaint: (cc, w, h) => { cc.strokeStyle = '#c8ccd6'; cc.lineWidth = w * 0.04; for (let k = 0; k < 16; k++) { const a = (k / 16) * TAU; cc.beginPath(); cc.moveTo(w / 2, h / 2); cc.lineTo(w / 2 + Math.cos(a + 0.3) * w * 0.46, h / 2 + Math.sin(a + 0.3) * h * 0.46); cc.stroke(); } cc.fillStyle = '#d8dce4'; cc.beginPath(); cc.arc(w / 2, h / 2, w * 0.12, 0, TAU); cc.fill(); } });
    S.cyl((q) => add(AX(q), add(c, [-0.5, 0, 0])), 0.14, 0.86, P.dark, 14, { r2: 0.16 });
    S.cyl((q) => add(AX(q), add(c, [0.36, 0, 0])), 0.09, 0.14, P.chrome, 12, { r2: 0.02 }); // spinner
    if (burn > 0.02) { const r = H.rng(Math.floor(t * 20)); for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU; S.ico(add(c, [-0.15 + r.range(-0.03, 0.03), Math.cos(a) * 0.17, Math.sin(a) * 0.17]), 0.05 * burn * (0.8 + 0.4 * r()), [255, 140 + 60 * r(), 50], { sub: 0, glow: true, noShadow: true }); } }
    const line = [add(c, [-0.15, -0.85, 0.35]), add(c, [-0.15, -0.3, 0.35]), add(c, [-0.15, -0.18, 0.18])];
    S.tube(line, 0.018, [60, 60, 70], 6);
    if (o.flow > 0.02) S.beads(line, P.orange, t * 0.9, { reveal: o.flow, spacing: 0.07, r: 0.022 });
    stand(S, [c[0], 0, c[2]], 0.6, 0.45, c[1] - 0.4); S.rod([c[0], c[1] - 0.4, c[2]], [c[0], c[1] - 0.3, c[2]], 0.04, P.dark, 8);
  };
  // the ram air turbine on the stand: prop (spins), pump, hydraulic line (teal beads) to a hinged control surface (defl)
  const ratRig = (S, c, t, o = {}) => {
    const sp = o.spin ?? 0, pump = add(c, [0, 0, 0]);
    S.box((q) => add(q, pump), 0.14, 0.12, 0.12, P.blue, { bevel: 0.2 });
    S.rod(add(pump, [0.14, 0, 0]), add(pump, [0.36, 0, 0]), 0.02, P.chrome, 8); S.ico(add(pump, [0.38, 0, 0]), 0.045, [210, 214, 222], { sub: 0 });
    for (const k of [0, 1]) S.box((q) => add(rotX(add(q, [0, 0.26, 0]), sp + k * Math.PI), add(pump, [0.38, 0, 0])), 0.012, 0.26, 0.05, P.yellow, { bevel: 0.2 });
    // control surface: a wing stub with a hinged aileron
    const wc = add(c, [-0.95, 0.15, 0]);
    S.box((q) => add(q, wc), 0.35, 0.03, 0.42, GL.wing, { bevel: 0.2 });
    const df = o.defl || 0; S.box((q) => add(rotZ(add(q, [-0.12, 0, 0]), df), add(wc, [-0.35, 0, 0])), 0.12, 0.022, 0.4, GL.red, { bevel: 0.2 });
    const line = [add(pump, [-0.14, 0, 0]), add(pump, [-0.4, 0.05, 0]), add(wc, [0.1, -0.06, 0]), add(wc, [-0.3, -0.04, 0])];
    S.tube(line, 0.018, [60, 60, 70], 6);
    if (o.flow > 0.02) S.beads(line, P.teal, t * 0.8, { reveal: o.flow, spacing: 0.07, r: 0.024 });
    stand(S, [c[0] - 0.4, 0, c[2]], 0.85, 0.45, c[1] - 0.12);
  };
  // an instrument panel: three glass screens (lit 0..1) and two small standby dials
  const panel = (S, c, lit, yaw = 0) => {
    const T = (q) => add(rotY(q, yaw), c);
    S.box((q) => T(q), 0.7, 0.26, 0.05, [40, 42, 50], { bevel: 0.1 });
    for (let i = 0; i < 3; i++) S.box((q) => T(add(q, [-0.45 + i * 0.45, 0.02, 0.052])), 0.17, 0.15, 0.004, [10, 14, 22], { bevel: 0, glow: lit > 0.5, noShadow: true, paint: lit > 0.05 ? (cc, w, h) => { cc.globalAlpha = lit; const g = cc.createLinearGradient(0, 0, 0, h); g.addColorStop(0, i === 1 ? '#3a8ae0' : '#26303e'); g.addColorStop(0.5, i === 1 ? '#5aa0e8' : '#1c2430'); g.addColorStop(0.5, i === 1 ? '#a06a3a' : '#1c2430'); g.addColorStop(1, i === 1 ? '#7a4a2a' : '#141a22'); cc.fillStyle = g; cc.fillRect(0, 0, w, h); cc.strokeStyle = '#7ee07a'; cc.lineWidth = 3; cc.beginPath(); cc.moveTo(w * 0.15, h * 0.5); cc.lineTo(w * 0.85, h * 0.5); cc.stroke(); cc.strokeStyle = '#ffffff'; cc.strokeRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8); cc.globalAlpha = 1; } : null });
    for (const dx of [-0.2, 0.2]) S.cyl((q) => T(add(rotX(q, Math.PI / 2), [dx, -0.2, 0.05])), 0.06, 0.02, [30, 30, 36], 14, { cap: [236, 234, 228] });
  };

  // ---------- shared shot helpers ----------
  const SKY_Y = 8; // the jet's cruising height in the sky world
  const pin = (S, p, col, h = 1.6, r = 0.25) => { S.rod(p, add(p, [0, h, 0]), 0.05, [230, 230, 236], 6); S.ico(add(p, [0, h + r * 0.8, 0]), r, col, { sub: 1, gloss: 0.4 }); };
  const redPulse = (ctx, W, H_, u) => { if (u <= 0) return; ctx.save(); const g = ctx.createRadialGradient(W / 2, H_ / 2, H_ * 0.3, W / 2, H_ / 2, H_ * 0.9); g.addColorStop(0, 'rgba(255,40,30,0)'); g.addColorStop(1, `rgba(255,40,30,${0.45 * u})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const puffs = (ctx, x, y, u, seed, col = '235,235,240', spread = 60) => { if (u <= 0 || u >= 1) return; const r = H.rng(seed); ctx.save(); for (let i = 0; i < 10; i++) { const k = (u + r() * 0.5) % 1, px = x + r.range(-spread, spread) * k, py = y - k * 90 + r.range(-10, 10), rad = 12 + k * 40; ctx.fillStyle = `rgba(${col},${0.5 * (1 - k)})`; ctx.beginPath(); ctx.arc(px, py, rad, 0, TAU); ctx.fill(); } ctx.restore(); };
  const skyScene = (E, TG, W, H_, t, cl = 1) => { const S = Scene(E, TG, W, H_); landBelow(S); if (cl) { clouds(S, 0, -6, 4.2, 18, 3, 40, t * 2.2); clouds(S, 0, 10, 3.2, 10, 8, 40, t * 2.2); } return S; };
  const skyEnv = { bg: sunsetSky, dof: 0.33, shadows: false, dofGap: 30 };
