  // ==================== History gone wrong: Caesar's party ====================
  makeComedy({
    badge: 'HISTORY GONE WRONG', badgeCol: '#2a4a9a',
    captions: { say: { 'twenty three': '23' }, keys: { caesar: 'y', surprise: 'g', knife: 'r', butter: 'y', cake: 'o', brutus: 'r', sorry: 'y', twenty: 'r', slipped: 'r', confetti: 'g', nero: 'r', marshmallows: 'o' } },
    beats: ({ V }) => {
      const toga = (x, z, rot, ex) => ['caesar', x, z, rot, Object.assign({ hat: null, shirtPaint: null, hairCol: [60, 44, 32], hold: 'sword', arms: [0.15, 1.3] }, ex)];
      const friends = (ex = {}) => [toga(-1.5, -0.5, 0.5, ex), toga(-0.7, -1.0, 0.2, Object.assign({ hair: 'bob' }, ex)), toga(0.7, -1.0, -0.2, ex), toga(1.5, -0.5, -0.5, Object.assign({ mustache: 'beard' }, ex))];
      const C = (ex) => ['caesar', 0, 0.4, 0, ex];
      const confetti = (S, t, n = 30) => { const r = H.rng(7); for (let i = 0; i < n; i++) { const x = -2 + r() * 4, z = -1 + r() * 2, y = 3 - ((t * 0.8 + r() * 3) % 3); S.box((p) => add(rotY(p, t * 3 + i), [x, y, z]), 0.03, 0.005, 0.02, [[230, 60, 80], [60, 160, 230], [240, 200, 60], [80, 200, 120]][i % 4], { bevel: 0.1 }); } };
      return {
        hook: { set: 'palace', cam: 'wide', props: (S, t) => confetti(S, t), cast: [...friends({ arms: [2.4, 1.3], mouth: 'grin' }), C({ eyes: 'wide', mouth: 'o' })], flash: [V('hook', 'surprise')],
          tags: [[0, 2.5, -0.5, 'SURPRISE!', V('hook', 'surprise'), 'green'], [0, 0.35, 1.0, 'EVERYONE: KNIFE', V('hook', 'knife'), 'red', 1.1]] },
        butter: { set: 'palace', cam: 'mid', cast: [toga(-0.5, 0.2, 0.3, { mouth: 'grin', arms: [0.15, 1.6] }), C({ x: 0.6, rot: -0.3, mouth: 'smile' })], tags: [[-0.5, 0.35, 0.8, 'BUTTER KNIFE', V('butter', 'butter'), 'yellow']] },
        cake: { set: 'palace', opt: { throne: false }, cam: 'mid', props: (S) => { S.cyl((p) => add(p, [0, 0, 0.2]), 0.5, 0.4, [120, 80, 50], 20); S.cyl((p) => add(p, [0, 0.41, 0.2]), 0.35, 0.02, [245, 245, 250], 20); },
          cast: [C({ x: 0, z: -0.5, mouth: 'frown', eyes: 'wide', brows: 'worried' })], tags: [[0, 0.35, 1.0, 'CAKE: 0', V('cake', 'cake'), 'red']] },
        brutus: { set: 'palace', cam: 'mid', cast: [toga(-0.5, 0.2, 0.3, { hold: 'sword', scale: 1.0, mouth: 'smile', mustache: 'beard', arms: [2.6, 0.4] }), C({ x: 0.7, rot: -0.4, eyes: 'wide', mouth: 'o' })],
          props: (S, t) => { if (t > V('brutus', 'card')) plate(S, -0.4, 1.4, 0.6, 0.4, 0.3, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#c82020'; c.font = FONT(900, h * 0.3); c.textAlign = 'center'; c.fillText('SORRY', w / 2, h * 0.6); }); },
          tags: [[-0.5, 2.5, -0.3, 'BRUTUS', V('brutus', 'brutus'), 'red']] },
        twist: { set: 'palace', cam: 'mid', shake: V('twist', 'slipped'), props: (S, t) => confetti(S, t, 50),
          cast: [C((t) => { const k = H.clamp((t - V('twist', 'slipped')) * 3); return { x: 0, rot: 0, bob: -k * 0.6, eyes: k > 0.5 ? 'x' : 'wide', mouth: 'o', arms: [2.6 * k + 0.15, 2.6 * k + 0.15], hide: false }; })],
          tags: [[0, 2.5, -0.6, 'SURVIVED 23', V('twist', 'twenty'), 'green'], [0, 0.35, 1.0, 'CONFETTI', V('twist', 'confetti'), 'red']], sfx: [['hurt', V('twist', 'slipped') + 0.2, { gain: 0.6 }]] },
        punch: { set: 'city', opt: { night: 1 }, cam: 'wide', cast: [['caesar', -1.0, 0.4, 0.4, { mouth: 'frown' }], ['caesar', 1.0, 0.4, -0.4, { robe: [160, 40, 60], shirt: [160, 40, 60], shirtPaint: null, hairCol: [30, 24, 20], hold: 'torch', mouth: 'grin', arms: [0.15, 2.0] }]],
          booms: [[0, 1.2, -2.0, V('punch', 'nero'), 1.4], [1.8, 1.0, -2.4, V('punch', 'marshmallows'), 1.2]], tags: [[1.0, 2.5, -0.3, 'NERO', V('punch', 'nero'), 'red'], [0, 0.35, 1.0, '🔥 MARSHMALLOWS', V('punch', 'marshmallows'), 'orange']] },
        cta: { set: 'palace', cam: 'mid', props: (S, t) => confetti(S, t), cast: [C({ x: 0, z: 0, mouth: 'grin', arms: [2.4, 2.4], hold: 'sword' })], tags: [[0, 0.35, 0.8, 'TAG THEM', V('cta', 'tag'), 'yellow']] },
      };
    },
  });
