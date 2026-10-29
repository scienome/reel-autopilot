  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const warm = (ctx, W, H_, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = 0.25 * a; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const cage = (S, x, z, open) => { for (let i = 0; i < 7; i++) S.rbox((p) => add(p, [x - 0.36 + i * 0.12, 0.55, z + 0.32]), 0.012, 0.55, 0.012, [150, 156, 166], { bevel: 0.2 }); S.rbox((p) => add(p, [x, 1.1, z + 0.32]), 0.4, 0.02, 0.02, [150, 156, 166], { bevel: 0.2 }); };
  makeCouch({
    keys: ['dogs', 'shelter', 'cute', 'perfect', 'bite', 'old', 'cage', 'sleep', 'me', 'sure', 'weeks', 'house', 'human', 'couch', 'adopt', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'mall', cam: [[0, 1.5, 2.6], [0, 0.8, -0.3], [0, 1.45, 2.3], [0, 0.8, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => { for (const [x, b] of [[-0.9, 'pug'], [0, 'chi'], [0.9, 'old']]) cage(S, x, -0.4); dog(S, { x: -0.9, z: -0.4, s: 0.7, col: [222, 196, 156], belly: [60, 46, 40], earCol: [60, 46, 40], mood: 'happy', t }); dog(S, { x: 0, z: -0.4, s: 0.5, col: [222, 186, 140], ears: 'big', mood: 'mad', t }); dog(S, { x: 0.9, z: -0.4, s: 0.9, col: [176, 130, 84], grey: true, mood: 'sad', t }); } },
      d1: { set: 'mall', cam: [[-0.9, 1.0, 1.0], [-0.9, 0.6, -0.4], [-0.9, 1.0, 0.85], [-0.9, 0.6, -0.4]], he: NOONE, she: NOONE, dof: 0.25,
        props: (S, t) => { cage(S, -0.9, -0.4); dog(S, { x: -0.9, y: Math.abs(Math.sin(t * 8)) * 0.08, z: -0.4, s: 0.75, col: [222, 196, 156], belly: [60, 46, 40], earCol: [60, 46, 40], mood: 'happy', tongue: true, t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.9, 0.9, -0.4], "Pick me! I'm cute! I'm perfect!", pu(t, first('d1'))) },
      d2: { set: 'mall', cam: [[0, 0.9, 0.9], [0, 0.5, -0.4], [0, 0.9, 0.8], [0, 0.5, -0.4]], he: NOONE, she: NOONE, dof: 0.25,
        props: (S, t) => { cage(S, 0, -0.4); dog(S, { x: 0, z: -0.4, s: 0.55, col: [222, 186, 140], ears: 'big', mood: 'mad', t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 0.7, -0.4], "Pick me, and I'll only bite you a little.", pu(t, first('d2'))) },
      n2: { set: 'mall', cam: [[0.9, 0.9, 1.3], [0.9, 0.5, -0.4], [0.9, 0.85, 1.05], [0.9, 0.5, -0.4]], he: NOONE, she: NOONE, dof: 0.3,
        props: (S, t) => { cage(S, 0.9, -0.4); dog(S, { x: 0.9, z: -0.4, s: 0.95, col: [176, 130, 84], grey: true, mood: 'sad', tilt: 0.25, look: [0, 0.5], t }); },
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(40,50,90,0.3)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0.9, 0.95, -0.4], t < V('d3', "It's") - 0.1 ? 'Nobody picks the old ones.' : "It's fine. I'll just sleep.", pu(t, first('d3'))); } },
      n3: { set: 'mall', cam: [[0.9, 0.9, 1.1], [0.9, 0.55, -0.4], [0.9, 0.85, 0.9], [0.9, 0.55, -0.4]], he: NOONE, she: NOONE, dof: 0.3,
        props: (S, t) => { if (t < V('n3', 'cage')) cage(S, 0.9, -0.4); dog(S, { x: 0.9, z: -0.4, s: 0.95, col: [176, 130, 84], grey: true, mood: t > first('d4') ? 'happy' : 'sad', look: [0, -0.4], t }); },
        over: (ctx, W, H_, t, S) => { warm(ctx, W, H_, H.clamp((t - V('n3', 'cage')) / 0.8)); thought(ctx, S, [0.9, 1.0, -0.4], t < V('d4', 'Are') - 0.1 ? 'Wait. Me?' : 'Are you sure?', pu(t, first('d4'))); } },
      n4: { cam: [[0.05, 1.45, 2.2], [0, 1.1, -0.3], [0.05, 1.4, 1.9], [0, 1.1, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => dog(S, { x: 0, y: 0.47, z: -0.32, s: 1.05, col: [176, 130, 84], grey: true, mood: 'smug', tongue: t > V('d5', 'couch'), t }),
        over: (ctx, W, H_, t, S) => { const u = pu(t, first('n4')); if (u > 0 && t < first('d5')) { ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-250, -54, 500, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 50); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('3 WEEKS LATER', 0, 4); ctx.restore(); }
          warm(ctx, W, H_, 0.6); thought(ctx, S, [0, 1.25, -0.32], t < V('d5', "That's") - 0.1 ? 'This is my house.' : t < V('d5', 'And') - 0.1 ? "That's my human." : 'And that is MY couch.', pu(t, first('d5'))); },
        fx: [{ k: 'hearts', at: V('d5', 'couch'), n: 5, y: 560 }] },
      cta: { cam: [[0.05, 1.45, 2.0], [0, 1.15, -0.3], [0.05, 1.4, 1.9], [0, 1.15, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => dog(S, { x: 0, y: 0.47, z: -0.32, s: 1.05, col: [176, 130, 84], grey: true, mood: 'happy', tongue: true, t }),
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
