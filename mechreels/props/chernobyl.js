  // ==================== Chernobyl props (video 007 and Shorts 20-22) ====================
  // A cutaway RBMK core model (graphite stack, fuel channels with water rising and boiling, boron control rods from above,
  // neutrons, xenon), a single control rod in its channel (boron, graphite displacer, water column) that can be driven in,
  // the steam turbine and pump loop, the AZ-5 desk with its red button, the plant (reactor block, turbine hall, striped stack)
  // that can blow its lid, and the New Safe Confinement arch. Needs world.js.
  const CH_ = { graphite: [70, 72, 80], fuel: [255, 150, 60], boron: [36, 36, 40], water: [90, 160, 230], steam: [240, 244, 250], xenon: [170, 110, 230], concrete: [196, 192, 184], red: [214, 60, 50] };
  // ---------- the core model (garage) ----------
  // c = base centre; o: rods (0..1 inserted), power (0..1 glow), water (0..1 flow), boil (0..1 steam fraction), xenon (0..1),
  // neutrons (0..1), graphite (0..1 graphite blocks appear), burst (0..1 channels burst), glass (vessel), t
  const coreModel = (S, c, t, o = {}) => {
    const R = 0.62, Hc = 1.1, n = 7, cell = (2 * R) / n, P_ = (x, y, z) => add(c, [x, y, z]);
    S.cyl((q) => add(q, P_(0, 0, 0)), R + 0.08, Hc, P.glass, 20, { alpha: 0.16, gloss: 0.6, caps: false });
    S.cyl((q) => add(q, P_(0, -0.06, 0)), R + 0.1, 0.06, P.dark, 20);
    const gu = o.graphite ?? 1, pw = o.power ?? 0.5;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = -R + cell * (i + 0.5), z = -R + cell * (j + 0.5); if (x * x + z * z > R * R) continue;
      const kind = (i + j) % 3 === 0 && i % 2 === 1 ? 'rod' : 'fuel';
      if (gu > 0 && j < 4) S.box((q) => add(q, P_(x, (Hc * gu) / 2, z)), cell * 0.46, (Hc * gu) / 2, cell * 0.46, CH_.graphite, { bevel: 0.05, alpha: j >= 3 ? 0.35 : undefined });
      if (kind === 'fuel') { if (j >= 3) { S.rod(P_(x, 0, z), P_(x, Hc, z), 0.02, [255, 140 + 80 * pw, 60], 6, { glow: pw > 0.6 }); if (o.water > 0) { const b = o.boil || 0; S.beads([P_(x, 0, z + 0.035), P_(x, Hc * (1 - 0.5 * b), z + 0.035)], CH_.water, t * 0.5, { reveal: o.water, spacing: 0.05, r: 0.012 }); if (b > 0) S.beads([P_(x, Hc * (1 - 0.5 * b), z + 0.035), P_(x, Hc + 0.15, z + 0.035)], CH_.steam, t * 1.2, { reveal: o.water, spacing: 0.04, r: 0.016 }); } } }
      else { const ins = o.rods ?? 0.5, top = Hc + 0.6, bot = Hc - Hc * ins; S.box((q) => add(q, P_(x, (top + bot) / 2, z)), 0.022, (top - bot) / 2, 0.022, CH_.boron, { bevel: 0.1 }); S.box((q) => add(q, P_(x, top + 0.02, z)), 0.03, 0.02, 0.03, P.chrome, { bevel: 0.2 }); }
    }
    if (o.neutrons > 0) { const r = H.rng(Math.floor(t * 6)); for (let k = 0; k < Math.round(30 * o.neutrons * (0.5 + pw)); k++) { const a = r() * TAU, rr = r() * R, y = r() * Hc; S.dots.push({ p: P_(Math.cos(a) * rr, y, Math.sin(a) * rr + 0.05), col: P.yellow, r: 0.014 }); } }
    if (o.xenon > 0) { const r = H.rng(9); for (let k = 0; k < Math.round(40 * o.xenon); k++) { const a = r() * TAU, rr = r() * R, y = r() * Hc; S.dots.push({ p: P_(Math.cos(a) * rr, y, Math.sin(a) * rr), col: CH_.xenon, r: 0.018 }); } }
    if (pw > 0.75) S.ico(P_(0, Hc / 2, 0), R * 0.7 * pw, [255, 200, 120], { sub: 1, glow: true, alpha: 0.25 * (pw - 0.5), noShadow: true });
    stand(S, [c[0], 0, c[2]], 0.8, 0.7, c[1] - 0.08);
    return { top: P_(0, Hc + 0.6, 0.3), mid: P_(0, Hc / 2, R), bot: P_(0, 0.1, R) };
  };
  // ---------- one control rod in its channel ----------
  // c = centre of the core section; vertical. ins: 0 = rod fully withdrawn (graphite displacer centred in the core, water column
  // at the bottom) .. 1 = fully in. o.fixed: the post-1986 design (no water column at the bottom). hot (0..1 red glow at the
  // bottom of the core when graphite pushes the water out)
  const rodRig = (S, c, ins, o = {}) => {
    const core = 1.4, P_ = (y) => add(c, [0, y, 0]), half = core / 2;
    // the channel (glass) and the core section of graphite around it
    S.cyl((q) => add(q, P_(-half - 0.2)), 0.08, core + 0.6, P.glass, 14, { alpha: 0.25, gloss: 0.6, caps: false });
    for (const sx of [-1, 1]) S.box((q) => add(q, add(c, [sx * 0.26, 0, 0])), 0.16, half, 0.16, CH_.graphite, { bevel: 0.05 });
    // water fills the channel wherever the rod is not
    // rod parts top -> bottom (in core units, shifted down by ins): boron absorber (long), link, graphite displacer, then water
    const shift = -core * ins * 0.95, boronTop = half + 1.3 + shift, boronBot = half + 0.05 + shift, dispTop = boronBot - 0.1, dispBot = o.fixed ? -half - 0.25 + shift * 0.2 : -half + 0.35 + shift;
    const clip = (y) => Math.max(-half - 0.2, y);
    S.cyl((q) => add(q, P_(clip(boronBot))), 0.06, Math.max(0.02, boronTop - clip(boronBot)), CH_.boron, 12, { gloss: 0.3 });
    if (dispTop > -half - 0.2) S.cyl((q) => add(q, P_(clip(dispBot))), 0.06, Math.max(0.02, dispTop - clip(dispBot)), [120, 124, 134], 12, { gloss: 0.2 });
    const wTop = Math.max(-half - 0.2, Math.min(dispBot, half + 0.4));
    if (wTop > -half - 0.19) S.cyl((q) => add(q, P_(-half - 0.2)), 0.055, wTop + half + 0.2, CH_.water, 12, { alpha: 0.7 });
    if (o.hot > 0) S.ico(P_(-half + 0.2), [0.3, 0.25, 0.3], [255, 90, 50], { sub: 1, glow: true, alpha: 0.45 * o.hot, noShadow: true });
    stand(S, [c[0], 0, c[2]], 0.5, 0.4, c[1] - half - 0.25);
    return { boron: P_(boronBot + 0.3), graphite: P_((dispTop + dispBot) / 2), water: P_(-half - 0.05), coreBot: P_(-half + 0.15), coreTop: P_(half) };
  };
  // ---------- turbine and pump loop ----------
  const turbineLoop = (S, c, t, o = {}) => {
    const sp = o.spin ?? 1, AX = (q) => rotZ(q, -Math.PI / 2), P_ = (x, y, z) => add(c, [x, y, z]);
    S.cyl((q) => add(AX(q), P_(-0.4, 0, 0)), 0.22, 0.7, P.glass, 16, { alpha: 0.3, r2: 0.3 });
    for (let k = 0; k < 4; k++) S.cyl((q) => add(rotX(AX(q), integ(() => 8 * sp, t, 1 / 10) + k), P_(-0.3 + k * 0.15, 0, 0)), 0.18 + k * 0.025, 0.02, P.steel, 10, { stripes: [150, 156, 168] });
    S.box((q) => add(q, P_(0.6, 0, 0)), 0.25, 0.2, 0.2, P.blue, { bevel: 0.15 }); S.rod(P_(0.3, 0, 0), P_(0.35, 0, 0), 0.04, P.chrome, 8);
    const pump = P_(-0.2, -0.65, 0.3); S.box((q) => add(q, pump), 0.1, 0.1, 0.1, P.red, { bevel: 0.2 });
    const loop = [P_(-0.8, 0, 0), P_(-1.1, 0, 0), P_(-1.1, -0.65, 0.3), add(pump, [-0.1, 0, 0])];
    S.tube(loop, 0.025, [70, 72, 82], 6); if (o.steam > 0) S.beads(loop.slice(0, 2).reverse(), CH_.steam, t * 0.8 * sp, { reveal: o.steam, spacing: 0.05, r: 0.018 });
    if (o.water > 0) S.beads([add(pump, [0.1, 0, 0]), P_(0.3, -0.65, 0.3), P_(0.3, -0.65, 0.8)], CH_.water, t * 0.7 * sp, { reveal: o.water, spacing: 0.06, r: 0.016 });
    stand(S, [c[0], 0, c[2]], 0.9, 0.5, c[1] - 0.22);
  };
  // ---------- the AZ-5 desk ----------
  const azDesk = (S, c, o = {}) => {
    const T = (q) => add(rotX(q, -0.35), c), pr = o.pressed || 0;
    S.box((q) => T(q), 0.8, 0.04, 0.35, [196, 200, 186], { bevel: 0.1, paint: (cc, w, h) => { cc.fillStyle = '#20242a'; for (let i = 0; i < 12; i++) { cc.beginPath(); cc.arc(w * (0.08 + (i % 6) * 0.07), h * (0.3 + Math.floor(i / 6) * 0.25), 6, 0, TAU); cc.fill(); } cc.fillStyle = '#e8e4d8'; cc.fillRect(w * 0.62, h * 0.66, w * 0.18, h * 0.16); cc.fillStyle = '#20242a'; cc.font = FONT(800, h * 0.12); cc.textAlign = 'center'; cc.fillText('АЗ-5', w * 0.71, h * 0.79); } });
    S.cyl((q) => T(add(q, [0.32, 0.04 - 0.02 * pr, -0.08])), 0.07, 0.05, CH_.red, 16, { gloss: 0.5, glow: (o.glow || 0) > 0.5 });
    S.box((q) => T(add(q, [0, -0.25, 0.1])), 0.8, 0.22, 0.25, [170, 176, 160], { bevel: 0.05 });
    stand(S, [c[0], 0, c[2]], 0.8, 0.4, c[1] - 0.5);
    return { button: T([0.32, 0.08, -0.08]) };
  };
  // ---------- the plant ----------
  // c = ground centre. o: lid (0..1 the lid flies up through the roof), smoke (0..1), roof (false = blown), night (lit windows)
  const plant = (S, c, t, o = {}) => {
    const P_ = (x, y, z) => add(c, [x, y, z]), win = (cc, w, h) => { cc.fillStyle = o.night ? 'rgba(255,220,140,0.9)' : 'rgba(60,64,80,0.5)'; for (let x = 8; x < w - 8; x += 16) for (let y = 10; y < h - 6; y += 22) cc.fillRect(x, y, 6, 8); };
    S.quad([[-80, 0, -80], [80, 0, -80], [80, 0, 80], [-80, 0, 80]], o.night ? [40, 50, 44] : P.grass, { bg: true });
    S.box((q) => add(q, P_(-3.2, 0.7, 0)), 3.0, 0.7, 0.9, CH_.concrete, { bevel: 0.02, paint: win, sidePaint: win });
    S.box((q) => add(q, P_(0.6, 1.25, 0)), 0.9, 1.25, 0.9, CH_.concrete, { bevel: 0.02, paint: win });
    if (o.roof !== false) S.box((q) => add(q, P_(0.6, 2.55, 0)), 0.92, 0.05, 0.92, [150, 146, 140], { bevel: 0.1 });
    for (let i = 0; i < 6; i++) S.cyl((q) => add(q, P_(2.0, 2.5 + i * 0.5, -0.5)), 0.22 - i * 0.015, 0.5, i % 2 ? [236, 236, 232] : CH_.red, 10, { caps: i === 5 });
    S.box((q) => add(q, P_(2.0, 1.2, -0.5)), 0.5, 1.2, 0.5, CH_.concrete, { bevel: 0.05 });
    const lu = o.lid || 0; if (lu > 0) { S.cyl((q) => add(rotX(rotZ(q, 0.9 * lu), 0.4 * lu), P_(0.6 + 0.3 * lu, 2.6 + 3.2 * Math.sin(Math.PI * 0.5 * Math.min(1, lu)), 0.2 * lu)), 0.75, 0.25, [90, 90, 96], 16); const r = H.rng(3); for (let k = 0; k < 14; k++) S.ico(P_(0.6 + r.range(-2, 2) * lu, 2.6 + r.range(0, 3) * lu, r.range(-1.5, 1.5) * lu), 0.06 + r() * 0.08, k % 3 ? CH_.graphite : [255, 140, 60], { sub: 0, glow: k % 3 === 0, noShadow: true }); }
    return { core: P_(0.6, 2.6, 0.9), stack: P_(2.0, 5.4, -0.5) };
  };
  // the New Safe Confinement: a steel arch (half-cylinder of panels along x) slid over the reactor by u
  const nscArch = (S, c, u = 1) => { const n = 12, L = 3.2, R = 3.0, off = (1 - u) * 6; for (let i = 0; i < n; i++) { const a0 = (i / n) * Math.PI, a1 = ((i + 1) / n) * Math.PI; const p = (a, x) => add(c, [x + off, Math.sin(a) * R, Math.cos(a) * R]); S.face([p(a0, -L / 2), p(a1, -L / 2), p(a1, L / 2), p(a0, L / 2)], i % 2 ? [200, 206, 214] : [186, 192, 202], { c: add(c, [off, 0, 0]), two: true, gloss: 0.4 }); } for (const sx of [-1, 1]) for (let i = 0; i < n; i++) { const a0 = (i / n) * Math.PI, a1 = ((i + 1) / n) * Math.PI; S.face([add(c, [sx * L / 2 + off, 0, 0]), add(c, [sx * L / 2 + off, Math.sin(a0) * R, Math.cos(a0) * R]), add(c, [sx * L / 2 + off, Math.sin(a1) * R, Math.cos(a1) * R])], [170, 176, 186], { c: add(c, [off, 1, 0]), two: true, alpha: 0.55 }); } };
