  // ==================== World leaders in bricks: Kim's missile comes home ====================
  makeComedy({
    badge: 'WORLD LEADERS IN BRICKS', badgeCol: '#c8282e',
    captions: { say: { thirty: '30', ten: '10', 'one to ten': '1 to 10' }, keys: { button: 'r', back: 'r', 'u-turn': 'o', boom: 'r', crispy: 'o', putin: 'y', ten: 'g', aim: 'y' } },
    beats: ({ V }) => {
      const soot = [70, 62, 58], burnt = (t) => t > V('boom', 'boom');
      return {
        hook: { set: 'bunker', opt: { alarm: 0 }, cam: 'mid', shake: V('hook', 'came'),
          cast: [['kim', 0, 0.2, 0.2, (t) => ({ arms: [0.15, t > V('hook', 'pressed') ? 1.1 : 0.4], mouth: t > V('hook', 'came') ? 'o' : 'grin', eyes: t > V('hook', 'came') ? 'wide' : 'open', sweat: t > V('hook', 'came') })],
                 ['general', -1.2, -0.3, 0.4, (t) => ({ arms: t > V('hook', 'came') ? [2.6, 2.6] : [0.15, 0.15], mouth: t > V('hook', 'came') ? 'open' : 'frown' })]],
          props: (S, t) => bigButton(S, 0.75, 0, 0.75, 1.4, t > V('hook', 'pressed') && t < V('hook', 'pressed') + 0.4 ? 1 : 0),
          tags: [[0.6, 2.5, -0.2, '30 MIN LATER', V('hook', 'thirty'), 'yellow']], sfx: [['press', V('hook', 'pressed')], ['riser', V('hook', 'came') - 0.5, { dur: 0.5, gain: 0.4 }]] },
        launch: { set: 'base', cam: 'low', shake: V('launch', 'supposed'),
          props: (S, t) => { const up = Math.max(0, t - V('launch', 'supposed')); missile(S, 0, 0.1 + up * up * 1.6, -0.6, 1.5, 0, up > 0 ? 1 : 0.2); },
          cast: [['soldier', -1.4, 0.4, 0.5, { arms: [2.4, 2.4], mouth: 'open' }], ['soldier', 1.4, 0.4, -0.5, { arms: [2.4, 2.4], mouth: 'grin' }]],
          booms: [[0, 0.2, -0.6, V('launch', 'supposed'), 1.6]], tags: [[0, 0.35, 0.6, 'SCARE THE WORLD', V('launch', 'scare'), 'red']], sfx: [['whoosh', V('launch', 'supposed'), { dur: 1.2, gain: 0.6 }]] },
        flight: { set: 'sky', cam: [[0, 1.6, 7.4], [0, 1.6, 0], [0, 1.6, 7.0], [0, 1.6, 0]],
          props: (S, t) => { const turn = V('flight', 'u-turn'), back = t > turn, k = back ? t - turn : 0, j0 = V('flight', 'japan') - 0.4, x = back ? 1.3 - k * 2.2 : H.lerp(-1.6, 1.3, H.clamp((t - j0) / (turn - j0)));
            const wob = t > V('flight', 'panicked') && !back ? Math.sin(t * 30) * 0.25 : 0; missile(S, x, 1.6 + Math.sin(t * 2) * 0.1, 0, 0.9, (back ? Math.PI / 2 : -Math.PI / 2) + wob, 1); },
          tags: [[-1.1, 2.5, 0, 'JAPAN', V('flight', 'japan'), 'white'], [0, 2.3, 0, 'ALASKA', V('flight', 'alaska'), 'blue'], [1.0, 0.9, 0, 'NORTH POLE', V('flight', 'north'), 'white'], [0, 0.5, 0.5, 'U-TURN', V('flight', 'u-turn'), 'orange']],
          sfx: [['glitch', V('flight', 'panicked'), { gain: 0.5 }], ['swish', V('flight', 'u-turn'), { dur: 0.5, gain: 0.6 }]] },
        home: { set: 'palace', cam: 'mid',
          cast: [['kim', 0, -1.2, 0, (t) => ({ arms: [0.6, 0.6], eyes: t > V('home', 'remembered') ? 'wide' : 'closed', mouth: t > V('home', 'remembered') ? 'o' : 'smile', sweat: t > V('home', 'remembered') })]],
          props: (S, t, u) => missile(S, H.lerp(3.2, 0.6, u), H.lerp(5.5, 2.7, u), -1.2, 0.8, 2.5, 1),
          tags: [[0, 2.55, -1, '?', V('home', 'palace'), 'yellow']], sfx: [['riser', V('home', 'remembered'), { dur: 0.6, gain: 0.5 }]] },
        boom: { set: 'palace', opt: { throne: true }, cam: 'mid',
          cast: [['kim', 0, -1.2, 0, (t) => burnt(t) ? { skin: soot, shirt: [40, 36, 34], hairCol: [20, 20, 20], eyes: t > V('boom', 'survived') ? 'wide' : 'x', mouth: 'o', arms: [0.9, 0.9] } : { eyes: 'wide', mouth: 'open', arms: [2.5, 2.5] }]],
          booms: [[0, 1.2, -1.2, V('boom', 'boom'), 2.2]],
          tags: [[0, 0.35, 0.5, 'DIRECT HIT', V('boom', 'direct'), 'red'], [0, 2.5, -0.6, 'EXTRA CRISPY', V('boom', 'crispy'), 'orange']] },
        twist: { set: 'office', cam: 'mid', at: [0.3, -0.2],
          cast: [['putin', 0, -1.1, 0, (t) => ({ hold: 'phone', holdArm: 1, arms: [0.15, 2.1], mouth: t > V('twist', 'order') ? 'evil' : 'flat', brows: 'raised' })]],
          tags: [[-0.9, 2.4, -0.4, 'NOT LAUGHING', V('twist', 'not'), 'dark'], [0.8, 2.6, -0.6, 'ORDER × 10', V('twist', 'ten'), 'green']], sfx: [['ding', V('twist', 'called'), { f: 'E6', gain: 0.4 }], ['coin', V('twist', 'ten'), { gain: 0.5 }]] },
        cta: { set: 'stage', opt: { banner: 'RATE MY AIM' }, cam: 'mid',
          cast: [['kim', 0, 0, 0, (t) => ({ skin: soot, shirt: [40, 36, 34], hairCol: [20, 20, 20], arms: [2.3, 2.3], mouth: 'grin', bob: Math.abs(Math.sin(t * 6)) * 0.08 })]],
          tags: [[0, 0.35, 0.6, '1 - 10 ?', V('cta', 'one'), 'yellow']] },
      };
    },
  });
