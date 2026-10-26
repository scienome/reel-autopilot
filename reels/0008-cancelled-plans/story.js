  // ==================== 0008 "Cancelled plans." : a sarcastic couple reel ====================
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
    ['hook', 0], ['text', V('text', 'then') - 0.15], ['fake', V('fake', 'oh') - 0.15], ['pjs', V('pjs', 'ten') - 0.15], ['read', V('read', 'then') - 0.15],
    ['both', V('both', 'both') - 0.15], ['he', V('twist', 'he') - 0.15], ['she', V('twist', 'she') - 0.15], ['close', V('close', 'soulmates') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'pov'), [['POV:', K('DINNER')], ['WITH', 'FRIENDS', 'TONIGHT.']]],
    [V('text', 'then'), [['THEN', 'A', K('TEXT.')]]],
    [V('text', "dinner's"), [["DINNER'S", K('CANCELLED.')]]],
    [V('text', 'sorry'), [['SORRY,', 'GUYS.']]],
    [V('fake', 'oh'), [['"OH', K('NO.')]]],
    [V('fake', "that's"), [["THAT'S", 'SO', K('SAD.')]]],
    [V('fake', 'we'), [['WE', 'WERE', 'SO', K('LOOKING')], [K('FORWARD'), 'TO', 'IT."']]],
    [V('pjs', 'ten'), [['TEN', K('SECONDS')], ['LATER.']]],
    [V('pjs', 'pajamas'), [[K('PAJAMAS'), 'ON.']]],
    [V('pjs', 'snacks'), [[K('SNACKS'), 'OUT.']]],
    [V('read', 'then'), [['THEN', 'HE', 'READS'], ['THE', K('REST.')]]],
    [V('read', 'hope'), [['"HOPE', 'YOU', K('BOTH')], ['FEEL', 'BETTER."']]],
    [V('both', 'both'), [[K('BOTH?')]]],
    [V('both', 'they'), [['THEY', 'LOOK', 'AT'], [K('EACH'), K('OTHER.')]]],
    [V('twist', 'he'), [['HE', 'TOLD', 'THEM'], ['HE', 'WAS', K('SICK.')]]],
    [V('twist', 'she'), [['SHE', 'TOLD', 'THEM'], ['SHE', 'WAS', K('SICK.')]]],
    [V('close', 'soulmates'), [[K('SOULMATES.')]]],
    [V('close', 'truly'), [[K('TRULY.')]]],
  ];
  const caps = makeCaps(CAPS);

  const FANCY = { he: [150, 56, 70], she: [44, 140, 140] }, PJ = { he: [120, 170, 230], she: [242, 160, 190] };
  const chatScreen = (c, w, h) => { c.fillStyle = '#f4f2f7'; c.fillRect(0, 0, w, h); c.fillStyle = '#3d8bf2'; c.fillRect(0, 0, w, h * 0.12); c.fillStyle = '#dcdae2'; c.beginPath(); c.roundRect(w * 0.08, h * 0.2, w * 0.7, h * 0.12, 20); c.roundRect(w * 0.08, h * 0.36, w * 0.55, h * 0.12, 20); c.fill(); c.fillStyle = '#3d8bf2'; c.beginPath(); c.roundRect(w * 0.3, h * 0.55, w * 0.62, h * 0.12, 20); c.fill(); };
  // a thermometer sticker (the excuse)
  const thermo = (ctx, x, y, s, u, rot = 0.3) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * u, s * u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.fillStyle = '#fff8ec'; ctx.beginPath(); ctx.roundRect(-14, -70, 28, 100, 14); ctx.arc(0, 38, 24, 0, Math.PI * 2); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#ec3a32'; ctx.beginPath(); ctx.arc(0, 38, 16, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-6, -50, 12, 90); ctx.restore(); };
  const msg = (ctx, x, y, lines, u) => { if (!card(ctx, x, y, 470, 70 + lines.length * 46, u * 0.85, '#f2f0f5', -0.03)) return; ctx.fillStyle = '#3d8bf2'; ctx.beginPath(); ctx.arc(-195, -((lines.length - 1) * 23), 22, 0, Math.PI * 2); ctx.fill(); label(ctx, 'F', -195, -((lines.length - 1) * 23) + 1, 24, '#fff'); lines.forEach((ln, i) => { ctx.font = FONT(800, 32); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1c1a22'; ctx.fillText(ln, -160, -((lines.length - 1) * 23) + i * 46); }); ctx.restore(); };

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: dressed up, sitting very straight
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      HE(S, { shirt: FANCY.he, arms: POSE.clasp, head: { yaw: 0.05 }, face: { look: [0, 0], mouth: 'smile', lids: 0.3, brows: 0.2 } });
      SHE(S, { shirt: FANCY.she, arms: POSE.clasp, head: { yaw: -0.05 }, face: { look: [0, 0], mouth: 'smile', lids: 0.3, brows: 0.2 } });
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'text') { // two-shot: the phone buzzes
      const S = room(W, H_, t, a, b, 'two');
      const rd = t >= V('text', "dinner's");
      const bd = HE(S, { shirt: FANCY.he, arms: POSE.phone, head: { yaw: 0.1, pitch: -0.3 }, face: { look: [0, -0.6], mouth: rd ? 'o' : 'flat', brows: rd ? 0.4 : 0 } });
      phone(S, add(midHands(bd), [0, 0.05, 0.02]), 0.2, 1.1, chatScreen);
      SHE(S, { shirt: FANCY.she, arms: POSE.clasp, head: { yaw: -0.4, pitch: -0.2 }, face: { look: [-0.5, -0.4], mouth: 'flat' } });
      S.render(ctx, W, H_, { dof: 0.28 });
      const pp = S.proj(midHands(bd)); FX.buzz(ctx, pp[0], pp[1] - 30, 1.2, t < V('text', "dinner's") ? 1 : 0);
      msg(ctx, W / 2, 920, ["Dinner's cancelled.", 'Sorry, guys!'], popU(t, V('text', "dinner's"), 0.3));
    } else if (name === 'fake') { // two-shot: the most fake sadness ever
      const S = room(W, H_, t, a, b, [[0, 1.6, 2.25], [0, 1.45, -0.4], [0, 1.6, 2.0], [0, 1.47, -0.4]]);
      const so = t >= V('fake', 'we');
      HE(S, { shirt: FANCY.he, arms: POSE.clasp, head: { yaw: so ? 0.4 : 0.1, tilt: 0.15 }, face: { eyes: 'open', look: [so ? 0.6 : 0, 0.1], lids: so ? 0.45 : 0, mouth: 'frown', brows: 0.6 } });
      SHE(S, { shirt: FANCY.she, arms: POSE.clasp, head: { yaw: so ? -0.4 : -0.1, tilt: -0.15 }, face: { eyes: 'open', look: [so ? -0.6 : 0, 0.1], lids: so ? 0.45 : 0, mouth: 'frown', brows: 0.6 } });
      S.render(ctx, W, H_, { dof: 0.25 });
      if (so) { [[150, 820], [570, 820]].forEach(([x, y], i) => FX.sweat(ctx, x, y + 40 * ramp(t, V('fake', 'looking') + i * 0.1, 0.8), 1.2 * popU(t, V('fake', 'looking') + i * 0.1, 0.3))); }
    } else if (name === 'pjs') { // wide: ten seconds later, pajamas, snacks, blanket
      const S = room(W, H_, t, a, b, [[0.15, 1.5, 3.3], [0, 1.0, -0.35], [0.08, 1.48, 2.9], [0, 1.03, -0.35]], { table: true });
      HE(S, { shirt: PJ.he, lean: -0.1, arms: POSE.rest, head: { yaw: 0.2, tilt: 0.12 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.4 } });
      SHE(S, { shirt: PJ.she, lean: -0.1, arms: POSE.rest, head: { yaw: -0.2, tilt: -0.12 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.4 } });
      if (t >= V('pjs', 'snacks')) popcorn(S, [0.15, 0.4, 1.15], 1.1);
      S.render(ctx, W, H_, { dof: 0.3 });
      flash = 0.3 * Math.exp(-Math.pow((t - (a + 0.12)) * 7, 2));
      FX.speed(ctx, W, H_, W / 2, 620, H.clamp(1 - (t - a) / 0.6), t);
      if (card(ctx, W / 2, 440, 230, 90, popU(t, V('pjs', 'seconds'), 0.3), '#1c1a2a', -0.05)) { label(ctx, '+10 SEC', 0, 2, 44, '#ffd23f'); ctx.restore(); }
      FX.ring(ctx, 200, 640, 120, '#58b84a', H.clamp((t - V('pjs', 'pajamas')) / 0.45), null);
    } else if (name === 'read') { // him: reading the rest of the message
      const S = room(W, H_, t, a, b, 'him');
      const rd = t >= V('read', 'both');
      const bd = HE(S, { shirt: PJ.he, arms: [[1.05, 0.05, 1.1], [1.05, 0.05, 1.1]], head: { yaw: 0.05, pitch: -0.2 }, face: { eyes: rd ? 'wide' : 'open', look: [0, -0.5], mouth: rd ? 'o' : 'smile', brows: rd ? 0.5 : 0 } });
      phone(S, add(midHands(bd), [0, 0.06, 0.04]), 0.0, 1.2, chatScreen);
      S.render(ctx, W, H_, { dof: 0.22 });
      msg(ctx, 330, 950, ['Hope you BOTH', 'feel better!'], popU(t, V('read', 'hope'), 0.3));
    } else if (name === 'both') { // two-shot: heads snap to each other
      const S = room(W, H_, t, a, b, 'two');
      const lk = ramp(t, V('both', 'they'), 0.25);
      HE(S, { shirt: PJ.he, arms: POSE.clasp, head: { yaw: 0.05 + 0.45 * lk }, face: { eyes: 'wide', look: [0.7 * lk, 0], mouth: 'o', brows: 0.5 } });
      SHE(S, { shirt: PJ.she, arms: POSE.clasp, head: { yaw: -0.05 - 0.45 * lk }, face: { eyes: 'wide', look: [-0.7 * lk, 0], mouth: 'o', brows: 0.5 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      FX.qmark(ctx, W / 2, 470, popU(t, V('both', 'both'), 0.3), '?', 0);
      FX.dots(ctx, [[260, 560], [360, 520], [460, 560]], ramp(t, V('both', 'each'), 0.4));
    } else if (name === 'he') { // him: guilty grin, thermometer
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { shirt: PJ.he, arms: POSE.shrug, head: { yaw: 0.35, tilt: -0.12 }, face: { eyes: 'open', look: [0.5, 0], mouth: 'smile', brows: 0.45, blush: 0.8 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      thermo(ctx, 600, 900, 1.3, popU(t, V('twist', 'sick'), 0.3), 0.3);
    } else if (name === 'she') { // her: the exact same grin
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { shirt: PJ.he, head: { yaw: 0.45 } });
      const g = SHE(S, { shirt: PJ.she, arms: POSE.shrug, head: { yaw: -0.35, tilt: 0.12 }, face: { eyes: 'open', look: [-0.5, 0], mouth: 'smile', brows: 0.45, blush: 0.8 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      thermo(ctx, 120, 900, 1.3, popU(t, V('twist', 'sick', 2), 0.3), -0.3);
      flash = 0.2 * Math.exp(-Math.pow((t - V('twist', 'sick', 2)) * 7, 2));
    } else { // the closer: pointing at each other, laughing, hearts
      const S = room(W, H_, t, a, b, [[0.05, 1.5, 2.6], [0, 1.25, -0.4], [0.05, 1.52, 2.2], [0, 1.3, -0.4]]);
      HE(S, { shirt: PJ.he, arms: [[0.35, 0.18, 0.7], PT], head: { yaw: 0.45, tilt: 0.15 }, face: { eyes: 'happy', mouth: 'open', blush: 0.6 } });
      SHE(S, { shirt: PJ.she, arms: [PT, [0.35, 0.18, 0.7]], head: { yaw: -0.45, tilt: -0.15 }, face: { eyes: 'happy', mouth: 'open', blush: 0.8 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      hearts(ctx, W, t, V('close', 'soulmates') + 0.2, 5, 620);
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    const bz = V('text', 'then'); for (let i = 0; i < 3; i++) k.play('buzz', bz + 0.25 + i * 0.18, { f: 180, dur: 0.12, gain: 0.3 });
    k.play('ding', V('text', "dinner's"), { f: 'A5', gain: 0.4 });
    k.tone(V('fake', 'sad'), { f: [[0, 440], [0.5, 330], [1.0, 262]], type: 'triangle', dur: 1.1, gain: 0.1 }); // the "sad trombone"
    k.play('whoosh', V('pjs', 'ten') - 0.15, { dur: 0.4, gain: 0.5 }); k.play('powerup', V('pjs', 'pajamas'), { gain: 0.4 }); k.play('pop', V('pjs', 'snacks'), { f: 700, gain: 0.5 });
    k.play('ding', V('read', 'hope'), { f: 'A5', gain: 0.35 }); k.play('jump', V('read', 'both'), { gain: 0.45 });
    k.play('impact', V('both', 'both'), { gain: 0.5 }); k.play('whoosh', V('both', 'they'), { dur: 0.25, gain: 0.4 });
    k.play('stamp', V('twist', 'sick'), { gain: 0.5 });
    twistSound(k, V('twist', 'sick', 2));
    heartSound(k, V('close', 'soulmates') + 0.2);
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
