/* Scroll-stopper kit: load after wedding.js. Keeps people watching to the end.
   D.fx.beats(view, t, times)   zoom punch on every beat (pass each line's t0), returns the view.
   D.fx.shake(view, t, amp)     handheld panic shake, returns the view.
   D.fx.flash(ctx, t, times, color)  a two-frame flash on every beat.
   D.fx.danger(ctx, level, t)   red pulsing edges and rising smoke, level 0 to 1.
   D.fx.survival(ctx, pct)      the YOUR SURVIVAL meter.
   D.fx.stay(ctx, txt)          the pinned line that promises what the end reveals.
   D.fx.choice(ctx, t, t0, t1, a, b)  giant Door A / Door B card with a 5-second ring.
   D.fx.ghost(fig, opacity)     turns a figure into a see-through ghost.
   Hallway set at x = 1500: D.fx.hall, doors A (red) and B (blue) at the far end, z = -9. D.fx.lights(k) dims it.
   Figures there: D.fx.you, D.fx.doris, D.fx.collectors (3), D.fx.ghosts (3). */
(() => {
  const T = D.THREE, { mat, add, box, tex } = D.kit, F = D.FONT;
  const H = new T.Group();
  H.position.set(1500, 0, 0);
  D.scene.add(H);
  const paper = tex(256, 256, (x, w, h) => { x.fillStyle = '#7a2a3a'; x.fillRect(0, 0, w, h); x.fillStyle = '#6a2030'; for (let i = 0; i < 6; i++) x.fillRect(i * w / 6, 0, w / 12, h); }, [10, 1]);
  const carpet = tex(128, 128, (x, w, h) => { x.fillStyle = '#123a4a'; x.fillRect(0, 0, w, h); x.fillStyle = '#c9a23a'; x.fillRect(w / 2 - 6, h / 2 - 6, 12, 12); }, [4, 14]);
  box(H, 6, 0.08, 34, mat('#fff', { map: carpet, r: 0.9 }), 0, 0, 6);
  [-3, 3].forEach((x) => box(H, 0.12, 4, 34, mat('#fff', { map: paper, r: 0.8 }), x, 2, 6));
  box(H, 6, 0.1, 34, '#1a1420', 0, 4, 6);
  box(H, 6, 4, 0.12, '#2a1a2a', 0, 2, -9.2);
  const lamps = [];
  for (let z = -7; z <= 20; z += 6) {
    const m = add(H, new T.BoxGeometry(1.4, 0.06, 0.5), mat('#fff', { e: '#ffd98a', ei: 1.2 }), 0, 3.94, z, { cast: false });
    const l = new T.PointLight('#ffc98a', 0.9, 9, 1.8); l.position.set(0, 3.5, z); H.add(l); lamps.push({ m, l });
  }
  const label = (s, c) => tex(128, 128, (x, w, h) => { x.fillStyle = c; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = '84px "Lilita One", Arial'; x.textAlign = 'center'; x.fillText(s, w / 2, 96); });
  const door = (x, z, c, s, side) => {
    const g = new T.Group(); g.position.set(x, 0, z); if (side) g.rotation.y = side * Math.PI / 2; H.add(g);
    box(g, 1.7, 3.1, 0.14, c, 0, 1.56, 0, { r: 0.5 });
    add(g, new T.PlaneGeometry(0.7, 0.7), new T.MeshBasicMaterial({ map: label(s, c) }), 0, 2.3, 0.08, { cast: false });
    add(g, new T.SphereGeometry(0.08, 8, 6), mat('#ffc61a', { m: 0.8, r: 0.2 }), 0.6, 1.4, 0.1);
    return g;
  };
  door(-1.5, -9.05, '#d6102a', 'A');
  door(1.5, -9.05, '#1456d6', 'B');
  [[-2.92, -4, '9A', 1], [2.92, -4, '9B', -1], [-2.92, 3, '9C', 1], [2.92, 3, '9D', -1], [-2.92, 10, '6C', 1], [2.92, 10, '9F', -1]].forEach(([x, z, s, d]) => door(x, z, '#5b3420', s, d));
  const you = D.figure({ shirt: '#128a52', pants: '#26365f', hair: 'beanie', hairColor: '#e0218a', mood: 'nervous', shoes: '#f1f1f1', phone: true });
  const doris = D.figure({ shirt: '#7d4fc0', pants: '#6b5b8c', hair: 'bun', hairColor: '#c9c9cf', glasses: true, mood: 'shock', skin: '#f0c7a6', shoes: '#7a3b4a' });
  H.add(you, doris);
  doris.visible = false;
  const collectors = [-1.4, 0, 1.4].map((x, i) => {
    const g = D.figure({ shirt: '#12121a', pants: '#12121a', hair: 'short', hairColor: '#12121a', mood: 'glare', skin: '#d6102a', shoes: '#000' });
    g.position.set(x, 0.06, -6 + Math.abs(i - 1)); H.add(g); g.visible = false; return g;
  });
  const ghosts = [-1.6, 0.4, 1.8].map((x) => {
    const g = D.figure({ shirt: '#bfefff', pants: '#bfefff', hair: 'short', hairColor: '#bfefff', mood: 'neutral', skin: '#dff6ff', shoes: '#bfefff' });
    g.position.set(x, 0.06, 8); H.add(g); g.visible = false; return g;
  });
  const ghost = (f, o) => f.traverse((m) => { if (m.isMesh) { const c = m.material.clone(); c.transparent = true; c.opacity = o; c.emissive = new T.Color('#7fe7ff'); c.emissiveIntensity = 0.5; c.depthWrite = false; m.material = c; m.castShadow = false; } });
  ghosts.forEach((g) => ghost(g, 0.5));
  const setGhost = (f, o) => f.traverse((m) => { if (m.isMesh) m.material.opacity = o; });
  const lights = (k) => lamps.forEach(({ m, l }) => { l.intensity = 0.9 * k; m.material.emissiveIntensity = 1.2 * k; });
  const beats = (v, t, times) => { const hit = times.filter((b) => t >= b && t < b + 0.22).pop(); if (hit == null) return v; const k = 1 - (t - hit) / 0.22; return { ...v, fov: (v.fov || 32) * (1 - 0.1 * k) }; };
  const shake = (v, t, a) => ({ ...v, pos: [v.pos[0] + Math.sin(t * 37) * a, v.pos[1] + Math.sin(t * 53) * a * 0.7, v.pos[2]], look: [v.look[0] + Math.sin(t * 29) * a * 0.6, v.look[1] + Math.sin(t * 41) * a * 0.6, v.look[2]] });
  const flash = (ctx, t, times, c = '#fff') => { const hit = times.filter((b) => t >= b && t < b + 0.09).pop(); if (hit == null) return; ctx.save(); ctx.globalAlpha = 0.55 * (1 - (t - hit) / 0.09); ctx.fillStyle = c; ctx.fillRect(0, 0, D.W, D.H); ctx.restore(); };
  const puffs = [];
  for (let i = 0; i < 16; i++) puffs.push({ x: Math.random() * 720, r: 90 + Math.random() * 130, v: 30 + Math.random() * 40, o: Math.random() * 1280 });
  function danger(ctx, lv, t) {
    if (lv <= 0) return;
    ctx.save();
    const p = 0.55 + Math.sin(t * 8) * 0.2, g = ctx.createRadialGradient(360, 640, 330, 360, 640, 820);
    g.addColorStop(0, 'rgba(214,16,42,0)'); g.addColorStop(1, `rgba(214,16,42,${lv * p})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 720, 1280);
    puffs.forEach((q) => { const y = 1400 - ((q.o + t * q.v) % 1500); const b = ctx.createRadialGradient(q.x, y, 10, q.x, y, q.r); b.addColorStop(0, `rgba(40,30,40,${0.4 * lv})`); b.addColorStop(1, 'rgba(40,30,40,0)'); ctx.fillStyle = b; ctx.fillRect(q.x - q.r, y - q.r, q.r * 2, q.r * 2); });
    ctx.restore();
  }
  const rr = (x, X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
  function survival(ctx, pct) {
    const x = 400, y = 1090, w = 290, h = 74, c = pct > 40 ? '#ffc61a' : '#ff2740';
    ctx.save(); ctx.fillStyle = 'rgba(14,12,26,.92)'; rr(ctx, x, y, w, h, 16); ctx.fill();
    ctx.font = `20px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText('YOUR SURVIVAL', x + 16, y + 22);
    ctx.textAlign = 'right'; ctx.fillStyle = c; ctx.font = `30px ${F}`; ctx.fillText(Math.round(pct) + '%', x + w - 16, y + 22);
    ctx.fillStyle = 'rgba(255,255,255,.18)'; rr(ctx, x + 16, y + 44, w - 32, 14, 7); ctx.fill();
    ctx.fillStyle = c; rr(ctx, x + 16, y + 44, Math.max(14, (w - 32) * pct / 100), 14, 7); ctx.fill();
    ctx.restore();
  }
  function stay(ctx, txt) {
    ctx.save(); ctx.font = `26px ${F}`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    const w = ctx.measureText(txt).width + 34, x = 360 - w / 2;
    ctx.fillStyle = '#ffd23f'; rr(ctx, x, 1188, w, 46, 10); ctx.fill();
    ctx.fillStyle = D.INK; ctx.fillText(txt, 360, 1212); ctx.restore();
  }
  function choice(ctx, t, t0, t1, a, b) {
    if (t < t0 || t > t1) return;
    const k = D.clamp((t - t0) / 0.25, 0, 1), left = Math.max(0, Math.ceil(5 - (t - t0)));
    ctx.save(); ctx.fillStyle = `rgba(6,4,10,${0.72 * k})`; ctx.fillRect(0, 0, 720, 1280);
    ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    [[a, 'A', '#d6102a', 300], [b, 'B', '#1456d6', 560]].forEach(([s, L, c, y]) => {
      ctx.fillStyle = c; rr(ctx, 60, y, 600, 210, 22); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = `110px ${F}`; ctx.fillText(L, 140, y + 110);
      ctx.font = `38px ${F}`; ctx.textAlign = 'left'; s.split('|').forEach((q, i) => ctx.fillText(q, 220, y + 78 + i * 54)); ctx.textAlign = 'center';
    });
    ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(360, 900, 74, 0, 7); ctx.stroke();
    ctx.strokeStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(360, 900, 74, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, 1 - (t - t0) / 5)); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = `90px ${F}`; ctx.fillText(left, 360, 906);
    ctx.font = `44px ${F}`; ctx.fillStyle = '#ffd23f'; ctx.fillText('PICK NOW', 360, 200);
    ctx.restore();
  }
  D.fx = { hall: H, you, doris, collectors, ghosts, ghost, setGhost, lights, beats, shake, flash, danger, survival, stay, choice };
})();
