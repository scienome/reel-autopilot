// Three doors: fire, snakes, and a lion who has not eaten in three years. A short, arguable riddle that invites a number in the comments.
(function () {
  const F = window.FLAT, { P, cam, camAt, tag, caption, say, critter, crown, rr, oval, poly, circ, glow, flames, snake, confetti, socho, followCard } = F;
  const clamp = H.clamp, E = H.ease, pop = (u, at, d = 0.3) => clamp((u - at) / d);
  const D = F.lengths({ c_hook: 4, c_d1: 3, c_d2: 3, c_d3: 4, c_q: 2.8, c_think: 5.5, c_reveal: 3.4, c_aha: 4.5, c_cta: 4.5 });
  const X = [130, 360, 590], DY = 800;
  function inside(c, n, t, o = {}) {
    if (n === 0) { glow(c, 0, -130, 240, P.orange, 0.8); flames(c, 0, 0, 170, 280, t); }
    if (n === 1) { const r = H.rng(5); for (let i = 0; i < 10; i++) snake(c, -60 + r() * 80, -18 - i * 30, 0.52, t, i % 3 ? '#25b35f' : '#7ac943', i); }
    if (n === 2) { if (o.ghost) { c.save(); c.globalAlpha = 0.72 + Math.sin(t * 3) * 0.1; const up = Math.sin(t * 2) * 10; critter(c, 'lion', 0, -30 + up, 0.68, t, { noShadow: true, mood: 'happy', hat: (q) => { q.strokeStyle = P.yellow; q.lineWidth = 9; q.beginPath(); q.ellipse(0, -112, 58, 14, 0, 0, 7); q.stroke(); } }); c.restore(); } else critter(c, 'lion', 0, -6, 0.72, t, { noShadow: true, mood: 'hungry', look: [0, 0.4] }); }
  }
  function door(c, n, t, open, o = {}) {
    const x = X[n], w = 190, h = 340; c.save(); c.translate(x, DY);
    rr(c, -w / 2 - 15, -h - 15, w + 30, h + 15, [100, 100, 0, 0], '#5b3a22');
    c.save(); c.beginPath(); c.roundRect(-w / 2, -h, w, h, [90, 90, 0, 0]); c.clip(); c.fillStyle = '#120a2e'; c.fillRect(-w / 2, -h, w, h); if (open > 0) inside(c, n, t, o);
    if (open < 1) { const pw = w * (1 - E.inOut(open)); c.fillStyle = ['#c9264f', '#177e67', '#4a35b8'][n]; c.fillRect(-w / 2, -h, pw, h); c.fillStyle = 'rgba(10,6,40,.16)'; for (const q of [0.2, 0.62]) c.fillRect(-w / 2 + pw * 0.14, -h + h * q, pw * 0.72, h * 0.28); circ(c, -w / 2 + pw * 0.86, -h * 0.42, 9, P.amber); }
    c.restore();
    circ(c, 0, -h - 32, 34, P.paper); c.fillStyle = P.ink; c.font = `900 42px ${F.FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(n + 1, 0, -h - 29);
    c.restore();
  }
  function hall(c, t, o = {}) {
    c.fillStyle = F.vgrad(c, -300, 900, '#3f3198', '#6a4fd8'); c.fillRect(-500, -500, 1720, 1500);
    c.fillStyle = 'rgba(20,12,70,.2)'; for (let r = 0, y = -300; y < 830; y += 56, r++) for (let x = -480 + (r % 2) * 50; x < 1200; x += 100) c.fillRect(x, y, 94, 50);
    for (const x of [8, 245, 475, 712]) { glow(c, x, 300, 110, P.orange, 0.65); rr(c, x - 7, 318, 14, 56, 4, '#5b3a22'); F.torch(c, x, 312, 0.8, t + x, 0.3); }
    F.beam(c, 360, 0, 40, 330, 830, P.yellow, 0.12);
    c.fillStyle = F.vgrad(c, 800, 1280, '#7c5a9e', '#3a2b6e'); c.fillRect(-500, 800, 1720, 900); oval(c, 360, 1010, 340, 54, P.pink); oval(c, 360, 1010, 262, 35, F.shade(P.pink, 0.8));
    const op = o.open || [0, 0, 0]; for (let n = 0; n < 3; n++) door(c, n, t, op[n], o);
    critter(c, 'lion', 628, 1085, 0.72, t, { mood: o.king || 'sly', look: [-1, -0.3], seed: 2, hat: (q) => crown(q, 0, -116, 1) });
    critter(c, 'elephant', 92, 1085, 0.66, t, { mood: 'think', seed: 3, look: [1, 0], flip: true });
    critter(c, 'monkey', 360, 1060, 0.9, t, Object.assign({ mood: 'scared', look: [0, -1], seed: 1 }, o.monkey));
  }
  const hook = (c, u, t) => { const [x, y, z] = camAt([[0, 360, 770, 1.18], [D.c_hook, 360, 680, 1]], u); cam(c, x, y, z, () => hall(c, t)); caption(c, say('*3 darwaze.* Ek kholna hi hoga!', 0.1, 2), u, { y: 165, size: 54, hot: P.yellow }); };
  const peek = (n, text, cap, hot) => (c, u, t) => {
    const k = E.inOut(clamp(u / 0.8)), open = [0, 0, 0]; open[n] = clamp((u - 0.2) / 0.6); const fx = H.lerp(360, Math.max(240, Math.min(480, X[n])), k), fy = H.lerp(680, 600, k), z = H.lerp(1, 1.62, k);
    cam(c, fx, fy, z, () => hall(c, t, { open, monkey: { mood: 'scared', look: [n === 0 ? -1 : n === 2 ? 1 : 0, -1] }, king: 'sly' }));
    tag(c, 360, 268, text, [P.orange, '#177e67', P.violet][n], pop(u, 0.5), { size: 42 }); caption(c, say(cap, 0.05, 0.5), u, { y: 165, size: 54, hot });
  };
  const q = (c, u, t) => { cam(c, 360, 690, 1.02, () => hall(c, t, { monkey: { mood: 'scared', look: [0, -1] } })); caption(c, say('*Kaunsa* darwaza jaan bachayega?', 0.1, 1.8), u, { y: 165, size: 52, hot: P.yellow }); };
  const think = (c, u, t) => { cam(c, 360, 690, 1.02, () => hall(c, t, { monkey: { mood: 'think', look: [Math.sin(t * 1.6), -1] } })); socho(c, u, '*1, 2 ya 3?*', 'Comment mein number likho'); };
  const reveal = (c, u, t) => {
    const k = E.inOut(clamp(u / 0.9)), open = [0, 0, clamp((u - 0.5) / 0.5)]; cam(c, H.lerp(360, 480, k), H.lerp(690, 600, k), H.lerp(1, 1.6, k), () => hall(c, t, { open, ghost: true, monkey: { mood: u > 1.2 ? 'happy' : 'scared', look: [1, -1] }, king: 'shock' }));
    caption(c, say('Teesra *darwaza!*', 0.1, 0.9), u, { y: 165, size: 64, hot: P.yellow });
  };
  const aha = (c, u, t) => {
    cam(c, 480, 600, 1.6, () => hall(c, t, { open: [0, 0, 1], ghost: true, monkey: { mood: 'happy', arms: 'up', hop: true, look: [1, -1] }, king: 'shock' })); confetti(c, t, u);
    caption(c, say('3 saal bhookha sher, *zinda* kaise?', 0.1, 1.7), u, { y: 165, size: 50, hot: P.yellow }); tag(c, 360, 1205, 'Woh kab ka bhoot ban chuka hai!', P.pink, pop(u, 1.8), { size: 32 });
  };
  const cta = (c, u, t) => followCard(c, t, u, 'Sahi chuna tha?', 'Apna number comment karo', () => { critter(c, 'monkey', 240, 860, 1, t, { mood: 'happy', arms: 'up', hop: true }); c.save(); c.globalAlpha = 0.72; critter(c, 'lion', 490, 840 + Math.sin(t * 2) * 12, 1, t, { mood: 'happy', noShadow: true }); c.restore(); });

  const tl = F.timeline([['c_hook', hook, 'cut'], ['c_d1', peek(0, 'Dhadhakti aag', 'Pehla?', P.orange), 'cut'], ['c_d2', peek(1, '100 zehreele saanp', 'Doosra?', P.mint), 'cut'], ['c_d3', peek(2, '3 saal se bhookha sher', 'Teesra?', P.rose), 'cut'], ['c_q', q, 'flash'], ['c_think', think, 'cut'], ['c_reveal', reveal, 'flash'], ['c_aha', aha, 'cut'], ['c_cta', cta, 'zoom']], D);
  const T = tl.T;
  F.publish(tl, (k) => {
    F.scoreBase(k, { think: T.c_think, win: T.c_aha, end: tl.DURATION, cta: T.c_cta, shots: tl.shots, night: false, chords: [['E3', 'G3', 'B3', 'D4'], ['C3', 'E3', 'G3', 'B3'], ['A2', 'C3', 'E3', 'G3'], ['B2', 'D#3', 'F#3', 'B3']] });
    const p = (n, x, o) => k.play(n, x, o || {});
    p('impact', 0.1); p('stamp', 1.1); ['c_d1', 'c_d2', 'c_d3'].forEach((id) => { p('shutter', T[id] + 0.2); p('whoosh', T[id] + 0.25, { dur: 0.5 }); });
    for (let i = 0; i < 22; i++) k.noise(T.c_d1 + 0.6 + i * 0.1, { dur: 0.12, color: 'brown', filter: 'lowpass', f: 900, gain: 0.3, minor: true });
    k.noise(T.c_d2 + 0.6, { dur: D.c_d2 - 0.9, color: 'white', filter: 'highpass', f: 5200, gain: 0.08 }); p('thud', T.c_d3 + 0.8); k.tone(T.c_d3 + 0.9, { f: [[0, 120], [0.8, 58]], dur: 0.9, type: 'sawtooth', gain: 0.24 });
    p('riser', T.c_q + 0.2, { dur: 1.8 }); p('shutter', T.c_reveal + 0.5); p('ding', T.c_reveal + 1, { f: 'E6' }); p('sparkle', T.c_reveal + 1.2); p('success', T.c_aha + 1.8); p('sparkle', T.c_aha + 1.9);
    for (let i = 0; i < 8; i++) p('pop', T.c_aha + 0.5 + i * 0.32, { f: 700 + (i * 190) % 800, gain: 0.5, minor: true });
  });
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
