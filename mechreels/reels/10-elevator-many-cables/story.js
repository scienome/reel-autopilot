  // Short: "Why elevators have so many cables" (9:16), for mechvideo 003. Opens on one rope snapping while the car stays put.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['counter', BEAT0('counter') - 0.15], ['governor', BEAT0('governor') - 0.15], ['wedges', BEAT0('wedges') - 0.15], ['buffers', BEAT0('buffers') - 0.15], ['tease', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const model = (S, o = {}) => { stand(S, [0, 0, 0], 0.75, 0.48, 0.28); return shaft(S, [0, 0.3, 0], { h: 2.9, carY: 1.1, ropes: 6, ...o }); };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') {
      const tc = V('hook', 'cable') - 0.1, cy = 32;
      const E = [0.6, cy + 1.45, 1.9], TG = [0.05, cy + 1.05, 0];
      const S = Scene(E, TG, W, H_); shaft(S, [0, 0, 0], { h: 40, carY: cy, floors: 0.8, cut1: ramp(t, tc, 0.4), gov: false, ropes: 6 });
      S.render(ctx, W, H_, { bg: shaftEnv, dof: 0.33, focus: 2.0, shadows: false });
      const rp = S.proj([0, cy + 0.8, 0]); FX.sparks(ctx, rp[0], rp[1], H.clamp((t - tc) / 0.6), 3); ringHi(ctx, rp[0], rp[1] - 60, 70, ramp(t, V('hook', 'several') - 0.1, 0.3), '126,224,122');
      flash = 0.14 * Math.exp(-Math.pow((t - tc) * 5, 2));
    } else if (n === 'counter') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.2, 2.2, 0], 4.6, 4.0, 0.3, 0.2, -0.3, 0.2, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const m = model(S, { carY: 1.1 + 0.35 * Math.sin((t - sh.t0) * 0.9) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 4.2 });
      const cp = S.proj(m.cw); ringHi(ctx, cp[0], cp[1], 50, ramp(t, V('counter', 'counterweight') - 0.1, 0.3));
    } else if (n === 'governor') {
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.3, 3.1, 2.4], [-0.3, 2.6, 0], [0.0, 3.1, 1.8], [-0.4, 2.7, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const spin = integ((u) => 3 + 9 * ramp(u, V('governor', 'fast') - 0.2, 0.6), t, 1 / 20);
      const m = model(S, { govSpin: spin, fly: ramp(t, V('governor', 'governor') - 0.2, 0.4) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.2 });
      const gp = S.proj(m.gov); FX.spin(ctx, gp[0], gp[1], 70, ramp(t, V('governor', 'spinning') - 0.1, 0.6), -spin); ringHi(ctx, gp[0], gp[1], 100, ramp(t, V('governor', 'clamp') - 0.1, 0.3), '255,90,70');
    } else if (n === 'wedges') {
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.8, 1.7, 2.0], [0.15, 1.5, 0], [0.6, 1.65, 1.6], [0.2, 1.5, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const br = ramp(t, V('wedges', 'wedges') - 0.15, 0.3);
      const m = model(S, { carY: 1.1 - 0.06 * br, brake: br, govSpin: 6, fly: 1 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
      const wp = S.proj(m.wedge); FX.sparks(ctx, wp[0], wp[1], H.clamp((t - V('wedges', 'wedges')) / 0.6), 21);
    } else if (n === 'buffers') {
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.8, 0.95, 2.1], [0.25, 0.75, 0], [0.6, 0.85, 1.7], [0.25, 0.7, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const m = model(S, { carY: 0.55 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
      const bp = S.proj(m.pit); ringHi(ctx, bp[0], bp[1], 56, ramp(t, V('buffers', 'springs') - 0.1, 0.3));
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 6.5, 0], 24, 21, 1.0, 0.5, 0.5, 0.75, [0, 0.8, 0]);
      const S = Scene(E, TG, W, H_); S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 40], [-60, 0, 40]], [150, 150, 158], { bg: true }); cityBlocks(S, 4, 1, [0, 0]); tower(S, [0, 0, 0]);
      S.render(ctx, W, H_, { bg: fogSky, dof: 0.33, focus: 22, dofGap: 12 }); fog(ctx, W, H_, 0.32);
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    const clunk = (t, g = 1) => { k.play('tock', t, { f: 240, gain: 0.4 * g }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.play('stamp', V('hook', 'cable') - 0.1, { gain: 0.35 }); k.play('ding', V('hook', 'several'), { f: 'E6', gain: 0.3 });
    k.noise(ST2('counter'), { dur: ST2('governor') - ST2('counter'), color: 'brown', filter: 'lowpass', f: 300, gain: 0.06, a: 0.4, minor: true });
    k.noise(V('governor', 'fast'), { dur: 1.2, filter: 'bandpass', f: [[0, 1400], [1.2, 2600]], q: 3, gain: 0.06, a: 0.1 }); clunk(V('governor', 'clamp'));
    k.noise(V('wedges', 'wedges'), { dur: 1.0, filter: 'bandpass', f: 3200, q: 8, gain: 0.08, a: 0.02 }); k.play('thud', V('wedges', 'squeezes') + 0.2, { f: 70, gain: 0.3 });
    k.play('pop', V('buffers', 'springs'), { gain: 0.3 }); k.play('riser', V('cta', 'failed') - 0.4, { gain: 0.25 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
