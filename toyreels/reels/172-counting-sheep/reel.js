// re-render: flicker fix + Kenney toy scenery (13 Nov 2026)
// 172 cinestory3d (story3d.js): imagery beats counting sheep (Harvey & Payne 2002). Scroll stopper: sheep jumping over a bed, counter climbing, the sleeper wide awake.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const rm = k.LIB.place.room({ wall: '#2a2f45', window: true }); k.place(rm); const beach = new T.Group(); k.place(beach);
  const sand = new T.Mesh(new T.PlaneGeometry(200, 200), M('#f0dca8', 0.95)); sand.rotation.x = -PI / 2; beach.add(sand); const sea = new T.Mesh(new T.PlaneGeometry(200, 100), M('#2fa0d8', 0.2, 0, { transparent: true, opacity: 0.9 })); sea.rotation.x = -PI / 2; sea.position.set(0, 0.02, -60); beach.add(sea); beach.sky = '#9fd8f8';
  const bed = new T.Mesh(new T.BoxGeometry(1.6, 0.5, 2.1), M('#e8e2d4', 0.9)); bed.position.set(0, 0.25, 0); rm.add(bed); const pil = new T.Mesh(new T.BoxGeometry(1.2, 0.15, 0.4), M('#ffffff', 0.9)); pil.position.set(0, 0.55, -0.8); rm.add(pil);
  const guy = k.add(k.LIB.human({ body: 'm', top: '#8a9ab8', bottom: '#8a9ab8', hair: '#3b2414' }), [0, 0.55, -0.6], 0, rm);
  const sheep = [0, 1, 2].map((i) => k.add(k.LIB.animal('sheep', { h: 0.6 }), [0, 0, 0], 0, rm));
  const sci = k.add(k.LIB.human({ body: 'f', top: '#f4f6f8', bottom: '#333', hair: '#3b2414', hairStyle: 'bun' }), [1.6, 0, 1.4], -PI / 2, rm);
  const relax = k.add(k.LIB.human({ body: 'm', top: '#8a9ab8', bottom: '#8a9ab8', hair: '#3b2414' }), [0, 0, 0], 0.4, beach);
  let ov = null; const night = (ctx, a = 0.45) => k.tint(ctx, '#06122a', a);
  const lie = () => { guy.position.set(0, 0.5, -0.1); guy.rotation.set(-PI / 2, 0, 0); guy.pose('idle', 0); };
  const jump = (t, n) => sheep.forEach((s, i) => { const u = ((t * 0.7 + i / 3) % 1); s.visible = i < n; s.position.set(lerp(-2.5, 2.5, u), Math.sin(u * PI) * 1.4 + 0.0, 1.6); s.rotation.y = PI / 2; s.pose('walk', t); });
  const base = () => { k.only(rm); sci.visible = false; sheep.forEach((s) => { s.visible = false; }); };
  const shots = {
    hook: (t, kk) => { base(); lie(); jump(t, 3); ov = (ctx) => { night(ctx, 0.3); k.counter(ctx, 'SHEEP', String(Math.floor(240 + kk * 60)), { y: 190 }); }; return k.cam([0.4, 2.6, 4.2], [0, 0.6, 0.5], 44); },
    bed: (t, kk) => { base(); lie(); jump(t, 1 + Math.floor(kk * 2.9)); ov = (ctx) => { night(ctx); k.counter(ctx, 'SHEEP', String(1 + Math.floor(kk * 3)), { y: 190 }); }; return k.cam([0.4, 2.6, 4.2], [0, 0.6, 0.5], 44); },
    study: (t, kk) => { base(); sci.visible = true; sci.pose('talk', t); lie(); ov = (ctx) => { k.card(ctx, 'OXFORD · 2002', { y: 200, bg: '#1d3557' }); }; return k.cam([3, 1.7, 4], [0.6, 1.0, 0.6], 40); },
    result: (t, kk) => { base(); lie(); jump(t, 3); ov = (ctx) => { night(ctx); k.cross(ctx, t, 0); k.card(ctx, 'SLOWER TO SLEEP', { y: 200, bg: '#e8384f' }); }; return k.cam([0.4, 2.6, 4.2], [0, 0.6, 0.5], 44); },
    why: (t, kk) => { base(); lie(); ov = (ctx) => { night(ctx); ['BILLS?', 'WORK?', 'THAT TEXT?'].forEach((w, i) => k.card(ctx, w, { t: kk * 10, at: i * 1.0, y: 180 + i * 100, bg: '#7a3ad8' })); }; return k.close(guy, { d: 1.8, h: 1.6, look: 0.3 }); },
    scene: (t, kk) => { k.only(beach); relax.position.set(0, 0, 0); relax.pose('sit', t); ov = (ctx) => k.tint(ctx, '#ffcf8a', 0.12); return k.cam([lerp(2, 0, kk), 1.4, 4], [0, 0.7, -6], 42, { sky: beach.sky }); },
    faster: (t, kk) => { base(); lie(); ov = (ctx) => { night(ctx, 0.5); k.counter(ctx, 'ASLEEP', '~20 MIN FASTER', { y: 190 }); k.tick(ctx, t, 0); ctx.save(); ctx.font = '900 54px Nunito, Arial'; ctx.fillStyle = '#fff'; for (let i = 0; i < 3; i++) { const u = (t * 0.6 + i / 3) % 1; ctx.globalAlpha = 1 - u; ctx.fillText('z', 420 + u * 80, 700 - u * 150); } ctx.restore(); }; return k.close(guy, { d: 1.8, h: 1.6, look: 0.3 }); },
    outro: (t, kk) => { k.only(beach); relax.position.set(0, 0, 0); relax.pose('sit', t); ov = (ctx) => k.big(ctx, 'GO TO THE BEACH. 🏖️', { y: 240, size: 56, col: '#ffd23f' }); return k.cam([0, 1.4, 4], [0, 0.7, -6], 42, { sky: beach.sky }); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: '#2a2f45', over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'animals/sheep', 'humans/Superhero_Male', 'humans/Superhero_Female', 'humans/ual1'] });
