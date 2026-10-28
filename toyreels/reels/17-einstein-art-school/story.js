  // ==================== History gone wrong: Einstein's time machine ====================
  makeComedy({
    badge: 'HISTORY GONE WRONG', badgeCol: '#2a4a9a',
    captions: { say: { 'nineteen oh seven': '1907' }, keys: { einstein: 'y', time: 'o', machine: 'o', art: 'g', school: 'g', rejected: 'r', accepted: 'g', saved: 'g', flowers: 'y', fade: 'r', never: 'r', existed: 'r' } },
    beats: ({ V }) => {
      const young = { hat: null, mustache: null, hair: 'side', shirt: [110, 90, 70], pants: [60, 52, 44], eyes: 'open', mouth: 'flat' };
      const machine = (S, x, z, glow) => { S.box((p) => add(p, [x, 0.9, z]), 0.45, 0.9, 0.45, [170, 176, 190], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = glow ? '#7fe0ff' : '#3a4a5a'; c.fillRect(w * 0.15, h * 0.15, w * 0.7, h * 0.5); c.fillStyle = '#ff3030'; c.fillRect(w * 0.4, h * 0.75, w * 0.2, h * 0.1); } }); };
      const flowers = (S, x, y, z) => plate(S, x, y, z, 0.32, 0.4, (c, w, h) => { c.fillStyle = '#f4f0e0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3a8a3a'; c.lineWidth = w * 0.04; c.beginPath(); c.moveTo(w * 0.5, h * 0.9); c.lineTo(w * 0.45, h * 0.4); c.stroke(); c.fillStyle = '#e04080'; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(w * 0.45 + Math.cos(i * 1.3) * w * 0.12, h * 0.35 + Math.sin(i * 1.3) * h * 0.08, w * 0.08, 0, TAU); c.fill(); } }, [120, 80, 50]);
      return {
        hook: { set: 'palace', opt: { throne: false }, cam: 'mid', shake: V('hook', 'job'),
          props: (S, t) => machine(S, 0.9, -0.6, t > V('hook', 'machine')),
          cast: [['einstein', -0.5, 0.2, 0.3, (t) => ({ arms: [0.15, t > V('hook', 'job') ? 2.4 : 0.6], mouth: 'grin', eyes: 'wide' })]],
          tags: [[0, 0.35, 0.6, 'MISSION: ART SCHOOL', V('hook', 'art'), 'green', 1.1]], sfx: [['powerup', V('hook', 'machine'), { gain: 0.5 }]] },
        vienna: { set: 'street', opt: { signs: ['KUNST', 'CAFÉ', 'ART SCHOOL', 'BÄCKER', 'HUTE', 'WURST'] }, cam: 'mid',
          props: (S) => flowers(S, 0.55, 1.05, 0.45),
          cast: [['hitler', 0, 0.2, 0, (t) => Object.assign({}, young, { mouth: t > V('vienna', 'rejected') ? 'frown' : 'smile', arms: [0.15, 1.0] })]],
          tags: [[0, 2.45, -0.4, '1907', V('vienna', 'nineteen'), 'yellow'], [0, 0.35, 0.6, 'REJECTED', V('vienna', 'rejected'), 'red']], sfx: [['stamp', V('vienna', 'rejected'), { gain: 0.6 }]] },
        bribe: { set: 'museum', opt: { wall: '#3a4a6a' }, cam: 'mid',
          cast: [['einstein', -0.7, 0.2, 0.5, { hold: 'bag', arms: [0.15, 1.2], mouth: 'evil' }], ['judge', 0.7, 0.0, -0.4, (t) => ({ hat: null, hair: 'thin', hairCol: [200, 200, 200], facePaint: null, mouth: t > V('bribe', 'accepted') ? 'grin' : 'flat', eyes: t > V('bribe', 'cash') ? 'wide' : 'open' })]],
          tags: [[0, 2.45, -0.4, 'ACCEPTED!', V('bribe', 'accepted'), 'green']], sfx: [['coin', V('bribe', 'cash'), { gain: 0.6 }], ['success', V('bribe', 'accepted'), { f: 'C6', gain: 0.5 }]] },
        saved: { set: 'museum', opt: { wall: '#7a5a8a' }, cam: 'mid',
          props: (S) => { flowers(S, -0.9, 1.6, -2.2); flowers(S, 0, 1.7, -2.2); flowers(S, 0.9, 1.6, -2.2); flowers(S, 0.55, 1.05, 0.45); },
          cast: [['hitler', 0, 0.2, 0, Object.assign({}, young, { mouth: 'grin', arms: [0.15, 1.3], hold: 'wand' })]],
          tags: [[-0.9, 2.45, -0.4, 'NO WAR ✓', V('saved', 'war'), 'green'], [0, 0.35, 0.6, 'VERY BAD FLOWERS', V('saved', 'flowers'), 'yellow']] },
        back: { set: 'palace', opt: { throne: false }, cam: 'mid',
          props: (S) => machine(S, 0.9, -0.6, true),
          cast: [['einstein', -0.3, 0.2, 0.2, (t) => ({ arms: [2.3, 2.3], mouth: t > V('back', 'fade') ? 'o' : 'grin', eyes: t > V('back', 'fade') ? 'wide' : 'open', s: t > V('back', 'fade') ? 0.9 * (0.75 + 0.25 * Math.sin(t * 30)) : 0.9 })]],
          tags: [[0, 0.35, 0.6, 'FADING...', V('back', 'fade'), 'orange']], sfx: [['glitch', V('back', 'fade'), { gain: 0.6 }]] },
        twist: { set: 'palace', opt: { throne: false }, cam: 'mid', flash: [V('twist', 'existed')],
          props: (S, t) => { if (t < V('twist', 'neither')) machine(S, 0.9, -0.6, false); },
          cast: [['einstein', -0.3, 0.2, 0.2, (t) => ({ hide: t > V('twist', 'existed'), eyes: 'wide', mouth: 'open', s: 0.9 * (0.6 + 0.3 * Math.sin(t * 40)) })]],
          tags: [[0, 2.45, -0.4, 'EINSTEIN NOT FOUND', V('twist', 'existed'), 'red', 1.1], [0.9, 0.35, 0.3, 'POOF', V('twist', 'neither'), 'dark']], sfx: [['erase', V('twist', 'existed'), { gain: 0.6 }]] },
        cta: { set: 'palace', opt: { throne: false }, cam: 'mid', props: (S, t) => bigButton(S, 0, 0, 0.3, 1.6, 0), tags: [[0, 2.3, -0.4, 'PRESS IT?', V('cta', 'press'), 'red']] },
      };
    },
  });
