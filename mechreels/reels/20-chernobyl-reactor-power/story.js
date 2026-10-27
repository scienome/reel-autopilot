  // Short: "How Chernobyl's reactor made power" (9:16), for mechvideo 007
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['core', BEAT0('split') - 0.15], ['loop', BEAT0('boil') - 0.15], ['rods', BEAT0('rods') - 0.15], ['void', BEAT0('catch') - 0.15], ['plant', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const core = (ctx, W, H_, t, sh, o, cam = {}) => { const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], cam.r0 || 3.8, cam.r1 || 3.3, 0.4, 0.3, cam.a0 ?? 0.5, cam.a1 ?? -0.1, [0, 0.5, 0]); const S = Scene(E, TG, W, H_); garage(S); const m = coreModel(S, [0, 0.75, 0], t, o); S.render(ctx, W, H_, { dof: 0.33, focus: 3.5 }); return { S, m }; };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') { const ru = ramp(t, V('hook', 'run') - 0.3, 1.0); const { S, m } = core(ctx, W, H_, t, sh, { rods: 0.3, power: 0.5 + 0.5 * ru, water: 1, boil: 0.4 + 0.6 * ru, neutrons: 0.6 + 0.4 * ru }); const mp = S.proj(m.mid); FX.heat(ctx, mp[0], mp[1] - 100, 160, ru, t); }
    else if (n === 'core') core(ctx, W, H_, t, sh, { rods: 0.4, power: 0.4, neutrons: ramp(t, V('split', 'split') - 0.2, 0.6), graphite: ramp(t, V('split', 'graphite') - 0.3, 0.8) }, { a0: -0.5, a1: 0.2 });
    else if (n === 'loop') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.8, 1.1, 0], 5.4, 4.8, 0.5, 0.4, 0.3, -0.1, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      coreModel(S, [-0.4, 0.75, 0], t, { rods: 0.5, power: 0.5, water: 1, boil: ramp(t, V('boil', 'boils') - 0.2, 0.6) * 0.5, neutrons: 0.5 });
      turbineLoop(S, [2.0, 1.2, -0.2], t, { spin: ramp(t, V('boil', 'spins') - 0.3, 0.6), steam: ramp(t, V('boil', 'steam') - 0.2, 0.6), water: 1 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 4.8 });
    } else if (n === 'rods') { const ins = 0.45 + 0.3 * Math.sin((t - sh.t0) * 1.4); core(ctx, W, H_, t, sh, { rods: ins, power: 0.75 - 0.5 * ins, water: 1, boil: 0.3, neutrons: 1 - 0.6 * ins }); }
    else if (n === 'void') { const bu = ramp(t, V('catch', 'steam') - 0.2, 2.5); const { S, m } = core(ctx, W, H_, t, sh, { rods: 0.4, power: 0.35 + 0.6 * bu, water: 1, boil: 0.15 + 0.8 * bu, neutrons: 0.4 + 0.6 * bu }, { r0: 3.2, r1: 2.8 }); const mp = S.proj(m.mid); FX.spin(ctx, mp[0], mp[1], 150, ramp(t, V('catch', 'speeds') - 0.1, 0.8), -t * 2, '#ff8a6a'); }
    else { const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.5, 0], 16, 14, 1.6, 1.2, -0.6, -0.3, [0, 2.0, 0]); const S = Scene(E, TG, W, H_); plant(S, [0, 0, 0], t, { night: true }); S.render(ctx, W, H_, { bg: nightSky, dof: 0.33, focus: 14, dofGap: 8 }); }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.noise(0.05, { dur: DURATION - 0.1, color: 'brown', filter: 'lowpass', f: 200, gain: 0.05, a: 0.6, minor: true }); k.play('riser', V('hook', 'run') - 0.4, { gain: 0.2 });
    for (let i = 0; i < 8; i++) k.play('tick', V('split', 'split') + i * 0.14, { gain: 0.25, f: 1600 + i * 120, minor: true }); k.play('tock', V('split', 'graphite'), { f: 240, gain: 0.35 });
    k.noise(V('boil', 'boils'), { dur: 2.0, color: 'pink', filter: 'bandpass', f: 1600, q: 1.2, gain: 0.05, a: 0.4, minor: true });
    k.play('tock', V('rods', 'slide'), { f: 240, gain: 0.3 }); k.play('error', V('catch', 'speeds'), { gain: 0.3 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
