  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const fence = (S) => { for (let i = 0; i < 7; i++) S.rbox((p) => add(p, [-1.8 + i * 0.6, 0.45, -1.2]), 0.04, 0.45, 0.04, [150, 110, 70], { bevel: 0.2 }); for (const y of [0.35, 0.7]) S.rbox((p) => add(p, [0, y, -1.2]), 1.9, 0.025, 0.02, [150, 110, 70], { bevel: 0.2 }); };
  const ufo = (S, y) => { S.cyl((p) => add(p, [0.6, y, -0.6]), 0.8, 0.1, [190, 196, 206], 24); S.cyl((p) => add(p, [0.6, y + 0.13, -0.6]), 0.35, 0.13, [140, 220, 240], 18); };
  const stars = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(10,14,50,0.55)'; ctx.fillRect(0, 0, W, H_); ctx.fillStyle = '#fff'; for (let i = 0; i < 60; i++) { ctx.globalAlpha = 0.5 + (i % 3) * 0.2; ctx.fillRect((i * 137) % W, (i * 89) % (H_ * 0.45), 3, 3); } ctx.restore(); };
  makeCouch({
    keys: ['cows', 'selfie', 'milk', 'cheese', 'unfair', 'friend', 'bite', 'vegetarian', 'stars', 'star', 'spaceship', 'finally', 'ride', 'wrong', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'street', opt: { signs: ['FARM SHOP', 'MILK', 'EGGS', 'CHEESE'] }, cam: [[0.2, 1.4, 2.4], [0, 0.9, -0.4], [0.2, 1.35, 2.1], [0, 0.9, -0.4]], he: NOONE, she: NOONE, props: (S, t) => { fence(S); cow(S, { x: 0, z: -0.4, s: 1.0, t, look: [0, 0.5] }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.05, 1.25, 0.1], t < V('c1', 'Another') - 0.1 ? 'Oh look.' : 'Another human taking a selfie.', pu(t, first('c1'))) },
      c2: { set: 'street', opt: { signs: ['FARM SHOP', 'MILK', 'EGGS', 'CHEESE'] }, cam: [[0.1, 1.2, 1.4], [0, 0.95, 0.0], [0.1, 1.15, 1.2], [0, 0.95, 0.0]], he: NOONE, she: NOONE, props: (S, t) => cow(S, { x: 0, z: -0.4, s: 1.0, t, mood: 'sad' }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.05, 1.25, 0.1], t < V('c2', 'You') - 0.1 ? 'I make the milk.' : t < V('c2', 'Unfair') - 0.1 ? 'You get the cheese.' : 'Unfair.', pu(t, first('c2'))) },
      n2: { set: 'street', opt: { signs: ['FARM SHOP', 'MILK', 'EGGS', 'CHEESE'] }, cam: [[0.3, 1.5, 2.6], [0, 1.0, -0.5], [0.3, 1.45, 2.3], [0, 1.0, -0.5]], he: NOONE, she: NOONE, props: (S, t) => { fence(S); cow(S, { x: 0.4, z: -0.5, s: 1.0, t, look: [-1, 0] }); },
        extras: (t) => [{ who: 'bro', x: -0.7, z: -0.2, yaw: 0.6, sit: false, arms: t < first('c3') ? 'cheeks' : 'shrug', face: { eyes: 'wide', mouth: 'o' } }],
        over: (ctx, W, H_, t, S) => { if (t > first('c3') - 0.1) thought(ctx, S, [0.45, 1.25, 0.0], "I'm a vegetarian, Kevin.", pu(t, first('c3'))); } },
      n3: { set: 'street', opt: { signs: ['FARM SHOP', 'MILK', 'EGGS', 'CHEESE'] }, cam: [[0.2, 1.0, 1.8], [0, 1.4, -1.0], [0.2, 1.0, 1.6], [0, 1.5, -1.0]], he: NOONE, she: NOONE, props: (S, t) => { fence(S); cow(S, { x: 0, z: -0.4, s: 1.0, t, look: [0, 1] }); },
        over: (ctx, W, H_, t, S) => { stars(ctx, W, H_); thought(ctx, S, [0.05, 1.25, 0.1], t < V('c4', 'One') - 0.1 ? 'Mum said every star is a cow who made it.' : "One day, I'll be up there.", pu(t, first('c4'))); } },
      n4: { set: 'street', opt: { signs: ['FARM SHOP', 'MILK', 'EGGS', 'CHEESE'] }, cam: [[0.2, 1.4, 2.6], [0.3, 1.2, -0.5], [0.2, 1.35, 2.3], [0.3, 1.2, -0.5]], he: NOONE, she: NOONE, shake: V('n4', 'lands'),
        props: (S, t) => { fence(S); ufo(S, H.lerp(3.5, 1.8, H.clamp((t - first('n4')) / 1.2))); cow(S, { x: 0, z: -0.3, y: t > first('c5') ? Math.min(0.8, (t - first('c5')) * 0.4) : 0, s: 1.0, t, look: [1, 1] }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.05, 1.3, 0.2], t < V('c5', 'My') - 0.1 ? 'Finally.' : 'My ride.', pu(t, first('c5'))) },
      cta: { set: 'street', opt: { signs: ['FARM SHOP', 'MILK', 'EGGS', 'CHEESE'] }, cam: [[0.2, 1.4, 2.6], [0.3, 1.4, -0.5], [0.2, 1.4, 2.5], [0.3, 1.4, -0.5]], he: NOONE, she: NOONE, props: (S, t) => { fence(S); ufo(S, 1.9); cow(S, { x: 0, z: -0.3, y: 1.0, s: 0.9, t }); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
