  // ==================== 0039 "Crop her out." ====================
  const insta = (who, likes, crop) => (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#7ac8f0'; c.fillRect(w * 0.06, h * 0.12, w * 0.88, h * 0.5); c.fillStyle = '#f2d28a'; c.fillRect(w * 0.06, h * 0.48, w * 0.88, h * 0.14);
    c.fillStyle = who === 'him' ? '#e0a830' : '#c83a50'; c.beginPath(); c.arc(w * (crop ? 0.5 : 0.4), h * 0.36, w * 0.12, 0, TAU); c.fill(); if (!crop && who === 'him') { c.fillStyle = '#c83a50'; c.fillRect(w * 0.82, h * 0.25, w * 0.12, h * 0.25); }
    c.fillStyle = '#1c1a22'; c.font = FONT(800, h * 0.05); c.textAlign = 'left'; c.fillText('♥ ' + likes, w * 0.08, h * 0.72); };
  const pane = (S) => { S.rbox((p) => add(p, [0, 1.3, -1.1]), 0.5, 0.35, 0.05, [200, 200, 210], { bevel: 0.3, bg: true }); };
  makeCouch({
    keys: ['vacation', 'photos', 'ten', 'cropped', 'nothing', 'morning', 'asleep', 'plane', 'mouth', 'fifty', 'boss', 'mom', 'crop'],
    shots: ({ V }) => ({
      hook: { cam: 'him', he: { arms: 'phone', face: { mouth: 'smile', eyes: 'happy' } }, heHold: () => insta('him', 12, true), she: { hide: true }, fx: [{ k: 'card', text: 'VACATION DUMP: 10 PHOTOS', at: V('hook', 'ten'), y: 990, fill: '#2a1a3a', px: 36 }] },
      crop: { cam: 'her', he: { hide: true }, she: { arms: 'phone', face: { mouth: 'flat', lids: 0.6, brows: -0.9 } }, sheHold: () => insta('him', 12, false), nope: V('crop', 'Cropped'), fx: [{ k: 'stamp', text: '0 OF 10', x: 360, y: 1000, at: V('crop', 'none'), col: '#ff4a4a' }] },
      her: { cam: 'her', he: { hide: true }, she: { arms: 'clasp', face: { mouth: 'smile', lids: 0.6, brows: -0.7 } }, fx: [{ k: 'smug', who: 'she', at: V('her', 'nothing') }] },
      post: { cam: 'her', he: { hide: true }, she: { arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, sheHold: true, fx: [{ k: 'card', text: 'NEXT MORNING: 1 POST', at: V('post', 'morning'), y: 990, fill: '#1c1a2a', px: 36 }] },
      photo: { set: 'car', cam: 'him', he: { arms: 'slump', head: { tilt: 0.4 }, face: { eyes: 'closed', mouth: 'yawn' } }, she: { hide: true }, props: pane, fx: [{ k: 'zzz', who: 'he', at: V('photo', 'Asleep') }, { k: 'stamp', text: 'MOUTH OPEN', x: 360, y: 1000, at: V('photo', 'Mouth'), col: '#ffd23f' }] },
      viral: { cam: 'him', he: { arms: 'phone', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } }, heHold: true, she: { hide: true }, fx: [{ k: 'buzz', who: 'he', at: V('viral', 'Fifty') }, { k: 'card', text: '50K LIKES · BOSS SHARED', at: V('viral', 'boss'), y: 1000, fill: '#c0182a', col: '#fff', px: 34 }] },
      twist: { cam: 'him', he: { arms: 'head', face: { eyes: 'closed', mouth: 'frown', brows: 0.9 } }, she: { hide: true }, twist: V('twist', 'good'), fx: [{ k: 'bubble', text: 'MOM: finally a good one', x: 360, y: 840, at: V('twist', 'Finally'), side: 1 }] },
      close: { cam: 'two', he: { arms: 'slump', face: { mouth: 'frown' } }, she: { arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, sheHold: true, fx: [{ k: 'smug', who: 'she', at: V('close', 'Crop') }] },
    }),
  });
