  // Short: "Could hitting head-on have saved the Titanic?" (9:16), for mechvideo 006
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['turn', BEAT0('turn') - 0.15], ['comp', V('turn', 'opening') - 0.15], ['headon', BEAT0('headon') - 0.15], ['arizona', BEAT0('arizona') - 0.15], ['but', BEAT0('but') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const lv = (k5) => { const a = []; for (let i = 0; i < 16; i++) a.push(i < k5 ? 0.6 : 0); return a; };
  // from above: the ship comes along +x toward the iceberg; turning (left) or straight on (the bow crumples)
  const top = (ctx, W, H_, t, sh, headOn) => {
    const S = Scene([-1, 26, 7], [-1, 0, -1.5], W, H_); nightSea(S);
    const go = H.clamp((t - sh.t0) / (sh.t1 - sh.t0)), x = -11 + 11.5 * go, yaw = headOn ? 0 : 0.35 * ramp(t, sh.t0 + 0.3, 2.5), hit = headOn && x > -3.3;
    iceberg(S, [2, 0, 0.6], 0.8, 5); liner(S, [hit ? -3.3 : x, 0, -0.3 * (yaw / 0.35) * go], { yaw, lights: 1, crumple: hit ? ramp(t, sh.t0 + 0.6 * (sh.t1 - sh.t0), 0.4) : 0 });
    S.render(ctx, W, H_, { ...nightEnv, dof: 0 });
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'arizona') {
      const isA = n === 'arizona';
      const [E, TG] = orbit(t, sh.t0, sh.t1, [2.5, 0.8, 0], 11, 10, 1.0, 0.8, 0.6, 0.9, [0, 1.8, 0]);
      const S = isA ? seaScene(E, TG, W, H_, t, { clouds: false }) : Scene(E, TG, W, H_); if (!isA) nightSea(S);
      liner(S, [isA ? -0.3 * (t - sh.t0) : 0, 0, 0], { s: isA ? 0.7 : 1, funnels: isA ? 1 : 4, crumple: isA ? 1 : ramp(t, V('hook', 'head-on') - 0.3, 0.5), lights: isA ? 0 : 1, boats: isA ? 2 : 8 });
      if (!isA) iceberg(S, [4.45, 0, 0], 0.8, 5);
      S.render(ctx, W, H_, isA ? { ...skyEnv, focus: 10 } : nightEnv);
      if (!isA) { const bp = S.proj([3.6, 0.3, 0]); FX.sparks(ctx, bp[0], bp[1], H.clamp((t - V('hook', 'head-on')) / 0.6), 4); flash = 0.12 * Math.exp(-Math.pow((t - V('hook', 'head-on')) * 5, 2)); }
      else tally(ctx, W / 2, H_ * 0.2, '1879', ramp(t, V('arizona', 'eighteen') - 0.1, 0.3));
    } else if (n === 'turn' || n === 'but') { top(ctx, W, H_, t, sh, false); }
    else if (n === 'headon') { const hs = { ...sh, t1: Math.min(sh.t1, sh.t0 + 3.5) }; if (t < hs.t1) top(ctx, W, H_, t, hs, true); else {
      const [E, TG] = orbit(t, hs.t1, sh.t1, [0.2, 1.0, 0], 3.9, 3.4, 0.4, 0.3, 0.4, 0.0, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S); compModel(S, [0.2, 0.9, 0], { t, levels: lv(2), hi: [0, 1] }); S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
      tally(ctx, W / 2, H_ * 0.2, '2 of 16', ramp(t, hs.t1, 0.3), 56, '#7ee07a'); } }
    else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.2, 1.0, 0], 3.9, 3.4, 0.4, 0.3, 0.4, 0.0, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S); compModel(S, [0.2, 0.9, 0], { t, levels: lv(5), hi: [0, 1, 2, 3, 4] }); S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
      tally(ctx, W / 2, H_ * 0.2, '5 of 16', ramp(t, V('turn', 'five') - 0.1, 0.3), 56, '#ff8a6a');
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.noise(0.05, { dur: ST2('turn'), color: 'pink', filter: 'bandpass', f: 600, q: 0.4, gain: 0.05, a: 0.3, minor: true }); k.play('impact', V('hook', 'head-on'), { gain: 0.4 });
    k.noise(ST2('turn') + 1.5, { dur: 2.0, filter: 'bandpass', f: [[0, 1800], [2, 900]], q: 2, gain: 0.1, a: 0.1 }); k.play('error', V('turn', 'five'), { gain: 0.3 });
    k.play('impact', ST2('headon') + 0.6 * 3.5, { gain: 0.4 }); k.play('ding', V('headon', 'four'), { f: 'E6', gain: 0.3 });
    k.play('success', V('arizona', 'port'), { f: 'C6', gain: 0.35 }); k.play('riser', V('cta', 'turned') - 0.4, { gain: 0.2 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
