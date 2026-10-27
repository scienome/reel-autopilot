  // Short: "Apollo 13's slingshot around the Moon" (9:16), for mechvideo 008
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['why', BEAT0('why') - 0.15], ['burn', BEAT0('burn') - 0.15], ['map', V('burn', 'path') - 0.15], ['far', BEAT0('far') - 0.15], ['splash', V('home', 'four') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const space = (ctx, W, H_, t, sh, o = {}, b = {}) => {
    const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], b.r || 6.5, (b.r || 6.5) - 0.8, 0.8, 0.5, b.a0 ?? 1.0, (b.a0 ?? 1.0) + 0.4, [0, 0.55, 0]);
    const S = Scene(E, TG, W, H_); earth(S, b.earth || [-40, -6, -30], b.er || 5); moon(S, b.moon || [40, 4, -40], b.mr || 6);
    const st = apolloStack(S, [0, 0, 0], { s: 2, panel: 1, lmLit: 1, ...o }); S.render(ctx, W, H_, spaceEnv); return { S, st };
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'far') space(ctx, W, H_, t, sh, {}, { moon: [-4, -1, -9], mr: 6, earth: [60, 8, 60], er: 2, a0: 2.2 });
    else if (n === 'why') { const { S, st } = space(ctx, W, H_, t, sh, {}, { a0: 0.4 }); const p = S.proj(add(st.bay, [-1.0, 0, 0])); FX.no(ctx, p[0], p[1], 50, ramp(t, V('why', 'risky') - 0.1, 0.25)); }
    else if (n === 'burn') { const e = ramp(t, V('burn', 'burn') - 0.1, 0.3); const { S, st } = space(ctx, W, H_, t, sh, { engine: e }, { a0: 1.3 }); const ep = S.proj(st.engine); FX.heat(ctx, ep[0], ep[1], 110, e, t, 'rgba(255,200,120,0.9)'); }
    else if (n === 'map') { const S = Scene([7, 44, 10], [7, 0, 0], W, H_); freeReturn(S, t, ramp(t, sh.t0, 1.6), { home: ramp(t, sh.t0 + 1.4, 1.6) }); S.render(ctx, W, H_, { ...spaceEnv, dof: 0 }); }
    else {
      const ts = V('home', 'splashed'), y = t < ts ? 0.2 + 1.6 * (ts - t) / Math.max(0.5, ts - sh.t0) : 0;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.0, 0], 7.0, 6.2, 0.4, 0.3, 0.4, 0.8, [0, 1.0, 0]);
      const S = seaScene(E, TG, W, H_, t, { clouds: true }); splashCM(S, [0, y + 0.08, 0], { chutes: t < ts ? 1 : 1 - ramp(t, ts + 0.3, 1.2) }); S.render(ctx, W, H_, { ...skyEnv, focus: 6.5 });
      FX.confetti(ctx, W, H_, ramp(t, V('home', 'safely'), 2.4), t);
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.noise(0.05, { dur: ST2('splash'), color: 'brown', filter: 'lowpass', f: 250, gain: 0.04, a: 0.6, minor: true });
    k.play('buzz', V('why', 'risky'), { gain: 0.25 }); k.noise(V('burn', 'burn'), { dur: 2.0, color: 'brown', filter: 'lowpass', f: 500, gain: 0.12, a: 0.1 });
    k.play('ding', V('far', 'farther'), { f: 'E6', gain: 0.25 }); k.noise(V('home', 'sped'), { dur: 1.2, color: 'brown', filter: 'lowpass', f: 500, gain: 0.1, a: 0.1 });
    k.play('impact', V('home', 'splashed'), { gain: 0.4 }); k.play('success', V('home', 'safely'), { f: 'C6', gain: 0.5 }); k.play('sparkle', V('home', 'safely') + 0.3, { gain: 0.4, n: 6 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
