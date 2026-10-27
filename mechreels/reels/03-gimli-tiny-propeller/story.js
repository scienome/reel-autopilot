  // Short: "This little propeller saved 69 people" (9:16)
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['rigoff', BEAT0('problem') - 0.15], ['drop', BEAT0('rat') - 0.15], ['rig', BEAT0('pump') - 0.15], ['glide', BEAT0('glide') - 0.15], ['gimli', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'drop') {
      const out = n === 'hook' ? 1 : ramp(t, V('rat', 'drops') - 0.2, 0.7);
      const [E, TG] = dolly(t, sh.t0, sh.t1, [-1.1, SKY_Y - 0.62, 2.6], [0.1, SKY_Y - 0.2, 0.3], [-0.8, SKY_Y - 0.65, 2.1], [0.1, SKY_Y - 0.25, 0.3]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { burn: 0, rat: out, ratSpin: t * 25 * out, pitch: -0.05 });
      S.render(ctx, W, H_, { ...skyEnv, focus: 2.2 });
      const rp = S.proj([0.08, SKY_Y - 0.48, 0.33]); FX.spin(ctx, rp[0], rp[1], 60, n === 'hook' ? ramp(t, V('hook', 'propeller') - 0.1, 0.5) : ramp(t, V('rat', 'turbine') - 0.1, 0.5), -t * 9);
    } else if (n === 'rigoff' || n === 'rig') {
      const on = n === 'rig';
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.35, 1.1, 0], 4.6, 4.0, 0.8, 0.6, 0.5, 0.0, [0, 0.62, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const fl = on ? ramp(t, V('pump', 'pump') - 0.3, 0.8) : 0, dfl = on ? 0.35 * Math.sin((t - V('pump', 'controls')) * 2.4) * ramp(t, V('pump', 'controls') - 0.2, 0.4) : 0;
      ratRig(S, [0.2, 1.1, 0], t, { spin: on ? t * 14 : 0, flow: fl, defl: dfl });
      const wu = on ? ramp(t, V('pump', 'rushing') - 0.2, 0.5) : 0;
      if (wu > 0) for (const dy of [-0.18, 0, 0.18]) S.arrow([1.35, 1.1 + dy, 0.0], [1.35 - 0.6 * wu, 1.1 + dy, 0.0], P.air, { side: [0, 1, 0], w: 0.07, th: 0.02, noShadow: true });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.2 });
      if (!on) { const wp = S.proj([-0.8, 1.25, 0]); FX.no(ctx, wp[0], wp[1] - 30, 46, ramp(t, V('problem', 'steering') - 0.1, 0.25)); }
    } else if (n === 'glide') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.6, 7.6, 1.5, 1.1, 1.9, 2.3, [0, 1.2, 0]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { burn: 0, rat: 1, ratSpin: t * 25, pitch: -0.05 });
      S.render(ctx, W, H_, skyEnv);
    } else { // teaser: the racetrack runway
      const [E, TG] = dolly(t, sh.t0, sh.t1, [14, 3.4, 7], [24, 0.4, 0], [16.5, 2.6, 5.5], [25, 0.4, 0]);
      const S = Scene(E, TG, W, H_); gimliField(S);
      for (let i = 0; i < 3; i++) raceCar(S, 20 + ((t * 6 + i * 4) % 14), -1.3 + i * 0.25, 0, [[250, 200, 70], [236, 92, 70], [70, 140, 230]][i]);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 10 });
      flash = 0.12 * Math.exp(-Math.pow((t - V('cta', 'unbelievable')) * 5, 2));
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const clunk = (t, g = 1) => { k.play('tock', t, { f: 240, gain: 0.4 * g }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST2('rigoff'), color: 'pink', filter: 'bandpass', f: 1600, q: 2, gain: 0.05, a: 0.2, minor: true }); k.play('impact', V('hook', 'saved'), { gain: 0.35 });
    k.play('buzz', V('problem', 'steering'), { gain: 0.25 });
    k.play('swish', V('rat', 'drops'), { gain: 0.35 }); clunk(V('rat', 'drops') + 0.3, 0.8);
    k.noise(V('pump', 'pump'), { dur: 2.0, color: 'pink', filter: 'bandpass', f: [[0, 500], [2, 1100]], q: 0.8, gain: 0.06, a: 0.3, minor: true });
    k.noise(ST2('glide'), { dur: ST2('gimli') - ST2('glide'), color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: 0.08, a: 0.4, minor: true });
    k.noise(ST2('gimli'), { dur: DURATION - ST2('gimli'), color: 'brown', filter: 'bandpass', f: [[0, 300], [1, 520], [2, 340]], q: 2, gain: 0.08, a: 0.2, minor: true });
    k.play('riser', V('cta', 'unbelievable') - 0.4, { gain: 0.25 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
