  // ==================== couch sitcom e002 "Thursday" (part 2 of The Ring) ====================
  SITCOM(({ V, first, talking, pulse, char, AT, timeCard, partTwo }) => {
    const X = { maya: 150, sam: 360, mum: 580 };
    const sparkle = (ctx, x, y, t, r = 70) => { for (let i = 0; i < 5; i++) FX.sparkle(ctx, x + Math.cos(i * 1.3 + t * 3) * r, y + Math.sin(i * 1.7 + t * 3) * r * 0.7, 18, t * 4 + i); };
    const mum = (ctx, t, o) => char(ctx, 'mum', X.mum, 1140, 0.8, t, o, X), sam = (ctx, t, o) => char(ctx, 'sam', X.sam, 1160, 0.82, t, o, X), maya = (ctx, t, o) => char(ctx, 'maya', X.maya, 1150, 0.8, t, o, X);
    const ringUp = (t) => t > V('mu1', 'arrived') - 0.3;
    return {
      c1: { set: 'living', cam: [[370, 760, 1.0], [370, 770, 1.06]], draw: (ctx, t) => { maya(ctx, t, { face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }); sam(ctx, t, { arms: 'cross', face: { eyes: 'wide', mouth: 'o', sweat: 1, look: [1, 0] } }); mum(ctx, t, { arms: 'hips', face: { eyes: 'closed', mouth: 'smile' } }); },
        over: (ctx, W, H_, t) => timeCard(ctx, W, H_, t, first('c1') - 0.1, 'THURSDAY') },
      mu1: { set: 'living', cam: [[560, 760, 1.7], [560, 730, 2.0]], draw: (ctx, t) => { mum(ctx, t, { arms: AT(t, [[0, 'hips'], [V('mu1', 'arrived') - 0.3, 'wave']]), hold: ringUp(t) ? 'ring' : null, face: { eyes: 'happy', mouth: 'smile' } }); if (t > V('mu1', 'arrived')) sparkle(ctx, 690, 660, t); } },
      s1: { set: 'living', cam: [[360, 720, 2.0], [360, 710, 2.3]], draw: (ctx, t) => sam(ctx, t, { arms: 'cheeks', squash: 1 + 0.05 * pulse(t, V('s1', 'exactly'), 0.3), face: { eyes: 'wide', mouth: 'o', sweat: 1, brows: 1, look: [1, 0] } }) },
      mu2: { set: 'living', cam: [[580, 740, 2.0], [580, 730, 2.2]], draw: (ctx, t) => mum(ctx, t, { arms: AT(t, [[0, 'wave'], [V('mu2', 'Twice') - 0.2, 'shrug']]), hold: t < V('mu2', 'Twice') - 0.2 ? 'ring' : null, face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }),
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'SCRUB SCRUB!', 360, 900, popU(t, V('mu2', 'washed'), 0.25) * (t < V('mu2', 'Twice') ? 0.7 : 0), '#7ad0f2', 0.08) },
      m1: { set: 'living', cam: [[160, 740, 1.9], [160, 730, 2.1]], draw: (ctx, t) => maya(ctx, t, { arms: AT(t, [[0, 'down'], [V('m1', 'Babe') - 0.2, 'up']]), bob: -20 * Math.abs(Math.sin(t * 9)), face: { eyes: 'happy', mouth: 'grin', blush: 1 } }) },
      s2: { set: 'living', cam: [[260, 760, 1.35], [255, 760, 1.5]], draw: (ctx, t) => { maya(ctx, t, { arms: 'down', face: { eyes: 'happy', mouth: 'smile', look: [1, 0] } }); sam(ctx, t, { flip: true, arms: AT(t, [[0, 'down'], [V('s2', 'Absolutely') - 0.3, 'point']]), hold: t > V('s2', 'Absolutely') - 0.3 ? 'tongs' : null, lean: 0.1, face: { eyes: 'wide', mouth: 'grin', sweat: 1, look: [1, 0] } }); } },
      m2: { set: 'living', cam: [[160, 730, 2.1], [160, 720, 2.3]], draw: (ctx, t) => maya(ctx, t, { arms: 'hips', face: { eyes: 'half', mouth: 'flat', look: [1, 0] } }) },
      s3: { set: 'living', cam: [[360, 720, 2.1], [360, 715, 2.4]], draw: (ctx, t) => sam(ctx, t, { arms: 'hold', hold: 'tongs', face: { eyes: 'open', mouth: 'grin', sweat: 1, brows: 1, look: [-1, 0] } }) },
      mu3: { set: 'living', cam: [[580, 740, 1.9], [580, 730, 2.1]], draw: (ctx, t) => mum(ctx, t, { arms: AT(t, [[0, 'cross'], [V('mu3', 'booked') - 0.3, 'phone']]), face: { eyes: 'half', mouth: 'smirk', look: [-1, 0] } }) },
      m3: { set: 'living', cam: [[160, 730, 2.2], [160, 720, 2.6]], shake: first('m3'), draw: (ctx, t) => maya(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'shout', brows: 1 } }) },
      mu4: { set: 'living', cam: [[370, 760, 1.0], [370, 770, 1.08]], draw: (ctx, t) => { const d = t > V('mu4', 'discount');
        maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }); sam(ctx, t, { arms: 'hold', hold: 'tongs', face: { eyes: 'wide', mouth: 'o', sweat: 1, look: [1, 0] } }); mum(ctx, t, { arms: 'hips', face: { eyes: d ? 'closed' : 'half', mouth: 'smirk', look: [-1, 0] } }); },
        over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'KA-CHING!', 360, 420, popU(t, V('mu4', 'discount'), 0.25), '#4af08a') },
      n3: { set: 'living', cam: [[370, 770, 1.08], [370, 770, 1.1]], draw: (ctx, t) => { maya(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown' } }); sam(ctx, t, { arms: 'hold', hold: 'tongs', face: { eyes: 'half', mouth: 'flat' } }); mum(ctx, t, { arms: 'phone', face: { eyes: 'half', mouth: 'smirk' } }); },
        over: (ctx, W, H_, t) => partTwo(ctx, W, H_, t, first('n3'), 'PART 3?') },
    };
  }, { noSub: ['c1', 'n3'], sound: (k, { V, first }) => { k.play('sparkle', V('mu1', 'arrived'), { gain: 0.35 }); k.play('thud', first('m3'), { gain: 0.35 }); COUCH.sounds.twist(k, V('mu4', 'hospital')); k.play('stamp', first('n3'), { gain: 0.45 }); } });
