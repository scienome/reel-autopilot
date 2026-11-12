// 110-share-test Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 110;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "YOUR FEED IS A *TEST*.\nWILL YOU SHARE THIS?"); k.fileTag(ctx, N); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "ONE VIDEO. ONE CHANCE. \ud83c\udfaf", { y: 200, bg: '#1a1a24', size: 38 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'cityWide', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SHARERS: MORE REACH \ud83d\udcc8", { y: 200, bg: '#1f6a3a', size: 36 }); if (kk > 0.5) k.card(ctx, 'NON-SHARERS: SOCK ADS FOREVER 🧦', { y: 280, bg: '#5a0a0e', size: 32 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THE FIRST FACE YOU THOUGHT OF \ud83d\udc40", { y: 200, bg: '#5a0a0e', size: 34 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SOMEONE SENT IT TO THEIR EX \ud83d\udc80", { y: 200, bg: '#1a1a24', size: 34 }); k.boom(ctx, (kk - 0.3) * 2.2, 360, 1000, 'DAY OFF'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Train your own feed", ["Hold a post you hate \u2192 'Not interested'.", "Do it 10 times this week.", "Like and save what you want more of."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SEND THIS TO THE FIRST PERSON YOU THOUGHT OF \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
