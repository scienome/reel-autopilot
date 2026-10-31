  // ==================== PILLOW: "Pillow Talk" additions to ADULT (Roxy, Max, the bedroom) ====================
  // Add 'toon/pillow.js' after 'toon/adult.js' in a reel's meta.json libs. Both characters are adults; keep the camera on faces.
  // PILLOW.sheet(ctx, t, o): the bedsheet, drawn after the people, from y = o.y (default 815).
  // PILLOW.floor(ctx, t): clothes on the floor. PILLOW.hook(ctx, t, end, txt): the big opening question, until `end`.
  Object.assign(ADULT.CAST, {
    roxy: { skin: '#d9a07c', sh: '#c08660', hair: '#7a1f2c', top: '#b81f3f', top2: '#8f1630', legs: '#2a2030', shoe: '#2a2030', armCol: '#d9a07c', h: 1.0, girl: true, hs: 'long', outfit: 'slip', hoops: true, eyes: 'half', seed: 360 },
    max: { skin: '#e3b591', sh: '#c99a74', hair: '#23201f', top: '#e3b591', top2: '#c99a74', legs: '#2e3440', shoe: '#2a2a2e', h: 1.06, hs: 'slick', outfit: 'bare', stubble: true, seed: 400 },
  });
  const PILLOW = (() => {
    const { poly, blob, oval, line, INK } = ADULT;
    Object.assign(ADULT.sets, {
      // a dark bedroom: moonlit window, lamp, big headboard. o.lamp = false turns the lamp off, o.off = time the lamp clicks off
      bedroom(ctx, W, H_, t, o = {}) { ctx.fillStyle = '#2a2140'; ctx.fillRect(0, 0, W, H_); ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = '#c8a8e0'; for (let i = 0; i < 9; i++) ctx.fillRect(i * 90, 0, 36, H_); ctx.restore();
        poly(ctx, '#121a3e', [[440, 110], [680, 110], [680, 420], [440, 420]], 501); oval(ctx, '#f2ecd0', 590, 200, 42, 42, 502, 0); line(ctx, [[560, 110], [560, 420]], 6, INK, 503); line(ctx, [[440, 265], [680, 265]], 6, INK, 504);
        blob(ctx, '#7a2a44', [[20, 520], [120, 450], [600, 450], [700, 520], [720, 1000], [0, 1000]], 505); for (let i = 0; i < 4; i++) oval(ctx, '#5e1e34', 120 + i * 160, 560, 11, 11, 506 + i, 3, 8);
        ctx.fillStyle = '#3a2430'; ctx.fillRect(0, 1000, W, 400);
        poly(ctx, '#f2e4d0', [[40, 760], [340, 760], [330, 900], [50, 900]], 511); poly(ctx, '#f2e4d0', [[380, 760], [680, 760], [670, 900], [390, 900]], 512);
        const on = o.lamp !== false && (o.off == null || t < o.off);
        line(ctx, [[60, 760], [60, 620]], 6, INK, 513); poly(ctx, on ? '#ffd98a' : '#6a5a4a', [[10, 530], [110, 530], [130, 620], [-10, 620]], 514);
        if (on) { const g = ctx.createRadialGradient(60, 590, 10, 60, 590, 620); g.addColorStop(0, 'rgba(255,190,110,0.5)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.fillRect(-200, 0, W + 400, H_); } },
    });
    const sheet = (ctx, t, o = {}) => { const y = o.y || 815; blob(ctx, o.col || '#d8d0e0', [[-40, y + 10], [180, y - 8], [360, y + 8], [540, y - 8], [760, y + 10], [760, 1110], [-40, 1110]], 520); for (let i = 0; i < 4; i++) line(ctx, [[60 + i * 170, y + 40], [100 + i * 170, 1090]], 3, 'rgba(60,50,90,0.25)', 521 + i); };
    const floor = (ctx, t) => { blob(ctx, '#b81f3f', [[90, 1050], [250, 1030], [300, 1100], [120, 1130]], 530); blob(ctx, '#2e3440', [[400, 1040], [610, 1040], [640, 1120], [440, 1130]], 531); oval(ctx, '#f2efe6', 320, 1140, 40, 22, 532); };
    const hook = (ctx, t, end, txt) => { if (t > end + 0.25) return; const a = Math.min(1, (end + 0.25 - t) / 0.25); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 66px sans-serif'; ctx.lineJoin = 'round'; txt.split('\n').forEach((l, i, A) => { const s = Math.min(1, 640 / ctx.measureText(l).width); ctx.save(); ctx.translate(360, 210 + i * 82); ctx.scale(s, s); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(l, 0, 0); ctx.fillStyle = i === A.length - 1 ? '#ffd23f' : '#ffffff'; ctx.fillText(l, 0, 0); ctx.restore(); }); ctx.restore(); };
    return { sheet, floor, hook };
  })();

  // ---------- the bold look: sharp graphic adults, heavy ink, neon two-tone light. PILLOW.fig(ctx, who, x, y, s, t, o); y = the waist line + 220 * s ----------
  const BOLD = (() => {
    const INK = '#0b0710', P = { roxy: { skin: '#e8a98a', shade: '#a8446e', hair: '#c4122f', hair2: '#6e0a22', dress: '#120a14', trim: '#e8123f', girl: true }, max: { skin: '#d49a72', shade: '#3f4f9e', hair: '#101018', hair2: '#2a2a48', shirt: '#1a2340', trim: '#35d0e8' } };
    const S = (ctx, fill, pts, lw = 7, stroke = INK) => { const n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; ctx.beginPath(); ctx.moveTo(...m(pts[n - 1], pts[0])); for (let i = 0; i < n; i++) { const q = m(pts[i], pts[(i + 1) % n]); ctx.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]); } ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.stroke(); } };
    const L = (ctx, col, w, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); };
    const Q = (ctx, col, w, a, c, b) => { ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(...c, ...b); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); };
    // two-tone shadow on the far side of a shape
    const tone = (ctx, c, pts, x0, a = 0.75) => { ctx.save(); S(ctx, null, pts, 0); ctx.clip(); ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fillRect(x0, -900, 500, 1100); ctx.restore(); S(ctx, null, pts, 7); };
    const fig = (ctx, who, x, y, s, t, o = {}) => { const c = P[who], f = o.face || {}, girl = !!c.girl; ctx.save(); ctx.translate(x, y + Math.sin(t * 2.2 + x) * 2); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.rotate(o.lean || 0);
      // back hair
      if (girl) S(ctx, c.hair2, [[-150, -700], [-215, -520], [-205, -340], [-120, -300], [120, -300], [205, -340], [215, -520], [150, -700], [0, -760]]);
      // shoulders + arms
      const W = girl ? 118 : 158, TOR = [[-W, -420], [-W + 22, -300], [-W + 34, -200], [W - 34, -200], [W - 22, -300], [W, -420], [50, -456], [-50, -456]];
      if (girl) { S(ctx, c.skin, TOR); tone(ctx, c.shade, TOR, 26); const D = [[-W + 10, -372], [-50, -352], [0, -326], [50, -352], [W - 10, -372], [W - 24, -200], [-W + 24, -200]]; S(ctx, c.dress, D); L(ctx, c.trim, 5, [[-W + 14, -368], [-50, -349], [0, -324], [50, -349], [W - 14, -368]]); for (const sd of [-1, 1]) L(ctx, c.trim, 5, [[sd * (W - 14), -368], [sd * 78, -442]]); Q(ctx, c.shade, 4, [0, -350], [-1, -338], [0, -328]); }
      else { S(ctx, c.skin, TOR); tone(ctx, c.shade, TOR, 44); for (const sd of [-1, 1]) Q(ctx, c.shade, 5, [sd * 8, -345], [sd * 60, -326], [sd * 104, -372]); L(ctx, c.shade, 4, [[0, -340], [0, -210]]); for (const sd of [-1, 1]) S(ctx, c.shirt, [[sd * (W + 8), -432], [sd * 62, -458], [sd * 44, -340], [sd * 72, -200], [sd * (W + 2), -200]]); }
      // the arm that reaches across (o.reach 0..1), otherwise arms stay down
      for (const sd of [-1, 1]) { const col = girl ? c.skin : c.shirt, reach = sd > 0 ? (o.reach || 0) : 0; ctx.save(); ctx.lineCap = 'round'; const sx = sd * (W - 6), hx = sx + sd * (14 + reach * 170), hy = -220 - reach * 90; for (const [lw, cl] of [[58, INK], [44, col]]) { ctx.beginPath(); ctx.moveTo(sx, -408); ctx.quadraticCurveTo(sx + sd * 34, -310, hx, hy); ctx.lineWidth = lw; ctx.strokeStyle = cl; ctx.stroke(); } ctx.restore(); }
      if (o.phone) { ctx.save(); ctx.translate(W - 30, -300); const g = ctx.createRadialGradient(0, 0, 4, 0, 0, 170); g.addColorStop(0, 'rgba(120,220,255,0.65)'); g.addColorStop(1, 'rgba(120,220,255,0)'); ctx.fillStyle = g; ctx.fillRect(-170, -170, 340, 340); ctx.fillStyle = INK; ctx.fillRect(-30, -56, 60, 112); ctx.fillStyle = '#8fe4ff'; ctx.fillRect(-22, -48, 44, 96); ctx.restore(); }
      // neck + head
      const NK = [[-34, -470], [34, -470], [40, -420], [-40, -420]]; S(ctx, c.skin, NK); ctx.save(); ctx.translate(0, -590 + (f.talk ? -Math.abs(Math.sin(t * 6.5)) * 4 : 0)); ctx.rotate((o.tilt || 0) + (f.talk ? Math.sin(t * 6.5) * 0.035 : Math.sin(t * 1.1) * 0.015));
      const FP = girl ? [[-104, -60], [-100, 40], [-62, 118], [0, 158], [62, 118], [100, 40], [104, -60], [58, -128], [-58, -128]] : [[-112, -70], [-116, 50], [-82, 128], [-30, 164], [30, 164], [82, 128], [116, 50], [112, -70], [60, -130], [-60, -130]];
      S(ctx, c.skin, FP); tone(ctx, c.shade, FP, 30, 0.72);
      if (!girl) { ctx.save(); S(ctx, null, FP, 0); ctx.clip(); ctx.fillStyle = 'rgba(16,16,32,0.32)'; ctx.fillRect(-130, 74, 260, 110); ctx.restore(); S(ctx, null, FP, 7); }
      // eyes
      const e = f.eyes || (girl ? 'half' : 'open'), lk = f.look || [0, 0], blink = Math.sin(t * 1.7 + x) > 0.985 && e !== 'closed';
      for (const sd of [-1, 1]) { const ex = sd * 48, ey = -18, wide = e === 'wide', hh = wide ? 30 : e === 'half' ? 15 : 22, ww = 38;
        if (e === 'closed' || blink) { Q(ctx, INK, 8, [ex - ww, ey + 2], [ex, ey + 18], [ex + ww, ey - 2]); if (girl) L(ctx, INK, 7, [[ex + sd * ww, ey + (sd > 0 ? -2 : 2)], [ex + sd * (ww + 18), ey - 14]]); continue; }
        if (e === 'happy') { Q(ctx, INK, 8, [ex - ww, ey + 8], [ex, ey - 22], [ex + ww, ey + 8]); continue; }
        S(ctx, '#fff8f0', [[ex - ww, ey + 6], [ex - 8, ey - hh], [ex + ww, ey + 2], [ex + 6, ey + hh * 0.75]], 6);
        ctx.fillStyle = who === 'roxy' ? '#1fa86a' : '#2860c8'; ctx.beginPath(); ctx.arc(ex + lk[0] * 13, ey + 1 + lk[1] * 7, 15, 0, 7); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lk[0] * 13, ey + 1 + lk[1] * 7, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex + lk[0] * 13 - 4, ey - 4 + lk[1] * 7, 3, 0, 7); ctx.fill();
        L(ctx, INK, girl ? 11 : 7, [[ex - ww, ey + 6], [ex - 8, ey - hh], [ex + ww, ey + 2]]); if (girl) L(ctx, INK, 9, [[ex + sd * ww, ey + 3], [ex + sd * (ww + 22), ey - 14]]);
        const br = e === 'angry' ? [10, -16] : e === 'sad' ? [-16, 8] : e === 'wide' ? [-14, -12] : [-4, -8]; L(ctx, girl ? c.hair2 : INK, girl ? 8 : 13, [[ex - sd * 34, ey - hh - 16 + br[0]], [ex + sd * 36, ey - hh - 16 + br[1]]]); }
      // nose + mouth
      L(ctx, c.shade, 5, [[6, -4], [14, 54], [-6, 60]]);
      let m = f.mouth || 'flat'; if (f.talk) { const ph = Math.floor(t * 11 + x) % 3; m = ph === 0 ? 'open' : ph === 1 ? 'o' : m === 'open' ? 'flat' : m; }
      const my = 104, lip = girl ? '#d60f33' : '#a85a50';
      if (m === 'smile' || m === 'grin') { S(ctx, lip, [[-48, my - 8], [0, my - 2], [48, my - 8], [0, my + 24]], 5); if (m === 'grin') S(ctx, '#fff', [[-34, my - 3], [34, my - 3], [0, my + 12]], 2); }
      else if (m === 'smirk') S(ctx, lip, [[-32, my + 6], [0, my - 2], [50, my - 14], [8, my + 18]], 5);
      else if (m === 'flat') S(ctx, lip, [[-36, my + 2], [0, my - 7], [36, my + 2], [0, my + 11]], 5);
      else if (m === 'frown') S(ctx, lip, [[-38, my + 12], [0, my - 8], [38, my + 12], [0, my + 8]], 5);
      else { const b = m === 'shout' ? 1.45 : m === 'o' ? 0.65 : 1; S(ctx, lip, [[-38 * b, my + 2], [0, my - 12 * b], [38 * b, my + 2], [0, my + 34 * b]], 5); S(ctx, '#2a0612', [[-24 * b, my + 3], [0, my - 3 * b], [24 * b, my + 3], [0, my + 22 * b]], 0); }
      if (f.tears) for (const sd of [-1, 1]) { const k = (t * 0.8 + (sd > 0 ? 0.5 : 0)) % 1; L(ctx, 'rgba(10,8,30,0.55)', 6, [[sd * 58, 4], [sd * 62, 8 + k * 90]]); S(ctx, '#8fe4ff', [[sd * 62, -2 + k * 90], [sd * 72, 18 + k * 90], [sd * 62, 26 + k * 90], [sd * 52, 18 + k * 90]], 3); }
      if (f.sweat) S(ctx, '#8fe4ff', [[-112, -60 + (t * 40) % 40], [-100, -36 + (t * 40) % 40], [-112, -24 + (t * 40) % 40], [-124, -36 + (t * 40) % 40]], 3);
      // top hair
      if (girl) { S(ctx, c.hair, [[-122, 60], [-136, -50], [-92, -150], [10, -176], [108, -142], [134, -50], [118, 40], [84, -78], [24, -112], [-50, -70], [-92, -10]]); Q(ctx, '#ff5a70', 7, [-70, -128], [0, -160], [70, -118]); for (const sd of [-1, 1]) { ctx.lineWidth = 7; ctx.strokeStyle = '#f2c230'; ctx.beginPath(); ctx.arc(sd * 112, 66, 24, 0, 7); ctx.stroke(); } }
      else { S(ctx, c.hair, [[-122, -10], [-132, -96], [-70, -164], [40, -184], [126, -120], [124, -20], [90, -86], [10, -108], [-70, -82]]); Q(ctx, '#4a5aa8', 8, [-60, -140], [10, -168], [80, -128]); }
      ctx.restore(); ctx.restore(); };
    // neon bedroom: magenta and blue, venetian blind stripes
    ADULT.sets.bold = (ctx, W, H_, t, o = {}) => { const on = o.off == null || t < o.off, g = ctx.createLinearGradient(0, 0, W, H_); g.addColorStop(0, on ? '#5a0f4a' : '#1a0a2a'); g.addColorStop(0.55, on ? '#2a0f50' : '#100a24'); g.addColorStop(1, '#090a24'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H_ + 400);
      ctx.save(); ctx.translate(380, 70); ctx.transform(1, 0.12, -0.18, 1, 0, 0); ctx.fillStyle = on ? 'rgba(90,220,255,0.3)' : 'rgba(90,220,255,0.12)'; for (let i = 0; i < 9; i++) ctx.fillRect(0, i * 44, 340, 24); ctx.restore();
      S(ctx, '#2e0820', [[-20, 540], [90, 470], [630, 470], [740, 540], [740, 1040], [-20, 1040]], 8); for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { ctx.fillStyle = '#e8123f55'; ctx.beginPath(); ctx.arc(180 + i * 180, 560 + j * 90, 8, 0, 7); ctx.fill(); }
      S(ctx, '#3a1438', [[40, 780], [340, 760], [340, 900], [40, 900]], 7); S(ctx, '#1e2460', [[380, 760], [680, 780], [680, 900], [380, 900]], 7); ctx.fillStyle = '#07060e'; ctx.fillRect(-200, 1040, W + 400, 400);
      if (on) { const a = ctx.createRadialGradient(0, 520, 10, 0, 520, 520); a.addColorStop(0, 'rgba(255,40,110,0.5)'); a.addColorStop(1, 'rgba(255,40,110,0)'); ctx.fillStyle = a; ctx.fillRect(-200, 0, W + 400, H_); } };
    const sheet = (ctx, t, o = {}) => { const y = o.y || 815; S(ctx, o.col || '#1b1030', [[-60, y + 12], [180, y - 10], [360, y + 12], [540, y - 10], [780, y + 12], [780, 1130], [-60, 1130]], 8); for (let i = 0; i < 4; i++) Q(ctx, 'rgba(255,60,130,0.35)', 5, [50 + i * 170, y + 36], [90 + i * 170, y + 150], [40 + i * 170, 1100]); };
    return { fig, sheet };
  })();
  PILLOW.fig = BOLD.fig; PILLOW.sheet = BOLD.sheet;

  // ---------- the soft 3D look: no ink lines, rounded forms shaded with gradients, rim light, soft shadows (painted on canvas). Overrides PILLOW.fig. ----------
  (() => {
    const P = { roxy: { hi: '#ffd9c2', mid: '#eba988', lo: '#a85a58', hair: ['#ff4a5c', '#b5122f', '#4a0416'], eye: '#22a86c', dress: ['#3a2038', '#180c1c', '#070408'], girl: true }, max: { hi: '#f4c9a4', mid: '#c98e68', lo: '#6a4252', hair: ['#4a4658', '#1c1a24', '#08080e'], eye: '#3a78d8', shirt: ['#46558e', '#222b58', '#0d112c'] } };
    // a soft ball-lit shape: gradient from the lit point, optional rim of coloured light
    const form = (ctx, cols, build, lx, ly, r, rim) => { const g = ctx.createRadialGradient(lx, ly, r * 0.08, lx, ly, r); g.addColorStop(0, cols[0]); g.addColorStop(0.55, cols[1]); g.addColorStop(1, cols[2]); ctx.beginPath(); build(); ctx.fillStyle = g; ctx.fill(); if (rim) { ctx.save(); ctx.clip(); ctx.beginPath(); build(); ctx.lineWidth = 12; ctx.strokeStyle = rim; ctx.filter = 'blur(9px)'; ctx.stroke(); ctx.restore(); } };
    const curve = (pts) => (ctx) => { const n = pts.length, m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; ctx.moveTo(...m(pts[n - 1], pts[0])); for (let i = 0; i < n; i++) { const q = m(pts[i], pts[(i + 1) % n]); ctx.quadraticCurveTo(pts[i][0], pts[i][1], q[0], q[1]); } ctx.closePath(); };
    const soft = (ctx, col, x, y, rx, ry, b = 10) => { ctx.save(); ctx.filter = `blur(${b}px)`; ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); ctx.restore(); };
    const fig = (ctx, who, x, y, s, t, o = {}) => { const c = P[who], f = o.face || {}, girl = !!c.girl, skin = [c.hi, c.mid, c.lo], RIM = 'rgba(90,210,255,0.28)', shape = (pts) => () => curve(pts)(ctx);
      ctx.save(); ctx.translate(x, y + Math.sin(t * 2.2 + x) * 2); ctx.scale(s * (o.flip ? -1 : 1), s); ctx.rotate(o.lean || 0);
      if (girl) form(ctx, c.hair, shape([[-140, -720], [-205, -540], [-214, -350], [-150, -292], [150, -292], [214, -350], [205, -540], [140, -720], [0, -772]]), -60, -640, 460, RIM);
      const W = girl ? 122 : 165, TOR = [[-W, -428], [-W + 18, -310], [-W + 36, -190], [W - 36, -190], [W - 18, -310], [W, -428], [52, -462], [-52, -462]];
      form(ctx, skin, shape(TOR), -40, -420, 330, RIM);
      if (girl) { const D = [[-W + 8, -378], [-52, -350], [0, -318], [52, -350], [W - 8, -378], [W - 26, -190], [-W + 26, -190]]; form(ctx, c.dress, shape(D), -40, -330, 260, 'rgba(255,60,130,0.7)'); soft(ctx, 'rgba(90,40,50,0.28)', 0, -342, 6, 14, 5); for (const sd of [-1, 1]) { ctx.lineWidth = 6; ctx.strokeStyle = '#2a1020'; ctx.beginPath(); ctx.moveTo(sd * (W - 12), -376); ctx.lineTo(sd * 80, -448); ctx.stroke(); } }
      else { for (const sd of [-1, 1]) soft(ctx, 'rgba(90,50,60,0.4)', sd * 56, -344, 54, 26, 9); soft(ctx, 'rgba(90,50,60,0.3)', 0, -270, 8, 62, 6); for (const sd of [-1, 1]) form(ctx, c.shirt, shape([[sd * (W + 10), -436], [sd * 62, -462], [sd * 42, -340], [sd * 74, -190], [sd * (W + 4), -190]]), sd * 110, -410, 260, RIM); }
      for (const sd of [-1, 1]) { const reach = sd > 0 ? (o.reach || 0) : 0, sx = sd * (W - 6), hx = sx + sd * (14 + reach * 170), hy = -210 - reach * 90, g = ctx.createLinearGradient(sx - 30, 0, sx + 30, 0); (girl ? [c.hi, c.mid, c.lo] : c.shirt).forEach((k, i) => g.addColorStop(i / 2, k)); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, -410); ctx.quadraticCurveTo(sx + sd * 34, -310, hx, hy); ctx.lineWidth = 46; ctx.strokeStyle = g; ctx.stroke(); }
      if (o.phone) { ctx.save(); ctx.translate(W - 30, -300); soft(ctx, 'rgba(120,220,255,0.6)', 0, 0, 120, 120, 26); ctx.fillStyle = '#0a0a12'; ctx.beginPath(); ctx.roundRect(-30, -56, 60, 112, 10); ctx.fill(); ctx.fillStyle = '#9fe8ff'; ctx.fillRect(-23, -47, 46, 94); ctx.restore(); }
      form(ctx, skin, shape([[-36, -480], [36, -480], [44, -418], [-44, -418]]), -20, -450, 110); soft(ctx, 'rgba(70,30,40,0.5)', 0, -462, 50, 18, 9);
      ctx.save(); ctx.translate(0, -590 + (f.talk ? -Math.abs(Math.sin(t * 6.5)) * 4 : 0)); ctx.rotate((o.tilt || 0) + (f.talk ? Math.sin(t * 6.5) * 0.035 : Math.sin(t * 1.1) * 0.015));
      const FP = girl ? [[-104, -70], [-102, 30], [-68, 110], [-18, 158], [18, 158], [68, 110], [102, 30], [104, -70], [56, -132], [-56, -132]] : [[-114, -78], [-120, 50], [-90, 130], [-36, 170], [36, 170], [90, 130], [120, 50], [114, -78], [60, -136], [-60, -136]];
      form(ctx, skin, shape(FP), -34, -30, 240, RIM);
      for (const sd of [-1, 1]) soft(ctx, girl ? 'rgba(240,90,110,0.32)' : 'rgba(180,90,80,0.14)', sd * 62, 46, 30, 20, 11);
      if (!girl) { ctx.save(); ctx.beginPath(); curve(FP)(ctx); ctx.clip(); soft(ctx, 'rgba(30,26,40,0.34)', 0, 142, 110, 50, 13); ctx.restore(); }
      const e = f.eyes || (girl ? 'half' : 'open'), lk = f.look || [0, 0], blink = Math.sin(t * 1.7 + x) > 0.985 && e !== 'closed', sm = 'rgba(40,14,30,';
      for (const sd of [-1, 1]) { const ex = sd * 47, ey = -22, wide = e === 'wide', hh = wide ? 40 : e === 'half' ? 24 : 32, ww = 39; soft(ctx, girl ? 'rgba(110,30,90,0.5)' : 'rgba(60,30,40,0.28)', ex, ey - 16, 46, 22, 9);
        if (e === 'closed' || blink || e === 'happy') { ctx.lineCap = 'round'; ctx.lineWidth = girl ? 9 : 7; ctx.strokeStyle = '#180a14'; ctx.beginPath(); ctx.moveTo(ex - ww, ey + 4); ctx.quadraticCurveTo(ex, ey + (e === 'happy' ? -22 : 20), ex + ww, ey + 2); ctx.stroke(); continue; }
        ctx.save(); ctx.beginPath(); ctx.moveTo(ex - ww, ey + 6); ctx.quadraticCurveTo(ex - 6, ey - hh, ex + ww, ey + 2); ctx.quadraticCurveTo(ex, ey + hh * 0.72, ex - ww, ey + 6); ctx.fillStyle = '#fff6ee'; ctx.fill(); ctx.clip();
        const ix = ex + lk[0] * 12, iy = ey + 1 + lk[1] * 6, ig = ctx.createRadialGradient(ix, iy + 6, 2, ix, iy, 22); ig.addColorStop(0, c.eye); ig.addColorStop(0.75, c.eye); ig.addColorStop(1, '#0a1620'); ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(ix, iy, 22, 0, 7); ctx.fill(); ctx.fillStyle = '#05060a'; ctx.beginPath(); ctx.arc(ix, iy, 10, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ix - 6, iy - 7, 5, 0, 7); ctx.fill(); ctx.restore();
        ctx.lineCap = 'round'; ctx.strokeStyle = '#120810'; ctx.lineWidth = girl ? 9 : 5; ctx.beginPath(); ctx.moveTo(ex - ww, ey + 6); ctx.quadraticCurveTo(ex - 6, ey - hh, ex + ww, ey + 2); ctx.stroke(); if (girl) { ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex + sd * ww, ey + 3); ctx.lineTo(ex + sd * (ww + 20), ey - 12); ctx.stroke(); }
        const br = e === 'angry' ? [12, -16] : e === 'sad' ? [-18, 8] : wide ? [-16, -12] : [-4, -9]; ctx.lineWidth = girl ? 7 : 12; ctx.strokeStyle = girl ? '#5a0a1e' : '#14121c'; ctx.beginPath(); ctx.moveTo(ex - sd * 32, ey - hh - 14 + br[0]); ctx.quadraticCurveTo(ex, ey - hh - 26 + (br[0] + br[1]) / 2, ex + sd * 38, ey - hh - 14 + br[1]); ctx.stroke(); }
      soft(ctx, 'rgba(90,40,50,0.5)', 10, 62, 18, 10, 5); soft(ctx, 'rgba(255,240,225,0.7)', -3, 34, 7, 22, 4); soft(ctx, 'rgba(90,40,50,0.28)', 12, 20, 6, 30, 5);
      let m = f.mouth || 'flat'; if (f.talk) { const ph = Math.floor(t * 11 + x) % 3; m = ph === 0 ? 'open' : ph === 1 ? 'o' : m === 'open' ? 'flat' : m; }
      const my = 104, lips = girl ? ['#ff6a80', '#d80f38', '#7a0420'] : ['#d08c7c', '#a8605a', '#6a3a3e'], lipShape = (pts) => form(ctx, lips, shape(pts), -8, my - 6, 56);
      if (m === 'smile' || m === 'grin') { lipShape([[-50, my - 8], [0, my - 3], [50, my - 8], [0, my + 28]]); if (m === 'grin') form(ctx, ['#fff', '#fbf4ea', '#d8cfc4'], shape([[-34, my - 2], [34, my - 2], [0, my + 13]]), 0, my, 40); }
      else if (m === 'smirk') lipShape([[-32, my + 7], [0, my - 3], [52, my - 15], [8, my + 22]]);
      else if (m === 'flat') lipShape([[-38, my + 2], [-10, my - 11], [0, my - 6], [10, my - 11], [38, my + 2], [0, my + 17]]);
      else if (m === 'frown') lipShape([[-40, my + 13], [0, my - 9], [40, my + 13], [0, my + 11]]);
      else { const b = m === 'shout' ? 1.45 : m === 'o' ? 0.65 : 1; lipShape([[-40 * b, my + 2], [0, my - 14 * b], [40 * b, my + 2], [0, my + 38 * b]]); ctx.fillStyle = '#2a0612'; ctx.beginPath(); ctx.ellipse(0, my + 9 * b, 24 * b, 15 * b, 0, 0, 7); ctx.fill(); }
      if (f.tears) for (const sd of [-1, 1]) { const k = (t * 0.8 + (sd > 0 ? 0.5 : 0)) % 1; soft(ctx, 'rgba(160,230,255,0.9)', sd * 60, 8 + k * 90, 8, 13, 2); }
      if (f.sweat) soft(ctx, 'rgba(160,230,255,0.95)', -112, -50 + (t * 40) % 40, 9, 14, 2);
      if (girl) { form(ctx, c.hair, shape([[-124, 70], [-140, -50], [-94, -154], [10, -182], [110, -148], [138, -50], [122, 50], [86, -82], [24, -118], [-52, -74], [-96, -8]]), -40, -130, 300, RIM); soft(ctx, 'rgba(255,190,190,0.5)', -38, -128, 62, 13, 8); for (const sd of [-1, 1]) { ctx.lineWidth = 8; ctx.strokeStyle = '#ffd24a'; ctx.beginPath(); ctx.arc(sd * 112, 70, 24, 0, 7); ctx.stroke(); } }
      else { form(ctx, c.hair, shape([[-124, -12], [-136, -100], [-72, -170], [42, -190], [130, -124], [126, -22], [92, -90], [10, -112], [-72, -86]]), -30, -150, 260, RIM); soft(ctx, 'rgba(180,190,240,0.4)', -26, -146, 58, 11, 7); }
      ctx.restore(); ctx.restore(); };
    // a softer room and a thick soft duvet to match
    const base = ADULT.sets.bold; ADULT.sets.soft = (ctx, W, H_, t, o = {}) => { const on = o.off == null || t < o.off, g = ctx.createLinearGradient(0, 0, W, H_); g.addColorStop(0, on ? '#61154f' : '#1c0b2c'); g.addColorStop(0.6, on ? '#2c1256' : '#100a24'); g.addColorStop(1, '#0a0b28'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H_ + 400);
      ctx.save(); ctx.filter = 'blur(5px)'; ctx.translate(380, 70); ctx.transform(1, 0.12, -0.18, 1, 0, 0); ctx.fillStyle = on ? 'rgba(90,220,255,0.3)' : 'rgba(90,220,255,0.12)'; for (let i = 0; i < 9; i++) ctx.fillRect(0, i * 44, 340, 24); ctx.restore();
      form(ctx, ['#6a1a44', '#3e0e2c', '#180612'], () => curve([[-30, 540], [90, 470], [630, 470], [750, 540], [750, 1040], [-30, 1040]])(ctx), 200, 520, 720); form(ctx, ['#7a4a84', '#4a2458', '#1e0e2c'], () => curve([[30, 790], [90, 750], [300, 750], [350, 800], [340, 910], [30, 910]])(ctx), 150, 780, 300); form(ctx, ['#4a58a8', '#28306e', '#10143a'], () => curve([[370, 800], [420, 750], [630, 750], [690, 790], [690, 910], [380, 910]])(ctx), 470, 780, 300);
      ctx.fillStyle = '#07060e'; ctx.fillRect(-200, 1040, W + 400, 400); if (on) soft(ctx, 'rgba(255,50,120,0.5)', 0, 520, 420, 420, 60); };
    const sheet = (ctx, t, o = {}) => { const y = o.y || 815; form(ctx, ['#54407e', '#2c1c50', '#120a26'], () => curve([[-70, y + 14], [180, y - 12], [360, y + 14], [540, y - 12], [790, y + 14], [790, 1140], [-70, 1140]])(ctx), 200, y + 30, 720, 'rgba(255,90,160,0.5)'); for (let i = 0; i < 4; i++) { ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(12,6,28,0.3)'; ctx.filter = 'blur(9px)'; ctx.beginPath(); ctx.moveTo(50 + i * 170, y + 40); ctx.quadraticCurveTo(90 + i * 170, y + 150, 40 + i * 170, 1100); ctx.stroke(); ctx.filter = 'none'; } };
    PILLOW.fig = fig; PILLOW.sheet = sheet;
  })();
