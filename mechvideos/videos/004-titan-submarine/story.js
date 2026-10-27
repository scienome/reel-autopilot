  // ==================== "How the Titan submarine imploded", 16:9 ====================
  // The deep (the Titan descending, the implosion, the search) <-> garage explainers (a piano on a fingertip, a can, a
  // titanium sphere, the carbon-fibre hull built part by part, dive cycles and hidden damage, the implosion in cutaway,
  // a pressure-test chamber) <-> the surface at dawn and dusk. Kept on the engineering; no people are shown.

  const BEATS = window.SCRIPT;
  const SH = [
    ['hook', 0],
    ['people', BEAT0('people') - 0.15],
    ['promise', BEAT0('promise') - 0.15],
    ['surface', BEAT0('depth') - 0.15],
    ['descend', BEAT0('column') - 0.15],
    ['piano', BEAT0('piano') - 0.15],
    ['can', BEAT0('squeeze') - 0.15],
    ['sphere', BEAT0('sphere') - 0.15],
    ['alvin', BEAT0('alvin') - 0.15],
    ['hull', BEAT0('tube') - 0.15],
    ['cycle', BEAT0('cycle') - 0.15],
    ['bang', BEAT0('bang') - 0.15],
    ['launch', BEAT0('dive') - 0.15],
    ['last', BEAT0('descent') - 0.15],
    ['collapse', BEAT0('collapse') - 0.15],
    ['search', BEAT0('search') - 0.15],
    ['report', BEAT0('report') - 0.15],
    ['chamber', BEAT0('classed') - 0.15],
    ['deepest', BEAT0('deepest') - 0.15],
    ['finale', BEAT0('lesson') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];

  // a classic research sub: a titanium crew sphere at the front of a white frame
  const sphereSub = (S, P0, t) => { tiSphere(S, P0, 0.9, { stand: false }); S.box((q) => add(q, add(P0, [-1.6, 0.2, 0])), 1.3, 0.75, 0.7, TI.white, { bevel: 0.2 }); S.box((q) => add(q, add(P0, [-1.4, 1.0, 0])), 0.8, 0.15, 0.25, [220, 80, 60], { bevel: 0.3 }); for (const sz of [-0.5, 0.5]) S.ico(add(P0, [0.9, 0.6, sz]), 0.09, [255, 244, 200], { sub: 0, glow: true, noShadow: true }); void t; };
  // a calm sea surface from just above the water; o.ship, o.platform (Titan on its launch platform)
  const surfaceShot = (ctx, W, H_, t, E, TG, o = {}) => {
    const S = seaScene(E, TG, W, H_, t, { clouds: true });
    if (o.ship !== false) supportShip(S, [-6, -0.3, -4]);
    if (o.platform) { S.box((q) => add(q, [0, 0.12, 0]), 3.2, 0.12, 1.6, [70, 72, 82], { bevel: 0.05 }); titanSub(S, [0, 1.25 - 1.6 * (o.sink || 0), 0], {}); }
    S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, shadows: false, focus: o.focus || 9, dofGap: 10 });
  };
  const tImp = V('hook', 'crushed');

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'hook') { // descending in the dark; at "crushed" the hull collapses
      const P0 = [0, 4.2 - 0.25 * t, 0], cr = ramp(t, tImp - 0.05, 0.25);
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 11, 9.5, 1.2, 0.8, 0.9, 1.2, [0, -0.3, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -3); wreckBow(S, [-6, -3, -10], { yaw: 0.4 });
      if (cr < 0.99) titanSub(S, P0, { crush: cr, lights: 1 });
      S.render(ctx, W, H_, deepEnv);
      const p = S.proj(P0); shock(ctx, p[0], p[1], H.clamp((t - tImp) / 0.9), 420); bubbles(ctx, p[0], p[1], ramp(t, tImp, 3), 7, 140, 260);
      deepGrade(ctx, W, H_, t);
      flash = 0.45 * Math.exp(-Math.pow((t - tImp) * 6, 2));
    } else if (n === 'people') { // only the dark water, looking up toward the light
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0, 0, 6], [0, 3, 0], [0, 0.6, 5], [0, 5, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -3);
      S.render(ctx, W, H_, deepEnv);
      ctx.save(); const g = ctx.createRadialGradient(W / 2, -H_ * 0.2, 10, W / 2, -H_ * 0.2, H_ * 0.9); g.addColorStop(0, 'rgba(160,200,230,0.35)'); g.addColorStop(1, 'rgba(160,200,230,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore();
      deepGrade(ctx, W, H_, t, 0.45);
    } else if (n === 'promise') { // the two kinds of hull, side by side
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.1, 0], 4.0, 3.4, 0.6, 0.4, -0.4, 0.3, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      carbonHull(S, [-0.9, 1.15, 0], t); tiSphere(S, [1.1, 1.15, 0], 0.4);
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
    } else if (n === 'surface') { // the North Atlantic: the wreck is 3,800 m below
      const [E, TG] = dolly(t, sh.t0, sh.t1, [8, 2.4, 10], [-3, 0.8, -2], [6, 1.6, 8], [-3, 0.2, -2]);
      surfaceShot(ctx, W, H_, t, E, TG);
      tally(ctx, W / 2, H_ * 0.18, '3,800 m', ramp(t, V('depth', 'three') - 0.1, 0.3));
    } else if (n === 'descend') { // going down: depth and pressure climb together
      const u = ramp(t, sh.t0, Math.max(1, ST('piano') - sh.t0 - 0.5)), d = 3800 * u;
      const P0 = [0, 2.5 + 0.2 * Math.sin(t), 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 10, 8.5, 0.8, 0.4, -0.6, -0.2, [0, -0.2, 0]);
      const S = Scene(E, TG, W, H_); if (u > 0.85) { deepFloor(S, -3 + 6 * (1 - u) / 0.15 * 0); wreckBow(S, [-5, -3, -9], { yaw: 0.4 }); }
      titanSub(S, P0, { lights: 1 });
      S.render(ctx, W, H_, { ...deepEnv, bg: (c2, w, h) => { const g = c2.createLinearGradient(0, 0, 0, h); const k = 1 - u; g.addColorStop(0, `rgb(${30 + 60 * k},${70 + 110 * k},${110 + 110 * k})`); g.addColorStop(1, `rgb(${8 + 40 * k},${24 + 80 * k},${42 + 100 * k})`); c2.fillStyle = g; c2.fillRect(0, 0, w, h); } });
      deepGrade(ctx, W, H_, t, 0.2 + 0.2 * u);
      tally(ctx, W * 0.3, H_ * 0.16, Math.round(d / 10) * 10 + ' m', 1); tally(ctx, W * 0.7, H_ * 0.16, Math.round(1 + d / 10) + ' atm', ramp(t, V('column', 'atmosphere') - 0.2, 0.3), 54, '#7ad0ff');
    } else if (n === 'piano') { // a grand piano on a fingertip
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 2.6, 2.1, 0.4, 0.25, 0.5, -0.1, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const drop = flyIn(t, V('piano', 'piano'), 0.5, [0, 1.4, 0]);
      if (drop) { const S2c = add([0, 1.0, 0], [0, 0, 0]); pianoOnTip(S, add(S2c, drop), { hot: t > V('piano', 'fingertip') - 0.2 }); } else stand(S, [0, 0, 0], 0.4, 0.3, 0.95);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.4 });
      const tp = S.proj([0, 0.98, 0.05]); tally(ctx, tp[0] + 260, tp[1] - 60, '≈ 400 kg / cm²', ramp(t, V('piano', 'four') - 0.1, 0.3), 46);
    } else if (n === 'can') { // squeezed from every direction; an empty can is crushed
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.15, 0], 2.2, 1.8, 0.35, 0.25, -0.3, 0.3, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.35, 0.3, 0.9);
      const cu = ramp(t, V('can', 'crushed') - 0.1, 0.25);
      crushCan(S, [0, 0.92, 0], cu);
      squeeze(S, [0, 1.13, 0], 0.18, ramp(t, V('squeeze', 'squeezed') - 0.2, 0.5), 10, P.orange, 0.3, { w: 0.7 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
      flash = 0.12 * Math.exp(-Math.pow((t - V('can', 'crushed')) * 6, 2));
    } else if (n === 'sphere') { // the titanium sphere: even pressure, decades of tests
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.0, 2.5, 0.4, 0.3, 0.4, -0.3, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      tiSphere(S, [0, 1.2, 0], 0.45, { glass: ramp(t, V('sphere', 'crew') - 0.2, 0.5) * 0.8 });
      squeeze(S, [0, 1.2, 0], 0.45, ramp(t, V('even', 'evenly') - 0.2, 0.6), 12, P.orange, 0.35);
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      const sp = S.proj([0, 1.2, 0.5]); ringHi(ctx, sp[0], sp[1], 150, ramp(t, V('metal', 'tests') - 0.1, 0.3), '126,224,122');
    } else if (n === 'alvin') { // a classic sphere sub at work
      const P0 = [0, 1.2 + 0.2 * Math.sin(t * 0.7), 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 8, 7, 0.6, 0.3, 0.7, 1.1, [0, -0.3, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -1.5); sphereSub(S, P0, t);
      S.render(ctx, W, H_, deepEnv); deepGrade(ctx, W, H_, t);
      tally(ctx, W / 2, H_ * 0.16, '5,000+ dives', ramp(t, V('alvin', 'five') - 0.1, 0.3));
    } else if (n === 'hull') { // Titan's hull, part by part: tube, domes, rings; pulled vs squeezed; layers; joints
      const look = ramp(t, V('mismatch', 'joints') - 0.6, 0.8);
      const [E0, T0] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.4, 2.8, 0.5, 0.35, 0.55, -0.25, [0, 0.05, 0]);
      const E = lerp3(E0, [1.6, 1.55, 1.6], look * 0.7), TG = lerp3(T0, [0.5, 1.3, 0], look * 0.7);
      const S = Scene(E, TG, W, H_); garage(S);
      const de = ramp(t, V('but', 'separate') - 0.2, 0.6);
      const h = carbonHull(S, [0, 1.2, 0], t, { tubeT: V('tube', 'carbon'), capT: V('caps', 'dome'), ringT: V('caps', 'rings'), layers: true, delam: de, joint: ramp(t, V('mismatch', 'joints') - 0.2, 0.4) });
      const pu = ramp(t, V('why', 'pull') - 0.2, 0.5) * (1 - ramp(t, V('but', 'squeezed') - 0.4, 0.3));
      if (pu > 0) for (const sx of [-1, 1]) S.arrow([sx * 1.0, 1.2, 0.0], [sx * (1.0 + 0.5 * pu), 1.2, 0.0], P.green, { side: [0, 1, 0], w: 0.12, th: 0.03, noShadow: true });
      squeeze(S, [0, 1.2, 0], 0.4, ramp(t, V('but', 'squeezed') - 0.2, 0.5) * (1 - ramp(t, V('mismatch', 'titanium') - 0.3, 0.3)), 10, P.orange, 0.35, { long: 2.0 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.0 });
      const jp = S.proj(h.joint); ringHi(ctx, jp[0], jp[1], 60, ramp(t, V('mismatch', 'joints') - 0.1, 0.3), '255,90,70');
      const mp = S.proj([0, 1.6, 0]); FX.no(ctx, mp[0], mp[1] - 60, 50, ramp(t, V('new', 'never') - 0.1, 0.25));
    } else if (n === 'cycle') { // dive after dive: squeeze, release, damage grows; sensors listen
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.2, 2.7, 0.5, 0.35, -0.5, 0.2, [0, 0.05, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const ph = 0.5 - 0.5 * Math.cos((t - sh.t0) * 2.4), de = ramp(t, V('damage', 'tiny') - 0.2, 2.4);
      carbonHull(S, [0, 1.2, 0], t, { delam: de, crush: 0.02 * ph });
      squeeze(S, [0, 1.2, 0], 0.4, ph, 10, P.orange, 0.35, { long: 2.0 });
      const sn = popU(t, V('sensors', 'sensors') - 0.1, 0.4); if (sn > 0) for (const x of [-0.5, 0.1, 0.6]) S.box((q) => add(q, [x, 1.2 + 0.36, 0.1]), 0.05 * sn, 0.03 * sn, 0.04 * sn, P.blue, { bevel: 0.2 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.9 });
      const gp = S.proj([0, 1.75, 0]); tally(ctx, gp[0], gp[1] - 50, 'dive ' + (1 + Math.floor((t - sh.t0) * 2.4 / TAU)), 1);
      const sp = S.proj([0.1, 1.58, 0.1]); for (let k = 0; k < 3; k++) shock(ctx, sp[0], sp[1], ((t - V('sensors', 'listen')) * 0.7 + k / 3) % 1 * (t > V('sensors', 'listen') ? 1 : 0), 90, '122,208,255');
      const wp = S.proj([0, 1.2, 0.5]); FX.no(ctx, wp[0], wp[1] - 120, 50, ramp(t, V('warning', 'stop') - 0.1, 0.25));
    } else if (n === 'bang') { // the loud bang in 2022 (x-ray: a layer gives); it kept diving
      const P0 = [0, 1.8, 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 8.5, 7.5, 0.6, 0.4, 0.4, 0.8, [0, -0.2, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -2);
      titanSub(S, P0, { glass: 0.85, delam: ramp(t, V('bang', 'bang') - 0.1, 0.3), lights: 1 });
      S.render(ctx, W, H_, deepEnv);
      const p = S.proj(add(P0, [0, 0.9, 0])); shock(ctx, p[0], p[1], H.clamp((t - V('bang', 'bang')) / 0.7), 200, '255,200,160');
      deepGrade(ctx, W, H_, t);
      flash = 0.25 * Math.exp(-Math.pow((t - V('bang', 'bang')) * 6, 2));
    } else if (n === 'launch') { // 18 June 2023: the platform, the dawn
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0.8, 0], 11, 9, 2.5, 1.6, -0.6, -0.2, [0, 0, 0]);
      surfaceShot(ctx, W, H_, t, E, TG, { platform: true, focus: 9 });
    } else if (n === 'last') { // the slow descent; communication stops
      const P0 = [0, 2.5 - 0.15 * (t - sh.t0), 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 9, 8, 0.8, 0.5, -0.8, -0.4, [0, -0.2, 0]);
      const S = Scene(E, TG, W, H_); titanSub(S, P0, { lights: 1 });
      S.render(ctx, W, H_, deepEnv); deepGrade(ctx, W, H_, t, 0.4);
      const p = S.proj(add(P0, [0, 1.6, 0])); const on = 1 - ramp(t, V('lost', 'stopped') - 0.1, 0.2); if (on > 0) for (let k = 0; k < 3; k++) shock(ctx, p[0], p[1], ((t * 0.8 + k / 3) % 1) * on, 110, '122,208,255');
      FX.no(ctx, p[0], p[1], 50, ramp(t, V('lost', 'stopped') - 0.1, 0.25));
    } else if (n === 'collapse') { // cutaway: the pressure wins; a few milliseconds
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.0, 2.6, 0.4, 0.3, 0.3, -0.1, [0, 0.05, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const tc = V('collapse', 'crushed'), cr = ramp(t, tc - 0.05, 0.2);
      carbonHull(S, [0, 1.2, 0], t, { delam: 1, crush: cr, joint: 1 });
      squeeze(S, [0, 1.2, 0], 0.4 * (1 - 0.7 * cr), 1, 10, P.orange, 0.4 + 0.3 * cr, { long: 2.0 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.7 });
      const p = S.proj([0, 1.2, 0]); shock(ctx, p[0], p[1], H.clamp((t - tc) / 0.7), 300); shock(ctx, p[0], p[1], H.clamp((t - V('ms', 'milliseconds')) / 0.7), 300);
      flash = 0.35 * Math.exp(-Math.pow((t - tc) * 6, 2));
    } else if (n === 'search') { // the robot finds the pieces near the Titanic's bow
      const [E, TG] = orbit(t, sh.t0, sh.t1, [2, 0, -2], 11, 9, 3.2, 2.2, 0.6, 0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, 0); wreckBow(S, [-5, 0, -7], { yaw: 0.4 }); titanDebris(S, [3, 0, 0]);
      const ru = ramp(t, V('search', 'robot') - 0.4, 2.5); rov(S, [6 - 3 * ru, 1.2, 2 - 1 * ru], t, { yaw: 0.4 });
      S.render(ctx, W, H_, deepEnv); deepGrade(ctx, W, H_, t);
      const dp = S.proj([3, 0.5, 0]); ringHi(ctx, dp[0], dp[1], 110, ramp(t, V('search', 'pieces') - 0.1, 0.3));
    } else if (n === 'report') { // preventable: never properly tested or independently inspected
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.2, 0], 3.0, 2.6, 0.5, 0.35, -0.3, 0.3, [0, 0.05, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      carbonHull(S, [0, 1.2, 0], t, { layers: true });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.8 });
      const p = S.proj([0, 1.6, 0]); FX.no(ctx, p[0] - 130, p[1] - 40, 50, ramp(t, V('report', 'tested') - 0.1, 0.25)); FX.no(ctx, p[0] + 130, p[1] - 40, 50, ramp(t, V('report', 'inspectors') - 0.1, 0.25));
    } else if (n === 'chamber') { // certified hulls are pressure-tested beyond their depth
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.5, 0], 4.0, 3.4, 0.4, 0.3, 0.5, -0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      tiSphere(S, [0, 1.25, 0], 0.4, { stand: false });
      pressureChamber(S, [0, 0.55, 0], t, { glass: 0.85, gauge: 0.1 + 0.85 * ramp(t, V('classed', 'pressure-tested') - 0.2, 1.6) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.5 });
      const gp = S.proj([0, 1.75, 0.8]); ringHi(ctx, gp[0], gp[1], 60, ramp(t, V('classed', 'beyond') - 0.1, 0.3), '126,224,122');
    } else if (n === 'deepest') { // the deepest point, again and again
      const P0 = [0, 1.2 + 0.2 * Math.sin(t * 0.7), 0];
      const [E, TG] = orbit(t, sh.t0, sh.t1, P0, 8, 7, 0.6, 0.3, -0.7, -0.3, [0, -0.3, 0]);
      const S = Scene(E, TG, W, H_); deepFloor(S, -1.5); sphereSub(S, P0, t);
      S.render(ctx, W, H_, { ...deepEnv, bg: (c2, w, h) => { c2.fillStyle = '#04101c'; c2.fillRect(0, 0, w, h); } }); deepGrade(ctx, W, H_, t, 0.45);
      tally(ctx, W / 2, H_ * 0.16, '≈ 10,900 m', ramp(t, V('deepest', 'deepest') - 0.1, 0.3));
    } else { // the calm surface at dusk
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-3, 0.6, -2], 14, 11, 2.0, 1.4, 0.2, 0.6, [0, 0, 0]);
      surfaceShot(ctx, W, H_, t, E, TG, { focus: 12 });
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: one big crushed carbon hull in the deep + "3,800 M DOWN" ----------
  const THUMB = (ctx, W, H_) => {
    const S = Scene([1.1, 1.45, 1.5], [0.25, 1.2, 0], W, H_);
    carbonHull(S, [0, 1.2, 0], 0, { crush: 0.35, delam: 1, joint: 1, stand: false, s: 0.5 });
    S.render(ctx, W, H_, { bg: deepSky, dof: 0, shadows: false });
    deepGrade(ctx, W, H_, 2, 0.25);
    finish(ctx, W, H_, 1);
    thumbText(ctx, [['3,800 M', 250, 170, '#ffd24a'], ['DOWN', 420, 170, '#ffffff']]);
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const deep = (t0, t1, g = 0.07) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 220, gain: g, a: 0.8, minor: true }); };
    const sea = (t0, t1, g = 0.06) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'pink', filter: 'bandpass', f: 700, q: 0.4, gain: g, a: 0.8, minor: true }); };
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.25, minor: true });
    deep(0, ST('promise')); k.play('impact', tImp, { gain: 0.5 }); k.noise(tImp, { dur: 1.5, color: 'brown', filter: 'lowpass', f: [[0, 900], [1.5, 120]], gain: 0.14, a: 0.005 });
    sea(ST('surface'), ST('descend')); deep(ST('descend'), ST('piano'));
    for (let i = 0; i < 14; i++) k.play('count', ST('descend') + 0.5 + i * 0.5, { gain: 0.25, f: 1600 + i * 60, minor: true });
    k.play('thud', V('piano', 'piano') + 0.05, { f: 60, gain: 0.4 }); k.play('ding', V('piano', 'fingertip'), { f: 'C6', gain: 0.25 });
    k.noise(V('squeeze', 'squeezed'), { dur: 1.2, color: 'brown', filter: 'lowpass', f: 300, gain: 0.08, a: 0.3 }); k.play('impact', V('can', 'crushed'), { gain: 0.4 }); k.noise(V('can', 'crushed'), { dur: 0.4, filter: 'bandpass', f: 2600, q: 2, gain: 0.12, a: 0.005 });
    k.play('ding', V('even', 'evenly'), { f: 'E6', gain: 0.25 }); k.play('success', V('metal', 'tests'), { f: 'C6', gain: 0.3 }); deep(ST('alvin'), ST('hull'));
    clunk(V('tube', 'carbon'), 1.2); clunk(V('caps', 'dome')); clunk(V('caps', 'rings'), 0.8);
    k.noise(V('why', 'pull'), { dur: 0.9, filter: 'bandpass', f: 900, q: 2, gain: 0.05, minor: true }); k.noise(V('but', 'squeezed'), { dur: 1.2, color: 'brown', filter: 'lowpass', f: 300, gain: 0.08, a: 0.3 });
    k.play('glitch', V('but', 'separate'), { gain: 0.25 }); k.play('error', V('mismatch', 'joints'), { gain: 0.3 }); k.play('buzz', V('new', 'never'), { gain: 0.25 });
    for (let i = 0; i < 6; i++) k.noise(ST('cycle') + i * 2.6, { dur: 1.3, color: 'brown', filter: 'lowpass', f: 260, gain: 0.06, a: 0.4, minor: true });
    k.play('blip', V('sensors', 'listen'), { gain: 0.25 }); k.play('blip', V('sensors', 'listen') + 0.5, { gain: 0.2 }); k.play('buzz', V('warning', 'stop'), { gain: 0.2 });
    deep(ST('bang'), ST('launch')); k.play('impact', V('bang', 'bang'), { gain: 0.45 });
    sea(ST('launch'), ST('last')); deep(ST('last'), ST('collapse'));
    for (let i = 0; i < 4; i++) k.play('blip', ST('last') + 0.4 + i * 0.9, { gain: 0.15, minor: true }); k.play('error', V('lost', 'stopped'), { gain: 0.25 });
    k.play('impact', V('collapse', 'crushed'), { gain: 0.5 }); k.noise(V('collapse', 'crushed'), { dur: 1.2, color: 'brown', filter: 'lowpass', f: [[0, 900], [1.2, 120]], gain: 0.12, a: 0.005 });
    deep(ST('search'), ST('report')); k.noise(V('search', 'robot'), { dur: 2.5, filter: 'bandpass', f: 1200, q: 4, gain: 0.03, a: 0.4, minor: true }); k.play('ding', V('search', 'pieces'), { f: 'A5', gain: 0.2 });
    k.play('buzz', V('report', 'tested'), { gain: 0.25 }); k.play('buzz', V('report', 'inspectors'), { gain: 0.2 });
    for (let i = 0; i < 10; i++) k.play('count', V('classed', 'pressure-tested') + i * 0.15, { gain: 0.3, f: 1800 + i * 80, minor: true }); k.play('ding', V('classed', 'beyond'), { f: 'E6', gain: 0.3 });
    deep(ST('deepest'), ST('finale')); sea(ST('finale'), DURATION, 0.07);
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
