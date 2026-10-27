  // Short: "A square filter in a round hole" (9:16), for mechvideo 008. Opens on the square cartridge failing to fit.
  const BEATS = window.SCRIPT;
  const SH = [['bench', 0], ['space', BEAT0('co2') - 0.15], ['bench2', BEAT0('round') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'space') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.4, 0, 0], 5.2, 4.6, 0.6, 0.4, -0.5, 0.0, [0, 0.55, 0]);
      const S = Scene(E, TG, W, H_); earth(S, [-40, -6, -30], 5); moon(S, [40, 4, -40], 6);
      const st = apolloStack(S, [0, 0, 0], { s: 2, panel: 1, lmLit: 1 }); S.render(ctx, W, H_, spaceEnv);
      const lp = S.proj(st.lm); ringHi(ctx, lp[0], lp[1], 90, ramp(t, V('co2', 'lifeboat') - 0.1, 0.3), '126,224,122');
    } else {
      const isH = n === 'bench', fix = isH ? 0 : ramp(t, V('fixed', 'fall') - 0.3, 2.0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.1, 1.15, 0], 3.2, 2.8, 0.4, 0.3, 0.4, -0.15, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const m = co2Bench(S, [0, 1.0, 0], t, { co2: isH ? 0.6 : (0.5 + 0.5 * ramp(t, sh.t0, 4)) * (1 - 0.85 * fix), square: isH ? ramp(t, V('hook', 'square') - 0.3, 1.0) : ramp(t, V('round', 'square') - 0.3, 1.0) * (1 - ramp(t, V('build', 'engineers') - 0.2, 0.3)), parts: isH ? 0 : ramp(t, V('build', 'plastic') - 0.3, 3.0), build: isH ? 0 : ramp(t, V('fixed', 'copied') - 0.2, 1.6) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      const sp = S.proj(m.socket), ap = S.proj(m.adapter);
      FX.no(ctx, sp[0], sp[1] - 110, 46, (isH ? ramp(t, V('hook', 'fit') - 0.1, 0.25) : ramp(t, V('round', 'square') + 0.3, 0.25) * (1 - ramp(t, V('build', 'engineers') - 0.3, 0.3))));
      ringHi(ctx, ap[0], ap[1], 120, ramp(t, V('fixed', 'fall') - 0.1, 0.3) * (isH ? 0 : 1), '126,224,122');
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.play('buzz', V('hook', 'fit'), { gain: 0.3 }); k.noise(0.05, { dur: DURATION - 0.1, color: 'brown', filter: 'lowpass', f: 250, gain: 0.04, a: 0.6, minor: true });
    k.play('buzz', V('round', 'square') + 0.3, { gain: 0.25 });
    for (const w of ['plastic', 'cardboard', 'hose', 'sock', 'duct']) k.play('pop', V('build', w), { gain: 0.3 });
    k.noise(V('build', 'duct'), { dur: 1.2, filter: 'bandpass', f: 1800, q: 1.5, gain: 0.08, a: 0.02 }); k.play('success', V('fixed', 'fall'), { f: 'C6', gain: 0.45 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
