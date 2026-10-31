// Three pills, two gaps: the last pill is swallowed at 60 minutes, not 90.
(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line } = F, { pop, txt, E } = F.kit, X = [120, 360, 600], Y = 650;
  const pill = (c, x, y, k, col) => { if (k <= 0) return; c.save(); c.translate(x, y - (1 - E.out(k)) * 60); c.scale(k, k); c.rotate(-0.5); rr(c, -50, -24, 100, 48, 24, P.white); c.save(); c.beginPath(); c.roundRect(-50, -24, 100, 48, 24); c.clip(); c.fillStyle = col; c.fillRect(0, -24, 54, 48); c.restore(); c.restore(); };
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'],
    min: { hook: 8, r1: 3.5, r2: 7 },
    think: ['*Kitna time lagega?*', 'Comment karo'],
    cta: ['Aapka jawab?', 'Comment karo'],
    caps: { hook: ['*3 goliyan.* Beech mein *aadha ghanta.*', 52], r1: ['*90 minute* nahi!', 62], r2: ['3 goliyan, par gap sirf *2!*', 52] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      rr(c, 36, 490, 648, 300, 28, 'rgba(255,255,255,.9)');
      line(c, [[X[0], Y + 80], [X[2], Y + 80]], 8, '#c9c1dd');
      const hk = id === 'hook' ? d('hook') : 1, at = id === 'hook' ? [hk * 0.3, hk * 0.55, hk * 0.8] : [0, 0, 0];
      const cols = [P.pink, P.teal, P.orange];
      X.forEach((x, i) => { pill(c, x, Y, pop(u, at[i]), cols[i]); circ(c, x, Y + 80, 14, cols[i]); });
      if (id === 'hook') { tag(c, X[0], Y + 135, 'ABHI', P.pink, pop(u, at[0] + 0.2), { size: 30 }); tag(c, 240, Y + 135, '30 min', P.navy, pop(u, at[1] + 0.1), { size: 30 }); tag(c, 480, Y + 135, '30 min', P.navy, pop(u, at[2] + 0.1), { size: 30 }); }
      if (id === 'r1') { stat(c, 360, 380, '90', 'min', 1, { size: 86, bg: '#8a2b3d' }); const k = pop(u, 0.7, 0.3); line(c, [[262, 420], [262 + 176 * k, 420 - 80 * k]], 12, '#ffd93b'); tag(c, 240, Y + 135, '30', P.navy, 1, { size: 30 }); tag(c, 480, Y + 135, '30', P.navy, 1, { size: 30 }); tag(c, 360, Y + 205, '+ 30 ?', '#8a2b3d', pop(u, 1.4), { size: 30 }); }
      if (id === 'r2') {
        const a = pop(u, 1.0, 0.4), b = pop(u, 2.6, 0.4);
        line(c, [[X[0], Y + 80], [X[0] + 240 * a, Y + 80]], 14, P.teal); line(c, [[X[1], Y + 80], [X[1] + 240 * b, Y + 80]], 14, P.teal);
        tag(c, 240, Y + 135, 'gap 1', P.teal, a, { size: 30 }); tag(c, 480, Y + 135, 'gap 2', P.teal, b, { size: 30 });
        stat(c, 360, 380, b > 0.9 ? '60' : '30', 'min', 1, { size: 86, bg: b > 0.9 ? '#0f6b58' : P.navy });
      }
      critter(c, 'monkey', 360, 1085, 0.8, t, { mood: id === 'r2' ? 'happy' : 'think', look: [0, -1] });
    },
  });
})();
