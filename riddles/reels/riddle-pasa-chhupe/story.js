(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const PIP = { 1: [[.5, .5]], 2: [[.25, .25], [.75, .75]], 3: [[.25, .25], [.5, .5], [.75, .75]], 4: [[.25, .25], [.75, .25], [.25, .75], [.75, .75]], 5: [[.25, .25], [.75, .25], [.5, .5], [.25, .75], [.75, .75]], 6: [[.25, .22], [.75, .22], [.25, .5], [.75, .5], [.25, .78], [.75, .78]] };
  const face = (c, O, U, V, n, col, pc = P.ink) => { const pt = (a, b) => [O[0] + U[0] * a + V[0] * b, O[1] + U[1] * a + V[1] * b]; poly(c, [pt(0, 0), pt(1, 0), pt(1, 1), pt(0, 1)], col); PIP[n].forEach(([a, b]) => { const [x, y] = pt(a, b); oval(c, x, y, 15, 13, pc, 0); }); };
  const die = (c, cx, cy, s) => { const a = 130 * s, h = 75 * s, L = 150 * s; face(c, [cx - a, cy - h], [a, -h], [a, h], 5, '#fffaf0'); face(c, [cx - a, cy - h], [a, h], [0, L], 3, '#eadfca'); face(c, [cx, cy], [a, -h], [0, L], 1, '#fffaf0', P.pink); };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 5, r1: 2.5, r2: 10 },
    think: ['*Chhupe ank ka jod?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['*Upar 5*, baayein *3*, daayein *1*', 48], rule: ['Saamne-saamne ka jod = *7*', 54], r1: ['Chhupe ank ka jod *12*', 54], r2: ['*2 + 4 + 6* = 12', 62] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const cy = 600; oval(c, 360, cy + 190, 190, 30, 'rgba(10,6,40,.22)'); die(c, 360, cy, 1.1);
      if (id === 'rule') { tag(c, 130, 880, '5 ↔ 2', P.pink, pop(u, 0.5), { size: 34 }); tag(c, 360, 960, '3 ↔ 4', P.violet, pop(u, 1.6), { size: 34 }); tag(c, 590, 880, '1 ↔ 6', P.teal, pop(u, 2.6), { size: 34 }); }
      if (id === 'r2') { tag(c, 360, 960, 'Neeche: 2', P.pink, pop(u, 1), { size: 34 }); tag(c, 140, 860, 'Peeche: 4', P.violet, pop(u, 3), { size: 34 }); tag(c, 580, 860, 'Peeche: 6', P.teal, pop(u, 5), { size: 34 }); stat(c, 360, 1080, '2 + 4 + 6 = 12', '', pop(u, 7), { size: 56, bg: P.pink }); }
      if (id === 'r1') stat(c, 360, 1010, '12', '', pop(u, 0.3), { size: 90, bg: P.pink });
      critter(c, 'owl', 640, 1190, 0.34, t, { mood: id === 'think' ? 'think' : 'happy', seed: 6, flip: true, noShadow: true });
    },
  });
})();
