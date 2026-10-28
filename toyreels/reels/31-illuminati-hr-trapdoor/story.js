  // ==================== The Illuminati files: HR ====================
  makeComedy({
    badge: 'THE ILLUMINATI FILES', badgeCol: '#a8841a',
    captions: { say: {}, keys: { illuminati: 'y', shortest: 'r', hr: 'o', monday: 'o', messed: 'r', greg: 'y', secret: 'r', printer: 'r', sorry: 'o', blinked: 'r', over: 'r', also: 'y' } },
    beats: ({ V }) => {
      const council = (ex = {}) => [-1.4, 1.4].map((x) => ['illuminati', x, -1.0, -0.35 * x, Object.assign({ mouth: 'evil' }, ex)]);
      const greg = (ex) => [null, 0, 0.5, Math.PI, (t) => Object.assign({ suit: true, shirt: [90, 90, 100], pants: [90, 90, 100], tie: [60, 120, 200], hair: 'side', hairCol: [140, 100, 60] }, typeof ex === 'function' ? ex(t) : ex)];
      const hole = (S, open) => { if (open > 0) S.box((p) => add(p, [0, 0.003, 0.5]), 0.45 * open, 0.002, 0.35 * open, [8, 6, 10], { bevel: 0.05 }); };
      return {
        hook: { set: 'lair', cam: 'wide', cast: council(), tags: [[0, 0.35, 0.8, 'SHORTEST HR MEETINGS', V('hook', 'shortest'), 'red', 1.2]] },
        meeting: { set: 'lair', cam: 'wide', cast: council(), tags: [[0, 2.2, -0.4, 'MONDAY', V('meeting', 'monday'), 'yellow'], [0, 0.35, 0.8, 'WHO MESSED UP?', V('meeting', 'messed'), 'red']], sfx: [['bell', V('meeting', 'monday'), { gain: 0.4 }]] },
        greg: { set: 'office', opt: { desk: false }, cam: 'mid',
          props: (S) => { S.box((p) => add(p, [0.8, 0.4, -0.4]), 0.3, 0.4, 0.3, [220, 220, 226], { bevel: 0.2 }); plate(S, 0.8, 0.86, -0.3, 0.2, 0.26, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#c82020'; c.font = FONT(800, h * 0.12); c.textAlign = 'center'; c.fillText('TOP SECRET', w / 2, h * 0.2); c.fillStyle = '#d8a83a'; c.beginPath(); c.moveTo(w / 2, h * 0.3); c.lineTo(w * 0.75, h * 0.8); c.lineTo(w * 0.25, h * 0.8); c.fill(); }, [250, 250, 250]); },
          cast: [greg({ x: -0.5, z: 0.2, rot: 0.4, mouth: 'smile', hold: 'phone', arms: [0.15, 1.6] })],
          tags: [[-0.5, 2.45, -0.3, 'GREG', V('greg', 'greg'), 'yellow'], [0.8, 0.35, 0.6, 'ON THE PRINTER', V('greg', 'printer'), 'red']], sfx: [['typebar', V('greg', 'printer'), { gain: 0.5 }]] },
        sorry: { set: 'lair', opt: { eye: 1 }, cam: [[0, 1.8, 6.4], [0, 1.9, -1], [0, 1.8, 5.6], [0, 2.0, -1]], cast: [...council(), greg((t) => ({ mouth: 'frown', brows: 'worried', sweat: true }))],
          tags: [[0, 0.35, 1.2, 'SORRY', V('sorry', 'sorry'), 'dark']], sfx: [['blip', V('sorry', 'blinked'), { gain: 0.5 }], ['blip', V('sorry', 'twice'), { gain: 0.5 }]] },
        trapdoor: { set: 'lair', cam: 'wide', props: (S, t) => hole(S, H.clamp((t - V('trapdoor', 'meeting')) * 4)),
          cast: [...council({ mouth: 'grin' }), greg((t) => ({ eyes: 'wide', mouth: 'open', bob: -Math.max(0, t - V('trapdoor', 'over')) * 8, hide: t > V('trapdoor', 'over') + 0.25 }))],
          tags: [[0, 2.45, -0.4, 'MEETING OVER', V('trapdoor', 'over'), 'red']], sfx: [['slap', V('trapdoor', 'meeting'), { gain: 0.5 }], ['whoosh', V('trapdoor', 'over'), { dur: 0.6, gain: 0.6 }]] },
        twist: { set: 'lair', cam: 'wide', cast: [...council({ mouth: 'grin' }), greg({ rot: 0, mouth: 'grin', hair: 'short', hairCol: [60, 50, 40], tie: [200, 60, 60] })],
          tags: [[0, 2.45, -0.4, 'NEW GREG', V('twist', 'replacement'), 'green'], [0, 0.35, 1.0, 'ALSO GREG', V('twist', 'also'), 'yellow']] },
        cta: { set: 'lair', cam: 'mid', cast: [['illuminati', 0, -0.3, 0, { arms: [0.15, 1.6], mouth: 'grin', hold: 'briefcase' }]], tags: [[0, 0.35, 0.8, 'DENTAL: GREAT', V('cta', 'dental'), 'green']] },
      };
    },
  });
