// Riddle engine: F.runRiddle('r', def) turns one riddle definition into a voice-timed reel. F.kit holds the shared props.
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

  F.kit = { clamp, E, TAU, pop, txt, mango, banana, coconut, laddoo, honey, frog, hatOn, POLAR, SHADOW, bows, table, box, justice, panel, bulb };
  F.runRiddle = (P0, o) => {
  const ids = o.ids, MIN = {};
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
  };
})();
