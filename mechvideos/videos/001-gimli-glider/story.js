  // ==================== "How a jet flew with no engines" (the Gimli Glider), 16:9 ====================
  // Sky at sunset (cruise, flameout, glide) <-> garage explainers (fuel tank + dipstick, balance scale, turbofan,
  // instrument panel, ram air turbine) <-> glide diagram <-> the Gimli runway with a car race. Times come from V().

  const BEATS = window.SCRIPT;
  const SH = [
    ['cruise', 0],
    ['apron', BEAT0('date') - 0.15],
    ['tank', BEAT0('metric') - 0.15],
    ['balance', BEAT0('need') - 0.15],
    ['alarm', BEAT0('alarm') - 0.15],
    ['engine', BEAT0('left') - 0.15],
    ['rightout', BEAT0('right') - 0.15],
    ['panel', BEAT0('dark') - 0.15],
    ['glide', BEAT0('glider') - 0.15],
    ['ratdrop', BEAT0('rat') - 0.15],
    ['ratrig', BEAT0('pump') - 0.15],
    ['diagram', BEAT0('byhand') - 0.15],
    ['racetrack', BEAT0('race') - 0.15],
    ['slip', BEAT0('high') - 0.15],
    ['landing', BEAT0('touch') - 0.15],
    ['finale', BEAT0('after') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];

  // engine state over the whole story: both run until "left"/"right" stop words, restart in the finale
  const tL = V('left', 'stops'), tR = V('right', 'stops');
  const runL = (t) => (t >= ST('finale') ? 1 : 1 - ramp(t, tL - 0.2, 1.2));
  const runR = (t) => (t >= ST('finale') ? 1 : 1 - ramp(t, tR - 0.2, 1.2));
  const fanAngle = (t) => integ((u) => 2 + 16 * Math.min(runL(u), 1), t, 1 / 20);
  const ratOut = (t) => ramp(t, V('rat', 'drops') - 0.2, 0.7) * (t < ST('landing') ? 1 : 0);

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'cruise') { // the jet at sunset; on "gone" both engines die; then the reveal
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 5.0, 8.0, 0.7, 1.8, 0.9, 1.6, [0, 0.25, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const off = ramp(t, V('silent', 'gone') - 0.3, 0.6);
      jet767(S, [0, SKY_Y, 0], { fan: integ((u) => 18 * (1 - ramp(u, V('silent', 'gone') - 0.3, 1.0)) + 1, t, 1 / 20), burn: 1 - off, pitch: -0.03 * off });
      S.render(ctx, W, H_, skyEnv);
      const eL = S.proj([0.4, SKY_Y - 0.33, -0.82]), eR = S.proj([0.4, SKY_Y - 0.33, 0.82]);
      const nu = ramp(t, V('promise', 'fuel') - 0.1, 0.3) * (1 - ramp(t, V('promise', 'glider') - 0.3, 0.3));
      FX.no(ctx, eL[0], eL[1], 46, nu); FX.no(ctx, eR[0], eR[1], 46, nu);
      flash = 0.18 * Math.exp(-Math.pow((t - V('promise', 'gimli')) * 4, 2));
    } else if (n === 'apron') { // Montreal, 1983: the jet on the ground at dusk
      const [E, TG] = dolly(t, sh.t0, sh.t1, [-7.5, 1.6, 6.0], [0.2, 0.9, 0], [-5.2, 1.3, 4.6], [0.6, 0.8, 0]);
      const S = Scene(E, TG, W, H_); gimliField(S); jet767(S, [0, 0.65, 0], { gear: 1, nose: 1, fan: t * 0.4 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33 });
    } else if (n === 'tank') { // metric fuel, blank gauges, the dipstick
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.4, 3.0, 0.9, 0.7, -0.35, 0.25, [0, 0.15, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const tk = popU(t, V('metric', 'fuel') - 0.1, 0.4);
      stand(S, [-0.8, 0, 0], 0.5, 0.4, 0.75);
      if (tk > 0) fuelTank(S, add([-0.8, 1.1, 0], [0, 0, 0]), 0.45 * tk, ramp(t, V('dip', 'stick') - 0.2, 0.6));
      const bl = 1 - ramp(t, V('gauges', 'blank') - 0.15, 0.25);
      panel(S, [0.8, 1.55, -0.35], Math.max(0.15, bl), -0.3);
      const pk = popU(t, V('metric', 'kilograms') - 0.1, 0.35);
      if (pk > 0) balance(S, [1.5, 0, 0.7], 0.25 * ramp(t, V('metric', 'pounds'), 0.6), 0.12 * pk, 0.12 * pk * ramp(t, V('metric', 'pounds') - 0.1, 0.3) * 0.75);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.2 });
      const pp = S.proj([0.8, 1.6, -0.3]);
      FX.no(ctx, pp[0], pp[1], 60, ramp(t, V('gauges', 'blank'), 0.25) * (1 - ramp(t, V('dip', 'old') - 0.2, 0.3)));
      FX.sparks(ctx, pp[0], pp[1], H.clamp((t - V('gauges', 'sensor')) / 0.6), 4);
    } else if (n === 'balance') { // the conversion: needed vs loaded on a balance scale
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.2, 1.0, 0], 3.2, 2.7, 0.75, 0.6, 0.35, -0.25, [0, 0.2, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const need = popU(t, V('need', 'twenty-two') - 0.1, 0.4), have = popU(t, V('half', 'tanks') - 0.1, 0.4);
      const tilt = need > 0 ? 0.32 * Math.min(1, need) * (1 - 0.35 * have) : 0;
      balance(S, [0.6, 0, 0], tilt, 0.18 * need, 0.1 * have);
      stand(S, [-1.0, 0, 0.2], 0.5, 0.4, 0.75);
      fuelTank(S, [-1.0, 1.1, 0.2], 0.4, t > V('ottawa', 'dip') - 0.3 ? ramp(t, V('ottawa', 'dip') - 0.3, 0.6) : 0);
      if (t > V('convert', 'multiply') - 0.1 && t < V('half', 'every') ) { const u = popU(t, V('convert', 'multiply') - 0.1, 0.35); S.arrow([-0.55, 1.45, 0.2], [-0.55 + 0.7 * u, 1.45, 0.1], P.yellow, { side: [0, 1, 0], w: 0.1, th: 0.03, noShadow: true }); }
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      const rp = S.proj([1.2, 0.75, 0]);
      FX.no(ctx, rp[0], rp[1] - 40, 56, ramp(t, V('wrong', 'pounds') - 0.1, 0.25) * (1 - ramp(t, V('half', 'every') - 0.2, 0.3)));
      const pp = S.proj([-1.0, 1.1, 0.2]); FX.no(ctx, pp[0], pp[1], 50, ramp(t, V('nowarn', 'warn') - 0.15, 0.25));
    } else if (n === 'alarm') { // back in the sky: the warning, the turn for Winnipeg
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 6.4, 5.6, 0.8, 0.5, -1.1, -0.7, [0.2, 0.2, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const bank = 0.3 * Math.sin(Math.PI * H.clamp((t - V('divert', 'turns') + 0.2) / 2.2));
      jet767(S, [0, SKY_Y, 0], { fan: fanAngle(t), burn: 0.6 + 0.4 * Math.sin(t * 30) * ramp(t, V('alarm', 'low') - 0.2, 0.3), roll: -bank, yaw: bank * 0.3 });
      S.render(ctx, W, H_, skyEnv);
      const pulse = ramp(t, V('alarm', 'chimes') - 0.1, 0.1) * (0.5 + 0.5 * Math.sin((t - V('alarm', 'chimes')) * 9));
      redPulse(ctx, W, H_, pulse * (1 - ramp(t, V('divert', 'captain') - 0.2, 0.4)));
    } else if (n === 'engine') { // the turbofan cutaway: fuel stops, the flame dies, the fan winds down
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.0, 2.6, 0.5, 0.4, 1.2, 0.8, [0.05, 0.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const run = runL(t);
      turbofan(S, [0, 1.2, 0], t, { fan: fanAngle(t), burn: run, flow: run });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      const ep = S.proj([-0.2, 1.2, 0]); puffs(ctx, ep[0] - 60, ep[1], H.clamp((t - tL) / 1.6), 3, '120,120,128');
    } else if (n === 'rightout') { // the right engine stops too
      const [E, TG] = dolly(t, sh.t0, sh.t1, [3.2, SKY_Y + 0.1, 3.6], [0.4, SKY_Y - 0.25, 0.8], [2.6, SKY_Y + 0.0, 3.0], [0.4, SKY_Y - 0.3, 0.8]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { fan: integ((u) => 1 + 16 * runR(u), t, 1 / 20), burn: runR(t) });
      S.render(ctx, W, H_, { ...skyEnv, focus: 3.6 });
      const ep = S.proj([0.4, SKY_Y - 0.33, 0.82]); FX.no(ctx, ep[0], ep[1], 70, ramp(t, tR - 0.1, 0.25));
    } else if (n === 'panel') { // the screens go dark; the never-heard warning
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.5, 1.75, 1.9], [0, 1.55, -0.35], [0.25, 1.68, 1.4], [0, 1.55, -0.35]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      panel(S, [0, 1.55, -0.35], 1 - ramp(t, V('dark', 'dark') - 0.2, 0.35));
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.9 });
      const pu = ramp(t, V('tone', 'warning') - 0.1, 0.1) * (0.5 + 0.5 * Math.sin((t - V('tone', 'warning')) * 7)); redPulse(ctx, W, H_, pu);
      flash = 0.15 * Math.exp(-Math.pow((t - V('tone', 'all')) * 5, 2));
    } else if (n === 'glide') { // a very heavy glider
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 8.0, 7.0, 1.6, 1.0, 2.2, 2.7, [0, 0.2, 0]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { fan: fanAngle(t), burn: 0, pitch: -0.05 });
      S.render(ctx, W, H_, skyEnv);
      const pp = S.proj([0, SKY_Y, 0]); FX.no(ctx, pp[0], pp[1] - 120, 50, ramp(t, V('hydraulic', 'pumps') - 0.1, 0.25));
    } else if (n === 'ratdrop') { // the little propeller drops out of the belly
      const [E, TG] = dolly(t, sh.t0, sh.t1, [-1.3, SKY_Y - 0.55, 2.6], [0.1, SKY_Y - 0.42, 0.3], [-0.9, SKY_Y - 0.6, 2.1], [0.1, SKY_Y - 0.45, 0.3]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { fan: fanAngle(t), burn: 0, rat: ratOut(t), ratSpin: t * 25 * ratOut(t), pitch: -0.05 });
      S.render(ctx, W, H_, { ...skyEnv, focus: 2.3 });
      const rp = S.proj([0.08, SKY_Y - 0.48, 0.33]); FX.spin(ctx, rp[0], rp[1], 70, ramp(t, V('rat', 'turbine') - 0.1, 0.6), -t * 9);
    } else if (n === 'ratrig') { // ram air turbine on the stand: wind -> prop -> pump -> controls
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-0.3, 1.1, 0], 3.1, 2.7, 0.7, 0.55, 0.45, -0.1, [0, 0.15, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const fl = ramp(t, V('pump', 'pump') - 0.3, 0.8), dfl = 0.35 * Math.sin((t - V('pump', 'controls')) * (t > V('weak', 'harder') ? 1.2 : 2.4)) * ramp(t, V('pump', 'controls') - 0.2, 0.4);
      ratRig(S, [0.2, 1.1, 0], t, { spin: t * 14, flow: fl, defl: dfl });
      const wu = ramp(t, V('pump', 'rushing') - 0.2, 0.5);
      if (wu > 0) for (const dy of [-0.18, 0, 0.18]) S.arrow([1.35, 1.1 + dy, 0.0], [1.35 - 0.6 * wu, 1.1 + dy, 0.0], P.air, { side: [0, 1, 0], w: 0.07, th: 0.02, noShadow: true });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      const wp = S.proj([-0.8, 1.25, 0]); FX.no(ctx, wp[0], wp[1] - 30, 46, ramp(t, V('weak', 'flaps') - 0.1, 0.25) * (1 - ramp(t, V('weak', 'harder') - 0.2, 0.3)));
    } else if (n === 'diagram') { // the glide worked out by hand: Winnipeg too far, Gimli in reach
      const [E, TG] = dolly(t, sh.t0, sh.t1, [9.5, 6.5, 19], [11, 3.4, 0], [10.5, 6.0, 17.5], [11.5, 3.2, 0]);
      const S = Scene(E, TG, W, H_); landBelow(S);
      const P0 = [0, 7, 0], win = [24, 0, -1], gim = [15, 0, 1.5];
      pin(S, win, [236, 92, 70], 2.6, 0.5);
      const gu = popU(t, V('gimli', 'gimli', 1) - 0.1, 0.4); if (gu > 0) pin(S, gim, P.green, 2.6 * gu, 0.5 * gu);
      jet767(S, P0, { s: 0.9, burn: 0, pitch: -0.08, rat: 1, ratSpin: t * 20 });
      const ru = ramp(t, V('rate', 'ten') - 0.1, 1.6);
      if (ru > 0) S.beads([add(P0, [1.4, -0.3, 0]), [2.2 + 17 * ru, 7 - 0.3 - 6.7 * ru, 0]], P.air, 0, { spacing: 0.5, r: 0.12 });
      const gp = ramp(t, V('gimli', 'gimli', 1), 1.2);
      if (gp > 0) S.beads([add(P0, [2.2, -0.3, 0]), [9, 3.6, 1.0], [15, 0.3, 1.5]], P.green, -t * 2, { reveal: gp, spacing: 0.5, r: 0.12 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, shadows: false, dofGap: 40 });
      const wp = S.proj(add(win, [0, 3.4, 0])); FX.no(ctx, wp[0], wp[1], 54, ramp(t, V('far', 'far') - 0.1, 0.25));
      const gr = S.proj([19.2, 0.2, 0]); FX.sparks(ctx, gr[0], gr[1], H.clamp((t - V('far', 'ground')) / 0.6), 9);
    } else if (n === 'racetrack') { // nobody knows: there's a car race on the old runway
      const [E, TG] = dolly(t, sh.t0, sh.t1, [17.5, 1.5, 5.0], [24, 0.3, 0], [19, 1.3, 4.4], [25.5, 0.3, 0]);
      const S = Scene(E, TG, W, H_); gimliField(S);
      for (let i = 0; i < 3; i++) raceCar(S, 20 + ((t * 6 + i * 4) % 14), -1.3 + i * 0.25, 0, [[250, 200, 70], [236, 92, 70], [70, 140, 230]][i]);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 9 });
    } else if (n === 'slip') { // too high: the forward slip, then the gear
      const u = H.clamp((t - sh.t0) / (sh.t1 - sh.t0)), slipU = ramp(t, V('slip', 'crosses') - 0.2, 0.8) * (1 - ramp(t, V('gear', 'landing') - 0.3, 0.8));
      const P0 = [-34 + 18 * u, 9 - 6.5 * u - 1.8 * ramp(t, V('brake', 'drops') - 0.2, 1.5), 0];
      const E = add(P0, [-5.5, 1.4, 4.2]), TG = add(P0, [2, -0.6, 0]);
      const S = Scene(E, TG, W, H_); gimliField(S);
      const gearU = ramp(t, V('gear', 'gravity') - 0.2, 0.7), noseU = gearU * (0.55 + 0.15 * Math.sin(t * 9) * ramp(t, V('gear', "doesn't") - 0.2, 0.3));
      jet767(S, P0, { burn: 0, rat: 1, ratSpin: t * 22, yaw: 0.38 * slipU, roll: -0.22 * slipU, pitch: -0.06, gear: gearU, nose: noseU });
      const wu = ramp(t, V('brake', 'side') - 0.2, 0.5) * slipU;
      if (wu > 0) for (const dx of [-1.2, 0, 1.2]) S.arrow(add(P0, [dx + 0.3, 0.1, 2.2]), add(P0, [dx, 0.1, 2.2 - 1.1 * wu]), P.air, { side: [0, 1, 0], w: 0.22, th: 0.05, noShadow: true });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 7, dofGap: 25 });
      const np = S.proj(add(P0, [1.7, -0.5, 0])); FX.no(ctx, np[0], np[1], 40, ramp(t, V('gear', "doesn't") - 0.1, 0.25));
    } else if (n === 'landing') { // touchdown, nose collapse, scraping stop astride the guardrail, the fire, everyone safe
      const td = V('touch', 'hits') - 0.2, stopT = V('rail', 'stop');
      const u = H.clamp((t - td) / (stopT - td)), x = t < td ? -14 + 9 * (t - sh.t0) / Math.max(0.1, td - sh.t0) : -5 + 19 * (1 - Math.pow(1 - u, 2));
      const nc = ramp(t, V('touch', 'collapses') - 0.2, 0.4), y = t < td ? 0.65 + 1.2 * (1 - H.clamp((t - sh.t0) / Math.max(0.1, td - sh.t0))) : 0.65;
      const P0 = [x, y, 0], cx = Math.max(-6, x);
      const E = [cx - 2.2, 1.25, 5.6], TG = [cx + 1.2, 0.55, 0];
      const S = Scene(E, TG, W, H_); gimliField(S);
      jet767(S, P0, { burn: 0, gear: 1, nose: 1, noseCollapse: nc, pitch: -0.09 * nc });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 8 });
      const np = S.proj(add(P0, [2.3, -0.5, 0]));
      if (t > V('touch', 'collapses') - 0.1 && t < stopT + 0.3) for (let k = 0; k < 3; k++) FX.sparks(ctx, np[0] - k * 20, np[1] + 10, ((t * 3 + k * 0.33) % 1), 20 + k + Math.floor(t * 3));
      const fu = ramp(t, V('fire', 'fire') - 0.2, 0.4) * (1 - ramp(t, V('fire', 'extinguishers') + 0.1, 0.8));
      if (fu > 0) { FX.heat(ctx, np[0], np[1] - 20, 120, fu, t, 'rgba(255,120,40,0.9)'); for (let k = 0; k < 5; k++) { ctx.fillStyle = `rgba(255,${120 + k * 20},40,${0.7 * fu})`; ctx.beginPath(); ctx.arc(np[0] + Math.sin(t * 13 + k) * 14, np[1] - 10 - k * 9, 14 - k * 2, 0, TAU); ctx.fill(); } }
      puffs(ctx, np[0], np[1] - 10, H.clamp((t - V('fire', 'extinguishers')) / 1.6), 5);
      flash = 0.12 * Math.exp(-Math.pow((t - V('safe', 'survive')) * 5, 2));
    } else { // finale: the repaired jet flying again into the sunset
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 7.5, 10, 1.0, 2.2, -0.6, 0.4, [0, 0.4, 0]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { fan: t * 18, burn: 1 });
      S.render(ctx, W, H_, skyEnv);
      FX.confetti(ctx, W, H_, ramp(t, V('lesson', 'home'), 2.4), t);
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: the dead-engine jet at sunset + bold text ----------
  const THUMB = (ctx, W, H_) => {
    const S = skyScene([3.6, SKY_Y + 0.7, 3.4], [-0.9, SKY_Y - 0.25, 0], W, H_, 3);
    jet767(S, [0, SKY_Y, 0], { burn: 0, rat: 1, ratSpin: 0.4, pitch: -0.06, roll: -0.12 });
    S.render(ctx, W, H_, skyEnv);
    const eR = S.proj([0.4, SKY_Y - 0.33, 0.82]); FX.no(ctx, eR[0], eR[1], 80, 1);
    finish(ctx, W, H_, 1);
    ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
    const line = (txt, y, px, col) => { ctx.font = FONT(800, px); ctx.lineWidth = px * 0.14; ctx.strokeStyle = '#1a1820'; ctx.strokeText(txt, 70, y); ctx.fillStyle = col; ctx.fillText(txt, 70, y); };
    line('NO FUEL', 230, 190, '#ffd24a'); line('AT 41,000 FT', 380, 120, '#ffffff');
    ctx.restore();
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const jetHum = (t0, t1, g = 0.1) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 600, gain: g, a: 0.5, minor: true }); };
    const wind = (t0, t1, g = 0.07) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: g, a: 0.6, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.3, minor: true });
    // cruise -> silence
    jetHum(0, V('silent', 'gone')); k.noise(V('silent', 'gone') - 0.2, { dur: 1.2, filter: 'lowpass', f: [[0, 900], [1.2, 120]], gain: 0.12, a: 0.05 }); wind(V('silent', 'gone') + 0.6, ST('apron'));
    k.play('impact', V('promise', 'gimli'), { gain: 0.35 });
    // ground / garage
    clunk(V('metric', 'fuel')); clunk(V('metric', 'kilograms'), 0.8); k.play('buzz', V('gauges', 'blank'), { gain: 0.25 }); k.play('glitch', V('gauges', 'sensor'), { gain: 0.25, minor: true });
    k.noise(V('dip', 'stick'), { dur: 0.6, filter: 'bandpass', f: 1400, q: 3, gain: 0.05, minor: true });
    clunk(V('need', 'twenty-two'), 1.2); k.play('pop', V('convert', 'multiply'), { gain: 0.3, minor: true }); k.play('error', V('wrong', 'pounds'), { gain: 0.35 });
    clunk(V('half', 'tanks'), 0.7); k.play('thud', V('half', 'half') + 0.1, { f: 80, gain: 0.3 }); k.play('buzz', V('nowarn', 'warn'), { gain: 0.2 });
    // flameout
    jetHum(ST('alarm'), tR + 0.3, 0.09);
    for (let i = 0; i < 4; i++) k.play('ding', V('alarm', 'chimes') + i * 0.45, { f: 'A5', gain: 0.22 });
    k.noise(tL - 0.2, { dur: 1.4, filter: 'lowpass', f: [[0, 800], [1.4, 100]], gain: 0.12, a: 0.05, pan: -0.4 }); k.play('thud', tL + 0.4, { f: 70, gain: 0.25 });
    k.noise(tR - 0.2, { dur: 1.4, filter: 'lowpass', f: [[0, 800], [1.4, 100]], gain: 0.12, a: 0.05, pan: 0.4 });
    k.play('error', V('dark', 'dark'), { gain: 0.3 }); k.tone(V('tone', 'warning'), { f: 520, dur: 1.6, type: 'triangle', gain: 0.12, a: 0.02 });
    wind(tR + 0.5, ST('racetrack'));
    // the propeller
    k.play('swish', V('rat', 'drops'), { gain: 0.35 }); clunk(V('rat', 'drops') + 0.3, 0.8);
    k.noise(V('rat', 'turbine'), { dur: ST('diagram') - V('rat', 'turbine'), filter: 'bandpass', f: 1600, q: 2, gain: 0.04, a: 0.3, minor: true });
    k.noise(V('pump', 'pump'), { dur: 2.0, color: 'pink', filter: 'bandpass', f: [[0, 500], [2, 1100]], q: 0.8, gain: 0.06, a: 0.3, minor: true });
    // diagram
    for (let i = 0; i < 8; i++) k.play('count', V('rate', 'ten') + i * 0.18, { gain: 0.4, f: 2600 - i * 120, minor: true });
    k.play('error', V('far', 'far'), { gain: 0.3 }); k.play('ding', V('gimli', 'gimli', 1), { f: 'E6', gain: 0.35 });
    // race
    k.noise(ST('racetrack'), { dur: ST('slip') - ST('racetrack'), color: 'brown', filter: 'bandpass', f: [[0, 300], [1, 520], [2, 340], [3, 560]], q: 2, gain: 0.08, a: 0.2, minor: true });
    // slip + gear
    wind(ST('slip'), ST('landing'), 0.09); k.noise(V('brake', 'side'), { dur: 2.0, color: 'pink', filter: 'lowpass', f: 700, gain: 0.1, a: 0.3 });
    clunk(V('gear', 'gravity'), 1.2); clunk(V('gear', 'lock'), 1.0); k.play('buzz', V('gear', "doesn't"), { gain: 0.25 });
    // touchdown
    k.play('impact', V('touch', 'hits'), { gain: 0.5 }); k.noise(V('touch', 'collapses'), { dur: Math.max(1, V('rail', 'stop') - V('touch', 'collapses')), filter: 'bandpass', f: 2200, q: 1.5, gain: 0.1, a: 0.05 });
    k.play('thud', V('rail', 'stop') + 0.2, { f: 60, gain: 0.4 });
    k.noise(V('fire', 'fire'), { dur: 1.2, filter: 'highpass', f: 3000, gain: 0.05, a: 0.3, minor: true }); k.noise(V('fire', 'extinguishers'), { dur: 1.2, color: 'white', filter: 'highpass', f: 1500, gain: 0.08, a: 0.05 });
    k.play('success', V('safe', 'survive'), { f: 'C6', gain: 0.4 });
    // finale
    jetHum(ST('finale'), DURATION, 0.08); k.play('success', V('lesson', 'home'), { f: 'C6', gain: 0.55 }); k.play('sparkle', V('lesson', 'home') + 0.3, { gain: 0.45, n: 6 });
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
