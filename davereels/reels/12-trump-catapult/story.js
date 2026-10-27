  // Dave reel 12: steam vs. electromagnetic catapults. The catapult fires; the jet stays; Dave doesn't. R.I.P. Dave #11.
  // Donald Trump appears only through his quoted 2017 words, on a card; he is not shown.
  const BEATS = window.SCRIPT;
  const SH = [['deck', 0], ['steam', BEAT0('types') - 0.1], ['emals', V('types', 'newest') - 0.2], ['quote', BEAT0('quote') - 0.1], ['truth', BEAT0('truth') - 0.1], ['launch', BEAT0('end') - 0.3]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const DECK = [96, 100, 108], SEA = [52, 104, 150], JET = [150, 156, 166];
  // the flight deck (x = along the catapult, the bow at x = +50), the island, the catapult track
  const carrier = (S, o = {}) => {
    S.quad([[-600, -18, -600], [600, -18, -600], [600, -18, 600], [-600, -18, 600]], SEA, { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 2; for (let i = 0; i < 80; i++) { c.beginPath(); c.moveTo((i * 71) % w, (i * 37) % h); c.lineTo(((i * 71) % w) + 20, (i * 37) % h); c.stroke(); } } });
    S.box((p) => add(p, [0, -9, 0]), 52, 9, 14, [80, 84, 92], { bevel: 0.02 });
    S.quad([[-52, 0.01, -14], [52, 0.01, -14], [52, 0.01, 14], [-52, 0.01, 14]], DECK, { bg: true, paint: (c, w, h) => { c.fillStyle = 'rgba(255,255,255,0.7)'; for (let x = 0; x < w; x += 30) c.fillRect(x, h * 0.48, 16, 3); c.fillStyle = 'rgba(250,210,60,0.8)'; c.fillRect(0, h * 0.62, w, 2); } });
    S.box((p) => add(p, [-10, 6, -11]), 7, 6, 2.5, [110, 114, 122], { bevel: 0.05 }); S.box((p) => add(p, [-10, 13, -11]), 2, 1.2, 1.5, [90, 94, 102]);
    S.box((p) => add(p, [0, 0.03, 0]), 45, 0.03, 0.3, [70, 72, 78], { bevel: 0 }); // the catapult slot
  };
  // a generic low-poly fighter along +x (no markings). Returns its transform.
  const fighter = (S, pos, o = {}) => {
    const s = o.s ?? 1, T = (p) => add(pos, rotY(rotZ(mul(p, s), o.pitch || 0), o.yaw || 0)), A = (q) => rotZ(q, -Math.PI / 2);
    S.cyl((p) => T(add(A(p), [-6, 1.5, 0])), 0.9, 11, JET, 10, { gloss: 0.4, caps: false });
    S.cyl((p) => T(add(A(p), [5, 1.5, 0])), 0.9, 3.5, JET, 10, { r2: 0.05, gloss: 0.4 });
    S.ico(T([3.2, 2.3, 0]), [1.6 * s, 0.55 * s, 0.6 * s], [70, 110, 150], { sub: 1, gloss: 0.8, alpha: o.canopyOff ? 0.0001 : 0.6 });
    for (const sd of [-1, 1]) { S.face([T([2, 1.4, sd * 0.8]), T([-3.5, 1.4, sd * 0.8]), T([-4.5, 1.4, sd * 6]), T([-2.5, 1.4, sd * 6])], JET, { c: T([-1, 1.0, 0]), two: true }); S.face([T([-4.5, 1.6, sd * 0.6]), T([-6.5, 1.6, sd * 0.6]), T([-6.8, 1.6, sd * 2.6]), T([-5.8, 1.6, sd * 2.6])], JET, { c: T([-5, 1.2, 0]), two: true }); }
    for (const sd of [-1, 1]) S.face([T([-4.2, 2.3, sd * 0.5]), T([-6.4, 2.3, sd * 0.5]), T([-6.8, 5.0, sd * 1.4]), T([-5.8, 5.0, sd * 1.4])], shade(JET, 0.95), { c: T([-5, 3, 0]), two: true });
    for (const x of [3, -2]) S.rod(T([x, 0, 0]), T([x, 0.8, 0]), 0.12 * s, [60, 60, 66], 6);
    return T;
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'deck' || n === 'truth' || n === 'launch') {
      const L = n === 'launch', t0 = sh.t0, fire = t0 + 1.0, u = H.clamp((t - fire) / 2.4);
      const [E, TG] = n === 'deck' ? orbit(t, sh.t0, sh.t1, [-14, 0, 0], 80, 70, 42, 36, 0.75, 0.6, [0, -2, 0]) : L ? orbit(t, sh.t0, sh.t1, [-20, 0, 0], 17, 24, 5, 8, -0.9, -0.6, [10, 4, 0]) : orbit(t, sh.t0, sh.t1, [-20, 0, 0], 22, 20, 6, 5, 0.9, 0.7, [0, 2, 0]);
      const S = Scene(E, TG, W, H_); carrier(S);
      const T = fighter(S, [-22, 0, 0], { canopyOff: L && t > fire });
      // Dave in the cockpit, then launched clean out of it and over the horizon
      const cp = T([3.0, 1.75, 0]);
      if (!L || t < fire) dave(S, cp, { half: true, pose: 'drive', yaw: Math.PI / 2, blink: blinkAt(t), t, hands: [[0.15, 1.15, 0.45], [-0.15, 1.15, 0.45]] });
      else dave(S, add(cp, [70 * u, 14 * u * (1 - u) * 4 - 20 * u * u, 0]), { pose: 'flail', t, yaw: Math.PI / 2, death: 'launch', u, to: [0, 0, 0], arc: 0 });
      // the shuttle: sparks and a puff as it fires, without the jet
      const sx = L && t > fire ? -19 + 40 * H.ease.in(H.clamp((t - fire) / 0.7)) : -19; S.box((p) => add(p, [sx, 0.15, 0]), 0.6, 0.15, 0.25, [200, 190, 60]);
      if (n === 'truth') { const br = ramp(t, V('truth', 'breaking') - 0.2, 0.3) * (1 - ramp(t, V('truth', 'fixed') - 0.2, 0.3)); for (let i = 0; i < 6; i++) S.ico([-15 + i * 7, 0.4, 0], 0.4 * br * (0.6 + 0.4 * Math.sin(t * 9 + i)), [255, 80, 60], { sub: 0, glow: true, noShadow: true }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: n === 'deck' ? 0 : 0.2, focus: 25, shadowAlpha: 0.4 });
      if (n === 'deck') { const a = S.proj([-45, 0, 0]), b = S.proj([45, 0, 0]); const ru = ramp(t, V('hook', 'hundred') - 0.2, 0.4); if (ru > 0) { ctx.save(); ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(a[0] + (b[0] - a[0]) * ru, a[1] + (b[1] - a[1]) * ru); ctx.stroke(); ctx.restore(); tagLabel(ctx, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 60, '~100 m', ru, { px: 34 }); } tagLabel(ctx, W / 2, H_ * 0.2, 'CATAPULT', ramp(t, V('hook', 'catapult') - 0.1, 0.2), { px: 44 }); }
      if (n === 'truth') { tagLabel(ctx, W / 2, H_ * 0.2, 'BREAKDOWNS', ramp(t, V('truth', 'breaking') - 0.1, 0.2) * (1 - ramp(t, V('truth', 'fixed') - 0.2, 0.2)), { px: 40, col: '#ff6a5a' }); tagLabel(ctx, W / 2, H_ * 0.2, 'KEPT IT · FIXED IT', ramp(t, V('truth', 'fixed') - 0.1, 0.2), { px: 36, col: '#7ee07a' }); }
      if (L && t > fire) { tagLabel(ctx, W / 2, H_ * 0.2, 'SPLASH', ramp(t, fire + 2.3, 0.2), { px: 44, col: '#7ad0ff' }); flash = 0.15 * Math.exp(-Math.pow((t - fire) * 6, 2)); }
    } else if (n === 'steam' || n === 'emals') {
      // x-ray of the catapult under the deck: steam pushes a piston (old); a line of electromagnets pulls the shuttle (new)
      const em = n === 'emals', u = ((t - sh.t0) * 0.45) % 1;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.6, 0, 0], 4.2, 3.8, 1.8, 1.6, 1.15, 0.95, [0, 0.6, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      S.box((p) => add(p, [0, 0.9, 0]), 2.6, 0.04, 0.6, DECK, { alpha: 0.35 });
      const px = -2.2 + 4.4 * H.ease.in(u);
      if (!em) { S.cyl((p) => add(rotZ(p, -Math.PI / 2), [-2.5, 0.55, 0]), 0.18, 5, [190, 196, 206], 14, { alpha: 0.3, caps: false }); S.cyl((p) => add(rotZ(p, -Math.PI / 2), [px, 0.55, 0]), 0.17, 0.2, [150, 150, 160], 14); S.beads([[-2.5, 0.55, 0], [px - 0.05, 0.55, 0]], [235, 235, 245], t * 2, { spacing: 0.08, r: 0.05 }); }
      else { for (let i = 0; i < 12; i++) { const x = -2.4 + i * 0.44, on = Math.abs(x - px) < 0.5 ? 1 : 0.15; S.box((p) => add(p, [x, 0.5, 0]), 0.16, 0.16, 0.22, on > 0.5 ? [120, 200, 255] : [90, 96, 120], { glow: on > 0.5, bevel: 0.2 }); } S.beads([[px - 0.4, 0.5, 0.3], [px + 0.4, 0.5, 0.3]], [120, 200, 255], t * 3, { spacing: 0.06, r: 0.02 }); }
      S.box((p) => add(p, [px, 0.85, 0]), 0.2, 0.08, 0.12, [220, 200, 60], { bevel: 0.2 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 5 });
      tagLabel(ctx, W / 2, H_ * 0.2, em ? 'ELECTROMAGNETS' : 'STEAM', ramp(t, sh.t0 + 0.1, 0.2), { px: 44, col: em ? '#7ad0ff' : '#ffffff' });
      if (em) tagLabel(ctx, W / 2, H_ * 0.28, 'USS GERALD R. FORD', ramp(t, V('types', 'Gerald') - 0.1, 0.2), { px: 28 });
    } else {
      // the quote card, over the electric catapult
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-20, 0, 0], 22, 20, 6, 5, 0.6, 0.4, [0, 2, 0]);
      const S = Scene(E, TG, W, H_); carrier(S); fighter(S, [-22, 0, 0]);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.2, focus: 22 });
      const u = ramp(t, sh.t0 + 0.2, 0.3); if (u > 0) { ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = 'rgba(16,16,22,0.88)'; ctx.beginPath(); ctx.roundRect(W * 0.07, H_ * 0.09, W * 0.86, H_ * 0.25, 24); ctx.fill(); ctx.textAlign = 'center'; ctx.fillStyle = '#ffd24a'; ctx.font = FONT(600, 24); ctx.fillText('Donald Trump, 2017, on the electric catapult:', W / 2, H_ * 0.135); ctx.fillStyle = '#fff'; ctx.font = FONT(800, 36); const a = ramp(t, V('quote', 'Albert') - 0.2, 0.2), b = ramp(t, V('quote', 'steam') - 0.4, 0.2); ctx.globalAlpha = u * a; ctx.fillText('needs "Albert Einstein"', W / 2, H_ * 0.205); ctx.globalAlpha = u * b; ctx.fillText('"go back to steam"', W / 2, H_ * 0.28); ctx.restore(); }
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 11, rip, t, { cause: 'cause of death:\nthe catapult worked' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('steam'), color: 'pink', filter: 'lowpass', f: 700, gain: 0.1, a: 0.5, minor: true }); // wind over the deck
    k.play('pop', V('hook', 'catapult'), { gain: 0.3 });
    k.noise(ST('steam') + 0.2, { dur: 1.5, filter: 'highpass', f: 1800, gain: 0.25, a: 0.05 }); k.play('thud', ST('steam') + 1.5, { gain: 0.4 });
    k.play('neon', ST('emals') + 0.2, { dur: 1.0, gain: 0.4 }); k.play('riser', ST('emals') + 0.3, { dur: 1.2, gain: 0.25 });
    k.play('pop', ST('quote') + 0.2, { gain: 0.3 }); k.play('ding', V('quote', 'Albert'), { f: 'E6', gain: 0.25 }); k.play('ding', V('quote', 'steam') - 0.4, { f: 'C6', gain: 0.25 });
    k.play('error', V('truth', 'breaking'), { gain: 0.35 }); k.play('success', V('truth', 'fixed'), { gain: 0.35 });
    const fire = ST('launch') + 1.0; k.play('impact', fire, { gain: 0.6 }); k.noise(fire, { dur: 0.8, filter: 'highpass', f: 1500, gain: 0.35, a: 0.01 }); k.play('swish', fire + 0.1, { dur: 0.8, gain: 0.5 });
    k.noise(fire + 2.3, { dur: 1.0, color: 'pink', filter: 'lowpass', f: 1500, gain: 0.35, a: 0.01 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
