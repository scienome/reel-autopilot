// 159 cinestory3d (story3d.js): wolf OR-7 (ODFW/USFWS). Scroll stopper: a lone wolf on a ridge under the moon, GPS dots trailing behind.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fr = k.forest({ trees: 24 }); const sn = k.snow({ trees: 8 });
  const w = k.add(k.LIB.animal('wolf', { h: 0.85 }), [0, 0, 0], 0, fr), ws = k.add(k.LIB.animal('wolf', { h: 0.85 }), [0, 0, 0], 0, sn);
  const pack = [0, 1, 2].map((i) => k.add(k.LIB.animal('wolf', { h: 0.8 + (i % 2) * 0.05 }), [-1.5 + i * 1.4, 0, -2 - (i % 2)], 0.3 * i, fr));
  const fem = k.add(k.LIB.animal('wolf', { h: 0.78 }), [1.2, 0, 0.4], -1.2, fr); fem.traverse((n) => { if (n.isMesh && n.material && n.material.color) { n.material = n.material.clone(); n.material.color.lerp(new T.Color('#3a3a3a'), 0.5); } });
  const pups = [0, 1, 2].map((i) => k.add(k.LIB.animal('wolf', { h: 0.35 }), [0.3 + i * 0.5, 0, 1.4 + (i % 2) * 0.4], i, fr));
  const collar = new T.Mesh(new T.TorusGeometry(0.09, 0.03, 8, 20), M('#ff8a1a', 0.5)); fr.add(collar);
  let head = null; w.traverse((n) => { if (n.isBone && /Neck1/.test(n.name)) head = n; }); const hv = new T.Vector3();
  const col = () => { if (!head) return; w.updateMatrixWorld(true); head.getWorldPosition(hv); fr.worldToLocal(hv); collar.position.copy(hv); collar.rotation.set(PI / 2, 0, w.rotation.y); collar.visible = w.visible; };
  let ov = null; const night = (ctx, a = 0.45) => k.tint(ctx, '#06122a', a);
  const map = (ctx, u) => { ctx.save(); ctx.translate(80, 140); ctx.fillStyle = 'rgba(10,20,40,0.82)'; ctx.beginPath(); ctx.roundRect(0, 0, 560, 380, 22); ctx.fill(); ctx.strokeStyle = '#7d93ab'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(40, 190); ctx.lineTo(520, 190); ctx.stroke();
    ctx.fillStyle = '#ffd23f'; ctx.font = '900 24px Nunito, Arial'; ctx.fillText('OREGON', 40, 60); ctx.fillText('CALIFORNIA', 40, 360); ctx.fillStyle = '#ff6a3a'; const P = []; for (let i = 0; i <= 60; i++) { const s = i / 60; P.push([420 - s * 260 + Math.sin(s * 19) * 70, 60 + s * 280 + Math.cos(s * 13) * 30]); }
    P.slice(0, Math.max(1, Math.floor(u * 61))).forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); }); ctx.restore(); };
  const base = (pl) => { k.only(pl); [w, ...pack, fem, ...pups].forEach((a) => { a.visible = false; }); collar.visible = false; };
  const trot = (a, t, sp = 1.2) => { a.position.set(0, 0, lerp(4, -4, (t * sp * 0.08) % 1)); a.rotation.y = PI; a.pose('walk', t); };
  const shots = {
    hook: (t, kk) => { base(sn); ws.position.set(0, 0, 0); ws.rotation.y = 0.8; ws.pose('idle', t); ov = (ctx) => { night(ctx, 0.5); ctx.save(); ctx.fillStyle = '#f4f1e0'; ctx.shadowColor = '#fff'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.arc(520, 230, 70, 0, 7); ctx.fill(); ctx.restore(); }; return k.cam([2.4, 0.5, 3.4], [0, 0.6, 0], 38, { sky: '#1a2438' }); },
    born: (t, kk) => { base(fr); w.visible = true; pack.forEach((p) => { p.visible = true; p.pose('idle', t); }); w.position.set(0.2, 0, 0.6); w.rotation.y = 0.5; w.pose('idle', t); col(); ov = (ctx) => { k.card(ctx, 'OREGON · 2009', { y: 200, bg: '#1d3557' }); k.card(ctx, 'OR-7', { y: 310, bg: '#ff8a1a' }); }; return k.cam([2.6, 1.3, 4.4], [0, 0.5, -0.4], 40, { sky: fr.sky }); },
    leave: (t, kk) => { base(fr); w.visible = true; pack.forEach((p) => { p.visible = true; p.pose('idle', t); }); k.walk(w, [0.2, 0, 0.6], [3, 0, 8], E(kk), 'walk', t); col(); return k.cam([-2, 1.4, 6], [0.8, 0.5, 1.5], 40, { sky: fr.sky }); },
    walk: (t, kk) => { const pl = kk < 0.5 ? fr : sn; base(pl); const a = pl === fr ? w : ws; a.visible = true; trot(a, t); if (a === w) col(); ov = (ctx) => { if (pl === sn) night(ctx, 0.2); map(ctx, kk * 0.6); }; return k.cam([-2.4, 0.9, a.position.z + 3], [0, 0.5, a.position.z], 40, { sky: pl.sky }); },
    california: (t, kk) => { base(fr); w.visible = true; trot(w, t); col(); ov = (ctx) => { map(ctx, 0.65); k.card(ctx, 'FIRST IN ~90 YEARS', { y: 590, bg: '#e8384f' }); }; return k.cam([2.4, 0.8, w.position.z + 3], [0, 0.5, w.position.z], 40, { sky: fr.sky }); },
    alone: (t, kk) => { base(sn); ws.position.set(0, 0, 0); ws.rotation.y = t * 0.15; ws.pose('idle', t); ov = (ctx) => { night(ctx, 0.4); map(ctx, 0.65 + kk * 0.3); k.vignette(ctx, 0.7); }; return k.cam([5, 3, 6], [0, 0.4, 0], 40, { sky: '#1a2438' }); },
    mate: (t, kk) => { base(fr); w.visible = fem.visible = true; w.position.set(-0.6, 0, 0.4); w.rotation.y = 1.2; w.pose('idle', t); fem.pose('idle', t); col(); ov = (ctx) => { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, 720, 1280); ctx.filter = 'grayscale(1)'; ctx.restore(); ctx.save(); ctx.font = '900 30px monospace'; ctx.fillStyle = '#fff'; ctx.fillText('TRAIL CAM  2014-05-03 21:14', 40, 1240); ctx.fillStyle = '#e8384f'; ctx.beginPath(); ctx.arc(660, 60, 14, 0, 7); ctx.fill(); ctx.restore(); };
      return k.cam([0.2, 0.9, 3.6], [0.2, 0.5, 0.4], 44, { sky: fr.sky, focus: [0.1, 0.95], blur: 1 }); },
    pups: (t, kk) => { base(fr); w.visible = fem.visible = true; pups.forEach((p, i) => { p.visible = true; p.position.x = 0.3 + i * 0.5 + Math.sin(t * 2 + i) * 0.3; p.pose(i % 2 ? 'gallop' : 'idle', t + i); }); w.position.set(-0.6, 0, 0.4); w.pose('idle', t); fem.pose('idle', t); col();
      ov = (ctx) => k.card(ctx, 'THE ROGUE PACK', { y: 200, bg: '#2ecc71' }); return k.cam([1.4, 1.1, 4.4], [0.4, 0.4, 0.8], 40, { sky: fr.sky }); },
    outro: (t, kk) => { base(fr); w.visible = fem.visible = true; pups.forEach((p) => { p.visible = true; p.pose('idle', t); }); w.position.set(-0.6, 0, 0.4); w.rotation.y = 1.2; w.pose('idle', t); fem.pose('idle', t); col(); ov = (ctx) => { k.tint(ctx, '#ff9a3c', 0.15); map(ctx, 1); }; return k.cam([lerp(1.4, 3, kk), 1.4, lerp(4.4, 6, kk)], [0.2, 0.4, 0.6], 40, { sky: fr.sky }); },
  };
  return { shots, sky: fr.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('ding', at('pups', 0.4), { f: 'C6', gain: 0.3 }); } };
}, { assets: ['animals/wolf', 'nature/tree_oak', 'nature/tree_maple', 'nature/tree_birch', 'nature/rock_mossy', 'nature/rock_large_a', 'nature/rock_a', 'nature/rock_b', 'nature/rock_medium'] });
