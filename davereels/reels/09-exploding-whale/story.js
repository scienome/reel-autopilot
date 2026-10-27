  // Dave reel 09: the exploding whale (Florence, Oregon, 1970). A blubber chunk finds Dave. Only the thumb sticks out. R.I.P. Dave #9.
  const BEATS = window.SCRIPT;
  const TB = () => V('blast', 'But') + 0.1; // the blast
  const SH = [['beach', 0], ['tnt', BEAT0('plan') - 0.1], ['blast', BEAT0('blast') - 0.1], ['car', BEAT0('car') - 0.1], ['dave', BEAT0('end') - 0.2]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const WHALE = [96, 104, 118], CHUNK = [130, 120, 118], SAND = [232, 210, 170];
  const beach = (S, o = {}) => {
    S.quad([[-200, 0, -200], [200, 0, -200], [200, 0, 100], [-200, 0, 100]], SAND, { bg: true });
    S.quad([[-200, 0.01, -200], [200, 0.01, -200], [200, 0.01, -30], [-200, 0.01, -30]], [70, 140, 180], { bg: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 3; for (let i = 0; i < 30; i++) { c.beginPath(); c.moveTo(((i * 97) % w), h * (0.3 + (i % 7) * 0.1)); c.lineTo(((i * 97) % w) + 40, h * (0.3 + (i % 7) * 0.1)); c.stroke(); } } });
    const hr = H.rng(4); for (let i = 0; i < 6; i++) S.ico([-120 + i * 50, -5, 60 + hr.range(0, 30)], [30, 22, 20], [120, 150, 90], { sub: 0, jit: 0.15, seed: i, noShadow: true });
  };
  // the whale (a long, low, grey hump on its side), shrinking to nothing as it goes
  const whale = (S, c, k = 1) => { if (k <= 0.02) return; S.ico(c, [6 * k, 1.6 * k, 2.0 * k], WHALE, { sub: 1, jit: 0.08, seed: 2, gloss: 0.3 }); S.ico(add(c, [-6.4 * k, 0.4 * k, 0]), [1.6 * k, 0.3 * k, 2.2 * k], shade(WHALE, 0.9), { sub: 0, seed: 3 }); S.ico(add(c, [4.6 * k, 1.0 * k, 1.4 * k]), 0.12 * k, [30, 30, 36], { sub: 0 }); };
  const crate = (S, p, s = 1, yaw = 0) => S.box((q) => add(p, rotY(mul(q, s), yaw)), 0.3, 0.2, 0.2, [190, 140, 90], { bevel: 0.08, paint: (c, w, h) => { c.fillStyle = '#c0392b'; c.font = `800 ${h * 0.45}px "Montserrat"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('TNT', w / 2, h * 0.55); } });
  const oldCar = (S, p, crush = 0) => { const T = (q) => add(p, [q[0], q[1] * (1 - 0.55 * crush), q[2]]); S.box((q) => T(add(q, [0, 0.55, 0])), 2.2, 0.35, 0.9, [140, 180, 200], { bevel: 0.15 }); S.box((q) => T(add(q, [-0.2, 1.05, 0])), 1.1, 0.25 * (1 - 0.6 * crush), 0.8, [120, 160, 186], { bevel: 0.2 }); for (const x of [-1.4, 1.4]) for (const z of [-0.9, 0.9]) S.cyl((q) => add(p, add(rotX(q, Math.PI / 2), [x, 0.35, z])), 0.35, 0.2, [36, 36, 40], 12); };
  const chunk = (S, p, s, seed) => S.ico(p, [s, s * 0.7, s * 0.9], CHUNK, { sub: 0, jit: 0.3, seed, gloss: 0.2 });
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    const tb = TB();
    if (n === 'beach' || n === 'tnt') {
      // a dead whale on the beach; Dave proudly carries the TNT, crate after crate
      const [E, TG] = n === 'beach' ? orbit(t, sh.t0, sh.t1, [0, 0, 0], 26, 22, 6, 5, 0.6, 0.35, [0, 1.5, 0]) : orbit(t, sh.t0, sh.t1, [2, 0, 5], 7, 6, 1.6, 1.5, 0.4, 0.2, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); beach(S); whale(S, [0, 1.2, 0]);
      const nc = n === 'tnt' ? Math.min(6, Math.floor((t - sh.t0) * 1.5)) : 0; for (let i = 0; i < nc; i++) crate(S, [-1.5 + (i % 3) * 0.7, 0.2 + Math.floor(i / 3) * 0.4, 2.6], 1, 0.1 * i);
      if (n === 'tnt') { const dp = [2.2, 0, 5]; dave(S, dp, { pose: 'walk', t, yaw: -0.8, hands: [[0.25, 1.1, 0.35], [-0.25, 1.1, 0.35]], blink: blinkAt(t) }); crate(S, add(dp, rotY([0, 1.15, 0.38], -0.8)), 0.9, -0.8); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.25, focus: n === 'beach' ? 24 : 6 });
      if (n === 'beach') tagLabel(ctx, W / 2, H_ * 0.2, 'OREGON · 1970', ramp(t, V('hook', 'Oregon') - 0.1, 0.2), { px: 40 });
      if (n === 'beach') { const bp = S.proj([3, 4, 0]); const lu = ramp(t, V('hook', 'brilliant') - 0.1, 0.2); if (lu > 0) { ctx.save(); ctx.translate(bp[0], bp[1]); ctx.scale(H.ease.back(lu), H.ease.back(lu)); ctx.fillStyle = 'rgba(255,230,120,0.35)'; ctx.beginPath(); ctx.arc(0, 0, 60, 0, TAU); ctx.fill(); ctx.fillStyle = '#ffe066'; ctx.beginPath(); ctx.arc(0, 0, 34, 0, TAU); ctx.fill(); ctx.fillStyle = '#9aa0ac'; ctx.fillRect(-16, 28, 32, 22); ctx.restore(); } }
      else { tagLabel(ctx, W / 2, H_ * 0.2, '½ TON OF DYNAMITE', ramp(t, V('plan', 'half') - 0.1, 0.2), { px: 36 }); }
    } else if (n === 'blast') {
      // slow motion: the blast pushes out in every direction, including up. Whale artillery.
      const u = Math.max(0, t - tb), slow = u * 0.45;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 32, 40, 6, 9, 0.5, 0.3, [0, 8, 0]);
      const S = Scene(E, TG, W, H_); beach(S); whale(S, [0, 1.2, 0], 1 - H.clamp(slow * 6));
      if (t > tb) {
        const r = H.rng(11); for (let i = 0; i < 40; i++) { const th = r() * TAU, el = 0.2 + r() * 1.3, sp = 14 + r() * 16, v = [Math.cos(th) * Math.cos(el) * sp, Math.sin(el) * sp, Math.sin(th) * Math.cos(el) * sp]; const p = [v[0] * slow, 1.5 + v[1] * slow - 4.9 * slow * slow, v[2] * slow]; if (p[1] > 0) chunk(S, p, 0.3 + r() * 0.5, i); }
        const fr = H.clamp(slow * 3); for (let i = 0; i < 16; i++) { const a = (i * TAU) / 16; S.ico([Math.cos(a) * 5 * fr, 2 + 6 * fr * (i % 3 === 0 ? 1.5 : 0.6), Math.sin(a) * 5 * fr], 2.5 * (1 - fr * 0.6), H.mix([255, 200, 120], [200, 190, 180], fr), { sub: 0, jit: 0.3, seed: i, noShadow: true }); }
        // arrows: every direction, including straight up
        const aw = ramp(t, V('blast', 'every') - 0.1, 0.3); if (aw > 0) for (const d of [[1, 0.1, 0], [-1, 0.1, 0], [0, 0.1, 1], [0.7, 0.7, 0], [-0.7, 0.7, 0], [0, 1, 0]]) S.arrow([d[0] * 3, 2 + d[1] * 3, d[2] * 3], [d[0] * 9, 2 + d[1] * 9, d[2] * 9], [236, 84, 70], { w: 0.8 * aw, side: d[1] > 0.9 ? [1, 0, 0] : [0, 1, 0] });
      }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NOT CONFETTI', ramp(t, V('blast', 'confetti') - 0.1, 0.2) * (1 - ramp(t, V('blast', 'artillery') - 0.1, 0.2)), { px: 40 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'ARTILLERY', ramp(t, V('blast', 'artillery') - 0.1, 0.2), { px: 48, col: '#ff8a6a' });
      flash = 0.5 * Math.exp(-Math.pow((t - tb) * 4, 2));
    } else if (n === 'car') {
      // a quarter mile away: a chunk lands on a parked car
      const tl = sh.t0 + 1.0, fall = H.clamp((t - (tl - 0.8)) / 0.8), crush = ramp(t, tl, 0.15);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 8, 7, 2.2, 1.8, 0.5, 0.3, [0, 0.9, 0]);
      const S = Scene(E, TG, W, H_); beach(S); oldCar(S, [0, 0, 0], crush);
      chunk(S, [0, 1.6 * (1 - 0.55 * crush) + 0.6 + 10 * (1 - fall), 0], 1.0, 4);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.25, focus: 7 });
      tagLabel(ctx, W / 2, H_ * 0.2, '¼ MILE AWAY', ramp(t, V('car', 'quarter') - 0.1, 0.2) * (1 - ramp(t, V('car', 'promotion') - 0.3, 0.2)), { px: 40 });
      const pu = ramp(t, V('car', 'whale') - 0.3, 0.3); if (pu > 0) { ctx.save(); ctx.translate(W / 2, H_ * 0.2); ctx.rotate(-0.06); ctx.scale(H.ease.back(pu), H.ease.back(pu)); ctx.fillStyle = '#ffd24a'; ctx.beginPath(); ctx.roundRect(-250, -50, 500, 100, 16); ctx.fill(); ctx.fillStyle = '#c0392b'; ctx.font = FONT(800, 34); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('"WHALE OF A DEAL!"', 0, 2); ctx.restore(); }
      flash = 0.15 * Math.exp(-Math.pow((t - tl) * 6, 2));
    } else {
      // Dave, far away and safe, gives a thumbs up. A huge chunk lands on him. Only the thumb sticks out.
      const t0 = sh.t0, tl = t0 + 1.4, fall = H.clamp((t - (tl - 0.7)) / 0.7), landed = t >= tl;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 5.5, 5.0, 1.6, 1.5, 0.3, 0.15, [0, 1.1, 0]);
      const S = Scene(E, TG, W, H_); beach(S);
      if (!landed) dave(S, [0, 0, 0], { pose: 'thumbs', blink: blinkAt(t), t, look: [0, fall > 0.2 ? 1 : 0] });
      else { S.rod([0.15, 1.5, 0.45], [0.15, 1.92, 0.5], 0.05, DV.body, 8); S.ico([0.15, 1.95, 0.5], 0.07, DV.body, { sub: 0 }); S.rod([0.15, 1.97, 0.52], [0.15, 2.14, 0.54], 0.026, DV.body, 6); }
      chunk(S, [0, (landed ? 0.75 : 0.75 + 9 * (1 - fall * fall)), 0], 1.4, 7);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.25, focus: 5 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'SAFE DISTANCE', ramp(t, t0 + 0.1, 0.2) * (1 - ramp(t, tl - 0.3, 0.2)), { px: 40, col: '#7ee07a' });
      flash = 0.2 * Math.exp(-Math.pow((t - tl) * 6, 2));
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 9, rip, t, { cause: 'cause of death:\nwhale, relocated' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: TB(), color: 'pink', filter: 'lowpass', f: 900, gain: 0.08, a: 0.5, minor: true }); // the surf
    k.play('ding', V('hook', 'brilliant'), { f: 'C6', gain: 0.3 });
    const t1 = ST('tnt'); for (let i = 0; i < 6; i++) k.play('thud', t1 + 0.67 * i, { f: 160, gain: 0.25, minor: true });
    k.play('stamp', V('plan', 'half'), { gain: 0.4 });
    const tb = TB(); k.play('impact', tb, { gain: 0.8 }); k.noise(tb, { dur: 4, color: 'brown', filter: 'lowpass', f: [[0, 600], [4, 80]], gain: 0.5, a: 0.02, verb: 0.4 });
    k.play('error', V('blast', 'artillery'), { gain: 0.3 });
    const tl = ST('car') + 1.0; k.play('swish', tl - 0.6, { gain: 0.4 }); k.play('impact', tl, { gain: 0.6 }); k.noise(tl, { dur: 0.4, filter: 'highpass', f: 2500, gain: 0.3, a: 0.002 });
    k.play('success', V('car', 'whale') - 0.3, { gain: 0.3 });
    const td = ST('dave') + 1.4; k.play('pop', ST('dave') + 0.1, { gain: 0.3 }); k.play('swish', td - 0.6, { gain: 0.5 }); k.play('slap', td, { gain: 0.6 }); k.play('thud', td, { f: 70, gain: 0.6 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
