/* Extra people and places: load after life.js.
   Wedding hall at x = 1400: D.life.hall, D.life.groom, D.life.bride, D.life.guests, D.life.ringGlow(on).
   Doris in the hospital: D.life.dorisH.
   D.life.floorView(p): wide front view of the hero tower, floors all visible.
   D.life.windowsOn(p): 0 to 1 lights the hero tower's rooms one by one. */
(() => {
  const T = D.THREE, { mat, add, box, tex } = D.kit, Y = D.life;
  const W = new T.Group();
  W.position.set(1400, 0, 0);
  D.scene.add(W);
  const wood = tex(256, 256, (x, w, h) => { x.fillStyle = '#f2d6a8'; x.fillRect(0, 0, w, h); x.strokeStyle = '#d9b47a'; x.lineWidth = 3; for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(0, i * h / 8); x.lineTo(w, i * h / 8); x.stroke(); } }, [4, 8]);
  box(W, 18, 0.08, 26, mat('#fff', { map: wood, r: 0.5 }), 0, 0, 8);
  box(W, 18, 7, 0.12, '#6a2fd8', 0, 3.5, -4);
  box(W, 18, 16, 0.12, '#6a2fd8', 0, 8, 20.8);
  box(W, 0.12, 7, 26, '#e0218a', -9, 3.5, 8);
  box(W, 0.12, 7, 26, '#e0218a', 9, 3.5, 8);
  box(W, 2.6, 0.04, 24, '#c8102e', 0, 0.06, 8, { r: 0.9 });
  [-6.2, 6.2].forEach((x) => { box(W, 2.2, 4.6, 0.1, mat('#fff', { e: '#ffd27a', ei: 0.8 }), x, 3.6, -3.9, { cast: false }); box(W, 0.14, 4.8, 0.14, '#ffc61a', x, 3.6, -3.82); box(W, 2.4, 0.14, 0.14, '#ffc61a', x, 3.6, -3.82); });
  const arch = add(W, new T.TorusGeometry(3.1, 0.2, 10, 40, Math.PI), mat('#fff', { r: 0.4 }), 0, 0.1, -2.6);
  const pal = ['#ff4d8d', '#ffc61a', '#fff', '#ff8a1e', '#b05cf6'];
  for (let i = 0; i <= 34; i++) { const a = (i / 34) * Math.PI; add(W, new T.IcosahedronGeometry(0.34, 1), mat(pal[i % 5], { r: 0.6 }), Math.cos(a) * 3.1, 0.1 + Math.sin(a) * 3.1, -2.5, { cast: false }); }
  const hk = new T.PointLight('#fff0dc', 0.62, 30, 1.3); hk.position.set(0, 6.4, 3); hk.castShadow = true; hk.shadow.mapSize.set(1024, 1024); hk.shadow.bias = -0.002; W.add(hk);
  const redL = new T.PointLight('#ff2740', 0, 7, 1.8); W.add(redL);
  const groom = D.figure({ shirt: '#1a1f38', pants: '#1a1f38', hair: 'beanie', hairColor: '#e0218a', mood: 'calm', shoes: '#111', phone: true });
  const bride = D.figure({ shirt: '#fff', pants: '#fff', apron: '#fff', hair: 'bun', hairColor: '#5b3420', mood: 'calm', shoes: '#fff', skin: '#e9b98f' });
  groom.position.set(-1, 0.06, -1); groom.rotation.y = 0.5;
  bride.position.set(1, 0.06, -1); bride.rotation.y = -0.5;
  W.add(groom, bride);
  const ring = add(bride.userData.arms[0], new T.TorusGeometry(0.075, 0.03, 8, 18), mat('#ffc61a', { m: 0.8, r: 0.2, e: '#c98a00', ei: 0.4 }), 0, -0.62, 0.08, { cast: false });
  bride.userData.arms[0].rotation.x = -1.1;
  const guests = [], cols = ['#ff5a36', '#1f8efa', '#14c7a8', '#ffc300', '#7b3ff2', '#ff4d8d', '#27c93f', '#00b8d9'];
  [[-3.3, 3], [-2, 3], [2, 3], [3.3, 3], [-3.3, 5.6], [-2, 5.6], [2, 5.6], [3.3, 5.6]].forEach(([x, z], i) => {
    const g = D.figure({ shirt: cols[i], pants: '#2a2a3a', hair: i % 3 ? 'short' : 'bun', hairColor: ['#3a2a1e', '#b9b9c6', '#5b3420'][i % 3], mood: 'neutral' });
    g.position.set(x, 0.06, z); g.rotation.y = Math.PI; W.add(g); guests.push(g);
    box(W, 1.1, 0.7, 0.7, '#fff', x, 0.4, z + 0.6);
  });
  Y.hall = W; Y.groom = groom; Y.bride = bride; Y.guests = guests;
  Y.ringGlow = (on, t) => { const o = on ? (Math.sin(t * 12) > 0 ? 1 : 0.2) : 0; ring.material.color.set(on ? '#c8001a' : '#ffc61a'); ring.material.emissive.set(on ? '#ff0020' : '#c98a00'); ring.material.emissiveIntensity = on ? 1.1 * o : 0.4; redL.intensity = 0.8 * o; redL.position.set(1, 1.6, 0); };
  const dorisH = D.figure({ shirt: '#7d4fc0', pants: '#6b5b8c', hair: 'bun', hairColor: '#c9c9cf', glasses: true, mood: 'calm', skin: '#f0c7a6', shoes: '#7a3b4a' });
  dorisH.visible = false;
  Y.hospital.add(dorisH);
  Y.dorisH = dorisH;
  Y.floorView = (p) => ({ pos: [D.lerp(-3, 3, p), 14.5, D.lerp(46, 38, p)], look: [0, 14.2, 0], fov: 34, focus: [0.14, 0.86], blur: 5 });
  const glowMats = [];
  D.kit.hero.building.traverse((m) => { if (m.isMesh && m.material && m.material.emissiveIntensity != null && m.geometry && m.geometry.parameters && m.geometry.parameters.depth === 0.12) glowMats.push(m.material); });
  Y.windowsOn = (p) => glowMats.forEach((m, i) => { m.emissiveIntensity = (i / glowMats.length) < p ? 0.95 : 0.1; });
})();
