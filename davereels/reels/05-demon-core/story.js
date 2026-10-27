  // Dave reel 05: the demon core and the screwdriver. Dave holds the screwdriver; the blue glow rises behind him. R.I.P. Dave #5.
  // The real accident (Louis Slotin, 1946) is told straight; no person is shown at the moment of the accident.
  const BEATS = window.SCRIPT;
  const SH = [['lab', 0], ['xray', BEAT0('shell') - 0.1], ['dragon', BEAT0('slotin') - 0.1], ['slip', BEAT0('slip') - 0.1], ['dave', BEAT0('end') - 0.6]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const CORE = [150, 152, 160], BE = [196, 198, 206], BLUEGLOW = [120, 200, 255];
  // the bench: a small table, the core in the lower half-shell, the upper half-shell held up by gap g (0 = closed) and tilt
  const C0 = [0, 1.0, 0], R = 0.2;
  const coreRig = (S, o = {}) => {
    S.box((p) => add(p, [0, 0.8, 0]), 0.7, 0.04, 0.45, [120, 124, 132], { bevel: 0.1 });
    for (const [x, z] of [[-0.62, -0.38], [0.62, -0.38], [-0.62, 0.38], [0.62, 0.38]]) S.box((p) => add(p, [x, 0.4, z]), 0.03, 0.4, 0.03, [90, 94, 100]);
    S.cyl((p) => add(p, [0, 0.84, 0]), 0.12, 0.04, [100, 104, 112], 14);
    const al = o.glass ? 1 - 0.75 * o.glass : undefined;
    // lower hemisphere (cup) and the core inside it
    S.ico(C0, [R, R, R], BE, { sub: 1, gloss: 0.5, alpha: al, T: (p) => [p[0], -Math.abs(p[1]), p[2]] });
    S.ico(C0, 0.09, CORE, { sub: 1, gloss: 0.4 });
    // upper hemisphere: hinged at the -x edge, opened by angle a; a thumb hole on top
    const a = o.open ?? 0.25, Tup = (p) => add(add(rotZ(add(p, [R, 0, 0]), a), [-R, 0, 0]), C0);
    S.ico([0, 0, 0], [R, R, R], BE, { sub: 1, gloss: 0.5, alpha: al, T: (p) => sub(Tup([p[0], Math.abs(p[1]), p[2]]), [0, 0, 0]) });
    S.cyl((p) => Tup(add(p, [0, R - 0.005, 0])), 0.035, 0.012, [70, 72, 80], 10);
    return Tup;
  };
  const lab = (S) => {
    garage(S, { props: false });
  };
  const screwdriver = (S, tip, dir, o = {}) => { const d = norm(dir), h = add(tip, mul(d, 0.22)); S.rod(tip, h, 0.012, [220, 224, 232], 6); S.rod(h, add(h, mul(d, 0.12)), 0.028, o.col || [226, 60, 50], 8); };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0, glow = 0;
    if (n === 'lab' || n === 'dragon') {
      // Dave at the bench, holding the shell open with a screwdriver tip, sweating
      const [E, TG] = n === 'lab' ? orbit(t, sh.t0, sh.t1, [0.2, 0, 0.2], 3.4, 2.8, 1.7, 1.5, -0.55, -0.3, [0, 1.05, 0]) : orbit(t, sh.t0, sh.t1, [0, 0, 0.2], 2.2, 1.8, 1.3, 1.25, -0.3, -0.05, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); lab(S);
      const wob = n === 'dragon' ? 0.015 * Math.sin(t * 9) : 0, a = 0.22 + wob, Tup = coreRig(S, { open: a });
      const tip = Tup([R - 0.01, -0.005, 0.03]), handle = [0.55, 1.18, 0.45];
      screwdriver(S, tip, sub(handle, tip));
      const dp = [0.75, 0, 0.75], yaw = -2.3;
      dave(S, dp, { pose: 'stand', yaw, hands: [daveLocal(dp, yaw, [0.1, 1.24, 0.1]), daveLocal(dp, yaw, add(tip, mul(norm(sub(handle, tip)), 0.3)))], lean: 0.25, sweat: 1, t, blink: blinkAt(t), look: [-1, -1] });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.5 });
      if (n === 'lab') { tagLabel(ctx, W / 2, H_ * 0.2, 'SAFETY SYSTEM', ramp(t, V('hook', 'screwdriver') - 0.1, 0.2), { px: 40 }); const tp = S.proj(tip); ctx.save(); ctx.strokeStyle = 'rgba(255,210,74,0.9)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(tp[0], tp[1], 30 * ramp(t, V('hook', 'screwdriver') - 0.1, 0.2), 0, TAU); ctx.stroke(); ctx.restore(); }
      else tagLabel(ctx, W / 2, H_ * 0.2, '"TICKLING THE DRAGON\'S TAIL"', ramp(t, V('slotin', 'tickling') - 0.1, 0.2), { px: 30 });
    } else if (n === 'xray') {
      // x-ray: neutrons leave the core; the shell reflects them back. Close it, and the chain reaction runs away.
      const close = ramp(t, V('shell', 'Close') - 0.1, 0.6), run = ramp(t, V('shell', 'runs') - 0.2, 0.6);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 1.6, 1.3, 1.05, 1.02, 0.25, -0.15, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); lab(S); coreRig(S, { open: 0.5 * (1 - close), glass: 0.8 });
      const r = H.rng(7), np = 10 + Math.round(30 * run);
      for (let i = 0; i < np; i++) { const th = r() * TAU, ph = Math.acos(2 * r() - 1), d = [Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)], k = ((t * (1.2 + run * 2) + r()) % 1); const refl = ramp(t, V('shell', 'reflects') - 0.1, 0.3) > 0 && (d[1] < 0 || close > 0.6); const rr = refl ? (k < 0.5 ? 0.09 + k * 2 * (R - 0.09) : R - (k - 0.5) * 2 * (R - 0.09)) : 0.09 + k * 0.5; S.dots.push({ p: add(C0, mul(d, rr)), col: run > 0.3 ? BLUEGLOW : [120, 255, 160], r: 0.008 }); }
      S.render(ctx, W, H_, { dof: 0, focus: 1.4 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'NEUTRONS', ramp(t, V('shell', 'neutrons') - 0.1, 0.2) * (1 - run), { px: 38, col: '#7ee07a' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'RUNAWAY', run, { px: 44, col: '#7ad0ff' });
      glow = 0.35 * run;
    } else if (n === 'slip') {
      // the screwdriver slips, a flash of blue light, the shell is knocked apart. No person in shot.
      const ts = V('slip', 'slipped') - 0.15, tf = V('slip', 'flash') - 0.1, tk = V('slip', 'knocked') - 0.1;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.2], 2.0, 2.4, 1.3, 1.5, 0.2, 0.4, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); lab(S);
      const shut = ramp(t, ts, 0.15), knock = H.clamp((t - tk) / 0.5), a = knock > 0 ? 0.0 + 2.6 * H.ease.out(knock) : 0.22 * (1 - shut);
      const Tup = coreRig(S, { open: a });
      const sd = H.clamp((t - ts) / 0.4); if (sd < 1 && knock <= 0) { const tip = add(Tup([R - 0.01, -0.005, 0.03]), [0.1 * sd, -0.2 * sd * sd, 0.05 * sd]); screwdriver(S, tip, [0.55, 0.2, 0.45]); } else screwdriver(S, [0.25, 0.86, 0.25], [1, 0.05, 0.3]);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.2 });
      glow = 0.9 * Math.exp(-Math.pow((t - tf) * 3, 2)) * (t > ts ? 1 : 0);
      tagLabel(ctx, W / 2, H_ * 0.2, 'DIED 9 DAYS LATER', ramp(t, V('slip', 'nine') - 0.1, 0.2), { px: 34, col: '#ffffff' });
    } else {
      // Dave stares at his screwdriver, slowly lowers it, backs away. A blue glow rises behind him.
      const t0 = sh.t0, lower = ramp(t, t0 + 0.3, 1.0), back = H.ease.inOut(H.clamp((t - t0 - 0.9) / 1.6));
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.4, 0, 0.9], 2.8, 3.2, 1.4, 1.5, 0.05, -0.1, [0, 1.1, 0]);
      const S = Scene(E, TG, W, H_); lab(S); coreRig(S, { open: 0.0 });
      const dp = [0.4, 0, 0.75 + 0.9 * back], yaw = 0.0, hand = [-0.25, 1.4 - 0.5 * lower, 0.35];
      dave(S, dp, { pose: back > 0 ? 'walk' : 'stand', t: -t * 0.6, hands: [null, hand], look: [0, -1 + lower], blink: blinkAt(t), sweat: 1 });
      const hw = add(dp, hand); screwdriver(S, add(hw, [0, 0.05, 0.02]), [0.05, 1 - lower * 1.6, 0.4]);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      glow = 0.5 * ramp(t, t0 + 1.2, 1.5);
    }
    if (glow > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(W / 2, H_ * 0.62, 0, W / 2, H_ * 0.62, H_ * 0.7); g.addColorStop(0, `rgba(140,210,255,${glow})`); g.addColorStop(1, 'rgba(60,120,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 5, rip, t, { cause: 'cause of death:\noptimism' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.tone(0.1, { f: 55, type: 'sine', dur: ST('slip') + 2, gain: 0.08, a: 1.0, hold: ST('slip'), minor: true }); // a low lab hum
    k.play('ding', V('hook', 'screwdriver'), { f: 'E5', gain: 0.25 });
    // a Geiger counter that speeds up as the shell closes
    const r = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1; let x = ST('xray'); const run = V('shell', 'runs'); while (x < ST('dragon')) { k.play('tick', x, { gain: 0.5, minor: true }); x += x < run ? 0.12 + 0.25 * r(x) : 0.025 + 0.03 * r(x); }
    k.play('error', V('slotin', 'tickling'), { gain: 0.2 });
    const ts = V('slip', 'slipped') - 0.15, tf = V('slip', 'flash') - 0.1, tk = V('slip', 'knocked') - 0.1;
    k.play('tock', ts, { f: 1400, gain: 0.5 }); k.play('thud', ts + 0.15, { f: 120, gain: 0.5 }); k.play('riser', tf - 0.2, { dur: 0.5, gain: 0.3 }); k.play('impact', tk, { gain: 0.45 });
    const t0 = ST('dave'); k.play('riser', t0 + 1.0, { dur: 1.6, gain: 0.25 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
