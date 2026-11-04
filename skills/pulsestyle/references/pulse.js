// PULSE STYLE — flat-vector science explainer reels (9:16, 720x1280).
// Original style: flat shapes with no outlines and two-tone cel shading (light rim top-left, shade rim bottom-right),
// deep indigo/violet gradient worlds, zoom-through transitions from body to cell scale, rounded pill labels,
// small 2-3 word captions, a big title card. Every frame is a pure function of t.
// Contents: P.PAL palette, shape paths, P.flat shading, backgrounds, P.lifter character + barbell, P.fiber, P.filaments,
// P.cellStar, icons (moon, egg, bulb, calendar), FX (zap, sparkles, confetti, tears, dust), P.label, P.title,
// P.caption + script timing (timeScript, words, chunks, wt), cameras (push, zoomThrough, shake), P.finish,
// and an example explainer ("What leg day does to your muscles") with its sound score.
(function () {
  const P = (window.P = {});
  const TAU = Math.PI * 2;
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  P.cl = cl; P.lerp = lerp;
  P.FONT = '"Nunito", "Arial Rounded MT Bold", system-ui, sans-serif';

  // ---------------- palette ----------------
  P.PAL = {
    ink: '#120a4f', night: '#1a0d78', indigo: '#2b17b0', blue: '#3f53f0', sky: '#5a8bff',
    violet: '#6d1cc9', grape: '#9b2fe0', magenta: '#e423b8', pink: '#ff5b93', red: '#ff3a4c',
    orange: '#ff7a1a', amber: '#ffb52e', yellow: '#ffe26a', cream: '#fff3c4', bone: '#fff9ea',
    cyan: '#3fe0ff', aqua: '#86f7e2', mint: '#3ddc97', teal: '#13b5a8', green: '#2fd16a',
    skin: '#f6a37d', skinD: '#d97b5b', hair: '#2a1650', grey: '#a9b3d6', steel: '#d7defa', white: '#ffffff',
  };
  const hex = (h) => { if (h.startsWith('rgb')) return h.replace(/[^\d.,]/g, '').split(',').slice(0, 3).map(Number); h = h.replace('#', ''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const rgb = (a, al = 1) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
  const mixc = (c1, c2, t) => { const a = hex(c1), b = hex(c2); return rgb([0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t)); };
  P.shade = (c, k = 0.28) => mixc(c, '#1a0b5e', k);   // shade toward indigo, never toward grey/black
  P.light = (c, k = 0.3) => mixc(c, '#ffffff', k);
  P.alpha = (c, a) => rgb(hex(c), a);

  // ---------------- paths (functions that trace onto ctx) ----------------
  P.rr = (x, y, w, h, r) => (c) => { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
  P.circ = (x, y, r) => (c) => { c.beginPath(); c.arc(x, y, Math.max(0.1, r), 0, TAU); };
  P.ell = (x, y, rx, ry, rot = 0) => (c) => { c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot, 0, TAU); };
  P.capsule = (x1, y1, x2, y2, r1, r2 = r1) => (c) => {
    const a = Math.atan2(y2 - y1, x2 - x1); c.beginPath();
    c.arc(x1, y1, r1, a + Math.PI / 2, a - Math.PI / 2); c.arc(x2, y2, r2, a - Math.PI / 2, a + Math.PI / 2); c.closePath();
  };
  P.poly = (pts) => (c) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); };
  // smooth closed blob through points (quadratic midpoints)
  P.blob = (pts) => (c) => {
    const n = pts.length, m = (i) => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2];
    c.beginPath(); const s = m(0); c.moveTo(s[0], s[1]);
    for (let i = 1; i <= n; i++) { const p = pts[i % n], q = m(i); c.quadraticCurveTo(p[0], p[1], q[0], q[1]); } c.closePath();
  };

  // ---------------- flat two-tone shading ----------------
  // fill a path with base colour, a lighter rim at the top-left and a shade rim at the bottom-right. No outlines.
  P.flat = (ctx, path, color, o = {}) => {
    const sh = o.shade == null ? 0.3 : o.shade, li = o.light == null ? 0.22 : o.light, off = o.off == null ? 7 : o.off, lo = o.lo == null ? 3 : o.lo;
    ctx.save(); path(ctx); ctx.clip();
    ctx.fillStyle = sh ? P.shade(color, sh) : color; ctx.fillRect(-4000, -4000, 8000, 8000);
    if (li) { ctx.save(); ctx.translate(-off, -off); path(ctx); ctx.fillStyle = P.light(color, li); ctx.fill(); ctx.restore(); }
    ctx.translate(-off + (li ? lo : 0), -off + (li ? lo : 0)); path(ctx); ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  };
  P.fill = (ctx, path, color) => { path(ctx); ctx.fillStyle = color; ctx.fill(); };
  // soft round ground shadow
  P.shadow = (ctx, x, y, rx, ry, a = 0.25) => { ctx.save(); ctx.fillStyle = `rgba(18,8,70,${a})`; P.ell(x, y, rx, ry)(ctx); ctx.fill(); ctx.restore(); };
  // radial glow
  P.glow = (ctx, x, y, r, color, a = 0.6) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, P.alpha(color, a)); g.addColorStop(1, P.alpha(color, 0));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
  };

  // ---------------- backgrounds ----------------
  const BG = {
    deep: ['#17097a', '#2a1cc4', '#4a47ec'],     // inside the body: deep indigo to blue
    violet: ['#2c0a7d', '#5a12b8', '#8f1fd0'],   // story / time beats
    night: ['#0c0640', '#1a0d78', '#2b1aa8'],    // dark dramatic beats
    plum: ['#3a0a6a', '#6a1290', '#a01e9a'],     // warm pain / inflammation beats
  };
  // dots: slow drifting specks in the background (seeded)
  P.bg = (ctx, W, H, name = 'deep', t = 0, o = {}) => {
    const c = BG[name] || BG.deep, g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, c[0]); g.addColorStop(0.55, c[1]); g.addColorStop(1, c[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (o.dots !== false) {
      const r = H_rng(name + 'dots');
      for (let i = 0; i < 26; i++) {
        const x0 = r() * W, y0 = r() * H, s = 2 + r() * 5, sp = 6 + r() * 14;
        const y = ((y0 - t * sp) % H + H) % H, x = x0 + Math.sin(t * 0.4 + i) * 10;
        ctx.fillStyle = `rgba(255,255,255,${0.05 + r() * 0.1})`; P.circ(x, y, s)(ctx); ctx.fill();
      }
    }
  };
  const H_rng = (s) => (window.H ? H.rng(s) : Math.random);

  // the gym: bright aqua room, tall windows with light shafts, dumbbell racks, dark floor mats
  P.gym = (ctx, W, H, t = 0, o = {}) => {
    const g = ctx.createLinearGradient(0, 0, 0, H * 0.72);
    g.addColorStop(0, '#22b8e8'); g.addColorStop(1, '#8ff3e0'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // windows
    for (let i = 0; i < 3; i++) {
      const x = 40 + i * 240; ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(x, 60, 170, 600);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 20, 60, 34, 600);
    }
    // light shafts
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 3; i++) { const x = 60 + i * 240 + Math.sin(t * 0.3 + i) * 6; P.poly([[x, 0], [x + 110, 0], [x + 260, 1280], [x + 120, 1280]])(ctx); ctx.fill(); }
    ctx.restore();
    // racks of dumbbells along the back wall
    const fy = H * 0.66;
    for (const side of [-1, 1]) {
      const rx = side < 0 ? 0 : W - 190;
      P.flat(ctx, P.rr(rx, fy - 150, 190, 18, 6), '#1c8fb8', { light: 0.15 });
      P.flat(ctx, P.rr(rx, fy - 70, 190, 18, 6), '#1c8fb8', { light: 0.15 });
      for (let k = 0; k < 4; k++) for (let row = 0; row < 2; row++) {
        const bx = rx + 26 + k * 46, by = fy - 172 + row * 80;
        P.flat(ctx, P.rr(bx - 18, by - 4, 36, 26, 9), '#1b5f8f', { off: 4, lo: 2 });
      }
    }
    // floor
    const fg = ctx.createLinearGradient(0, fy, 0, H); fg.addColorStop(0, '#5fe6d4'); fg.addColorStop(1, '#2bb5c7');
    ctx.fillStyle = fg; ctx.fillRect(0, fy, W, H - fy);
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(0, fy, W, 6);
    // mat
    P.flat(ctx, P.rr(-40, H * 0.84, 300, 260, 30), '#1f6c9a', { light: 0.1 });
  };

  // ---------------- character: the lifter ----------------
  // Original figure: round head, short spiky dark hair, orange sweatband, teal tank top, navy shorts, chunky limbs.
  // pose: { squat 0..1, arms: 'bar' | 'press' | 'flex' | 'down' | 'curl', arms2, mix 0..1 (blend arms->arms2),
  //         bulk 0..1 (muscle size), wince 0..1, look -1..1, blink 0..1, bar: true, plate: colour }
  const ARMS = {
    down: (sw, sy) => ({ e: [sw + 10, sy + 52], h: [sw + 14, sy + 104] }),
    bar: (sw, sy) => ({ e: [sw + 26, sy + 34], h: [sw + 30, sy - 6] }),
    press: (sw, sy) => ({ e: [sw + 22, sy - 52], h: [sw + 18, sy - 108] }),
    flex: (sw, sy) => ({ e: [sw + 62, sy + 4], h: [sw + 58, sy - 58] }),
    curl: (sw, sy) => ({ e: [sw + 8, sy + 54], h: [sw + 30, sy + 10] }),
  };
  P.lifter = (ctx, x, y, s = 1, pose = {}) => {
    const PAL = P.PAL, sq = pose.squat || 0, bulk = pose.bulk || 0, bw = 1 + bulk * 0.28;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    P.shadow(ctx, 0, 4, 120, 18, 0.22);
    const hipY = -150 + sq * 58, shY = hipY - 104 - bulk * 6, sw = 46 * bw;
    // legs (front view, knees push out in a squat)
    for (const sd of [-1, 1]) {
      const lift = pose.run == null ? 0 : Math.max(0, Math.sin(pose.run + (sd > 0 ? 0 : Math.PI)));
      const hx = sd * 24, fx = sd * (44 + sq * 14 - lift * 14), kx = sd * (40 + sq * 46 - lift * 16), ky = lerp(-78, -66, sq) - lift * 52, fy = -lift * 46;
      P.flat(ctx, P.capsule(hx, hipY + 10, kx, ky, 21 * bw, 19 * bw), PAL.skin, { off: 6 });
      P.flat(ctx, P.capsule(kx, ky, fx, fy - 16, 18 * bw, 14), PAL.skin, { off: 6 });
      P.flat(ctx, P.rr(fx - 22 + sd * 6, fy - 24, 44, 24, 11), '#f4f4ff', { off: 4, lo: 2 }); // shoes
      P.fill(ctx, P.rr(fx - 22 + sd * 6, fy - 6, 44, 7, 3), '#3b3f9e');
    }
    // shorts
    P.flat(ctx, P.blob([[-50 * bw, hipY - 22], [50 * bw, hipY - 22], [58 * bw, hipY + 34], [8, hipY + 40], [0, hipY + 18], [-8, hipY + 40], [-58 * bw, hipY + 34]]), '#272a8f', { off: 6 });
    // torso (tank top) with shoulders
    const torso = P.blob([[-sw, shY + 4], [-sw * 0.55, shY - 10], [sw * 0.55, shY - 10], [sw, shY + 4], [sw * 0.86, shY + 52], [38 * bw * 0.95, hipY - 14], [-38 * bw * 0.95, hipY - 14], [-sw * 0.86, shY + 52]]);
    P.flat(ctx, torso, PAL.skin, { off: 7 });
    P.flat(ctx, P.blob([[-sw * 0.62, shY + 6], [-sw * 0.3, shY - 4], [0, shY + 22], [sw * 0.3, shY - 4], [sw * 0.62, shY + 6], [sw * 0.8, shY + 54], [36 * bw, hipY - 12], [-36 * bw, hipY - 12], [-sw * 0.8, shY + 54]]), PAL.teal, { off: 7 });
    P.fill(ctx, P.rr(-36 * bw, hipY - 26, 72 * bw, 12, 6), P.shade(PAL.teal, 0.2));
    const bel = pose.belly || 0;
    if (bel > 0.02) { P.flat(ctx, P.ell(0, hipY - 30 - bel * 6, 36 + bel * 38, 26 + bel * 30), PAL.teal, { off: 8, light: 0.18 }); P.fill(ctx, P.ell(0, hipY - 8 + bel * 6, 14 + bel * 20, 5 + bel * 3), 'rgba(18,8,70,0.18)'); }
    // arms
    const A0 = ARMS[pose.arms || 'down'], A1 = ARMS[pose.arms2 || pose.arms || 'down'], m = pose.mix || 0;
    const hands = [];
    for (const sd of [-1, 1]) {
      const a = A0(sw - 6, shY + 10), b = A1(sw - 6, shY + 10);
      let e = [sd * lerp(a.e[0], b.e[0], m), lerp(a.e[1], b.e[1], m)], h = [sd * lerp(a.h[0], b.h[0], m), lerp(a.h[1], b.h[1], m)];
      if (pose.run != null) { const sw2 = Math.sin(pose.run + (sd > 0 ? Math.PI : 0)); e = [sd * (sw + 8), shY + 62 + sw2 * 8]; h = [sd * (sw - 4), shY + 40 - sw2 * 40]; }
      const sx = sd * (sw - 8), sy = shY + 12;
      P.flat(ctx, P.capsule(sx, sy, e[0], e[1], 17 * bw, 14 * bw), PAL.skin, { off: 6 });
      if (bulk > 0.05 && (pose.arms2 === 'flex' || pose.arms === 'flex')) P.flat(ctx, P.circ(lerp(sx, e[0], 0.55), lerp(sy, e[1], 0.55) - 10 * bw, 15 * bw * (0.6 + bulk * 0.6)), PAL.skin, { off: 5 });
      P.flat(ctx, P.capsule(e[0], e[1], h[0], h[1], 14 * bw, 12 * bw), PAL.skin, { off: 6 });
      P.flat(ctx, P.circ(h[0], h[1], 14 * bw), PAL.skin, { off: 4, lo: 2 });
      hands.push(h);
    }
    // head
    const hy = shY - 46, look = (pose.look || 0) * 6, w = pose.wince || 0;
    P.flat(ctx, P.rr(-12, shY - 22, 24, 26, 8), PAL.skinD, { light: 0, off: 0 });
    P.flat(ctx, P.circ(0, hy, 40), PAL.skin, { off: 7 });
    // hair: spiky tuft
    P.flat(ctx, P.blob([[-40, hy - 6], [-38, hy - 34], [-20, hy - 52], [-6, hy - 44], [6, hy - 58], [20, hy - 46], [36, hy - 44], [41, hy - 14], [30, hy - 22], [-30, hy - 22]]), PAL.hair, { off: 5, light: 0.15 });
    P.fill(ctx, P.rr(-41, hy - 22, 82, 12, 6), PAL.orange); // sweatband
    P.fill(ctx, P.rr(-41, hy - 14, 82, 4, 2), P.shade(PAL.orange, 0.25));
    // eyes
    const blink = pose.blink || 0;
    for (const sd of [-1, 1]) {
      const ex = sd * 15 + look, ey = hy + 4;
      const sk = 1 + (pose.shock || 0) * 0.35;
      ctx.fillStyle = '#ffffff'; P.ell(ex, ey, 9 * sk, Math.max(1, 11 * sk * (1 - blink) * (1 - w * 0.55)))(ctx); ctx.fill();
      ctx.fillStyle = PAL.ink; P.circ(ex + look * 0.4 + sd * 1, ey + 2, 5 * (1 - blink * 0.9) / Math.sqrt(sk))(ctx); ctx.fill();
      if (w > 0.05) { ctx.strokeStyle = PAL.hair; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - sd * 10, ey - 15 - w * 2); ctx.lineTo(ex + sd * 9, ey - 11 + w * 4); ctx.stroke(); }
    }
    // mouth
    ctx.fillStyle = PAL.ink; ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    if ((pose.shock || 0) > 0.3 || pose.pant) { const oy = pose.pant ? 0.6 + 0.4 * Math.abs(Math.sin(pose.pant)) : 1; P.fill(ctx, P.ell(0, hy + 24, 9, 11 * oy), PAL.ink); P.fill(ctx, P.ell(0, hy + 29 * (0.85 + 0.15 * oy), 6, 3.5 * oy), PAL.pink); }
    else if (w > 0.3) { ctx.beginPath(); ctx.moveTo(-9, hy + 24); for (let i = 1; i <= 4; i++) ctx.lineTo(-9 + i * 4.5, hy + 24 + (i % 2 ? -3 : 0)); ctx.stroke(); }
    else if (pose.smile) { ctx.beginPath(); ctx.arc(0, hy + 18, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-6, hy + 24); ctx.lineTo(6, hy + 24); ctx.stroke(); }
    P.fill(ctx, P.circ(-26, hy + 16, 6), 'rgba(255,90,120,0.35)'); P.fill(ctx, P.circ(26, hy + 16, 6), 'rgba(255,90,120,0.35)');
    // barbell between the hands
    if (pose.bar) P.barbell(ctx, (hands[0][0] + hands[1][0]) / 2, (hands[0][1] + hands[1][1]) / 2, 1, pose.plate);
    ctx.restore();
    return { hipY: y + hipY * s, shY: y + shY * s, thigh: [x + 46 * s, y + (hipY + 40) * s], hands: hands.map(([a, b]) => [x + a * s, y + b * s]) };
  };
  P.barbell = (ctx, x, y, s = 1, plate = P.PAL.orange) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    P.fill(ctx, P.rr(-200, -6, 400, 12, 6), '#c9d2f2'); P.fill(ctx, P.rr(-200, 0, 400, 6, 3), '#8f9ac8');
    for (const sd of [-1, 1]) {
      P.flat(ctx, P.rr(sd * 150 - 14, -64, 28, 128, 12), plate, { off: 6 });
      P.flat(ctx, P.rr(sd * 178 - 10, -46, 20, 92, 8), P.shade(plate, 0.12), { off: 5 });
      P.fill(ctx, P.rr(sd * 136 - 4, -16, 8, 32, 3), '#e8ecff');
    }
    ctx.restore();
  };

  // ---------------- anatomy props ----------------
  // P.fiber: a muscle fibre / fascicle seen as a pseudo-3D cylinder lying at angle `ang`, with banded stripes
  // (sarcomeres) and an end cap packed with round myofibrils. o: { color, cap, stripes, grow, tears:[0..1 positions], tearK }
  P.fiber = (ctx, x, y, len, r, ang = 0, o = {}) => {
    const col = o.color || P.PAL.red, capc = o.cap || P.PAL.pink, k = o.grow == null ? 1 : o.grow, L = len * k;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    // body
    const body = P.rr(0, -r, L, 2 * r, r * 0.35);
    ctx.save(); body(ctx); ctx.clip();
    ctx.fillStyle = col; ctx.fillRect(0, -r, L, 2 * r);
    const n = o.stripes || Math.max(3, Math.round(L / (r * 0.9)));
    for (let i = -1; i < n; i++) { const sx = (i + 0.5) * (L / n) + (o.slide || 0) % (L / n); ctx.fillStyle = P.light(col, 0.2); ctx.fillRect(sx - L / n * 0.2, -r, L / n * 0.4, 2 * r); ctx.fillStyle = P.light(col, 0.4); ctx.fillRect(sx - L / n * 0.04, -r, L / n * 0.08, 2 * r); }
    ctx.fillStyle = 'rgba(40,10,90,0.28)'; ctx.fillRect(0, r * 0.5, L, r * 0.5);
    ctx.fillStyle = P.light(col, 0.35); ctx.fillRect(0, -r, L, r * 0.16);
    // tears: dark jagged gaps
    (o.tears || []).forEach((p, i) => {
      const tk = o.tearK == null ? 1 : o.tearK; if (tk <= 0) return;
      const tx = p * L, wv = r * 0.22 * tk;
      ctx.fillStyle = P.PAL.ink; ctx.beginPath(); ctx.moveTo(tx - wv, -r - 2);
      for (let j = 0; j <= 6; j++) ctx.lineTo(tx + (j % 2 ? wv : -wv) * 1.2, -r + (2 * r * j) / 6);
      for (let j = 6; j >= 0; j--) ctx.lineTo(tx + (j % 2 ? wv : -wv) * 0.2 + wv * 0.6, -r + (2 * r * j) / 6);
      ctx.closePath(); ctx.fill();
      if (o.heal != null) { ctx.save(); ctx.globalAlpha = cl(o.heal); ctx.fillStyle = P.PAL.amber; ctx.fill(); ctx.restore(); }
    });
    ctx.restore();
    // end cap with packed myofibrils
    ctx.save(); P.ell(0, 0, r * 0.42, r)(ctx); ctx.clip();
    ctx.fillStyle = P.shade(capc, 0.2); ctx.fillRect(-r, -r, 2 * r, 2 * r);
    const rr = H_rng('cap' + (o.seed || 0));
    for (let i = 0; i < 36; i++) { const a = rr() * TAU, d = Math.sqrt(rr()) * r * 0.92, cx = Math.cos(a) * d * 0.42, cy = Math.sin(a) * d; ctx.fillStyle = P.light(capc, 0.2 + rr() * 0.25); P.ell(cx, cy, r * 0.07, r * 0.13)(ctx); ctx.fill(); }
    ctx.restore();
    ctx.restore();
  };
  // P.filaments: the inside of a myofibril — thin pink actin strands and thick purple myosin strands with heads.
  // slide: 0..1 contraction (actin slides inward). tears: [{x, k}] jagged red breaks.
  P.filaments = (ctx, cx, cy, w, h, t, o = {}) => {
    const PAL = P.PAL, rows = o.rows || 7, gap = h / rows, slide = (o.slide || 0) * gap * 1.2;
    for (let i = 0; i < rows; i++) {
      const y = cy - h / 2 + gap * (i + 0.5), thick = i % 2 === 1;
      if (thick) {
        const x0 = cx - w * 0.36, x1 = cx + w * 0.36;
        P.flat(ctx, P.rr(x0, y - 9, x1 - x0, 18, 9), PAL.grape, { off: 4, lo: 2 });
        for (let x = x0 + 16; x < x1 - 10; x += 26) { const wob = Math.sin(t * 6 + x * 0.1) * 3; for (const d of [-1, 1]) P.fill(ctx, P.circ(x + wob, y + d * 13, 6), P.light(PAL.grape, 0.25)); }
      } else {
        for (const sd of [-1, 1]) {
          const xa = cx + sd * (w / 2), xb = cx + sd * (w * 0.08 + gap * 0.2) - sd * slide;
          ctx.strokeStyle = PAL.pink; ctx.lineWidth = 7; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(xa, y); for (let k = 0; k <= 24; k++) { const xx = lerp(xa, xb, k / 24); ctx.lineTo(xx, y + Math.sin(k * 1.3 + i) * 4); } ctx.stroke();
          ctx.strokeStyle = P.light(PAL.pink, 0.45); ctx.lineWidth = 2.5; ctx.stroke();
        }
      }
    }
    // Z-discs at the ends
    for (const sd of [-1, 1]) P.flat(ctx, P.rr(cx + sd * w / 2 - 9, cy - h / 2, 18, h, 9), PAL.cyan, { off: 5 });
    (o.tears || []).forEach((tr, j) => { if (tr.k > 0) P.rip(ctx, tr.x, tr.y || cy, h * 0.9, tr.k, j); });
  };
  // a jagged vertical tear with a red flash
  P.rip = (ctx, x, y, h, k, seed = 0) => {
    const r = H_rng('rip' + seed); ctx.save();
    P.glow(ctx, x, y, 140 * k, P.PAL.red, 0.55 * k);
    ctx.fillStyle = P.PAL.ink; ctx.beginPath(); const w = 16 * k; ctx.moveTo(x, y - h / 2);
    const pts = []; for (let i = 0; i <= 8; i++) pts.push([x + (r() - 0.5) * 30, y - h / 2 + (h * i) / 8]);
    pts.forEach(([px, py]) => ctx.lineTo(px - w, py)); pts.reverse().forEach(([px, py]) => ctx.lineTo(px + w, py)); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  // satellite / repair cell: a wobbly star cell with a nucleus
  P.cellStar = (ctx, x, y, r, t, o = {}) => {
    const n = o.arms || 6, col = o.color || P.PAL.sky, pts = [];
    for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * TAU + (o.rot || 0) + Math.sin(t * 1.3 + i) * 0.06, rr = i % 2 ? r * 0.45 : r * (1 + 0.08 * Math.sin(t * 2 + i * 1.7)); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    P.flat(ctx, P.blob(pts), col, { off: r * 0.09, lo: r * 0.04 });
    P.flat(ctx, P.ell(x, y, r * 0.3, r * 0.22, o.rot || 0), P.shade(col, 0.4), { light: 0.1, off: 3, lo: 1 });
  };
  // icons
  P.moon = (ctx, x, y, r) => { ctx.save(); P.glow(ctx, x, y, r * 2.2, P.PAL.yellow, 0.35); P.circ(x, y, r)(ctx); ctx.clip(); P.flat(ctx, P.circ(x, y, r), P.PAL.yellow, { off: r * 0.08 }); ctx.globalCompositeOperation = 'destination-out'; P.circ(x + r * 0.45, y - r * 0.3, r * 0.85)(ctx); ctx.fill(); ctx.restore(); };
  P.egg = (ctx, x, y, r) => { P.flat(ctx, P.blob([[x, y - r * 1.3], [x + r, y - r * 0.2], [x + r * 0.8, y + r], [x - r * 0.8, y + r], [x - r, y - r * 0.2]]), P.PAL.bone, { off: r * 0.1 }); };
  P.drumstick = (ctx, x, y, r) => { P.flat(ctx, P.capsule(x - r * 0.2, y + r * 0.2, x + r * 0.9, y + r * 1.2, r * 0.18), P.PAL.bone, { off: 3 }); P.flat(ctx, P.circ(x - r * 0.1, y, r * 0.85), P.PAL.orange, { off: r * 0.1 }); };
  P.bulb = (ctx, x, y, r, on = 1) => { if (on > 0) P.glow(ctx, x, y, r * 3, P.PAL.yellow, 0.6 * on); P.flat(ctx, P.circ(x, y, r), on > 0.5 ? P.PAL.yellow : P.PAL.steel, { off: r * 0.12 }); P.fill(ctx, P.rr(x - r * 0.45, y + r * 0.8, r * 0.9, r * 0.6, 4), P.PAL.grey); };
  // calendar with a page that flips from text1 to text2 over k (0..1)
  P.calendar = (ctx, x, y, s, text1, text2, k = 0) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    P.flat(ctx, P.rr(-60, -70, 120, 140, 14), P.PAL.blue, { off: 6 });
    const page = (txt) => { P.fill(ctx, P.rr(-50, -40, 100, 100, 8), P.PAL.white); ctx.fillStyle = P.PAL.magenta; ctx.font = `900 34px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 12); };
    page(k < 0.5 ? text1 : text2);
    if (k > 0 && k < 1) { ctx.save(); const sy = Math.cos(k * Math.PI); ctx.translate(0, -40); ctx.scale(1, Math.abs(sy)); P.fill(ctx, P.rr(-50, sy > 0 ? 0 : -100, 100, 100, 8), sy > 0 ? '#ffffff' : '#dfe4ff'); ctx.restore(); }
    P.fill(ctx, P.rr(-60, -70, 120, 26, 12), P.PAL.red);
    ctx.restore();
  };
  // a protein-shake bottle
  P.shaker = (ctx, x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); P.flat(ctx, P.rr(-30, -60, 60, 110, 16), P.PAL.white, { off: 5 }); P.fill(ctx, P.rr(-30, -10, 60, 60, 14), P.PAL.amber); P.flat(ctx, P.rr(-26, -82, 52, 26, 8), P.PAL.blue, { off: 4 }); ctx.restore(); };

  // ---------------- FX ----------------
  // little white zigzag sparks around a point (pain / electricity / strain); flickers with t
  P.zap = (ctx, x, y, r, t, seed = 0, n = 3, color = '#ffffff') => {
    const rr = H_rng('zap' + seed); ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 0; i < n; i++) {
      const a = rr() * TAU, ph = rr(); if (Math.sin(t * 14 + ph * 9) < -0.2) continue;
      const x0 = x + Math.cos(a) * r, y0 = y + Math.sin(a) * r; ctx.beginPath(); ctx.moveTo(x0, y0);
      for (let k = 1; k <= 4; k++) ctx.lineTo(x0 + Math.cos(a) * k * 9 + (k % 2 ? 8 : -8) * Math.sin(a), y0 + Math.sin(a) * k * 9 + (k % 2 ? -8 : 8) * Math.cos(a));
      ctx.stroke();
    }
    ctx.restore();
  };
  P.sparkles = (ctx, x, y, r, t, k = 1, seed = 0) => {
    const rr = H_rng('spk' + seed);
    for (let i = 0; i < 10; i++) {
      const a = rr() * TAU, d = r * (0.5 + rr() * 0.6), ph = rr() * TAU, s = (6 + rr() * 9) * k * (0.6 + 0.4 * Math.sin(t * 5 + ph));
      if (s <= 0.5) continue; const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d;
      ctx.fillStyle = i % 3 ? '#ffffff' : P.PAL.yellow; ctx.beginPath();
      for (let j = 0; j < 8; j++) { const aa = (j / 8) * TAU, rd = j % 2 ? s * 0.3 : s; ctx.lineTo(px + Math.cos(aa) * rd, py + Math.sin(aa) * rd); }
      ctx.closePath(); ctx.fill();
    }
  };
  P.confetti = (ctx, W, H, t, t0, seed = 1) => {
    const e = t - t0; if (e < 0) return; const rr = H_rng('conf' + seed), cols = [P.PAL.yellow, P.PAL.pink, P.PAL.cyan, P.PAL.mint, P.PAL.orange, P.PAL.white];
    for (let i = 0; i < 70; i++) {
      const x0 = rr() * W, vx = (rr() - 0.5) * 80, vy = 160 + rr() * 220, sp = rr() * 10, c = cols[i % cols.length];
      const x = x0 + vx * e + Math.sin(e * 3 + i) * 20, y = -40 + vy * e - rr() * 300; if (y > H + 20) continue;
      ctx.save(); ctx.translate(x, y); ctx.rotate(sp + e * (3 + rr() * 4)); ctx.fillStyle = c; ctx.fillRect(-7, -4, 14, 8); ctx.restore();
    }
  };
  // glowing particles flowing from (x0,y0) to (x1,y1), revealed with k
  P.flow = (ctx, x0, y0, x1, y1, t, k = 1, color = P.PAL.amber, n = 12) => {
    for (let i = 0; i < n; i++) {
      const p = ((t * 0.6 + i / n) % 1); if (p > k) continue;
      const bx = lerp(x0, x1, p) + Math.sin(p * 9 + i) * 14, by = lerp(y0, y1, p) + Math.cos(p * 7 + i) * 10;
      P.glow(ctx, bx, by, 22, color, 0.5); P.fill(ctx, P.circ(bx, by, 7), P.light(color, 0.4));
    }
  };

  // ---------------- text ----------------
  // P.label: a rounded pill label with bold white text, popping in with k (0..1). o: { color, size, stem:[x,y] }
  P.label = (ctx, text, x, y, k = 1, o = {}) => {
    if (k <= 0) return; const s = o.size || 32, col = o.color || P.PAL.blue;
    const pk = k < 1 ? H.ease.back(cl(k)) : 1;
    ctx.save(); ctx.font = `900 ${s}px ${P.FONT}`; const tw = ctx.measureText(text).width, w = tw + s * 1.2, h = s * 1.6;
    if (o.stem) { ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.globalAlpha = cl(k * 2); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, o.stem[0], cl(k)), lerp(y, o.stem[1], cl(k))); ctx.stroke(); ctx.globalAlpha = 1; }
    ctx.translate(x, y); ctx.scale(pk, pk);
    P.fill(ctx, P.rr(-w / 2, -h / 2 + 4, w, h, h / 2), P.shade(col, 0.35));
    P.fill(ctx, P.rr(-w / 2, -h / 2, w, h, h / 2), col);
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2);
    if (o.sub) { ctx.font = `800 ${s * 0.62}px ${P.FONT}`; ctx.fillStyle = P.light(col, 0.55); ctx.fillText(o.sub, 0, h * 0.95); }
    ctx.restore();
  };
  // P.title: the big hook title at the top (amber fill, thick indigo outline, white inner rim), pops per line
  P.title = (ctx, lines, x, y, k = 1, o = {}) => {
    if (k <= 0) return; const s = o.size || 60;
    ctx.save(); ctx.font = `900 ${s}px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    lines.forEach((ln, i) => {
      const kk = cl(k * lines.length - i * 0.6); if (kk <= 0) return; const pk = H.ease.back(cl(kk)), ly = y + i * s * 1.02;
      ctx.save(); ctx.translate(x, ly); ctx.scale(pk, pk); ctx.rotate(-0.03);
      ctx.strokeStyle = P.PAL.ink; ctx.lineWidth = s * 0.32; ctx.strokeText(ln, 0, s * 0.06);
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = s * 0.16; ctx.strokeText(ln, 0, 0);
      ctx.fillStyle = o.color || P.PAL.amber; ctx.fillText(ln, 0, 0);
      ctx.restore();
    });
    ctx.restore();
  };
  // P.caption: small sentence-case words, a few at a time, centred at 73% height, white with a soft dark outline
  P.caption = (ctx, W, H_, text, o = {}) => {
    if (!text) return; const s = o.size || 30;
    ctx.save(); ctx.font = `800 ${s}px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    const y = H_ * (o.y || 0.73);
    ctx.strokeStyle = 'rgba(14,6,60,0.85)'; ctx.lineWidth = 7; ctx.strokeText(text, W / 2, y);
    ctx.fillStyle = '#ffffff'; ctx.fillText(text, W / 2, y); ctx.restore();
  };

  // ---------------- script timing ----------------
  P.syl = (w) => Math.max(1, (w.toLowerCase().replace(/[^a-z]/g, '').replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g) || []).length);
  // lines: [[text], ...] or [[text, [[t0,t1],...]], ...]. Lines without segments get estimated times.
  P.timeScript = (lines, o = {}) => {
    let t = o.start == null ? 0.5 : o.start; const wps = o.wps || 2.7;
    return lines.map(([text, segs]) => {
      if (segs) { t = segs[segs.length - 1][1]; return [text, segs]; }
      const n = text.split(/\s+/).filter(Boolean).length, d = n / wps, s0 = t; t += d;
      t += /[.!?]$/.test(text.trim()) ? (o.stop || 0.35) : (o.comma || 0.2);
      return [text, [[s0, s0 + d]]];
    });
  };
  // words: [{ w, t, end }] placed inside their segments by syllable count
  P.words = (lines) => {
    const out = [];
    lines.forEach(([text, segs]) => {
      const ws = text.split(/\s+/).filter(Boolean), sy = ws.map(P.syl), tot = sy.reduce((a, b) => a + b, 0);
      const segLen = segs.reduce((a, [a0, a1]) => a + (a1 - a0), 0); let acc = 0;
      const at = (u) => { let rem = u * segLen; for (const [a0, a1] of segs) { if (rem <= a1 - a0) return a0 + rem; rem -= a1 - a0; } return segs[segs.length - 1][1]; };
      ws.forEach((w, i) => { out.push({ w, t: at(acc / tot), end: at((acc + sy[i]) / tot) }); acc += sy[i]; });
    });
    return out;
  };
  // chunks: captions of up to `max` words, breaking after punctuation
  P.chunks = (words, max = 3) => {
    const out = []; let cur = [];
    words.forEach((w, i) => { cur.push(w); const next = words[i + 1]; if (cur.length >= max || /[.,!?:;]$/.test(w.w) || !next || next.t - w.end > 0.35) { out.push({ text: cur.map((x) => x.w).join(' '), t0: cur[0].t, t1: next ? Math.min(next.t, w.end + 0.6) : w.end + 0.8 }); cur = []; } });
    return out;
  };
  P.captionAt = (chunks, t) => { for (const c of chunks) if (t >= c.t0 - 0.02 && t < c.t1) return c.text; return ''; };
  // wt(words, 'tear', n) -> start time of the nth word equal to that text (case-insensitive, punctuation ignored)
  P.wt = (words, key, n = 0) => { const k = key.toLowerCase(); let c = 0; for (const w of words) if (w.w.toLowerCase().replace(/[^a-z0-9'-]/g, '') === k) { if (c++ === n) return w.t; } throw new Error('word not in script: ' + key); };

  // ---------------- animation + cameras ----------------
  P.pop = (t, t0, d = 0.35) => cl((t - t0) / d);                       // 0..1 ramp
  P.ramp = (t, t0, t1) => H.ease.inOut(cl((t - t0) / (t1 - t0)));       // eased 0..1
  P.osc = (t, f = 1, a = 1, ph = 0) => Math.sin(t * TAU * f + ph) * a;
  // slow push-in around (fx,fy): call inside a scene to keep the camera alive
  P.push = (ctx, W, H_, local, fx = W / 2, fy = H_ / 2, rate = 0.012) => { const s = 1 + local * rate; ctx.translate(fx, fy); ctx.scale(s, s); ctx.translate(-fx, -fy); };
  P.shake = (ctx, t, t0, k = 1, d = 0.4) => { const e = t - t0; if (e < 0 || e > d) return; const a = (1 - e / d) * 12 * k; ctx.translate(Math.sin(e * 90) * a, Math.cos(e * 70) * a * 0.6); };
  // zoomThrough: the signature transition. Over [t0, t0+d] the outgoing scene zooms hard into (fx,fy) while the incoming
  // scene opens from a growing circle at that point. drawA/drawB(ctx, localT) draw full frames.
  P.zoomThrough = (ctx, W, H_, t, t0, d, fx, fy, drawA, drawB) => {
    const p = cl((t - t0) / d), e = H.ease.inOut(p);
    if (p <= 0) return drawA(ctx), 'A'; if (p >= 1) return drawB(ctx), 'B';
    ctx.save(); const s = Math.exp(e * Math.log(9)); ctx.translate(fx, fy); ctx.scale(s, s); ctx.translate(-fx, -fy); drawA(ctx); ctx.restore();
    const rad = Math.pow(e, 1.6) * Math.hypot(W, H_) * 1.05, cx = lerp(fx, W / 2, e), cy = lerp(fy, H_ / 2, e);
    ctx.save(); P.circ(cx, cy, rad)(ctx); ctx.clip(); const sb = 1.7 - 0.7 * e; ctx.translate(W / 2, H_ / 2); ctx.scale(sb, sb); ctx.translate(-W / 2, -H_ / 2); drawB(ctx); ctx.restore();
    return 'AB';
  };
  // slideCut: incoming scene slides up over the outgoing one (for a change of place or time)
  P.slideCut = (ctx, W, H_, t, t0, d, drawA, drawB) => {
    const p = cl((t - t0) / d), e = H.ease.inOut(p);
    if (p <= 0) return drawA(ctx); if (p >= 1) return drawB(ctx);
    ctx.save(); ctx.translate(0, -e * H_ * 0.35); drawA(ctx); ctx.restore();
    ctx.save(); ctx.translate(0, (1 - e) * H_); drawB(ctx); ctx.restore();
  };
  // finish: gentle vignette, every frame
  P.finish = (ctx, W, H_) => { const g = ctx.createRadialGradient(W / 2, H_ * 0.45, H_ * 0.3, W / 2, H_ / 2, H_ * 0.75); g.addColorStop(0, 'rgba(10,4,50,0)'); g.addColorStop(1, 'rgba(10,4,50,0.32)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); };
})();

// PULSE KIT — props, part 2: metabolism, blood, breath and "pop-up" graphics.
// P.fatCell, P.trig, P.vessel, P.rbc, P.mito, P.molecule, P.lungs, P.puff, P.drop, P.counter, P.stampX, P.bubble,
// P.scale, P.treadmill, P.bgCells (parallax depth), P.qmarks, P.sweat, P.arrowFlat.
(function () {
  const TAU = Math.PI * 2, cl = P.cl, lerp = P.lerp, PAL = P.PAL;
  const rng = (s) => H.rng(s);

  // parallax depth: big soft out-of-focus cells drifting behind the action (two layers, different speeds)
  P.bgCells = (ctx, W, H_, t, color = '#ffffff', seed = 1, a = 0.07) => {
    const r = rng('bgc' + seed);
    for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 7; i++) {
      const rad = (layer ? 70 : 140) + r() * 80, sp = layer ? 22 : 9, x0 = r() * W, y0 = r() * H_;
      const y = ((y0 - t * sp) % (H_ + 400) + H_ + 400) % (H_ + 400) - 200, x = x0 + Math.sin(t * 0.3 + i) * 20;
      ctx.fillStyle = P.alpha(color, a * (layer ? 1.4 : 1)); P.circ(x, y, rad)(ctx); ctx.fill();
      ctx.fillStyle = P.alpha(color, a * 0.8); P.circ(x - rad * 0.25, y - rad * 0.2, rad * 0.35)(ctx); ctx.fill();
    }
  };

  // a fat cell (adipocyte): pale membrane, one big glossy lipid droplet filling it, nucleus squeezed to the edge.
  // o: { drop 0..1 (droplet size), wob, face: true for a small sleepy face }
  P.fatCell = (ctx, x, y, r, t, o = {}) => {
    const wob = o.wob == null ? 1 : o.wob, pts = [];
    for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU, rr = r * (1 + 0.04 * wob * Math.sin(t * 1.6 + i * 2.1 + x * 0.01)); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    P.flat(ctx, P.blob(pts), '#ffe7a6', { off: r * 0.07, lo: r * 0.03 });
    const d = (o.drop == null ? 1 : o.drop) * r * 0.8;
    if (d > 1) {
      P.flat(ctx, P.circ(x + r * 0.04, y + r * 0.04, d), PAL.amber, { off: d * 0.1, lo: d * 0.04 });
      P.fill(ctx, P.ell(x - d * 0.35, y - d * 0.4, d * 0.28, d * 0.16, -0.6), 'rgba(255,255,255,0.55)');
    }
    P.flat(ctx, P.ell(x + r * 0.72, y + r * 0.42, r * 0.16, r * 0.11, 0.6), PAL.grape, { off: 2, lo: 1 });
    if (o.face) { ctx.strokeStyle = PAL.ink; ctx.lineWidth = r * 0.05; ctx.lineCap = 'round'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(x + sd * d * 0.3, y, d * 0.1, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); } }
  };
  // a triglyceride: a cream glycerol "spine" with three wavy amber fatty-acid tails. split 0..1 pulls the tails off.
  P.trig = (ctx, x, y, s = 1, ang = 0, split = 0, t = 0) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
    for (let k = -1; k <= 1; k++) {
      const dx = split * (60 + k * 10), dy = k * (22 + split * 30), rot = split * k * 0.5;
      ctx.save(); ctx.translate(14 + dx, dy); ctx.rotate(rot);
      ctx.strokeStyle = P.shade(PAL.amber, 0.25); ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); for (let i = 0; i <= 8; i++) ctx.lineTo(i * 9, Math.sin(i * 1.4 + t * 5 + k) * 5); ctx.stroke();
      ctx.strokeStyle = PAL.amber; ctx.lineWidth = 7; ctx.stroke();
      ctx.restore();
    }
    P.flat(ctx, P.rr(-10, -38, 22, 76, 11), PAL.bone, { off: 4, lo: 2 });
    ctx.restore();
  };
  // a red blood cell: flat donut disc seen at an angle
  P.rbc = (ctx, x, y, r, rot = 0) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    P.flat(ctx, P.ell(0, 0, r, r * 0.62), PAL.red, { off: r * 0.12, lo: r * 0.05 });
    P.fill(ctx, P.ell(r * 0.05, r * 0.02, r * 0.45, r * 0.25), P.shade(PAL.red, 0.3));
    ctx.restore();
  };
  // a blood vessel: horizontal tube from x0 to x0+len at height y, with red cells streaming along it (speed px/s)
  P.vessel = (ctx, x0, y, len, r, t, o = {}) => {
    const sp = o.speed == null ? 120 : o.speed;
    P.flat(ctx, P.rr(x0, y - r, len, 2 * r, r * 0.5), '#ff7a8f', { off: 8, light: 0.15 });
    ctx.save(); P.rr(x0 + 10, y - r + 14, len - 20, 2 * r - 28, r * 0.4)(ctx); ctx.clip();
    ctx.fillStyle = '#b3123d'; ctx.fillRect(x0, y - r, len, 2 * r);
    const rr = rng('ves' + (o.seed || 0));
    for (let i = 0; i < Math.round(len / 55); i++) { const off = rr() * len, yy = y + (rr() - 0.5) * (r * 1.1), x = x0 + ((off + t * sp * (0.8 + rr() * 0.4)) % (len + 60)) - 30; P.rbc(ctx, x, yy, r * 0.26, rr() * 2 - 1); }
    ctx.restore();
  };
  // a mitochondrion: orange pill with folded inner membrane (cristae); glow 0..1 makes it fire up
  P.mito = (ctx, x, y, w, h, ang = 0, t = 0, glow = 0) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    if (glow > 0) P.glow(ctx, 0, 0, w * 0.9, PAL.yellow, 0.55 * glow);
    const pul = 1 + 0.03 * Math.sin(t * 6) * glow;
    ctx.scale(pul, pul);
    P.flat(ctx, P.rr(-w / 2, -h / 2, w, h, h / 2), PAL.orange, { off: 8 });
    P.fill(ctx, P.rr(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24, h / 2 - 12), P.light(PAL.amber, 0.3 + glow * 0.3));
    ctx.strokeStyle = P.shade(PAL.orange, 0.15); ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath(); const n = 7;
    for (let i = 0; i <= n; i++) { const xx = -w / 2 + 34 + (i / n) * (w - 68); ctx.lineTo(xx, i % 2 ? h / 2 - 22 : -h / 2 + 22); } ctx.stroke();
    ctx.restore();
  };
  // molecules: 'co2' (dark C between two red O), 'h2o' (red O with two white H), 'o2' (two red O)
  P.molecule = (ctx, x, y, s = 1, kind = 'co2', rot = 0, k = 1) => {
    if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const ss = s * (k < 1 ? H.ease.back(cl(k)) : 1); ctx.scale(ss, ss);
    const atom = (ax, ay, r, c) => P.flat(ctx, P.circ(ax, ay, r), c, { off: r * 0.18, lo: r * 0.08 });
    if (kind === 'co2') { atom(-24, 0, 15, PAL.red); atom(24, 0, 15, PAL.red); atom(0, 0, 17, '#454b75'); }
    else if (kind === 'h2o') { atom(-17, 13, 10, '#f4f6ff'); atom(17, 13, 10, '#f4f6ff'); atom(0, -2, 17, PAL.red); }
    else { atom(-12, 0, 15, PAL.red); atom(12, 0, 15, PAL.red); }
    ctx.restore();
  };
  // lungs: two pink lobes, windpipe and branching airways. breath 0..1 inflates them.
  P.lungs = (ctx, x, y, s = 1, breath = 0.5) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    P.flat(ctx, P.rr(-16, -230, 32, 140, 16), '#ff9fb8', { off: 5 });
    for (let i = 0; i < 6; i++) P.fill(ctx, P.rr(-16, -220 + i * 22, 32, 7, 3), P.shade('#ff9fb8', 0.15));
    const b = 1 + breath * 0.08;
    for (const sd of [-1, 1]) {
      ctx.save(); ctx.translate(sd * 92, 20); ctx.scale(b, b);
      P.flat(ctx, P.blob([[sd * -40, -150], [sd * 30, -170], [sd * 90, -60], [sd * 96, 80], [sd * 60, 150], [sd * -10, 140], [sd * -60, 110], [sd * -56, -40]]), PAL.pink, { off: 10 });
      ctx.restore();
    }
    ctx.strokeStyle = P.shade(PAL.pink, 0.3); ctx.lineWidth = 10; ctx.lineCap = 'round';
    for (const sd of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(0, -92); ctx.quadraticCurveTo(sd * 40, -70, sd * 80, -30); ctx.stroke();
      ctx.lineWidth = 6; for (const [ax, ay] of [[110, 20], [70, 60], [120, -60]]) { ctx.beginPath(); ctx.moveTo(sd * 80, -30); ctx.lineTo(sd * ax, ay); ctx.stroke(); }
      ctx.lineWidth = 10;
    }
    ctx.restore();
  };
  // a soft white breath / steam cloud; k 0..1 grows then fades
  P.puff = (ctx, x, y, r, k) => {
    if (k <= 0 || k >= 1) return; const a = Math.sin(k * Math.PI) * 0.85, rr = r * (0.5 + k * 0.8);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffffff';
    [[0, 0, 1], [-0.7, 0.2, 0.7], [0.7, 0.25, 0.75], [0.2, -0.5, 0.65], [-0.4, -0.35, 0.55]].forEach(([dx, dy, s]) => { P.circ(x + dx * rr, y + dy * rr - k * 30, rr * s)(ctx); ctx.fill(); });
    ctx.restore();
  };
  // a water droplet
  P.drop = (ctx, x, y, r, color = PAL.cyan) => { P.flat(ctx, (c) => { c.beginPath(); c.moveTo(x, y - r * 1.6); c.bezierCurveTo(x + r * 0.4, y - r * 0.9, x + r, y - r * 0.2, x + r, y + r * 0.25); c.arc(x, y + r * 0.25, r, 0, Math.PI); c.bezierCurveTo(x - r, y - r * 0.2, x - r * 0.4, y - r * 0.9, x, y - r * 1.6); c.closePath(); }, color, { off: r * 0.15, lo: r * 0.07 }); P.fill(ctx, P.ell(x - r * 0.35, y, r * 0.18, r * 0.3, 0.3), 'rgba(255,255,255,0.6)'); };
  // sweat drops flying off a head at (x,y); k 0..1
  P.sweat = (ctx, x, y, t, k = 1, seed = 0) => { if (k <= 0) return; const r = rng('sw' + seed); for (let i = 0; i < 3; i++) { const ph = ((t * 1.4 + r()) % 1), a = -Math.PI / 2 + (i - 1) * 0.9; P.drop(ctx, x + Math.cos(a) * (50 + ph * 40), y + Math.sin(a) * (40 + ph * 30) + ph * ph * 60, 8 * k * (1 - ph * 0.5), PAL.cyan); } };
  // big counting number (title style). P.counter(ctx, '8.4 kg', x, y, size, k)
  P.counter = (ctx, text, x, y, size = 110, k = 1, color = PAL.yellow) => {
    if (k <= 0) return; ctx.save(); ctx.translate(x, y); const pk = k < 1 ? H.ease.back(cl(k)) : 1; ctx.scale(pk, pk);
    ctx.font = `900 ${size}px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = size * 0.26; ctx.strokeText(text, 0, size * 0.05);
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = size * 0.12; ctx.strokeText(text, 0, 0);
    ctx.fillStyle = color; ctx.fillText(text, 0, 0); ctx.restore();
  };
  // fmt helper for counting numbers: P.countTo(t, t0, t1, from, to, decimals)
  P.countTo = (t, t0, t1, a, b, dec = 0) => (a + (b - a) * H.ease.out(cl((t - t0) / (t1 - t0)))).toFixed(dec);
  // a fat red X stamped over something
  P.stampX = (ctx, x, y, r, k) => {
    if (k <= 0) return; const pk = k < 1 ? lerp(1.8, 1, H.ease.out(cl(k))) : 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(pk, pk); ctx.rotate(0.08); ctx.globalAlpha = cl(k * 3); ctx.lineCap = 'round';
    for (const [c, w, o] of [[PAL.ink, r * 0.42, 6], [PAL.red, r * 0.3, 0]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-r, -r + o); ctx.lineTo(r, r + o); ctx.moveTo(r, -r + o); ctx.lineTo(-r, r + o); ctx.stroke(); }
    ctx.restore();
  };
  // a white speech / thought bubble with a tail toward (tx,ty)
  P.bubble = (ctx, text, x, y, k = 1, o = {}) => {
    if (k <= 0) return; const s = o.size || 34; ctx.save(); ctx.font = `900 ${s}px ${P.FONT}`;
    const w = ctx.measureText(text).width + s * 1.3, h = s * 1.9, pk = k < 1 ? H.ease.back(cl(k)) : 1;
    ctx.translate(x, y); ctx.scale(pk, pk);
    if (o.tail) { ctx.fillStyle = o.color || '#ffffff'; ctx.beginPath(); ctx.moveTo(-14, h / 2 - 6); ctx.lineTo(o.tail[0] - x, o.tail[1] - y); ctx.lineTo(14, h / 2 - 6); ctx.fill(); }
    P.fill(ctx, P.rr(-w / 2, -h / 2 + 6, w, h, h / 2), 'rgba(18,8,70,0.3)');
    P.fill(ctx, P.rr(-w / 2, -h / 2, w, h, h / 2), o.color || '#ffffff');
    ctx.fillStyle = o.ink || PAL.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 2); ctx.restore();
  };
  // floating question marks around a point
  P.qmarks = (ctx, x, y, t, k = 1) => { if (k <= 0) return; ctx.save(); ctx.font = `900 64px ${P.FONT}`; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; [[-130, -40, 0], [130, -70, 1.3], [0, -150, 2.4]].forEach(([dx, dy, ph], i) => { const kk = cl(k * 3 - i * 0.6); if (kk <= 0) return; const yy = y + dy + Math.sin(t * 3 + ph) * 8; ctx.save(); ctx.translate(x + dx, yy); ctx.scale(H.ease.back(cl(kk)), H.ease.back(cl(kk))); ctx.rotate(Math.sin(t * 2 + ph) * 0.2); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 14; ctx.strokeText('?', 0, 0); ctx.fillStyle = PAL.yellow; ctx.fillText('?', 0, 0); ctx.restore(); }); ctx.restore(); };
  // a bathroom scale with a digital readout
  P.scale = (ctx, x, y, s, text, ry = null) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    P.flat(ctx, P.rr(-150, -26, 300, 52, 22), '#f3f5ff', { off: 6 });
    P.fill(ctx, P.rr(-150, 12, 300, 14, 7), P.shade('#f3f5ff', 0.25));
    ctx.restore();
    if (text) { ctx.save(); ctx.translate(x, ry == null ? y - 330 * s : ry); ctx.scale(s, s); P.flat(ctx, P.rr(-120, -50, 240, 100, 20), '#1d1660', { off: 5, light: 0.12 }); ctx.font = `900 64px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = PAL.cyan; ctx.shadowColor = PAL.cyan; ctx.shadowBlur = 14; ctx.fillText(text, 0, 4); ctx.restore(); }
  };
  // a treadmill (front-ish view): belt with moving stripes, side rails, handlebar posts
  P.treadmill = (ctx, x, y, s, t) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (const sd of [-1, 1]) { P.flat(ctx, P.rr(sd * 175 - 10, -200, 20, 200, 10), '#9aa6d8', { off: 4 }); P.flat(ctx, P.rr(sd * 175 - 14, -214, 28, 60, 12), '#3b3f9e', { off: 4 }); }
    P.flat(ctx, P.rr(-190, -10, 380, 46, 18), '#2a2f7e', { off: 6 });
    ctx.save(); P.rr(-170, -6, 340, 22, 8)(ctx); ctx.clip(); ctx.fillStyle = '#14164a'; ctx.fillRect(-170, -6, 340, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = -2; i < 12; i++) ctx.fillRect(-170 + ((i * 40 + t * 160) % 480) - 40, -6, 14, 22); ctx.restore();
    ctx.restore();
  };
  // a flat chunky arrow from (x0,y0) to (x1,y1), revealed with k
  P.arrowFlat = (ctx, x0, y0, x1, y1, k = 1, color = PAL.mint, w = 22) => {
    if (k <= 0) return; const x = lerp(x0, x1, cl(k)), y = lerp(y0, y1, cl(k)), a = Math.atan2(y - y0, x - x0), L = Math.hypot(x - x0, y - y0);
    ctx.save(); ctx.translate(x0, y0); ctx.rotate(a);
    P.flat(ctx, (c) => { c.beginPath(); c.moveTo(0, -w / 2); c.lineTo(Math.max(0, L - w * 1.4), -w / 2); c.lineTo(Math.max(0, L - w * 1.4), -w * 1.2); c.lineTo(L, 0); c.lineTo(Math.max(0, L - w * 1.4), w * 1.2); c.lineTo(Math.max(0, L - w * 1.4), w / 2); c.lineTo(0, w / 2); c.closePath(); }, color, { off: 5, lo: 2 });
    ctx.restore();
  };
})();

// ---- timing + sequencing helpers ----
(function () {
  // merge spoken number phrases into one caption token: P.mergeWords(words, [['eight point four', '8.4 kg'], ...])
  // the merged word keeps the first word's text in .w (so P.wt still finds it) and shows .cap in captions
  P.mergeWords = (words, pairs) => {
    const out = [];
    for (let i = 0; i < words.length; i++) {
      let hit = null;
      for (const [ph, cap] of pairs) { const ps = ph.split(' '); if (ps.every((p, j) => words[i + j] && words[i + j].w.toLowerCase().replace(/[^a-z0-9']/g, '') === p)) { hit = [ps.length, cap]; break; } }
      if (hit) { const last = words[i + hit[0] - 1], tail = last.w.match(/[.,!?:;]+$/); out.push({ w: words[i].w, cap: hit[1] + (tail ? tail[0] : ''), t: words[i].t, end: last.end }); i += hit[0] - 1; }
      else out.push(words[i]);
    }
    return out;
  };
  // lines for a reel: window.REEL_LINES ([{say}]) + window.TIMING (measured take) when present, else estimated
  P.reelScript = () => {
    const L = window.REEL_LINES || [], T = window.TIMING;
    return P.timeScript(L.map((l, i) => [l.say, T && T.lines && T.lines[i] ? [[T.lines[i].t0, T.lines[i].t1]] : undefined]));
  };
  // run a list of shots: [{ t, draw(ctx), tr: 'zoom'|'slide'|'cut', d, focus:[x,y] }] — t is when the shot starts
  P.sequence = (ctx, W, H_, t, SEQ) => {
    let i = 0; while (i + 1 < SEQ.length && t >= SEQ[i + 1].t) i++;
    const cur = SEQ[i], prev = SEQ[i - 1], d = cur.d || (cur.tr === 'slide' ? 0.55 : 0.8);
    if (!prev || !cur.tr || cur.tr === 'cut' || t >= cur.t + d) return cur.draw(ctx);
    if (cur.tr === 'zoom') return P.zoomThrough(ctx, W, H_, t, cur.t, d, cur.focus[0], cur.focus[1], prev.draw, cur.draw);
    return P.slideCut(ctx, W, H_, t, cur.t, d, prev.draw, cur.draw);
  };
})();

// ---- props, part 3: organs, ions, meters, posters, batteries, nuclei ----
(function () {
  const TAU = Math.PI * 2, cl = P.cl, lerp = P.lerp, PAL = P.PAL;
  // a heart (flat, two-lobed) that beats with t
  P.heart = (ctx, x, y, r, t = 0) => { const b = 1 + 0.06 * Math.max(0, Math.sin(t * 7)); ctx.save(); ctx.translate(x, y); ctx.scale(b, b); P.flat(ctx, (c) => { c.beginPath(); c.moveTo(0, r * 0.95); c.bezierCurveTo(-r * 1.4, r * 0.1, -r * 0.9, -r * 1.05, 0, -r * 0.45); c.bezierCurveTo(r * 0.9, -r * 1.05, r * 1.4, r * 0.1, 0, r * 0.95); c.closePath(); }, PAL.red, { off: r * 0.1 }); P.fill(ctx, P.ell(-r * 0.4, -r * 0.35, r * 0.18, r * 0.12, -0.6), 'rgba(255,255,255,0.5)'); ctx.restore(); };
  // a brain: pink blob with wiggly folds
  P.brain = (ctx, x, y, r) => { P.flat(ctx, P.blob([[x - r, y], [x - r * 0.8, y - r * 0.7], [x - r * 0.1, y - r * 0.95], [x + r * 0.7, y - r * 0.75], [x + r, y - r * 0.1], [x + r * 0.8, y + r * 0.6], [x, y + r * 0.7], [x - r * 0.7, y + r * 0.6]]), '#ff9fc8', { off: r * 0.1 }); ctx.save(); ctx.strokeStyle = P.shade('#ff9fc8', 0.3); ctx.lineWidth = r * 0.08; ctx.lineCap = 'round'; for (const [a, b, c2] of [[-0.6, -0.4, 0.2], [0.1, -0.6, 0.3], [-0.3, 0.2, 0.5], [0.4, 0.1, 0.4]]) { ctx.beginPath(); ctx.moveTo(x + a * r, y + b * r); ctx.quadraticCurveTo(x + (a + 0.2) * r, y + (b + c2) * r, x + (a + 0.4) * r, y + b * r); ctx.stroke(); } ctx.restore(); };
  // a liver: dark-red wedge
  P.liver = (ctx, x, y, r) => P.flat(ctx, P.blob([[x - r * 1.2, y - r * 0.3], [x - r * 0.2, y - r * 0.7], [x + r * 1.1, y - r * 0.5], [x + r * 0.6, y + r * 0.2], [x - r * 0.4, y + r * 0.6]]), '#c2274f', { off: r * 0.1 });
  // a hydrogen ion: small red ball with a "+"
  P.ion = (ctx, x, y, r = 16, k = 1) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(k, k); P.flat(ctx, P.circ(0, 0, r), PAL.red, { off: r * 0.18, lo: r * 0.08 }); ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-r * 0.45, 0); ctx.lineTo(r * 0.45, 0); ctx.moveTo(0, -r * 0.45); ctx.lineTo(0, r * 0.45); ctx.stroke(); ctx.restore(); };
  // lactate: a small cyan three-ball molecule
  P.lactate = (ctx, x, y, s = 1, rot = 0, k = 1) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * k, s * k); for (const [ax, ay, r, c] of [[-20, 6, 12, PAL.cyan], [20, 6, 12, PAL.cyan], [0, -10, 15, P.shade(PAL.cyan, 0.15)]]) P.flat(ctx, P.circ(ax, ay, r), c, { off: r * 0.18, lo: r * 0.08 }); ctx.restore(); };
  // a vertical meter bar with a label underneath; k 0..1 fill
  P.meter = (ctx, x, y, w, h, k, color, label) => { P.fill(ctx, P.rr(x - w / 2, y - h, w, h, 14), 'rgba(255,255,255,0.12)'); const fh = Math.max(0, h * cl(k)); if (fh > 2) P.flat(ctx, P.rr(x - w / 2, y - fh, w, fh, 14), color, { off: 6 }); if (label) P.label(ctx, label, x, y + 46, 1, { color, size: 26 }); };
  // a WANTED poster around a drawing callback
  P.wanted = (ctx, x, y, s, k, draw, stamp = 0) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); const pk = H.ease.back(cl(k)); ctx.scale(s * pk, s * pk); ctx.rotate(-0.04); P.flat(ctx, P.rr(-150, -200, 300, 400, 10), '#ffe9b8', { off: 8 }); ctx.fillStyle = '#7a3b16'; ctx.font = `900 54px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('WANTED', 0, -140); draw(ctx); ctx.font = `900 30px ${P.FONT}`; ctx.fillText('LACTIC ACID', 0, 150); ctx.restore(); if (stamp > 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.25); const sk = lerp(1.6, 1, H.ease.out(cl(stamp))); ctx.scale(s * sk, s * sk); ctx.globalAlpha = cl(stamp * 3); ctx.strokeStyle = PAL.green; ctx.lineWidth = 10; P.rr(-170, -48, 340, 96, 16)(ctx); ctx.stroke(); ctx.fillStyle = PAL.green; ctx.font = `900 64px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('INNOCENT', 0, 4); ctx.restore(); } };
  // a battery that charges with k
  P.battery = (ctx, x, y, s, k, color = PAL.mint) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); P.flat(ctx, P.rr(-90, -50, 180, 100, 20), '#e8ecff', { off: 6 }); P.fill(ctx, P.rr(90, -20, 18, 40, 6), '#c9d2f2'); P.fill(ctx, P.rr(-76, -36, 152, 72, 12), '#1d1660'); const n = Math.round(cl(k) * 4); for (let i = 0; i < n; i++) P.fill(ctx, P.rr(-70 + i * 36, -30, 30, 60, 8), color); ctx.restore(); };
  // nuclei along a fibre drawn with P.fiber at (x,y,len,r,ang): n nuclei, k reveal, hold 0..1 brightness
  P.nuclei = (ctx, x, y, len, r, ang, n, k = 1, t = 0, seed = 0) => { const rr = H.rng('nuc' + seed); ctx.save(); ctx.translate(x, y); ctx.rotate(ang); for (let i = 0; i < n; i++) { const kk = cl(k * n - i); if (kk <= 0) continue; const px = len * (0.12 + 0.8 * ((i + 0.5) / n)) + (rr() - 0.5) * 20, py = (rr() - 0.5) * r * 1.1; ctx.save(); ctx.translate(px, py); const s = H.ease.back(kk) * (1 + 0.05 * Math.sin(t * 4 + i)); ctx.scale(s, s); P.glow(ctx, 0, 0, r * 0.5, PAL.grape, 0.4); P.flat(ctx, P.ell(0, 0, r * 0.24, r * 0.15), PAL.grape, { off: 3, lo: 1 }); P.fill(ctx, P.circ(-r * 0.06, -r * 0.03, r * 0.05), P.light(PAL.grape, 0.5)); ctx.restore(); } ctx.restore(); };
})();

// ======================= PROPS PACK 2 (4 Nov 2026): the Musclyth fitness pack =======================
// Gym kit, a front/back muscle map, a side-view lifter for exercise form, supplements, food, body parts, and chart/UI pieces.
// All flat two-tone, no outlines, drawn around (x, y) and scaled by s. k = 0..1 reveal where given. Gallery: kit/props_gallery.js.
(function () {
  const P = window.P, PAL = P.PAL, TAU = Math.PI * 2, cl = P.cl, lerp = P.lerp;
  const at = (ctx, x, y, s, rot = 0) => { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(s, s); };
  const txt = (ctx, s, x, y, size, color = PAL.white, w = 900) => { ctx.font = `${w} ${size}px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y); };
  const pop = (k) => (k < 1 ? H.ease.back(cl(k)) : 1);

  // ---------------- gym equipment ----------------
  P.dumbbell = (ctx, x, y, s = 1, rot = 0, col = PAL.indigo) => { at(ctx, x, y, s, rot);
    P.flat(ctx, P.rr(-60, -9, 120, 18, 9), PAL.steel, { off: 3 });
    for (const sd of [-1, 1]) { P.flat(ctx, P.rr(sd * 62 - 20, -38, 40, 76, 12), col, { off: 5 }); P.flat(ctx, P.rr(sd * 88 - 9, -26, 18, 52, 8), P.shade(col, 0.15), { off: 3 }); }
    ctx.restore(); };
  P.kettlebell = (ctx, x, y, s = 1, col = PAL.ink, label = '') => { at(ctx, x, y, s);
    ctx.save(); ctx.lineWidth = 22; ctx.strokeStyle = P.shade(col, 0.1); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, -52, 46, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.restore();
    P.flat(ctx, P.blob([[-70, -20], [-40, -62], [40, -62], [70, -20], [74, 40], [40, 74], [-40, 74], [-74, 40]]), col, { off: 9, light: 0.18 });
    if (label) txt(ctx, label, 0, 18, 34, PAL.yellow); ctx.restore(); };
  P.plate = (ctx, x, y, r = 80, col = PAL.red, label = '20') => {
    P.flat(ctx, P.circ(x, y, r), col, { off: r * 0.08 }); P.fill(ctx, P.circ(x, y, r * 0.72), P.shade(col, 0.18)); P.fill(ctx, P.circ(x, y, r * 0.62), col);
    P.fill(ctx, P.circ(x, y, r * 0.16), PAL.steel); P.fill(ctx, P.circ(x, y, r * 0.09), PAL.ink); if (label) { ctx.save(); txt(ctx, label, x, y - r * 0.38, r * 0.26); ctx.restore(); } };
  P.bench = (ctx, x, y, s = 1, incline = 0) => { at(ctx, x, y, s);
    P.shadow(ctx, 0, 4, 190, 16, 0.2);
    for (const lx of [-130, 130]) { P.flat(ctx, P.rr(lx - 10, -70, 20, 72, 6), PAL.steel, { off: 3 }); P.flat(ctx, P.rr(lx - 40, -8, 80, 14, 6), PAL.grey, { off: 2 }); }
    ctx.save(); ctx.translate(-30, -86); ctx.rotate(-incline); P.flat(ctx, P.rr(-150, -18, 300, 36, 16), PAL.ink, { off: 5, light: 0.25 }); ctx.restore();
    ctx.restore(); };
  P.pullupBar = (ctx, x, y, w = 420, s = 1) => { at(ctx, x, y, s);
    for (const sd of [-1, 1]) P.flat(ctx, P.rr(sd * w / 2 - 14, -10, 28, 600, 8), PAL.grey, { off: 4 });
    P.flat(ctx, P.rr(-w / 2 - 20, -14, w + 40, 28, 14), PAL.steel, { off: 4 }); ctx.restore(); };
  P.rope = (ctx, x, y, w, t, k = 1) => { // jump rope swinging around two handles
    const ph = t * 8, sw = Math.cos(ph) * 180 * k; ctx.save(); ctx.strokeStyle = PAL.cyan; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x, y + sw, x + w / 2, y); ctx.stroke(); ctx.restore();
    for (const sd of [-1, 1]) P.flat(ctx, P.capsule(x + sd * w / 2, y - 26, x + sd * w / 2, y + 10, 10), PAL.orange, { off: 3 }); };
  P.stopwatch = (ctx, x, y, r, frac = 0, label = '', col = PAL.amber) => { // frac 0..1 sweeps the hand once
    P.flat(ctx, P.rr(x - r * 0.2, y - r * 1.32, r * 0.4, r * 0.3, r * 0.08), PAL.grey, { off: 3 });
    P.flat(ctx, P.circ(x, y, r), PAL.steel, { off: r * 0.08 }); P.fill(ctx, P.circ(x, y, r * 0.84), PAL.white);
    if (frac > 0) { ctx.save(); ctx.fillStyle = P.alpha(col, 0.35); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * 0.84, -Math.PI / 2, -Math.PI / 2 + TAU * cl(frac)); ctx.closePath(); ctx.fill(); ctx.restore(); }
    const a = -Math.PI / 2 + TAU * frac; ctx.save(); ctx.strokeStyle = PAL.red; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7); ctx.stroke(); ctx.restore();
    P.fill(ctx, P.circ(x, y, r * 0.08), PAL.ink); if (label) { ctx.save(); txt(ctx, label, x, y + r * 0.42, r * 0.28, PAL.ink); ctx.restore(); } };
  P.bottle = (ctx, x, y, s = 1, col = PAL.blue, level = 0.7) => { at(ctx, x, y, s);
    P.flat(ctx, P.rr(-36, -110, 72, 200, 24), P.alpha(PAL.white, 0.9), { off: 5 });
    const h = 180 * cl(level); P.fill(ctx, P.rr(-30, 84 - h, 60, h, 18), P.alpha(PAL.cyan, 0.75));
    P.flat(ctx, P.rr(-22, -140, 44, 34, 10), col, { off: 4 }); P.fill(ctx, P.rr(-36, -40, 72, 40, 4), col); ctx.restore(); };

  // ---------------- supplements ----------------
  P.tub = (ctx, x, y, s = 1, col = PAL.ink, label = 'WHEY', sub = '', accent = PAL.amber) => { at(ctx, x, y, s);
    P.shadow(ctx, 0, 112, 100, 16, 0.2);
    P.flat(ctx, P.rr(-92, -96, 184, 206, 26), col, { off: 8, light: 0.2 }); P.flat(ctx, P.rr(-100, -130, 200, 46, 16), P.shade(col, 0.2), { off: 5 });
    P.fill(ctx, P.rr(-80, -60, 160, 100, 14), accent); txt(ctx, label, 0, -18, label.length > 6 ? 30 : 40, PAL.ink);
    if (sub) txt(ctx, sub, 0, 70, 22, P.light(accent, 0.3), 800); ctx.restore(); };
  P.scoop = (ctx, x, y, s = 1, powder = PAL.cream, rot = 0) => { at(ctx, x, y, s, rot);
    P.flat(ctx, P.capsule(30, 0, 120, 0, 10), PAL.white, { off: 3 }); P.flat(ctx, P.rr(-46, -38, 80, 62, 16), PAL.white, { off: 5 });
    P.flat(ctx, P.ell(-6, -38, 40, 16), powder, { off: 3 }); ctx.restore(); };
  P.pill = (ctx, x, y, s = 1, rot = 0, c1 = PAL.red, c2 = PAL.white) => { at(ctx, x, y, s, rot);
    ctx.save(); P.capsule(-40, 0, 40, 0, 20)(ctx); ctx.clip(); P.flat(ctx, P.rr(-70, -30, 70, 60, 0), c1, { off: 4 }); P.flat(ctx, P.rr(0, -30, 70, 60, 0), c2, { off: 4 }); ctx.restore();
    P.fill(ctx, P.rr(-30, -13, 26, 6, 3), P.alpha(PAL.white, 0.5)); ctx.restore(); };
  P.softgel = (ctx, x, y, s = 1, rot = 0, col = PAL.amber) => { at(ctx, x, y, s, rot); P.glow(ctx, 0, 0, 60, col, 0.3); P.flat(ctx, P.ell(0, 0, 44, 24), col, { off: 5, light: 0.4 }); P.fill(ctx, P.ell(-14, -9, 12, 5, -0.2), P.alpha(PAL.white, 0.6)); ctx.restore(); };
  P.coffee = (ctx, x, y, s = 1, t = 0) => { at(ctx, x, y, s);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.7 + i / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - ph) * 0.5; ctx.strokeStyle = PAL.white; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); const bx = -24 + i * 24; ctx.moveTo(bx, -70 - ph * 60); ctx.quadraticCurveTo(bx + 14, -90 - ph * 60, bx, -110 - ph * 60); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = PAL.white; ctx.beginPath(); ctx.arc(64, 4, 26, -1.2, 1.2); ctx.stroke(); ctx.restore();
    P.flat(ctx, P.poly([[-66, -58], [66, -58], [52, 62], [-52, 62]]), PAL.white, { off: 6 }); P.fill(ctx, P.ell(0, -58, 66, 12), '#6b3a1e'); P.fill(ctx, P.rr(-60, -14, 118, 24, 4), PAL.orange); ctx.restore(); };
  P.sun = (ctx, x, y, r, t = 0) => { P.glow(ctx, x, y, r * 2.6, PAL.yellow, 0.5);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * 0.3; ctx.save(); ctx.translate(x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.35); ctx.rotate(a); P.fill(ctx, P.rr(-r * 0.18, -r * 0.07, r * 0.36, r * 0.14, r * 0.07), PAL.amber); ctx.restore(); }
    P.flat(ctx, P.circ(x, y, r), PAL.yellow, { off: r * 0.08 }); };
  // evidence badge: level 0..3 (none, weak, moderate, strong)
  P.evidence = (ctx, x, y, level, k = 1) => { if (k <= 0) return; const names = ['NO EVIDENCE', 'WEAK', 'MODERATE', 'STRONG'], cols = [PAL.grey, PAL.red, PAL.amber, PAL.mint];
    ctx.save(); ctx.translate(x, y); const pk = pop(k); ctx.scale(pk, pk);
    P.flat(ctx, P.rr(-190, -70, 380, 140, 30), PAL.ink, { off: 6, light: 0.15 }); txt(ctx, 'EVIDENCE', 0, -38, 22, PAL.grey, 800);
    for (let i = 0; i < 3; i++) P.flat(ctx, P.rr(-150 + i * 104, -14, 92, 26, 13), i < level ? cols[level] : P.alpha(PAL.white, 0.15), { off: i < level ? 3 : 0, light: i < level ? 0.22 : 0 });
    txt(ctx, names[level], 0, 44, 30, cols[level]); ctx.restore(); };

  // ---------------- food ----------------
  P.chicken = (ctx, x, y, s = 1, rot = 0) => { at(ctx, x, y, s, rot); P.flat(ctx, P.blob([[-80, -10], [-40, -50], [40, -46], [86, -6], [60, 40], [-50, 44]]), '#f1c07a', { off: 7 }); for (let i = -1; i <= 1; i++) P.fill(ctx, P.rr(-40 + i * 34, -24, 8, 44, 4), P.alpha('#b06a2a', 0.5)); ctx.restore(); };
  P.steak = (ctx, x, y, s = 1, rot = 0) => { at(ctx, x, y, s, rot); P.flat(ctx, P.blob([[-90, -20], [-50, -56], [40, -50], [92, -10], [70, 44], [-20, 52], [-84, 30]]), '#b8423a', { off: 7 }); P.fill(ctx, P.blob([[-60, -30], [-30, -44], [10, -36], [-20, -20]]), '#f6d6c8'); ctx.restore(); };
  P.rice = (ctx, x, y, s = 1) => { at(ctx, x, y, s); P.flat(ctx, P.blob([[-80, -40], [-40, -76], [40, -76], [80, -40]]), PAL.bone, { off: 6 }); P.flat(ctx, P.poly([[-100, -40], [100, -40], [70, 40], [-70, 40]]), PAL.blue, { off: 7 }); ctx.restore(); };
  P.banana = (ctx, x, y, s = 1, rot = 0) => { at(ctx, x, y, s, rot); ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 34; ctx.strokeStyle = PAL.yellow; ctx.beginPath(); ctx.arc(0, -70, 90, 0.35 * Math.PI, 0.9 * Math.PI); ctx.stroke(); ctx.lineWidth = 12; ctx.strokeStyle = PAL.amber; ctx.beginPath(); ctx.arc(0, -70, 104, 0.4 * Math.PI, 0.85 * Math.PI); ctx.stroke(); ctx.restore(); ctx.restore(); };
  P.broccoli = (ctx, x, y, s = 1) => { at(ctx, x, y, s); P.flat(ctx, P.rr(-14, -10, 28, 70, 12), '#8fd16a', { off: 4 }); for (const [bx, by, r] of [[-34, -26, 30], [0, -50, 36], [34, -26, 30], [0, -14, 28]]) P.flat(ctx, P.circ(bx, by, r), PAL.green, { off: 5 }); ctx.restore(); };
  P.milk = (ctx, x, y, s = 1) => { at(ctx, x, y, s); P.flat(ctx, P.poly([[-44, -90], [44, -90], [50, 96], [-50, 96]]), P.alpha(PAL.white, 0.95), { off: 6 }); P.fill(ctx, P.poly([[-46, -40], [46, -40], [50, 92], [-50, 92]]), PAL.bone); ctx.restore(); };
  // a plate split into portions: parts = [[fraction, colour, label], ...]
  P.platePie = (ctx, x, y, r, parts, k = 1) => { P.flat(ctx, P.circ(x, y, r * 1.12), PAL.white, { off: r * 0.06 }); let a = -Math.PI / 2;
    parts.forEach(([f, c, lab], i) => { const kk = cl(k * parts.length - i); if (kk <= 0) return; const a1 = a + TAU * f * kk; ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a, a1); ctx.closePath(); ctx.fill(); ctx.restore();
      if (lab && kk >= 1) { const m = (a + a1) / 2; ctx.save(); txt(ctx, lab, x + Math.cos(m) * r * 0.58, y + Math.sin(m) * r * 0.58, r * 0.16, PAL.ink); ctx.restore(); } a = a + TAU * f; }); };

  // ---------------- body parts ----------------
  P.bone = (ctx, x, y, len, s = 1, rot = 0, col = PAL.bone) => { at(ctx, x, y, s, rot); P.flat(ctx, P.rr(-len / 2, -16, len, 32, 16), col, { off: 4 }); for (const sd of [-1, 1]) for (const dy of [-1, 1]) P.flat(ctx, P.circ(sd * len / 2, dy * 22, 26), col, { off: 4 }); ctx.restore(); };
  // knee joint, side view: thigh bone over shin bone, cartilage pads, kneecap; bend 0..1
  P.knee = (ctx, x, y, s = 1, bend = 0, glow = 0) => { at(ctx, x, y, s); const a = bend * 1.4;
    if (glow > 0) P.glow(ctx, 0, 0, 160, PAL.red, 0.6 * glow);
    ctx.save(); ctx.rotate(-0.1); P.flat(ctx, P.rr(-26, -260, 52, 250, 26), PAL.bone, { off: 6 }); P.flat(ctx, P.ell(0, -14, 50, 34), PAL.bone, { off: 6 }); ctx.restore();
    P.fill(ctx, P.ell(0, 22, 48, 9), PAL.aqua);
    ctx.save(); ctx.rotate(a); P.flat(ctx, P.ell(0, 44, 46, 22), PAL.bone, { off: 5 }); P.flat(ctx, P.rr(-22, 44, 44, 240, 22), PAL.bone, { off: 6 }); ctx.restore();
    P.flat(ctx, P.ell(46 + bend * 10, -4 + bend * 20, 18, 26), P.light(PAL.amber, 0.4), { off: 3 }); ctx.restore(); };
  // spine: n vertebrae from (x, y) downward; curve -1..1 rounds the back; hi = index to light up
  P.spine = (ctx, x, y, s = 1, curve = 0, hi = -1, n = 9) => { at(ctx, x, y, s);
    for (let i = 0; i < n; i++) { const u = i / (n - 1), bx = Math.sin(u * Math.PI) * curve * 60, by = i * 44; const c = i === hi ? PAL.red : PAL.bone; if (i === hi) P.glow(ctx, bx, by, 80, PAL.red, 0.6);
      P.flat(ctx, P.rr(bx - 34, by - 15, 68, 30, 12), c, { off: 4 }); P.flat(ctx, P.rr(bx + 26, by - 6, 30, 12, 6), c, { off: 2 }); if (i < n - 1) P.fill(ctx, P.rr(bx - 26, by + 15, 52, 12, 6), PAL.aqua); }
    ctx.restore(); };
  // motor neuron: cell body at (x, y), axon to (x2, y2) that splits into n endings; k = signal travelling along it
  P.neuron = (ctx, x, y, x2, y2, t, k = 0, n = 4, col = PAL.yellow) => {
    ctx.save(); ctx.strokeStyle = P.shade(col, 0.1); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 0.35 + Math.atan2(y2 - y, x2 - x); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 + Math.cos(a) * 70, y2 + Math.sin(a) * 70); ctx.lineWidth = 6; ctx.stroke(); P.fill(ctx, P.circ(x2 + Math.cos(a) * 70, y2 + Math.sin(a) * 70, 9), col); }
    ctx.restore();
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.3; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 62, y + Math.sin(a) * 62); ctx.stroke(); ctx.restore(); }
    P.flat(ctx, P.circ(x, y, 40), col, { off: 5 }); P.fill(ctx, P.circ(x, y, 16), PAL.orange);
    if (k > 0 && k < 1) { const px = lerp(x, x2, k), py = lerp(y, y2, k); P.glow(ctx, px, py, 60, PAL.white, 0.9); P.fill(ctx, P.circ(px, py, 10), PAL.white); } };
  P.kidney = (ctx, x, y, s = 1, col = '#c94a5a') => { at(ctx, x, y, s); P.flat(ctx, P.blob([[-30, -80], [30, -86], [60, -30], [56, 40], [24, 86], [-30, 80], [-50, 30], [-10, 0], [-50, -30]]), col, { off: 7 }); ctx.restore(); };
  P.stomach = (ctx, x, y, s = 1, full = 0.4) => { at(ctx, x, y, s); const path = P.blob([[-30, -110], [10, -100], [20, -50], [80, -10], [90, 60], [30, 100], [-60, 80], [-70, 20], [-30, -20], [-40, -80]]);
    P.flat(ctx, path, PAL.pink, { off: 7 }); ctx.save(); path(ctx); ctx.clip(); P.fill(ctx, P.rr(-100, 100 - 200 * cl(full), 200, 200, 0), P.alpha(PAL.amber, 0.6)); ctx.restore(); ctx.restore(); };
  // amino-acid chain (a protein): n beads along a wave; k builds it bead by bead
  P.protein = (ctx, x, y, len, t, k = 1, n = 12) => { for (let i = 0; i < n; i++) { const kk = cl(k * n - i); if (kk <= 0) break; const u = i / (n - 1), bx = x - len / 2 + u * len, by = y + Math.sin(u * 6 + t * 2) * 26;
      if (i > 0) { const pu = (i - 1) / (n - 1), px = x - len / 2 + pu * len, py = y + Math.sin(pu * 6 + t * 2) * 26; ctx.save(); ctx.strokeStyle = P.alpha(PAL.white, 0.6); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore(); }
      P.flat(ctx, P.circ(bx, by, 16 * pop(kk)), [PAL.mint, PAL.amber, PAL.pink, PAL.cyan][i % 4], { off: 3 }); } };
  // heart-rate trace across a box; bpm controls spacing
  P.ecg = (ctx, x, y, w, h, t, bpm = 70, col = PAL.mint) => { P.fill(ctx, P.rr(x, y - h / 2, w, h, 18), 'rgba(255,255,255,0.08)'); ctx.save(); ctx.beginPath(); P.rr(x, y - h / 2, w, h, 18)(ctx); ctx.clip();
    ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.beginPath(); const per = 60 / bpm;
    for (let px = 0; px <= w; px += 3) { const tt = t - (w - px) / w * 3, ph = ((tt % per) + per) % per / per; let v = 0; if (ph > 0.3 && ph < 0.34) v = -0.9; else if (ph >= 0.34 && ph < 0.38) v = 0.5; else if (ph > 0.6 && ph < 0.72) v = -0.18 * Math.sin((ph - 0.6) / 0.12 * Math.PI);
      const py = y + v * h * 0.42; if (px === 0) ctx.moveTo(x + px, py); else ctx.lineTo(x + px, py); } ctx.stroke(); ctx.restore(); };
  P.thermometer = (ctx, x, y, s = 1, k = 0.5) => { at(ctx, x, y, s); P.flat(ctx, P.rr(-20, -150, 40, 190, 20), PAL.white, { off: 4 }); P.flat(ctx, P.circ(0, 60, 36), PAL.white, { off: 4 }); P.fill(ctx, P.circ(0, 60, 26), PAL.red); P.fill(ctx, P.rr(-10, 40 - 170 * cl(k), 20, 170 * cl(k) + 20, 10), PAL.red); ctx.restore(); };
  P.bed = (ctx, x, y, s = 1, t = 0, who = true) => { at(ctx, x, y, s); P.shadow(ctx, 0, 70, 230, 18, 0.2);
    P.flat(ctx, P.rr(-230, -10, 460, 70, 18), PAL.hair, { off: 5 }); P.flat(ctx, P.rr(-250, -110, 34, 190, 14), P.shade(PAL.hair, 0.1), { off: 4 });
    P.flat(ctx, P.rr(-210, -54, 100, 46, 20), PAL.white, { off: 4 });
    if (who) { P.flat(ctx, P.circ(-150, -62, 40), PAL.skin, { off: 6 }); P.fill(ctx, P.rr(-190, -100, 80, 26, 12), PAL.hair); ctx.save(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(-150 + sd * 14, -60, 6, 0.2, Math.PI - 0.2); ctx.stroke(); } ctx.restore(); }
    P.flat(ctx, P.blob([[-130, -40], [210, -40], [224, 10], [-130, 14]]), PAL.blue, { off: 6 });
    for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; txt(ctx, 'z', -110 + i * 18 + ph * 40, -110 - ph * 120, 30 + i * 10, PAL.white); ctx.restore(); }
    ctx.restore(); };

  // ---------------- muscle map ----------------
  // front or back body silhouette with named zones that light up: hi = { chest: 1, quads: 0.5, ... } (0..1 each)
  // zones front: shoulders, chest, biceps, forearms, abs, obliques, quads, adductors, calves; back: traps, lats, rear, triceps, lowback, glutes, hamstrings, calves
  P.musclemap = (ctx, x, y, s = 1, side = 'front', hi = {}, col = PAL.red) => { at(ctx, x, y, s);
    const base = '#5b5fd6', Z = (name, path) => { const k = cl(hi[name] || 0); P.flat(ctx, path, k > 0 ? (k >= 1 ? col : P.alpha(col, 0.35 + 0.65 * k)) : P.light(base, 0.12), { off: 3, light: 0.15 }); if (k > 0) ctx.save(), path(ctx), ctx.restore(); };
    // body base
    P.flat(ctx, P.circ(0, -330, 42), base, { off: 5 }); P.flat(ctx, P.rr(-16, -296, 32, 30, 10), base, { off: 2 });
    P.flat(ctx, P.blob([[-96, -262], [96, -262], [86, -120], [60, -10], [-60, -10], [-86, -120]]), base, { off: 6 });
    for (const sd of [-1, 1]) { P.flat(ctx, P.capsule(sd * 104, -240, sd * 126, -100, 24, 20), base, { off: 4 }); P.flat(ctx, P.capsule(sd * 126, -100, sd * 136, 20, 19, 15), base, { off: 4 }); P.flat(ctx, P.capsule(sd * 34, 0, sd * 44, 180, 36, 26), base, { off: 5 }); P.flat(ctx, P.capsule(sd * 44, 180, sd * 46, 330, 25, 16), base, { off: 4 }); }
    if (side === 'front') {
      for (const sd of [-1, 1]) {
        Z('shoulders', P.circ(sd * 98, -238, 30)); Z('chest', P.blob([[sd * 6, -236], [sd * 84, -230], [sd * 80, -170], [sd * 10, -160]]));
        Z('biceps', P.capsule(sd * 110, -200, sd * 124, -120, 16, 13)); Z('forearms', P.capsule(sd * 128, -80, sd * 134, 10, 14, 11));
        Z('obliques', P.blob([[sd * 54, -140], [sd * 76, -130], [sd * 60, -30], [sd * 46, -40]])); Z('quads', P.capsule(sd * 42, 30, sd * 46, 160, 28, 20));
        Z('adductors', P.blob([[sd * 8, 20], [sd * 24, 30], [sd * 26, 110], [sd * 12, 90]])); Z('calves', P.capsule(sd * 46, 210, sd * 46, 290, 16, 11));
      }
      for (let r = 0; r < 3; r++) for (const sd of [-1, 1]) Z('abs', P.rr(sd > 0 ? 4 : -40, -146 + r * 40, 36, 34, 10));
    } else {
      for (const sd of [-1, 1]) {
        Z('rear', P.circ(sd * 98, -238, 30)); Z('lats', P.blob([[sd * 20, -210], [sd * 84, -210], [sd * 70, -110], [sd * 24, -80]])); Z('triceps', P.capsule(sd * 112, -200, sd * 124, -120, 16, 13));
        Z('lowback', P.rr(sd > 0 ? 4 : -38, -76, 34, 60, 12)); Z('glutes', P.ell(sd * 36, 14, 38, 34)); Z('hamstrings', P.capsule(sd * 42, 70, sd * 46, 170, 24, 18)); Z('calves', P.capsule(sd * 46, 210, sd * 46, 290, 18, 12));
      }
      Z('traps', P.blob([[-60, -262], [60, -262], [30, -200], [0, -170], [-30, -200]]));
    }
    for (const k in hi) if (hi[k] >= 1) {} // reserved
    ctx.restore(); };

  // ---------------- side-view lifter (for form) ----------------
  // pose: 'stand' | 'hinge' (deadlift/RDL) | 'squat' | 'plank' | 'pushup' (0..1 down) | 'row' | 'press' (overhead) | 'hang' (pull-up)
  // o: { k: 0..1 pose depth, bar: true, wince, smile, facing: 1 | -1, bulk }
  P.lifterSide = (ctx, x, y, s = 1, pose = 'stand', o = {}) => {
    const k = cl(o.k == null ? 1 : o.k), f = o.facing || 1, bw = 1 + (o.bulk || 0) * 0.25;
    // joint angles (radians from vertical; 0 = straight down/up)
    let hip, kneeB, torso, arm = 0, lift = 0, rot = 0, armUp = false;
    switch (pose) {
      case 'hinge': torso = 1.25 * k; hip = 0.1 * k; kneeB = 0.25 * k; arm = 0; break;
      case 'squat': torso = 0.6 * k; hip = 1.6 * k; kneeB = 2.0 * k; arm = 1.4; break;
      case 'row': torso = 1.15; hip = 0.15; kneeB = 0.35; arm = k * 1.2; break;
      case 'press': torso = 0; hip = 0; kneeB = 0; armUp = true; arm = k; break;
      case 'hang': torso = 0; hip = 0.2; kneeB = 0.6; armUp = true; arm = 1; lift = -k * 120; break;
      case 'plank': case 'pushup': rot = Math.PI / 2 * 0.92; torso = 0; hip = 0; kneeB = 0; arm = 0; break;
      default: torso = 0; hip = 0; kneeB = 0;
    }
    ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
    if (pose !== 'hang') P.shadow(ctx, 0, 4, pose === 'plank' || pose === 'pushup' ? 200 : 110, 16, 0.22);
    const thigh = 104, shin = 98, trunk = 150, upper = 84, fore = 78;
    let hipP, kneeP, ankP;
    if (pose === 'plank' || pose === 'pushup') {
      const down = pose === 'pushup' ? k : 0, ax = -170, shY = -60 + down * 38;
      ankP = [ax + 10, -10]; hipP = [ax + 10 + (thigh + shin) * 0.98, -24 - (thigh + shin) * 0.2 + down * 20]; kneeP = [(ankP[0] + hipP[0]) / 2, (ankP[1] + hipP[1]) / 2];
      const sh = [hipP[0] + trunk, shY], hand = [sh[0] + 10, -6], elbow = [lerp(sh[0], hand[0], 0.5) - down * 40, lerp(sh[1], hand[1], 0.5) - down * 10];
      if (pose === 'plank') { elbow[0] = sh[0]; elbow[1] = -8; hand[0] = sh[0] + 60; }
      P.flat(ctx, P.capsule(ankP[0], ankP[1], kneeP[0], kneeP[1], 15 * bw, 19 * bw), PAL.skin, { off: 5 });
      P.flat(ctx, P.capsule(kneeP[0], kneeP[1], hipP[0], hipP[1], 19 * bw, 23 * bw), '#272a8f', { off: 5 });
      P.flat(ctx, P.rr(ankP[0] - 30, ankP[1] - 10, 30, 22, 8), '#f4f4ff', { off: 3 });
      P.flat(ctx, P.capsule(hipP[0], hipP[1], sh[0], sh[1], 30 * bw, 34 * bw), PAL.teal, { off: 7 });
      P.flat(ctx, P.capsule(sh[0], sh[1], elbow[0], elbow[1], 15 * bw), PAL.skin, { off: 5 }); P.flat(ctx, P.capsule(elbow[0], elbow[1], hand[0], hand[1], 13 * bw), PAL.skin, { off: 5 });
      head(ctx, sh[0] + 52, sh[1] - 18, o, 0.35);
      ctx.restore(); return { hip: hipP, shoulder: sh };
    }
    ankP = [0, -14]; ctx.translate(0, lift);
    const kneeA = kneeB * 0.5, shinV = [Math.sin(kneeA) * shin, -Math.cos(kneeA) * shin];
    kneeP = [ankP[0] + shinV[0], ankP[1] + shinV[1]];
    const thA = kneeA - Math.min(kneeB, hip + kneeA);
    hipP = [kneeP[0] + Math.sin(-hip * 0.9 + kneeA * 0) * thigh * -0.0 - Math.sin(hip * 0.85) * thigh, kneeP[1] - Math.cos(hip * 0.85) * thigh];
    const sh = [hipP[0] + Math.sin(torso) * trunk, hipP[1] - Math.cos(torso) * trunk];
    // arms hang from the shoulder (gravity) unless pressing / hanging / holding squat bar
    let elbow, hand;
    if (armUp) { const up = pose === 'press' ? lerp(0.6, 1, arm) : 1; elbow = [sh[0] + 10, sh[1] - upper * up]; hand = [sh[0] + 6, sh[1] - (upper + fore) * up]; if (pose === 'press') { elbow = [sh[0] + 30 * (1 - arm), sh[1] - upper * lerp(0.2, 1, arm)]; hand = [sh[0] + 8, sh[1] - lerp(70, upper + fore, arm)]; } }
    else if (pose === 'squat') { elbow = [sh[0] + 40, sh[1] + 30]; hand = [sh[0] + 6, sh[1] - 8]; }
    else if (pose === 'row') { hand = [sh[0] + 6, sh[1] + upper + fore - arm * 90]; elbow = [sh[0] - arm * 46, sh[1] + upper * 0.8 - arm * 30]; }
    else { elbow = [sh[0], sh[1] + upper]; hand = [sh[0], sh[1] + upper + fore]; }
    // back leg (shade), legs, shorts, torso, arm, head
    P.flat(ctx, P.capsule(ankP[0] - 8, ankP[1], kneeP[0] - 8, kneeP[1], 15 * bw, 18 * bw), PAL.skinD, { off: 4 });
    P.flat(ctx, P.capsule(ankP[0], ankP[1], kneeP[0], kneeP[1], 16 * bw, 19 * bw), PAL.skin, { off: 5 });
    P.flat(ctx, P.rr(ankP[0] - 16, ankP[1] - 6, 48, 22, 10), '#f4f4ff', { off: 3 }); P.fill(ctx, P.rr(ankP[0] - 16, ankP[1] + 10, 48, 6, 3), '#3b3f9e');
    P.flat(ctx, P.capsule(kneeP[0], kneeP[1], hipP[0], hipP[1], 21 * bw, 26 * bw), '#272a8f', { off: 6 });
    if (o.bar && pose === 'squat') { const bp = [sh[0] - Math.cos(torso) * 34, sh[1] - Math.sin(torso) * 34 + 6]; P.flat(ctx, P.circ(bp[0], bp[1], 40), PAL.orange, { off: 5 }); P.fill(ctx, P.circ(bp[0], bp[1], 9), PAL.steel); }
    P.flat(ctx, P.capsule(hipP[0], hipP[1], sh[0], sh[1], 30 * bw, 33 * bw), PAL.teal, { off: 7 });
    P.flat(ctx, P.capsule(sh[0], sh[1], elbow[0], elbow[1], 16 * bw, 14 * bw), PAL.skin, { off: 5 });
    P.flat(ctx, P.capsule(elbow[0], elbow[1], hand[0], hand[1], 14 * bw, 12 * bw), PAL.skin, { off: 5 }); P.flat(ctx, P.circ(hand[0], hand[1], 13 * bw), PAL.skin, { off: 3 });
    const hx = sh[0] + Math.sin(torso) * 52, hy = sh[1] - Math.cos(torso) * 52;
    head(ctx, hx, hy, o, torso);
    if (o.bar && pose !== 'squat') { const bp = hand; P.fill(ctx, P.rr(bp[0] - 6, bp[1] - 6, 12, 12, 6), PAL.steel); P.flat(ctx, P.circ(bp[0], bp[1], 46), PAL.orange, { off: 5 }); P.fill(ctx, P.circ(bp[0], bp[1], 10), PAL.steel); }
    if (pose === 'hang') P.flat(ctx, P.rr(hand[0] - 220, hand[1] - 24, 440, 22, 11), PAL.steel, { off: 3 });
    ctx.restore(); return { hip: [x + hipP[0] * s * f, y + (hipP[1] + lift) * s], shoulder: [x + sh[0] * s * f, y + (sh[1] + lift) * s], hand: [x + hand[0] * s * f, y + (hand[1] + lift) * s], knee: [x + kneeP[0] * s * f, y + (kneeP[1] + lift) * s] };
  };
  function head(ctx, hx, hy, o, tilt) {
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt * 0.4);
    P.flat(ctx, P.circ(0, 0, 38), PAL.skin, { off: 6 });
    P.flat(ctx, P.blob([[-36, -6], [-30, -34], [-6, -46], [16, -44], [34, -26], [30, -14], [-6, -24], [-24, -10]]), PAL.hair, { off: 4, light: 0.15 });
    P.fill(ctx, P.rr(-38, -22, 74, 11, 5), PAL.orange);
    ctx.fillStyle = '#ffffff'; P.ell(18, 2, 8, o.wince ? 4 : 10)(ctx); ctx.fill(); ctx.fillStyle = PAL.ink; P.circ(21, 4, 4.5)(ctx); ctx.fill();
    ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath();
    if (o.smile) ctx.arc(20, 16, 9, 0.1 * Math.PI, 0.7 * Math.PI); else if (o.wince) { ctx.moveTo(14, 22); ctx.lineTo(30, 20); } else { ctx.moveTo(16, 22); ctx.lineTo(28, 22); } ctx.stroke();
    P.fill(ctx, P.circ(4, 14, 6), 'rgba(255,90,120,0.35)'); ctx.restore();
  }

  // ---------------- charts and UI ----------------
  // checklist row: ok true = green tick, false = red cross
  P.check = (ctx, text, x, y, ok, k = 1, size = 34) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); const pk = pop(k); ctx.scale(pk, pk); ctx.font = `900 ${size}px ${P.FONT}`; const tw = ctx.measureText(text).width, w = tw + size * 2.6;
    P.flat(ctx, P.rr(-w / 2, -size * 0.85, w, size * 1.7, size * 0.85), P.alpha(PAL.ink, 0.85), { off: 4, light: 0.1 });
    P.flat(ctx, P.circ(-w / 2 + size * 0.95, 0, size * 0.6), ok ? PAL.mint : PAL.red, { off: 3 });
    ctx.strokeStyle = PAL.white; ctx.lineWidth = size * 0.16; ctx.lineCap = 'round'; ctx.beginPath(); const cx = -w / 2 + size * 0.95, r = size * 0.28;
    if (ok) { ctx.moveTo(cx - r, 0); ctx.lineTo(cx - r * 0.2, r * 0.8); ctx.lineTo(cx + r, -r * 0.7); } else { ctx.moveTo(cx - r, -r); ctx.lineTo(cx + r, r); ctx.moveTo(cx + r, -r); ctx.lineTo(cx - r, r); } ctx.stroke();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = PAL.white; ctx.fillText(text, -w / 2 + size * 1.85, size * 0.04); ctx.restore(); };
  // MYTH / FACT badge
  P.verdict = (ctx, x, y, fact, k = 1, s = 1) => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(-0.08); const pk = pop(k); ctx.scale(s * pk, s * pk);
    const col = fact ? PAL.mint : PAL.red; P.flat(ctx, P.rr(-150, -54, 300, 108, 22), col, { off: 7 }); P.fill(ctx, P.rr(-136, -40, 272, 80, 14), P.shade(col, 0.15)); txt(ctx, fact ? 'FACT' : 'MYTH', 0, 4, 64); ctx.restore(); };
  // A vs B card: two panels with titles; draws callbacks inside; win: 0 = none, 1 = left, 2 = right
  P.versus = (ctx, x, y, w, h, a, b, k = 1, win = 0, drawA = null, drawB = null) => { if (k <= 0) return; ctx.save(); ctx.globalAlpha = cl(k * 2);
    [[a, -1, drawA, PAL.blue], [b, 1, drawB, PAL.magenta]].forEach(([lab, sd, fn, c], i) => { const px = x + sd * (w / 4 + 6), on = win === i + 1;
      P.flat(ctx, P.rr(px - w / 4, y - h / 2, w / 2 - 12, h, 28), on ? c : P.alpha(c, 0.55), { off: 6 }); if (on) P.glow(ctx, px, y, w / 3, c, 0.35);
      if (fn) { ctx.save(); ctx.translate(px, y + 10); fn(ctx); ctx.restore(); } ctx.save(); txt(ctx, lab, px, y - h / 2 + 44, 34); ctx.restore(); });
    P.flat(ctx, P.circ(x, y, 42), PAL.yellow, { off: 5 }); txt(ctx, 'VS', x, y + 2, 34, PAL.ink); ctx.restore(); };
  // rising/falling line chart: pts 0..1 values, k draws it left to right
  P.lineChart = (ctx, x, y, w, h, pts, k = 1, col = PAL.mint, label = '') => { P.fill(ctx, P.rr(x, y - h, w, h, 18), 'rgba(255,255,255,0.08)');
    ctx.save(); ctx.strokeStyle = P.alpha(PAL.white, 0.25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 30, y - 24); ctx.lineTo(x + w - 20, y - 24); ctx.moveTo(x + 30, y - 24); ctx.lineTo(x + 30, y - h + 20); ctx.stroke();
    const n = pts.length, X = (i) => x + 40 + (w - 70) * i / (n - 1), Y = (v) => y - 34 - (h - 70) * v, lim = k * (n - 1);
    ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i <= Math.floor(lim); i++) { if (i === 0) ctx.moveTo(X(0), Y(pts[0])); else ctx.lineTo(X(i), Y(pts[i])); }
    const f = lim - Math.floor(lim), i0 = Math.floor(lim); if (i0 < n - 1 && f > 0) ctx.lineTo(lerp(X(i0), X(i0 + 1), f), Y(lerp(pts[i0], pts[i0 + 1], f)));
    ctx.stroke(); ctx.restore(); if (label) P.label(ctx, label, x + w / 2, y + 40, 1, { color: col, size: 24 }); };
  // horizontal progress bar with value text
  P.progress = (ctx, x, y, w, k, col = PAL.mint, label = '') => { P.fill(ctx, P.rr(x - w / 2, y - 22, w, 44, 22), 'rgba(255,255,255,0.14)'); const fw = Math.max(44, w * cl(k)); P.flat(ctx, P.rr(x - w / 2, y - 22, fw, 44, 22), col, { off: 4 });
    if (label) { ctx.save(); txt(ctx, label, x, y + 2, 24, PAL.ink); ctx.restore(); } };
  // round countdown ring (rest timer): frac 0..1 remaining, centre text
  P.ring = (ctx, x, y, r, frac, text = '', col = PAL.cyan) => { ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = r * 0.18; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * cl(frac)); ctx.stroke(); ctx.restore(); if (text) { ctx.save(); txt(ctx, text, x, y + 2, r * 0.5); ctx.restore(); } };
  // rep counter tally: n reps done of total, as filled dots
  P.reps = (ctx, x, y, n, total, col = PAL.amber, r = 18) => { const gap = r * 2.6, x0 = x - (total - 1) * gap / 2; for (let i = 0; i < total; i++) { const on = i < n; P.flat(ctx, P.circ(x0 + i * gap, y, on ? r : r * 0.7), on ? col : 'rgba(255,255,255,0.18)', { off: on ? 3 : 0, light: on ? 0.22 : 0 }); } };
  // series badge for frame 0: "WHY DOES THIS HAPPEN? #1" style pill with an icon dot
  P.seriesTag = (ctx, x, y, text, k = 1, col = PAL.magenta) => P.label(ctx, text, x, y, k, { color: col, size: 28 });
})();

// ======================= PROPS PACK 3 (4 Nov 2026): week-1 topics + the P.reel builder =======================
(function () {
  const P = window.P, PAL = P.PAL, TAU = Math.PI * 2, cl = P.cl, lerp = P.lerp;
  const at = (ctx, x, y, s, rot = 0) => { ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(s, s); };
  const txt = (ctx, s, x, y, size, color = PAL.white, w = 900) => { ctx.font = `${w} ${size}px ${P.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y); };

  // big close-up head of the lifter. o: { red 0..1, puff 0..1 (held breath cheeks), sweat, sleepy, shock, smile, wince, look, blink, t }
  P.face = (ctx, x, y, s = 1, o = {}) => { at(ctx, x, y, s); const red = cl(o.red || 0), t = o.t || 0;
    P.flat(ctx, P.rr(-50, 120, 100, 90, 30), PAL.skinD, { light: 0, off: 0 });
    P.flat(ctx, P.rr(-180, 190, 360, 120, 60), PAL.teal, { off: 8 });
    const skin = PAL.skin, r = 150 + (o.puff || 0) * 8;
    P.flat(ctx, P.ell(0, 0, r + (o.puff || 0) * 14, r), skin, { off: 14 });
    if (red > 0) { P.fill(ctx, P.ell(0, 30, (r + (o.puff || 0) * 14) * 0.92, r * 0.8), P.alpha('#ff6f7d', 0.32 * red)); P.glow(ctx, 0, 40, r * 1.2, '#ff5a6a', 0.25 * red); }
    P.flat(ctx, P.blob([[-150, -20], [-140, -110], [-70, -170], [-20, -150], [30, -190], [80, -150], [140, -140], [154, -40], [110, -70], [-110, -70]]), PAL.hair, { off: 10, light: 0.15 });
    P.fill(ctx, P.rr(-152, -78, 304, 40, 20), PAL.orange);
    const look = (o.look || 0) * 18, bl = o.blink || 0, sl = o.sleepy ? 0.55 : 0, w = o.wince || 0;
    for (const sd of [-1, 1]) { const ex = sd * 56 + look, ey = 10, sk = 1 + (o.shock || 0) * 0.35;
      P.fill(ctx, P.ell(ex, ey, 30 * sk, Math.max(2, 36 * sk * (1 - bl) * (1 - sl) * (1 - w * 0.6))), PAL.white);
      if (bl < 0.8) P.fill(ctx, P.circ(ex + look * 0.3, ey + 6, 15 / Math.sqrt(sk)), PAL.ink);
      if (w > 0.1 || sl) { ctx.save(); ctx.strokeStyle = PAL.hair; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - sd * 34, ey - 42 + (sl ? 14 : 0)); ctx.lineTo(ex + sd * 30, ey - 34 + w * 12); ctx.stroke(); ctx.restore(); } }
    P.fill(ctx, P.circ(-96, 64, 22), `rgba(255,70,100,${0.35 + red * 0.4})`); P.fill(ctx, P.circ(96, 64, 22), `rgba(255,70,100,${0.35 + red * 0.4})`);
    ctx.save(); ctx.strokeStyle = PAL.ink; ctx.fillStyle = PAL.ink; ctx.lineWidth = 11; ctx.lineCap = 'round';
    if (o.puff) { P.fill(ctx, P.ell(0, 90, 30, 10), P.shade(PAL.red, 0.2)); }
    else if (o.shock) { P.fill(ctx, P.ell(0, 92, 26, 32), PAL.ink); }
    else if (o.smile) { ctx.beginPath(); ctx.arc(0, 66, 36, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    else if (w > 0.3) { ctx.beginPath(); ctx.moveTo(-34, 92); for (let i = 1; i <= 6; i++) ctx.lineTo(-34 + i * 11.3, 92 + (i % 2 ? -10 : 0)); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(-22, 92); ctx.lineTo(22, 92); ctx.stroke(); }
    ctx.restore();
    if (o.sweat) P.sweat(ctx, 120, -60, t, 1, 3);
    if (o.puff) for (const sd of [-1, 1]) P.fill(ctx, P.circ(sd * 120, 70, 30 * o.puff), 'rgba(255,140,150,0.65)');
    ctx.restore(); };

  // dial gauge: k 0..1 needle, zones low/high coloured, label + value text
  P.gauge = (ctx, x, y, r, k, label = '', value = '', col = PAL.red) => {
    P.flat(ctx, P.circ(x, y, r), PAL.ink, { off: r * 0.06, light: 0.15 });
    ctx.save(); ctx.lineWidth = r * 0.16; ctx.lineCap = 'round';
    [[0, 0.5, PAL.mint], [0.5, 0.8, PAL.amber], [0.8, 1, PAL.red]].forEach(([a, b, c]) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.arc(x, y, r * 0.74, Math.PI * (0.8 + a * 1.4), Math.PI * (0.8 + b * 1.4)); ctx.stroke(); });
    const a = Math.PI * (0.8 + cl(k) * 1.4); ctx.strokeStyle = PAL.white; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66); ctx.stroke(); ctx.restore();
    P.fill(ctx, P.circ(x, y, r * 0.1), PAL.white);
    if (value) { ctx.save(); txt(ctx, value, x, y + r * 0.42, r * 0.3, PAL.yellow); ctx.restore(); }
    if (label) P.label(ctx, label, x, y + r + 40, 1, { color: col, size: 24 }); };

  // skin cross-section: surface, sweat glands that pump drops out (k = sweat rate), blood vessel that widens (flush)
  P.skinLayer = (ctx, x, y, w, t, k = 0, flush = 0) => { const h = 380;
    P.flat(ctx, P.rr(x - w / 2, y, w, h, 30), '#f2b38f', { off: 8 }); P.fill(ctx, P.rr(x - w / 2, y, w, 40, 20), PAL.skin);
    P.vessel(ctx, x - w / 2 + 10, y + h - 70, w - 20, 34 + flush * 26, t, { speed: 80 + flush * 120, seed: 9 });
    for (let i = 0; i < 4; i++) { const gx = x - w / 2 + (i + 0.5) * w / 4;
      ctx.save(); ctx.strokeStyle = '#d98d6c'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx, y + 20); ctx.lineTo(gx, y + 180); ctx.stroke(); ctx.restore();
      P.flat(ctx, P.circ(gx, y + 200, 30), '#e79a7a', { off: 5 });
      if (k > 0) { for (let j = 0; j < 2; j++) { const ph = ((t * (0.6 + k) + j / 2 + i * 0.3) % 1); if (ph < k + 0.2) P.drop(ctx, gx, y + 180 - ph * 220, 10 + 6 * k, PAL.cyan); } } } };

  // joint close-up: two bone ends with fluid between; bubble forms with k (0..1) and pops at k>=1 (flash)
  P.jointBubble = (ctx, x, y, s, k, gap = 0) => { at(ctx, x, y, s);
    P.fill(ctx, P.ell(0, 0, 150, 110 + gap * 20), P.alpha(PAL.aqua, 0.45));
    P.flat(ctx, P.rr(-60, -360 - gap * 20, 120, 300, 50), PAL.bone, { off: 8 }); P.flat(ctx, P.ell(0, -70 - gap * 20, 90, 46), PAL.bone, { off: 8 });
    P.flat(ctx, P.rr(-56, 60 + gap * 20, 112, 300, 50), PAL.bone, { off: 8 }); P.flat(ctx, P.ell(0, 72 + gap * 20, 84, 40), PAL.bone, { off: 8 });
    P.fill(ctx, P.ell(0, -44 - gap * 20, 80, 12), PAL.aqua); P.fill(ctx, P.ell(0, 48 + gap * 20, 76, 10), PAL.aqua);
    if (k > 0 && k < 1) { P.flat(ctx, P.circ(30, 0, 8 + 40 * k), P.alpha(PAL.white, 0.85), { off: 4 }); }
    if (k >= 1 && k < 1.4) { const e = (k - 1) / 0.4; P.glow(ctx, 30, 0, 200 * e, PAL.white, 0.8 * (1 - e)); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; P.fill(ctx, P.circ(30 + Math.cos(a) * 60 * (1 + e), Math.sin(a) * 60 * (1 + e), 8 * (1 - e)), PAL.white); } }
    ctx.restore(); };

  // analog clock: h, m (numbers), optional label
  P.clock = (ctx, x, y, r, h, m, label = '') => { P.flat(ctx, P.circ(x, y, r), PAL.white, { off: r * 0.06 }); P.fill(ctx, P.circ(x, y, r * 0.86), '#eef1ff');
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; P.fill(ctx, P.circ(x + Math.cos(a) * r * 0.72, y + Math.sin(a) * r * 0.72, i % 3 ? r * 0.03 : r * 0.055), PAL.ink); }
    const hand = (a, l, w, c) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); ctx.restore(); };
    hand(-Math.PI / 2 + ((h % 12) + m / 60) / 12 * TAU, r * 0.45, r * 0.09, PAL.ink); hand(-Math.PI / 2 + m / 60 * TAU, r * 0.66, r * 0.06, PAL.red); P.fill(ctx, P.circ(x, y, r * 0.07), PAL.ink);
    if (label) P.label(ctx, label, x, y + r + 40, 1, { color: PAL.blue, size: 26 }); };

  // receptor on a cell membrane with a key that docks: key 'adenosine' (sleepy, purple) or 'caffeine' (blocker, brown); k 0..1 docking
  P.receptor = (ctx, x, y, s, key = 'adenosine', k = 0, blocked = 0) => { at(ctx, x, y, s);
    P.flat(ctx, P.rr(-200, 40, 400, 60, 30), PAL.pink, { off: 5 });
    P.flat(ctx, P.poly([[-60, 40], [-60, -40], [-24, -40], [-24, 0], [24, 0], [24, -40], [60, -40], [60, 40]]), PAL.magenta, { off: 6 });
    const ky = lerp(-260, -40, cl(k)), col = key === 'caffeine' ? '#7a4a2a' : PAL.grape;
    P.flat(ctx, P.rr(-22, ky - 70, 44, 70, 12), col, { off: 4 }); P.flat(ctx, P.circ(0, ky - 92, 40), col, { off: 5 });
    txt(ctx, key === 'caffeine' ? 'C' : 'A', 0, ky - 92, 40);
    if (blocked > 0) P.stampX(ctx, 150, -170, 60, blocked);
    ctx.restore(); };

  // the 9 essential amino acids as beads; hi = indices to highlight (BCAAs are 0, 1, 2: leucine, isoleucine, valine)
  P.aminos = (ctx, x, y, r, t, hi = [], k = 1, labels = false) => { const n = 9, names = ['LEU', 'ILE', 'VAL', 'LYS', 'MET', 'PHE', 'THR', 'TRP', 'HIS'];
    for (let i = 0; i < n; i++) { const kk = cl(k * n - i); if (kk <= 0) break; const a = i / n * TAU - Math.PI / 2 + t * 0.2, bx = x + Math.cos(a) * r, by = y + Math.sin(a) * r, on = hi.includes(i);
      if (on) P.glow(ctx, bx, by, 70, PAL.amber, 0.6); P.flat(ctx, P.circ(bx, by, (on ? 34 : 26) * (kk < 1 ? H.ease.back(kk) : 1)), on ? PAL.amber : [PAL.mint, PAL.cyan, PAL.pink][i % 3], { off: 4 });
      if (labels) { ctx.save(); txt(ctx, names[i], bx, by + 1, 16, PAL.ink); ctx.restore(); } } };

  // close-up flexed upper arm: pump 0..1 swells it and pops veins
  P.arm = (ctx, x, y, s, pump = 0, t = 0) => { at(ctx, x, y, s); const sw = 1 + pump * 0.22;
    P.flat(ctx, P.capsule(-220, 120, 40, 120, 70, 64), PAL.skin, { off: 10 });
    P.flat(ctx, P.capsule(40, 120, 120, -150, 62, 52), PAL.skin, { off: 10 }); P.flat(ctx, P.circ(130, -200, 62), PAL.skin, { off: 8 });
    P.flat(ctx, P.ell(-80, 60 - pump * 16, 120 * sw, 92 * sw, -0.05), PAL.skin, { off: 12 });
    if (pump > 0.2) { ctx.save(); ctx.globalAlpha = (pump - 0.2) / 0.8; ctx.strokeStyle = '#5a7bd8'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-180, 110); ctx.bezierCurveTo(-120, 70, -60, 120, -10, 70); ctx.moveTo(-90, 100); ctx.quadraticCurveTo(-60, 40, -30, 20); ctx.moveTo(60, 100); ctx.quadraticCurveTo(80, 0, 100, -100); ctx.stroke(); ctx.restore(); }
    P.flat(ctx, P.rr(-300, 60, 120, 140, 40), PAL.teal, { off: 8 }); ctx.restore(); };

  // a 7-day week strip: marks = array of 7 values (0 rest, n = sets shown as dots); k reveal
  P.week = (ctx, x, y, w, marks, k = 1, col = PAL.amber) => { const d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], cw = w / 7;
    for (let i = 0; i < 7; i++) { const kk = cl(k * 7 - i); if (kk <= 0) break; const cx = x - w / 2 + cw * (i + 0.5);
      P.flat(ctx, P.rr(cx - cw / 2 + 5, y - 70, cw - 10, 160, 18), marks[i] ? P.alpha(col, 0.9) : 'rgba(255,255,255,0.12)', { off: marks[i] ? 4 : 0, light: marks[i] ? 0.2 : 0 });
      ctx.save(); txt(ctx, d[i], cx, y - 40, 28, marks[i] ? PAL.ink : PAL.white); ctx.restore();
      for (let j = 0; j < (marks[i] || 0); j++) P.fill(ctx, P.circ(cx, y + 2 + j * 16, 6), PAL.ink); } };

  // curved motion arrow from angle a0 to a1 around (x, y) radius r
  P.arcArrow = (ctx, x, y, r, a0, a1, k = 1, col = PAL.yellow, w = 14) => { if (k <= 0) return; const a = lerp(a0, a1, cl(k));
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, Math.min(a0, a), Math.max(a0, a)); ctx.stroke();
    const dir = a1 > a0 ? 1 : -1, hx = x + Math.cos(a) * r, hy = y + Math.sin(a) * r, ta = a + dir * Math.PI / 2; ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(hx + Math.cos(ta) * w * 1.8, hy + Math.sin(ta) * w * 1.8); ctx.lineTo(hx + Math.cos(ta + 2.3) * w * 1.6, hy + Math.sin(ta + 2.3) * w * 1.6); ctx.lineTo(hx + Math.cos(ta - 2.3) * w * 1.6, hy + Math.sin(ta - 2.3) * w * 1.6); ctx.closePath(); ctx.fill(); ctx.restore(); };

  // lying / bridging side-view poses built on a bench: 'bench' (press, k = bar down) and 'hipthrust' (k = hips up)
  P.lifterBench = (ctx, x, y, s, pose = 'bench', o = {}) => { const k = cl(o.k == null ? 1 : o.k); at(ctx, x, y, s); const SK = PAL.skin;
    P.bench(ctx, pose === 'bench' ? 0 : -150, 0, 1);
    if (pose === 'bench') { const by = -110, shX = -110, hipX = 70;
      P.flat(ctx, P.capsule(hipX, by, 150, -60, 24, 21), '#272a8f', { off: 5 }); P.flat(ctx, P.capsule(150, -60, 170, -8, 18, 15), SK, { off: 4 }); P.flat(ctx, P.rr(150, -16, 50, 20, 8), '#f4f4ff', { off: 3 });
      P.flat(ctx, P.capsule(shX, by - 8, hipX, by, 33, 30), PAL.teal, { off: 7 });
      const barY = lerp(by - 230, by - 60, k), handX = shX + 30, elb = [shX + 60, lerp(by - 120, by - 20, k)];
      P.flat(ctx, P.capsule(shX + 10, by - 20, elb[0], elb[1], 16), SK, { off: 4 }); P.flat(ctx, P.capsule(elb[0], elb[1], handX, barY, 14), SK, { off: 4 });
      P.flat(ctx, P.circ(shX - 62, by - 30, 38), SK, { off: 6 }); P.fill(ctx, P.rr(shX - 100, by - 74, 76, 18, 8), PAL.hair); P.fill(ctx, P.rr(shX - 100, by - 58, 76, 10, 5), PAL.orange);
      P.fill(ctx, P.ell(shX - 62, by - 52, 9, 7), PAL.white); P.fill(ctx, P.circ(shX - 62, by - 54, 4), PAL.ink);
      P.flat(ctx, P.circ(handX, barY, 58), PAL.orange, { off: 6 }); P.fill(ctx, P.circ(handX, barY, 12), PAL.steel);
    } else { const lift = k, shX = -200, shY = -120, kneeX = 140;
      const hipY = lerp(-30, -150, lift), hipX = 10;
      P.flat(ctx, P.capsule(kneeX, lerp(-110, -150, lift), 170, -10, 18, 15), SK, { off: 4 }); P.flat(ctx, P.rr(150, -16, 52, 20, 8), '#f4f4ff', { off: 3 });
      P.flat(ctx, P.capsule(hipX, hipY, kneeX, lerp(-110, -150, lift), 26, 21), '#272a8f', { off: 6 });
      P.flat(ctx, P.capsule(shX, shY, hipX, hipY, 33, 29), PAL.teal, { off: 7 });
      P.flat(ctx, P.circ(hipX, hipY - 40, 54), PAL.orange, { off: 6 }); P.fill(ctx, P.circ(hipX, hipY - 40, 12), PAL.steel);
      P.flat(ctx, P.circ(shX - 50, shY - 34, 38), SK, { off: 6 }); P.fill(ctx, P.rr(shX - 88, shY - 76, 76, 18, 8), PAL.hair); P.fill(ctx, P.rr(shX - 88, shY - 60, 76, 10, 5), PAL.orange);
      P.fill(ctx, P.ell(shX - 36, shY - 36, 9, 7), PAL.white); P.fill(ctx, P.circ(shX - 34, shY - 36, 4), PAL.ink);
      if (o.glow) P.glow(ctx, hipX + 10, hipY + 10, 140, PAL.magenta, 0.6 * o.glow);
    }
    ctx.restore(); };

  // ---------------- P.reel: shared builder so a reel is just scenes + sounds ----------------
  // P.reel({ merge: [[spoken, caption]], scenes: (A) => [{ at, name, tr, focus, draw: (ctx, t) => {} }], sfx: (A) => [[name, time, opts]] })
  // A = { wt, L, pop, ramp, W, H, PAL, blink, last } ; at = start time (use A.L(i) - 0.2); first scene at 0.
  P.reel = (cfg) => {
    const W = 720, H_ = 1280, SCRIPT = P.reelScript();
    const WORDS = P.mergeWords(P.words(SCRIPT), cfg.merge || []);
    const CHUNKS = P.chunks(WORDS.map((w) => ({ ...w, w: w.cap || w.w })), 3);
    const wt = (k, n) => P.wt(WORDS, k, n), L = (i) => SCRIPT[i][1][0][0];
    const DURATION = +((window.TIMING && window.TIMING.duration) || WORDS[WORDS.length - 1].end + 1.4).toFixed(2);
    const A = { wt, L, pop: P.pop, ramp: P.ramp, W, H: H_, PAL, last: SCRIPT.length - 1, blink: (t, s = 0) => (Math.sin(t * 1.7 + s) > 0.985 ? 1 : 0), dur: DURATION };
    // standard pieces
    A.hookTitle = (ctx, lines, tag, tagCol = PAL.magenta, size = 76) => { P.title(ctx, lines, W / 2, 150, 1, { size }); P.label(ctx, tag, W / 2, 150 + lines.length * size * 1.02 + 20, 1, { color: tagCol, size: 26 }); };
    A.next = (ctx, t, what, col = PAL.mint) => P.title(ctx, ['Next:', what], W / 2, 190, P.pop(t, L(SCRIPT.length - 1) - 0.1, 0.6), { size: what.length > 14 ? 54 : 66, color: col });
    let CUR = 0; const scenes = cfg.scenes(A);
    const SEQ = scenes.map((s) => ({ t: s.at, draw: (c) => s.draw(c, CUR), tr: s.tr, focus: s.focus }));
    function explainer(ctx, W_, H2, t) { CUR = t; ctx.save(); P.sequence(ctx, W, H_, t, SEQ); ctx.restore(); P.finish(ctx, W, H_); P.caption(ctx, W, H_, P.captionAt(CHUNKS, t)); }
    const BEATS = scenes.map((s, i) => ({ t: s.at, name: s.name || 's' + i }));
    window.LESSON = { BEATS, DURATION, explainer, WORDS, CHUNKS };
    window.scoreSound = (k) => {
      k.play('riser', 0, { dur: 0.6, gain: 0.5 }); k.play('pop', 0.05, { f: 760 });
      SEQ.slice(1).forEach((s) => k.play(s.tr === 'zoom' ? 'whoosh' : 'swish', s.t, s.tr === 'zoom' ? { dur: 0.8, top: 3200 } : { dur: 0.3 }));
      (cfg.sfx ? cfg.sfx(A) : []).forEach(([n, tt, o]) => k.play(n, tt, o || {}));
      k.play('success', L(SCRIPT.length - 1)); k.play('sparkle', L(SCRIPT.length - 1) + 0.3, { n: 10 });
    };
  };
})();
