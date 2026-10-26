  // ==================== 0003 "Five more minutes." : a sarcastic couple reel ====================
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
    ['hook', 0], ['ago', V('ago', 'forty') - 0.15], ['wait', V('wait', 'shoes') - 0.15], ['gaming', V('wait', "he's") - 0.15], ['grab', V('grab', 'so') - 0.15],
    ['round', V('round', 'one') - 0.15], ['score', V('round', 'then', 2) - 0.15], ['ready', V('ready', 'now') - 0.15], ['twist', V('twist', 'and') - 0.15],
    ['close', V('close', "who's") - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'pov'), [['POV:', 'HE', 'SAID'], [K('FIVE'), 'MORE', 'MINUTES.']]],
    [V('ago', 'forty'), [[K('FORTY'), 'MINUTES'], ['AGO.']]],
    [V('wait', 'shoes'), [['SHOES', 'ON.'], [K('JACKET'), 'ON.']]],
    [V('wait', 'keys'), [[K('KEYS'), 'IN', 'HAND.']]],
    [V('wait', "he's"), [["HE'S", 'STILL'], [K('GAMING.')]]],
    [V('grab', 'so'), [['SO', 'SHE', 'GRABS'], ['THE', K('CONTROLLER,')]]],
    [V('grab', 'just'), [['JUST', 'TO', 'SHOW', 'HIM'], ['HOW', K('SILLY'), 'IT', 'IS.']]],
    [V('round', 'one'), [['ONE', K('ROUND.')]]],
    [V('round', 'then'), [['THEN', K('ANOTHER.')]]],
    [V('round', 'then', 2), [['THEN', 'SHE', 'BEATS'], ['HIS', K('HIGH'), K('SCORE.')]]],
    [V('ready', 'now'), [["NOW", "HE'S", 'THE', 'ONE'], ['IN', 'HIS', K('SHOES,')]]],
    [V('ready', 'keys'), [[K('KEYS'), 'IN', 'HAND.']]],
    [V('twist', 'and'), [['AND', 'SHE', 'SAYS...']]],
    [V('twist', 'five'), [['"FIVE', 'MORE'], [K('MINUTES."')]]],
    [V('close', "who's"), [["WHO'S", K('ADDICTED')], ['NOW?']]],
  ];
  const caps = makeCaps(CAPS);

  const JACKET = [70, 112, 196], HIS_JACKET = [72, 130, 96];
  // a game controller held in both hands
  const padTop = (c, w, h) => { c.fillStyle = '#2a2a32'; c.fillRect(0, 0, w, h); [['#e8483a', 0.78, 0.35], ['#58b84a', 0.86, 0.6], ['#3d8bf2', 0.7, 0.6], ['#ffd23f', 0.78, 0.82]].forEach(([col, x, y]) => { c.fillStyle = col; c.beginPath(); c.arc(w * x, h * y, w * 0.045, 0, Math.PI * 2); c.fill(); }); c.fillStyle = '#8a8a96'; c.fillRect(w * 0.14, h * 0.5, w * 0.16, h * 0.14); c.fillRect(w * 0.19, h * 0.32, w * 0.06, h * 0.5); };
  const pad = (S, c, yaw = 0) => { const T = (p) => add(rotY(rotX(p, -0.6), yaw), c); S.rbox(T, 0.11, 0.022, 0.05, [44, 44, 52], { bevel: 0.6, bias: -0.35, topPaint: padTop }); [-1, 1].forEach((sd) => S.ball(T([sd * 0.09, -0.005, 0.035]), 0.035, [44, 44, 52], { bias: -0.34, rim: false })); };
  // game light flickering on the faces
  const glow = (ctx, W, H_, t, k = 1) => { ctx.save(); ctx.globalCompositeOperation = 'screen'; const hue = (t * 90) % 360; ctx.fillStyle = `hsla(${hue},80%,55%,${0.1 * k * (0.7 + 0.3 * Math.sin(t * 13))})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const clock = (ctx, x, y, r, t, u) => { if (!card(ctx, x, y, r * 2.2, r * 2.2, u, '#fff8ec')) return; ctx.strokeStyle = '#1c1a22'; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.stroke(); ctx.lineCap = 'round'; const m = t * 6, h = t * 0.5; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(h) * r * 0.4, -Math.cos(h) * r * 0.4); ctx.stroke(); ctx.strokeStyle = '#e8483a'; ctx.lineWidth = r * 0.07; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(m) * r * 0.65, -Math.cos(m) * r * 0.65); ctx.stroke(); ctx.restore(); };
  const keys = (ctx, x, y, s, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); ctx.rotate(-0.4); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.fillStyle = '#f2c14a'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(14, -7, 52, 14); ctx.fillRect(50, 4, 8, 14); ctx.fillRect(38, 4, 8, 10); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#7a5a20'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
  const banner = (ctx, x, y, txt, sub, u, col = '#ffd23f') => { const sc = sub ? 1 : 0.75; if (!card(ctx, x, y, 360 * sc, 130 * sc, u, '#1c1a2a', -0.05)) return; label(ctx, txt, 0, sub ? -18 : 0, 46 * sc, col); if (sub) label(ctx, sub, 0, 34, 26, '#ffffff', 800); ctx.restore(); };
  const gamer = (o) => ({ lean: 0.18, arms: [[1.05, 0.05, 1.15], [1.05, 0.05, 1.15]], head: { yaw: 0.05, pitch: -0.05 }, face: { eyes: 'wide', look: [0, 0], mouth: 'o', brows: -0.3 }, ...o });

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: he is glued to the game, she waits in her jacket
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      const bd = HE(S, gamer({}));
      pad(S, add(midHands(bd), [0, 0.04, 0.03]));
      SHE(S, { shirt: JACKET, arms: POSE.clasp, head: { yaw: -0.45 }, face: { look: [-0.6, 0], lids: 0.45, mouth: 'flat', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.3 });
      glow(ctx, W, H_, t, 0.6);
    } else if (name === 'ago') { // her: dead-eyed, the clock spinning
      const S = room(W, H_, t, a, b, 'her');
      HE(S, gamer({}));
      const g = SHE(S, { shirt: JACKET, arms: POSE.clasp, head: { yaw: -0.05, tilt: 0.1 }, face: { look: [0, 0], lids: 0.55, mouth: 'flat', brows: -0.2 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      clock(ctx, 130, 930, 80, (t - a) * 6, popU(t, V('ago', 'forty'), 0.3));
    } else if (name === 'wait') { // two-shot: shoes, jacket, keys
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, gamer({}));
      pad(S, add(midHands(bd), [0, 0.04, 0.03]));
      const kk = t >= V('wait', 'keys');
      const g = SHE(S, { shirt: JACKET, arms: kk ? [[0.5, 0.05, 0.9], UP] : POSE.clasp, head: { yaw: -0.25, tilt: 0.08 }, face: { look: [-0.4, 0], lids: 0.35, mouth: 'flat', brows: -0.35 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      const hp = S.proj(g.hands[1].p); keys(ctx, hp[0] + 10, hp[1] - 40, 1.3, popU(t, V('wait', 'keys'), 0.3));
      const jp = S.proj(add(g.head, [0, -0.4, 0])); FX.ring(ctx, jp[0], jp[1], 90, '#58b84a', H.clamp((t - V('wait', 'jacket')) / 0.45), 'tick');
      glow(ctx, W, H_, t, 0.5);
    } else if (name === 'gaming') { // him: lost in the game
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, gamer({ head: { yaw: 0.0, pitch: 0.0, tilt: wave(t, 7, 0.08) }, face: { eyes: 'wide', look: [0.1 * Math.sin(t * 9), 0], mouth: 'open', brows: -0.45 } }));
      pad(S, add(midHands(bd), [0, 0.04, 0.03]));
      S.render(ctx, W, H_, { dof: 0.22 });
      glow(ctx, W, H_, t, 1.2);
      FX.speed(ctx, W, H_, W / 2, 560, 0.35, t);
    } else if (name === 'grab') { // two-shot: the controller changes hands
      const S = room(W, H_, t, a, b, 'two');
      const gr = ramp(t, V('grab', 'grabs'), 0.3);
      const bd = HE(S, { lean: 0.1 * (1 - gr), arms: gr > 0.5 ? POSE.shrug : POSE.phone, head: { yaw: 0.05 + 0.4 * gr }, face: { eyes: gr > 0.5 ? 'wide' : 'wide', look: [0.6 * gr, 0], mouth: 'o', brows: gr > 0.5 ? 0.5 : -0.3 } });
      const g = SHE(S, { shirt: JACKET, arms: gr > 0.5 ? POSE.phone : [[0.5, 0.05, 0.9], [0.4 + 1.0 * gr, 0.18 + 0.6 * gr, 0.5]], head: { yaw: -0.35 + 0.3 * gr, tilt: 0.1 }, face: { look: [-0.4 * (1 - gr), -0.3 * gr], lids: 0.35, mouth: 'smile', brows: -0.3 } });
      pad(S, add(midHands(gr > 0.5 ? g : bd), [0, 0.04, 0.03]));
      S.render(ctx, W, H_, { dof: 0.28 });
      if (t > V('grab', 'silly')) { const hp = S.proj(g.head); smug(ctx, hp[0] + 120, hp[1] - 120, t, popU(t, V('grab', 'silly'), 0.3)); }
    } else if (name === 'round') { // her: one round turns into focus mode
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: POSE.clasp, head: { yaw: 0.5 }, face: { look: [0.6, -0.2], mouth: 'flat', brows: 0.2 } });
      const another = t >= V('round', 'then');
      const g = SHE(S, gamer({ shirt: JACKET, head: { yaw: -0.05, tilt: wave(t, 6, 0.07) }, face: { eyes: another ? 'wide' : 'open', look: [0.1 * Math.sin(t * 8), 0], lids: another ? 0 : 0.2, mouth: another ? 'open' : 'flat', brows: -0.45 } }));
      pad(S, add(midHands(g), [0, 0.04, 0.03]));
      S.render(ctx, W, H_, { dof: 0.22 });
      glow(ctx, W, H_, t, 1.1);
      banner(ctx, 170, 975, another ? 'ROUND 2' : 'ROUND 1', '', popU(t, another ? V('round', 'then') : V('round', 'one'), 0.3));
    } else if (name === 'score') { // two-shot: she cheers, he gapes
      const S = room(W, H_, t, a, b, 'two');
      const ch = t >= V('round', 'score');
      HE(S, { arms: ch ? POSE.head : POSE.clasp, head: { yaw: 0.45 }, face: { eyes: 'wide', look: [0.6, 0], mouth: 'o', brows: 0.5 } });
      const g = SHE(S, ch ? { shirt: JACKET, arms: POSE.cheer, head: { yaw: -0.1, pitch: 0.1 }, face: { eyes: 'happy', mouth: 'open', blush: 0.5 } } : gamer({ shirt: JACKET }));
      if (!ch) pad(S, add(midHands(g), [0, 0.04, 0.03]));
      S.render(ctx, W, H_, { dof: 0.28 });
      glow(ctx, W, H_, t, 0.6);
      banner(ctx, W / 2, 470, 'NEW HIGH SCORE', 'PLAYER 2 WINS', popU(t, V('round', 'score'), 0.35));
      const r = H.rng(3); for (let i = 0; i < 6; i++) FX.sparkle(ctx, r.range(80, W - 80), r.range(380, 900), 26 * popU(t, V('round', 'score') + i * 0.08, 0.3), t * 2 + i);
      flash = 0.2 * Math.exp(-Math.pow((t - V('round', 'score')) * 7, 2));
    } else if (name === 'ready') { // him: jacket on, keys up, hopeful
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { shirt: HIS_JACKET, arms: [[0.35, 0.18, 0.7], UP], head: { yaw: 0.35, tilt: -0.08 }, face: { look: [0.6, 0], mouth: 'smile', brows: 0.35 } });
      SHE(S, gamer({ shirt: JACKET }));
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.hands[1].p); keys(ctx, hp[0] + 10, hp[1] - 40, 1.4, popU(t, V('ready', 'keys'), 0.3));
    } else if (name === 'twist') { // her: eyes never leave the screen
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { shirt: HIS_JACKET, head: { yaw: 0.5 }, face: { look: [0.6, 0], mouth: 'smile' } });
      const g = SHE(S, gamer({ shirt: JACKET, head: { yaw: -0.02, tilt: 0.06 }, face: { eyes: 'open', look: [0, 0], lids: 0.4, mouth: t >= V('twist', 'five') ? 'flat' : 'flat', brows: -0.4 } }));
      pad(S, add(midHands(g), [0, 0.04, 0.03]));
      S.render(ctx, W, H_, { dof: 0.22 });
      glow(ctx, W, H_, t, 1.1);
      const u = popU(t, V('twist', 'five'), 0.3); if (card(ctx, 130, 975, 180, 100, u, '#1c1a2a', 0.06)) { label(ctx, '5 MIN', 0, 0, 46, '#ffd23f'); ctx.restore(); }
      flash = 0.15 * Math.exp(-Math.pow((t - V('twist', 'five')) * 7, 2));
    } else { // the closer: him, smug, arms folded, jacket still on
      const S = room(W, H_, t, a, b, [[-0.35, 1.58, 2.0], [-0.4, 1.4, -0.42], [-0.38, 1.6, 1.7], [-0.42, 1.45, -0.42]]);
      const bd = HE(S, { shirt: HIS_JACKET, arms: POSE.clasp, head: { yaw: 0.05, tilt: -0.12 }, face: { eyes: 'open', look: [0, 0], lids: 0.5, mouth: 'smile', brows: -0.3 } });
      const g = SHE(S, gamer({ shirt: JACKET }));
      pad(S, add(midHands(g), [0, 0.04, 0.03]));
      S.render(ctx, W, H_, { dof: 0.25 });
      glow(ctx, W, H_, t, 0.5);
      const hp = S.proj(bd.head); smug(ctx, hp[0] - 170, hp[1] - 150, t, popU(t, V('close', 'addicted'), 0.3));
      flash = 0.18 * Math.exp(-Math.pow((t - V('close', "who's")) * 7, 2));
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    const blipRun = (t0, n) => { for (let i = 0; i < n; i++) k.play('blip', t0 + i * 0.13, { f: 600 + (i % 4) * 200, gain: 0.22, minor: true }); };
    blipRun(0.3, 10);
    k.play('tick', V('ago', 'forty'), { f: 4000, gain: 0.3 }); k.play('tock', V('ago', 'minutes'), { gain: 0.3 }); k.play('tick', V('ago', 'ago'), { f: 4000, gain: 0.3 });
    k.play('success', V('wait', 'jacket'), { f: 'G5', gain: 0.3 }); k.play('coin', V('wait', 'keys'), { gain: 0.4 });
    blipRun(V('wait', "he's"), 12);
    k.play('swish', V('grab', 'grabs'), { gain: 0.55 }); k.play('jump', V('grab', 'grabs') + 0.1, { gain: 0.4 });
    k.play('select', V('round', 'one'), { gain: 0.4 }); k.play('select', V('round', 'then'), { gain: 0.4 }); blipRun(V('round', 'one'), 14);
    k.play('powerup', V('round', 'score'), { gain: 0.55 }); k.play('success', V('round', 'score') + 0.1, { f: 'C6', gain: 0.5 });
    k.play('coin', V('ready', 'keys'), { gain: 0.4 });
    twistSound(k, V('twist', 'five')); blipRun(V('twist', 'five'), 8);
    k.play('sparkle', V('close', 'addicted'), { gain: 0.55 }); k.play('stamp', V('close', 'now'), { gain: 0.45 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
