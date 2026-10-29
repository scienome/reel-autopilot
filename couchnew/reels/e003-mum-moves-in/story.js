  // ==================== couch sitcom e003 "Mum Moves In" ====================
  SITCOM(({ V, first, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 380, mum: 590 };
    const HOODIE = { outfit: 'hoodie', top: '#e6b03a', top2: '#c99223' };
    const sam = (ctx, t, o, x = X.sam) => char(ctx, 'sam', x, 1160, 0.82, t, o, X), maya = (ctx, t, o, x = X.maya) => char(ctx, 'maya', x, 1150, 0.8, t, o, X);
    const sofaMum = (ctx, t, o) => char(ctx, 'mum', 560, 1150, 0.8, t, Object.assign({ pose: 'sit', style: HOODIE }, o), X);
    return {
      n1: { set: 'living', cam: [[370, 760, 1.0], [370, 770, 1.05]], draw: (ctx, t) => { const k = H.clamp((t - first('n1') + 0.2) / 1.0);
        maya(ctx, t, { arms: 'wave', face: { eyes: 'happy', mouth: 'grin' } }, 140); sam(ctx, t, { arms: 'down', face: { eyes: 'open', mouth: 'smile', look: [1, 0] } }, 330);
        char(ctx, 'mum', 800 - 220 * H.ease.out(k), 1140, 0.8, t, { walk: k < 1 ? t * 9 : null, arms: 'hold', hold: 'suitcase', face: { eyes: 'happy', mouth: 'smile', look: [-1, 0] } }); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('n1') - 0.1, 'DAY 1') },
      mu1: { set: 'living', cam: [[580, 750, 1.8], [580, 740, 2.0]], draw: (ctx, t) => char(ctx, 'mum', 580, 1140, 0.8, t, { arms: 'hold', hold: 'suitcase', face: { eyes: 'happy', mouth: 'smile', look: [-1, 0] } }, X) },
      n2: { set: 'living', cam: [[370, 760, 1.0], [370, 770, 1.05]], draw: (ctx, t) => { sofaMum(ctx, t, { arms: 'hold', hold: 'remote', face: { eyes: 'half', mouth: 'smirk' } }); sam(ctx, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o', look: [1, 0] } }, 220); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('n2') - 0.1, 'DAY 40') },
      s1: { set: 'living', cam: [[300, 720, 2.0], [300, 710, 2.2]], draw: (ctx, t) => sam(ctx, t, { arms: 'point', face: { eyes: 'wide', mouth: 'o', brows: 1, look: [1, 0] } }, 220) },
      mu2: { set: 'living', cam: [[560, 760, 1.9], [560, 750, 2.1]], draw: (ctx, t) => sofaMum(ctx, t, { arms: AT(t, [[0, 'hold'], [V('mu2', 'our') - 0.2, 'cross']]), hold: t < V('mu2', 'our') - 0.2 ? 'remote' : null, face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }) },
      s2: { set: 'kitchen', setOpt: { note: "MUM'S FOOD\n(NOT SAM)" }, cam: [[470, 650, 1.25], [500, 600, 1.45]], draw: (ctx, t) => sam(ctx, t, { arms: 'point', face: { eyes: 'half', mouth: 'flat', look: [1, -0.5] } }, 330) },
      m1: { set: 'kitchen', setOpt: { note: "MUM'S FOOD\n(NOT SAM)" }, cam: [[200, 740, 1.9], [200, 730, 2.1]], draw: (ctx, t) => maya(ctx, t, { arms: 'shrug', face: { eyes: 'half', mouth: 'smile', look: [1, 0] } }, 200) },
      s3: { set: 'kitchen', setOpt: { note: "MUM'S FOOD\n(NOT SAM)" }, cam: [[400, 720, 2.1], [400, 710, 2.5]], shake: V('s3', 'password'), draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'phone', squash: 1 + 0.1 * pulse(t, V('s3', 'password'), 0.3), face: { eyes: 'wide', mouth: 'shout', brows: 1, sweat: 1 } }, 400) },
      m2: { set: 'kitchen', setOpt: { note: "MUM'S FOOD\n(NOT SAM)" }, cam: [[200, 740, 2.1], [200, 730, 2.2]], draw: (ctx, t) => maya(ctx, t, { arms: 'down', face: { eyes: 'open', mouth: 'o', look: [1, 0] } }, 200) },
      mu3: { set: 'living', cam: [[560, 760, 1.6], [560, 750, 1.9]], draw: (ctx, t) => sofaMum(ctx, t, { arms: 'hold', hold: 'mug', face: { eyes: t > V('mu3', 'One') ? 'half' : 'closed', mouth: 'smirk', look: [-1, 0] } }),
        over: (ctx, W, H_, t) => { const u = popU(t, V('mu3', 'Sam') - 0.1, 0.3); if (u <= 0) return; ctx.save(); ctx.translate(360, 430); ctx.scale(u, u); ctx.rotate(0.04); ADULT.poly(ctx, '#1e2230', [[-250, -90], [250, -90], [250, 90], [-250, 90]], 530); ctx.textAlign = 'center'; ctx.fillStyle = '#7fd0ff'; ctx.font = '800 30px sans-serif'; ctx.fillText('WIFI PASSWORD', 0, -38); ctx.fillStyle = '#fff'; ctx.font = '900 44px sans-serif'; ctx.fillText('SamPackYourBags', 0, 30); ctx.restore(); } },
      n3: { set: 'living', cam: [[370, 770, 1.05], [370, 770, 1.08]], draw: (ctx, t) => { sofaMum(ctx, t, { arms: 'hold', hold: 'mug', face: { eyes: 'closed', mouth: 'smile' } }); sam(ctx, t, { arms: 'hold', hold: 'suitcase', face: { eyes: 'sad', mouth: 'frown', tears: 1 } }, 220); },
        over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3')) },
    };
  }, { noSub: ['n1', 'n2', 'n3'], sound: (k, { V, first }) => { k.play('thud', V('mu1', 'week'), { gain: 0.3 }); k.play('impact', V('s3', 'password'), { gain: 0.4 }); COUCH.sounds.twist(k, V('mu3', 'Sam')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
