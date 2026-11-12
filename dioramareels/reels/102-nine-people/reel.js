// 102-nine-people Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 102;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "THE ALGORITHM\nIS *9 PEOPLE*."); k.fileTag(ctx, N); }; return c; },
    seat: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SEAT 4: HANDLES YOU \ud83d\udc64", { y: 200, bg: '#5a0a0e', size: 40 }); k.rec(ctx, t, 'SEAT 4'); }; return c; },
    proof: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "1 SECOND PAUSE \u2192 50 MORE LIKE IT", { y: 200, bg: '#1a1a24', size: 32 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SAD SONGS AT NIGHT \ud83c\udfa7 \u00b7 SKIPS ADS AT 0:05", { y: 200, bg: '#1a1a24', size: 28 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityHand', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "ON SHIFT SINCE 2016 \ud83d\ude2e\u200d\ud83d\udca8", { y: 200, bg: '#1a1a24', size: 40 }); k.boom(ctx, (kk - 0.4) * 2.2, 360, 1000, 'YAWN'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Make the algorithm forget you", ["Instagram: Settings, search 'Reset suggested content'.", "YouTube: Settings, History, clear watch history.", "Then only watch what you actually like."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT IF YOU FELT WATCHED \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
