  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const plant = (S, t, x, z, droop = 0, lean = 0) => { S.cyl((p) => add(p, [x, 0.12, z]), 0.16, 0.12, [190, 100, 60], 14); S.cyl((p) => add(p, [x, 0.245, z]), 0.15, 0.01, [80, 55, 35], 14);
    for (let i = 0; i < 7; i++) { const a = i * 0.9, r = 0.18 + (i % 3) * 0.05, ty = 0.55 + (i % 2) * 0.18 - droop * 0.25; S.limb([x, 0.25, z], [x + Math.cos(a) * r + lean, ty, z + Math.sin(a) * r * 0.6], 0.012, 0.01, [70, 140, 60]); S.ball([x + Math.cos(a) * r + lean, ty, z + Math.sin(a) * r * 0.6], [0.07, 0.03, 0.05], droop > 0.5 ? [150, 150, 70] : [60, 170, 70]); } };
  const cactus = (S, x, z) => { S.cyl((p) => add(p, [x, 0.09, z]), 0.1, 0.09, [190, 100, 60], 12); S.ball([x, 0.32, z], [0.07, 0.16, 0.07], [60, 140, 80]); };
  const face = (ctx, S, mood, t, at = [0, 0.58, 0.05]) => objFace(ctx, S, at, mood, t, 0.85);
  makeCouch({
    keys: ['houseplant', 'water', 'nine', 'cactus', 'holiday', 'alive', 'waited', 'door', 'every', 'drowning', 'humans', 'plants', 'two'],
    shots: ({ V, first }) => ({
      hook: { cam: [[0, 0.9, 1.3], [0, 0.5, 0], [0, 0.88, 1.15], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { plant(S, t, 0, 0, 0.7); cactus(S, 0.45, -0.1); },
        over: (ctx, W, H_, t, S) => { face(ctx, S, t > first('p1') ? 'sad' : 'calm', t); thought(ctx, S, [0, 0.8, 0], t < V('p1', 'Please') - 0.1 ? 'Water.' : t < V('p1', "It's") - 0.1 ? 'Please.' : "It's been 9 days.", pu(t, first('p1'))); } },
      p2: { cam: [[0.2, 0.9, 1.3], [0.2, 0.45, 0], [0.2, 0.88, 1.15], [0.2, 0.45, 0]], he: NOONE, she: NOONE, props: (S, t) => { plant(S, t, 0, 0, 0.7); cactus(S, 0.45, -0.1); },
        over: (ctx, W, H_, t, S) => { face(ctx, S, 'mad', t); thought(ctx, S, [0, 0.8, 0], t < V('p2', 'The') - 0.1 ? 'You watered the cactus.' : "The cactus doesn't even like you.", pu(t, first('p2'))); } },
      n2: { cam: [[0, 0.9, 1.3], [0, 0.5, 0], [0, 0.85, 1.0], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => plant(S, t, 0, 0, 1.0),
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); if (t < first('p3')) timeCard(ctx, t, first('n2') - 0.1, 'HOLIDAY: 2 WEEKS'); face(ctx, S, 'sad', t, [0, 0.5, 0.05]); thought(ctx, S, [0, 0.75, 0], t < V('p3', 'Is', 2) - 0.1 ? 'Is this it?' : 'Is this how I go?', pu(t, first('p3'))); } },
      n3: { cam: [[0, 0.9, 1.3], [0, 0.5, 0], [0, 0.88, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => plant(S, t, 0, 0, 0.6, 0.15),
        over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); face(ctx, S, 'happy', t); thought(ctx, S, [0, 0.8, 0], t < V('p4', 'I', 2) - 0.1 ? 'I waited for you.' : 'I grew toward the door.', pu(t, first('p4'))); },
        fx: [{ k: 'hearts', at: V('p4', 'door'), n: 4, y: 620 }] },
      n4: { cam: [[0, 0.9, 1.3], [0, 0.5, 0], [0, 0.88, 1.15], [0, 0.5, 0]], he: NOONE, she: NOONE, shake: first('p5'), props: (S, t) => { plant(S, t, 0, 0, 0); for (let i = 0; i < 6; i++) S.ball([Math.sin(i * 2) * 0.12, 0.6 + ((t * 1.5 + i * 0.3) % 1) * -0.4, 0.05], 0.025, [120, 190, 240]); },
        over: (ctx, W, H_, t, S) => { face(ctx, S, t > first('p5') ? 'mad' : 'happy', t); thought(ctx, S, [0, 0.8, 0], t < V('p5', 'Now') - 0.1 ? 'Too much.' : t < V('p5', 'Humans') - 0.1 ? "Now I'm drowning." : 'Humans.', pu(t, first('p5'))); } },
      cta: { cam: [[0, 0.9, 1.3], [0, 0.5, 0], [0, 0.9, 1.25], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { plant(S, t, 0, 0, 0); cactus(S, 0.45, -0.1); }, over: (ctx, W, H_, t, S) => face(ctx, S, 'calm', t), fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
