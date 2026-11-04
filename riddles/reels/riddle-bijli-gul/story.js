(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // power cut: the goat says she was reading, but her room has no light at all (rabbit's has a candle).
  const candle = (c, x, y, t) => { rr(c, x - 12, y - 60, 24, 60, 4, '#f6f0dc'); const f = 1 + Math.sin(t * 12) * 0.12; glow(c, x, y - 76, 120, P.amber, 0.7); oval(c, x, y - 76, 9 * f, 18 * f, P.amber); };
  const R3 = [{ k: 'rabbit', n: 'Khargosh', x: 130, light: true }, { k: 'elephant', n: 'Haathi', x: 360 }, { k: 'goat', n: 'Bakri', x: 590 }];
  F.runRiddle('r', {
    ids: ['hook', 's1', 's2', 'think', 'r1', 'r2', 'cta'], min: { hook: 7, s1: 7, s2: 4.5, r1: 4, r2: 8 },
    think: ['*Chor kaun?*', 'Naam comment karo'], cta: ['Pakda?', 'Comment karo'],
    caps: { hook: ['Raat 8 baje. *Bijli gul.* Kitaab chori!', 46], s1: ['Khargosh: *mombatti*. Haathi: *so gaya*', 42], s2: ['Bakri: *kitaab padh rahi thi*', 48], r1: ['*Bakri!* Kamra dekho', 56], r2: ['*Andhere mein* kaise padhi?', 52] },
    scene(c, t, id, u, d) {
      c.fillStyle = '#0d0b2a'; c.fillRect(0, 0, 720, 1280);
      R3.forEach((a, i) => { const x0 = 20 + i * 230; rr(c, x0, 600, 220, 560, 16, a.light ? '#2a2050' : '#14102e'); if (a.light) candle(c, a.x + 60, 1080, t); });
      R3.forEach((a, i) => { const hot = (id === 'r1' || id === 'r2') && i === 2; if (hot) glow(c, a.x, 900, 200, P.pink, 0.4); c.globalAlpha = a.light || hot ? 1 : 0.75; critter(c, a.k, a.x, 1080, 0.42, t, { mood: hot ? 'scared' : id === 'think' ? 'think' : i === 1 ? 'sleepy' : 'ok', seed: i }); c.globalAlpha = 1; tag(c, a.x, 1110, a.n, hot ? '#d12f52' : P.navy, 1, { size: 24 }); });
      if (id === 's1') { bubble(c, 130, 700, 'Mombatti jalakar|khana bana raha tha', 130, 900, pop(u, 0.3), { size: 22 }); bubble(c, 360, 640, 'Jaldi so gaya|tha', 360, 900, pop(u, 3), { size: 24 }); }
      if (id === 's2') bubble(c, 520, 680, 'Kitaab padh|rahi thi', 590, 900, pop(u, 0.3), { size: 26 });
      if (id === 'r2') tag(c, 510, 760, 'KOI ROSHNI NAHI', '#d12f52', pop(u, 0.5), { size: 26 });
    },
  });
})();
