// 121-knows-when-you-stop Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 121;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "THIS VIDEO KNOWS\nWHEN YOU'LL\n*STOP WATCHING*."); k.fileTag(ctx, N); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'EVERYONE LEAVES AT', '0:09', { y: 170 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "YOU'RE PAST IT. YOU BROKE THE GRAPH \ud83d\udcc8", { y: 200, bg: '#1f6a3a', size: 30 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "NOW IT'S WATCHING YOU \ud83d\udc41\ufe0f", { y: 200, bg: '#5a0a0e', size: 38 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THEIR WEAKNESS: YOU PUT THE PHONE DOWN \ud83d\udcf5", { y: 200, bg: '#1a1a24', size: 28 }); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Use the room's weakness", ["YouTube: Settings \u2192 General.", "Turn on 'Remind me to take a break'.", "Set 30 minutes. Then actually take it."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT THE SECOND YOU ALMOST LEFT \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
