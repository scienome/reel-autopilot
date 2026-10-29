  // ==================== couch sitcom e001 "The Ring" (v2: cold open, snappier, more animation) ====================
  const BEATS = window.SCRIPT, TM = REEL_TIMING(BEATS), { V, WORDS, DURATION, first } = TM;
  const AP = ADULT.person, AT = ADULT.armsAt;
  const spanOf = (id) => [WORDS[id][0].t, WORDS[id][WORDS[id].length - 1].e];
  const talking = (who, t) => BEATS.some((b) => b.who === who && WORDS[b.id].some((w) => t >= w.t - 0.03 && t <= w.e + 0.03));
  const speaker = (t) => { for (const b of BEATS) { const [a, e] = spanOf(b.id); if (t >= a - 0.1 && t <= e + 0.25) return b.who; } return null; };
  // look at whoever is talking (x of each character in this shot), else straight ahead
  const lookAt = (me, t, xs) => { const s = speaker(t); if (!s || s === me || xs[s] == null) return [0, 0]; return [Math.sign(xs[s] - xs[me]), 0]; };
  const SPK = { sam: ['SAM', '#e6b03a'], maya: ['MAYA', '#ff6a7a'], mum: ['MUM', '#7ad0b0'] };
  const shotCam2 = (ctx, a, b, u) => { const k = H.ease.inOut(u), cx = H.lerp(a[0], b[0], k), cy = H.lerp(a[1], b[1], k), z = H.lerp(a[2], b[2], k); ctx.translate(360, 640); ctx.scale(z, z); ctx.translate(-cx, -cy); };
  const pulse = (t, at, d = 0.35) => { const k = (t - at) / d; return k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI); };
  const MUMBED = (ctx, t, o) => { ADULT.bed(ctx, 470, 1050, t); AP(ctx, 470, 1020, 0.82, Object.assign({ who: 'mum', pose: 'bed', t }, o)); ADULT.blanket(ctx, 470, 1050, t); };
  const HX = { sam: 190, mum: 470, maya: 600 }; // hospital positions
  const RSHOTS = {
    // cold open: the X-ray, then Sam pointing at it
    c1: { set: 'hospital', setOpt: { xray: true }, cam: [[370, 260, 2.8], [330, 640, 1.15]], draw: (ctx, t) => { MUMBED(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat', look: lookAt('mum', t, HX) } });
      AP(ctx, 190, 1250, 0.82, { who: 'sam', t, arms: AT(t, [[0, 'down'], [V('c1', 'ring') - 0.3, 'point']]), face: { eyes: 'wide', mouth: talking('sam', t) ? 'open' : 'o', talk: talking('sam', t), sweat: 1, brows: 0.8 } }); } },
    c2: { set: 'hospital', setOpt: { xray: true }, cam: [[470, 660, 1.7], [470, 650, 1.9]], draw: (ctx, t) => MUMBED(ctx, t, { arms: AT(t, [[0, 'cross'], [V('c2', 'sweetheart') - 0.2, 'hold']]), face: { eyes: 'half', mouth: 'smirk', talk: talking('mum', t), look: [-1, 0] } }) },
    // rewind: the last frame scrubs backwards with tape lines, then the card
    rw: { set: 'hospital', setOpt: { xray: true }, cam: [[360, 700, 1.0], [360, 700, 1.0]], draw: (ctx, t) => MUMBED(ctx, t, { arms: 'hold', face: { eyes: 'half', mouth: 'smirk' } }),
      over: (ctx, W, H_, t) => { const a = first('rw') - 0.1; ctx.save(); ctx.globalAlpha = 0.5; for (let i = 0; i < 9; i++) { const y = ((t * 900 + i * 160) % H_); ctx.fillStyle = i % 2 ? '#ffffff' : '#5af'; ctx.fillRect(0, y, W, 6 + (i % 3) * 4); } ctx.restore(); ctx.fillStyle = 'rgba(40,20,80,0.35)'; ctx.fillRect(0, 0, W, H_);
        const u = popU(t, a + 0.15, 0.3); ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.rotate(-0.04); ADULT.poly(ctx, '#ffd23f', [[-270, -70], [270, -70], [270, 70], [-270, 70]], 500); ctx.fillStyle = ADULT.INK; ctx.font = '900 62px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('6 HOURS EARLIER', 0, 4); ctx.restore(); } },
    s1: { set: 'cafe', cam: [[400, 760, 1.2], [400, 700, 1.7]], draw: (ctx, t) => { const sq = 1 + 0.08 * pulse(t, V('s1', 'doughnut'), 0.3);
      AP(ctx, 400, 1160, 0.9, { who: 'sam', t, squash: sq, arms: AT(t, [[0, 'hips'], [V('s1', 'Ring') - 0.25, 'hold']]), hold: t < V('s1', 'doughnut') ? (t > V('s1', 'Ring') - 0.25 ? 'ring' : null) : 'doughnut', face: { eyes: t > V('s1', 'doughnut') ? 'happy' : 'open', mouth: 'grin', talk: talking('sam', t), look: [0.6, 0.6] } });
      ADULT.poly(ctx, '#c98a5a', [[0, 1000], [720, 1000], [720, 1280], [0, 1280]], 400); },
      over: (ctx, W, H_, t) => { if (t > V('s1', 'doughnut')) for (let i = 0; i < 5; i++) FX.sparkle(ctx, 470 + Math.cos(i * 1.3 + t * 3) * 90, 600 + Math.sin(i * 1.7 + t * 3) * 60, 18, t * 4 + i); } },
    // living room: Sam walks in proud, Maya on the sofa takes the doughnut, then hands it to Mum
    m1: { set: 'living', cam: [[370, 760, 1.05], [370, 770, 1.14]], draw: (ctx, t) => { const a = first('m1') - 0.1, gave = t > V('m1', 'have') - 0.15, wk = H.clamp((t - a) / 0.9), LX = { maya: 170, sam: 120 + 300 * H.ease.out(wk), mum: 590 };
      AP(ctx, 590, 1130, 0.8, { who: 'mum', t, arms: AT(t, [[0, 'cross'], [V('m1', 'have') - 0.3, 'hold']]), hold: gave ? 'doughnut' : null, face: { eyes: gave ? 'open' : 'half', mouth: gave ? 'smile' : 'flat', look: lookAt('mum', t, LX) } });
      AP(ctx, LX.sam, 1160, 0.82, { who: 'sam', t, walk: wk < 1 ? t * 9 : null, arms: AT(t, [[0, 'hold'], [V('m1', 'Mum') - 0.1, 'up']]), hold: t < V('m1', 'Babe') ? 'doughnut' : null, face: { eyes: t > V('m1', 'Mum') - 0.1 ? 'wide' : 'happy', mouth: t > V('m1', 'Mum') - 0.1 ? 'o' : 'grin', sweat: t > V('m1', 'Mum') ? 1 : 0, look: lookAt('sam', t, LX) } });
      AP(ctx, 170, 1150, 0.8, { who: 'maya', pose: 'sit', t, arms: AT(t, [[0, 'down'], [V('m1', 'Babe') - 0.1, 'hold'], [V('m1', 'Diet') - 0.2, 'facepalm'], [V('m1', 'Mum') - 0.15, 'point']]), hold: t > V('m1', 'Babe') - 0.1 && t < V('m1', 'Diet') - 0.2 ? 'doughnut' : null,
        face: { eyes: t > V('m1', 'Ugh') ? 'closed' : 'wide', mouth: 'smile', talk: talking('maya', t), look: [1, 0] } }); } },
    mu1: { set: 'living', cam: [[590, 760, 2.1], [590, 760, 2.5]], shake: V('mu1', 'Crunchy'), draw: (ctx, t) => AP(ctx, 590, 1130, 0.8, { who: 'mum', t, squash: 1 - 0.06 * pulse(t, V('mu1', 'Crunchy'), 0.25), arms: AT(t, [[0, 'hold'], [V('mu1', 'Crunchy'), 'down']]), hold: t < V('mu1', 'Mm') ? 'doughnut' : null, face: { eyes: 'closed', mouth: talking('mum', t) ? 'open' : 'chew' } }),
      over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'CRUNCH!', 360, 960, popU(t, V('mu1', 'Crunchy'), 0.25)) },
    s2: { set: 'living', cam: [[400, 700, 2.4], [400, 690, 3.2]], shake: first('s2'), draw: (ctx, t) => AP(ctx, 400, 1160, 0.82, { who: 'sam', t, squash: 1 + 0.12 * pulse(t, first('s2'), 0.3), arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', brows: 1, sweat: 1 } }) },
    mu2: { set: 'hospital', setOpt: { xray: true }, cam: [[300, 640, 1.3], [330, 640, 1.45]], draw: (ctx, t) => MUMBED(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu2', 'Thursday') - 0.2, 'shrug']]), face: { eyes: 'half', mouth: 'smirk', talk: talking('mum', t), look: [-1, 0] } }) },
    // Sam drops to one knee on "asking"
    s3: { set: 'hospital', setOpt: { xray: true }, cam: [[330, 760, 1.15], [320, 770, 1.25]], draw: (ctx, t) => { const kneel = t > V('s3', 'asking') - 0.15;
      MUMBED(ctx, t, { arms: 'cross', face: { eyes: kneel ? 'open' : 'half', mouth: 'flat', look: [-1, 0.4] } });
      AP(ctx, 190, 1250, 0.82, { who: 'sam', t, pose: kneel ? 'kneel' : 'stand', bob: kneel ? 18 * pulse(t, V('s3', 'asking') - 0.15, 0.25) : 0, arms: kneel ? 'hold' : 'down', face: { eyes: 'open', mouth: 'smile', brows: 0.8, talk: talking('sam', t), look: [1, -0.5] } }); } },
    mu3: { set: 'hospital', setOpt: { xray: true }, cam: [[470, 640, 2.0], [470, 640, 2.35]], draw: (ctx, t) => MUMBED(ctx, t, { arms: 'down', tilt: -0.08, face: { eyes: t > V('mu3', "You're") - 0.2 ? 'sad' : 'open', mouth: 'smile', talk: talking('mum', t), brows: 0.6, look: [-0.8, 0.2] } }),
      over: (ctx, W, H_) => { const g = ctx.createRadialGradient(360, 560, 200, 360, 640, 760); g.addColorStop(0, 'rgba(255,190,120,0)'); g.addColorStop(1, 'rgba(255,170,90,0.4)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); } },
    // Maya runs in from the right crying; Sam jumps up
    m2: { set: 'hospital', setOpt: { xray: true }, cam: [[360, 700, 1.0], [360, 700, 1.06]], draw: (ctx, t) => { const a = first('m2') - 0.45, k = H.clamp((t - a) / 0.55);
      MUMBED(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smile', look: [1, 0] } });
      AP(ctx, 190, 1250, 0.82, { who: 'sam', t, pose: 'kneel', bob: -24 * Math.abs(Math.sin(t * 8)) * (t > first('m2') ? 1 : 0), arms: 'up', face: { eyes: 'happy', mouth: 'grin' } });
      AP(ctx, 780 - 180 * H.ease.out(k), 1230, 0.82, { who: 'maya', t, walk: k < 1 ? t * 12 : null, arms: 'cheeks', face: { eyes: 'sad', mouth: 'open', tears: 1, blush: 1, talk: talking('maya', t), look: [-1, 0] } }); },
      over: (ctx, W, H_, t) => { for (let i = 0; i < 7; i++) { const u = t - first('m2') - i * 0.12; if (u > 0) FX.heart(ctx, 160 + i * 70, 760 - u * 160, 50 * popU(t, first('m2') + i * 0.12, 0.3), Math.sin(u * 3 + i) * 0.2); } } },
    mu4: { set: 'hospital', setOpt: { xray: true }, cam: [[470, 660, 1.6], [470, 650, 2.0]], draw: (ctx, t) => MUMBED(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu4', 'text') - 0.3, 'hold']]), hold: t > V('mu4', 'text') - 0.3 ? 'phone' : null, face: { eyes: t > V('mu4', 'arrives') ? 'closed' : 'half', mouth: 'smirk', talk: talking('mum', t), look: [-0.4, 0] } }) },
    n3: { set: 'hospital', setOpt: { xray: true }, cam: [[360, 700, 1.0], [360, 700, 1.0]], draw: (ctx, t) => { MUMBED(ctx, t, { arms: 'hold', hold: 'phone', face: { eyes: 'half', mouth: 'smirk' } });
      AP(ctx, 190, 1250, 0.82, { who: 'sam', pose: 'kneel', t, arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }); AP(ctx, 610, 1230, 0.82, { who: 'maya', t, arms: 'hips', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }); },
      over: (ctx, W, H_, t) => { const u = popU(t, first('n3'), 0.35); if (u <= 0) return; ctx.fillStyle = `rgba(0,0,0,${0.35 * u})`; ctx.fillRect(0, 0, W, H_); ctx.save(); ctx.translate(360, 560); ctx.scale(u, u); ctx.rotate(-0.05); ADULT.poly(ctx, '#e8384f', [[-220, -80], [220, -80], [220, 80], [-220, 80]], 510); ctx.fillStyle = '#fff'; ctx.font = '900 92px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PART 2?', 0, 6); ctx.restore(); } },
  };
  const SH = BEATS.map((b, i) => [b.id, i ? first(b.id) - 0.06 : 0]);
  const shotAt = makeShotAt(SH, DURATION);
  const subLine = (ctx, W, H_, t) => { let cur = null; for (const b of BEATS) { const [a, e] = spanOf(b.id); if (t >= a - 0.05 && t <= e + 0.4) cur = b; } if (!cur || cur.id === 'rw' || cur.id === 'n3') return;
    const txt = cur.phrases.join(' '), nm = SPK[cur.who]; ctx.save(); ctx.font = '800 38px sans-serif'; const lines = []; let ln = ''; for (const w of txt.split(' ')) { const tt = ln ? ln + ' ' + w : w; if (ctx.measureText(tt).width > 600 && ln) { lines.push(ln); ln = w; } else ln = tt; } lines.push(ln);
    const y0 = 1150 - lines.length * 48; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    if (nm) { ctx.font = '900 30px sans-serif'; ctx.lineWidth = 8; ctx.strokeStyle = ADULT.INK; ctx.strokeText(nm[0], 360, y0 - 40); ctx.fillStyle = nm[1]; ctx.fillText(nm[0], 360, y0 - 40); }
    ctx.font = '800 38px sans-serif'; lines.forEach((l, i) => { ctx.lineWidth = 9; ctx.strokeStyle = ADULT.INK; ctx.strokeText(l, 360, y0 + i * 48); ctx.fillStyle = nm ? '#ffffff' : '#ffd23f'; ctx.fillText(l, 360, y0 + i * 48); }); ctx.restore(); };
  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t), sp = RSHOTS[name], u = H.clamp((t - a) / Math.max(0.01, b - a));
    ctx.save(); const sh = sp.shake != null && t > sp.shake ? 14 * Math.max(0, 1 - (t - sp.shake) * 2.5) : 0; ctx.translate(sh * Math.sin(t * 70), sh * Math.cos(t * 53));
    shotCam2(ctx, sp.cam[0], sp.cam[1], u); ADULT.sets[sp.set](ctx, 720, 1280, t, sp.setOpt || {}); sp.draw(ctx, t); ctx.restore();
    ADULT.light(ctx, W, H_);
    if (sp.over) sp.over(ctx, W, H_, t);
    subLine(ctx, W, H_, t);
    const cut = t - a; if (cut >= 0 && cut < 0.08 && a > 0) { ctx.fillStyle = `rgba(255,255,255,${0.25 * (1 - cut / 0.08)})`; ctx.fillRect(0, 0, W, H_); } };
  function scoreSound(k) {
    SH.slice(1).forEach(([, s]) => k.play('whoosh', s, { dur: 0.16, gain: 0.22, minor: true }));
    k.play('sparkle', V('s1', 'doughnut'), { gain: 0.35 }); k.play('impact', V('mu1', 'Crunchy'), { gain: 0.5 }); k.play('riser', first('s2') - 0.3, { dur: 0.3, gain: 0.3 });
    k.play('thud', V('s3', 'asking') - 0.1, { gain: 0.35 }); COUCH.sounds.twist(k, V('m2', 'Yes')); COUCH.sounds.heart(k, first('m2'), 5); k.play('stamp', first('n3'), { gain: 0.45 });
  }
  window.LESSON = { BEATS, DURATION, CAPS: [], SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
