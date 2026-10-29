  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const warm = (ctx, W, H_, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = 0.25 * a; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const table = (S) => { S.rbox((p) => add(p, [0, 0.8, -0.4]), 0.7, 0.04, 0.4, [220, 226, 232], { bevel: 0.3, gloss: 0.6 }); S.rbox((p) => add(p, [0, 0.4, -0.4]), 0.06, 0.4, 0.06, [160, 166, 176], { bevel: 0.3 }); };
  const carrier = (S, x, z) => { S.rbox((p) => add(p, [x, 0.25, z]), 0.32, 0.25, 0.26, [120, 170, 220], { bevel: 0.25 }); for (let i = 0; i < 5; i++) S.rbox((p) => add(p, [x - 0.2 + i * 0.1, 0.25, z + 0.27]), 0.012, 0.2, 0.01, [240, 240, 244], { bevel: 0.2 }); };
  const OLDCAT = [150, 140, 136];
  makeCouch({
    keys: ['pets', 'vet', 'ride', 'park', 'beach', 'smell', 'loved', 'nail', 'haunt', 'grandchildren', 'long', 'face', 'naps', 'tonight', 'bed', 'tooth', 'hating', 'dramatic', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'car', cam: [[0.62, 1.55, 1.2], [0.62, 1.0, -0.5], [0.62, 1.5, 1.0], [0.62, 1.0, -0.5]], he: NOONE, she: NOONE, props: (S, t) => dog(S, { x: 0.62, y: 0.5, z: -0.5, s: 1.0, col: [214, 160, 92], mood: 'happy', tongue: true, t }) },
      d1: { set: 'car', cam: [[0.62, 1.4, 0.9], [0.62, 1.0, -0.5], [0.62, 1.4, 0.75], [0.62, 1.0, -0.5]], he: NOONE, she: NOONE, dof: 0.25,
        props: (S, t) => dog(S, { x: 0.62, y: 0.5, z: -0.5, s: 1.0, col: [214, 160, 92], mood: t > V('d1', 'Wait') - 0.1 ? 'sad' : 'happy', tongue: t < V('d1', 'Wait'), look: t > V('d1', 'Wait') ? [1, 0] : [0, 0], t }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.62, 1.4, -0.5], t < V('d1', 'Wait') - 0.1 ? 'Car ride! Park? Beach?' : 'Wait. I know this smell.', pu(t, first('d1'))) },
      d2: { set: 'mall', cam: [[0.05, 1.7, 2.0], [0, 1.1, -0.4], [0.05, 1.6, 1.7], [0, 1.1, -0.4]], he: NOONE, she: NOONE,
        props: (S, t) => { table(S); dog(S, { x: 0, y: 0.84, z: -0.4, s: 0.95, col: [214, 160, 92], mood: 'sad', t }); },
        extras: [{ who: 'waiter', x: 0.9, z: -0.7, yaw: -0.5, sit: false, face: { mouth: 'smile' } }],
        over: (ctx, W, H_, t, S) => { if (t < first('n2') - 0.1) thought(ctx, S, [0, 1.7, -0.4], t < V('d2', 'Tell') - 0.1 ? 'No. No no no.' : 'Tell my family I loved them.', pu(t, first('d2'))); } },
      c1: { set: 'mall', cam: [[0.3, 1.2, 1.6], [0.3, 0.4, 0.0], [0.3, 1.15, 1.4], [0.3, 0.4, 0.0]], he: NOONE, she: NOONE, dof: 0.25,
        props: (S, t) => { carrier(S, 0.3, 0.0); cat(S, { x: 0.3, y: 0.0, z: 0.05, s: 0.6, col: [236, 160, 90], mood: 'mad', t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.3, 0.75, 0.0], "Touch me and I'll haunt your grandchildren.", pu(t, first('c1'))) },
      n3: { set: 'mall', cam: [[0.05, 1.6, 1.6], [0, 1.0, -0.4], [0.05, 1.55, 1.35], [0, 1.0, -0.4]], he: NOONE, she: NOONE, dof: 0.3,
        props: (S, t) => { table(S); cat(S, { x: 0, y: 0.84, z: -0.4, s: 1.0, col: OLDCAT, mood: t > first('c2') ? 'sad' : 'calm', look: [0, -0.3], t }); },
        extras: [{ who: 'waiter', x: 0.85, z: -0.7, yaw: -0.5, sit: false, face: { mouth: 'flat', brows: 'worried' } }],
        over: (ctx, W, H_, t, S) => { warm(ctx, W, H_, H.clamp((t - first('c2')) / 0.8)); const txt = t < V('c2', "I've") - 0.1 ? "Don't make that face." : t < first('c3') - 0.1 ? "I've had a good life. Mostly naps." : t < V('c3', 'On') - 0.1 ? 'Just stay with me tonight.' : 'On the bed. Not the floor.'; if (t > first('c2') - 0.1) thought(ctx, S, [0, 1.5, -0.4], txt, pu(t, first('c2'))); } },
      n4: { set: 'mall', cam: [[0.05, 1.6, 1.8], [0, 1.0, -0.4], [0.05, 1.6, 1.6], [0, 1.0, -0.4]], he: NOONE, she: NOONE,
        props: (S, t) => { table(S); cat(S, { x: 0, y: 0.84, z: -0.4, s: 1.0, col: OLDCAT, mood: t > first('c4') ? 'mad' : 'happy', t }); },
        extras: [{ who: 'waiter', x: 0.85, z: -0.7, yaw: -0.5, sit: false, arms: 'cheer', face: { mouth: 'open', eyes: 'happy' } }],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 1.5, -0.4], 'Great. Back to hating you.', pu(t, first('c4'))) },
      cta: { cam: [[0.05, 1.45, 2.2], [0, 1.15, -0.3], [0.05, 1.4, 2.0], [0, 1.15, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => { dog(S, { x: -0.3, y: 0.47, z: -0.32, s: 1.0, col: [214, 160, 92], mood: 'sad', t }); cat(S, { x: 0.35, y: 0.47, z: -0.32, s: 0.95, col: OLDCAT, mood: 'smug', look: [-1, 0], t }); },
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
