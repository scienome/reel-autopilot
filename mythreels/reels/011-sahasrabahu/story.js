KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'palace', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'ravana', 360, 1170, 0.7, t, { arms: 'back', face: { eyes: 'angry', mouth: 'frown' } }); MYTH.chains(ctx, 170, 900, 550, 900, 14); MYTH.chains(ctx, 200, 1000, 520, 1000, 12); } },
    b1: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { MYTH.ell(ctx, '#9aa4b4', 520, 1120, 40, 70, 0, 5); char(ctx, 'ravana', 250, 1170, 0.6, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b2: { set: 'river', cam: CAM.wide, shake: V('b2', 'उल्टी'), draw: (ctx, t) => { char(ctx, 'ravana', 300, 1170, 0.62, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }); },
      over: (ctx, W, H_, t) => { const u = H.clamp((t - V('b2', 'उल्टी')) / 1.0); ctx.fillStyle = `rgba(60,120,200,${0.45 * u})`; ctx.fillRect(0, 1280 - 600 * u, W, 600 * u); } },
    b3: { set: 'palace', cam: CAM.mid, draw: one('sahasrabahu', { halo: true, arms: 'open', face: { eyes: 'open', mouth: 'smile' } }), over: cardOn('b3', 'हज़ार', '1000 भुजाएँ', { y: 300, size: 70 }) },
    b4: { set: 'battle', cam: CAM.wide, shake: V('b4', 'टिक'), draw: two('ravana', { hold: 'sword', arms: { r: 'up', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }, 'sahasrabahu', { arms: 'fist', face: { eyes: 'angry', mouth: 'grin' } }, 0.62) },
    b5: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ravana', 360, 1170, 0.75, t, { arms: 'back', face: { eyes: 'sad', mouth: 'frown' } }); if (t > V('b5', 'बाँधा,')) { MYTH.chains(ctx, 170, 900, 550, 900, 14); MYTH.chains(ctx, 200, 1000, 520, 1000, 12); } } },
    end: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'sage', 500, 1170, 0.66, t, { flip: true, halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); char(ctx, 'sahasrabahu', 200, 1170, 0.6, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); } },
  };
}, {"series": "रावण के रहस्य", "part": 9, "hook": "एक राजा ने रावण को\nजानवर की तरह बाँधा!", "next": "रावण ने अपने ही भाई से\nउड़ता महल छीना", "nextAt": "nx", "gold": ["रावण", "हज़ार", "भुजाएँ", "कार्तवीर्य", "पुलस्त्य"]});
