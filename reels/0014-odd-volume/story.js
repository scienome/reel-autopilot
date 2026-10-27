  // ==================== 0014 "Odd volume." : a sarcastic couple reel ====================
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
    ['hook', 0], ['his', V('his', 'his') - 0.15], ['she', V('she', 'she') - 0.15], ['fix', V('fix', 'he') - 0.15], ['again', V('again', 'twentythree') - 0.15],
    ['hide', V('hide', 'so') - 0.15], ['solved', V('solved', 'he') - 0.15], ['phone', V('phone', 'then') - 0.15], ['twist', V('twist', 'he') - 0.15],
    ['close', V('close', 'zero') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'every'), [['EVERY', 'COUPLE', 'HAS'], ['ONE', K('WEIRD'), 'RULE.']]],
    [V('his', 'his'), [['HIS:']]],
    [V('his', 'the'), [['THE', 'VOLUME', "CAN'T"], ['BE', 'AN', K('ODD'), 'NUMBER.']]],
    [V('she', 'she'), [['SHE', 'TURNS', 'IT', 'TO'], [K('TWENTY-ONE.')]]],
    [V('fix', 'he'), [['HE', K('QUIETLY')], ['FIXES', 'IT.']]],
    [V('fix', 'twentytwo'), [[K('TWENTY-TWO.')]]],
    [V('again', 'twentythree'), [[K('TWENTY-THREE.')]]],
    [V('again', 'twentyfour'), [[K('TWENTY-FOUR.')]]],
    [V('again', 'twentyfive'), [[K('TWENTY-FIVE.')]]],
    [V('hide', 'so'), [['SO', 'HE', K('HIDES')], ['THE', 'REMOTE']]],
    [V('hide', 'under'), [['UNDER', 'THE'], [K('CUSHION.')]]],
    [V('solved', 'he'), [['HE', 'LEANS', 'BACK.']]],
    [V('solved', 'problem'), [['PROBLEM', K('SOLVED.')]]],
    [V('phone', 'then'), [['THEN', 'SHE', 'OPENS', 'THE'], [K('TV'), K('APP'), 'ON', 'HER', 'PHONE,']]],
    [V('phone', 'and'), [['AND', 'SETS', 'IT', 'TO'], [K('FIFTY-FIVE.')]]],
    [V('twist', 'he'), [['HE', K('UNPLUGS')], ['THE', 'TV.']]],
    [V('close', 'zero'), [[K('ZERO.')]]],
    [V('close', "that's"), [["THAT'S", 'AN'], [K('EVEN'), 'NUMBER.']]],
  ];
  const caps = makeCaps(CAPS);

  // the volume shown so far (a pure function of t)
  const volAt = (t) => { const ev = [[0, 20], [V('she', 'twentyone'), 21], [V('fix', 'twentytwo'), 22], [V('again', 'twentythree'), 23], [V('again', 'twentyfour'), 24], [V('again', 'twentyfive'), 25], [V('phone', 'fiftyfive'), 55], [V('twist', 'unplugs'), 0]]; let v = 20; ev.forEach(([s, x]) => { if (t >= s) v = x; }); return v; };
  const off = (t) => t >= V('twist', 'unplugs');
  const volBar = (ctx, x, y, w, v, u, big = 1) => {
    if (!card(ctx, x, y, w, 96 * big, u, 'rgba(20,18,32,0.92)')) return; const odd = v % 2 === 1;
    label(ctx, 'VOL', -w / 2 + 50 * big, 2, 26 * big, '#ffffff', 800);
    const bw = w - 200 * big; ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(-w / 2 + 92 * big, -8 * big, bw, 16 * big); ctx.fillStyle = odd ? '#ec5a3a' : '#58b84a'; ctx.fillRect(-w / 2 + 92 * big, -8 * big, bw * Math.min(1, v / 60), 16 * big);
    label(ctx, String(v), w / 2 - 54 * big, 2, 40 * big, odd ? '#ec5a3a' : '#7ad86a'); ctx.restore();
  };
  const showScreen = (t) => (c, w, h) => { if (off(t)) { c.fillStyle = '#08080c'; c.fillRect(0, 0, w, h); return; } const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#8ec8f0'); g.addColorStop(1, '#e8f4ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#4f8a3c'; c.beginPath(); c.moveTo(0, h); c.lineTo(w * 0.3, h * 0.45); c.lineTo(w * 0.6, h); c.fill(); c.fillStyle = '#6aa64a'; c.beginPath(); c.moveTo(w * 0.35, h); c.lineTo(w * 0.7, h * 0.55); c.lineTo(w, h); c.fill(); c.fillStyle = '#f2b54a'; c.beginPath(); c.arc(w * (0.7 + 0.05 * Math.sin(t)), h * 0.25, h * 0.1, 0, Math.PI * 2); c.fill(); };
  const tvLight = (ctx, W, H_, t) => { if (off(t)) { ctx.save(); ctx.fillStyle = 'rgba(10,8,24,0.45)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); return; } ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(90,140,255,${0.07 * (0.8 + 0.2 * Math.sin(t * 6))})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  // the TV across the room, seen from the couch
  const tvShot = (ctx, W, H_, t, a, b) => {
    const [E, TG] = shotCam(t, a, b, [0.0, 1.45, 0.2], [0, 1.05, 3.2], [0.0, 1.42, 0.6], [0, 1.05, 3.2]);
    const S = Scene(E, TG, W, H_);
    S.quad([[-7, 0, -1.25], [7, 0, -1.25], [7, 0, 9], [-7, 0, 9]], P.floor, { z: 98 });
    S.quad([[-1.8, 0.003, 1.5], [1.8, 0.003, 1.5], [1.8, 0.003, 3.4], [-1.8, 0.003, 3.4]], P.rug, { z: 97 });
    S.rbox((p) => add(p, [0, 0.25, 3.25]), 0.9, 0.25, 0.25, P.wood, { bevel: 0.2 });
    const scr = showScreen(t); S.rbox((p) => add(rotY(p, Math.PI), [0, 1.0, 3.3]), 0.75, 0.44, 0.04, [22, 22, 28], { bevel: 0.15, paint: (cc, ww, hh) => { cc.fillStyle = '#0c0c12'; cc.fillRect(0, 0, ww, hh); cc.save(); cc.translate(ww * 0.03, hh * 0.04); scr(cc, ww * 0.94, hh * 0.92); cc.restore(); } });
    S.cyl((p) => add(p, [-1.2, 0, 3.4]), 0.18, 0.4, [196, 112, 72], 12, { top: 1.15 }); const r = H.rng(31); for (let i = 0; i < 6; i++) S.ball([-1.2 + r.range(-0.25, 0.25), 0.7 + r.range(0, 0.5), 3.4 + r.range(-0.15, 0.15)], 0.17 + r.range(0, 0.1), [80, 140, 70], { rim: false });
    S.render(ctx, W, H_, { dof: 0, bg: rgb([96, 116, 92]) });
    return S;
  };

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: TV night, he holds the remote
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], [1.2, 0.1, 0.5]], head: { yaw: 0.05 }, face: { look: [0, 0.05], mouth: 'flat' } });
      remote(S, add(bd.hands[1].p, [0, 0.02, 0.06]), [0, 0, 1], 1.2, -0.4);
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.05 }, face: { look: [0, 0.05], mouth: 'smile' } });
      S.render(ctx, W, H_, { dof: 0.3 });
      tvLight(ctx, W, H_, t);
    } else if (name === 'his') { // him: one finger, one rule
      const S = room(W, H_, t, a, b, 'him');
      HE(S, { arms: [[0.35, 0.18, 0.7], UP], head: { yaw: 0.2, tilt: 0.06 }, face: { look: [0.3, 0], lids: 0.2, mouth: 'flat', brows: -0.5 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      tvLight(ctx, W, H_, t);
      if (card(ctx, 160, 920, 170, 120, popU(t, V('his', 'odd'), 0.3), '#fff8ec', -0.06)) { label(ctx, '21', -20, 0, 54, '#1c1a22'); ctx.restore(); }
      FX.ring(ctx, 160, 920, 85, '#ec3a32', H.clamp((t - V('his', 'number')) / 0.45), 'x');
    } else if (name === 'she' || name === 'again') { // the TV: the volume bar
      tvShot(ctx, W, H_, t, a, b);
      const v = volAt(t); volBar(ctx, W / 2, 900, 560, v, 1, 1.1);
      const fl = [V('she', 'twentyone'), V('again', 'twentythree'), V('again', 'twentyfour'), V('again', 'twentyfive')].reduce((s, x) => s + 0.12 * Math.exp(-Math.pow((t - x) * 9, 2)), 0); flash = fl;
      if (v % 2) FX.qmark(ctx, 600, 760, 0.6 * popU(t, name === 'she' ? V('she', 'twentyone') : V('again', 'twentyfive'), 0.3), '!');
    } else if (name === 'fix') { // him: a quiet, sneaky correction
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], [1.2, 0.1, 0.5]], head: { yaw: 0.35, tilt: 0.06 }, face: { look: [0.7, 0], lids: 0.45, mouth: 'smile', brows: -0.3 } });
      remote(S, add(bd.hands[1].p, [0, 0.02, 0.06]), [0, 0, 1], 1.2, -0.4);
      S.render(ctx, W, H_, { dof: 0.22 });
      tvLight(ctx, W, H_, t);
      volBar(ctx, W / 2, 950, 440, volAt(t), popU(t, V('fix', 'twentytwo') - 0.1, 0.25), 0.85);
    } else if (name === 'hide') { // two-shot: the remote goes under the cushion
      const S = room(W, H_, t, a, b, 'two');
      const k = ramp(t, V('hide', 'under'), 0.4);
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], [0.6 - 0.3 * k, 0.4 + 0.3 * k, 0.6 - 0.5 * k]], head: { yaw: 0.25, pitch: -0.2 * k }, face: { look: [0.4, -0.4 * k], lids: 0.4, mouth: 'smile', brows: -0.35 } });
      if (k < 0.9) remote(S, add(bd.hands[1].p, [0, 0.02, 0.06]), [0, 0, 1], 1.2, -0.4);
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.45 }, face: { look: [-0.6, 0], lids: 0.35, mouth: 'flat', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      tvLight(ctx, W, H_, t);
      const hp = S.proj(bd.hands[1].p); FX.dots(ctx, [[hp[0] - 60, hp[1] - 120], [hp[0] - 10, hp[1] - 60], [hp[0], hp[1]]], ramp(t, V('hide', 'hides'), 0.4));
    } else if (name === 'solved') { // him: leaning back, very pleased
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { lean: -0.04, arms: [[0.3, 0.3, 0.4], [0.3, 0.3, 0.4]], head: { yaw: 0.1, tilt: -0.15, pitch: -0.05 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.4 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      tvLight(ctx, W, H_, t);
      const hp = S.proj(bd.head); smug(ctx, hp[0] + 180, hp[1] - 150, t, popU(t, V('solved', 'solved'), 0.3));
      FX.ring(ctx, 150, 930, 75, '#58b84a', H.clamp((t - V('solved', 'solved')) / 0.45), 'tick');
    } else if (name === 'phone') { // her: the TV app
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { lean: -0.15, head: { yaw: 0.1, tilt: -0.15 }, face: { eyes: 'happy', mouth: 'smile' } });
      const g = SHE(S, { arms: [[1.2, 0.05, 1.0], [1.2, 0.05, 1.0]], head: { yaw: -0.05, pitch: -0.1, tilt: 0.1 }, face: { look: [0, -0.3], lids: 0.4, mouth: 'smile', brows: -0.35 } });
      phone(S, add(midHands(g), [0, 0.07, 0.04]), 0.0, 1.2, (c, w, h) => { c.fillStyle = '#1c1a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#3d8bf2'; c.beginPath(); c.arc(w / 2, h * 0.35, w * 0.25, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; c.fillRect(w * 0.3, h * 0.65, w * 0.4, h * 0.04); c.fillRect(w * 0.48, h * 0.6, w * 0.04, h * 0.14); });
      S.render(ctx, W, H_, { dof: 0.22 });
      tvLight(ctx, W, H_, t);
      volBar(ctx, W / 2, 950, 440, volAt(t), popU(t, V('phone', 'fiftyfive') - 0.1, 0.25), 0.85);
      if (t > V('phone', 'fiftyfive')) FX.speed(ctx, W, H_, W / 2, 640, H.clamp(1 - (t - V('phone', 'fiftyfive')) / 0.6), t);
      flash = 0.15 * Math.exp(-Math.pow((t - V('phone', 'fiftyfive')) * 7, 2));
    } else if (name === 'twist') { // two-shot: he has the plug in his hand; the lights go out
      const S = room(W, H_, t, a, b, 'two');
      const un = off(t);
      const bd = HE(S, { arms: [[0.2, 1.4, 0.1], [0.35, 0.18, 0.7]], head: { yaw: un ? 0.4 : -0.3 }, face: { look: [un ? 0.6 : -0.5, 0], lids: un ? 0.45 : 0, mouth: 'smile', brows: -0.3 } });
      SHE(S, { arms: [[1.2, 0.05, 1.0], [1.2, 0.05, 1.0]], head: { yaw: -0.4 }, face: { eyes: un ? 'wide' : 'open', look: [-0.6, 0], mouth: un ? 'o' : 'smile', brows: un ? 0.5 : -0.3 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      tvLight(ctx, W, H_, t);
      const hp = S.proj(bd.hands[0].p), u = popU(t, V('twist', 'unplugs') - 0.1, 0.3);
      if (u > 0) { ctx.save(); ctx.translate(Math.max(110, hp[0]), hp[1] - 30); ctx.scale(1.7 * u, 1.7 * u); ctx.fillStyle = '#f2f0ea'; ctx.beginPath(); ctx.roundRect(-30, -24, 60, 48, 10); ctx.fill(); ctx.fillStyle = '#9a9aa6'; ctx.fillRect(-18, -50, 10, 28); ctx.fillRect(8, -50, 10, 28); ctx.strokeStyle = '#2a2a32'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 24); ctx.quadraticCurveTo(10, 90, 70, 110); ctx.stroke(); ctx.restore(); FX.sparkle(ctx, Math.max(80, hp[0]) + 30, hp[1] - 80, 26 * u, t * 3); }
    } else { // the closer: him in the dark, smug; volume zero
      const S = room(W, H_, t, a, b, [[-0.66, 1.6, 1.15], [-0.62, 1.56, -0.42], [-0.64, 1.6, 0.92], [-0.62, 1.57, -0.42]]);
      const bd = HE(S, { arms: POSE.clasp, head: { yaw: 0.1, tilt: -0.12 }, face: { look: [0, 0], lids: 0.5, mouth: 'smile', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      tvLight(ctx, W, H_, t);
      volBar(ctx, W / 2, 950, 440, 0, popU(t, V('close', 'zero'), 0.25), 0.85);
      const hp = S.proj(bd.head); smug(ctx, hp[0] - 190, hp[1] - 150, t, popU(t, V('close', 'even'), 0.3));
      FX.ring(ctx, 600, 820, 70, '#58b84a', H.clamp((t - V('close', 'even')) / 0.45), 'tick');
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    const beep = (t) => k.play('blip', t, { f: 980, gain: 0.35 });
    k.play('stamp', V('his', 'odd'), { gain: 0.4 }); nopeSound(k, V('his', 'number'));
    beep(V('she', 'twentyone')); k.play('error', V('she', 'twentyone') + 0.15, { gain: 0.3 });
    beep(V('fix', 'twentytwo')); k.play('success', V('fix', 'twentytwo') + 0.1, { f: 'G5', gain: 0.3 });
    ['twentythree', 'twentyfour', 'twentyfive'].forEach((w) => beep(V('again', w)));
    k.play('swish', V('hide', 'under'), { gain: 0.45 }); k.play('thud', V('hide', 'cushion'), { f: 140, gain: 0.35 });
    k.play('sparkle', V('solved', 'solved'), { gain: 0.45 });
    k.play('click', V('phone', 'opens'), { gain: 0.4 }); for (let i = 0; i < 8; i++) beep(V('phone', 'fiftyfive') - 0.4 + i * 0.05);
    k.play('impact', V('phone', 'fiftyfive'), { gain: 0.45 });
    k.play('stroke', V('twist', 'unplugs'), { material: 'marker', dur: 0.15, gain: 0.3 }); k.tone(V('twist', 'unplugs') + 0.05, { f: [[0, 600], [0.4, 60]], type: 'sawtooth', dur: 0.45, gain: 0.08, filter: 'lowpass', f2: 1200 }); // power down
    twistSound(k, V('close', 'even'));
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
