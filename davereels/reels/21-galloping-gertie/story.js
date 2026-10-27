  // Dave reel 21: Galloping Gertie (Tacoma Narrows, 1940). Dave walks calmly with his coffee as the deck falls away piece by piece. R.I.P. Dave #20.
  const BEATS = window.SCRIPT;
  const SH = [['gallop', 0], ['ribbon', BEAT0('flutter') - 0.1], ['tear', BEAT0('fall') - 0.1], ['tunnel', V('fall', 'Every') - 0.2], ['dave', BEAT0('end') - 1.6]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const DECK = [120, 124, 130], TOWER = [90, 120, 110], WATER = [60, 110, 140];
  // the bridge along x: deck from -L to L at height y0, in N segments. wave(x) = vertical offset; twist(x) = roll angle.
  // gone(i) = true removes segment i (falling segments drop by fall(i) metres)
  const bridge = (S, o = {}) => {
    const L = o.L ?? 420, N = o.N ?? 42, y0 = 60, w = 6;
    S.quad([[-2000, 0, -2000], [2000, 0, -2000], [2000, 0, 2000], [-2000, 0, 2000]], WATER, { bg: true });
    for (const sx of [-1, 1]) { S.box((p) => add(p, [sx * L * 0.5, 75, -8]), 3, 75, 2, TOWER, { bevel: 0.05 }); S.box((p) => add(p, [sx * L * 0.5, 75, 8]), 3, 75, 2, TOWER, { bevel: 0.05 }); S.box((p) => add(p, [sx * L * 0.5, 148, 0]), 3, 2, 10, TOWER); }
    for (const sz of [-7, 7]) { const pts = []; for (let i = 0; i <= 30; i++) { const x = -L + (2 * L * i) / 30, u = x / (L * 0.5); const y = Math.abs(u) <= 1 ? 66 + 82 * u * u : 150 - 90 * (Math.abs(u) - 1); pts.push([x, Math.max(y, 60), sz]); } S.tube(pts, 0.6, [70, 74, 80], 5); }
    for (let i = 0; i < N; i++) {
      if (o.gone && o.gone(i)) continue;
      const x0 = -L + (2 * L * i) / N, x1 = x0 + (2 * L) / N, xm = (x0 + x1) / 2, dy = (o.wave ? o.wave(xm) : 0) - (o.fall ? o.fall(i) : 0), tw = o.twist ? o.twist(xm) : 0;
      S.box((p) => add(rotX(p, tw), [xm, y0 + dy, 0]), (x1 - x0) / 2, 2.0, w * 1.6, DECK, { bevel: 0.05, sidePaint: null });
    }
  };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'gallop' || n === 'tear') {
      const tear = n === 'tear' ? H.clamp((t - sh.t0 - 0.6) / 2.0) : 0, amp = n === 'gallop' ? 7 : 9;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 520, 460, 190, 170, 0.75, 0.55, [0, 55, 0]);
      const S = Scene(E, TG, W, H_);
      const wave = (x) => amp * Math.sin(x / 70 - t * 3), twist = (x) => (n === 'tear' ? 0.35 : 0.04) * Math.sin(x / 140 - t * 2.4);
      bridge(S, { wave, twist, gone: (i) => n === 'tear' && i >= 12 && i < 12 + Math.floor(18 * tear), fall: () => 0 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      if (n === 'gallop') { tagLabel(ctx, W / 2, H_ * 0.15, 'TACOMA NARROWS · 1940', ramp(t, V('hook', '1940') - 0.1, 0.2), { px: 32 }); tagLabel(ctx, W / 2, H_ * 0.22, '"GALLOPING GERTIE"', ramp(t, V('hook', 'Galloping') - 0.1, 0.2), { px: 34 }); }
      else { tagLabel(ctx, W / 2, H_ * 0.15, '4 MONTHS', ramp(t, V('fall', 'months') - 0.1, 0.2), { px: 40 }); flash = 0.12 * Math.exp(-Math.pow((t - sh.t0 - 0.8) * 4, 2)); }
    } else if (n === 'ribbon') {
      // a section of the thin deck in a wind tunnel of beads: each twist feeds the next (flutter)
      const grow = ramp(t, V('flutter', 'bigger') - 0.8, 1.5), tw = (0.05 + 0.4 * grow) * Math.sin(t * 5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 4.4, 3.9, 2.0, 1.8, 1.0, 0.8, [0, 1.3, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.6, 0.45, 0.85);
      S.box((p) => add(rotX(p, tw), [0, 1.3, 0]), 1.0, 0.025, 0.55, DECK, { bevel: 0.1 });
      for (let j = -3; j <= 3; j++) { const y = 1.3 + j * 0.12, bend = 0.25 * Math.sin(tw) * Math.exp(-j * j * 0.15); S.beads([[0, y, -1.6], [0, y + bend * 0.5, -0.6], [0, y + bend, 0], [0, y + bend * 0.5, 0.6], [0, y, 1.6]], P.air, t * 1.5 + j * 0.1, { spacing: 0.12, r: 0.02 }); }
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.9 });
      const rp = S.proj([0, 1.5, 0]); FX.spin(ctx, rp[0], rp[1], 60 + 40 * grow, ramp(t, V('flutter', 'twist') - 0.1, 0.3));
      tagLabel(ctx, W / 2, H_ * 0.2, 'THIN RIBBON DECK', ramp(t, V('flutter', 'ribbon') - 0.1, 0.2) * (1 - ramp(t, V('flutter', 'twist') - 0.2, 0.2)), { px: 36 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'EACH TWIST → BIGGER', ramp(t, V('flutter', 'bigger') - 0.3, 0.2) * (1 - ramp(t, V('flutter', 'flutter') - 0.2, 0.2)), { px: 34 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'FLUTTER', ramp(t, V('flutter', 'flutter') - 0.1, 0.2), { px: 48, col: '#ffd24a' });
    } else if (n === 'tunnel') {
      // every big bridge since: a model in a wind tunnel
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.4, 3.0, 1.3, 1.2, 0.45, 0.25, [0, 1.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      S.box((p) => add(p, [0, 1.1, 0]), 1.2, 0.5, 0.5, [190, 210, 230], { alpha: 0.25 });
      S.box((p) => add(p, [0, 1.0, 0]), 0.9, 0.06, 0.18, [200, 60, 50], { bevel: 0.1 }); S.box((p) => add(p, [0, 0.55, 0]), 1.2, 0.05, 0.5, [80, 84, 92]);
      for (let j = -2; j <= 2; j++) S.beads([[-1.2, 1.1 + j * 0.1, -0.4], [1.2, 1.1 + j * 0.1, -0.4]], P.air, t * 2, { spacing: 0.1, r: 0.015 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.2 });
      tagLabel(ctx, W / 2, H_ * 0.2, 'WIND-TUNNEL TESTED', ramp(t, V('fall', 'wind-tunnel') - 0.1, 0.2), { px: 36, col: '#7ee07a' });
    } else {
      // Dave walks calmly, coffee steady, as the deck falls away around him piece by piece. The last piece goes. He looks down.
      const t0 = sh.t0, N = 24, L = 12, gone = (i) => { const d = Math.abs(i - 12); return t > t0 + 0.4 + (11 - d) * 0.13 && d > 0; }, last = t > t0 + 2.4;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 60, 0], 7, 6, 1.4, 1.0, 0.5, 0.35, [0, 0.4, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-2000, 0, -2000], [2000, 0, -2000], [2000, 0, 2000], [-2000, 0, 2000]], WATER, { bg: true });
      for (let i = 0; i < N; i++) { const x0 = -L + (2 * L * i) / N, xm = x0 + L / N; const g = gone(i); if (i === 12 && last) continue; if (g) { const d = Math.abs(i - 12), tg = t0 + 0.4 + (11 - d) * 0.13, ft = t - tg; if (ft < 1.2) S.box((p) => add(rotX(p, ft * 0.8), [xm, 60 - 4.9 * ft * ft, 0]), L / N, 0.3, 3, DECK, { bevel: 0.05 }); continue; } S.box((p) => add(p, [xm, 60, 0]), L / N, 0.3, 3, DECK, { bevel: 0.05 }); }
      const df = last ? 4.9 * Math.pow(Math.max(0, t - t0 - 2.9), 2) : 0;
      dave(S, [0, 60.3 - df, 0], { pose: 'walk', t: last ? 0 : t, yaw: Math.PI / 2, hands: [null, [-0.22, 1.18, 0.38]], look: last ? [0, -1] : [0, 0], blink: blinkAt(t), headTilt: last ? 0.35 : 0 });
      const cp = add([0, 60.3 - df, 0], rotY([-0.22, 1.25, 0.38], Math.PI / 2)); S.cyl((p) => add(p, cp), 0.05, 0.12, [240, 240, 236], 10, { cap: [90, 60, 40] });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.25, focus: 6.5, shadows: false });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 20, rip, t, { cause: 'cause of death:\nignored the hint' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('tunnel'), color: 'pink', filter: 'bandpass', f: [[0, 400], [ST('tunnel'), 900]], q: 0.5, gain: 0.12, a: 0.5, minor: true }); // the wind
    for (let i = 0; i < 6; i++) k.tone(0.5 + i * 0.9, { f: [[0, 70], [0.45, 55], [0.9, 70]], type: 'sawtooth', dur: 0.9, gain: 0.05, filter: 'lowpass', f2: 400, a: 0.2, minor: true }); // the creak of the gallop
    k.play('pop', V('hook', 'Galloping'), { gain: 0.3 }); k.play('error', V('hook', 'hint'), { gain: 0.25 });
    k.play('riser', V('flutter', 'bigger') - 0.8, { dur: 1.2, gain: 0.3 }); k.play('stamp', V('flutter', 'flutter'), { gain: 0.45 });
    const tt = ST('tear') + 0.6; for (let i = 0; i < 6; i++) k.play('impact', tt + i * 0.35, { gain: 0.35 }); k.noise(tt, { dur: 2.2, color: 'brown', filter: 'lowpass', f: 400, gain: 0.3, a: 0.05 });
    k.play('success', V('fall', 'wind-tunnel'), { gain: 0.35 });
    const t0 = ST('dave'); for (let i = 0; i < 11; i++) k.play('thud', t0 + 0.4 + i * 0.13, { f: 100 + i * 5, gain: 0.25, minor: true }); k.play('swish', t0 + 2.9, { dur: 0.6, gain: 0.5 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
