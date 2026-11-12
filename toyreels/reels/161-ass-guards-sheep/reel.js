// 161 cinestory3d (story3d.js): guard donkeys protect sheep (OMAFRA; Texas A&M AgriLife). Scroll stopper: a donkey charging a fox at night.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fm = k.farm();
  const don = k.add(k.LIB.animal('donkey', { h: 1.35 }), [0, 0, 4], 0, fm), d2 = k.add(k.LIB.animal('donkey', { h: 1.3 }), [0, 0, 0], 0, fm), fox = k.add(k.LIB.animal('fox', { h: 0.5 }), [0, 0, 0], 0, fm);
  const sheep = []; for (let i = 0; i < 7; i++) sheep.push(k.add(k.LIB.animal('sheep', { h: 1.0 }), [-2 + (i % 4) * 1.4 + Math.sin(i) * 0.3, 0, 5 + Math.floor(i / 4) * 1.5], i * 0.9, fm));
  let ov = null; const night = (ctx, a = 0.5) => k.tint(ctx, '#06122a', a); const base = () => { k.only(fm); d2.visible = false; fox.visible = true; don.visible = true; sheep.forEach((s, i) => s.pose(i % 2 ? 'eat' : 'idle', 0.5 + i)); };
  const shots = {
    hook: (t, kk) => { base(); k.walk(don, [1, 0, 6], [6, 0, 3.5], E(kk), 'gallop', t); k.walk(fox, [3, 0, 7], [8, 0, 3], E(kk), 'gallop', t); ov = (ctx) => night(ctx, 0.35); return k.cam([-1, 3.2, 8.7], [4, 0.6, 4.6], 48, { sky: '#1a2438' }); },
    night: (t, kk) => { base(); don.visible = false; k.walk(fox, [9, 0, 3], [4, 0, 6.5], E(kk), 'walk', t); ov = (ctx) => night(ctx); return k.cam([-1, 1.2, 8.6], [4, 0.4, 5.5], 40, { sky: '#1a2438' }); },
    guard: (t, kk) => { base(); fox.visible = false; don.position.set(1.8, 0, 6.2); don.rotation.y = 0.6; don.pose('idle', t); ov = (ctx) => { night(ctx, 0.35); k.card(ctx, 'ON DUTY', { y: 200, bg: '#2ecc71' }); }; return k.close(don, { d: 3.4, side: 0.4, extra: { sky: '#1a2438' } }); },
    hate: (t, kk) => { base(); fox.position.set(4.2, 0, 7.2); fox.rotation.y = -2.0; fox.pose('idle', t); don.position.set(2.2, 0, 6.6); don.rotation.y = 0.8; don.pose('attack', t); ov = (ctx) => { night(ctx, 0.3); ['BRAY', 'CHASE', 'KICK'].forEach((w, i) => k.card(ctx, w, { t: kk * 10, at: i * 1.2, y: 180 + i * 100, bg: '#e8384f' })); }; return k.cam([-0.5, 1.4, 8.7], [3, 0.6, 6.6], 40, { sky: '#1a2438' }); },
    charge: (t, kk) => { base(); k.walk(don, [2.2, 0, 6.6], [7, 0, 4], E(kk), 'gallop', t); k.walk(fox, [4.2, 0, 7.2], [13, 0, 2], E(kk) * 1.1, 'gallop', t); ov = (ctx) => night(ctx, 0.3); return k.cam([0, 1.5, 8.7], [6, 0.6, 4.5], 40, { sky: '#1a2438' }); },
    works: (t, kk) => { base(); fox.visible = false; don.position.set(1.4, 0, 5.6); don.rotation.y = 0.3; don.pose('idle', t); ov = (ctx) => k.card(ctx, 'NO TRAINING · NO SALARY', { y: 200, bg: '#c9a24a', size: 38 }); return k.cam([5, 2.8, 12], [0.6, 0.6, 5.8], 42, { sky: fm.sky }); },
    one: (t, kk) => { base(); fox.visible = false; d2.visible = true; don.position.set(-4, 0, 3); don.rotation.y = 1.4; d2.position.set(-2.6, 0, 3.1); d2.rotation.y = -1.6; don.pose('idle', t); d2.pose('idle', t);
      ov = (ctx) => { k.card(ctx, '1 DONKEY ✓', { y: 190, bg: '#2ecc71' }); k.card(ctx, '2 DONKEYS ✗', { y: 300, bg: '#e8384f' }); }; return k.cam([0, 2.6, 13], [-1.5, 0.6, 4.5], 42, { sky: fm.sky }); },
    outro: (t, kk) => { base(); fox.visible = false; don.position.set(1.4, 0, 6.8); don.rotation.y = 0.3; don.pose('idle', t); ov = (ctx) => k.big(ctx, 'THANK YOU. 🫏', { y: 230, size: 80, col: '#ffd23f' }); return k.close(don, { d: 3.6, side: 0.3 }); },
  };
  return { shots, lens: 28, sky: fm.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('whoosh', at('hook', 0.3), { dur: 0.8, gain: 0.2 }); kit.play('whoosh', at('charge', 0.3), { dur: 0.8, gain: 0.2 }); } };
}, { assets: ['animals/donkey', 'animals/fox', 'animals/sheep', 'props/hay', 'buildings/cottage', 'buildings/village_house', 'buildings/house_v2', 'buildings/well', 'buildings/fence', 'nature/tree_oak', 'nature/tree_maple'] });
