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
    // the brick figure: block legs, chunky torso, swinging arms, cube head with a printed face and a hat
    const figure = (x, z, s, rot, o = {}) => {
      const bob = o.bob || 0, T0 = (p) => add(rotY(mul(p, s), rot), [x, bob, z]);
      const legA = o.walk ? Math.sin(o.walk) * 0.5 : 0;
      for (const sd of [-1, 1]) box((p) => T0(add(rotX(add(p, [0, -0.32, 0]), legA * sd), [sd * 0.17, 0.66, 0])), 0.15, 0.32, 0.16, o.pants || P.denim, { bevel: 0.25 });
      box((p) => T0(add(p, [0, 1.2, 0])), 0.36, 0.3, 0.2, o.shirt || P.tan, { bevel: 0.3, paint: o.shirtPaint });
      const arms = o.arms || [0.15, 0.15]; // radians, positive = raised outward
      for (const sd of [-1, 1]) {
        const ang = arms[sd < 0 ? 0 : 1];
        box((p) => T0(add(rotZ(add(p, [0, -0.26, 0]), sd * ang), [sd * 0.47, 1.42, 0])), 0.1, 0.27, 0.12, o.shirt || P.tan, { bevel: 0.35 });
        box((p) => T0(add(rotZ(add(p, [0, -0.6, 0]), sd * ang), [sd * 0.47, 1.42, 0])), 0.1, 0.08, 0.1, o.skin || P.skin, { bevel: 0.4 });
      }
      const face2 = (c, w, h) => { // printed face: two dots and a little smile
        c.fillStyle = '#2a2a33'; const ex = o.look || 0;
        c.beginPath(); c.ellipse(w * (0.34 + ex), h * 0.45, w * 0.055, h * 0.08, 0, 0, TAU); c.fill();
        c.beginPath(); c.ellipse(w * (0.66 + ex), h * 0.45, w * 0.055, h * 0.08, 0, 0, TAU); c.fill();
        c.lineWidth = w * 0.045; c.lineCap = 'round'; c.strokeStyle = '#2a2a33'; c.beginPath();
        if (o.mouth === 'o') c.arc(w * (0.5 + ex), h * 0.72, w * 0.06, 0, TAU); else c.arc(w * (0.5 + ex), h * 0.62, w * 0.14, 0.25 * Math.PI, 0.75 * Math.PI);
        c.stroke();
      };
      box((p) => T0(add(rotY(p, o.headTurn || 0), [0, 1.86, 0])), 0.3, 0.3, 0.28, o.skin || P.skin, { bevel: 0.28, paint: face2 });
      if (o.hat === 'cap') { box((p) => T0(add(p, [0, 2.2, -0.02])), 0.32, 0.07, 0.3, o.hatCol || P.blue, { bevel: 0.4 }); box((p) => T0(add(p, [0, 2.14, 0.34])), 0.28, 0.025, 0.12, o.hatCol || P.blue, { bevel: 0.4 }); }
      if (o.hat === 'hard') { cyl((p) => T0(add(p, [0, 2.12, 0])), 0.34, 0.16, P.yellow, 16); cyl((p) => T0(add(p, [0, 2.1, 0])), 0.42, 0.03, P.yellow, 16); }
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
    return { proj, box, cyl, brick, figure, tag, render, faces, E, TG };
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

  // ==================== EXPLAINER: "How does AI learn?" (9:16 reel) ====================
  // Five shots with hard cuts (the toy-film way), one roll-up-shutter reveal; a slow push inside every shot;
  // captions pop word by word in the upper third; numbers are red plastic tags in the lower third that pop and count.
  const SHOTS = [0, 3.0, 6.1, 10.2, 12.8, 15];
  const EXPLAIN = (ctx, W, H_, t) => {
    const shot = SHOTS.findIndex((s, i) => t >= s && t < SHOTS[i + 1]), s0 = SHOTS[Math.max(0, shot)], s1 = SHOTS[Math.max(0, shot) + 1] || 15;
    let flash = 0;
    if (shot <= 0) { // 1 HOOK: on the lawn, a figure meets the machine
      const [E, TG] = shotCam(t, s0, s1, [0.2, 2.3, 7.4], [0.1, 1.05, 0], [0.15, 2.0, 6.3], [0.1, 1.1, 0]);
      const S = Scene(E, TG, W, H_);
      S.figure(-0.95, 0.9, 0.95, 0.45, { hat: 'cap', shirt: P.orange, bob: Math.abs(Math.sin(t * 5)) * 0.03, arms: [0.15, 0.2 + 0.9 * popU(t, 1.4)], look: 0.04 });
      machine(S, 0.95, -0.3, 0.9, (c, w, h) => { c.font = FONT(800, h * 0.34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#7ef05a'; c.fillText('AI', w / 2, h * 0.44); });
      const q = popU(t, 1.6, 0.4); if (q > 0) S.tag(-0.3, 2.2, 0.9, '?', q, 0.12, P.yellow, 0.28);
      grassSet(ctx, W, H_, S, t); S.render(ctx, W, H_, {});
      caption(ctx, W, [['How', 'does'], [['AI', 'g'], ['learn?', 'g']]], 0.2, t);
    } else if (shot === 1) { // 2 DATA: a belt feeds picture cubes into the machine; the count tag climbs
      const [E, TG] = shotCam(t, s0, s1, [-0.2, 2.6, 8.0], [0.2, 0.9, 0], [0.0, 2.3, 7.0], [0.25, 0.9, 0]);
      const S = Scene(E, TG, W, H_);
      S.box((p) => add(p, [-1.2, 0.32, 0.2]), 1.9, 0.12, 0.42, P.dark, { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#ffcf33'; for (let x = -1; x < 12; x++) { const o = ((t * 2.2) % 1) * (w / 10); c.beginPath(); c.moveTo(x * w / 10 + o, h * 0.2); c.lineTo(x * w / 10 + o + w / 20, h * 0.5); c.lineTo(x * w / 10 + o, h * 0.8); c.lineTo(x * w / 10 + o + w / 40, h * 0.8); c.lineTo(x * w / 10 + o + w / 14, h * 0.5); c.lineTo(x * w / 10 + o + w / 40, h * 0.2); c.fill(); } } });
      for (let i = 0; i < 9; i++) { // cubes ride the belt and vanish into the machine's side
        const st = 3.0 + i * 0.32, x = -3.2 + (t - st) * 1.7; if (t < st || x > 0.75) continue;
        S.box((p) => add(rotY(p, 0.2), [x, 0.66 + Math.abs(Math.sin((t - st) * 9)) * 0.02, 0.2]), 0.22, 0.22, 0.22, P.white, { bevel: 0.2, paint: portrait(i % 3 ? 'dog' : 'cat') });
      }
      machine(S, 1.55, -0.3, 0.9, (c, w, h) => { const n = Math.floor(t * 8) % 2; c.fillStyle = n ? '#7ef05a' : '#4cc0ff'; for (let k = 0; k < 6; k++) c.fillRect(w * (0.18 + k * 0.11), h * (0.6 - 0.32 * Math.abs(Math.sin(t * 6 + k))), w * 0.07, h * 0.32 * Math.abs(Math.sin(t * 6 + k))); });
      const u = H.clamp((Math.floor(t * 12) / 12 - 3.4) / 2.0), n = Math.round(1e6 * Math.pow(u, 2.2));
      S.tag(0.1, 0.55, 2.3, n.toLocaleString('en-US'), popU(t, 3.3), -0.05, P.red, 1.25);
      studioSet(ctx, W, H_, S); S.render(ctx, W, H_, { sky: [210, 225, 255], ground: [110, 150, 230] });
      caption(ctx, W, [['It', 'studies', ['examples.', 'y']], ['Lots', 'of', 'them.']], 3.15, t);
    } else if (shot === 2) { // 3 GUESS -> CHECK -> ADJUST: wrong answer slammed with a red X, the knob turns, then right
      const push = H.ease.inOut(H.clamp((t - 7.85) / 0.35)) * (1 - H.ease.inOut(H.clamp((t - 8.7) / 0.5)));
      const [E0, T0] = shotCam(t, s0, s1, [0.4, 2.4, 7.0], [0.3, 1.25, 0], [0.3, 2.2, 6.2], [0.3, 1.3, 0]);
      const E = E0.map((v, i) => H.lerp(v, [0.6, 2.4, 4.6][i], push)), TG = T0.map((v, i) => H.lerp(v, [0.55, 1.55, 0][i], push));
      const S = Scene(E, TG, W, H_);
      const verdict = t < 9.35 ? 'dog' : 'cat';
      machine(S, 0.55, -0.3, 0.95, (c, w, h) => { c.font = FONT(800, h * 0.26); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = verdict === 'dog' ? '#ffffff' : '#7ef05a'; if (t > 6.9) c.fillText(verdict === 'dog' ? 'dog?' : 'cat!', w / 2, h * 0.44); }, t < 8.6 ? 0 : -2.4 * H.ease.inOut(H.clamp((t - 8.6) / 0.6)));
      const pc = popU(t, 6.3); if (pc > 0) S.box((p) => add(rotY(mul(p, pc), 0.3), [-0.55, 0.35, 1.3]), 0.32, 0.32, 0.32, P.white, { bevel: 0.2, paint: portrait('cat') });
      S.figure(-1.3, 0.3, 0.8, 0.6, { hat: 'hard', shirt: P.red, arms: [0.15, 0.2 + (t > 8.5 && t < 9.4 ? 1.2 : 0)], mouth: t > 7.9 && t < 9.3 ? 'o' : null });
      const xd = H.clamp((t - 7.9) / 0.22);
      if (t > 7.9 && t < 9.35) { const y = 2.15 + (1 - H.ease.out(xd)) * 2.2 - Math.sin(H.clamp((t - 8.12) / 0.25) * Math.PI) * 0.08; for (const a of [0.78, -0.78]) S.box((p) => add(rotZ(p, a), [0.55, y, 0.2]), 0.5, 0.11, 0.11, P.red, { bevel: 0.35 }); }
      const ck = popU(t, 9.45, 0.4); if (ck > 0) { S.box((p) => add(rotZ(mul(p, ck), -0.8), [0.33, 2.18, 0.2]), 0.2, 0.1, 0.1, P.green, { bevel: 0.35 }); S.box((p) => add(rotZ(mul(p, ck), 0.9), [0.72, 2.32, 0.2]), 0.4, 0.1, 0.1, P.green, { bevel: 0.35 }); }
      studioSet(ctx, W, H_, S); S.render(ctx, W, H_, { sky: [210, 225, 255], ground: [110, 150, 230] });
      flash = Math.max(0.22 * Math.exp(-Math.pow((t - 8.05) * 6, 2)), 0.15 * Math.exp(-Math.pow((t - 9.55) * 6, 2)));
      if (t < 7.85) caption(ctx, W, [['First,', 'it', 'makes'], ['a', ['guess.', 'o']]], 6.2, t);
      else if (t < 8.6) caption(ctx, W, [[['Wrong!', 'r']]], 7.9, t);
      else caption(ctx, W, [['So', 'it', ['adjusts', 'g']], ['itself.']], 8.65, t);
    } else if (shot === 3) { // 4 PROGRESS: the shutter rolls up on a lawn where brick columns stack up; accuracy counts
      const [E, TG] = shotCam(t, s0, s1, [0.2, 2.5, 7.8], [0.1, 1.3, 0], [0.1, 2.3, 6.9], [0.1, 1.35, 0]);
      const S = Scene(E, TG, W, H_);
      const accs = [61, 80, 90, 95, 97]; let shown = 61;
      accs.forEach((a, i) => {
        const n = Math.round((a - 52) / 9), x = -1.25 + i * 0.62;
        for (let k = 0; k < n; k++) { const st = 10.75 + i * 0.22 + k * 0.05, u = H.clamp((t - st) / 0.22); if (u <= 0) continue; S.brick(x, k * 0.38, -0.3, 1, 1, i === 4 ? P.red : [P.yellow, P.blue, P.green, P.orange][i % 4], 0, (1 - H.ease.out(u)) * 1.6); }
        if (t > 10.75 + i * 0.22) shown = H.lerp(i ? accs[i - 1] : 61, a, H.clamp((t - 10.75 - i * 0.22) / 0.22));
      });
      S.tag(0.1, 0.42, 2.3, Math.round(shown) + '%', popU(t, 10.8), -0.06, Math.round(shown) >= 97 ? P.green : P.red, 0.85);
      S.figure(-1.9, 1.0, 0.7, 0.5, { hat: 'cap', shirt: P.blue, arms: [t > 12.0 ? 2.6 : 0.15, t > 12.0 ? 2.6 : 0.15], bob: t > 12.0 ? Math.abs(Math.sin((t - 12.0) * 9)) * 0.12 : 0 });
      grassSet(ctx, W, H_, S, t); S.render(ctx, W, H_, {});
      flash = 0.16 * Math.exp(-Math.pow((t - 12.05) * 6, 2));
      caption(ctx, W, [['Every', 'round,'], ['it', 'gets', ['better.', 'g']]], 10.95, t);
      shutter(ctx, W, H_, H.clamp((t - 10.2) / 0.62));
    } else { // 5 TAKEAWAY: the figure jumps beside the machine; brick confetti
      const [E, TG] = shotCam(t, s0, s1, [0.1, 2.1, 7.0], [0.1, 1.15, 0], [0.05, 1.9, 6.1], [0.1, 1.2, 0]);
      const S = Scene(E, TG, W, H_);
      const j = Math.max(0, Math.sin((t - 13.2) * 7)) * 0.45 * (t > 13.2 && t < 14.4 ? 1 : 0);
      S.figure(-0.75, 0.9, 0.95, 0.35, { hat: 'cap', shirt: P.orange, bob: j, arms: [2.5, 2.5] });
      machine(S, 0.95, -0.4, 0.85, (c, w, h) => { c.font = FONT(800, h * 0.26); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#7ef05a'; c.fillText('97%', w / 2, h * 0.44); });
      const r = H.rng(5); for (let i = 0; i < 16; i++) { const st = 13.25 + r() * 0.3, x0 = r.range(-1.9, 1.9), vy = r.range(2.6, 3.8), vx = r.range(-0.5, 0.5), z0 = r.range(-0.5, 1.2), u = t - st; if (u < 0) continue; const y = 0.5 + vy * u - 4.9 * u * u * 0.6; if (y < 0.1) continue; S.box((p) => add(rotZ(rotX(p, u * 3 + i), u * 2.5), [x0 + vx * u, y, z0]), 0.13, 0.1, 0.13, [P.red, P.yellow, P.blue, P.green][i % 4], { bevel: 0.25 }); }
      grassSet(ctx, W, H_, S, t); S.render(ctx, W, H_, {});
      caption(ctx, W, [['More', ['examples', 'y']], ['→', ['better', 'g'], ['guesses.', 'g']]], 12.95, t, 0.14);
    }
    finish(ctx, W, H_, t, flash);
  };

  // ==================== the hero still: a brick tower snaps together on the lawn ====================
  const HERO = (ctx, W, H_, t) => {
    const [E, TG] = shotCam(t, 0, 6.5, [0.4, 2.3, 7.6], [0.1, 1.1, 0], [0.3, 2.0, 6.6], [0.1, 1.15, 0]);
    const S = Scene(E, TG, W, H_);
    const plan = [[-1.2, 0, -0.4, 2, 2, P.red], [-1.2, 1, -0.4, 2, 2, P.yellow], [-1.2, 2, -0.4, 2, 2, P.blue], [-1.2, 3, -0.4, 2, 2, P.green], [-1.2, 4, -0.4, 2, 1, P.orange], [-0.55, 0, 0.6, 1, 1, P.white], [1.5, 0, -0.8, 2, 2, P.teal], [1.5, 1, -0.8, 2, 1, P.yellow]];
    plan.forEach(([x, k, z, nx, nz, col], i) => { const st = 0.3 + i * 0.32, u = H.clamp((t - st) / 0.3); if (u <= 0) return; S.brick(x, k * 0.38, z, nx, nz, col, 0.1 * (i % 3 - 1), (1 - H.ease.out(u)) * 2.0); });
    S.figure(0.75, 0.6, 0.95, -0.3, { hat: 'hard', shirt: P.blue, arms: [0.15, 0.2 + 2.2 * popU(t, 3.0, 0.4) + Math.sin(t * 7) * 0.25 * (t > 3.4 ? 1 : 0)], bob: t > 3.0 && t < 3.6 ? Math.sin((t - 3.0) / 0.6 * Math.PI) * 0.25 : 0 });
    S.tag(0.0, 0.5, 2.0, Math.round(Math.min(8, Math.max(0, (t - 0.3) / 0.32))) + ' bricks', popU(t, 0.5), -0.06, P.red, 1.1);
    grassSet(ctx, W, H_, S, t); S.render(ctx, W, H_, {});
    caption(ctx, W, [['Everything', 'is'], [['built', 'y'], 'from', 'bricks.']], 3.6, t);
    finish(ctx, W, H_, t, 0.15 * Math.exp(-Math.pow((t - 2.9) * 6, 2)));
  };

  registerStyle({
    id: 'bricktoy',
    name: 'Brick Toy',
    category: '3D Toy',
    description: 'Chunky plastic brick figures in a bright toy diorama, shot as a vertical 9:16 reel: bevelled bricks with studs, glossy plastic highlights, soft shadows on a grass lawn or a blue tiled studio, a soft-focus background and big red number tags.',
    motion: 'Bricks drop in and snap together with a bounce, figures bob and wave, tags pop in and count up, the camera pushes in slowly on every shot and cuts hard between them.',
    fonts: ['600 46px "Poppins"', '800 40px "Poppins"'],
    frameT: 6.2,
    duration: 6.5,
    readsPixels: true,
    explainerDuration: 15,
    explainerNote: 'A toy-film explainer told in short shots with hard cuts: each shot is a little diorama the camera slowly pushes into, captions pop word by word with the keyword in toy colours, numbers are red plastic tags that pop in and count, the wrong answer gets a red brick X slammed on top with a push-in and a flash, and one shot is revealed by a roll-up shutter.',
    draw(ctx, W, H_, t) { HERO(ctx, W, H_, t); },
    explainer(ctx, W, H_, t) { EXPLAIN(ctx, W, H_, t); },
    // Sound: a toy box on a bright day. Bricks clack when they land and click when studs seat; figures land with a soft
    // plastic tock; tags pop; counters tick like a plastic dial; each hard cut gets a tiny swish; the shutter rattles up;
    // the wrong answer is a plastic slam plus a low buzz; the right answer and the takeaway chime. Times mirror EXPLAIN().
    explainerSound(k) {
      const clack = (t, g = 1, p = 0) => { k.noise(t, { dur: 0.03, filter: 'bandpass', f: 2600, q: 1.6, gain: 0.32 * g, a: 0.001, pan: p, minor: true }); k.tone(t, { f: [[0, 520], [0.05, 380]], dur: 0.06, gain: 0.12 * g, pan: p, minor: true }); };
      const seat = (t, g = 1, p = 0) => { clack(t, g, p); k.noise(t + 0.035, { dur: 0.012, filter: 'highpass', f: 4200, gain: 0.18 * g, a: 0.001, pan: p, minor: true }); }; // stud clicks home
      const cut = (t) => k.play('swish', t - 0.04, { dur: 0.12, gain: 0.35, minor: true });
      const words = (t0, n, per = 0.12) => { for (let i = 0; i < n; i++) k.play('tick', t0 + i * per, { f: 3400, gain: 0.25, minor: true }); };
      k.bed('room', 0, 15, { gain: 0.25 });
      k.music('pulse', 0, 15, { bpm: 112, gain: 0.35, chords: [['C4', 'E4', 'G4', 'A4'], ['F3', 'A3', 'C4', 'E4'], ['G3', 'B3', 'D4', 'G4'], ['C4', 'E4', 'G4', 'C5']] });
      // 1 hook
      words(0.2, 4); k.play('pop', 1.6, { f: 700, gain: 0.6, pan: -0.3 });
      // 2 data
      cut(3.0); words(3.15, 6); k.play('pop', 3.3, { f: 560, gain: 0.7, pan: -0.4 });
      k.play('roller', 3.05, { dur: 2.9, gain: 0.35, pan: -0.2 });
      for (let i = 0; i < 9; i++) { const st = 3.1 + i * 0.32; clack(st + 0.02, 0.5, -0.6); clack(st + (1.05 + 4.0) / 1.9, 0.6, 0.5); }
      for (let f = Math.ceil(3.4 * 12); f < 5.4 * 12; f += 2) k.play('count', f / 12, { gain: 0.8, f: 3000 + (f - 41) * 30, pan: -0.4 });
      k.play('tock', 5.4, { f: 440, gain: 0.5, pan: -0.4 });
      // 3 guess / wrong / adjust / right
      cut(6.1); words(6.2, 5); k.play('pop', 6.3, { f: 620, gain: 0.6, pan: -0.5 });
      k.play('blip', 6.9, { f: 'E5', gain: 0.8, pan: 0.2 });
      k.play('slap', 8.12, { gain: 0.7, pan: 0.2 }); k.play('thud', 8.12, { f: 110, gain: 0.7 }); k.play('buzz', 8.15, { f: 98, dur: 0.35, gain: 0.7 }); words(7.9, 1);
      words(8.65, 4); k.play('roller', 8.6, { dur: 0.6, gain: 0.4, pan: 0.5 });
      for (let i = 0; i < 6; i++) k.play('tock', 8.62 + i * 0.1, { f: 900 - i * 40, gain: 0.25, pan: 0.5, minor: true }); // knob detents
      k.play('success', 9.5, { f: 'C6', gain: 0.6, pan: 0.2 });
      // 4 progress: the shutter rattles up, bricks stack, the % ticks, 97% lands
      k.play('roller', 10.18, { dur: 0.62, gain: 0.8 }); k.play('thud', 10.8, { f: 140, gain: 0.35 });
      [61, 72, 80, 86, 90, 93, 95, 97].forEach((a, i) => { const n = Math.round((a - 50) / 6.5); for (let j = 0; j < n; j++) seat(10.75 + i * 0.16 + j * 0.05 + 0.22, 0.45, -0.6 + i * 0.12); });
      words(10.95, 5); k.play('pop', 10.8, { f: 520, gain: 0.6, pan: 0.6 });
      k.play('impact', 12.1, { gain: 0.8, pan: 0.5 }); k.play('ding', 12.12, { f: 'E6', gain: 0.5, pan: 0.5 });
      // 5 takeaway
      cut(12.8); words(12.95, 5, 0.14);
      k.play('jump', 13.2, { gain: 0.6 }); for (let i = 0; i < 14; i++) clack(13.6 + i * 0.05, 0.3, (i % 5 - 2) * 0.25);
      ['C5', 'E5', 'G5', 'C6'].forEach((f, i) => k.play('ding', 13.75 + i * 0.08, { f, gain: 0.42 - i * 0.04, pan: (i - 1.5) * 0.25 }));
    },
  });
}
