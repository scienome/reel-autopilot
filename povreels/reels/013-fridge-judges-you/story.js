  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const fridge = (S, open) => { S.rbox((p) => add(p, [0.4, 0.95, -0.9]), 0.4, 0.95, 0.35, [232, 238, 242], { bevel: 0.08 }); S.rbox((p) => add(p, [0.12, 1.3, -0.52]), 0.02, 0.1, 0.02, [150, 160, 170], { bevel: 0.2 });
    if (open) { S.rbox((p) => add(p, [0.4, 1.0, -0.56]), 0.34, 0.85, 0.01, [255, 248, 210], { bevel: 0.05 }); for (const y of [0.6, 1.0, 1.4]) S.rbox((p) => add(p, [0.4, y, -0.6]), 0.34, 0.01, 0.25, [210, 220, 230], { bevel: 0.1 }); S.rbox((p) => add(p, [0.3, 1.05, -0.6]), 0.1, 0.05, 0.08, [250, 210, 80], { bevel: 0.3 }); S.rbox((p) => add(p, [0.5, 1.07, -0.6]), 0.07, 0.07, 0.07, [240, 120, 160], { bevel: 0.3 }); } };
  const face = (ctx, S, mood, t) => objFace(ctx, S, [0.4, 1.2, -0.54], mood, t, 0.9);
  makeCouch({
    keys: ['fridge', 'cheese', 'diet', 'tuesday', 'mum', 'vegetables', 'light', 'milk', 'secrets', 'cake', 'gone', 'ate', 'feelings', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'kitchen', cam: [[-0.2, 1.6, 1.8], [0.3, 1.2, -0.9], [-0.15, 1.55, 1.5], [0.3, 1.2, -0.9]], he: NOONE, she: NOONE, props: (S) => fridge(S, true),
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); face(ctx, S, t > first('r1') ? 'mad' : 'calm', t); thought(ctx, S, [0.4, 1.9, -0.6], t < V('r1', 'Put') - 0.1 ? '2 a.m. again?' : 'Put the cheese down.', pu(t, first('r1'))); } },
      r2: { set: 'kitchen', cam: [[0, 1.6, 1.2], [0.35, 1.4, -0.9], [0.05, 1.6, 1.0], [0.35, 1.4, -0.9]], he: NOONE, she: NOONE, props: (S) => fridge(S, false),
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); face(ctx, S, 'mad', t); thought(ctx, S, [0.4, 1.95, -0.6], t < V('r2', "It's") - 0.1 ? 'You said diet on Monday.' : "It's Tuesday.", pu(t, first('r2'))); } },
      n2: { set: 'kitchen', cam: [[-0.3, 1.6, 2.0], [0.1, 1.2, -0.8], [-0.25, 1.55, 1.8], [0.1, 1.2, -0.8]], he: NOONE, she: NOONE, props: (S) => fridge(S, true),
        extras: [{ who: 'mil', x: -0.35, z: -0.6, yaw: 0.5, sit: false, arms: 'hold', face: { mouth: 'smile' } }],
        over: (ctx, W, H_, t, S) => { face(ctx, S, t > first('r3') ? 'happy' : 'calm', t); thought(ctx, S, [0.4, 1.95, -0.6], t < V('r3', 'Someone') - 0.1 ? 'Finally.' : 'Someone who buys vegetables.', pu(t, first('r3'))); }, fx: [{ k: 'hearts', at: V('r3', 'vegetables'), n: 3, y: 520 }] },
      n3: { set: 'kitchen', cam: [[0, 1.6, 1.4], [0.35, 1.3, -0.9], [0.03, 1.6, 1.2], [0.35, 1.3, -0.9]], he: NOONE, she: NOONE, props: (S) => fridge(S, false),
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); nightTint(ctx, W, H_); face(ctx, S, 'sad', t); thought(ctx, S, [0.4, 1.95, -0.6], t < V('r4', 'And') - 0.1 ? 'I keep your milk cold.' : t < V('r4', 'Nobody') - 0.1 ? 'And your secrets.' : 'Nobody knows about the cake.', pu(t, first('r4'))); } },
      n4: { set: 'kitchen', cam: [[-0.2, 1.6, 1.8], [0.3, 1.2, -0.9], [-0.1, 1.55, 1.3], [0.3, 1.2, -0.9]], he: NOONE, she: NOONE, shake: first('r5'), props: (S) => { fridge(S, true); S.rbox((p) => add(p, [0.5, 1.07, -0.6]), 0.07, 0.01, 0.07, [240, 240, 244], { bevel: 0.3 }); },
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); face(ctx, S, 'happy', t); thought(ctx, S, [0.4, 1.9, -0.6], t < V('r5', "You're") - 0.1 ? 'Yes. I ate it.' : "You're not the only one with feelings.", pu(t, first('r5'))); } },
      cta: { set: 'kitchen', cam: [[-0.2, 1.6, 1.8], [0.3, 1.2, -0.9], [-0.2, 1.6, 1.7], [0.3, 1.2, -0.9]], he: NOONE, she: NOONE, props: (S) => fridge(S, false), over: (ctx, W, H_, t, S) => face(ctx, S, 'calm', t), fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
