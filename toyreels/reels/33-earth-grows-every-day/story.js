  // ==================== What if? Earth gets 1% bigger every day ====================
  // At constant density surface gravity grows with the radius, so weight scales by 1.01^day (70 kg -> 2,646 kg on day 365).
  // the day-counter card (lower left): day, a little Earth that swells (log scale), the size and your weight, +1% EVERY DAY
  const earthDisc = (ctx, x, y, r) => { ctx.save(); ctx.fillStyle = '#2f6fd0'; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.clip(); ctx.fillStyle = '#46a84a';
    [[-0.35, -0.25, 0.4, 0.28], [0.3, 0.1, 0.32, 0.42], [-0.2, 0.45, 0.3, 0.16]].forEach(([a, b, w, h]) => { ctx.beginPath(); ctx.ellipse(x + a * r, y + b * r, w * r, h * r, 0.4, 0, TAU); ctx.fill(); });
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.4, r * 0.35, 0, TAU); ctx.fill(); ctx.restore(); };
  const hud = (ctx, W, H_, day) => { const f = Math.pow(1.01, day), kg = Math.round(70 * f); ctx.save(); ctx.fillStyle = 'rgba(16,20,34,0.55)'; ctx.beginPath(); ctx.roundRect(24, H_ * 0.515, 330, H_ * 0.235, 18); ctx.fill();
    earthDisc(ctx, 76, H_ * 0.555, 22 + 14 * Math.log(f)); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font = FONT(700, 22); ctx.textAlign = 'left'; ctx.fillText(`DAY ${day}`, 40, H_ * 0.62);
    ctx.fillStyle = '#ffffff'; ctx.font = FONT(800, 60); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 8; ctx.fillText(`×${f < 10 ? f.toFixed(1) : f.toFixed(0)} EARTH`, 40, H_ * 0.67); ctx.shadowBlur = 0;
    ctx.font = FONT(700, 24); ctx.fillStyle = '#ffd23f'; ctx.fillText(`YOU WEIGH ${kg.toLocaleString('en-US')} KG`, 40, H_ * 0.698);
    ctx.fillStyle = '#d83a34'; ctx.fillRect(40, H_ * 0.71, 210, 30); ctx.fillStyle = '#fff'; ctx.font = FONT(800, 18); ctx.fillText('+1% EVERY DAY', 52, H_ * 0.71 + 21); ctx.restore(); };
  const daysIn = (t, u, d0, d1) => Math.round(d0 + (d1 - d0) * H.clamp(u * 1.6));
  const HERO = { shirt: [40, 110, 200], pants: [60, 60, 70], hair: 'short', hairCol: [70, 46, 30] };
  // bathroom scale (squash 0..1 flattens it), stairs, toy birds, a parked plane, a pickup truck
  const bscale = (S, x, z, sq = 0) => { S.box((p) => add(p, [x, 0.05 * (1 - sq) + 0.01, z]), 0.3, 0.05 * (1 - sq) + 0.01, 0.26, [240, 240, 244], { bevel: 0.3 }); S.box((p) => add(p, [x, 0.105 * (1 - sq) + 0.022, z + 0.16]), 0.08, 0.004, 0.05, sq > 0.5 ? [220, 60, 50] : [40, 40, 48], { bevel: 0.2 }); };
  const steps = (S, x, z) => { for (let i = 0; i < 8; i++) S.box((p) => add(p, [x + i * 0.28, 0.12 + i * 0.24, z]), 0.14, 0.12 + i * 0.12, 0.5, [190, 160, 120], { bevel: 0.2 }); };
  const tbird = (S, x, z, t) => { S.box((p) => add(p, [x, 0.12 + 0.02 * Math.abs(Math.sin(t * 6 + x * 3)), z]), 0.09, 0.07, 0.06, [80, 80, 90], { bevel: 0.4 }); S.box((p) => add(p, [x + 0.1, 0.17, z]), 0.03, 0.015, 0.015, [240, 170, 40]); };
  const jet = (S, x, z) => { S.box((p) => add(p, [x, 0.35, z]), 1.0, 0.16, 0.16, [236, 236, 240], { bevel: 0.4 }); S.box((p) => add(p, [x, 0.35, z]), 0.2, 0.03, 0.9, [200, 40, 46], { bevel: 0.2 }); S.box((p) => add(p, [x - 0.9, 0.6, z]), 0.12, 0.18, 0.03, [200, 40, 46], { bevel: 0.2 });
    for (const sz of [-0.12, 0.12]) S.cyl((p) => add(rotX(p, Math.PI / 2), [x + 0.3, 0.1, z + sz]), 0.08, 0.05, [30, 30, 34], 12); };
  const truck = (S, x, z) => { S.box((p) => add(p, [x, 0.42, z]), 0.95, 0.22, 0.4, [200, 60, 46], { bevel: 0.25 }); S.box((p) => add(p, [x + 0.25, 0.8, z]), 0.38, 0.18, 0.38, [200, 60, 46], { bevel: 0.25 }); S.box((p) => add(p, [x + 0.45, 0.82, z + 0.39]), 0.15, 0.11, 0.01, [150, 200, 240]);
    for (const [a, b] of [[-0.6, -0.4], [-0.6, 0.4], [0.6, -0.4], [0.6, 0.4]]) S.cyl((p) => add(rotX(p, Math.PI / 2), [x + a, 0.2, z + b]), 0.2, 0.12, [30, 30, 34], 14); };
  makeComedy({
    badge: 'WHAT IF...?', badgeCol: '#c82020',
    captions: { say: {}, keys: { earth: 'g', percent: 'y', seven: 'y', gravity: 'o', planet: 'g', thirty: 'y', mountain: 'o', seventy: 'y', doubled: 'r', twice: 'r', jumping: 'r', five: 'y', birds: 'g', planes: 'o', year: 'y', pickup: 'r', truck: 'r', fourteen: 'g', land: 'g', rent: 'r' } },
    beats: ({ V }) => {
      const me = (ex = {}) => [null, 0.65, 0.2, -0.35, (t, u) => Object.assign({}, HERO, typeof ex === 'function' ? ex(t, u) : ex)];
      return {
        hook: { set: 'lawn', cam: 'mid', at: 0, cast: [me({ mouth: 'o', eyes: 'wide', arms: [0.6, 0.6] })],
          over: (ctx, W, H_, t, u) => { earthDisc(ctx, W * 0.62, H_ * 0.3, 50 + 60 * H.clamp(u * 1.3)); hud(ctx, W, H_, 0); } },
        week: { set: 'lawn', cam: 'mid', at: 0, cast: [me({ mouth: 'flat', bob: 0.12 })], props: (S) => bscale(S, 0.65, 0.2),
          over: (ctx, W, H_, t, u) => hud(ctx, W, H_, daysIn(t, u, 1, 7)), tags: [[0.65, 2.3, 0.2, 'NOT YOU. GRAVITY.', V('week', 'planet'), 'green']] },
        month: { set: 'street', cam: 'wide', at: 0.75, cast: [me({ x: 1.45, mouth: 'open', sweat: true, brows: 'worried', arms: [0.05, 0.05] })], props: (S) => steps(S, 1.8, -0.3),
          over: (ctx, W, H_, t, u) => hud(ctx, W, H_, daysIn(t, u, 8, 30)), tags: [[2.5, 2.4, -0.3, 'EVEREST MODE', V('month', 'mountain'), 'orange']] },
        seventy: { set: 'lawn', cam: 'mid', at: 0, cast: [me({ mouth: 'frown', sweat: true, brows: 'worried', arms: [0, 0], bob: 0.12 })], props: (S) => bscale(S, 0.65, 0.2, 0.3),
          over: (ctx, W, H_, t, u) => hud(ctx, W, H_, daysIn(t, u, 31, 70)), tags: [[0.65, 2.3, 0.2, '140 KG', V('seventy', 'twice'), 'red'], [0.75, 0.5, 0.6, 'JUMPING: CANCELLED', V('seventy', 'Jumping'), 'red']] },
        five: { set: 'lawn', cam: 'wide', at: 0.35, cast: [me({ x: 1.0, mouth: 'flat', sweat: true, arms: [0, 0] })], props: (S, t) => { for (let i = 0; i < 5; i++) tbird(S, 0.9 + i * 0.3 + 0.1 * Math.sin(t + i), 0.9 + 0.1 * (i % 2), t); jet(S, 2.1, -1.3); },
          over: (ctx, W, H_, t, u) => hud(ctx, W, H_, daysIn(t, u, 71, 160)), tags: [[1.5, 0.6, 0.9, 'BIRDS: WALKING', V('five', 'Birds'), 'green'], [2.1, 1.4, -1.3, 'FLIGHT CANCELLED', V('five', 'Planes'), 'orange']] },
        year: { set: 'street', cam: 'wide', at: 0.5, cast: [me({ x: 1.15, mouth: 'frown', sweat: true, brows: 'worried', arms: [0, 0], bob: 0.03 })], props: (S) => { bscale(S, 1.15, 0.2, 1); truck(S, 2.4, -0.4); },
          over: (ctx, W, H_, t, u) => hud(ctx, W, H_, daysIn(t, u, 161, 365)), tags: [[1.15, 2.3, 0.2, '2,645 KG', V('year', 'weigh'), 'red'], [2.4, 1.5, -0.4, 'SAME WEIGHT', V('year', 'pickup'), 'yellow']] },
        twist: { set: 'city', opt: { night: 0 }, cam: 'wide', at: 0.6, cast: [me((t) => ({ x: 1.2, mouth: 'smile', arms: [0.9, 0.9] })), [null, 0.1, 0.0, 0.4, { suit: true, tie: [180, 30, 40], mouth: 'evil', hold: 'briefcase' }]],
          tags: [[1.2, 2.3, 0.2, '×1,400 MORE LAND', V('twist', 'land'), 'green'], [0.1, 2.0, 0.0, 'RENT +10%', V('twist', 'Rent'), 'red']] },
        cta: { set: 'lawn', cam: 'mid', at: 0, cast: [me({ mouth: 'grin', arms: [1.2, 1.2] })], over: (ctx, W, H_) => earthDisc(ctx, W * 0.75, H_ * 0.3, 120),
          tags: [[0.65, 2.3, 0.2, 'WHICH DAY?', V('cta', 'day'), 'yellow']] },
      };
    },
  });
