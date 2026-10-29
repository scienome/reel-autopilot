  // ==================== POV 001 "You can hear what dogs think" ====================
  // The camera is YOU: nobody from the couple is shown, dogs look into the lens and their thoughts pop up as clouds.
  // an expressive sitting dog facing +z (rotated by yaw): o = { x, y, z, yaw, s, col, belly, ears: 'flop'|'up'|'big',
  //   mood: 'calm'|'sad'|'smug'|'mad'|'happy', tongue, tilt (head roll), look [dx, dy], fluffy (poodle puffs), grey (old muzzle) }
  const DOGDARK = [36, 28, 26];
  const dog = (S, o) => {
    const s = o.s || 1, base = [o.x || 0, o.y || 0, o.z || 0], yaw = o.yaw || 0, col = o.col || [200, 150, 90], belly = o.belly || shade(col, 1.25);
    const P = (p) => add(rotY(mul(p, s), yaw), base), hc = [0, 0.66, 0.05];
    const H_ = (p) => P(add(rotZ(sub(p, hc), o.tilt || 0), hc)); // head space (rolls with o.tilt)
    S.shadow(P([0, 0, 0.02]), 0.3 * s, 0.2 * s, 0.35);
    S.ball(P([0, 0.3, 0]), [0.2, 0.27, 0.19], col); S.ball(P([0, 0.38, 0.1]), [0.14, 0.15, 0.1], belly);
    for (const sd of [-1, 1]) { S.ball(P([sd * 0.14, 0.12, -0.03]), [0.09, 0.1, 0.15], col); S.limb(P([sd * 0.08, 0.3, 0.11]), P([sd * 0.08, 0.04, 0.15]), 0.06 * s, 0.05 * s, col); S.ball(P([sd * 0.08, 0.03, 0.18]), [0.05 * s, 0.03 * s, 0.06 * s], belly); }
    S.limb(P([0, 0.1, -0.18]), P([0.05, 0.3 + 0.04 * Math.sin((o.t || 0) * 9), -0.32]), 0.035 * s, 0.02 * s, col);
    if (o.fluffy) [[0, 0.82, 0], [-0.12, 0.76, 0], [0.12, 0.76, 0], [0, 0.35, 0.05], [-0.16, 0.12, 0.05], [0.16, 0.12, 0.05]].forEach((q) => S.ball(H_(q), 0.09 * s, belly));
    S.ball(H_(hc), [0.17, 0.16, 0.16], o.grey ? shade(col, 1.1) : col);
    S.ball(H_([0, 0.615, 0.19]), [0.095, 0.072, 0.09], o.grey ? [215, 215, 215] : belly);
    S.ball(H_([0, 0.655, 0.275]), 0.032 * s, [20, 18, 20], { gloss: 0.8 });
    if (o.tongue) S.ball(H_([0.01, 0.565, 0.245]), [0.035 * s, 0.032 * s, 0.02 * s], [236, 110, 130]);
    const mood = o.mood || 'calm', look = o.look || [0, 0], lid = mood === 'smug' ? 0.55 : mood === 'sad' ? 0.25 : 0;
    for (const sd of [-1, 1]) {
      const e = [sd * 0.07, 0.71, 0.17];
      S.ball(H_(e), 0.04 * s, [250, 250, 250], { rim: false }); S.ball(H_(add(e, [look[0] * 0.012, look[1] * 0.012 - lid * 0.01, 0.022])), 0.026 * s, [34, 24, 20], { rim: false, gloss: 0.9 });
      S.ball(H_(add(e, [-0.01, 0.012 - lid * 0.01, 0.042])), 0.009 * s, [255, 255, 255], { rim: false });
      if (lid) S.ball(H_(add(e, [0, 0.022, 0.006])), [0.042 * s, 0.026 * s * (0.6 + lid), 0.036 * s], o.grey ? shade(col, 1.1) : col, { rim: false });
      const inner = mood === 'sad' ? 0.03 : mood === 'mad' ? -0.025 : mood === 'smug' ? (sd > 0 ? 0.02 : -0.005) : 0.01;
      S.limb(H_([sd * 0.035, 0.765 + inner, 0.185]), H_([sd * 0.105, 0.77 - (mood === 'sad' ? 0.015 : 0), 0.165]), 0.012 * s, 0.01 * s, DOGDARK);
      const ec = o.earCol || shade(col, 0.75);
      if (o.ears === 'up') S.limb(H_([sd * 0.11, 0.78, 0.02]), H_([sd * 0.15, 0.95, 0.0]), 0.05 * s, 0.012 * s, ec);
      else if (o.ears === 'big') S.limb(H_([sd * 0.12, 0.78, 0.02]), H_([sd * 0.28, 0.98, 0.0]), 0.075 * s, 0.015 * s, ec);
      else if (!o.fluffy) S.ball(H_([sd * 0.165, 0.64, 0.0]), [0.05 * s, 0.13 * s, 0.075 * s], ec);
    }
  };
  // a thought cloud above a 3D point: wrapped text, three little puffs trailing down to the head
  const thought = (ctx, S, at, txt, u, dx = 0) => {
    if (u <= 0) return; const p = S.proj(at); ctx.save(); ctx.font = FONT(800, 40); const words = txt.split(' '), lines = []; let ln = '';
    for (const w of words) { const tl = ln ? ln + ' ' + w : w; if (ctx.measureText(tl).width > 470 && ln) { lines.push(ln); ln = w; } else ln = tl; } lines.push(ln);
    const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 70, h = lines.length * 50 + 48, cx = Math.min(720 - w / 2 - 20, Math.max(w / 2 + 20, p[0] + dx)), cy = Math.min(1020 - h / 2, Math.max(h / 2 + 430, p[1] - 130 - h / 2));
    ctx.translate(cx, cy); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 40); ctx.fill();
    for (let i = 0; i < 3; i++) { const k = (i + 1) / 4, q = [(p[0] - cx) * k, h / 2 + (p[1] - 40 - cy - h / 2) * k]; ctx.beginPath(); ctx.arc(q[0], q[1], 16 - i * 4, 0, TAU); ctx.fill(); }
    ctx.shadowColor = 'transparent'; ctx.fillStyle = '#1c1a22'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    lines.forEach((l, i) => ctx.fillText(l, 0, -((lines.length - 1) * 50) / 2 + i * 50 + 2)); ctx.restore(); };
  const toaster = (S) => { S.rbox((p) => add(p, [-0.55, 1.08, -0.98]), 0.17, 0.11, 0.1, [200, 204, 212], { bevel: 0.5, gloss: 0.7 }); S.rbox((p) => add(p, [-0.55, 1.2, -0.98]), 0.1, 0.03, 0.02, [180, 140, 90], { bevel: 0.4 }); };
  const NOONE = { hide: true };
  const pu = (t, at) => popU(t, at, 0.3);
  makeCouch({
    keys: ['only', 'dogs', 'think', 'toaster', 'money', 'opinions', 'pug', 'ugly', 'husky', 'hot', 'chihuahua', 'dead', 'poodle', 'everything', 'twice', 'leak', 'old', 'scared', 'stay', 'cry', 'works', 'bacon', 'power', 'two'],
    shots: ({ V }) => ({
      // your dog on the couch, staring straight into you
      hook: { cam: [[0.05, 1.5, 2.6], [0, 1.27, -0.3], [0.03, 1.35, 1.7], [0, 1.27, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => dog(S, { x: 0, y: 0.47, z: -0.32, s: 1.1, mood: 'calm', tilt: t > V('hook', 'think') ? 0.25 : 0, t }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 1.35, -0.3], '...', pu(t, V('hook', 'think'))) },
      day1: { set: 'kitchen', cam: [[0.3, 1.6, 1.8], [-0.1, 0.97, -0.4], [0.25, 1.55, 1.5], [-0.1, 0.92, -0.4]], he: NOONE, she: NOONE,
        props: (S, t) => { toaster(S); dog(S, { x: 0.25, z: -0.35, s: 1.0, mood: t > V('day1', 'toaster') - 0.2 ? 'smug' : 'calm', t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0.25, 0.85, -0.35], 'He talks to the toaster like it owes him money.', pu(t, V('day1', 'He'))) },
      street: { set: 'street', cam: [[0, 1.5, 3.1], [0, 0.87, -0.2], [0, 1.45, 2.8], [0, 0.87, -0.2]], he: NOONE, she: NOONE,
        props: (S, t) => { dog(S, { x: -0.6, z: -0.2, s: 0.65, col: [214, 180, 130], earCol: [60, 46, 40], belly: [60, 46, 40], mood: 'mad', t });
          dog(S, { x: 0.05, z: -0.35, s: 1.15, col: [130, 136, 146], belly: [240, 240, 244], ears: 'up', mood: t > V('street', 'hot') - 0.2 ? 'smug' : 'calm', tongue: t > V('street', 'hot'), t });
          dog(S, { x: 0.62, z: -0.1, s: 0.45, col: [222, 186, 140], ears: 'big', mood: 'mad', t, look: [-1, 0] }); },
        over: (ctx, W, H_, t, S) => { const a = V('street', 'pug'), b = V('street', 'husky'), c = V('street', 'chihuahua');
          if (t < b - 0.1) thought(ctx, S, [-0.6, 0.6, -0.2], 'Ugly.', pu(t, a)); else if (t < c - 0.1) thought(ctx, S, [0.05, 1.15, -0.35], 'Hot.', pu(t, b)); else thought(ctx, S, [0.62, 0.45, -0.1], 'I will end you.', pu(t, c), -60); } },
      // the neighbour's poodle on the pavement; the plumber leaving with his toolbox, very relaxed
      neighbour: { set: 'street', cam: [[0.2, 1.5, 2.4], [0.2, 1.02, -0.3], [0.1, 1.45, 2.0], [0.2, 1.02, -0.3]], he: NOONE, she: NOONE,
        extras: (t) => [{ who: 'delivery', x: 0.95, z: -1.15, yaw: -0.6, sit: false, cap: [40, 90, 170], face: { mouth: 'smile', eyes: 'happy' }, hide: t < V('neighbour', 'plumber') - 0.2 }],
        props: (S, t) => dog(S, { x: -0.25, z: -0.2, s: 0.95, col: [246, 244, 240], fluffy: true, mood: 'smug', t }),
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.25, 1.0, -0.2], t < V('neighbour', 'leak') - 0.1 ? "I've seen things." : 'There was no leak.', pu(t, V('neighbour', 'saw'))),
        fx: [{ k: 'stamp', text: 'NO LEAK', x: 360, y: 1010, at: V('neighbour', 'leak'), col: '#ffd23f' }] },
      // 3 a.m.: your old grey-muzzled dog on the bed, right next to you
      night: { set: 'bedroom', cam: [[1.3, 1.15, 1.6], [0.05, 1.27, -0.45], [1.15, 1.1, 1.35], [0.05, 1.3, -0.45]], he: NOONE, she: NOONE, dof: 0.35,
        props: (S, t) => dog(S, { x: 0.05, y: 0.45, z: -0.45, yaw: 0.5, s: 1.05, col: [176, 130, 84], grey: true, mood: 'sad', tilt: 0.15, t: 0 }),
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore();
          thought(ctx, S, [0.05, 1.35, -0.45], t < V('night', 'But') - 0.1 ? "I'm old. I'm scared." : "But I'll stay until you're okay.", pu(t, V('night', 'thinks'))); } },
      // the same bed, the lights on: he is fine, very fine
      twist: { set: 'bedroom', cam: [[1.15, 1.1, 1.35], [0.05, 1.3, -0.45], [1.0, 1.08, 1.2], [0.05, 1.32, -0.45]], he: NOONE, she: NOONE, twist: V('twist', 'works'),
        props: (S, t) => dog(S, { x: 0.05, y: 0.45, z: -0.45, yaw: 0.5, s: 1.05, col: [176, 130, 84], grey: true, mood: t > V('twist', 'works') - 0.15 ? 'smug' : 'sad', tongue: t > V('twist', 'Bacon'), t }),
        over: (ctx, W, H_, t, S) => { if (t < V('twist', 'works') - 0.15) { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
          thought(ctx, S, [0.05, 1.35, -0.45], t < V('twist', 'Bacon') - 0.1 ? 'Works every time.' : 'Bacon tomorrow.', pu(t, V('twist', 'works'))); } },
      cta: { cam: [[0.05, 1.45, 2.0], [0, 1.27, -0.3], [0.05, 1.4, 1.8], [0, 1.27, -0.3]], he: NOONE, she: NOONE,
        props: (S, t) => dog(S, { x: 0, y: 0.47, z: -0.32, s: 1.1, mood: 'happy', tongue: true, tilt: -0.25, t }),
        fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
