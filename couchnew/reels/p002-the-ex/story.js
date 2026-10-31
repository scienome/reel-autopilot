  // ==================== Pillow Talk pilot p002-the-ex ====================
  SITCOM(({ V, first, talking, lookAt }) => {
    const X = { roxy: 210, max: 510 };
    const fg = (who) => (ctx, t, o = {}, x = X[who], y = 1010, s = 0.8) => PILLOW.fig(ctx, who, x, y, s, t, Object.assign({}, o, { phone: o.hold === 'phone', face: Object.assign({ talk: talking(who, t), look: lookAt(who, t, X) }, o.face || {}) }));
    const rx = fg('roxy'), mx = fg('max');
    const WIDE = [[360, 720, 1.0], [360, 720, 1.05]], CR = [[210, 690, 1.5], [210, 680, 1.62]], CM = [[510, 690, 1.5], [510, 680, 1.62]];
    return {
      r1: { set: 'soft', cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', face: { eyes: 'angry', mouth: 'flat', brows: -1, look: [1, 0] } }); mx(ctx, t, { arms: 'down', face: { eyes: 'closed', mouth: 'flat' } }); PILLOW.sheet(ctx, t); }, over: (ctx, W, H_, t) => PILLOW.hook(ctx, t, first('m1') + 0.1, 'YOU SAID HER NAME\nLAST NIGHT.') },
      m1: { set: 'soft', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'hold', face: { eyes: 'wide', mouth: 'flat', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      r2: { set: 'soft', cam: CR, shake: first('r2'), draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', face: { eyes: 'angry', mouth: 'flat', brows: -1 } }); PILLOW.sheet(ctx, t); } },
      m2: { set: 'soft', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'shrug', face: { eyes: 'wide', mouth: 'grin', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      r3: { set: 'soft', cam: CR, draw: (ctx, t) => { rx(ctx, t, { arms: 'point', face: { eyes: 'half', mouth: 'flat' } }); PILLOW.sheet(ctx, t); } },
      m3: { set: 'soft', cam: CM, draw: (ctx, t) => { mx(ctx, t, { arms: 'facepalm', face: { eyes: 'closed', mouth: 'frown', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      m4: { set: 'soft', cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', face: { eyes: 'half', mouth: 'flat' } }); mx(ctx, t, { arms: 'hold', face: { eyes: 'sad', mouth: 'flat', brows: 1 } }); PILLOW.sheet(ctx, t); } },
      r4: { set: 'soft', cam: CR, draw: (ctx, t) => { rx(ctx, t, { arms: 'cross', tilt: -0.06, face: { eyes: 'half', mouth: 'smirk' } }); PILLOW.sheet(ctx, t); } },
      r5: { set: 'soft', cam: [[210, 680, 1.7], [210, 670, 1.9]], draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'closed', mouth: 'smile', blush: 1 } }); PILLOW.sheet(ctx, t); }, over: (ctx, W, H_, t) => ADULT.sfxWord(ctx, 'DANIEL.', 360, 300, popU(t, first('r5'), 0.25), '#ff7a8a') },
      m5: { set: 'soft', cam: CM, shake: first('m5'), draw: (ctx, t) => { mx(ctx, t, { arms: 'up', face: { eyes: 'wide', mouth: 'shout', sweat: 1 } }); PILLOW.sheet(ctx, t); } },
      r6: { set: 'soft', setOpt: { off: 0 }, cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'closed', mouth: 'smirk' } }); mx(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o', sweat: 1 } }); PILLOW.sheet(ctx, t); }, over: (ctx, W, H_) => { ctx.fillStyle = 'rgba(4,4,20,0.35)'; ctx.fillRect(0, 0, W, H_); } },
      end: { set: 'soft', setOpt: { off: 0 }, cam: WIDE, draw: (ctx, t) => { rx(ctx, t, { arms: 'down', face: { eyes: 'closed', mouth: 'smirk' } }); mx(ctx, t, { arms: 'cheeks', face: { eyes: 'wide', mouth: 'flat' } }); PILLOW.sheet(ctx, t); }, over: (ctx, W, H_, t) => { ctx.fillStyle = 'rgba(4,4,20,0.5)'; ctx.fillRect(0, 0, W, H_); ADULT.sfxWord(ctx, 'THE SOFA?', 360, 560, popU(t, first('end'), 0.3) * 0.9); } },
    };
  }, { noSub: ['end'], spk: { roxy: ['ROXY', '#ff7a8a'], max: ['MAX', '#7ac0ff'] }, sound: (k, { first }) => { k.play('impact', first('r2'), { gain: 0.35 }); k.play('stamp', first('r5'), { gain: 0.5 }); k.play('impact', first('m5'), { gain: 0.4 }); k.play('stamp', first('end'), { gain: 0.4 }); } });
