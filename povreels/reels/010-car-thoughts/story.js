  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const dashEyes = (ctx, S, t, mood) => { const p = S.proj([0, 0.95, 0.42]); if (p[2] < 0.2) return; ctx.save(); ctx.translate(p[0], p[1]); for (const sd of [-1, 1]) { ctx.fillStyle = '#fff6c8'; ctx.shadowColor = '#ffe080'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(sd * 70, 0, 34, mood === 'sad' ? 16 : 26, 0, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#1c1a22'; ctx.beginPath(); ctx.arc(sd * 70 + Math.sin(t * 0.7) * 6, 2, 9, 0, TAU); ctx.fill(); if (mood === 'mad' || mood === 'sad') { ctx.lineWidth = 8; ctx.strokeStyle = '#1c1a22'; ctx.beginPath(); ctx.moveTo(sd * 40, mood === 'mad' ? -34 : -26); ctx.lineTo(sd * 100, mood === 'mad' ? -22 : -36); ctx.stroke(); } } ctx.restore(); };
  const redCar = (S, sale) => { S.rbox((p) => add(p, [0, 0.42, -0.4]), 1.1, 0.25, 0.48, [200, 60, 50], { bevel: 0.35 }); S.rbox((p) => add(p, [-0.1, 0.78, -0.4]), 0.6, 0.2, 0.44, [200, 60, 50], { bevel: 0.4 }); S.rbox((p) => add(p, [-0.1, 0.79, -0.4]), 0.56, 0.15, 0.45, [150, 200, 240], { bevel: 0.4 });
          for (const [x, z] of [[-0.7, -0.05], [0.7, -0.05], [-0.7, -0.75], [0.7, -0.75]]) S.cyl((p) => add(rotX(p, Math.PI / 2), [x, 0.2, z]), 0.2, 0.12, [30, 30, 34], 14);
          if (sale) S.rbox((p) => add(p, [0.6, 1.25, 0.05]), 0.3, 0.16, 0.02, [255, 230, 80], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#c0182a'; c.font = `900 ${h * 0.55}px sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('FOR SALE', w / 2, h / 2); } }); };
  const CAR = [[-0.2, 1.75, 1.55], [0, 1.0, 0.3], [-0.2, 1.7, 1.35], [0, 1.0, 0.3]];
  makeCouch({
    keys: ['car', 'thinks', 'parking', 'bumper', 'back', 'seat', 'therapy', 'selling', 'road', 'cried', 'receipt', 'fine', 'keep', 'wash', 'animal', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'car', cam: CAR, he: NOONE, she: NOONE, over: (ctx, W, H_, t, S) => dashEyes(ctx, S, t, 'calm') },
      a1: { set: 'car', cam: CAR, he: NOONE, she: NOONE, shake: V('a1', 'parking'), over: (ctx, W, H_, t, S) => { dashEyes(ctx, S, t, 'mad'); thought(ctx, S, [0, 1.15, 0.42], t < V('a1', 'I') - 0.1 ? 'You call that parallel parking?' : 'I have feelings. And a bumper.', pu(t, first('a1'))); } },
      n2: { set: 'street', cam: [[0.9, 1.5, 3.2], [0, 0.8, -0.4], [0.8, 1.45, 2.9], [0, 0.8, -0.4]], he: NOONE, she: NOONE,
        props: (S) => redCar(S, false),
        extras: (t) => [{ who: 'bro', x: 0.5, z: -0.9, yaw: -0.3, sit: false, arms: t < first('a2') ? 'cheer' : 'rest', face: { eyes: 'happy', mouth: 'grin' } }],
        over: (ctx, W, H_, t, S) => { if (t > first('a2') - 0.1) { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } thought(ctx, S, [0, 1.1, -0.4], t < V('a2', 'I') - 0.1 ? 'What happened in the back seat stays in the back seat.' : 'I need therapy.', pu(t, first('a2'))); } },
      n3: { set: 'street', cam: [[0.8, 1.6, 3.6], [0, 0.8, -0.4], [0.7, 1.55, 3.2], [0, 0.8, -0.4]], he: NOONE, she: NOONE,
        props: (S) => redCar(S, true),
        over: (ctx, W, H_, t, S) => { const k = t < V('a3', 'The') - 0.1 ? 'Remember the road trips?' : t < V('a3', 'I') - 0.1 ? 'The night you cried at the gas station?' : t < first('a4') - 0.1 ? 'I kept the receipt.' : "Go on. Sell me. I'll be fine.";
          if (t > first('a3') - 0.1) { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } thought(ctx, S, [0, 1.1, -0.4], k, pu(t, first('a3'))); } },
      n4: { set: 'car', cam: CAR, he: NOONE, she: NOONE, over: (ctx, W, H_, t, S) => { dashEyes(ctx, S, t, t > first('a5') ? 'mad' : 'calm'); thought(ctx, S, [0, 1.15, 0.42], 'Good. Now wash me, you animal.', pu(t, first('a5'))); },
        fx: [{ k: 'hearts', at: V('n4', 'keep'), n: 5, y: 620 }] },
      cta: { set: 'car', cam: CAR, he: NOONE, she: NOONE, over: (ctx, W, H_, t, S) => dashEyes(ctx, S, t, 'calm'), fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
