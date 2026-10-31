  // ==================== Pillow Talk pilot p003-the-real-hurt ====================
  SITCOM(({ V, first, char, AT }) => {
    const X = { roxy: 210, max: 510 };
    const rx = (ctx, t, o = {}, x = X.roxy, y = 1010, s = 0.8) => char(ctx, 'roxy', x, y, s, t, Object.assign({ pose: 'bed' }, o), X);
    const mx = (ctx, t, o = {}, x = X.max, y = 1010, s = 0.8) => char(ctx, 'max', x, y, s, t, Object.assign({ pose: 'bed' }, o), X);
    const WIDE = [[360, 720, 1.0], [360, 720, 1.05]], CR = [[210, 690, 1.5], [210, 680, 1.62]], CM = [[510, 690, 1.5], [510, 680, 1.62]];
    const back = (ctx, t, rf, mf) => { rx(ctx, t, { arms: 'cross', flip: true, face: rf }, 170); mx(ctx, t, { arms: 'hold', hold: 'phone', face: mf }, 550); PILLOW.sheet(ctx, t); };
    return {
      r1: { set: 'bedroom', cam: WIDE, draw: (ctx, t) => back(ctx, t, { eyes: 'sad', mouth: 'frown', brows: 1 }, { eyes: 'half', mouth: 'flat', look: [0, 1] }), over: (ctx, W, H_, t) => PILLOW.hook(ctx, t, first('m1') + 0.1, 'WHEN DID YOU STOP\nLOOKING AT ME?') },
      m1: { set: 'bedroom', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'hold', hold: 'phone', face: { eyes: 'half', mouth: 'flat', look: [0, 1] } }); PILLOW.sheet(ctx, t); } },
      r2: { set: 'bedroom', cam: CR, draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', face: { eyes: 'sad', mouth: 'flat', brows: 1 } }); PILLOW.sheet(ctx, t); } },
      m2: { set: 'bedroom', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'hold', hold: 'phone', face: { eyes: 'half', mouth: 'flat', look: [0, 1] } }); PILLOW.sheet(ctx, t); } },
      r3: { set: 'bedroom', cam: [[210, 690, 1.5], [210, 670, 1.8]], draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'flat', brows: 1 } }); PILLOW.sheet(ctx, t); } },
      r4: { set: 'bedroom', cam: [[210, 680, 1.8], [210, 665, 2.05]], draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown', brows: 1, tears: 1 } }); PILLOW.sheet(ctx, t); } },
      m3: { set: 'bedroom', cam: [[510, 680, 1.7], [510, 665, 1.95]], draw: (ctx, t) => { mx(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'flat', brows: 1 } }); PILLOW.sheet(ctx, t); } },
      r5: { set: 'bedroom', cam: CR, draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'open', brows: 1, tears: 1 } }); PILLOW.sheet(ctx, t); } },
      m4: { set: 'bedroom', cam: [[510, 680, 1.8], [510, 660, 2.2]], draw: (ctx, t) => { mx(ctx, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown', brows: 1, tears: 1 } }); PILLOW.sheet(ctx, t); } },
      r6: { set: 'bedroom', cam: WIDE, draw: (ctx, t) => { const k = H.clamp((t - first('r6')) / 1.0), e = k * k * (3 - 2 * k); mx(ctx, t, { arms: 'down', tilt: 0.1 * e, face: { eyes: 'closed', mouth: 'frown', tears: 1 } }, 510 - 90 * e); rx(ctx, t, { arms: [[-20, 100, -10, 200], [90, 60, 210 * e, 40]], face: { eyes: 'closed', mouth: 'smile', tears: 1 } }, 210 + 70 * e); PILLOW.sheet(ctx, t); } },
      end: { set: 'bedroom', setOpt: { off: 0 }, cam: [[360, 720, 1.05], [360, 720, 1.1]], draw: (ctx, t) => { mx(ctx, t, { arms: 'down', tilt: 0.1, face: { eyes: 'closed', mouth: 'flat' } }, 420); rx(ctx, t, { arms: [[-20, 100, -10, 200], [90, 60, 210, 40]], face: { eyes: 'closed', mouth: 'smile' } }, 280); PILLOW.sheet(ctx, t); }, over: (ctx, W, H_, t) => { ctx.fillStyle = 'rgba(4,4,20,0.5)'; ctx.fillRect(0, 0, W, H_); } },
    };
  }, { noSub: ['end'], spk: { roxy: ['ROXY', '#ff7a8a'], max: ['MAX', '#7ac0ff'] }, sound: (k, { first }) => { k.play('impact', first('m4'), { gain: 0.2 }); } });
