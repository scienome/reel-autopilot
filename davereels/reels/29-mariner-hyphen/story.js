  // Dave reel 29: Mariner 1 (1962). A missing overbar in the hand-written guidance equations meant the velocity was not
  // smoothed; when the guidance signal dropped out the rocket steered wildly and was destroyed. Dave proofread it. R.I.P. Dave #28.
  const rocket = (S, c, o = {}) => { const T = (p) => add(rotZ(mul(p, o.s || 1), o.tilt || 0), c);
    S.cyl((p) => T(p), 0.35, 4.2, [236, 238, 242], 16); S.cyl((p) => T(add(p, [0, 4.2, 0])), 0.35, 0.9, [236, 238, 242], 16, { top: 0.02 });
    S.cyl((p) => T(add(p, [0, 2.0, 0])), 0.36, 0.3, [40, 60, 120], 16);
    for (let i = 0; i < 4; i++) S.box((p) => T(add(rotY(p, i * Math.PI / 2), [0.45, 0.35, 0])), 0.12, 0.35, 0.02, [200, 60, 50], { bevel: 0.1 });
    if (o.fire) S.ico(T([0, -0.4, 0]), [0.3, 0.6 + 0.15 * Math.sin((o.t || 0) * 40), 0.3], [255, 200, 90], { sub: 1, glow: true, noShadow: true });
  };
  const boom = (ctx, S, at, t, t0) => { const k = (t - t0) / 1.2; if (k < 0 || k > 1) return; const p = S.proj(at); ctx.save(); ctx.globalAlpha = 1 - k; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 60 + 280 * k); g.addColorStop(0, '#fff6d0'); g.addColorStop(0.4, '#ffb040'); g.addColorStop(1, 'rgba(200,80,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 60 + 280 * k, 0, TAU); ctx.fill(); ctx.restore(); FX.sparks(ctx, p[0], p[1], k, 7); };
  // the whiteboard formula, drawn flat: R with (or without) its bar, then raw vs smoothed speed curves
  const formula = (ctx, W, H_, t, V) => { const miss = ramp(t, V('bar', 'missing') - 0.1, 0.3), cx = W / 2, cy = H_ * 0.34; ctx.save(); ctx.fillStyle = 'rgba(250,250,250,0.94)'; ctx.fillRect(W * 0.1, H_ * 0.25, W * 0.8, H_ * 0.18); ctx.fillStyle = '#2a3a8a'; ctx.font = FONT(800, 80); ctx.textAlign = 'center'; ctx.fillText('Ṙ  =  ṙ  −  ...', cx, cy + 30);
    const bx = cx - 175; ctx.strokeStyle = '#2a3a8a'; ctx.lineWidth = 7; ctx.globalAlpha = 1 - miss; ctx.beginPath(); ctx.moveTo(bx - 30, cy - 52); ctx.lineTo(bx + 30, cy - 52); ctx.stroke(); ctx.globalAlpha = miss; ctx.strokeStyle = '#ec4a3a'; ctx.setLineDash([10, 8]); ctx.strokeRect(bx - 40, cy - 66, 80, 26); ctx.restore();
    const sm = ramp(t, V('bar', 'jitter') - 0.4, 0.4); if (sm <= 0) return; ctx.save(); ctx.globalAlpha = sm; ctx.fillStyle = 'rgba(20,20,28,0.85)'; ctx.fillRect(W * 0.1, H_ * 0.58, W * 0.8, H_ * 0.16); const r = H.rng(2);
    ctx.lineWidth = 5; ctx.strokeStyle = '#ff6a5a'; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const x = W * 0.13 + (i / 60) * W * 0.74, y = H_ * 0.66 + (r() - 0.5) * 70; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    ctx.strokeStyle = '#7ee07a'; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(W * 0.13, H_ * 0.66); ctx.lineTo(W * 0.87, H_ * 0.66); ctx.stroke(); ctx.restore(); };
  makeDave({
    rip: { n: 28, cause: 'cause of death:\nlooked fine to me' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'launchpad', setOpt: { rocket: false }, cam: { orbit: [[0, 0, -3], 16, 15, 3, 4, 0.4, 0.3, [0, 6, 0]] },
        build: (S, t) => { const y = Math.max(0, (t - 0.3) ** 2 * 0.5), b = V('hook', 'blown'); if (t < b) rocket(S, [-0.6, y, -3], { fire: t > 0.3, t, tilt: t > 1.5 ? 0.3 * Math.sin(t * 5) : 0 }); },
        over: (ctx, W, H_, t, u, S) => { const b = V('hook', 'blown'), y = Math.max(0, (b - 0.3) ** 2 * 0.5); boom(ctx, S, [-0.6, y + 2, -3], t, b); },
        flash: [V('hook', 'blown')], tags: [['MARINER 1 · 1962', 0.2, 0.15], ['DESTROYED AT 293 s', V('hook', 'five'), 0.22, { col: '#ff6a5a' }]] },
      bar: { set: 'lab', setOpt: { board: ['', '', ''] }, cam: { orbit: [[0, 0, -1], 4.6, 4.2, 1.5, 1.4, -0.2, 0.15, [0, 1.0, 0]] },
        crew: [{ who: 'scientist', pos: [1.4, 0, -0.6], pose: 'point', yaw: -0.5 }],
        over: (ctx, W, H_, t) => formula(ctx, W, H_, t, V),
        tags: [['MISSING: ONE BAR', V('bar', 'missing'), 0.15, { col: '#ff6a5a' }], ['BAR = SMOOTH IT', V('bar', 'smooth'), 0.5, { col: '#7ee07a' }]] },
      // the rocket over the sea, guidance lost, swinging left and right harder and harder
      fail: { set: 'sky', cam: { orbit: [[0, 30, 0], 16, 15, -2, -1, 0.2, 0.4, [0, 2, 0]] },
        build: (S, t) => { const lost = V('fail', 'lost'), k = H.clamp((t - lost) / 3), d = V('fail', 'self-destruct'); if (t < d) rocket(S, [3 * k * Math.sin(t * 2), 30 + (t - lost) * 0.3, 0], { fire: true, t, tilt: 0.9 * k * Math.sin(t * 3.2) }); },
        over: (ctx, W, H_, t, u, S) => { const d = V('fail', 'self-destruct'), lost = V('fail', 'lost'); boom(ctx, S, [0, 32 + (d - lost) * 0.3, 0], t, d); },
        flash: [V('fail', 'self-destruct')],
        tags: [['GUIDANCE SIGNAL: LOST', V('fail', 'lost'), 0.15], ['STEERING HARD', V('fail', 'steering'), 0.22, { col: '#ff6a5a' }], ['SELF-DESTRUCT', V('fail', 'self-destruct'), 0.29, { col: '#ffd24a' }]] },
      cost: { set: 'office', setOpt: { chart: 'VENUS: 0' }, cam: { orbit: [[0, 0, -1.4], 3.8, 3.4, 1.5, 1.4, 0.3, -0.1, [0, 1.0, 0]] },
        crew: [{ who: 'boss', pos: [0.2, 0, -2.1], pose: 'stand', yaw: 0, sweat: 1 }],
        tags: [['$18.5 MILLION', V('cost', 'Eighteen'), 0.15, { col: '#ffd24a', px: 46 }], ['"THE MOST EXPENSIVE', V('cost', 'most'), 0.22], ['HYPHEN IN HISTORY"', V('cost', 'hyphen'), 0.28], ['ARTHUR C. CLARKE', V('cost', 'Arthur'), 0.62, { px: 28 }]] },
      // Dave at his desk with a red pen, a thumbs-up for the formula. The rocket's nose comes down through the ceiling.
      end: { set: 'lab', cam: { orbit: [[0, 0, 0], 3.6, 3.9, 1.4, 1.6, 0.3, 0.15, [0, 1.1, 0]] },
        build: (S, t) => { const hit = V('end', 'proofread') + 0.15, k = H.clamp((t - hit + 0.45) / 0.45); S.box((p) => add(p, [0, 0.38, 0.4]), 0.5, 0.02, 0.3, [240, 240, 236], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#2a3a8a'; c.font = FONT(800, h * 0.25); c.textAlign = 'center'; c.fillText('R = r − ...', w / 2, h * 0.5); c.fillStyle = '#7ee07a'; c.fillText('✓', w * 0.85, h * 0.85); } });
          if (k > 0) rocket(S, [0.1, 5 * (1 - k) + 1.95, -0.1], { s: 0.35, tilt: Math.PI }); },
        dave: (t) => { const hit = V('end', 'proofread') + 0.15, u = H.clamp((t - hit) / 0.15); return { pos: [0, 0, -0.1], pose: 'thumbs', t, death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5 }; },
        flash: [V('end', 'proofread') + 0.15], shake: V('end', 'proofread') + 0.15 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0.3, { dur: V('hook', 'blown') - 0.3, color: 'brown', filter: 'lowpass', f: 400, gain: 0.35, a: 0.2 }); k.play('impact', V('hook', 'blown'), { gain: 0.8 });
      k.play('error', V('bar', 'missing'), { gain: 0.35 }); k.play('glitch', V('bar', 'jitter'), { gain: 0.3 });
      k.play('buzz', V('fail', 'lost'), { gain: 0.3 }); k.play('press', V('fail', 'self-destruct') - 0.1, { gain: 0.4 }); k.play('impact', V('fail', 'self-destruct'), { gain: 0.8 });
      k.play('coin', V('cost', 'Eighteen'), { gain: 0.35 });
      k.play('ding', V('end', 'proofread') - 0.3, { gain: 0.3 }); k.play('whoosh', V('end', 'proofread') - 0.3, { dur: 0.45, gain: 0.5 }); k.play('impact', V('end', 'proofread') + 0.15, { gain: 0.8 });
    },
  });
