(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const arrow = (c, x, y) => txt(c, '→', x, y, 70, P.white);
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 4, rule: 5, r1: 3, r2: 10 },
    think: ['*Ab kitna?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Bhaav *₹100*', 62], rule: ['*50% upar*, phir *50% neeche*', 52], r1: ['*₹75*, 100 nahi!', 60], r2: ['150 ka aadha = *75*', 60] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      const vals = ['₹100', id === 'hook' ? '' : '₹150', id === 'r1' || id === 'r2' ? '₹75' : id === 'rule' && u > 3 ? '?' : ''];
      [[130, vals[0], P.ink, 0.1], [360, vals[1], '#0f6b58', 1.6], [590, vals[2], P.pink, 3.2]].forEach(([x, v, bg, at], i) => { if (!v) return; const k = id === 'rule' || id === 'hook' ? pop(u, at) : pop(u, 0.2 + i * 0.3); stat(c, x, 560, v, '', k, { size: 48, bg }); if (i) arrow(c, x - 115, 560); });
      if (id === 'rule') { tag(c, 245, 690, '+ 50%', P.teal, pop(u, 1.8), { size: 32 }); tag(c, 475, 690, '- 50%', P.pink, pop(u, 3.4), { size: 32 }); }
      if (id === 'r2') { tag(c, 245, 690, '100 + 50', P.teal, pop(u, 1), { size: 30 }); tag(c, 475, 690, '150 - 75', P.pink, pop(u, 4), { size: 30 }); tag(c, 360, 800, 'Girawat bade 150 par thi', P.violet, pop(u, 7), { size: 28 }); }
      critter(c, 'elephant', 360, 1130, 0.5, t, { mood: id === 'think' ? 'think' : id === 'r2' || id === 'r1' ? 'happy' : 'shock', seed: 5 });
    },
  });
})();
