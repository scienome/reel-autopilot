// Lion, goat, grass. Goat over; back empty; lion over, goat back; grass over; back empty; goat over. 7 crossings.
(function () {
  const F = window.FLAT, { P, SET, tag, critter, rr, oval, circ, line, boat, grassBundle, confetti } = F, { pop, E } = F.kit, LX = 300, RX = 420, ROW = { lion: 740, goat: 890, grass: 1030 }, BANKX = [70, 650];
  // per shot: where each item starts (0 = left bank), what rides forward, what rides back
  const SHOT = { r1: { s: { lion: 0, goat: 0, grass: 0 }, fwd: 'goat', back: null }, r2: { s: { lion: 0, goat: 1, grass: 0 }, fwd: 'lion', back: 'goat' }, r3: { s: { lion: 1, goat: 0, grass: 0 }, fwd: 'grass', back: null }, r4: { s: { lion: 1, goat: 0, grass: 1 }, fwd: 'goat', back: null, last: true } };
  const item = (c, k, x, y, s, t, mood) => { if (k === 'grass') grassBundle(c, x, y, s * 1.1, t); else critter(c, k, x, y, s * 0.5, t, { mood, seed: k === 'lion' ? 1 : 2, flip: x > 360 }); };
  F.runRiddle('r', {
    ids: ['hook', 'rule', 'think', 'r1', 'r2', 'r3', 'r4', 'cta'],
    min: { hook: 6, rule: 6, r1: 5, r2: 8, r3: 8, r4: 6 },
    think: ['*Kaise paar karoge?*', 'Comment karo'],
    cta: ['Aap kaise karte?', 'Comment karo'],
    caps: { hook: ['*Sher, bakri, ghaas.* Nav mein sirf *1!*', 50], rule: ['Peeche chhodoge toh *khaa jayega!*', 50], r1: ['Pehle *bakri* paar.', 60], r2: ['*Sher* paar, bakri *wapas!*', 54], r3: ['Ab *ghaas* paar.', 60], r4: ['Aakhir mein *bakri!*', 60] },
    scene(c, t, id, u, d) {
      SET.river(c, t);
      rr(c, -40, 600, 190, 560, 30, '#5bb04a'); rr(c, 570, 600, 190, 560, 30, '#5bb04a');
      const sp = SHOT[id], f = sp ? u / d(id) : 0, ph = (a, b) => E.inOut(H.clamp((f - a) / (b - a)));
      let bx = LX, side = { lion: 0, goat: 0, grass: 0 }, ride = null;
      if (sp) {
        side = Object.assign({}, sp.s); const fe = sp.last ? 0.65 : 0.45;
        if (f < 0.1) bx = LX; else if (f < fe) { bx = H.lerp(LX, RX, ph(0.1, fe)); ride = sp.fwd; } else if (!sp.back || f < 0.55) { bx = RX; side[sp.fwd] = 1; } else if (f < 0.9) { bx = H.lerp(RX, LX, ph(0.55, 0.9)); side[sp.fwd] = 1; ride = sp.back; } else { bx = LX; side[sp.fwd] = 1; side[sp.back] = 0; }
        if (!sp.back && f >= fe) bx = sp.last ? RX : H.lerp(RX, LX, ph(0.6, 0.95)), side[sp.fwd] = 1;
      }
      ['lion', 'goat', 'grass'].forEach((k) => { if (k === ride) return; const mood = id === 'rule' && k !== 'grass' ? 'hungry' : 'ok'; item(c, k, BANKX[side[k]], ROW[k], 1, t, mood); });
      boat(c, bx, 780, 0.55, t, (q) => { critter(q, 'monkey', -85, -30, 0.9, t, { mood: id === 'r4' && f > 0.7 ? 'happy' : 'think', seed: 3 }); if (ride) item(q, ride, 70, -30, 1.7, t, 'ok'); });
      if (id === 'rule') { tag(c, 200, 1150, 'Sher > Bakri', '#c9264f', pop(u, 0.8), { size: 32 }); tag(c, 530, 1150, 'Bakri > Ghaas', '#c9264f', pop(u, 2.6), { size: 32 }); }
      if (id === 'r4' && f > 0.7) confetti(c, t, u - d('r4') * 0.7, 5, 50);
    },
  });
})();
