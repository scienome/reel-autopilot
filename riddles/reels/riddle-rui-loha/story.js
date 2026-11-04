(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // 1 kg = 1 kg: the scale stays level.
  const scale = (c, tilt) => { line(c, [[360, 560], [360, 980]], 14, P.navy); rr(c, 300, 970, 120, 26, 10, P.navy); c.save(); c.translate(360, 560); c.rotate(tilt); line(c, [[-230, 0], [230, 0]], 12, P.navy);
    for (const sd of [-1, 1]) { line(c, [[sd * 230, 0], [sd * 180, 160]], 4, P.ink); line(c, [[sd * 230, 0], [sd * 280, 160]], 4, P.ink); oval(c, sd * 230, 165, 80, 18, P.amber); } c.restore();
    return [[360 - 230 * Math.cos(tilt), 560 - 230 * Math.sin(tilt) + 140], [360 + 230 * Math.cos(tilt), 560 + 230 * Math.sin(tilt) + 140]]; };
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 5.5, r1: 4, r2: 6 },
    think: ['*Kaunsa neeche?*', 'Comment karo'], cta: ['Phanse ya nahi?', 'Comment karo'],
    caps: { hook: ['1 kilo *rui* vs 1 kilo *loha*', 54], r1: ['Loha nahi! *Barabar!*', 58], r2: ['1 kilo = *1 kilo*', 60] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      const tilt = id === 'think' ? Math.sin(t * 2) * 0.08 : 0, [L, Rr] = scale(c, tilt);
      for (let i = 0; i < 5; i++) circ(c, L[0] - 40 + i * 20, L[1] - 6 - (i % 2) * 18, 26, '#f6f6fb');
      rr(c, Rr[0] - 26, Rr[1] - 30, 52, 30, 6, '#6b7280');
      tag(c, L[0], L[1] + 50, '1 kg rui', P.teal, 1, { size: 26 }); tag(c, Rr[0], Rr[1] + 50, '1 kg loha', P.navy, 1, { size: 26 });
      critter(c, 'elephant', 360, 1200, 0.42, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 });
      if (id === 'r1' || id === 'r2') stat(c, 360, 380, '=', 'barabar', 1, { size: 90, bg: '#0f6b58' });
    },
  });
})();
