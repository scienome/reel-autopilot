  // Dave reel 02: Hitler's 188-tonne tank (the Maus). Dave drives it; a bridge ends it. R.I.P. Dave #2.
  const BEATS = window.SCRIPT;
  const SH = [['hook', 0], ['scale', BEAT0('weight') - 0.1], ['bridge1', V('weight', 'Most') - 0.1], ['river', BEAT0('snorkel') - 0.1], ['road', BEAT0('speed') - 0.1], ['two', BEAT0('fail') - 0.1], ['bridge2', V('fail', 'enemy') + 0.35]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const skyEnv = (o = {}) => ({ bg: sunsetSky, dof: 0.3, shadowAlpha: 0.45, ...o });
  // the bridge finale: times
  const TB = () => V('end', 'Bigger'), TS = () => V('end', 'better'), TSPL = () => TS() + 0.72;
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'hook') {
      // the Maus looms; Dave in the hatch, saluting nobody. "Nothing could move it": the tracks spin, it stays put.
      const tm = V('hook', 'move') - 0.25, spinning = t > tm;
      let [E, TG] = orbit(t, sh.t0, sh.t1, [-0.5, 0, 0.3], 17, 14, 0.6, 1.6, 0.95, 0.7, [0, 2.9, 0]);
      const close = 1 - ramp(t, 0.2, Math.max(1, V('hook', 'He') - 0.2)); // start close on Dave's salute, pull back to the whole tank
      [E, TG] = [lerp3(E, [3.2, 4.5, 3.4], close), lerp3(TG, [-1.9, 4.25, 0.55], close)];
      if (spinning) E = add(E, [0.04 * Math.sin(t * 47), 0.04 * Math.sin(t * 53), 0]);
      const S = Scene(E, TG, W, H_); testRoad(S);
      maus(S, [0, 0, 0], { track: spinning ? (t - tm) * 6 : 0, dave: { pose: 'salute', blink: blinkAt(t), t } });
      if (spinning) { const r = H.rng(3); for (let i = 0; i < 16; i++) { const k = ((t - tm) * 1.6 + r()) % 1, sd = i % 2 ? 1 : -1; S.ico([-4.8 - k * 3.5, 0.3 + 2.2 * k - 2.6 * k * k, sd * (1.75 + r() * 0.6)], 0.14 + 0.1 * r(), [104, 78, 56], { sub: 0, noShadow: true }); } }
      S.render(ctx, W, H_, skyEnv({ focus: 11 }));
      flash = 0.12 * Math.exp(-Math.pow((t - V('hook', 'big')) * 5, 2));
    } else if (n === 'scale') {
      // 188 tonnes on a weighbridge
      const [E, TG] = orbit(t, sh.t0, sh.t1, [1, 0, 0], 24, 22, 6, 5, 0.75, 0.55, [0, 2.2, 0]);
      const S = Scene(E, TG, W, H_); testRoad(S);
      S.box((p) => add(p, [0, 0.15, 0]), 5.6, 0.15, 2.4, [150, 154, 160], { bevel: 0.05, sidePaint: (c, w, h) => { for (let i = 0; i < 12; i++) { c.fillStyle = i % 2 ? '#222' : '#f6c43e'; c.fillRect((i * w) / 12, 0, w / 12, h); } } });
      const sink = 0.06 * ramp(t, V('weight', 'weighed') - 0.2, 0.4);
      maus(S, [0, 0.3 - sink, 0], { dave: { pose: 'thumbs', blink: blinkAt(t), t } });
      S.rod([6.2, 0, 3], [6.2, 2.2, 3], 0.08, [90, 94, 100], 8); S.box((p) => add(p, [6.2, 2.7, 3]), 0.9, 0.5, 0.1, [40, 42, 48], { bevel: 0.1 });
      S.render(ctx, W, H_, skyEnv({ focus: 16 }));
      const dp = S.proj([6.2, 2.7, 3.1]), tA = V('weight', 'about'), tB = V('weight', 'tonnes'), v = Math.round(188 * H.ease.out(H.clamp((t - tA) / Math.max(0.3, tB - tA))));
      tagLabel(ctx, dp[0], dp[1], `${v} t`, ramp(t, tA - 0.3, 0.2) * 1.0, { px: 44 });
      flash = 0.1 * Math.exp(-Math.pow((t - tB) * 5, 2));
    } else if (n === 'bridge1') {
      // most bridges: 20 to 60 tonnes. The Maus stops at the sign.
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-8, 0, 0], 24, 21, 7, 5.5, -1.05, -0.8, [0, 0.5, 0]);
      const S = Scene(E, TG, W, H_); riverSet(S, { t });
      weightSign(S, [-8.6, 0, 3.4], '60 t', -0.8);
      maus(S, [-15.5, 0, 0], { dave: { pose: 'point', blink: blinkAt(t), t } });
      S.render(ctx, W, H_, skyEnv({ focus: 18 }));
      const sp = S.proj([-8.6, 3.4, 3.4]), bp = S.proj([0, 0.4, 0]);
      tagLabel(ctx, sp[0], sp[1] - 120, '20 – 60 t', ramp(t, V('weight', 'twenty') - 0.15, 0.2), { px: 38, col: '#ffffff' });
      FX.no(ctx, bp[0], bp[1], 70, ramp(t, V('weight', "couldn't") - 0.1, 0.25));
    } else if (n === 'river') {
      // x-ray river: the Maus on the riverbed, Dave breathing through a very long snorkel
      const bed = -7, x = -5 + 0.9 * (t - sh.t0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [x, bed, 0], 19, 18, 4.4, 4.8, 0.1, -0.06, [0.5, 4.4, 0]);
      const S = Scene(E, TG, W, H_);
      S.quad([[-60, bed, -6], [60, bed, -6], [60, bed, 40], [-60, bed, 40]], MS.bed, { bg: true, grid: [1.5, 'rgba(110,80,60,0.25)'] });
      S.quad([[-60, bed, -6], [60, bed, -6], [60, 0, -6], [-60, 0, -6]], [46, 98, 140], { bg: true, paint: (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(160,220,255,0.35)'); g.addColorStop(1, 'rgba(0,20,40,0.3)'); c.fillStyle = g; c.fillRect(0, 0, w, h); } });
      S.quad([[-60, 0, -40], [60, 0, -40], [60, 0, -6], [-60, 0, -6]], P.grass, { bg: true });
      const r0 = H.rng(4); for (let i = 0; i < 10; i++) tree(S, -20 + i * 4.5 + r0.range(-1, 1), -10 - r0.range(0, 6), 2.4, i);
      const T = maus(S, [x, bed, 0], { glass: 0.6, hatch: false, snorkel: 4.6, track: x });
      dave(S, T([1.6, 0.62, 0]), { pose: 'drive', yaw: Math.PI / 2, mouth: 0.6 + 0.4 * Math.sin(t * 5), blink: blinkAt(t, 1), t });
      // air down the snorkel, bubbles up from the engine deck
      S.beads([T([-2.6, 8.2, -0.7]), T([-2.6, 3.4, -0.7]), T([1.4, 2.2, 0])], P.air, t * 1.6, { spacing: 0.35, r: 0.08, reveal: ramp(t, V('snorkel', 'breathing') - 0.2, 0.5) });
      for (let i = 0; i < 9; i++) { const k = (t * 0.35 + i / 9) % 1; S.ico([x - 3.5 + (i % 3) * 0.4 + 0.2 * Math.sin(t * 3 + i), bed + 2.3 + k * 4.6, 0.6 * Math.cos(i)], 0.07 + 0.08 * k, [220, 240, 255], { sub: 0, noShadow: true, glow: true }); }
      S.quad([[-60, bed, 4], [60, bed, 4], [60, 0, 4], [-60, 0, 4]], MS.water, { alpha: 0.22, noShadow: true });
      S.render(ctx, W, H_, skyEnv({ focus: 20, dof: 0, shadows: false }));
      const sp = S.proj([x - 2.6, 0.2, -0.7]); tagLabel(ctx, sp[0], sp[1] - 70, 'SNORKEL', ramp(t, V('snorkel', 'snorkel') - 0.1, 0.2), { px: 32, col: '#ffffff' });
    } else if (n === 'road') {
      // 13 km/h: Dave's tank inches along; a kid on a bicycle overtakes, ringing the bell
      const tx = -1 + 0.8 * (t - sh.t0), kx = -17 + 6.5 * (t - sh.t0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0.5], 23, 22, 3.2, 3.6, 0.42, 0.3, [0.5, 1.8, 0]);
      const S = Scene(E, TG, W, H_); testRoad(S);
      maus(S, [tx, 0, -0.1], { track: tx, dave: { pose: 'stand', turn: -Math.PI / 2 + 0.6 * H.clamp((kx - tx + 4) / 8), blink: blinkAt(t), t } });
      bikeKid(S, [kx, 0, 2.6], { spin: -(kx + 17) / 0.34, t: t * 2 });
      S.render(ctx, W, H_, skyEnv({ focus: 15 }));
      const kp = S.proj([kx + 0.42, 1.0, 2.8]), ring = Math.max(0, 1 - Math.abs(kx - (tx + 1)) / 1.5);
      if (ring > 0) FX.heat(ctx, kp[0], kp[1] - 20, 40, ring * 0.8, t, 'rgba(255,230,120,0.9)');
      tagLabel(ctx, W / 2, H_ * 0.2, '13 km/h', ramp(t, V('speed', 'thirteen') - 0.1, 0.2), { px: 48 });
    } else if (n === 'two') {
      // only two were built; neither ever fired at an enemy
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.5, 0, 0], 31, 28, 9, 7, 0.95, 0.75, [0, 1.6, 0]);
      const S = Scene(E, TG, W, H_); testRoad(S);
      const A = maus(S, [0, 0, -3.4], { hatch: false }), B = maus(S, [0, 0, 3.4], { dave: { pose: 'stand', hands: [[0.45, 1.6, 0.1], [-0.45, 1.6, 0.1]], blink: blinkAt(t), t } });
      S.render(ctx, W, H_, skyEnv({ focus: 22 }));
      const ma = A([7.3, 2.88, 0.18]), mb = B([7.3, 2.88, 0.18]), pa = S.proj(ma), pb = S.proj(mb), un = ramp(t, V('fail', 'Neither') - 0.1, 0.25);
      FX.no(ctx, pa[0], pa[1], 46, un); FX.no(ctx, pb[0], pb[1], 46, un);
      tagLabel(ctx, W / 2, H_ * 0.2, '× 2', ramp(t, V('fail', 'two') - 0.1, 0.2), { px: 56 });
    } else {
      // the finale: Dave drives onto a bridge anyway. Creak. Snap. Splash.
      const tb = TB(), ts = TS(), tsp = TSPL(), arrive = H.ease.out(H.clamp((t - sh.t0) / Math.max(0.5, tb - sh.t0)));
      const sag = 0.05 * ramp(t, tb - 0.1, 0.5) + 0.01 * Math.sin(t * 40) * (t > tb && t < ts ? 1 : 0), fall = H.clamp((t - ts) / 0.75);
      const drop = t > ts ? 0.5 * 9.8 * Math.pow(t - ts, 2) * 0.55 : 0;
      const tx = -17 + 15.3 * arrive;
      let [E, TG] = orbit(t, sh.t0, tsp + 0.5, [-2, 0, 0], 23, 21, 6.5, 5, 0.85, 0.7, [0, -0.5, 0]);
      const after = ramp(t, tsp + 0.3, 0.9), headP = [-1, -2.4, 3.2];
      if (after > 0) [E, TG] = [lerp3(E, add(headP, [0.4, 0.7, 3.6]), after), lerp3(TG, add(headP, [0, 0.75, 0]), after)];
      if (t > ts && t < tsp + 0.4) E = add(E, [0.08 * Math.sin(t * 61), 0.08 * Math.sin(t * 47), 0]);
      const S = Scene(E, TG, W, H_); riverSet(S, { t, sag, fall });
      weightSign(S, [-8.6, 0, 3.4], '60 t', -0.4);
      if (t < tsp) maus(S, [tx, -drop - sag * 3, 0], { track: tx, pitch: -0.12 * fall, dave: { pose: t < tb ? 'thumbs' : 'stand', blink: blinkAt(t), t, look: [0, t > tb ? -1 : 0] } });
      splash(S, [tx + 1, -2.4, 0], (t - tsp) / 1.3, 1.3);
      if (t > tsp + 0.8) {
        const bob = H.ease.back(H.clamp((t - tsp - 0.8) / 0.6)), y = -2.4 - 1.63 + 0.1 + 0.25 * bob + 0.05 * Math.sin(t * 3);
        dave(S, [headP[0], y, headP[2]], { headOnly: true, blink: blinkAt(t, 0.4), yaw: 0.25 });
        for (let i = 0; i < 5; i++) { const k = (t * 0.8 + i / 5) % 1; S.ico([headP[0] - 0.6 + i * 0.3, -2.35 + 0.15 * Math.sin(k * 3), headP[2] - 0.4 + 0.2 * Math.cos(i)], 0.05 + 0.06 * (1 - k), [220, 240, 255], { sub: 0, noShadow: true, glow: true }); }
      }
      S.render(ctx, W, H_, skyEnv({ focus: 20 }));
      flash = 0.18 * Math.exp(-Math.pow((t - ts) * 6, 2)) + 0.12 * Math.exp(-Math.pow((t - tsp) * 5, 2));
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 2, rip, t, { cause: 'cause of death:\n188 tonnes, one bridge' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    // the engine: a low rumble under everything until the splash
    k.noise(0.05, { dur: TSPL(), color: 'brown', filter: 'lowpass', f: 180, gain: 0.12, a: 0.4, minor: true });
    k.play('impact', V('hook', 'big'), { gain: 0.45 });
    const tm = V('hook', 'move') - 0.25; k.play('buzz', tm, { f: 55, dur: 1.4, gain: 0.35 }); k.noise(tm, { dur: 1.3, color: 'brown', filter: 'bandpass', f: 400, q: 0.8, gain: 0.18, a: 0.05, minor: true });
    // the weighbridge counting up, then a stamp at "tonnes"
    const tA = V('weight', 'about'), tB = V('weight', 'tonnes'); for (let x = tA; x < tB; x += 0.07) k.play('count', x, { gain: 0.5, minor: true }); k.play('stamp', tB, { gain: 0.5 });
    k.play('pop', V('weight', 'twenty'), { gain: 0.35 }); k.play('error', V('weight', "couldn't"), { gain: 0.35 });
    // underwater: muffled bubbles
    for (let i = 0; i < 10; i++) k.play('blip', ST('river') + 0.3 + i * 0.32, { f: 260 + (i % 4) * 70, type: 'sine', dur: 0.06, gain: 0.5, minor: true });
    k.play('pop', V('snorkel', 'snorkel'), { gain: 0.3 });
    // the bicycle bell, twice, as the kid passes
    const t0 = ST('road'), pass = t0 + (16 / 5.7); k.play('bell', pass - 0.35, { gain: 0.5 }); k.play('bell', pass - 0.12, { gain: 0.5 });
    k.play('pop', V('speed', 'thirteen'), { gain: 0.35 });
    k.play('pop', V('fail', 'two'), { gain: 0.35 }); k.play('error', V('fail', 'Neither'), { gain: 0.3 });
    // creak, snap, splash
    const tb = TB(), ts = TS(), tsp = TSPL();
    k.tone(tb - 0.05, { f: [[0, 70], [0.5, 52], [0.9, 64]], type: 'sawtooth', dur: Math.max(0.6, ts - tb), gain: 0.1, filter: 'bandpass', f2: 500, q: 3, a: 0.1 });
    k.play('impact', ts, { gain: 0.6 }); k.noise(ts, { dur: 0.25, filter: 'highpass', f: 1500, gain: 0.35, a: 0.002 });
    k.noise(tsp, { dur: 1.4, color: 'pink', filter: 'lowpass', f: [[0, 3000], [1.4, 400]], gain: 0.4, a: 0.01, verb: 0.3 }); k.play('thud', tsp, { f: 60, gain: 0.6 });
    for (let i = 0; i < 6; i++) k.play('blip', tsp + 1.0 + i * 0.28, { f: 300 + i * 40, type: 'sine', dur: 0.05, gain: 0.5, minor: true });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
