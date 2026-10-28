  // Dave reel 42: USS William D. Porter vs USS Iowa (14 November 1943). A drill torpedo was left armed and fired at the
  // battleship carrying President Roosevelt; the lamp warning was the wrong message. Dave armed it. R.I.P. Dave #41.
  const GREY = [150, 156, 166], DECK = [120, 110, 100];
  // a warship along +x: hull with a pointed bow, superstructure, funnels, gun turrets. s = scale, yaw = heading
  const ship = (S, c, o = {}) => { const s = o.s || 1, T = (p) => add(rotY(mul(p, s), o.yaw || 0), c);
    S.box((p) => T(add(p, [0, 0.25, 0])), 3, 0.35, 0.55, GREY, { bevel: 0.1 }); S.box((p) => T(add(rotY(p, Math.PI / 4), [3.0, 0.25, 0])), 0.39, 0.35, 0.39, GREY, { bevel: 0.1 });
    S.box((p) => T(add(p, [0, 0.62, 0])), 3.0, 0.02, 0.5, DECK, { bevel: 0.2 });
    S.box((p) => T(add(p, [0.2, 1.0, 0])), 0.8, 0.38, 0.32, GREY, { bevel: 0.1 }); for (const x of [-0.5, 0.6]) S.cyl((p) => T(add(p, [x, 1.3, 0])), 0.14, 0.6, shade(GREY, 0.8), 10);
    for (const x of (o.big ? [-2.2, 1.6, 2.4] : [-2.2, 2.0])) { S.cyl((p) => T(add(p, [x, 0.64, 0])), 0.25, 0.18, GREY, 12); S.rod(T([x, 0.75, 0]), T([x + (x > 0 ? 0.7 : -0.7), 0.78, 0]), 0.04, shade(GREY, 0.7), 6); }
    if (o.tubes) for (const z of [-0.2, 0.2]) S.cyl((p) => T(add(rotZ(p, Math.PI / 2), [-1.0, 0.75, z])), 0.06, 0.8, [100, 104, 112], 8); };
  const sea = (S) => S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 60], [-400, 0, 60]], [52, 110, 170], { bg: true, flat: false });
  const torpedo = (S, p, yaw) => { S.cyl((q) => add(rotY(rotZ(q, Math.PI / 2), yaw), p), 0.07, 0.9, [70, 74, 82], 10, { top: 0.03 }); };
  const bubbles = (S, a, b, t) => S.beads([a, b], [235, 245, 255], t * 2, { spacing: 0.25, r: 0.06 });
  const splash = (ctx, S, at, t, t0) => { const k = (t - t0) / 1.2; if (k < 0 || k > 1) return; const p = S.proj(at); ctx.save(); ctx.globalAlpha = 1 - k; ctx.fillStyle = '#eaf6ff'; for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i - 5.5) * 0.15, d = 260 * Math.sin(Math.PI * Math.min(1, k * 1.4)); ctx.beginPath(); ctx.arc(p[0] + Math.cos(a) * d * 0.4, p[1] + Math.sin(a) * d, 14, 0, TAU); ctx.fill(); } ctx.restore(); };
  const lamp = (ctx, W, H_, t, txt, a, col = '#ffffff') => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(20,20,28,0.85)'; ctx.fillRect(W * 0.12, H_ * 0.6, W * 0.76, H_ * 0.09); ctx.fillStyle = col; ctx.font = FONT(800, 36); ctx.textAlign = 'center'; ctx.fillText(txt, W / 2, H_ * 0.655); ctx.restore(); };
  const OUT = { bg: sunsetSky, dof: 0, shadows: false };
  makeDave({
    rip: { n: 41, cause: 'cause of death:\nfriendly torpedo' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: sea, render: OUT, cam: { orbit: [[-1, 0, -2], 20, 18, 6, 5, 0.25, 0.1, [0, 0.5, 0]] },
        build: (S, t) => { ship(S, [-5, 0, 2], { s: 0.6, tubes: true }); ship(S, [3, 0, -6], { s: 1.2, big: true }); const k = H.clamp((t - 0.4) / 5), p = [-4.5 + 6 * k, -0.05, 2 - 7 * k]; torpedo(S, p, Math.atan2(7, 6)); bubbles(S, [-4.5, 0.02, 2], add(p, [0, 0.07, 0]), t); },
        tags: [['1943 · ATLANTIC', 0.2, 0.15], ["TORPEDO → THE PRESIDENT'S SHIP", V('hook', 'torpedo'), 0.22, { col: '#ff6a5a' }]] },
      // the destroyer's deck: sailor dummies at the torpedo tubes, the battleship far off as the pretend target
      drill: { set: sea, render: OUT, cam: { orbit: [[-1, 0.6, 0], 4.2, 3.8, 1.4, 1.2, 0.7, 0.4, [0, 0.4, 0]] },
        build: (S, t) => { ship(S, [0, 0, 0], { tubes: true }); ship(S, [8, 0, -14], { s: 1.2, big: true }); if (t > V('drill', 'armed')) S.ico([-0.6, 0.75, 0.2], 0.08, [255, 80, 60], { sub: 0, glow: true, noShadow: true }); },
        crew: [{ who: 'intern', pos: [-1.3, 0.64, 0.35], pose: 'point', yaw: 0.8, s: 0.5 }, { who: 'engineer', pos: [-1.8, 0.64, -0.2], pose: 'thumbs', yaw: 0.4, s: 0.5 }],
        tags: [['USS WILLIAM D. PORTER', V('drill', 'USS'), 0.15], ['PRETEND TARGET: IOWA', V('drill', 'Iowa'), 0.22], ['ONE LEFT ARMED', V('drill', 'armed'), 0.29, { col: '#ff6a5a' }]] },
      // the signal lamp blinking the wrong message, then the radio
      signal: { set: sea, render: OUT, cam: { orbit: [[0, 0.6, 0], 5, 4.5, 1.6, 1.4, -0.4, -0.2, [0.2, 0.6, 0]] },
        build: (S, t) => { ship(S, [0, 0, 0], { tubes: true }); S.ico([0.5, 1.5, 0.35], 0.09, Math.sin(t * 14) > 0 ? [255, 250, 210] : [120, 120, 110], { sub: 0, glow: Math.sin(t * 14) > 0, noShadow: true }); },
        over: (ctx, W, H_, t) => { const w = ramp(t, V('signal', 'wrong') - 0.2, 0.3), r = ramp(t, V('signal', 'broke') - 0.1, 0.3); lamp(ctx, W, H_, t, 'SENT: "WE ARE BACKING UP"', w * (1 - r), '#ffd24a'); lamp(ctx, W, H_, t, 'RADIO: "TORPEDO! TURN!"', r, '#ff6a5a'); },
        tags: [['RADIO SILENCE', V('signal', 'radio'), 0.15], ['WRONG MESSAGE', V('signal', 'wrong'), 0.22, { col: '#ff6a5a' }]] },
      // Iowa swings hard; the torpedo blows up in its wake (no joke here)
      dodge: { set: sea, render: OUT, cam: { orbit: [[-1.5, 0, 1], 12, 11, 3.5, 3.0, 0.4, 0.2, [0, 0.6, 0]] },
        build: (S, t) => { const k = ramp(t, V('dodge', 'turned') - 0.2, 1.4); ship(S, [0, 0, 0], { s: 1.2, big: true, yaw: 0.9 * k }); const b = V('dodge', 'exploded'); if (t < b) { const q = H.clamp((t - BEAT0('dodge')) / (b - BEAT0('dodge'))), p = [-9 + 6 * q, -0.05, 6 - 4 * q]; torpedo(S, p, -0.6); bubbles(S, [-9, 0.02, 6], add(p, [0, 0.07, 0]), t); } },
        over: (ctx, W, H_, t, u, S) => splash(ctx, S, [-3, 0.1, 2], t, V('dodge', 'exploded')),
        tags: [['HARD TURN', V('dodge', 'turned'), 0.15], ['EXPLODED IN THE WAKE', V('dodge', 'exploded'), 0.22, { col: '#ffd24a' }], ['THE PRESIDENT WATCHED', V('dodge', 'President'), 0.29]] },
      // Dave sits astride the torpedo in its tube, thumbs up. It fires. He goes with it.
      end: { set: sea, render: OUT, cam: { orbit: [[-1, 0.4, 2.0], 5.5, 6.2, 1.0, 1.5, 1.45, 1.25, [0, 0.2, 0]] },
        build: (S, t) => { ship(S, [0, 0, 0], { tubes: true }); const go = V('end', 'armed') - 0.1; if (t > go) { const k = t - go, p = [-1.0 - 0.2 * k, 0.75 - 0.9 * k * k, 0.4 + 3.5 * k]; torpedo(S, p, -Math.PI / 2); } },
        dave: (t) => { const go = V('end', 'armed') - 0.1, k = Math.max(0, t - go); return { pos: [-1.0, 0.68 - 0.9 * k * k, 0.2 + 3.5 * k], pose: 'sit', s: 0.7, t, yaw: 0, mouth: k > 0 ? 1 : 0, sweat: k > 0 ? 1 : 0, xeyes: k > 0.6 }; },
        over: (ctx, W, H_, t, u, S) => { const go = V('end', 'armed') - 0.1; splash(ctx, S, [-1.3, 0.1, 3.0], t, go + 0.75); },
        flash: [V('end', 'armed') + 0.65] },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.play('whoosh', 0.4, { dur: 1.2, gain: 0.4 }); k.noise(0.4, { dur: 4, color: 'pink', filter: 'bandpass', f: 1500, q: 0.6, gain: 0.08, a: 0.2, minor: true }); // bubbles
      k.play('click', V('drill', 'armed'), { gain: 0.4 }); k.play('error', V('drill', 'armed') + 0.2, { gain: 0.3 });
      for (let i = 0; i < 6; i++) k.play('blip', BEAT0('signal') + i * 0.3, { f: 1400, gain: 0.15, minor: true }); k.play('error', V('signal', 'wrong'), { gain: 0.35 }); k.play('buzz', V('signal', 'broke'), { gain: 0.3 });
      k.noise(V('dodge', 'turned'), { dur: 1.5, color: 'pink', filter: 'lowpass', f: 600, gain: 0.15, a: 0.3 }); k.play('impact', V('dodge', 'exploded'), { gain: 0.7 }); k.noise(V('dodge', 'exploded'), { dur: 1.5, color: 'white', filter: 'lowpass', f: 1500, gain: 0.25, a: 0.01 });
      k.play('whoosh', V('end', 'armed') - 0.1, { dur: 0.7, gain: 0.5 }); k.play('impact', V('end', 'armed') + 0.65, { gain: 0.7 }); k.noise(V('end', 'armed') + 0.65, { dur: 1.0, color: 'white', filter: 'lowpass', f: 1500, gain: 0.3, a: 0.01 });
    },
  });
