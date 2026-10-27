  // ==================== Miracle on the Hudson props (video 005 and Shorts 14-16) ====================
  // The Hudson River set (water, Manhattan skyline, the New Jersey shore, a suspension bridge, ferries), Canada geese and
  // a flock, the auxiliary power unit rig (small turbine -> generator -> flight computers), tiny people on the wings,
  // spray and a top-down map. The jet itself is gimli.js's jet767 (generic white livery). Needs gimli.js and world.js.
  const HU = { water: [74, 118, 150], shore: [104, 130, 92], goose: [120, 100, 84], black: [30, 30, 34] };
  // ---------- geese ----------
  // one Canada goose flying along +x; flap = wing angle; s = scale (1 is about 1 m wingspan in garage units)
  const goose = (S, p, flap = 0, s = 1, yaw = 0) => {
    const T = (q) => add(rotY(mul(q, s), yaw), p);
    S.ico(T([0, 0, 0]), [0.22 * s, 0.09 * s, 0.1 * s], HU.goose, { sub: 0 });
    S.rod(T([0.18, 0.02, 0]), T([0.36, 0.08, 0]), 0.025 * s, HU.black, 5); S.ico(T([0.4, 0.09, 0]), 0.045 * s, HU.black, { sub: 0 }); S.ico(T([0.37, 0.07, 0]), [0.03 * s, 0.02 * s, 0.03 * s], [240, 240, 236], { sub: 0, noShadow: true });
    for (const sd of [-1, 1]) S.box((q) => T(add(rotX(add(q, [0, 0, sd * 0.25]), sd * flap), [0, 0.02, 0])), 0.1, 0.008, 0.25, shade(HU.goose, 0.85), { bevel: 0, noShadow: true });
    S.ico(T([-0.22, 0.0, 0]), [0.06 * s, 0.03 * s, 0.05 * s], HU.black, { sub: 0, noShadow: true });
  };
  // a V of geese centred at c heading +x (n birds, scale s)
  const flock = (S, c, t, n = 9, s = 1, yaw = 0) => { for (let i = 0; i < n; i++) { const row = Math.ceil(i / 2), sd = i % 2 ? 1 : -1, q = rotY([-row * 0.7 * s, Math.sin(i * 1.7) * 0.15 * s, sd * row * 0.6 * s], yaw); goose(S, add(c, q), 0.6 * Math.sin(t * 7 + i), s, yaw); } };
  // ---------- the river world ----------
  // the Hudson runs along x at z in [-3, 3]; Manhattan on -z, New Jersey on +z; y = 0 is the water
  const nyc = (S, o = {}) => {
    S.quad([[-300, 0, -300], [300, 0, -300], [300, 0, 300], [-300, 0, 300]], HU.water, { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 1; const r = H.rng(3); for (let i = 0; i < 300; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y); c.stroke(); } } });
    S.quad([[-300, 0.02, -300], [300, 0.02, -300], [300, 0.02, -4], [-300, 0.02, -4]], [150, 150, 158], { bg: true });
    S.quad([[-300, 0.02, 5], [300, 0.02, 5], [300, 0.02, 300], [-300, 0.02, 300]], HU.shore, { bg: true });
    const r = H.rng(o.seed || 6);
    for (let i = 0; i < (o.n || 60); i++) { const x = r.range(-40, 40), z = -5 - r.range(0, 14), hh = r.range(0.5, 3.4) * (Math.abs(x + 8) < 8 ? 1.4 : 1); const w = r.range(0.4, 0.9); S.box((q) => add(q, [x, hh, z]), w, hh, w * 0.8, [r.range(150, 205), r.range(150, 200), r.range(160, 205)], { bevel: 0.02, noShadow: true, paint: (c, ww, h) => { c.fillStyle = 'rgba(60,64,80,0.45)'; for (let k = 0; k < 4; k++) c.fillRect(((k + 0.3) * ww) / 4, 0, ww * 0.09, h); } }); }
    for (let i = 0; i < 24; i++) tree(S, r.range(-40, 40), 6 + r.range(0, 8), 1.0 + r() * 0.6, i + 70);
    if (o.bridge !== false) gwBridge(S, o.bridgeX ?? 18);
  };
  // a suspension bridge across the river at x (two steel towers, deck, main cables)
  const gwBridge = (S, x) => {
    const st = [150, 160, 176];
    for (const z of [-4.2, 4.6]) { for (const dx of [-0.3, 0.3]) S.box((q) => add(q, [x + dx, 2.6, z]), 0.08, 2.6, 0.12, st, { bevel: 0.1, noShadow: true }); S.box((q) => add(q, [x, 4.8, z]), 0.38, 0.08, 0.14, st, { bevel: 0.1, noShadow: true }); }
    S.box((q) => add(q, [x, 1.3, 0.2]), 0.42, 0.06, 12, [120, 126, 140], { bevel: 0.05, noShadow: true });
    for (const dx of [-0.32, 0.32]) { const pts = []; for (let i = 0; i <= 12; i++) { const z = -4.2 + (8.8 * i) / 12, u = (z + 4.2) / 8.8; pts.push([x + dx, 4.9 - 3.4 * 4 * u * (1 - u), z]); } S.tube(pts, 0.03, st, 5, { noShadow: true }); }
  };
  const ferry = (S, p, yaw = 0) => { const T = (q) => add(rotY(q, yaw), p); S.box((q) => T(add(q, [0, 0.15, 0])), 0.7, 0.15, 0.22, [240, 240, 236], { bevel: 0.1 }); S.box((q) => T(add(q, [0, 0.07, 0])), 0.71, 0.04, 0.23, [40, 90, 170], { bevel: 0.1 }); S.box((q) => T(add(q, [0.1, 0.38, 0])), 0.35, 0.09, 0.18, [236, 236, 232], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#2a3a5a'; for (let x = 6; x < w; x += 20) c.fillRect(x, h * 0.3, 12, h * 0.4); } }); };
  // little people standing on the wings of a jet floating at P0 (jet767 units)
  const wingPeople = (S, P0, n = 18, seed = 2, s = 1) => { const r = H.rng(seed), cols = [[220, 70, 60], [60, 90, 170], [240, 200, 60], [80, 160, 90], [240, 240, 240]]; for (let i = 0; i < n; i++) { const sd = i % 2 ? 1 : -1, u = r.range(0.15, 0.8), x = -0.15 - 0.4 * u, z = sd * (0.25 + 1.9 * u); const p = add(P0, [x * s, -0.1 * s, z * s]); S.cyl((q) => add(mul(q, s), p), 0.025, 0.11, cols[i % cols.length], 6); S.ico(add(p, [0, 0.13 * s, 0]), 0.022 * s, [236, 190, 160], { sub: 0 }); } };
  // white spray drawn in 2D at a screen point
  const spray = (ctx, x, y, u, seed = 1, w = 160) => { if (u <= 0 || u >= 1) return; const r = H.rng(seed); ctx.save(); for (let i = 0; i < 28; i++) { const k = (u + r() * 0.4) % 1, px = x + r.range(-w, w) * (0.3 + k), py = y - Math.sin(k * Math.PI) * r.range(30, 110), rad = 6 + 14 * r(); ctx.fillStyle = `rgba(250,252,255,${0.7 * (1 - k)})`; ctx.beginPath(); ctx.arc(px, py, rad, 0, TAU); ctx.fill(); } ctx.restore(); };
  // ---------- the APU rig ----------
  // a small turbine (spins) driving a generator; electricity (yellow beads) runs to the flight-computer box (screens lit by on)
  const apuRig = (S, c, t, o = {}) => {
    const AX = (q) => rotZ(q, -Math.PI / 2), on = o.on ?? 1;
    S.cyl((q) => add(AX(q), add(c, [-0.5, 0, 0])), 0.16, 0.5, P.glass, 14, { alpha: 0.3, r2: 0.12 });
    S.cyl((q) => add(rotX(AX(q), t * 12 * on), add(c, [-0.1, 0, 0])), 0.13, 0.03, P.steel, 12, { stripes: [150, 156, 168] });
    if (on > 0.05) S.ico(add(c, [-0.35, 0, 0]), 0.06 * on, [255, 150, 60], { sub: 0, glow: true, noShadow: true });
    S.box((q) => add(q, add(c, [0.25, 0, 0])), 0.16, 0.14, 0.14, P.blue, { bevel: 0.15 }); S.rod(add(c, [0, 0, 0]), add(c, [0.1, 0, 0]), 0.02, P.chrome, 8);
    const box = add(c, [1.0, 0.1, 0]);
    S.box((q) => add(q, box), 0.22, 0.22, 0.14, [44, 46, 54], { bevel: 0.1 });
    for (let i = 0; i < 2; i++) S.box((q) => add(q, add(box, [-0.08 + i * 0.16, 0.04, 0.142])), 0.06, 0.08, 0.002, [10, 14, 22], { bevel: 0, noShadow: true, glow: o.screens > 0.5, paint: o.screens > 0.05 ? (cc, w, h) => { cc.globalAlpha = o.screens; const g = cc.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a8ae0'); g.addColorStop(0.5, '#5aa0e8'); g.addColorStop(0.5, '#a06a3a'); g.addColorStop(1, '#7a4a2a'); cc.fillStyle = g; cc.fillRect(0, 0, w, h); cc.strokeStyle = '#7ee07a'; cc.lineWidth = 4; cc.beginPath(); cc.moveTo(w * 0.15, h * 0.5); cc.lineTo(w * 0.85, h * 0.5); cc.stroke(); cc.globalAlpha = 1; } : null });
    const wire = [add(c, [0.4, 0.05, 0]), add(c, [0.6, 0.18, 0]), add(box, [-0.22, 0, 0])];
    S.tube(wire, 0.014, [60, 60, 70], 6); if (o.power > 0) S.beads(wire, P.yellow, t * 0.8, { reveal: o.power, spacing: 0.06, r: 0.02 });
    stand(S, [c[0] + 0.2, 0, c[2]], 0.85, 0.4, c[1] - 0.17);
  };
  // ---------- top-down map ----------
  // camera looks straight down at the map; LaGuardia at (lga), Teterboro (teb), the river along x
  const mapScene = (E, TG, W, H_) => { const S = Scene(E, TG, W, H_); S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 60], [-60, 0, 60]], HU.shore, { bg: true }); S.quad([[-60, 0.01, -1.2], [60, 0.01, -1.2], [60, 0.01, 1.2], [-60, 0.01, 1.2]], HU.water, { bg: true }); S.quad([[-60, 0.012, -30], [60, 0.012, -30], [60, 0.012, -8], [-60, 0.012, -8]], [150, 150, 158], { bg: true }); return S; };
