  // ==================== makeMech: a whole mechanic Short from short per-shot specs ====================
  // meta.json "libs": ["davereels/props/dave_kit.js", "mechreels/props/mech_kit.js", ...your prop files]
  // (dave_kit.js supplies the 14 shared locations; add "davereels/props/dave.js" first to use the dummy crew).
  //
  // makeMech({
  //   shots: ({ V, BEAT0 }) => ({ name: spec, ... }),   // in time order
  //   end: { text: 'FULL VIDEO ON THE CHANNEL', at: time },  // optional end card
  //   sound: (k, { V, BEAT0 }) => {...},
  // })
  // spec = { beat | at, set (any DAVEKIT set name, or (S, t, u) => {}), setOpt, cam: { orbit: [...] } | [E0, T0, E1, T1],
  //   render, build: (S, t, u) => {...} (parts, x-ray glass, flow beads), crew: [...] (needs dave.js),
  //   tags: [['TEXT', time, y, { px, bg, col }]], flash: [times], shake: time, over: (ctx, W, H_, t, u, S) => {...},
  //   sfx: [['name', time, opts]] }
  const MECHKIT = (() => {
    const pill = (ctx, x, y, txt, u, o = {}) => { if (u <= 0) return; const s = H.ease.back(H.clamp(u)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.font = FONT(800, o.px || 38);
      const w = ctx.measureText(txt).width + 36, h = (o.px || 38) * 1.5; ctx.fillStyle = o.bg || 'rgba(26,24,32,0.88)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
      ctx.fillStyle = o.col || '#ffd24a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 2); ctx.restore(); };
    const pulse = (t, at, k = 6) => Math.exp(-Math.pow((t - at) * k, 2));
    return { pill, pulse };
  })();

  const makeMech = (cfg) => {
    const BEATS = window.SCRIPT, TM = { V, BEAT0, WORDS, DURATION };
    const SETS = typeof DAVEKIT !== 'undefined' ? DAVEKIT.SETS : { garage: { build: (S, o) => garage(S, o), render: { dof: 0.33, focus: 3 } }, road: { build: (S, o) => testRoad(S, o), render: { bg: sunsetSky, dof: 0, shadows: false } } };
    const specs = cfg.shots(TM), names = Object.keys(specs);
    const SH = names.map((n, i) => [n, i === 0 ? 0 : specs[n].at != null ? specs[n].at : BEAT0(specs[n].beat || n) - 0.12]).sort((a, b) => a[1] - b[1]);
    const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
    const EXPLAIN = (ctx, W, H_, t) => {
      const sh = shotAt(t), sp = specs[sh.name] || {}, u = H.clamp((t - sh.t0) / Math.max(0.01, sh.t1 - sh.t0));
      let E, TG;
      if (sp.cam && sp.cam.orbit) { const o = sp.cam.orbit; [E, TG] = orbit(t, sh.t0, sh.t1, o[0], o[1], o[2], o[3], o[4], o[5], o[6], o[7]); }
      else { const c = sp.cam || [[0.8, 1.4, 3.6], [0, 0.9, 0], [0.6, 1.3, 3.0], [0, 0.95, 0]]; [E, TG] = dolly(t, sh.t0, sh.t1, c[0], c[1], c[2], c[3]); }
      if (sp.shake != null && t > sp.shake) { const k = Math.exp(-(t - sp.shake) * 3); E = E.map((v, i) => v + (i < 2 ? Math.sin(t * 61 + i * 7) * 0.05 * k : 0)); }
      const S = Scene(E, TG, W, H_), set = typeof sp.set === 'function' ? null : SETS[sp.set || 'garage'];
      if (set) set.build(S, sp.setOpt || {}, t); else sp.set(S, t, u);
      if (sp.build) sp.build(S, t, u);
      if (typeof DAVEKIT !== 'undefined' && typeof dave !== 'undefined') for (const c of (typeof sp.crew === 'function' ? sp.crew(t, u) : sp.crew) || []) if (c && !c.hide) DAVEKIT.crew(S, c.who, c.pos || [1, 0, 0], Object.assign({ t }, c));
      S.render(ctx, W, H_, Object.assign({}, set ? set.render : { dof: 0.3, focus: 3 }, sp.render || {}));
      for (const [txt, at, y, o] of sp.tags || []) MECHKIT.pill(ctx, W / 2, H_ * (y ?? 0.18), txt, ramp(t, at - 0.1, 0.2), o || {});
      if (sp.over) sp.over(ctx, W, H_, t, u, S);
      let flash = 0; for (const at of sp.flash || []) flash = Math.max(flash, 0.14 * MECHKIT.pulse(t, at, 5));
      const cap = captionAt(WORDS, t); if (cap) word(ctx, W, H_, cap.w, cap.t, t);
      finish(ctx, W, H_, t, flash);
      if (cfg.end && t > cfg.end.at) MECHKIT.pill(ctx, W / 2, H_ * 0.72, cfg.end.text, ramp(t, cfg.end.at, 0.3), { px: 34, bg: 'rgba(214,50,40,0.95)', col: '#fff' });
    };
    function scoreSound(k) {
      for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
      for (const n of names) { const sp = specs[n];
        (sp.tags || []).forEach(([, at], i) => k.play('pop', at, { f: 520 + i * 60, gain: 0.32 }));
        (sp.flash || []).forEach((at) => k.play('impact', at, { gain: 0.45 }));
        if (sp.shake != null) k.noise(sp.shake, { dur: 0.9, color: 'brown', filter: 'lowpass', f: 450, gain: 0.25, a: 0.02 });
        (sp.sfx || []).forEach(([name, at, o]) => k.play(name, at, o || {}));
      }
      if (cfg.end) k.play('ding', cfg.end.at, { f: 'E6', gain: 0.4 });
      if (cfg.sound) cfg.sound(k, TM);
    }
    window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
    window.scoreSound = scoreSound;
  };
