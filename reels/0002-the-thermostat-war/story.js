  // ==================== 0002 "The thermostat war." : a sarcastic couple reel ====================
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
    ['hook', 0], ['war', V('war', 'the') - 0.15], ['up', V('up', 'she') - 0.15], ['down', V('down', 'he') - 0.15], ['again', V('again', 'up') - 0.15],
    ['cold', V('cold', 'she') - 0.15], ['sweater', V('sweater', 'he') - 0.15], ['does', V('does', 'so') - 0.15], ['his', V('his', 'his') - 0.15],
    ['back', V('back', 'then') - 0.15], ['freeze', V('back', 'now') - 0.15], ['close', V('close', 'checkmate') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'every'), [['EVERY', 'COUPLE', 'HAS'], ['THIS', K('FIGHT.')]]],
    [V('war', 'the'), [['THE', K('THERMOSTAT')], ['WAR.']]],
    [V('up', 'she'), [['SHE', 'TURNS', 'IT', 'UP'], ['TO', K('TWENTY-FIVE.')]]],
    [V('down', 'he'), [['HE', K('SNEAKS'), 'IT'], ['DOWN', 'TO', 'TWENTY.']]],
    [V('again', 'up'), [[K('UP.'), 'DOWN.']]],
    [V('again', 'up', 2), [[K('UP.'), K('DOWN.')]]],
    [V('cold', 'she'), [['SHE', 'SAYS,'], ['"I\'M', K('FREEZING."')]]],
    [V('sweater', 'he'), [['"THEN', 'PUT', 'ON'], ['A', K('SWEATER."')]]],
    [V('does', 'so'), [['SO', 'SHE', K('DOES.')]]],
    [V('does', 'his'), [[K('HIS'), 'SWEATER.']]],
    [V('his', 'his'), [['HIS', K('FAVORITE'), 'ONE.']]],
    [V('his', 'the'), [['THE', 'ONE', "SHE'S", K('NEVER')], ['ALLOWED', 'TO', 'BORROW.']]],
    [V('back', 'then'), [['THEN', 'SHE', 'TURNS'], ['IT', K('DOWN.')]]],
    [V('back', 'to'), [['TO', K('EIGHTEEN.')]]],
    [V('back', 'now'), [["NOW", "HE'S", 'THE', 'ONE'], ["WHO'S", K('FREEZING.')]]],
    [V('close', 'checkmate'), [[K('CHECKMATE,')], ['BABE.']]],
  ];
  const caps = makeCaps(CAPS);

  // the thermostat: a little wall dial with the set temperature
  const dial = (ctx, x, y, r, val, u, rot = 0) => {
    if (!card(ctx, x, y, r * 2.1, r * 2.5, u, '#f4f1ea', rot)) return;
    const hot = val >= 23, col = hot ? '#ec5a3a' : '#3d8bf2', k = H.clamp((val - 16) / 12);
    ctx.lineCap = 'round'; ctx.lineWidth = r * 0.16; ctx.strokeStyle = '#ddd6cc'; ctx.beginPath(); ctx.arc(0, -r * 0.05, r * 0.72, Math.PI * 0.75, Math.PI * 2.25); ctx.stroke();
    ctx.strokeStyle = col; ctx.beginPath(); ctx.arc(0, -r * 0.05, r * 0.72, Math.PI * 0.75, Math.PI * (0.75 + 1.5 * k)); ctx.stroke();
    label(ctx, val + '°', 0, -r * 0.02, r * 0.62, col);
    label(ctx, hot ? 'HEAT' : 'COOL', 0, r * 0.88, r * 0.24, '#7a7484', 800);
    ctx.restore();
  };
  const SHIRT = P.white; // what he has left once she takes the sweater

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: both on the couch, side-eyeing each other
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      HE(S, { head: { yaw: 0.45 }, face: { look: [0.6, 0], lids: 0.35, mouth: 'flat', brows: -0.3 } });
      SHE(S, { arms: POSE.hug, head: { yaw: -0.45 }, face: { look: [-0.6, 0], lids: 0.35, mouth: 'flat', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'war') { // the two-shot, the thermostat pops up between them
      const S = room(W, H_, t, a, b, 'two');
      HE(S, { head: { yaw: 0.35 }, face: { look: [0.5, 0.1], mouth: 'flat', brows: -0.4 } });
      SHE(S, { head: { yaw: -0.35 }, face: { look: [-0.5, 0.1], mouth: 'flat', brows: -0.4 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      dial(ctx, W / 2, 470, 78, 22, popU(t, V('war', 'thermostat'), 0.35));
    } else if (name === 'up') { // her: a smug press on the button
      const S = room(W, H_, t, a, b, 'her');
      const pr = ramp(t, V('up', 'up'), 0.25);
      HE(S, { head: { yaw: 0.45 } });
      const g = SHE(S, { arms: [[0.5, 0.05, 0.9], [0.35 + 1.4 * pr, 0.18, 0.7 - 0.6 * pr]], head: { yaw: -0.15 + 0.3 * pr, tilt: -0.08 }, face: { eyes: 'open', look: [0.3, 0.1], lids: 0.3, mouth: 'smile', brows: -0.15 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const v = t < V('up', 'twentyfive') ? 22 : 25; dial(ctx, 560, 820, 70, v, popU(t, V('up', 'turns'), 0.3), 0.08);
      if (t > V('up', 'twentyfive')) FX.sparkle(ctx, 640, 720, 30 * popU(t, V('up', 'twentyfive'), 0.3), t * 2);
    } else if (name === 'down') { // him: sneaky side-eye, finger on the dial
      const S = room(W, H_, t, a, b, 'him');
      const pr = ramp(t, V('down', 'down'), 0.25);
      HE(S, { arms: [[0.35 + 1.3 * pr, 0.18, 0.7 - 0.5 * pr], [0.5, 0.05, 0.9]], head: { yaw: 0.1, tilt: 0.06 }, face: { eyes: 'open', look: [0.7, 0], lids: 0.45, mouth: 'smile', brows: -0.3 } });
      SHE(S, { head: { yaw: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const v = t < V('down', 'twenty') ? 25 : 20; dial(ctx, 160, 820, 70, v, popU(t, V('down', 'sneaks'), 0.3), -0.08);
    } else if (name === 'again') { // wide: the dial flips on every word
      const S = room(W, H_, t, a, b, 'two');
      const ws = [V('again', 'up'), V('again', 'down'), V('again', 'up', 2), V('again', 'down', 2)]; let k = 0; ws.forEach((w, i) => { if (t >= w) k = i; });
      const her = k % 2 === 0;
      HE(S, { arms: her ? POSE.rest : [[0.35, 0.18, 0.7], PT], head: { yaw: 0.4 }, face: { look: [0.6, 0], mouth: her ? 'o' : 'smile', brows: her ? 0.3 : -0.4, lids: her ? 0 : 0.35 } });
      SHE(S, { arms: her ? [PT, [0.35, 0.18, 0.7]] : POSE.rest, head: { yaw: -0.4 }, face: { look: [-0.6, 0], mouth: her ? 'smile' : 'o', brows: her ? -0.4 : 0.3, lids: her ? 0.35 : 0 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      dial(ctx, W / 2, 470, 78, her ? 25 : 20, 1, Math.sin(t * 20) * 0.04);
      FX.speed(ctx, W, H_, W / 2, 470, 0.5, t);
    } else if (name === 'cold') { // her: shivering, arms hugged in
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { head: { yaw: 0.45 } });
      const g = SHE(S, { lean: 0.06, arms: POSE.hug, head: { yaw: -0.05 + wave(t, 40, 0.04), tilt: wave(t, 33, 0.03) }, face: { eyes: 'open', look: [-0.4, 0], mouth: 'frown', brows: 0.5 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); FX.sweat(ctx, hp[0] - 170, hp[1] - 120, 1.6 * popU(t, V('cold', 'freezing'), 0.3));
      FX.buzz(ctx, hp[0] + 250, hp[1] + 40, 1.4, t > V('cold', 'freezing') ? 1 : 0);
    } else if (name === 'sweater') { // him: smug, unbothered, in his favourite sweater
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { arms: POSE.clasp, head: { yaw: 0.05, tilt: -0.1 }, face: { eyes: 'open', look: [0.1, 0], lids: 0.5, mouth: 'smile', brows: -0.25 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.head); smug(ctx, hp[0] + 190, hp[1] - 150, t, popU(t, V('sweater', 'sweater'), 0.3));
    } else if (name === 'does') { // two-shot: she is in his mustard sweater, he is in a T-shirt
      const S = room(W, H_, t, a, b, 'two');
      const sw = t >= V('does', 'does');
      HE(S, { shirt: sw ? SHIRT : P.mustard, arms: POSE.rest, head: { yaw: sw ? 0.45 : 0.2 }, face: { eyes: sw ? 'wide' : 'open', look: [0.6 * (sw ? 1 : 0), 0], mouth: sw ? 'o' : 'smile', brows: sw ? 0.5 : 0 } });
      SHE(S, { shirt: sw ? P.mustard : P.red, arms: sw ? POSE.hug : POSE.rest, head: { yaw: -0.2, tilt: 0.12 }, face: { eyes: sw ? 'happy' : 'open', mouth: 'smile', blush: sw ? 0.6 : 0 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      flash = 0.3 * Math.exp(-Math.pow((t - V('does', 'does')) * 7, 2));
      FX.ring(ctx, 560, 820, 120, '#ec3a32', H.clamp((t - V('does', 'his')) / 0.45), null);
    } else if (name === 'his') { // her close-up: cosy in the forbidden sweater
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { shirt: SHIRT, head: { yaw: 0.5 }, face: { eyes: 'wide', mouth: 'o' } });
      const g = SHE(S, { shirt: P.mustard, arms: POSE.hug, head: { yaw: -0.1, tilt: 0.18 }, face: { eyes: 'happy', mouth: 'smile', blush: 0.8 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); const r = H.rng(4); for (let i = 0; i < 4; i++) FX.sparkle(ctx, hp[0] + r.range(-230, 230), hp[1] + r.range(-200, 260), 24 * popU(t, V('his', 'favorite') + i * 0.12, 0.3), t * 2 + i);
      FX.ring(ctx, 600, 860, 90, '#ec3a32', H.clamp((t - V('his', 'never')) / 0.45), 'x');
    } else if (name === 'back') { // her: the dial goes cold
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { shirt: SHIRT, head: { yaw: 0.5 } });
      const pr = ramp(t, V('back', 'down'), 0.25);
      SHE(S, { shirt: P.mustard, arms: [[0.6, -0.1, 1.6], [0.35 + 1.4 * pr, 0.18, 0.7 - 0.6 * pr]], head: { yaw: 0.1, tilt: -0.1 }, face: { eyes: 'open', look: [0.4, 0], lids: 0.45, mouth: 'smile', brows: -0.35 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const v = t < V('back', 'eighteen') ? 25 : 18; dial(ctx, 540, 820, 74, v, popU(t, V('back', 'turns'), 0.3), 0.08);
      FX.ring(ctx, 540, 820, 110, '#3d8bf2', H.clamp((t - V('back', 'eighteen')) / 0.45), null);
    } else if (name === 'freeze') { // him: in a T-shirt, shivering
      const S = room(W, H_, t, a, b, 'him');
      const bd = HE(S, { shirt: SHIRT, lean: 0.06, arms: POSE.hug, head: { yaw: 0.1 + wave(t, 40, 0.04), tilt: wave(t, 31, 0.04) }, face: { eyes: 'wide', look: [0.3, 0], mouth: 'frown', brows: 0.6 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.head); FX.sweat(ctx, hp[0] + 170, hp[1] - 130, 1.8 * popU(t, V('back', 'freezing'), 0.3));
      FX.buzz(ctx, hp[0] - 250, hp[1] + 40, 1.4, 1);
      const r = H.rng(6); ctx.fillStyle = 'rgba(255,255,255,0.85)'; for (let i = 0; i < 30; i++) { const x = r.range(0, W), y = (r.range(0, H_) + t * r.range(60, 140)) % H_; ctx.beginPath(); ctx.arc(x, y, r.range(2, 5), 0, Math.PI * 2); ctx.fill(); }
    } else { // the closer: she wins, wrapped up, he shivers next to her
      const S = room(W, H_, t, a, b, [[0.05, 1.55, 2.9], [0.05, 1.27, -0.4], [0.1, 1.55, 2.5], [0.1, 1.3, -0.4]]);
      HE(S, { shirt: SHIRT, arms: POSE.hug, head: { yaw: 0.45 + wave(t, 40, 0.03) }, face: { eyes: 'open', look: [0.6, 0], mouth: 'frown', brows: 0.5 } });
      const g = SHE(S, { shirt: P.mustard, arms: POSE.hug, head: { yaw: -0.05, tilt: 0.15 }, face: { eyes: 'open', look: [0, 0], lids: 0.5, mouth: 'smile', brows: -0.3, blush: 0.4 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      const hp = S.proj(g.head); smug(ctx, hp[0] + 140, hp[1] - 140, t, popU(t, V('close', 'checkmate'), 0.3));
      flash = 0.2 * Math.exp(-Math.pow((t - V('close', 'checkmate')) * 7, 2));
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    const beep = (t, f) => k.play('blip', t, { f, gain: 0.4 });
    k.play('ding', V('war', 'thermostat'), { f: 'G5', gain: 0.4 });
    beep(V('up', 'twentyfive'), 1200); beep(V('down', 'twenty'), 700);
    [V('again', 'up'), V('again', 'down'), V('again', 'up', 2), V('again', 'down', 2)].forEach((t, i) => beep(t, i % 2 ? 700 : 1200));
    k.tone(V('cold', 'freezing'), { f: [[0, 520], [0.1, 480], [0.2, 520], [0.3, 470], [0.4, 520]], type: 'triangle', dur: 0.5, gain: 0.1 }); // teeth chatter
    k.play('select', V('sweater', 'sweater'), { gain: 0.4 });
    k.play('swish', V('does', 'does'), { gain: 0.5 }); k.play('jump', V('does', 'his'), { gain: 0.4 });
    nopeSound(k, V('his', 'never'));
    beep(V('back', 'down'), 700); twistSound(k, V('back', 'eighteen'));
    k.tone(V('back', 'freezing'), { f: [[0, 520], [0.1, 470], [0.2, 520], [0.3, 470], [0.4, 520]], type: 'triangle', dur: 0.5, gain: 0.12 });
    k.play('sparkle', V('close', 'checkmate'), { gain: 0.55 }); k.play('stamp', V('close', 'babe'), { gain: 0.5 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
