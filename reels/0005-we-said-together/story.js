  // ==================== 0005 "We said together." : a sarcastic couple reel ====================
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
    ['hook', 0], ['deal', V('deal', 'we') - 0.15], ['tonight', V('tonight', 'tonight') - 0.15], ['gasp', V('gasp', 'she') - 0.15], ['pause', V('pause', 'he') - 0.15],
    ['deny', V('deny', 'she') - 0.15], ['line', V('line', 'then') - 0.15], ['confess', V('confess', 'okay') - 0.15], ['twist', V('twist', 'he') - 0.15],
    ['close', V('close', 'match') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'nobody'), [['NOBODY', 'TALKS', 'ABOUT'], ['THIS', 'KIND', 'OF'], [K('BETRAYAL.')]]],
    [V('deal', 'we'), [["WE'D", 'WATCH', 'IT'], [K('TOGETHER.')]]],
    [V('deal', 'every'), [['EVERY', K('EPISODE.')]]],
    [V('deal', 'no'), [['NO', K('CHEATING.')]]],
    [V('tonight', 'tonight'), [['TONIGHT,'], ['EPISODE', K('FIVE.')]]],
    [V('gasp', 'she'), [['SHE', K('GASPS.')]]],
    [V('gasp', 'right'), [['RIGHT', K('BEFORE')], ['THE', 'BIG', 'TWIST.']]],
    [V('pause', 'he'), [['HE', 'HITS', K('PAUSE.')]]],
    [V('pause', "you've"), [['"YOU\'VE', K('SEEN'), 'THIS."']]],
    [V('deny', 'she'), [['SHE', K('SWEARS')], ["SHE", "HASN'T."]]],
    [V('line', 'then'), [['THEN', 'SHE', K('WHISPERS')], ['THE', 'NEXT', 'LINE,']]],
    [V('line', 'word'), [[K('WORD'), 'FOR', K('WORD.')]]],
    [V('confess', 'okay'), [['"OKAY.', K('TWICE.')]]],
    [V('confess', 'i'), [['I', 'WATCHED', 'IT'], [K('TWICE."')]]],
    [V('twist', 'he'), [['HE', K('SIGHS.')]]],
    [V('twist', 'me'), [['"ME', 'TOO.']]],
    [V('twist', 'three'), [[K('THREE'), 'TIMES."']]],
    [V('close', 'match'), [[K('MATCH'), 'MADE'], ['IN', 'HEAVEN.']]],
  ];
  const caps = makeCaps(CAPS);

  // the TV is behind the camera: its light flickers on them
  const tvLight = (ctx, W, H_, t, k = 1) => { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = `rgba(90,140,255,${0.08 * k * (0.75 + 0.25 * Math.sin(t * 7) * Math.sin(t * 3.1))})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const tag = (ctx, x, y, txt, u, bg = '#1c1a2a', col = '#ffd23f', rot = -0.06) => { if (!card(ctx, x, y, 40 + txt.length * 30, 96, u, bg, rot)) return; label(ctx, txt, 0, 2, 50, col); ctx.restore(); };
  const pauseIcon = (ctx, x, y, u) => { if (!card(ctx, x, y, 130, 130, u, 'rgba(28,26,42,0.92)')) return; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(-30, -36, 20, 72, 6); ctx.roundRect(10, -36, 20, 72, 6); ctx.fill(); ctx.restore(); };
  const WATCH = { head: { pitch: 0.02 }, face: { look: [0, 0.05] } };

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: movie night, all innocent
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      HE(S, { arms: POSE.clasp, head: { yaw: 0.05 }, face: { look: [0.1, 0.05], mouth: 'smile' } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.05 }, face: { look: [-0.1, 0.05], mouth: 'smile' } });
      popcorn(S, [0.1, 0.4, 1.15], 1.1); remote(S, [-0.4, 0.42, 1.25], [1, 0, 0.3], 1.2);
      S.render(ctx, W, H_, { dof: 0.3 });
      tvLight(ctx, W, H_, t);
    } else if (name === 'deal') { // two-shot: a pinky promise in the middle
      const S = room(W, H_, t, a, b, 'two');
      const pr = ramp(t, V('deal', 'together'), 0.35);
      HE(S, { arms: [[0.35, 0.18, 0.7], [0.5 - 0.3 * pr, 0.05 + 1.2 * pr, 0.9 - 0.75 * pr]], head: { yaw: 0.4 }, face: { look: [0.6, 0], mouth: 'smile', brows: 0.2 } });
      SHE(S, { arms: [[0.5 - 0.3 * pr, 0.05 + 1.2 * pr, 0.9 - 0.75 * pr], [0.35, 0.18, 0.7]], head: { yaw: -0.4 }, face: { look: [-0.6, 0], mouth: 'smile', brows: 0.2 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      const hp = S.proj([0, 0.95, -0.2]); if (t > V('deal', 'together')) FX.sparkle(ctx, hp[0], hp[1] - 30, 30 * popU(t, V('deal', 'together') + 0.3, 0.3), t * 2);
      FX.ring(ctx, W / 2, 470, 90, '#ec3a32', H.clamp((t - V('deal', 'cheating')) / 0.45), 'x');
      tvLight(ctx, W, H_, t);
    } else if (name === 'tonight') { // wide-ish: remote, episode five
      const S = room(W, H_, t, a, b, [[0.1, 1.5, 2.9], [0, 1.1, -0.4], [0.05, 1.5, 2.5], [0, 1.14, -0.4]], { table: true });
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], [1.3, 0.1, 0.4]], ...WATCH });
      remote(S, add(bd.hands[1].p, [0, 0.02, 0.06]), [0, 0, 1], 1.2, -0.4);
      SHE(S, { arms: POSE.clasp, ...WATCH });
      S.render(ctx, W, H_, { dof: 0.28 });
      tag(ctx, W / 2, 470, 'EP 5', popU(t, V('tonight', 'five'), 0.3));
      tvLight(ctx, W, H_, t, 1.3);
    } else if (name === 'gasp') { // her: hands to her face, a beat too early
      const S = room(W, H_, t, a, b, 'her');
      const gp = t >= V('gasp', 'gasps');
      const late = t >= V('gasp', 'right');
      HE(S, { head: { yaw: late ? 0.5 : 0.05 }, face: { look: [late ? 0.6 : 0, 0], lids: late ? 0.4 : 0, mouth: 'flat' } });
      const g = SHE(S, { arms: gp ? POSE.cheeks : POSE.clasp, head: { yaw: 0, pitch: 0.05 }, face: { eyes: gp ? 'wide' : 'open', look: [0, 0.05], mouth: gp ? 'o' : 'smile', brows: gp ? 0.5 : 0 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); FX.qmark(ctx, hp[0] + 200, hp[1] - 150, 0.9 * popU(t, V('gasp', 'gasps'), 0.3), '!');
      tvLight(ctx, W, H_, t, 1.2);
      if (late) FX.ring(ctx, 140, 940, 70, '#ec3a32', H.clamp((t - V('gasp', 'before')) / 0.45), 'x');
    } else if (name === 'pause') { // him: suspicious, remote up
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], [1.5, 0.2, 0.3]], head: { yaw: 0.45, tilt: 0.08 }, face: { look: [0.7, 0], lids: 0.5, mouth: 'flat', brows: -0.5 } });
      remote(S, add(bd.hands[1].p, [0, 0.02, 0.06]), [0, 0, 1], 1.2, -0.4);
      SHE(S, { arms: POSE.head, head: { yaw: -0.2 }, face: { eyes: 'wide', mouth: 'o' } });
      S.render(ctx, W, H_, { dof: 0.22 });
      pauseIcon(ctx, 150, 930, popU(t, V('pause', 'pause'), 0.3));
      flash = 0.12 * Math.exp(-Math.pow((t - V('pause', 'pause')) * 7, 2));
    } else if (name === 'deny') { // her: the most innocent face in history
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { head: { yaw: 0.5 }, face: { look: [0.6, 0], lids: 0.5, mouth: 'flat', brows: -0.4 } });
      const g = SHE(S, { arms: POSE.shrug, head: { yaw: -0.15, tilt: 0.15 }, face: { eyes: 'open', look: [-0.3, 0.2], mouth: 'smile', brows: 0.35, blush: 0.4 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); FX.sweat(ctx, hp[0] + 170, hp[1] - 130, 1.6 * popU(t, V('deny', "hasn't") + 0.05, 0.3));
      const r = H.rng(2); for (let i = 0; i < 3; i++) FX.sparkle(ctx, hp[0] + r.range(-200, 200), hp[1] - r.range(150, 220), 20 * popU(t, V('deny', 'swears') + i * 0.1, 0.3), t + i);
    } else if (name === 'line') { // two-shot: she mouths the next line along with the TV
      const S = room(W, H_, t, a, b, 'two');
      const ww = t >= V('line', 'word');
      HE(S, { lean: 0.03, head: { yaw: 0.45 }, face: { eyes: ww ? 'wide' : 'open', look: [0.6, 0], mouth: ww ? 'o' : 'flat', brows: ww ? 0.5 : -0.3 } });
      SHE(S, { lean: 0.05, arms: [[0.5, 0.05, 0.9], [1.4, 0.05, 1.9]], head: { yaw: 0.0, pitch: 0.05 }, face: { look: [0, 0.05], lids: 0.2, mouth: Math.sin(t * 18) > 0 ? 'o' : 'flat', brows: 0.1 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      bubble(ctx, 520, 470, '"...I am your..."', 1, popU(t, V('line', 'whispers'), 0.3), 30);
      tvLight(ctx, W, H_, t);
      if (ww) FX.speed(ctx, W, H_, 230, 620, H.clamp(1 - (t - V('line', 'word')) / 0.6), t);
    } else if (name === 'confess') { // her: caught, sheepish
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { head: { yaw: 0.5 }, face: { look: [0.6, 0], lids: 0.4, mouth: 'flat' } });
      const tw = t >= V('confess', 'twice');
      const g = SHE(S, { arms: POSE.clasp, head: { yaw: -0.2, tilt: 0.12 }, face: { eyes: tw ? 'happy' : 'open', look: [-0.2, -0.2], mouth: 'smile', brows: 0.4, blush: 0.9 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      tag(ctx, 140, 950, 'x2', popU(t, V('confess', 'twice'), 0.3), '#ec3a32', '#ffffff');
    } else if (name === 'twist') { // him: a long sigh, then the confession
      const S = room(W, H_, t, a, b, 'him');
      const me = t >= V('twist', 'me');
      const bd = HE(S, { arms: me ? POSE.shrug : POSE.clasp, head: { yaw: me ? 0.3 : 0.05, tilt: me ? -0.12 : 0, pitch: me ? 0 : -0.15 }, face: { eyes: me ? 'happy' : 'closed', look: [0.4, 0], mouth: me ? 'smile' : 'flat', brows: me ? 0.35 : 0.2, blush: me ? 0.8 : 0 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      if (!me) { const hp = S.proj(bd.head); FX.buzz(ctx, hp[0] + 40, hp[1] + 160, 0.9, 1); }
      tag(ctx, 590, 950, 'x3', popU(t, V('twist', 'three'), 0.3), '#ec3a32', '#ffffff', 0.08);
      flash = 0.22 * Math.exp(-Math.pow((t - V('twist', 'three')) * 7, 2));
    } else { // the closer: both crack up, hearts
      const S = room(W, H_, t, a, b, [[0.05, 1.5, 2.6], [0, 1.25, -0.4], [0.05, 1.52, 2.2], [0, 1.3, -0.4]]);
      HE(S, { lean: 0.04, arms: POSE.clasp, head: { yaw: 0.45, tilt: 0.15 }, face: { eyes: 'happy', mouth: 'open', blush: 0.6 } });
      SHE(S, { lean: 0.04, arms: POSE.clasp, head: { yaw: -0.45, tilt: -0.15 }, face: { eyes: 'happy', mouth: 'open', blush: 0.8 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      tvLight(ctx, W, H_, t);
      hearts(ctx, W, t, V('close', 'heaven'), 5, 620);
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    k.play('ding', V('deal', 'together') + 0.3, { f: 'E5', gain: 0.35 }); nopeSound(k, V('deal', 'cheating'));
    k.play('select', V('tonight', 'five'), { gain: 0.4 });
    k.play('jump', V('gasp', 'gasps'), { gain: 0.5 }); k.tone(V('gasp', 'gasps'), { f: [[0, 600], [0.2, 900]], type: 'sine', dur: 0.25, gain: 0.12 });
    k.play('click', V('pause', 'pause'), { gain: 0.5 }); k.play('tock', V('pause', 'pause') + 0.05, { gain: 0.3 });
    k.tone(V('deny', 'swears'), { f: [[0, 700], [0.15, 900]], type: 'triangle', dur: 0.2, gain: 0.08, minor: true });
    k.play('glitch', V('line', 'word'), { gain: 0.4 }); k.play('impact', V('line', 'word') + 0.1, { gain: 0.45 });
    k.play('stamp', V('confess', 'twice'), { gain: 0.5 }); k.play('stamp', V('confess', 'twice', 2), { gain: 0.4 });
    k.tone(V('twist', 'sighs'), { f: [[0, 260], [0.7, 150]], type: 'triangle', dur: 0.8, gain: 0.12, filter: 'lowpass', f2: 900 });
    twistSound(k, V('twist', 'three'));
    heartSound(k, V('close', 'heaven'));
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
