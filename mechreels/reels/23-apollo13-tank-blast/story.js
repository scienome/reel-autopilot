  // Short: "The tank that was broken before Apollo 13 launched" (9:16), for mechvideo 008. Opens on the blast in space.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['bench', BEAT0('jolt') - 0.15], ['space', BEAT0('blast') - 0.15], ['tease', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const space = (ctx, W, H_, t, sh, tb, o = {}) => {
    const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.6, 0, 0], 5.4, 4.8, 0.6, 0.4, 0.4, 0.8, [0, 0.55, 0]);
    const S = Scene(E, TG, W, H_); earth(S, [-40, -6, -30], 5); moon(S, [40, 4, -40], 6);
    const st = apolloStack(S, [0, 0, 0], { s: 2, panel: ramp(t, tb - 0.05, 1.6), cmLit: 1, lmLit: o.lm ? 1 : 0, roll: 0.15 * Math.sin(t * 0.5) * (t > tb ? 1 : 0) });
    S.render(ctx, W, H_, spaceEnv);
    if (t > tb) { const p = S.proj(st.bay); puffs(ctx, p[0], p[1], ((t - tb) / 2.2) % 1, 5, '235,240,250', 80); }
    return 0.45 * Math.exp(-Math.pow((t - tb) * 5, 2));
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') flash = space(ctx, W, H_, t, sh, V('hook', 'killed') - 0.2);
    else if (n === 'bench') {
      const tj = V('jolt', 'jolted'), ts = V('stir', 'sparked');
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.45, 1.15, 0], 3.4, 2.9, 0.3, 0.2, 0.4, -0.1, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const c = [0, 1.15 + 0.12 * Math.max(0, Math.sin(Math.PI * H.clamp((t - tj + 0.3) / 0.3))), 0];
      const m = o2Tank(S, c, t, { glass: 0.75, heat: ramp(t, V('jolt', 'heater') - 0.2, 0.6), wires: ramp(t, V('weld', 'cooked') - 0.3, 0.8), fan: integ((u) => (u > V('stir', 'fans') - 0.2 ? 8 : 0), t, 1 / 20), fire: ramp(t, ts, 0.5), oxygen: 1, power: 1 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      const sp = S.proj(m.switch); FX.sparks(ctx, sp[0], sp[1], H.clamp((t - V('weld', 'welded')) / 0.6), 4); ringHi(ctx, sp[0], sp[1], 46, ramp(t, V('weld', 'welded') - 0.1, 0.3) * (1 - ramp(t, V('stir', 'fifty-six') - 0.3, 0.3)), '255,90,70');
      tally(ctx, W / 2, H_ * 0.2, '28 V switch · 65 V supply', ramp(t, V('jolt', 'voltage') - 0.1, 0.3) * (1 - ramp(t, V('stir', 'fifty-six') - 0.3, 0.3)), 40, '#ff8a6a');
      const tp = S.proj(m.tank); FX.sparks(ctx, tp[0], tp[1], H.clamp((t - ts) / 0.6), 5); FX.spin(ctx, tp[0], tp[1], 80, ramp(t, V('stir', 'fans') - 0.1, 0.6), -t * 6);
    } else if (n === 'space') flash = space(ctx, W, H_, t, sh, V('blast', 'apart'));
    else flash = space(ctx, W, H_, t, sh, -9, { lm: true });
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const blast = (tt) => { k.play('impact', tt, { gain: 0.55 }); k.play('thud', tt + 0.1, { f: 60, gain: 0.4 }); k.noise(tt + 0.2, { dur: 2.5, color: 'white', filter: 'highpass', f: 1800, gain: 0.08, a: 0.05 }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    blast(V('hook', 'killed') - 0.2); k.play('thud', V('jolt', 'jolted'), { f: 120, gain: 0.35 }); k.play('error', V('jolt', 'voltage'), { gain: 0.3 });
    k.play('glitch', V('weld', 'welded'), { gain: 0.3 }); k.noise(V('stir', 'fans'), { dur: 1.5, filter: 'bandpass', f: 900, q: 3, gain: 0.05, a: 0.2, minor: true }); k.play('glitch', V('stir', 'sparked'), { gain: 0.35 });
    blast(V('blast', 'apart')); k.play('riser', V('cta', 'incredible') - 0.4, { gain: 0.2 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
