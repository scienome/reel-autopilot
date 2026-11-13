// re-render: character flicker fix (13 Nov 2026)
// 167 cinestory3d (story3d.js): golf ball dimples halve drag (NASA Glenn; USGA; Bearman & Harvey 1976). Scroll stopper: two balls hit side by side, the smooth one drops short.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const pk = k.LIB.place.park({ trees: 6 }); k.place(pk);
  const dimple = k.tex(256, 128, (c, w, h) => { c.fillStyle = '#f4f4f0'; c.fillRect(0, 0, w, h); for (let y = 6; y < h; y += 12) for (let x = (y / 12) % 2 ? 6 : 12; x < w; x += 12) { const g = c.createRadialGradient(x, y, 0, x, y, 5); g.addColorStop(0, '#cfcfca'); g.addColorStop(1, '#f4f4f0'); c.fillStyle = g; c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); } });
  const mk = (dim) => new T.Mesh(new T.SphereGeometry(0.15, 40, 28), M('#ffffff', dim ? 0.6 : 0.15, 0, dim ? { map: dimple, bumpMap: dimple, bumpScale: 0.05 } : {}));
  const smooth = mk(false), dimp = mk(true); pk.add(smooth, dimp); const trail = (b, c) => { const m = new T.Mesh(new T.SphereGeometry(0.15, 10, 8), new T.MeshBasicMaterial({ color: c, toneMapped: false })); return m; };
  const golfer = k.add(k.LIB.human({ body: 'm', top: '#f2f2f2', bottom: '#2a3a5a', hair: '#3b2414' }), [-1.2, 0, 0], PI / 2, pk);
  const fly = (b, u, range, lane) => { const x = u * range, y = Math.sin(Math.min(1, u) * PI) * range * 0.18; b.position.set(x, 0.15 + Math.max(0, y), lane); b.rotation.z = -u * 30; };
  let ov = null; const flow = (ctx, t, dim) => { ctx.save(); ctx.fillStyle = 'rgba(8,16,32,0.88)'; ctx.fillRect(40, 300, 640, 640); ctx.fillStyle = '#f4f4f0'; ctx.beginPath(); ctx.arc(300, 620, 90, 0, 7); ctx.fill();
    if (dim) { ctx.fillStyle = '#cfcfca'; for (let i = 0; i < 26; i++) { const a = i / 26 * PI * 2; ctx.beginPath(); ctx.arc(300 + Math.cos(a) * 78, 620 + Math.sin(a) * 78, 8, 0, 7); ctx.fill(); } }
    ctx.strokeStyle = '#7fd0ff'; ctx.lineWidth = 4; for (let i = -4; i <= 4; i++) { const y0 = 620 + i * 40; ctx.beginPath(); ctx.moveTo(60, y0); const sep = dim ? 1.9 : 1.2; for (let x = 60; x < 660; x += 6) { const dx = x - 300, dy = y0 - 620; const r = Math.hypot(dx, dy); let y = y0; if (Math.abs(i) <= 3 && dx > -120) { const a = Math.atan2(dy, dx); if (dx < 90 * Math.cos(Math.PI / sep)) y = 620 + Math.sign(dy || 1) * Math.max(Math.abs(dy), 100 * Math.abs(Math.sin(Math.min(PI / sep, Math.acos(Math.max(-1, Math.min(1, -dx / 100))))))); } ctx.lineTo(x, y); } ctx.stroke(); }
    const wake = dim ? 70 : 170; ctx.fillStyle = 'rgba(255,90,60,0.35)'; for (let i = 0; i < 12; i++) { const u = (t * 0.8 + i / 12) % 1; ctx.beginPath(); ctx.arc(400 + u * 260, 620 + Math.sin(i * 3 + t * 4) * wake * 0.6, 18 + u * 20, 0, 7); ctx.fill(); }
    ctx.font = '900 30px Nunito, Arial'; ctx.fillStyle = '#ffd23f'; ctx.textAlign = 'center'; ctx.fillText(dim ? 'SMALL WAKE = LESS DRAG' : 'BIG WAKE = DRAG', 360, 900); ctx.restore(); };
  const base = () => { k.only(pk); golfer.visible = true; smooth.visible = dimp.visible = true; };
  const race = (t, kk) => { smooth.scale.setScalar(5); dimp.scale.setScalar(5); fly(smooth, Math.min(1, kk * 1.4), 22, 2); fly(dimp, Math.min(1, kk * 1.4), 44, -2); golfer.pose('idle', t); };
  const unscale = () => { smooth.scale.setScalar(1); dimp.scale.setScalar(1); };
  const shots = {
    hook: (t, kk) => { base(); race(t, kk); ov = (ctx) => { k.card(ctx, 'SMOOTH', { y: 190, bg: '#e8384f' }); k.card(ctx, 'DIMPLED', { y: 300, bg: '#2ecc71' }); }; return k.cam([10, 3, 18], [20, 1, 0], 44, { sky: pk.sky }); },
    old: (t, kk) => { base(); unscale(); dimp.visible = false; smooth.position.set(0.3, 0.15, 0.4); golfer.pose('idle', t); ov = (ctx) => { k.tint(ctx, '#c8a878', 0.25); k.card(ctx, '1850s', { y: 200, bg: '#5a3a22' }); }; return k.close(smooth, { d: 1.0, h: 0.5, look: 0.5, extra: { sky: pk.sky } }); },
    beat: (t, kk) => { base(); unscale(); smooth.visible = false; dimp.position.set(0, 0.25, 0); dimp.rotation.y = t; golfer.visible = false; ov = (ctx) => { k.tint(ctx, '#c8a878', 0.2); k.card(ctx, 'DENTED = FURTHER?', { y: 200, bg: '#7a3ad8' }); }; return k.cam([0.6, 0.45, 0.8], [0, 0.25, 0], 36, { sky: pk.sky, focus: [0.3, 0.75], blur: 9 }); },
    inside: (t, kk) => { base(); unscale(); golfer.visible = false; ov = (ctx) => flow(ctx, t, false); return k.cam([0, 1, 4], [0, 0.5, 0], 40, { sky: pk.sky }); },
    dimples: (t, kk) => { base(); unscale(); golfer.visible = false; ov = (ctx) => flow(ctx, t, true); return k.cam([0, 1, 4], [0, 0.5, 0], 40, { sky: pk.sky }); },
    far: (t, kk) => { base(); race(t, 0.72); ov = (ctx) => k.counter(ctx, 'DIMPLED BALL', '~2× FURTHER', { y: 190 }); return k.cam([20, 6, 22], [22, 0, 0], 48, { sky: pk.sky }); },
    count: (t, kk) => { base(); unscale(); smooth.visible = false; golfer.visible = false; dimp.position.set(0, 0.25, 0); dimp.rotation.y = t * 0.6; ov = (ctx) => k.counter(ctx, 'DIMPLES', String(Math.round(300 + kk * 200)), { y: 190 }); return k.cam([0.5, 0.4, 0.7], [0, 0.25, 0], 34, { sky: pk.sky, focus: [0.3, 0.75], blur: 9 }); },
    outro: (t, kk) => { base(); race(t, kk); ov = (ctx) => k.big(ctx, "IT'S THE DIMPLES.", { y: 240, size: 64, col: '#ffd23f' }); return k.cam([10, 3, 18], [20, 1, 0], 44, { sky: pk.sky }); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: pk.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('click', at('hook', 0.1), { gain: 0.6 }); kit.play('click', at('outro', 0.1), { gain: 0.6 }); } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/Superhero_Male', 'humans/ual1', 'nature/tree_oak', 'nature/tree_maple', 'nature/tree_birch', 'nature/rock_mossy', 'props/bench'] });
