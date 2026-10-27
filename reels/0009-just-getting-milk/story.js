  // ==================== 0009 "Just getting milk." : a sarcastic couple reel ====================
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
    ['hook', 0], ['quick', V('quick', 'quick') - 0.15], ['hours', V('hours', 'two') - 0.15], ['bags', V('bags', "he's") - 0.15], ['inside', V('inside', 'snacks') - 0.15],
    ['she', V('she', 'she') - 0.15], ['milk', V('milk', 'babe') - 0.15], ['silence', V('silence', 'he') - 0.15], ['again', V('again', "i'll") - 0.15],
    ['close', V('close', 'see') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);
  const CAPS = [
    [V('hook', 'he'), [['HE', 'SAYS,', '"I\'M', 'JUST'], ['GETTING', K('MILK."')]]],
    [V('quick', 'quick'), [[K('QUICK'), 'TRIP.']]],
    [V('quick', 'ten'), [[K('TEN'), 'MINUTES,'], ['TOPS.']]],
    [V('hours', 'two'), [[K('TWO'), K('HOURS')], ['LATER.']]],
    [V('bags', "he's"), [["HE'S", 'BACK', 'WITH'], [K('TWELVE'), 'BAGS,']]],
    [V('bags', 'and'), [['AND', 'A', 'VERY'], [K('PROUD'), 'FACE.']]],
    [V('inside', 'snacks'), [[K('SNACKS.')]]],
    [V('inside', 'three'), [['THREE', 'KINDS', 'OF'], [K('CHEESE.')]]],
    [V('inside', 'a'), [['A', 'GIANT', 'INFLATABLE'], [K('FLAMINGO.')]]],
    [V('she', 'she'), [['SHE', 'CHECKS', 'EVERY'], [K('SINGLE'), 'BAG.']]],
    [V('she', 'twice'), [[K('TWICE.')]]],
    [V('she', 'then'), [['THEN', 'A', K('THIRD'), 'TIME.']]],
    [V('milk', 'babe'), [['"BABE.']]],
    [V('milk', "where's"), [["WHERE'S", 'THE'], [K('MILK?"')]]],
    [V('silence', 'he'), [['HE', 'CHECKS', 'THE'], [K('RECEIPT.')]]],
    [V('silence', 'silence'), [[K('SILENCE.')]]],
    [V('again', "i'll"), [['"I\'LL', 'BE'], [K('RIGHT'), 'BACK."']]],
    [V('close', 'see'), [['SEE', 'YOU', 'IN'], [K('TWO'), K('HOURS.')]]],
  ];
  const caps = makeCaps(CAPS);

  const bagTop = (c, w, h) => { c.fillStyle = '#7a5a36'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(w * 0.08, h * 0.12, w * 0.84, h * 0.76); };
  const bagFace = (c, w, h) => { c.fillStyle = '#c9a070'; c.fillRect(0, 0, w, h); c.fillStyle = '#5a9a4a'; c.beginPath(); c.arc(w / 2, h * 0.5, w * 0.2, 0, Math.PI * 2); c.fill(); c.fillStyle = '#c9a070'; c.beginPath(); c.arc(w / 2, h * 0.5, w * 0.12, 0, Math.PI * 2); c.fill(); };
  const bag = (S, c, yaw = 0) => S.rbox((p) => add(rotY(p, yaw), c), 0.12, 0.17, 0.08, [201, 160, 112], { bevel: 0.15, topPaint: bagTop, paint: bagFace });
  const BAGS = [[-0.45, 0.57, 1.05, 0.1], [0.0, 0.57, 1.1, -0.2], [0.42, 0.57, 1.05, 0.25], [-1.3, 0.17, 1.4, 0.3], [-1.1, 0.17, 1.8, -0.2], [1.3, 0.17, 1.4, -0.3], [1.15, 0.17, 1.85, 0.2], [-0.7, 0.17, 2.0, 0.1], [0.65, 0.17, 2.05, -0.15], [-1.55, 0.17, 0.9, 0.0], [1.6, 0.17, 0.95, 0.1], [0.0, 0.17, 2.1, 0.3]];
  const allBags = (S) => BAGS.forEach(([x, y, z, yw]) => bag(S, [x, y, z], yw));
  // the flamingo poking out of the middle bag
  const flamingo = (S, c, u = 1) => { if (u <= 0) return; const pk = [242, 120, 160]; const base = add(c, [0, 0.2, 0]), mid = add(base, [-0.06, 0.22 * u, 0.03]), neckTop = add(base, [0.05, 0.42 * u, 0.04]); S.ball(add(base, [0, 0.04, 0]), [0.17, 0.1 * u, 0.1], pk, { bias: -0.3 }); S.limb(base, mid, 0.045, 0.04, pk, { bias: -0.32 }); S.limb(mid, neckTop, 0.04, 0.035, pk, { bias: -0.33 }); S.ball(neckTop, 0.075, pk, { bias: -0.34 }); S.ball(add(neckTop, [0.035, 0.02, 0.06]), 0.014, [30, 26, 30], { bias: -0.37, rim: false }); S.limb(add(neckTop, [0.05, -0.01, 0.04]), add(neckTop, [0.15, -0.08, 0.07]), 0.026, 0.012, [40, 30, 34], { bias: -0.36 }); };
  const flamingo2D = (ctx, x, y, s, u, t) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 3) * 0.06); ctx.scale(s * u, s * u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
    ctx.strokeStyle = '#d65a8a'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-5, 40); ctx.lineTo(-10, 120); ctx.moveTo(10, 40); ctx.lineTo(18, 90); ctx.lineTo(0, 100); ctx.stroke();
    ctx.fillStyle = '#f47aa6'; ctx.beginPath(); ctx.ellipse(0, 20, 70, 42, -0.15, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#f47aa6'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(45, 5); ctx.bezierCurveTo(95, -30, 20, -70, 40, -110); ctx.stroke();
    ctx.fillStyle = '#f47aa6'; ctx.beginPath(); ctx.arc(48, -118, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a2024'; ctx.beginPath(); ctx.moveTo(62, -126); ctx.quadraticCurveTo(92, -118, 86, -96); ctx.lineTo(64, -108); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(50, -124, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-20, 8, 30, 12, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
  const milkIcon = (ctx, x, y, s, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10; ctx.fillStyle = '#f6f4ee'; ctx.beginPath(); ctx.moveTo(-30, -20); ctx.lineTo(-30, 50); ctx.lineTo(30, 50); ctx.lineTo(30, -20); ctx.lineTo(0, -50); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#3d8bf2'; ctx.fillRect(-30, 5, 60, 26); label(ctx, 'MILK', 0, 19, 18, '#ffffff'); ctx.restore(); };
  const cheese = (ctx, x, y, s, u, col = '#ffd040') => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-40, 25); ctx.lineTo(40, 25); ctx.lineTo(40, -5); ctx.lineTo(-40, -25); ctx.closePath(); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = 'rgba(160,110,20,0.35)'; [[-15, 10], [15, 5], [25, 15]].forEach(([a, b2]) => { ctx.beginPath(); ctx.arc(a, b2, 6, 0, Math.PI * 2); ctx.fill(); }); ctx.restore(); };
  const chips = (ctx, x, y, s, u) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(-0.15); ctx.scale(s * u, s * u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.fillStyle = '#e8483a'; ctx.beginPath(); ctx.roundRect(-38, -50, 76, 100, 14); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.fillStyle = '#ffd040'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
  const receipt = (S, c) => S.rbox((p) => add(rotX(p, -0.25), c), 0.07, 0.24, 0.005, [248, 246, 240], { bevel: 0.2, bias: -0.5, paint: (cc, w, h) => { cc.fillStyle = '#f8f6f0'; cc.fillRect(0, 0, w, h); cc.fillStyle = 'rgba(40,40,50,0.55)'; for (let i = 0; i < 26; i++) cc.fillRect(w * 0.12, h * (0.04 + i * 0.036), w * (0.4 + ((i * 37) % 30) / 100), h * 0.012); } });

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // two-shot: keys up, very confident
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], UP], head: { yaw: 0.35, tilt: -0.08 }, face: { look: [0.6, 0], mouth: 'smile', brows: 0.2 } });
      const g = SHE(S, { arms: POSE.phone, head: { yaw: -0.15, pitch: -0.25 }, face: { look: [-0.2, -0.5], mouth: 'flat' } });
      phone(S, add(midHands(g), [0, 0.05, 0.02]), -0.2, 1.1);
      S.render(ctx, W, H_, { dof: 0.28 });
      milkIcon(ctx, 560, 900, 1.3, popU(t, V('hook', 'milk'), 0.3));
    } else if (name === 'quick') { // him: ten minutes, tops
      const S = room(W, H_, t, a, b, 'him');
      HE(S, { arms: [[0.35, 0.18, 0.7], UP], head: { yaw: 0.15, tilt: -0.1 }, face: { look: [0.2, 0], lids: 0.3, mouth: 'smile', brows: -0.2 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      if (card(ctx, 150, 940, 210, 100, popU(t, V('quick', 'ten'), 0.3), '#1c1a2a', -0.06)) { label(ctx, '10 MIN', 0, 2, 46, '#ffd23f'); ctx.restore(); }
    } else if (name === 'hours') { // outside: night has fallen, two hours later
      const [E, TG] = shotCam(t, a, b, [0.0, 1.6, 7.5], [0, 1.2, -1.5], [0.0, 1.55, 6.8], [0, 1.2, -1.5]);
      const S = Scene(E, TG, W, H_);
      nightSky(ctx, W, H_, t); nightStreet(ctx, S, t, 1);
      S.render(ctx, W, H_, { dof: 0, bg: 'rgba(0,0,0,0)' });
      if (card(ctx, W / 2, 470, 420, 110, popU(t, V('hours', 'two'), 0.35), '#fff8ec', -0.04)) { label(ctx, '2 HOURS LATER', 0, 2, 46, '#1c1a22'); ctx.restore(); }
    } else if (name === 'bags') { // wide: twelve bags, one proud man
      const S = room(W, H_, t, a, b, [[0.2, 1.7, 4.4], [0, 0.8, 0.2], [0.12, 1.65, 3.9], [0, 0.82, 0.2]], { table: true });
      HE(S, { arms: POSE.cheer, head: { yaw: 0.1, pitch: 0.1 }, face: { eyes: 'happy', mouth: 'open', blush: 0.4 } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.3, pitch: -0.2 }, face: { eyes: 'wide', look: [-0.3, -0.5], mouth: 'o', brows: 0.4 } });
      allBags(S); flamingo(S, [0.0, 0.57, 1.1], 1);
      S.render(ctx, W, H_, { dof: 0.3 });
      const n = Math.min(12, Math.floor((t - V('bags', 'twelve')) / 0.06) + 1); if (t >= V('bags', 'twelve') && card(ctx, 590, 940, 160, 90, 1, '#1c1a2a', 0.06)) { label(ctx, 'x' + n, 0, 2, 50, '#ffd23f'); ctx.restore(); }
    } else if (name === 'inside') { // low on the table: what's in the bags
      const S = room(W, H_, t, a, b, [[0.0, 1.95, 2.15], [0, 0.42, 1.05], [0.0, 1.85, 2.0], [0, 0.42, 1.05]], { table: true });
      HE(S, { arms: POSE.cheer, face: { eyes: 'happy', mouth: 'open' } }); SHE(S, { arms: POSE.clasp, face: { eyes: 'wide', mouth: 'o' } });
      allBags(S);
      S.render(ctx, W, H_, { dof: 0.3 });
      const fl = t >= V('inside', 'a');
      if (!fl) { chips(ctx, 170, 520, 1.3, popU(t, V('inside', 'snacks'), 0.3)); ['#ffd040', '#f4e6b0', '#f0a640'].forEach((c, i) => cheese(ctx, 330 + i * 130, 540 - (i % 2) * 40, 1.2, popU(t, V('inside', 'three') + i * 0.12, 0.3), c)); }
      else { flamingo2D(ctx, W / 2, 640, 2.2, popU(t, V('inside', 'flamingo') - 0.15, 0.4), t); const r = H.rng(5); for (let i = 0; i < 6; i++) FX.sparkle(ctx, W / 2 + r.range(-260, 260), 640 + r.range(-260, 260), 28 * popU(t, V('inside', 'flamingo') + i * 0.07, 0.3), t * 2 + i); }
      flash = 0.18 * Math.exp(-Math.pow((t - V('inside', 'flamingo')) * 7, 2));
    } else if (name === 'she') { // her: going through every bag
      const S = room(W, H_, t, a, b, [[0.5, 1.6, 2.6], [0.35, 0.95, 0.3], [0.5, 1.58, 2.3], [0.35, 0.98, 0.3]], { table: true });
      const g = SHE(S, { lean: 0.3, arms: [[1.2 + Math.sin(t * 8) * 0.2, -0.1, 0.4], [1.2 - Math.sin(t * 8) * 0.2, -0.1, 0.4]], head: { yaw: -0.1, pitch: -0.35 }, face: { look: [0, -0.6], lids: 0.35, mouth: 'flat', brows: -0.35 } });
      HE(S, { arms: POSE.clasp, head: { yaw: 0.45 }, face: { look: [0.6, 0], mouth: 'smile' } });
      allBags(S);
      S.render(ctx, W, H_, { dof: 0.25 });
      const n = t >= V('she', 'then') ? 3 : t >= V('she', 'twice') ? 2 : 1; if (card(ctx, 140, 940, 160, 90, popU(t, V('she', 'bag'), 0.3), '#1c1a2a', -0.06)) { label(ctx, 'x' + n, 0, 2, 50, '#ffd23f'); ctx.restore(); }
    } else if (name === 'milk') { // her: one question
      const S = room(W, H_, t, a, b, 'her');
      HE(S, { head: { yaw: 0.45 }, face: { mouth: 'smile' } });
      const w = t >= V('milk', "where's");
      const g = SHE(S, { arms: w ? [[0.2, 1.4, 0.1], [0.35, 0.18, 0.7]] : POSE.clasp, head: { yaw: -0.35, tilt: w ? 0.08 : 0 }, face: { look: [-0.6, 0], lids: 0.35, mouth: 'flat', brows: w ? -0.5 : -0.2 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      milkIcon(ctx, 580, 930, 1.3, popU(t, V('milk', 'milk'), 0.3)); FX.qmark(ctx, 640, 820, 0.6 * popU(t, V('milk', 'milk') + 0.15, 0.3));
    } else if (name === 'silence') { // him: the receipt, the silence
      const S = room(W, H_, t, a, b, 'him');
      const sl = t >= V('silence', 'silence');
      const bd = HE(S, { arms: [[1.15, 0.05, 1.0], [1.15, 0.05, 1.0]], head: { yaw: 0.05, pitch: sl ? 0.05 : -0.2 }, face: { eyes: sl ? 'wide' : 'open', look: [0, sl ? 0 : -0.5], mouth: sl ? 'flat' : 'flat', brows: sl ? 0.6 : 0.2 } });
      receipt(S, add(midHands(bd), [0, 0.14, 0.05]));
      S.render(ctx, W, H_, { dof: 0.22 });
      if (sl) { const hp = S.proj(bd.head); FX.sweat(ctx, hp[0] + 170, hp[1] - 140, 1.8 * popU(t, V('silence', 'silence'), 0.3)); FX.dots(ctx, [[hp[0] - 220, hp[1] - 200], [hp[0] - 120, hp[1] - 230]], ramp(t, V('silence', 'silence'), 1.0)); }
    } else if (name === 'again') { // two-shot: keys up again, sheepish
      const S = room(W, H_, t, a, b, 'two');
      const bd = HE(S, { arms: [[0.35, 0.18, 0.7], UP], head: { yaw: 0.4, tilt: 0.12 }, face: { look: [0.6, 0], mouth: 'smile', brows: 0.45, blush: 0.7 } });
      SHE(S, { arms: POSE.clasp, head: { yaw: -0.4 }, face: { look: [-0.6, 0], lids: 0.5, mouth: 'flat', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      const hp = S.proj(bd.hands[1].p); FX.sparkle(ctx, hp[0], hp[1] - 50, 22 * popU(t, V('again', 'back'), 0.3), t * 3);
    } else { // the closer: her, deadpan wave
      const S = room(W, H_, t, a, b, 'her');
      const g = SHE(S, { arms: [[0.5, 0.05, 0.9], [2.1 + Math.sin(t * 9) * 0.15, -0.6, 0.1]], head: { yaw: -0.05, tilt: -0.12 }, face: { look: [0, 0], lids: 0.55, mouth: 'smile', brows: -0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(g.head); smug(ctx, hp[0] - 190, hp[1] - 150, t, popU(t, V('close', 'two'), 0.3));
      flash = 0.15 * Math.exp(-Math.pow((t - V('close', 'hours')) * 7, 2));
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  function scoreSound(k) {
    baseSound(k);
    k.play('coin', V('hook', 'milk'), { gain: 0.4 });
    k.play('success', V('quick', 'tops'), { f: 'G5', gain: 0.35 });
    k.play('tick', V('hours', 'two'), { f: 4000, gain: 0.3 }); k.play('tock', V('hours', 'hours'), { gain: 0.3 }); k.play('ding', V('hours', 'later'), { f: 'C5', gain: 0.3 });
    for (let i = 0; i < 12; i++) k.play('thud', V('bags', 'twelve') + i * 0.06, { f: 140 + i * 6, gain: 0.18, minor: true });
    k.play('powerup', V('bags', 'proud'), { gain: 0.35 });
    k.play('pop', V('inside', 'snacks'), { f: 700, gain: 0.5 }); [0, 1, 2].forEach((i) => k.play('pop', V('inside', 'three') + i * 0.12, { f: 800 + i * 120, gain: 0.4 }));
    k.play('riser', V('inside', 'a'), { dur: 0.6, gain: 0.3 }); k.play('impact', V('inside', 'flamingo'), { gain: 0.5 }); k.play('sparkle', V('inside', 'flamingo') + 0.1, { gain: 0.5 });
    for (let i = 0; i < 6; i++) k.play('paper', V('she', 'checks') + i * 0.3, { gain: 0.25, minor: true });
    k.play('select', V('milk', 'milk'), { gain: 0.45 });
    for (let i = 0; i < 4; i++) k.tone(V('silence', 'silence') + 0.2 + i * 0.3, { f: 4200, type: 'sine', dur: 0.08, gain: 0.05 }); // crickets
    twistSound(k, V('again', 'back'));
    k.play('stamp', V('close', 'hours'), { gain: 0.45 });
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
