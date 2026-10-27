  // Short: "This jet ran out of fuel because of one number" (9:16). Loops: ends on the silent jet it opens with.
  const BEATS = window.SCRIPT;
  const SH = [['sky', 0], ['tank', BEAT0('setup') - 0.15], ['balance', BEAT0('wrong') - 0.15], ['out', BEAT0('out') - 0.15], ['glide', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'sky' || n === 'out' || n === 'glide') {
      const dead = n === 'sky' ? ramp(t, V('hook', 'fuel') - 0.2, 0.8) : n === 'out' ? ramp(t, V('out', 'silent') - 0.3, 0.8) : 1;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.4, 7.4, 1.6, 1.2, 1.1, 0.8, [0.4, 1.25, 0]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { fan: integ((u) => 1 + 16 * (1 - (n === 'glide' ? 1 : dead)), t, 1 / 20), burn: 1 - dead, pitch: -0.04 * dead });
      S.render(ctx, W, H_, skyEnv);
      const eL = S.proj([0.4, SKY_Y - 0.33, -0.82]), eR = S.proj([0.4, SKY_Y - 0.33, 0.82]);
      const nu = n === 'glide' ? 0 : ramp(t, (n === 'sky' ? V('hook', 'fuel') : V('out', 'silent')) - 0.1, 0.3);
      FX.no(ctx, eL[0], eL[1], 40, nu); FX.no(ctx, eR[0], eR[1], 40, nu);
      if (n === 'out') redPulse(ctx, W, H_, 0.6 * ramp(t, V('out', 'engines') - 0.1, 0.2));
      if (n === 'sky') flash = 0.15 * Math.exp(-Math.pow((t - V('hook', 'number')) * 5, 2));
    } else if (n === 'tank') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.05, 1.2, 0], 4.4, 3.9, 0.9, 0.75, -0.25, 0.2, [0, 0.6, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      stand(S, [-0.55, 0, 0.1], 0.45, 0.35, 0.75); fuelTank(S, [-0.55, 1.1, 0.1], 0.45, ramp(t, V('dip', 'stick') - 0.2, 0.6));
      panel(S, [0.45, 1.75, -0.4], 1 - ramp(t, V('setup', 'broken') - 0.15, 0.25), -0.3);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.3 });
      const pp = S.proj([0.45, 1.8, -0.35]); FX.no(ctx, pp[0], pp[1], 50, ramp(t, V('setup', 'broken'), 0.25) * (1 - ramp(t, V('dip', 'crew') - 0.2, 0.3)));
      FX.sparks(ctx, pp[0], pp[1], H.clamp((t - V('setup', 'broken')) / 0.6), 4);
    } else { // balance: needed vs loaded
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.1, 0.9, 0], 3.9, 3.4, 0.8, 0.6, 0.25, -0.2, [0, 0.62, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const have = popU(t, V('half', 'less') - 0.1, 0.4), tilt = 0.32 * (1 - 0.35 * have);
      balance(S, [0.1, 0, 0], tilt, 0.17, 0.09 * have);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      const rp = S.proj([0.7, 0.75, 0]);
      FX.no(ctx, rp[0], rp[1] - 40, 50, ramp(t, V('wrong', 'pounds') - 0.1, 0.25) * (1 - ramp(t, V('wrong', 'right') - 0.2, 0.3)));
      flash = 0.12 * Math.exp(-Math.pow((t - V('half', 'half')) * 5, 2));
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const clunk = (t, g = 1) => { k.play('tock', t, { f: 240, gain: 0.4 * g }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: V('hook', 'fuel'), color: 'brown', filter: 'lowpass', f: 600, gain: 0.1, a: 0.3, minor: true });
    k.noise(V('hook', 'fuel') - 0.2, { dur: 1.2, filter: 'lowpass', f: [[0, 900], [1.2, 120]], gain: 0.12, a: 0.05 }); k.play('impact', V('hook', 'number'), { gain: 0.4 });
    k.play('buzz', V('setup', 'broken'), { gain: 0.25 }); k.noise(V('dip', 'stick'), { dur: 0.6, filter: 'bandpass', f: 1400, q: 3, gain: 0.05, minor: true });
    k.play('error', V('wrong', 'pounds'), { gain: 0.35 }); clunk(V('half', 'less'), 0.8); k.play('thud', V('half', 'half') + 0.1, { f: 80, gain: 0.3 });
    for (let i = 0; i < 3; i++) k.play('ding', V('out', 'over') + i * 0.4, { f: 'A5', gain: 0.2 });
    k.noise(V('out', 'silent') - 0.3, { dur: 1.2, filter: 'lowpass', f: [[0, 800], [1.2, 100]], gain: 0.12, a: 0.05 });
    k.noise(ST2('glide'), { dur: DURATION - ST2('glide'), color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: 0.07, a: 0.4, minor: true });
    k.play('riser', V('cta', 'crazier') - 0.3, { gain: 0.25 });
  }
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
