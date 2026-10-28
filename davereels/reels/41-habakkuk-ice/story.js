  // Dave reel 41: Project Habakkuk (1942-43), Britain's aircraft carrier of pykrete (ice + ~14% wood pulp). The fibres
  // stop cracks; a bullet shattered ice and bounced off pykrete. Dave stood where it bounced. R.I.P. Dave #40.
  const ICE = [214, 232, 244], PYK = [206, 196, 176], PIPE = [90, 150, 210];
  // the ice carrier along x: a long block hull, a flat deck with planes, an island; pipes = refrigeration lines
  const carrier = (S, c, o = {}) => { const s = o.s || 1, T = (p) => add(mul(p, s), c);
    S.box((p) => T(add(p, [0, 0.2, 0])), 6, 0.8, 1.2, ICE, { bevel: 0.05, alpha: 0.9, gloss: 0.6 }); S.box((p) => T(add(p, [1.5, 1.4, -0.9])), 0.6, 0.4, 0.2, ICE, { bevel: 0.1 });
    for (let i = 0; i < 4; i++) S.box((p) => T(add(p, [-3.5 + i * 1.6, 1.08, 0.2])), 0.35, 0.05, 0.3, [120, 126, 120], { bevel: 0.3 });
    if (o.pipes) for (let j = 0; j < 4; j++) S.rod(T([-5.9, -0.3 + j * 0.3, 1.22]), T([5.9, -0.3 + j * 0.3, 1.22]), 0.05, PIPE, 8, { glow: true }); };
  const sea = (S) => S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 60], [-400, 0, 60]], [52, 110, 170], { bg: true, flat: false });
  // a demo table with two blocks: ice (left) and pykrete (right). shat = ice shattered 0..1
  const blocks = (S, t, shat) => { S.box((p) => add(p, [0, 0.72, -1.4]), 1.4, 0.04, 0.5, [100, 66, 44], { bevel: 0.2 });
    if (shat <= 0) S.box((p) => add(p, [-0.6, 0.96, -1.4]), 0.2, 0.2, 0.2, ICE, { bevel: 0.1, alpha: 0.8, gloss: 0.6 }); else { const r = H.rng(2); for (let i = 0; i < 9; i++) { const d = [r.range(-1, 1), r.range(0.2, 1.4), r.range(-1, 1)]; S.box((p) => add(rotX(p, shat * 5 + i), add([-0.6, 0.96, -1.4], mul(d, shat * 0.9))), 0.06, 0.05, 0.06, ICE, { alpha: 0.85 }); } }
    S.box((p) => add(p, [0.6, 0.96, -1.4]), 0.2, 0.2, 0.2, PYK, { bevel: 0.1, paint: (c, w, h) => { c.strokeStyle = 'rgba(120,90,50,0.5)'; c.lineWidth = 2; const r = H.rng(5); for (let i = 0; i < 30; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + r.range(-12, 12), y + r.range(-12, 12)); c.stroke(); } } }); };
  const tracer = (ctx, S, pts, k) => { if (k <= 0 || k >= 1) return; const n = pts.length - 1, f = k * n, i = Math.min(n - 1, Math.floor(f)), a = pts[i], b = pts[i + 1], p = add(a, mul(sub(b, a), f - i)), q = S.proj(p); ctx.save(); ctx.fillStyle = '#fff2b0'; ctx.shadowColor = '#ffb040'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(q[0], q[1], 9, 0, TAU); ctx.fill(); ctx.restore(); };
  const OUT = { bg: sunsetSky, dof: 0, shadows: false };
  makeDave({
    rip: { n: 40, cause: 'cause of death:\nthe rebound' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: sea, render: OUT, cam: { orbit: [[0, 0, 0], 17, 15, 6, 5, 0.7, 0.45, [0, 0.5, 0]] },
        build: (S) => carrier(S, [0, 0, 0]),
        tags: [['WW2 · BRITAIN', 0.2, 0.15], ['AN AIRCRAFT CARRIER', V('hook', 'aircraft'), 0.22], ['MADE OF ICE', V('hook', 'ice'), 0.29, { col: '#7ad0ff', px: 46 }]] },
      // the lab: a slab of pykrete with its fibres; a crack runs in and stops dead at the fibres
      pykrete: { set: 'lab', cam: { orbit: [[0, 0, 0], 2.6, 2.3, 1.3, 1.25, -0.3, 0.1, [0, 1.15, 0]] },
        build: (S) => { stand(S, [0, 0, 0], 0.5, 0.35, 0.65); S.box((p) => add(p, [0, 1.0, 0]), 0.5, 0.3, 0.25, PYK, { bevel: 0.05, paint: (c, w, h) => { c.strokeStyle = 'rgba(120,90,50,0.6)'; c.lineWidth = 3; const r = H.rng(5); for (let i = 0; i < 60; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + r.range(-20, 20), y + r.range(-20, 20)); c.stroke(); } } }); },
        over: (ctx, W, H_, t, u, S) => { const k = ramp(t, V('pykrete', 'cracks') - 0.2, 0.6); if (k <= 0) return; const a = S.proj([-0.5, 1.2, 0.26]), b = S.proj([-0.15, 0.95, 0.26]); ctx.save(); ctx.strokeStyle = '#1a1820'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(a[0], a[1]); for (let i = 1; i <= 5; i++) ctx.lineTo(a[0] + (b[0] - a[0]) * (i / 5) * k + (i % 2 ? 8 : -8), a[1] + (b[1] - a[1]) * (i / 5) * k); ctx.stroke(); if (k >= 1) { FX.no(ctx, b[0] + 10, b[1], 26, ramp(t, V('pykrete', 'spreading'), 0.3)); } ctx.restore(); },
        tags: [['ICE + ~14% WOOD PULP', V('pykrete', 'pykrete'), 0.15, { col: '#ffd24a' }], ['FIBRES STOP CRACKS', V('pykrete', 'cracks'), 0.22], ['TOUGHER · MELTS SLOWER', V('pykrete', 'tougher'), 0.29, { col: '#7ee07a' }]] },
      plan: { set: sea, render: OUT, cam: { orbit: [[0, 0, 0], 16, 15, 2.5, 2.2, -0.4, -0.15, [0, 0.8, 0]] },
        build: (S, t) => { if (t < V('plan', 'small')) carrier(S, [0, 0, 0], { pipes: t > V('plan', 'refrigeration') - 0.2 }); else { S.quad([[-60, 0.02, -60], [60, 0.02, -60], [60, 0.02, 30], [-60, 0.02, 30]], [80, 120, 150], { bg: true }); for (let i = 0; i < 9; i++) tree(S, -12 + i * 3, -9, 2.2, i); carrier(S, [0, 0, 0], { s: 0.25 }); } },
        tags: [['600 m LONG', V('plan', 'six'), 0.15, { col: '#ffd24a' }], ['FROZEN BY PIPES', V('plan', 'refrigeration'), 0.22, { col: '#7ad0ff' }], ['PROTOTYPE · CANADA', V('plan', 'small'), 0.29]] },
      // the demo: a general dummy fires at the ice (it shatters) and at the pykrete (the bullet bounces back)
      shot: { set: 'office', setOpt: { chart: 'ICE SHIP' }, cam: { orbit: [[0, 0, -1.4], 3.6, 3.3, 1.5, 1.4, 0.4, 0.15, [0, 0.95, 0]] },
        build: (S, t) => blocks(S, t, H.clamp((t - V('shot', 'shattered') + 0.1) / 0.8)),
        crew: [{ who: 'general', pos: [-1.1, 0, -0.1], pose: 'point', yaw: Math.PI - 0.5 }],
        over: (ctx, W, H_, t, u, S) => { const b = V('shot', 'bounced'); tracer(ctx, S, [[-0.9, 1.45, -0.5], [0.6, 0.98, -1.2], [0.8, 1.5, 0.3]], (t - b + 0.2) / 0.5); if (t > b) FX.sparks(ctx, S.proj([0.6, 1.0, -1.2])[0], S.proj([0.6, 1.0, -1.2])[1], (t - b) / 0.4, 9); },
        flash: [V('shot', 'shattered')],
        tags: [['ICE: SHATTERS', V('shot', 'shattered'), 0.15, { col: '#7ad0ff' }], ['PYKRETE: BULLET BOUNCES', V('shot', 'bounced'), 0.22, { col: '#ffd24a' }]] },
      cancel: { set: 'office', setOpt: { chart: 'COSTS' }, cam: { orbit: [[0, 0, -1.4], 3.6, 3.3, 1.5, 1.4, -0.3, 0.0, [0, 1.0, 0]] },
        crew: (t) => [{ who: 'boss', pos: [0.2, 0, -2.1], pose: t > V('cancel', 'cancelled') ? 'point' : 'stand', yaw: 0, sweat: 1 }],
        tags: [['COSTS KEPT CLIMBING', V('cancel', 'Costs'), 0.15, { col: '#ff6a5a' }], ['CANCELLED', V('cancel', 'cancelled'), 0.22]] },
      // the demo again, with Dave standing right where the ricochet goes
      end: { set: 'office', setOpt: { chart: 'ICE SHIP' }, cam: { orbit: [[0.3, 0, -0.4], 5, 5.4, 1.6, 1.7, -0.35, -0.2, [0, 1.0, 0]] },
        build: (S, t) => blocks(S, t, 0),
        crew: [{ who: 'general', pos: [-1.1, 0, -0.1], pose: 'point', yaw: Math.PI - 0.5 }],
        dave: (t) => { const hit = V('end', 'bounced') + 0.1, u = H.clamp((t - hit) / 1.2); return { pos: [0.8, 0, 0.3], pose: 'thumbs', yaw: -0.4, t, death: u > 0 ? 'launch' : undefined, u, to: [2.5, 1, 2.5], arc: 1.2, mouth: u > 0 ? 1 : 0 }; },
        over: (ctx, W, H_, t, u, S) => { const hit = V('end', 'bounced') + 0.1; tracer(ctx, S, [[-0.9, 1.45, -0.5], [0.6, 0.98, -1.2], [0.8, 1.5, 0.3]], (t - hit + 0.45) / 0.5); },
        flash: [V('end', 'bounced') + 0.1], shake: V('end', 'bounced') + 0.1 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.tone(0.1, { f: 'D3', type: 'triangle', dur: 0.8, gain: 0.06, minor: true }); k.play('stamp', V('hook', 'ice'), { gain: 0.45 });
      k.play('glitch', V('pykrete', 'cracks'), { gain: 0.3 }); k.play('thud', V('pykrete', 'spreading'), { gain: 0.35 });
      k.play('ding', V('plan', 'refrigeration'), { gain: 0.25 });
      k.play('slap', V('shot', 'bullet') - 0.05, { gain: 0.6 }); k.play('impact', V('shot', 'shattered'), { gain: 0.5 }); k.play('slap', V('shot', 'bounced') - 0.2, { gain: 0.6 }); k.play('ding', V('shot', 'bounced'), { f: 3000, gain: 0.35 });
      k.play('stamp', V('cancel', 'cancelled'), { gain: 0.5 });
      k.play('slap', V('end', 'bounced') - 0.35, { gain: 0.6 }); k.play('ding', V('end', 'bounced') - 0.1, { f: 3000, gain: 0.35 }); k.play('impact', V('end', 'bounced') + 0.1, { gain: 0.6 });
    },
  });
