// Brick Toy — chunky plastic brick figures in a bright toy diorama. Vertical 9:16 reel: W x H_ = 720 x 1280.
{
  const TAU = Math.PI * 2;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const rotX = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };
  const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
  const rotZ = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  const BXC = {}; // static caches (textures, layers); frames still depend only on t

  // ---- palette: saturated toy plastics ----
  const P = {
    red: [226, 64, 44], blue: [52, 118, 222], yellow: [250, 196, 40], green: [76, 176, 72], teal: [40, 170, 168], orange: [242, 132, 46],
    cream: [246, 236, 218], tan: [222, 170, 112], white: [244, 244, 240], dark: [62, 66, 78], denim: [70, 98, 168], skin: [252, 216, 168],
  };
  const CAP = { g: '#7ef05a', y: '#ffe04a', o: '#ff9a4a', r: '#ff6a5a' }; // caption keyword colours
  const FONT = (w, px) => `${w} ${px}px "Poppins"`;

  // ==================== the toy-diorama renderer ====================
  // Scene(E, TG): a camera at E looking at TG. Builders push plastic faces; render() shades and paints them.
  const Scene = (E, TG0, W = 720, H_ = 1280, F = 1000) => {
    const TG = [TG0[0], TG0[1] + 0.4, TG0[2]]; // aim a touch high: on a 9:16 reel the diorama sits below the caption band
    const fwd = norm(sub(TG, E)), right = norm(cross(fwd, [0, 1, 0])), up = cross(right, fwd);
    const proj = (p) => { const d = sub(p, E); const z = dot(d, fwd); return [W / 2 + (F * dot(d, right)) / z, H_ / 2 - (F * dot(d, up)) / z, z]; };
    const faces = [];
    let obj = 0; // each solid gets an id and a centre: faces facing away from the camera are culled (solids are convex)
    const solid = (center) => ({ id: ++obj, c: center });
    const face = (s, pts, col, ex = {}) => faces.push({ s, pts, col, ...ex });

    // bevelled box: half-extents w,h,d, rounded by a chamfer b. T maps local -> world. paint goes on the +z face.
    const box = (T, w, h, d, col, opt = {}) => {
      const b = Math.min(w, h, d) * (opt.bevel ?? 0.22), S = solid(T([0, 0, 0]));
      const iw = w - b, ih = h - b, id = d - b, k = (x, y, z) => T([x, y, z]);
      const sg = [-1, 1];
      // six main faces
      for (const s of sg) {
        face(S, [k(s * w, -ih, -id), k(s * w, ih, -id), k(s * w, ih, id), k(s * w, -ih, id)], col);
        face(S, [k(-iw, s * h, -id), k(iw, s * h, -id), k(iw, s * h, id), k(-iw, s * h, id)], col);
        const front = s > 0 && opt.paint;
        face(S, [k(-iw, -ih, s * d), k(iw, -ih, s * d), k(iw, ih, s * d), k(-iw, ih, s * d)], col, front ? { map: [k(-iw, ih, d), k(iw, ih, d), k(-iw, -ih, d)], paint: opt.paint } : {});
      }
      // twelve bevel strips
      for (const a of sg) for (const c of sg) {
        face(S, [k(a * w, c * ih, -id), k(a * iw, c * h, -id), k(a * iw, c * h, id), k(a * w, c * ih, id)], col, { bev: 1 }); // x-y edges
        face(S, [k(a * w, -ih, c * id), k(a * w, ih, c * id), k(a * iw, ih, c * d), k(a * iw, -ih, c * d)], col, { bev: 1 }); // x-z edges
        face(S, [k(-iw, a * h, c * id), k(iw, a * h, c * id), k(iw, a * ih, c * d), k(-iw, a * ih, c * d)], col, { bev: 1 }); // y-z edges
      }
      // eight corner facets
      for (const a of sg) for (const c of sg) for (const e of sg) face(S, [k(a * w, c * ih, e * id), k(a * iw, c * h, e * id), k(a * iw, c * ih, e * d)], col, { bev: 1 });
    };
    // cylinder along local y (studs, knobs, hats, rollers)
    const cyl = (T, r, h, col, n = 14, opt = {}) => {
      const S = solid(T([0, h / 2, 0])), ring = (y, rr) => Array.from({ length: n }, (_, i) => { const a = (i / n) * TAU; return T([Math.cos(a) * rr, y, Math.sin(a) * rr]); });
      const A = ring(0, r), B = ring(h, r), C = ring(h + r * 0.12, r * 0.86);
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; face(S, [A[i], A[j], B[j], B[i]], col); face(S, [B[i], B[j], C[j], C[i]], col, { bev: 1 }); }
      face(S, C, col, opt.capPaint ? { map: [C[Math.round(n * 0.625) % n], C[Math.round(n * 0.875) % n], C[Math.round(n * 0.375) % n]], paint: opt.capPaint } : {});
    };
    // a classic brick: box plus studs on top (nx x nz)
    const brick = (x, y, z, nx, nz, col, rot = 0, lift = 0) => {
      const u = 0.32, w = nx * u / 2, d = nz * u / 2, h = 0.19;
      const T = (p) => add(rotY(p, rot), [x, y + h + lift, z]);
      box(T, w, h, d, col, { bevel: 0.12 });
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) cyl((p) => T(add(p, [-w + u * (i + 0.5), h, -d + u * (j + 0.5)])), 0.095, 0.07, col, 10);
    };
    // the brick figure: block legs, chunky torso, swinging arms, cube head with a printed face and a hat.
    // Costume kit (all optional): stripes [colA, colB] (prisoner), number '24601' (chest plate), suit, tie col,
    // medals n, emblem { txt, col, bg, shape: 'diamond' | 'circle' }, cape col (capeFlap), sleeve col, pantsPaint,
    // hair 'short' | 'side' | 'combover' | 'flattop' | 'thin' | 'long' | 'spiky' (hairCol), hat 'cap' | 'police' |
    // 'beanie' | 'hard' | 'peaked' | 'crown' | 'tophat' | 'cowl' (ears) | 'helmet' | 'army' (hatCol), balaclava col,
    // mustache 'toothbrush' | 'big' | 'beard', shades, brows 'angry' | 'worried' | 'raised', sweat,
    // eyes adds 'angry', mouth adds 'grin' | 'evil', hold 'gun' | 'bag' | 'briefcase' | 'phone' | 'remote' | 'sword' |
    // 'shield' | 'flag' | 'hammer' (holdArm 1 = right, -1 = left; holdCol)
    const rgb = (col) => 'rgb(' + col.join(',') + ')';
    const figure = (x, z, s, rot, o = {}) => {
      const bob = o.bob || 0, T0 = (p) => add(rotY(mul(p, s), rot), [x, bob, z]);
      const legA = o.walk ? Math.sin(o.walk) * 0.5 : 0;
      const stripes = o.stripes ? (c, w, h) => { for (let i = 0; i < 6; i++) { c.fillStyle = rgb(o.stripes[i % 2]); c.fillRect(0, h * i / 6, w, h / 6 + 1); } } : null;
      const shirt = o.shirt || (o.stripes ? o.stripes[0] : o.suit ? [40, 44, 56] : P.tan);
      const pants = o.pants || (o.stripes ? o.stripes[0] : o.suit ? [40, 44, 56] : P.denim);
      const dressed = o.stripes || o.suit || o.tie || o.medals || o.emblem || o.number;
      const torsoPaint = o.shirtPaint || (dressed ? (c, w, h) => {
        if (stripes) stripes(c, w, h);
        if (o.suit) { c.fillStyle = '#f4f4f0'; c.beginPath(); c.moveTo(w * 0.36, 0); c.lineTo(w * 0.5, h * 0.6); c.lineTo(w * 0.64, 0); c.fill(); }
        if (o.tie) { c.fillStyle = rgb(o.tie); c.beginPath(); c.moveTo(w * 0.46, h * 0.04); c.lineTo(w * 0.54, h * 0.04); c.lineTo(w * 0.56, h * 0.78); c.lineTo(w * 0.5, h * 0.96); c.lineTo(w * 0.44, h * 0.78); c.fill(); }
        for (let i = 0; i < (o.medals || 0); i++) { const mx = w * (0.16 + (i % 3) * 0.08), my = h * (0.18 + Math.floor(i / 3) * 0.2); c.fillStyle = ['#e04040', '#3a7ad8', '#2aa860'][i % 3]; c.fillRect(mx, my, w * 0.06, h * 0.08); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(mx + w * 0.03, my + h * 0.13, w * 0.025, 0, TAU); c.fill(); }
        if (o.emblem) { const e = o.emblem; c.fillStyle = rgb(e.bg || P.yellow); c.beginPath(); if (e.shape === 'circle') c.arc(w / 2, h * 0.45, h * 0.3, 0, TAU); else { c.moveTo(w * 0.5, h * 0.1); c.lineTo(w * 0.7, h * 0.3); c.lineTo(w * 0.5, h * 0.82); c.lineTo(w * 0.3, h * 0.3); c.closePath(); } c.fill();
          if (e.txt) { c.fillStyle = rgb(e.col || P.red); c.font = FONT(800, h * 0.34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(e.txt, w / 2, h * 0.42); } }
        if (o.number) { c.fillStyle = '#f4f4f0'; c.fillRect(w * 0.25, h * 0.32, w * 0.5, h * 0.24); c.fillStyle = '#16161c'; c.font = FONT(800, h * 0.18); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(o.number), w / 2, h * 0.445); }
      } : undefined);
      for (const sd of [-1, 1]) box((p) => T0(add(rotX(add(p, [0, -0.32, 0]), legA * sd), [sd * 0.17, 0.66, 0])), 0.15, 0.32, 0.16, pants, { bevel: 0.25, paint: o.pantsPaint || stripes || undefined });
      box((p) => T0(add(p, [0, 1.2, 0])), 0.36, 0.3, 0.2, shirt, { bevel: 0.3, paint: torsoPaint });
      if (o.cape) box((p) => T0(add(rotX(add(p, [0, -0.6, 0]), 0.16 + (o.capeFlap || 0)), [0, 1.5, -0.24])), 0.42, 0.62, 0.025, o.cape, { bevel: 0.2 });
      const arms = o.arms || [0.15, 0.15]; // radians, positive = raised outward
      for (const sd of [-1, 1]) {
        const ang = arms[sd < 0 ? 0 : 1];
        box((p) => T0(add(rotZ(add(p, [0, -0.26, 0]), sd * ang), [sd * 0.47, 1.42, 0])), 0.1, 0.27, 0.12, o.sleeve || shirt, { bevel: 0.35, paint: o.sleeve ? undefined : stripes || undefined });
        box((p) => T0(add(rotZ(add(p, [0, -0.6, 0]), sd * ang), [sd * 0.47, 1.42, 0])), 0.1, 0.08, 0.1, o.skin || P.skin, { bevel: 0.4 });
        if (o.hold && sd === (o.holdArm || 1)) holdItem(o.hold, (p) => T0(add(rotZ(add(p, [0, -0.7, 0.04]), sd * ang), [sd * 0.47, 1.42, 0])), o.holdCol);
      }
      const face2 = (c, w, h) => { // printed face: eyes (open | wide | closed | x | sleepy | angry), mouth (smile | o | flat | frown | open | grin | evil), optional mask
        if (o.balaclava) { c.fillStyle = rgb(o.skin || P.skin); c.beginPath(); c.roundRect(w * 0.16, h * 0.32, w * 0.68, h * 0.26, h * 0.06); c.fill(); c.beginPath(); c.ellipse(w * (0.5 + (o.look || 0)), h * 0.74, w * 0.17, h * 0.1, 0, 0, TAU); c.fill(); }
        c.fillStyle = '#2a2a33'; c.strokeStyle = '#2a2a33'; c.lineCap = 'round'; const ex = o.look || 0, ey = o.lookY || 0, eyes = o.eyes || 'open';
        if (o.mask) { c.fillStyle = '#16161c'; c.fillRect(0, h * 0.3, w, h * 0.3); c.fillStyle = '#f4f0e6'; }
        for (const cx of [0.34, 0.66]) {
          const x = w * (cx + ex), y = h * (0.45 + ey);
          if (eyes === 'closed' || eyes === 'sleepy') { c.lineWidth = w * 0.04; c.beginPath(); c.moveTo(x - w * 0.06, y + (eyes === 'sleepy' ? 0 : h * 0.01)); c.lineTo(x + w * 0.06, y); c.stroke(); if (eyes === 'sleepy') { c.beginPath(); c.ellipse(x, y + h * 0.02, w * 0.045, h * 0.035, 0, 0, Math.PI); c.fill(); } }
          else if (eyes === 'x') { c.lineWidth = w * 0.035; c.beginPath(); c.moveTo(x - w * 0.05, y - h * 0.05); c.lineTo(x + w * 0.05, y + h * 0.05); c.moveTo(x + w * 0.05, y - h * 0.05); c.lineTo(x - w * 0.05, y + h * 0.05); c.stroke(); }
          else { const k = eyes === 'wide' ? 1.45 : 1; c.beginPath(); c.ellipse(x, y, w * 0.055 * k, h * 0.08 * k, 0, 0, TAU); c.fill(); if (eyes === 'wide') { c.fillStyle = '#fff'; c.beginPath(); c.arc(x - w * 0.02, y - h * 0.03, w * 0.022, 0, TAU); c.fill(); c.fillStyle = o.mask ? '#f4f0e6' : '#2a2a33'; } }
          const br = o.brows || (eyes === 'angry' ? 'angry' : null);
          if (br) { const inner = cx < 0.5 ? 1 : -1, by = y - h * 0.14; c.lineWidth = w * 0.045; c.strokeStyle = o.mask ? '#f4f0e6' : '#2a2a33'; c.beginPath();
            const d = br === 'angry' ? h * 0.05 : br === 'worried' ? -h * 0.05 : 0, lift = br === 'raised' ? -h * 0.05 : 0;
            c.moveTo(x - inner * w * 0.08, by - d / 2 + lift); c.lineTo(x + inner * w * 0.07, by + d / 2 + lift); c.stroke(); c.strokeStyle = '#2a2a33'; }
        }
        if (o.shades) { c.fillStyle = '#121218'; for (const cx of [0.34, 0.66]) { c.beginPath(); c.roundRect(w * (cx + ex - 0.12), h * (0.38 + ey), w * 0.24, h * 0.15, h * 0.04); c.fill(); } c.fillRect(w * (0.44 + ex), h * (0.41 + ey), w * 0.12, h * 0.03); c.fillStyle = 'rgba(255,255,255,0.35)'; for (const cx of [0.28, 0.6]) c.fillRect(w * (cx + ex), h * (0.4 + ey), w * 0.05, h * 0.03); }
        c.fillStyle = '#2a2a33'; c.lineWidth = w * 0.045; c.beginPath(); const m = o.mouth || 'smile', mx = w * (0.5 + ex), my = h * (0.62 + ey);
        if (m === 'o') { c.arc(mx, my + h * 0.1, w * 0.06, 0, TAU); c.stroke(); }
        else if (m === 'open') { c.ellipse(mx, my + h * 0.08, w * 0.11, h * 0.09, 0, 0, TAU); c.fill(); }
        else if (m === 'flat') { c.moveTo(mx - w * 0.1, my + h * 0.1); c.lineTo(mx + w * 0.1, my + h * 0.1); c.stroke(); }
        else if (m === 'frown') { c.arc(mx, my + h * 0.2, w * 0.12, 1.25 * Math.PI, 1.75 * Math.PI); c.stroke(); }
        else if (m === 'grin') { c.moveTo(mx - w * 0.17, my + h * 0.02); c.quadraticCurveTo(mx, my + h * 0.3, mx + w * 0.17, my + h * 0.02); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.fillRect(mx - w * 0.13, my + h * 0.03, w * 0.26, h * 0.04); }
        else if (m === 'evil') { c.moveTo(mx - w * 0.13, my + h * 0.08); c.quadraticCurveTo(mx + w * 0.02, my + h * 0.14, mx + w * 0.15, my); c.stroke(); }
        else { c.arc(mx, my, w * 0.14, 0.25 * Math.PI, 0.75 * Math.PI); c.stroke(); }
        if (o.mustache) { c.fillStyle = rgb(o.hairCol || [40, 30, 26]); const ty = my - h * 0.02;
          if (o.mustache === 'toothbrush') c.fillRect(mx - w * 0.08, ty - h * 0.06, w * 0.16, h * 0.085);
          else if (o.mustache === 'big') { c.beginPath(); c.ellipse(mx - w * 0.08, ty, w * 0.1, h * 0.045, -0.2, 0, TAU); c.ellipse(mx + w * 0.08, ty, w * 0.1, h * 0.045, 0.2, 0, TAU); c.fill(); }
          else if (o.mustache === 'beard') { c.beginPath(); c.moveTo(w * 0.12, h * 0.55); c.lineTo(w * 0.88, h * 0.55); c.lineTo(w * 0.8, h); c.lineTo(w * 0.2, h); c.closePath(); c.fill(); c.fillStyle = rgb(o.skin || P.skin); c.beginPath(); c.ellipse(mx, my + h * 0.1, w * 0.12, h * 0.07, 0, 0, TAU); c.fill(); c.fillStyle = '#2a2a33'; c.beginPath(); c.ellipse(mx, my + h * 0.1, w * 0.07, h * 0.03, 0, 0, TAU); c.fill(); } }
        if (o.sweat) { c.fillStyle = '#7ec8ff'; c.beginPath(); c.moveTo(w * 0.86, h * 0.22); c.quadraticCurveTo(w * 0.94, h * 0.36, w * 0.86, h * 0.38); c.quadraticCurveTo(w * 0.78, h * 0.36, w * 0.86, h * 0.22); c.fill(); }
      };
      const HT = (p) => T0(add(rotY(p, o.headTurn || 0), [0, 0, 0]));
      box((p) => HT(add(p, [0, 1.86, 0])), 0.3, 0.3, 0.28, o.balaclava || o.skin || P.skin, { bevel: 0.28, paint: face2 });
      const hc = o.hairCol || (o.hair === 'combover' ? [246, 196, 92] : o.hair === 'thin' ? [196, 170, 140] : o.hair === 'flattop' ? [24, 22, 26] : [70, 48, 34]);
      if (o.hair === 'short' || o.hair === 'side' || o.hair === 'long') { box((p) => HT(add(p, [0, 2.17, -0.01])), 0.31, 0.05, 0.29, hc, { bevel: 0.45 }); box((p) => HT(add(p, [0, 1.98, -0.27])), 0.31, 0.2, 0.03, hc, { bevel: 0.4 }); }
      if (o.hair === 'side') box((p) => HT(add(rotZ(p, 0.45), [-0.1, 2.06, 0.285])), 0.17, 0.045, 0.02, hc, { bevel: 0.4 });
      if (o.hair === 'long') box((p) => HT(add(p, [0, 1.7, -0.27])), 0.33, 0.3, 0.04, hc, { bevel: 0.4 });
      if (o.hair === 'combover') { box((p) => HT(add(p, [0, 2.2, -0.02])), 0.33, 0.09, 0.3, hc, { bevel: 0.5 }); box((p) => HT(add(rotZ(p, -0.12), [0.05, 2.19, 0.27])), 0.3, 0.07, 0.07, hc, { bevel: 0.5 }); box((p) => HT(add(p, [0, 1.98, -0.27])), 0.31, 0.2, 0.03, hc, { bevel: 0.4 }); }
      if (o.hair === 'flattop') { box((p) => HT(add(p, [0, 2.25, -0.02])), 0.25, 0.1, 0.24, hc, { bevel: 0.35 }); box((p) => HT(add(p, [0, 2.15, -0.01])), 0.31, 0.03, 0.29, hc, { bevel: 0.4 }); }
      if (o.hair === 'thin') box((p) => HT(add(p, [0, 2.165, -0.08])), 0.29, 0.02, 0.2, hc, { bevel: 0.4 });
      if (o.hair === 'spiky') for (let i = 0; i < 5; i++) box((p) => HT(add(rotZ(rotX(p, (i % 2 - 0.5) * 0.4), 0.78), [-0.24 + i * 0.12, 2.2, (i % 2) * 0.08 - 0.04])), 0.08, 0.08, 0.08, hc, { bevel: 0.3 });
      const hat = o.hatCol;
      if (o.hat === 'cap') { box((p) => T0(add(p, [0, 2.2, -0.02])), 0.32, 0.07, 0.3, hat || P.blue, { bevel: 0.4 }); box((p) => T0(add(p, [0, 2.14, 0.34])), 0.28, 0.025, 0.12, hat || P.blue, { bevel: 0.4 }); }
      if (o.hat === 'police') { box((p) => T0(add(p, [0, 2.2, 0])), 0.33, 0.08, 0.31, hat || [30, 40, 90], { bevel: 0.4 }); box((p) => T0(add(p, [0, 2.28, 0])), 0.36, 0.04, 0.34, hat || [30, 40, 90], { bevel: 0.4, paint: (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.12, 0, TAU); c.fill(); } }); box((p) => T0(add(p, [0, 2.14, 0.33])), 0.28, 0.02, 0.1, [20, 20, 30], { bevel: 0.4 }); }
      if (o.hat === 'beanie') box((p) => T0(add(p, [0, 2.16, 0])), 0.33, 0.12, 0.31, hat || [30, 30, 36], { bevel: 0.5 });
      if (o.hat === 'hard') { cyl((p) => T0(add(p, [0, 2.12, 0])), 0.34, 0.16, P.yellow, 16); cyl((p) => T0(add(p, [0, 2.1, 0])), 0.42, 0.03, P.yellow, 16); }
      if (o.hat === 'peaked') { const hcol = hat || [84, 96, 62]; box((p) => HT(add(p, [0, 2.21, 0])), 0.32, 0.07, 0.3, hcol, { bevel: 0.4, paint: (c, w, h) => { c.fillStyle = '#1c1c22'; c.fillRect(0, h * 0.55, w, h * 0.45); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h * 0.4, h * 0.3, 0, TAU); c.fill(); } }); box((p) => HT(add(rotX(p, -0.12), [0, 2.32, 0.03])), 0.4, 0.05, 0.38, hcol, { bevel: 0.45 }); box((p) => HT(add(rotX(p, 0.25), [0, 2.15, 0.36])), 0.28, 0.02, 0.11, [24, 24, 30], { bevel: 0.4 }); }
      if (o.hat === 'crown') { const g = hat || [250, 200, 50]; box((p) => HT(add(p, [0, 2.22, 0])), 0.32, 0.07, 0.3, g, { bevel: 0.35, paint: (c, w, h) => { for (const [cx, col] of [[0.25, '#e03040'], [0.5, '#3070e0'], [0.75, '#30b060']]) { c.fillStyle = col; c.beginPath(); c.arc(w * cx, h / 2, h * 0.28, 0, TAU); c.fill(); } } }); for (const sx of [-0.24, 0, 0.24]) for (const sz of [-0.22, 0.22]) box((p) => HT(add(rotY(rotZ(p, 0.78), 0.78), [sx, 2.33, sz])), 0.05, 0.05, 0.05, g, { bevel: 0.3 }); }
      if (o.hat === 'tophat') { cyl((p) => HT(add(p, [0, 2.15, 0])), 0.27, 0.42, hat || [24, 24, 30], 16); cyl((p) => HT(add(p, [0, 2.15, 0])), 0.42, 0.03, hat || [24, 24, 30], 16); }
      if (o.hat === 'army') { cyl((p) => HT(add(p, [0, 2.1, 0])), 0.37, 0.15, hat || [84, 96, 62], 16); cyl((p) => HT(add(p, [0, 2.08, 0])), 0.44, 0.03, hat || [84, 96, 62], 16); }
      if (o.hat === 'cowl') { const cc = hat || [36, 36, 44]; box((p) => HT(add(p, [0, 2.0, 0])), 0.32, 0.17, 0.3, cc, { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#f4f4f0'; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(w * (0.5 + sx * 0.08), h * 0.66); c.lineTo(w * (0.5 + sx * 0.27), h * 0.56); c.lineTo(w * (0.5 + sx * 0.25), h * 0.78); c.closePath(); c.fill(); } } }); if (o.ears !== false) for (const sx of [-0.2, 0.2]) box((p) => HT(add(p, [sx, 2.27, 0])), 0.05, 0.11, 0.05, cc, { bevel: 0.3 }); }
      if (o.hat === 'helmet') { const hcol = hat || [196, 36, 36]; box((p) => HT(add(p, [0, 1.86, 0])), 0.32, 0.32, 0.3, hcol, { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#f2c23c'; c.beginPath(); c.roundRect(w * 0.14, h * 0.24, w * 0.72, h * 0.66, w * 0.14); c.fill(); c.fillStyle = '#cff4ff'; c.shadowColor = '#7fe0ff'; c.shadowBlur = w * 0.06; for (const sx of [0.3, 0.56]) c.fillRect(w * sx, h * 0.44, w * 0.14, h * 0.06); c.shadowBlur = 0; c.fillStyle = '#7a5a10'; c.fillRect(w * 0.38, h * 0.72, w * 0.24, h * 0.025); } }); }
    };
    // things a figure can hold, in hand space (T maps hand-local points; +z is forward)
    const holdItem = (kind, T, col) => {
      if (kind === 'gun') { const g = col || [52, 52, 60]; box((p) => T(add(p, [0, 0.04, 0.2])), 0.06, 0.08, 0.24, g, { bevel: 0.3 }); box((p) => T(add(p, [0, -0.08, 0.06])), 0.05, 0.11, 0.06, g, { bevel: 0.3 }); box((p) => T(add(p, [0, 0.04, 0.47])), 0.04, 0.04, 0.03, P.orange, { bevel: 0.3 }); }
      if (kind === 'bag') { box((p) => T(add(p, [0, -0.2, 0.04])), 0.17, 0.16, 0.14, col || [196, 170, 120], { bevel: 0.5, paint: (c, w, h) => { c.fillStyle = '#3a6a2a'; c.font = FONT(800, h * 0.6); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', w / 2, h * 0.55); } }); box((p) => T(add(p, [0, -0.02, 0.04])), 0.06, 0.04, 0.05, col || [196, 170, 120], { bevel: 0.4 }); }
      if (kind === 'briefcase') { box((p) => T(add(p, [0, -0.17, 0.02])), 0.22, 0.15, 0.05, col || [90, 58, 36], { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(w * 0.42, h * 0.1, w * 0.16, h * 0.1); } }); }
      if (kind === 'phone') box((p) => T(add(p, [0, 0, 0.1])), 0.05, 0.09, 0.015, col || [20, 20, 26], { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#5ab0ff'; c.fillRect(w * 0.1, h * 0.06, w * 0.8, h * 0.88); } });
      if (kind === 'remote') box((p) => T(add(p, [0, 0, 0.1])), 0.06, 0.03, 0.1, col || [40, 40, 48], { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#ff2a2a'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.3, 0, TAU); c.fill(); } });
      if (kind === 'sword') { box((p) => T(add(p, [0, 0.02, 0.42])), 0.025, 0.04, 0.36, col || [210, 216, 226], { bevel: 0.3 }); box((p) => T(add(p, [0, 0.02, 0.05])), 0.1, 0.03, 0.025, [250, 200, 50], { bevel: 0.3 }); }
      if (kind === 'hammer') { box((p) => T(add(p, [0, 0, 0.18])), 0.025, 0.025, 0.2, [120, 84, 50], { bevel: 0.3 }); box((p) => T(add(p, [0, 0, 0.4])), 0.1, 0.08, 0.06, col || [170, 176, 186], { bevel: 0.3 }); }
      if (kind === 'shield') cyl((p) => T(add(rotX(p, Math.PI / 2), [0, -0.05, 0.1])), 0.3, 0.04, col || [196, 36, 36], 20, { capPaint: (c, w, h) => { const r = w / 2; [['#c42424', 1], ['#f4f4f0', 0.75], ['#c42424', 0.5], ['#2a52b0', 0.3]].forEach(([f, k]) => { c.fillStyle = f; c.beginPath(); c.arc(r, r, r * k, 0, TAU); c.fill(); }); } });
      if (kind === 'flag') { box((p) => T(add(p, [0, 0.35, 0.05])), 0.015, 0.5, 0.015, [200, 200, 206], { bevel: 0.3 }); box((p) => T(add(p, [0.17, 0.7, 0.05])), 0.17, 0.11, 0.01, col || P.red, { bevel: 0.2 }); }
    };
    // a red plastic number tag (bevelled plate with white printed numerals), popping in with scale u
    const tag = (x, y, z, txt, u, rot = -0.06, col = P.red, wd = 1.15) => {
      if (u <= 0) return;
      const T = (p) => add(rotZ(rotY(mul(p, u), 0.12), rot), [x, y, z]);
      box(T, wd, 0.36, 0.2, col, { bevel: 0.32, paint: (c, w, h) => {
        let px = h * 0.62; c.font = FONT(800, px); const mw = c.measureText(txt).width; if (mw > w * 0.86) { px *= (w * 0.86) / mw; c.font = FONT(800, px); }
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillStyle = 'rgba(120,20,10,0.45)'; c.fillText(txt, w / 2 + px * 0.04, h * 0.54 + px * 0.05);
        c.fillStyle = '#fffaf3'; c.fillText(txt, w / 2, h * 0.52);
      } });
    };

    // ---------------- render ----------------
    const render = (ctx, W, H_, env) => {
      const Lk = norm(env.light || [-0.55, 0.95, 0.65]), sky = env.sky || [200, 225, 255], gnd = env.ground || [120, 170, 90];
      const vis = [];
      for (const f of faces) {
        const [a, b, c] = f.pts;
        let n = norm(cross(sub(b, a), sub(c, a)));
        const cen = mul(f.pts.reduce((s, p) => add(s, p), [0, 0, 0]), 1 / f.pts.length);
        if (dot(n, sub(cen, f.s.c)) < 0) n = mul(n, -1); // outward
        const toE = norm(sub(E, cen));
        if (dot(n, toE) <= 0.001) continue; // back face
        const dif = Math.max(0, dot(n, Lk)), hemi = n[1] * 0.5 + 0.5;
        const h2 = norm(add(Lk, toE)), spec = Math.pow(Math.max(0, dot(n, h2)), f.bev ? 18 : 40) * (f.bev ? 0.5 : 0.32);
        f.rgb = f.col.map((v, i) => Math.min(255, v * (0.38 + 0.6 * dif) + v * 0.2 * hemi * sky[i] / 255 + v * 0.1 * (1 - hemi) * gnd[i] / 255 + 255 * spec));
        f.sp = f.pts.map(proj); if (f.sp.some((p) => p[2] < 0.3)) continue;
        f.z = f.sp.reduce((s, p) => s + p[2], 0) / f.sp.length; f.cen = cen; f.dif = dif;
        vis.push(f);
      }
      // painter's order: solids by their centre depth, faces of one solid in any order (convex + culled)
      const sz = new Map(); vis.forEach((f) => { if (!sz.has(f.s.id)) sz.set(f.s.id, dot(sub(f.s.c, E), fwd)); });
      vis.sort((a, b) => (sz.get(b.s.id) - sz.get(a.s.id)) || (b.z - a.z));
      // soft shadows on the ground + contact occlusion, in reduced-resolution masks
      if (env.shadows !== false) {
        const lowL = (key) => { let L = BXC[key]; if (!L) L = BXC[key] = H.layer(W / 2, H_ / 2); const c = L.getContext('2d', { willReadFrequently: true }); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W / 2, H_ / 2); c.setTransform(0.5, 0, 0, 0.5, 0, 0); c.fillStyle = '#000'; return [L, c]; };
        const [SL, sc] = lowL('SL'), [CL, cc] = lowL('CL'), Ls = mul(Lk, -1);
        vis.forEach((f) => {
          sc.beginPath(); f.pts.forEach((p, i) => { const s = proj(add(p, mul(Ls, p[1] / -Ls[1]))); i ? sc.lineTo(s[0], s[1]) : sc.moveTo(s[0], s[1]); }); sc.closePath(); sc.fill();
          let mn = 1e9; f.pts.forEach((p) => { if (p[1] < mn) mn = p[1]; }); if (mn > 0.12) return;
          cc.beginPath(); f.pts.forEach((p, i) => { const s = proj([p[0], 0, p[2]]); i ? cc.lineTo(s[0], s[1]) : cc.moveTo(s[0], s[1]); }); cc.closePath(); cc.fill();
        });
        let M = BXC.SM; if (!M) M = BXC.SM = H.layer(W / 2, H_ / 2);
        const m = M.getContext('2d', { willReadFrequently: true }); m.globalAlpha = 1; m.filter = 'none'; m.fillStyle = '#fff'; m.fillRect(0, 0, W / 2, H_ / 2);
        m.filter = 'blur(7px)'; m.globalAlpha = 0.34; m.drawImage(SL, 0, 0); m.filter = 'blur(3px)'; m.globalAlpha = 0.5; m.drawImage(CL, 0, 0); m.filter = 'none'; m.globalAlpha = 1;
        ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(M, 0, 0, W, H_); ctx.restore();
      }
      // plastic facets: soft light-to-shade gradient, a seam-hiding stroke, printed decals
      const Lscr = [-0.55, -0.83]; // light direction on screen for the soft facet gradient
      for (const f of vis) {
        const sp = f.sp; let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
        for (const p of sp) { if (p[0] < mnx) mnx = p[0]; if (p[0] > mxx) mxx = p[0]; if (p[1] < mny) mny = p[1]; if (p[1] > mxy) mxy = p[1]; }
        if (mxx < -30 || mnx > W + 30 || mxy < -30 || mny > H_ + 30) continue;
        const gx = (mnx + mxx) / 2, gy = (mny + mxy) / 2, rr = Math.max(1, Math.max(mxx - mnx, mxy - mny) / 2);
        ctx.beginPath(); sp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
        if (rr > 6) { const g = ctx.createLinearGradient(gx + Lscr[0] * rr, gy + Lscr[1] * rr, gx - Lscr[0] * rr, gy - Lscr[1] * rr); g.addColorStop(0, H.rgba(f.rgb.map((v) => Math.min(255, v * 1.07)))); g.addColorStop(1, H.rgba(f.rgb.map((v) => v * 0.9))); ctx.fillStyle = g; } else ctx.fillStyle = H.rgba(f.rgb);
        ctx.fill(); ctx.strokeStyle = H.rgba(f.rgb.map((v) => v * 0.96)); ctx.lineWidth = 0.9; ctx.stroke();
        if (f.paint) {
          const [p0, p1, p3] = f.map.map(proj), cw = 400, ch = 400 * (Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / Math.max(1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1])));
          if (ch > 2 && ch < 4000) { ctx.save(); ctx.clip(); ctx.setTransform((p1[0] - p0[0]) / cw, (p1[1] - p0[1]) / cw, (p3[0] - p0[0]) / ch, (p3[1] - p0[1]) / ch, p0[0], p0[1]); f.paint(ctx, cw, ch); ctx.restore(); }
        }
      }
    };
    return { proj, box, cyl, brick, figure, holdItem, tag, render, faces, E, TG };
  };

  // ==================== sets ====================
  // grass field: sky, drifting puff clouds and far trees (soft-focus, behind), a green lawn with blades of grass
  const grassSet = (ctx, W, H_, S, t) => {
    const hz = S.proj([S.TG[0], 0, S.TG[2] - 60])[1];
    const bg = BXC.bgL || (BXC.bgL = H.layer(W / 4, H_ / 4)), b = bg.getContext('2d', { willReadFrequently: true });
    b.setTransform(0.25, 0, 0, 0.25, 0, 0);
    const sk = b.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#7fbdf2'); sk.addColorStop(1, '#dff0fb'); b.fillStyle = sk; b.fillRect(0, 0, W, H_);
    const r = H.rng(17);
    for (let i = 0; i < 7; i++) { // puff clouds: clusters of soft balls, shaded underneath
      const cx = ((r.range(-200, W + 120) + t * r.range(4, 10)) % (W + 220)) - 100, cy = r.range(60, Math.max(80, hz - 140)), sc = r.range(0.8, 1.4);
      for (let k = 0; k < 6; k++) { const ox = (k - 2.5) * 34 * sc, oy = -Math.sin((k / 5) * Math.PI) * 26 * sc, rad = (28 + Math.sin(k * 1.7) * 8) * sc;
        const g = b.createRadialGradient(cx + ox - rad * 0.3, cy + oy - rad * 0.4, rad * 0.2, cx + ox, cy + oy, rad); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#dfe8f2');
        b.fillStyle = g; b.beginPath(); b.arc(cx + ox, cy + oy, rad, 0, TAU); b.fill(); }
    }
    for (let i = 0; i < 12; i++) { const x = r.range(-50, W + 50), rad = r.range(40, 90); b.fillStyle = H.rgba(H.mix([86, 160, 70], [140, 196, 120], r()), 1); b.beginPath(); b.arc(x, hz - rad * 0.35, rad, 0, TAU); b.fill(); }
    const fg = b.createLinearGradient(0, hz, 0, H_); fg.addColorStop(0, '#9fd27a'); fg.addColorStop(1, '#5fae3e'); b.fillStyle = fg; b.fillRect(0, hz, W, H_ - hz);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(bg, 0, 0, W, H_); ctx.restore(); // quarter-res upscale = soft focus
    // lawn blades: world-anchored, sharper and bigger near the camera
    const blades = BXC.blades || (BXC.blades = (() => { const rr = H.rng(23), o = []; for (let i = 0; i < 5200; i++) o.push([rr.range(-9, 9), rr.range(-6, 6), rr.range(0.08, 0.2), rr.range(-0.06, 0.06), rr()]); return o; })());
    ctx.lineCap = 'round';
    const bins = new Map();
    for (const [x, z, hgt, lean, c] of blades) {
      const a = S.proj([x, 0, z]); if (a[2] < 0.5 || a[0] < -10 || a[0] > W + 10 || a[1] < hz || a[1] > H_ + 20) continue;
      const sw = Math.sin(t * 1.6 + x * 0.7) * 0.02, bt = S.proj([x + lean + sw, hgt, z]);
      const key = Math.floor(c * 6) * 100 + Math.min(40, Math.round(Math.max(0.8, 26 / a[2]) * 2));
      let L = bins.get(key); if (!L) bins.set(key, (L = [])); L.push(a[0], a[1], bt[0], bt[1]);
    }
    for (const [key, L] of bins) {
      ctx.strokeStyle = H.rgba(H.mix([70, 150, 52], [150, 214, 100], (Math.floor(key / 100) + 0.5) / 6)); ctx.lineWidth = (key % 100) / 2;
      ctx.beginPath(); for (let i = 0; i < L.length; i += 4) { ctx.moveTo(L[i], L[i + 1]); ctx.lineTo(L[i + 2], L[i + 3]); } ctx.stroke();
    }
  };
  // tiled studio sweep: blue tiles with white grout on the floor and the back wall (wall in soft focus)
  const studioSet = (ctx, W, H_, S) => {
    const quad = (c, pts, fill) => { const sp = pts.map(S.proj); if (sp.some((p) => p[2] < 0.3)) return; c.beginPath(); sp.forEach((s, i) => (i ? c.lineTo(s[0], s[1]) : c.moveTo(s[0], s[1]))); c.closePath(); c.fillStyle = fill; c.fill(); };
    const bg = BXC.bgL || (BXC.bgL = H.layer(W / 4, H_ / 4)), b = bg.getContext('2d', { willReadFrequently: true });
    b.setTransform(0.25, 0, 0, 0.25, 0, 0); b.fillStyle = '#e4ecfa'; b.fillRect(0, 0, W, H_);
    const WZ = -5, g = 0.035, cs = 1.0;
    for (let y = 0; y < 9; y++) for (let x = -12; x < 12; x++) quad(b, [[x * cs + g, y * cs + g, WZ], [x * cs + cs - g, y * cs + g, WZ], [x * cs + cs - g, y * cs + cs - g, WZ], [x * cs + g, y * cs + cs - g, WZ]], (x + y) % 2 ? '#5d8fe2' : '#6c9ce8');
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(bg, 0, 0, W, H_); ctx.restore();
    const zMax = Math.floor(S.E[2] - 0.6); // never draw floor behind the camera
    quad(ctx, [[-14, 0, WZ], [14, 0, WZ], [14, 0, zMax], [-14, 0, zMax]], '#e8eefb');
    for (let z = Math.floor(WZ); z < zMax; z++) for (let x = -12; x < 12; x++) quad(ctx, [[x * cs + g, 0, z * cs + g], [x * cs + cs - g, 0, z * cs + g], [x * cs + cs - g, 0, z * cs + cs - g], [x * cs + g, 0, z * cs + cs - g]], (x + z) % 2 ? '#5b8de0' : '#6a9ae6');
    // the cove where floor meets wall catches light
    const a = S.proj([0, 0, WZ]); const cg = ctx.createLinearGradient(0, a[1] - 40, 0, a[1] + 30); cg.addColorStop(0, 'rgba(255,255,255,0)'); cg.addColorStop(0.6, 'rgba(255,255,255,0.35)'); cg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = cg; ctx.fillRect(0, a[1] - 40, W, 70);
  };

  // ==================== finishing ====================
  // soft bloom (downsampled glow), warm toy-photo grade, vignette, fine grain
  const finish = (ctx, W, H_, t, flash = 0) => {
    const gl = BXC.glow || (BXC.glow = H.layer(W / 8, H_ / 8)), g = gl.getContext('2d', { willReadFrequently: true });
    g.clearRect(0, 0, W / 8, H_ / 8); g.filter = 'blur(2px)'; g.drawImage(ctx.canvas, 0, 0, W / 8, H_ / 8); g.filter = 'none';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.16; ctx.drawImage(gl, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,214,160,0.18)'; ctx.fillRect(0, 0, W, H_); ctx.restore();
    if (flash > 0.01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,245,225,${flash})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    H.vignette(ctx, W, H_, 0.24, '20,30,50');
    grain(ctx, 0.016, 7 + (Math.floor(t * 24) % 8));
  };
  const grain = (ctx, amount, seed) => { // H.grain with the seeded noise cached per seed (8 seeds cycling)
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height), d = img.data, n = d.length;
    BXC.gr = BXC.gr || {}; let gg = BXC.gr[seed + ':' + n];
    if (!gg) { gg = BXC.gr[seed + ':' + n] = new Float32Array(n >> 2); const r = H.rng(seed), k = amount * 255; for (let i = 0; i < gg.length; i++) gg[i] = (r() - 0.5) * k; }
    for (let i = 0, p = 0; i < n; i += 4, p++) { const v = gg[p]; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
    ctx.putImageData(img, 0, 0);
  };
  // captions: two short lines near the top, white with the keyword in a toy colour; words pop in one by one
  // lines: [[word | [word, colourKey]], ...]; t0: when the first word lands; per: seconds between words
  const caption = (ctx, W, lines, t0, t, per = 0.12, y0 = 330) => {
    if (t < t0) return;
    ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.font = FONT(600, 50);
    let k = 0;
    lines.forEach((ln, li) => {
      const words = ln.map((w) => (Array.isArray(w) ? w : [w, null])), sp = ctx.measureText(' ').width;
      const wid = words.reduce((a, [w]) => a + ctx.measureText(w).width, 0) + sp * (words.length - 1);
      let x = (W - wid) / 2; const y = y0 + li * 62;
      for (const [w, ck] of words) {
        const ww = ctx.measureText(w).width, u = H.clamp((t - t0 - k * per) / 0.18); k++;
        if (u > 0) {
          const s = 0.7 + 0.3 * H.ease.back(u);
          ctx.save(); ctx.translate(x + ww / 2, y - 16); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, u * 1.6);
          ctx.textAlign = 'center'; ctx.lineJoin = 'round';
          ctx.shadowColor = 'rgba(10,20,40,0.5)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
          ctx.strokeStyle = 'rgba(18,28,48,0.55)'; ctx.lineWidth = 7; ctx.strokeText(w, 0, 16);
          ctx.shadowColor = 'transparent'; ctx.fillStyle = ck ? CAP[ck] : '#ffffff'; ctx.fillText(w, 0, 16);
          ctx.restore();
        }
        x += ww + sp;
      }
    });
    ctx.restore();
  };
  // the roll-up shutter: a slatted door with a hazard-striped bottom rail lifting off a new set
  const shutter = (ctx, W, H_, u) => {
    if (u >= 1) return;
    const bottom = H_ * (1 - H.ease.inOut(u)) + 4;
    ctx.save();
    const g = ctx.createLinearGradient(0, 0, 0, bottom); g.addColorStop(0, '#3b4a63'); g.addColorStop(1, '#55678a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, bottom);
    for (let y = bottom - 26; y > -30; y -= 30) { ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fillRect(0, y, W, 3); ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0, y + 22, W, 5); }
    ctx.fillStyle = '#2b2f38'; ctx.fillRect(0, bottom - 22, W, 22);
    ctx.save(); ctx.beginPath(); ctx.rect(0, bottom - 18, W, 14); ctx.clip();
    for (let x = -40; x < W + 40; x += 36) { ctx.fillStyle = '#f5c518'; ctx.beginPath(); ctx.moveTo(x, bottom - 4); ctx.lineTo(x + 18, bottom - 4); ctx.lineTo(x + 32, bottom - 18); ctx.lineTo(x + 14, bottom - 18); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, bottom, W, 10);
    ctx.restore();
  };
  // shot camera: a slow push from (E0,T0) to (E1,T1) over the shot
  const shotCam = (t, a, b, E0, T0, E1, T1) => { const u = H.ease.inOut(H.clamp((t - a) / (b - a))) * 0.85 + H.clamp((t - a) / (b - a)) * 0.15; return [E0.map((v, i) => H.lerp(v, E1[i], u)), T0.map((v, i) => H.lerp(v, T1[i], u))]; };
  const popU = (t, a, d = 0.35) => { const u = H.clamp((t - a) / d); return u <= 0 ? 0 : H.ease.back(u); };
  const drop = (t, a, d = 0.32) => { const u = H.clamp((t - a) / d); if (u <= 0) return null; const e = 1 - Math.abs(Math.cos(u * Math.PI * 1.25)) * (1 - u); return (1 - Math.min(1, u * 1.15)) * 2.4 + Math.max(0, 1 - e) * 0.0; };
  // a photo printed on a cube face: a simple cat or dog portrait
  const portrait = (kind) => (c, w, h) => {
    c.fillStyle = kind === 'cat' ? '#ffe8b8' : '#d9ecff'; c.fillRect(0, 0, w, h);
    const col = kind === 'cat' ? '#f08a3c' : '#a8744a';
    c.fillStyle = col;
    if (kind === 'cat') { c.beginPath(); c.moveTo(w * 0.26, h * 0.42); c.lineTo(w * 0.3, h * 0.14); c.lineTo(w * 0.46, h * 0.32); c.moveTo(w * 0.74, h * 0.42); c.lineTo(w * 0.7, h * 0.14); c.lineTo(w * 0.54, h * 0.32); c.fill(); }
    else { c.beginPath(); c.ellipse(w * 0.24, h * 0.5, w * 0.08, h * 0.2, 0.3, 0, TAU); c.ellipse(w * 0.76, h * 0.5, w * 0.08, h * 0.2, -0.3, 0, TAU); c.fill(); }
    c.beginPath(); c.ellipse(w * 0.5, h * 0.56, w * 0.26, h * 0.26, 0, 0, TAU); c.fill();
    c.fillStyle = '#2a2a33'; c.beginPath(); c.arc(w * 0.41, h * 0.52, w * 0.035, 0, TAU); c.arc(w * 0.59, h * 0.52, w * 0.035, 0, TAU); c.fill();
    c.fillStyle = kind === 'cat' ? '#e0607a' : '#2a2a33'; c.beginPath(); c.ellipse(w * 0.5, h * 0.63, w * 0.04, h * 0.03, 0, 0, TAU); c.fill();
  };
  // the machine's screen (a model that guesses): dark glass with whatever it shows
  const screen = (draw) => (c, w, h) => { c.fillStyle = '#1d2433'; c.beginPath(); c.roundRect(w * 0.1, h * 0.12, w * 0.8, h * 0.62, w * 0.06); c.fill(); c.save(); c.beginPath(); c.roundRect(w * 0.1, h * 0.12, w * 0.8, h * 0.62, w * 0.06); c.clip(); draw(c, w, h); c.restore(); c.fillStyle = 'rgba(255,255,255,0.08)'; c.beginPath(); c.moveTo(w * 0.1, h * 0.12); c.lineTo(w * 0.5, h * 0.12); c.lineTo(w * 0.25, h * 0.74); c.lineTo(w * 0.1, h * 0.74); c.fill(); };
  const machine = (S, x, z, s, scr, knobA = 0) => {
    const T = (p) => add(mul(p, s), [x, 0, z]);
    S.box((p) => T(add(p, [0, 0.95, 0])), 0.95, 0.85, 0.7, P.teal, { bevel: 0.14, paint: screen(scr) });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) S.cyl((p) => T(add(p, [-0.6 + i * 0.6, 1.8, -0.3 + j * 0.6])), 0.16, 0.12, P.teal, 12);
    S.box((p) => T(add(p, [0, 0.06, 0])), 1.0, 0.06, 0.74, P.dark, { bevel: 0.4 });
    S.cyl((p) => T(add(rotX(rotY(p, knobA), Math.PI / 2), [0.72, 0.4, 0.7])), 0.13, 0.12, P.yellow, 12, { capPaint: (c, w, h) => { c.fillStyle = '#7a4b00'; c.fillRect(w * 0.44, h * 0.05, w * 0.12, h * 0.5); } });
  };
