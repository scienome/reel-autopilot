  // ==================== "What happens if an elevator cable snaps?", 16:9 ====================
  // A real-scale shaft (the snap and the catch) <-> garage rigs (an old single-rope hoist, Otis's wagon-spring platform, a
  // cutaway model of a modern traction elevator: ropes, counterweight, motor brake, governor, rail wedges, buffers) <->
  // the 1854 exhibition and a growing skyline <-> 1945: the Empire State Building in fog, Betty Lou Oliver's fall, the pit.

  const BEATS = window.SCRIPT;
  const SH = [
    ['hook', 0],
    ['teaser1', BEAT0('promise') - 0.15],
    ['teaser2', V('promise', 'nineteen') - 0.15],
    ['hoist', BEAT0('before') - 0.15],
    ['otis', BEAT0('otis') - 0.15],
    ['fair', BEAT0('fair') - 0.15],
    ['skyline', BEAT0('skyline') - 0.15],
    ['ropes', BEAT0('ropes') - 0.15],
    ['counter', BEAT0('counter') - 0.15],
    ['governor', BEAT0('governor') - 0.15],
    ['wedges', BEAT0('wedges') - 0.15],
    ['buffers', BEAT0('buffers') - 0.15],
    ['fog', BEAT0('fog') - 0.15],
    ['impact', BEAT0('hit') - 0.15],
    ['betty', BEAT0('betty') - 0.15],
    ['fall', BEAT0('fall') - 0.15],
    ['pit', BEAT0('coil') - 0.15],
    ['lived', BEAT0('lived') - 0.15],
    ['layers', BEAT0('layers') - 0.15],
    ['finale', BEAT0('today') - 0.15],
  ];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];

  // the hook: forty floors up, the ropes snap, the car drops and the rail brakes catch it
  const tSnap = V('hook', 'snaps'), tGrab = V('answer', 'grabs'), tStop = V('answer', 'stops');
  const hookY = (t) => { const cy0 = 32; if (t < tSnap) return cy0; const dt = Math.min(t, tGrab) - tSnap, v = 1.4 * dt; let y = cy0 - 0.7 * dt * dt; if (t > tGrab) { const d2 = Math.min(t - tGrab, Math.max(0.2, tStop - tGrab)); y -= v * d2 - (v * d2 * d2) / (2 * Math.max(0.2, tStop - tGrab)); } return y; };
  // the Empire State fall: from about the seventy-fifth floor to the basement
  const tFall = V('fall', 'snapped'), tBottom = ST('pit') - 0.2;
  const fallY = (t) => (t < tFall ? 58 : 58 * (1 - Math.pow(H.clamp((t - tFall) / Math.max(1, tBottom - tFall)), 1.6)));
  const modelAt = (S, o = {}) => { stand(S, [0, 0, 0], 0.75, 0.48, 0.28); return shaft(S, [0, 0.3, 0], { h: 2.9, carY: 1.1, ropes: 6, ...o }); };
  const cityScene = (E, TG, W, H_, t) => { const S = Scene(E, TG, W, H_); S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 40], [-60, 0, 40]], [150, 150, 158], { bg: true }); cityBlocks(S, 4, 1, [0, 0]); const tw = tower(S, [0, 0, 0]); return { S, tw }; };

  const EXPLAIN = (ctx, W, H_, t) => {
    let flash = 0;
    const sh = shotAt(t), n = sh.name;
    if (n === 'hook') {
      const cy = hookY(t), sn = ramp(t, tSnap - 0.05, 0.5), br = ramp(t, tGrab - 0.15, 0.3);
      const E = [0.95, cy + 0.7 + 0.15 * Math.sin(t * 0.4), 1.55], TG = [0.05, cy + 0.35, 0];
      const S = Scene(E, TG, W, H_);
      shaft(S, [0, 0, 0], { h: 40, carY: cy, floors: 0.8, snap: sn, brake: br, gov: false, ropes: 6 });
      S.render(ctx, W, H_, { bg: shaftEnv, dof: 0.33, focus: 1.8, shadows: false });
      const rp = S.proj([0, cy + 0.75, 0]); FX.sparks(ctx, rp[0], rp[1], H.clamp((t - tSnap) / 0.6), 3);
      const wp = S.proj([0.28, cy, 0.05]); if (t > tGrab - 0.1 && t < tStop + 0.4) for (let k = 0; k < 2; k++) FX.sparks(ctx, wp[0], wp[1], ((t * 3 + k * 0.5) % 1), 30 + k + Math.floor(t * 3));
      ringHi(ctx, wp[0], wp[1], 60, ramp(t, tStop - 0.1, 0.3));
      flash = 0.18 * Math.exp(-Math.pow((t - tSnap) * 5, 2));
    } else if (n === 'teaser1') { // Otis's platform at the fair
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.8, 0], 5.6, 5.0, 0.6, 0.4, -0.5, -0.2, [0, 0.1, 0]);
      const S = Scene(E, TG, W, H_); S.quad([[-40, 0, -40], [40, 0, -40], [40, 0, 40], [-40, 0, 40]], P.floor, { bg: true, grid: [0.6, 'rgba(150,104,84,0.3)'] });
      otisRig(S, [0, 0, 0], { height: 3.0, platY: 2.2, load: 'man' }); crowd(S, 0, 1.0, 14, 3, 1.8);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 5 });
    } else if (n === 'teaser2' || n === 'lived') { // the tower: in fog in 1945, and clear afterwards
      const foggy = n === 'teaser2';
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 6.5, 0], 19, 16, 1.5, 0.5, foggy ? 0.5 : -0.4, foggy ? 0.8 : -0.1, [0, 0, 0]);
      const { S, tw } = cityScene(E, TG, W, H_, t);
      S.render(ctx, W, H_, { bg: foggy ? fogSky : sunsetSky, dof: 0.33, focus: 18, dofGap: 12 });
      if (foggy) fog(ctx, W, H_, 0.35);
      if (!foggy) { const tp = S.proj(tw.top); ringHi(ctx, tp[0], tp[1] + 60, 70, ramp(t, V('back', 'top') - 0.1, 0.3)); FX.confetti(ctx, W, H_, ramp(t, V('back', 'top') + 0.2, 2.4), t); }
    } else if (n === 'hoist') { // an old single-rope hoist: the rope breaks, the platform drops
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.5, 0], 5.0, 4.4, 0.5, 0.35, 0.5, 0.0, [0, 0.0, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.65, 0.4, 0.12);
      const up = 0.3 + 1.6 * ramp(t, sh.t0, 2.0), tb = V('breaks', 'broke'), dropU = H.clamp((t - tb) / 0.5);
      const py = t < tb ? up : Math.max(0.3, up - 1.6 * dropU * dropU);
      otisRig(S, [0, 0.12, 0], { plain: true, platY: py, load: 'crates', cut: ramp(t, tb - 0.05, 0.4) });
      S.render(ctx, W, H_, { dof: 0.33, focus: 4.3 });
      const pp = S.proj([0, 0.5, 0.3]); FX.sparks(ctx, pp[0], pp[1], H.clamp((t - tb - 0.5) / 0.6), 5);
      const np = S.proj([0, 2.4, 0]); FX.no(ctx, np[0], np[1], 60, ramp(t, V('stairs', 'nobody') - 0.1, 0.25));
      flash = 0.15 * Math.exp(-Math.pow((t - tb - 0.5) * 5, 2));
    } else if (n === 'otis') { // the wagon spring, the teeth, the snap, fail-safe
      const close = ramp(t, V('teeth', 'teeth') - 0.6, 0.8) * (1 - ramp(t, V('failsafe', 'clever') - 0.5, 0.8));
      const [E0, T0] = orbit(t, sh.t0, sh.t1, [0, 1.6, 0], 4.4, 3.6, 0.4, 0.25, -0.45, 0.35, [0, 0.0, 0]);
      const E = lerp3(E0, [1.5, 1.95, 1.7], close * 0.6), TG = lerp3(T0, [0.25, 1.9, 0], close * 0.6);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.65, 0.4, 0.12);
      const tc = V('snap', 'breaks'), cut = ramp(t, tc - 0.05, 0.4), fl = ramp(t, tc, 0.25), py = 1.25 - 0.06 * ramp(t, tc, 0.2);
      const spU = popU(t, V('spring', 'spring') - 0.1, 0.4);
      otisRig(S, [0, 0.12, 0], { platY: py, flat: spU > 0 ? fl : 0, cut, hi: ramp(t, V('teeth', 'teeth') - 0.1, 0.3) * (1 - ramp(t, V('snap', 'breaks') - 0.3, 0.3)), load: 'crates' });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.4 });
      const sp = S.proj([0, py + 0.12 + 0.75, 0]); ringHi(ctx, sp[0], sp[1], 70, ramp(t, V('taut', 'bow') - 0.1, 0.3) * (1 - ramp(t, V('teeth', 'teeth') - 0.3, 0.3)));
      for (const sx of [-1, 1]) { const pp = S.proj([sx * 0.36, py + 0.12 + 0.66, 0.05]); FX.sparks(ctx, pp[0], pp[1], H.clamp((t - tc - 0.1) / 0.6), 7 + sx); ringHi(ctx, pp[0], pp[1], 44, ramp(t, V('failsafe', 'trigger') - 0.1, 0.3), '126,224,122'); }
    } else if (n === 'fair') { // New York, 1854: up high, the rope is cut, a few inches, all safe
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2.0, 0], 6.0, 4.6, 0.3, 0.6, 0.4, -0.25, [0, 0.2, 0]);
      const S = Scene(E, TG, W, H_); S.quad([[-40, 0, -40], [40, 0, -40], [40, 0, 40], [-40, 0, 40]], P.floor, { bg: true, grid: [0.6, 'rgba(150,104,84,0.3)'] });
      S.box((q) => add(q, [0, 1.6, -5]), 7, 1.6, 0.6, P.glass, { alpha: 0.35, bevel: 0.02 });
      const tc = V('cut', 'cut'), py = 0.3 + 1.9 * ramp(t, sh.t0, 2.6) - 0.1 * ramp(t, tc + 0.1, 0.25);
      otisRig(S, [0, 0, 0], { height: 3.0, platY: py, load: 'man', cut: ramp(t, tc - 0.05, 0.4), flat: ramp(t, tc + 0.05, 0.2), arm: ramp(t, V('safe', 'safe') - 0.2, 0.4) });
      crowd(S, 0, 1.0, 16, 3, 1.8);
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 5 });
      const rp = S.proj([0, py + 1.1, 0]); FX.sparks(ctx, rp[0], rp[1], H.clamp((t - tc) / 0.6), 9);
      FX.confetti(ctx, W, H_, ramp(t, V('safe', 'safe', 2), 2.0), t);
    } else if (n === 'skyline') { // skyscrapers rise
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 2.5, -8], 18, 15, 3.5, 2.5, -0.3, 0.2, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); S.quad([[-60, 0, -60], [60, 0, -60], [60, 0, 40], [-60, 0, 40]], [150, 150, 158], { bg: true });
      cityBlocks(S, 4, 0.15 + 0.85 * ramp(t, V('skyline', 'decades') - 0.3, 2.2));
      S.render(ctx, W, H_, { bg: sunsetSky, dof: 0.33, focus: 18, dofGap: 14 });
    } else if (n === 'ropes' || n === 'counter') { // the cutaway model: several ropes, sheave, counterweight, motor brake
      const isR = n === 'ropes';
      const [E, TG] = isR ? orbit(t, sh.t0, sh.t1, [0, 1.75, 0], 3.2, 2.8, 0.1, 0.25, 0.55, 0.2, [0, 0, 0]) : orbit(t, sh.t0, sh.t1, [0.2, 2.6, 0], 3.6, 3.0, 0.3, 0.2, -0.3, 0.25, [0, 0, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const nr = isR ? 1 + Math.floor(5 * ramp(t, V('ropes', 'several') - 0.2, 2.0)) : 6;
      const off = !isR && t > V('motorbrake', 'power') - 0.1;
      const cy = isR ? 1.1 : 1.1 + (off ? 0 : 0.35 * Math.sin((t - sh.t0) * 0.9));
      const m = modelAt(S, { ropes: nr, carY: cy });
      S.render(ctx, W, H_, { dof: 0.33, focus: isR ? 3.0 : 3.3 });
      if (!isR) { const cp = S.proj(m.cw); ringHi(ctx, cp[0], cp[1], 60, ramp(t, V('counter', 'counterweight') - 0.1, 0.3) * (1 - ramp(t, V('counter', 'motor') - 0.2, 0.3)));
        const mp = S.proj(add(m.sheave, [0, 0.1, -0.2])); ringHi(ctx, mp[0], mp[1], 70, ramp(t, V('motorbrake', 'brake') - 0.1, 0.3), off ? '126,224,122' : '255,210,74'); FX.no(ctx, mp[0] + 110, mp[1] - 40, 40, ramp(t, V('motorbrake', 'power') - 0.1, 0.25) * (1 - ramp(t, V('motorbrake', 'springs') - 0.2, 0.3))); }
      else { const rp = S.proj(add(m.carTop, [0, 0.5, 0])); ringHi(ctx, rp[0], rp[1], 60, ramp(t, V('ropes', 'one') - 0.1, 0.3) * (1 - ramp(t, V('ropes', 'several') - 0.2, 0.3))); }
    } else if (n === 'governor') { // the governor spins with the car; too fast and the weights swing out and trip the clamp
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.4, 2.9, 2.6], [-0.25, 2.3, 0], [0.0, 3.0, 1.6], [-0.4, 2.8, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const fastU = ramp(t, V('weights', 'fast') - 0.2, 0.6), spin = integ((u) => 3 + 9 * ramp(u, V('weights', 'fast') - 0.2, 0.6), t, 1 / 20);
      const m = modelAt(S, { govSpin: spin, fly: ramp(t, V('weights', 'outward') - 0.2, 0.4), carY: 1.1 + 0.3 * Math.sin((t - sh.t0) * 0.8) - 0.4 * fastU });
      S.render(ctx, W, H_, { dof: 0.33, focus: 2.0 });
      const gp = S.proj(m.gov); FX.spin(ctx, gp[0], gp[1], 80, ramp(t, V('governor', 'governor') - 0.1, 0.6), -spin);
      ringHi(ctx, gp[0], gp[1], 110, ramp(t, V('weights', 'clamp') - 0.1, 0.3), '255,90,70');
    } else if (n === 'wedges') { // the lever jams the wedges against the rails
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.9, 1.5, 1.7], [0.15, 1.35, 0], [0.7, 1.45, 1.25], [0.2, 1.38, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const br = ramp(t, V('wedges', 'wedges') - 0.15, 0.3), cy = 1.1 - 0.06 * br;
      const m = modelAt(S, { carY: cy, brake: br, govSpin: 6, fly: 1 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.8 });
      const wp = S.proj(m.wedge); FX.sparks(ctx, wp[0], wp[1], H.clamp((t - V('wedges', 'wedges')) / 0.6), 21); ringHi(ctx, wp[0], wp[1], 56, ramp(t, V('wedges', 'squeezes') - 0.1, 0.3));
    } else if (n === 'buffers') {
      const [E, TG] = dolly(t, sh.t0, sh.t1, [0.9, 0.75, 1.9], [0.25, 0.45, 0], [0.6, 0.65, 1.4], [0.25, 0.42, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const m = modelAt(S, { carY: 0.55 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 1.8 });
      const bp = S.proj(m.pit); ringHi(ctx, bp[0], bp[1], 60, ramp(t, V('buffers', 'buffers') - 0.1, 0.3));
    } else if (n === 'fog' || n === 'impact') { // 1945: the bomber in the fog
      const tI = V('fog', 'flew') + 0.4, isF = n === 'fog';
      const [E, TG] = isF ? orbit(t, sh.t0, sh.t1, [0, 7.0, 0], 13, 10, 1.5, 0.6, 0.9, 0.6, [0, 0, 0]) : dolly(t, sh.t0, sh.t1, [3.2, 8.6, 5.2], [0, 7.9, 0], [2.6, 8.4, 4.4], [0, 7.8, 0]);
      const { S, tw } = cityScene(E, TG, W, H_, t);
      if (t < tI) { const u = H.clamp((t - (tI - 6)) / 6), P0 = lerp3([-9, 7.95, 7], add(tw.f79, [-0.35, 0.05, 0]), u); bomber(S, P0, { s: 0.45, yaw: Math.atan2(7 - 0.46, 9), prop: t * 30 }); }
      S.render(ctx, W, H_, { bg: fogSky, dof: 0.33, focus: isF ? 12 : 5, dofGap: 8 });
      const fp = S.proj(tw.f79);
      if (t > tI) { FX.heat(ctx, fp[0], fp[1], 140, ramp(t, tI, 0.5), t, 'rgba(255,120,40,0.9)'); puffs(ctx, fp[0], fp[1] - 20, ((t - tI) / 2.5) % 1, 11, '90,90,96', 70); }
      fog(ctx, W, H_, isF ? 0.38 : 0.22);
      flash = 0.3 * Math.exp(-Math.pow((t - tI) * 4, 2));
      if (!isF) { const sp = S.proj(tw.shaft); ringHi(ctx, sp[0], sp[1], 60, ramp(t, V('hit', 'shaft') - 0.1, 0.3), '255,90,70'); }
    } else if (n === 'betty' || n === 'fall') { // the car high in the shaft, the cables snap, the long fall
      const cy = n === 'betty' ? 58 : fallY(t), sn = n === 'fall' ? ramp(t, tFall - 0.05, 0.5) : 0;
      const E = [1.0, cy + 0.9 + (n === 'fall' ? 0.6 * ramp(t, tFall, 1.5) : 0), 1.7], TG = [0.05, cy + 0.3, 0];
      const S = Scene(E, TG, W, H_);
      shaft(S, [0, 0, 0], { h: 62, carY: cy, floors: 0.78, snap: sn, gov: false, ropes: 6 });
      S.render(ctx, W, H_, { bg: shaftEnv, dof: 0.33, focus: 2.0, shadows: false });
      if (n === 'fall') { const rp = S.proj([0, cy + 0.75, 0]); FX.sparks(ctx, rp[0], rp[1], H.clamp((t - tFall) / 0.6), 13); const ff = ramp(t, tFall + 0.4, 0.6); ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.25 * ff})`; ctx.lineWidth = 3; const r = H.rng(Math.floor(t * 12)); for (let i = 0; i < 14; i++) { const x = r() * W, y = r() * H_; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 120 * ff); ctx.stroke(); } ctx.restore(); }
      flash = n === 'fall' ? 0.18 * Math.exp(-Math.pow((t - tFall) * 5, 2)) : 0;
    } else if (n === 'pit') { // cables coiling like a spring, the air cushion
      const cy = 0.42 + 1.4 * (1 - ramp(t, sh.t0, Math.max(1, BEATEND('air') - sh.t0)));
      const [E, TG] = dolly(t, sh.t0, sh.t1, [1.2, 1.1, 2.1], [0.05, 0.6, 0], [1.0, 0.9, 1.7], [0.05, 0.5, 0]);
      const S = Scene(E, TG, W, H_);
      shaft(S, [0, 0, 0], { h: 62, carY: cy, floors: 0.78, snap: 1, gov: false, ropes: 6, coil: ramp(t, V('coil', 'cables') - 0.2, 2.0) });
      const au = ramp(t, V('air', 'air') - 0.2, 0.5);
      if (au > 0) for (const dx of [-0.16, 0, 0.16]) S.arrow([dx, 0.05, 0.15], [dx, 0.05 + Math.max(0.1, (cy - 0.1) * au), 0.15], P.air, { side: [1, 0, 0], w: 0.06, th: 0.02, noShadow: true });
      S.render(ctx, W, H_, { bg: shaftEnv, dof: 0.33, focus: 2.1, shadows: false });
      const cp = S.proj([0, 0.2, 0.1]); ringHi(ctx, cp[0], cp[1], 70, ramp(t, V('coil', 'coiling') - 0.1, 0.3) * (1 - ramp(t, V('air', 'second') - 0.2, 0.3)));
    } else if (n === 'layers') { // every layer would have to fail at once
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.75, 0], 5.4, 4.8, 0.4, 0.3, -0.4, 0.3, [0, -0.15, 0]);
      const S = Scene(E, TG, W, H_); garage(S);
      const m = modelAt(S, { govSpin: t * 2, carY: 1.2 });
      S.render(ctx, W, H_, { dof: 0.33, focus: 5 });
      const hi = [[add(m.carTop, [0, 0.6, 0]), 'ropes'], [m.gov, 'governor'], [m.wedge, 'rail'], [m.pit, 'buffers']];
      for (const [p, w] of hi) { const q = S.proj(p); ringHi(ctx, q[0], q[1], 54, ramp(t, V('layers', w) - 0.1, 0.3), '126,224,122'); }
    } else if (n === 'finale') { // and it all started with a wagon spring
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 1.6, 0], 4.2, 3.4, 0.4, 0.3, 0.6, 0.1, [0, 0.1, 0]);
      const S = Scene(E, TG, W, H_); garage(S); stand(S, [0, 0, 0], 0.65, 0.4, 0.12);
      otisRig(S, [0, 0.12, 0], { platY: 1.25 + 0.15 * Math.sin(t * 0.8), load: 'crates' });
      S.render(ctx, W, H_, { dof: 0.33, focus: 3.6 });
      const sp = S.proj([0, 1.25 + 0.15 * Math.sin(t * 0.8) + 0.9, 0]); ringHi(ctx, sp[0], sp[1], 70, ramp(t, V('today', 'wagon') - 0.1, 0.3));
      FX.confetti(ctx, W, H_, ramp(t, V('today', 'spring'), 2.4), t);
    }
    const cap = captionAt(WORDS, t);
    if (cap) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
  };

  // ---------- thumbnail: one big elevator car with snapped cables + "CABLE SNAPS?" ----------
  const THUMB = (ctx, W, H_) => {
    const S = Scene([0.75, 30.7, 1.25], [0.25, 30.45, 0], W, H_);
    shaft(S, [0, 0, 0], { h: 40, carY: 30, floors: 0.8, snap: 0.5, gov: false, ropes: 6, brake: 0 });
    S.render(ctx, W, H_, { bg: shaftEnv, dof: 0, shadows: false });
    const rp = S.proj([0, 30.75, 0]); FX.sparks(ctx, rp[0], rp[1], 0.35, 3); FX.sparks(ctx, rp[0] + 30, rp[1] - 20, 0.5, 8);
    finish(ctx, W, H_, 1);
    thumbText(ctx, [['CABLE', 330, 190, '#ffffff'], ['SNAPS?', 520, 190, '#ffd24a']], 1030);
  };

  // ---------- sound ----------
  function scoreSound(k) {
    const clunk = (t, g = 1, p = 0) => { k.play('tock', t, { f: 240, gain: 0.4 * g, pan: p }); k.noise(t, { dur: 0.05, filter: 'bandpass', f: 2400, q: 2, gain: 0.12 * g, a: 0.001, pan: p, minor: true }); };
    const hum = (t0, t1, g = 0.06) => { if (t1 > t0) k.noise(t0, { dur: t1 - t0, color: 'brown', filter: 'lowpass', f: 300, gain: g, a: 0.4, minor: true }); };
    const squeal = (t, d = 1.2, g = 0.08) => k.noise(t, { dur: d, filter: 'bandpass', f: 3200, q: 8, gain: g, a: 0.02 });
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.45, gain: 0.3, minor: true });
    hum(0, tSnap); k.play('impact', tSnap, { gain: 0.45 }); k.play('stamp', tSnap + 0.05, { gain: 0.3 });
    k.noise(tSnap, { dur: Math.max(0.5, tGrab - tSnap), color: 'pink', filter: 'bandpass', f: 900, q: 0.6, gain: 0.08, a: 0.1 }); squeal(tGrab, Math.max(0.4, tStop - tGrab + 0.2)); k.play('thud', tStop, { f: 70, gain: 0.4 });
    k.play('riser', V('promise', 'survived') - 0.4, { gain: 0.25 });
    // hoist + Otis
    k.noise(ST('hoist'), { dur: 2.0, filter: 'bandpass', f: 600, q: 3, gain: 0.04, minor: true }); k.play('stamp', V('breaks', 'broke'), { gain: 0.35 }); k.play('impact', V('breaks', 'broke') + 0.5, { gain: 0.4 }); k.play('buzz', V('stairs', 'nobody'), { gain: 0.25 });
    clunk(V('spring', 'spring')); clunk(V('spring', 'middle'), 0.7); k.play('pop', V('teeth', 'teeth'), { gain: 0.3 });
    k.play('stamp', V('snap', 'breaks'), { gain: 0.35 }); clunk(V('snap', 'breaks') + 0.15, 1.3); k.play('ding', V('failsafe', 'trigger'), { f: 'E6', gain: 0.3 });
    // the fair
    k.noise(ST('fair'), { dur: ST('skyline') - ST('fair'), color: 'pink', filter: 'bandpass', f: 1100, q: 0.4, gain: 0.04, a: 0.6, minor: true });
    k.play('stamp', V('cut', 'cut'), { gain: 0.4 }); clunk(V('drop', 'stopped'), 1.2); k.play('success', V('safe', 'safe'), { f: 'C6', gain: 0.4 }); k.play('sparkle', V('safe', 'safe', 2), { gain: 0.35, n: 5 });
    k.play('riser', V('skyline', 'decades'), { gain: 0.2 });
    // the model
    for (let i = 0; i < 5; i++) clunk(V('ropes', 'several') + i * 0.4, 0.6);
    hum(ST('counter'), V('motorbrake', 'power')); k.play('error', V('motorbrake', 'power'), { gain: 0.25 }); clunk(V('motorbrake', 'springs'), 1.2);
    k.noise(V('governor', 'governor'), { dur: 2.4, filter: 'bandpass', f: 1400, q: 3, gain: 0.04, a: 0.3, minor: true });
    k.noise(V('weights', 'fast'), { dur: 1.2, filter: 'bandpass', f: [[0, 1400], [1.2, 2600]], q: 3, gain: 0.06, a: 0.1 }); clunk(V('weights', 'clamp'), 1.0);
    squeal(V('wedges', 'wedges'), 1.0); k.play('thud', V('wedges', 'squeezes') + 0.2, { f: 70, gain: 0.3 }); k.play('pop', V('buffers', 'buffers'), { gain: 0.3 });
    // 1945
    k.noise(ST('fog'), { dur: V('fog', 'flew') + 0.4 - ST('fog'), color: 'brown', filter: 'bandpass', f: [[0, 200], [4, 420]], q: 1.5, gain: 0.09, a: 1.0 });
    k.play('impact', V('fog', 'flew') + 0.4, { gain: 0.55 }); k.noise(V('fog', 'flew') + 0.4, { dur: 2.5, color: 'brown', filter: 'lowpass', f: 400, gain: 0.12, a: 0.02 });
    hum(ST('betty'), tFall, 0.05); k.play('stamp', tFall, { gain: 0.35 }); k.noise(tFall, { dur: Math.max(1, tBottom - tFall), color: 'pink', filter: 'bandpass', f: [[0, 400], [3, 1400]], q: 0.6, gain: 0.1, a: 0.3 });
    k.play('impact', ST('pit'), { gain: 0.45 }); k.noise(V('air', 'air'), { dur: 1.6, color: 'pink', filter: 'lowpass', f: 600, gain: 0.07, a: 0.2 });
    k.play('success', V('lived', 'lived'), { f: 'C6', gain: 0.4 }); k.play('ding', V('back', 'top'), { f: 'E6', gain: 0.3 });
    for (const w of ['ropes', 'governor', 'rail', 'buffers']) k.play('pop', V('layers', w), { gain: 0.3, minor: true });
    k.play('success', V('today', 'spring'), { f: 'C6', gain: 0.55 }); k.play('sparkle', V('today', 'spring') + 0.3, { gain: 0.45, n: 6 });
  }

  window.LESSON = { BEATS, DURATION, SH, WORDS, CHAPTERS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
