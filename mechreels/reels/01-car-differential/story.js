  // ==================== "How a car's differential works" ====================
  // Corner road at sunset (the outside wheel travels farther) -> garage rig: a locked axle scrubs -> the differential
  // builds up part by part (housing, driveshaft, pinion, ring gear, carrier, spider gears, side gears) -> straight vs
  // turning -> the open-diff catch (one wheel on ice) -> limited-slip clutch packs -> back on the corner, confetti.
  // Every time comes from V(beat, WORD): exact once the ElevenLabs take exists, estimated before.

  const BEATS = window.SCRIPT;
  const Cy = 1.4, C = [0, Cy, 0];

  // ---------- shots ----------
  const SH = [
    ['corner', 0],
    ['locked', BEAT0('locked') - 0.15],
    ['drive', BEAT0('pinion') - 0.15],
    ['carrier', BEAT0('carrier') - 0.15],
    ['straight', BEAT0('straight') - 0.15],
    ['ice', BEAT0('catch') - 0.15],
    ['lsd', BEAT0('lsd') - 0.15],
    ['finale', BEAT0('finale') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (name) => SH.find((s) => s[0] === name)[1];

  // ---------- drivetrain speeds (rad/s) -> angles (pure functions of t) ----------
  const SC = 5; // carrier (ring gear) speed
  const RATIO = 3.4; // pinion turns ~3.4x faster than the ring gear: the final-drive reduction
  const kTurn = (t) => 0.5 * ramp(t, V('turn', 'rotate') - 0.25, 0.6) * (1 - ramp(t, ST('ice') - 0.05, 0.05));
  const kIce = (t) => ramp(t, V('catch', 'spins') - 0.35, 0.5);
  const kLsd = (t) => ramp(t, V('lsd', 'grip') - 0.3, 0.8);
  const sL = (t) => SC * (1 - kTurn(t) + kIce(t) - 0.8 * kLsd(t));
  const sR = (t) => SC * (1 + kTurn(t) - kIce(t) + 0.8 * kLsd(t));
  const sSp = (t) => ((sR(t) - sL(t)) / 2) * 1.4; // spider gears spin on their pin only when the wheels differ
  const ANG = (t) => ({ c: SC * t, p: SC * RATIO * t, L: integ(sL, t), R: integ(sR, t), s: integ(sSp, t) });

  // ---------- builders ----------
  const AX = (p) => rotZ(p, -Math.PI / 2); // local +y -> world +x
  const AXn = (p) => rotZ(p, Math.PI / 2); // local +y -> world -x
  const AZ = (p) => rotX(p, Math.PI / 2); // local +y -> world +z
  const scl = (T, s) => (p) => T(mul(p, s));
  // an annulus (ring gear body) between x0..x1 and radii rIn..rOut; T maps local (x along axis) -> world
  const annulus = (S, T, x0, x1, rIn, rOut, col, n, o = {}) => {
    const P2 = (x, r, a) => T([x, Math.cos(a) * r, Math.sin(a) * r]);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU, b = ((i + 1) / n) * TAU, m = (a + b) / 2, rm = (rIn + rOut) / 2, cc = T([(x0 + x1) / 2, Math.cos(m) * rm, Math.sin(m) * rm]);
      const cl = o.stripes && i % 2 ? o.stripes : col;
      S.face([P2(x0, rOut, a), P2(x1, rOut, a), P2(x1, rOut, b), P2(x0, rOut, b)], cl, { ...o, c: cc });
      S.face([P2(x0, rIn, a), P2(x1, rIn, a), P2(x1, rIn, b), P2(x0, rIn, b)], cl, { ...o, c: cc });
      S.face([P2(x0, rIn, a), P2(x0, rOut, a), P2(x0, rOut, b), P2(x0, rIn, b)], col, { ...o, c: cc });
      S.face([P2(x1, rIn, a), P2(x1, rOut, a), P2(x1, rOut, b), P2(x1, rIn, b)], col, { ...o, c: cc });
    }
  };
  const wheel = (S, side, a, o = {}) => { // side -1 = left (x < 0), +1 = right
    const T = (p) => add(rotX((side > 0 ? AX : AXn)(p), a), [side * 1.05, Cy, 0]);
    S.cyl(T, 0.3, 0.16, P.tire, 18, { cap: [150, 156, 170], gloss: 0.05, capPaint: (c, w, h) => { c.fillStyle = '#5a5e68'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.3, 0, TAU); c.fill(); c.strokeStyle = '#2a2a30'; c.lineWidth = w * 0.07; for (let k = 0; k < 5; k++) { const ang = (k / 5) * TAU; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + Math.cos(ang) * w * 0.4, h / 2 + Math.sin(ang) * h * 0.4); c.stroke(); } c.fillStyle = '#d8dce4'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.08, 0, TAU); c.fill(); } });
    S.cyl((p) => add(rotX((side > 0 ? AX : AXn)(p), a), [side * 1.02, Cy, 0]), 0.09, 0.04, P.chrome, 10); // hub
  };
  // the axle rig on its stand. o: what is built so far and how far (0..1), plus the angles
  const rig = (S, t, A, o = {}) => {
    stand(S, [0, 0, 0], 0.7, 0.5, 0.85);
    S.rod([0, 0.85, 0], [0, Cy - 0.5, 0], 0.05, P.dark, 8);
    S.box((p) => add(p, [0, Cy - 0.5, 0]), 0.12, 0.03, 0.12, P.dark, { bevel: 0.2 });
    // axles: one solid bar (locked) or two half-shafts ending in the side gears
    const axCol = o.axleGlow ? lerpC(P.steel, P.teal, o.axleGlow) : P.steel;
    for (const sd of [-1, 1]) S.rod([sd * 0.2, Cy, 0], [sd * 1.05, Cy, 0], 0.035, axCol, 10, { glow: o.axleGlow > 0.5 ? true : undefined });
    if ((o.solid ?? 0) > 0.02) S.rod([-0.21, Cy, 0], [0.21, Cy, 0], 0.035 * o.solid, P.steel, 10);
    wheel(S, -1, A.L); wheel(S, 1, A.R);
    // housing (iron "pumpkin" + nose + axle tubes), flies in from above, then turns to glass
    if (o.housing != null) {
      const off = o.housing, ga = o.glass ?? 0, hf = 1 - (o.hfade ?? 0), al = ga > 0 ? (1 - 0.86 * ga) * hf : undefined, hc = [92, 96, 108];
      if (al !== undefined && al < 0.02) { /* casing faded out: x-ray view */ } else {
      const G = (p) => add(p, off);
      S.cyl((p) => G(add(AX(p), [-0.38, Cy, 0])), 0.58, 0.82, hc, 20, { alpha: al, gloss: 0.25 });
      S.cyl((p) => G(add(AZ(p), [0.18, Cy, 0.36])), 0.17, 0.32, hc, 14, { alpha: al, gloss: 0.25 });
      for (const sd of [-1, 1]) S.rod(G([sd > 0 ? 0.44 : -0.38, Cy, 0]), G([sd * 0.95, Cy, 0]), 0.075, hc, 12, { alpha: al });
    } }
    // driveshaft + pinion (spin together)
    if (o.drive) { const off = o.drive; S.cyl((p) => add(add(rotX(rotY(p, A.p), Math.PI / 2), [0.18, Cy, 0.52]), off), 0.045, 1.0, P.steel, 8, { stripes: shade(P.steel, 0.86) }); S.box((p) => add(add(rotZ(p, A.p), [0.18, Cy, 0.86]), off), 0.07, 0.07, 0.05, P.dark, { bevel: 0.2 }); }
    if (o.pinion > 0) S.cyl(scl((p) => add(rotX(rotY(p, A.p), Math.PI / 2), [0.18, Cy, 0.34]), o.pinion), 0.055, 0.18, P.orange, 12, { r2: 0.105, stripes: shade(P.orange, 0.78), gloss: 0.3 });
    // ring gear: an annulus with teeth on the face toward the pinion
    if (o.ring) {
      const off = o.ring, T = (p) => add(add(rotX(p, A.c), C), off);
      annulus(S, T, 0.28, 0.34, 0.24, 0.48, P.orange, 30, { gloss: 0.3, stripes: shade(P.orange, 0.9) });
      for (let k = 0; k < 26; k++) { const ph = (k / 26) * TAU; S.box((p) => T(add([0.262, 0, 0], rotX(add(p, [0, 0.41, 0]), ph))), 0.018, 0.055, 0.02, shade(P.orange, 0.82), { bevel: 0 }); }
    }
    // carrier: a glass cage turning with the ring gear
    if (o.carrier) { const off = o.carrier; S.cyl((p) => add(add(rotX(AX(p), A.c), [-0.28, Cy, 0]), off), 0.24, 0.56, P.glass, 14, { alpha: 0.32, gloss: 0.4 }); }
    // spider gears on their pin (turn with the carrier, spin on the pin only when the wheels differ)
    if (o.spiders > 0) {
      const s = o.spiders;
      S.rod(add(C, rotX([0, -0.21 * s, 0], A.c)), add(C, rotX([0, 0.21 * s, 0], A.c)), 0.022, P.chrome, 8);
      for (const k of [0, 1]) S.cyl(scl((p) => add(rotX(rotY(add(p, [0, 0.09, 0]), A.s), A.c + k * Math.PI), C), s), 0.05, 0.1, P.red, 12, { r2: 0.09, stripes: P.redDark, gloss: 0.3 });
    }
    // side gears, one on each half-shaft
    if (o.sides > 0) for (const sd of [-1, 1]) S.cyl(scl((p) => add(rotX((sd > 0 ? AX : AXn)(add(p, [0, 0.1, 0])), sd > 0 ? A.R : A.L), C), o.sides), 0.07, 0.11, P.blue, 14, { r2: 0.13, stripes: shade(P.blue, 0.8), gloss: 0.3 });
    // limited-slip clutch packs behind each side gear
    if (o.clutch != null) for (const sd of [-1, 1]) { const off = mul(o.clutch, sd); for (let i = 0; i < 5; i++) { const x0 = 0.212 + i * 0.013; const glow = o.clutchGlow || 0; S.cyl((p) => add(add(rotX(sd > 0 ? AX(p) : AXn(p), A.c), [sd * x0, Cy, 0]), off), 0.15, 0.008, i % 2 ? lerpC(P.orange, [255, 200, 120], glow) : P.chrome, 14); } }
    // ice under the left wheel
    if (o.ice) S.box((p) => add(p, add([-1.13, Cy - 0.36, 0], o.ice)), 0.24, 0.05, 0.38, [196, 232, 255], { alpha: 0.7, gloss: 0.6, bevel: 0.2 });
  };
  const lerpC = (a, b, u) => a.map((v, i) => v + (b[i] - v) * H.clamp(u));
  // power flow: driveshaft -> pinion -> around the ring gear -> through the carrier -> out along a half-shaft
  const ringArc = []; for (let i = 0; i <= 6; i++) { const th = (i / 6) * (Math.PI / 2); ringArc.push([0.31, Cy + Math.sin(th) * 0.42, Math.cos(th) * 0.42]); }
  const powerPath = (sd) => [[0.18, Cy + 0.075, 1.5], [0.18, Cy + 0.075, 0.5], ...ringArc, [0.1, Cy + 0.12, 0], [0, Cy + 0.06, 0], [sd * 1.0, Cy + 0.06, 0]];
  // wheel-speed arrows (green, pointing the way the car travels: +z)
  const speedArrow = (S, sd, len, u) => { if (u <= 0.01 || len <= 0.02) return; S.arrow([sd * 1.13, Cy + 0.42, -0.25], [sd * 1.13, Cy + 0.42, -0.25 + len * u], P.green, { w: 0.13, th: 0.04, noShadow: true }); };

  // ---------- the corner road at sunset ----------
  const R = 3.5, LAPP = 3, ARC = R * Math.PI / 2;
  const path = (s) => {
    if (s < LAPP) return { p: [R, 0, LAPP - s], d: [0, 0, -1] };
    if (s < LAPP + ARC) { const ph = -(s - LAPP) / R; return { p: [R * Math.cos(ph), 0, R * Math.sin(ph)], d: [Math.sin(ph), 0, -Math.cos(ph)] }; }
    const u = s - LAPP - ARC; return { p: [-u, 0, -R], d: [-1, 0, 0] };
  };
  const arcPts = (r, ph1, n = 18) => { const o = []; for (let i = 0; i <= n; i++) { const ph = (i / n) * ph1; o.push([r * Math.cos(ph), 0.03, r * Math.sin(ph)]); } return o; };
  const cornerRoad = (S) => {
    S.quad([[-40, 0, -40], [40, 0, -40], [40, 0, 30], [-40, 0, 30]], P.grass, { bg: true });
    const n = 24, r0 = R - 1.0, r1 = R + 1.0, a0 = 0, a1 = -Math.PI / 2;
    for (let i = 0; i < n; i++) { const a = a0 + ((a1 - a0) * i) / n, b = a0 + ((a1 - a0) * (i + 1)) / n; S.quad([[r0 * Math.cos(a), 0.002, r0 * Math.sin(a)], [r1 * Math.cos(a), 0.002, r1 * Math.sin(a)], [r1 * Math.cos(b), 0.002, r1 * Math.sin(b)], [r0 * Math.cos(b), 0.002, r0 * Math.sin(b)]], P.asphalt, { bg: true }); }
    S.quad([[r0, 0.002, 0], [r1, 0.002, 0], [r1, 0.002, 14], [r0, 0.002, 14]], P.asphalt, { bg: true });
    S.quad([[0, 0.002, -r0], [0, 0.002, -r1], [-30, 0.002, -r1], [-30, 0.002, -r0]], P.asphalt, { bg: true });
    // white edge lines and orange centre dashes
    const edge = (r) => { for (let i = 0; i < n; i++) { const a = (a1 * i) / n, b = (a1 * (i + 1)) / n, w = 0.04; S.quad([[(r - w) * Math.cos(a), 0.004, (r - w) * Math.sin(a)], [(r + w) * Math.cos(a), 0.004, (r + w) * Math.sin(a)], [(r + w) * Math.cos(b), 0.004, (r + w) * Math.sin(b)], [(r - w) * Math.cos(b), 0.004, (r - w) * Math.sin(b)]], P.white, { bg: true, flat: true }); } };
    edge(r0 + 0.12); edge(r1 - 0.12);
    for (const x of [r0 + 0.12, r1 - 0.12]) S.quad([[x - 0.04, 0.004, 0], [x + 0.04, 0.004, 0], [x + 0.04, 0.004, 14], [x - 0.04, 0.004, 14]], P.white, { bg: true, flat: true });
    for (const z of [-(r0 + 0.12), -(r1 - 0.12)]) S.quad([[0, 0.004, z - 0.04], [0, 0.004, z + 0.04], [-30, 0.004, z + 0.04], [-30, 0.004, z - 0.04]], P.white, { bg: true, flat: true });
    for (let a = -0.08; a > a1; a -= 0.2) { const b = a - 0.09, w = 0.05; S.quad([[(R - w) * Math.cos(a), 0.005, (R - w) * Math.sin(a)], [(R + w) * Math.cos(a), 0.005, (R + w) * Math.sin(a)], [(R + w) * Math.cos(b), 0.005, (R + w) * Math.sin(b)], [(R - w) * Math.cos(b), 0.005, (R - w) * Math.sin(b)]], P.stripe, { bg: true, flat: true }); }
    for (let z = 0.4; z < 14; z += 0.7) S.quad([[R - 0.05, 0.005, z], [R + 0.05, 0.005, z], [R + 0.05, 0.005, z + 0.32], [R - 0.05, 0.005, z + 0.32]], P.stripe, { bg: true, flat: true });
    for (let x = -0.4; x > -30; x -= 0.7) S.quad([[x, 0.005, -R - 0.05], [x, 0.005, -R + 0.05], [x - 0.32, 0.005, -R + 0.05], [x - 0.32, 0.005, -R - 0.05]], P.stripe, { bg: true, flat: true });
    // hills far away, trees around the corner (none on the road)
    const hr = H.rng(9); for (let i = 0; i < 7; i++) S.ico([-26 + i * 9 + hr.range(-3, 3), -2, -24 - hr.range(0, 8)], [7 + hr.range(0, 4), 5 + hr.range(0, 3), 6], i % 2 ? [92, 140, 74] : [80, 128, 66], { sub: 0, jit: 0.15, seed: i, noShadow: true });
    const tr = H.rng(31);
    for (let i = 0; i < 14; i++) { const ph = 0.6 - (i / 13) * 2.5 + tr.range(-0.08, 0.08), r = 5.4 + tr.range(0, 2.5), tx = r * Math.cos(ph), tz = r * Math.sin(ph), sz = 0.9 + tr.range(0, 0.5); if (tx > 4.2 && tz > 0.8) continue; tree(S, tx, tz, sz, i); }
    for (const [x, z, s] of [[1.1, -0.9, 0.9], [1.7, -1.6, 0.75], [0.6, -1.8, 0.8], [-1.2, 0.6, 1.0], [0.4, 1.6, 0.9], [-2.6, -0.8, 1.1], [1.4, 3.0, 0.85], [-1.0, 3.2, 1.0], [6.0, -1.2, 1.1], [6.6, -2.8, 1.3]]) tree(S, x, z, s, Math.round(x * 10 + z * 3));
  };
  const corner = (S, s, o = {}) => {
    cornerRoad(S);
    const { p, d } = path(s), yaw = Math.atan2(-d[2], d[0]);
    car(S, p[0], p[2], yaw, { col: [236, 92, 70], spin: -s / 0.2 });
    if (o.trails) { // wheel tracks through the arc: inside (teal) and outside (orange)
      const done = H.clamp((s - LAPP) / ARC), ph1 = -done * Math.PI / 2;
      if (done > 0.005) {
        S.beads(arcPts(R - 0.42, ph1), P.teal, 0, { spacing: 0.16, r: 0.04 * (1 + 0.6 * (o.inEm || 0)) });
        S.beads(arcPts(R + 0.42, ph1), P.orange, 0, { spacing: 0.16, r: 0.04 * (1 + 0.6 * (o.outEm || 0)) });
      }
    }
  };

  // ---------- the explainer ----------
  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), A = ANG(t);
    if (sh.name === 'corner') {
      const tc = V('hook', 'corner'), tf = V('distance', 'farther'), v = ARC / Math.max(1.5, tf - tc), s = LAPP + v * (t - tc);
      const t9 = V('distance', 'ninety-degree') - 0.3;
      const [E, TG] = t < t9 ? dolly(t, 0, t9, [7.2, 1.7, 5.2], [3.3, 0.5, 0.2], [6.0, 3.6, 3.6], [2.4, 0.2, -1.2]) : dolly(t, t9, sh.t1, [6.0, 3.6, 3.6], [2.4, 0.2, -1.2], [2.3, 9.4, 2.6], [1.9, 0, -1.25]);
      const S = Scene(E, TG, W, H_);
      corner(S, s, { trails: true, outEm: ramp(t, V('distance', 'outside') - 0.1, 0.3), inEm: ramp(t, V('distance', 'inside') - 0.1, 0.3) * (1 - ramp(t, sh.t1 - 0.6, 0.4)) });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: Math.hypot(...sub(TG, E)), dofGap: 6 });
      flash = 0.1 * Math.exp(-Math.pow((t - V('distance', 'farther')) * 6, 2));
    } else if (sh.name === 'locked') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, C, 4.4, 3.8, 0.95, 0.75, -0.95, -0.45, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const split = ramp(t, V('fix', 'fix') - 0.1, 0.4), hf = flyIn(t, V('fix', 'box') + 0.05, 0.45, [0, 2.6, 0]);
      rig(S, t, A, { solid: 1 - split, housing: hf || undefined, axleGlow: 0 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
      const wr = S.proj([1.13, Cy - 0.3, 0]), cen = S.proj(C);
      const sk = H.clamp((t - V('locked', 'scrub') + 0.1) / 1.2);
      if (sk > 0 && t < V('fix', 'fix')) { FX.sparks(ctx, wr[0], wr[1], H.clamp((t - V('locked', 'skid')) / 0.6), 7); FX.no(ctx, wr[0], wr[1] - 70, 46, ramp(t, V('locked', 'skid') - 0.1, 0.25)); smoke(ctx, wr[0], wr[1], sk, t); }
      FX.sparks(ctx, cen[0], cen[1], H.clamp((t - V('fix', 'fix')) / 0.5), 11);
      FX.sparks(ctx, cen[0], cen[1], H.clamp((t - V('fix', 'differential')) / 0.6), 12);
      flash = 0.12 * Math.exp(-Math.pow((t - V('fix', 'differential')) * 5, 2));
    } else if (sh.name === 'drive') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, C, 3.7, 3.2, 0.85, 0.7, -1.15, -0.6, [0.05, 0.42, 0.3]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      const gl = ramp(t, sh.t0, 0.7);
      const dr = flyIn(t, V('pinion', 'driveshaft'), 0.5, [0, 0, 1.6]), pin = popU(t, V('pinion', 'pinion') - 0.1, 0.35), rg = flyIn(t, V('ring', 'ring'), 0.5, [0.9, 0.3, 0]);
      rig(S, t, A, { housing: [0, 0, 0], glass: gl, drive: dr || undefined, pinion: pin, ring: rg || undefined });
      const pw = ramp(t, V('ring', 'power') - 0.1, 1.2);
      if (pw > 0) for (const sd of [-1, 1]) S.beads(powerPath(sd), P.orange, (t - V('ring', 'power')) * 0.8, { reveal: pw, spacing: 0.085, r: 0.022 });
      const nu = popU(t, V('ring', 'ninety') - 0.1, 0.35);
      if (nu > 0) { S.arrow([0.18, Cy + 0.28, 1.45], [0.18, Cy + 0.28, 1.45 - 0.75 * nu], P.yellow, { side: [0, 1, 0], w: 0.12, th: 0.04, noShadow: true }); for (const sd of [-1, 1]) S.arrow([sd * 0.55, Cy + 0.3, 0], [sd * (0.55 + 0.45 * nu), Cy + 0.3, 0], P.yellow, { side: [0, 1, 0], w: 0.12, th: 0.04, noShadow: true }); }
      const gu = popU(t, V('ring', 'torque') - 0.1, 0.35);
      if (gu > 0) gauge(S, [-0.75, Cy + 0.95, 0.3], 0.75 * gu, 0.15 + 0.7 * ramp(t, V('ring', 'torque'), 0.9), -0.85);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.7 });
      const pp = S.proj([0.18, Cy, 0.43]), rp = S.proj([0.31, Cy, 0]);
      FX.spin(ctx, pp[0], pp[1], 34, ramp(t, V('pinion', 'pinion'), 0.5) * (1 - ramp(t, V('ring', 'ring') - 0.3, 0.3)), -t * 9);
      const slo = ramp(t, V('ring', 'slowing') - 0.1, 0.4) * (1 - ramp(t, V('ring', 'torque') - 0.1, 0.3));
      FX.spin(ctx, pp[0], pp[1], 30, slo, -t * 12); FX.spin(ctx, rp[0], rp[1], 120, slo, -t * 3.5);
    } else if (sh.name === 'carrier') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, C, 2.4, 2.1, 0.6, 0.5, -1.0, -0.5, [0.02, 0.34, 0]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      const cr = flyIn(t, V('carrier', 'carrier'), 0.5, [0, 1.4, 0]), sp = popU(t, V('carrier', 'spider') - 0.1, 0.35), sd = popU(t, V('carrier', 'side') - 0.1, 0.35);
      const ag = Math.exp(-Math.pow((t - V('carrier', 'axle') - 0.35) * 2.2, 2));
      rig(S, t, A, { housing: [0, 0, 0], glass: 1, hfade: ramp(t, sh.t0, 0.8), drive: [0, 0, 0], pinion: 1, ring: [0, 0, 0], carrier: cr || undefined, spiders: sp, sides: sd, axleGlow: ag });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.7 });
    } else if (sh.name === 'straight') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, C, 4.6, 4.2, 1.3, 1.1, -0.85, -0.45, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      rig(S, t, A, { housing: [0, 0, 0], glass: 1, hfade: 1, drive: [0, 0, 0], pinion: 1, ring: [0, 0, 0], carrier: [0, 0, 0], spiders: 1, sides: 1 });
      const ar = popU(t, V('straight', 'same') - 0.1, 0.35);
      speedArrow(S, -1, 0.6 * sL(t) / SC, ar); speedArrow(S, 1, 0.6 * sR(t) / SC, ar);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.5 });
      const spp = S.proj(add(C, rotX([0, 0.15, 0], A.c))), cp = S.proj(C);
      FX.no(ctx, spp[0], spp[1], 30, ramp(t, V('straight', "don't") - 0.1, 0.25) * (1 - ramp(t, V('straight', 'whole') - 0.2, 0.2)));
      FX.spin(ctx, cp[0], cp[1], 78, ramp(t, V('straight', 'whole') - 0.1, 0.6) * (1 - ramp(t, V('straight', 'both') - 0.1, 0.3)), -t * 5);
      FX.spin(ctx, cp[0], cp[1], 46, ramp(t, V('turn', 'rotate') - 0.1, 0.6), -t * 6, '#ffd24a');
    } else if (sh.name === 'ice') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, C, 4.3, 4.0, 1.0, 0.9, -1.2, -0.75, [-0.1, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const ice = flyIn(t, V('catch', 'ice'), 0.45, [-1.2, 0, 0]);
      rig(S, t, A, { housing: [0, 0, 0], glass: 1, hfade: 1, drive: [0, 0, 0], pinion: 1, ring: [0, 0, 0], carrier: [0, 0, 0], spiders: 1, sides: 1, ice: ice || undefined });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.4 });
      const lw = S.proj([-1.13, Cy, 0]), rw = S.proj([1.13, Cy, 0]);
      const eq = ramp(t, V('catch', 'equal') - 0.1, 0.5) * (1 - ramp(t, V('catch', 'put') - 0.2, 0.3));
      FX.spin(ctx, lw[0], lw[1], 70, eq, -0.5, '#ffd24a'); FX.spin(ctx, rw[0], rw[1], 70, eq, -0.5, '#ffd24a');
      const sp = ramp(t, V('catch', 'spins') - 0.15, 0.4);
      FX.spin(ctx, lw[0], lw[1], 82, sp, -t * 11); FX.no(ctx, rw[0], rw[1], 44, sp);
    } else if (sh.name === 'lsd') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, C, 2.9, 4.0, 0.75, 1.0, -0.55, -0.95, [0, 0.42, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const cl = flyIn(t, V('lsd', 'limited-slip'), 0.5, [0.7, 0, 0]);
      const cg = ramp(t, V('lsd', 'clutches') - 0.1, 0.3) * (1 - ramp(t, V('lsd', 'send') - 0.1, 0.5));
      rig(S, t, A, { housing: [0, 0, 0], glass: 1, hfade: 1, drive: [0, 0, 0], pinion: 1, ring: [0, 0, 0], carrier: [0, 0, 0], spiders: 1, sides: 1, ice: [0, 0, 0], clutch: cl || undefined, clutchGlow: cg });
      const pw = ramp(t, V('lsd', 'power') - 0.15, 0.9);
      if (pw > 0) { S.beads(powerPath(1), P.orange, (t - V('lsd', 'power')) * 0.9, { reveal: pw, spacing: 0.06, r: 0.026 }); S.beads(powerPath(-1), P.orange, (t - V('lsd', 'power')) * 0.9, { reveal: pw, spacing: 0.2, r: 0.018 }); }
      speedArrow(S, 1, 0.75, popU(t, V('lsd', 'grip') - 0.1, 0.35));
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
    } else { // finale: back on the corner, the car flows through it
      const s = LAPP - 2.2 + 2.0 * (t - sh.t0);
      const [E, TG] = dolly(t, sh.t0, sh.t1, [7.6, 3.6, 4.8], [2.2, 0.2, -0.6], [6.4, 4.4, 2.6], [1.4, 0, -1.6]);
      const S = Scene(E, TG, W, H_);
      corner(S, s, {});
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: Math.hypot(...sub(TG, E)), dofGap: 6 });
      FX.confetti(ctx, W, H_, ramp(t, V('finale', 'glides'), 2.2), t);
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  // tyre smoke: soft grey puffs rising from the contact patch
  const smoke = (ctx, x, y, u, t) => { const r = H.rng(5); ctx.save(); for (let i = 0; i < 9; i++) { const k = (u * 1.6 + r() * 0.6) % 1, px = x + r.range(-40, 40) + k * r.range(-30, 30), py = y - k * 120, rad = 14 + k * 34; ctx.fillStyle = `rgba(235,232,228,${0.45 * (1 - k) * Math.min(1, u * 4)})`; ctx.beginPath(); ctx.arc(px, py, rad, 0, TAU); ctx.fill(); } ctx.restore(); };

  // ---------- sound: a quiet workshop ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const hum = (t0, t1, g = 0.07) => k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 320, gain: g, a: 0.4, minor: true });
    // corner: tyres on asphalt
    k.noise(0.05, { dur: ST('locked') - 0.1, color: 'brown', filter: 'lowpass', f: 420, gain: 0.1, a: 0.5, minor: true });
    k.play('ding', V('distance', 'farther'), { f: 'E6', gain: 0.3 });
    // cuts
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    hum(ST('locked'), ST('finale'));
    // locked axle: squeal + skid
    k.noise(V('locked', 'scrub') - 0.05, { dur: 1.1, filter: 'bandpass', f: [[0, 2900], [1.1, 2300]], q: 6, gain: 0.07, a: 0.05 });
    k.play('thud', V('locked', 'skid') + 0.15, { f: 90, gain: 0.3 });
    clunk(V('fix', 'fix'), 0.8); clunk(V('fix', 'box') + 0.05, 1.3);
    k.play('ding', V('fix', 'differential'), { f: 'C6', gain: 0.35 }); k.play('sparkle', V('fix', 'differential') + 0.1, { gain: 0.3, n: 4 });
    // building the drivetrain
    clunk(V('pinion', 'driveshaft'), 1, 0.3); clunk(V('pinion', 'pinion'), 0.8, 0.2); clunk(V('ring', 'ring'), 1.2, 0.3);
    k.noise(V('ring', 'power'), { dur: 2.0, color: 'pink', filter: 'bandpass', f: [[0, 500], [2, 1200]], q: 0.8, gain: 0.06, a: 0.4, minor: true });
    for (let i = 0; i < 10; i++) k.play('count', V('ring', 'torque') + i * 0.08, { gain: 0.45, f: 3000 + i * 120, minor: true });
    clunk(V('carrier', 'carrier'), 1.2, -0.2); clunk(V('carrier', 'spider'), 0.7); clunk(V('carrier', 'side'), 0.8);
    k.play('ding', V('carrier', 'axle') + 0.2, { f: 'G5', gain: 0.25, minor: true });
    // straight / turn
    k.play('pop', V('straight', 'same'), { gain: 0.3, minor: true });
    k.noise(V('turn', 'rotate'), { dur: 1.2, filter: 'bandpass', f: [[0, 700], [1.2, 1100]], q: 2, gain: 0.05, a: 0.3, minor: true });
    // the catch: ice, a wheel spinning free
    k.play('buzz', V('catch', 'catch'), { gain: 0.25 });
    clunk(V('catch', 'ice'), 0.6, -0.4);
    k.noise(V('catch', 'spins') - 0.1, { dur: 1.6, filter: 'bandpass', f: [[0, 1800], [1.6, 2600]], q: 3, gain: 0.07, a: 0.2, pan: -0.4 });
    // limited slip
    clunk(V('lsd', 'limited-slip'), 1.1); clunk(V('lsd', 'limited-slip') + 0.12, 0.8);
    k.play('pop', V('lsd', 'grip'), { gain: 0.35 });
    // finale
    k.noise(ST('finale'), { dur: DURATION - ST('finale'), color: 'brown', filter: 'lowpass', f: 450, gain: 0.1, a: 0.4, minor: true });
    k.play('success', V('finale', 'corner'), { f: 'C6', gain: 0.55 }); k.play('sparkle', V('finale', 'corner') + 0.3, { gain: 0.45, n: 6 });
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
