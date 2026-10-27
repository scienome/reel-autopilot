  // ==================== "The button that blew up Chernobyl", 16:9 ====================
  // The AZ-5 desk <-> the plant at night (the explosion, the fire) <-> garage explainers (the cutaway RBMK core: fuel,
  // neutrons, graphite, boiling water, boron rods, xenon; the turbine and pump loop; one control rod with its graphite tip
  // sliding into the bottom of the core) <-> what changed (redesigned rods, the steel arch). Respectful: no people shown.

  const BEATS = window.SCRIPT;
  const SH = [
    ['hook', 0],
    ['boom', BEAT0('boom') - 0.15],
    ['promise', BEAT0('promise') - 0.15],
    ['core', BEAT0('fuel') - 0.15],
    ['steamloop', BEAT0('water') - 0.15],
    ['rods', BEAT0('rods') - 0.15],
    ['void', BEAT0('absorb') - 0.15],
    ['night', BEAT0('test') - 0.15],
    ['xenon', BEAT0('drop') - 0.15],
    ['pumps', BEAT0('pumps') - 0.15],
    ['desk', BEAT0('button') - 0.15],
    ['rod', BEAT0('flaw') - 0.15],
    ['spike', BEAT0('spike') - 0.15],
    ['explode', BEAT0('lid') - 0.15],
    ['fixed', BEAT0('fixes') - 0.15],
    ['margin', BEAT0('fuel2') - 0.15],
    ['arch', BEAT0('report') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const tPress = V('hook', 'pressed'), tBoom = V('boom', 'exploded'), tAZ = V('button', 'pressed');
  const coreShot = (ctx, W, H_, t, sh, o, cam = {}) => {
    const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], cam.r0 || 3.2, cam.r1 || 2.7, cam.h0 ?? 0.7, cam.h1 ?? 0.5, cam.a0 ?? 0.5, cam.a1 ?? -0.1, [0, 0.1, 0]);
    const S = Scene(E, TG, W, H_); garage(S); const m = coreModel(S, [0, 0.75, 0], t, o); S.render(ctx, W, H_, { dof: 0.33, focus: 2.9 }); return { S, m };
  };
  const plantShot = (ctx, W, H_, t, E, TG, o) => { const S = Scene(E, TG, W, H_); const p = plant(S, [0, 0, 0], t, o); if (o.arch != null) nscArch(S, [0.6, 0, 0], o.arch); S.render(ctx, W, H_, { bg: o.night ? nightSky : sunsetSky, dof: 0.33, focus: 9, dofGap: 8 }); return { S, p }; };

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'hook' || n === 'desk') { // the AZ-5 button
      const tp = n === 'hook' ? tPress : tAZ;
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.75, 1.55, 1.2], [0.3, 1.0, 0], [0.55, 1.4, 0.85], [0.3, 1.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      const d = azDesk(S, [0, 0.95, 0], { pressed: ramp(t, tp - 0.1, 0.15), glow: t > tp - 0.1 ? 1 : 0 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.3 });
      const bp = S.proj(d.button); ringHi(ctx, bp[0], bp[1], 70, ramp(t, tp - 0.6, 0.3) * (1 - ramp(t, tp + 0.4, 0.3)), '255,90,70');
      if (n === 'desk') { const pc = (t - tp) > 0 ? H.clamp((t - tp) / 18) : 0; tally(ctx, W / 2, H_ * 0.14, 'rods ' + Math.round(100 * pc) + '% in', ramp(t, V('button', 'every') - 0.1, 0.3), 54); }
      flash = 0.15 * Math.exp(-Math.pow((t - tp) * 6, 2));
    } else if (n === 'boom' || n === 'explode') { // the night: the lid through the roof, the second explosion, the fire
      const isB = n === 'boom', tl = isB ? tBoom : V('lid', 'threw');
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2.0, 0], isB ? 13 : 12, isB ? 11 : 15, isB ? 2.0 : 1.6, 1.4, isB ? 0.6 : -0.4, isB ? 0.9 : 0.1, [0, 0, 0]);
      const lid = ramp(t, tl - 0.1, 1.2);
      const { S, p } = plantShot(ctx, W, H_, t, E, TG, { night: true, lid, roof: t < tl });
      const cp = S.proj(p.core);
      if (t > tl) { FX.heat(ctx, cp[0], cp[1], 160, ramp(t, tl, 0.6), t, 'rgba(255,120,40,0.9)'); puffs(ctx, cp[0], cp[1] - 40, ((t - tl) / 3) % 1, 6, '120,110,110', 120); puffs(ctx, cp[0] + 40, cp[1] - 60, ((t - tl) / 3 + 0.5) % 1, 7, '90,86,90', 140); }
      flash = 0.45 * Math.exp(-Math.pow((t - tl) * 5, 2)) + (isB ? 0 : 0.35 * Math.exp(-Math.pow((t - V('second', 'second')) * 5, 2)));
      if (!isB) { FX.sparks(ctx, cp[0], cp[1] - 60, H.clamp((t - V('second', 'scattered')) / 0.6), 12); if (t > V('toll', 'two') - 0.3) { ctx.save(); ctx.fillStyle = `rgba(20,16,24,${0.35 * ramp(t, V('toll', 'two') - 0.3, 1.5)})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); } }
    } else if (n === 'promise') {
      coreShot(ctx, W, H_, t, sh, { rods: 0.5, power: 0.5, water: 1, boil: 0.4, neutrons: 0.6 });
    } else if (n === 'core') { // fuel, splitting atoms, graphite
      const { S, m } = coreShot(ctx, W, H_, t, sh, { rods: 0.4, power: 0.3 + 0.3 * ramp(t, V('fission', 'chain') - 0.2, 1), neutrons: ramp(t, V('fission', 'splits') - 0.2, 0.6), graphite: ramp(t, V('graphite', 'graphite') - 0.3, 0.8) }, { a0: -0.5, a1: 0.2 });
      const fp = S.proj(m.mid); ringHi(ctx, fp[0], fp[1], 80, ramp(t, V('fuel', 'rods') - 0.1, 0.3) * (1 - ramp(t, V('fission', 'splits') - 0.3, 0.3)));
    } else if (n === 'steamloop' || n === 'pumps') { // water up the channels, steam to the turbine; then the pumps slow
      const isP = n === 'pumps', slowU = isP ? ramp(t, V('pumps', 'slowed') - 0.2, 2.0) : 0;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.9, 1.1, 0], 4.6, 4.0, 0.7, 0.5, 0.3, -0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      coreModel(S, [-0.4, 0.75, 0], t, { rods: isP ? 0.08 : 0.5, power: isP ? 0.4 + 0.5 * slowU : 0.5, water: 1 - 0.5 * slowU, boil: isP ? 0.3 + 0.6 * slowU : ramp(t, V('water', 'boils') - 0.2, 0.6) * 0.4, neutrons: 0.5 });
      turbineLoop(S, [2.0, 1.2, -0.2], t, { spin: isP ? 1 - 0.8 * slowU : ramp(t, V('water', 'spins') - 0.3, 0.6), steam: isP ? 1 : ramp(t, V('water', 'steam') - 0.2, 0.6), water: 1 - 0.6 * slowU });
      S.render(ctx, W, H_, { dof: 0.33, focus: 4.0 });
    } else if (n === 'rods') { // boron rods slide in and out from above
      const ins = 0.45 + 0.3 * Math.sin((t - sh.t0) * 1.4);
      const { S, m } = coreShot(ctx, W, H_, t, sh, { rods: ins, power: 0.75 - 0.5 * ins, water: 1, boil: 0.3, neutrons: 1 - 0.6 * ins }, { h0: 1.2, h1: 1.0 });
      const tp = S.proj(m.top); ringHi(ctx, tp[0], tp[1], 80, ramp(t, V('rods', 'boron') - 0.1, 0.3));
    } else if (n === 'void') { // the positive void coefficient (and the western design, for contrast)
      const west = t > V('west', 'west') - 0.2, bu = west ? ramp(t, V('west', 'boils') - 0.2, 1.2) : ramp(t, V('steam', 'steam') - 0.2, 2.5);
      const { S, m } = coreShot(ctx, W, H_, t, sh, { rods: 0.4, power: west ? 0.6 - 0.45 * bu : 0.35 + 0.6 * bu, water: 1, boil: 0.15 + 0.75 * bu, neutrons: west ? 1 - 0.7 * bu : 0.4 + 0.6 * bu }, { r0: 2.6, r1: 2.2, a0: 0.2, a1: 0.6 });
      const mp = S.proj(m.mid); FX.spin(ctx, mp[0], mp[1], 170, ramp(t, V('loop', 'positive') - 0.1, 0.8) * (west ? 0 : 1), -t * 2, '#ff8a6a');
      ringHi(ctx, mp[0], mp[1], 150, ramp(t, V('west', 'slows') - 0.1, 0.3), '126,224,122');
      tally(ctx, W / 2, H_ * 0.14, west ? 'steam → less power' : 'steam → more power', ramp(t, V('steam', 'more') - 0.1, 0.3), 54, west ? '#7ee07a' : '#ff8a6a');
    } else if (n === 'night') { // April 1986: the plant at night; the test, delayed by about ten hours
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.5, 0], 13, 11, 2.2, 1.6, -0.6, -0.2, [0, 0, 0]);
      plantShot(ctx, W, H_, t, E, TG, { night: true });
      tally(ctx, W / 2, H_ * 0.14, '+10 h', ramp(t, V('delay', 'ten') - 0.1, 0.3));
    } else if (n === 'xenon') { // power falls, xenon chokes it, the rods are pulled out
      const pu = ramp(t, V('pull', 'pulled') - 0.2, 1.5);
      const { S, m } = coreShot(ctx, W, H_, t, sh, { rods: 0.6 - 0.55 * pu, power: 0.12 + 0.2 * pu, water: 1, boil: 0.1, xenon: ramp(t, V('drop', 'xenon') - 0.2, 0.8), neutrons: 0.2 }, { h0: 1.0, h1: 0.8 });
      const tp = S.proj(m.top); FX.no(ctx, tp[0], tp[1] - 60, 54, ramp(t, V('pull', 'rules') - 0.1, 0.25));
    } else if (n === 'rod') { // one control rod: boron above, graphite below, water at the bottom; the graphite enters first
      const tip = V('tip', 'first'), ins = 0.02 + 0.98 * H.clamp((t - tip) / 18) * (t > tip ? 1 : 0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 3.2, 2.7, 0.2, 0.1, 0.4, -0.2, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const r = rodRig(S, [0, 1.25, 0], ins, { hot: ramp(t, tip + 0.5, 0.6) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.9 });
      const gp = S.proj(r.graphite), wp = S.proj(r.water), bp = S.proj(r.boron), cb = S.proj(r.coreBot);
      ringHi(ctx, bp[0], bp[1], 60, ramp(t, V('flaw', 'boron') - 0.1, 0.3) * (1 - ramp(t, V('flaw', 'graphite') - 0.3, 0.3)), '126,224,122');
      ringHi(ctx, gp[0], gp[1], 70, ramp(t, V('flaw', 'graphite') - 0.1, 0.3) * (1 - ramp(t, V('why', 'water') - 0.3, 0.3)), '255,90,70');
      ringHi(ctx, wp[0], wp[1], 60, ramp(t, V('why', 'water') - 0.1, 0.3) * (1 - ramp(t, tip - 0.3, 0.3)), '122,208,255');
      ringHi(ctx, cb[0], cb[1], 90, ramp(t, V('surge', 'added') - 0.1, 0.3), '255,90,70');
      tally(ctx, W / 2, H_ * 0.14, Math.max(0, Math.round(t - V('slow', 'eighteen') + 0.5)) + ' s / 18 s', ramp(t, V('slow', 'eighteen') - 0.1, 0.3), 54);
    } else if (n === 'spike') { // power spikes, channels burst, rods jam
      const bu = ramp(t, V('burst', 'burst') - 0.2, 0.4);
      const { S, m } = coreShot(ctx, W, H_, t, sh, { rods: 0.3, power: 0.6 + 0.4 * ramp(t, V('spike', 'spiked') - 0.2, 0.6), water: 1, boil: 1, neutrons: 1 }, { r0: 3.0, r1: 2.6 });
      const mp = S.proj(m.mid); FX.sparks(ctx, mp[0], mp[1], (t * 2) % 1 * (bu > 0 ? 1 : 0), 4 + Math.floor(t * 2)); FX.heat(ctx, mp[0], mp[1] - 120, 200, ramp(t, V('spike', 'spiked'), 0.6), t);
      const tp = S.proj(m.top); FX.no(ctx, tp[0], tp[1] - 40, 46, ramp(t, V('burst', 'jammed') - 0.1, 0.25));
      flash = 0.3 * Math.exp(-Math.pow((t - V('spike', 'spiked')) * 4, 2));
    } else if (n === 'fixed') { // the redesigned rods (no water column at the bottom) and a faster shutdown
      const ins = ramp(t, V('fixes', 'redesigned') - 0.2, 2.5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 3.2, 2.7, 0.2, 0.1, -0.3, 0.3, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const r = rodRig(S, [0, 1.25, 0], ins, { fixed: true });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.9 });
      const cb = S.proj(r.coreBot); ringHi(ctx, cb[0], cb[1], 80, ramp(t, V('fixes', 'redesigned') - 0.1, 0.3), '126,224,122');
      tally(ctx, W / 2, H_ * 0.14, 'faster shutdown', ramp(t, V('fixes', 'faster') - 0.1, 0.3), 54, '#7ee07a');
    } else if (n === 'margin') { // richer fuel, extra absorbers, more rods kept in
      const { S, m } = coreShot(ctx, W, H_, t, sh, { rods: 0.15 + 0.35 * ramp(t, V('margin', 'minimum') - 0.2, 1.0), power: 0.5, water: 1, boil: 0.3, neutrons: 0.5 }, { a0: -0.4, a1: 0.2 });
      const mp = S.proj(m.mid); ringHi(ctx, mp[0], mp[1], 130, ramp(t, V('fuel2', 'tame') - 0.1, 0.3), '126,224,122');
    } else { // the review; the arch slides over reactor four; the lesson
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.6, 0], 15, 12, 2.6, 1.8, -0.7, -0.2, [0, 0, 0]);
      const au = ramp(t, V('arch', 'slid') - 0.5, 2.5);
      plantShot(ctx, W, H_, t, E, TG, { night: false, roof: false, arch: t > V('arch', 'today') - 0.3 ? au : null });
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: one big red AZ-5 button + "THIS BUTTON" ----------
  const THUMB = (ctx, W, H_) => {
    const S = Scene([0.62, 1.22, 0.62], [0.3, 1.0, -0.05], W, H_);
    azDesk(S, [0, 0.95, 0], { glow: 1 });
    S.render(ctx, W, H_, { bg: nightSky, dof: 0, shadows: false });
    finish(ctx, W, H_, 1);
    thumbText(ctx, [['THIS', 250, 170, '#ffffff'], ['BUTTON', 430, 170, '#ff6a5a']]);
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const hum = (t0, t1, g = 0.05) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 200, gain: g, a: 0.6, minor: true }); };
    const boom = (tt, g = 0.55) => { k.play('impact', tt, { gain: g }); k.noise(tt, { dur: 2.2, color: 'brown', filter: 'lowpass', f: [[0, 900], [2.2, 100]], gain: 0.14, a: 0.005 }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.25, minor: true });
    hum(0, tBoom); clunk(tPress, 1.2); k.tone(tPress + 0.2, { f: 420, dur: 1.2, type: 'square', gain: 0.05, a: 0.02 }); boom(tBoom);
    hum(ST('promise'), ST('night'));
    for (let i = 0; i < 8; i++) k.play('tick', V('fission', 'splits') + i * 0.14, { gain: 0.25, f: 1600 + i * 120, minor: true }); clunk(V('graphite', 'graphite'), 0.9);
    k.noise(V('water', 'boils'), { dur: 2.0, color: 'pink', filter: 'bandpass', f: 1600, q: 1.2, gain: 0.05, a: 0.4, minor: true }); k.noise(V('water', 'spins'), { dur: 2.0, filter: 'bandpass', f: [[0, 400], [2, 900]], q: 2, gain: 0.05, a: 0.3, minor: true });
    clunk(V('rods', 'slide'), 0.8); clunk(V('rods', 'slide') + 1.2, 0.6);
    k.play('error', V('loop', 'unstable'), { gain: 0.3 }); k.play('ding', V('west', 'slows'), { f: 'E6', gain: 0.25 });
    hum(ST('night'), ST('desk'), 0.06); k.play('blip', V('delay', 'ten'), { gain: 0.25 }); k.play('glitch', V('drop', 'xenon'), { gain: 0.25 });
    for (let i = 0; i < 8; i++) clunk(V('pull', 'pulled') + i * 0.15, 0.4); k.play('buzz', V('pull', 'rules'), { gain: 0.25 });
    k.noise(V('pumps', 'slowed'), { dur: 2.5, filter: 'bandpass', f: [[0, 900], [2.5, 300]], q: 2, gain: 0.06, a: 0.2 });
    clunk(tAZ, 1.3); k.tone(tAZ + 0.2, { f: 420, dur: 1.6, type: 'square', gain: 0.05, a: 0.02 });
    k.play('error', V('flaw', 'fatal'), { gain: 0.3 }); k.play('pop', V('why', 'water'), { gain: 0.25 }); k.play('riser', V('tip', 'first'), { gain: 0.3 }); k.play('buzz', V('surge', 'added'), { gain: 0.3 });
    for (let i = 0; i < 10; i++) k.play('count', V('slow', 'eighteen') + i * 0.3, { gain: 0.25, f: 1800, minor: true });
    k.noise(V('spike', 'spiked'), { dur: 2.0, filter: 'highpass', f: 2000, gain: 0.08, a: 0.3 }); k.play('stamp', V('burst', 'burst'), { gain: 0.35 }); k.play('stamp', V('burst', 'jammed'), { gain: 0.3 });
    boom(V('lid', 'threw'), 0.6); boom(V('second', 'second'), 0.5); k.noise(V('fire', 'graphite'), { dur: 3, filter: 'highpass', f: 2500, gain: 0.05, a: 0.4, minor: true });
    k.noise(V('toll', 'two'), { dur: ST('fixed') - V('toll', 'two'), color: 'brown', filter: 'lowpass', f: 160, gain: 0.05, a: 1.0 });
    k.play('ding', V('fixes', 'redesigned'), { f: 'E6', gain: 0.25 }); clunk(V('margin', 'minimum'), 0.8);
    k.noise(V('arch', 'slid') - 0.5, { dur: 2.5, filter: 'bandpass', f: 500, q: 2, gain: 0.05, a: 0.3, minor: true }); clunk(V('arch', 'slid') + 2.0, 1.0);
    k.play('success', V('lesson', 'button'), { f: 'C6', gain: 0.35 });
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
