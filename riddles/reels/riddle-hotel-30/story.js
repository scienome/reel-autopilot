(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const F3 = [['monkey', 130], ['rabbit', 360], ['fox', 590]];
  F.runRiddle('r', {
    ids: ['hook', 'pay', 'calc', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, pay: 8, calc: 9, r1: 3, r2: 12 },
    think: ['*Ek rupaya kahan?*', 'Comment karo'], cta: ['Nikaala?', 'Comment karo'],
    caps: { hook: ['3 dost x *₹10* = ₹30', 56], pay: ['Kiraya *₹25*, wapas *₹5*', 54], calc: ['27 + 2 = *29*. Ek *gayab*?', 52], r1: ['Rupaya *gaya nahi*!', 56], r2: ['25 + 2 + 3 = *30*', 60] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      F3.forEach(([k, x], i) => { critter(c, k, x, 1090, 0.5, t, { mood: id === 'think' ? 'think' : id === 'calc' ? 'shock' : 'ok', seed: i }); const v = id === 'hook' ? '₹10' : id === 'pay' ? (u > 4 ? '₹9' : '₹10') : '₹9'; stat(c, x, 840, v, '', pop(u, 0.2 + i * 0.25), { size: 46, bg: P.ink }); });
      if (id === 'hook') stat(c, 360, 480, '₹30', '', pop(u, 1.4), { size: 80, bg: P.pink });
      if (id === 'pay') { tag(c, 200, 500, 'Kiraya ₹25', P.teal, pop(u, 0.6), { size: 34 }); tag(c, 520, 500, 'Wapas ₹5', P.pink, pop(u, 2), { size: 34 }); tag(c, 200, 600, 'Waiter ke ₹2', P.orange, pop(u, 3.6), { size: 30 }); tag(c, 520, 600, 'Dosto ko ₹1 x 3', P.violet, pop(u, 5), { size: 30 }); }
      if (id === 'calc' || id === 'think') { stat(c, 360, 470, '27 + 2 = 29', '', pop(u, 1.8), { size: 62, bg: P.ink }); tag(c, 360, 590, '30 mein se 1 kam?', P.pink, pop(u, 4.5), { size: 36 }); }
      if (id === 'r1') tag(c, 360, 500, 'Hisaab galat joda gaya', P.pink, pop(u, 0.3), { size: 40 });
      if (id === 'r2') { stat(c, 360, 440, '27 = 25 + 2', '', pop(u, 0.4), { size: 58, bg: P.ink }); tag(c, 360, 540, 'Waiter ke ₹2 pehle se 27 mein hain', P.violet, pop(u, 2.5), { size: 26 }); stat(c, 360, 650, '25 + 2 + 3 = 30', '', pop(u, 6.5), { size: 56, bg: '#0f6b58' }); }
    },
  });
})();
