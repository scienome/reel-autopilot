  // ==================== random escalation: 99-wifi-bathroom ====================
  makeComedy({
    badge: 'STEP BY STEP', badgeCol: '#2a6f3a',
    captions: { keys: { "bathroom": "y", "router": "b", "eleven": "y", "glows": "g", "tower": "r", "planes": "r", "satellite": "b", "full": "g", "house": "r" } },
    beats: ({ V }) => {
      const bx = (S, x, y, z, hx, hy, hz, c, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const house = (S, gone = 0, glow = 0) => {
        if (gone >= 1) return;
        const k = 1 - gone, wall = glow ? [255, 240, 160] : [236, 226, 206];
        bx(S, 0, 0.75 * k, -0.4, 1.3, 0.75 * k, 0.9, wall);
        S.box((p) => add(rotZ(p, 0.78), [-0.66, 1.5 * k + 0.02, -0.4]), 0.95, 0.08, 0.95, P.red, { bevel: 0.2 });
        S.box((p) => add(rotZ(p, -0.78), [0.66, 1.5 * k + 0.02, -0.4]), 0.95, 0.08, 0.95, P.red, { bevel: 0.2 });
        bx(S, 0.75, 0.55 * k, 0.52, 0.32, 0.4 * k, 0.03, [150, 200, 240]); bx(S, -0.6, 0.45 * k, 0.52, 0.22, 0.45 * k, 0.03, [120, 84, 50]);
      };
      const router = (S, x, y, z, t, s = 1) => {
        bx(S, x, y, z, 0.16 * s, 0.04 * s, 0.1 * s, [30, 30, 36]);
        for (const a of [-1, 1]) bx(S, x + a * 0.1 * s, y + 0.14 * s, z - 0.06 * s, 0.012 * s, 0.12 * s, 0.012 * s, [30, 30, 36]);
        bx(S, x, y + 0.045 * s, z + 0.1 * s, 0.03 * s, 0.01, 0.005, Math.sin(t * 12 + x * 5) > 0 ? [80, 255, 120] : [20, 80, 30]);
      };
      const routers = (S, n, t) => { for (let i = 0; i < n; i++) router(S, -1.1 + (i % 6) * 0.44, 0.06 + Math.floor(i / 6) * 0.3, 0.75, t); };
      const tower = (S, h) => { for (const [dx, dz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) bx(S, dx, 1.6 + h / 2, -0.4 + dz, 0.025, h / 2, 0.025, [200, 60, 50]);
        for (let y = 0; y < h; y += 0.35) bx(S, 0, 1.6 + y, -0.4, 0.2, 0.015, 0.2, [236, 236, 240]); bx(S, 0, 1.6 + h + 0.05, -0.4, 0.06, 0.06, 0.06, [255, 60, 60]); };
      const dog = (S, x, z, glow) => { const c = glow ? [180, 255, 140] : [200, 150, 90]; bx(S, x, 0.22, z, 0.16, 0.08, 0.08, c); bx(S, x + 0.16, 0.33, z, 0.07, 0.07, 0.07, c); for (const a of [-1, 1]) for (const d of [-1, 1]) bx(S, x + a * 0.1, 0.08, z + d * 0.05, 0.025, 0.08, 0.025, c); };
      const bars = (n, at) => (ctx, W, H_, t) => { // 2D Wi-Fi signal icon, top right under the captions
        const u = popU(t, at); if (u <= 0) return; ctx.save(); ctx.translate(W - 120, 420); ctx.scale(u, u);
        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.beginPath(); ctx.roundRect(-70, -60, 140, 120, 22); ctx.fill();
        for (let i = 0; i < 4; i++) { ctx.fillStyle = i < n ? (n >= 4 ? '#5cff7a' : '#ffd23f') : 'rgba(255,255,255,0.18)'; ctx.fillRect(-48 + i * 26, 40 - (i + 1) * 20, 18, (i + 1) * 20); }
        ctx.restore(); };
      const YOU = (o = {}) => [null, 1.1, 1.0, -0.4, Object.assign({ shirt: P.blue, pants: [50, 50, 60], face: 'flat', hold: 'phone' }, o)];
      return {
        hook: { set: 'lawn', cam: 'wide', cast: [YOU()], props: (S, t) => { house(S); router(S, -0.9, 0.06, 0.75, t); }, over: bars(1, V('hook', 'bathroom')) },
        b1: { set: 'lawn', cam: 'mid', cast: [YOU({ face: 'smile' })], props: (S, t, u) => router(S, H.lerp(-0.9, 1.1, H.ease.inOut(u)), 0.06, 0.75, t), over: bars(1, 0) },
        b2: { set: 'lawn', cam: 'mid', at: 0.8, cast: [YOU({ face: 'sad' })], props: (S, t) => { router(S, 1.1, 0.06, 0.75, t); router(S, 0.6, 0.06, 0.75, t); }, over: bars(1, 0) },
        b3: { set: 'lawn', cam: 'wide', cast: [YOU({ face: 'smile' })], props: (S, t, u) => { house(S); routers(S, Math.ceil(13 * Math.min(1, u * 1.6)), t); }, tags: [[0, 1.2, 0.8, '13 ROUTERS', V('b3', 'eleven'), 'yellow']] },
        b4: { set: 'lawn', cam: 'wide', opt: { night: 0.35 }, cast: [YOU({ face: 'wow' })], props: (S, t) => { house(S, 0, 1); routers(S, 13, t); dog(S, -0.5, 1.2, 1); }, tags: [[-0.5, 0.75, 1.2, 'GLOWING', V('b4', 'dog'), 'green']], sfx: [['buzz', V('b4', 'hums'), { f: 120, dur: 1.2, gain: 0.3 }]] },
        b5: { set: 'lawn', cam: 'pull', cast: [YOU({ face: 'flat' })], props: (S, t, u) => { house(S); routers(S, 13, t); tower(S, 0.3 + 3.2 * H.ease.out(u)); }, over: bars(1, 0) },
        b6: { set: 'lawn', cam: [[3, 3.2, 7], [0, 3.5, -0.4], [2.6, 3.4, 6.2], [0, 3.8, -0.4]], props: (S, t, u) => { house(S); tower(S, 3.5); plane(S, H.lerp(6, 0.2, H.ease.out(u)), 5.25, -0.4, 0.35, -1.57); }, tags: [[0.2, 4.4, -0.4, 'GATE 4', V('b6', 'landing'), 'blue']] },
        b7: { set: 'lawn', cam: 'pull', shake: V('b7', 'From'), cast: [YOU({ face: 'wow', hold: null })], props: (S, t, u) => { house(S); missile(S, -1.6, 0.5 + 6 * H.ease.in(u), 0.2, 0.7, 0, 1); }, booms: [[-1.6, 0.4, 0.2, V('b7', 'From'), 1.8]] },
        twist: { set: 'lawn', cam: 'mid', at: 0.6, cast: [YOU({ face: 'smile' })], props: (S) => { house(S); bx(S, 0.3, 0.3, 1.0, 0.25, 0.3, 0.2, [250, 250, 252]); }, tags: [[0.3, 0.9, 1.0, 'BATHROOM', V('twist', 'bathroom'), 'white']], over: bars(4, V('twist', 'Full')), sfx: [['success', V('twist', 'Full'), { f: 'C6', gain: 0.5 }]] },
        close: { set: 'lawn', cam: 'pull', cast: [YOU({ face: 'smile' })], props: (S) => { bx(S, 0.3, 0.3, 1.0, 0.25, 0.3, 0.2, [250, 250, 252]); boom(S, 0, 0.6, -0.4, 1.2, 1); }, over: bars(4, 0), tags: [[0.3, 0.9, 1.0, 'BATHROOM', V('close', 'house'), 'white']] },
      };
    },
  });
