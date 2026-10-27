  // ==================== 0011 "No spoilers." : a sarcastic couple reel ====================
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
    ['hook', 0], ['she', V('she', 'she') - 0.15], ['rule', V('rule', 'his') - 0.15], ['burst', V('burst', "she's") - 0.15], ['gasp', V('burst', 'every') - 0.15],
    ['ears', V('ears', 'he') - 0.15], ['guess', V('guess', 'finally') - 0.15], ['butler', V('guess', 'the') - 0.15], ['shock', V('shock', 'she') - 0.15],
    ['close', V('close', 'your') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'every'), [['EVERY', 'COUPLE', 'HAS', 'ONE'], ['PERSON', 'WHO', "CAN'T"], ['KEEP', 'A', K('SECRET.')]]],
    [V('she', 'she'), [['SHE', K('FINISHED')], ['THE', 'BOOK.']]],
    [V('she', "he's"), [["HE'S", 'STILL', 'ON'], [K('CHAPTER'), K('TWO.')]]],
    [V('rule', 'his'), [['HIS', 'ONE', 'RULE:']]],
    [V('rule', 'no'), [['NO', K('SPOILERS.')]]],
    [V('burst', "she's"), [["SHE'S", K('BURSTING')], ['AT', 'THE', 'SEAMS.']]],
    [V('burst', 'every'), [['EVERY', 'PAGE'], ['HE', K('TURNS,')]]],
    [V('burst', 'she'), [['SHE', K('GASPS.')]]],
    [V('ears', 'he'), [['HE', 'READS', 'THE'], [K('NEXT'), 'LINE.']]],
    [V('ears', 'she'), [['SHE', 'COVERS'], ['HER', K('MOUTH.')]]],
    [V('guess', 'finally'), [['FINALLY', 'HE', 'SAYS,']]],
    [V('guess', 'let'), [['"LET', 'ME', K('GUESS.')]]],
    [V('guess', 'the'), [['THE', K('BUTLER')], ['DID', 'IT."']]],
    [V('shock', 'she'), [['SHE', K('FREEZES.')]]],
    [V('shock', 'how'), [[K('"HOW?"')]]],
    [V('close', 'your'), [['"YOUR', K('FACE')], ['TOLD', 'ME."']]],
  ];
  const caps = makeCaps(CAPS);

  const cover = (col) => (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,0.85)'; c.fillRect(w * 0.12, h * 0.12, w * 0.76, h * 0.08); c.strokeStyle = '#ffd23f'; c.lineWidth = w * 0.06; c.beginPath(); c.arc(w * 0.45, h * 0.52, w * 0.2, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.moveTo(w * 0.6, h * 0.64); c.lineTo(w * 0.76, h * 0.78); c.stroke(); };
  const book = (S, c, col, tilt = -0.35, yaw = 0) => S.rbox((p) => add(rotY(rotX(p, tilt), yaw), c), 0.11, 0.15, 0.025, [240, 232, 214], { bevel: 0.2, bias: -0.45, paint: cover(col) });
  const READ = [[0.85, 0.0, 1.0], [0.85, 0.0, 1.0]];
  const reader = (bd, S, col = [60, 80, 140]) => book(S, add(midHands(bd), [0, 0.05, 0.06]), col, 0.55);
  const noSpoil = (ctx, x, y, u) => { if (!card(ctx, x, y, 300, 110, u, '#fff8ec', -0.05)) return; label(ctx, 'NO SPOILERS', 0, 2, 40, '#1c1a22'); ctx.strokeStyle = '#ec3a32'; ctx.lineWidth = 10; ctx.strokeRect(-140, -45, 280, 90); ctx.restore(); };
  const bowtie = (ctx, x, y, s, u) => { if (!card(ctx, x, y, 200, 160, u, '#fff8ec', 0.06)) return; ctx.scale(s, s); ctx.fillStyle = '#1c1a22'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -32); ctx.lineTo(-60, 32); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(60, -32); ctx.lineTo(60, 32); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: he reads, she hugs a finished book, fidgeting
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      const bd = HE(S, { arms: READ, head: { yaw: 0.05, pitch: -0.15 }, face: { look: [0, -0.4], mouth: 'flat' } }); reader(bd, S);
      const g = SHE(S, { arms: POSE.hug, head: { yaw: -0.45, tilt: wave(t, 5, 0.06) }, face: { eyes: 'wide', look: [-0.6, 0], mouth: 'flat', brows: 0.3 } });
      book(S, add(midHands(g), [0, -0.06, 0.1]), [190, 60, 70], 0.1);
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'she') { // two-shot: THE END vs chapter two
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, { arms: READ, head: { yaw: 0.05, pitch: -0.15 }, face: { look: [0, -0.4], mouth: 'flat' } }); reader(bd, S);
      const g = SHE(S, { arms: POSE.hug, head: { yaw: -0.4, tilt: 0.1 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.4 } });
      book(S, add(midHands(g), [0, -0.06, 0.1]), [190, 60, 70], 0.1);
      S.render(ctx, W, H_, { dof: 0.28 });
      if (card(ctx, 540, 450, 220, 80, popU(t, V('she', 'book'), 0.3), '#1c1a2a', 0.05)) { label(ctx, 'THE END', 0, 2, 38, '#ffd23f'); ctx.restore(); }
      if (card(ctx, 180, 450, 200, 80, popU(t, V('she', 'chapter'), 0.3), '#fff8ec', -0.05)) { label(ctx, 'CH. 2', 0, 2, 38, '#1c1a22'); ctx.restore(); }
    } else if (name === 'rule') { // him: one finger up, the rule
      const S = room(W, H_, t, a, b, 'him');
      HE(S, { arms: [[0.35, 0.18, 0.7], UP], head: { yaw: 0.3, tilt: 0.06 }, face: { look: [0.5, 0], lids: 0.2, mouth: 'flat', brows: -0.5 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      noSpoil(ctx, 200, 950, popU(t, V('rule', 'spoilers'), 0.3));
    } else if (name === 'burst') { // her: about to explode
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: READ, head: { yaw: 0.05, pitch: -0.15 } });
      const g = SHE(S, { arms: POSE.hug, head: { yaw: -0.1 + wave(t, 37, 0.03), tilt: wave(t, 29, 0.04) }, face: { eyes: 'wide', look: [-0.3, 0], mouth: 'flat', brows: 0.4, blush: 0.8 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); FX.speed(ctx, W, H_, hp[0], hp[1], 0.5, t); FX.sweat(ctx, hp[0] + 170, hp[1] - 140, 1.4 * popU(t, V('burst', 'seams'), 0.3));
    } else if (name === 'gasp') { // two-shot: page turns, she gasps every time
      const S = room(W, H_, t, a, b, 'two');
      const gs = t >= V('burst', 'gasps');
      const bd = HE(S, { arms: READ, head: { yaw: gs ? 0.35 : 0.05, pitch: -0.15 }, face: { look: [gs ? 0.6 : 0, -0.3], lids: gs ? 0.45 : 0, mouth: 'flat', brows: gs ? -0.3 : 0 } }); reader(bd, S);
      SHE(S, { arms: gs ? POSE.cheeks : POSE.hug, head: { yaw: -0.4, pitch: 0.05 }, face: { eyes: gs ? 'wide' : 'open', look: [-0.6, -0.2], mouth: gs ? 'o' : 'flat', brows: 0.5 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      const tp = S.proj(add(midHands(bd), [0, 0.2, 0.05])); FX.dots(ctx, [[tp[0] - 40, tp[1]], [tp[0] + 10, tp[1] - 50], [tp[0] + 60, tp[1]]], ramp(t, V('burst', 'turns'), 0.35));
      FX.qmark(ctx, 560, 450, 0.8 * popU(t, V('burst', 'gasps'), 0.3), '!');
    } else if (name === 'ears') { // two-shot: he reads on, she clamps her mouth shut
      const S = room(W, H_, t, a, b, [[0, 1.6, 2.25], [0, 1.4, -0.4], [0, 1.6, 2.0], [0, 1.43, -0.4]]);
      const cv = t >= V('ears', 'covers');
      const bd = HE(S, { arms: READ, head: { yaw: 0.05, pitch: -0.15 }, face: { look: [0.5, -0.4], lids: 0.4, mouth: 'flat' } }); reader(bd, S);
      SHE(S, { arms: cv ? [[1.3, 0.05, 2.1], [1.3, 0.05, 2.1]] : POSE.hug, head: { yaw: -0.35, tilt: 0.08 }, face: { eyes: 'wide', look: [-0.6, -0.2], mouth: 'flat', brows: 0.55, blush: 0.6 } });
      S.render(ctx, W, H_, { dof: 0.25 });
    } else if (name === 'guess') { // him: book down, eyebrow up
      const S = room(W, H_, t, a, b, 'him');
      const lt = t >= V('guess', 'let');
      HE(S, { arms: lt ? POSE.clasp : READ, head: { yaw: 0.4, tilt: lt ? -0.1 : 0 }, face: { look: [0.6, 0], lids: 0.45, mouth: 'smile', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
    } else if (name === 'butler') { // two-shot: the guess lands
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, { arms: POSE.clasp, head: { yaw: 0.4, tilt: -0.1 }, face: { look: [0.6, 0], lids: 0.45, mouth: 'smile', brows: -0.3 } });
      SHE(S, { arms: POSE.hug, head: { yaw: -0.4 }, face: { eyes: 'wide', look: [-0.6, 0], mouth: 'o', brows: 0.4 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      bowtie(ctx, W / 2, 470, 1, popU(t, V('guess', 'butler'), 0.35));
    } else if (name === 'shock') { // her: frozen, how?!
      const S = room(W, H_, t, a, b, [[0.66, 1.6, 1.0], [0.62, 1.56, -0.42], [0.64, 1.6, 0.8], [0.62, 1.57, -0.42]]);
      HE(S, { head: { yaw: 0.45 } });
      const how = t >= V('shock', 'how');
      const g = SHE(S, { arms: how ? POSE.cheeks : POSE.hug, head: { yaw: -0.05, pitch: 0.05 }, face: { eyes: 'wide', look: [0, 0], mouth: how ? 'open' : 'o', brows: 0.6 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      FX.speed(ctx, W, H_, W / 2, 620, H.clamp(1 - (t - V('shock', 'freezes')) / 0.7), t);
      FX.qmark(ctx, 600, 440, popU(t, V('shock', 'how'), 0.3), '?!');
      flash = 0.2 * Math.exp(-Math.pow((t - V('shock', 'how')) * 7, 2));
    } else { // the closer: he points at her face, smug
      const S = room(W, H_, t, a, b, [[-0.1, 1.58, 2.45], [0, 1.4, -0.42], [-0.1, 1.6, 2.15], [0, 1.43, -0.42]]);
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], PT], head: { yaw: 0.25, tilt: -0.12 }, face: { look: [0.3, 0], lids: 0.5, mouth: 'smile', brows: -0.3 } });
      const g = SHE(S, { arms: POSE.cheeks, head: { yaw: -0.4, tilt: 0.1 }, face: { eyes: 'wide', look: [-0.6, 0], mouth: 'o', brows: 0.5, blush: 0.8 } });
      S.render(ctx, W, H_, { dof: 0.25 });
      const hp = S.proj(bd.head); smug(ctx, hp[0] - 150, hp[1] - 140, t, popU(t, V('close', 'face'), 0.3));
      const fp = S.proj(g.head); FX.ring(ctx, fp[0], fp[1], 115, '#ffd23f', H.clamp((t - V('close', 'face')) / 0.45), null);
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    k.play('paper', V('she', 'book'), { gain: 0.4 }); k.play('ding', V('she', 'book') + 0.1, { f: 'G5', gain: 0.3 });
    k.play('stamp', V('rule', 'spoilers'), { gain: 0.55 });
    k.tone(V('burst', 'bursting'), { f: [[0, 300], [1.2, 900]], type: 'square', dur: 1.3, gain: 0.04, filter: 'lowpass', f2: 1500 }); // pressure rising
    k.play('paper', V('burst', 'turns'), { gain: 0.45 }); k.play('jump', V('burst', 'gasps'), { gain: 0.5 });
    k.play('paper', V('ears', 'next'), { gain: 0.4 }); k.play('tock', V('ears', 'mouth'), { gain: 0.3 });
    k.play('select', V('guess', 'guess'), { gain: 0.35 });
    twistSound(k, V('guess', 'butler'));
    k.play('glitch', V('shock', 'freezes'), { gain: 0.35 }); k.play('impact', V('shock', 'how'), { gain: 0.5 });
    k.play('sparkle', V('close', 'face'), { gain: 0.5 }); k.play('stamp', V('close', 'me'), { gain: 0.45 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
