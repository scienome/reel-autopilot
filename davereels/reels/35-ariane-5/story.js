  // Dave reel 35: Ariane 5 flight 501 (4 June 1996). Reused Ariane 4 code converted the horizontal velocity from a 64-bit
  // float to a 16-bit integer; it overflowed, both inertial computers crashed, the rocket broke up. R.I.P. Dave #34.
  const WHT = [240, 240, 244];
  // the rocket: core stage and two boosters; pitch tips it over around its base; o.broken drops the boosters away
  const ariane = (S, c, o = {}) => { const T = (p) => add(rotZ(mul(p, o.s || 1), o.pitch || 0), c), br = o.broken || 0;
    S.cyl((p) => T(p), 0.5, 5.2, WHT, 16); S.cyl((p) => T(add(p, [0, 5.2, 0])), 0.55, 1.3, WHT, 16, { top: 0.05 });
    for (const sx of [-1, 1]) S.cyl((p) => T(add(rotZ(p, sx * br * 0.8), [sx * (0.85 + br * 1.5), -br * 2, 0])), 0.3, 3.8, [230, 230, 236], 12, { top: 0.12 });
    if (o.fire) for (const x of [0, -0.85, 0.85]) S.ico(T([x + (o.noz || 0) * 0.3, -0.5, 0]), [0.25, 0.7 + 0.15 * Math.sin((o.t || 0) * 40 + x), 0.25], [255, 210, 110], { sub: 1, glow: true, noShadow: true }); };
  const boom = (ctx, S, at, t, t0, R = 320) => { const k = (t - t0) / 1.3; if (k < 0 || k > 1) return; const p = S.proj(at); ctx.save(); ctx.globalAlpha = 1 - k; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 60 + R * k); g.addColorStop(0, '#fff6d0'); g.addColorStop(0.4, '#ffb040'); g.addColorStop(1, 'rgba(200,80,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], 60 + R * k, 0, TAU); ctx.fill(); ctx.restore(); FX.sparks(ctx, p[0], p[1], k, 4); };
  // a row of bit cells: n cells across width w at y; fill = how many are lit, red = overflow
  const bits = (ctx, x, y, w, n, fill, col, label) => { const cw = w / n; ctx.save(); for (let i = 0; i < n; i++) { ctx.fillStyle = i < fill ? col : 'rgba(255,255,255,0.15)'; ctx.fillRect(x + i * cw + 1, y, cw - 2, 34); } ctx.fillStyle = '#ffffff'; ctx.font = FONT(800, 26); ctx.textAlign = 'left'; ctx.fillText(label, x, y - 12); ctx.restore(); };
  makeDave({
    rip: { n: 34, cause: 'cause of death:\nworked fine last time' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'launchpad', setOpt: { rocket: false }, cam: { orbit: [[0, 0, -3], 18, 17, 3, 5, 0.4, 0.25, [0, 7, 0]] },
        build: (S, t) => { const b = V('hook', 'thirty-seven'), y = Math.max(0, (t - 0.2) ** 2 * 0.9); if (t < b) ariane(S, [-0.6, y, -3], { fire: t > 0.2, t, pitch: t > b - 1 ? (t - b + 1) * 0.5 : 0 }); },
        over: (ctx, W, H_, t, u, S) => { const b = V('hook', 'thirty-seven'), y = Math.max(0, (b - 0.2) ** 2 * 0.9); boom(ctx, S, [-0.6, y + 3, -3], t, b); },
        flash: [V('hook', 'thirty-seven')], tags: [['ARIANE 5 · 1996', 0.2, 0.15], ['37 SECONDS', V('hook', 'thirty-seven'), 0.22, { col: '#ff6a5a', px: 46 }]] },
      // the code: a fat 64-bit value poured into a 16-bit box
      code: { set: 'lab', setOpt: { board: ['ARIANE 4 code', 'copy · paste', 'ship it'] }, cam: { orbit: [[0, 0, -1], 4.2, 3.8, 1.5, 1.4, 0.3, -0.1, [0, 1.0, 0]] },
        crew: [{ who: 'engineer', pos: [1.2, 0, -0.6], pose: 'thumbs', yaw: -0.6 }],
        over: (ctx, W, H_, t) => { const a = ramp(t, V('code', 'sixty-four') - 0.2, 0.3); if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(20,20,28,0.85)'; ctx.fillRect(W * 0.06, H_ * 0.56, W * 0.88, H_ * 0.22); bits(ctx, W * 0.1, H_ * 0.6, W * 0.8, 64, 64, '#7ad0ff', '64-BIT FLOAT'); bits(ctx, W * 0.1, H_ * 0.7, W * 0.2, 16, 16 * ramp(t, V('code', 'sixteen'), 0.6), '#ffd24a', '16-BIT INTEGER'); ctx.restore(); },
        tags: [['REUSED FROM ARIANE 4', V('code', 'reused'), 0.15], ['SIDEWAYS SPEED', V('code', 'sideways'), 0.22, { col: '#ffd24a' }]] },
      // the overflow: the value grows past 32,767; both inertial computers go red one after the other
      overflow: { set: 'lab', cam: { orbit: [[0, 0, -1], 3.6, 3.2, 1.4, 1.3, -0.2, 0.1, [0, 1.0, 0]] },
        build: (S, t) => { [-0.6, 0.6].forEach((x, i) => { const dead = t > (i ? V('overflow', 'same', 2) : V('overflow', 'crashed')); S.box((p) => add(p, [x, 1.15, -1.2]), 0.35, 0.3, 0.25, [50, 54, 64], { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = dead ? (Math.sin(t * 16) > 0 ? '#ff4a3a' : '#6a1a1a') : '#5aff7a'; c.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.5); c.fillStyle = '#1a1820'; c.font = FONT(800, h * 0.25); c.textAlign = 'center'; c.fillText(dead ? 'ERROR' : 'OK', w / 2, h * 0.45); c.fillStyle = '#e8e8ee'; c.fillText(i ? 'BACKUP' : 'MAIN', w / 2, h * 0.85); } }); }); },
        over: (ctx, W, H_, t) => { const v = Math.round(20000 + 30000 * H.clamp((t - BEAT0('overflow')) / 2.5)), over = v > 32767; ctx.save(); ctx.fillStyle = 'rgba(20,20,28,0.85)'; ctx.fillRect(W * 0.15, H_ * 0.62, W * 0.7, H_ * 0.1); ctx.font = FONT(800, 46); ctx.textAlign = 'center'; ctx.fillStyle = over ? '#ff6a5a' : '#ffffff'; ctx.fillText(over ? v.toLocaleString('en') + ' > 32,767' : v.toLocaleString('en'), W / 2, H_ * 0.685); ctx.restore(); },
        tags: [["DOESN'T FIT", V('overflow', "didn't"), 0.15, { col: '#ff6a5a' }], ['BACKUP: SAME CODE', V('overflow', 'backup'), 0.22, { col: '#ffd24a' }]] },
      boom: { set: 'sky', cam: { orbit: [[0, 30, 0], 22, 21, -1, 0, 0.3, 0.45, [0, 3, 0]] },
        build: (S, t) => { const d = V('boom', 'destroyed'), k = H.clamp((t - BEAT0('boom')) / (d - BEAT0('boom'))); if (t < d) ariane(S, [0, 30, 0], { fire: true, t, noz: k, pitch: -1.2 * k * k, broken: t > V('boom', 'breaking') ? H.clamp((t - V('boom', 'breaking')) / 1.0) : 0 }); },
        over: (ctx, W, H_, t, u, S) => boom(ctx, S, [1.5, 32, 0], t, V('boom', 'destroyed'), 420), flash: [V('boom', 'destroyed')], shake: V('boom', 'destroyed'),
        tags: [['NOZZLES HARD OVER', V('boom', 'nozzles'), 0.15, { col: '#ff6a5a' }], ['4 SATELLITES LOST', V('boom', 'Four'), 0.22, { col: '#ffd24a' }]] },
      // Dave on the pad with a printout, thumbs up. A booster comes back down on him.
      end: { set: 'launchpad', setOpt: { rocket: false }, cam: { orbit: [[0, 0, 0], 4.4, 4.8, 1.3, 1.7, 0.4, 0.25, [0, 1.3, 0]] },
        build: (S, t) => { const hit = V('end', 'fine') - 0.2, k = H.clamp((t - hit + 0.45) / 0.45); if (k > 0) S.cyl((p) => add(rotZ(p, 0.4), [0.3, 7 * (1 - H.ease.in(k)) + 0.2, 0]), 0.3, 2.6, [230, 230, 236], 12, { top: 0.12 }); },
        dave: (t) => { const hit = V('end', 'fine') - 0.2, u = H.clamp((t - hit) / 0.15); return { pos: [0, 0, 0], pose: 'thumbs', t, death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5 }; },
        flash: [V('end', 'fine') - 0.2], shake: V('end', 'fine') - 0.2 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0.2, { dur: V('hook', 'thirty-seven') - 0.2, color: 'brown', filter: 'lowpass', f: 400, gain: 0.35, a: 0.2 }); k.play('impact', V('hook', 'thirty-seven'), { gain: 0.8 });
      k.play('paper', V('code', 'reused'), { gain: 0.3 }); k.play('riser', V('code', 'squeezed'), { dur: 1.0, gain: 0.3 });
      k.play('error', V('overflow', 'crashed'), { gain: 0.45 }); k.play('error', V('overflow', 'same', 2), { gain: 0.45 });
      k.noise(BEAT0('boom'), { dur: V('boom', 'destroyed') - BEAT0('boom'), color: 'brown', filter: 'lowpass', f: 400, gain: 0.3, a: 0.2 }); k.play('impact', V('boom', 'destroyed'), { gain: 0.9 });
      k.play('whoosh', V('end', 'fine') - 0.65, { dur: 0.45, gain: 0.5 }); k.play('impact', V('end', 'fine') - 0.2, { gain: 0.85 });
    },
  });
