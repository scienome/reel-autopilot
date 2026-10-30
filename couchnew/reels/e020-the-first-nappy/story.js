  // ==================== couch sitcom e020 "The First Nappy" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const GEAR = { top: '#f2f24a', top2: '#c8c830' };
    const goggles = (ctx, x, y) => { ctx.save(); ctx.lineWidth = 9; ctx.strokeStyle = '#2a8ad0'; ctx.fillStyle = 'rgba(160,220,255,0.35)'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + sd * 36, y, 40, 36, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); } ctx.restore(); };
    const mat = (ctx) => ADULT.poly(ctx, '#bfe2f2', [[200, 930], [520, 930], [540, 990], [180, 990]], 690);
    return {
      m1: { set: 'living', cam: [[260, 760, 1.3], [260, 750, 1.45]], draw: (ctx, t) => { maya(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'half', mouth: 'smirk' } }, 150); sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 380); } },
      s1: { set: 'living', cam: CU(380), draw: (ctx, t) => sam(ctx, t, { arms: 'hips', face: { eyes: 'half', mouth: 'smirk' } }, 380) },
      n2: { set: 'living', cam: CU(380), draw: (ctx, t) => sam(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o', sweat: 1 } }, 380), over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('n2') - 0.1, 'HE WAS NOT READY') },
      s2: { set: 'living', cam: CU(380), draw: (ctx, t) => { sam(ctx, t, { style: t > V('s2', 'Gloves') ? GEAR : null, arms: 'up', face: { eyes: 'open', mouth: 'flat' } }, 380); if (t > V('s2', 'Goggles')) goggles(ctx, 380, 715); if (t > V('s2', 'Peg')) ADULT.poly(ctx, '#e8384f', [[372, 742], [392, 742], [392, 772], [372, 772]], 695); } },
      mu1: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }, 600, 1150) },
      s3: { set: 'living', cam: CU(380), shake: V('s3', 'biohazard'), draw: (ctx, t) => { sam(ctx, t, { style: GEAR, arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout' } }, 380); goggles(ctx, 380, 715); },
        over: (ctx, W, H_, t) => { if (t > V('s3', 'biohazard') && Math.sin(t * 12) > 0) { ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#ff2030'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } } },
      n4: { set: 'living', cam: WIDE, draw: (ctx, t) => { mat(ctx); sam(ctx, t, { style: GEAR, arms: 'hold', face: { eyes: 'open', mouth: 'flat', sweat: 1 } }, 380); goggles(ctx, 380, 715); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'closed', mouth: 'flat' } }, 600, 1150); },
        over: (ctx, W, H_, t) => { if (t < first('s4')) timeCard(ctx, W, H_, t, first('n4') - 0.1, '40 MINUTES LATER'); } },
      s4: { set: 'living', cam: CU(380), draw: (ctx, t) => { sam(ctx, t, { style: GEAR, arms: 'up', bob: -18 * Math.abs(Math.sin(t * 10)), face: { eyes: 'happy', mouth: 'grin' } }, 380); goggles(ctx, 380, 715 - 18 * Math.abs(Math.sin(t * 10))); } },
      m2: { set: 'living', cam: [[260, 760, 1.3], [260, 750, 1.45]], draw: (ctx, t) => { maya(ctx, t, { arms: 'hold', hold: 'baby', face: { eyes: 'half', mouth: 'flat' } }, 150); ADULT.prop(ctx, 'nappy', 186, 860, t); sam(ctx, t, { style: GEAR, arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 380); goggles(ctx, 380, 715); } },
      mu2: { set: 'living', cam: CU(600, 760), draw: (ctx, t) => mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'closed', mouth: 'smirk' } }, 600, 1150) },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'smile' } }, 150); sam(ctx, t, { style: { top: '#f2f24a', top2: '#c8c830' }, arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }); mum(ctx, t, { pose: 'sit', arms: 'hold', hold: 'mug', face: { eyes: 'half', mouth: 'smirk' } }, 600, 1150); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n2', 'n4', 'n3'], sound: (k, { V, first }) => { k.play('powerup', V('s2', 'Peg'), { gain: 0.3 }); COUCH.sounds.twist(k, V('m2', 'head')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
