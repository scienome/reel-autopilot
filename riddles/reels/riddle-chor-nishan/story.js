(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, rr, line, poly, glow, bubble } = F, { pop, txt, laddoo, hatOn } = F.kit;
  const RED = '#e5383b', BLUE = '#2b4fb8';
  const A = [['monkey', 80, RED, 1, 'Bandar'], ['fox', 220, RED, 0, 'Lomdi'], ['bear', 360, BLUE, 1, 'Bhaalu'], ['rabbit', 500, null, 1, 'Khargosh'], ['owl', 640, BLUE, 0, 'Ullu']];
  const stage = { hook: 0, c1: 1, c2: 2, c3: 3, think: 3, r1: 3, r2: 3 };
  const gone = (i, id, u) => { const s = stage[id], a = A[i], by = [!a[2], a[2] === RED, !a[3]]; for (let k = 0; k < 3; k++) { if (by[k] && (s > k + 1 || (s === k + 1 && u > 1.8))) return true; } return false; };
  F.runRiddle('r', {
    ids: ['hook', 'c1', 'c2', 'c3', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, c1: 4.5, c2: 4.5, c3: 4.5, r1: 2.5, r2: 11 },
    think: ['*Chor kaun?*', 'Comment karo'], cta: ['Pakda?', 'Comment karo'],
    caps: { hook: ['Shahad *chori*! 5 par shak', 54], c1: ['Chor ne *topi* pehni thi', 54], c2: ['Topi *laal nahi* thi', 58], c3: ['Haath mein *thaila* tha', 54], r1: ['Chor *bhaalu*!', 72], r2: ['Topi + laal nahi + thaila = *bhaalu*', 44] },
    scene(c, t, id, u, d) {
      SET.jungle(c, t);
      if (id === 'hook' || id === 'think') F.kit.honey(c, 360, 560, 1.5);
      const clues = [['Topi pehni thi', 'c1'], ['Topi laal nahi', 'c2'], ['Haath mein thaila', 'c3']], sg = stage[id];
      clues.forEach(([s, k], i) => { if (sg > i) tag(c, 360, 330 + i * 78, (i + 1) + '. ' + s, [P.violet, P.pink, P.teal][i], id === k ? pop(u, 0.3) : 1, { size: 34 }); });
      A.forEach(([kind, x, hat, bag, nm], i) => {
        const out = gone(i, id, u), win = (id === 'r1' || id === 'r2') && kind === 'bear';
        c.save(); c.globalAlpha = out ? 0.28 : 1;
        if (win) glow(c, x, 840, 220, P.yellow, 0.5);
        critter(c, kind, x, 960, 0.56, t, { mood: win ? 'sly' : id === 'think' ? 'think' : 'ok', seed: i, hat: hat ? F.kit.hatOn(hat) : null, hold: bag ? (q) => { rr(q, 44, -90, 54, 60, 10, '#8a4b24'); line(q, [[56, -90], [56, -112], [86, -112], [86, -90]], 6, '#5b3416'); } : null });
        c.restore(); tag(c, x, 1010, nm, out ? '#555' : win ? P.pink : P.ink, 1, { size: 24 });
        if (out) { line(c, [[x - 40, 800], [x + 40, 880]], 10, P.pink); line(c, [[x + 40, 800], [x - 40, 880]], 10, P.pink); }
      });
    },
  });
})();
