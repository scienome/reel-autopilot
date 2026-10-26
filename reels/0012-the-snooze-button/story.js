  // ==================== 0012 "The snooze button." : a sarcastic couple reel ====================
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
    ['hook', 0], ['first', V('first', 'six') - 0.15], ['second', V('second', 'sixohnine') - 0.15], ['third', V('third', 'sixeighteen') - 0.15], ['she', V('she', "she's") - 0.15],
    ['plan', V('plan', 'so') - 0.15], ['alarm', V('alarm', 'sixtwentyseven') - 0.15], ['jump', V('jump', "he's") - 0.15], ['twist', V('twist', "there's") - 0.15],
    ['close', V('close', 'rise') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'pov'), [['POV:', 'HE', 'SETS', K('FIVE')], [K('ALARMS'), 'FOR', 'ONE', 'NAP.']]],
    [V('first', 'six'), [['SIX', "O'CLOCK."]]],
    [V('first', 'snooze'), [[K('SNOOZE.')]]],
    [V('second', 'sixohnine'), [['SIX-OH-NINE.']]],
    [V('second', 'snooze'), [[K('SNOOZE.')]]],
    [V('third', 'sixeighteen'), [['SIX-EIGHTEEN.']]],
    [V('third', 'snooze'), [[K('SNOOZE.')]]],
    [V('she', "she's"), [["SHE'S", 'BEEN', K('AWAKE')], ['SINCE', 'THE', 'FIRST', 'ONE,']]],
    [V('she', 'staring'), [['STARING', 'AT', 'THE'], [K('CEILING.')]]],
    [V('plan', 'so'), [['SO', 'SHE', 'CHANGES', 'HIS'], [K('ALARM'), 'SOUND']]],
    [V('plan', 'to'), [['TO', 'HER', 'OWN'], [K('VOICE.')]]],
    [V('alarm', 'sixtwentyseven'), [['SIX-TWENTY-SEVEN.']]],
    [V('alarm', "dinner's"), [['"DINNER\'S', K('READY!"')]]],
    [V('jump', "he's"), [["HE'S", 'UP', 'IN'], [K('HALF'), 'A', K('SECOND,')]]],
    [V('jump', 'smiling'), [['SMILING,', 'HAIR'], [K('EVERYWHERE,')]]],
    [V('jump', 'fork'), [[K('FORK'), 'IN', 'HAND.']]],
    [V('twist', "there's"), [["THERE'S", 'NO'], [K('DINNER.')]]],
    [V('twist', 'not'), [['NOT', 'EVEN', K('TOAST.')]]],
    [V('close', 'rise'), [['RISE', 'AND', 'SHINE,'], [K('SUNSHINE.')]]],
  ];
  const caps = makeCaps(CAPS);

  // the phone alarm screen, as a big card
  const alarmUI = (ctx, x, y, time, u, t, snoozeT) => {
    if (!card(ctx, x, y, 300, 220, u, '#1c1a2a', Math.sin(t * 40) * 0.02 * (snoozeT && t > snoozeT ? 0 : 1))) return;
    label(ctx, time, 0, -42, 76, '#ffffff', 800);
    const pr = snoozeT && t > snoozeT; ctx.fillStyle = pr ? '#ffd23f' : '#f2a640'; ctx.beginPath(); ctx.roundRect(-110, 22, 220, 64, 32); ctx.fill();
    if (pr) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(30, 54, 26 * H.clamp((t - snoozeT) / 0.25), 0, Math.PI * 2); ctx.fill(); }
    label(ctx, 'SNOOZE', 0, 55, 34, '#1c1a22'); ctx.restore();
  };
  const SLEEP = (o = {}) => ({ lean: -0.15, arms: POSE.rest, head: { yaw: 0.15, pitch: 0.25, tilt: 0.25 }, face: { eyes: 'closed', mouth: 'o', blush: 0.3 }, ...o });
  const reachTap = (t, st) => { const k = Math.exp(-Math.pow((t - st) * 3, 2)); return [[0.35, 0.18, 0.7], [0.5 + 1.0 * k, 0.05 + 0.3 * k, 0.9 - 0.8 * k]]; };
  const mic = (ctx, x, y, t, u) => { if (!card(ctx, x, y, 280, 150, u, '#fff8ec', -0.04)) return; ctx.fillStyle = '#ec3a32'; ctx.beginPath(); ctx.roundRect(-110, -38, 34, 56, 17); ctx.fill(); ctx.strokeStyle = '#ec3a32'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-93, -6, 28, 0.2, Math.PI - 0.2); ctx.stroke(); ctx.fillStyle = '#3d8bf2'; for (let i = 0; i < 12; i++) { const h = 10 + Math.abs(Math.sin(t * 9 + i * 1.3)) * 50; ctx.beginPath(); ctx.roundRect(-40 + i * 13, -h / 2, 8, h, 4); ctx.fill(); } ctx.restore(); };
  const toast = (ctx, x, y, s, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10; ctx.fillStyle = '#c98a44'; ctx.beginPath(); ctx.moveTo(-45, 50); ctx.lineTo(-45, -20); ctx.arc(-22, -20, 23, Math.PI, Math.PI * 1.5); ctx.arc(0, -35, 30, Math.PI * 1.15, Math.PI * 1.85); ctx.arc(22, -20, 23, Math.PI * 1.5, 0); ctx.lineTo(45, 50); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#f2d39a'; ctx.beginPath(); ctx.roundRect(-35, -25, 70, 66, 10); ctx.fill(); ctx.restore(); };

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: the nap, the phone on the table
      const S = room(W, H_, t, a, b, 'wide', { table: true });
      const bd = HE(S, SLEEP());
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.4 }, face: { look: [-0.6, 0], mouth: 'smile' } });
      phone(S, [-0.25, 0.43, 1.15], 0.3, 1.4);
      S.render(ctx, W, H_, { dof: 0.3 });
      const hp = S.proj(bd.head); zzz(ctx, hp[0] + 40, hp[1] - 70, t, 1);
      if (card(ctx, W / 2, 470, 140, 90, popU(t, V('hook', 'five'), 0.3), '#1c1a2a', -0.05)) { label(ctx, 'x5', 0, 2, 50, '#ffd23f'); ctx.restore(); }
    } else if (name === 'first' || name === 'second' || name === 'third') { // the alarm, the tap, back to sleep
      const i = ['first', 'second', 'third'].indexOf(name), st = V(name, 'snooze'), time = ['6:00', '6:09', '6:18'][i];
      const cams = ['two', 'him', [[-0.3, 1.5, 2.3], [-0.4, 1.25, -0.42], [-0.3, 1.52, 2.0], [-0.4, 1.28, -0.42]]];
      const S = room(W, H_, t, a, b, cams[i]);
      const bd = HE(S, SLEEP({ arms: i === 1 ? POSE.rest : reachTap(t, st), face: { eyes: 'closed', mouth: t > st + 0.3 ? 'smile' : 'frown', brows: t > st ? 0 : 0.4, blush: 0.3 } }));
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.15 - 0.15 * i, pitch: 0.05 * i }, face: { look: [-0.3, 0.2], lids: 0.2 + 0.15 * i, mouth: 'flat', brows: -0.15 * i } });
      S.render(ctx, W, H_, { dof: 0.25 });
      alarmUI(ctx, i === 1 ? 540 : W / 2, i === 1 ? 950 : 900, time, popU(t, a + 0.1, 0.25), t, st);
      if (t < st) FX.buzz(ctx, i === 1 ? 540 : W / 2, (i === 1 ? 950 : 900) - 140, 1.2, 1);
      if (t > st + 0.3) { const hp = S.proj(bd.head); zzz(ctx, hp[0] + 60, hp[1] - 80, t, 1); }
    } else if (name === 'she') { // her: wide awake, staring at the ceiling
      const S = room(W, H_, t, a, b, 'her');
      HE(S, SLEEP());
      const up = ramp(t, V('she', 'staring'), 0.4);
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.05, pitch: 0.25 * up }, face: { look: [0, 0.6 * up], lids: 0.5, mouth: 'flat', brows: 0.1 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      if (card(ctx, 140, 950, 170, 90, popU(t, V('she', 'awake'), 0.3), '#1c1a2a', -0.05)) { label(ctx, '6:00', 0, 2, 46, '#ffd23f'); ctx.restore(); }
    } else if (name === 'plan') { // two-shot: she takes his phone, records her voice
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, SLEEP());
      const g = SHE(S, { arms: POSE.phone, head: { yaw: -0.05, pitch: -0.2, tilt: 0.1 }, face: { look: [0, -0.4], lids: 0.3, mouth: 'smile', brows: -0.35 } });
      phone(S, add(midHands(g), [0, 0.05, 0.02]), -0.2, 1.1);
      S.render(ctx, W, H_, { dof: 0.28 });
      const hp = S.proj(bd.head); zzz(ctx, hp[0] + 40, hp[1] - 70, t, 1);
      mic(ctx, W / 2, 470, t, popU(t, V('plan', 'voice'), 0.3));
      const sp = S.proj(g.head); smug(ctx, sp[0] + 100, sp[1] - 110, t, popU(t, V('plan', 'changes'), 0.3));
    } else if (name === 'alarm') { // the new alarm: her voice
      const S = room(W, H_, t, a, b, [[-0.62, 1.55, 1.6], [-0.62, 1.42, -0.42], [-0.62, 1.56, 1.35], [-0.62, 1.44, -0.42]]);
      const bd = HE(S, SLEEP({ face: { eyes: 'closed', mouth: 'o', brows: t > V('alarm', "dinner's") ? 0.4 : 0 } }));
      S.render(ctx, W, H_, { dof: 0.22 });
      alarmUI(ctx, W / 2, 900, '6:27', popU(t, a + 0.1, 0.25), t, null);
      bubble(ctx, W / 2, 400, "Dinner's ready!", 1, popU(t, V('alarm', "dinner's"), 0.3), 46);
    } else if (name === 'jump') { // him: instantly awake
      const S = Scene(...shotCam(t, a, b, [-0.62, 1.5, 1.75], [-0.62, 1.4, -0.42], [-0.62, 1.5, 1.5], [-0.62, 1.42, -0.42]), W, H_);
      const bd = HE(S, { yaw: 0, lean: 0.1, arms: POSE.cheer, head: { yaw: 0, tilt: Math.sin(t * 7) * 0.08, pitch: 0.05 }, face: { eyes: 'wide', look: [0, 0], mouth: 'open', brows: 0.3, blush: 0.4 } });
      const hp = S.proj(bd.head);
      FX.burst(ctx, W, H_, hp[0], hp[1], ramp(t, a + 0.05, 0.2), t);
      S.render(ctx, W, H_, { dof: 0, bg: 'rgba(0,0,0,0)' });
      FX.speed(ctx, W, H_, hp[0], hp[1], H.clamp(1 - (t - a) / 0.6), t);
      if (t >= V('jump', 'fork')) { const fp = S.proj(bd.hands[1].p), u = popU(t, V('jump', 'fork'), 0.3); ctx.save(); ctx.translate(fp[0], fp[1] - 40); ctx.rotate(0.3); ctx.scale(u, u); ctx.fillStyle = '#d8dce4'; ctx.strokeStyle = '#7a7f8c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-7, -10, 14, 90, 6); ctx.fill(); ctx.stroke(); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.roundRect(-14 + i * 8, -50, 6, 44, 3); ctx.fill(); ctx.stroke(); } ctx.restore(); }
      flash = 0.3 * Math.exp(-Math.pow((t - (a + 0.1)) * 7, 2));
    } else if (name === 'twist') { // two-shot: no dinner, no toast
      const S = room(W, H_, t, a, b, 'two', { table: true });
      const nt = t >= V('twist', 'not');
      HE(S, { arms: POSE.shrug, head: { yaw: Math.sin(t * 3) * 0.4, tilt: 0.1 }, face: { eyes: 'wide', look: [Math.sin(t * 3) * 0.6, 0], mouth: nt ? 'frown' : 'o', brows: 0.55 } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.4, tilt: -0.1 }, face: { look: [-0.6, 0], lids: 0.5, mouth: 'smile', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      FX.ring(ctx, W / 2, 470, 90, '#ec3a32', H.clamp((t - V('twist', 'dinner')) / 0.45), 'x');
      if (nt) { toast(ctx, 560, 900, 1.2, popU(t, V('twist', 'toast'), 0.3)); FX.ring(ctx, 560, 900, 80, '#ec3a32', H.clamp((t - V('twist', 'toast') - 0.1) / 0.45), 'x'); }
    } else { // the closer: her, sweetly smug
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { arms: POSE.shrug, head: { yaw: 0.45 }, face: { eyes: 'wide', mouth: 'frown' } });
      const g = SHE(S, { arms: POSE.clasp, head: { yaw: -0.05, tilt: 0.15 }, face: { look: [0, 0], lids: 0.45, mouth: 'smile', brows: -0.25, blush: 0.4 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); smug(ctx, hp[0] + 170, hp[1] - 150, t, popU(t, V('close', 'sunshine'), 0.3));
      const r = H.rng(11); for (let i = 0; i < 4; i++) FX.sparkle(ctx, i % 2 ? r.range(560, 660) : r.range(60, 160), r.range(420, 950), 22 * popU(t, V('close', 'shine') + i * 0.1, 0.3), t * 2 + i, '#ffe9a0');
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    const ring = (t0, dur) => { for (let s = 0; s < dur; s += 0.24) k.play('blip', t0 + s, { f: 1400, gain: 0.25, minor: true }); };
    ['first', 'second', 'third'].forEach((bt) => { ring(SH.find((s) => s[0] === bt)[1] + 0.1, V(bt, 'snooze') - SH.find((s) => s[0] === bt)[1] - 0.1); k.play('click', V(bt, 'snooze'), { gain: 0.5 }); k.tone(V(bt, 'snooze') + 0.3, { f: [[0, 180], [0.6, 120]], type: 'triangle', dur: 0.6, gain: 0.08, filter: 'lowpass', f2: 600 }); });
    k.play('tock', V('she', 'staring'), { gain: 0.25 });
    k.play('select', V('plan', 'changes'), { gain: 0.35 }); k.play('blip', V('plan', 'voice'), { f: 880, gain: 0.3 });
    ring(SH.find((s) => s[0] === 'alarm')[1] + 0.1, 0.6);
    k.play('ding', V('alarm', "dinner's"), { f: 'C6', gain: 0.4 });
    k.play('jump', V('jump', "he's") - 0.05, { gain: 0.55 }); k.play('powerup', V('jump', 'up'), { gain: 0.4 });
    nopeSound(k, V('twist', 'dinner')); twistSound(k, V('twist', 'toast'));
    k.play('sparkle', V('close', 'sunshine'), { gain: 0.5 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
