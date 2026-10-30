  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const tank = (S, t, fo = {}) => { S.rbox((p) => add(p, [0, 0.82, -0.3]), 0.5, 0.04, 0.3, [80, 60, 50], { bevel: 0.2 }); S.rbox((p) => add(p, [0, 1.17, -0.42]), 0.48, 0.32, 0.01, [120, 200, 230], { bevel: 0.1 });
    S.rbox((p) => add(p, [0, 0.88, -0.3]), 0.46, 0.03, 0.26, [230, 210, 150], { bevel: 0.2 }); S.rbox((p) => add(p, [0.25, 1.0, -0.33]), 0.07, 0.1, 0.07, [190, 190, 200], { bevel: 0.2 }); S.rbox((p) => add(p, [0.25, 1.13, -0.33]), 0.03, 0.04, 0.03, [190, 190, 200], { bevel: 0.2 });
    fish(S, Object.assign({ x: -0.05 + Math.sin(t * 0.8) * 0.12, y: 1.15, z: -0.25, s: 1.1, t }, fo)); };
  makeCouch({
    keys: ['goldfish', 'castle', 'three', 'seconds', 'two', 'years', 'who', 'week', 'remember', 'you', 'home', 'face', 'everything', 'nothing'],
    shots: ({ V, first }) => ({
      hook: { cam: [[0, 1.4, 1.6], [0, 1.1, -0.3], [0, 1.35, 1.3], [0, 1.1, -0.3]], he: NOONE, she: NOONE, props: (S, t) => tank(S, t),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.05, 1.3, -0.25], 'Wow! A castle!', pu(t, first('f1'))) },
      n1: { cam: [[0.1, 1.25, 0.9], [0, 1.12, -0.3], [0.1, 1.22, 0.8], [0, 1.12, -0.3]], he: NOONE, she: NOONE, props: (S, t) => tank(S, t, { mood: 'wow' }),
        over: (ctx, W, H_, t, S) => { if (t < first('f2')) timeCard(ctx, t, first('n1') - 0.1, '3 SECONDS LATER'); thought(ctx, S, [-0.05, 1.3, -0.25], 'Wow! A castle!', pu(t, first('f2'))); } },
      n2: { cam: [[0, 1.4, 1.6], [0, 1.1, -0.3], [0, 1.4, 1.5], [0, 1.1, -0.3]], he: NOONE, she: NOONE, props: (S, t) => tank(S, t),
        over: (ctx, W, H_, t, S) => { badge(ctx, S, [0.4, 1.2, -0.3], '2 YRS', 'OF CASTLES', pu(t, V('n2', 'two'))); thought(ctx, S, [-0.05, 1.3, -0.25], t < V('f3', 'Wait') - 0.1 ? 'Wow! A castle!' : 'Wait. Who are you?', pu(t, first('f3'))); } },
      n3: { cam: [[0.1, 1.25, 0.9], [0, 1.12, -0.3], [0.1, 1.22, 0.75], [0, 1.12, -0.3]], he: NOONE, she: NOONE, props: (S, t) => tank(S, t, { look: [0, 0.4] }),
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); if (t < first('f4')) timeCard(ctx, t, first('n3') - 0.1, '7 DAYS ALONE'); thought(ctx, S, [-0.05, 1.3, -0.25], t < V('f4', 'I') - 0.1 ? "Where's the big face?" : t < V('f4', 'But') - 0.1 ? "I don't remember much." : 'But I remember you.', pu(t, first('f4'))); },
        fx: [{ k: 'hearts', at: V('f4', 'remember', 2), n: 4, y: 640 }] },
      n4: { cam: [[0, 1.4, 1.6], [0, 1.1, -0.3], [0, 1.35, 1.2], [0, 1.1, -0.3]], he: NOONE, she: NOONE, props: (S, t) => tank(S, t, { mood: 'wow' }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.05, 1.3, -0.25], t < V('f5', 'Wow') - 0.1 ? 'BIG FACE!' : 'Wow! A castle!', pu(t, first('f5'))), fx: [{ k: 'hearts', at: first('f5'), n: 5, y: 600 }] },
      cta: { cam: [[0, 1.4, 1.6], [0, 1.1, -0.3], [0, 1.4, 1.5], [0, 1.1, -0.3]], he: NOONE, she: NOONE, props: (S, t) => tank(S, t), fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
