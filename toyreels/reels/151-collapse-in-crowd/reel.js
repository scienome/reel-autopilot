// 151 cinestory3d (story3d.js): the bystander effect and how to beat it (point at one person; Red Cross guidance). Scroll stopper: a man collapses as a crowd walks past.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const st = k.LIB.place.street({ len: 60 }); k.place(st); const X = 5.4, Y = 0.18;
  const vic = k.add(k.LIB.human({ body: 'm', top: '#7a8a99', bottom: '#2a2f3a', hair: '#2a1a10' }), [X, Y, 0], PI, st);
  const hero = k.add(k.LIB.human({ body: 'f', top: '#f2f2f2', bottom: '#1f3b73', hair: '#1a1210', hairStyle: 'long' }), [X - 0.9, Y, 1.0], PI / 2, st);
  const red = k.add(k.LIB.human({ body: 'm', top: '#d0141e', bottom: '#222', hair: '#111', hairStyle: 'short' }), [0, 0, 0], 0, st);
  const blue = k.add(k.LIB.human({ body: 'f', top: '#2f6fd8', bottom: '#333', hair: '#5a3a1a', hairStyle: 'bun' }), [0, 0, 0], 0, st);
  const CR = ['#8b6c42', '#2f4f4f', '#5b4a7a', '#a0522d', '#3e5a7a', '#6b6b6b', '#4a7a3a', '#7a3a5a'].map((c, i) => k.add(k.LIB.human({ body: i % 2 ? 'f' : 'm', top: c, bottom: '#2a2a30', hair: ['#1a1210', '#3b2414', '#111', '#5a3a1a'][i % 4], hairStyle: i % 2 ? 'bun' : 'short' }), [0, 0, 0], 0, st));
  const crowd = (t, sp = 1.3) => CR.forEach((h, i) => { const lane = X - 1.4 + (i % 3) * 1.1, dir = i % 2 ? 1 : -1, u = ((t * sp * 0.06 + i * 0.13) % 1); const z = dir > 0 ? lerp(-14, 14, u) : lerp(14, -14, u);
    h.visible = true; h.position.set(lane, Y, z); h.rotation.y = dir > 0 ? 0 : PI; h.pose('walk', t + i); });
  const hideC = () => CR.forEach((h) => { h.visible = false; });
  const down = (t) => { vic.position.set(X, Y, 0); vic.rotation.y = PI / 2; vic.pose('death', 99); };
  let ov = null; const arrow = (ctx, x, y, label, col) => { ctx.save(); ctx.fillStyle = col; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 30, y - 50); ctx.lineTo(x + 30, y - 50); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.font = '900 34px Nunito, Arial'; ctx.textAlign = 'center'; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.strokeText(label, x, y - 70); ctx.fillStyle = '#fff'; ctx.fillText(label, x, y - 70); ctx.restore(); };
  const bars = (ctx, u) => { ctx.save(); ctx.translate(120, 160); ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.roundRect(-20, -20, 520, 330, 24); ctx.fill(); ctx.font = '900 30px Nunito, Arial'; ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
    ctx.fillText('ALONE', 0, 50); ctx.fillText('IN A GROUP', 0, 190); ctx.fillStyle = '#2ecc71'; ctx.fillRect(0, 70, 460 * 0.85 * u, 50); ctx.fillStyle = '#e8384f'; ctx.fillRect(0, 210, 460 * 0.31 * u, 50); ctx.restore(); };
  const shots = {
    hook: (t, kk, a) => { k.only(st); hero.visible = red.visible = blue.visible = false; crowd(t); vic.position.set(X, Y, 0); vic.rotation.y = PI / 2; vic.pose(kk > 0.25 ? 'death' : 'idle', kk > 0.25 ? (t - a - 0.6) : t); return k.cam([X - 4.5, 1.8, 6], [X, 0.8, 0], 38, { sky: st.sky }); },
    why: (t, kk) => { k.only(st); hero.visible = red.visible = blue.visible = false; crowd(t); down(t); return k.cam([X + 0.5, 6, 3], [X, 0.3, 0], 44, { sky: st.sky }); },
    study: (t, kk) => { k.only(st); hero.visible = red.visible = blue.visible = false; crowd(t, 0.6); down(t); ov = (ctx) => { k.tint(ctx, '#000', 0.25); bars(ctx, E(Math.min(1, kk * 1.6))); }; return k.cam([X - 3, 1.6, 7], [X, 0.8, 0], 40, { sky: st.sky }); },
    do: (t, kk) => { k.only(st); red.visible = blue.visible = false; crowd(t, 0.4); down(t); hero.position.set(X - 0.9, Y, 1.0); hero.rotation.y = PI / 2; hero.pose('talk', t); ov = (ctx) => k.cross(ctx, t, 0.3 + (t - t) - 99); return k.close(hero, { d: 2.2, side: -0.3, extra: { sky: st.sky } }); },
    point: (t, kk) => { k.only(st); hideC(); down(t); red.visible = blue.visible = true; red.position.set(X + 0.9, Y, 2.0); red.rotation.y = -PI / 2 - 0.9; red.pose(kk > 0.6 ? 'interact' : 'idle', t); blue.position.set(X + 0.9, Y, -1.4); blue.rotation.y = -PI / 2 + 0.6; blue.pose('idle', t);
      hero.position.set(X - 0.6, Y, 0.9); hero.rotation.y = 0.5; hero.pose('interact', t); ov = (ctx) => k.card(ctx, 'YOU, RED JACKET: CALL 999 / 911', { y: 200, bg: '#d0141e', size: 34 }); return k.cam([X - 4.6, 1.8, 2.6], [X + 0.4, 1.0, 1.3], 46, { sky: st.sky }); },
    second: (t, kk) => { k.only(st); hideC(); down(t); red.visible = blue.visible = true; red.position.set(X + 0.9, Y, 2.0); red.rotation.y = -PI / 2 - 0.9; red.pose('talk', t); blue.position.set(X + 0.9, Y, -1.4); blue.rotation.y = -PI / 2 + 0.6; blue.pose(kk > 0.5 ? 'run' : 'idle', t);
      hero.position.set(X - 0.6, Y, 0.9); hero.rotation.y = 2.6; hero.pose('interact', t); ov = (ctx) => k.card(ctx, 'YOU: FIND A DEFIBRILLATOR', { y: 200, bg: '#2f6fd8', size: 36 }); return k.cam([X - 4.6, 1.8, -0.8], [X + 0.4, 1.0, -0.4], 46, { sky: st.sky }); },
    works: (t, kk) => { k.only(st); crowd(t, 0.3); CR.forEach((h, i) => { if (i < 4) { h.position.set(X + Math.cos(i * 1.6) * 2.2, Y, Math.sin(i * 1.6) * 2.2); h.rotation.y = Math.atan2(X - h.position.x, -h.position.z); h.pose('idle', t); } });
      down(t); red.visible = true; red.position.set(X + 1.0, Y, 3.0); red.pose('talk', t); blue.visible = false; hero.position.set(X - 0.9, Y, 1.0); hero.pose('kneel', t); ov = (ctx) => k.tick(ctx, t, -99); return k.cam([X - 4, 3.2, 5], [X, 0.6, 0.3], 42, { sky: st.sky }); },
    cpr: (t, kk) => { k.only(st); hideC(); red.visible = blue.visible = false; down(t); hero.position.set(X - 0.55, Y, 0.1); hero.rotation.y = PI / 2; hero.pose('kneel', t); ov = (ctx) => { k.card(ctx, 'HARD & FAST · CENTRE OF CHEST', { y: 200, bg: '#e8384f', size: 34 }); k.card(ctx, '100–120 PER MINUTE', { y: 310, bg: '#1d3557', size: 38 }); };
      return k.cam([X - 2.6, 1.5, -1.6], [X - 0.3, 0.5, 0.1], 40, { sky: st.sky }); },
    outro: (t, kk, a) => { k.only(st); hero.visible = red.visible = blue.visible = false; crowd(t); vic.position.set(X, Y, 0); vic.rotation.y = PI / 2; vic.pose('idle', t); return k.cam([X - 4.5, 1.8, 6], [X, 0.8, 0], 38, { sky: st.sky }); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: st.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('pop', at('hook', 0.9), { gain: 0.4 }); kit.play('ding', at('works', 0.5), { f: 'E6', gain: 0.3 }); } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/Superhero_Male', 'humans/Superhero_Female', 'humans/ual1'] });
