  // Dave reel 32: Knight Capital (1 August 2012). New code went to 7 of 8 servers; a reused flag woke dead "Power Peg"
  // code on the eighth, which traded wildly for 45 minutes and lost $440 million. Dave copied the files. R.I.P. Dave #31.
  const RACK = [44, 48, 58];
  // the server room: eight racks in a row along x. done(i) = 0..1 copy progress, bad = index of the rack left out
  const racks = (S, t, o = {}) => {
    S.quad([[-12, 0, -3], [12, 0, -3], [12, 0, 12], [-12, 0, 12]], [70, 74, 84], { bg: true, grid: [0.6, 'rgba(255,255,255,0.08)'] });
    S.quad([[-12, 0, -3], [12, 0, -3], [12, 4, -3], [-12, 4, -3]], [40, 44, 54], { bg: true });
    for (let i = 0; i < 8; i++) { const x = -2.8 + i * 0.8, d = o.done ? o.done(i) : 0, bad = i === o.bad && o.wild;
      S.box((p) => add(p, [x, 1.0, -1.6]), 0.3, 1.0, 0.4, RACK, { bevel: 0.05, paint: (c, w, h) => { for (let k = 0; k < 10; k++) { c.fillStyle = bad ? (Math.sin(t * 20 + k) > 0 ? '#ff4a3a' : '#5a1a1a') : d >= 1 ? '#5aff7a' : (k / 10 < d ? '#5aff7a' : '#ffb03a'); c.fillRect(w * 0.15, h * (0.06 + k * 0.09), w * 0.12, h * 0.03); c.fillStyle = 'rgba(255,255,255,0.08)'; c.fillRect(w * 0.35, h * (0.06 + k * 0.09), w * 0.5, h * 0.05); } } });
      write3(S, x, i + 1); }
  };
  const write3 = (S, x, n) => S.box((p) => add(p, [x, 2.15, -1.6]), 0.2, 0.1, 0.02, [230, 230, 236], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#1a1820'; c.font = FONT(800, h * 0.7); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(n), w / 2, h / 2); } });
  const ticker = (ctx, W, H_, t, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = FONT(800, 30); const r = H.rng(5); for (let i = 0; i < 18; i++) { const buy = i % 2 === 0, y = H_ * (0.56 + (i % 9) * 0.045), x = ((r() * W * 2 - t * r.range(300, 600)) % (W + 300) + W + 300) % (W + 300) - 150; ctx.fillStyle = buy ? '#5aff7a' : '#ff6a5a'; ctx.fillText(buy ? 'BUY HIGH ▲' : 'SELL LOW ▼', x, y); } ctx.restore(); };
  const counter = (ctx, W, H_, v) => { ctx.save(); ctx.fillStyle = 'rgba(20,20,28,0.85)'; ctx.fillRect(W * 0.15, H_ * 0.3, W * 0.7, H_ * 0.08); ctx.fillStyle = '#ff6a5a'; ctx.font = FONT(800, 52); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('−$' + Math.round(v) + ' MILLION', W / 2, H_ * 0.34); ctx.restore(); };
  makeDave({
    rip: { n: 31, cause: 'cause of death:\n7 out of 8' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'office', setOpt: { chart: 'AUG 1, 2012' }, cam: { orbit: [[0, 0, -1.4], 3.6, 3.2, 1.6, 1.5, -0.4, 0.2, [0, 1.1, 0]] },
        crew: (t) => [{ who: 'boss', pos: [0.3, 0, -2.1], pose: 'stand', yaw: 0, sweat: 1, mouth: 1, t }],
        over: (ctx, W, H_, t) => counter(ctx, W, H_, 440 * H.clamp(t / 4)),
        tags: [['2012', 0.2, 0.15], ['IN 45 MINUTES', V('hook', 'forty-five'), 0.22, { col: '#ffd24a' }]] },
      // the server room: the intern dummy copies the code onto racks 1-7, rack 8 stays on the old code
      servers: { set: (S, t) => racks(S, t, { done: (i) => (i === 7 ? 0 : H.clamp((t - BEAT0('servers') - i * 0.35) / 0.6)) }), render: { bg: '#20222c', dof: 0.2, focus: 4.5 }, cam: { orbit: [[0.6, 0, -1.6], 6.0, 5.6, 1.8, 1.7, 1.05, 0.85, [0, 1.1, 0]] },
        crew: (t) => [{ who: 'intern', pos: [-0.6 + 0.8 * Math.min(6, Math.floor((t - BEAT0('servers')) / 0.35)) - 2.2, 0, -0.8], pose: 'hold', yaw: Math.PI, t }],
        tags: [['8 SERVERS', V('servers', 'eight'), 0.15], ['MISSED ONE', V('servers', 'missed'), 0.22, { col: '#ff6a5a' }]] },
      // rack 8 close up: the old switch flips, the dead code lights up red
      flag: { set: (S, t) => racks(S, t, { done: (i) => (i === 7 ? 0 : 1), bad: 7, wild: t > V('flag', 'woke') }), render: { bg: '#20222c', dof: 0.3, focus: 2.2 }, cam: { orbit: [[2.8, 0, -1.6], 2.4, 2.0, 1.3, 1.2, 0.5, 0.2, [0, 1.1, 0]] },
        build: (S, t) => { const on = t > V('flag', 'switch') ? 1 : 0; S.box((p) => add(p, [2.8, 1.4, -1.18]), 0.12, 0.08, 0.02, [230, 230, 236], { bevel: 0.2 }); S.box((p) => add(rotX(p, on ? -0.7 : 0.7), [2.8, 1.4, -1.12]), 0.02, 0.07, 0.02, on ? [255, 80, 60] : [120, 120, 128], { bevel: 0.3, glow: !!on }); },
        tags: [['OLD SWITCH, REUSED', V('flag', 'reused'), 0.15], ['"POWER PEG" WAKES UP', V('flag', 'Power'), 0.22, { col: '#ff6a5a' }]] },
      spree: { set: 'stage', setOpt: { slide: 'BUY HIGH · SELL LOW' }, cam: { orbit: [[0, 0, -1.2], 4.4, 4.0, 1.5, 1.4, 0.3, -0.2, [0, 1.2, 0]] },
        crew: (t) => [{ who: 'boss', pos: [-0.4, 0.3, -1.0], pose: 'flail', yaw: 0.3, t, sweat: 1, mouth: 1 }, { who: 'engineer', pos: [0.8, 0.3, -1.2], pose: t > V('spree', 'pulled') ? 'hold' : 'flail', yaw: -0.3, t, sweat: 1 }],
        over: (ctx, W, H_, t) => { ticker(ctx, W, H_, t, 1 - ramp(t, V('spree', 'pulled'), 0.3)); counter(ctx, W, H_, 440 * H.clamp((t - BEAT0('spree')) / (V('spree', 'minute') - BEAT0('spree')))); },
        tags: [['MILLIONS OF ORDERS', V('spree', 'millions'), 0.15], ['~$10M A MINUTE', V('spree', 'ten'), 0.22, { col: '#ffd24a' }]] },
      // Dave copies the files... onto seven racks. The eighth spits out every order at once and buries him.
      end: { set: (S, t) => racks(S, t, { done: (i) => (i === 7 ? 0 : 1), bad: 7, wild: true }), render: { bg: '#20222c', dof: 0.2, focus: 4 }, cam: { orbit: [[1.6, 0, -1.6], 4.4, 4.8, 1.4, 1.7, 0.45, 0.3, [0, 1.2, 0]] },
        build: (S, t) => { const hit = V('end', 'files') + 0.1, k = H.clamp((t - hit + 0.35) / 0.35); if (k > 0) S.box((p) => add(p, [2.4, 0.35 + 4 * (1 - H.ease.in(k)), -0.6]), 0.5, 0.35, 0.4, [250, 250, 246], { bevel: 0.05, paint: (c, w, h) => { c.strokeStyle = 'rgba(0,0,0,0.25)'; for (let i = 1; i < 14; i++) { c.beginPath(); c.moveTo(0, (i * h) / 14); c.lineTo(w, (i * h) / 14); c.stroke(); } } }); },
        dave: (t) => { const hit = V('end', 'files') + 0.1, u = H.clamp((t - hit) / 0.15); return { pos: [2.4, 0, -0.6], pose: 'thumbs', t, yaw: -0.4, death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5 }; },
        over: (ctx, W, H_, t) => ticker(ctx, W, H_, t, 0.6),
        flash: [V('end', 'files') + 0.1], shake: V('end', 'files') + 0.1 },
    }),
    sound: (k, { V, BEAT0 }) => {
      for (let i = 0; i < 12; i++) k.play('blip', 0.2 + i * 0.3, { f: 900 - i * 50, gain: 0.15, minor: true }); k.play('error', V('hook', 'forty-five'), { gain: 0.35 });
      for (let i = 0; i < 7; i++) k.play('ding', BEAT0('servers') + i * 0.35 + 0.6, { f: 1200, gain: 0.12, minor: true }); k.play('error', V('servers', 'missed'), { gain: 0.4 });
      k.play('click', V('flag', 'switch'), { gain: 0.5 }); k.play('glitch', V('flag', 'woke'), { gain: 0.45 });
      for (let i = 0; i < 20; i++) k.play('tick', BEAT0('spree') + i * 0.2, { f: 2000 + (i % 3) * 400, gain: 0.12, minor: true });
      k.play('press', V('spree', 'pulled'), { gain: 0.4 });
      k.play('whoosh', V('end', 'files') - 0.25, { dur: 0.35, gain: 0.5 }); k.play('impact', V('end', 'files') + 0.1, { gain: 0.8 }); k.play('paper', V('end', 'files') + 0.12, { gain: 0.6 });
    },
  });
