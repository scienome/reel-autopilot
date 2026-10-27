  // Dave reel 19: the Mars Climate Orbiter units mix-up. Dave (inches) and a second dummy (centimetres). Dave hands over the MATHS. Mars hits him in the face. R.I.P. Dave #18.
  const BEATS = window.SCRIPT;
  const SH = [['rulers', 0], ['units', BEAT0('units') - 0.1], ['push', V('units', 'So') - 0.2], ['orbit', BEAT0('lost') - 0.1], ['mars', BEAT0('end') - 1.0]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const MARS = [206, 100, 60], OTHER = { body: [140, 190, 230], joint: [40, 50, 70], hat: [60, 110, 220] };
  const spaceBg = (ctx, W, H_) => { ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H_); const r = H.rng(77); for (let i = 0; i < 260; i++) { ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.7 * r()})`; ctx.fillRect(r() * W, r() * H_, 1.5, 1.5); } };
  const ruler = (S, p, label, yaw = 0) => S.box((q) => add(p, rotY(q, yaw)), 0.4, 0.035, 0.008, [250, 220, 90], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#f6d65a'; c.fillRect(0, 0, w, h); c.fillStyle = '#222'; for (let i = 0; i <= 20; i++) c.fillRect((i * w) / 20, 0, 2, h * (i % 5 ? 0.3 : 0.55)); c.font = `800 ${h * 0.35}px "Montserrat"`; c.textAlign = 'center'; c.fillText(label, w / 2, h * 0.9); } });
  const orbiter = (S, p, a = 0) => { S.box((q) => add(p, rotY(q, a)), 0.25, 0.3, 0.25, [210, 190, 120], { bevel: 0.1, gloss: 0.6 }); S.box((q) => add(p, rotY(add(q, [0.75, 0, 0]), a)), 0.5, 0.01, 0.22, [40, 60, 130], { bevel: 0, gloss: 0.8 }); S.cyl((q) => add(p, rotY(add(rotX(q, Math.PI / 2), [0, 0.1, 0.25]), a)), 0.2, 0.03, [230, 230, 236], 12, { r2: 0.05 }); };
  const marsBall = (S, c, R) => { S.ico(c, R, MARS, { sub: 1, jit: 0.04, seed: 3, noShadow: true }); S.ico(add(c, [0, R * 0.95, 0]), R * 0.25, [240, 236, 230], { sub: 0, noShadow: true }); };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'rulers' || n === 'units') {
      // two teams: Dave with a ruler in inches, another dummy with centimetres; their numbers don't match
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.6, 3.1, 1.4, 1.3, 0.25, 0.05, [0, 1.15, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const dA = [-0.55, 0, 0], dB = [0.6, 0, 0];
      dave(S, dA, { pose: 'carry', yaw: 0.35, hands: [[0.25, 1.15, 0.4], [-0.25, 1.15, 0.4]], blink: blinkAt(t), t }); ruler(S, add(dA, rotY([0, 1.17, 0.42], 0.35)), 'INCHES', 0.35);
      dave(S, dB, { pose: 'carry', yaw: -0.35, hands: [[0.25, 1.15, 0.4], [-0.25, 1.15, 0.4]], colors: OTHER, decals: false, blink: blinkAt(t, 1.1), t }); ruler(S, add(dB, rotY([0, 1.17, 0.42], -0.35)), 'CENTIMETRES', -0.35);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.2 });
      if (n === 'rulers') tagLabel(ctx, W / 2, H_ * 0.2, '2 TEAMS · 2 UNITS', ramp(t, V('hook', 'different') - 0.1, 0.2), { px: 36 });
      else { const a = S.proj(add(dA, [0, 2.0, 0])), b = S.proj(add(dB, [0, 2.0, 0])); tagLabel(ctx, a[0], a[1], 'lbf·s', ramp(t, V('units', 'pound-seconds') - 0.1, 0.2), { px: 34, col: '#ff8a6a' }); tagLabel(ctx, b[0], b[1], 'N·s', ramp(t, V('units', 'newton-seconds') - 0.1, 0.2), { px: 34, col: '#7ad0ff' }); tagLabel(ctx, W / 2, H_ * 0.12, '1 lbf ≈ 4.45 N', ramp(t, V('units', 'pound-force') - 0.1, 0.2), { px: 38 }); }
    } else if (n === 'push') {
      // every small thruster push was ~4.45x bigger than navigation thought: two arrows, one small (what nav thought), one big (real)
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.4, 3.0, 0.4, 0.3, 0.2, 0.0, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); orbiter(S, [0, 0, 0], t * 0.3);
      const u = ramp(t, sh.t0 + 0.2, 0.4), u2 = ramp(t, V('units', 'bigger') - 0.2, 0.5);
      S.arrow([-0.4, 0.6, 0], [-0.4 + 0.25 * u, 0.6, 0], [120, 200, 255], { w: 0.08, side: [0, 1, 0] });
      S.arrow([-0.4, -0.6, 0], [-0.4 + 1.1 * u2 + 0.01, -0.6, 0], [255, 120, 80], { w: 0.08, side: [0, 1, 0] });
      S.render(ctx, W, H_, { bg: spaceBg, dof: 0, shadows: false });
      const a = S.proj([-0.4, 0.75, 0]), b = S.proj([-0.4, -0.45, 0]); tagLabel(ctx, a[0] + 60, a[1] - 30, 'NAV THOUGHT', u, { px: 26, col: '#7ad0ff' }); tagLabel(ctx, b[0] + 60, b[1] + 70, 'REAL: ×4.45', u2, { px: 26, col: '#ff8a6a' });
    } else if (n === 'orbit') {
      // the planned orbit (dashed, safe) vs the real path, far too close: into the atmosphere
      const u = H.clamp((t - sh.t0) / 3.2), lost = ramp(t, V('lost', 'lost') - 0.2, 0.3);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 9, 8, 6, 5, 0.3, 0.1, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); marsBall(S, [0, 0, 0], 2);
      const ring = (r, col, n2 = 48, uu = 1) => { const pts = []; for (let i = 0; i <= n2 * uu; i++) { const a = Math.PI + (i / n2) * TAU; pts.push([Math.cos(a) * r, 0, Math.sin(a) * r]); } S.beads(pts, col, 0, { spacing: 0.15, r: 0.03 }); };
      ring(2.0 + 1.6, [120, 255, 160]); ring(2.0 + 0.4, [255, 110, 70], 48, 0.25 + 0.2 * u);
      const a = Math.PI + (0.25 + 0.2 * u) * TAU; if (lost < 1) orbiter(S, [Math.cos(a) * 2.4, 0, Math.sin(a) * 2.4], -a);
      S.render(ctx, W, H_, { bg: spaceBg, dof: 0, shadows: false });
      tagLabel(ctx, W / 2, H_ * 0.15, 'PLANNED', ramp(t, sh.t0 + 0.1, 0.2) * (1 - lost), { px: 34, col: '#7ee07a' }); tagLabel(ctx, W / 2, H_ * 0.15, 'LOST', lost * (1 - ramp(t, V('lost', 'Cost') - 0.2, 0.2)), { px: 48, col: '#ff6a5a' });
      tagLabel(ctx, W / 2, H_ * 0.15, '$125,000,000', ramp(t, V('lost', 'Cost') - 0.1, 0.2), { px: 44, col: '#ffd24a' });
      flash = 0.2 * Math.exp(-Math.pow((t - V('lost', 'lost') + 0.1) * 5, 2));
    } else {
      // Dave proudly hands over a sheet labelled MATHS. Mars hits him in the face.
      const t0 = sh.t0, hit = t0 + 1.4, mu = H.clamp((t - t0 - 0.4) / 1.0), fall = H.clamp((t - hit) / 0.5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.4, 3.0, 1.4, 1.3, 0.45, 0.25, [-0.2, 1.2, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      dave(S, [0, 0, 0], { pose: fall > 0 ? 'stand' : 'point', hands: fall > 0 ? undefined : [null, [-0.15, 1.35, 0.6]], pitch: -1.45 * H.ease.in(fall), xeyes: fall > 0.5, blink: blinkAt(t), t });
      if (fall <= 0) S.box((p) => add(p, [0.15, 1.42, 0.62]), 0.15, 0.2, 0.004, [250, 250, 246], { noShadow: true, paint: (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#222'; c.font = `800 ${h * 0.14}px "Montserrat"`; c.textAlign = 'center'; c.fillText('MATHS', w / 2, h * 0.16); c.font = `600 ${h * 0.08}px monospace`; ['1 lbf = 1 N', '(probably)', 'OK!'].forEach((l, i) => c.fillText(l, w / 2, h * (0.38 + i * 0.18))); } });
      const mp = lerp3([-4.5, 3.2, 1.0], [0, 1.66, 0.25], H.ease.in(mu)), mr = 0.32; if (t < hit + 0.6) marsBall(S, fall > 0 ? add([0, 1.66, 0.25], [0.6 * fall, -1.0 * fall * fall, 0.4 * fall]) : mp, mr);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3 });
      const hd = S.proj([0, 1.66, 0.1]); FX.sparks(ctx, hd[0], hd[1], H.clamp((t - hit) / 0.5), 7);
      tagLabel(ctx, W / 2, H_ * 0.2, 'WRITE THE UNITS', ramp(t, V('end', 'units') - 0.1, 0.2), { px: 40, col: '#7ee07a' });
      flash = 0.2 * Math.exp(-Math.pow((t - hit) * 6, 2));
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 18, rip, t, { cause: 'cause of death:\nno units' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.play('pop', V('hook', 'different'), { gain: 0.3 });
    k.play('blip', V('units', 'pound-seconds'), { f: 'E5', gain: 0.5 }); k.play('blip', V('units', 'newton-seconds'), { f: 'A5', gain: 0.5 }); k.play('error', V('units', 'pound-force'), { gain: 0.3 });
    k.play('riser', V('units', 'bigger') - 0.4, { dur: 0.5, gain: 0.3 });
    k.tone(ST('orbit'), { f: 80, type: 'sine', dur: 4, gain: 0.07, a: 0.5, hold: 3 }); k.play('impact', V('lost', 'lost') - 0.1, { gain: 0.45 }); k.play('coin', V('lost', 'Cost'), { gain: 0.4 });
    const t0 = ST('mars'), hit = t0 + 1.4; k.play('paper', t0 + 0.2, { gain: 0.5 }); k.play('riser', hit - 0.9, { dur: 0.9, gain: 0.3 }); k.play('impact', hit, { gain: 0.6 }); k.play('thud', hit + 0.5, { f: 80, gain: 0.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
