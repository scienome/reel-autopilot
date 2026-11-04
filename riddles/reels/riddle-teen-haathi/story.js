(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // grandpa -> dad -> son: fathers {grandpa, dad}, sons {dad, son}.
  const X = [160, 360, 560], N = ['Dada', 'Papa', 'Beta'], S = [0.62, 0.56, 0.42];
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, rule: 4, r1: 3.5, r2: 9 },
    think: ['*Kaise?*', 'Comment karo'], cta: ['Sahi socha?', 'Comment karo'],
    caps: { hook: ['*2 papa*, *2 bete*', 60], rule: ['Kul sirf *3 haathi!*', 58], r1: ['*Dada, Papa, Beta!*', 58], r2: ['Papa = *beta bhi, papa bhi*', 48] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      X.forEach((x, i) => critter(c, 'elephant', x, 1040, S[i], t, { mood: id === 'think' ? 'think' : 'happy', seed: i, flip: i === 2 }));
      if (id === 'r1' || id === 'r2') X.forEach((x, i) => tag(c, x, 1070, N[i], [P.navy, P.pink, P.teal][i], pop(u, 0.3 + i * 0.3), { size: 30 }));
      if (id === 'r2') { const f = u / d('r2'); if (f < 0.5) { tag(c, 260, 640, 'PAPA', P.pink, 1, { size: 36 }); glow(c, 160, 900, 180, P.pink, 0.4); glow(c, 360, 900, 180, P.pink, 0.4); } else { tag(c, 460, 640, 'BETE', P.teal, 1, { size: 36 }); glow(c, 360, 900, 180, P.teal, 0.4); glow(c, 560, 900, 180, P.teal, 0.4); } }
      if (id === 'rule') stat(c, 360, 430, '3', 'haathi', 1, { size: 90, bg: P.pink });
    },
  });
})();
