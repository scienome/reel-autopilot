  // ==================== World leaders in bricks: Kim's haircut law ====================
  makeComedy({
    badge: 'WORLD LEADERS IN BRICKS', badgeCol: '#c8282e',
    captions: { say: { twenty: '20', 'twenty five million': '25 million', three: '3', ten: '10' }, keys: { haircut: 'y', law: 'r', same: 'o', barber: 'y', escaped: 'r', clippers: 'o', growing: 'r', hat: 'g', forever: 'r' } },
    beats: ({ V }) => {
      const citizens = (wild) => [-1.6, -0.55, 0.55, 1.6].map((x, i) => [null, x, 0.2 + (i % 2) * 0.3, -0.15 * x, { shirt: [[90, 90, 100], [60, 70, 90], [110, 100, 90], [70, 80, 70]][i], hair: wild ? 'wild' : 'flattop', hairCol: [24, 22, 26], mouth: wild ? 'frown' : 'flat', brows: wild ? 'worried' : null }]);
      const barber = (ex) => [null, 0, 0, 0, (t) => Object.assign({ shirt: [244, 244, 244], pants: [60, 60, 70], hair: 'short', hairCol: [40, 40, 40], mustache: 'big', hairCol: [40, 40, 40], hold: 'sword', holdCol: [200, 200, 210] }, typeof ex === 'function' ? ex(t) : ex)];
      return {
        hook: { set: 'palace', cam: 'mid', cast: [['kim', 0, -0.6, 0, { arms: [0.15, 1.8], mouth: 'grin' }]],
          props: (S) => plate(S, 0.9, 1.5, -1.2, 0.35, 0.45, (c, w, h) => { c.fillStyle = '#f4f0e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#c82020'; c.font = FONT(800, h * 0.12); c.textAlign = 'center'; c.fillText('LAW #1', w / 2, h * 0.18); c.fillStyle = '#16161c'; c.fillRect(w * 0.3, h * 0.3, w * 0.4, h * 0.2); c.fillStyle = '#e8c8a0'; c.fillRect(w * 0.33, h * 0.45, w * 0.34, h * 0.35); }),
          tags: [[0, 0.35, 0.6, 'HAIRCUT LAW', V('hook', 'law'), 'red']], sfx: [['stamp', V('hook', 'law'), { gain: 0.6 }]] },
        law: { set: 'street', cam: 'wide', cast: citizens(false), tags: [[0, 2.45, -0.4, 'SAME HAIRCUT', V('law', 'same'), 'orange'], [0, 0.35, 0.8, '1 STYLE', V('law', 'style'), 'red']] },
        barber: { set: 'palace', cam: 'mid', cast: [['kim', -0.5, -0.4, 0.3, { mouth: 'grin', eyes: 'closed' }], barber({ x: 0.6, rot: -0.5, arms: [0.15, 1.5], mouth: 'flat', sweat: true })],
          tags: [[0, 2.45, -0.4, '20 YEARS', V('barber', 'twenty'), 'dark']], sfx: [['erase', V('barber', 'cut'), { gain: 0.4 }]] },
        escape: { set: 'base', cam: 'wide', at: [-0.4, 0.4],
          cast: [barber((t) => ({ x: H.lerp(-2.2, 2.4, H.clamp((t - V('escape', 'barber')) / 2.6)), z: 0.6, rot: Math.PI / 2, walk: t * 9, mouth: 'grin', arms: [0.15, 1.3] }))],
          tags: [[0, 2.45, -0.4, 'ESCAPED', V('escape', 'escaped'), 'red'], [0, 0.35, 0.8, 'WITH THE CLIPPERS', V('escape', 'clippers'), 'orange', 1.1]], sfx: [['whoosh', V('escape', 'escaped'), { dur: 0.6, gain: 0.5 }]] },
        twist: { set: 'street', cam: 'wide', cast: citizens(true), tags: [[0, 2.45, -0.4, '25 MILLION', V('twist', 'twenty'), 'dark'], [0, 0.35, 0.8, 'GROWING OUT', V('twist', 'growing'), 'red']] },
        punch: { set: 'palace', cam: 'mid', cast: [['kim', 0, -0.6, 0, (t) => ({ hat: t > V('punch', 'hat') ? 'tophat' : null, hair: t > V('punch', 'hat') ? null : 'wild', hairCol: [24, 22, 26], mouth: 'frown', eyes: 'angry' })]],
          tags: [[0, 0.35, 0.6, 'FOREVER', V('punch', 'forever'), 'dark']], sfx: [['pop', V('punch', 'hat'), { gain: 0.5 }]] },
        cta: { set: 'stage', opt: { banner: 'RATE THE HAIRCUT' }, cam: 'mid', cast: [['kim', 0, 0, 0, { arms: [2.3, 2.3], mouth: 'grin' }]], tags: [[0, 0.35, 0.6, '?/10', V('cta', 'ten'), 'yellow']] },
      };
    },
  });
