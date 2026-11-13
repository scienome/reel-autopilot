// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const durva = (ctx, x, y, s = 1, n = 21, a = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.strokeStyle = '#3aa04a'; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const k = (i - n / 2) * 7; ctx.beginPath(); ctx.moveTo(k * 0.4, 0); ctx.quadraticCurveTo(k * 1.1, -80, k * 1.6, -150 + Math.abs(k) * 0.3); ctx.stroke(); } ctx.restore(); };
  const fireBelly = (ctx, x, y, t, s = 1) => { for (let i = 0; i < 4; i++) MYTH.flame(ctx, x - 60 + i * 40, y, s * (0.7 + 0.2 * Math.sin(t * 6 + i)), t + i); };

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { durva(ctx, 360, 1050, 2.2); } },
    b1: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'asura', 360, 1170, 0.9, t, { arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); }, over: cardOn('b1', 'अनलासुर', 'अनलासुर', { y: 300, size: 80 }) },
    b2: { set: 'battle', cam: CAM.wide, shake: V('b2', 'निगल'), draw: (ctx, t) => { char(ctx, 'ganesha', 250, 1170, 0.8, t, { halo: true, arms: 'open', face: { eyes: 'calm', mouth: 'o' } }); char(ctx, 'asura', 560, 1170, 0.55, t, { flip: true, arms: 'up', face: { eyes: 'wide', mouth: 'o' } }); } },
    b3: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { arms: 'belly', face: { eyes: 'sad', mouth: 'calm' } }); fireBelly(ctx, 360, 960, t, 0.9); } },
    b4: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.8, t, { arms: 'belly', face: { eyes: 'sad', mouth: 'calm' } }); char(ctx, 'sage', 130, 1170, 0.5, t, { arms: 'open', face: { eyes: 'sad', mouth: 'calm' } }); char(ctx, 'indra', 600, 1170, 0.5, t, { flip: true, arms: 'open', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b5: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'sage', 220, 1170, 0.8, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }); durva(ctx, 520, 1100, 2.0); }, over: cardOn('b5', 'इक्कीस', '21 दूर्वा', { y: 300, size: 80 }) },
    b6: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b6', 3), 22) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); durva(ctx, 360, 1050, 1.4); } },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 11, "hook": "गणेश जी ने\nएक दैत्य निगल लिया!", "next": "पूरी सीरीज़\nप्रोफ़ाइल पर", "nextAt": "nx", "gold": ["दूर्वा", "अनलासुर", "गणेश", "इक्कीस", "जलन", "ऋषि"]});
