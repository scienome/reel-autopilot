// 109-three-seconds Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 109;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "THEY'RE *TIMING*\nHOW LONG YOU\nWATCH THIS."); k.fileTag(ctx, N); }; return c; },
    clock: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'COUNTDOWN', `${Math.max(0, 3 - Math.floor(kk * 4))}`, { y: 170 }); if (kk > 0.75) k.stamp(ctx, 'YOU\'RE IN', (kk - 0.75) * 4, 360, 1000, '#1fa84a'); }; return c; },
    what: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "'THE STAYERS' \ud83d\udd70\ufe0f", { y: 200, bg: '#1a1a24', size: 44 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "STAYERS SEE DIFFERENT VIDEOS \ud83d\udc41\ufe0f", { y: 200, bg: '#1a1a24', size: 34 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "PRIZE: +1 SECOND OF LIFE \u23f1\ufe0f", { y: 200, bg: '#1f6a3a', size: 36 }); k.boom(ctx, (kk - 0.5) * 2.2, 360, 1000, 'USED.'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "If you post: the 3-second rule", ["Start with the most interesting moment.", "No 'hi guys'. No logo intro.", "Watch time is one of the biggest signals."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT YOUR WATCH TIME \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
