// 174 cinestory3d (story3d.js): why dogs mount (AKC, ASPCA, VCA). Kept family-friendly: shown as a dog jumping up on a guest's leg. Scroll stopper: a guest frozen, a dog on their leg, "AWKWARD."
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const rm = k.LIB.place.room({ wall: '#e6dccb' }); k.place(rm);
  const sofa = new T.Group(); rm.add(sofa); sofa.position.set(0, 0, -1.6); const SF = M('#5a7a9a', 0.8); const seat = new T.Mesh(new T.BoxGeometry(2.4, 0.45, 0.9), SF); seat.position.y = 0.22; sofa.add(seat); const back = new T.Mesh(new T.BoxGeometry(2.4, 0.7, 0.2), SF); back.position.set(0, 0.6, -0.4); sofa.add(back);
  const guest = k.add(k.LIB.human({ body: 'f', top: '#c0392b', bottom: '#2a2f3a', hair: '#1a1210', hairStyle: 'long' }), [0.5, 0.0, -1.2], 0, rm);
  const owner = k.add(k.LIB.human({ body: 'm', top: '#3a6ea5', bottom: '#2a2a30', hair: '#3b2414' }), [-1.6, 0, 0.2], 0.9, rm);
  const dog = k.add(k.LIB.animal('dog', { h: 0.5 }), [0.5, 0, -0.5], PI, rm), dog2 = k.add(k.LIB.animal('husky', { h: 0.55 }), [0, 0, 0], 0, rm);
  const pillow = new T.Mesh(new T.BoxGeometry(0.6, 0.2, 0.4), M('#e0a020', 0.9)); rm.add(pillow); const ball = new T.Mesh(new T.SphereGeometry(0.1, 16, 12), M('#2ecc71', 0.5)); rm.add(ball);
  let ov = null; const up = (t) => { dog.position.set(0.5, 0, -0.75); dog.rotation.set(-0.9, PI, 0); dog.position.y = 0.25 + Math.abs(Math.sin(t * 6)) * 0.04; dog.pose('idle', t); };
  const base = () => { k.only(rm); dog.rotation.set(0, PI, 0); dog2.visible = false; pillow.visible = ball.visible = false; owner.visible = true; guest.visible = true; guest.position.set(0.5, 0, -1.2); guest.rotation.y = 0; };
  const shots = {
    hook: (t, kk) => { base(); guest.pose('sit', t); owner.pose('idle', t); up(t); owner.visible = false; ov = (ctx) => k.big(ctx, 'AWKWARD.', { y: 240, size: 96, col: '#ffd23f' }); return k.cam([1.6, 1.2, 1.6], [0.4, 0.7, -0.9], 40); },
    guest: (t, kk) => { base(); guest.pose('sit', t); owner.pose('talk', t); if (kk > 0.5) up(t); else k.walk(dog, [2.5, 0, 1.5], [0.5, 0, -0.6], E(kk * 2), 'walk', t); return k.cam([2.6, 1.6, 3.2], [0, 0.6, -0.8], 42); },
    not: (t, kk) => { base(); guest.pose('sit', t); owner.pose('idle', t); up(t); owner.visible = false; ov = (ctx) => k.card(ctx, 'NOT ABOUT MATING', { y: 200, bg: '#2f6fd8' }); return k.cam([1.6, 1.2, 1.6], [0.4, 0.7, -0.9], 40); },
    play: (t, kk) => { base(); guest.visible = false; dog2.visible = true; dog.position.set(Math.sin(t * 3) * 1.2, 0, 0.5); dog.rotation.y = Math.cos(t * 3) > 0 ? PI / 2 : -PI / 2; dog.pose('gallop', t); dog2.position.set(Math.sin(t * 3 + 1) * 1.2, 0, 0.9); dog2.rotation.y = dog.rotation.y; dog2.pose('gallop', t); owner.pose('idle', t);
      ov = (ctx) => k.card(ctx, 'PLAY + EXCITEMENT', { y: 200, bg: '#e0a020' }); return k.cam([0, 1.4, 4.4], [0, 0.4, 0.4], 42); },
    stress: (t, kk) => { base(); guest.pose('sit', t); owner.pose('talk', t); up(t); ov = (ctx) => { k.card(ctx, 'STRESS', { y: 190, bg: '#7a3ad8' }); k.card(ctx, 'ATTENTION', { y: 300, bg: '#e8384f' }); }; return k.close(owner, { d: 2.2, side: 0.3 }); },
    toy: (t, kk) => { base(); guest.visible = false; pillow.visible = true; pillow.position.set(1.2, 0.1, 0.6); dog.position.set(1.2, 0.18, 0.95); dog.rotation.set(-0.5, PI, 0); dog.pose('idle', t); owner.pose('idle', t); ov = (ctx) => k.card(ctx, 'FAVOURITE PILLOW', { y: 200, bg: '#c9a24a' }); return k.cam([2.6, 1.2, 2.6], [1.2, 0.3, 0.6], 40); },
    fix: (t, kk) => { base(); guest.pose('sit', t); owner.visible = true; owner.position.set(0.9, 0, 0.1); owner.rotation.y = PI + 0.6; owner.pose(kk < 0.4 ? 'pickup' : 'talk', t); ball.visible = kk > 0.4; ball.position.set(0.6, 0.1, 0.9); dog.position.set(0.4, 0, 0.6); dog.rotation.set(0, 0, 0); dog.pose(kk > 0.5 ? 'idle' : 'walk', t);
      ov = (ctx) => k.card(ctx, 'CALM · REDIRECT · SIT', { y: 200, bg: '#2ecc71' }); return k.cam([-1.2, 1.6, 3.4], [0.5, 0.6, 0], 42); },
    vet: (t, kk) => { base(); guest.visible = false; owner.pose('idle', t); dog.position.set(0.3, 0, 0.3); dog.rotation.set(0, 0.6, 0); dog.pose('idle', t); ov = (ctx) => k.card(ctx, 'SUDDENLY A LOT? → VET', { y: 200, bg: '#e8384f', size: 40 }); return k.close(dog, { d: 1.4, side: 0.4 }); },
    outro: (t, kk) => { base(); guest.pose('sit', t); owner.pose('idle', t); up(t); ov = (ctx) => k.big(ctx, 'JUST EXCITED. 🐕', { y: 240, size: 68, col: '#ffd23f' }); owner.visible = false; return k.cam([1.6, 1.2, 1.6], [0.4, 0.7, -0.9], 40); },
  };
  return { shots, sky: '#e6dccb', over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['animals/dog', 'animals/husky', 'humans/Superhero_Male', 'humans/Superhero_Female', 'humans/ual1'] });
