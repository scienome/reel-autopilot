  // ==================== What if? Your nose grows one inch every day ====================
  // the day-counter stats card (top left), like a growth chart: day, length, comparison, +1 INCH EVERY DAY
  const hud = (ctx, W, H_, day, len, cmp) => { ctx.save(); ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = FONT(700, 22); ctx.textAlign = 'left'; ctx.fillText(day, 40, H_ * 0.6);
    ctx.fillStyle = '#ffffff'; ctx.font = FONT(800, 66); ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 8; ctx.fillText(len, 40, H_ * 0.66); ctx.shadowBlur = 0; ctx.font = FONT(700, 22); ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.fillText(cmp, 40, H_ * 0.69);
    ctx.fillStyle = '#d83a34'; ctx.fillRect(40, H_ * 0.703, 222, 30); ctx.fillStyle = '#fff'; ctx.font = FONT(800, 18); ctx.fillText('+1 INCH EVERY DAY', 52, H_ * 0.703 + 21); ctx.restore(); };
  // the hero: red hoodie, grey joggers, facing +x so the nose points sideways across the frame
  const HERO = { shirt: [200, 40, 46], pants: [150, 150, 156], hair: 'short', hairCol: [70, 46, 30] };
  const nose = (S, x, z, len, y = 1.73) => S.box((p) => add(p, [x + 0.12 + len / 2, y, z]), len / 2, 0.045, 0.045, [236, 186, 140], { bevel: 0.4 });
  makeComedy({
    badge: 'WHAT IF...?', badgeCol: '#c82020',
    captions: { say: {}, keys: { nose: 'r', inch: 'y', seven: 'y', sunglasses: 'o', thirty: 'y', sneeze: 'r', weather: 'o', airline: 'o', four: 'r', ten: 'y', football: 'o', birds: 'g', fifty: 'y', empire: 'o', doctors: 'r', cooking: 'r', truth: 'y' } },
    beats: ({ V }) => {
      const me = (ex = {}) => [null, -0.3, 0.2, Math.PI / 2, (t) => Object.assign({}, HERO, typeof ex === 'function' ? ex(t) : ex)];
      return {
        hook: { set: 'street', cam: 'mid', at: 0.15, cast: [me({ mouth: 'o', eyes: 'wide' })], props: (S, t) => nose(S, -0.3, 0.2, 0.05 + 0.08 * H.clamp(t / 3)),
          over: (ctx, W, H_) => hud(ctx, W, H_, 'DAY 0', '0 inches', 'TOTALLY NORMAL NOSE') },
        week: { set: 'street', cam: 'mid', at: 0.15, cast: [me({ mouth: 'frown', hold: 'phone' })], props: (S) => nose(S, -0.3, 0.2, 0.18),
          over: (ctx, W, H_) => hud(ctx, W, H_, 'DAY 7', '7 inches', 'ABOUT THE LENGTH OF A PHONE'), tags: [[0.4, 0.4, 0.5, 'NO SUNGLASSES', V('week', 'sunglasses'), 'red']] },
        month: { set: 'office', cam: 'wide', at: 0.4, cast: [me({ mouth: 'open', eyes: 'closed' }), [null, 1.2, 0.3, -Math.PI / 2, { shirt: [60, 90, 160], pants: [50, 50, 60], mouth: 'o', eyes: 'wide', sweat: true }]], props: (S) => nose(S, -0.3, 0.2, 0.76),
          over: (ctx, W, H_) => hud(ctx, W, H_, 'DAY 30', '2 ft 6 in', 'LONGER THAN A BASEBALL BAT'), tags: [[1.4, 2.45, 0.3, 'WEATHER EVENT', V('month', 'weather'), 'blue']], sfx: [['whoosh', V('month', 'sneeze'), { dur: 0.6, gain: 0.7 }]] },
        year: { set: 'base', cam: 'wide', at: 1.5, cast: [me({ mouth: 'frown', brows: 'worried' })], props: (S) => nose(S, -0.3, 0.2, 3.0),
          over: (ctx, W, H_) => hud(ctx, W, H_, 'DAY 365 · YEAR 1', '30 ft', 'LONGER THAN A BUS'), tags: [[1.5, 0.4, 0.5, '+4 SEATS', V('year', 'four'), 'red']] },
        ten: { set: 'lawn', cam: 'wide', at: 1.2, cast: [me({ mouth: 'flat' })], props: (S, t) => { nose(S, -0.3, 0.2, 7.5); for (let i = 0; i < 5; i++) S.box((p) => add(p, [0.5 + i * 0.6, 1.85 + 0.05 * Math.sin(t * 5 + i), 0.2]), 0.06, 0.05, 0.05, [70, 70, 80], { bevel: 0.4 }); },
          over: (ctx, W, H_) => hud(ctx, W, H_, 'YEAR 10', '304 ft', 'AS LONG AS A FOOTBALL FIELD'), tags: [[1.5, 2.45, 0.2, 'BIRDS LIVE HERE', V('ten', 'birds'), 'green']] },
        fifty: { set: 'city', opt: { night: 0 }, cam: 'wide', at: 1.2, cast: [me({ mouth: 'flat', hair: 'short', hairCol: [200, 200, 204] })], props: (S) => nose(S, -0.3, 0.2, 12),
          over: (ctx, W, H_) => hud(ctx, W, H_, 'YEAR 50', '1,521 ft', 'LONGER THAN THE EMPIRE STATE BUILDING'), tags: [[1.5, 2.45, 0.2, 'EMPIRE STATE: 1,454 FT', V('fifty', 'Empire'), 'orange']] },
        twist: { set: 'office', cam: 'mid', cast: [me({ mouth: 'o', eyes: 'wide', hairCol: [200, 200, 204] }), [null, 0.9, 0.2, -Math.PI / 2, { shirt: [246, 246, 246], pants: [246, 246, 246], mouth: 'flat', hold: 'clipboard' }]], props: (S) => nose(S, -0.3, 0.2, 1.2),
          tags: [[0.9, 2.45, 0.2, 'DIAGNOSIS: LYING', V('twist', 'cause'), 'red'], [0, 0.4, 0.6, '"I LOVE YOUR COOKING"', V('twist', 'cooking'), 'yellow', 1.3]] },
        cta: { set: 'lawn', cam: 'mid', at: 0.15, cast: [me({ mouth: 'smile', hold: 'fork' })], props: (S) => nose(S, -0.3, 0.2, 0.9), tags: [[0.3, 0.4, 0.6, 'TRUTH OR NOSE?', V('cta', 'truth'), 'yellow']] },
      };
    },
  });
