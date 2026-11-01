// Example reel: the real history of the Illuminati. Copy this structure for a new reel.
// Every time comes from window.TIMING (made by scripts/voice.py), so a new voice take re-times the whole reel.
(() => {
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const TM = window.TIMING, DURATION = TM.duration, S = TM.shots, order = Object.keys(S);
  const span = (name) => { const i = order.indexOf(name); return [S[name], i + 1 < order.length ? S[order[i + 1]] : DURATION]; };
  const line = (name, k = 0) => TM.lines.filter((l) => l.shot === name)[k]; // the k-th spoken line of a shot
  const at = (name, u) => { const [a, b] = span(name); return a + (b - a) * u; }; // a moment partway through a shot
  const captionNow = (ctx, t, name) => { let cur = null; for (const l of TM.lines) if (l.shot === name && t >= l.t0) cur = l; if (cur) N.caption(ctx, cur.cap, cur.t0, t); };

  const bookCover = (ctx, x, y, s, rot) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); const w = 400, h = 560;
    ctx.fillStyle = INK; ctx.fillRect(-w / 2 + 9, -h / 2 + 9, w, h); ctx.fillStyle = PAPER; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(-w / 2 + 12, -h / 2 + 12, w - 24, h - 24);
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = `62px ${N.F.num}`; ctx.fillText('PROOFS', 0, -146); ctx.font = `34px ${N.F.type}`; ctx.fillText('of a', 0, -102); ctx.font = `50px ${N.F.num}`; ctx.fillText('CONSPIRACY', 0, -46);
    ctx.fillStyle = 'rgba(11,11,12,0.5)'; for (let i = 0; i < 6; i++) ctx.fillRect(-140, 2 + i * 26, i % 3 === 2 ? 170 : 280, 4); ctx.fillStyle = RED; ctx.font = `64px ${N.F.num}`; ctx.fillText('1797', 0, 232); ctx.restore();
  };

  const shot = (name, draw) => { const [a, b] = span(name); return { a, b, draw }; };
  const SHOTS = [
    shot('hook', (ctx, t) => { // a lone figure in a cone of light
      N.bg(ctx); N.beam(ctx, 360, -160, -40, 760, 930, { lines: 100, seed: 4 }); N.floor(ctx, 860, 1270, { rows: 20 });
      N.figure(ctx, 360, 900, 500, { kind: 'coat', facing: -1, walk: t * 1.1, arms: [[34, 40], [-14, 8]] });
      N.umbrella(ctx, 352, 402, 128, RED, t);
      ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 170); N.stat(ctx, 'ILLUMINATI', W / 2, 180, 136, { u: back(t, 0.12, 0.25) });
      N.rain(ctx, t, 150, 0.5); N.finish(ctx, t); captionNow(ctx, t, 'hook');
    }),
    shot('date', (ctx, t) => { // the date, huge, and a small group at night
      const t0 = line('date').t0; N.bg(ctx); N.windowPane(ctx, 62, 500, 596, 330, 3, { seed: 6 }); N.floor(ctx, 846, 1270, { rows: 20 });
      N.stat(ctx, '1776', W / 2, 262, 300, { col: RED, u: back(t, t0, 0.25) }); N.tag(ctx, 'MAY 1', 118, 440, { px: 34 });
      [[150, 400, 'coat', 1], [270, 430, 'coat', 1], [380, 410, 'suit', -1], [490, 440, 'coat', -1], [594, 400, 'coat', -1]].forEach(([x, h, kind, f]) => N.figure(ctx, x, 880, h, { kind, facing: f, arms: [[12, 18], [-6, 8]] }));
      N.note(ctx, 'Ingolstadt, Bavaria (now in Germany)', 124, 914, { px: 24, col: PAPER }); N.rain(ctx, t, 90, 0.34); N.finish(ctx, t); captionNow(ctx, t, 'date');
    }),
    shot('spread', (ctx, t) => { // it spread across a continent: a thought per city
      const a = line('spread', 0), b = line('spread', 1); N.bg(ctx); N.windowPane(ctx, 18, 410, 684, 410, 4, { seed: 11 }); N.floor(ctx, 830, 1270, { rows: 20 });
      [[70, 870, 450, 'coat', 1], [190, 870, 480, 'suit', 1], [310, 870, 440, 'dress', 1], [420, 870, 470, 'coat', -1], [530, 870, 440, 'saree', -1], [642, 870, 480, 'coat', -1]].forEach(([x, y, h, kind, f]) => N.figure(ctx, x, y, h, { kind, facing: f, arms: [[6, 12], [-6, 8]], rim: true, rimW: 1.5 }));
      [['Italy', 164, 170, a.t0 + (a.t1 - a.t0) * 0.55, [120, 400]], ['Denmark', 548, 172, a.t0 + (a.t1 - a.t0) * 0.82, [590, 400]], ['Warsaw', 176, 330, b.t0 + 0.1, [190, 430]], ['Paris', 540, 330, b.t0 + (b.t1 - b.t0) * 0.6, [500, 440]]].forEach(([s, x, y, st, tail], i) => N.bubble(ctx, x, y, 256, 128, s, { u: back(t, st, 0.2), tail, px: 48, red: s === 'Paris', seed: 40 + i }));
      N.rain(ctx, t, 90, 0.3); N.finish(ctx, t); captionNow(ctx, t, 'spread');
    }),
    shot('ban', (ctx, t) => { // the ruler bans them: someone runs down a tunnel of light
      const l = line('ban'); N.bg(ctx); N.corridor(ctx, 360, 540, { lines: 150, seed: 14 });
      N.figure(ctx, 360, 900, 560, { kind: 'coat', walk: t * 7, facing: 1, arms: [[52 * Math.sin(t * 7), 40], [-52 * Math.sin(t * 7), 40]], rim: true, rimW: 3 });
      N.stamp(ctx, 'BANNED', W / 2, 250, back(t, l.t1 - 0.45, 0.18), { px: 124, rot: -0.09 });
      N.finish(ctx, t); captionNow(ctx, t, 'ban');
    }),
    shot('nine', (ctx, t) => { // the punchline: nine years
      const [a] = span('nine'), t0 = line('nine').t0; N.bg(ctx); N.stripes(ctx, -21, { band: 66, gap: 74, offset: (t - a) * 6, seed: 22 }); ctx.fillStyle = 'rgba(11,11,12,0.2)'; ctx.fillRect(0, 0, W, H);
      N.profile(ctx, 460, 650, 1.55, { hat: true, facing: -1, rimW: 4 });
      ctx.fillStyle = INK; ctx.fillRect(38, 96, 338, 438); N.stat(ctx, '9', 196, 250, 340, { col: RED, u: back(t, t0, 0.22) }); N.stat(ctx, 'YEARS', 208, 462, 104, { u: back(t, t0 + 0.25, 0.2) });
      N.finish(ctx, t); captionNow(ctx, t, 'nine');
    }),
    shot('book', (ctx, t) => { // the legend starts: one book
      const [a, b] = span('book'); N.bg(ctx); N.beam(ctx, 360, -160, -100, 820, 980, { lines: 90, seed: 25 }); N.floor(ctx, 880, 1270, { rows: 18 });
      bookCover(ctx, 340, 540, 1.05 + 0.04 * clamp((t - a) / (b - a)), -0.05);
      N.bubble(ctx, 520, 178, 330, 150, 'They never died.', { u: back(t, line('book', 1).t0 + 0.2, 0.2), red: true, px: 48, tail: [430, 300], seed: 52 });
      N.finish(ctx, t); captionNow(ctx, t, 'book');
    }),
    shot('rev', (ctx, t) => { // a revolution gets blamed on them
      N.bg(ctx); N.beam(ctx, 360, 120, -300, 1020, 900, { lines: 120, seed: 29 }); N.floor(ctx, 860, 1270, { rows: 18 });
      ctx.fillStyle = INK; ctx.fillRect(344, 200, 7, 640); const fl = Math.sin(t * 5) * 14; ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(351, 204); ctx.quadraticCurveTo(450, 180 + fl, 568, 224); ctx.lineTo(556, 362 - fl * 0.4); ctx.quadraticCurveTo(450, 316 + fl, 351, 350); ctx.closePath(); ctx.fill();
      [[52, 410], [156, 440], [262, 470], [372, 490], [482, 460], [582, 430], [676, 400]].forEach(([x, h], i) => N.figure(ctx, x, 880, h, { kind: 'coat', hat: i % 2 === 0, facing: i < 3 ? 1 : -1, arms: [[150 + Math.sin(t * 6 + i) * 12, 6], [-4, 10]] }));
      N.stat(ctx, '1789', 168, 130, 132, { u: back(t, line('rev').t0, 0.22) });
      const l2 = line('rev', 1); if (t >= l2.t0) N.bubble(ctx, 548, 110, 278, 124, 'Proof? None.', { u: back(t, l2.t0, 0.18), px: 42, seed: 3 });
      N.finish(ctx, t); captionNow(ctx, t, 'rev');
    }),
    shot('today', (ctx, t) => { // now: everyone, still looking
      const [a] = span('today'), l2 = line('today', 1); N.bg(ctx); N.stripes(ctx, 24, { band: 44, gap: 58, seed: 31, offset: -(t - a) * 4 }); ctx.fillStyle = 'rgba(11,11,12,0.34)'; ctx.fillRect(0, 0, W, H);
      [[120, 780], [300, 880], [520, 800], [640, 900], [68, 930]].forEach(([x, y], i) => N.figure(ctx, x, y, 300, { kind: i % 2 ? 'coat' : 'dress', walk: t * 2 + i, facing: i % 2 ? -1 : 1, arms: [[64, 66], [58, 72]] }));
      N.figure(ctx, 410, 900, 380, { kind: 'coat', facing: 1, walk: t * 2, arms: [[58, 72], [52, 76]] }); N.umbrella(ctx, 400, 556, 112, RED, t);
      N.stat(ctx, '240 YEARS', W / 2, 180, 146, { u: back(t, line('today').t0, 0.22) });
      ["They're watching.", "It's all fake!", 'Look at this sign...'].forEach((s, i) => N.bubble(ctx, [176, 546, 196][i], [378, 402, 562][i], 276, 118, s, { u: back(t, l2.t0 + i * 0.4, 0.18), px: 34, seed: 70 + i }));
      N.rain(ctx, t, 120, 0.42); N.finish(ctx, t); captionNow(ctx, t, 'today');
    }),
  ];
  // the page pull-out uses a settled moment from each shot
  const KEYS = ['hook', 'date', 'spread', 'ban', 'nine', 'book', 'rev', 'today'].map((n) => at(n, 0.9));
  KEYS.push(at('today', 0.97));

  function draw(ctx, t) {
    if (t < S.end) { N.sequence(ctx, t, SHOTS); return; }
    const l1 = line('end', 0), l2 = line('end', 1);
    N.pageOut(ctx, t, S.end, 1.1, SHOTS, KEYS); N.finish(ctx, t); ctx.fillStyle = `rgba(0,0,0,${0.7 * ramp(t, l1.t0, 0.35)})`; ctx.fillRect(0, 0, W, H);
    N.stat(ctx, 'TRUTH', W / 2, 400, 152, { u: back(t, l1.t0, 0.22) }); N.stat(ctx, 'OR STORY?', W / 2, 568, 136, { col: RED, u: back(t, l1.t0 + 0.2, 0.22) });
    captionNow(ctx, t, 'end');
    if (t >= l2.t1 - 0.1) N.tag(ctx, 'FOLLOW FOR THE NEXT ONE', W / 2, 760, { px: 34 });
  }

  function score(k) {
    order.slice(1).forEach((n) => k.play('whoosh', S[n] - 0.05, { dur: 0.34, gain: 0.34, minor: true }));
    TM.lines.forEach((l) => k.play('click', l.t0, { gain: 0.42, minor: true }));
    for (let i = 0; i * 2 < DURATION; i++) k.noise(i * 2, { dur: 2.2, color: 'pink', filter: 'highpass', f: 2400, gain: 0.018 });
    for (let i = 0; i * 5.5 < DURATION; i++) k.tone(i * 5.5, { f: 58 + (i % 2) * 7, type: 'triangle', dur: 5.6, gain: 0.08, a: 1, filter: 'lowpass', f2: 300 });
    k.play('thud', line('date').t0, { f: 72, gain: 0.5 }); k.play('impact', line('ban').t1 - 0.45, { gain: 0.75 }); k.play('thud', line('nine').t0, { f: 64, gain: 0.7 }); k.play('thud', line('book', 1).t0 + 0.2, { f: 80, gain: 0.45 });
    const a = line('spread', 0), b = line('spread', 1);
    [a.t0 + (a.t1 - a.t0) * 0.55, a.t0 + (a.t1 - a.t0) * 0.82, b.t0 + 0.1, b.t0 + (b.t1 - b.t0) * 0.6].forEach((t) => k.play('pop', t, { f: 560, gain: 0.25, minor: true }));
    k.play('riser', S.end - 0.7, { dur: 0.8, gain: 0.26 }); k.play('impact', line('end').t0, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
