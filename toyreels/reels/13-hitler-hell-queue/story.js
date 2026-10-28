  // ==================== History's dumbest villains: Hitler in hell's queue ====================
  makeComedy({
    badge: "HISTORY'S DUMBEST VILLAINS", badgeCol: '#6a4a2a',
    captions: { say: { 'nine billion and four': '9,000,000,004', eighty: '80', 'reply-all': 'reply-all' }, keys: { hell: 'r', hold: 'o', throne: 'y', ticket: 'o', stalin: 'r', napoleon: 'y', 'reply-all': 'g', basement: 'r', group: 'o', project: 'o', 'wi-fi': 'r' } },
    beats: ({ V }) => {
      const old = (t) => t > V('wait', 'eighty') + 0.6;
      const H8 = (ex) => ['hitler', 0, 0.2, 0, (t) => Object.assign(old(t) ? { hairCol: [235, 235, 235] } : {}, typeof ex === 'function' ? ex(t) : ex)];
      return {
        hook: { set: 'hell', cam: 'mid', shake: V('hook', 'hold'),
          cast: [H8((t) => ({ x: H.lerp(-1.6, 0, H.clamp((t - 0.2) / 1.4)), walk: t < 1.6 ? t * 7 : 0, mouth: t > V('hook', 'hold') ? 'o' : 'frown', eyes: t > V('hook', 'hold') ? 'wide' : 'angry' }))],
          tags: [[0, 2.45, -0.4, 'ON HOLD', V('hook', 'hold'), 'red']], sfx: [['buzz', V('hook', 'hold'), { gain: 0.4 }]] },
        ticket: { set: 'hell', cam: 'mid', at: [0.4, 0],
          cast: [H8((t) => ({ x: -0.6, rot: 0.4, mouth: t > V('ticket', 'ticket') ? 'frown' : 'smile', arms: [0.15, t > V('ticket', 'ticket') ? 1.2 : 0.15] })),
                 ['devil', 0.8, -0.2, -0.4, { arms: [0.15, 1.0], mouth: 'grin' }]],
          tags: [[-0.6, 2.45, -0.3, 'THRONE?', V('ticket', 'throne'), 'yellow'], [0, 0.35, 0.6, '#9,000,000,004', V('ticket', 'number'), 'red', 1.0]], sfx: [['paper', V('ticket', 'ticket'), { gain: 0.5 }]] },
        queue: { set: 'hell', opt: { throne: false }, cam: 'wide', at: [-0.2, -0.5],
          cast: [['stalin', -2.2, -1.9, 0.5, { mouth: 'flat' }], ['napoleon', -1.2, -1.1, 0.5, { mouth: 'frown' }],
                 [null, -0.1, -0.3, 0.5, { suit: true, hair: 'side', hairCol: [120, 90, 60], mouth: 'smile', hold: 'phone' }], H8({ x: 1.0, z: 0.5, rot: 0.5, mouth: 'frown', arms: [0.4, 0.4] })],
          tags: [[-2.2, 2.45, -1.9, 'STALIN', V('queue', 'stalin'), 'red'], [-1.2, 2.2, -1.1, 'NAPOLEON', V('queue', 'napoleon'), 'blue'], [-0.1, 2.4, -0.3, 'REPLY-ALL GUY', V('queue', 'reply-all'), 'green']] },
        wait: { set: 'hell', opt: { throne: false }, cam: 'close',
          cast: [H8((t) => ({ eyes: t > V('wait', 'called') ? 'wide' : 'sleepy', mouth: t > V('wait', 'called') ? 'grin' : 'flat', mustache: 'toothbrush', hairCol: old(t) ? [235, 235, 235] : undefined }))],
          tags: [[0.5, 2.35, 0.2, '80 YEARS', V('wait', 'eighty'), 'orange']], sfx: [['ding', V('wait', 'called'), { f: 'C6', gain: 0.5 }]] },
        twist: { set: 'hell', cam: 'mid',
          cast: [['devil', 0.7, -0.6, -0.3, (t) => ({ hold: 'pitchfork', arms: [t > V('twist', 'basement') ? 1.6 : 0.4, 0.3], mouth: 'evil' })], H8({ x: -0.6, rot: 0.3, mouth: 'o', eyes: 'wide', sweat: true })],
          tags: [[0, 0.35, 0.6, 'WRONG FLOOR', V('twist', 'wrong'), 'red'], [0.9, 2.45, -0.6, '▼ BASEMENT', V('twist', 'basement'), 'dark']], sfx: [['error', V('twist', 'wrong'), { gain: 0.5 }]] },
        basement: { set: 'prison', cam: 'mid',
          props: (S) => S.box((p) => add(p, [0, 0.45, -0.3]), 0.7, 0.04, 0.4, [120, 80, 50], { bevel: 0.3 }),
          cast: [H8({ x: -0.75, z: -0.3, rot: 0.6, mouth: 'frown', eyes: 'angry', sweat: true }), ['stalin', 0.75, -0.3, -0.6, (t) => ({ mouth: t > V('basement', 'stalin') ? 'grin' : 'flat', arms: [0.15, 1.3] })]],
          tags: [[0, 2.45, -0.5, 'GROUP PROJECT', V('basement', 'group'), 'orange'], [0, 0.35, 0.6, 'WI-FI: DOWN', V('basement', 'wi-fi'), 'red']],
          over: (ctx, W, H_) => { ctx.fillStyle = 'rgba(255,40,20,0.12)'; ctx.fillRect(0, 0, W, H_); } },
        cta: { set: 'hell', cam: 'wide',
          cast: [['devil', 0, -0.4, 0, (t) => ({ arms: [2.4, 2.4], mouth: 'grin', bob: Math.abs(Math.sin(t * 5)) * 0.06 })]],
          tags: [[0, 0.35, 0.6, 'COMMENT ↓', V('cta', 'comment'), 'red']] },
      };
    },
  });
