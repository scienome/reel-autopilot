  // ==================== KATHA: the shared harness for Hindi mythology episodes (kit/myth.js look) ====================
  // KATHA(build, o): build(h) returns { <beat id>: shot }. Each shot cuts in at that beat's first word; a beat with no shot of
  // its own stays on the shot before it. shot = { set, setOpt, cam: [[cx, cy, zoom] at the start, [cx, cy, zoom] at the end],
  //   shake: time, draw(ctx, t) (in set space, 720 x 1280), over(ctx, W, H_, t) (on screen, after the light) }.
  // h = { V(beat, hindiWord, n) (time just before that word; punctuation ignored), at(beat, i) (the i-th word, from 0), first,
  //   talking(who, t), pulse(t, at, d), char(ctx, who, x, y, s, t, o) (MYTH.person with talking mouths), AT: MYTH.armsAt,
  //   card(ctx, W, H_, t, at, txt, o), partTwo(ctx, W, H_, t, at, txt) }.
  // o = { series: 'रावण के रहस्य', part: 1, hook: 'रावण ने शनि देव को\nसीढ़ी बना दिया!' (the scroll-stopper: huge text from frame 0
  //   until the first beat ends, with the series tag; the first beat's subtitle is hidden meanwhile), next: 'next part's hook'
  //   (the "अगले भाग में" card at the end, from the beat `nextAt` = 'end'), title: 'old-style gold banner (if no hook)', spk: { who: [LABEL, colour] }, gold: [words shown in gold],
  //   noSub: [beat ids without a subtitle], sound(k, h) (extra synth sounds; every cut already whooshes) }.
  const KATHA = (build, o = {}) => {
    const BEATS = window.SCRIPT, TM = REEL_TIMING(BEATS), { WORDS, DURATION, first } = TM;
    const clean = (w) => w.replace(/[\s.,!?;:"'“”‘’()…।॥\-–—]/g, '');
    const RAW = {}; BEATS.forEach((b) => { RAW[b.id] = b.phrases.flatMap((p) => (typeof p === 'string' ? p : p[0]).split(/\s+/).filter(Boolean)); });
    const V = (id, word, n = 1) => { let k = 0; const ws = RAW[id] || []; for (let i = 0; i < ws.length; i++) if (clean(ws[i]) === clean(word) && ++k === n) return WORDS[id][i].t - 0.12; throw new Error('script has no word "' + word + '" in beat ' + id); };
    const at = (id, i) => { const ws = WORDS[id]; if (!ws || !ws.length) throw new Error('no beat ' + id); return ws[Math.max(0, Math.min(ws.length - 1, i < 0 ? ws.length + i : i))].t - 0.12; };
    const spanOf = (id) => [WORDS[id][0].t, WORDS[id][WORDS[id].length - 1].e];
    const talking = (who, t) => BEATS.some((b) => b.who === who && WORDS[b.id].some((w) => t >= w.t - 0.03 && t <= w.e + 0.03));
    const pulse = (t, a, d = 0.35) => { const k = (t - a) / d; return k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI); };
    const partTwo = (ctx, W, H_, t, a, txt = 'भाग 2?') => { const u = popU(t, a, 0.35); if (u <= 0) return; ctx.fillStyle = `rgba(20,4,0,${0.4 * u})`; ctx.fillRect(0, 0, W, H_); MYTH.card(ctx, W, H_, t, a, txt, { size: 96, y: 320 }); };
    const char = (ctx, who, x, y, s, t, oo = {}) => MYTH.person(ctx, x, y, s, Object.assign({ who, t }, oo, { face: Object.assign({ talk: talking(oo.as || who, t) }, oo.face || {}) }));
    // shortcuts: cameras, one / two characters, a card on a word
    const CAM = { wide: [[360, 790, 1.0], [360, 770, 1.1]], mid: [[360, 800, 1.3], [360, 780, 1.45]], close: (x = 360) => [[x, 700, 1.9], [x, 690, 2.15]], push: [[360, 800, 1.0], [360, 720, 1.5]] };
    const one = (who, oo = {}, x = 360, s = 0.85, y = 1170) => (ctx, t) => char(ctx, who, x, y, s, t, typeof oo === 'function' ? oo(t) : oo);
    const two = (a, ao = {}, b, bo = {}, s = 0.72) => (ctx, t) => { char(ctx, a, 210, 1170, s, t, typeof ao === 'function' ? ao(t) : ao); char(ctx, b, 510, 1170, s, t, Object.assign({ flip: true }, typeof bo === 'function' ? bo(t) : bo)); };
    const cardOn = (beat, word, txt, oo = {}) => (ctx, W, H_, t) => MYTH.card(ctx, W, H_, t, typeof word === 'number' ? at(beat, word) : V(beat, word), txt, Object.assign({ y: 320, size: 62 }, oo));
    const h = { V, at, first, WORDS, RAW, talking, pulse, spanOf, char, AT: MYTH.armsAt, card: MYTH.card, partTwo, CAM, one, two, cardOn };
    const SHOTS = build(h), SPK = Object.assign({ hanuman: ['हनुमान', '#ff9a3c'], balhanuman: ['हनुमान', '#ff9a3c'], krishna: ['कृष्ण', '#7ab4ff'], balkrishna: ['कान्हा', '#7ab4ff'], rama: ['श्री राम', '#7ad0e0'],
      shiva: ['महादेव', '#b8d4f0'], parvati: ['माता पार्वती', '#ff8a9a'], sita: ['माता सीता', '#ffb070'], ganesha: ['गणेश', '#ffb08a'], indra: ['इंद्र', '#ffe08a'], vayu: ['पवन देव', '#cfe8ff'], brahma: ['ब्रह्मा', '#ffd0a0'],
      ravana: ['रावण', '#ff6a5a'], arjuna: ['अर्जुन', '#f0f0f0'], yashoda: ['माँ यशोदा', '#8ae0b0'], sage: ['ऋषि', '#ffb060'], asura: ['असुर', '#a8e070'], shani: ['शनि देव', '#9ab0ff'], kumbhakarna: ['कुंभकर्ण', '#ff8a5a'], saraswati: ['माता सरस्वती', '#fff3c0'], barbarik: ['बर्बरीक', '#ffd070'], mandodari: ['मंदोदरी', '#ff8ac0'],
      vali: ['बाली', '#f4c060'], kubera: ['कुबेर', '#ffe08a'], sahasrabahu: ['सहस्रबाहु', '#ffb08a'], meghnad: ['मेघनाद', '#d0a0ff'], lakshman: ['लक्ष्मण', '#ffd090'], vedavati: ['वेदवती', '#ffb070'], rambha: ['रंभा', '#ff9ac8'], nalakubara: ['नलकूबर', '#9ad0ff'],
      jaya: ['जय', '#ffe08a'], kumara: ['सनत्कुमार', '#ffb070'], shurpanakha: ['शूर्पणखा', '#ff8ac0'], nandi: ['नंदी', '#f4f0e0'], ghatotkach: ['घटोत्कच', '#ff9a6a'], karna: ['कर्ण', '#ffd070'], bhima: ['भीम', '#ffb070'],
      draupadi: ['द्रौपदी', '#ff8a9a'], drona: ['द्रोणाचार्य', '#f0f0f0'], ekalavya: ['एकलव्य', '#a8e070'], abhimanyu: ['अभिमन्यु', '#fff0c0'], iravan: ['इरावन', '#7ae0d0'], ulupi: ['उलूपी', '#7ae0d0'], duryodhana: ['दुर्योधन', '#d0a0ff'],
      yuyutsu: ['युयुत्सु', '#b0e090'], vikarna: ['विकर्ण', '#d0a0ff'], babruvahana: ['बभ्रुवाहन', '#90e0a0'], shikhandi: ['शिखंडी', '#ff9ac8'], amba: ['अंबा', '#ff8a9a'], bhishma: ['भीष्म', '#f4f4f4'], bhagadatta: ['भगदत्त', '#9ad0ff'],
      jarasandha: ['जरासंध', '#ff8a6a'], shalya: ['शल्य', '#9ad0ff'], vidura: ['विदुर', '#f4f4f0'], yama: ['यमराज', '#9ae0c0'], ashwatthama: ['अश्वत्थामा', '#9ae8ff'], dhritarashtra: ['धृतराष्ट्र', '#ffe08a'], arjuna: ['अर्जुन', '#f0f0f0'] }, o.spk || {}), noSub = o.noSub || [], GOLDW = (o.gold || []).map(clean);
    const SH = BEATS.filter((b) => SHOTS[b.id]).map((b, i) => [b.id, i ? first(b.id) - 0.06 : 0]);
    const shotAt = makeShotAt(SH, DURATION);
    const shotCam = (ctx, a, b, u) => { const k = H.ease.inOut(u), cx = H.lerp(a[0], b[0], k), cy = H.lerp(a[1], b[1], k), z = H.lerp(a[2], b[2], k); ctx.translate(360, 640); ctx.scale(z, z); ctx.translate(-cx, -cy); };
    // the hook: series tag + 2 huge lines, popped in at frame 0 and held until the first beat is over
    const hookEnd = o.hook ? spanOf(BEATS[0].id)[1] + 0.35 : 0;
    const hookCard = (ctx, W, t) => { if (!o.hook || t > hookEnd + 0.3) return; const a = Math.min(1, (hookEnd + 0.3 - t) / 0.3), u = t < 0.02 ? 1 : popU(t + 0.25, 0, 0.3); ctx.save(); ctx.globalAlpha = a;
      const lines = o.hook.split('\n'); ctx.font = '74px "Yatra One", "Noto Sans Devanagari", sans-serif'; const w = Math.min(330, Math.max(...lines.map((l) => ctx.measureText(l).width)) / 2 + 40), y0 = 250, hh = lines.length * 92 + 40;
      ctx.translate(W / 2, y0); ctx.scale(u, u); ctx.rotate(-0.025);
      ctx.fillStyle = 'rgba(120,10,10,0.94)'; ctx.strokeStyle = MYTH.GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-w, -40, w * 2, hh, 20); ctx.fill(); ctx.stroke();
      if (o.series) { const tag = o.series + (o.part ? ' • भाग ' + o.part : ''); ctx.font = '700 30px "Noto Sans Devanagari", sans-serif'; const tw = ctx.measureText(tag).width / 2 + 24; ctx.fillStyle = MYTH.GOLD; ctx.beginPath(); ctx.roundRect(-tw, -64, tw * 2, 46, 23); ctx.fill(); ctx.fillStyle = '#4a0a06'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tag, 0, -40); }
      ctx.font = '74px "Yatra One", "Noto Sans Devanagari", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      lines.forEach((l, i) => { const fs = Math.min(74, 74 * 600 / Math.max(1, ctx.measureText(l).width)); ctx.font = `${fs}px "Yatra One", "Noto Sans Devanagari", sans-serif`; ctx.fillStyle = i === lines.length - 1 ? '#ffd23f' : '#ffffff'; ctx.fillText(l, 0, 30 + i * 92); });
      ctx.restore(); };
    // the next-part teaser card (from the start of beat o.nextAt, default 'end')
    const nextCard = (ctx, W, H_, t) => { if (!o.next || !WORDS[o.nextAt || 'end']) return; const at0 = first(o.nextAt || 'end'); const u = popU(t, at0, 0.35); if (u <= 0) return;
      ctx.save(); ctx.translate(W / 2, 300); ctx.scale(u, u); const lines = o.next.split('\n'); ctx.font = '54px "Yatra One", "Noto Sans Devanagari", sans-serif'; const w = Math.min(330, Math.max(...lines.map((l) => ctx.measureText(l).width)) / 2 + 40), hh = lines.length * 70 + 40;
      ctx.fillStyle = 'rgba(30,6,4,0.92)'; ctx.strokeStyle = MYTH.GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-w, -30, w * 2, hh, 18); ctx.fill(); ctx.stroke();
      const tag = 'अगले भाग में ▶'; ctx.font = '700 30px "Noto Sans Devanagari", sans-serif'; const tw = ctx.measureText(tag).width / 2 + 24; ctx.fillStyle = '#e8384f'; ctx.beginPath(); ctx.roundRect(-tw, -54, tw * 2, 46, 23); ctx.fill(); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(tag, 0, -30);
      lines.forEach((l, i) => { const fs = Math.min(54, 54 * 600 / Math.max(1, ctx.measureText(l).width)); ctx.font = `${fs}px "Yatra One", "Noto Sans Devanagari", sans-serif`; ctx.fillStyle = i === lines.length - 1 ? '#ffd23f' : '#ffffff'; ctx.fillText(l, 0, 32 + i * 70); });
      ctx.restore(); };
    const FONT = '700 42px "Noto Sans Devanagari", sans-serif', LH = 58;
    const subLine = (ctx, t) => { let cur = null; for (const b of BEATS) { const [a, e] = spanOf(b.id); if (t >= a - 0.05 && t <= e + 0.4) cur = b; } if (!cur || noSub.includes(cur.id) || (o.hook && cur.id === BEATS[0].id)) return;
      const ws = RAW[cur.id], nm = SPK[cur.who]; ctx.save(); ctx.font = FONT; const sp = ctx.measureText(' ').width; const lines = []; let ln = [], lw = 0;
      for (const w of ws) { const ww = ctx.measureText(w).width; if (ln.length && lw + sp + ww > 620) { lines.push([ln, lw]); ln = []; lw = 0; } lw += (ln.length ? sp : 0) + ww; ln.push(w); } lines.push([ln, lw]);
      const y0 = 1100 - lines.length * LH; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      if (nm) { ctx.font = '700 32px "Noto Sans Devanagari", sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 9; ctx.strokeStyle = '#1a0804'; ctx.strokeText(nm[0], 360, y0 - 46); ctx.fillStyle = nm[1]; ctx.fillText(nm[0], 360, y0 - 46); }
      ctx.font = FONT; ctx.textAlign = 'left';
      lines.forEach(([l, w], i) => { let x = 360 - w / 2; const y = y0 + i * LH; for (const word of l) { ctx.lineWidth = 10; ctx.strokeStyle = '#1a0804'; ctx.strokeText(word, x, y); ctx.fillStyle = GOLDW.includes(clean(word)) ? '#ffc83a' : nm ? '#fff3d6' : '#ffffff'; ctx.fillText(word, x, y); x += ctx.measureText(word).width + sp; } });
      ctx.restore(); };
    const STORY = (ctx, W, H_, t) => {
      const [name, a, b] = shotAt(t), sp = SHOTS[name], u = H.clamp((t - a) / Math.max(0.01, b - a));
      ctx.save(); const sh = sp.shake != null && t > sp.shake ? 16 * Math.max(0, 1 - (t - sp.shake) * 2.5) : 0; ctx.translate(sh * Math.sin(t * 70), sh * Math.cos(t * 53));
      shotCam(ctx, sp.cam[0], sp.cam[1] || sp.cam[0], u); MYTH.sets[sp.set](ctx, 720, 1280, t, sp.setOpt || {}); if (sp.draw) sp.draw(ctx, t); ctx.restore();
      MYTH.light(ctx, W, H_);
      MYTH.folkFinish(ctx, W, H_);
      if (sp.over) sp.over(ctx, W, H_, t);
      MYTH.folkBorder(ctx, W, H_);
      if (o.hook) hookCard(ctx, W, t); else if (o.title) MYTH.banner(ctx, W, t, o.title);
      nextCard(ctx, W, H_, t);
      subLine(ctx, t);
      const cut = t - a; if (cut >= 0 && cut < 0.1 && a > 0) { ctx.fillStyle = `rgba(255,240,210,${0.3 * (1 - cut / 0.1)})`; ctx.fillRect(0, 0, W, H_); } };
    const scoreSound = (k) => { SH.slice(1).forEach(([, s]) => k.play('whoosh', s, { dur: 0.2, gain: 0.18, minor: true })); if (o.sound) o.sound(k, h); };
    window.LESSON = { BEATS, DURATION, CAPS: [], SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
    window.scoreSound = scoreSound;
  };
