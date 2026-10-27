  // Short: "Why plane windows can't be square" (9:16), for mechvideo 002. Opens on the break-up, ends on the intact Comet.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['cabin', BEAT0('setup') - 0.15], ['corner', BEAT0('corner') - 0.15], ['crack', BEAT0('crack') - 0.15], ['fix', BEAT0('fix') - 0.15], ['teaser', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.6, 7.8, 1.4, 1.1, 0.9, 1.2, [0.3, 1.0, 0]);
      cometBreak(ctx, W, H_, t, E, TG, V('hook', 'tore'));
      flash = 0.2 * Math.exp(-Math.pow((t - V('hook', 'tore')) * 4, 2));
    } else if (n === 'cabin') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 3.6, 3.2, 0.5, 0.4, 0.45, -0.2, [0, 0.55, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const rl = ramp(t, V('setup', 'relax') - 0.3, 0.4), sw = 0.05 * ramp(t, V('setup', 'pushed') - 0.2, 0.4) * (rl > 0 ? 0.5 + 0.5 * Math.cos((t - V('setup', 'relax')) * 4) : 1);
      cabin(S, [0, 1.25, 0], { len: 1.8, r: 0.42, k: 0.15, t, swell: sw, press: popU(t, V('setup', 'pushed') - 0.1, 0.5) * (0.4 + 0.6 * sw / 0.05), air: ramp(t, V('setup', 'pressurised') - 0.2, 0.8), glass: 0.4 });
      for (const sx of [-0.55, 0.55]) stand(S, [sx, 0, 0], 0.3, 0.32, 0.8);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.3 });
    } else if (n === 'corner' || n === 'crack' || n === 'fix') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.28, 0], 2.1, 1.85, 0.15, 0.1, n === 'crack' ? -0.25 : 0.25, n === 'crack' ? 0.1 : -0.1, [0, 0.38, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      let k, hot, crack = 0;
      if (n === 'corner') { k = 1 - ramp(t, V('corner', 'sharp') - 0.2, 0.6); hot = ramp(t, V('corner', 'piles') - 0.1, 0.4); }
      else if (n === 'crack') { k = 0.02; hot = 1; crack = ramp(t, V('crack', 'tiny') - 0.1, Math.max(0.8, V('crack', 'split') - V('crack', 'tiny'))); flash = 0.15 * Math.exp(-Math.pow((t - V('crack', 'split')) * 5, 2)); }
      else { k = ramp(t, V('fix', 'rounded') - 0.3, 0.9); hot = 1 - 0.6 * k; }
      skinPanel(S, [0, 1.28, 0], { k: 0.02 + 0.98 * Math.max(0, k), t, flow: n === 'corner' ? ramp(t, V('corner', 'stress') - 0.2, 0.5) : 1, hot, crack, seed: 4 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.4, 7.4, 1.6, 1.2, -1.0, -0.7, [0.3, 1.2, 0]);
      const S = seaScene(E, TG, W, H_, t);
      comet(S, [0, SKY_Y, 0], { burn: 1 });
      S.render(ctx, W, H_, skyEnv);
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const clunk = (t, g = 1) => { k.play('tock', t, { f: 240, gain: 0.4 * g }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: V('hook', 'tore'), color: 'brown', filter: 'lowpass', f: 600, gain: 0.09, a: 0.3, minor: true });
    k.play('impact', V('hook', 'tore'), { gain: 0.45 }); k.noise(V('hook', 'tore'), { dur: 1.4, filter: 'bandpass', f: [[0, 2600], [1.4, 500]], q: 1.2, gain: 0.14, a: 0.01 });
    k.noise(V('setup', 'pressurised'), { dur: 1.6, color: 'pink', filter: 'bandpass', f: [[0, 600], [1.6, 1300]], q: 0.8, gain: 0.06, a: 0.3, minor: true }); clunk(V('setup', 'pushed'));
    k.play('ding', V('corner', 'smoothly'), { f: 'C6', gain: 0.25 }); k.play('error', V('corner', 'piles'), { gain: 0.3 });
    k.noise(V('crack', 'tiny'), { dur: 1.6, filter: 'highpass', f: 3200, gain: 0.05, a: 0.05, minor: true }); k.play('impact', V('crack', 'split'), { gain: 0.4 });
    k.play('success', V('fix', 'rounded'), { f: 'C6', gain: 0.4 });
    k.noise(ST2('teaser'), { dur: DURATION - ST2('teaser'), color: 'brown', filter: 'lowpass', f: 600, gain: 0.07, a: 0.4, minor: true }); k.play('riser', V('cta', 'figured') - 0.3, { gain: 0.25 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
