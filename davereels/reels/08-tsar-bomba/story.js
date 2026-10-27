  // Dave reel 08: Tsar Bomba, "made smaller to be safe". Dave watches from 100 km away. The shock wave arrives. R.I.P. Dave #8.
  const BEATS = window.SCRIPT;
  const SH = [['bomb', 0], ['cloud', BEAT0('big') - 0.1], ['chute', BEAT0('chute') - 0.1], ['hill', V('chute', 'made') + 0.3]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  // the bomb: a fat cylinder with a rounded nose and tail fins, along +x. o.sticker: "SAFE MODE"
  const bomb = (S, pos, o = {}) => {
    const s = o.s ?? 1, T = (p) => add(pos, rotY(rotZ(mul(p, s), o.pitch || 0), o.yaw || 0)), A = (q) => rotZ(q, -Math.PI / 2), col = [96, 112, 92];
    S.cyl((p) => T(add(A(p), [-0.7, 0, 0])), 0.32, 1.3, col, 16, { gloss: 0.3, caps: false });
    S.ico(T([0.6, 0, 0]), [0.42 * s, 0.32 * s, 0.32 * s], col, { sub: 1, gloss: 0.3, T: (p) => [Math.max(0, p[0]), p[1], p[2]] });
    S.cyl((p) => T(add(rotZ(p, Math.PI / 2), [-0.7, 0, 0])), 0.32, 0.3, shade(col, 0.9), 16, { r2: 0.14 });
    for (let k = 0; k < 4; k++) { const a = (k * TAU) / 4; S.box((p) => T(add(rotX(p, a), [-1.0, 0, 0])), 0.16, 0.012, 0.3, shade(col, 0.85), { bevel: 0.1 }); }
    if (o.sticker) S.box((p) => T(add(p, [0, 0.0, 0.322])), 0.45, 0.14, 0.004, [250, 220, 70], { bevel: 0, noShadow: true, paint: (c, w, h) => { c.fillStyle = '#ffd84a'; c.fillRect(0, 0, w, h); c.fillStyle = '#1c1c22'; c.font = `800 ${h * 0.55}px "Montserrat"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SAFE MODE', w / 2, h * 0.55); } });
  };
  // a low-poly mushroom cloud at c, grown by u (0..1); height H0 at u = 1
  const mushroom = (S, c, u, H0, t) => {
    if (u <= 0) return; const h = H0 * H.ease.out(u), r = H0 * 0.07;
    for (let i = 0; i < 10; i++) { const k = i / 10; S.ico(add(c, [0.15 * r * Math.sin(i * 1.7 + t), h * k * 0.8, 0]), r * (0.9 + 0.3 * Math.sin(i)), H.mix([255, 200, 120], [200, 180, 170], k), { sub: 0, jit: 0.25, seed: i, noShadow: true }); }
    for (let i = 0; i < 12; i++) { const a = (i * TAU) / 12 + t * 0.1, rr = H0 * 0.18 * (0.4 + 0.6 * u); S.ico(add(c, [Math.cos(a) * rr, h * 0.85 + Math.sin(i * 2.3) * r * 0.5, Math.sin(a) * rr]), r * 2.2, i % 2 ? [236, 206, 180] : [214, 186, 170], { sub: 0, jit: 0.3, seed: 20 + i, noShadow: true }); }
    S.ico(add(c, [0, h * 0.9, 0]), [H0 * 0.16 * (0.4 + 0.6 * u), r * 2.4, H0 * 0.16 * (0.4 + 0.6 * u)], [246, 220, 196], { sub: 1, jit: 0.2, seed: 9, noShadow: true });
    for (let i = 0; i < 14; i++) { const a = (i * TAU) / 14, rr = H0 * 0.25 * u; S.ico(add(c, [Math.cos(a) * rr, r * 0.6, Math.sin(a) * rr]), r * 1.4, [200, 180, 160], { sub: 0, jit: 0.3, seed: 40 + i, noShadow: true }); }
  };
  const parachute = (S, p, s = 1) => { S.ico(add(p, [0, 2.2 * s, 0]), [1.5 * s, 0.8 * s, 1.5 * s], [240, 120, 60], { sub: 1, T: (q) => [q[0], Math.max(0, q[1]), q[2]], stripes: null }); for (let k = 0; k < 8; k++) { const a = (k * TAU) / 8; S.rod(add(p, [0, 0.3 * s, 0]), add(p, [Math.cos(a) * 1.45 * s, 2.2 * s, Math.sin(a) * 1.45 * s]), 0.01 * s, [230, 230, 230], 4); } };
  const steppe = (S) => {
    S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 200], [-400, 0, 200]], [150, 160, 120], { bg: true });
    const hr = H.rng(9); for (let i = 0; i < 8; i++) S.ico([-300 + i * 80 + hr.range(-20, 20), -20, -300 - hr.range(0, 60)], [60 + hr.range(0, 30), 40, 50], i % 2 ? [130, 140, 110] : [120, 130, 104], { sub: 0, jit: 0.15, seed: i, noShadow: true });
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'bomb') {
      // Dave holding a giant bomb with a SAFE MODE sticker; 100 Mt, then halved
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.3], 4.4, 3.8, 1.3, 1.2, 0.45, 0.2, [0, 1.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const sz = 1 - 0.25 * ramp(t, V('hook', 'halved') - 0.1, 0.4);
      bomb(S, [0, 0.98, 0.5], { s: 0.62 * sz, sticker: t > V('hook', 'safe') - 0.2 });
      dave(S, [0, 0, 0], { pose: 'carry', hands: [[0.22, 0.98, 0.32], [-0.22, 0.98, 0.32]], blink: blinkAt(t), t, look: [0, 0] });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.8 });
      const mt = t < V('hook', 'halved') - 0.1 ? '100 Mt' : '50 Mt'; tagLabel(ctx, W / 2, H_ * 0.2, mt, ramp(t, V('hook', 'hundred-megaton') - 0.1, 0.2), { px: 48 });
    } else if (n === 'cloud') {
      // the biggest explosion ever made: the cloud climbs to about 64 km
      const H0 = 64, tb = sh.t0 + 0.3, u = H.clamp((t - tb) / (V('big', 'sixty-four') - tb + 0.3));
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 150, 170, 18, 30, 0.2, 0.05, [0, 35, 0]);
      const S = Scene(E, TG, W, H_); steppe(S); mushroom(S, [0, 0, -10], u, H0, t);
      // a ruler: 64 km, and a tiny Everest for scale (8.8 km)
      S.rod([40, 0, 0], [40, H0, 0], 0.5, [255, 255, 255], 6, { glow: true });
      S.ico([-40, 0, 0], [7, 8.8, 7], [190, 196, 210], { sub: 0, T: (q) => [q[0] * (1 - Math.max(0, q[1])), Math.max(0, q[1]), q[2] * (1 - Math.max(0, q[1]))] });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      const rp = S.proj([40, H0, 0]); tagLabel(ctx, rp[0], rp[1] - 20, '64 km', ramp(t, V('big', 'sixty-four') - 0.1, 0.2), { px: 36 });
      const ep = S.proj([-40, 9, 0]); tagLabel(ctx, ep[0], ep[1] - 30, 'Everest', ramp(t, V('big', 'sixty-four'), 0.2), { px: 24, col: '#fff' });
      tagLabel(ctx, W / 2, H_ * 0.12, 'BIGGEST EVER', ramp(t, V('big', 'biggest') - 0.1, 0.2), { px: 40 });
      flash = 0.5 * Math.exp(-Math.pow((t - tb) * 3, 2));
    } else if (n === 'chute') {
      // under the parachute; the plane runs; the shock wave drops it a kilometre; it flies home
      const tfall = V('chute', 'shock') - 0.15, drop = ramp(t, tfall, 0.8) * (1 - 0.3 * ramp(t, V('chute', 'made') - 0.3, 1));
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 11, 9, 1.2, 0.6, 0.7, 0.45, [0, -0.3, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const bp = [-1.2, SKY_Y - 0.2 - 0.25 * (t - sh.t0), 0.8]; bomb(S, bp, { s: 0.5, pitch: -Math.PI / 2 }); parachute(S, add(bp, [0, 0.4, 0]), 0.6);
      jet767(S, [0.9 + 0.2 * (t - sh.t0), SKY_Y + 0.9 - 1.0 * drop, -0.6], { s: 0.5, fan: t * 18, pitch: -0.15 * Math.sin(drop * Math.PI) });
      S.render(ctx, W, H_, skyEnv);
      tagLabel(ctx, W / 2, H_ * 0.2, '50 / 50', ramp(t, V('chute', 'fifty-fifty') - 0.3, 0.2) * (1 - ramp(t, tfall, 0.2)), { px: 48 });
      tagLabel(ctx, W / 2, H_ * 0.2, '↓ 1 km', ramp(t, tfall, 0.2) * (1 - ramp(t, V('chute', 'made') - 0.2, 0.2)), { px: 48, col: '#ff8a6a' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'HOME ✓', ramp(t, V('chute', 'made') - 0.1, 0.2), { px: 44, col: '#7ee07a' });
      flash = 0.12 * Math.exp(-Math.pow((t - tfall) * 4, 2));
    } else {
      // Dave, 100 km away on a hill with binoculars, thumbs up. A long pause. The shock wave blows him off like a leaf.
      const t0 = sh.t0, ta = t0 + 1.7, hit = H.clamp((t - ta) / 1.4);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2, 0], 5, 4.4, 1.6, 1.4, 0.75, 0.55, [-2.5, 1.6, -2.5]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 200], [-400, 0, 200]], [150, 160, 120], { bg: true });
      S.ico([0, -6, 0], [10, 8, 8], [118, 150, 90], { sub: 1, jit: 0.1, seed: 3 });
      mushroom(S, [-250, 0, -260], 1, 64, t);
      dave(S, [0, 1.95, 0], { pose: 'thumbs', yaw: -2.2, hands: [[0.12, 1.55, 0.25], null], death: hit > 0 ? 'blown' : undefined, u: hit, to: [10, 1.5, 6], arc: 2.5, t, blink: blinkAt(t) });
      if (hit <= 0) S.rod(add([0, 1.95, 0], rotY([0.12, 1.55, 0.32], -2.2)), add([0, 1.95, 0], rotY([0.12, 1.55, 0.45], -2.2)), 0.04, [40, 40, 46], 8);
      if (hit > 0) for (let i = 0; i < 20; i++) { const r = H.rng(i), k = H.clamp(hit * 1.4 - r() * 0.4); S.ico([-3 + 13 * k + r() * 2, 0.5 + r() * 3 + 2 * k, -3 + r() * 6 + 3 * k], 0.15 + r() * 0.2, [180, 170, 150], { sub: 0, noShadow: true }); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.2, focus: 9 });
      tagLabel(ctx, W / 2, H_ * 0.2, '100 km AWAY', ramp(t, t0 + 0.1, 0.2) * (1 - ramp(t, ta - 0.4, 0.2)), { px: 40 });
      const ru = ramp(t, ta - 0.25, 0.25); if (ru > 0 && hit < 0.6) { ctx.save(); ctx.globalAlpha = ru * (1 - hit); ctx.fillStyle = 'rgba(255,240,220,0.35)'; ctx.fillRect(0, 0, W * ru, H_); ctx.restore(); }
      flash = 0.2 * Math.exp(-Math.pow((t - ta) * 5, 2));
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 8, rip, t, { cause: 'cause of death:\n"safe mode"' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.play('impact', V('hook', 'hundred-megaton'), { gain: 0.35 }); k.play('powerup', V('hook', 'halved') - 0.1, { gain: 0.4 }); k.play('stamp', V('hook', 'safe'), { gain: 0.45 });
    const tb = ST('cloud') + 0.3; k.play('impact', tb, { gain: 0.7 }); k.noise(tb, { dur: 5, color: 'brown', filter: 'lowpass', f: [[0, 400], [5, 60]], gain: 0.4, a: 0.05, verb: 0.4 });
    k.play('riser', V('big', 'sixty-four') - 0.6, { dur: 0.6, gain: 0.3 });
    k.noise(ST('chute'), { dur: V('chute', 'made') - ST('chute'), color: 'pink', filter: 'bandpass', f: 300, q: 0.7, gain: 0.08, a: 0.3, minor: true });
    const tfall = V('chute', 'shock') - 0.15; k.play('impact', tfall, { gain: 0.5 }); k.play('swish', tfall + 0.1, { dur: 0.6, gain: 0.4 }); k.play('success', V('chute', 'made'), { gain: 0.35 });
    const t0 = ST('hill'), ta = t0 + 1.7; k.play('pop', t0 + 0.4, { gain: 0.3 });
    k.noise(ta - 0.3, { dur: 2, color: 'pink', filter: 'lowpass', f: [[0, 2500], [2, 200]], gain: 0.45, a: 0.25, verb: 0.3 }); k.play('impact', ta, { gain: 0.6 }); k.play('swish', ta + 0.2, { dur: 0.8, gain: 0.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
