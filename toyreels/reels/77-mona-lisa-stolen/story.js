  // ==================== true stories in bricks: 77-mona-lisa-stolen ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#1f4f8f',
    captions: { say: {"nineteen eleven": "1911"}, keys: {"mona": "o", "peruggia": "y", "next": "y", "missing": "r", "florence": "b", "police": "b", "famous": "g", "noticed": "g"} },
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
        hook: { set: 'museum', cam: 'mid', props: (S, t, u) => { frame(S,0.45,1.2,0.4,1.3); }, cast: [man(-0.8,0.3,{shirt:[40,40,50],hat:'cap',mouth:'grin',eyes:'wide',arms:[1.4,1.4]})], tags: [[0, 2.5, 0, "MONA LISA STOLEN", V("hook", "mona"), 'red', 2.0]] },
        b1: { set: 'museum', cam: 'mid', props: (S, t, u) => { frame(S,0.45,1.2,0.4,1.3,'MONA'); }, cast: [man(-0.7,0.3,{shirt:[40,40,50],hat:'cap',mouth:'grin',hold:'bag'})], tags: [[0, 2.5, 0, "PERUGGIA", V("b1", "peruggia"), 'orange', 1.8]] },
        b2: { set: 'museum', cam: 'mid', props: (S, t, u) => { S.box((p)=>add(p,[0.5,1.2,0.4]),0.36,0.48,0.03,[60,50,40],{bevel:0.2}); }, cast: [man(-0.7,0.3,{shirt:[130,60,60],hat:'beret',mouth:'o',eyes:'wide',arms:[0.4,0.4]})], tags: [[0, 2.5, 0, "NEXT DAY", V("b2", "next"), 'yellow', 1.6]] },
        b3: { set: 'street', opt: { night: 0.8 }, cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.7,0.3,{shirt:[40,40,50],hat:'cap',mouth:'grin',hold:'bag',arms:[1.2,1.2]})], tags: [[0, 2.5, 0, "MISSING 2+ YEARS", V("b3", "missing"), 'red', 1.9]] },
        b4: { set: 'museum', cam: 'mid', props: (S, t, u) => { frame(S,0.45,1.2,0.4,1.3,'MONA'); }, cast: [man(-0.8,0.3,{shirt:[40,40,50],hat:'cap',mouth:'grin',hold:'bag'}),man(0.1,0.0,{shirt:[130,60,60],hat:'beret',mouth:'o',eyes:'wide'})], tags: [[0, 2.5, 0, "FLORENCE", V("b4", "florence"), 'blue', 1.7]] },
        twist: { set: 'court', cam: 'mid', props: (S, t, u) => {  }, cast: [man(-0.6,0.3,{shirt:[130,60,60],hat:'beret',hold:'phone',mouth:'grin',arms:[1.5,1.5]}),man(0.8,0.1,{hat:'police',shirt:[40,60,110],mouth:'grin'})], tags: [[0, 2.5, 0, "BUSTED", V("twist", "police"), 'green', 1.8]], flash: [V('twist', 'police')] },
        punch: { set: 'museum', cam: 'mid', props: (S, t, u) => { frame(S,0.45,1.2,0.4,1.5); for(let i=0;i<5;i++) S.box((p)=>add(p,[-1.4+i*0.5,0.5,0.9]),0.12,0.2,0.1,[40,40,50],{bevel:0.5}); }, cast: [man(-0.8,0.3,{shirt:[130,60,60],hat:'beret',mouth:'grin',arms:[1.4,0.4]})], tags: [[0, 2.5, 0, "WORLD FAMOUS", V("punch", "famous"), 'red', 2.0]] },
        cta: { set: 'museum', cam: 'mid', props: (S, t, u) => { S.box((p)=>add(p,[0.5,1.2,0.4]),0.36,0.48,0.03,[60,50,40],{bevel:0.2}); }, cast: [man(-0.8,0.3,{shirt:[130,60,60],hat:'beret',mouth:'o'})], tags: [[0, 0.42, 0.7, "NOTICE?", V("cta", "noticed"), 'yellow', 1.7]] },
      };
    },
  });
