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
  const hex = (h) => { h = h.replace('#', ''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
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
