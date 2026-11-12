// 101-viral-room Elite Files 'the room' (fiction + a real tip at the end). Shared set: k.roomSet() (model city + giant hand, the algorithm room, you at home).
STORY((k) => {
  const { T, M, PI } = k; const S = k.roomSet(); let ov = null; const N = 101;
  const shots = {
    hook: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.hookText(ctx, 'THIS VIDEO GOT\n*APPROVED*.\nYOURS DIDN\'T.'); k.stamp(ctx, 'APPROVED', (kk - 0.3) * 2, 360, 980, '#1fa84a'); k.fileTag(ctx, N); }; return c; },
    room: (t, kk) => { const c = k.roomScene(S, 'room', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.counter(ctx, 'VIDEOS TODAY', `${Math.floor(30 + kk * 60)} MILLION`, { y: 170 }); }; return c; },
    vote: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, { red: kk > 0.5 }); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, kk < 0.5 ? '👍 → MILLIONS' : '👎 → YOUR AUNT', { y: 200, bg: kk < 0.5 ? '#1f6a3a' : '#5a0a0e', size: 44 }); }; return c; },
    you: (t, kk) => { const c = k.roomScene(S, 'cityYou', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, 'THIS IS YOU 📱', { y: 200, bg: '#5a0a0e', size: 44 }); k.phoneShot(ctx, (kk - 0.5) * 2, { label: 'YOU. WATCHING THIS.' }); }; return c; },
    promise: (t, kk) => { const c = k.roomScene(S, 'cityHand', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.promise(ctx, '🔒 HOW TO GET PAST THEM: AT THE END'); }; return c; },
    twist: (t, kk) => { const c = k.roomScene(S, 'leader', t, kk, { red: false }); ov = (ctx) => { k.night(ctx, t, 0.35); k.boom(ctx, (kk - 0.2) * 2, 360, 1000, '🐈 AGAIN?!'); k.card(ctx, 'TODAY\'S PICK: CAT FALLS OFF FRIDGE', { y: 200, bg: '#1a1a24', size: 32 }); }; return c; },
    tip: (t, kk) => { const c = k.roomScene(S, 'tip', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.tip(ctx, kk * 1.3, "How to actually go viral", ["Shares (sends) beat likes. Instagram's boss said so.", "Make something people want to send to one friend.", "So: send this to someone \ud83d\ude09"]); }; return c; },
    outro: (t, kk) => { const c = k.roomScene(S, 'wall', t, kk, {}); ov = (ctx) => { k.night(ctx, t, 0.35); k.card(ctx, 'SEND THIS TO SOMEONE 👇 TEST THE ROOM', { y: 1185, bg: '#5a0a0e', size: 28 }); k.fileTag(ctx, N); }; return c; },
  };
  return { shots, sky: '#060a14', capStyle: 'film', lens: 24, table: false, fog: ['#0b1224', 0.03], light: { sun: [-4, 10, 6], key: 0.7, fill: 0.2, rim: 0.6, color: '#9ab4ff', shadow: 14, exposure: 1.3, grade: false },
    over: (ctx, t) => { if (ov) ov(ctx); ov = null; k.grabFrame(ctx); } };
}, { assets: ['elite/man_hoodie'] });
