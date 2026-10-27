  // ==================== "Why plane windows are round" (the de Havilland Comet), 16:9 ====================
  // Sky beside a big round window <-> the Comet over land and sea (three break-ups) <-> garage explainers (pressurised
  // cabin, fatigue rig, skin panels with stress lines, the Farnborough water tank, the roof-window wreckage) <-> the
  // Comet 4 crossing the Atlantic. Times come from V().

  const BEATS = window.SCRIPT;
  const SH = [
    ['hook', 0],
    ['breakup', BEAT0('crack') - 0.15],
    ['reveal', BEAT0('promise') - 0.15],
    ['apron', BEAT0('first') - 0.15],
    ['climb', BEAT0('fast') - 0.15],
    ['pressure', BEAT0('pump') - 0.15],
    ['clip', BEAT0('clip') - 0.15],
    ['corner', BEAT0('where') - 0.15],
    ['panels', BEAT0('flow') - 0.15],
    ['openings', BEAT0('openings') - 0.15],
    ['rivets', BEAT0('rivets') - 0.15],
    ['storm', BEAT0('calcutta') - 0.15],
    ['elba', BEAT0('elba') - 0.15],
    ['grounded', BEAT0('grounded') - 0.15],
    ['naples', BEAT0('naples') - 0.15],
    ['tank', BEAT0('tank') - 0.15],
    ['found', BEAT0('found') - 0.15],
    ['fix', BEAT0('fix') - 0.15],
    ['comet4', BEAT0('skin') - 0.15],
    ['atlantic', BEAT0('atlantic') - 0.15],
    ['finale', BEAT0('lesson') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];

  // the round-window close-up beside a modern cabin (hook and finale)
  const roundSide = (ctx, W, H_, t, sh, hiT) => {
    const [E, TG] = dolly(t, sh.t0, sh.t1, [-1.6, SKY_Y + 0.45, 2.7], [-0.6, SKY_Y + 0.25, 0.6], [0.9, SKY_Y + 0.4, 2.3], [1.6, SKY_Y + 0.25, 0.6]);
    const S = skyScene(E, TG, W, H_, t);
    cabin(S, [0, SKY_Y, 0], { len: 12, r: 1.0, nwin: 14, wsz: [0.15, 0.2], k: 1, t });
    S.render(ctx, W, H_, { ...skyEnv, focus: 2.4 });
    if (hiT != null) { const a = 0.32, wp = S.proj([-12 / 2 + (12 * 7.5) / 14, SKY_Y + Math.sin(a), Math.cos(a)]); ringHi(ctx, wp[0], wp[1], 120, ramp(t, hiT - 0.1, 0.3)); }
  };
  // a Comet over the sea that tears apart at time tb (the forward fuselage first); returns the break point on screen
  const breakShot = (ctx, W, H_, t, E, TG, tb, o = {}) => {
    const S = o.storm ? Scene(E, TG, W, H_) : seaScene(E, TG, W, H_, t, { island: o.island });
    if (o.storm) { landBelow(S); cloudBank(S, 0, -6, 4.0, 18, 3, 40, t * 3, [120, 112, 130]); cloudBank(S, 0, 10, 3.0, 10, 8, 40, t * 3, [110, 104, 122]); }
    const b = ramp(t, tb - 0.1, 2.6), shake = o.storm ? 0.05 * Math.sin(t * 13) * (1 - b) : 0;
    const P0 = [0, SKY_Y - 2.2 * b * b, 0];
    let bp = null;
    if (b < 0.98) { const c = comet(S, P0, { brk: b, pitch: -0.04 * b + shake, roll: shake * 0.6, burn: 1 - b }); bp = c.brk; }
    if (b > 0) { const r = H.rng(7); for (let i = 0; i < 9; i++) S.ico(add(P0, [0.5 + r.range(-0.6, 0.9) * b * 2, r.range(-1.2, 0.3) * b * 2, r.range(-0.8, 0.8) * b * 2]), 0.03 + r() * 0.04, CM.belly, { sub: 0, noShadow: true }); }
    S.render(ctx, W, H_, o.storm ? { bg: stormSky, dof: 0.33, shadows: false, dofGap: 30 } : skyEnv);
    if (bp) { const p = S.proj(bp); puffs(ctx, p[0], p[1], H.clamp((t - tb) / 1.8), 4, '235,235,240', 90); FX.sparks(ctx, p[0], p[1], H.clamp((t - tb) / 0.6), 6); return p; }
    return null;
  };

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'hook') { // a round window in the sky
      roundSide(ctx, W, H_, t, sh, V('hook', 'round'));
    } else if (n === 'breakup') { // the first jet airliner tearing open
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 6.2, 5.6, 0.9, 0.6, 0.9, 1.3, [0.2, -0.4, 0]);
      breakShot(ctx, W, H_, t, E, TG, V('crack', 'tearing'));
      flash = 0.2 * Math.exp(-Math.pow((t - V('crack', 'tearing')) * 4, 2));
    } else if (n === 'reveal') { // the Comet, whole again, over the land at sunset
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 5.6, 4.6, 0.8, 0.5, -0.9, -0.4, [0.1, 0.1, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const c = comet(S, [0, SKY_Y, 0], { burn: 1 });
      S.render(ctx, W, H_, skyEnv);
      const p = S.proj(c.T([0.5, 0.05, 0.16])); ringHi(ctx, p[0], p[1], 70, ramp(t, V('promise', 'corners') - 0.1, 0.3) * (1 - ramp(t, V('promise', 'comet') - 0.3, 0.3)));
      flash = 0.15 * Math.exp(-Math.pow((t - V('promise', 'comet')) * 5, 2));
    } else if (n === 'apron') { // 1952: the first jet airliner on the apron
      const [E, TG] = dolly(t, sh.t0, sh.t1, [-4.4, 1.1, 4.6], [0.2, 0.55, 0], [-3.0, 0.9, 3.4], [0.4, 0.5, 0]);
      const S = Scene(E, TG, W, H_); cmField(S);
      comet(S, [0, 0.46, 0], { gear: 1, burn: 0.3 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 4.5 });
    } else if (n === 'climb') { // above the weather; the air is too thin to breathe
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 5.4, 4.8, 0.3, 0.9, 1.6, 2.1, [0, 0.2, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const c = comet(S, [0, SKY_Y + 0.2 * Math.sin(t * 0.6), 0], { burn: 1, pitch: 0.06 });
      S.render(ctx, W, H_, skyEnv);
      const wp = S.proj(c.T([0.2, 0.05, 0.16])); ringHi(ctx, wp[0], wp[1], 80, ramp(t, V('quiet', 'windows') - 0.1, 0.3) * (1 - ramp(t, V('thin', 'thin') - 0.2, 0.3)));
      const fp = S.proj(c.T([0.6, 0.6, 0])); FX.no(ctx, fp[0], fp[1], 56, ramp(t, V('thin', 'breathe') - 0.1, 0.25) * (1 - ramp(t, V('thin', 'pressurised') - 0.2, 0.3)));
    } else if (n === 'pressure') { // the cabin as a metal balloon: air in, force out, swelling and relaxing
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 3.6, 3.1, 0.6, 0.45, 0.55, -0.2, [0, 0.05, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const br = ramp(t, V('breathe', 'swells') - 0.2, 0.5), fast = ramp(t, V('cycle', 'thousands') - 0.3, 0.4);
      const swell = 0.06 * br * (0.5 - 0.5 * Math.cos((t - V('breathe', 'swells')) * (2.2 + 9 * fast)));
      cabin(S, [0, 1.25, 0], { len: 1.8, r: 0.42, swell, k: 0.2, t, glass: 0.55 * ramp(t, V('pump', 'pumped') - 0.3, 0.6), air: ramp(t, V('pump', 'air') - 0.2, 0.8), press: popU(t, V('push', 'pushes') - 0.1, 0.5) * (1 - 0.4 * br) + swell * 6 });
      for (const sx of [-0.55, 0.55]) stand(S, [sx, 0, 0], 0.3, 0.32, 0.8);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.2 });
      const gp = S.proj([0, 1.75, 0]); tally(ctx, gp[0], gp[1] - 90, '× ' + Math.max(1, Math.round(3000 * Math.pow(ramp(t, V('cycle', 'thousands') - 0.1, 1.6), 2))).toLocaleString('en-US'), ramp(t, V('cycle', 'once') - 0.1, 0.2));
    } else if (n === 'clip') { // fatigue: bend once (fine), back and forth (snap); then a smaller force, again and again
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.0, 0], 2.6, 2.2, 0.55, 0.4, -0.4, 0.3, [0, 0.15, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const second = t >= V('fatigue', 'fatigue') - 0.2, tb = V('clip', 'back');
      let bend, crack, snap = 0;
      if (!second) { const once = 0.5 * Math.sin(Math.PI * H.clamp((t - V('clip', 'once') + 0.3) / 0.8)); const osc = 0.55 * Math.sin((t - tb) * 9) * ramp(t, tb - 0.2, 0.2); bend = t < tb - 0.2 ? once : osc; crack = ramp(t, tb, V('clip', 'snaps') - tb); snap = H.clamp((t - V('clip', 'snaps') + 0.1) / 0.9); }
      else { bend = 0.22 * Math.sin((t - V('fatigue', 'force')) * 7) * ramp(t, V('fatigue', 'force') - 0.3, 0.3); crack = ramp(t, V('fatigue', 'repeated'), Math.max(0.5, V('fatigue', 'grow') - V('fatigue', 'repeated'))); }
      fatigueRig(S, [0, 0.8, 0], bend, crack, snap);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.3 });
      const rp = S.proj([0, 1.02, 0]); if (!second) FX.sparks(ctx, rp[0], rp[1], H.clamp((t - V('clip', 'snaps')) / 0.6), 3);
      if (second) ringHi(ctx, rp[0], rp[1], 60, ramp(t, V('fatigue', 'crack') - 0.1, 0.3));
    } else if (n === 'corner') { // sharp corners
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.3, 1.4, 2.2], [0, 1.28, 0], [0.15, 1.35, 1.5], [0.05, 1.28, 0]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      skinPanel(S, [0, 1.28, 0], { k: 0.02, t, hot: ramp(t, V('where', 'sharp') - 0.1, 0.3), flow: 0.6 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.6 });
    } else if (n === 'panels') { // round hole vs square hole: lines of force, hot spots, a crack that feeds itself
      const look = t < V('square', 'sharp') - 0.3 ? -1 : 1, lu = ramp(t, V('square', 'sharp') - 0.6, 0.8);
      const [E0, T0] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 3.2, 2.9, 0.25, 0.15, -0.15, 0.12, [0, 0.0, 0]);
      const TG = add(T0, [-0.5 + 1.0 * lu, 0, 0]), E = add(E0, [-0.3 + 0.6 * lu, 0, -0.4]); void look;
      const S = Scene(E, TG, W, H_); garage(S);
      const fl = ramp(t, V('flow', 'stress') - 0.2, 0.6);
      skinPanel(S, [-0.6, 1.25, 0], { k: 1, t, flow: fl, hot: 0.6 * ramp(t, V('round', 'shared') - 0.3, 0.4) });
      skinPanel(S, [0.6, 1.25, 0], { k: 0.02, t, flow: ramp(t, V('square', 'sharp') - 0.3, 0.5), hot: ramp(t, V('square', 'piles') - 0.1, 0.4), crack: ramp(t, V('grow', 'crack') - 0.1, Math.max(0.6, V('grow', 'faster') - V('grow', 'crack') + 0.4)), seed: 4 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
    } else if (n === 'openings') { // the Comet's openings: windows, hatches, the roof window
      const [E, TG] = dolly(t, sh.t0, sh.t1, [1.1, SKY_Y + 0.75, 1.5], [0.4, SKY_Y + 0.05, 0], [0.9, SKY_Y + 0.85, 1.1], [0.55, SKY_Y + 0.1, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const c = comet(S, [0, SKY_Y, 0], { burn: 1, adf: ramp(t, V('openings', 'roof') - 0.1, 0.2) });
      S.render(ctx, W, H_, { ...skyEnv, focus: 1.6 });
      const wp = S.proj(c.T([0.3, 0.045, 0.16])); ringHi(ctx, wp[0], wp[1], 70, ramp(t, V('openings', 'windows') - 0.1, 0.3) * (1 - ramp(t, V('openings', 'roof') - 0.2, 0.2)));
      const ap = S.proj(c.adf); ringHi(ctx, ap[0], ap[1], 60, ramp(t, V('openings', 'roof') - 0.1, 0.3), '255,90,70');
    } else if (n === 'rivets') { // punched rivet holes: tiny flaws at the corner
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.55, 1.5, 1.4], [0.18, 1.4, 0], [0.4, 1.46, 1.05], [0.18, 1.4, 0]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      skinPanel(S, [0, 1.28, 0], { k: 0.02, t, hot: 0.8, crack: 0.25 * ramp(t, V('rivets', 'flaws') - 0.2, 0.6), seed: 9 });
      for (let i = 0; i < 5; i++) S.ico([0.12 + i * 0.045, 1.42, 0.016], 0.008, [90, 96, 110], { sub: 0, noShadow: true });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.3 });
      const rp = S.proj([0.2, 1.42, 0.02]); FX.sparks(ctx, rp[0], rp[1], H.clamp((t - V('rivets', 'punched')) / 0.6), 12);
    } else if (n === 'storm') { // May 1953, near Calcutta, in a violent storm
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 6.4, 5.8, 0.6, 0.5, -1.1, -0.8, [0.2, -0.2, 0]);
      breakShot(ctx, W, H_, t, E, TG, V('calcutta', 'storm') + 0.6, { storm: true });
      flash = 0.35 * Math.exp(-Math.pow((t - V('calcutta', 'violent')) * 6, 2)) + 0.25 * Math.exp(-Math.pow((t - V('calcutta', 'calcutta')) * 6, 2));
    } else if (n === 'elba') { // January 1954, over the sea near Elba
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 7.0, 6.2, 1.0, 0.7, 0.5, 0.9, [0.2, -0.6, 0]);
      breakShot(ctx, W, H_, t, E, TG, V('elba', 'apart'), { island: [-30, -60] });
    } else if (n === 'grounded') { // grounded, checked, cleared
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.6, 1.8], 6.2, 5.4, 1.2, 0.9, -0.5, 0.0, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); cmField(S);
      comet(S, [-1.2, 0.46, 0], { gear: 1 }); comet(S, [1.6, 0.46, 3.2], { gear: 1, yaw: 0.2 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 6 });
      const p = S.proj([-1.2, 1.3, 0]); FX.no(ctx, p[0], p[1], 56, ramp(t, V('grounded', 'grounded') - 0.1, 0.25) * (1 - ramp(t, V('grounded', 'cleared') - 0.2, 0.3)));
    } else if (n === 'naples') { // two weeks later, near Naples; then only the sea
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 6.6, 7.6, 0.5, 1.6, -0.3, 0.2, [0.2, -0.8, 0]);
      breakShot(ctx, W, H_, t, E, TG, V('naples', 'broke'));
    } else if (n === 'tank') { // the Farnborough water tank: pump up, let down, thousands of times, then the split
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 4.2, 3.4, 0.9, 0.6, -0.5, 0.35, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const cyc = ramp(t, V('flights', 'pumped') - 0.2, 0.4) * (1 - ramp(t, V('burst', 'split') - 0.2, 0.3)), ph = (t - V('flights', 'pumped')) * 5.5;
      const sw = 0.05 * cyc * (0.5 - 0.5 * Math.cos(ph)), cr = ramp(t, V('burst', 'split') - 0.2, 0.7);
      waterTank(S, [0, 0.95, 0], t, { water: ramp(t, V('tank', 'water') - 0.3, 1.0), swell: sw + 0.02 * cr, gauge: 0.15 + 0.6 * sw / 0.05, flow: cyc, fast: true, crack: cr, hot: 0.8 * cr, k: 0.12 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
      const wp = S.proj([0, 1.3, 0.37]); bubbles(ctx, wp[0], wp[1], ramp(t, V('burst', 'split') - 0.1, 2.5), 5, 70, 180);
      const gp = S.proj([0, 1.95, 0]); tally(ctx, gp[0], gp[1] - 40, '× ' + Math.round(3000 * ramp(t, V('flights', 'again') - 0.2, Math.max(1, V('burst', 'split') - V('flights', 'again')))).toLocaleString('en-US'), ramp(t, V('flights', 'again') - 0.2, 0.3));
      const xp = S.proj([1.2, 1.5, 0]); FX.no(ctx, xp[0], xp[1], 50, ramp(t, V('water', 'explode') - 0.1, 0.25) * (1 - ramp(t, V('flights', 'pumped') - 0.3, 0.3)));
      flash = 0.18 * Math.exp(-Math.pow((t - V('burst', 'split')) * 5, 2));
    } else if (n === 'found') { // the wreckage near Elba: the crack started at the roof window's corner
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 2.4, 1.9, 0.35, 0.2, -0.35, 0.15, [0, 0.03, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      skinPanel(S, [0, 1.28, 0], { k: 0.02, t, win: [0.18, 0.24], crack: 1, hot: ramp(t, V('found', 'corner') - 0.2, 0.4), seed: 11, size: [0.5, 0.34] });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
      const cp = S.proj([0.09, 1.36, 0.02]); ringHi(ctx, cp[0], cp[1], 60, ramp(t, V('found', 'corner') - 0.1, 0.3), '255,90,70');
    } else if (n === 'fix') { // the fix: the corner rounds off and the stress flows smoothly
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.28, 0], 2.3, 1.9, 0.25, 0.15, 0.35, -0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const k = ramp(t, V('fix', 'rounded') - 0.2, 1.0);
      skinPanel(S, [0, 1.28, 0], { k: 0.02 + 0.98 * k, t, flow: 1, hot: 1 - 0.55 * k });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
    } else if (n === 'comet4') { // thicker skin, rounded windows, crack-stopper straps; full-airframe testing; today's windows
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.25, 0], 3.5, 2.8, 0.55, 0.35, -0.6, 0.4, [0, 0.05, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const fx = ramp(t, V('test', 'flexing') - 0.2, 0.4) * (1 - ramp(t, V('today', 'today') - 0.3, 0.3)), sw = 0.04 * fx * (0.5 - 0.5 * Math.cos((t - V('test', 'flexing')) * 6));
      cabin(S, [0, 1.25, 0], { len: 1.8, r: 0.42, k: 0.85 + 0.15 * ramp(t, V('skin', 'rounded') - 0.2, 0.5), t, straps: t > V('stopper', 'straps') - 0.15, swell: sw, press: fx * 0.6 });
      for (const sx of [-0.55, 0.55]) stand(S, [sx, 0, 0], 0.3, 0.32, 0.8);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      const a = 0.32, wp = S.proj([-0.9 + (1.8 * 2.5) / 4, 1.25 + 0.42 * Math.sin(a), 0.42 * Math.cos(a)]); ringHi(ctx, wp[0], wp[1], 46, ramp(t, V('today', 'small') - 0.1, 0.3));
      const sp = S.proj([0, 1.25, 0.46]); ringHi(ctx, sp[0], sp[1] + 30, 70, ramp(t, V('stopper', 'straps') - 0.1, 0.3) * (1 - ramp(t, V('test', 'flexing') - 0.3, 0.3)));
    } else if (n === 'atlantic') { // 1958: the Comet 4 across the Atlantic
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 6.4, 5.4, 0.8, 0.5, 1.2, 0.7, [0.3, 0.1, 0]);
      const S = seaScene(E, TG, W, H_, t);
      comet(S, [0, SKY_Y, 0], { burn: 1, k: 0.9 });
      S.render(ctx, W, H_, skyEnv);
    } else { // finale: the round window again
      roundSide(ctx, W, H_, t, sh, V('lesson', 'curve'));
      FX.confetti(ctx, W, H_, ramp(t, V('lesson', 'hard'), 2.4), t);
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: one big cracked square window + "WHY NOT SQUARE?" ----------
  const THUMB = (ctx, W, H_) => {
    const S = Scene([0.55, 1.3, 1.65], [0.32, 1.28, 0], W, H_);
    S.box((p) => add(rotY(p, -0.18), [0.62, 1.28, 0]), 0.62, 0.5, 0.012, [196, 200, 210], { bevel: 0.2, paint: skinPaint({ k: 0.02, win: [0.5, 0.56], hot: 1, crack: 1, t: 0.3, seed: 4 }) });
    S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
    finish(ctx, W, H_, 1);
    thumbText(ctx, [['WHY NOT', 300, 150, '#ffffff'], ['SQUARE?', 470, 170, '#ffd24a']]);
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const jetHum = (t0, t1, g = 0.08) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 600, gain: g, a: 0.5, minor: true }); };
    const wind = (t0, t1, g = 0.06) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: g, a: 0.6, minor: true }); };
    const rip = (t) => { k.play('impact', t, { gain: 0.45 }); k.noise(t, { dur: 1.4, filter: 'bandpass', f: [[0, 2600], [1.4, 500]], q: 1.2, gain: 0.14, a: 0.01 }); wind(t + 0.3, t + 3.0, 0.1); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.3, minor: true });
    wind(0, ST('breakup')); k.play('ding', V('hook', 'round'), { f: 'E6', gain: 0.3 });
    jetHum(ST('breakup'), V('crack', 'tearing')); rip(V('crack', 'tearing'));
    jetHum(ST('reveal'), ST('apron')); k.play('pop', V('promise', 'corners'), { gain: 0.3, minor: true }); k.play('impact', V('promise', 'comet'), { gain: 0.35 });
    jetHum(ST('apron'), ST('pressure'), 0.09); k.play('error', V('thin', 'breathe'), { gain: 0.25 });
    // cabin
    k.noise(V('pump', 'air'), { dur: 2.4, color: 'pink', filter: 'bandpass', f: [[0, 600], [2.4, 1400]], q: 0.8, gain: 0.07, a: 0.3, minor: true });
    clunk(V('push', 'pushes'), 1.1); k.play('thud', V('push', 'five'), { f: 70, gain: 0.3 });
    for (let i = 0; i < 4; i++) k.noise(V('breathe', 'swells') + i * 1.4, { dur: 0.9, color: 'pink', filter: 'lowpass', f: 500, gain: 0.06, a: 0.3, minor: true });
    for (let i = 0; i < 10; i++) k.play('count', V('cycle', 'thousands') + i * 0.12, { gain: 0.35, f: 2000 + i * 80, minor: true });
    // fatigue
    for (let i = 0; i < 6; i++) k.play('tick', V('clip', 'back') + i * 0.35, { gain: 0.25, minor: true });
    k.play('stamp', V('clip', 'snaps'), { gain: 0.4 }); k.play('thud', V('clip', 'snaps') + 0.8, { f: 140, gain: 0.25 });
    for (let i = 0; i < 6; i++) k.play('tick', V('fatigue', 'force') + i * 0.45, { gain: 0.18, minor: true });
    k.play('buzz', V('where', 'sharp'), { gain: 0.25 });
    // panels
    k.noise(V('flow', 'stress'), { dur: 2.0, color: 'pink', filter: 'bandpass', f: 1200, q: 2, gain: 0.04, a: 0.4, minor: true });
    k.play('ding', V('round', 'smoothly'), { f: 'C6', gain: 0.25 }); k.play('error', V('square', 'piles'), { gain: 0.3 });
    k.noise(V('grow', 'crack'), { dur: 1.6, filter: 'highpass', f: 3200, gain: 0.05, a: 0.05, minor: true });
    k.play('pop', V('openings', 'windows'), { gain: 0.25, minor: true }); k.play('pop', V('openings', 'roof'), { gain: 0.3 }); k.play('glitch', V('rivets', 'punched'), { gain: 0.25, minor: true });
    // three jets
    k.noise(ST('storm'), { dur: ST('elba') - ST('storm'), color: 'brown', filter: 'lowpass', f: 400, gain: 0.1, a: 0.5 }); k.play('impact', V('calcutta', 'violent'), { gain: 0.3 });
    rip(V('calcutta', 'storm') + 0.6);
    jetHum(ST('elba'), V('elba', 'apart')); rip(V('elba', 'apart'));
    k.play('buzz', V('grounded', 'grounded'), { gain: 0.25 }); k.play('ding', V('grounded', 'cleared'), { f: 'A5', gain: 0.25 });
    jetHum(ST('naples'), V('naples', 'broke')); rip(V('naples', 'broke'));
    k.noise(V('nobody', 'nobody'), { dur: ST('tank') - V('nobody', 'nobody'), color: 'pink', filter: 'lowpass', f: 380, gain: 0.05, a: 0.6 });
    // tank
    clunk(V('tank', 'whole'), 1.0); k.noise(V('tank', 'water'), { dur: 2.0, color: 'pink', filter: 'bandpass', f: 700, q: 0.6, gain: 0.07, a: 0.2 });
    for (let i = 0; i < 16; i++) k.play('count', V('flights', 'again') + i * 0.22, { gain: 0.3, f: 1800 + i * 60, minor: true });
    k.play('impact', V('burst', 'split'), { gain: 0.45 }); k.noise(V('burst', 'split'), { dur: 1.6, color: 'pink', filter: 'bandpass', f: 500, q: 0.7, gain: 0.1, a: 0.02 });
    k.play('error', V('found', 'corner'), { gain: 0.3 });
    // fix
    k.noise(V('fix', 'rounded'), { dur: 1.0, filter: 'bandpass', f: 1600, q: 3, gain: 0.05, minor: true }); k.play('success', V('fix', 'smoothly'), { f: 'C6', gain: 0.35 });
    clunk(V('skin', 'thicker')); clunk(V('stopper', 'straps'), 1.2); clunk(V('stopper', 'straps') + 0.25, 0.8);
    for (let i = 0; i < 5; i++) k.noise(V('test', 'flexing') + i * 1.05, { dur: 0.7, color: 'pink', filter: 'lowpass', f: 500, gain: 0.05, a: 0.2, minor: true });
    k.play('pop', V('today', 'small'), { gain: 0.3, minor: true });
    jetHum(ST('atlantic'), ST('finale'), 0.08); k.play('ding', V('atlantic', 'transatlantic'), { f: 'E6', gain: 0.3 });
    wind(ST('finale'), DURATION); k.play('success', V('lesson', 'hard'), { f: 'C6', gain: 0.55 }); k.play('sparkle', V('lesson', 'hard') + 0.3, { gain: 0.45, n: 6 });
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
