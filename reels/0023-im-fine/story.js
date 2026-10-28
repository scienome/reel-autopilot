  // ==================== 0023 "I'm fine." ====================
  const notes = (n) => (S) => { for (let i = 0; i < n; i++) S.rbox((p) => add(p, [1.95 + (i % 3) * 0.12 - 0.12, 1.2 + Math.floor(i / 3) * 0.14, -0.53]), 0.05, 0.05, 0.004, [255, 230, 90], { bevel: 0.1, paint: (c, w, h) => { c.fillStyle = '#1c1a22'; c.font = FONT(900, h * 0.3); c.textAlign = 'center'; c.fillText('FINE', w / 2, h * 0.6); } }); };
  const pillows = (S) => { for (let i = 0; i < 5; i++) S.ball([0, 0.55, -0.95 + i * 0.22], [0.1, 0.09, 0.1], [250, 248, 240]); };
  const LAW = (x, o = {}) => ({ who: 'boss', x, z: -0.95, sit: false, yaw: x > 0 ? -0.4 : 0.4, arms: 'hold', ...o });
  makeCouch({
    keys: ['okay', 'fine', 'still', 'sticky', 'pillows', 'lawyer', 'case', 'pizza', 'dog', 'bed'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: { arms: 'reach', face: { mouth: 'smile', brows: 0.4 } }, she: { arms: 'clasp', yaw: -0.6, face: { mouth: 'flat', lids: 0.5, brows: -0.8 } }, fx: [{ k: 'bubble', text: "I'm fine.", who: 'she', at: V('hook', 'fine'), side: 1 }] },
      cold: { cam: 'her', she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.7, brows: -0.9 } }, fx: [{ k: 'stamp', text: 'DAY 2', x: 360, y: 1000, at: V('cold', 'Day'), col: '#7ad0ff' }] },
      notes: { set: 'kitchen', cam: 'on', on: [1.95, 1.3, -0.5], he: { hide: true }, she: { hide: true }, props: (S, t, u) => notes(1 + Math.floor(8 * u))(S), fx: [{ k: 'card', text: 'FINE. FINE. FINE.', at: V('notes', 'Fine'), y: 1000, fill: '#1c1a2a' }] },
      bed: { set: 'bedroom', cam: [[0, 1.9, 2.4], [0, 0.6, -0.5], [0, 1.85, 2.1], [0, 0.62, -0.5]], he: { outfit: 'pajamas', sit: true, x: -0.6, z: -0.6, arms: 'slump', face: { mouth: 'frown' } }, she: { outfit: 'pajamas', sit: true, x: 0.6, z: -0.6, arms: 'clasp', yaw: -0.3, face: { mouth: 'flat', lids: 0.6 } }, props: pillows,
        fx: [{ k: 'stamp', text: 'THE WALL', x: 360, y: 1010, at: V('bed', 'pillows'), col: '#ff4a4a' }] },
      lawyer: { cam: 'wide', he: { arms: 'shrug', face: { mouth: 'o', eyes: 'wide' } }, she: { arms: 'clasp', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, extras: [LAW(1.05)], fx: [{ k: 'card', text: 'DAY 5: LAWYERED UP', at: V('lawyer', 'hires'), y: 990, fill: '#2a1a3a' }] },
      his: { cam: 'wide', he: { arms: 'clasp', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, she: { arms: 'clasp', face: { mouth: 'o', eyes: 'wide' } }, extras: [LAW(1.05), LAW(-1.05, { hair: [40, 40, 44] })], fx: [{ k: 'stamp', text: '2 VS 2', x: 360, y: 1000, at: V('his', 'So'), col: '#f47aa6' }] },
      twist: { cam: [[0, 1.85, 3.2], [0, 1.4, 0.3], [0, 1.85, 2.9], [0, 1.42, 0.3]], he: { hide: true }, she: { hide: true }, extras: [LAW(-0.45, { z: 0.3, yaw: 0.2, arms: 'phone', face: { eyes: 'wide', mouth: 'o' } }), LAW(0.45, { z: 0.3, yaw: -0.2, arms: 'head', face: { eyes: 'closed', mouth: 'open' } })],
        twist: V('twist', 'pizza'), fx: [{ k: 'card', text: 'CASE: THE LAST SLICE', at: V('twist', 'about'), y: 1000, fill: '#5a1020' }] },
      close: { set: 'bedroom', cam: [[0, 1.9, 2.4], [0, 0.6, -0.5], [0, 1.85, 2.1], [0, 0.62, -0.5]], he: { outfit: 'pajamas', sit: false, x: -1.4, z: 0.2, arms: 'head', face: { mouth: 'frown', brows: 0.7 } }, she: { outfit: 'pajamas', sit: false, x: 1.4, z: 0.2, arms: 'clasp', face: { mouth: 'flat', lids: 0.6 } },
        pets: [{ kind: 'dog', x: 0, z: -0.55, yaw: 0.3 }], props: (S) => S.ball([0.35, 0.5, -0.55], [0.11, 0.09, 0.11], [250, 248, 240]), fx: [{ k: 'stamp', text: 'WINNER', x: 360, y: 1010, at: V('close', 'dog'), col: '#9aff6a' }] },
    }),
  });
