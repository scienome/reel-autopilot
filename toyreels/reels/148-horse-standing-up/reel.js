// 148 cinestory3d (story3d.js): horses doze standing (stay apparatus) but lie down for REM; herds take turns. Scroll stopper: a horse asleep on its feet, eyes shut, zzz.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fm = k.farm();
  const h1 = k.add(k.LIB.animal('horse_white', { h: 1.7 }), [0, 0, 0], 0.5, fm), h2 = k.add(k.LIB.animal('horse', { h: 1.7 }), [3, 0, -2], -0.4, fm), h3 = k.add(k.LIB.animal('donkey', { h: 1.3 }), [-3, 0, -1.5], 0.9, fm);
  const wolf = k.add(k.LIB.animal('wolf', { h: 0.8 }), [0, 0, -14], 0, fm);
  let ov = null; const zzz = (ctx, t, x = 470, y = 420) => { ctx.save(); ctx.font = '900 54px Nunito, Arial'; ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#1d3557'; ctx.lineWidth = 8; for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; ctx.globalAlpha = 1 - u; ctx.strokeText('z', x + u * 90, y - u * 160); ctx.fillText('z', x + u * 90, y - u * 160); } ctx.restore(); };
  const leg = (ctx, t, lock) => { ctx.save(); ctx.translate(360, 640); ctx.fillStyle = 'rgba(10,20,40,0.82)'; ctx.beginPath(); ctx.roundRect(-300, -420, 600, 760, 30); ctx.fill(); ctx.lineCap = 'round';
    ctx.strokeStyle = '#f2efe6'; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(-40, -330); ctx.lineTo(10, -60); ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, -60); ctx.lineTo(-30, 180); ctx.lineTo(-20, 280); ctx.stroke(); // femur, tibia, cannon
    ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(lock ? 30 : 46, lock ? -95 : -60, 22, 0, 7); ctx.fill(); // kneecap slides up and hooks
    ctx.strokeStyle = '#ff6a3a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(30, -300); ctx.quadraticCurveTo(80, -80, 20, 260); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-60, -200); ctx.quadraticCurveTo(-90, 40, -40, 270); ctx.stroke();
    ctx.font = '900 30px Nunito, Arial'; ctx.fillStyle = '#ffd23f'; ctx.textAlign = 'left'; ctx.fillText(lock ? 'LOCKED' : 'KNEECAP', 80, -90); ctx.fillStyle = '#ff9a6a'; ctx.fillText('TENDONS', 90, 120); ctx.restore(); };
  const base = () => { k.only(fm); wolf.visible = false; [h1, h2, h3].forEach((h) => { h.visible = true; }); h1.position.set(0, 0, 0); h1.rotation.set(0, 0.5, 0); };
  const asleep = (h, t) => { h.pose('headlow', t * 0.3); };
  const shots = {
    hook: (t, kk) => { base(); asleep(h1, t); h2.pose('idle', t); h3.pose('idle', t); ov = (ctx) => { k.tint(ctx, '#0b1630', 0.35); zzz(ctx, t); }; return k.cam([3.6, 1.5, 4.4], [0, 1.0, 0], 38, { sky: '#3a4a6a', focus: [0.25, 0.8], blur: 6 }); },
    doze: (t, kk) => { base(); asleep(h1, t); h2.pose('idle', t); h3.pose('idle', t); ov = (ctx) => { k.tint(ctx, '#0b1630', 0.25); zzz(ctx, t, 420, 380); k.counter(ctx, 'STILL STANDING', Math.floor(1 + kk * 3) + ' HOURS', { y: 180 }); }; return k.wide(fm, { pos: [5, 2.2, 7], look: [0, 1, 0], sky: '#4a5a7a' }); },
    inside: (t, kk) => { base(); asleep(h1, t); ov = (ctx) => leg(ctx, t, false); return k.close(h1, { d: 2.6, side: 1.5, h: 0.35, look: 0.3 }); },
    knee: (t, kk) => { base(); asleep(h1, t); ov = (ctx) => leg(ctx, t, kk > 0.35); return k.close(h1, { d: 2.4, side: 1.6, h: 0.3, look: 0.3 }); },
    why: (t, kk) => { base(); wolf.visible = true; k.walk(wolf, [-2, 0, -14], [-1, 0, -6], E(kk), 'walk', t); if (kk > 0.5) { h1.pose('gallop', t); h1.position.z = lerp(0, 4, seg(kk, 0.5, 1)); h1.rotation.y = 0; } else h1.pose('idle', t); h2.pose(kk > 0.55 ? 'gallop' : 'idle', t); h3.pose('idle', t);
      return k.cam([-5, 2.0, 7], [0, 1, -2], 42, { sky: fm.sky }); },
    deep: (t, kk) => { base(); h1.pose('death', 99); h1.position.y = 0; ov = (ctx) => { k.tint(ctx, '#0b1630', 0.35); zzz(ctx, t, 430, 640); k.card(ctx, 'REM = LYING DOWN', { y: 200, bg: '#7a3ad8' }); }; return k.cam([3.5, 1.6, 4.5], [0, 0.5, 0], 38, { sky: '#3a4a6a' }); },
    herd: (t, kk) => { base(); h1.pose('death', 99); h3.pose('death', 99); h2.pose('idle', t); h2.rotation.y = Math.sin(t * 0.6) * 0.8; ov = (ctx) => { k.tint(ctx, '#0b1630', 0.3); k.card(ctx, 'ON GUARD', { y: 200, bg: '#2ecc71' }); zzz(ctx, t, 260, 760); }; return k.wide(fm, { pos: [6, 3, 8], look: [0, 0.6, -1], sky: '#4a5a7a' }); },
    outro: (t, kk) => { base(); asleep(h1, t); h2.pose('idle', t); h3.pose('idle', t); ov = (ctx) => { k.tint(ctx, '#0b1630', 0.35); zzz(ctx, t); }; return k.cam([3.6, 1.5, 4.4], [0, 1.0, 0], 38, { sky: '#3a4a6a', focus: [0.25, 0.8], blur: 6 }); },
  };
  return { shots, sky: '#3a4a6a', over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('click', at('knee', 1.2), { gain: 0.4 }); kit.play('whoosh', at('why', 1.6), { dur: 0.6, gain: 0.2 }); } };
}, { assets: ['animals/horse_white', 'animals/horse', 'animals/donkey', 'animals/wolf', 'props/hay', 'buildings/cottage', 'buildings/village_house', 'buildings/house_v2', 'buildings/well', 'buildings/fence', 'nature/tree_oak', 'nature/tree_maple'] });
