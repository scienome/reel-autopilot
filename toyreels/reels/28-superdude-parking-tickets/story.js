  // ==================== Superhero problems: Super-Dude's parking tickets ====================
  makeComedy({
    badge: 'SUPERHERO PROBLEMS', badgeCol: '#2a2a3a',
    captions: { say: { 'nine hundred': '900', 'two million dollars': '$2,000,000', eleven: '11' }, keys: { saved: 'g', parking: 'r', tickets: 'r', gary: 'y', fines: 'r', interest: 'r', bus: 'o', destroyed: 'r', promotion: 'g' } },
    beats: ({ V }) => {
      const SD = (ex) => ['superDude', 0, 0.2, 0, ex];
      const gary = (ex) => ['cop', 0.9, 0.3, -0.4, Object.assign({ hold: 'phone', holdCol: [240, 240, 240], arms: [0.15, 1.3] }, ex)];
      const tickets = (S, n) => { for (let i = 0; i < n; i++) S.box((p) => add(rotY(p, (i * 0.7) % 1), [-0.6 + (i % 5) * 0.3, 0.02 + Math.floor(i / 5) * 0.015, 0.6 + (i % 3) * 0.1]), 0.1, 0.006, 0.14, [250, 230, 120], { bevel: 0.2 }); };
      return {
        hook: { set: 'city', opt: { night: 0 }, cam: 'low', cast: [SD((t) => ({ arms: [2.6, 0.3], cape: [210, 30, 30], capeFlap: 0.2 + Math.sin(t * 4) * 0.1, mouth: t > V('hook', 'parking') ? 'o' : 'grin' }))],
          tags: [[0, 0.35, 0.6, '900 TICKETS', V('hook', 'parking'), 'yellow']], flash: [V('hook', 'parking')] },
        land: { set: 'street', cam: 'wide', cast: [SD((t) => ({ bob: Math.max(0, 1.5 - (t - V('land', 'landed')) * 3), arms: [2.6, 2.6] }))],
          booms: [[0, 0.1, 0.2, V('land', 'landed') + 0.5, 0.8]], tags: [[-1.0, 2.45, -0.4, 'ROAD', V('land', 'road'), 'orange'], [0, 2.2, -0.4, 'ROOF', V('land', 'roof'), 'orange'], [1.0, 2.45, -0.4, 'BUS', V('land', 'bus'), 'orange']] },
        cop: { set: 'street', cam: 'mid', cast: [SD({ x: -0.6, rot: 0.4, mouth: 'frown', brows: 'worried' }), gary({ mustache: 'big', mouth: 'evil' })], props: (S, t) => tickets(S, Math.floor((t - V('cop', 'gary')) * 4)),
          tags: [[0.9, 2.45, -0.4, 'OFFICER GARY', V('cop', 'gary'), 'blue']], sfx: [['paper', V('cop', 'gary'), { gain: 0.5 }]] },
        debt: { set: 'court', cam: 'mid', shake: V('debt', 'interest'), cast: [SD({ eyes: 'x', mouth: 'open', sweat: true })], props: (S) => tickets(S, 30),
          tags: [[0, 2.45, -0.4, '$2,000,000', V('debt', 'two'), 'red'], [0, 0.35, 0.8, '+ INTEREST', V('debt', 'interest'), 'dark']] },
        twist: { set: 'city', opt: { night: 0.6 }, cam: 'wide', shake: V('twist', 'destroyed'),
          cast: [SD({ hold: 'phone', arms: [0.15, 1.8], mouth: 'flat', cape: null })],
          booms: [[-1.8, 1.5, -3, V('twist', 'destroyed'), 2.0], [1.6, 2.0, -4, V('twist', 'destroyed') + 0.4, 2.2], [0.2, 2.6, -5, V('twist', 'eleven'), 2.4]],
          tags: [[0, 0.35, 0.8, 'CITY: DESTROYED', V('twist', 'destroyed'), 'red', 1.1]] },
        punch: { set: 'office', cam: 'mid', cast: [gary({ x: 0, rot: 0, medals: 6, mustache: 'big', mouth: 'grin', arms: [2.3, 2.3] })], tags: [[0, 2.45, -0.4, 'PROMOTED', V('punch', 'promotion'), 'green']], sfx: [['success', V('punch', 'promotion'), { f: 'C6', gain: 0.5 }]] },
        cta: { set: 'stage', opt: { banner: 'PAY OR NOT?' }, cam: 'wide', cast: [SD({ x: -0.7, rot: 0.2, mouth: 'frown' }), gary({ x: 0.7, rot: -0.2, mouth: 'grin' })] },
      };
    },
  });
