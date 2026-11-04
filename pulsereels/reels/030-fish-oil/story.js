// 030 Supplements 5: fish oil (Rossato 2020; Kyriakidou 2021; Rimm 2018 AHA)
(function () {
const fish = (c, x, y, s, t, col = '#ff8a6a') => { c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(t * 3) * 0.05); P.flat(c, P.poly([[90, 0], [140, -40], [140, 40]]), P.shade(col, 0.1), { off: 4 }); P.flat(c, P.ell(0, 0, 110, 52), col, { off: 7 }); P.fill(c, P.circ(-70, -10, 10), PAL_.ink); c.restore(); };
const PAL_ = P.PAL;
P.reel({ merge: [['omega three', 'omega-3'], ['e p a', 'EPA'], ['d h a', 'DHA']], scenes: (A) => { const { L, pop, ramp, W, H, PAL } = A; return [
  { at: 0, name: 'hook', draw: (c, t) => { P.bg(c, W, H, 'deep', t); P.bgCells(c, W, H, t, PAL.cyan, 3, 0.05); fish(c, W / 2, 720, 1.6, t); for (let i = 0; i < 5; i++) P.softgel(c, 130 + i * 115, 1020 + Math.sin(t * 2 + i) * 10, 0.9, 0.4 * i);
    A.hookTitle(c, ['FISH OIL', 'For Muscle?'], 'Supplement Series · Part 5'); } },
  { at: L(2) - 0.2, name: 'omega', tr: 'zoom', focus: [W / 2, 1020], draw: (c, t) => { P.bg(c, W, H, 'violet', t); P.softgel(c, W / 2, 560, 3.2, 0.2); P.label(c, 'Omega-3: EPA + DHA', W / 2, 220, pop(t, L(2) + 0.6), { color: PAL.amber, size: 34 }); } },
  { at: L(3) - 0.2, name: 'muscle', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'night', t); P.evidence(c, W / 2, 440, 1, pop(t, L(3) + 0.8)); P.label(c, 'For muscle growth: mixed', W / 2, 220, pop(t, L(3)), { color: PAL.red, size: 30 });
    P.label(c, 'Maybe slightly less soreness', W / 2, 760, pop(t, L(4)), { color: PAL.cyan, size: 30 }); P.muscleBelly(c, W / 2 + 70, 1080, 340, 110, 0, 0.3 + 0.2 * Math.sin(t * 3), t, { col: pop(t, L(4) + 0.5) > 0 ? '#ff6f80' : '#d93f55' }); } },
  { at: L(5) - 0.2, name: 'heart', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'plum', t); P.heart(c, W / 2, 520, 140, t * 1.5); P.label(c, 'Strongest case: your HEART', W / 2, 200, pop(t, L(5)), { color: PAL.pink, size: 32 });
    if (pop(t, L(6)) > 0) { fish(c, 220, 1060, 0.7, t); fish(c, 500, 1060, 0.7, t + 1); P.label(c, 'Oily fish ~2x a week', W / 2, 860, pop(t, L(6) + 0.4), { color: PAL.amber }); } } },
  { at: L(7) - 0.2, name: 'option', tr: 'slide', draw: (c, t) => { P.bg(c, W, H, 'deep', t); const e = pop(t, L(8) - 0.2); P.softgel(c, W / 2, 620, 2.2);
    P.check(c, "No fish? A supplement is an option", W / 2, 200, true, pop(t, L(7)) * (1 - e), 26); P.bubble(c, 'Blood thinners? Ask your doctor', W / 2, 330, pop(t, L(7) + 2.2) * (1 - e), { color: PAL.red }); A.next(c, t, 'VITAMIN D'); } },
]; }, sfx: (A) => [['sparkle', 0.4, { n: 5 }], ['pop', A.L(2) + 0.6, { f: 760 }], ['error', A.L(3) + 0.8, { gain: 0.3 }], ['ding', A.L(4), { f: 'E6' }], ['thud', A.L(5), { gain: 0.4 }], ['thud', A.L(5) + 0.5, { gain: 0.4 }], ['pop', A.L(6) + 0.4, { f: 820 }], ['pop', A.L(7), { f: 700 }], ['error', A.L(7) + 2.2, { gain: 0.3 }]] });
