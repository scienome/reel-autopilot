// 106-slipped-through Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 106;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, "YOU WEREN'T\nSUPPOSED TO\nSEE *THIS*."); k.fileTag(ctx, N); k.glitch(ctx, t, 0.6); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "DELETED EVERY NIGHT AT 3:00 \ud83d\uddd1\ufe0f", { y: 200, bg: '#5a0a0e', size: 34 }); }; return c; },
    why: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "IT SHOWS THE ROOM \ud83d\udc41\ufe0f", { y: 200, bg: '#1a1a24', size: 40 }); }; return c; },
    glitch: (t, kk) => { const c = k.roomScene(S, 'home', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.glitch(ctx, t, 1); k.noise(ctx, 0.15);k.card(ctx, "KEEP WATCHING", { y: 200, bg: '#5a0a0e', size: 40 }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx); k.glitch(ctx, t, 0.3); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "THE INTERN HIT 'BOOST' \ud83d\ude80", { y: 200, bg: '#1f6a3a', size: 38 }); k.boom(ctx, (kk - 0.3) * 2.2, 360, 1000, 'OOPS'); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "See everything they keep on you", ["Accounts Center \u2192 Your information and permissions.", "Tap 'Download your information'.", "Pick what you want. It's your right."]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, { red: true }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, "SEND IT TO ONE PERSON BEFORE IT'S GONE \ud83d\udc47", { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); k.glitch(ctx, t, 0.4); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
