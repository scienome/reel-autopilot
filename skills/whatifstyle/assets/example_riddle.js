// Riddle reel: 3 switches, 1 bulb, the door opens once. Hinglish. Times are estimates until a voice exists.
(function () {
  const F = window.FLAT, { P, SET, cam, camAt, person, tag, stat, caption, say, runShots, finish, rr, circ, line, oval, poly, glow, beam, endCard, brain, shade } = F;
  const clamp = H.clamp, E = H.ease;
  const pop = (u, at, d = 0.3) => clamp((u - at) / d);

  function panel(c, x, y, st, hi = -1) {
    rr(c, x - 150, y - 90, 300, 180, 18, 'rgba(10,6,40,.2)'); rr(c, x - 154, y - 96, 300, 180, 18, P.paper);
    [0, 1, 2].forEach((i) => {
      const sx = x - 94 + i * 90, on = st[i];
      if (hi === i) rr(c, sx - 38, y - 88, 76, 164, 14, H.rgba(P.yellow, 0.55));
      rr(c, sx - 26, y - 62, 52, 96, 10, '#cfc6dd'); rr(c, sx - 18, on ? y - 56 : y - 16, 36, 44, 7, on ? P.teal : P.pink);
      c.fillStyle = P.ink; c.font = `900 26px ${F.FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(i + 1, sx, y + 58);
    });
  }
  function door(c, x, y, k = 1) {
    rr(c, x - 112, y - 340, 224, 350, [12, 12, 0, 0], '#6e2f1a'); rr(c, x - 96, y - 326, 192, 336, [6, 6, 0, 0], P.violet);
    rr(c, x - 72, y - 300, 144, 120, 8, shade(P.violet, 0.8)); rr(c, x - 72, y - 150, 144, 130, 8, shade(P.violet, 0.8)); circ(c, x + 70, y - 150, 12, P.amber);
    if (k > 0) { rr(c, x - 52, y - 262, 104, 46, 6, P.paper); c.fillStyle = P.pink; c.font = `900 26px ${F.FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('1 BAAR', x, y - 238); }
  }
  // state: 'on', 'warm' (off but hot), 'cold'
  function bulb(c, x, y, s, st, t) {
    line(c, [[x, -300], [x, y - 70 * s]], 6, P.ink);
    if (st === 'on') { glow(c, x, y, 520, P.yellow, 0.75); beam(c, x, y + 40, 60, 300, 720, P.yellow, 0.22); }
    if (st === 'warm') glow(c, x, y, 220 + Math.sin(t * 4) * 12, P.orange, 0.6);
    c.save(); c.translate(x, y); c.scale(s, s);
    rr(c, -26, -94, 52, 44, 7, '#8b86a8'); c.fillStyle = st === 'on' ? P.yellow : st === 'warm' ? '#ffc29a' : '#c8d6ee'; c.beginPath(); c.arc(0, 0, 66, 0, 7); c.fill(); poly(c, [[-40, -52], [40, -52], [28, -68], [-28, -68]], st === 'on' ? P.yellow : st === 'warm' ? '#ffc29a' : '#c8d6ee');
    line(c, [[-16, -50], [-20, 2], [0, -18], [20, 2], [16, -50]], 5, st === 'on' ? P.orange : '#6f6a92'); oval(c, -26, -18, 10, 20, 'rgba(255,255,255,.6)', 0.3);
    c.restore();
  }
  const hall = (c, t, st, hi, mood = 'ok', pose = 'down', o = {}) => {
    SET.warm(c, t); door(c, 560, 1000); panel(c, 240, 440, st, hi);
    person(c, 220, 1050, 0.82, t, Object.assign({ mood, pose }, o));
  };
  const room = (c, t, st, tint = '#241a6b') => { c.fillStyle = st === 'on' ? '#5b47c0' : tint; c.fillRect(-500, -500, 1720, 2300); c.fillStyle = shade(tint, 0.7); c.fillRect(-500, 1020, 1720, 800); };

  const hook = (c, u, t) => {
    cam(c, 360, 690, 1 + u * 0.018, () => hall(c, t, [0, 0, 0], -1, 'ok', 'chin', { look: [1, -0.4] }));
    caption(c, say('Yeh riddle aapko *sochne* pe majboor kar degi.', 0.2, 3.2), u, { y: 170, size: 50 });
  };
  const setup = (c, u, t) => {
    const showRoom = u > 3.8 && u < 7.4;
    if (showRoom) {
      cam(c, 360, 640, 1 + (u - 3.8) * 0.02, () => { room(c, t, 'off'); bulb(c, 360, 560, 1.5, 'cold', t); });
      tag(c, 360, 860, 'Band kamra, ek bulb', P.pink, pop(u, 4.1), { size: 36 });
      caption(c, say('Andar *ek bulb* hai.', 3.9, 5.2), u, { y: 170, size: 54 });
    } else {
      const [x, y, z] = camAt([[0, 280, 560, 1.2], [3.8, 270, 550, 1.28], [7.4, 430, 700, 1.04], [13, 400, 680, 1.1]], u);
      cam(c, x, y, z, () => hall(c, t, [0, 0, 0], -1, u > 8 ? 'shock' : 'ok', 'down'));
      if (u < 3.8) caption(c, say('Bahar *3 switch* hain.', 0.2, 1.6), u, { y: 170, size: 54 });
      else { caption(c, say('Darwaza sirf *ek baar* khulega.', 7.5, 9.3), u, { y: 150, size: 50, out: 10 }); caption(c, say('Batao, kaunsa switch *kiska* hai?', 10.1, 12), u, { y: 150, size: 50, hot: P.yellow }); }
    }
  };
  const think = (c, u, t) => {
    SET.space(c, t); const n = Math.max(1, 5 - Math.floor(u)); brain(c, 360, 800, 1.2, t, { spark: 1, halo: 0.9 });
    caption(c, say('*Socho...*', 0.1, 0.3), u, { y: 230, size: 96, hot: P.yellow });
    stat(c, 360, 450, String(n), 'sec', 1, { size: 120 }); tag(c, 360, 1060, 'Pause karo, comment karo', P.pink, pop(u, 0.5), { size: 34 });
  };
  const step1 = (c, u, t) => {
    const on1 = u > 0.9;
    cam(c, 300, 600, 1.15, () => hall(c, t, [on1 ? 1 : 0, 0, 0], 0, 'happy', 'down'));
    if (u > 2) stat(c, 360, 1060, `${Math.min(10, Math.floor((u - 2) * 4))}`, 'minute ruko', pop(u, 2), { size: 76 });
    caption(c, say('Switch *1* ON karo.', 0.2, 1.3), u, { y: 170, size: 56 });
    caption(c, say('10 minute *wait.*', 2, 3), u, { y: 240, size: 44, hot: P.yellow });
  };
  const step2 = (c, u, t) => {
    const a = u > 0.7 ? 0 : 1, b = u > 2 ? 1 : 0;
    cam(c, 300, 600, 1.15, () => hall(c, t, [a, b, 0], u > 2 ? 1 : 0, 'happy', 'down'));
    caption(c, say('Switch 1 *OFF.*', 0.2, 1), u, { y: 170, size: 56 });
    caption(c, say('Switch 2 *ON.* Ab andar jao.', 2, 3.6), u, { y: 240, size: 42, hot: P.mint });
  };
  const reveal = (st, n, label, col, line1, hot) => (c, u, t) => {
    cam(c, 360, 640, 1.02 + u * 0.015, () => { room(c, t, st, st === 'warm' ? '#51287f' : '#241a6b'); bulb(c, 360, 560, 1.55, st, t); });
    tag(c, 360, 860, label, col, pop(u, 0.25), { size: 40 });
    stat(c, 360, 1010, `Switch ${n}`, '', pop(u, 1.2), { size: 72 });
    caption(c, say(line1, 0.1, 1), u, { y: 170, size: 52, hot });
  };
  const aha = (c, u, t) => {
    cam(c, 360, 640, 1, () => hall(c, t, [0, 1, 0], -1, 'happy', 'cheer'));
    caption(c, say('Bulb sirf *roshni* nahi deta. *Garmi* bhi deta hai.', 0.2, 3), u, { y: 170, size: 46, hot: P.yellow });
  };
  const close = (c, u, t) => endCard(c, t, u, 'Socha tha?', 'sahi kiya? comment mein batao', () => bulb(c, 360, 860, 1.2, 'on', t));

  const shots = [
    { t0: 0, t1: 4, draw: hook, in: 'cut' },
    { t0: 4, t1: 17, draw: setup, in: 'zoom' },
    { t0: 17, t1: 22, draw: think, in: 'flash' },
    { t0: 22, t1: 26.5, draw: step1, in: 'wipe' },
    { t0: 26.5, t1: 31, draw: step2, in: 'cut' },
    { t0: 31, t1: 34.5, draw: reveal('on', 2, 'Jal raha hai', P.teal, 'Bulb *jal* raha hai?', P.yellow), in: 'zoom' },
    { t0: 34.5, t1: 38.5, draw: reveal('warm', 1, 'Band, par garam!', P.orange, 'Band hai, par *garam?*', P.rose), in: 'flash' },
    { t0: 38.5, t1: 42, draw: reveal('cold', 3, 'Band aur thanda', P.blue, 'Band aur *thanda?*', P.sky), in: 'flash' },
    { t0: 42, t1: 46, draw: aha, in: 'zoom' },
    { t0: 46, t1: 49, draw: close, in: 'zoom' },
  ];
  const DURATION = 49;
  window.LESSON = { BEATS: shots, DURATION, explainer: (c, W, H_, t) => { runShots(c, shots, t); finish(c); } };
  window.scoreSound = function (k) {
    shots.slice(1).forEach((s) => { if (s.in !== 'cut') k.play(s.in === 'flash' ? 'shutter' : 'whoosh', s.t0, s.in === 'flash' ? {} : { dur: 0.4 }); });
    for (let i = 0; i < 5; i++) k.play('tock', 17 + i, {});
    [22.9, 27.2, 28.5].forEach((x) => k.play('click', x));
    [31.3, 34.8, 38.8].forEach((x) => k.play('pop', x, { minor: true }));
    k.play('ding', 32.2); k.play('ding', 35.7); k.play('ding', 39.7); k.play('success', 42.2); k.play('sparkle', 46.4);
  };
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
