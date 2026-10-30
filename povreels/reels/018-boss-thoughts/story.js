  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const B_ = (o = {}) => Object.assign({ who: 'boss', x: 0, z: -0.6, sit: false }, o);
  const printer = (S) => { S.rbox((p) => add(p, [-0.8, 0.5, -0.8]), 0.28, 0.2, 0.22, [210, 214, 220], { bevel: 0.15 }); S.rbox((p) => add(p, [-0.8, 0.72, -0.8]), 0.2, 0.02, 0.15, [250, 250, 250], { bevel: 0.1 }); S.rbox((p) => add(p, [-0.8, 0.15, -0.8]), 0.2, 0.15, 0.18, [120, 124, 130], { bevel: 0.15 }); };
  makeCouch({
    keys: ['boss', 'presentation', 'slide', 'two', 'coffee', 'last', 'pod', 'review', 'promote', 'printer', 'raise', 'myself', 'quit', 'same', 'wait'],
    shots: ({ V, first }) => ({
      hook: { set: 'party', opt: { banner: 'Q3 RESULTS' }, cam: [[0, 1.85, 2.3], [0, 2, -0.6], [0, 1.85, 2], [0, 2, -0.6]], he: NOONE, she: NOONE, extras: (t) => [B_({ arms: 'cheer', face: { mouth: 'smile', eyes: t > V('b1', 'I') ? 'half' : 'happy' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 2.15, -0.6], t < V('b1', 'I') - 0.1 ? 'Great presentation.' : "I didn't understand slide 2.", pu(t, first('b1'))) },
      b2: { set: 'kitchen', cam: [[0, 1.85, 2], [0, 1.95, -0.6], [0, 1.85, 1.8], [0, 1.95, -0.6]], he: NOONE, she: NOONE, extras: (t) => [B_({ arms: 'hold', face: { mouth: 'smile', brows: 'worried' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 2.15, -0.6], t < V('b2', 'Please') - 0.1 ? 'Coffee?' : "Please say no. That's my last pod.", pu(t, first('b2'))) },
      n2: { set: 'restaurant', cam: [[0, 1.55, 2.2], [0, 1.65, -0.6], [0, 1.55, 1.9], [0, 1.65, -0.6]], he: NOONE, she: NOONE, extras: (t) => [{ who: 'boss', x: 0, z: -0.75, sit: true, arms: 'clasp', face: { mouth: 'flat', brows: 'raised' } }],
        over: (ctx, W, H_, t, S) => { if (t < first('b3')) timeCard(ctx, t, first('n2') - 0.1, 'PERFORMANCE REVIEW'); thought(ctx, S, [0, 1.85, -0.75], t < V('b3', "He's") - 0.1 ? 'Promote him?' : "He's the only one who knows how the printer works.", pu(t, first('b3'))); } },
      n3: { set: 'restaurant', cam: [[0, 1.5, 1.6], [0, 1.7, -0.75], [0, 1.5, 1.4], [0, 1.7, -0.75]], he: NOONE, she: NOONE, extras: (t) => [{ who: 'boss', x: 0, z: -0.75, sit: true, arms: 'head', face: { mouth: 'frown', eyes: 'half' } }],
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(40,50,80,0.25)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 1.85, -0.75], t < V('b4', 'I', 2) - 0.1 ? "I can't give him a raise." : "I can't even give myself one.", pu(t, first('b4'))); } },
      n4: { set: 'street', cam: [[0, 1.75, 2.4], [0, 1.8, -0.5], [0, 1.75, 2.1], [0, 1.8, -0.5]], he: NOONE, she: NOONE, props: printer, extras: (t) => [B_({ x: 0.2, z: -0.5, arms: t < first('b5') ? 'cheer' : 'head', face: { mouth: t < first('b5') ? 'smile' : 'o', eyes: t < first('b5') ? 'happy' : 'wide' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.2, 2.1, -0.5], t < V('b5', 'Who') - 0.1 ? 'Wait.' : 'Who knows how the printer works?', pu(t, first('b5'))) },
      cta: { set: 'party', opt: { banner: 'Q3 RESULTS' }, cam: [[0, 1.85, 2.3], [0, 2, -0.6], [0, 1.85, 2.2], [0, 2, -0.6]], he: NOONE, she: NOONE, extras: [B_({ arms: 'shrug', face: { mouth: 'smile' } })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
