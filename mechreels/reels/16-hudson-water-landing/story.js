  // Short: "Why landing on water is so hard" (9:16), for mechvideo 005. Opens on the touchdown spray.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['cartwheel', BEAT0('cartwheel') - 0.15], ['needs', BEAT0('needs') - 0.15], ['sully', BEAT0('sully') - 0.15], ['float', BEAT0('float') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const J = (S, x, y, o = {}) => jet767(S, [x, y + 0.036, 0], { s: 0.3, burn: 0, ...o });
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'sully') {
      const tT = n === 'hook' ? V('hook', 'water') - 0.3 : V('sully', 'down'), u = H.clamp((t - tT) / 2.6), x = t < tT ? 3.0 * (tT - t) : -4.5 * (1 - Math.pow(1 - u, 2)), y = t < tT ? Math.min(1.2, 0.25 * (tT - t)) : 0;
      const S = Scene([x + 1.9, 0.9, 3.2], [x - 0.6, 0.45, 0], W, H_); nyc(S, { bridge: false });
      J(S, x, y, { yaw: Math.PI, pitch: t < tT ? 0.16 : 0.16 * (1 - u) });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 3.6 });
      const sp = S.proj([x + 0.6, 0, 0]); if (t > tT) { spray(ctx, sp[0], sp[1], H.clamp((t - tT) / 1.4), 8, 150); spray(ctx, sp[0] - 60, sp[1], H.clamp((t - tT - 0.5) / 1.6), 9, 120); }
      flash = 0.18 * Math.exp(-Math.pow((t - tT) * 5, 2));
      if (n === 'hook') tally(ctx, W / 2, H_ * 0.2, '≈ 230 km/h', ramp(t, V('hook', 'two') - 0.1, 0.3), 56);
    } else if (n === 'cartwheel') {
      const td = V('cartwheel', 'digs'), u = H.clamp((t - td) / 2.0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.5, 0], 6.2, 5.6, 0.8, 0.6, 0.6, 0.9, [0, 0.6, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: false });
      const x = t < td ? -6 + 6 * H.clamp((t - sh.t0) / Math.max(0.5, td - sh.t0)) : 0.8 * u;
      J(S, x, t < td ? 0.5 * (1 - H.clamp((t - sh.t0) / Math.max(0.5, td - sh.t0))) + 0.06 : 0.06, { roll: -0.35 - 2.6 * u, yaw: 1.8 * u * u, pitch: -0.2 * u });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 5.8 });
      const sp = S.proj([x, 0, 0.6]); spray(ctx, sp[0], sp[1], H.clamp((t - td) / 1.6), 5, 160); FX.no(ctx, W / 2, H_ * 0.25, 56, ramp(t, V('cartwheel', 'break') - 0.1, 0.25));
      flash = 0.15 * Math.exp(-Math.pow((t - td) * 5, 2));
    } else if (n === 'needs') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.45, 0], 4.2, 3.6, 0.35, 0.25, 0.4, 0.8, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: false });
      const lv = ramp(t, V('needs', 'level') - 0.2, 0.5), nu = ramp(t, V('needs', 'nose') - 0.2, 0.5);
      jet767(S, [0, 0.42, 0], { s: 0.3, burn: 0, roll: 0.3 * (1 - lv), pitch: 0.17 * nu });
      if (lv > 0) S.arrow([0, 0.75, -0.95], [0, 0.75, 0.95], P.green, { side: [1, 0, 0], w: 0.07, th: 0.02, noShadow: true });
      const su = ramp(t, V('needs', 'sink') - 0.2, 0.4); if (su > 0) S.arrow([0, 0.35, 0], [0, 0.35 - 0.2 * su, 0], P.air, { side: [1, 0, 0], w: 0.06, th: 0.02, noShadow: true });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 3.8 });
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.3, 0], 5.6, 4.8, 0.8, 0.6, -0.4, 0.2, [0, 0.55, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: false });
      J(S, 0, -0.05, { pitch: 0.04, yaw: Math.PI }); wingPeople(S, [0, 0.1, 0], Math.round(6 + 16 * ramp(t, V('float', 'passengers') - 0.2, 2)), 3, 0.3);
      const fu = ramp(t, V('float', 'ferries') - 0.6, 2.0); ferry(S, [1.0 + 4 * (1 - fu), 0, 1.3], 0.3);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 5 });
      FX.confetti(ctx, W, H_, ramp(t, V('cta', 'survived'), 2.4), t);
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    const hit = (tt) => { k.play('impact', tt, { gain: 0.5 }); k.noise(tt, { dur: 1.8, color: 'pink', filter: 'bandpass', f: 700, q: 0.5, gain: 0.13, a: 0.02 }); };
    k.noise(0.05, { dur: V('hook', 'water') - 0.3, color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: 0.07, a: 0.3, minor: true }); hit(V('hook', 'water') - 0.3);
    hit(V('cartwheel', 'digs')); k.play('error', V('cartwheel', 'break'), { gain: 0.3 });
    for (const w of ['level', 'nose', 'sink']) k.play('pop', V('needs', w), { gain: 0.3, minor: true });
    hit(V('sully', 'down')); k.noise(ST2('float'), { dur: DURATION - ST2('float'), color: 'pink', filter: 'lowpass', f: 500, gain: 0.05, a: 0.5, minor: true });
    k.play('success', V('cta', 'survived'), { f: 'C6', gain: 0.45 }); k.play('sparkle', V('cta', 'survived') + 0.3, { gain: 0.35, n: 5 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
