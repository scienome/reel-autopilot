  // ==================== SITCOM: the shared harness for couch sitcom episodes (toon/adult.js look) ====================
  // SITCOM(build, o): build(h) returns { <beat id>: shot }. Each shot cuts in at that beat's first word; a beat with no shot of its own
  // stays on the shot before it. shot = { set, setOpt, cam: [[cx, cy, zoom] at the start, [cx, cy, zoom] at the end], shake: time,
  //   draw(ctx, t) (in set space, 720 x 1280), over(ctx, W, H_, t) (on screen, after the light) }.
  // h = { V, first, WORDS, talking(who, t), lookAt(me, t, xs), pulse(t, at, d), char(ctx, who, x, y, s, t, o, xs), AP: ADULT.person, AT: ADULT.armsAt,
  //   timeCard(ctx, W, H_, t, at, txt), partTwo(ctx, W, H_, t, at) }.
  // o = { spk: { who: [LABEL, colour] }, noSub: [beat ids with no subtitle], sound(k, h) (extra sounds; every cut already whooshes) }.
  const SITCOM = (build, o = {}) => {
    const BEATS = window.SCRIPT, TM = REEL_TIMING(BEATS), { V, WORDS, DURATION, first } = TM;
    const spanOf = (id) => [WORDS[id][0].t, WORDS[id][WORDS[id].length - 1].e];
    const talking = (who, t) => BEATS.some((b) => b.who === who && WORDS[b.id].some((w) => t >= w.t - 0.03 && t <= w.e + 0.03));
    const speaker = (t) => { for (const b of BEATS) { const [a, e] = spanOf(b.id); if (t >= a - 0.1 && t <= e + 0.25) return b.who; } return null; };
    // look at whoever is talking (x of each character in this shot), else straight ahead
    const lookAt = (me, t, xs) => { const s = speaker(t); if (!s || s === me || xs[s] == null) return [0, 0]; return [Math.sign(xs[s] - xs[me]), 0]; };
    const pulse = (t, at, d = 0.35) => { const k = (t - at) / d; return k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI); };
    // a yellow time card ("6 HOURS EARLIER") and the red end card
    const timeCard = (ctx, W, H_, t, at, txt) => { const u = popU(t, at, 0.3); if (u <= 0) return; ctx.save(); ctx.translate(360, 560); ctx.scale(u, u); ctx.rotate(-0.04); ctx.font = '900 62px sans-serif'; const w = ctx.measureText(txt).width / 2 + 50;
      ADULT.poly(ctx, '#ffd23f', [[-w, -70], [w, -70], [w, 70], [-w, 70]], 500); ctx.fillStyle = ADULT.INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
    const partTwo = (ctx, W, H_, t, at, txt = 'PART 2?') => { const u = popU(t, at, 0.35); if (u <= 0) return; ctx.fillStyle = `rgba(0,0,0,${0.35 * u})`; ctx.fillRect(0, 0, W, H_); ctx.save(); ctx.translate(360, 560); ctx.scale(u, u); ctx.rotate(-0.05);
      ADULT.poly(ctx, '#e8384f', [[-220, -80], [220, -80], [220, 80], [-220, 80]], 510); ctx.fillStyle = '#fff'; ctx.font = '900 92px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 6); ctx.restore(); };
    // a character with the face defaults filled in: the mouth flaps on their lines, eyes on whoever talks (xs = x of each character in the shot)
    const char = (ctx, who, x, y, s, t, o = {}, xs) => ADULT.person(ctx, x, y, s, Object.assign({ who, t }, o, { face: Object.assign({ talk: talking(who, t), look: xs ? lookAt(who, t, xs) : [0, 0] }, o.face || {}) }));
    const h = { V, first, WORDS, talking, lookAt, pulse, spanOf, char, AP: ADULT.person, AT: ADULT.armsAt, timeCard, partTwo };
    const SHOTS = build(h), SPK = Object.assign({ sam: ['SAM', '#e6b03a'], maya: ['MAYA', '#ff6a7a'], mum: ['MUM', '#7ad0b0'], dad: ['DAD', '#c8a07a'], friend: ['DANNY', '#4ad0a0'], doc: ['DOCTOR', '#8ab4ff'] }, o.spk || {}), noSub = o.noSub || [];
    const SH = BEATS.filter((b) => SHOTS[b.id]).map((b, i) => [b.id, i ? first(b.id) - 0.06 : 0]);
    const shotAt = makeShotAt(SH, DURATION);
    const shotCam = (ctx, a, b, u) => { const k = H.ease.inOut(u), cx = H.lerp(a[0], b[0], k), cy = H.lerp(a[1], b[1], k), z = H.lerp(a[2], b[2], k); ctx.translate(360, 640); ctx.scale(z, z); ctx.translate(-cx, -cy); };
    const subLine = (ctx, t) => { let cur = null; for (const b of BEATS) { const [a, e] = spanOf(b.id); if (t >= a - 0.05 && t <= e + 0.4) cur = b; } if (!cur || noSub.includes(cur.id)) return;
      const txt = cur.phrases.join(' '), nm = SPK[cur.who]; ctx.save(); ctx.font = '800 38px sans-serif'; const lines = []; let ln = ''; for (const w of txt.split(' ')) { const tt = ln ? ln + ' ' + w : w; if (ctx.measureText(tt).width > 600 && ln) { lines.push(ln); ln = w; } else ln = tt; } lines.push(ln);
      const y0 = 1150 - lines.length * 48; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      if (nm) { ctx.font = '900 30px sans-serif'; ctx.lineWidth = 8; ctx.strokeStyle = ADULT.INK; ctx.strokeText(nm[0], 360, y0 - 40); ctx.fillStyle = nm[1]; ctx.fillText(nm[0], 360, y0 - 40); }
      ctx.font = '800 38px sans-serif'; lines.forEach((l, i) => { ctx.lineWidth = 9; ctx.strokeStyle = ADULT.INK; ctx.strokeText(l, 360, y0 + i * 48); ctx.fillStyle = nm ? '#ffffff' : '#ffd23f'; ctx.fillText(l, 360, y0 + i * 48); }); ctx.restore(); };
    const STORY = (ctx, W, H_, t) => {
      const [name, a, b] = shotAt(t), sp = SHOTS[name], u = H.clamp((t - a) / Math.max(0.01, b - a));
      ctx.save(); const sh = sp.shake != null && t > sp.shake ? 14 * Math.max(0, 1 - (t - sp.shake) * 2.5) : 0; ctx.translate(sh * Math.sin(t * 70), sh * Math.cos(t * 53));
      shotCam(ctx, sp.cam[0], sp.cam[1] || sp.cam[0], u); ADULT.sets[sp.set](ctx, 720, 1280, t, sp.setOpt || {}); if (sp.draw) sp.draw(ctx, t); ctx.restore();
      ADULT.light(ctx, W, H_);
      if (sp.over) sp.over(ctx, W, H_, t);
      subLine(ctx, t);
      const cut = t - a; if (cut >= 0 && cut < 0.08 && a > 0) { ctx.fillStyle = `rgba(255,255,255,${0.25 * (1 - cut / 0.08)})`; ctx.fillRect(0, 0, W, H_); } };
    const scoreSound = (k) => { SH.slice(1).forEach(([, s]) => k.play('whoosh', s, { dur: 0.16, gain: 0.22, minor: true })); if (o.sound) o.sound(k, h); };
    window.LESSON = { BEATS, DURATION, CAPS: [], SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
    window.scoreSound = scoreSound;
  };
