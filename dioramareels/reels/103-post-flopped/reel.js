// 103-post-flopped Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 103;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "YOUR BEST POST\n*FLOPPED*.\nHERE'S WHO VOTED."); k.fileTag(ctx, N); k.stamp(ctx, 'DENIED', (kk - 0.4) * 2, 360, 1000); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "YOUR POST: ON THE WALL", { y: 200, bg: '#1a1a24', size: 40 }); }; return c; },
    vote: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'YES · NO · ASLEEP', `3 · 5 · 1`, { y: 170 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "TOO MUCH TEXT \u274c", { y: 200, bg: '#5a0a0e', size: 36 }); if (kk > 0.5) k.card(ctx, "ANOTHER APP\u2019S WATERMARK \u274c", { y: 280, bg: '#5a0a0e', size: 34 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, { red: kk > 0.4 }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THE TIE-BREAKER WAS ASLEEP \ud83d\udca4", { y: 200, bg: '#1a1a24', size: 36 }); k.boom(ctx, (kk - 0.4) * 2.2, 360, 1000, 'ACHOO!'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Check if you're buried", ["Instagram: Settings \u2192 Account status.", "Look for 'Can your content be recommended?'", "Green = fine. Red = fix what it lists."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "TAG WHOSE POSTS DESERVE MORE \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
