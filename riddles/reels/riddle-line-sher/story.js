(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const X = (i) => 48 + i * 33.6;
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 3, r1: 2.5, r2: 9 },
    think: ['*Peeche se kaunsa?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['20 jaanwar, sher *aage se 8wa*', 52], rule: ['Ab *peeche se* gino', 54], r1: ['Peeche se *13wa*', 64], r2: ['7 aage + sher + *12 peeche*', 50] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t); const rev = id === 'r1' || id === 'r2';
      for (let i = 0; i < 20; i++) { const a = pop(u, 0.02 * i, 0.2), col = i === 7 ? P.yellow : rev && id === 'r2' && u > 3 ? (i < 7 ? P.sky : P.pink) : P.white; if (id !== 'hook' || a > 0) circ(c, X(i), 760, 16 * (id === 'hook' ? a : 1), col); }
      critter(c, 'lion', X(7), 740, 0.42, t, { mood: id === 'think' ? 'think' : 'happy', seed: 3, noShadow: true });
      tag(c, 110, 880, '← AAGE', P.violet, 1, { size: 28 }); tag(c, 610, 880, 'PEECHE →', P.violet, 1, { size: 28 });
      if (id === 'hook' || id === 'rule') tag(c, X(7), 620, '8', P.pink, pop(u, 2), { size: 38 });
      if (id === 'r2') { tag(c, X(3), 650, '7 aage', P.sky, pop(u, 2.8), { size: 30, ink: P.ink }); tag(c, X(13), 650, '12 peeche', P.pink, pop(u, 4.5), { size: 30 }); stat(c, 360, 1010, '12 + 1 = 13', '', pop(u, 6.5), { size: 62, bg: '#0f6b58' }); }
      if (id === 'r1') stat(c, 360, 1010, '13', 'wa', pop(u, 0.3), { size: 80, bg: P.pink });
    },
  });
})();
