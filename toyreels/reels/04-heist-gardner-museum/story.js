  // ==================== Heists 4/4: the Isabella Stewart Gardner Museum (1990) ====================
  const GARDNER = '#7a2b2b';
  makeReel({
    badge: 'GREATEST HEISTS · 4/4',
    captions: { say: { 'nineteen ninety': '1990', 'eighty-one minutes': '81 minutes', 'thirteen': '13', 'five hundred million dollars': '$500 million', 'ten-million-dollar': '$10 million' }, keys: { police: 'o', "weren't": 'r', basement: 'o', vermeer: 'y', "rembrandt's": 'y', empty: 'o', frames: 'o', never: 'r', reward: 'g', finale: 'y', boston: 'y' } },
    shots: ({ V }) => {
      const cop = (S, x, z, s, rot, o = {}) => S.figure(x, z, s, rot, Object.assign({ shirt: [40, 60, 120], pants: [30, 40, 80], hat: 'police' }, o));
      const guard = (S, x, z, s, rot, o = {}) => S.figure(x, z, s, rot, Object.assign({ shirt: [150, 150, 160], pants: [60, 60, 70], hat: null }, o));
      const facade = (S) => { S.box((p) => add(p, [0, 1.4, -1.0]), 1.8, 1.4, 0.4, [196, 150, 120], { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = '#5a3020'; c.fillRect(w * 0.42, h * 0.45, w * 0.16, h * 0.55); c.fillStyle = '#ffd890'; for (const x of [0.15, 0.7]) c.fillRect(w * x, h * 0.3, w * 0.14, h * 0.18); c.fillStyle = '#3a2a20'; c.font = FONT(800, h * 0.06); c.textAlign = 'center'; c.fillText('MUSEUM', w / 2, h * 0.16); } }); };
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.2, 7.4], [0, 1.2, 0], [0.2, 2.0, 6.6], [0, 1.25, 0]);
          const knock = t > V('hook', 'knock');
          cityShot(ctx, W, H_, t, E, TG, (S) => {
            facade(S);
            cop(S, -0.35, 0.0, 0.85, Math.PI, { arms: [0.15, knock ? 1.4 + Math.abs(Math.sin(t * 10)) * 0.3 : 0.15] }); cop(S, 0.45, 0.2, 0.85, Math.PI);
            S.tag(0, 0.3, 1.8, 'Boston, 1990', popU(t, V('hook', 'boston')), -0.05, P.red, 1.1);
          }, 1);
        },
        trick(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 7.0], [0, 1.2, 0], [0.1, 2.1, 6.2], [0, 1.25, 0]);
          const enter = Math.max(0, t - V('trick', 'lets'));
          museumShot(ctx, W, H_, E, TG, (S) => {
            S.box((p) => add(p, [-0.9, 0.45, -0.2]), 0.6, 0.45, 0.35, [120, 80, 50], { bevel: 0.15 });
            guard(S, -0.9, -0.8, 0.9, 0.2, { arms: [0.15, enter ? 1.0 : 0.15] });
            cop(S, 1.6 - Math.min(1, enter * 0.6) * 0.8, 0.8, 0.9, -1.0, { walk: enter && enter < 1.6 ? t * 7 : 0 }); cop(S, 2.2 - Math.min(1, enter * 0.6) * 0.8, 1.3, 0.9, -1.0, { walk: enter && enter < 1.6 ? t * 7 : 0 });
          }, GARDNER, 0.3);
        },
        fake(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 5.6], [0, 1.45, 0], [0, 2.2, 4.9], [0, 1.5, 0]);
          museumShot(ctx, W, H_, E, TG, (S) => {
            cop(S, -0.5, 0.2, 1, 0.2, { look: 0.04, mouth: 'flat' }); cop(S, 0.6, 0.0, 1, -0.2, { mouth: 'flat' });
            S.tag(0, 0.35, 1.5, 'FAKE COPS', popU(t, V('fake', "weren't")), -0.05, P.red, 1.15);
          }, GARDNER, 0.3);
          return 0.2 * Math.exp(-Math.pow((t - V('fake', "weren't")) * 6, 2));
        },
        tied(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 6.8], [0, 1.2, 0], [0.1, 2.0, 6.0], [0, 1.25, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            for (const x of [-1.6, -0.2, 1.2]) S.box((p) => add(p, [x, 1.4, -0.9]), 0.06, 1.4, 0.06, [130, 130, 140], { bevel: 0.3 });
            S.box((p) => add(p, [0, 2.6, -0.9]), 2.2, 0.06, 0.06, [130, 130, 140], { bevel: 0.3 });
            guard(S, -0.8, -0.5, 0.9, 0.2, { arms: [-0.35, -0.35], mouth: 'o' }); guard(S, 0.7, -0.5, 0.9, -0.2, { arms: [-0.35, -0.35], mouth: 'o', shirt: [140, 140, 150] });
            S.tag(0, 0.3, 1.8, 'basement', popU(t, V('tied', 'basement')), -0.05, P.orange, 0.95);
          });
          nightGrade(ctx, W, H_, 0.35, false);
        },
        minutes(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 7.2], [0, 1.4, 0], [0.1, 2.2, 6.4], [0, 1.45, 0]);
          const m = Math.round(81 * H.clamp((t - V('minutes', 'then')) / ((V('minutes', 'gone') - V('minutes', 'then')) || 1)));
          museumShot(ctx, W, H_, E, TG, (S) => {
            const taken = Math.floor(H.clamp((t - a) / (b - a)) * 4);
            [-1.4, -0.45, 0.5, 1.45].forEach((x, i) => painting(S, x, 1.9, -2.3, 0.35, 0.45, i < taken ? null : ['concert', 'storm', 'mona', 'concert'][i] === 'mona' ? 'storm' : ['concert', 'storm', 'storm', 'concert'][i]));
            cop(S, -0.6, 0.4, 0.9, 0.6, { arms: [0.15, 1.0], walk: t * 5 }); bag(S, 0.9, 0, 0.6, 0.8, [36, 36, 44]);
            S.tag(0, 0.3, 1.8, m + ' min', popU(t, V('minutes', 'then')), -0.05, m >= 81 ? P.orange : P.red, 0.75);
            S.tag(1.1, 2.9, -0.6, '13 works', popU(t, V('minutes', 'thirteen')), 0.06, P.yellow, 0.9);
          }, GARDNER, 0.3);
        },
        worth(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.2, 6.2], [0, 1.6, 0], [0, 2.1, 5.4], [0, 1.65, 0]);
          museumShot(ctx, W, H_, E, TG, (S) => {
            const v = popU(t, V('worth', 'vermeer')), r = popU(t, V('worth', "rembrandt's"));
            if (v > 0) painting(S, -0.75, 1.9, -1.0, 0.55 * v, 0.5 * v, 'concert');
            if (r > 0) painting(S, 0.75, 1.9, -1.0, 0.45 * r, 0.58 * r, 'storm');
            S.tag(0, 0.35, 1.5, '$500,000,000', popU(t, V('worth', 'five')), -0.05, P.green, 1.25);
          }, GARDNER);
        },
        frames(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 7.0], [0, 1.5, 0], [0.1, 2.1, 6.2], [0, 1.55, 0]);
          museumShot(ctx, W, H_, E, TG, (S) => {
            painting(S, -0.75, 1.9, -2.3, 0.55, 0.5, null); painting(S, 0.75, 1.9, -2.3, 0.45, 0.58, null);
            S.figure(-0.4, 0.6, 0.85, Math.PI, { shirt: P.blue }); S.figure(0.6, 0.9, 0.8, Math.PI + 0.3, { shirt: P.orange, hat: null });
          }, GARDNER);
        },
        reward(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.6], [0, 1.3, 0], [0, 2.2, 5.8], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            const n = Math.floor(H.clamp((t - V('reward', 'reward')) / 1.0) * 15); for (let i = 0; i < n; i++) cash(S, -0.9 + (i % 5) * 0.45, 0.06 + Math.floor(i / 5) * 0.11, 0.2, 1.0, 0);
            S.tag(0, 1.25, 1.0, '$10,000,000', popU(t, V('reward', 'reward')), -0.05, P.green, 1.1);
            S.tag(0, 2.5, 0.6, 'UNSOLVED', popU(t, V('reward', 'never')), 0.05, P.red, 1.0);
          });
          return 0.18 * Math.exp(-Math.pow((t - V('reward', 'never')) * 6, 2));
        },
        end(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 7.0], [0, 1.3, 0], [0, 2.1, 6.2], [0, 1.35, 0]);
          studioShot(ctx, W, H_, E, TG, (S) => {
            S.figure(-0.8, 0.5, 0.95, 0.4, { shirt: P.orange, arms: [0.15, 2.4] }); S.figure(0.8, 0.5, 0.95, -0.4, { shirt: P.blue, hat: 'hard', arms: [2.4, 0.15] });
            S.tag(0, 2.6, 0.6, '?', popU(t, V('end', 'next')), 0.12, P.yellow, 0.32);
            confetti(S, t, V('end', 'comments'), 0, 1.2, 16, 7);
          });
        },
      };
    },
    sound: (k, fx, { V }) => {
      for (let i = 0; i < 4; i++) k.play('tock', V('hook', 'knock') + i * 0.22, { f: 260, gain: 0.6 }); k.play('pop', V('hook', 'boston'), { f: 600, gain: 0.5 });
      k.play('click', V('trick', 'lets'), { gain: 0.7 }); for (let i = 0; i < 6; i++) k.play('tock', V('trick', 'lets') + 0.2 + i * 0.16, { f: 320, gain: 0.25, minor: true });
      k.play('impact', V('fake', "weren't"), { gain: 0.6 }); k.play('buzz', V('fake', "weren't") + 0.05, { f: 98, dur: 0.3, gain: 0.5 });
      k.play('slap', V('tied', 'handcuffed'), { gain: 0.5 }); k.play('click', V('tied', 'handcuffed') + 0.15, { gain: 0.6 });
      for (let f = 0; f < 24; f++) k.play('count', V('minutes', 'then') + f * 0.1, { gain: 0.5, minor: true }); k.play('pop', V('minutes', 'thirteen'), { f: 600, gain: 0.5 });
      k.play('pop', V('worth', 'vermeer'), { f: 560, gain: 0.5 }); k.play('pop', V('worth', "rembrandt's"), { f: 640, gain: 0.5 }); k.play('coin', V('worth', 'five'), { gain: 0.6 });
      k.tone(V('frames', 'today'), { f: [[0, 300], [1.4, 170]], type: 'triangle', dur: 1.5, gain: 0.12, filter: 'lowpass', f2: 900 });
      for (let i = 0; i < 15; i++) fx.clack(V('reward', 'reward') + i * 0.066, 0.35); k.play('stamp', V('reward', 'never'), { gain: 0.7 });
      ['C5', 'E5', 'G5', 'C6'].forEach((f, i) => k.play('ding', V('end', 'comments') + i * 0.08, { f, gain: 0.4 }));
    },
  });
