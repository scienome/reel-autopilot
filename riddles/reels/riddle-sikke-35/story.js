(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // 9a + 4b = 35 -> only a = 3, b = 2.
  const coin = (c, x, y, v, a = 1) => { c.globalAlpha = a; circ(c, x, y, 54, '#c99a2a'); circ(c, x, y, 44, P.amber); c.fillStyle = P.ink; c.font = '900 46px Montserrat'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(v, x, y + 2); c.globalAlpha = 1; };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, rule: 6, r1: 4, r2: 9 },
    think: ['*Kaunse sikke?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['Sirf *₹4* aur *₹9* ke sikke', 54], rule: ['Dena hai theek *₹35*', 58], r1: ['*3 x ₹9* + *2 x ₹4*', 58], r2: ['27 + 8 = *35* ✓', 62] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      if (id === 'hook' || id === 'rule' || id === 'think') { coin(c, 260, 640, '4'); coin(c, 460, 640, '9'); stat(c, 360, 420, '₹35', '', id === 'hook' ? 0 : 1, { size: 70, bg: P.pink }); }
      else { [0, 1, 2].forEach((i) => coin(c, 140 + i * 120, 640, '9', pop(u, 0.2 + i * 0.25))); [0, 1].forEach((i) => coin(c, 500 + i * 120, 640, '4', pop(u, 1 + i * 0.25))); stat(c, 360, 420, id === 'r2' ? '35' : '₹35', id === 'r2' ? '27 + 8' : '', 1, { size: 70, bg: '#0f6b58' }); }
      critter(c, 'elephant', 360, 1120, 0.5, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 });
    },
  });
})();
