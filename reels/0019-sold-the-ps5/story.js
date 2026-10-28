  // ==================== 0019 "Sold the PS5." ====================
  const console5 = (x, z = 0.25, y = 0.47) => (S) => { S.rbox((p) => add(p, [x, y + 0.06, z]), 0.08, 0.13, 0.17, [244, 244, 248], { bevel: 0.4 }); S.rbox((p) => add(p, [x, y + 0.06, z]), 0.025, 0.13, 0.17, [30, 30, 36], { bevel: 0.3 }); };
  const ticket = (c, w, h) => { c.fillStyle = '#f6f2ea'; c.fillRect(0, 0, w, h); c.fillStyle = '#3d8bf2'; c.fillRect(0, 0, w, h * 0.22); c.fillStyle = '#1c1a22'; c.font = FONT(900, h * 0.12); c.textAlign = 'center'; c.fillText('BALI', w / 2, h * 0.5); c.fillText('x2', w / 2, h * 0.72); };
  makeCouch({
    keys: ['holiday', 'forgot', 'months', 'ps5', 'bali', 'console', 'beach', 'best', 'friend', 'half'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: { arms: 'phone', face: { mouth: 'smile', lids: 0.3 } }, heHold: true, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.4, brows: -0.5 } }, props: console5(0.05),
        fx: [{ k: 'card', text: '"I PROMISE: HOLIDAY"', at: V('hook', 'promised'), y: 990, fill: '#2a1a3a' }, { k: 'q', who: 'he', at: V('hook', 'forgot') }] },
      forgot: { cam: 'her', she: { arms: 'clasp', face: { lids: 0.6, mouth: 'flat', brows: -0.8 } }, fx: [{ k: 'stamp', text: '0 BOOKINGS', x: 360, y: 1000, at: V('forgot', 'Not'), col: '#ff4a4a' }] },
      ps5: { cam: 'on', on: [0.05, 0.55, 0.25], props: console5(0.05), fx: [{ k: 'card', text: 'SOLD', at: V('ps5', 'sells'), y: 980, fill: '#c0182a', col: '#ffffff' }] },
      tickets: { set: 'mall', opt: { signs: ['FLIGHTS', 'SALE', 'BALI'] }, cam: 'her', he: { hide: true }, she: { outfit: 'dress', arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } },
        fx: [{ k: 'card', text: 'BALI x2 \u2708', at: V('tickets', 'Two'), y: 920, fill: '#3d8bf2', col: '#ffffff' }, { k: 'stamp', text: 'PAID IN FULL', x: 360, y: 1000, at: V('tickets', 'Paid'), col: '#9aff6a' }] },
      home: { cam: 'wide', he: { sit: false, x: 0, z: 0.4, arms: 'shrug', face: { eyes: 'wide', mouth: 'open', brows: 0.8 } }, she: { arms: 'clasp', face: { mouth: 'smile', lids: 0.5 } },
        fx: [{ k: 'bubble', text: "Where's my console?", x: 300, y: 820, at: V('home', "Where's"), side: -1 }] },
      she: { cam: 'her', she: { arms: 'hold', face: { mouth: 'smile', lids: 0.5, brows: -0.4 } }, sheHold: () => ticket, fx: [{ k: 'smug', who: 'she', at: V('she', 'love') }] },
      twist: { cam: 'him', he: { arms: 'phone', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } }, heHold: () => (c, w, h) => { c.fillStyle = '#1a1c3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f4f2f7'; c.fillRect(w * 0.15, h * 0.2, w * 0.7, h * 0.4); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w * 0.5, h * 0.36, w * 0.12, 0, TAU); c.fill(); c.fillStyle = '#1c1a22'; c.fillRect(w * 0.3, h * 0.66, w * 0.4, h * 0.05); },
        twist: V('twist', 'Playing'), fx: [{ k: 'buzz', who: 'he', at: V('twist', 'buzzes') }, { k: 'card', text: 'BRO: "THANKS FOR THE PS5"', at: V('twist', 'selfie'), y: 1000, fill: '#1c1a2a', px: 34 }] },
      close: { cam: 'wide', he: { arms: 'head', face: { eyes: 'closed', mouth: 'frown', brows: 0.8 } }, she: { arms: 'hold', face: { mouth: 'smile', lids: 0.5 } }, sheHold: () => ticket,
        extras: [{ who: 'bro', x: 1.7, z: 0.1, sit: false, yaw: -0.6, arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }], fx: [{ k: 'stamp', text: '-50%', x: 360, y: 1000, at: V('close', 'half'), col: '#ffd23f' }] },
    }),
  });
