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
   Build-up dioramas: k.stone(), k.wall(a, b, o), k.tower(p, o), k.town(o), k.army(n, o), k.rise(obj, u), k.water(w, d), k.hill(r, h).
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
  // ---------- build-up dioramas (Elites Endgame "you build it" reels; miniature scale, keep within about ±8 units for shadows) ----------
  // k.stone(rep) a stone-block material; k.wall([x,z], [x,z], { h, th, cren }) a crenellated wall; k.tower([x,z], { r, h, round, roof })
  // k.town({ x, z, w, d, n, seed, avoid(x,z) }) instanced houses; k.army(n, { col, head, h }) instanced tiny people: .put(i, x, z, ry, bob) .hideFrom(n)
  // k.rise(obj, u) grows a model up out of the ground (u 0..1); k.water(w, d) a flat water sheet; k.hill(r, h) a grassy mound
  const stoneTex = {}; k.stone = (rep = 2, col = '#c9b48c') => { const key = rep + col; if (!stoneTex[key]) stoneTex[key] = ctex(256, 256, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); for (let r = 0; r < 16; r++) for (let i = 0; i < 8; i++) { const x = i * 32 + (r % 2) * 16, y = r * 16; const v = ((r * 7 + i * 13) % 9) / 9; c.fillStyle = `rgba(${90 + v * 40},${70 + v * 30},${40 + v * 20},0.25)`; c.fillRect(x + 1, y + 1, 30, 14); c.strokeStyle = 'rgba(60,45,25,0.55)'; c.lineWidth = 1.5; c.strokeRect(x + 0.5, y + 0.5, 32, 16); } }, rep); return M('#ffffff', 0.95, 0, { map: stoneTex[key] }); };
  k.wall = (a, b, o = {}) => { const h = o.h || 0.8, th = o.th || 0.22, g = new T.Group(), dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), mat = o.mat || k.stone(Math.max(1, L * 1.4));
    const body = new T.Mesh(new T.BoxGeometry(L, h, th), mat); body.position.y = h / 2; body.castShadow = body.receiveShadow = true; g.add(body);
    if (o.cren !== false) { const n = Math.max(2, Math.floor(L / 0.16)); for (let i = 0; i < n; i++) if (i % 2 === 0) { const m = new T.Mesh(new T.BoxGeometry(L / n, h * 0.14, th * 1.02), mat); m.position.set(-L / 2 + (i + 0.5) * L / n, h + h * 0.07, 0); m.castShadow = true; g.add(m); } }
    g.position.set((a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2); g.rotation.y = -Math.atan2(dz, dx); return g; };
  k.tower = (p, o = {}) => { const r = o.r || 0.35, h = o.h || 1.2, g = new T.Group(), mat = o.mat || k.stone(Math.max(2, r * 6)); const geo = o.round === false ? new T.BoxGeometry(r * 2, h, r * 2) : new T.CylinderGeometry(r, r * 1.08, h, 20);
    const body = new T.Mesh(geo, mat); body.position.y = h / 2; body.castShadow = body.receiveShadow = true; g.add(body); const n = o.round === false ? 8 : 10;
    for (let i = 0; i < n; i++) { const a = i / n * PI * 2, m = new T.Mesh(new T.BoxGeometry(r * 0.32, h * 0.1, r * 0.32), mat); if (o.round === false) { const s = i % 4, f = (Math.floor(i / 4) ? 0.5 : -0.5); const P = [[f * r, -r], [r, f * r], [-f * r, r], [-r, -f * r]][s]; m.position.set(P[0] * 0.9, h + h * 0.05, P[1] * 0.9); } else m.position.set(Math.cos(a) * r * 0.92, h + h * 0.05, Math.sin(a) * r * 0.92); m.castShadow = true; g.add(m); }
    if (o.roof) { const rf = new T.Mesh(new T.ConeGeometry(r * 1.15, r * 1.6, o.round === false ? 4 : 20), M(o.roof, 0.7)); rf.position.y = h + r * 0.8; if (o.round === false) rf.rotation.y = PI / 4; rf.castShadow = true; g.add(rf); }
    g.position.set(p[0], 0, p[1]); return g; };
  k.town = (o = {}) => { const n = o.n || 300, g = new T.Group(); let s = o.seed || 7; const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const box = new T.BoxGeometry(1, 1, 1); box.translate(0, 0.5, 0); const roof = new T.ConeGeometry(0.75, 0.6, 4); roof.rotateY(PI / 4); roof.translate(0, 0.3, 0);
    const wallsM = new T.InstancedMesh(box, M('#e8d9b8', 0.9), n), roofM = new T.InstancedMesh(roof, M('#b5532e', 0.8), n); wallsM.castShadow = roofM.castShadow = true; wallsM.receiveShadow = true;
    const mtx = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), col = new T.Color(); let c = 0;
    for (let i = 0; i < n * 4 && c < n; i++) { const x = (o.x || 0) + (rnd() - 0.5) * (o.w || 6), z = (o.z || 0) + (rnd() - 0.5) * (o.d || 6); if (o.avoid && o.avoid(x, z)) continue; const sw = 0.12 + rnd() * 0.1, sh = 0.1 + rnd() * 0.12, sd = 0.12 + rnd() * 0.1, ry = rnd() * PI;
      q.setFromEuler(e.set(0, ry, 0)); mtx.compose(new T.Vector3(x, 0, z), q, new T.Vector3(sw, sh, sd)); wallsM.setMatrixAt(c, mtx); col.setHSL(0.1 + rnd() * 0.05, 0.35, 0.72 + rnd() * 0.12); wallsM.setColorAt(c, col);
      mtx.compose(new T.Vector3(x, sh, z), q, new T.Vector3(sw * 1.05, 0.22 + rnd() * 0.1, sd * 1.05)); roofM.setMatrixAt(c, mtx); col.setHSL(0.03 + rnd() * 0.04, 0.55, 0.38 + rnd() * 0.12); roofM.setColorAt(c, col); c++; }
    wallsM.count = roofM.count = c; g.add(wallsM); g.add(roofM); return g; };
  k.army = (n, o = {}) => { const h = o.h || 0.11, g = new T.Group(); const body = new T.CylinderGeometry(h * 0.16, h * 0.2, h * 0.62, 6); body.translate(0, h * 0.31, 0); const head = new T.SphereGeometry(h * 0.13, 8, 6); head.translate(0, h * 0.75, 0);
    const B = new T.InstancedMesh(body, M(o.col || '#7a3a2a', 0.8), n), H = new T.InstancedMesh(head, M(o.head || '#d8b08a', 0.7), n); B.castShadow = H.castShadow = true; B.frustumCulled = H.frustumCulled = false; g.add(B); g.add(H);
    const mtx = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), one = new T.Vector3(1, 1, 1), far = new T.Vector3(0, -99, 0);
    g.put = (i, x, z, ry = 0, bob = 0, y = 0) => { q.setFromEuler(e.set(0, ry, 0)); mtx.compose(new T.Vector3(x, y + Math.abs(Math.sin(bob)) * h * 0.12, z), q, one); B.setMatrixAt(i, mtx); H.setMatrixAt(i, mtx); };
    g.flush = () => { B.instanceMatrix.needsUpdate = true; H.instanceMatrix.needsUpdate = true; };
    g.hideFrom = (m) => { for (let i = m; i < n; i++) { mtx.compose(far, q.identity(), one); B.setMatrixAt(i, mtx); H.setMatrixAt(i, mtx); } g.flush(); }; g.n = n; return g; };
  k.rise = (obj, u) => { u = Math.max(0, Math.min(1, u)); obj.visible = u > 0.001; obj.scale.y = Math.max(0.001, u < 1 ? 1 - Math.pow(1 - u, 3) : 1); return obj; };
  k.water = (w, d, col = '#3d7f99') => { const m = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshStandardMaterial({ color: col, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0.92 })); m.rotation.x = -PI / 2; m.receiveShadow = true; return m; };
  k.hill = (r, h, col = '#7a9a4a') => { const m = new T.Mesh(new T.SphereGeometry(r, 32, 16, 0, PI * 2, 0, PI / 2), M(col, 0.95)); m.scale.y = h / r; m.receiveShadow = m.castShadow = true; return m; };
  // ---------- dark / creepy look (Elites Endgame): R.light { sun, key, color:'#7fa0ff' ... }, R.fog ['#0a1020', 0.06], R.capStyle 'film'
  // k.night(ctx, t, a) blue moonlight grade + grain + vignette; k.paper(ctx, headline, sub, o) an old newspaper insert; k.flicker(t) 0..1 torch/fire flicker; k.redeyes(ctx, x, y, s)
  k.night = (ctx, t, a = 1) => { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(70,95,170,${0.55 * a})`; ctx.fillRect(0, 0, 720, 1280); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.07 * a; for (let i = 0; i < 260; i++) { const x = (i * 97 + Math.floor(t * 24) * 131) % 720, y = (i * 53 + Math.floor(t * 24) * 211) % 1280; ctx.fillStyle = i % 2 ? '#fff' : '#000'; ctx.fillRect(x, y, 2, 2); } ctx.restore(); k.vignette(ctx, 0.75 * a); };
  k.paper = (ctx, head, sub = '', o = {}) => { ctx.save(); ctx.translate(360, o.y || 600); ctx.rotate(o.rot == null ? -0.05 : o.rot); const s = o.s || 1; ctx.scale(s, s); ctx.fillStyle = '#e9e1cc'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; ctx.fillRect(-270, -330, 540, 660); ctx.shadowBlur = 0;
    ctx.fillStyle = '#1a1a1a'; ctx.font = '900 30px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText(o.mast || 'THE DAILY CHRONICLE', 0, -280); ctx.fillRect(-240, -262, 480, 3); ctx.font = '900 46px Georgia, serif';
    const words = head.split(' '); let line = '', y = -200; words.forEach((w) => { const tl = line ? line + ' ' + w : w; if (ctx.measureText(tl).width > 470) { ctx.fillText(line, 0, y); y += 52; line = w; } else line = tl; }); ctx.fillText(line, 0, y); y += 40;
    ctx.font = 'italic 24px Georgia, serif'; ctx.fillStyle = '#3a3a3a'; if (sub) ctx.fillText(sub, 0, y + 6); ctx.fillStyle = '#8a8478'; ctx.fillRect(-240, y + 30, 220, 200); for (let i = 0; i < 9; i++) ctx.fillRect(10, y + 34 + i * 22, 230, 8); for (let i = 0; i < 4; i++) ctx.fillRect(-240, y + 250 + i * 20, 480, 8); ctx.restore(); };
  k.flicker = (t) => 0.75 + 0.15 * Math.sin(t * 17) + 0.1 * Math.sin(t * 41 + 1);
  k.redeyes = (ctx, x, y, sz = 6) => { ctx.save(); ctx.shadowColor = '#ff2020'; ctx.shadowBlur = 18; ctx.fillStyle = '#ff3a3a'; ctx.beginPath(); ctx.arc(x - sz * 2.2, y, sz, 0, 7); ctx.arc(x + sz * 2.2, y, sz, 0, 7); ctx.fill(); ctx.restore(); };
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

  // ---------- ELITE FILES fiction kit (dark props + overlays) ----------
  // k.hood(o) robed hooded figure {col, eyes:true, mask:'gold'|'white'|null, h}; k.candles(n, r, parent) ring of flickering candles (call k.candleTick(g,t));
  // k.cabal(n, o) round table + n hooded figures; k.eyeTri(o) glowing pyramid eye; k.monitors(cols, rows, o) surveillance wall (o.draw(c,w,h,i,t) per screen; call .tick(t));
  // k.vault(o) vault room with gold stacks + round door (g.door); k.limo(o); k.yacht(o); k.heli(o) (g.rotor); k.mansion(o) dark manor with lit windows; k.portrait(o) framed painting with eyes (g.eyes);
  // overlays: k.file(ctx, num, title, lines, u) classified dossier with redaction bars; k.glitch(ctx, t, amt); k.noise(ctx, a); k.flashWord(ctx, word, u) subliminal flash; k.stamp(ctx, word, u, x, y, col);
  // k.fileTag(ctx, num) small 'ELITE FILE #n' tag at top-left; k.rec(ctx, t) REC dot + timestamp.
  k.hood = (o = {}) => { const g = new T.Group(); const C = M(o.col || '#14141a', 0.85); const h = o.h || 1.75;
    const robe = new T.Mesh(new T.CylinderGeometry(0.16 * h, 0.36 * h, 0.82 * h, 18), C); robe.position.y = 0.41 * h; g.add(robe);
    const hood = new T.Mesh(new T.SphereGeometry(0.13 * h, 18, 14, 0, PI * 2, 0, PI * 0.62), C); hood.position.y = 0.88 * h; hood.scale.set(1, 1.25, 1.1); g.add(hood);
    const peak = new T.Mesh(new T.ConeGeometry(0.1 * h, 0.12 * h, 14), C); peak.position.y = 1.0 * h; peak.rotation.x = -0.35; g.add(peak);
    const face = new T.Mesh(new T.CircleGeometry(0.075 * h, 16), new T.MeshBasicMaterial({ color: '#000' })); face.position.set(0, 0.87 * h, 0.115 * h); g.add(face);
    if (o.mask) { const mk = new T.Mesh(new T.SphereGeometry(0.07 * h, 16, 12, 0, PI * 2, 0, PI / 2), M(o.mask === 'gold' ? '#d8a21e' : o.mask, 0.25, o.mask === 'gold' ? 0.9 : 0)); mk.rotation.x = PI / 2; mk.scale.set(1, 1, 0.5); mk.position.set(0, 0.87 * h, 0.12 * h); g.add(mk); }
    if (o.eyes !== false) { const E = new T.MeshBasicMaterial({ color: o.eyeCol || '#ff2a2a' }); [-1, 1].forEach((sx) => { const e = new T.Mesh(new T.SphereGeometry(0.011 * h, 8, 6), E); e.position.set(sx * 0.028 * h, 0.885 * h, 0.13 * h); g.add(e); }); }
    const arm = new T.Mesh(new T.CylinderGeometry(0.05 * h, 0.07 * h, 0.4 * h, 10), C); arm.position.set(0, 0.55 * h, 0.13 * h); arm.rotation.x = PI / 2.4; g.add(arm);
    g.traverse((n) => { if (n.isMesh) n.castShadow = true; }); g.bob = (t, i = 0) => { g.position.y = (g.userData.y0 ?? (g.userData.y0 = g.position.y)) + Math.sin(t * 1.3 + i) * 0.01; hood.rotation.y = Math.sin(t * 0.7 + i) * 0.15; }; return g; };
  k.candles = (n = 8, r = 1.6, parent = null) => { const g = new T.Group(); g.fl = []; for (let i = 0; i < n; i++) { const a = i / n * PI * 2; const c = new T.Mesh(new T.CylinderGeometry(0.04, 0.045, 0.3 + (i % 3) * 0.08, 10), M('#efe6cf', 0.6)); c.position.set(Math.cos(a) * r, 0.15, Math.sin(a) * r); g.add(c);
      const f = new T.Mesh(new T.ConeGeometry(0.025, 0.08, 8), new T.MeshBasicMaterial({ color: '#ffcc66' })); f.position.set(c.position.x, 0.36 + (i % 3) * 0.08, c.position.z); g.add(f); g.fl.push(f); }
    const L = new T.PointLight('#ff9a4a', 1.6, r * 4, 2); L.position.y = 0.8; g.add(L); g.L = L; if (parent) parent.add(g); return g; };
  k.candleTick = (g, t) => { g.L.intensity = 1.6 * k.flicker(t); g.fl.forEach((f, i) => { f.scale.y = 0.8 + 0.4 * Math.abs(Math.sin(t * 9 + i * 1.7)); }); };
  k.cabal = (n = 8, o = {}) => { const g = new T.Group(); const R = o.r || 1.7; const top = new T.Mesh(new T.CylinderGeometry(R * 0.72, R * 0.72, 0.08, 48), M(o.table || '#1a0e0a', 0.35, 0.1)); top.position.y = 0.78; g.add(top);
    const leg = new T.Mesh(new T.CylinderGeometry(0.2, 0.35, 0.78, 16), M('#120a08', 0.5)); leg.position.y = 0.39; g.add(leg); const sym = new T.Mesh(new T.RingGeometry(0.3, 0.36, 3), new T.MeshBasicMaterial({ color: o.sym || '#c8a21e' })); sym.rotation.x = -PI / 2; sym.position.y = 0.83; g.add(sym);
    g.seats = []; for (let i = 0; i < n; i++) { const a = i / n * PI * 2 + PI / 2; const f = k.hood({ col: o.col, mask: i === 0 && o.leader ? 'gold' : null, eyes: o.eyes }); f.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); f.rotation.y = -a - PI / 2; g.add(f); g.seats.push(f); }
    g.candles = k.candles(6, 0.45, g); g.candles.position.y = 0.82; g.candles.scale.setScalar(0.8); return g; };
  k.eyeTri = (o = {}) => { const g = new T.Group(); const s = o.s || 1; const pyr = new T.Mesh(new T.ConeGeometry(1.2 * s, 1.6 * s, 4), M(o.col || '#2a2418', 0.5, 0.3)); pyr.rotation.y = PI / 4; pyr.position.y = 0.8 * s; g.add(pyr);
    const eye = new T.Mesh(new T.SphereGeometry(0.2 * s, 20, 14), new T.MeshStandardMaterial({ color: '#fff4c0', emissive: '#ffcc33', emissiveIntensity: 2 })); eye.scale.z = 0.4; eye.position.set(0, 1.0 * s, 0.62 * s); g.add(eye);
    const pup = new T.Mesh(new T.SphereGeometry(0.08 * s, 14, 10), new T.MeshBasicMaterial({ color: '#000' })); pup.position.set(0, 1.0 * s, 0.7 * s); g.add(pup); const L = new T.PointLight('#ffcc33', 2, 6 * s); L.position.set(0, 1, 1.2 * s); g.add(L); g.pupil = pup; g.eye = eye; g.L = L; return g; };
  k.monitors = (cols = 4, rows = 3, o = {}) => { const g = new T.Group(); g.scr = []; const W = o.w || 0.9, H = W * 0.6;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const i = r * cols + c; const cv = document.createElement('canvas'); cv.width = 160; cv.height = 96; const tx = new T.CanvasTexture(cv);
      const fr = new T.Mesh(new T.BoxGeometry(W + 0.06, H + 0.06, 0.08), M('#0c0c10', 0.5)); const sc = new T.Mesh(new T.PlaneGeometry(W, H), new T.MeshBasicMaterial({ map: tx })); sc.position.z = 0.045; fr.add(sc);
      fr.position.set((c - (cols - 1) / 2) * (W + 0.1), 0.6 + r * (H + 0.1), 0); g.add(fr); g.scr.push({ cv, tx, i }); }
    const glow = new T.PointLight(o.glow || '#7ab8ff', 1.4, 6); glow.position.set(0, 1.2, 1.2); g.add(glow);
    g.tick = (t) => g.scr.forEach((s) => { const c = s.cv.getContext('2d'); (o.draw || k.camFeed)(c, 160, 96, s.i, t); s.tx.needsUpdate = true; }); return g; };
  k.camFeed = (c, w, h, i, t) => { c.fillStyle = ['#18241c', '#1c1c28', '#241818', '#202020'][i % 4]; c.fillRect(0, 0, w, h); c.fillStyle = '#4a5a4a'; c.fillRect(20 + (i * 23) % 60, 40, 40, 56); c.beginPath(); c.arc(40 + (i * 23) % 60, 30, 14, 0, 7); c.fill();
    for (let y = 0; y < h; y += 3) { c.fillStyle = `rgba(255,255,255,${0.03 + 0.03 * Math.random()})`; c.fillRect(0, y, w, 1); } c.fillStyle = '#ff3030'; if (Math.sin(t * 4 + i) > 0) { c.beginPath(); c.arc(w - 12, 10, 4, 0, 7); c.fill(); } c.fillStyle = '#cfe'; c.font = '10px monospace'; c.fillText('CAM ' + String(i + 1).padStart(2, '0'), 6, h - 6); };
  k.vault = (o = {}) => { const g = LIB.place.room({ w: o.w || 6, d: o.d || 6, h: 3, wall: '#2a2c30', floor: 'tiles', window: false }); const G = M('#e8b21e', 0.25, 0.95);
    for (let s = 0; s < (o.stacks || 6); s++) { const sx = -2 + (s % 3) * 2, sz = -2 + Math.floor(s / 3) * 1.4; for (let l = 0; l < 4; l++) for (let b = 0; b < 4 - l; b++) { const bar = new T.Mesh(new T.BoxGeometry(0.34, 0.12, 0.16), G); bar.position.set(sx - 0.5 + b * 0.36 + l * 0.18, 0.06 + l * 0.12, sz); bar.castShadow = true; g.add(bar); } }
    const door = new T.Group(); const d = new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 0.3, 40), M('#8a8e96', 0.3, 0.9)); d.rotation.x = PI / 2; door.add(d); for (let i = 0; i < 6; i++) { const sp = new T.Mesh(new T.BoxGeometry(0.08, 0.9, 0.08), M('#c8ccd2', 0.2, 1)); sp.position.z = 0.2; sp.rotation.z = i * PI / 3; sp.position.x = 0; door.add(sp); }
    door.position.set(0, 1.25, (o.d || 6) / 2 - 0.2); g.add(door); g.door = door; const L = new T.PointLight('#ffd890', 1.4, 8); L.position.set(0, 2.6, 0); g.add(L); return k.place(g); };
  k.limo = (o = {}) => { const g = k.car({ color: o.color || '#0a0a0e', lights: o.lights }); g.scale.set(1, 1, 1.9); return g; };
  k.yacht = (o = {}) => { const g = new T.Group(); const W = M(o.col || '#f2f2f4', 0.3, 0.2), D = M('#1a2230', 0.1, 0.6); const hull = new T.Mesh(new T.CylinderGeometry(1.1, 0.6, 7, 4, 1), W); hull.rotation.set(PI / 2, PI / 4, 0); hull.scale.set(1, 1, 0.6); hull.position.y = 0.6; g.add(hull);
    const d1 = new T.Mesh(new T.BoxGeometry(1.4, 0.6, 3.6), W); d1.position.set(0, 1.4, -0.4); g.add(d1); const w1 = new T.Mesh(new T.BoxGeometry(1.42, 0.3, 3.2), D); w1.position.set(0, 1.45, -0.4); g.add(w1);
    const d2 = new T.Mesh(new T.BoxGeometry(1.1, 0.5, 2), W); d2.position.set(0, 1.95, -0.7); g.add(d2); const w2 = new T.Mesh(new T.BoxGeometry(1.12, 0.22, 1.8), D); w2.position.set(0, 2.0, -0.7); g.add(w2);
    const lw = new T.PointLight('#ffd890', 1, 6); lw.position.set(0, 2, 0); g.add(lw); g.traverse((n) => { if (n.isMesh) n.castShadow = true; }); return g; };
  k.heli = (o = {}) => { const g = new T.Group(); const B = M(o.col || '#121216', 0.3, 0.5); const body = new T.Mesh(new T.SphereGeometry(0.7, 20, 14), B); body.scale.set(1, 0.8, 1.5); body.position.y = 1; g.add(body);
    const tail = new T.Mesh(new T.CylinderGeometry(0.08, 0.15, 2.4, 10), B); tail.rotation.x = PI / 2; tail.position.set(0, 1.1, -1.9); g.add(tail); const gl = new T.Mesh(new T.SphereGeometry(0.5, 16, 12, 0, PI * 2, 0, PI / 2), M('#2a3a50', 0.1, 0.7)); gl.rotation.x = PI / 2 - 0.3; gl.position.set(0, 1.05, 0.7); g.add(gl);
    const rotor = new T.Group(); [0, PI / 2].forEach((a) => { const b = new T.Mesh(new T.BoxGeometry(4.4, 0.03, 0.18), B); b.rotation.y = a; rotor.add(b); }); rotor.position.y = 1.65; g.add(rotor); g.rotor = rotor;
    [-0.5, 0.5].forEach((x) => { const sk = new T.Mesh(new T.BoxGeometry(0.06, 0.06, 1.8), B); sk.position.set(x, 0.3, 0); g.add(sk); }); const bl = new T.PointLight('#ff2020', 1, 3); bl.position.set(0, 0.4, -3); g.add(bl); g.blink = bl; return g; };
  k.mansion = (o = {}) => { const g = new T.Group(); const S = M(o.col || '#2a2a30', 0.85); const main = new T.Mesh(new T.BoxGeometry(9, 5, 4), S); main.position.y = 2.5; g.add(main);
    const roof = new T.Mesh(new T.ConeGeometry(6.6, 2.4, 4), M('#14141a', 0.7)); roof.rotation.y = PI / 4; roof.scale.z = 0.5; roof.position.y = 6.2; g.add(roof);
    [-5.4, 5.4].forEach((x) => { const t = new T.Mesh(new T.CylinderGeometry(1, 1, 7, 16), S); t.position.set(x, 3.5, 0); g.add(t); const c = new T.Mesh(new T.ConeGeometry(1.2, 2.2, 16), M('#14141a', 0.7)); c.position.set(x, 8.1, 0); g.add(c); });
    g.wins = []; const lit = o.lit || [3, 9]; for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { const i = r * 6 + c; const on = lit.includes(i); const w = new T.Mesh(new T.PlaneGeometry(0.7, 1.1), on ? new T.MeshStandardMaterial({ color: '#ffd890', emissive: '#ffb040', emissiveIntensity: 1.2 }) : M('#0a0c12', 0.2, 0.5)); w.position.set(-3.6 + c * 1.45, 1.4 + r * 2.2, 2.01); g.add(w); g.wins.push(w); }
    const door = new T.Mesh(new T.PlaneGeometry(1.2, 2), M('#1a0e08', 0.6)); door.position.set(0, 1, 2.02); g.add(door); g.traverse((n) => { if (n.isMesh) n.castShadow = true; }); return g; };
  k.portrait = (o = {}) => { const g = new T.Group(); const fr = new T.Mesh(new T.BoxGeometry(1.3, 1.7, 0.08), M('#8a6a1e', 0.3, 0.8)); g.add(fr);
    const pic = new T.Mesh(new T.PlaneGeometry(1.1, 1.5), new T.MeshStandardMaterial({ map: k.tex(220, 300, (c, w, h) => { c.fillStyle = o.bg || '#2a1e18'; c.fillRect(0, 0, w, h); c.fillStyle = o.coat || '#141418'; c.beginPath(); c.ellipse(w / 2, h, 90, 120, 0, 0, 7); c.fill(); c.fillStyle = o.skin || '#c8a080'; c.beginPath(); c.ellipse(w / 2, 115, 48, 62, 0, 0, 7); c.fill(); c.fillStyle = o.hair || '#3a2a20'; c.beginPath(); c.ellipse(w / 2, 70, 52, 30, 0, PI, 0); c.fill(); }) }));
    pic.position.z = 0.045; g.add(pic); g.eyes = [-1, 1].map((s) => { const e = new T.Mesh(new T.SphereGeometry(0.035, 10, 8), new T.MeshBasicMaterial({ color: '#000' })); e.position.set(s * 0.09, 0.2, 0.06); g.add(e); return e; }); g.look = (x) => g.eyes.forEach((e, i) => { e.position.x = (i ? 1 : -1) * 0.09 + x * 0.025; }); return g; };
  k.file = (ctx, num, title, lines = [], u = 1, o = {}) => { ctx.save(); ctx.translate(360, o.y || 640); ctx.rotate(o.rot == null ? 0.03 : o.rot); ctx.fillStyle = '#d8c89a'; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 30; ctx.fillRect(-280, -360, 560, 720); ctx.shadowBlur = 0;
    ctx.fillStyle = '#c8b480'; ctx.fillRect(-280, -400, 200, 50); ctx.fillStyle = '#1a1a1a'; ctx.font = '700 22px "Courier New", monospace'; ctx.textAlign = 'left'; ctx.fillText('FILE ' + num, -260, -368); ctx.font = '900 34px "Courier New", monospace'; ctx.fillText(title, -250, -300);
    ctx.font = '700 22px "Courier New", monospace'; lines.forEach((ln, i) => { const y = -240 + i * 46; const show = u * lines.length > i; if (ln.startsWith('#')) { ctx.fillStyle = '#0a0a0a'; ctx.fillRect(-250, y - 20, 380 + (i * 41) % 110, 28); } else if (show) { ctx.fillStyle = '#1a1a1a'; ctx.fillText(ln, -250, y); } });
    ctx.restore(); k.stamp(ctx, o.stamp || 'CLASSIFIED', Math.min(1, u * 1.4), 470, (o.y || 640) + 260, o.stampCol); };
  k.stamp = (ctx, word, u, x = 360, y = 900, col = '#c8101e') => { if (u <= 0) return; ctx.save(); const s = u < 0.25 ? 2.2 - u * 4.8 : 1; ctx.translate(x, y); ctx.rotate(-0.22); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, u * 4) * 0.9; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.font = FONT(900, 56); const w = ctx.measureText(word).width + 40;
    ctx.strokeRect(-w / 2, -42, w, 84); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(word, 0, 2); ctx.restore(); };
  k.glitch = (ctx, t, amt = 1) => { if (amt <= 0) return; const cv = ctx.canvas; ctx.save(); const n = Math.floor(3 + amt * 6); for (let i = 0; i < n; i++) { const y = Math.floor(((Math.sin(t * 31 + i * 7.1) + 1) / 2) * 1240), h = 8 + Math.floor(((i * 13) % 30) * amt), dx = Math.sin(t * 57 + i) * 30 * amt;
      try { ctx.drawImage(cv, 0, y, 720, h, dx, y, 720, h); } catch (e) {} } ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(255,0,60,${0.08 * amt})`; ctx.fillRect(4 * amt, 0, 720, 1280); ctx.fillStyle = `rgba(0,200,255,${0.08 * amt})`; ctx.fillRect(-4 * amt, 0, 720, 1280); ctx.restore(); };
  k.noise = (ctx, a = 0.2) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; for (let i = 0; i < 1400; i++) { ctx.fillStyle = Math.random() < 0.5 ? '#fff' : '#000'; ctx.fillRect(Math.random() * 720, Math.random() * 1280, 3, 3); } ctx.restore(); };
  k.flashWord = (ctx, word, u) => { if (u <= 0 || u >= 1) return; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, 720, 1280); ctx.font = FONT(900, 120); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ff2a2a'; ctx.fillText(word, 360 + (Math.random() - 0.5) * 12, 640); ctx.restore(); };
  k.fileTag = (ctx, num) => { ctx.save(); ctx.font = '700 26px "Courier New", monospace'; ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(24, 34, 330, 42); ctx.fillStyle = '#ff3a3a'; ctx.fillText('● ELITE FILE #' + String(num).padStart(3, '0'), 36, 64); ctx.restore(); };
  k.rec = (ctx, t, label = 'REC') => { ctx.save(); ctx.font = '700 26px "Courier New", monospace'; if (Math.sin(t * 5) > 0) { ctx.fillStyle = '#ff2020'; ctx.beginPath(); ctx.arc(52, 92, 11, 0, 7); ctx.fill(); } ctx.fillStyle = '#fff'; ctx.fillText(label, 72, 101); const s = Math.floor(t * 10) % 600; ctx.fillText(`03:${String(Math.floor(s / 10) % 60).padStart(2, '0')}:${String(s % 10)}0 AM`, 470, 101); ctx.restore(); };

  // ---------- 'THE ROOM' set (Elite Files meta reels): k.roomSet() builds three scenes once and returns helpers:
  //   S.city  hand-scale model city on a billionaire's table (1 unit ~ 12 cm; the rigged hand is 1.6 long). S.you = tiny you with a glowing phone, S.cars, S.crowd (army), S.lamp
  //   S.room  the algorithm room: 9 hooded figures at a desk facing a wall of screens (S.wall; screen 0 shows THIS video via k.grabFrame), S.figs, S.stampL (red light)
  //   S.home  you at night on your phone in a dark bedroom (S.me, S.glow)
  //   S.hand(u, from, to, pose, yaw, pitch) moves the right hand between two points (u 0..1); S.cityTick(t) animates cars + crowd; S.roomTick(t)
  // Overlays: k.grabFrame(ctx) at the end of over() (feeds screen 0 + k.phoneShot); k.phoneShot(ctx, u, o) a phone held up showing this video;
  //   k.tip(ctx, u, title, steps, o) a clean 'SAVE THIS' value card (y 250-780, above the film caption); k.promise(ctx, text) small top banner.
  k.FRAME = (() => { const c = document.createElement('canvas'); c.width = 180; c.height = 320; return c; })();
  k.grabFrame = (ctx) => { try { k.FRAME.getContext('2d').drawImage(ctx.canvas, 0, 0, 180, 320); } catch (e) {} };
  k.feedThumb = (c, w, h, i, t) => { if (i === 0) { c.fillStyle = '#000'; c.fillRect(0, 0, w, h); const fw = h * 9 / 16; c.drawImage(k.FRAME, (w - fw) / 2, 0, fw, h); c.strokeStyle = '#ff2a2a'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4); return; }
    const hue = (i * 47) % 360; c.fillStyle = `hsl(${hue},35%,22%)`; c.fillRect(0, 0, w, h); c.fillStyle = `hsl(${hue},45%,45%)`; c.beginPath(); c.arc(w / 2, h * 0.42, h * 0.2, 0, 7); c.fill(); c.fillRect(w / 2 - h * 0.18, h * 0.6, h * 0.36, h * 0.4);
    c.fillStyle = '#fff'; c.font = 'bold 13px sans-serif'; c.fillText('♥ ' + ((i * 7919) % 900 + 1) + (i % 3 ? 'K' : ''), 6, h - 8); c.fillStyle = i % 4 === 1 ? '#ff3a3a' : '#7aff9a'; c.fillRect(w - 16, 6, 10, 10); };
  k.roomSet = (o = {}) => { const S = {}; const tb = new T.Group(); S.city = tb;
    const wood = M('#ffffff', 0.55, 0, { map: (() => { const t = k.tex(256, 256, (c, w, h) => { c.fillStyle = '#3a2214'; c.fillRect(0, 0, w, h); for (let i = 0; i < 70; i++) { c.fillStyle = i % 2 ? 'rgba(20,10,4,0.35)' : 'rgba(90,50,24,0.25)'; c.fillRect(0, (i * 37) % h, w, 1 + (i % 3)); } }); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(4, 4); return t; })() });
    const top = new T.Mesh(new T.BoxGeometry(30, 0.6, 22), wood); top.position.y = -0.3; top.receiveShadow = true; tb.add(top); const base = new T.Mesh(new T.PlaneGeometry(26, 18), M('#040506', 1)); base.rotation.x = -PI / 2; base.position.y = 0.01; base.receiveShadow = true; tb.add(base);
    const winT = k.tex(64, 128, (c, w, h) => { c.fillStyle = '#1a1e26'; c.fillRect(0, 0, w, h); for (let y = 6; y < h; y += 12) for (let x = 6; x < w; x += 14) { c.fillStyle = ((x * 7 + y * 3) % 5 === 0) ? '#ffd27a' : '#2a303a'; c.fillRect(x, y, 8, 7); } }); winT.wrapS = winT.wrapT = T.RepeatWrapping;
    const bm = new T.MeshStandardMaterial({ map: winT, emissive: '#ffffff', emissiveMap: winT, emissiveIntensity: 0.55, roughness: 0.6 }); const box = new T.BoxGeometry(1, 1, 1); box.translate(0, 0.5, 0); const N = 120; const city = new T.InstancedMesh(box, bm, N); city.castShadow = city.receiveShadow = true;
    const mx = new T.Matrix4(); let c = 0, sd = 3; const rnd = () => ((sd = (sd * 16807) % 2147483647) / 2147483647);
    for (let gx = -5; gx <= 5; gx++) for (let gz = -4; gz <= 4; gz++) { if (gx === 0 || gz === 0 || c >= N || (Math.abs(gx) < 2 && Math.abs(gz) < 2) || (gx >= 0 && gx <= 2 && gz >= 1)) continue; const h = 0.6 + rnd() * (4 - Math.hypot(gx, gz) * 0.3); mx.compose(new T.Vector3(gx * 2.1, 0, gz * 1.9), new T.Quaternion(), new T.Vector3(1.4, Math.max(0.5, h), 1.3)); city.setMatrixAt(c++, mx); }
    city.count = c; tb.add(city); S.blocks = city;
    const road = M('#020203', 1); [[0, 0, 26, 1.2], [0, 0, 1.2, 18]].forEach(([x, z, w, d]) => { const r = new T.Mesh(new T.PlaneGeometry(w, d), road); r.rotation.x = -PI / 2; r.position.set(x, 0.02, z); tb.add(r); });
    const plaza = new T.Mesh(new T.CircleGeometry(1.6, 32), M('#0c0d10', 1)); plaza.rotation.x = -PI / 2; plaza.position.set(2.1, 0.025, 1.9); tb.add(plaza);
    S.crowd = k.army(70, { col: '#1a2030', head: '#6a5040', h: 0.32 }); tb.add(S.crowd); for (let i = 0; i < 70; i++) S.crowd.put(i, -12 + (i * 0.37) % 24, (i % 2 ? 0.35 : -0.35) + (i % 7 === 0 ? 0 : 0), i, 0); S.crowd.flush();
    S.cars = []; for (let i = 0; i < 10; i++) { const cr = new T.Group(); const b = new T.Mesh(new T.BoxGeometry(0.22, 0.14, 0.45), M(['#c8101e', '#e8e8e8', '#1a4a8a', '#c8a21e'][i % 4], 0.4, 0.4)); b.position.y = 0.08; cr.add(b); const l = new T.Mesh(new T.PlaneGeometry(0.18, 0.04), new T.MeshBasicMaterial({ color: '#fff6c0' })); l.position.set(0, 0.09, 0.23); cr.add(l); cr.userData.i = i; tb.add(cr); S.cars.push(cr); }
    S.you = k.LIB.human({ body: 'elite:man_hoodie', h: 0.45, colors: o.youColors }); S.you.position.set(2.1, 0.03, 2.4); S.you.rotation.y = 0.4; tb.add(S.you); const ph = new T.Mesh(new T.PlaneGeometry(0.05, 0.08), new T.MeshBasicMaterial({ color: '#bfe4ff' })); ph.position.set(0, 0.3, 0.07); ph.rotation.x = -0.6; S.you.add(ph); const pl = new T.PointLight('#9ad0ff', 0.6, 1.2); pl.position.set(0, 0.32, 0.12); S.you.add(pl);
    S.lamp = new T.SpotLight('#ffe6b0', 7, 40, 0.4, 0.7, 1.5); S.lamp.position.set(2, 18, 6); S.lamp.target.position.set(1, 0, 1); S.lamp.castShadow = true; tb.add(S.lamp); tb.add(S.lamp.target);
    k.place(tb);
    S.cityTick = (t) => { S.cars.forEach((cr) => { const i = cr.userData.i, u = ((t * 0.08 + i * 0.13) % 1); if (i % 2) { cr.position.set(-12 + u * 24, 0, i % 4 === 1 ? 0.3 : -0.3); cr.rotation.y = PI / 2; } else { cr.position.set(i % 4 === 0 ? 0.3 : -0.3, 0, -8.5 + u * 17); cr.rotation.y = 0; } }); };
    const fwd = new T.Vector3(); S.hand = (u, from, to, pose = 'pinch', yaw = PI, pitch = 0.9) => { const e = u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); k.grab(k.RH, [from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e, from[2] + (to[2] - from[2]) * e], yaw, pitch, pose); return k.RH; };
    // the algorithm room (human scale)
    const rm = k.LIB.place.room({ w: 9, d: 8, h: 4, wall: '#0e1016', floor: 'tiles', window: false }); S.room = rm; k.place(rm);
    S.wall = k.monitors(6, 4, { w: 1.15, draw: k.feedThumb, glow: '#8ab0ff' }); S.wall.position.set(0, 0.3, -3.6); rm.add(S.wall);
    const desk = new T.Mesh(new T.BoxGeometry(7.4, 0.8, 0.8), M('#14161c', 0.4, 0.3)); desk.position.set(0, 0.4, -0.6); rm.add(desk);
    S.figs = []; for (let i = 0; i < 9; i++) { const f = k.hood({ col: i === 4 ? '#3a0a10' : '#14141a', mask: i === 4 ? 'gold' : null }); f.position.set(-3.2 + i * 0.8, 0, 0.1); f.rotation.y = PI; rm.add(f); S.figs.push(f); }
    S.stampL = new T.PointLight('#ff2020', 0, 10); S.stampL.position.set(0, 3, 1); rm.add(S.stampL);
    S.roomTick = (t) => { S.wall.tick(t); S.figs.forEach((f, i) => f.bob(t, i)); };
    // home: you on your phone at night
    const hm = k.LIB.place.room({ w: 4, d: 4, h: 2.8, wall: '#1a1e2a', floor: 'wood', window: true }); S.home = hm; k.place(hm);
    const bed = new T.Mesh(new T.BoxGeometry(1.6, 0.45, 2.1), M('#2a3048', 0.9)); bed.position.set(0.7, 0.22, -0.6); hm.add(bed); const pil = new T.Mesh(new T.BoxGeometry(1.2, 0.15, 0.4), M('#c8ccd8', 0.9)); pil.position.set(0.7, 0.52, -1.45); hm.add(pil);
    S.me = k.add(k.LIB.human({ body: 'elite:man_hoodie', colors: o.youColors }), [-0.5, 0, 0.3], 0.3, hm); const ph2 = new T.Mesh(new T.BoxGeometry(0.08, 0.15, 0.01), new T.MeshBasicMaterial({ color: '#cfe8ff' })); ph2.position.set(0, 1.2, 0.3); ph2.rotation.x = -0.5; S.me.add(ph2);
    S.glow = new T.PointLight('#8ac4ff', 1.4, 3); S.glow.position.set(0, 1.35, 0.5); S.me.add(S.glow);
    return S; };
  k.phoneShot = (ctx, u, o = {}) => { if (u <= 0) return; ctx.save(); const e = Math.min(1, u * 2.5); const W = 300, H = 600; ctx.translate(o.x || 360, (o.y || 560) + (1 - e) * 700); ctx.rotate(o.rot == null ? -0.06 : o.rot);
    ctx.fillStyle = '#0a0a0c'; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.roundRect(-W / 2 - 14, -H / 2 - 14, W + 28, H + 28, 40); ctx.fill(); ctx.shadowBlur = 0; ctx.drawImage(k.FRAME, -W / 2, -H / 2, W, H);
    if (o.label) { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(-W / 2, H / 2 - 70, W, 70); ctx.fillStyle = '#fff'; ctx.font = FONT(900, 26); ctx.textAlign = 'center'; ctx.fillText(o.label, 0, H / 2 - 26); } ctx.restore(); };
  k.tip = (ctx, u, title, steps = [], o = {}) => { if (u <= 0) return; ctx.save(); const e = Math.min(1, u * 3); ctx.globalAlpha = e; ctx.translate(0, (1 - e) * 40); const y0 = o.y || 250, H = 120 + steps.length * 92;
    ctx.fillStyle = 'rgba(250,250,252,0.97)'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.roundRect(50, y0, 620, H, 28); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#c8101e'; ctx.beginPath(); ctx.roundRect(70, y0 - 24, 220, 48, 24); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = FONT(900, 24); ctx.textAlign = 'center'; ctx.fillText(o.badge || '💾 SAVE THIS', 180, y0 + 9);
    ctx.textAlign = 'left'; ctx.fillStyle = '#111'; ctx.font = FONT(900, 36); ctx.fillText(title, 80, y0 + 74);
    steps.forEach((s, i) => { const y = y0 + 132 + i * 92; const show = Math.min(1, Math.max(0, u * (steps.length + 1) - i - 0.3) * 3); ctx.globalAlpha = e * show; ctx.fillStyle = '#c8101e'; ctx.beginPath(); ctx.arc(102, y - 10, 22, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = FONT(900, 26); ctx.textAlign = 'center'; ctx.fillText(String(i + 1), 102, y - 1); ctx.textAlign = 'left'; ctx.fillStyle = '#222'; ctx.font = FONT(800, 27);
      const words = s.split(' '); let line = '', ly = y - 2; words.forEach((w) => { if (ctx.measureText(line + w).width > 500) { ctx.fillText(line, 140, ly); line = ''; ly += 32; } line += w + ' '; }); ctx.fillText(line, 140, ly); }); ctx.restore(); };
  k.promise = (ctx, text = '🔒 THE WAY OUT IS AT THE END') => { ctx.save(); ctx.font = FONT(900, 26); const w = ctx.measureText(text).width + 40; ctx.fillStyle = 'rgba(200,16,30,0.92)'; ctx.beginPath(); ctx.roundRect(360 - w / 2, 96, w, 46, 23); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(text, 360, 128); ctx.restore(); };

  // k.roomScene(S, name, t, kk, o) shows one of the set's scenes and returns its camera: 'wall' (this video on the screen wall), 'room' (behind the hoods),
  //   'leader' (gold mask, front), 'cityWide', 'cityYou' (tiny you on the model city), 'cityHand' (giant hand lifts you; o.drop to put you back), 'home' (you in bed on your phone), 'tip' (home, dimmed).
  // k.hookText(ctx, text, o) the scroll-stopper: huge 2-3 line hook at the top of frame one (words in *stars* go red).
  k.FEEDME = 8;
  const _fT = k.feedThumb; k.feedThumb = (c, w, h, i, t) => _fT(c, w, h, i === k.FEEDME ? 0 : (i === 0 ? 31 : i), t);
  k.roomScene = (S, name, t, kk, o = {}) => { const you = S.you; if (!you.userData.home) you.userData.home = [you.position.x, you.position.y, you.position.z];
    const H = you.userData.home; you.position.set(H[0], H[1], H[2]); you.rotation.set(0, 0.4, 0);
    if (name === 'wall' || name === 'room' || name === 'leader') { k.only(S.room); S.roomTick(t); S.stampL.intensity = o.red ? 3 * k.flicker(t) : 0;
      if (name === 'wall') return k.cam([0.2, 1.75, -0.2 - kk * 0.6], [0, 1.25, -3.6], 40, { blur: 2 });
      if (name === 'room') return k.cam([2.4 - kk * 0.8, 2.3, 3.6], [0, 1.5, -3.4], 44, { blur: 2 });
      return k.cam([0.35, 1.55, -1.7 + kk * 0.2], [0, 1.45, 0.1], 40, { blur: 3 }); }
    if (name.startsWith('city')) { k.only(S.city); S.cityTick(t); you.pose && you.pose(o.move || 'idle', t);
      if (name === 'cityWide') return k.cam([9 - kk * 3, 13 - kk * 2, 15 - kk * 3], [0.5, 0, 0.5], 40, { blur: 2 });
      if (name === 'cityYou') return k.cam([2.3 - kk * 0.2, 0.5, 3.7 - kk * 0.4], [2.1, 0.3, 2.4], 44, { blur: 4, tight: true });
      const top = [H[0], H[1] + 0.42, H[2]]; const up = o.drop ? 1 - kk : kk; const lift = Math.max(0, (up - 0.35) / 0.65);
      const hp = up < 0.35 ? S.hand(up / 0.35, [top[0], 4, top[2] - 1.5], top, 'pinch', 0, 0.9) : S.hand(lift, top, [H[0] + 0.3, 3.0, H[2] - 0.8], 'pinch', 0, 0.9);
      if (up >= 0.35) { { const e = lift * lift * (3 - 2 * lift); you.position.set(H[0] + 0.3 * e, H[1] + 2.58 * e, H[2] - 0.8 * e); } you.rotation.z = Math.sin(t * 3) * 0.15 * lift; }
      return k.cam([2.4, 1.4, 4.6], [2.2, 1.2, 2.3], 44, { blur: 2 }); }
    k.only(S.home); S.me.pose('idle', t); S.glow.intensity = 1.4 * (0.9 + 0.1 * Math.sin(t * 7));
    if (name === 'tip') return k.cam([0.6, 1.6, 2.6], [-0.3, 1.2, 0], 50, { blur: 6 });
    return k.cam([0.9 - kk * 0.2, 1.55, 1.9 - kk * 0.3], [-0.45, 1.4, 0.3], 40, { blur: 3 }); };
  k.hookText = (ctx, text, o = {}) => { ctx.save(); const lines = text.split('\n'); let sz = o.size || 64; ctx.font = FONT(900, sz); const widest = Math.max(...lines.map((l) => ctx.measureText(l.replace(/\*/g, '')).width)); if (widest > 650) { sz = Math.floor(sz * 650 / widest); ctx.font = FONT(900, sz); } ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    lines.forEach((ln, i) => { const y = (o.y || 250) + i * sz * 1.15; const parts = ln.split('*'); let total = 0; parts.forEach((p) => { total += ctx.measureText(p).width; }); let x = 360 - total / 2;
      parts.forEach((p, j) => { const w = ctx.measureText(p).width; ctx.textAlign = 'left'; ctx.lineWidth = 14; ctx.strokeStyle = '#000'; ctx.strokeText(p, x, y); ctx.fillStyle = j % 2 ? '#ff3030' : '#ffffff'; ctx.fillText(p, x, y); x += w; }); }); ctx.restore(); };
  const R = build(k); return Object.assign({ table: false }, R);
}, opt);
