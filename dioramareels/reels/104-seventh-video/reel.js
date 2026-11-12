// 104-seventh-video Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 104;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "EVERY *7TH* VIDEO\nIS PAID FOR.\nTHIS IS #7."); k.fileTag(ctx, N); }; return c; },
    count: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'VIDEO', `#${Math.min(7, 1 + Math.floor(kk * 7))}`, { y: 170 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "#7 = TIRED THUMB \ud83d\udc4d\ud83d\ude34", { y: 200, bg: '#1a1a24', size: 40 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "A SHOE \ud83d\udc5f", { y: 200, bg: '#1a1a24', size: 40 }); if (kk > 0.4) k.card(ctx, kk > 0.7 ? 'AN IDEA 💡' : 'A SONG 🎵', { y: 280, bg: '#1a1a24', size: 40 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "TODAY'S #7: HIS OWN AUTOBIOGRAPHY \ud83d\udcd5", { y: 200, bg: '#1a1a24', size: 30 }); k.stamp(ctx, '0 SOLD', (kk - 0.4) * 2, 360, 1000); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "See why they picked you", ["On any ad, tap the three dots \u22ef", "Tap 'Why am I seeing this ad?'", "See the reasons and change your ad settings."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT WHAT YOUR #7 WAS \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
