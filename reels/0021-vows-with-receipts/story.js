  // ==================== 0021 "Vows with receipts." ====================
  const W8 = { set: 'wedding' };
  const scroll = (len) => (S, t, u, he, she) => { if (!she) return; const h = she.hands[1].p; S.rbox((p) => add(p, [h[0], h[1] - len / 2, h[2] + 0.06]), 0.11, len / 2, 0.004, [252, 250, 240], { bevel: 0.1, paint: (c, w, hh) => { c.fillStyle = 'rgba(30,30,40,0.5)'; for (let i = 0; i < 60; i++) c.fillRect(w * 0.12, (i * hh) / 60 + 3, w * (0.4 + (i % 3) * 0.15), 2); } }); };
  const folder = (S, t, u, he) => { if (!he) return; const m = midHands(he); S.rbox((p) => add(p, [m[0], m[1] + 0.05, m[2] + 0.05]), 0.14, 0.18, 0.06, [200, 60, 50], { bevel: 0.2 }); };
  const GUESTS = [{ who: 'mil', x: -1.7, z: 0.9, sit: false, yaw: 0.5, arms: 'phone', face: { eyes: 'wide', mouth: 'o' } }, { who: 'bff', x: 1.7, z: 0.9, sit: false, yaw: -0.5, arms: 'phone', face: { mouth: 'smile', lids: 0.3 } }];
  makeCouch({
    keys: ['wedding', 'vows', 'love', 'march', 'birthday', 'list', 'floor', 'notes', 'ditto', 'folder', 'thicker', 'receipts'],
    shots: ({ V }) => ({
      hook: { ...W8, cam: 'wide', he: { outfit: 'wedding', arms: 'clasp', face: { mouth: 'smile', eyes: 'happy' } }, she: { outfit: 'bride', arms: 'hold', face: { mouth: 'smile', lids: 0.3 } }, fx: [{ k: 'hearts', at: V('hook', 'Wedding'), n: 4, y: 560 }] },
      love: { ...W8, cam: 'her', she: { outfit: 'bride', arms: 'hold', face: { mouth: 'smile', lids: 0.4 } }, fx: [{ k: 'heart', who: 'she', at: V('love', 'love') }, { k: 'q', text: '...', who: 'she', at: V('love', 'even') }] },
      receipts: { ...W8, cam: 'her', she: { outfit: 'bride', arms: 'hold', face: { mouth: 'open', lids: 0.5, brows: -0.7 } }, props: scroll(0.3), fx: [{ k: 'card', text: 'MARCH 3: FORGOT', at: V('receipts', 'March'), y: 1000, fill: '#5a1020' }] },
      more: { ...W8, cam: 'wide', he: { outfit: 'wedding', arms: 'clasp', face: { eyes: 'wide', mouth: 'o', brows: 0.8 } }, she: { outfit: 'bride', arms: 'hold', face: { mouth: 'flat', lids: 0.5 } }, props: (S, t, u, he, she) => scroll(0.3 + 0.75 * u)(S, t, u, he, she),
        fx: [{ k: 'sweat', who: 'he', at: V('more', 'floor') }] },
      guests: { ...W8, cam: [[0, 1.9, 3.6], [0, 1.3, 0.6], [0, 1.9, 3.3], [0, 1.32, 0.6]], he: { outfit: 'wedding', arms: 'clasp' }, she: { outfit: 'bride', arms: 'hold' }, extras: GUESTS,
        fx: [{ k: 'stamp', text: 'TAKING NOTES', x: 360, y: 1000, at: V('guests', 'notes'), col: '#ffd23f' }] },
      him: { ...W8, cam: 'him', he: { outfit: 'wedding', arms: 'clasp', face: { mouth: 'smile', lids: 0.4 } }, fx: [{ k: 'bubble', text: 'Ditto.', who: 'he', at: V('him', 'Ditto'), side: -1 }] },
      twist: { ...W8, cam: 'him', he: { outfit: 'wedding', arms: 'hold', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, props: folder, twist: V('twist', 'Thicker'),
        fx: [{ k: 'stamp', text: 'THICKER', x: 360, y: 1010, at: V('twist', 'Thicker'), col: '#ff4a4a', rot: -0.1 }] },
      close: { ...W8, cam: 'wide', he: { outfit: 'wedding', arms: 'hold', face: { mouth: 'smile', lids: 0.5 } }, she: { outfit: 'bride', arms: 'hold', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, props: (S, t, u, he, she) => { folder(S, t, u, he); scroll(1.0)(S, t, u, he, she); },
        fx: [{ k: 'card', text: 'TILL RECEIPTS DO US PART', at: V('close', 'Till'), y: 1000, fill: '#2a1a3a', px: 36 }] },
    }),
  });
