// Flat Science kit: flat vector art, big-head characters, zoom-through cameras and the label system.
// Every draw call is a pure function of its arguments and t. World size is 720x1280. Needs harness.js (H).
(function () {
  const E = H.ease, TAU = Math.PI * 2;
  const P = {
    ink: '#160d3f', night: '#241a6b', deep: '#1a1254', violet: '#4a35b8', purple: '#6a4fd8', lav: '#8f7bf0', lilac: '#c9bcff',
    pink: '#ef3f80', rose: '#ff7fa9', orange: '#ef7435', amber: '#f7b13c', yellow: '#ffe066', teal: '#149c86', mint: '#86e6c8',
    sky: '#58c6e6', ice: '#bdeaf5', blue: '#2b4fb8', navy: '#1c2f7d', skin: '#f0a36b', skinD: '#d8814d', hair: '#28184f', white: '#ffffff', paper: '#fff7ea',
  };
  const FONT = 'Montserrat, Poppins, sans-serif';
  const clamp = H.clamp, smooth = H.smooth;
  const rgb = (c, a) => H.rgba(c, a);
  const shade = (c, k) => { const v = H.hex(c); return rgb(v.map((n) => Math.min(255, n * k))); };

  // ---- shape helpers
  function rr(c, x, y, w, h, r, fill) { c.fillStyle = fill; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
  function circ(c, x, y, r, fill) { c.fillStyle = fill; c.beginPath(); c.arc(x, y, Math.max(0, r), 0, TAU); c.fill(); }
  function oval(c, x, y, a, b, fill, rot = 0) { c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, Math.max(0, a), Math.max(0, b), rot, 0, TAU); c.fill(); }
  function poly(c, pts, fill) { c.fillStyle = fill; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath(); c.fill(); }
  function line(c, pts, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); }
  function curve(c, a, q, b, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(a[0], a[1]); c.quadraticCurveTo(q[0], q[1], b[0], b[1]); c.stroke(); }
  function vgrad(c, y0, y1, a, b) { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }
  function glow(c, x, y, r, col, a = 1) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgb(col, a)); g.addColorStop(1, rgb(col, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
  function beam(c, x, y, w0, w1, h, col, a) { const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, rgb(col, a)); g.addColorStop(1, rgb(col, 0)); poly(c, [[x - w0, y], [x + w0, y], [x + w1, y + h], [x - w1, y + h]], g); }

  // ---- camera: zoom about a focus point; focus lands on the centre of the frame
  function cam(c, fx, fy, z, fn, cx = 360, cy = 640) { c.save(); c.translate(cx, cy); c.scale(z, z); c.translate(-fx, -fy); fn(); c.restore(); }
  // eased move through a list of [time, x, y, zoom] keys
  function camAt(keys, t) {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
      const a = keys[i - 1], b = keys[i], u = E.inOut((t - a[0]) / (b[0] - a[0]));
      return [H.lerp(a[1], b[1], u), H.lerp(a[2], b[2], u), Math.exp(H.lerp(Math.log(a[3]), Math.log(b[3]), u))];
    }
    return keys[keys.length - 1].slice(1);
  }

  // ---- characters: big head, tube limbs, mitten hands, no outlines
  const LOOKS = {
    hero: { skin: P.skin, skinD: P.skinD, hair: P.hair, top: P.violet, topD: '#37269a', pants: P.navy, shoe: P.white, hairStyle: 'tousled', hood: true },
    doc: { skin: '#f2b58a', skinD: '#d9936a', hair: '#c9c6d8', top: '#f4f3fb', topD: '#cfcde6', pants: P.navy, shoe: '#3b2a1e', hairStyle: 'bald', glasses: true, coat: true },
    sci: { skin: '#7b4a30', skinD: '#5f3522', hair: '#1a1020', top: '#f4f3fb', topD: '#cfcde6', pants: '#23306e', shoe: '#222', hairStyle: 'bun', coat: true },
    teen: { skin: '#f4bd93', skinD: '#dd9a6d', hair: '#70401f', top: P.amber, topD: '#d48a1d', pants: '#27337a', shoe: '#3b2a1e', hairStyle: 'side' },
    friend: { skin: '#8a5636', skinD: '#6b3f26', hair: '#16101f', top: P.pink, topD: '#c52a66', pants: '#176b5f', shoe: P.white, hairStyle: 'curly' },
  };
  function face(c, L, o, t) {
    const m = o.mood || 'ok', blink = (o.blink !== false && (t * 0.31 + (o.seed || 0)) % 1 < 0.025) ? 1 : 0;
    const lid = blink ? 1 : { ok: 0.12, happy: 0.1, tired: 0.52, drained: 0.68, shock: 0, sad: 0.3, dizzy: 0.2 }[m] ?? 0.12;
    const r = m === 'shock' ? 27 : 24, pr = m === 'shock' ? 7 : 9, [lx, ly] = o.look || [0, 0];
    for (const sd of [-1, 1]) {
      const ex = sd * 33, ey = -6;
      if (m === 'tired' || m === 'drained') curve(c, [ex - 21, ey + 22], [ex, ey + 35], [ex + 21, ey + 22], 5, shade(L.skinD, 0.86));
      circ(c, ex, ey, r, P.white);
      if (m === 'dizzy') { c.strokeStyle = P.ink; c.lineWidth = 3; c.beginPath(); for (let a = 0; a < 15; a += 0.3) { const q = a * 1.05; const px = ex + Math.cos(a + t * 5) * q, py = ey + Math.sin(a + t * 5) * q; a ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); }
      else circ(c, ex + lx * 8, ey + ly * 8 + lid * 5, pr, P.ink);
      if (lid > 0) { c.save(); c.beginPath(); c.arc(ex, ey, r + 1, 0, TAU); c.clip(); c.fillStyle = L.skinD; c.fillRect(ex - r - 2, ey - r - 2, r * 2 + 4, (r * 2 + 4) * lid); c.restore(); }
      const by = ey - r - 9 + (m === 'shock' ? -8 : 0), tilt = m === 'sad' || m === 'tired' || m === 'drained' ? -sd * 5 : m === 'angry' ? sd * 6 : 0;
      line(c, [[ex - 17, by - tilt], [ex + 17, by + tilt]], 7, L.hair === '#c9c6d8' ? '#9d9ab3' : L.hair);
    }
    oval(c, 0, 25, 8, 6, L.skinD);
    const my = 50, tk = o.talk ? Math.abs(Math.sin(t * 13)) : 0;
    if (m === 'shock') { oval(c, 0, my + 3, 13, 17, '#5a1730'); }
    else if (m === 'happy') { c.fillStyle = '#5a1730'; c.beginPath(); c.arc(0, my - 3, 19, 0, Math.PI); c.fill(); }
    else if (tk > 0.15) { oval(c, 0, my, 10, 3 + tk * 8, '#5a1730'); }
    else if (m === 'sad' || m === 'drained') curve(c, [-12, my + 5], [0, my - 5], [12, my + 5], 5, '#7a2a3a');
    else if (m === 'tired') line(c, [[-9, my], [9, my]], 5, '#7a2a3a');
    else curve(c, [-13, my - 2], [0, my + 8], [13, my - 2], 5, '#7a2a3a');
    if (o.glasses || L.glasses) for (const sd of [-1, 1]) { c.strokeStyle = '#3a3760'; c.lineWidth = 5; c.beginPath(); c.arc(sd * 33, -6, 29, 0, TAU); c.stroke(); }
  }
  function hair(c, L, front) {
    const H_ = L.hair, hl = rgb(P.lilac, 0.22);
    if (L.hairStyle === 'bald') { if (!front) return; for (const sd of [-1, 1]) { circ(c, sd * 78, -18, 19, H_); circ(c, sd * 71, -40, 14, H_); } return; }
    if (L.hairStyle === 'bun') { if (front) { oval(c, 0, -74, 80, 40, H_); poly(c, [[-82, -55], [-30, -86], [40, -86], [82, -55], [76, -28], [40, -62], [-40, -62], [-76, -28]], H_); } else { circ(c, 0, -120, 34, H_); oval(c, 0, -22, 88, 92, H_); } return; }
    if (L.hairStyle === 'curly') { if (!front) return; for (let i = 0; i < 11; i++) { const a = Math.PI + (i / 10) * Math.PI; circ(c, Math.cos(a) * 78, -20 + Math.sin(a) * 68, 25, H_); } oval(c, 0, -62, 70, 22, H_); return; }
    if (!front) return;
    if (L.hairStyle === 'side') { poly(c, [[-84, -14], [-82, -60], [-48, -94], [20, -102], [70, -80], [86, -30], [78, -8], [66, -48], [8, -58], [-60, -46]], H_); return; }
    // tousled, the lead's hair: lumpy crown with a soft highlight
    for (const [x, y, r] of [[-66, -48, 30], [-34, -78, 34], [8, -88, 38], [50, -72, 32], [74, -40, 26], [-78, -18, 16], [80, -14, 14]]) circ(c, x, y, r, H_);
    poly(c, [[-80, -30], [-40, -58], [0, -48], [38, -62], [78, -26], [60, -86], [-50, -90]], H_);
    oval(c, -10, -92, 34, 10, hl, -0.15);
  }
  function head(c, L, o, t) {
    hair(c, L, false);
    for (const sd of [-1, 1]) { circ(c, sd * 82, 6, 16, L.skin); circ(c, sd * 82, 6, 8, L.skinD); }
    c.fillStyle = L.skin; c.beginPath(); c.roundRect(-80, -68, 160, 150, [62, 62, 74, 74]); c.fill();
    c.save(); c.beginPath(); c.roundRect(-80, -68, 160, 150, [62, 62, 74, 74]); c.clip(); oval(c, 92, 34, 54, 100, rgb(L.skinD, 0.42)); c.restore();
    face(c, L, o, t); hair(c, L, true);
  }
  // origin at the feet; the full figure stands about 610 tall at s=1
  function person(c, x, y, s, t, o = {}) {
    const L = Object.assign({}, LOOKS[o.look_as || 'hero'], o.style || {});
    const pose = o.pose || 'down', breath = Math.sin(t * 1.9 + (o.seed || 0)) * 3, sit = pose === 'lap' || pose === 'desk';
    c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s);
    if (!o.noShadow) oval(c, 0, 4, 112, 15, 'rgba(10,6,40,.22)');
    const hipY = sit ? -218 : -252, shY = hipY - 170 + breath, A = 40;
    // legs
    for (const sd of [-1, 1]) {
      const pts = sit ? [[sd * 34, hipY], [sd * 38, hipY + 92], [sd * 40, -22]] : [[sd * 34, hipY], [sd * 38, -22]];
      line(c, pts, 50, L.pants); line(c, pts.map((p) => [p[0] + sd * 12, p[1]]), 12, shade(L.pants, 0.82));
      rr(c, sd * 38 - 34 + sd * 10, -32, 68, 34, [20, 20, 7, 7], L.shoe); rr(c, sd * 38 - 34 + sd * 10, -8, 68, 9, 4, shade(L.shoe === P.white ? '#d8d6ec' : L.shoe, 0.9));
    }
    const hand = (p) => { circ(c, p[0], p[1], 24, L.skin); oval(c, p[0] + 3, p[1] + 7, 15, 9, rgb(L.skinD, 0.55)); };
    const arms = {
      down: (sd) => [[sd * 92, shY + 26], [sd * 118, shY + 120], [sd * 104, shY + 205]],
      lap: (sd) => [[sd * 92, shY + 26], [sd * 124, shY + 112], [sd * 44, shY + 158]],
      desk: (sd) => [[sd * 92, shY + 26], [sd * 124, shY + 112], [sd * 44, shY + 158]],
      chin: (sd) => sd > 0 ? [[92, shY + 26], [130, shY + 94], [48, shY - 26]] : [[-92, shY + 26], [-116, shY + 118], [-96, shY + 200]],
      head: (sd) => sd < 0 ? [[-92, shY + 26], [-150, shY - 66], [-48, shY - 176]] : [[92, shY + 26], [118, shY + 120], [104, shY + 205]],
      hold: (sd) => [[sd * 92, shY + 26], [sd * 120, shY + 98], [sd * 28, shY + 112]],
      cheer: (sd) => [[sd * 92, shY + 26], [sd * 142, shY - 46], [sd * 124, shY - 142]],
    }[pose] || null;
    for (const sd of [-1, 1]) { if (arms && arms(sd)[2][1] > shY - 20 && pose !== 'lap' && pose !== 'desk' && pose !== 'hold') { line(c, arms(sd), A, L.topD); hand(arms(sd)[2]); } }
    // torso
    c.fillStyle = L.top; c.beginPath(); c.moveTo(-98, shY + 34); c.quadraticCurveTo(-92, shY - 6, -44, shY - 8); c.lineTo(44, shY - 8); c.quadraticCurveTo(92, shY - 6, 98, shY + 34); c.lineTo(78, hipY + 12); c.quadraticCurveTo(0, hipY + 24, -78, hipY + 12); c.closePath(); c.fill();
    c.save(); c.clip(); oval(c, 112, shY + 92, 50, 150, L.topD); c.restore();
    if (L.hood) { oval(c, 0, shY + 2, 62, 25, L.topD); curve(c, [-15, shY + 18], [-19, shY + 56], [-13, shY + 82], 5, P.paper); curve(c, [15, shY + 18], [19, shY + 56], [13, shY + 82], 5, P.paper); }
    if (L.coat) { poly(c, [[-9, shY - 4], [9, shY - 4], [13, hipY + 10], [-13, hipY + 10]], '#b9b6da'); rr(c, -60, shY + 104, 34, 36, 5, L.topD); rr(c, 26, shY + 104, 34, 36, 5, L.topD); }
    if (o.chest) o.chest(c, shY);
    rr(c, -24, shY - 44, 48, 50, 16, L.skinD);
    for (const sd of [-1, 1]) { if (arms && !(arms(sd)[2][1] > shY - 20 && pose !== 'lap' && pose !== 'desk' && pose !== 'hold')) { line(c, arms(sd), A, L.top); } else if (pose === 'lap' || pose === 'desk' || pose === 'hold') { line(c, arms(sd), A, L.top); line(c, arms(sd).map((p) => [p[0] + sd * 8, p[1] + 8]), 8, L.topD); hand(arms(sd)[2]); } else if (arms) line(c, [arms(sd)[0], arms(sd)[1]], A, L.top); }
    c.save(); c.translate(0, shY - 104 + breath * 0.6); c.rotate((o.tilt || 0) + Math.sin(t * 1.1 + (o.seed || 0)) * 0.012); head(c, L, o, t); c.restore();
    if (pose === 'head' || pose === 'chin' || pose === 'cheer') for (const sd of [-1, 1]) { const a = arms(sd); if (a[2][1] <= shY - 20) hand(a[2]); }
    c.restore();
  }

  // ---- sets: complete 720x1280 backdrops, painted beyond the frame so a pulled-back camera never sees an edge
  function skyline(c, x, y, w, h, col, lit, t, seed) {
    const r = H.rng(seed); let px = x;
    while (px < x + w) {
      const bw = 34 + r() * 44, bh = h * (0.3 + r() * 0.7); rr(c, px, y + h - bh, bw, bh, 2, col);
      for (let wy = y + h - bh + 10; wy < y + h - 8; wy += 18) for (let wx = px + 7; wx < px + bw - 7; wx += 13) if (r() > 0.58) { c.fillStyle = lit; c.globalAlpha = 0.55 + 0.45 * Math.sin(t * 0.6 + wx); c.fillRect(wx, wy, 6, 8); c.globalAlpha = 1; }
      px += bw + 3;
    }
  }
  function plant(c, x, y, s, t, col = P.teal) {
    c.save(); c.translate(x, y); c.scale(s, s);
    for (let i = -3; i <= 3; i++) { const a = i * 0.34 + Math.sin(t + i) * 0.015; c.save(); c.rotate(a); c.fillStyle = i % 2 ? col : shade(col, 0.78); c.beginPath(); c.moveTo(-11, 0); c.quadraticCurveTo(-17, -82, 0, -130 + Math.abs(i) * 12); c.quadraticCurveTo(17, -82, 11, 0); c.fill(); c.restore(); }
    poly(c, [[-34, -4], [34, -4], [25, 56], [-25, 56]], P.orange); rr(c, -38, -10, 76, 14, 4, shade(P.orange, 1.15));
    c.restore();
  }
  function books(c, x, y, s) { const cols = [P.pink, P.sky, P.amber, P.orange, P.blue, P.violet]; let px = x; cols.forEach((k, i) => { const h = (58 + ((i * 17) % 24)) * s, w = 15 * s; rr(c, px, y - h, w, h, 2, k); px += w + 2 * s; }); }
  const SET = {
    bedroom(c, t, o = {}) {
      const k = o.dawn || 0, wall = H.mix('#40309c', '#8f73c6', k);
      c.fillStyle = rgb(wall); c.fillRect(-500, -500, 1720, 2300);
      const sky = c.createLinearGradient(0, 80, 0, 490); sky.addColorStop(0, rgb(H.mix('#100c4a', '#6d5bc4', k))); sky.addColorStop(1, rgb(H.mix('#4a2f8d', '#ffb88a', k)));
      c.fillStyle = sky; c.fillRect(90, 70, 540, 430); circ(c, 505, 170, 42, rgb(H.mix('#f7ecb5', '#fff3d0', k)));
      skyline(c, 90, 250, 540, 250, rgb(H.mix('#1b1565', '#8a6bb8', k)), P.yellow, t, 7);
      line(c, [[360, 70], [360, 500]], 12, P.lilac); rr(c, 76, 500, 568, 22, 5, P.lilac);
      for (const sd of [0, 1]) { const x = sd ? 590 : 30; rr(c, x, 40, 100, 520, 8, P.purple); for (let i = 1; i < 4; i++) rr(c, x + i * 25, 40, 7, 520, 3, shade(P.purple, 0.8)); }
      rr(c, 0, 26, 720, 16, 6, P.ink);
      c.fillStyle = rgb(H.mix('#2a1f7e', '#6c52ad', k)); c.fillRect(-500, 840, 1720, 900); glow(c, 360, 1040, 430, P.pink, 0.1);
      oval(c, 360, 1060, 345, 62, P.pink); oval(c, 360, 1060, 260, 40, shade(P.pink, 0.8));
      // nightstand and clock
      rr(c, 12, 700, 180, 180, 10, '#33267f'); rr(c, 28, 790, 148, 6, 3, '#4d3ba8'); rr(c, 40, 628, 128, 72, 10, P.ink);
      c.font = `800 44px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ff5a5a'; c.fillText(o.clock || '3:07', 104, 665);
      // lamp
      line(c, [[120, 628], [120, 560], [170, 530]], 8, P.lilac); poly(c, [[150, 490], [210, 515], [190, 570], [122, 540]], P.lilac);
      // bed
      rr(c, 196, 620, 30, 310, 12, '#5a45cb'); rr(c, 208, 790, 560, 130, 16, '#5a45cb'); rr(c, 222, 700, 520, 104, 24, '#d7cdff'); rr(c, 232, 650, 150, 76, 30, P.white);
    },
    blanket(c, x = 380) { c.fillStyle = P.pink; c.beginPath(); c.roundRect(x, 660, 400, 142, 24); c.fill(); rr(c, x, 660, 38, 142, 14, P.yellow); },
    office(c, t) {
      c.fillStyle = vgrad(c, -200, 900, '#67cde9', '#2fa8cb'); c.fillRect(-500, -500, 1720, 1600);
      c.fillStyle = '#cdf0f8'; c.fillRect(60, 120, 330, 430); c.fillStyle = P.white; oval(c, 170, 210, 70, 24, 'rgba(255,255,255,.9)'); oval(c, 300, 320, 55, 18, 'rgba(255,255,255,.75)');
      skyline(c, 60, 390, 330, 160, '#9fd7e8', '#d7f3fb', t, 12); line(c, [[225, 120], [225, 550]], 10, P.white); rr(c, 44, 550, 362, 18, 4, P.white);
      beam(c, 225, 550, 150, 280, 460, P.white, 0.14);
      rr(c, 438, 96, 250, 186, 10, '#e7b869'); rr(c, 448, 106, 230, 166, 6, '#f6d796'); [[462, 118, P.rose], [530, 124, P.mint], [602, 116, P.yellow], [470, 190, P.yellow], [596, 190, P.rose]].forEach(([a, b, k]) => rr(c, a, b, 58, 58, 3, k));
      rr(c, 536, 192, 54, 62, 3, P.white); [[544, 228, 16], [558, 214, 30], [572, 202, 42]].forEach(([a, b, h]) => rr(c, a, b, 9, h, 2, P.blue));
      circ(c, 642, 392, 46, P.navy); circ(c, 642, 392, 38, P.white); const ang = t * 0.9; line(c, [[642, 392], [642 + Math.cos(ang) * 30, 392 + Math.sin(ang) * 30]], 4, P.ink); line(c, [[642, 392], [642, 366]], 5, P.ink);
      rr(c, 506, 516, 180, 8, 3, P.white); books(c, 512, 516, 1);
      plant(c, 100, 790, 1, t, '#0f8f74');
      c.fillStyle = '#128a9f'; c.fillRect(-500, 1090, 1720, 800);
    },
    desk(c, t) {
      rr(c, 30, 850, 660, 26, 7, P.white); rr(c, 470, 876, 190, 214, 6, P.blue); [930, 1000].forEach((y) => { rr(c, 482, y - 44, 166, 64, 5, '#3966cc'); rr(c, 544, y - 18, 44, 7, 3, P.lilac); });
      rr(c, 512, 780, 26, 72, 4, P.navy); rr(c, 468, 838, 116, 13, 5, P.navy); rr(c, 430, 640, 230, 158, 12, P.navy); rr(c, 442, 652, 206, 134, 6, '#54b3ec');
      rr(c, 454, 668, 120, 8, 3, P.white); [690, 708, 726, 744].forEach((y, i) => rr(c, 454, y, 90 - i * 10, 7, 3, 'rgba(255,255,255,.65)')); rr(c, 564, 680, 72, 82, 4, P.yellow);
      rr(c, 62, 800, 44, 50, 5, P.amber); c.strokeStyle = P.amber; c.lineWidth = 7; c.beginPath(); c.arc(106, 824, 13, -1.4, 1.4); c.stroke();
    },
    chair(c, x = 240) { rr(c, x - 120, 590, 240, 280, 56, P.pink); rr(c, x - 120, 790, 240, 42, 16, shade(P.pink, 0.82)); line(c, [[x, 870], [x, 1040]], 22, shade(P.pink, 0.72)); line(c, [[x - 72, 1072], [x + 72, 1072]], 16, shade(P.pink, 0.72)); },
    lab(c, t) {
      c.fillStyle = vgrad(c, -200, 900, '#8fe4cb', '#5fc9ad'); c.fillRect(-500, -500, 1720, 1500);
      for (const y of [270, 460]) rr(c, -30, y, 390, 13, 4, '#3ba88f');
      flask(c, 80, 270, 1, P.violet, t); flask(c, 190, 270, 0.8, P.pink, t + 1); rr(c, 276, 196, 28, 74, 7, P.yellow); rr(c, 310, 216, 24, 54, 7, P.sky);
      rr(c, 50, 382, 34, 78, 7, P.amber); flask(c, 150, 460, 0.85, P.pink, t + 2); flask(c, 262, 460, 1.05, P.violet, t + 3);
      line(c, [[360, -300], [360, 400]], 6, P.ink); c.fillStyle = P.pink; c.beginPath(); c.moveTo(280, 490); c.quadraticCurveTo(290, 396, 360, 396); c.quadraticCurveTo(430, 396, 440, 490); c.fill();
      oval(c, 360, 490, 80, 12, P.paper); beam(c, 360, 494, 76, 280, 520, P.white, 0.42);
      c.fillStyle = '#cdeee3'; c.fillRect(-500, 920, 1720, 170); c.strokeStyle = 'rgba(70,160,140,.25)'; c.lineWidth = 2; for (let x = -480; x < 1200; x += 60) { c.beginPath(); c.moveTo(x, 920); c.lineTo(x, 1090); c.stroke(); } c.beginPath(); c.moveTo(-500, 985); c.lineTo(1220, 985); c.stroke();
      rr(c, -500, 1045, 1720, 22, 0, P.paper); c.fillStyle = '#148b78'; c.fillRect(-500, 1067, 1720, 800); for (let x = -420; x < 1200; x += 180) rr(c, x, 1130, 150, 8, 4, '#0f7263');
    },
    warm(c, t) {
      c.fillStyle = vgrad(c, -200, 980, '#f6a03e', '#df6a2d'); c.fillRect(-500, -500, 1720, 1600);
      c.fillStyle = 'rgba(190,75,30,.22)'; for (let y = -200, row = 0; y < 900; y += 44, row++) for (let x = -480 + (row % 2) * 45; x < 1200; x += 90) c.fillRect(x, y, 82, 36);
      c.fillStyle = '#ffe7a9'; c.fillRect(-30, 90, 280, 500); for (let y = 100; y < 590; y += 26) rr(c, -30, y, 280, 8, 2, 'rgba(226,160,70,.45)'); beam(c, 110, 590, 140, 300, 420, P.yellow, 0.35);
      rr(c, 556, 110, 138, 164, 6, P.navy); rr(c, 566, 120, 118, 144, 3, P.sky); poly(c, [[625, 150], [625, 230], [665, 230]], P.white); poly(c, [[615, 170], [615, 230], [590, 230]], P.paper); c.fillStyle = P.blue; c.fillRect(566, 234, 118, 30);
      rr(c, 520, 482, 180, 8, 3, '#8a3d1c'); books(c, 530, 482, .9);
      c.fillStyle = '#6e2f1a'; c.fillRect(-500, 960, 1720, 900); oval(c, 360, 1046, 340, 62, P.teal); oval(c, 360, 1046, 260, 40, shade(P.teal, 0.82));
    },
    space(c, t) {
      const g = c.createRadialGradient(360, 760, 40, 360, 640, 920); g.addColorStop(0, '#3a2b9c'); g.addColorStop(0.55, '#1e1566'); g.addColorStop(1, '#110a42'); c.fillStyle = g; c.fillRect(-500, -500, 1720, 2300);
      const r = H.rng(4); for (let i = 0; i < 90; i++) { const x = r() * 720, y = r() * 1280, s = r() * 2.4 + 0.8, ph = r() * 6; c.fillStyle = rgb(P.white, 0.25 + 0.5 * Math.abs(Math.sin(t * 0.8 + ph))); c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill(); }
    },
  };
  function flask(c, x, y, s, col, t) { c.save(); c.translate(x, y); c.scale(s, s); poly(c, [[-11, -96], [11, -96], [11, -62], [42, 0], [-42, 0], [-11, -62]], 'rgba(255,255,255,.62)'); poly(c, [[-22, -38], [22, -38], [42, 0], [-42, 0]], col); circ(c, -8 + Math.sin(t * 2) * 7, -48 - ((t * 20) % 20), 3.5, rgb(P.white, 0.8)); rr(c, -14, -102, 28, 8, 3, P.white); c.restore(); }

  // ---- science props
  function cell(c, x, y, r, col, t, seed, shrink = 0) {
    const R = r * (1 - shrink * 0.32), rn = H.rng(seed), dark = shade(col, 0.72), light = shade(col, 1.14);
    c.fillStyle = col; c.beginPath(); for (let i = 0; i <= 32; i++) { const a = (i / 32) * TAU, w = 1 + Math.sin(a * 3 + seed) * 0.018 + Math.sin(a * 5 + seed * 2 + t * 0.5) * 0.015 + shrink * 0.09 * Math.sin(a * 7 + seed); const px = x + Math.cos(a) * R * w, py = y + Math.sin(a) * R * w; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.fill();
    c.save(); c.clip(); oval(c, x + R * 0.3, y + R * 0.4, R, R * 0.86, dark); oval(c, x - R * 0.05, y - R * 0.05, R * 0.82, R * 0.78, col); c.restore();
    for (let i = 0; i < 9; i++) { const a = rn() * TAU, d = R * (0.5 + rn() * 0.36); circ(c, x + Math.cos(a) * d, y + Math.sin(a) * d, 1.8 + rn() * 1.9, rgb(P.white, 0.75)); }
    circ(c, x, y, R * 0.28, dark); circ(c, x, y, R * 0.17, light); for (let i = 0; i < 3; i++) circ(c, x + Math.cos(i * 2.1) * R * 0.08, y + Math.sin(i * 2.1) * R * 0.08, 2.4, P.white);
  }
  // a packed tissue of round cells over a soft dark ground; shrink makes them pull apart and pucker
  function cellField(c, t, o = {}) {
    const a = o.a || P.pink, b = o.b || P.lav, sh = o.shrink || 0, rn = H.rng(o.seed || 31);
    c.fillStyle = o.bg || '#2c1b86'; c.fillRect(-500, -500, 1720, 2300);
    for (let i = 0; i < 14; i++) glow(c, rn() * 720, rn() * 1280, 170 + rn() * 120, i % 2 ? '#5d3dd1' : '#7a2a9c', 0.42);
    const R = o.r || 74, sx = R * 2.28, sy = R * 1.98;
    for (let row = -2; row < 12; row++) for (let col = -2; col < 8; col++) {
      const n = rn(), m = rn(), s = rn() * 99, x = col * sx + (row % 2 ? sx / 2 : 0) + Math.sin(t * 0.33 + s) * 7 + 10, y = row * sy + Math.cos(t * 0.29 + s) * 7 + 30;
      cell(c, x, y, R * (0.9 + n * 0.14), m > 0.45 ? a : b, t, s, sh);
    }
  }
  function brain(c, x, y, s, t, o = {}) {
    const main = o.col || '#f37ba0', dark = o.dark || '#c94f7c', ln = o.line || '#a93c67';
    c.save(); c.translate(x, y); c.scale(s, s);
    if (o.halo) glow(c, 0, 0, 260, P.pink, 0.28 * o.halo);
    rr(c, 24, 66, 34, 108, 14, dark); oval(c, 84, 84, 62, 44, '#e3628f'); for (let i = 0; i < 5; i++) curve(c, [36, 66 + i * 14], [84, 58 + i * 15], [136, 74 + i * 11], 4, ln);
    c.fillStyle = main; c.beginPath(); c.moveTo(-158, 18); c.bezierCurveTo(-178, -74, -106, -130, -38, -126); c.bezierCurveTo(42, -148, 138, -110, 158, -36); c.bezierCurveTo(174, 26, 124, 72, 54, 76); c.bezierCurveTo(-8, 92, -48, 74, -82, 82); c.bezierCurveTo(-126, 90, -154, 62, -158, 18); c.fill();
    c.save(); c.clip(); oval(c, 54, 66, 150, 56, rgb(dark, 0.45)); c.restore();
    const paths = [[[-132, -8], [-112, -58], [-70, -48]], [[-70, -48], [-46, -2], [-90, 18]], [[-90, 18], [-126, 22], [-124, 52]], [[-98, -96], [-54, -112], [-34, -72]], [[-34, -72], [-6, -32], [-26, 8]], [[-26, 8], [-40, 44], [-4, 56]], [[6, -112], [50, -98], [30, -58]], [[30, -58], [10, -24], [50, -10]], [[50, -10], [94, 0], [78, 44]], [[78, -104], [122, -64], [90, -40]], [[90, -40], [126, -26], [142, -8]], [[-58, 58], [-24, 32], [-48, 12]], [[22, 66], [30, 34], [8, 20]]];
    for (const [a, q, b] of paths) curve(c, a, q, b, 7, ln);
    if (o.spark) { const r = H.rng(9); for (let i = 0; i < 18; i++) { const px = -130 + r() * 270, py = -105 + r() * 170, ph = r() * 6; circ(c, px, py, 2.6, rgb(P.yellow, Math.abs(Math.sin(t * 3 + ph)) * o.spark)); } }
    c.restore();
  }
  function blob(c, x, y, s, t, col, o = {}) {
    c.save(); c.translate(x, y + Math.sin(t * 2 + (o.seed || 0)) * 8 * s); c.scale(s, s); c.rotate(Math.sin(t * 1.4 + (o.seed || 0)) * 0.09);
    const n = 11; c.fillStyle = col; c.beginPath(); for (let i = 0; i <= n * 2; i++) { const a = (i / (n * 2)) * TAU, r = i % 2 ? 55 : 72; const px = Math.cos(a) * r, py = Math.sin(a) * r; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.lineJoin = 'round'; c.lineWidth = 12; c.strokeStyle = col; c.stroke(); c.fill();
    for (const sd of [-1, 1]) { circ(c, sd * 22, -8, 18, P.white); circ(c, sd * 21, -6, 9, P.ink); circ(c, sd * 18, -10, 3, P.white); }
    if (o.sad) curve(c, [-13, 30], [0, 18], [13, 30], 5, P.ink); else curve(c, [-14, 21], [0, 36], [14, 21], 5, P.ink);
    c.restore();
  }
  function xray(c, x, y, r, k, fn) {
    if (k <= 0) return; const R = r * E.back(clamp(k));
    c.save(); c.beginPath(); c.arc(x, y, R, 0, TAU); c.clip(); c.fillStyle = '#1d1259'; c.fillRect(x - R, y - R, R * 2, R * 2); glow(c, x, y, R, P.violet, 0.75); c.translate(x, y); c.scale(R / r, R / r); fn(); c.restore();
    c.strokeStyle = P.white; c.lineWidth = 6; c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke();
  }
  function spiral(c, t, a = 1) {
    const cols = [P.pink, P.amber, P.sky, P.lav, P.mint, P.rose]; c.save(); c.globalAlpha = a; c.translate(360, 640); c.fillStyle = P.violet; c.fillRect(-900, -900, 1800, 1800);
    for (let i = 0; i < 48; i++) { c.fillStyle = cols[i % cols.length]; c.beginPath(); c.moveTo(0, 0); for (let r = 0; r <= 1050; r += 42) { const q = i * (TAU / 48) + r * 0.0052 + t * 0.9; c.lineTo(Math.cos(q) * r, Math.sin(q) * r); } for (let r = 1050; r >= 0; r -= 42) { const q = (i + 1) * (TAU / 48) + r * 0.0052 + t * 0.9; c.lineTo(Math.cos(q) * r, Math.sin(q) * r); } c.closePath(); c.fill(); }
    glow(c, 0, 0, 90, P.white, 1); c.restore();
  }
  function raindrop(c, x, y, s, col = P.sky, k = 1) { c.save(); c.translate(x, y); c.scale(s * k, s * k); c.fillStyle = col; c.beginPath(); c.moveTo(0, -60); c.bezierCurveTo(14, -24, 44, -2, 44, 28); c.arc(0, 28, 44, 0, Math.PI); c.bezierCurveTo(-44, -2, -14, -24, 0, -60); c.fill(); oval(c, -15, 26, 8, 15, 'rgba(255,255,255,.65)', 0.2); c.restore(); }

  // ---- the label system
  function textBox(c, s, size, weight = 800) { c.font = `${weight} ${size}px ${FONT}`; return c.measureText(s).width; }
  // small coloured tag; lead = [x, y] draws a thin leader line to the thing it names
  function tag(c, x, y, s, col, k, o = {}) {
    if (k <= 0) return; const size = o.size || 32, u = E.back(clamp(k)), w = textBox(c, s, size) + 34, h = size + 24;
    if (o.lead) { const lk = clamp(k * 1.6); line(c, [[x, y], [H.lerp(x, o.lead[0], lk), H.lerp(y, o.lead[1], lk)]], 2.5, rgb(P.white, 0.9)); circ(c, o.lead[0], o.lead[1], 6 * lk, 'rgba(255,255,255,.28)'); circ(c, o.lead[0], o.lead[1], 3 * lk, P.white); }
    c.save(); c.translate(x, y); c.scale(u, u); rr(c, -w / 2, -h / 2 + 4, w, h, 9, 'rgba(10,6,40,.22)'); rr(c, -w / 2, -h / 2, w, h, 9, col); c.fillStyle = o.ink || P.white; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `800 ${size}px ${FONT}`; c.fillText(s, 0, 2); c.restore();
  }
  // the big fact: dark card with a rolling number and a small unit
  function stat(c, x, y, num, unit, k, o = {}) {
    if (k <= 0) return; const u = E.back(clamp(k)), size = o.size || 76, nW = textBox(c, num, size, 900), uW = unit ? textBox(c, unit, 34, 800) + 14 : 0, w = nW + uW + 50, h = size + 42;
    c.save(); c.translate(x, y); c.scale(u, u); rr(c, -w / 2, -h / 2, w, h, 16, o.bg || 'rgba(22,13,63,.9)'); c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = P.white; c.font = `900 ${size}px ${FONT}`; c.fillText(num, -w / 2 + 25, 3);
    if (unit) { c.font = `800 34px ${FONT}`; c.fillStyle = o.unitCol || P.lilac; c.fillText(unit, -w / 2 + 25 + nW + 14, 12); } c.restore();
  }
  function meter(c, x, y, w, h, val, col, label, k = 1) {
    if (k <= 0) return; c.save(); c.globalAlpha = clamp(k * 2); rr(c, x, y, w, h, w / 2, P.ink); const iH = (h - 12) * clamp(val); const g = vgrad(c, y + h - iH, y + h, col, P.amber); rr(c, x + 6, y + h - 6 - iH, w - 12, iH, (w - 12) / 2, g);
    if (label) tag(c, x + w / 2, y - 36, label, P.ink, 1, { size: 25 }); c.restore();
  }
  function calendar(c, x, y, s, title, total, crossed, t, col = P.pink) {
    c.save(); c.translate(x, y); c.scale(s, s); rr(c, -146, -112, 300, 340, 14, 'rgba(10,6,40,.16)'); rr(c, -150, -120, 300, 340, 14, P.paper); c.fillStyle = col; c.beginPath(); c.roundRect(-150, -120, 300, 92, [14, 14, 0, 0]); c.fill();
    for (const a of [-85, 0, 85]) rr(c, a - 7, -136, 14, 42, 7, P.ink);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = P.white; c.font = `900 42px ${FONT}`; c.fillText(title, 0, -72);
    for (let i = 0; i < total; i++) { const cx = -116 + (i % 6) * 46, cy = 0 + Math.floor(i / 6) * 46; rr(c, cx - 19, cy - 19, 38, 38, 6, '#ecdff0'); const u = clamp(crossed - i); if (u > 0) { const z = E.back(u); c.save(); c.translate(cx, cy); c.scale(z, z); rr(c, -19, -19, 38, 38, 6, col); line(c, [[-9, -9], [9, 9]], 6, P.white); line(c, [[9, -9], [-9, 9]], 6, P.white); c.restore(); } }
    c.restore();
  }
  function dayCard(c, x, y, s, n, foot) {
    c.save(); c.translate(x, y); c.scale(s, s); rr(c, -96, -104, 200, 218, 8, 'rgba(10,6,40,.18)'); rr(c, -100, -112, 200, 218, 8, P.paper); c.fillStyle = '#d12f52'; c.beginPath(); c.roundRect(-100, -112, 200, 46, [8, 8, 0, 0]); c.fill();
    c.fillStyle = P.white; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `800 26px ${FONT}`; c.fillText('DAY', 0, -87); c.fillStyle = P.ink; c.font = `900 ${String(n).length > 1 ? 104 : 118}px ${FONT}`; c.fillText(n, 0, 12); if (foot) { c.font = `800 22px ${FONT}`; c.fillStyle = '#d12f52'; c.fillText(foot, 0, 82); } c.restore();
  }
  // captions sit in the upper third and appear word by word; hot words take the accent colour
  // words: [[word, time, hot?], ...]
  function caption(c, words, t, o = {}) {
    const size = o.size || 62, y0 = o.y || 190, lh = size * 1.18, maxW = o.maxW || 620, out = o.out == null ? Infinity : o.out, fade = 1 - smooth(out - 0.15, out, t);
    if (fade <= 0 || t < words[0][1] - 0.05) return; c.font = `900 ${size}px ${FONT}`; const sp = c.measureText(' ').width; const lines = [[]]; let w = 0;
    for (const a of words) { const ww = c.measureText(a[0]).width; if (w + ww > maxW && lines[lines.length - 1].length) { lines.push([]); w = 0; } lines[lines.length - 1].push({ a, ww }); w += ww + sp; }
    c.save(); c.globalAlpha = fade; c.textAlign = 'left'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    lines.forEach((l, i) => { const tw = l.reduce((s, q) => s + q.ww + sp, -sp); let x = 360 - tw / 2; const y = y0 + i * lh; for (const q of l) { const k = clamp((t - q.a[1]) / 0.2); if (k > 0) { c.save(); c.globalAlpha = fade * clamp(k * 2); const up = (1 - E.out(k)) * 20; c.font = `900 ${size}px ${FONT}`; c.strokeStyle = 'rgba(22,13,63,.5)'; c.lineWidth = 9; c.strokeText(q.a[0], x, y + up); c.fillStyle = q.a[2] ? (o.hot || P.rose) : P.white; c.fillText(q.a[0], x, y + up); c.restore(); } x += q.ww + sp; } });
    c.restore();
  }
  // words from "One two *three*" spread evenly from t0 to t1; * marks a hot word
  function say(s, t0, t1) { const a = s.split(' '); return a.map((w, i) => [w.replace(/\*/g, ''), t0 + ((t1 - t0) * i) / a.length, w.includes('*')]); }

  // closing card; the reel loops back to its first frame after it
  function endCard(c, t, u, line1, line2, draw) { SET.space(c, t); if (draw) draw(c); const k = clamp(u / 0.5); c.globalAlpha = k; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = P.white; c.font = `900 96px ${FONT}`; c.fillText(line1, 360, 480); c.fillStyle = P.pink; c.fillRect(360 - 40 * E.out(clamp(u / 0.7)), 552, 80 * E.out(clamp(u / 0.7)), 7); c.globalAlpha = clamp((u - 0.4) / 0.4); c.fillStyle = P.lilac; c.font = `700 36px ${FONT}`; c.fillText(line2, 360, 610); c.globalAlpha = 1; }

  // ---- shots and transitions. shots: [{ t0, t1, draw(c, u, t), in: 'zoom'|'wipe'|'cut'|'flash' }]; u = seconds into the shot
  const shotBuf = {};
  function buf() { if (!shotBuf.c) { shotBuf.c = document.createElement('canvas'); shotBuf.c.width = 720; shotBuf.c.height = 1280; shotBuf.x = shotBuf.c.getContext('2d'); } return shotBuf; }
  function runShots(c, shots, t, TR = 0.34) {
    let i = shots.findIndex((s) => t < s.t1); if (i < 0) i = shots.length - 1; const s = shots[i], u = t - s.t0;
    const prev = shots[i - 1], kind = s.in || 'zoom';
    c.save(); s.draw(c, u, t); c.restore();
    if (prev && u < TR && kind !== 'cut') {
      const b = buf(), k = u / TR; b.x.save(); b.x.setTransform(1, 0, 0, 1, 0, 0); prev.draw(b.x, t - prev.t0, t); b.x.restore();
      c.save();
      if (kind === 'wipe') { const y = E.inOut(k) * 1280; c.drawImage(b.c, 0, y); }
      else if (kind === 'flash') { c.globalAlpha = 1 - k; c.drawImage(b.c, 0, 0); c.globalAlpha = Math.sin(k * Math.PI) * 0.85; c.fillStyle = P.white; c.fillRect(0, 0, 720, 1280); }
      else { const z = 1 + E.in(k) * 1.5; c.globalAlpha = 1 - E.inOut(k); c.translate(360, 640); c.scale(z, z); c.translate(-360, -640); c.drawImage(b.c, 0, 0); }
      c.restore();
    }
  }
  // the light finish: soft top light, soft vignette, nothing that fights the flat colours
  function finish(c) { const v = c.createRadialGradient(360, 600, 420, 360, 640, 900); v.addColorStop(0, 'rgba(14,8,50,0)'); v.addColorStop(1, 'rgba(14,8,50,.3)'); c.fillStyle = v; c.fillRect(0, 0, 720, 1280); }

  window.FLAT = { P, FONT, LOOKS, rr, circ, oval, poly, line, curve, vgrad, glow, beam, shade, cam, camAt, person, head, SET, skyline, plant, books, flask, cell, cellField, brain, blob, xray, spiral, raindrop, tag, stat, meter, calendar, dayCard, caption, say, endCard, runShots, finish };
})();
