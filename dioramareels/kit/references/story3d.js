/* story3d.js: CineStory scenes with people, animals and places (skills/cinestory3d), on top of diy3d.js + lib3d.js.
   A reel: STORY((k) => { ...build with k.LIB / places...; return { shots: { name: (t, kk, a, b) => k.close(dog) }, over, score, sky } },
                 { assets: [...] }).
   Extra helpers on k (units = metres, positions relative to the reel's root):
     k.add(obj, [x,y,z], ry)            put a model in the scene (returns it); k.only(...groups) shows just those groups this frame
     k.walk(obj, from, to, u, move, t)  move along a line facing the way it goes, playing a move (default 'walk')
     k.wide(place) / k.cam(pos, look, fov, o) / k.close(obj, { d, h, side, look, fov }) / k.low(obj, o) / k.high(obj, o)
     k.orbit(target, r, ang, h, fov) / k.push(camA, camB, u)
     k.card(ctx, text, { at, t, y, bg, col, size }) a pop-in label;  k.big(ctx, text, { y, col, size, stroke }) a big centred word
     k.counter(ctx, label, value, { y }) / k.cross(ctx, t, at) a big red X / k.tick(ctx, t, at) a green tick / k.vignette(ctx, a)
   Comedy gags: k.missile(), k.strike(m, at, u), k.boom(ctx, u, x, y, word), k.launch(obj, u) (+ kit.play('riser'/'impact') in score).
   Extra places: k.snow(), k.arena(), k.space(), k.forest(), k.farm(), k.station(), k.campfire(); props: k.car({ color }),
   k.planet({ r, color, color2, bands, rings, tilt }), k.stars(n). */
window.STORY = (build, opt = {}) => DIY((k) => {
  const { T, root, M, PI } = k; const LIB = window.LIB; const groups = new Set();
  const add = k.add = (o, p = [0, 0, 0], ry = 0, parent = root) => { o.position.set(p[0], p[1], p[2]); o.rotation.y = ry; parent.add(o); return o; };
  k.LIB = LIB;
  k.place = (g) => { root.add(g); groups.add(g); return g; };
  k.only = (...gs) => { groups.forEach((g) => { g.visible = gs.includes(g); }); };
  k.walk = (o, a, b, u, move = 'walk', t = 0) => { o.position.set(a[0] + (b[0] - a[0]) * u, (a[1] || 0) + ((b[1] || 0) - (a[1] || 0)) * u, a[2] + (b[2] - a[2]) * u); o.rotation.y = Math.atan2(b[0] - a[0], b[2] - a[2]); if (o.pose) o.pose(move, t); return o; };
  const hcache = new WeakMap(); const height = (o) => { if (!hcache.has(o)) { const bb = new T.Box3().setFromObject(o); hcache.set(o, Math.max(0.2, bb.max.y - bb.min.y)); } return hcache.get(o); };
  const wpos = (o) => { const v = o.getWorldPosition(new T.Vector3()); return [v.x - root.position.x, v.y - root.position.y, v.z - root.position.z]; };
  k.cam = (pos, look, fov = 36, o = {}) => Object.assign({ pos, look, fov, focus: [0.15, 0.9], blur: 3 }, o);
  k.wide = (pl, o = {}) => k.cam(pl.cam.pos, pl.cam.look, pl.cam.fov, Object.assign({ sky: pl.sky }, o));
  k.close = (obj, o = {}) => { const p = wpos(obj), h = height(obj); const d = o.d || Math.max(1.4, h * 1.5), a = obj.rotation.y + (o.side || 0); const ly = p[1] + h * (o.look == null ? 0.82 : o.look);
    return k.cam([p[0] + Math.sin(a) * d, p[1] + h * (o.h == null ? 0.85 : o.h), p[2] + Math.cos(a) * d], [p[0], ly, p[2]], o.fov || 32, Object.assign({ focus: [0.3, 0.75], blur: 8 }, o.extra || {})); };
  k.low = (obj, o = {}) => k.close(obj, Object.assign({ h: 0.15, look: 0.7, fov: 38 }, o));
  k.high = (obj, o = {}) => k.close(obj, Object.assign({ h: 2.4, look: 0.3, fov: 40 }, o));
  k.orbit = (tg, r, ang, hgt = 1.6, fov = 36) => k.cam([tg[0] + Math.sin(ang) * r, hgt, tg[2] + Math.cos(ang) * r], tg, fov);
  k.push = (A, B, u) => Object.assign({}, A, { pos: A.pos.map((x, i) => x + (B.pos[i] - x) * u), look: A.look.map((x, i) => x + (B.look[i] - x) * u), fov: A.fov + (B.fov - A.fov) * u });
  // ---------- 2D overlays ----------
  const FONT = (w, s) => `${w} ${s}px "Nunito", "Poppins", "Arial Black", sans-serif`;
  const pop = (t, at, d = 0.3) => (t < at ? 0 : Math.min(1, (t - at) / d) * (1 + 0.15 * Math.sin(Math.min(1, (t - at) / d) * PI)));
  k.card = (ctx, text, o = {}) => { const u = o.at == null ? 1 : pop(o.t, o.at); if (u <= 0) return; ctx.save(); ctx.font = FONT(900, o.size || 52); const w = ctx.measureText(text).width + 60;
    ctx.translate(360, o.y || 240); ctx.scale(u, u); ctx.rotate(o.rot || -0.03); ctx.fillStyle = o.bg || '#e8384f'; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.roundRect(-w / 2, -(o.size || 52) * 0.9, w, (o.size || 52) * 1.8, 26); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.fillStyle = o.col || '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 4); ctx.restore(); };
  k.big = (ctx, text, o = {}) => { ctx.save(); ctx.font = FONT(900, o.size || 96); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = o.stroke || 12; ctx.strokeStyle = 'rgba(0,0,0,0.75)';
    ctx.strokeText(text, 360, o.y || 300); ctx.fillStyle = o.col || '#ffffff'; ctx.fillText(text, 360, o.y || 300); ctx.restore(); };
  k.counter = (ctx, label, value, o = {}) => { ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.roundRect(160, (o.y || 170) - 70, 400, 140, 24); ctx.fill();
    ctx.fillStyle = '#ffd23f'; ctx.font = FONT(900, 30); ctx.fillText(label, 360, (o.y || 170) - 26); ctx.fillStyle = '#fff'; ctx.font = FONT(900, 64); ctx.fillText(value, 360, (o.y || 170) + 38); ctx.restore(); };
  const mark = (ctx, t, at, draw) => { const u = pop(t, at, 0.25); if (u <= 0) return; ctx.save(); ctx.translate(360, 520); ctx.scale(u, u); ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16; draw(); ctx.restore(); };
  k.cross = (ctx, t, at) => mark(ctx, t, at, () => { ctx.strokeStyle = '#e8384f'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(-150, -150); ctx.lineTo(150, 150); ctx.moveTo(150, -150); ctx.lineTo(-150, 150); ctx.stroke(); });
  k.tick = (ctx, t, at) => mark(ctx, t, at, () => { ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(-40, 120); ctx.lineTo(170, -140); ctx.stroke(); });
  k.vignette = (ctx, a = 0.5) => { const g = ctx.createRadialGradient(360, 640, 300, 360, 640, 820); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 720, 1280); };
  k.tint = (ctx, col, a) => { ctx.save(); ctx.fillStyle = col; ctx.globalAlpha = a; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); };
  // ---------- comedy gags: k.missile() a cartoon missile; k.strike(m, [x,y,z], u) flies it down onto a spot (u 0..1, hits at 1);
  // k.boom(ctx, u, x, y, word) a cartoon explosion overlay (u 0..1 after the hit); k.launch(obj, u, base) blasts a model up into the sky spinning.
  // Sounds in score(): kit.play('riser', at) before, kit.play('impact', hit) on the hit.
  k.missile = (parent = root) => { const g = new T.Group(); const B = M('#e8eef4', 0.4, 0.3), R = M('#e8384f', 0.5);
    const body = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 1.1, 18), B); g.add(body); const nose = new T.Mesh(new T.ConeGeometry(0.12, 0.35, 18), R); nose.position.y = -0.72; nose.rotation.x = PI; g.add(nose);
    for (let i = 0; i < 4; i++) { const f = new T.Mesh(new T.BoxGeometry(0.02, 0.28, 0.22), R); f.position.set(Math.cos(i * PI / 2) * 0.14, 0.45, Math.sin(i * PI / 2) * 0.14); f.rotation.y = -i * PI / 2; g.add(f); }
    const fl = new T.Mesh(new T.ConeGeometry(0.1, 0.5, 12), new T.MeshBasicMaterial({ color: '#ffb21a', transparent: true, opacity: 0.9 })); fl.position.y = 0.8; g.add(fl); g.fl = fl; g.visible = false; parent.add(g); return g; };
  k.strike = (m, at, u, from = [6, 14, -4]) => { m.visible = u > 0 && u < 1; if (!m.visible) return m; const e = u * u; m.position.set(from[0] + (at[0] - from[0]) * e, from[1] + (at[1] - from[1]) * e, from[2] + (at[2] - from[2]) * e);
    m.rotation.set(0, 0, 0); const dx = at[0] - from[0], dy = at[1] - from[1], dz = at[2] - from[2]; m.quaternion.setFromUnitVectors(new T.Vector3(0, -1, 0), new T.Vector3(dx, dy, dz).normalize()); m.fl.scale.setScalar(0.8 + Math.random() * 0.5); return m; };
  k.boom = (ctx, u, x = 360, y = 640, word = 'BOOM!') => { if (u <= 0 || u >= 1) return; ctx.save(); const s = Math.min(1, u * 5), a = u < 0.7 ? 1 : (1 - u) / 0.3; ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
    if (u < 0.08) { ctx.restore(); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); return; }
    [['#e8384f', 300], ['#ff8a1e', 240], ['#ffd23f', 170]].forEach(([c, r]) => { ctx.fillStyle = c; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const rr = i % 2 ? r * 0.6 : r, an = i / 24 * PI * 2 + u; i ? ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr) : ctx.moveTo(Math.cos(an) * rr, Math.sin(an) * rr); } ctx.fill(); });
    ctx.rotate(-0.12); ctx.font = FONT(900, 110); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = '#1a1a1a'; ctx.strokeText(word, 0, 0); ctx.fillStyle = '#fff'; ctx.fillText(word, 0, 0); ctx.restore(); };
  k.launch = (obj, u, base) => { if (!obj.userData.home) obj.userData.home = base || [obj.position.x, obj.position.y, obj.position.z]; const h = obj.userData.home; if (u <= 0) { obj.position.set(h[0], h[1], h[2]); return obj; }
    obj.position.set(h[0] + u * 1.5, h[1] + u * 9 + Math.sin(u * PI) * 2, h[2] - u * 2); obj.rotation.x = u * 14; obj.rotation.z = u * 9; return obj; };
  // ---------- extra places + primitive props ----------
  const ctex = (w, h, f, rep = 1) => { const t = k.tex(w, h, f); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep, rep); return t; };
  const ground = (g, size, mat) => { const p = new T.Mesh(new T.PlaneGeometry(size, size), mat); p.rotation.x = -PI / 2; p.receiveShadow = true; g.add(p); return p; };
  const scatter = (g, names, n, R0, R1, h0, h1, seed = 1) => { names = names.filter((x) => LIB.gltf[x]); if (!names.length) return; for (let i = 0; i < n; i++) { const a = (i * 2.399 + seed) % (PI * 2), r = R0 + ((i * 37 + seed * 11) % 100) / 100 * (R1 - R0);
    const o = LIB.prop(names[i % names.length], { h: h0 + ((i * 13) % 10) / 10 * (h1 - h0) }); o.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); o.rotation.y = i; g.add(o); } };
  k.snow = (o = {}) => { const g = new T.Group(); ground(g, 120, M('#ffffff', 0.9, 0, { map: ctex(128, 128, (c, w, h) => { c.fillStyle = '#eef3f8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 400; i++) { c.fillStyle = i % 2 ? '#dfe8f2' : '#ffffff'; c.fillRect((i * 37) % w, (i * 91) % h, 3, 2); } }, 30) }));
    scatter(g, ['nature/tree_birch', 'nature/tree_oak'], o.trees || 14, 14, 40, 6, 9, 2); scatter(g, ['nature/rock_a', 'nature/rock_b', 'nature/rock_medium'], 8, 6, 30, 0.5, 1.4, 5);
    g.traverse((n) => { if (n.isMesh && n.material && n.material.color && n !== g.children[0]) { n.material = n.material.clone(); n.material.color.lerp(new T.Color('#ffffff'), 0.35); } });
    g.cam = { pos: [3, 1.6, 7], look: [0, 0.6, 0], fov: 38 }; g.sky = '#c9d9e8'; return k.place(g); };
  k.forest = (o = {}) => { const g = new T.Group(); ground(g, 120, M('#ffffff', 0.95, 0, { map: ctex(128, 128, (c, w, h) => { c.fillStyle = '#4d5f2c'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { c.fillStyle = ['#6b5a2e', '#3e5224', '#7a6a38'][i % 3]; c.fillRect((i * 73) % w, (i * 151) % h, 3, 2); } }, 30) }));
    scatter(g, ['nature/tree_oak', 'nature/tree_maple', 'nature/tree_birch'], o.trees || 26, 5, 40, 7, 11, 3); scatter(g, ['nature/rock_mossy', 'nature/rock_large_a'], 6, 8, 30, 0.8, 2, 7);
    g.cam = { pos: [3, 1.7, 8], look: [0, 1, 0], fov: 40 }; g.sky = '#a9cfe0'; return k.place(g); };
  k.farm = (o = {}) => { const g = LIB.place.village(o); if (LIB.gltf['props/hay']) [[-6, 4], [-5, 5.2], [7, 5]].forEach(([x, z], i) => { const h = LIB.prop('props/hay', { h: 1.4 }); h.position.set(x, 0, z); g.add(h); });
    if (LIB.gltf['buildings/fence']) for (let i = 0; i < 8; i++) { const f = LIB.prop('buildings/fence', { w: 2.5 }); f.position.set(-10 + i * 2.5, 0, 9); g.add(f); } return k.place(g); };
  k.arena = () => { const g = new T.Group(); ground(g, 80, M('#c9a46a', 0.95, 0, { map: ctex(128, 128, (c, w, h) => { c.fillStyle = '#c9a46a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 800; i++) { c.fillStyle = i % 2 ? '#b8935b' : '#d8b57c'; c.fillRect((i * 37) % w, (i * 91) % h, 2, 2); } }, 20) }));
    const ring = new T.Mesh(new T.CylinderGeometry(14, 14, 1.4, 64, 1, true), M('#a3201b', 0.6, 0, { side: T.DoubleSide })); ring.position.y = 0.7; g.add(ring);
    const top = new T.Mesh(new T.TorusGeometry(14, 0.08, 6, 64), M('#f2f2f2', 0.5)); top.rotation.x = PI / 2; top.position.y = 1.4; g.add(top);
    const stands = new T.Mesh(new T.CylinderGeometry(24, 15, 8, 64, 1, true), M('#6b5a4a', 0.9, 0, { side: T.DoubleSide })); stands.position.y = 5; g.add(stands);
    g.cam = { pos: [6, 1.8, 9], look: [0, 1, 0], fov: 40 }; g.sky = '#9fd3f2'; return k.place(g); };
  k.stars = (n = 1500, R = 300) => { const pts = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const u = (i * 0.618) % 1, v = (i * 0.37) % 1, th = u * PI * 2, ph = Math.acos(2 * v - 1); pts.set([R * Math.sin(ph) * Math.cos(th), R * Math.cos(ph), R * Math.sin(ph) * Math.sin(th)], i * 3); }
    const gm = new T.BufferGeometry(); gm.setAttribute('position', new T.BufferAttribute(pts, 3)); return new T.Points(gm, new T.PointsMaterial({ color: '#ffffff', size: 1.4, sizeAttenuation: false })); };
  k.planet = (o = {}) => { const g = new T.Group(); const tx = k.tex(256, 128, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, o.color2 || o.color || '#7fd6e0'); gr.addColorStop(0.5, o.color || '#7fd6e0'); gr.addColorStop(1, o.color2 || o.color || '#7fd6e0'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      for (let i = 0; i < (o.bands || 0); i++) { c.fillStyle = `rgba(255,255,255,${0.05 + (i % 3) * 0.04})`; c.fillRect(0, (i + 0.5) * h / (o.bands + 1), w, h / (o.bands * 3)); } });
    const s = new T.Mesh(new T.SphereGeometry(o.r || 1, 64, 40), M('#ffffff', 0.8, 0, { map: tx })); g.add(s);
    if (o.rings) { const r = new T.Mesh(new T.RingGeometry((o.r || 1) * 1.5, (o.r || 1) * (o.rings === 'thin' ? 1.62 : 2.3), 96), M(o.ringColor || '#d8d2c0', 0.6, 0, { side: T.DoubleSide, transparent: true, opacity: o.rings === 'thin' ? 0.55 : 0.85 })); r.rotation.x = PI / 2; g.add(r); }
    g.rotation.z = o.tilt || 0; g.body = s; return g; };
  k.space = () => { const g = new T.Group(); g.add(k.stars()); const sun = new T.PointLight('#fff4e0', 2.2, 0, 0); sun.position.set(-60, 20, 40); g.add(sun); g.cam = { pos: [0, 0, 8], look: [0, 0, 0], fov: 40 }; g.sky = '#03040a'; g.dark = true; return k.place(g); };
  k.car = (o = {}) => { const g = new T.Group(); const B = M(o.color || '#c0392b', 0.35, 0.4), G = M('#1b2533', 0.1, 0.6), W = M('#111', 0.8);
    const body = new T.Mesh(new T.BoxGeometry(1.8, 0.6, 4.2), B); body.position.y = 0.6; g.add(body); const cab = new T.Mesh(new T.BoxGeometry(1.6, 0.55, 2.2), G); cab.position.set(0, 1.15, -0.2); g.add(cab);
    [[-0.9, 1.3], [0.9, 1.3], [-0.9, -1.4], [0.9, -1.4]].forEach(([x, z]) => { const w = new T.Mesh(new T.CylinderGeometry(0.36, 0.36, 0.28, 20), W); w.rotation.z = PI / 2; w.position.set(x, 0.36, z); g.add(w); });
    [[-0.6, 2.11], [0.6, 2.11]].forEach(([x, z]) => { const l = new T.Mesh(new T.BoxGeometry(0.35, 0.15, 0.02), M('#fff6d0', 0.2, 0, { emissive: '#fff2b0', emissiveIntensity: o.lights ? 2 : 0.2 })); l.position.set(x, 0.72, z); g.add(l); });
    g.traverse((n) => { if (n.isMesh) n.castShadow = true; }); return g; };
  k.station = (o = {}) => { const g = LIB.place.street(Object.assign({ len: 50 }, o)); const P = M('#b9b4aa', 0.9); const plat = new T.Mesh(new T.BoxGeometry(6, 0.9, 30), P); plat.position.set(-8.5, 0.45, 0); plat.receiveShadow = true; g.add(plat);
    const roof = new T.Mesh(new T.BoxGeometry(6.4, 0.25, 14), M('#5a4a3a', 0.6)); roof.position.set(-8.5, 4.4, 0); g.add(roof); [-6, 0, 6].forEach((z) => { const p = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 3.6, 12), M('#3a3a3e', 0.4, 0.7)); p.position.set(-6.2, 2.6, z); g.add(p); });
    const sign = new T.Mesh(new T.BoxGeometry(2.4, 0.6, 0.08), M('#ffffff', 0.5, 0, { map: k.tex(256, 64, (c, w, h) => { c.fillStyle = '#1d3557'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = 'bold 40px Arial'; c.textAlign = 'center'; c.fillText(o.name || 'STATION', w / 2, 46); }) }));
    sign.position.set(-6.3, 3.4, 0); sign.rotation.y = PI / 2; g.add(sign); g.spots.platform = [-7, 0.9, 0]; g.cam = { pos: [-2, 2.2, 9], look: [-7.5, 1.4, 0], fov: 40 }; return k.place(g); };
  k.campfire = () => { const g = new T.Group(); const logs = M('#5a3a22', 0.9); for (let i = 0; i < 5; i++) { const l = new T.Mesh(new T.CylinderGeometry(0.07, 0.08, 0.9, 10), logs); l.rotation.set(PI / 2 - 0.5, i * 1.25, 0); l.position.y = 0.2; g.add(l); }
    const fl = new T.Mesh(new T.ConeGeometry(0.3, 0.9, 16), M('#ffb347', 0.4, 0, { emissive: '#ff7a1a', emissiveIntensity: 2.5, transparent: true, opacity: 0.85 })); fl.position.y = 0.55; g.add(fl); const L = new T.PointLight('#ff9a4a', 2.2, 12, 2); L.position.y = 1; g.add(L); g.flame = fl; g.light = L; return g; };
  const R = build(k); return Object.assign({ table: false }, R);
}, opt);
