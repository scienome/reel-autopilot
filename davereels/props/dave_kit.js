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
  //   set: 'garage' | 'garage-empty' | 'road' | 'sky' | 'space' | 'none' | (S, t, u) => {...},  setOpt: {...},
  //   cam: { orbit: [centre, r0, r1, h0, h1, a0, a1, look] } | [E0, T0, E1, T1] (dolly),
  //   render: { bg, dof, focus, shadows } (defaults follow the set),
  //   build: (S, t, u) => {...} (the scene), dave: { pos: [x, y, z], pose, yaw, death, u, ... } | (t, u) => {...} | null,
  //   tags: [['TEXT', time, y (0..1 of the frame height, default 0.18), { px, bg, col }]],
  //   flash: [times], shake: time, over: (ctx, W, H_, t, u, S) => {...} (2D on top), sfx: [['name', time, opts]] }
  const DAVEKIT = (() => {
    const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
    const pulse = (t, at, k = 6) => Math.exp(-Math.pow((t - at) * k, 2));
    const SETS = {
      garage: { build: (S, o) => garage(S, o), render: { dof: 0.33, focus: 3 } },
      'garage-empty': { build: (S, o) => garage(S, Object.assign({ props: false }, o)), render: { dof: 0.33, focus: 3 } },
      road: { build: (S, o) => testRoad(S, o), render: { bg: sunsetSky, dof: 0, shadows: false } },
      sky: { build: () => {}, render: { bg: sunsetSky, dof: 0, shadows: false } },
      space: { build: () => {}, render: { bg: typeof spaceBg !== 'undefined' ? spaceBg : sunsetSky, dof: 0, shadows: false } },
      none: { build: () => {}, render: { dof: 0 } },
    };
    return { blinkAt, pulse, SETS };
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
      if (set) set.build(S, sp.setOpt || {}); else sp.set(S, t, u);
      if (sp.build) sp.build(S, t, u);
      const dv = typeof sp.dave === 'function' ? sp.dave(t, u) : sp.dave;
      if (dv) dave(S, dv.pos || [0, 0, 0], Object.assign({ pose: 'stand', t, blink: DAVEKIT.blinkAt(t) }, dv));
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
