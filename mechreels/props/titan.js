  // ==================== Titan submersible props (video 004 and Shorts 11-13) ====================
  // The deep-sea set (dark water, sea floor, marine snow), the Titan submersible (white fairing, carbon-fibre tube, titanium
  // rings and domes, viewport, skids) with an x-ray mode and an implosion, its pressure hull alone for the garage (layers,
  // delamination, joints), a titanium sphere, inward pressure arrows, a grand piano on a fingertip, an air-filled can, the
  // Titanic's bow on the sea floor, a support ship, an ROV and a pressure-test chamber. Needs gimli.js (jetT) and world.js.
  const TI = { white: [236, 236, 238], carbon: [40, 42, 48], ti: [176, 182, 192], glass: [170, 210, 236], sand: [96, 100, 92], rust: [120, 70, 52], hull: [54, 48, 50] };
  // ---------- the deep ----------
  const deepFloor = (S, y = 0) => { S.quad([[-200, y, -200], [200, y, -200], [200, y, 200], [-200, y, 200]], TI.sand, { bg: true }); const r = H.rng(12); for (let i = 0; i < 26; i++) S.ico([r.range(-20, 20), y - 0.1, r.range(-24, 6)], [r.range(0.3, 1.2), r.range(0.15, 0.4), r.range(0.3, 1.0)], [86, 90, 84], { sub: 0, jit: 0.3, seed: i, noShadow: true }); };
  const deepEnv = { bg: deepSky, dof: 0.33, shadows: false, dofGap: 6 };
  // the blue-black grade and drifting marine snow, drawn after render (before captions)
  const deepGrade = (ctx, W, H_, t, a = 0.35) => { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(60,110,170,${a})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); const r = H.rng(31); ctx.save(); ctx.fillStyle = 'rgba(220,235,245,0.55)'; for (let i = 0; i < 70; i++) { const x = (r() * W + Math.sin(t * 0.3 + i) * 20) % W, y = ((r() * H_ + t * (12 + r() * 18)) % H_); ctx.fillRect(x, y, 2.2, 2.2); } ctx.restore(); };
  // ---------- inward pressure arrows around a centre (a ring in the xy plane, plus front and back) ----------
  const squeeze = (S, c, r, u, n = 10, col = P.orange, len = 0.45, o = {}) => { if (u <= 0) return; const L = len * Math.min(1, u); for (let i = 0; i < n; i++) { const a = (i / n) * TAU + 0.2, d = [Math.cos(a), Math.sin(a), 0], d2 = o.long ? [d[0] * (o.long || 1), d[1], 0] : d; S.arrow(add(c, mul(d2, r + 0.05 + L)), add(c, mul(d2, r + 0.05)), col, { side: [0, 0, 1], w: 0.07 * (o.w || 1), th: 0.02, noShadow: true }); } if (!o.flat) for (const sz of [-1, 1]) S.arrow(add(c, [0, 0, sz * (r + 0.05 + L)]), add(c, [0, 0, sz * (r + 0.05)]), col, { side: [1, 0, 0], w: 0.07 * (o.w || 1), th: 0.02, noShadow: true }); };
  // ---------- the Titan ----------
  // P0 = hull centre; local +x = forward; 1 unit = 1 m (length about 6.7). o: s, roll, pitch, yaw (as jetT); glass (0..1 fairing to
  // x-ray: shows the black carbon tube, the titanium rings and domes); delam (0..1 red glow between layers); crush (0..1 implosion);
  // lights (0..1 front lamps)
  const titanSub = (S, P0, o = {}) => {
    const cr = o.crush || 0, s = o.s ?? 1;
    const base = jetT(P0, o), nz = MXC.tnz || (MXC.tnz = H.makeNoise(23));
    const T = cr > 0 ? (p) => { const k = 1 - 0.78 * cr * (0.75 + 0.25 * nz.n3(p[0] * 2, p[1] * 2, p[2] * 2)); return base([p[0] * (1 - 0.3 * cr), p[1] * k, p[2] * k]); } : base;
    const AXL = (q) => rotZ(q, -Math.PI / 2), AXR = (q) => rotZ(q, Math.PI / 2), g = o.glass || 0, fa = g > 0 ? 1 - 0.82 * g : undefined;
    // the pressure hull (carbon tube, titanium rings, titanium domes, the acrylic viewport)
    if (g > 0.05 || o.hull) {
      S.cyl((q) => T(add(AXL(q), [-1.25, 0, 0])), 0.84, 2.5, TI.carbon, 18, { caps: false, gloss: 0.4 });
      if (o.delam > 0) for (const x of [-0.6, 0.15, 0.7]) S.cyl((q) => T(add(AXL(q), [x, 0, 0])), 0.85, 0.05, [255, 70 + 60 * (1 - o.delam), 50], 18, { caps: false, glow: true, noShadow: true, alpha: 0.4 + 0.6 * o.delam });
      for (const sx of [-1, 1]) { S.cyl((q) => T(add(AXL(q), [sx > 0 ? 1.2 : -1.32, 0, 0])), 0.9, 0.12, TI.ti, 18, { gloss: 0.5, cap: TI.ti }); S.ico(T([sx * 1.32, 0, 0]), [0.62, 0.84, 0.84], TI.ti, { sub: 1, gloss: 0.5 }); }
      S.ico(T([1.92, 0.05, 0]), [0.08, 0.2, 0.2], TI.glass, { sub: 1, alpha: 0.6, gloss: 0.8 });
    }
    // the white fairing: body, nose, tail cone with thrusters, skids
    if (g < 0.98) {
      S.cyl((q) => T(add(AXL(q), [-1.4, 0, 0])), 0.95, 3.3, TI.white, 16, { alpha: fa, caps: false, gloss: 0.3 });
      S.cyl((q) => T(add(AXL(q), [1.9, 0, 0])), 0.95, 0.38, TI.white, 16, { alpha: fa, r2: 0.42, gloss: 0.3 });
      S.cyl((q) => T(add(AXR(q), [-1.4, 0, 0])), 0.95, 1.5, TI.white, 16, { alpha: fa, r2: 0.35, gloss: 0.3 });
      S.box((q) => T(add(q, [0.2, 0.96, 0])), 1.2, 0.03, 0.18, [30, 34, 40], { alpha: fa, noShadow: true, paint: (c, w, h) => { c.fillStyle = '#e8e8ea'; c.font = FONT(800, h * 0.7); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('TITAN', w / 2, h / 2); } });
    }
    S.ico(T([2.3, 0.05, 0]), [0.06, 0.22, 0.22], TI.glass, { sub: 1, alpha: 0.7, gloss: 0.8 });
    for (const sz of [-1, 1]) { S.rod(T([-2.6, -1.05, sz * 0.7]), T([2.2, -1.05, sz * 0.7]), 0.06, [60, 62, 70], 6); for (const x of [-1.8, 0, 1.6]) S.rod(T([x, -1.05, sz * 0.7]), T([x, -0.7, sz * 0.5]), 0.04, [60, 62, 70], 5); }
    for (const [y, z] of [[0.45, 0.45], [0.45, -0.45], [-0.45, 0.45], [-0.45, -0.45]]) S.cyl((q) => T(add(AXR(q), [-2.75, y, z])), 0.17, 0.3, [50, 52, 60], 10);
    if (o.lights > 0) for (const sz of [-0.5, 0.5]) S.ico(T([2.2, 0.55, sz]), 0.09 * o.lights, [255, 244, 200], { sub: 0, glow: true, noShadow: true });
    void s;
    return { T, front: T([2.3, 0, 0]), joint: T([1.2, 0.9, 0]), jointB: T([-1.26, 0.9, 0]), mid: T([0, 0, 0.9]), top: T([0, 1.0, 0]) };
  };
  // the debris on the sea floor: the tail cone, a titanium ring with its dome, part of the frame
  const titanDebris = (S, c) => {
    S.cyl((q) => add(rotZ(rotY(q, 0.4), Math.PI / 2 + 0.3), add(c, [-2.2, 0.4, 0.6])), 0.95, 1.5, TI.white, 14, { r2: 0.35 });
    S.cyl((q) => add(rotX(rotZ(q, 1.2), 0.3), add(c, [1.5, 0.3, -0.4])), 0.9, 0.12, TI.ti, 18, { gloss: 0.5 }); S.ico(add(c, [1.55, 0.45, -0.35]), [0.6, 0.5, 0.6], TI.ti, { sub: 1, gloss: 0.5 });
    S.rod(add(c, [-0.8, 0.06, 1.4]), add(c, [1.0, 0.06, 1.9]), 0.06, [60, 62, 70], 6); S.rod(add(c, [-0.3, 0.06, -1.6]), add(c, [0.8, 0.1, -1.9]), 0.05, [60, 62, 70], 6);
    const r = H.rng(4); for (let i = 0; i < 10; i++) S.box((q) => add(rotY(q, r() * 3), add(c, [r.range(-2.5, 2.5), 0.03, r.range(-2, 2)])), r.range(0.05, 0.18), 0.02, r.range(0.04, 0.12), i % 3 ? TI.white : TI.carbon, { bevel: 0.1 });
  };
  // ---------- the pressure hull alone, on the stand (garage) ----------
  // o: s (scale), tubeT / ringT / capT (times the tube, rings, domes fly in; omitted = already there), delam, joint (0..1 red glow at the joints), crush, layers
  const carbonHull = (S, c, t, o = {}) => {
    const s = o.s ?? 0.42, AXL = (q) => rotZ(q, -Math.PI / 2), cr = o.crush || 0, k = 1 - 0.75 * cr, kx = 1 - 0.3 * cr;
    const T = (p) => add(c, [p[0] * s * kx, p[1] * s * k, p[2] * s * k]), fi = (tt, from) => (tt == null ? [0, 0, 0] : flyIn(t, tt, 0.5, from));
    const offT = fi(o.tubeT, [0, 1.2, 0]);
    if (offT) { const off = offT; const Tt = (p) => add(T(p), off); S.cyl((q) => Tt(add(AXL(q), [-1.25, 0, 0])), 0.84, 2.5, TI.carbon, 20, { cap: [70, 66, 60], gloss: 0.4, capPaint: o.layers ? (cc, w, h) => { cc.strokeStyle = 'rgba(200,180,140,0.55)'; cc.lineWidth = 2; for (let i = 0; i < 9; i++) { cc.beginPath(); cc.arc(w / 2, h / 2, w * (0.36 + i * 0.016), 0, TAU); cc.stroke(); } } : null });
      if (o.delam > 0) for (const x of [-0.6, 0.15, 0.7]) S.cyl((q) => Tt(add(AXL(q), [x, 0, 0])), 0.855, 0.05, [255, 80, 50], 20, { caps: false, glow: true, noShadow: true, alpha: o.delam }); }
    for (const sx of [-1, 1]) {
      const offR = fi(o.ringT, [sx * 1.2, 0, 0]), offC = fi(o.capT, [sx * 1.6, 0, 0]);
      if (offR) { const off = offR; S.cyl((q) => add(T(add(AXL(q), [sx > 0 ? 1.2 : -1.32, 0, 0])), off), 0.9, 0.12, o.joint > 0 ? [255, 120 - 60 * o.joint, 80] : TI.ti, 20, { gloss: 0.5, glow: (o.joint || 0) > 0.5 }); }
      if (offC) { const off = offC; S.ico(add(T([sx * 1.32, 0, 0]), off), [0.62 * s * kx, 0.84 * s * k, 0.84 * s * k], TI.ti, { sub: 1, gloss: 0.5 }); }
    }
    if (o.stand !== false) stand(S, [c[0], 0, c[2]], 0.75, 0.42, c[1] - 0.84 * s - 0.02);
    return { joint: T([1.26, 0.9, 0.2]), mid: T([0, 0.86, 0.3]), end: T([2.0, 0, 0]) };
  };
  // a titanium sphere (the classic deep-sea crew sphere): o.glass shows the seat inside
  const tiSphere = (S, c, r, o = {}) => { S.ico(c, r, TI.ti, { sub: 1, gloss: 0.5, alpha: o.glass ? 1 - 0.75 * o.glass : undefined }); S.ico(add(c, [r * 0.96, 0, 0]), [r * 0.08, r * 0.22, r * 0.22], TI.glass, { sub: 1, alpha: 0.7 }); if (o.glass) S.box((q) => add(q, add(c, [0, -r * 0.45, 0])), r * 0.35, r * 0.08, r * 0.3, P.red, { bevel: 0.2 }); if (o.stand !== false) stand(S, [c[0], 0, c[2]], r * 1.1, r * 0.8, c[1] - r - 0.02); };
  // a grand piano balanced on a tiny block (about one square centimetre), on the stand
  const pianoOnTip = (S, c, o = {}) => {
    stand(S, [c[0], 0, c[2]], 0.4, 0.3, c[1] - 0.05); S.box((q) => add(q, add(c, [0, -0.025, 0])), 0.05, 0.025, 0.05, o.hot ? [255, 140, 70] : P.steel, { bevel: 0.1, glow: !!o.hot });
    const B = (p) => add(c, add([0, 0.02 + 0.32, 0], p));
    S.box((q) => add(q, B([0, 0.08, 0])), 0.42, 0.09, 0.3, [26, 26, 30], { bevel: 0.1, gloss: 0.6 });
    S.box((q) => add(rotZ(add(q, [0.4, 0, 0]), 0.45), B([-0.42, 0.18, 0])), 0.4, 0.01, 0.28, [30, 30, 34], { bevel: 0.1, gloss: 0.6 });
    S.box((q) => add(q, B([0.3, 0.03, 0.31])), 0.12, 0.02, 0.03, [244, 242, 236], { bevel: 0.1 });
    for (const [x, z] of [[-0.3, -0.2], [-0.3, 0.2], [0.33, 0]]) S.rod(B([x, 0, z]), B([x, -0.26, z]), 0.025, [26, 26, 30], 6);
  };
  // an air-filled drinks can that crushes (u 0..1)
  const crushCan = (S, c, u = 0) => { const k = 1 - 0.8 * u, nz = MXC.cnz || (MXC.cnz = H.makeNoise(5)); S.cyl((q) => add(c, [q[0] * (1 - 0.4 * u * (0.6 + 0.4 * nz.n3(q[1] * 6, 0, q[0] * 6))), q[1] * k, q[2] * (1 - 0.4 * u * (0.6 + 0.4 * nz.n3(q[1] * 6, 1, q[2] * 6)))]), 0.11, 0.42, [210, 60, 50], 14, { cap: [200, 204, 212], gloss: 0.5 }); };
  // ---------- the Titanic's bow on the sea floor ----------
  const wreckBow = (S, c, o = {}) => {
    const prof = [[0, 0], [2.6, 0.25], [3.4, 1.4], [3.2, 2.0], [0, 2.0]], hw = 1.2;
    const T = (p) => add(rotY(p, o.yaw || 0), c);
    const A = prof.map(([x, y]) => T([x, y, -hw * (x > 2.4 ? Math.max(0.05, 1 - (x - 2.4) / 1.0) : 1)])), B = prof.map(([x, y]) => T([x, y, hw * (x > 2.4 ? Math.max(0.05, 1 - (x - 2.4) / 1.0) : 1)])), C = T([1.5, 1, 0]);
    S.face(A.slice().reverse(), TI.hull, { c: C }); S.face(B, TI.hull, { c: C }); for (let i = 0; i < prof.length; i++) { const j = (i + 1) % prof.length; S.face([A[i], A[j], B[j], B[i]], i === 3 ? [110, 92, 80] : TI.hull, { c: C }); }
    for (const sz of [-1, 1]) S.box((q) => T(add(q, [1.3, 1.6, sz * hw * 1.002])), 1.2, 0.18, 0.004, TI.rust, { bevel: 0, noShadow: true, paint: (cc, w, h) => { cc.fillStyle = '#20242a'; for (let x = 6; x < w; x += 18) { cc.beginPath(); cc.arc(x, h / 2, 3.2, 0, TAU); cc.fill(); } } });
    for (let x = 0.2; x < 3.1; x += 0.35) S.rod(T([x, 2.0, -hw * 0.95]), T([x, 2.18, -hw * 0.95]), 0.012, TI.rust, 4);
    S.rod(T([-0.1, 2.0, 0]), T([1.8, 2.6, 0.2]), 0.05, TI.rust, 6);
    const r = H.rng(8); for (let i = 0; i < 8; i++) S.ico(T([r.range(0, 3), r.range(0.3, 1.8), (r() < 0.5 ? -1 : 1) * hw * 1.01]), [0.12, 0.25, 0.04], [150, 82, 50], { sub: 0, jit: 0.3, seed: i, noShadow: true });
  };
  // ---------- surface + tools ----------
  const supportShip = (S, c) => {
    S.box((q) => add(q, add(c, [0, 0.4, 0])), 4.0, 0.55, 1.0, [40, 56, 96], { bevel: 0.05 }); S.box((q) => add(q, add(c, [0, 0.96, 0])), 4.0, 0.02, 1.0, [220, 220, 224], { bevel: 0 });
    S.box((q) => add(q, add(c, [1.6, 1.5, 0])), 0.9, 0.55, 0.8, [236, 236, 238], { bevel: 0.05, paint: (cc, w, h) => { cc.fillStyle = '#26324a'; for (let x = 10; x < w - 10; x += 28) cc.fillRect(x, h * 0.2, 16, h * 0.2); } });
    S.rod(add(c, [-3.6, 0.98, -0.6]), add(c, [-4.2, 2.4, 0]), 0.06, [230, 140, 50], 6); S.rod(add(c, [-3.6, 0.98, 0.6]), add(c, [-4.2, 2.4, 0]), 0.06, [230, 140, 50], 6);
  };
  const rov = (S, P0, t, o = {}) => { const T = (p) => add(rotY(p, o.yaw || 0), P0); S.box((q) => T(q), 0.5, 0.3, 0.38, [246, 196, 60], { bevel: 0.1 }); S.box((q) => T(add(q, [0, -0.36, 0])), 0.52, 0.06, 0.4, [60, 62, 70], { bevel: 0.1 }); for (const sz of [-1, 1]) S.ico(T([0.52, 0.12, sz * 0.2]), 0.07, [255, 244, 200], { sub: 0, glow: true, noShadow: true }); S.rod(T([0, 0.3, 0]), T([0, 3, 0]), 0.02, [240, 200, 60], 4, { noShadow: true }); void t; };
  // a vertical steel pressure-test chamber with a lid and a gauge; o.glass shows what's inside
  const pressureChamber = (S, c, t, o = {}) => { S.cyl((q) => add(q, c), 0.75, 1.6, [96, 104, 120], 18, { alpha: o.glass ? 1 - 0.75 * o.glass : undefined, gloss: 0.4, cap: [80, 86, 100] }); S.cyl((q) => add(q, add(c, [0, 1.6 + 0.05 * (o.lid || 0), 0])), 0.82, 0.12, [70, 76, 90], 18); gauge(S, add(c, [0.0, 1.2, 0.8]), 0.7, o.gauge ?? 0.2); stand(S, [c[0], 0, c[2]], 0.75, 0.6, c[1] - 0.02); void t; };
