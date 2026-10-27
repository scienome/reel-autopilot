// ===================== Mechanic: low-poly 3D engineering explainer (9:16) =====================
// Low-poly, flat-shaded 3D like a warm Blender render: a machine on a red tubular stand in a cosy garage, or a
// vehicle on a sunset test road. Casings turn to glass (x-ray) to show the parts inside; glowing dotted lines show
// what flows (air, fuel, coolant, oil, current); arrows show forces; ONE word of caption at a time sits in the middle
// of the frame. The camera orbits and dollies slowly and keeps moving. Every frame is a pure function of t.
{
  const TAU = Math.PI * 2;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const lerp3 = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  const rotX = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };
  const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
  const rotZ = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
  const shade = (c, k) => c.map((v) => Math.max(0, Math.min(255, v * k)));
  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const MXC = {}; // static caches (textures, layers, meshes); frames still depend only on t

  // ---- palette: warm studio low-poly ----
  const P = {
    red: [226, 92, 78], redDark: [176, 58, 52], steel: [196, 200, 208], chrome: [222, 226, 232], dark: [52, 54, 62], black: [30, 30, 36],
    glass: [176, 204, 228], teal: [104, 214, 206], orange: [246, 162, 84], cream: [244, 230, 206], yellow: [250, 204, 80], blue: [52, 84, 176],
    wall: [214, 178, 152], floor: [230, 204, 178], beam: [104, 62, 44], wood: [170, 112, 70], cork: [196, 140, 96], tire: [40, 40, 46],
    asphalt: [58, 50, 64], grass: [104, 150, 74], tree: [66, 122, 58], tree2: [92, 146, 64], trunk: [96, 66, 46], barrier: [240, 232, 228], stripe: [240, 128, 70],
    white: [242, 240, 236], green: [96, 214, 120], air: [150, 214, 255], fluid: [246, 196, 120], hot: [255, 110, 50],
  };
  const FONT = (w, px) => `${w} ${px}px "Montserrat"`;
  const WARM = [1.06, 1.0, 0.9], COOL = [0.86, 0.9, 1.08];

  // ==================== the low-poly renderer ====================
  // Scene(E, TG): a camera at E looking at TG. Builders push flat polygons (faces) and glowing beads (dots);
  // render() shades them (warm key light, cool fill), casts soft shadows onto the floor, sorts everything back to
  // front by depth, and softens what lies far behind the focus (depth of field). Glass faces draw both sides,
  // translucent, with bright edges, so the parts inside stay visible.
  const Scene = (E, TG, W = 720, H_ = 1280, F = 1080) => {
    const fwd = norm(sub(TG, E)), right = norm(cross(fwd, [0, 1, 0])), up = cross(right, fwd);
    const depth = (p) => dot(sub(p, E), fwd);
    const proj = (p) => { const d = sub(p, E); const z = dot(d, fwd); return [W / 2 + (F * dot(d, right)) / z, H_ / 2 - (F * dot(d, up)) / z, z]; };
    const Lk = norm([-0.45, 0.9, 0.5]);
    const faces = [], dots = [], bgq = [], shadowsOff = new Set();
    // a face: points (any winding), colour, and the centre of the solid it belongs to (to orient its normal outward)
    const face = (pts, col, o = {}) => { faces.push({ pts, col, c: o.c, a: o.alpha ?? 1, two: o.two, glow: o.glow, paint: o.paint, map: o.map, edge: o.edge, noShadow: o.noShadow, gloss: o.gloss ?? 0.1, flat: o.flat }); };
    // ---- builders ----
    // box: half-extents w,h,d with a small chamfer (bevel = fraction of the smallest extent). T maps local -> world.
    const box = (T, w, h, d, col, o = {}) => {
      const b = Math.min(w, h, d) * (o.bevel ?? 0.12), iw = w - b, ih = h - b, id = d - b, k = (x, y, z) => T([x, y, z]), C = T([0, 0, 0]);
      const F2 = (pts, ex = {}) => face(pts, ex.col || col, { ...o, ...ex, c: C });
      for (const s of [-1, 1]) {
        F2([k(s * w, -ih, -id), k(s * w, ih, -id), k(s * w, ih, id), k(s * w, -ih, id)], s > 0 && o.sidePaint ? { paint: o.sidePaint, map: [k(w, ih, id), k(w, ih, -id), k(w, -ih, id)] } : {});
        F2([k(-iw, s * h, -id), k(iw, s * h, -id), k(iw, s * h, id), k(-iw, s * h, id)], s > 0 && o.topPaint ? { paint: o.topPaint, map: [k(-iw, h, -id), k(iw, h, -id), k(-iw, h, id)] } : {});
        F2([k(-iw, -ih, s * d), k(iw, -ih, s * d), k(iw, ih, s * d), k(-iw, ih, s * d)], s > 0 && o.paint ? { paint: o.paint, map: [k(-iw, ih, d), k(iw, ih, d), k(-iw, -ih, d)] } : {});
      }
      if (b > 1e-4) for (const a of [-1, 1]) for (const c of [-1, 1]) {
        F2([k(a * w, c * ih, -id), k(a * iw, c * h, -id), k(a * iw, c * h, id), k(a * w, c * ih, id)]);
        F2([k(a * w, -ih, c * id), k(a * w, ih, c * id), k(a * iw, ih, c * d), k(a * iw, -ih, c * d)]);
        F2([k(-iw, a * h, c * id), k(iw, a * h, c * id), k(iw, a * ih, c * d), k(-iw, a * ih, c * d)]);
        for (const e of [-1, 1]) F2([k(a * w, c * ih, e * id), k(a * iw, c * h, e * id), k(a * iw, c * ih, e * d)]);
      }
    };
    // cylinder / cone frustum along local y from 0 to h; r2 = top radius; caps both ends
    const cyl = (T, r, h, col, n = 16, o = {}) => {
      const r2 = o.r2 ?? r, C = T([0, h / 2, 0]), A = [], B = [];
      for (let i = 0; i < n; i++) { const a = (i / n) * TAU + (o.rot || 0); A.push(T([Math.cos(a) * r, 0, Math.sin(a) * r])); B.push(T([Math.cos(a) * r2, h, Math.sin(a) * r2])); }
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; face([A[i], A[j], B[j], B[i]], o.stripes && i % 2 ? o.stripes : col, { ...o, c: C }); }
      if (o.caps !== false) { face(B.slice(), o.cap || col, { ...o, c: C, paint: o.capPaint, map: o.capPaint ? [B[Math.round(n * 0.625) % n], B[Math.round(n * 0.875) % n], B[Math.round(n * 0.375) % n]] : null }); face(A.slice().reverse(), o.cap || col, { ...o, c: C, paint: null }); }
    };
    // a cylinder between two world points (pipes, rods, stand tubes, axles)
    const rod = (a, b, r, col, n = 10, o = {}) => {
      const d = sub(b, a), L = Math.hypot(...d), y = norm(d), x = norm(Math.abs(y[1]) < 0.95 ? cross(y, [0, 1, 0]) : cross(y, [1, 0, 0])), z = cross(x, y);
      cyl((p) => add(a, add(add(mul(x, p[0]), mul(y, p[1])), mul(z, p[2]))), r, L, col, n, o);
    };
    // a bent tube through several points (stand frames, hoses, brake lines): rods with ball joints
    const tube = (pts, r, col, n = 10, o = {}) => { for (let i = 0; i < pts.length - 1; i++) rod(pts[i], pts[i + 1], r, col, n, o); for (let i = 1; i < pts.length - 1; i++) ico(pts[i], r * 1.02, col, { ...o, sub: 0 }); };
    // a low-poly ball (icosphere): subdivision 0 or 1; jit roughens it (trees, rocks, smoke)
    const ico = (c, r, col, o = {}) => {
      const key = 'ico' + (o.sub ?? 1); const M = MXC[key] || (MXC[key] = icosphere(o.sub ?? 1));
      const s = Array.isArray(r) ? r : [r, r, r], nz = o.jit ? (MXC.nz || (MXC.nz = H.makeNoise(17))) : null, seed = o.seed || 0;
      const vs = M.v.map((u) => { const k = nz ? 1 + o.jit * nz.n3(u[0] * 1.7 + seed, u[1] * 1.7, u[2] * 1.7) : 1; const p = [u[0] * s[0] * k, u[1] * s[1] * k, u[2] * s[2] * k]; return add(c, o.T ? o.T(p) : p); });
      M.f.forEach(([a, b, d]) => face([vs[a], vs[b], vs[d]], col, { ...o, c }));
    };
    // a flat quad or polygon lying in the world (floors, walls, roads, signs). bg: drawn first, in the given order.
    const quad = (pts, col, o = {}) => { if (o.bg) bgq.push({ pts, col, o }); else face(pts, col, { ...o, two: true }); };
    // a flat arrow lying in the plane spanned by its direction and `side` (default: lying on the ground)
    const arrow = (a, b, col, o = {}) => {
      const d = sub(b, a), L = Math.hypot(...d), x = norm(d), side = norm(o.side || cross(x, [0, 1, 0])), nrm = cross(side, x), w = o.w ?? L * 0.13, hl = Math.min(L * 0.42, w * 2.4), th = o.th ?? w * 0.35;
      const P2 = (u, v, h) => add(add(add(a, mul(x, u)), mul(side, v)), mul(nrm, h));
      const outline = [[0, -w / 2], [L - hl, -w / 2], [L - hl, -w * 1.15], [L, 0], [L - hl, w * 1.15], [L - hl, w / 2], [0, w / 2]];
      const top = outline.map(([u, v]) => P2(u, v, th / 2)), bot = outline.map(([u, v]) => P2(u, v, -th / 2)), C = P2(L * 0.45, 0, 0);
      face(top, col, { ...o, c: C }); face(bot.slice().reverse(), col, { ...o, c: C });
      for (let i = 0; i < outline.length; i++) { const j = (i + 1) % outline.length; face([top[i], top[j], bot[j], bot[i]], shade(col, 0.85), { ...o, c: C }); }
    };
    // glowing beads moving along a polyline (flows). phase in path lengths per second is up to the caller.
    const beads = (pts, col, phase = 0, o = {}) => {
      const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(...sub(pts[i], pts[i - 1])); L.push(d); tot += d; }
      const sp = o.spacing ?? 0.09, r = o.r ?? 0.026, upto = (o.reveal ?? 1) * tot;
      for (let s = ((phase % sp) + sp) % sp; s <= upto; s += sp) { let a = s, i = 0; while (i < L.length - 1 && a > L[i]) { a -= L[i]; i++; } const p = lerp3(pts[i], pts[i + 1], Math.min(1, a / L[i])); dots.push({ p, col, r }); }
    };
    // ---- render ----
    const render = (ctx, Wd, Ht, env = {}) => {
      if (typeof env.bg === 'function') env.bg(ctx, Wd, Ht); else { ctx.fillStyle = env.bg || '#d9b89a'; ctx.fillRect(0, 0, Wd, Ht); }
      const NZ = 0.25;
      // background quads (walls, floor, road): near-plane clipped, drawn in order
      const drawQuad = (c, { pts, col, o }) => {
        const poly = pts.map((q) => ({ q, z: depth(q) })), out = [];
        for (let i = 0; i < poly.length; i++) { const A = poly[i], B = poly[(i + 1) % poly.length]; if (A.z >= NZ) out.push(A.q); if ((A.z >= NZ) !== (B.z >= NZ)) { const u = (NZ - A.z) / (B.z - A.z); out.push(add(A.q, mul(sub(B.q, A.q), u))); } }
        if (out.length < 3) return; const sp = out.map(proj);
        c.beginPath(); sp.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.closePath();
        let n = norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]))); const cen = mul(pts.reduce((s, q) => add(s, q), [0, 0, 0]), 1 / pts.length); if (dot(n, sub(E, cen)) < 0) n = mul(n, -1);
        c.fillStyle = rgb(o.flat ? col : light(col, n, norm(sub(E, cen)), 0.02)); c.fill();
        if (o.grid) { // tile joints as world-space lines (stays correct when the plane runs behind the camera)
          const [g, gc] = o.grid, xs = pts.map((q) => q[0]), zs = pts.map((q) => q[2]), y = pts[0][1] + 0.001, x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
          c.save(); c.strokeStyle = gc; c.lineWidth = 1.2; c.beginPath();
          const seg = (A, B) => { let a = A, b = B, za = depth(a), zb = depth(b); if (za < NZ && zb < NZ) return; if (za < NZ) { a = lerp3(a, b, (NZ - za) / (zb - za)); } else if (zb < NZ) { b = lerp3(a, b, (NZ - za) / (zb - za)); } const pa = proj(a), pb = proj(b); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); };
          for (let x = Math.ceil(x0 / g) * g; x <= x1; x += g) seg([x, y, z0], [x, y, z1]);
          for (let z = Math.ceil(z0 / g) * g; z <= z1; z += g) seg([x0, y, z], [x1, y, z]);
          c.stroke(); c.restore();
        }
        if (o.paint) { const [p0, p1, p3] = [pts[0], pts[1], pts[3]].map(proj), cw = 600, ch = 600 * (Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / Math.max(1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]))); if (ch > 2 && ch < 9000 && p0[2] > NZ && p1[2] > NZ && p3[2] > NZ) { c.save(); c.clip(); c.setTransform((p1[0] - p0[0]) / cw, (p1[1] - p0[1]) / cw, (p3[0] - p0[0]) / ch, (p3[1] - p0[1]) / ch, p0[0], p0[1]); o.paint(c, cw, ch); c.restore(); } }
      };
      // shade + cull the faces
      const vis = [];
      for (const f of faces) {
        const sp = f.pts.map(proj); if (sp.some((q) => q[2] < NZ)) continue;
        const cen = mul(f.pts.reduce((s, q) => add(s, q), [0, 0, 0]), 1 / f.pts.length), toE = norm(sub(E, cen));
        let n = norm(cross(sub(f.pts[1], f.pts[0]), sub(f.pts[2], f.pts[0])));
        if (f.c && dot(n, sub(cen, f.c)) < 0) n = mul(n, -1);
        let back = false;
        if (dot(n, toE) <= 0) { if (f.a >= 1 && !f.two) continue; back = true; n = mul(n, -1); }
        vis.push({ f, sp, n, back, z: depth(cen), c: f.glow ? f.col : light(f.col, n, toE, f.gloss) });
      }
      for (const d of dots) { const p = proj(d.p); if (p[2] < NZ) continue; vis.push({ dot: d, sp: p, z: p[2] - 0.02 }); }
      vis.sort((a, b) => b.z - a.z);
      // depth of field: everything far behind the focus draws into a softened layer
      const focus = env.focus ?? depth(TG), gap = env.dofGap ?? 2.2, k = env.dof ?? 0.33, useDof = k > 0 && k < 1;
      let c = ctx, L;
      if (useDof) { L = MXC.farL || (MXC.farL = H.layer(Wd, Ht)); c = L.getContext('2d', { willReadFrequently: true }); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, Wd, Ht); c.drawImage(ctx.canvas, 0, 0, Wd, Ht); }
      for (const q of bgq) drawQuad(c, q);
      // soft shadows on the ground plane (y = env.ground) from every opaque face, in a reduced-resolution mask
      if (env.shadows !== false) {
        const gy = env.ground ?? 0, Ls = mul(Lk, -1);
        let SL = MXC.SL; if (!SL) SL = MXC.SL = H.layer(Wd / 2, Ht / 2); const s = SL.getContext('2d', { willReadFrequently: true });
        s.setTransform(1, 0, 0, 1, 0, 0); s.clearRect(0, 0, Wd / 2, Ht / 2); s.setTransform(0.5, 0, 0, 0.5, 0, 0); s.fillStyle = '#000';
        for (const v of vis) { if (v.dot || v.f.a < 0.6 || v.f.noShadow || v.f.glow) continue; const pts = v.f.pts; if (pts.every((p) => p[1] < gy + 0.01)) continue; s.beginPath(); let ok = true; pts.forEach((p, i) => { const h = Math.max(0, p[1] - gy); const q = proj(add(p, mul(Ls, h / -Ls[1]))); if (q[2] < NZ) ok = false; i ? s.lineTo(q[0], q[1]) : s.moveTo(q[0], q[1]); }); if (ok) { s.closePath(); s.fill(); } }
        let M = MXC.SM; if (!M) M = MXC.SM = H.layer(Wd / 2, Ht / 2); const m = M.getContext('2d', { willReadFrequently: true });
        m.globalAlpha = 1; m.filter = 'none'; m.fillStyle = '#fff'; m.fillRect(0, 0, Wd / 2, Ht / 2); m.filter = 'blur(5px)'; m.globalAlpha = env.shadowAlpha ?? 0.55; m.drawImage(SL, 0, 0); m.filter = 'none'; m.globalAlpha = 1;
        c.save(); c.globalCompositeOperation = 'multiply'; c.drawImage(M, 0, 0, Wd, Ht); c.restore();
      }
      const drawV = (cc, v) => {
        if (v.dot) { const { p, col, r } = { p: v.sp, col: v.dot.col, r: (F * v.dot.r) / v.sp[2] }; const g = cc.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 2.2); g.addColorStop(0, rgb(col, 0.55)); g.addColorStop(1, rgb(col, 0)); cc.fillStyle = g; cc.beginPath(); cc.arc(p[0], p[1], r * 2.2, 0, TAU); cc.fill(); cc.fillStyle = rgb([255, 255, 255].map((w, i) => (w + col[i]) / 2)); cc.beginPath(); cc.arc(p[0], p[1], r, 0, TAU); cc.fill(); return; }
        const { f, sp } = v; let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
        for (const q of sp) { if (q[0] < mnx) mnx = q[0]; if (q[0] > mxx) mxx = q[0]; if (q[1] < mny) mny = q[1]; if (q[1] > mxy) mxy = q[1]; }
        if (mxx < -40 || mnx > Wd + 40 || mxy < -40 || mny > Ht + 40) return;
        cc.beginPath(); sp.forEach((q, i) => (i ? cc.lineTo(q[0], q[1]) : cc.moveTo(q[0], q[1]))); cc.closePath();
        if (f.a < 1) { // glass: translucent tint, brighter where it faces the light, crisp light edges
          cc.fillStyle = rgb(v.c, f.a * (v.back ? 0.6 : 1)); cc.fill(); cc.strokeStyle = `rgba(255,255,255,${v.back ? 0.18 : 0.42})`; cc.lineWidth = 1.1; cc.stroke(); return;
        }
        const rr = Math.max(mxx - mnx, mxy - mny) / 2;
        if (rr > 10 && !f.glow) { const gx = (mnx + mxx) / 2, gy = (mny + mxy) / 2, g = cc.createLinearGradient(gx - rr * 0.6, gy - rr * 0.8, gx + rr * 0.6, gy + rr * 0.8); g.addColorStop(0, rgb(shade(v.c, 1.05))); g.addColorStop(1, rgb(shade(v.c, 0.93))); cc.fillStyle = g; } else cc.fillStyle = rgb(v.c);
        cc.fill(); cc.strokeStyle = rgb(shade(v.c, f.edge ?? 0.96)); cc.lineWidth = 0.8; cc.stroke();
        if (f.paint && f.map) { const [p0, p1, p3] = f.map.map(proj), cw = 400, ch = 400 * (Math.hypot(p3[0] - p0[0], p3[1] - p0[1]) / Math.max(1, Math.hypot(p1[0] - p0[0], p1[1] - p0[1]))); if (ch > 2 && ch < 6000) { cc.save(); cc.clip(); cc.setTransform((p1[0] - p0[0]) / cw, (p1[1] - p0[1]) / cw, (p3[0] - p0[0]) / ch, (p3[1] - p0[1]) / ch, p0[0], p0[1]); f.paint(cc, cw, ch); cc.restore(); } }
      };
      let i = 0;
      if (useDof) {
        for (; i < vis.length && vis[i].z > focus + gap; i++) drawV(c, vis[i]);
        const sw = Math.max(8, Math.round(Wd * k)), sh = Math.max(8, Math.round(Ht * k)); let Sm = MXC['sm' + sw]; if (!Sm) Sm = MXC['sm' + sw] = H.layer(sw, sh);
        const sc = Sm.getContext('2d', { willReadFrequently: true }); sc.imageSmoothingEnabled = true; sc.clearRect(0, 0, sw, sh); sc.drawImage(L, 0, 0, sw, sh);
        ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(Sm, 0, 0, Wd, Ht); ctx.restore();
      }
      for (; i < vis.length; i++) drawV(ctx, vis[i]);
    };
    // face colour: warm key, cool sky fill, ground bounce, a little gloss
    const light = (col, n, toE, gloss = 0.1) => {
      const dif = Math.max(0, dot(n, Lk)), hemi = n[1] * 0.5 + 0.5, h2 = norm(add(Lk, toE)), spec = Math.pow(Math.max(0, dot(n, h2)), 30) * gloss;
      return col.map((v, i) => Math.min(255, v * (0.36 * (0.7 + 0.3 * hemi) * COOL[i] + 0.74 * dif * WARM[i]) + 255 * spec));
    };
    return { proj, depth, face, box, cyl, rod, tube, ico, quad, arrow, beads, render, E, TG, F, faces, dots };
  };
  const icosphere = (subdiv) => {
    const g = (1 + Math.sqrt(5)) / 2;
    const v = [[-1, g, 0], [1, g, 0], [-1, -g, 0], [1, -g, 0], [0, -1, g], [0, 1, g], [0, -1, -g], [0, 1, -g], [g, 0, -1], [g, 0, 1], [-g, 0, -1], [-g, 0, 1]].map(norm);
    let f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    for (let s = 0; s < subdiv; s++) { const cache = {}, nf = []; const mid = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (cache[k] == null) { cache[k] = v.length; v.push(norm(mul(add(v[a], v[b]), 0.5))); } return cache[k]; }; f.forEach(([a, b, c]) => { const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); nf.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]); }); f = nf; }
    return { v, f };
  };

  // ==================== cameras ====================
  // orbit: the camera circles `c` at radius r and height h, from angle a0 to a1 (radians, 0 = looking along -z) over [t0, t1]
  const orbit = (t, t0, t1, c, r0, r1, h0, h1, a0, a1, look = [0, 0, 0]) => { const u = H.clamp((t - t0) / (t1 - t0)), e = H.ease.inOut(u) * 0.7 + u * 0.3, a = a0 + (a1 - a0) * e, r = r0 + (r1 - r0) * e, h = h0 + (h1 - h0) * e; return [[c[0] + Math.sin(a) * r, c[1] + h, c[2] + Math.cos(a) * r], add(c, look)]; };
  const dolly = (t, t0, t1, E0, T0, E1, T1) => { const u = H.clamp((t - t0) / (t1 - t0)), e = H.ease.inOut(u) * 0.75 + u * 0.25; return [lerp3(E0, E1, e), lerp3(T0, T1, e)]; };
  const popU = (t, a, d = 0.35) => { const u = H.clamp((t - a) / d); return u <= 0 ? 0 : H.ease.back(u); };
  const ramp = (t, a, d) => H.ease.inOut(H.clamp((t - a) / d));
  // a part flying into place: from `from` offset to its seat, arriving at time a (duration d), with a small settle
  const flyIn = (t, a, d, from) => { const u = H.clamp((t - (a - d)) / d); if (u <= 0) return null; const e = 1 - Math.pow(1 - u, 3); return mul(from, 1 - e); };

  // ==================== sets ====================
  // the garage: plaster walls, wood roof beams, cream tiled floor, a red tool chest, a cork board, blue drums, tyres
  const garage = (S, o = {}) => {
    const WZ = -3.2, WX = -3.4;
    const tiles = (c, w, h) => { c.strokeStyle = 'rgba(140,100,80,0.45)'; c.lineWidth = 1.6; const n = 40; for (let i = 0; i <= n; i++) { c.beginPath(); c.moveTo((i * w) / n, 0); c.lineTo((i * w) / n, h); c.stroke(); c.beginPath(); c.moveTo(0, (i * h) / n); c.lineTo(w, (i * h) / n); c.stroke(); } };
    S.quad([[-12, 0, WZ], [12, 0, WZ], [12, 0, 12], [-12, 0, 12]], P.floor, { bg: true, grid: [0.6, 'rgba(150,104,84,0.38)'] }); void tiles;
    S.quad([[-12, 0, WZ], [12, 0, WZ], [12, 4.6, WZ], [-12, 4.6, WZ]], P.wall, { bg: true, paint: (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(60,30,20,0.25)'); g.addColorStop(0.4, 'rgba(255,230,200,0.08)'); g.addColorStop(1, 'rgba(60,30,20,0.12)'); c.fillStyle = g; c.fillRect(0, 0, w, h); } });
    S.quad([[WX, 0, WZ], [WX, 0, 12], [WX, 4.6, 12], [WX, 4.6, WZ]], shade(P.wall, 0.92), { bg: true });
    S.quad([[-12, 4.6, WZ], [12, 4.6, WZ], [12, 4.6, 12], [-12, 4.6, 12]], [120, 76, 58], { bg: true, flat: true });
    for (let i = 0; i < 4; i++) S.box((p) => add(p, [0, 4.45, WZ + 0.4 + i * 2.4]), 9, 0.14, 0.12, P.beam, { bevel: 0.1, noShadow: true });
    S.box((p) => add(p, [1.2, 4.3, -0.4]), 1.0, 0.04, 0.09, [255, 250, 236], { glow: true, noShadow: true }); // tube light
    // wall: cork board and a red tool chest with drawers; drums and tyres to the side
    S.box((p) => add(p, [-1.6, 2.1, WZ + 0.03]), 0.9, 0.62, 0.03, P.cork, { noShadow: true, paint: (c, w, h) => { c.fillStyle = '#2a2a33'; c.fillRect(w * 0.1, h * 0.2, w * 0.28, h * 0.1); c.fillStyle = 'rgba(255,255,255,0.5)'; c.fillRect(w * 0.55, h * 0.55, w * 0.3, h * 0.2); } });
    const drawers = (c, w, h) => { c.fillStyle = 'rgba(0,0,0,0.22)'; for (let i = 0; i < 4; i++) { c.fillRect(w * 0.06, h * (0.08 + i * 0.23), w * 0.88, h * 0.015); c.fillStyle = '#e8e8ee'; c.fillRect(w * 0.4, h * (0.15 + i * 0.23), w * 0.2, h * 0.03); c.fillStyle = 'rgba(0,0,0,0.22)'; } };
    S.box((p) => add(p, [-2.6, 0.48, WZ + 0.4]), 0.55, 0.48, 0.35, [212, 66, 52], { bevel: 0.05, paint: drawers });
    S.box((p) => add(p, [-2.6, 1.06, WZ + 0.4]), 0.55, 0.1, 0.35, [168, 50, 44], { bevel: 0.2 });
    if (o.props !== false) {
      [[2.6, -2.6], [3.2, -2.3], [2.9, -1.8]].forEach(([x, z], i) => S.cyl((p) => add(p, [x, 0, z]), 0.32, 0.95, P.blue, 16, { stripes: shade(P.blue, 0.9), cap: shade(P.blue, 1.1) }));
      for (let i = 0; i < 3; i++) { S.cyl((p) => add(p, [-3.0, i * 0.24, -1.2]), 0.45, 0.22, P.tire, 18); S.cyl((p) => add(p, [-3.0, i * 0.24 + 0.221, -1.2]), 0.22, 0.003, [70, 70, 78], 14, { caps: true, noShadow: true }); }
    }
  };
  // the red tubular stand the machine sits on (a sloped A-frame with feet)
  const stand = (S, c, w = 0.8, d = 0.55, h = 0.75) => {
    const R = 0.035, col = P.red, p = (x, y, z) => add(c, [x, y, z]);
    S.tube([p(-w, 0.04, -d), p(-w, 0.04, d), p(w, 0.04, d), p(w, 0.04, -d), p(-w, 0.04, -d)], R, col);
    for (const sx of [-1, 1]) { S.tube([p(sx * w, 0.04, d), p(sx * w * 0.7, h, d * 0.15)], R, col); S.tube([p(sx * w, 0.04, -d), p(sx * w * 0.7, h, -d * 0.15)], R, col); S.rod(p(sx * w * 0.7, h, d * 0.15), p(sx * w * 0.7, h, -d * 0.15), R, col); }
    S.rod(p(-w * 0.7, h, 0), p(w * 0.7, h, 0), R, col);
  };
  // the sunset test road: pastel sky (draw as env.bg), hills, low-poly trees, asphalt with orange dashes, barriers
  const sunsetSky = (ctx, W, H_) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#9a86e0'); g.addColorStop(0.35, '#c9a0e6'); g.addColorStop(0.55, '#f2b4c4'); g.addColorStop(0.75, '#f8c8a8'); g.addColorStop(1, '#f6d2b4'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); };
  const tree = (S, x, z, s = 1, seed = 0) => { S.cyl((p) => add(mul(p, s), [x, 0, z]), 0.07, 0.7, P.trunk, 6); const r = H.rng(seed + 3); for (let i = 0; i < 3; i++) S.ico([x + r.range(-0.2, 0.2) * s, (0.95 + i * 0.32) * s, z + r.range(-0.2, 0.2) * s], (0.48 - i * 0.1) * s, i % 2 ? P.tree2 : P.tree, { sub: 0, jit: 0.25, seed: seed + i }); };
  const testRoad = (S, o = {}) => {
    S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 30], [-60, 0, 30]], P.grass, { bg: true, flat: false });
    S.quad([[-60, 0.002, -1.6], [60, 0.002, -1.6], [60, 0.002, 1.6], [-60, 0.002, 1.6]], P.asphalt, { bg: true, paint: (c, w, h) => { c.fillStyle = '#f29a52'; for (let x = 0; x < w; x += 22) c.fillRect(x, h * 0.48, 9, h * 0.04); c.fillStyle = 'rgba(255,255,255,0.75)'; c.fillRect(0, h * 0.06, w, h * 0.012); c.fillRect(0, h * 0.93, w, h * 0.012); } });
    // hills (big low-poly lumps far away)
    const hr = H.rng(9); for (let i = 0; i < 6; i++) S.ico([-24 + i * 10 + hr.range(-3, 3), -2, -26 - hr.range(0, 10)], [7 + hr.range(0, 4), 5 + hr.range(0, 3), 6], i % 2 ? [92, 140, 74] : [80, 128, 66], { sub: 0, jit: 0.15, seed: i, noShadow: true });
    // concrete barriers along the far side of the road, trees behind them
    for (let x = -18; x <= 18; x += 1.25) barrier(S, x, -1.95);
    const tr = H.rng(21); for (let i = 0; i < 26; i++) tree(S, -20 + i * 1.6 + tr.range(-0.4, 0.4), -3.2 - tr.range(0, 4), 1.1 + tr.range(0, 0.6), i);
    if (o.gantry) gantry(S, o.gantry, -0.0);
  };
  const barrier = (S, x, z) => { const prof = [[-0.3, 0], [0.3, 0], [0.12, 0.18], [0.09, 0.42], [-0.09, 0.42], [-0.12, 0.18]]; const a = prof.map(([u, y]) => [x - 0.6, y, z + u]), b = prof.map(([u, y]) => [x + 0.6, y, z + u]), C = [x, 0.2, z]; S.face(a.slice().reverse(), P.barrier, { c: C }); S.face(b, P.barrier, { c: C }); for (let i = 0; i < prof.length; i++) { const j = (i + 1) % prof.length; S.face([a[i], a[j], b[j], b[i]], i === 1 || i === 4 ? P.stripe : P.barrier, { c: C }); } };
  // a steel truss gantry spanning the road at x
  const gantry = (S, x, z) => { const st = [140, 150, 168], r = 0.05, p = (a, b, c) => [x + a, b, z + c]; for (const sz of [-2.4, 2.4]) { S.rod(p(-0.3, 0, sz), p(-0.3, 4, sz), r, st, 6); S.rod(p(0.3, 0, sz), p(0.3, 4, sz), r, st, 6); for (let y = 0; y < 4; y += 0.8) S.rod(p(-0.3, y, sz), p(0.3, y + 0.8, sz), r * 0.6, st, 6); } for (const sy of [3.6, 4.0]) for (const sx of [-0.3, 0.3]) S.rod(p(sx, sy, -2.4), p(sx, sy, 2.4), r, st, 6); for (let zz = -2.4; zz < 2.4; zz += 0.6) S.rod(p(-0.3, 3.6, zz), p(0.3, 4.0, zz + 0.6), r * 0.6, st, 6); };

  // ==================== props ====================
  // a low-poly sports car (body, cabin, wheels); along +x. glass: 0..1 turns the body to x-ray
  const car = (S, x, z, yaw = 0, o = {}) => {
    const T = (p) => add(rotY(p, yaw), [x, o.y || 0, z]), col = o.col || P.white, a = o.glass ? 1 - 0.75 * o.glass : 1, gl = { alpha: a < 1 ? a : undefined };
    const body = [[-1.05, 0.18], [1.05, 0.18], [1.12, 0.36], [0.95, 0.5], [0.25, 0.56], [-0.85, 0.58], [-1.1, 0.48]];
    const cab = [[0.42, 0.55], [0.05, 0.84], [-0.5, 0.84], [-0.78, 0.58]];
    const ext = (prof, hw, cc, ex = {}) => { const A = prof.map(([u, y]) => T([u, y, -hw])), B = prof.map(([u, y]) => T([u, y, hw])), C = T([0, 0.45, 0]); S.face(A.slice().reverse(), cc, { c: C, ...gl, ...ex }); S.face(B, cc, { c: C, ...gl, ...ex }); for (let i = 0; i < prof.length; i++) { const j = (i + 1) % prof.length; S.face([A[i], A[j], B[j], B[i]], cc, { c: C, ...gl, ...ex }); } };
    ext(body, 0.5, col); ext(cab, 0.42, [70, 76, 92], { alpha: a < 1 ? a * 0.8 : 0.85 });
    for (const [u, w] of [[0.68, 1], [-0.68, 1]]) for (const sd of [-1, 1]) { const spin = o.spin || 0; S.cyl((p) => T(add(rotX(rotY(p, spin), Math.PI / 2 * sd), [u, 0.2, sd * 0.42])), 0.2, 0.14, P.tire, 14, { cap: [150, 156, 170], capPaint: (c, w2, h2) => { c.strokeStyle = '#2a2a30'; c.lineWidth = w2 * 0.06; for (let k = 0; k < 5; k++) { const ang = spin + (k / 5) * TAU; c.beginPath(); c.moveTo(w2 / 2, h2 / 2); c.lineTo(w2 / 2 + Math.cos(ang) * w2 * 0.42, h2 / 2 + Math.sin(ang) * h2 * 0.42); c.stroke(); } } }); }
    S.box((p) => T(add(p, [1.1, 0.34, 0])), 0.02, 0.04, 0.4, [255, 236, 200], { glow: true, noShadow: true }); // headlights
    S.box((p) => T(add(p, [-1.11, 0.42, 0])), 0.02, 0.03, 0.42, [255, 70, 60], { glow: true, noShadow: true }); // tail light
  };
  const fuelDrop = (S, c, s = 1, col = P.orange) => { S.ico(add(c, [0, -0.02 * s, 0]), [0.09 * s, 0.09 * s, 0.09 * s], col, { sub: 1, gloss: 0.3, noShadow: true }); S.cyl((p) => add(mul(p, s), add(c, [0, 0.02 * s, 0])), 0.085, 0.12, col, 12, { r2: 0.003, noShadow: true }); };
  // a round dial gauge (face painted with ticks and a needle at fraction v)
  const gauge = (S, c, s, v, yaw = 0) => S.cyl((p) => add(rotY(rotX(mul(p, s), Math.PI / 2), yaw), c), 0.25, 0.06, [40, 40, 46], 24, { cap: [244, 242, 236], capPaint: (cc, w, h) => { cc.save(); cc.translate(w / 2, h / 2); for (let i = 0; i <= 10; i++) { const a = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5; cc.strokeStyle = i > 7 ? '#e04a3a' : i < 3 ? '#4a7ae0' : '#333'; cc.lineWidth = w * 0.025; cc.beginPath(); cc.moveTo(Math.cos(a) * w * 0.32, Math.sin(a) * w * 0.32); cc.lineTo(Math.cos(a) * w * 0.42, Math.sin(a) * w * 0.42); cc.stroke(); } const a = Math.PI * 0.75 + v * Math.PI * 1.5; cc.strokeStyle = '#e04a3a'; cc.lineWidth = w * 0.03; cc.beginPath(); cc.moveTo(0, 0); cc.lineTo(Math.cos(a) * w * 0.36, Math.sin(a) * w * 0.36); cc.stroke(); cc.fillStyle = '#222'; cc.beginPath(); cc.arc(0, 0, w * 0.05, 0, TAU); cc.fill(); cc.restore(); } });

  // ==================== 2D overlays ====================
  const FX = {
    // a light-blue rotation arc with an arrowhead around (x, y) on screen
    spin(ctx, x, y, r, u, a0 = -0.5, col = '#7ad0ff') { if (u <= 0) return; const a1 = a0 + TAU * 0.8 * H.clamp(u); ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = r * 0.1; ctx.shadowColor = 'rgba(80,180,255,0.6)'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); const hx = x + Math.cos(a1) * r, hy = y + Math.sin(a1) * r, ta = a1 + Math.PI / 2, s = r * 0.24; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(hx + Math.cos(ta) * s, hy + Math.sin(ta) * s); ctx.lineTo(hx + Math.cos(ta + 2.4) * s, hy + Math.sin(ta + 2.4) * s); ctx.lineTo(hx + Math.cos(ta - 2.4) * s, hy + Math.sin(ta - 2.4) * s); ctx.closePath(); ctx.fill(); ctx.restore(); },
    // a red "no" ring with a slash
    no(ctx, x, y, r, u) { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(H.ease.back(H.clamp(u)), H.ease.back(H.clamp(u))); ctx.strokeStyle = '#ec4a3a'; ctx.lineWidth = r * 0.18; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, r * 0.7); ctx.stroke(); ctx.restore(); },
    // wavy heat lines rising
    heat(ctx, x, y, w, u, t, col = 'rgba(255,140,80,0.85)') { if (u <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.globalAlpha = Math.min(1, u); for (let i = 0; i < 4; i++) { const x0 = x - w / 2 + (i + 0.5) * (w / 4); ctx.beginPath(); for (let k = 0; k <= 12; k++) { const yy = y - k * 7 * u, xx = x0 + Math.sin(k * 0.9 + t * 8 + i) * 6; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } ctx.restore(); },
    // a quick burst of sparks
    sparks(ctx, x, y, u, seed = 1) { if (u <= 0 || u >= 1) return; const r = H.rng(seed); ctx.save(); ctx.lineCap = 'round'; for (let i = 0; i < 12; i++) { const a = r() * TAU, d0 = 10 + u * r.range(40, 90), d1 = d0 + 16 * (1 - u); ctx.strokeStyle = `rgba(255,${200 + r() * 55},120,${1 - u})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * d0, y + Math.sin(a) * d0); ctx.lineTo(x + Math.cos(a) * d1, y + Math.sin(a) * d1); ctx.stroke(); } ctx.restore(); },
    // confetti falling (the finale)
    confetti(ctx, W, H_, u, t) { if (u <= 0) return; const r = H.rng(44), cols = ['#ffd24a', '#ff6a5a', '#5ad0ff', '#7ee07a', '#ffffff']; ctx.save(); for (let i = 0; i < 70; i++) { const x = r() * W + Math.sin(t * 2 + i) * 20, y = -40 + (u * 1.1 + r() * 0.5) * H_ * 0.9 - r() * 200, a = t * 4 + i; ctx.fillStyle = cols[i % 5]; ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillRect(-6, -3, 12, 6); ctx.restore(); } ctx.restore(); },
  };
  // ONE word at a time, centred in the middle of the frame: heavy white caps, thin dark outline, soft shadow
  const word = (ctx, W, H_, w, t0, t) => {
    if (!w) return; const u = H.clamp((t - t0) / 0.1), s = 1.12 - 0.12 * H.ease.out(u), CC = Object.assign({ px: 62, y: 0.47 }, window.CAPTION_STYLE || {}), q = CC.px / 62;
    ctx.save(); ctx.font = FONT(800, CC.px); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    const mw = ctx.measureText(w).width, k = Math.min(1, (W * 0.86) / mw);
    ctx.translate(W / 2, H_ * CC.y); ctx.scale(s * k, s * k);
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 12 * q; ctx.shadowOffsetY = 3 * q; ctx.strokeStyle = '#1a1820'; ctx.lineWidth = 8 * q; ctx.strokeText(w, 0, 0);
    ctx.shadowColor = 'transparent'; ctx.fillStyle = '#ffffff'; ctx.fillText(w, 0, 0);
    ctx.restore();
  };
  // the caption track: words [{w, t}] -> the current word (each shows until the next one starts, or for at most 0.8 s)
  const captionAt = (words, t) => { let cur = null; for (const x of words) if (x.t <= t) cur = x; else break; if (!cur) return null; const nx = words[words.indexOf(cur) + 1]; if (!nx && t - cur.t > 0.9) return null; if (nx && nx.t - cur.t > 1.2 && t - cur.t > 0.9) return null; return cur; };

  // ==================== finishing ====================
  const finish = (ctx, W, H_, t, flash = 0) => {
    const gl = MXC.glow || (MXC.glow = H.layer(W / 8, H_ / 8)), g = gl.getContext('2d', { willReadFrequently: true });
    g.clearRect(0, 0, W / 8, H_ / 8); g.filter = 'blur(2px)'; g.drawImage(ctx.canvas, 0, 0, W / 8, H_ / 8); g.filter = 'none';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.12; ctx.drawImage(gl, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,190,140,0.16)'; ctx.fillRect(0, 0, W, H_); ctx.restore();
    if (flash > 0.01) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,240,215,${flash})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    { ctx.save(); ctx.globalCompositeOperation = 'multiply'; const g2 = ctx.createLinearGradient(0, 0, 0, H_); g2.addColorStop(0, 'rgba(120,80,90,0.45)'); g2.addColorStop(0.3, 'rgba(255,255,255,0)'); g2.addColorStop(0.75, 'rgba(255,255,255,0)'); g2.addColorStop(1, 'rgba(110,70,70,0.35)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    H.vignette(ctx, W, H_, 0.42, '30,14,20');
    grain(ctx, 0.016, 5 + (Math.floor(t * 24) % 8));
  };
  const grain = (ctx, amount, seed) => {
    const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height), d = img.data, n = d.length;
    MXC.gr = MXC.gr || {}; let gg = MXC.gr[seed + ':' + n];
    if (!gg) { gg = MXC.gr[seed + ':' + n] = new Float32Array(n >> 2); const r = H.rng(seed), k = amount * 255; for (let i = 0; i < gg.length; i++) gg[i] = (r() - 0.5) * k; }
    for (let i = 0, p = 0; i < n; i += 4, p++) { const v = gg[p]; d[i] += v; d[i + 1] += v; d[i + 2] += v; }
    ctx.putImageData(img, 0, 0);
  };
  // word timing from phrases: [[text, [[t0, t1], ...]], ...] -> [{w, t}] (syllable-weighted inside each segment)
  const wordsFrom = (phrases) => {
    const out = [], syl = (w) => Math.max(1, (w.toLowerCase().replace(/[^a-z]/g, '').replace(/e$/, '').match(/[aeiouy]+/g) || []).length);
    for (const [txt, segs] of phrases) { const toks = txt.split(/\s+/), wts = toks.map((x) => syl(x) + 0.35), tot = wts.reduce((a, c) => a + c, 0), spoken = segs.reduce((a, [x, y]) => a + y - x, 0); const at = (u) => { let r = u * spoken; for (const [x, y] of segs) { if (r <= y - x) return x + r; r -= y - x; } return segs[segs.length - 1][1]; }; let acc = 0; toks.forEach((tk, i) => { out.push({ w: tk.toUpperCase().replace(/[^A-Z0-9'%°-]/g, ''), raw: tk, t: at(acc / tot) }); acc += wts[i]; }); }
    return out;
  };

  // ==================== video timing (mechvideos pipeline) ====================
  // window.SCRIPT = [{ chapter, beats: [{ id, phrases: [...] }] }]. window.WORD_TIMES = { beatId: [[t0, t1], ...] } from the
  // ElevenLabs take (chapters voiced one by one, joined with a 0.6 s gap), or null: then estimated (2.7 words/s,
  // 0.35 s after a full stop, 0.2 s after a comma, 0.6 s between chapters).
  const REEL_WORDS = (() => {
    const clean = (tk) => tk.toUpperCase().replace(/[^A-Z0-9'%°-]/g, '');
    const CH = window.SCRIPT || [], out = [], chapters = [];
    const WT = window.WORD_TIMES;
    let t = 0.3;
    CH.forEach((ch, ci) => {
      let first = true;
      for (const b of ch.beats) {
        const text = b.phrases.join(' '), toks = text.match(/\S+/g) || [];
        if (WT && WT[b.id]) {
          toks.forEach((tk, i) => { const s = WT[b.id][i] || WT[b.id][WT[b.id].length - 1]; out.push({ w: clean(tk), raw: tk, t: s[0], e: s[1], beat: b.id, ch: ci }); });
        } else {
          for (const ph of b.phrases.join(' ').match(/[^,.?!;:]+[,.?!;:]*/g) || [text]) {
            const pt = ph.trim().split(/\s+/).filter(Boolean); if (!pt.length) continue;
            const d = pt.length / 2.7, ws = wordsFrom([[pt.join(' '), [[t, t + d]]]]);
            ws.forEach((x, i) => out.push({ ...x, beat: b.id, ch: ci, e: i + 1 < ws.length ? ws[i + 1].t : t + d }));
            t += d + (/[.?!]$/.test(ph.trim()) ? 0.35 : /[,;:]$/.test(ph.trim()) ? 0.2 : 0.05);
          }
          t += 0.1;
        }
        if (first) { const f = out.find((x) => x.beat === b.id); chapters.push({ title: ch.chapter, t: f ? f.t : 0 }); first = false; }
      }
      t += 0.6;
    });
    out.sort((a, b) => a.t - b.t);
    const end = WT ? (window.VOICE_END || out[out.length - 1].e) : out[out.length - 1].e;
    return { words: out, chapters, end, measured: !!WT };
  })();
  const WORDS = REEL_WORDS.words, CHAPTERS = REEL_WORDS.chapters;
  const V = (beat, w, n = 1) => { const W2 = w.toUpperCase().replace(/[^A-Z0-9'%°-]/g, ''); for (const x of WORDS) if (x.beat === beat && x.w === W2 && --n === 0) return x.t; console.warn('V: no word', beat, w); const f = WORDS.find((x) => x.beat === beat); return f ? f.t : 0; };
  const BEAT0 = (beat) => { const f = WORDS.find((x) => x.beat === beat); return f ? f.t : 0; };
  const BEATEND = (beat) => { let e = 0; for (const x of WORDS) if (x.beat === beat) e = x.e; return e; };
  const DURATION = Math.ceil((REEL_WORDS.end + 1.5) * 10) / 10;
  const integ = (sp, t, dt = 1 / 60) => { let a = 0; const n = Math.floor(Math.max(0, t) / dt); for (let i = 0; i < n; i++) a += sp((i + 0.5) * dt) * dt; return a + sp(t) * (Math.max(0, t) - n * dt); };
