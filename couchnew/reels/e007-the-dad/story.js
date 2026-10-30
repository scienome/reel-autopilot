  // ==================== couch sitcom e007 "The Dad" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const dad = (ctx, t, o, x = 580, y = 1150) => char(ctx, 'dad', x, y, 0.82, t, o, { dad: x, sam: X.sam, maya: X.maya, mum: 120 });
    const table = (ctx) => ADULT.poly(ctx, '#8a5a3a', [[230, 900], [710, 900], [690, 1000], [250, 1000]], 600);
    const wrestle = (ctx, t, winL, at) => { const k = H.clamp((t - at) / 0.25); const a = winL ? 1 : -1; ADULT.line(ctx, [[400, 880], [470 + a * 70 * k, 820 + 50 * k]], 34, ADULT.INK, 610); ADULT.line(ctx, [[540, 880], [470 + a * 70 * k, 820 + 50 * k]], 34, ADULT.INK, 611); ADULT.oval(ctx, '#f0c6a0', 470 + a * 70 * k, 815 + 50 * k, 30, 26, 612); };
    return {
      c1: { set: 'living', cam: WIDE, draw: (ctx, t) => { maya(ctx, t, { arms: 'wave', face: { mouth: 'grin' } }); sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o', sweat: 1 } }); dad(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat', brows: -0.6 } }); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('c1') - 0.1, "MAYA'S DAD") },
      d1: { set: 'living', cam: CU(580), draw: (ctx, t) => dad(ctx, t, { arms: AT(t, [[0, 'cross'], [V('d1', 'proposed') - 0.2, 'point']]), flip: true, face: { eyes: 'angry', mouth: 'flat', brows: -1 } }) },
      s1: { set: 'living', cam: CU(360), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', face: { eyes: 'wide', mouth: 'grin', sweat: 1, brows: 1 } }) },
      d2: { set: 'living', cam: [[470, 780, 1.4], [470, 770, 1.6]], shake: V('d2', 'Now'), draw: (ctx, t) => { sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 330); dad(ctx, t, { arms: 'up', flip: true, face: { eyes: 'angry', mouth: 'shout', brows: -1 } }, 610); table(ctx); } },
      s2: { set: 'living', cam: [[470, 820, 1.6], [470, 820, 1.75]], shake: V('s2', 'Easy') + 0.5, draw: (ctx, t) => { const lost = t > V('s2', 'Easy') + 0.5; sam(ctx, t, { arms: 'hold', squash: lost ? 0.92 : 1, face: { eyes: lost ? 'wide' : 'half', mouth: lost ? 'shout' : 'smirk', sweat: lost ? 1 : 0 } }, 330); dad(ctx, t, { arms: 'hold', flip: true, face: { eyes: 'half', mouth: 'smirk' } }, 610); table(ctx); wrestle(ctx, t, false, V('s2', 'Easy') + 0.4); },
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'SLAM!', 360, 420, popU(t, V('s2', 'Easy') + 0.5, 0.25)) },
      m1: { set: 'living', cam: CU(150), draw: (ctx, t) => maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'flat' } }) },
      mu1: { set: 'living', cam: [[470, 820, 1.6], [470, 820, 1.75]], shake: V('mu1', 'turn') + 0.6, draw: (ctx, t) => { const won = t > V('mu1', 'turn') + 0.6; mum(ctx, t, { arms: 'hold', face: { eyes: 'half', mouth: 'smirk' } }, 330); dad(ctx, t, { arms: 'hold', flip: true, squash: won ? 0.9 : 1, face: { eyes: won ? 'wide' : 'open', mouth: won ? 'shout' : 'flat', sweat: 1 } }, 610); table(ctx); wrestle(ctx, t, true, V('mu1', 'turn') + 0.5); },
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'CRACK!', 360, 420, popU(t, V('mu1', 'turn') + 0.6, 0.25), '#ff6a7a') },
      d3: { set: 'living', cam: CU(580), draw: (ctx, t) => dad(ctx, t, { arms: 'cheeks', flip: true, face: { eyes: 'sad', mouth: 'frown', tears: 1 } }) },
      d4: { set: 'living', cam: [[470, 760, 1.4], [470, 760, 1.55]], draw: (ctx, t) => { sam(ctx, t, { arms: 'hold', face: { eyes: 'wide', mouth: 'grin', sweat: 1 } }, 360); dad(ctx, t, { arms: AT(t, [[0, 'wave'], [V('d4', 'Run') - 0.2, 'point']]), flip: true, face: { eyes: t > V('d4', 'Run') - 0.2 ? 'wide' : 'happy', mouth: t > V('d4', 'Run') - 0.2 ? 'shout' : 'smile' } }, 590); } },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { maya(ctx, t, { arms: 'hips', face: { mouth: 'smirk' } }); sam(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }); mum(ctx, t, { arms: 'up', face: { eyes: 'happy', mouth: 'grin' } }, 600); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['c1', 'n3'], sound: (k, { V, first }) => { k.play('impact', V('s2', 'Easy') + 0.5, { gain: 0.5 }); k.play('impact', V('mu1', 'turn') + 0.6, { gain: 0.6 }); COUCH.sounds.twist(k, V('d4', 'Run')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
