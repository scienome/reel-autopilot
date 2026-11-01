  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const wall = (S) => { S.rbox((p) => add(p, [0.2, 0.55, -0.2]), 0.45, 0.55, 0.25, [190, 182, 170], { bevel: 0.1 }); };
  const chips = (S) => { for (const [x, z, r] of [[0.0, 0.1, 0.1], [-0.1, 0.05, -0.3], [-0.02, 0.18, 0.5]]) S.rbox((p) => add(rotY(p, r), [x, 1.13, z]), 0.07, 0.015, 0.02, [250, 210, 80], { bevel: 0.4 }); S.rbox((p) => add(p, [-0.08, 1.11, 0.1]), 0.16, 0.012, 0.12, [240, 80, 70], { bevel: 0.2 }); };
  const DRAW = (S, t, mood, o) => { wall(S); bird(S, Object.assign({ x: 0.2, y: 1.1, z: -0.2, s: 1.5, col: [240, 240, 242], belly: [252, 252, 252], wing: [140, 150, 168], beak: [245, 190, 50], t, mood }, o)); };
  makeCouch({
    keys: ["chips", "asking", "plan", "shame", "fear", "dave", "roof", "second", "service", "delicious", "wall", "alone", "nobody", "given", "car", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["smug"];
      const T_g1 = [first("g1"), V("g1", "i'm", 1)], M_g1 = ["smug", "mad"];
      const T_g2 = [first("g2"), V("g2", "i", 2), V("g2", "i", 3)], M_g2 = ["smug", "smug", "mad"];
      const T_n2 = [first("n2")], M_n2 = ["mad"];
      const T_g3 = [first("g3"), V("g3", "dave", 2), V("g3", "i", 2)], M_g3 = ["mad", "smug", "smug"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_g4 = [first("g4"), V("g4", "delicious", 1)], M_g4 = ["smug", "smug"];
      const T_n4 = [first("n4")], M_n4 = ["sad"];
      const T_g5 = [first("g5"), V("g5", "not", 1)], M_g5 = ["sad", "sad"];
      const T_n5 = [first("n5")], M_n5 = ["wow"];
      const T_g6 = [first("g6"), V("g6", "i'll", 1)], M_g6 = ["happy", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'street', cam: [[0.2, 1.6, 0.9000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 0.6000000000000001], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { chips(S); DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, },
      g1: { set: 'street', cam: [[0.2, 1.6, 0.9000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 0.6000000000000001], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { chips(S); DRAW(S, t, M_g1[idx(T_g1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Nice chips.", "I'm not asking."][idx(T_g1, t)], pu(t, first("g1"))); }, },
      g2: { set: 'street', cam: [[0.2, 1.6, 1.4000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { chips(S); DRAW(S, t, M_g2[idx(T_g2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["I have no plan.", "I have no shame.", "I have no fear."][idx(T_g2, t)], pu(t, first("g2"))); }, },
      n2: { set: 'street', cam: [[0.2, 1.6, 2.1999999999999997], [0.2, 1.45, -0.2], [0.2, 1.59, 1.8999999999999997], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { chips(S); DRAW(S, t, M_n2[idx(T_n2, t)], {"look": [1, 0]}); }, },
      g3: { set: 'street', cam: [[0.2, 1.6, 0.9000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 0.6000000000000001], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { chips(S); DRAW(S, t, M_g3[idx(T_g3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Dave.", "Dave, I know where you live.", "I live on your roof."][idx(T_g3, t)], pu(t, first("g3"))); }, },
      n3: { set: 'street', cam: [[0.2, 1.6, 2.1999999999999997], [0.2, 1.45, -0.2], [0.2, 1.59, 1.8999999999999997], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { chips(S); DRAW(S, t, M_n3[idx(T_n3, t)], {"look": [-1, 0]}); }, },
      g4: { set: 'street', cam: [[0.2, 1.6, 1.4000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, shake: first("g4"), props: (S, t) => {  DRAW(S, t, M_g4[idx(T_g4, t)], {"flap": true}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Thank you for your service.", "Delicious."][idx(T_g4, t)], pu(t, first("g4"))); }, },
      n4: { set: 'street', cam: [[0.2, 1.6, 2.1999999999999997], [0.2, 1.45, -0.2], [0.2, 1.59, 1.8999999999999997], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n4[idx(T_n4, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#6a7aa0'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, },
      g5: { set: 'street', cam: [[0.2, 1.6, 0.9000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 0.6000000000000001], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_g5[idx(T_g5, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#6a7aa0'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0.2, 1.85, -0.2], ["Nobody has ever just given me one.", "Not once."][idx(T_g5, t)], pu(t, first("g5"))); }, },
      n5: { set: 'street', cam: [[0.2, 1.6, 1.4000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { chips(S); DRAW(S, t, M_n5[idx(T_n5, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, },
      g6: { set: 'street', cam: [[0.2, 1.6, 0.9000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 0.6000000000000001], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_g6[idx(T_g6, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Dave.", "I'll leave your car alone."][idx(T_g6, t)], pu(t, first("g6"))); }, fx: [{ k: 'hearts', at: first('g6'), n: 3, y: 560 }], },
      cta: { set: 'street', cam: [[0.2, 1.6, 1.4000000000000001], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
