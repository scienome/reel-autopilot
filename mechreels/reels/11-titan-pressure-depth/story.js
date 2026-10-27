  // Short: "The pressure at the Titanic's depth" (9:16), for mechvideo 004
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['descend', BEAT0('column') - 0.15], ['can', BEAT0('can') - 0.15], ['sphere', BEAT0('sphere') - 0.15], ['titan', BEAT0('titan') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') { // the piano on a fingertip
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 3.2, 2.7, 0.3, 0.2, 0.5, -0.1, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const drop = flyIn(t, V('hook', 'four') - 0.2, 0.5, [0, 1.6, 0]);
      if (drop) pianoOnTip(S, add([0, 1.0, 0], drop), { hot: t > V('hook', 'square') - 0.2 }); else stand(S, [0, 0, 0], 0.4, 0.3, 0.95);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      flash = 0.1 * Math.exp(-Math.pow((t - V('hook', 'four')) * 6, 2));
    } else if (n === 'descend') {
      const u = ramp(t, sh.t0, Math.max(1, sh.t1 - sh.t0 - 0.4)), d = 3800 * u, P0 = [0, 2.5, 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 12, 11, 0.8, 0.4, -0.6, -0.2, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); titanSub(S, P0, { lights: 1 });
      S.render(ctx, W, H_, { ...deepEnv, bg: (c2, w, h) => { const g = c2.createLinearGradient(0, 0, 0, h); const k = 1 - u; g.addColorStop(0, `rgb(${30 + 60 * k},${70 + 110 * k},${110 + 110 * k})`); g.addColorStop(1, `rgb(${8 + 40 * k},${24 + 80 * k},${42 + 100 * k})`); c2.fillStyle = g; c2.fillRect(0, 0, w, h); } });
      deepGrade(ctx, W, H_, t, 0.2 + 0.2 * u);
      tally(ctx, W / 2, H_ * 0.2, Math.round(d / 10) * 10 + ' m', 1, 50); tally(ctx, W / 2, H_ * 0.29, Math.round(1 + d / 10) + ' atm', 1, 50, '#7ad0ff');
    } else if (n === 'can') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 2.4, 2.0, 0.2, 0.15, -0.3, 0.3, [0, 0.3, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.35, 0.3, 0.9);
      crushCan(S, [0, 0.92, 0], ramp(t, V('can', 'crushed') - 0.1, 0.25));
      squeeze(S, [0, 1.13, 0], 0.18, ramp(t, V('can', 'down') - 0.2, 0.5), 10, P.orange, 0.3, { w: 0.7 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.2 });
      flash = 0.12 * Math.exp(-Math.pow((t - V('can', 'crushed')) * 6, 2));
    } else if (n === 'sphere') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.6, 3.1, 0.2, 0.15, 0.4, -0.3, [0, 0.45, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      tiSphere(S, [0, 1.2, 0], 0.45, { glass: 0.6 }); squeeze(S, [0, 1.2, 0], 0.45, ramp(t, V('sphere', 'pressure') - 0.2, 0.6), 12, P.orange, 0.35);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.3 });
    } else {
      const P0 = [0, 1.5 + 0.2 * Math.sin(t * 0.6), 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 11, 10, 0.6, 0.4, 0.8, 1.1, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -2); wreckBow(S, [-5, -2, -9], { yaw: 0.4 }); titanSub(S, P0, { lights: 1, glass: ramp(t, V('titan', 'material') - 0.2, 0.6) * 0.85 });
      S.render(ctx, W, H_, deepEnv); deepGrade(ctx, W, H_, t);
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.play('thud', V('hook', 'four'), { f: 60, gain: 0.45 });
    k.noise(ST2('descend'), { dur: ST2('can') - ST2('descend'), color: 'brown', filter: 'lowpass', f: 220, gain: 0.08, a: 0.6, minor: true });
    for (let i = 0; i < 12; i++) k.play('count', ST2('descend') + 0.3 + i * 0.4, { gain: 0.25, f: 1600 + i * 60, minor: true });
    k.play('impact', V('can', 'crushed'), { gain: 0.4 }); k.noise(V('can', 'crushed'), { dur: 0.4, filter: 'bandpass', f: 2600, q: 2, gain: 0.12, a: 0.005 });
    k.play('ding', V('sphere', 'evenly'), { f: 'E6', gain: 0.25 });
    k.noise(ST2('titan'), { dur: DURATION - ST2('titan'), color: 'brown', filter: 'lowpass', f: 220, gain: 0.07, a: 0.6, minor: true }); k.play('riser', V('cta', 'happened') - 0.4, { gain: 0.2 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
