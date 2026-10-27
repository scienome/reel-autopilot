  // ==================== "What really sank the Titanic (it wasn't just the iceberg)", 16:9 ====================
  // The liner at sea (sunset, then the moonless night), the turn seen from above, the glancing blow along the starboard bow
  // <-> garage explainers (the glass compartment model with bulkheads that stop short, riveted seams in steel and wrought
  // iron, one big rivet with slag) <-> the head-on what-if and the Arizona <-> what changed. Respectful: no people shown.

  const BEATS = window.SCRIPT;
  const SH = [
    ['hook', 0],
    ['sinking', V('hook', 'sank') - 0.15],
    ['berg', BEAT0('more') - 0.15],
    ['promise', BEAT0('promise') - 0.15],
    ['ship', BEAT0('ship') - 0.15],
    ['comp', BEAT0('compartments') - 0.15],
    ['night', BEAT0('night') - 0.15],
    ['turn', BEAT0('turn') - 0.15],
    ['scrape', BEAT0('scrape') - 0.15],
    ['slits', BEAT0('small') - 0.15],
    ['five', BEAT0('where') - 0.15],
    ['seams', BEAT0('rivets') - 0.15],
    ['slag', BEAT0('slag') - 0.15],
    ['pop', BEAT0('pop') - 0.15],
    ['tray', BEAT0('short') - 0.15],
    ['sank', BEAT0('sank') - 0.15],
    ['headon', BEAT0('headon') - 0.15],
    ['crumple', BEAT0('crumple') - 0.15],
    ['arizona', BEAT0('arizona') - 0.15],
    ['instinct', BEAT0('instinct') - 0.15],
    ['solas', BEAT0('solas') - 0.15],
    ['walls', BEAT0('hulls') - 0.15],
    ['finale', BEAT0('lesson') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const lv = (front, rest = 0) => { const a = []; for (let i = 0; i < 16; i++) a.push(typeof front === 'function' ? front(i) : i < front.length ? front[i] : rest); return a; };
  // a sea scene at sunset or at night
  const seaShot = (E, TG, W, H_, t, night) => { if (night) { const S = Scene(E, TG, W, H_); nightSea(S); return S; } return seaScene(E, TG, W, H_, t, { clouds: false }); };
  // the top-down turn: the ship comes along +x, an iceberg ahead; u turns the bow left (headOn: no turn, the bow crumples)
  const turnShot = (ctx, W, H_, t, sh, tTurn, headOn) => {
    const S = Scene([-1, 30, 9], [-1, 0, 0], W, H_); nightSea(S);
    const go = H.clamp((t - sh.t0) / (sh.t1 - sh.t0)), x = -12 + 12.5 * go, yaw = headOn ? 0 : 0.35 * ramp(t, tTurn, 2.5);
    const hit = headOn && x > -3.3;
    iceberg(S, [2, 0, 0.6], 0.8, 5);
    liner(S, [Math.min(x, hit ? -3.3 : x), 0, -0.3 * (yaw / 0.35) * go], { yaw, lights: 1, crumple: hit ? ramp(t, sh.t0 + 0.6 * (sh.t1 - sh.t0), 0.4) : 0 });
    S.render(ctx, W, H_, { ...nightEnv, dof: 0 });
  };

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'hook' || n === 'ship') { // the liner at sunset
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.8, 0], n === 'hook' ? 11 : 13, n === 'hook' ? 9.5 : 11, 1.6, 1.0, 0.7, 1.2, [0, 0, 0]);
      const S = seaShot(E, TG, W, H_, t, false); liner(S, [0, 0, 0], {});
      S.render(ctx, W, H_, { ...skyEnv, focus: 10 });
      if (n === 'ship') tally(ctx, W / 2, H_ * 0.14, '269 m', ramp(t, V('ship', 'two') - 0.1, 0.3));
    } else if (n === 'sinking' || n === 'sank') { // bow down in the dark sea; lifeboats on the water
      const deep = n === 'sank' ? 0.25 + 0.15 * ramp(t, sh.t0, 4) : 0.15;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.6, 0], 13, 11.5, 1.3, 1.0, -0.6, -0.3, [0, 0, 0]);
      const S = seaShot(E, TG, W, H_, t, true);
      liner(S, [0, -0.8 * deep, 0], { pitch: -deep, lights: n === 'sinking' ? 1 : 0.8 * (1 - ramp(t, V('sank', 'broke') - 0.2, 0.6)) + 0.1, boats: 2 });
      if (n === 'sank') for (let i = 0; i < 6; i++) S.box((q) => add(q, [-3 + i * 1.3, 0.04, 3.2 + (i % 2) * 0.8]), 0.14, 0.04, 0.05, TN.white, { bevel: 0.3 });
      S.render(ctx, W, H_, nightEnv);
    } else if (n === 'berg') { // the iceberg in the dark
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.0, 0], 5.6, 4.6, 0.8, 0.5, -0.4, 0.2, [0, 0.2, 0]);
      const S = Scene(E, TG, W, H_); nightSea(S); iceberg(S, [0, 0, 0], 1.0, 3);
      S.render(ctx, W, H_, nightEnv);
    } else if (n === 'promise' || n === 'comp' || n === 'five' || n === 'tray' || n === 'walls') { // the glass compartment model
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.2, 1.0, 0], 3.2, 2.8, 0.75, 0.6, n === 'tray' ? -0.2 : 0.5, n === 'tray' ? 0.3 : -0.1, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      let o = { t };
      if (n === 'promise') o = { t, levels: lv([1, 1, 1, 1, 1, 0.8, 0.5]), pitch: -0.12, spill: 1 };
      else if (n === 'comp') { const fu = ramp(t, V('four', 'four') - 0.3, 1.0); o = { t, walls: ramp(t, V('compartments', 'fifteen') - 0.3, 0.8), doors: ramp(t, V('doors', 'closed') - 0.2, 0.4), levels: lv([0.5 * fu, 0.5 * fu, 0.5 * fu, 0.5 * fu]) }; }
      else if (n === 'five') { const fu = ramp(t, V('where', 'five') - 0.2, 1.2); o = { t, levels: lv([0.6 * fu, 0.6 * fu, 0.6 * fu, 0.6 * fu, 0.6 * fu]), hi: [0, 1, 2, 3, 4] }; }
      else if (n === 'tray') { const tl = ramp(t, V('tilt', 'bow') - 0.3, 1.6), sp = ramp(t, V('spill', 'spilled') - 0.3, 0.6); const nx = ramp(t, V('spill', 'next') - 0.2, Math.max(1, BEATEND('doom') - V('spill', 'next'))); o = { t, line: ramp(t, V('short', 'top') - 0.2, 0.3), pitch: -0.13 * tl, spill: sp, levels: lv((i) => (i < 5 ? 0.55 + 0.4 * tl : i < 9 ? 0.9 * Math.max(0, H.clamp(nx * 4 - (i - 5))) : 0)) }; }
      else { o = { t, bh: 0.62 + 0.38 * ramp(t, V('hulls', 'taller') - 0.2, 0.6), levels: lv([0.4]) }; }
      const m = compModel(S, [0.2, 0.9, 0], o);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      if (n === 'comp') { const p = S.proj(m.bow); ringHi(ctx, p[0] - 120, p[1], 90, ramp(t, V('four', 'four') - 0.1, 0.3), '126,224,122'); }
      if (n === 'tray') { const p = S.proj(m.line); ringHi(ctx, p[0], p[1], 60, ramp(t, V('short', 'top') - 0.1, 0.3) * (1 - ramp(t, V('tilt', 'bow') - 0.3, 0.3)), '255,90,70'); }
      if (n === 'five') { const p = S.proj(m.bow); FX.no(ctx, p[0] - 100, p[1] - 140, 50, ramp(t, V('andrews', 'sink') - 0.1, 0.25)); }
    } else if (n === 'night') { // moonless and calm; 22 knots; the lookout sees it
      const [E, TG] = orbit(t, sh.t0, sh.t1, [2, 0.8, 0], 12, 10, 1.4, 1.1, -1.0, -0.6, [0, 0, 0]);
      const S = seaShot(E, TG, W, H_, t, true); liner(S, [0, 0, 0], { lights: 1 }); iceberg(S, [12, 0, 0.8], 0.8, 5);
      S.render(ctx, W, H_, nightEnv);
      tally(ctx, W * 0.3, H_ * 0.14, '22 knots', ramp(t, V('speed', 'twenty-two') - 0.1, 0.3) * (1 - ramp(t, V('spot', 'lookout') - 0.3, 0.3)));
      const ip = S.proj([12, 1.2, 0.8]); ringHi(ctx, ip[0], ip[1], 80, ramp(t, V('spot', 'iceberg') - 0.1, 0.3), '255,90,70');
      if (t > V('spot', 'thirty-seven') - 0.2) tally(ctx, W * 0.7, H_ * 0.14, Math.max(0, Math.ceil(37 - (t - V('spot', 'thirty-seven')) * 4)) + ' s', 1, 60, '#ff8a6a');
    } else if (n === 'turn' || n === 'instinct') { // from above: the turn (too slow); and the instinct to turn
      turnShot(ctx, W, H_, t, sh, n === 'turn' ? V('turn', 'hard') : sh.t0 + 0.8, false);
    } else if (n === 'headon') {
      turnShot(ctx, W, H_, t, sh, 0, true);
    } else if (n === 'scrape' || n === 'slits') { // along the starboard bow, below the waterline: a row of narrow openings
      const isS = n === 'slits', u = isS ? 1 : ramp(t, sh.t0 + 0.4, Math.max(1, sh.t1 - sh.t0 - 0.6));
      const [E, TG] = isS ? dolly(t, sh.t0, sh.t1, [2.6, 0.2, 2.2], [2.4, -0.05, 0.4], [2.2, 0.1, 1.8], [2.2, -0.05, 0.4]) : [[1.0, 0.4, 3.6], [2.0, 0.0, 0.3]];
      const S = Scene(E, TG, W, H_);
      S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 60], [-60, 0, 60]], [30, 50, 80], { bg: true, alpha: 1 });
      liner(S, [0, 0.2, 0], { lights: 1, gash: isS ? 1 : u });
      if (!isS) iceberg(S, [4.2 - 6 * u, -0.6, 1.05], 0.55, 7);
      S.render(ctx, W, H_, { ...nightEnv, dof: 0.33, focus: isS ? 2.0 : 3.4 });
      if (!isS) { const sp = S.proj([4.2 - 6 * u + 0.2, 0.0, 0.5]); FX.sparks(ctx, sp[0], sp[1], (t * 2.5) % 1, 5 + Math.floor(t * 2.5)); }
      else { const sp = S.proj([2.6, -0.05, 0.43]); ringHi(ctx, sp[0], sp[1], 110, ramp(t, V('small', 'narrow') - 0.1, 0.3)); tally(ctx, W / 2, H_ * 0.14, '≈ 1 m²', ramp(t, V('small', 'one') - 0.1, 0.3)); }
    } else if (n === 'seams' || n === 'pop') { // steel rivets (machine) vs wrought iron (by hand); the heads snap, the seam opens
      const isP = n === 'pop';
      const [E, TG] = isP ? orbit(t, sh.t0, sh.t1, [0.7, 1.15, 0], 2.0, 1.7, 0.2, 0.15, -0.3, 0.2, [0, 0, 0]) : orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 3.3, 2.8, 0.35, 0.25, 0.3, -0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      if (!isP) seam(S, [-0.7, 1.15, 0], { iron: false });
      seam(S, [0.7, 1.15, 0], { iron: true, pop: isP ? ramp(t, V('pop', 'snap') - 0.2, 0.8) : 0, water: isP ? ramp(t, V('pop', 'poured') - 0.3, 0.6) : 0, t });
      S.render(ctx, W, H_, { dof: 0.33, focus: isP ? 1.8 : 3.0 });
      if (!isP) { const lp = S.proj([-0.7, 1.17, 0.08]), rp = S.proj([0.7, 1.17, 0.08]); ringHi(ctx, lp[0], lp[1], 110, ramp(t, V('steel', 'steel') - 0.1, 0.3), '126,224,122'); ringHi(ctx, rp[0], rp[1], 110, ramp(t, V('iron', 'wrought') - 0.1, 0.3), '255,90,70'); tally(ctx, W / 2, H_ * 0.14, '≈ 3,000,000 rivets', ramp(t, V('three', 'three') - 0.1, 0.3) * (1 - ramp(t, V('steel', 'middle') - 0.3, 0.3))); }
      else { const pp = S.proj([0.7, 1.17, 0.1]); FX.sparks(ctx, pp[0], pp[1], H.clamp((t - V('pop', 'snap')) / 0.6), 4); }
    } else if (n === 'slag') { // one big rivet, cut open: slag streaks
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.3, 1.15, 0], 1.8, 1.4, 0.25, 0.15, 1.3, 1.0, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      bigRivet(S, [0, 1.15, 0], { slag: true, snap: ramp(t, V('slag', 'brittle') - 0.1, 0.4) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.6 });
      const sp = S.proj([0, 1.15, 0]); ringHi(ctx, sp[0], sp[1], 100, ramp(t, V('slag', 'slag') - 0.1, 0.3), '255,90,70');
    } else if (n === 'crumple' || n === 'arizona') { // head-on: the bow crumples, and the ship survives
      const isA = n === 'arizona';
      const [E, TG] = orbit(t, sh.t0, sh.t1, [2.5, 0.8, 0], 8, 7, 1.0, 0.8, 0.6, 0.9, [0, 0, 0]);
      const S = seaShot(E, TG, W, H_, t, !isA);
      liner(S, [isA ? -0.3 * (t - sh.t0) : 0, 0, 0], { s: isA ? 0.7 : 1, funnels: isA ? 1 : 4, crumple: isA ? 1 : ramp(t, V('crumple', 'crumpled') - 0.2, 0.5), lights: isA ? 0 : 1, boats: isA ? 2 : 8 });
      if (!isA) iceberg(S, [4.45, 0, 0], 0.8, 5);
      S.render(ctx, W, H_, isA ? { ...skyEnv, focus: 7 } : nightEnv);
      if (!isA) { const bp = S.proj([3.6, 0.3, 0]); FX.sparks(ctx, bp[0], bp[1], H.clamp((t - V('crumple', 'crumpled')) / 0.6), 4); tally(ctx, W / 2, H_ * 0.14, '2 of 16 flooded', ramp(t, V('crumple', 'two') - 0.1, 0.3), 54, '#7ee07a'); }
      else tally(ctx, W / 2, H_ * 0.14, '1879', ramp(t, V('arizona', 'eighteen') - 0.1, 0.3));
    } else if (n === 'solas') { // lifeboats for all, radio day and night, the ice patrol
      const pat = t > V('patrol', 'patrol') - 0.3;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.8, 0], pat ? 16 : 11, pat ? 14 : 9.5, 1.6, 1.2, -0.3, 0.2, [0, 0, 0]);
      const S = seaShot(E, TG, W, H_, t, false);
      const L = liner(S, [0, 0, 0], { boats: Math.round(8 + 32 * ramp(t, V('boats', 'lifeboat') - 0.2, 1.0)) });
      if (pat) iceberg(S, [8, 0, -6], 1.2, 9);
      S.render(ctx, W, H_, { ...skyEnv, focus: 10 });
      const mp = S.proj(L.mast); if (t > V('boats', 'radios') - 0.1) for (let k = 0; k < 3; k++) shock(ctx, mp[0], mp[1], ((t * 0.8 + k / 3) % 1), 100, '122,208,255');
      if (pat) { const ip = S.proj([8, 1.4, -6]); ringHi(ctx, ip[0], ip[1], 70, ramp(t, V('patrol', 'patrol') - 0.1, 0.3)); }
    } else { // finale: dawn, a calm sea, an iceberg far off
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.0, 0], 14, 11, 1.4, 1.0, 0.4, 0.8, [0, 0, 0]);
      const S = seaShot(E, TG, W, H_, t, false); iceberg(S, [-6, 0, -4], 1.4, 11);
      S.render(ctx, W, H_, { ...skyEnv, focus: 12 });
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: one big riveted seam with its rivet heads popping + "THE RIVETS?" ----------
  const THUMB = (ctx, W, H_) => {
    const S = Scene([0.95, 1.3, 1.25], [0.55, 1.18, 0], W, H_);
    seam(S, [0.7, 1.15, 0], { iron: true, pop: 0.45, water: 1, t: 1 });
    S.render(ctx, W, H_, { bg: nightSky, dof: 0, shadows: false });
    finish(ctx, W, H_, 1);
    thumbText(ctx, [['IT WAS', 250, 150, '#ffffff'], ['THE RIVETS?', 420, 160, '#ffd24a']]);
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const sea = (t0, t1, g = 0.06) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'pink', filter: 'bandpass', f: 600, q: 0.4, gain: g, a: 0.8, minor: true }); };
    const engine = (t0, t1, g = 0.06) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 180, gain: g, a: 0.6, minor: true }); };
    const water = (t0, d = 1.5) => k.noise(t0, { dur: d, color: 'pink', filter: 'bandpass', f: 500, q: 0.6, gain: 0.09, a: 0.1 });
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.25, minor: true });
    sea(0, ST('promise')); engine(0, ST('sinking')); k.play('thud', V('hook', 'sank'), { f: 60, gain: 0.35 });
    sea(ST('ship'), ST('comp')); k.play('ding', V('ship', 'two'), { f: 'A5', gain: 0.2 });
    for (let i = 0; i < 6; i++) clunk(V('compartments', 'fifteen') + i * 0.12, 0.5); for (let i = 0; i < 4; i++) clunk(V('doors', 'closed') + i * 0.1, 0.6); water(V('four', 'four'));
    sea(ST('night'), ST('scrape'), 0.05); engine(ST('night'), ST('scrape'));
    k.tone(V('spot', 'iceberg'), { f: 880, dur: 0.25, type: 'triangle', gain: 0.1 }); k.tone(V('spot', 'iceberg') + 0.35, { f: 880, dur: 0.25, type: 'triangle', gain: 0.1 }); k.tone(V('spot', 'iceberg') + 0.7, { f: 880, dur: 0.25, type: 'triangle', gain: 0.1 });
    k.noise(V('turn', 'hard'), { dur: 2.0, color: 'brown', filter: 'bandpass', f: 300, q: 1, gain: 0.07, a: 0.3 });
    k.noise(ST('scrape') + 0.4, { dur: Math.max(1, ST('slits') - ST('scrape') - 0.4), filter: 'bandpass', f: [[0, 1800], [2, 900], [4, 1600]], q: 2, gain: 0.12, a: 0.1 }); k.play('impact', ST('scrape') + 0.4, { gain: 0.4 });
    k.play('pop', V('small', 'narrow'), { gain: 0.3 }); water(V('where', 'five')); k.play('error', V('where', 'survive'), { gain: 0.3 });
    clunk(V('steel', 'steel'), 1.0); for (let i = 0; i < 6; i++) k.play('tick', V('iron', 'hammered') + i * 0.18, { gain: 0.35, f: 1200 }); k.play('glitch', V('slag', 'slag'), { gain: 0.25 }); k.play('stamp', V('slag', 'brittle'), { gain: 0.3 });
    for (let i = 0; i < 6; i++) k.play('stamp', V('pop', 'snap') + i * 0.09, { gain: 0.2 }); water(V('pop', 'poured'), 2);
    k.play('error', V('short', 'top'), { gain: 0.25 }); water(V('spill', 'spilled'), 3); k.play('thud', V('doom', 'nothing'), { f: 60, gain: 0.3 });
    sea(ST('sank'), ST('headon'), 0.05);
    k.play('impact', ST('headon') + 0.6 * (ST('crumple') - ST('headon')), { gain: 0.35 }); k.play('stamp', V('crumple', 'crumpled'), { gain: 0.35 }); k.play('ding', V('crumple', 'survive'), { f: 'E6', gain: 0.3 });
    sea(ST('arizona'), ST('instinct')); k.play('success', V('arizona', 'port'), { f: 'C6', gain: 0.3 });
    sea(ST('solas'), DURATION, 0.06); for (let i = 0; i < 6; i++) k.play('pop', V('boats', 'lifeboat') + i * 0.15, { gain: 0.25, minor: true }); k.play('blip', V('boats', 'radios'), { gain: 0.3 }); k.play('blip', V('boats', 'radios') + 0.4, { gain: 0.25 });
    k.play('ding', V('patrol', 'patrol'), { f: 'A5', gain: 0.25 }); clunk(V('hulls', 'taller'), 0.8);
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
