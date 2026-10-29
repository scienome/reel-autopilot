  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const searchCard = (ctx, S, at, txt, u, minY = 300) => floatCard(ctx, S, at, 'SEARCH HISTORY', txt, u, '#ffffff', '#1c1a22', 0, minY);
  makeCouch({
    keys: ['search', 'history', 'date', 'boss', 'mum', 'fine', 'dad', 'proud', 'party', 'staring', 'yours', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'street', cam: [[0, 1.6, 3.0], [0, 1.8, -0.5], [0, 1.6, 2.6], [0, 1.8, -0.5]], he: NOONE, she: NOONE,
        extras: [{ who: 'bro', x: -0.8, z: -0.4, yaw: 0.3, sit: false }, { who: 'bff', x: 0.0, z: -0.8, yaw: 0, sit: false }, { who: 'boss', x: 0.85, z: -0.4, yaw: -0.3, sit: false }],
        over: (ctx, W, H_, t, S) => { const u = pu(t, V('hook', 'search')); searchCard(ctx, S, [-0.8, 2.5, -0.4], 'can you get fired for napping', u, 300); searchCard(ctx, S, [0, 2.6, -0.8], 'why does my cat hate me', pu(t, V('hook', 'search') + 0.25), 410); searchCard(ctx, S, [0.85, 2.5, -0.4], 'how to look busy', pu(t, V('hook', 'search') + 0.5), 520); } },
      n1: { set: 'restaurant', cam: [[0, 1.4, 2.2], [0, 1.25, -0.6], [0, 1.4, 1.9], [0, 1.25, -0.6]], he: NOONE, she: NOONE,
        extras: (t) => [{ who: 'exgirl', x: 0, z: -0.75, yaw: 0, sit: true, face: { mouth: 'smile', eyes: 'happy', talk: t > first('d1') && t < V('d1', 'time') + 0.3 } }],
        over: (ctx, W, H_, t, S) => searchCard(ctx, S, [0, 2.0, -0.75], 'how to fake an emergency call', pu(t, V('d1', 'great'))) },
      n2: { set: 'party', cam: [[0, 1.7, 2.4], [0, 1.6, -0.5], [0, 1.7, 2.1], [0, 1.6, -0.5]], he: NOONE, she: NOONE,
        extras: [{ who: 'boss', x: 0, z: -0.6, yaw: 0, sit: false, arms: 'shrug', face: { mouth: 'smile' } }],
        over: (ctx, W, H_, t, S) => searchCard(ctx, S, [0, 2.45, -0.6], 'how to fire someone nicely', pu(t, V('b1', 'quarter') - 0.1)) },
      n3: { set: 'living', cam: [[0.6, 1.5, 1.6], [0.62, 1.4, -0.42], [0.6, 1.5, 1.3], [0.62, 1.4, -0.42]], he: NOONE, she: NOONE, dof: 0.25,
        extras: (t) => [{ who: 'mil', x: 0.62, z: -0.42, yaw: -0.2, sit: true, arms: 'phone', face: { mouth: 'smile', lids: 0.4, talk: t > first('m1') && t < V('m1', 'me') + 0.3 } }],
        over: (ctx, W, H_, t, S) => searchCard(ctx, S, [0.62, 1.95, -0.42], "why doesn't my son call me anymore", pu(t, V('m1', 'worry'))) },
      n4: { set: 'living', cam: [[-0.6, 1.5, 1.7], [-0.62, 1.4, -0.42], [-0.6, 1.5, 1.4], [-0.62, 1.4, -0.42]], he: NOONE, she: NOONE, dof: 0.25,
        extras: (t) => [{ who: 'dad', x: -0.62, z: -0.42, yaw: 0.2, sit: true, arms: 'rest', face: { mouth: 'flat', lids: 0.3 } }],
        over: (ctx, W, H_, t, S) => { searchCard(ctx, S, [-0.62, 1.95, -0.42], 'how to tell my son I am proud of him', pu(t, V('dd1', 'Sure') - 0.1)); if (t > V('dd1', 'Sure')) { ctx.save(); ctx.globalAlpha = 0.25 * H.clamp((t - V('dd1', 'Sure')) / 0.6); ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } } },
      n5: { set: 'party', cam: [[0, 1.7, 2.8], [0, 1.6, -0.5], [0, 1.65, 2.4], [0, 1.6, -0.5]], he: NOONE, she: NOONE,
        extras: [{ who: 'bro', x: -0.9, z: -0.3, yaw: 0.4, sit: false, face: { eyes: 'wide', mouth: 'o' } }, { who: 'exgirl', x: -0.3, z: -0.7, yaw: 0.1, sit: false, face: { eyes: 'wide', mouth: 'o' } }, { who: 'boss', x: 0.35, z: -0.7, yaw: -0.1, sit: false, face: { eyes: 'wide', mouth: 'o' } }, { who: 'bff', x: 0.9, z: -0.3, yaw: -0.4, sit: false, face: { eyes: 'wide', mouth: 'o' } }],
        over: (ctx, W, H_, t) => { const u = pu(t, V('n5', 'staring')); if (u <= 0) return; ctx.save(); ctx.translate(360, 330); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 16; ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-300, -60, 600, 120, 26); ctx.fill(); ctx.shadowColor = 'transparent';
          ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.font = FONT(800, 22); ctx.textAlign = 'center'; ctx.fillText('YOUR SEARCH HISTORY', 0, -24); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 32); ctx.fillText('can people see my search history', 0, 20); ctx.restore(); } },
      cta: { set: 'party', cam: [[0, 1.7, 2.8], [0, 1.6, -0.5], [0, 1.7, 2.7], [0, 1.6, -0.5]], he: NOONE, she: NOONE,
        extras: [{ who: 'bro', x: -0.9, z: -0.3, yaw: 0.4, sit: false, arms: 'cheer', face: { mouth: 'open', eyes: 'happy' } }, { who: 'bff', x: 0.9, z: -0.3, yaw: -0.4, sit: false, arms: 'cheer', face: { mouth: 'open', eyes: 'happy' } }],
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
