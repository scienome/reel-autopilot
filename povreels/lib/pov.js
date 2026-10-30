  // ==================== POV kit: shared characters and overlays for the "YOU are the only one" series ====================
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
  // a sitting cat facing +z: o = { x, y, z, yaw, s, col, belly, mood: 'calm'|'smug'|'mad'|'sad'|'happy', look, tilt, t }
  const cat = (S, o) => {
    const s = o.s || 1, base = [o.x || 0, o.y || 0, o.z || 0], yaw = o.yaw || 0, col = o.col || [90, 90, 98], belly = o.belly || shade(col, 1.35);
    const P = (p) => add(rotY(mul(p, s), yaw), base), hc = [0, 0.56, 0.04];
    const H_ = (p) => P(add(rotZ(sub(p, hc), o.tilt || 0), hc));
    S.shadow(P([0, 0, 0.02]), 0.24 * s, 0.16 * s, 0.35);
    S.ball(P([0, 0.24, 0]), [0.16, 0.24, 0.15], col); S.ball(P([0, 0.3, 0.08]), [0.1, 0.13, 0.08], belly);
    for (const sd of [-1, 1]) { S.limb(P([sd * 0.06, 0.24, 0.1]), P([sd * 0.06, 0.03, 0.13]), 0.035 * s, 0.03 * s, col); S.ball(P([sd * 0.06, 0.025, 0.15]), [0.04 * s, 0.025 * s, 0.05 * s], belly); }
    const tw = Math.sin((o.t || 0) * 2.5); S.limb(P([0.08, 0.06, -0.12]), P([0.24 + 0.05 * tw, 0.36, -0.1]), 0.03 * s, 0.02 * s, col);
    S.ball(H_(hc), [0.15, 0.13, 0.13], col); S.ball(H_([0, 0.51, 0.13]), [0.07, 0.05, 0.05], belly);
    S.ball(H_([0, 0.54, 0.175]), 0.018 * s, [230, 120, 140], { rim: false });
    for (const sd of [-1, 1]) { S.limb(H_([sd * 0.08, 0.64, 0.02]), H_([sd * 0.12, 0.79, 0.0]), 0.05 * s, 0.006 * s, col); S.limb(H_([sd * 0.085, 0.66, 0.035]), H_([sd * 0.115, 0.75, 0.03]), 0.022 * s, 0.004 * s, [240, 170, 180]);
      for (const k of [-1, 1]) S.limb(H_([sd * 0.06, 0.51 + k * 0.012, 0.15]), H_([sd * 0.2, 0.52 + k * 0.03, 0.13]), 0.003 * s, 0.002 * s, [240, 240, 240]); }
    const mood = o.mood || 'calm', look = o.look || [0, 0], lid = mood === 'smug' ? 0.6 : mood === 'sad' ? 0.3 : mood === 'mad' ? 0.35 : 0.1;
    for (const sd of [-1, 1]) { const e = [sd * 0.058, 0.585, 0.14];
      S.ball(H_(e), [0.034 * s, 0.036 * s, 0.02 * s], [196, 214, 90], { rim: false }); S.ball(H_(add(e, [look[0] * 0.01, look[1] * 0.01, 0.014])), [0.008 * s, 0.026 * s, 0.01 * s], [20, 20, 22], { rim: false });
      S.ball(H_(add(e, [-0.008, 0.012, 0.02])), 0.006 * s, [255, 255, 255], { rim: false });
      if (lid) S.ball(H_(add(e, [0, 0.026, 0.004])), [0.038 * s, 0.022 * s * (0.6 + lid), 0.026 * s], col, { rim: false });
      if (mood === 'mad') S.limb(H_([sd * 0.025, 0.63, 0.15]), H_([sd * 0.09, 0.615, 0.13]), 0.009 * s, 0.008 * s, DOGDARK); }
  };
  // a floating card above a 3D point: a title line and a big text line (search history, lie counters...)
  const floatCard = (ctx, S, at, title, txt, u, col = '#ffffff', ink = '#1c1a22', dx = 0, minY = 300) => {
    if (u <= 0) return; const p = S.proj(at); ctx.save(); ctx.font = FONT(800, 30); const w = Math.min(640, Math.max(ctx.measureText(txt).width, 260) + 60), x = Math.min(720 - w / 2 - 16, Math.max(w / 2 + 16, p[0] + dx)), y = Math.max(minY, p[1] - 90);
    ctx.translate(x, y); ctx.scale(u, u); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-w / 2, -44, w, 88, 22); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.font = FONT(700, 20); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(title, -w / 2 + 24, -20);
    ctx.fillStyle = ink; ctx.font = FONT(800, 30); let fs = 30; while (ctx.measureText(txt).width > w - 48 && fs > 18) ctx.font = FONT(800, (fs -= 2)); ctx.fillText(txt, -w / 2 + 24, 14); ctx.restore(); };
  // a round counter badge above a 3D point (big number, small label)
  const badge = (ctx, S, at, n, label, u, col = '#e8384f') => { if (u <= 0) return; const p = S.proj(at); ctx.save(); ctx.translate(p[0], Math.max(450, p[1] - 80)); ctx.scale(u, u);
    ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 12; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 58, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent'; ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = FONT(900, String(n).length > 2 ? 40 : 52); ctx.fillText(String(n), 0, -4); ctx.font = FONT(800, 16); ctx.fillText(label, 0, 34); ctx.restore(); };
  // a bird facing +z (parrot, pigeon, seagull...): o = { x, y, z, yaw, s, col, belly, wing, beak, crest, mood, look, flap, t }
  const bird = (S, o) => {
    const s = o.s || 1, base = [o.x || 0, o.y || 0, o.z || 0], yaw = o.yaw || 0, col = o.col || [60, 170, 80], belly = o.belly || shade(col, 1.25), wing = o.wing || shade(col, 0.8);
    const P = (p) => add(rotY(mul(p, s), yaw), base), t = o.t || 0, bob = Math.sin(t * 3) * 0.01;
    S.shadow(P([0, 0, 0.02]), 0.12 * s, 0.1 * s, 0.3);
    for (const sd of [-1, 1]) S.limb(P([sd * 0.04, 0.1, 0]), P([sd * 0.04, 0.0, 0.03]), 0.012 * s, 0.01 * s, [230, 160, 60]);
    S.ball(P([0, 0.2 + bob, 0]), [0.1, 0.13, 0.1], col); S.ball(P([0, 0.18 + bob, 0.05]), [0.07, 0.09, 0.06], belly);
    S.limb(P([0, 0.12, -0.08]), P([0, 0.04, -0.2]), 0.04 * s, 0.015 * s, wing);
    const fl = o.flap ? Math.sin(t * 22) * 0.6 : 0;
    for (const sd of [-1, 1]) S.limb(P([sd * 0.09, 0.26 + bob, -0.01]), P([sd * (0.12 + Math.abs(fl) * 0.12), 0.12 + bob + fl * 0.1, -0.06]), 0.05 * s, 0.02 * s, wing);
    const hy = 0.36 + bob; S.ball(P([0, hy, 0.02]), 0.085 * s, col);
    if (o.crest) for (let i = 0; i < 3; i++) S.limb(P([0, hy + 0.06, 0.0]), P([(i - 1) * 0.03, hy + 0.15, -0.04]), 0.015 * s, 0.006 * s, o.crest);
    S.limb(P([0, hy - 0.005, 0.08]), P([0, hy - 0.03, 0.15]), 0.028 * s, 0.006 * s, o.beak || [245, 190, 50]);
    const look = o.look || [0, 0], lid = o.mood === 'smug' ? 0.5 : o.mood === 'sad' ? 0.25 : 0;
    for (const sd of [-1, 1]) { const e = [sd * 0.045, hy + 0.025, 0.065]; S.ball(P(e), 0.026 * s, [250, 250, 250], { rim: false }); S.ball(P(add(e, [look[0] * 0.008, look[1] * 0.008 - lid * 0.008, 0.016])), 0.016 * s, [20, 18, 20], { rim: false, gloss: 0.9 });
      if (lid) S.ball(P(add(e, [0, 0.016, 0.004])), [0.028 * s, 0.016 * s * (0.6 + lid), 0.024 * s], col, { rim: false });
      if (o.mood === 'mad') S.limb(P([sd * 0.02, hy + 0.06, 0.08]), P([sd * 0.07, hy + 0.075, 0.07]), 0.007 * s, 0.006 * s, [30, 24, 20]); } };
  // a goldfish facing +z, swimming in place: o = { x, y, z, yaw, s, col, mood, look, t }
  const fish = (S, o) => {
    const s = o.s || 1, base = [o.x || 0, o.y || 0, o.z || 0], yaw = (o.yaw || 0) + Math.sin((o.t || 0) * 2) * 0.25, col = o.col || [250, 140, 40];
    const P = (p) => add(rotY(mul(p, s), yaw), base), w = Math.sin((o.t || 0) * 9) * 0.04;
    S.ball(P([0, 0, 0]), [0.08, 0.09, 0.13], col); S.limb(P([0, 0, -0.1]), P([w, 0.03, -0.22]), 0.05 * s, 0.07 * s, shade(col, 1.15));
    S.limb(P([0, 0.07, -0.02]), P([0, 0.13, -0.06]), 0.03 * s, 0.01 * s, shade(col, 1.15));
    const look = o.look || [0, 0];
    for (const sd of [-1, 1]) { const e = [sd * 0.055, 0.025, 0.07]; S.ball(P(e), 0.03 * s, [250, 250, 250], { rim: false }); S.ball(P(add(e, [look[0] * 0.01, look[1] * 0.01, 0.018])), 0.018 * s, [20, 18, 20], { rim: false, gloss: 0.9 }); }
    S.ball(P([0, -0.03, 0.12]), [0.022, o.mood === 'wow' ? 0.03 : 0.012, 0.01], [120, 30, 40], { rim: false }); };
  // a cow facing +z: o = { x, y, z, yaw, s, mood, look, t }
  const cow = (S, o) => {
    const s = o.s || 1, base = [o.x || 0, o.y || 0, o.z || 0], yaw = o.yaw || 0, W_ = [245, 243, 238], B = [40, 36, 40], P = (p) => add(rotY(mul(p, s), yaw), base);
    S.shadow(P([0, 0, 0]), 0.5 * s, 0.35 * s, 0.35);
    for (const [a, b] of [[-0.2, 0.3], [0.2, 0.3], [-0.2, -0.3], [0.2, -0.3]]) S.limb(P([a, 0.5, b]), P([a, 0.02, b]), 0.07 * s, 0.06 * s, W_);
    S.ball(P([0, 0.62, 0]), [0.32, 0.26, 0.46], W_); for (const q of [[0.15, 0.72, 0.1], [-0.18, 0.6, -0.2], [0.05, 0.75, -0.25]]) S.ball(P(q), [0.12, 0.1, 0.12], B, { rim: false });
    S.ball(P([0, 0.85, 0.45]), [0.17, 0.17, 0.17], W_); S.ball(P([0, 0.78, 0.6]), [0.13, 0.09, 0.08], [240, 170, 170]);
    for (const sd of [-1, 1]) { S.limb(P([sd * 0.12, 0.97, 0.45]), P([sd * 0.2, 1.06, 0.44]), 0.025 * s, 0.012 * s, [240, 230, 200]); S.ball(P([sd * 0.2, 0.9, 0.42]), [0.07, 0.03, 0.04], W_);
      const e = [sd * 0.07, 0.9, 0.59], look = o.look || [0, 0]; S.ball(P(e), 0.035 * s, [250, 250, 250], { rim: false }); S.ball(P(add(e, [look[0] * 0.01, look[1] * 0.01 - (o.mood === 'sad' ? 0.008 : 0), 0.02])), 0.022 * s, [20, 18, 20], { rim: false, gloss: 0.9 }); } };
  // big cartoon eyes on an object (a fridge, a phone, a car dash): screen space at a 3D point; mood 'calm' | 'mad' | 'sad' | 'happy' | 'tired'
  const objFace = (ctx, S, at, mood, t, size = 1) => { const p = S.proj(at); if (p[2] < 0.2) return; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(size, size);
    for (const sd of [-1, 1]) { const rx = 34, ry = mood === 'tired' ? 10 : mood === 'sad' ? 18 : 28; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1c1a22'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(sd * 60, 0, rx, ry, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#1c1a22'; ctx.beginPath(); ctx.arc(sd * 60 + Math.sin(t * 0.8) * 6, 3, Math.min(12, ry * 0.6), 0, TAU); ctx.fill();
      if (mood === 'mad' || mood === 'sad') { ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(sd * 28, mood === 'mad' ? -32 : -24); ctx.lineTo(sd * 92, mood === 'mad' ? -20 : -36); ctx.stroke(); } }
    ctx.lineWidth = 6; ctx.strokeStyle = '#1c1a22'; ctx.beginPath(); if (mood === 'happy') ctx.arc(0, 40, 30, 0.2, Math.PI - 0.2); else if (mood === 'sad' || mood === 'tired') ctx.arc(0, 70, 26, Math.PI + 0.3, -0.3); else { ctx.moveTo(-22, 50); ctx.lineTo(22, 50); } ctx.stroke(); ctx.restore(); };
