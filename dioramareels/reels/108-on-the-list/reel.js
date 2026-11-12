// 108-on-the-list Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 108;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "IF THIS REACHED YOU,\nYOU'RE *ON THE LIST*."); k.fileTag(ctx, N); }; return c; },
    list: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83d\udcdc THE LIST", { y: 200, bg: '#1a1a24', size: 44 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "MOST PEOPLE SCROLLED PAST. NOT YOU.", { y: 200, bg: '#5a0a0e', size: 30 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'cityHand', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'YOUR RANK', `↑ ${Math.min(3, 1 + Math.floor(kk * 3))}`, { y: 170 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "IT'S A NEWSLETTER \ud83d\udcf0 (WEEKLY)", { y: 200, bg: '#1a1a24', size: 36 }); k.stamp(ctx, 'NO UNSUBSCRIBE', (kk - 0.4) * 2, 360, 1000); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Filter the creeps automatically", ["Instagram Settings \u2192 Hidden Words.", "Turn on hiding for comments and message requests.", "Add your own words to block."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT IF YOU'RE ON IT \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
