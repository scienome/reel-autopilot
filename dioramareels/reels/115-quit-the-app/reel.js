// 115-quit-the-app Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 115;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "THEY KNOW YOU'RE\nABOUT TO *CLOSE\nTHE APP*."); k.fileTag(ctx, N); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\u26a0\ufe0f LEAVING\u2026 LEAVING\u2026", { y: 200, bg: '#5a0a0e', size: 40 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SEND THE STRONGEST ONE \ud83d\udca5", { y: 200, bg: '#1a1a24', size: 38 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "YOU WERE GOING TO SLEEP \ud83d\ude34", { y: 200, bg: '#1a1a24', size: 36 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83d\udc36 PUPPIES", { y: 200, bg: '#1a1a24', size: 44 }); if (kk > 0.33) k.card(ctx, kk > 0.66 ? '📁 THIS ONE WORKS BEST' : '🍳 COOKING', { y: 280, bg: '#1a1a24', size: 40 }); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Leave when YOU want", ["Turn off notifications from apps.", "Keep only messages from real people.", "Most phone checks start with a ping."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "TAG WHO SAYS 'ONE MORE VIDEO' \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
