// 119-stuck-song Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 119;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "THAT SONG\nIN YOUR HEAD?\nTHEY PUT IT *THERE*."); k.fileTag(ctx, N); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83c\udfb5 ONE SOUND. 1,000 VIDEOS.", { y: 200, bg: '#1a1a24', size: 38 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'cityWide', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "BY FRIDAY: THE WHOLE WORLD HUMS IT", { y: 200, bg: '#1a1a24', size: 30 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "YOU'RE HUMMING IT RIGHT NOW \ud83c\udfb6", { y: 200, bg: '#5a0a0e', size: 36 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "PICKED BY THE LEADER'S TODDLER \ud83d\udc76", { y: 200, bg: '#1a1a24', size: 34 }); k.boom(ctx, (kk - 0.4) * 2.2, 360, 1000, 'DA DA DA'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Get a song out of your head", ["Chew gum. Really.", "A University of Reading study: gum cut stuck songs.", "It busies the inner voice that replays it."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT THE SONG STUCK IN YOUR HEAD \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
