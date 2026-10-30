  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const GP = (o = {}) => Object.assign({ who: 'dad', x: 0.62, z: -0.42, yaw: -0.2, sit: true, outfit: 'winter', hair: [220, 220, 225] }, o);
  const cup = (S, x, z) => { S.cyl((p) => add(p, [x, 0.5, z]), 0.05, 0.08, [240, 240, 236], 12); S.cyl((p) => add(p, [x, 0.585, z]), 0.042, 0.005, [150, 100, 60], 12); };
  const photo = (S) => S.rbox((p) => add(rotX(p, -0.3), [0, 1.0, 0.25]), 0.16, 0.11, 0.01, [240, 230, 210], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#c8b090'; c.fillRect(w * 0.08, h * 0.1, w * 0.84, h * 0.8); c.fillStyle = '#7a6040'; c.beginPath(); c.arc(w * 0.38, h * 0.42, w * 0.08, 0, TAU); c.arc(w * 0.62, h * 0.42, w * 0.08, 0, TAU); c.fill(); c.fillRect(w * 0.28, h * 0.55, w * 0.2, h * 0.3); c.fillRect(w * 0.52, h * 0.55, w * 0.2, h * 0.3); } });
  makeCouch({
    keys: ['grandpa', 'scam', 'telly', 'music', 'machine', 'sunday', 'better', 'photo', 'her', 'fifty', 'two', 'cups', 'tea', 'thank', 'grandparents'],
    shots: ({ V, first }) => ({
      hook: { cam: [[0.6, 1.65, 1.6], [0.62, 1.7, -0.42], [0.6, 1.65, 1.35], [0.62, 1.7, -0.42]], he: NOONE, she: NOONE, dof: 0.25, extras: (t) => [GP({ arms: 'phone', face: { mouth: 'flat', brows: 'angry' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.62, 1.95, -0.42], t < V('gp1', "Where's") - 0.1 ? 'This phone is a scam.' : "Where's the button for the telly?", pu(t, first('gp1'))) },
      gp2: { cam: [[0.6, 1.65, 1.4], [0.62, 1.75, -0.42], [0.6, 1.65, 1.2], [0.62, 1.75, -0.42]], he: NOONE, she: NOONE, extras: [GP({ arms: 'head', face: { eyes: 'closed', mouth: 'frown' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.62, 1.95, -0.42], 'Your music sounds like a washing machine.', pu(t, first('gp2'))) },
      n2: { set: 'restaurant', cam: [[0, 1.55, 2], [0, 1.55, -0.7], [0, 1.55, 1.75], [0, 1.55, -0.7]], he: NOONE, she: NOONE, extras: (t) => [GP({ x: 0, z: -0.75, yaw: 0, arms: 'hold', face: { mouth: 'smile', eyes: t > V('gp3', 'Your') ? 'half' : 'happy' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 1.85, -0.75], t < V('gp3', 'Your') - 0.1 ? 'Lovely food.' : "Your grandma's was better.", pu(t, first('gp3'))) },
      n3: { cam: [[0.3, 1.65, 1.3], [0.4, 1.55, -0.3], [0.3, 1.6, 1.1], [0.4, 1.55, -0.3]], he: NOONE, she: NOONE, dof: 0.2, props: photo, extras: (t) => [GP({ arms: 'hold', face: { mouth: 'smile', eyes: t > V('gp4', 'I') ? 'closed' : 'open' }, head: { tilt: 0.15 } })],
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0.62, 1.95, -0.42], t < V('gp4', 'Fifty') - 0.1 ? "That's her." : t < V('gp4', 'I') - 0.1 ? 'Fifty years.' : 'I still make two cups of tea.', pu(t, first('gp4'))); } },
      n4: { set: 'kitchen', cam: [[0, 1.65, 1.8], [0, 1.45, -0.6], [0, 1.6, 1.6], [0, 1.45, -0.6]], he: NOONE, she: NOONE, props: (S) => { S.rbox((p) => add(p, [0, 0.45, -0.3]), 0.4, 0.02, 0.25, [200, 160, 110], { bevel: 0.2 }); cup(S, -0.12, -0.3); cup(S, 0.12, -0.3); },
        extras: (t) => [GP({ x: 0.3, z: -0.75, yaw: -0.3, sit: false, arms: t > V('gp5', 'Now') ? 'shrug' : 'hold', face: { mouth: 'smile', eyes: 'happy' } })],
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.3, 1.95, -0.75], t < V('gp5', 'Now') - 0.1 ? 'Thank you.' : "Now where's the button for the telly?", pu(t, first('gp5'))), fx: [{ k: 'hearts', at: first('gp5'), n: 3, y: 560 }] },
      cta: { cam: [[0.6, 1.65, 1.6], [0.62, 1.7, -0.42], [0.6, 1.65, 1.5], [0.62, 1.7, -0.42]], he: NOONE, she: NOONE, extras: [GP({ arms: 'phone', face: { mouth: 'smile' } })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
