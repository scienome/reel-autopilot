// 112-one-in-100 Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 112;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "ONLY *1 IN 100*\nWATCH THIS TO THE END."); k.fileTag(ctx, N); }; return c; },
    count: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'LEFT ALREADY', `${Math.min(99, Math.floor(kk * 110))}`, { y: 170 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THE ROOM RESPECTS ONE THING: ATTENTION", { y: 200, bg: '#1a1a24', size: 28 }); }; return c; },
    hand: (t, kk) => { const c = k.roomScene(S, 'cityHand', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "MOVED TO A BETTER STREET \ud83c\udfd9\ufe0f", { y: 200, bg: '#1f6a3a', size: 36 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THE THING: THE VIDEO ENDS \ud83d\ude43", { y: 200, bg: '#1a1a24', size: 38 }); k.boom(ctx, (kk - 0.3) * 2.2, 360, 1000, 'SORRY'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Your prize: get your nights back", ["Instagram \u2192 Your activity \u2192 Time spent.", "Set a daily limit (30 min works).", "You'll get a reminder before the room wins."], { badge: "\ud83c\udfc6 YOUR PRIZE" }); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT 'END' IF YOU MADE IT \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
