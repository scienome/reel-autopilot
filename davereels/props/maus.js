  // ==================== Maus reel props: the 188-tonne tank, a small bridge, a river, a kid on a bicycle ====================
  // Units: metres (Dave is 1.8 m). The tank points along +x. Plain grey, no markings of any kind.
  const MS = { grey: [134, 138, 142], dark: [92, 96, 102], track: [44, 44, 50], wheel: [70, 72, 78], water: [74, 136, 176], bed: [150, 124, 92], sign: [246, 244, 238] };
  const extrudeXY = (S, T, prof, z0, z1, col, o = {}) => {
    const A = prof.map(([x, y]) => T([x, y, z0])), B = prof.map(([x, y]) => T([x, y, z1])), C = T([prof.reduce((s, p) => s + p[0], 0) / prof.length, prof.reduce((s, p) => s + p[1], 0) / prof.length, (z0 + z1) / 2]);
    S.face(A.slice().reverse(), col, { ...o, c: C }); S.face(B, col, { ...o, c: C });
    for (let i = 0; i < prof.length; i++) { const j = (i + 1) % prof.length; S.face([A[i], A[j], B[j], B[i]], shade(col, i % 2 ? 0.97 : 1.0), { ...o, c: C }); }
  };
  // maus(S, pos, o): o.yaw, o.pitch (nose down < 0), o.roll, o.track (track-link scroll, metres), o.glass 0..1 (x-ray),
  // o.snorkel (metres of snorkel above the turret roof), o.dave (options for Dave in the hatch, or false), o.hatch (lid open)
  const maus = (S, pos, o = {}) => {
    const s = o.s ?? 1, T = (p) => add(pos, rotY(rotX(rotZ(mul(p, s), o.pitch || 0), o.roll || 0), o.yaw || 0));
    const al = o.glass ? 1 - 0.78 * o.glass : undefined, G = { alpha: al, gloss: 0.12 };
    extrudeXY(S, T, [[-4.5, 0.55], [4.5, 0.55], [4.85, 1.3], [4.0, 2.15], [-4.3, 2.15], [-4.7, 1.3]], -1.6, 1.6, MS.grey, G);
    const tr = o.track || 0;
    for (const sd of [-1, 1]) {
      const TS = (p) => T(add(sd > 0 ? p : rotY(p, Math.PI), [0, 0, sd * 1.75]));
      S.box((p) => TS(add(p, [0, 0.7, 0])), 4.7, 0.62, 0.17, MS.track, { ...G, bevel: 0.25, paint: (c, w, h) => { c.fillStyle = '#5a5a62'; const n = 46, off = (((sd > 0 ? -tr : tr) / 9.4) * w) % (w / n); for (let i = -1; i <= n; i++) c.fillRect(i * (w / n) + off, 0, w / n * 0.35, h); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(0, h * 0.25, w, h * 0.5); } });
      S.box((p) => TS(add(p, [0, 1.55, 0.02])), 4.55, 0.32, 0.12, MS.grey, { ...G, bevel: 0.2 });
    }
    // turret (set well back), mantlet, the long gun and the small one beside it
    extrudeXY(S, T, [[-3.4, 2.15], [0.3, 2.15], [0.55, 2.7], [0.2, 3.45], [-3.1, 3.45], [-3.5, 2.8]], -1.45, 1.45, MS.grey, G);
    S.box((p) => T(add(p, [0.6, 2.85, 0])), 0.32, 0.45, 0.7, MS.dark, { ...G, bevel: 0.3 });
    S.rod(T([0.85, 2.88, 0.18]), T([7.2, 2.88, 0.18]), 0.13 * s, MS.grey, 12, G);
    S.rod(T([6.9, 2.88, 0.18]), T([7.3, 2.88, 0.18]), 0.17 * s, MS.dark, 12, G);
    S.rod(T([0.85, 2.8, -0.38]), T([3.0, 2.8, -0.38]), 0.06 * s, MS.dark, 8, G);
    // hatch ring + open lid (Dave stands in it)
    S.cyl((p) => T(add(p, [-1.9, 3.45, 0.55])), 0.42, 0.08, MS.dark, 14, G);
    if (o.hatch !== false) S.box((p) => T(add(rotZ(p, 1.2), [-2.4, 3.75, 0.55])), 0.05, 0.38, 0.38, MS.grey, { ...G, bevel: 0.2 }); else S.cyl((p) => T(add(p, [-1.9, 3.53, 0.55])), 0.4, 0.05, MS.grey, 14, G);
    if (o.snorkel) { S.rod(T([-2.6, 3.45, -0.7]), T([-2.6, 3.45 + o.snorkel, -0.7]), 0.2 * s, MS.dark, 12, G); S.cyl((p) => T(add(p, [-2.6, 3.45 + o.snorkel, -0.7])), 0.3, 0.25, MS.grey, 12, G); }
    if (o.dave) dave(S, T([-1.9, 3.45 - 1.05, 0.55]), { half: true, yaw: (o.yaw || 0) + Math.PI / 2 + (o.dave.turn || 0), s, ...o.dave });
    return T;
  };
  // the weight sign at a bridge: white disc, red ring, "60 t"
  const weightSign = (S, pos, txt, yaw = 0) => {
    S.rod(pos, add(pos, [0, 2.2, 0]), 0.05, [120, 124, 132], 8);
    S.box((p) => add(add(pos, [0, 2.6, 0]), rotY(p, yaw)), 0.5, 0.5, 0.03, MS.sign, { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.46, 0, TAU); c.fill(); c.strokeStyle = '#d8382e'; c.lineWidth = w * 0.09; c.beginPath(); c.arc(w / 2, h / 2, w * 0.4, 0, TAU); c.stroke(); c.fillStyle = '#1c1c22'; c.font = `800 ${w * 0.26}px "Montserrat"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h / 2 + 4); } });
  };
  // a river valley along z with a bridge along x: banks at y = 0 beyond |x| > 7, water at y = -2.4
  // o.sag: the two deck halves bend down at the middle (radians); o.fall: 0..1 they swing down after the snap
  const riverSet = (S, o = {}) => {
    S.quad([[-7, -2.4, -80], [7, -2.4, -80], [7, -2.4, 40], [-7, -2.4, 40]], MS.water, { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.25)'; c.lineWidth = 3; for (let i = 0; i < 40; i++) { const y = (i / 40) * h + ((o.t || 0) * 30) % (h / 40); c.beginPath(); c.moveTo(w * 0.2 + (i % 3) * 60, y); c.lineTo(w * 0.35 + (i % 3) * 60, y); c.stroke(); } } });
    for (const sx of [-1, 1]) S.quad([[sx * 7, -2.4, -80], [sx * 7, 0, -80], [sx * 7, 0, 40], [sx * 7, -2.4, 40]], [138, 112, 82], { bg: true });
    S.quad([[-80, 0, -80], [-7, 0, -80], [-7, 0, 40], [-80, 0, 40]], P.grass, { bg: true });
    S.quad([[7, 0, -80], [80, 0, -80], [80, 0, 40], [7, 0, 40]], P.grass, { bg: true });
    const hr = H.rng(9); for (let i = 0; i < 6; i++) S.ico([-40 + i * 16 + hr.range(-3, 3), -3, -60 - hr.range(0, 10)], [12 + hr.range(0, 5), 8 + hr.range(0, 3), 9], i % 2 ? [92, 140, 74] : [80, 128, 66], { sub: 0, jit: 0.15, seed: i, noShadow: true });
    const tr = H.rng(21); for (let i = 0; i < 18; i++) { const x = (i < 9 ? -1 : 1) * (9 + tr.range(0, 18)); tree(S, x, -12 - tr.range(0, 14), 2.6 + tr.range(0, 1.2), i); }
    // the bridge: two deck halves hinged at the banks, low railings, a pier stub at each bank
    const sag = o.sag || 0, fall = o.fall || 0;
    for (const sx of [-1, 1]) {
      const ang = sag + fall * 1.15, Tb = (p) => add([sx * 7, 0, 0], rotZ([p[0] * sx, p[1], p[2]], sx * ang));
      S.box((p) => Tb(add(p, [-3.5, -0.3, 0])), 3.5, 0.3, 2.8, [176, 170, 160], { bevel: 0.05 });
      for (const sz of [-1, 1]) { S.rod(Tb([-0.1, 0, sz * 2.7]), Tb([-6.95, 0, sz * 2.7]), 0.05, [120, 110, 100], 6); S.rod(Tb([-0.1, 0.7, sz * 2.7]), Tb([-6.95, 0.7, sz * 2.7]), 0.05, [120, 110, 100], 6); for (let k = 0; k <= 5; k++) S.rod(Tb([-0.1 - k * 1.37, 0, sz * 2.7]), Tb([-0.1 - k * 1.37, 0.7, sz * 2.7]), 0.04, [120, 110, 100], 6); }
      S.box((p) => add(p, [sx * 7.4, -1.2, 0]), 0.4, 1.2, 3.0, [160, 152, 140], { bevel: 0.05 });
    }
  };
  // a splash: droplets thrown up and out, a white ring, at c, progress u (0..1 over ~1.2 s)
  const splash = (S, c, u, size = 1) => {
    if (u <= 0 || u >= 1) return; const r = H.rng(5);
    for (let i = 0; i < 26; i++) { const a = r() * TAU, sp = (2 + r() * 4) * size, up = (5 + r() * 7) * size, tt = u * 1.4; const p = [c[0] + Math.cos(a) * sp * tt, c[1] + up * tt - 9.8 * tt * tt, c[2] + Math.sin(a) * sp * tt]; if (p[1] > c[1] - 0.2) S.ico(p, (0.18 + r() * 0.2) * size * (1 - u * 0.5), i % 3 ? [226, 240, 250] : [170, 210, 236], { sub: 0, noShadow: true }); }
    for (let i = 0; i < 18; i++) { const a = (i / 18) * TAU, rr = (1.5 + 4 * u) * size; S.ico([c[0] + Math.cos(a) * rr, c[1] + 0.1, c[2] + Math.sin(a) * rr], 0.35 * size * (1 - u), [236, 246, 252], { sub: 0, noShadow: true }); }
  };
  // a bicycle along +x (wheels spin with o.spin) and a kid riding it (a figure in a red helmet: not Dave)
  const bikeKid = (S, pos, o = {}) => {
    const T = (p) => add(pos, rotY(p, o.yaw || 0)), sp = o.spin || 0, fr = [60, 120, 210];
    for (const x of [-0.55, 0.55]) S.cyl((p) => T(add(rotX(rotY(p, sp), Math.PI / 2), [x, 0.36, -0.02])), 0.34, 0.04, [36, 36, 40], 16, { cap: [200, 204, 212], capPaint: (c, w, h) => { c.strokeStyle = '#3a3a40'; c.lineWidth = w * 0.025; for (let k = 0; k < 8; k++) { const a = sp + (k / 8) * TAU; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + Math.cos(a) * w * 0.45, h / 2 + Math.sin(a) * h * 0.45); c.stroke(); } } });
    S.tube([T([-0.55, 0.36, 0]), T([-0.1, 0.36, 0]), T([0.4, 0.82, 0]), T([0.55, 0.36, 0])], 0.03, fr, 8); S.rod(T([-0.1, 0.36, 0]), T([-0.2, 0.8, 0]), 0.03, fr, 8); S.rod(T([-0.2, 0.8, 0]), T([0.4, 0.82, 0]), 0.03, fr, 8);
    S.box((p) => T(add(p, [-0.22, 0.84, 0])), 0.12, 0.03, 0.06, [30, 30, 34]); S.rod(T([0.4, 0.92, -0.25]), T([0.4, 0.92, 0.25]), 0.025, [60, 60, 66], 6);
    // the bell
    S.cyl((p) => T(add(p, [0.42, 0.94, 0.18])), 0.045, 0.04, [230, 210, 120], 10, { r2: 0.03, gloss: 0.6 });
    dave(S, T([-0.22, 0.86 - 0.48 * 0.62, 0]), { s: 0.62, yaw: (o.yaw || 0) + Math.PI / 2, pose: 'drive', t: o.t, hands: [[0.2, 1.3, 0.62], [-0.2, 1.3, 0.62]], colors: { body: [240, 196, 160], joint: [70, 110, 200], hat: [220, 60, 52] }, decals: false, lean: 0.3, look: [0, 0] });
  };
