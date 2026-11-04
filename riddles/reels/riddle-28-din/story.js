(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // every month has at least 28 days -> 12.
  const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, r1: 4, r2: 6 },
    think: ['*Kitne mahine?*', 'Number comment karo'], cta: ['Kya bola?', 'Comment karo'],
    caps: { hook: ['Kuch mein *31*, kuch mein *30*', 54], r1: ['Sirf Feb nahi! *Saare 12!*', 54], r2: ['Har mahine mein *28 din* hote hi hain', 46] },
    scene(c, t, id, u, d) {
      SET.office(c, t);
      M.forEach((m, i) => { const x = 140 + (i % 3) * 220, y = 520 + Math.floor(i / 3) * 130, on = (id === 'r1' || id === 'r2') ? pop(u, 0.2 + i * 0.12) : (id === 'think' && i === 1 ? 1 : 0);
        rr(c, x - 90, y - 50, 180, 100, 18, P.white); rr(c, x - 90, y - 50, 180, 30, 12, on > 0.5 ? P.teal : P.pink); c.fillStyle = P.ink; c.font = '900 34px Montserrat'; c.textAlign = 'center'; c.fillText(m, x, y + 30);
        if (on > 0.5) { c.fillStyle = '#0f6b58'; c.font = '900 26px Montserrat'; c.fillText('28 ✓', x + 50, y - 26); } });
      critter(c, 'owl', 360, 1180, 0.5, t, { mood: id === 'think' ? 'think' : 'happy', seed: 3 });
      if (id === 'r1' || id === 'r2') stat(c, 360, 380, '12', 'mahine', 1, { size: 86, bg: '#0f6b58' });
    },
  });
})();
