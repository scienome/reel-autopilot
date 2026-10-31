// The 17 minute bridge: the straight answer takes 19, and the trick is sending the two slowest together.
(function () {
  const F = window.FLAT, { P, SET, cam, camAt, tag, caption, say, critter, stat, rr, oval, poly, line, curve, circ, glow, cloud, croc, bird, confetti, moon, torch, tortoise, socho, followCard, palm } = F;
  const clamp = H.clamp, E = H.ease, pop = (u, at, d = 0.3) => clamp((u - at) / d);
  const D = F.lengths({ b_hook: 4, b_cast: 7, b_rule: 7, b_wrong: 4, b_think: 5.5, b_s1: 2.8, b_s2: 2.8, b_s3: 3.6, b_s4: 2.8, b_s5: 3.4, b_aha: 3.5, b_cta: 4.5 });
  const L = { rabbit: [46, 648], fox: [136, 648], bear: [52, 800], turtle: [142, 800] }, R = { rabbit: [582, 648], fox: [672, 648], bear: [588, 800], turtle: [670, 800] };
  const TRIPS = { b_s1: [['rabbit', 'fox'], 1, 0, 2], b_s2: [['rabbit'], -1, 2, 3], b_s3: [['bear', 'turtle'], 1, 3, 13], b_s4: [['fox'], -1, 13, 15], b_s5: [['rabbit', 'fox'], 1, 15, 17] }, ORDER = ['b_s1', 'b_s2', 'b_s3', 'b_s4', 'b_s5'];
  const drawOne = (c, id, x, y, s, t, o = {}) => id === 'turtle' ? tortoise(c, x, y, s * 0.86, t, o) : critter(c, id, x, y, s, t, Object.assign({ seed: x * 0.1 }, o));
  function plank(c, x, y, w, col) { rr(c, x - w / 2, y - 7, w, 15, 3, col); }
  function bridge(c, t, shake, gone = 0) {
    const n = 15; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, x = 190 + u * 340, y = 660 + Math.sin(u * Math.PI) * 42 + Math.sin(t * 2 + i) * (1.2 + shake * 4); const drop = clamp(gone * 2.6 - ((i * 7) % n) / n * 1.7); plank(c, x, y + drop * drop * 680, 18, i % 2 ? '#a06a3a' : '#8a5a30'); }
    if (gone < 0.4) for (const o of [0, -66]) { c.strokeStyle = '#d9c29a'; c.lineWidth = 4; c.beginPath(); c.moveTo(190, 656 + o); c.quadraticCurveTo(360, 742 + o + Math.sin(t * 2) * 3, 530, 656 + o); c.stroke(); }
    if (gone < 0.4) for (let i = 0; i <= 8; i++) { const u = i / 8, x = 190 + u * 340, yy = 656 + Math.sin(u * Math.PI) * 42; line(c, [[x, yy], [x, yy - 66]], 2.5, '#d9c29a'); }
  }
  // cliffs in front of a moonlit canyon
  function world(c, t, o = {}) {
    c.fillStyle = F.vgrad(c, -300, 1300, '#14104e', '#3c2b8e'); c.fillRect(-500, -500, 1720, 2300);
    const r = H.rng(7); for (let i = 0; i < 90; i++) { const x = r() * 720, y = r() * 560, s = r() * 2.4 + 0.8, ph = r() * 6; circ(c, x, y, s, H.rgba(P.white, 0.3 + 0.6 * Math.abs(Math.sin(t + ph)))); }
    moon(c, 615, 440, 44); cloud(c, (t * 8 + 100) % 900 - 100, 450, 0.9, 0.22); cloud(c, (t * 5 + 500) % 900 - 100, 520, 0.7, 0.18);
    poly(c, [[-500, 760], [40, 500], [240, 660], [440, 470], [720, 680], [1220, 520], [1220, 1000], [-500, 1000]], '#2a2070');
    c.fillStyle = F.vgrad(c, 900, 1280, '#1d1a7c', '#0d3a7c'); c.fillRect(-500, 960, 1720, 800); for (let i = 0; i < 16; i++) rr(c, ((i * 149 + t * 26) % 860) - 70, 1000 + (i * 47) % 260, 66, 5, 3, 'rgba(160,210,255,.32)');
    croc(c, 260 + Math.sin(t * 0.5) * 90, 1090, 0.92, t); croc(c, 520 + Math.sin(t * 0.4 + 2) * 60, 1200, 0.7, t + 2);
    bridge(c, t, o.shake || 0, o.gone || 0);
    for (const sd of [0, 1]) { const x0 = sd ? 530 : -400, w = 590; c.fillStyle = '#4d3a8f'; c.beginPath(); c.roundRect(x0, 640, w, 900, 14); c.fill(); c.fillStyle = '#3f8f58'; c.beginPath(); c.roundRect(x0, 636, w, 28, 12); c.fill(); for (let i = 0; i < 6; i++) rr(c, (sd ? 556 : -10) + i * 34, 700 + (i * 53) % 430, 30, 12, 5, '#3b2c75'); }
    palm(c, 24, 640, 0.5, t, 1); palm(c, 700, 640, 0.55, t, 2);
  }
  // where everyone stands at the start of trip i, then draws the walkers
  const sideAt = (i) => { const s = { rabbit: 0, fox: 0, bear: 0, turtle: 0 }; for (let n = 0; n < i; n++) { const [who] = TRIPS[ORDER[n]]; who.forEach((w) => (s[w] = 1 - s[w])); } return s; };
  function trip(c, t, id, u) {
    const i = ORDER.indexOf(id), [who, dir] = TRIPS[id], s = sideAt(i), k = E.inOut(clamp((u - 0.25) / (D[id] - 0.7)));
    for (const a in s) if (!who.includes(a)) { const p = (s[a] ? R : L)[a]; drawOne(c, a, p[0], p[1], 0.5, t, { mood: 'think' }); }
    who.forEach((a, n) => { const from = (dir > 0 ? L : R)[a], to = (dir > 0 ? R : L)[a]; let q = k; const x = H.lerp(from[0], to[0], q), yb = H.lerp(from[1], to[1], q), onB = x > 190 && x < 530 ? Math.sin(((x - 190) / 340) * Math.PI) * 42 + 660 : yb, y = onB + Math.abs(Math.sin(u * 8 + n)) * -7 + n * 4; drawOne(c, a, x + (n ? -26 : 26) * dir, y, 0.5, t, { flip: dir < 0, mood: a === 'turtle' ? 'scared' : 'ok' }); if (n === 0) torch(c, x + 52 * dir, y - 118, 0.72, t); });
  }
  const clock = (c, m, col = P.pink) => stat(c, 360, 300, `${m}`, '/ 17 min', 1, { size: 74, bg: col });
  const hook = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 690, 1.3], [D.b_hook, 360, 680, 1.02]], u);
    cam(c, x + Math.sin(t * 22) * 2, y, z, () => { world(c, t, { shake: 1 }); });
    caption(c, say('Pul *tootne* wala hai! Sirf *17 minute!*', 0.1, 2.2), u, { y: 165, size: 54, hot: P.yellow });
  };
  const cast = (c, u, t) => {
    const f = D.b_cast; world(c, t); c.fillStyle = 'rgba(22,13,63,.5)'; c.fillRect(0, 0, 720, 1280);
    const A = [['rabbit', 1, 'Khargosh', 0.18], ['fox', 2, 'Lomdi', 0.38], ['bear', 5, 'Bhalu', 0.54], ['turtle', 10, 'Kachhua', 0.72]];
    A.forEach(([a, m, n, at], i) => { const b = E.back(pop(u, f * at - 0.3)), x = i % 2 ? 530 : 190, y = i < 2 ? 640 : 1030; if (b <= 0) return; drawOne(c, a, x, y, 0.95 * b, t, { mood: 'happy', hop: u < f * at + 0.3 }); stat(c, x, y + 60, `${m}`, 'min', pop(u, f * at - 0.2), { size: 58 }); });
    caption(c, say('*4 dost.* Har ek ki alag speed.', 0.05, 1.2), u, { y: 165, size: 52, hot: P.yellow });
  };
  const rule = (c, u, t) => {
    const f = D.b_rule; cam(c, 360, 680, 1.02, () => { world(c, t, { shake: 0.4 }); for (const a in L) drawOne(c, a, L[a][0], L[a][1], 0.5, t, { mood: 'think', look: [1, 0] }); torch(c, 182, 520, 0.8, t); });
    tag(c, 360, 845, 'Pul par sirf 2', P.pink, pop(u, 0.5), { size: 44 }); tag(c, 360, 930, 'Torch sirf 1, wapas lao', P.orange, pop(u, f * 0.33), { size: 38 }); tag(c, 360, 1015, 'Jodi = dheeme ki chaal', P.teal, pop(u, f * 0.66), { size: 38 });
    caption(c, say('Teen *rules.* Dhyan se!', 0.1, 1), u, { y: 165, size: 58, hot: P.yellow });
  };
  const wrong = (c, u, t) => {
    const hit = pop(u, 1.6, 0.2), g = H.smooth(2.1, 3.6, u); cam(c, 360 + Math.sin(t * 28) * 5 * hit, 680, 1.02, () => world(c, t, { shake: 1, gone: g }));
    caption(c, say('Sabko *ek ek* karke?', 0.1, 1.2), u, { y: 165, size: 54, hot: P.yellow });
    c.save(); c.translate(360, 480); const z = 1 + (1 - hit) * 0.5; c.scale(z, z); if (hit > 0) stat(c, 0, 0, '19', 'min', hit, { size: 120, bg: '#c9264f', unitCol: P.white }); c.restore();
  };
  const think = (c, u, t) => { cam(c, 360, 680, 1.02, () => { world(c, t, { shake: 0.5 }); for (const a in L) drawOne(c, a, L[a][0], L[a][1], 0.5, t, { mood: 'think', look: [1, -0.5] }); }); socho(c, u, '*17 mein kaise?*', 'Apna tareeka comment karo'); };
  const step = (id, text, hot) => (c, u, t) => {
    const [, , a, b] = TRIPS[id], k = clamp(u / (D[id] - 0.4)), m = Math.round(H.lerp(a, b, k));
    cam(c, 360, 680, 1.02, () => { world(c, t, { shake: 0.3 }); trip(c, t, id, u); });
    clock(c, m, id === 'b_s3' ? '#c9264f' : P.pink); caption(c, say(text, 0.05, 0.8), u, { y: 165, size: id === 'b_s3' ? 50 : 54, hot });
    if (id === 'b_s3') tag(c, 360, 960, 'Dono dheeme ek saath', P.orange, pop(u, 0.5), { size: 40 });
  };
  const aha = (c, u, t) => {
    const g = H.smooth(0.4, 2.4, u); cam(c, 360, 690, 1.02, () => { world(c, t, { shake: 1, gone: g }); for (const a in R) drawOne(c, a, R[a][0], R[a][1], 0.5, t, { mood: 'happy', hop: true, flip: true }); });
    confetti(c, t, u); caption(c, say('Raaz: *dono dheeme,* ek saath!', 0.1, 1.5), u, { y: 165, size: 54, hot: P.yellow }); stat(c, 360, 310, '17', 'min', 1, { size: 74, bg: '#0f6b58' });
  };
  const cta = (c, u, t) => followCard(c, t, u, 'Kitne minute?', 'Apna answer comment karo', () => { critter(c, 'rabbit', 215, 870, 0.95, t, { mood: 'happy' }); tortoise(c, 505, 870, 0.95, t, { mood: 'happy' }); });

  const tl = F.timeline([['b_hook', hook, 'cut'], ['b_cast', cast, 'zoom'], ['b_rule', rule, 'flash'], ['b_wrong', wrong, 'zoom'], ['b_think', think, 'cut'], ['b_s1', step('b_s1', '*Khargosh + Lomdi*', P.yellow), 'flash'], ['b_s2', step('b_s2', 'Khargosh *wapas*', P.rose), 'cut'], ['b_s3', step('b_s3', 'Asli *TRICK!*', P.yellow), 'cut'], ['b_s4', step('b_s4', 'Lomdi *wapas*', P.rose), 'cut'], ['b_s5', step('b_s5', '*Khargosh + Lomdi*', P.yellow), 'cut'], ['b_aha', aha, 'zoom'], ['b_cta', cta, 'zoom']], D);
  const T = tl.T;
  F.publish(tl, (k) => {
    F.scoreBase(k, { think: T.b_think, win: T.b_aha, end: tl.DURATION, cta: T.b_cta, shots: tl.shots, night: true, chords: [['D3', 'F3', 'A3', 'C4'], ['A#2', 'D3', 'F3', 'A3'], ['G2', 'C3', 'E3', 'G3'], ['A2', 'C#3', 'E3', 'A3']] });
    const p = (n, x, o) => k.play(n, x, o || {}), f = D.b_cast;
    p('thud', 0.2); p('impact', 0.6); for (let i = 0; i < 7; i++) p('tock', 0.8 + i * 0.45, { gain: 0.7 }); p('riser', 1.2, { dur: 2 });
    [0.18, 0.38, 0.54, 0.72].forEach((a, i) => { p('pop', T.b_cast + f * a - 0.3, { f: 900 - i * 140 }); p('blip', T.b_cast + f * a - 0.2, { f: ['G6', 'E6', 'C6', 'G5'][i] }); });
    [0.5, D.b_rule * 0.33, D.b_rule * 0.66].forEach((x) => p('stamp', T.b_rule + x));
    p('error', T.b_wrong + 1.6); p('impact', T.b_wrong + 1.65); p('thud', T.b_wrong + 2.3); p('whoosh', T.b_wrong + 2.4, { dur: 1 });
    ['b_s1', 'b_s2', 'b_s3', 'b_s4', 'b_s5'].forEach((id) => { for (let x = 0.3; x < D[id] - 0.5; x += 0.3) p('tock', T[id] + x, { f: 500 + (x * 37) % 160, gain: 0.45, minor: true }); p('ding', T[id] + D[id] - 0.4, { f: id === 'b_s5' ? 'C6' : 'E5' }); });
    p('impact', T.b_s3 + 0.1); p('riser', T.b_s3 + 0.1, { dur: 1 }); p('success', T.b_aha + 0.1); p('sparkle', T.b_aha + 0.2); p('thud', T.b_aha + 1); p('whoosh', T.b_aha + 0.7, { dur: 1.2 });
  });
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
