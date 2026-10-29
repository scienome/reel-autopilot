  // Dave reel 43: what if Dave grew one inch taller every day? The square-cube law (Galileo, 1638): size x6 means
  // weight x216 but bone strength only x36, so six times the stress. Dave takes one more step. R.I.P. Dave #42.
  // the day counter HUD (like a stats card): day, height, a comparison line
  const hud = (ctx, W, H_, day, h, cmp, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = FONT(700, 22); ctx.textAlign = 'left'; ctx.fillText(`DAY ${day}`, 40, H_ * 0.11);
    ctx.fillStyle = '#ffffff'; ctx.font = FONT(800, 64); ctx.fillText(h, 40, H_ * 0.17); ctx.font = FONT(700, 22); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillText(cmp, 40, H_ * 0.2); ctx.fillStyle = '#d83a34'; ctx.fillRect(40, H_ * 0.215, 220, 30); ctx.fillStyle = '#fff'; ctx.font = FONT(800, 18); ctx.fillText('+1 INCH EVERY DAY', 52, H_ * 0.215 + 21); ctx.restore(); };
  const bone = (S, c, r, col) => { S.cyl((p) => add(rotX(p, Math.PI / 2), c), r, 0.12, col, 18, { cap: shade(col, 0.9) }); };
  makeDave({
    rip: { n: 42, cause: 'cause of death:\nmaths' },
    shots: ({ V, BEAT0 }) => ({
      // the garage: Dave on a height chart, getting taller frame by frame
      hook: { set: 'garage', cam: { orbit: [[0, 0, 0], 4.6, 4.2, 1.6, 1.8, 0.3, 0.1, [0, 1.3, 0]] },
        build: (S) => S.box((p) => add(p, [-0.7, 1.6, -3.1]), 0.15, 1.6, 0.02, [250, 250, 244], { bevel: 0, paint: (c, w, h) => { c.fillStyle = '#1c1a22'; for (let i = 0; i < 32; i++) c.fillRect(0, (i * h) / 32, i % 4 ? w * 0.3 : w * 0.6, 2); } }),
        dave: (t) => ({ pos: [0, 0, 0], pose: 'point', s: 1 + 0.05 * Math.floor(t * 1.5), t, look: [0, 1] }),
        over: (ctx, W, H_, t) => hud(ctx, W, H_, Math.floor(t * 1.5), `${Math.floor(t * 1.5)} inches`, 'TALLER THAN YESTERDAY'),
        tags: [['WHAT IF...?', 0.2, 0.3, { col: '#ffd24a', px: 46 }]] },
      // the city street a year later: Dave as tall as a four-storey building
      year: { set: 'city', cam: { orbit: [[0, 0, 0], 22, 20, 3, 4, 0.4, 0.2, [0, 6, 0]] },
        dave: (t) => ({ pos: [0, 0, 1], pose: 'walk', s: 6.2, t }), crew: [{ who: 'intern', pos: [2.5, 0, 3], pose: 'point', yaw: -0.6, mouth: 1 }],
        over: (ctx, W, H_) => hud(ctx, W, H_, 365, '11 m', 'AS TALL AS A 4-STOREY BUILDING'),
        tags: [['×6 IN EVERY DIRECTION', V('year', 'Six'), 0.3, { col: '#ffd24a' }]] },
      // the lab: weight as cubes stacking up, a bone cross-section only growing as a square
      cube: { set: 'lab', cam: { orbit: [[0, 0, 0], 3.6, 3.2, 1.6, 1.5, -0.2, 0.15, [0, 1.15, 0]] },
        build: (S, t) => { const k = ramp(t, V('cube', 'cube') - 0.2, 1.5); for (let i = 0; i < Math.floor(1 + 26 * k); i++) S.box((p) => add(p, [-0.9 + (i % 3) * 0.18, 1.0 + Math.floor(i / 9) * 0.18, -0.2 + (Math.floor(i / 3) % 3) * 0.18]), 0.08, 0.08, 0.08, [240, 150, 60], { bevel: 0.2 });
          const q = ramp(t, V('cube', 'square') - 0.2, 1.2); bone(S, [0.8, 1.25, 0], 0.08 + 0.25 * q, [244, 236, 216]); },
        crew: [{ who: 'scientist', pos: [0, 0, -1.2], pose: 'point', yaw: 0 }],
        tags: [['WEIGHT: ×216', V('cube', 'heavier'), 0.3, { col: '#ff6a5a' }], ['BONES: ×36', V('cube', 'Thirty-six'), 0.38, { col: '#7ee07a' }]] },
      // the road: giant Dave's legs with stress arrows growing red
      stress: { set: 'road', cam: { orbit: [[0, 0, 0], 16, 14, 1.0, 1.4, -0.4, -0.2, [0, 4, 0]] },
        dave: (t) => ({ pos: [0, 0, 0], pose: 'walk', s: 6.2, t: t * 0.4, sweat: 1 }),
        over: (ctx, W, H_, t) => { const a = ramp(t, V('stress', 'six') - 0.2, 0.4); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#ff4a3a'; ctx.lineWidth = 10; for (const x of [W * 0.42, W * 0.58]) { ctx.beginPath(); ctx.moveTo(x, H_ * 0.62); ctx.lineTo(x, H_ * 0.8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 18, H_ * 0.77); ctx.lineTo(x, H_ * 0.81); ctx.lineTo(x + 18, H_ * 0.77); ctx.stroke(); } ctx.restore(); },
        tags: [['SQUARE-CUBE LAW', V('stress', 'square-cube'), 0.3, { col: '#ffd24a' }], ['×6 STRESS', V('stress', 'six'), 0.38, { col: '#ff6a5a' }]] },
      // Galileo's page: a big bone next to a small one (his famous drawing)
      galileo: { set: 'office', setOpt: { chart: '1638' }, cam: { orbit: [[0, 0, -1.4], 3.8, 3.4, 1.5, 1.4, 0.3, 0.0, [0, 1.0, 0]] },
        crew: [{ who: 'scientist', pos: [0.2, 0, -2.1], pose: 'point', yaw: 0 }],
        over: (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(248,240,220,0.95)'; ctx.fillRect(W * 0.12, H_ * 0.58, W * 0.76, H_ * 0.16); ctx.fillStyle = '#3a2a1a'; ctx.beginPath(); ctx.ellipse(W * 0.32, H_ * 0.66, 70, 22, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(W * 0.66, H_ * 0.66, 160, 44, 0, 0, TAU); ctx.fill(); ctx.restore(); },
        tags: [['GALILEO · 1638', V('galileo', 'Galileo'), 0.3], ['NO GIANTS', V('galileo', 'giants'), 0.38, { col: '#ff6a5a' }]] },
      // one more step: the knees give, giant Dave folds flat into the road
      end: { set: 'road', cam: { orbit: [[0, 0, 0], 18, 17, 2.0, 2.4, 0.5, 0.35, [0, 3.5, 0]] },
        dave: (t) => { const hit = V('end', 'more') + 0.1, u = H.clamp((t - hit) / 0.35); return { pos: [0, 0, 0], pose: 'walk', s: 6.2, t: Math.min(t, hit) * 0.6, death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5, mouth: u > 0 ? 1 : 0 }; },
        flash: [V('end', 'more') + 0.2], shake: V('end', 'more') + 0.2 },
    }),
    sound: (k, { V, BEAT0 }) => {
      for (let i = 0; i < 6; i++) k.play('tick', 0.3 + i * 0.66, { f: 1400, gain: 0.2, minor: true });
      k.play('stamp', V('year', 'Six'), { gain: 0.4 }); for (let i = 0; i < 6; i++) k.play('thud', BEAT0('year') + 0.3 + i * 0.6, { f: 60, gain: 0.3, minor: true });
      k.play('riser', V('cube', 'cube') - 0.2, { dur: 1.5, gain: 0.3 }); k.play('error', V('cube', 'square'), { gain: 0.3 });
      k.play('buzz', V('stress', 'six'), { gain: 0.3 }); k.play('ding', V('galileo', 'Galileo'), { gain: 0.3 });
      k.play('thud', V('end', 'more') - 0.2, { f: 50, gain: 0.6 }); k.play('glitch', V('end', 'more') + 0.05, { gain: 0.5 }); k.play('impact', V('end', 'more') + 0.2, { gain: 0.9 });
    },
  });
