  // ==================== POV 001 "You can hear what dogs think" ====================
  // The camera is YOU: nobody from the couple is shown, dogs look into the lens and their thoughts pop up as clouds.
  // an expressive sitting dog facing +z (rotated by yaw): o = { x, y, z, yaw, s, col, belly, ears: 'flop'|'up'|'big',
  //   mood: 'calm'|'sad'|'smug'|'mad'|'happy', tongue, tilt (head roll), look [dx, dy], fluffy (poodle puffs), grey (old muzzle) }
  const toaster = (S) => { S.rbox((p) => add(p, [-0.55, 1.08, -0.98]), 0.17, 0.11, 0.1, [200, 204, 212], { bevel: 0.5, gloss: 0.7 }); S.rbox((p) => add(p, [-0.55, 1.2, -0.98]), 0.1, 0.03, 0.02, [180, 140, 90], { bevel: 0.4 }); };
  const NOONE = { hide: true };
  const pu = (t, at) => popU(t, at, 0.3);
  makeCouch({
    keys: ['only', 'dogs', 'think', 'toaster', 'money', 'opinions', 'pug', 'ugly', 'husky', 'hot', 'chihuahua', 'dead', 'poodle', 'everything', 'twice', 'leak', 'old', 'scared', 'stay', 'cry', 'works', 'bacon', 'power', 'two'],
    shots: ({ V, first }) => ({
      // your dog on the couch, staring straight into you
      hook: { cam: [[0.05, 1.5, 2.6], [0, 1.27, -0.3], [0.03, 1.35, 1.7], [0, 1.27, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => dog(S, { x: 0, y: 0.47, z: -0.32, s: 1.1, mood: 'calm', tilt: t > V('hook', 'think') ? 0.25 : 0, t }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 1.35, -0.3], '...', pu(t, V('hook', 'think'))) },
      day1: { set: 'kitchen', cam: [[0.3, 1.6, 1.8], [-0.1, 0.97, -0.4], [0.25, 1.55, 1.5], [-0.1, 0.92, -0.4]], he: NOONE, she: NOONE,
        props: (S, t) => { toaster(S); dog(S, { x: 0.25, z: -0.35, s: 1.0, mood: t > V('dog1', 'toaster') - 0.2 ? 'smug' : 'calm', t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.25, 0.85, -0.35], 'He talks to the toaster like it owes him money.', pu(t, first('dog1'))) },
      street: { set: 'street', cam: [[0, 1.5, 3.1], [0, 0.87, -0.2], [0, 1.45, 2.8], [0, 0.87, -0.2]], he: NOONE, she: NOONE,
        props: (S, t) => { dog(S, { x: -0.6, z: -0.2, s: 0.65, col: [214, 180, 130], earCol: [60, 46, 40], belly: [60, 46, 40], mood: 'mad', t });
          dog(S, { x: 0.05, z: -0.35, s: 1.15, col: [130, 136, 146], belly: [240, 240, 244], ears: 'up', mood: t > first('husky') - 0.2 ? 'smug' : 'calm', tongue: t > first('husky'), t });
          dog(S, { x: 0.62, z: -0.1, s: 0.45, col: [222, 186, 140], ears: 'big', mood: 'mad', t, look: [-1, 0] }); },
        over: (ctx, W, H_, t, S) => { const a = first('pug'), b = first('husky'), c = first('chi');
          if (t < b - 0.1) thought(ctx, S, [-0.6, 0.6, -0.2], 'Ugly.', pu(t, a)); else if (t < c - 0.1) thought(ctx, S, [0.05, 1.15, -0.35], 'Hot.', pu(t, b)); else thought(ctx, S, [0.62, 0.45, -0.1], 'I will end you.', pu(t, c), -60); } },
      // the neighbour's poodle on the pavement; the plumber leaving with his toolbox, very relaxed
      neighbour: { set: 'street', cam: [[0.2, 1.5, 2.4], [0.2, 1.02, -0.3], [0.1, 1.45, 2.0], [0.2, 1.02, -0.3]], he: NOONE, she: NOONE,
        extras: (t) => [{ who: 'delivery', x: 0.95, z: -1.15, yaw: -0.6, sit: false, cap: [40, 90, 170], face: { mouth: 'smile', eyes: 'happy' }, hide: t < V('poodle', 'plumber') - 0.2 }],
        props: (S, t) => dog(S, { x: -0.25, z: -0.2, s: 0.95, col: [246, 244, 240], fluffy: true, mood: 'smug', t }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.25, 1.0, -0.2], t < V('poodle', 'leak') - 0.1 ? 'The plumber came twice.' : 'There was no leak.', pu(t, first('poodle'))),
        fx: [{ k: 'stamp', text: 'NO LEAK', x: 360, y: 1010, at: V('poodle', 'leak'), col: '#ffd23f' }] },
      // 3 a.m.: your old grey-muzzled dog on the bed, right next to you
      night: { set: 'bedroom', cam: [[1.3, 1.15, 1.6], [0.05, 1.27, -0.45], [1.15, 1.1, 1.35], [0.05, 1.3, -0.45]], he: NOONE, she: NOONE, dof: 0.35,
        props: (S, t) => dog(S, { x: 0.05, y: 0.45, z: -0.45, yaw: 0.5, s: 1.05, col: [176, 130, 84], grey: true, mood: 'sad', tilt: 0.15, t: 0 }),
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore();
          thought(ctx, S, [0.05, 1.35, -0.45], t < V('dog2', 'But') - 0.1 ? "I'm old. I'm scared." : "But I'll stay until you're okay.", pu(t, first('dog2'))); } },
      // the same bed, the lights on: he is fine, very fine
      twist: { set: 'bedroom', cam: [[1.15, 1.1, 1.35], [0.05, 1.3, -0.45], [1.0, 1.08, 1.2], [0.05, 1.32, -0.45]], he: NOONE, she: NOONE, twist: first('dog3'),
        props: (S, t) => dog(S, { x: 0.05, y: 0.45, z: -0.45, yaw: 0.5, s: 1.05, col: [176, 130, 84], grey: true, mood: t > first('dog3') - 0.15 ? 'smug' : 'sad', tongue: t > V('dog3', 'Bacon'), t }),
        over: (ctx, W, H_, t, S) => { if (t < first('dog3') - 0.15) { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
          thought(ctx, S, [0.05, 1.35, -0.45], t < V('dog3', 'Bacon') - 0.1 ? 'Works every time.' : 'Bacon tomorrow.', pu(t, first('dog3'))); } },
      cta: { cam: [[0.05, 1.45, 2.0], [0, 1.27, -0.3], [0.05, 1.4, 1.8], [0, 1.27, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => dog(S, { x: 0, y: 0.47, z: -0.32, s: 1.1, mood: 'happy', tongue: true, tilt: -0.25, t }),
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
