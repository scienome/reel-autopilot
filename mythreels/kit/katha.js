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
    // characters breathe, sway and bob (and move a little more while they speak), so no shot is ever a still frame
    const charPh = (w) => { let h = 7; for (const c of String(w)) h = (h * 31 + c.charCodeAt(0)) % 1000; return h / 159; };
    const char = (ctx, who, x, y, s, t, oo = {}) => { const tk = talking(oo.as || who, t), ph = charPh(who), live = o.cinema !== false && !oo.still;
      if (live) { const bob = Math.sin(t * 2.3 + ph) * 5 * s + (tk ? Math.abs(Math.sin(t * 6.5 + ph)) * -4 * s : 0), sway = Math.sin(t * 1.15 + ph) * 0.03 + (tk ? Math.sin(t * 5.5 + ph) * 0.018 : 0), br = 1 + Math.sin(t * 2.6 + ph) * 0.014;
        ctx.save(); ctx.translate(x, y + bob); ctx.rotate(sway); ctx.scale(1 + (br - 1) * 0.5, br); ctx.translate(-x, -y); }
      MYTH.person(ctx, x, y, s, Object.assign({ who, t }, oo, { face: Object.assign({ talk: tk }, oo.face || {}) }));
      if (live) ctx.restore(); };
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
    // ---------- CINEMA: the premium 'cinematic epic' finish (owner, 13 Nov 2026). On for every reel unless o.cinema === false.
    // Warm/teal film grade with contrast, drifting god rays, rising embers and dust, low mist, film grain, a deep vignette,
    // a thin gold frame instead of the paper border, a black-and-gold hook title, and a golden light sweep on cuts.
    const CINE = o.cinema !== false;
    const CINEMA = (() => {
      const grainC = document.createElement('canvas'); grainC.width = grainC.height = 256; { const g = grainC.getContext('2d'), im = g.createImageData(256, 256); let sd = 9; for (let i = 0; i < im.data.length; i += 4) { sd = (sd * 16807) % 2147483647; const v = sd % 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); }
      const tmp = document.createElement('canvas'); tmp.width = 720; tmp.height = 1280; const tc = tmp.getContext('2d');
      const EMB = Array.from({ length: 70 }, (_, i) => ({ x: (i * 157) % 720, s: 0.4 + ((i * 37) % 100) / 100, sp: 30 + (i * 53) % 70, ph: i * 1.7, hot: i % 3 === 0 }));
      const grade = (ctx, W, H_, t) => {
        tc.clearRect(0, 0, W, H_); tc.filter = 'contrast(1.15) saturate(1.1) brightness(0.97)'; tc.drawImage(ctx.canvas, 0, 0); tc.filter = 'none'; ctx.drawImage(tmp, 0, 0);
        ctx.save(); ctx.globalCompositeOperation = 'soft-light'; let g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, 'rgba(255,190,90,0.42)'); g.addColorStop(0.55, 'rgba(255,150,70,0.1)'); g.addColorStop(1, 'rgba(20,60,90,0.5)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.translate(-120 + Math.sin(t * 0.15) * 40, -80); ctx.rotate(0.38);
        for (let i = 0; i < 6; i++) { const x = i * 120 + Math.sin(t * 0.4 + i * 1.3) * 18, w = 40 + (i * 29) % 60, a = 0.07 + 0.05 * Math.sin(t * 0.6 + i * 2.1); const rg = ctx.createLinearGradient(0, 0, 0, 1500); rg.addColorStop(0, `rgba(255,214,140,${a + 0.06})`); rg.addColorStop(1, 'rgba(255,214,140,0)'); ctx.fillStyle = rg; ctx.fillRect(x, 0, w, 1500); }
        ctx.restore();
        ctx.save(); const mg = ctx.createLinearGradient(0, H_ * 0.72, 0, H_); mg.addColorStop(0, 'rgba(255,236,210,0)'); mg.addColorStop(1, 'rgba(255,236,210,0.16)'); ctx.fillStyle = mg; ctx.fillRect(0, H_ * 0.72, W, H_ * 0.28);
        ctx.globalAlpha = 0.1; for (let i = 0; i < 4; i++) { const yy = H_ * (0.8 + i * 0.05), xx = ((t * (14 + i * 6) + i * 200) % (W + 600)) - 300; const rr = ctx.createRadialGradient(xx, yy, 10, xx, yy, 260); rr.addColorStop(0, 'rgba(255,240,225,1)'); rr.addColorStop(1, 'rgba(255,240,225,0)'); ctx.fillStyle = rr; ctx.fillRect(xx - 260, yy - 260, 520, 520); } ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = 'screen'; for (const e of EMB) { const yy = H_ + 40 - ((t * e.sp + e.ph * 97) % (H_ + 120)), xx = e.x + Math.sin(t * 0.8 + e.ph) * 26, r = (e.hot ? 3.2 : 1.8) * e.s, al = (e.hot ? 0.85 : 0.45) * Math.min(1, (H_ - yy) / 300 + 0.2);
          const eg = ctx.createRadialGradient(xx, yy, 0, xx, yy, r * 5); eg.addColorStop(0, e.hot ? `rgba(255,200,110,${al})` : `rgba(255,240,210,${al})`); eg.addColorStop(1, 'rgba(255,160,60,0)'); ctx.fillStyle = eg; ctx.fillRect(xx - r * 5, yy - r * 5, r * 10, r * 10); } ctx.restore();
        ctx.save(); const vg = ctx.createRadialGradient(W / 2, H_ * 0.46, H_ * 0.28, W / 2, H_ * 0.5, H_ * 0.78); vg.addColorStop(0, 'rgba(8,2,0,0)'); vg.addColorStop(1, 'rgba(8,2,0,0.72)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H_);
        const tb = ctx.createLinearGradient(0, 0, 0, 260); tb.addColorStop(0, 'rgba(6,2,0,0.55)'); tb.addColorStop(1, 'rgba(6,2,0,0)'); ctx.fillStyle = tb; ctx.fillRect(0, 0, W, 260);
        const bb = ctx.createLinearGradient(0, H_ - 420, 0, H_); bb.addColorStop(0, 'rgba(6,2,0,0)'); bb.addColorStop(1, 'rgba(6,2,0,0.7)'); ctx.fillStyle = bb; ctx.fillRect(0, H_ - 420, W, 420); ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.09; const ox = Math.floor((t * 977) % 256), oy = Math.floor((t * 613) % 256); for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H_; y += 256) ctx.drawImage(grainC, x, y); ctx.restore(); };
      const frame = (ctx, W, H_, t) => { ctx.save(); ctx.strokeStyle = 'rgba(244,192,62,0.75)'; ctx.lineWidth = 2.5; ctx.strokeRect(22, 22, W - 44, H_ - 44); ctx.strokeStyle = 'rgba(244,192,62,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(30, 30, W - 60, H_ - 60);
        ctx.fillStyle = 'rgba(244,192,62,0.9)'; [[22, 22], [W - 22, 22], [22, H_ - 22], [W - 22, H_ - 22]].forEach(([x, y]) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-6, -6, 12, 12); ctx.restore(); }); ctx.restore(); };
      const hook = (ctx, W, t) => { if (!o.hook || t > hookEnd + 0.3) return; const a = Math.min(1, (hookEnd + 0.3 - t) / 0.3), u = t < 0.02 ? 1 : popU(t + 0.25, 0, 0.3); ctx.save(); ctx.globalAlpha = a;
        const lines = o.hook.split('\n'); ctx.translate(W / 2, 260); const sc = 0.94 + 0.06 * u; ctx.scale(sc, sc);
        const hh = lines.length * 100 + 70; const pg = ctx.createLinearGradient(0, -60, 0, hh); pg.addColorStop(0, 'rgba(10,4,2,0.0)'); pg.addColorStop(0.18, 'rgba(10,4,2,0.78)'); pg.addColorStop(0.82, 'rgba(10,4,2,0.78)'); pg.addColorStop(1, 'rgba(10,4,2,0)'); ctx.fillStyle = pg; ctx.fillRect(-W / 2, -60, W, hh + 20);
        ctx.strokeStyle = 'rgba(244,192,62,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-220, -16); ctx.lineTo(220, -16); ctx.moveTo(-220, hh - 40); ctx.lineTo(220, hh - 40); ctx.stroke();
        if (o.series) { const tag = (o.series + (o.part ? '  •  भाग ' + o.part : '')); ctx.font = '700 26px "Noto Sans Devanagari", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(244,192,62,0.95)'; ctx.fillText(tag, 0, -44); }
        lines.forEach((l, i) => { let fs = 80; ctx.font = `${fs}px "Yatra One", "Noto Sans Devanagari", sans-serif`; fs = Math.min(80, 80 * 640 / Math.max(1, ctx.measureText(l).width)); ctx.font = `${fs}px "Yatra One", "Noto Sans Devanagari", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          const y = 34 + i * 100; const last = i === lines.length - 1; ctx.shadowColor = last ? 'rgba(255,170,40,0.85)' : 'rgba(0,0,0,0.9)'; ctx.shadowBlur = last ? 28 : 14; ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(20,6,2,0.95)'; ctx.strokeText(l, 0, y);
          if (last) { const gg = ctx.createLinearGradient(0, y - 40, 0, y + 40); gg.addColorStop(0, '#fff3b0'); gg.addColorStop(0.5, '#ffc83a'); gg.addColorStop(1, '#c4801c'); ctx.fillStyle = gg; } else ctx.fillStyle = '#fff6e6'; ctx.fillText(l, 0, y); ctx.shadowBlur = 0; });
        ctx.restore(); };
      const cut = (ctx, W, H_, c) => { if (c > 0.45) return; const k = c / 0.45; ctx.save(); ctx.globalCompositeOperation = 'screen'; const x = -300 + k * (W + 600); const g = ctx.createLinearGradient(x - 260, 0, x + 260, 0); g.addColorStop(0, 'rgba(255,190,90,0)'); g.addColorStop(0.5, `rgba(255,214,140,${0.55 * (1 - k)})`); g.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
        if (c < 0.08) { ctx.fillStyle = `rgba(255,236,200,${0.35 * (1 - c / 0.08)})`; ctx.fillRect(0, 0, W, H_); } ctx.restore(); };
      return { grade, frame, hook, cut };
    })();
    const subCut = (t, a, b) => { const len = b - a, n = Math.max(1, Math.round(len / 2.3)), d = len / n, i = Math.min(n - 1, Math.floor((t - a) / d)); return { i, at: a + i * d }; };
    const GOLDT = []; if (CINE) BEATS.forEach((bt) => (RAW[bt.id] || []).forEach((w, i) => { if (GOLDW.includes(clean(w)) && WORDS[bt.id] && WORDS[bt.id][i]) GOLDT.push(WORDS[bt.id][i].t); }));
    const burst = (ctx, W, H_, t) => { for (const g of GOLDT) { const k = (t - g) / 0.7; if (k < 0 || k > 1) continue; ctx.save(); ctx.globalCompositeOperation = 'screen'; const r = 80 + k * 420, al = (1 - k);
        const rg = ctx.createRadialGradient(360, 620, r * 0.6, 360, 620, r); rg.addColorStop(0, 'rgba(255,200,90,0)'); rg.addColorStop(0.8, `rgba(255,214,120,${0.35 * al})`); rg.addColorStop(1, 'rgba(255,200,90,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H_);
        for (let i = 0; i < 22; i++) { const an = i / 22 * Math.PI * 2 + g, rr = 60 + k * (260 + (i * 37) % 120), x = 360 + Math.cos(an) * rr, y = 620 + Math.sin(an) * rr * 0.9, sz = 3 + (1 - k) * 4; const sg = ctx.createRadialGradient(x, y, 0, x, y, sz * 3); sg.addColorStop(0, `rgba(255,236,170,${al})`); sg.addColorStop(1, 'rgba(255,170,60,0)'); ctx.fillStyle = sg; ctx.fillRect(x - sz * 3, y - sz * 3, sz * 6, sz * 6); }
        ctx.restore(); } };
    const STORY = (ctx, W, H_, t) => {
      const [name, a, b] = shotAt(t), sp = SHOTS[name], u = H.clamp((t - a) / Math.max(0.01, b - a));
      ctx.save(); const sh = sp.shake != null && t > sp.shake ? 16 * Math.max(0, 1 - (t - sp.shake) * 2.5) : 0; ctx.translate(sh * Math.sin(t * 70), sh * Math.cos(t * 53));
      if (CINE) { const br = 1.03 + 0.012 * Math.sin(t * 0.35); ctx.translate(360, 640); ctx.scale(br, br); ctx.translate(-360, -640); }
      if (CINE) { const si = SH.findIndex(([n]) => n === name), mode = si % 5, e = H.ease.inOut(u), cutU = Math.max(0, 1 - (t - a) / 0.3); // a different slow move for every shot + a punch-in on each cut + handheld drift
        let z = 1, px = 0, py = 0; if (mode === 0) z = 1 + 0.13 * e; else if (mode === 1) { z = 1.08; px = -40 + 80 * e; } else if (mode === 2) z = 1.13 - 0.13 * e; else if (mode === 3) { z = 1.08; px = 40 - 80 * e; } else { z = 1.07 + 0.05 * e; py = 30 - 60 * e; }
        z *= 1 + 0.05 * cutU * cutU; px += Math.sin(t * 0.9) * 6 + Math.sin(t * 2.3) * 2; py += Math.cos(t * 0.7) * 5 + Math.cos(t * 1.9) * 2;
        ctx.translate(360, 640); ctx.scale(z, z); ctx.rotate(Math.sin(t * 0.5) * 0.004); ctx.translate(-360 + px, -640 + py);
        const sub = subCut(t, a, b), FR = [[1, 360, 700], [1.32, 360, 660], [1.62, 300, 600], [1.62, 420, 600], [1.2, 360, 760]], fr = FR[(sub.i + si) % FR.length]; // a new framing every ~2.3 s inside the shot
        if (sub.i > 0) { ctx.translate(360, 640); ctx.scale(fr[0], fr[0]); ctx.translate(-fr[1], -fr[2] + (640 - 640 / fr[0]) * 0); } }
      shotCam(ctx, sp.cam[0], sp.cam[1] || sp.cam[0], u); MYTH.sets[sp.set](ctx, 720, 1280, t, sp.setOpt || {}); if (sp.draw) sp.draw(ctx, t); ctx.restore();
      if (CINE) { CINEMA.grade(ctx, W, H_, t, name); } else { MYTH.light(ctx, W, H_); MYTH.folkFinish(ctx, W, H_); }
      if (CINE) burst(ctx, W, H_, t);
      if (sp.over) sp.over(ctx, W, H_, t);
      if (CINE) CINEMA.frame(ctx, W, H_, t); else MYTH.folkBorder(ctx, W, H_);
      if (o.hook) (CINE ? CINEMA.hook : hookCard)(ctx, W, t); else if (o.title) MYTH.banner(ctx, W, t, o.title);
      nextCard(ctx, W, H_, t);
      subLine(ctx, t);
      const cut = t - a, sc = CINE ? t - subCut(t, a, b).at : cut; if (CINE && sc >= 0 && sc < cut) CINEMA.cut(ctx, W, H_, sc * 1.6); if (cut >= 0 && a > 0) { if (CINE) CINEMA.cut(ctx, W, H_, cut); else if (cut < 0.1) { ctx.fillStyle = `rgba(255,240,210,${0.3 * (1 - cut / 0.1)})`; ctx.fillRect(0, 0, W, H_); } } };
    const scoreSound = (k) => { SH.slice(1).forEach(([, s]) => k.play('whoosh', s, { dur: 0.2, gain: 0.18, minor: true })); if (o.sound) o.sound(k, h); };
    window.LESSON = { BEATS, DURATION, CAPS: [], SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
    window.scoreSound = scoreSound;
  };
