  // Dave reel 23: Skylab falls on Western Australia (1979) and the town of Esperance fines NASA $400 for littering.
  // Dave goes souvenir hunting under the last chunk. R.I.P. Dave #22.
  const HULL = [214, 214, 220], GOLDF = [214, 170, 80], PANEL = [50, 70, 130];
  // Skylab along x: workshop cylinder, docking module, solar panel wing, the windmill of the telescope mount
  const skylab = (S, c, o = {}) => {
    const T = (p) => add(rotY(rotZ(p, o.tilt || 0), o.yaw || 0), c), glow = o.burn ? { glow: o.burn > 0.5 } : {};
    S.cyl((p) => T(add(rotZ(p, Math.PI / 2), [1.2, 0, 0])), 0.55, 2.4, o.burn ? [255, 170 - 60 * o.burn, 90] : GOLDF, 18, glow);
    S.cyl((p) => T(add(rotZ(p, Math.PI / 2), [-0.4, 0, 0])), 0.28, 1.2, HULL, 14);
    S.box((p) => T(add(p, [0.1, 0, -1.3])), 0.9, 0.02, 0.75, PANEL, { bevel: 0.1, paint: (cc, w, h) => { cc.strokeStyle = 'rgba(200,220,255,0.5)'; for (let i = 1; i < 8; i++) { cc.beginPath(); cc.moveTo((i * w) / 8, 0); cc.lineTo((i * w) / 8, h); cc.stroke(); } } });
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; S.box((p) => T(add(rotX(p, a), add([-1.0, 0, 0], rotX([0, 0.9, 0], a)))), 0.03, 0.55, 0.3, PANEL, { bevel: 0.1 }); }
  };
  // the burning chunks: little glowing boxes with a smoke trail drawn on top
  const chunks = (S, t, t0, n, spread, per = 0) => { const r = H.rng(4), out = []; for (let i = 0; i < n; i++) { const dl = r.range(0, per || 1.2), x0 = r.range(-spread, spread) - 12, tt = t - t0 - dl, k = per ? ((tt % per) + per) % per * 3 : Math.max(0, tt); const p = [x0 + 9 * k, 20 - 9 * k, r.range(-8, -2)]; if (k > 0 && p[1] > 0) { S.box((q) => add(rotX(q, k * 4 + i), p), 0.35, 0.25, 0.3, [255, 150, 70], { glow: true, noShadow: true }); out.push(p); } } return out; };
  const trails = (ctx, S, pts) => { ctx.save(); ctx.lineCap = 'round'; for (const p of pts) { const a = S.proj(p), b = S.proj([p[0] - 6, p[1] + 6, p[2]]); const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]); g.addColorStop(0, 'rgba(255,200,120,0.9)'); g.addColorStop(1, 'rgba(120,110,110,0)'); ctx.strokeStyle = g; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } ctx.restore(); };
  // the atmosphere as a glowing blue band below the station; o.puff 0..1 swells it
  const earth = (S, puff) => { S.ico([0, -62, 0], 58, [70, 120, 200], { sub: 2, noShadow: true }); S.ico([0, -62, 0], 58.6 + 1.6 * puff, [140, 200, 255], { sub: 2, alpha: 0.22 + 0.2 * puff, noShadow: true }); };
  let PTS = [];
  makeDave({
    rip: { n: 22, cause: 'cause of death:\nfinders keepers' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'desert', cam: { orbit: [[0, 0, 0], 16, 14, 3, 2.5, 0.3, 0.1, [-2, 6, -8]] },
        build: (S, t) => { PTS = chunks(S, t, 0, 10, 8, 2.2); },
        over: (ctx, W, H_, t, u, S) => trails(ctx, S, PTS),
        tags: [['SKYLAB · 1979', V('hook', 'nineteen'), 0.16], ['77 TONNES', V('hook', 'seventy-seven'), 0.24], ['THE FINE →', V('hook', 'fine'), 0.32, { col: '#ffd24a' }]] },
      // in orbit: the Sun flares, the air below swells up, drag beads stream past and the orbit sinks
      drag: { set: 'space', cam: { orbit: [[0, 0, 0], 9, 8, 1.5, 1.0, 0.6, 0.2, [0, -0.6, 0]] },
        build: (S, t) => { const k = ramp(t, V('drag', 'puffed') - 0.3, 1.2), sink = 1.6 * ramp(t, V('drag', 'shrank') - 0.6, 1.5); earth(S, k); skylab(S, [0, 0.5 - sink, 0], { yaw: 0.4, tilt: 0.1 * Math.sin(t) }); if (k > 0.2) for (let j = -2; j <= 2; j++) S.beads([[5, 0.5 - sink + j * 0.35, -1], [-5, 0.5 - sink + j * 0.35, -1]], P.air, t * 2, { spacing: 0.3, r: 0.04 }); },
        over: (ctx, W, H_, t) => { const a = ramp(t, V('drag', 'Sun') - 0.2, 0.3); if (a <= 0) return; const g = ctx.createRadialGradient(W * 0.85, H_ * 0.12, 10, W * 0.85, H_ * 0.12, 220); g.addColorStop(0, `rgba(255,240,180,${a})`); g.addColorStop(1, 'rgba(255,200,100,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); },
        tags: [['SUN MORE ACTIVE', V('drag', 'Sun'), 0.16], ['AIR PUFFS UP', V('drag', 'puffed'), 0.22], ['MORE DRAG', V('drag', 'drag'), 0.28, { col: '#ff6a5a' }]] },
      // re-entry: the station glows and breaks into pieces; then the empty outback (nobody hurt)
      crash: { set: 'desert', cam: { orbit: [[0, 0, 0], 18, 16, 4, 3, -0.3, -0.5, [0, 5, -6]] },
        build: (S, t) => { const t0 = BEAT0('crash'), k = H.clamp((t - t0) / 1.6); if (k < 1) skylab(S, [-12 + 8 * k, 26 - 10 * k, -10], { burn: k, tilt: k * 2 }); PTS = chunks(S, t, t0 + 1.2, 12, 10); },
        over: (ctx, W, H_, t, u, S) => trails(ctx, S, PTS),
        tags: [['WESTERN AUSTRALIA', V('crash', 'Western'), 0.16], ['NOBODY HURT', V('crash', 'Nobody'), 0.24, { col: '#7ee07a' }]] },
      // the town office: a clerk dummy stamps the littering fine
      fine: { set: 'office', setOpt: { chart: 'SPACE JUNK' }, cam: { orbit: [[0, 0, -1.2], 3.8, 3.3, 1.5, 1.4, -0.3, 0.1, [0, 1.0, 0]] },
        crew: (t) => [{ who: 'boss', pos: [0, 0, -2.0], pose: t > V('fine', 'fined') ? 'point' : 'stand', yaw: 0 }],
        build: (S, t) => { const st = popU(t, V('fine', 'fined'), 0.3); S.box((p) => add(p, [0.4, 0.77, -1.2]), 0.3, 0.005, 0.2, [250, 248, 240], { bevel: 0, paint: (c, w, h) => { c.fillStyle = '#d83a34'; c.globalAlpha = st; c.font = FONT(800, h * 0.3); c.textAlign = 'center'; c.fillText('FINE', w / 2, h * 0.6); } }); },
        tags: [['$400 FINE', V('fine', 'four'), 0.16, { col: '#ffd24a', px: 46 }], ['FOR LITTERING', V('fine', 'littering'), 0.24], ['UNPAID: 30 YEARS', V('fine', 'unpaid'), 0.32]] },
      // Dave wanders the outback with a sack, looking up. The last big chunk lands on him.
      end: { set: 'desert', cam: { orbit: [[0, 0, 0], 5.5, 6.5, 1.6, 2.2, 0.2, -0.1, [0, 1.2, 0]] },
        build: (S, t) => { const t1 = V('end', 'souvenirs') + 0.2, k = H.clamp((t - t1 + 0.9) / 0.9); if (k > 0) S.cyl((p) => add(rotZ(p, 0.3), [0.2, 9 * (1 - k) + 0.1, 0]), 0.9, 1.4, [255, 190, 120], 16, { glow: k < 1, cap: [120, 110, 100] }); },
        dave: (t) => { const t1 = V('end', 'souvenirs') + 0.2, u = H.clamp((t - t1) / 0.25); return { pos: [0.2, 0, 0], pose: u > 0 ? 'stand' : 'walk', t, yaw: 0.3, look: [0, 1], headTilt: -0.3, death: u > 0 ? 'squash' : undefined, u, xeyes: u > 0.5 }; },
        shake: V('end', 'souvenirs') + 0.2, flash: [V('end', 'souvenirs') + 0.2] },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.play('riser', 0.1, { dur: 1.5, gain: 0.25 }); k.play('stamp', V('hook', 'fine'), { gain: 0.45 });
      k.noise(V('drag', 'drag'), { dur: 2.5, color: 'pink', filter: 'bandpass', f: [[0, 300], [2.5, 900]], q: 0.6, gain: 0.15, a: 0.3 });
      k.noise(BEAT0('crash'), { dur: 3, color: 'brown', filter: 'lowpass', f: 500, gain: 0.3, a: 0.2 });
      for (let i = 0; i < 5; i++) k.play('thud', BEAT0('crash') + 1.6 + i * 0.25, { f: 70, gain: 0.25, minor: true });
      k.play('stamp', V('fine', 'fined'), { gain: 0.5 }); k.play('coin', V('fine', 'paid'), { gain: 0.35 });
      k.play('whoosh', V('end', 'souvenirs') - 0.6, { dur: 0.8, gain: 0.4 }); k.play('impact', V('end', 'souvenirs') + 0.2, { gain: 0.7 }); k.play('slap', V('end', 'souvenirs') + 0.22, { gain: 0.5 });
    },
  });
