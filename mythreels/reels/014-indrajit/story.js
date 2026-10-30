KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'palace', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'indra', 470, 1170, 0.66, t, { flip: true, arms: 'back', face: { eyes: 'sad', mouth: 'frown' } }); MYTH.chains(ctx, 380, 900, 560, 900, 8); char(ctx, 'meghnad', 200, 1170, 0.7, t, { holdL: 'bow', arms: { r: 'hips', l: 'rest' }, face: { eyes: 'open', mouth: 'grin' } }); } },
    b1: { set: 'battle', cam: CAM.wide, shake: V('b1', 'भयंकर'), draw: two('indra', { hold: 'vajra', arms: { r: 'up', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }, 'meghnad', { holdL: 'bow', hold: 'arrow', arms: { r: 'draw', l: 'bowL' }, face: { eyes: 'angry' } }, 0.62),
      over: (ctx, W, H_, t) => MYTH.lightning(ctx, 200, 500, 300, -100, t, 6) },
    b2: { set: 'sky', setOpt: { time: 'night' }, cam: CAM.wide, draw: (ctx, t) => { const u = H.clamp((t - V('b2', 'अदृश्य')) / 0.6); ctx.save(); ctx.globalAlpha = 1 - 0.85 * u; char(ctx, 'meghnad', 360, 1100, 0.6, t, { holdL: 'bow', arms: { r: 'up', l: 'rest' }, face: { eyes: 'angry', mouth: 'grin' } }); ctx.restore(); for (let i = 0; i < 5; i++) MYTH.cloud(ctx, 100 + i * 130, 760 + (i % 2) * 80, 1.4, '#3a3a5a', 0.85); if (t > V('b2', 'बाँध')) MYTH.chains(ctx, 120, 500, 600, 500, 16); } },
    b3: { set: 'ocean', setOpt: { time: 'night', lanka: true }, cam: CAM.wide, draw: (ctx, t) => { MYTH.vimana(ctx, 300, 600, 0.6, t); } },
    b4: { set: 'heaven', cam: CAM.mid, draw: one('brahma', { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }), over: cardOn('b4', 'इंद्रजीत।', 'इंद्रजीत', { y: 300, size: 80 }) },
    b5: { set: 'palace', cam: CAM.close(360), draw: one('meghnad', { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }) },
    b6: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.mid, draw: (ctx, t) => { MYTH.flame(ctx, 360, 1230, 1.4, t); char(ctx, 'meghnad', 360, 1140, 0.6, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); }, over: cardOn('b6', 'यज्ञ', 'यज्ञ = अजेय', { y: 300 }) },
    end: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.wide, shake: V('end', 'वध'), draw: two('lakshman', { holdL: 'bow', hold: 'arrow', arms: { r: 'draw', l: 'bowL' }, halo: true, face: { eyes: 'angry', mouth: 'calm' } }, 'meghnad', { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }, 0.66) },
  };
}, {"series": "रावण के रहस्य", "part": 12, "hook": "रावण के बेटे ने\nइंद्र को कैद किया!", "next": "रावण ने अपनी ही बहन\nके पति को मारा!", "nextAt": "nx", "gold": ["मेघनाद", "इंद्र", "इंद्रजीत।", "यज्ञ", "लक्ष्मण"]});
