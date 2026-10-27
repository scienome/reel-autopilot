  // Short: "The first jet airliner kept falling apart" (9:16), for mechvideo 002
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['first', BEAT0('first') - 0.15], ['elba', BEAT0('lost') - 0.15], ['ground', V('lost', 'fleet') - 0.15], ['naples', BEAT0('again') - 0.15], ['tank', BEAT0('tank') - 0.15], ['teaser', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'elba' || n === 'naples') {
      const tb = n === 'hook' ? V('hook', 'broke') : n === 'elba' ? V('lost', 'apart') : V('again', 'broke');
      const a0 = n === 'hook' ? 0.9 : n === 'elba' ? -0.6 : 1.6;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.6, 7.8, 1.4, 1.0, a0, a0 + 0.3, [0.3, 0.9, 0]);
      cometBreak(ctx, W, H_, t, E, TG, tb);
      flash = 0.18 * Math.exp(-Math.pow((t - tb) * 4, 2));
    } else if (n === 'first') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.4, 7.4, 1.6, 1.2, -1.0, -0.6, [0.3, 1.2, 0]);
      const S = skyScene(E, TG, W, H_, t); comet(S, [0, SKY_Y, 0], { burn: 1 }); S.render(ctx, W, H_, skyEnv);
    } else if (n === 'ground') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.6, 1.2], 8.0, 7.2, 1.4, 1.1, -0.4, 0.0, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); cmField(S);
      comet(S, [-0.6, 0.46, 0], { gear: 1 }); comet(S, [1.2, 0.46, 3.0], { gear: 1, yaw: 0.2 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 7 });
      const p = S.proj([-0.6, 1.5, 0]); FX.no(ctx, p[0], p[1] - 40, 56, ramp(t, V('lost', 'grounded') - 0.1, 0.25) * (1 - ramp(t, V('lost', 'cleared') - 0.2, 0.3)));
    } else if (n === 'tank') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.0, 0], 5.0, 4.4, 0.8, 0.6, -0.4, 0.3, [0, 0.6, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const cyc = ramp(t, V('tank', 'pumped') - 0.2, 0.4) * (1 - ramp(t, V('tank', 'split') - 0.2, 0.3)), sw = 0.05 * cyc * (0.5 - 0.5 * Math.cos((t - V('tank', 'pumped')) * 5.5)), cr = ramp(t, V('tank', 'split') - 0.2, 0.7);
      waterTank(S, [0, 0.95, 0], t, { water: ramp(t, V('tank', 'water') - 0.3, 0.8), swell: sw + 0.02 * cr, gauge: 0.15 + 0.6 * sw / 0.05, flow: cyc, fast: true, crack: cr, hot: 0.8 * cr, k: 0.12 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 4.4 });
      const wp = S.proj([0, 1.3, 0.37]); bubbles(ctx, wp[0], wp[1], ramp(t, V('tank', 'split') - 0.1, 2.5), 5, 50, 160);
      flash = 0.15 * Math.exp(-Math.pow((t - V('tank', 'split')) * 5, 2));
    } else {
      roundWindows(ctx, W, H_, t, sh.t0, sh.t1, V('cta', 'round'), { vertical: true });
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const rip = (t) => { k.play('impact', t, { gain: 0.45 }); k.noise(t, { dur: 1.4, filter: 'bandpass', f: [[0, 2600], [1.4, 500]], q: 1.2, gain: 0.14, a: 0.01 }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST2('ground'), color: 'brown', filter: 'lowpass', f: 600, gain: 0.08, a: 0.3, minor: true });
    rip(V('hook', 'broke')); rip(V('lost', 'apart')); rip(V('again', 'broke'));
    k.play('buzz', V('lost', 'grounded'), { gain: 0.25 }); k.play('ding', V('lost', 'cleared'), { f: 'A5', gain: 0.25 });
    for (let i = 0; i < 12; i++) k.play('count', V('tank', 'pumped') + i * 0.2, { gain: 0.3, f: 1800 + i * 60, minor: true });
    k.play('impact', V('tank', 'split'), { gain: 0.45 }); k.noise(V('tank', 'split'), { dur: 1.4, color: 'pink', filter: 'bandpass', f: 500, q: 0.7, gain: 0.1, a: 0.02 });
    k.play('riser', V('cta', 'round') - 0.4, { gain: 0.25 }); k.play('ding', V('cta', 'round'), { f: 'E6', gain: 0.3 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
