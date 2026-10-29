  // ==================== History gone wrong: the delivery ====================
  makeComedy({
    badge: 'HISTORY GONE WRONG', badgeCol: '#2a4a9a',
    captions: { say: { 'three to five': '3-5', eighty: '80', 'three thousand': '3,000' }, keys: { hitler: 'r', secret: 'y', weapon: 'r', delivery: 'o', waited: 'y', bunker: 'o', days: 'y', weeks: 'o', eighty: 'r', arrived: 'g', selfie: 'y', stick: 'y', wrong: 'r', hell: 'r', queue: 'o', star: 'y', zero: 'r' } },
    beats: ({ V }) => {
      const HT = (ex) => ['hitler', 0, 0, 0, Object.assign({ mouth: 'flat' }, ex)];
      const box = (S, x, y, z, open = 0) => { S.box((p) => add(p, [x, y, z]), 0.3, 0.22, 0.25, [190, 150, 100], { bevel: 0.15, paint: (c, w, h) => { c.fillStyle = '#7a5a30'; c.fillRect(0, h * 0.45, w, h * 0.1); c.fillStyle = '#222'; c.font = FONT(900, h * 0.16); c.fillText('FRAGILE', w * 0.25, h * 0.3); } }); if (open) for (const s of [-1, 1]) S.box((p) => add(rotZ(p, s * open), [x + s * 0.3, y + 0.24, z]), 0.15, 0.01, 0.25, [190, 150, 100], { bevel: 0.1 }); };
      return {
        hook: { set: 'bunker', opt: { alarm: 0 }, cam: 'mid', cast: [HT({ hold: 'phone', arms: [0.15, 1.6], mouth: 'grin' })], tags: [[0, 2.5, -0.4, 'SUPER WEAPON', V('hook', 'weapon'), 'red', 1.1], [0, 0.35, 0.8, '3-5 DAYS', V('hook', 'delivery'), 'orange']] },
        wait: { set: 'bunker', opt: { alarm: 0 }, cam: 'wide', cast: [HT((t) => ({ eyes: t > V('wait', 'weeks') ? 'sleepy' : 'open', mouth: 'frown', arms: [0.15, 0.15], hair: t > V('wait', 'weeks') ? 'side' : 'side', hairCol: t > V('wait', 'weeks') ? [200, 200, 200] : [40, 30, 24] }))],
          tags: [[-1.0, 2.5, -0.4, 'DAY 1', V('wait', 'days'), 'yellow'], [1.0, 2.5, -0.4, 'WEEK 6', V('wait', 'weeks'), 'orange']] },
        track: { set: 'bunker', opt: { alarm: 0.3 }, cam: 'close', cast: [HT({ hold: 'phone', arms: [0.15, 1.8], eyes: 'sleepy', mouth: 'frown', hairCol: [220, 220, 220], mustache: 'toothbrush' })],
          tags: [[0, 0.6, 0.6, 'OUT FOR DELIVERY', V('track', 'delivery'), 'orange', 1.1], [0, 2.4, -0.4, '80 YEARS', V('track', 'eighty'), 'red']], sfx: [['blip', V('track', 'tracking'), { gain: 0.4 }]] },
        twist: { set: 'bunker', opt: { alarm: 0 }, cam: 'mid', props: (S, t) => box(S, 0.6, 0.22, 0.4, t > V('twist', 'selfie') - 0.3 ? 0.8 : 0),
          cast: [HT((t) => ({ x: -0.4, rot: 0.3, hold: t > V('twist', 'selfie') ? 'wand' : null, arms: [0.15, t > V('twist', 'selfie') ? 2.4 : 1.0], eyes: t > V('twist', 'selfie') ? 'wide' : 'open', mouth: t > V('twist', 'selfie') ? 'open' : 'grin', hairCol: [220, 220, 220] }))],
          tags: [[0.6, 1.2, 0.4, 'ARRIVED', V('twist', 'arrived'), 'green'], [0, 0.35, 1.0, 'SELFIE STICK', V('twist', 'selfie'), 'yellow']], flash: [V('twist', 'selfie')] },
        punch: { set: 'hell', cam: 'wide', props: (S) => box(S, 0.5, 0.22, 0.5, 0),
          cast: [HT({ x: 0.5, z: 0.1, rot: 0, mouth: 'frown', brows: 'worried', hairCol: [220, 220, 220] }), ['stalin', -0.6, -0.4, 0.2, { mouth: 'grin' }], ['napoleon', -1.4, -0.8, 0.2, { mouth: 'frown' }], ['devil', 1.6, -0.8, -0.4, { mouth: 'grin', hold: 'pitchfork' }]],
          tags: [[0, 2.6, -0.6, 'RETURNS: HELL', V('punch', 'hell'), 'red', 1.1], [0, 0.35, 1.1, 'QUEUE: 3,000 YEARS', V('punch', 'queue'), 'orange', 1.2]] },
        cta: { set: 'bunker', opt: { alarm: 0 }, cam: 'mid', cast: [HT({ hold: 'wand', arms: [0.15, 2.2], mouth: 'frown', hairCol: [220, 220, 220] })], tags: [[0, 0.35, 0.8, '★ OR 0?', V('cta', 'star'), 'yellow']] },
      };
    },
  });
