// Noir comic reel engine (720x1280). Black ink, cream paper, one red accent. Every frame is a pure function of t.
window.N = (() => {
  const W = 720, H = 1280, TAU = Math.PI * 2;
  const INK = '#0b0b0c', PAPER = '#ece7da', RED = '#c4122f';
  const F = { num: '"Anton", Impact, sans-serif', cap: '"Permanent Marker", cursive', hand: '"Caveat", cursive', type: '"Special Elite", monospace' };
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ramp = (t, a, d) => { const u = clamp((t - a) / d); return u * u * (3 - 2 * u); };
  const back = (t, a, d = 0.25) => { const u = clamp((t - a) / d); if (u <= 0) return 0; const c = 1.70158; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
  const rng = (seed) => { let a = seed >>> 0 || 1; return () => { a = (a + 0x6d2b79f5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
  const layer = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const cache = {};

  const bg = (ctx, col = INK) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); };
  // a tapered ink stroke, the mark that gives everything its woodcut look
  const cut = (ctx, x0, y0, x1, y1, w, col = INK) => {
    const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x0 + nx * w, y0 + ny * w); ctx.lineTo(x1, y1); ctx.lineTo(x0 - nx * w, y0 - ny * w); ctx.closePath(); ctx.fill();
  };
  const rain = (ctx, t, n = 150, a = 0.5, seed = 3) => {
    const r = rng(seed); ctx.save(); ctx.strokeStyle = PAPER; ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const x0 = r() * (W + 200), y0 = r() * H, sp = 700 + r() * 500, len = 14 + r() * 26, y = (y0 + t * sp) % (H + 60) - 30, x = ((x0 - t * sp * 0.12) % (W + 200) + W + 200) % (W + 200) - 100;
      ctx.globalAlpha = a * (0.4 + r() * 0.6); ctx.lineWidth = 0.8 + r(); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len * 0.12, y + len); ctx.stroke();
    }
    ctx.restore();
  };
  // a cone of street light with woodcut streaks running out from its source
  const beam = (ctx, ax, ay, lx, rx, by, o = {}) => {
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(rx, by); ctx.lineTo(lx, by); ctx.closePath(); ctx.fill();
    const r = rng(o.seed || 5), n = o.lines ?? 60;
    for (let i = 0; i < n; i++) {
      const edge = r() < 0.5 ? r() * 0.2 : 0.8 + r() * 0.2, px = lx + (rx - lx) * edge, s = 0.25 + r() * 0.55, e = Math.min(1.02, s + 0.12 + r() * 0.45);
      cut(ctx, ax + (px - ax) * e, ay + (by - ay) * e, ax + (px - ax) * s, ay + (by - ay) * s, 1 + r() * 2.2);
    }
  };
  // a corridor: cream wedges top and bottom converging on one point, scratched with radial lines
  const corridor = (ctx, vx, vy, o = {}) => {
    ctx.fillStyle = PAPER;
    [[[-80, -40], [W + 80, -40]], [[-80, H + 40], [W + 80, H + 40]]].forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(...a); ctx.lineTo(...b); ctx.closePath(); ctx.fill(); });
    const r = rng(o.seed || 9);
    for (let i = 0; i < (o.lines ?? 130); i++) {
      const top = r() < 0.5, side = r() < 0.5 ? r() * 0.32 : 0.68 + r() * 0.32, ex = -80 + (W + 160) * side, ey = top ? -40 : H + 40, s = 0.15 + r() * 0.5, e = Math.min(1, s + 0.2 + r() * 0.5);
      cut(ctx, vx + (ex - vx) * e, vy + (ey - vy) * e, vx + (ex - vx) * s, vy + (ey - vy) * s, 1 + r() * 2.6);
    }
  };
  // venetian-blind bars of light, or a tilted pedestrian crossing
  const stripes = (ctx, deg = -18, o = {}) => {
    const band = o.band || 64, gap = o.gap || 62, off = o.offset || 0, r = rng(o.seed || 12);
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate((deg * Math.PI) / 180);
    for (let y = -1100 + off; y < 1100; y += band + gap) {
      ctx.fillStyle = PAPER; ctx.fillRect(-900, y, 1800, band);
      for (let i = 0; i < 26; i++) { const x = -800 + r() * 1600, l = 40 + r() * 240, yy = y + (r() < 0.5 ? r() * 12 : band - r() * 12); cut(ctx, x, yy, x + l, yy + (r() - 0.5) * 3, 0.8 + r() * 1.6); }
    }
    ctx.restore();
  };
  // ground drawn as cream hatch lines that thicken toward the viewer
  const floor = (ctx, y0, y1, o = {}) => {
    const r = rng(o.seed || 21), rows = o.rows || 26;
    for (let i = 0; i < rows; i++) { const u = i / rows, y = y0 + (y1 - y0) * u * u; for (let k = 0; k < 7; k++) { const x = r() * W, l = 60 + r() * 260; ctx.fillStyle = PAPER; ctx.globalAlpha = 0.45 + u * 0.55; ctx.fillRect(x, y, l, 1 + u * 4 * r()); } }
    ctx.globalAlpha = 1;
  };
  const windowPane = (ctx, x, y, w, h, cols = 3, o = {}) => {
    ctx.fillStyle = PAPER; ctx.fillRect(x, y, w, h); ctx.fillStyle = INK;
    for (let i = 1; i < cols; i++) ctx.fillRect(x + (w * i) / cols - 4, y, 8, h);
    if (o.crossbar !== false) ctx.fillRect(x, y + h * 0.3, w, 7);
    const r = rng(o.seed || 31); for (let i = 0; i < 18; i++) { const yy = y + r() * h, xx = r() < 0.5 ? x - r() * 40 : x + w + r() * 40; ctx.fillStyle = PAPER; ctx.globalAlpha = 0.45; ctx.fillRect(xx, yy, 34 * (r() < 0.5 ? 1 : -1), 3); ctx.globalAlpha = 1; }
  };
  const fairy = (ctx, t, y, sag = 46, o = {}) => {
    const n = o.n || 18, r = rng(o.seed || 41); ctx.strokeStyle = PAPER; ctx.globalAlpha = 0.7; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const u = i / 40, x = -20 + (W + 40) * u, yy = y + sag * 4 * u * (1 - u); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); ctx.globalAlpha = 1;
    for (let i = 0; i <= n; i++) { const u = i / n, x = -20 + (W + 40) * u, yy = y + sag * 4 * u * (1 - u) + 6, tw = 0.65 + 0.35 * Math.sin(t * 3 + r() * 9); ctx.fillStyle = PAPER; ctx.globalAlpha = 0.18 * tw; ctx.beginPath(); ctx.arc(x, yy, 13, 0, TAU); ctx.fill(); ctx.globalAlpha = tw; ctx.beginPath(); ctx.arc(x, yy, 4, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  };

  // ---- silhouettes ----
  // Records each moveTo as its own shape and fills them one by one, so overlapping limbs can't cancel out.
  const shapes = () => { const parts = []; let cur; const on = (n) => (...a) => cur[n](...a); return { parts, moveTo(...a) { cur = new Path2D(); parts.push(cur); cur.moveTo(...a); }, lineTo: on('lineTo'), quadraticCurveTo: on('quadraticCurveTo'), bezierCurveTo: on('bezierCurveTo'), arc: on('arc'), closePath: on('closePath') }; };
  const umbrella = (ctx, x, y, r, col = RED, t = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * 0.03); ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); for (let i = 0; i < 5; i++) ctx.quadraticCurveTo(r - ((i + 0.5) * 2 * r) / 5, -r * 0.14, r - ((i + 1) * 2 * r) / 5, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = INK; ctx.fillRect(-1.5, 0, 3, r * 1.15); ctx.restore(); };
  // a side-on figure. kind: coat, suit, saree, dress. Units: 100 = full height, feet at y 0.
  // arms: [[shoulderDeg, elbowDeg], ...], 0 hanging, 90 straight ahead. walk: phase, or null to stand. rim: outline for dark backgrounds.
  const figure = (ctx, x, base, h, o = {}) => {
    const s = h / 100, f = o.facing || 1, kind = o.kind || 'coat', col = o.col || INK;
    const P = shapes(), limb = (a, b, w) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * w, ny = (dx / l) * w; P.moveTo(a[0] + nx, a[1] + ny); P.lineTo(b[0] + nx, b[1] + ny); P.lineTo(b[0] - nx, b[1] - ny); P.lineTo(a[0] - nx, a[1] - ny); P.closePath(); P.moveTo(b[0] + w, b[1]); P.arc(b[0], b[1], w, 0, TAU); P.closePath(); };
    const sw = o.walk == null ? 0 : Math.sin(o.walk), bob = o.walk == null ? 0 : Math.abs(Math.cos(o.walk)) * 1.2;
    const shoulder = [0, -78 - bob], hip = [0, -47 - bob];
    if (kind === 'coat' || kind === 'suit') {
      [1, -1].forEach((d) => { const kx = d * sw * 7, fx = d * sw * 15, lift = Math.max(0, d * Math.cos(o.walk ?? 0)) * (o.walk == null ? 0 : 3); limb(hip, [kx, -24 - bob], 3.6); limb([kx, -24 - bob], [fx, -2 - lift], 2.8); limb([fx - 1, -1 - lift], [fx + 7, -1 - lift], 1.8); });
      const sy = shoulder[1] + 2; P.moveTo(-10.5, sy); P.quadraticCurveTo(0, sy - 7, 10.5, sy); P.quadraticCurveTo(7.5, -67, 8, -58);
      if (kind === 'coat') { P.quadraticCurveTo(9 + sw, -44, 10.5 + sw * 3, -31); P.lineTo(-9.5 + sw * 3, -31); P.quadraticCurveTo(-8.5 + sw, -44, -8, -58); }
      else { P.lineTo(9, -44); P.lineTo(-9, -44); P.lineTo(-8, -58); }
      P.quadraticCurveTo(-7.5, -67, -10.5, sy); P.closePath();
    } else if (kind === 'saree') {
      P.moveTo(-6, shoulder[1]); P.quadraticCurveTo(0, shoulder[1] - 3, 7, shoulder[1]); P.lineTo(6, -58); P.quadraticCurveTo(10, -32, 13 + sw * 2, 0); P.lineTo(-13 + sw * 2, 0); P.quadraticCurveTo(-9, -32, -7, -58); P.closePath();
    } else {
      [1, -1].forEach((d) => { const fx = d * sw * 10; limb([d * 2, -36], [fx, -3], 2.6); limb([fx, -2], [fx + 6, -1], 1.4); });
      P.moveTo(-6, shoulder[1]); P.quadraticCurveTo(0, shoulder[1] - 3, 7, shoulder[1]); P.lineTo(4, -60); P.quadraticCurveTo(10, -46, 8, -32); P.lineTo(-8, -32); P.quadraticCurveTo(-9, -46, -5, -60); P.closePath();
    }
    limb([0, -80 - bob], [1, -86 - bob], 3);
    P.moveTo(7.6, -91 - bob); P.arc(1, -91 - bob, 6.6, 0, TAU); P.closePath();
    if (o.nose !== false) { P.moveTo(7, -93 - bob); P.lineTo(10.2, -90 - bob); P.lineTo(7, -88 - bob); P.closePath(); }
    if (kind === 'coat' && o.hat !== false) { P.moveTo(-13, -95 - bob); P.quadraticCurveTo(1, -100 - bob, 15, -95 - bob); P.quadraticCurveTo(1, -92 - bob, -13, -95 - bob); P.closePath(); P.moveTo(-6.5, -96 - bob); P.quadraticCurveTo(-6, -106 - bob, 1, -105 - bob); P.quadraticCurveTo(8, -106 - bob, 7.5, -96 - bob); P.closePath(); }
    if (kind === 'suit') { P.moveTo(-6, -92 - bob); P.quadraticCurveTo(0, -102 - bob, 8, -96 - bob); P.quadraticCurveTo(0, -94 - bob, -6, -88 - bob); P.closePath(); }
    if (kind === 'saree') { P.moveTo(-3.5, -89 - bob); P.arc(-7, -89 - bob, 3.8, 0, TAU); P.closePath(); }
    if (kind === 'dress') { P.moveTo(-6, -97 - bob); P.quadraticCurveTo(4, -101 - bob, 8, -92 - bob); P.quadraticCurveTo(0, -94 - bob, -3, -88 - bob); P.quadraticCurveTo(-3, -74, -8, -66 - bob); P.quadraticCurveTo(-11, -84, -6, -97 - bob); P.closePath(); }
    const hands = (o.arms || [[18, 12], [-14, 6]]).map(([a0, a1]) => { const r0 = (a0 * Math.PI) / 180, r1 = ((a0 + a1) * Math.PI) / 180, e = [shoulder[0] + Math.sin(r0) * 15, shoulder[1] + 2 + Math.cos(r0) * 15], w = [e[0] + Math.sin(r1) * 15, e[1] + Math.cos(r1) * 15]; limb([shoulder[0], shoulder[1] + 2], e, 2.5); limb(e, w, 2.1); return w; });
    ctx.save(); ctx.translate(x, base); ctx.scale(s * f, s);
    if (o.rim) { ctx.strokeStyle = PAPER; ctx.lineWidth = (o.rimW || 2.4) / s; ctx.lineJoin = 'round'; P.parts.forEach((p) => ctx.stroke(p)); }
    ctx.fillStyle = col; P.parts.forEach((p) => ctx.fill(p));
    if (o.pallu) { // the red accent worn by the lead: a pallu across the chest, trailing behind
      const fl = Math.sin((o.t || 0) * 4) * 2.2; ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(6, -77 - bob); ctx.lineTo(-7, -77 - bob); ctx.quadraticCurveTo(-18, -62, -22 + fl, -38); ctx.lineTo(-14 + fl, -36); ctx.quadraticCurveTo(-8, -56, 5, -60 - bob); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    return { hands: hands.map(([hx, hy]) => [x + hx * s * f, base + hy * s]), head: [x + s * f, base - 91 * s], s };
  };
  // a large head-and-shoulders profile, facing right at f = 1. Size s = 1 is about 320px tall above the shoulders.
  const profile = (ctx, x, y, s = 1, o = {}) => {
    const f = o.facing || 1, P = shapes();
    P.moveTo(-58, 150); P.bezierCurveTo(-34, 110, -28, 90, -28, 68); P.bezierCurveTo(-74, 40, -76, -74, -6, -82); P.bezierCurveTo(26, -84, 38, -58, 38, -36); P.bezierCurveTo(40, -24, 58, -11, 58, -5); P.bezierCurveTo(58, 1, 46, 4, 43, 6); P.bezierCurveTo(49, 11, 46, 15, 42, 17); P.bezierCurveTo(47, 21, 45, 27, 38, 29); P.bezierCurveTo(41, 42, 30, 54, 12, 54); P.bezierCurveTo(4, 60, 4, 76, 8, 90); P.bezierCurveTo(16, 112, 70, 124, 112, 150); P.lineTo(160, 900); P.lineTo(-210, 900); P.closePath();
    if (o.hair === 'bun') { P.moveTo(-42, -12); P.arc(-66, -10, 25, 0, TAU); P.closePath(); }
    if (o.hair === 'long') { P.moveTo(-20, -80); P.bezierCurveTo(-88, -86, -92, 40, -70, 130); P.lineTo(-30, 96); P.closePath(); }
    if (o.hair === 'short') { P.moveTo(-58, 12); P.bezierCurveTo(-82, -78, -10, -112, 34, -56); P.bezierCurveTo(10, -66, -26, -62, -32, -14); P.closePath(); }
    if (o.hat) { P.moveTo(-104, -64); P.quadraticCurveTo(0, -94, 104, -64); P.quadraticCurveTo(0, -48, -104, -64); P.closePath(); P.moveTo(-52, -70); P.bezierCurveTo(-54, -150, 54, -150, 54, -72); P.closePath(); }
    ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
    if (o.rim !== false) { ctx.strokeStyle = PAPER; ctx.lineWidth = (o.rimW || 3) / s; ctx.lineJoin = 'round'; P.parts.forEach((p) => ctx.stroke(p)); }
    ctx.fillStyle = INK; P.parts.forEach((p) => ctx.fill(p));
    if (o.bindi) { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(33, -34, 5.5, 0, TAU); ctx.fill(); }
    if (o.pallu) { ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(-90, 900); ctx.bezierCurveTo(-100, 400, 30, 180, 104, 148); ctx.lineTo(160, 190); ctx.bezierCurveTo(90, 300, 40, 500, 40, 900); ctx.closePath(); ctx.fill(); }
    if (o.tear) { ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(30, o.tear, 4.5, 0, TAU); ctx.fill(); }
    ctx.restore();
  };

  // ---- paper elements ----
  const wrap = (ctx, s, max) => { const out = []; let cur = ''; s.split(' ').forEach((w) => { const n = cur ? cur + ' ' + w : w; if (ctx.measureText(n).width > max && cur) { out.push(cur); cur = w; } else cur = n; }); out.push(cur); return out; };
  // a hand-drawn thought bubble. tail: [x, y] where the trail of dots ends. red: the one bubble that matters.
  const bubble = (ctx, x, y, w, h, s, o = {}) => {
    const u = o.u ?? 1; if (u <= 0) return; const r = rng(o.seed || Math.round(x * 7 + y)), bumps = o.bumps || 13, fill = o.red ? RED : PAPER;
    if (o.tail) { [0.34, 0.62, 0.88].forEach((k, i) => { ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.globalAlpha = clamp(u); ctx.beginPath(); ctx.arc(x + (o.tail[0] - x) * k, y + (o.tail[1] - y) * k, (12 - i * 3.2) * u, 0, TAU); ctx.fill(); ctx.stroke(); }); ctx.globalAlpha = 1; }
    ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.beginPath();
    const pts = []; for (let i = 0; i < bumps; i++) { const a = (i / bumps) * TAU, k = 0.94 + r() * 0.1; pts.push([(Math.cos(a) * w * k) / 2, (Math.sin(a) * h * k) / 2]); }
    pts.forEach((p, i) => { const q = pts[(i + 1) % bumps], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, push = 1.13; if (!i) ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx * push, my * push, q[0], q[1]); });
    ctx.closePath(); ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.fill(); ctx.stroke();
    if (s) { const px = o.px || 34; ctx.font = `700 ${px}px ${F.hand}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = o.red ? PAPER : o.ink || INK; const lines = wrap(ctx, s, w * 0.74); lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * px * 0.98)); }
    ctx.restore();
  };
  // the caption strip. *word marks the red keyword. Keep each chunk to two short lines.
  const caption = (ctx, text, t0, t, o = {}) => {
    if (t < t0) return; const u = back(t, t0, 0.14), lines = text.split('|'), px = o.px || 42, y0 = o.y || 985;
    ctx.save(); ctx.font = `${px}px ${F.cap}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    const rows = lines.map((l) => { const words = l.split(' ').map((w) => (w[0] === '*' ? [w.slice(1), true] : [w, false])), sp = px * 0.28, wid = words.reduce((a, [w]) => a + ctx.measureText(w).width, 0) + sp * (words.length - 1); return { words, sp, wid }; });
    const mx = Math.max(...rows.map((r) => r.wid)), k = Math.min(1, (W - 90) / (mx + 40)), bw = (mx + 40) * k, bh = (rows.length * px * 1.14 + 22) * k, x = (W - bw) / 2, y = y0 - bh / 2;
    ctx.translate(W / 2, y0); ctx.rotate(-0.006); ctx.scale(0.9 + 0.1 * u, 0.9 + 0.1 * u); ctx.translate(-W / 2, -y0);
    ctx.fillStyle = INK; ctx.fillRect(x + 6, y + 6, bw, bh); ctx.fillStyle = PAPER; ctx.fillRect(x, y, bw, bh); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(x, y, bw, bh);
    ctx.font = `${px * k}px ${F.cap}`;
    rows.forEach((r, i) => { let cx = W / 2 - (r.wid * k) / 2; const cy = y + 11 * k + (i + 0.5) * px * 1.14 * k; r.words.forEach(([w, key]) => { ctx.fillStyle = key ? RED : INK; ctx.fillText(w, cx, cy); cx += ctx.measureText(w).width + r.sp * k; }); });
    ctx.restore();
  };
  // a huge rough-printed word or number. Cached, because the scratches are static.
  const stat = (ctx, s, x, y, px, o = {}) => {
    const col = o.col || PAPER, key = `stat:${s}:${px}:${col}`; let c = cache[key];
    if (!c) {
      c = cache[key] = document.createElement('canvas'); const g0 = c.getContext('2d'); g0.font = `${px}px ${F.num}`; const w = Math.ceil(g0.measureText(s).width) + 40; c.width = w; c.height = Math.ceil(px * 1.35);
      const g = c.getContext('2d'); g.font = `${px}px ${F.num}`; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(s, 20, c.height / 2);
      g.globalCompositeOperation = 'destination-out'; const r = rng(px + s.length * 13); for (let i = 0; i < w * 0.2; i++) { const yy = r() * c.height, xx = r() * w; cut(g, xx, yy, xx + 30 + r() * 110, yy + (r() - 0.5) * 3, 0.4 + r() * 0.8, '#000'); }
    }
    const u = o.u ?? 1; if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.globalAlpha = o.a ?? 1; ctx.drawImage(c, o.align === 'left' ? -20 : -c.width / 2, -c.height / 2); ctx.restore();
  };
  const stamp = (ctx, s, x, y, u = 1, o = {}) => {
    if (u <= 0) return; const px = o.px || 58; ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? -0.06); ctx.scale(u, u); ctx.font = `${px}px ${F.num}`; const w = ctx.measureText(s).width + 44, h = px * 1.32;
    ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 7, -h / 2 + 7, w - 14, h - 14); ctx.fillStyle = RED; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 2); ctx.restore();
  };
  const tag = (ctx, s, x, y, o = {}) => { const px = o.px || 28; ctx.save(); ctx.font = `${px}px ${F.cap}`; const w = ctx.measureText(s).width + 26, h = px + 20; ctx.fillStyle = INK; ctx.fillRect(x - w / 2 + 4, y - h / 2 + 4, w, h); ctx.fillStyle = PAPER; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.strokeRect(x - w / 2, y - h / 2, w, h); ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 2); ctx.restore(); };
  // small typewriter note. Use it for sources when a reel states a fact.
  const note = (ctx, s, x, y, o = {}) => { const px = o.px || 22; ctx.save(); ctx.font = `${px}px ${F.type}`; ctx.fillStyle = o.col || PAPER; ctx.textBaseline = 'middle'; wrap(ctx, s, o.max || 620).forEach((l, i) => ctx.fillText(l, x, y + i * px * 1.25)); ctx.restore(); };
  const frame = (ctx) => { ctx.save(); ctx.strokeStyle = PAPER; ctx.lineWidth = 2; ctx.strokeRect(13, 13, W - 26, H - 26); ctx.restore(); };

  // ---- transitions: the camera slides across the comic page ----
  // shots: [{ a, b, draw(ctx, t) }]. A new shot arrives by sliding in across a black gutter.
  const A = layer(), B = layer();
  const sequence = (ctx, t, shots, o = {}) => {
    const dur = o.trans ?? 0.42, gut = 34; let i = shots.findIndex((s) => t >= s.a && t < s.b); if (i < 0) i = shots.length - 1;
    const s = shots[i], u = i > 0 ? clamp((t - s.a) / dur) : 1;
    if (u >= 1) { s.draw(ctx, t); frame(ctx); return; }
    const ax = A.getContext('2d', { willReadFrequently: true }), bx = B.getContext('2d', { willReadFrequently: true });
    shots[i - 1].draw(ax, s.a); frame(ax); s.draw(bx, t); frame(bx);
    const e = u * u * (3 - 2 * u), off = e * (W + gut), dir = i % 2 ? 1 : -1, blur = Math.sin(u * Math.PI);
    bg(ctx);
    [[0.4, 0], [0.3, 16 * blur * dir], [0.3, -16 * blur * dir]].forEach(([al, d]) => { ctx.globalAlpha = al === 0.4 ? 1 : 0.3; ctx.drawImage(A, -off * dir + d, 0); ctx.drawImage(B, (W + gut - off) * dir + d, 0); });
    ctx.globalAlpha = 1;
  };
  // the page pull-out: zoom back until the whole comic page of earlier panels is visible
  const pageOut = (ctx, t, a, d, shots, keys) => {
    const thumbs = cache.thumbs || (cache.thumbs = keys.map((k) => { const c = layer(), g = c.getContext('2d', { willReadFrequently: true }), sh = shots.find((x) => k >= x.a && k < x.b); sh.draw(g, k); frame(g); return c; }));
    const u = ramp(t, a, d), z = 1 - 0.68 * u, cols = 3, rows = Math.ceil(thumbs.length / cols), gx = W + 40, gy = H + 40, cellI = thumbs.length - 1, cx = (cellI % cols) * gx + W / 2, cy = Math.floor(cellI / cols) * gy + H / 2, px = ((cols - 1) * gx) / 2 + W / 2, py = ((rows - 1) * gy) / 2 + H / 2, fx = cx + (px - cx) * u, fy = cy + (py - cy) * u;
    bg(ctx); ctx.save(); ctx.translate(W / 2, H / 2 - 40 * u); ctx.scale(z, z); ctx.translate(-fx, -fy);
    thumbs.forEach((c, i) => ctx.drawImage(c, (i % cols) * gx, Math.floor(i / cols) * gy)); ctx.restore();
  };
  // ink speckle and grain over the finished frame, re-rolled a few times a second so the print feels alive
  const finish = (ctx, t) => {
    const n = Math.floor(t * 8) % 4, key = 'grain' + n; let g = cache[key];
    if (!g) { g = cache[key] = layer(); const x = g.getContext('2d'), r = rng(101 + n * 17); for (let i = 0; i < 1500; i++) { x.fillStyle = r() < 0.5 ? 'rgba(236,231,218,0.3)' : 'rgba(0,0,0,0.42)'; x.fillRect(r() * W, r() * H, 1 + r() * 2, 1 + r() * 2); } }
    ctx.drawImage(g, 0, 0);
    const v = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.34, W / 2, H * 0.48, H * 0.78); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.42)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  };
  return { W, H, TAU, INK, PAPER, RED, F, clamp, ramp, back, rng, bg, cut, rain, beam, corridor, stripes, floor, windowPane, fairy, umbrella, figure, profile, bubble, caption, stat, stamp, tag, note, frame, sequence, pageOut, finish };
})();
