// 116-banned-words Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 116;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "THE ROOM HAS A LIST\nOF WORDS THAT\n*KILL YOUR REACH*."); k.fileTag(ctx, N); }; return c; },
    list: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83d\udcdc CHANGES EVERY TUESDAY", { y: 200, bg: '#1a1a24', size: 36 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "NOT DELETED. JUST\u2026 QUIET \ud83e\udd2b", { y: 200, bg: '#1a1a24', size: 38 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "CREATORS WHISPER ABOUT IT \ud83d\udc7b", { y: 200, bg: '#1a1a24', size: 36 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "WORD #1: ALGORITHM \ud83d\ude2c", { y: 200, bg: '#5a0a0e', size: 40 }); k.glitch(ctx, t, kk > 0.5 ? 0.8 : 0); if (kk > 0.6) k.card(ctx, 'HI TO THE 4 OF YOU 👋', { y: 1110, bg: '#1a1a24', size: 34 }); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "What actually gets you buried", ["Reposts with other apps' watermarks.", "Copied content: originals get pushed first.", "Make it yourself, made for the app."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "TAG A CREATOR WHO NEEDS THIS \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
