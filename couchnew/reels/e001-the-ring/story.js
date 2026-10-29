  // ==================== couch sitcom e001 "The Ring" (adult-cartoon look, one voice per character) ====================
  const BEATS = window.SCRIPT, TM = REEL_TIMING(BEATS), { V, WORDS, DURATION, first } = TM;
  const AP = ADULT.person, WHO = Object.fromEntries(BEATS.map((b) => [b.id, b.who]));
  const spanOf = (id) => [WORDS[id][0].t, WORDS[id][WORDS[id].length - 1].e];
  // is this character speaking right now? (the mouth flaps only while their own words play)
  const talking = (who, t) => BEATS.some((b) => b.who === who && WORDS[b.id].some((w) => t >= w.t - 0.03 && t <= w.e + 0.03));
  const SPK = { sam: ['SAM', '#e6b03a'], maya: ['MAYA', '#ff6a7a'], mum: ['MUM', '#7ad0b0'] };
  // the scene camera: world 720x1280, cam = [cx, cy, zoom] at the start and end of the shot
  const shotCam2 = (ctx, a, b, u) => { const k = H.ease.inOut(u), cx = H.lerp(a[0], b[0], k), cy = H.lerp(a[1], b[1], k), z = H.lerp(a[2], b[2], k); ctx.translate(360, 640); ctx.scale(z, z); ctx.translate(-cx, -cy); };
  const RSHOTS = {
    n1: { set: 'cafe', cam: [[360, 700, 1], [400, 760, 1.3]], draw: (ctx, t) => { AP(ctx, 400, 1160, 0.9, { who: 'sam', t, arms: 'hold', hold: t < V('n1', 'doughnut') ? 'ring' : 'doughnut', face: { eyes: 'open', mouth: 'smirk', look: [0.6, 0.4] } }); ADULT.poly(ctx, '#c98a5a', [[0, 1000], [720, 1000], [720, 1280], [0, 1280]], 400); } },
    sam1: { set: 'cafe', cam: [[400, 680, 2.0], [400, 670, 2.3]], draw: (ctx, t) => AP(ctx, 400, 1160, 0.9, { who: 'sam', t, arms: 'hold', hold: 'doughnut', face: { eyes: t > V('sam1', 'Perfect') - 0.2 ? 'happy' : 'open', mouth: 'grin', talk: talking('sam', t), look: [0, -0.6] } }) },
    maya1: { set: 'living', cam: [[370, 760, 1.05], [370, 770, 1.12]], draw: (ctx, t) => { const gave = t > V('maya1', 'have') - 0.1;
      AP(ctx, 590, 1130, 0.8, { who: 'mum', t, arms: gave ? 'hold' : 'cross', hold: gave ? 'doughnut' : null, face: { eyes: gave ? 'open' : 'half', mouth: 'smile', look: [-1, 0] } });
      AP(ctx, 400, 1160, 0.82, { who: 'sam', t, arms: t > V('maya1', 'Mum') ? 'up' : 'down', face: { eyes: t > V('maya1', 'Mum') ? 'wide' : 'open', mouth: t > V('maya1', 'Mum') ? 'o' : 'smile', sweat: t > V('maya1', 'Mum') ? 1 : 0, look: [-1, 0] } });
      AP(ctx, 170, 1150, 0.8, { who: 'maya', pose: 'sit', t, arms: gave ? 'point' : 'hold', hold: gave ? null : 'doughnut', face: { eyes: t > V('maya1', 'Wait') ? 'half' : 'wide', mouth: 'smile', talk: talking('maya', t) } }); } },
    mum1: { set: 'living', cam: [[590, 760, 2.1], [590, 760, 2.4]], shake: V('mum1', 'Crunchy'), draw: (ctx, t) => AP(ctx, 590, 1130, 0.8, { who: 'mum', t, arms: 'hold', hold: t < V('mum1', 'Mm') ? 'doughnut' : null, face: { eyes: 'closed', mouth: talking('mum', t) ? 'open' : 'chew' } }),
      over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'CRUNCH!', 360, 960, popU(t, V('mum1', 'Crunchy'), 0.25)) },
    sam2: { set: 'living', cam: [[400, 700, 2.6], [400, 700, 3.1]], shake: first('sam2'), draw: (ctx, t) => AP(ctx, 400, 1160, 0.82, { who: 'sam', t, arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', brows: 1, sweat: 1 } }) },
    n2: { set: 'hospital', setOpt: { xray: false }, cam: [[360, 640, 1], [400, 660, 1.1]], draw: (ctx, t) => { ADULT.bed(ctx, 450, 1050, t); AP(ctx, 450, 1020, 0.82, { who: 'mum', pose: 'bed', t, arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }); ADULT.blanket(ctx, 450, 1050, t); AP(ctx, 150, 1230, 0.8, { who: 'sam', t, arms: 'down', face: { eyes: 'open', mouth: 'frown', sweat: 1 } }); },
      over: (ctx, W, H_, t) => { const u = popU(t, first('n2'), 0.3); if (u <= 0) return; ctx.save(); ctx.translate(360, 900); ctx.scale(u, u); ctx.rotate(-0.04); ADULT.poly(ctx, '#ffd23f', [[-250, -60], [250, -60], [250, 60], [-250, 60]], 500); ctx.fillStyle = ADULT.INK; ctx.font = '900 56px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('4 HOURS LATER', 0, 4); ctx.restore(); } },
    mum2: { set: 'hospital', setOpt: { xray: true }, cam: [[300, 640, 1.35], [330, 640, 1.5]], draw: (ctx, t) => { ADULT.bed(ctx, 450, 1050, t); AP(ctx, 450, 1020, 0.82, { who: 'mum', pose: 'bed', t, arms: t > V('mum2', 'Thursday') - 0.2 ? 'point' : 'cross', face: { eyes: 'half', mouth: 'smirk', talk: talking('mum', t), look: [-1, 0] } }); ADULT.blanket(ctx, 450, 1050, t); } },
    sam3: { set: 'hospital', setOpt: { xray: true }, cam: [[330, 760, 1.15], [320, 760, 1.25]], draw: (ctx, t) => { ADULT.bed(ctx, 470, 1050, t); AP(ctx, 470, 1020, 0.82, { who: 'mum', pose: 'bed', t, arms: 'cross', face: { eyes: 'half', mouth: 'flat', look: [-1, 0.4] } }); ADULT.blanket(ctx, 470, 1050, t);
      AP(ctx, 170, 1250, 0.82, { who: 'sam', pose: 'kneel', t, arms: 'hold', face: { eyes: 'open', mouth: 'smile', brows: 0.8, talk: talking('sam', t), look: [1, -0.5] } }); } },
    mum3: { set: 'hospital', setOpt: { xray: true }, cam: [[470, 640, 2.0], [470, 640, 2.3]], draw: (ctx, t) => { ADULT.bed(ctx, 470, 1050, t); AP(ctx, 470, 1020, 0.82, { who: 'mum', pose: 'bed', t, arms: 'down', face: { eyes: t > V('mum3', "You're") - 0.2 ? 'sad' : 'open', mouth: 'smile', talk: talking('mum', t), brows: 0.6, look: [-0.8, 0.2] } }); ADULT.blanket(ctx, 470, 1050, t); },
      over: (ctx, W, H_) => { const g = ctx.createRadialGradient(360, 560, 200, 360, 640, 760); g.addColorStop(0, 'rgba(255,190,120,0)'); g.addColorStop(1, 'rgba(255,170,90,0.35)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); } },
    maya2: { set: 'hospital', setOpt: { xray: true }, cam: [[360, 700, 1.0], [360, 700, 1.05]], draw: (ctx, t) => { ADULT.bed(ctx, 470, 1050, t); AP(ctx, 470, 1020, 0.82, { who: 'mum', pose: 'bed', t, arms: 'cross', face: { eyes: 'half', mouth: 'smile' } }); ADULT.blanket(ctx, 470, 1050, t);
      AP(ctx, 170, 1250, 0.82, { who: 'sam', pose: 'kneel', t, arms: 'up', face: { eyes: 'happy', mouth: 'grin' } });
      const k = H.clamp((t - first('maya2') + 0.4) / 0.5); AP(ctx, 760 - 150 * H.ease.out(k), 1230, 0.82, { who: 'maya', t, arms: 'cheeks', face: { eyes: 'sad', mouth: 'open', tears: 1, blush: 1, talk: talking('maya', t) } }); },
      over: (ctx, W, H_, t) => { for (let i = 0; i < 7; i++) { const u = t - first('maya2') - i * 0.12; if (u > 0) FX.heart(ctx, 160 + i * 70, 760 - u * 160, 50 * popU(t, first('maya2') + i * 0.12, 0.3), Math.sin(u * 3 + i) * 0.2); } } },
    mum4: { set: 'hospital', setOpt: { xray: true }, cam: [[470, 660, 1.6], [470, 650, 1.9]], draw: (ctx, t) => { ADULT.bed(ctx, 470, 1050, t); AP(ctx, 470, 1020, 0.82, { who: 'mum', pose: 'bed', t, arms: 'hold', hold: 'phone', face: { eyes: 'half', mouth: 'smirk', talk: talking('mum', t), look: [-0.4, 0] } }); ADULT.blanket(ctx, 470, 1050, t); } },
    n3: { set: 'hospital', setOpt: { xray: true }, cam: [[360, 700, 1.0], [360, 700, 1.0]], draw: (ctx, t) => { ADULT.bed(ctx, 470, 1050, t); AP(ctx, 470, 1020, 0.82, { who: 'mum', pose: 'bed', t, arms: 'hold', hold: 'phone', face: { eyes: 'half', mouth: 'smirk' } }); ADULT.blanket(ctx, 470, 1050, t);
      AP(ctx, 170, 1250, 0.82, { who: 'sam', pose: 'kneel', t, arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }); AP(ctx, 610, 1230, 0.82, { who: 'maya', t, arms: 'hips', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }); },
      over: (ctx, W, H_, t) => { const u = popU(t, first('n3'), 0.35); if (u <= 0) return; ctx.fillStyle = `rgba(0,0,0,${0.35 * u})`; ctx.fillRect(0, 0, W, H_); ctx.save(); ctx.translate(360, 560); ctx.scale(u, u); ctx.rotate(-0.05); ADULT.poly(ctx, '#e8384f', [[-220, -80], [220, -80], [220, 80], [-220, 80]], 510); ctx.fillStyle = '#fff'; ctx.font = '900 92px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PART 2?', 0, 6); ctx.restore(); } },
  };
  const SH = BEATS.map((b, i) => [b.id, i ? first(b.id) - 0.06 : 0]);
  const shotAt = makeShotAt(SH, DURATION);
  // subtitles: the line being spoken, with the speaker's name; the narrator is yellow, no name
  const subLine = (ctx, W, H_, t) => { let cur = null; for (const b of BEATS) { const [a, e] = spanOf(b.id); if (t >= a - 0.05 && t <= e + 0.5) cur = b; } if (!cur) return;
    const txt = cur.phrases.join(' '), nm = SPK[cur.who]; ctx.save(); ctx.font = '800 38px sans-serif'; const lines = []; let ln = ''; for (const w of txt.split(' ')) { const tt = ln ? ln + ' ' + w : w; if (ctx.measureText(tt).width > 600 && ln) { lines.push(ln); ln = w; } else ln = tt; } lines.push(ln);
    const y0 = 1150 - lines.length * 48; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if (nm) { ctx.font = '900 30px sans-serif'; ctx.lineWidth = 8; ctx.strokeStyle = ADULT.INK; ctx.strokeText(nm[0], 360, y0 - 40); ctx.fillStyle = nm[1]; ctx.fillText(nm[0], 360, y0 - 40); }
    ctx.font = '800 38px sans-serif'; lines.forEach((l, i) => { ctx.lineWidth = 9; ctx.strokeStyle = ADULT.INK; ctx.strokeText(l, 360, y0 + i * 48); ctx.fillStyle = nm ? '#ffffff' : '#ffd23f'; ctx.fillText(l, 360, y0 + i * 48); }); ctx.restore(); };
  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t), sp = RSHOTS[name], u = H.clamp((t - a) / Math.max(0.01, b - a));
    ctx.save(); const sh = sp.shake != null && t > sp.shake ? 14 * Math.max(0, 1 - (t - sp.shake) * 2.5) : 0; ctx.translate(sh * Math.sin(t * 70), sh * Math.cos(t * 53));
    shotCam2(ctx, sp.cam[0], sp.cam[1], u); ADULT.sets[sp.set](ctx, 720, 1280, t, sp.setOpt || {}); sp.draw(ctx, t); ctx.restore();
    if (sp.over) sp.over(ctx, W, H_, t);
    subLine(ctx, W, H_, t);
    const cut = t - a; if (cut >= 0 && cut < 0.08 && a > 0) { ctx.fillStyle = `rgba(255,255,255,${0.25 * (1 - cut / 0.08)})`; ctx.fillRect(0, 0, W, H_); } };
  function scoreSound(k) {
    SH.slice(1).forEach(([, s]) => k.play('whoosh', s, { dur: 0.18, gain: 0.25, minor: true }));
    k.play('sparkle', V('n1', 'ring'), { gain: 0.35 }); k.play('impact', V('mum1', 'Crunchy'), { gain: 0.5 }); k.play('riser', first('sam2') - 0.3, { dur: 0.3, gain: 0.3 });
    COUCH.sounds.twist(k, V('maya2', 'Yes')); COUCH.sounds.heart(k, first('maya2'), 5); k.play('stamp', first('n3'), { gain: 0.45 });
  }
  window.LESSON = { BEATS, DURATION, CAPS: [], SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
