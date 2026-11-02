  // ==================== true stories in bricks: 75-war-of-jenkins-ear ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#1f4f8f',
    captions: { say: {"seventeen thirty one": "1731", "seventeen thirty eight": "1738", "seventeen thirty nine": "1739"}, keys: {"war": "r", "ear": "o", "jenkins": "y", "parliament": "b", "furious": "r", "declared": "r", "bigger": "r", "thirty": "y", "revenge": "r"} },
    beats: ({ V }) => {

      const man = (x, z, ex = {}) => [null, x, z, ex.rot || 0, Object.assign({ shirt: [150, 110, 80], pants: [70, 70, 80], hair: 'short', hairCol: [60, 44, 34], mouth: 'smile' }, ex)];
      const sign = (S, x, y, z, w, h, txt, bg = '#f4ead0', fg = '#222') => S.box((p) => add(p, [x, y, z]), w, h, 0.03, [244, 234, 208], { bevel: 0.2, paint: (c, cw, ch) => { c.fillStyle = bg; c.fillRect(0, 0, cw, ch); c.fillStyle = fg; c.font = FONT(800, ch * 0.34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, cw / 2, ch / 2); } });
      const tank = (S, x, z, s = 1, col = [96, 112, 70], puff = 0) => { const B = (dx, dy, dz, hx, hy, hz, c) => S.box((p) => add(mul(add(p, [dx, dy, dz]), s), [x, 0, z]), hx, hy, hz, c, { bevel: 0.6 }); B(0, 0.3 + puff, 0, 0.55, 0.25 + puff, 0.8, col); B(0, 0.7 + puff, 0, 0.35, 0.18, 0.4, col); B(0, 0.72 + puff, 0.8, 0.06, 0.06, 0.5, col); };
      const bell = (S, x, y, z, s = 1, tilt = 0) => { S.cyl((p) => add(rotZ(mul(p, s), tilt), [x, y + 0.35 * s, z]), 0.38, 0.35, [212, 170, 70], 16); S.box((p) => add(mul(p, s), [x, y + 0.8 * s, z]), 0.4, 0.06, 0.06, [90, 70, 40], { bevel: 0.3 }); };
      const stone = (S, x, y, z, s = 1) => S.box((p) => add(mul(p, s), [x, y + 0.2 * s, z]), 0.45, 0.2, 0.28, [150, 148, 140], { bevel: 0.4 });
      const frame = (S, x, y, z, s = 1, txt = 'MONA') => { S.box((p) => add(mul(p, s), [x, y, z]), 0.36, 0.48, 0.03, [200, 160, 50], { bevel: 0.2 }); sign(S, x, y, z + 0.03 * s, 0.28 * s, 0.4 * s, txt, '#6a5a3a', '#f4ead0'); };
      const crate = (S, x, y, z, s = 1, c = [150, 110, 70]) => S.box((p) => add(mul(p, s), [x, y + 0.2 * s, z]), 0.22, 0.2, 0.22, c, { bevel: 0.15 });
      const SOL = { hat: 'army', shirt: [88, 100, 64], pants: [88, 100, 64] };

      return {
        hook: { set: 'court', cam: 'mid', props: (S, t, u) => { S.cyl((p)=>add(p,[0.5,0.8,0.5]),0.18,0.25,[220,230,240],12); S.box((p)=>add(p,[0.5,1.15,0.5]),0.1,0.12,0.05,[238,190,160],{bevel:0.6}); }, cast: [man(-0.8,0.3,{shirt:[60,80,130],hat:'tricorn',mouth:'o',eyes:'wide',arms:[1.5,1.5]})], tags: [[0, 2.5, 0, "WAR OVER AN EAR", V("hook", "ear"), 'red', 2.0]] },
        b1: { set: 'lawn', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.7,0.3,{shirt:[60,80,130],hat:'tricorn',mouth:'frown',sweat:true,arms:[1.0,1.0]}),man(0.8,0.2,{shirt:[190,150,50],hat:'army',hold:'sword',mouth:'evil',rot:-0.5,arms:[1.5,1.5]})], tags: [[0, 2.5, 0, "1731", V("b1", "thirty"), 'orange', 1.5]] },
        b2: { set: 'court', cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.7,0.3,{shirt:[60,80,130],hat:'tricorn',mouth:'o',arms:[1.4,0.4]}),man(0.9,0.1,{shirt:[240,240,240],hair:'wig',hold:'gavel',mouth:'flat',rot:-0.3})], tags: [[0, 2.5, 0, "PARLIAMENT", V("b2", "parliament"), 'blue', 1.7]] },
        b3: { set: 'court', cam: 'wide', props: (S, t, u) => {  }, cast: [man(-0.9,0.3,{shirt:[240,240,240],hair:'wig',mouth:'angry',brows:'angry',arms:[2.5,2.5]}),man(0.0,0.0,{shirt:[130,60,60],hair:'wig',mouth:'angry',brows:'angry',arms:[2.5,2.5]}),man(0.9,0.3,{shirt:[240,240,240],hair:'wig',mouth:'angry',brows:'angry',arms:[2.5,2.5]})], tags: [[0, 2.5, 0, "REVENGE!", V("b3", "furious"), 'red', 1.7]] },
        b4: { set: 'base', cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.7,0.3,{shirt:[190,40,40],hat:'tricorn',hold:'sword',mouth:'grin',arms:[1.4,1.4]})], tags: [[0, 2.5, 0, "WAR DECLARED", V("b4", "declared"), 'red', 1.8]] },
        twist: { set: 'stage', opt: { banner: 'JENKINS EAR' }, cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.7,0.3,{shirt:[60,80,130],hat:'tricorn',mouth:'grin',arms:[2.6,2.6]})], tags: [[0, 2.5, 0, "JENKINS' EAR WAR", V("twist", "war"), 'green', 2.1]], flash: [V('twist', 'war')] },
        punch: { set: 'space', cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.7,0.3,{shirt:[60,80,130],hat:'tricorn',eyes:'wide',mouth:'o',sweat:true})], tags: [[0, 2.5, 0, "GOT BIGGER", V("punch", "bigger"), 'red', 1.9]] },
        cta: { set: 'court', cam: 'mid', props: (S, t, u) => { S.box((p)=>add(p,[0.5,1.0,0.5]),0.1,0.12,0.05,[238,190,160],{bevel:0.6}); }, cast: [man(-0.7,0.3,{shirt:[60,80,130],hat:'tricorn',mouth:'smile'})], tags: [[0, 0.42, 0.7, "FIGHT FOR AN EAR?", V("cta", "ear"), 'yellow', 1.8]] },
      };
    },
  });
