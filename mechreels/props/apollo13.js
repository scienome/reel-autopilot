  // ==================== Apollo 13 props (video 008 and Shorts 23-25) ====================
  // Space (stars, the Earth, the Moon), the Apollo stack (lunar module Aquarius docked to the command module Odyssey and the
  // service module, with the bay-4 panel that can blow off), an oxygen tank cutaway (heater, fan, wiring) with a fuel cell,
  // CO2 canisters (round LM socket, square CM cartridge) and the duct-tape adapter parts, the free-return path, and the
  // splashdown (capsule under three parachutes). Needs world.js.
  const AP = { silver: [206, 210, 218], white: [236, 236, 238], gold: [226, 176, 70], lmGrey: [150, 152, 160], cm: [214, 216, 222], earth: [70, 120, 200], land: [96, 150, 90], moon: [176, 174, 170], co2: [120, 120, 128] };
  // ---------- space bodies ----------
  const earth = (S, c, r = 3) => { S.ico(c, r, AP.earth, { sub: 1, gloss: 0.4, noShadow: true }); const g = H.rng(4); for (let i = 0; i < 7; i++) { const a = g() * TAU, b = g() * 2 - 1, d = norm([Math.cos(a), b, Math.sin(a)]); S.ico(add(c, mul(d, r * 0.93)), [r * 0.32, r * 0.18, r * 0.28], i % 3 ? AP.land : [244, 246, 250], { sub: 0, jit: 0.3, seed: i, noShadow: true }); } };
  const moon = (S, c, r = 2.2) => { S.ico(c, r, AP.moon, { sub: 1, jit: 0.06, seed: 2, noShadow: true }); const g = H.rng(8); for (let i = 0; i < 10; i++) { const a = g() * TAU, b = g() * 2 - 1, d = norm([Math.cos(a), b, Math.sin(a)]); S.ico(add(c, mul(d, r * 0.98)), [r * 0.16, r * 0.04, r * 0.16], [150, 148, 146], { sub: 0, noShadow: true }); } };
  const spaceEnv = { bg: nightSky, dof: 0.33, shadows: false, dofGap: 30 };
  // ---------- the Apollo stack ----------
  // P0 = the docking point between the CM nose and the LM; the stack lies along x: LM at +x, CM/SM toward -x.
  // o: s, roll, pitch, yaw (rotations about the docking point); panel (0..1 the bay-4 panel blows off), lm (false = no LM),
  // sm (false = no SM), cmLit / lmLit (window glow), engine (0..1 the LM descent engine burns), vent (true = draws nothing; 2D)
  const apolloStack = (S, P0, o = {}) => {
    const s = o.s ?? 1, T = (p) => add(rotY(rotZ(rotX(mul(p, s), o.roll || 0), o.pitch || 0), o.yaw || 0), P0), AXL = (q) => rotZ(q, -Math.PI / 2), AXR = (q) => rotZ(q, Math.PI / 2);
    const ret = { T };
    // command module: a cone from x = -0.02 (nose) back to x = -0.36 (heat shield)
    if (o.cm !== false) { S.cyl((q) => T(add(AXL(q), [-0.36, 0, 0])), 0.2, 0.33, AP.cm, 14, { r2: 0.04, gloss: 0.5 }); for (const sd of [-1, 1]) S.box((q) => T(add(rotY(q, sd * 0.5), [-0.22, 0.05, sd * 0.13])), 0.02, 0.02, 0.003, o.cmLit ? [255, 220, 150] : [30, 34, 44], { bevel: 0, noShadow: true, glow: !!o.cmLit }); ret.cm = T([-0.2, 0.1, 0]); }
    // service module: a cylinder behind the CM, the SPS engine bell, the antenna; bay 4 panel
    if (o.sm !== false) {
      const SM = (p) => T(add(p, o.smOff || [0, 0, 0]));
      S.cyl((q) => SM(add(AXR(q), [-0.37, 0, 0])), 0.2, 0.75, AP.silver, 14, { gloss: 0.6, cap: [120, 124, 132] });
      S.cyl((q) => SM(add(AXR(q), [-1.12, 0, 0])), 0.07, 0.25, [70, 72, 80], 12, { r2: 0.15, caps: false });
      S.rod(SM([-1.0, -0.18, 0]), SM([-1.15, -0.4, 0]), 0.01, AP.silver, 4); S.cyl((q) => SM(add(q, [-1.15, -0.42, 0])), 0.06, 0.02, AP.white, 10);
      const pu = o.panel || 0;
      if (pu < 0.02) S.box((q) => SM(add(q, [-0.75, 0, 0.202])), 0.22, 0.15, 0.004, [196, 200, 208], { bevel: 0, noShadow: true });
      else { S.box((q) => SM(add(q, [-0.75, 0, 0.17])), 0.21, 0.14, 0.03, [60, 50, 50], { bevel: 0, noShadow: true }); S.box((q) => SM(add(rotX(rotY(q, 2 * pu), 3 * pu), [-0.75 + 0.2 * pu, 0.3 * pu, 0.202 + 1.4 * pu])), 0.22, 0.15, 0.004, [196, 200, 208], { bevel: 0 }); }
      ret.bay = SM([-0.75, 0, 0.21]);
    }
    // lunar module: descent stage (gold, octagonal, legs) and ascent stage (grey), its docking tunnel at P0
    if (o.lm !== false) {
      const L = (p) => T(add(p, o.lmOff || [0, 0, 0]));
      S.cyl((q) => L(add(AXL(q), [0.02, 0, 0])), 0.07, 0.06, AP.silver, 10);
      S.ico(L([0.24, 0, 0]), [0.17, 0.2, 0.2], AP.lmGrey, { sub: 0, gloss: 0.3 });
      S.cyl((q) => L(add(AXL(q), [0.38, 0, 0])), 0.27, 0.26, AP.gold, 8, { gloss: 0.6 });
      for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU + Math.PI / 4, d = [0, Math.cos(a), Math.sin(a)]; S.rod(L(add([0.5, 0, 0], mul(d, 0.25))), L(add([0.82, 0, 0], mul(d, 0.42))), 0.012, AP.silver, 4); S.cyl((q) => L(add(AXL(q), add([0.82, 0, 0], mul(d, 0.42)))), 0.05, 0.01, AP.gold, 8); }
      S.cyl((q) => L(add(AXL(q), [0.64, 0, 0])), 0.07, 0.06, [70, 72, 80], 10, { r2: 0.12, caps: false });
      if (o.engine > 0) S.ico(L([0.78, 0, 0]), [0.14 * o.engine, 0.08, 0.08], [255, 200, 120], { sub: 0, glow: true, noShadow: true });
      S.box((q) => L(add(q, [0.2, 0.12, 0.16])), 0.02, 0.025, 0.004, o.lmLit ? [255, 220, 150] : [30, 34, 44], { bevel: 0, noShadow: true, glow: !!o.lmLit });
      ret.lm = L([0.3, 0, 0]); ret.engine = L([0.78, 0, 0]);
    }
    return ret;
  };
  // ---------- the oxygen tank (garage) ----------
  // c = centre; o: heat (0..1 heater glow), fan (angle), wires (0..1 insulation damage glow), fire (0..1), burst (0..1), oxygen (0..1 beads to the fuel cell), power (0..1 the fuel cell's output), fans (false = the post-1970 tank without fans), steelWire, glass
  const o2Tank = (S, c, t, o = {}) => {
    const b = o.burst || 0, r = 0.32 * (1 + 0.3 * b);
    if (b < 0.6) S.ico(c, r, AP.silver, { sub: 1, gloss: 0.6, alpha: 1 - 0.75 * (o.glass ?? 1) });
    else { const g = H.rng(5); for (let i = 0; i < 10; i++) { const d = norm([g() - 0.5, g() - 0.5, g() - 0.5]); S.box((q) => add(rotY(rotX(q, g() * 3), g() * 3), add(c, mul(d, r * (0.8 + 1.4 * (b - 0.6))))), 0.08, 0.06, 0.006, AP.silver, { bevel: 0 }); } }
    S.rod(add(c, [0, -0.3, 0]), add(c, [0, 0.3, 0]), 0.025, [120, 124, 132], 6);
    if (o.heat > 0) S.box((q) => add(q, add(c, [0, -0.05, 0])), 0.015, 0.18, 0.04, [255, 90 + 60 * (1 - o.heat), 50], { bevel: 0, glow: o.heat > 0.4, noShadow: true });
    if (o.fans !== false) for (const y of [0.18, -0.2]) for (let k = 0; k < 3; k++) S.box((q) => add(rotY(add(q, [0.06, 0, 0]), (o.fan || 0) + (k * TAU) / 3), add(c, [0, y, 0])), 0.06, 0.004, 0.015, P.steel, { bevel: 0, noShadow: true });
    S.tube([add(c, [0, 0.3, 0]), add(c, [0.04, 0.2, 0.04]), add(c, [0.03, -0.18, 0.05])], 0.008, o.wires > 0 ? [255, 120 - 60 * o.wires, 50] : o.steelWire ? P.chrome : [230, 200, 80], 4, { glow: (o.wires || 0) > 0.5, noShadow: true });
    if (o.fire > 0) { const g = H.rng(Math.floor(t * 15)); for (let k = 0; k < 6; k++) S.ico(add(c, [g.range(-0.08, 0.08), g.range(-0.15, 0.15), g.range(-0.08, 0.08)]), 0.05 * o.fire * (0.6 + 0.6 * g()), [255, 140 + 80 * g(), 60], { sub: 0, glow: true, noShadow: true }); }
    // the fuel cell: oxygen in -> electricity (yellow) + water (blue)
    const fc = add(c, [1.0, -0.1, 0]); S.box((q) => add(q, fc), 0.18, 0.22, 0.16, [70, 90, 140], { bevel: 0.15, glow: false });
    const line = [add(c, [0.3, 0, 0]), add(fc, [-0.18, 0, 0])]; S.tube(line, 0.012, [70, 72, 82], 6);
    if (o.oxygen > 0) S.beads(line, P.air, t * 0.8, { reveal: o.oxygen, spacing: 0.05, r: 0.016 });
    if (o.power > 0) { S.beads([add(fc, [0.18, 0.1, 0]), add(fc, [0.5, 0.1, 0])], P.yellow, t, { reveal: o.power, spacing: 0.05, r: 0.016 }); S.beads([add(fc, [0.18, -0.1, 0]), add(fc, [0.5, -0.1, 0])], [90, 160, 230], t * 0.6, { reveal: o.power, spacing: 0.06, r: 0.016 }); }
    stand(S, [c[0] + 0.45, 0, c[2]], 0.9, 0.4, c[1] - 0.34);
    return { tank: add(c, [0, 0, 0.35]), switch: add(c, [0, -0.05, 0.3]), wires: add(c, [0.04, 0.05, 0.3]), cell: add(fc, [0, 0, 0.18]) };
  };
  // ---------- CO2: the round LM socket, the square CM cartridge, the adapter parts ----------
  // c = centre of the bench. o: square (0..1 the square cartridge tries the round socket), parts (0..1 the bits fly in),
  // build (0..1 the adapter assembles), co2 (0..1 grey dots in the air), t
  const co2Bench = (S, c, t, o = {}) => {
    const P_ = (x, y, z) => add(c, [x, y, z]);
    S.box((q) => add(q, P_(0, 0, 0)), 0.9, 0.03, 0.45, [120, 112, 100], { bevel: 0.1 });
    // the LM's round socket
    S.cyl((q) => add(q, P_(-0.5, 0.03, 0)), 0.12, 0.2, [90, 92, 100], 16, { cap: [40, 40, 46] }); S.cyl((q) => add(q, P_(-0.5, 0.23, 0)), 0.09, 0.02, [20, 20, 24], 16);
    // the square CM cartridge: tries the round hole, bounces
    const sq = o.square || 0, bu = o.build || 0;
    const sqPos = bu > 0 ? P_(0.15, 0.17, 0) : lerp3(P_(0.35, 0.15, 0), P_(-0.5, 0.42 + 0.06 * Math.abs(Math.sin(t * 9)) * (sq > 0.8 ? 1 : 0), 0), Math.min(1, sq * 1.25));
    S.box((q) => add(q, sqPos), 0.13, 0.13, 0.13, [220, 222, 228], { bevel: 0.1, paint: (cc, w, h) => { cc.fillStyle = '#b0b4bc'; for (let i = 1; i < 6; i++) cc.fillRect(0, (i * h) / 6, w, 3); } });
    // the parts: plastic bag, flight-plan cardboard, suit hose, sock, duct tape
    const pu = o.parts || 0;
    if (pu > 0) {
      const fly = (k, p) => { const u = H.clamp(pu * 1.6 - k * 0.15); return u > 0 ? lerp3(add(p, [0, 0.8, 0.3]), p, H.ease.out(u)) : null; };
      const bag = fly(0, bu > 0.3 ? P_(0.15, 0.17, 0) : P_(0.55, 0.12, 0.2)); if (bag) S.ico(bag, bu > 0.3 ? [0.2, 0.17, 0.17] : [0.12, 0.05, 0.1], [220, 236, 246], { sub: 1, alpha: 0.4, gloss: 0.8 });
      const card = fly(1, P_(0.6, 0.05, -0.2)); if (card) S.box((q) => add(rotX(q, bu > 0.5 ? -1.2 * bu : 0), add(card, bu > 0.5 ? [-0.45 * bu, 0.15 * bu, 0.2 * bu] : [0, 0, 0])), 0.14, 0.006, 0.1, [214, 190, 140], { bevel: 0 });
      const hose = fly(2, P_(0.2, 0.06, 0.3)); if (hose) S.tube(bu > 0.6 ? [P_(0.15, 0.36, 0), P_(-0.15, 0.5, 0), P_(-0.5, 0.42, 0), P_(-0.5, 0.26, 0)] : [hose, add(hose, [0.2, 0, 0.05]), add(hose, [0.35, 0.02, -0.05])], 0.03, [70, 110, 160], 8);
      const sock = fly(3, P_(-0.1, 0.06, 0.32)); if (sock) S.ico(sock, [0.07, 0.03, 0.04], [200, 60, 60], { sub: 0 });
      const tape = fly(4, P_(0.75, 0.08, 0.2)); if (tape) S.cyl((q) => add(rotX(q, Math.PI / 2), tape), 0.07, 0.04, [170, 172, 176], 14, { cap: [130, 132, 138] });
      if (bu > 0.8) for (const y of [0.05, 0.25]) S.box((q) => add(q, P_(0.15, 0.17 + y - 0.15, 0)), 0.2, 0.02, 0.18, [170, 172, 176], { bevel: 0 });
    }
    if (o.co2 > 0) { const g = H.rng(3); for (let k = 0; k < Math.round(50 * o.co2); k++) S.dots.push({ p: P_(g.range(-0.9, 0.9) + Math.sin(t + k) * 0.05, g.range(0.3, 1.0), g.range(-0.3, 0.3)), col: AP.co2, r: 0.015 }); }
    stand(S, [c[0], 0, c[2]], 0.8, 0.4, c[1] - 0.04);
    return { socket: P_(-0.5, 0.3, 0.12), square: add(sqPos, [0, 0, 0.14]), adapter: P_(0.0, 0.3, 0.15) };
  };
  // ---------- the free-return path (top-down) ----------
  // Earth at the origin, the Moon at +x; a figure-eight path; u reveals it
  const freeReturn = (S, t, u, o = {}) => {
    const E = [0, 0, 0], M = [14, 0, 0], pts = [];
    for (let i = 0; i <= 60; i++) { const a = (i / 60) * TAU; const x = 7 + 7.6 * Math.sin(a - Math.PI / 2) * 1, z = 2.6 * Math.sin(2 * a) * 1; pts.push([x + 0.0, 0.3, z]); }
    earth(S, E, 1.6); moon(S, M, 1.0);
    S.beads(pts.slice(0, 31), o.col || P.green, -t * 2, { reveal: u, spacing: 0.4, r: 0.12 });
    if (o.home) S.beads(pts.slice(30), P.green, -t * 2, { reveal: o.home, spacing: 0.4, r: 0.12 });
    return { pts, M };
  };
  // the capsule under three parachutes over the ocean at P0 (y = height above the water); o.chutes 0..1
  const splashCM = (S, P0, o = {}) => {
    const AXR = (q) => rotZ(q, Math.PI / 2);
    S.cyl((q) => add(rotZ(AXR(q), -Math.PI / 2), P0), 0.25, 0.35, AP.cm, 14, { r2: 0.05, gloss: 0.5 });
    const cu = o.chutes ?? 1; if (cu > 0) for (let i = 0; i < 3; i++) { const a = (i / 3) * TAU, top = add(P0, [Math.cos(a) * 0.55, 1.6 * cu, Math.sin(a) * 0.55]); S.ico(top, [0.45 * cu, 0.22 * cu, 0.45 * cu], i % 2 ? [230, 90, 70] : [244, 240, 236], { sub: 1, noShadow: true }); for (const k of [-1, 1]) S.rod(add(P0, [0, 0.35, 0]), add(top, [k * 0.3 * cu, -0.15, 0]), 0.004, [220, 220, 220], 3, { noShadow: true }); }
  };
