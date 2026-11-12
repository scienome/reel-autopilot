// 120-like-is-a-vote Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 120;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "EVERY *LIKE* IS A VOTE.\nYOU VOTED FOR\nTHE WRONG PEOPLE."); k.fileTag(ctx, N); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83d\udc4d = \ud83e\ude99 ON THE WALL", { y: 200, bg: '#1a1a24', size: 44 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\u2764\ufe0f STRANGER'S LUNCH", { y: 200, bg: '#1a1a24', size: 36 }); if (kk > 0.5) k.card(ctx, '❌ SKIPPED: BEST FRIEND', { y: 280, bg: '#5a0a0e', size: 36 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'cityWide', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "A SANDWICH GOT FAMOUS \ud83e\udd6a", { y: 200, bg: '#c8a21e', size: 40 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THE SANDWICH HAS A MANAGER NOW \ud83e\udd6a\ud83d\udcbc", { y: 200, bg: '#1f6a3a', size: 32 }); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Never miss your people", ["Instagram: open their profile \u2192 Following \u2192 Add to Favorites.", "Their posts show higher in your feed.", "Tap the logo \u2192 Favorites to see only them."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT WHO DESERVES YOUR VOTE \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
