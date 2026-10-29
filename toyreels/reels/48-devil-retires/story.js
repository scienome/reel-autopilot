  // ==================== The higher powers: grandma's hell ====================
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#c8282e',
    captions: { say: { eight: '8' }, keys: { devil: 'r', retired: 'y', hell: 'r', grandma: 'y', rules: 'o', shouting: 'r', shoes: 'o', jumper: 'y', soup: 'o', hitler: 'r', tidy: 'g', forever: 'r', bed: 'b', eight: 'y', scarier: 'r' } },
    beats: ({ V }) => {
      const GM = (ex) => ['devil', 0.6, 0.0, -0.3, Object.assign({ hair: 'bun', hairCol: [220, 220, 228], mouth: 'smile', robe: [180, 60, 90], shirt: [180, 60, 90], hold: 'wand', brows: 'raised' }, ex)];
      const DV = (ex) => ['devil', -0.6, 0.2, 0.3, ex];
      const jumper = [200, 120, 60], soupBowl = (S, x, z) => { S.cyl((p) => add(p, [x, 0.9, z]), 0.1, 0.05, [240, 240, 236], 12); S.cyl((p) => add(p, [x, 0.95, z]), 0.08, 0.005, [220, 140, 60], 12); };
      return {
        hook: { set: 'hell', cam: 'wide', cast: [DV((t) => ({ hold: 'briefcase', mouth: 'grin', shades: true, x: H.lerp(-0.6, -2.4, H.clamp((t - V('hook', 'retired')) / 1.4)), walk: t * 6, rot: 1.2 })), GM({ arms: [0.15, 1.6] })],
          tags: [[-0.6, 2.5, -0.3, 'RETIRED', V('hook', 'retired'), 'yellow'], [0.6, 0.35, 0.8, 'GRANDMA', V('hook', 'grandma'), 'orange']] },
        rules: { set: 'hell', cam: 'mid', props: (S) => plate(S, -0.8, 1.6, -1.0, 0.8, 0.9, (c, w, h) => { c.fillStyle = '#fff6e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#7a2a3a'; c.font = FONT(900, h * 0.1); c.fillText('HOUSE RULES', w * 0.12, h * 0.15); c.font = FONT(700, h * 0.08); ['1. NO SHOUTING', '2. SHOES OFF', '3. SAY PLEASE', '4. NO FIRE INDOORS'].forEach((l, i) => c.fillText(l, w * 0.08, h * (0.32 + i * 0.16))); }),
          cast: [GM({ x: 0.5, arms: [0.15, 2.2], mouth: 'flat' })], tags: [[0.5, 2.5, -0.3, 'NO SHOUTING', V('rules', 'shouting'), 'red'], [0, 0.35, 0.8, 'SHOES OFF', V('rules', 'shoes'), 'orange']] },
        jumper: { set: 'hell', cam: 'wide', props: (S) => { soupBowl(S, -1.2, 0.5); soupBowl(S, 0, 0.6); soupBowl(S, 1.2, 0.5); },
          cast: [['dracula', -1.2, 0, 0.3, { shirt: jumper, mouth: 'frown', arms: [0.15, 1.2] }], ['zombie', 0, -0.2, 0, { shirt: [90, 140, 200], mouth: 'smile', arms: [0.15, 1.2] }], ['pirate', 1.2, 0, -0.3, { shirt: [120, 180, 90], mouth: 'frown', arms: [0.15, 1.2] }]],
          tags: [[0, 2.6, -0.6, 'JUMPERS', V('jumper', 'jumper'), 'yellow'], [0, 0.35, 1.0, 'SOUP', V('jumper', 'soup'), 'orange']] },
        hitler: { set: 'hell', opt: { throne: false }, cam: 'mid', props: (S, t) => { for (let i = 0; i < 9; i++) S.box((p) => add(rotY(p, i), [-1.4 + (i % 5) * 0.6, 0.05, 0.3 + Math.floor(i / 5) * 0.5]), 0.08, 0.05, 0.08, [[200, 60, 60], [60, 120, 200], [240, 200, 60]][i % 3], { bevel: 0.4 }); },
          cast: [['hitler', -0.3, 0.2, 0.3, (t) => ({ mouth: 'frown', brows: 'worried', sweat: true, arms: [0.6 + Math.sin(t * 8) * 0.3, 0.6], bob: -0.2 })], GM({ x: 0.9, arms: [0.15, 2.2], mouth: 'flat', eyes: 'angry' })],
          tags: [[-0.3, 2.3, -0.3, 'TIDY YOUR ROOM', V('hitler', 'tidy'), 'green', 1.1], [0, 0.35, 0.9, 'FOREVER', V('hitler', 'forever'), 'red']] },
        twist: { set: 'graveyard', cam: 'mid', cast: [DV({ hold: 'briefcase', mouth: 'grin', shades: true, x: -0.5 }), GM({ x: 0.6, mouth: 'flat', eyes: 'angry', arms: [0.15, 2.4] })],
          tags: [[-0.5, 2.5, -0.3, 'VISIT', V('twist', 'visit'), 'yellow'], [0, 0.35, 0.9, 'BED AT 8', V('twist', 'bed'), 'blue']] },
        punch: { set: 'hell', cam: 'close', cast: [GM({ x: 0, z: 0, rot: 0, mouth: 'smile', eyes: 'happy' })], tags: [[0, 0.5, 0.6, 'SCARIEST', V('punch', 'scarier'), 'red']] },
        cta: { set: 'stage', opt: { banner: 'DEVIL vs GRANDMA', audience: false }, cam: 'wide', cast: [DV({ mouth: 'frown', x: -0.8 }), GM({ x: 0.8, mouth: 'smile' })], tags: [[0, 0.35, 1.0, 'WHO WINS?', V('cta', 'scarier'), 'red']] },
      };
    },
  });
