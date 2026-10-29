  // ==================== Heists gone wrong: the escape ====================
  makeComedy({
    badge: 'HEISTS GONE WRONG', badgeCol: '#c8781a',
    captions: { say: { ten: '10' }, keys: { three: 'y', perfect: 'g', escape: 'o', ten: 'r', years: 'r', spoons: 'y', rope: 'y', fake: 'o', head: 'o', jumped: 'g', guard: 'b', unlocked: 'r', day: 'r', back: 'r', free: 'g', 'wi-fi': 'b', rent: 'r', worse: 'r' } },
    beats: ({ V }) => {
      const PR = (x, z, rot, num, ex) => ['prisoner', x, z, rot, Object.assign({ number: num }, ex)];
      const gang = (ex = {}) => [PR(-1.0, 0.2, 0.3, '1138', ex), PR(0, -0.1, 0, '4077', Object.assign({ mustache: 'big' }, ex)), PR(1.0, 0.2, -0.3, '0451', Object.assign({ hair: 'long', hairCol: [200, 150, 60] }, ex))];
      const fence = (S) => { for (let i = 0; i < 9; i++) S.box((p) => add(p, [-2 + i * 0.5, 1.1, -0.8]), 0.02, 1.1, 0.02, [150, 150, 160], { bevel: 0.2 }); S.box((p) => add(p, [0, 2.2, -0.8]), 2.1, 0.02, 0.02, [150, 150, 160], { bevel: 0.2 }); S.box((p) => add(p, [0, 1.1, -0.8]), 2.1, 0.01, 0.01, [150, 150, 160], { bevel: 0.2 }); };
      return {
        hook: { set: 'prison', opt: { bars: true }, cam: 'mid', cast: gang({ mouth: 'grin' }), tags: [[0, 2.3, 1.9, 'PERFECT ESCAPE', V('hook', 'perfect'), 'green', 1.1], [0, 0.45, 1.9, '10 YEARS', V('hook', 'ten'), 'red']] },
        tools: { set: 'prison', cam: 'mid', props: (S) => { S.box((p) => add(p, [0.9, 0.3, -0.6]), 0.6, 0.12, 0.3, [200, 200, 210], { bevel: 0.2 }); S.box((p) => add(p, [1.3, 0.5, -0.6]), 0.12, 0.12, 0.12, [230, 190, 160], { bevel: 0.5 }); },
          cast: [PR(-0.6, 0.3, 0.3, '1138', { hold: 'hammer', mouth: 'grin', arms: [0.15, 1.8] })], tags: [[-1.2, 2.4, -0.4, 'SPOONS', V('tools', 'spoons'), 'yellow'], [0, 2.4, -0.4, 'ROPE', V('tools', 'rope'), 'yellow'], [1.1, 1.0, -0.4, 'FAKE HEAD', V('tools', 'fake'), 'orange']] },
        night: { set: 'base', cam: 'wide', props: fence, cast: [PR(-1.0, 0.3, 0, '1138', { arms: [2.6, 2.6], bob: 0.4, mouth: 'open' }), PR(0, 0.5, 0, '4077', (t) => ({ walk: t * 9, mouth: 'grin' })), PR(1.0, -1.4, Math.PI, '0451', { arms: [2.4, 2.4] })],
          tags: [[0, 0.35, 1.0, 'DUG ✓ CLIMBED ✓ JUMPED ✓', V('night', 'jumped'), 'green', 1.4]] },
        twist: { set: 'prison', cam: 'wide', cast: [['cop', 1.2, -0.6, -0.4, (t) => ({ arms: [0.15, 2.4 + Math.sin(t * 8) * 0.3], mouth: 'smile' })], ...gang({ mouth: 'o', eyes: 'wide' })],
          tags: [[1.2, 2.5, -0.5, '👋', V('twist', 'waved'), 'white', 0.5], [0, 0.35, 1.0, 'UNLOCKED SINCE DAY 1', V('twist', 'unlocked'), 'red', 1.3]], flash: [V('twist', 'unlocked')] },
        punch: { set: 'prison', cam: 'mid', props: (S) => plate(S, 0, 2.0, -1.4, 0.9, 0.4, (c, w, h) => { c.fillStyle = '#2a2a30'; c.fillRect(0, 0, w, h); c.fillStyle = '#4af08a'; c.font = FONT(900, h * 0.3); c.textAlign = 'center'; c.fillText('FREE WI-FI ✓', w / 2, h * 0.62); }),
          cast: gang({ mouth: 'grin', shades: true, arms: [0.15, 1.4] }), tags: [[0, 0.35, 1.0, 'RENT OUTSIDE: WORSE', V('punch', 'rent'), 'red', 1.3]] },
        cta: { set: 'base', cam: 'mid', props: fence, cast: [PR(0, 0.3, 0, '1138', { mouth: 'flat', brows: 'raised' })], tags: [[0, 0.35, 0.9, 'BE HONEST', V('cta', 'honest'), 'yellow']] },
      };
    },
  });
