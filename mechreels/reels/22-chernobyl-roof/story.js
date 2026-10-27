  // Short: "Why Chernobyl's roof went flying" (9:16), for mechvideo 007. Opens on the lid going up.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['core', BEAT0('spike') - 0.15], ['lid', BEAT0('lid') - 0.15], ['desk', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const plantAt = (ctx, W, H_, t, sh, tl, o = {}) => {
    const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2.0, 0], 16, 15, 1.8, 1.4, o.a0 ?? 0.6, (o.a0 ?? 0.6) + 0.3, [0, 2.2, 0]);
    const S = Scene(E, TG, W, H_); const p = plant(S, [0, 0, 0], t, { night: true, lid: ramp(t, tl - 0.1, 1.2), roof: t < tl }); S.render(ctx, W, H_, { bg: nightSky, dof: 0.33, focus: 15, dofGap: 8 });
    const cp = S.proj(p.core); if (t > tl) { FX.heat(ctx, cp[0], cp[1], 140, ramp(t, tl, 0.6), t, 'rgba(255,120,40,0.9)'); puffs(ctx, cp[0], cp[1] - 40, ((t - tl) / 3) % 1, 6, '120,110,110', 100); }
    return { S, cp };
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') { const tl = V('hook', 'blown') - 0.2; plantAt(ctx, W, H_, t, sh, tl); flash = 0.4 * Math.exp(-Math.pow((t - tl) * 5, 2)); }
    else if (n === 'core') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.6, 3.1, 0.4, 0.3, 0.4, -0.1, [0, 0.5, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const m = coreModel(S, [0, 0.75, 0], t, { rods: 0.25, power: 0.6 + 0.4 * ramp(t, V('spike', 'spiked') - 0.2, 0.6), water: 1, boil: 0.3 + 0.7 * ramp(t, V('steam', 'flashed') - 0.2, 0.4), neutrons: 1 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.3 });
      const mp = S.proj(m.mid); FX.heat(ctx, mp[0], mp[1] - 120, 160, ramp(t, V('spike', 'spiked'), 0.6), t); FX.sparks(ctx, mp[0], mp[1], H.clamp((t - V('steam', 'shattered')) / 0.6), 5);
      if (t > V('steam', 'nowhere') - 0.2) { const g = S.proj(m.top); FX.no(ctx, g[0], g[1] - 30, 46, ramp(t, V('steam', 'nowhere') - 0.1, 0.25)); }
    } else if (n === 'lid') { const tl = V('lid', 'lifted'); plantAt(ctx, W, H_, t, sh, tl, { a0: -0.4 }); flash = 0.4 * Math.exp(-Math.pow((t - tl) * 5, 2)) + 0.3 * Math.exp(-Math.pow((t - V('second', 'second')) * 5, 2)); }
    else {
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.6, 1.75, 1.45], [0.3, 1.35, 0], [0.45, 1.65, 1.15], [0.3, 1.3, 0]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false }); azDesk(S, [0, 0.95, 0], { glow: 1, pressed: 1 }); S.render(ctx, W, H_, { dof: 0.33, focus: 1.6 });
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const boom = (tt, g = 0.55) => { k.play('impact', tt, { gain: g }); k.noise(tt, { dur: 2.2, color: 'brown', filter: 'lowpass', f: [[0, 900], [2.2, 100]], gain: 0.14, a: 0.005 }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    boom(V('hook', 'blown') - 0.2); k.noise(V('spike', 'spiked'), { dur: 1.8, filter: 'highpass', f: 2000, gain: 0.08, a: 0.3 });
    k.noise(V('steam', 'flashed'), { dur: 1.5, color: 'white', filter: 'highpass', f: 1500, gain: 0.1, a: 0.05 }); k.play('buzz', V('steam', 'nowhere'), { gain: 0.25 });
    boom(V('lid', 'lifted'), 0.6); boom(V('second', 'second'), 0.5); k.noise(V('second', 'fire'), { dur: 3, filter: 'highpass', f: 2500, gain: 0.05, a: 0.4, minor: true });
    k.play('tock', ST2('desk') + 0.3, { f: 240, gain: 0.35 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
