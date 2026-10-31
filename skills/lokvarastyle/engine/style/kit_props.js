  // ==================== reel kit: props and the couple ====================
  const drawFood = (c, kind, s) => {
    c.save(); c.lineJoin = 'round';
    if (kind === 'pizza') {
      c.fillStyle = '#d98b3c'; c.beginPath(); c.moveTo(-s, -0.75 * s); c.quadraticCurveTo(0, -1.05 * s, s, -0.75 * s); c.lineTo(0, s); c.closePath(); c.fill();
      c.fillStyle = '#ffcf3a'; c.beginPath(); c.moveTo(-0.85 * s, -0.6 * s); c.quadraticCurveTo(0, -0.82 * s, 0.85 * s, -0.6 * s); c.lineTo(0, 0.9 * s); c.closePath(); c.fill();
      c.fillStyle = '#c8382c'; [[-0.35, -0.35], [0.3, -0.3], [0, 0.15], [-0.1, -0.6], [0.05, 0.5]].forEach(([x, y]) => { c.beginPath(); c.arc(x * s, y * s, 0.15 * s, 0, TAU); c.fill(); });
    } else if (kind === 'burger') {
      c.fillStyle = '#e09a48'; c.beginPath(); c.ellipse(0, -0.25 * s, s, 0.7 * s, 0, Math.PI, TAU); c.closePath(); c.fill();
      c.fillStyle = '#fff3d0'; [[-0.4, -0.6], [0, -0.75], [0.4, -0.58], [-0.15, -0.45], [0.2, -0.42]].forEach(([x, y]) => { c.beginPath(); c.ellipse(x * s, y * s, 0.07 * s, 0.04 * s, 0.3, 0, TAU); c.fill(); });
      c.fillStyle = '#5cb848'; c.beginPath(); c.moveTo(-1.05 * s, -0.2 * s); for (let i = 0; i <= 10; i++) c.lineTo((-1.05 + i * 0.21) * s, (i % 2 ? 0.0 : -0.12) * s); c.lineTo(1.05 * s, -0.25 * s); c.closePath(); c.fill();
      c.fillStyle = '#ffcf3a'; c.beginPath(); c.moveTo(-0.95 * s, -0.05 * s); c.lineTo(0.95 * s, -0.05 * s); c.lineTo(0.6 * s, 0.22 * s); c.lineTo(0.2 * s, 0.05 * s); c.lineTo(-0.5 * s, 0.2 * s); c.closePath(); c.fill();
      c.fillStyle = '#6a3a24'; c.beginPath(); c.roundRect(-0.98 * s, 0.02 * s, 1.96 * s, 0.34 * s, 0.17 * s); c.fill();
      c.fillStyle = '#e09a48'; c.beginPath(); c.roundRect(-0.95 * s, 0.4 * s, 1.9 * s, 0.32 * s, 0.16 * s); c.fill();
    } else { // sushi roll
      c.fillStyle = '#1e2a22'; c.beginPath(); c.arc(0, 0, s, 0, TAU); c.fill();
      c.fillStyle = '#f6f2ea'; c.beginPath(); c.arc(0, 0, 0.8 * s, 0, TAU); c.fill();
      c.fillStyle = '#f07a50'; c.beginPath(); c.arc(-0.08 * s, -0.05 * s, 0.36 * s, 0, TAU); c.fill();
      c.fillStyle = '#7ac85a'; c.beginPath(); c.arc(0.25 * s, 0.2 * s, 0.16 * s, 0, TAU); c.fill();
    }
    c.restore();
  };
  const foodScreen = (kind) => (c, w, h) => {
    c.fillStyle = '#121218'; c.fillRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fff6e2'); g.addColorStop(1, '#ffd8a6'); c.fillStyle = g; c.fillRect(w * 0.06, h * 0.04, w * 0.88, h * 0.92);
    c.fillStyle = '#e8483a'; c.fillRect(w * 0.06, h * 0.04, w * 0.88, h * 0.11);
    c.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 3; i++) c.fillRect(w * 0.14, h * (0.075 + i * 0.022), w * 0.12, h * 0.01);
    c.save(); c.translate(w / 2, h * 0.47); drawFood(c, kind, w * 0.3); c.restore();
    c.fillStyle = '#e8483a'; c.beginPath(); c.roundRect(w * 0.2, h * 0.78, w * 0.6, h * 0.08, h * 0.04); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.85)'; c.fillRect(w * 0.36, h * 0.81, w * 0.28, h * 0.02);
  };
  const boxLid = (c, w, h) => {
    c.fillStyle = '#c9955a'; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(90,50,20,0.35)'; c.lineWidth = 6; c.strokeRect(w * 0.06, h * 0.06, w * 0.88, h * 0.88);
    c.fillStyle = '#d8402e'; c.beginPath(); c.arc(w / 2, h * 0.45, w * 0.28, 0, TAU); c.fill();
    c.save(); c.translate(w / 2, h * 0.45); drawFood(c, 'pizza', w * 0.16); c.restore();
    c.fillStyle = '#7a3a1e'; c.font = FONT(900, Math.round(w * 0.14)); c.textAlign = 'center'; c.fillText('PIZZA', w / 2, h * 0.88);
  };
  const wholePizza = (c, w, h) => {
    c.fillStyle = '#c9955a'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#d98b3c'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.44, 0, TAU); c.fill();
    c.fillStyle = '#ffcf3a'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.38, 0, TAU); c.fill();
    const r = H.rng(12); c.fillStyle = '#c8382c'; for (let i = 0; i < 11; i++) { const a = r() * TAU, d = r.range(0.05, 0.32) * w; c.beginPath(); c.arc(w / 2 + Math.cos(a) * d, h / 2 + Math.sin(a) * d, w * 0.045, 0, TAU); c.fill(); }
    c.strokeStyle = 'rgba(150,90,30,0.5)'; c.lineWidth = 3; for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI; c.beginPath(); c.moveTo(w / 2 - Math.cos(a) * w * 0.4, h / 2 - Math.sin(a) * w * 0.4); c.lineTo(w / 2 + Math.cos(a) * w * 0.4, h / 2 + Math.sin(a) * w * 0.4); c.stroke(); }
  };
  const sticker = (ctx, x, y, r, kind) => {
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5; ctx.fillStyle = '#fff8ec'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(x, y); drawFood(ctx, kind, r * 0.55); ctx.restore();
  };

  // ---- the couple on the couch ----
  const sit = { legs: [[1.42, 1.38], [1.42, 1.38]] };
  const BOY = (S, o = {}) => S.doll(-0.62, 0.62, -0.42, o.yaw ?? 0.18, { kind: 'boy', ...sit, arms: o.arms || [[0.35, 0.18, 0.7], [0.5, 0.05, 0.9]], head: o.head || { yaw: 0.25 }, face: o.face || {}, lean: o.lean || 0 });
  const GIRL = (S, o = {}) => S.doll(0.62, 0.62, -0.42, o.yaw ?? -0.2, { kind: 'girl', s: 0.95, ...sit, arms: o.arms || [[0.5, 0.05, 0.9], [0.35, 0.18, 0.7]], head: o.head || { yaw: -0.3 }, face: o.face || {}, lean: o.lean || 0 });
  const midHands = (d) => mul(add(d.hands[0].p, d.hands[1].p), 0.5);
