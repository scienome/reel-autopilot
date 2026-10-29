const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const KEVIN = [92, 92, 100], NEW = [236, 160, 90];
  makeCouch({
    keys: ['cats', 'sleep', 'face', 'second', 'favourite', 'eye', 'Kevin', 'job', 'floor', 'chest', 'affection', 'heat', 'phone', 'two'],
    shots: ({ V, first }) => ({
      hook: { cam: [[0.05, 1.5, 2.4], [0, 1.25, -0.3], [0.03, 1.35, 1.6], [0, 1.25, -0.3]], he: NOONE, she: NOONE, props: (S, t) => cat(S, { x: 0, y: 0.47, z: -0.32, s: 1.4, col: KEVIN, mood: 'calm', tilt: t > V('hook', 'cats') ? 0.2 : 0, t }) },
      n1: { set: 'bedroom', cam: [[0.6, 1.0, 0.8], [0.05, 0.95, -0.5], [0.5, 0.95, 0.6], [0.05, 0.95, -0.5]], he: NOONE, she: NOONE, dof: 0.3,
        props: (S, t) => cat(S, { x: 0.05, y: 0.47, z: -0.5, yaw: 0.4, s: 1.3, col: KEVIN, mood: 'smug', t }),
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); const a = first('c1'); thought(ctx, S, [0.05, 1.2, -0.5], t < V('c1', 'Nothing') - 0.1 ? 'If he dies, I eat the face first.' : 'Nothing personal.', pu(t, a)); } },
      n2: { cam: [[0, 1.45, 2.6], [0, 1.2, -0.3], [0, 1.45, 2.3], [0, 1.2, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => { cat(S, { x: -0.45, y: 0.47, z: -0.32, s: 1.2, col: KEVIN, mood: t > first('c3') - 0.1 ? 'mad' : 'calm', look: [1, 0], t }); if (t > V('n2', 'second') - 0.1) cat(S, { x: 0.45, y: 0.47, z: -0.32, s: 1.1, col: NEW, mood: 'smug', look: [-1, 0], t }); },
        over: (ctx, W, H_, t, S) => { if (t < first('c3') - 0.1) thought(ctx, S, [0.45, 1.1, -0.32], "Hello. I'm the new favourite.", pu(t, first('c2'))); else thought(ctx, S, [-0.45, 1.15, -0.32], 'Sleep with one eye open, Kevin.', pu(t, first('c3'))); } },
      // you, lying on the floor: the camera looks up from the rug, the cat walks over and sits on you
      n3: { cam: [[0.1, 0.35, 2.2], [0, 0.55, 0.2], [0.1, 0.32, 2.0], [0, 0.55, 0.2]], he: NOONE, she: NOONE, dof: 0.2,
        props: (S, t) => { const k = H.clamp((t - first('c4') + 0.3) / 1.2); cat(S, { x: -0.6 + 0.6 * k, y: 0, z: 0.1 + 0.5 * k, yaw: 0.4 * (1 - k), s: 1.0, col: KEVIN, mood: t > V('c4', 'affection') - 0.2 ? 'smug' : 'mad', t }); },
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(30,40,80,0.25)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); const z = 0.1 + 0.5 * H.clamp((t - first('c4') + 0.3) / 1.2), x = -0.6 + 0.6 * H.clamp((t - first('c4') + 0.3) / 1.2);
          if (t > first('c4') - 0.1) thought(ctx, S, [x, 0.8, z], t < V('c4', "I'm") - 0.1 ? 'Ugh. Fine. Move over.' : t < V('c4', 'This') - 0.1 ? "I'm lying on your chest." : "This is not affection. It's heat.", pu(t, first('c4'))); } },
      n4: { cam: [[0.05, 0.75, 2.2], [0, 0.45, 0.6], [0.05, 0.72, 2.0], [0, 0.45, 0.6]], he: NOONE, she: NOONE, dof: 0.25,
        props: (S, t) => cat(S, { x: 0, y: 0, z: 0.6, s: 1.0, col: KEVIN, mood: t > first('c5') ? 'mad' : 'happy', t }),
        over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.8, 0.6], 'Tell anyone, and your phone goes off the table.', pu(t, first('c5'))); } },
      cta: { cam: [[0.05, 1.45, 2.0], [0, 1.25, -0.3], [0.05, 1.4, 1.8], [0, 1.25, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => { cat(S, { x: -0.3, y: 0.47, z: -0.32, s: 1.2, col: KEVIN, mood: 'smug', t }); cat(S, { x: 0.35, y: 0.47, z: -0.32, s: 1.05, col: NEW, mood: 'smug', look: [-1, 0], t }); },
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
