  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const warm = (ctx, W, H_, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = 0.25 * a; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const box = (S, x, z, open) => { S.rbox((p) => add(p, [x, 0.2, z]), 0.32, 0.2, 0.28, [196, 150, 100], { bevel: 0.15 }); if (open) for (const sd of [-1, 1]) S.rbox((p) => add(rotZ(p, sd * -0.8), [x + sd * 0.38, 0.46, z]), 0.16, 0.02, 0.28, [196, 150, 100], { bevel: 0.1 }); };
  const fence = (S) => { for (let i = 0; i < 9; i++) S.rbox((p) => add(p, [-2 + i * 0.5, 0.7, -1.0]), 0.08, 0.7, 0.04, [240, 236, 226], { bevel: 0.2 }); S.rbox((p) => add(p, [0, 1.1, -1.0]), 2.4, 0.04, 0.03, [240, 236, 226], { bevel: 0.2 }); };
  makeCouch({
    keys: ['dog', 'love', 'mittens', 'hissed', 'going', 'window', 'pathetic', 'adorable', 'gone', 'goodbye', 'box', 'surprise', 'moved', 'best', 'ever', 'date', 'two'],
    shots: ({ V, first }) => ({
      hook: { cam: [[0.05, 1.5, 2.4], [0, 1.25, -0.3], [0.03, 1.35, 1.7], [0, 1.25, -0.3]], he: NOONE, she: NOONE, props: (S, t) => dog(S, { x: 0, y: 0.47, z: -0.32, s: 1.1, col: [214, 160, 92], mood: 'happy', tongue: true, t }),
        fx: [{ k: 'hearts', at: V('hook', 'love'), n: 5, y: 560 }] },
      d1: { set: 'street', cam: [[0.1, 1.4, 2.2], [0, 1.0, -0.4], [0.1, 1.35, 1.9], [0, 1.0, -0.4]], he: NOONE, she: NOONE,
        props: (S, t) => { fence(S); dog(S, { x: -0.4, z: -0.3, s: 1.1, col: [214, 160, 92], mood: 'happy', tongue: true, look: [1, -0.5], t }); cat(S, { x: 0.6, y: 1.12, z: -1.0, s: 1.0, col: [236, 236, 240], mood: t > V('d1', 'hissed') - 0.1 ? 'mad' : 'smug', look: [-1, 0], t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.4, 1.0, -0.3], t < V('d1', 'She') - 0.1 ? 'Her name is Mittens.' : t < V('d1', 'I') - 0.1 ? 'She hissed at me.' : "I think it's going well.", pu(t, first('d1'))) },
      n2: { set: 'street', cam: [[0.6, 1.5, 1.4], [0.6, 1.3, -1.0], [0.55, 1.5, 1.2], [0.6, 1.3, -1.0]], he: NOONE, she: NOONE, dof: 0.3,
        props: (S, t) => { fence(S); cat(S, { x: 0.6, y: 1.12, z: -1.0, s: 1.1, col: [236, 236, 240], mood: t > V('c1', 'Adorable') - 0.1 ? 'happy' : 'smug', look: [-1, 0.3], t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.6, 1.75, -1.0], t < V('c1', 'Pathetic') - 0.1 ? 'He licked a window for three hours.' : t < V('c1', 'Adorable') - 0.1 ? 'Pathetic.' : 'Adorable. But pathetic.', pu(t, first('c1'))) },
      n3: { set: 'street', cam: [[0.1, 1.2, 2.0], [0, 0.8, -0.4], [0.1, 1.15, 1.8], [0, 0.8, -0.4]], he: NOONE, she: NOONE,
        props: (S, t) => { fence(S); dog(S, { x: 0, z: -0.3, s: 1.1, col: [214, 160, 92], mood: 'sad', tilt: 0.15, look: [0.5, -0.5], t }); },
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(60,70,110,0.3)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 1.0, -0.3], t < V('d2', 'She') - 0.1 ? "She's gone." : "She didn't even hiss goodbye.", pu(t, first('d2'))); } },
      n4: { cam: [[0.05, 1.3, 2.2], [0, 0.6, 0.2], [0.05, 1.25, 1.9], [0, 0.6, 0.2]], he: NOONE, she: NOONE,
        props: (S, t) => { const open = t > first('c2') - 0.2; box(S, 0.25, 0.3, open); if (open) cat(S, { x: 0.25, y: 0.2 + 0.2 * H.clamp((t - first('c2') + 0.2) / 0.4), z: 0.3, s: 0.9, col: [236, 236, 240], mood: 'smug', look: [-1, 0], t });
          dog(S, { x: -0.45, z: 0.2, s: 1.0, col: [214, 160, 92], mood: t > first('c2') ? 'happy' : 'calm', tongue: t > first('d3'), look: [1, 0], bob: 0, t }); },
        over: (ctx, W, H_, t, S) => { if (t < first('d3') - 0.1) thought(ctx, S, [0.25, 0.9, 0.3], 'Surprise, idiot. I moved in.', pu(t, first('c2'))); else thought(ctx, S, [-0.45, 1.0, 0.2], 'Best. Day. Ever.', pu(t, first('d3'))); },
        fx: [{ k: 'hearts', at: V('d3', 'Ever'), n: 6, y: 600 }] },
      cta: { cam: [[0.05, 1.45, 2.2], [0, 1.15, -0.3], [0.05, 1.4, 2.0], [0, 1.15, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => { dog(S, { x: -0.3, y: 0.47, z: -0.32, s: 1.0, col: [214, 160, 92], mood: 'happy', tongue: true, look: [1, 0], t }); cat(S, { x: 0.35, y: 0.47, z: -0.32, s: 0.95, col: [236, 236, 240], mood: 'smug', look: [-1, 0], t }); },
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
