/* "You live here" kit: load after city.js. The viewer is a character we follow from just behind the shoulder, like a video game.
   D.life.you           the character in the apartment; D.life.youCity the same character in the city.
   D.life.shoulder(f, o) camera just behind figure f. o = { dist, up, side, ahead, fov, focus, blur }.
   D.life.place(f, x, z, turn)  position and face a figure. turn = Math.PI faces away from the camera side (-z).
   D.life.walk(f, t)    swing the legs and arms.
   D.life.balance(ctx, value, t, hit)  the YOUR BALANCE counter. hit = seconds since the last charge.
   D.life.charge(ctx, txt, t, t0)      a red -$12 flying off the counter.
   D.life.clock(ctx, txt, t, t0)       the time of day tag.
   D.life.stream(p, t)  money streams from every home into the gold tower; p 0 = off, 1 = full.
   D.life.rise(p)       camera view from the street up over the city to the gold tower.
   Apartment set: x = 1200, teal room, window on the skyline, bed, nightstand with clock, locked fridge. */
(() => {
  const T = D.THREE, { mat, add, box, tex } = D.kit, A = new T.Group(), rnd = Math.random;
  A.position.set(1200, 0, 0);
  D.scene.add(A);
  // ---------- apartment ----------
  const stripes = tex(256, 256, (x, w, h) => { x.fillStyle = '#0fb5a6'; x.fillRect(0, 0, w, h); x.fillStyle = '#0a9c90'; for (let i = 0; i < 8; i++) x.fillRect(i * w / 8, 0, w / 16, h); }, [3, 1]);
  box(A, 9, 4.2, 0.12, mat('#fff', { map: stripes, r: 0.8 }), 0, 2.1, -3);
  box(A, 0.12, 4.2, 12, '#ff6b4a', -4.4, 2.1, 3);
  box(A, 0.12, 4.2, 12, '#ffb01f', 4.4, 2.1, 3);
  box(A, 9, 0.08, 12, mat('#8a4f28', { r: 0.55 }), 0, 0, 3);
  add(A, new T.CylinderGeometry(2.2, 2.2, 0.03, 32), mat('#ffd23f', { r: 0.9 }), 0, 0.06, 0.2);
  const view = tex(512, 340, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#4b1fb0'); g.addColorStop(0.45, '#ff3d5a'); g.addColorStop(0.8, '#ff8a1e'); g.addColorStop(1, '#ffd23f');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const pal = ['#2a1a6a', '#3b1f7a', '#55308f', '#6c2a8a'];
    for (let i = 0; i < 34; i++) {
      const bw = 16 + rnd() * 26, bh = 60 + rnd() * 130, bx = i * w / 34 - 8;
      x.fillStyle = pal[i % 4]; x.fillRect(bx, h - bh, bw, bh);
      x.fillStyle = '#ffd27a';
      for (let q = 0; q < 26; q++) if (rnd() < 0.5) x.fillRect(bx + 3 + (q % 4) * 6, h - bh + 6 + Math.floor(q / 4) * 12, 3, 5);
    }
    x.fillStyle = '#ffc61a'; x.fillRect(w * 0.6, 26, 54, h); x.fillStyle = '#fff1a0'; x.fillRect(w * 0.6 + 8, 26, 8, h);
    x.beginPath(); x.moveTo(w * 0.6, 26); x.lineTo(w * 0.6 + 27, 0); x.lineTo(w * 0.6 + 54, 26); x.fill();
  });
  add(A, new T.PlaneGeometry(3.6, 2.4), new T.MeshBasicMaterial({ map: view }), -0.3, 2.3, -2.93, { cast: false });
  [[3.8, 0.14, -0.3, 3.55], [3.8, 0.14, -0.3, 1.05]].forEach(([w, h, x, y]) => box(A, w, h, 0.1, '#fff', x, y, -2.9));
  [-2.2, 1.6].forEach((x) => box(A, 0.14, 2.6, 0.1, '#fff', x, 2.3, -2.9));
  [-2.5, 1.9].forEach((x) => box(A, 0.6, 3.2, 0.12, '#e0218a', x, 2.1, -2.82));
  const bed = new T.Group(); bed.position.set(2.7, 0, -1.2); A.add(bed);
  box(bed, 2.4, 0.5, 3.2, '#7a4b2a', 0, 0.3, 0);
  box(bed, 2.3, 0.3, 3.1, '#fff', 0, 0.68, 0);
  box(bed, 2.35, 0.14, 2.1, '#1f6fe0', 0, 0.86, 0.55);
  box(bed, 1, 0.22, 0.6, '#ffe9c8', -0.5, 0.92, -1.2);
  box(A, 0.9, 0.9, 0.8, '#6b4428', 1.0, 0.45, -2.45);
  const clockT = tex(128, 64, (x, w, h) => { x.fillStyle = '#16060a'; x.fillRect(0, 0, w, h); x.fillStyle = '#ff2740'; x.font = '900 46px Arial'; x.textAlign = 'center'; x.fillText('7:02', w / 2, 49); });
  box(A, 0.7, 0.36, 0.3, '#222', 1.0, 1.08, -2.45);
  add(A, new T.PlaneGeometry(0.62, 0.3), new T.MeshBasicMaterial({ map: clockT }), 1.0, 1.08, -2.29, { cast: false });
  const fridge = new T.Group(); fridge.position.set(-2.9, 0, -2.2); A.add(fridge);
  box(fridge, 1.6, 3, 1.1, mat('#d7f5ee', { r: 0.25, m: 0.2 }), 0, 1.5, 0);
  box(fridge, 1.6, 0.04, 0.02, '#7aa89f', 0, 2.2, 0.56, { cast: false });
  box(fridge, 0.06, 0.8, 0.08, '#7aa89f', 0.6, 1.5, 0.58, { cast: false });
  const lock = tex(200, 150, (x, w, h) => { x.fillStyle = '#b3061f'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '44px "Lilita One", Arial'; x.fillText('LOCKED', w / 2, 62); x.font = '36px "Lilita One", Arial'; x.fillText('$12 / MONTH', w / 2, 112); });
  add(fridge, new T.PlaneGeometry(1, 0.75), new T.MeshBasicMaterial({ map: lock }), 0, 1.7, 0.57, { cast: false });
  [[3.7, 1.4, '#3fbf5a']].forEach(([x, z, c]) => { add(A, new T.CylinderGeometry(0.34, 0.26, 0.6, 14), mat('#fff'), x, 0.3, z); for (let i = 0; i < 7; i++) add(A, new T.SphereGeometry(0.34, 10, 8), mat(c, { r: 0.8 }), x + Math.sin(i * 2) * 0.3, 0.9 + (i % 3) * 0.3, z + Math.cos(i * 2) * 0.3); });
  const key = new T.PointLight('#ffd9a8', 0.9, 16, 1.6); key.position.set(0, 3.8, 2.2); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -0.002; A.add(key);
  const win = new T.PointLight('#ff7a5c', 0.8, 9, 2); win.position.set(-0.3, 2.4, -2.2); A.add(win);

  // ---------- the character ----------
  const youO = { shirt: '#128a52', pants: '#26365f', hair: 'beanie', hairColor: '#e0218a', mood: 'nervous', shoes: '#f1f1f1', phone: true };
  const you = D.figure(youO), youCity = D.figure(youO);
  A.add(you);
  D.city.group.add(youCity);
  const place = (f, x, z, turn = Math.PI, y = 0.06) => { f.position.set(x, y, z); f.rotation.y = turn; };
  const walk = (f, t) => {
    const s = Math.sin(t * 9) * 0.45;
    f.children[0].rotation.x = s; f.children[2].rotation.x = -s;
    f.userData.arms[0].rotation.x = -s * 0.7;
    if (!f.userData.phone || !f.userData.phone.visible) f.userData.arms[1].rotation.x = s * 0.7;
    f.position.y = 0.06 + Math.abs(Math.cos(t * 9)) * 0.05;
  };
  const shoulder = (f, o = {}) => {
    const d = o.dist ?? 3.4, u = o.up ?? 2.45, s = o.side ?? 0.7, a = o.ahead ?? 6, ry = f.rotation.y;
    const fx = Math.sin(ry), fz = Math.cos(ry), rx = fz, rz = -fx, w = new T.Vector3();
    f.getWorldPosition(w);
    return { pos: [w.x - fx * d + rx * s, u, w.z - fz * d + rz * s], look: [w.x + fx * a - rx * s * 0.2, o.lookY ?? 1.9, w.z + fz * a - rz * s * 0.2], fov: o.fov ?? 40, focus: o.focus ?? [0.34, 0.86], blur: o.blur ?? 7 };
  };

  // ---------- hero car in front of the tower ----------
  const car = new T.Group(); car.position.set(-1.2, 0, 7.6); car.rotation.y = 0.5; D.city.group.add(car);
  box(car, 2.2, 0.8, 4.8, mat('#ff2d55', { r: 0.25, m: 0.3 }), 0, 0.6, 0);
  box(car, 1.9, 0.7, 2.4, '#16233f', 0, 1.3, -0.2);
  [[-1.1, 1.5], [1.1, 1.5], [-1.1, -1.5], [1.1, -1.5]].forEach(([x, z]) => add(car, new T.CylinderGeometry(0.42, 0.42, 0.3, 16), mat('#17171f'), x, 0.42, z, { rz: Math.PI / 2 }));
  const rn = tex(256, 96, (x, w, h) => { x.fillStyle = '#b3061f'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = '32px "Lilita One", Arial'; x.fillText('RENEW TO START', w / 2, 60); });
  add(car, new T.PlaneGeometry(1.8, 0.6), new T.MeshBasicMaterial({ map: rn }), 0, 1.35, 1.06, { rx: -0.1, cast: false });

  // ---------- the gold tower and the money ----------
  const TX = 0, TZ = -80, TH = 190;
  const gold = mat('#ffb800', { r: 0.2, m: 0.7, e: '#c97a00', ei: 0.55 });
  const tw = new T.Group(); tw.position.set(TX, 0, TZ); D.city.group.add(tw);
  add(tw, new T.CylinderGeometry(9, 15, TH, 8), gold, 0, TH / 2, 0);
  add(tw, new T.ConeGeometry(9, 22, 8), gold, 0, TH + 11, 0);
  add(tw, new T.BoxGeometry(32, 3, 32), gold, 0, 1.5, 0);
  const beam = add(tw, new T.CylinderGeometry(0.6, 4, 400, 12, 1, true), new T.MeshBasicMaterial({ color: '#ffe680', transparent: true, opacity: 0.35, fog: false, side: T.DoubleSide, depthWrite: false }), 0, TH + 200, 0, { cast: false, recv: false });
  beam.visible = false;
  const N = 700, pts = [];
  for (let i = 0; i < N; i++) { const a = rnd() * 6.283, r = 40 + rnd() * 200; pts.push({ x: Math.cos(a) * r, z: TZ + 60 + Math.sin(a) * r, y: 4 + rnd() * 26, off: rnd(), v: 0.28 + rnd() * 0.25 }); }
  const dots = new T.InstancedMesh(new T.SphereGeometry(0.75, 6, 5), new T.MeshBasicMaterial({ color: '#ffd23f', fog: false }), N);
  dots.frustumCulled = false; dots.visible = false; D.city.group.add(dots);
  const dm = new T.Object3D();
  function stream(p, t) {
    dots.visible = beam.visible = p > 0;
    if (p <= 0) return;
    beam.material.opacity = 0.35 * p;
    pts.forEach((q, i) => {
      const k = (q.off + t * q.v) % 1, e = k * k, show = i / N < p;
      dm.position.set(D.lerp(q.x, TX, e), D.lerp(q.y, TH * 0.82, k) + Math.sin(k * Math.PI) * 26, D.lerp(q.z, TZ, e));
      dm.scale.setScalar(show ? 1 : 0.001); dm.updateMatrix(); dots.setMatrixAt(i, dm.matrix);
    });
    dots.instanceMatrix.needsUpdate = true;
  }
  const mix = (a, b, k) => a.map((v, i) => D.lerp(v, b[i], k));
  const rise = (p, from, me = [-11, 1.5, 13.6]) => { const k = D.ease(p), q = Math.pow(k, 1.5), l = D.ease((k - 0.3) / 0.55); return { pos: mix(mix(from, [-20, 46, 46], Math.min(1, k * 2.2)), [-150, 210, 240], q), look: mix(me, [TX, 120, TZ], l), fov: D.lerp(40, 34, k), focus: [0.3, 0.74], blur: D.lerp(6, 8, k) }; };

  // ---------- on-screen life ----------
  const F = D.FONT;
  const rr = (x, X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
  function balance(ctx, v, t, hit = 9) {
    const flash = hit < 0.4, s = flash ? 1 + (0.4 - hit) * 0.3 : 1, x = 28, y = 1076;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
    ctx.fillStyle = flash || v <= 0 ? D.PINK : 'rgba(14,12,26,.92)'; rr(ctx, 0, 0, 300, 96, 18); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = `20px ${F}`; ctx.fillText('YOUR BALANCE', 20, 26);
    ctx.fillStyle = '#fff'; ctx.font = `50px ${F}`; ctx.fillText('$' + Math.max(0, Math.round(v)), 20, 64);
    ctx.restore();
  }
  function charge(ctx, txt, t, t0) {
    const p = (t - t0) / 0.9;
    if (p < 0 || p > 1) return;
    ctx.save(); ctx.globalAlpha = p > 0.7 ? (1 - p) / 0.3 : 1;
    ctx.font = `60px ${F}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const y = 1130 - p * 50; ctx.lineJoin = 'round'; ctx.lineWidth = 11; ctx.strokeStyle = D.INK; ctx.strokeText(txt, 345, y);
    ctx.fillStyle = '#ff3d5a'; ctx.fillText(txt, 345, y);
    ctx.restore();
  }
  function clock(ctx, txt, t, t0) {
    if (t < t0) return;
    ctx.save(); ctx.font = `34px ${F}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(txt).width + 34;
    ctx.fillStyle = 'rgba(14,12,26,.9)'; rr(ctx, 28, 58, w, 56, 12); ctx.fill();
    ctx.fillStyle = '#ffd23f'; ctx.fillText(txt, 45, 88);
    ctx.restore();
  }
  D.life = { you, youCity, car, set: A, place, walk, shoulder, stream, rise, balance, charge, clock, towerTop: () => [TX, TH, TZ] };
})();
