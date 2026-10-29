  // ==================== The higher powers: heaven is full ====================
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#4a2a7a',
    captions: { say: {}, keys: { heaven: 'y', room: 'r', airbnb: 'o', friendly: 'g', red: 'r', horns: 'r', heating: 'o', hot: 'r', five: 'y', stars: 'y', nobody: 'r', hell: 'r', waiting: 'o', loyalty: 'y', ten: 'r', cloud: 'b' } },
    beats: ({ V }) => {
      const PETER = (ex) => ['angel', -0.6, 0.2, 0.3, Object.assign({ mustache: 'beard', hairCol: [240, 240, 240], hold: 'briefcase' }, ex)], DEV = (ex) => ['devil', 0.6, 0.2, -0.3, Object.assign({ mouth: 'grin', hold: null }, ex)];
      const crowd = (n, ex = {}) => Array.from({ length: n }, (_, i) => ['angel', -1.8 + i * (3.6 / (n - 1)), -0.9 - (i % 2) * 0.4, 0, Object.assign({ hat: 'halo', mouth: 'o', scale: 0.85, hairCol: [[90, 60, 40], [30, 30, 30], [220, 180, 90]][i % 3] }, ex)]);
      const tub = (S, t) => { S.cyl((p) => add(p, [0.3, 0, 0.3]), 0.7, 0.35, [200, 60, 40], 22); S.cyl((p) => add(p, [0.3, 0.36, 0.3]), 0.62, 0.02, [255, 120, 40], 22); for (let i = 0; i < 6; i++) S.box((p) => add(p, [0.3 + Math.cos(i + t * 2) * 0.4, 0.42 + ((t * 0.7 + i * 0.3) % 0.6), 0.3 + Math.sin(i * 2) * 0.3]), 0.04, 0.04, 0.04, [255, 200, 120], { bevel: 0.8 }); };
      return {
        hook: { set: 'heaven', cam: 'wide', cast: [...crowd(6), PETER({ x: 0, z: 0.6, rot: 0, mouth: 'o', eyes: 'wide', sweat: true })], tags: [[0, 2.5, -0.6, 'FULL', V('hook', 'room'), 'red'], [0, 0.35, 1.1, 'AIRBNB', V('hook', 'airbnb'), 'orange']] },
        host: { set: 'hell', cam: 'mid', cast: [PETER({ mouth: 'smile' }), DEV({ arms: [2.2, 0.15] })], tags: [[0.6, 2.6, -0.3, 'HOST ★★★★★', V('host', 'friendly'), 'green', 1.1], [0.6, 0.35, 0.7, 'LITTLE HORNS', V('host', 'horns'), 'red']] },
        perks: { set: 'hell', cam: 'mid', props: tub, cast: [PETER({ x: 0.3, z: 0.3, rot: 0, bob: -0.6, hold: null, shades: true, mouth: 'grin', arms: [2.0, 2.0], sweat: true })],
          tags: [[-1.0, 2.4, -0.3, 'FREE HEATING', V('perks', 'heating'), 'orange'], [0.3, 0.35, 1.0, 'VERY HOT', V('perks', 'very'), 'red']] },
        review: { set: 'hell', cam: 'close', cast: [PETER({ x: 0, z: 0, rot: 0, hold: 'phone', arms: [0.15, 1.6], mouth: 'grin', shades: true })], tags: [[0, 0.5, 0.6, '★★★★★', V('review', 'stars'), 'yellow']], sfx: [['ding', V('review', 'stars'), { gain: 0.5 }]] },
        twist: { set: 'heaven', cam: 'wide', cast: [['angel', 0, 0.2, 0, { mouth: 'frown', hold: null, brows: 'worried' }]], tags: [[0, 2.5, -0.5, 'EMPTY', V('twist', 'nobody'), 'red'], [0, 0.35, 0.9, 'HELL: WAITING LIST', V('twist', 'waiting'), 'orange', 1.2]] },
        punch: { set: 'heaven', cam: 'mid', props: (S) => plate(S, 0.6, 1.3, 0.5, 0.5, 0.3, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#ffe680'); g.addColorStop(1, '#c8a020'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#5a3a00'; c.font = FONT(900, h * 0.2); c.fillText('CLOUD CLUB', w * 0.08, h * 0.35); for (let i = 0; i < 10; i++) { c.strokeStyle = '#5a3a00'; c.beginPath(); c.arc(w * (0.1 + i * 0.085), h * 0.7, w * 0.03, 0, TAU); c.stroke(); } }),
          cast: [PETER({ x: -0.3, rot: 0.2, hold: null, mouth: 'grin', arms: [0.15, 2.0] })], tags: [[0, 0.35, 0.9, 'DIE 10x = FREE CLOUD', V('punch', 'ten'), 'yellow', 1.3]] },
        cta: { set: 'hell', cam: 'mid', cast: [PETER({ hold: null, shades: true, mouth: 'grin' }), DEV({ arms: [0.15, 2.0] })], tags: [[0, 0.35, 0.9, 'PICK ONE', V('cta', 'pick'), 'red']] },
      };
    },
  });
