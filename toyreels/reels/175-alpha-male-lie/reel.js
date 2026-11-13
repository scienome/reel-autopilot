// re-render: character flicker fix (13 Nov 2026)
// 175 cinestory3d (story3d.js): the alpha wolf myth (Mech 1999; Schenkel 1947). Scroll stopper: two wolves snarling face to face, "ALPHA?" stamped over them.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fr = k.forest({ trees: 20 }); const zoo = new T.Group(); k.place(zoo); const sn = k.snow({ trees: 6 });
  const zfloor = new T.Mesh(new T.PlaneGeometry(30, 30), M('#8a8f86', 0.95)); zfloor.rotation.x = -PI / 2; zoo.add(zfloor); const BAR = M('#3a3c40', 0.35, 0.9);
  for (let i = 0; i < 30; i++) { const b = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 3, 6), BAR); b.position.set(-6 + i * 0.4, 1.5, 3); zoo.add(b); } zoo.sky = '#b0b8c0';
  const W = (h = 0.85, pl = fr) => k.add(k.LIB.animal('wolf', { h }), [0, 0, 0], 0, pl);
  const za = W(0.85, zoo), zb = W(0.85, zoo), zc = W(0.8, zoo); const dad = W(0.9, fr), mom = W(0.82, fr); const pups = [0, 1, 2].map(() => W(0.4, fr)); const aw = [W(0.85, sn), W(0.8, sn), W(0.4, sn), W(0.4, sn)];
  const mech = k.add(k.LIB.human({ body: 'm', top: '#5a6a4a', bottom: '#3a3a3a', hair: '#cfcfcf' }), [3, 0, 4], -2.4, sn);
  let ov = null; const old = (ctx) => { k.tint(ctx, '#c8a878', 0.25); };
  const fight = (t) => { za.position.set(-0.6, 0, 0); za.rotation.y = PI / 2; zb.position.set(0.6, 0, 0); zb.rotation.y = -PI / 2; za.pose('attack', t); zb.pose('attack', t + 0.3); zc.position.set(2, 0, -1.6); zc.rotation.y = -2; zc.pose('idle', t); };
  const fam = (t) => { dad.position.set(-0.8, 0, 0); dad.rotation.y = 0.4; mom.position.set(0.8, 0, 0.2); mom.rotation.y = -0.4; dad.pose('idle', t); mom.pose('idle', t); pups.forEach((p, i) => { p.position.set(-0.6 + i * 0.6 + Math.sin(t * 2 + i) * 0.2, 0, 1.2 + (i % 2) * 0.3); p.rotation.y = i; p.pose(i % 2 ? 'gallop' : 'idle', t + i); }); };
  const shots = {
    hook: (t, kk) => { k.only(zoo); fight(t); ov = (ctx) => k.big(ctx, 'ALPHA?', { y: 240, size: 110, col: '#ffd23f' }); return k.cam([0.6, 0.9, 3.8], [0, 0.5, 0], 38, { sky: zoo.sky }); },
    myth: (t, kk) => { k.only(zoo); fight(t); ov = (ctx) => k.card(ctx, '"THE ALPHA FIGHTS TO THE TOP"', { y: 200, bg: '#7a3ad8', size: 36 }); return k.cam([2.4, 1.5, 4], [0, 0.5, 0], 40, { sky: zoo.sky }); },
    captive: (t, kk) => { k.only(zoo); fight(t); ov = (ctx) => { old(ctx); k.card(ctx, 'CAPTIVE · STRANGERS', { y: 200, bg: '#5a3a22' }); }; return k.cam([0, 1.8, 7], [0, 0.6, 0], 42, { sky: zoo.sky }); },
    fight: (t, kk) => { k.only(zoo); fight(t * 1.4); ov = (ctx) => old(ctx); return k.cam([1.6, 0.6, 3.0], [0, 0.45, 0], 36, { sky: zoo.sky }); },
    mech: (t, kk) => { k.only(zoo); fight(t); ov = (ctx) => { old(ctx); ctx.save(); ctx.translate(360, 560); ctx.rotate(-0.05); ctx.fillStyle = '#2a4a3a'; ctx.fillRect(-170, -230, 340, 460); ctx.fillStyle = '#f2ead8'; ctx.font = '900 64px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('THE', 0, -60); ctx.fillText('WOLF', 0, 20); ctx.font = '700 28px Georgia, serif'; ctx.fillText('L. David Mech · 1970', 0, 140); ctx.restore(); }; return k.cam([0, 1.8, 7], [0, 0.6, 0], 42, { sky: zoo.sky }); },
    wild: (t, kk) => { k.only(sn); aw.forEach((w, i) => { w.position.set(-1 + i * 0.7, 0, -i * 0.4); w.rotation.y = 0.8; w.pose(i > 1 ? 'gallop' : 'walk', t + i); }); mech.pose('idle', t); ov = (ctx) => k.card(ctx, 'ARCTIC · WILD WOLVES', { y: 200, bg: '#1d3557' }); return k.cam([5, 1.4, 7], [0.5, 0.5, 0], 42, { sky: sn.sky }); },
    family: (t, kk) => { k.only(fr); fam(t); ov = (ctx) => { k.card(ctx, 'MUM + DAD + PUPS', { y: 200, bg: '#2ecc71' }); }; return k.cam([0, 1.1, 4.2], [0, 0.4, 0.4], 40, { sky: fr.sky }); },
    sorry: (t, kk) => { k.only(sn); aw.forEach((w) => { w.visible = false; }); mech.position.set(0, 0, 0); mech.rotation.y = 0.3; mech.pose('talk', t); ov = (ctx) => k.card(ctx, '"PLEASE STOP SAYING ALPHA"', { y: 200, bg: '#c8501e', size: 36 }); return k.close(mech, { d: 2.0, side: 0.3, extra: { sky: sn.sky } }); },
    outro: (t, kk) => { k.only(fr); fam(t); ov = (ctx) => k.big(ctx, 'JUST A DAD. 🐺', { y: 240, size: 78, col: '#ffd23f' }); return k.cam([0.2, 1.0, 3.6], [0, 0.5, 0.4], 40, { sky: fr.sky }); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: fr.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'animals/wolf', 'humans/Superhero_Male', 'humans/ual1', 'nature/tree_oak', 'nature/tree_maple', 'nature/tree_birch', 'nature/rock_mossy', 'nature/rock_large_a', 'nature/rock_a', 'nature/rock_b', 'nature/rock_medium'] });
