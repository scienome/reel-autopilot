KATHA((h) => {
  const { V, at, first, char, pulse, card, partTwo } = h;
  const BH = 'balhanuman';
  const swallow = V('b5', 'मुँह'), bolt = V('b8', 'ठोड़ी');
  return {
    // hook: a tiny child flying straight into the sun
    h1: { set: 'space', setOpt: { sx: 360, sy: 520, sr: 210 }, cam: [[360, 640, 1.0], [360, 600, 1.18]],
      draw: (ctx, t) => { const u = H.clamp((t - first('h1')) / 2.6); char(ctx, BH, 360 + 60 * (1 - u), 1150 - 420 * u, 0.32 - 0.1 * u, t, { pose: 'fly', arms: 'fly', lean: -0.35, glow: 'rgba(255,200,90,0.5)' }); } },
    h2: { set: 'forest', setOpt: { time: 'dawn', sun: true, sx: 560, sy: 600 }, cam: [[360, 820, 1.0], [360, 760, 1.9]],
      draw: (ctx, t) => char(ctx, BH, 360, 1150, 0.95, t, { halo: true, arms: 'bless', face: { eyes: 'happy', mouth: 'grin' } }),
      over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, V('h2', 'हनुमान'), 18) },
    b1: { set: 'forest', setOpt: { time: 'dawn', hut: 560 }, cam: [[360, 860, 1.25], [360, 800, 1.5]],
      draw: (ctx, t) => char(ctx, BH, 330, 1160, 0.9, t, { arms: 'belly', bob: Math.sin(t * 3) * 3, face: { eyes: t > V('b1', 'भूख') ? 'sad' : 'open', mouth: 'frown' } }) },
    // the "fruit" rises in the sky; he points at it
    b2: { set: 'forest', setOpt: { time: 'dawn', sun: true, sx: 560, sy: 470, sr: 80 }, cam: [[330, 880, 1.3], [440, 640, 1.15]],
      draw: (ctx, t) => char(ctx, BH, 280, 1160, 0.85, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'wide', look: [1, -1], mouth: 'o' } }) },
    hn1: { set: 'forest', setOpt: { time: 'dawn', sun: true, sx: 640, sy: 380, sr: 80 }, cam: [[360, 760, 2.3], [360, 740, 2.5]],
      draw: (ctx, t) => char(ctx, BH, 360, 1160, 0.9, t, { arms: 'fist', face: { eyes: 'happy', mouth: 'grin' } }),
      over: (ctx, W, H_, t) => { for (let i = 0; i < 6; i++) { const u = popU(t, first('hn1') + i * 0.12, 0.3); if (u > 0) FX.sparkle(ctx, 140 + (i * 97) % 440, 320 + (i * 61) % 200, 26 * u, t * 2 + i); } } },
    // flight
    b3: { set: 'sky', setOpt: { time: 'dawn', rush: true }, cam: [[360, 640, 1.0], [360, 640, 1.08]], shake: V('b3', 'सूरज'),
      draw: (ctx, t) => char(ctx, BH, 300, 1080 + Math.sin(t * 6) * 10, 0.9, t, { pose: 'fly', arms: 'fly', lean: 0.55, face: { eyes: 'happy', mouth: 'grin' }, glow: 'rgba(255,200,90,0.35)' }),
      over: (ctx, W, H_, t) => MYTH.speed(ctx, W, H_, t, 1, 0.45) },
    // the gods panic
    b4: { set: 'heaven', cam: [[360, 820, 1.1], [360, 800, 1.25]], shake: V('b4', 'घबरा'),
      draw: (ctx, t) => { char(ctx, 'deva', 150, 1150, 0.72, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }); char(ctx, 'deva', 570, 1150, 0.72, t, { flip: true, arms: 'open', face: { eyes: 'sad', mouth: 'o' }, style: { cloth: '#e0907a', skin: '#e8b48a' } });
        char(ctx, 'indra', 360, 1170, 0.82, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'wide', mouth: 'open' } }); } },
    // the swallow: the sun shrinks into his mouth
    b5: { set: 'space', setOpt: { sun: false }, cam: [[360, 700, 1.0], [360, 760, 1.25]],
      draw: (ctx, t) => { const u = H.clamp((t - swallow) / 0.6), e = H.ease.inOut(u), hx = 360, hy = 1240 - 450 * 0.95 * 0.75;
        const p = char(ctx, BH, 360, 1240, 0.95, t, { pose: 'fly', arms: 'open', glow: u >= 1 ? 'rgba(255,190,80,0.5)' : null, face: { eyes: u < 1 ? 'wide' : 'happy', mouth: u < 0.1 ? 'open' : u < 1 ? 'shout' : 'puff' } });
        if (u < 1) MYTH.sun(ctx, H.lerp(360, p.mouth[0], e), H.lerp(330, p.mouth[1], e), H.lerp(190, 10, e), t); } },
    b6: { set: 'forest', setOpt: { time: 'day', hut: 540 }, cam: [[360, 760, 1.0], [360, 700, 1.1]],
      draw: (ctx, t) => char(ctx, 'villager', 220, 1150, 0.6, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o', look: [0.5, -1] } }),
      over: (ctx, W, H_, t) => { const a = H.clamp((t - V('b6', 'अंधेरा')) / 0.8); MYTH.dark(ctx, W, H_, 0.15 + a * 0.75); if (a > 0.3) MYTH.stars(ctx, W, H_, t, 60, a); } },
    // Indra's thunderbolt
    b7: { set: 'heaven', cam: [[360, 760, 1.3], [360, 700, 1.55]], shake: V('b7', 'वज्र'),
      draw: (ctx, t) => char(ctx, 'indra', 360, 1160, 0.9, t, { hold: 'vajra', arms: h.AT(t, [[0, { r: 'rest', l: 'hips' }], [V('b7', 'वज्र') - 0.3, { r: 'up', l: 'hips' }]]), face: { eyes: 'angry', mouth: 'shout' } }),
      over: (ctx, W, H_, t) => { MYTH.dark(ctx, W, H_, 0.35); if (t > V('b7', 'वज्र')) { MYTH.lightning(ctx, 470, 380, 640, -100, t, 7); MYTH.lightning(ctx, 470, 380, 300, -100, t + 0.3, 5); } } },
    // it hits his chin; he falls and the sun is free
    b8: { set: 'space', setOpt: { sun: false }, cam: [[360, 700, 1.05], [360, 780, 1.0]], shake: bolt,
      draw: (ctx, t) => { const u = H.clamp((t - bolt - 0.15) / 1.2);
        if (u > 0) MYTH.sun(ctx, 360 + 200 * H.ease.out(u), 640 - 300 * H.ease.out(u), 20 + 120 * H.ease.out(u), t);
        const p = char(ctx, BH, 360, 1180 + 300 * u * u, 0.9, t, { pose: 'fly', arms: u > 0 ? 'open' : 'fist', lean: 1.4 * u * u, face: { eyes: u > 0 ? 'closed' : 'happy', mouth: u > 0 ? 'o' : 'puff' } });
        if (t > bolt - 0.05 && t < bolt + 0.5) MYTH.lightning(ctx, 360, -80, p.mouth[0], p.mouth[1] + 20, t, 10);
        MYTH.shock(ctx, p.mouth[0], p.mouth[1] + 20, t, bolt, 'rgba(200,230,255,'); },
      over: (ctx, W, H_, t) => { const f = pulse(t, bolt, 0.3); if (f > 0) { ctx.fillStyle = `rgba(255,255,255,${0.7 * f})`; ctx.fillRect(0, 0, W, H_); } } },
    // the name: hanu = jaw
    b9: { set: 'forest', setOpt: { time: 'day' }, cam: [[360, 760, 2.1], [360, 740, 2.35]],
      draw: (ctx, t) => { const p = char(ctx, BH, 360, 1160, 0.9, t, { halo: t > V('b9', 'हनुमान'), arms: 'down', face: { eyes: t > V('b9', 'हनुमान') ? 'happy' : 'calm', mouth: 'smile' } });
        const g = 0.5 + 0.5 * Math.sin(t * 6); ctx.save(); ctx.globalAlpha = 0.5 * g; ctx.fillStyle = '#9ad8ff'; ctx.beginPath(); ctx.arc(p.mouth[0], p.mouth[1] + 28, 26, 0, Math.PI * 2); ctx.fill(); ctx.restore(); },
      over: (ctx, W, H_, t) => { if (t < V('b9', 'इसीलिए')) card(ctx, W, H_, t, V('b9', 'हनु'), 'हनु = ठोड़ी', { y: 330, size: 62 }); else card(ctx, W, H_, t, V('b9', 'हनुमान'), 'हनुमान', { y: 330, size: 80 }); MYTH.petals(ctx, W, t, V('b9', 'हनुमान'), 22); } },
    // the cliffhanger: the wind god stops all air
    b10: { set: 'sky', setOpt: { time: 'dusk' }, cam: [[360, 760, 1.2], [360, 700, 1.7]], shake: V('b10', 'रोक'),
      draw: (ctx, t) => char(ctx, 'vayu', 360, 1170, 0.95, t, { glow: 'rgba(200,230,255,0.4)', arms: h.AT(t, [[0, 'down'], [V('b10', 'क्रोधित') - 0.2, 'open']]), face: { eyes: t > V('b10', 'क्रोधित') ? 'angry' : 'sad', mouth: t > V('b10', 'क्रोधित') ? 'frown' : 'calm' } }),
      over: (ctx, W, H_, t) => { const a = H.clamp((t - V('b10', 'रोक')) / 0.6); MYTH.dark(ctx, W, H_, 0.1 + a * 0.45); } },
    end: { set: 'heaven', cam: [[360, 760, 1.15], [360, 740, 1.2]],
      draw: (ctx, t) => char(ctx, 'hanuman', 360, 1170, 0.85, t, { halo: true, hold: 'gada', arms: { r: 'rest', l: 'bless' }, face: { eyes: 'calm', mouth: 'smile' } }),
      over: (ctx, W, H_, t) => { partTwo(ctx, W, H_, t, first('end') + 0.2); MYTH.petals(ctx, W, t, V('end', 'जय'), 30); } },
  };
}, {
  title: 'हनुमान और सूरज',
  gold: ['सूरज', 'हनुमान।', 'हनुमान', 'फल', 'वज्र', 'हनु', 'पवन', 'हवा'],
  noSub: [],
  sound: (k, h) => { k.play('riser', h.V('b3', 'उड़') - 0.4, { dur: 1.2, gain: 0.25 }); k.play('impact', h.V('b8', 'ठोड़ी'), { gain: 0.5 }); k.play('bell', h.V('end', 'जय'), { gain: 0.3 }); },
});
