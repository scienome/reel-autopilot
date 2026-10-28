  // Dave reel 40: the Hughes H-4 Hercules, the "Spruce Goose" (1947). The biggest plane of its time, made mostly of birch,
  // flew once, about 20 m up for about a mile. Dave waits in the cockpit for flight two. R.I.P. Dave #39.
  const WOOD = [206, 170, 120], WOODD = [170, 132, 88];
  // the flying boat along +x: a deep hull, a straight high wing with 8 engines, floats, a tall tail. s = scale
  const goose = (S, c, o = {}) => { const s = o.s || 1, T = (p) => add(rotZ(mul(p, s), o.pitch || 0), c);
    S.box((p) => T(add(p, [0, 0.9, 0])), 3.3, 0.55, 0.42, WOOD, { bevel: 0.25, paint: (cc, w, h) => { cc.fillStyle = 'rgba(60,40,20,0.4)'; cc.fillRect(w * 0.9, h * 0.2, w * 0.04, h * 0.15); cc.fillStyle = '#2a3a4a'; cc.fillRect(w * 0.92, h * 0.15, w * 0.05, h * 0.12); } });
    S.box((p) => T(add(p, [3.5, 0.95, 0])), 0.4, 0.4, 0.36, WOOD, { bevel: 0.6 });
    S.box((p) => T(add(p, [0.6, 1.5, 0])), 0.55, 0.05, 5.0, WOODD, { bevel: 0.3 });
    for (let i = 0; i < 8; i++) { const z = -4.2 + i * 1.2 + (i > 3 ? 0 : 0); S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [1.0, 1.45, z])), 0.14, 0.5, WOODD, 10, { top: 0.08 }); if (o.props) S.box((p) => T(add(rotX(p, (o.t || 0) * 30 + i), [1.55, 1.45, z])), 0.01, 0.3, 0.03, [60, 60, 66], { bevel: 0.1 }); }
    for (const sz of [-1, 1]) S.box((p) => T(add(p, [0.6, 0.9, sz * 4.4])), 0.35, 0.08, 0.1, WOODD, { bevel: 0.3 });
    S.quad([T([-2.6, 1.4, 0]), T([-3.4, 3.1, 0]), T([-3.9, 3.1, 0]), T([-3.3, 1.4, 0])], WOODD); S.box((p) => T(add(p, [-3.3, 1.6, 0])), 0.35, 0.03, 1.4, WOODD, { bevel: 0.3 });
  };
  const sea = (S) => S.quad([[-400, 0, -400], [400, 0, -400], [400, 0, 60], [-400, 0, 60]], [52, 110, 170], { bg: true, flat: false });
  const wake = (ctx, S, x, y, t) => { if (y > 0.4) return; const p = S.proj([x - 3, 0.05, 0]); ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(p[0] - i * 30, p[1] + Math.sin(t * 9 + i) * 3, 40 - i * 4, 8, 0, 0, TAU); ctx.fill(); } ctx.restore(); };
  const OUT = { bg: sunsetSky, dof: 0, shadows: false };
  makeDave({
    rip: { n: 39, cause: 'cause of death:\nflight two' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: sea, render: OUT, cam: { orbit: [[0, 1, 0], 13, 12, 1.6, 1.4, 0.6, 0.35, [0, 1.0, 0]] },
        build: (S, t) => goose(S, [-2 + t * 0.6, 0.15 + 0.4 * ramp(t, 1.5, 1.5), 0], { props: true, t, pitch: 0.03 }),
        over: (ctx, W, H_, t, u, S) => wake(ctx, S, -2 + t * 0.6, 0.15 + 0.4 * ramp(t, 1.5, 1.5), t),
        tags: [['H-4 HERCULES', 0.2, 0.15], ['MADE OF WOOD', V('hook', 'wood'), 0.22, { col: '#ffd24a' }], ['FLIGHTS: 1', V('hook', 'once'), 0.29, { col: '#ff6a5a' }]] },
      // the factory: the wing on the floor and a tiny engineer dummy underneath for scale
      why: { set: 'factory', cam: { orbit: [[0, 0, 0], 9, 8, 2.4, 2.0, -0.6, -0.3, [0, 1.6, 0]] },
        build: (S) => goose(S, [0, -0.5, -1], { s: 1.0 }),
        crew: [{ who: 'engineer', pos: [1.6, 0, 3.5], pose: 'point', yaw: -0.4 }, { who: 'intern', pos: [2.4, 0, 2.8], pose: 'stand', yaw: -0.8, mouth: 1 }],
        tags: [['METAL: SCARCE', V('why', 'metal'), 0.15], ['MOSTLY BIRCH', V('why', 'birch'), 0.22, { col: '#ffd24a' }], ['WINGSPAN: 97 m', V('why', 'wingspan'), 0.29]] },
      // the hearing room: a long table of senator dummies, the aviator dummy in the chair
      late: { set: 'office', setOpt: { chart: '$$$' }, cam: { orbit: [[0, 0, -1.4], 4.2, 3.8, 1.6, 1.5, 0.35, 0.05, [0, 1.0, 0]] },
        crew: (t) => [{ who: 'boss', pos: [-0.6, 0, -2.1], pose: 'point', yaw: 0.1 }, { who: 'boss', pos: [0.4, 0, -2.1], pose: 'stand', yaw: -0.1, mouth: 0.6 }, { who: 'pilot', pos: [0.2, 0, 0.0], pose: 'stand', yaw: Math.PI, sweat: t > V('late', 'Senate') ? 1 : 0, t }],
        tags: [['"THE SPRUCE GOOSE"', V('late', 'Spruce'), 0.15, { col: '#ffd24a' }], ['SENATE HEARING', V('late', 'Senate'), 0.22]] },
      // the one flight: up to about 20 m, a short hop, back down
      flight: { set: sea, render: OUT, cam: { orbit: [[0, 2, 0], 16, 15, 1.2, 1.6, -0.5, -0.2, [0, 0.8, 0]] },
        build: (S, t) => { const k = H.clamp((t - V('flight', 'lifted')) / (V('flight', 'landed') - V('flight', 'lifted'))), y = 0.15 + 2.4 * Math.sin(Math.PI * k); goose(S, [-6 + (t - BEAT0('flight')) * 1.4, y, 0], { props: true, t, pitch: 0.06 * Math.cos(Math.PI * k) }); },
        tags: [['1947', V('flight', 'nineteen'), 0.15], ['~20 m UP', V('flight', 'twenty'), 0.22, { col: '#ffd24a' }], ['~1 MILE', V('flight', 'mile'), 0.29], ['NEVER AGAIN', V('flight', 'never'), 0.36, { col: '#ff6a5a' }]] },
      // Dave in the cockpit window in the hangar, ready for flight two. The calendar pages fly. He crumbles to dust.
      end: { set: 'garage-empty', cam: { orbit: [[3.0, 0, 0], 3.2, 2.8, 0.4, 0.3, 0.9, 0.7, [0.6, 1.2, 0]] },
        build: (S, t) => { goose(S, [0, -0.3, 0], { s: 1 }); const go = V('end', 'second'); if (t > go) davePile(S, [3.0, 1.2, 0.2], t, { s: 0.45 }); },
        dave: (t) => (t > V('end', 'second') ? null : { pos: [3.0, 0.9, 0.15], half: true, s: 0.45, yaw: Math.PI / 2, pose: 'stand', t, look: [1, 0], blink: DAVEKIT.blinkAt(t) }),
        over: (ctx, W, H_, t) => { const k = H.clamp((t - BEAT0('end')) / (V('end', 'flight') - BEAT0('end'))); ctx.save(); ctx.fillStyle = 'rgba(20,20,28,0.8)'; ctx.fillRect(W * 0.62, H_ * 0.24, W * 0.3, H_ * 0.1); ctx.fillStyle = '#ffd24a'; ctx.font = FONT(800, 46); ctx.textAlign = 'center'; ctx.fillText(String(1948 + Math.floor(k * 75)), W * 0.77, H_ * 0.305); ctx.restore(); ctx.save(); ctx.strokeStyle = `rgba(240,240,240,${0.6 * k})`; ctx.lineWidth = 2; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, H_ * 0.1); ctx.lineTo(W * 0.3 * Math.cos(i * 0.2), H_ * 0.1 + W * 0.3 * Math.sin(i * 0.2)); ctx.stroke(); } ctx.restore(); },
        flash: [] },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.noise(0, { dur: BEAT0('why'), color: 'pink', filter: 'bandpass', f: 300, q: 0.5, gain: 0.15, a: 0.3 }); k.play('stamp', V('hook', 'once'), { gain: 0.45 });
      k.play('pop', V('why', 'birch'), { gain: 0.35 }); k.play('stamp', V('late', 'Senate'), { gain: 0.4 });
      k.noise(BEAT0('flight'), { dur: V('flight', 'never') - BEAT0('flight'), color: 'pink', filter: 'bandpass', f: 300, q: 0.5, gain: 0.15, a: 0.3 }); k.play('error', V('flight', 'never'), { gain: 0.3 });
      for (let i = 0; i < 10; i++) k.play('tick', BEAT0('end') + i * 0.25, { f: 1200, gain: 0.15, minor: true }); k.play('paper', V('end', 'second'), { gain: 0.5 });
    },
  });
