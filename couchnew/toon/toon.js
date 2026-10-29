  // ==================== toon: flat cartoon characters for the new couch sitcom ====================
  // Bold flat style: thick dark outlines, flat fills with one soft shade, big expressive eyes, stretchy poses.
  // person(ctx, x, y, s, o): x, y = feet centre, s = scale (1 = ~620 px tall). o = { who: 'maya' | 'sam' | 'mum',
  //   face: { eyes: 'open'|'half'|'wide'|'angry'|'closed'|'happy', look: [dx, dy], brows: -1..1 (angry..worried), mouth: 'smile'|'smirk'|'open'|'frown'|'shout'|'flat'|'o'|'grin', talk: 0..1, blush },
  //   arms: 'down'|'hips'|'cross'|'point'|'shrug'|'wave'|'facepalm'|'phone', tilt (rad), lean (rad), bob }
  const TOON = (() => {
    const INK = '#1d1626', OL = 7;
    const CAST = {
      maya: { skin: '#c98a62', skinSh: '#b0724d', hair: '#2a1a16', top: '#e2384f', topSh: '#bf2741', legs: '#2c2f4a', shoe: '#f2efe8', height: 1.0, girl: true, bun: true, hoops: true },
      sam: { skin: '#e8b48a', skinSh: '#d39a70', hair: '#3a2a20', top: '#f2b632', topSh: '#d8961c', legs: '#3b4a6b', shoe: '#e94f37', height: 1.08, messy: true, stubble: true },
      mum: { skin: '#d9a07a', skinSh: '#c08561', hair: '#9a9aa4', top: '#5b8f7a', topSh: '#477563', legs: '#5a4a5e', shoe: '#2a2230', height: 0.92, girl: true, glasses: true, curls: true },
    };
    const shape = (ctx, fill, path, lw = OL) => { ctx.beginPath(); path(); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); };
    const limb = (ctx, a, b, c, w, col) => { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = w + OL * 2; ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(...b, ...c); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); ctx.restore(); };
    const ARMS = { // [shoulder->elbow ctrl->hand] for left (viewer's left) and right arm, in body units (y up negative)
      down: [[-95, 40, -110, 140, -100, 230], [95, 40, 110, 140, 100, 230]],
      hips: [[-95, 40, -175, 120, -70, 175], [95, 40, 175, 120, 70, 175]],
      cross: [[-95, 40, -60, 150, 60, 110], [95, 40, 60, 150, -60, 120]],
      point: [[-95, 40, -110, 140, -100, 230], [95, 40, 200, 20, 300, -40]],
      shrug: [[-95, 40, -200, 60, -190, -40], [95, 40, 200, 60, 190, -40]],
      wave: [[-95, 40, -110, 140, -100, 230], [95, 40, 190, 0, 170, -130]],
      facepalm: [[-95, 40, -110, 140, -100, 230], [95, 40, 120, -40, 20, -130]],
      phone: [[-95, 40, -120, 140, -30, 90], [95, 40, 120, 140, 30, 90]],
    };
    const person = (ctx, x, y, s, o = {}) => {
      const c = CAST[o.who || 'maya'], f = o.face || {}, k = s * c.height, t = o.t || 0;
      ctx.save(); ctx.translate(x, y + (o.bob || 0)); ctx.scale(k, k); ctx.rotate(o.lean || 0);
      ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, 4, 120, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      // legs + shoes
      for (const sd of [-1, 1]) { shape(ctx, c.legs, () => { ctx.roundRect(sd * 18 - (sd < 0 ? 46 : 0) + (sd < 0 ? -8 : 8), -250, 46, 230, 18); }); shape(ctx, c.shoe, () => ctx.ellipse(sd * 38, -12, 44, 22, 0, 0, Math.PI * 2)); }
      // body
      const torso = () => { ctx.moveTo(-100, -250); ctx.lineTo(100, -250); ctx.quadraticCurveTo(118, -400, 70, -470); ctx.lineTo(-70, -470); ctx.quadraticCurveTo(-118, -400, -100, -250); ctx.closePath(); };
      if (c.girl) shape(ctx, c.top, () => { ctx.moveTo(-115, -250); ctx.lineTo(115, -250); ctx.quadraticCurveTo(100, -400, 66, -470); ctx.lineTo(-66, -470); ctx.quadraticCurveTo(-100, -400, -115, -250); ctx.closePath(); });
      else shape(ctx, c.top, torso);
      ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = c.topSh; ctx.beginPath(); ctx.moveTo(40, -255); ctx.quadraticCurveTo(90, -380, 60, -465); ctx.lineTo(80, -460); ctx.quadraticCurveTo(110, -380, 96, -255); ctx.fill(); ctx.restore();
      // clothes details
      ctx.lineWidth = 5; ctx.strokeStyle = INK;
      if (o.who === 'sam') { ctx.beginPath(); ctx.roundRect(-60, -330, 120, 56, 16); ctx.stroke(); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 20, -462); ctx.lineTo(sd * 24, -400); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sd * 24, -398, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } }
      if (o.who === 'maya') { ctx.beginPath(); ctx.moveTo(-50, -470); ctx.quadraticCurveTo(0, -420, 50, -470); ctx.stroke(); ctx.fillStyle = c.skin; ctx.beginPath(); ctx.moveTo(-46, -468); ctx.quadraticCurveTo(0, -424, 46, -468); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(-50, -470); ctx.quadraticCurveTo(0, -420, 50, -470); ctx.stroke(); }
      if (o.who === 'mum') { for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * 8, -468); ctx.lineTo(sd * 8, -255); ctx.stroke(); } ctx.fillStyle = '#f2efe8'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-20, -430 + i * 45, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } }
      // arms
      const A = ARMS[o.arms || 'down'];
      for (const a of A) { const sh = [a[0], -440], el = [a[2], -440 + a[3]], hd = [a[4], -440 + a[5]]; limb(ctx, sh, el, hd, 40, c.top); shape(ctx, c.skin, () => ctx.arc(hd[0], hd[1], 22, 0, Math.PI * 2)); }
      if (o.arms === 'phone') { shape(ctx, '#20202a', () => ctx.roundRect(-34, -400, 68, 110, 12)); ctx.fillStyle = '#8fd0ff'; ctx.fillRect(-26, -392, 52, 90); }
      // neck + head
      shape(ctx, c.skin, () => ctx.roundRect(-26, -505, 52, 50, 10));
      ctx.save(); ctx.translate(0, -560); ctx.rotate(o.tilt || 0);
      if (c.curls) for (let i = 0; i < 9; i++) { const a = Math.PI + (i / 8) * Math.PI; shape(ctx, c.hair, () => ctx.arc(Math.cos(a) * 112, Math.sin(a) * 105 - 10, 34, 0, Math.PI * 2)); }
      if (c.bun) shape(ctx, c.hair, () => ctx.arc(0, -150, 52, 0, Math.PI * 2));
      if (c.girl && !c.curls) shape(ctx, c.hair, () => { ctx.ellipse(0, -10, 128, 132, 0, Math.PI * 0.9, Math.PI * 2.1); ctx.lineTo(118, 60); ctx.lineTo(-118, 60); ctx.closePath(); });
      shape(ctx, c.skin, () => ctx.ellipse(0, 0, 112, 120, 0, 0, Math.PI * 2));
      for (const sd of [-1, 1]) { shape(ctx, c.skin, () => ctx.ellipse(sd * 112, 10, 20, 28, 0, 0, Math.PI * 2)); if (c.hoops) { ctx.lineWidth = 6; ctx.strokeStyle = '#f2c230'; ctx.beginPath(); ctx.arc(sd * 116, 52, 16, 0, Math.PI * 2); ctx.stroke(); } }
      if (c.stubble) { ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 108, 116, 0, 0, Math.PI * 2); ctx.clip(); ctx.globalAlpha = 0.16; ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(0, 92, 104, 62, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      // hair on top
      if (c.messy) shape(ctx, c.hair, () => { ctx.moveTo(-118, -10); for (let i = 0; i <= 8; i++) { const a = Math.PI + (i / 8) * Math.PI, r = i % 2 ? 150 : 118; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 1.05 - 6); } ctx.lineTo(118, -10); ctx.quadraticCurveTo(0, -70, -118, -10); ctx.closePath(); });
      else if (c.girl && !c.curls) shape(ctx, c.hair, () => { ctx.moveTo(-122, 0); ctx.quadraticCurveTo(-110, -125, 0, -128); ctx.quadraticCurveTo(110, -125, 122, 0); ctx.quadraticCurveTo(60, -90, 10, -70); ctx.quadraticCurveTo(-60, -95, -122, 0); ctx.closePath(); });
      else if (c.curls) for (let i = 0; i < 5; i++) shape(ctx, c.hair, () => ctx.arc(-80 + i * 40, -98 + Math.abs(i - 2) * 10, 32, 0, Math.PI * 2));
      if (o.who === 'maya') for (const sd of [-1, 1]) shape(ctx, c.hair, () => { ctx.moveTo(sd * 96, -70); ctx.quadraticCurveTo(sd * 128, 10, sd * 104, 96); ctx.quadraticCurveTo(sd * 92, 20, sd * 78, -60); ctx.closePath(); });
      // face
      const ey = -6, ex = 46, eyes = f.eyes || 'open', blink = o.blink || (Math.sin(t * 1.3 + (o.who === 'sam' ? 1 : 0)) > 0.985), look = f.look || [0, 0];
      for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * ex, ey);
        if (eyes === 'closed' || blink) { ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(0, -4, 24, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
        else if (eyes === 'happy') { ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(0, 10, 24, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
        else { const h = eyes === 'wide' ? 40 : eyes === 'half' ? 22 : 34; shape(ctx, '#ffffff', () => ctx.ellipse(0, 0, 30, h, 0, 0, Math.PI * 2), 6);
          const pr = eyes === 'wide' ? 13 : 16; ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(look[0] * 10, look[1] * 10 + (eyes === 'half' ? 6 : 0), pr, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(look[0] * 10 - 5, look[1] * 10 - 6, 5, 0, Math.PI * 2); ctx.fill();
          if (eyes === 'half') { ctx.fillStyle = c.skin; ctx.fillRect(-34, -h - 4, 68, h * 0.95); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(-31, -h * 0.05); ctx.lineTo(31, -h * 0.05); ctx.stroke(); }
          if (eyes === 'angry') { const inX = -sd * 36, outX = sd * 36, inY = h * 0.15, outY = -h * 0.7; ctx.fillStyle = c.skin; ctx.beginPath(); ctx.moveTo(inX, inY); ctx.lineTo(outX, outY); ctx.lineTo(outX, -h - 8); ctx.lineTo(inX, -h - 8); ctx.closePath(); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(inX * 0.85, inY * 0.85); ctx.lineTo(outX * 0.85, outY * 0.85); ctx.stroke(); } }
        if (c.girl && eyes !== 'closed' && !blink) { ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(sd * 22, -26); ctx.lineTo(sd * 38, -38); ctx.stroke(); }
        // brows
        const b = f.brows || 0; ctx.lineWidth = 10; ctx.strokeStyle = c.hair === '#9a9aa4' ? '#5a5a66' : INK; ctx.beginPath(); ctx.moveTo(-26 * sd * -1 - (sd > 0 ? 0 : 0), -54 - b * sd * 0); ctx.restore(); }
      for (const sd of [-1, 1]) { const b = f.brows || 0; ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.strokeStyle = c.hair === '#9a9aa4' ? '#6a6a76' : INK; ctx.beginPath(); ctx.moveTo(sd * (ex - 26), ey - 50 + b * 14); ctx.quadraticCurveTo(sd * ex, ey - 64 + (b < 0 ? 6 : -4), sd * (ex + 28), ey - 52 - b * 10); ctx.stroke(); }
      if (c.glasses) { ctx.lineWidth = 6; ctx.strokeStyle = INK; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.roundRect(sd * ex - 38, ey - 34, 76, 66, 18); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-8, ey - 6); ctx.lineTo(8, ey - 6); ctx.stroke(); }
      // nose
      ctx.lineWidth = 6; ctx.strokeStyle = c.skinSh; ctx.beginPath(); ctx.moveTo(4, 14); ctx.quadraticCurveTo(16, 40, -2, 44); ctx.stroke();
      if (f.blush) { ctx.save(); ctx.globalAlpha = 0.35 * f.blush; ctx.fillStyle = '#ff5a7a'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 66, 42, 22, 12, 0, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
      // mouth (talk flaps open/closed)
      let m = f.mouth || 'smile'; const talk = f.talk ? (Math.sin(t * 22) > 0 ? 1 : 0) : 0; if (talk && (m === 'smile' || m === 'flat' || m === 'smirk')) m = 'open';
      ctx.lineWidth = 7; ctx.strokeStyle = INK; ctx.lineCap = 'round'; const my = 74;
      if (m === 'smile') { ctx.beginPath(); ctx.arc(0, my - 16, 30, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
      else if (m === 'smirk') { ctx.beginPath(); ctx.moveTo(-26, my); ctx.quadraticCurveTo(10, my + 8, 34, my - 14); ctx.stroke(); }
      else if (m === 'flat') { ctx.beginPath(); ctx.moveTo(-24, my); ctx.lineTo(24, my); ctx.stroke(); }
      else if (m === 'frown') { ctx.beginPath(); ctx.arc(0, my + 26, 28, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
      else if (m === 'grin') shape(ctx, '#ffffff', () => { ctx.moveTo(-42, my - 12); ctx.quadraticCurveTo(0, my + 44, 42, my - 12); ctx.closePath(); }, 7);
      else { const big = m === 'shout' ? 1.5 : m === 'o' ? 0.8 : 1; shape(ctx, '#5a1a2a', () => ctx.ellipse(0, my + 6, (m === 'o' ? 18 : 30) * big, 24 * big, 0, 0, Math.PI * 2), 7); ctx.fillStyle = '#ff7a8a'; ctx.beginPath(); ctx.ellipse(0, my + 6 + 12 * big, 16 * big, 8 * big, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore(); ctx.restore(); };
    return { person, CAST, INK };
  })();
