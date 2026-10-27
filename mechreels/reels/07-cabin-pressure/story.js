  // Short: "Your plane is a metal balloon" (9:16), for mechvideo 002
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['climb', BEAT0('thin') - 0.15], ['cabin', BEAT0('push') - 0.15], ['crack', BEAT0('fatigue') - 0.15], ['teaser', V('fatigue', 'tore') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') { // the cabin in the sky with the air pushing out
      const pu = popU(t, V('hook', 'pushing') - 0.1, 0.5);
      roundWindows(ctx, W, H_, t, sh.t0, sh.t1, V('hook', 'balloon'), { vertical: true, press: pu * 0.8, swell: 0.02 * pu * (0.5 + 0.5 * Math.sin(t * 5)) });
    } else if (n === 'climb') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.4, 7.4, 1.0, 1.4, 1.5, 1.9, [0.3, 1.2, 0]);
      const S = skyScene(E, TG, W, H_, t); const c = comet(S, [0, SKY_Y, 0], { burn: 1, pitch: 0.06 }); S.render(ctx, W, H_, skyEnv);
      const fp = S.proj(c.T([0.6, 0.7, 0])); FX.no(ctx, fp[0], fp[1] - 60, 56, ramp(t, V('thin', 'breathe') - 0.1, 0.25) * (1 - ramp(t, V('thin', 'pumped') - 0.2, 0.3)));
    } else if (n === 'cabin') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 3.6, 3.2, 0.5, 0.4, 0.45, -0.25, [0, 0.55, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const br = ramp(t, V('breathe', 'swells') - 0.2, 0.4), sw = 0.06 * br * (0.5 - 0.5 * Math.cos((t - V('breathe', 'swells')) * 3));
      cabin(S, [0, 1.25, 0], { len: 1.8, r: 0.42, k: 0.9, t, swell: sw, glass: 0.5, air: 1, press: popU(t, V('push', 'pushes') - 0.1, 0.5) * (1 - 0.4 * br) + sw * 6 });
      for (const sx of [-0.55, 0.55]) stand(S, [sx, 0, 0], 0.3, 0.32, 0.8);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.3 });
      const gp = S.proj([0, 1.8, 0]); tally(ctx, gp[0], gp[1] - 60, '5 t / m²', ramp(t, V('push', 'five') - 0.1, 0.3) * (1 - ramp(t, V('breathe', 'swells') - 0.3, 0.3)), 50);
    } else if (n === 'crack') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.28, 0], 2.1, 1.85, 0.15, 0.1, -0.25, 0.1, [0, 0.38, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      skinPanel(S, [0, 1.28, 0], { k: 0.02, t, flow: 1, hot: 1, crack: ramp(t, V('fatigue', 'grow') - 0.2, 1.2), seed: 4 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
      const gp = S.proj([0, 1.7, 0]); tally(ctx, gp[0], gp[1] - 20, '× ' + Math.round(3000 * ramp(t, sh.t0, 1.4)).toLocaleString('en-US'), ramp(t, sh.t0, 0.3), 50);
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.6, 7.8, 1.4, 1.1, 0.9, 1.2, [0.3, 1.0, 0]);
      cometBreak(ctx, W, H_, t, E, TG, V('fatigue', 'tore'));
      flash = 0.18 * Math.exp(-Math.pow((t - V('fatigue', 'tore')) * 4, 2));
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const clunk = (t, g = 1) => { k.play('tock', t, { f: 240, gain: 0.4 * g }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST2('cabin'), color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: 0.07, a: 0.4, minor: true }); clunk(V('hook', 'pushing'), 1.1);
    k.play('error', V('thin', 'breathe'), { gain: 0.25 }); k.noise(V('thin', 'pumped'), { dur: 1.6, color: 'pink', filter: 'bandpass', f: [[0, 600], [1.6, 1300]], q: 0.8, gain: 0.06, a: 0.3, minor: true });
    k.play('thud', V('push', 'five'), { f: 70, gain: 0.35 });
    for (let i = 0; i < 3; i++) k.noise(V('breathe', 'swells') + i * 2.1, { dur: 1.0, color: 'pink', filter: 'lowpass', f: 500, gain: 0.06, a: 0.3, minor: true });
    for (let i = 0; i < 10; i++) k.play('count', ST2('crack') + i * 0.14, { gain: 0.3, f: 1900 + i * 70, minor: true });
    k.noise(V('fatigue', 'grow'), { dur: 1.2, filter: 'highpass', f: 3200, gain: 0.05, a: 0.05, minor: true });
    k.play('impact', V('fatigue', 'tore'), { gain: 0.45 }); k.noise(V('fatigue', 'tore'), { dur: 1.4, filter: 'bandpass', f: [[0, 2600], [1.4, 500]], q: 1.2, gain: 0.14, a: 0.01 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
