  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood, o) => { dog(S, Object.assign({ x: 0, y: 0, z: -0.15, s: 0.72, col: [150, 156, 168], belly: [235, 235, 240], ears: 'up', mood: mood === 'happy' || mood === 'wow' ? 'calm' : mood, tongue: mood === 'happy', t }, o)); for (let i = -4; i <= 4; i++) S.rbox((p) => add(p, [i * 0.22 + 0.11, 0.2, 0.28]), 0.07, 0.14, 0.025, [196, 150, 100], { bevel: 0.3 }); S.rbox((p) => add(p, [0, 0.2, 0.3]), 1.0, 0.03, 0.02, [170, 126, 84], { bevel: 0.3 }); };
  makeCouch({
    keys: ["dog", "next", "door", "bark", "meant", "excited", "fence", "petting", "again", "six"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_f1 = [first("f1") + 0.0, first("f1") + 1.85, first("f1") + 4.07], M_f1 = ["calm", "mad", "happy"];
      const T_f2 = [first("f2") + 0.0, first("f2") + 1.48, first("f2") + 2.59], M_f2 = ["calm", "happy", "wow"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_f3 = [first("f3") + 0.0, first("f3") + 1.11, first("f3") + 4.44], M_f3 = ["wow", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_f4 = [first("f4") + 0.0, first("f4") + 1.48, first("f4") + 2.96], M_f4 = ["sad", "happy", "sad"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.59], M_cta = ["smug", "smug"];
      return {
      hook: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      f1: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_f1[idx(T_f1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.95, 0], ["You walk past every day.", "I bark at you every day.", "I have never once meant it."][idx(T_f1, t)], pu(t, first("f1"))); } },
      f2: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_f2[idx(T_f2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.95, 0], ["I'm not guarding anything.", "I'm just excited.", "Nobody comes. Then you come."][idx(T_f2, t)], pu(t, first("f2"))); } },
      n2: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      f3: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_f3[idx(T_f3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.95, 0], ["You're petting me?", "The fence is between us, and you still came.", "Do it again."][idx(T_f3, t)], pu(t, first("f3"))); }, fx: [{ k: 'hearts', at: first("f3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { } },
      f4: { set: "street", cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_f4[idx(T_f4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.95, 0], ["My person works late.", "You're my six p.m.", "Please never move house."][idx(T_f4, t)], pu(t, first("f4"))); }, fx: [{ k: 'hearts', at: first("f4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "street", cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
