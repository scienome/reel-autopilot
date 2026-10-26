  // ==================== 0007 "The last piece." : a sarcastic couple reel ====================
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
    ['hook', 0], ['cake', V('cake', 'one') - 0.15], ['you', V('you', 'you') - 0.15], ['insist', V('insist', 'i') - 0.15], ['stare', V('stare', 'ten') - 0.15],
    ['give', V('give', 'finally') - 0.15], ['gone', V('gone', 'he') - 0.15], ['chew', V('chew', "she's") - 0.15], ['what', V('what', 'what') - 0.15],
    ['close', V('close', 'dessert') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'every'), [['EVERY', 'COUPLE', 'HAS'], ['THIS', K('STANDOFF.')]]],
    [V('cake', 'one'), [['ONE', 'PIECE', 'OF'], [K('CAKE'), 'LEFT.']]],
    [V('you', 'you'), [['"YOU', K('HAVE'), 'IT."']]],
    [V('you', 'no'), [['"NO,', K('YOU'), 'HAVE', 'IT."']]],
    [V('insist', 'i'), [['"I', K('INSIST."')]]],
    [V('insist', 'no'), [['"NO,', K('I'), 'INSIST."']]],
    [V('stare', 'ten'), [['TEN', 'MINUTES', 'OF'], ['VERY', K('POLITE')], ['STARING.']]],
    [V('stare', 'neither'), [['NEITHER', 'ONE'], [K('BLINKS.')]]],
    [V('give', 'finally'), [['FINALLY', 'HE'], [K('GIVES'), 'IN.']]],
    [V('give', 'okay'), [['"OKAY,', "I'LL"], [K('HAVE'), 'IT."']]],
    [V('gone', 'he'), [['HE', 'LOOKS', K('DOWN.')]]],
    [V('gone', 'the'), [['THE', 'PLATE', 'IS'], [K('EMPTY.')]]],
    [V('chew', "she's"), [["SHE'S", K('CHEWING.')]]],
    [V('chew', 'slowly'), [[K('SLOWLY.')]]],
    [V('chew', 'making'), [['MAKING', K('EYE')], [K('CONTACT.')]]],
    [V('what', 'what'), [['"WHAT?']]],
    [V('what', 'you'), [['YOU', K('HESITATED."')]]],
    [V('close', 'dessert'), [[K('DESSERT'), 'WAITS'], ['FOR', 'NO', 'ONE.']]],
  ];
  const caps = makeCaps(CAPS);

  const PC = [0, 0.4, 1.12]; // the plate on the coffee table
  const frosting = (c, w, h) => { c.fillStyle = '#f6a6bc'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(w * (0.1 + i * 0.16), h * 0.5, w * 0.04, 0, Math.PI * 2); c.fill(); } };
  const layers = (c, w, h) => { c.fillStyle = '#f2d6a0'; c.fillRect(0, 0, w, h); c.fillStyle = '#7a3a2a'; c.fillRect(0, h * 0.42, w, h * 0.16); c.fillStyle = '#f6a6bc'; c.fillRect(0, 0, w, h * 0.18); };
  const cakeSet = (S, full = true) => {
    S.cyl((p) => add(p, PC), 0.17, 0.015, P.white, 20, { bias: -0.2, cap: [250, 248, 244] });
    if (full) {
      S.rbox((p) => add(rotY(p, 0.5), add(PC, [0, 0.065, 0])), 0.07, 0.05, 0.1, [242, 214, 160], { bevel: 0.2, bias: -0.25, topPaint: frosting, paint: layers });
      S.ball(add(PC, [0.0, 0.135, 0.0]), 0.025, [210, 30, 50], { bias: -0.3, gloss: 0.4 });
    } else { const r = H.rng(2); for (let i = 0; i < 6; i++) S.ball(add(PC, [r.range(-0.08, 0.08), 0.02, r.range(-0.08, 0.08)]), 0.008, [200, 160, 110], { bias: -0.25, rim: false }); }
  };
  const bolt = (ctx, x0, y0, x1, y1, t, u) => { if (u <= 0) return; const r = H.rng(Math.floor(t * 20)); ctx.save(); ctx.strokeStyle = `rgba(255,236,120,${u})`; ctx.shadowColor = 'rgba(255,220,80,0.9)'; ctx.shadowBlur = 16; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); for (let i = 1; i < 8; i++) { const k = i / 8; ctx.lineTo(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + r.range(-22, 22)); } ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); };
  const POLITE = (side, on) => ({ arms: on ? (side < 0 ? [[0.35, 0.18, 0.7], PT] : [PT, [0.35, 0.18, 0.7]]) : POSE.clasp });

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: both eye the last piece
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      HE(S, { arms: POSE.clasp, head: { yaw: 0.3, pitch: -0.25 }, face: { look: [0.3, -0.6], mouth: 'flat' } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.3, pitch: -0.25 }, face: { look: [-0.3, -0.6], mouth: 'flat' } });
      cakeSet(S);
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'cake') { // low on the table: the cake, glowing
      const S = room(W, H_, t, a, b, [[0.0, 0.85, 2.05], [0, 0.48, 1.1], [0.0, 0.8, 1.85], [0, 0.48, 1.1]], { table: true });
      HE(S, { head: { pitch: -0.3 }, face: { look: [0.3, -0.6] } }); SHE(S, { head: { pitch: -0.3 }, face: { look: [-0.3, -0.6] } });
      cakeSet(S);
      S.render(ctx, W, H_, { dof: 0.35, focus: 1.0, dofGap: 0.5 });
      const cp = S.proj(add(PC, [0, 0.08, 0])); FX.ring(ctx, cp[0], cp[1], 150, '#ffd23f', H.clamp((t - V('cake', 'cake')) / 0.45), null);
      const r = H.rng(4); for (let i = 0; i < 5; i++) FX.sparkle(ctx, cp[0] + r.range(-200, 200), cp[1] + r.range(-200, 80), 26 * popU(t, V('cake', 'cake') + i * 0.08, 0.3), t * 2 + i);
    } else if (name === 'you') { // two-shot: the polite pointing
      const S = room(W, H_, t, a, b, 'two');
      const her = t >= V('you', 'no');
      HE(S, { ...POLITE(-1, !her), head: { yaw: 0.4, tilt: 0.1 }, face: { look: [0.6, 0], mouth: 'smile', brows: 0.3 } });
      SHE(S, { ...POLITE(1, her), head: { yaw: -0.4, tilt: -0.1 }, face: { look: [-0.6, 0], mouth: 'smile', brows: 0.3 } });
      S.render(ctx, W, H_, { dof: 0.28 });
    } else if (name === 'insist') { // tighter: bubbles bounce back and forth
      const S = room(W, H_, t, a, b, [[0, 1.6, 2.2], [0, 1.45, -0.4], [0, 1.6, 1.95], [0, 1.47, -0.4]]);
      const her = t >= V('insist', 'no');
      HE(S, { arms: POSE.clasp, head: { yaw: 0.45, tilt: her ? 0 : 0.15 }, face: { eyes: her ? 'open' : 'happy', look: [0.6, 0], mouth: 'smile', brows: 0.3 } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.45, tilt: her ? -0.15 : 0 }, face: { eyes: her ? 'happy' : 'open', look: [-0.6, 0], mouth: 'smile', brows: 0.3 } });
      S.render(ctx, W, H_, { dof: 0.25 });
      bubble(ctx, 220, 420, 'I insist.', -1, popU(t, V('insist', 'i'), 0.3), 38);
      bubble(ctx, 490, 470, 'No, I insist.', 1, popU(t, V('insist', 'no'), 0.3), 38);
    } else if (name === 'stare') { // tight two-shot: polite smiles, lightning between the eyes
      const S = room(W, H_, t, a, b, [[0, 1.62, 2.0], [0, 1.52, -0.4], [0, 1.62, 1.75], [0, 1.53, -0.4]]);
      const bd = HE(S, { arms: POSE.clasp, head: { yaw: 0.5, pitch: 0.02 }, face: { look: [0.7, 0], lids: 0.3, mouth: 'smile', brows: -0.35 } });
      const g = SHE(S, { arms: POSE.clasp, head: { yaw: -0.5, pitch: 0.02 }, face: { look: [-0.7, 0], lids: 0.3, mouth: 'smile', brows: -0.35 } });
      S.render(ctx, W, H_, { dof: 0.25 });
      const p0 = S.proj(add(bd.head, [0.2, 0.03, 0])), p1 = S.proj(add(g.head, [-0.2, 0.03, 0])); bolt(ctx, p0[0], p0[1], p1[0], p1[1], t, ramp(t, V('stare', 'staring'), 0.2));
      FX.sweat(ctx, S.proj(bd.head)[0] - 110, S.proj(bd.head)[1] - 140, 1.3 * popU(t, V('stare', 'blinks'), 0.3));
    } else if (name === 'give') { // him: fine, he'll have it
      const S = room(W, H_, t, a, b, 'him');
      const ok = t >= V('give', 'okay');
      HE(S, { arms: ok ? POSE.shrug : POSE.clasp, head: { yaw: 0.35, tilt: ok ? -0.12 : 0.05 }, face: { eyes: ok ? 'happy' : 'closed', look: [0.5, 0], mouth: 'smile', brows: ok ? 0.2 : 0.3 } });
      SHE(S, { head: { yaw: -0.4 } });
      S.render(ctx, W, H_, { dof: 0.22 });
    } else if (name === 'gone') { // the plate: empty
      const S = room(W, H_, t, a, b, [[0.0, 0.85, 2.05], [0, 0.48, 1.1], [0.0, 0.8, 1.85], [0, 0.48, 1.1]], { table: true });
      HE(S, { head: { pitch: -0.3 }, face: { look: [0.3, -0.6] } }); SHE(S, { head: { pitch: -0.2 }, face: { look: [-0.3, -0.6] } });
      cakeSet(S, false);
      S.render(ctx, W, H_, { dof: 0.35, focus: 1.0, dofGap: 0.5 });
      const cp = S.proj(add(PC, [0, 0.05, 0])); FX.ring(ctx, cp[0], cp[1], 140, '#ec3a32', H.clamp((t - V('gone', 'empty')) / 0.45), 'x');
      flash = 0.18 * Math.exp(-Math.pow((t - V('gone', 'empty')) * 7, 2));
    } else if (name === 'chew') { // her: chewing, slowly, eye contact
      const S = room(W, H_, t, a, b, [[0.66, 1.6, 1.0], [0.62, 1.56, -0.42], [0.64, 1.6, 0.8], [0.62, 1.57, -0.42]]);
      HE(S, { head: { yaw: 0.5 }, face: { eyes: 'wide', mouth: 'o' } });
      const ch = Math.sin(t * (t > V('chew', 'slowly') ? 5 : 9)) > 0;
      const g = SHE(S, { arms: POSE.clasp, head: { yaw: -0.05, tilt: Math.sin(t * 4.5) * 0.03 }, face: { look: [0, 0], lids: 0.45, mouth: ch ? 'flat' : 'smile', brows: -0.2, blush: 0.4 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); const r = H.rng(6); ctx.fillStyle = '#e8c48a'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(hp[0] + r.range(-40, 40), hp[1] + 140 + r.range(0, 30), 6, 0, Math.PI * 2); ctx.fill(); }
      if (t > V('chew', 'eye')) { [-1, 1].forEach((sd) => FX.sparkle(ctx, hp[0] + sd * 95, hp[1] - 10, 22 * popU(t, V('chew', 'eye'), 0.3), t * 3)); }
    } else if (name === 'what') { // her: innocent shrug
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { head: { yaw: 0.5 }, face: { eyes: 'wide', mouth: 'o' } });
      const g = SHE(S, { arms: POSE.shrug, head: { yaw: -0.15, tilt: 0.15 }, face: { look: [-0.4, 0], lids: 0.3, mouth: 'smile', brows: 0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); smug(ctx, hp[0] + 170, hp[1] - 150, t, popU(t, V('what', 'hesitated'), 0.3));
    } else { // the closer: he stares at the plate, she is pleased with herself
      const S = room(W, H_, t, a, b, [[0.05, 1.5, 2.8], [0, 1.15, -0.4], [0.05, 1.5, 2.45], [0, 1.2, -0.4]], { table: true });
      HE(S, { lean: -0.08, arms: POSE.slump, head: { yaw: 0.25, pitch: -0.3 }, face: { look: [0.3, -0.6], mouth: 'frown', brows: 0.5 } });
      const g = SHE(S, { arms: POSE.clasp, head: { yaw: -0.1, tilt: -0.12 }, face: { look: [0, 0], lids: 0.5, mouth: 'smile', brows: -0.3, blush: 0.3 } });
      cakeSet(S, false);
      S.render(ctx, W, H_, { dof: 0.28 });
      const hp = S.proj(g.head); smug(ctx, hp[0] + 110, hp[1] - 120, t, popU(t, V('close', 'dessert'), 0.3));
      flash = 0.15 * Math.exp(-Math.pow((t - V('close', 'one')) * 7, 2));
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    k.play('sparkle', V('cake', 'cake'), { gain: 0.5 }); k.play('ding', V('cake', 'left'), { f: 'E6', gain: 0.3 });
    k.play('blip', V('you', 'you'), { f: 900, gain: 0.3 }); k.play('blip', V('you', 'no'), { f: 1100, gain: 0.3 });
    k.play('blip', V('insist', 'i'), { f: 900, gain: 0.3 }); k.play('blip', V('insist', 'no'), { f: 1100, gain: 0.3 });
    k.play('neon', V('stare', 'staring'), { gain: 0.35 }); k.tone(V('stare', 'neither'), { f: [[0, 1400], [1.0, 1500]], type: 'sine', dur: 1.1, gain: 0.05 });
    k.play('select', V('give', 'okay'), { gain: 0.4 });
    nopeSound(k, V('gone', 'empty')); k.play('impact', V('gone', 'empty'), { gain: 0.5 });
    for (let i = 0; i < 5; i++) k.play('tock', V('chew', 'chewing') + i * 0.35, { gain: 0.22, minor: true });
    k.play('sparkle', V('chew', 'eye'), { gain: 0.45 });
    twistSound(k, V('what', 'hesitated'));
    k.play('stamp', V('close', 'one'), { gain: 0.45 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
