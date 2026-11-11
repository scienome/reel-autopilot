/* 3D toy kit (D.toy) for ToyBoxTheory "Let's fix that" reels, on the diorama engine (window.D, three.js r149).
   A sunny toy world at x = 3000 (far from the city): grass, a street with shops, trees, a block of flats with stairs and a balcony,
   and the gold tank (in every reel, never mentioned). Toy people walk, carry, push, panic. A reel builds props once and draws shots.

   const Y = D.toy.world({ shops: [['BAKERY', '#f0c870', '#d0643a'], ...], flats: true, tank: [x, z, rotY] });
   Y.box / Y.mesh / Y.grp / Y.m          make things (positions are inside the toy world, so x = 0 is the middle of the street)
   Y.person({ shirt, pants, hair, hairColor, mood })   -> figure with .walk(phase, amount) .arms(left, right, spread) .sag(k) .reset()
   Y.bag(parent, x, y, z, scale, double)  shopping bag with groceries;  Y.tree(x, z, s);  Y.flats -> { steps, door, balcony, nbWin, nbHole, at }
   D.toy.reel({ order, shots: { id: (S) => view }, overlays(ctx, S), score(k) })   sets window.REEL. In a shot S has
     t, n (shot id), a, b (shot start/end), p (0..1 through the shot), e (eased p), at(k) (start of the shot's k-th line), seg(t0, t1) and E.
     A shot returns a camera view { pos, look, fov, focus, blur, shake } with positions inside the toy world. Y.tag(ctx, S, text, obj, off, t0, colour)
     pins a label to a 3D thing. Captions (one *RED word, | for a new line), the LET'S FIX THAT badge and screen shake are drawn for you.
   badge: false hides the top badge; captions: false skips the popping captions (a reel then draws its own subtitles in overlays).
   Rules: everything random uses Math.random seeded by the engine (never reseed). Keep people and the fix in the middle third:
   captions sit at y 845. Every shot moves the camera a little (push, orbit, follow, tilt). Things are built piece by piece, not popped in. */
(() => {
  const T = D.THREE, K = D.kit, S = D.scene, X0 = 3000;
  const lerp = D.lerp, E = D.ease, clamp = D.clamp;
  const seg = (t, a, b) => clamp((t - a) / Math.max(0.01, b - a), 0, 1);
  const m = (c, o) => K.mat(c, o);
  const W = (x, y, z) => [X0 + x, y, z];
  let built = null;

  function world(o = {}) {
    if (built) return built;
    const root = new T.Group(); root.position.set(X0, 0, 0); S.add(root);
    const box = (p, w, h, d, c, x, y, z, op) => K.box(p || root, w, h, d, c, x, y, z, op);
    const mesh = (p, geo, c, x, y, z) => { const me = new T.Mesh(geo, typeof c === 'string' ? m(c) : c); me.position.set(x, y, z); me.castShadow = true; me.receiveShadow = true; (p || root).add(me); return me; };
    const grp = (p, x = 0, y = 0, z = 0) => { const g = new T.Group(); g.position.set(x, y, z); (p || root).add(g); return g; };
    // light and sky
    const sun = new T.DirectionalLight('#fff1d6', 0.85);
    sun.position.set(X0 - 10, 30, 22); sun.target.position.set(X0 + 6, 0, -2);
    sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 90 });
    sun.shadow.bias = -0.0006; S.add(sun); S.add(sun.target);
    const sky = new T.HemisphereLight('#cfe8ff', '#5a7a3a', 0.38); S.add(sky);
    const skyTex = K.tex(8, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5aa8f0'); g.addColorStop(0.6, '#a8d4fa'); g.addColorStop(1, '#e8f4ff'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    const fog = new T.Fog('#d8ecff', 45, 140);
    // ground and street (street runs along x at z = 3.2, pavement at z = 0.4, shop fronts at z = -0.9)
    const grass = K.tex(256, 256, (x, w, h) => { x.fillStyle = '#6cb84a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { x.fillStyle = Math.random() > 0.5 ? '#5fa83f' : '#7cc858'; x.fillRect(Math.random() * w, Math.random() * h, 2, 5); } }, [30, 30]);
    const ground = mesh(root, new T.PlaneGeometry(200, 200), m('#ffffff', { map: grass, r: 0.95 }), 6, 0, 0); ground.rotation.x = -Math.PI / 2; ground.castShadow = false;
    box(root, 80, 0.04, 4, '#5a5d66', 0, 0.02, 3.2, { r: 0.9 });
    for (let i = -20; i < 20; i++) box(root, 1.2, 0.05, 0.16, '#f4f4f4', i * 2.4, 0.03, 3.2);
    box(root, 80, 0.12, 2.4, '#d8d4cc', 0, 0.06, 0.4, { r: 0.85 });
    const sign = (txt, bg, fg = '#fff') => K.tex(512, 128, (x, w, h) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.font = `${h * 0.62}px ${D.FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, w / 2, h * 0.54); });
    const shop = (x, w, col, txt, sbg) => { const g = grp(root, x, 0, 0); box(g, w, 4.2, 3, col, 0, 2.1, -2.4, { r: 0.8 }); box(g, w - 0.8, 2.2, 0.06, m('#bfe3ff', { e: '#bfe3ff', ei: 0.25, r: 0.2 }), 0, 1.4, -0.88); const s = box(g, w - 0.4, 0.8, 0.12, m('#fff', { map: sign(txt, sbg) }), 0, 3.4, -0.84); s.castShadow = false;
      for (let i = 0; i < 6; i++) box(g, (w - 0.4) / 6, 0.4, 0.5, i % 2 ? '#ffffff' : sbg, -(w - 0.4) / 2 + (i + 0.5) * (w - 0.4) / 6, 2.7, -0.62); return g; };
    const shops = (o.shops || [['BAKERY', '#f0c870', '#d0643a'], ['GROCERY', '#9fd0a0', '#2f8f4a'], ['TOYS', '#c8b0e8', '#7a4ac8']]).map(([txt, col, sbg], i, arr) => shop(-7.5 + i * 6, 5.6, col, txt, sbg));
    const tree = (x, z, s = 1) => { const g = grp(root, x, 0, z); mesh(g, new T.CylinderGeometry(0.16 * s, 0.22 * s, 1.6 * s, 10), '#8a5a34', 0, 0.8 * s, 0); mesh(g, new T.SphereGeometry(1.1 * s, 16, 12), m('#4f9a48', { r: 0.9 }), 0, 2.2 * s, 0); mesh(g, new T.SphereGeometry(0.8 * s, 14, 10), m('#5fae52', { r: 0.9 }), 0.5 * s, 2.7 * s, 0.2); return g; };
    (o.trees || [[-11, -1.2], [9.6, -1.6], [-14, 7], [26, -3], [-20, -2]]).forEach(([x, z], i) => tree(x, z, 1 + (i % 3) * 0.15));
    // the gold tank
    const GOLD = m('#e3b23c', { m: 0.65, r: 0.32 }), DGOLD = m('#b8862a', { m: 0.6, r: 0.4 });
    const tank = grp(root, ...(o.tank ? [o.tank[0], 0, o.tank[1]] : [8.8, 0, -1.2]));
    for (const d of [-1, 1]) { box(tank, 3.4, 0.6, 0.6, '#3a3a42', 0, 0.32, d * 0.95); for (let i = 0; i < 6; i++) mesh(tank, new T.CylinderGeometry(0.24, 0.24, 0.64, 14), '#55555e', -1.25 + i * 0.5, 0.32, d * 0.95).rotation.x = Math.PI / 2; }
    box(tank, 3.2, 0.55, 1.6, GOLD, 0, 0.85, 0); tank.turret = grp(tank, -0.2, 1.3, 0); box(tank.turret, 1.5, 0.5, 1.2, DGOLD, 0, 0, 0); mesh(tank.turret, new T.CylinderGeometry(0.1, 0.12, 2.2, 12), GOLD, 1.7, 0.05, 0).rotation.z = Math.PI / 2;
    tank.rotation.y = o.tank ? o.tank[2] || 0 : 0.9; tank.scale.setScalar(0.85);
    // block of flats with outside stairs (to the floor-1 door), your balcony, the neighbour's window
    let flats = null;
    if (o.flats !== false) {
      const BX = 16, BZ = -3.2, fl = grp(root, BX, 0, BZ), steel = m('#c4c8d0', { m: 0.7, r: 0.3 });
      box(fl, 9, 10.5, 5, '#d98a62', 0, 5.25, 0, { r: 0.85 });
      const winM = m('#cfe9ff', { e: '#9fd2ff', ei: 0.2, r: 0.15 });
      for (let f = 0; f < 3; f++) for (const wx of [-3, 0, 3]) { if (f === 1 && wx >= 0) continue; box(fl, 1.4, 1.5, 0.08, winM, wx, 1.9 + f * 3.3, 2.52); box(fl, 1.6, 0.14, 0.2, '#f4ece0', wx, 1.1 + f * 3.3, 2.58); }
      const nbWin = box(fl, 1.4, 1.5, 0.08, m('#cfe9ff', { e: '#9fd2ff', ei: 0.25, r: 0.1, tr: true, op: 0.85 }), 0, 5.2, 2.52);
      const nbHole = box(fl, 1.36, 1.46, 0.05, '#2a2430', 0, 5.2, 2.5); nbHole.visible = false;
      const door = box(fl, 1.2, 2.2, 0.08, '#7a4a2a', 3, 4.5, 2.52);
      const balcony = grp(fl, 3, 3.45, 3.3); box(balcony, 2.6, 0.18, 1.6, '#e8e4dc', 0, 0, 0); box(balcony, 2.6, 0.7, 0.06, steel, 0, 0.45, 0.78);
      const steps = []; for (let i = 0; i < 14; i++) { const s = box(root, 1.6, 0.24, 0.42, '#b8b8c0', BX - 4.6 + i * 0.42, 0.12 + i * 0.245, BZ + 3.3); s.home = s.position.clone(); steps.push(s); }
      flats = { g: fl, BX, BZ, steps, door, balcony, nbWin, nbHole, foot: [BX - 4.6, BZ + 3.3], at: (x, y, z) => [BX + x, y, BZ + z],
        reset() { steps.forEach((s) => { s.position.copy(s.home); s.rotation.set(0, 0, 0); s.visible = true; }); nbWin.visible = true; nbHole.visible = false; } };
    }
    // people
    const people = [];
    const person = (po) => {
      const f = D.figure(Object.assign({ shirt: '#3a78d8', pants: '#2b2f3a', hair: 'short', hairColor: '#4a3020', mood: 'calm' }, po)); root.add(f);
      const [lA, sA, lB, sB] = [f.children[0], f.children[1], f.children[2], f.children[3]], u = f.userData;
      f.walk = (ph, amt = 1) => { const a = Math.sin(ph) * 0.45 * amt; lA.rotation.x = a; lB.rotation.x = -a; sA.position.z = 0.05 + Math.sin(ph) * 0.2 * amt; sB.position.z = 0.05 - Math.sin(ph) * 0.2 * amt; u.body.position.y = 1.08 + Math.abs(Math.cos(ph)) * 0.05 * amt; };
      f.arms = (l, r, spread = 0.12) => { u.arms[0].rotation.x = l; u.arms[1].rotation.x = r; u.arms[0].rotation.z = -spread; u.arms[1].rotation.z = spread; };
      f.sag = (k) => { u.body.position.y = 1.08 - k * 0.2; u.head.position.y = 1.86 - k * 0.25; u.arms.forEach((A) => { A.position.y = 1.38 - k * 0.22; }); };
      f.reset = () => { f.walk(0, 0); f.arms(0, 0); f.sag(0); u.head.rotation.set(0, 0, 0); f.rotation.set(0, 0, 0); f.visible = true; f.scale.setScalar(1); };
      f.hand = (i) => u.arms[i]; // attach things at (0, -0.98, 0) to hold them
      people.push(f); return f;
    };
    // shopping bag with groceries
    const ITEM = ['#e04040', '#f0c838', '#5ab04a', '#ffffff', '#ff8a2a'], bagMat = m('#efe6d2', { r: 0.85 }), bag2Mat = m('#bfe0b0', { r: 0.85 });
    const bag = (p, x, y, z, s = 1, dbl = false) => { const g = grp(p, x, y, z); g.scale.setScalar(s); box(g, 0.55, 0.6, 0.32, bagMat, 0, 0, 0); const outer = box(g, 0.6, 0.62, 0.36, bag2Mat, 0, -0.01, 0); outer.visible = dbl; g.outer = outer;
      const h = mesh(g, new T.TorusGeometry(0.16, 0.025, 6, 16, Math.PI), bagMat, 0, 0.3, 0); h.castShadow = false;
      [[-0.15, 0.36, 0.05, 0], [0.12, 0.4, -0.04, 1], [0, 0.34, 0.08, 2]].forEach(([a, b, c, k]) => { if (k === 1) box(g, 0.1, 0.32, 0.1, ITEM[k], a, b, c); else mesh(g, new T.SphereGeometry(0.1, 10, 8), ITEM[k], a, b, c); });
      return g; };
    // flying bits: debris(n, colours, size) -> array; place each frame with Y.fly(list, origin, k, spread)
    const debris = (n, cols, size = 0.14, o2 = {}) => Array.from({ length: n }, (_, i) => (o2.round && i % 2 ? mesh(root, new T.SphereGeometry(size * 0.75, 10, 8), cols[i % cols.length], 0, -9, 0) : box(root, size, size * (o2.flat ? 0.15 : 1), size, typeof cols[i % cols.length] === 'string' ? m(cols[i % cols.length], o2.mat) : cols[i % cols.length], 0, -9, 0)));
    const fly = (list, [ox, oy, oz], k, sp = 1, floor = 0.08) => list.forEach((q, i) => { if (k <= 0) { q.position.y = -9; return; } const vx = (((i * 37) % 11) - 5) * 0.32 * sp, vz = ((i * 17) % 7 - 2) * 0.3 * sp, kk = Math.min(k, 2.5); q.position.set(ox + vx * Math.min(kk, 0.7), Math.max(floor, oy + 2.2 * kk - 7 * kk * kk), oz + vz * Math.min(kk, 0.7)); q.rotation.set(kk * 7 + i, kk * 5, i); });
    const wind = debris(6, [m('#ffffff', { tr: true, op: 0.7 })], 1).map((w) => { w.scale.set(1.6, 0.04, 0.04); w.castShadow = false; return w; });
    built = { X0, root, box, mesh, grp, m, sign, tex: K.tex, tree, shops, tank, flats, person, people, bag, debris, fly, wind, W, GOLD, DGOLD, ITEM, sky: { sun, sky, skyTex, fog },
      blowWind(t, y0 = 3.5, z0 = 1.5, on = true) { wind.forEach((w, i) => { const k = (t * 0.9 + i / 6) % 1; w.position.set(on ? -6 + k * 30 : 0, on ? y0 + i * 0.6 : -9, z0 + (i % 2)); }); },
      tag(ctx, St, txt, obj, off, t0, bg = D.PINK) { if (St.t < t0) return; const q = D.screen(obj, off); D.label(ctx, txt, clamp(q.x, 110, 610), clamp(q.y, 170, 760), null, null, St.t, t0, St.b, { bg, fg: '#fff', size: 40 }); } };
    return built;
  }

  function reel(o) {
    const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, order = o.order;
    const st = (n) => TM.shots[n];
    const lines = (n) => L.filter((l) => l.shot === n);
    function draw(ctx, t) {
      const Y = built;
      let n = order[0]; order.forEach((s) => { if (t >= st(s)) n = s; });
      const i = order.indexOf(n), a = st(n), b = i + 1 < order.length ? st(order[i + 1]) : DURATION, p = seg(t, a, b);
      const St = { t, n, a, b, p, e: E(p), E, lerp, seg: (t0, t1) => seg(t, t0, t1), at: (k = 0) => (lines(n)[k] || lines(n)[lines(n).length - 1] || { t0: a }).t0, line: (sh, k = 0) => (lines(sh)[k] || { t0: st(sh) }).t0 };
      if (D.city) D.city.mode('interior'); // switches off the city's own sun, which otherwise bleaches the toy world white
      S.background = Y.sky.skyTex; S.fog = Y.sky.fog;
      K.lights.moon.intensity = 0; K.lights.lvKey.intensity = 0; K.lights.hemi.intensity = 0;
      Y.people.forEach((f) => f.reset()); if (Y.flats) Y.flats.reset(); Y.blowWind(t, 0, 0, false);
      if (o.reset) o.reset(St);
      const v = Object.assign({ fov: 38, focus: [0.3, 0.85], blur: 4 }, o.shots[n](St));
      if (v.shake) { const k = v.shake; v.pos = [v.pos[0] + Math.sin(t * 53) * 0.12 * k, v.pos[1] + Math.sin(t * 41) * 0.1 * k, v.pos[2]]; }
      D.render3d(ctx, { ...v, pos: W(...v.pos), look: W(...v.look) });
      ctx.save(); ctx.filter = 'saturate(1.7) contrast(1.15)'; ctx.drawImage(ctx.canvas, 0, 0); ctx.restore(); // rich toy colours
      if (o.badge !== false) D.label(ctx, o.badge || "LET'S FIX THAT", 360, 118, null, null, t, 0, 1e9, { bg: '#c2412c', fg: '#fff', size: 30 });
      if (o.overlays) o.overlays(ctx, St);
      if (o.captions !== false) L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, o.capY || 845));
    }
    const at = (sh, k = 0) => (lines(sh)[k] || { t0: st(sh) }).t0;
    function score(k) {
      L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.2, gain: 0.18, minor: true }));
      if (o.score) o.score(k, at);
    }
    window.REEL = { DURATION, draw, score };
  }

  D.toy = { world, reel, seg, X0 };
})();
