  // ==================== makeDave: a whole Dave reel from short per-shot specs ====================
  // Load it after dave.js: meta.json "libs": ["davereels/props/dave.js", "davereels/props/dave_kit.js"].
  // Older reels do not load it, so they render exactly as before.
  //
  // makeDave({
  //   rip: { n: 22, cause: 'cause of death:\nread the manual' },   // the R.I.P. card number and cause
  //   shots: ({ V, BEAT0 }) => ({ name: spec, ... }),              // in time order
  //   sound: (k, { V, BEAT0 }) => {...},                           // extra sounds (cuts, tags, R.I.P. are automatic)
  // })
  // spec = {
  //   beat: 'id' (default: the shot name) or at: time (start of the shot; default: the beat's first word - 0.1),
  //   set: 'garage' | 'garage-empty' | 'road' | 'sky' | 'space' | 'lab' | 'launchpad' | 'factory' | 'ocean' | 'city' |
  //        'office' | 'stage' | 'desert' | 'none' | (S, t, u) => {...},  setOpt: { board: [3 lines], rocket: false,
  //        chart: 'Q3', slide: 'REVOLUTIONARY', props: false },
  //   crew: [{ who: 'engineer' | 'boss' | 'scientist' | 'general' | 'astronaut' | 'intern' | 'pilot' | 'chef', pos, pose,
  //          yaw, death, u, mouth, sweat, xeyes, hide }] or (t, u) => [...]: other dummies with jobs (never real people),
  //   cam: { orbit: [centre, r0, r1, h0, h1, a0, a1, look] } | [E0, T0, E1, T1] (dolly),
  //   render: { bg, dof, focus, shadows } (defaults follow the set),
  //   build: (S, t, u) => {...} (the scene), dave: { pos: [x, y, z], pose, yaw, death, u, ... } | (t, u) => {...} | null,
  //   tags: [['TEXT', time, y (0..1 of the frame height, default 0.18), { px, bg, col }]],
  //   flash: [times], shake: time, over: (ctx, W, H_, t, u, S) => {...} (2D on top), sfx: [['name', time, opts]] }
  const DAVEKIT = (() => {
    const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
    const pulse = (t, at, k = 6) => Math.exp(-Math.pow((t - at) * k, 2));
    const sky = (ctx, W, H_) => sunsetSky(ctx, W, H_);
    const night = (ctx, W, H_) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#141836'); g.addColorStop(0.6, '#2c2c66'); g.addColorStop(1, '#4a3c74'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); const r = H.rng(5); ctx.fillStyle = 'rgba(255,255,240,0.7)'; for (let i = 0; i < 70; i++) ctx.fillRect(r.range(0, W), r.range(0, H_ * 0.5), 2, 2); };
    const wallZ = (S, z, col, paint, h = 4.6) => S.quad([[-12, 0, z], [12, 0, z], [12, h, z], [-12, h, z]], col, { bg: true, paint: paint && ((c, w, hh) => { c.save(); c.translate(0, hh); c.scale(1, -1); paint(c, w, hh); c.restore(); }) });
    const floorZ = (S, z, col, o = {}) => S.quad([[-12, 0, z], [12, 0, z], [12, 0, 12], [-12, 0, 12]], col, Object.assign({ bg: true }, o));
    const ground = (S, col, o = {}) => S.quad([[-80, 0, -80], [80, 0, -80], [80, 0, 30], [-80, 0, 30]], col, Object.assign({ bg: true, flat: false }, o));
    const write = (c, txt, x, y, px, col) => { c.font = FONT(800, px); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(txt, x, y); };
    const IN = { dof: 0.33, focus: 3 }, OUT = { bg: sky, dof: 0, shadows: false };
    const SETS = {
      garage: { build: (S, o) => garage(S, o), render: IN },
      'garage-empty': { build: (S, o) => garage(S, Object.assign({ props: false }, o)), render: IN },
      road: { build: (S, o) => testRoad(S, o), render: OUT },
      sky: { build: () => {}, render: OUT },
      space: { build: () => {}, render: { bg: typeof spaceBg !== 'undefined' ? spaceBg : night, dof: 0, shadows: false } },
      none: { build: () => {}, render: { dof: 0 } },
      // a science lab: white tiles, a whiteboard of bad maths, benches with glowing flasks
      lab: { render: IN, build: (S, o) => {
        wallZ(S, -3.2, [226, 232, 236], (c, w, h) => { c.fillStyle = '#fafafa'; c.fillRect(w * 0.36, h * 0.3, w * 0.28, h * 0.22); c.strokeStyle = '#3a4a9a'; c.lineWidth = 3; c.font = FONT(700, h * 0.03); c.fillStyle = '#3a4a9a'; c.textAlign = 'left'; ['E = mc² + ?', 'safety = 0.5', 'what if: MORE'].forEach((l, i) => c.fillText(o.board ? o.board[i] || '' : l, w * 0.38, h * (0.35 + i * 0.06))); });
        floorZ(S, -3.2, [200, 206, 210], { grid: [0.5, 'rgba(120,130,140,0.35)'] });
        [-1.6, 1.6].forEach((x) => { S.box((p) => add(p, [x, 0.45, -1.8]), 0.9, 0.45, 0.35, [230, 230, 236], { bevel: 0.05 }); S.box((p) => add(p, [x, 0.92, -1.8]), 0.95, 0.03, 0.38, [40, 44, 52], { bevel: 0.2 });
          [-0.4, 0, 0.4].forEach((dx, i) => S.cyl((p) => add(p, [x + dx, 0.95, -1.8]), 0.08, 0.22, [[120, 240, 140], [240, 120, 200], [120, 200, 255]][i], 10, { glow: true })); });
      } },
      // a launch pad at dusk: concrete, a lattice tower and (opt.rocket !== false) a rocket
      launchpad: { render: OUT, build: (S, o) => {
        ground(S, [150, 146, 140]); S.quad([[-6, 0.01, -6], [6, 0.01, -6], [6, 0.01, 2], [-6, 0.01, 2]], [196, 192, 186], { bg: true });
        for (let i = 0; i < 9; i++) S.box((p) => add(p, [-2.4, 0.5 + i * 1.0, -3]), 0.35, 0.04, 0.35, [200, 70, 50], { bevel: 0.1 });
        [[-2.75, -3.35], [-2.05, -3.35], [-2.75, -2.65], [-2.05, -2.65]].forEach(([x, z]) => S.box((p) => add(p, [x, 4.6, z]), 0.04, 4.6, 0.04, [200, 70, 50], { bevel: 0.1 }));
        if (o.rocket !== false) { S.cyl((p) => add(p, [-0.6, 0, -3]), 0.6, 7, [240, 240, 244], 18); S.cyl((p) => add(p, [-0.6, 7, -3]), 0.6, 0.9, [40, 40, 48], 18, { top: 0.05 }); }
      } },
      // a factory: dark walls with hazard stripes, a conveyor belt and a big robot arm
      factory: { render: { dof: 0.3, focus: 3 }, build: (S, o, t) => {
        wallZ(S, -3.2, [70, 74, 82], (c, w, h) => { for (let i = 0; i < 40; i++) { c.fillStyle = i % 2 ? '#f2c230' : '#1c1c22'; c.beginPath(); c.moveTo((i * w) / 40, h * 0.86); c.lineTo(((i + 1) * w) / 40, h * 0.86); c.lineTo(((i + 2) * w) / 40, h * 0.9); c.lineTo(((i + 1) * w) / 40, h * 0.9); c.fill(); } });
        floorZ(S, -3.2, [96, 98, 104], { grid: [1.0, 'rgba(0,0,0,0.25)'] });
        S.box((p) => add(p, [0, 0.45, -1.6]), 3.5, 0.1, 0.4, [40, 40, 46], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#5a5a64'; for (let i = 0; i < 30; i++) c.fillRect(((i * w) / 30 + (t || 0) * 60) % w, 0, 4, h); } });
        for (let i = 0; i < 4; i++) S.box((p) => add(p, [-2.4 + ((i * 1.6 + (t || 0) * 0.6) % 4.8), 0.68, -1.6]), 0.18, 0.13, 0.18, [200, 150, 90], { bevel: 0.1 });
        S.cyl((p) => add(p, [2.6, 0, -2.2]), 0.35, 0.6, [242, 140, 40], 14); S.box((p) => add(rotZ(p, 0.6 + Math.sin((t || 0) * 1.5) * 0.3), [2.3, 1.4, -2.2]), 0.12, 0.8, 0.12, [242, 140, 40], { bevel: 0.2 });
      } },
      // the sea: blue water, a little ship deck to stand on
      ocean: { render: OUT, build: (S, o) => {
        ground(S, [52, 110, 170]); S.box((p) => add(p, [0, -0.2, -0.5]), 3.2, 0.2, 1.6, [150, 110, 80], { bevel: 0.05, paint: (c, w, h) => { c.strokeStyle = 'rgba(0,0,0,0.25)'; for (let i = 1; i < 12; i++) { c.beginPath(); c.moveTo((i * w) / 12, 0); c.lineTo((i * w) / 12, h); c.stroke(); } } });
        S.box((p) => add(p, [0, -0.7, -0.5]), 3.3, 0.45, 1.7, [200, 60, 50], { bevel: 0.05 }); S.cyl((p) => add(p, [-2.4, 0, -1.4]), 0.06, 3.5, [240, 240, 240], 8);
      } },
      // a city street at night: building blocks with lit windows, a road
      city: { render: { bg: night, dof: 0, shadows: false }, build: (S) => {
        ground(S, [70, 72, 84]); S.quad([[-80, 0.01, 0.8], [80, 0.01, 0.8], [80, 0.01, 4], [-80, 0.01, 4]], [44, 46, 56], { bg: true });
        const r = H.rng(8); for (let i = 0; i < 9; i++) { const x = -8 + i * 2, h = r.range(3, 9); S.box((p) => add(p, [x, h / 2, -6 - r.range(0, 3)]), 0.9, h / 2, 0.9, [r.range(50, 80), r.range(54, 84), r.range(80, 110)], { bevel: 0.02, paint: (c, w, hh) => { c.fillStyle = 'rgba(255,214,120,0.85)'; const rr = H.rng(i); for (let k = 0; k < 40; k++) if (rr() > 0.5) c.fillRect((k % 5) * w / 5 + 6, Math.floor(k / 5) * hh / 8 + 6, w / 10, hh / 20); } }); }
      } },
      // a boardroom: long table, skyline window, a sales chart going straight down
      office: { render: IN, build: (S, o) => {
        wallZ(S, -3.2, [210, 204, 196], (c, w, h) => { c.fillStyle = '#9ab8d8'; c.fillRect(w * 0.08, h * 0.25, w * 0.3, h * 0.4); c.fillStyle = '#6a7a9a'; for (let i = 0; i < 8; i++) c.fillRect(w * (0.09 + i * 0.036), h * (0.45 - (i % 3) * 0.06), w * 0.03, h * 0.2); c.fillStyle = '#fafafa'; c.fillRect(w * 0.55, h * 0.27, w * 0.3, h * 0.25); c.strokeStyle = '#d83a34'; c.lineWidth = 6; c.beginPath(); c.moveTo(w * 0.57, h * 0.3); c.lineTo(w * 0.65, h * 0.35); c.lineTo(w * 0.72, h * 0.33); c.lineTo(w * 0.83, h * 0.5); c.stroke(); if (o.chart) write(c, o.chart, w * 0.7, h * 0.3, h * 0.025, '#2a2a33'); });
        floorZ(S, -3.2, [120, 90, 70], { grid: [0.6, 'rgba(0,0,0,0.12)'] });
        S.box((p) => add(p, [0, 0.72, -1.4]), 1.8, 0.04, 0.5, [100, 66, 44], { bevel: 0.2 }); [-1.4, 1.4].forEach((x) => S.box((p) => add(p, [x, 0.36, -1.4]), 0.06, 0.36, 0.4, [80, 54, 36], { bevel: 0.2 }));
      } },
      // a tech-demo stage: dark, a big screen with a slide (opt.slide), spotlights
      stage: { render: { bg: '#141018', dof: 0.25, focus: 3 }, build: (S, o) => {
        wallZ(S, -3.2, [24, 20, 30], (c, w, h) => { c.fillStyle = '#e8eef8'; c.fillRect(w * 0.3, h * 0.24, w * 0.4, h * 0.3); write(c, o.slide || 'REVOLUTIONARY', w / 2, h * 0.39, h * 0.045, '#1a1a24'); });
        floorZ(S, -3.2, [50, 40, 56]); S.box((p) => add(p, [0, 0.15, -1.2]), 3.4, 0.15, 1.6, [70, 56, 80], { bevel: 0.05 });
        S.box((p) => add(p, [1.4, 0.75, -1.0]), 0.28, 0.45, 0.2, [40, 34, 50], { bevel: 0.2 });
      } },
      // a desert test range: sand, flat-topped mesas, a bunker
      desert: { render: OUT, build: (S) => {
        ground(S, [226, 180, 120]); const r = H.rng(6); for (let i = 0; i < 6; i++) { const h = r.range(2, 5), x = -20 + i * 8 + r.range(-2, 2); S.box((p) => add(p, [x, h / 2, -30 - r.range(0, 10)]), r.range(2, 4), h / 2, 2, [200, 130, 90], { bevel: 0.05 }); }
        S.box((p) => add(p, [-3, 0.4, -4]), 1.2, 0.4, 0.8, [150, 150, 140], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#1c1c22'; c.fillRect(w * 0.35, h * 0.4, w * 0.3, h * 0.12); } });
      } },
    };
    // the crew: other crash-test dummies with jobs (never real people): crew(S, 'engineer', pos, { pose, yaw, ... })
    const CREW = {
      engineer: { colors: { body: [90, 150, 220], hat: [250, 210, 50] } },
      boss: { colors: { body: [180, 180, 186], hat: [40, 40, 48] }, suit: true },
      scientist: { colors: { body: [240, 240, 244], hat: [120, 220, 140] }, suit: true, suitCol: [246, 246, 246] },
      general: { colors: { body: [120, 130, 90], hat: [80, 90, 60] }, suit: true, suitCol: [84, 96, 62] },
      astronaut: { colors: { body: [244, 244, 248], hat: [244, 244, 248] } },
      intern: { colors: { body: [120, 210, 120], hat: [250, 120, 160] } },
      pilot: { colors: { body: [60, 70, 110], hat: [230, 230, 236] }, suit: true, suitCol: [40, 50, 90] },
      chef: { colors: { body: [250, 250, 250], hat: [250, 250, 250] } },
    };
    const crew = (S, who, pos, o = {}) => dave(S, pos, Object.assign({ pose: 'stand', decals: false }, CREW[who] || {}, o, { colors: Object.assign({}, (CREW[who] || {}).colors, o.colors) }));
    return { blinkAt, pulse, SETS, CREW, crew };
  })();

  const makeDave = (cfg) => {
    const BEATS = window.SCRIPT, TM = { V, BEAT0, WORDS, DURATION };
    const specs = cfg.shots(TM), names = Object.keys(specs);
    const SH = names.map((n, i) => [n, i === 0 ? 0 : specs[n].at != null ? specs[n].at : BEAT0(specs[n].beat || n) - 0.1]).sort((a, b) => a[1] - b[1]);
    const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
    const EXPLAIN = (ctx, W, H_, t) => {
      const sh = shotAt(t), sp = specs[sh.name] || {}, u = H.clamp((t - sh.t0) / Math.max(0.01, sh.t1 - sh.t0));
      let E, TG;
      if (sp.cam && sp.cam.orbit) { const o = sp.cam.orbit; [E, TG] = orbit(t, sh.t0, sh.t1, o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7]); }
      else { const c = sp.cam || [[0.6, 1.6, 4.2], [0, 1.0, 0], [0.4, 1.5, 3.4], [0, 1.05, 0]]; [E, TG] = dolly(t, sh.t0, sh.t1, c[0], c[1], c[2], c[3]); }
      const shk = sp.shake != null && t > sp.shake ? Math.exp(-(t - sp.shake) * 3) : 0;
      if (shk) { E = E.map((v, i) => v + (i < 2 ? Math.sin(t * 61 + i * 7) * 0.06 * shk : 0)); }
      const S = Scene(E, TG, W, H_), set = typeof sp.set === 'function' ? null : DAVEKIT.SETS[sp.set || 'garage'];
      if (set) set.build(S, sp.setOpt || {}, t); else sp.set(S, t, u);
      if (sp.build) sp.build(S, t, u);
      const dv = typeof sp.dave === 'function' ? sp.dave(t, u) : sp.dave;
      if (dv) dave(S, dv.pos || [0, 0, 0], Object.assign({ pose: 'stand', t, blink: DAVEKIT.blinkAt(t) }, dv));
      for (const c of (typeof sp.crew === 'function' ? sp.crew(t, u) : sp.crew) || []) if (c && !c.hide) DAVEKIT.crew(S, c.who, c.pos || [1, 0, 0], Object.assign({ t, blink: DAVEKIT.blinkAt(t, c.pos ? c.pos[0] : 1) }, c));
      S.render(ctx, W, H_, Object.assign({}, set ? set.render : { dof: 0.3, focus: 3 }, sp.render || {}));
      for (const [txt, at, y, o] of sp.tags || []) tagLabel(ctx, W / 2, H_ * (y ?? 0.18), txt, ramp(t, at - 0.1, 0.2), Object.assign({ px: 38 }, o || {}));
      if (sp.over) sp.over(ctx, W, H_, t, u, S);
      let flash = 0; for (const at of sp.flash || []) flash = Math.max(flash, 0.14 * DAVEKIT.pulse(t, at, 5));
      const rip = ripU(t);
      const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
      finish(ctx, W, H_, t, flash);
      if (cfg.rip) ripCard(ctx, W, H_, cfg.rip.n, rip, t, { cause: cfg.rip.cause });
    };
    function scoreSound(k) {
      for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
      for (const n of names) { const sp = specs[n];
        (sp.tags || []).forEach(([, at], i) => k.play('pop', at, { f: 520 + i * 60, gain: 0.32 }));
        (sp.flash || []).forEach((at) => { k.play('impact', at, { gain: 0.45 }); });
        if (sp.shake != null) k.noise(sp.shake, { dur: 0.9, color: 'brown', filter: 'lowpass', f: 450, gain: 0.25, a: 0.02 });
        (sp.sfx || []).forEach(([name, at, o]) => k.play(name, at, o || {}));
      }
      if (cfg.sound) cfg.sound(k, TM);
      if (cfg.rip) ripSound(k, REEL_WORDS.end + 0.45);
    }
    window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
    window.scoreSound = scoreSound;
  };
