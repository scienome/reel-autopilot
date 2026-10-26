  // ==================== 0001 "Anything is fine." : a sarcastic couple reel ====================
  const BEATS = window.SCRIPT;
  const { V, DURATION } = REEL_TIMING(BEATS);
  // shots: [name, start]
  const SH = [
    ['hook', 0], ['ask', V('ask', 'you') - 0.15], ['she', V('she', 'and') - 0.15], ['pizza', V('pizza', 'pizza') - 0.15], ['burger', V('burger', 'burgers') - 0.15],
    ['sushi', V('sushi', 'sushi') - 0.15], ['weeks', V('sushi', 'three') - 0.15], ['fault', V('fault', 'so') - 0.15], ['bell', V('bell', 'then') - 0.15],
    ['fav', V('fav', 'because') - 0.15], ['listen', V('listen', 'wow') - 0.15],
  ];
  const shotAt = makeShotAt(SH, DURATION);

  // caption chunks (two to five words), each timed from its first word; key words marked with true
  const CAPS = [
    [V('hook', 'has'), [['HAS', 'THIS', 'EVER'], [K('HAPPENED'), 'TO', 'YOU?']]],
    [V('ask', 'you'), [['YOU', 'ASK', 'ONE'], [K('SIMPLE'), 'QUESTION.']]],
    [V('ask', 'where'), [['"WHERE', 'DO', 'YOU'], ['WANNA', K('EAT?"')]]],
    [V('she', 'and'), [['AND', 'SHE', 'SAYS...']]],
    [V('she', 'i'), [['"I', "DON'T", K('CARE.')]]],
    [V('she', 'anything'), [[K('ANYTHING')], ['IS', 'FINE."']]],
    [V('pizza', 'pizza'), [[K('PIZZA?')]]],
    [V('pizza', 'too'), [['"TOO', K('GREASY."')]]],
    [V('burger', 'burgers'), [[K('BURGERS?')]]],
    [V('burger', 'seriously'), [[K('"SERIOUSLY?"')]]],
    [V('sushi', 'sushi'), [[K('SUSHI?')]]],
    [V('sushi', 'we'), [['"WE', 'LITERALLY', 'JUST'], ['HAD', K('SUSHI."')]]],
    [V('sushi', 'three'), [['THREE', K('WEEKS')], ['AGO.']]],
    [V('fault', 'so'), [['SO', 'NOW', "YOU'RE"], [K('STARVING...')]]],
    [V('fault', 'and'), [['AND', 'SOMEHOW'], ["IT'S", 'YOUR', K('FAULT.')]]],
    [V('bell', 'then'), [['THEN...', 'THE'], [K('DOORBELL'), 'RINGS.']]],
    [V('fav', 'because'), [['BECAUSE', 'YOU']]],
    [V('fav', 'already'), [['ALREADY', 'ORDERED'], ['HER', K('FAVORITE.')]]],
    [V('fav', 'pizza'), [[K('PIZZA.')]]],
    [V('listen', 'wow'), [['"WOW.', 'YOU'], ['ACTUALLY', K('LISTEN?"')]]],
    [V('listen', 'shocking'), [['"SHOCKING,'], [K('RIGHT?"')]]],
  ];
  const caps = makeCaps(CAPS);

  // the boy showing his phone to the camera (food app open)
  const phoneShot = (ctx, W, H_, t, a, b, kind, xT, E0, E1) => {
    const [E, TG] = shotCam(t, a, b, E0, [-0.32, 1.32, -0.3], E1, [-0.32, 1.34, -0.3]);
    const S = Scene(E, TG, W, H_); livingRoom(S, { table: true });
    const bd = BOY(S, { arms: [[0.35, 0.18, 0.7], [0.95, 0.12, 1.15]], head: { yaw: 0.45, pitch: -0.05 }, face: { eyes: 'open', look: [0.6, 0], mouth: 'smile', brows: 0.35 } });
    GIRL(S, { arms: [[0.8, 0.1, 1.0], [0.8, 0.1, 1.0]], head: { yaw: -0.15, pitch: -0.3 }, face: { eyes: 'open', look: [0, -0.6], lids: 0.4, mouth: 'flat' } });
    const pc = add(bd.hands[1].p, [0.02, 0.15, 0.06]); phone(S, pc, 0.05, 1.9, foodScreen(kind));
    S.render(ctx, W, H_, { dof: 0.3 });
    const pp = S.proj(pc); FX.ring(ctx, pp[0], pp[1], 118, '#ec3a32', H.clamp((t - xT) / 0.45), 'x');
    return pp;
  };

  const STORY = (ctx, W, H_, t) => {
    const [name, a, b] = shotAt(t);
    let flash = 0;
    if (name === 'hook') { // wide: she is on her phone, he looks over
      const [E, TG] = shotCam(t, a, b, [0.25, 1.55, 3.9], [0, 1.0, -0.35], [0.12, 1.5, 3.4], [0, 1.03, -0.35]);
      const S = Scene(E, TG, W, H_); livingRoom(S, { table: true });
      BOY(S, { face: { eyes: 'open', look: [0.6, -0.1], mouth: 'smile' }, head: { yaw: 0.4 } });
      const g = GIRL(S, { arms: [[0.8, 0.1, 1.0], [0.8, 0.1, 1.0]], head: { yaw: -0.1, pitch: -0.3 }, face: { eyes: 'open', look: [0, -0.6], mouth: 'flat' } });
      phone(S, add(midHands(g), [0, 0.05, 0.02]), -0.2, 1.1);
      remote(S, [-0.5, 0.42, 1.25], [1, 0, 0.3], 1.2);
      S.render(ctx, W, H_, { dof: 0.3 });
    } else if (name === 'ask') { // close-up: he asks, hopeful
      const [E, TG] = shotCam(t, a, b, [-0.78, 1.62, 1.15], [-0.62, 1.58, -0.42], [-0.74, 1.62, 0.92], [-0.62, 1.58, -0.42]);
      const S = Scene(E, TG, W, H_); livingRoom(S);
      const g = ramp(t, V('ask', 'where'), 0.3);
      const bd = BOY(S, { arms: [[0.35, 0.18, 0.7], [0.5 + 0.6 * g, 0.15 + 0.2 * g, 0.9 + 0.5 * g]], head: { yaw: 0.25 + 0.25 * g, tilt: -0.08 * g }, face: { eyes: 'open', look: [0.3 + 0.4 * g, 0.05], mouth: g > 0.5 ? 'open' : 'smile', brows: 0.15 + 0.3 * g } });
      GIRL(S, { arms: [[0.8, 0.1, 1.0], [0.8, 0.1, 1.0]], head: { yaw: -0.1, pitch: -0.3 }, face: { eyes: 'open', look: [0, -0.6], mouth: 'flat' } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.head); FX.qmark(ctx, Math.min(W - 90, hp[0] + 200), hp[1] - 130, 0.9 * popU(t, V('ask', 'eat'), 0.3));
    } else if (name === 'she') { // close-up: eyes never leave the phone
      const [E, TG] = shotCam(t, a, b, [0.74, 1.6, 1.08], [0.62, 1.55, -0.42], [0.71, 1.6, 0.9], [0.62, 1.55, -0.42]);
      const S = Scene(E, TG, W, H_); livingRoom(S);
      const up = ramp(t, V('she', 'anything'), 0.25);
      BOY(S, { face: { eyes: 'open', look: [0.6, 0], mouth: 'smile' }, head: { yaw: 0.5 } });
      const g = GIRL(S, { arms: [[0.8, 0.1, 1.0], [0.8, 0.1, 1.0]], head: { yaw: -0.05, pitch: -0.28 }, face: { eyes: 'open', look: [-0.7 * up, -0.6 + 0.7 * up], lids: 0.45, mouth: 'flat', brows: -0.1 } });
      phone(S, add(midHands(g), [0, 0.05, 0.02]), -0.2, 1.1);
      S.render(ctx, W, H_, { dof: 0.22 });
    } else if (name === 'pizza') {
      phoneShot(ctx, W, H_, t, a, b, 'pizza', V('pizza', 'too'), [-0.42, 1.45, 1.75], [-0.4, 1.45, 1.55]);
    } else if (name === 'burger') { // her close-up: unimpressed
      const [E, TG] = shotCam(t, a, b, [0.74, 1.58, 1.2], [0.64, 1.56, -0.42], [0.72, 1.58, 1.02], [0.62, 1.58, -0.42]);
      const S = Scene(E, TG, W, H_); livingRoom(S);
      BOY(S, { face: { eyes: 'open', look: [0.6, 0], mouth: 'smile' }, head: { yaw: 0.5 } });
      const k = ramp(t, V('burger', 'seriously'), 0.2);
      GIRL(S, { arms: [[0.8, 0.1, 1.0], [0.8, 0.1, 1.0]], head: { yaw: -0.35, tilt: 0.14 * k, pitch: -0.05 }, face: { eyes: 'open', look: [-0.55, 0.05], lids: 0.5, mouth: k > 0.5 ? 'frown' : 'flat', brows: -0.55 * k } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const su = popU(t, V('burger', 'burgers'), 0.3); if (su > 0) { ctx.save(); ctx.translate(120, 930); ctx.scale(su, su); sticker(ctx, 0, 0, 82, 'burger'); ctx.restore(); }
      FX.ring(ctx, 120, 930, 96, '#ec3a32', H.clamp((t - V('burger', 'seriously')) / 0.45), 'x');
    } else if (name === 'sushi') {
      phoneShot(ctx, W, H_, t, a, b, 'sushi', V('sushi', 'had'), [-0.3, 1.42, 1.55], [-0.3, 1.42, 1.38]);
    } else if (name === 'weeks') { // him, deadpan, to camera
      const [E, TG] = shotCam(t, a, b, [-0.66, 1.62, 0.95], [-0.62, 1.6, -0.42], [-0.65, 1.62, 0.82], [-0.62, 1.6, -0.42]);
      const S = Scene(E, TG, W, H_); livingRoom(S);
      const bd = BOY(S, { yaw: 0.0, head: { yaw: 0, tilt: 0.06 }, face: { eyes: 'open', look: [0, 0], lids: 0.42, mouth: 'flat', brows: 0.3 } });
      S.render(ctx, W, H_, { dof: 0.22 });
      const hp = S.proj(bd.head); FX.sweat(ctx, hp[0] + 150, hp[1] - 150 + 30 * ramp(t, V('sushi', 'three') + 0.3, 1.0), 2.2 * popU(t, V('sushi', 'three'), 0.3));
    } else if (name === 'fault') { // wide: he slumps, she glares
      const [E, TG] = shotCam(t, a, b, [0.1, 1.5, 3.2], [0, 1.05, -0.35], [0.05, 1.48, 2.8], [0, 1.08, -0.35]);
      const S = Scene(E, TG, W, H_); livingRoom(S, { table: true });
      const gl = ramp(t, V('fault', 'somehow'), 0.25);
      const bd = BOY(S, { lean: -0.12, arms: [[0.7, 0.12, 1.5], [0.7, 0.12, 1.5]], head: { yaw: 0.1 + 0.3 * gl, pitch: -0.25 * (1 - gl) }, face: { eyes: gl > 0.5 ? 'wide' : 'open', look: [0.6 * gl, -0.3 * (1 - gl)], lids: gl > 0.5 ? 0 : 0.5, mouth: gl > 0.5 ? 'o' : 'frown', brows: 0.45 } });
      GIRL(S, { head: { yaw: 0.45 - 1.0 * gl, tilt: 0.1 }, face: { eyes: 'open', look: [-0.6 * gl, 0], lids: 0.35, mouth: 'flat', brows: -0.6 * gl } });
      S.render(ctx, W, H_, { dof: 0.3 });
      const hp = S.proj(bd.head); FX.qmark(ctx, hp[0] + 150, hp[1] - 110, 0.8 * popU(t, V('fault', 'fault'), 0.3), '?', -0.12);
      FX.sweat(ctx, hp[0] + 80, hp[1] - 60, 1.4 * popU(t, V('fault', 'starving'), 0.3));
    } else if (name === 'bell') { // both snap toward the door
      const [E, TG] = shotCam(t, a, b, [0.0, 1.55, 2.95], [0, 1.25, -0.4], [0.0, 1.55, 2.65], [0, 1.28, -0.4]);
      const S = Scene(E, TG, W, H_); livingRoom(S);
      const sn = ramp(t, V('bell', 'doorbell'), 0.15);
      BOY(S, { lean: -0.12 * (1 - sn), head: { yaw: 0.1 - 0.28 * sn, pitch: 0.05 * sn }, arms: [[0.7, 0.12, 1.5 - 1.0 * sn], [0.7, 0.12, 1.5 - 1.0 * sn]], face: { eyes: sn > 0.5 ? 'wide' : 'open', look: [0.2 * sn, 0.1 * sn], mouth: sn > 0.5 ? 'o' : 'frown', brows: 0.4 * sn } });
      GIRL(S, { head: { yaw: 0.45 - 0.25 * sn, pitch: 0.05 * sn }, face: { eyes: sn > 0.5 ? 'wide' : 'open', look: [-0.2 * sn, 0.1 * sn], mouth: sn > 0.5 ? 'o' : 'flat', brows: sn > 0.5 ? 0.3 : -0.4 } });
      S.render(ctx, W, H_, { dof: 0.28 });
      FX.speed(ctx, W, H_, W * 0.5, H_ * 0.52, H.clamp(1 - (t - V('bell', 'doorbell')) / 0.6) * (t >= V('bell', 'doorbell') ? 1 : 0), t);
      FX.buzz(ctx, W / 2, 470, 1.1, t >= V('bell', 'doorbell') ? 1 : 0);
    } else if (name === 'fav') { // the reveal: he already ordered it
      const [E, TG] = shotCam(t, a, b, [-0.62, 1.5, 1.75], [-0.62, 1.38, -0.42], [-0.62, 1.5, 1.5], [-0.62, 1.4, -0.42]);
      const S = Scene(E, TG, W, H_);
      const pz = t >= V('fav', 'pizza');
      const bd = BOY(S, { yaw: 0, arms: [[1.05, 0.05, 0.75], [1.05, 0.05, 0.75]], head: { yaw: 0, tilt: pz ? -0.12 : -0.05 }, face: { eyes: pz ? 'happy' : 'open', look: [0, 0], lids: pz ? 0 : 0.38, mouth: 'smile', brows: -0.2 } });
      const bc = add(midHands(bd), [0, 0.02, 0.1]);
      S.rbox((p) => add(rotX(p, -0.25), bc), 0.2, 0.2, 0.03, [201, 149, 90], { bevel: 0.3, bias: -0.3, paint: boxLid });
      const hp = S.proj(bd.head);
      FX.burst(ctx, W, H_, hp[0], hp[1], ramp(t, a + 0.05, 0.25), t);
      S.render(ctx, W, H_, { dof: 0, bg: 'rgba(0,0,0,0)' });
      const r = H.rng(9); for (let i = 0; i < 7; i++) { const u = popU(t, V('fav', 'pizza') + i * 0.08, 0.3); FX.sparkle(ctx, r.range(70, W - 70), r.range(380, 900), 28 * u * (0.8 + 0.4 * Math.sin(t * 6 + i)), t); }
      flash = 0.18 * Math.exp(-Math.pow((t - (a + 0.1)) * 7, 2)) + 0.22 * Math.exp(-Math.pow((t - V('fav', 'pizza')) * 7, 2));
    } else { // the closer: pizza on the table, hearts
      const [E, TG] = shotCam(t, a, b, [0.12, 1.5, 2.55], [0.02, 1.28, -0.4], [0.1, 1.5, 2.15], [0.02, 1.33, -0.4]);
      const S = Scene(E, TG, W, H_); livingRoom(S, { table: true });
      const sh = t >= V('listen', 'shocking');
      BOY(S, { head: { yaw: 0.35, tilt: sh ? -0.15 : 0 }, arms: [[0.35, 0.18, 0.7], [0.6, 0.5, 1.5]], face: { eyes: sh ? 'open' : 'open', look: [0.5, 0], lids: sh ? 0.4 : 0.2, mouth: 'smile', brows: sh ? -0.25 : 0, blush: sh ? 0.5 : 0 } });
      GIRL(S, { lean: 0.1, head: { yaw: -0.35, tilt: 0.25 }, face: { eyes: sh ? 'happy' : 'open', look: [-0.6, 0.05], mouth: 'smile', brows: sh ? 0 : 0.35, blush: 1 } });
      S.rbox((p) => add(p, [0.05, 0.42, 1.12]), 0.36, 0.025, 0.3, [201, 149, 90], { bevel: 0.3, bias: -0.3, topPaint: wholePizza });
      S.render(ctx, W, H_, { dof: 0.3 });
      for (let i = 0; i < 5; i++) { const st = V('listen', 'shocking') + 0.35 + i * 0.3, u = t - st; if (u < 0) continue; const s = 66 * popU(t, st, 0.4); FX.heart(ctx, W * 0.5 + Math.sin(u * 2 + i) * 50 + (i - 2) * 55, 640 - u * 120, s, Math.sin(u * 3 + i) * 0.2); }
    }
    caps(ctx, W, t, a, b);
    finish(ctx, W, H_, t, flash);
  };

  // ---- sound: light sitcom score, all times from BEATS ----
  function scoreSound(k) {
    const cut = (t) => k.play('whoosh', t - 0.06, { dur: 0.22, gain: 0.35, minor: true });
    const cap = (t) => k.play('pop', t, { f: 760, gain: 0.35, minor: true });
    const nope = (t) => { k.play('stroke', t, { material: 'marker', dur: 0.3, gain: 0.45 }); k.play('buzz', t + 0.3, { f: 110, dur: 0.3, gain: 0.55 }); k.play('thud', t + 0.28, { f: 120, gain: 0.45 }); };
    SH.slice(1).forEach(([, s]) => cut(s));
    CAPS.forEach(([t]) => cap(t));
    k.play('select', V('ask', 'eat'), { gain: 0.5 });
    k.tone(V('she', 'care'), { f: [[0, 300], [0.6, 170]], type: 'triangle', dur: 0.7, gain: 0.12, filter: 'lowpass', f2: 900 }); // the bored sigh
    k.play('tick', V('she', 'anything') + 0.05, { f: 5200, gain: 0.35 });
    nope(V('pizza', 'too')); nope(V('burger', 'seriously')); nope(V('sushi', 'had'));
    k.tone(V('sushi', 'three') + 0.05, { f: [[0, 900], [0.3, 500]], type: 'sine', dur: 0.35, gain: 0.1, minor: true }); // sweat drop
    k.tone(V('fault', 'starving'), { f: [[0, 70], [0.25, 95], [0.5, 60], [0.8, 85]], type: 'sawtooth', dur: 0.9, gain: 0.1, filter: 'lowpass', f2: 300 }); // stomach growl
    k.play('jump', V('fault', 'somehow'), { gain: 0.4 }); k.play('pop', V('fault', 'fault'), { f: 500, gain: 0.5 });
    const db = V('bell', 'doorbell'); k.play('ding', db, { f: 'E5', gain: 0.6 }); k.play('ding', db + 0.32, { f: 'C5', gain: 0.6 }); k.play('whoosh', db, { dur: 0.35, gain: 0.45 }); k.play('jump', db + 0.05, { gain: 0.5 });
    const fv = SH.find((s) => s[0] === 'fav')[1]; k.play('riser', fv - 0.45, { dur: 0.45, gain: 0.4 }); k.play('impact', fv + 0.08, { gain: 0.6 });
    const pz = V('fav', 'pizza'); k.play('impact', pz, { gain: 0.7 }); k.play('success', pz + 0.04, { f: 'C6', gain: 0.6 }); k.play('sparkle', pz + 0.1, { gain: 0.6, minor: true });
    for (let i = 0; i < 5; i++) k.play('pop', V('listen', 'shocking') + 0.35 + i * 0.3, { f: 900 + i * 80, gain: 0.45, minor: true });
    ['C5', 'E5', 'G5'].forEach((f, i) => k.play('ding', V('listen', 'shocking') + 0.45 + i * 0.1, { f, gain: 0.3 }));
  }

  window.LESSON = { BEATS, DURATION, CAPS, SH, explainer: (ctx, W, H_, t) => STORY(ctx, W, H_, t) };
  window.scoreSound = scoreSound;
