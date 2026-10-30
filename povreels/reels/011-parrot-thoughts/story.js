  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const perch = (S) => { S.rbox((p) => add(p, [0.35, 0.9, -0.2]), 0.02, 0.9, 0.02, [120, 84, 50], { bevel: 0.2 }); S.rbox((p) => add(p, [0.35, 1.32, -0.2]), 0.2, 0.02, 0.02, [120, 84, 50], { bevel: 0.2 }); };
  const parrot = (S, t, o = {}) => bird(S, Object.assign({ x: 0.35, y: 1.34, z: -0.2, s: 1.4, col: [40, 170, 80], belly: [250, 210, 60], wing: [40, 120, 220], crest: [230, 60, 50], beak: [240, 230, 210], t }, o));
  const boxes = (S) => { for (let i = 0; i < 8; i++) S.rbox((p) => add(p, [-0.9 + (i % 4) * 0.5, 0.06 + Math.floor(i / 4) * 0.12, 0.3]), 0.2, 0.05, 0.2, [220, 190, 140], { bevel: 0.2 }); };
  makeCouch({
    keys: ['parrot', 'thinking', 'password', 'heard', 'boss', 'spreadsheet', 'sleep', 'friend', 'mine', 'phone', 'forty', 'pizzas', 'card', 'keep', 'two'],
    shots: ({ V, first }) => ({
      hook: { cam: [[0.3, 1.6, 2.6], [0.3, 1.3, -0.2], [0.3, 1.55, 2.2], [0.3, 1.35, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { perch(S); parrot(S, t, { flap: t < 1.2 }); } },
      p1: { cam: [[0.35, 1.7, 1.3], [0.35, 1.6, -0.2], [0.35, 1.7, 1.1], [0.35, 1.6, -0.2]], he: NOONE, she: NOONE, dof: 0.25, props: (S, t) => { perch(S); parrot(S, t, { mood: 'smug' }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.35, 1.85, -0.2], t < V('p1', 'I') - 0.1 ? 'Your password is 1234.' : 'I heard you.', pu(t, first('p1'))) },
      n2: { set: 'restaurant', cam: [[0, 1.45, 2.2], [0, 1.25, -0.6], [0, 1.45, 1.9], [0, 1.25, -0.6]], he: NOONE, she: NOONE,
        extras: (t) => [{ who: 'boss', x: -0.3, z: -0.75, sit: true, face: { mouth: 'smile' } }], props: (S, t) => parrot(S, t, { x: 0.55, y: 0.95, z: -0.55, s: 1.1, mood: 'smug', look: [-1, 0] }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.55, 1.4, -0.55], t < V('p2', 'Mister') - 0.1 ? 'Should I tell him what you call him?' : 'MISTER SPREADSHEET.', pu(t, first('p2'))) },
      n3: { set: 'bedroom', cam: [[0, 1.4, 1.6], [0.3, 1.2, -0.6], [0, 1.4, 1.4], [0.3, 1.2, -0.6]], he: NOONE, she: NOONE, props: (S, t) => parrot(S, t, { x: 0.3, y: 0.95, z: -0.6, s: 1.2, mood: t > first('p3') ? 'sad' : 'calm' }),
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.3, 1.45, -0.6], t < V('p3', "I'm") - 0.1 ? 'You talk to me every night.' : t < V('p3', "You're") - 0.1 ? "I'm your only friend." : "You're mine too.", pu(t, first('p3'))); },
        fx: [{ k: 'hearts', at: V('p3', 'mine'), n: 4, y: 620 }] },
      n4: { cam: [[0.3, 1.6, 2.6], [0.3, 1.0, -0.2], [0.3, 1.55, 2.3], [0.3, 1.0, -0.2]], he: NOONE, she: NOONE, shake: first('p4'), props: (S, t) => { perch(S); parrot(S, t, { mood: 'smug', flap: t > first('p4') }); if (t > first('p4')) boxes(S); },
        over: (ctx, W, H_, t, S) => { badge(ctx, S, [-0.6, 1.0, 0.3], 40, 'PIZZAS', pu(t, V('p4', 'forty'))); thought(ctx, S, [0.35, 1.85, -0.2], t < V('p4', 'Your') - 0.1 ? 'I ordered 40 pizzas.' : 'Your card. Your password.', pu(t, first('p4'))); } },
      cta: { cam: [[0.3, 1.6, 2.2], [0.3, 1.35, -0.2], [0.3, 1.6, 2.1], [0.3, 1.35, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { perch(S); parrot(S, t, { mood: 'smug' }); boxes(S); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
