  // Short: "Why the Titanic's watertight walls failed" (9:16), for mechvideo 006. Opens on the spilling compartments.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['comp', BEAT0('comp') - 0.15], ['tray', BEAT0('tray') - 0.15], ['sea', BEAT0('doom') - 0.15], ['tease', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const lv = (f) => { const a = []; for (let i = 0; i < 16; i++) a.push(f(i)); return a; };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'comp' || n === 'tray') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.2, 1.0, 0], 3.9, 3.4, 0.4, 0.3, n === 'tray' ? -0.2 : 0.4, n === 'tray' ? 0.25 : 0.0, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      let o;
      if (n === 'hook') o = { t, line: 1, levels: lv((i) => (i < 5 ? 0.9 : i < 7 ? 0.5 : 0)), pitch: -0.12, spill: 1 };
      else if (n === 'comp') { const fu = ramp(t, V('comp', 'four') - 0.3, 1.0), f5 = ramp(t, V('five', 'five') - 0.2, 0.8); o = { t, levels: lv((i) => (i < 4 ? 0.5 * fu : i === 4 ? 0.5 * f5 : 0)), hi: f5 > 0 ? [0, 1, 2, 3, 4] : [] }; }
      else { const tl = ramp(t, V('tray', 'bow') - 0.3, 1.4), nx = ramp(t, V('tray', 'spilled') - 0.1, Math.max(1, sh.t1 - V('tray', 'spilled'))); o = { t, pitch: -0.13 * tl, spill: ramp(t, V('tray', 'spilled') - 0.3, 0.6), levels: lv((i) => (i < 5 ? 0.55 + 0.4 * tl : i < 9 ? 0.9 * H.clamp(nx * 4 - (i - 5)) : 0)) }; }
      const m = compModel(S, [0.2, 0.9, 0], o);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
      if (n === 'hook') { const p = S.proj(m.line); ringHi(ctx, p[0], p[1], 60, ramp(t, V('hook', 'up') - 0.1, 0.3), '255,90,70'); }
      if (n === 'comp') { const p = S.proj(m.bow); ringHi(ctx, p[0] - 90, p[1], 80, ramp(t, V('comp', 'four') - 0.1, 0.3) * (1 - ramp(t, V('five', 'five') - 0.3, 0.3)), '126,224,122'); FX.no(ctx, p[0] - 90, p[1] - 120, 46, ramp(t, V('five', 'five') - 0.1, 0.25)); }
    } else if (n === 'sea') {
      const deep = 0.15 + 0.2 * ramp(t, sh.t0, sh.t1 - sh.t0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.6, 0], 15, 13.5, 1.3, 1.0, -0.6, -0.3, [0, 2.2, 0]);
      const S = Scene(E, TG, W, H_); nightSea(S); liner(S, [0, -0.8 * deep, 0], { pitch: -deep, lights: 1 - ramp(t, V('doom', 'gone') - 0.3, 0.8) * 0.9 });
      S.render(ctx, W, H_, nightEnv);
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [2, 0.8, 0], 11, 10, 1.0, 0.8, 0.6, 0.9, [0, 1.6, 0]);
      const S = Scene(E, TG, W, H_); nightSea(S); liner(S, [0, 0, 0], { lights: 1 }); iceberg(S, [4.45, 0, 0], 0.8, 5);
      S.render(ctx, W, H_, nightEnv);
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    const water = (tt, d = 1.5) => k.noise(tt, { dur: d, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.09, a: 0.1 });
    water(0.1, ST2('comp') - 0.2); k.play('error', V('hook', 'up'), { gain: 0.25 });
    water(V('comp', 'four')); k.play('ding', V('comp', 'four') + 0.3, { f: 'E6', gain: 0.25 }); k.play('error', V('five', 'five'), { gain: 0.3 });
    water(V('tray', 'spilled'), 3); k.noise(ST2('sea'), { dur: ST2('tease') - ST2('sea'), color: 'pink', filter: 'bandpass', f: 600, q: 0.4, gain: 0.05, a: 0.5, minor: true }); k.play('thud', V('doom', 'gone'), { f: 60, gain: 0.3 });
    k.play('riser', V('cta', 'head-on') - 0.4, { gain: 0.2 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
