  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const MUM = (o = {}) => Object.assign({ who: 'mil', x: 0, z: -0.6, sit: false }, o);
  makeCouch({
    keys: ['mum', 'eat', 'thin', 'girl', 'photos', 'two', 'minutes', 'busy', 'fine', 'phone', 'case', 'back', 'normal', 'call'],
    shots: ({ V, first }) => ({
      hook: { set: 'kitchen', cam: [[0, 1.95, 2.2], [0, 1.95, -0.6], [0, 1.95, 1.9], [0, 1.95, -0.6]], he: NOONE, she: NOONE, extras: (t) => [MUM({ outfit: 'apron', arms: 'hold', face: { mouth: 'smile', brows: 'worried' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 2.2, -0.6], t < V('m1', 'You') - 0.1 ? 'Did you eat?' : t < V('m1', 'Eat', 2) - 0.1 ? 'You look thin.' : 'EAT.', pu(t, first('m1'))) },
      m2: { cam: [[0.6, 1.95, 1.8], [0.62, 1.8, -0.42], [0.6, 1.95, 1.6], [0.62, 1.8, -0.42]], he: NOONE, she: NOONE, extras: (t) => [MUM({ x: 0.62, z: -0.42, yaw: -0.2, sit: true, arms: 'phone', face: { mouth: 'flat', eyes: 'half' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.62, 2.0, -0.42], t < V('m2', "I'll") - 0.1 ? 'Who is this girl in the photos?' : "I'll find out.", pu(t, first('m2'))) },
      n2: { cam: [[0.6, 1.95, 1.8], [0.62, 1.8, -0.42], [0.6, 1.95, 1.6], [0.62, 1.8, -0.42]], he: NOONE, she: NOONE, extras: (t) => [MUM({ x: 0.62, z: -0.42, yaw: -0.2, sit: true, arms: 'phone', face: { mouth: 'smile', eyes: 'happy' } })],
        over: (ctx, W, H_, t, S) => { badge(ctx, S, [1.0, 1.6, -0.42], '2:00', 'MINUTES', pu(t, V('n2', 'Two'))); thought(ctx, S, [0.62, 2.0, -0.42], t < V('m3', "He's") - 0.1 ? 'Two minutes.' : t < V('m3', "That's") - 0.1 ? "He's busy." : "That's fine.", pu(t, first('m3'))); } },
      n3: { cam: [[0.6, 1.9, 1.5], [0.62, 1.75, -0.42], [0.6, 1.9, 1.3], [0.62, 1.75, -0.42]], he: NOONE, she: NOONE, dof: 0.2, extras: (t) => [MUM({ x: 0.62, z: -0.42, yaw: -0.2, sit: true, arms: 'phone', face: { mouth: 'flat', eyes: 'half' }, head: { tilt: 0.15 } })],
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(40,50,80,0.3)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0.62, 2.0, -0.42], t < V('m4', 'Just') - 0.1 ? "I'll wait by the phone." : 'Just in case.', pu(t, first('m4'))); } },
      n4: { cam: [[0.6, 1.95, 1.8], [0.62, 1.8, -0.42], [0.6, 1.95, 1.5], [0.62, 1.8, -0.42]], he: NOONE, she: NOONE, shake: first('m5'), extras: (t) => [MUM({ x: 0.62, z: -0.42, yaw: -0.2, sit: true, arms: t > first('m5') ? 'cheer' : 'phone', face: { mouth: 'smile', eyes: 'happy' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.62, 2.0, -0.42], t < V('m5', 'Quick') - 0.1 ? 'HE CALLED BACK!' : 'Quick. Act normal.', pu(t, first('m5'))), fx: [{ k: 'hearts', at: first('m5'), n: 5, y: 600 }] },
      cta: { set: 'kitchen', cam: [[0, 1.95, 2.2], [0, 1.95, -0.6], [0, 1.95, 2.1], [0, 1.95, -0.6]], he: NOONE, she: NOONE, extras: [MUM({ outfit: 'apron', arms: 'hold', face: { mouth: 'smile' } })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
