  // ==================== 0028 "The no takeout pact." ====================
  const bag = (x, z, y = 0.3, col = [230, 90, 40]) => (S) => S.rbox((p) => add(p, [x, y, z]), 0.12, 0.15, 0.08, col, { bevel: 0.2 });
  const DEL = (o = {}) => ({ who: 'delivery', x: 0.0, z: 0.45, sit: false, arms: 'hold', face: { mouth: 'smile' }, ...o });
  makeCouch({
    keys: ['rule', 'takeout', 'saving', 'burger', 'closet', 'sushi', 'bathtub', 'doorbell', 'usual', 'both', 'first', 'zero'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: { arms: 'reach', face: { mouth: 'smile' } }, she: { arms: 'reach', face: { mouth: 'smile' } }, fx: [{ k: 'card', text: 'PACT: NO TAKEOUT', at: V('hook', 'No'), y: 990, fill: '#2a1a3a' }, { k: 'hearts', at: V('hook', 'saving'), n: 3, y: 600 }] },
      him: { set: 'street', cam: 'him', he: { arms: 'hold', face: { mouth: 'smile', lids: 0.5, brows: -0.5 } }, she: { hide: true }, extras: [DEL({ x: 0.2 })], props: bag(-0.45, -0.1, 1.0), fx: [{ k: 'stamp', text: 'DAY 1', x: 360, y: 1000, at: V('him', 'Day'), col: '#ffd23f' }] },
      hide: { set: 'bedroom', cam: 'him', he: { sit: false, arms: 'hold', face: { eyes: 'wide', mouth: 'o', look: [-0.6, 0] } }, she: { hide: true }, props: bag(-0.45, -0.1, 0.9), fx: [{ k: 'sweat', who: 'he', at: V('hide', 'Hides') }] },
      her: { cam: 'her', he: { hide: true }, she: { arms: 'hold', heldFood: true, face: { mouth: 'smile', lids: 0.5, brows: -0.5 } }, sheHold: 'food:sushi', fx: [{ k: 'stamp', text: 'DAY 2', x: 360, y: 1000, at: V('her', 'Day'), col: '#ffd23f' }, { k: 'card', text: 'HIDING SPOT: BATHTUB', at: V('her', 'bathtub'), y: 900, fill: '#1c1a2a', px: 34 }] },
      knock: { cam: 'wide', he: { arms: 'clasp', face: { mouth: 'o', eyes: 'wide', look: [0.6, 0] } }, she: { arms: 'clasp', face: { mouth: 'o', eyes: 'wide', look: [-0.6, 0] } }, flash: [V('knock', 'Doorbell')], fx: [{ k: 'q', text: '!', x: 360, y: 640, at: V('knock', 'Doorbell') }] },
      delivery: { set: 'street', cam: 'on', on: [0, 1.75, 0.45], he: { hide: true }, she: { hide: true }, extras: [DEL({ face: { mouth: 'smile', eyes: 'happy' } })], props: (S) => { bag(-0.2, 0.7, 1.0)(S); bag(0.2, 0.7, 1.0, [240, 60, 80])(S); },
        fx: [{ k: 'bubble', text: 'Your usual, both of you?', x: 360, y: 860, at: V('delivery', 'Your'), side: 1 }] },
      twist: { set: 'street', cam: 'wide', he: { arms: 'head', face: { eyes: 'wide', mouth: 'open', brows: 0.8 } }, she: { arms: 'cheeks', face: { eyes: 'wide', mouth: 'o', blush: 0.6 } }, extras: [DEL({ x: 0, z: 0.6, arms: 'cheer', face: { mouth: 'smile', eyes: 'happy' } })], twist: V('twist', 'both'),
        fx: [{ k: 'stamp', text: 'BEST CUSTOMERS', x: 360, y: 1010, at: V('twist', 'both'), col: '#9aff6a', rot: -0.1 }] },
      close: { cam: 'two', he: { arms: 'hold', face: { mouth: 'smile', lids: 0.4 } }, she: { arms: 'hold', face: { mouth: 'smile', lids: 0.4 } }, heHold: 'food:burger', sheHold: 'food:sushi', fx: [{ k: 'card', text: 'SAVINGS: $0.00', at: V('close', 'zero'), y: 1000, fill: '#5a1020' }] },
    }),
  });
