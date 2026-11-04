  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const bench = (S) => { S.rbox((p) => add(p, [0.2, 1.06, -0.2]), 0.5, 0.04, 0.2, [150, 100, 60], { bevel: 0.2 }); for (const x of [-0.2, 0.6]) S.rbox((p) => add(p, [x, 0.52, -0.2]), 0.04, 0.52, 0.18, [90, 90, 96], { bevel: 0.2 }); };
  const DRAW = (S, t, mood, o) => { bench(S); bird(S, Object.assign({ x: 0.2, y: 1.1, z: -0.2, s: 1.6, col: [130, 100, 60], belly: [170, 140, 100], wing: [110, 85, 50], crest: [30, 110, 70], beak: [250, 180, 50], t, mood }, o)); };
  makeCouch({
    keys: ["ducks", "think", "bread", "hungry", "kevin", "bench", "because", "friends", "criminals", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_d1 = [first("d1"), V("d1", "look", 1), V("d1", "look", 2)], M_d1 = ["happy", "smug", "sad"];
      const T_d2 = [first("d2"), V("d2", "this", 1)], M_d2 = ["mad", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_d3 = [first("d3"), V("d3", "then", 1), V("d3", "kevin", 1)], M_d3 = ["wow", "mad", "mad"];
      const T_n3 = [first("n3")], M_n3 = ["sad"];
      const T_d4 = [first("d4"), V("d4", "i'll", 1), V("d4", "but", 1)], M_d4 = ["calm", "happy", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, },
      d1: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d1[idx(T_d1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Bread man is here.", "Look cute.", "Look hungry."][idx(T_d1, t)], pu(t, first("d1"))); }, },
      d2: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d2[idx(T_d2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Kevin, back off.", "This one is mine."][idx(T_d2, t)], pu(t, first("d2"))); }, },
      n2: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, },
      d3: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, shake: V('d3', 'bite'), props: (S, t) => { DRAW(S, t, M_d3[idx(T_d3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["No bread?", "Then why are you here?", "Kevin, bite him."][idx(T_d3, t)], pu(t, first("d3"))); }, },
      n3: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, },
      d4: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d4[idx(T_d4, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0.2, 1.85, -0.2], ["Fine.", "I'll sit with you.", "But only because the bench is warm."][idx(T_d4, t)], pu(t, first("d4"))); }, fx: [{ k: 'hearts', at: V('d4', 'sit'), n: 4, y: 560 }], },
      cta: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
