// re-render: Kenney toy nature scenery (13 Nov 2026)
// 181 cinestory3d (story3d.js): rumination (Britannica; extension services). Scroll stopper: a cow lying down chewing with nothing in front of it, a bolus travelling UP its neck.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fm = k.farm();
  const cow = k.add(k.LIB.animal('cow', { h: 1.5 }), [0, 0, 3], PI / 2, fm), herd = [0, 1, 2].map((i) => k.add(k.LIB.animal('cow', { h: 1.5 }), [-4 + i * 3, 0, -1], i, fm));
  let ov = null; const xr = (ctx, t, dir) => { ctx.save(); ctx.translate(360, 640); ctx.fillStyle = 'rgba(8,16,32,0.82)'; ctx.beginPath(); ctx.roundRect(-320, -330, 640, 640, 30); ctx.fill(); ctx.strokeStyle = '#ff9aa8'; ctx.lineWidth = 22; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-250, -200); ctx.quadraticCurveTo(-120, -220, -40, -40); ctx.stroke(); ctx.fillStyle = 'rgba(160,220,90,0.8)'; ctx.beginPath(); ctx.ellipse(60, 80, 170, 130, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '900 30px Nunito, Arial'; ctx.textAlign = 'center'; ctx.fillText('RUMEN', 60, 90);
    if (dir) { const u = (t * 0.5) % 1, s = dir > 0 ? u : 1 - u; const x = -250 + (210 * s), y = -200 + 160 * s * s; ctx.fillStyle = '#6a9a3a'; ctx.beginPath(); ctx.arc(x, y, 24, 0, 7); ctx.fill(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-120, -280); ctx.lineTo(-120 + dir * 60, -280 - dir * 0); ctx.stroke(); } ctx.restore(); };
  const lie = (t) => { cow.position.set(0, -0.35, 3); cow.rotation.set(0, PI / 2, 0); cow.pose('idle', t); };
  const base = () => { k.only(fm); herd.forEach((h, i) => h.pose('eat', i)); cow.rotation.set(0, PI / 2, 0); cow.position.set(0, 0, 3); };
  const chew = (ctx, t, n) => k.counter(ctx, 'CHEWS', String(Math.floor((t * 1.4) % n) + 1), { y: 190 });
  const shots = {
    hook: (t, kk) => { base(); lie(t); ov = (ctx) => xr(ctx, t, -1); return k.cam([1.8, 1.3, 6.4], [0.6, 0.7, 3], 40, { sky: fm.sky }); },
    eat: (t, kk) => { base(); cow.pose('eat', t); ov = (ctx) => xr(ctx, t, 1); return k.cam([3.4, 0.8, 5.0], [1.2, 0.4, 3], 38, { sky: fm.sky }); },
    rumen: (t, kk) => { base(); cow.pose('idle', t); ov = (ctx) => { xr(ctx, t, 0); k.card(ctx, '≈ A BATHTUB OF FOOD', { y: 200, bg: '#2f8a6a' }); }; return k.cam([0.6, 1.4, 6.4], [0, 1, 3], 40, { sky: fm.sky }); },
    up: (t, kk) => { base(); lie(t); ov = (ctx) => { xr(ctx, t, -1); k.card(ctx, 'THE CUD', { y: 200, bg: '#c9a24a' }); }; return k.cam([1.8, 1.3, 6.4], [0.6, 0.7, 3], 40, { sky: fm.sky }); },
    chew: (t, kk) => { base(); lie(t); ov = (ctx) => chew(ctx, t, 60); return k.cam([2.8, 0.9, 4.8], [1.0, 0.5, 3], 36, { sky: fm.sky }); },
    hours: (t, kk) => { base(); lie(t); ov = (ctx) => k.counter(ctx, 'CHEWING PER DAY', 'UP TO 8 HOURS', { y: 190 }); return k.wide(fm, { pos: [7, 3, 12], look: [0, 0.6, 2] }); },
    why: (t, kk) => { base(); lie(t); ov = (ctx) => { xr(ctx, t, 1); k.card(ctx, 'TINY PIECES → MICROBES', { y: 200, bg: '#7a3ad8', size: 38 }); }; return k.cam([1.8, 1.3, 6.4], [0.6, 0.7, 3], 40, { sky: fm.sky }); },
    outro: (t, kk) => { base(); lie(t); ov = (ctx) => k.big(ctx, 'SECONDS. 🐄', { y: 240, size: 84, col: '#ffd23f' }); return k.cam([2.8, 0.9, 4.8], [1.0, 0.5, 3], 36, { sky: fm.sky }); },
  };
  return { shots, lens: 28, sky: fm.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: [...LIB.toyKitAssets().filter((a) => a.startsWith('knature/')), 'animals/cow', 'props/hay', 'buildings/cottage', 'buildings/village_house', 'buildings/house_v2', 'buildings/well', 'buildings/fence', 'nature/tree_oak', 'nature/tree_maple'] });
