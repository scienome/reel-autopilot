  // Short: "She fell 75 floors in an elevator and lived" (9:16), for mechvideo 003. Opens mid-fall.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['tower', BEAT0('crash') - 0.15], ['fall', BEAT0('fall') - 0.15], ['pit', BEAT0('coil') - 0.15], ['lived', BEAT0('lived') - 0.15], ['model', BEAT0('cta') - 0.15]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST2 = (n) => SH.find((s) => s[0] === n)[1];
  const tF = V('fall', 'snapped'), tB = ST2('pit') - 0.1;
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook' || n === 'fall') {
      const cy = n === 'hook' ? 40 - 6 * t * t * 0.4 : (t < tF ? 58 : 58 * (1 - Math.pow(H.clamp((t - tF) / Math.max(0.8, tB - tF)), 1.6)));
      const falling = n === 'hook' || t > tF;
      const E = [0.75, cy + 1.3, 2.1], TG = [0.05, cy + 0.85, 0];
      const S = Scene(E, TG, W, H_); shaft(S, [0, 0, 0], { h: 62, carY: cy, floors: 0.78, snap: n === 'hook' ? 1 : ramp(t, tF - 0.05, 0.5), gov: false, ropes: 6 });
      S.render(ctx, W, H_, { bg: shaftEnv, dof: 0.33, focus: 2.2, shadows: false });
      if (falling) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 3; const r = H.rng(Math.floor(t * 12)); for (let i = 0; i < 12; i++) { const x = r() * W, y = r() * H_; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 130); ctx.stroke(); } ctx.restore(); }
      if (n === 'fall') { const rp = S.proj([0, cy + 0.75, 0]); FX.sparks(ctx, rp[0], rp[1], H.clamp((t - tF) / 0.6), 13); flash = 0.16 * Math.exp(-Math.pow((t - tF) * 5, 2)); }
    } else if (n === 'tower' || n === 'lived') {
      const foggy = n === 'tower', tI = V('crash', 'flew') + 0.3;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 6.5, 0], 24, 21, 1.0, 0.5, foggy ? 0.5 : -0.4, foggy ? 0.75 : -0.15, [0, 0.8, 0]);
      const S = Scene(E, TG, W, H_); S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 40], [-60, 0, 40]], [150, 150, 158], { bg: true }); cityBlocks(S, 4, 1, [0, 0]); const tw = tower(S, [0, 0, 0]);
      if (foggy && t < tI) { const u = H.clamp((t - (tI - 4)) / 4); bomber(S, lerp3([-9, 7.95, 7], add(tw.f79, [-0.35, 0.05, 0]), u), { s: 0.45, yaw: Math.atan2(7 - 0.46, 9), prop: t * 30 }); }
      S.render(ctx, W, H_, { bg: foggy ? fogSky : sunsetSky, dof: 0.33, focus: 22, dofGap: 12 });
      const fp = S.proj(tw.f79);
      if (foggy) { if (t > tI) { FX.heat(ctx, fp[0], fp[1], 90, ramp(t, tI, 0.5), t, 'rgba(255,120,40,0.9)'); puffs(ctx, fp[0], fp[1] - 20, ((t - tI) / 2.5) % 1, 11, '90,90,96', 50); } fog(ctx, W, H_, 0.32); flash = 0.25 * Math.exp(-Math.pow((t - tI) * 4, 2)); }
      else FX.confetti(ctx, W, H_, ramp(t, V('lived', 'lived'), 2.4), t);
    } else if (n === 'pit') {
      const cy = 0.42 + 1.4 * (1 - ramp(t, sh.t0, Math.max(1, BEATEND('air') - sh.t0)));
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.9, 1.5, 2.6], [0.05, 1.15, 0], [0.8, 1.3, 2.2], [0.05, 1.0, 0]);
      const S = Scene(E, TG, W, H_);
      shaft(S, [0, 0, 0], { h: 62, carY: cy, floors: 0.78, snap: 1, gov: false, ropes: 6, coil: ramp(t, V('coil', 'cables') - 0.2, 2.0) });
      const au = ramp(t, V('air', 'air') - 0.2, 0.5);
      if (au > 0) for (const dx of [-0.16, 0, 0.16]) S.arrow([dx, 0.05, 0.15], [dx, 0.05 + Math.max(0.1, (cy - 0.1) * au), 0.15], P.air, { side: [1, 0, 0], w: 0.06, th: 0.02, noShadow: true });
      S.render(ctx, W, H_, { bg: shaftEnv, dof: 0.33, focus: 2.6, shadows: false });
    } else {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.75, 0], 7.2, 6.4, 0.4, 0.3, -0.4, 0.2, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.75, 0.48, 0.28);
      shaft(S, [0, 0.3, 0], { h: 2.9, carY: 1.1, ropes: 6, govSpin: t * 3 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 6.5 });
    }
    const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST2('tower'), color: 'pink', filter: 'bandpass', f: [[0, 600], [2, 1400]], q: 0.6, gain: 0.1, a: 0.1 });
    k.noise(ST2('tower'), { dur: V('crash', 'flew') + 0.3 - ST2('tower'), color: 'brown', filter: 'bandpass', f: 300, q: 1.5, gain: 0.08, a: 0.5 }); k.play('impact', V('crash', 'flew') + 0.3, { gain: 0.5 });
    k.play('stamp', tF, { gain: 0.35 }); k.noise(tF, { dur: Math.max(1, tB - tF), color: 'pink', filter: 'bandpass', f: [[0, 400], [2, 1400]], q: 0.6, gain: 0.1, a: 0.3 });
    k.play('impact', ST2('pit'), { gain: 0.45 }); k.noise(V('air', 'air'), { dur: 1.4, color: 'pink', filter: 'lowpass', f: 600, gain: 0.07, a: 0.2 });
    k.play('success', V('lived', 'lived'), { f: 'C6', gain: 0.45 }); k.play('riser', V('cta', 'stop') - 0.4, { gain: 0.25 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
