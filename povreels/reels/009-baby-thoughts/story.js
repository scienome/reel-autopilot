  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const BABY = (o) => Object.assign({ who: 'kid', s: 0.55, sit: true, shirt: [250, 220, 120], pants: [250, 220, 120], hair: [90, 60, 40] }, o);
  const chair = (S, x, z) => { S.rbox((p) => add(p, [x, 0.55, z]), 0.24, 0.05, 0.22, [240, 240, 244], { bevel: 0.4 }); for (const sx of [-0.18, 0.18]) for (const sz of [-0.14, 0.14]) S.rbox((p) => add(p, [x + sx, 0.27, z + sz]), 0.02, 0.27, 0.02, [240, 240, 244], { bevel: 0.4 }); };
  makeCouch({
    keys: ['babies', 'face', 'scariest', 'yesterday', 'pooped', 'purpose', 'again', 'tired', 'sleep', 'her', 'kidding', 'party', 'know', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'kitchen', cam: [[0, 1.45, 1.9], [0, 1.15, -0.3], [0, 1.4, 1.6], [0, 1.15, -0.3]], he: NOONE, she: NOONE,
        props: (S) => chair(S, 0, -0.3), extras: (t) => [BABY({ x: 0, z: -0.3, sit: true, face: { eyes: t > first('k1') ? 'wide' : 'happy', mouth: t > first('k1') ? 'o' : 'smile' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 1.35, -0.3], t < V('k1', 'And') - 0.1 ? "Your face is the scariest thing I've ever seen." : 'And I was born yesterday.', pu(t, first('k1'))) },
      n2: { set: 'restaurant', cam: [[0.2, 1.4, 2.0], [0, 1.1, -0.5], [0.2, 1.4, 1.75], [0, 1.1, -0.5]], he: NOONE, she: NOONE,
        props: (S) => chair(S, 0, 0.05), extras: (t) => [{ who: 'bff', x: -0.62, z: -0.75, sit: true, face: { mouth: 'smile' } }, BABY({ x: 0, z: 0.05, face: { eyes: 'half', mouth: 'smirk' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 1.3, 0.05], t < V('k2', 'Look') - 0.1 ? 'I pooped on purpose.' : "Look at me. I'll do it again.", pu(t, first('k2'))) },
      n3: { set: 'bedroom', cam: [[0, 1.45, 2.3], [-0.15, 0.95, -0.5], [0, 1.4, 2.05], [-0.15, 0.95, -0.5]], he: NOONE, she: NOONE, dof: 0.3,
        extras: (t) => [{ who: 'bff', x: -0.85, z: -0.6, sit: true, outfit: 'pajamas', face: { eyes: 'closed', mouth: 'flat' }, head: { tilt: 0.3 } }, BABY({ x: 0.5, z: -0.45, outfit: 'pajamas', face: { eyes: t > first('k3') ? 'open' : 'closed', mouth: 'smile', look: [-1, 0] } })],
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.5, 1.2, -0.45], t < V('k3', 'Tonight') - 0.1 ? 'She looks so tired.' : "Tonight, I'll sleep. For her.", pu(t, first('k3'))); } },
      n4: { set: 'bedroom', cam: [[0, 1.4, 2.05], [-0.15, 0.95, -0.5], [0, 1.4, 1.95], [-0.15, 0.95, -0.5]], he: NOONE, she: NOONE, shake: first('k4'),
        extras: (t) => [{ who: 'bff', x: -0.85, z: -0.6, sit: true, outfit: 'pajamas', arms: t > first('k4') ? 'head' : 'rest', face: { eyes: t > first('k4') ? 'wide' : 'closed', mouth: t > first('k4') ? 'o' : 'flat' } }, BABY({ x: 0.5, z: -0.45, outfit: 'pajamas', arms: t > first('k4') ? 'cheer' : 'rest', face: { eyes: t > first('k4') ? 'closed' : 'open', mouth: t > first('k4') ? 'open' : 'smile' } })],
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.5, 1.2, -0.45], 'Just kidding. PARTY TIME!', pu(t, first('k4'))); } },
      cta: { set: 'kitchen', cam: [[0, 1.45, 1.8], [0, 1.15, -0.3], [0, 1.45, 1.7], [0, 1.15, -0.3]], he: NOONE, she: NOONE,
        props: (S) => chair(S, 0, -0.3), extras: [BABY({ x: 0, z: -0.3, arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } })],
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
