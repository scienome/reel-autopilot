// 157 cinestory3d (story3d.js): magnetic alignment of cattle (Begall 2008; Burda 2009; Hert 2011 failed to replicate). Scroll stopper: a herd all turning to face the same way.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fm = k.farm();
  const cows = []; for (let i = 0; i < 9; i++) cows.push(k.add(k.LIB.animal(i % 4 === 3 ? 'bull' : 'cow', { h: 1.5 }), [-6 + (i % 3) * 4 + Math.sin(i) * 0.6, 0, 3 + Math.floor(i / 3) * 3.5], i * 1.3, fm));
  const deer = [0, 1, 2].map((i) => k.add(k.LIB.animal('deer', { h: 1.3 }), [-4 + i * 3, 0, 3], i, fm));
  const pyl = new T.Group(); fm.add(pyl); pyl.position.set(0, 0, 6); const PM = M('#7a7f88', 0.5, 0.7); [-6, 6].forEach((x) => { const p = new T.Mesh(new T.CylinderGeometry(0.2, 0.4, 14, 8), PM); p.position.set(x, 7, 0); pyl.add(p); const arm = new T.Mesh(new T.BoxGeometry(4, 0.2, 0.2), PM); arm.position.set(x, 13, 0); pyl.add(arm); });
  for (let j = 0; j < 3; j++) { const w = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 12, 6), M('#222')); w.rotation.z = PI / 2; w.position.set(0, 13, -1.2 + j * 1.2); pyl.add(w); }
  const N = PI; // our north = -z, an animal faces +z at rotation 0 -> facing north means rotation PI
  const align = (u, list, scatter = false) => list.forEach((c, i) => { const r0 = i * 1.3; c.rotation.y = scatter ? r0 + Math.sin(i * 2.1) * 0.6 : lerp(r0, N + (i % 2 ? 0 : PI) + Math.sin(i) * 0.15, E(u)); c.pose(i % 2 ? 'eat' : 'idle', u * 10 + i); });
  let ov = null; const compass = (ctx) => { ctx.save(); ctx.translate(600, 230); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fill(); ctx.fillStyle = '#e8384f'; ctx.beginPath(); ctx.moveTo(0, -58); ctx.lineTo(12, 0); ctx.lineTo(-12, 0); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, 58); ctx.lineTo(12, 0); ctx.lineTo(-12, 0); ctx.fill(); ctx.font = '900 28px Nunito, Arial'; ctx.textAlign = 'center'; ctx.fillText('N', 0, -78); ctx.restore(); };
  const sat = (ctx) => { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; ctx.strokeRect(40, 120, 640, 1000); ctx.fillStyle = '#ffd23f'; ctx.font = '900 26px Nunito, Arial'; ctx.fillText('SATELLITE · 8,510 CATTLE', 60, 160); ctx.restore(); };
  const base = () => { k.only(fm); deer.forEach((d) => { d.visible = false; }); cows.forEach((c) => { c.visible = true; }); pyl.visible = false; };
  const top = (fov = 46) => k.cam([0.01, 26, 6.5], [0, 0, 6.4], fov, { sky: fm.sky });
  const shots = {
    hook: (t, kk) => { base(); align(Math.min(1, kk * 1.4), cows); ov = (ctx) => compass(ctx); return k.cam([10, 4, 18], [-1, 0.8, 6], 42, { sky: fm.sky }); },
    sat: (t, kk) => { base(); align(1, cows); ov = (ctx) => { sat(ctx); compass(ctx); }; return top(); },
    pattern: (t, kk) => { base(); align(1, cows); ov = (ctx) => { compass(ctx); ctx.save(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.setLineDash([16, 12]); [200, 360, 520].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 200); ctx.lineTo(x, 1000); ctx.stroke(); }); ctx.restore(); }; return top(42); },
    deer: (t, kk) => { base(); cows.forEach((c) => { c.visible = false; }); deer.forEach((d, i) => { d.visible = true; d.rotation.y = N + (i % 2 ? PI : 0) + Math.sin(i) * 0.1; d.pose('eat', t + i); }); ov = (ctx) => compass(ctx); return k.cam([6, 2.4, 9], [-1, 0.8, 3], 40, { sky: fm.sky }); },
    why: (t, kk) => { base(); align(1, cows); ov = (ctx) => { k.tint(ctx, '#06122a', 0.25); ctx.save(); ctx.strokeStyle = 'rgba(120,220,255,0.8)'; ctx.lineWidth = 4; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(360, 640, 120 + i * 60, 420 + i * 40, 0, 0, 7); ctx.stroke(); } ctx.restore(); compass(ctx); }; return k.cam([8, 3, 16], [-1, 0.8, 6], 42, { sky: '#4a5a7a' }); },
    power: (t, kk) => { base(); pyl.visible = true; align(1, cows, true); cows.forEach((c, i) => { c.rotation.y += Math.sin(t * 0.5 + i) * 0.4; }); ov = (ctx) => k.card(ctx, 'UNDER POWER LINES: RANDOM', { y: 1000 - 790, bg: '#e8384f', size: 36 }); return k.cam([12, 6, 20], [0, 3, 6], 46, { sky: fm.sky }); },
    doubt: (t, kk) => { base(); align(1, cows, true); ov = (ctx) => { k.big(ctx, '?', { y: 300, size: 220, col: '#ffd23f' }); }; return top(46); },
    outro: (t, kk) => { base(); align(Math.min(1, kk * 1.4), cows); ov = (ctx) => compass(ctx); return k.cam([10, 4, 18], [-1, 0.8, 6], 42, { sky: fm.sky }); },
  };
  return { shots, sky: fm.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('ding', at('pattern', 0.4), { f: 'E6', gain: 0.3 }); } };
}, { assets: ['animals/cow', 'animals/bull', 'animals/deer', 'props/hay', 'buildings/cottage', 'buildings/village_house', 'buildings/house_v2', 'buildings/well', 'buildings/fence', 'nature/tree_oak', 'nature/tree_maple'] });
