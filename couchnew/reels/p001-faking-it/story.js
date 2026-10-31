  // ==================== Pillow Talk pilot p001-faking-it ====================
  SITCOM(({ V, first, char, AT }) => {
    const X = { roxy: 210, max: 510 };
    const rx = (ctx, t, o = {}, x = X.roxy, y = 1010, s = 0.8) => char(ctx, 'roxy', x, y, s, t, Object.assign({ pose: 'bed' }, o), X);
    const mx = (ctx, t, o = {}, x = X.max, y = 1010, s = 0.8) => char(ctx, 'max', x, y, s, t, Object.assign({ pose: 'bed' }, o), X);
    const WIDE = [[360, 720, 1.0], [360, 720, 1.05]], CR = [[210, 690, 1.5], [210, 680, 1.62]], CM = [[510, 690, 1.5], [510, 680, 1.62]];
    return {
      r1: { set: 'bedroom', cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'smirk', look: [1, 0] } }); mx(ctx, t, { arms: 'hold', hold: 'phone', face: { eyes: 'wide', mouth: 'flat' } }); PILLOW.sheet(ctx, t); PILLOW.floor(ctx, t); }, over: (ctx, W, H_, t) => PILLOW.hook(ctx, t, first('m1') + 0.1, 'HOW MANY TIMES\nHAVE YOU FAKED IT?') },
      m1: { set: 'bedroom', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'shrug', face: { eyes: 'wide', mouth: 'grin', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      r2: { set: 'bedroom', cam: CR, draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', face: { eyes: 'angry', mouth: 'flat', brows: -1 } }); PILLOW.sheet(ctx, t); } },
      m2: { set: 'bedroom', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'up', face: { eyes: 'wide', mouth: 'open', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      r3: { set: 'bedroom', cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'point', face: { eyes: 'half', mouth: 'smirk' } }); mx(ctx, t, { arms: 'hold', face: { eyes: 'wide', mouth: 'flat', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      m3: { set: 'bedroom', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'grin', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      r4: { set: 'bedroom', cam: CR, draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }); PILLOW.sheet(ctx, t); } },
      m4: { set: 'bedroom', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      r5: { set: 'bedroom', cam: WIDE, shake: first('r5'), draw: (ctx, t) => { rx(ctx, t, { arms: 'shrug', face: { eyes: 'happy', mouth: 'grin' } }); mx(ctx, t, { arms: 'hold', face: { eyes: 'wide', mouth: 'o' } }); PILLOW.sheet(ctx, t); } },
      m5: { set: 'bedroom', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'point', style: {}, flip: true, face: { eyes: 'wide', mouth: 'open', brows: 1 } }); PILLOW.sheet(ctx, t); } },
      r6: { set: 'bedroom', setOpt: { off: 0 }, cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'closed', mouth: 'smirk' } }); mx(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o' } }); PILLOW.sheet(ctx, t); }, over: (ctx, W, H_, t) => { ctx.fillStyle = 'rgba(4,4,20,0.35)'; ctx.fillRect(0, 0, W, H_); } },
      end: { set: 'bedroom', setOpt: { off: 0 }, cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'closed', mouth: 'smirk' } }); mx(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'flat' } }); PILLOW.sheet(ctx, t); }, over: (ctx, W, H_, t) => { ctx.fillStyle = 'rgba(4,4,20,0.5)'; ctx.fillRect(0, 0, W, H_); ADULT.sfxWord(ctx, 'HIM OR HER?', 360, 560, popU(t, first('end'), 0.3) * 0.8); } },
    };
  }, { noSub: ['end'], spk: { roxy: ['ROXY', '#ff7a8a'], max: ['MAX', '#7ac0ff'] }, sound: (k, { first }) => { k.play('stamp', first('r5'), { gain: 0.4 }); k.play('impact', first('r6'), { gain: 0.3 }); k.play('stamp', first('end'), { gain: 0.4 }); } });
