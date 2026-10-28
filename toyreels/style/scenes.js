  // ==================== scenes: real locations instead of the blue studio ====================
  // Every scene is a shot wrapper like studioShot: xxxShot(ctx, W, H_, t, E, TG, build[, opt]). The back wall (or sky)
  // is painted in 2D on the plane z = WZ, the floor is drawn up to the camera, and the furniture is real bricks.
  // Stand the cast between z = -1.5 and z = 1.5, x = -2..2. Each scene returns S, like the other shot wrappers.
  const css = (c) => (typeof c === 'string' ? c : 'rgb(' + c.join(',') + ')');
  const wallRect = (ctx, S, x0, y0, x1, y1, z, fill) => quad3(ctx, S, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], css(fill));
  const floorTiles = (ctx, S, z0, a, b, tile = 1, x0 = -10, x1 = 10) => {
    const zMax = S.E[2] - 0.6;
    for (let z = z0; z < zMax; z += tile) for (let x = x0; x < x1; x += tile) quad3(ctx, S, [[x, 0, z], [x + tile, 0, z], [x + tile, 0, Math.min(z + tile, zMax)], [x, 0, Math.min(z + tile, zMax)]], css(((Math.round(x / tile) + Math.round(z / tile)) & 1) ? a : b));
  };
  const floorFlat = (ctx, S, z0, fill) => quad3(ctx, S, [[-14, 0, z0], [14, 0, z0], [14, 0, S.E[2] - 0.6], [-14, 0, S.E[2] - 0.6]], css(fill));
  const rug = (ctx, S, cx, cz, rx, rz, fill, n = 28) => { const sp = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU; sp.push(S.proj([cx + Math.cos(a) * rx, 0.003, cz + Math.sin(a) * rz])); } if (sp.some((p) => p[2] < 0.3)) return; ctx.beginPath(); sp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fillStyle = css(fill); ctx.fill(); };
  const glowAt = (ctx, S, p3, r, col, a = 1) => { const p = S.proj(p3); if (p[2] < 0.3) return; const R = (r * 900) / p[2]; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, `rgba(${col.join(',')},${0.85 * a})`); g.addColorStop(1, `rgba(${col.join(',')},0)`); ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] - R, 2 * R, 2 * R); };
  const skyGrad = (ctx, W, H_, top, bot) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); };
  const flame = (ctx, S, x, y, z, s, t, seed = 0) => { for (let i = 0; i < 3; i++) { const p = S.proj([x + Math.sin(t * 9 + seed + i) * 0.02 * s, y + i * 0.08 * s, z]); if (p[2] < 0.3) return; const r = ((0.16 - i * 0.04) * s * (1 + 0.15 * Math.sin(t * 13 + seed * 3 + i)) * 900) / p[2]; ctx.fillStyle = ['rgba(255,120,30,0.9)', 'rgba(255,190,50,0.9)', 'rgba(255,250,200,0.95)'][i]; ctx.beginPath(); ctx.ellipse(p[0], p[1] - r * 0.6, r * 0.6, r * 1.2, 0, 0, TAU); ctx.fill(); } };
  const shotWith = (E, TG, W, H_, build, back, env, ctx, after) => { const S = Scene(E, TG, W, H_); build(S); back(S); S.render(ctx, W, H_, env); if (after) after(S); return S; };
  const flagCloth = (S, x, z, h, paint, s = 1) => { S.cyl((p) => add(mul(p, s), [x, 0, z]), 0.03, h, [210, 180, 90], 8); S.box((p) => add(mul(p, s), [x + 0.32, h - 0.3, z]), 0.3, 0.22, 0.012, [240, 240, 240], { bevel: 0.15, paint }); };
  const usFlagish = (c, w, h) => { for (let i = 0; i < 7; i++) { c.fillStyle = i % 2 ? '#f4f4f0' : '#c8282e'; c.fillRect(0, (h * i) / 7, w, h / 7 + 1); } c.fillStyle = '#2a3a8a'; c.fillRect(0, 0, w * 0.42, h * 0.5); };

  // the president's office: cream walls, two tall windows with gold drapes, a navy oval rug, a big wooden desk, flags
  const officeShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    if (o.desk !== false) { S.box((p) => add(p, [0, 0.42, -1.6]), 0.9, 0.42, 0.36, [120, 72, 40], { bevel: 0.15, paint: (c, w, h) => { c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(w * 0.08, h * 0.12, w * 0.36, h * 0.76); c.fillRect(w * 0.56, h * 0.12, w * 0.36, h * 0.76); c.fillStyle = '#d8b050'; c.beginPath(); c.arc(w / 2, h / 2, h * 0.18, 0, TAU); c.fill(); } }); S.box((p) => add(p, [0, 0.86, -1.6]), 0.95, 0.03, 0.4, [96, 56, 30], { bevel: 0.3 }); }
    flagCloth(S, -1.5, -2.2, 1.9, usFlagish); flagCloth(S, 1.3, -2.2, 1.9, (c, w, h) => { c.fillStyle = '#20307a'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8b050'; c.beginPath(); c.arc(w / 2, h / 2, h * 0.3, 0, TAU); c.fill(); });
    build(S);
  }, (S) => {
    const WZ = -2.6; skyGrad(ctx, W, H_, '#efe6cf', '#e2d6b8');
    wallRect(ctx, S, -12, 0, 12, 0.9, WZ, '#d9cba6'); wallRect(ctx, S, -12, 0.9, 12, 0.95, WZ, '#bfa874');
    for (const wx of [-2.6, 1.6]) { wallRect(ctx, S, wx, 1.1, wx + 1.0, 3.0, WZ, '#8fc4ef'); wallRect(ctx, S, wx + 0.47, 1.1, wx + 0.53, 3.0, WZ, '#f4f0e4'); wallRect(ctx, S, wx, 2.0, wx + 1.0, 2.05, WZ, '#f4f0e4'); wallRect(ctx, S, wx - 0.35, 0.9, wx, 3.3, WZ, '#c99a32'); wallRect(ctx, S, wx + 1.0, 0.9, wx + 1.35, 3.3, WZ, '#c99a32'); }
    const seal = S.proj([0, 2.5, WZ]); if (seal[2] > 0.3) { const r = 240 / seal[2]; ctx.fillStyle = '#c99a32'; ctx.beginPath(); ctx.arc(seal[0], seal[1], r, 0, TAU); ctx.fill(); ctx.fillStyle = '#20307a'; ctx.beginPath(); ctx.arc(seal[0], seal[1], r * 0.8, 0, TAU); ctx.fill(); }
    floorFlat(ctx, S, WZ, '#7a5a3c'); rug(ctx, S, 0, -0.3, 2.6, 1.6, '#1e2c64'); rug(ctx, S, 0, -0.3, 2.3, 1.38, '#283a7c');
  }, { sky: [255, 240, 210], ground: [120, 90, 70] }, ctx);

  // the war room: concrete bunker, a giant glowing world map with missile tracks, red alarm lights (alarm 0..1)
  const bunkerShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    S.box((p) => add(p, [0, 0.4, -1.7]), 1.3, 0.4, 0.3, [88, 92, 100], { bevel: 0.1, paint: (c, w, h) => { for (let i = 0; i < 14; i++) { c.fillStyle = ['#e03030', '#30d060', '#f0c030'][i % 3]; c.fillRect(w * (0.05 + i * 0.065), h * 0.2, w * 0.03, h * 0.08); } } });
    build(S);
  }, (S) => {
    const WZ = -2.6, al = o.alarm == null ? 1 : o.alarm; skyGrad(ctx, W, H_, '#3a3e46', '#2a2d34');
    for (let y = 0; y < 5; y++) for (let x = -6; x < 6; x++) wallRect(ctx, S, x * 1.2 + 0.02, y * 0.8 + 0.02, x * 1.2 + 1.18, y * 0.8 + 0.78, WZ, (x + y) & 1 ? '#4a4e58' : '#454952');
    wallRect(ctx, S, -2.2, 1.1, 2.2, 3.4, WZ, '#0c1a2a');
    const m = (x, y) => S.proj([x, y, WZ + 0.01]); const a = m(-2.2, 3.4), b = m(2.2, 1.1);
    if (a[2] > 0.3) { ctx.save(); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip(); const w = b[0] - a[0], h = b[1] - a[1];
      ctx.strokeStyle = 'rgba(60,200,255,0.25)'; ctx.lineWidth = 1; for (let i = 1; i < 12; i++) { ctx.beginPath(); ctx.moveTo(a[0] + (w * i) / 12, a[1]); ctx.lineTo(a[0] + (w * i) / 12, b[1]); ctx.stroke(); }
      ctx.fillStyle = 'rgba(60,220,140,0.55)'; for (const [cx, cy, rx, ry] of [[0.22, 0.38, 0.12, 0.16], [0.28, 0.72, 0.06, 0.14], [0.52, 0.32, 0.08, 0.1], [0.55, 0.62, 0.07, 0.17], [0.74, 0.36, 0.18, 0.15], [0.85, 0.75, 0.06, 0.06]]) { ctx.beginPath(); ctx.ellipse(a[0] + w * cx, a[1] + h * cy, w * rx, h * ry, 0, 0, TAU); ctx.fill(); }
      const k = (t * 0.5) % 1; ctx.strokeStyle = '#ff4040'; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(a[0] + w * 0.78, a[1] + h * 0.35); ctx.quadraticCurveTo(a[0] + w * 0.5, a[1] - h * 0.1, a[0] + w * (0.78 - 0.56 * k), a[1] + h * (0.35 - 0.0 * k)); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    floorTiles(ctx, S, WZ, '#5a5e66', '#53575f', 0.8);
    for (const lx of [-2.8, 2.8]) { const on = 0.5 + 0.5 * Math.sin(t * 8 + lx); wallRect(ctx, S, lx - 0.15, 3.5, lx + 0.15, 3.75, WZ, on > 0.5 && al ? '#ff3030' : '#802020'); }
    if (al) { ctx.fillStyle = `rgba(255,30,30,${0.12 * al * (0.5 + 0.5 * Math.sin(t * 8))})`; ctx.fillRect(0, 0, W, H_); }
  }, { sky: [200, 210, 230], ground: [90, 90, 100] }, ctx);

  // a prison cell: grey block wall, barred window with the moon, bunk and steel toilet; front bars with opt.bars
  const prisonShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    S.box((p) => add(p, [-1.8, 0.35, -1.9]), 0.7, 0.06, 0.32, [150, 150, 156], { bevel: 0.2 }); S.box((p) => add(p, [-1.8, 0.4, -1.9]), 0.68, 0.05, 0.3, [190, 90, 70], { bevel: 0.4 });
    S.box((p) => add(p, [1.9, 0.2, -2.1]), 0.18, 0.2, 0.2, [190, 196, 206], { bevel: 0.4 });
    if (o.bars) jailBars(S, 0, 1.6, 4.4, 11, 3.2);
    build(S);
  }, (S) => {
    const WZ = -2.4; skyGrad(ctx, W, H_, '#62666e', '#565a62');
    for (let y = 0; y < 9; y++) for (let x = -10; x < 10; x++) { const off = (y & 1) * 0.3; wallRect(ctx, S, x * 0.6 + off + 0.02, y * 0.4 + 0.02, x * 0.6 + off + 0.58, y * 0.4 + 0.38, WZ, (x * 7 + y * 3) % 5 ? '#80848c' : '#767a82'); }
    wallRect(ctx, S, -0.4, 2.3, 0.4, 3.0, WZ, '#16203c'); glowAt(ctx, S, [0.15, 2.8, WZ], 0.12, [255, 250, 220]);
    for (let i = 0; i < 5; i++) wallRect(ctx, S, -0.4 + i * 0.2 - 0.02, 2.3, -0.4 + i * 0.2 + 0.02, 3.0, WZ + 0.01, '#3a3c42');
    for (let i = 0; i < 4; i++) for (let k = 0; k < 5; k++) wallRect(ctx, S, 1.2 + i * 0.25, 1.4 + k * 0.03 * 0, 1.2 + i * 0.25 + 0.012, 1.7, WZ + 0.01, '#3a3a40'); // tally marks
    wallRect(ctx, S, 1.15, 1.54, 2.2, 1.56, WZ + 0.01, '#3a3a40');
    floorFlat(ctx, S, WZ, '#6c6e72');
  }, { sky: [200, 205, 220], ground: [100, 100, 110] }, ctx);

  // the secret lair (Illuminati): dark stone, a giant glowing eye-pyramid on the wall, flickering torches, red carpet
  const lairShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    if (o.table !== false) { S.cyl((p) => add(p, [0, 0, -1.4]), 0.9, 0.5, [70, 30, 40], 24); S.cyl((p) => add(p, [0, 0.5, -1.4]), 1.0, 0.05, [40, 20, 26], 24); }
    build(S);
  }, (S) => {
    const WZ = -2.8, eye = o.eye == null ? 1 : o.eye; skyGrad(ctx, W, H_, '#1a1024', '#24142e');
    for (let y = 0; y < 8; y++) for (let x = -8; x < 8; x++) wallRect(ctx, S, x * 0.9 + (y & 1) * 0.45 + 0.02, y * 0.55 + 0.02, x * 0.9 + (y & 1) * 0.45 + 0.88, y * 0.55 + 0.53, WZ, (x + y * 3) % 4 ? '#2e2238' : '#352840');
    const a = S.proj([-1.5, 1.4, WZ]), b = S.proj([1.5, 1.4, WZ]), c = S.proj([0, 3.9, WZ]);
    if (a[2] > 0.3) { glowAt(ctx, S, [0, 2.4, WZ], 1.8, [255, 200, 80], 0.5 + 0.1 * Math.sin(t * 2)); ctx.fillStyle = '#d8a83a'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7a5a18'; ctx.lineWidth = 3; for (let i = 1; i < 5; i++) { const y = a[1] + (c[1] - a[1]) * (i / 5); ctx.beginPath(); ctx.moveTo(a[0] + (c[0] - a[0]) * (i / 5), y); ctx.lineTo(b[0] + (c[0] - b[0]) * (i / 5), y); ctx.stroke(); }
      const e = S.proj([0, 2.75, WZ]), r = 380 / e[2]; ctx.fillStyle = '#fff8dc'; ctx.beginPath(); ctx.ellipse(e[0], e[1], r, r * 0.55 * Math.max(0.05, eye), 0, 0, TAU); ctx.fill(); if (eye > 0.2) { ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(e[0] + Math.sin(t * 0.7) * r * 0.25, e[1], r * 0.35 * eye, 0, TAU); ctx.fill(); } }
    for (const tx of [-2.6, 2.6]) { wallRect(ctx, S, tx - 0.05, 1.6, tx + 0.05, 2.0, WZ + 0.02, '#5a3a20'); glowAt(ctx, S, [tx, 2.15, WZ], 0.6, [255, 140, 40], 0.6); flame(ctx, S, tx, 2.05, WZ + 0.05, 1, t, tx); }
    floorTiles(ctx, S, WZ, '#2a2030', '#30243a', 0.7); quad3(ctx, S, [[-0.7, 0.002, WZ], [0.7, 0.002, WZ], [0.7, 0.002, S.E[2] - 0.6], [-0.7, 0.002, S.E[2] - 0.6]], '#8a1a24');
  }, { sky: [200, 150, 220], ground: [80, 50, 60], light: [0.2, 0.9, 0.7] }, ctx);

  // the desert at sunset with the great pyramids behind and dunes in front
  const desertShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, build, (S) => {
    const hz = S.proj([S.TG[0], 0, S.TG[2] - 60])[1]; skyGrad(ctx, W, H_, '#3a2a6a', '#ff9a50');
    const sun = S.proj([2, 3, -40]); if (sun[2] > 0.3) { glowAt(ctx, S, [2, 3, -40], 12, [255, 210, 120], 0.9); ctx.fillStyle = '#ffe7a0'; ctx.beginPath(); ctx.arc(sun[0], sun[1], 5000 / sun[2], 0, TAU); ctx.fill(); }
    for (const [px, pz, ps] of [[-6, -30, 9], [4, -36, 12], [12, -40, 7]]) { const a = S.proj([px - ps, 0, pz]), b = S.proj([px + ps, 0, pz]), c = S.proj([px + ps * 0.15, ps * 1.1, pz]); if (a[2] < 0.3) continue; ctx.fillStyle = '#c88a50'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(80,40,30,0.35)'; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo((a[0] + b[0]) / 2 + (b[0] - a[0]) * 0.2, a[1]); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = '#e0a868'; ctx.fillRect(0, hz, W, H_ - hz);
    for (let z = -20; z < S.E[2] - 0.6; z += 1.5) quad3(ctx, S, [[-14, 0, z], [14, 0, z], [14, 0, z + 1.5], [-14, 0, z + 1.5]], (Math.round(z / 1.5) & 1) ? '#e6b070' : '#dca466');
  }, { sky: [255, 190, 150], ground: [220, 160, 100], light: [0.6, 0.6, 0.5] }, ctx);

  // a TV / summit stage: red velvet curtains, spotlight cones, wooden boards and an audience of heads in front
  const stageShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, build, (S) => {
    const WZ = -2.4; skyGrad(ctx, W, H_, '#2a0a10', '#14060a');
    for (let x = -8; x < 8; x += 0.35) wallRect(ctx, S, x, 0, x + 0.35, 5, WZ, (Math.round(x / 0.35) & 1) ? '#9a1424' : '#86101e');
    wallRect(ctx, S, -8, 4.1, 8, 4.6, WZ + 0.01, '#d8a83a');
    if (o.banner) { wallRect(ctx, S, -1.8, 2.5, 1.8, 3.1, WZ + 0.02, '#14161e'); const p = S.proj([0, 2.8, WZ + 0.02]); if (p[2] > 0.3) { ctx.fillStyle = '#ffd23f'; ctx.font = FONT(800, 230 / p[2]); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.banner, p[0], p[1]); } }
    for (let z = WZ; z < S.E[2] - 0.6; z += 0.4) quad3(ctx, S, [[-14, 0, z], [14, 0, z], [14, 0, z + 0.4], [-14, 0, z + 0.4]], (Math.round(z / 0.4) & 1) ? '#8a5a32' : '#7e522e');
    for (const sx of [-1.2, 1.2]) { const top = S.proj([sx * 1.6, 5, 0]), l = S.proj([sx - 0.8, 0, 0]), r = S.proj([sx + 0.8, 0, 0]); if (top[2] < 0.3 || l[2] < 0.3) continue; const g = ctx.createLinearGradient(0, top[1], 0, l[1]); g.addColorStop(0, 'rgba(255,250,220,0.0)'); g.addColorStop(1, 'rgba(255,250,220,0.22)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(l[0], l[1]); ctx.lineTo(r[0], r[1]); ctx.closePath(); ctx.fill(); }
  }, { sky: [255, 230, 210], ground: [140, 80, 60] }, ctx, (S) => {
    if (o.audience === false) return; const r = H.rng(5); for (let i = 0; i < 14; i++) { const x = (i / 13) * W, y = H_ - r.range(30, 90); ctx.fillStyle = '#0c0608'; ctx.beginPath(); ctx.arc(x + r.range(-20, 20), y, r.range(40, 60), 0, TAU); ctx.fill(); }
  });

  // heaven: cloud floor, golden gates, god-rays ("higher powers" scenes)
  const heavenShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    if (o.gates !== false) for (const sx of [-1, 1]) { S.box((p) => add(p, [sx * 1.6, 1.4, -2.0]), 0.12, 1.4, 0.12, [240, 200, 70], { bevel: 0.3 }); for (let i = 0; i < 5; i++) S.cyl((p) => add(p, [sx * (0.25 + i * 0.27), 0, -2.0]), 0.025, 2.3 + Math.sin(i) * 0.1, [240, 200, 70], 8); }
    build(S);
  }, (S) => {
    skyGrad(ctx, W, H_, '#9ad0ff', '#fff6e0'); const c = S.proj([0, 6, -20]);
    if (c[2] > 0.3) for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI + t * 0.05; ctx.fillStyle = 'rgba(255,250,220,0.18)'; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + Math.cos(a) * 1600, c[1] + Math.sin(a) * 1600); ctx.lineTo(c[0] + Math.cos(a + 0.12) * 1600, c[1] + Math.sin(a + 0.12) * 1600); ctx.closePath(); ctx.fill(); }
    const r = H.rng(13); floorFlat(ctx, S, -20, '#f4f6fb');
    for (let i = 0; i < 60; i++) { const x = r.range(-8, 8), z = r.range(-12, S.E[2] - 1), p = S.proj([x + Math.sin(t * 0.3 + i) * 0.1, 0.05, z]); if (p[2] < 0.3) continue; const rr = (r.range(0.4, 0.9) * 900) / p[2]; ctx.fillStyle = i % 3 ? '#ffffff' : '#e6eef8'; ctx.beginPath(); ctx.ellipse(p[0], p[1], rr, rr * 0.45, 0, 0, TAU); ctx.fill(); }
  }, { sky: [255, 250, 240], ground: [240, 240, 255] }, ctx);

  // the underworld: black rock, lava cracks glowing in the floor, flames, red haze
  const hellShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    if (o.throne !== false) { S.box((p) => add(p, [0, 0.35, -1.9]), 0.5, 0.35, 0.4, [60, 20, 20], { bevel: 0.2 }); S.box((p) => add(p, [0, 1.3, -2.2]), 0.5, 0.95, 0.1, [60, 20, 20], { bevel: 0.2 }); for (const sx of [-0.4, 0, 0.4]) S.box((p) => add(rotZ(p, 0.78), [sx, 2.3, -2.2]), 0.1, 0.1, 0.08, [60, 20, 20], { bevel: 0.2 }); }
    build(S);
  }, (S) => {
    const WZ = -3; skyGrad(ctx, W, H_, '#1a0404', '#5a0e06');
    const r = H.rng(21); for (let i = 0; i < 16; i++) { const x = r.range(-8, 8), h = r.range(1.5, 5), wd = r.range(0.6, 1.6), a = S.proj([x - wd, 0, WZ]), b = S.proj([x + wd, 0, WZ]), c = S.proj([x + r.range(-0.3, 0.3), h, WZ]); if (a[2] < 0.3) continue; ctx.fillStyle = i % 2 ? '#2a0a08' : '#200806'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.closePath(); ctx.fill(); }
    floorFlat(ctx, S, WZ, '#2a0c08');
    const rr = H.rng(9); ctx.lineCap = 'round'; for (let i = 0; i < 22; i++) { let x = rr.range(-6, 6), z = rr.range(WZ, S.E[2] - 1.2); const pts = []; for (let k = 0; k < 4; k++) { pts.push(S.proj([x, 0.004, z])); x += rr.range(-0.5, 0.5); z += rr.range(0.1, 0.4); } if (pts.some((p) => p[2] < 0.3)) continue; ctx.strokeStyle = `rgba(255,${120 + 60 * Math.sin(t * 3 + i) | 0},30,0.9)`; ctx.lineWidth = 900 * 0.04 / pts[0][2]; ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
    for (const fx of [-2.4, -1.2, 1.4, 2.6]) flame(ctx, S, fx, 0.05, WZ + 0.6, 3, t, fx * 7);
  }, { sky: [255, 120, 80], ground: [255, 90, 30], light: [0.1, 0.5, 0.8] }, ctx, () => { ctx.fillStyle = `rgba(255,60,20,${0.1 + 0.04 * Math.sin(t * 2)})`; ctx.fillRect(0, 0, W, H_); });

  // a graveyard at night: tombstones, bare trees, fog, a big moon
  const graveyardShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    const r = H.rng(31); for (let i = 0; i < 7; i++) { const x = -3 + i + r.range(-0.2, 0.2), z = -2.2 + r.range(-0.4, 0.4); S.box((p) => add(rotY(rotZ(p, r.range(-0.12, 0.12)), r.range(-0.2, 0.2)), [x, 0.32, z]), 0.22, 0.32, 0.06, [150, 150, 160], { bevel: 0.35, paint: (c, w, h) => { c.fillStyle = '#5a5a66'; c.font = FONT(800, h * 0.18); c.textAlign = 'center'; c.fillText('R.I.P.', w / 2, h * 0.4); } }); }
    build(S);
  }, (S) => {
    skyGrad(ctx, W, H_, '#0a0e22', '#2a2e4a'); const m = S.proj([-3, 6, -30]); if (m[2] > 0.3) { glowAt(ctx, S, [-3, 6, -30], 8, [220, 230, 255], 0.6); ctx.fillStyle = '#f2f0dc'; ctx.beginPath(); ctx.arc(m[0], m[1], 2600 / m[2], 0, TAU); ctx.fill(); }
    const r = H.rng(7); ctx.strokeStyle = '#0c0c16'; ctx.lineCap = 'round'; for (let i = 0; i < 5; i++) { const b = S.proj([r.range(-8, 8), 0, -10]); if (b[2] < 0.3) continue; const s = 9000 / b[2]; ctx.lineWidth = s * 0.06; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0], b[1] - s); for (let k = 0; k < 4; k++) { ctx.moveTo(b[0], b[1] - s * (0.5 + k * 0.12)); ctx.lineTo(b[0] + (k & 1 ? 1 : -1) * s * 0.35, b[1] - s * (0.8 + k * 0.1)); } ctx.stroke(); }
    floorFlat(ctx, S, -30, '#1c2a22');
  }, { sky: [140, 150, 210], ground: [40, 60, 50] }, ctx, () => { for (let i = 0; i < 4; i++) { const y = H_ * (0.62 + i * 0.07), g = ctx.createLinearGradient(0, y - 60, 0, y + 60); g.addColorStop(0, 'rgba(200,210,240,0)'); g.addColorStop(0.5, `rgba(200,210,240,${0.16 + 0.05 * Math.sin(t + i)})`); g.addColorStop(1, 'rgba(200,210,240,0)'); ctx.fillStyle = g; ctx.fillRect(0, y - 60, W, 120); } });

  // the moon: grey crater ground, black sky with stars and the Earth
  const moonShot = (ctx, W, H_, t, E, TG, build) => shotWith(E, TG, W, H_, build, (S) => {
    spaceSet(ctx, W, H_, t, 0.7); const e = S.proj([2.5, 7, -30]); if (e[2] > 0.3) { const r = 3000 / e[2]; ctx.fillStyle = '#3a7ad8'; ctx.beginPath(); ctx.arc(e[0], e[1], r, 0, TAU); ctx.fill(); ctx.fillStyle = '#4cb048'; ctx.beginPath(); ctx.ellipse(e[0] - r * 0.3, e[1] - r * 0.1, r * 0.35, r * 0.5, 0.4, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(0,0,20,0.45)'; ctx.beginPath(); ctx.arc(e[0] + r * 0.35, e[1], r, -Math.PI / 2, Math.PI / 2); ctx.fill(); }
    floorFlat(ctx, S, -30, '#9a9aa2'); const r = H.rng(3); for (let i = 0; i < 18; i++) rug(ctx, S, r.range(-6, 6), r.range(-14, S.E[2] - 2), r.range(0.3, 1), r.range(0.15, 0.5), '#82828a', 16);
  }, { shadows: true, sky: [200, 200, 230], ground: [150, 150, 160], light: [-0.7, 0.6, 0.5] }, ctx);

  // a military base at dusk: smoky orange sky, sandbags, a fence, craters (missiles, generals, war games)
  const baseShot = (ctx, W, H_, t, E, TG, build) => shotWith(E, TG, W, H_, (S) => {
    for (let i = 0; i < 9; i++) S.box((p) => add(p, [-2.4 + i * 0.6, 0.12, -2.0]), 0.3, 0.12, 0.16, [176, 156, 110], { bevel: 0.6 });
    for (let i = 0; i < 8; i++) S.box((p) => add(p, [-2.1 + i * 0.6, 0.34, -2.0]), 0.3, 0.12, 0.16, [168, 148, 104], { bevel: 0.6 });
    build(S);
  }, (S) => {
    skyGrad(ctx, W, H_, '#3a2a3a', '#e07a3a'); const r = H.rng(4);
    for (let i = 0; i < 6; i++) { const p = S.proj([r.range(-10, 10), r.range(1, 4), -20]); if (p[2] < 0.3) continue; ctx.fillStyle = 'rgba(60,40,50,0.35)'; ctx.beginPath(); ctx.arc(p[0], p[1], 9000 / p[2], 0, TAU); ctx.fill(); }
    floorFlat(ctx, S, -20, '#6a6248'); for (let x = -10; x < 10; x += 0.8) wallRect(ctx, S, x, 0, x + 0.03, 1.4, -6, '#3a3a40'); wallRect(ctx, S, -10, 1.3, 10, 1.33, -6, '#3a3a40'); wallRect(ctx, S, -10, 0.7, 10, 0.72, -6, '#3a3a40');
    for (let i = 0; i < 5; i++) rug(ctx, S, r.range(-5, 5), r.range(-5, 1), r.range(0.4, 0.8), r.range(0.2, 0.35), '#4a4434', 18);
  }, { sky: [255, 190, 150], ground: [120, 110, 80], light: [0.7, 0.5, 0.5] }, ctx);

  // a bank lobby: marble columns, a checker floor, a big BANK sign and the vault behind (vaultDoor on top if wanted)
  const bankShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    for (const cx of [-2.4, -1.2, 1.2, 2.4]) { S.box((p) => add(p, [cx, 1.6, -2.2]), 0.18, 1.6, 0.18, [236, 232, 222], { bevel: 0.15 }); S.box((p) => add(p, [cx, 0.06, -2.2]), 0.26, 0.06, 0.26, [210, 204, 190], { bevel: 0.3 }); }
    build(S);
  }, (S) => {
    const WZ = -2.6; skyGrad(ctx, W, H_, '#e8e0cc', '#d8ccb0'); wallRect(ctx, S, -12, 0, 12, 1.0, WZ, '#c8b896');
    wallRect(ctx, S, -1.0, 2.3, 1.0, 2.9, WZ, '#2a5a3a'); const p = S.proj([0, 2.6, WZ]); if (p[2] > 0.3) { ctx.fillStyle = '#f2d060'; ctx.font = FONT(800, 300 / p[2]); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.sign || 'BANK', p[0], p[1]); }
    floorTiles(ctx, S, WZ, '#f0ece4', '#2e2e34', 0.6);
  }, { sky: [255, 245, 225], ground: [200, 190, 170] }, ctx);

  // a throne room / palace: red walls with gold pillars, a chandelier glow, a throne, red carpet
  const palaceShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, (S) => {
    if (o.throne !== false) { S.box((p) => add(p, [0, 0.35, -2.0]), 0.5, 0.35, 0.4, [200, 160, 50], { bevel: 0.2 }); S.box((p) => add(p, [0, 0.72, -2.0]), 0.42, 0.04, 0.34, [170, 20, 40], { bevel: 0.4 }); S.box((p) => add(p, [0, 1.4, -2.32]), 0.5, 1.0, 0.08, [200, 160, 50], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#a8141e'; c.fillRect(w * 0.15, h * 0.1, w * 0.7, h * 0.8); } }); }
    build(S);
  }, (S) => {
    const WZ = -2.7; skyGrad(ctx, W, H_, '#6a0e18', '#4a0a12');
    for (let x = -6; x <= 6; x += 1.5) wallRect(ctx, S, x - 0.12, 0, x + 0.12, 5, WZ, '#d8a83a');
    wallRect(ctx, S, -12, 3.9, 12, 4.1, WZ, '#d8a83a'); glowAt(ctx, S, [0, 4.2, -1], 1.6, [255, 230, 160], 0.7);
    floorTiles(ctx, S, WZ, '#e8e2d2', '#cfc6b0', 0.8); quad3(ctx, S, [[-0.8, 0.002, WZ], [0.8, 0.002, WZ], [0.8, 0.002, S.E[2] - 0.6], [-0.8, 0.002, S.E[2] - 0.6]], '#a8141e');
  }, { sky: [255, 220, 200], ground: [170, 60, 60] }, ctx);

  // a courtroom: wood panels, the judge's bench, the scales sign
  const courtShot = (ctx, W, H_, t, E, TG, build) => shotWith(E, TG, W, H_, (S) => {
    S.box((p) => add(p, [0, 0.6, -2.0]), 1.2, 0.6, 0.3, [110, 66, 36], { bevel: 0.1, paint: (c, w, h) => { c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = w * 0.01; for (let i = 1; i < 4; i++) c.strokeRect(w * (i - 1) / 3 + w * 0.03, h * 0.12, w / 3 - w * 0.06, h * 0.76); } });
    build(S);
  }, (S) => {
    const WZ = -2.6; skyGrad(ctx, W, H_, '#6a4428', '#5a3820');
    for (let x = -8; x < 8; x += 0.9) wallRect(ctx, S, x + 0.03, 0, x + 0.87, 4.5, WZ, (Math.round(x / 0.9) & 1) ? '#7a4e2c' : '#724828');
    const p = S.proj([0, 3.3, WZ]); if (p[2] > 0.3) { const r = 260 / p[2]; ctx.fillStyle = '#d8a83a'; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#6a4a10'; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.moveTo(p[0], p[1] - r * 0.6); ctx.lineTo(p[0], p[1] + r * 0.5); ctx.moveTo(p[0] - r * 0.6, p[1] - r * 0.3); ctx.lineTo(p[0] + r * 0.6, p[1] - r * 0.3); ctx.stroke(); }
    floorFlat(ctx, S, WZ, '#5a3a24'); rug(ctx, S, 0, -0.2, 2.2, 1.2, '#2a4a3a');
  }, { sky: [255, 230, 200], ground: [120, 80, 50] }, ctx);

  // a city street by day or night: shop fronts with signs, windows, a pavement and road (night 0..1)
  const streetShot = (ctx, W, H_, t, E, TG, build, o = {}) => shotWith(E, TG, W, H_, build, (S) => {
    const WZ = -2.8, n = o.night || 0; skyGrad(ctx, W, H_, n ? '#0e1430' : '#7fbdf2', n ? '#2a2a50' : '#dff0fb');
    const r = H.rng(12), signs = o.signs || ['PAWN', 'DONUTS', 'BANK', 'LAWYER', 'PIZZA', 'GUNS & ROSES FLORIST'];
    for (let i = 0; i < 6; i++) { const x0 = -6 + i * 2, col = ['#c86a4a', '#4a7ac8', '#d8b050', '#6aa86a', '#a85ac8', '#c84a6a'][i]; wallRect(ctx, S, x0, 0, x0 + 1.95, r.range(3.5, 5), WZ, col);
      for (let k = 0; k < 3; k++) wallRect(ctx, S, x0 + 0.2 + k * 0.6, 2.6, x0 + 0.6 + k * 0.6, 3.2, WZ + 0.01, n ? (r() > 0.4 ? '#ffd880' : '#2a2a40') : '#bfe0f8');
      wallRect(ctx, S, x0 + 0.2, 0.05, x0 + 1.75, 1.6, WZ + 0.01, n ? '#ffe6a8' : '#9fd0ee'); wallRect(ctx, S, x0 + 0.1, 1.75, x0 + 1.85, 2.2, WZ + 0.01, '#1c1c24');
      const p = S.proj([x0 + 0.975, 1.975, WZ + 0.02]); if (p[2] > 0.3) { ctx.fillStyle = '#ffd23f'; ctx.font = FONT(800, Math.min(170, 2400 / (signs[i % signs.length].length + 4)) / p[2]); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(signs[i % signs.length], p[0], p[1]); } }
    floorFlat(ctx, S, WZ, '#a8a8b0'); quad3(ctx, S, [[-14, 0.002, 0.6], [14, 0.002, 0.6], [14, 0.002, S.E[2] - 0.6], [-14, 0.002, S.E[2] - 0.6]], '#3a3a44');
    for (let x = -8; x < 8; x += 1.2) quad3(ctx, S, [[x, 0.004, 1.5], [x + 0.6, 0.004, 1.5], [x + 0.6, 0.004, 1.6], [x, 0.004, 1.6]], '#f2f2e8');
    if (n) nightGrade(ctx, W, H_, 0.35 * n, false);
  }, { sky: [220, 230, 255], ground: [140, 140, 150] }, ctx);

  // ==================== cast: famous characters, ready to drop in ====================
  // actor(S, x, z, s, rot, who, extra) draws a cast member (CAST below) with extra figure options on top
  // (pose, eyes, mouth, hold...). It adds hats, hair and items the base figure does not have: hood, horns, halo,
  // laurel, bicorne, tricorn, cowboy, viking, chef, santa, witch, tiara, fullmask, wig; hair wild, bob, pompadour,
  // bun, mohawk; robe col (+robeLen), wings col; hold scythe, pitchfork, trident, bolt, torch, club, wand, gavel.
  const skinTones = { light: [252, 216, 168], pale: [246, 226, 210], tan: [230, 180, 130], brown: [160, 108, 72], dark: [110, 72, 48], orange: [252, 176, 100] };
  const faceFx = {
    skull: (c, w, h) => { c.fillStyle = '#f0ece0'; c.fillRect(0, 0, w, h); c.fillStyle = '#16161c'; for (const x of [0.32, 0.68]) { c.beginPath(); c.ellipse(w * x, h * 0.44, w * 0.12, h * 0.13, 0, 0, TAU); c.fill(); } c.beginPath(); c.moveTo(w * 0.5, h * 0.56); c.lineTo(w * 0.45, h * 0.66); c.lineTo(w * 0.55, h * 0.66); c.fill(); for (let i = 0; i < 5; i++) c.fillRect(w * (0.32 + i * 0.075), h * 0.74, w * 0.05, h * 0.1); },
    fangs: (c, w, h) => { c.fillStyle = '#fff'; for (const x of [0.43, 0.57]) { c.beginPath(); c.moveTo(w * (x - 0.03), h * 0.7); c.lineTo(w * (x + 0.03), h * 0.7); c.lineTo(w * x, h * 0.8); c.fill(); } },
    glasses: (c, w, h) => { c.strokeStyle = '#2a2a33'; c.lineWidth = w * 0.025; for (const x of [0.34, 0.66]) { c.beginPath(); c.arc(w * x, h * 0.45, w * 0.11, 0, TAU); c.stroke(); } c.beginPath(); c.moveTo(w * 0.45, h * 0.45); c.lineTo(w * 0.55, h * 0.45); c.stroke(); },
    clown: (c, w, h) => { c.fillStyle = '#f6f4f0'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a7a4a'; for (const x of [0.34, 0.66]) { c.beginPath(); c.moveTo(w * x, h * 0.3); c.lineTo(w * (x + 0.07), h * 0.45); c.lineTo(w * x, h * 0.6); c.lineTo(w * (x - 0.07), h * 0.45); c.fill(); } c.fillStyle = '#16161c'; for (const x of [0.34, 0.66]) { c.beginPath(); c.arc(w * x, h * 0.45, w * 0.04, 0, TAU); c.fill(); } c.fillStyle = '#d82020'; c.beginPath(); c.arc(w * 0.5, h * 0.58, w * 0.07, 0, TAU); c.fill(); c.beginPath(); c.moveTo(w * 0.22, h * 0.68); c.quadraticCurveTo(w * 0.5, h * 0.98, w * 0.78, h * 0.68); c.quadraticCurveTo(w * 0.5, h * 0.82, w * 0.22, h * 0.68); c.fill(); },
    alien: (c, w, h) => { c.fillStyle = '#9ad86a'; c.fillRect(0, 0, w, h); c.fillStyle = '#101014'; for (const [x, a] of [[0.32, 0.5], [0.68, -0.5]]) { c.beginPath(); c.ellipse(w * x, h * 0.45, w * 0.13, h * 0.17, a, 0, TAU); c.fill(); } c.fillRect(w * 0.45, h * 0.75, w * 0.1, h * 0.02); },
    zombie: (c, w, h) => { c.strokeStyle = '#3a2a2a'; c.lineWidth = w * 0.02; c.beginPath(); c.moveTo(w * 0.6, h * 0.15); c.lineTo(w * 0.85, h * 0.3); for (let i = 0; i < 4; i++) { c.moveTo(w * (0.63 + i * 0.06), h * (0.13 + i * 0.04)); c.lineTo(w * (0.6 + i * 0.06), h * (0.21 + i * 0.04)); } c.stroke(); },
    mummy: (c, w, h) => { c.fillStyle = '#e6dcc0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b8a888'; c.lineWidth = h * 0.03; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(0, h * (0.08 + i * 0.12)); c.lineTo(w, h * (0.12 + i * 0.12 + (i & 1 ? 0.04 : -0.03))); c.stroke(); } c.fillStyle = '#16161c'; c.fillRect(w * 0.2, h * 0.4, w * 0.6, h * 0.1); c.fillStyle = '#ffe060'; for (const x of [0.34, 0.66]) { c.beginPath(); c.arc(w * x, h * 0.45, w * 0.035, 0, TAU); c.fill(); } },
    eyeliner: (c, w, h) => { c.strokeStyle = '#16161c'; c.lineWidth = w * 0.025; for (const [x, d] of [[0.34, -1], [0.66, 1]]) { c.beginPath(); c.moveTo(w * (x - 0.08), h * 0.42); c.lineTo(w * (x + 0.08), h * 0.42); c.lineTo(w * (x + d * 0.14), h * 0.38); c.stroke(); } },
    sideburns: (c, w, h) => { c.fillStyle = '#16161c'; c.fillRect(0, h * 0.25, w * 0.1, h * 0.45); c.fillRect(w * 0.9, h * 0.25, w * 0.1, h * 0.45); },
    tan: (c, w, h) => { c.fillStyle = 'rgba(255,255,255,0.55)'; for (const x of [0.34, 0.66]) { c.beginPath(); c.ellipse(w * x, h * 0.45, w * 0.11, h * 0.08, 0, 0, TAU); c.fill(); } c.fillStyle = '#2a2a33'; for (const x of [0.34, 0.66]) { c.beginPath(); c.ellipse(w * x, h * 0.45, w * 0.045, h * 0.065, 0, 0, TAU); c.fill(); } },
  };
  const both = (...fs) => (c, w, h) => fs.forEach((f) => f && f(c, w, h));
  const CAST = {
    // ---- world leaders and billionaires (caricatures for obvious parody) ----
    trump: { suit: true, shirt: [26, 34, 70], pants: [26, 34, 70], tie: [210, 30, 40], hair: 'combover', skin: skinTones.orange, mouth: 'o', facePaint: faceFx.tan },
    putin: { suit: true, hair: 'thin', skin: skinTones.pale, mouth: 'flat', brows: 'raised' },
    kim: { shirt: [34, 34, 38], pants: [34, 34, 38], shirtPaint: (c, w, h) => { c.fillStyle = '#5a5a60'; for (let i = 0; i < 4; i++) c.beginPath(), c.arc(w / 2, h * (0.2 + i * 0.2), w * 0.025, 0, TAU), c.fill(); }, hair: 'flattop', mouth: 'grin', skin: [248, 218, 180] },
    biden: { suit: true, shirt: [40, 50, 80], pants: [40, 50, 80], tie: [60, 90, 180], hair: 'thin', hairCol: [240, 240, 240], shades: true, mouth: 'smile' },
    obama: { suit: true, tie: [60, 90, 180], hair: 'short', hairCol: [40, 36, 34], skin: skinTones.brown, mouth: 'grin' },
    xi: { suit: true, tie: [170, 30, 40], hair: 'short', hairCol: [24, 22, 26], mouth: 'smile' },
    musk: { shirt: [24, 24, 28], pants: [24, 24, 28], emblem: { txt: 'X', col: [240, 240, 240], bg: [24, 24, 28], shape: 'circle' }, hair: 'short', hairCol: [70, 50, 40], mouth: 'grin', hold: 'phone' },
    zuckerberg: { shirt: [140, 140, 148], pants: P.denim, hair: 'short', hairCol: [110, 70, 40], eyes: 'wide', mouth: 'flat', skin: [250, 228, 210] },
    bezos: { suit: true, shirt: [60, 70, 90], pants: [60, 70, 90], mouth: 'evil', brows: 'raised', skin: [246, 214, 180] },
    gates: { shirt: [90, 120, 170], pants: [120, 110, 90], hair: 'side', hairCol: [150, 120, 90], facePaint: faceFx.glasses, mouth: 'smile' },
    // ---- history ----
    hitler: { shirt: [120, 112, 90], pants: [70, 64, 52], hat: 'peaked', hatCol: [120, 112, 90], hair: 'side', hairCol: [40, 30, 26], mustache: 'toothbrush', eyes: 'angry', mouth: 'frown' },
    stalin: { shirt: [200, 196, 180], pants: [80, 80, 86], hair: 'short', hairCol: [60, 56, 52], mustache: 'big', mouth: 'flat', brows: 'raised' },
    napoleon: { shirt: [30, 50, 120], pants: [236, 232, 220], sleeve: [30, 50, 120], hat: 'bicorne', medals: 2, eyes: 'angry', mouth: 'frown', scale: 0.82 },
    caesar: { shirt: [240, 236, 226], robe: [240, 236, 226], shirtPaint: (c, w, h) => { c.fillStyle = '#7a2a8a'; c.beginPath(); c.moveTo(w * 0.15, 0); c.lineTo(w * 0.35, 0); c.lineTo(w * 0.9, h); c.lineTo(w * 0.7, h); c.fill(); }, hat: 'laurel', hair: 'short', hairCol: [90, 70, 50], mouth: 'smile' },
    cleopatra: { shirt: [240, 236, 226], robe: [240, 236, 226], shirtPaint: (c, w, h) => { c.fillStyle = '#e0b030'; c.fillRect(0, 0, w, h * 0.3); c.fillStyle = '#3070c8'; for (let i = 0; i < 6; i++) c.fillRect(w * (0.08 + i * 0.15), h * 0.22, w * 0.08, h * 0.06); }, hair: 'bob', skin: skinTones.tan, facePaint: faceFx.eyeliner, mouth: 'evil', hat: 'tiara' },
    einstein: { shirt: [150, 150, 156], pants: [100, 96, 90], hair: 'wild', hairCol: [244, 244, 244], mustache: 'big', mouth: 'open' },
    elvis: { shirt: [246, 246, 240], pants: [246, 246, 240], shirtPaint: (c, w, h) => { c.fillStyle = '#e0b030'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(w * (0.15 + (i % 3) * 0.35), h * (0.2 + Math.floor(i / 3) * 0.3), w * 0.03, 0, TAU); c.fill(); } }, hair: 'pompadour', facePaint: faceFx.sideburns, mouth: 'evil' },
    henry8: { shirt: [150, 24, 40], pants: [40, 30, 30], sleeve: [210, 170, 60], hat: 'beret', hatCol: [30, 24, 24], mustache: 'beard', hairCol: [190, 100, 40], mouth: 'grin', scale: 1.1 },
    lincoln: { suit: true, shirt: [26, 26, 30], pants: [26, 26, 30], hat: 'tophat', mustache: 'beard', hairCol: [40, 34, 30], mouth: 'flat' },
    // ---- myth, horror and the higher powers ----
    death: { shirt: [20, 20, 24], robe: [20, 20, 24], sleeve: [20, 20, 24], hat: 'hood', hatCol: [20, 20, 24], skin: [240, 236, 224], facePaint: faceFx.skull, hold: 'scythe' },
    devil: { shirt: [200, 30, 30], pants: [200, 30, 30], skin: [210, 50, 40], hat: 'horns', mustache: 'big', hairCol: [30, 10, 10], mouth: 'evil', brows: 'angry', hold: 'pitchfork', cape: [30, 10, 10] },
    angel: { shirt: [250, 250, 250], robe: [250, 250, 250], hat: 'halo', hair: 'short', hairCol: [240, 210, 120], wings: [250, 250, 250], mouth: 'smile' },
    zeus: { shirt: [250, 250, 250], robe: [250, 250, 250], hair: 'wild', hairCol: [240, 240, 240], mustache: 'beard', hold: 'bolt', brows: 'angry', mouth: 'flat' },
    illuminati: { shirt: [26, 20, 34], robe: [26, 20, 34], sleeve: [26, 20, 34], hat: 'hood', hatCol: [26, 20, 34], shirtPaint: (c, w, h) => { c.fillStyle = '#d8a83a'; c.beginPath(); c.moveTo(w * 0.5, h * 0.12); c.lineTo(w * 0.75, h * 0.8); c.lineTo(w * 0.25, h * 0.8); c.closePath(); c.fill(); c.fillStyle = '#fff8dc'; c.beginPath(); c.ellipse(w / 2, h * 0.55, w * 0.1, h * 0.08, 0, 0, TAU); c.fill(); c.fillStyle = '#2a1a10'; c.beginPath(); c.arc(w / 2, h * 0.55, h * 0.05, 0, TAU); c.fill(); }, mouth: 'evil' },
    reptilian: { suit: true, skin: [90, 170, 80], eyes: 'angry', mouth: 'evil', facePaint: (c, w, h) => { c.fillStyle = 'rgba(40,110,40,0.5)'; for (let i = 0; i < 18; i++) { c.beginPath(); c.arc(w * ((i * 37) % 100) / 100, h * ((i * 53) % 100) / 100, w * 0.04, 0, TAU); c.fill(); } } },
    alien: { shirt: [180, 186, 196], pants: [180, 186, 196], skin: [154, 216, 106], facePaint: faceFx.alien },
    dracula: { suit: true, shirt: [20, 20, 24], pants: [20, 20, 24], cape: [20, 20, 24], hair: 'side', hairCol: [20, 20, 24], skin: [236, 232, 236], facePaint: faceFx.fangs, mouth: 'evil', brows: 'angry' },
    mummy: { stripes: [[230, 222, 200], [206, 196, 170]], skin: [230, 222, 200], facePaint: faceFx.mummy },
    zombie: { shirt: [90, 110, 140], pants: [80, 70, 60], skin: [150, 190, 140], eyes: 'x', mouth: 'open', arms: [1.5, 1.5], facePaint: faceFx.zombie },
    santa: { shirt: [210, 30, 30], pants: [210, 30, 30], hat: 'santa', mustache: 'beard', hairCol: [250, 250, 250], mouth: 'grin', shirtPaint: (c, w, h) => { c.fillStyle = '#16161c'; c.fillRect(0, h * 0.7, w, h * 0.14); c.fillStyle = '#e0b030'; c.fillRect(w * 0.42, h * 0.68, w * 0.16, h * 0.18); } },
    // ---- jobs and types ----
    robber: { shirt: [30, 30, 36], pants: [30, 30, 36], balaclava: [30, 30, 36], hold: 'bag', mouth: 'grin' },
    prisoner: { stripes: [[240, 240, 236], [30, 30, 36]], number: '24601', mouth: 'frown', brows: 'worried' },
    cop: { shirt: [40, 60, 130], pants: [30, 40, 90], hat: 'police', emblem: { shape: 'circle', bg: [230, 190, 60], txt: '★', col: [120, 90, 20] }, mustache: 'big', mouth: 'flat' },
    soldier: { shirt: [84, 96, 62], pants: [70, 80, 52], hat: 'army', hold: 'gun', mouth: 'flat', brows: 'angry' },
    general: { shirt: [84, 96, 62], pants: [70, 80, 52], hat: 'peaked', medals: 9, mustache: 'big', hairCol: [200, 200, 200], mouth: 'frown' },
    ninja: { shirt: [24, 24, 28], pants: [24, 24, 28], hat: 'fullmask', hatCol: [24, 24, 28], maskEyes: 'slit', hold: 'sword' },
    pirate: { shirt: [240, 236, 220], pants: [60, 50, 90], hat: 'tricorn', mustache: 'beard', hairCol: [40, 30, 26], hold: 'sword', mouth: 'grin', facePaint: (c, w, h) => { c.fillStyle = '#16161c'; c.beginPath(); c.arc(w * 0.66, h * 0.45, w * 0.1, 0, TAU); c.fill(); c.fillRect(0, h * 0.3, w, h * 0.03); } },
    cowboy: { shirt: [190, 90, 60], pants: P.denim, hat: 'cowboy', mustache: 'big', hold: 'gun', mouth: 'evil' },
    viking: { shirt: [120, 90, 60], pants: [80, 60, 40], hat: 'viking', mustache: 'beard', hairCol: [220, 150, 60], hold: 'hammer', mouth: 'open' },
    caveman: { shirt: [200, 150, 60], pants: [200, 150, 60], shirtPaint: (c, w, h) => { c.fillStyle = '#5a3a1a'; for (let i = 0; i < 12; i++) { c.beginPath(); c.arc(w * ((i * 29) % 100) / 100, h * ((i * 47) % 100) / 100, w * 0.06, 0, TAU); c.fill(); } }, hair: 'wild', hairCol: [80, 50, 30], mustache: 'beard', hold: 'club', mouth: 'open' },
    chef: { shirt: [250, 250, 250], pants: [40, 40, 44], hat: 'chef', mustache: 'big', mouth: 'grin' },
    doctor: { shirt: [250, 250, 250], robe: [250, 250, 250], robeLen: 0.5, tie: [60, 120, 200], facePaint: faceFx.glasses, mouth: 'flat' },
    scientist: { shirt: [250, 250, 250], robe: [250, 250, 250], robeLen: 0.5, hair: 'wild', hairCol: [200, 200, 200], facePaint: faceFx.glasses, mouth: 'grin', eyes: 'wide' },
    judge: { shirt: [20, 20, 24], robe: [20, 20, 24], sleeve: [20, 20, 24], hat: 'wig', hold: 'gavel', mouth: 'frown', brows: 'angry' },
    clownGuy: { suit: true, shirt: [110, 50, 140], pants: [110, 50, 140], tie: [60, 160, 80], hair: 'short', hairCol: [60, 170, 70], facePaint: faceFx.clown, mouth: 'grin' },
    // ---- parody superheroes (never the real names or logos) ----
    batGuy: { shirt: [40, 40, 48], pants: [40, 40, 48], cape: [30, 30, 36], hat: 'cowl', emblem: { shape: 'circle', bg: [250, 210, 40], txt: '' }, mouth: 'frown', brows: 'angry' },
    ironDude: { shirt: [196, 36, 36], pants: [196, 36, 36], sleeve: [242, 196, 60], hat: 'helmet', emblem: { shape: 'circle', bg: [210, 250, 255] } },
    superDude: { shirt: [40, 80, 200], pants: [40, 80, 200], cape: [210, 30, 30], emblem: { txt: 'D', col: [210, 30, 30], bg: [250, 210, 40] }, hair: 'short', hairCol: [20, 20, 26], mouth: 'grin' },
    spiderBro: { shirt: [210, 30, 40], pants: [40, 70, 180], hat: 'fullmask', hatCol: [210, 30, 40], maskEyes: 'big', shirtPaint: (c, w, h) => { c.strokeStyle = 'rgba(20,20,30,0.6)'; c.lineWidth = w * 0.012; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(w / 2, h * 0.3); c.lineTo(w * (i / 6), i % 6 ? 0 : h); c.stroke(); } } },
    bigGreen: { shirt: [110, 180, 70], pants: [110, 60, 150], sleeve: [110, 180, 70], skin: [110, 180, 70], hair: 'short', hairCol: [30, 40, 30], eyes: 'angry', mouth: 'open', scale: 1.3 },
    capAmericano: { shirt: [40, 70, 170], pants: [40, 70, 170], emblem: { shape: 'circle', bg: [240, 240, 240], txt: '★', col: [40, 70, 170] }, hat: 'cap', hatCol: [40, 70, 170], hold: 'shield', holdArm: -1, mouth: 'smile' },
    wonderLady: { shirt: [200, 30, 40], pants: [40, 70, 170], hat: 'tiara', hair: 'long', hairCol: [30, 24, 22], emblem: { shape: 'circle', bg: [240, 200, 60], txt: 'W', col: [200, 30, 40] }, hold: 'sword' },
    thud: { shirt: [70, 70, 80], pants: [40, 40, 50], cape: [190, 30, 30], hair: 'long', hairCol: [230, 190, 90], mustache: 'beard', hold: 'hammer', mouth: 'grin' },
  };
  const actor = (S, x, z, s, rot, who, extra = {}) => {
    const o = Object.assign({}, CAST[who] || {}, extra);
    if (o.facePaint && extra.facePaint && CAST[who] && CAST[who].facePaint) o.facePaint = both(CAST[who].facePaint, extra.facePaint);
    s *= o.scale || 1;
    const baseHat = ['cap', 'police', 'beanie', 'hard', 'peaked', 'crown', 'tophat', 'cowl', 'helmet', 'army'].includes(o.hat);
    const baseHair = ['short', 'side', 'combover', 'flattop', 'thin', 'long', 'spiky'].includes(o.hair);
    S.figure(x, z, s, rot, Object.assign({}, o, { hat: baseHat ? o.hat : null, hair: baseHair ? o.hair : null, hold: o.hold }, o.robe && !o.robeLen ? { pants: o.robe } : {}));
    const T0 = (p) => add(rotY(mul(p, s), rot), [x, o.bob || 0, z]), HT = (p) => T0(rotY(p, o.headTurn || 0)), hc = o.hatCol, hair = o.hairCol || [60, 44, 32];
    const B = (T, c, w, h, d, col, opt = { bevel: 0.35 }) => S.box((p) => T(add(p, c)), w, h, d, col, opt);
    if (o.robe) { const L = o.robeLen || 0.93; B(T0, [0, 0.95 - L / 2, 0], 0.39, L / 2, 0.23, o.robe, { bevel: 0.2 }); }
    if (o.wings) for (const sd of [-1, 1]) S.box((p) => T0(add(rotY(rotZ(p, sd * 0.5), sd * 0.4), [sd * 0.45, 1.45, -0.32])), 0.32, 0.18, 0.02, o.wings, { bevel: 0.3 });
    // hair the base figure lacks
    if (o.hair === 'wild') { const r = H.rng(2); for (let i = 0; i < 9; i++) B(HT, [r.range(-0.3, 0.3), 2.1 + r.range(0, 0.15), r.range(-0.3, 0.1)], 0.11, 0.1, 0.11, hair, { bevel: 0.6 }); for (const sd of [-1, 1]) B(HT, [sd * 0.33, 1.95, -0.05], 0.06, 0.14, 0.2, hair, { bevel: 0.6 }); }
    if (o.hair === 'bob') { B(HT, [0, 2.17, -0.02], 0.32, 0.05, 0.3, hair); for (const sd of [-1, 1]) B(HT, [sd * 0.31, 1.85, -0.02], 0.03, 0.3, 0.3, hair); B(HT, [0, 1.85, -0.29], 0.32, 0.3, 0.03, hair); B(HT, [0, 2.08, 0.29], 0.3, 0.04, 0.02, hair); }
    if (o.hair === 'pompadour') { B(HT, [0, 2.18, -0.03], 0.31, 0.05, 0.29, hair); B(HT, [0, 2.26, 0.2], 0.28, 0.1, 0.14, hair, { bevel: 0.6 }); B(HT, [0, 1.98, -0.27], 0.31, 0.2, 0.03, hair); }
    if (o.hair === 'bun') { B(HT, [0, 2.17, -0.01], 0.31, 0.05, 0.29, hair); S.cyl((p) => HT(add(p, [0, 2.2, -0.1])), 0.14, 0.16, hair, 12); }
    if (o.hair === 'mohawk') B(HT, [0, 2.26, -0.02], 0.06, 0.12, 0.28, hair);
    // hats the base figure lacks
    const h = o.hat;
    if (h === 'hood') { const c = hc || [30, 30, 36]; B(HT, [0, 2.2, -0.02], 0.34, 0.05, 0.33, c); B(HT, [0, 1.86, -0.31], 0.34, 0.36, 0.03, c); for (const sd of [-1, 1]) B(HT, [sd * 0.33, 1.86, -0.02], 0.03, 0.36, 0.32, c); S.box((p) => HT(add(rotX(p, -0.5), [0, 2.3, -0.2])), 0.12, 0.12, 0.08, c, { bevel: 0.4 }); }
    if (h === 'horns') for (const sd of [-1, 1]) S.box((p) => HT(add(rotZ(p, -sd * 0.5), [sd * 0.22, 2.26, 0.05])), 0.04, 0.12, 0.04, [250, 240, 220], { bevel: 0.5 });
    if (h === 'halo') S.cyl((p) => HT(add(p, [0, 2.42, 0])), 0.28, 0.025, [255, 220, 80], 18);
    if (h === 'laurel') B(HT, [0, 2.1, 0], 0.32, 0.04, 0.3, [80, 150, 60], { bevel: 0.4, paint: (c, w, h2) => { c.fillStyle = '#5aa040'; for (let i = 0; i < 8; i++) { c.beginPath(); c.ellipse(w * (0.06 + i * 0.125), h2 / 2, w * 0.05, h2 * 0.4, 0.5, 0, TAU); c.fill(); } } });
    if (h === 'bicorne') S.box((p) => HT(add(rotZ(p, 0), [0, 2.28, 0])), 0.5, 0.12, 0.1, hc || [24, 24, 30], { bevel: 0.5, paint: (c, w, h2) => { c.fillStyle = '#d02a2a'; c.beginPath(); c.arc(w * 0.5, h2 * 0.5, h2 * 0.3, 0, TAU); c.fill(); c.fillStyle = '#f4f4f0'; c.beginPath(); c.arc(w * 0.5, h2 * 0.5, h2 * 0.18, 0, TAU); c.fill(); } });
    if (h === 'tricorn') { B(HT, [0, 2.22, 0], 0.34, 0.07, 0.32, hc || [24, 24, 30]); B(HT, [0, 2.3, 0.02], 0.42, 0.04, 0.4, hc || [24, 24, 30], { bevel: 0.4, paint: (c, w, h2) => { c.fillStyle = '#f4f4f0'; c.beginPath(); c.arc(w / 2, h2 / 2, h2 * 0.35, 0, TAU); c.fill(); } }); }
    if (h === 'cowboy') { S.cyl((p) => HT(add(p, [0, 2.15, 0])), 0.5, 0.03, hc || [130, 86, 50], 18); B(HT, [0, 2.3, 0], 0.26, 0.13, 0.24, hc || [130, 86, 50]); }
    if (h === 'viking') { S.cyl((p) => HT(add(p, [0, 2.1, 0])), 0.35, 0.16, [160, 164, 172], 16); for (const sd of [-1, 1]) S.box((p) => HT(add(rotZ(p, -sd * 0.6), [sd * 0.38, 2.32, 0])), 0.05, 0.16, 0.05, [246, 240, 220], { bevel: 0.5 }); }
    if (h === 'chef') { S.cyl((p) => HT(add(p, [0, 2.15, 0])), 0.28, 0.3, [250, 250, 250], 16); S.cyl((p) => HT(add(p, [0, 2.42, 0])), 0.36, 0.12, [250, 250, 250], 16); }
    if (h === 'santa') { B(HT, [0, 2.16, 0], 0.34, 0.05, 0.32, [250, 250, 250]); S.box((p) => HT(add(rotZ(p, -0.4), [0.06, 2.32, 0])), 0.24, 0.13, 0.24, [210, 30, 30], { bevel: 0.45 }); B(HT, [0.24, 2.36, 0], 0.07, 0.07, 0.07, [250, 250, 250], { bevel: 0.7 }); }
    if (h === 'witch') { S.cyl((p) => HT(add(p, [0, 2.15, 0])), 0.46, 0.03, hc || [30, 24, 40], 18); for (let i = 0; i < 4; i++) S.cyl((p) => HT(add(p, [0.02 * i, 2.18 + i * 0.13, 0])), 0.26 - i * 0.06, 0.13, hc || [30, 24, 40], 12); }
    if (h === 'tiara') B(HT, [0, 2.1, 0.02], 0.31, 0.04, 0.29, [240, 200, 60], { bevel: 0.4, paint: (c, w, h2) => { c.fillStyle = '#d82020'; c.beginPath(); c.arc(w / 2, h2 / 2, h2 * 0.35, 0, TAU); c.fill(); } });
    if (h === 'beret') S.box((p) => HT(add(rotZ(p, 0.15), [0.04, 2.2, 0])), 0.36, 0.06, 0.33, hc || [30, 30, 36], { bevel: 0.6 });
    if (h === 'wig') { B(HT, [0, 2.19, -0.02], 0.34, 0.06, 0.32, [240, 240, 236], { bevel: 0.6 }); for (const sd of [-1, 1]) B(HT, [sd * 0.35, 1.8, -0.05], 0.06, 0.32, 0.22, [240, 240, 236], { bevel: 0.6, paint: (c, w, h2) => { c.strokeStyle = '#c8c8c0'; c.lineWidth = h2 * 0.03; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(0, (h2 * i) / 6); c.lineTo(w, (h2 * i) / 6); c.stroke(); } } }); }
    if (h === 'fullmask') B(HT, [0, 1.86, 0], 0.315, 0.315, 0.295, hc || [24, 24, 28], { bevel: 0.28, paint: (c, w, h2) => { if (o.maskEyes === 'slit') { c.fillStyle = css(o.skin || P.skin); c.fillRect(w * 0.15, h2 * 0.38, w * 0.7, h2 * 0.16); c.fillStyle = '#2a2a33'; for (const ex of [0.34, 0.66]) { c.beginPath(); c.ellipse(w * ex, h2 * 0.46, w * 0.05, h2 * 0.05, 0, 0, TAU); c.fill(); } } else { c.fillStyle = '#f4f4f0'; c.strokeStyle = '#16161c'; c.lineWidth = w * 0.03; for (const [ex, a] of [[0.32, 0.4], [0.68, -0.4]]) { c.beginPath(); c.ellipse(w * ex, h2 * 0.45, w * 0.14, h2 * 0.1, a, 0, TAU); c.fill(); c.stroke(); } } } });
    // things to hold the base figure lacks
    const arms = o.arms || [0.15, 0.15], sd = o.holdArm || 1, ang = arms[sd < 0 ? 0 : 1];
    const HD = (p) => T0(add(rotZ(add(p, [0, -0.7, 0.04]), sd * ang), [sd * 0.47, 1.42, 0]));
    const it = o.hold;
    if (it === 'scythe') { S.box((p) => HD(add(p, [0, 0.3, 0.06])), 0.025, 0.9, 0.025, [90, 64, 40], { bevel: 0.3 }); S.box((p) => HD(add(rotX(p, 0.3), [0, 1.15, 0.3])), 0.015, 0.06, 0.32, [200, 206, 216], { bevel: 0.3 }); }
    if (it === 'pitchfork' || it === 'trident') { S.box((p) => HD(add(p, [0, 0.3, 0.06])), 0.025, 0.85, 0.025, it === 'trident' ? [230, 190, 60] : [40, 20, 20], { bevel: 0.3 }); for (const px of [-0.1, 0, 0.1]) S.box((p) => HD(add(p, [px, 1.2, 0.06])), 0.02, 0.12, 0.02, it === 'trident' ? [230, 190, 60] : [40, 20, 20], { bevel: 0.3 }); S.box((p) => HD(add(p, [0, 1.08, 0.06])), 0.12, 0.02, 0.02, it === 'trident' ? [230, 190, 60] : [40, 20, 20], { bevel: 0.3 }); }
    if (it === 'bolt') for (let i = 0; i < 3; i++) S.box((p) => HD(add(rotZ(p, i & 1 ? -0.6 : 0.6), [(i & 1) * 0.06, 0.15 + i * 0.16, 0.06])), 0.03, 0.1, 0.03, [255, 220, 40], { bevel: 0.3 });
    if (it === 'torch') { S.box((p) => HD(add(p, [0, 0.15, 0.06])), 0.03, 0.25, 0.03, [100, 70, 40], { bevel: 0.3 }); S.box((p) => HD(add(p, [0, 0.45, 0.06])), 0.07, 0.08, 0.07, [255, 150, 40], { bevel: 0.6 }); }
    if (it === 'club') S.box((p) => HD(add(rotX(p, 0.3), [0, 0.2, 0.1])), 0.06, 0.3, 0.06, [120, 80, 40], { bevel: 0.7 });
    if (it === 'wand') S.box((p) => HD(add(p, [0, 0.02, 0.2])), 0.015, 0.015, 0.2, [40, 30, 30], { bevel: 0.3 });
    if (it === 'gavel') { S.box((p) => HD(add(p, [0, 0, 0.14])), 0.02, 0.02, 0.14, [110, 70, 40], { bevel: 0.3 }); S.box((p) => HD(add(p, [0, 0, 0.3])), 0.09, 0.05, 0.05, [110, 70, 40], { bevel: 0.4 }); }
  };

  // ==================== makeComedy: a whole reel from short per-beat specs ====================
  // makeComedy({ badge, badgeCol, captions, beats: ({ V, B }) => ({ beatId: spec, ... }), sound(k, fx, ctx) })
  // spec = {
  //   set: 'office' | 'bunker' | 'prison' | 'lair' | 'desert' | 'stage' | 'heaven' | 'hell' | 'graveyard' | 'moon' |
  //        'base' | 'bank' | 'palace' | 'court' | 'street' | 'city' | 'sky' | 'space' | 'lawn' | 'museum',  opt: {...},
  //   cam: 'wide' | 'mid' | 'close' | 'low' | 'high' | 'pull' | [eye0, target0, eye1, target1],  at: x or [x0, x1] (pan),
  //   shake: time (camera shake from that moment),
  //   cast: [[who | null, x, z, rot, extra | (t, u) => extra]]  (who = a CAST name; null = plain S.figure with extra;
  //          extra may also return x, z, rot, s to move the actor; u = 0..1 through the beat),
  //   props: (S, t, u) => {...},  tags: [[x, y, z, 'TEXT', time, colour, width]] (keep tags at z -0.5..0.6 and
  //   y 0.3..2.6 so they stay in frame and below the captions),  booms: [[x, y, z, time, scale]],
  //   flash: [times],  over: (ctx, W, H_, t, u) => {...} (2D on top),  sfx: [['name', time, opts]] }
  // Tags pop with a sound, booms explode with a hit, a flash and a shake. Everything else is the normal reel.
  const SETS = { office: officeShot, bunker: bunkerShot, prison: prisonShot, lair: lairShot, desert: desertShot, stage: stageShot, heaven: heavenShot, hell: hellShot, graveyard: graveyardShot, moon: moonShot, base: baseShot, bank: bankShot, palace: palaceShot, court: courtShot, street: streetShot,
    city: (ctx, W, H_, t, E, TG, b, o = {}) => cityShot(ctx, W, H_, t, E, TG, b, o.night == null ? 1 : o.night),
    sky: (ctx, W, H_, t, E, TG, b, o = {}) => skyShot(ctx, W, H_, t, E, TG, b, o.night || 0),
    space: (ctx, W, H_, t, E, TG, b) => spaceShot(ctx, W, H_, t, E, TG, b),
    lawn: (ctx, W, H_, t, E, TG, b, o = {}) => lawnShot(ctx, W, H_, t, E, TG, b, o.night || 0),
    museum: (ctx, W, H_, t, E, TG, b, o = {}) => museumShot(ctx, W, H_, E, TG, b, o.wall, o.night || 0) };
  const CAMS = { wide: [[0.3, 2.4, 6.8], [0, 1.25, 0], [0.15, 2.25, 6.0], [0, 1.3, 0]], mid: [[0.25, 2.1, 4.8], [0, 1.45, 0], [0.1, 2.0, 4.1], [0, 1.5, 0]],
    close: [[0.1, 1.95, 3.0], [0, 1.75, 0], [0, 1.9, 2.5], [0, 1.78, 0]], low: [[0.5, 0.7, 4.4], [0, 1.6, 0], [0.3, 0.8, 3.7], [0, 1.65, 0]],
    high: [[0, 5.5, 4.2], [0, 0.6, 0], [0, 5.0, 3.6], [0, 0.6, 0]], pull: [[0.1, 2.0, 3.4], [0, 1.6, 0], [0.3, 2.5, 7.2], [0, 1.25, 0]] };
  const TAGCOL = { red: P.red, yellow: P.yellow, green: P.green, blue: P.blue, orange: P.orange, dark: [40, 40, 48], white: [236, 236, 236], purple: [130, 60, 170] };
  const pulse = (t, at, k = 6) => Math.exp(-Math.pow((t - at) * k, 2));
  const comedyShot = (sp) => (ctx, W, H_, t, a, b) => {
    const u = H.clamp((t - a) / Math.max(0.01, b - a));
    const cam = Array.isArray(sp.cam) ? sp.cam : CAMS[sp.cam || 'wide'];
    const at = sp.at == null ? 0 : Array.isArray(sp.at) ? H.lerp(sp.at[0], sp.at[1], H.ease.inOut(u)) : sp.at;
    const sh = [...(sp.shake != null ? [sp.shake] : []), ...(sp.booms || []).map((bm) => bm[3])].reduce((m, s0) => Math.max(m, t > s0 ? Math.exp(-(t - s0) * 3) : 0), 0);
    const jig = (v, i) => v + (i < 2 ? Math.sin(t * 61 + i * 7) * 0.08 * sh : 0);
    let [E, TG] = shotCam(t, a, b, cam[0].map((v, i) => (i ? v : v + at)), cam[1].map((v, i) => (i ? v : v + at)), cam[2].map((v, i) => (i ? v : v + at)), cam[3].map((v, i) => (i ? v : v + at)));
    E = E.map(jig); TG = TG.map(jig);
    const S = (SETS[sp.set] || SETS.office)(ctx, W, H_, t, E, TG, (S) => {
      for (const [who, x, z, rot, ex] of sp.cast || []) {
        const e = Object.assign({}, typeof ex === 'function' ? ex(t, u) : ex || {});
        const px = e.x == null ? x : e.x, pz = e.z == null ? z : e.z, pr = e.rot == null ? rot || 0 : e.rot, ps = e.s || 0.9;
        delete e.x; delete e.z; delete e.rot; delete e.s;
        if (e.hide) continue;
        if (who) actor(S, px, pz, ps, pr, who, e); else S.figure(px, pz, ps, pr, e);
      }
      if (sp.props) sp.props(S, t, u);
      for (const [x, y, z, txt, tm, col, wd] of sp.tags || []) { const d = Math.hypot(E[0] - x, E[1] - y, E[2] - z), k = H.clamp(d / 5.2, 0.38, 1); S.tag(x, y, z, txt, popU(t, tm) * k, -0.05, Array.isArray(col) ? col : TAGCOL[col || 'red'], wd || Math.max(0.42, 0.14 + txt.length * 0.055)); } // tags shrink when the camera is close
      for (const [x, y, z, tm, sc] of sp.booms || []) boom(S, x, y, z, sc || 1.4, (t - tm) * 1.6);
    }, sp.opt || {});
    if (sp.over) sp.over(ctx, W, H_, t, u);
    let fl = 0; for (const tm of [...(sp.flash || []), ...(sp.booms || []).map((bm) => bm[3])]) fl = Math.max(fl, 0.35 * pulse(t, tm));
    return fl;
  };
  const makeComedy = (cfg) => {
    let specs = {};
    makeReel({ badge: cfg.badge, badgeCol: cfg.badgeCol, captions: cfg.captions,
      shots: (cx) => { specs = cfg.beats(cx); const out = {}; for (const id in specs) out[id] = comedyShot(specs[id]); return out; },
      sound: (k, fx, cx) => {
        for (const id in specs) { const s = specs[id];
          (s.tags || []).forEach((tg, i) => k.play('pop', tg[4], { f: 480 + ((i * 97) % 300), gain: 0.45 }));
          (s.booms || []).forEach((bm) => { k.play('impact', bm[3], { gain: 0.7 }); k.play('thud', bm[3], { f: 70, gain: 0.7 }); k.noise(bm[3], { dur: 1.1, color: 'brown', filter: 'lowpass', f: 500, gain: 0.3, a: 0.01 }); });
          (s.flash || []).forEach((tm) => k.play('slap', tm, { gain: 0.5 }));
          (s.sfx || []).forEach(([name, tm, o]) => k.play(name, tm, o || {}));
        }
        if (cfg.sound) cfg.sound(k, fx, cx);
      } });
  };
