  // ==================== History gone wrong: the wheel ====================
  makeComedy({
    badge: 'HISTORY GONE WRONG', badgeCol: '#2a4a9a',
    captions: { say: { 'four hundred': '400', 'ten thousand': '10,000' }, keys: { caveman: 'o', invented: 'g', wheel: 'y', sued: 'r', square: 'r', trial: 'o', four: 'r', won: 'r', lawyer: 'y', rock: 'o', banned: 'r', pyramids: 'y', round: 'g' } },
    beats: ({ V }) => {
      const wheel = (S, x, z, spin) => { S.cyl((p) => add(rotZ(rotX(p, Math.PI / 2), spin), [x, 0.4, z]), 0.4, 0.12, [140, 130, 120], 20); S.cyl((p) => add(rotX(p, Math.PI / 2), [x, 0.4, z + 0.13]), 0.08, 0.02, [90, 80, 70], 10); };
      const sq = (S, x, z) => S.box((p) => add(p, [x, 0.4, z]), 0.36, 0.36, 0.12, [130, 120, 110], { bevel: 0.15 });
      const C1 = (ex) => ['caveman', -0.7, 0.2, 0.3, ex], C2 = (ex) => ['caveman', 0.7, 0.2, -0.3, Object.assign({ hairCol: [180, 90, 40] }, ex)];
      return {
        hook: { set: 'desert', cam: 'wide', props: (S, t) => wheel(S, H.lerp(-1.5, 0, H.clamp(t / 1.5)), 0.5, -t * 3), cast: [C1({ mouth: 'grin', arms: [2.4, 2.4] }), C2((t) => ({ hold: 'club', mouth: t > V('hook', 'sued') ? 'evil' : 'flat', brows: 'angry' }))],
          tags: [[-0.7, 2.5, -0.3, 'WHEEL', V('hook', 'wheel'), 'yellow'], [0, 0.35, 1.0, 'SUED', V('hook', 'sued'), 'red']] },
        square: { set: 'desert', cam: 'mid', props: (S) => sq(S, 0.7, 0.6), cast: [C2({ mouth: 'grin', arms: [0.15, 2.2], hold: 'club' })], tags: [[0.7, 1.0, 0.6, 'FIRST!', V('square', 'first'), 'red']] },
        trial: { set: 'court', cam: 'wide', cast: [C1({ hair: 'wild', hairCol: [240, 240, 240], mouth: 'frown', eyes: 'sleepy' }), C2({ hair: 'wild', hairCol: [240, 240, 240], mouth: 'frown', eyes: 'sleepy', hold: 'club' })], tags: [[0, 2.6, -0.6, '400 YEARS', V('trial', 'four'), 'orange']] },
        twist: { set: 'court', cam: 'mid', shake: V('twist', 'won'), props: (S) => { S.cyl((p) => add(p, [0.8, 0.3, 0.6]), 0.35, 0.3, [120, 116, 110], 9); S.box((p) => add(p, [0.8, 0.75, 0.6]), 0.2, 0.15, 0.04, [120, 116, 110], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#c82020'; c.fillRect(w * 0.42, h * 0.2, w * 0.16, h * 0.6); } }); },
          cast: [C2({ x: -0.2, mouth: 'grin', arms: [2.4, 2.4], hold: 'club' }), ['judge', -1.4, -1.0, 0.3, { hold: 'gavel', arms: [0.15, 2.2] }]], tags: [[-0.2, 2.5, -0.3, 'WON', V('twist', 'won'), 'red'], [0.8, 1.3, 0.6, 'LAWYER', V('twist', 'lawyer'), 'yellow']] },
        punch: { set: 'desert', cam: 'wide', props: (S, t) => { pyramid(S, 0, -2.2, 1.0, 0); for (let i = 0; i < 3; i++) sq(S, -1.6 + i * 0.6 + (t % 3) * 0.1, 0.6); },
          cast: [['caveman', -1.2, 0.8, 1.2, (t) => ({ walk: t * 4, mouth: 'frown', sweat: true, arms: [1.6, 1.6] })], ['caveman', 1.0, 0.6, -0.4, { mouth: 'frown', hairCol: [90, 60, 40], arms: [1.6, 1.6], sweat: true }]],
          tags: [[0, 2.6, -0.6, 'ROUND = BANNED', V('punch', 'banned'), 'red', 1.1], [0, 0.35, 1.1, 'EXPLAINS PYRAMIDS', V('punch', 'pyramids'), 'yellow', 1.2]] },
        cta: { set: 'desert', cam: 'mid', props: (S) => { wheel(S, -0.6, 0.5, 0); sq(S, 0.6, 0.5); }, cast: [], tags: [[-0.6, 1.1, 0.5, 'ROUND', V('cta', 'round'), 'green'], [0.6, 1.1, 0.5, 'SQUARE', V('cta', 'square'), 'red']] },
      };
    },
  });
