  // ==================== Superhero problems: the update ====================
  makeComedy({
    badge: 'SUPERHERO PROBLEMS', badgeCol: '#2a2a3a',
    captions: { say: { 'two percent': '2%', 'ninety nine percent': '99%' }, keys: { 'iron': 'r', dude: 'r', update: 'y', fight: 'r', installing: 'y', two: 'r', waited: 'o', sandwich: 'y', ninety: 'g', restart: 'r', joined: 'r', villain: 'r', 'wi-fi': 'b', gown: 'y', laughing: 'g', later: 'o' } },
    beats: ({ V }) => {
      const ID = (ex) => ['ironDude', -0.6, 0.2, 0.3, ex], VL = (ex) => ['clownGuy', 0.7, 0.2, -0.3, Object.assign({ mouth: 'evil' }, ex)];
      const bar = (pct, label) => (ctx, W, H_) => { const w = W * 0.7, x = W * 0.15, y = H_ * 0.62; ctx.fillStyle = 'rgba(10,20,40,0.85)'; ctx.fillRect(x - 10, y - 50, w + 20, 100); ctx.fillStyle = '#2a3a5a'; ctx.fillRect(x, y, w, 26); ctx.fillStyle = '#4ad0ff'; ctx.fillRect(x, y, w * pct, 26); ctx.fillStyle = '#fff'; ctx.font = FONT(800, 30); ctx.fillText(label, x, y - 14); };
      return {
        hook: { set: 'city', opt: { night: 0.4 }, cam: 'wide', shake: 0.5, booms: [[1.4, 1.2, -1.5, 0.4, 0.8]], cast: [ID({ arms: [0.15, 2.4], mouth: 'grin' }), VL({ hold: 'gun', arms: [0.15, 1.6] })],
          over: (ctx, W, H_, t) => { if (t > V('hook', 'update')) bar(0.01, 'UPDATING...')(ctx, W, H_); }, tags: [[0, 0.35, 1.0, 'UPDATE', V('hook', 'update'), 'yellow']] },
        b1: { set: 'city', opt: { night: 0.4 }, cam: 'mid', cast: [ID({ arms: [0.15, 0.15], eyes: 'sleepy' }), VL({ arms: [0.15, 0.15], mouth: 'o' })], over: bar(0.02, 'INSTALLING 2%') },
        b2: { set: 'street', opt: { night: 0.4 }, cam: 'mid', cast: [ID({ arms: [0.15, 0.15], eyes: 'sleepy' }), VL({ hold: 'bag', arms: [0.15, 1.6], mouth: 'grin', z: 0.4 })], over: bar(0.4, 'INSTALLING 40%'),
          tags: [[0.7, 2.5, -0.3, 'SANDWICH', V('b2', 'sandwich'), 'yellow']] },
        b3: { set: 'street', opt: { night: 0.4 }, cam: 'close', cast: [ID({ x: 0, z: 0, rot: 0, eyes: 'wide', mouth: 'o' })], over: (ctx, W, H_, t) => bar(t > V('b3', 'restart') ? 0.99 : 0.99, t > V('b3', 'restart') ? 'RESTART REQUIRED' : 'INSTALLING 99%')(ctx, W, H_), flash: [V('b3', 'restart')] },
        twist: { set: 'lair', opt: { table: false }, cam: 'wide', cast: [ID({ x: 0.3, z: 0, rot: -0.3, mouth: 'evil', eyes: 'angry', hide: false }), VL({ x: 1.1, z: -0.3, arms: [2.4, 2.4], mouth: 'grin' }), [null, -1.2, 0.5, 0.4, { shirt: [200, 60, 60], pants: [120, 40, 40], mouth: 'o', eyes: 'wide', hair: 'side', hairCol: [60, 40, 30] }]],
          tags: [[0.6, 2.6, -0.4, 'JOINED VILLAIN', V('twist', 'joined'), 'red', 1.1], [0, 0.35, 1.0, 'BETTER WI-FI', V('twist', 'better'), 'blue']] },
        punch: { set: 'street', cam: 'mid', cast: [[null, -0.4, 0.2, 0.3, { robe: [200, 120, 160], shirt: [200, 120, 160], pants: [200, 120, 160], hair: 'side', hairCol: [60, 40, 30], mustache: 'big', mouth: 'grin', arms: [0.15, 2.4] }], ['robber', 0.8, 0.2, -0.3, { mouth: 'open', eyes: 'closed', arms: [2.0, 2.0] }]],
          tags: [[-0.4, 2.5, -0.3, 'DRESSING GOWN', V('punch', 'gown'), 'yellow', 1.1], [0, 0.35, 0.9, 'CRIME ↓', V('punch', 'crime'), 'green']] },
        cta: { set: 'city', opt: { night: 0.4 }, cam: 'mid', cast: [ID({ x: 0, z: 0, rot: 0, mouth: 'flat' })], over: bar(0.5, 'UPDATE NOW?  |  LATER') },
      };
    },
  });
