  // ==================== couch sitcom e009 "The Stag Night" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sam = (ctx, t, o, x = X.sam, y = 1160) => char(ctx, 'sam', x, y, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya, y = 1150) => char(ctx, 'maya', x, y, 0.8, t, o, X), mum = (ctx, t, o, x = X.mum, y = 1140) => char(ctx, 'mum', x, y, 0.8, t, o, X);
    const WIDE = [[370, 760, 1.0], [370, 770, 1.06]], CU = (x, y = 730) => [[x, y, 1.9], [x, y - 10, 2.15]];
    const fr = (ctx, t, o, x = 560, y = 1155) => char(ctx, 'friend', x, y, 0.82, t, o, { friend: x, sam: 300, mum: 580 });
    const cards = (ctx, x, y) => { ADULT.poly(ctx, '#fff6d8', [[x - 60, y - 40], [x + 60, y - 40], [x + 60, y + 40], [x - 60, y + 40]], 620); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) ADULT.oval(ctx, (i + j) % 3 ? '#fff6d8' : '#e8384f', x - 42 + j * 28, y - 22 + i * 22, 9, 8, 621 + i * 4 + j, 2, 8); };
    return {
      f1: { set: 'cafe', cam: [[430, 770, 1.2], [430, 760, 1.35]], draw: (ctx, t) => { sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'grin' } }, 300); fr(ctx, t, { arms: 'up', bob: -18 * Math.abs(Math.sin(t * 9)), flip: true, face: { eyes: 'happy', mouth: 'grin' } }); } },
      s1: { set: 'cafe', cam: CU(300), draw: (ctx, t) => sam(ctx, t, { arms: 'shrug', face: { eyes: 'open', mouth: 'grin' } }, 300) },
      f2: { set: 'cafe', cam: CU(560), draw: (ctx, t) => fr(ctx, t, { arms: 'point', flip: true, face: { eyes: 'half', mouth: 'smirk' } }),
        over: (ctx, W, H_, t) => { if (t > V('f2', 'wild')) { ctx.save(); ctx.globalAlpha = 0.25 + 0.15 * Math.sin(t * 18); ctx.fillStyle = ['#ff3a8a', '#3ab0ff', '#ffd23f'][Math.floor(t * 6) % 3]; ctx.fillRect(0, 0, W, H_); ctx.restore(); } } },
      n2: { set: 'living', cam: WIDE, draw: (ctx, t) => { sam(ctx, t, { pose: 'sit', arms: 'hold', face: { eyes: 'wide', mouth: 'o' } }, 250, 1150); fr(ctx, t, { pose: 'sit', arms: 'hold', face: { eyes: 'sad', mouth: 'frown' } }, 450, 1150); mum(ctx, t, { arms: 'hold', face: { eyes: 'half', mouth: 'smirk' } }, 620); cards(ctx, 250, 900); cards(ctx, 450, 900); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, V('n2', 'wild', 1) - 0.1, 'BINGO NIGHT') },
      mu1: { set: 'living', cam: CU(620), draw: (ctx, t) => mum(ctx, t, { arms: 'hold', face: { eyes: 'half', mouth: 'flat', look: [-1, 0] } }, 620) },
      f3: { set: 'living', cam: [[350, 820, 1.5], [350, 810, 1.65]], draw: (ctx, t) => { sam(ctx, t, { pose: 'sit', arms: 'hold', face: { eyes: 'half', mouth: 'flat' } }, 250, 1150); fr(ctx, t, { pose: 'sit', arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, 450, 1150); cards(ctx, 250, 900); cards(ctx, 450, 900); } },
      s2: { set: 'living', cam: [[300, 760, 1.5], [300, 750, 1.7]], shake: first('s2'), draw: (ctx, t) => sam(ctx, t, { arms: 'up', bob: -24 * Math.abs(Math.sin(t * 10)), face: { eyes: 'happy', mouth: 'grin', blush: 1 } }, 300),
        over: (ctx, W, H_, t) => { for (let i = 0; i < 6; i++) { const u = t - first('s2') - i * 0.1; if (u > 0) FX.sparkle(ctx, 140 + i * 90, 700 - u * 120, 20, t * 4 + i); } } },
      mu2: { set: 'living', cam: CU(620), draw: (ctx, t) => mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }, 620) },
      mu3: { set: 'living', cam: WIDE, draw: (ctx, t) => { sam(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }, 250); fr(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }, 440); mum(ctx, t, { arms: 'point', flip: true, face: { eyes: 'half', mouth: 'flat' } }, 620); },
        over: (ctx, W, H_, t) => ADULT.card(ctx, '9:00 PM', 360, 430, popU(t, V('mu3', 'nine') - 0.1, 0.3), '#7ad0f2', ADULT.INK, 54) },
      n3: { set: 'living', cam: [[370, 770, 1.04], [370, 770, 1.07]], draw: (ctx, t) => { sam(ctx, t, { arms: 'down', face: { eyes: 'closed', mouth: 'smile' } }, 250); fr(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }, 440); mum(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk' } }, 620); }, over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n2', 'n3'], sound: (k, { V, first }) => { k.play('riser', V('f2', 'wild') - 0.4, { dur: 0.4, gain: 0.3 }); COUCH.sounds.twist(k, V('mu2', 'let')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
