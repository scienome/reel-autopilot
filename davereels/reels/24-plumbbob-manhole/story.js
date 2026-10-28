  // Dave reel 24: Operation Plumbbob, test Pascal-B (Nevada, 1957). The shaft became a gun barrel and the 900 kg steel
  // lid left at an estimated 66 km/s. Dave sat on it for luck. R.I.P. Dave #23.
  const SOIL = [176, 120, 82], STEEL = [120, 124, 134];
  // a cut-away of the ground: the shaft (painted), the device at the bottom, the lid on top. lift = lid height (m)
  const cutaway = (S, t, o = {}) => {
    S.box((p) => add(p, [0, -3.2, 0]), 2.6, 3.2, 0.6, SOIL, { bevel: 0.02, paint: (c, w, h) => { c.fillStyle = 'rgba(0,0,0,0.18)'; for (let i = 0; i < 9; i++) c.fillRect(0, (i * h) / 9, w, 3); c.fillStyle = '#2a2224'; c.fillRect(w * 0.47, 0, w * 0.06, h * 0.96); if (o.gas) { const g = c.createLinearGradient(0, h, 0, h * (1 - o.gas)); g.addColorStop(0, '#fff2b0'); g.addColorStop(1, '#ff7a3a'); c.fillStyle = g; c.fillRect(w * 0.47, h * (0.96 - 0.96 * o.gas), w * 0.06, h * 0.96 * o.gas); } } });
    S.ico([0, -6.0, 0.62], 0.16, o.gas ? [255, 240, 180] : [120, 220, 140], { sub: 1, glow: true, noShadow: true });
    S.cyl((p) => add(p, [0, (o.lift || 0) + 0.02, 0.3]), 0.42, 0.1, STEEL, 18, { cap: [150, 154, 164] });
  };
  const streak = (ctx, S, a, b, w = 16) => { const p = S.proj(a), q = S.proj(b); const g = ctx.createLinearGradient(p[0], p[1], q[0], q[1]); g.addColorStop(0, 'rgba(255,250,220,1)'); g.addColorStop(1, 'rgba(255,140,60,0)'); ctx.save(); ctx.strokeStyle = g; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.restore(); };
  makeDave({
    rip: { n: 23, cause: 'cause of death:\nescape velocity' },
    shots: ({ V, BEAT0 }) => ({
      // the hook: a glowing streak shoots out of the desert floor straight up
      hook: { set: 'desert', cam: { orbit: [[0, 0, 0], 14, 12, 2, 1.6, 0.25, 0.05, [0, 5, 0]] },
        over: (ctx, W, H_, t, u, S) => { const y = ((t * 30) % 40); streak(ctx, S, [0, y + 2, 0], [0, Math.max(0, y - 10), 0], 20); },
        build: (S) => S.cyl((p) => add(p, [0, 0, 0]), 0.6, 0.15, [60, 60, 66], 16),
        flash: [0.15], tags: [['NEVADA · 1957', V('hook', 'nineteen'), 0.16], ['A MANHOLE COVER?', V('hook', 'manhole'), 0.24, { col: '#ffd24a' }]] },
      shaft: { set: 'desert', cam: { orbit: [[0, -3, 0], 11.5, 10.5, 3.8, 3.4, 0.15, -0.05, [0, 0.6, 0]] },
        build: (S, t) => cutaway(S, t),
        tags: [['150 m SHAFT', V('shaft', 'hundred'), 0.16], ['900 kg STEEL LID', V('shaft', 'nine'), 0.24, { col: '#ffd24a' }]] },
      // the gas front climbs the shaft like a bullet up a barrel, the lid starts to bulge
      barrel: { set: 'desert', cam: { orbit: [[0, -3, 0], 11, 10, 3.6, 4.2, -0.1, 0.15, [0, 1.2, 0]] },
        build: (S, t) => { const g = ramp(t, V('barrel', 'Superheated') - 0.4, 1.3); cutaway(S, t, { gas: Math.max(0.05, g), lift: g > 0.98 ? 3 * (t - V('barrel', 'below')) : 0 }); },
        flash: [V('barrel', 'blast')], shake: V('barrel', 'blast'),
        tags: [['= GUN BARREL', V('barrel', 'gun'), 0.16, { col: '#ff6a5a' }]] },
      // the camera crew: a scientist dummy by a high-speed camera; the lid is a smear in one frame
      speed: { set: 'desert', cam: { orbit: [[0, 0, 0], 6, 5.5, 1.4, 1.6, -0.5, -0.2, [0, 2.2, 0]] },
        crew: [{ who: 'scientist', pos: [-1.2, 0, 0.6], pose: 'point', yaw: 0.6, mouth: 0.8 }],
        build: (S) => { S.box((p) => add(p, [-0.5, 1.15, 0.9]), 0.18, 0.14, 0.25, [40, 40, 48], { bevel: 0.2 }); S.cyl((p) => add(rotX(p, -1.1), [-0.5, 1.2, 0.6]), 0.07, 0.25, [30, 30, 36], 10); for (const a of [-0.4, 0.4]) S.rod([-0.5, 1.0, 0.9], [-0.5 + a, 0, 0.9 + a * 0.5], 0.02, [80, 80, 90], 6); },
        over: (ctx, W, H_, t, u, S) => { const fr = ramp(t, V('speed', 'single') - 0.2, 0.2); if (fr > 0) { ctx.save(); ctx.globalAlpha = fr; ctx.fillStyle = '#1a1820'; ctx.fillRect(W * 0.55, H_ * 0.58, W * 0.36, H_ * 0.2); ctx.strokeStyle = '#f4f2ee'; ctx.lineWidth = 4; ctx.strokeRect(W * 0.55, H_ * 0.58, W * 0.36, H_ * 0.2); ctx.fillStyle = 'rgba(255,230,180,0.9)'; ctx.beginPath(); ctx.ellipse(W * 0.73, H_ * 0.68, 16, 70, 0, 0, TAU); ctx.fill(); ctx.restore(); } },
        tags: [['1 FRAME', V('speed', 'single'), 0.16], ['~66 km/s', V('speed', 'sixty-six'), 0.24, { col: '#ffd24a', px: 48 }], ['6× ESCAPE VELOCITY', V('speed', 'Six'), 0.32]] },
      // the lid heating up as it tears through the air, then a puff of glowing dust
      gone: { set: 'sky', cam: { orbit: [[0, 0, 0], 2.6, 2.2, 0.4, 0.8, 0, 0.3, [0, 0, 0]] },
        build: (S, t) => { const k = H.clamp((t - BEAT0('gone')) / 2.4); if (k < 0.9) S.cyl((p) => add(rotX(p, t * 3), [0, 0, 0]), 0.42 * (1 - 0.6 * k), 0.1, [Math.min(255, 140 + 140 * k), 120, 90], 18, { glow: k > 0.3 }); },
        over: (ctx, W, H_, t) => { const k = H.clamp((t - BEAT0('gone')) / 2.4); if (k > 0.85) FX.sparks(ctx, W / 2, H_ * 0.5, (k - 0.85) / 0.15, 3); },
        tags: [['NEVER FOUND', V('gone', 'never'), 0.16], ['BURNED UP?', V('gone', 'burned'), 0.24, { col: '#ff6a5a' }]] },
      // Dave sits on the new lid with a lucky horseshoe. Countdown. Gone.
      end: { set: 'desert', cam: { orbit: [[0, 0, 0], 4.2, 4.6, 1.2, 1.6, 0.35, 0.15, [0, 1.6, 0]] },
        build: (S, t) => { const t1 = V('end', 'luck') + 0.15, up = t > t1 ? 60 * (t - t1) : 0; S.cyl((p) => add(p, [0, up, 0]), 0.6, 0.12, STEEL, 18, { cap: [150, 154, 164] }); },
        dave: (t) => { const t1 = V('end', 'luck') + 0.15, up = t > t1 ? 60 * (t - t1) : 0; return { pos: [0, 0.12 + up, 0], pose: 'sit', t, yaw: 0, mouth: t > t1 ? 1 : 0, sweat: t > t1 - 0.3 ? 1 : 0 }; },
        over: (ctx, W, H_, t, u, S) => { const t1 = V('end', 'luck') + 0.15; if (t > t1 && t < t1 + 0.8) { const y = 60 * (t - t1); streak(ctx, S, [0, y, 0], [0, Math.max(0, y - 8), 0], 26); } },
        flash: [V('end', 'luck') + 0.15], shake: V('end', 'luck') + 0.15 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.play('whoosh', 0.1, { dur: 0.6, gain: 0.5 }); k.play('impact', 0.15, { gain: 0.5 });
      k.play('stamp', V('shaft', 'nine'), { gain: 0.4 });
      k.play('riser', V('barrel', 'Superheated') - 0.4, { dur: 1.3, gain: 0.35 });
      k.play('shutter', V('speed', 'single'), { gain: 0.5 }); k.play('ding', V('speed', 'Six'), { gain: 0.3 });
      k.noise(BEAT0('gone'), { dur: 2.4, color: 'pink', filter: 'bandpass', f: [[0, 600], [2.4, 2000]], q: 0.7, gain: 0.15, a: 0.2 });
      k.play('tick', V('end', 'luck') - 0.4, { gain: 0.3 }); k.play('whoosh', V('end', 'luck') + 0.15, { dur: 0.5, gain: 0.6 });
    },
  });
