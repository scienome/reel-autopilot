// 138 cinestory3d sample (skills/cinestory3d): DIY how-to, first-person hands, macro tabletop, cut every ~1.3 s,
// one plain white 1-3 word caption at a time, a see-inside shot, the last shot loops to the first.
(() => {
  const T = D.THREE, K = D.kit, S = D.scene, X0 = 6000, lerp = D.lerp, clamp = D.clamp, E = D.ease;
  const TM = window.TIMING, L = TM.lines, DUR = TM.duration;
  const seg = (t, a, b) => clamp((t - a) / Math.max(0.01, b - a), 0, 1);
  const root = new T.Group(); root.position.set(X0, 0, 0); S.add(root);
  const M = (c, r = 0.5, m = 0, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: m }, o));
  const mesh = (p, g, m, x = 0, y = 0, z = 0) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; p.add(o); return o; };
  const grp = (p, x = 0, y = 0, z = 0) => { const g = new T.Group(); g.position.set(x, y, z); p.add(g); return g; };

  // ---------- set: warm wood table, teal wall far behind, soft key + fill + rim ----------
  const wood = K.tex(512, 512, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#6b3a22'); g.addColorStop(1, '#7a4429'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) { c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(i * w / 8, 0, 3, h); }
    for (let i = 0; i < 260; i++) { c.strokeStyle = `rgba(${40 + (i % 3) * 20},${20 + (i % 5) * 6},10,0.12)`; c.lineWidth = 1 + (i % 3); c.beginPath(); const x = (i * 37) % w; c.moveTo(x, 0); c.bezierCurveTo(x + 10, h * 0.3, x - 10, h * 0.6, x + 4, h); c.stroke(); } }, [3, 3]);
  const table = mesh(root, new T.BoxGeometry(30, 0.4, 20), M('#ffffff', 0.62, 0, { map: wood }), 0, -0.2, 0); table.castShadow = false;
  const wall = mesh(root, new T.PlaneGeometry(60, 30), M('#3f8fb0', 0.9), 0, 6, -9); wall.castShadow = false;
  const key = new T.DirectionalLight('#ffe6c8', 1.25); key.position.set(X0 + 4, 9, 6); key.target.position.set(X0, 0, 0); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 40 }); key.shadow.bias = -0.0004; key.shadow.radius = 4; S.add(key, key.target);
  const fill = new T.HemisphereLight('#cfe6ff', '#4a2a1a', 0.45); S.add(fill);
  const rim = new T.DirectionalLight('#9fd8ff', 0.5); rim.position.set(X0 - 6, 5, -8); rim.target.position.set(X0, 0, 0); S.add(rim, rim.target);
  const ALL = [key, fill, rim];

  // ---------- hands: realistic proportions, 3-joint fingers, nails, sleeve ----------
  const SKIN = M('#c98466', 0.5, 0, { emissive: '#3a1408', emissiveIntensity: 0.12 }), NAIL = M('#f2cfc4', 0.3), SLEEVE = M('#2f3a4c', 0.8);
  function hand(side) { // side 1 = right, -1 = left. Rigged glTF hand (hands.js, MIT). Local: fingers +z, palm down (-y), wrist at origin.
    const h = grp(root), s = side, g = HANDS[s > 0 ? 'right' : 'left'];
    const SC = 12; // model is in metres (wrist to fingertip 0.18): 1.6 scene units like the table props
    const R = new T.Matrix4().makeBasis(new T.Vector3(0, s, 0), new T.Vector3(0, 0, -1), new T.Vector3(-s, 0, 0)); // fingers -y -> +z, palm -x*s -> -y
    g.quaternion.setFromRotationMatrix(R); g.scale.setScalar(SC); h.add(g); g.position.set(0, 0, 0); g.updateMatrixWorld(true);
    const B = {}; g.traverse((n) => { if (n.isBone) B[n.name] = n; if (n.isSkinnedMesh) { n.material = SKIN; n.castShadow = true; n.receiveShadow = true; n.frustumCulled = false; } });
    const w = new T.Vector3(); B.wrist.getWorldPosition(w); h.worldToLocal(w); g.position.sub(w); g.updateMatrixWorld(true);
    // The model's bones are all direct children of "Armature" (no chain), so fingers are posed by hand-written FK:
    // each joint turns everything after it in the finger about one axis (curl = across the palm, spread = palm normal).
    const arm = B.wrist.parent; const toArm = new T.Quaternion(); { const gq = new T.Quaternion(), aq = new T.Quaternion(); g.getWorldQuaternion(gq); arm.getWorldQuaternion(aq); toArm.copy(aq).invert().multiply(gq); }
    const CURL = new T.Vector3(0, 0, -s).applyQuaternion(toArm), SPREAD = new T.Vector3(s, 0, 0).applyQuaternion(toArm);
    const rest = g.userData.rest || (g.userData.rest = Object.fromEntries(Object.entries(B).map(([n, b]) => [n, { p: b.position.clone(), q: b.quaternion.clone() }])));
    const P = (n) => rest[n].p;
    const TH = new T.Vector3().subVectors(P('thumb-tip'), P('thumb-phalanx-proximal')).normalize().cross(new T.Vector3().subVectors(P('index-finger-phalanx-intermediate'), P('thumb-phalanx-proximal')).normalize()).normalize();
    const CH = { index: [], middle: [], ring: [], pinky: [] }; for (const f in CH) CH[f] = ['phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'].map((x) => `${f}-finger-${x}`);
    const THUMB = ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip'];
    const qa = new T.Quaternion(), cum = new T.Quaternion(), d = new T.Vector3(), pos = new T.Vector3();
    const chain = (names, turns) => { // turns[k] = [axis, angle] applied at joint k (bone k's own position)
      cum.identity(); pos.copy(P(names[0]));
      names.forEach((n, k) => { if (k > 0) { d.subVectors(P(n), P(names[k - 1])).applyQuaternion(cum); pos.add(d); }
        for (const [axis, ang] of turns[k] || []) cum.premultiply(qa.setFromAxisAngle(axis, ang));
        B[n].position.copy(pos); B[n].quaternion.copy(cum).multiply(rest[n].q); }); };
    const FING = ['index', 'middle', 'ring', 'pinky'];
    const arm3 = mesh(h, new T.CylinderGeometry(0.33, 0.42, 3.4, 28), SKIN, 0, 0.0, -1.62); arm3.rotation.x = Math.PI / 2; // forearm
    h.pose = (curl = [0.3, 0.3, 0.3, 0.3], th = 0.3, spread = 0.05) => {
      FING.forEach((f, i) => chain(CH[f], [[[SPREAD, (i - 1.5) * spread], [CURL, curl[i] * 0.9]], [[CURL, curl[i] * 1.1]], [[CURL, curl[i] * 0.8]]]));
      chain(THUMB, [[[TH, th * 0.35]], [[TH, th * 0.45]], [[TH, th * 0.5]]]); };
    const a1 = new T.Vector3(), a2 = new T.Vector3();
    h.gripWorld = (v) => { h.updateMatrixWorld(true); B['thumb-tip'].getWorldPosition(a1); B['index-finger-tip'].getWorldPosition(a2); return v.addVectors(a1, a2).multiplyScalar(0.5); };
    h.pose(); return h; }
  const RH = hand(1), LH = hand(-1);
  const POSE = { relax: [[0.25, 0.3, 0.35, 0.4], 0.25], pinch: [[0.6, 1.0, 1.15, 1.25], 1.0], hold: [[1.0, 1.1, 1.1, 1.1], 0.8], point: [[0.1, 1.2, 1.25, 1.3], 0.7], press: [[0.15, 0.4, 0.7, 0.9], 0.5] };
  const place = (h, x, y, z, yaw, pitch = 0.35, roll = 0, pose = 'relax') => { h.visible = true; h.position.set(x, y, z); h.rotation.set(0, 0, 0); h.rotateY(yaw); h.rotateX(pitch); h.rotateZ(roll); h.pose(...POSE[pose]); };

  const _v = new T.Vector3();
  const grab = (h, tgt, yaw, pitch, pose, roll = 0) => { place(h, 0, 0, 0, yaw, pitch * 0.35, roll, pose); h.gripWorld(_v); root.worldToLocal(_v); h.position.set(tgt[0] - _v.x, tgt[1] - _v.y, tgt[2] - _v.z); };
  const PI = Math.PI;
  // ---------- props ----------
  const STEEL = M('#d8dde4', 0.18, 1), RED = M('#d8322a', 0.45, 0.1), BLUE = M('#2c5bd8', 0.45, 0.1);
  const needle = new T.Group(); mesh(needle, new T.CylinderGeometry(0.022, 0.03, 1.5, 12), STEEL, 0, 0, 0).rotation.z = Math.PI / 2;
  mesh(needle, new T.ConeGeometry(0.022, 0.18, 12), STEEL, 0.84, 0, 0).rotation.z = -Math.PI / 2;
  const eye = mesh(needle, new T.TorusGeometry(0.04, 0.012, 8, 16), STEEL, -0.78, 0, 0); eye.rotation.y = Math.PI / 2;
  const tipMark = mesh(needle, new T.CylinderGeometry(0.034, 0.034, 0.32, 12), RED, 0.55, 0, 0); tipMark.rotation.z = Math.PI / 2; tipMark.visible = false;
  root.add(needle);
  const magnet = grp(root); mesh(magnet, new T.BoxGeometry(1.0, 0.32, 0.5), RED, -0.5, 0.16, 0); mesh(magnet, new T.BoxGeometry(1.0, 0.32, 0.5), BLUE, 0.5, 0.16, 0);
  const pin = new T.Group(); mesh(pin, new T.CylinderGeometry(0.012, 0.012, 0.6, 8), STEEL, 0, 0, 0); mesh(pin, new T.SphereGeometry(0.04, 12, 8), M('#e8c84a', 0.3, 0.6), 0, 0.3, 0); root.add(pin);
  const cork = grp(root); mesh(cork, new T.CylinderGeometry(0.45, 0.45, 0.16, 32), M('#c99a62', 0.85), 0, 0, 0);
  const bowl = grp(root, 0, 0, 0); { const pts = []; for (let i = 0; i <= 12; i++) { const a = i / 12; pts.push(new T.Vector2(1.6 + Math.sin(a * 1.4) * 0.6, a * 1.0)); }
    mesh(bowl, new T.LatheGeometry(pts, 48), M('#f4f1ea', 0.25, 0, { side: T.DoubleSide }), 0, 0, 0);
    const wat = mesh(bowl, new T.CylinderGeometry(2.08, 2.08, 0.04, 48), M('#5fb0d8', 0.05, 0, { transparent: true, opacity: 0.75 }), 0, 0.78, 0); wat.castShadow = false; }
  const card = grp(root); { const nt = K.tex(256, 256, (c, w, h) => { c.fillStyle = '#f4efe2'; c.fillRect(0, 0, w, h); c.fillStyle = '#c8302a'; c.font = 'bold 150px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('N', w / 2, h / 2 + 8); });
    const cm = mesh(card, new T.BoxGeometry(0.9, 0.02, 0.9), M('#ffffff', 0.8, 0, { map: nt }), 0, 0.01, 0); cm.castShadow = false; }
  const pen = grp(root); mesh(pen, new T.CylinderGeometry(0.07, 0.07, 1.6, 16), M('#1a1a1a', 0.35), 0, 0, 0); mesh(pen, new T.ConeGeometry(0.07, 0.2, 16), RED, 0, -0.9, 0).rotation.x = Math.PI;
  // see-inside: a giant glass needle section full of little magnetic arrows (domains)
  const inside = grp(root, 0, 3, 0); const glass = mesh(inside, new T.CylinderGeometry(1.4, 1.4, 6, 40, 1, true), M('#bcd2e8', 0.1, 0.6, { transparent: true, opacity: 0.18, side: T.DoubleSide }), 0, 0, 0); glass.rotation.z = Math.PI / 2; glass.castShadow = false;
  const doms = []; for (let i = 0; i < 70; i++) { const a = grp(inside, (i % 14) * 0.42 - 2.75, ((i * 37) % 9) * 0.26 - 1.05, ((i * 53) % 7) * 0.3 - 0.9);
    mesh(a, new T.CylinderGeometry(0.04, 0.04, 0.32, 8), M('#ff6a3a', 0.3, 0, { emissive: '#ff3a1a', emissiveIntensity: 0.6 }), 0, -0.05, 0); mesh(a, new T.ConeGeometry(0.1, 0.18, 10), M('#ffd23f', 0.3, 0, { emissive: '#ffb02e', emissiveIntensity: 0.6 }), 0, 0.18, 0);
    a.r0 = [(i * 1.7) % 6.28, (i * 2.9) % 6.28]; doms.push(a); }
  // Earth with field lines
  const earth = grp(root, 0, 3, 0); mesh(earth, new T.SphereGeometry(1.2, 48, 32), M('#2f6fc8', 0.6, 0, { emissive: '#0a2a5a', emissiveIntensity: 0.5 }), 0, 0, 0);
  [[0.5, 0.2], [-0.4, -0.3], [0.1, 0.8], [-0.7, 0.4]].forEach(([u, v]) => mesh(earth, new T.SphereGeometry(0.45, 20, 14), M('#4aa05a', 0.8), Math.cos(u) * 0.9 * Math.cos(v), Math.sin(v) * 0.9, Math.sin(u) * 0.9 * Math.cos(v)).scale.set(1, 0.6, 0.35));
  const lines = []; for (let i = 0; i < 6; i++) { const r = 1.7 + (i % 3) * 0.6; const tor = mesh(earth, new T.TorusGeometry(r, 0.02, 6, 80, Math.PI * 1.7), M('#9fe8ff', 0.3, 0, { emissive: '#5fd0ff', emissiveIntensity: 1 }), 0, 0, 0);
    tor.rotation.set(0, (i * Math.PI) / 3, Math.PI / 2 + 0.3); tor.castShadow = false; lines.push(tor); }
  const ALLP = [needle, magnet, pin, cork, bowl, card, pen, inside, earth];

  // ---------- shots ----------
  const ORDER = L.map((l) => l.shot); const st = (n) => TM.shots[n];
  const ln = (n) => L.find((l) => l.shot === n);
  const cams = { // [pos, look, fov, focus band]
    table: (k) => ({ pos: [lerp(0.6, 0.3, k), 3.4, lerp(4.6, 4.0, k)], look: [0, 0.4, 0], fov: 34, focus: [0.3, 0.8], blur: 7 }),
    macro: (k, x = 0) => ({ pos: [x + lerp(0.5, 0.2, k), 1.4, lerp(2.4, 1.9, k)], look: [x, 0.2, 0], fov: 30, focus: [0.35, 0.72], blur: 10 }),
  };
  function hideAll() { ALLP.forEach((o) => { o.visible = false; }); RH.visible = LH.visible = false; tipMark.visible = false; [key, fill, rim].forEach((l) => { l.visible = true; }); }
  function hookPose(t, k) { // needle on the table, the viewer's right hand reaches in and pinches it
    needle.visible = magnet.visible = true; magnet.position.set(-1.1, 0, -0.3); magnet.rotation.set(0, 0.35, 0);
    needle.position.set(0.15, 0.05, 0.2); needle.rotation.set(0, 0.25, 0); const reach = E(k);
    grab(RH, [lerp(1.5, 0.35, reach), lerp(0.9, 0.12, reach), lerp(2.0, 0.25, reach)], PI + 0.35, 0.55, reach > 0.75 ? 'pinch' : 'relax'); }
  const SH = {
    hook: (t, k) => { hookPose(t, k); return { pos: [lerp(0.4, 0.2, k), 3.4, lerp(4.4, 3.9, k)], look: [0, 0.1, -0.2], fov: 36, focus: [0.25, 0.85], blur: 7 }; },
    take: (t, k) => { needle.visible = magnet.visible = true; const bob = Math.sin(t * 1.5) * 0.03;
      needle.position.set(0.55, 0.6 + bob, -0.4); needle.rotation.set(0, 0.5, 0.15); grab(RH, [0.9, 0.6 + bob, -0.35], PI + 0.4, 0.35, 'pinch');
      magnet.position.set(-0.9, 0.45, -0.3); magnet.rotation.set(0, -0.3, 0); grab(LH, [-1.0, 0.5, -0.1], PI - 0.35, 0.4, 'hold');
      return { pos: [0, 3.2, 4.4], look: [0, 0.3, -0.3], fov: 36, focus: [0.25, 0.8], blur: 8 }; },
    stroke: (t, k) => { magnet.visible = needle.visible = true; magnet.position.set(0, 0, 0); magnet.rotation.set(0, 0, 0);
      const c = (t * 1.6) % 1, onM = c < 0.65, x = onM ? lerp(-0.8, 0.8, c / 0.65) : lerp(0.8, -0.8, (c - 0.65) / 0.35), y = onM ? 0.36 : 0.36 + Math.sin(((c - 0.65) / 0.35) * PI) * 0.45;
      needle.position.set(x, y, 0.05); needle.rotation.set(0, 0, 0); grab(RH, [x + 0.68, y + 0.05, 0.05], -1.35, 0.3, 'pinch');
      grab(LH, [-1.4, 0.2, 0.3], PI - 0.5, 0.35, 'press');
      return { pos: [lerp(0.4, 0.1, k), 3.2, 4.2], look: [0, 0.2, -0.2], fov: 36, focus: [0.3, 0.8], blur: 8 }; },
    inside: (t, k, a) => { inside.visible = true; key.visible = false; const al = E(seg(t, a + 0.6, a + 3.2));
      doms.forEach((d) => { d.rotation.set(lerp(d.r0[0], 0, al), 0, lerp(d.r0[1], -PI / 2, al)); });
      return { pos: [lerp(0.3, -0.3, k), 3.4, lerp(6.2, 5.2, k)], look: [0, 3, 0], fov: 36, focus: [0.2, 0.9], blur: 6, dark: true }; },
    test: (t, k, a) => { needle.visible = pin.visible = true; needle.position.set(0, 0.95, -0.2); needle.rotation.set(0, 0, -1.2);
      grab(RH, [-0.22, 1.68, -0.2], -1.3, 0.6, 'pinch');
      const lift = E(seg(t, a + 1.4, a + 2.4)); pin.position.set(-0.32, lerp(0.02, 0.42, lift), -0.2); pin.rotation.set(0, 0, lerp(PI / 2, 0.25, lift));
      return { pos: [0.1, 2.0, 4.3], look: [0, 0.75, -0.2], fov: 34, focus: [0.25, 0.8], blur: 8 }; },
    cork: (t, k) => { cork.visible = needle.visible = true; cork.position.set(0, 0.08, 0); const push = E(k);
      needle.position.set(lerp(1.1, 0, push), 0.12, 0); needle.rotation.set(0, 0, 0); grab(RH, [lerp(1.1, 0, push) + 0.72, 0.15, 0.02], -1.4, 0.2, 'pinch');
      grab(LH, [-0.6, 0.12, 0.35], PI - 0.3, 0.3, 'hold');
      return { pos: [0.2, 3.0, 4.2], look: [0, 0.1, -0.2], fov: 36, focus: [0.3, 0.8], blur: 8 }; },
    float: (t, k) => { bowl.visible = cork.visible = needle.visible = true; cork.add(needle); needle.position.set(0, 0.06, 0); needle.rotation.set(0, 0, 0);
      const drop = E(seg(k, 0, 0.5)); cork.position.set(0, lerp(1.8, 0.84, drop) + Math.sin(t * 2) * 0.01, 0); cork.rotation.set(0, 0.9 + Math.sin(t) * 0.05, 0);
      if (drop < 0.98) grab(RH, [0.45, lerp(1.85, 2.4, drop), 0.0], -1.3, 1.2, 'pinch');
      return { pos: [0.4, 3.4, 4.4], look: [0, 0.7, 0], fov: 34, focus: [0.3, 0.8], blur: 7 }; },
    turn: (t, k) => { bowl.visible = cork.visible = needle.visible = card.visible = true; cork.position.set(0, 0.84, 0); cork.add(needle); needle.position.set(0, 0.06, 0);
      const a = E(k); cork.rotation.set(0, lerp(0.9, -PI / 2, a) + Math.sin(t * 3) * 0.04 * (1 - a), 0); card.position.set(0, 0.0, -2.7);
      return { pos: [0, 5.6, 1.6], look: [0, 0.6, -0.5], fov: 40, focus: [0.15, 0.9], blur: 4 }; },
    earth: (t, k) => { earth.visible = true; key.visible = false; earth.rotation.y = t * 0.3; lines.forEach((l, i) => { l.material.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 3 + i); });
      return { pos: [lerp(0, 0.8, k), 3.2, lerp(9, 7.8, k)], look: [0, 3, 0], fov: 36, focus: [0.1, 0.95], blur: 3, dark: true }; },
    mark: (t, k, a, b) => { const sw = lerp(a, b, 0.62); if (t > sw) { const kk = seg(t, sw, b); hookPose(t, kk); return { pos: [lerp(0.4, 0.2, kk), 3.4, lerp(4.4, 3.9, kk)], look: [0, 0.1, -0.2], fov: 36, focus: [0.25, 0.85], blur: 7 }; }
      needle.visible = pen.visible = true; needle.position.set(0, 0.04, 0.1); needle.rotation.set(0, 0, 0); tipMark.visible = t > a + 1.2;
      const tap = Math.abs(Math.sin(t * 4)) * 0.12; pen.position.set(0.62, 0.95 + tap, 0.1); pen.rotation.set(0, 0, 0.25);
      grab(RH, [0.75, 1.3 + tap, 0.15], -1.2, 0.9, 'hold');
      return { pos: [0.3, 3.0, 4.0], look: [0.3, 0.3, -0.2], fov: 36, focus: [0.3, 0.8], blur: 8 }; },
  };
  // captions: 1-3 words at a time, timed inside each voice line by length
  const CH = []; L.forEach((l) => { const ws = (l.cap || '').split(/\s+/).filter(Boolean); const chunks = []; for (let i = 0; i < ws.length;) { const n = ws.length - i <= 3 ? ws.length - i : (ws[i + 1] && ws[i + 1].length > 7 ? 2 : 3); chunks.push(ws.slice(i, i + n).join(' ')); i += n; }
    const tot = chunks.reduce((s, c) => s + c.length + 2, 0); let acc = l.t0; chunks.forEach((c) => { const d = (l.t1 - l.t0) * (c.length + 2) / tot; CH.push([acc, acc + d, c.replace(/[,.]$/, '')]); acc += d; }); });
  function caption(ctx, t) { const c = CH.find(([a, b]) => t >= a && t < b + 0.05); if (!c) return; ctx.save(); ctx.font = '900 54px "Nunito", "Poppins", "Arial Black", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.75)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 3; ctx.fillStyle = '#ffffff'; ctx.fillText(c[2], 360, 1050); ctx.restore(); }

  function draw(ctx, t) {
    let n = ORDER[0]; ORDER.forEach((s) => { if (t >= st(s)) n = s; });
    const i = ORDER.indexOf(n), a = st(n), b = i + 1 < ORDER.length ? st(ORDER[i + 1]) : DUR, k = seg(t, a, b);
    if (D.city) D.city.mode('interior'); K.lights.moon.intensity = 0; K.lights.lvKey.intensity = 0; K.lights.hemi.intensity = 0;
    D.gl.toneMapping = T.ACESFilmicToneMapping; D.gl.toneMappingExposure = 1.0;
    hideAll(); root.add(needle); root.add(magnet); root.add(pin);
    const v = SH[n](t, k, a, b);
    if (RH.visible || LH.visible) { const d = 1.5; v.pos = v.pos.map((x, i) => v.look[i] + (x - v.look[i]) * d); v.pos[1] += 0.8; v.fov *= 0.78; } // hand shots: camera back and above the arms, longer lens
    S.background = new T.Color(v.dark ? '#0b0e16' : '#2f6f8c'); S.fog = null; wall.visible = !v.dark; table.visible = !v.dark;
    const hand = Math.sin(t * 1.3) * 0.015, cam = { ...v, pos: [X0 + v.pos[0] + hand, v.pos[1] + Math.sin(t * 1.7) * 0.01, v.pos[2]], look: [X0 + v.look[0], v.look[1], v.look[2]] };
    D.render3d(ctx, cam);
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,170,90,0.12)'; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); // warm grade
    caption(ctx, t);
    const cut = t - a; if (a > 0 && cut < 0.06) { ctx.fillStyle = `rgba(255,255,255,${0.12 * (1 - cut / 0.06)})`; ctx.fillRect(0, 0, 720, 1280); }
  }
  function score(k) { ORDER.forEach((s, i) => { if (i) k.play('whoosh', st(s), { dur: 0.18, gain: 0.12, minor: true }); });
    const at = (s, d = 0) => st(s) + d; k.play('click', at('take', 0.6), { gain: 0.3 });
    for (let i = 0; i < 6; i++) k.play('whoosh', at('stroke', 0.3 + i * 0.62), { dur: 0.25, gain: 0.16, minor: true });
    k.play('ding', at('inside', 2.8), { f: 'E6', gain: 0.3 }); k.play('click', at('test', 2.2), { gain: 0.4 }); k.play('pop', at('cork', 1.6), { gain: 0.35 });
    k.play('ding', at('turn', 2.2), { f: 'C6', gain: 0.35 }); k.play('click', at('mark', 1.2), { gain: 0.3 }); }
  window.REEL = { DURATION: DUR, draw, score };
})();
