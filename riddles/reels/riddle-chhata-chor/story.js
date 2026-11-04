(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, laddoo, mango, coconut, bulb } = F.kit;
  // the fox says she never went out, but her umbrella by the door is dripping wet (on screen from the start).
  const umb = (c, x, y, t) => { c.save(); c.translate(x, y); c.scale(1.8, 1.8); c.translate(-x, -y); line(c, [[x, y - 90], [x + 8, y]], 6, P.ink); c.fillStyle = '#d12f52'; c.beginPath(); c.moveTo(x - 46, y - 80); c.quadraticCurveTo(x, y - 150, x + 46, y - 80); c.closePath(); c.fill();
    for (let i = 0; i < 3; i++) { const k = (t * 1.2 + i / 3) % 1; circ(c, x - 30 + i * 30, y - 76 + k * 90, 6, '#58c6e6'); } oval(c, x, y + 4, 40, 8, 'rgba(88,198,230,0.6)'); c.restore(); };
  const A = [{ k: 'monkey', n: 'Bandar', x: 140 }, { k: 'bear', n: 'Bhalu', x: 360 }, { k: 'fox', n: 'Lomdi', x: 580 }];
  F.runRiddle('r', {
    ids: ['hook', 's1', 's2', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, s1: 6, s2: 5, r1: 4, r2: 8 },
    think: ['*Chor kaun?*', 'Naam comment karo'], cta: ['Chhata dekha tha?', 'Comment karo'],
    caps: { hook: ['Baarish ki raat. *Aam chori!*', 52], s1: ['Bandar: *ghoom raha tha*. Bhalu: *nadi par*', 42], s2: ['Lomdi: *ghar par soyi thi*', 50], r1: ['*Lomdi!* Chhata dekho', 56], r2: ['Ghar par thi? *Chhata geela kyun?*', 46] },
    scene(c, t, id, u, d) {
      SET.river(c, t); c.fillStyle = 'rgba(30,40,90,0.35)'; c.fillRect(0, 0, 720, 1280);
      for (let i = 0; i < 40; i++) { const x = (i * 97 + t * 60) % 720, y = (i * 211 + t * 900) % 1280; line(c, [[x, y], [x - 6, y + 24]], 2, 'rgba(200,230,255,0.5)'); }
      rr(c, 560, 760, 130, 270, 10, '#7a4a2a'); umb(c, 625, 1040, t);
      A.forEach((a, i) => { const hot = (id === 'r1' || id === 'r2') && i === 2; if (hot) glow(c, a.x, 900, 220, P.pink, 0.45); critter(c, a.k, a.x, 1060, 0.52, t, { mood: hot ? 'scared' : id === 'think' ? 'think' : 'ok', seed: i }); tag(c, a.x, 1085, a.n, hot ? '#d12f52' : P.navy, 1, { size: 26 }); });
      if (id === 's1') { bubble(c, 140, 700, 'Baarish mein|ghoom raha tha', 140, 880, pop(u, 0.3), { size: 26 }); bubble(c, 420, 590, 'Nadi par|machhli pakad raha tha', 360, 880, pop(u, 2.5), { size: 26 }); }
      if (id === 's2') bubble(c, 520, 660, 'Raat bhar ghar par|soyi thi', 580, 880, pop(u, 0.3), { size: 26 });
      if (id === 'r1' || id === 'r2') { glow(c, 615, 980, 160, P.yellow, 0.6); tag(c, 560, 780, 'GEELA!', '#d12f52', pop(u, 0.5), { size: 34 }); }
    },
  });
})();
