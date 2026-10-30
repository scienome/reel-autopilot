  // ==================== couch sitcom e017 "The Gender Reveal" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const pink = (ctx, W, H_, t, at) => { if (t < at) return; ctx.save(); for (let i = 0; i < 10; i++) { const u = ((t - at) * 0.5 + i / 10) % 1; ctx.globalAlpha = 0.4 * (1 - u); ctx.fillStyle = '#ff7ab0'; ctx.beginPath(); ctx.arc(300 + Math.sin(i * 2 + t) * 120, 800 - u * 700, 60 + u * 120, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); };
    const SCARF = { top: '#4f8a78', top2: '#3e6f60' };
    const scarf = (ctx, t, x, burning) => { ADULT.blob(ctx, '#ff6aa8', [[x - 62, 812], [x + 62, 812], [x + 54, 842], [x - 54, 842], [x + 40, 900], [x + 20, 905]], 670); if (burning) ADULT.fire(ctx, x + 40, 900, 0.3, t); };
    return {
      s1: { set: 'kitchen', cam: [[300, 760, 1.2], [300, 750, 1.35]], draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'cake', face: { eyes: 'happy', mouth: 'grin' } }, 300) },
      mu1: { set: 'kitchen', cam: CU(600), draw: (ctx, t) => { mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat', look: [-1, 0] } }, 600); scarf(ctx, t, 600, false); } },
      s2: { set: 'kitchen', cam: CU(300), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'cake', face: { eyes: 'wide', mouth: 'grin', sweat: 1, brows: 1 } }, 300) },
      n2: { set: 'kitchen', setOpt: { fire: 0, smoke: 0 }, cam: WIDE, shake: first('n2'), draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }, 140); sam(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', sweat: 1 } }, 380); mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }, 600); scarf(ctx, t, 600, true); },
        over: (ctx, W, H_, t) => { pink(ctx, W, H_, t, first('n2')); if (t < first('m1')) timeCard(ctx, W, H_, t, first('n2') - 0.1, '10 SECONDS LATER'); } },
      m1: { set: 'kitchen', setOpt: { smoke: 0 }, cam: CU(140), draw: (ctx, t) => maya(ctx, t, { arms: 'point', face: { eyes: 'wide', mouth: 'open' } }, 140), over: (ctx, W, H_, t) => pink(ctx, W, H_, t, 0) },
      s3: { set: 'kitchen', setOpt: { smoke: 0 }, cam: CU(380), shake: first('s3'), draw: (ctx, t) => sam(ctx, t, { arms: 'up', bob: -24 * Math.abs(Math.sin(t * 10)), face: { eyes: 'happy', mouth: 'grin', tears: 1 } }, 380), over: (ctx, W, H_, t) => pink(ctx, W, H_, t, 0) },
      mu2: { set: 'kitchen', setOpt: { smoke: 0 }, cam: [[600, 760, 1.6], [600, 750, 1.8]], draw: (ctx, t) => { mum(ctx, t, { arms: 'point', face: { eyes: 'half', mouth: 'flat' } }, 600); scarf(ctx, t, 600, true); },
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'FWOOSH!', 360, 430, popU(t, V('mu2', 'fire'), 0.25), '#ff8a3a') },
      s4: { set: 'kitchen', cam: CU(380), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', face: { eyes: 'open', mouth: 'o', sweat: 1 } }, 380) },
      m2: { set: 'kitchen', cam: [[260, 760, 1.3], [260, 750, 1.45]], draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'happy', mouth: 'smile', tears: 1, blush: 1 } }, 140); sam(ctx, t, { arms: 'up', face: { eyes: 'happy', mouth: 'grin', tears: 1 } }, 380); },
        over: (ctx, W, H_, t) => { for (let i = 0; i < 7; i++) { const u = t - V('m2', 'girl') - i * 0.1; if (u > 0) FX.heart(ctx, 100 + i * 85, 760 - u * 150, 46 * popU(t, V('m2', 'girl') + i * 0.1, 0.3), 0); } } },
      n3: { set: 'kitchen', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'cheeks', face: { eyes: 'happy', mouth: 'smile' } }, 140); sam(ctx, t, { arms: 'hold', hold: 'cakeout', face: { eyes: 'happy', mouth: 'grin' } }, 380); mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk' } }, 600); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n2', 'n3'], sound: (k, { V, first }) => { k.play('impact', first('n2'), { gain: 0.5 }); COUCH.sounds.heart(k, V('m2', 'girl'), 5); k.play('stamp', first('n3'), { gain: 0.45 }); } });
