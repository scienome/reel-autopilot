// Toy reel test in the 3D engine: "Let's fix that" chain, shopping bags. A world of its own at x = 3000.
(() => {
  const TM = window.TIMING, L = TM.lines, DURATION = TM.duration, T = D.THREE, K = D.kit, S = D.scene;
  const X0 = 3000;
  const order = ['hook', 'fix', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'twist', 'close'];
  const st = (n) => TM.shots[n];
  const span = (n) => { const i = order.indexOf(n); return [st(n), i + 1 < order.length ? st(order[i + 1]) : DURATION]; };
  const lines = (n) => L.filter((l) => l.shot === n);
  const at = (n, k = 0) => (lines(n)[k] || lines(n)[0]).t0; // start of the k-th line of a shot
  const seg = (t, a, b) => D.clamp((t - a) / Math.max(0.01, b - a), 0, 1);
  const E = D.ease, lerp = D.lerp;
  const m = (c, o) => K.mat(c, o);
  const box = (p, w, h, d, c, x, y, z, o) => K.box(p, w, h, d, c, x, y, z, o);
  const mesh = (p, geo, c, x, y, z) => { const me = new T.Mesh(geo, typeof c === 'string' ? m(c) : c); me.position.set(x, y, z); me.castShadow = true; me.receiveShadow = true; p.add(me); return me; };
  const grp = (p = S, x = 0, y = 0, z = 0) => { const g = new T.Group(); g.position.set(x, y, z); p.add(g); return g; };
  const world = grp(S, X0, 0, 0);

  // ---------- light and sky (only this world is in view) ----------
  const sun = new T.DirectionalLight('#fff1d6', 0.85);
  sun.position.set(X0 - 10, 30, 22); sun.target.position.set(X0 + 6, 0, -2);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 90 });
  sun.shadow.bias = -0.0006;
  S.add(sun); S.add(sun.target);
  const sky = new T.HemisphereLight('#cfe8ff', '#5a7a3a', 0.38);
  S.add(sky);
  const skyTex = K.tex(8, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5aa8f0'); g.addColorStop(0.6, '#a8d4fa'); g.addColorStop(1, '#e8f4ff'); x.fillStyle = g; x.fillRect(0, 0, w, h); });

  // ---------- ground, street, shop, trees ----------
  const grass = K.tex(256, 256, (x, w, h) => { x.fillStyle = '#6cb84a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { x.fillStyle = Math.random() > 0.5 ? '#5fa83f' : '#7cc858'; x.fillRect(Math.random() * w, Math.random() * h, 2, 5); } }, [30, 30]);
  const ground = mesh(world, new T.PlaneGeometry(200, 200), m('#ffffff', { map: grass, r: 0.95 }), 6, 0, 0); ground.rotation.x = -Math.PI / 2; ground.castShadow = false;
  box(world, 80, 0.04, 4, '#5a5d66', 0, 0.02, 3.2, { r: 0.9 });
  for (let i = -20; i < 20; i++) box(world, 1.2, 0.05, 0.16, '#f4f4f4', i * 2.4, 0.03, 3.2);
  box(world, 80, 0.12, 2.4, '#d8d4cc', 0, 0.06, 0.4, { r: 0.85 });
  const sign = (txt, bg, fg) => K.tex(512, 128, (x, w, h) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.font = `${h * 0.62}px ${D.FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, w / 2, h * 0.54); });
  const shopAt = (x, w, col, txt, sbg) => { box(world, w, 4.2, 3, col, x, 2.1, -2.4, { r: 0.8 }); box(world, w - 0.8, 2.2, 0.06, m('#bfe3ff', { e: '#bfe3ff', ei: 0.25, r: 0.2 }), x, 1.4, -0.88); const s = box(world, w - 0.4, 0.8, 0.12, m('#fff', { map: sign(txt, sbg, '#fff') }), x, 3.4, -0.84); s.castShadow = false;
    for (let i = 0; i < 6; i++) box(world, (w - 0.4) / 6, 0.4, 0.5, i % 2 ? '#ffffff' : sbg, x - (w - 0.4) / 2 + (i + 0.5) * (w - 0.4) / 6, 2.7, -0.62); };
  shopAt(-7.5, 5.5, '#f0c870', 'BAKERY', '#d0643a'); shopAt(-1.5, 6, '#9fd0a0', 'GROCERY', '#2f8f4a'); shopAt(4.5, 5.5, '#c8b0e8', 'TOYS', '#7a4ac8');
  const tree = (x, z, s = 1) => { mesh(world, new T.CylinderGeometry(0.16 * s, 0.22 * s, 1.6 * s, 10), '#8a5a34', x, 0.8 * s, z); mesh(world, new T.SphereGeometry(1.1 * s, 16, 12), m('#4f9a48', { r: 0.9 }), x, 2.2 * s, z); mesh(world, new T.SphereGeometry(0.8 * s, 14, 10), m('#5fae52', { r: 0.9 }), x + 0.5 * s, 2.7 * s, z + 0.2); };
  [[-11, -1.2], [9.6, -1.6], [-14, 7], [26, -3], [-20, -2]].forEach(([x, z], i) => tree(x, z, 1 + (i % 3) * 0.15));

  // ---------- the gold tank, parked on the street (never mentioned) ----------
  const GOLD = m('#e3b23c', { m: 0.65, r: 0.32 }), DGOLD = m('#b8862a', { m: 0.6, r: 0.4 });
  const tank = grp(world, 8.8, 0, -1.2);
  for (const d of [-1, 1]) { box(tank, 3.4, 0.6, 0.6, '#3a3a42', 0, 0.32, d * 0.95); for (let i = 0; i < 6; i++) mesh(tank, new T.CylinderGeometry(0.24, 0.24, 0.64, 14), '#55555e', -1.25 + i * 0.5, 0.32, d * 0.95).rotation.x = Math.PI / 2; }
  box(tank, 3.2, 0.55, 1.6, GOLD, 0, 0.85, 0); const tur = grp(tank, -0.2, 1.3, 0); box(tur, 1.5, 0.5, 1.2, DGOLD, 0, 0, 0); mesh(tur, new T.CylinderGeometry(0.1, 0.12, 2.2, 12), GOLD, 1.7, 0.05, 0).rotation.z = Math.PI / 2;
  tank.rotation.y = 0.9; tank.scale.setScalar(0.85);

  // ---------- bags and groceries ----------
  const bagMat = m('#efe6d2', { r: 0.85 }), bag2Mat = m('#bfe0b0', { r: 0.85 });
  const ITEM = ['#e04040', '#f0c838', '#5ab04a', '#ffffff', '#ff8a2a'];
  const bag = (p, x, y, z, s = 1, dbl = false) => { const g = grp(p, x, y, z); g.scale.setScalar(s); const inner = box(g, 0.55, 0.6, 0.32, bagMat, 0, 0, 0); const outer = box(g, 0.6, 0.62, 0.36, bag2Mat, 0, -0.01, 0); outer.visible = dbl; g.outer = outer;
    const h = mesh(g, new T.TorusGeometry(0.16, 0.025, 6, 16, Math.PI), bagMat, 0, 0.3, 0); h.castShadow = false;
    [[-0.15, 0.36, 0.05, 0], [0.12, 0.4, -0.04, 1], [0, 0.34, 0.08, 2]].forEach(([a, b, c, k]) => { const it = k === 1 ? box(g, 0.1, 0.32, 0.1, ITEM[k], a, b, c) : mesh(g, new T.SphereGeometry(0.1, 10, 8), ITEM[k], a, b, c); });
    return g; };
  const crumbs = []; for (let i = 0; i < 7; i++) crumbs.push(i % 2 ? box(world, 0.16, 0.3, 0.16, ITEM[i % 5], 0, -5, 0) : mesh(world, new T.SphereGeometry(0.11, 10, 8), ITEM[i % 5], 0, -5, 0));

  // ---------- people ----------
  const you = D.figure({ shirt: '#3a78d8', pants: '#2b2f3a', hair: 'short', hairColor: '#4a3020', mood: 'calm' });
  const nb = D.figure({ shirt: '#5aa04a', pants: '#5a4634', hair: 'short', hairColor: '#a0a0a0', mood: 'glare' });
  world.add(you); world.add(nb);
  const legs = (f) => [f.children[0], f.children[1], f.children[2], f.children[3]];
  const walk = (f, ph, amt = 1) => { const [lA, sA, lB, sB] = legs(f), a = Math.sin(ph) * 0.45 * amt; lA.rotation.x = a; lB.rotation.x = -a; sA.position.z = 0.05 + Math.sin(ph) * 0.2 * amt; sB.position.z = 0.05 - Math.sin(ph) * 0.2 * amt; f.userData.body.position.y = 1.08 + Math.abs(Math.cos(ph)) * 0.05 * amt; };
  const arms = (f, l, r, spread = 0.12) => { const A = f.userData.arms; A[0].rotation.x = l; A[1].rotation.x = r; A[0].rotation.z = -spread; A[1].rotation.z = spread; };
  const handBags = [0, 1].map((i) => { const arr = [0, 1, 2].map((k) => bag(you.userData.arms[i], 0, -0.98 - k * 0.02, k * -0.22 + 0.0, 0.9)); return arr; });

  // ---------- trolley ----------
  const trolley = grp(world, 0, 0, 0);
  const tBody = grp(trolley, 0, 0, 0);
  const blue = m('#3f7fe0', { r: 0.5 }), steel = m('#c4c8d0', { m: 0.7, r: 0.3 });
  box(tBody, 1.5, 0.08, 0.9, blue, 0, 0.55, 0); for (const d of [-1, 1]) { box(tBody, 1.5, 0.55, 0.06, blue, 0, 0.82, d * 0.42); box(tBody, 0.06, 0.55, 0.9, blue, d * 0.72, 0.82, 0); }
  box(tBody, 0.06, 0.9, 0.06, steel, -0.85, 1.2, -0.4); box(tBody, 0.06, 0.9, 0.06, steel, -0.85, 1.2, 0.4); box(tBody, 0.06, 0.06, 0.86, steel, -0.85, 1.62, 0);
  const tBags = [-0.4, 0.05, 0.45].map((x) => bag(tBody, x, 1.0, 0, 0.95, true));
  const wheels = []; for (const a of [-1, 1]) for (const d of [-1, 1]) { const w = mesh(trolley, new T.CylinderGeometry(0.22, 0.22, 0.12, 18), '#25252b', a * 0.55, 0.22, d * 0.4); w.rotation.x = Math.PI / 2; w.home = [a * 0.55, 0.22, d * 0.4]; wheels.push(w); }
  const tracks = []; for (const d of [-1, 1]) { const tr = grp(trolley, 0, 0, d * 0.42); box(tr, 1.7, 0.42, 0.2, '#34343c', 0, 0.24, 0); for (let i = 0; i < 7; i++) { const c = box(tr, 0.1, 0.46, 0.22, GOLD, -0.75 + i * 0.25, 0.24, 0); c.base = -0.75 + i * 0.25; } tracks.push(tr); }

  // ---------- your block of flats, stairs, balcony, neighbour's window ----------
  const BX = 16, BZ = -3.2;
  const block = grp(world, BX, 0, BZ);
  box(block, 9, 10.5, 5, '#d98a62', 0, 5.25, 0, { r: 0.85 });
  const winM = m('#cfe9ff', { e: '#9fd2ff', ei: 0.2, r: 0.15 });
  for (let f = 0; f < 3; f++) for (const wx of [-3, 0, 3]) { if (f === 1 && wx === 3) continue; box(block, 1.4, 1.5, 0.08, winM, wx, 1.9 + f * 3.3, 2.52); box(block, 1.6, 0.14, 0.2, '#f4ece0', wx, 1.1 + f * 3.3, 2.58); }
  const nbWin = box(block, 1.4, 1.5, 0.08, m('#cfe9ff', { e: '#9fd2ff', ei: 0.25, r: 0.1, tr: true, op: 0.85 }), 0, 5.2, 2.52); // neighbour, floor 1 middle
  const nbHole = box(block, 1.36, 1.46, 0.05, '#2a2430', 0, 5.2, 2.5); nbHole.visible = false;
  box(block, 1.2, 2.2, 0.08, '#7a4a2a', 3, 4.5, 2.52); // your door, floor 1 right
  const balc = grp(block, 3, 3.45, 3.3); box(balc, 2.6, 0.18, 1.6, '#e8e4dc', 0, 0, 0); box(balc, 2.6, 0.7, 0.06, steel, 0, 0.45, 0.78);
  const steps = []; const NST = 14; for (let i = 0; i < NST; i++) { const s = box(world, 1.6, 0.24, 0.42, '#b8b8c0', BX - 4.6 + i * 0.42, 0.12 + i * 0.245, BZ + 3.3); s.home = s.position.clone(); steps.push(s); }
  // crane on your balcony
  const crane = grp(block, 3.6, 3.55, 3.6); const pole = box(crane, 0.2, 3.2, 0.2, '#f2c230', 0, 1.6, 0); const armG = grp(crane, 0, 3.15, 0); const arm = box(armG, 4.2, 0.18, 0.18, '#f2c230', 2.0, 0, 0);
  const rope = box(armG, 0.03, 1, 0.03, '#2a2a2a', 3.9, -0.5, 0); const hook = grp(armG, 3.9, -2, 0); box(hook, 1.1, 0.08, 0.7, '#9a7048', 0, 0, 0); const hookBags = [-0.28, 0.28].map((x) => bag(hook, x, 0.36, 0, 0.9, true));
  const shards = []; for (let i = 0; i < 14; i++) shards.push(box(world, 0.14, 0.14, 0.02, m('#cfe9ff', { tr: true, op: 0.8, r: 0.1 }), 0, -5, 0));
  const wind = []; for (let i = 0; i < 6; i++) { const w = box(world, 1.6, 0.04, 0.04, m('#ffffff', { tr: true, op: 0.7 }), 0, -5, 0); w.castShadow = false; wind.push(w); }

  const W3 = (x, y, z) => [X0 + x, y, z];
  const beatsAt = L.map((l) => l.t0);
  function draw(ctx, t) {
    let n = order[0]; order.forEach((s) => { if (t >= st(s)) n = s; });
    const [a, b] = span(n), p = seg(t, a, b), e = E(p);
    S.background = skyTex; S.fog = new T.Fog('#d8ecff', 45, 140);
    D.kit.lights.moon.intensity = 0; D.kit.lights.lvKey.intensity = 0; D.kit.lights.hemi.intensity = 0;
    // reset
    you.visible = true; nb.visible = false; trolley.visible = false; walk(you, 0, 0); arms(you, 0, 0); you.rotation.set(0, 0, 0);
    handBags.forEach((arr) => arr.forEach((g, k) => { g.visible = k === 0; g.outer.visible = false; g.position.y = -0.98; g.rotation.set(0, 0, 0); }));
    crumbs.forEach((c) => { c.position.y = -5; }); shards.forEach((c) => { c.position.y = -5; }); wind.forEach((w) => { w.position.y = -5; });
    wheels.forEach((w) => { w.visible = true; w.position.set(...w.home); w.rotation.set(Math.PI / 2, 0, 0); }); tracks.forEach((tr) => { tr.visible = false; tr.position.y = 0; });
    steps.forEach((s) => { s.position.copy(s.home); s.rotation.set(0, 0, 0); }); crane.visible = false; nbWin.visible = true; nbHole.visible = false; trolley.rotation.set(0, 0, 0);
    tBody.position.y = 0; tBags.forEach((g) => { g.visible = true; });
    let v;
    const look = (x, y, z) => W3(x, y, z);
    if (n === 'hook' || n === 'fix' || n === 'b1' || n === 'b2') {
      // on the pavement outside the shop
      const rip = at('hook', 0) + 1.3;
      if (n === 'hook') {
        const x = lerp(-3.5, 0.5, p); you.position.set(x, 0.12, 0.6); you.rotation.y = Math.PI / 2 * 0.6; walk(you, t * 7, t < rip ? 1 : 0.2); arms(you, Math.sin(t * 7) * 0.15, -Math.sin(t * 7) * 0.15);
        you.setMood(t < rip ? 'calm' : 'shock');
        if (t > rip) { handBags[0][0].visible = false; const k = t - rip; crumbs.forEach((c, i) => { const vx = (i - 3) * 0.35, vz = (i % 3) * 0.25; const tt = Math.min(k, 3); const y = Math.max(0.24, 0.9 + 2.2 * tt - 9 * tt * tt * (tt < 0.55 ? 1 : 1)); c.position.set(you.position.x - 0.4 + vx * Math.min(tt, 0.5), y, 0.6 + vz); c.rotation.set(tt * 6 + i, tt * 4, 0); }); }
        v = { pos: look(lerp(4.5, 3.5, e), 3.0, 11), look: look(lerp(-1.4, 0.3, e), 1.3, 0.4), fov: 36, focus: [0.45, 0.85], blur: 5 };
      } else if (n === 'fix') {
        you.position.set(0.5, 0.12, 0.6); you.rotation.y = 0.15; you.setMood('calm'); arms(you, 0, -1.0 * E(seg(t, a, a + 0.4)), 0.12); you.userData.arms[1].rotation.z = 0.5;
        v = { pos: look(1.2, 2.2, lerp(6.2, 5.2, e)), look: look(0.5, 1.7, 0.6), fov: 30, focus: [0.25, 0.75], blur: 4 };
      } else if (n === 'b1') {
        you.position.set(0.5, 0.12, 0.6); you.rotation.y = 0.3; you.setMood('calm'); arms(you, -0.5, -0.5, 0.2);
        const k = E(seg(t, at('b1', 1) - 0.2, at('b1', 1) + 0.6));
        handBags.forEach((arr) => { arr[0].outer.visible = true; arr[0].outer.position.y = lerp(-1.2, -0.01, k); arr[0].outer.scale.y = lerp(0.2, 1, k); });
        const r = lerp(-0.6, 0.6, e); v = { pos: look(0.5 + Math.sin(r) * 5.5, 2.3, 0.6 + Math.cos(r) * 5.5), look: look(0.5, 1.2, 0.6), fov: 34, focus: [0.4, 0.85], blur: 5 };
      } else {
        you.position.set(0.5, 0.12, 0.6); you.rotation.y = 0.2; const heavy = t > at('b2', 1);
        handBags.forEach((arr) => arr.forEach((g, k) => { g.visible = true; g.outer.visible = true; g.position.set(0, -0.98, -k * 0.24); }));
        arms(you, 0, 0, heavy ? 0.04 : 0.3); you.setMood(heavy ? 'shock' : 'calm');
        const sag = heavy ? E(seg(t, at('b2', 1), at('b2', 1) + 0.4)) : 0; you.userData.body.position.y = 1.08 - sag * 0.2; you.userData.head.position.y = 1.86 - sag * 0.25; you.userData.arms.forEach((A) => { A.position.y = 1.38 - sag * 0.22; });
        const sh = heavy ? Math.sin(t * 40) * 0.02 * (1 - seg(t, at('b2', 1), at('b2', 1) + 1.2)) : 0;
        v = { pos: look(2.6 + sh, 1.0, 7.6), look: look(0.5, 1.3, 0.6), fov: 36, focus: [0.3, 0.9], blur: 4 };
      }
    } else if (n === 'b3') {
      trolley.visible = true; const build = (k0) => E(seg(t, a + k0, a + k0 + 0.35));
      const roll = seg(t, at('b3', 1) + 0.6, b);
      const tx = lerp(1.2, 6.5, E(roll)); trolley.position.set(tx, 0.12, 0.6);
      tBody.position.y = lerp(3, 0, build(0)); wheels.forEach((w, i) => { const k = build(0.4 + i * 0.18); w.position.y = lerp(2.4, w.home[1], k); w.rotation.z = -tx / 0.22; });
      tBags.forEach((g, i) => { g.visible = t > at('b3', 1) - 0.2 + i * 0.15; g.position.y = lerp(2.6, 1.0, E(seg(t, at('b3', 1) - 0.2 + i * 0.15, at('b3', 1) + 0.15 + i * 0.15))); });
      you.position.set(tx - 1.5, 0.12, 0.6); you.rotation.y = Math.PI / 2; arms(you, -1.25, -1.25, 0.05); walk(you, tx * 3.2, roll > 0 && roll < 1 ? 1 : 0); handBags.forEach((arr) => arr[0].visible = false); you.setMood('calm');
      v = { pos: look(lerp(1.0, 5.5, E(roll)), 3.4, 12), look: look(lerp(0.5, 5.0, E(roll)), 1.0, 0.6), fov: 36, focus: [0.45, 0.85], blur: 5 };
    } else if (n === 'b4' || n === 'b5' || n === 'b6') {
      trolley.visible = true; handBags.forEach((arr) => arr[0].visible = false);
      const sx = BX - 4.6, sz = BZ + 3.3; // foot of the stairs
      if (n === 'b4') {
        const k = E(seg(t, a, a + 1.6)); const tx = lerp(sx - 6, sx - 1.6, k); trolley.position.set(tx, 0.12, sz); you.position.set(tx - 1.5, 0.12, sz); you.rotation.y = Math.PI / 2; arms(you, -1.25, -1.25, 0.05); walk(you, tx * 3.2, k < 1 ? 1 : 0);
        wheels.forEach((w) => { w.rotation.z = -tx / 0.22; }); you.setMood(t > at('b4', 1) ? 'shock' : 'calm');
        const up = E(seg(t, at('b4', 1) - 0.2, b)); v = { pos: look(sx - 7.5, lerp(3.0, 5.0, up), sz + 12.5), look: look(lerp(sx - 2.5, sx + 2.5, up), lerp(1.2, 3.6, up), sz), fov: 40, focus: [0.3, 0.85], blur: 4 };
      } else if (n === 'b5') {
        const tx = sx - 1.6; trolley.position.set(tx, 0.12, sz); you.position.set(tx - 2.3, 0.12, sz - 0.3); you.rotation.y = Math.PI / 2; arms(you, -1.0, -1.0, 0.1); you.setMood('calm');
        const off = E(seg(t, a, at('b5', 1))); wheels.forEach((w, i) => { const k = E(seg(t, a + i * 0.12, a + 0.5 + i * 0.12)); w.position.set(w.home[0] + (w.home[0] > 0 ? 1 : -1) * k * 1.2, w.home[1] + Math.sin(k * 3.14) * 0.8, w.home[2] * (1 + k)); w.visible = k < 0.98; });
        tBody.position.y = 0.0; const tk = E(seg(t, at('b5', 1), at('b5', 1) + 0.6)); tracks.forEach((tr, i) => { tr.visible = t > at('b5', 1); tr.position.y = lerp(1.6, 0, tk); });
        v = { pos: look(tx + 4.2, 2.0, sz + 5.6), look: look(tx, 0.7, sz), fov: 36, focus: [0.35, 0.85], blur: 5 };
      } else {
        wheels.forEach((w) => { w.visible = false; }); tracks.forEach((tr) => { tr.visible = true; tr.children.forEach((c) => { if (c.base != null) c.position.x = -0.75 + ((c.base + 0.75 + t * 0.8) % 1.75); }); });
        const crash = at('b6', 1) + 0.4; const k = E(seg(t, a, crash)); const along = lerp(-1.6, 3.8, k);
        const fall = seg(t, crash, crash + 0.9);
        trolley.position.set(sx + along, 0.12 + Math.max(0, along) * (0.245 / 0.42) * (1 - E(fall)) + (fall > 0 ? 0 : 0), sz); trolley.rotation.z = along > 0 ? 0.52 * (1 - E(fall)) : 0;
        steps.forEach((s, i) => { const f = seg(t, crash + i * 0.03, crash + 0.7 + i * 0.03); s.position.set(s.home.x + (i % 2 ? 0.3 : -0.2) * f, Math.max(0.12, s.home.y * (1 - f * f)), s.home.z + (i % 3 - 1) * 0.6 * f); s.rotation.set(f * (i % 2 ? 0.8 : -0.6), 0, f * (i % 2 ? -0.5 : 0.7)); });
        you.position.set(sx - 2.8, 0.12, sz + 1.0); you.rotation.y = Math.PI / 2 - 0.3; you.setMood(t > crash ? 'shock' : 'calm'); arms(you, t > crash ? -2.6 : -0.3, t > crash ? -2.6 : -0.3, 0.3);
        const sh = t > crash ? Math.sin(t * 50) * 0.12 * (1 - seg(t, crash, crash + 0.8)) : 0;
        v = { pos: look(sx - 6 + sh, 4.5, sz + 15), look: look(sx + 1.6, 2.0 + sh, sz), fov: 40, focus: [0.3, 0.88], blur: 4 };
      }
    } else {
      // b7..close: at the block, crane on your balcony
      const sx = BX - 4.6, sz = BZ + 3.3; steps.forEach((s, i) => { s.position.set(s.home.x + (i % 2 ? 0.3 : -0.2), 0.12, s.home.z + (i % 3 - 1) * 0.6); s.rotation.set(i % 2 ? 0.8 : -0.6, 0, i % 2 ? -0.5 : 0.7); });
      trolley.visible = n === 'b7'; trolley.position.set(sx + 1, 0.3, sz + 0.4); trolley.rotation.z = 0.3; tracks.forEach((tr) => tr.visible = true); wheels.forEach((w) => { w.visible = false; }); tBags.forEach((g) => g.visible = false);
      crane.visible = true; handBags.forEach((arr) => arr[0].visible = false);
      const bW = W3(BX, 0, BZ);
      if (n === 'b7') {
        const k1 = E(seg(t, at('b7', 1), at('b7', 1) + 0.5)), k2 = E(seg(t, at('b7', 1) + 0.4, at('b7', 1) + 0.9)), k3 = E(seg(t, at('b7', 1) + 0.9, b));
        pole.scale.y = Math.max(0.01, k1); pole.position.y = 1.6 * k1; armG.visible = k2 > 0.01; armG.scale.x = Math.max(0.01, k2); armG.rotation.y = 0;
        const hy = lerp(-6.6, -1.6, k3); hook.position.y = hy; rope.scale.y = -hy; rope.position.y = hy / 2; hookBags.forEach((g) => g.visible = true);
        you.position.set(BX + 1.5, 0.12, BZ + 6.2); you.rotation.y = Math.PI * 0.85; arms(you, -2.2, -0.3, 0.2); you.setMood('calm');
        v = { pos: [bW[0] + 9, lerp(2.5, 5.0, k3), bW[2] + 15], look: [bW[0] + 4.5, lerp(1.8, 4.2, k3), bW[2] + 3.4], fov: 40, focus: [0.25, 0.85], blur: 3 };
      } else if (n === 'b8') {
        armG.visible = true; armG.scale.x = 1; const hit = at('b8', 1) + 0.35; const sw = E(seg(t, at('b8', 0) + 0.3, hit));
        armG.rotation.y = lerp(0, 2.62, sw) + (t > hit ? Math.sin((t - hit) * 9) * 0.06 * Math.exp(-(t - hit) * 2) : 0); hook.position.y = -1.6; rope.scale.y = 1.6; rope.position.y = -0.8;
        const smashed = t > hit; nbWin.visible = !smashed; nbHole.visible = smashed;
        if (smashed) { const k = t - hit; shards.forEach((s, i) => { const vx = ((i * 37) % 11 - 5) * 0.35, vz = 1.2 + (i % 4) * 0.4; const y = 5.2 + 2 * k - 6 * k * k; s.position.set(bW[0] - X0 + vx * k, Math.max(0.05, y), bW[2] + 2.6 + vz * k); s.rotation.set(k * 9 + i, k * 7, i); }); }
        wind.forEach((w, i) => { const k = (t * 0.9 + i / 6) % 1; w.position.set(BX - 8 + k * 18, 3.5 + i * 0.9, BZ + 4.5 + (i % 2)); });
        you.position.set(BX + 1.5, 0.12, BZ + 6.2); you.rotation.y = Math.PI * 0.85; arms(you, smashed ? -2.7 : -2.2, smashed ? -2.7 : -0.3, 0.3); you.setMood(smashed ? 'shock' : 'calm');
        const sh = smashed ? Math.sin(t * 50) * 0.1 * (1 - seg(t, hit, hit + 0.8)) : 0;
        v = { pos: [bW[0] + 2 + sh, 4.2, bW[2] + 16], look: [bW[0] + 0.5, 4.6 + sh, bW[2] + 2.5], fov: 44, focus: [0.25, 0.8], blur: 3 };
      } else if (n === 'twist') {
        armG.visible = true; armG.rotation.y = 2.62; nbWin.visible = false; nbHole.visible = true; hook.position.y = -1.6;
        nb.visible = true; nb.position.set(BX, 3.4 + 0.3, BZ + 2.9); nb.rotation.y = 0.25; nb.setMood('glare'); const sh = Math.sin(t * 14); arms(nb, -2.4 + sh * 0.4, -2.4 - sh * 0.4, 0.5);
        you.position.set(BX + 3, 3.55, BZ + 3.3); you.rotation.y = -0.3; you.setMood('calm'); arms(you, 0, 0, 0.3); handBags.forEach((arr) => { arr[0].visible = true; arr[0].outer.visible = true; });
        const k = E(seg(t, at('twist', 1) - 0.1, b)); v = { pos: [bW[0] + lerp(1.0, 3.6, k), 5.6, bW[2] + 13], look: [bW[0] + lerp(0.2, 3.0, k), 5.2, bW[2] + 3.0], fov: 36, focus: [0.3, 0.75], blur: 4 };
      } else {
        armG.visible = true; armG.rotation.y = 2.62; nbWin.visible = false; nbHole.visible = true;
        you.position.set(BX + 3, 3.55, BZ + 3.3); you.rotation.y = -0.1; arms(you, 0, 0, 0.3); handBags.forEach((arr) => { arr[0].visible = true; arr[0].outer.visible = true; });
        you.setMood(t > at('close', 1) + 0.5 ? 'down' : 'calm'); you.userData.head.rotation.x = t > at('close', 1) + 0.5 ? 0.35 : 0;
        v = { pos: [bW[0] + 3.6, 6.0, bW[2] + lerp(10.5, 9.0, e)], look: [bW[0] + 3, 5.2, bW[2] + 3.3], fov: 34, focus: [0.3, 0.75], blur: 4 };
      }
    }
    D.render3d(ctx, v);
    // overlays
    D.label(ctx, "LET'S FIX THAT", 360, 118, null, null, t, 0, 1e9, { bg: '#c2412c', fg: '#fff', size: 30 });
    const tag = (txt, obj, off, t0, bg = D.PINK) => { const q = D.screen(obj, off); D.label(ctx, txt, q.x, q.y, null, null, t, t0, b, { bg, fg: '#fff', size: 40 }); };
    if (n === 'hook' && t > at('hook', 0) + 1.3) tag('RIIIP!', you, [-0.6, 0.6, 0], at('hook', 0) + 1.3);
    if (n === 'b1') tag('BAG x2', you, [0.9, 2.0, 0], at('b1', 0) + 0.3, '#e8a020');
    if (n === 'b2') tag('18 KG', you, [0.9, 2.5, 0], at('b2', 0) + 0.3);
    if (n === 'b4') tag('YOUR FLAT', steps[NST - 1], [0, 1.4, 0], at('b4', 1), '#3a78d8');
    if (n === 'b5' && t > at('b5', 1)) tag('TANK TRACKS', trolley, [0, 2.2, 0], at('b5', 1) + 0.1, '#e8a020');
    if (n === 'b7' && t > at('b7', 1)) tag('CRANE', crane, [0, 3.8, 0], at('b7', 1) + 0.1, '#e8a020');
    if (n === 'twist') { tag('!!!', nb, [0, 2.8, 0], a + 0.2); }
    if (n === 'close' && t > at('close', 1)) tag('NO MILK', you, [0, 2.9, 0], at('close', 1) + 0.4, '#3a78d8');
    L.forEach((l) => D.caption(ctx, l.cap, t, l.t0, l.t1 + 0.1, 845));
  }
  function score(k) {
    L.forEach((l) => k.play('whoosh', l.t0, { dur: 0.2, gain: 0.18, minor: true }));
    k.play('slap', at('hook', 0) + 1.3, { gain: 0.5 });
    k.play('pop', at('fix', 0), { gain: 0.5 });
    k.play('thud', at('b2', 1), { f: 60, gain: 0.6 });
    for (let i = 0; i < 4; i++) k.play('click', st('b3') + 0.4 + i * 0.18, { gain: 0.4 });
    k.play('stamp', at('b5', 1), { gain: 0.5 });
    k.play('impact', at('b6', 1) + 0.4, { gain: 0.8 }); k.play('thud', at('b6', 1) + 0.5, { f: 50, gain: 0.7 });
    k.play('press', at('b7', 1) + 0.1, { gain: 0.4 }); k.play('whoosh', at('b8', 0), { dur: 1.2, gain: 0.35 });
    k.play('glitch', at('b8', 1) + 0.35, { gain: 0.5 }); k.play('impact', at('b8', 1) + 0.35, { gain: 0.7 });
    k.play('buzz', at('twist', 0), { gain: 0.3 }); k.play('ding', at('twist', 1), { gain: 0.4 }); k.play('error', at('close', 1) + 0.4, { gain: 0.45 });
  }
  window.REEL = { DURATION, draw, score };
})();
