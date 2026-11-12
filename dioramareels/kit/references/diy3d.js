// diy3d.js: shared kit for CineStory DIY reels (skills/cinestory3d, "how to make it" shape): a warm wood table, a coloured
// wall far behind, soft key/fill/rim light, two realistic rigged hands (hands.js, MIT) that grab props, 1-3 word white
// captions, a cut flash and a whoosh on every cut. A reel calls DIY((k) => ({ props, shots, score, wall })) where k holds the
// helpers (T, root, M, mesh, grp, tex, grab, place, RH, LH, seg, E, lerp, clamp, PI, liquid, glassM) and shots maps each
// script.json shot name to (t, k01, start, end) => camera { pos, look, fov, focus, blur, dark? } in table units (1 unit
// ~ 7 cm; the hand is 2.1 units long). Hidden-by-default: every object in props is hidden at the start of each frame.
// Library models (people, animals, places from lib3d.js): DIY(build, { assets: ['humans/Superhero_Male', 'humans/ual1', ...] })
// loads them first. Story scenes away from the table: return { table: false, sky: '#9fd3f2', ... } and build a LIB.place.
window.DIY = (build, opt = {}) => {
  if (opt.assets && opt.assets.length && !opt.loaded) { window.REEL_READY = LIB.need(opt.assets).then(() => window.DIY(build, Object.assign({}, opt, { loaded: true }))); return; }
  const T = D.THREE, K = D.kit, S = D.scene, X0 = 6000, lerp = D.lerp, clamp = D.clamp, E = D.ease, PI = Math.PI;
  const TM = window.TIMING, L = TM.lines, DUR = TM.duration;
  const seg = (t, a, b) => clamp((t - a) / Math.max(0.01, b - a), 0, 1);
  const root = new T.Group(); root.position.set(X0, 0, 0); S.add(root);
  const M = (c, r = 0.5, m = 0, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: r, metalness: m }, o));
  const mesh = (p, g, m, x = 0, y = 0, z = 0) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; p.add(o); return o; };
  const grp = (p, x = 0, y = 0, z = 0) => { const g = new T.Group(); g.position.set(x, y, z); p.add(g); return g; };
  const glassM = (o = {}) => M('#dfeaf2', 0.05, 0, Object.assign({ transparent: true, opacity: 0.22, side: T.DoubleSide, depthWrite: false }, o));
  const liquid = (c, op = 0.8) => M(c, 0.1, 0, { transparent: true, opacity: op });
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
  const grab = (h, tgt, yaw, pitch, pose, roll = 0) => { // tgt = where the thumb-index pinch point goes
    place(h, 0, 0, 0, yaw, pitch * 0.35, roll, pose); h.gripWorld(_v); root.worldToLocal(_v); h.position.set(tgt[0] - _v.x, tgt[1] - _v.y, tgt[2] - _v.z); };

  const k = { T, K, S, root, M, mesh, grp, tex: K.tex, grab, place, RH, LH, seg, E, lerp, clamp, PI, liquid, glassM, L, TM, st: (n) => TM.shots[n], wall, table, key };
  const R = build(k); const ALLP = R.props || [];
  const ORDER = L.map((l) => l.shot); const st = (n) => TM.shots[n];
  // captions: 1-3 words at a time, timed inside each voice line by length
  const CH = []; L.forEach((l) => { const ws = (l.cap || '').split(/\s+/).filter(Boolean); const chunks = []; for (let i = 0; i < ws.length;) { const n = ws.length - i <= 3 ? ws.length - i : (ws[i + 1] && ws[i + 1].length > 7 ? 2 : 3); chunks.push(ws.slice(i, i + n).join(' ')); i += n; }
    if (l.words && l.words.length === ws.length) { let wi = 0; chunks.forEach((c, ci) => { const n = c.split(/\s+/).length, a0 = l.words[wi][0], nx = ci + 1 < chunks.length ? l.words[wi + n][0] : l.t1 + 0.15; CH.push([a0, Math.max(a0 + 0.2, nx), c.replace(/[,.]$/, '')]); wi += n; }); return; } // word-timed
    const tot = chunks.reduce((s, c) => s + c.length + 2, 0); let acc = l.t0; chunks.forEach((c) => { const d = (l.t1 - l.t0) * (c.length + 2) / tot; CH.push([acc, acc + d, c.replace(/[,.]$/, '')]); acc += d; }); });
  function caption(ctx, t) { const c = CH.find(([a, b]) => t >= a && t < b + 0.05); if (!c) return; ctx.save(); const small = R.capStyle === 'small', film = R.capStyle === 'film'; if (film) { ctx.font = '900 50px "Nunito", "Poppins", "Arial Black", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(0,0,0,0.85)'; ctx.strokeText(c[2], 360, 860); ctx.fillStyle = '#ffffff'; ctx.fillText(c[2], 360, 860); ctx.restore(); return; } // 'small': quiet white caps in the middle of the frame (Elites Endgame build-up reels)
    ctx.font = small ? '800 34px "Nunito", "Poppins", "Arial Black", sans-serif' : '900 54px "Nunito", "Poppins", "Arial Black", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.75)'; ctx.shadowBlur = small ? 10 : 14; ctx.shadowOffsetY = small ? 2 : 3; ctx.fillStyle = '#ffffff'; ctx.fillText(small ? c[2].toUpperCase() : c[2], 360, small ? 660 : 1050); ctx.restore(); }

  function draw(ctx, t) {
    let n = ORDER[0]; ORDER.forEach((s) => { if (t >= st(s)) n = s; });
    const i = ORDER.indexOf(n), a = st(n), b = i + 1 < ORDER.length ? st(ORDER[i + 1]) : DUR, kk = seg(t, a, b);
    if (D.city) D.city.mode('interior'); K.lights.moon.intensity = 0; K.lights.lvKey.intensity = 0; K.lights.hemi.intensity = 0;
    D.gl.toneMapping = T.ACESFilmicToneMapping; D.gl.toneMappingExposure = R.light && R.light.exposure || 1.0;
    if (R.light && !R.light.done) { const L = R.light; L.done = true; if (L.sun) key.position.set(X0 + L.sun[0], L.sun[1], L.sun[2]); if (L.key != null) key.intensity = L.key; if (L.fill != null) fill.intensity = L.fill; if (L.rim != null) rim.intensity = L.rim; if (L.color) key.color.set(L.color); if (L.shadow) { Object.assign(key.shadow.camera, { left: -L.shadow, right: L.shadow, top: L.shadow, bottom: -L.shadow, far: 80 }); key.shadow.mapSize.set(4096, 4096); if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; } key.shadow.camera.updateProjectionMatrix(); } } // R.light: { sun, key, fill, rim, color, shadow, exposure, grade }
    ALLP.forEach((o) => { o.visible = false; }); RH.visible = LH.visible = false; ALL.forEach((l) => { l.visible = true; });
    const v = R.shots[n](t, kk, a, b);
    if (R.lens && !v.tight) { const lf = 2 * Math.atan(18 / R.lens) * 180 / Math.PI; if (!(v.fov >= lf)) v.fov = lf; } // R.lens: focal length in mm (full-frame, long side vertical); 24 = wide, shows the whole scene. A shot can keep its own framing with tight: true
    if (R.minDist && !v.tight) { const d = Math.hypot(v.pos[0] - v.look[0], v.pos[1] - v.look[1], v.pos[2] - v.look[2]); if (d > 0.01 && d < R.minDist) { const f = R.minDist / d; v.pos = v.pos.map((x, j) => v.look[j] + (x - v.look[j]) * f); } } // R.minDist: pull close cameras back (toy cast has big heads)
    if (RH.visible || LH.visible) { const d = 1.5; v.pos = v.pos.map((x, j) => v.look[j] + (x - v.look[j]) * d); v.pos[1] += 0.8; v.fov *= 0.78; } // hand shots: camera back and above the arms
    S.background = new T.Color(v.dark ? '#0b0e16' : (R.wall || '#2f6f8c')); S.fog = R.fog ? new T.FogExp2(R.fog[0], v.fog != null ? v.fog : R.fog[1]) : null; wall.visible = !v.dark && R.table !== false; table.visible = !v.dark && !v.noTable && R.table !== false; if (R.sky && !v.dark) S.background = new T.Color(v.sky || R.sky); wall.material.color.set(R.wall || '#3f8fb0');
    const hand = Math.sin(t * 1.3) * 0.015, cam = { ...v, pos: [X0 + v.pos[0] + hand, v.pos[1] + Math.sin(t * 1.7) * 0.01, v.pos[2]], look: [X0 + v.look[0], v.look[1], v.look[2]] };
    D.render3d(ctx, cam);
    if (!(R.light && R.light.grade === false)) { ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,170,90,0.12)'; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); } // warm grade
    if (R.over) R.over(ctx, t, n, kk);
    caption(ctx, t);
    const cut = t - a; if (a > 0 && cut < 0.06) { ctx.fillStyle = `rgba(255,255,255,${0.12 * (1 - cut / 0.06)})`; ctx.fillRect(0, 0, 720, 1280); }
  }
  function score(kit) { ORDER.forEach((s, i) => { if (i && ORDER[i - 1] !== s) kit.play('whoosh', st(s), { dur: 0.18, gain: 0.12, minor: true }); });
    if (R.score) R.score(kit, (s, d = 0) => st(s) + d); }
  window.REEL = { DURATION: DUR, draw, score };
};
