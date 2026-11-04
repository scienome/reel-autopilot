  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const DRAW = (S, t, mood) => { S.rbox((p) => add(p, [0, 0.9, -0.7]), 0.55, 0.03, 0.25, [170, 120, 80], { bevel: 0.2 }); S.rbox((p) => add(p, [0, 0.97, -0.7]), 0.09, 0.04, 0.24, [40, 42, 52], { bevel: 0.4 }); S.ball([0, 1.02, -0.86], 0.025, mood === 'tired' ? [90, 40, 40] : [240, 60, 60], { rim: false }); for (let i = 0; i < 6; i++) S.ball([-0.035 + (i % 2) * 0.07, 1.015, -0.75 + Math.floor(i / 2) * 0.06], 0.015, [200, 200, 210], { rim: false }); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 1.06, -0.66], mood, t, 0.8);
  makeCouch({
    keys: ["remote", "thinks", "they're", "looking", "again", "always", "pressed", "episode", "thirty", "minute", "watched", "eight", "batteries", "midepisode", "resting", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_r1 = [first("r1"), V("r1", "i'm", 1), V("r1", "i've", 1)], M_r1 = ["smug", "smug", "smug"];
      const T_r2 = [first("r2"), V("r2", "it", 1), V("r2", "you", 2)], M_r2 = ["tired", "smug", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_r3 = [first("r3"), V("r3", "i'm", 1), V("r3", "shake", 1)], M_r3 = ["tired", "tired", "mad"];
      const T_n3 = [first("n3")], M_n3 = ["happy"];
      const T_r4 = [first("r4"), V("r4", "unlimited", 1), V("r4", "next", 1)], M_r4 = ["wow", "happy", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'living', cam: [[0, 1.18, 0.95], [0, 1.0, -0.72], [0, 1.16, 0.75], [0, 1.0, -0.72]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); }, },
      r1: { set: 'living', cam: [[0, 1.12, 0.55], [0, 1.0, -0.72], [0, 1.1, 0.38], [0, 1.0, -0.72]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r1[idx(T_r1, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r1[idx(T_r1, t)], t); thought(ctx, S, [0, 1.22, -0.72], ["They're looking for me again.", "I'm in the sofa.", "I've always been in the sofa."][idx(T_r1, t)], pu(t, first("r1"))); }, },
      r2: { set: 'living', cam: [[0, 1.12, 0.55], [0, 1.0, -0.72], [0, 1.1, 0.38], [0, 1.0, -0.72]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r2[idx(T_r2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r2[idx(T_r2, t)], t); thought(ctx, S, [0, 1.22, -0.72], ["You pressed me so hard for one episode.", "It was a thirty minute show.", "You watched eight."][idx(T_r2, t)], pu(t, first("r2"))); }, },
      n2: { set: 'living', cam: [[0, 1.18, 0.95], [0, 1.0, -0.72], [0, 1.16, 0.75], [0, 1.0, -0.72]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n2[idx(T_n2, t)], t); }, },
      r3: { set: 'living', cam: [[0, 1.12, 0.55], [0, 1.0, -0.72], [0, 1.1, 0.38], [0, 1.0, -0.72]], he: NOONE, she: NOONE, shake: V('r3', 'Shake'), props: (S, t) => { DRAW(S, t, M_r3[idx(T_r3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r3[idx(T_r3, t)], t); thought(ctx, S, [0, 1.22, -0.72], ["Not me.", "I'm just resting.", "Shake me. Harder."][idx(T_r3, t)], pu(t, first("r3"))); }, },
      n3: { set: 'living', cam: [[0, 1.18, 0.95], [0, 1.0, -0.72], [0, 1.16, 0.75], [0, 1.0, -0.72]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n3[idx(T_n3, t)], t); }, },
      r4: { set: 'living', cam: [[0, 1.12, 0.55], [0, 1.0, -0.72], [0, 1.1, 0.38], [0, 1.0, -0.72]], he: NOONE, she: NOONE, shake: V('r4', 'Unlimited'), props: (S, t) => { DRAW(S, t, M_r4[idx(T_r4, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r4[idx(T_r4, t)], t); thought(ctx, S, [0, 1.22, -0.72], ["Power.", "Unlimited power.", "Next episode? Obviously."][idx(T_r4, t)], pu(t, first("r4"))); }, },
      cta: { set: 'living', cam: [[0, 1.18, 0.95], [0, 1.0, -0.72], [0, 1.16, 0.75], [0, 1.0, -0.72]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
