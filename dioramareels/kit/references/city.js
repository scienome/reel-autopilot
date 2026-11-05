/* City kit for diorama reels: a complete miniature city around the hero apartment tower. Load after diorama.js.
   D.city.mode('sunset' | 'night' | 'day' | 'interior')  picks sky, sun, haze and lit windows, and hides the city for indoor shots.
   D.city.update(t)                                      moves traffic, people, clouds, balloons, boats, the Ferris wheel.
   D.city.dive(p)                                        camera view: p 0 = high over the city, p 1 = in front of the hero tower's elevator.
   D.city.orbit(p), D.city.street(p), D.city.ferris(p)   more ready camera views.
   Everything comes from one seeded random sequence, so every render worker draws the same city. */
(() => {
  const T = D.THREE, { mat, add, box, tex } = D.kit, rnd = Math.random, pick = (a) => a[Math.floor(rnd() * a.length)];
  const city = new T.Group();
  D.scene.add(city);
  const P = 40, BL = 30, N = 5, LIM = (N + 1) * P;
  const PAL = ['#ff4d6d', '#ff8a1e', '#ffc300', '#12c2a9', '#1f8efa', '#7b3ff2', '#e0218a', '#27c93f', '#00b8d9', '#ff6b35', '#f72585', '#4361ee'];

  // ---------- ground, blocks, river ----------
  add(city, new T.PlaneGeometry(1600, 1600), mat('#2a2740', { r: 0.9 }), 0, -0.25, 0, { rx: -Math.PI / 2, cast: false });
  const RIVERJ = -4, isRiver = (j) => j === RIVERJ;
  const water = add(city, new T.PlaneGeometry(1600, P + 12), new T.MeshStandardMaterial({ color: '#10b5d8', roughness: 0.18, metalness: 0.35, emissive: '#0a5f8a', emissiveIntensity: 0.35 }), 0, -0.1, RIVERJ * P, { rx: -Math.PI / 2, cast: false });
  const parks = { '-1,1': 'plaza', '0,1': 'plaza', '1,1': 'plaza', '2,2': 'ferris', '-3,2': 'stadium', '-2,-2': 'park', '3,-1': 'park', '4,3': 'park', '-4,-1': 'park' };
  const treeSpots = [];
  for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
    if (isRiver(j)) continue;
    const kind = parks[`${i},${j}`], x = i * P, z = j * P;
    box(city, BL, 0.3, BL, kind ? '#35c95c' : '#e9dcc8', x, -0.05, z, { cast: false });
    if (kind) { for (let k = 0; k < (kind === 'plaza' ? 8 : 26); k++) { const a = rnd() * BL - BL / 2, b = rnd() * BL - BL / 2; if (kind === 'stadium' || (kind === 'ferris' && Math.abs(a) < 9 && Math.abs(b) < 9)) continue; treeSpots.push([x + a * 0.9, z + b * 0.9, kind === 'plaza' ? 0.8 : 1 + rnd()]); } }
  }

  // ---------- facade textures: colour comes from the material, emissive map holds the lit windows ----------
  const COLS = 8, ROWS = 8;
  const facade = (style) => tex(256, 256, (x, w, h) => {
    x.fillStyle = '#fff'; x.fillRect(0, 0, w, h);
    const cw = w / COLS, ch = h / ROWS;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      x.fillStyle = style === 1 ? '#17345c' : '#22314f';
      if (style === 2) x.fillRect(c * cw + 2, r * ch + 3, cw - 4, ch * 0.72);
      else x.fillRect(c * cw + cw * 0.2, r * ch + ch * 0.18, cw * 0.6, ch * 0.62);
      x.fillStyle = 'rgba(160,220,255,.45)';
      x.fillRect(c * cw + cw * 0.24, r * ch + ch * 0.2, cw * 0.2, ch * 0.3);
    }
  });
  const glow = () => tex(256, 256, (x, w, h) => {
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
    const cw = w / COLS, ch = h / ROWS;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (rnd() < 0.42) {
      x.fillStyle = pick(['#ffd27a', '#ffb347', '#fff1b0', '#ff8fb1', '#7fe7ff']);
      x.fillRect(c * cw + cw * 0.2, r * ch + ch * 0.18, cw * 0.6, ch * 0.62);
    }
  });
  const faces = [0, 1, 2].map(facade), glows = [glow(), glow(), glow()], winMats = [];
  function bodyMats(color, w, d, h, st) {
    const mk = (span) => {
      const f = faces[st].clone(), g = glows[st].clone();
      f.needsUpdate = g.needsUpdate = true;
      const rx = Math.max(1, Math.round(span / 17)), ry = Math.max(1, Math.round(h / 24));
      f.repeat.set(rx, ry); g.repeat.set(rx, ry);
      f.wrapS = f.wrapT = g.wrapS = g.wrapT = T.RepeatWrapping;
      const m = new T.MeshStandardMaterial({ color, map: f, emissive: '#fff', emissiveMap: g, emissiveIntensity: 1, roughness: st === 1 ? 0.25 : 0.6, metalness: st === 1 ? 0.35 : 0 });
      winMats.push(m);
      return m;
    };
    const a = mk(w), b = mk(d), roof = mat('#4a4560', { r: 0.8 });
    return [b, b, roof, roof, a, a];
  }
  const blink = [];
  function roofStuff(x, y, z, w) {
    const r = rnd();
    if (r < 0.3) { const g = new T.Group(); g.position.set(x, y, z); city.add(g); add(g, new T.CylinderGeometry(1.4, 1.4, 2.4, 14), mat('#8a5230', { r: 0.8 }), 0, 2.6, 0); add(g, new T.ConeGeometry(1.6, 1, 14), mat('#5b3420'), 0, 4.3, 0); }
    else if (r < 0.55) { add(city, new T.CylinderGeometry(0.1, 0.25, 9, 6), mat('#d0d0d8', { m: 0.6 }), x, y + 4.5, z); const b = add(city, new T.SphereGeometry(0.35, 8, 6), new T.MeshBasicMaterial({ color: '#ff2740', fog: false }), x, y + 9.2, z, { cast: false }); blink.push(b); }
    else if (r < 0.8) { box(city, w * 0.4, 1.2, w * 0.3, '#a8a4b8', x, y + 0.6, z); box(city, 1.2, 0.8, 1.2, '#d9d6e4', x + w * 0.22, y + 0.4, z - w * 0.2); }
    else add(city, new T.SphereGeometry(w * 0.32, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(pick(PAL), { r: 0.3, m: 0.3 }), x, y, z);
  }
  function tower(x, z, w, d, h, color) {
    const st = Math.floor(rnd() * 3), style = rnd();
    if (style < 0.22 && h > 34) { // stepped tower
      let y = 0, bw = w, bd = d, hh = h;
      for (let k = 0; k < 3; k++) { const part = hh * (k === 0 ? 0.55 : k === 1 ? 0.6 : 1); const m = new T.Mesh(new T.BoxGeometry(bw, part, bd), bodyMats(color, bw, bd, part, st)); m.position.set(x, y + part / 2, z); m.castShadow = true; city.add(m); y += part; hh -= part; bw *= 0.74; bd *= 0.74; }
      roofStuff(x, y, z, bw); return;
    }
    if (style < 0.36) { // round tower
      const cm = new T.Mesh(new T.CylinderGeometry(w / 2, w / 2, h, 22), bodyMats(color, w * 3, w * 3, h, st).slice(0, 1).concat([mat('#4a4560')]));
      cm.position.set(x, h / 2, z); cm.castShadow = true; city.add(cm); roofStuff(x, h, z, w); return;
    }
    const m = new T.Mesh(new T.BoxGeometry(w, h, d), bodyMats(color, w, d, h, st));
    m.position.set(x, h / 2, z); m.castShadow = true; city.add(m);
    roofStuff(x, h, z, w);
  }
  // lots: 2 x 2 per block, taller towards a downtown behind the hero tower
  for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) {
    if (isRiver(j) || parks[`${i},${j}`]) continue;
    const x = i * P, z = j * P, near = Math.hypot(i * 1.1, j - (-1.5));
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => {
      const lx = x + a * 7.4, lz = z + b * 7.4;
      if (i === 0 && j === 0 && b === 1) return; // keep the street side of the hero block free
      if (i === 0 && j === 0 && b === -1) { tower(lx * 2.1, lz - 3, 8, 8, 34, pick(PAL)); return; }
      const h = Math.max(8, (70 - near * 11) * (0.55 + rnd() * 0.75));
      tower(lx, lz, 11 + rnd() * 2, 11 + rnd() * 2, h, pick(PAL));
    });
  }
  // two side buildings beside the hero tower
  tower(-12.5, 8.5, 6, 6, 12, '#ff8a1e');
  tower(12.5, 8.5, 6, 6, 14, '#12c2a9');

  // ---------- neon signs ----------
  const signs = [];
  function sign(txt, color, x, y, z, w, ry = 0) {
    const t = tex(256, 96, (c, W, H) => {
      c.fillStyle = '#12091f'; c.fillRect(0, 0, W, H);
      c.strokeStyle = color; c.lineWidth = 6; c.strokeRect(5, 5, W - 10, H - 10);
      c.font = '64px "Lilita One", sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.shadowColor = color; c.shadowBlur = 22; c.fillStyle = '#fff'; c.fillText(txt, W / 2, H / 2 + 4);
    });
    const m = add(city, new T.PlaneGeometry(w, w * 0.375), new T.MeshBasicMaterial({ map: t, fog: false }), x, y, z, { ry, cast: false, recv: false });
    signs.push(m);
    return m;
  }
  sign('CAFE', '#ff4d6d', -12.5, 4, 11.7, 5);
  sign('NOODLES', '#ffc300', 12.5, 4, 11.7, 5.4);
  [['HOTEL', '#7fe7ff'], ['PIZZA', '#ff8a1e'], ['ARCADE', '#f72585'], ['CINEMA', '#ffc300'], ['BOOKS', '#27c93f'], ['TACOS', '#ff6b35'], ['24 HOURS', '#7fe7ff'], ['GYM', '#ff4d6d']].forEach(([s, c], k) => {
    const i = (k % 2 ? 1 : -1) * (1 + (k % 3)), j = -1 - (k % 2);
    sign(s, c, i * P + (k % 2 ? -7 : 7), 16 + k * 2, j * P + 14.2, 10);
  });

  // ---------- instanced street furniture ----------
  const dummy = new T.Object3D();
  function instanced(geo, material, list, fn) {
    const im = new T.InstancedMesh(geo, material, list.length);
    list.forEach((v, k) => { fn(dummy, v, k); dummy.updateMatrix(); im.setMatrixAt(k, dummy.matrix); });
    im.instanceMatrix.needsUpdate = true;
    city.add(im);
    return im;
  }
  const dash = [], cross = [], lamps = [];
  for (let k = -N - 1; k <= N; k++) {
    const r = (k + 0.5) * P;
    for (let s = -LIM; s < LIM; s += 8) {
      if (Math.abs(((s % P) + P) % P - P / 2) > 5.5 && !(k + 0.5 > RIVERJ - 0.6 && k + 0.5 < RIVERJ + 0.6)) { dash.push([s, r, 0]); }
      if (Math.abs(((s % P) + P) % P - P / 2) > 5.5) dash.push([r, s, 1]);
    }
    for (let m = -N; m <= N; m++) {
      for (let q = -4; q <= 4; q += 2) { cross.push([m * P + q, r - 7, 0]); cross.push([r - 7, m * P + q, 1]); }
      lamps.push([m * P - 12, r - 6], [m * P + 12, r + 6], [r - 6, m * P + 12]);
    }
  }
  instanced(new T.BoxGeometry(3, 0.04, 0.3), mat('#ffe9a8', { r: 0.8 }), dash, (d, [a, b, v]) => { d.position.set(a, -0.2, b); d.rotation.y = v ? Math.PI / 2 : 0; });
  instanced(new T.BoxGeometry(1.1, 0.04, 3), mat('#fff', { r: 0.8 }), cross, (d, [a, b, v]) => { d.position.set(a, -0.2, b); d.rotation.y = v ? Math.PI / 2 : 0; });
  instanced(new T.CylinderGeometry(0.07, 0.1, 4.2, 6), mat('#2b2a3a'), lamps, (d, [a, b]) => { d.position.set(a, 2, b); });
  const lampHead = new T.MeshBasicMaterial({ color: '#ffd98a', fog: false });
  instanced(new T.SphereGeometry(0.3, 8, 6), lampHead, lamps, (d, [a, b]) => { d.position.set(a, 4.2, b); });
  const trunk = instanced(new T.CylinderGeometry(0.2, 0.3, 2, 6), mat('#6b4428'), treeSpots, (d, [x, z, s]) => { d.position.set(x, 1, z); d.scale.setScalar(s); });
  const leaves = new T.InstancedMesh(new T.IcosahedronGeometry(1.7, 1), mat('#fff', { r: 0.75 }), treeSpots.length);
  treeSpots.forEach(([x, z, s], k) => { dummy.position.set(x, 2.8 * s, z); dummy.scale.setScalar(s); dummy.rotation.y = 0; dummy.updateMatrix(); leaves.setMatrixAt(k, dummy.matrix); leaves.setColorAt(k, new T.Color(pick(['#1fbf4b', '#34d058', '#7ee02c', '#ff7eb6', '#ff9f1c', '#0fa968']))); });
  leaves.castShadow = true;
  city.add(leaves);

  // ---------- traffic and people ----------
  const CARS = 110, cars = [];
  for (let k = 0; k < CARS; k++) {
    const road = (Math.floor(rnd() * (2 * N + 2)) - N - 1 + 0.5) * P, axis = rnd() < 0.5 ? 0 : 1, dir = rnd() < 0.5 ? 1 : -1;
    if (!axis && Math.abs(road / P - RIVERJ) < 0.6) { k--; continue; }
    cars.push({ road: road + dir * 2.4 * (axis ? 1 : -1), axis, dir, off: rnd() * LIM * 2, v: 7 + rnd() * 9 });
  }
  const carM = new T.InstancedMesh(new T.BoxGeometry(1.9, 0.75, 4.2), mat('#fff', { r: 0.28, m: 0.25 }), CARS);
  const cabM = new T.InstancedMesh(new T.BoxGeometry(1.6, 0.62, 2.1), mat('#16233f', { r: 0.2, m: 0.5 }), CARS);
  const hdM = new T.InstancedMesh(new T.BoxGeometry(1.7, 0.2, 0.08), new T.MeshBasicMaterial({ color: '#fff4c2', fog: false }), CARS);
  const tlM = new T.InstancedMesh(new T.BoxGeometry(1.7, 0.2, 0.08), new T.MeshBasicMaterial({ color: '#ff2740', fog: false }), CARS);
  cars.forEach((c, k) => carM.setColorAt(k, new T.Color(k % 5 === 0 ? '#ffc300' : pick(PAL))));
  [carM, cabM, hdM, tlM].forEach((m) => { m.frustumCulled = false; city.add(m); });
  const PPL = 200, people = [];
  for (let k = 0; k < PPL; k++) people.push({ road: (Math.floor(rnd() * (2 * N + 2)) - N - 1 + 0.5) * P + (rnd() < 0.5 ? 1 : -1) * 6, axis: rnd() < 0.5 ? 0 : 1, off: rnd() * LIM * 2, v: (rnd() < 0.5 ? 1 : -1) * (0.8 + rnd()) });
  const pplM = new T.InstancedMesh(new T.CapsuleGeometry(0.3, 0.8, 3, 8), mat('#fff', { r: 0.6 }), PPL);
  people.forEach((_, k) => pplM.setColorAt(k, new T.Color(pick(PAL))));
  pplM.frustumCulled = false;
  city.add(pplM);

  // ---------- landmarks ----------
  const wheel = new T.Group();
  wheel.position.set(2 * P, 15, 2 * P);
  city.add(wheel);
  const WR = 13, rimM = mat('#ff2d87', { e: '#ff2d87', ei: 1.2, r: 0.3 });
  add(wheel, new T.TorusGeometry(WR, 0.28, 8, 48), rimM, 0, 0, 0);
  add(wheel, new T.TorusGeometry(WR * 0.62, 0.14, 8, 32), mat('#7fe7ff', { e: '#7fe7ff', ei: 1 }), 0, 0, 0);
  const pods = [];
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const spoke = add(wheel, new T.CylinderGeometry(0.07, 0.07, WR, 5), mat('#fff'), Math.cos(a) * WR / 2, Math.sin(a) * WR / 2, 0);
    spoke.rotation.z = a + Math.PI / 2;
    pods.push(add(wheel, new T.BoxGeometry(1.5, 1.4, 1.5), mat(PAL[k % PAL.length], { r: 0.35 }), Math.cos(a) * WR, Math.sin(a) * WR, 0));
  }
  [-1, 1].forEach((s) => [-1, 1].forEach((f) => { const l = add(city, new T.CylinderGeometry(0.22, 0.32, 17, 6), mat('#f3f0ff'), 2 * P + s * 3.6, 7.5, 2 * P + f * 1.4); l.rotation.z = -s * 0.22; }));
  // stadium
  const st = new T.Group();
  st.position.set(-3 * P, 0, 2 * P);
  city.add(st);
  add(st, new T.CylinderGeometry(14.5, 13, 5, 40, 1, true), new T.MeshStandardMaterial({ color: '#7b3ff2', side: T.DoubleSide, roughness: 0.5 }), 0, 2.5, 0);
  add(st, new T.TorusGeometry(14.2, 0.35, 8, 40), mat('#ffc300', { e: '#ffc300', ei: 0.9 }), 0, 5, 0, { rx: Math.PI / 2 });
  add(st, new T.CylinderGeometry(11.5, 11.5, 0.1, 32), mat('#2bd34f', { r: 0.9 }), 0, 0.2, 0);
  // bridge over the river
  const brZ = RIVERJ * P;
  box(city, 12, 0.8, P + 22, '#ff5a36', 0, 1.1, brZ);
  [-1, 1].forEach((s) => { [-14, 14].forEach((z) => box(city, 1.1, 22, 1.1, '#ff5a36', s * 5.6, 11, brZ + z)); for (let z = -22; z <= 22; z += 3) { const dz = Math.abs(Math.abs(z) - 14), h = 1 + dz * dz * 0.13; box(city, 0.14, h, 0.14, '#ffd9b8', s * 5.6, 1.4 + (z > -14 && z < 14 ? 21 - h : h) / 2 + (z > -14 && z < 14 ? 0 : 0), brZ + z, { cast: false }); } });
  // boats
  const boats = [0, 1, 2, 3, 4].map((k) => { const b = new T.Group(); box(b, 7, 1, 2.4, PAL[k * 2], 0, 0.5, 0); box(b, 3, 1, 1.8, '#fff', -0.5, 1.4, 0); city.add(b); return { b, off: k * 80, v: 3 + k, z: brZ + (k % 2 ? 10 : -10) }; });
  // mountains behind the city
  [[-180, -420, 130, '#6b3fa0'], [10, -470, 170, '#8a3f9e'], [230, -430, 120, '#6b3fa0'], [-340, -380, 90, '#55308f'], [370, -390, 100, '#55308f']].forEach(([x, z, h, c]) => add(city, new T.ConeGeometry(h * 1.5, h, 7), mat(c, { r: 1 }), x, h / 2 - 1, z, { cast: false }));
  // clouds and hot air balloons
  const clouds = [];
  for (let k = 0; k < 14; k++) {
    const g = new T.Group(), s = 5 + rnd() * 7;
    for (let q = 0; q < 6; q++) add(g, new T.IcosahedronGeometry(s * (0.6 + rnd() * 0.5), 1), mat('#fff', { r: 1, e: '#ff9fb5', ei: 0.25 }), (q - 2.5) * s * 0.75, rnd() * s * 0.5, rnd() * s * 0.6, { cast: false });
    g.position.set(rnd() * 500 - 250, 80 + rnd() * 70, -60 - rnd() * 260);
    city.add(g);
    clouds.push({ g, x: g.position.x, v: 0.6 + rnd() });
  }
  const balloons = [[-34, 46, 22, '#ff2d55', '#ffc300'], [52, 62, -14, '#12c2a9', '#f72585'], [-92, 58, -40, '#4361ee', '#ff8a1e']].map(([x, y, z, a, b]) => {
    const g = new T.Group(), t = tex(256, 128, (c, W, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? a : b; c.fillRect(i * W / 8, 0, W / 8, H); } });
    const s = add(g, new T.SphereGeometry(5, 24, 18), new T.MeshStandardMaterial({ map: t, roughness: 0.4 }), 0, 0, 0); s.scale.y = 1.2;
    box(g, 1.6, 1.1, 1.6, '#8a5230', 0, -7.4, 0);
    g.position.set(x, y, z);
    city.add(g);
    return { g, y };
  });

  // ---------- hero tower dressing ----------
  const { building: H, NF, FL, DEP, RW, SW } = D.kit.hero, top = NF * FL + 0.3, W2 = RW + SW / 2;
  box(H, W2 * 2 - 0.2, 0.12, DEP, '#3fcf6a', 0, top + 0.06, 0, { r: 0.9 });
  const bulbs = [];
  for (let k = 0; k <= 16; k++) bulbs.push(add(H, new T.SphereGeometry(0.1, 6, 5), new T.MeshBasicMaterial({ color: PAL[k % PAL.length] }), -W2 + 0.3 + (k / 16) * (W2 * 2 - 0.6), top + 2.4 - Math.sin((k / 16) * Math.PI * 4) ** 2 * 0.5, DEP / 2 - 0.1, { cast: false }));
  [-6, -3.2, -0.6].forEach((x) => { add(H, new T.CylinderGeometry(0.08, 0.1, 0.9, 6), mat('#6b4428'), x, top + 0.5, -0.8); add(H, new T.IcosahedronGeometry(0.6, 1), mat('#27c93f', { r: 0.7 }), x, top + 1.3, -0.8); });
  box(H, 2.6, 0.4, 1.6, '#00b8d9', -3.4, top + 0.25, 0.5, { r: 0.2 });
  add(H, new T.CylinderGeometry(0.1, 0.16, 7, 6), mat('#d7d4e4', { m: 0.5 }), -5.8, top + 3.5, -1);
  const canopy = stripesCanopy();
  function stripesCanopy() {
    const t = tex(256, 64, (c, W, Hh) => { for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#fff' : '#ff2d55'; c.fillRect(i * W / 12, 0, W / 12, Hh); } });
    return box(H, W2 * 2 + 0.3, 0.14, 1.2, new T.MeshStandardMaterial({ map: t }), 0, FL - 0.05, DEP / 2 + 0.5, { rx: 0.22 });
  }

  // ---------- light moods ----------
  const sun = new T.DirectionalLight('#ffb070', 2);
  sun.position.set(-150, 120, 170);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -240, right: 240, top: 240, bottom: -240, near: 10, far: 700 });
  sun.shadow.bias = -0.0015;
  sun.shadow.autoUpdate = false;
  sun.shadow.needsUpdate = true;
  D.scene.add(sun);
  const skyTex = (stops, extra) => { const t = tex(64, 512, (c, W, Hh) => { const g = c.createLinearGradient(0, 0, 0, Hh); stops.forEach(([p, col]) => g.addColorStop(p, col)); c.fillStyle = g; c.fillRect(0, 0, W, Hh); if (extra) extra(c, W, Hh); }); return t; };
  const moods = {
    sunset: { sky: skyTex([[0, '#17106a'], [0.22, '#4b1fb0'], [0.36, '#c81e8a'], [0.46, '#ff3d5a'], [0.5, '#ff8a1e'], [0.53, '#ffd23f'], [1, '#ffd23f']]), fog: '#ff5f7a', far: 1000, sun: 1.25, sunC: '#ffb27a', hemi: 0.5, win: 0.8, water: '#16bedb' },
    night: { sky: skyTex([[0, '#050518'], [0.38, '#141454'], [0.5, '#4a2a9c'], [0.54, '#e0218a'], [1, '#e0218a']], (c, W, Hh) => { c.fillStyle = '#fff'; for (let i = 0; i < 200; i++) c.fillRect(rnd() * W, rnd() * Hh * 0.45, 1, 1); }), fog: '#2a1a6a', far: 800, sun: 0.3, sunC: '#7f9bff', hemi: 0.3, win: 1.4, water: '#0b4fa8' },
    day: { sky: skyTex([[0, '#1176e6'], [0.42, '#3fb4ff'], [0.52, '#c6efff'], [1, '#c6efff']]), fog: '#a9e2ff', far: 1200, sun: 1.5, sunC: '#fff2d8', hemi: 0.6, win: 0, water: '#1fc8e8' },
  };
  const dome = add(D.scene, new T.SphereGeometry(900, 24, 16), new T.MeshBasicMaterial({ side: T.BackSide, fog: false, map: moods.sunset.sky }), 0, 0, 0, { cast: false, recv: false });
  D.scene.fog = new T.Fog('#ff5f7a', 240, 1000);
  const L = D.kit.lights, S = D.sets;
  let cur = null;
  function mode(m) {
    if (m === cur) return;
    cur = m;
    const inside = m === 'interior';
    city.visible = dome.visible = H.visible = !inside;
    S.EL.visible = S.LV.visible = inside;
    L.lvKey.intensity = inside ? 0.75 : 0;
    L.moon.intensity = inside ? 0.3 : 0;
    sun.intensity = inside ? 0 : moods[m].sun;
    if (inside) { L.hemi.intensity = 0.34; D.scene.fog.near = 1e4; D.scene.fog.far = 2e4; D.scene.background.set('#14121c'); return; }
    const k = moods[m];
    sun.color.set(k.sunC);
    L.hemi.intensity = k.hemi;
    D.scene.fog.color.set(k.fog); D.scene.fog.near = 240; D.scene.fog.far = k.far;
    dome.material.map = k.sky; dome.material.needsUpdate = true;
    winMats.forEach((w) => { w.emissiveIntensity = k.win; });
    water.material.color.set(k.water);
    lampHead.color.set(m === 'day' ? '#fff' : '#ffd98a');
    D.kit.heroGlow(m === 'day' ? 0.12 : m === 'night' ? 0.55 : 0.34);
    S.car.visible = true;
  }

  function update(t) {
    const wrap = (v) => ((v + LIM) % (LIM * 2) + LIM * 2) % (LIM * 2) - LIM;
    const carE = new T.Euler();
    cars.forEach((c, k) => {
      const s = wrap(c.off + c.dir * c.v * t), x = c.axis ? c.road : s, z = c.axis ? s : c.road, ry = c.axis ? (c.dir > 0 ? 0 : Math.PI) : (c.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      dummy.scale.setScalar(1); dummy.rotation.set(0, ry, 0);
      dummy.position.set(x, 0.3, z); dummy.updateMatrix(); carM.setMatrixAt(k, dummy.matrix);
      dummy.position.set(x, 0.95, z); dummy.updateMatrix(); cabM.setMatrixAt(k, dummy.matrix);
      const fx = Math.sin(ry) * 2.12, fz = Math.cos(ry) * 2.12;
      dummy.position.set(x + fx, 0.35, z + fz); dummy.updateMatrix(); hdM.setMatrixAt(k, dummy.matrix);
      dummy.position.set(x - fx, 0.4, z - fz); dummy.updateMatrix(); tlM.setMatrixAt(k, dummy.matrix);
    });
    [carM, cabM, hdM, tlM].forEach((m) => { m.instanceMatrix.needsUpdate = true; });
    people.forEach((p, k) => { const s = wrap(p.off + p.v * t); dummy.rotation.set(0, 0, 0); dummy.position.set(p.axis ? p.road : s, 0.75 + Math.abs(Math.sin(t * 6 + k)) * 0.08, p.axis ? s : p.road); dummy.updateMatrix(); pplM.setMatrixAt(k, dummy.matrix); });
    pplM.instanceMatrix.needsUpdate = true;
    wheel.rotation.z = t * 0.12;
    pods.forEach((p) => { p.rotation.z = -wheel.rotation.z; });
    clouds.forEach((c) => { c.g.position.x = ((c.x + c.v * t + 300) % 600) - 300; });
    balloons.forEach((b, k) => { b.g.position.y = b.y + Math.sin(t * 0.6 + k) * 2; });
    boats.forEach((b) => { b.b.position.set(((b.off + b.v * t) % 500) - 250, 0, b.z); });
    blink.forEach((b, k) => { b.visible = Math.sin(t * 3 + k) > 0; });
    bulbs.forEach((b, k) => { b.visible = Math.sin(t * 5 + k) > -0.5; });
  }

  const mix = (a, b, p) => a.map((v, i) => D.lerp(v, b[i], p));
  D.city = {
    group: city, mode, update,
    dive: (p) => { const q = p * p * (3 - 2 * p), k = Math.pow(q, 1.6); return { pos: mix([-118, 150, 300], [0.1, 7.4, 10], k), look: mix([0, 14, -60], [0, 7.2, 0], Math.min(1, k * 1.4)), fov: D.lerp(30, 32, q), focus: [0.36, 0.7], blur: 9 }; },
    orbit: (p, r = 150, y = 95) => { const a = -0.7 + p * 1.1; return { pos: [Math.sin(a) * r, y, Math.cos(a) * r], look: [0, 16, -20], fov: 30, focus: [0.36, 0.68], blur: 9 }; },
    street: (p) => ({ pos: [D.lerp(-18, 18, p), 2.2, 18], look: [D.lerp(-8, 8, p), 7, -30], fov: 42, focus: [0.42, 0.8], blur: 7 }),
    ferris: (p) => ({ pos: [2 * P + D.lerp(-34, -24, p), 12, 2 * P + 44], look: [2 * P, 15, 2 * P], fov: 34, focus: [0.3, 0.72], blur: 7 }),
  };
})();
