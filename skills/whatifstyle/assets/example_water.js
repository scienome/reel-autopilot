// Example reel: "What if you stopped drinking water?" Copy this file and swap the story; keep the shape.
// Times here are estimates (about 2.7 words a second). With real audio, replace them from voice_segments.py.
(function () {
  const F = window.FLAT, { P, SET, cam, camAt, person, brain, xray, tag, stat, meter, calendar, dayCard, caption, say, cellField, blob, spiral, raindrop, runShots, finish, rr, line, circ, glow, endCard } = F;
  const clamp = H.clamp, E = H.ease;
  const pop = (u, at, d = 0.3) => clamp((u - at) / d);

  // S1 hook: a person lying awake and thirsty at night, the clock racing on. Slow push towards them.
  const hook = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 700, 1], [3.4, 350, 730, 1.14], [6.8, 340, 670, 1.32]], u);
    cam(c, x, y, z, () => {
      SET.bedroom(c, t, { clock: `3:${String(7 + Math.floor(u * 6)).padStart(2, '0')}`, dawn: H.smooth(4, 7, u) * 0.5 });
      c.save(); c.translate(304, 690); c.rotate(-1.42); c.translate(-304, -690); c.save(); c.translate(304, 690); c.scale(0.76, 0.76); F.head(c, F.LOOKS.hero, { mood: u > 3.2 ? 'tired' : 'ok', look: [0, -0.5] }, t); c.restore(); c.restore();
      SET.blanket(c, 380);
    });
    caption(c, say('What if you stopped drinking *water?*', 0.2, 2.4), u, { out: 6.7 });
    raindrop(c, 610, 1000, 1.05, P.sky, E.back(pop(u, 3.2)) * (1 - H.smooth(5.7, 6.2, u) * 0.75));
    if (u > 3.2) tag(c, 610, 1110, 'Hour 8', P.orange, pop(u, 3.4));
  };

  // S2 office: the body drops 2 percent, thirst meter climbs; the x-ray circle opens on the head to set up the zoom through.
  const hour = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 690, 1], [4.3, 280, 640, 1.3], [6.1, 240, 585, 3.2]], u);
    cam(c, x, y, z, () => {
      SET.office(c, t); SET.chair(c, 240);
      person(c, 240, 1060, 0.92, t, { mood: u > 2.2 ? 'tired' : 'ok', pose: 'desk', talk: false, noShadow: true });
      SET.desk(c, t);
      xray(c, 240, 575, 58, pop(u, 4.1, 0.5), () => brain(c, 0, 0, 0.3, t, { spark: 0.6 }));
    });
    tag(c, 118, 300, 'Day 1', P.orange, pop(u, 0.15));
    if (u < 5.1) { stat(c, 490, 225, '2%', 'water lost', pop(u, 0.7) * (1 - H.smooth(4.7, 5.1, u)), { size: 72 }); meter(c, 668, 440, 34, 190, H.smooth(0.8, 3.6, u) * 0.68, P.pink, null, 1 - H.smooth(4.7, 5.1, u)); }
    caption(c, say('Your *focus* starts to fade.', 2.4, 4.0), u, { y: 170, size: 54, out: 5.5 });
  };

  // S3 inside the brain: cells shrink and pull apart. Same cells carry on through both sentences.
  const inside = (c, u, t) => {
    const sh = H.smooth(1.6, 5.2, u), [x, y, z] = camAt([[0, 360, 640, 1.2], [8, 360, 640, 1]], u);
    cam(c, x, y, z, () => cellField(c, t, { shrink: sh, seed: 31 }));
    tag(c, 210, 340, 'Brain cells', P.pink, pop(u, 0.4), { lead: [116, 500] });
    stat(c, 360, 690, '75%', 'water', pop(u, 1.1) * (1 - H.smooth(4.0, 4.3, u)));
    if (u > 4.3) tag(c, 360, 690, 'Shrinking', P.violet, pop(u, 4.3), { size: 40 });
    if (u > 5.2) { blob(c, 170, 960, 0.95, t, '#ffd24a', { sad: true }); blob(c, 548, 1000, 0.82, t, '#37c9a4', { sad: true, seed: 2 }); }
    caption(c, say('Your brain is mostly *water.*', 0.3, 2.0), u, { size: 54, y: 170, out: 3.9 });
    caption(c, say('Without it, cells *shrink.*', 4.0, 5.6), u, { size: 54, y: 170 });
  };

  // S4 day two: thick blood, heart works harder; the person now drained at the desk.
  const day2 = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 660, 1], [5.6, 280, 680, 1.3]], u);
    cam(c, x, y, z, () => {
      SET.office(c, t); SET.chair(c, 240);
      person(c, 240, 1060, 0.92, t, { mood: 'drained', pose: 'desk', noShadow: true, tilt: Math.sin(t * 1.2) * 0.05, chest: (q, shY) => { const b = 1 + Math.max(0, Math.sin(t * 9)) * 0.24, X = 28, Y = shY + 62; q.save(); q.translate(X, Y); q.scale(b, b); q.fillStyle = P.pink; q.beginPath(); q.moveTo(0, 16); q.bezierCurveTo(-34, -10, -18, -30, 0, -14); q.bezierCurveTo(18, -30, 34, -10, 0, 16); q.fill(); q.restore(); } });
      SET.desk(c, t);
      tag(c, 400, 800, 'Heart racing', P.pink, pop(u, 1.3), { lead: [268, 762] });
    });
    tag(c, 118, 300, 'Day 2', P.orange, pop(u, 0.15));
    caption(c, say('Blood gets *thicker.*', 0.4, 1.6), u, { y: 170, size: 58, out: 3.0 });
    caption(c, say('Your heart works *harder.*', 3.1, 4.6), u, { y: 170, size: 54 });
  };

  // S5 day three: confusion. The room melts into a spiral, then the danger line lands.
  const day3 = (c, u, t) => {
    const k = H.smooth(0.8, 2.6, u);
    if (k < 1) cam(c, 300, 460 + Math.sin(t * 2.8) * 8, 2 + k, () => { SET.warm(c, t); person(c, 300, 1050, 0.92, t, { mood: 'dizzy', pose: 'head', noShadow: true, tilt: Math.sin(t * 2.4) * 0.16, style: { top: P.violet, topD: '#37269a' } }); });
    if (k > 0) spiral(c, t, k * (1 - H.smooth(5.2, 5.5, u)));
    tag(c, 118, 300, 'Day 3', P.pink, pop(u, 0.15));
    caption(c, say('You get *confused.*', 0.3, 1.3), u, { y: 170, out: 2.7 });
    caption(c, say('In the heat, this is *deadly.*', 2.8, 4.6), u, { y: 170, size: 56, hot: P.yellow });
  };

  // S6 the surprise: the record. A cell, a teen, a calendar counting days up.
  const record = (c, u, t) => {
    const day = Math.min(18, 1 + Math.floor(Math.max(0, u - 0.9) * 5.6)), [x, y, z] = camAt([[0, 360, 680, 1], [7, 360, 620, 1.1]], u);
    cam(c, x, y, z, () => {
      c.fillStyle = F.vgrad(c, -300, 1000, '#7d86ad', '#4f5887'); c.fillRect(-500, -500, 1720, 1600); c.fillStyle = 'rgba(30,30,70,.14)'; for (let r = 0, yy = -300; yy < 1000; yy += 62, r++) for (let xx = -480 + (r % 2) * 58; xx < 1200; xx += 116) c.fillRect(xx, yy, 110, 56);
      c.fillStyle = '#2d3060'; c.fillRect(-500, 1000, 1720, 800); rr(c, 44, 150, 200, 190, 6, P.ice); for (let i = 0; i < 5; i++) rr(c, 56 + i * 40, 150, 10, 190, 3, P.ink);
      glow(c, 144, 500, 430, P.ice, 0.26); rr(c, 180, 842, 390, 34, 10, '#c8b7a0'); rr(c, 196, 874, 26, 132, 4, '#2d3060'); rr(c, 526, 874, 26, 132, 4, '#2d3060');
      person(c, 370, 1024, 0.86, t, { look_as: 'teen', mood: u > 2.5 ? 'drained' : 'sad', pose: 'lap' });
      dayCard(c, 555, 400, 1, day, '1979');
    });
    tag(c, 138, 420, 'The record', P.orange, pop(u, 0.15));
    if (u > 1.5) stat(c, 360, 1060, `${day * 24}`, 'hours', pop(u, 1.2), { size: 72 });
    if (u > 4.3) tag(c, 360, 960, 'Age 18, forgotten in a police cell', P.teal, pop(u, 4.3), { size: 26 });
    caption(c, say('The record? *18 days.*', 0.2, 1.4), u, { y: 130, size: 48, maxW: 680 });
  };

  // S7 takeaway calls back to the opening room, then the closing card, then it loops.
  const back = (c, u, t) => {
    cam(c, 360, 690, 1.03 + u * 0.02, () => { SET.bedroom(c, t, { clock: '7:00', dawn: 1 }); c.save(); c.translate(304, 690); c.rotate(-1.42); c.translate(-304, -690); c.save(); c.translate(304, 690); c.scale(0.76, 0.76); F.head(c, F.LOOKS.hero, { mood: 'happy' }, t); c.restore(); c.restore(); SET.blanket(c, 380); });
    raindrop(c, 610, 1010, 1, P.sky, E.back(pop(u, 0.3)));
    caption(c, say('So drink *up.* You run on it.', 0.2, 2.2), u, { y: 180 });
  };
  const close = (c, u, t) => endCard(c, t, u, 'What if...?', 'you stopped drinking water', () => { raindrop(c, 360, 880, 2 + Math.sin(t * 2) * 0.05, P.sky, 1); });

  const shots = [
    { t0: 0, t1: 6.8, draw: hook, in: 'cut' },
    { t0: 6.8, t1: 13, draw: hour, in: 'flash' },
    { t0: 13, t1: 20.5, draw: inside, in: 'zoom' },
    { t0: 20.5, t1: 26.5, draw: day2, in: 'zoom' },
    { t0: 26.5, t1: 32, draw: day3, in: 'zoom' },
    { t0: 32, t1: 39, draw: record, in: 'wipe' },
    { t0: 39, t1: 42, draw: back, in: 'flash' },
    { t0: 42, t1: 45, draw: close, in: 'zoom' },
  ];
  const DURATION = 45;
  const FACTS = ['A 2% body-water loss can dull attention (common sports-science finding)', 'The brain is roughly 73 to 75% water', 'Dehydration thickens blood and raises heart rate', 'Survival without water is commonly quoted as about 3 days, less in heat', 'Andreas Mihavecz, Austria 1979, 18 days, listed by Guinness'];

  window.LESSON = { BEATS: shots, DURATION, FACTS, explainer: (c, W, H_, t) => { runShots(c, shots, t); finish(c); } };
  window.scoreSound = function (k) {
    shots.slice(1).forEach((s) => k.play(s.in === 'flash' ? 'shutter' : 'whoosh', s.t0, s.in === 'flash' ? {} : { dur: 0.4 }));
    [0.2, 3.4, 7.5, 13.4, 14.1, 20.6, 21.8, 26.6, 32.1, 33.2, 36.3, 39.3].forEach((x) => k.play('pop', x, { minor: true }));
    for (let i = 0; i < 17; i++) k.play('tick', 32.9 + i * 0.178, { minor: true });
    k.play('impact', 29.3); k.play('ding', 33.3); k.play('success', 40); k.play('sparkle', 42.4);
  };
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
