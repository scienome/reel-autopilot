(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // 3 goats in a line: first has 2 behind, last has 2 ahead, one in the middle. Answer 3.
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 7, r1: 3.5, r2: 7 },
    think: ['*Kam se kam kitni?*', 'Number comment karo'], cta: ['Kitni gini?', 'Comment karo'],
    caps: { hook: ['Aage *2*, peeche *2*, beech mein *1*', 50], r1: ['5 nahi! Sirf *3!*', 60], r2: ['*3 bakriyan,* ek line', 54] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      const n = id === 'r1' || id === 'r2' ? 3 : 0;
      if (n) { [170, 360, 550].forEach((x, i) => { critter(c, 'goat', x, 1010, 0.62, t, { mood: 'happy', seed: i, flip: true }); tag(c, x, 1040, String(i + 1), P.pink, 1, { size: 30 }); });
        if (id === 'r2') { const k = Math.min(2, Math.floor(u / (d('r2') / 3))); const hi = [[0, '2 peeche'], [2, '2 aage'], [1, 'beech mein']][k]; glow(c, [170, 360, 550][hi[0]], 880, 200, P.yellow, 0.5); tag(c, [170, 360, 550][hi[0]], 720, hi[1], P.navy, 1, { size: 32 }); }
        stat(c, 360, 420, '3', 'bakri', 1, { size: 90, bg: '#0f6b58' }); }
      else { critter(c, 'goat', 360, 1010, 0.8, t, { mood: id === 'think' ? 'think' : 'ok', seed: 1 }); stat(c, 360, 430, '?', 'bakri', 1, { size: 90, bg: P.pink }); }
    },
  });
})();
