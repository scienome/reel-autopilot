  // Dave reel 10: Franz Reichelt's parachute suit (1912). The twist: Dave survives. No R.I.P. card, a "DAVE SURVIVED" card instead.
  // Reichelt's death is told straight and never shown; he appears only gently moving Dave aside.
  const BEATS = window.SCRIPT;
  const SH = [['tower', 0], ['edge', V('hook', 'With') - 0.2], ['physics', BEAT0('physics') - 0.1], ['wait', BEAT0('jump') - 0.1], ['alone', BEAT0('end') - 0.1]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const IRON = [124, 92, 74], SUIT = [120, 96, 70];
  // the Eiffel Tower in metres: four curved legs, the first platform at 57 m, the second at 115 m, the top at ~300 m
  const eiffel = (S) => {
    const leg = (sx, sz) => { const P2 = [[62, 0], [40, 30], [26, 57], [17, 115], [6, 220], [2, 290]].map(([r, y]) => [sx * r, y, sz * r]); S.tube(P2, 3.2, IRON, 6); const P3 = [[52, 0], [33, 30], [22, 57]].map(([r, y]) => [sx * r, y, sz * r]); S.tube(P3, 2, IRON, 6); };
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) leg(sx, sz);
    for (const [y, r] of [[57, 30], [115, 19]]) S.box((p) => add(p, [0, y, 0]), r, 2.5, r, shade(IRON, 1.05), { bevel: 0.05 });
    for (const sz of [-1, 1]) S.tube([[-48, 10, sz * 46], [-30, 34, sz * 46], [0, 42, sz * 46], [30, 34, sz * 46], [48, 10, sz * 46]], 1.2, IRON, 6);
    S.cyl((p) => add(p, [0, 290, 0]), 2.2, 22, IRON, 8, { r2: 0.6 });
  };
  const paris = (S) => {
    S.quad([[-3000, 0, -3000], [3000, 0, -3000], [3000, 0, 3000], [-3000, 0, 3000]], [150, 156, 140], { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(230,226,214,0.6)'; c.lineWidth = 2; for (let i = 0; i < 60; i++) { c.beginPath(); c.moveTo((i * 37) % w, 0); c.lineTo(((i * 53) % w), h); c.stroke(); } } });
    const r = H.rng(6); for (let i = 0; i < 70; i++) { const a = r() * TAU, d = 120 + r() * 600; S.box((p) => add(p, [Math.cos(a) * d, 8, Math.sin(a) * d]), 12 + r() * 10, 8 + r() * 6, 10 + r() * 10, H.mix([226, 216, 196], [196, 186, 170], r()), { bevel: 0.05 }); }
  };
  // a man in a dark 1912 coat (Reichelt): not a dummy, no decals, no hard hat
  const MAN = { body: [56, 52, 60], joint: [40, 38, 44], head: [226, 190, 160] };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'tower' || n === 'wait') {
      const [E, TG] = n === 'tower' ? orbit(t, sh.t0, sh.t1, [0, 0, 0], 330, 260, 30, 50, 0.5, 0.3, [0, 110, 0]) : orbit(t, sh.t0, sh.t1, [0, 0, 0], 300, 280, 40, 45, -0.4, -0.5, [0, 120, 0]);
      const S = Scene(E, TG, W, H_); paris(S); eiffel(S);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      if (n === 'tower') { const pp = S.proj([30, 57, 30]); tagLabel(ctx, pp[0] + 40, pp[1], '57 m', ramp(t, V('hook', 'Eiffel') - 0.1, 0.2), { px: 32 }); tagLabel(ctx, W / 2, H_ * 0.2, 'PARIS · 1912', ramp(t, V('hook', '1912') - 0.1, 0.2), { px: 40 }); }
      else {
        // a stopwatch counting the hesitation, then quiet
        const c0 = sh.t0 + 0.3, c1 = V('jump', 'seconds'), secs = Math.round(40 * H.clamp((t - c0) / Math.max(0.5, c1 - c0))), su = ramp(t, c0, 0.2) * (1 - ramp(t, V('jump', 'jumped') - 0.2, 0.4));
        if (su > 0) { ctx.save(); ctx.globalAlpha = su; ctx.translate(W / 2, H_ * 0.2); ctx.fillStyle = 'rgba(26,24,32,0.88)'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fill(); ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 60, -Math.PI / 2, -Math.PI / 2 + (secs / 60) * TAU); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = FONT(800, 40); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`${secs}s`, 0, 2); ctx.restore(); }
        const dim = ramp(t, V('jump', 'jumped') - 0.2, 0.6); if (dim > 0) { ctx.save(); ctx.fillStyle = `rgba(20,12,24,${0.35 * dim})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
      }
    } else if (n === 'edge' || n === 'alone') {
      // the first platform: Dave strapped into the baggy suit at the edge; Reichelt gently moves him aside. Later: Dave alone.
      const alone = n === 'alone', swap = alone ? 1 : ramp(t, V('swap', 'himself') - 0.6, 1.0);
      const [E, TG] = alone ? orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.2, 2.8, 1.5, 1.4, 0.35, 0.15, [0, 1.0, 0]) : orbit(t, sh.t0, sh.t1, [0, 0, 0], 4.2, 3.6, 1.6, 1.5, 0.7, 0.45, [-0.3, 1.0, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-3000, -57, -3000], [3000, -57, -3000], [3000, -57, 3000], [-3000, -57, 3000]], [150, 156, 140], { bg: true });
      S.quad([[-4, 0, -6], [4, 0, -6], [4, 0, 1.0], [-4, 0, 1.0]], [130, 104, 86], { bg: true, grid: [0.5, 'rgba(0,0,0,0.15)'] });
      for (let x = -4; x <= 4; x += 0.5) S.rod([x, 0, 1.0], [x, 1.1, 1.0], 0.02, IRON, 6); S.rod([-4, 1.1, 1.0], [-0.6, 1.1, 1.0], 0.03, IRON, 6); S.rod([0.6, 1.1, 1.0], [4, 1.1, 1.0], 0.03, IRON, 6);
      S.box((p) => add(p, [0, 0.3, 0.9]), 0.6, 0.3, 0.12, [150, 120, 96], { bevel: 0.2 }); // the stool at the gap in the railing
      // Dave in the baggy suit (a brown cape between his arms), nervous
      const dp = alone ? [0, 0, 0.5] : [-1.6 * swap, 0, 0.55 - 0.3 * swap], look = alone ? [0, 0] : [1, -1];
      dave(S, dp, { pose: alone ? 'stand' : 'wave', t: t * 0.4, yaw: alone ? 0 : Math.PI, hands: alone ? undefined : [[0.55, 1.2, 0.1], [-0.55, 1.2, 0.1]], sweat: alone ? 0 : 1, blink: blinkAt(t), look });
      if (!alone) { const yw = Math.PI, Lh = add(dp, rotY([0.55, 1.2, 0.1], yw)), Rh = add(dp, rotY([-0.55, 1.2, 0.1], yw)), Sh = add(dp, [0, 1.45, 0]), Hp = add(dp, [0, 0.8, 0]); const fl = 0.04 * Math.sin(t * 9); S.face([Lh, Sh, Rh, add(Hp, [0.3, fl, 0]), add(Hp, [-0.3, -fl, 0])], SUIT, { two: true, c: add(Sh, [0, 0, -0.3]) }); }
      if (!alone && swap > 0) { const mp = [1.6 - 1.4 * swap, 0, 0.2 + 0.25 * swap]; dave(S, mp, { pose: 'walk', t: t * (swap < 1 ? 1 : 0), yaw: -Math.PI / 2 - 0.4 * swap, colors: MAN, decals: false, hat: false, hands: swap < 1 ? [[0.3, 1.35, 0.5], null] : undefined }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.3, focus: 3.3 });
      if (!alone) { tagLabel(ctx, W / 2, H_ * 0.2, '57 m UP', ramp(t, sh.t0 + 0.2, 0.2) * (1 - ramp(t, V('swap', 'changed') - 0.1, 0.2)), { px: 40 }); tagLabel(ctx, W / 2, H_ * 0.2, 'CHANGE OF PLAN', ramp(t, V('swap', 'changed') - 0.1, 0.2), { px: 36 }); }
      else { const fu = ramp(t, V('end', 'filmed') - 0.2, 0.2); if (fu > 0) tagLabel(ctx, W / 2, H_ * 0.2, 'FILMED · 1912', fu, { px: 36 }); }
    } else {
      // physics: drag. A real parachute canopy catches a lot of air; the cape-sized suit catches almost none.
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 4.6, 4.0, 1.4, 1.3, 0.25, 0.05, [0, 1.3, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const fall = (t - sh.t0) % 2.2, yA = 2.6 - 0.25 * fall, yB = 2.6 - 1.15 * fall * fall;
      // left: parachute with a weight, slow; right: the cape with the same weight, fast
      S.ico([-1.0, yA + 0.6, 0], [0.7, 0.35, 0.7], [240, 120, 60], { sub: 1, T: (q) => [q[0], Math.max(0, q[1]), q[2]] }); for (let k = 0; k < 6; k++) { const a = (k * TAU) / 6; S.rod([-1.0, yA, 0], [-1.0 + Math.cos(a) * 0.68, yA + 0.6, Math.sin(a) * 0.68], 0.006, [230, 230, 230], 4); } S.box((p) => add(p, [-1.0, yA - 0.1, 0]), 0.1, 0.1, 0.1, [90, 94, 104]);
      if (yB > 0.1) { S.box((p) => add(p, [1.0, yB + 0.22, 0]), 0.22, 0.004, 0.14, SUIT, { bevel: 0, two: true }); S.rod([1.0, yB, 0], [1.0, yB + 0.22, 0], 0.006, [230, 230, 230], 4); S.box((p) => add(p, [1.0, Math.max(0.1, yB - 0.1), 0]), 0.1, 0.1, 0.1, [90, 94, 104]); }
      const cu = ramp(t, V('physics', 'catching') - 0.1, 0.3); if (cu > 0) { S.beads([[-1.6, 0.6, 0.2], [-1.3, yA + 0.4, 0.2], [-1.0, yA + 0.95, 0.2], [-0.6, 3.6, 0.2]], P.air, t * 0.6, { spacing: 0.09, r: 0.02, reveal: cu }); S.arrow([-1.0, yA + 1.0, 0.3], [-1.0, yA + 1.6, 0.3], [110, 200, 255], { w: 0.12 * cu, side: [1, 0, 0] }); }
      S.render(ctx, W, H_, { dof: 0.33, focus: 4.0 });
      const ap = S.proj([-1.0, 0.2, 0]), bp = S.proj([1.0, 0.2, 0]);
      tagLabel(ctx, ap[0], ap[1] + 40, 'PARACHUTE', ramp(t, V('physics', 'parachute') - 0.1, 0.2), { px: 28, col: '#7ee07a' });
      tagLabel(ctx, bp[0], bp[1] + 40, 'HIS SUIT', ramp(t, V('physics', 'suit') - 0.1, 0.2), { px: 28, col: '#ff8a6a' });
      tagLabel(ctx, W / 2, H_ * 0.2, '57 m ≈ 3.4 s', ramp(t, V('physics', 'fifty-seven') - 0.1, 0.2), { px: 38 });
    }
    // the end card: for once, Dave survives
    const su = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && su <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    if (su > 0) { ctx.save(); ctx.fillStyle = `rgba(16,10,18,${0.55 * H.clamp(su * 2.5)})`; ctx.fillRect(0, 0, W, H_); const e = H.ease.back(H.clamp(su * 1.4)); ctx.translate(W / 2, H_ * 0.47); ctx.scale(e, e); ctx.rotate(-0.05); ctx.fillStyle = '#5ab04a'; ctx.beginPath(); ctx.roundRect(-290, -110, 580, 220, 28); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = FONT(800, 60); ctx.fillText('DAVE', 0, -40); ctx.fillText('SURVIVED', 0, 30); ctx.font = FONT(700, 26); ctx.fillText('(this time)', 0, 85); ctx.restore(); ctx.save(); ctx.font = FONT(700, 24); ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillText('GEARS & GLITCHES', W / 2, H_ * 0.9); ctx.restore(); }
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('physics'), color: 'pink', filter: 'bandpass', f: 500, q: 0.5, gain: 0.07, a: 0.5, minor: true }); // the wind up there
    k.play('pop', V('hook', 'Eiffel'), { gain: 0.3 }); k.play('ding', V('hook', 'dummy'), { f: 'E6', gain: 0.25 });
    k.play('error', V('swap', 'changed'), { gain: 0.25 }); k.play('slap', V('swap', 'himself') - 0.1, { gain: 0.2 });
    k.play('pop', V('physics', 'parachute'), { gain: 0.3 }); k.play('pop', V('physics', 'suit'), { gain: 0.3 });
    const c0 = ST('wait') + 0.3, c1 = V('jump', 'seconds'); for (let x = c0; x < c1; x += 0.12) k.play('tick', x, { gain: 0.4, minor: true });
    k.play('ding', V('end', 'smart'), { f: 'C6', gain: 0.25 }); k.play('shutter', V('end', 'filmed'), { gain: 0.5 });
    k.play('success', REEL_WORDS.end + 0.45, { gain: 0.45 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
