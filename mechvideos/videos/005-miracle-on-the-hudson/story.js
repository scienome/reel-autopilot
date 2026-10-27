  // ==================== "The plane that landed on a river" (US Airways 1549, Miracle on the Hudson), 16:9 ====================
  // The sky over New York (the geese, both engines out, the glide, the RAT) <-> garage explainers (a turbofan meets a goose,
  // the APU rig powering the flight computers, the cockpit panel) <-> a top-down map (LaGuardia, Teterboro, the river) <->
  // the Hudson (why water is hard, the bridge, touchdown, everyone out on the wings, the ferries).

  const BEATS = window.SCRIPT;
  const SH = [
    ['hook', 0],
    ['decide', BEAT0('decide') - 0.15],
    ['promise', BEAT0('promise') - 0.15],
    ['takeoff', BEAT0('flight') - 0.15],
    ['climb', BEAT0('climb') - 0.15],
    ['fan', BEAT0('fan') - 0.15],
    ['damage', BEAT0('damage') - 0.15],
    ['glider', BEAT0('glider') - 0.15],
    ['tail', BEAT0('apu') - 0.15],
    ['apurig', BEAT0('what') - 0.15],
    ['rat', BEAT0('rat') - 0.15],
    ['cockpit', BEAT0('checklist') - 0.15],
    ['map', BEAT0('runways') - 0.15],
    ['cartwheel', BEAT0('hard') - 0.15],
    ['needs', BEAT0('needs') - 0.15],
    ['river', BEAT0('river') - 0.15],
    ['bridge', BEAT0('bridge') - 0.15],
    ['touch', BEAT0('touch') - 0.15],
    ['wings', BEAT0('wings') - 0.15],
    ['ntsb', BEAT0('ntsb') - 0.15],
    ['geese', BEAT0('geese') - 0.15],
    ['finale', BEAT0('lesson') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];

  const S_J = 0.3; // the jet's scale in the river world
  const tHit = V('hook', 'geese'), tTouch = V('touch', 'touches'), tStop = V('slide', 'floating');
  const engOn = (t) => 1 - ramp(t, tHit + 0.1, 1.0);
  const fanA = (t) => integ((u) => 1 + 16 * engOn(u), t, 1 / 20);
  // the takeoff field: grass, a runway along x, a skyline far behind
  const lgaField = (S) => { S.quad([[-200, 0, -200], [200, 0, -200], [200, 0, 200], [-200, 0, 200]], P.grass, { bg: true }); S.quad([[-80, 0.002, -1.6], [80, 0.002, -1.6], [80, 0.002, 1.6], [-80, 0.002, 1.6]], [92, 92, 100], { bg: true, paint: (c, w, h) => { c.fillStyle = 'rgba(255,255,255,0.8)'; for (let x = 0; x < w; x += 18) c.fillRect(x, h * 0.485, 8, h * 0.03); } }); S.quad([[-200, 0.001, -60], [200, 0.001, -60], [200, 0.001, -22], [-200, 0.001, -22]], HU.water, { bg: true }); const r = H.rng(14); for (let i = 0; i < 40; i++) { const x = r.range(-60, 60), hh = r.range(1, 7), w = r.range(0.8, 1.8); S.box((q) => add(q, [x, hh, -30 - r.range(0, 12)]), w, hh, w, [r.range(150, 205), r.range(150, 200), r.range(160, 205)], { bevel: 0.02, noShadow: true }); } };
  // the jet over the water in the river world: x along the river, floating when y = 0
  const riverJet = (S, x, y, o = {}) => jet767(S, [x, y + 0.12 * S_J, 0], { s: S_J, burn: 0, ...o });

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'hook' || n === 'climb') { // climbing out; the flock; both engines lose power
      const isH = n === 'hook', th = isH ? tHit : V('climb', 'geese') + 0.6;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 7.2, 6.2, 1.0, 0.7, isH ? 0.8 : -0.9, isH ? 1.2 : -0.6, [0.5, 0.2, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const on = isH ? engOn(t) : 1;
      jet767(S, [0, SKY_Y, 0], { fan: isH ? fanA(t) : t * 17, burn: on, pitch: 0.08 });
      const fx = 14 - 9 * (t - (th - 1.5)); if (t < th + 0.1) flock(S, [Math.max(0.6, fx), SKY_Y - 0.2, 0], t, 9, 0.9, Math.PI);
      S.render(ctx, W, H_, skyEnv);
      if (isH) { for (const z of [-0.82, 0.82]) { const ep = S.proj([0.4, SKY_Y - 0.33, z]); puffs(ctx, ep[0], ep[1], H.clamp((t - tHit) / 2.0), 4 + (z > 0 ? 1 : 0), '90,90,96', 50); FX.sparks(ctx, ep[0], ep[1], H.clamp((t - tHit) / 0.6), 3 + (z > 0 ? 2 : 0)); FX.no(ctx, ep[0], ep[1], 46, ramp(t, V('hook', 'power') - 0.1, 0.25)); } flash = 0.2 * Math.exp(-Math.pow((t - tHit) * 5, 2)); }
      else tally(ctx, W / 2, H_ * 0.14, '2,800 ft', ramp(t, V('climb', 'two') - 0.1, 0.3));
    } else if (n === 'decide' || n === 'glider') { // a heavy glider over the city: the clock is running
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 7.8, 6.8, 1.4, 1.0, -1.4, -1.0, [0.2, 0.1, 0]);
      const S = skyScene(E, TG, W, H_, t);
      jet767(S, [0, SKY_Y, 0], { fan: fanA(t), burn: 0, pitch: -0.05, rat: n === 'glider' ? 0 : 0 });
      S.render(ctx, W, H_, skyEnv);
      if (n === 'decide') tally(ctx, W / 2, H_ * 0.14, Math.max(0, Math.ceil(208 - (t - tHit))) + ' s', ramp(t, V('decide', 'three') - 0.1, 0.3), 60, '#ff8a6a');
    } else if (n === 'promise' || n === 'finale') { // on the river, everyone on the wings (and the ferries)
      const fin = n === 'finale';
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.3, 0], fin ? 7 : 4.2, fin ? 5.5 : 3.4, 1.4, 0.9, fin ? -0.5 : 0.6, fin ? 0.1 : 1.0, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: !fin });
      riverJet(S, 0, -0.02, { pitch: 0.04 }); wingPeople(S, [0, 0.1, 0], 22, 3, S_J);
      if (fin) { ferry(S, [1.2, 0, 1.4], 0.4); ferry(S, [-1.6, 0, -1.6], -0.3); ferry(S, [2.6, 0, -1.0], 2.6); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: fin ? 6 : 3.8, dofGap: 6 });
      if (fin) FX.confetti(ctx, W, H_, ramp(t, V('lesson', 'second'), 2.4), t);
    } else if (n === 'takeoff') { // LaGuardia, 15 January 2009
      const u = ramp(t, sh.t0 + 0.5, sh.t1 - sh.t0 - 0.5), x = -6 + 14 * u * u, y = 0.65 + 2.6 * Math.max(0, u - 0.55) * Math.max(0, u - 0.55) * 4;
      const [E, TG] = dolly(t, sh.t0, sh.t1, [-4, 1.2, 6.5], [-2, 0.8, 0], [4, 1.8, 6.5], [6, 1.6, 0]);
      const S = Scene(E, TG, W, H_); lgaField(S);
      jet767(S, [x, y, 0], { s: 0.8, gear: u < 0.75 ? 1 : 1 - ramp(u, 0.75, 0.2), nose: 1, burn: 1, fan: t * 17, pitch: Math.min(0.14, 0.4 * Math.max(0, u - 0.5)) });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 6.5 });
    } else if (n === 'fan' || n === 'damage' || n === 'ntsb') { // the turbofan and the goose
      const isF = n === 'fan', isD = n === 'damage';
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.2, 2.7, 0.5, 0.4, isF ? -1.2 : 1.1, isF ? -0.7 : 0.7, [0.05, 0.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const tg = isF ? V('tested', 'firing') : -9, run = isD ? 1 - ramp(t, V('damage', 'thrust') - 0.2, 1.0) : isF ? 1 : 0;
      const fan = integ((u) => 2 + 14 * (isD ? 1 - ramp(u, V('damage', 'thrust') - 0.2, 1.0) : isF ? 1 : 0), t, 1 / 20);
      turbofan(S, [0, 1.2, 0], t, { fan, burn: run, flow: run });
      const au = isF ? ramp(t, V('fan', 'swallows') - 0.3, 0.6) : 0; if (au > 0) for (const dz of [-0.2, 0, 0.2]) S.beads([[1.6, 1.2 + dz, 0.0], [0.45, 1.2 + dz * 0.8, 0]], P.air, -t * 2, { reveal: au, spacing: 0.08, r: 0.025 });
      const gu = isF ? H.clamp((t - tg) / 0.8) : 0; if (isF && t > tg - 0.1 && gu < 1) goose(S, [1.8 - 1.4 * gu, 1.25, 0], 0.4 * Math.sin(t * 8), 0.8, Math.PI);
      if (n === 'ntsb') goose(S, [0.5, 1.25, 0.12], 0.6, 0.6, Math.PI + 0.4);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      const fp = S.proj([0.4, 1.2, 0]);
      if (isF) { FX.sparks(ctx, fp[0], fp[1], H.clamp((t - tg - 0.8) / 0.6), 5); FX.spin(ctx, fp[0], fp[1], 110, ramp(t, V('fan', 'spins') - 0.1, 0.6), -t * 6); tally(ctx, fp[0], fp[1] - 230, '3–5 kg', ramp(t, V('tested', 'heavier') - 0.1, 0.3), 50, '#ff8a6a'); }
      if (isD) { FX.sparks(ctx, fp[0], fp[1], H.clamp((t - sh.t0 - 0.3) / 0.6), 6); puffs(ctx, fp[0] - 100, fp[1], H.clamp((t - V('damage', 'damaged')) / 2), 3, '90,90,96'); const cp = S.proj([-0.2, 1.2, 0]); ringHi(ctx, cp[0], cp[1], 90, ramp(t, V('core', 'core') - 0.1, 0.3) * (1 - ramp(t, V('contain', 'casings') - 0.3, 0.3)), '255,90,70'); ringHi(ctx, fp[0] - 60, fp[1], 200, ramp(t, V('contain', 'casings') - 0.1, 0.3), '126,224,122'); }
      if (n === 'ntsb') ringHi(ctx, fp[0], fp[1], 110, ramp(t, V('ntsb', 'heavier') - 0.1, 0.3), '255,90,70');
    } else if (n === 'tail') { // the APU in the tail (x-ray)
      const [E, TG] = dolly(t, sh.t0, sh.t1, [-3.6, SKY_Y + 0.7, 2.6], [-2.1, SKY_Y + 0.15, 0], [-3.2, SKY_Y + 0.5, 1.9], [-2.3, SKY_Y + 0.1, 0]);
      const S = skyScene(E, TG, W, H_, t);
      const j = jet767(S, [0, SKY_Y, 0], { fan: fanA(t), burn: 0, pitch: -0.05 });
      const on = ramp(t, V('apu', 'starts') - 0.1, 0.6); if (on > 0) S.ico(add(j.tail, [0.05, -0.05, 0]), 0.05 * on, [255, 150, 60], { sub: 0, glow: true, noShadow: true });
      S.render(ctx, W, H_, { ...skyEnv, focus: 2.6 });
      const tp = S.proj(j.tail); ringHi(ctx, tp[0], tp[1], 70, ramp(t, V('apu', 'starts') - 0.1, 0.3)); puffs(ctx, tp[0] - 20, tp[1], ((t - V('apu', 'starts')) / 2) % 1 * (t > V('apu', 'starts') ? 1 : 0), 9, '200,200,210', 20);
    } else if (n === 'apurig') { // a small turbine making electricity for the flight computers
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0.25, 1.15, 0], 3.0, 2.6, 0.5, 0.35, 0.5, -0.1, [0, 0.05, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      apuRig(S, [-0.25, 1.15, 0], t, { on: ramp(t, V('what', 'small') - 0.2, 0.6), power: ramp(t, V('what', 'electricity') - 0.2, 0.8), screens: ramp(t, V('computers', 'computers') - 0.2, 0.5) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.7 });
      const bp = S.proj([0.75, 1.25, 0.15]); ringHi(ctx, bp[0], bp[1], 70, ramp(t, V('computers', 'stall') - 0.1, 0.3), '126,224,122');
      const tp = S.proj([-0.75, 1.15, 0]); FX.no(ctx, tp[0], tp[1] - 110, 40, ramp(t, V('what', 'push') - 0.1, 0.25) * (1 - ramp(t, V('what', 'electricity') - 0.3, 0.3)));
    } else if (n === 'rat') { // the ram air turbine drops out of the belly
      const [E, TG] = dolly(t, sh.t0, sh.t1, [-1.3, SKY_Y - 0.55, 2.6], [0.1, SKY_Y - 0.42, 0.3], [-0.9, SKY_Y - 0.6, 2.1], [0.1, SKY_Y - 0.45, 0.3]);
      const S = skyScene(E, TG, W, H_, t); const ro = ramp(t, V('rat', 'drops') - 0.2, 0.7);
      jet767(S, [0, SKY_Y, 0], { fan: fanA(t), burn: 0, rat: ro, ratSpin: t * 25 * ro, pitch: -0.05 });
      S.render(ctx, W, H_, { ...skyEnv, focus: 2.3 });
      const rp = S.proj([0.08, SKY_Y - 0.48, 0.33]); FX.spin(ctx, rp[0], rp[1], 70, ramp(t, V('rat', 'turbine') - 0.1, 0.6), -t * 9);
    } else if (n === 'cockpit') { // the restart checklist, written for cruising height
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.5, 1.75, 1.9], [0, 1.55, -0.35], [0.25, 1.68, 1.4], [0, 1.55, -0.35]);
      const S = Scene(E, TG, W, H_); garage(S, { props: false });
      panel(S, [0, 1.55, -0.35], 1);
      S.box((q) => add(rotX(q, -0.3), [0.55, 1.15, 0.0]), 0.16, 0.002, 0.22, [250, 246, 236], { bevel: 0, paint: (c, w, h) => { c.fillStyle = '#2a2a33'; for (let i = 0; i < 9; i++) c.fillRect(w * 0.1, h * (0.1 + i * 0.09), w * (0.4 + 0.4 * ((i * 37) % 10) / 10), h * 0.03); } });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.9 });
      const cp = S.proj([0.55, 1.15, 0]); FX.no(ctx, cp[0], cp[1], 50, ramp(t, V('checklist', 'low') - 0.1, 0.25));
    } else if (n === 'map') { // the options: LaGuardia, Teterboro, or the river
      const [E, TG] = dolly(t, sh.t0, sh.t1, [2, 34, 14], [2, 0, -1], [2, 30, 11], [2, 0, -1]);
      const S = mapScene(E, TG, W, H_);
      const lga = [10, 0, -14], teb = [12, 0, 11], pl = [8, 1.0, -5];
      pin(S, lga, [236, 92, 70], 2.6, 0.6); pin(S, teb, [236, 92, 70], 2.6, 0.6);
      jet767(S, pl, { s: 0.6, burn: 0, yaw: Math.PI * 0.8 });
      const lu = ramp(t, V('runways', 'laguardia') - 0.2, 1.0), tu = ramp(t, V('runways', 'teterboro') - 0.2, 1.0);
      if (lu > 0) S.beads([pl, lerp3(pl, lga, 0.6)], [236, 92, 70], 0, { reveal: lu, spacing: 0.6, r: 0.18 });
      if (tu > 0) S.beads([pl, lerp3(pl, teb, 0.55)], [236, 92, 70], 0, { reveal: tu, spacing: 0.6, r: 0.18 });
      const hu = ramp(t, V('hudson', 'hudson') - 0.2, 1.4); if (hu > 0) S.beads([pl, [5, 0.3, 0], [-14, 0.2, 0]], P.green, -t * 2, { reveal: hu, spacing: 0.6, r: 0.2 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
      for (const [p, w] of [[lga, 'reach'], [teb, 'either']]) { const q = S.proj(add(p, [0, 3.5, 0])); FX.no(ctx, q[0], q[1], 46, ramp(t, V('reach', w) - 0.1, 0.25)); }
      const cp = S.proj([0, 0, 0]); ringHi(ctx, cp[0], cp[1], 80, ramp(t, V('reach', 'city') - 0.1, 0.3), '255,90,70');
    } else if (n === 'cartwheel') { // water hits like concrete; a wingtip digs in and the jet cartwheels
      const td = V('cartwheel', 'digs'), u = H.clamp((t - td) / 2.0);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.5, 0], 4.6, 4.0, 0.8, 0.6, 0.6, 0.9, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: false });
      const x = t < td ? -6 + 6 * H.clamp((t - sh.t0) / Math.max(0.5, td - sh.t0)) : 0.8 * u;
      riverJet(S, x, t < td ? 0.5 * (1 - H.clamp((t - sh.t0) / Math.max(0.5, td - sh.t0))) + 0.08 : 0.1, { roll: -0.35 - 2.6 * u, yaw: 1.8 * u * u, pitch: -0.2 * u });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 4.2 });
      const sp = S.proj([x, 0, 0.6]); spray(ctx, sp[0], sp[1], H.clamp((t - td) / 1.6), 5, 200);
      FX.no(ctx, sp[0], sp[1] - 220, 56, ramp(t, V('cartwheel', 'break') - 0.1, 0.25)); flash = 0.15 * Math.exp(-Math.pow((t - td) * 5, 2));
      const cp = S.proj([0, 0, 0]); tally(ctx, cp[0], H_ * 0.14, '≈ 230 km/h', ramp(t, V('hard', 'two') - 0.1, 0.3) * (1 - ramp(t, td - 0.3, 0.3)), 54);
    } else if (n === 'needs') { // the four things: level, nose up, slow, gentle sink
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.45, 0], 3.2, 2.7, 0.35, 0.25, 0.4, 0.8, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: false });
      const lv = ramp(t, V('needs', 'level') - 0.2, 0.5), nu = ramp(t, V('needs', 'nose') - 0.2, 0.5);
      const P0 = [0, 0.42, 0]; jet767(S, P0, { s: S_J, burn: 0, roll: 0.3 * (1 - lv), pitch: 0.17 * nu });
      if (lv > 0) S.arrow([0, 0.75, -0.95], [0, 0.75, 0.95], P.green, { side: [1, 0, 0], w: 0.07, th: 0.02, noShadow: true });
      const su = ramp(t, V('needs', 'sink') - 0.2, 0.4); if (su > 0) S.arrow([0, 0.35, 0.0], [0, 0.35 - 0.2 * su, 0.0], P.air, { side: [1, 0, 0], w: 0.06, th: 0.02, noShadow: true });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 2.9 });
      const sp = S.proj([0, 0.9, 0]); tally(ctx, sp[0], sp[1] - 60, 'slowest speed', ramp(t, V('needs', 'speed') - 0.1, 0.3) * (1 - ramp(t, V('needs', 'sink') - 0.3, 0.3)), 46);
    } else if (n === 'river' || n === 'bridge') { // the long straight river; over the bridge and down the Hudson
      const isB = n === 'bridge', u = H.clamp((t - sh.t0) / (sh.t1 - sh.t0));
      const x = 26 - 26 * u, y = 1.9 - 1.3 * u;
      const [E, TG] = isB ? [[x + 3.5, y + 0.9, 3.4], [x - 1.5, y - 0.2, 0]] : orbit(t, sh.t0, sh.t1, [6, 0.5, 0], 14, 12, 3.5, 2.8, 1.2, 1.5, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); nyc(S);
      if (isB) jet767(S, [x, y, 0], { s: S_J, burn: 0, pitch: -0.04, yaw: Math.PI });
      else { ferry(S, [2, 0, 1.6], 0.2); ferry(S, [-4, 0, -2], -0.4); }
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: isB ? 5 : 14, dofGap: 8 });
    } else if (n === 'touch') { // touchdown: tail first, the belly, the slide to a stop; water comes in at the back
      const u = H.clamp((t - tTouch) / Math.max(0.5, tStop - tTouch)), x = t < tTouch ? 3.0 * (tTouch - t) : -4.5 * (1 - Math.pow(1 - u, 2));
      const y = t < tTouch ? Math.min(1.2, 0.25 * (tTouch - t)) : 0;
      const cx = x - 0.5;
      const S = Scene([cx + 2.4, 0.55, 2.6], [cx - 0.6, 0.15, 0], W, H_); nyc(S, { bridge: false });
      riverJet(S, x, y, { yaw: Math.PI, pitch: t < tTouch ? 0.16 : 0.16 * (1 - u) });
      const lk = ramp(t, V('leak', 'water') - 0.2, 0.8); if (lk > 0) S.beads([[x + 0.95, 0.0, 0.0], [x + 0.75, 0.05, 0]], [120, 180, 230], -t * 2, { reveal: lk, spacing: 0.03, r: 0.012 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 3.2 });
      const sp = S.proj([x + 0.6, 0, 0]); if (t > tTouch) { spray(ctx, sp[0], sp[1], H.clamp((t - tTouch) / 1.4), 8, 180); spray(ctx, sp[0] - 80, sp[1], H.clamp((t - tTouch - 0.6) / 1.6), 9, 140); }
      const bp = S.proj([x + 0.8, 0.05, 0.1]); ringHi(ctx, bp[0], bp[1], 60, ramp(t, V('leak', 'tears') - 0.1, 0.3), '255,90,70');
      flash = 0.18 * Math.exp(-Math.pow((t - tTouch) * 5, 2));
    } else if (n === 'wings') { // out on the wings, the ferries arrive, everyone off
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.3, 0], 4.2, 3.6, 1.2, 0.9, -0.6, 0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); nyc(S, { bridge: false });
      riverJet(S, 0, -0.02, { pitch: 0.04, yaw: Math.PI });
      wingPeople(S, [0, 0.1, 0], Math.round(4 + 20 * ramp(t, V('wings', 'climb') - 0.2, 3.0)), 3, S_J);
      const fu = ramp(t, V('ferries', 'ferry') - 0.6, 2.0); ferry(S, [1.0 + 4 * (1 - fu), 0, 1.3], 0.3);
      const f2 = ramp(t, V('ferries', 'boats') - 0.3, 2.0); ferry(S, [-1.4 - 3 * (1 - f2), 0, -1.4], -0.3);
      for (const dx of [0.35, -0.55]) S.box((q) => add(rotZ(q, 0.6), [dx, 0.02, 0.22]), 0.12, 0.01, 0.05, [250, 200, 60], { bevel: 0.2 });
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 3.6 });
      FX.confetti(ctx, W, H_, ramp(t, V('all', 'survive'), 2.4), t);
      const cp = S.proj([0, 0.6, 0]); tally(ctx, cp[0], H_ * 0.14, '155 / 155', ramp(t, V('all', 'all') - 0.1, 0.3), 60, '#7ee07a');
    } else if (n === 'geese') { // keeping the flocks away from the flight paths
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2.5, 0], 9, 8, 1.6, 1.2, 0.3, 0.6, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); nyc(S);
      flock(S, [6 - 2.2 * (t - sh.t0), 2.8, 2.5], t, 9, 0.35, Math.PI * 0.85);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 9, dofGap: 6 });
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: one big airliner sitting on the river + "ON A RIVER?" ----------
  const THUMB = (ctx, W, H_) => {
    const S = Scene([1.9, 0.55, 1.6], [-0.15, 0.12, 0], W, H_); nyc(S, { bridge: false });
    riverJet(S, 0, -0.02, { pitch: 0.04, yaw: Math.PI * 0.95 }); wingPeople(S, [0, 0.1, 0], 22, 3, S_J);
    S.render(ctx, W, H_, { bg: sunsetSky, dof: 0, shadows: false });
    finish(ctx, W, H_, 1);
    thumbText(ctx, [['LANDED', 210, 150, '#ffffff'], ['ON A RIVER', 370, 150, '#ffd24a']]);
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const jetHum = (t0, t1, g = 0.09) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 600, gain: g, a: 0.5, minor: true }); };
    const wind = (t0, t1, g = 0.06) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'pink', filter: 'bandpass', f: 900, q: 0.5, gain: g, a: 0.6, minor: true }); };
    const water = (t0, t1, g = 0.05) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'pink', filter: 'lowpass', f: 500, gain: g, a: 0.6, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.3, minor: true });
    jetHum(0, tHit); for (let i = 0; i < 6; i++) k.play('thud', tHit + i * 0.07, { f: 110 + i * 20, gain: 0.25 }); k.play('impact', tHit + 0.1, { gain: 0.45 });
    k.noise(tHit, { dur: 1.6, filter: 'lowpass', f: [[0, 900], [1.6, 120]], gain: 0.12, a: 0.05 }); wind(tHit + 0.8, ST('takeoff'));
    jetHum(ST('takeoff'), ST('glider'), 0.1); k.play('ding', V('climb', 'geese'), { f: 'A5', gain: 0.2 });
    k.noise(V('tested', 'firing'), { dur: 0.5, filter: 'bandpass', f: 1400, q: 2, gain: 0.08 }); k.play('impact', V('tested', 'firing') + 0.8, { gain: 0.4 }); k.play('error', V('tested', 'heavier'), { gain: 0.3 });
    k.noise(V('damage', 'thrust'), { dur: 1.4, filter: 'lowpass', f: [[0, 900], [1.4, 120]], gain: 0.12, a: 0.05 }); k.play('ding', V('contain', 'casings'), { f: 'E6', gain: 0.25 });
    wind(ST('glider'), ST('cockpit')); clunk(V('apu', 'starts'), 1.1); k.noise(V('apu', 'starts'), { dur: 2.5, filter: 'bandpass', f: [[0, 600], [2.5, 2400]], q: 3, gain: 0.05, a: 0.5 });
    k.noise(V('what', 'electricity'), { dur: 1.5, filter: 'bandpass', f: 3000, q: 6, gain: 0.03, minor: true }); k.play('blip', V('computers', 'computers'), { gain: 0.3 }); k.play('success', V('computers', 'stall'), { f: 'C6', gain: 0.3 });
    k.play('swish', V('rat', 'drops'), { gain: 0.35 }); clunk(V('rat', 'drops') + 0.3, 0.8);
    k.play('buzz', V('checklist', 'low'), { gain: 0.25 }); k.play('pop', V('runways', 'laguardia'), { gain: 0.3 }); k.play('pop', V('runways', 'teterboro'), { gain: 0.3 });
    k.play('error', V('reach', 'reach'), { gain: 0.3 }); k.play('ding', V('hudson', 'hudson'), { f: 'E6', gain: 0.35 });
    water(ST('cartwheel'), ST('touch')); k.play('impact', V('cartwheel', 'digs'), { gain: 0.45 }); k.noise(V('cartwheel', 'digs'), { dur: 1.4, color: 'pink', filter: 'bandpass', f: 800, q: 0.6, gain: 0.12, a: 0.02 });
    for (const w of ['level', 'nose', 'speed', 'sink']) k.play('pop', V('needs', w), { gain: 0.3, minor: true });
    wind(ST('bridge'), tTouch, 0.08); k.play('impact', tTouch, { gain: 0.5 }); k.noise(tTouch, { dur: Math.max(1, tStop - tTouch), color: 'pink', filter: 'bandpass', f: 700, q: 0.5, gain: 0.14, a: 0.02 });
    k.play('error', V('leak', 'tears'), { gain: 0.25 }); water(tStop, ST('ntsb'));
    k.noise(V('ferries', 'ferry'), { dur: 3, color: 'brown', filter: 'lowpass', f: 300, gain: 0.06, a: 0.6, minor: true });
    k.play('success', V('all', 'survive'), { f: 'C6', gain: 0.5 }); k.play('sparkle', V('all', 'survive') + 0.3, { gain: 0.4, n: 6 });
    k.play('error', V('ntsb', 'heavier'), { gain: 0.25 }); water(ST('geese'), DURATION, 0.05);
    k.play('success', V('lesson', 'second'), { f: 'C6', gain: 0.5 }); k.play('sparkle', V('lesson', 'second') + 0.3, { gain: 0.4, n: 6 });
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
