  // ==================== Body: what happens if you stop sleeping? ====================
  makeReel({
    badge: 'YOUR WEIRD BODY',
    badgeCol: '#2f7fd6',
    captions: { say: { 'twenty-four hours': '24 hours', 'zero point one percent': '0.1%', 'nineteen sixty-three': '1963', 'seventeen-year-old': '17-year-old', 'eleven days': '11 days' }, keys: { sleeping: 'y', microsleeps: 'o', hallucinate: 'r', "don't": 'r', memories: 'g', drink: 'r' } },
    shots: ({ V }) => {
      const sleeper = (S, x, z, s, rot, o = {}) => S.figure(x, z, s, rot, Object.assign({ shirt: [120, 90, 200], pants: [70, 70, 120], hat: null }, o));
      const room = (ctx, W, H_, E, TG, build, night = 0.45) => { studioShot(ctx, W, H_, E, TG, build); nightGrade(ctx, W, H_, night, false); };
      return {
        hook(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.3, 7.0], [0, 1.1, 0], [0.2, 2.1, 6.2], [0, 1.15, 0]);
          room(ctx, W, H_, E, TG, (S) => { bed(S, 0.6, -0.4); sleeper(S, -0.9, 0.6, 0.95, 0.4, { eyes: 'sleepy', mouth: 'flat' }); S.tag(-0.4, 2.7, 0.6, '?', popU(t, V('hook', 'sleeping')), 0.12, P.yellow, 0.3); });
        },
        day1(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.2, 0], [0.1, 2.2, 6.0], [0, 1.25, 0]);
          const hrs = 24 * H.clamp((t - a) / 1.8), wob = t > V('day1', 'coordination') ? Math.sin(t * 3) * 0.12 : 0;
          room(ctx, W, H_, E, TG, (S) => {
            clock(S, 1.1, 2.4, -0.6, 0.9, hrs % 12 + 0.0001);
            sleeper(S, -0.5 + wob, 0.5, 0.95, 0.3 + wob, { eyes: 'sleepy', mouth: 'o', arms: [0.4 + wob, 0.5 - wob] });
            S.tag(0, 0.3, 1.8, Math.floor(hrs) + ' h awake', popU(t, a + 0.2), -0.05, P.red, 1.05);
            S.tag(1.0, 1.25, 0.9, '≈ 0.1% alcohol', popU(t, V('day1', 'zero')), 0.05, P.orange, 1.05);
          }, 0.35);
        },
        micro(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 5.6], [0, 1.5, 0], [0, 2.2, 4.9], [0, 1.55, 0]);
          const blink = ((t - a) % 1.6) < 0.45 && t > V('micro', 'microsleeps');
          room(ctx, W, H_, E, TG, (S) => { sleeper(S, 0, 0.3, 1, 0, { eyes: blink ? 'closed' : 'open', mouth: 'flat' }); S.tag(0, 0.35, 1.5, 'microsleep', popU(t, V('micro', 'microsleeps')), -0.05, P.orange, 1.05); }, 0.3);
          if (blink) { ctx.fillStyle = 'rgba(10,12,30,0.55)'; ctx.fillRect(0, 0, W, H_); }
        },
        day3(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.3, 6.8], [0, 1.3, 0], [0.1, 2.2, 6.0], [0, 1.35, 0]);
          const hal = ramp(t, V('day3', 'hallucinate'), 0.6);
          room(ctx, W, H_, E, TG, (S) => {
            sleeper(S, 0, 0.3, 0.95, 0, { eyes: hal > 0.5 ? 'wide' : 'sleepy', mouth: 'o', arms: [0.3, 0.3] });
            for (let i = 0; i < 10; i++) { const an = t * 0.8 + i * 0.63, r = 1.5; if (hal > 0) S.box((p) => add(rotY(rotX(p, t + i), t * 2 + i), [Math.cos(an) * r, 1.6 + Math.sin(t * 1.5 + i) * 0.7, Math.sin(an) * r * 0.6]), 0.12 * hal, 0.1 * hal, 0.12 * hal, [P.red, P.yellow, P.blue, P.green, P.orange][i % 5], { bevel: 0.3 }); }
            S.tag(0, 0.3, 1.8, '72 h', popU(t, V('day3', 'three')), -0.05, P.red, 0.6);
          }, 0.4);
          if (hal > 0) { ctx.save(); ctx.globalCompositeOperation = 'hue'; ctx.fillStyle = `rgba(200,80,255,${0.18 * hal})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); }
        },
        record(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.3, 2.3, 7.2], [0, 1.2, 0], [0.2, 2.1, 6.4], [0, 1.25, 0]);
          const d = Math.min(11, Math.floor(H.clamp((t - V('record', 'eleven')) / 1.4) * 11));
          lawnShot(ctx, W, H_, t, E, TG, (S) => {
            S.box((p) => add(p, [0.8, 0.45, -0.2]), 0.7, 0.05, 0.4, P.white, { bevel: 0.3 }); S.box((p) => add(p, [0.8, 0.22, -0.2]), 0.6, 0.22, 0.35, [200, 200, 210], { bevel: 0.2 });
            plate(S, 0.8, 1.05, -0.45, 0.6, 0.45, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#2f7fd6'; c.font = FONT(800, h * 0.15); c.textAlign = 'center'; c.fillText('SCIENCE', w / 2, h * 0.3); c.fillText('FAIR', w / 2, h * 0.5); c.fillStyle = '#e2402c'; c.fillText('DAY ' + d, w / 2, h * 0.78); }, [47, 127, 214]);
            sleeper(S, -0.8, 0.5, 0.9, 0.4, { shirt: P.green, eyes: d > 6 ? 'sleepy' : 'open', arms: [0.15, 1.2] });
            S.tag(0, 0.3, 1.8, '11 days', popU(t, V('record', 'eleven')), -0.05, P.red, 0.8);
            S.tag(-0.8, 2.75, 0.4, '1963', popU(t, V('record', 'nineteen')), 0.06, P.yellow, 0.55);
          });
        },
        sleep(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0.2, 2.6, 6.2], [0, 0.9, 0], [0.1, 2.4, 5.5], [0, 0.95, 0]);
          room(ctx, W, H_, E, TG, (S) => {
            bed(S, 0.1, -0.2, 1.1);
            S.box((p) => add(p, [-0.6, 0.78, -0.2]), 0.22, 0.2, 0.2, P.skin, { bevel: 0.28, paint: (c, w, h) => { c.strokeStyle = '#2a2a33'; c.lineWidth = w * 0.05; c.lineCap = 'round'; for (const x of [0.32, 0.68]) { c.beginPath(); c.moveTo(w * (x - 0.07), h * 0.45); c.lineTo(w * (x + 0.07), h * 0.45); c.stroke(); } c.beginPath(); c.arc(w / 2, h * 0.6, w * 0.1, 0.25 * Math.PI, 0.75 * Math.PI); c.stroke(); } });
            for (let i = 0; i < 3; i++) { const u = ((t - a) * 0.7 + i / 3) % 1; S.tag(-0.4 + u * 0.8, 1.3 + u * 1.2, -0.2, 'Z', H.clamp(Math.min(u * 4, (1 - u) * 4)), 0.1, P.blue, 0.2); }
            const br = popU(t, V('sleep', 'brain')); if (br > 0) voxBall(S, [1.0, 2.2, 0.3], 0.45 * br, 2, () => [240, 140, 170], t * 0.4, 0);
            S.tag(1.0, 1.4, 0.6, 'memories saved', popU(t, V('sleep', 'memories')), 0.05, P.green, 1.15);
            S.tag(-0.4, 0.35, 1.6, "don't try it", popU(t, V('sleep', "don't")), -0.06, P.red, 0.95);
          }, 0.5);
        },
        cta(ctx, W, H_, t, a, b) {
          const [E, TG] = shotCam(t, a, b, [0, 2.3, 6.6], [0, 1.4, 0], [0, 2.2, 5.8], [0, 1.45, 0]);
          room(ctx, W, H_, E, TG, (S) => { clock(S, 0, 1.7, -0.3, 1.3, 2.75); S.tag(0, 0.35, 1.6, '?', popU(t, V('cta', 'bed')), 0.12, P.yellow, 0.35); }, 0.45);
        },
      };
    },
    sound: (k, fx, { V, B }) => {
      k.tone(V('hook', 'sleeping'), { f: [[0, 260], [0.7, 150]], type: 'triangle', dur: 0.9, gain: 0.14, filter: 'lowpass', f2: 900 });
      for (let i = 0; i < 18; i++) k.play('tick', B('day1') + i * 0.1, { f: 2400, gain: 0.3, minor: true }); k.play('pop', V('day1', 'zero'), { f: 560, gain: 0.5 });
      k.play('pop', V('micro', 'microsleeps'), { f: 600, gain: 0.5 }); for (let i = 0; i < 3; i++) k.play('thud', V('micro', 'microsleeps') + i * 1.6, { f: 80, gain: 0.25 });
      k.play('riser', V('day3', 'hallucinate') - 0.4, { dur: 0.5, gain: 0.4 }); k.play('sparkle', V('day3', 'hallucinate'), { gain: 0.5, n: 10 }); k.play('glitch', V('day3', 'confused'), { gain: 0.5 });
      k.play('pop', V('record', 'nineteen'), { f: 600, gain: 0.5 }); for (let f = 0; f < 11; f++) k.play('count', V('record', 'eleven') + f * 0.127, { gain: 0.5 });
      k.play('slap', V('sleep', "don't"), { gain: 0.4 }); k.play('success', V('sleep', 'memories'), { f: 'C6', gain: 0.5 });
      k.play('pop', V('cta', 'bed'), { f: 700, gain: 0.5 });
    },
  });
