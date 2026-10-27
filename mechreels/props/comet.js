  // ==================== de Havilland Comet props (video 002 and Shorts 05-07) ====================
  // A low-poly Comet 1 (generic white/blue livery, no logos) that can break apart, a skin panel that shows stress flowing
  // around a window (square .. round corners, hot spots, a fatigue crack), a pressurised cabin section that swells, a
  // fatigue rig (a strip bent back and forth until it snaps) and the Farnborough water tank. Needs gimli.js (jetT, slab).
  const CM = { body: [240, 240, 244], belly: [204, 208, 216], blue: [44, 74, 150], win: [34, 42, 60], wing: [214, 218, 226] };
  // a window outline: k = 0 sharp square corners .. 1 fully round
  const winPath = (c, x, y, w, h, k) => { const r = (Math.min(w, h) / 2) * Math.max(0.03, Math.min(1, k)); c.beginPath(); c.moveTo(x - w / 2 + r, y - h / 2); c.arcTo(x + w / 2, y - h / 2, x + w / 2, y + h / 2, r); c.arcTo(x + w / 2, y + h / 2, x - w / 2, y + h / 2, r); c.arcTo(x - w / 2, y + h / 2, x - w / 2, y - h / 2, r); c.arcTo(x - w / 2, y - h / 2, x + w / 2, y - h / 2, r); c.closePath(); };
  // a jagged crack from (x, y) heading up-right, grown to u
  const crackLine = (c, x, y, len, u, seed = 3, ang = -0.7) => { if (u <= 0) return; const r = H.rng(seed), n = 9, pts = [[x, y]]; let a = ang; for (let i = 1; i <= n; i++) { a += r.range(-0.5, 0.5); const p = pts[i - 1]; pts.push([p[0] + Math.cos(a) * len / n, p[1] + Math.sin(a) * len / n]); } const m = Math.max(1, Math.round(n * u)); c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; for (const [lw, col] of [[7, 'rgba(255,90,60,0.55)'], [3.2, '#1a1418']]) { c.lineWidth = lw; c.strokeStyle = col; c.beginPath(); for (let i = 0; i <= m; i++) i ? c.lineTo(pts[i][0], pts[i][1]) : c.moveTo(pts[i][0], pts[i][1]); c.stroke(); } c.restore(); };
  // the skin panel's face: brushed aluminium, rivets, stress lines bending round the window, hot spots, crack
  // o: k (corner roundness), flow (0..1 stress lines), t (time, moves the dashes), hot (0..1 hot spots), crack (0..1), win [w, h] (fractions)
  const skinPaint = (o) => (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#d6dae2'); g.addColorStop(0.5, '#c4c9d2'); g.addColorStop(1, '#d0d4dc'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(80,86,100,0.55)'; for (let x = 14; x < w; x += 26) { c.beginPath(); c.arc(x, 10, 2.4, 0, TAU); c.arc(x, h - 10, 2.4, 0, TAU); c.fill(); }
    const k = o.k ?? 0, cx = w / 2, cy = h / 2, ww = w * (o.win ? o.win[0] : 0.34), wh = h * (o.win ? o.win[1] : 0.42);
    if (o.flow > 0) { // horizontal load lines that crowd and bend around the opening
      c.save(); c.globalAlpha = Math.min(1, o.flow); c.setLineDash([14, 10]); c.lineDashOffset = -(o.t || 0) * 50; c.lineWidth = 3; c.strokeStyle = '#4aa8e8';
      const n = 11;
      for (let i = 0; i < n; i++) {
        const y0 = h * (0.1 + 0.8 * (i / (n - 1))), dy = y0 - cy, inside = Math.abs(dy) < wh / 2 + 6; if (!inside && Math.abs(dy) > wh * 0.95) { c.beginPath(); c.moveTo(0, y0); c.lineTo(w, y0); c.stroke(); continue; }
        const edge = (dy < 0 ? -1 : 1) * (wh / 2 + 8 + Math.abs(dy) * 0.25);
        c.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const ax = Math.abs(x - cx) / (ww / 2), bump = k > 0.5 ? (ax < 1.6 ? 0.5 + 0.5 * Math.cos(Math.PI * Math.min(1, ax / 1.6)) : 0) : (ax < 1 ? 1 : ax < 1.35 ? 1 - (ax - 1) / 0.35 : 0);
          const yy = y0 + (cy + edge - y0) * bump * (Math.abs(dy) < wh / 2 + 6 ? 1 : 1 - (Math.abs(dy) - wh / 2) / (wh * 0.45));
          x ? c.lineTo(x, yy) : c.moveTo(x, yy);
        }
        c.stroke();
      }
      c.restore();
    }
    // the window: dark glass with a light frame
    winPath(c, cx, cy, ww + 14, wh + 14, k); c.fillStyle = '#e8ebf0'; c.fill();
    winPath(c, cx, cy, ww, wh, k); const gg = c.createLinearGradient(0, cy - wh / 2, 0, cy + wh / 2); gg.addColorStop(0, '#6aa0d8'); gg.addColorStop(1, '#2a4a78'); c.fillStyle = gg; c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - ww * 0.25, cy - wh * 0.3); c.lineTo(cx + ww * 0.05, cy - wh * 0.38); c.stroke();
    if (o.hot > 0) { // where the stress piles up: corners when square, top and bottom when round
      const pulse = 0.8 + 0.2 * Math.sin((o.t || 0) * 7), spots = k > 0.5 ? [[cx, cy - wh / 2 - 7, 0.45], [cx, cy + wh / 2 + 7, 0.45]] : [[cx - ww / 2, cy - wh / 2, 1], [cx + ww / 2, cy - wh / 2, 1], [cx - ww / 2, cy + wh / 2, 1], [cx + ww / 2, cy + wh / 2, 1]];
      for (const [x, y, s] of spots) { const R = 46 * s * pulse, rg = c.createRadialGradient(x, y, 0, x, y, R); rg.addColorStop(0, `rgba(255,${k > 0.5 ? 170 : 60},40,${0.95 * o.hot})`); rg.addColorStop(1, 'rgba(255,60,40,0)'); c.fillStyle = rg; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill(); }
    }
    if (o.crack > 0) crackLine(c, cx + ww / 2 + 2, cy - wh / 2 - 2, Math.min(w, h) * 0.55, o.crack, o.seed || 3);
  };
  // a flat skin panel standing on the red stand. c = the panel centre; size [w, h] half-extents
  const skinPanel = (S, c, o = {}) => {
    const [w, h] = o.size || [0.5, 0.36], yaw = o.yaw || 0;
    S.box((p) => add(rotY(p, yaw), c), w, h, 0.012, [196, 200, 210], { bevel: 0.3, paint: skinPaint(o), gloss: 0.3 });
    S.rod(add(c, rotY([0, -h, -0.03], yaw)), [c[0], 0.8, c[2]], 0.03, P.dark, 8);
    if (o.stand !== false) stand(S, [c[0], 0, c[2]], 0.5, 0.35, 0.8);
  };
  // a window as a small flat plate (used on the cabin section and the jets)
  const winPlate = (S, pos, n, wsz, k, o = {}) => { const nrm = norm(n), yaw = Math.atan2(nrm[0], nrm[2]), pitch = -Math.asin(Math.max(-1, Math.min(1, nrm[1]))); S.box((q) => add(rotY(rotX(q, pitch), yaw), pos), wsz[0], wsz[1], 0.004, CM.body, { bevel: 0, noShadow: true, paint: skinPaint({ k, win: [0.62, 0.62], crack: o.crack || 0, hot: o.hot || 0, t: o.t, seed: o.seed }) }); };
  // a pressurised cabin section along x: radius r swelled by `swell`, windows on the +z side (corner roundness k),
  // press (0..1) grows yellow arrows pushing out, air (0..1) streams light-blue beads in, straps adds crack-stopper bands
  const cabin = (S, c, o = {}) => {
    const L = o.len ?? 1.6, R = (o.r ?? 0.42) * (1 + (o.swell || 0)), AX = (q) => rotZ(q, -Math.PI / 2), al = o.glass ? 1 - 0.75 * o.glass : undefined;
    // long cabins are built from short segments, so a camera beside them doesn't lose faces that reach behind it
    const nseg = L > 3 ? Math.ceil(L / 0.9) : 1, sl = L / nseg;
    for (let i = 0; i < nseg; i++) { S.cyl((q) => add(AX(q), add(c, [-L / 2 + i * sl, 0, 0])), R, sl, o.col || CM.body, 20, { alpha: al, gloss: 0.3, cap: [190, 194, 204], caps: nseg === 1 }); S.box((q) => add(q, add(c, [-L / 2 + (i + 0.5) * sl, -R * 0.34, R * 0.93])), sl / 2 - 0.01, 0.012, 0.012, CM.blue, { bevel: 0, noShadow: true, alpha: al }); }
    const nw = o.nwin ?? 4, ws = o.wsz || [R * 0.17, R * 0.2];
    for (let i = 0; i < nw; i++) { const x = -L / 2 + (L * (i + 0.5)) / nw, a = 0.32; winPlate(S, add(c, [x, R * Math.sin(a) * 1.004, R * Math.cos(a) * 1.004]), [0, Math.sin(a), Math.cos(a)], ws, o.k ?? 1, { crack: i === (o.crackAt ?? -1) ? o.crack : 0, hot: o.hot, t: o.t, seed: 5 + i }); }
    if (o.straps) for (let i = 1; i < 4; i++) S.cyl((q) => add(AX(q), add(c, [-L / 2 + (L * i) / 4 - 0.02, 0, 0])), R * 1.012, 0.04, [150, 156, 170], 20, { caps: false, alpha: al });
    if (o.press > 0) for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + 0.3, d = [0, Math.sin(a), Math.cos(a)], x = (i % 2 ? 0.25 : -0.25) * L; S.arrow(add(c, add([x, 0, 0], mul(d, R * 0.35))), add(c, add([x, 0, 0], mul(d, R * (0.35 + 0.9 * o.press)))), P.yellow, { side: [1, 0, 0], w: 0.08, th: 0.025, noShadow: true }); }
    if (o.air > 0) { const pipe = [add(c, [L / 2 + 0.6, -R - 0.25, 0]), add(c, [L / 2 + 0.25, -R - 0.25, 0]), add(c, [L / 2 + 0.25, 0, 0]), add(c, [L / 2 - 0.3, 0, 0])]; S.tube(pipe.slice(0, 3), 0.03, [70, 72, 82], 8); S.beads(pipe, P.air, (o.t || 0) * 0.8, { reveal: o.air, spacing: 0.08, r: 0.026 }); }
  };
  // a steel strip clamped in a vice, bent by `bend` (radians); crack (0..1) glows at the root; snap (0..1) throws the top off
  const fatigueRig = (S, c, bend, crack, snap = 0) => {
    S.box((q) => add(q, add(c, [0, 0.06, 0])), 0.22, 0.06, 0.16, [70, 90, 150], { bevel: 0.2 });
    S.box((q) => add(q, add(c, [0, 0.16, 0.06])), 0.14, 0.05, 0.03, P.dark, { bevel: 0.2 }); S.box((q) => add(q, add(c, [0, 0.16, -0.06])), 0.14, 0.05, 0.03, P.dark, { bevel: 0.2 });
    const root = add(c, [0, 0.2, 0]), hL = 0.5, a = snap > 0 ? bend * (1 - snap) : bend;
    if (snap <= 0) S.box((q) => add(rotZ(add(q, [0, hL / 2, 0]), a), root), 0.06, hL / 2, 0.012, P.chrome, { bevel: 0.1, gloss: 0.5 });
    else { S.box((q) => add(q, add(root, [0, 0.03, 0])), 0.06, 0.03, 0.012, P.chrome, { bevel: 0.1 }); const off = [0.5 * snap, 0.25 * snap - 1.2 * snap * snap, 0]; S.box((q) => add(rotZ(add(q, [0, hL / 2, 0]), bend + 2.2 * snap), add(root, add([0, 0.06, 0], off))), 0.06, hL / 2 - 0.03, 0.012, P.chrome, { bevel: 0.1, gloss: 0.5 }); }
    if (crack > 0.02) S.ico(add(root, [0, 0.02, 0.02]), 0.03 + 0.05 * crack, [255, 110 - 40 * crack, 50], { sub: 0, glow: true, noShadow: true });
    stand(S, [c[0], 0, c[2]], 0.45, 0.35, c[1] - 0.02);
  };
  // the water tank: a glass tank with water, a cabin section inside, a pressure gauge and the pump line
  const waterTank = (S, c, t, o = {}) => {
    const w = 1.25, h = 0.62, d = 0.72, lv = o.water ?? 1;
    if (lv > 0.02) S.box((q) => add(q, add(c, [0, -h + lv * h, 0])), w - 0.02, lv * h - 0.01, d - 0.02, [90, 160, 220], { alpha: 0.3, bevel: 0.02, gloss: 0.6 });
    cabin(S, add(c, [0, -0.04, 0]), { len: 1.9, r: 0.36, swell: o.swell || 0, k: o.k ?? 0.15, nwin: 5, crackAt: 2, crack: o.crack || 0, hot: o.hot || 0, t, press: o.press || 0 });
    S.box((q) => add(q, c), w, h, d, P.glass, { alpha: 0.16, bevel: 0.02, gloss: 0.6 });
    S.box((q) => add(q, add(c, [0, -h - 0.04, 0])), w + 0.05, 0.04, d + 0.05, P.dark, { bevel: 0.2 });
    gauge(S, add(c, [w + 0.12, 0.3, 0.3]), 0.55, o.gauge ?? 0.2, -0.6);
    const line = [add(c, [w + 0.7, -h, -0.3]), add(c, [w + 0.3, -h, -0.3]), add(c, [w + 0.3, 0.1, -0.3]), add(c, [w - 0.2, 0.1, -0.3])];
    S.tube(line.slice(0, 3), 0.035, [70, 72, 82], 8); if (o.flow > 0) S.beads(line, P.teal, t * (o.fast ? 2.4 : 0.8), { reveal: o.flow, spacing: 0.09, r: 0.03 });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) S.rod(add(c, [sx * (w - 0.1), -h - 0.08, sz * (d - 0.1)]), [c[0] + sx * (w - 0.1), 0, c[2] + sz * (d - 0.1)], 0.04, P.red, 8);
  };

  // ---------- the Comet ----------
  // o: s, roll, pitch, yaw (as jetT), brk (0..1 the forward fuselage tears away), k (window corner roundness),
  // adf (0..1 highlights the small roof window), gear (0..1), glass, burn (exhaust glow)
  const comet = (S, P0, o = {}) => {
    const T = jetT(P0, o), al = o.glass ? 1 - 0.8 * o.glass : undefined, G = { alpha: al }, AXL = (q) => rotZ(q, -Math.PI / 2), AXR = (q) => rotZ(q, Math.PI / 2);
    const SPLIT = 0.5, b = o.brk || 0, pv = [SPLIT, 0, 0];
    const F = b > 0 ? (p) => T(add(add(rotZ(sub(p, pv), -1.1 * b), pv), [0.5 * b, -0.9 * b * b - 0.15 * b, 0.25 * b])) : T; // forward piece
    const A = b > 0 ? (p) => T(add(add(rotZ(sub(p, pv), 0.35 * b), pv), [-0.2 * b, -0.5 * b * b, 0])) : T; // the rest
    // fuselage in two pieces, nose cone, tail cone
    S.cyl((q) => A(add(AXL(q), [-1.2, 0, 0])), 0.16, SPLIT + 1.2, CM.body, 14, { ...G, gloss: 0.3, caps: b > 0 });
    S.cyl((q) => F(add(AXL(q), [SPLIT, 0, 0])), 0.16, 1.2 - SPLIT, CM.body, 14, { ...G, gloss: 0.3, caps: b > 0 });
    S.cyl((q) => F(add(AXL(q), [1.2, 0, 0])), 0.16, 0.36, CM.body, 14, { ...G, r2: 0.035, gloss: 0.3 });
    S.cyl((q) => A(add(add(AXR(q), [-1.2, 0, 0]), [0, q[1] * 0.18, 0])), 0.16, 0.42, CM.body, 14, { ...G, r2: 0.03 });
    S.box((q) => F(add(rotZ(q, -0.45), [1.32, 0.07, 0])), 0.06, 0.02, 0.1, CM.win, { bevel: 0.2, noShadow: true, gloss: 0.6 });
    // window rows and the blue cheatline, split at the break
    const wk = o.k ?? 0.25, strip = (Tx, x0, x1, sd) => { const L = (x1 - x0) / 2; S.box((q) => Tx(add(sd > 0 ? q : rotY(q, Math.PI), [(x0 + x1) / 2, 0.045, sd * 0.158])), L, 0.024, 0.004, CM.win, { bevel: 0, noShadow: true, alpha: al, paint: (c, w, h) => { c.fillStyle = '#eef0f4'; c.fillRect(0, 0, w, h); c.fillStyle = '#26324a'; for (let x = 8; x < w - 10; x += 22) { winPath(c, x + 6, h / 2, 12, h * 0.62, wk); c.fill(); } } }); S.box((q) => Tx(add(sd > 0 ? q : rotY(q, Math.PI), [(x0 + x1) / 2, -0.01, sd * 0.161])), L, 0.012, 0.004, CM.blue, { bevel: 0, noShadow: true, alpha: al }); };
    for (const sd of [-1, 1]) { strip(A, -1.05, SPLIT - 0.02, sd); strip(F, SPLIT + 0.02, 1.15, sd); }
    // the small square roof window for the navigation (ADF) antenna, just ahead of the wing
    S.box((q) => F(add(q, [SPLIT + 0.08, 0.162, 0])), 0.035, 0.003, 0.03, CM.win, { bevel: 0, noShadow: true, glow: (o.adf || 0) > 0.5 });
    // wings with the engines buried in the roots: two intakes each side, exhausts at the trailing edge
    for (const sd of [-1, 1]) {
      slab(S, A, [0.42, -0.1, sd * 0.13], [-0.32, -0.1, sd * 0.13], [-0.66, -0.03, sd * 1.75], [-0.45, -0.03, sd * 1.75], [0.05, 0.01], [0.03, 0.006], CM.wing, { gloss: 0.2, alpha: al });
      for (const zz of [0.22, 0.36]) { S.box((q) => A(add(q, [0.43, -0.07, sd * zz])), 0.02, 0.035, 0.06, [40, 42, 50], { bevel: 0.3, noShadow: true }); S.cyl((q) => A(add(AXR(q), [-0.33, -0.07, sd * zz])), 0.035, 0.05, [60, 62, 70], 8, { noShadow: true }); if (o.burn > 0.02) S.ico(A([-0.4, -0.07, sd * zz]), 0.04 * o.burn, [255, 150, 60], { sub: 0, glow: true, noShadow: true }); }
      slab(S, A, [-1.3, 0.04, sd * 0.05], [-1.62, 0.07, sd * 0.05], [-1.74, 0.1, sd * 0.68], [-1.55, 0.1, sd * 0.68], [0.015, 0.006], [0.01, 0.005], CM.wing, { alpha: al });
    }
    { const fin = [[-1.15, 0.12], [-1.6, 0.14], [-1.78, 0.62], [-1.55, 0.62]], th = 0.018, A2 = fin.map(([x, y]) => A([x, y, -th])), B3 = fin.map(([x, y]) => A([x, y, th])), cc = A([-1.5, 0.4, 0]); S.face(A2.slice().reverse(), CM.blue, { c: cc, gloss: 0.2 }); S.face(B3, CM.blue, { c: cc, gloss: 0.2 }); for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; S.face([A2[i], A2[j], B3[j], B3[i]], shade(CM.blue, 0.9), { c: cc }); } }
    const g = o.gear ?? 0;
    if (g > 0.02) { for (const sd of [-1, 1]) { const top = [-0.05, -0.12, sd * 0.45], bot = lerp3([-0.05, -0.14, sd * 0.2], [-0.05, -0.42, sd * 0.45], g); S.rod(A(top), A(bot), 0.02, [150, 154, 164], 6); S.cyl((q) => A(add(rotX(q, Math.PI / 2), add(bot, [0, 0, -0.03]))), 0.055, 0.06, P.tire, 10, { cap: [120, 124, 132] }); } const nb = lerp3([0.95, -0.14, 0], [0.95, -0.42, 0], g); S.rod(F([0.95, -0.14, 0]), F(nb), 0.018, [150, 154, 164], 6); S.cyl((q) => F(add(rotX(q, Math.PI / 2), add(nb, [0, 0, -0.03]))), 0.045, 0.06, P.tire, 10, { cap: [120, 124, 132] }); }
    return { T, F, A, adf: F([SPLIT + 0.08, 0.17, 0]), brk: T([SPLIT, 0, 0]), nose: F([1.5, 0, 0]) };
  };
  // a small grass airfield with a runway along x and a low terminal
  const cmField = (S) => {
    S.quad([[-200, 0, -200], [200, 0, -200], [200, 0, 200], [-200, 0, 200]], P.grass, { bg: true });
    S.quad([[-80, 0.002, -1.6], [80, 0.002, -1.6], [80, 0.002, 1.6], [-80, 0.002, 1.6]], [92, 92, 100], { bg: true, paint: (c, w, h) => { c.fillStyle = 'rgba(255,255,255,0.8)'; for (let x = 0; x < w; x += 18) c.fillRect(x, h * 0.485, 8, h * 0.03); } });
    S.quad([[-6, 0.003, 1.6], [2, 0.003, 1.6], [2, 0.003, 5.5], [-6, 0.003, 5.5]], [120, 120, 128], { bg: true });
    S.box((q) => add(q, [-2, 0.35, 7]), 3.2, 0.35, 0.8, P.cream, { bevel: 0.05 }); S.box((q) => add(q, [-2, 0.74, 7]), 3.3, 0.04, 0.9, [150, 96, 70], { bevel: 0.2 });
    S.box((q) => add(q, [1.6, 1.0, 6.6]), 0.25, 1.0, 0.25, P.cream, { bevel: 0.1 }); S.box((q) => add(q, [1.6, 2.15, 6.6]), 0.4, 0.18, 0.4, [120, 170, 200], { alpha: 0.7, bevel: 0.1 });
    const tr = H.rng(11); for (let i = 0; i < 22; i++) tree(S, -30 + i * 3 + tr.range(-1, 1), -7 - tr.range(0, 8), 1.1 + tr.range(0, 0.7), i);
    const hr = H.rng(9); for (let i = 0; i < 6; i++) S.ico([-50 + i * 22 + hr.range(-4, 4), -3, -55 - hr.range(0, 20)], [14 + hr.range(0, 8), 7 + hr.range(0, 4), 10], i % 2 ? [92, 140, 74] : [80, 128, 66], { sub: 0, jit: 0.15, seed: i, noShadow: true });
  };
  // ---------- shared shots (video 002 and its Shorts) ----------
  // a Comet over the sea (or in a storm) that tears apart at time tb; returns the break point on screen (null once gone)
  const cometBreak = (ctx, W, H_, t, E, TG, tb, o = {}) => {
    const S = o.storm ? Scene(E, TG, W, H_) : seaScene(E, TG, W, H_, t, { island: o.island });
    if (o.storm) { landBelow(S); cloudBank(S, 0, -6, 4.0, 18, 3, 40, t * 3, [120, 112, 130]); cloudBank(S, 0, 10, 3.0, 10, 8, 40, t * 3, [110, 104, 122]); }
    const b = ramp(t, tb - 0.1, 2.6), shake = o.storm ? 0.05 * Math.sin(t * 13) * (1 - b) : 0, P0 = [0, SKY_Y - 2.2 * b * b, 0];
    let bp = null;
    if (b < 0.98) bp = comet(S, P0, { brk: b, pitch: -0.04 * b + shake, roll: shake * 0.6, burn: 1 - b }).brk;
    if (b > 0) { const r = H.rng(7); for (let i = 0; i < 9; i++) S.ico(add(P0, [0.5 + r.range(-0.6, 0.9) * b * 2, r.range(-1.2, 0.3) * b * 2, r.range(-0.8, 0.8) * b * 2]), 0.03 + r() * 0.04, CM.belly, { sub: 0, noShadow: true }); }
    S.render(ctx, W, H_, o.storm ? { bg: stormSky, dof: 0.33, shadows: false, dofGap: 30 } : skyEnv);
    if (!bp) return null;
    const p = S.proj(bp); puffs(ctx, p[0], p[1], H.clamp((t - tb) / 1.8), 4, '235,235,240', 90); FX.sparks(ctx, p[0], p[1], H.clamp((t - tb) / 0.6), 6); return p;
  };
  // flying beside a modern cabin with big round windows; hiT rings the middle window
  const roundWindows = (ctx, W, H_, t, t0, t1, hiT, o = {}) => {
    const v = o.vertical, [E, TG] = v ? dolly(t, t0, t1, [-0.9, SKY_Y + 0.2, 3.4], [-0.3, SKY_Y + 0.75, 0.6], [0.5, SKY_Y + 0.15, 3.0], [0.9, SKY_Y + 0.75, 0.6]) : dolly(t, t0, t1, [-1.6, SKY_Y + 0.45, 2.7], [-0.6, SKY_Y + 0.25, 0.6], [0.9, SKY_Y + 0.4, 2.3], [1.6, SKY_Y + 0.25, 0.6]);
    const S = skyScene(E, TG, W, H_, t);
    cabin(S, [0, SKY_Y, 0], { len: 12, r: 1.0, nwin: 14, wsz: [0.15, 0.2], k: 1, t, press: o.press || 0, swell: o.swell || 0 });
    S.render(ctx, W, H_, { ...skyEnv, focus: 2.4 });
    if (hiT != null) { const a = 0.32, wp = S.proj([-6 + (12 * 7.5) / 14, SKY_Y + Math.sin(a), Math.cos(a)]); ringHi(ctx, wp[0], wp[1], v ? 90 : 120, ramp(t, hiT - 0.1, 0.3)); }
  };
