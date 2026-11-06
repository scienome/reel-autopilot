(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 5.5, rule: 6, r1: 3, r2: 10 },
    think: ['*Average speed?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Chadhai *30 km/h*', 62], rule: ['Utraai *60 km/h*. Average?', 56], r1: ['*40*, 45 nahi!', 64], r2: ['*120 km* ÷ *3 ghante* = 40', 50] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      poly(c, [[-40, 960], [380, 470], [760, 960]], '#6e7a58'); poly(c, [[380, 470], [330, 540], [380, 520], [420, 550]], P.white);
      const up = id === 'hook' || id === 'rule' && u < 3, k = id === 'r2' ? 0.3 : 0.5, x = up ? 90 + 290 * Math.min(1, u / 4) : 380 + 290 * Math.min(1, (u % 4) / 3), y = 960 - 490 * (1 - Math.abs(x - 380) / 290);
      critter(c, 'rabbit', id === 'think' ? 140 : x, id === 'think' ? 900 : y + 10, 0.42, t, { mood: id === 'think' ? 'think' : 'happy', hop: true, flip: !up && id !== 'think', noShadow: true, seed: 2 });
      if (id === 'hook' || id === 'rule') { tag(c, 175, 790, '↑ 30 km/h', P.pink, pop(u, 0.4), { size: 32 }); if (id === 'rule') tag(c, 560, 790, '↓ 60 km/h', P.teal, pop(u, 0.5), { size: 32 }); }
      if (id === 'r1') stat(c, 360, 300 + 0, '40 km/h', '', pop(u, 0.2), { size: 70, bg: P.pink });
      if (id === 'r2') { tag(c, 190, 770, '↑ 60 km = 2 ghante', P.pink, pop(u, 0.6), { size: 26 }); tag(c, 520, 840, '↓ 60 km = 1 ghanta', P.teal, pop(u, 3), { size: 26 }); stat(c, 360, 1030, '120 ÷ 3 = 40', '', pop(u, 6), { size: 64, bg: '#0f6b58' }); }
    },
  });
})();
