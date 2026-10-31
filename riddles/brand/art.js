// Profile picture and YouTube cover for the riddle channel, drawn with the reel kit so they match the videos.
const F = window.FLAT, { P, SET, critter, glow, rr, circ, poly, line, parrot, bird, shade } = F;
const FONT = `Montserrat, sans-serif`;
function word(c, s, x, y, size, col, sw) { c.font = `900 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.strokeStyle = P.ink; c.lineWidth = sw; c.strokeText(s, x, y); c.fillStyle = col; c.fillText(s, x, y); }
function bulb(c, x, y, s) { glow(c, x, y, 200 * s, P.yellow, 0.75); c.save(); c.translate(x, y); c.scale(s, s); rr(c, -24, 58, 48, 34, 7, '#8b86a8'); poly(c, [[-38, 40], [38, 40], [26, 62], [-26, 62]], P.yellow); circ(c, 0, 0, 62, P.yellow); line(c, [[-16, 46], [-20, 2], [0, -16], [20, 2], [16, 46]], 6, P.orange); circ(c, -24, -22, 11, 'rgba(255,255,255,.75)'); c.restore(); }
window.profile = () => {
  const cv = document.getElementById('c'); cv.width = 1024; cv.height = 1024; const c = cv.getContext('2d');
  const g = c.createRadialGradient(512, 480, 90, 512, 512, 720); g.addColorStop(0, '#7b55ea'); g.addColorStop(1, '#2a1a86'); c.fillStyle = g; c.fillRect(0, 0, 1024, 1024);
  // the monkey fills the circle Instagram and YouTube crop to, with the idea above its head
  critter(c, 'monkey', 500, 1090, 3.05, 1, { mood: 'ok', look: [1, -1], noShadow: true });
  bulb(c, 775, 225, 1.5);
  word(c, '?', 215, 265, 250, P.rose, 22);
};
window.cover = () => {
  const cv = document.getElementById('c'); cv.width = 2560; cv.height = 1440; const c = cv.getContext('2d'), t = 1.3;
  c.save(); c.scale(3.56, 3.56); c.translate(0, -553); SET.jungle(c, t); c.restore();
  c.fillStyle = 'rgba(22,13,63,.18)'; c.fillRect(0, 0, 2560, 1440);
  // YouTube always shows the middle 1546 x 423, so the name and main animals stay inside it
  const floor = 925; for (const [k, x, s, o] of [['bear', 600, 0.9, { mood: 'ok', look: [1, -0.5] }], ['fox', 725, 0.85, { mood: 'sly', look: [1, 0] }], ['monkey', 1835, 0.9, { mood: 'ok', look: [-1, -0.8] }], ['rabbit', 1960, 0.88, { mood: 'shock', look: [-1, 0] }]]) critter(c, k, x, floor, s, t, o);
  word(c, 'SOCHO ZARA', 1280, 690, 132, P.white, 24); word(c, 'Roz nayi paheli', 1280, 810, 66, P.yellow, 15); bulb(c, 1280, 555, 0.62);
  parrot(c, 2120, 640, 1.4, t, 1);
};
