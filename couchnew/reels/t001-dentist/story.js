  // ==================== couch pilot t001 "Who's Jessica?" (text-message story) ====================
  // Pure 2D: the frame IS her phone. Lock-screen notification -> the chat (bubbles pop in as the voice reads them, his
  // typing dots, her keyboard typing and deleting) -> an incoming call -> the call subtitles (the twist) -> PART 2?
  const BEATS = window.SCRIPT, TM = REEL_TIMING(BEATS), { V, WORDS, DURATION, first } = TM;
  const CC = { bg0: '#0d1020', bg1: '#251a3a', me: '#2f7cf6', them: '#e8e8ee', ink: '#15151c', sub: '#8e8ea0', red: '#ff3b4a', green: '#2fd158' };
  const PX = 34, PW = 720 - 2 * PX, PY = 170, PH = 1280 - PY - 60;
  const wrapText = (ctx, txt, max) => { const out = []; let ln = ''; for (const w of txt.split(' ')) { const t = ln ? ln + ' ' + w : w; if (ctx.measureText(t).width > max && ln) { out.push(ln); ln = w; } else ln = t; } out.push(ln); return out; };
  const MSGS = [
    { me: true, text: "Who's Jessica?", at: first('q1') }, { me: false, text: 'My dentist.', at: first('a1') },
    { me: true, text: 'Then why does she text you "miss you x" ??', at: first('q2') }, { me: false, text: 'She misses my teeth.', at: first('a2') },
    { me: true, text: 'Cool.', at: V('reveal', 'Cool') }, { me: true, text: 'I just booked a cleaning.', at: V('reveal', 'just') }, { me: true, text: 'With Jessica.', at: V('reveal', 'With') },
  ];
  const TYPED = [[V('typing', 'typing'), "you're a liar"], [V('typing', 'stops'), ''], [V('typing', 'typing', 2), 'Cool.']];
  const SH = [['hook', 0], ['chat', first('q1')], ['call', first('call')], ['twist', first('twist')], ['cta', first('cta')]];
  // narration captions (only the narrator's lines; messages and the call are on screen as text)
  const NARR = ['hook', 'typing', 'call', 'cta'], CAPS = [];
  for (const id of NARR) { const b = BEATS.find((x) => x.id === id); let wi = 0;
    for (const ph of b.phrases) { const ws = ph.split(/\s+/); CAPS.push([WORDS[id][wi].t - 0.05, ws.length > 3 ? [ws.slice(0, 3).map((w) => w.toUpperCase()), ws.slice(3).map((w) => w.toUpperCase())] : [ws.map((w) => w.toUpperCase())]]); wi += ws.length; } }
  const narrCap = (ctx, W, t) => { let cur = null; for (const c of CAPS) if (t >= c[0]) cur = c; if (cur && t - cur[0] < 2.6) caption(ctx, W, cur[1], cur[0], t, 70); };
  const bgPaint = (ctx, W, H_, t) => { const g = ctx.createLinearGradient(0, 0, W, H_); g.addColorStop(0, CC.bg0); g.addColorStop(1, CC.bg1); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    ctx.save(); ctx.globalAlpha = 0.25; for (let i = 0; i < 3; i++) { const x = W * (0.2 + 0.3 * i) + 40 * Math.sin(t * 0.4 + i), y = H_ * (0.3 + 0.2 * i); const r = ctx.createRadialGradient(x, y, 0, x, y, 260); r.addColorStop(0, i === 1 ? '#ff3b8a' : '#3b6bff'); r.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H_); } ctx.restore(); };
  const phoneFrame = (ctx, draw) => { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 40; ctx.fillStyle = '#05060a'; ctx.beginPath(); ctx.roundRect(PX - 10, PY - 10, PW + 20, PH + 20, 64); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.beginPath(); ctx.roundRect(PX, PY, PW, PH, 56); ctx.clip(); draw(); ctx.restore(); ctx.fillStyle = '#05060a'; ctx.beginPath(); ctx.roundRect(360 - 70, PY + 14, 140, 34, 17); ctx.fill(); };
  const avatarDot = (ctx, x, y, r, letter, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = FONT(800, r); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(letter, x, y + 2); };
  const lockScreen = (ctx, W, H_, t) => phoneFrame(ctx, () => { const g = ctx.createLinearGradient(0, PY, 0, PY + PH); g.addColorStop(0, '#3a2a6a'); g.addColorStop(1, '#c0587a'); ctx.fillStyle = g; ctx.fillRect(PX, PY, PW, PH);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.font = FONT(700, 34); ctx.fillText('Thursday 30 October', 360, PY + 190); ctx.font = FONT(900, 150); ctx.fillText('11:58', 360, PY + 340);
    const u = popU(t, 0.25, 0.35); if (u > 0) { ctx.save(); ctx.translate(360, PY + 520); ctx.scale(u, u); ctx.fillStyle = 'rgba(245,245,250,0.92)'; ctx.beginPath(); ctx.roundRect(-290, -80, 580, 160, 34); ctx.fill();
      avatarDot(ctx, -220, 0, 44, 'J', '#e0457b'); ctx.textAlign = 'left'; ctx.fillStyle = CC.ink; ctx.font = FONT(800, 32); ctx.fillText('Jessica', -160, -14); ctx.font = FONT(600, 32); ctx.fillText('miss you x', -160, 30);
      ctx.fillStyle = CC.sub; ctx.font = FONT(600, 24); ctx.textAlign = 'right'; ctx.fillText('now', 270, -24); ctx.restore(); }
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = FONT(700, 26); ctx.fillText("Ryan's phone", 360, PY + PH - 80); });
  const chatScreen = (ctx, W, H_, t) => phoneFrame(ctx, () => { ctx.fillStyle = '#ffffff'; ctx.fillRect(PX, PY, PW, PH);
    // messages, scrolled so the newest stays above the input bar
    ctx.font = FONT(600, 36); const shown = MSGS.filter((m) => t >= m.at), TOP = PY + 230, BOT = PY + PH - 330;
    const lay = shown.map((m) => { const ls = wrapText(ctx, m.text, PW * 0.58); return { m, ls, h: ls.length * 46 + 34, w: Math.max(...ls.map((l) => ctx.measureText(l).width)) + 48 }; });
    const typing = !shown.find((m) => !m.me && m.at > t - 0.01) && MSGS.find((m) => !m.me && t >= m.at - 1.1 && t < m.at);
    let tot = lay.reduce((s, b) => s + b.h + 16, 0) + (typing ? 86 : 0); let y = Math.min(TOP, BOT - tot);
    for (const b of lay) { const u = popU(t, b.m.at, 0.25), x = b.m.me ? PX + PW - 28 - b.w : PX + 28;
      ctx.save(); ctx.translate(x + (b.m.me ? b.w : 0), y + b.h); ctx.scale(u, u); ctx.translate(-(b.m.me ? b.w : 0), -b.h);
      ctx.fillStyle = b.m.me ? CC.me : CC.them; ctx.beginPath(); ctx.roundRect(0, 0, b.w, b.h, 30); ctx.fill();
      ctx.fillStyle = b.m.me ? '#fff' : CC.ink; ctx.textAlign = 'left'; b.ls.forEach((l, i) => ctx.fillText(l, 24, 52 + i * 46)); ctx.restore(); y += b.h + 16; }
    if (typing) { ctx.fillStyle = CC.them; ctx.beginPath(); ctx.roundRect(PX + 28, y, 120, 70, 30); ctx.fill(); for (let i = 0; i < 3; i++) { ctx.fillStyle = '#8a8a96'; ctx.beginPath(); ctx.arc(PX + 62 + i * 26, y + 35 - 8 * Math.max(0, Math.sin(t * 9 - i)), 9, 0, TAU); ctx.fill(); } }
    const last = shown[shown.length - 1]; if (last && last.me && last.text === 'With Jessica.' && t > last.at + 0.6) { ctx.fillStyle = CC.sub; ctx.font = FONT(600, 24); ctx.textAlign = 'right'; ctx.fillText('Read 11:59', PX + PW - 32, y + 4); }
    // header (on top of scrolled bubbles)
    ctx.fillStyle = '#f6f6f9'; ctx.fillRect(PX, PY, PW, 200); ctx.fillStyle = '#d8d8e0'; ctx.fillRect(PX, PY + 200, PW, 2); avatarDot(ctx, 360, PY + 105, 42, 'R', '#7a8aa8');
    ctx.fillStyle = CC.ink; ctx.font = FONT(800, 30); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('Ryan', 360, PY + 180); ctx.fillStyle = CC.me; ctx.font = FONT(900, 48); ctx.fillText('‹', PX + 40, PY + 122);
    // input bar + keyboard; her draft types and deletes during "typing"
    let draft = ''; for (const [at, s] of TYPED) if (t >= at) { const prev = draft; draft = s === '' ? prev.slice(0, Math.max(0, prev.length - Math.floor((t - at) * 30))) : s.slice(0, Math.floor((t - at) * 14)); }
    if (t >= V('reveal', 'Cool')) draft = '';
    ctx.fillStyle = '#f6f6f9'; ctx.fillRect(PX, PY + PH - 300, PW, 300); ctx.strokeStyle = '#cfcfd8'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(PX + 28, PY + PH - 280, PW - 56, 70, 35); ctx.stroke();
    ctx.fillStyle = draft ? CC.ink : '#a0a0ac'; ctx.font = FONT(600, 32); ctx.textAlign = 'left'; ctx.fillText(draft || 'Message', PX + 56, PY + PH - 233);
    if (draft && Math.sin(t * 12) > 0) { ctx.fillStyle = CC.me; ctx.fillRect(PX + 60 + ctx.measureText(draft).width, PY + PH - 262, 3, 36); }
    for (let r = 0; r < 3; r++) for (let c = 0; c < 10 - r; c++) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(PX + 38 + r * 26 + c * 58, PY + PH - 190 + r * 58, 50, 50, 8); ctx.fill(); } });
  const callScreen = (ctx, W, H_, t, inCall) => phoneFrame(ctx, () => { const g = ctx.createLinearGradient(0, PY, 0, PY + PH); g.addColorStop(0, '#1d2a3a'); g.addColorStop(1, '#0a0f18'); ctx.fillStyle = g; ctx.fillRect(PX, PY, PW, PH);
    const pulse = 1 + 0.06 * Math.sin(t * 8); ctx.save(); ctx.translate(360, PY + 300); ctx.scale(inCall ? 1 : pulse, inCall ? 1 : pulse); avatarDot(ctx, 0, 0, 110, 'J', '#e0457b'); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.font = FONT(800, 56); ctx.fillText('Jessica', 360, PY + 500);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = FONT(600, 30); ctx.fillText(inCall ? '00:0' + Math.min(9, Math.floor(t - first('twist') + 1)) : 'incoming call...', 360, PY + 550);
    if (!inCall) for (const [x, col] of [[200, CC.red], [520, CC.green]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, PY + PH - 200, 64, 0, TAU); ctx.fill(); }
    else { ctx.fillStyle = CC.red; ctx.beginPath(); ctx.arc(360, PY + PH - 200, 64, 0, TAU); ctx.fill(); } });
  // the twist: what Jessica says, as huge subtitles over the call
  const callSubs = (ctx, W, H_, t) => { const b = BEATS.find((x) => x.id === 'twist'); let wi = 0, cur = null; for (const ph of b.phrases) { const at = WORDS.twist[wi].t - 0.05; if (t >= at) cur = [ph, at]; wi += ph.split(/\s+/).length; } if (!cur) return;
    const big = cur[0] === "I'm his wife.", u = popU(t, cur[1], 0.3), sh = big ? 10 * Math.max(0, 1 - (t - cur[1]) * 2) * Math.sin(t * 60) : 0;
    ctx.save(); ctx.translate(360 + sh, PY + 700); ctx.scale(u, u); let fs = big ? 92 : 56; ctx.font = FONT(900, fs); while (ctx.measureText(cur[0].toUpperCase()).width > 600 && fs > 30) ctx.font = FONT(900, (fs -= 2)); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    ctx.lineWidth = 14; ctx.strokeStyle = '#000'; ctx.strokeText(cur[0].toUpperCase(), 0, 0); ctx.fillStyle = big ? CC.red : '#fff'; ctx.fillText(cur[0].toUpperCase(), 0, 0); ctx.restore(); };
  const STORY = (ctx, W, H_, t) => { bgPaint(ctx, W, H_, t);
    if (t < SH[1][1]) lockScreen(ctx, W, H_, t); else if (t < SH[2][1])chatScreen(ctx, W, H_, t); else if (t < SH[4][1]) { callScreen(ctx, W, H_, t, t >= SH[3][1]); if (t >= SH[3][1]) callSubs(ctx, W, H_, t); }
    else {chatScreen(ctx, W, H_, SH[2][1] - 0.01); ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H_); const u = popU(t, first('cta'), 0.35); ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.rotate(-0.05);
      ctx.fillStyle = CC.red; ctx.beginPath(); ctx.roundRect(-230, -80, 460, 160, 30); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = FONT(900, 84); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PART 2?', 0, 6); ctx.restore(); }
    narrCap(ctx, W, t);
    const fl = Math.max(0, 1 - Math.abs(t - V('twist', 'wife')) * 6); if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${0.6 * fl})`; ctx.fillRect(0, 0, W, H_); } };
  function scoreSound(k) {
    SH.slice(1).forEach(([, s]) => k.play('whoosh', s - 0.06, { dur: 0.22, gain: 0.3, minor: true }));
    for (const m of MSGS) k.play(m.me ? 'pop' : 'blip', m.at, m.me ? { f: 900, gain: 0.45 } : { f: 1300, gain: 0.4 });
    k.play('ding', 0.25, { f: 'E6', gain: 0.35 });
    k.play('impact', V('twist', 'wife'), { gain: 0.8 });
  }
  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
