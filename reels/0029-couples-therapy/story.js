  // ==================== 0029 "Couples therapy." ====================
  const DOC = (o = {}) => ({ who: 'boss', x: 1.55, z: 0.15, sit: true, yaw: -0.9, arms: 'hold', face: { mouth: 'flat', lids: 0.3 }, ...o });
  const clock = (S) => S.cyl((p) => add(rotX(p, Math.PI / 2), [-1.6, 1.9, -1.2]), 0.18, 0.03, [250, 250, 248], 20);
  makeCouch({
    keys: ['therapy', 'first', 'love', 'silence', 'clock', 'hard', 'nothing', 'ideas', 'dog', 'same', 'week'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: { arms: 'clasp', face: { mouth: 'flat' } }, she: { arms: 'clasp', yaw: -0.5, face: { mouth: 'flat', lids: 0.5 } }, extras: [DOC()], props: clock, fx: [{ k: 'card', text: 'SESSION 1', at: V('hook', 'First'), y: 990, fill: '#2a1a3a' }] },
      ask: { cam: [[0.7, 1.45, 1.5], [1.55, 1.2, 0.15], [0.8, 1.45, 1.3], [1.55, 1.22, 0.15]], he: { hide: true }, she: { hide: true }, extras: [DOC({ face: { mouth: 'smile', lids: 0.2 } })], fx: [{ k: 'bubble', text: 'One thing you love?', x: 360, y: 860, at: V('ask', 'Name'), side: 1 }] },
      silence: { cam: 'two', he: { arms: 'clasp', face: { mouth: 'flat', eyes: 'wide' } }, she: { arms: 'clasp', face: { mouth: 'flat', eyes: 'wide' } }, props: clock, fx: [{ k: 'zzz', x: 360, y: 640, at: V('silence', 'Silence') }, { k: 'q', text: 'tick', x: 200, y: 520, at: V('silence', 'ticks') }] },
      him: { cam: 'him', he: { arms: 'head', face: { eyes: 'closed', mouth: 'frown', brows: 0.7 } }, fx: [{ k: 'sweat', who: 'he', at: V('him', 'hard') }, { k: 'ring', who: 'he', at: V('him', 'Nothing') }] },
      her: { cam: 'her', she: { arms: 'phone', face: { mouth: 'flat', lids: 0.4 } }, sheHold: true, fx: [{ k: 'card', text: 'SEARCH: THINGS TO LOVE', at: V('her', 'ideas'), y: 980, fill: '#1c1a2a', px: 34 }] },
      twist: { cam: 'two', he: { arms: 'reach', face: { eyes: 'happy', mouth: 'open' } }, she: { arms: 'reach', face: { eyes: 'happy', mouth: 'open' } }, pets: [{ kind: 'dog', x: 0, z: 0.6, yaw: 1.5 }], twist: V('twist', 'dog'),
        fx: [{ k: 'stamp', text: 'THE DOG', x: 360, y: 1010, at: V('twist', 'dog'), col: '#ffd23f', rot: -0.1 }, { k: 'hearts', at: V('twist', 'dog'), n: 4, y: 600 }] },
      therapist: { cam: [[0.7, 1.45, 1.5], [1.55, 1.2, 0.15], [0.8, 1.45, 1.3], [1.55, 1.22, 0.15]], he: { hide: true }, she: { hide: true }, extras: [DOC({ face: { mouth: 'smile', eyes: 'happy' } })], pets: [{ kind: 'dog', x: 1.2, z: 0.55, yaw: -1.0 }], fx: [{ k: 'bubble', text: 'Same.', x: 360, y: 860, at: V('therapist', 'Same'), side: 1 }] },
      close: { cam: 'wide', he: { arms: 'slump', face: { mouth: 'flat', lids: 0.5 } }, she: { arms: 'slump', face: { mouth: 'flat', lids: 0.5 } }, extras: [DOC({ arms: 'hold' })], pets: [{ kind: 'dog', x: 0, z: 0.55, yaw: 0.3 }],
        fx: [{ k: 'card', text: 'BILL: $250 (DOG: FREE)', at: V('close', 'week'), y: 1000, fill: '#5a1020' }] },
    }),
  });
