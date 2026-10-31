// Animals, props and outdoor worlds for FLAT. Load after flatkit.js. Same rules: flat colour, no outlines, pure function of t.
(function () {
  const F = window.FLAT, { P, rr, circ, oval, poly, line, curve, glow, shade, vgrad } = F, TAU = Math.PI * 2;
  const KIND = {
    lion: { b: '#f2a93b', d: '#d98a22', m: '#fff0cf', mane: '#b9531c' },
    goat: { b: '#f4efe6', d: '#d6cbbb', m: '#fff', nose: '#e88fa0' },
    monkey: { b: '#8a5430', d: '#6b3e22', m: '#f3c9a0' },
    fox: { b: '#ee7a2c', d: '#c95e1a', m: '#fff6ea' },
    bear: { b: '#7a4a2a', d: '#5d3519', m: '#d9b48c' },
    elephant: { b: '#8d94b8', d: '#6f7699', m: '#8d94b8' },
    rabbit: { b: '#f5f1fa', d: '#d4cde6', m: '#fff', nose: '#ef7fa2' },
    owl: { b: '#8b6239', d: '#6c4a29', m: '#f2dfbf' },
  };
  // origin at the feet, about 280 tall at s=1. o: mood ok|happy|shock|scared|hungry|sly|think, look [x,y], flip, hop, tilt, hold(c)
  function critter(c, kind, x, y, s, t, o = {}) {
    const K = KIND[kind], br = Math.sin(t * 2 + (o.seed || 0)) * 2.5, m = o.mood || 'ok', hop = o.hop ? Math.abs(Math.sin(t * 6 + (o.seed || 0))) * 34 : 0, shake = m === 'scared' ? Math.sin(t * 40) * 2.5 : 0;
    c.save(); c.translate(x + shake, y); c.scale(s * (o.flip ? -1 : 1), s);
    if (!o.noShadow) oval(c, 0, 3, 74 - hop * 0.5, 11, 'rgba(10,6,40,.2)');
    c.translate(0, -hop);
    // tails sit behind the body
    const sw = Math.sin(t * 2.4 + (o.seed || 0)) * 10;
    if (kind === 'lion') { curve(c, [40, -40], [120, -40 + sw], [104, -118], 13, K.d); circ(c, 104, -124, 19, K.mane); }
    if (kind === 'monkey') curve(c, [40, -34], [142, -22 + sw], [100, -130], 13, K.d);
    if (kind === 'fox') { c.fillStyle = K.b; c.beginPath(); c.moveTo(34, -26); c.quadraticCurveTo(136, -24 + sw, 118, -116); c.quadraticCurveTo(72, -92, 34, -66); c.fill(); poly(c, [[118, -116], [104, -78], [88, -96]], K.m); }
    if (kind === 'rabbit') circ(c, 58, -40, 20, K.m);
    if (kind === 'goat') curve(c, [46, -92], [78, -116 + sw], [66, -130], 10, K.d);
    // legs and body
    for (const sd of [-1, 1]) { rr(c, sd * 28 - 25, -30, 50, 32, [14, 14, 8, 8], K.d); }
    oval(c, 0, -82, 62, 72, K.b); oval(c, 0, -70, 37, 46, K.m === K.b ? K.d : K.m);
    if (kind === 'owl') for (let i = 0; i < 3; i++) curve(c, [-20, -92 + i * 22], [0, -80 + i * 22], [20, -92 + i * 22], 4, K.d);
    for (const sd of [-1, 1]) { const up = o.arms === 'up'; curve(c, [sd * 52, -116], up ? [sd * 94, -130] : [sd * 80, -86], up ? [sd * 78, -178 + sw * 0.4] : [sd * 56, -52], 22, K.d); }
    if (o.hold) o.hold(c);
    c.save(); c.translate(0, -186 + br); c.rotate((o.tilt || 0) + Math.sin(t * 1.3 + (o.seed || 0)) * 0.02);
    // behind the head
    if (kind === 'lion') for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU; circ(c, Math.cos(a) * 72, Math.sin(a) * 72, 30, i % 2 ? K.mane : shade(K.mane, 1.18)); }
    if (kind === 'goat') { for (const sd of [-1, 1]) { curve(c, [sd * 26, -56], [sd * 44, -100], [sd * 76, -92], 13, '#b6a78e'); oval(c, sd * 78, -18, 32, 13, K.d, sd * 0.3); } }
    if (kind === 'monkey') for (const sd of [-1, 1]) { circ(c, sd * 76, -6, 30, K.b); circ(c, sd * 76, -6, 17, K.m); }
    if (kind === 'fox') for (const sd of [-1, 1]) { poly(c, [[sd * 24, -50], [sd * 78, -110], [sd * 72, -24]], K.b); poly(c, [[sd * 42, -54], [sd * 70, -88], [sd * 66, -40]], '#3a2231'); }
    if (kind === 'bear') for (const sd of [-1, 1]) { circ(c, sd * 58, -56, 25, K.b); circ(c, sd * 58, -56, 13, K.m); }
    if (kind === 'elephant') for (const sd of [-1, 1]) { oval(c, sd * 92, 0, 58, 76, K.d); oval(c, sd * 92, 2, 39, 54, '#e4a9bd'); }
    if (kind === 'rabbit') for (const sd of [-1, 1]) { oval(c, sd * 30, -96, 19, 62, K.b, sd * 0.12); oval(c, sd * 30, -92, 10, 46, '#f5b7ca', sd * 0.12); }
    if (kind === 'owl') for (const sd of [-1, 1]) poly(c, [[sd * 24, -58], [sd * 62, -100], [sd * 66, -36]], K.d);
    circ(c, 0, 0, 70, K.b); c.save(); c.beginPath(); c.arc(0, 0, 70, 0, TAU); c.clip(); oval(c, 66, 22, 40, 74, H.rgba(K.d, 0.55)); c.restore();
    // face plates
    if (kind === 'monkey') { circ(c, -21, -10, 28, K.m); circ(c, 21, -10, 28, K.m); oval(c, 0, 24, 44, 30, K.m); }
    if (kind === 'fox') poly(c, [[-68, -4], [-20, 2], [0, 52], [20, 2], [68, -4], [40, 44], [0, 68], [-40, 44]], K.m);
    if (kind === 'owl') { circ(c, -26, -8, 33, K.m); circ(c, 26, -8, 33, K.m); }
    // eyes
    const r = m === 'shock' || m === 'scared' ? 21 : kind === 'owl' ? 24 : 17, [lx, ly] = o.look || [0, 0], blink = (t * 0.27 + (o.seed || 0) * 0.37) % 1 < 0.025;
    for (const sd of [-1, 1]) {
      const ex = sd * 26, ey = -12;
      if (m === 'happy') { curve(c, [ex - 15, ey + 5], [ex, ey - 15], [ex + 15, ey + 5], 6, P.ink); continue; }
      if (blink) { line(c, [[ex - 14, ey], [ex + 14, ey]], 5, P.ink); continue; }
      circ(c, ex, ey, r, P.white); circ(c, ex + lx * 6, ey + ly * 6, m === 'shock' || m === 'scared' ? 6 : 8, P.ink); circ(c, ex + lx * 6 - 2, ey + ly * 6 - 3, 2.4, P.white);
      if (m === 'hungry' || m === 'sly') { c.save(); c.beginPath(); c.arc(ex, ey, r + 1, 0, TAU); c.clip(); c.fillStyle = K.d; c.fillRect(ex - r - 1, ey - r - 1, r * 2 + 2, r * 0.95); c.restore(); line(c, [[ex - 17, ey - 15 - sd * 5], [ex + 17, ey - 15 + sd * 5]], 6, P.ink); }
      if (m === 'scared' || m === 'think') line(c, [[ex - 14, ey - r - 7 + sd * 5], [ex + 14, ey - r - 7 - sd * 5]], 5, P.ink);
    }
    // muzzle and mouth
    const my = 34;
    if (kind === 'elephant') { const sway = Math.sin(t * 1.6 + (o.seed || 0)) * 14; c.strokeStyle = K.d; c.lineWidth = 32; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 12); c.quadraticCurveTo(sway, 70, sway * 2 + 18, 112); c.stroke(); c.strokeStyle = K.b; c.lineWidth = 26; c.stroke(); for (const sd of [-1, 1]) curve(c, [sd * 32, 38], [sd * 42, 66], [sd * 30, 78], 10, P.paper); }
    else {
      if (kind === 'lion' || kind === 'bear' || kind === 'goat' || kind === 'rabbit') oval(c, 0, 28, 34, 27, K.m);
      if (kind === 'fox') { poly(c, [[-11, 46], [11, 46], [0, 60]], P.ink); } else if (kind === 'owl') poly(c, [[-11, 10], [11, 10], [0, 34]], P.amber); else oval(c, 0, 16, 12, 8, K.nose || (kind === 'monkey' ? '#5e3a24' : '#3a2231'));
      if (kind !== 'owl') {
        if (m === 'shock' || m === 'scared') oval(c, 0, my + 8, 12, 15, '#5a1730');
        else if (m === 'hungry') { c.fillStyle = '#5a1730'; c.beginPath(); c.arc(0, my + 2, 22, 0, Math.PI); c.fill(); oval(c, 8 + Math.sin(t * 5) * 3, my + 13, 11, 8, P.rose); for (const sd of [-1, 1]) poly(c, [[sd * 16, my + 2], [sd * 6, my + 2], [sd * 11, my + 14]], P.white); }
        else if (m === 'happy') { c.fillStyle = '#5a1730'; c.beginPath(); c.arc(0, my, 19, 0, Math.PI); c.fill(); }
        else if (o.talk && Math.sin(t * 13) > 0) oval(c, 0, my + 5, 10, 9, '#5a1730');
        else if (m === 'sly') curve(c, [-16, my + 2], [4, my + 14], [18, my - 4], 5, '#3a2231');
        else if (m === 'think') line(c, [[-9, my + 5], [9, my + 2]], 5, '#3a2231');
        else curve(c, [-13, my + 3], [0, my + 13], [13, my + 3], 5, '#3a2231');
      }
      if (kind === 'goat') poly(c, [[-11, 54], [11, 54], [0, 88]], K.d);
      if (kind === 'rabbit') for (const sd of [-1, 1]) rr(c, sd > 0 ? 1 : -13, my + 10, 12, 15, 2, P.white);
    }
    if (o.hat) o.hat(c);
    c.restore(); c.restore();
  }
  // ---- small things
  const crown = (c, x, y, s, a = 0) => { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); glow(c, 0, -10, 90, P.yellow, 0.35); poly(c, [[-48, 22], [-56, -30], [-24, -6], [0, -44], [24, -6], [56, -30], [48, 22]], P.amber); rr(c, -49, 12, 98, 15, 3, '#e1921d'); [[-28, P.pink], [0, P.sky], [28, P.pink]].forEach(([q, k]) => circ(c, q, 19, 5.5, k)); for (const [q, w] of [[-56, -30], [0, -44], [56, -30]]) circ(c, q, w, 7, P.yellow); c.restore(); };
  const cloud = (c, x, y, s, a = 0.92) => { c.fillStyle = H.rgba(P.white, a); c.beginPath(); c.ellipse(x, y, 74 * s, 23 * s, 0, 0, TAU); c.ellipse(x - 28 * s, y - 14 * s, 31 * s, 24 * s, 0, 0, TAU); c.ellipse(x + 20 * s, y - 20 * s, 37 * s, 30 * s, 0, 0, TAU); c.fill(); };
  function bird(c, x, y, s, t, col = P.ink, seed = 0) { const f = Math.sin(t * 9 + seed) * 0.8; c.save(); c.translate(x, y); c.scale(s, s); oval(c, 0, 0, 18, 9, col); c.fillStyle = col; for (const sd of [-1, 1]) { c.save(); c.scale(sd, 1); c.rotate(-f); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(20, -14, 38, -4); c.quadraticCurveTo(18, 3, 0, 4); c.fill(); c.restore(); } poly(c, [[18, -3], [28, 0], [18, 3]], P.amber); c.restore(); }
  function parrot(c, x, y, s, t, seed = 0) { c.save(); c.translate(x, y + Math.sin(t * 2 + seed) * 5); c.scale(s, s); poly(c, [[-9, 42], [9, 42], [0, 92]], P.blue); oval(c, 0, 12, 25, 39, '#25b35f'); oval(c, -19, 15, 11, 28, P.teal, 0.15 + Math.sin(t * 6 + seed) * 0.12); circ(c, 0, -31, 25, P.pink); circ(c, 8, -35, 9, P.white); circ(c, 10, -35, 4, P.ink); poly(c, [[17, -35], [36, -23], [16, -15]], P.amber); c.restore(); }
  function butterfly(c, x, y, s, t, col, seed = 0) { const f = Math.abs(Math.sin(t * 11 + seed)) * 0.8 + 0.2; c.save(); c.translate(x + Math.sin(t * 0.9 + seed) * 28, y + Math.cos(t * 1.3 + seed) * 18); c.scale(s, s); for (const sd of [-1, 1]) { oval(c, sd * 14 * f, -6, 14 * f, 15, col); oval(c, sd * 10 * f, 11, 9 * f, 9, shade(col, 0.8)); } rr(c, -2, -14, 4, 28, 2, P.ink); c.restore(); }
  function palm(c, x, y, s, t, seed = 0) { c.save(); c.translate(x, y); c.scale(s, s); curve(c, [0, 0], [-16, -130], [14, -250], 28, '#8c5a32'); c.translate(14, -250); for (let i = 0; i < 7; i++) { const a = -Math.PI + (i / 6) * Math.PI + Math.sin(t + i + seed) * 0.03; c.save(); c.rotate(a); c.fillStyle = i % 2 ? '#15916e' : '#1eb07f'; c.beginPath(); c.moveTo(0, -9); c.quadraticCurveTo(82, -36, 152, 14); c.quadraticCurveTo(80, 5, 0, 9); c.fill(); c.restore(); } for (const q of [-13, 13]) circ(c, q, 12, 13, '#6a3c1b'); c.restore(); }
  function tree(c, x, y, s, t, col = '#179669', seed = 0) { c.save(); c.translate(x, y); c.scale(s, s); rr(c, -22, -190, 44, 192, 8, '#7a4b2b'); curve(c, [0, -130], [38, -170], [66, -212], 16, '#7a4b2b'); curve(c, [0, -115], [-34, -160], [-62, -196], 15, '#7a4b2b'); const q = Math.sin(t * 0.7 + seed) * 2; for (const [a, b, r, k] of [[-74, -240, 74, 0.85], [78, -252, 78, 0.85], [0, -316, 100, 1], [-46, -284, 66, 1.15], [50, -296, 58, 1.15]]) circ(c, a + q, b, r, shade(col, k)); c.restore(); }
  function bush(c, x, y, s, col = '#128561') { c.save(); c.translate(x, y); c.scale(s, s); for (const [a, b, r, k] of [[-62, -20, 42, 0.85], [62, -22, 44, 0.85], [0, -40, 60, 1], [-25, -55, 30, 1.2]]) circ(c, a, b, r, shade(col, k)); rr(c, -102, -24, 204, 24, 6, shade(col, 0.72)); c.restore(); }
  function flower(c, x, y, s, col, t) { c.save(); c.translate(x, y); c.rotate(Math.sin(t + x) * 0.05); c.scale(s, s); line(c, [[0, 0], [0, -32]], 4, '#147a5c'); for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; circ(c, Math.cos(a) * 9, -38 + Math.sin(a) * 9, 7, col); } circ(c, 0, -38, 6, P.yellow); c.restore(); }
  function hut(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); rr(c, -68, -86, 136, 86, 3, '#e4b071'); rr(c, -19, -56, 38, 56, [18, 18, 0, 0], '#7a4b2b'); poly(c, [[-88, -76], [0, -150], [88, -76]], '#b9531c'); c.restore(); }
  function grassBundle(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); oval(c, 0, 2, 58, 9, 'rgba(10,6,40,.2)'); for (let i = -7; i <= 7; i++) { const a = i * 0.11 + Math.sin(t * 1.5 + i) * 0.02; c.save(); c.rotate(a); c.fillStyle = i % 2 ? '#35b24f' : '#7ad44f'; c.beginPath(); c.moveTo(-8, 0); c.quadraticCurveTo(-5, -82, 0, -116 + Math.abs(i) * 6); c.quadraticCurveTo(5, -82, 8, 0); c.fill(); c.restore(); } rr(c, -33, -32, 66, 15, 5, P.amber); c.restore(); }
  function boat(c, x, y, s, t, inside) { c.save(); c.translate(x, y + Math.sin(t * 2.2) * 4 * s); c.rotate(Math.sin(t * 1.5) * 0.015); c.scale(s, s); if (inside) inside(c); c.fillStyle = '#8a4b24'; c.beginPath(); c.moveTo(-215, -38); c.lineTo(215, -38); c.quadraticCurveTo(190, 34, 130, 40); c.lineTo(-130, 40); c.quadraticCurveTo(-190, 34, -215, -38); c.fill(); rr(c, -218, -44, 436, 16, 7, '#b76e39'); rr(c, -120, -6, 240, 10, 4, '#6d3a1b'); c.restore(); }
  function fish(c, x, y, s, a, col = P.amber) { c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s); oval(c, 0, 0, 30, 15, col); poly(c, [[-24, 0], [-46, -15], [-46, 15]], shade(col, 0.82)); circ(c, 16, -3, 4.2, P.white); circ(c, 17, -3, 2, P.ink); c.restore(); }
  function croc(c, x, y, s, t) { c.save(); c.translate(x, y); c.scale(s, s); oval(c, 0, 5, 112, 21, '#1d8a54'); oval(c, 72, 2, 66, 15, '#25a765'); for (const q of [-46, -8]) { circ(c, q, -14, 19, '#1d8a54'); circ(c, q, -17, 12, P.white); circ(c, q + 3 + Math.sin(t) * 2, -17, 5, P.ink); } for (let i = 0; i < 4; i++) poly(c, [[52 + i * 21, 13], [72 + i * 21, 13], [62 + i * 21, 25]], P.white); line(c, [[-130, 26], [140, 26]], 5, 'rgba(255,255,255,.55)'); c.restore(); }
  function bubble(c, x, y, s, tx, ty, k, o = {}) {
    if (k <= 0) return; const size = o.size || 32; const u = H.ease.back(H.clamp(k)); c.font = `800 ${size}px ${F.FONT}`; const lines = s.split('|'), w = Math.max(...lines.map((q) => c.measureText(q).width)) + 44, h = lines.length * (size * 1.22) + 30;
    c.save(); c.translate(x, y); c.scale(u, u); const dx = tx - x, dy = ty - y; poly(c, [[Math.max(-w / 2 + 18, Math.min(w / 2 - 44, dx * 0.3)), h / 2 - 8], [Math.max(-w / 2 + 44, Math.min(w / 2 - 18, dx * 0.3 + 28)), h / 2 - 8], [dx, dy]], o.bg || P.white); rr(c, -w / 2, -h / 2, w, h, 20, o.bg || P.white); c.fillStyle = o.ink || P.ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `800 ${size}px ${F.FONT}`; lines.forEach((q, i) => c.fillText(q, 0, -((lines.length - 1) * size * 1.22) / 2 + i * size * 1.22 + 2)); c.restore();
  }
  function confetti(c, t, u, seed = 3, n = 90) { const r = H.rng(seed), cols = [P.pink, P.amber, P.sky, P.mint, P.lav, P.yellow]; for (let i = 0; i < n; i++) { const x = r() * 720, sp = 260 + r() * 300, y = -40 + ((u * sp + r() * 900) % 1340), a = r() * 7 + t * 3, w = 7 + r() * 8, col = cols[Math.floor(r() * 6)]; c.save(); c.translate(x + Math.sin(u * 2 + i) * 22, y); c.rotate(a); c.fillStyle = col; c.fillRect(-w / 2, -w * 0.3, w, w * 0.6); c.restore(); } }

  // ---- worlds
  F.SET.river = function (c, t) {
    c.fillStyle = vgrad(c, -300, 500, '#4fb8ea', '#ffe6b0'); c.fillRect(-500, -500, 1720, 1000);
    glow(c, 575, 150, 240, P.yellow, 0.8); circ(c, 575, 150, 56, '#fff1a8');
    cloud(c, (120 + t * 8) % 900 - 90, 90, 1); cloud(c, (480 + t * 5) % 900 - 90, 245, 0.72); cloud(c, (760 + t * 11) % 1000 - 140, 40, 0.6);
    poly(c, [[-500, 420], [-100, 250], [150, 370], [390, 220], [700, 370], [1220, 240], [1220, 520], [-500, 520]], '#5eb49e'); poly(c, [[-500, 450], [40, 320], [300, 410], [610, 300], [1220, 430], [1220, 520], [-500, 520]], '#3a9a7e');
    c.fillStyle = vgrad(c, 390, 520, '#7bd05d', '#47ae4e'); c.fillRect(-500, 410, 1720, 110); hut(c, 58, 412, 0.62); palm(c, 664, 472, 0.72, t, 2); tree(c, 610, 420, 0.32, t, '#179669', 3);
    c.fillStyle = vgrad(c, 500, 980, '#2db6dc', '#1472ba'); c.fillRect(-500, 500, 1720, 500);
    for (let i = 0; i < 26; i++) { const y = 526 + (i * 53) % 440, x = ((i * 137 + t * (16 + i % 5 * 6)) % 860) - 70, w = 34 + (y - 500) * 0.12; rr(c, x, y, w, 5, 3, 'rgba(255,255,255,.3)'); }
    c.fillStyle = vgrad(c, 960, 1280, '#79cf5b', '#2f9747'); c.beginPath(); c.moveTo(-500, 975); for (let x = -500; x <= 1220; x += 60) c.lineTo(x, 962 + Math.sin(x * 0.03) * 12); c.lineTo(1220, 1800); c.lineTo(-500, 1800); c.fill();
    const r = H.rng(5); for (let i = 0; i < 24; i++) flower(c, r() * 720, 1080 + r() * 190, 0.55 + r() * 0.5, [P.pink, P.yellow, P.white, P.lav][i % 4], t);
    bird(c, (t * 34) % 860 - 80, 188 + Math.sin(t) * 16, 0.72, t, P.ink, 1); bird(c, (t * 34 + 58) % 860 - 80, 216 + Math.sin(t + 1) * 16, 0.58, t, P.ink, 2); bird(c, 760 - (t * 22) % 860, 300, 0.46, t, P.ink, 3);
  };
  F.SET.jungle = function (c, t) {
    c.fillStyle = vgrad(c, -300, 1000, '#d9ef7b', '#159171'); c.fillRect(-500, -500, 1720, 1500); glow(c, 360, 120, 520, '#fff5ad', 0.85);
    for (const [a, w] of [[-90, 90], [120, 120], [360, 130], [560, 110], [720, 90]]) F.beam(c, a, -30, w * 0.25, w, 900, P.yellow, 0.13);
    for (const [x, s, k] of [[-30, 1.4, '#19795f'], [190, 1.05, '#1f8b68'], [540, 1.1, '#1f8b68'], [750, 1.45, '#19795f']]) tree(c, x, 820, s, t, k, x);
    for (const [x, l] of [[62, 225], [154, 140], [580, 180], [668, 255]]) { curve(c, [x, -20], [x + 22, l * 0.55], [x, l], 7, '#0f6f50'); for (let i = 0; i < 4; i++) oval(c, x + (i % 2 ? 11 : -9), 40 + i * (l - 40) / 4, 12, 6, '#2ca76f', i % 2 ? 0.6 : -0.6); }
    c.fillStyle = vgrad(c, 790, 1280, '#96cd50', '#357f3d'); c.beginPath(); c.moveTo(-500, 815); for (let x = -500; x <= 1220; x += 50) c.lineTo(x, 800 + Math.sin(x * 0.023) * 16); c.lineTo(1220, 1800); c.lineTo(-500, 1800); c.fill();
    bush(c, 8, 836, 0.85); bush(c, 712, 836, 0.9, '#149169'); const r = H.rng(8); for (let i = 0; i < 28; i++) flower(c, r() * 720, 890 + r() * 370, 0.5 + r() * 0.55, [P.pink, P.yellow, P.white, P.lav, P.orange][i % 5], t);
    butterfly(c, 120, 520, 0.85, t, P.pink, 1); butterfly(c, 600, 640, 0.75, t, P.amber, 2); butterfly(c, 310, 300, 0.56, t, P.sky, 3);
    const q = H.rng(12); for (let i = 0; i < 16; i++) { const x = q() * 720, y = 250 + q() * 620, ph = q() * 7; circ(c, x + Math.sin(t + ph) * 12, y + Math.cos(t * 0.8 + ph) * 10, 3.2, H.rgba(P.yellow, 0.3 + 0.6 * Math.abs(Math.sin(t * 2 + ph)))); }
  };
  F.LOOKS.kisan = { skin: '#d9915a', skinD: '#ba723f', hair: '#28184f', top: P.paper, topD: '#dfd2bf', pants: '#f2e9da', shoe: '#7a4b2b', hairStyle: 'bald' };
  F.turban = (c) => { oval(c, 0, -62, 88, 39, P.pink); for (let i = 0; i < 3; i++) curve(c, [-82, -82 + i * 18], [0, -106 + i * 21], [82, -82 + i * 18], 8, '#c52a66'); rr(c, -84, -46, 168, 15, 7, P.amber); curve(c, [-36, 35], [-16, 22], [0, 32], 11, '#3a2231'); curve(c, [36, 35], [16, 22], [0, 32], 11, '#3a2231'); };
  Object.assign(F, { critter, crown, cloud, bird, parrot, butterfly, palm, tree, bush, flower, hut, grassBundle, boat, fish, croc, bubble, confetti });
})();
