(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // meshed gears alternate direction: 5 gears -> 1st and 5th both clockwise.
  const gear = (c, x, y, r, a, col) => { c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = col; c.beginPath(); for (let i = 0; i < 24; i++) { const ang = (i / 24) * Math.PI * 2, rr2 = i % 2 ? r : r + 14; c.lineTo(Math.cos(ang) * rr2, Math.sin(ang) * rr2); } c.closePath(); c.fill(); circ(c, 0, 0, r * 0.35, P.white); line(c, [[0, 0], [r * 0.8, 0]], 6, P.white); c.restore(); };
  const X = [110, 235, 360, 485, 610];
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 8, r1: 3.5, r2: 9 },
    think: ['*Aakhri kis taraf?*', 'Comment karo'], cta: ['Sahi bataya?', 'Comment karo'],
    caps: { hook: ['5 pahiye. Pehla *ghadi ki disha* mein', 48], r1: ['*Ghadi ki disha* mein!', 56], r2: ['*Seedha, ulta, seedha, ulta, seedha*', 44] },
    scene(c, t, id, u, d) {
      SET.lab(c, t);
      const spin = id === 'think' || id === 'hook' ? 0 : 1, show = id === 'r2' ? Math.min(5, 1 + Math.floor(u / (d('r2') / 5.5))) : id === 'r1' ? 5 : 1;
      X.forEach((x, i) => { const dir = i % 2 ? -1 : 1, rot = (i < show || id === 'hook' && i === 0 ? t * 1.2 : 0) * dir; gear(c, x, 760, 54, rot + i * 0.13, i === 4 && id !== 'hook' && id !== 'think' ? '#0f6b58' : [P.pink, P.orange, P.teal, P.purple, P.navy][i]);
        if ((id === 'r2' && i < show) || (id === 'r1' && i === 4) || (id === 'hook' && i === 0)) tag(c, x, 870, dir > 0 ? '⟳' : '⟲', dir > 0 ? '#0f6b58' : '#d12f52', 1, { size: 40 }); });
      if (id === 'think') tag(c, 610, 870, '?', P.pink, 1, { size: 46 });
      critter(c, 'monkey', 360, 1150, 0.5, t, { mood: id === 'think' ? 'think' : 'happy', seed: 2 });
    },
  });
})();
