  // ==================== true stories in bricks: 73-taco-liberty-bell ====================
  makeComedy({
    badge: 'TRUE STORY', badgeCol: '#a0148c',
    captions: { say: {"nineteen ninety six": "1996"}, keys: {"ad": "o", "bought": "o", "taco": "r", "ads": "y", "angry": "r", "prank": "g", "confessed": "y", "april": "g", "bell": "y"} },
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
        hook: { set: 'street', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => { sign(S,0.45,0.9,0.5,0.8,0.55,'NEWS','#ffffff','#111'); }, cast: [man(-0.8,0.3,{shirt:[40,60,110],mouth:'o',eyes:'wide',arms:[1.5,1.5]})], tags: [[0, 2.5, 0, "SHOCKING AD", V("hook", "shocking"), 'red', 1.9]] },
        b1: { set: 'museum', cam: 'mid', props: (S, t, u) => { bell(S,0.45,0.2,0.5,1.4); }, cast: [man(-0.8,0.3,{shirt:[200,40,120],hat:'cap',mouth:'grin',arms:[1.4,1.4]})], tags: [[0, 2.5, 0, "BOUGHT THE BELL", V("b1", "bought"), 'orange', 1.8]] },
        b2: { set: 'street', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => { for(let i=0;i<3;i++) sign(S,-0.2+i*0.7,0.8+i*0.05,0.6,0.55,0.7,'AD','#fff0f8','#a0148c'); }, cast: [man(-1.1,0.3,{shirt:[40,60,110],arms:[1.2,0.4]})], tags: [[0, 2.5, 0, "FULL PAGE ADS", V("b2", "ads"), 'yellow', 1.6]] },
        b3: { set: 'museum', cam: 'mid', props: (S, t, u) => { bell(S,0.45,0.2,0.5,1.4); sign(S,0.45,1.9,0.5,1.1,0.3,'TACO LIBERTY BELL','#fff0f8','#a0148c'); }, cast: [man(-0.8,0.3,{shirt:[200,40,120],hat:'cap',mouth:'grin',arms:[2.5,2.5]})], tags: [[0, 2.9, 0, "TACO LIBERTY BELL", V("b3", "taco"), 'red', 2.0]] },
        b4: { set: 'office', opt: { desk: false }, cam: 'mid', props: (S, t, u) => { S.box((p)=>add(p,[0.7,0.5,0.5]),0.3,0.2,0.2,[60,60,66],{bevel:0.3}); }, cast: [man(-0.6,0.3,{hat:'police',shirt:[110,130,90],hold:'phone',mouth:'frown',brows:'angry',sweat:true})], tags: [[0, 2.5, 0, "ANGRY CALLS", V("b4", "angry"), 'red', 1.7]] },
        twist: { set: 'stage', opt: { banner: 'APRIL 1' }, cam: 'mid', props: (S, t, u) => { bell(S,0.45,0.2,0.5,1.2,0.3); }, cast: [man(-0.8,0.3,{shirt:[200,40,120],hat:'cap',mouth:'grin',arms:[2.6,2.6]})], tags: [[0, 2.5, 0, "APRIL FOOLS!", V("twist", "prank"), 'green', 2.0]], flash: [V('twist', 'prank')] },
        punch: { set: 'street', opt: { night: 0 }, cam: 'mid', props: (S, t, u) => { sign(S,0.45,0.9,0.5,0.8,0.55,'LOL','#fff0f8','#a0148c'); }, cast: [man(-0.8,0.3,{shirt:[200,40,120],hat:'cap',mouth:'grin',arms:[1.3,0.4]})], tags: [[0, 2.5, 0, "IT WAS A JOKE", V("punch", "confessed"), 'yellow', 1.9]] },
        cta: { set: 'museum', cam: 'mid', props: (S, t, u) => { bell(S,0.45,0.2,0.5,1.3); }, cast: [man(-0.8,0.3,{shirt:[40,60,110]})], tags: [[0, 0.42, 0.7, "BELIEVE IT?", V("cta", "believed"), 'yellow', 1.7]] },
      };
    },
  });
