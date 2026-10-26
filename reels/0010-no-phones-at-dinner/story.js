  // ==================== 0010 "No phones at dinner." : a sarcastic couple reel ====================
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
    ['hook', 0], ['puts', V('puts', 'so') - 0.15], ['she', V('she', 'she') - 0.15], ['photo', V('photo', 'then') - 0.15], ['cold', V('cold', 'twenty') - 0.15],
    ['asks', V('asks', 'he') - 0.15], ['yes', V('yes', 'she') - 0.15], ['twist', V('twist', 'then') - 0.15], ['close', V('close', 'no') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'her'), [['HER', 'RULE:', 'NO'], [K('PHONES'), 'AT', 'DINNER.']]],
    [V('puts', 'so'), [['SO', 'HE', 'PUTS', 'HIS'], ['PHONE', K('AWAY.')]]],
    [V('she', 'she'), [['SHE', K('PICKS'), 'HERS', 'UP.']]],
    [V('she', 'just'), [['"JUST', 'ONE'], [K('PHOTO."')]]],
    [V('photo', 'then'), [['THEN', 'ONE', 'FROM'], ['THE', K('TOP.')]]],
    [V('photo', 'then', 2), [['THEN', 'ONE', 'WITH'], [K('BETTER'), 'LIGHTING.']]],
    [V('cold', 'twenty'), [[K('TWENTY'), 'MINUTES'], ['LATER,']]],
    [V('cold', 'the'), [['THE', 'FOOD', 'IS'], [K('COLD.')]]],
    [V('asks', 'he'), [['"IS', 'IT', 'A', K('GOOD')], ['PHOTO?"']]],
    [V('yes', 'she'), [['SHE', 'SAYS,'], ['"IT\'S', K('PERFECT."')]]],
    [V('twist', 'then'), [['THEN', 'SHE', 'LOOKS'], [K('DOWN.')]]],
    [V('twist', 'her'), [['HER', K('FRIES')], ['ARE', K('GONE.')]]],
    [V('close', 'no'), [['"NO', K('PHONES'), 'AT'], ['DINNER,', 'BABE."']]],
  ];
  const caps = makeCaps(CAPS);

  // dinner on the coffee table: his burger, her burger and fries
  const plateTop = (fries, cold) => (c, w, h) => {
    c.fillStyle = '#f8f6f0'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.48, 0, Math.PI * 2); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.08)'; c.lineWidth = 8; c.beginPath(); c.arc(w / 2, h / 2, w * 0.36, 0, Math.PI * 2); c.stroke();
    c.save(); c.translate(w * (fries === null ? 0.5 : 0.34), h * 0.5); drawFood(c, 'burger', w * 0.2); c.restore();
    if (fries) { c.fillStyle = '#f4c440'; c.strokeStyle = '#c8962a'; c.lineWidth = 2; for (let i = 0; i < 12; i++) { c.save(); c.translate(w * (0.62 + (i % 4) * 0.055), h * (0.38 + Math.floor(i / 4) * 0.1)); c.rotate(-0.6 + i * 0.13); c.fillRect(-w * 0.018, -h * 0.09, w * 0.036, h * 0.18); c.strokeRect(-w * 0.018, -h * 0.09, w * 0.036, h * 0.18); c.restore(); } }
    else if (fries === false) { c.fillStyle = 'rgba(220,180,90,0.7)'; [[0.66, 0.45], [0.72, 0.52], [0.7, 0.4]].forEach(([x, y]) => { c.beginPath(); c.arc(w * x, h * y, w * 0.008, 0, Math.PI * 2); c.fill(); }); }
    if (cold) { c.fillStyle = 'rgba(160,200,255,0.18)'; c.fillRect(0, 0, w, h); }
  };
  const dinner = (S, fries = true, cold = false) => {
    S.cyl((p) => add(p, [-0.32, 0.4, 1.12]), 0.21, 0.02, P.white, 20, { capPaint: plateTop(null, cold) });
    S.cyl((p) => add(p, [0.32, 0.4, 1.12]), 0.21, 0.02, P.white, 20, { capPaint: plateTop(fries, cold) });
  };
  const viewfinder = (ctx, W, H_, u) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; const m = 90, L = 60, top = 340, bot = 1000; [[m, top, 1, 1], [W - m, top, -1, 1], [m, bot, 1, -1], [W - m, bot, -1, -1]].forEach(([x, y, sx, sy]) => { ctx.beginPath(); ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y); ctx.stroke(); }); ctx.fillStyle = '#ec3a32'; ctx.beginPath(); ctx.arc(m + 20, top + 95, 9, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
  const snow = (ctx, x, y, s, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); ctx.strokeStyle = '#cfe8ff'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(0,40,90,0.4)'; ctx.shadowBlur = 8; for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(34, 0); ctx.moveTo(22, 0); ctx.lineTo(30, -9); ctx.moveTo(22, 0); ctx.lineTo(30, 9); ctx.moveTo(-22, 0); ctx.lineTo(-30, -9); ctx.moveTo(-22, 0); ctx.lineTo(-30, 9); ctx.stroke(); } ctx.restore(); };
  const fry = (S, c) => S.rbox((p) => add(rotZ(p, 0.5), c), 0.012, 0.06, 0.012, [244, 196, 64], { bevel: 0.3, bias: -0.6 });
  const shotsAt = () => [V('she', 'photo'), V('photo', 'top'), V('photo', 'lighting')];
  const flashAt = (t) => shotsAt().reduce((s, x) => s + 0.45 * Math.exp(-Math.pow((t - x) * 9, 2)), 0);

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: dinner served, she points at his phone
      const S = room(W, H_, t, a, b, [[0.2, 1.6, 3.6], [0, 0.95, 0.2], [0.12, 1.55, 3.2], [0, 0.98, 0.2]], { table: true });
      const bd = HE(S, { arms: POSE.phone, head: { yaw: 0.1, pitch: -0.3 }, face: { look: [0, -0.6], mouth: 'smile' } });
      phone(S, add(midHands(bd), [0, 0.05, 0.02]), 0.2, 1.1);
      SHE(S, { arms: [PT, [0.35, 0.18, 0.7]], head: { yaw: -0.45 }, face: { look: [-0.6, 0], lids: 0.3, mouth: 'flat', brows: -0.45 } });
      dinner(S);
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'puts') { // him: phone away, angelic
      const S = room(W, H_, t, a, b, 'him');
      const aw = t >= V('puts', 'away');
      const bd = HE(S, { arms: aw ? POSE.clasp : POSE.phone, head: { yaw: aw ? 0.35 : 0.1, pitch: aw ? 0 : -0.3, tilt: aw ? -0.1 : 0 }, face: { eyes: aw ? 'happy' : 'open', look: [0.4, aw ? 0 : -0.6], mouth: 'smile', blush: aw ? 0.4 : 0 } });
      if (!aw) phone(S, add(midHands(bd), [0, 0.05, 0.02]), 0.2, 1.1);
      S.render(ctx, W, H_, { dof: 0.22 });
      FX.ring(ctx, 150, 940, 80, '#58b84a', H.clamp((t - V('puts', 'away')) / 0.45), 'tick');
    } else if (name === 'she') { // her: just one photo
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: POSE.clasp, head: { yaw: 0.45 }, face: { look: [0.6, 0], mouth: 'smile' } });
      const up = t >= V('she', 'picks');
      const g = SHE(S, { arms: up ? [[1.25, 0.05, 1.0], [1.25, 0.05, 1.0]] : POSE.clasp, head: { yaw: -0.05, pitch: up ? -0.1 : 0 }, face: { look: [0, -0.2], mouth: 'smile', brows: 0.2 } });
      if (up) phone(S, add(midHands(g), [0, 0.07, 0.04]), 0.0, 1.2);
      S.render(ctx, W, H_, { dof: 0.22 });
      flash = flashAt(t);
    } else if (name === 'photo') { // over the table, through her camera
      const S = room(W, H_, t, a, b, [[0.1, 1.7, 1.75], [0.0, 0.4, 1.1], [0.0, 1.62, 1.62], [0.05, 0.4, 1.1]], { table: true });
      HE(S); SHE(S);
      dinner(S);
      const k = t >= V('photo', 'then', 2) ? 1 : 0;
      S.render(ctx, W, H_, { dof: 0.3 });
      viewfinder(ctx, W, H_, 1);
      if (k) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(W * 0.7, 420, 20, W * 0.7, 420, 500); g.addColorStop(0, 'rgba(255,230,170,0.45)'); g.addColorStop(1, 'rgba(255,230,170,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
      flash = flashAt(t);
    } else if (name === 'cold') { // two-shot: twenty minutes later, he waits, the food goes cold
      const S = room(W, H_, t, a, b, [[0.1, 1.55, 2.9], [0, 1.0, 0.2], [0.08, 1.52, 2.6], [0, 1.02, 0.2]], { table: true });
      HE(S, { lean: -0.1, arms: POSE.slump, head: { yaw: 0.2, pitch: -0.3 }, face: { look: [0.2, -0.6], lids: 0.45, mouth: 'flat', brows: 0.2 } });
      const g = SHE(S, { arms: [[1.0, 0.05, 1.1], [1.0, 0.05, 1.1]], head: { yaw: 0.05, pitch: -0.25 }, face: { look: [0, -0.5], mouth: 'smile', brows: 0.2 } });
      phone(S, add(midHands(g), [0, 0.06, 0.04]), 0.0, 1.1);
      dinner(S, true, t >= V('cold', 'cold'));
      S.render(ctx, W, H_, { dof: 0.3 });
      if (card(ctx, W / 2, 470, 240, 90, popU(t, V('cold', 'twenty'), 0.3), '#1c1a2a', -0.05)) { label(ctx, '+20 MIN', 0, 2, 44, '#ffd23f'); ctx.restore(); }
      const pp = S.proj([0, 0.42, 1.1]); snow(ctx, pp[0] - 120, pp[1] - 60, 1.4, popU(t, V('cold', 'cold'), 0.3)); snow(ctx, pp[0] + 130, pp[1] - 40, 1.1, popU(t, V('cold', 'cold') + 0.12, 0.3));
      flash = 0.3 * Math.exp(-Math.pow((t - (V('cold', 'twenty') + 0.4)) * 9, 2));
    } else if (name === 'asks') { // him: deadpan question
      const S = room(W, H_, t, a, b, 'him');
      HE(S, { arms: POSE.clasp, head: { yaw: 0.45, tilt: 0.1 }, face: { look: [0.6, 0], lids: 0.5, mouth: 'flat', brows: -0.25 } });
      SHE(S, { arms: [[1.25, 0.05, 1.0], [1.25, 0.05, 1.0]], head: { yaw: -0.05 } });
      S.render(ctx, W, H_, { dof: 0.22 });
    } else if (name === 'yes') { // her: thrilled with the shot
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: POSE.clasp, head: { yaw: 0.45 } });
      const g = SHE(S, { arms: [[1.25, 0.05, 1.0], [1.25, 0.05, 1.0]], head: { yaw: -0.1, tilt: 0.12, pitch: -0.1 }, face: { eyes: 'happy', mouth: 'open', blush: 0.6 } });
      phone(S, add(midHands(g), [0, 0.07, 0.04]), 0.0, 1.2);
      S.render(ctx, W, H_, { dof: 0.22 });
      const r = H.rng(7); for (let i = 0; i < 5; i++) FX.sparkle(ctx, r.range(80, 640), r.range(380, 950), 26 * popU(t, V('yes', 'perfect') + i * 0.08, 0.3), t * 2 + i);
    } else if (name === 'twist') { // over the table: her fries are gone
      const S = room(W, H_, t, a, b, [[0.3, 1.5, 1.68], [0.32, 0.4, 1.1], [0.32, 1.45, 1.6], [0.32, 0.4, 1.1]], { table: true });
      HE(S); SHE(S);
      dinner(S, false, true);
      S.render(ctx, W, H_, { dof: 0.3 });
      const pp = S.proj([0.4, 0.42, 1.1]); FX.ring(ctx, pp[0], pp[1], 120, '#ec3a32', H.clamp((t - V('twist', 'gone')) / 0.45), 'x');
      flash = 0.2 * Math.exp(-Math.pow((t - V('twist', 'gone')) * 7, 2));
    } else { // the closer: him, last fry in hand, smug
      const S = room(W, H_, t, a, b, [[-0.55, 1.58, 1.55], [-0.58, 1.45, -0.42], [-0.55, 1.6, 1.3], [-0.58, 1.48, -0.42]]);
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], [1.4, 0.2, 1.4]], head: { yaw: 0.1, tilt: -0.12 }, face: { look: [0, 0], lids: 0.5, mouth: Math.sin(t * 9) > 0 ? 'smile' : 'flat', brows: -0.3 } });
      fry(S, add(bd.hands[1].p, [0, 0.07, 0.03]));
      SHE(S, { arms: POSE.cheeks, head: { yaw: -0.4 }, face: { eyes: 'wide', mouth: 'o' } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.head); smug(ctx, hp[0] - 180, hp[1] - 150, t, popU(t, V('close', 'phones'), 0.3));
      flash = 0.15 * Math.exp(-Math.pow((t - V('close', 'babe')) * 7, 2));
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    k.play('error', V('hook', 'phones'), { gain: 0.3 });
    k.play('swish', V('puts', 'away'), { gain: 0.4 }); k.play('success', V('puts', 'away') + 0.05, { f: 'G5', gain: 0.35 });
    shotsAt().forEach((x) => k.play('shutter', x, { gain: 0.6 }));
    k.play('tick', V('cold', 'twenty'), { f: 4000, gain: 0.3 }); k.play('tock', V('cold', 'minutes'), { gain: 0.3 });
    k.tone(V('cold', 'cold'), { f: [[0, 1800], [0.4, 2400]], type: 'sine', dur: 0.45, gain: 0.06 }); // frosty chime
    k.play('blip', V('asks', 'photo'), { f: 600, gain: 0.3 });
    k.play('sparkle', V('yes', 'perfect'), { gain: 0.45 }); k.play('success', V('yes', 'perfect'), { f: 'E6', gain: 0.3 });
    nopeSound(k, V('twist', 'gone')); twistSound(k, V('twist', 'gone') + 0.25);
    for (let i = 0; i < 3; i++) k.play('tock', V('close', 'no') + i * 0.3, { gain: 0.2, minor: true });
    k.play('sparkle', V('close', 'phones'), { gain: 0.45 }); k.play('stamp', V('close', 'babe'), { gain: 0.45 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
