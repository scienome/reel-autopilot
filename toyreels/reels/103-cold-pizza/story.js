  // ==================== random escalation: 103-cold-pizza ("Let's fix that" chain) ====================
  makeComedy({
    badge: 'LET\'S FIX THAT', badgeCol: '#c2412c',
    captions: { say: { "two": "2" }, keys: { "cold": "b", "fix": "g", "faster": "y", "traffic": "r", "jetpack": "y", "wind": "r", "away": "r", "oven": "y", "heavy": "r", "shop": "y", "town": "r", "vehicle": "y", "hot": "r", "ice": "b", "cream": "b" } },
    beats: ({ V }) => {
      const bx = (S, x, y, z, hx, hy, hz, c, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const BOX = [214, 170, 110];
      const pizza = (S, x, y, z, s = 1, rot = 0, cold = 0) => {
        S.box((p) => add(rotY(rotX(p, 0), rot), [x, y, z]), 0.32 * s, 0.05 * s, 0.32 * s, BOX, { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#c2412c'; c.beginPath(); c.arc(w / 2, h / 2, Math.min(w, h) * 0.3, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.font = FONT(800, Math.min(w, h) * 0.14); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('PIZZA', w / 2, h / 2); } });
        if (cold) for (let i = 0; i < 5; i++) bx(S, x - 0.24 * s + i * 0.12 * s, y - 0.09 * s, z + 0.3 * s, 0.025 * s, 0.05 * s, 0.025 * s, [200, 235, 255]);
      };
      const steam = (S, x, y, z, t) => { for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; bx(S, x + Math.sin(t * 3 + i) * 0.08, y + k * 0.6, z, 0.05 * (1 - k) + 0.02, 0.05 * (1 - k) + 0.02, 0.05 * (1 - k) + 0.02, [240, 240, 245]); } };
      const wheel = (S, x, y, z, r, t, spin = 1) => S.cyl((p) => add(rotX(rotZ(p, t * spin), 1.5708), [x, y, z]), r, 0.05, [30, 30, 34], 16);
      const bike = (S, x, z, t, s = 1, fast = 0) => { wheel(S, x - 0.45 * s, 0.28 * s, z, 0.28 * s, t, -8); wheel(S, x + 0.45 * s, 0.28 * s, z, 0.28 * s, t, -8); bx(S, x, 0.5 * s, z, 0.45 * s, 0.04 * s, 0.04 * s, fast ? [255, 210, 40] : [200, 40, 40]); bx(S, x - 0.2 * s, 0.7 * s, z, 0.03 * s, 0.22 * s, 0.03 * s, [40, 40, 44]); bx(S, x + 0.4 * s, 0.8 * s, z, 0.03 * s, 0.3 * s, 0.03 * s, [40, 40, 44]);
        if (fast) for (let i = 0; i < 3; i++) bx(S, x - 0.9 * s - i * 0.25, 0.3 + i * 0.18, z, 0.12, 0.015, 0.015, [255, 255, 255]); };
      const car = (S, x, z, col, rot = 0) => { bx(S, x, 0.35, z, 0.6, 0.2, 0.3, col, rot); bx(S, x - 0.05, 0.65, z, 0.35, 0.13, 0.27, [190, 225, 250], rot); for (const a of [-1, 1]) for (const d of [-1, 1]) bx(S, x + a * 0.38, 0.13, z + d * 0.3, 0.12, 0.12, 0.03, [30, 30, 34], rot); };
      const LB = (S, x, y, z, rot) => (dx, dy, dz, hx, hy, hz, c) => S.box((p) => add(rotY(add(p, [dx, dy, dz]), rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const LP = (x, y, z, rot, d) => add(rotY(d, rot), [x, y, z]);
      const jetpack = (S, x, y, z, t, on = 1, rot = 0) => { const B = LB(S, x, y, z, rot); for (const a of [-1, 1]) { S.cyl((p) => LP(x, y, z, rot, add(p, [a * 0.16, 0.95, -0.3])), 0.11, 0.55, [180, 186, 196], 12); B(a * 0.16, 1.55, -0.3, 0.1, 0.05, 0.1, [200, 40, 40]);
        if (on) for (let i = 0; i < 3; i++) { const k = Math.abs(Math.sin(t * 20 + i + a)); B(a * 0.16, 0.85 - 0.12 * i - 0.08 * k, -0.3, 0.07 - i * 0.015, 0.06, 0.07 - i * 0.015, i ? [255, 120, 30] : [255, 220, 60]); } } };
      const oven = (S, x, y, z, t, rot = 0) => { const B = LB(S, x, y, z, rot); B(0, 1.25, -0.48, 0.42, 0.45, 0.22, [150, 154, 162]); for (const a of [-1, 1]) B(-a * 0.43, 1.2, -0.48, 0.01, 0.22, 0.15, [255, 140, 40]); B(0, 1.25, -0.71, 0.3, 0.25, 0.01, [255, 140, 40]); S.cyl((p) => LP(x, y, z, rot, add(p, [0.25, 1.7, -0.55])), 0.06, 0.45, [90, 90, 96], 10); const q = LP(x, y, z, rot, [0.25, 2.2, -0.55]); steam(S, q[0], q[1], q[2], t); };
      const handPizza = (S, x, y, z, rot, s = 0.9) => { const q = LP(x, y, z, rot, [0, 1.05, 0.45]); pizza(S, q[0], q[1], q[2], s, rot); };
      const house = (S, x, z, col = [236, 226, 206]) => { bx(S, x, 0.6, z, 0.8, 0.6, 0.6, col); bx(S, x, 1.32, z, 0.85, 0.12, 0.65, [60, 100, 170]); bx(S, x + 0.3, 0.5, z + 0.61, 0.2, 0.25, 0.02, [255, 230, 140]); bx(S, x - 0.35, 0.4, z + 0.61, 0.16, 0.4, 0.02, [110, 74, 44]); };
      const shop = (S, x, z) => { bx(S, x, 0.65, z, 0.75, 0.65, 0.55, [200, 60, 50]); S.box((p) => add(p, [x, 1.45, z + 0.2]), 0.8, 0.2, 0.06, [255, 245, 230], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#c2412c'; c.font = FONT(800, h * 0.6); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('PIZZA', w / 2, h / 2); } }); bx(S, x, 0.5, z + 0.56, 0.5, 0.3, 0.02, [255, 220, 150]); };
      const card = (title, sub, tm) => (ctx, W, H_, t) => { const k = H.clamp((t - tm) * 5); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; const w = W * 0.62, h = H_ * 0.075, x = (W - w) / 2, y = H_ * 0.33; ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.roundRect(x, y, w, h, h * 0.25); ctx.fill();
        ctx.fillStyle = '#2a2a33'; ctx.textAlign = 'center'; ctx.font = FONT(800, h * 0.34); ctx.fillText(title, W / 2, y + h * 0.45); ctx.fillStyle = '#c2412c'; ctx.font = FONT(600, h * 0.2); ctx.fillText(sub, W / 2, y + h * 0.8); ctx.restore(); };
      const YOU = (x, z, rot, o = {}) => [null, x, z, rot, Object.assign({ shirt: [70, 130, 220], pants: [40, 44, 56], hair: 'short', mouth: 'flat' }, o)];
      const GUY = (x, z, rot, o = {}) => [null, x, z, rot, Object.assign({ shirt: [210, 50, 50], pants: [40, 44, 56], hat: 'cap', hatCol: [210, 50, 50], mouth: 'grin' }, o)];
      const CROWD = (n, t0) => Array.from({ length: n }, (_, i) => [null, -2.4 + (i % 7) * 0.75, -0.2 + Math.floor(i / 7) * 0.6, 0.3, { shirt: [[90, 160, 90], [230, 180, 50], [150, 80, 170], [60, 150, 200]][i % 4], arms: i % 3 === 0 ? 'up' : null, walk: 0, bob: Math.abs(Math.sin(t0 + i)) * 0.05 }]);
      return {
        hook: { set: 'street', cam: 'mid', opt: { signs: ['PIZZA', 'DONUTS', 'BANK', 'SHOES', 'PIZZA', 'TOYS'] }, cast: [YOU(0.4, 0.2, -0.2, { mouth: 'sad' })], props: (S, t) => pizza(S, 0.35, 1.05, 0.55, 1.0, 0, 1),
          tags: [[-0.5, 1.6, 0.4, 'COLD', 0.05, 'blue'], [-0.6, 2.2, 0.2, '-5°C', V('hook', 'arrives'), 'blue']] },
        fix: { set: 'street', cam: 'close', cast: [YOU(0.1, 0.2, 0, { mouth: 'grin' })], props: (S, t) => pizza(S, 0.1, 1.05, 0.55, 1.0, 0, 1), flash: [V('fix', 'fix')], sfx: [['pop', V('fix', 'fix'), { gain: 0.5 }]] },
        b1: { set: 'street', cam: 'wide', at: [-0.6, 0.6], cast: [GUY(0, 0.3, 1.57, (t, u) => ({ x: -1.5 + u * 3, bob: 0.35 }))], props: (S, t, u) => { bike(S, -1.5 + u * 3, 0.3, t, 1.4, t > V('b1', 'faster')); pizza(S, -1.5 + u * 3 + 0.35, 1.3, 0.3, 0.8); },
          tags: [[0, 2.3, 0.3, 'TURBO BIKE', V('b1', 'faster'), 'yellow']] },
        b2: { set: 'street', cam: 'high', cast: [GUY(0.2, 0.3, 1.57, { bob: 0.35, mouth: 'sad' })], props: (S, t) => { bike(S, 0.2, 0.3, t * 0, 1.1); pizza(S, 0.55, 1.3, 0.3, 0.8); for (let i = -2; i <= 2; i++) if (i) car(S, i * 1.4, 0.3, [[60, 120, 200], [230, 190, 40], [90, 170, 90], [170, 80, 170]][(i + 2) % 4]); car(S, -0.9, -0.6, [220, 90, 60]); car(S, 1.3, -0.6, [80, 80, 90]); goldTank(S, 2.4, -0.9, 0.8, 0, t); },
          tags: [[-1.2, 1.5, 0.3, 'BEEP', V('b2', 'traffic'), 'red'], [1.4, 1.5, 0.3, 'HONK', V('b2', 'traffic') + 0.3, 'yellow'], [0.2, 2.3, 0.3, 'STUCK', V('b2', 'hits'), 'red']] },
        b3: { set: 'street', cam: 'mid', cast: [GUY(0, 0.1, 1.15, { mouth: 'grin' })], props: (S, t) => { jetpack(S, 0, 0, 0.1, t, 0, 1.15); handPizza(S, 0, 0, 0.1, 1.15); }, over: card('JETPACK v1', 'top speed: yes', V('b3', 'jetpack')), flash: [V('b3', 'jetpack')], sfx: [['impact', V('b3', 'back'), { gain: 0.5 }]] },
        b4: { set: 'sky', cam: 'mid', at: [-0.9, 0.1], cast: [GUY(0, 0.1, 1.57, (t, u) => ({ x: -1.2 + u * 1.6, bob: 0.6 + Math.sin(t * 3) * 0.1, arms: t > V('b4', 'blows') ? 'up' : null }))], props: (S, t, u) => { const gx = -1.2 + u * 1.6, gy = 0.6 + Math.sin(t * 3) * 0.1; jetpack(S, gx, gy, 0.1, t, 1, 1.57); const off = H.clamp((t - V('b4', 'blows')) * 1.2); pizza(S, gx + 0.35 + off * 2.6, gy + 1.05 + off * 1.0, 0.3, 0.8, off * 6);
            if (t > V('b4', 'wind') - 0.3) for (let i = 0; i < 5; i++) { const k = (t * 1.5 + i / 5) % 1; bx(S, -2.5 + k * 5, 1.2 + i * 0.3, 0.2, 0.25, 0.015, 0.015, [255, 255, 255]); } },
          tags: [[1.6, 2.4, 0.3, 'NOOO', V('b4', 'away'), 'red']], sfx: [['pop', V('b4', 'blows'), { gain: 0.4 }]] },
        b5: { set: 'street', cam: 'mid', cast: [GUY(0, 0.1, 1.15, { mouth: 'grin' })], props: (S, t) => { oven(S, 0, 0, 0.1, t, 1.15); handPizza(S, 0, 0, 0.1, 1.15); }, tags: [[-0.9, 2.1, 0.3, '450°C', V('b5', 'oven'), 'red']], flash: [V('b5', 'oven')] },
        b6: { set: 'street', cam: 'low', shake: V('b6', 'heavy'), cast: [GUY(0, 0.1, 1.15, (t) => ({ bob: t > V('b6', 'heavy') ? 0 : Math.max(0, Math.sin((t - V('b6', 'stays')) * 4)) * 0.25, mouth: t > V('b6', 'heavy') ? 'sad' : 'grin', arms: t > V('b6', 'heavy') ? 'up' : null }))],
          props: (S, t) => { oven(S, 0, 0, 0.1, t, 1.15); jetpack(S, 0, 0, -0.15, t, 1, 1.15); handPizza(S, 0, 0, 0.1, 1.15); for (let i = 0; i < 4; i++) bx(S, -0.5 + i * 0.33, 0.02, 0.5, 0.15, 0.02, 0.05, [90, 80, 70]); },
          booms: [[0, 0.2, 0.3, V('b6', 'heavy'), 1.0]], tags: [[1.0, 2.2, 0.3, '900 KG', V('b6', 'heavy'), 'red']] },
        b7: { set: 'lawn', cam: 'wide', cast: [YOU(0.2, 0.6, 0, { mouth: 'grin' }), ['chef', 1.4, 0.3, -0.3]], props: (S, t, u) => { house(S, -1.1, -0.7); const k = H.ease.out(H.clamp((t - V('b7', 'shop')) * 1.5)); shop(S, 1.4, -0.7 + (1 - k) * -4); },
          booms: [[1.4, 0.2, -0.5, V('b7', 'next') , 0.9]], tags: [[1.4, 2.3, -0.4, 'OPEN 24/7', V('b7', 'house'), 'green']] },
        b8: { set: 'lawn', cam: 'wide', at: [0.6, -0.4], cast: [YOU(-1.3, 0.8, 0.3, { mouth: 'sad', arms: 'up' }), ...CROWD(14, 0)], props: (S, t) => { house(S, -1.1, -1.3); shop(S, 1.4, -1.3); },
          tags: [[0.6, 2.3, 0.4, 'QUEUE: 3 KM', V('b8', 'queues'), 'red']] },
        b9: { set: 'lawn', cam: 'wide', flash: [V('b9', 'vehicle')], cast: [GUY(1.3, 0.6, -0.4, { mouth: 'grin' })], props: (S, t) => { const k = H.ease.out(H.clamp((t - V('b9', 'own')) * 1.2)); goldTank(S, -2.5 + k * 2.4, 0.2, 1.4, -0.25, t); pizza(S, -2.5 + k * 2.4 - 0.1, 1.15, 0.2, 0.8); },
          sfx: [['impact', V('b9', 'vehicle'), { gain: 0.6 }]] },
        twist: { set: 'lawn', cam: 'wide', cast: [YOU(1.4, 0.3, -0.6, (t) => ({ mouth: t > V('twist', 'hot') ? 'grin' : 'flat' }))], props: (S, t) => { house(S, 1.4, -1.0); goldTank(S, -1.6, 0.0, 1.3, 0.3, t, { fire: V('twist', 'arrives') }); const k = H.clamp((t - V('twist', 'arrives')) * 2.2); if (k > 0) pizza(S, H.lerp(-1.0, 1.4, k), 1.3 + Math.sin(k * 3.14) * 0.9 - (k >= 1 ? 0.25 : 0), 0.3 + k * 0.1, 0.8, k * 8); if (k >= 1) steam(S, 1.4, 1.2, 0.4, t); },
          booms: [[-0.8, 0.9, 0.0, V('twist', 'arrives'), 0.6]], tags: [[0.2, 2.4, 0.3, '2 SECONDS', V('twist', 'seconds'), 'yellow'], [1.6, 2.0, 0.4, 'HOT', V('twist', 'hot'), 'red']] },
        close: { set: 'lawn', cam: 'close', at: 1.4, cast: [YOU(1.4, 0.3, -0.2, (t) => ({ mouth: t > V('close', 'ice') ? 'sad' : 'flat' }))], props: (S, t) => { const k = H.clamp((t - V('close', 'ice')) * 3); pizza(S, 1.4, 1.05, 0.65, 1.0); for (let i = 0; i < 4; i++) bx(S, 1.1 + i * 0.2, 1.12 - k * 0.04, 0.68 + Math.sin(i) * 0.05, 0.07 + k * 0.05, 0.02, 0.07 + k * 0.05, [250, 230, 200]); },
          tags: [[0.95, 2.35, 0.3, 'ICE CREAM', V('close', 'ice'), 'blue']] },
      };
    },
  });
