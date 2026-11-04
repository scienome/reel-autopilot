(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // 2, 6, 12, 20, 30 -> differences 4, 6, 8, 10 -> next +12 = 42 (n x (n+1)).
  const NUM = ['2', '6', '12', '20', '30', '?'];
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 6.5, r1: 3, r2: 9 },
    think: ['*Agla number?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['2, 6, 12, 20, 30, *?*', 60], r1: ['*42!*', 80], r2: ['Farq: 4, 6, 8, 10, *12*', 54] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      NUM.forEach((n, i) => { const x = 85 + i * 110, y = 640; const v = i === 5 && (id === 'r1' || id === 'r2') ? '42' : n; stat(c, x, y, v, '', id === 'hook' ? pop(u, 0.4 + i * 0.6) : 1, { size: 48, bg: i === 5 ? (v === '42' ? '#0f6b58' : P.pink) : P.navy }); });
      if (id === 'r2') ['+4', '+6', '+8', '+10', '+12'].forEach((s, i) => tag(c, 140 + i * 110, 760, s, i === 4 ? '#0f6b58' : P.orange, pop(u, 0.8 + i * 1.1), { size: 28 }));
      critter(c, 'monkey', 360, 1150, 0.55, t, { mood: id === 'think' ? 'think' : 'happy', seed: 2, hold: (q) => F.kit.banana(q, 0, -70, 1) });
    },
  });
})();
