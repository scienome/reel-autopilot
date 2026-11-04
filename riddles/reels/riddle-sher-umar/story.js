(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // 4s + 20 = 2(s + 20) -> s = 10, father 40. Check: 60 = 2 * 30.
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'cta'], min: { hook: 4, rule: 5.5, r1: 4, r2: 8 },
    think: ['*Dono ki umar?*', 'Comment karo'], cta: ['Kitni der lagi?', 'Comment karo'],
    caps: { hook: ['Sher = *4 x* beta', 60], rule: ['20 saal baad: sirf *2 x*', 56], r1: ['Beta *10*, Sher *40!*', 60], r2: ['60 = *2 x 30* ✓', 60] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      const later = id === 'rule' || (id === 'r2' && u > d('r2') * 0.45);
      critter(c, 'lion', 230, 1060, later ? 0.66 : 0.64, t, { mood: id === 'think' ? 'think' : 'happy', seed: 1 }); critter(c, 'lion', 510, 1080, later ? 0.6 : 0.4, t, { mood: 'happy', seed: 2, flip: true });
      const show = id === 'r1' || id === 'r2';
      stat(c, 230, 640, show ? (later ? '60' : '40') : '?', 'saal', 1, { size: 70, bg: P.navy }); stat(c, 510, 680, show ? (later ? '30' : '10') : '?', 'saal', 1, { size: 70, bg: P.pink });
      if (id === 'rule' || later) tag(c, 360, 420, '+20 SAAL', P.orange, 1, { size: 40 });
    },
  });
})();
