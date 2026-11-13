// re-render: character flicker fix (13 Nov 2026)
// 160 cinestory3d (story3d.js): horses cannot vomit (Merck Veterinary Manual; AAEP colic signs). Scroll stopper: a see-through horse with a one-way valve snapping shut.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const fm = k.farm();
  const h = k.add(k.LIB.animal('horse', { h: 1.7 }), [0, 0, 0], PI / 2, fm), wild = [0, 1, 2].map((i) => k.add(k.LIB.animal(i % 2 ? 'horse_white' : 'horse', { h: 1.65 }), [0, 0, 0], 0, fm));
  const vet = k.add(k.LIB.human({ body: 'f', top: '#2f8a6a', bottom: '#2a2f3a', hair: '#3b2414', hairStyle: 'bun' }), [0, 0, 0], 0, fm);
  const apple = new T.Mesh(new T.SphereGeometry(0.06, 16, 12), M('#d0141e', 0.5)); fm.add(apple);
  let ov = null; const xray = (ctx, t, mode) => { ctx.save(); ctx.translate(360, 640); ctx.fillStyle = 'rgba(8,16,32,0.86)'; ctx.beginPath(); ctx.roundRect(-320, -380, 640, 720, 30); ctx.fill();
    ctx.strokeStyle = '#7fd0ff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-280, -200); ctx.bezierCurveTo(-200, -260, -60, -160, 40, -60); ctx.lineTo(60, 60); ctx.stroke(); // throat to stomach
    ctx.fillStyle = mode === 'swell' ? 'rgba(255,90,60,0.85)' : 'rgba(255,170,120,0.8)'; const r = mode === 'swell' ? 150 + Math.sin(t * 3) * 10 : 120; ctx.beginPath(); ctx.ellipse(120, 140, r, r * 0.75, -0.3, 0, 7); ctx.fill();
    const shut = mode === 'valve' ? (Math.sin(t * 3) > 0 ? 1 : 0.4) : 1; ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(55, 50, 34, 18 * shut, -0.9, 0, 7); ctx.fill(); // valve
    ctx.font = '900 30px Nunito, Arial'; ctx.fillStyle = '#ffd23f'; ctx.textAlign = 'left'; ctx.fillText('VALVE', -40, 110); ctx.fillStyle = '#fff'; ctx.fillText('STOMACH', 80, 320);
    if (mode === 'valve') { ctx.strokeStyle = '#e8384f'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(80, 0); ctx.lineTo(10, -70); ctx.moveTo(10, -70); ctx.lineTo(10, -30); ctx.moveTo(10, -70); ctx.lineTo(50, -70); ctx.stroke(); k.cross && 0; }
    if (mode === 'angle') { ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(55, 50, 70, -2.2, -0.6); ctx.stroke(); }
    ctx.restore(); if (mode === 'valve') k.cross(ctx, t, -99); };
  const stand = (t) => { h.position.set(0, 0, 0); h.rotation.y = PI / 2; h.pose('idle', t); };
  const base = () => { k.only(fm); wild.forEach((x) => { x.visible = false; }); vet.visible = false; apple.visible = false; h.visible = true; };
  const shots = {
    hook: (t, kk) => { base(); stand(t); ov = (ctx) => xray(ctx, t, 'valve'); return k.cam([0.6, 1.4, 4.2], [0, 1.2, 0], 40, { sky: fm.sky }); },
    eat: (t, kk) => { base(); h.position.set(0, 0, 0); h.rotation.y = PI / 2; h.pose('eat', t); apple.visible = kk < 0.6; apple.position.set(1.2, 0.08, 0); ov = (ctx) => { if (kk > 0.5) k.card(ctx, 'NO GOING BACK', { y: 200, bg: '#e8384f' }); }; return k.close(h, { d: 3.4, side: -0.6, h: 0.5, look: 0.3 }); },
    inside: (t, kk) => { base(); stand(t); ov = (ctx) => xray(ctx, t, 'valve'); return k.cam([0.6, 1.4, 4.2], [0, 1.2, 0], 40, { sky: fm.sky }); },
    angle: (t, kk) => { base(); stand(t); ov = (ctx) => xray(ctx, t, kk > 0.5 ? 'swell' : 'angle'); return k.cam([0.6, 1.4, 4.2], [0, 1.2, 0], 40, { sky: fm.sky }); },
    why: (t, kk) => { base(); h.visible = false; wild.forEach((x, i) => { x.visible = true; k.walk(x, [-10 + i * 1.5, 0, 6 - i * 1.2], [12 + i * 1.5, 0, 6 - i * 1.2], (t * 0.08 + i * 0.05) % 1, 'gallop', t + i * 0.3); }); return k.cam([0, 1.4, 14], [0, 0.9, 5], 44, { sky: fm.sky }); },
    danger: (t, kk) => { base(); h.position.set(0, 0, 0); h.rotation.y = PI / 2; h.pose('death', 99); ov = (ctx) => { xray(ctx, t, 'swell'); k.card(ctx, 'COLIC', { y: 200, bg: '#e8384f' }); }; return k.cam([0.6, 1.6, 5], [0, 0.6, 0], 40, { sky: fm.sky }); },
    vet: (t, kk) => { base(); h.position.set(0, 0, 0); h.rotation.y = PI / 2; h.pose('hit', 0.6); vet.visible = true; vet.position.set(-0.4, 0, 1.4); vet.rotation.y = PI - 0.3; vet.pose(kk > 0.5 ? 'talk' : 'idle', t);
      ov = (ctx) => { ['PAWING', 'ROLLING', 'LOOKING AT BELLY'].forEach((s, i) => k.card(ctx, s, { t: kk * 10, at: i * 1.4, y: 180 + i * 100, bg: '#7a3ad8', size: 40 })); }; return k.cam([2.6, 1.6, 5], [0, 1, 0.4], 40, { sky: fm.sky }); },
    outro: (t, kk) => { base(); stand(t); ov = (ctx) => xray(ctx, t, 'valve'); return k.cam([0.6, 1.4, 4.2], [0, 1.2, 0], 40, { sky: fm.sky }); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: fm.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('click', at('hook', 0.5), { gain: 0.4 }); kit.play('click', at('inside', 0.8), { gain: 0.4 }); } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'animals/horse', 'animals/horse_white', 'humans/Superhero_Female', 'humans/ual1', 'props/hay', 'buildings/cottage', 'buildings/village_house', 'buildings/house_v2', 'buildings/well', 'buildings/fence', 'nature/tree_oak', 'nature/tree_maple'] });
