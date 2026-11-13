// re-render: flicker fix + Kenney toy scenery (13 Nov 2026)
// 204 cinestory3d (story3d.js): the de Havilland Comet and rounded windows (Withey 1997; 1955 Court of Inquiry). Scroll stopper: a square hole tearing open at its corners, RIP!... it's an aircraft window test. Gag: the water-tank test, SPLOOSH.
STORY((k) => {
  const { T, M, PI } = k; const sp = k.LIB.place.street({}); const sk = new T.Group(); k.place(sk);
  const plane = new T.Group(); const W = M('#f4f4f4', 0.4, 0.2), B = M('#1f4fa8', 0.5);
  const fus = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 7, 28), W); fus.rotation.z = PI / 2; plane.add(fus); const nose = new T.Mesh(new T.SphereGeometry(0.5, 24, 16, 0, PI * 2, 0, PI / 2), W); nose.rotation.z = -PI / 2; nose.position.x = 3.5; plane.add(nose);
  const tailc = new T.Mesh(new T.ConeGeometry(0.5, 1.4, 24), W); tailc.rotation.z = PI / 2; tailc.position.x = -4.2; plane.add(tailc); const wing = new T.Mesh(new T.BoxGeometry(1.6, 0.08, 7), W); wing.position.set(0.2, -0.15, 0); plane.add(wing);
  const fin = new T.Mesh(new T.BoxGeometry(1.0, 1.2, 0.08), B); fin.position.set(-4.3, 0.8, 0); plane.add(fin); const stripe = new T.Mesh(new T.CylinderGeometry(0.505, 0.505, 6.6, 28, 1, true, 0.9, 0.3), B); stripe.rotation.z = PI / 2; plane.add(stripe);
  const wins = []; for (let i = 0; i < 9; i++) { const w = new T.Mesh(new T.BoxGeometry(0.24, 0.2, 0.02), M('#1a2533', 0.2, 0.6)); w.position.set(2.4 - i * 0.62, 0.12, 0.5); plane.add(w); wins.push(w); }
  sk.add(plane); const tank = new T.Mesh(new T.BoxGeometry(9.5, 3.2, 3.2), new T.MeshStandardMaterial({ color: '#3aa8e8', transparent: true, opacity: 0.35, roughness: 0.1 })); sk.add(tank);
  const eng = k.add(k.LIB.human({ body: 'm', top: '#f2f2ee', bottom: '#3a3a40', hair: '#8a8a8a' }), [2, -1.6, 2.6], -0.4, sk);
  let ov = null; const base = (round) => { k.only(sk); tank.visible = false; eng.visible = false; plane.position.set(0, 0, 0); plane.rotation.set(0, 0, 0); wins.forEach((w) => { w.scale.set(1, 1, 1); w.geometry = round ? RG : SG; }); };
  const SG = wins[0].geometry, RG = new T.CylinderGeometry(0.11, 0.11, 0.02, 20); RG.rotateX(PI / 2); RG.scale(1.0, 1.15, 1);
  const hole = (ctx, t, round, rip) => { ctx.save(); ctx.fillStyle = '#c8ccd2'; ctx.beginPath(); ctx.roundRect(110, 360, 500, 520, 20); ctx.fill(); ctx.fillStyle = '#1a2533'; ctx.beginPath(); if (round) ctx.roundRect(260, 500, 200, 240, 90); else ctx.rect(260, 500, 200, 240); ctx.fill();
    if (!round) { ctx.strokeStyle = '#e8384f'; ctx.lineWidth = 6; [[260, 500, -1, -1], [460, 500, 1, -1], [260, 740, -1, 1], [460, 740, 1, 1]].forEach(([x, y, dx, dy]) => { ctx.beginPath(); ctx.moveTo(x, y); const L = rip * 120; ctx.lineTo(x + dx * L * 0.6, y + dy * L * 0.4); ctx.lineTo(x + dx * L, y + dy * L * 0.8); ctx.stroke(); ctx.fillStyle = `rgba(232,56,79,${0.25 + 0.2 * Math.sin(t * 6)})`; ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fill(); }); }
    else { ctx.strokeStyle = '#2ecc71'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.roundRect(260 - 20 - i * 18, 500 - 20 - i * 18, 240 + i * 36, 280 + i * 36, 110 + i * 18); ctx.stroke(); } } ctx.restore(); };
  const fly = (t) => { plane.position.y = Math.sin(t * 0.8) * 0.15; plane.rotation.x = Math.sin(t * 0.5) * 0.05; };
  const shots = {
    hook: (t, kk) => { base(false); fly(t); ov = (ctx) => { hole(ctx, t, false, Math.min(1, kk * 1.6)); k.boom(ctx, (kk - 0.6) * 2.5, 360, 620, 'RIP!'); }; return k.cam([1, 0.8, 7], [0, 0, 0], 46); },
    comet: (t, kk) => { base(false); fly(t); ov = (ctx) => k.card(ctx, '1952 · DE HAVILLAND COMET', { y: 200, bg: '#1f4fa8', size: 38 }); return k.cam([5 - kk * 4, 1.2, 6], [0, 0, 0], 46); },
    crash: (t, kk) => { base(false); fly(t); ov = (ctx) => { k.tint(ctx, '#1a1a1a', 0.35); k.card(ctx, '1954 · TWO BROKE UP IN THE AIR', { y: 200, bg: '#1a1a1a', size: 34 }); }; return k.cam([-3, 1.6, 7], [0, 0, 0], 46); },
    test: (t, kk) => { base(false); tank.visible = true; eng.visible = true; eng.pose('talk', t); plane.position.y = Math.sin(t * 3) * 0.08; ov = (ctx) => { k.card(ctx, 'WATER TANK · UP, DOWN, AGAIN', { y: 200, bg: '#1f8fd8', size: 34 }); k.boom(ctx, ((t * 0.5) % 1) * 0.9 - 0.1, 520, 460, 'SPLOOSH!'); }; return k.cam([3, 0.4, 9], [0, -0.4, 0], 50); },
    crack: (t, kk) => { base(false); ov = (ctx) => { hole(ctx, t, false, kk); k.card(ctx, 'CORNERS = STRESS PILES UP', { y: 200, bg: '#e8384f', size: 36 }); }; return k.cam([1, 0.8, 7], [0, 0, 0], 46); },
    round: (t, kk) => { base(true); ov = (ctx) => { hole(ctx, t, true, 0); k.card(ctx, 'ROUND = STRESS SPREADS OUT', { y: 200, bg: '#2a9d4a', size: 36 }); }; return k.cam([1, 0.8, 7], [0, 0, 0], 46); },
    now: (t, kk) => { base(true); fly(t); ov = (ctx) => k.card(ctx, 'WINDOWS · DOORS · HATCHES', { y: 200, bg: '#2a9d4a', size: 36 }); return k.cam([1.5, 0.3, 2.2], [0.8, 0.1, 0.4], 44); },
    outro: (t, kk) => { base(true); fly(t); ov = (ctx) => k.big(ctx, 'ROUND = SAFE. ✈️', { y: 240, size: 60, col: '#ffd23f' }); return k.cam([6 * Math.cos(kk), 1.5, 6 * Math.sin(kk) + 2], [0, 0, 0], 46); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: '#9fd0ff', over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/Superhero_Male', 'humans/ual1'] });
