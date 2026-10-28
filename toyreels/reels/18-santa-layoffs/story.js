  // ==================== Santa's layoffs ====================
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#c8282e',
    captions: { say: { 'twenty four seven': '24/7' }, keys: { robots: 'o', elves: 'g', fired: 'r', christmas: 'g', cookies: 'y', hacked: 'r', naughty: 'r', coal: 'r', arrested: 'r' } },
    beats: ({ V }) => {
      const elf = (x, z, rot, ex = {}) => [null, x, z, rot, (t) => Object.assign({ s: 0.6, shirt: [40, 150, 60], pants: [200, 40, 40], hat: 'santa', mouth: 'smile' }, typeof ex === 'function' ? ex(t) : ex)];
      const bot = (x, z, rot, ex = {}) => [null, x, z, rot, (t) => Object.assign({ shirt: [190, 194, 204], pants: [160, 164, 174], hat: 'helmet', hatCol: [120, 124, 134], walk: t * 5 }, typeof ex === 'function' ? ex(t) : ex)];
      return {
        hook: { set: 'palace', opt: { throne: false }, cam: 'wide',
          cast: [['santa', 0, -0.6, 0, { arms: [0.15, 1.4], hold: 'remote' }], elf(-1.2, 0.4, 0.4, (t) => ({ mouth: t > V('hook', 'elves') ? 'open' : 'smile', eyes: t > V('hook', 'elves') ? 'angry' : 'open' })), elf(1.2, 0.4, -0.4, (t) => ({ mouth: t > V('hook', 'elves') ? 'open' : 'smile', eyes: t > V('hook', 'elves') ? 'angry' : 'open' })),
                 bot(-0.5, 0.6, 0, (t) => ({ hide: t < V('hook', 'robots'), walk: 0 })), bot(0.5, 0.6, 0, (t) => ({ hide: t < V('hook', 'robots'), walk: 0 }))],
          tags: [[0, 2.45, -0.6, 'ROBOTS', V('hook', 'robots'), 'orange']], sfx: [['powerup', V('hook', 'robots'), { gain: 0.5 }]] },
        memo: { set: 'office', cam: 'mid',
          cast: [elf(-0.6, 0.3, 0.3, (t) => ({ hold: 'phone', arms: [0.15, 1.6], eyes: t > V('memo', 'fired') ? 'wide' : 'open', mouth: t > V('memo', 'fired') ? 'o' : 'smile' })), elf(0.6, 0.3, -0.3, (t) => ({ hold: 'phone', arms: [0.15, 1.6], eyes: t > V('memo', 'fired') ? 'wide' : 'open', mouth: t > V('memo', 'fired') ? 'frown' : 'smile' }))],
          tags: [[0, 2.45, -0.4, "YOU'RE FIRED 🎄", V('memo', 'fired'), 'red']], sfx: [['ding', V('memo', 'email'), { f: 'A5', gain: 0.4 }]] },
        robots: { set: 'base', cam: 'wide', at: [-0.5, 0.5],
          props: (S, t) => { for (let i = 0; i < 4; i++) S.box((p) => add(p, [-2 + ((t * 0.8 + i * 1.1) % 4.4), 0.25, 0.9]), 0.18, 0.18, 0.18, [[220, 40, 40], [40, 120, 220], [250, 196, 40], [40, 170, 80]][i], { bevel: 0.3 }); },
          cast: [bot(-1.2, -0.2, 0.3), bot(0, -0.4, 0), bot(1.2, -0.2, -0.3)],
          tags: [[0, 2.45, -0.6, '24/7', V('robots', 'twenty'), 'orange'], [0, 0.35, 0.6, 'NO COOKIES', V('robots', 'cookies'), 'red']] },
        revenge: { set: 'bunker', opt: { alarm: 0.6 }, cam: 'mid',
          cast: [elf(-0.5, 0.3, 0.3, { hold: 'phone', arms: [0.15, 1.6], mouth: 'evil', eyes: 'angry', shades: true }), elf(0.5, 0.3, -0.3, { arms: [1.2, 1.2], mouth: 'grin', eyes: 'angry' })],
          tags: [[0, 2.45, -0.4, 'NAUGHTY LIST: HACKED', V('revenge', 'hacked'), 'red', 1.15]], sfx: [['typing', V('revenge', 'they'), { gain: 0.5 }], ['glitch', V('revenge', 'hacked'), { gain: 0.6 }]] },
        twist: { set: 'prison', opt: { bars: true }, cam: 'wide',
          cast: [['santa', 0, -0.8, 0, (t) => ({ hide: t < V('twist', 'santa'), stripes: [[240, 240, 236], [30, 30, 36]], number: 'HO HO', hat: 'santa', mouth: 'frown', brows: 'worried' })],
                 [null, -0.9, 0.6, 0.2, (t) => ({ hide: t > V('twist', 'santa'), s: 0.55, shirt: [90, 150, 230], hold: 'bag', holdCol: [40, 40, 44], mouth: 'open', eyes: 'wide' })]],
          tags: [[0, 0.35, 0.9, 'COAL FOR EVERYONE', V('twist', 'coal'), 'dark', 1.1], [0, 2.45, -0.6, 'ARRESTED', V('twist', 'arrested'), 'red']], sfx: [['slap', V('twist', 'arrested'), { gain: 0.6 }]] },
        cta: { set: 'stage', opt: { banner: 'ELVES OR SANTA?' }, cam: 'wide',
          cast: [['santa', -0.7, 0, 0.2, { stripes: [[240, 240, 236], [30, 30, 36]], number: 'HO HO', hat: 'santa', mouth: 'frown' }], elf(0.7, 0.2, -0.2, { arms: [2.4, 2.4], mouth: 'grin' })] },
      };
    },
  });
