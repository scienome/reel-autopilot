  // ==================== 0015 "Two feet away." : a sarcastic couple reel ====================
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
    ['hook', 0], ['smile', V('smile', "she's") - 0.15], ['sus', V('sus', 'he') - 0.15], ['nobody', V('nobody', 'nobody') - 0.15], ['check', V('check', 'then') - 0.15],
    ['it', V('it', 'fortytwo') - 0.15], ['couch', V('couch', 'from') - 0.15], ['reply', V('reply', 'he') - 0.15], ['snort', V('reply', 'she') - 0.15],
    ['close', V('close', 'this') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'be'), [['BE', K('HONEST.')]]],
    [V('hook', 'is'), [['IS', 'THIS', 'YOUR'], [K('RELATIONSHIP?')]]],
    [V('smile', "she's"), [["SHE'S", K('GIGGLING')], ['AT', 'HER', 'PHONE.']]],
    [V('sus', 'he'), [['HE', K('NARROWS')], ['HIS', 'EYES.']]],
    [V('sus', "who's"), [['"WHO\'S', 'MAKING', 'YOU'], [K('LAUGH'), 'LIKE', 'THAT?"']]],
    [V('nobody', 'nobody'), [[K('"NOBODY."')]]],
    [V('nobody', 'giggles'), [[K('GIGGLES'), 'AGAIN.']]],
    [V('check', 'then'), [['THEN', 'HIS', 'PHONE'], [K('BUZZES.')]]],
    [V('check', 'and'), [['AND', K('BUZZES.')]]],
    [V('check', 'and', 2), [['AND', K('BUZZES.')]]],
    [V('it', 'fortytwo'), [[K('FORTY-TWO'), 'MEMES.']]],
    [V('it', 'all'), [['ALL', 'FROM', K('HER.')]]],
    [V('couch', 'from'), [['FROM', K('TWO'), K('FEET')], ['AWAY.']]],
    [V('couch', 'on'), [['ON', 'THE', K('SAME')], ['COUCH.']]],
    [V('reply', 'he'), [['HE', 'SENDS', 'ONE'], [K('BACK.')]]],
    [V('reply', 'she'), [['SHE', 'LAUGHS', 'SO', 'HARD'], ['SHE', K('SNORTS.')]]],
    [V('close', 'this'), [['THIS', 'IS', K('LOVE')], ['NOW,']]],
    [V('close', 'apparently'), [[K('APPARENTLY.')]]],
  ];
  const caps = makeCaps(CAPS);

  const memeScreen = (c, w, h) => { c.fillStyle = '#f4f2f7'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.fillRect(w * 0.1, h * 0.12, w * 0.8, h * 0.4); c.fillStyle = '#1c1a22'; c.beginPath(); c.arc(w * 0.38, h * 0.28, w * 0.06, 0, Math.PI * 2); c.arc(w * 0.62, h * 0.28, w * 0.06, 0, Math.PI * 2); c.fill(); c.lineWidth = w * 0.04; c.strokeStyle = '#1c1a22'; c.beginPath(); c.arc(w * 0.5, h * 0.36, w * 0.14, 0.2, Math.PI - 0.2); c.stroke(); c.fillStyle = '#3d8bf2'; c.beginPath(); c.roundRect(w * 0.3, h * 0.62, w * 0.6, h * 0.1, 18); c.fill(); };
  const notif = (ctx, x, y, n, u) => { if (!card(ctx, x, y, 420, 120, u, '#f2f0f5', -0.03)) return; ctx.fillStyle = '#ec3a32'; ctx.beginPath(); ctx.arc(-150, 0, 38, 0, Math.PI * 2); ctx.fill(); FX.heart(ctx, -150, 4, 46); ctx.font = FONT(900, 34); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#1c1a22'; ctx.fillText(n + ' new memes', -98, -14); ctx.font = FONT(800, 24); ctx.fillStyle = '#7a7484'; ctx.fillText('from: her ♥', -98, 24); ctx.restore(); };
  const badge = (ctx, x, y, n, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.fillStyle = '#ec3a32'; ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill(); ctx.shadowColor = 'transparent'; label(ctx, String(n), 0, 2, 34, '#ffffff'); ctx.restore(); };
  const plane = (ctx, x, y, s, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-24, -20); ctx.lineTo(-12, 0); ctx.lineTo(-24, 20); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#c9d6ea'; ctx.beginPath(); ctx.moveTo(30, 0); ctx.lineTo(-12, 0); ctx.lineTo(-24, 20); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const PH = [[1.0, 0.05, 1.1], [1.0, 0.05, 1.1]];
  const withPhone = (S, d, yaw, screen) => phone(S, add(midHands(d), [0, 0.06, 0.04]), yaw, 1.1, screen);
  const giggle = (t) => ({ eyes: 'happy', mouth: Math.sin(t * 14) > 0 ? 'open' : 'smile', blush: 0.6 });

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: both on their phones
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      const bd = HE(S, { arms: PH, head: { yaw: 0.05, pitch: -0.3 }, face: { look: [0, -0.6], mouth: 'flat' } }); withPhone(S, bd, 0.2);
      const g = SHE(S, { arms: PH, head: { yaw: -0.05, pitch: -0.3, tilt: Math.sin(t * 12) * 0.05 }, face: { ...giggle(t), look: [0, -0.6] } }); withPhone(S, g, -0.2, memeScreen);
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'smile') { // her: giggling at her phone
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: PH, head: { yaw: 0.05, pitch: -0.3 } });
      const g = SHE(S, { arms: PH, head: { yaw: -0.1, pitch: -0.2, tilt: Math.sin(t * 12) * 0.06 }, face: { ...giggle(t), look: [0, -0.6] } }); withPhone(S, g, -0.1, memeScreen);
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); FX.buzz(ctx, hp[0] - 240, hp[1] + 30, 1.2, Math.sin(t * 14) > 0 ? 1 : 0);
    } else if (name === 'sus') { // him: suspicious squint
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { arms: PH, head: { yaw: 0.45, tilt: 0.08 }, face: { look: [0.7, 0], lids: 0.55, mouth: 'flat', brows: -0.55 } });
      SHE(S, { arms: PH, head: { yaw: -0.05, pitch: -0.3 }, face: giggle(t) });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.head); FX.qmark(ctx, hp[0] - 200, hp[1] - 140, 0.8 * popU(t, V('sus', 'laugh'), 0.3), '?', -0.12);
    } else if (name === 'nobody') { // her: totally innocent, then giggles again
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: PH, head: { yaw: 0.45 }, face: { lids: 0.55, brows: -0.5 } });
      const gg = t >= V('nobody', 'giggles');
      const g = SHE(S, { arms: PH, head: { yaw: gg ? -0.1 : -0.4, pitch: gg ? -0.2 : 0, tilt: gg ? Math.sin(t * 12) * 0.06 : 0.1 }, face: gg ? { ...giggle(t), look: [0, -0.6] } : { look: [-0.6, 0.1], mouth: 'smile', brows: 0.35 } }); withPhone(S, g, -0.1, memeScreen);
      S.render(ctx, W, H_, { dof: 0.22 });
      if (!gg) { const hp = S.proj(g.head); FX.sparkle(ctx, hp[0] + 170, hp[1] - 150, 22 * popU(t, V('nobody', 'nobody'), 0.3), t * 2); }
    } else if (name === 'check') { // two-shot: his phone will not stop buzzing
      const S = room(W, H_, t, a, b, 'two');
      const bz = [V('check', 'buzzes'), V('check', 'buzzes', 2), V('check', 'buzzes', 3)];
      const n = bz.filter((x) => t >= x).length;
      const bd = HE(S, { arms: PH, head: { yaw: 0.05 + Math.sin(t * 30) * 0.02 * n, pitch: -0.3 }, face: { eyes: n ? 'wide' : 'open', look: [0, -0.6], mouth: n > 1 ? 'o' : 'flat', brows: 0.3 * n } }); withPhone(S, bd, 0.2);
      const g = SHE(S, { arms: PH, head: { yaw: -0.05, pitch: -0.3 }, face: { look: [-0.2, -0.6], lids: 0.3, mouth: 'smile' } }); withPhone(S, g, -0.2, memeScreen);
      S.render(ctx, W, H_, { dof: 0.28 });
      const pp = S.proj(midHands(bd)); if (n) FX.buzz(ctx, pp[0], pp[1] - 40, 1.4, 1);
      bz.forEach((x, i) => badge(ctx, pp[0] + 85 + i * 66, pp[1] + 30, [3, 17, 42][i], popU(t, x, 0.25)));
    } else if (name === 'it') { // him: the notification
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { arms: PH, head: { yaw: 0.05, pitch: -0.25 }, face: { eyes: 'wide', look: [0, -0.5], mouth: 'o', brows: 0.5 } }); withPhone(S, bd, 0.0, memeScreen);
      S.render(ctx, W, H_, { dof: 0.22 });
      notif(ctx, W / 2, 940, 42, popU(t, V('it', 'fortytwo'), 0.3));
      flash = 0.15 * Math.exp(-Math.pow((t - V('it', 'her')) * 7, 2));
    } else if (name === 'couch') { // wide two-shot: the distance, measured
      const S = room(W, H_, t, a, b, [[0.1, 1.55, 3.2], [0, 1.15, -0.4], [0.05, 1.55, 2.85], [0, 1.18, -0.4]]);
      const bd = HE(S, { arms: PH, head: { yaw: 0.45 }, face: { look: [0.6, 0], lids: 0.3, mouth: 'flat', brows: 0.2 } }); withPhone(S, bd, 0.2);
      const g = SHE(S, { arms: PH, head: { yaw: -0.4, tilt: 0.1 }, face: { look: [-0.6, 0], mouth: 'smile', blush: 0.5 } }); withPhone(S, g, -0.2, memeScreen);
      S.render(ctx, W, H_, { dof: 0.28 });
      const p0 = S.proj(add(bd.head, [0.2, 0.25, 0])), p1 = S.proj(add(g.head, [-0.2, 0.25, 0])), u = ramp(t, V('couch', 'two'), 0.5);
      if (u > 0) { ctx.save(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 6; ctx.lineCap = 'round'; const xm = p0[0] + (p1[0] - p0[0]) * u; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(xm, p1[1]); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p0[0], p0[1] - 16); ctx.lineTo(p0[0], p0[1] + 16); ctx.moveTo(xm, p1[1] - 16); ctx.lineTo(xm, p1[1] + 16); ctx.stroke(); ctx.restore(); }
      if (card(ctx, (p0[0] + p1[0]) / 2, p0[1] - 60, 150, 70, popU(t, V('couch', 'feet'), 0.3), '#1c1a2a', -0.04)) { label(ctx, '2 FT', 0, 2, 38, '#ffd23f'); ctx.restore(); }
    } else if (name === 'reply') { // two-shot: a meme flies across the couch
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, { arms: PH, head: { yaw: 0.1, pitch: -0.3 }, face: { look: [0, -0.6], lids: 0.3, mouth: 'smile', brows: -0.2 } }); withPhone(S, bd, 0.2, memeScreen);
      const g = SHE(S, { arms: PH, head: { yaw: -0.05, pitch: -0.3 }, face: { look: [0, -0.6], mouth: 'smile' } }); withPhone(S, g, -0.2);
      S.render(ctx, W, H_, { dof: 0.28 });
      const p0 = S.proj(midHands(bd)), p1 = S.proj(midHands(g)), u = ramp(t, V('reply', 'sends'), 0.7);
      if (u > 0 && u < 1) { const x = p0[0] + (p1[0] - p0[0]) * u, y = p0[1] - 60 - Math.sin(u * Math.PI) * 180; FX.dots(ctx, [[p0[0], p0[1] - 60], [(p0[0] + x) / 2, y - 40], [x, y]], 1); plane(ctx, x, y, 1.3, -0.3 + u * 0.6); }
    } else if (name === 'snort') { // her: laughing so hard she snorts
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: PH, head: { yaw: 0.4 }, face: { look: [0.6, 0], mouth: 'smile', eyes: 'happy' } });
      const sn = t >= V('reply', 'snorts');
      const g = SHE(S, { lean: -0.05, arms: PH, head: { yaw: -0.15, pitch: 0.15, tilt: Math.sin(t * 13) * 0.08 }, face: { eyes: 'happy', mouth: 'open', blush: 1 } }); withPhone(S, g, -0.1, memeScreen);
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); FX.buzz(ctx, hp[0] - 230, hp[1] + 30, 1.2, 1); FX.buzz(ctx, hp[0] + 230, hp[1] + 30, 1.2, 1);
      if (sn) { const u = popU(t, V('reply', 'snorts'), 0.3); ctx.save(); ctx.translate(560, 900); ctx.rotate(0.12); ctx.scale(u, u); ctx.font = FONT(900, 64); ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = '#1c1a22'; ctx.strokeText('SNORT!', 0, 0); ctx.fillStyle = '#f47aa6'; ctx.fillText('SNORT!', 0, 0); ctx.restore(); }
    } else { // the closer: both laughing, leaning in, hearts
      const S = room(W, H_, t, a, b, [[0.05, 1.5, 2.6], [0, 1.25, -0.4], [0.05, 1.52, 2.2], [0, 1.3, -0.4]]);
      const bd = HE(S, { lean: 0.05, arms: PH, head: { yaw: 0.45, tilt: 0.15 }, face: { eyes: 'happy', mouth: 'open', blush: 0.6 } }); withPhone(S, bd, 0.3, memeScreen);
      const g = SHE(S, { lean: 0.05, arms: PH, head: { yaw: -0.45, tilt: -0.15 }, face: { eyes: 'happy', mouth: 'open', blush: 0.8 } }); withPhone(S, g, -0.3, memeScreen);
      S.render(ctx, W, H_, { dof: 0.28 });
      hearts(ctx, W, t, V('close', 'love'), 5, 620);
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    const gig = (t0, n) => { for (let i = 0; i < n; i++) k.tone(t0 + i * 0.13, { f: [[0, 900 + (i % 2) * 150], [0.08, 1100]], type: 'triangle', dur: 0.09, gain: 0.05, minor: true }); };
    gig(V('smile', 'giggling'), 6); gig(V('nobody', 'giggles'), 6);
    k.play('select', V('sus', 'narrows'), { gain: 0.35 }); k.play('pop', V('sus', 'laugh'), { f: 500, gain: 0.4 });
    k.play('sparkle', V('nobody', 'nobody'), { gain: 0.35 });
    [V('check', 'buzzes'), V('check', 'buzzes', 2), V('check', 'buzzes', 3)].forEach((x, i) => { for (let j = 0; j < 2; j++) k.play('buzz', x + j * 0.14, { f: 170, dur: 0.1, gain: 0.3 + i * 0.05 }); k.play('blip', x, { f: 1200 + i * 200, gain: 0.25 }); });
    twistSound(k, V('it', 'her'));
    k.play('riser', V('couch', 'two'), { dur: 0.5, gain: 0.25 }); k.play('stamp', V('couch', 'feet'), { gain: 0.4 });
    k.play('swish', V('reply', 'sends'), { gain: 0.5 }); k.play('ding', V('reply', 'back'), { f: 'G5', gain: 0.35 });
    k.tone(V('reply', 'snorts'), { f: [[0, 140], [0.15, 110], [0.3, 150]], type: 'sawtooth', dur: 0.35, gain: 0.12, filter: 'lowpass', f2: 700 }); // the snort
    heartSound(k, V('close', 'love'));
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
