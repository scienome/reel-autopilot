  // ==================== 0022 "Search history." ====================
  const PTY = { set: 'party' };
  const search = (q) => (c, w, h) => { c.fillStyle = '#f4f2f7'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(w * 0.08, h * 0.1, w * 0.84, h * 0.12); c.strokeStyle = '#3d8bf2'; c.lineWidth = 3; c.strokeRect(w * 0.08, h * 0.1, w * 0.84, h * 0.12); c.fillStyle = '#1c1a22'; c.font = FONT(800, h * 0.05); c.textAlign = 'left'; q.split('|').forEach((l, i) => c.fillText(l, w * 0.12, h * (0.18 + i * 0.12) + (i ? h * 0.08 : 0))); };
  const CROWD = [{ who: 'bff', x: -1.6, z: 0.4, yaw: 0.6, face: { mouth: 'open', eyes: 'happy' }, arms: 'cheer' }, { who: 'bro', x: 1.6, z: 0.4, yaw: -0.6, face: { mouth: 'open', eyes: 'happy' }, arms: 'cheer' }];
  makeCouch({
    keys: ['party', 'search', 'history', 'busy', 'laughing', 'fake', 'turn', 'ring', 'noticing', 'silence', 'game'],
    shots: ({ V }) => ({
      hook: { ...PTY, cam: 'wide', he: { outfit: 'party', arms: 'clasp', face: { mouth: 'smile' } }, she: { outfit: 'dress', arms: 'phone', face: { mouth: 'smile', lids: 0.4, brows: -0.5 } }, sheHold: true, extras: CROWD,
        fx: [{ k: 'card', text: 'GAME: READ THEIR SEARCHES', at: V('hook', 'Read'), y: 990, fill: '#2a1a3a', px: 34 }] },
      first: { ...PTY, cam: 'her', she: { outfit: 'dress', arms: 'phone', face: { mouth: 'open', lids: 0.4 } }, sheHold: () => search('how to look busy|when your girlfriend|talks'), fx: [{ k: 'smug', who: 'she', at: V('first', 'busy') }] },
      laugh: { ...PTY, cam: [[0, 1.95, 3.4], [0, 1.4, 0.2], [0, 1.95, 3.1], [0, 1.42, 0.2]], he: { outfit: 'party', arms: 'head', face: { mouth: 'open', eyes: 'wide', blush: 0.7 } }, she: { outfit: 'dress', arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }, extras: CROWD,
        fx: [{ k: 'stamp', text: 'HAHAHA', x: 360, y: 1000, at: V('laugh', 'laughing'), col: '#ffd23f' }] },
      more: { ...PTY, cam: 'her', she: { outfit: 'dress', arms: 'phone', face: { mouth: 'open', eyes: 'happy' } }, sheHold: () => search('is it rude to fake|a phone call'), fx: [{ k: 'q', text: '!', who: 'he', at: V('more', 'fake') }] },
      his: { ...PTY, cam: 'him', he: { outfit: 'party', arms: 'phone', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, heHold: true, fx: [{ k: 'smug', who: 'he', at: V('his', 'takes') }] },
      twist: { ...PTY, cam: 'him', he: { outfit: 'party', arms: 'phone', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } }, heHold: () => search('how to return a ring|without him noticing'), twist: V('twist', 'without'),
        fx: [{ k: 'card', text: 'HOW TO RETURN A RING', at: V('twist', 'How'), y: 990, fill: '#5a1020' }] },
      room: { ...PTY, cam: [[0, 1.95, 3.4], [0, 1.4, 0.2], [0, 1.95, 3.1], [0, 1.42, 0.2]], he: { outfit: 'party', arms: 'phone', face: { eyes: 'wide', mouth: 'flat' } }, heHold: true, she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'flat', eyes: 'wide' } },
        extras: CROWD.map((c) => ({ ...c, arms: 'clasp', face: { mouth: 'o', eyes: 'wide' } })), fx: [{ k: 'zzz', x: 360, y: 640, at: V('room', 'Silence') }] },
      close: { ...PTY, cam: 'her', she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'smile', lids: 0.5, brows: -0.5 } }, fx: [{ k: 'sweat', who: 'she', at: V('close', 'game') }, { k: 'bubble', text: "It's a game, babe.", who: 'she', at: V('close', 'game'), side: 1 }] },
    }),
  });
