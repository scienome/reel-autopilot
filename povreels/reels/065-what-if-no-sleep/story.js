  // 065 "What happens if..." sample (owner, 11 Nov 2026: Thought Bubble moves from POV to What-happens-if; body and science).
  // YOU are the guy on screen; your BRAIN talks in thought clouds (voice: friend). Stage cards: HOUR 16, HOUR 24, DAY 2, DAY 3.
  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const HEAD = [-0.62, 1.95, -0.42]; const MEC = [[-0.5, 1.6, 2.9], [-0.62, 2.0, -0.4], [-0.5, 1.6, 2.55], [-0.62, 2.0, -0.4]]; const MEK = [[-0.5, 1.95, 3.0], [-0.62, 2.4, -0.4], [-0.5, 1.95, 2.65], [-0.62, 2.4, -0.4]]; const HEADK = [-0.62, 2.3, -0.42];
  const night = (ctx, W, H_, a = 0.45) => { ctx.save(); ctx.fillStyle = `rgba(12,16,48,${a})`; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const stage = (ctx, W, t, at, txt, col = '#3d2bd6') => { const u = popU(t, at, 0.35); if (u <= 0) return; ctx.save(); ctx.translate(W / 2, 1060); ctx.scale(u, u); ctx.rotate(-0.04);
    ctx.fillStyle = col; ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 14; ctx.beginPath(); ctx.roundRect(-190, -58, 380, 116, 30); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.font = FONT(900, 70); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const tag = (ctx, W, t) => { ctx.save(); ctx.font = FONT(900, 44); ctx.textAlign = 'center'; ctx.fillStyle = '#ffd23f'; ctx.strokeStyle = '#1c1a22'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.strokeText('WHAT HAPPENS IF...', W / 2, 1150); ctx.fillText('WHAT HAPPENS IF...', W / 2, 1150); ctx.restore(); };
  const wobble = (ctx, W, H_, t, k) => { if (k <= 0) return; ctx.save(); ctx.globalAlpha = 0.25 * k; ctx.strokeStyle = '#b8f0ff'; ctx.lineWidth = 6; for (let i = 0; i < 9; i++) { ctx.beginPath(); for (let x = 0; x <= W; x += 20) { const y = 380 + i * 60 + Math.sin(x / 70 + t * 3 + i) * 18 * k; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); } ctx.restore(); };
  const ME = (face, o = {}) => Object.assign({ outfit: 'pajamas', arms: 'rest', face }, o);
  makeCouch({
    keys: ['sleeping', 'sixteen', 'brain', 'twenty-four', 'drinks', 'microsleeps', 'seconds', 'driving', 'three', 'breathing', 'deep', 'cleaning'],
    shots: ({ V, first }) => {
      const say = (ctx, S, t, beat, lines, starts, at = HEAD) => { let k = 0; starts.forEach((s, i) => { if (t >= s) k = i; }); thought(ctx, S, at, lines[k], pu(t, first(beat))); };
      const sayK = (ctx, S, t, beat, lines, starts) => say(ctx, S, t, beat, lines, starts, HEADK);
      return {
        hook: { set: 'bedroom', cam: MEC, he: ME({ eyes: 'wide', mouth: 'flat' }), she: NOONE, over: (ctx, W, H_, t) => { night(ctx, W, H_); tag(ctx, W, t); }, fx: [{ k: 'q', at: first('hook') + 0.6, who: 'he' }] },
        n1: { set: 'bedroom', cam: 'wide', he: ME({ eyes: 'happy', mouth: 'smile' }, { arms: 'phone' }), heHold: true, she: NOONE, over: (ctx, W, H_, t) => { night(ctx, W, H_, 0.4); stage(ctx, W, t, first('n1'), 'HOUR 16'); } },
        b1: { set: 'bedroom', cam: MEC, he: ME({ eyes: 'half', mouth: 'flat' }, { arms: 'phone' }), heHold: true, she: NOONE, over: (ctx, W, H_, t, S) => { night(ctx, W, H_, 0.4); say(ctx, S, t, 'b1', ["I'm still holding today's memories.", 'You never let me file them.'], [first('b1'), V('b1', 'You')]); } },
        n2: { set: 'kitchen', cam: 'wide', he: ME({ eyes: 'half', mouth: 'o' }, { head: { tilt: 0.15 } }), she: NOONE, over: (ctx, W, H_, t) => { stage(ctx, W, t, first('n2'), 'HOUR 24', '#e8384f'); }, fx: [{ k: 'stamp', text: '= A FEW DRINKS', at: V('n2', 'drinks'), x: 360, y: 960, col: '#e8384f' }] },
        b2: { set: 'kitchen', cam: MEK, he: ME({ eyes: 'wide', mouth: 'flat' }, { arms: 'head' }), she: NOONE, over: (ctx, W, H_, t, S) => { sayK(ctx, S, t, 'b2', ['Why did we walk into the kitchen?', 'Twice?'], [first('b2'), V('b2', 'Twice')]); }, fx: [{ k: 'q', at: first('b2') + 0.4, who: 'he' }] },
        n3: { set: 'car', cam: MEC, he: (t) => ME({ eyes: Math.sin(t * 2.2) > 0.6 ? 'half' : 'wide', mouth: 'flat' }, { arms: 'hold' }), she: NOONE, over: (ctx, W, H_, t) => { if (Math.sin(t * 2.2) > 0.6) night(ctx, W, H_, 0.75); stage(ctx, W, t, first('n3'), 'DAY 2', '#f29a1f'); } },
        b3: { set: 'car', cam: MEC, he: ME({ eyes: 'wide', mouth: 'o' }, { arms: 'hold' }), she: NOONE, over: (ctx, W, H_, t, S) => { say(ctx, S, t, 'b3', ['Sorry, I blinked.', 'For four seconds.', 'You were driving.'], [first('b3'), V('b3', 'For'), V('b3', 'You')]); }, fx: [{ k: 'buzz', at: V('b3', 'driving'), who: 'he' }], flash: [V('b3', 'driving')] },
        n4: { set: 'living', cam: 'wide', he: ME({ eyes: 'wide', mouth: 'flat' }), she: NOONE, over: (ctx, W, H_, t) => { night(ctx, W, H_, 0.35); wobble(ctx, W, H_, t, popU(t, first('n4') + 1.5, 1.2)); stage(ctx, W, t, first('n4'), 'DAY 3', '#7a3ad8'); } },
        b4: { set: 'living', cam: MEC, he: ME({ eyes: 'wide', mouth: 'o' }, { arms: 'cheeks' }), she: NOONE, over: (ctx, W, H_, t, S) => { night(ctx, W, H_, 0.35); wobble(ctx, W, H_, t, 1); say(ctx, S, t, 'b4', ['Is the wall breathing?', 'I think the wall is breathing.'], [first('b4'), V('b4', 'think')]); } },
        n5: { set: 'bedroom', cam: 'wide', he: ME({ eyes: 'half', mouth: 'smile' }, { arms: 'slump', head: { tilt: 0.3 } }), she: NOONE, over: (ctx, W, H_, t) => { night(ctx, W, H_, 0.5); }, fx: [{ k: 'zzz', at: first('n5') + 1.0, who: 'he' }] },
        b5: { set: 'bedroom', cam: MEC, he: ME({ eyes: 'half', mouth: 'smile' }, { arms: 'slump', head: { tilt: 0.3 } }), she: NOONE, over: (ctx, W, H_, t, S) => { night(ctx, W, H_, 0.5); say(ctx, S, t, 'b5', ['Do not wake me.', "I'm cleaning up."], [first('b5'), V('b5', "I'm")]); }, fx: [{ k: 'sparkle', at: V('b5', 'cleaning'), who: 'he' }] },
        cta: { set: 'bedroom', cam: 'wide', he: ME({ eyes: 'happy', mouth: 'smile' }, { arms: 'cheer' }), she: NOONE, over: () => {}, fx: [{ k: 'card', text: 'WHAT NEXT?', at: first('cta') + 0.3, y: 1110, fill: '#3d2bd6', col: '#fff', px: 52 }] },
      };
    },
  });
