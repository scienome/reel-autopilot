// 163 cinestory3d (story3d.js): the vixen's scream (Mammal Society; Newton-Fisher 1993). Scroll stopper: a dark street at night, a scream wave, a fox under a streetlight.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const st = k.LIB.place.street({ night: true, len: 50 }); k.place(st); const bed = k.LIB.place.room({ wall: '#2a2f45', window: true }); k.place(bed);
  const fox = k.add(k.LIB.animal('fox', { h: 0.5 }), [3.4, 0, 2], -PI / 2, st), tod = k.add(k.LIB.animal('fox', { h: 0.55 }), [0, 0, 0], 0, st);
  const sleeper = k.add(k.LIB.human({ body: 'f', top: '#8a9ab8', bottom: '#8a9ab8', hair: '#3b2414', hairStyle: 'long' }), [0, 0.55, 0], 0, bed);
  const bedm = new T.Mesh(new T.BoxGeometry(1.6, 0.5, 2.1), M('#e8e2d4', 0.9)); bedm.position.set(0, 0.25, 0); bed.add(bedm);
  let ov = null; const night = (ctx, a = 0.35) => k.tint(ctx, '#06122a', a);
  const scream = (ctx, t, x = 360, y = 560, col = '255,90,90') => { ctx.save(); for (let i = 0; i < 5; i++) { const u = (t * 1.2 + i / 5) % 1; ctx.strokeStyle = `rgba(${col},${1 - u})`; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x, y, 30 + u * 340, -2.4, -0.7); ctx.stroke(); } ctx.restore(); };
  const vixen = (t, pose = 'idle') => { fox.position.set(3.4, 0, 2); fox.rotation.y = -PI / 2; fox.pose(pose, t); };
  const shots = {
    hook: (t, kk) => { k.only(st); tod.visible = false; vixen(t, 'attack'); ov = (ctx) => { night(ctx, 0.3); scream(ctx, t, 330, 640); k.big(ctx, 'AAAAAH!', { y: 240, size: 90, col: '#ff6a6a' }); }; return k.cam([1.2, 0.6, 4.4], [3.4, 0.35, 2], 38, { sky: st.sky }); },
    night: (t, kk) => { k.only(bed); sleeper.position.set(0, 0.55, 0); sleeper.rotation.set(0, 0, 0); sleeper.pose(kk > 0.4 ? 'sit' : 'death', kk > 0.4 ? t : 99); ov = (ctx) => { night(ctx, 0.5); k.counter(ctx, 'TIME', '02:00', { y: 190 }); if (kk > 0.3) scream(ctx, t, 140, 420); }; return k.cam([1.6, 1.8, 2.8], [0, 0.8, 0], 42); },
    fox: (t, kk) => { k.only(st); tod.visible = false; k.walk(fox, [7, 0, 6], [3.4, 0, 2], E(kk), 'walk', t); ov = (ctx) => night(ctx, 0.25); return k.cam([0.6, 1.2, 5.5], [4.4, 0.4, 3.0], 40, { sky: st.sky }); },
    vixen: (t, kk) => { k.only(st); tod.visible = false; vixen(t, 'attack'); ov = (ctx) => { night(ctx, 0.25); scream(ctx, t, 300, 620); k.card(ctx, 'VIXEN · WINTER', { y: 200, bg: '#c8501e' }); }; return k.close(fox, { d: 1.6, side: 0.6, extra: { sky: st.sky } }); },
    why: (t, kk) => { k.only(st); tod.visible = true; k.walk(tod, [-3, 0, -8], [2.6, 0, 1.4], E(kk), 'walk', t); vixen(t); ov = (ctx) => { night(ctx, 0.25); k.card(ctx, '"I\'M HERE"', { y: 200, bg: '#7a3ad8' }); }; return k.cam([-1, 1.6, 7], [2, 0.4, -1], 42, { sky: st.sky }); },
    other: (t, kk) => { k.only(st); tod.visible = true; tod.position.set(2.6, 0, 1.4); tod.rotation.y = 0.8; tod.pose('attack', t + 0.3); vixen(t, 'attack'); ov = (ctx) => { night(ctx, 0.25); ['BARK', 'YELP', 'GEKKER'].forEach((w, i) => k.card(ctx, w, { t: kk * 10, at: i * 1.2, y: 180 + i * 100, bg: '#1d3557' })); }; return k.cam([0.5, 0.9, 4.6], [3, 0.35, 1.7], 38, { sky: st.sky }); },
    safe: (t, kk) => { k.only(st); tod.visible = true; tod.position.set(2.6, 0, 1.4); tod.rotation.y = 0.8; tod.pose('idle', t); vixen(t); ov = (ctx) => { night(ctx, 0.2); k.tick(ctx, t, -99); }; return k.cam([1.2, 0.8, 4.8], [3, 0.35, 1.7], 38, { sky: st.sky }); },
    outro: (t, kk) => { k.only(st); tod.visible = false; vixen(t, 'attack'); ov = (ctx) => { night(ctx, 0.3); scream(ctx, t, 330, 640); }; return k.cam([1.2, 0.6, 4.4], [3.4, 0.35, 2], 38, { sky: st.sky }); },
  };
  return { shots, sky: st.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('whoosh', at('hook', 0.2), { dur: 0.6, gain: 0.25 }); } };
}, { assets: ['animals/fox', 'humans/Superhero_Female', 'humans/ual1'] });
