  // Anatomy: the cubital fossa, dissected layer by layer (9:16). Right arm, anterior view: LATERAL is the viewer's left.
  const BEATS = window.SCRIPT;
  const ST = (b) => BEAT0(b) - 0.12;
  const SH = BEATS.map((b, i) => [b.id, i ? ST(b.id) : 0]);
  const shotAt = (t) => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return { name: SH[k][0], t0: SH[k][1], t1: k + 1 < SH.length ? SH[k + 1][1] : DURATION }; };
  const after = (b) => SH.findIndex((s) => s[0] === b);
  const C = { skin: '#e8b48e', skinD: '#c98e68', fat: '#f2d27a', fascia: 'rgba(236,236,226,0.78)', apo: 'rgba(250,250,240,0.92)', muscle: '#b8443c', muscleD: '#8e2e2a', floor: '#8a3a46',
    vein: '#3d5fbf', artery: '#e0302a', nerve: '#f4d84a', tendon: '#eeeadc', bone: '#efe6cf', ink: '#1a1c22', hi: '#ffd24a' };
  // smooth path through points
  const curve = (ctx, pts) => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]); };
  const vessel = (ctx, pts, col, w, u = 1, glow = 0) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, u); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (glow) { ctx.shadowColor = col; ctx.shadowBlur = 24 * glow; } ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = w + 4; curve(ctx, pts); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = w; curve(ctx, pts); ctx.stroke(); ctx.shadowBlur = 0; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = w * 0.25; curve(ctx, pts.map(([x, y]) => [x - w * 0.18, y])); ctx.stroke(); ctx.restore(); };
  const blob = (ctx, pts, fill, u = 1, stri = 0) => { if (u <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, u); curve(ctx, pts.concat([pts[0]])); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stri) { ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,0.13)'; ctx.lineWidth = 2; for (let i = -30; i < 30; i++) { ctx.beginPath(); ctx.moveTo(360 + i * 14 - 300 * stri, 0); ctx.lineTo(360 + i * 14 + 300 * stri, 1280); ctx.stroke(); } } ctx.restore(); };
  const label = (ctx, ax, ay, tx, ty, txt, col, u) => { if (u <= 0) return; const e = H.clamp(u * 1.6); ctx.save(); ctx.globalAlpha = Math.min(1, u * 2); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + (tx - ax) * e, ay + (ty - ay) * e); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ax, ay, 5, 0, TAU); ctx.fill();
    ctx.font = FONT(800, 25); const w = ctx.measureText(txt).width + 22, left = tx < ax; ctx.translate(left ? tx : tx - w, ty - 19); ctx.fillStyle = 'rgba(16,18,24,0.88)'; ctx.beginPath(); ctx.roundRect(0, 0, w, 38, 10); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(0, 0, 6, 38); ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 14, 20); ctx.restore(); };
  const pill = (ctx, x, y, txt, u, bg = 'rgba(16,18,24,0.9)', col = '#ffd24a', px = 30) => { if (u <= 0) return; const s = H.ease.back(H.clamp(u)); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.font = FONT(800, px); const w = ctx.measureText(txt).width + 34, h = px * 1.55; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 2); ctx.restore(); };
  // ---- the anatomy (screen coordinates, 720 x 1280) ----
  const ARM = [[205, 170], [515, 170], [530, 430], [560, 590], [540, 700], [500, 900], [478, 1150], [242, 1150], [218, 900], [180, 700], [168, 590], [195, 430]];
  const EPI_L = [182, 600], EPI_M = [548, 590], APEX = [362, 835];
  const brachiorad = [[200, 380], [262, 440], [292, 600], [338, 760], [362, 835], [330, 1000], [290, 1150], [235, 1150], [205, 900], [185, 700], [180, 560]];
  const pronator = [[548, 585], [500, 640], [430, 720], [362, 835], [318, 930], [345, 960], [420, 860], [520, 720], [556, 640]];
  const biceps = [[285, 170], [430, 170], [420, 420], [380, 580], [352, 640], [330, 600], [300, 420]];
  const brachialis = [[262, 470], [452, 470], [450, 600], [402, 700], [330, 700], [282, 600]];
  const supinator = [[290, 700], [352, 690], [372, 770], [338, 810], [300, 760]];
  const TENDON = [[350, 600], [352, 680], [346, 760], [338, 820]], APO = [[352, 640], [400, 660], [470, 700], [525, 740], [500, 790], [420, 730], [360, 700]];
  const ARTERY = [[392, 170], [390, 400], [382, 600], [372, 760], [364, 818]], RADIAL_A = [[364, 818], [330, 900], [300, 1000], [270, 1150]], ULNAR_A = [[364, 818], [400, 900], [430, 1000], [452, 1150]];
  const MEDIAN = [[432, 170], [430, 400], [416, 600], [398, 760], [372, 900], [366, 1150]];
  const RADIAL_N = [[250, 170], [262, 400], [280, 600], [300, 700], [292, 820], [262, 1000], [252, 1150]];
  const CEPHALIC = [[208, 170], [205, 430], [205, 600], [218, 760], [235, 950], [255, 1150]], BASILIC = [[468, 380], [505, 500], [520, 620], [500, 800], [470, 950], [455, 1150]];
  const MCV = [[222, 760], [300, 700], [400, 640], [508, 590]];
  const LACN = [[322, 620], [282, 720], [250, 850], [242, 1000]], MACN = [[486, 420], [500, 560], [492, 720], [478, 900]];
  const drawArm = (ctx, t, sh) => {
    const ix = after(sh.name), past = (b) => ix >= after(b), at = (b) => sh.name === b;
    const tSkin = ST('skin'), open = ramp(t, tSkin + 1.2, 1.4); // the skin flaps slide open
    const veinsU = past('veins') ? (past('bounds') ? 1 - ramp(t, ST('bounds'), 0.8) : 1) : 0;
    const roofU = past('roof') ? (past('bounds') ? 1 - ramp(t, ST('bounds'), 0.8) : ramp(t, ST('roof'), 0.8)) : 0;
    // deep layer: floor, muscles, bone hints
    blob(ctx, ARM, '#7a2c30');
    blob(ctx, brachialis, C.floor, 1, 0.1); blob(ctx, supinator, '#7a3058', 1, -0.4);
    const hiFloor = at('floor') ? 0.5 + 0.5 * Math.sin(t * 6) : 0;
    if (hiFloor) { blob(ctx, brachialis, C.hi, 0.4 * hiFloor); blob(ctx, supinator, C.hi, 0.4 * hiFloor); }
    blob(ctx, biceps, C.muscle, 1, 0.05);
    vessel(ctx, TENDON, C.tendon, 22);
    // contents (deep), highlighted in order during "contents"
    const cU = (w) => (past('contents') ? 1 : 0.85), hi = (w) => (at('contents') && t > V('contents', w) - 0.12 ? 1 : at('mnemonic') ? 0.6 : 0);
    vessel(ctx, RADIAL_N, C.nerve, 9, cU(), hi('RADIAL'));
    vessel(ctx, MEDIAN, C.nerve, 11, cU(), hi('MEDIAN'));
    const split = past('split') ? ramp(t, V('split', 'DIVIDES'), 1.2) : past('cta') ? 1 : 0;
    vessel(ctx, ARTERY, C.artery, 15, 1, hi('BRACHIAL') + (at('split') ? 0.5 + 0.5 * Math.sin(t * 8) : 0));
    vessel(ctx, RADIAL_A, C.artery, 11, Math.max(0.55, split), at('split') ? split : 0); vessel(ctx, ULNAR_A, C.artery, 11, Math.max(0.55, split), at('split') ? split : 0);
    ctx.save(); ctx.globalAlpha = 0.9; blob(ctx, brachiorad, C.muscle, 1, 0.25); blob(ctx, pronator, C.muscleD, 1, -0.5); ctx.restore();
    const hb = sh.name === 'bounds'; if (hb && t > V('bounds', 'BRACHIORADIALIS')) { blob(ctx, brachiorad, C.hi, 0.32); } if (hb && t > V('bounds', 'PRONATOR')) { blob(ctx, pronator, C.hi, 0.32); }
    vessel(ctx, TENDON, C.tendon, 22); // the tendon sits on top, in the fossa
    if (hi('BICEPS')) vessel(ctx, TENDON, C.hi, 26, 0.45);
    // the triangle (boundaries)
    if (past('bounds')) { const u = ramp(t, V('bounds', 'LINE'), 0.6); ctx.save(); ctx.strokeStyle = C.hi; ctx.lineWidth = 6; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(EPI_L[0], EPI_L[1]); ctx.lineTo(EPI_L[0] + (EPI_M[0] - EPI_L[0]) * u, EPI_L[1] + (EPI_M[1] - EPI_L[1]) * u); ctx.stroke();
      if (t > V('bounds', 'BRACHIORADIALIS')) { ctx.beginPath(); ctx.moveTo(262, 600); ctx.lineTo(APEX[0], APEX[1]); ctx.stroke(); }
      if (t > V('bounds', 'PRONATOR')) { ctx.beginPath(); ctx.moveTo(530, 600); ctx.lineTo(APEX[0], APEX[1]); ctx.stroke(); } ctx.restore();
      [EPI_L, EPI_M].forEach(([x, y]) => { ctx.fillStyle = C.bone; ctx.beginPath(); ctx.arc(x, y, 14, 0, TAU); ctx.fill(); }); }
    // roof: deep fascia + bicipital aponeurosis
    if (roofU > 0) { ctx.save(); ctx.globalAlpha = roofU; blob(ctx, [[188, 470], [535, 470], [548, 760], [362, 900], [180, 760]], C.fascia); blob(ctx, APO, C.apo); ctx.restore(); }
    // superficial: fat layer, veins, cutaneous nerves
    if (veinsU > 0) { ctx.save(); ctx.globalAlpha = veinsU; blob(ctx, ARM, 'rgba(242,210,122,0.28)');
      const vg = (w) => (at('veins') && t > V('veins', w) - 0.1 ? 1 : 0);
      vessel(ctx, CEPHALIC, C.vein, 16, 1, vg('CEPHALIC')); vessel(ctx, BASILIC, C.vein, 16, 1, vg('BASILIC')); vessel(ctx, MCV, C.vein, 14, past('veins') ? 1 : 0, vg('MEDIAN'));
      const ng = past('nerves') ? ramp(t, ST('nerves'), 0.6) : 0; vessel(ctx, LACN, C.nerve, 6, ng, at('nerves') ? 1 : 0); vessel(ctx, MACN, C.nerve, 6, ng, at('nerves') ? 1 : 0); ctx.restore(); }
    // skin: two flaps that slide apart after the incision
    if (open < 1) { const dx = open * 300; [[-1, 0, 360], [1, 360, 720]].forEach(([sd, x0, x1]) => { ctx.save(); ctx.beginPath(); ctx.rect(x0 + sd * dx, 0, x1 - x0, 1280); ctx.clip(); ctx.translate(sd * dx, 0); ctx.globalAlpha = 1 - open * 0.6; blob(ctx, ARM, C.skin); ctx.strokeStyle = 'rgba(150,90,70,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(250, 640); ctx.quadraticCurveTo(360, 660, 480, 630); ctx.stroke(); ctx.restore(); });
      if (t > tSkin) { const u = ramp(t, tSkin + 0.1, 1.0); ctx.save(); ctx.strokeStyle = '#a01818'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(360, 330); ctx.lineTo(360, 330 + 640 * u); ctx.stroke();
        const sy = 330 + 640 * u; ctx.translate(372, sy - 40); ctx.rotate(0.5); ctx.fillStyle = '#c8ccd4'; ctx.fillRect(-6, -90, 12, 70); ctx.fillStyle = '#e8ecf2'; ctx.beginPath(); ctx.moveTo(-6, -20); ctx.lineTo(6, -20); ctx.lineTo(0, 22); ctx.fill(); ctx.restore(); } }
  };
  const LABELS = [
    // [shot it appears in (and stays until), anchor x, y, text x, y, text, colour, word that pops it]
    ['veins', 207, 520, 40, 470, 'Cephalic v.', C.vein, ['veins', 'CEPHALIC'], 'roof'], ['veins', 516, 560, 690, 500, 'Basilic v.', C.vein, ['veins', 'BASILIC'], 'roof'], ['veins', 360, 668, 690, 700, 'Median cubital v.', C.vein, ['veins', 'MEDIAN'], 'roof'],
    ['nerves', 262, 800, 40, 860, 'Lat. antebrachial cut. n.', C.nerve, ['nerves', 'LATERAL'], 'roof'], ['nerves', 494, 650, 690, 610, 'Med. antebrachial cut. n.', C.nerve, ['nerves', 'MEDIAL'], 'roof'],
    ['roof', 470, 720, 690, 760, 'Bicipital aponeurosis', '#ffffff', ['roof', 'BICIPITAL'], 'bounds'], ['roof', 250, 520, 40, 470, 'Deep fascia', '#ffffff', ['roof', 'DEEP'], 'bounds'],
    ['bounds', 240, 520, 40, 420, 'Brachioradialis (lateral)', C.muscle, ['bounds', 'BRACHIORADIALIS'], 'floor'], ['bounds', 470, 690, 690, 650, 'Pronator teres (medial)', C.muscle, ['bounds', 'PRONATOR'], 'floor'], ['bounds', 362, 835, 690, 900, 'Apex', C.hi, ['bounds', 'APEX'], 'floor'], ['bounds', 365, 597, 690, 540, 'Inter-epicondylar line', C.hi, ['bounds', 'LINE'], 'floor'],
    ['floor', 420, 520, 690, 470, 'Brachialis', C.floor, ['floor', 'BRACHIALIS'], 'contents'], ['floor', 330, 760, 40, 800, 'Supinator', '#7a3058', ['floor', 'SUPINATOR'], 'contents'],
    ['contents', 285, 640, 40, 560, 'Radial nerve', C.nerve, ['contents', 'RADIAL'], 'split'], ['contents', 350, 700, 40, 660, 'Biceps tendon', C.tendon, ['contents', 'BICEPS'], 'split'], ['contents', 380, 650, 690, 560, 'Brachial artery', C.artery, ['contents', 'BRACHIAL'], 'split'], ['contents', 414, 610, 690, 640, 'Median nerve', C.nerve, ['contents', 'MEDIAN'], 'split'],
    ['split', 300, 1000, 40, 1040, 'Radial a.', C.artery, ['split', 'RADIAL'], 'cta'], ['split', 430, 1000, 690, 1040, 'Ulnar a.', C.artery, ['split', 'ULNAR'], 'cta'],
  ];
  const STAGE = { hook: 'THE CUBITAL FOSSA', skin: 'INCISION', veins: 'SUPERFICIAL VEINS', nerves: 'CUTANEOUS NERVES', roof: 'ROOF', bounds: 'BOUNDARIES', floor: 'FLOOR', contents: 'CONTENTS (LAT → MED)', mnemonic: 'MNEMONIC', split: 'BRACHIAL ARTERY DIVIDES', cta: 'SAVE FOR YOUR EXAM' };
  const EXPLAIN = (ctx, W, H_, t) => {
    const sh = shotAt(t), ix = after(sh.name);
    const g = ctx.createRadialGradient(W / 2, H_ * 0.5, 40, W / 2, H_ * 0.55, H_ * 0.75); g.addColorStop(0, '#2f6b62'); g.addColorStop(1, '#0f2a28'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    // camera: a slow push towards the fossa while dissecting, out again for the summary
    const z = sh.name === 'hook' ? 0.9 + 0.1 * ramp(t, 0, 3) : sh.name === 'cta' ? 1 - 0.05 * ramp(t, sh.t0, 1.5) : 1.04, oy = 30;
    ctx.save(); ctx.translate(W / 2, H_ * 0.52 + oy); ctx.scale(z * 0.86, z * 0.86); ctx.translate(-360, -640);
    drawArm(ctx, t, sh);
    for (const [sb, ax, ay, tx, ty, txt, col, [wb, ww], until] of LABELS) { if (ix < after(sb) || ix >= after(until)) continue; label(ctx, ax, ay, tx, ty, txt, col, ramp(t, V(wb, ww) - 0.12, 0.35)); }
    ctx.restore();
    // orientation tags, stage title, caption
    ctx.font = FONT(800, 22); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.textAlign = 'left'; ctx.fillText('LATERAL', 24, H_ * 0.95); ctx.textAlign = 'right'; ctx.fillText('MEDIAL', W - 24, H_ * 0.95); ctx.textAlign = 'center'; ctx.fillText('RIGHT ARM · ANTERIOR VIEW', W / 2, H_ * 0.95);
    pill(ctx, W / 2, H_ * 0.075, STAGE[sh.name], ramp(t, sh.t0, 0.25), 'rgba(214,50,40,0.95)', '#fff', 32);
    if (sh.name === 'mnemonic') { const ws = [['R', 'eally', 'RADIAL NERVE'], ['N', 'eed', ''], ['B', 'eer', 'BICEPS'], ['T', 'o', 'TENDON'], ['B', 'e', 'BRACHIAL'], ['A', 't', 'ARTERY'], ['M', 'y', 'MEDIAN'], ['N', 'icest', 'NERVE']];
      ctx.save(); ctx.fillStyle = 'rgba(16,18,24,0.6)'; ctx.fillRect(0, 0, W, H_); ctx.restore();
      ws.forEach(([a, b], i) => { const u = ramp(t, sh.t0 + 0.3 * i, 0.3); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; ctx.font = FONT(900, 54); ctx.textAlign = 'left'; const y = H_ * 0.24 + i * 62; ctx.fillStyle = C.hi; ctx.fillText(a, 90, y); ctx.fillStyle = '#fff'; ctx.fillText(b, 134, y); ctx.restore(); });
      [['RADIAL NERVE', C.nerve], ['BICEPS TENDON', C.tendon], ['BRACHIAL ARTERY', C.artery], ['MEDIAN NERVE', C.nerve]].forEach(([s2, col], i) => { const u = ramp(t, sh.t0 + 2.4 + i * 0.25, 0.3); if (u <= 0) return; ctx.save(); ctx.globalAlpha = u; ctx.font = FONT(800, 30); ctx.textAlign = 'left'; ctx.fillStyle = col; ctx.fillText('→ ' + s2, 420 - 30 * (1 - u), H_ * 0.27 + i * 124); ctx.restore(); }); }
    // caption: the current spoken words (bottom band)
    const cap = captionAt(WORDS, t); if (cap && sh.name !== 'mnemonic') { const i = WORDS.indexOf(cap), chunk = WORDS.slice(Math.floor(i / 4) * 4, Math.floor(i / 4) * 4 + 4).map((x) => x.w).join(' '); ctx.save(); ctx.font = FONT(800, 34); const cw = ctx.measureText(chunk).width; if (cw > W * 0.9) ctx.font = FONT(800, Math.floor(34 * (W * 0.9) / cw)); ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = '#101216'; ctx.strokeText(chunk, W / 2, H_ * 0.15); ctx.fillStyle = '#fff'; ctx.fillText(chunk, W / 2, H_ * 0.15); ctx.restore(); }
    let flash = 0; if (sh.name === 'skin') flash = 0.1 * Math.exp(-Math.pow((t - ST('skin') - 0.2) * 6, 2));
    finish(ctx, W, H_, t, flash);
  };
  function scoreSound(k) {
    for (const [, t0] of SH.slice(1)) k.play('whoosh', t0 - 0.05, { dur: 0.35, gain: 0.25, minor: true });
    k.play('swish', ST('skin') + 0.1, { dur: 1.0, gain: 0.45 }); k.play('paper', ST('skin') + 1.2, { gain: 0.4 });
    for (const l of LABELS) k.play('pop', V(l[8][0], l[8][1]), { f: 640, gain: 0.3, minor: true });
    k.play('stamp', V('bounds', 'APEX'), { gain: 0.4 }); for (let i = 0; i < 8; i++) k.play('tick', ST('mnemonic') + 0.3 * i, { f: 1400 + i * 60, gain: 0.3 });
    k.play('riser', V('split', 'DIVIDES') - 0.4, { dur: 0.4, gain: 0.35 }); k.play('success', V('split', 'DIVIDES'), { f: 'C6', gain: 0.45 }); k.play('ding', ST('cta'), { f: 'E6', gain: 0.4 });
  }
  window.LESSON = { BEATS, DURATION, SH, WORDS, MEASURED: REEL_WORDS.measured, explainer: (ctx, W, H_, t) => EXPLAIN(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
