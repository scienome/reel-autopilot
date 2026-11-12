// 105-notification Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 105;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'cityWide', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "A BILLIONAIRE JUST\nGOT A NOTIFICATION:\n*YOU'RE WATCHING THIS*."); k.fileTag(ctx, N); }; return c; },
    map: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "TINY CITY. TINY YOU. \ud83d\udcf1", { y: 200, bg: '#1a1a24', size: 40 }); }; return c; },
    hand: (t, kk) => { const c = k.roomScene(S, 'cityHand', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83d\udd0b CHECKING YOUR BATTERY\u2026", { y: 200, bg: '#1a1a24', size: 34 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'cityWide', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "ONE PERSON. EVERY NIGHT. TONIGHT: YOU", { y: 200, bg: '#5a0a0e', size: 30 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityHand', t, kk, { drop: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "PUT BACK 2 CM TO THE LEFT", { y: 200, bg: '#1a1a24', size: 34 }); k.boom(ctx, (kk - 0.35) * 2.2, 360, 1000, 'WIFI: 📶❌'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Who's logged into you?", ["Accounts Center \u2192 Password and security.", "Tap 'Where you're logged in'.", "Log out devices you don't know. Turn on two-factor."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'cityWide', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT 'SEEN' IF YOU'RE STILL HERE \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
