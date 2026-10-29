  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const warm = (ctx, W, H_, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = 0.25 * a; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const glass = (S, x, y, z) => S.cyl((p) => add(p, [x, y, z]), 0.05, 0.14, [180, 220, 240], 12, { gloss: 0.8 });
  const fluff = (S, t) => { const r = H.rng(7); for (let i = 0; i < 14; i++) S.ball([r.range(-1, 1), 0.04 + r.range(0, 0.5), r.range(-0.4, 0.6)], 0.06, [240, 236, 230], { rim: false }); };
  makeCouch({
    keys: ['pets', 'leave', 'gone', 'forever', 'worst', 'castle', 'glass', 'couch', 'regret', 'back', 'love', 'dog', 'criminal', 'two'],
    shots: ({ V, first }) => ({
      hook: { cam: [[0.05, 1.5, 2.6], [0, 1.15, -0.3], [0.03, 1.45, 2.3], [0, 1.15, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => { dog(S, { x: -0.35, z: 0.1, s: 1.0, col: [214, 160, 92], mood: 'happy', tongue: true, t }); cat(S, { x: 0.4, y: 0.47, z: -0.32, s: 0.95, col: [92, 92, 100], mood: 'smug', t }); } },
      d1: { cam: [[-0.3, 1.0, 1.7], [-0.35, 0.8, 0.1], [-0.3, 1.0, 1.5], [-0.35, 0.8, 0.1]], he: NOONE, she: NOONE, dof: 0.25,
        props: (S, t) => dog(S, { x: -0.35, z: 0.1, s: 1.0, col: [214, 160, 92], mood: 'sad', tilt: 0.2, look: [0, -0.6], t }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.35, 1.05, 0.1], t < V('d1', 'This') - 0.1 ? "He's gone. Forever." : 'This is the worst day of my life.', pu(t, first('d1'))) },
      c1: { cam: [[0.4, 1.4, 1.5], [0.4, 1.0, -0.32], [0.4, 1.4, 1.3], [0.4, 1.0, -0.32]], he: NOONE, she: NOONE, dof: 0.25,
        props: (S, t) => cat(S, { x: 0.4, y: 0.47, z: -0.32, s: 1.0, col: [92, 92, 100], mood: 'smug', t }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.4, 1.15, -0.32], 'Finally. The castle is mine.', pu(t, first('c1'))) },
      n2: { set: 'kitchen', cam: [[0.2, 1.6, 1.9], [-0.2, 1.1, -0.8], [0.2, 1.55, 1.7], [-0.2, 1.1, -0.8]], he: NOONE, she: NOONE,
        props: (S, t) => { const k = H.clamp((t - V('c2', 'glass', 2) - 0.2) / 0.4); if (k < 1) glass(S, 0.05 + 0.2 * k, 0.98 - 0.9 * k * k, -0.95); cat(S, { x: -0.3, y: 0.96, z: -1.0, s: 0.85, col: [92, 92, 100], mood: 'smug', look: [1, 0], t }); },
        over: (ctx, W, H_, t, S) => { const u = pu(t, first('n2')); if (u > 0 && t < first('c2')) { ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-250, -54, 500, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 50); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('10 MINUTES LATER', 0, 4); ctx.restore(); }
          thought(ctx, S, [-0.3, 1.6, -1.0], 'The glass. Knock the glass.', pu(t, first('c2'))); } },
      d2: { cam: [[0.05, 1.3, 2.4], [0, 0.7, -0.2], [0.05, 1.25, 2.1], [0, 0.7, -0.2]], he: NOONE, she: NOONE,
        props: (S, t) => { fluff(S, t); dog(S, { x: 0, z: 0.0, s: 1.05, col: [214, 160, 92], mood: 'smug', tongue: true, t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 1.0, 0.0], t < V('d2', 'I', 2) - 0.1 ? 'I ate the couch.' : 'I regret nothing.', pu(t, first('d2'))) },
      n3: { cam: [[0.05, 1.3, 2.4], [0, 0.7, -0.2], [0.05, 1.25, 1.8], [0, 0.7, -0.2]], he: NOONE, she: NOONE, shake: first('d3'),
        props: (S, t) => { fluff(S, t); const j = t > first('d3') ? Math.abs(Math.sin(t * 9)) * 0.15 : 0; dog(S, { x: 0, y: j, z: 0.3, s: 1.05, col: [214, 160, 92], mood: 'happy', tongue: true, t }); cat(S, { x: 0.5, y: 0.47, z: -0.32, s: 0.9, col: [92, 92, 100], mood: t > first('c3') ? 'smug' : 'calm', look: [-1, 0], t }); },
        over: (ctx, W, H_, t, S) => { if (t < first('c3') - 0.1) thought(ctx, S, [0, 1.15, 0.3], 'YOU CAME BACK! I THOUGHT YOU DIED! I LOVE YOU!', pu(t, first('d3'))); else thought(ctx, S, [0.5, 1.15, -0.32], t < V('c3', 'The') - 0.1 ? "Oh. You're back." : 'The dog did all of this.', pu(t, first('c3'))); },
        fx: [{ k: 'hearts', at: V('d3', 'love'), n: 5, y: 600 }] },
      cta: { cam: [[0.05, 1.45, 2.4], [0, 1.0, -0.2], [0.05, 1.4, 2.2], [0, 1.0, -0.2]], he: NOONE, she: NOONE,
        props: (S, t) => { fluff(S, t); dog(S, { x: -0.3, z: 0.1, s: 1.0, col: [214, 160, 92], mood: 'happy', tongue: true, look: [1, 0], t }); cat(S, { x: 0.4, y: 0.47, z: -0.32, s: 0.95, col: [92, 92, 100], mood: 'smug', look: [-1, 0], t }); },
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
