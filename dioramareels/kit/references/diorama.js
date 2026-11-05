/* Diorama engine for elitesendgame: tilt-shift 3D miniature apartment building with toy figures, plus the 2D overlays
   (captions with one red word, PART banners, name labels, RULE cards, phone screens, toasts, end card).
   Needs three.js (r149, global THREE) loaded first. A reel sets window.REEL = { DURATION, draw(ctx, t), score(k) }.
   Sets live side by side in one scene, so a shot only moves the camera:
     building  x=0     cutaway tower, 5 floors, elevator shaft in the middle, night city behind
     elevator  x=100   wood-panelled car, red carpet, brass rail, emergency phone, floor display
     living    x=200   yellow striped living room, orange sofa, side table (router lives here), lamp, plant
*/
(() => {
  const W = 720, H = 1280, PINK = '#ec2c5a', INK = '#121212', FONT = '"Lilita One", "Arial Black", sans-serif';
  const T = THREE;
  const gl = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
  gl.setPixelRatio(1);
  gl.setSize(W, H, false);
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = T.PCFSoftShadowMap;
  gl.outputEncoding = T.sRGBEncoding;
  gl.toneMapping = T.ACESFilmicToneMapping;
  gl.toneMappingExposure = 0.92;
  const scene = new T.Scene();
  scene.background = new T.Color('#14121c');
  const cam = new T.PerspectiveCamera(32, W / H, 0.1, 400);

  // ---------- helpers ----------
  const mat = (c, o = {}) => new T.MeshStandardMaterial({ color: c, roughness: o.r ?? 0.5, metalness: o.m ?? 0, emissive: o.e || '#000', emissiveIntensity: o.ei ?? 1, map: o.map || null, transparent: !!o.tr, opacity: o.op ?? 1 });
  const add = (parent, geo, m, x = 0, y = 0, z = 0, o = {}) => {
    const me = new T.Mesh(geo, m);
    me.position.set(x, y, z);
    if (o.rx) me.rotation.x = o.rx;
    if (o.ry) me.rotation.y = o.ry;
    if (o.rz) me.rotation.z = o.rz;
    me.castShadow = o.cast ?? true;
    me.receiveShadow = o.recv ?? true;
    parent.add(me);
    return me;
  };
  const box = (p, w, h, d, c, x, y, z, o) => add(p, new T.BoxGeometry(w, h, d), typeof c === 'string' ? mat(c, o) : c, x, y, z, o);
  const tex = (w, h, fn, rep) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    fn(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
    return t;
  };
  const stripes = (a, b, n) => tex(256, 256, (x, w, h) => { x.fillStyle = a; x.fillRect(0, 0, w, h); x.fillStyle = b; for (let i = 0; i < n; i++) x.fillRect(i * w / n, 0, w / n / 2.4, h); });
  const wood = tex(256, 256, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, '#b4561c'); g.addColorStop(0.5, '#c86a26'); g.addColorStop(1, '#a94d18');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(70,25,5,.55)'; x.lineWidth = 3;
    for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * w / 4, 0); x.lineTo(i * w / 4, h); x.stroke(); }
    x.strokeStyle = 'rgba(255,210,150,.12)'; x.lineWidth = 1;
    for (let i = 0; i < 40; i++) { x.beginPath(); const xx = Math.random() * w; x.moveTo(xx, 0); x.bezierCurveTo(xx + 6, h * .3, xx - 6, h * .6, xx + 3, h); x.stroke(); }
  }, [2, 1]);
  const lerp = (a, b, p) => a + (b - a) * p;
  const ease = (p) => (p < 0 ? 0 : p > 1 ? 1 : p * p * (3 - 2 * p));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- toy figures ----------
  const faceCache = {};
  function faceTex(mood, glasses) {
    const key = mood + '|' + glasses;
    if (faceCache[key]) return faceCache[key];
    faceCache[key] = tex(512, 256, (x, w, h) => {
      x.clearRect(0, 0, w, h);
      const cx = w / 2, ey = h * 0.47, dx = 46;
      const look = mood === 'side' ? -16 : mood === 'sideR' ? 16 : mood === 'down' ? 0 : 0;
      const eyY = mood === 'down' ? ey + 12 : ey;
      x.fillStyle = 'rgba(255,120,120,.35)';
      [[-1], [1]].forEach(([s]) => { x.beginPath(); x.ellipse(cx + s * 78, ey + 46, 24, 13, 0, 0, 7); x.fill(); });
      x.fillStyle = '#1a1210';
      if (mood === 'calm') {
        x.lineWidth = 7; x.strokeStyle = '#1a1210'; x.lineCap = 'round';
        [-1, 1].forEach((s) => { x.beginPath(); x.arc(cx + s * dx, eyY + 4, 13, Math.PI * 1.15, Math.PI * 1.85); x.stroke(); });
      } else {
        const r = mood === 'shock' ? 15 : 12;
        [-1, 1].forEach((s) => { x.beginPath(); x.ellipse(cx + s * dx + look, eyY, r * 0.8, r * 1.15, 0, 0, 7); x.fill(); });
        x.fillStyle = '#fff';
        [-1, 1].forEach((s) => { x.beginPath(); x.arc(cx + s * dx + look + 3, eyY - 5, 3.5, 0, 7); x.fill(); });
      }
      x.strokeStyle = '#3a2418'; x.lineWidth = 7; x.lineCap = 'round';
      const br = { glare: [0.42, 18], nervous: [-0.35, 26], shock: [-0.2, 34], side: [0.1, 24], sideR: [0.1, 24], down: [0, 22], calm: [-0.1, 26] }[mood] || [0, 24];
      [-1, 1].forEach((s) => { x.save(); x.translate(cx + s * dx, eyY - br[1] - 6); x.rotate(s * br[0]); x.beginPath(); x.moveTo(-18, 0); x.lineTo(18, 0); x.stroke(); x.restore(); });
      x.lineWidth = 6; x.strokeStyle = '#5a2a20';
      x.beginPath();
      const my = ey + 62;
      if (mood === 'calm') x.arc(cx, my - 14, 20, 0.2 * Math.PI, 0.8 * Math.PI);
      else if (mood === 'nervous') { x.moveTo(cx - 22, my); for (let i = 0; i <= 8; i++) x.lineTo(cx - 22 + i * 5.5, my + (i % 2 ? -5 : 4)); }
      else if (mood === 'shock') { x.ellipse(cx, my + 2, 11, 15, 0, 0, 7); }
      else if (mood === 'glare') { x.moveTo(cx - 18, my + 4); x.lineTo(cx + 18, my - 2); }
      else { x.moveTo(cx - 14, my); x.quadraticCurveTo(cx, my + 4, cx + 14, my); }
      x.stroke();
      if (glasses) {
        x.strokeStyle = '#2b2b2b'; x.lineWidth = 6;
        [-1, 1].forEach((s) => { x.beginPath(); x.arc(cx + s * dx, ey, 30, 0, 7); x.stroke(); });
        x.beginPath(); x.moveTo(cx - dx + 30, ey); x.lineTo(cx + dx - 30, ey); x.stroke();
      }
    });
    return faceCache[key];
  }

  function figure(o) {
    const g = new T.Group(), skin = mat(o.skin || '#f2c9a0', { r: 0.42 }), shirt = mat(o.shirt, { r: 0.55 }), pants = mat(o.pants, { r: 0.6 });
    const legs = [-0.15, 0.15].map((x) => { const l = add(g, new T.CapsuleGeometry(0.13, 0.5, 6, 12), pants, x, 0.42, 0); box(g, 0.24, 0.12, 0.36, o.shoes || '#2a2a2a', x, 0.06, 0.05); return l; });
    const body = add(g, new T.CylinderGeometry(0.3, 0.4, 0.82, 24), shirt, 0, 1.08, 0);
    body.scale.z = 0.72;
    if (o.apron) { const ap = add(g, new T.CylinderGeometry(0.31, 0.41, 0.6, 24, 1, true, -0.9, 1.8), mat(o.apron), 0, 1.0, 0.012); ap.scale.z = 0.74; }
    const arms = [-1, 1].map((s) => {
      const pivot = new T.Group();
      pivot.position.set(s * 0.4, 1.38, 0);
      g.add(pivot);
      add(pivot, new T.CapsuleGeometry(0.1, 0.42, 6, 10), shirt, 0, -0.28, 0);
      add(pivot, new T.SphereGeometry(0.1, 14, 10), skin, 0, -0.6, 0);
      pivot.rotation.z = s * 0.12;
      return pivot;
    });
    const head = new T.Group();
    head.position.set(0, 1.86, 0);
    g.add(head);
    add(head, new T.SphereGeometry(0.37, 32, 24), skin, 0, 0, 0);
    const faceMat = new T.MeshStandardMaterial({ map: faceTex(o.mood || 'neutral', o.glasses), transparent: true, roughness: 0.45 });
    add(head, new T.SphereGeometry(0.372, 32, 20, Math.PI * 0.08, Math.PI * 0.84, Math.PI * 0.2, Math.PI * 0.55), faceMat, 0, 0, 0, { cast: false });
    const hc = mat(o.hairColor || '#3a2a1e', { r: 0.7 });
    if (o.hair === 'bun') {
      add(head, new T.SphereGeometry(0.39, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), hc, 0, 0.01, -0.02);
      add(head, new T.SphereGeometry(0.17, 18, 14), hc, 0, 0.36, -0.2);
    } else if (o.hair === 'beanie') {
      add(head, new T.SphereGeometry(0.4, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.38), hc, 0, 0.03, 0);
      add(head, new T.TorusGeometry(0.33, 0.06, 10, 28), hc, 0, 0.2, 0, { rx: Math.PI / 2 });
    } else if (o.hair === 'short') {
      add(head, new T.SphereGeometry(0.39, 28, 16, Math.PI * 1.15, Math.PI * 1.7, 0, Math.PI * 0.5), hc, 0, 0.02, 0, { ry: 0 });
    }
    let phone = null;
    if (o.phone) {
      phone = new T.Group();
      box(phone, 0.16, 0.28, 0.025, '#111', 0, 0, 0);
      phone.screen = box(phone, 0.14, 0.25, 0.005, mat('#000', { e: '#9fd2ff', ei: 1.2 }), 0, 0, 0.016, { cast: false });
      phone.position.set(0, -0.62, 0.1);
      arms[1].add(phone);
      phone.visible = false;
    }
    g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    g.userData = { head, arms, body, phone, faceMat, glasses: o.glasses, mood: o.mood || 'neutral' };
    g.setMood = (m) => { if (g.userData.mood !== m) { g.userData.mood = m; faceMat.map = faceTex(m, o.glasses); faceMat.needsUpdate = true; } };
    g.pose = (p = {}) => {
      const u = g.userData;
      u.head.rotation.y = p.yaw || 0;
      u.head.rotation.x = p.pitch || 0;
      u.head.position.y = 1.86 + (p.bob || 0);
      u.arms[1].rotation.x = p.phoneUp ? -1.25 * p.phoneUp : 0;
      u.arms[1].rotation.z = p.phoneUp ? 0.35 * p.phoneUp : 0.12;
      if (u.phone) u.phone.visible = !!p.phoneUp;
      if (p.mood) g.setMood(p.mood);
      g.rotation.y = p.turn ?? g.rotation.y;
    };
    return g;
  }

  // ---------- building (x = 0) ----------
  const building = new T.Group();
  scene.add(building);
  const FL = 3, RW = 4, SW = 2.4, DEP = 3.2, NF = 5;
  const roomColors = [['#f3d27a', '#4c7bd1'], ['#9fd8c9', '#e8774a'], ['#f2a7b8', '#5aa469'], ['#c9b6f0', '#e9c046'], ['#f6e6c2', '#d94f4f'], ['#a7c7f2', '#f0a35e'], ['#f0c09a', '#6c8fd9'], ['#cde8a8', '#c4568a'], ['#f5d7a1', '#3f9f9a'], ['#e7b9e0', '#e7a33b']];
  const lamps = [];
  for (let f = 0; f < NF; f++) {
    const y = f * FL;
    box(building, RW * 2 + SW + 0.4, 0.22, DEP + 0.3, '#ece6dc', 0, y, 0);
    [-1, 1].forEach((s, si) => {
      const cx = s * (SW / 2 + RW / 2), [wall, acc] = roomColors[(f * 2 + si) % roomColors.length];
      box(building, RW, FL, 0.12, '#' + new T.Color(wall).multiplyScalar(0.5).getHexString(), cx, y + FL / 2, -DEP / 2);
      box(building, 0.14, FL, DEP, '#ece6dc', s * (SW / 2 + RW), y + FL / 2, 0);
      const k = (f * 3 + si) % 4;
      if (k === 0) { box(building, 1.8, 0.45, 0.7, acc, cx, y + 0.35, -DEP / 2 + 0.5); box(building, 1.8, 0.6, 0.2, acc, cx, y + 0.7, -DEP / 2 + 0.2); }
      else if (k === 1) { box(building, 1.4, 0.35, 1.9, '#fff', cx - 0.6, y + 0.3, -0.3); box(building, 1.4, 0.15, 0.6, acc, cx - 0.6, y + 0.5, -1.0); }
      else if (k === 2) { box(building, 1.2, 0.8, 0.6, acc, cx + 0.8, y + 0.5, -DEP / 2 + 0.4); box(building, 0.7, 0.5, 0.05, mat('#111', { e: '#7ab8ff', ei: 1.5 }), cx + 0.8, y + 1.4, -DEP / 2 + 0.12); }
      else { box(building, 1.1, 0.06, 0.8, acc, cx, y + 0.75, 0); [-0.4, 0.4].forEach((d) => box(building, 0.06, 0.75, 0.06, '#555', cx + d, y + 0.4, 0)); }
      add(building, new T.CylinderGeometry(1.1, 1.1, 0.03, 24), mat(acc, { r: 0.9 }), cx + 0.3, y + 0.13, 0.4);
      const lamp = add(building, new T.SphereGeometry(0.16, 12, 10), mat('#fff6d8', { e: '#ffd38a', ei: 2 }), cx - s * 1.4, y + 1.0, -DEP / 2 + 0.4, { cast: false });
      lamps.push(lamp);
      const pl = new T.PointLight('#ffc77a', 0.3, 5, 2);
      pl.position.set(cx, y + 2.4, 0.2);
      building.add(pl);
    });
    box(building, SW, FL, 0.1, '#3b3f4a', 0, y + FL / 2, -DEP / 2);
  }
  box(building, RW * 2 + SW + 0.4, 0.3, DEP + 0.3, '#d9d2c6', 0, NF * FL, 0);
  [-1, 1].forEach((s) => [0, 1, 2, 3].forEach((i) => add(building, new T.CylinderGeometry(0.04, 0.04, NF * FL, 6), mat('#2a2a2a', { m: 0.6, r: 0.4 }), s * SW / 2, NF * FL / 2, -1.2 + i * 0.8)));
  const car = new T.Group();
  building.add(car);
  box(car, SW - 0.2, 2.5, 2.4, wood.clone ? mat('#c4651f', { map: wood }) : '#c4651f', 0, 1.25, -0.6, {});
  car.children[0].material.side = T.BackSide;
  box(car, SW - 0.2, 0.08, 2.4, '#b8202b', 0, 0.06, -0.6);
  add(car, new T.PlaneGeometry(1.2, 0.5), mat('#fff', { e: '#ffe2a8', ei: 2.2 }), 0, 2.46, -0.6, { rx: Math.PI / 2, cast: false });
  const carLight = new T.PointLight('#ffb35c', 1.6, 6, 2);
  carLight.position.set(0, 2.1, 0);
  car.add(carLight);
  car.position.set(0, 2 * FL + 0.12, 0);
  const tower = new T.Group();
  tower.position.set(2.6, NF * FL + 0.15, -0.6);
  building.add(tower);
  add(tower, new T.CylinderGeometry(0.9, 0.9, 1.5, 20), mat('#7a4a2e', { r: 0.8 }), 0, 1.6, 0);
  add(tower, new T.ConeGeometry(1.0, 0.6, 20), mat('#5b3420', { r: 0.8 }), 0, 2.65, 0);
  [-0.6, 0.6].forEach((x) => [-0.6, 0.6].forEach((z) => add(tower, new T.CylinderGeometry(0.05, 0.05, 0.9, 6), mat('#333'), x, 0.45, z)));
  const sky = add(scene, new T.PlaneGeometry(160, 120), new T.MeshBasicMaterial({ map: tex(512, 512, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#141a3a'); g.addColorStop(0.55, '#3a3a78'); g.addColorStop(1, '#8a5a7a');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 160; i++) {
      const xx = Math.random() * w, yy = h * 0.45 + Math.random() * h * 0.5, r = 2 + Math.random() * 7;
      x.fillStyle = `rgba(255,${180 + Math.random() * 60 | 0},${110 + Math.random() * 80 | 0},${0.25 + Math.random() * 0.5})`;
      x.beginPath(); x.arc(xx, yy, r, 0, 7); x.fill();
    }
    x.fillStyle = '#1a1c2c';
    for (let i = 0; i < 26; i++) { const bw = 14 + Math.random() * 30, bh = 30 + Math.random() * 120; x.fillRect(i * w / 26, h - bh, bw, bh); }
  }) }), 0, 6, -40, { cast: false, recv: false });

  // ---------- elevator interior (x = 100) ----------
  const EL = new T.Group();
  EL.position.set(100, 0, 0);
  scene.add(EL);
  const EW = 3.4, EH = 3.4, ED = 2.8;
  const woodMat = mat('#c86a26', { map: wood, r: 0.45 });
  box(EL, EW, EH, 0.1, woodMat, 0, EH / 2, -ED / 2);
  [-1, 1].forEach((s) => box(EL, 0.1, EH, ED, woodMat, s * EW / 2, EH / 2, 0));
  box(EL, EW + 6, 0.06, ED + 12, mat('#8a0a14', { r: 0.95 }), 0, 0.03, 6);
  box(EL, EW + 0.5, 0.35, ED + 0.5, '#20242e', 0, EH + 0.17, 0);
  const ceil = add(EL, new T.PlaneGeometry(2.2, 1.6), mat('#fff', { e: '#ffd59a', ei: 1.1 }), 0, EH - 0.06, 0, { rx: Math.PI / 2, cast: false });
  [-1, 1].forEach((s) => add(EL, new T.CylinderGeometry(0.035, 0.035, ED - 0.4, 10), mat('#d6a64a', { m: 0.9, r: 0.25 }), s * (EW / 2 - 0.12), 1.05, 0, { rx: Math.PI / 2 }));
  add(EL, new T.CylinderGeometry(0.035, 0.035, EW - 0.4, 10), mat('#d6a64a', { m: 0.9, r: 0.25 }), 0, 1.05, -ED / 2 + 0.12, { rz: Math.PI / 2 });
  const phoneBox = new T.Group();
  phoneBox.position.set(EW / 2 - 0.08, 1.5, -0.6);
  phoneBox.rotation.y = -Math.PI / 2;
  EL.add(phoneBox);
  box(phoneBox, 0.5, 0.7, 0.08, '#d4222d', 0, 0, 0, { r: 0.35 });
  box(phoneBox, 0.24, 0.16, 0.03, '#f6e7d6', 0, 0.12, 0.05);
  [0, 1, 2].forEach((r) => [0, 1, 2].forEach((c) => add(phoneBox, new T.SphereGeometry(0.018, 6, 6), mat('#4a0d10'), -0.06 + c * 0.06, -0.12 - r * 0.06, 0.045)));
  const display = add(EL, new T.PlaneGeometry(0.5, 0.3), new T.MeshBasicMaterial({ map: tex(128, 76, (x, w, h) => { x.fillStyle = '#120a06'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffb02e'; x.font = '900 52px Arial'; x.textAlign = 'center'; x.fillText('3', w / 2, 60); }) }), 0, EH - 0.35, -ED / 2 + 0.06, { cast: false });
  const elLight = new T.PointLight('#ffb766', 2.4, 9, 2);
  elLight.position.set(0, EH - 0.5, 0.6);
  elLight.castShadow = true;
  elLight.shadow.mapSize.set(1024, 1024);
  elLight.shadow.bias = -0.002;
  EL.add(elLight);
  const elFill = new T.PointLight('#ffd9a8', 0.5, 12, 2);
  elFill.position.set(0, 2, 5);
  EL.add(elFill);

  // ---------- living room (x = 200) ----------
  const LV = new T.Group();
  LV.position.set(200, 0, 0);
  scene.add(LV);
  const wp = stripes('#f2b632', '#e8a51f', 10);
  wp.repeat.set(3, 1); wp.wrapS = T.RepeatWrapping;
  box(LV, 9, 4, 0.1, mat('#f2b632', { map: wp, r: 0.8 }), 0, 2, -2.5);
  box(LV, 0.1, 4, 6, mat('#f2b632', { map: wp, r: 0.8 }), -4.5, 2, 0.5);
  box(LV, 9, 0.08, 6, mat('#7a4b2a', { r: 0.6 }), 0, 0, 0.5);
  add(LV, new T.CylinderGeometry(1.8, 1.8, 0.03, 32), mat('#8f2e2e', { r: 0.95 }), 0.2, 0.06, 0.4);
  const sofa = new T.Group();
  sofa.position.set(-0.6, 0, -1.6);
  LV.add(sofa);
  const sofaM = mat('#ee7a24', { r: 0.85 });
  box(sofa, 3.6, 0.55, 1.1, sofaM, 0, 0.45, 0.1);
  box(sofa, 3.6, 0.9, 0.3, sofaM, 0, 0.9, -0.35);
  [-1, 1].forEach((s) => box(sofa, 0.3, 0.75, 1.1, sofaM, s * 1.95, 0.55, 0.1));
  [-1.0, 0, 1.0].forEach((x) => box(sofa, 1.0, 0.18, 0.95, mat('#f58a33', { r: 0.9 }), x, 0.8, 0.15));
  box(sofa, 0.55, 0.5, 0.18, '#f4efe4', -1.3, 1.05, -0.12, { rz: 0.2 });
  box(LV, 1.6, 0.06, 0.8, '#3a2a22', 0.2, 0.55, 0.6);
  [-0.7, 0.7].forEach((x) => [-0.3, 0.3].forEach((z) => box(LV, 0.06, 0.5, 0.06, '#2a1d17', 0.2 + x, 0.27, 0.6 + z)));
  const sideT = new T.Group();
  sideT.position.set(2.0, 0, -1.7);
  LV.add(sideT);
  add(sideT, new T.CylinderGeometry(0.42, 0.42, 0.06, 24), mat('#6b4428'), 0, 0.9, 0);
  add(sideT, new T.CylinderGeometry(0.05, 0.05, 0.9, 8), mat('#4a2e1c'), 0, 0.45, 0);
  const router = new T.Group();
  router.position.set(0, 0.99, 0.05);
  sideT.add(router);
  box(router, 0.5, 0.12, 0.32, '#f4f4f0', 0, 0, 0, { r: 0.3 });
  [-0.18, 0.18].forEach((x) => add(router, new T.CylinderGeometry(0.018, 0.018, 0.42, 8), mat('#ececec'), x, 0.25, -0.13, { rz: x * 0.6 }));
  const leds = [-0.15, -0.05, 0.05, 0.15].map((x) => add(router, new T.SphereGeometry(0.018, 8, 8), new T.MeshBasicMaterial({ color: '#3cff7a' }), x, 0.02, 0.165, { cast: false }));
  const lamp = new T.Group();
  lamp.position.set(-3.4, 0, -1.8);
  LV.add(lamp);
  add(lamp, new T.CylinderGeometry(0.04, 0.04, 1.9, 8), mat('#2a2a2a', { m: 0.5 }), 0, 0.95, 0);
  add(lamp, new T.CylinderGeometry(0.3, 0.45, 0.5, 20, 1, true), mat('#fff1cf', { e: '#ffcf7a', ei: 1.2 }), 0, 2.0, 0, { cast: false });
  const lampL = new T.PointLight('#ffc070', 1.2, 8, 2);
  lampL.position.set(-3.4, 1.9, -1.4);
  LV.add(lampL);
  [[-1.8, 2.7, '#2f6fb5'], [0.4, 2.9, '#c94a4a'], [2.4, 2.6, '#4a9a6a']].forEach(([x, y, c]) => { box(LV, 0.7, 0.55, 0.05, '#3a2414', x, y, -2.43); box(LV, 0.56, 0.42, 0.02, c, x, y, -2.4); });
  const plant = new T.Group();
  plant.position.set(3.6, 0, -1.6);
  LV.add(plant);
  add(plant, new T.CylinderGeometry(0.28, 0.22, 0.5, 16), mat('#d9d2c6'), 0, 0.25, 0);
  for (let i = 0; i < 7; i++) add(plant, new T.SphereGeometry(0.28, 10, 8), mat('#3f8f4a', { r: 0.8 }), Math.sin(i * 2.1) * 0.25, 0.75 + (i % 3) * 0.28, Math.cos(i * 2.1) * 0.25);
  const lvKey = new T.DirectionalLight('#ffe2b8', 0.75);
  lvKey.position.set(203, 7, 6);
  lvKey.target.position.set(200, 0, -1);
  lvKey.castShadow = true;
  lvKey.shadow.mapSize.set(1024, 1024);
  Object.assign(lvKey.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 });
  scene.add(lvKey, lvKey.target);

  // global light
  scene.add(new T.HemisphereLight('#ffe9cc', '#3a2a40', 0.3));
  const moon = new T.DirectionalLight('#9fb4ff', 0.3);
  moon.position.set(-10, 30, 20);
  scene.add(moon);

  // ---------- frame render + tilt-shift ----------
  const blurC = document.createElement('canvas');
  blurC.width = W; blurC.height = H;
  const bx = blurC.getContext('2d');
  function render3d(ctx, view) {
    cam.position.set(...view.pos);
    cam.fov = view.fov || 32;
    cam.updateProjectionMatrix();
    cam.lookAt(new T.Vector3(...view.look));
    if (view.roll) cam.rotateZ(view.roll);
    gl.render(scene, cam);
    ctx.drawImage(gl.domElement, 0, 0);
    const [f0, f1] = view.focus || [0.38, 0.72], amt = view.blur ?? 9;
    if (amt > 0) {
      bx.globalCompositeOperation = 'source-over';
      bx.clearRect(0, 0, W, H);
      bx.filter = `blur(${amt}px)`;
      bx.drawImage(gl.domElement, 0, 0);
      bx.filter = 'none';
      bx.globalCompositeOperation = 'destination-in';
      const g = bx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(0,0,0,1)');
      g.addColorStop(clamp(f0 - 0.14, 0, 1), 'rgba(0,0,0,1)');
      g.addColorStop(f0, 'rgba(0,0,0,0)');
      g.addColorStop(f1, 'rgba(0,0,0,0)');
      g.addColorStop(clamp(f1 + 0.16, 0, 1), 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,1)');
      bx.fillStyle = g;
      bx.fillRect(0, 0, W, H);
      ctx.drawImage(blurC, 0, 0);
    }
    const v = ctx.createRadialGradient(W / 2, H * 0.48, H * 0.3, W / 2, H * 0.5, H * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,.38)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }
  function screen(obj, off = [0, 0, 0]) {
    const v = new T.Vector3(...off);
    obj.localToWorld(v);
    v.project(cam);
    return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, z: v.z };
  }

  // ---------- 2D overlays ----------
  const rr = (x, X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
  const pop = (t, t0, d = 0.16) => { const p = clamp((t - t0) / d, 0, 1); return p >= 1 ? 1 : 0.7 + 0.42 * Math.sin(p * Math.PI * 0.75) ; };
  const fade = (t, t0, t1, d = 0.12) => clamp(Math.min((t - t0) / d, (t1 - t) / d), 0, 1);
  function withPop(ctx, cx, cy, s, a, fn) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); fn(); ctx.restore(); }

  // caption "WORDS *RED | LINE TWO": white words, thick black outline, the * word on a pink chip
  function caption(ctx, cap, t, t0, t1, y = 845) {
    if (!cap || t < t0 || t > t1 + 0.05) return;
    const lines = cap.split('|').map((l) => l.trim().split(/\s+/));
    const size = 54;
    ctx.save();
    ctx.font = `${size}px ${FONT}`;
    ctx.textBaseline = 'middle';
    const a = fade(t, t0, t1 + 0.05, 0.08), s = pop(t, t0, 0.14);
    withPop(ctx, W / 2, y, s, a, () => {
      lines.forEach((words, li) => {
        const ws = words.map((w) => ({ red: w.startsWith('*'), txt: w.replace(/^\*/, '') }));
        const gap = 14, widths = ws.map((w) => ctx.measureText(w.txt).width + (w.red ? 20 : 0));
        let x = W / 2 - (widths.reduce((p, c) => p + c, 0) + gap * (ws.length - 1)) / 2;
        const yy = y + (li - (lines.length - 1) / 2) * (size + 12);
        ws.forEach((w, i) => {
          if (w.red) {
            ctx.fillStyle = PINK; rr(ctx, x - 2, yy - size * 0.55, widths[i] + 4, size * 1.08, 10); ctx.fill();
            ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.fillText(w.txt, x + 10, yy + 3);
          } else {
            ctx.lineJoin = 'round'; ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.strokeText(w.txt, x, yy + 3);
            ctx.fillStyle = '#fff'; ctx.fillText(w.txt, x, yy + 3);
          }
          x += widths[i] + gap;
        });
      });
    });
    ctx.restore();
  }

  // top title: small pink PART pill, white strip with black words, pink strip with white words
  function title(ctx, o, t, t0, t1, y = 175) {
    if (t < t0 || t > t1) return;
    const a = fade(t, t0, t1, 0.15);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const strip = (txt, yy, bg, fg, size, padX = 16) => {
      ctx.font = `${size}px ${FONT}`;
      const fit = ctx.measureText(txt).width + padX * 2;
      if (fit > 670) { size = Math.floor(size * 670 / fit); ctx.font = `${size}px ${FONT}`; }
      const w = ctx.measureText(txt).width + padX * 2, h = size * 1.32;
      ctx.fillStyle = bg; rr(ctx, W / 2 - w / 2, yy - h / 2, w, h, 6); ctx.fill();
      ctx.fillStyle = fg; ctx.fillText(txt, W / 2, yy + 2);
    };
    withPop(ctx, W / 2, y, pop(t, t0, 0.2), 1, () => {
      if (o.part) strip(o.part, y - 62, PINK, '#fff', 26, 12);
      strip(o.l1, y, '#fff', INK, 44);
      if (o.l2) strip(o.l2, y + 62, PINK, '#fff', 44);
      if (o.note) { ctx.font = `20px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillText(o.note, W / 2, y + (o.l2 ? 112 : 54)); }
    });
    ctx.restore();
  }

  // white pill with a thin line to a point in the scene
  function label(ctx, txt, x, y, px, py, t, t0, t1 = 1e9, o = {}) {
    if (t < t0 || t > t1) return;
    ctx.save();
    ctx.globalAlpha = fade(t, t0, t1, 0.12);
    ctx.font = `${o.size || 26}px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(txt).width + 26, h = (o.size || 26) * 1.45;
    if (px != null) { ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(px, py); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill(); }
    withPop(ctx, x, y, pop(t, t0), 1, () => {
      ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
      ctx.fillStyle = o.bg || '#fff'; rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
      ctx.shadowColor = 'transparent';
      if (o.dot) { ctx.fillStyle = o.dot; ctx.beginPath(); ctx.arc(x - w / 2 + 16, y, 6, 0, 7); ctx.fill(); }
      ctx.fillStyle = o.fg || INK; ctx.fillText(txt, x + (o.dot ? 8 : 0), y + 1);
    });
    ctx.restore();
  }

  // RULE #n card: white card with pink border and pink number, black strip under it
  function rule(ctx, n, txt, t, t0, t1, y = 330) {
    if (t < t0 || t > t1) return;
    ctx.save();
    ctx.globalAlpha = fade(t, t0, t1, 0.12);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    withPop(ctx, W / 2, y, pop(t, t0, 0.2), 1, () => {
      ctx.save(); ctx.translate(W / 2, y); ctx.rotate(-0.025);
      ctx.font = `96px ${FONT}`;
      const tw = ctx.measureText(`RULE #${n}`).width + 60;
      ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#fff'; rr(ctx, -tw / 2, -70, tw, 140, 14); ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = 7; ctx.strokeStyle = PINK; rr(ctx, -tw / 2 + 10, -60, tw - 20, 120, 10); ctx.stroke();
      ctx.fillStyle = PINK; ctx.fillText(`RULE #${n}`, 0, 6);
      ctx.restore();
      const words = txt.split('|');
      ctx.font = `38px ${FONT}`;
      const w2 = Math.max(...words.map((s) => ctx.measureText(s).width)) + 40, h2 = words.length * 46 + 20;
      ctx.fillStyle = INK; rr(ctx, W / 2 - w2 / 2, y + 86, w2, h2, 8); ctx.fill();
      ctx.fillStyle = '#fff'; words.forEach((s, i) => ctx.fillText(s, W / 2, y + 86 + 33 + i * 46));
    });
    ctx.restore();
  }

  // phone screen card: o = { app, title, rows: [{txt, sub, at, red}], y }
  function phoneCard(ctx, o, t, t0, t1) {
    if (t < t0 || t > t1) return;
    const p = ease((t - t0) / 0.3), y = (o.y || 250) + (1 - p) * 300, w = 470, h = 120 + o.rows.length * 74, x = W / 2 - w / 2;
    ctx.save();
    ctx.globalAlpha = fade(t, t0, t1, 0.15);
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#f7f7f9'; rr(ctx, x, y, w, h, 28); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#2f6fec'; rr(ctx, x, y, w, 74, 28); ctx.fill(); ctx.fillRect(x, y + 40, w, 34);
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = `30px ${FONT}`; ctx.fillText(o.title, x + 28, y + 38);
    ctx.font = `20px ${FONT}`; ctx.textAlign = 'right'; ctx.fillText(o.app, x + w - 26, y + 40);
    o.rows.forEach((r, i) => {
      if (t < r.at) return;
      const ry = y + 96 + i * 74, a = clamp((t - r.at) / 0.15, 0, 1);
      ctx.save(); ctx.globalAlpha *= a; ctx.translate((1 - a) * 30, 0);
      if (r.red) { ctx.fillStyle = 'rgba(236,44,90,.14)'; rr(ctx, x + 12, ry - 6, w - 24, 66, 14); ctx.fill(); }
      ctx.fillStyle = r.red ? PINK : '#cfd6e4'; rr(ctx, x + 26, ry + 4, 46, 46, 12); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = `24px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(r.icon || '•', x + 49, ry + 28);
      ctx.textAlign = 'left'; ctx.fillStyle = r.red ? PINK : INK; ctx.font = `30px ${FONT}`; ctx.fillText(r.txt, x + 90, ry + 18);
      ctx.fillStyle = '#7d8597'; ctx.font = `19px ${FONT}`; ctx.fillText(r.sub || 'connected', x + 90, ry + 44);
      ctx.restore();
    });
    ctx.restore();
  }

  // notification toast sliding from the top
  function toast(ctx, app, txt, t, t0, t1, y = 120) {
    if (t < t0 || t > t1) return;
    const p = ease((t - t0) / 0.25), yy = y - (1 - p) * 160, w = 600, x = W / 2 - w / 2;
    ctx.save();
    ctx.globalAlpha = fade(t, t0, t1, 0.15);
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    ctx.fillStyle = 'rgba(250,250,252,.97)'; rr(ctx, x, yy, w, 110, 26); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#2f6fec'; rr(ctx, x + 22, yy + 25, 60, 60, 14); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    [10, 20, 30].forEach((r) => { ctx.beginPath(); ctx.arc(x + 52, yy + 72, r, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke(); });
    ctx.fillStyle = '#7d8597'; ctx.font = `20px ${FONT}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillText(app, x + 100, yy + 36);
    ctx.fillStyle = INK; ctx.font = `30px ${FONT}`; ctx.fillText(txt, x + 100, yy + 74);
    ctx.restore();
  }

  // PART n end card with the comment prompt
  function endCard(ctx, o, t, t0) {
    if (t < t0) return;
    const a = clamp((t - t0) / 0.3, 0, 1);
    ctx.save();
    ctx.fillStyle = `rgba(10,8,14,${0.45 * a})`; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const y = 360;
    withPop(ctx, W / 2, y, pop(t, t0, 0.25), 1, () => {
      ctx.save(); ctx.translate(W / 2, y); ctx.rotate(-0.025);
      ctx.font = `120px ${FONT}`;
      const tw = ctx.measureText(o.part).width + 70;
      ctx.fillStyle = '#fff'; rr(ctx, -tw / 2, -85, tw, 170, 16); ctx.fill();
      ctx.lineWidth = 8; ctx.strokeStyle = PINK; rr(ctx, -tw / 2 + 11, -74, tw - 22, 148, 12); ctx.stroke();
      ctx.fillStyle = PINK; ctx.fillText(o.part, 0, 8);
      ctx.restore();
    });
    if (t > t0 + 0.35) {
      const b = clamp((t - t0 - 0.35) / 0.2, 0, 1);
      ctx.globalAlpha = b;
      ctx.font = `34px ${FONT}`;
      const sw = ctx.measureText(o.sub).width + 34;
      ctx.fillStyle = PINK; rr(ctx, W / 2 - sw / 2, y + 112, sw, 50, 8); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(o.sub, W / 2, y + 139);
      ctx.font = `60px ${FONT}`; ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = INK;
      [[o.q1, '#fff'], [o.q2, '#ffd23a']].forEach(([s, c], i) => { const yy = y + 225 + i * 72; ctx.strokeText(s, W / 2, yy); ctx.fillStyle = c; ctx.fillText(s, W / 2, yy); });
    }
    if (t > t0 + 0.8) {
      ctx.globalAlpha = clamp((t - t0 - 0.8) / 0.2, 0, 1);
      ctx.font = `30px ${FONT}`;
      const s = 'write it in the comments', w = ctx.measureText(s).width + 100, yy = y + 400;
      ctx.fillStyle = '#fff'; rr(ctx, W / 2 - w / 2, yy - 30, w, 60, 30); ctx.fill();
      ctx.fillStyle = PINK; rr(ctx, W / 2 - w / 2 + 20, yy - 12, 30, 22, 6); ctx.fill();
      ctx.fillStyle = INK; ctx.fillText(s, W / 2 + 14, yy + 1);
      ctx.fillText('↓', W / 2 + w / 2 - 26, yy + 2);
    }
    ctx.restore();
  }

  // thought bubble: rounded white cloud with two small dots down to (px, py). o.bg / o.fg recolour it.
  function thought(ctx, txt, x, y, px, py, t, t0, t1 = 1e9, o = {}) {
    if (t < t0 || t > t1) return;
    const size = o.size || 36;
    ctx.save();
    ctx.globalAlpha = fade(t, t0, t1, 0.1);
    ctx.font = `${size}px ${FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(txt).width + 56, h = size * 2;
    const bg = o.bg || '#fff';
    withPop(ctx, x, y, pop(t, t0, 0.18), 1, () => {
      ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5;
      ctx.fillStyle = bg;
      if (px != null) [[0.45, 15], [0.75, 9]].forEach(([k, r]) => { ctx.beginPath(); ctx.arc(lerp(x, px, k), lerp(y + h / 2, py, k), r, 0, 7); ctx.fill(); });
      rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = o.fg || INK; ctx.fillText(txt, x, y + 2);
    });
    ctx.restore();
  }

  // huge frame-0 hook: lines of giant white words, the *word on a pink chip. Fully readable on the very first frame.
  function hookCard(ctx, lines, t, t1, y = 150, size = 112) {
    if (t > t1) return;
    ctx.save();
    ctx.globalAlpha = clamp((t1 - t) / 0.1, 0, 1);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((l, i) => {
      const red = l.startsWith('*'), txt = l.replace(/^\*/, '');
      let sz = size;
      ctx.font = `${sz}px ${FONT}`;
      const m = ctx.measureText(txt).width + (red ? 40 : 0);
      if (m > 672) { sz = Math.floor(sz * 672 / m); ctx.font = `${sz}px ${FONT}`; }
      const yy = y + i * (size + 22), wd = ctx.measureText(txt).width;
      if (red) {
        ctx.save(); ctx.translate(W / 2, yy); ctx.rotate(-0.02);
        ctx.fillStyle = PINK; rr(ctx, -wd / 2 - 20, -sz * 0.62, wd + 40, sz * 1.24, 14); ctx.fill();
        ctx.lineWidth = 7; ctx.strokeStyle = '#fff'; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillText(txt, 0, 5);
        ctx.restore();
      } else {
        ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(txt, W / 2, yy + 4);
        ctx.fillStyle = '#fff'; ctx.fillText(txt, W / 2, yy + 4);
      }
    });
    ctx.restore();
  }

  function fiction(ctx) {
    ctx.save();
    ctx.font = `18px ${FONT}`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.fillText('FICTION', W - 24, 40);
    ctx.restore();
  }

  window.D = {
    W, H, PINK, INK, FONT, THREE: T, scene, cam, gl, figure, render3d, screen, caption, title, label, rule, phoneCard, toast, endCard, fiction, thought, hookCard, lerp, ease, clamp,
    sets: { building, car, lamps, EL, elLight, ceil, LV, router, leds, sideT, sofa, phoneBox, display },
  };
})();
