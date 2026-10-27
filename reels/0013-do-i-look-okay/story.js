  // ==================== 0013 "Do I look okay?" : a sarcastic couple reel ====================
  const BEATS = window.SCRIPT;
  const { V, DURATION } = REEL_TIMING(BEATS);
  // ---- shot helpers (shared by this week's reels) ----
  // cameras: [E0, T0, E1, T1], pushed in slowly through the shot with shotCam
  const CAMS = {
    wide: [[0.25, 1.55, 3.9], [0, 1.0, -0.35], [0.12, 1.5, 3.4], [0, 1.03, -0.35]],
    two: [[0, 1.55, 3.0], [0, 1.25, -0.4], [0, 1.55, 2.65], [0, 1.28, -0.4]],
    him: [[-0.78, 1.62, 1.15], [-0.62, 1.58, -0.42], [-0.74, 1.62, 0.92], [-0.62, 1.58, -0.42]],
    her: [[0.74, 1.6, 1.15], [0.62, 1.56, -0.42], [0.71, 1.6, 0.92], [0.62, 1.56, -0.42]],
  };
  const room = (W, H_, t, a, b, cam, o = {}) => { const [E, TG] = shotCam(t, a, b, ...(typeof cam === 'string' ? CAMS[cam] : cam)); const S = Scene(E, TG, W, H_); livingRoom(S, o); return S; };
  // the couple, with every doll option passed through (shirt colour, legs, hold ...)
  const HE = (S, o = {}) => S.doll(-0.62, 0.62, -0.42, o.yaw ?? 0.18, { kind: 'boy', ...sit, arms: [[0.35, 0.18, 0.7], [0.5, 0.05, 0.9]], head: { yaw: 0.25 }, ...o });
  const SHE = (S, o = {}) => S.doll(0.62, 0.62, -0.42, o.yaw ?? -0.2, { kind: 'girl', s: 0.95, ...sit, arms: [[0.5, 0.05, 0.9], [0.35, 0.18, 0.7]], head: { yaw: -0.3 }, ...o });
  // arm poses: [[forward, outward, elbowBend] left, right]
  const POSE = {
    rest: [[0.35, 0.18, 0.7], [0.5, 0.05, 0.9]],
    phone: [[0.8, 0.1, 1.0], [0.8, 0.1, 1.0]],
    hold: [[1.05, 0.05, 0.75], [1.05, 0.05, 0.75]],
    clasp: [[0.55, -0.25, 1.15], [0.55, -0.25, 1.15]],
    shrug: [[1.0, -0.2, 1.9], [1.0, -0.2, 1.9]],
    hug: [[0.6, -0.1, 1.6], [0.6, -0.1, 1.6]],
    reach: [[1.6, 0.1, 0.1], [1.6, 0.1, 0.1]],
    head: [[2.3, 0.35, 1.9], [2.3, 0.35, 1.9]],
    cheer: [[2.6, -0.55, 0.3], [2.6, -0.55, 0.3]],
    cheeks: [[1.2, 0.5, 2.2], [1.2, 0.5, 2.2]],
    slump: [[0.7, 0.12, 1.5], [0.7, 0.12, 1.5]],
  };
  const PT = [0.2, 1.4, 0.1], UP = [2.0, -0.35, 0.0]; // one arm pointing sideways at the other / one hand raised
  const wave = (t, f = 9, k = 0.03) => Math.sin(t * f) * k;
  // little 2D cards: a rounded panel with a soft shadow, popped in by u
  const card = (ctx, x, y, w, h, u, fill = '#fff8ec', rot = 0) => {
    if (u <= 0) return false; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(u, u);
    ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) * 0.22); ctx.fill();
    ctx.shadowColor = 'transparent'; return true; // caller draws inside, then ctx.restore()
  };
  const label = (ctx, txt, x, y, px, col = '#1c1a22', w = 900) => { ctx.font = FONT(w, px); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(txt, x, y); };
  // a chat bubble (side -1 = from the left, grey; +1 = from the right, blue)
  const bubble = (ctx, x, y, txt, side, u, px = 34) => {
    if (u <= 0) return; ctx.save(); ctx.font = FONT(800, px); const w = ctx.measureText(txt).width + px * 1.2, h = px * 1.9;
    ctx.translate(x, y); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
    ctx.fillStyle = side > 0 ? '#3d8bf2' : '#f2f0f5'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(side * (w / 2 - 22), h / 2 - 14); ctx.lineTo(side * (w / 2 + 6), h / 2 + 6); ctx.lineTo(side * (w / 2 - 40), h / 2 - 4); ctx.fill();
    ctx.shadowColor = 'transparent'; label(ctx, txt, 0, 2, px, side > 0 ? '#ffffff' : '#1c1a22', 800); ctx.restore();
  };
  // floating "Z"s for sleep
  const zzz = (ctx, x, y, t, u) => { if (u <= 0) return; for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3) % 1); ctx.save(); ctx.globalAlpha = u * (1 - k); ctx.translate(x + k * 60 + i * 6, y - k * 120); ctx.rotate(-0.2); FX.qmark(ctx, 0, 0, 0.35 + 0.25 * k, 'Z', 0); ctx.restore(); } };
  // a smug little sparkle pair next to a head
  const smug = (ctx, x, y, t, u) => { if (u <= 0) return; FX.sparkle(ctx, x, y, 26 * u, t * 2); FX.sparkle(ctx, x + 34, y + 30, 16 * u, -t * 2); };
  const hearts = (ctx, W, t, st, n = 5, y0 = 640) => { for (let i = 0; i < n; i++) { const s0 = st + i * 0.3, u = t - s0; if (u < 0) continue; FX.heart(ctx, W * 0.5 + Math.sin(u * 2 + i) * 50 + (i - (n - 1) / 2) * 55, y0 - u * 120, 66 * popU(t, s0, 0.4), Math.sin(u * 3 + i) * 0.2); } };
  const heartSound = (k, st, n = 5) => { for (let i = 0; i < n; i++) k.play('pop', st + i * 0.3, { f: 900 + i * 80, gain: 0.45, minor: true }); ['C5', 'E5', 'G5'].forEach((f, i) => k.play('ding', st + 0.1 + i * 0.1, { f, gain: 0.3 })); };
  // the common score: a whoosh on every cut, a minor pop on every caption chunk
  const baseSound = (k) => { SH.slice(1).forEach(([, s]) => k.play('whoosh', s - 0.06, { dur: 0.22, gain: 0.35, minor: true })); CAPS.forEach(([t]) => k.play('pop', t, { f: 760, gain: 0.35, minor: true })); };
  const nopeSound = (k, t) => { k.play('stroke', t, { material: 'marker', dur: 0.3, gain: 0.45 }); k.play('buzz', t + 0.3, { f: 110, dur: 0.3, gain: 0.55 }); k.play('thud', t + 0.28, { f: 120, gain: 0.45 }); };
  const twistSound = (k, t) => { k.play('riser', t - 0.45, { dur: 0.45, gain: 0.4 }); k.play('impact', t, { gain: 0.7 }); k.play('success', t + 0.04, { f: 'C6', gain: 0.6 }); k.play('sparkle', t + 0.1, { gain: 0.6, minor: true }); };
  const SH = [
    ['hook', 0], ['ask', V('ask', 'do') - 0.15], ['fast', V('fast', 'he') - 0.15], ['look', V('look', 'you') - 0.15], ['looks', V('looks', 'so') - 0.15],
    ['trap', V('trap', 'now') - 0.15], ['twist', V('twist', 'so') - 0.15], ['her', V('her', 'she') - 0.15], ['close', V('close', 'he') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'the'), [['THE', 'MOST', K('DANGEROUS')], ['QUESTION', 'IN', 'A'], ['RELATIONSHIP.']]],
    [V('ask', 'do'), [['"DO', 'I', 'LOOK'], [K('OKAY?"')]]],
    [V('fast', 'he'), [['HE', 'SAYS,', '"YOU'], ['LOOK', K('GREAT."')]]],
    [V('fast', 'without'), [[K('WITHOUT'), 'LOOKING'], ['UP.']]],
    [V('look', 'you'), [['"YOU', "DIDN'T", 'EVEN'], [K('LOOK."')]]],
    [V('looks', 'so'), [['SO', 'HE', K('LOOKS.')]]],
    [V('looks', 'really'), [[K('REALLY'), 'LOOKS.']]],
    [V('looks', 'beautiful'), [[K('"BEAUTIFUL."')]]],
    [V('trap', 'now'), [['"NOW', "YOU'RE", 'JUST'], [K('SAYING'), 'THAT."']]],
    [V('trap', "there's"), [["THERE'S", 'NO'], [K('WINNING.')]]],
    [V('twist', 'so'), [['SO', 'HE', 'PUTS', 'ON'], ['HIS', K('NEW'), 'SHIRT.']]],
    [V('twist', 'do'), [['"DO', 'I', 'LOOK'], [K('OKAY?"')]]],
    [V('her', 'she'), [['SHE', 'SAYS,', '"YOU'], ['LOOK', K('GREAT."')]]],
    [V('her', 'eyes'), [['EYES', 'ON', 'HER'], [K('PHONE.')]]],
    [V('close', 'he'), [['HE', K('SMILES.')]]],
    [V('close', 'you'), [['"YOU', "DIDN'T", 'EVEN'], [K('LOOK."')]]],
  ];
  const caps = makeCaps(CAPS);

  const OUTFIT = [92, 172, 120], NEWSHIRT = [70, 120, 220];
  const POSE_SHOW = [[0.6, 0.9, 0.6], [0.6, 0.9, 0.6]];
  const herOn = (S, o = {}) => SHE(S, { shirt: OUTFIT, ...o });

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: new outfit, he is on his phone
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      const bd = HE(S, { arms: POSE.phone, head: { yaw: 0.1, pitch: -0.3 }, face: { look: [0, -0.6], mouth: 'flat' } });
      phone(S, add(midHands(bd), [0, 0.05, 0.02]), 0.2, 1.1);
      herOn(S, { arms: POSE_SHOW, head: { yaw: -0.35, tilt: 0.12 }, face: { look: [-0.5, 0], mouth: 'smile', brows: 0.3 } });
      S.render(ctx, W, H_, { dof: 0.3 });
      FX.qmark(ctx, W / 2, 470, 0.9 * popU(t, V('hook', 'question'), 0.3), '?', 0);
    } else if (name === 'ask') { // her: hopeful, showing the outfit
      const S = room(W, H_, t, a, b, [[0.66, 1.55, 1.55], [0.62, 1.4, -0.42], [0.65, 1.56, 1.3], [0.62, 1.43, -0.42]]);
      HE(S, { arms: POSE.phone, head: { yaw: 0.1, pitch: -0.3 } });
      const g = herOn(S, { arms: POSE_SHOW, head: { yaw: -0.3, tilt: 0.12 }, face: { look: [-0.5, 0], mouth: 'smile', brows: 0.35, blush: 0.4 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const r = H.rng(3); for (let i = 0; i < 4; i++) FX.sparkle(ctx, i % 2 ? r.range(560, 660) : r.range(60, 160), r.range(450, 950), 24 * popU(t, V('ask', 'okay') + i * 0.08, 0.3), t * 2 + i);
    } else if (name === 'fast') { // two-shot: eyes glued to the phone
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, { arms: POSE.phone, head: { yaw: 0.1, pitch: -0.3 }, face: { look: [0, -0.6], mouth: 'smile' } });
      phone(S, add(midHands(bd), [0, 0.05, 0.02]), 0.2, 1.1);
      herOn(S, { arms: POSE.clasp, head: { yaw: -0.4 }, face: { look: [-0.6, 0], mouth: 'smile', brows: 0.3 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      bubble(ctx, W / 2 - 20, 650, 'You look great.', -1, popU(t, V('fast', 'great'), 0.3), 34);
      const pp = S.proj(add(midHands(bd), [0, 0.1, 0])); FX.ring(ctx, pp[0], pp[1], 70, '#ec3a32', H.clamp((t - V('fast', 'without')) / 0.45), null);
    } else if (name === 'look') { // her: not impressed
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: POSE.phone, head: { yaw: 0.1, pitch: -0.3 } });
      herOn(S, { arms: POSE.clasp, head: { yaw: -0.3, tilt: -0.06 }, face: { look: [-0.6, 0], lids: 0.45, mouth: 'flat', brows: -0.5 } });
      S.render(ctx, W, H_, { dof: 0.22 });
    } else if (name === 'looks') { // him: phone down, really looking
      const S = room(W, H_, t, a, b, 'him');
      const bt = t >= V('looks', 'beautiful'), rl = t >= V('looks', 'really');
      const bd = HE(S, { arms: POSE.clasp, head: { yaw: 0.45, tilt: bt ? 0.12 : 0 }, face: { eyes: rl ? 'wide' : 'open', look: [0.7, 0], mouth: bt ? 'smile' : 'flat', brows: rl ? 0.35 : 0, blush: bt ? 0.8 : 0 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      if (rl) { const hp = S.proj(bd.head); FX.dots(ctx, [[hp[0] + 110, hp[1] - 10], [hp[0] + 220, hp[1] - 20], [W + 20, hp[1] - 30]], ramp(t, V('looks', 'really'), 0.4)); }
      if (bt) { for (let i = 0; i < 3; i++) { const u = t - V('looks', 'beautiful') - i * 0.25; if (u > 0) FX.heart(ctx, 560 + i * 40 + Math.sin(u * 3 + i) * 20, 900 - u * 100, 50 * popU(t, V('looks', 'beautiful') + i * 0.25, 0.4)); } }
    } else if (name === 'trap') { // two-shot: the trap closes
      const S = room(W, H_, t, a, b, 'two');
      const nw = t >= V('trap', "there's");
      const bd = HE(S, { arms: nw ? POSE.shrug : POSE.clasp, head: { yaw: 0.45 }, face: { eyes: nw ? 'wide' : 'open', look: [0.6, 0], mouth: nw ? 'o' : 'smile', brows: 0.5, blush: 0.4 } });
      herOn(S, { arms: POSE.clasp, head: { yaw: -0.45, tilt: 0.1 }, face: { look: [-0.6, 0], lids: 0.5, mouth: 'flat', brows: -0.4 } });
      S.render(ctx, W, H_, { dof: 0.25 });
      if (nw) { const hp = S.proj(bd.head); FX.sweat(ctx, hp[0] - 110, hp[1] - 130, 1.5 * popU(t, V('trap', 'winning'), 0.3)); FX.ring(ctx, W / 2, 900, 80, '#ec3a32', H.clamp((t - V('trap', 'winning')) / 0.45), 'x'); }
    } else if (name === 'twist') { // him: new shirt, his turn to ask
      const S = room(W, H_, t, a, b, [[-0.6, 1.55, 1.55], [-0.62, 1.4, -0.42], [-0.6, 1.56, 1.3], [-0.62, 1.43, -0.42]]);
      const nw = t >= V('twist', 'puts') + 0.3, dq = t >= V('twist', 'do');
      const bd = HE(S, { shirt: nw ? NEWSHIRT : P.mustard, arms: dq ? POSE_SHOW : POSE.clasp, head: { yaw: dq ? 0.35 : 0.1, tilt: dq ? -0.12 : 0 }, face: { look: [dq ? 0.5 : 0, 0], mouth: 'smile', brows: dq ? 0.35 : 0, lids: dq ? 0.2 : 0 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      flash = 0.3 * Math.exp(-Math.pow((t - (V('twist', 'puts') + 0.3)) * 7, 2));
      if (nw) { const r = H.rng(5); for (let i = 0; i < 4; i++) FX.sparkle(ctx, i % 2 ? r.range(560, 660) : r.range(60, 160), r.range(450, 950), 24 * popU(t, V('twist', 'shirt') + i * 0.08, 0.3), t * 2 + i); }
    } else if (name === 'her') { // two-shot: now she is on her phone
      const S = room(W, H_, t, a, b, 'two');
      HE(S, { shirt: NEWSHIRT, arms: POSE_SHOW, head: { yaw: 0.4, tilt: -0.1 }, face: { look: [0.6, 0], mouth: 'smile', brows: 0.35 } });
      const g = herOn(S, { arms: POSE.phone, head: { yaw: -0.1, pitch: -0.3 }, face: { look: [0, -0.6], mouth: 'smile' } });
      phone(S, add(midHands(g), [0, 0.05, 0.02]), -0.2, 1.1);
      S.render(ctx, W, H_, { dof: 0.28 });
      bubble(ctx, W / 2 + 20, 650, 'You look great.', 1, popU(t, V('her', 'great'), 0.3), 34);
      const pp = S.proj(add(midHands(g), [0, 0.1, 0])); FX.ring(ctx, pp[0], pp[1], 70, '#ec3a32', H.clamp((t - V('her', 'phone')) / 0.45), null);
    } else { // the closer: him, smug, payback complete
      const S = room(W, H_, t, a, b, [[-0.66, 1.6, 1.15], [-0.62, 1.56, -0.42], [-0.64, 1.6, 0.92], [-0.62, 1.57, -0.42]]);
      const bd = HE(S, { shirt: NEWSHIRT, arms: POSE.clasp, head: { yaw: 0.1, tilt: -0.12 }, face: { look: [0, 0], lids: 0.5, mouth: 'smile', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.head); smug(ctx, hp[0] - 190, hp[1] - 150, t, popU(t, V('close', 'smiles'), 0.3));
      flash = 0.15 * Math.exp(-Math.pow((t - V('close', 'look')) * 7, 2));
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    k.tone(V('hook', 'dangerous'), { f: [[0, 196], [0.6, 185]], type: 'sawtooth', dur: 0.7, gain: 0.07, filter: 'lowpass', f2: 600 });
    k.play('sparkle', V('ask', 'okay'), { gain: 0.45 });
    k.play('blip', V('fast', 'great'), { f: 700, gain: 0.3 }); nopeSound(k, V('fast', 'without'));
    k.play('stamp', V('look', 'look'), { gain: 0.45 });
    k.play('whoosh', V('looks', 'looks'), { dur: 0.25, gain: 0.4 }); k.play('ding', V('looks', 'beautiful'), { f: 'E6', gain: 0.35 }); heartSound(k, V('looks', 'beautiful'), 3);
    k.play('jump', V('trap', "there's"), { gain: 0.4 }); nopeSound(k, V('trap', 'winning'));
    k.play('swish', V('twist', 'puts') + 0.25, { gain: 0.5 }); k.play('sparkle', V('twist', 'shirt'), { gain: 0.45 });
    k.play('blip', V('her', 'great'), { f: 700, gain: 0.3 });
    twistSound(k, V('close', 'you'));
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
