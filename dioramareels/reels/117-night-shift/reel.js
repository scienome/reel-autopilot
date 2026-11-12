// 117-night-shift Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 117;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "VIDEOS AT *2 AM*\nFEEL DIFFERENT.\nHERE'S WHY."); k.fileTag(ctx, N); }; return c; },
    swap: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83c\udf19 MIDNIGHT: SHIFT CHANGE", { y: 200, bg: '#1a1a24', size: 38 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THEY KNOW YOU'RE TIRED \ud83e\udd71", { y: 200, bg: '#5a0a0e', size: 38 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "WATCHING AT NIGHT? THEY PICKED YOU", { y: 200, bg: '#5a0a0e', size: 30 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "PICKS VIDEOS BY WHAT HIS CEREAL SPELLS \ud83e\udd63", { y: 200, bg: '#1a1a24', size: 28 }); k.boom(ctx, (kk - 0.45) * 2.2, 360, 1000, 'CRUNCH'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Send the night shift home", ["Instagram: Settings \u2192 Notifications \u2192 Quiet mode.", "Set your night hours.", "YouTube: Settings \u2192 General \u2192 bedtime reminder."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT WHAT TIME IT IS FOR YOU \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
