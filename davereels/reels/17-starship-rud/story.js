  // Dave reel 17: "rapid unscheduled disassembly". Dave watches Starship from the front row with popcorn. The pad sends him some concrete. R.I.P. Dave #16.
  const BEATS = window.SCRIPT;
  const SH = [['pad', 0], ['ctrl', BEAT0('ctrl') - 0.1], ['flight', BEAT0('flight') - 0.1], ['concrete', V('flight', 'launch') - 0.2], ['success', BEAT0('success') - 0.1], ['dave', BEAT0('end') - 0.5]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const STEEL = [210, 214, 222], BOOST = [190, 194, 204], CONC = [170, 166, 158];
  // Starship on its booster: a tall steel cylinder (booster) with a nosecone ship on top, flaps; at x, base height y
  const starship = (S, p, o = {}) => {
    const s = o.s ?? 1, T = (q) => add(p, rotZ(mul(q, s), o.tilt || 0));
    S.cyl((q) => T(q), 4.5, 69, BOOST, 16, { gloss: 0.6 }); S.cyl((q) => T(add(q, [0, 69, 0])), 4.5, 40, STEEL, 16, { gloss: 0.6, caps: false }); S.cyl((q) => T(add(q, [0, 109, 0])), 4.5, 12, STEEL, 16, { r2: 0.3, gloss: 0.6 });
    for (const sx of [-1, 1]) { S.box((q) => T(add(q, [sx * 5.2, 104, 0])), 0.8, 3.5, 2.2, [60, 60, 66]); S.box((q) => T(add(q, [sx * 5.2, 72, 0])), 0.8, 3.5, 2.6, [60, 60, 66]); }
    if (o.fire) { for (let i = 0; i < 9; i++) S.ico(T([Math.cos(i) * 2 * (i % 3), -2 - i * 2.5 * o.fire, Math.sin(i) * 2 * (i % 3)]), 3 + i * 0.8, H.mix([255, 230, 150], [255, 120, 40], i / 9), { sub: 0, glow: true, noShadow: true }); }
  };
  const padSet = (S, o = {}) => {
    S.quad([[-600, 0, -600], [600, 0, -600], [600, 0, 600], [-600, 0, 600]], [200, 186, 150], { bg: true });
    S.quad([[-600, 0.01, -600], [600, 0.01, -600], [600, 0.01, -250], [-600, 0.01, -250]], [80, 140, 180], { bg: true });
    S.box((p) => add(p, [0, 10, 0]), 14, 10, 14, [150, 150, 156], { bevel: 0.02 }); // the launch mount
    S.box((p) => add(p, [-22, 72, 0]), 4, 72, 4, [110, 112, 120], { bevel: 0.02 }); // the tower
    if (o.crater) S.cyl((p) => add(p, [0, 0.02, 0]), 18, 0.02, [90, 80, 70], 16, { noShadow: true });
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'pad' || n === 'dave') {
      // Dave in the front row with popcorn, the rocket on the pad far behind him
      const D = n === 'dave', t0 = sh.t0, tl = t0 + 0.7, fall = H.clamp((t - tl) / 0.5), crush = H.clamp((t - tl - 0.5) / 0.2);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 600], 4.2, 3.6, 1.2, 1.1, 0.35, 0.15, [0, 1.6, -4]);
      const S = Scene(E, TG, W, H_); padSet(S);
      starship(S, [0, 20, 0]);
      for (const x of [-1.6, 1.6]) { S.box((p) => add(p, [x, 0.25, 600]), 0.25, 0.25, 0.25, [200, 50, 50], { bevel: 0.2 }); S.box((p) => add(p, [x, 0.7, 599.75]), 0.25, 0.25, 0.04, [200, 50, 50], { bevel: 0.2 }); }
      S.box((p) => add(p, [0, 0.25, 600]), 0.25, 0.25, 0.25, [200, 50, 50], { bevel: 0.2 });
      const cup = [0.0, 1.05, 600.4];
      if (!D || fall < 1) dave(S, [0, 0.07, 600], { pose: 'sit', yaw: Math.PI, hands: [[0.15, 1.08, 0.38], [-0.15, 1.15, 0.36]], blink: blinkAt(t), look: [0, 1], t });
      else dave(S, [0, 0.0, 600], { pose: 'sit', yaw: Math.PI, death: 'squash', u: 0.6 + 0.3 * crush, xeyes: true });
      if (!D || fall < 0.8) { S.cyl((p) => add(p, add(cup, [0, -0.12, -0.3])), 0.12, 0.25, [240, 240, 236], 10, { stripes: [220, 60, 50], r2: 0.15 }); for (let i = 0; i < 7; i++) S.ico(add(cup, [Math.cos(i * 2) * 0.07, 0.15 + (i % 2) * 0.03, -0.3 + Math.sin(i * 2) * 0.07]), 0.035, [255, 240, 190], { sub: 0 }); }
      if (D) { const cp = fall < 1 ? [0, 9 * (1 - fall * fall) + 1.2, 600.1] : [0, 0.6, 600.1]; S.ico(cp, [0.7, 0.55, 0.6], CONC, { sub: 0, jit: 0.25, seed: 5 }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.35, focus: 3.6 });
      if (!D) { const u = ramp(t, V('hook', 'rapid') - 0.2, 0.25); if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = 'rgba(16,16,22,0.88)'; ctx.beginPath(); ctx.roundRect(W * 0.06, H_ * 0.12, W * 0.88, H_ * 0.14, 20); ctx.fill(); ctx.fillStyle = '#ffd24a'; ctx.textAlign = 'center'; ctx.font = FONT(800, 32); ctx.fillText('"RAPID UNSCHEDULED', W / 2, H_ * 0.18); ctx.fillText('DISASSEMBLY"', W / 2, H_ * 0.225); ctx.restore(); } }
      else { tagLabel(ctx, W / 2, H_ * 0.2, '+ DAVE', ramp(t, V('end', 'Dave') - 0.1, 0.2), { px: 44, col: '#ff8a6a' }); flash = 0.15 * Math.exp(-Math.pow((t - tl - 0.5) * 6, 2)); }
    } else if (n === 'ctrl') {
      // a rocket engine: a controlled explosion pointed one way; one part fails and it isn't controlled any more
      const fail = ramp(t, V('ctrl', 'stops') - 0.2, 0.3);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.2, 2.8, 1.4, 1.3, 0.3, 0.1, [0, 1.25, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.45, 0.35, 0.75);
      S.cyl((p) => add(p, [0, 1.5, 0]), 0.18, 0.4, [200, 204, 212], 14, { gloss: 0.6 }); S.cyl((p) => add(rotX(p, Math.PI), [0, 1.5, 0]), 0.1, 0.45, [120, 124, 132], 14, { r2: 0.3, caps: false });
      S.beads([[0, 1.9, 0], [0, 1.55, 0], [0, 0.95, 0]], [120, 200, 255], t * 2, { spacing: 0.05, r: 0.02 });
      if (fail <= 0) for (let i = 0; i < 6; i++) S.ico([0.02 * Math.sin(t * 30 + i), 0.95 - i * 0.12, 0], 0.1 + i * 0.02, H.mix([255, 240, 200], [255, 140, 60], i / 6), { sub: 0, glow: true, noShadow: true });
      else for (let i = 0; i < 14; i++) { const a = i * 2.4, d = 0.2 + fail * 0.6; S.ico([Math.cos(a) * d, 1.4 + Math.sin(a * 1.3) * d, Math.sin(a) * d], 0.08 + 0.1 * fail, H.mix([255, 200, 120], [255, 90, 40], (i % 4) / 4), { sub: 0, glow: true, noShadow: true }); }
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'CONTROLLED ↓', ramp(t, V('ctrl', 'controlled') - 0.1, 0.2) * (1 - ramp(t, V('ctrl', 'valve') - 0.2, 0.2)), { px: 40, col: '#7ee07a' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'VALVE · PUMP · WELD', ramp(t, V('ctrl', 'valve') - 0.1, 0.2) * (1 - fail), { px: 34 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NOT CONTROLLED', fail, { px: 40, col: '#ff6a5a' });
      flash = 0.25 * Math.exp(-Math.pow((t - V('ctrl', 'stops') + 0.1) * 5, 2));
    } else if (n === 'flight' || n === 'success') {
      // 2023: over the Gulf of Mexico, the stack tumbles and blows apart; then "a success" with data
      const tb = V('flight', 'apart') - 0.2, u = H.clamp((t - tb) / 1.5), S0 = n === 'success';
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 30000, 0], 900, 850, -50, -30, 0.3, 0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-80000, 0, -80000], [80000, 0, -80000], [80000, 0, 80000], [-80000, 0, 80000]], [60, 120, 170], { bg: true });
      if (S0 || t > tb + 0.2) { const r = H.rng(4); for (let i = 0; i < 26; i++) { const d = [r() - 0.5, r() - 0.3, r() - 0.5], k = S0 ? 1 : u; S.ico(add([0, 30000, 0], mul(d, 300 * k)), 12 + r() * 20, i % 3 ? [230, 120, 60] : [200, 200, 210], { sub: 0, noShadow: true, glow: i % 3 > 0 }); } }
      if (!S0 && t < tb + 0.2) starship(S, [0, 29940, 0], { tilt: 0.3 + (t - sh.t0) * 0.5, fire: 1 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      if (!S0) { tagLabel(ctx, W / 2, H_ * 0.2, 'GULF OF MEXICO · 2023', ramp(t, V('flight', 'Gulf') - 0.1, 0.2), { px: 32 }); flash = 0.4 * Math.exp(-Math.pow((t - tb - 0.2) * 4, 2)); }
      else { const u2 = ramp(t, V('success', 'success') - 0.1, 0.2); if (u2 > 0) { ctx.save(); ctx.translate(W / 2, H_ * 0.2); ctx.rotate(-0.06); ctx.scale(H.ease.back(u2), H.ease.back(u2)); ctx.strokeStyle = '#7ee07a'; ctx.lineWidth = 6; ctx.strokeRect(-170, -42, 340, 84); ctx.fillStyle = '#7ee07a'; ctx.font = FONT(800, 44); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SUCCESS', 0, 2); ctx.restore(); } tagLabel(ctx, W / 2, H_ * 0.3, 'DATA ✓', ramp(t, V('success', 'data') - 0.1, 0.2), { px: 36 }); }
    } else {
      // the launch blasted the pad: concrete chunks fly across the site
      const tl = sh.t0 + 0.2, u = H.clamp((t - tl) / 2.5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 220, 200, 50, 60, 0.6, 0.45, [0, 40, 0]);
      const S = Scene(E, TG, W, H_); padSet(S, { crater: true });
      starship(S, [0, 20 + 120 * u * u, 0], { fire: 1 });
      const r = H.rng(9); for (let i = 0; i < 30; i++) { const a = r() * TAU, sp = 40 + r() * 60, up = 20 + r() * 40, tt = u * 3; const p = [Math.cos(a) * sp * tt, Math.max(0.5, 2 + up * tt - 4.9 * tt * tt * 3), Math.sin(a) * sp * tt]; S.ico(p, 1 + r() * 2, CONC, { sub: 0, jit: 0.3, seed: i }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, 'FLYING CONCRETE', ramp(t, V('flight', 'concrete') - 0.1, 0.2), { px: 38 });
      flash = 0.3 * Math.exp(-Math.pow((t - tl) * 4, 2));
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 16, rip, t, { cause: 'cause of death:\nbecame data' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('ctrl'), color: 'pink', filter: 'lowpass', f: 800, gain: 0.06, a: 0.5, minor: true }); k.play('pop', V('hook', 'rapid') - 0.2, { gain: 0.3 });
    k.noise(ST('ctrl'), { dur: V('ctrl', 'stops') - ST('ctrl'), color: 'brown', filter: 'lowpass', f: 300, gain: 0.25, a: 0.2 }); k.play('impact', V('ctrl', 'stops') - 0.2, { gain: 0.5 });
    const tb = V('flight', 'apart') - 0.2; k.noise(ST('flight'), { dur: tb - ST('flight'), color: 'brown', filter: 'lowpass', f: 200, gain: 0.25, a: 0.3 }); k.play('impact', tb + 0.2, { gain: 0.7 }); k.noise(tb + 0.2, { dur: 2.5, color: 'brown', filter: 'lowpass', f: [[0, 800], [2.5, 80]], gain: 0.4, a: 0.02, verb: 0.4 });
    const tl = ST('concrete') + 0.2; k.noise(tl, { dur: 3, color: 'brown', filter: 'lowpass', f: 300, gain: 0.4, a: 0.05 }); for (let i = 0; i < 6; i++) k.play('thud', tl + 0.6 + i * 0.35, { f: 90, gain: 0.25, minor: true });
    k.play('success', V('success', 'success'), { gain: 0.4 }); k.play('coin', V('success', 'data'), { gain: 0.4 });
    const td = ST('dave') + 0.7; k.play('swish', td, { dur: 0.5, gain: 0.5 }); k.play('impact', td + 0.5, { gain: 0.6 }); k.play('thud', td + 0.6, { f: 70, gain: 0.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
