  // ==================== couch sitcom e015 "Baby Names" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    return {
      m1: { set: 'cafe', cam: [[260, 760, 1.3], [260, 750, 1.45]], draw: (ctx, t) => { maya(ctx, t, { arms: 'hold', hold: 'paper', face: { eyes: 'open', mouth: 'smile' } }, 150); sam(ctx, t, { arms: 'hips', face: { eyes: 'happy', mouth: 'grin' } }, 380); } },
      s1: { set: 'cafe', cam: CU(380), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'doughnut', face: { eyes: 'happy', mouth: 'grin' } }, 380) },
      m2: { set: 'cafe', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }, 150) },
      s2: { set: 'cafe', cam: CU(380), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', face: { eyes: 'open', mouth: 'grin', brows: 1 } }, 380) },
      m3: { set: 'cafe', cam: CU(150), shake: first('m3'), draw: (ctx, t) => maya(ctx, t, { arms: 'facepalm', face: { eyes: 'angry', mouth: 'shout' } }, 150) },
      mu1: { set: 'living', cam: CU(580), draw: (ctx, t) => mum(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu1', 'My') - 0.2, 'hips']]), face: { eyes: 'half', mouth: 'smirk' } }) },
      s3: { set: 'living', cam: [[470, 760, 1.3], [470, 750, 1.45]], draw: (ctx, t) => { sam(ctx, t, { arms: 'shrug', face: { eyes: 'open', mouth: 'o' } }, 360); mum(ctx, t, { arms: 'cross', face: { eyes: 'wide', mouth: 'flat' } }); } },
      mu2: { set: 'living', cam: CU(580), draw: (ctx, t) => mum(ctx, t, { arms: 'point', flip: true, face: { eyes: 'angry', mouth: 'flat' } }) },
      s4: { set: 'living', cam: CU(360), draw: (ctx, t) => sam(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', sweat: 1 } }) },
      mu3: { set: 'living', cam: [[580, 740, 1.7], [580, 730, 2.2]], shake: first('mu3'), draw: (ctx, t) => mum(ctx, t, { arms: 'up', face: { eyes: 'closed', mouth: 'smile' } }),
        over: (ctx, W, H_, t) => { const u = popU(t, first('mu3'), 0.3); if (u <= 0) return; ctx.save(); ctx.globalAlpha = 0.35 * u; for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? '#fff6c8' : '#ffffff'; ctx.beginPath(); ctx.moveTo(360, 640); const a = i * 0.63 + t * 0.4; ctx.lineTo(360 + Math.cos(a) * 900, 640 + Math.sin(a) * 900); ctx.lineTo(360 + Math.cos(a + 0.2) * 900, 640 + Math.sin(a + 0.2) * 900); ctx.fill(); } ctx.restore(); ADULT.card(ctx, 'BRENDA', 360, 430, u, '#ffd23f', ADULT.INK, 70); } },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }); sam(ctx, t, { arms: 'shrug', face: { eyes: 'wide', mouth: 'o' } }); mum(ctx, t, { arms: 'hips', face: { eyes: 'happy', mouth: 'grin' } }); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n3'], sound: (k, { V, first }) => { COUCH.sounds.twist(k, first('mu3')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
