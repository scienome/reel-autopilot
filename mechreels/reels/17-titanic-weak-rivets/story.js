  // Short: "The Titanic's weak rivets" (9:16), for mechvideo 006. Opens on the seam popping.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['ship', BEAT0('three') - 0.15], ['seams', BEAT0('two') - 0.15], ['slag', BEAT0('slag') - 0.15], ['pop', BEAT0('pop') - 0.15], ['tray', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'pop') {
      const tp = n === 'hook' ? V('hook', 'rivets') - 0.4 : V('pop', 'snap');
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 2.3, 2.0, 0.1, 0.05, -0.3, 0.2, [0, 0.35, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      seam(S, [0, 1.15, 0], { iron: true, pop: ramp(t, tp - 0.2, 0.8), water: ramp(t, tp + 0.3, 0.6), t });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.1 });
      const pp = S.proj([0, 1.17, 0.1]); FX.sparks(ctx, pp[0], pp[1], H.clamp((t - tp) / 0.6), 4); flash = 0.12 * Math.exp(-Math.pow((t - tp) * 5, 2));
    } else if (n === 'ship') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.8, 0], 15, 13, 1.4, 1.0, 0.7, 1.0, [0, 2.2, 0]);
      const S = seaScene(E, TG, W, H_, t, { clouds: false }); liner(S, [0, 0, 0], {});
      S.render(ctx, W, H_, { ...skyEnv, focus: 13 });
      tally(ctx, W / 2, H_ * 0.2, '≈ 3,000,000', ramp(t, V('three', 'three') - 0.1, 0.3), 56);
    } else if (n === 'seams') {
      const lookR = ramp(t, V('two', 'bow') - 0.4, 0.8);
      const [E0, T0] = orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 3.0, 2.7, 0.15, 0.1, 0.2, -0.1, [0, 0.35, 0]);
      const E = add(E0, [-0.6 + 1.2 * lookR, 0, -0.6]), TG = add(T0, [-0.6 + 1.2 * lookR, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      seam(S, [-0.7, 1.15, 0], { iron: false }); seam(S, [0.7, 1.15, 0], { iron: true });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.4 });
      const lp = S.proj([-0.7, 1.17, 0.08]), rp = S.proj([0.7, 1.17, 0.08]); ringHi(ctx, lp[0], lp[1], 90, ramp(t, V('two', 'steel') - 0.1, 0.3), '126,224,122'); ringHi(ctx, rp[0], rp[1], 90, ramp(t, V('two', 'wrought') - 0.1, 0.3), '255,90,70');
    } else if (n === 'slag') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.3, 1.15, 0], 2.1, 1.7, 0.1, 0.05, 1.3, 1.0, [0, 0.3, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      bigRivet(S, [0, 1.15, 0], { slag: true, snap: ramp(t, V('slag', 'brittle') - 0.1, 0.4) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.8 });
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.2, 1.0, 0], 3.8, 3.4, 0.4, 0.3, 0.4, 0.0, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      compModel(S, [0.2, 0.9, 0], { t, levels: [1, 1, 1, 1, 1, 0.8, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0], pitch: -0.12, spill: 1, hi: [0, 1, 2, 3, 4] });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    const popS = (tt) => { for (let i = 0; i < 6; i++) k.play('stamp', tt + i * 0.09, { gain: 0.2 }); k.noise(tt + 0.3, { dur: 1.5, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.09, a: 0.1 }); };
    popS(V('hook', 'rivets') - 0.4); popS(V('pop', 'snap'));
    k.noise(ST2('ship'), { dur: ST2('seams') - ST2('ship'), color: 'pink', filter: 'bandpass', f: 600, q: 0.4, gain: 0.06, a: 0.5, minor: true });
    k.play('tock', V('two', 'steel'), { f: 240, gain: 0.35 }); for (let i = 0; i < 6; i++) k.play('tick', V('two', 'hammered') + i * 0.18, { gain: 0.3, f: 1200 });
    k.play('glitch', V('slag', 'slag'), { gain: 0.25 }); k.play('stamp', V('slag', 'brittle'), { gain: 0.3 });
    k.noise(ST2('tray'), { dur: DURATION - ST2('tray'), color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.07, a: 0.3, minor: true }); k.play('riser', V('cta', 'chain') - 0.4, { gain: 0.2 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
