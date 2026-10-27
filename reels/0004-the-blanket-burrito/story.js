  // ==================== 0004 "The blanket burrito." : a sarcastic couple reel ====================
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
    ['hook', 0], ['one', V('one', 'one') - 0.15], ['roll', V('roll', 'he') - 0.15], ['corner', V('corner', 'not') - 0.15], ['ask', V('ask', 'comfy') - 0.15],
    ['leave', V('leave', 'so') - 0.15], ['back', V('leave', 'and') - 0.15], ['two', V('two', 'two') - 0.15], ['open', V('open', 'suddenly') - 0.15],
    ['close', V('close', 'funny') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'tell'), [['TELL', 'ME', 'THIS', "ISN'T"], ['YOUR', K('COUCH.')]]],
    [V('hook', 'every'), [['EVERY', K('SINGLE')], ['NIGHT.']]],
    [V('one', 'one'), [['ONE', K('BLANKET.')]]],
    [V('one', 'two'), [[K('TWO'), 'PEOPLE.']]],
    [V('roll', 'he'), [['HE', 'ROLLS', 'HIMSELF', 'UP'], ['LIKE', 'A', K('BURRITO.')]]],
    [V('roll', 'head'), [[K('HEAD'), 'TO', K('TOE.')]]],
    [V('corner', 'not'), [['NOT', 'ONE', K('CORNER')], ['LEFT', 'FOR', 'HER.']]],
    [V('ask', 'comfy'), [[K('"COMFY?"')]]],
    [V('ask', 'very'), [[K('"VERY."')]]],
    [V('leave', 'so'), [['SO', 'SHE', K('GETS'), K('UP,')]]],
    [V('leave', 'without'), [['WITHOUT', 'A', K('WORD,')]]],
    [V('leave', 'and'), [['AND', 'COMES', 'BACK', 'WITH'], [K('HOT'), K('CHOCOLATE.')]]],
    [V('two', 'two'), [[K('TWO'), 'MUGS.']]],
    [V('two', 'with'), [['WITH'], [K('MARSHMALLOWS.')]]],
    [V('open', 'suddenly'), [['SUDDENLY', 'THE'], [K('BURRITO'), 'OPENS', 'UP.']]],
    [V('open', 'plenty'), [['PLENTY', 'OF', K('ROOM')], ['FOR', 'TWO.']]],
    [V('close', 'funny'), [[K('FUNNY'), 'HOW', 'THAT'], ['WORKS.']]],
  ];
  const caps = makeCaps(CAPS);

  const BL = [86, 170, 160]; // the blanket
  // the blanket over both laps, or rolled around him (a burrito with a hood)
  const plaid = (c, w, h) => { c.fillStyle = rgb(BL); c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,240,220,0.22)'; for (let x = 0; x < w; x += 60) c.fillRect(x, 0, 16, h); for (let y = 0; y < h; y += 60) c.fillRect(0, y, w, 16); c.fillStyle = 'rgba(40,60,70,0.18)'; for (let x = 30; x < w; x += 60) c.fillRect(x, 0, 6, h); };
  const lapBlanket = (S, x0 = -0.95, x1 = 0.95) => { const cx = (x0 + x1) / 2, hw = (x1 - x0) / 2; S.rbox((p) => add(p, [cx, 0.7, -0.17]), hw, 0.035, 0.27, BL, { bevel: 0.9, bias: -0.45, topPaint: plaid }); S.rbox((p) => add(rotX(p, -0.12), [cx, 0.5, 0.11]), hw, 0.2, 0.03, BL, { bevel: 0.9, bias: -0.46, paint: plaid }); };
  const burrito = (S, d) => {
    S.ball([-0.62, 0.85, -0.36], [0.42, 0.4, 0.34], BL, { bias: -0.5, gloss: 0.2 });
    S.ball([-0.62, 0.62, -0.08], [0.36, 0.2, 0.38], shade(BL, 0.95), { bias: -0.52, rim: false });
    S.ball(add(d.head, [0, 0.03, -0.06]), [0.36, 0.39, 0.32], shade(BL, 1.05), { bias: 0.12, gloss: 0.2 }); // the hood, behind the head
  };
  const mug = (S, c, col) => { S.cyl((p) => add(p, c), 0.06, 0.13, col, 14, { bias: -0.6, cap: [90, 50, 30] }); S.limb(add(c, [0.07, 0.03, 0]), add(c, [0.07, 0.1, 0]), 0.018, 0.018, col, { bias: -0.6 }); };
  const steam = (ctx, x, y, t, u) => { if (u <= 0) return; ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${0.7 * u})`; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let k = 0; k <= 12; k++) { const yy = y - k * 9, xx = x + (i - 1) * 22 + Math.sin(k * 0.6 + t * 4 + i) * 7; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); } ctx.restore(); };
  const holdMugs = (S, g) => { mug(S, add(g.hands[0].p, [0.0, 0.02, 0.05]), [236, 120, 150]); mug(S, add(g.hands[1].p, [0.0, 0.02, 0.05]), [255, 208, 64]); };
  const MUGARMS = [[1.0, 0.25, 1.0], [1.0, 0.25, 1.0]];

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: one blanket over both laps (for now)
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      HE(S, { arms: POSE.clasp, head: { yaw: 0.3 }, face: { look: [0.4, 0], mouth: 'smile' } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.3 }, face: { look: [-0.4, 0], mouth: 'smile' } });
      lapBlanket(S);
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'one') { // two-shot: the blanket gets a ring
      const S = room(W, H_, t, a, b, 'two');
      HE(S, { arms: POSE.clasp, head: { yaw: 0.35 }, face: { look: [0.5, 0], lids: 0.3, mouth: 'smile', brows: -0.2 } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.35 }, face: { look: [-0.5, 0], lids: 0.3, mouth: 'smile', brows: -0.2 } });
      lapBlanket(S);
      S.render(ctx, W, H_, { dof: 0.28 });
      const bp = S.proj([0, 0.8, 0.1]); FX.ring(ctx, bp[0], bp[1], 120, '#ffd23f', H.clamp((t - V('one', 'blanket')) / 0.45), null);
    } else if (name === 'roll') { // him: snap, a burrito
      const S = room(W, H_, t, a, b, [[-0.6, 1.55, 1.75], [-0.55, 1.3, -0.42], [-0.6, 1.58, 1.45], [-0.58, 1.35, -0.42]]);
      const rl = t >= V('roll', 'burrito');
      const d = HE(S, { arms: POSE.clasp, head: { yaw: rl ? 0.05 : 0.3, tilt: rl ? -0.1 : 0 }, face: { eyes: rl ? 'happy' : 'open', look: [0.4, 0], mouth: 'smile', blush: rl ? 0.5 : 0 } });
      SHE(S, { arms: rl ? POSE.hug : POSE.clasp, head: { yaw: -0.4 }, face: { eyes: rl ? 'wide' : 'open', look: [-0.6, 0], mouth: rl ? 'o' : 'smile' } });
      if (rl) burrito(S, d); else lapBlanket(S);
      S.render(ctx, W, H_, { dof: 0.25 });
      FX.speed(ctx, W, H_, W * 0.45, H_ * 0.5, H.clamp(1 - (t - V('roll', 'burrito')) / 0.6) * (rl ? 1 : 0), t);
      flash = 0.25 * Math.exp(-Math.pow((t - V('roll', 'burrito')) * 7, 2));
      if (t > V('roll', 'head')) { const hp = S.proj(d.head); const lp = S.proj([-0.62, 0.35, 0.05]); FX.dots(ctx, [[hp[0] + 150, hp[1] - 100], [hp[0] + 190, hp[1] + 120], [lp[0] + 170, lp[1]]], ramp(t, V('roll', 'head'), 0.6)); }
    } else if (name === 'corner') { // her: on the cold edge
      const S = room(W, H_, t, a, b, 'her');
      const d = HE(S, { arms: POSE.clasp, head: { yaw: 0.1, tilt: -0.1 }, face: { eyes: 'happy', mouth: 'smile' } }); burrito(S, d);
      const g = SHE(S, { lean: 0.05, arms: POSE.hug, head: { yaw: -0.35 + wave(t, 40, 0.035), tilt: 0.05 }, face: { eyes: 'open', look: [-0.6, 0], lids: 0.3, mouth: 'frown', brows: 0.45 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); FX.sweat(ctx, hp[0] + 160, hp[1] - 140, 1.7 * popU(t, V('corner', 'corner'), 0.3));
      FX.buzz(ctx, hp[0] + 250, hp[1] + 60, 1.3, 1);
    } else if (name === 'ask') { // two-shot: "Comfy?" "Very."
      const S = room(W, H_, t, a, b, 'two');
      const v = t >= V('ask', 'very');
      const d = HE(S, { arms: POSE.clasp, head: { yaw: 0.05, tilt: v ? -0.15 : -0.05 }, face: { eyes: v ? 'happy' : 'closed', mouth: 'smile', blush: 0.5 } }); burrito(S, d);
      SHE(S, { arms: POSE.hug, head: { yaw: -0.45, tilt: 0.1 }, face: { look: [-0.6, 0], lids: 0.5, mouth: 'flat', brows: -0.45 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      bubble(ctx, 520, 430, 'Comfy?', 1, popU(t, V('ask', 'comfy'), 0.3), 40);
      bubble(ctx, 200, 520, 'Very.', -1, popU(t, V('ask', 'very'), 0.3), 40);
    } else if (name === 'leave') { // two-shot: her seat is empty, he does not even notice
      const S = room(W, H_, t, a, b, 'two');
      const d = HE(S, { arms: POSE.clasp, head: { yaw: 0.05, tilt: -0.12 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.5 } }); burrito(S, d);
      S.render(ctx, W, H_, { dof: 0.28 });
      const sp = S.proj([0.62, 1.2, -0.3]); FX.dots(ctx, [[sp[0], sp[1]], [sp[0] + 80, sp[1] - 160], [W + 40, sp[1] - 120]], ramp(t, a + 0.1, 0.5));
      zzz(ctx, S.proj(d.head)[0] + 120, S.proj(d.head)[1] - 120, t, 1);
    } else if (name === 'back') { // her: back with two steaming mugs
      const S = room(W, H_, t, a, b, [[0.66, 1.55, 1.45], [0.6, 1.35, -0.42], [0.66, 1.56, 1.2], [0.6, 1.38, -0.42]]);
      const d = HE(S, { arms: POSE.clasp, head: { yaw: 0.05 }, face: { eyes: 'happy', mouth: 'smile' } }); burrito(S, d);
      const g = SHE(S, { arms: MUGARMS, head: { yaw: -0.1, tilt: 0.1 }, face: { look: [-0.3, 0], lids: 0.3, mouth: 'smile', brows: -0.2 } });
      holdMugs(S, g);
      S.render(ctx, W, H_, { dof: 0.22 });
      [0, 1].forEach((i) => { const p = S.proj(add(g.hands[i].p, [0, 0.18, 0.05])); steam(ctx, p[0], p[1], t, ramp(t, V('leave', 'hot'), 0.4)); });
      const r = H.rng(8); for (let i = 0; i < 4; i++) FX.sparkle(ctx, r.range(120, 600), r.range(400, 950), 24 * popU(t, V('leave', 'chocolate') + i * 0.1, 0.3), t * 2 + i);
    } else if (name === 'two') { // him: eyes on the mugs
      const S = room(W, H_, t, a, b, 'him');
      const d = HE(S, { arms: POSE.clasp, head: { yaw: 0.45 }, face: { eyes: 'wide', look: [0.7, -0.1], mouth: 'o', brows: 0.4 } }); burrito(S, d);
      S.render(ctx, W, H_, { dof: 0.22 });
      const u = popU(t, V('two', 'two'), 0.3); if (u > 0) { ctx.save(); ctx.translate(140, 940); ctx.scale(u * 0.8, u * 0.8); ctx.fillStyle = '#fff8ec'; ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.fill(); ctx.shadowColor = 'transparent'; [[-30, '#ec7896'], [32, '#ffd040']].forEach(([x, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - 24, -26, 48, 58, 8); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x + 26, 4, 12, -1.2, 1.2); ctx.stroke(); }); ctx.restore(); steam(ctx, 140, 905, t, u); }
      const hp = S.proj(d.head); FX.sweat(ctx, hp[0] - 160, hp[1] - 130, 1.3 * popU(t, V('two', 'mugs'), 0.3));
    } else if (name === 'open') { // wide: the burrito unrolls, one blanket for two again
      const S = room(W, H_, t, a, b, [[0.15, 1.55, 3.1], [0, 1.15, -0.4], [0.08, 1.55, 2.7], [0, 1.2, -0.4]]);
      const op = t >= V('open', 'opens');
      const d = HE(S, { arms: op ? [[0.35, 0.18, 0.7], PT] : POSE.clasp, head: { yaw: 0.4, tilt: op ? 0.12 : 0 }, face: { eyes: op ? 'open' : 'wide', look: [0.6, 0], mouth: 'smile', brows: 0.3, blush: op ? 0.6 : 0 } });
      const g = SHE(S, { arms: MUGARMS, head: { yaw: -0.35 }, face: { look: [-0.6, 0], lids: 0.3, mouth: 'smile' } });
      holdMugs(S, g);
      if (op) lapBlanket(S); else burrito(S, d);
      S.render(ctx, W, H_, { dof: 0.28 });
      flash = 0.2 * Math.exp(-Math.pow((t - V('open', 'opens')) * 7, 2));
      if (op) { const bp = S.proj([0, 0.8, 0.1]); FX.ring(ctx, bp[0], bp[1], 140, '#58b84a', H.clamp((t - V('open', 'room')) / 0.45), 'tick'); }
    } else { // the closer: her, smug, sipping; he snuggles in
      const S = room(W, H_, t, a, b, [[0.45, 1.58, 1.9], [0.38, 1.42, -0.42], [0.45, 1.6, 1.6], [0.4, 1.45, -0.42]]);
      HE(S, { lean: 0.05, arms: POSE.clasp, head: { yaw: 0.45, tilt: 0.2 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.7 } });
      const g = SHE(S, { arms: [[0.4, 0.1, 0.9], [1.1, 0.0, 1.6]], head: { yaw: -0.05, tilt: -0.1 }, face: { look: [0, 0], lids: 0.5, mouth: 'smile', brows: -0.3 } });
      mug(S, add(g.hands[1].p, [0, 0.02, 0.05]), [255, 208, 64]);
      lapBlanket(S);
      S.render(ctx, W, H_, { dof: 0.25 });
      const hp = S.proj(g.head); smug(ctx, hp[0] + 150, hp[1] - 150, t, popU(t, V('close', 'funny'), 0.3));
      hearts(ctx, W, t, V('close', 'works') + 0.2, 4, 620);
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    k.play('ding', V('one', 'blanket'), { f: 'E5', gain: 0.35 });
    k.play('swish', V('roll', 'burrito') - 0.1, { gain: 0.6 }); k.play('slap', V('roll', 'burrito') + 0.05, { gain: 0.4 }); k.play('pop', V('roll', 'toe'), { f: 600, gain: 0.5 });
    k.tone(V('corner', 'corner'), { f: [[0, 520], [0.1, 470], [0.2, 520], [0.3, 470], [0.4, 520]], type: 'triangle', dur: 0.5, gain: 0.1 });
    k.play('select', V('ask', 'comfy'), { gain: 0.4 }); k.play('blip', V('ask', 'very'), { f: 500, gain: 0.35 });
    k.play('whoosh', V('leave', 'gets'), { dur: 0.35, gain: 0.45 });
    k.play('sparkle', V('leave', 'chocolate'), { gain: 0.5 }); k.play('ding', V('leave', 'chocolate') + 0.1, { f: 'G5', gain: 0.35 });
    k.play('jump', V('two', 'mugs'), { gain: 0.45 });
    twistSound(k, V('open', 'opens'));
    k.play('sparkle', V('close', 'funny'), { gain: 0.5 }); heartSound(k, V('close', 'works') + 0.2, 4);
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
