  // ==================== 0006 "We need to talk." : a sarcastic couple reel ====================
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
    ['hook', 0], ['talk', V('talk', 'we') - 0.15], ['panic', V('panic', 'instantly') - 0.15], ['list', V('list', 'her') - 0.15], ['cookie', V('list', 'the') - 0.15],
    ['says', V('says', 'then') - 0.15], ['relief', V('relief', 'the') - 0.15], ['scrub', V('twist', "he's") - 0.15], ['dries', V('twist', 'he') - 0.15],
    ['close', V('close', 'works') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'four'), [['FOUR', 'WORDS', 'THAT'], [K('STOP'), 'HIS', K('HEART.')]]],
    [V('talk', 'we'), [['"WE', 'NEED', 'TO'], [K('TALK."')]]],
    [V('panic', 'instantly'), [['INSTANTLY,', 'HE'], [K('REPLAYS'), 'THE', 'WHOLE', 'WEEK.']]],
    [V('panic', 'every'), [['EVERY', 'SINGLE', K('DAY.')]]],
    [V('list', 'her'), [['HER', K('BIRTHDAY?')]]],
    [V('list', 'remembered'), [[K('REMEMBERED.')]]],
    [V('list', 'her', 2), [['HER', K('COFFEE'), 'ORDER?']]],
    [V('list', 'the'), [['THE', 'LAST', K('COOKIE?')]]],
    [V('list', 'oh'), [[K('OH'), K('NO.')]]],
    [V('says', 'then'), [['THEN', 'SHE', 'SAYS,']]],
    [V('says', "it's"), [['"IT\'S', 'ABOUT', 'THE'], [K('DISHES."')]]],
    [V('relief', 'the'), [['THE', K('DISHES!')]]],
    [V('relief', 'just'), [[K('JUST'), 'THE', 'DISHES!']]],
    [V('twist', "he's"), [["HE'S", 'NEVER', 'BEEN', 'THIS'], [K('HAPPY'), 'TO', 'SCRUB', 'A', 'PAN.']]],
    [V('twist', 'he'), [['HE', K('EVEN'), 'DRIES', 'THEM.']]],
    [V('close', 'works'), [['WORKS', 'EVERY'], [K('SINGLE'), 'TIME.']]],
  ];
  const caps = makeCaps(CAPS);

  // the memory checklist he runs in his head
  const ITEMS = [['BIRTHDAY', 'remembered', 1], ['COFFEE ORDER', 'remembered', 2], ['LAST COOKIE', 'oh', 1]];
  const checklist = (ctx, x, y, t, u) => {
    if (!card(ctx, x, y, 330, 300, u, '#fff8ec', 0.04)) return;
    label(ctx, 'THIS WEEK', 0, -112, 30, '#7a7484');
    ITEMS.forEach(([txt, w, n], i) => {
      const yy = -50 + i * 78, on = t >= V('list', w, n), bad = i === 2;
      ctx.font = FONT(900, 28); ctx.textAlign = 'left'; ctx.fillStyle = '#1c1a22'; ctx.fillText(txt, -140, yy + 2);
      ctx.strokeStyle = '#c9c2bb'; ctx.lineWidth = 4; ctx.strokeRect(100, yy - 22, 44, 44);
      if (on) { const k = popU(t, V('list', w, n), 0.3); ctx.save(); ctx.translate(122, yy); ctx.scale(k, k); ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = bad ? '#ec3a32' : '#3aa64a'; ctx.beginPath(); if (bad) { ctx.moveTo(-16, -16); ctx.lineTo(16, 16); ctx.moveTo(16, -16); ctx.lineTo(-16, 16); } else { ctx.moveTo(-16, 0); ctx.lineTo(-4, 14); ctx.lineTo(18, -16); } ctx.stroke(); ctx.restore(); }
    });
    ctx.restore();
  };
  const cookie = (ctx, x, y, r, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10; ctx.fillStyle = '#d99a52'; ctx.beginPath(); ctx.arc(0, 0, r, 0.4, Math.PI * 2 - 0.1); ctx.lineTo(r * 0.5, r * 0.1); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#5a321e'; [[-0.4, -0.3], [0.1, -0.5], [-0.2, 0.3], [0.35, 0.45], [-0.55, 0.15]].forEach(([a, b2]) => { ctx.beginPath(); ctx.arc(a * r, b2 * r, r * 0.11, 0, Math.PI * 2); ctx.fill(); }); ctx.restore(); };
  const plateIcon = (ctx, x, y, r, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10; for (let i = 2; i >= 0; i--) { ctx.fillStyle = i ? '#e6e2da' : '#fbfaf6'; ctx.beginPath(); ctx.ellipse(0, -i * 16, r, r * 0.32, 0, 0, Math.PI * 2); ctx.fill(); } ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(140,110,70,0.5)'; ctx.beginPath(); ctx.ellipse(-r * 0.2, 0, r * 0.25, r * 0.08, 0.2, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
  const soap = (ctx, x, y, t, u) => { if (u <= 0) return; const r = H.rng(5); for (let i = 0; i < 9; i++) { const k = (t * 0.5 + r()) % 1, bx = x + r.range(-150, 150) + Math.sin(t * 2 + i) * 15, by = y - k * 260, rr = r.range(10, 26) * u; ctx.save(); ctx.globalAlpha = (1 - k) * 0.9; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 3; ctx.fillStyle = 'rgba(190,230,255,0.25)'; ctx.beginPath(); ctx.arc(bx, by, rr, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.arc(bx - rr * 0.35, by - rr * 0.35, rr * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } };
  const pan = (S, c, ang) => { const T = (p) => add(rotZ(rotX(p, 1.25), ang), c); S.cyl(T, 0.15, 0.03, [60, 60, 72], 16, { bias: -0.5, cap: [80, 80, 94] }); S.limb(T([0.14, 0.015, 0]), T([0.36, 0.015, 0]), 0.02, 0.02, [40, 30, 28], { bias: -0.5 }); };
  const sponge = (S, c) => S.rbox((p) => add(p, c), 0.06, 0.03, 0.04, [255, 208, 64], { bevel: 0.4, bias: -0.55 });
  const plate = (S, c) => S.cyl((p) => add(rotX(p, 1.3), c), 0.14, 0.015, P.white, 18, { bias: -0.5 });

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: she turns to him, very serious; he has no idea
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      const bd = HE(S, { arms: POSE.rest, head: { yaw: 0.05 }, face: { look: [0, 0], mouth: 'smile' } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.45 }, face: { look: [-0.6, 0], mouth: 'flat', brows: -0.15 } });
      S.render(ctx, W, H_, { dof: 0.3 });
      const hp = S.proj(add(bd.head, [0, -0.45, 0.2])); const beat = 1 + 0.12 * Math.max(0, Math.sin(t * 9)); FX.heart(ctx, hp[0], hp[1], 46 * beat * popU(t, V('hook', 'heart'), 0.3));
    } else if (name === 'talk') { // her close-up: the four words
      const S = room(W, H_, t, a, b, [[0.72, 1.6, 1.0], [0.62, 1.56, -0.42], [0.69, 1.6, 0.78], [0.62, 1.57, -0.42]]);
      HE(S, { head: { yaw: 0.3 } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.15, pitch: -0.05 }, face: { look: [-0.4, 0], lids: 0.15, mouth: 'flat', brows: -0.1 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      flash = 0.15 * Math.exp(-Math.pow((t - V('talk', 'talk')) * 7, 2));
    } else if (name === 'panic') { // him: the whole week flashes past
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { arms: POSE.clasp, head: { yaw: 0.05 + wave(t, 30, 0.03), tilt: 0.05 }, face: { eyes: 'wide', look: [Math.sin(t * 7) * 0.5, 0.1], mouth: 'o', brows: 0.6 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      FX.speed(ctx, W, H_, W / 2, 600, 0.8, t);
      const hp = S.proj(bd.head); FX.sweat(ctx, hp[0] + 170, hp[1] - 150, 1.6 * popU(t, V('panic', 'replays'), 0.3)); FX.sweat(ctx, hp[0] - 180, hp[1] - 90, 1.2 * popU(t, V('panic', 'every'), 0.3));
      if (card(ctx, 150, 950, 170, 110, popU(t, V('panic', 'replays'), 0.3), 'rgba(28,26,42,0.92)')) { ctx.fillStyle = '#fff'; [-30, 18].forEach((x) => { ctx.beginPath(); ctx.moveTo(x + 20, -26); ctx.lineTo(x - 22, 0); ctx.lineTo(x + 20, 26); ctx.closePath(); ctx.fill(); }); ctx.restore(); }
    } else if (name === 'list') { // him, wider, with the mental checklist
      const S = room(W, H_, t, a, b, [[-0.2, 1.55, 2.0], [-0.22, 1.38, -0.42], [-0.2, 1.56, 1.75], [-0.22, 1.42, -0.42]]);
      HE(S, { arms: [[0.35, 0.18, 0.7], [1.4, 0.05, 1.9]], head: { yaw: 0.05, pitch: 0.1, tilt: 0.1 }, face: { look: [0.5, 0.5], mouth: 'flat', brows: 0.25 } });
      S.render(ctx, W, H_, { dof: 0.25 });
      checklist(ctx, 535, 700, t, popU(t, a + 0.1, 0.35));
    } else if (name === 'cookie') { // him: the cookie. oh no.
      const S = room(W, H_, t, a, b, 'him');
      const on = t >= V('list', 'oh');
      const bd = HE(S, { arms: on ? POSE.cheeks : POSE.clasp, head: { yaw: 0.0, tilt: on ? -0.06 : 0 }, face: { eyes: 'wide', look: [0, 0], mouth: on ? 'o' : 'flat', brows: 0.65 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      cookie(ctx, 150, 940, 60, popU(t, V('list', 'cookie'), 0.3));
      FX.ring(ctx, 150, 940, 82, '#ec3a32', H.clamp((t - V('list', 'oh')) / 0.45), 'x');
      if (on) { const hp = S.proj(bd.head); FX.sweat(ctx, hp[0] + 175, hp[1] - 130, 1.8); }
    } else if (name === 'says') { // her: it's about the dishes
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { head: { yaw: 0.45 }, face: { eyes: 'wide', mouth: 'o' } });
      const d = t >= V('says', 'dishes');
      SHE(S, { arms: d ? [[0.2, 1.4, 0.1], [0.35, 0.18, 0.7]] : POSE.clasp, head: { yaw: -0.3, tilt: d ? 0.1 : 0 }, face: { look: [-0.6, 0], lids: 0.25, mouth: 'flat', brows: d ? 0.15 : -0.1 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      plateIcon(ctx, 560, 950, 80, popU(t, V('says', 'dishes'), 0.3));
    } else if (name === 'relief') { // him: pure joy, sunburst
      const S = Scene(...shotCam(t, a, b, [-0.62, 1.5, 1.75], [-0.62, 1.4, -0.42], [-0.62, 1.5, 1.5], [-0.62, 1.42, -0.42]), W, H_);
      const bd = HE(S, { yaw: 0, arms: POSE.cheer, head: { yaw: 0, tilt: Math.sin(t * 6) * 0.1, pitch: 0.1 }, face: { eyes: 'happy', mouth: 'open', blush: 0.6 } });
      const hp = S.proj(bd.head);
      FX.burst(ctx, W, H_, hp[0], hp[1], ramp(t, a + 0.05, 0.25), t);
      S.render(ctx, W, H_, { dof: 0, bg: 'rgba(0,0,0,0)' });
      const r = H.rng(9); for (let i = 0; i < 7; i++) FX.sparkle(ctx, r.range(70, W - 70), r.range(380, 950), 28 * popU(t, V('relief', 'just') + i * 0.07, 0.3), t + i);
      flash = 0.2 * Math.exp(-Math.pow((t - (a + 0.1)) * 7, 2));
    } else if (name === 'scrub') { // two-shot: he scrubs a pan with joy, she watches, smug
      const S = room(W, H_, t, a, b, 'two');
      const sc = Math.sin(t * 14) * 0.15;
      const bd = HE(S, { arms: [[1.0, 0.0, 0.9], [1.0 + sc, 0.05, 1.0]], head: { yaw: 0.05, pitch: -0.15, tilt: 0.1 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.5 } });
      pan(S, add(bd.hands[0].p, [0.08, 0.02, 0.06]), 0.1); sponge(S, add(bd.hands[1].p, [0, 0.02, 0.05]));
      const g = SHE(S, { arms: POSE.clasp, head: { yaw: -0.45, tilt: -0.1 }, face: { look: [-0.6, 0], lids: 0.45, mouth: 'smile', brows: -0.25 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      const pp = S.proj(bd.hands[0].p); soap(ctx, pp[0] + 40, pp[1] - 20, t, ramp(t, a + 0.1, 0.4));
      const hp = S.proj(g.head); smug(ctx, hp[0] + 100, hp[1] - 110, t, popU(t, V('twist', 'happy'), 0.3));
    } else if (name === 'dries') { // him close: drying a plate until it sparkles
      const S = room(W, H_, t, a, b, [[-0.62, 1.55, 1.5], [-0.62, 1.42, -0.42], [-0.62, 1.56, 1.25], [-0.62, 1.44, -0.42]]);
      const sw = Math.sin(t * 10) * 0.2;
      const bd = HE(S, { yaw: 0.05, arms: [[1.15, 0.05, 0.75], [1.1 + sw, 0.1, 0.8]], head: { yaw: 0.0, tilt: -0.1 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.5 } });
      const pc = add(midHands(bd), [0, 0.06, 0.08]); plate(S, pc);
      S.rbox((p) => add(p, add(bd.hands[1].p, [0, 0.0, 0.04])), 0.07, 0.09, 0.02, [236, 120, 150], { bevel: 0.6, bias: -0.6 });
      S.render(ctx, W, H_, { dof: 0.22 });
      const pp = S.proj(pc); const r = H.rng(3); for (let i = 0; i < 4; i++) FX.sparkle(ctx, pp[0] + r.range(-110, 110), pp[1] + r.range(-90, 60), 24 * popU(t, V('twist', 'dries') + i * 0.1, 0.3), t * 3 + i);
    } else { // the closer: her, smug; he hums in the background
      const S = room(W, H_, t, a, b, [[0.66, 1.6, 1.25], [0.6, 1.5, -0.42], [0.66, 1.6, 1.0], [0.6, 1.52, -0.42]]);
      HE(S, { arms: [[1.0, 0.0, 0.9], [1.0 + Math.sin(t * 14) * 0.15, 0.05, 1.0]], head: { yaw: 0.05, pitch: -0.15 }, face: { eyes: 'happy', mouth: 'smile' } });
      const g = SHE(S, { arms: POSE.clasp, head: { yaw: 0.0, tilt: -0.12 }, face: { look: [0, 0], lids: 0.5, mouth: 'smile', brows: -0.3, blush: 0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); smug(ctx, hp[0] + 180, hp[1] - 160, t, popU(t, V('close', 'works'), 0.3));
      flash = 0.15 * Math.exp(-Math.pow((t - V('close', 'time')) * 7, 2));
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    for (let i = 0; i < 4; i++) k.play('thud', V('hook', 'heart') + i * 0.35, { f: 70, gain: 0.35, minor: true }); // heartbeat
    k.tone(V('talk', 'talk'), { f: [[0, 220], [0.8, 196]], type: 'sawtooth', dur: 0.9, gain: 0.08, filter: 'lowpass', f2: 600 });
    k.play('riser', V('panic', 'instantly'), { dur: 1.2, gain: 0.35 }); k.play('glitch', V('panic', 'replays'), { gain: 0.35 });
    k.play('success', V('list', 'remembered'), { f: 'G5', gain: 0.35 }); k.play('success', V('list', 'remembered', 2), { f: 'A5', gain: 0.35 });
    nopeSound(k, V('list', 'oh'));
    k.play('ding', V('says', 'dishes'), { f: 'C6', gain: 0.4 });
    twistSound(k, V('relief', 'the')); k.play('powerup', V('relief', 'just'), { gain: 0.4 });
    for (let i = 0; i < 6; i++) k.play('pop', V('twist', 'happy') + i * 0.18, { f: 1100 + i * 90, gain: 0.25, minor: true }); // soap bubbles
    k.play('sparkle', V('twist', 'dries'), { gain: 0.5 });
    k.play('sparkle', V('close', 'works'), { gain: 0.5 }); k.play('stamp', V('close', 'time'), { gain: 0.45 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
