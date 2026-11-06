(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const Y = (h) => 1010 - h * 50;
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 4, rule: 5.5, r1: 3, r2: 14 },
    think: ['*Kitne din?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Khamba *12 meter*', 62], rule: ['Din mein *+3*, raat mein *-2*', 54], r1: ['*10* din, 12 nahi!', 60], r2: ['Roz *1 meter* upar', 60] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t); rr(c, 338, Y(12), 44, 1010 - Y(12), 10, '#8a4b24');
      for (let h = 0; h <= 12; h++) { line(c, [[338, Y(h)], [h % 3 ? 358 : 382, Y(h)]], h % 3 ? 3 : 4, 'rgba(255,255,255,.6)'); if (h % 3 === 0) txt(c, h + 'm', 420, Y(h), 28, P.white, 800); }
      poly(c, [[360, Y(12) - 8], [360, Y(12) - 60], [410, Y(12) - 40]], P.pink);
      let h = 0, lbl = '';
      if (id === 'hook' || id === 'think') h = 2 + Math.abs(Math.sin(u * 1.5)) * 3;
      else if (id === 'rule') { const k = (u % 3) / 3; h = k < 0.5 ? 3 * (k * 2) : 3 - 2 * ((k - 0.5) * 2); lbl = k < 0.5 ? 'Din: +3' : 'Raat: -2'; }
      else if (id === 'r1') h = 12;
      else if (id === 'r2') { const tau = Math.min(10, u / 1.3), day = Math.min(10, Math.floor(tau) + 1), ph = tau - Math.floor(tau), base = day - 1; if (tau >= 10) { h = 12; lbl = 'Din 10: 12 m'; } else if (ph < 0.55) { h = base + 3 * (ph / 0.55); lbl = 'Din ' + day + ' ↑'; } else { h = base + 3 - 2 * ((ph - 0.55) / 0.45); lbl = 'Raat ' + day + ' ↓'; } }
      critter(c, 'monkey', 360, Y(h) + 40, 0.3, t, { mood: id === 'r1' || id === 'r2' && h >= 12 ? 'happy' : 'ok', seed: 1, noShadow: true, arms: 'up' });
      if (lbl) tag(c, 150, 540, lbl, id === 'rule' && lbl[0] === 'R' || lbl[0] === 'R' ? P.violet : P.pink, 1, { size: 32 });
      if (id === 'r2') stat(c, 580, 560, Math.round(h * 10) / 10 + ' m', '', 1, { size: 44, bg: P.ink });
      if (id === 'r1') stat(c, 150, 540, '10 din', '', pop(u, 0.3), { size: 56, bg: P.pink });
    },
  });
})();
