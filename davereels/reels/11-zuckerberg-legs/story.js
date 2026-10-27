  // Dave reel 11: the metaverse's missing legs. Dave finally gets legs; the knees bend backwards; he walks off a virtual cliff. R.I.P. Dave #10.
  const BEATS = window.SCRIPT;
  const SH = [['office', 0], ['cams', BEAT0('cams') - 0.1], ['guess', BEAT0('guess') - 0.1], ['legs', BEAT0('legs') - 0.1], ['cliff', BEAT0('end') - 0.3]];
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const ST = (n) => SH.find((s) => s[0] === n)[1];
  const blinkAt = (t, seed = 0) => (((t + seed) % 2.7) < 0.12 ? 1 : 0);
  const NEON = [90, 200, 255], VR = [40, 42, 52];
  // the virtual world: a dark floor with a glowing grid, ending in a sharp edge at z = edge (if given), floating panels
  const vworld = (S, o = {}) => {
    const ez = o.edge ?? 40;
    S.quad([[-40, 0, -40], [40, 0, -40], [40, 0, ez], [-40, 0, ez]], [34, 36, 70], { bg: true, flat: true, grid: [1, 'rgba(90,200,255,0.55)'] });
    if (o.edge != null) S.quad([[-40, 0, ez], [40, 0, ez], [40, -30, ez], [-40, -30, ez]], [20, 22, 44], { bg: true, flat: true });
    for (const [x, y, z, w] of [[-2.2, 2.2, -3, 1.2], [2.4, 2.6, -4, 1.5], [0.2, 3.0, -6, 1.8]]) S.box((p) => add(p, [x, y, z]), w, w * 0.55, 0.02, [60, 70, 140], { glow: true, noShadow: true, paint: (c, W2, H2) => { c.fillStyle = '#3a4ab0'; c.fillRect(0, 0, W2, H2); c.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 4; i++) c.fillRect(W2 * 0.1, H2 * (0.2 + i * 0.17), W2 * (0.4 + 0.1 * (i % 2)), H2 * 0.07); } });
  };
  const vEnv = { bg: (ctx, W, H_) => { const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#0c0c24'); g.addColorStop(0.6, '#2a2468'); g.addColorStop(1, '#3a2a70'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); }, dof: 0.3, shadowAlpha: 0.4 };
  // the headset on Dave's face
  const headset = (S, dp, yaw = 0) => S.box((p) => add(dp, rotY(add(p, [0, 1.65, 0.12]), yaw)), 0.15, 0.06, 0.06, VR, { bevel: 0.3, gloss: 0.6 });
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), n = sh.name; let flash = 0;
    if (n === 'office' || n === 'legs') {
      // Dave as a floating torso in a virtual office
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.4, 2.9, 1.5, 1.4, 0.4, 0.15, [0, 1.25, 0]);
      const S = Scene(E, TG, W, H_); vworld(S);
      const bob = 0.05 * Math.sin(t * 2), dp = [0, 0.15 + bob, 0];
      dave(S, dp, { half: true, pose: 'wave', t, blink: blinkAt(t) });
      headset(S, dp);
      S.box((p) => add(p, [0.9, 0.75, -0.3]), 0.5, 0.03, 0.3, [80, 90, 170], { glow: true }); // a virtual desk
      S.render(ctx, W, H_, { ...vEnv, focus: 3 });
      if (n === 'office') { tagLabel(ctx, W / 2, H_ * 0.2, '$ BILLIONS', ramp(t, V('hook', 'billions') - 0.1, 0.2) * (1 - ramp(t, V('hook', 'legs') - 0.2, 0.2)), { px: 44, col: '#7ee07a' }); tagLabel(ctx, W / 2, H_ * 0.2, 'NO LEGS', ramp(t, V('hook', 'legs') - 0.1, 0.2), { px: 44, col: '#ff6a5a' }); const lp = S.proj([0, 0.5, 0]); FX.no(ctx, lp[0], lp[1], 60, ramp(t, V('hook', 'legs') - 0.1, 0.25)); }
      else { tagLabel(ctx, W / 2, H_ * 0.2, '2022: LEGS ARE COMING', ramp(t, V('legs', 'announced') - 0.2, 0.2) * (1 - ramp(t, V('legs', 'admitted') - 0.2, 0.2)), { px: 32 }); const su = ramp(t, V('legs', 'admitted') - 0.1, 0.2); if (su > 0) { ctx.save(); ctx.translate(W / 2, H_ * 0.2); ctx.rotate(-0.08); ctx.scale(H.ease.back(su), H.ease.back(su)); ctx.strokeStyle = '#ff5a4a'; ctx.lineWidth = 6; ctx.strokeRect(-230, -42, 460, 84); ctx.fillStyle = '#ff5a4a'; ctx.font = FONT(800, 36); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('NOT LIVE TRACKING', 0, 2); ctx.restore(); } }
    } else if (n === 'cams') {
      // the headset's cameras look outward: hands inside the view, legs outside it
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.6, 3.2, 1.3, 1.2, 1.2, 0.95, [0, 1.15, 0]);
      const S = Scene(E, TG, W, H_); vworld(S);
      const dp = [0, 0, 0]; dave(S, dp, { pose: 'carry', hands: [[0.3, 1.25, 0.45], [-0.3, 1.25, 0.45]], blink: blinkAt(t) }); headset(S, dp);
      // view cones (translucent) from the headset, pointing forward and a little down
      const cu = ramp(t, V('cams', 'outward') - 0.2, 0.4); if (cu > 0) for (const sx of [-1, 1]) { const o = [sx * 0.08, 1.65, 0.18], R = 0.9 * cu, far = add(o, [sx * 0.25, -0.55, 1.2 * cu]); const ring = []; for (let k = 0; k < 10; k++) { const a = (k / 10) * TAU; ring.push(add(far, [Math.cos(a) * R * 0.6, Math.sin(a) * R * 0.45, 0])); } for (let k = 0; k < 10; k++) S.face([o, ring[k], ring[(k + 1) % 10]], NEON, { alpha: 0.18, two: true, noShadow: true }); }
      S.render(ctx, W, H_, { ...vEnv, focus: 3.2 });
      const hp = S.proj([0, 1.25, 0.45]), lp = S.proj([0, 0.4, 0.05]);
      const hu = ramp(t, V('cams', 'hands') - 0.1, 0.2); if (hu > 0) tagLabel(ctx, W / 2, H_ * 0.2, '✓ HANDS', hu * (1 - ramp(t, V('cams', "can't") - 0.1, 0.2)), { px: 40, col: '#7ee07a' });
      const lu = ramp(t, V('cams', "can't") - 0.1, 0.2); if (lu > 0) { tagLabel(ctx, W / 2, H_ * 0.2, '✗ LEGS', lu, { px: 40, col: '#ff6a5a' }); FX.no(ctx, lp[0], lp[1], 50, lu); }
    } else if (n === 'guess') {
      // the computer guesses the knees from head and hands. Guess wrong: the knees bend backwards. So: float.
      const wrong = ramp(t, V('guess', 'wrong') - 0.2, 0.4), flt = ramp(t, V('guess', 'float') - 0.3, 0.5);
      const [E, TG] = orbit(t, sh.t0, sh.t1, [0, 0, 0], 3.2, 2.8, 1.2, 1.2, 1.35, 1.15, [0, 1.0, 0]);
      const S = Scene(E, TG, W, H_); vworld(S);
      const dp = [0, 0.3 * flt, 0];
      dave(S, dp, { pose: 'stand', half: flt > 0.5, kp: wrong > 0.5 ? [0, 0.2, -1] : [0, 0.2, 1], feet: [[0.12, 0.05 + 0.3 * wrong, 0.03 - 0.1 * wrong], [-0.12, 0.05 + 0.3 * wrong, 0.03 - 0.1 * wrong]], blink: blinkAt(t), look: [0, -1] });
      headset(S, dp);
      const gu = ramp(t, V('guess', 'guess') - 0.1, 0.3) * (1 - flt);
      if (gu > 0) { S.beads([add(dp, [0, 1.65, 0.15]), add(dp, [0.15, 0.5, 0.3])], [255, 210, 90], t * 0.8, { spacing: 0.06, r: 0.012, reveal: gu }); S.beads([add(dp, [0.3, 0.92, 0.04]), add(dp, [0.15, 0.5, 0.3])], [255, 210, 90], t * 0.8, { spacing: 0.06, r: 0.012, reveal: gu }); }
      S.render(ctx, W, H_, { ...vEnv, focus: 3 });
      const kp2 = S.proj(add(dp, [0.12, 0.48, wrong > 0.5 ? -0.15 : 0.15])); if (gu > 0) { ctx.save(); ctx.fillStyle = '#ffd24a'; ctx.font = FONT(800, 46); ctx.textAlign = 'center'; ctx.fillText('?', kp2[0] + 50, kp2[1]); ctx.restore(); }
      tagLabel(ctx, W / 2, H_ * 0.2, 'KNEES BACKWARDS', wrong * (1 - flt), { px: 36, col: '#ff6a5a' });
      tagLabel(ctx, W / 2, H_ * 0.2, 'JUST FLOAT', flt, { px: 40 });
    } else {
      // Dave finally gets legs. They bend backwards. He walks off a virtual cliff.
      const t0 = sh.t0, walk = H.clamp((t - t0 - 0.4) / 1.6), z = -1.2 + 2.4 * walk, over = Math.max(0, z - 1.0), fall = over > 0 ? Math.min(30, 4.9 * Math.pow((t - t0 - 0.4 - 1.6 * (2.2 / 2.4)) * 1.0, 2)) : 0;
      const [E, TG] = orbit(t, sh.t0, sh.t1, [1.5, 0, 1.0], 4.6, 4.4, 1.0, 0.8, 1.3, 1.45, [-1.2, 0.6, 0]);
      const S = Scene(E, TG, W, H_); vworld(S, { edge: 1.0 });
      const dp = [0, -fall, Math.min(z, 1.45)];
      dave(S, dp, { pose: 'walk', t: t * 0.8, kp: [0, 0.2, -1], pitch: over > 0 ? 0.6 * H.clamp(fall) : 0, blink: blinkAt(t), look: [0, over > 0 ? 1 : 0], xeyes: fall > 1.5 });
      headset(S, dp);
      S.render(ctx, W, H_, { ...vEnv, focus: 4.4 });
      tagLabel(ctx, W / 2, H_ * 0.2, '0 KNEES', ramp(t, V('end', 'zero') - 0.1, 0.2), { px: 44, col: '#ff6a5a' });
    }
    const rip = ripU(t);
    const cap = captionAt(WORDS, t); if (cap && rip <= 0) word(ctx, W, H_, cap.w, cap.t, t);
    finish(ctx, W, H_, t, flash);
    ripCard(ctx, W, H_, 10, rip, t, { cause: 'cause of death:\nbackwards knees' });
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.4, gain: 0.3, minor: true });
    k.tone(0.05, { f: 110, type: 'triangle', dur: ST('cliff'), gain: 0.04, a: 1, hold: ST('cliff') - 1, minor: true }); // the virtual hum
    k.play('coin', V('hook', 'billions'), { gain: 0.5 }); k.play('error', V('hook', 'legs'), { gain: 0.3 });
    k.play('select', V('cams', 'hands'), { gain: 0.5 }); k.play('error', V('cams', "can't"), { gain: 0.3 });
    k.play('glitch', V('guess', 'wrong'), { gain: 0.5 }); k.play('jump', V('guess', 'float') - 0.2, { gain: 0.5 });
    k.play('powerup', V('legs', 'announced'), { gain: 0.4 }); k.play('stamp', V('legs', 'admitted'), { gain: 0.5 });
    const t0 = ST('cliff'); for (let i = 0; i < 4; i++) k.play('tock', t0 + 0.5 + i * 0.4, { f: 500, gain: 0.3 });
    k.play('hurt', t0 + 2.0, { gain: 0.6 });
    ripSound(k, REEL_WORDS.end + 0.45);
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
