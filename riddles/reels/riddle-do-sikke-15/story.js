(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const coin = (c, x, y, v, a = 1) => { c.globalAlpha = a; circ(c, x, y, 62, '#c99a2a'); circ(c, x, y, 51, P.amber); c.fillStyle = P.ink; c.font = '900 54px Montserrat'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(v, x, y + 2); c.globalAlpha = 1; };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 4.5, r1: 3.5, r2: 8 },
    think: ['*Kaunse sikke?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Do sikke, total *₹15*', 56], rule: ['Ek sikka *₹10 ka nahi* hai', 54], r1: ['*₹5* aur *₹10*', 64], r2: ['Ek nahi hai, doosra *hai* ✓', 52] },
    scene(c, t, id, u, d) {
      SET.warm(c, t); const rev = id === 'r1' || id === 'r2';
      coin(c, 230, 700, rev ? '5' : '?'); coin(c, 490, 700, rev ? '10' : '?');
      stat(c, 360, 450, '₹15', '', pop(u, 0.15), { size: 72, bg: P.pink });
      if (id === 'rule') tag(c, 230, 830, '≠ ₹10', P.pink, pop(u, 0.5), { size: 34 });
      if (id === 'r2') { tag(c, 230, 830, '₹10 nahi ✓', P.teal, pop(u, 0.8), { size: 30 }); tag(c, 490, 830, '₹10 ho sakta', P.violet, pop(u, 2.2), { size: 30 }); }
      critter(c, 'monkey', 360, 1120, 0.5, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 });
    },
  });
})();
