// Jungle Case: the thief's lie is that he saw moonlight on Amavasya. The clue is on screen in the first shot, which earns a rewatch.
(function () {
  const F = window.FLAT, { P, SET, cam, camAt, tag, caption, say, critter, crown, bubble, parrot, bird, confetti, stat, rr, oval, circ, diamond, calendarBoard, night, socho, followCard } = F;
  const clamp = H.clamp, E = H.ease, pop = (u, at, d = 0.3) => clamp((u - at) / d);
  const D = F.lengths({ a_hook: 6.5, a_fox: 3, a_monkey: 2.4, a_bear: 2.4, a_q: 4, a_think: 5.5, a_reveal: 5, a_aha: 4, a_caught: 4.5, a_cta: 4.5 });
  const SUS = { monkey: 130, fox: 360, bear: 590 }, FLOOR = 1010;
  function court(c, t, o = {}) {
    SET.jungle(c, t); const m = o.moods || {};
    oval(c, 360, 742, 180, 23, 'rgba(10,6,40,.2)'); rr(c, 245, 610, 230, 134, 16, '#8a8ba7'); rr(c, 225, 716, 270, 32, 10, '#6e7090'); rr(c, 270, 500, 180, 130, [50, 50, 8, 8], '#a1a3bf');
    critter(c, 'lion', 360, 722, 0.9, t, Object.assign({ noShadow: true, mood: o.king || 'think', hat: (q) => crown(q, 0, -116, 1) }));
    critter(c, 'elephant', 72, 825, 0.72, t, { mood: 'think', seed: 5, flip: true }); critter(c, 'elephant', 650, 825, 0.72, t, { mood: 'think', seed: 6 });
    critter(c, 'owl', 200, 765, 0.45, t, { mood: o.jury || 'ok', look: [1, 0], seed: 7 }); critter(c, 'rabbit', 526, 788, 0.48, t, { mood: o.jury || 'ok', look: [-1, 0], seed: 8, hop: o.cheer });
    parrot(c, 628, 408, 0.92, t, 1); parrot(c, 92, 454, 0.75, t, 4); bird(c, (t * 40) % 860 - 70, 236, 0.66, t, P.ink, 1);
    for (const k in SUS) critter(c, k, SUS[k], FLOOR, 0.86, t, Object.assign({ seed: SUS[k] }, m[k]));
  }
  // last night: the theft in the dark. The calendar hangs on the tree and nobody mentions it
  function nightScene(c, t, u, hi = 0) {
    SET.jungle(c, t); rr(c, 575, 470, 56, 500, 8, '#5b3a22');
    night(c, t, { tint: '#4a55a8' });
    // the clue stays small and unmentioned in the hook; the thief is only a shadow, so nothing gives away who it is
    const k = hi > 0 ? 1 : 0.8; c.save(); c.globalAlpha = hi > 0 ? 1 : 0.72; calendarBoard(c, 603, 610, k, hi); c.restore();
    const x = H.lerp(-120, 840, clamp((u - 2) / 3.6)), by = 1010 - Math.abs(Math.sin(u * 9)) * 22;
    if (u > 2 && hi === 0) { oval(c, x, 1016, 80, 11, 'rgba(10,6,40,.35)'); oval(c, x, by - 90, 62, 84, '#0c0a2c'); circ(c, x + 14, by - 188, 58, '#0c0a2c'); diamond(c, x + 60, by - 110, 0.6, t); }
  }
  const hook = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 640, 1], [D.a_hook, 380, 660, 1.08]], u);
    cam(c, x, y, z, () => nightScene(c, t, u));
    caption(c, say('Raja ka *heera* chori! Chor ne ek *galti* ki...', 0.1, 3.2), u, { y: 165, size: 52, hot: P.yellow });
  };
  const talk = (who, text, cap, mood) => (c, u, t) => {
    const fx = Math.max(240, Math.min(480, SUS[who]));
    cam(c, fx, 820, 1.28, () => court(c, t, { moods: { [who]: { talk: true, mood, arms: 'up' } } }));
    const sx = 360 + (SUS[who] - fx) * 1.28;
    bubble(c, Math.max(205, Math.min(500, sx)), 480, text, sx, 640, pop(u, 0.2), { size: 34 });
    caption(c, say(cap, 0.05, 0.4), u, { y: 165, size: 54 });
  };
  const q = (c, u, t) => {
    cam(c, 360, 760, 1.04, () => court(c, t, { moods: { fox: { mood: 'sly' }, bear: { mood: 'think' }, monkey: { mood: 'think' } } }));
    caption(c, say('Ek *jhooth* bol raha hai. *Saboot* isi video mein hai!', 0.1, 2.5), u, { y: 150, size: 44, hot: P.yellow, maxW: 680 });
    if (u > D.a_q - 1.4) caption(c, say('*Chor kaun?*', D.a_q - 1.4, D.a_q - 1.2), u, { y: 1120, size: 78, hot: P.rose });
  };
  const think = (c, u, t) => { cam(c, 360, 760, 1.04, () => court(c, t, { moods: { fox: { mood: 'sly' }, monkey: { look: [1, 0] }, bear: { look: [-1, 0] } } })); socho(c, u, '*Socho...*', 'Comment mein naam likho'); };
  const reveal = (c, u, t) => {
    const k = E.inOut(clamp((u - 1.2) / 1.5)), z = H.lerp(1, 2.5, k);
    cam(c, H.lerp(360, 600, k), H.lerp(640, 610, k), z, () => nightScene(c, t, 0, H.smooth(1.8, 3, u)));
    caption(c, say('Shuruaat *yaad* karo. Kal raat...', 0.1, 1.5), u, { y: 150, size: 50 });
    if (u > D.a_reveal - 2) tag(c, 360, 1090, 'Chaand nikla hi nahi!', P.pink, pop(u, D.a_reveal - 2), { size: 46 });
  };
  const aha = (c, u, t) => {
    cam(c, 360, 860, 1.32, () => court(c, t, { moods: { fox: { mood: u > 2 ? 'scared' : 'sly', look: [0, 0] }, monkey: { mood: 'shock', look: [1, 0] }, bear: { mood: 'shock', look: [-1, 0] } } }));
    bubble(c, 360, 420, 'Chaand ki roshni?', 360, 590, pop(u, 0.5), { size: 44, bg: P.yellow });
    caption(c, say('Toh *chaand* kisne dekha?', 0.1, 1.2), u, { y: 165, size: 54, hot: P.yellow });
  };
  const caught = (c, u, t) => {
    const a = E.back(pop(u, 1.3, 0.4));
    cam(c, 360, 720, 1, () => { court(c, t, { king: u > 1.5 ? 'happy' : 'shock', jury: 'happy', cheer: u > 1.5, moods: { fox: { mood: 'scared', look: [0, 1] }, monkey: { mood: 'happy', arms: 'up', hop: true }, bear: { mood: 'happy', arms: 'up', hop: true, seed: 3 } } }); if (a > 0) diamond(c, 430, 975 - a * 120, 0.8 * a, t); });
    if (u > 1.4) confetti(c, t, u - 1.4); caption(c, say('Chor hai *Lomdi!*', 0.1, 0.9), u, { y: 165, size: 68, hot: P.rose });
  };
  const cta = (c, u, t) => followCard(c, t, u, 'Pakad liya tha?', 'Sach batao, comment karo', () => { critter(c, 'fox', 360, 880, 1.25, t, { mood: 'sly' }); diamond(c, 360, 570, 0.8, t); });

  const tl = F.timeline([['a_hook', hook, 'cut'], ['a_fox', talk('fox', 'Chaand ki roshni|mein Bandar|bhaaga!', 'Lomdi boli:', 'sly'), 'zoom'], ['a_monkey', talk('monkey', 'Main toh ped|par so raha tha!', 'Bandar bola:', 'shock'), 'cut'], ['a_bear', talk('bear', 'Main gufa mein|shahad kha raha tha', 'Bhalu bola:', 'ok'), 'cut'], ['a_q', q, 'flash'], ['a_think', think, 'cut'], ['a_reveal', reveal, 'flash'], ['a_aha', aha, 'zoom'], ['a_caught', caught, 'flash'], ['a_cta', cta, 'zoom']], D);
  const T = tl.T;
  F.publish(tl, (k) => {
    F.scoreBase(k, { think: T.a_think, win: T.a_caught, end: tl.DURATION, cta: T.a_cta, shots: tl.shots, night: false });
    const p = (n, x, o) => k.play(n, x, o || {});
    p('glitch', 1.1); p('whoosh', 2, { dur: 1.2 }); p('sparkle', 2.4); p('impact', 4.8); ['a_fox', 'a_monkey', 'a_bear'].forEach((id, i) => { p('pop', T[id] + 0.2, { f: 560 + i * 110 }); p('click', T[id] + 0.26); });
    p('riser', T.a_q + 0.3, { dur: 1.6 }); p('stamp', T.a_q + D.a_q - 1.4); p('whoosh', T.a_reveal + 1.2, { dur: 1.4 }); p('ding', T.a_reveal + 2.8, { f: 'E6' }); p('impact', T.a_reveal + D.a_reveal - 2); p('error', T.a_aha + 0.6); p('thud', T.a_aha + 2);
    p('impact', T.a_caught + 0.1); p('sparkle', T.a_caught + 1.3); p('success', T.a_caught + 1.4); for (let i = 0; i < 8; i++) p('pop', T.a_caught + 1.5 + i * 0.22, { f: 700 + (i * 190) % 800, gain: 0.5, minor: true });
  });
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
