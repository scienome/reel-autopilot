  // Short: "Chernobyl's shutdown button made it worse" (9:16), for mechvideo 007. Opens on the button.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['rod', BEAT0('rod') - 0.15], ['plant', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') {
      const tp = V('hook', 'pressing');
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.6, 1.75, 1.45], [0.3, 1.35, 0], [0.45, 1.65, 1.15], [0.3, 1.3, 0]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      azDesk(S, [0, 0.95, 0], { pressed: ramp(t, tp - 0.1, 0.15), glow: t > tp ? 1 : 0 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.6 }); flash = 0.15 * Math.exp(-Math.pow((t - tp) * 6, 2));
    } else if (n === 'rod') {
      const tin = V('in', 'back'), ins = t < V('out', 'pulled') ? 0.6 - 0.58 * ramp(t, V('rod', 'boron'), 1.0) : t < tin ? 0.02 : 0.02 + 0.98 * H.clamp((t - tin) / 18);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 4.2, 3.6, 0.1, 0.05, 0.4, -0.2, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const r = rodRig(S, [0, 1.25, 0], ins, { hot: ramp(t, V('in', 'pushing') - 0.2, 0.6) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.7 });
      const gp = S.proj(r.graphite), cb = S.proj(r.coreBot); ringHi(ctx, gp[0], gp[1], 60, ramp(t, V('rod', 'graphite') - 0.1, 0.3) * (1 - ramp(t, V('out', 'night') - 0.2, 0.3)), '255,90,70');
      ringHi(ctx, cb[0], cb[1], 80, ramp(t, V('surge', 'jumped') - 0.1, 0.3), '255,90,70');
      tally(ctx, W / 2, H_ * 0.2, Math.max(0, Math.round(t - V('surge', 'slow') + 0.5)) + ' s / 18 s', ramp(t, V('surge', 'eighteen') - 0.1, 0.3), 50);
    } else {
      const tl = V('cta', 'last') + 0.2;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2.0, 0], 16, 14, 1.8, 1.4, 0.6, 0.9, [0, 2.0, 0]);
      const S = Scene(E, TG, W, H_); const p = plant(S, [0, 0, 0], t, { night: true, lid: ramp(t, tl - 0.1, 1.2), roof: t < tl }); S.render(ctx, W, H_, { bg: nightSky, dof: 0.33, focus: 14, dofGap: 8 });
      const cp = S.proj(p.core); if (t > tl) puffs(ctx, cp[0], cp[1] - 40, ((t - tl) / 3) % 1, 6, '120,110,110', 100); flash = 0.4 * Math.exp(-Math.pow((t - tl) * 5, 2));
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.25, minor: true });
    k.play('tock', V('hook', 'pressing'), { f: 240, gain: 0.45 }); k.tone(V('hook', 'pressing') + 0.2, { f: 420, dur: 1.2, type: 'square', gain: 0.05, a: 0.02 });
    k.play('error', V('rod', 'graphite'), { gain: 0.3 }); for (let i = 0; i < 6; i++) k.play('tock', V('out', 'pulled') + i * 0.12, { f: 260, gain: 0.2, minor: true });
    k.play('riser', V('in', 'back'), { gain: 0.3 }); k.play('buzz', V('surge', 'jumped'), { gain: 0.3 });
    k.play('impact', V('cta', 'last') + 0.2, { gain: 0.55 }); k.noise(V('cta', 'last') + 0.2, { dur: 2.2, color: 'brown', filter: 'lowpass', f: [[0, 900], [2.2, 100]], gain: 0.14, a: 0.005 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
