  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const GREY = [150, 150, 165], PURP = [120, 100, 150];
  const pig = (S, t, x, z, o = {}) => bird(S, Object.assign({ x, y: 0.47, z, s: 1.0, col: GREY, belly: [180, 180, 195], wing: [120, 120, 135], beak: [60, 60, 66], t }, o));
  const bench = (S) => { S.rbox((p) => add(p, [0, 0.42, -0.4]), 0.9, 0.04, 0.22, [140, 100, 60], { bevel: 0.2 }); for (const x of [-0.8, 0.8]) S.rbox((p) => add(p, [x, 0.21, -0.4]), 0.04, 0.21, 0.18, [60, 60, 66], { bevel: 0.2 }); };
  const crumbs = (S) => { for (let i = 0; i < 12; i++) S.rbox((p) => add(p, [-0.6 + (i % 6) * 0.22, 0.01, 0.1 + Math.floor(i / 6) * 0.2]), 0.02, 0.01, 0.02, [230, 200, 140], { bevel: 0.3 }); };
  makeCouch({
    keys: ['pigeons', 'sandwich', 'plan', 'staring', 'bread', 'mother', 'here', 'waited', 'tan', 'cruise', 'without', 'wrong', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'street', cam: [[0, 1.0, 1.8], [0, 0.55, -0.4], [0, 0.95, 1.5], [0, 0.55, -0.4]], he: NOONE, she: NOONE, props: (S, t) => { bench(S); pig(S, t, -0.3, -0.4, { mood: 'smug', look: [1, 0] }); pig(S, t, 0.3, -0.4, { look: [-1, 0] }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.3, 0.95, -0.4], t < V('g1', 'Plan') - 0.1 ? "See that guy's sandwich?" : 'Plan A.', pu(t, first('g1'))) },
      g2: { set: 'street', cam: [[0.3, 0.9, 1.0], [0.3, 0.75, -0.4], [0.3, 0.88, 0.85], [0.3, 0.75, -0.4]], he: NOONE, she: NOONE, props: (S, t) => { bench(S); pig(S, t, 0.3, -0.4, { mood: 'smug' }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.3, 1.0, -0.4], 'Plan A is just staring.', pu(t, first('g2'))) },
      n2: { set: 'street', cam: [[0, 1.4, 2.6], [0, 0.8, -0.4], [0, 1.35, 2.3], [0, 0.8, -0.4]], he: NOONE, she: NOONE, props: (S, t) => { bench(S); crumbs(S); for (let i = 0; i < 5; i++) pig(S, t, -0.8 + i * 0.4, 0.2, { y: Math.abs(Math.sin(t * 6 + i)) * 0.05, flap: t > first('g3') }); },
        extras: [{ who: 'mil', x: 0, z: -0.45, sit: true, outfit: 'winter', arms: 'hold', face: { mouth: 'smile' } }],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 0.6, 0.2], "MOTHER! SHE'S HERE!", pu(t, first('g3'))), fx: [{ k: 'hearts', at: first('g3'), n: 4, y: 560 }] },
      n3: { set: 'street', cam: [[0, 1.2, 2.2], [0, 0.6, -0.4], [0, 1.15, 1.9], [0, 0.6, -0.4]], he: NOONE, she: NOONE, props: (S, t) => { bench(S); pig(S, t, -0.25, 0.1, { mood: 'sad' }); pig(S, t, 0.25, 0.1, { mood: 'sad' }); },
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(40,50,80,0.3)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0.25, 0.65, 0.1], t < V('g4', 'We') - 0.1 ? 'Where is she?' : 'We waited all day.', pu(t, first('g4'))); } },
      n4: { set: 'street', cam: [[0, 1.4, 2.6], [0, 0.8, -0.4], [0, 1.35, 2.2], [0, 0.8, -0.4]], he: NOONE, she: NOONE, shake: first('g5'), props: (S, t) => { bench(S); pig(S, t, -0.4, 0.2, { mood: 'mad', look: [1, 0.3] }); pig(S, t, 0.5, 0.25, { mood: 'mad', look: [-1, 0.3] }); },
        extras: [{ who: 'mil', x: 0, z: -0.45, sit: true, outfit: 'party', arms: 'cheer', face: { mouth: 'smile', eyes: 'happy' } }],
        over: (ctx, W, H_, t, S) => { badge(ctx, S, [0.6, 1.4, -0.45], '☀', 'TAN', pu(t, V('n4', 'tan')), '#e8a030'); thought(ctx, S, [-0.4, 0.7, 0.2], t < V('g5', 'Without') - 0.1 ? 'A CRUISE?' : t < V('g5', 'Plan') - 0.1 ? 'Without us?' : 'Plan B.', pu(t, first('g5'))); } },
      cta: { set: 'street', cam: [[0, 1.0, 1.8], [0, 0.55, -0.4], [0, 1.0, 1.7], [0, 0.55, -0.4]], he: NOONE, she: NOONE, props: (S, t) => { bench(S); pig(S, t, -0.3, -0.4, { mood: 'smug' }); pig(S, t, 0.3, -0.4, { mood: 'smug' }); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
