  // ==================== Pirate problems: the map ====================
  makeComedy({
    badge: 'PIRATE PROBLEMS', badgeCol: '#5a3a1a',
    captions: { say: { forty: '40' }, keys: { pirate: 'o', treasure: 'y', tattooed: 'r', map: 'y', back: 'r', "can't": 'r', forty: 'r', mirror: 'b', parrot: 'g', whole: 'r', sold: 'r', seagull: 'b', cracker: 'y', richest: 'y', chips: 'o', trust: 'g' } },
    beats: ({ V }) => {
      const parrot = (S, x, y, z, t) => { S.box((p) => add(p, [x, y, z]), 0.08, 0.12, 0.08, [40, 180, 80], { bevel: 0.6 }); S.box((p) => add(p, [x, y + 0.16, z]), 0.07, 0.07, 0.07, [230, 60, 50], { bevel: 0.6 }); S.box((p) => add(p, [x, y + 0.15, z + 0.08]), 0.03, 0.02, 0.04, [250, 200, 40], { bevel: 0.4 }); for (const s of [-1, 1]) S.box((p) => add(rotZ(p, s * (0.3 + Math.sin(t * 10) * 0.2)), [x + s * 0.1, y + 0.02, z]), 0.03, 0.09, 0.06, [40, 160, 220], { bevel: 0.3 }); };
      const gull = (S, x, y, z, t) => { S.box((p) => add(p, [x, y, z]), 0.12, 0.07, 0.07, [245, 245, 248], { bevel: 0.6 }); S.box((p) => add(p, [x + 0.13, y + 0.06, z]), 0.05, 0.05, 0.05, [245, 245, 248], { bevel: 0.6 }); S.box((p) => add(p, [x + 0.2, y + 0.05, z]), 0.04, 0.012, 0.012, [250, 190, 40], { bevel: 0.3 }); for (const s of [-1, 1]) S.box((p) => add(rotX(p, s * (0.5 + Math.sin(t * 9) * 0.5)), [x, y + 0.03, z + s * 0.12]), 0.08, 0.01, 0.1, [200, 200, 210], { bevel: 0.2 }); };
      const PI8 = (ex) => ['pirate', 0, 0.2, 0, ex];
      const tat = (c, w, h) => { c.strokeStyle = '#3a2a1a'; c.lineWidth = w * 0.03; c.setLineDash([w * 0.05, w * 0.04]); c.beginPath(); c.moveTo(w * 0.2, h * 0.2); c.lineTo(w * 0.6, h * 0.5); c.lineTo(w * 0.4, h * 0.8); c.stroke(); c.setLineDash([]); c.strokeStyle = '#c82020'; c.lineWidth = w * 0.05; c.beginPath(); c.moveTo(w * 0.3, h * 0.7); c.lineTo(w * 0.5, h * 0.9); c.moveTo(w * 0.5, h * 0.7); c.lineTo(w * 0.3, h * 0.9); c.stroke(); };
      return {
        hook: { set: 'desert', cam: 'wide', props: (S, t) => { S.box((p) => add(p, [0.8, 0.12, 0.4]), 0.3, 0.12, 0.2, [130, 80, 40], { bevel: 0.2 }); parrot(S, -0.15, 2.05, 0.15, t); }, cast: [PI8({ hold: 'hammer', arms: [1.4, 0.4], mouth: 'grin' })],
          tags: [[0.8, 0.6, 0.4, 'TREASURE', V('hook', 'treasure'), 'yellow'], [0, 2.6, -0.4, 'MAP: ON BACK', V('hook', 'tattooed'), 'red', 1.1]] },
        b1: { set: 'desert', cam: 'mid', props: (S, t) => plate(S, 0, 1.35, 0.47, 0.34, 0.32, tat, [230, 190, 150]), cast: [PI8((t) => ({ rot: Math.PI + Math.sin(t * 6) * 0.08, mouth: 'open', sweat: true, headTurn: Math.sin(t * 6) * 0.8 }))], tags: [[0, 0.35, 0.9, "CAN'T SEE", V('b1', 'back'), 'red']] },
        b2: { set: 'graveyard', cam: 'mid', props: (S, t) => { S.box((p) => add(p, [0.7, 1.3, 0.3]), 0.02, 0.4, 0.25, [200, 230, 250], { bevel: 0.2 }); parrot(S, -0.15, 2.05, 0.15, t); }, cast: [PI8({ hair: 'wild', hairCol: [230, 230, 230], mustache: 'beard', hold: 'torch', mouth: 'frown', eyes: 'sleepy' })],
          tags: [[0, 2.6, -0.4, '40 YEARS', V('b2', 'forty'), 'red'], [0.7, 0.35, 0.6, 'MIRROR', V('b2', 'mirror'), 'blue']] },
        b3: { set: 'desert', cam: 'close', props: (S, t) => parrot(S, 0, 1.6, 0.3, t), cast: [], tags: [[0, 0.7, 0.6, 'KNEW ALL ALONG', V('b3', 'whole'), 'green', 1.1]], sfx: [['blip', V('b3', 'parrot'), { gain: 0.5 }]] },
        twist: { set: 'street', opt: { signs: ['HARBOUR', 'FISH', 'CHIPS', 'PAWN'] }, cam: 'close', props: (S, t) => { parrot(S, -0.3, 1.5, 0.3, t); gull(S, 0.35, 1.55, 0.3, t); S.box((p) => add(p, [0.05, 1.62, 0.35]), 0.05, 0.005, 0.05, [230, 200, 140], { bevel: 0.3 }); }, cast: [],
          tags: [[0, 0.6, 0.6, '1 CRACKER', V('twist', 'cracker'), 'yellow'], [0, 2.3, -0.3, 'SOLD', V('twist', 'sold'), 'red']] },
        punch: { set: 'palace', cam: 'mid', props: (S, t) => { for (let i = 0; i < 6; i++) S.box((p) => add(p, [-1.0 + i * 0.4, 0.15, 0.4]), 0.15, 0.15, 0.15, [240, 200, 60], { bevel: 0.3 }); gull(S, 0, 1.4, 0.3, t); S.box((p) => add(p, [0.0, 1.57, 0.3]), 0.06, 0.03, 0.06, [240, 200, 60], { bevel: 0.3 }); }, cast: [],
          tags: [[0, 2.4, -0.4, 'RICHEST BIRD', V('punch', 'richest'), 'yellow'], [0, 0.6, 0.6, 'STILL STEALS CHIPS', V('punch', 'chips'), 'orange', 1.2]] },
        cta: { set: 'desert', cam: 'mid', props: (S, t) => parrot(S, -0.15, 2.05, 0.15, t), cast: [PI8({ mouth: 'frown', brows: 'angry', arms: [0.15, 1.2] })], tags: [[0, 0.35, 0.9, 'TRUST YOUR PET?', V('cta', 'trust'), 'green', 1.1]] },
      };
    },
  });
