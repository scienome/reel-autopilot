(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // digit 9 in 1..100: units 10 times + tens 10 times = 20 (99 counts twice).
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, r1: 3.5, r2: 12 },
    think: ['*Kitni baar 9?*', 'Number comment karo'], cta: ['Kitna kaha?', 'Comment karo'],
    caps: { hook: ['*1 se 100* tak likha', 58], r1: ['10 nahi! *20 baar!*', 60], r2: ['Ikaai *10* + Dahaai *10* = *20*', 48] },
    scene(c, t, id, u, d) {
      SET.office(c, t); rr(c, 40, 380, 640, 690, 20, P.paper);
      const f = id === 'r2' ? u / d('r2') : 0;
      for (let n = 1; n <= 100; n++) { const i = n - 1, x = 72 + (i % 10) * 64, y = 420 + Math.floor(i / 10) * 64, s = String(n), u9 = n % 10 === 9, t9 = Math.floor(n / 10) === 9 && n < 100;
        const hot = id === 'r2' && ((f < 0.5 && u9) || (f >= 0.5 && (u9 || t9))); if (hot) circ(c, x, y - 4, 26, f >= 0.5 && t9 ? 'rgba(20,156,134,0.35)' : 'rgba(239,63,128,0.35)');
        c.fillStyle = s.includes('9') && id !== 'hook' && id !== 'think' ? '#d12f52' : P.ink; c.font = '800 24px Montserrat'; c.textAlign = 'center'; c.fillText(s, x, y + 4); }
      critter(c, 'owl', 620, 1170, 0.36, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 });
      if (id === 'r1' || id === 'r2') stat(c, 360, 300, '20', 'baar', 1, { size: 64, bg: '#0f6b58' });
    },
  });
})();
