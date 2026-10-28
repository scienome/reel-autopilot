  // ==================== What if: the last man on Earth gets a call ====================
  makeComedy({
    badge: 'WHAT IF...?', badgeCol: '#2a8a4a',
    captions: { say: { 'eight billion': '8 billion', three: '3' }, keys: { last: 'r', gone: 'r', cat: 'o', silence: 'o', rang: 'g', anyone: 'y', warranty: 'r', robot: 'r', survived: 'r' } },
    beats: ({ V }) => {
      const man = (ex) => [null, 0, 0.2, 0, (t) => Object.assign({ shirt: [120, 100, 80], pants: [70, 70, 80], hair: 'wild', hairCol: [90, 70, 50], mustache: 'beard', hairCol: [90, 70, 50] }, typeof ex === 'function' ? ex(t) : ex)];
      return {
        hook: { set: 'street', opt: { night: 0.8, signs: ['CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'] }, cam: 'mid',
          cast: [man((t) => ({ hold: 'phone', arms: [0.15, 1.8], eyes: 'wide', mouth: 'o' }))],
          tags: [[0, 2.45, -0.4, 'LAST HUMAN', V('hook', 'last'), 'red']], sfx: [['ding', V('hook', 'phone'), { f: 'E6', gain: 0.4 }]] },
        alone: { set: 'street', opt: { night: 0.5, signs: ['CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED', 'CLOSED'] }, cam: 'wide',
          props: (S, t) => cat(S, 1.0, 0.6, 0.6, Math.PI, t > V('alone', "didn't") ? 1 : 0),
          cast: [man({ x: -0.5, mouth: 'flat', eyes: 'sleepy' })],
          tags: [[0, 2.45, -0.4, 'POPULATION: 1', V('alone', 'gone'), 'dark'], [1.0, 0.35, 0.6, '+ 1 CAT', V('alone', 'cat'), 'orange']], sfx: [['hurt', V('alone', "didn't"), { gain: 0.4 }]] },
        ring: { set: 'graveyard', cam: 'mid', shake: V('ring', 'rang'),
          cast: [man((t) => ({ hold: 'phone', arms: [0.15, t > V('ring', 'rang') ? 1.8 : 0.3], eyes: t > V('ring', 'rang') ? 'wide' : 'sleepy', mouth: t > V('ring', 'rang') ? 'open' : 'flat' }))],
          tags: [[0, 2.45, -0.4, '3 YEARS', V('ring', 'three'), 'dark'], [0, 0.35, 0.6, '☎ RING RING', V('ring', 'rang'), 'green']], sfx: [['bell', V('ring', 'rang'), { gain: 0.6 }], ['bell', V('ring', 'rang') + 0.5, { gain: 0.6 }]] },
        hope: { set: 'graveyard', cam: 'close',
          cast: [man({ hold: 'phone', arms: [0.15, 1.8], eyes: 'wide', mouth: 'grin', sweat: true })],
          tags: [[0, 0.9, 0.4, 'HELLO??', V('hope', 'hello'), 'yellow']] },
        spam: { set: 'graveyard', cam: 'mid',
          cast: [man((t) => ({ hold: 'phone', arms: [0.15, 1.8], eyes: t > V('spam', 'warranty') ? 'x' : 'wide', mouth: 'o' }))],
          tags: [[0, 2.45, -0.4, 'EXTENDED WARRANTY', V('spam', 'warranty'), 'red', 1.15]], flash: [V('spam', 'warranty')], sfx: [['error', V('spam', 'warranty'), { gain: 0.5 }]] },
        twist: { set: 'bunker', opt: { alarm: 0 }, cam: 'mid',
          cast: [-0.9, 0, 0.9].map((x, i) => [null, x, -0.2 + (i % 2) * 0.3, -0.3 * (x), (t) => ({ shirt: [190, 194, 204], pants: [160, 164, 174], hat: 'helmet', hatCol: [120, 124, 134], hold: 'phone', arms: [0.15, 1.8], bob: Math.abs(Math.sin(t * 5 + i)) * 0.04 })]),
          tags: [[0, 2.45, -0.4, 'ROBOCALLS: SURVIVED', V('twist', 'survived'), 'red', 1.15]], sfx: [['typing', V('twist', 'robot'), { gain: 0.4 }]] },
        cta: { set: 'graveyard', cam: 'mid', cast: [man({ hold: 'phone', arms: [0.15, 1.8], eyes: 'angry', mouth: 'open' })], tags: [[0, 0.35, 0.6, 'LAST WORDS?', V('cta', 'last'), 'yellow']] },
      };
    },
  });
