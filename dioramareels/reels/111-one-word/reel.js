// 111-one-word Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 111;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "COMMENT *ONE WORD*.\nTHEY READ\nEVERY ONE."); k.fileTag(ctx, N); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "\ud83d\udcac \u2192 \ud83e\uddf1 \u2192 \ud83d\udc41\ufe0f", { y: 200, bg: '#1a1a24', size: 44 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "BRAVE", { y: 200, bg: '#1a1a24', size: 50 }); if (kk > 0.33) k.card(ctx, kk > 0.66 ? 'PIZZA 🍕' : 'TIRED', { y: 290, bg: '#1a1a24', size: 50 }); }; return c; },
    proof: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THEN YOUR FEED CHANGED\u2026 \ud83d\udd04", { y: 200, bg: '#5a0a0e', size: 36 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SOMEONE WROTE 'BANANA' \ud83c\udf4c", { y: 200, bg: '#c8a21e', size: 40 }); k.boom(ctx, (kk - 0.35) * 2.2, 360, 1000, 'DEBATE'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Control who can reach you", ["Instagram Settings \u2192 Limits (limited interactions).", "Only people you know can comment or message.", "Perfect for bad days. Turn off anytime."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT ONE WORD. IF YOU DARE \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
