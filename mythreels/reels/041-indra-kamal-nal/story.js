KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const stalk = (ctx, x, t, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#3a8a4a'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, 1300); ctx.quadraticCurveTo(x + 40, 1000, x - 10, 760); ctx.stroke(); MYTH.ell(ctx, '#f4a0c0', x - 10, 730, 56, 40, 0, 4); MYTH.ell(ctx, '#ff7aa8', x - 10, 745, 36, 30, 0, 3); ctx.restore(); };
  const lake = (ctx, t) => { ctx.fillStyle = 'rgba(40,120,170,0.55)'; ctx.fillRect(0, 1000, 720, 300); for (let i = 0; i < 5; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(150 + i * 120, 1060 + (i % 2) * 70, 40, 8, 0, 0, 6.3); ctx.stroke(); } };
  return {
    h1: { set: 'river', cam: [[360, 900, 1.1], [360, 860, 1.4]], draw: (ctx, t) => { lake(ctx, t); stalk(ctx, 360, t); char(ctx, 'indra', 350, 830, 0.12, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b1: { set: 'battle', cam: CAM.wide, shake: V('b1', 'वृत्र'), draw: two('indra', { hold: 'vajra', arms: { r: 'up', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } }, 'asura', { arms: 'cover', face: { eyes: 'closed', mouth: 'frown' } }) },
    b2: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { const u = H.clamp((t - at('b2', 3)) / 2.5); lake(ctx, t); char(ctx, 'indra', 360, 1190 - 100 * u, 0.7 * (1 - 0.8 * u) + 0.1, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }); stalk(ctx, 520, t); } },
    b3: { set: 'heaven', cam: [[360, 800, 1.0], [360, 780, 1.2]], draw: (ctx, t) => { for (let i = 0; i < 3; i++) char(ctx, i % 2 ? 'deva' : 'sage', 120 + i * 240, 1160, 0.5, t, { bob: Math.abs(Math.sin(t * 5 + i)) * 8, arms: 'wide', face: { eyes: 'wide', mouth: 'o' } }); } },
    b4: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'sage', 160, 1170, 0.6, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'open' } }); char(ctx, 'deva', 560, 1170, 0.6, t, { flip: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); }, over: cardOn('b4', 'नहुष।', 'नहुष', { y: 300, size: 84 }) },
    b5: { set: 'palace', setOpt: { throne: 360 }, cam: CAM.mid, draw: (ctx, t) => char(ctx, 'deva', 360, 1130, 0.7, t, { halo: true, arms: 'hips', face: { eyes: 'open', mouth: 'smile' } }) },
    b6: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { lake(ctx, t); stalk(ctx, 520, t); char(ctx, 'parvati', 230, 1170, 0.7, t, { arms: { r: 'point', l: 'namaste' }, face: { eyes: 'sad', mouth: 'calm' } }); } },
    end: { set: 'river', setOpt: { night: true }, cam: [[430, 760, 1.2], [480, 780, 1.6]], draw: (ctx, t) => { lake(ctx, t); stalk(ctx, 520, t); char(ctx, 'parvati', 230, 1170, 0.7, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }); } },
  };
}, {series: 'जब देवता भी हारे', part: 1, hook: 'देवताओं का राजा\nकमल की नाल में छिपा!', next: 'राजा की पालकी\nउठाई सात ऋषियों ने!', nextAt: 'nx', gold: ['कमल', 'नाल', 'इंद्र', 'वृत्र', 'नहुष।', 'शची', 'ब्रह्महत्या']});
