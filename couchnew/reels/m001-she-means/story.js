  // ==================== couch pilot m001 "What she says vs what she means" ====================
  // Pure 2D typographic reel: her words on a white card, the translation typed in word by word (karaoke) on a black card,
  // a DANGER LEVEL meter that climbs with every line; then HIS turn, and the meter turns into a ring.
  const BEATS = window.SCRIPT, TM = REEL_TIMING(BEATS), { V, WORDS, DURATION, first } = TM;
  const PAIRS = ['fine', 'whatever', 'mum', 'tired', 'ex'], DANGER = { fine: 38, whatever: 61, mum: 82, tired: 90, ex: 100 };
  const BG = { hook: ['#1a1030', '#4a1550'], fine: ['#2a0f1c', '#7a1630'], whatever: ['#14223a', '#2a4a8a'], mum: ['#2c1300', '#8a3a00'], tired: ['#101a14', '#1f5a3a'], ex: ['#300808', '#a00e1e'], him: ['#121212', '#2a2a30'], twist: ['#2a1a30', '#c0587a'], cta: ['#1a1030', '#4a1550'] };
  const SH = BEATS.map((b, i) => [b.id, i ? first(b.id) : 0]);
  const shotOf = (t) => { let k = 0; SH.forEach((s, i) => { if (t >= s[1]) k = i; }); return SH[k][0]; };
  const phraseWords = (id, pi) => { const b = BEATS.find((x) => x.id === id); let wi = 0; for (let i = 0; i < pi; i++) wi += b.phrases[i].split(/\s+/).length; return b.phrases[pi].split(/\s+/).map((w, j) => [w, WORDS[id][wi + j].t - 0.05]); };
  const fitFont = (ctx, txt, w, max, min = 30) => { let px = max; ctx.font = FONT(900, px); while (ctx.measureText(txt).width > w && px > min) ctx.font = FONT(900, (px -= 2)); return px; };
  const wrapWords = (ctx, words, maxW) => { const lines = [[]]; let cur = ''; for (const wt of words) { const t = cur ? cur + ' ' + wt[0] : wt[0]; if (ctx.measureText(t).width > maxW && cur) { lines.push([wt]); cur = wt[0]; } else { lines[lines.length - 1].push(wt); cur = t; } } return lines; };
  const label = (ctx, txt, x, y, col, bg) => { ctx.font = FONT(900, 28); const w = ctx.measureText(txt).width + 40; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 26, w, 52, 26); ctx.fill(); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y + 2); };
  // her words: a white card with a speech tail; u = pop
  const saysCard = (ctx, txt, u, who) => { if (u <= 0) return; ctx.save(); ctx.translate(360, 540); ctx.scale(u, u); ctx.rotate(-0.025);
    ctx.font = FONT(900, 60); const lines = wrapWords(ctx, txt.split(' ').map((w) => [w, 0]), 520).map((l) => l.map((x) => x[0]).join(' ')), h = lines.length * 72 + 80;
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-300, -h / 2, 600, h, 40); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-160, h / 2 - 4); ctx.lineTo(-200, h / 2 + 50); ctx.lineTo(-100, h / 2 - 4); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#16161c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText('"' === l[0] ? l : (i === 0 ? '“' : '') + l + (i === lines.length - 1 ? '”' : ''), 0, -((lines.length - 1) * 72) / 2 + i * 72 + 4));
    ctx.restore(); label(ctx, `WHAT ${who} SAYS`, 360, 540 - h / 2 - 50, '#16161c', '#ffd23f'); };
  // the translation: black card, words appear as they are spoken, the newest one pops
  const meansCard = (ctx, words0, t, who, col) => { const words = words0.map(([w, at]) => [w.toUpperCase(), at]); if (!words.length || t < words[0][1] - 0.1) return; const a = H.clamp((t - words[0][1] + 0.15) / 0.2);
    ctx.save(); ctx.globalAlpha = a; ctx.font = FONT(900, 52); const lines = wrapWords(ctx, words, 540), h = lines.length * 66 + 70, y0 = 900;
    ctx.fillStyle = 'rgba(8,8,12,0.92)'; ctx.beginPath(); ctx.roundRect(60, y0 - h / 2, 600, h, 30); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.stroke();
    ctx.textBaseline = 'middle'; lines.forEach((ln, i) => { const sp = ctx.measureText(' ').width; let wsum = ln.reduce((s, [w]) => s + ctx.measureText(w).width + sp, 0) - sp, x = 360 - wsum / 2; const y = y0 - ((lines.length - 1) * 66) / 2 + i * 66;
      for (const [w, at] of ln) { const ww = ctx.measureText(w).width; if (t >= at) { const p = popU(t, at, 0.18); ctx.save(); ctx.translate(x + ww / 2, y); ctx.scale(p, p); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(w, 0, 2); ctx.restore(); } x += ww + sp; } });
    ctx.restore(); label(ctx, `WHAT ${who} MEANS`, 360, y0 - h / 2 - 34, '#fff', col); };
  const meter = (ctx, t, id) => { const order = PAIRS.filter((p) => t >= first(p)); const tgt = order.length ? DANGER[order[order.length - 1]] : 0;
    const prev = order.length > 1 ? DANGER[order[order.length - 2]] : 0, k = order.length ? H.clamp((t - first(order[order.length - 1])) / 0.6) : 0, v = prev + (tgt - prev) * H.ease.inOut(k);
    const x = 360, y = 1120, w = 520; ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 22, w, 44, 22); ctx.fill();
    const hot = v >= 99, g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#ffd23f'); g.addColorStop(1, '#ff2a3a'); ctx.fillStyle = g;
    ctx.globalAlpha = hot ? 0.6 + 0.4 * Math.sin(t * 20) : 1; ctx.beginPath(); ctx.roundRect(x - w / 2 + 4, y - 18, (w - 8) * v / 100, 36, 18); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff'; ctx.font = FONT(900, 26); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(`DANGER LEVEL ${Math.round(v)}%`, x, y - 50); ctx.restore(); };
  const ring = (ctx, x, y, u, t) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.rotate(0.15 * Math.sin(t * 2)); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(0, 30, 70, 0, TAU); ctx.stroke();
    ctx.fillStyle = '#bfe8ff'; ctx.beginPath(); ctx.moveTo(0, -95); ctx.lineTo(45, -55); ctx.lineTo(0, -20); ctx.lineTo(-45, -55); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.moveTo(-10, -80); ctx.lineTo(10, -60); ctx.lineTo(-5, -50); ctx.fill();
    for (let i = 0; i < 6; i++) { const a = t * 2 + i, r = 130 + 20 * Math.sin(t * 3 + i); FX.sparkle(ctx, Math.cos(a) * r, Math.sin(a) * r, 16, t * 3 + i); } ctx.restore(); };
  const STORY = (ctx, W, H_, t) => { const id = shotOf(t), [c0, c1] = BG[id]; const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = '#fff'; ctx.font = FONT(900, 220); ctx.textAlign = 'center'; for (let i = 0; i < 6; i++) ctx.fillText(id === 'him' || id === 'twist' ? 'HE' : 'SHE', 360 + ((t * 40 + i * 300) % 1200) - 600, 200 + i * 220); ctx.restore();
    if (id === 'hook') { const a = popU(t, 0.15, 0.35), b = popU(t, first('hook') + 1.1, 0.35); ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.translate(360, 520); ctx.scale(a, a); ctx.fillStyle = '#fff'; fitFont(ctx, 'WHAT SHE SAYS', 640, 84); ctx.fillText('WHAT SHE SAYS', 0, 0); ctx.restore();
      ctx.save(); ctx.translate(360 + (b > 0 ? 6 * Math.sin(t * 50) * Math.max(0, 1 - (t - first('hook') - 1.1) * 3) : 0), 700); ctx.scale(b, b); ctx.fillStyle = '#ff2a4a'; fitFont(ctx, 'VS WHAT SHE MEANS', 660, 84); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('VS WHAT SHE MEANS', 0, 0); ctx.restore(); }
    else if (PAIRS.includes(id)) { const b = BEATS.find((x) => x.id === id); saysCard(ctx, b.phrases[0], popU(t, first(id), 0.3), 'SHE'); meansCard(ctx, phraseWords(id, 1), t, 'SHE', '#ff3b4a'); meter(ctx, t, id); }
    else if (id === 'him') { const lab = popU(t, first('him'), 0.3); ctx.save(); ctx.translate(360, 330); ctx.scale(lab, lab); ctx.fillStyle = '#fff'; ctx.font = FONT(900, 70); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('NOW HIS TURN', 0, 0); ctx.restore();
      saysCard(ctx, 'Okay.', popU(t, V('him', 'Okay'), 0.3), 'HE'); meter(ctx, t, id); }
    else if (id === 'twist') { saysCard(ctx, 'Okay.', 1, 'HE'); const ws = phraseWords('twist', 1).concat(phraseWords('twist', 2)); meansCard(ctx, ws, t, 'HE', '#2fd158'); ring(ctx, 360, 1175, popU(t, V('twist', 'ring'), 0.4), t); }
    else { const u = popU(t, first('cta'), 0.35); ctx.save(); ctx.translate(360, 620); ctx.scale(u, u); ctx.rotate(-0.04); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-300, -170, 600, 340, 40); ctx.fill();
      ctx.fillStyle = '#16161c'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = FONT(900, 56); ctx.fillText('TAG THE ONE', 0, -80); ctx.fillText('WHO SAYS', 0, -10); ctx.fillStyle = '#d0102a'; ctx.font = FONT(900, 78); ctx.fillText('“I’M FINE”', 0, 80); ctx.restore(); }
    const fl = Math.max(0, 1 - Math.abs(t - V('twist', 'ring')) * 5); if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${0.5 * fl})`; ctx.fillRect(0, 0, W, H_); } };
  function scoreSound(k) {
    SH.slice(1).forEach(([, s]) => k.play('whoosh', s - 0.06, { dur: 0.22, gain: 0.35, minor: true }));
    for (const id of PAIRS) { k.play('pop', first(id), { f: 700, gain: 0.4 }); const m = phraseWords(id, 1); k.play('glitch', m[0][1], { gain: 0.3 }); m.forEach(([, at]) => k.play('tick', at, { f: 1400, gain: 0.12, minor: true })); k.play('buzz', first(id) + 0.1, { f: 140 + DANGER[id], dur: 0.12, gain: 0.18 }); }
    k.play('pop', V('him', 'Okay'), { f: 500, gain: 0.4 }); COUCH.sounds.twist(k, V('twist', 'ring')); k.play('stamp', first('cta'), { gain: 0.4 });
  }
  window.LESSON = { BEATS, DURATION, CAPS: [], SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
