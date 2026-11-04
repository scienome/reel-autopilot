// 016 Muscle Building 3: sets per week (Schoenfeld, Ogborn & Krieger 2017; Baz-Valle 2022)
(function () {
P.reel({ merge: [['ten or more', '10+'], ['fewer than five', 'fewer than 5']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.35, { arms: 'down', arms2: 'curl', mix: 0.5 - 0.5 * Math.cos(t * 3), blink: A.blink(t) }); P.reps(c, W / 2, 470, Math.floor(t * 2) % 11, 10);
    A.hookTitle(c, ['How Many', 'SETS?'], 'Muscle Building · Part 3'); } },
  { at: L(2) - 0.2, name: 'study', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.bgCells(c, W, H, t, '#ffffff', 5, 0.05); const g = ramp(t, L(3), L(3) + 2.5);
    [['<5', 0.35, PAL.grey], ['5-9', 0.55, PAL.cyan], ['10+', 0.85, PAL.mint]].forEach(([lab, v, col], i) => P.meter(c, 160 + i * 200, 860, 140, 460, 0.1 + (v - 0.1) * g, col, lab + ' sets'));
    P.label(c, 'Sets per muscle, per week', W / 2, 220, pop(t, L(2)), { color: PAL.amber }); P.label(c, 'More sets → more growth (to a point)', W / 2, 1010, pop(t, L(4)), { color: PAL.mint, size: 28 }); } },
  { at: L(5) - 0.2, name: 'beginner', tr: 'slide', draw: (c, t) => { P.gym(c, W, H, t); P.lifter(c, W / 2, H * 0.86, 1.3, { arms: 'flex', bulk: ramp(t, L(5), L(6)) * 0.6, smile: true, blink: A.blink(t) }); P.label(c, 'New? A few sets work at first', W / 2, 200, pop(t, L(5)), { color: PAL.mint, size: 30 }); } },
  { at: L(6) - 0.2, name: 'plan', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.week(c, W / 2, 420, 640, [4, 0, 3, 0, 3, 0, 0], ramp(t, L(6), L(6) + 1.5)); P.counter(c, '≈10 sets', W / 2, 220, 90, pop(t, L(6) + 0.4) * (1 - pop(t, A.L(A.last) - 0.3)), PAL.yellow);
    P.label(c, '2-3 days', W / 2, 600, pop(t, L(6) + 2), { color: PAL.amber }); P.lineChart(c, 140, 1060, 440, 300, [0.2, 0.3, 0.42, 0.55, 0.66, 0.75], ramp(t, L(7), L(8)), PAL.mint, 'add sets slowly'); A.next(c, t, 'HEAVY OR LIGHT?'); } },
]; }, sfx: (A) => [['riser', A.L(3), { dur: 1.5, gain: 0.3 }], ['ding', A.L(4), { f: 'E6' }], ['powerup', A.L(5) + 0.3, { gain: 0.4 }], ['pop', A.L(6) + 0.4, { f: 800 }], ['blip', A.L(6) + 2, { f: 'G6' }]] });
