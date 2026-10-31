// A week of riddles, one definition each. window.RID picks which reel this page builds. Lines live in riddles/batch2_lines.json.
(function () {
  const F = window.FLAT, { P, SET, cam, tag, caption, say, critter, crown, bubble, parrot, stat, rr, oval, circ, poly, line, curve, glow, socho, followCard, confetti, tree, bush, croc, hut, cloud, torch, flask, night, shade } = F;
  const clamp = H.clamp, E = H.ease, TAU = Math.PI * 2, pop = (u, at, d = 0.3) => clamp((u - at) / d);
  const txt = (c, s, x, y, size, col = P.ink, w = 900) => { c.fillStyle = col; c.font = `${w} ${size}px ${F.FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); };
  const mango = (c, x, y, s = 1) => { oval(c, x, y, 34 * s, 26 * s, P.amber, -0.4); oval(c, x - 9 * s, y - 7 * s, 11 * s, 6 * s, '#ffe08a', -0.4); line(c, [[x + 24 * s, y - 16 * s], [x + 32 * s, y - 26 * s]], 4 * s, '#2d7a3e'); };
  const banana = (c, x, y, s = 1) => { c.strokeStyle = '#ffd93b'; c.lineWidth = 20 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 32 * s, y - 16 * s); c.quadraticCurveTo(x, y + 26 * s, x + 34 * s, y - 18 * s); c.stroke(); circ(c, x + 34 * s, y - 18 * s, 5 * s, '#6d4c1f'); };
  const coconut = (c, x, y, s = 1) => { circ(c, x, y, 48 * s, '#6d4322'); oval(c, x - 13 * s, y - 15 * s, 20 * s, 12 * s, '#8b5a30', -0.5); for (const [a, b] of [[-13, 7], [9, 5], [-2, 21]]) circ(c, x + a * s, y + b * s, 6 * s, '#3a2412'); };
  const laddoo = (c, x, y, r, col = '#f7a93c') => { circ(c, x, y, r, col); oval(c, x - r * 0.3, y - r * 0.35, r * 0.34, r * 0.22, 'rgba(255,255,255,.45)'); const n = H.rng(x | 0); for (let i = 0; i < 8; i++) { const a = n() * TAU, d = n() * r * 0.8; circ(c, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.06, shade(col, 0.75)); } };
  const honey = (c, x, y, s = 1) => { c.save(); c.translate(x, y); c.scale(s, s); glow(c, 0, 0, 110, P.amber, 0.4); rr(c, -42, -44, 84, 88, 18, '#f0a21d'); rr(c, -46, -60, 92, 22, 8, '#e4dfff'); rr(c, -26, -16, 52, 34, 5, P.paper); txt(c, 'SHAHAD', 0, 1, 11); c.restore(); };
  const frog = (c, x, y, s, t, happy) => { c.save(); c.translate(x, y); c.scale(s, s); oval(c, 0, -30, 60, 38, '#56b84f'); oval(c, 0, -20, 36, 24, '#bfe897'); for (const sd of [-1, 1]) { circ(c, sd * 28, -68, 20, '#56b84f'); circ(c, sd * 28, -70, 14, P.white); circ(c, sd * 28, -68, 7, P.ink); oval(c, sd * 54, -6, 25, 10, '#3f9c3f'); } if (happy) { c.fillStyle = '#5a1730'; c.beginPath(); c.arc(0, -36, 19, 0, Math.PI); c.fill(); } else curve(c, [-22, -38], [0, -24], [22, -38], 5, '#2d6a2f'); c.restore(); };
  const hatOn = (col, label) => (q) => { poly(q, [[-72, -44], [72, -44], [50, -56], [-50, -56]], shade(col, 0.8)); q.fillStyle = col; q.beginPath(); q.moveTo(-52, -50); q.quadraticCurveTo(-48, -128, 0, -128); q.quadraticCurveTo(48, -128, 52, -50); q.fill(); if (label) txt(q, label, 0, -88, 42, P.white); };
  const POLAR = { b: '#f6f8ff', d: '#d3dcf2', m: '#ffffff', nose: '#39394d' }, SHADOW = { b: '#606480', d: '#4a4d68', m: '#7b7f9c' };
  const bows = (col) => (q) => { poly(q, [[0, -72], [-44, -96], [-44, -48]], col); poly(q, [[0, -72], [44, -96], [44, -48]], col); circ(q, 0, -72, 11, shade(col, 0.8)); };

  function table(c) { rr(c, 30, 800, 660, 26, 7, '#8a4b24'); rr(c, 76, 826, 26, 190, 4, '#6d3a1b'); rr(c, 618, 826, 26, 190, 4, '#6d3a1b'); }
  function box(c, x, label, col, inside, lid) { rr(c, x - 94, 620, 188, 180, 8, '#c98a45'); rr(c, x - 94, 620, 188, 24, 4, '#a96f30'); if (inside) inside(c, x, 662); rr(c, x - 82, 690, 164, 66, 10, col); txt(c, label, x, 724, 37, P.white); }
  function justice(c, t, o = {}) {
    SET.jungle(c, t); oval(c, 360, 742, 180, 23, 'rgba(10,6,40,.2)'); rr(c, 245, 610, 230, 134, 16, '#8a8ba7'); rr(c, 225, 716, 270, 32, 10, '#6e7090'); rr(c, 270, 500, 180, 130, [50, 50, 8, 8], '#a1a3bf');
    critter(c, 'lion', 360, 722, 0.9, t, { noShadow: true, mood: o.king || 'think', talk: o.kingTalk, hat: (q) => crown(q, 0, -116, 1) });
    critter(c, 'elephant', 72, 825, 0.72, t, { mood: 'think', seed: 5, flip: true }); critter(c, 'elephant', 650, 825, 0.72, t, { mood: 'think', seed: 6 }); parrot(c, 628, 408, 0.92, t, 1); parrot(c, 92, 454, 0.75, t, 4);
    const m = o.moods || {}; critter(c, 'rabbit', 130, 1010, 0.86, t, Object.assign({ seed: 1 }, m.rabbit)); critter(c, 'bear', 360, 1010, 0.86, t, Object.assign({ seed: 2 }, m.bear)); critter(c, 'monkey', 590, 1010, 0.86, t, Object.assign({ seed: 3 }, m.monkey));
  }
  // switches hallway and the bulb room
  function panel(c, x, y, st, hi = -1) { rr(c, x - 154, y - 96, 300, 180, 18, P.paper); [0, 1, 2].forEach((i) => { const sx = x - 94 + i * 90, on = st[i]; if (hi === i) rr(c, sx - 38, y - 88, 76, 164, 14, H.rgba(P.yellow, 0.55)); rr(c, sx - 26, y - 62, 52, 96, 10, '#cfc6dd'); rr(c, sx - 18, on ? y - 56 : y - 16, 36, 44, 7, on ? P.teal : P.pink); txt(c, i + 1, sx, y + 58, 26); }); }
  function bulb(c, x, y, s, st, t) { line(c, [[x, -300], [x, y - 70 * s]], 6, P.ink); if (st === 'on') { glow(c, x, y, 520, P.yellow, 0.75); F.beam(c, x, y + 40, 60, 300, 720, P.yellow, 0.22); } if (st === 'warm') glow(c, x, y, 220 + Math.sin(t * 4) * 12, P.orange, 0.65); const col = st === 'on' ? P.yellow : st === 'warm' ? '#ffc29a' : '#c8d6ee'; c.save(); c.translate(x, y); c.scale(s, s); rr(c, -26, -94, 52, 44, 7, '#8b86a8'); circ(c, 0, 0, 66, col); poly(c, [[-40, -52], [40, -52], [28, -68], [-28, -68]], col); line(c, [[-16, -50], [-20, 2], [0, -18], [20, 2], [16, -50]], 5, st === 'on' ? P.orange : '#6f6a92'); oval(c, -26, -18, 10, 20, 'rgba(255,255,255,.6)', 0.3); c.restore(); }

  const defs = {
    // WRONG LABELS
    d: { ids: ['hook', 'q', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, q: 4.5, r1: 4, r2: 7 }, think: ['*Kaunsa dibba?*', 'Comment karo'], cta: ['Solve hua?', 'Comment karo'],
      caps: { hook: ['*3 dibbe.* Teeno par *galat* label!'], q: ['Sirf *ek phal* dekh sakte ho.'], r1: ['*Mix* wale se!', 62], r2: ['Maan lo *aam* nikla...'] },
      scene(c, t, id, u, d) {
        SET.warm(c, t); const fix = id === 'r2' ? u / d('r2') : 0; table(c);
        const L = fix > 0.8 ? ['KELA', 'MIX', 'AAM'] : fix > 0.5 ? ['AAM', 'MIX', 'AAM'] : fix > 0.2 ? ['AAM', 'KELA', 'AAM'] : ['AAM', 'KELA', 'MIX'], show = (id === 'r1' && u > 1) || id === 'r2';
        box(c, 130, L[0], P.orange); box(c, 360, L[1], P.teal); box(c, 590, L[2], id === 'r1' ? P.pink : '#8245c9', show ? (q, x, y) => { mango(q, x - 40, y + 3); mango(q, x + 38, y); mango(q, x, y - 12); } : null);
        if (fix > 0.8) for (const [a, b] of [[-46, 2], [0, -14], [44, 4]]) banana(c, 130 + a, 662 + b, 0.85); if (fix > 0.5) { mango(c, 334, 660); banana(c, 386, 660, 0.85); }
        if (id === 'q' || id === 'hook' || id === 'think') { const k = Math.sin(t * 3) * 7; txt(c, '?', 130, 575 + k, 70, P.white); txt(c, '?', 360, 575 - k, 70, P.white); txt(c, '?', 590, 575 + k, 70, P.white); }
        critter(c, 'monkey', 360, 1070, 0.82, t, { mood: show ? 'happy' : 'think', look: [id === 'r1' ? 1 : 0, -1], arms: show ? 'up' : null });
      } },
    // HEAVY LADDOO
    e: { ids: ['hook', 'think', 'r1', 'r2', 'r3', 'cta'], min: { hook: 5, r1: 3.5, r2: 5, r3: 6 }, think: ['*2 baar mein?*', 'Comment karo'], cta: ['Kaise socha?', 'Comment karo'],
      caps: { hook: ['*8 laddoo.* Ek *nakli!* Taraazu sirf *2 baar!*', 48], r1: ['*3 vs 3.* 2 bahar.'], r2: ['Barabar? Bahar wale *2* tolo.', 46], r3: ['Jhuka? Bhaari 3 mein se *2* tolo.', 44] },
      scene(c, t, id, u, d) {
        SET.warm(c, t); let tilt = 0, L = 0, Rr = 0, out = 8;
        if (id === 'r1') { L = Rr = 3; out = 2; tilt = 0; }
        if (id === 'r2') { L = Rr = 1; out = 0; tilt = H.smooth(1.8, 2.6, u) * 0.22; }
        if (id === 'r3') { L = Rr = 3; out = 0; tilt = 0.22 * (1 - H.smooth(2.6, 3.2, u)); if (u > 3.2) { L = Rr = 1; out = 1; } }
        const cx = 360, cy = 490, arm = 210, y1 = cy + Math.sin(tilt) * arm + 170, y2 = cy - Math.sin(tilt) * arm + 170, xl = cx - Math.cos(tilt) * arm, xr = cx + Math.cos(tilt) * arm;
        rr(c, cx - 14, cy, 28, 390, 7, '#8a4b24'); rr(c, cx - 110, 880, 220, 26, 8, '#6d3a1b'); line(c, [[xl, cy + Math.sin(tilt) * arm], [xr, cy - Math.sin(tilt) * arm]], 15, P.amber); circ(c, cx, cy, 20, P.amber);
        for (const [x, y, n, base] of [[xl, y1, L, 0], [xr, y2, Rr, 1]]) { line(c, [[x - 64, y], [x, y - 170]], 3, P.paper); line(c, [[x + 64, y], [x, y - 170]], 3, P.paper); const P0 = [[0, -18], [-30, -18], [30, -18]]; for (let i = 0; i < n; i++) laddoo(c, x + P0[i][0], y + P0[i][1] - (i ? 0 : 0), 24, id === 'r2' && base === 0 ? '#ef7f2c' : '#f7a93c'); rr(c, x - 86, y, 172, 13, 6, '#c8c0d8'); }
        const r = H.rng(2); for (let i = 0; i < out; i++) { const q = Math.min(1, u / 0.1); laddoo(c, id === 'hook' || id === 'think' ? 130 + (i % 4) * 150 : 280 + i * 80, id === 'hook' || id === 'think' ? 960 + Math.floor(i / 4) * 62 : 960, 28, i === 5 && id === 'hook' ? '#f7a93c' : '#f7a93c'); r(); }
        critter(c, 'bear', 118, 1160, 0.5, t, { mood: id === 'hook' ? 'shock' : 'think', look: [1, -1] }); critter(c, 'fox', 602, 1160, 0.5, t, { mood: 'sly', look: [-1, -1], flip: true });
      } },
    // WATER JUGS
    f: { ids: ['hook', 'think', 'r1', 'r2', 'r3', 'cta'], min: { hook: 5, r1: 4, r2: 3.5, r3: 6 }, think: ['*4 litre kaise?*', 'Comment karo'], cta: ['Aapka tareeka?', 'Comment karo'],
      caps: { hook: ['Chahiye *4 litre.* Baaltiyan *3* aur *5!*'], r1: ['5 bharo, 3 mein dalo.'], r2: ['3 khaali. *2* usme dalo.'], r3: ['5 phir bharo. Bacha *4!*', 58] },
      scene(c, t, id, u, d) {
        SET.lab(c, t); let a = 0, b = 0;
        if (id === 'r1') { const f = H.smooth(0.2, 1.5, u), g = H.smooth(1.8, 3.2, u); a = 5 * f - 3 * g; b = 3 * g; }
        if (id === 'r2') { const f = H.smooth(0.2, 1, u), g = H.smooth(1.3, 2.6, u); a = 2 - 2 * g; b = 3 * (1 - f) + 2 * g; }
        if (id === 'r3') { const f = H.smooth(0.2, 1.5, u), g = H.smooth(1.8, 3.2, u); a = 5 * f - g; b = 2 + g; }
        const jug = (x, cap, v, col) => { const h = cap * 74, y = 1000, w = 180; rr(c, x - w / 2, y - h, w, h, [6, 6, 24, 24], 'rgba(255,255,255,.5)'); c.save(); c.beginPath(); c.roundRect(x - w / 2, y - h, w, h, [6, 6, 24, 24]); c.clip(); const lv = (v / cap) * h, g = F.vgrad(c, y - lv, y, P.sky, P.blue); c.fillStyle = g; c.beginPath(); c.moveTo(x - w / 2, y); c.lineTo(x - w / 2, y - lv); for (let q = 0; q <= 8; q++) c.lineTo(x - w / 2 + (q / 8) * w, y - lv + Math.sin(t * 4 + q) * 4); c.lineTo(x + w / 2, y); c.fill(); for (let q = 1; q < cap; q++) line(c, [[x - w / 2, y - q * 74], [x - w / 2 + 28, y - q * 74]], 4, 'rgba(22,13,63,.55)'); c.restore(); c.strokeStyle = col; c.lineWidth = 8; c.beginPath(); c.roundRect(x - w / 2, y - h, w, h, [6, 6, 24, 24]); c.stroke(); tag(c, x, y - h - 42, `${cap} L`, col, 1, { size: 36 }); if (v > 0.05) stat(c, x, y - 40, `${Math.round(v * 10) / 10 === Math.round(v) ? Math.round(v) : v.toFixed(1)}`, 'L', 1, { size: 46 }); };
        jug(170, 3, b, P.teal); jug(510, 5, a, P.pink);
        if (id === 'r3' && u > 3.2) { glow(c, 510, 800, 200, P.yellow, 0.4); }
        critter(c, 'elephant', 340, 1190, 0.56, t, { mood: id === 'r3' && u > 3.2 ? 'happy' : 'think', look: [0, -1] });
      } },
    // TWO PARROTS
    g: { ids: ['hook', 'rule', 'think', 'r1', 'r2', 'r3', 'cta'], min: { hook: 3.5, rule: 7, r1: 4.5, r2: 7, r3: 3.5 }, think: ['*Kya poochoge?*', 'Comment karo'], cta: ['Aap kya poochte?', 'Comment karo'],
      caps: { hook: ['*2 raaste.* Ek ghar. Ek *magarmach!*', 50], rule: ['Ek *sach,* ek *jhooth.* Sawaal sirf *1!*', 48], r1: ['Poocho: *doosra* kya batayega?', 48], r2: ['Dono *galat* raasta batayenge!', 48], r3: ['Toh *ulta* raasta lo!', 62] },
      scene(c, t, id, u, d) {
        SET.jungle(c, t); poly(c, [[300, 1280], [420, 1280], [390, 820], [330, 820]], '#d9b77d'); poly(c, [[340, 830], [380, 830], [150, 560], [100, 590]], '#d9b77d'); poly(c, [[340, 830], [380, 830], [620, 590], [570, 560]], '#d9b77d');
        hut(c, 120, 590, 1.1); oval(c, 600, 600, 140, 40, '#2c8bbd'); croc(c, 600, 590, 0.85, t);
        if (id === 'r3') { tag(c, 120, 420, 'GHAR', P.teal, pop(u, 0.2), { size: 40 }); }
        const talk = id === 'r1' || id === 'r2'; c.save(); for (const [x, sd] of [[150, 0], [570, 3]]) { rr(c, x - 42, 860, 84, 16, 5, '#7a4b2b'); rr(c, x - 7, 876, 14, 170, 4, '#7a4b2b'); parrot(c, x, 780, 1.7, t, sd); } c.restore();
        if (id === 'rule') { tag(c, 150, 1080, 'Sach?', P.teal, pop(u, 1.2), { size: 34 }); tag(c, 570, 1080, 'Jhooth?', '#c9264f', pop(u, 2.2), { size: 34 }); }
        if (id === 'r2') { bubble(c, 190, 560, 'Ye raasta!', 150, 690, pop(u, 0.5), { size: 30 }); bubble(c, 530, 560, 'Ye raasta!', 570, 690, pop(u, 3), { size: 30 }); }
        critter(c, 'monkey', 360, 1100, 0.72, t, { mood: id === 'r3' ? 'happy' : 'think', talk, look: [0, -1], arms: id === 'r3' ? 'up' : null });
      } },
    // HATS
    h: { ids: ['hook', 'rule', 'say', 'think', 'r1', 'r2', 'r3', 'cta'], min: { hook: 5, rule: 4, say: 7, r1: 6, r2: 6, r3: 3 }, think: ['*Kaunsa rang?*', 'Comment karo'], cta: ['Yahan tak pahunche?', 'Comment karo'],
      caps: { hook: ['Peeche wala *aage* dekh sakta hai.', 48], rule: ['*3 laal.* *2 neeli.*', 62], say: ['Teeno ne *kya* bola?'], r1: ['Aage *2 neeli* hoti toh wo jaan jaata.', 42], r2: ['Sabse aage *neeli* hoti toh beech wala jaan jaata.', 40], r3: ['Topi: *LAAL!*', 76, P.rose] },
      scene(c, t, id, u, d) {
        SET.river(c, t); c.fillStyle = 'rgba(36,26,107,.25)'; c.fillRect(-100, -100, 920, 1500); const R = '#e23a4a', show = ['r3', 'cta'].includes(id), mx = id === 'say';
        if (id === 'rule') { const X = [90, 225, 360, 495, 630]; X.forEach((x, i) => { c.save(); c.translate(x, 500 + Math.sin(t * 2 + i) * 6); c.scale(1.05 * E.back(pop(u, 0.2 + i * 0.3)), 1.05 * E.back(pop(u, 0.2 + i * 0.3))); hatOn(i < 3 ? R : P.blue)(c); c.restore(); }); }
        const A = [['bear', 120, id === 'say' ? 'think' : 'ok', R, 0], ['fox', 345, 'think', R, 1], ['rabbit', 580, id === 'r3' ? 'happy' : 'ok', show ? R : '#7a7a90', 2]];
        A.forEach(([k, x, m, hc, i]) => { const talkOn = mx && u > (d('say') * i) / 3 && u < (d('say') * (i + 1)) / 3; const known = i === 2 ? show : true; critter(c, k, x, 1030, 0.95, t, { mood: m, look: [1, 0], talk: talkOn, seed: i, hat: (q) => { hatOn(hc, known ? null : '?')(q); } }); });
        if (id === 'say') { const n = d('say') / 3; if (u < n) bubble(c, 150, 620, 'Mujhe nahi pata', 120, 710, pop(u, 0.15), { size: 28 }); else if (u < n * 2) bubble(c, 345, 620, 'Mujhe bhi nahi', 345, 710, pop(u, n), { size: 28 }); else bubble(c, 540, 620, 'Mujhe pata hai!', 580, 710, pop(u, n * 2), { size: 28, bg: P.yellow }); }
        if (id === 'r1') { line(c, [[120, 780], [345, 700]], 4, P.yellow); line(c, [[120, 780], [580, 700]], 4, P.yellow); tag(c, 360, 1135, 'Dono neeli nahi', P.teal, pop(u, d('r1') - 2), { size: 36 }); }
        if (id === 'r2') { line(c, [[345, 780], [580, 700]], 4, P.yellow); tag(c, 360, 1135, 'Sabse aage neeli nahi', P.teal, pop(u, d('r2') - 2), { size: 36 }); }
        if (id === 'r3') confetti(c, t, u);
      } },
    // WHITE BEAR
    i: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, r1: 4, r2: 4 }, think: ['*Kaunsa rang?*', 'Comment karo'], cta: ['Rang sahi tha?', 'Comment karo'],
      caps: { hook: ['Dakshin. Purab. Uttar. Aur *wapas ghar!*', 50], r1: ['*Safed!* Uttari Dhruv!', 60], r2: ['*Polar Bear!*', 74] },
      scene(c, t, id, u, d) {
        const reveal = id === 'r1' || id === 'r2'; c.fillStyle = F.vgrad(c, -200, 1100, '#163a7c', '#7fc9ef'); c.fillRect(-500, -500, 1720, 2300); for (let q = 0; q < 50; q++) { const r = H.rng(q + 3); circ(c, r() * 720, r() * 700, 1.5, H.rgba(P.white, 0.3 + 0.5 * Math.abs(Math.sin(t + q)))); }
        const gx = 360, gy = 600, gr = 300; circ(c, gx, gy, gr, '#d7ecf8'); c.save(); c.beginPath(); c.arc(gx, gy, gr, 0, TAU); c.clip(); for (let q = 1; q < 6; q++) { c.strokeStyle = 'rgba(70,120,190,.24)'; c.lineWidth = 3; c.beginPath(); c.ellipse(gx, gy - gr * 0.1, gr * q * 0.2, gr * q * 0.13, 0, 0, TAU); c.stroke(); } for (let q = 0; q < 8; q++) { const a = (q / 8) * TAU; line(c, [[gx, gy - gr * 0.1], [gx + Math.cos(a) * gr, gy - gr * 0.1 + Math.sin(a) * gr * 0.65]], 3, 'rgba(70,120,190,.24)'); } oval(c, gx + 150, gy + 280, 130, 60, '#87bde0'); c.restore();
        const N = [gx, gy - 30], Sx = gx - 90, Sy = gy + 170, Ex = gx + 90, Ey = gy + 170; const k = id === 'hook' ? clamp(u / (d('hook') - 0.5)) : 1;
        const path = (q) => { if (q < 1 / 3) return [H.lerp(N[0], Sx, q * 3), H.lerp(N[1], Sy, q * 3)]; if (q < 2 / 3) return [H.lerp(Sx, Ex, q * 3 - 1), Sy + Math.sin((q * 3 - 1) * Math.PI) * 16]; return [H.lerp(Ex, N[0], q * 3 - 2), H.lerp(Ey, N[1], q * 3 - 2)]; };
        c.strokeStyle = P.pink; c.lineWidth = 8; c.setLineDash([17, 12]); c.lineCap = 'round'; c.beginPath(); for (let q = 0; q <= 60 * k; q++) { const p = path(q / 60); q ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); c.setLineDash([]);
        const p = path(k); hut(c, N[0], N[1] + 10, 0.65); if (reveal) { tag(c, gx, gy - 260, 'North Pole', P.blue, pop(u, 0.3), { size: 36 }); }
        const big = reveal || id === 'think'; if (big) critter(c, 'bear', 360, 1120, 0.95, t, { mood: reveal ? 'happy' : 'think', colors: reveal ? POLAR : SHADOW, hat: reveal ? null : (q) => txt(q, '?', 0, 0, 80, P.white) }); else critter(c, 'bear', p[0], p[1] + 16, 0.4, t, { noShadow: true, colors: SHADOW, flip: k > 2 / 3 });
        if (id === 'hook') { const m = ['1 km Dakshin', '1 km Purab', '1 km Uttar']; const q = Math.min(2, Math.floor(k * 3)); tag(c, 360, 1080, m[q], P.pink, 1, { size: 42 }); }
      } },
    // BURNING ROPES
    j: { ids: ['hook', 'think', 'r1', 'r2', 'r3', 'cta'], min: { hook: 7, r1: 4.5, r2: 5, r3: 4 }, think: ['*45 minute?*', 'Comment karo'], cta: ['Kisne socha tha?', 'Comment karo'],
      caps: { hook: ['Har rassi *1 ghanta.* Chahiye *45 minute!*', 48], r1: ['Pehli: *dono* sire. Doosri: *ek.*', 48], r2: ['*30 min!* Doosri ka doosra sira bhi!', 44], r3: ['*15 aur.* Kul *45!*', 62] },
      scene(c, t, id, u, d) {
        SET.warm(c, t); c.fillStyle = 'rgba(40,14,10,.35)'; c.fillRect(-100, -100, 920, 1500);
        let a0 = 0, a1 = 1, b0 = 0, b1 = 1, flA = [0, 0], flB = [0, 0], mins = 0;
        if (id === 'r1') { const k = H.smooth(0.8, d('r1'), u) * 0.33; a0 = k; a1 = 1 - k; b0 = k * 0.6; flA = [1, 1]; flB = [1, 0]; mins = Math.round(k * 45); }
        if (id === 'r2') { const k = 0.33 + H.smooth(0, 1.4, u) * 0.17; a0 = k; a1 = 1 - k; b0 = 0.2 + H.smooth(0, 1.4, u) * 0.3; flA = u > 1.4 ? [0, 0] : [1, 1]; flB = [1, u > 1.6 ? 1 : 0]; mins = Math.round(15 + H.smooth(0, 1.4, u) * 15); if (u > 1.4) { a0 = a1 = 0.5; } }
        if (id === 'r3') { const k = H.smooth(0, d('r3') - 0.8, u); a0 = a1 = 0.5; b0 = 0.5 * 1 * k * 0.5 + 0.5 - 0.25 * 0 ; b0 = H.lerp(0.5, 0.75, k); b1 = H.lerp(1, 0.75, k); flB = k < 1 ? [1, 1] : [0, 0]; mins = Math.round(30 + 15 * k); }
        const X0 = 70, X1 = 650, rope = (y, s, e, f) => { if (s > 0) line(c, [[X0, y], [H.lerp(X0, X1, s), y]], 7, '#3a2418'); if (e < 1) line(c, [[H.lerp(X0, X1, e), y], [X1, y]], 7, '#3a2418'); if (e > s) { c.lineCap = 'round'; for (const [w, col] of [[22, '#c98a45'], [8, '#e8b878']]) line(c, [[H.lerp(X0, X1, s), y], [H.lerp(X0, X1, e), y]], w, col); } if (f[0] && e > s) F.flames(c, H.lerp(X0, X1, s), y + 10, 54, 76, t); if (f[1] && e > s) F.flames(c, H.lerp(X0, X1, e), y + 10, 54, 76, t + 2); };
        tag(c, 104, 505, 'Rassi 1', P.orange, 1, { size: 30 }); rope(590, a0, a1, flA); tag(c, 104, 715, 'Rassi 2', P.orange, 1, { size: 30 }); rope(800, b0, b1, flB);
        if (id !== 'hook' && id !== 'think') stat(c, 360, 340, String(mins), 'min', 1, { size: 86, bg: id === 'r3' && mins === 45 ? '#0f6b58' : P.pink });
        if (id === 'hook') { const k = pop(u, d('hook') - 2.4); stat(c, 360, 340, '45', 'min?', k, { size: 86, bg: P.pink }); }
        critter(c, 'fox', 360, 1120, 0.72, t, { mood: id === 'r3' ? 'happy' : 'think', look: [0, -1] });
      } },
    // LOTUS DOUBLING
    k: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, r1: 3.6, r2: 4 }, think: ['*Aadha kab?*', 'Din comment karo'], cta: ['Kaunsa din bola?', 'Comment karo'],
      caps: { hook: ['Roz *double!* Din 30: *poora* talaab.', 48], r1: ['15 nahi! *Din 29!*', 62], r2: ['Agle din double, *poora!*', 54] },
      scene(c, t, id, u, d) {
        SET.river(c, t); c.fillStyle = '#3a9a60'; c.fillRect(-100, 400, 920, 1000); const cx = 360, cy = 760, W = 330, Hh = 340; oval(c, cx, cy, W + 20, Hh + 20, '#7d6a3a'); oval(c, cx, cy, W, Hh, '#2596c9'); for (let q = 0; q < 12; q++) oval(c, cx - 200 + (q * 79 + t * 12) % 400, cy - 280 + q * 48, 42, 4, 'rgba(255,255,255,.26)');
        let day = 30, f = 1; if (id === 'hook') { day = 1 + Math.floor(clamp(u / (d('hook') - 1)) * 29); f = Math.pow(2, day - 30); f = Math.max(f, day / 300); } else if (id === 'r1') { day = 29; f = 0.5; } else if (id === 'r2') { const k = H.smooth(0.5, 2, u); day = k > 0.5 ? 30 : 29; f = 0.5 + 0.5 * k; }
        c.save(); c.beginPath(); c.ellipse(cx, cy, W, Hh, 0, 0, TAU); c.clip(); const r = H.rng(9); const pads = []; for (let q = 0; q < 460; q++) pads.push([cx - W + r() * W * 2, cy - Hh + r() * Hh * 2, r()]); pads.sort((a, b) => a[0] - b[0]); pads.forEach((p, q) => { if (q / 460 > f) return; oval(c, p[0], p[1], 34, 25, '#2fae52', p[2] * 3); oval(c, p[0], p[1], 19, 13, '#58cf6f', p[2] * 3); if (q % 3 === 0) { for (let a = 0; a < 6; a++) oval(c, p[0] + Math.cos(a) * 8, p[1] + Math.sin(a) * 8, 8, 5, '#f79bc3', a); circ(c, p[0], p[1], 4.5, P.yellow); } }); c.restore();
        stat(c, 360, 330, `Din ${day}`, '', 1, { size: 72, bg: day === 30 ? '#0f6b58' : P.pink }); frog(c, 620, 1160, 1, t, id === 'r2');
      } },
    // COCONUT AND BANANA
    l: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 6, r1: 5, r2: 5 }, think: ['*Kela kitne ka?*', 'Comment mein rate'], cta: ['Kitna bola tha?', 'Comment karo'],
      caps: { hook: ['Kul *₹110.* Nariyal *₹100* mehenga!', 50], r1: ['*₹10* bola? Kul *₹120.* Galat!', 50], r2: ['Kela *₹5.* Nariyal *₹105.*', 54] },
      scene(c, t, id, u, d) {
        SET.warm(c, t); for (let i = 0; i < 7; i++) rr(c, i * 104, 420, 104, 70, [0, 0, 32, 32], i % 2 ? P.pink : P.paper); rr(c, 0, 400, 720, 30, 0, '#a93c4c'); table(c);
        coconut(c, 210, 690, 1.9); banana(c, 510, 690, 2);
        const a = id === 'r1' ? '₹110' : id === 'r2' ? '₹105' : '?', b = id === 'r1' ? '₹10' : id === 'r2' ? '₹5' : '?';
        const big = pop(u, 0.5); stat(c, 210, 560, a, '', id === 'hook' || id === 'think' ? 1 : big, { size: 56, bg: id === 'r2' ? '#0f6b58' : P.ink }); stat(c, 510, 560, b, '', id === 'hook' || id === 'think' ? 1 : big, { size: 56, bg: id === 'r2' ? '#0f6b58' : P.ink });
        if (id === 'r1') stat(c, 360, 310, '₹120', 'GALAT', pop(u, 2.2), { size: 68, bg: '#c9264f', unitCol: P.white }); if (id === 'r2') stat(c, 360, 310, '₹110', 'SAHI', pop(u, 2), { size: 68, bg: '#0f6b58', unitCol: P.mint }); if (id === 'hook') stat(c, 360, 310, '₹110', 'kul', pop(u, 0.8), { size: 68, bg: P.pink });
        critter(c, 'monkey', 360, 1110, 0.78, t, { mood: id === 'r2' ? 'happy' : id === 'r1' ? 'shock' : 'think', look: [0, -1], arms: id === 'r2' ? 'up' : null });
      } },
    // HUNDRED MONKEYS
    m: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, r1: 3.5, r2: 5 }, think: ['*100 + 100 = ?*', 'Minute comment karo'], cta: ['Phanse ya nahi?', 'Comment karo'],
      caps: { hook: ['5 bandar. 5 kele. *5 minute.*', 54], r1: ['100 nahi! *5 minute!*', 58], r2: ['Har bandar: *1 kela, 5 minute.*', 48] },
      scene(c, t, id, u, d) {
        SET.jungle(c, t); if (id === 'hook' || id === 'r2') { [100, 230, 360, 490, 620].forEach((x, i) => { critter(c, 'monkey', x, 1000, 0.66, t, { mood: 'happy', seed: i, hold: (q) => banana(q, 0, -70, 1) }); }); stat(c, 360, 420, '5', 'min', 1, { size: 90, bg: P.pink }); } else {
          for (let r = 0; r < 10; r++) for (let q = 0; q < 10; q++) { const x = 68 + q * 65, y = 520 + r * 64 + Math.sin(t * 3 + q + r) * 3, h = 25; circ(c, x - 22, y, 9, '#8a5430'); circ(c, x + 22, y, 9, '#8a5430'); circ(c, x, y, h, '#8a5430'); oval(c, x, y + 4, 17, 14, '#f3c9a0'); circ(c, x - 8, y - 5, 4, P.white); circ(c, x + 8, y - 5, 4, P.white); circ(c, x - 8, y - 5, 2, P.ink); circ(c, x + 8, y - 5, 2, P.ink); banana(c, x, y + 28, 0.4); }
          stat(c, 360, 395, id === 'r1' ? '5' : '?', 'min', 1, { size: 86, bg: id === 'r1' ? '#0f6b58' : P.pink });
        }
      } },
    // SOCKS IN THE DARK
    n: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, r1: 2.8, r2: 5 }, think: ['*Kitne moze?*', 'Number comment karo'], cta: ['Kitne bole the?', 'Comment karo'],
      caps: { hook: ['*Andhera!* 10 kaale, 10 safed moze.', 48], r1: ['11 nahi! *Sirf 3!*', 66], r2: ['Teesra *match* karega hi!', 54] },
      scene(c, t, id, u, d) {
        SET.bedroom(c, t, { clock: '2:00' }); rr(c, 150, 640, 420, 320, 12, '#5a45cb'); [720, 840].forEach((y) => { rr(c, 170, y - 52, 380, 104, 8, '#6d59dc'); rr(c, 330, y - 7, 60, 14, 6, P.lilac); }); rr(c, 150, 640, 420, 30, 8, '#7a65e8');
        night(c, t, { tint: '#4d55a8' }); const sock = (x, y, col, k, flip) => { if (k <= 0) return; c.save(); c.translate(x, y); c.scale(k * (flip ? -1 : 1), k); rr(c, -28, -80, 56, 110, 8, col); c.fillStyle = col; c.beginPath(); c.moveTo(-28, 12); c.lineTo(-28, 30); c.quadraticCurveTo(-28, 72, 22, 66); c.quadraticCurveTo(60, 58, 50, 30); c.quadraticCurveTo(44, 12, 28, 12); c.fill(); rr(c, -31, -82, 62, 17, 6, col === P.white ? '#c8c8dc' : '#3a3a50'); c.restore(); };
        const B = '#26263a', W = P.white; if (id === 'r1' || id === 'r2') { const q = id === 'r1' ? [1, 1, 1] : [1, pop(u, 0.5), pop(u, 2.2)]; sock(180, 470, B, q[0]); sock(360, 470, W, q[1]); sock(540, 470, q[2] && u % 1 > 0 ? B : B, q[2], true); if (id === 'r2' && u > 2.8) { tag(c, 360, 610, 'Jodi mil gayi!', P.teal, pop(u, 2.8), { size: 42 }); } } else { const r = H.rng(3); for (let i = 0; i < 20; i++) { const x = 180 + r() * 360, y = 680 + r() * 220; circ(c, x, y, 3, H.rgba(P.white, 0.25)); } txt(c, '?', 360, 480, 110, P.yellow); }
        critter(c, 'monkey', 360, 1140, 0.62, t, { mood: id === 'r2' ? 'happy' : 'think', look: [Math.sin(t * 1.7), -1], noShadow: true });
      } },
    // THE RACE
    o: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, r1: 2.8, r2: 5 }, think: ['*Kaunsa number?*', 'Comment karo'], cta: ['Pehla bola tha?', 'Sach batao, comment karo'],
      caps: { hook: ['Khargosh ne *doosre* wale ko peeche chhoda!', 46], r1: ['Pehla nahi! *Doosra!*', 60], r2: ['*Pehla* abhi bhi aage hai!', 54] },
      scene(c, t, id, u, d) {
        SET.jungle(c, t); const lane = (y, col) => { c.fillStyle = col; c.fillRect(-100, y, 920, 118); for (let q = -2; q < 10; q++) rr(c, ((q * 110 - t * 240) % 880) - 90, y + 54, 58, 8, 3, 'rgba(255,255,255,.55)'); }; lane(760, '#c7825a'); lane(878, '#b97350'); lane(996, '#c7825a');
        const pass = id === 'hook' ? H.smooth(1.5, 3.4, u) : 1; const rx = H.lerp(120, 330, pass), fx = 240, bx = 540, runB = Math.abs(Math.sin(t * 9)) * 15;
        critter(c, 'bear', bx, 862 - runB, 0.62, t, { mood: 'happy', noShadow: true, seed: 1 }); critter(c, 'fox', fx, 980 - runB, 0.62, t, { mood: pass > 0.5 ? 'shock' : 'ok', noShadow: true, seed: 2 }); critter(c, 'rabbit', rx, 1098 - runB, 0.66, t, { mood: 'happy', noShadow: true, seed: 3 });
        stat(c, bx, 650, '1', '', 1, { size: 62, bg: P.amber }); stat(c, fx, 770, pass > 0.5 ? '3' : '2', '', 1, { size: 52, bg: P.violet }); const show = id === 'r1' || id === 'r2'; stat(c, rx, 890, show ? '2' : pass > 0.5 ? '?' : '3', '', 1, { size: 58, bg: show ? '#0f6b58' : P.pink });
      } },
    // FIVE CHILDREN
    p: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 4.5, r1: 2.8, r2: 3.8 }, think: ['*Kul kitne bacche?*', 'Number comment karo'], cta: ['Kitne bole the?', 'Comment karo'],
      caps: { hook: ['*4 betiyan.* Har beti ka *1 bhai.*', 52], r1: ['8 nahi! *Sirf 5!*', 66], r2: ['*Bhai ek hi* hai!', 62] },
      scene(c, t, id, u, d) {
        SET.river(c, t); critter(c, 'elephant', 360, 505, 0.82, t, { mood: id === 'r1' || id === 'r2' ? 'happy' : 'ok', hat: bows('#d5338a') });
        const X = [90, 240, 480, 630]; X.forEach((x, i) => { const k = id === 'hook' ? E.back(pop(u, 0.4 + i * 0.4)) : 1; if (k > 0) critter(c, 'elephant', x, 1000, 0.62 * k, t, { mood: 'happy', seed: i, hat: bows(P.pink) }); });
        const sh = id === 'r1' || id === 'r2' || id === 'cta'; if (sh) { const k = E.back(pop(u, id === 'r1' ? 0.2 : 0)); critter(c, 'elephant', 360, 1120, 0.72 * k, t, { mood: 'happy', hop: true, hat: (q) => hatOn(P.blue)(q) }); stat(c, 360, 690, '5', 'bacche', k, { size: 86, bg: '#0f6b58' }); } else txt(c, '?', 360, 1000, 120, P.white);
        if (id === 'r2') X.forEach((x, i) => { const q = pop(u, 0.2 + i * 0.35); if (q > 0) line(c, [[x, 900], [H.lerp(x, 360, q), H.lerp(900, 1000, q)]], 6, P.yellow); });
      } },
    // FROG IN THE WELL
    q: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 6.5, r1: 2.8, r2: 7 }, think: ['*Kitne din?*', 'Number comment karo'], cta: ['Aapka jawab?', 'Comment karo'],
      caps: { hook: ['*Din:* 3 upar. *Raat:* 2 neeche.', 54], r1: ['30 nahi! *28 din!*', 66], r2: ['Din 28: *bahar!*', 62] },
      scene(c, t, id, u, d) {
        const nighty = id === 'hook' && Math.sin(u * 2.6) < 0; c.fillStyle = F.vgrad(c, 0, 420, nighty ? '#1d1a6a' : '#6bc7ee', nighty ? '#3c2b8e' : '#c7ecf7'); c.fillRect(-100, -100, 920, 720); c.fillStyle = nighty ? '#2c6b48' : '#47ae4e'; c.fillRect(-100, 420, 920, 900); const top = 420, bot = 1160, W0 = 180, W1 = 540;
        rr(c, W0 - 34, top - 16, W1 - W0 + 68, 42, 10, '#9d9db0'); c.fillStyle = '#4d4d68'; c.fillRect(W0, top, W1 - W0, bot - top); for (let i = 0, y = top; y < bot; y += 44, i++) for (let x = W0 + (i % 2) * 30; x < W1; x += 60) rr(c, x, y, 54, 38, 3, '#5b5b7a'); c.fillStyle = '#1f6ca0'; c.fillRect(W0, bot - 28, W1 - W0, 30);
        for (let q = 0; q <= 30; q += 5) { const y = bot - 30 - (q / 30) * (bot - top - 60); rr(c, W0 - 6, y - 2, 18, 4, 2, P.white); txt(c, `${q}`, W0 - 54, y, 24, P.white); }
        let ft = 0, day = 1; if (id === 'hook') { const k = u * 1.1; day = 1 + Math.floor(k); ft = Math.floor(k) + Math.max(0, Math.sin((k % 1) * Math.PI)) * 3; } else if (id === 'think') { ft = 3; day = 4; } else if (id === 'r1') { ft = 10; day = 28; } else { const a = H.smooth(0, 2.4, u), b = H.smooth(3, 4.8, u); ft = 27 * a + 3 * b; day = b > 0 ? 28 : Math.max(1, Math.round(27 * a)); }
        const fy = bot - 30 - (ft / 30) * (bot - top - 60); frog(c, 360, ft >= 30 ? top - 16 : fy + 2, 1, t, ft >= 30); if (ft >= 30) confetti(c, t, u); stat(c, 360, 300, `Din ${day}`, `${Math.round(ft)} ft`, 1, { size: 62, bg: P.pink, unitCol: P.white });
      } },
    // WHO KNEW THE TIME
    r: { ids: ['hook', 'a', 'b', 'c', 'think', 'r1', 'r2', 'cta'], min: { hook: 4, a: 3, b: 2.4, c: 2.4, r1: 3.6, r2: 3.5 }, think: ['*Chor kaun?*', 'Naam comment karo'], cta: ['Pakad liya tha?', 'Comment karo'],
      caps: { hook: ['*Shahad chori!* Sirf "kal raat" pata hai.', 48], a: ['Khargosh bola:', 54, P.white], b: ['Bhalu bola:', 54, P.white], c: ['Bandar bola:', 54, P.white], r1: ['Chor *Khargosh!*', 64, P.rose], r2: ['*2 baje* kaise pata?', 62] },
      scene(c, t, id, u, d) {
        const caught = id === 'r1' || id === 'r2'; justice(c, t, { king: caught ? 'shock' : 'think', kingTalk: id === 'hook', moods: { rabbit: { mood: caught ? 'scared' : 'ok', talk: id === 'a', arms: id === 'a' ? 'up' : null }, bear: { mood: caught ? 'shock' : 'ok', talk: id === 'b', arms: id === 'b' ? 'up' : null, look: caught ? [-1, 0] : [0, 0] }, monkey: { mood: caught ? 'happy' : 'ok', talk: id === 'c', arms: id === 'c' || caught ? 'up' : null } } });
        if (id === 'hook') { honey(c, 360, 1130, 0.9); line(c, [[305, 1075], [415, 1185]], 13, '#d32f4d'); line(c, [[415, 1075], [305, 1185]], 13, '#d32f4d'); bubble(c, 500, 410, 'Kal raat!', 400, 500, pop(u, 1.8), { size: 38 }); }
        if (id === 'a') bubble(c, 220, 620, 'Raat 2 baje toh|main so raha tha!', 130, 760, pop(u, 0.2), { size: 34 });
        if (id === 'b') bubble(c, 360, 620, 'Main gufa mein tha.', 360, 770, pop(u, 0.2), { size: 34 });
        if (id === 'c') bubble(c, 500, 620, 'Main ped par tha.', 590, 770, pop(u, 0.2), { size: 34 });
        if (caught) { honey(c, 225, 945, 0.6); }
      } },
    // SWITCHES
    s: { ids: ['hook', 'think', 'r1', 'r2', 'r3', 'cta'], min: { hook: 5, r1: 3, r2: 3, r3: 7.5 }, think: ['*Kaunsa kiska?*', 'Comment karo'], cta: ['Garam socha tha?', 'Comment karo'],
      caps: { hook: ['*3 switch.* 1 bulb. Darwaza *1 baar!*', 50], r1: ['Switch *1 ON.* 10 minute.', 52], r2: ['1 OFF. *2 ON.* Andar jao!', 50] },
      scene(c, t, id, u, d) {
        if (id === 'r3') { const n = d('r3') / 3, s = u < n ? 'on' : u < n * 2 ? 'warm' : 'cold'; const cols = { on: '#5b47c0', warm: '#51287f', cold: '#241a6b' }; c.fillStyle = cols[s]; c.fillRect(-500, -500, 1720, 2300); c.fillStyle = '#1a1254'; c.fillRect(-500, 1020, 1720, 800); bulb(c, 360, 500, 1.55, s, t); const lab = { on: ['Jal raha hai', 'Switch 2', P.teal], warm: ['Band, par garam!', 'Switch 1', P.orange], cold: ['Band aur thanda', 'Switch 3', P.blue] }[s]; tag(c, 360, 800, lab[0], lab[2], 1, { size: 42 }); stat(c, 360, 950, lab[1], '', 1, { size: 76 }); return; }
        SET.warm(c, t); const st = id === 'r1' ? [u > 0.6 ? 1 : 0, 0, 0] : id === 'r2' ? [u > 0.5 ? 0 : 1, u > 1.2 ? 1 : 0, 0] : [0, 0, 0]; rr(c, 448, 660, 224, 350, [12, 12, 0, 0], '#6e2f1a'); rr(c, 464, 674, 192, 336, [6, 6, 0, 0], P.violet); rr(c, 508, 738, 104, 46, 6, P.paper); txt(c, '1 BAAR', 560, 762, 26, P.pink); circ(c, 630, 860, 12, P.amber); panel(c, 240, 440, st, id === 'r1' ? 0 : id === 'r2' ? 1 : -1);
        critter(c, 'monkey', 220, 1040, 0.95, t, { mood: id === 'hook' ? 'shock' : 'think', look: [0, -1] }); if (id === 'r1') stat(c, 360, 1110, String(Math.min(10, Math.floor(Math.max(0, u - 0.8) * 7))), 'minute', pop(u, 0.8), { size: 66 });
      } },
    // CLOCK CHIMES
    t: { ids: ['hook', 'think', 'r1', 'r2', 'cta'], min: { hook: 5, r1: 2.8, r2: 8 }, think: ['*12 baje?*', 'Seconds comment karo'], cta: ['10 par phanse?', 'Comment karo'],
      caps: { hook: ['6 baje: *6 ghante, 5 second.*', 50], r1: ['10 nahi! *11 second!*', 60], r2: ['Ginti *ghanton* ki nahi, *gaps* ki!', 46] },
      scene(c, t, id, u, d) {
        SET.warm(c, t); const cx = 360, cy = 480, Rr = 138, ang12 = id !== 'hook'; rr(c, cx - 170, cy - 200, 340, 620, 28, '#7a4b2b'); poly(c, [[cx - 196, cy - 196], [cx, cy - 310], [cx + 196, cy - 196]], '#5b3a22'); circ(c, cx, cy, Rr + 16, P.amber); circ(c, cx, cy, Rr, P.paper); for (let q = 0; q < 12; q++) { const a = (q / 12) * TAU; circ(c, cx + Math.sin(a) * (Rr - 20), cy - Math.cos(a) * (Rr - 20), 5, P.ink); } const hr = ang12 ? 0 : Math.PI; line(c, [[cx, cy], [cx + Math.sin(hr) * 74, cy - Math.cos(hr) * 74]], 11, P.ink); line(c, [[cx, cy], [cx, cy - 108]], 7, P.ink); circ(c, cx, cy, 9, P.pink);
        const sw = Math.sin(t * 3.8) * 0.3; c.save(); c.translate(cx, cy + 170); c.rotate(sw); line(c, [[0, 0], [0, 150]], 8, P.amber); circ(c, 0, 158, 32, P.amber); c.restore();
        const n = id === 'hook' ? 6 : (id === 'r1' || id === 'r2' || id === 'think') ? 12 : 12, x0 = 66, x1 = 654, y = 1020; rr(c, 30, y - 74, 660, 150, 18, 'rgba(22,13,63,.86)'); const k = id === 'hook' ? clamp(u / (d('hook') - 1)) : 1; for (let q = 0; q < n; q++) { const x = H.lerp(x0, x1, n > 1 ? q / (n - 1) : 0); if (q / (n - 1) > k + 0.001) continue; if (q < n - 1 && (q + 1) / (n - 1) <= k) { line(c, [[x + 13, y], [H.lerp(x0, x1, (q + 1) / (n - 1)) - 13, y]], 7, id === 'r2' ? P.pink : '#6e62a8'); } c.fillStyle = P.amber; c.beginPath(); c.moveTo(x - 15, y + 14); c.quadraticCurveTo(x - 12, y - 18, x, y - 18); c.quadraticCurveTo(x + 12, y - 18, x + 15, y + 14); c.fill(); circ(c, x, y + 16, 4, P.yellow); }
        const lbl = id === 'hook' ? ['6 ghante = 5 gaps', '5 sec'] : id === 'r2' || id === 'r1' ? ['12 ghante = 11 gaps', '11 sec'] : ['12 ghante = ?', '? sec']; txt(c, lbl[0], 240, y + 50, 26, P.white, 800); txt(c, lbl[1], 590, y + 50, 30, P.yellow); critter(c, 'owl', 118, 880, 0.45, t, { mood: 'ok', look: [1, -1] });
      } },
  };

  const P0 = window.RID, o = defs[P0], ids = o.ids, MIN = {};
  ids.forEach((i) => { MIN[`${P0}_${i}`] = i === 'think' ? 5.6 : i === 'cta' ? 4.5 : (o.min && o.min[i]) || 3; });
  const D = F.lengths(MIN), d = (i) => D[`${P0}_${i}`], firstR = ids.find((i) => /^r/.test(i)), lastR = ids.filter((i) => /^r/.test(i)).pop();
  const list = ids.map((id) => {
    if (id === 'think') return [`${P0}_think`, (c, u, t) => { o.scene(c, t, 'think', u, d); socho(c, u, o.think[0], o.think[1]); }, 'cut'];
    if (id === 'cta') return [`${P0}_cta`, (c, u, t) => followCard(c, t, u, o.cta[0], o.cta[1], (q) => critter(q, 'monkey', 360, 860, 1.1, t, { mood: 'happy', arms: 'up', hop: true })), 'zoom'];
    return [`${P0}_${id}`, (c, u, t) => { cam(c, 360, 640, 1 + u * 0.008, () => o.scene(c, t, id, u, d)); const cp = o.caps[id]; if (cp) caption(c, say(cp[0], 0.05, Math.min(1.5, d(id) * 0.4)), u, { y: 150, size: cp[1] || 52, hot: cp[2] || P.yellow, maxW: 670 }); }, id === 'hook' ? 'cut' : id === firstR ? 'flash' : /^r/.test(id) ? 'cut' : 'zoom'];
  });
  const tl = F.timeline(list, D), T = (i) => tl.T[`${P0}_${i}`];
  F.publish(tl, (k) => {
    F.scoreBase(k, { think: T('think'), win: T(lastR), end: tl.DURATION, cta: T('cta'), shots: tl.shots, night: ['n', 'j', 'i'].includes(P0) });
    const p = (n, x, q) => k.play(n, x, q || {});
    p('impact', 0.1); p('blip', 0.7, { f: 'E5' }); p('blip', 1.5, { f: 'G5' }); p('riser', T('think') - 1.5, { dur: 1.4 });
    ids.filter((i) => /^r/.test(i)).forEach((i, n) => { p('pop', T(i) + 0.15, { f: 620 + n * 110 }); p('click', T(i) + 0.2); p('swish', T(i) + 0.6, { dur: 0.2, gain: 0.5 }); });
    ids.filter((i) => !/^r|think|cta|hook/.test(i)).forEach((i) => { p('stamp', T(i) + 0.3); p('pop', T(i) + 1, { f: 780 }); });
    p('impact', T(firstR) + 0.02); p('ding', T(firstR) + 0.5, { f: 'E6' }); p('success', T(lastR) + 0.5); p('sparkle', T(lastR) + 0.7); for (let i = 0; i < 6; i++) p('pop', T(lastR) + 0.9 + i * 0.24, { f: 700 + (i * 190) % 800, gain: 0.5, minor: true });
  });
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
