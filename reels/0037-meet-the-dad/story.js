  // ==================== 0037 "Meet the dad." ====================
  const REST = { set: 'restaurant' };
  const DAD = (o = {}) => ({ who: 'dad', x: 0, z: 0.75, sit: true, yaw: Math.PI, arms: 'clasp', face: { mouth: 'flat', lids: 0.4, brows: -0.9 }, ...o });
  const badge = (S) => { S.rbox((p) => add(p, [0, 0.77, 0.3]), 0.08, 0.005, 0.06, [60, 60, 70], { bevel: 0.2 }); S.ball([0, 0.78, 0.31], [0.035, 0.008, 0.035], [240, 200, 60], { gloss: 0.8 }); };
  const DADCAM = [[0.2, 1.6, -0.95], [0, 1.4, 0.75], [0.16, 1.58, -0.75], [0, 1.42, 0.75]];
  makeCouch({
    keys: ['dad', 'dinner', 'blink', 'friday', 'nine', 'sweats', 'gaming', 'badge', 'everything', 'mall', 'cop', 'still'],
    shots: ({ V }) => ({
      hook: { ...REST, cam: 'wide', he: { outfit: 'suit', arms: 'clasp', face: { mouth: 'smile', brows: 0.5 } }, she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'smile' } }, extras: [DAD()], fx: [{ k: 'card', text: 'FIRST DINNER WITH HER DAD', at: V('hook', 'Meeting'), y: 990, fill: '#2a1a3a', px: 36 }] },
      stare: { ...REST, cam: DADCAM, he: { hide: true }, she: { hide: true }, extras: [DAD({ yaw: Math.PI + 0.2 })], fx: [{ k: 'stamp', text: '0 BLINKS', x: 360, y: 1000, at: V('stare', 'blink'), col: '#ff4a4a' }] },
      ask: { ...REST, cam: DADCAM, he: { hide: true }, she: { hide: true }, extras: [DAD({ arms: 'reach', face: { mouth: 'open', lids: 0.5, brows: -0.9 } })], fx: [{ k: 'bubble', text: 'Friday. 9pm. Where?', x: 360, y: 840, at: V('ask', 'Where'), side: 1 }] },
      sweat: { ...REST, cam: 'him', he: { outfit: 'suit', arms: 'clasp', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } }, fx: [{ k: 'sweat', who: 'he', at: V('sweat', 'sweats') }, { k: 'bubble', text: 'Gaming! With friends!', x: 330, y: 820, at: V('sweat', 'Gaming'), side: -1 }] },
      badge: { ...REST, cam: [[0.3, 1.5, -0.7], [0, 0.78, 0.3], [0.25, 1.4, -0.5], [0, 0.8, 0.3]], he: { hide: true }, she: { hide: true }, props: badge, flash: [V('badge', 'badge')], fx: [{ k: 'stamp', text: 'BADGE', x: 360, y: 1000, at: V('badge', 'badge'), col: '#ffd23f' }] },
      panic: { ...REST, cam: 'him', he: { outfit: 'suit', arms: 'head', face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, fx: [{ k: 'card', text: 'CONFESSED: 11 THINGS', at: V('panic', 'everything'), y: 1000, fill: '#5a1020' }, { k: 'sweat', who: 'he', at: V('panic', 'confesses') }] },
      twist: { ...REST, cam: 'her', she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'smile', lids: 0.5, brows: -0.5 } }, twist: V('twist', 'mall'), fx: [{ k: 'stamp', text: 'MALL COP', x: 360, y: 1010, at: V('twist', 'mall'), col: '#ffd23f', rot: -0.1 }] },
      close: { ...REST, cam: DADCAM, he: { hide: true }, she: { hide: true }, extras: [DAD({ face: { mouth: 'smile', lids: 0.5, brows: -0.6 } })], fx: [{ k: 'bubble', text: 'Still a cop.', x: 360, y: 840, at: V('close', 'Still'), side: 1 }] },
    }),
  });
