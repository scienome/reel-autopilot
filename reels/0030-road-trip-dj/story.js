  // ==================== 0030 "Road trip DJ." ====================
  const CAR = { set: 'car' };
  const DRIVE = [[1.2, 0.05, 0.4], [1.2, 0.05, 0.4]];
  const notes = (ctx, t, x, y, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#ffd23f'; ctx.font = FONT(900, 46); for (let i = 0; i < 3; i++) ctx.fillText('♪', x + i * 50 + Math.sin(t * 4 + i) * 10, y - ((t * 60 + i * 40) % 120)); ctx.restore(); };
  const vm = (c, w, h) => { c.fillStyle = '#f4f2f7'; c.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) { c.fillStyle = '#3cc46a'; c.fillRect(w * 0.12, h * (0.12 + i * 0.2), w * 0.76, h * 0.12); c.fillStyle = '#ffffff'; c.font = FONT(800, h * 0.045); c.textAlign = 'left'; c.fillText('MOM · voice note', w * 0.18, h * (0.19 + i * 0.2)); } };
  makeCouch({
    keys: ['road', 'trip', 'song', 'hours', 'band', 'one', 'driver', 'music', 'gas', 'phone', 'mom', 'two'],
    shots: ({ V }) => ({
      hook: { ...CAR, cam: 'wide', he: { arms: DRIVE, face: { eyes: 'happy', mouth: 'open' } }, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.5 } }, over: (ctx, W, H_, t) => notes(ctx, t, 220, 640, 1),
        fx: [{ k: 'card', text: 'DJ: HIM. ALWAYS.', at: V('hook', 'picks'), y: 990, fill: '#2a1a3a' }] },
      songs: { ...CAR, cam: 'her', she: { arms: 'slump', face: { eyes: 'closed', mouth: 'flat', brows: 0.6 } }, over: (ctx, W, H_, t) => notes(ctx, t, 420, 640, 1), fx: [{ k: 'stamp', text: '4 HOURS', x: 360, y: 1000, at: V('songs', 'Four'), col: '#ff6a5a' }] },
      her: { ...CAR, cam: 'two', he: { arms: DRIVE, face: { mouth: 'smile' } }, she: { arms: 'clasp', face: { mouth: 'smile', eyes: 'happy', brows: 0.5 } }, fx: [{ k: 'bubble', text: 'Just one song?', x: 420, y: 820, at: V('her', 'asks'), side: 1 }] },
      no: { ...CAR, cam: 'him', he: { arms: DRIVE, face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, nope: V('no', 'music'), fx: [{ k: 'bubble', text: 'Driver picks.', who: 'he', at: V('no', 'Driver'), side: -1 }] },
      plan: { set: 'street', cam: 'her', he: { hide: true }, she: { arms: 'phone', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, sheHold: true, fx: [{ k: 'smug', who: 'she', at: V('plan', 'connects') }, { k: 'card', text: 'BLUETOOTH: CONNECTED', at: V('plan', 'phone'), y: 1000, fill: '#1c1a2a', px: 34 }] },
      twist: { ...CAR, cam: 'him', he: { arms: DRIVE, face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, twist: V('twist', 'mom'), fx: [{ k: 'card', text: 'NOW PLAYING: MOM (2 HRS)', at: V('twist', 'voice'), y: 1000, fill: '#5a1020', px: 34 }, { k: 'sweat', who: 'he', at: V('twist', 'another') }] },
      close: { ...CAR, cam: 'her', she: { arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, sheHold: () => vm, fx: [{ k: 'bubble', text: 'Driver picks, babe.', x: 380, y: 820, at: V('close', 'Driver'), side: 1 }] },
    }),
  });
