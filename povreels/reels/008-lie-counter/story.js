  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  makeCouch({
    keys: ['lies', 'today', 'raise', 'promise', 'never', 'haircut', 'grandma', 'one', 'fine', 'mirror', 'scare', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'street', cam: [[0, 1.6, 3.0], [0, 1.8, -0.5], [0, 1.6, 2.6], [0, 1.8, -0.5]], he: NOONE, she: NOONE,
        extras: [{ who: 'boss', x: -0.8, z: -0.4, yaw: 0.3, sit: false }, { who: 'exgirl', x: 0.0, z: -0.8, sit: false }, { who: 'bro', x: 0.85, z: -0.4, yaw: -0.3, sit: false }],
        over: (ctx, W, H_, t, S) => { const a = V('hook', 'lies'); badge(ctx, S, [-0.8, 2.3, -0.4], Math.round(112 * H.clamp((t - a) / 1.2)), 'LIES', pu(t, a)); badge(ctx, S, [0, 2.3, -0.8], Math.round(47 * H.clamp((t - a) / 1.2)), 'LIES', pu(t, a + 0.2)); badge(ctx, S, [0.85, 2.3, -0.4], Math.round(3 * H.clamp((t - a) / 1.2)), 'LIES', pu(t, a + 0.4)); } },
      b1: { set: 'party', cam: [[0, 1.7, 2.3], [0, 1.6, -0.5], [0, 1.7, 2.0], [0, 1.6, -0.5]], he: NOONE, she: NOONE,
        extras: (t) => [{ who: 'boss', x: 0, z: -0.6, sit: false, arms: 'shrug', face: { mouth: 'smile', talk: t < V('b1', 'Promise') + 0.3 } }],
        over: (ctx, W, H_, t, S) => badge(ctx, S, [0.42, 1.9, -0.6], 111 + (t > V('b1', 'Promise') ? 1 : 0), 'LIES TODAY', 1) },
      d1: { set: 'restaurant', cam: [[0, 1.4, 2.2], [0, 1.25, -0.6], [0, 1.4, 1.9], [0, 1.25, -0.6]], he: NOONE, she: NOONE,
        extras: (t) => [{ who: 'exgirl', x: 0, z: -0.75, sit: true, face: { mouth: 'smile', lids: 0.4, talk: t < V('d1', 'date') + 0.3 } }],
        over: (ctx, W, H_, t, S) => badge(ctx, S, [0.4, 1.55, -0.75], 46 + (t > V('d1', 'date') ? 1 : 0), 'LIES TODAY', 1) },
      f1: { set: 'street', cam: [[0, 1.6, 2.2], [0, 1.6, -0.5], [0, 1.6, 1.9], [0, 1.6, -0.5]], he: NOONE, she: NOONE,
        extras: (t) => [{ who: 'bro', x: 0, z: -0.5, sit: false, arms: 'cheer', face: { mouth: 'smile', eyes: 'happy', talk: t < V('f1', 'Seriously') + 0.3 } }],
        over: (ctx, W, H_, t, S) => badge(ctx, S, [-0.45, 1.95, -0.5], 2 + (t > V('f1', 'haircut') ? 1 : 0), 'LIES TODAY', 1, '#e8a030') },
      n2: { set: 'living', cam: [[0.6, 1.5, 1.6], [0.62, 1.4, -0.42], [0.6, 1.5, 1.35], [0.62, 1.4, -0.42]], he: NOONE, she: NOONE, dof: 0.25,
        extras: (t) => [{ who: 'mil', x: 0.62, z: -0.42, yaw: -0.2, sit: true, outfit: 'winter', face: { mouth: 'smile', lids: 0.35, talk: t > first('g1') && t < V('g1', 'me') + 0.3 } }],
        over: (ctx, W, H_, t, S) => { badge(ctx, S, [0.95, 1.55, -0.42], t > V('g1', 'fine') ? 1 : 0, 'LIE TODAY', 1, '#5a8fd8'); if (t > V('g1', 'fine')) { ctx.save(); ctx.globalAlpha = 0.22 * H.clamp((t - V('g1', 'fine')) / 0.8); ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } } },
      n3: { set: 'bedroom', cam: [[0, 1.5, 1.2], [0, 1.4, -1.0], [0, 1.5, 1.05], [0, 1.4, -1.0]], he: NOONE, she: NOONE,
        over: (ctx, W, H_, t) => { const show = t > V('n3', 'mirror') - 0.1; if (!show) return; ctx.save(); ctx.fillStyle = 'rgba(220,235,245,0.92)'; ctx.beginPath(); ctx.roundRect(140, 260, 440, 640, 30); ctx.fill(); ctx.lineWidth = 14; ctx.strokeStyle = '#8a6a4a'; ctx.stroke();
          ctx.fillStyle = 'rgba(40,40,60,0.5)'; ctx.beginPath(); ctx.ellipse(360, 560, 110, 140, 0, 0, TAU); ctx.fill(); ctx.fillRect(250, 680, 220, 220); ctx.restore();
          const n = t < V('n4', 'fine') ? 1203 : 1203 + Math.round(1181 * H.clamp((t - V('n4', 'fine')) / 1.2)); const fake = { proj: () => [360, 480] }; badge(ctx, fake, null, n.toLocaleString('en-US'), 'LIES TODAY', pu(t, V('n3', 'mirror')), '#e8384f'); } },
      cta: { set: 'street', cam: [[0, 1.6, 3.0], [0, 1.8, -0.5], [0, 1.6, 2.9], [0, 1.8, -0.5]], he: NOONE, she: NOONE,
        extras: [{ who: 'boss', x: -0.8, z: -0.4, yaw: 0.3, sit: false }, { who: 'mil', x: 0.0, z: -0.8, sit: false, outfit: 'winter' }, { who: 'bro', x: 0.85, z: -0.4, yaw: -0.3, sit: false }],
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
