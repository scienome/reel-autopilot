// 113-phone-at-night Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 113;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "YOUR PHONE\n*WAKES UP* AT NIGHT\nAND REPORTS YOU."); k.fileTag(ctx, N); }; return c; },
    night: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.rec(ctx, t, '03:00'); k.card(ctx, "SCREEN OFF. APPS ON. \ud83d\udce1", { y: 200, bg: '#1a1a24', size: 38 }); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "EACH LIGHT = A SLEEPING PHONE \ud83d\udca1", { y: 200, bg: '#1a1a24', size: 34 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "WHERE YOU ARE \ud83d\udccd", { y: 200, bg: '#5a0a0e', size: 36 }); if (kk > 0.33) k.card(ctx, kk > 0.66 ? 'HOW LONG YOU SLEPT 😴' : 'WHAT YOU DID 📝', { y: 280, bg: '#5a0a0e', size: 36 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "REPORT: HE SAYS 'PIZZA' IN HIS SLEEP \ud83c\udf55", { y: 200, bg: '#1a1a24', size: 30 }); k.boom(ctx, (kk - 0.4) * 2.2, 360, 1000, 'ORDERED'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Make your phone actually sleep", ["iPhone: Settings \u2192 General \u2192 Background App Refresh.", "Android: app info \u2192 Mobile data \u2192 restrict background.", "Turn it off for apps that don't need it."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "TAG WHO SLEEPS WITH THEIR PHONE \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
