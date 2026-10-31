// Lazy-caterer: 3 straight cuts give at most 1+1+2+3 = 7 pieces, and only if each new cut crosses all the old ones at new points.
(function () {
  const F = window.FLAT, { P, SET, stat, tag, critter, circ, oval, line } = F, { pop, txt } = F.kit, TAU = Math.PI * 2, CX = 360, CY = 730, R = 210;
  const LN = (deg, d) => { const a = (deg * Math.PI) / 180; return { nx: Math.cos(a), ny: Math.sin(a), d }; };
  const TRI = [LN(90, 55), LN(210, 55), LN(330, 55)], PAR = [LN(0, -105), LN(0, 0), LN(0, 105)];
  const COLS = ['#f2c27b', '#e8a85a', '#f6d79a', '#d98f4c', '#f4b86a', '#e3bd84', '#d8a064', '#f6cf8c'];
  function roti(c, lines, prog, nums) {
    circ(c, CX, CY + 14, R + 10, 'rgba(10,6,40,.2)'); const done = lines.filter((_, i) => prog[i] >= 1), acc = {};
    c.save(); c.beginPath(); c.arc(CX, CY, R, 0, TAU); c.clip();
    for (let y = CY - R; y < CY + R; y += 7) for (let x = CX - R; x < CX + R; x += 7) {
      let m = 0; done.forEach((l, i) => { if ((x + 3.5 - CX) * l.nx + (y + 3.5 - CY) * l.ny > l.d) m |= 1 << i; });
      c.fillStyle = COLS[m]; c.fillRect(x, y, 7.5, 7.5); const a = acc[m] || (acc[m] = [0, 0, 0]); if ((x - CX) ** 2 + (y - CY) ** 2 < (R - 30) ** 2) { a[0] += x; a[1] += y; a[2]++; }
    }
    const rr = H.rng(4); for (let i = 0; i < 26; i++) { const a = rr() * TAU, d = Math.sqrt(rr()) * (R - 20); circ(c, CX + Math.cos(a) * d, CY + Math.sin(a) * d, 6 + rr() * 6, 'rgba(120,60,20,.28)'); }
    lines.forEach((l, i) => { const k = prog[i]; if (k <= 0) return; const tx = -l.ny, ty = l.nx, bx = CX + l.nx * l.d, by = CY + l.ny * l.d, s = (-1 + 2 * k) * (R + 20); line(c, [[bx - tx * (R + 20), by - ty * (R + 20)], [bx + tx * s, by + ty * s]], 9, '#4a2a14'); });
    c.restore();
    if (nums) { let n = 1; for (const m in acc) { const a = acc[m]; if (!a[2]) continue; const k = pop(nums, 0.12 * n); txt(c, String(n), a[0] / a[2], a[1] / a[2], 56 * k, P.ink); n++; } }
  }
  const knife = (c, x, y, k) => { if (k <= 0) return; c.save(); c.translate(x, y); c.rotate(-0.7); F.rr(c, -10, -150, 30, 110, 4, '#d6dbe8'); F.rr(c, -12, -44, 34, 70, 10, '#5a3d2b'); c.restore(); };
  F.runRiddle('r', {
    ids: ['hook', 'think', 'r1', 'r2', 'r3', 'cta'],
    min: { hook: 6, r1: 4.5, r2: 12, r3: 4.5 },
    think: ['*Max kitne tukde?*', 'Comment karo'],
    cta: ['Kitne socha tha?', 'Comment karo'],
    caps: { hook: ['*1 roti.* Sirf *3 seedhe* cut.', 56], r1: ['Saath-saath cut: sirf *4.*', 56], r2: ['Har cut *sabko* kaate!', 56], r3: ['Kul *7 tukde!*', 66] },
    scene(c, t, id, u, d) {
      SET.warm(c, t);
      if (id === 'hook' || id === 'think') roti(c, TRI, [0, 0, 0]);
      if (id === 'r1') { const p = [pop(u, 0.4, 0.5), pop(u, 1.0, 0.5), pop(u, 1.6, 0.5)]; roti(c, PAR, p, u > 2.6 ? u - 2.6 : 0); stat(c, 360, 400, String(1 + p.filter((x) => x >= 1).length), 'tukde', 1, { size: 80, bg: '#8a2b3d' }); }
      if (id === 'r2') { const p = [pop(u, 0.5, 1), pop(u, 3.8, 1), pop(u, 8, 1)], n = [1, 2, 4, 7][p.filter((x) => x >= 1).length]; roti(c, TRI, p); stat(c, 360, 400, String(n), 'tukde', 1, { size: 80, bg: P.navy }); if (p[1] >= 1 && p[2] < 1) tag(c, 360, 1010, 'Naye jagah par kaato!', P.pink, pop(u, 6), { size: 30 }); }
      if (id === 'r3') { roti(c, TRI, [1, 1, 1], u - 0.2); stat(c, 360, 400, '7', 'tukde', 1, { size: 80, bg: '#0f6b58' }); }
      critter(c, 'bear', 120, 1170, 0.5, t, { mood: id === 'r3' ? 'happy' : 'think', seed: 2 });
    },
  });
})();
