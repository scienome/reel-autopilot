  // Short: "He cut the only rope, on purpose" (9:16), for mechvideo 003
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['rig', BEAT0('spring') - 0.15], ['fair', BEAT0('safe') - 0.15], ['modern', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const plaza = (S) => { S.quad([[-40, 0, -40], [40, 0, -40], [40, 0, 40], [-40, 0, 40]], P.floor, { bg: true, grid: [0.6, 'rgba(150,104,84,0.3)'] }); S.box((q) => add(q, [0, 1.6, -5]), 7, 1.6, 0.6, P.glass, { alpha: 0.35, bevel: 0.02 }); };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'fair') {
      const isH = n === 'hook', tc = isH ? V('hook', 'cut') : -9;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2.0, 0], 7.4, 6.4, 0.2, 0.4, isH ? 0.3 : -0.3, isH ? -0.1 : 0.1, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); plaza(S);
      const py = isH ? 0.4 + 1.8 * ramp(t, 0, Math.max(0.5, tc - 0.6)) - 0.1 * ramp(t, tc + 0.1, 0.25) : 2.1;
      otisRig(S, [0, 0, 0], { height: 3.0, platY: py, load: 'man', cut: isH ? ramp(t, tc - 0.05, 0.4) : 1, flat: isH ? ramp(t, tc + 0.05, 0.2) : 1, arm: isH ? 0 : ramp(t, V('safe', 'safe') - 0.2, 0.4) });
      crowd(S, 0, 1.0, 14, 3, 1.6);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 6 });
      if (isH) { const rp = S.proj([0, py + 1.1, 0]); FX.sparks(ctx, rp[0], rp[1], H.clamp((t - tc) / 0.6), 9); flash = 0.15 * Math.exp(-Math.pow((t - tc) * 5, 2)); }
      else FX.confetti(ctx, W, H_, ramp(t, V('safe', 'safe') + 0.2, 2.0), t);
    } else if (n === 'rig') {
      const close = ramp(t, V('teeth', 'teeth') - 0.6, 0.8);
      const [E0, T0] = orbit(t, sh.t0, sh.t1, [0, 1.6, 0], 5.4, 4.6, 0.3, 0.2, -0.4, 0.3, [0, 0.55, 0]);
      const E = lerp3(E0, [1.4, 1.9, 2.4], close * 0.6), TG = lerp3(T0, [0.25, 2.3, 0], close * 0.6);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.65, 0.4, 0.12);
      const tc = V('snap', 'cut'), py = 1.25 - 0.06 * ramp(t, tc + 0.1, 0.2);
      otisRig(S, [0, 0.12, 0], { platY: py, flat: ramp(t, V('snap', 'snapped') - 0.1, 0.25), cut: ramp(t, tc - 0.05, 0.4), hi: ramp(t, V('teeth', 'teeth') - 0.1, 0.3) * (1 - ramp(t, tc - 0.3, 0.3)), load: 'crates' });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.8 });
      const sp = S.proj([0, py + 0.12 + 0.75, 0]); ringHi(ctx, sp[0], sp[1], 60, ramp(t, V('spring', 'spring') - 0.1, 0.3) * (1 - ramp(t, V('teeth', 'rails') - 0.2, 0.3)));
      for (const sx of [-1, 1]) { const pp = S.proj([sx * 0.36, py + 0.12 + 0.66, 0.05]); FX.sparks(ctx, pp[0], pp[1], H.clamp((t - V('snap', 'jammed')) / 0.6), 7 + sx); }
    } else {
      const tS = sh.t0 + 0.8, tG = sh.t0 + 2.0, cy0 = 32, cy = t < tS ? cy0 : cy0 - 0.8 * Math.pow(Math.min(t, tG) - tS, 2) - (t > tG ? 1.0 * Math.min(0.5, t - tG) : 0);
      const E = [0.7, cy + 1.25, 2.0], TG = [0.05, cy + 0.8, 0];
      const S = Scene(E, TG, W, H_); shaft(S, [0, 0, 0], { h: 40, carY: cy, floors: 0.8, snap: ramp(t, tS - 0.05, 0.5), brake: ramp(t, tG - 0.15, 0.3), gov: false, ropes: 6 });
      S.render(ctx, W, H_, { bg: shaftEnv, dof: 0.33, focus: 2.0, shadows: false });
      const wp = S.proj([0.28, cy, 0.05]); if (t > tG - 0.1 && t < tG + 0.8) FX.sparks(ctx, wp[0], wp[1], ((t * 3) % 1), 30 + Math.floor(t * 3));
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const clunk = (t, g = 1) => { k.play('tock', t, { f: 240, gain: 0.4 * g }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST2('rig'), color: 'pink', filter: 'bandpass', f: 1100, q: 0.4, gain: 0.05, a: 0.5, minor: true });
    k.play('stamp', V('hook', 'cut'), { gain: 0.4 }); clunk(V('hook', 'cut') + 0.2, 1.2);
    clunk(V('spring', 'spring')); k.play('pop', V('teeth', 'teeth'), { gain: 0.3 });
    k.play('stamp', V('snap', 'cut'), { gain: 0.35 }); clunk(V('snap', 'jammed'), 1.3); k.play('thud', V('snap', 'stopped'), { f: 90, gain: 0.3 });
    k.play('success', V('safe', 'safe'), { f: 'C6', gain: 0.4 }); k.play('sparkle', V('safe', 'safe') + 0.3, { gain: 0.35, n: 5 });
    k.play('stamp', ST2('modern') + 0.8, { gain: 0.3 }); k.noise(ST2('modern') + 2.0, { dur: 0.7, filter: 'bandpass', f: 3200, q: 8, gain: 0.08, a: 0.02 }); k.play('thud', ST2('modern') + 2.5, { f: 70, gain: 0.35 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
