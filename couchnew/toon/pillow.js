  // ==================== PILLOW: "Pillow Talk" additions to ADULT (Roxy, Max, the bedroom) ====================
  // Add 'toon/pillow.js' after 'toon/adult.js' in a reel's meta.json libs. Both characters are adults; keep the camera on faces.
  // PILLOW.sheet(ctx, t, o): the bedsheet, drawn after the people, from y = o.y (default 815).
  // PILLOW.floor(ctx, t): clothes on the floor. PILLOW.hook(ctx, t, end, txt): the big opening question, until `end`.
  Object.assign(ADULT.CAST, {
    roxy: { skin: '#d9a07c', sh: '#c08660', hair: '#7a1f2c', top: '#b81f3f', top2: '#8f1630', legs: '#2a2030', shoe: '#2a2030', armCol: '#d9a07c', h: 1.0, girl: true, hs: 'long', outfit: 'slip', hoops: true, eyes: 'half', seed: 360 },
    max: { skin: '#e3b591', sh: '#c99a74', hair: '#23201f', top: '#e3b591', top2: '#c99a74', legs: '#2e3440', shoe: '#2a2a2e', h: 1.06, hs: 'slick', outfit: 'bare', stubble: true, seed: 400 },
  });
  const PILLOW = (() => {
    const { poly, blob, oval, line, INK } = ADULT;
    Object.assign(ADULT.sets, {
      // a dark bedroom: moonlit window, lamp, big headboard. o.lamp = false turns the lamp off, o.off = time the lamp clicks off
      bedroom(ctx, W, H_, t, o = {}) { ctx.fillStyle = '#2a2140'; ctx.fillRect(0, 0, W, H_); ctx.save(); ctx.globalAlpha = 0.1; ctx.fillStyle = '#c8a8e0'; for (let i = 0; i < 9; i++) ctx.fillRect(i * 90, 0, 36, H_); ctx.restore();
        poly(ctx, '#121a3e', [[440, 110], [680, 110], [680, 420], [440, 420]], 501); oval(ctx, '#f2ecd0', 590, 200, 42, 42, 502, 0); line(ctx, [[560, 110], [560, 420]], 6, INK, 503); line(ctx, [[440, 265], [680, 265]], 6, INK, 504);
        blob(ctx, '#7a2a44', [[20, 520], [120, 450], [600, 450], [700, 520], [720, 1000], [0, 1000]], 505); for (let i = 0; i < 4; i++) oval(ctx, '#5e1e34', 120 + i * 160, 560, 11, 11, 506 + i, 3, 8);
        ctx.fillStyle = '#3a2430'; ctx.fillRect(0, 1000, W, 400);
        poly(ctx, '#f2e4d0', [[40, 760], [340, 760], [330, 900], [50, 900]], 511); poly(ctx, '#f2e4d0', [[380, 760], [680, 760], [670, 900], [390, 900]], 512);
        const on = o.lamp !== false && (o.off == null || t < o.off);
        line(ctx, [[60, 760], [60, 620]], 6, INK, 513); poly(ctx, on ? '#ffd98a' : '#6a5a4a', [[10, 530], [110, 530], [130, 620], [-10, 620]], 514);
        if (on) { const g = ctx.createRadialGradient(60, 590, 10, 60, 590, 620); g.addColorStop(0, 'rgba(255,190,110,0.5)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.fillRect(-200, 0, W + 400, H_); } },
    });
    const sheet = (ctx, t, o = {}) => { const y = o.y || 815; blob(ctx, o.col || '#d8d0e0', [[-40, y + 10], [180, y - 8], [360, y + 8], [540, y - 8], [760, y + 10], [760, 1110], [-40, 1110]], 520); for (let i = 0; i < 4; i++) line(ctx, [[60 + i * 170, y + 40], [100 + i * 170, 1090]], 3, 'rgba(60,50,90,0.25)', 521 + i); };
    const floor = (ctx, t) => { blob(ctx, '#b81f3f', [[90, 1050], [250, 1030], [300, 1100], [120, 1130]], 530); blob(ctx, '#2e3440', [[400, 1040], [610, 1040], [640, 1120], [440, 1130]], 531); oval(ctx, '#f2efe6', 320, 1140, 40, 22, 532); };
    const hook = (ctx, t, end, txt) => { if (t > end + 0.25) return; const a = Math.min(1, (end + 0.25 - t) / 0.25); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '900 66px sans-serif'; ctx.lineJoin = 'round'; txt.split('\n').forEach((l, i, A) => { const s = Math.min(1, 640 / ctx.measureText(l).width); ctx.save(); ctx.translate(360, 210 + i * 82); ctx.scale(s, s); ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(l, 0, 0); ctx.fillStyle = i === A.length - 1 ? '#ffd23f' : '#ffffff'; ctx.fillText(l, 0, 0); ctx.restore(); }); ctx.restore(); };
    return { sheet, floor, hook };
  })();
