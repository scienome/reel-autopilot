// Riddle helpers for FLAT: voice-timed shots, the countdown, the follow card, a shared score, and riddle props. Load after animals.js.
(function () {
  const F = window.FLAT, { P, rr, circ, oval, poly, line, curve, glow, shade, caption, say, stat, tag, critter } = F, TAU = Math.PI * 2;
  const clamp = H.clamp;

  // shot lengths follow the voice. MIN = { id: seconds } keeps room for the animation; window.VOICE_D holds each line's seconds
  F.lengths = (MIN) => { const D = {}; for (const k in MIN) D[k] = Math.max(MIN[k], ((window.VOICE_D || {})[k] || 0) + 0.4); return D; };
  F.timeline = (list, D) => { let clk = 0; const T = {}; const shots = list.map(([id, draw, kind]) => { const q = { id, t0: clk, t1: clk + D[id], draw, in: kind }; T[id] = clk; clk += D[id]; return q; }); window.SHOT_STARTS = T; return { shots, T, DURATION: clk }; };
  F.publish = (tl, score) => { window.LESSON = { BEATS: tl.shots, DURATION: tl.DURATION, explainer: (c, W, H_, t) => { F.runShots(c, tl.shots, t); F.finish(c); } }; window.scoreSound = score; };

  // the 5 second "think" beat: dims the scene, counts down, and asks for the comment
  F.socho = (c, u, words, ask) => {
    c.fillStyle = 'rgba(22,13,63,.45)'; c.fillRect(0, 0, 720, 1280);
    caption(c, say(words, 0.05, 0.5), u, { y: 165, size: 72, hot: P.yellow, maxW: 660 });
    const n = Math.max(1, 5 - Math.floor(u)), beat = 1 + (1 - clamp((u % 1) / 0.25)) * 0.16;
    c.save(); c.translate(360, 410); c.scale(beat, beat); stat(c, 0, 0, String(n), '', 1, { size: 128, bg: P.pink }); c.restore();
    tag(c, 360, 1120, ask, P.pink, clamp((u - 0.3) / 0.3), { size: 34 });
  };
  // the closing card: asks for a comment, then a follow button that pulses
  F.followCard = (c, t, u, top, sub, draw) => {
    F.SET.space(c, t); if (draw) draw(c);
    const k = clamp(u / 0.35); c.globalAlpha = k; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = P.white; c.font = `900 78px ${F.FONT}`; const w0 = c.measureText(top).width; c.font = `900 ${Math.min(78, Math.floor((78 * 650) / w0))}px ${F.FONT}`; c.fillText(top, 360, 240);
    c.fillStyle = P.lilac; c.font = `800 35px ${F.FONT}`; c.fillText(sub, 360, 322); c.globalAlpha = 1;
    const b = clamp((u - 0.9) / 0.3); if (b > 0) { const z = H.ease.back(b) * (1 + Math.sin(t * 6) * 0.035); c.save(); c.translate(360, 1040); c.scale(z, z); rr(c, -170, -48, 340, 96, 48, P.pink); c.fillStyle = P.white; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `900 48px ${F.FONT}`; c.fillText('FOLLOW', 0, 3); c.restore(); }
  };
  // shared score: three music moods, night or day ambience, and the countdown ticks
  F.scoreBase = (k, o) => {
    k.music('pad', 0, o.think, { bpm: 92, gain: 0.5, chords: o.chords || [['A3', 'C4', 'E4', 'G4'], ['F3', 'A3', 'C4', 'E4'], ['D3', 'F3', 'A3', 'C4'], ['E3', 'G3', 'B3', 'E4']] });
    k.music('pulse', o.think, o.win, { bpm: 112, gain: 0.42, chords: [['A3', 'C4', 'E4'], ['A3', 'C4', 'F4'], ['G3', 'B3', 'E4'], ['E3', 'G3', 'B3']] });
    k.music('chip', o.win, o.end, { bpm: 132, gain: 0.6, chords: [['C4', 'E4', 'G4', 'C5'], ['F3', 'A3', 'C4', 'F4'], ['G3', 'B3', 'D4', 'G4'], ['C4', 'E4', 'G4', 'C5']] });
    k.bed('room', 0, o.end, { gain: 0.3 });
    for (let x = 0.6, i = 0; x < o.end; x += o.night ? 0.42 : 1.9 + (i % 4) * 0.7, i++) {
      if (o.night) k.noise(x, { dur: 0.03, filter: 'bandpass', f: 5200, q: 8, gain: 0.018 + (i % 3) * 0.006, minor: true });
      else { const f = 2300 + (i * 370) % 1100; k.tone(x, { f: [[0, f], [0.07, f * 1.28]], dur: 0.09, gain: 0.05, minor: true }); k.tone(x + 0.13, { f: [[0, f * 1.1], [0.06, f * 0.88]], dur: 0.08, gain: 0.04, minor: true }); }
    }
    o.shots.slice(1).forEach((s) => { if (s.in === 'flash') k.play('shutter', s.t0, {}); else if (s.in === 'zoom') k.play('whoosh', s.t0, { dur: 0.4 }); else k.play('swish', s.t0, { dur: 0.16, gain: 0.6 }); });
    for (let i = 0; i < 5; i++) { k.play('tock', o.think + i, {}); k.play('tick', o.think + i + 0.5, {}); } k.play('ding', o.think + 5, { f: 'A5' });
    k.play('sparkle', o.cta + 0.3, {}); k.play('blip', o.cta + 0.9, { f: 'C6' });
  };

  // ---- props
  F.night = (c, t, o = {}) => {
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = o.tint || '#2d3a86'; c.fillRect(-500, -500, 1720, 2300); c.restore();
    const r = H.rng(21); for (let i = 0; i < 70; i++) { const x = r() * 720, y = r() * 420, s = r() * 2.2 + 0.8, ph = r() * 6; circ(c, x, y, s, H.rgba(P.white, 0.3 + 0.6 * Math.abs(Math.sin(t + ph)))); }
  };
  F.moon = (c, x, y, r = 58) => { glow(c, x, y, r * 3.6, P.yellow, 0.4); circ(c, x, y, r, '#fff1b8'); circ(c, x - r * 0.3, y - r * 0.2, r * 0.17, '#e8d690'); circ(c, x + r * 0.32, y + r * 0.26, r * 0.22, '#e8d690'); };
  F.diamond = (c, x, y, s, t = 0) => { c.save(); c.translate(x, y); c.scale(s, s); glow(c, 0, 0, 96, P.sky, 0.5 + Math.sin(t * 4) * 0.12); poly(c, [[-40, -18], [-20, -38], [20, -38], [40, -18], [0, 42]], '#7fe3f2'); poly(c, [[-40, -18], [-14, -18], [0, 42]], '#b9f3fb'); poly(c, [[14, -18], [40, -18], [0, 42]], '#3fb9d6'); poly(c, [[-20, -38], [20, -38], [14, -18], [-14, -18]], '#e4fbff'); c.restore(); };
  F.calendarBoard = (c, x, y, s, hi = 0) => { c.save(); c.translate(x, y); c.scale(s, s); if (hi) glow(c, 0, 0, 240, P.yellow, 0.6 * hi); line(c, [[0, -112], [0, -96]], 6, P.ink); rr(c, -92, -96, 184, 192, 10, P.paper); c.fillStyle = '#d12f52'; c.beginPath(); c.roundRect(-92, -96, 184, 44, [10, 10, 0, 0]); c.fill(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = P.white; c.font = `800 22px ${F.FONT}`; c.fillText('KAL RAAT', 0, -73); circ(c, 0, -7, 30, P.ink); c.fillStyle = P.ink; c.font = `900 25px ${F.FONT}`; c.fillText('AMAVASYA', 0, 58); c.restore(); };
  F.torch = (c, x, y, s, t, a = 1) => { glow(c, x, y, 190 * s, P.yellow, 0.7 * a); c.save(); c.translate(x, y); c.scale(s, s); rr(c, -7, 0, 14, 42, 4, '#7a4b2b'); c.fillStyle = P.orange; c.beginPath(); c.moveTo(-14, 3); c.quadraticCurveTo(-18 + Math.sin(t * 14) * 3, -26, 0, -44); c.quadraticCurveTo(18 + Math.sin(t * 11) * 3, -26, 14, 3); c.fill(); oval(c, 0, -9, 7, 13, P.yellow); c.restore(); };
  F.flames = (c, x, y, w, h, t) => { for (let i = 0; i < 9; i++) { const q = i / 8, px = x - w / 2 + q * w, ht = h * (0.52 + 0.48 * Math.abs(Math.sin(t * 7 + i * 1.7))) * (1 - Math.abs(q - 0.5) * 0.7), wd = w / 5.2; for (const [k, col] of [[1, P.orange], [0.68, P.amber], [0.36, P.yellow]]) { c.fillStyle = col; c.beginPath(); c.moveTo(px - wd * k, y); c.quadraticCurveTo(px - wd * k * 0.8 + Math.sin(t * 9 + i) * 8, y - ht * k * 0.55, px + Math.sin(t * 6 + i) * 7, y - ht * k); c.quadraticCurveTo(px + wd * k * 0.8, y - ht * k * 0.5, px + wd * k, y); c.fill(); } } };
  F.snake = (c, x, y, s, t, col = '#25b35f', seed = 0) => { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.lineWidth = 19; c.lineCap = 'round'; c.beginPath(); for (let i = 0; i <= 18; i++) { const u = i / 18, px = -66 + u * 132, py = Math.sin(u * 9 + t * 4 + seed) * 13 * (1 - u * 0.3) - u * u * 100; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke(); const hy = Math.sin(9 + t * 4 + seed) * 9 - 100; oval(c, 74, hy, 25, 18, col); for (const q of [-8, 8]) { circ(c, 78, hy + q - 4, 6, P.yellow); circ(c, 79, hy + q - 4, 2.5, P.ink); } const fl = Math.sin(t * 13 + seed) > 0 ? 18 : 6; line(c, [[97, hy], [97 + fl, hy]], 3.5, '#ef3f80'); c.restore(); };
  // a shell on top of the standard body gives the tortoise
  F.tortoise = (c, x, y, s, t, o = {}) => { c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s); oval(c, 0, 3, 88, 11, 'rgba(10,6,40,.2)'); for (const sd of [-1, 1]) rr(c, sd * 48 - 21, -30, 42, 32, 12, '#6ea75a'); oval(c, 0, -62, 88, 58, '#3e8a50'); for (const [a, b] of [[-38, -68], [0, -80], [38, -68], [-20, -44], [20, -44]]) { poly(c, [[a - 18, b], [a - 9, b - 15], [a + 9, b - 15], [a + 18, b], [a + 9, b + 15], [a - 9, b + 15]], '#5eab60'); } c.restore(); c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s); c.translate(0, -112 + Math.sin(t * 1.3) * 3); circ(c, 0, 0, 55, '#8cc56f'); for (const sd of [-1, 1]) { const ey = -8; circ(c, sd * 21, ey, 15, P.white); circ(c, sd * 21 + (o.look ? o.look[0] * 4 : 0), ey + (o.look ? o.look[1] * 4 : 0), 7, P.ink); if (o.mood === 'scared') line(c, [[sd * 21 - 11, ey - 21 + sd * 4], [sd * 21 + 11, ey - 21 - sd * 4]], 5, P.ink); } if (o.mood === 'happy') { c.fillStyle = '#5a1730'; c.beginPath(); c.arc(0, 19, 16, 0, Math.PI); c.fill(); } else if (o.mood === 'scared') oval(c, 0, 27, 9, 12, '#5a1730'); else curve(c, [-13, 21], [0, 31], [13, 21], 5, '#3a2231'); c.restore(); };
})();
