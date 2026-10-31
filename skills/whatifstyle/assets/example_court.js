// Logic riddle reel in the jungle: the king's crown, three suspects, only one tells the truth. Answer: the bear.
(function () {
  const F = window.FLAT, { P, SET, cam, camAt, tag, stat, caption, say, runShots, finish, critter, crown, bubble, parrot, bird, confetti, endCard, rr, oval } = F;
  const clamp = H.clamp, E = H.ease, pop = (u, at, d = 0.3) => clamp((u - at) / d);
  const SUS = [['monkey', 130], ['fox', 360], ['bear', 590]], FLOOR = 1010;
  const NAME = { monkey: 'Bandar', fox: 'Lomdi', bear: 'Bhalu' };
  function court(c, t, o = {}) {
    SET.jungle(c, t); const m = o.moods || {};
    // the stone throne and the king
    oval(c, 360, 742, 180, 23, 'rgba(10,6,40,.2)'); rr(c, 245, 610, 230, 134, 16, '#8a8ba7'); rr(c, 225, 716, 270, 32, 10, '#6e7090'); rr(c, 270, 500, 180, 130, [50, 50, 8, 8], '#a1a3bf');
    critter(c, 'lion', 360, 722, 0.9, t, Object.assign({ noShadow: true, mood: o.king || 'think' }, m.lion, { hat: o.crowned ? (q) => crown(q, 0, -116, 1) : null }));
    // the court: two guards, the jury and birds
    critter(c, 'elephant', 72, 825, 0.72, t, { mood: 'think', seed: 5, flip: true }); critter(c, 'elephant', 650, 825, 0.72, t, { mood: 'think', seed: 6 });
    critter(c, 'owl', 200, 765, 0.45, t, { mood: o.jury || 'ok', look: [1, 0], seed: 7 }); critter(c, 'rabbit', 526, 788, 0.48, t, { mood: o.jury || 'ok', look: [-1, 0], seed: 8, hop: o.cheer });
    parrot(c, 628, 408, 0.92, t, 1); parrot(c, 92, 454, 0.75, t, 4); bird(c, (t * 40) % 860 - 70, 236, 0.66, t, P.ink, 1);
    if (o.sus !== false) for (const [k, x] of SUS) critter(c, k, x, FLOOR, 0.86, t, Object.assign({ seed: x }, m[k]));
  }
  const hook = (c, u, t) => {
    const lost = u > 1.6, [x, y, z] = camAt([[0, 360, 620, 1.55], [5, 360, 610, 1.72]], u);
    cam(c, x, y, z, () => { court(c, t, { sus: false, king: lost ? 'shock' : 'happy', crowned: !lost }); if (lost) { F.tag(c, 360, 464, 'Taj gayab!', P.pink, pop(u, 1.7), { size: 34 }); } });
    caption(c, say('Jungle ke raja ka *taj* chori ho gaya!', 0.1, 2.4), u, { y: 150, size: 48, hot: P.yellow });
  };
  const suspects = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 720, 1.02], [5, 360, 760, 1.08]], u);
    cam(c, x, y, z, () => court(c, t, { moods: { monkey: { hop: u < 1.1 && u > 0.4 }, fox: { hop: u < 2 && u > 1.3, mood: 'sly' }, bear: { hop: u < 2.9 && u > 2.2 } } }));
    SUS.forEach(([k, x2], i) => tag(c, x2, 1120, NAME[k], [P.orange, P.pink, P.teal][i], pop(u, 0.5 + i * 0.9), { size: 32 }));
    caption(c, say('Teen *shak* wale saamne khade hain.', 0.2, 2.4), u, { y: 170, size: 48 });
  };
  const talk = (who, line, tx, cap) => (c, u, t) => {
    const x2 = SUS.find((q) => q[0] === who)[1];
    cam(c, Math.max(240, Math.min(480, x2)), 820, 1.28, () => court(c, t, { moods: { [who]: { talk: true, mood: who === 'fox' ? 'sly' : 'ok', arms: 'up' } } }));
    const sx = 360 + (x2 - Math.max(240, Math.min(480, x2))) * 1.28;
    bubble(c, Math.max(190, Math.min(530, sx)), 500, line, sx, 640, pop(u, 0.2), { size: 44 });
    caption(c, say(cap, 0.08, 0.5), u, { y: 170, size: 54 });
  };
  const rule = (c, u, t) => {
    cam(c, 360, 760, 1.04, () => court(c, t, { king: 'think', moods: { fox: { mood: 'sly' } } }));
    c.fillStyle = 'rgba(22,13,63,.45)'; c.fillRect(0, 0, 720, 1280); stat(c, 360, 610, '1', 'hi sach bol raha hai', pop(u, 0.25), { size: 118, unitCol: P.yellow });
    caption(c, say('Sher ko pata hai: sirf *ek* sach bol raha hai.', 0.1, 2.3), u, { y: 170, size: 46, hot: P.yellow });
    caption(c, say('*Chor kaun?*', 2.7, 3.1), u, { y: 870, size: 80, hot: P.rose });
  };
  const think = (c, u, t) => {
    cam(c, 360, 760, 1.04, () => court(c, t, { moods: { fox: { mood: 'sly' }, monkey: { look: [1, 0] }, bear: { look: [-1, 0] } } }));
    c.fillStyle = 'rgba(22,13,63,.42)'; c.fillRect(0, 0, 720, 1280); caption(c, say('*Socho...*', 0.1, 0.3), u, { y: 170, size: 92, hot: P.yellow }); stat(c, 360, 350, String(Math.max(1, 5 - Math.floor(u))), 'sec', 1, { size: 112 }); tag(c, 360, 1160, 'Pause karo, comment karo', P.pink, pop(u, 0.4), { size: 34 });
  };
  // suppose this one is the thief, then count how many of them told the truth
  const test = (thief, truth, ok) => (c, u, t) => {
    const moods = {}; for (const [k] of SUS) moods[k] = { mood: k === thief ? (ok && u > 3 ? 'shock' : 'sly') : 'think' };
    cam(c, 360, 760, 1.04, () => court(c, t, { moods }));
    SUS.forEach(([k, x2], i) => { const s = truth[i]; tag(c, x2 > 360 ? 590 : x2 < 360 ? 130 : 360, 1130, s ? 'Sach' : 'Jhooth', s ? P.teal : '#c9264f', pop(u, 0.75 + i * 0.5), { size: 34 }); });
    F.crown(c, SUS.find((q) => q[0] === thief)[1], 700, 0.42 + Math.sin(t * 5) * 0.015);
    caption(c, say(`Maan lo chor *${NAME[thief]}* hai.`, 0.1, 0.8), u, { y: 170, size: 50, hot: P.yellow });
    const n = truth.filter(Boolean).length; if (u > 2.4) stat(c, 360, 320, `${n} sach`, ok ? 'Bilkul sahi!' : 'Galat', pop(u, 2.4), { size: 72, unitCol: ok ? P.mint : P.rose, bg: ok ? '#0f6b58' : 'rgba(22,13,63,.92)' });
  };
  const caught = (c, u, t) => {
    const a = E.inOut(clamp((u - 1.6) / 1.1)), cx = H.lerp(590, 360, a), cy = H.lerp(840, 462, a) - Math.sin(a * Math.PI) * 120;
    cam(c, 360, 720, 1, () => { court(c, t, { king: a > 0.95 ? 'happy' : 'shock', crowned: a >= 1, jury: a >= 1 ? 'happy' : 'ok', cheer: a >= 1, moods: { bear: { mood: 'scared', look: [0, -1] }, monkey: { mood: a >= 1 ? 'happy' : 'shock', arms: a >= 1 ? 'up' : null }, fox: { mood: a >= 1 ? 'happy' : 'shock' } } }); if (a < 1) crown(c, cx, cy, 0.8, a * 6.28); });
    if (a >= 1) confetti(c, t, u - 2.7); caption(c, say('Chor nikla *Bhalu!*', 0.1, 1.1), u, { y: 170, size: 62, hot: P.rose });
  };
  const close = (c, u, t) => endCard(c, t, u, 'Pakda tha?', 'apna answer comment karo', () => { critter(c, 'bear', 360, 1000, 1.1, t, { mood: 'sly' }); crown(c, 360, 650, 0.8); });

  const shots = [
    { t0: 0, t1: 5, draw: hook, in: 'cut' }, { t0: 5, t1: 9, draw: suspects, in: 'zoom' },
    { t0: 9, t1: 12.2, draw: talk('monkey', 'Lomdi ne|churaya!', 0, 'Bandar bola:'), in: 'cut' }, { t0: 12.2, t1: 15.4, draw: talk('fox', 'Maine nahi|churaya!', 0, 'Lomdi boli:'), in: 'cut' }, { t0: 15.4, t1: 18.6, draw: talk('bear', 'Maine bhi|nahi churaya!', 0, 'Bhalu bola:'), in: 'cut' },
    { t0: 18.6, t1: 23, draw: rule, in: 'flash' }, { t0: 23, t1: 28, draw: think, in: 'cut' },
    { t0: 28, t1: 32.5, draw: test('monkey', [0, 1, 1], false), in: 'flash' }, { t0: 32.5, t1: 37, draw: test('fox', [1, 0, 1], false), in: 'zoom' }, { t0: 37, t1: 42.5, draw: test('bear', [0, 1, 0], true), in: 'zoom' },
    { t0: 42.5, t1: 48, draw: caught, in: 'flash' }, { t0: 48, t1: 51, draw: close, in: 'zoom' },
  ];
  window.LESSON = { BEATS: shots, DURATION: 51, explainer: (c, W, H_, t) => { runShots(c, shots, t); finish(c); } };
  window.scoreSound = function (k) {
    shots.slice(1).forEach((s) => { if (s.in !== 'cut') k.play(s.in === 'flash' ? 'shutter' : 'whoosh', s.t0, s.in === 'flash' ? {} : { dur: 0.4 }); });
    k.play('impact', 1.7); [5.5, 6.4, 7.3, 9.2, 12.4, 15.6, 18.9].forEach((x) => k.play('pop', x, { minor: true }));
    for (let i = 0; i < 5; i++) k.play('tock', 23 + i, {});
    for (const t0 of [28, 32.5, 37]) for (let i = 0; i < 3; i++) k.play('pop', t0 + 0.75 + i * 0.5, { minor: true });
    k.play('buzz', 30.4); k.play('buzz', 34.9); k.play('success', 39.4); k.play('whoosh', 44.1, { dur: 0.9 }); k.play('ding', 45.2); k.play('sparkle', 45.4); k.play('sparkle', 48.3);
  };
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
