  // ==================== Dave, the crash-test dummy (shared by every Dave reel) ====================
  // Built with the mech_base low-poly builders, so he gets the same flat shading, warm key light and soft shadows.
  // Units: metres. Feet at the origin, facing +z (towards an orbit camera at angle 0), 1.8 m tall with the hard hat.
  // Yellow body, black joints, yellow/black target decals on the head sides, chest and knees, an orange hard hat.
  // dave(S, pos, o):
  //   o.yaw, o.s (scale), o.pitch / o.roll (tip him over, around his middle)
  //   o.pose: 'stand' | 'walk' | 'sit' | 'drive' | 'point' | 'thumbs' | 'salute' | 'wave' | 'carry' | 'flail' | 'hold'
  //   o.t (for walk / wave / flail cycles), o.hands = [L, R] / o.feet = [L, R] to override targets (local metres), o.kp (knee pole), o.lean, o.headTilt
  //   o.death: 'squash' | 'launch' | 'puff' | 'blown', o.u = 0..1 progress, o.to = world offset at u = 1, o.arc = peak height
  //   o.blink 0..1 (1 = eyes shut), o.xeyes (cartoon X eyes), o.half (upper body only: in a hatch, a seat, a hole)
  //   o.look = [x, y] pupil offset, o.mouth 0..1 (an O-shaped mouth), o.sweat 0..1, o.hat === false (no hard hat)
  //   o.colors = { body, joint, hat, head } and o.decals === false: the same figure as somebody else (kept generic); o.suit: jacket and tie
  // davePile(S, pos, t, o): the end state, a smoking heap of Dave with blinking eyes on top
  // ripCard(ctx, W, H, n, u, t, o): the "R.I.P. Dave #N" end card (o.cause: one small line under it)
  const DV = { body: [246, 196, 62], joint: [48, 50, 58], hat: [246, 122, 38], eye: [252, 252, 248], pupil: [24, 24, 30] };
  const daveTarget = (c, w, h, txt) => { // the crash-test target: a circle in black/yellow quarters
    const r = Math.min(w, h) * (txt ? 0.3 : 0.42), cx = w / 2, cy = txt ? h * 0.36 : h / 2;
    for (let q = 0; q < 4; q++) { c.fillStyle = q % 2 ? '#f6c43e' : '#1c1c22'; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, (q * Math.PI) / 2, ((q + 1) * Math.PI) / 2); c.closePath(); c.fill(); }
    c.strokeStyle = '#1c1c22'; c.lineWidth = r * 0.12; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke();
    if (txt) { c.fillStyle = '#1c1c22'; c.font = `800 ${h * 0.2}px "Montserrat"`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h * 0.82); }
  };
  // two-bone IK: root A, target, bone lengths a, b, pole direction -> [joint, end]
  const ik2 = (A, Tg, a, b, pole) => {
    const d = sub(Tg, A), dir = norm(d), L = H.clamp(Math.hypot(...d), Math.abs(a - b) + 1e-3, (a + b) * 0.999);
    const x = (a * a - b * b + L * L) / (2 * L), h = Math.sqrt(Math.max(0, a * a - x * x));
    let pp = sub(pole, mul(dir, dot(pole, dir))); if (Math.hypot(...pp) < 1e-4) pp = [0, 0, 1]; pp = norm(pp);
    return [add(A, add(mul(dir, x), mul(pp, h))), add(A, mul(dir, L))];
  };
  // pose -> hand/foot targets (local metres; +x = Dave's left, so his right hand is on the camera's left)
  const davePose = (name, t = 0, o = {}) => {
    const P0 = { lean: 0, drop: 0, hands: [[0.3, 0.92, 0.04], [-0.3, 0.92, 0.04]], feet: [[0.12, 0.05, 0.03], [-0.12, 0.05, 0.03]], ep: [[0.6, -0.2, -1], [-0.6, -0.2, -1]], kp: [0, 0.2, 1], thumb: [0, 0], head: 0 };
    const sw = Math.sin(t * 7), sw2 = Math.sin(t * 13);
    switch (name) {
      case 'walk': P0.hands = [[0.3, 0.94, 0.04 - 0.16 * sw], [-0.3, 0.94, 0.04 + 0.16 * sw]]; P0.feet = [[0.12, 0.05 + 0.08 * Math.max(0, sw), 0.03 + 0.2 * sw], [-0.12, 0.05 + 0.08 * Math.max(0, -sw), 0.03 - 0.2 * sw]]; break;
      case 'sit': P0.drop = 0.42; P0.feet = [[0.13, 0.46, 0.46], [-0.13, 0.46, 0.46]]; P0.kp = [0, 1, 1]; P0.hands = [[0.17, 0.98, 0.38], [-0.17, 0.98, 0.38]]; P0.ep = [[1, -0.3, 0], [-1, -0.3, 0]]; break;
      case 'drive': P0.drop = 0.42; P0.feet = [[0.13, 0.46, 0.5], [-0.13, 0.46, 0.5]]; P0.kp = [0, 1, 1]; P0.hands = [[0.17, 1.22, 0.42], [-0.17, 1.22, 0.42]]; P0.ep = [[1, -1, 0], [-1, -1, 0]]; P0.lean = 0.08; break;
      case 'point': P0.hands[1] = [-0.24, 1.5, 0.62]; P0.ep[1] = [0, -1, 0]; P0.hands[0] = [0.26, 0.98, 0.1]; break;
      case 'thumbs': P0.hands[1] = [-0.3, 1.42, 0.26]; P0.ep[1] = [-0.4, -1, -0.2]; P0.thumb = [0, 1]; break;
      case 'salute': P0.hands[1] = [-0.07, 1.7, 0.17]; P0.ep[1] = [-1, -0.25, 0.25]; break; // hand to the brim of the hard hat
      case 'wave': P0.hands[1] = [-0.48 + 0.1 * sw, 1.86, 0.06]; P0.ep[1] = [-1, -0.4, 0]; break;
      case 'carry': P0.hands = [[0.22, 1.12, 0.34], [-0.22, 1.12, 0.34]]; P0.ep = [[1, -1, -0.2], [-1, -1, -0.2]]; break;
      case 'hold': P0.hands[1] = [-0.18, 1.18, 0.38]; P0.ep[1] = [-1, -1, -0.2]; break;
      case 'flail': P0.hands = [[0.5 + 0.08 * sw2, 1.85 + 0.1 * sw, 0.1 * sw2], [-0.5 - 0.08 * sw, 1.85 - 0.1 * sw2, -0.1 * sw]]; P0.ep = [[1, 0, 0], [-1, 0, 0]]; P0.feet = [[0.2, 0.12 + 0.12 * sw2, 0.15 * sw], [-0.2, 0.12 - 0.12 * sw, -0.15 * sw2]]; break;
      default: break;
    }
    if (o.hands) o.hands.forEach((h2, i) => { if (h2) P0.hands[i] = h2; });
    if (o.feet) o.feet.forEach((f, i) => { if (f) P0.feet[i] = f; });
    if (o.kp) P0.kp = o.kp;
    if (o.lean != null) P0.lean = o.lean;
    if (o.headTilt != null) P0.head = o.headTilt;
    return P0;
  };
  const dave = (S, pos, o = {}) => {
    const u = H.clamp(o.u ?? 0), dth = o.death, s = o.s ?? 1, col = { ...DV, ...(o.colors || {}) };
    const pz = davePose(dth === 'launch' || dth === 'blown' ? (u > 0.02 ? 'flail' : o.pose) : o.pose, o.t || 0, o);
    // whole-body transform: pose drop and lean, death deformation, then tip / scale / yaw / place
    const piv = [0, 0.9, 0], C = [0, 1.2, 0];
    let pitch = o.pitch || 0, roll = o.roll || 0, off = [0, 0, 0];
    if (dth === 'launch') { pitch += u * TAU * 1.5; }
    if (dth === 'blown') { roll -= u * TAU * 2.2; }
    if ((dth === 'launch' || dth === 'blown') && u > 0) { const to = o.to || (dth === 'launch' ? [0, 6, 0] : [7, 2, 0]), arc = o.arc ?? 2.5; off = add(mul(to, u), [0, 4 * arc * u * (1 - u), 0]); }
    const puff = dth === 'puff' ? H.ease.out(u) : 0, sq = dth === 'squash' ? H.ease.out(u) : 0;
    const deform = (p) => {
      if (puff && p[1] > 0.85) p = add(C, mul(sub(p, C), 1 + 0.45 * puff));
      if (sq) p = [p[0] * (1 + 1.1 * sq), p[1] * (1 - 0.93 * sq), p[2] * (1 + 1.1 * sq)];
      return p;
    };
    const place = (p) => add(add(pos, off), rotY(mul(add(rotZ(rotX(sub(p, piv), pitch), roll), piv), s), o.yaw || 0));
    const upper = (p) => add(rotX(sub(p, piv), pz.lean), piv);
    const W = (p, up = true) => place(deform(add(up ? upper(p) : p, [0, -pz.drop, 0])));
    const thick = (1 + 0.7 * puff) * (1 + 0.6 * sq), LR = 0.05 * thick, gl = { gloss: 0.18 };
    const half = !!o.half || !!o.headOnly, ho = !!o.headOnly;
    // body: pelvis, chest (a big ball when puffed up), neck, head, hard hat
    const boxAt = (c, hw, hh, hd, cc, ex = {}, up = true) => S.box((p) => W(add(p, c), up), hw, hh, hd, cc, { bevel: 0.3, ...gl, ...ex });
    if (!half) boxAt([0, 0.95, 0], 0.17, 0.09, 0.11, col.body, {}, false);
    if (!ho) S.rod(W([0, 1.02, 0]), W([0, 1.08, 0]), 0.09 * thick, col.joint, 10);
    if (ho) { /* head only */ } else if (puff > 0.08) S.ico(W([0, 1.24, 0]), 0.24 * (1 + 1.9 * puff) * s, col.body, { sub: 1, gloss: 0.35 });
    else boxAt([0, 1.26, 0], 0.21, 0.19, 0.13, col.body, o.decals === false ? {} : { paint: (c, w, h) => daveTarget(c, w, h, 'DAVE') });
    S.rod(W([0, 1.44, 0]), W([0, 1.52, 0]), 0.05 * thick, col.joint, 8);
    if (o.suit && !ho) { // a dark suit jacket over the chest, white shirt V and a red tie
      boxAt([0, 1.24, 0], 0.225, 0.2, 0.145, [44, 52, 78], { paint: (c, w, h) => { c.fillStyle = '#f4f2ee'; c.beginPath(); c.moveTo(w * 0.32, 0); c.lineTo(w * 0.68, 0); c.lineTo(w * 0.5, h * 0.55); c.closePath(); c.fill(); c.fillStyle = '#d83a34'; c.beginPath(); c.moveTo(w * 0.46, h * 0.05); c.lineTo(w * 0.54, h * 0.05); c.lineTo(w * 0.56, h * 0.5); c.lineTo(w * 0.5, h * 0.6); c.lineTo(w * 0.44, h * 0.5); c.closePath(); c.fill(); } });
      boxAt([0, 0.98, 0], 0.18, 0.1, 0.12, [44, 52, 78], {}, false);
    }
    const hc = [0, 1.63, 0], HT = (p) => W(add(rotX(p, pz.head), hc));
    S.box(HT, 0.12, 0.13, 0.13, col.head || col.body, { bevel: 0.45, ...gl, sidePaint: o.decals === false ? null : (c, w, h) => daveTarget(c, w, h) });
    if (o.decals !== false) S.box((p) => HT(add(rotY(p, Math.PI), [-0.121, 0, 0])), 0.003, 0.07, 0.07, col.body, { bevel: 0, noShadow: true, sidePaint: (c, w, h) => daveTarget(c, w, h) });
    // face: two big cartoon eyes (blink, X when dead), an optional O mouth
    const bl = H.clamp(o.blink ?? 0), lk = o.look || [0, 0];
    for (const ex of [-0.05, 0.05]) {
      if (o.xeyes) { for (const a of [0.7, -0.7]) S.box((p) => HT(add(rotZ(p, a), [ex, 0.02, 0.132])), 0.032, 0.007, 0.004, col.pupil, { bevel: 0, noShadow: true, flat: true }); continue; }
      S.box((p) => HT(add(p, [ex, 0.02, 0.131])), 0.03, 0.036 * (1 - 0.9 * bl), 0.004, col.eye, { bevel: 0, noShadow: true, glow: true });
      if (bl < 0.6) S.box((p) => HT(add(p, [ex + 0.012 * lk[0], 0.015 + 0.012 * lk[1], 0.136])), 0.013, 0.016 * (1 - bl), 0.003, col.pupil, { bevel: 0, noShadow: true, glow: true });
    }
    if (o.mouth > 0.02) S.box((p) => HT(add(p, [0, -0.07, 0.132])), 0.026 * o.mouth + 0.008, 0.03 * o.mouth, 0.004, [70, 30, 34], { bevel: 0, noShadow: true, glow: true });
    if (o.sweat > 0.02) { const k = ((o.t || 0) * 1.3) % 1; S.ico(HT([0.13, 0.08 - 0.25 * k, 0.06]), 0.016 * s, [150, 210, 255], { sub: 0, glow: true, noShadow: true }); }
    if (o.hat !== false) {
      S.ico(HT([0, 0.12, 0]), [0.15, 0.115, 0.155], col.hat, { sub: 1, gloss: 0.35 });
      S.cyl((p) => HT(add(p, [0, 0.1, 0.02])), 0.19, 0.018, shade(col.hat, 0.95), 14, { gloss: 0.3 });
      S.box((p) => HT(add(p, [0, 0.22, 0])), 0.025, 0.012, 0.12, shade(col.hat, 1.06), { bevel: 0.3 });
    }
    // arms (IK to the hand targets); a raised thumb when the pose says so
    if (!ho) pz.hands.forEach((hT, i) => {
      const sx = i ? -1 : 1, sh = [sx * 0.25, 1.4, 0], [el, hd] = ik2(sh, hT, 0.3, 0.3, pz.ep[i]);
      const A = W(sh), B = W(el), Hd = W(hd);
      S.ico(A, 0.065 * thick * s, col.joint, { sub: 0 }); S.rod(A, B, LR * s, col.body, 8); S.ico(B, 0.05 * thick * s, col.joint, { sub: 0 }); S.rod(B, Hd, LR * 0.9 * s, col.body, 8);
      S.ico(Hd, 0.062 * thick * s, col.body, { sub: 0 });
      if (pz.thumb[i]) S.rod(Hd, W(add(hd, [0, 0.11, 0.02])), 0.022 * s, col.body, 6);
    });
    // legs
    if (!half) pz.feet.forEach((fT, i) => {
      const sx = i ? -1 : 1, hp = [sx * 0.11, 0.9, 0], [kn, ft] = ik2(hp, fT, 0.44, 0.44, pz.kp);
      const A = W(hp, false), B = W(kn, false), F = W(ft, false);
      S.rod(A, B, LR * 1.25 * s, col.body, 8); S.ico(B, 0.065 * thick * s, col.joint, { sub: 0 }); S.rod(B, F, LR * 1.1 * s, col.body, 8);
      S.box((p) => W(add(p, add(ft, [0, 0.0, 0.06])), false), 0.06 * thick, 0.04, 0.11 * thick, col.joint, { bevel: 0.3 });
    });
  };
  // the end state: a heap of Dave, smoking gently, his eyes still blinking on top
  const davePile = (S, pos, t, o = {}) => {
    const s = o.s ?? 1, T = (p) => add(pos, rotY(mul(p, s), o.yaw || 0)), col = DV;
    S.box((p) => T(add(rotZ(rotY(p, 0.4), Math.PI / 2 - 0.15), [0.05, 0.2, -0.05])), 0.21, 0.19, 0.13, col.body, { bevel: 0.3 });
    S.box((p) => T(add(rotY(p, -0.5), [-0.3, 0.1, 0.1])), 0.17, 0.09, 0.11, col.body, { bevel: 0.3 });
    const limbs = [[[-0.5, 0.06, 0.3], [0.1, 0.08, 0.5]], [[0.45, 0.06, 0.25], [-0.1, 0.1, 0.42]], [[0.3, 0.3, -0.2], [0.55, 0.06, 0.25]], [[-0.55, 0.06, -0.1], [-0.2, 0.32, 0.12]]];
    limbs.forEach(([a, b], i) => { S.rod(T(a), T(b), 0.055 * s, col.body, 8); S.ico(T(b), 0.065 * s, i < 2 ? col.joint : col.body, { sub: 0 }); });
    // the head on top, looking at the camera, hat knocked sideways
    const blink = ((t % 2.3) < 0.13) ? 1 : 0;
    dave(S, add(pos, [0, (0.45 - 1.63) * s, 0.05]), { s, yaw: o.yaw || 0, headOnly: true, blink, hat: false });
    S.ico(T([0.18, 0.66, 0.0]), [0.15, 0.1, 0.15], col.hat, { sub: 1, gloss: 0.35, T: (p) => rotZ(p, -0.6) });
    // smoke: grey puffs rising and fading, on a loop
    for (let i = 0; i < 6; i++) { const k = ((t * 0.45 + i / 6) % 1), r = (0.06 + 0.3 * k * (1 - k)) * s; if (k < 0.97) S.ico(T([0.1 * Math.sin(i * 2.1 + k * 3), 0.7 + k * 1.3, -0.1 + 0.05 * Math.cos(i)]), r, shade([150, 148, 150], 1 - 0.25 * k), { sub: 0, jit: 0.3, seed: i, noShadow: true }); }
  };
  // the end card: a grey tombstone rises, "R.I.P." and "DAVE #N", a little orange hard hat on top
  const ripCard = (ctx, W, H_, n, u, t, o = {}) => {
    if (u <= 0) return; const e = H.ease.back(H.clamp(u * 1.4)), a = H.clamp(u * 2.5);
    ctx.save(); ctx.fillStyle = `rgba(16,10,18,${0.62 * a})`; ctx.fillRect(0, 0, W, H_);
    const cx = W / 2, w = W * 0.62, top = H_ * 0.27 + (1 - e) * H_ * 0.8, bot = top + H_ * 0.48;
    ctx.translate(0, 0);
    // tombstone
    ctx.fillStyle = '#7d808a'; ctx.beginPath(); ctx.moveTo(cx - w / 2, bot); ctx.lineTo(cx - w / 2, top + w / 2); ctx.arc(cx, top + w / 2, w / 2, Math.PI, 0); ctx.lineTo(cx + w / 2, bot); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9a9da6'; ctx.beginPath(); ctx.moveTo(cx - w / 2 + 16, bot); ctx.lineTo(cx - w / 2 + 16, top + w / 2); ctx.arc(cx, top + w / 2, w / 2 - 16, Math.PI, 0); ctx.lineTo(cx + w / 2 - 16, bot); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5c8a46'; ctx.fillRect(cx - w * 0.7, bot - 10, w * 1.4, 40);
    // hard hat on top
    const hy = top + 8; ctx.fillStyle = '#f67a26'; ctx.beginPath(); ctx.ellipse(cx, hy, 62, 50, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(cx - 82, hy - 4, 164, 14); ctx.fillStyle = '#ff9a4a'; ctx.fillRect(cx - 8, hy - 50, 16, 46);
    // text
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#2a2a32';
    ctx.font = FONT(800, 96); ctx.fillText('R.I.P.', cx, top + w * 0.5);
    ctx.font = FONT(800, 66); ctx.fillText(`DAVE #${n}`, cx, top + w * 0.5 + 100);
    if (o.cause) { ctx.font = FONT(700, 26); ctx.fillStyle = '#3a3a44'; const lines = String(o.cause).split('\n'); lines.forEach((l, i) => ctx.fillText(l, cx, top + w * 0.5 + 170 + i * 34)); }
    ctx.font = FONT(700, 24); ctx.fillStyle = `rgba(255,255,255,${0.85 * a})`; ctx.fillText('GEARS & GLITCHES', cx, H_ * 0.9);
    ctx.restore();
  };
  // a small floating label (numbers, signs): a rounded dark pill with white text, popping in
  const tagLabel = (ctx, x, y, txt, u, o = {}) => {
    if (u <= 0) return; const s = H.ease.back(H.clamp(u)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.font = FONT(800, o.px || 40);
    const w = ctx.measureText(txt).width + 36, h = (o.px || 40) * 1.5; ctx.fillStyle = o.bg || 'rgba(26,24,32,0.88)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
    ctx.fillStyle = o.col || '#ffd24a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 2); ctx.restore();
  };
  // a parabolic hop from a to b with peak height h (u = 0..1)
  const hop = (a, b, h, u) => add(lerp3(a, b, u), [0, 4 * h * u * (1 - u), 0]);
  // sounds for the end: a sad trombone "wah wah wah waaah" as the R.I.P. card rises
  const ripSound = (k, t) => { ['G4', 'F#4', 'F4', 'E4'].forEach((n, i) => k.tone(t + i * 0.42, { f: i < 3 ? n : [[0, 'E4'], [0.9, 'D#4']], type: 'sawtooth', dur: i < 3 ? 0.38 : 1.1, gain: 0.07, a: 0.03, hold: i < 3 ? 0.25 : 0.9, filter: 'lowpass', f2: 1300 })); k.play('thud', t, { f: 70, gain: 0.25 }); };
  // the R.I.P. card's progress at time t (it rises half a second after the voice ends)
  const ripU = (t) => ramp(t, REEL_WORDS.end + 0.45, 0.7);
  // a world point in Dave's own frame (for hand targets): Dave at pos, turned by yaw, scale s
  const daveLocal = (pos, yaw, w, s = 1) => mul(rotY(sub(w, pos), -yaw), 1 / s);
