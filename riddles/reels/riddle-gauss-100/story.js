(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const PAIRS = [[1, 100], [2, 99], [3, 98], [4, 97], [5, 96]];
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, rule: 6, r1: 2.5, r2: 14 },
    think: ['*Kul jod?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['*1 + 2 + 3 + ... + 100*', 52], rule: ['Ek-ek karke bahut der lagegi', 48], r1: ['*5050*', 80], r2: ['*50* jodiyan x *101*', 58] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      critter(c, 'owl', 120, 1100, 0.55, t, { mood: id === 'think' ? 'think' : 'happy', seed: 3 });
      if (id === 'hook' || id === 'rule' || id === 'think') { ['1', '2', '3', '...', '99', '100'].forEach((s, i) => { const k = pop(u, 0.15 * i); if (k > 0) stat(c, 130 + (i % 3) * 230, 540 + Math.floor(i / 3) * 140, s, '', k, { size: 56, bg: i === 3 ? P.violet : P.ink }); }); }
      if (id === 'r1') stat(c, 360, 640, '5050', '', pop(u, 0.2), { size: 120, bg: P.pink });
      if (id === 'r2') {
        PAIRS.forEach(([a, b], i) => { const k = pop(u, 1 + i * 1.6, 0.5); if (k > 0) { stat(c, 250, 430 + i * 110, a + ' + ' + b, '', k, { size: 42, bg: P.ink }); stat(c, 540, 430 + i * 110, '= 101', '', pop(u, 1.6 + i * 1.6, 0.4), { size: 42, bg: P.teal }); } });
        stat(c, 400, 1030, '50 x 101 = 5050', '', pop(u, 10.5), { size: 56, bg: P.pink });
      }
    },
  });
})();
