  // ==================== "How 3 astronauts survived Apollo 13 with duct tape", 16:9 ====================
  // Space (the stack, the blast, the lifeboat, behind the Moon, letting go of the modules) <-> garage explainers (the oxygen
  // tank and fuel cell, the welded heater switches, the stir and the fire; the CO2 bench with the round socket, the square
  // cartridge and the duct-tape adapter; the redesigned tank) <-> the free-return path from above <-> the Pacific splashdown.

  const BEATS = window.SCRIPT;
  const SH = [
    ['hook', 0],
    ['problem', BEAT0('problem') - 0.15],
    ['promise', BEAT0('promise') - 0.15],
    ['ship', BEAT0('ship') - 0.15],
    ['tank', BEAT0('tanks') - 0.15],
    ['history', BEAT0('jolt') - 0.15],
    ['stir', BEAT0('stir') - 0.15],
    ['lost', BEAT0('lost') - 0.15],
    ['lifeboat', BEAT0('move') - 0.15],
    ['co2', BEAT0('co2') - 0.15],
    ['map', BEAT0('path') - 0.15],
    ['burn', BEAT0('burn') - 0.15],
    ['far', BEAT0('far') - 0.15],
    ['home', BEAT0('faster') - 0.15],
    ['sm', BEAT0('sm') - 0.15],
    ['splash', BEAT0('splash') - 0.15],
    ['fix', BEAT0('fix') - 0.15],
    ['finale', BEAT0('lesson') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const tBlast = V('hook', 'apart');
  // a space shot: the stack at the origin (scale 2), the Earth and the Moon far off
  const spaceShot = (ctx, W, H_, t, E, TG, o = {}, bodies = {}) => {
    const S = Scene(E, TG, W, H_);
    earth(S, bodies.earth || [-40, -6, -30], bodies.er || 5); moon(S, bodies.moon || [40, 4, -40], bodies.mr || 6);
    const st = apolloStack(S, [0, 0, 0], { s: 2, ...o });
    S.render(ctx, W, H_, spaceEnv);
    return { S, st };
  };
  const vent = (ctx, S, st, t, t0, k = 1) => { if (!st.bay || t < t0) return; const p = S.proj(st.bay); puffs(ctx, p[0], p[1], ((t - t0) / 2.2) % 1, 5, '235,240,250', 90 * k); puffs(ctx, p[0] + 30, p[1] + 10, ((t - t0) / 2.2 + 0.5) % 1, 6, '235,240,250', 90 * k); };

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'hook' || n === 'problem') { // the blast: the panel flies off, oxygen vents
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.6, 0, 0], 4.4, 3.8, 0.9, 0.6, n === 'hook' ? 0.3 : 0.9, n === 'hook' ? 0.7 : 1.2, [0, 0.1, 0]);
      const pu = ramp(t, tBlast - 0.05, 1.6);
      const { S, st } = spaceShot(ctx, W, H_, t, E, TG, { panel: pu, roll: 0.15 * Math.sin(t * 0.5) * (t > tBlast ? 1 : 0), cmLit: 1 });
      vent(ctx, S, st, t, tBlast);
      if (n === 'problem') { const cp = S.proj(st.cm); for (let k = 0; k < 3; k++) shock(ctx, cp[0], cp[1], ((t * 0.8 + k / 3) % 1), 140, '122,208,255'); }
      flash = 0.45 * Math.exp(-Math.pow((t - tBlast) * 5, 2));
    } else if (n === 'promise' || n === 'ship') { // the two spacecraft
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 4.6, 4.0, 1.0, 0.7, -0.6, -0.2, [0, 0.15, 0]);
      const { S, st } = spaceShot(ctx, W, H_, t, E, TG, { cmLit: 1, lmLit: 1 }, { moon: [30, 6, -26], mr: 8 });
      if (n === 'ship') { const cp = S.proj(st.cm), lp = S.proj(st.lm); ringHi(ctx, cp[0], cp[1], 90, ramp(t, V('ship', 'odyssey') - 0.1, 0.3)); ringHi(ctx, lp[0], lp[1], 110, ramp(t, V('ship', 'aquarius') - 0.1, 0.3), '126,224,122'); }
    } else if (n === 'tank' || n === 'history' || n === 'stir' || n === 'fix') { // the oxygen tank on the bench
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.45, 1.15, 0], 2.9, 2.5, 0.5, 0.35, n === 'stir' ? -0.4 : 0.4, n === 'stir' ? 0.1 : -0.1, [0, 0.05, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      let o = { t, oxygen: 1, power: 1, glass: 0.75 };
      let c = [0, 1.15, 0];
      if (n === 'tank') o = { t, oxygen: ramp(t, V('tanks', 'oxygen') - 0.2, 0.8), power: ramp(t, V('tanks', 'electricity') - 0.2, 0.8), glass: 0.75 };
      else if (n === 'history') { const tj = V('jolt', 'jolted'); c = [0, 1.15 + 0.12 * Math.max(0, Math.sin(Math.PI * H.clamp((t - tj + 0.3) / 0.3))) - 0.04 * ramp(t, tj, 0.1) * (1 - ramp(t, tj + 0.3, 0.3)), 0]; o = { t, glass: 0.75, heat: ramp(t, V('heaters', 'heater') - 0.2, 0.6), wires: ramp(t, V('cooked', 'cooked') - 0.3, 0.8) }; }
      else if (n === 'stir') { const ts = V('spark', 'sparked'), tb = V('blast', 'failed'); o = { t, glass: 0.75, wires: 1, fan: integ((u) => (u > V('stir', 'stir') - 0.2 ? 8 : 0), t, 1 / 20), fire: ramp(t, ts, 0.5) * (t < tb ? 1 : 0), burst: ramp(t, tb - 0.05, 0.4), oxygen: t < tb ? 1 : 0, power: t < tb ? 1 : 1 - ramp(t, tb, 1.5) }; flash = 0.35 * Math.exp(-Math.pow((t - tb) * 5, 2)); }
      else { const third = popU(t, V('fix', 'third') - 0.1, 0.4); o = { t, glass: 0.75, fans: false, steelWire: true, oxygen: 1, power: 1 }; if (third > 0) S.ico([-0.75, 1.15, 0.0], 0.32 * third, AP.silver, { sub: 1, gloss: 0.6 }); const bt = popU(t, V('battery', 'battery') - 0.1, 0.4); if (bt > 0) S.box((q) => add(q, [1.45, 1.05, 0.0]), 0.12 * bt, 0.15 * bt, 0.1 * bt, [60, 60, 70], { bevel: 0.15 }); }
      const m = o2Tank(S, c, t, o);
      if (n === 'fix' && t > V('fix', 'third') - 0.2) stand(S, [-0.75, 0, 0], 0.4, 0.35, 0.81);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.6 });
      if (n === 'history') {
        const sp = S.proj(m.switch); FX.sparks(ctx, sp[0], sp[1], H.clamp((t - V('volts', 'welded')) / 0.6), 4); ringHi(ctx, sp[0], sp[1], 50, ramp(t, V('volts', 'welded') - 0.1, 0.3), '255,90,70');
        tally(ctx, W * 0.35, H_ * 0.14, 'rated 28 V', ramp(t, V('volts', 'twenty-eight') - 0.1, 0.3) * (1 - ramp(t, V('cooked', 'inside') - 0.3, 0.3)), 54, '#7ee07a'); tally(ctx, W * 0.65, H_ * 0.14, 'supply 65 V', ramp(t, V('volts', 'sixty-five') - 0.1, 0.3) * (1 - ramp(t, V('cooked', 'inside') - 0.3, 0.3)), 54, '#ff8a6a');
        tally(ctx, W / 2, H_ * 0.14, '≈ 540 °C', ramp(t, V('cooked', 'five') - 0.1, 0.3), 54, '#ff8a6a');
        const tp = S.proj(m.tank); FX.heat(ctx, tp[0], tp[1] - 120, 160, ramp(t, V('cooked', 'temperatures') - 0.2, 0.6), t);
      }
      if (n === 'tank') { const cp = S.proj(m.cell); ringHi(ctx, cp[0], cp[1], 70, ramp(t, V('tanks', 'fuel') - 0.1, 0.3)); }
      if (n === 'stir') { const tp = S.proj(m.tank); FX.spin(ctx, tp[0], tp[1], 90, ramp(t, V('stir', 'stir') - 0.1, 0.6), -t * 6); FX.sparks(ctx, tp[0], tp[1], H.clamp((t - V('spark', 'sparked')) / 0.6), 5); shock(ctx, tp[0], tp[1], H.clamp((t - V('blast', 'failed')) / 0.7), 300); }
      if (n === 'fix') { const tp = S.proj(m.tank); ringHi(ctx, tp[0], tp[1], 110, ramp(t, V('fix', 'fans') - 0.1, 0.3) * (1 - ramp(t, V('fix', 'third') - 0.3, 0.3)), '126,224,122'); }
    } else if (n === 'lost') { // a side blown open, oxygen venting, the fuel cells dying; the landing is off
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.8, 0, 0], 4.2, 4.8, 0.6, 0.9, 1.0, 1.3, [0, 0.1, 0]);
      const moonOn = t > V('landing', 'moon') - 0.3;
      const { S, st } = spaceShot(ctx, W, H_, t, E, TG, { panel: 1, cmLit: 1 - ramp(t, V('lost', 'power') - 0.2, 0.6) }, moonOn ? { moon: [-6, 2, -14], mr: 5 } : {});
      vent(ctx, S, st, t, sh.t0 - 1, 0.6);
      tally(ctx, W / 2, H_ * 0.14, 'fuel cells ' + Math.max(0, 3 - Math.floor(3 * ramp(t, V('lost', 'died') - 0.2, 1.8))) + ' / 3', ramp(t, V('lost', 'fuel') - 0.1, 0.3) * (1 - ramp(t, V('landing', 'moon') - 0.3, 0.3)), 54, '#ff8a6a');
      if (moonOn) { const mp = S.proj([-6, 2, -14]); FX.no(ctx, mp[0], mp[1], 90, ramp(t, V('landing', 'off') - 0.1, 0.25)); }
    } else if (n === 'lifeboat') { // into Aquarius; Odyssey shut down; built for 2 x 2 days; cold
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.4, 0, 0], 4.0, 3.4, 0.7, 0.5, -0.5, 0.0, [0, 0.1, 0]);
      const { S, st } = spaceShot(ctx, W, H_, t, E, TG, { panel: 1, cmLit: 1 - ramp(t, V('move', 'shut') - 0.2, 0.5), lmLit: 1 });
      const lp = S.proj(st.lm); ringHi(ctx, lp[0], lp[1], 110, ramp(t, V('move', 'aquarius') - 0.1, 0.3) * (1 - ramp(t, V('two', 'built') - 0.3, 0.3)), '126,224,122');
      const big = t > V('two', 'three') - 0.2; tally(ctx, W / 2, H_ * 0.14, big ? '3 people · 4 days' : '2 people · 2 days', ramp(t, V('two', 'two') - 0.1, 0.3), 56, big ? '#ff8a6a' : '#ffd24a');
      const fr = ramp(t, V('cold', 'cabin') - 0.3, 1.2); if (fr > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(W / 2, H_ / 2, H_ * 0.35, W / 2, H_ / 2, H_ * 0.85); g.addColorStop(0, 'rgba(160,210,255,0)'); g.addColorStop(1, `rgba(190,225,255,${0.45 * fr})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
    } else if (n === 'co2') { // the square cartridge, the round socket, the duct-tape adapter
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.1, 1.15, 0], 2.8, 2.3, 0.6, 0.45, 0.4, -0.15, [0, 0.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const fix = ramp(t, V('fixed', 'fall') - 0.3, 2.0);
      const m = co2Bench(S, [0, 1.0, 0], t, { co2: (0.25 + 0.75 * ramp(t, V('round', 'filling') - 0.5, 4.0)) * (1 - 0.85 * fix), square: ramp(t, V('square', 'square') - 0.3, 1.0) * (1 - ramp(t, V('ground', 'engineers') - 0.2, 0.3)), parts: ramp(t, V('tape', 'plastic') - 0.3, 3.5), build: ramp(t, V('fixed', 'built') - 0.2, 1.6) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.4 });
      const sp = S.proj(m.socket), qp = S.proj(m.square), ap = S.proj(m.adapter);
      ringHi(ctx, sp[0], sp[1], 60, ramp(t, V('round', 'round') - 0.1, 0.3) * (1 - ramp(t, V('square', 'spares') - 0.3, 0.3)));
      FX.no(ctx, sp[0], sp[1] - 120, 50, ramp(t, V('square', 'fit') - 0.1, 0.25) * (1 - ramp(t, V('ground', 'engineers') - 0.3, 0.3)));
      ringHi(ctx, ap[0], ap[1], 140, ramp(t, V('fixed', 'fall') - 0.1, 0.3), '126,224,122'); void qp;
      tally(ctx, W / 2, H_ * 0.14, 'CO₂ ' + (fix > 0 ? '↓' : '↑'), ramp(t, V('co2', 'carbon') - 0.1, 0.3), 54, fix > 0 ? '#7ee07a' : '#ff8a6a');
    } else if (n === 'map' || n === 'home') { // the free-return path around the Moon
      const S = Scene([7, 30, 14], [7, 0, 0], W, H_);
      const isH = n === 'home', u = isH ? 1 : ramp(t, V('path', 'gravity') - 0.3, 2.0);
      freeReturn(S, t, u, { col: isH ? P.green : t < V('path', 'left') ? P.green : [236, 92, 70], home: isH ? ramp(t, V('faster', 'sped') - 0.3, 2.0) : 0 });
      S.render(ctx, W, H_, { ...spaceEnv, dof: 0 });
      if (!isH) { const lp = S.proj([14, 0.5, 2.5]); FX.no(ctx, lp[0], lp[1], 50, ramp(t, V('path', 'left') - 0.1, 0.25)); }
    } else if (n === 'burn') { // the descent engine fires
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.8, 0, 0], 4.2, 3.6, 0.5, 0.3, 1.2, 1.6, [0, 0.1, 0]);
      const { S, st } = spaceShot(ctx, W, H_, t, E, TG, { panel: 1, lmLit: 1, engine: ramp(t, V('burn', 'fired') - 0.1, 0.3) * (1 - ramp(t, V('burn', 'swing') - 0.2, 0.6)) });
      const ep = S.proj(st.engine); FX.heat(ctx, ep[0], ep[1], 120, ramp(t, V('burn', 'fired'), 0.4) * (1 - ramp(t, V('burn', 'swing') - 0.2, 0.6)), t, 'rgba(255,200,120,0.9)');
    } else if (n === 'far') { // behind the Moon
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 6, 5, 1.0, 0.6, 2.2, 2.6, [0, 0, 0]);
      spaceShot(ctx, W, H_, t, E, TG, { panel: 1, lmLit: 1 }, { moon: [-4, -1, -9], mr: 6, earth: [60, 8, 60], er: 2 });
    } else if (n === 'sm') { // let the service module go: a whole side missing; Odyssey wakes; let Aquarius go
      const sg = ramp(t, V('sm', 'go') - 0.2, 3.0), lg = ramp(t, V('bye', 'go') - 0.2, 3.0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.6, 0, 0], 4.6, 4.2, 0.6, 0.5, 0.9, 1.2, [0, 0.1, 0]);
      const { S, st } = spaceShot(ctx, W, H_, t, E, TG, { panel: 1, smOff: [-1.2 * sg, -0.1 * sg, 0.3 * sg], lmOff: [1.4 * lg, 0.2 * lg, -0.2 * lg], cmLit: ramp(t, V('wake', 'life') - 0.2, 0.6), lmLit: 1 }, { earth: [-14, -4, -10], er: 7 });
      const bp = S.proj(st.bay); ringHi(ctx, bp[0], bp[1], 90, ramp(t, V('sm', 'missing') - 0.1, 0.3) * (1 - ramp(t, V('wake', 'frozen') - 0.3, 0.3)), '255,90,70');
    } else if (n === 'splash' || n === 'finale') { // three parachutes over the Pacific, splashdown
      const ts = V('splash', 'splashed'), isF = n === 'finale', y = isF ? 0 : t < ts ? 0.2 + 1.6 * (ts - t) / Math.max(0.5, ts - sh.t0) : 0;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.0, 0], 5.6, 4.8, 0.6, 0.4, 0.4, 0.8, [0, 0.2, 0]);
      const S = seaScene(E, TG, W, H_, t, { clouds: true });
      splashCM(S, [0, y + 0.08, 0], { chutes: isF ? 0 : t < ts ? 1 : 1 - ramp(t, ts + 0.3, 1.2) });
      S.render(ctx, W, H_, { ...skyEnv, focus: 5 });
      const sp = S.proj([0, 0, 0]); if (!isF && t > ts) puffs(ctx, sp[0], sp[1], H.clamp((t - ts) / 1.6), 6, '250,252,255', 120);
      FX.confetti(ctx, W, H_, isF ? ramp(t, V('lesson', 'home'), 2.4) : ramp(t, V('splash', 'safe'), 2.4), t);
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: the square cartridge taped into the round socket + "DUCT TAPE?" ----------
  const THUMB = (ctx, W, H_) => {
    const S = Scene([0.4, 1.55, 1.15], [-0.1, 1.25, 0], W, H_);
    co2Bench(S, [0, 1.0, 0], 3, { parts: 1, build: 1 });
    S.render(ctx, W, H_, { bg: nightSky, dof: 0, shadows: false });
    finish(ctx, W, H_, 1);
    thumbText(ctx, [['SAVED BY', 250, 140, '#ffffff'], ['DUCT TAPE', 410, 170, '#ffd24a']], 1010);
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const hum = (t0, t1, g = 0.04) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 250, gain: g, a: 0.6, minor: true }); };
    const hiss = (t0, d, g = 0.08) => k.noise(t0, { dur: d, color: 'white', filter: 'highpass', f: 1800, gain: g, a: 0.05 });
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.25, minor: true });
    hum(0, tBlast); k.play('impact', tBlast, { gain: 0.55 }); k.play('thud', tBlast + 0.1, { f: 60, gain: 0.4 }); hiss(tBlast + 0.2, ST('promise') - tBlast);
    k.play('blip', V('problem', 'houston'), { gain: 0.3 }); k.play('blip', V('problem', 'problem'), { gain: 0.25 });
    hum(ST('promise'), ST('tank')); k.play('pop', V('ship', 'odyssey'), { gain: 0.3 }); k.play('pop', V('ship', 'aquarius'), { gain: 0.3 });
    k.noise(V('tanks', 'oxygen'), { dur: 2, filter: 'bandpass', f: 1200, q: 2, gain: 0.04, a: 0.4, minor: true }); k.play('blip', V('tanks', 'electricity'), { gain: 0.25 });
    k.play('thud', V('jolt', 'jolted'), { f: 120, gain: 0.35 }); k.noise(V('heaters', 'heater'), { dur: 2.5, filter: 'bandpass', f: 3000, q: 3, gain: 0.03, a: 0.5, minor: true });
    k.play('ding', V('volts', 'twenty-eight'), { f: 'C6', gain: 0.25 }); k.play('error', V('volts', 'sixty-five'), { gain: 0.3 }); k.play('glitch', V('volts', 'welded'), { gain: 0.3 });
    k.noise(V('cooked', 'cooked'), { dur: 1.5, filter: 'highpass', f: 3000, gain: 0.05, a: 0.2, minor: true });
    k.noise(V('stir', 'stir'), { dur: 2, filter: 'bandpass', f: 900, q: 3, gain: 0.05, a: 0.2, minor: true }); k.play('glitch', V('spark', 'sparked'), { gain: 0.35 }); k.noise(V('spark', 'fire'), { dur: 1.2, filter: 'highpass', f: 2500, gain: 0.06, a: 0.1 });
    k.play('impact', V('blast', 'failed'), { gain: 0.55 }); hiss(V('blast', 'failed') + 0.2, 2.5);
    for (let i = 0; i < 3; i++) k.play('error', V('lost', 'died') + i * 0.5, { gain: 0.2 }); k.play('buzz', V('landing', 'off'), { gain: 0.25 });
    k.play('thud', V('move', 'shut'), { f: 90, gain: 0.3 }); k.play('error', V('two', 'three'), { gain: 0.25 }); k.noise(V('cold', 'cabin'), { dur: 3, color: 'pink', filter: 'highpass', f: 3000, gain: 0.03, a: 1, minor: true });
    k.play('buzz', V('square', 'fit'), { gain: 0.3 }); clunk(V('square', 'square'), 0.8);
    for (const w of ['plastic', 'cardboard', 'spacesuit', 'sock', 'duct']) k.play('pop', V('tape', w), { gain: 0.3 });
    k.noise(V('tape', 'duct'), { dur: 1.2, filter: 'bandpass', f: 1800, q: 1.5, gain: 0.08, a: 0.02 }); k.play('success', V('fixed', 'fall'), { f: 'C6', gain: 0.4 });
    hum(ST('map'), ST('sm')); k.play('error', V('path', 'left'), { gain: 0.25 });
    k.noise(V('burn', 'fired'), { dur: 2.5, color: 'brown', filter: 'lowpass', f: 500, gain: 0.12, a: 0.1 }); k.play('ding', V('far', 'farther'), { f: 'E6', gain: 0.25 }); k.noise(V('faster', 'sped'), { dur: 1.5, color: 'brown', filter: 'lowpass', f: 500, gain: 0.1, a: 0.1 });
    clunk(V('sm', 'go'), 1.0); k.play('error', V('sm', 'missing'), { gain: 0.25 }); k.play('blip', V('wake', 'life'), { gain: 0.3 }); clunk(V('bye', 'go'), 0.8);
    k.noise(ST('splash'), { dur: V('splash', 'splashed') - ST('splash'), color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: 0.07, a: 0.4 }); k.play('impact', V('splash', 'splashed'), { gain: 0.4 });
    k.play('success', V('splash', 'safe'), { f: 'C6', gain: 0.5 }); k.play('sparkle', V('splash', 'safe') + 0.3, { gain: 0.4, n: 6 });
    clunk(V('fix', 'third'), 1.0); clunk(V('battery', 'battery'), 0.9);
    k.play('success', V('lesson', 'home'), { f: 'C6', gain: 0.5 }); k.play('sparkle', V('lesson', 'home') + 0.3, { gain: 0.4, n: 6 });
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
