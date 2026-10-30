// ===================== Violet Room: soft 3D cartoon reel style (9:16) =====================
// Smooth, toy-like 3D characters (mannequin-jointed limbs, puffy sweaters, big glossy eyes) acting out everyday
// moments in a cosy living room: sage wall, framed landscape, navy-violet couch, warm lamp light, soft depth of field.
// Short shots with hard cuts and close-ups; big white captions with a yellow keyword; flat 2D cartoon accents on top
// (speed lines, sunburst, red/green rings, dotted trails, hearts, "?", sweat drops). Every frame is a pure function of t.
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
  const shade = (c, k) => c.map((v) => Math.max(0, Math.min(255, v * k)));
  const mixc = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const VXC = {}; // static caches (textures, layers); frames still depend only on t

  // ---- palette ----
  const P = {
    skin: [226, 172, 128], mustard: [232, 150, 40], red: [226, 56, 48], navy: [36, 40, 64], couch: [46, 54, 124],
    wall: [108, 128, 100], floor: [128, 86, 60], rug: [178, 66, 52], wood: [150, 98, 62], hairBoy: [38, 28, 24], hairGirl: [128, 56, 40],
    white: [246, 244, 238], black: [30, 28, 32], shoe: [58, 58, 66], frame: [44, 34, 30], yellow: [255, 208, 64], green: [96, 196, 112],
    pink: [242, 120, 150], blue: [70, 120, 220], night: [28, 32, 66], glass: [255, 210, 120],
  };
  const KEY = '#ffd23f'; // caption keyword colour
  const FONT = (w, px) => `${w} ${px}px "Montserrat"`;
  const WARM = [1.05, 1.0, 0.92], COOL = [0.82, 0.86, 1.08];

  // ==================== the soft-3D renderer ====================
  // Scene(E, TG): camera at E looking at TG. Builders push items {z, draw}; render() paints them back to front,
  // with everything far behind the focus depth drawn into a softened layer (depth of field).
  const Scene = (E, TG, W = 720, H_ = 1280, F = 1150) => {
    const fwd = norm(sub(TG, E)), right = norm(cross(fwd, [0, 1, 0])), up = cross(right, fwd);
    const depth = (p) => dot(sub(p, E), fwd);
    const proj = (p) => { const d = sub(p, E); const z = dot(d, fwd); return [W / 2 + (F * dot(d, right)) / z, H_ / 2 - (F * dot(d, up)) / z, z]; };
    const Lk = norm([-0.5, 0.85, 0.65]); // warm key from the upper left, in front
    const Lscr = (() => { const a = proj(add(TG, mul(Lk, 0.01))), b = proj(TG); const dx = a[0] - b[0], dy = a[1] - b[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; })();
    const items = [];
    const push = (z, draw, o = {}) => items.push({ z: z + (o.bias || 0), draw, bg: o.bg });
    // flat-shaded facet colour: warm key, cool sky fill, a little bounce
    const faceCol = (col, n, toE, gloss = 0.12) => {
      const dif = Math.max(0, dot(n, Lk)), hemi = n[1] * 0.5 + 0.5, h2 = norm(add(Lk, toE)), spec = Math.pow(Math.max(0, dot(n, h2)), 24) * gloss;
      return col.map((v, i) => Math.min(255, v * (0.34 * (0.7 + 0.3 * hemi) * COOL[i] + 0.74 * dif * WARM[i]) + 255 * spec));
    };

    // ---- smooth primitives ----
    // ball: sphere / axis-aligned ellipsoid, shaded with an offset radial gradient (soft, matte, slightly glossy)
    const ballPaint = (ctx, c, r, col, o = {}) => {
      const p = proj(c); if (p[2] < 0.25) return null;
      const rx = Array.isArray(r) ? r[0] : r, ry = Array.isArray(r) ? r[1] : r;
      const sx = (F * rx) / p[2], sy = (F * ry) / p[2];
      ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, sy / sx);
      const gx = Lscr[0] * sx * 0.42, gy = Lscr[1] * sx * 0.42;
      const g = ctx.createRadialGradient(gx, gy, sx * 0.05, gx * 0.4, gy * 0.4, sx * 1.12);
      g.addColorStop(0, rgb(mixc(col.map((v, i) => v * WARM[i] * 1.12), [255, 248, 236], o.gloss ?? 0.12)));
      g.addColorStop(0.5, rgb(col.map((v, i) => v * (0.86 + 0.05 * WARM[i]))));
      g.addColorStop(1, rgb(col.map((v, i) => v * 0.4 * COOL[i])));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, sx, 0, TAU); ctx.fill();
      if (o.rim !== false) { // faint cool rim on the shadow side
        const rg = ctx.createRadialGradient(-gx * 0.3, -gy * 0.3, sx * 0.78, 0, 0, sx); rg.addColorStop(0, 'rgba(160,170,255,0)'); rg.addColorStop(1, 'rgba(170,180,255,0.16)');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(0, 0, sx, 0, TAU); ctx.fill();
      }
      ctx.restore();
      return { p, sx, sy };
    };
    const ball = (c, r, col, o = {}) => push(depth(c), (ctx) => ballPaint(ctx, c, r, col, o), o);
    // limb: a capsule from a (radius r0) to b (radius r1), shaded across its width
    const limbPaint = (ctx, a, b, r0, r1, col) => {
      const pa = proj(a), pb = proj(b); if (pa[2] < 0.25 || pb[2] < 0.25) return;
      const s0 = (F * r0) / pa[2], s1 = (F * r1) / pb[2];
      let dx = pb[0] - pa[0], dy = pb[1] - pa[1]; const L = Math.hypot(dx, dy);
      if (L < 0.5) { ballPaint(ctx, a, Math.max(r0, r1), col); return; }
      dx /= L; dy /= L; const nx = -dy, ny = dx, an = Math.atan2(ny, nx);
      ctx.beginPath(); ctx.moveTo(pa[0] + nx * s0, pa[1] + ny * s0); ctx.lineTo(pb[0] + nx * s1, pb[1] + ny * s1);
      ctx.arc(pb[0], pb[1], s1, an, an - Math.PI, true); ctx.lineTo(pa[0] - nx * s0, pa[1] - ny * s0); ctx.arc(pa[0], pa[1], s0, an - Math.PI, an - 2 * Math.PI, true); ctx.closePath();
      const sd = nx * Lscr[0] + ny * Lscr[1] >= 0 ? 1 : -1, R = Math.max(s0, s1), mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2;
      const g = ctx.createLinearGradient(mx + nx * sd * R, my + ny * sd * R, mx - nx * sd * R, my - ny * sd * R);
      g.addColorStop(0, rgb(col.map((v, i) => v * WARM[i] * 1.12))); g.addColorStop(0.4, rgb(col.map((v) => v * 0.97))); g.addColorStop(0.78, rgb(col.map((v, i) => v * 0.7 * COOL[i]))); g.addColorStop(1, rgb(col.map((v, i) => v * 0.52 * COOL[i])));
      ctx.fillStyle = g; ctx.fill();
    };
    const limb = (a, b, r0, r1, col, o = {}) => push((depth(a) + depth(b)) / 2, (ctx) => limbPaint(ctx, a, b, r0, r1, col), o);

    // ---- faceted primitives (furniture, props, hair) ----
    // polygon faces with outward normals, culled and flat shaded with a soft light-to-shade gradient
    const paintFaces = (ctx, fs) => {
      const vis = [];
      for (const f of fs) {
        const sp = f.pts.map(proj); if (sp.some((q) => q[2] < 0.25)) continue;
        const cen = mul(f.pts.reduce((s, q) => add(s, q), [0, 0, 0]), 1 / f.pts.length), toE = norm(sub(E, cen));
        if (dot(f.n, toE) <= 0.0005 && !f.two) continue;
        const n = dot(f.n, toE) < 0 ? mul(f.n, -1) : f.n;
        vis.push({ f, sp, z: sp.reduce((s, q) => s + q[2], 0) / sp.length, c: faceCol(f.col, n, toE, f.gloss) });
      }
      vis.sort((a, b) => b.z - a.z);
      for (const { f, sp, c } of vis) {
        let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
        for (const q of sp) { if (q[0] < mnx) mnx = q[0]; if (q[0] > mxx) mxx = q[0]; if (q[1] < mny) mny = q[1]; if (q[1] > mxy) mxy = q[1]; }
        if (mxx < -40 || mnx > W + 40 || mxy < -40 || mny > H_ + 40) continue;
        ctx.beginPath(); sp.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
        const rr = Math.max(mxx - mnx, mxy - mny) / 2, gx = (mnx + mxx) / 2, gy = (mny + mxy) / 2;
        if (rr > 8) { const g = ctx.createLinearGradient(gx + Lscr[0] * rr, gy + Lscr[1] * rr, gx - Lscr[0] * rr, gy - Lscr[1] * rr); g.addColorStop(0, rgb(shade(c, 1.06))); g.addColorStop(1, rgb(shade(c, 0.9))); ctx.fillStyle = g; } else ctx.fillStyle = rgb(c);
        ctx.fill(); ctx.strokeStyle = rgb(shade(c, 0.97)); ctx.lineWidth = 0.8; ctx.stroke();
        if (f.paint) { const [p0, p1, p3] = f.map.map(proj), cw = 400, ch = 400 * (Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / Math.max(1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]))); if (ch > 2 && ch < 5000) { ctx.save(); ctx.clip(); ctx.setTransform((p1[0] - p0[0]) / cw, (p1[1] - p0[1]) / cw, (p3[0] - p0[0]) / ch, (p3[1] - p0[1]) / ch, p0[0], p0[1]); f.paint(ctx, cw, ch); ctx.restore(); } }
      }
    };
    // rounded box: half-extents w,h,d, chamfered by bevel (fraction of the smallest extent); T maps local -> world; paint on +z
    const rboxFaces = (T, w, h, d, col, o = {}) => {
      const b = Math.min(w, h, d) * (o.bevel ?? 0.25), iw = w - b, ih = h - b, id = d - b, k = (x, y, z) => T([x, y, z]), C = T([0, 0, 0]), fs = [];
      const F2 = (pts, ex = {}) => { const cen = mul(pts.reduce((s, q) => add(s, q), [0, 0, 0]), 1 / pts.length); let n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))); if (dot(n, sub(cen, C)) < 0) n = mul(n, -1); fs.push({ pts, n, col: ex.col || col, gloss: o.gloss, ...ex }); };
      for (const s of [-1, 1]) {
        F2([k(s * w, -ih, -id), k(s * w, ih, -id), k(s * w, ih, id), k(s * w, -ih, id)]);
        F2([k(-iw, s * h, -id), k(iw, s * h, -id), k(iw, s * h, id), k(-iw, s * h, id)], s > 0 && o.topPaint ? { map: [k(-iw, h, -id), k(iw, h, -id), k(-iw, h, id)], paint: o.topPaint } : {});
        F2([k(-iw, -ih, s * d), k(iw, -ih, s * d), k(iw, ih, s * d), k(-iw, ih, s * d)], s > 0 && o.paint ? { map: [k(-iw, ih, d), k(iw, ih, d), k(-iw, -ih, d)], paint: o.paint } : {});
      }
      if (b > 1e-4) for (const a of [-1, 1]) for (const c of [-1, 1]) {
        F2([k(a * w, c * ih, -id), k(a * iw, c * h, -id), k(a * iw, c * h, id), k(a * w, c * ih, id)]);
        F2([k(a * w, -ih, c * id), k(a * w, ih, c * id), k(a * iw, ih, c * d), k(a * iw, -ih, c * d)]);
        F2([k(-iw, a * h, c * id), k(iw, a * h, c * id), k(iw, a * ih, c * d), k(-iw, a * ih, c * d)]);
        for (const e of [-1, 1]) F2([k(a * w, c * ih, e * id), k(a * iw, c * h, e * id), k(a * iw, c * ih, e * d)]);
      }
      return fs;
    };
    const rbox = (T, w, h, d, col, o = {}) => { const fs = rboxFaces(T, w, h, d, col, o); push(depth(T([0, 0, 0])), (ctx) => paintFaces(ctx, fs), o); };
    // cylinder along local y
    const cyl = (T, r, h, col, n = 18, o = {}) => {
      const C = T([0, h / 2, 0]), ring = (y) => Array.from({ length: n }, (_, i) => { const a = (i / n) * TAU; return T([Math.cos(a) * r * (y > 0 ? (o.top ?? 1) : 1), y, Math.sin(a) * r * (y > 0 ? (o.top ?? 1) : 1)]); });
      const A = ring(0), B = ring(h), fs = [];
      for (let i = 0; i < n; i++) { const j = (i + 1) % n, pts = [A[i], A[j], B[j], B[i]], cen = mul(pts.reduce((s, q) => add(s, q), [0, 0, 0]), 0.25); let nn = norm(sub(cen, C)); nn = norm([nn[0], 0, nn[2]].map((v, ii) => v + (ii === 1 ? 0 : 0))); fs.push({ pts, n: norm(sub(cen, T([0, (cen[1] - T([0, 0, 0])[1]), 0]))), col: o.stripes ? (i % 2 ? o.stripes : col) : col }); }
      const top = norm(sub(T([0, 1, 0]), T([0, 0, 0]))); fs.push({ pts: B, n: top, col: o.cap || col, paint: o.capPaint, map: o.capPaint ? [B[Math.round(n * 0.625) % n], B[Math.round(n * 0.875) % n], B[Math.round(n * 0.375) % n]] : null });
      push(depth(C), (ctx) => paintFaces(ctx, fs), o);
    };
    // a flat quad (walls, floor, rugs, pictures): near-plane clipped; fill = colour or paint(ctx, w, h)
    const quad = (pts, col, o = {}) => {
      const cen = mul(pts.reduce((s, q) => add(s, q), [0, 0, 0]), 1 / pts.length);
      push(o.z ?? depth(cen), (ctx) => {
        let poly = pts.map((q) => ({ q, z: depth(q) })); const NZ = 0.3, out = [];
        for (let i = 0; i < poly.length; i++) { const A = poly[i], B = poly[(i + 1) % poly.length]; if (A.z >= NZ) out.push(A.q); if ((A.z >= NZ) !== (B.z >= NZ)) { const u = (NZ - A.z) / (B.z - A.z); out.push(add(A.q, mul(sub(B.q, A.q), u))); } }
        if (out.length < 3) return; const sp = out.map(proj);
        ctx.beginPath(); sp.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
        let n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))); const toE = norm(sub(E, cen)); if (dot(n, toE) < 0) n = mul(n, -1);
        ctx.fillStyle = rgb(o.flat ? col : faceCol(col, n, toE, 0.02)); ctx.fill();
        if (o.paint) { const [p0, p1, p3] = [pts[0], pts[1], pts[3]].map(proj), cw = 400, ch = 400 * (Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / Math.max(1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]))); if (ch > 2 && ch < 6000 && p0[2] > 0.3 && p1[2] > 0.3 && p3[2] > 0.3) { ctx.save(); ctx.clip(); ctx.setTransform((p1[0] - p0[0]) / cw, (p1[1] - p0[1]) / cw, (p3[0] - p0[0]) / ch, (p3[1] - p0[1]) / ch, p0[0], p0[1]); o.paint(ctx, cw, ch); ctx.restore(); } }
      }, o);
    };
    // soft contact shadow on a horizontal surface at height c[1]
    const shadow = (c, rx, rz, a = 0.4, o = {}) => push(depth(c) + 0.3, (ctx) => {
      const pts = Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * TAU; return proj([c[0] + Math.cos(t) * rx, c[1] + 0.004, c[2] + Math.sin(t) * rz]); });
      if (pts.some((q) => q[2] < 0.3)) return; const cp = proj([c[0], c[1], c[2]]), R = Math.max(...pts.map((q) => Math.hypot(q[0] - cp[0], q[1] - cp[1])));
      const g = ctx.createRadialGradient(cp[0], cp[1], 0, cp[0], cp[1], R); g.addColorStop(0, `rgba(20,14,30,${a})`); g.addColorStop(0.6, `rgba(20,14,30,${a * 0.5})`); g.addColorStop(1, 'rgba(20,14,30,0)');
      ctx.fillStyle = g; ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill();
    }, o);

    // ---- the character: a soft mannequin doll ----
    // x,y,z: the hip root (sitting: on the seat). yaw: facing (0 = towards +z, the camera side). o: see below.
    //   kind 'boy' | 'girl', shirt, pants, hair colours, s (scale)
    //   arms: [[fwd, out, bend], [fwd, out, bend]] for left (-x) and right (+x) arms, radians
    //   legs: [[pitch, bend], [pitch, bend]] (sitting ~ [1.45, 1.4]; standing [0, 0])
    //   lean (torso forward), head: { yaw, pitch, tilt }, face: { eyes, look:[dx,dy], brows, mouth, blush, lids }
    //   hold: { R: (S, hand, dir) => {} } draws a prop in a hand
    const doll = (x, y, z, yaw, o = {}) => {
      const s = o.s || 1, girl = o.kind === 'girl';
      const shirt = o.shirt || (girl ? P.red : P.mustard), pants = o.pants || P.navy, skin = o.skin || P.skin, hair = o.hair || (girl ? P.hairGirl : P.hairBoy);
      const lean = o.lean || 0, root = [x, y, z];
      const W0 = (p) => add(rotY(mul(p, s), yaw), root); // body-local -> world
      const Tor = (p) => W0(rotX(p, lean)); // torso-local (leans about the hip)
      // pelvis and legs
      ball(W0([0, 0.02, 0]), [0.27 * s, 0.16 * s, 0.22 * s], pants, { rim: false });
      const legs = o.legs || [[0, 0], [0, 0]];
      [-1, 1].forEach((sd, i) => {
        const [pt, bd] = legs[i], H0 = [sd * 0.14, -0.02, 0.02];
        const d1 = rotX([0, -1, 0], -pt), d2 = rotX([0, -1, 0], -(pt - bd)), K = add(H0, mul(d1, 0.46)), A = add(K, mul(d2, 0.44));
        limb(W0(H0), W0(K), 0.125 * s, 0.1 * s, pants); ball(W0(K), 0.1 * s, pants, { rim: false }); limb(W0(K), W0(A), 0.095 * s, 0.08 * s, pants);
        const toe = add(A, rotX([0, -0.04, 0.17], 0)); limb(W0(add(A, [0, -0.03, -0.03])), W0(toe), 0.075 * s, 0.07 * s, o.shoe || P.shoe);
      });
      // torso: two puffy pads (chest and belly), shoulders
      ball(Tor([0, 0.2, 0]), [0.29 * s, 0.2 * s, 0.22 * s], shirt, { rim: false });
      ball(Tor([0, 0.44, 0]), [0.33 * s, 0.24 * s, 0.24 * s], shirt);
      limb(Tor([0, 0.6, 0]), Tor([0, 0.7, 0.01]), 0.095 * s, 0.09 * s, skin); // neck
      // arms
      const arms = o.arms || [[0.1, 0.12, 0.2], [0.1, 0.12, 0.2]], hands = [];
      [-1, 1].forEach((sd, i) => {
        const [fw, ot, bd] = arms[i], S0 = [sd * 0.33, 0.56, 0];
        const d1 = rotZ(rotX([0, -1, 0], -fw), sd * ot), d2 = rotZ(rotX([0, -1, 0], -(fw + bd)), sd * ot);
        const El = add(S0, mul(d1, 0.32)), Wr = add(El, mul(d2, 0.3)), Hd = add(Wr, mul(d2, 0.11));
        ball(Tor(S0), 0.118 * s, shirt); limb(Tor(S0), Tor(El), 0.12 * s, 0.1 * s, shirt); ball(Tor(El), 0.098 * s, shirt, { rim: false });
        limb(Tor(El), Tor(Wr), 0.095 * s, 0.085 * s, shirt); ball(Tor(Wr), 0.06 * s, skin, { rim: false });
        limb(Tor(add(Wr, mul(d2, 0.04))), Tor(Hd), 0.07 * s, 0.062 * s, skin); // mitten hand
        ball(Tor(add(Wr, add(mul(d2, 0.07), [sd * -0.05, 0, 0.04]))), 0.035 * s, skin, { rim: false }); // thumb
        hands.push({ p: Tor(Hd), dir: norm(sub(Tor(Hd), Tor(Wr))) });
      });
      if (o.hold) Object.entries(o.hold).forEach(([k, fn]) => fn(api, hands[k === 'L' ? 0 : 1].p, hands[k === 'L' ? 0 : 1].dir));
      // head
      const hd = o.head || {}, hc = Tor([0, 0.93, 0.03]), hy = yaw + (hd.yaw || 0);
      const Rh = (p) => add(rotY(rotX(rotZ(p, hd.tilt || 0), (hd.pitch || 0) - lean * 0.5), hy), [0, 0, 0]);
      const HR = [0.27 * s, 0.3 * s, 0.26 * s], HW = (p) => add(hc, Rh(p));
      // ears
      [-1, 1].forEach((sd) => ball(HW([sd * 0.255 * s, -0.02 * s, -0.02 * s]), [0.038 * s, 0.055 * s, 0.035 * s], skin, { rim: false, bias: 0.04 }));
      push(depth(hc), (ctx) => { const r = ballPaint(ctx, hc, HR, skin, { gloss: 0.08 }); if (r) faceDecals(ctx, Rh, hc, HR, o.face || {}, girl); });
      hairMesh(Rh, hc, HR, s, girl, hair, o.hairStyle);
      return { hands, head: hc, headR: HR[1], Rh };
    };
    // a feature drawn in a small affine frame lying on the head surface; unit circle = (sx, sy)
    const decal = (ctx, Rh, hc, HR, u, v, sx, sy, fn) => {
      const [rx, ry, rz] = HR, zz = rz * Math.sqrt(Math.max(0.02, 1 - u * u - v * v)), lp = [u * rx, v * ry, zz];
      const nl = norm([lp[0] / (rx * rx), lp[1] / (ry * ry), lp[2] / (rz * rz)]), nw = Rh(nl), c = add(hc, Rh(lp));
      if (dot(nw, norm(sub(E, c))) < 0.05) return;
      const t1 = norm(cross([0, 1, 0], nl)), t2 = cross(nl, t1);
      const pc = proj(add(c, mul(nw, 0.004))), px = proj(add(add(c, mul(nw, 0.004)), Rh(mul(t1, sx)))), py = proj(add(add(c, mul(nw, 0.004)), Rh(mul(t2, -sy))));
      ctx.save(); ctx.transform(px[0] - pc[0], px[1] - pc[1], py[0] - pc[0], py[1] - pc[1], pc[0], pc[1]); fn(ctx); ctx.restore();
    };
    const faceDecals = (ctx, Rh, hc, HR, f, girl) => {
      const eyes = f.eyes || 'open', look = f.look || [0, 0], br = f.brows ?? 0, ink = '#2a201e';
      // nose: a soft bump
      decal(ctx, Rh, hc, HR, 0, -0.12, 0.045, 0.055, (c) => { const g = c.createRadialGradient(-0.3, -0.4, 0.1, 0, 0.2, 1.2); g.addColorStop(0, 'rgba(255,228,205,0.4)'); g.addColorStop(0.6, 'rgba(236,190,150,0)'); g.addColorStop(1, 'rgba(130,80,60,0.22)'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); });
      if (f.blush) [-1, 1].forEach((sd) => decal(ctx, Rh, hc, HR, sd * 0.5, -0.25, 0.08, 0.05, (c) => { const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, `rgba(240,90,110,${0.45 * f.blush})`); g.addColorStop(1, 'rgba(240,90,110,0)'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); }));
      [-1, 1].forEach((sd) => {
        const u = sd * 0.35, v = 0.05, big = eyes === 'wide' ? 1.15 : 1;
        decal(ctx, Rh, hc, HR, u, v, 0.064 * big, 0.08 * big, (c) => {
          c.lineCap = 'round';
          if (eyes === 'happy' || eyes === 'closed') { // closed: a dark arc (happy curves up)
            c.strokeStyle = ink; c.lineWidth = 0.28; c.beginPath(); if (eyes === 'happy') c.arc(0, 0.25, 0.75, Math.PI * 1.15, Math.PI * 1.85); else c.arc(0, -0.5, 0.85, Math.PI * 0.2, Math.PI * 0.8); c.stroke(); return;
          }
          const g = c.createRadialGradient(-0.3, -0.35, 0.1, 0, 0, 1.05); g.addColorStop(0, '#ffffff'); g.addColorStop(0.75, '#f2efe9'); g.addColorStop(1, '#c9c2bb');
          c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill();
          c.save(); c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.clip();
          const ix = look[0] * 0.38, iy = -look[1] * 0.38 + 0.05, ir = eyes === 'wide' ? 0.5 : 0.62;
          c.fillStyle = f.iris || (girl ? '#3f5e3c' : '#4a3222'); c.beginPath(); c.arc(ix, iy, ir, 0, TAU); c.fill();
          c.fillStyle = '#120c0c'; c.beginPath(); c.arc(ix, iy, ir * 0.62, 0, TAU); c.fill();
          c.fillStyle = 'rgba(255,255,255,0.95)'; c.beginPath(); c.arc(ix - ir * 0.38, iy - ir * 0.42, ir * 0.3, 0, TAU); c.fill();
          c.beginPath(); c.arc(ix + ir * 0.35, iy + ir * 0.35, ir * 0.12, 0, TAU); c.fill();
          if (f.lids) { c.fillStyle = 'rgb(222,176,138)'; c.fillRect(-1.2, -1.2, 2.4, 2.4 * f.lids * 0.5 + 0.0); c.strokeStyle = ink; c.lineWidth = 0.12; c.beginPath(); c.moveTo(-1.1, -1.2 + 2.4 * f.lids * 0.5); c.lineTo(1.1, -1.2 + 2.4 * f.lids * 0.5); c.stroke(); }
          c.restore();
          c.strokeStyle = 'rgba(60,40,36,0.35)'; c.lineWidth = 0.06; c.beginPath(); c.arc(0, 0, 1, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
        });
        // brow: a thick rounded dash; br > 0 = worried (inner end up), br < 0 = cross
        decal(ctx, Rh, hc, HR, sd * 0.37, 0.34, 0.07, 0.07, (c) => { c.strokeStyle = ink; c.lineCap = 'round'; c.lineWidth = 0.4; c.beginPath(); c.moveTo(-0.7, -sd * br * 0.45); c.lineTo(0.7, sd * br * 0.45); c.stroke(); });
      });
      const m = f.mouth || 'smile';
      decal(ctx, Rh, hc, HR, 0, -0.44, 0.1, 0.07, (c) => {
        c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#6a2a26'; c.lineWidth = 0.22;
        if (m === 'smile') { c.beginPath(); c.arc(0, -0.9, 1.0, Math.PI * 0.28, Math.PI * 0.72); c.stroke(); }
        else if (m === 'flat') { c.beginPath(); c.moveTo(-0.55, 0); c.lineTo(0.55, 0.05); c.stroke(); }
        else if (m === 'frown') { c.beginPath(); c.arc(0, 1.0, 0.9, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); }
        else if (m === 'o' || m === 'yawn' || m === 'open') {
          const rx = m === 'yawn' ? 0.62 : m === 'open' ? 0.75 : 0.32, ry = m === 'yawn' ? 1.15 : m === 'open' ? 0.55 : 0.36;
          c.fillStyle = '#4a1c1c'; c.beginPath(); if (m === 'open') { c.moveTo(-rx, -0.2); c.quadraticCurveTo(0, -0.05, rx, -0.2); c.quadraticCurveTo(rx * 0.7, ry + 0.2, 0, ry); c.quadraticCurveTo(-rx * 0.7, ry + 0.2, -rx, -0.2); } else c.ellipse(0, ry * 0.4, rx, ry, 0, 0, TAU); c.fill();
          if (m !== 'o') { c.fillStyle = '#d8606a'; c.beginPath(); c.ellipse(0, m === 'yawn' ? ry * 1.0 : ry * 0.65, rx * 0.6, ry * 0.35, 0, 0, TAU); c.fill(); }
          if (m === 'open') { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(-rx * 0.85, -0.15); c.quadraticCurveTo(0, 0, rx * 0.85, -0.15); c.lineTo(rx * 0.7, 0.1); c.quadraticCurveTo(0, 0.2, -rx * 0.7, 0.1); c.closePath(); c.fill(); }
        }
      });
    };
    // hair as a faceted cap over the head (low-poly look), plus spikes (boy) or a ponytail (girl)
    const hairMesh = (Rh, hc, HR, s, girl, col, style) => {
      const [rx, ry, rz] = HR, k = girl ? 1.08 : 1.06, fs = [], NU = 32, NV = 24; /* fine grid: the cap is drawn smooth, the grid only shapes the hairline */
      const P3 = (th, ph) => { const l = [Math.cos(ph) * Math.sin(th) * rx * k, Math.sin(ph) * ry * k, Math.cos(ph) * Math.cos(th) * rz * k]; return l; };
      const covered = (th, ph) => { const front = Math.cos(th), side = Math.abs(Math.sin(th)), sp = Math.sin(ph); if (girl) { if (front > 0.2) { const fringe = 0.5 - 0.25 * Math.max(0, Math.sin(th + 0.5)); return side > 0.62 ? sp > -0.45 : sp > fringe; } return sp > -0.85; } return front > 0.2 ? sp > 0.66 - 0.55 * Math.max(0, side - 0.3) : sp > -0.3; };
      for (let i = 0; i < NU; i++) for (let j = 0; j < NV; j++) {
        const th0 = (i / NU) * TAU, th1 = ((i + 1) / NU) * TAU, ph0 = -Math.PI / 2 + (j / NV) * Math.PI, ph1 = -Math.PI / 2 + ((j + 1) / NV) * Math.PI;
        if (!covered((th0 + th1) / 2, (ph0 + ph1) / 2)) continue;
        const q = [P3(th0, ph0), P3(th1, ph0), P3(th1, ph1), P3(th0, ph1)].map((l) => add(hc, Rh(l)));
        const n = norm(sub(mul(add(q[0], q[2]), 0.5), hc)); fs.push({ pts: q, n, col, gloss: 0.18, up: Math.sin((ph0 + ph1) / 2) });
      }
      if (!girl && style !== 'flat') { // spikes: flat-shaded paper-sharp tufts
        const r = H.rng(7);
        for (let i = 0; i < 16; i++) { // two rings: a fringe row and the crown (side spikes read as a unibrow from the front)
          const ring = i < 9 ? 0 : i < 16 ? 1 : 2, kk = ring === 0 ? i : ring === 1 ? i - 9 : i - 16, nn = ring === 0 ? 9 : ring === 1 ? 7 : 6;
          const th = (ring === 0 ? -1.3 + (kk / (nn - 1)) * 2.6 : ring === 1 ? -2.4 + (kk / (nn - 1)) * 4.8 : Math.PI - 0.9 + (kk / (nn - 1)) * 1.8) + r.range(-0.1, 0.1);
          const ph = ring === 0 ? 0.9 : ring === 1 ? 1.15 : 0.4;
          const base = P3(th, ph), nrm = norm([base[0] / rx, base[1] / ry, base[2] / rz]), tip = add(base, mul(norm(add(mul(nrm, ring === 0 ? 0.45 : 1), [0, ring === 2 ? 0.15 : 0.9, ring === 0 ? -0.25 : 0])), 0.15 * s * r.range(0.85, 1.25)));
          const side = mul(norm(cross(nrm, [0, 1, 0.2])), 0.1 * s), a = add(base, side), b = sub(base, side), back = sub(base, mul(nrm, 0.05));
          const A = [a, tip, back].map((l) => add(hc, Rh(l))), B = [back, tip, b].map((l) => add(hc, Rh(l)));
          [A, B].forEach((tri, h) => { const n = norm(cross(sub(tri[1], tri[0]), sub(tri[2], tri[0]))); fs.push({ pts: tri, n, col: shade(col, h ? 0.9 : 1.05), two: true }); });
        }
      }
      if (girl) { const pt = add(hc, Rh([0, 0.08 * s, -rz * 1.15])); ball(pt, [0.14 * s, 0.17 * s, 0.13 * s], col, { gloss: 0.18 }); }
      const cap = fs.filter((f) => !f.two), spikes = fs.filter((f) => f.two);
      push(depth(hc) - 0.02, (ctx) => {
        // the cap: a smooth hair-coloured ellipsoid, clipped to the covered patches (so the hairline stays crisp)
        ctx.save(); ctx.beginPath(); let any = false;
        for (const f of cap) { const sp = f.pts.map(proj); if (sp.some((q) => q[2] < 0.25)) continue; const cen = mul(f.pts.reduce((a2, q) => add(a2, q), [0, 0, 0]), 0.25); if (dot(f.n, norm(sub(E, cen))) < (f.up > 0.3 ? -0.22 : 0)) continue; /* keep faces near the silhouette, or the crown drops out when the camera is near head height */ any = true; let ar = 0; for (let i = 0; i < sp.length; i++) { const q = sp[i], r2 = sp[(i + 1) % sp.length]; ar += q[0] * r2[1] - r2[0] * q[1]; } const ord = ar < 0 ? sp.slice().reverse() : sp; /* one winding for every patch, so the nonzero union never cancels */ ord.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); }
        if (any) { ctx.lineJoin = 'round'; ctx.strokeStyle = rgb(shade(col, 0.8)); ctx.lineWidth = 1.2; ctx.clip(); ballPaint(ctx, hc, [rx * k, ry * k, rz * k], col, { gloss: 0.22 });
          // a few soft strands catching the light
          const p = proj(hc), R = (F * ry) / p[2]; ctx.strokeStyle = girl ? 'rgba(255,230,200,0.05)' : 'rgba(255,230,200,0.08)'; ctx.lineWidth = R * 0.04; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(p[0] + i * R * 0.18, p[1] + R * 0.5, R * 1.2, Math.PI * 1.25, Math.PI * 1.55); ctx.stroke(); } }
        ctx.restore();
        if (spikes.length) paintFaces(ctx, spikes);
      });
    };

    // ---- render ----
    const render = (ctx, Wd, Ht, env = {}) => {
      ctx.fillStyle = env.bg || rgb(P.wall); ctx.fillRect(0, 0, Wd, Ht);
      const focus = env.focus ?? depth(TG), far = [], near = [];
      for (const it of items) ((it.bg || it.z > focus + (env.dofGap ?? 1.4)) && env.dof !== 0 ? far : near).push(it);
      far.sort((a, b) => b.z - a.z); near.sort((a, b) => b.z - a.z);
      if (far.length) {
        const L = VXC.farL || (VXC.farL = H.layer(Wd, Ht)), lc = L.getContext('2d', { willReadFrequently: true });
        lc.setTransform(1, 0, 0, 1, 0, 0); lc.fillStyle = env.bg || rgb(P.wall); lc.fillRect(0, 0, Wd, Ht);
        for (const it of far) it.draw(lc);
        const k = env.dof ?? 0.25, sw = Math.max(8, Math.round(Wd * k)), sh = Math.max(8, Math.round(Ht * k));
        let Sm = VXC['sm' + sw]; if (!Sm) Sm = VXC['sm' + sw] = H.layer(sw, sh);
        const sc = Sm.getContext('2d', { willReadFrequently: true }); sc.imageSmoothingEnabled = true; sc.imageSmoothingQuality = 'high'; sc.clearRect(0, 0, sw, sh); sc.drawImage(L, 0, 0, sw, sh);
        ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(Sm, 0, 0, Wd, Ht); ctx.restore();
      }
      for (const it of near) it.draw(ctx);
    };
    const api = { proj, depth, ball, limb, rbox, cyl, quad, shadow, doll, push, render, E, TG, F, items, Lk };
    return api;
  };

  // ==================== sets ====================
  // a framed landscape painting (pale sky, sun, green hills) as seen on the source's walls
  const landscape = (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#dfe6e6'); g.addColorStop(1, '#eef0e6'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#f2b54a'; c.beginPath(); c.arc(w * 0.62, h * 0.3, h * 0.12, 0, TAU); c.fill();
    c.fillStyle = '#4f8a3c'; c.beginPath(); c.moveTo(w * 0.05, h); c.lineTo(w * 0.38, h * 0.42); c.lineTo(w * 0.72, h); c.fill();
    c.fillStyle = '#6aa64a'; c.beginPath(); c.moveTo(w * 0.42, h); c.lineTo(w * 0.7, h * 0.5); c.lineTo(w * 1.02, h); c.fill();
  };
  const popArt = (c, w, h) => { c.fillStyle = '#f0b24a'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8483a'; c.fillRect(w * 0.12, h * 0.52, w * 0.36, h * 0.48); c.fillRect(w * 0.52, h * 0.52, w * 0.36, h * 0.48); c.fillStyle = '#5a3a2a'; c.beginPath(); c.arc(w * 0.3, h * 0.36, w * 0.14, 0, TAU); c.arc(w * 0.7, h * 0.36, w * 0.14, 0, TAU); c.fill(); };
  // the living room: sage wall with art and a shelf, wood floor, terracotta rug, navy-violet couch, coffee table
  const livingRoom = (S, o = {}) => {
    const WZ = -1.25;
    S.quad([[-7, 0, WZ], [7, 0, WZ], [7, 4.2, WZ], [-7, 4.2, WZ]], P.wall, { bg: true, z: 99, paint: (c, w, h) => { // the wall: a warm lamp pool and soft falloff
      const g = c.createRadialGradient(w * 0.38, h * 0.55, 10, w * 0.4, h * 0.6, w * 0.4); g.addColorStop(0, 'rgba(255,214,150,0.3)'); g.addColorStop(1, 'rgba(255,214,150,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(30,26,40,0.18)'; c.fillRect(0, h * 0.97, w, h * 0.03); } });
    S.quad([[-7, 0, WZ], [7, 0, WZ], [7, 0, 9], [-7, 0, 9]], P.floor, { bg: false, z: 98, paint: (c, w, h) => { for (let i = 0; i < 28; i++) { c.fillStyle = i % 2 ? 'rgba(0,0,0,0.05)' : 'rgba(255,230,200,0.04)'; c.fillRect((i * w) / 28, 0, w / 28, h); } } });
    S.quad([[-2.6, 0.003, -0.3], [2.6, 0.003, -0.3], [2.6, 0.003, 2.8], [-2.6, 0.003, 2.8]], P.rug, { z: 97, paint: (c, w, h) => { c.strokeStyle = 'rgba(255,220,190,0.45)'; c.lineWidth = 8; c.strokeRect(22, 22 * h / w, w - 44, h - 44 * h / w); c.strokeStyle = 'rgba(120,30,24,0.4)'; c.lineWidth = 3; c.strokeRect(40, 40 * h / w, w - 80, h - 80 * h / w); } });
    // art and shelf on the wall (background, softened by depth of field)
    S.rbox((p) => add(p, [0.95, 2.05, WZ + 0.03]), 0.62, 0.45, 0.03, P.frame, { bevel: 0.3, bg: true, paint: (c, w, h) => { c.fillStyle = '#eae4d8'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * 0.07, h * 0.08); landscape(c, w * 0.86, h * 0.84); c.restore(); } });
    S.rbox((p) => add(p, [2.45, 1.95, WZ + 0.03]), 0.3, 0.38, 0.03, P.frame, { bevel: 0.3, bg: true, paint: (c, w, h) => { c.save(); c.translate(w * 0.1, h * 0.08); popArt(c, w * 0.8, h * 0.84); c.restore(); } });
    S.rbox((p) => add(p, [-1.75, 1.9, WZ + 0.14]), 0.62, 0.035, 0.14, P.wood, { bevel: 0.3, bg: true });
    const bc = [[180, 60, 50], [60, 90, 150], [220, 180, 80], [80, 130, 90], [150, 70, 120], [230, 120, 60]];
    for (let i = 0; i < 9; i++) S.rbox((p) => add(rotZ(p, i === 8 ? -0.3 : 0), [-2.25 + i * 0.1 + (i === 8 ? 0.05 : 0), 2.07 - (i % 3) * 0.02, WZ + 0.14]), 0.04, 0.15 - (i % 3) * 0.02, 0.1, bc[i % 6], { bevel: 0.2, bg: true });
    // low-poly plant in a pot (left)
    S.cyl((p) => add(p, [-2.35, 0, WZ + 0.45]), 0.22, 0.42, [196, 112, 72], 12, { top: 1.15, bg: o.plantBg !== false });
    const r = H.rng(31); for (let i = 0; i < 9; i++) S.ball([-2.35 + r.range(-0.3, 0.3), 0.75 + r.range(0, 0.7), WZ + 0.45 + r.range(-0.2, 0.2)], 0.2 + r.range(0, 0.12), [70 + r.range(0, 30), 128 + r.range(0, 40), 64], { bg: o.plantBg !== false, rim: false });
    if (o.couch !== false) couch(S, 0, WZ + 0.55);
    if (o.table) coffeeTable(S, 0, 1.15);
  };
  const couch = (S, x, z) => {
    const C = P.couch, T = (ox, oy, oz) => (p) => add(p, [x + ox, oy, z + oz]);
    S.rbox(T(0, 0.24, 0), 1.75, 0.2, 0.48, shade(C, 0.92), { bevel: 0.35, bias: 0.6 }); // base
    S.rbox(T(0, 0.62, -0.38), 1.6, 0.34, 0.12, C, { bevel: 0.45, bias: 0.7 }); // back
    [-1, 1].forEach((sd) => { S.rbox(T(sd * 0.81, 0.5, 0.04), 0.79, 0.075, 0.42, C, { bevel: 0.6, bias: 0.5 }); S.rbox(T(sd * 0.8, 0.82, -0.22), 0.76, 0.24, 0.1, shade(C, 1.04), { bevel: 0.7, bias: 0.62 }); });
    [-1, 1].forEach((sd) => S.rbox(T(sd * 1.72, 0.52, 0.02), 0.16, 0.25, 0.5, C, { bevel: 0.6 }));
  };
  const coffeeTable = (S, x, z) => {
    S.rbox((p) => add(p, [x, 0.36, z]), 0.95, 0.04, 0.38, P.wood, { bevel: 0.3 });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => S.rbox((p) => add(p, [x + a * 0.85, 0.17, z + b * 0.3]), 0.035, 0.17, 0.035, shade(P.wood, 0.8), { bevel: 0.2 }));
    S.shadow([x, 0, z], 1.0, 0.45, 0.35);
  };
  // the night exterior: a little house with warm windows under a deep violet sky
  const nightStreet = (ctx, S, t, lightsOn = 1) => {
    S.quad([[-9, 0, -6], [9, 0, -6], [9, 0, 9], [-9, 0, 9]], [46, 52, 70], { z: 98 });
    S.quad([[-9, 0.002, 1.2], [9, 0.002, 1.2], [9, 0.002, 2.6], [-9, 0.002, 2.6]], [38, 40, 52], { z: 97, paint: (c, w, h) => { c.fillStyle = 'rgba(240,230,190,0.5)'; for (let x = 0; x < w; x += 46) c.fillRect(x, h * 0.48, 24, h * 0.04); } });
    const win = (c, w, h) => { c.fillStyle = lightsOn > 0 ? `rgba(255,${200 + 20 * lightsOn},120,${0.25 + 0.75 * lightsOn})` : '#2a2e48'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(60,40,30,0.85)'; c.fillRect(w * 0.47, 0, w * 0.06, h); c.fillRect(0, h * 0.47, w, h * 0.06); };
    S.rbox((p) => add(p, [0, 0.8, -1.5]), 1.5, 0.8, 1.1, [214, 200, 180], { bevel: 0.04, paint: (c, w, h) => {
      c.fillStyle = '#d6c8b4'; c.fillRect(0, 0, w, h);
      c.save(); c.translate(w * 0.12, h * 0.25); win(c, w * 0.24, h * 0.32); c.restore(); c.save(); c.translate(w * 0.64, h * 0.25); win(c, w * 0.24, h * 0.32); c.restore();
      c.fillStyle = '#3e5a3a'; c.fillRect(w * 0.43, h * 0.38, w * 0.14, h * 0.62); c.fillStyle = '#e8c070'; c.beginPath(); c.arc(w * 0.54, h * 0.7, w * 0.008, 0, TAU); c.fill();
    } });
    const roof = [[-1.7, 1.6, -0.3], [1.7, 1.6, -0.3], [1.7, 2.5, -1.5], [-1.7, 2.5, -1.5]];
    S.quad(roof, [70, 50, 60], {}); S.quad([[-1.7, 1.6, -2.7], [1.7, 1.6, -2.7], [1.7, 2.5, -1.5], [-1.7, 2.5, -1.5]], [60, 44, 54], {});
    S.rbox((p) => add(p, [2.6, 0.38, 1.9]), 0.9, 0.26, 0.42, [70, 90, 150], { bevel: 0.4 }); S.rbox((p) => add(p, [2.55, 0.72, 1.9]), 0.55, 0.16, 0.38, [60, 80, 136], { bevel: 0.5, paint: (c, w, h) => { c.fillStyle = 'rgba(160,200,255,0.55)'; c.fillRect(w * 0.06, h * 0.15, w * 0.88, h * 0.6); } });
    [[2.0, 1.48], [3.2, 1.48], [2.0, 2.32], [3.2, 2.32]].forEach(([a, b]) => S.cyl((p) => add(rotX(p, Math.PI / 2), [a, 0.14, b - 0.05]), 0.14, 0.1, [24, 24, 28], 12));
    S.shadow([2.6, 0, 1.9], 1.1, 0.5, 0.45);
  };
  const nightSky = (ctx, W, H_, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#141836'); g.addColorStop(0.55, '#2c2c66'); g.addColorStop(1, '#4a3c74'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    const r = H.rng(77); for (let i = 0; i < 70; i++) { const a = 0.3 + 0.5 * Math.abs(Math.sin(t * 1.3 + i)); ctx.fillStyle = `rgba(255,255,240,${a * r.range(0.3, 0.9)})`; ctx.fillRect(r.range(0, W), r.range(0, H_ * 0.45), 2, 2); }
  };

  // ==================== 2D cartoon accents ====================
  const FX = {
    // white speed lines rushing in from the frame edges toward (cx, cy)
    speed(ctx, W, H_, cx, cy, u, t, seed = 3) {
      if (u <= 0) return; const r = H.rng(seed + Math.floor(t * 18)); ctx.save(); ctx.fillStyle = `rgba(255,255,255,${0.75 * u})`;
      for (let i = 0; i < 38; i++) { const a = r() * TAU, d0 = r.range(0.55, 0.8) * Math.hypot(W, H_) * 0.5, d1 = d0 + r.range(160, 420), w = r.range(1.5, 5); const ca = Math.cos(a), sa = Math.sin(a); ctx.beginPath(); ctx.moveTo(cx + ca * d0, cy + sa * d0); ctx.lineTo(cx + ca * d1 - sa * w, cy + sa * d1 + ca * w); ctx.lineTo(cx + ca * d1 + sa * w, cy + sa * d1 - ca * w); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    },
    // comic sunburst: alternating warm rays turning slowly, halftone dots, a glow; drawn BEHIND the subject
    burst(ctx, W, H_, cx, cy, u, t) {
      if (u <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, u * 1.4);
      const R = Math.hypot(W, H_), n = 22, a0 = t * 0.25;
      ctx.fillStyle = '#7a6a2c'; ctx.fillRect(0, 0, W, H_);
      for (let i = 0; i < n; i++) { const a = a0 + (i / n) * TAU; ctx.fillStyle = i % 2 ? '#c9a640' : '#9b8636'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.lineTo(cx + Math.cos(a + TAU / n) * R, cy + Math.sin(a + TAU / n) * R); ctx.closePath(); ctx.fill(); }
      const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, W * 0.7); g.addColorStop(0, 'rgba(255,240,170,0.85)'); g.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
      ctx.fillStyle = 'rgba(60,40,10,0.18)'; for (let y = 8; y < H_; y += 16) for (let x = (y / 16) % 2 ? 8 : 0; x < W; x += 16) { const d = Math.hypot(x - cx, y - cy) / R; ctx.beginPath(); ctx.arc(x, y, 1 + d * 4, 0, TAU); ctx.fill(); }
      ctx.restore();
    },
    sparkle(ctx, x, y, s, rot = 0, col = '#fff6c8') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU, r = i % 2 ? s * 0.22 : s; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore(); },
    // a ring drawn on (u 0..1), thick, with a soft shadow; mark: 'x' | 'tick' | null (appears after the ring)
    ring(ctx, x, y, r, col, u, mark) {
      if (u <= 0) return; ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
      ctx.strokeStyle = col; ctx.lineWidth = r * 0.14; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * H.clamp(u * 1.6)); ctx.stroke();
      const m = H.ease.back(H.clamp((u - 0.55) / 0.45));
      if (mark && m > 0) {
        ctx.translate(x, y); ctx.scale(m, m); const k = r * 0.45;
        if (mark === 'x') { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = r * 0.3; ctx.beginPath(); ctx.moveTo(-k, -k); ctx.lineTo(k, k); ctx.moveTo(k, -k); ctx.lineTo(-k, k); ctx.stroke(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = col; ctx.lineWidth = r * 0.18; ctx.stroke(); }
        else { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = r * 0.3; ctx.beginPath(); ctx.moveTo(-k, 0); ctx.lineTo(-k * 0.25, k * 0.7); ctx.lineTo(k, -k * 0.7); ctx.stroke(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = col; ctx.lineWidth = r * 0.18; ctx.stroke(); }
      }
      ctx.restore();
    },
    // a dotted motion trail along screen points, revealed by u, dots growing toward the head of the trail
    dots(ctx, pts, u) {
      if (u <= 0) return; const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
      ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.shadowColor = 'rgba(255,255,255,0.6)'; ctx.shadowBlur = 8;
      for (let s = 0; s <= tot * u; s += 34) { let a = s, i = 0; while (i < L.length && a > L[i]) { a -= L[i]; i++; } if (i >= L.length) break; const k = a / L[i], x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k; ctx.beginPath(); ctx.arc(x, y, 4 + 7 * (s / tot), 0, TAU); ctx.fill(); }
      ctx.restore();
    },
    // a glossy red heart
    heart(ctx, x, y, s, rot = 0, a = 1) {
      if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
      const path = () => { ctx.beginPath(); ctx.moveTo(0, 0.35); ctx.bezierCurveTo(-0.15, 0.2, -0.55, 0.0, -0.5, -0.3); ctx.bezierCurveTo(-0.45, -0.6, -0.08, -0.62, 0, -0.32); ctx.bezierCurveTo(0.08, -0.62, 0.45, -0.6, 0.5, -0.3); ctx.bezierCurveTo(0.55, 0.0, 0.15, 0.2, 0, 0.35); ctx.closePath(); };
      ctx.shadowColor = 'rgba(80,0,20,0.4)'; ctx.shadowBlur = 0.12; ctx.shadowOffsetY = 0.04;
      const g = ctx.createRadialGradient(-0.2, -0.3, 0.02, 0, 0, 0.7); g.addColorStop(0, '#ff7a86'); g.addColorStop(0.5, '#ee2c44'); g.addColorStop(1, '#a8102a'); path(); ctx.fillStyle = g; ctx.fill();
      ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(-0.25, -0.33, 0.1, 0.06, -0.6, 0, TAU); ctx.fill();
      ctx.restore();
    },
    // a chunky white "?" (or "!") with a dark outline
    qmark(ctx, x, y, s, ch = '?', rot = 0.12) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.font = FONT(900, 120); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = '#1c1a22'; ctx.strokeText(ch, 0, 0); ctx.fillStyle = '#ffffff'; ctx.fillText(ch, 0, 0); ctx.restore(); },
    // a blue sweat drop
    sweat(ctx, x, y, s) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const g = ctx.createLinearGradient(-10, -20, 10, 20); g.addColorStop(0, '#d8f2ff'); g.addColorStop(1, '#58a8e8'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -22); ctx.bezierCurveTo(6, -8, 14, 2, 12, 10); ctx.arc(0, 10, 12, 0, Math.PI); ctx.bezierCurveTo(-14, 2, -6, -8, 0, -22); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(-4, 6, 3, 5, 0.3, 0, TAU); ctx.fill(); ctx.restore(); },
    // little curved "sound" lines (a phone buzzing, a yawn, a gasp)
    buzz(ctx, x, y, s, u) { if (u <= 0) return; ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineCap = 'round'; ctx.lineWidth = 5 * s; for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(x, y, (28 + i * 18) * s, sd < 0 ? Math.PI * 0.75 : -Math.PI * 0.25, sd < 0 ? Math.PI * 1.25 : Math.PI * 0.25); ctx.stroke(); } ctx.restore(); },
  };

  // ==================== finishing ====================
  // warm cinematic grade: soft bloom, warm lift in the lights, cool shadows, strong vignette, fine grain
  const finish = (ctx, W, H_, t, flash = 0) => {
    { const g = ctx.createRadialGradient(W * 0.2, H_ * 0.3, 20, W * 0.35, H_ * 0.45, H_ * 0.75); g.addColorStop(0, 'rgba(255,190,120,0.16)'); g.addColorStop(1, 'rgba(255,190,120,0)'); ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    const gl = VXC.glow || (VXC.glow = H.layer(W / 8, H_ / 8)), g = gl.getContext('2d', { willReadFrequently: true });
    g.clearRect(0, 0, W / 8, H_ / 8); g.filter = 'blur(2px)'; g.drawImage(ctx.canvas, 0, 0, W / 8, H_ / 8); g.filter = 'none';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.14; ctx.drawImage(gl, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,196,140,0.12)'; ctx.fillRect(0, 0, W, H_); ctx.restore();
    { ctx.save(); ctx.globalCompositeOperation = 'multiply'; const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, 'rgba(70,64,96,0.55)'); g.addColorStop(0.35, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,50,80,0.6)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    if (flash > 0.01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,240,215,${flash})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    H.vignette(ctx, W, H_, 0.55, '16,8,26');
    grain(ctx, 0.022, 3 + (Math.floor(t * 24) % 8));
  };
  const grain = (ctx, amount, seed) => {
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height), d = img.data, n = d.length;
    VXC.gr = VXC.gr || {}; let gg = VXC.gr[seed + ':' + n];
    if (!gg) { gg = VXC.gr[seed + ':' + n] = new Float32Array(n >> 2); const r = H.rng(seed), k = amount * 255; for (let i = 0; i < gg.length; i++) gg[i] = (r() - 0.5) * k; }
    for (let i = 0, p = 0; i < n; i += 4, p++) { const v = gg[p]; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
    ctx.putImageData(img, 0, 0);
  };
  // captions: a short chunk (one or two lines) in heavy white caps with a yellow keyword, a black outline and
  // shadow; each new chunk pops in. lines: [[word | [word, true]], ...] (true = keyword)
  const caption = (ctx, W, lines, t0, t, y0 = 214) => {
    if (t < t0) return; const u = H.clamp((t - t0) / 0.16), s = 0.82 + 0.18 * H.ease.back(u);
    ctx.save(); ctx.font = FONT(900, 58); ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
    lines.forEach((ln, li) => {
      const words = ln.map((w) => (Array.isArray(w) ? w : [w, false])), sp = ctx.measureText(' ').width * 0.85;
      let wid = words.reduce((a, [w]) => a + ctx.measureText(w).width, 0) + sp * (words.length - 1), k = 1;
      if (wid > W * 0.9) k = (W * 0.9) / wid;
      const y = y0 + li * 66;
      ctx.save(); ctx.translate(W / 2, y - 20); ctx.scale(s * k, s * k); ctx.globalAlpha = Math.min(1, u * 2);
      let x = -wid / 2;
      for (const [w, key] of words) {
        ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 4;
        ctx.strokeStyle = '#141018'; ctx.lineWidth = 10; ctx.strokeText(w, x, 20);
        ctx.shadowColor = 'transparent'; ctx.fillStyle = key ? KEY : '#ffffff'; ctx.fillText(w, x, 20);
        x += ctx.measureText(w).width + sp;
      }
      ctx.restore();
    });
    ctx.restore();
  };
  const shotCam = (t, a, b, E0, T0, E1, T1) => { const u = H.ease.inOut(H.clamp((t - a) / (b - a))) * 0.8 + H.clamp((t - a) / (b - a)) * 0.2; return [E0.map((v, i) => H.lerp(v, E1[i], u)), T0.map((v, i) => H.lerp(v, T1[i], u))]; };
  const popU = (t, a, d = 0.3) => { const u = H.clamp((t - a) / d); return u <= 0 ? 0 : H.ease.back(u); };
  const ramp = (t, a, d) => H.ease.inOut(H.clamp((t - a) / d));
  // little props: TV remote, phone, popcorn bucket
  const remote = (S, c, dir, s = 1, bias = -0.3) => { const yaw = Math.atan2(dir[0], dir[2]); S.rbox((p) => add(rotY(rotX(p, Math.PI / 2 - 0.3), yaw), c), 0.05 * s, 0.13 * s, 0.018 * s, [34, 34, 40], { bevel: 0.5, bias, paint: (cc, w, h) => { cc.fillStyle = '#e8483a'; cc.beginPath(); cc.arc(w * 0.5, h * 0.12, w * 0.12, 0, TAU); cc.fill(); cc.fillStyle = '#5a5a66'; for (let i = 0; i < 9; i++) cc.fillRect(w * (0.22 + (i % 3) * 0.22), h * (0.45 + Math.floor(i / 3) * 0.12), w * 0.14, h * 0.07); } }); };
  const phone = (S, c, yaw, s = 1, screen) => S.rbox((p) => add(rotY(rotX(p, -0.3), yaw), c), 0.06 * s, 0.12 * s, 0.01 * s, [236, 120, 150], { bevel: 0.4, paint: screen || ((cc, w, h) => { cc.fillStyle = '#121218'; cc.fillRect(w * 0.06, h * 0.04, w * 0.88, h * 0.92); }) });
  const popcorn = (S, c, s = 1) => { S.cyl((p) => add(mul(p, s), c), 0.13, 0.26, P.white, 16, { top: 1.25, stripes: [220, 50, 48], bias: -0.3 }); const r = H.rng(5); for (let i = 0; i < 11; i++) S.ball(add(c, [r.range(-0.12, 0.12) * s, (0.28 + r.range(0, 0.08)) * s, r.range(-0.12, 0.12) * s]), 0.05 * s, [246, 232, 200], { rim: false, bias: -0.31 }); };
  const tv = (S, c, w, h, screen) => { S.rbox((p) => add(p, c), w, h, 0.04, [22, 22, 28], { bevel: 0.15, paint: (cc, ww, hh) => { cc.fillStyle = '#0c0c12'; cc.fillRect(0, 0, ww, hh); cc.save(); cc.translate(ww * 0.03, hh * 0.04); screen(cc, ww * 0.94, hh * 0.92); cc.restore(); } }); };
  const pitch = (c, w, h) => { c.fillStyle = '#3aa64a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; c.fillRect((i * w) / 8, 0, w / 8, h); } c.strokeStyle = '#e8f8e8'; c.lineWidth = 4; c.strokeRect(w * 0.05, h * 0.1, w * 0.9, h * 0.8); c.beginPath(); c.moveTo(w / 2, h * 0.1); c.lineTo(w / 2, h * 0.9); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2, h * 0.16, 0, TAU); c.stroke(); };

  // ==================== example explainer: "Why are yawns contagious?" (17 s) ====================
  // a scale reference for the medium: wide couch shot, close-ups, a wrong guess (red ring + X), the answer (sunburst),
  // a warm closer (hearts), and an establishing night exterior to end.
  const SHOTS = [0, 3.1, 5.6, 8.4, 11.4, 15.0, 17.0];
  const COUPLE = (S, t, faceB, faceG, extra = {}) => {
    const sit = { legs: [[1.42, 1.38], [1.42, 1.38]] };
    const b = S.doll(-0.62, 0.62, -0.42, 0.18, { kind: 'boy', ...sit, arms: extra.armsB || [[0.35, 0.18, 0.7], [0.5, 0.05, 0.9]], head: extra.headB || { yaw: 0.25 }, face: faceB, lean: extra.leanB || 0 });
    const g = S.doll(0.62, 0.62, -0.42, -0.2, { kind: 'girl', s: 0.95, ...sit, arms: extra.armsG || [[0.5, 0.05, 0.9], [0.35, 0.18, 0.7]], head: extra.headG || { yaw: -0.3 }, face: faceG, lean: extra.leanG || 0 });
    return { b, g };
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const shot = Math.max(0, SHOTS.findIndex((s, i) => t >= s && t < SHOTS[i + 1]));
    let flash = 0;
    if (shot === 0) { // wide: he yawns
      const [E, TG] = shotCam(t, 0, 3.1, [0.2, 1.55, 4.7], [0, 0.95, -0.3], [0.05, 1.45, 4.1], [0, 0.95, -0.3]);
      const S = Scene(E, TG, W, H_); livingRoom(S, { table: true });
      const y = ramp(t, 1.2, 0.5) * (1 - ramp(t, 2.6, 0.4));
      COUPLE(S, t, { eyes: y > 0.4 ? 'closed' : 'open', mouth: y > 0.3 ? 'yawn' : 'smile', brows: y * 0.3 }, { eyes: 'open', look: [-0.6, 0], mouth: 'flat' }, { armsB: [[0.35 + y * 2.3, 0.18, 0.7 + y * 1.4], [0.5, 0.05, 0.9]], headB: { yaw: 0.2, pitch: -0.25 * y } });
      popcorn(S, [0.05, 0.4, 1.12], 0.9); remote(S, [-0.5, 0.42, 1.25], [1, 0, 0.3], 1.2);
      S.render(ctx, W, H_, { dof: 0.3 });
      caption(ctx, W, [['WHY', 'ARE', 'YAWNS'], [['CONTAGIOUS?', true]]], 0.15, t);
    } else if (shot === 1) { // close-up: she catches it
      const [E, TG] = shotCam(t, 3.1, 5.6, [0.75, 1.62, 1.3], [0.62, 1.6, -0.42], [0.72, 1.62, 1.05], [0.62, 1.6, -0.42]);
      const S = Scene(E, TG, W, H_); livingRoom(S);
      const y = ramp(t, 4.3, 0.4);
      COUPLE(S, t, { eyes: 'closed', mouth: 'yawn' }, { eyes: y > 0.5 ? 'closed' : 'wide', look: [-0.7, 0.1], mouth: y > 0.3 ? 'yawn' : 'o', brows: 0.4 * (1 - y) }, { headG: { yaw: -0.15, pitch: -0.2 * y } });
      S.render(ctx, W, H_, { dof: 0.22 });
      FX.speed(ctx, W, H_, W * 0.5, H_ * 0.55, 1 - ramp(t, 3.6, 0.4), t);
      caption(ctx, W, [['ONE', 'YAWN...'], ['AND', ['SHE\'S', true], ['GONE.', true]]], 3.2, t);
    } else if (shot === 2) { // the wrong guess: boredom? (red ring + X on the TV)
      const [E, TG] = shotCam(t, 5.6, 8.4, [-0.2, 1.3, 2.6], [0.0, 1.0, -0.4], [-0.1, 1.35, 2.3], [0.0, 1.0, -0.4]);
      const S = Scene([E[0] * 0.4, E[1] + 1.05, -E[2] - 1.2], [0, 0.95, 3.2], W, H_); // reverse angle: from behind the couch toward the TV
      couch(S, 0, -0.97);
      S.quad([[-7, 0, 3.6], [7, 0, 3.6], [7, 4.2, 3.6], [-7, 4.2, 3.6]], P.wall, { z: 99, bg: true });
      S.quad([[-7, 0, -3], [7, 0, -3], [7, 0, 3.6], [-7, 0, 3.6]], P.floor, { z: 98 });
      S.rbox((p) => add(p, [0, 0.3, 3.2]), 1.1, 0.3, 0.25, P.wood, { bevel: 0.15 });
      tv(S, [0, 1.2, 3.25], 0.95, 0.55, pitch);
      COUPLE(S, t, { eyes: 'open' }, { eyes: 'open' }, { headB: { yaw: 0 }, headG: { yaw: 0 } });
      S.render(ctx, W, H_, { dof: 0.4, focus: 4.0 });
      const tvp = S.proj([0, 1.2, 3.25]), u = H.clamp((t - 6.4) / 0.5);
      FX.ring(ctx, tvp[0], tvp[1], 150, '#ec3a32', u, 'x');
      caption(ctx, W, [['NOT', 'JUST'], [['BOREDOM.', true]]], 5.7, t);
      if (t > 6.6 && t < 6.9) flash = 0.12 * (1 - (t - 6.6) / 0.3);
    } else if (shot === 3) { // the answer: empathy (sunburst behind her)
      const [E, TG] = shotCam(t, 8.4, 11.4, [0.62, 1.62, 1.0], [0.62, 1.62, -0.42], [0.62, 1.64, 0.85], [0.62, 1.63, -0.42]);
      const S = Scene(E, TG, W, H_);
      const g = S.doll(0.62, 0.62, -0.42, 0, { kind: 'girl', s: 0.95, legs: [[1.42, 1.38], [1.42, 1.38]], arms: [[0.4, 0.1, 1.2], [1.9, 0.1, 1.6]], head: { tilt: 0.12 }, face: { eyes: 'wide', look: [0.2, 0.3], mouth: 'open', brows: -0.1 } });
      const hp = S.proj(g.head);
      FX.burst(ctx, W, H_, hp[0], hp[1], ramp(t, 8.5, 0.25), t);
      S.render(ctx, W, H_, { dof: 0, bg: 'rgba(0,0,0,0)' });
      const r = H.rng(9); for (let i = 0; i < 6; i++) { const u = popU(t, 8.8 + i * 0.12, 0.3); FX.sparkle(ctx, r.range(80, W - 80), r.range(380, 820), 26 * u * (0.8 + 0.4 * Math.sin(t * 6 + i)), t); }
      caption(ctx, W, [['IT\'S'], [['EMPATHY!', true]]], 8.5, t);
      flash = 0.18 * Math.exp(-Math.pow((t - 8.55) * 7, 2));
    } else if (shot === 4) { // the closer: hearts
      const [E, TG] = shotCam(t, 11.4, 15.0, [0.2, 1.5, 2.6], [0.05, 1.3, -0.4], [0.15, 1.5, 2.15], [0.05, 1.35, -0.4]);
      const S = Scene(E, TG, W, H_); livingRoom(S);
      COUPLE(S, t, { eyes: 'happy', mouth: 'smile', blush: 1 }, { eyes: 'closed', mouth: 'smile', blush: 1 }, { headB: { yaw: 0.3, tilt: -0.15 }, headG: { yaw: -0.2, tilt: 0.35 }, leanG: 0.12, armsB: [[0.35, 0.18, 0.7], [0.6, 0.5, 1.5]] });
      S.render(ctx, W, H_, { dof: 0.3 });
      for (let i = 0; i < 5; i++) { const st = 12.0 + i * 0.45, u = t - st; if (u < 0) continue; const s = 70 * popU(t, st, 0.4) * (1 - H.clamp((u - 2.2) / 0.5)); FX.heart(ctx, W * 0.5 + Math.sin(u * 2 + i) * 60 + (i - 2) * 50, 620 - u * 120, s, Math.sin(u * 3 + i) * 0.2); }
      caption(ctx, W, [['STRONGEST', 'WITH'], ['PEOPLE', 'YOU', ['LOVE.', true]]], 11.5, t);
    } else { // night exterior: lights go out
      const [E, TG] = shotCam(t, 15.0, 17.0, [0.4, 1.4, 6.0], [0.2, 1.1, -1.2], [0.3, 1.35, 5.4], [0.2, 1.1, -1.2]);
      const S = Scene(E, TG, W, H_);
      nightSky(ctx, W, H_, t);
      nightStreet(ctx, S, t, 1 - ramp(t, 16.0, 0.15));
      S.render(ctx, W, H_, { dof: 0, bg: 'rgba(0,0,0,0)' });
    }
    finish(ctx, W, H_, t, flash);
  };

  // ---- hero frame: the couple on the couch, a heart rising ----
  const HERO = (ctx, W, H_, t) => {
    const [E, TG] = shotCam(t, 0, 5, [0.25, 1.55, 3.6], [0, 1.0, -0.35], [0.1, 1.5, 3.0], [0, 1.05, -0.35]);
    const S = Scene(E, TG, W, H_); livingRoom(S, { table: true });
    COUPLE(S, t, { eyes: 'open', look: [0.5, 0], mouth: 'smile' }, { eyes: 'open', look: [-0.6, 0.1], mouth: 'smile', blush: 0.6 });
    popcorn(S, [0.05, 0.4, 1.12], 0.9);
    S.render(ctx, W, H_, { dof: 0.3 });
    FX.heart(ctx, W * 0.86, 470 - (t % 2) * 30, 58 * popU(t, 0.5, 0.4), 0.15);
    caption(ctx, W, [['HAS', 'THIS', 'EVER'], [['HAPPENED', true], 'TO', 'YOU?']], 0.1, t);
    finish(ctx, W, H_, t);
  };

  registerStyle({
    id: 'violet',
    name: 'Violet Room',
    category: '3D Cartoon',
    description: 'Soft 3D cartoon characters with mannequin-jointed limbs, puffy sweaters and big glossy eyes acting out everyday moments in a cosy living room: sage wall, framed landscape, navy-violet couch, warm lamp light and soft depth of field, as a vertical 9:16 reel.',
    motion: 'Short shots with hard cuts between wide shots and big close-ups, slow camera pushes, quick character reactions; captions pop chunk by chunk; flat cartoon accents (speed lines, sunburst, rings, dotted trails, hearts) snap in over the 3D.',
    fonts: ['900 58px "Montserrat"', '800 40px "Montserrat"'],
    frameT: 4.8,
    duration: 5,
    readsPixels: true,
    explainerDuration: 17,
    explainerNote: 'A relatable mini-sitcom told in short shots: wide couch shots and big face close-ups, the camera slowly pushing in on each; big white captions with one yellow keyword pop in chunk by chunk; wrong guesses get a red ring and X, right answers a sunburst or green ring, feelings get hearts, sweat drops and "?"; end on an establishing exterior.',
    draw(ctx, W, H_, t) { HERO(ctx, W, H_, t); },
    explainer(ctx, W, H_, t) { EXPLAIN(ctx, W, H_, t); },
    // Sound: a light, bouncy sitcom feel. Each hard cut gets a soft whoosh; captions get a tiny pop; reactions get
    // cartoon accents (a rising "boing" for surprise, a slide whistle-ish riser into the sunburst); the wrong guess is a
    // buzzer with a thud; the answer a bright ding; hearts plink; the night exterior ends on crickets and a click.
    explainerSound(k) {
      const cut = (t) => k.play('whoosh', t - 0.08, { dur: 0.22, gain: 0.35, minor: true });
      const cap = (t) => k.play('pop', t, { f: 760, gain: 0.35, minor: true });
      k.bed('room', 0, 17, { gain: 0.2 });
      k.music('pulse', 0, 15, { bpm: 104, gain: 0.3, chords: [['F3', 'A3', 'C4', 'E4'], ['D3', 'F3', 'A3', 'C4'], ['G3', 'Bb3', 'D4', 'F4'], ['C4', 'E4', 'G4', 'Bb4']] });
      cap(0.15);
      k.tone(1.25, { f: [[0, 260], [0.7, 150]], type: 'triangle', dur: 0.9, gain: 0.14, filter: 'lowpass', f2: 900 }); // the yawn
      cut(3.1); cap(3.2); k.play('whoosh', 3.15, { dur: 0.4, gain: 0.5 }); k.play('jump', 3.7, { gain: 0.5 });
      k.tone(4.35, { f: [[0, 300], [0.6, 170]], type: 'triangle', dur: 0.7, gain: 0.12, filter: 'lowpass', f2: 900 });
      cut(5.6); cap(5.7); k.play('stroke', 6.4, { material: 'marker', dur: 0.3, gain: 0.5 });
      k.play('buzz', 6.75, { f: 110, dur: 0.35, gain: 0.6 }); k.play('thud', 6.72, { f: 120, gain: 0.5 });
      cut(8.4); k.play('riser', 8.0, { dur: 0.45, gain: 0.4 }); k.play('impact', 8.5, { gain: 0.7 }); k.play('success', 8.55, { f: 'C6', gain: 0.6 }); cap(8.5);
      for (let i = 0; i < 6; i++) k.play('blip', 8.82 + i * 0.12, { f: ['C6', 'E6', 'G6', 'A6', 'C7', 'E7'][i], type: 'sine', gain: 0.5, minor: true });
      cut(11.4); cap(11.5); for (let i = 0; i < 5; i++) k.play('pop', 12.0 + i * 0.45, { f: 900 + i * 80, gain: 0.45, minor: true });
      ['C5', 'E5', 'G5'].forEach((f, i) => k.play('ding', 12.1 + i * 0.1, { f, gain: 0.3 }));
      cut(15.0); for (let i = 0; i < 10; i++) k.play('tick', 15.1 + i * 0.18, { f: 4800, gain: 0.25, minor: true }); k.play('click', 16.0, { gain: 0.8 });
    },
  });
}
