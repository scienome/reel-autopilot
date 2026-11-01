// Example reel: "Bahu Nahi, Malkin" Episode 1. Copy this file's structure for a new reel.
// Timings are estimates until a voiceover exists. To re-time, edit SHOT and CAP only.
(() => {
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const SHOT = { tray: 0, lawn: 3.4, toast: 10, hope: 14, papers: 17, tanya: 20.2, sign: 24.6, call: 29, eyes: 32, end: 35 };
  const DURATION = 38.5;
  const CAP = [
    [0.15, 'AAJ TUMHARI SHAADI KA|*AAKHRI DIN HAI.'],
    [3.5, 'MEERA! TRAY|*SEEDHI PAKDO.'], [5.3, 'PAANCH SAAL|HO GAYE...'], [6.9, 'AB TAK *NAUKRANI JAISA|CHALNA NAHI AAYA.'],
    [10.2, 'AAJ HAMARI *PAANCHVI|ANNIVERSARY HAI.'], [12.3, 'TOH *GIFT TOH|BANTA HAI.'],
    [14.2, 'VIKRAM, SAB|DEKH RAHE HAIN.'], [15.9, '*ISILIYE TOH.'],
    [17.3, 'YEH... *DIVORCE PAPERS?'],
    [20.4, 'SORRY, MEERA JI.'], [21.7, 'AB YEH GHAR,|AUR VIKRAM,'], [23.3, 'DONO *MERE HAIN.'],
    [24.8, '*SIGN KARO.'], [26.0, 'AAJ TUMHARI SHAADI KA|*AAKHRI DIN HAI.'],
    [30.2, '*MADAM.'],
    [32.2, 'PAANCH SAAL|HO GAYE.'], [33.5, 'AB BHI *CHUP RAHENGI?'],
    [35.6, "ISNE *MADAM|KYUN KAHA?"],
  ];
  const captionNow = (ctx, t, a, b) => { let cur = null; for (const c of CAP) if (c[0] >= a && c[0] < b && t >= c[0]) cur = c; if (cur) N.caption(ctx, cur[1], cur[0], t); };

  const paperSheet = (ctx, x, y, w, h, rot = 0, big = false) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = INK; ctx.fillRect(-w / 2 + 7, -h / 2 + 7, w, h); ctx.fillStyle = PAPER; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = `${big ? 72 : 42}px ${N.F.num}`; ctx.fillText('DIVORCE', 0, -h * 0.3); ctx.font = `${big ? 34 : 20}px ${N.F.type}`; ctx.fillText('PETITION', 0, -h * 0.3 + (big ? 44 : 26));
    ctx.fillStyle = 'rgba(11,11,12,0.55)'; for (let i = 0; i < 7; i++) ctx.fillRect(-w * 0.38, -h * 0.1 + i * h * 0.07, w * (i % 3 === 2 ? 0.45 : 0.76), big ? 5 : 3);
    ctx.strokeStyle = RED; ctx.lineWidth = big ? 5 : 3; ctx.beginPath(); ctx.moveTo(w * 0.02, h * 0.4); ctx.lineTo(w * 0.4, h * 0.4); ctx.stroke(); ctx.restore();
  };
  const tray = (ctx, x, y, r, tilt = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(6, 8, r, r * 0.92, 0, 0, N.TAU); ctx.fill(); ctx.fillStyle = PAPER; ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.92, 0, 0, N.TAU); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.9, r * 0.82, 0, 0, N.TAU); ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); };
  const walkingCrowd = (ctx, t) => { [[60, 880, 300, 'saree', 1], [168, 900, 320, 'coat', 1], [558, 900, 330, 'coat', -1], [662, 880, 300, 'saree', -1]].forEach(([x, y, h, kind, f]) => N.figure(ctx, x, y, h, { kind, facing: f, arms: [[6, 14], [-6, 8]], rim: false })); };

  const SHOTS = [
    { a: SHOT.tray, b: SHOT.lawn, draw(ctx, t) { // the papers on a tray in a pool of light
      N.bg(ctx); N.beam(ctx, 360, -180, -90, 810, 960, { lines: 90, seed: 7 }); N.floor(ctx, 800, 1270, { rows: 16 });
      const z = 1 + 0.05 * clamp(t / 3.4); ctx.save(); ctx.translate(360, 600); ctx.scale(z, z); ctx.translate(-360, -600); tray(ctx, 360, 610, 268); paperSheet(ctx, 360, 610, 262, 356, 0.07); ctx.restore();
      N.rain(ctx, t, 110, 0.45); N.finish(ctx, t); captionNow(ctx, t, SHOT.tray, SHOT.lawn);
    } },
    { a: SHOT.lawn, b: SHOT.toast, draw(ctx, t) { // the lawn: bright bungalow windows, guests, Meera with her tray
      N.bg(ctx); N.windowPane(ctx, 26, 240, 668, 400, 4, { seed: 8 }); N.fairy(ctx, t, 180, 40); N.fairy(ctx, t, 90, 30, { seed: 44 }); N.floor(ctx, 700, 1270, { rows: 24 });
      ctx.fillStyle = INK; ctx.fillRect(0, 610, W, 110);
      walkingCrowd(ctx, t);
      const m = N.figure(ctx, 265, 930, 470, { kind: 'saree', pallu: true, t, arms: [[62, 34], [52, 42]] });
      tray(ctx, m.hands[0][0] + 22, m.hands[0][1] - 4, 58, Math.sin(t * 7) * 0.02 - 0.06 * ramp(t, 3.5, 0.3)); ['#'].forEach(() => { ctx.fillStyle = INK; [-22, 4, 28].forEach((d) => ctx.fillRect(m.hands[0][0] + 16 + d, m.hands[0][1] - 40, 11, 30)); });
      const su = N.figure(ctx, 500, 930, 490, { kind: 'saree', facing: -1, arms: [[86 * ramp(t, 3.4, 0.2), 4], [14, 62]], rim: true });
      N.bubble(ctx, 158, 300, 214, 118, 'Bechari.', { u: back(t, 4.6, 0.22), tail: [72, 560], px: 38 });
      N.bubble(ctx, 560, 302, 238, 132, 'Phir daant padi.', { u: back(t, 6.3, 0.22), tail: [650, 560], px: 34 });
      N.bubble(ctx, 360, 150, 268, 112, 'Naukrani hai kya?', { u: back(t, 7.9, 0.22), tail: [350, 340], px: 34 });
      N.rain(ctx, t, 90, 0.34); N.finish(ctx, t); captionNow(ctx, t, SHOT.lawn, SHOT.toast);
    } },
    { a: SHOT.toast, b: SHOT.hope, draw(ctx, t) { // Vikram in bars of light, with the big number
      N.bg(ctx); N.stripes(ctx, -19, { band: 70, gap: 72, offset: -(t - SHOT.toast) * 5 });
      N.stat(ctx, '5', 170, 310, 330, { col: RED, u: back(t, 10.2, 0.25), align: 'left' }); N.stat(ctx, 'SAAL', 150, 495, 76, { u: back(t, 10.5, 0.2), align: 'left' });
      N.profile(ctx, 410, 730, 1.45, { hair: 'short', rimW: 4 });
      const raise = back(t, 12.2, 0.3); ctx.save(); ctx.translate(640, 600 - 26 * raise); ctx.fillStyle = PAPER; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-26, -66); ctx.lineTo(26, -66); ctx.lineTo(13, 18); ctx.lineTo(-13, 18); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = RED; ctx.fillRect(-20, -40, 40, 8); ctx.restore();
      N.finish(ctx, t); captionNow(ctx, t, SHOT.toast, SHOT.hope);
    } },
    { a: SHOT.hope, b: SHOT.papers, draw(ctx, t) { // Meera's close-up: her small hope
      N.bg(ctx); N.beam(ctx, 40, -160, -240, 900, 1300, { lines: 110, seed: 19 }); const drop = t >= 15.9;
      N.profile(ctx, 345, 650, 1.75, { hair: 'bun', bindi: true, pallu: true, rimW: 3 });
      if (!drop) N.bubble(ctx, 540, 230, 280, 142, 'Shayad aaj kuch khaas hai...', { u: back(t, 14.3, 0.22), tail: [440, 400], px: 33 });
      else N.bubble(ctx, 545, 230, 180, 120, '?', { u: back(t, 15.9, 0.18), px: 72, tail: [440, 400] });
      N.finish(ctx, t); captionNow(ctx, t, SHOT.hope, SHOT.papers);
    } },
    { a: SHOT.papers, b: SHOT.tanya, draw(ctx, t) { // the slam: the document fills the frame
      N.bg(ctx); N.stripes(ctx, 62, { band: 40, gap: 46, seed: 2 }); ctx.fillStyle = 'rgba(11,11,12,0.72)'; ctx.fillRect(0, 0, W, H);
      const s = back(t, SHOT.papers + 0.05, 0.22); ctx.save(); ctx.translate(360, 560); ctx.scale(s, s); paperSheet(ctx, 0, 0, 560, 760, -0.035, true); ctx.restore();
      N.stamp(ctx, 'AAKHRI DIN', 370, 790, back(t, 18.1, 0.18), { px: 76, rot: -0.1 });
      N.finish(ctx, t); captionNow(ctx, t, SHOT.papers, SHOT.tanya);
    } },
    { a: SHOT.tanya, b: SHOT.sign, draw(ctx, t) { // Vikram and Tanya framed in the window, walking away with everything
      N.bg(ctx); N.windowPane(ctx, 60, 190, 600, 560, 3, { seed: 15 }); N.floor(ctx, 780, 1270, { rows: 22 }); N.rain(ctx, t, 100, 0.4);
      const ph = t * 2.6; N.figure(ctx, 258, 880, 620, { kind: 'suit', walk: ph, arms: [[14, 10], [-16, 10]] }); N.figure(ctx, 416, 880, 590, { kind: 'dress', walk: ph + 0.5, arms: [[-44, 30], [-10, 8]] });
      N.bubble(ctx, 560, 196, 248, 124, 'Sab mera.', { u: back(t, 23.3, 0.2), tail: [470, 320], px: 40 });
      N.tag(ctx, 'ANNIVERSARY', 160, 130, { px: 30 });
      N.finish(ctx, t); captionNow(ctx, t, SHOT.tanya, SHOT.sign);
    } },
    { a: SHOT.sign, b: SHOT.call, draw(ctx, t) { // Sumitra at the end of a tunnel of light, the pen coming at the viewer
      N.bg(ctx); N.corridor(ctx, 360, 610, { lines: 150 });
      const rise = ramp(t, SHOT.sign, 0.5), g = 1 + 0.18 * clamp((t - SHOT.sign) / 4.4);
      const su = N.figure(ctx, 360, 960, 720 * g, { kind: 'saree', arms: [[86 * rise, 2], [10, 58]], nose: true, rim: true, rimW: 3 });
      const h = su.hands[0]; ctx.save(); ctx.translate(h[0], h[1]); ctx.rotate(-0.03); ctx.fillStyle = INK; ctx.strokeStyle = PAPER; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(0, -7, 98, 14, 6); ctx.fill(); ctx.stroke(); ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(98, -7); ctx.lineTo(126, 0); ctx.lineTo(98, 7); ctx.closePath(); ctx.fill(); ctx.restore();
      N.finish(ctx, t); captionNow(ctx, t, SHOT.sign, SHOT.call);
    } },
    { a: SHOT.call, b: SHOT.eyes, draw(ctx, t) { // the phone lights up in the dark
      N.bg(ctx); N.beam(ctx, 360, -80, 40, 680, 880, { lines: 70, seed: 27 });
      const shake = Math.sin(t * 46) * 4; ctx.save(); ctx.translate(360 + shake, 540); ctx.rotate(-0.05); ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.beginPath(); ctx.roundRect(-108, -196, 216, 392, 22); ctx.fill();
      ctx.fillStyle = '#16161a'; ctx.beginPath(); ctx.roundRect(-95, -180, 190, 360, 12); ctx.fill(); ctx.fillStyle = PAPER; ctx.textAlign = 'center'; ctx.font = `34px ${N.F.cap}`; ctx.fillText('UNKNOWN', 0, -90); ctx.font = `24px ${N.F.type}`; ctx.fillText('calling...', 0, -50);
      ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(-46, 110, 28, 0, N.TAU); ctx.fill(); ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(46, 110, 28, 0, N.TAU); ctx.fill(); ctx.restore();
      [0, 1].forEach((i) => { ctx.strokeStyle = PAPER; ctx.lineWidth = 5; const R = 240 + i * 34 + ((t * 3) % 1) * 10; [[-0.4, 0.4], [Math.PI - 0.4, Math.PI + 0.4]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(360, 540, R, a, b); ctx.stroke(); }); });
      N.bubble(ctx, 360, 170, 300, 130, 'Madam.', { u: back(t, 30.2, 0.2), red: true, px: 52, seed: 8 });
      N.rain(ctx, t, 130, 0.4); N.finish(ctx, t); captionNow(ctx, t, SHOT.call, SHOT.eyes);
    } },
    { a: SHOT.eyes, b: SHOT.end, draw(ctx, t) { // Meera, alone in the rain, and something in her changes
      N.bg(ctx); N.beam(ctx, 470, -120, 150, 800, 960, { lines: 80, seed: 33 }); N.floor(ctx, 840, 1270, { rows: 18 });
      const walk = (t - SHOT.eyes) * 2; N.figure(ctx, 470, 910, 610, { kind: 'saree', pallu: true, t, facing: -1, arms: [[6, 12], [-4, 6]], rim: false });
      N.rain(ctx, t, 190, 0.55); N.stat(ctx, '5 SAAL', 118, 300, 96, { col: PAPER, align: 'left', u: back(t, 32.2, 0.2) }); N.note(ctx, 'chup rehne ke...', 124, 372, { px: 30 });
      N.finish(ctx, t); captionNow(ctx, t, SHOT.eyes, SHOT.end);
    } },
  ];
  const KEYS = [2.6, 8.6, 13.2, 15.2, 19.3, 23.9, 28.2, 31.2, 34.4];

  function draw(ctx, t) {
    if (t < SHOT.end) { N.sequence(ctx, t, SHOTS); return; }
    N.pageOut(ctx, t, SHOT.end, 1.2, SHOTS, KEYS); N.finish(ctx, t); ctx.fillStyle = `rgba(0,0,0,${0.66 * ramp(t, 35.5, 0.4)})`; ctx.fillRect(0, 0, W, H);
    N.stat(ctx, 'MADAM?', W / 2, 560, 178, { col: RED, u: back(t, 35.55, 0.25) });
    captionNow(ctx, t, SHOT.end, DURATION);
    if (t >= 36.6) N.tag(ctx, 'AGLA PART: LINK BIO MEIN', W / 2, 730, { px: 32 });
  }

  function score(k) {
    const cut = (t) => k.play('whoosh', t - 0.05, { dur: 0.34, gain: 0.34, minor: true });
    Object.values(SHOT).slice(1).forEach(cut);
    CAP.forEach(([t]) => k.play('click', t, { gain: 0.42, minor: true }));
    for (let i = 0; i < 19; i++) k.noise(i * 2, { dur: 2.2, color: 'pink', filter: 'highpass', f: 2400, gain: 0.018 });
    for (let i = 0; i < 7; i++) k.tone(i * 5.5, { f: 58 + (i % 2) * 7, type: 'triangle', dur: 5.6, gain: 0.08, a: 1, filter: 'lowpass', f2: 300 });
    [4.6, 6.3, 7.9, 14.3, 23.3].forEach((t) => k.play('pop', t, { f: 560, gain: 0.25, minor: true }));
    k.play('thud', 10.2, { f: 70, gain: 0.5 }); k.play('riser', 16.3, { dur: 0.8, gain: 0.28 }); k.play('impact', 17.1, { gain: 0.75 }); k.play('thud', 18.1, { f: 90, gain: 0.5 }); k.play('thud', 26.0, { f: 80, gain: 0.45 });
    for (let i = 0; i < 4; i++) k.play('buzz', 29.2 + i * 0.68, { f: 82, dur: 0.34, gain: 0.5 });
    k.play('impact', 30.2, { gain: 0.5 }); k.play('thud', 35.55, { f: 62, gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
