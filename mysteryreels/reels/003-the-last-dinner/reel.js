// The Last Dinner, part 1 (fiction): a waiter serves an invented masked circle. Every time comes from window.TIMING.
(() => {
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const TM = window.TIMING, DURATION = TM.duration, S = TM.shots, order = Object.keys(S);
  const span = (name) => { const i = order.indexOf(name); return [S[name], i + 1 < order.length ? S[order[i + 1]] : DURATION]; };
  const line = (name, k = 0) => TM.lines.filter((l) => l.shot === name)[k];
  const captionNow = (ctx, t, name) => { let cur = null; for (const l of TM.lines) if (l.shot === name && t >= l.t0) cur = l; if (cur) N.caption(ctx, cur.cap, cur.t0, t); };

  const mask = (ctx, x, y, s, u = 1, red = false) => { // a blank white mask with slit eyes
    if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); ctx.fillStyle = red ? RED : PAPER; ctx.beginPath(); ctx.moveTo(-52, -70); ctx.quadraticCurveTo(0, -92, 52, -70); ctx.quadraticCurveTo(62, 26, 0, 88); ctx.quadraticCurveTo(-62, 26, -52, -70); ctx.fill();
    ctx.fillStyle = INK; [-1, 1].forEach((d) => { ctx.beginPath(); ctx.ellipse(d * 24, -18, 16, 6, d * 0.2, 0, 6.3); ctx.fill(); }); ctx.fillRect(-14, 40, 28, 4); ctx.restore();
  };
  const guest = (ctx, x, s, u) => { N.figure(ctx, x, 800, 430 * s, { kind: 'suit', facing: x < 360 ? 1 : -1, arms: [[8, 10], [-6, 8]], rim: true, rimW: 1.5 }); };
  const tableTop = (ctx, y) => { ctx.fillStyle = PAPER; ctx.fillRect(20, y, 680, 34); ctx.fillStyle = INK; ctx.fillRect(20, y + 34, 680, 8); ctx.fillStyle = PAPER; [90, 700 - 90].forEach((x) => ctx.fillRect(x - 10, y + 40, 20, 170)); };
  const chair = (ctx, x, y, s, col) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.fillRect(-60, -210, 16, 340); ctx.fillRect(44, -210, 16, 340); ctx.fillRect(-60, -210, 120, 18); ctx.fillRect(-60, -130, 120, 14); ctx.fillRect(-70, 16, 140, 22); ctx.restore(); };
  const list = (ctx, t, a, last) => { // the names, each struck through as the line plays
    ctx.save(); ctx.translate(360, 480); ctx.rotate(-0.02); ctx.fillStyle = PAPER; ctx.fillRect(-250, -350, 500, 720); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(-232, -332, 464, 684);
    const names = ['R. HOLLOWAY', 'M. VANTER', 'S. ORLOW', 'K. DRASK', 'T. ELLWOOD', 'N. CARROW', 'A. MERIDEN', 'D. MARLOW'];
    ctx.textAlign = 'left'; names.forEach((n, i) => { const y = -252 + i * 78, isLast = i === names.length - 1; ctx.fillStyle = isLast ? RED : INK; ctx.font = `${isLast ? 46 : 40}px ${N.F.type}`; ctx.fillText(n, -200, y); if (!isLast) { const u = clamp((t - a - i * 0.3) / 0.25); ctx.fillStyle = INK; ctx.fillRect(-206, y - 14, 410 * u, 7); } });
    if (last) { ctx.strokeStyle = RED; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, -252 + 7 * 78 - 16, 232, 50, 0, 0, 6.3); ctx.stroke(); }
    ctx.restore();
  };

  const shot = (name, draw) => { const [a, b] = span(name); return { a, b, draw }; };
  const SHOTS = [
    shot('hook', (ctx, t) => {
      const l1 = line('hook'), l2 = line('hook', 1); N.bg(ctx); N.beam(ctx, 360, -160, -60, 780, 930, { lines: 100, seed: 8 }); N.floor(ctx, 880, 1270, { rows: 20 });
      N.figure(ctx, 360, 930, 560, { kind: 'suit', facing: -1, arms: [[12, 18], [-8, 8]] });
      ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 170); N.stat(ctx, '$1,000,000', W / 2, 180, 112, { col: RED, u: back(t, l1.t0 + 1.2, 0.22) });
      N.tag(ctx, 'THE LAST DINNER: PART 1', W / 2, 310, { px: 30 }); N.note(ctx, 'A fictional story', 250, 352, { px: 22, col: INK });
      if (t >= l2.t0) N.stamp(ctx, "DON'T LOOK UP", W / 2, 600, back(t, l2.t0 + 0.8, 0.18), { px: 72, rot: -0.07 });
      N.finish(ctx, t); captionNow(ctx, t, 'hook');
    }),
    shot('table', (ctx, t) => {
      const l1 = line('table'), l2 = line('table', 1); N.bg(ctx); N.windowPane(ctx, 40, 150, 640, 500, 3, { seed: 3 }); N.floor(ctx, 850, 1270, { rows: 18 });
      [[80, 1], [176, 1.05], [272, 1], [448, 1], [544, 1.05], [640, 1]].forEach(([x, s], i) => { guest(ctx, x, s); mask(ctx, x, 800 - 430 * s + 44, 0.62, back(t, l1.t0 + i * 0.22, 0.14)); });
      chair(ctx, 360, 720, 1.05, t >= l2.t0 ? RED : INK); tableTop(ctx, 780);
      N.stat(ctx, '7', 90, 108, 90, { col: PAPER, u: back(t, l1.t0, 0.2) });
      N.finish(ctx, t); captionNow(ctx, t, 'table');
    }),
    shot('food', (ctx, t) => {
      const l2 = line('food', 1), [a, b] = span('food'); N.bg(ctx); const z = 1 + 0.08 * clamp((t - a) / (b - a));
      mask(ctx, 360, 390, 3.3 * z, 1); ctx.fillStyle = 'rgba(11,11,12,1)'; ctx.fillRect(0, 720, W, 300); tableTop(ctx, 720);
      if (t >= l2.t0) { ctx.fillStyle = PAPER; ctx.beginPath(); ctx.ellipse(360, 712, 160, 16, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.ellipse(360, 696, 72, 28, 0, Math.PI, 0); ctx.fill(); N.stamp(ctx, 'UNTOUCHED', W / 2, 160, back(t, l2.t0 + 1, 0.18), { px: 84, rot: -0.06 }); }
      N.finish(ctx, t); captionNow(ctx, t, 'food');
    }),
    shot('list', (ctx, t) => {
      const l1 = line('list'), l2 = line('list', 1); N.bg(ctx); list(ctx, t, l1.t0 + 1.2, t >= l2.t0 + 0.6);
      N.finish(ctx, t); captionNow(ctx, t, 'list');
    }),
    shot('end', (ctx, t) => {
      const l1 = line('end'), l2 = line('end', 1); N.bg(ctx); N.stripes(ctx, 90, { band: 34, gap: 100, offset: 0, seed: 5 }); ctx.fillStyle = 'rgba(11,11,12,0.6)'; ctx.fillRect(0, 0, W, H);
      mask(ctx, 360, 290, 1.9, back(t, l1.t0, 0.2)); if (t >= l2.t0) chair(ctx, 360, 760, 1.3, RED);
      if (t >= l2.t1 - 0.2) { ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 90); N.tag(ctx, 'PART 2 COMING', W / 2, 144, { px: 38 }); }
      N.finish(ctx, t); captionNow(ctx, t, 'end');
    }),
  ];

  function score(k) {
    order.slice(1).forEach((n) => k.play('whoosh', S[n] - 0.05, { dur: 0.34, gain: 0.34, minor: true }));
    TM.lines.forEach((l) => k.play('click', l.t0, { gain: 0.35, minor: true }));
    for (let i = 0; i * 5.5 < DURATION; i++) k.tone(i * 5.5, { f: 49 + (i % 2) * 5, type: 'triangle', dur: 5.6, gain: 0.09, a: 1, filter: 'lowpass', f2: 280 });
    k.play('thud', line('hook').t0 + 1.2, { f: 72, gain: 0.5 }); k.play('impact', line('hook', 1).t0 + 0.8, { gain: 0.6 });
    for (let i = 0; i < 6; i++) k.play('pop', line('table').t0 + i * 0.22, { f: 300, gain: 0.2, minor: true });
    k.play('thud', line('table', 1).t0, { f: 62, gain: 0.7 }); k.play('impact', line('food').t0, { gain: 0.8 }); k.play('impact', line('list', 1).t0 + 0.6, { gain: 0.8 }); k.play('riser', line('end', 1).t0 - 0.8, { dur: 1, gain: 0.22 }); k.play('thud', line('end', 1).t0 + 0.6, { f: 60, gain: 0.7 });
  }
  window.REEL = { DURATION, draw: (ctx, t) => N.sequence(ctx, t, SHOTS), score };
})();
