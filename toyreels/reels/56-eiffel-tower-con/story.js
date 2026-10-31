  // ==================== True stories in bricks: the man who sold the Eiffel Tower (voice in voice.json) ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#1f4f8f',
    captions: { say: { 'nineteen twenty five': '1925' }, keys: { 'con': 'r', eiffel: 'y', sold: 'r', scrap: 'o', lustig: 'y', fix: 'r', faked: 'r', hotel: 'y', secret: 'r', dealer: 'b', cash: 'g', embarrassed: 'r', police: 'b', again: 'r', bought: 'y' } },
    beats: ({ V }) => {
      const IRON = [116, 92, 74], IRON2 = [92, 72, 58];
      // the tower, stacked from shrinking brick tiers on four splayed legs
      const eiffel = (S, x, z, k, tilt = 0) => {
        const b = (dx, y, dz, hx, hy, hz, c = IRON) => S.box((p) => { const q = add(p, [dx * k, y * k, dz * k]); const r = tilt * (q[1]); return add([q[0] + r, q[1], q[2]], [x, 0, z]); }, hx * k, hy * k, hz * k, c, { bevel: 0.2 });
        for (const a of [-1, 1]) for (const d of [-1, 1]) { b(a * 0.34, 0.16, d * 0.2, 0.08, 0.16, 0.08); b(a * 0.25, 0.46, d * 0.14, 0.065, 0.16, 0.065, IRON2); }
        b(0, 0.66, 0, 0.42, 0.045, 0.27);
        for (const a of [-1, 1]) for (const d of [-1, 1]) b(a * 0.16, 0.86, d * 0.09, 0.05, 0.16, 0.05);
        b(0, 1.05, 0, 0.26, 0.035, 0.17, IRON2);
        for (const [y, w] of [[1.26, 0.13], [1.5, 0.105], [1.74, 0.08], [1.98, 0.06], [2.2, 0.04]]) b(0, y, 0, w, 0.13, w, y % 0.5 < 0.1 ? IRON2 : IRON);
        b(0, 2.42, 0, 0.018, 0.1, 0.018, [230, 60, 50]);
      };
      const LUSTIG = (ex) => [null, -0.45, 0.25, 0.25, Object.assign({ suit: true, shirt: [30, 30, 38], pants: [30, 30, 38], tie: [190, 30, 50], hair: 'short', hairCol: [30, 24, 22], mouth: 'evil', brows: 'raised' }, ex)];
      const DEALER = (x, ex) => [null, x, 0.2, -0.2, Object.assign({ shirt: [120, 96, 70], pants: [70, 66, 62], hair: 'thin', mouth: 'o', brows: 'raised' }, ex)];
      const paper = (S, x, y, z, t) => S.box((p) => add(p, [x, y + Math.sin(t * 3) * 0.02, z]), 0.17, 0.22, 0.012, [245, 240, 225], { bevel: 0.1 });
      const cash = (S, x, y, z, n) => { for (let i = 0; i < n; i++) S.box((p) => add(p, [x, y + i * 0.05, z]), 0.17, 0.024, 0.09, [90, 175, 95], { bevel: 0.2 }); };
      return {
        hook: { set: 'city', opt: { night: 0 }, cam: 'wide', props: (S, t) => { eiffel(S, 0.65, -0.15, 1.5); cash(S, -0.55, 0.05, 0.75, 5); }, cast: [LUSTIG({ mouth: 'grin', arms: [1.2, 0.6] })],
          tags: [[0.65, 2.6, 0.1, 'FOR SALE', V('hook', 'sold'), 'red'], [-0.2, 0.45, 0.65, 'SCRAP METAL', V('hook', 'scrap'), 'orange', 1.2]], sfx: [['stamp', V('hook', 'sold'), { gain: 0.7 }]] },
        b1: { set: 'street', opt: { signs: ['CAFE', 'PARIS', 'POSTE', 'HOTEL'] }, cam: 'mid', props: (S, t) => paper(S, -0.15, 1.05, 0.55, t), cast: [LUSTIG({ x: 0, mouth: 'smile', arms: [1.1, 1.1] })],
          tags: [[0, 2.45, -0.4, 'PARIS: BROKE', V('b1', 'afford'), 'red', 1.1], [0.7, 0.5, 0.5, 'REPAIRS: $$$', V('b1', 'fix'), 'yellow', 1.1]] },
        b2: { set: 'palace', cam: 'mid', props: (S, t) => paper(S, 0, 0.9, 0.7, t), cast: [LUSTIG({ x: 0, z: 0.1, rot: 0, arms: [1.3, 1.3] }), DEALER(-0.85, {}), DEALER(0.85, { shirt: [70, 90, 110], mouth: 'smile', rot: 0.2 })],
          tags: [[0, 2.5, -0.4, 'FAKE GOVT PAPERS', V('b2', 'faked'), 'red', 1.3], [0, 0.4, 0.75, 'LUXURY HOTEL', V('b2', 'hotel'), 'yellow', 1.2]] },
        b3: { set: 'palace', cam: 'close', props: (S, t) => {}, cast: [LUSTIG({ x: 0, z: 0.1, rot: 0, mouth: 'evil', arms: [0.3, 2.2] })], tags: [[0, 2.45, -0.3, 'TOWER COMES DOWN', V('b3', 'tower'), 'red', 1.3], [0, 0.5, 0.65, 'TOP SECRET', V('b3', 'secret'), 'blue', 1.1]] },
        b4: { set: 'bank', cam: 'mid', props: (S, t, u) => cash(S, 0, 0.82, 0.45, 2 + Math.floor(u * 9)), cast: [LUSTIG({ x: -0.55, mouth: 'grin', rot: 0.4 }), DEALER(0.55, { mouth: 'smile', arms: [1.2, 1.2] })],
          tags: [[0.55, 2.5, -0.3, 'ONE DEALER', V('b4', 'dealer'), 'blue'], [0, 0.42, 0.7, 'PAID', V('b4', 'cash'), 'green']], sfx: [['count', V('b4', 'cash'), { gain: 0.6 }]] },
        twist: { set: 'street', opt: { signs: ['POLICE', 'CAFE', 'PARIS', 'TABAC'] }, cam: 'close', props: (S, t) => {}, cast: [DEALER(0, { x: 0, z: 0.1, rot: 0, mouth: 'frown', brows: 'sad', sweat: true, arms: [0.2, 0.2] })],
          tags: [[0, 2.45, -0.3, 'HE KNEW', V('twist', 'found'), 'red'], [0, 0.45, 0.65, 'TOLD NOBODY', V('twist', 'police'), 'blue', 1.2]], sfx: [['thud', V('twist', 'found'), { gain: 0.7 }]] },
        punch: { set: 'city', opt: { night: 0 }, cam: 'wide', props: (S, t) => { eiffel(S, 0.65, -0.15, 1.5); }, cast: [LUSTIG({ mouth: 'grin', arms: [1.6, 1.6] }), DEALER(-1.25, { rot: 0.5 })],
          tags: [[0.45, 2.6, 0.1, 'FOR SALE. AGAIN.', V('punch', 'again'), 'red', 1.3]], booms: [[0.65, 2.3, -0.1, V('punch', 'again'), 0.5]] },
        cta: { set: 'palace', cam: 'mid', props: (S, t) => eiffel(S, 0, -0.2, 0.75), cast: [LUSTIG({ x: -0.75, mouth: 'smile', rot: 0.4 })], tags: [[0, 0.42, 0.7, 'WOULD YOU BUY IT?', V('cta', 'bought'), 'yellow', 1.3]] },
      };
    },
  });
