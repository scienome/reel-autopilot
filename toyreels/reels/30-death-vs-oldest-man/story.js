  // ==================== The higher powers: Death's worst client ====================
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#4a2a7a',
    captions: { say: { 'hundred and twenty year old': '120-year-old' }, keys: { death: 'r', plans: 'o', chess: 'y', won: 'g', poker: 'y', scythe: 'r', 'dance-off': 'y', hamstring: 'r', banana: 'y', waits: 'r' } },
    beats: ({ V }) => {
      const old = (ex) => [null, -0.7, 0.2, 0.4, (t) => Object.assign({ shirt: [150, 120, 160], pants: [90, 80, 70], hair: 'thin', hairCol: [250, 250, 250], mustache: 'big', hairCol: [250, 250, 250], facePaint: (c, w, h) => { c.strokeStyle = '#2a2a33'; c.lineWidth = w * 0.025; for (const x of [0.34, 0.66]) { c.beginPath(); c.arc(w * x, h * 0.45, w * 0.11, 0, TAU); c.stroke(); } }, mouth: 'grin' }, typeof ex === 'function' ? ex(t) : ex)];
      const dth = (ex) => ['death', 0.7, 0.2, -0.4, ex];
      const table = (S, draw) => { S.box((p) => add(p, [0, 0.4, 0.2]), 0.4, 0.04, 0.3, [120, 80, 50], { bevel: 0.3, paint: draw }); };
      const board = (c, w, h) => { for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { c.fillStyle = (i + j) & 1 ? '#2a2a30' : '#f0ece0'; c.fillRect((w * i) / 8, (h * j) / 8, w / 8 + 1, h / 8 + 1); } };
      return {
        hook: { set: 'graveyard', cam: 'wide', cast: [old({ arms: [0.15, 1.2] }), dth({ hold: 'scythe' })], tags: [[-0.7, 2.45, -0.3, 'AGE: 120', V('hook', 'hundred'), 'yellow'], [0, 0.35, 0.8, 'OTHER PLANS', V('hook', 'plans'), 'orange']] },
        chess: { set: 'palace', opt: { throne: false }, cam: 'mid', props: (S) => table(S, board), cast: [old({ arms: [0.15, 1.0] }), dth((t) => ({ hold: 'scythe', mouth: 'frown', eyes: t > V('chess', 'won') ? 'x' : 'open' }))],
          tags: [[-0.7, 2.45, -0.3, 'WIN', V('chess', 'won'), 'green']], sfx: [['tock', V('chess', 'challenged'), { f: 300, gain: 0.5 }]] },
        poker: { set: 'bunker', opt: { alarm: 0 }, cam: 'mid', props: (S) => { table(S, (c, w, h) => { c.fillStyle = '#2a7a4a'; c.fillRect(0, 0, w, h); }); cash(S, 0, 0.47, 0.2, 1.2, 0.3); },
          cast: [old((t) => ({ hold: t > V('poker', 'scythe') ? 'scythe' : 'bag', arms: [0.15, 1.2], shades: true })), dth((t) => ({ hold: t > V('poker', 'scythe') ? null : 'scythe', mouth: 'frown' }))],
          tags: [[-0.7, 2.45, -0.3, 'WIN', V('poker', 'won'), 'green'], [0.7, 0.35, 0.5, 'SCYTHE: GONE', V('poker', 'scythe'), 'red']] },
        dance: { set: 'stage', opt: { banner: 'DANCE-OFF' }, cam: 'wide',
          cast: [old((t) => ({ arms: [1.5 + Math.sin(t * 8), 1.5 - Math.sin(t * 8)], bob: Math.abs(Math.sin(t * 8)) * 0.15 })), dth((t) => ({ arms: t > V('dance', 'hamstring') ? [0.1, 0.1] : [2.0, 1.0], rot: t > V('dance', 'hamstring') ? -1.4 : -0.4, bob: t > V('dance', 'hamstring') ? -0.4 : 0 }))],
          tags: [[-0.7, 2.45, -0.3, 'WIN', V('dance', 'won'), 'green'], [0.7, 0.35, 0.6, 'HAMSTRING', V('dance', 'hamstring'), 'red']], sfx: [['hurt', V('dance', 'hamstring'), { gain: 0.6 }]] },
        twist: { set: 'palace', opt: { throne: false }, cam: 'mid',
          props: (S) => { for (let i = 0; i < 4; i++) S.box((p) => add(p, [0, 0.1 + i * 0.2, -0.6 - i * 0.35]), 0.9, 0.1, 0.18, [200, 196, 186], { bevel: 0.2 }); S.box((p) => add(rotY(p, 0.4), [0.2, 0.03, 0.4]), 0.14, 0.02, 0.05, [250, 220, 50], { bevel: 0.6 }); },
          cast: [dth((t) => ({ x: H.lerp(0.7, 2.6, H.clamp((t - V('twist', 'home')) / 1.4)), walk: t * 6, rot: -1.4, hold: null }))],
          tags: [[0.2, 0.35, 0.9, '🍌', V('twist', 'banana'), 'yellow', 0.5]], sfx: [['pop', V('twist', 'banana'), { gain: 0.5 }]] },
        punch: { set: 'graveyard', cam: 'mid', props: (S) => S.box((p) => add(rotY(p, 0.4), [0.3, 0.03, 0.5]), 0.14, 0.02, 0.05, [250, 220, 50], { bevel: 0.6 }),
          cast: [dth({ x: 0, rot: 0, shades: true, hold: 'scythe', mouth: 'grin', facePaint: null })], tags: [[0, 2.45, -0.4, 'HE JUST WAITS', V('punch', 'waits'), 'dark']] },
        cta: { set: 'stage', opt: { banner: 'CHALLENGE DEATH' }, cam: 'mid', cast: [dth({ x: 0, rot: 0, arms: [1.0, 1.0], hold: 'scythe' })] },
      };
    },
  });
