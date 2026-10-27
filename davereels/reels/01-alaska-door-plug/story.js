  // Dave reel 01: the door plug that left a jet at 16,000 ft. Dave sits in 26A. R.I.P. Dave #1.
  const BEATS = window.SCRIPT;
  const TBLOW = () => V('press', 'blew'), TSUCK = () => V('out', 'loose') - 0.2;
  const SH = [['sky', 0], ['cabin', BEAT0('plug') - 0.1], ['press', BEAT0('press') - 0.1], ['suck', V('out', 'Air') - 0.1], ['yard', V('phone', 'iPhone') - 0.4]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const CAB = { wall: [236, 232, 226], floor: [74, 82, 104], seat: [52, 74, 128], seat2: [64, 90, 150], panel: [226, 222, 216], bolt: [250, 200, 70] };
  // the cabin: floor, the curved side wall (three flat strips) with windows, a ceiling, two rows of seats. The plug sits at z = 0.
  const PX = -1.75, PY = 1.25, PZ = 0.55;
  const cabin = (S, o = {}) => {
    S.quad([[-1.9, 0, -14], [1.9, 0, -14], [1.9, 0, 10], [-1.9, 0, 10]], CAB.floor, { bg: true, grid: [0.5, 'rgba(0,0,0,0.12)'] });
    const win = (c, w, h) => { for (let z = 0; z < 24; z++) { const x = (z / 24) * w + w / 48; if (Math.abs(z - 14) < 0.5) continue; c.fillStyle = '#b8c4d4'; c.beginPath(); c.roundRect(x - w * 0.012, h * 0.25, w * 0.024, h * 0.5, w * 0.01); c.fill(); c.fillStyle = '#7fb0e6'; c.beginPath(); c.roundRect(x - w * 0.009, h * 0.3, w * 0.018, h * 0.4, w * 0.008); c.fill(); } };
    S.quad([[-1.9, 0, -14], [-1.9, 0, 10], [-1.75, 0.6, 10], [-1.75, 0.6, -14]], shade(CAB.wall, 0.86), { bg: true, flat: true });
    S.quad([[-1.75, 0.6, -14], [-1.75, 0.6, 10], [-1.75, 1.95, 10], [-1.75, 1.95, -14]], CAB.wall, { bg: true, flat: true, paint: win });
    S.quad([[-1.75, 1.95, -14], [-1.75, 1.95, 10], [-1.2, 2.35, 10], [-1.2, 2.35, -14]], shade(CAB.wall, 0.93), { bg: true, flat: true });
    S.quad([[-1.2, 2.35, -14], [-1.2, 2.35, 10], [1.9, 2.35, 10], [1.9, 2.35, -14]], [210, 206, 200], { bg: true, flat: true });
    // overhead bins
    S.box((p) => add(p, [-1.35, 2.1, -2]), 0.38, 0.2, 8, [228, 224, 218], { bevel: 0.1, noShadow: true });
    for (let r = -4; r <= 0; r++) for (const sx of [0, 1, 2]) if (!(r === 0 && sx > 0) || !o.emptyRow) seat(S, [-1.35 + sx * 0.52, 0, r * 0.85]);
  };
  const seat = (S, p) => { S.box((q) => add(q, add(p, [0, 0.45, 0])), 0.24, 0.07, 0.24, CAB.seat, { bevel: 0.3 }); S.box((q) => add(q, add(p, [0, 0.9, -0.24])), 0.24, 0.42, 0.06, CAB.seat2, { bevel: 0.3 }); S.box((q) => add(q, add(p, [0, 0.22, 0])), 0.04, 0.2, 0.2, [90, 94, 104], { bevel: 0.2 }); };
  // the plug: a panel with its own window, four bolt spots; out = 0..1 it leaves through the side
  const plug = (S, o = {}) => {
    const out = o.out || 0, d = out * 6, T = (p) => add([PX - 0.03 - d, PY + out * 1.5, PZ + 0.3 * out], rotZ(rotY(p, out * 2.2), out * 1.5));
    if (out > 0) S.quad([[PX + 0.01, PY - 0.6, PZ - 0.38], [PX + 0.01, PY - 0.6, PZ + 0.38], [PX + 0.01, PY + 0.6, PZ + 0.38], [PX + 0.01, PY + 0.6, PZ - 0.38]], [196, 222, 252], { glow: true, flat: true, noShadow: true });
    if (out < 1) S.box((p) => T(rotY(p, Math.PI / 2)), 0.36, 0.58, 0.025, CAB.panel, { bevel: 0.1, glow: true, paint: (c, w, h) => { c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 4; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#7fb0e6'; c.beginPath(); c.roundRect(w * 0.38, h * 0.28, w * 0.24, h * 0.36, w * 0.08); c.fill(); } });
    if (o.bolts) for (const [y, z] of [[0.5, 0.3], [0.5, -0.3], [-0.5, 0.3], [-0.5, -0.3]]) S.ico([PX + 0.04, PY + y, PZ + z], 0.035, CAB.bolt, { sub: 0, glow: true, noShadow: true });
  };
  const yard = (S) => {
    S.quad([[-30, 0, -30], [30, 0, -30], [30, 0, 20], [-30, 0, 20]], [108, 158, 78], { bg: true });
    for (let x = -6; x <= 6; x += 0.35) { S.box((p) => add(p, [x, 0.5, -2.5]), 0.06, 0.5, 0.03, [244, 242, 236], { bevel: 0.2 }); }
    S.box((p) => add(p, [0, 0.75, -2.5]), 6, 0.04, 0.03, [244, 242, 236], { bevel: 0.2 });
    S.box((p) => add(p, [-3.5, 1.6, -6]), 3, 1.6, 2, [214, 176, 140], { bevel: 0.05 }); extrudeRoof(S, [-3.5, 3.2, -6]);
    tree(S, 3.2, -4.2, 1.8, 2); tree(S, 4.6, -5.5, 2.2, 5);
  };
  const extrudeRoof = (S, c) => { const A = [[-3.2, 0, -2.2], [3.2, 0, -2.2], [0, 1.4, -2.2]].map((p) => add(p, c)), B = [[-3.2, 0, 2.2], [3.2, 0, 2.2], [0, 1.4, 2.2]].map((p) => add(p, c)), C = add(c, [0, 0.5, 0]); S.face(A, [160, 70, 60], { c: C }); S.face(B, [160, 70, 60], { c: C }); for (let i = 0; i < 3; i++) { const j = (i + 1) % 3; S.face([A[i], A[j], B[j], B[i]], [176, 80, 66], { c: C }); } };
  const phone = (S, p, lit) => S.box((q) => add(p, rotY(q, 0.4)), 0.08, 0.008, 0.16, [30, 30, 36], { bevel: 0.3, topPaint: (c, w, h) => { c.fillStyle = lit > 0 ? `rgba(120,200,255,${lit})` : '#111'; c.fillRect(w * 0.08, h * 0.05, w * 0.84, h * 0.9); if (lit > 0.5) { c.fillStyle = '#fff'; c.font = `800 ${w * 0.3}px "Montserrat"`; c.textAlign = 'center'; c.fillText('9:41', w / 2, h * 0.3); } } });
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'sky') {
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, SKY_Y, 0], 7.5, 6.5, 1.0, 0.7, 0.9, 0.55, [-0.4, 0, 0]);
      const S = skyScene(E, TG, W, H_, t); jet767(S, [0, SKY_Y, 0], { fan: t * 20, burn: 0 });
      const tw = V('hook', 'wall'); if (t > tw) { const u = H.clamp((t - tw) / 1.2); S.ico([-1.4 - u * 1.5, SKY_Y - 0.05 - u * 0.4, 0.3 + u * 0.2], 0.08 + 0.25 * u, [240, 240, 244], { sub: 0, jit: 0.3, noShadow: true }); S.box((p) => add(add(p, [-1.4 - u * 3, SKY_Y - u * 1.5, 0.27 + u]), [0, 0, 0]), 0.04, 0.06, 0.004, [240, 240, 244], { noShadow: true }); }
      S.render(ctx, W, H_, skyEnv);
      const hp = S.proj([-1.4, SKY_Y, 0.26]); FX.sparks(ctx, hp[0], hp[1], H.clamp((t - tw) / 0.6), 3);
      flash = 0.14 * Math.exp(-Math.pow((t - tw) * 5, 2));
      tagLabel(ctx, W / 2, H_ * 0.2, 'JAN 2024', ramp(t, V('hook', 'January') - 0.1, 0.2), { px: 40 });
    } else if (n === 'cabin' || n === 'press') {
      // Dave in 26A with his SAFETY magazine; the plug beside him; four bolts... that were never put back
      const press = n === 'press', out = press ? H.clamp((t - TBLOW()) / 0.5) : 0;
      const [E, TG] = press ? orbit(t, sh.t0, sh.t1, [-1.4, 0, 0.3], 2.5, 2.2, 1.25, 1.15, 0.75, 0.6, [-0.15, 1.15, 0]) : orbit(t, sh.t0, sh.t1, [-1.3, 0, 0.3], 3.3, 2.8, 1.45, 1.3, 0.85, 0.65, [-0.05, 1.1, 0]);
      const S = Scene(E, TG, W, H_); cabin(S, { emptyRow: true });
      const boltsShown = !press && t > V('plug', 'four') - 0.1 && t < V('bolts', 'never') - 0.05;
      plug(S, { out, bolts: boltsShown });
      dave(S, [-1.35, 0, 0.12], { pose: 'sit', yaw: 0.0, hands: [[0.15, 1.18, 0.4], [-0.15, 1.18, 0.4]], blink: blinkAt(t), t, look: [-1, 0], sweat: press ? 1 : 0 });
      S.box((p) => add(p, [-1.35, 1.2 - 0.42 + 0.0, 0.62]), 0.17, 0.12, 0.01, [250, 250, 246], { noShadow: true, paint: (c, w, h) => { c.fillStyle = '#e8442e'; c.fillRect(0, 0, w, h * 0.32); c.fillStyle = '#fff'; c.font = `800 ${h * 0.24}px "Montserrat"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SAFETY', w / 2, h * 0.17); c.fillStyle = '#99a'; for (let i = 0; i < 5; i++) c.fillRect(w * 0.1, h * (0.45 + i * 0.1), w * 0.8, h * 0.04); } });
      if (press) { const pu = ramp(t, V('press', 'pushes') - 0.2, 0.4) * (1 - out); if (pu > 0) for (const [y, z] of [[0.35, 0.2], [0.35, -0.2], [-0.2, 0.2], [-0.2, -0.2], [0.07, 0]]) S.arrow([-0.6, PY + y, PZ + z], [PX + 0.1, PY + y, PZ + z], [236, 84, 70], { w: 0.07 * pu, side: [0, 1, 0] }); if (out > 0) S.beads([[0.6, 1.3, 0], [-0.8, 1.3, 0], [PX - 2.5, 1.3, 0]], P.air, t * 4, { spacing: 0.25, r: 0.03 }); }
      S.render(ctx, W, H_, { bg: '#c9c2b8', dof: 0.3, focus: 2.5, shadowAlpha: 0.35 });
      if (boltsShown) { const bp = [[0.5, 0.3], [0.5, -0.3], [-0.5, 0.3], [-0.5, -0.3]].map(([y, z]) => S.proj([PX + 0.04, PY + y, PZ + z])); const u = ramp(t, V('plug', 'four') - 0.1, 0.2); bp.forEach((q) => { ctx.save(); ctx.strokeStyle = `rgba(255,210,74,${u})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(q[0], q[1], 18, 0, TAU); ctx.stroke(); ctx.restore(); }); }
      if (!press && t > V('bolts', 'never') - 0.1) { const bp = [[0.5, 0.3], [0.5, -0.3], [-0.5, 0.3], [-0.5, -0.3]].map(([y, z]) => S.proj([PX + 0.04, PY + y, PZ + z])); const u = ramp(t, V('bolts', 'never') - 0.1, 0.25); bp.forEach((q) => FX.no(ctx, q[0], q[1], 24, u)); tagLabel(ctx, W / 2, H_ * 0.2, '0 BOLTS', u, { px: 44 }); }
      else if (!press) tagLabel(ctx, W / 2, H_ * 0.2, '4 BOLTS', ramp(t, V('plug', 'four') - 0.1, 0.2), { px: 44 });
      if (press) { tagLabel(ctx, W / 2, H_ * 0.2, '16,000 ft', ramp(t, V('press', 'sixteen') - 0.1, 0.2) * (1 - out), { px: 44 }); flash = 0.25 * Math.exp(-Math.pow((t - TBLOW()) * 5, 2)); }
    } else if (n === 'suck') {
      // air rushes out, and so does Dave, magazine and all; the two seats next to the hole are empty
      const su = H.clamp((t - TSUCK()) / 0.9);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [-1.3, 0, 0.3], 3.6, 3.3, 1.4, 1.5, 0.8, 0.65, [-0.1, 1.1, 0]);
      const S = Scene(E, TG, W, H_); cabin(S, { emptyRow: true }); plug(S, { out: 1 });
      if (su < 1) { const p0 = [-1.35, 0, 0.12], p1 = [PX - 6, PY - 1, 0]; dave(S, lerp3(p0, p1, H.ease.in(su)), { pose: su > 0 ? 'flail' : 'sit', t, death: su > 0 ? 'launch' : undefined, u: su * 0.4, to: [0, 0, 0], arc: 0, blink: blinkAt(t), mouth: su > 0 ? 1 : 0 }); }
      const mg = H.clamp((t - TSUCK() + 0.25) / 0.7); if (mg < 1) S.box((p) => add(lerp3([-1.35, 0.8, 0.62], [PX - 4, PY + 0.5, 0], H.ease.in(mg)), rotX(rotZ(p, mg * 9), mg * 5)), 0.17, 0.12, 0.01, [250, 250, 246], { noShadow: true });
      S.beads([[0.8, 1.3, 0.5], [-0.8, 1.3, 0.1], [PX - 3, 1.3, 0]], P.air, t * 5, { spacing: 0.22, r: 0.03 }); S.beads([[0.8, 0.8, -0.6], [-0.8, 1.1, -0.1], [PX - 3, 1.2, 0]], P.air, t * 5 + 0.1, { spacing: 0.22, r: 0.03 });
      S.render(ctx, W, H_, { bg: '#c9c2b8', dof: 0.3, focus: 3, shadowAlpha: 0.35 });
      const sp = S.proj([-0.83, 1.0, 0]); tagLabel(ctx, sp[0], sp[1] - 220, 'EMPTY', ramp(t, V('out', 'empty') - 0.1, 0.2), { px: 36, col: '#7ee07a' });
      flash = 0.1 * Math.exp(-Math.pow((t - TSUCK()) * 5, 2));
    } else {
      // the yard: the phone lands and lights up. Dave lands next to it. Dave does not light up.
      const tl = sh.t0 + 0.6, tw = V('phone', 'worked'), td = V('phone', 'yard') + 0.2;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 4.2, 3.6, 2.6, 2.0, 0.25, 0.1, [0, 0.1, 0]);
      const S = Scene(E, TG, W, H_); yard(S);
      const pu = H.clamp((t - sh.t0) / 0.6), py = 9 * (1 - pu * pu), lit = ramp(t, tw - 0.1, 0.3);
      phone(S, [0.45, 0.01 + Math.max(0, py), 0.6], lit);
      const du = H.clamp((t - td + 0.5) / 0.5);
      if (du > 0) dave(S, [-0.5, 8 * (1 - du * du), 0.3], { pose: 'flail', t, death: du >= 1 ? 'squash' : undefined, u: du >= 1 ? 0.55 * H.clamp((t - td) / 0.15) : 0, xeyes: du >= 1, yaw: 0.3 });
      S.render(ctx, W, H_, skyEnv);
      const pp = S.proj([0.45, 0.05, 0.6]); if (lit > 0) { ctx.save(); const g = ctx.createRadialGradient(pp[0], pp[1], 0, pp[0], pp[1], 90); g.addColorStop(0, `rgba(150,220,255,${0.6 * lit})`); g.addColorStop(1, 'rgba(150,220,255,0)'); ctx.fillStyle = g; ctx.fillRect(pp[0] - 90, pp[1] - 90, 180, 180); ctx.restore(); }
      flash = 0.12 * Math.exp(-Math.pow((t - tl) * 6, 2)) + 0.15 * Math.exp(-Math.pow((t - td) * 6, 2));
      tagLabel(ctx, W / 2, H_ * 0.2, 'STILL WORKS', lit, { px: 40, col: '#7ee07a' });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 1, rip, t, { cause: 'cause of death:\nfour missing bolts' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.noise(0.05, { dur: ST('cabin'), color: 'brown', filter: 'lowpass', f: 500, gain: 0.1, a: 0.3, minor: true });
    k.play('impact', V('hook', 'wall'), { gain: 0.45 });
    k.noise(ST('cabin'), { dur: ST('suck') + 1.5 - ST('cabin'), color: 'pink', filter: 'lowpass', f: 700, gain: 0.06, a: 0.4, minor: true });
    k.play('ding', V('plug', 'four'), { f: 'C6', gain: 0.3 });
    k.play('error', V('bolts', 'never'), { gain: 0.35 });
    k.play('riser', V('press', 'pushes') - 0.3, { dur: TBLOW() - V('press', 'pushes') + 0.3, gain: 0.3 });
    k.play('impact', TBLOW(), { gain: 0.6 }); k.noise(TBLOW(), { dur: 2.5, color: 'pink', filter: 'bandpass', f: [[0, 2600], [2.5, 600]], q: 0.6, gain: 0.35, a: 0.01 });
    k.play('swish', TSUCK(), { dur: 0.5, gain: 0.5 }); k.play('pop', V('out', 'empty'), { gain: 0.3 });
    const t0 = ST('yard'); k.play('thud', t0 + 0.6, { f: 200, gain: 0.3 }); k.play('boot', V('phone', 'worked') - 0.1, { gain: 0.6 }); k.play('thud', V('phone', 'yard') + 0.2, { f: 70, gain: 0.6 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
