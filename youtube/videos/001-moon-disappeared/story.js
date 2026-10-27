  // ==================== 001 "What if the Moon disappeared?" (16:9, about 4.5 min) ====================
  const { V, B, DURATION, CHAPTERS } = VIDEO_TIMING(window.SCRIPT);
  const IDS = window.SCRIPT.flatMap((c) => c.beats.map((b) => b.id));
  const SH = IDS.map((id, i) => [id, i ? B(id) - 0.1 : 0]);
  const shotAt = makeShotAt(SH, DURATION);
  const ramp = (t, a, d = 0.4) => H.ease.inOut(H.clamp((t - a) / d));
  const g = (w) => [w, 'g'], y = (w) => [w, 'y'], o = (w) => [w, 'o'], r = (w) => [w, 'r'];
  const CAPS = [
    [V('hook', 'what'), [['What', 'if', 'the', y('Moon')], ['just', o('disappeared?')]]],
    [V('gone', 'no'), [['No', 'explosion.'], ['No', 'warning.']]],
    [V('gone', 'one'), [['One', 'second', "it's", 'there...'], ['...the', 'next,', r("it's"), r('gone.')]]],
    [V('notice', 'would'), [['Would', 'anyone', g('notice?')]]],
    [V('notice', "we'll"), [['From', 'the', y('first'), y('second')], ['to', o('millions'), 'of', 'years']]],
    [V('notice', "let's"), [["Let's", g('build'), 'it,'], ['brick', 'by', 'brick.']]],
    [V('size', 'first'), [['Meet', 'the', y('Moon.')]]],
    [V('size', 'roughly'), [['About', 'a', y('quarter')], ["of", "Earth's", 'width']]],
    [V('size', "it's", 2), [['The', y('5th'), y('biggest')], ['moon', 'we', 'know']]],
    [V('dist', 'on'), [['About', y('384,400'), 'km'], ['away']]],
    [V('planets', 'that'), [['Every', 'other', y('planet')], ['fits', 'in', 'the', g('gap')]]],
    [V('drift', 'and'), [['Drifting', o('away...')]]],
    [V('drift', "that's"), [['...as', 'fast', 'as', 'your'], [y('fingernails'), 'grow']]],
    [V('vanish', 'so'), [['The', 'Moon', r('vanishes.')]]],
    [V('vanish', 'well'), [['Moonlight', 'takes'], [y('1.3'), y('seconds'), 'to', 'arrive']]],
    [V('vanish', 'then'), [['Then...', 'the', 'sky', 'is', o('empty.')]]],
    [V('balance', 'earth'), [['They', 'swing', 'around', 'a'], [y('balance'), y('point')]]],
    [V('balance', 'about'), [[y('4,700'), 'km', 'from'], ["Earth's", 'centre']]],
    [V('stop', 'without'), [['The', 'wobble', r('stops.')]]],
    [V('stop', 'earth'), [['Earth', 'keeps', g('circling')], ['the', 'Sun']]],
    [V('stop', 'no'), [['No', g('crash.')]]],
    [V('beach', 'the'), [['First', 'stop:', 'the', y('beach')]]],
    [V('beach', 'in'), [['Bay', 'of', 'Fundy:', 'up', 'to'], [y('16'), y('metres'), 'twice', 'a', 'day']]],
    [V('bulge', 'the'), [['The', 'Moon', 'pulls', 'the', 'oceans'], ['into', y('two'), y('bulges')]]],
    [V('bulge', "that's"), [[g('High'), g('tide,')], [o('low'), o('tide')]]],
    [V('suntide', 'the'), [['The', y('Sun'), 'makes', 'tides', 'too...']]],
    [V('suntide', 'but'), [['...less', 'than', o('half'), 'as', 'strong']]],
    [V('shrink', 'so'), [['Tides', 'shrink', 'to'], ['less', 'than', o('half')]]],
    [V('pools', 'rock'), [['Rock', 'pools', 'in'], [r('serious'), r('trouble')]]],
    [V('night', 'then'), [['Then,', 'the', y('nights.')]]],
    [V('night', 'a'), [['A', 'full', 'moon', 'is', 'bright'], ['enough', 'to', g('walk'), g('by')]]],
    [V('dark', 'without'), [['Every', 'night', 'as', 'dark'], ['as', 'a', o('new'), o('moon')]]],
    [V('coral', 'and'), [['Life', 'runs', 'on', 'a'], [y('Moon'), y('clock')]]],
    [V('coral', 'on'), [['Corals', 'sense', 'the'], [y('full'), y('moon...')]]],
    [V('coral', 'and', 2), [['...and', g('spawn'), g('together')]]],
    [V('lost', 'no'), [['No', 'moonlight,', 'no', r('signal.')]]],
    [V('eclipse', 'say'), [['Goodbye,', 'solar', o('eclipses')]]],
    [V('ratio', 'the'), [['The', 'Sun:', y('400×'), 'wider']]],
    [V('ratio', 'but'), [['...and', y('400×'), 'farther', 'away']]],
    [V('ratio', "that's"), [['A', g('perfect'), g('fit')]]],
    [V('never', 'no'), [['No', 'total', 'eclipses.'], [r('Ever.')]]],
    [V('never', 'funny'), [['Even', 'with', 'the', 'Moon,'], ['it', "won't", o('last...')]]],
    [V('never', "it's"), [['In', 'about', y('600'), y('million')], ['years:', 'too', o('small')]]],
    [V('brake', 'now'), [['Now,', 'the', y('slow'), y('changes')]]],
    [V('brake', 'those'), [['Tides', 'are', 'a', o('brake')], ['on', "Earth's", 'spin']]],
    [V('ms', 'every'), [['Every', 'century:', 'days', 'get'], [y('~0.002'), y('s'), 'longer']]],
    [V('fossil', 'it'), [['It', g('adds'), g('up.')]]],
    [V('fossil', 'fossil'), [[y('350'), y('million'), 'years', 'ago...']]],
    [V('fossil', 'a'), [['...a', 'year', 'had', y('385'), y('days')]]],
    [V('nobrake', 'without'), [['No', 'Moon:', 'a', 'much'], ['weaker', o('brake')]]],
    [V('nobrake', 'and'), [['Days', 'stay', 'about'], ['the', g('same')]]],
    [V('tilt', 'and'), [['The', 'big', 'one:', 'the', o('tilt')]]],
    [V('tilt', 'earth'), [['Earth', 'leans', y('23.5°')]]],
    [V('tilt', 'that'), [['That', 'gives', 'us', g('seasons')]]],
    [V('steady', 'the'), [['The', 'Moon', 'holds', 'it', g('steady')]]],
    [V('wander', 'without'), [['Without', 'it,', 'the', 'tilt'], ['could', o('wander')]]],
    [V('wander', 'some'), [['Maybe', y('~10°')]]],
    [V('wander', 'older'), [['Maybe', r('much'), r('more')]]],
    [V('seasons', 'either'), [['Seasons', 'would', o('slowly'), o('shift')]]],
    [V('survive', 'so'), [['So,', 'would', 'we', 'survive?']]],
    [V('survive', 'yes'), [[g('Yes.')]]],
    [V('world', 'but'), [['A', 'darker', 'world...']]],
    [V('world', 'with'), [['Smaller', 'tides,', 'no', 'eclipses,'], ['drifting', o('seasons')]]],
    [V('wave', 'so'), [['Next', 'time,', 'give', 'the'], ['Moon', 'a', y('wave')]]],
    [V('wave', "it's"), [["It's", 'doing', 'a', 'lot'], ['of', g('work')]]],
    [V('next', 'which'), [['Which', y('what'), y('if'), 'next?']]],
    [V('next', 'tell'), [['Tell', 'us', 'in', 'the', g('comments!')]]],
  ];
  const caps = makeCaps(CAPS);

  // ---- shared pieces ----
  const SP = (t) => t * 0.32; // Earth's spin angle
  const lawn = (ctx, W, H_, t, E, TG, build, night = 0, moonA = 0, moonXY = [0.76, 0.27]) => {
    const S = Scene(E, TG, W, H_); build(S);
    grassSet(ctx, W, H_, S, t); S.render(ctx, W, H_, {});
    nightGrade(ctx, W, H_, night); skyMoon(ctx, W * moonXY[0], H_ * moonXY[1], 64, moonA);
    return S;
  };
  const space = (ctx, W, H_, t, E, TG, build, glowX) => { const S = Scene(E, TG, W, H_); build(S); spaceSet(ctx, W, H_, t, glowX); S.render(ctx, W, H_, SPACE_ENV); return S; };
  const studio = (ctx, W, H_, E, TG, build) => { const S = Scene(E, TG, W, H_); build(S); studioSet(ctx, W, H_, S); S.render(ctx, W, H_, { sky: [210, 225, 255], ground: [110, 150, 230] }); return S; };
  const fig = (S, x, z, s, rot, o2) => S.figure(x, z, s, rot, Object.assign({ hat: 'cap', shirt: P.orange }, o2));
  const dotted = (ctx, pts, a = 0.8, col = '255,255,255') => { ctx.save(); ctx.fillStyle = `rgba(${col},${a})`; for (const [x, y2] of pts) { ctx.beginPath(); ctx.arc(x, y2, 4, 0, TAU); ctx.fill(); } ctx.restore(); };
  const ringPts = (S, c, R, n = 64, plane = 'xz') => Array.from({ length: n }, (_, i) => { const a = (i / n) * TAU; return S.proj(plane === 'xz' ? [c[0] + Math.cos(a) * R, c[1], c[2] + Math.sin(a) * R] : [c[0] + Math.cos(a) * R, c[1] + Math.sin(a) * R, c[2]]); });
  // planets for the "they all fit" line-up (true diameters in km)
  const PLANETS = [['Mercury', 4879, [150, 148, 150]], ['Venus', 12104, [236, 206, 140]], ['Mars', 6779, [214, 104, 60]], ['Jupiter', 139820, [214, 172, 128]], ['Saturn', 116460, [232, 206, 140]], ['Uranus', 50724, [130, 210, 220]], ['Neptune', 49244, [70, 110, 220]]];
  const bandCol = (base) => (d) => { const b = Math.sin(d[1] * 7); return b > 0.3 ? base.map((v) => Math.min(255, v * 1.12)) : b < -0.4 ? base.map((v) => v * 0.82) : base; };

  // ==================== the shots ====================
  const SHOT = {
    hook(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.3, 2.3, 8.4], [0, 1.2, 0], [0.2, 2.1, 7.2], [0, 1.25, 0]);
      lawn(ctx, W, H_, t, E, TG, (S) => {
        fig(S, -1.4, 0.6, 1, 0.5, { arms: [0.15, 0.2 + 2.2 * popU(t, a + 0.6, 0.5)], shirt: P.blue });
        const q = popU(t, V('hook', 'disappeared'), 0.4); if (q > 0) S.tag(-0.5, 2.6, 0.6, '?', q, 0.12, P.yellow, 0.3);
      }, 0.8, 1);
    },
    gone(ctx, W, H_, t, a, b) {
      const tg = V('gone', 'gone'), k = ramp(t, tg, 0.25);
      const [E, TG] = shotCam(t, a, b, [0.2, 2.1, 7.2], [0, 1.25, 0], [0.1, 2.0, 6.5], [0, 1.3, 0]);
      lawn(ctx, W, H_, t, E, TG, (S) => {
        fig(S, -1.4, 0.6, 1, 0.5, { arms: t > tg ? [2.6, 2.6] : [0.15, 2.4], mouth: t > tg ? 'o' : null, shirt: P.blue, bob: t > tg && t < tg + 0.5 ? Math.sin((t - tg) / 0.5 * Math.PI) * 0.2 : 0 });
      }, 0.8, 1 - k);
      if (t > tg && t < tg + 0.8) { const u = (t - tg) / 0.8; ctx.save(); ctx.strokeStyle = `rgba(255,250,220,${1 - u})`; ctx.lineWidth = 8 * (1 - u); ctx.beginPath(); ctx.arc(W * 0.76, H_ * 0.27, 64 + u * 160, 0, TAU); ctx.stroke(); ctx.restore(); }
    },
    notice(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0, 2.6, 9], [0, 1.4, 0], [0, 2.2, 7.8], [0, 1.4, 0]);
      const S = space(ctx, W, H_, t, E, TG, (S) => {
        earth(S, [0, 1.4, 0], 1.3, SP(t), 0, 5);
        const q = popU(t, V('notice', 'notice'), 0.4); if (q > 0) S.tag(2.6, 2.6, 0.5, '?', q, 0.12, P.yellow, 0.3);
        const nb = Math.floor(H.clamp((t - V('notice', 'brick')) / 0.9) * 6); for (let i = 0; i < nb; i++) S.brick(-3.6 + i * 0.33, 0.0, 1.2, 1, 1, [P.red, P.yellow, P.blue, P.green][i % 4], 0, (1 - H.clamp((t - V('notice', 'brick') - i * 0.15) / 0.2)) * 1.2);
      });
      dotted(ctx, ringPts(S, [0, 1.4, 0], 3.4, 70), 0.45);
    },
    size(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0, 1.8, 9.2], [0.2, 1.4, 0], [0, 1.7, 8.2], [0.2, 1.45, 0]);
      space(ctx, W, H_, t, E, TG, (S) => {
        earth(S, [-2.3, 1.5, 0], 1.6, SP(t), 0, 5);
        const m = popU(t, a + 0.3, 0.5); if (m > 0) moon(S, [2.7, 1.5, 0], 0.44 * m, t * 0.1);
        S.tag(2.7, 0.35, 0.6, '3,470 km', popU(t, V('size', 'three')), -0.05, P.red, 0.95);
        S.tag(-2.3, -0.65, 0.8, '12,742 km', popU(t, V('size', 'roughly')), 0.04, P.red, 1.05);
        S.tag(2.7, 2.75, 0.4, 'No. 5', popU(t, V('size', 'fifth')), 0.08, P.yellow, 0.6);
      });
    },
    dist(ctx, W, H_, t, a, b) { SHOT._gap(ctx, W, H_, t, a, b, false); },
    planets(ctx, W, H_, t, a, b) { SHOT._gap(ctx, W, H_, t, a, b, true); },
    _gap(ctx, W, H_, t, a, b, withPlanets) {
      const [E, TG] = shotCam(t, a, b, [0, 1.9, 13.2], [0, 1.4, 0], [0, 1.8, 12.4], [0, 1.4, 0]);
      const XE = -5.75, XM = 5.75, KM = 384400 / (XM - XE);
      const S = space(ctx, W, H_, t, E, TG, (S) => {
        earth(S, [XE, 1.4, 0], 12742 / KM / 2, SP(t), 0, 2);
        moon(S, [XM, 1.4, 0], 0.1, 0, 1);
        if (!withPlanets) {
          const u = H.clamp((t - V('dist', 'about')) / 2.2), n = Math.floor(u * 30);
          for (let i = 0; i < n; i++) S.box((p) => add(p, [XE + 0.35 + i * 0.37, 0.55, 0]), 0.15, 0.06, 0.08, [P.yellow, P.orange][i % 2], { bevel: 0.3 });
          S.tag(0, -0.35, 1.2, Math.round(384400 * H.ease.out(u)).toLocaleString('en-US') + ' km', popU(t, V('dist', 'about')), -0.04, u >= 1 ? P.green : P.red, 1.6);
        } else {
          let x = XE + 12742 / KM / 2 + 0.02;
          PLANETS.forEach(([nm, d, col], i) => {
            const rr = d / KM / 2, st = V('planets', 'line') + i * 0.38, u = popU(t, st, 0.35);
            if (u > 0) { const n = Math.max(1, Math.min(4, Math.round(rr / 0.14))); voxBall(S, [x + rr, 1.4, 0], rr * u, n, bandCol(col), t * 0.2, 0); if (nm === 'Saturn') for (let k = 0; k < 16; k++) { const ang = (k / 16) * TAU; S.box((p) => add(rotY(p, -ang), [x + rr + Math.cos(ang) * rr * 1.7 * u, 1.4, Math.sin(ang) * rr * 1.7 * u]), rr * 0.3 * u, 0.03, rr * 0.12 * u, [222, 196, 140], { bevel: 0.2 }); } }
            x += rr * 2;
          });
          S.tag(0, -0.35, 1.2, 'they all fit!', popU(t, V('planets', 'inside')), -0.04, P.green, 1.5);
        }
      });
      const pe = S.proj([XE, 2.0, 0]), pm = S.proj([XM, 1.75, 0]);
      ctx.save(); ctx.font = FONT(800, 40); ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 8;
      ctx.fillText('Earth', pe[0], pe[1] - 30); ctx.fillText('Moon', pm[0], pm[1] - 30); ctx.restore();
    },
    drift(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.4, 2.2, 7.6], [0.3, 1.0, 0], [0.3, 2.0, 6.8], [0.3, 1.05, 0]);
      const mx = 1.4 + H.clamp((t - a) / (b - a)) * 0.9, nail = t > V('drift', "that's");
      lawn(ctx, W, H_, t, E, TG, (S) => {
        for (let i = 0; i < 8; i++) S.brick(-0.6 + i * 0.34, 0, 0.9, 1, 1, i % 2 ? P.yellow : P.white, 0, 0);
        moon(S, [mx, 0.62, 0.3], 0.5, t * 0.15, 3);
        fig(S, -2.0, 0.8, 0.95, 0.45, { arms: [0.15, nail ? 2.2 : 0.15], look: nail ? 0.06 : 0, shirt: P.green });
        S.tag(0.6, 0.5, 2.3, '3.8 cm / year', popU(t, V('drift', 'three')), -0.05, P.red, 1.35);
      });
    },
    vanish(ctx, W, H_, t, a, b) {
      const tv = V('vanish', 'vanishes'), tl0 = V('vanish', 'well'), tl1 = V('vanish', 'then');
      const [E, TG] = shotCam(t, a, b, [0, 1.9, 9.4], [0, 1.5, 0], [0, 1.8, 8.6], [0, 1.5, 0]);
      const S = space(ctx, W, H_, t, E, TG, (S) => {
        earth(S, [-3.1, 1.5, 0], 1.2, SP(t), 0, 5);
        const m = 1 - H.clamp((t - tv) / 0.2); if (m > 0) moon(S, [3.3, 1.5, 0], 0.45 * m, 0);
        S.tag(0.1, 0.0, 1.0, '1.3 s', popU(t, V('vanish', 'over')), -0.05, P.red, 0.7);
      });
      const pm = S.proj([3.3, 1.5, 0]), pe = S.proj([-1.85, 1.5, 0]);
      if (t > tv) { ctx.save(); ctx.setLineDash([10, 12]); ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(pm[0], pm[1], 0.45 * 1350 / pm[2], 0, TAU); ctx.stroke(); ctx.restore(); }
      if (t > tl0 && t < tl1 + 0.2) { const u = H.clamp((t - tl0) / (tl1 - tl0)); for (let i = 0; i < 6; i++) { const uu = H.clamp(u - i * 0.03); const x = H.lerp(pm[0], pe[0], uu), y2 = H.lerp(pm[1], pe[1], uu); ctx.fillStyle = `rgba(255,236,150,${1 - i * 0.15})`; ctx.beginPath(); ctx.arc(x, y2, 14 - i * 1.8, 0, TAU); ctx.fill(); } }
    },
    _pair(ctx, W, H_, t, a, b, withMoon, wob) {
      const [E, TG] = shotCam(t, a, b, [0, 6.2, 7.4], [0, 1.0, 0], [0, 5.6, 6.6], [0, 1.0, 0]);
      const th = t * 0.55, u = [Math.cos(th), 0, -Math.sin(th)], bc = [-0.4, 1.0, 0], R = 1.0, off = 0.73 * R * wob;
      const ec = add(bc, mul(u, -off)), mc = add(bc, mul(u, 3.6));
      const S = space(ctx, W, H_, t, E, TG, (S) => {
        earth(S, ec, R, SP(t), 0);
        if (withMoon) { moon(S, mc, 0.3, 0, 2); S.box((p) => add(rotY(p, th), mul(add(ec, mc), 0.5)), 1.9, 0.04, 0.04, P.yellow, { bevel: 0.3 }); }
      }, 0.5);
      dotted(ctx, ringPts(S, bc, off + 0.001, 40), 0.6, '255,230,120');
      const pb = S.proj(add(bc, [0, R + 0.02, 0]));
      if (withMoon) { ctx.save(); ctx.fillStyle = '#ff4a3a'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(pb[0], pb[1], 14, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore(); }
      return S;
    },
    balance(ctx, W, H_, t, a, b) {
      const S = SHOT._pair(ctx, W, H_, t, a, b, true, 1);
      const tg = popU(t, V('balance', 'about'));
      if (tg > 0) { const p = S.proj([-0.4, 1.0, 1.3]); ctx.save(); ctx.translate(p[0], p[1] + 70); ctx.scale(tg, tg); ctx.font = FONT(800, 46); ctx.textAlign = 'center'; ctx.fillStyle = '#ffe04a'; ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 10; ctx.fillText('balance point: 4,700 km from the centre', 0, 0); ctx.restore(); }
    },
    stop(ctx, W, H_, t, a, b) {
      const w = 1 - ramp(t, V('stop', 'stops'), 1.2);
      SHOT._pair(ctx, W, H_, t, a, b, false, Math.max(0.0001, w * 0.999));
      const tk = popU(t, V('stop', 'before')); if (tk > 0) { const S = Scene([0, 2, 8], [0, 1.3, 0], W, H_); brickTick(S, 3.6, 2.6, 0.5, tk, 1.4); S.render(ctx, W, H_, { shadows: false }); }
    },
    beach(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.3, 2.1, 7.6], [0, 0.6, 0], [0.2, 1.9, 6.8], [0, 0.65, 0]);
      const S = Scene(E, TG, W, H_), lvl = 0.26 * Math.sin((t - a) * 1.4);
      fig(S, 1.6, 2.0, 0.9, -0.5, { shirt: P.red, hat: null, arms: [0.15, 0.15 + (t > V('beach', 'sixteen') ? 2.2 : 0)] });
      for (let i = 0; i < 3; i++) S.brick(-1.2 + i * 0.34, 0.33, 1.6, 1, 1, P.tan, 0, 0); S.brick(-0.86, 0.71, 1.6, 1, 1, P.tan, 0, 0);
      S.tag(0.2, 1.2, 2.4, 'up to 16 m', popU(t, V('beach', 'sixteen')), -0.05, P.red, 1.2);
      beachSet(ctx, W, H_, S, t, lvl); S.render(ctx, W, H_, {});
    },
    bulge(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0, 2.4, 9.0], [0.6, 1.4, 0], [0, 2.2, 8.2], [0.6, 1.4, 0]);
      const S = Scene(E, TG, W, H_), ec = [-1.4, 1.4, 0], R = 1.25;
      earth(S, ec, R, SP(t) * 2, 0, 5); moon(S, [4.0, 1.4, 0], 0.36, 0, 2);
      S.tag(-1.4 + R * 1.75, 2.55, 0.4, 'HIGH', popU(t, V('bulge', 'high')), 0.06, P.green, 0.6);
      S.tag(-1.4 - R * 1.75, 2.55, 0.4, 'HIGH', popU(t, V('bulge', 'high') + 0.1), -0.06, P.green, 0.6);
      S.tag(-1.4, 3.3, 0.0, 'LOW', popU(t, V('bulge', 'low')), 0.04, P.orange, 0.55);
      spaceSet(ctx, W, H_, t);
      const pc = S.proj(ec), rpx = (R * 1350) / pc[2], gro = ramp(t, V('bulge', 'stretches'), 0.8);
      ctx.save(); ctx.fillStyle = 'rgba(80,170,255,0.38)'; ctx.beginPath(); ctx.ellipse(pc[0], pc[1], rpx * (1.02 + 0.32 * gro), rpx * (1.02 - 0.06 * gro), 0, 0, TAU); ctx.fill(); ctx.restore();
      S.render(ctx, W, H_, SPACE_ENV);
    },
    suntide(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0, 2.5, 8.2], [0, 1.6, 0], [0, 2.4, 7.4], [0, 1.65, 0]);
      studio(ctx, W, H_, E, TG, (S) => {
        const nm = 7, ns = 3; // 100% and 44%
        for (let i = 0; i < nm; i++) { const st = a + 0.2 + i * 0.07, u = H.clamp((t - st) / 0.2); if (u > 0) S.brick(-1.4, i * 0.38, 0, 2, 2, P.blue, 0, (1 - H.ease.out(u)) * 1.6); }
        moon(S, [-1.4, nm * 0.38 + 0.45, 0], 0.4, t * 0.2, 2);
        for (let i = 0; i < ns; i++) { const st = V('suntide', 'but') + i * 0.1, u = H.clamp((t - st) / 0.2); if (u > 0) S.brick(1.4, i * 0.38, 0, 2, 2, P.orange, 0, (1 - H.ease.out(u)) * 1.6); }
        if (t > V('suntide', 'sun')) sun(S, [1.4, (t > V('suntide', 'but') + 0.4 ? ns : 0) * 0.38 + 0.45, 0], 0.4, t * 0.2, 2);
        S.tag(-1.4, 0.25, 1.4, '100%', popU(t, a + 0.6), -0.05, P.blue, 0.7);
        S.tag(1.4, 0.25, 1.4, '44%', popU(t, V('suntide', 'half')), 0.05, P.orange, 0.6);
      });
    },
    shrink(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [-0.3, 2.1, 7.6], [0, 0.6, 0], [-0.2, 1.9, 6.8], [0, 0.65, 0]);
      const S = Scene(E, TG, W, H_), amp = H.lerp(0.26, 0.11, ramp(t, V('shrink', 'shrink'), 1.2)), lvl = amp * Math.sin((t - a) * 1.6);
      for (const [x, s] of [[-2.2, 1], [2.4, -1]]) { const z = 0.5 + (s * amp) / 0.18; S.box((p) => add(p, [x, 0.25 + (z - 0.5) * 0.18, z]), 0.04, 0.3, 0.04, P.white, { bevel: 0.3 }); S.box((p) => add(p, [x + 0.16, 0.48 + (z - 0.5) * 0.18, z]), 0.14, 0.09, 0.02, s > 0 ? P.green : P.orange, { bevel: 0.3 }); }
      S.tag(0, 1.3, 2.4, 'less than half', popU(t, V('shrink', 'half')), -0.05, P.orange, 1.35);
      beachSet(ctx, W, H_, S, t, lvl); S.render(ctx, W, H_, {});
    },
    pools(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0, 3.0, 6.4], [0, 0.4, 0.6], [0, 2.7, 5.8], [0, 0.45, 0.6]);
      const S = Scene(E, TG, W, H_);
      const rr = H.rng(3); for (let i = 0; i < 12; i++) { const a2 = (i / 12) * TAU; S.box((p) => add(rotY(p, a2), [Math.cos(a2) * 1.5, 0.12 + (0.4 + 0.5 - 0.5) * 0.18, 0.9 + Math.sin(a2) * 0.9]), 0.28 + rr() * 0.1, 0.22 + rr() * 0.1, 0.24, [140 + (i % 3) * 14, 140 + (i % 3) * 14, 150], { bevel: 0.35 }); }
      const cx = -0.3 + Math.sin(t * 1.2) * 0.2;
      S.box((p) => add(p, [cx, 0.2, 1.0]), 0.18, 0.08, 0.13, P.orange, { bevel: 0.4 }); for (const s of [-1, 1]) S.box((p) => add(rotZ(p, s * 0.5), [cx + s * 0.26, 0.24, 1.08]), 0.08, 0.05, 0.06, P.orange, { bevel: 0.4 });
      for (let k = 0; k < 5; k++) { const a2 = (k / 5) * TAU + 0.3; S.box((p) => add(rotY(p, -a2), [0.6 + Math.cos(a2) * 0.14, 0.14, 0.7 + Math.sin(a2) * 0.14]), 0.12, 0.03, 0.04, P.yellow, { bevel: 0.4 }); }
      brickX(S, 0, 1.5, 1.0, H.clamp((t - V('pools', 'serious')) / 0.22), 1.3);
      const B2 = beachSet(ctx, W, H_, S, t, -0.2);
      const pts = ringPts(S, [0, 0.12, 0.9], 1.3, 30); ctx.save(); ctx.fillStyle = 'rgba(60,150,220,0.85)'; ctx.beginPath(); pts.forEach(([x, y2], i) => (i ? ctx.lineTo(x, y2) : ctx.moveTo(x, y2))); ctx.closePath(); ctx.fill(); ctx.restore();
      S.render(ctx, W, H_, {});
      return B2;
    },
    night(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 8.0], [0, 1.15, 0], [0.1, 2.0, 7.2], [0, 1.2, 0]);
      const wx = -2.6 + (t - a) * 0.55;
      lawn(ctx, W, H_, t, E, TG, (S) => { fig(S, wx, 0.6, 0.95, 1.3, { walk: t * 7, shirt: P.blue, hat: 'cap', hatCol: P.red }); }, 0.8, 1);
    },
    dark(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.1, 2.0, 7.2], [0, 1.2, 0], [0.05, 1.9, 6.6], [0, 1.2, 0]);
      const k = ramp(t, V('dark', 'without'), 1.2), wx = 0.4;
      lawn(ctx, W, H_, t, E, TG, (S) => { fig(S, wx, 0.6, 0.95, 0.4, { shirt: P.blue, hat: 'cap', hatCol: P.red, mouth: k > 0.6 ? 'o' : null, arms: [0.15 + k * 0.6, 0.15 + k * 0.6] }); }, H.lerp(0.8, 0.95, k), 1 - k);
    },
    coral(ctx, W, H_, t, a, b) { SHOT._reef(ctx, W, H_, t, a, b, false); },
    lost(ctx, W, H_, t, a, b) { SHOT._reef(ctx, W, H_, t, a, b, true); },
    _reef(ctx, W, H_, t, a, b, lost) {
      const [E, TG] = shotCam(t, a, b, [0.3, 2.0, 7.8], [0, 1.0, 0], [0.2, 1.9, 7.0], [0, 1.05, 0]);
      const S = Scene(E, TG, W, H_);
      [[-2.6, -0.6, P.red], [-1.2, 0.4, [240, 120, 170]], [0.2, -0.4, P.orange], [1.6, 0.5, [190, 110, 230]], [2.9, -0.5, P.yellow]].forEach(([x, z, col], i) => coral(S, x, z, 1.1, col, 30 + i));
      const te = lost ? a + 0.3 : V('coral', 'release'), rr = H.rng(lost ? 77 : 7);
      for (let i = 0; i < (lost ? 9 : 40); i++) { const x0 = rr.range(-3, 3.2), d = lost ? rr.range(0, 4) : rr.range(0, 0.6), u = t - te - d; if (u < 0) continue; const yy = 0.9 + u * 0.55; if (yy > 4.2) continue; S.box((p) => add(p, [x0 + Math.sin(u * 2 + i) * 0.15, yy, rr.range(-0.6, 0.8)]), 0.06, 0.06, 0.06, [255, 160, 190], { bevel: 0.45 }); }
      if (lost) brickX(S, 0.2, 2.2, 0.8, H.clamp((t - V('lost', 'apart')) / 0.22), 1.3);
      reefSet(ctx, W, H_, S, t); skyMoon(ctx, W * 0.78, H_ * 0.12, 46, lost ? 0 : 0.55); S.render(ctx, W, H_, REEF_ENV);
      if (lost) nightGrade(ctx, W, H_, 0.45, false);
    },
    _eclipseScene(ctx, W, H_, t, a, b, mx) {
      const [E, TG] = shotCam(t, a, b, [0, 2.0, 11.5], [0, 1.4, 0], [0, 1.9, 10.6], [0, 1.4, 0]);
      return space(ctx, W, H_, t, E, TG, (S) => { sun(S, [-5.2, 1.4, -1.5], 2.4, t * 0.05, 4); moon(S, [mx, 1.4, 0], 0.32, 0, 2); earth(S, [3.9, 1.4, 0.5], 0.85, SP(t), 0, 3); }, 0.15);
    },
    eclipse(ctx, W, H_, t, a, b) {
      const mx = H.lerp(1.2, 0.9, ramp(t, a, 1.5));
      const S = SHOT._eclipseScene(ctx, W, H_, t, a, b, mx);
      const pm = S.proj([mx, 1.4, 0]), pe = S.proj([3.9, 1.4, 0.5]); ctx.save(); ctx.fillStyle = 'rgba(0,0,10,0.35)'; ctx.beginPath(); ctx.moveTo(pm[0], pm[1] - 30); ctx.lineTo(pe[0], pe[1] - 6); ctx.lineTo(pe[0], pe[1] + 6); ctx.lineTo(pm[0], pm[1] + 30); ctx.closePath(); ctx.fill(); ctx.restore();
    },
    ratio(ctx, W, H_, t, a, b) {
      const S = SHOT._eclipseScene(ctx, W, H_, t, a, b, 0.9);

      const T2 = Scene(S.E, [S.TG[0], S.TG[1] - 0.15, S.TG[2]], W, H_);
      T2.tag(-5.2, -1.45, 0.4, '400× wider', popU(t, V('ratio', 'four')), -0.04, P.red, 1.15);
      T2.tag(2.4, -0.45, 1.2, '400× farther', popU(t, V('ratio', 'four', 2)), 0.04, P.red, 1.25);
      T2.render(ctx, W, H_, { shadows: false });
      SHOT._inset(ctx, W, H_, t, popU(t, V('ratio', 'perfectly'), 0.4), 1);
    },
    _inset(ctx, W, H_, t, u, cover, x = W - 230, y2 = 290) { // a round "view from Earth" sticker: the Sun and the Moon's disc
      if (u <= 0) return; ctx.save(); ctx.translate(x, y2); ctx.scale(u, u);
      ctx.fillStyle = '#0b1230'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.fill(); ctx.stroke();
      const gg = ctx.createRadialGradient(0, 0, 60, 0, 0, 150); gg.addColorStop(0, 'rgba(255,240,200,0.95)'); gg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, 150, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffcf3a'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.fill();
      ctx.fillStyle = '#14141c'; ctx.beginPath(); ctx.arc(0, 0, 70 * cover + 0.5, 0, TAU); ctx.fill();
      ctx.font = FONT(800, 30); ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('from Earth', 0, 128);
      ctx.restore();
    },
    never(ctx, W, H_, t, a, b) {
      const tf = V('never', "it's"), d = ramp(t, tf, 2.5), mx = H.lerp(0.9, 2.2, d);
      const S = SHOT._eclipseScene(ctx, W, H_, t, a, b, mx);
      const xs = Scene(S.E, [S.TG[0], S.TG[1] - 0.15, S.TG[2]], W, H_);
      brickX(xs, -1.6, 3.2, 1.0, H.clamp((t - V('never', 'ever')) / 0.22) * (t < V('never', 'funny') ? 1 : 0), 1.2);
      xs.tag(0, -0.6, 1.4, '~600 million years', popU(t, V('never', 'six')), -0.04, P.red, 1.7);
      xs.render(ctx, W, H_, { shadows: false });
      SHOT._inset(ctx, W, H_, t, 1, H.lerp(1, 0.8, d));
    },
    _spinEarth(ctx, W, H_, t, a, b, brake, spinRate) {
      const [E, TG] = shotCam(t, a, b, [0, 2.0, 8.0], [0, 1.4, 0], [0, 1.9, 7.2], [0, 1.4, 0]);
      const S = space(ctx, W, H_, t, E, TG, (S) => {
        earth(S, [-0.4, 1.4, 0], 1.3, t * spinRate, 0, 5);
        const by = 1.4, bx = (1 - brake) * 1.6;
        S.box((p) => add(p, [1.0 + bx, by, 0]), 0.12, 0.35, 0.3, P.red, { bevel: 0.3 }); S.box((p) => add(p, [1.5 + bx, by, 0]), 0.42, 0.08, 0.08, P.dark, { bevel: 0.3 }); S.box((p) => add(p, [1.9 + bx, by - 0.35, 0]), 0.08, 0.4, 0.08, P.dark, { bevel: 0.3 });
        if (brake > 0.9) { const r2 = H.rng(Math.floor(t * 12)); for (let i = 0; i < 6; i++) { const u = r2(); S.box((p) => add(p, [0.9 + u * 0.4, 1.4 + (r2() - 0.5) * 0.6, 0.4 + u * 0.8]), 0.04, 0.04, 0.04, P.yellow, { bevel: 0.4 }); } }
      });
      return S;
    },
    brake(ctx, W, H_, t, a, b) { SHOT._spinEarth(ctx, W, H_, t, a, b, ramp(t, V('brake', 'brake'), 0.4), 1.2 - 0.5 * ramp(t, V('brake', 'brake'), 2)); },
    ms(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0, 2.4, 7.6], [0, 1.6, 0], [0, 2.3, 6.9], [0, 1.6, 0]);
      studio(ctx, W, H_, E, TG, (S) => {
        S.box((p) => add(p, [0, 0.9, 0]), 0.12, 0.9, 0.12, P.dark, { bevel: 0.3 });
        S.box((p) => add(p, [0, 2.2, 0.1]), 0.95, 0.95, 0.12, P.red, { bevel: 0.2, paint: clockFace((t - a) * 1.2) });
        fig(S, -2.2, 0.8, 0.95, 0.5, { shirt: P.teal, hat: 'hard', arms: [0.15, 1.2] });
        S.tag(2.2, 1.4, 0.8, '+0.0017 s', popU(t, V('ms', 'less')), 0.05, P.red, 1.0);
        S.tag(2.2, 0.55, 0.8, 'per century', popU(t, V('ms', 'second')), -0.04, P.orange, 1.0);
      });
    },
    fossil(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 7.6], [0, 1.3, 0], [0.1, 2.2, 6.9], [0, 1.35, 0]);
      const u = H.clamp((t - V('fossil', 'a')) / 1.5), days = Math.round(365 + 20 * H.ease.out(u));
      lawn(ctx, W, H_, t, E, TG, (S) => {
        for (let i = 0; i < 9; i++) S.cyl((p) => add(p, [-1.6, i * 0.2, 0]), 0.7 - Math.abs(i - 4) * 0.04, 0.2, i % 2 ? [200, 170, 120] : [150, 116, 80], 18);
        S.box((p) => add(p, [1.6, 1.0, 0.2]), 0.85, 0.85, 0.2, P.white, { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#e2402c'; c.fillRect(0, 0, w, h * 0.24); c.fillStyle = '#fff'; c.font = FONT(800, h * 0.14); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('1 YEAR', w / 2, h * 0.13); c.fillStyle = '#2a2a33'; c.font = FONT(800, h * 0.36); c.fillText(String(days), w / 2, h * 0.56); c.font = FONT(600, h * 0.12); c.fillText('days', w / 2, h * 0.84); } });
        S.tag(-1.6, 2.45, 0.6, '350 million yrs ago', popU(t, V('fossil', 'three')), -0.04, P.red, 1.5);
      });
    },
    nobrake(ctx, W, H_, t, a, b) {
      const S = SHOT._spinEarth(ctx, W, H_, t, a, b, 1 - ramp(t, V('nobrake', 'weaker'), 0.6), 0.7);
      const T2 = Scene(S.E, [S.TG[0], S.TG[1] - 0.15, S.TG[2]], W, H_);
      T2.tag(-0.4, -0.3, 1.2, '24 h', popU(t, V('nobrake', 'same')), -0.04, P.green, 0.6);
      T2.render(ctx, W, H_, { shadows: false });
    },
    _tiltScene(ctx, W, H_, t, a, b, tilt, withMoon) {
      const [E, TG] = shotCam(t, a, b, [0, 2.2, 9.4], [0.4, 1.4, 0], [0, 2.1, 8.6], [0.4, 1.4, 0]);
      const ec = [1.6, 1.4, 0];
      return space(ctx, W, H_, t, E, TG, (S) => {
        sun(S, [-5.4, 1.4, -2.5], 1.8, t * 0.05, 4);
        earth(S, ec, 1.2, SP(t), tilt, 5);
        S.box((p) => add(rotZ(p, tilt), ec), 0.035, 1.9, 0.035, P.white, { bevel: 0.3 });
        if (withMoon > 0) { const th = t * 0.9; moon(S, add(ec, [Math.cos(th) * 3.0, 0, Math.sin(th) * 1.6]), 0.3 * withMoon, 0, 2); }
      }, 0.12);
    },
    tilt(ctx, W, H_, t, a, b) {
      const S = SHOT._tiltScene(ctx, W, H_, t, a, b, 0.41, 0);
      const T2 = Scene(S.E, [S.TG[0], S.TG[1] - 0.15, S.TG[2]], W, H_); T2.tag(3.5, 3.0, 0.4, '23.5°', popU(t, V('tilt', 'about')), 0.05, P.red, 0.6); T2.render(ctx, W, H_, { shadows: false });
      const p0 = S.proj([1.6, 3.4, 0]); ctx.save(); ctx.setLineDash([12, 10]); ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p0[0], p0[1] + 380); ctx.stroke(); ctx.restore();
    },
    steady(ctx, W, H_, t, a, b) { SHOT._tiltScene(ctx, W, H_, t, a, b, 0.41 + Math.sin(t * 2) * 0.01, popU(t, a + 0.1)); const S = Scene([0, 2, 8], [0, 1.3, 0], W, H_); brickTick(S, -2.6, 3.0, 0.5, popU(t, V('steady', 'steady')), 1.2); S.render(ctx, W, H_, { shadows: false }); },
    wander(ctx, W, H_, t, a, b) {
      const amp = 0.17 * ramp(t, V('wander', 'wander'), 0.8) + 0.45 * ramp(t, V('wander', 'older'), 0.8);
      const S = SHOT._tiltScene(ctx, W, H_, t, a, b, 0.41 + amp * Math.sin((t - a) * 1.8), 0);
      const T2 = Scene(S.E, [S.TG[0], S.TG[1] - 0.15, S.TG[2]], W, H_);
      T2.tag(4.2, 2.9, 0.4, '~10°', popU(t, V('wander', 'ten')) * (t < V('wander', 'older') ? 1 : 0), 0.05, P.orange, 0.5);
      T2.tag(4.2, 2.9, 0.4, 'much more?', popU(t, V('wander', 'much')), 0.05, P.red, 1.1);
      T2.render(ctx, W, H_, { shadows: false });
    },
    seasons(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 8.0], [0, 1.3, 0], [0.1, 2.2, 7.2], [0, 1.35, 0]);
      const cyc = [[76, 176, 72], [242, 132, 46], [244, 244, 240], [140, 210, 110]], ph = (t - a) * 0.8;
      const col = H.mix(cyc[Math.floor(ph) % 4], cyc[(Math.floor(ph) + 1) % 4], H.ease.inOut(ph % 1));
      lawn(ctx, W, H_, t, E, TG, (S) => {
        [-2.6, -0.2, 2.4].forEach((x, i) => { S.box((p) => add(p, [x, 0.5, -0.4 + i * 0.2]), 0.12, 0.5, 0.12, [130, 86, 50], { bevel: 0.3 }); S.box((p) => add(p, [x, 1.35, -0.4 + i * 0.2]), 0.55, 0.45, 0.55, col, { bevel: 0.25 }); S.box((p) => add(p, [x, 1.95, -0.4 + i * 0.2]), 0.35, 0.22, 0.35, col, { bevel: 0.3 }); });
        fig(S, 1.0, 1.4, 0.85, -0.3, { shirt: P.red, hat: 'cap', arms: [0.15, 0.15] });
      });
    },
    survive(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.2, 2.2, 7.8], [0, 1.2, 0], [0.1, 2.0, 7.0], [0, 1.25, 0]);
      const ty = V('survive', 'yes'), j = t > ty && t < ty + 1.2 ? Math.max(0, Math.sin((t - ty) * 7)) * 0.4 : 0;
      lawn(ctx, W, H_, t, E, TG, (S) => { fig(S, -0.6, 0.8, 1, 0.3, { shirt: P.orange, arms: t > ty ? [2.5, 2.5] : [0.15, 0.15], bob: j }); brickTick(S, 1.6, 2.4, 0.5, popU(t, ty), 1.3); confetti(S, t, ty + 0.1, -0.6, 1.0, 16, 4); });
    },
    world(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.2, 2.1, 7.6], [0, 1.1, 0], [0.1, 2.0, 6.9], [0, 1.15, 0]);
      lawn(ctx, W, H_, t, E, TG, (S) => { fig(S, -0.7, 0.8, 0.95, 0.3, { shirt: P.orange }); fig(S, 0.7, 0.8, 0.9, -0.3, { shirt: P.blue, hat: null }); }, 0.93, 0);
    },
    wave(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0.3, 2.1, 7.6], [0, 1.15, 0], [0.2, 2.0, 6.9], [0, 1.2, 0]);
      lawn(ctx, W, H_, t, E, TG, (S) => { fig(S, -0.7, 0.8, 0.95, 0.5, { shirt: P.orange, arms: [0.15, 2.3 + Math.sin(t * 9) * 0.35 * (t > V('wave', 'wave') ? 1 : 0)] }); fig(S, 0.7, 0.8, 0.9, 0.3, { shirt: P.blue, hat: null, arms: [0.15, 2.2 + Math.sin(t * 8 + 1) * 0.3 * (t > V('wave', 'wave') ? 1 : 0)] }); }, 0.8, popU(t, a + 0.2, 0.6));
    },
    next(ctx, W, H_, t, a, b) {
      const [E, TG] = shotCam(t, a, b, [0, 2.3, 7.8], [0, 1.3, 0], [0, 2.1, 7.0], [0, 1.35, 0]);
      studio(ctx, W, H_, E, TG, (S) => {
        fig(S, -1.4, 0.6, 1, 0.4, { shirt: P.orange, arms: [0.15, 2.4] }); fig(S, 1.4, 0.6, 1, -0.4, { shirt: P.blue, hat: 'hard', arms: [2.4, 0.15] });
        S.tag(0, 2.6, 0.6, '?', popU(t, V('next', 'next')), 0.12, P.yellow, 0.35);
        const nb = Math.floor(H.clamp((t - a) / 2.5) * 7); for (let i = 0; i < nb; i++) S.brick(-1.0 + i * 0.33, 0, 1.6, 1, 1, [P.red, P.yellow, P.blue, P.green][i % 4], 0, 0);
        confetti(S, t, V('next', 'comments'), 0, 1.2, 18, 9);
      });
    },
  };

  const CHAPTER_CARDS = CHAPTERS.slice(1).map((c) => c.t);
  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    SHOT[name](ctx, W, H_, t, a, b);
    caps(ctx, W, t, a, b);
    // chapter title card: a plastic plate in the lower-left corner for 2.5 s at each chapter start
    const ch = CHAPTERS.findIndex((c, i) => i > 0 && t >= c.t - 0.2 && t < c.t + 2.6);
    if (ch > 0) { const u = H.clamp((t - CHAPTERS[ch].t + 0.2) / 0.3) * (1 - H.clamp((t - CHAPTERS[ch].t - 2.2) / 0.4));
      ctx.save(); ctx.globalAlpha = u; ctx.translate(60 - (1 - u) * 80, H_ - 150); ctx.font = FONT(800, 44); const wd = ctx.measureText(CHAPTERS[ch].title).width + 70;
      ctx.fillStyle = '#e2402c'; ctx.beginPath(); ctx.roundRect(0, 0, wd, 84, 18); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0, 70, wd, 14);
      ctx.fillStyle = '#fffaf3'; ctx.textBaseline = 'middle'; ctx.fillText(CHAPTERS[ch].title, 35, 42); ctx.restore(); }
    const flash = 0.18 * Math.max(...CHAPTER_CARDS.map((c) => Math.exp(-Math.pow((t - c) * 6, 2))), Math.exp(-Math.pow((t - V('gone', 'gone')) * 6, 2)), Math.exp(-Math.pow((t - V('pools', 'serious')) * 6, 2)));
    finish(ctx, W, H_, t, flash);
  };

  // ---- the YouTube thumbnail (1280x720): Earth, the Moon fading away, a big question ----
  const THUMB = (ctx, W, H_) => { // drawn at 1920x1080; saved as 1280x720
    const S = Scene([0, 1.6, 7.2], [0.8, 1.2, 0], W, H_);
    earth(S, [-2.1, 1.2, 0], 1.7, 0.6, 0.35, 5); moon(S, [1.6, 0.25, 0.6], 0.6, 0.3, 3);
    spaceSet(ctx, W, H_, 0); S.render(ctx, W, H_, SPACE_ENV);
    const pm = S.proj([1.6, 0.25, 0.6]); ctx.save(); ctx.setLineDash([24, 20]); ctx.strokeStyle = '#ff5a4a'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(pm[0], pm[1], 190, 0, TAU); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.font = FONT(800, 142); ctx.textAlign = 'right'; ctx.lineJoin = 'round'; ctx.lineWidth = 24; ctx.strokeStyle = '#141c30';
    [['WHAT IF THE', '#ffffff', 190], ['MOON', '#ffe04a', 350], ['DISAPPEARED?', '#ffffff', 510]].forEach(([s2, c, yy]) => { ctx.strokeText(s2, W - 60, yy); ctx.fillStyle = c; ctx.fillText(s2, W - 60, yy); });
    ctx.restore(); finish(ctx, W, H_, 0.5, 0);
  };

  // ==================== sound ====================
  function scoreSound(k) {
    const fx = SFX(k);
    SH.slice(1).forEach(([, s]) => fx.cut(s));
    CAPS.forEach(([t, lines]) => fx.words(t, lines.flat().length, 0.12));
    CHAPTER_CARDS.forEach((c) => { k.play('roller', c - 0.25, { dur: 0.35, gain: 0.35 }); k.play('pop', c, { f: 520, gain: 0.5 }); });
    const pop = (t, f = 640) => k.play('pop', t, { f, gain: 0.55 });
    pop(V('hook', 'disappeared'), 700);
    k.play('sparkle', V('gone', 'gone'), { gain: 0.5 }); k.play('thud', V('gone', 'gone'), { f: 90, gain: 0.4 });
    pop(V('notice', 'notice')); for (let i = 0; i < 6; i++) fx.seat(V('notice', 'brick') + i * 0.15 + 0.2, 0.6);
    pop(V('size', 'three')); pop(V('size', 'roughly'), 560); k.play('ding', V('size', 'fifth'), { f: 'E6', gain: 0.4 });
    for (let i = 0; i < 30; i++) fx.clack(V('dist', 'about') + (i / 30) * 2.2, 0.35);
    for (let f = 0; f < 22; f++) k.play('count', V('dist', 'about') + f * 0.1, { gain: 0.5, minor: true });
    PLANETS.forEach((_, i) => k.play('pop', V('planets', 'line') + i * 0.38, { f: 500 + i * 70, gain: 0.5 })); k.play('success', V('planets', 'inside'), { f: 'C6', gain: 0.5 });
    pop(V('drift', 'three')); k.play('roller', V('drift', 'and'), { dur: 1.2, gain: 0.2 });
    k.play('thud', V('vanish', 'vanishes'), { f: 80, gain: 0.5 }); k.play('riser', V('vanish', 'well'), { dur: 1.3, gain: 0.3 }); pop(V('vanish', 'over'));
    pop(V('balance', 'about'), 560); k.play('tock', V('stop', 'stops'), { f: 420, gain: 0.5 }); k.play('success', V('stop', 'before'), { f: 'C6', gain: 0.45 });
    pop(V('beach', 'sixteen')); k.noise(V('beach', 'the'), { dur: 3, color: 'pink', filter: 'lowpass', f: 900, gain: 0.06, a: 0.8 });
    pop(V('bulge', 'high')); pop(V('bulge', 'high') + 0.1, 700); pop(V('bulge', 'low'), 520);
    for (let i = 0; i < 9; i++) fx.seat(B('suntide') + 0.3 + i * 0.07, 0.45); for (let i = 0; i < 4; i++) fx.seat(V('suntide', 'but') + 0.2 + i * 0.1, 0.5); pop(V('suntide', 'half'));
    pop(V('shrink', 'half'), 520);
    k.play('slap', V('pools', 'serious') + 0.12, { gain: 0.7 }); k.play('thud', V('pools', 'serious') + 0.12, { f: 110, gain: 0.6 }); k.play('buzz', V('pools', 'serious') + 0.15, { f: 98, dur: 0.35, gain: 0.6 });
    for (let i = 0; i < 12; i++) k.play('tock', B('night') + 0.3 + i * 0.45, { f: 300, gain: 0.2, minor: true });
    k.tone(V('dark', 'without'), { f: [[0, 300], [1.2, 150]], type: 'triangle', dur: 1.3, gain: 0.12, filter: 'lowpass', f2: 900 });
    k.play('sparkle', V('coral', 'release'), { gain: 0.5, n: 10 });
    k.play('slap', V('lost', 'apart') + 0.12, { gain: 0.6 }); k.play('buzz', V('lost', 'apart') + 0.15, { f: 98, dur: 0.3, gain: 0.5 });
    pop(V('ratio', 'four')); pop(V('ratio', 'four', 2), 560); k.play('ding', V('ratio', 'perfectly'), { f: 'G5', gain: 0.45 });
    k.play('slap', V('never', 'ever') + 0.12, { gain: 0.6 }); k.play('thud', V('never', 'ever') + 0.12, { f: 110, gain: 0.5 }); pop(V('never', 'six'));
    k.noise(V('brake', 'brake'), { dur: 1.4, filter: 'bandpass', f: 1800, q: 2, gain: 0.12, a: 0.05 }); k.play('thud', V('brake', 'brake'), { f: 140, gain: 0.4 });
    for (let i = 0; i < 10; i++) k.play('tick', B('ms') + 0.3 + i * 0.5, { f: 2400, gain: 0.25, minor: true }); pop(V('ms', 'less')); pop(V('ms', 'second'), 520);
    pop(V('fossil', 'three')); for (let f = 0; f < 20; f++) k.play('count', V('fossil', 'a') + f * 0.075, { gain: 0.5, minor: true });
    k.play('roller', V('nobrake', 'weaker'), { dur: 0.6, gain: 0.3 }); k.play('success', V('nobrake', 'same'), { f: 'C6', gain: 0.45 });
    pop(V('tilt', 'about')); k.play('success', V('steady', 'steady'), { f: 'E6', gain: 0.45 }); pop(V('wander', 'ten')); k.play('buzz', V('wander', 'much'), { f: 120, dur: 0.25, gain: 0.35 }); pop(V('wander', 'much'), 520);
    k.play('jump', V('survive', 'yes'), { gain: 0.6 }); k.play('success', V('survive', 'yes'), { f: 'C6', gain: 0.6 }); for (let i = 0; i < 14; i++) fx.clack(V('survive', 'yes') + 0.5 + i * 0.05, 0.3, (i % 5 - 2) * 0.25);
    k.play('sparkle', V('wave', 'wave'), { gain: 0.45 });
    pop(V('next', 'next')); ['C5', 'E5', 'G5', 'C6'].forEach((f, i) => k.play('ding', V('next', 'comments') + i * 0.08, { f, gain: 0.42 - i * 0.04 })); for (let i = 0; i < 14; i++) fx.clack(V('next', 'comments') + 0.4 + i * 0.05, 0.3, (i % 5 - 2) * 0.25);
  }

  window.LESSON = { DURATION, CHAPTERS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t), thumbnail: THUMB };
  window.scoreSound = scoreSound;
