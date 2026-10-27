  // Short: "A jet with no engines landed in the middle of a car race" (9:16)
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['glide', BEAT0('setup') - 0.15], ['race', BEAT0('race') - 0.15], ['slip', BEAT0('high') - 0.15], ['land', BEAT0('touch') - 0.15], ['teaser', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const landing = (S, t, td, stopT, t0) => {
    const u = H.clamp((t - td) / (stopT - td)), x = t < td ? -14 + 9 * (t - t0) / Math.max(0.1, td - t0) : -5 + 19 * (1 - Math.pow(1 - u, 2));
    const nc = ramp(t, td + 0.3, 0.4), y = t < td ? 0.65 + 1.2 * (1 - H.clamp((t - t0) / Math.max(0.1, td - t0))) : 0.65;
    const P0 = [x, y, 0]; jet767(S, P0, { burn: 0, gear: 1, nose: 1, noseCollapse: nc, pitch: -0.09 * nc }); return { P0, nc };
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'land') {
      const td = n === 'hook' ? 0.2 : V('touch', 'nose') - 0.3, stopT = n === 'hook' ? sh.t1 + 1.5 : V('touch', 'stop');
      const xNow = (() => { const u = H.clamp((t - td) / (stopT - td)); return t < td ? -6 : -5 + 19 * (1 - Math.pow(1 - u, 2)); })(), cx = Math.max(-6, xNow);
      const E = [cx - 4.6, 2.0, 8.8], TG = [cx + 0.6, 1.5, 0];
      const S = Scene(E, TG, W, H_); gimliField(S);
      const { P0, nc } = landing(S, t, td, stopT, sh.t0 - 0.5);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 7 });
      const np = S.proj(add(P0, [2.3, -0.5, 0]));
      if (nc > 0.1 && t < stopT + 0.3) for (let q = 0; q < 3; q++) FX.sparks(ctx, np[0] - q * 16, np[1] + 8, ((t * 3 + q * 0.33) % 1), 20 + q + Math.floor(t * 3));
      if (n === 'land') flash = 0.12 * Math.exp(-Math.pow((t - V('safe', 'survived')) * 5, 2));
    } else if (n === 'glide') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.4, 7.4, 1.5, 1.2, 1.1, 0.7, [0.4, 1.25, 0]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { burn: 0, rat: 1, ratSpin: t * 25, pitch: -0.05 });
      S.render(ctx, W, H_, skyEnv);
      const eR = S.proj([0.4, SKY_Y - 0.33, 0.82]); FX.no(ctx, eR[0], eR[1], 40, ramp(t, V('setup', 'fuel') - 0.1, 0.25) * (1 - ramp(t, V('setup', 'glided') - 0.2, 0.3)));
    } else if (n === 'race') {
      const [E, TG] = dolly(t, sh.t0, sh.t1, [15, 3.0, 7], [24, 0.4, 0], [17, 2.4, 5.6], [25, 0.4, 0]);
      const S = Scene(E, TG, W, H_); gimliField(S);
      for (let i = 0; i < 3; i++) raceCar(S, 20 + ((t * 6 + i * 4) % 14), -1.3 + i * 0.25, 0, [[250, 200, 70], [236, 92, 70], [70, 140, 230]][i]);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 9 });
    } else if (n === 'slip') {
      const u = H.clamp((t - sh.t0) / (sh.t1 - sh.t0)), slipU = ramp(t, V('high', 'sideways') - 0.4, 0.6);
      const P0 = [-30 + 16 * u, 8 - 6 * u - 1.2 * ramp(t, V('high', 'drop') - 0.2, 1.0), 0];
      const E = add(P0, [-8.0, 2.0, 6.0]), TG = add(P0, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); gimliField(S);
      jet767(S, P0, { burn: 0, rat: 1, ratSpin: t * 22, yaw: 0.38 * slipU, roll: -0.22 * slipU, pitch: -0.06, gear: 0 });
      if (slipU > 0) for (const dx of [-1.2, 0, 1.2]) S.arrow(add(P0, [dx + 0.3, 0.1, 2.2]), add(P0, [dx, 0.1, 2.2 - 1.1 * slipU]), P.air, { side: [0, 1, 0], w: 0.22, th: 0.05, noShadow: true });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 7, dofGap: 25 });
    } else { // teaser: one wrong number
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.1, 0.9, 0], 3.9, 3.4, 0.8, 0.6, 0.25, -0.15, [0, 0.62, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      balance(S, [0.1, 0, 0], 0.22, 0.17, 0.09);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      const rp = S.proj([0.7, 0.75, 0]); FX.no(ctx, rp[0], rp[1] - 40, 50, ramp(t, V('cta', 'wrong') - 0.1, 0.25));
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.play('impact', 0.25, { gain: 0.45 }); k.noise(0.3, { dur: ST2('glide') - 0.3, filter: 'bandpass', f: 2200, q: 1.5, gain: 0.08, a: 0.05 });
    k.noise(ST2('glide'), { dur: ST2('race') - ST2('glide'), color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: 0.07, a: 0.4, minor: true });
    k.noise(ST2('race'), { dur: ST2('slip') - ST2('race'), color: 'brown', filter: 'bandpass', f: [[0, 300], [1, 520], [2, 340], [3, 560]], q: 2, gain: 0.08, a: 0.2, minor: true });
    k.noise(V('high', 'sideways'), { dur: 1.8, color: 'pink', filter: 'lowpass', f: 700, gain: 0.1, a: 0.3 });
    k.play('impact', V('touch', 'nose') - 0.3, { gain: 0.5 }); k.noise(V('touch', 'collapsed'), { dur: Math.max(1, V('touch', 'stop') - V('touch', 'collapsed')), filter: 'bandpass', f: 2200, q: 1.5, gain: 0.1, a: 0.05 });
    k.play('thud', V('touch', 'stop') + 0.2, { f: 60, gain: 0.4 }); k.play('success', V('safe', 'survived'), { f: 'C6', gain: 0.45 });
    k.play('error', V('cta', 'wrong'), { gain: 0.3 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
