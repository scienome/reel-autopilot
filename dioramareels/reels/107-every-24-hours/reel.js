// 107-every-24-hours Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 107;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "THIS VIDEO GETS\n*DELETED* EVERY DAY.\nSOMEONE RE-UPLOADS IT."); k.fileTag(ctx, N); }; return c; },
    who: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'RE-UPLOADS', `${Math.floor(300 + kk * 400)}`, { y: 170 }); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "BANS \u274c", { y: 200, bg: '#5a0a0e', size: 38 }); if (kk > 0.5) k.card(ctx, 'A STRONGLY WORDED EMAIL 📧', { y: 280, bg: '#5a0a0e', size: 34 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SEAT 10: THE ONE WHO QUIT \ud83e\ude91", { y: 200, bg: '#1a1a24', size: 36 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "IT'S HIS MUM \ud83d\udc75\u2764\ufe0f", { y: 200, bg: '#1f6a3a', size: 44 }); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "Who sends your activity to Instagram?", ["Accounts Center \u2192 Your information and permissions.", "Tap 'Your activity off Meta technologies'.", "Disconnect apps and sites you don't want."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "COMMENT THE TIME YOU SAW THIS \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
