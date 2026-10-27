  // ==================== Titanic props (video 006 and Shorts 17-19) ====================
  // A low-poly ocean liner (black hull, white superstructure, four buff funnels, lights) that can tilt bow-down and crumple
  // at the bow; an iceberg; a glass compartment model (16 compartments, 15 bulkheads that stop short, watertight doors,
  // water per compartment, spill over the tops); a riveted seam (steel vs wrought-iron rivets popping) and one big rivet with
  // slag streaks; the night-sea set. Needs gimli.js (jetT) and world.js.
  const TN = { hull: [36, 36, 42], red: [150, 50, 44], white: [236, 234, 228], buff: [214, 156, 70], deck: [190, 160, 120], ice: [230, 244, 252], water: [70, 140, 210] };
  // ---------- the liner ----------
  // P0 = waterline centre; local +x = bow; length 8 (x -4..4), beam 0.9. o: s, roll, pitch, yaw; lights (0..1 portholes lit);
  // funnels (count, default 4); crumple (0..1 bow pushed in); boats (number of lifeboats shown on deck); gash (0..1 dark slits
  // along the starboard bow below the waterline)
  const liner = (S, P0, o = {}) => {
    const T = jetT(P0, o), cr = o.crumple || 0, bowX = 4 - 0.7 * cr;
    const prof = [[-3.8, -0.45], [bowX - 0.35, -0.45], [bowX, 0.65], [-4.05, 0.65], [-4.2, 0.2]];
    const hw = (x) => (x > bowX - 1.2 ? Math.max(0.02, 0.45 * (bowX - x) / 1.2) : x < -3.3 ? 0.45 * Math.max(0.35, (x + 4.2) / 0.9) : 0.45);
    const A = prof.map(([x, y]) => T([x, y, -hw(x)])), B = prof.map(([x, y]) => T([x, y, hw(x)])), C = T([0, 0, 0]);
    S.face(A.slice().reverse(), TN.hull, { c: C }); S.face(B, TN.hull, { c: C });
    for (let i = 0; i < prof.length; i++) { const j = (i + 1) % prof.length; S.face([A[i], A[j], B[j], B[i]], i === 0 ? TN.red : i === 2 ? TN.deck : TN.hull, { c: C }); }
    // the white band, red below the waterline, portholes
    for (const sd of [-1, 1]) {
      S.box((q) => T(add(sd > 0 ? q : rotY(q, Math.PI), [-0.2, 0.52, sd * 0.452])), 3.25, 0.06, 0.003, TN.white, { bevel: 0, noShadow: true });
      S.box((q) => T(add(sd > 0 ? q : rotY(q, Math.PI), [-0.2, 0.2, sd * 0.452])), 3.25, 0.12, 0.003, TN.hull, { bevel: 0, noShadow: true, paint: (c, w, h) => { c.fillStyle = (o.lights || 0) > 0.3 ? '#ffd88a' : '#141418'; for (let r = 0; r < 2; r++) for (let x = 8; x < w - 8; x += 12) c.fillRect(x, h * (0.25 + r * 0.35), 4, h * 0.14); } });
      S.box((q) => T(add(sd > 0 ? q : rotY(q, Math.PI), [-0.2, -0.3, sd * 0.452])), 3.3, 0.15, 0.003, TN.red, { bevel: 0, noShadow: true });
    }
    if (o.gash > 0) for (let k = 0; k < 6; k++) { const x = 3.2 - k * 0.42; S.box((q) => T(add(q, [x, -0.05 - 0.04 * (k % 2), hw(x) + 0.006])), 0.13 * o.gash, 0.012, 0.004, [10, 10, 14], { bevel: 0, noShadow: true }); }
    // superstructure (white, stepped), funnels, masts
    S.box((q) => T(add(q, [-0.3, 0.82, 0])), 2.3, 0.17, 0.36, TN.white, { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = (o.lights || 0) > 0.3 ? '#ffd88a' : '#3a3e48'; for (let x = 6; x < w - 6; x += 10) c.fillRect(x, h * 0.35, 5, h * 0.3); }, sidePaint: null });
    S.box((q) => T(add(q, [-0.1, 1.03, 0])), 1.7, 0.06, 0.3, TN.white, { bevel: 0.1 });
    const nf = o.funnels ?? 4;
    for (let i = 0; i < nf; i++) { const x = nf === 4 ? 1.35 - i * 0.82 : 0.4; S.cyl((q) => T(add(rotZ(q, 0.12), [x, 1.05, 0])), 0.13, 0.62, TN.buff, 10, { cap: [40, 36, 34] }); S.cyl((q) => T(add(rotZ(q, 0.12), [x - 0.068, 1.6, 0])), 0.135, 0.1, [30, 30, 34], 10, { caps: false }); }
    for (const x of [2.9, -2.9]) S.rod(T([x, 0.65, 0]), T([x - 0.15, 2.0, 0]), 0.018, [160, 120, 80], 5);
    S.rod(T([2.75, 1.95, 0]), T([-3.05, 1.95, 0]), 0.004, [60, 60, 60], 3, { noShadow: true });
    const nb = o.boats ?? 8; for (let i = 0; i < nb; i++) { const sd = i % 2 ? 1 : -1, x = 0.9 - Math.floor(i / 2) * (2.4 / Math.max(1, Math.ceil(nb / 2))); S.box((q) => T(add(q, [x, 1.13, sd * 0.33])), 0.12, 0.03, 0.035, TN.white, { bevel: 0.3, noShadow: true }); }
    if ((o.lights || 0) > 0.3) S.ico(T([2.85, 1.7, 0]), 0.03, [255, 230, 160], { sub: 0, glow: true, noShadow: true });
    return { T, bow: T([bowX, 0.1, 0]), bowSide: T([3.0, -0.05, 0.42]), mast: T([2.75, 2.0, 0]), stern: T([-4, 0.4, 0]) };
  };
  // a low-poly iceberg (seed varies the shape); part of it sits below y = 0
  const iceberg = (S, c, s = 1, seed = 3) => { S.ico(add(c, [0, 0.6 * s, 0]), [1.1 * s, 1.0 * s, 0.9 * s], TN.ice, { sub: 1, jit: 0.35, seed, gloss: 0.3 }); S.ico(add(c, [0.5 * s, 1.2 * s, 0.2 * s]), [0.5 * s, 0.7 * s, 0.5 * s], TN.ice, { sub: 0, jit: 0.3, seed: seed + 4 }); S.ico(add(c, [0, -0.6 * s, 0]), [1.6 * s, 1.1 * s, 1.3 * s], [180, 214, 236], { sub: 0, jit: 0.3, seed: seed + 7, noShadow: true, alpha: 0.6 }); };
  // the night sea (calm, dark), with stars as the background env
  const nightSea = (S) => S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 400], [-400, 0, 400]], [26, 36, 58], { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(160,190,230,0.15)'; c.lineWidth = 1; const r = H.rng(5); for (let i = 0; i < 200; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y); c.stroke(); } } });
  const nightEnv = { bg: nightSky, dof: 0.33, shadows: false, dofGap: 10 };
  // ---------- the compartment model (garage) ----------
  // c = centre of the model's keel; along x, bow at +x; 16 compartments. o: levels (array of 16 water levels 0..1 of the hull
  // height), bh (bulkhead height as a fraction, default 0.62), walls (0..1 bulkheads appear), doors (0..1 doors closed),
  // pitch (bow down if negative), hi (array of compartment indices to tint red), spill (0..1 beads over the tops), t
  const compModel = (S, c, o = {}) => {
    const L = 2.4, Hh = 0.42, Wd = 0.3, n = 16, bh = o.bh ?? 0.62, pv = add(c, [0, Hh / 2, 0]);
    const T = (p) => add(rotZ(sub(add(c, p), pv), o.pitch || 0), pv);
    const cx = (i) => -L / 2 + (L * (i + 0.5)) / n, cw = L / n;
    // water per compartment (drawn before the glass so it reads inside)
    const lv = o.levels || [];
    for (let i = 0; i < n; i++) { const l = Math.min(1, lv[n - 1 - i] || 0); if (l > 0.01) S.box((q) => T(add(q, [cx(i), (l * Hh) / 2, 0])), cw / 2 - 0.004, (l * Hh) / 2, Wd - 0.01, TN.water, { alpha: 0.75, bevel: 0, gloss: 0.5 }); if ((o.hi || []).includes(n - 1 - i)) S.box((q) => T(add(q, [cx(i), 0.004, 0])), cw / 2 - 0.004, 0.004, Wd - 0.01, [236, 80, 60], { bevel: 0, glow: true, noShadow: true }); }
    // bulkheads (stopping short of the top) with doors at the bottom
    const wl = o.walls ?? 1;
    if (wl > 0) for (let i = 1; i < n; i++) { const x = -L / 2 + (L * i) / n; S.box((q) => T(add(q, [x, (bh * Hh * wl) / 2, 0])), 0.006, (bh * Hh * wl) / 2, Wd - 0.006, [200, 204, 214], { bevel: 0, alpha: 0.85 }); if (o.doors != null) S.box((q) => T(add(q, [x + 0.007, 0.035 * o.doors, 0])), 0.004, 0.035 * o.doors, 0.04, [230, 140, 50], { bevel: 0, noShadow: true }); }
    // spill: beads over the top of the bulkheads at the front
    if (o.spill > 0) for (let i = 1; i < 6; i++) { const x = L / 2 - (L * i) / n, top = bh * Hh; S.beads([T([x + 0.03, top + 0.01, 0]), T([x, top + 0.04, 0]), T([x - 0.05, top - 0.12, 0])], TN.water, -(o.t || 0) * 0.6, { reveal: o.spill, spacing: 0.02, r: 0.012 }); }
    // the glass hull, deck line, a little bow shape
    S.box((q) => T(add(q, [0, Hh / 2, 0])), L / 2, Hh / 2, Wd, P.glass, { alpha: 0.18, bevel: 0.02, gloss: 0.6 });
    S.box((q) => T(add(q, [0, bh * Hh, Wd + 0.002])), L / 2, 0.003, 0.002, [236, 80, 60], { bevel: 0, noShadow: true, glow: (o.line || 0) > 0.5 });
    for (const sx of [-0.8, 0.8]) stand(S, [c[0] + sx, 0, c[2]], 0.3, 0.35, c[1] - 0.02);
    return { T, top: (i) => T([L / 2 - (L * i) / n, bh * Hh, 0]), bow: T([L / 2, Hh / 2, 0]), line: T([0, bh * Hh, Wd]) };
  };
  // ---------- rivets ----------
  // two overlapping steel plates held by a row of rivets. o: iron (true = wrought-iron rivets), pop (0..1 heads snap off and the
  // plates part), t, water (0..1 beads through the gap)
  const seam = (S, c, o = {}) => {
    const gap = 0.12 * (o.pop || 0), pl = [120, 126, 136];
    S.box((q) => add(rotX(q, -0.05 * (o.pop || 0)), add(c, [0, 0.16 + gap, 0])), 0.55, 0.18, 0.02, pl, { bevel: 0.1, gloss: 0.3 });
    S.box((q) => add(q, add(c, [0, -0.1, 0.035])), 0.55, 0.18, 0.02, shade(pl, 0.9), { bevel: 0.1, gloss: 0.3 });
    const rc = o.iron ? [120, 92, 74] : [176, 182, 192];
    for (let i = 0; i < 9; i++) { const x = -0.48 + i * 0.12, p = o.pop || 0, fly = H.clamp(p * 1.6 - i * 0.07); const off = fly > 0 ? [0.1 * fly * ((i % 3) - 1), 0.25 * fly - 0.4 * fly * fly, 0.35 * fly] : [0, 0, 0]; S.cyl((q) => add(rotX(q, Math.PI / 2), add(c, add([x, 0.02, 0.06], off))), 0.025, 0.02, rc, 8, { gloss: 0.4 }); S.ico(add(c, add([x, 0.02, 0.085], off)), [0.028, 0.028, 0.012], rc, { sub: 0, gloss: 0.4 }); }
    if (o.water > 0) S.beads([add(c, [-0.5, 0.08 + gap * 0.5, -0.4]), add(c, [-0.5, 0.08 + gap * 0.5, 0.2])], TN.water, -(o.t || 0) * 2, { reveal: o.water, spacing: 0.04, r: 0.02 }), S.beads([add(c, [0.3, 0.08 + gap * 0.5, -0.4]), add(c, [0.3, 0.08 + gap * 0.5, 0.25])], TN.water, -(o.t || 0) * 2.2, { reveal: o.water, spacing: 0.04, r: 0.02 });
    stand(S, [c[0], 0, c[2]], 0.6, 0.4, c[1] - 0.3); S.rod([c[0], c[1] - 0.3, c[2]], [c[0], c[1] - 0.28, c[2]], 0.03, P.dark, 6);
  };
  // one big rivet (shank + domed head) with slag streaks painted on its cut face; snap (0..1) breaks the head off
  const bigRivet = (S, c, o = {}) => {
    const iron = o.iron !== false, col = iron ? [134, 104, 84] : [180, 186, 196], sn = o.snap || 0;
    S.cyl((q) => add(rotZ(q, Math.PI / 2), add(c, [0.3, 0, 0])), 0.09, 0.6, col, 14, { cap: col, capPaint: o.slag ? (cc, w, h) => { cc.fillStyle = '#c4b4a0'; cc.fillRect(0, 0, w, h); cc.strokeStyle = 'rgba(40,30,30,0.85)'; cc.lineWidth = 5; const r = H.rng(6); for (let i = 0; i < 14; i++) { const y = r() * h; cc.beginPath(); cc.moveTo(w * 0.1, y); cc.bezierCurveTo(w * 0.4, y + r.range(-20, 20), w * 0.6, y + r.range(-20, 20), w * 0.9, y + r.range(-10, 10)); cc.stroke(); } } : null });
    S.ico(add(c, [0.32 + 0.4 * sn, 0.3 * sn, 0]), [0.08, 0.16, 0.16], col, { sub: 1, gloss: 0.4 });
    stand(S, [c[0], 0, c[2]], 0.4, 0.3, c[1] - 0.12); S.rod([c[0], c[1] - 0.12, c[2]], [c[0], c[1] - 0.08, c[2]], 0.03, P.dark, 6);
  };
