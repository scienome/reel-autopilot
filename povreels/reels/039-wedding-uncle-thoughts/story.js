  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const SUBJ = (o) => Object.assign({ who: 'dad', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["uncle", "every", "wedding", "thinks", "there", "still", "girlfriend", "house", "scooter", "music", "starts", "clear", "floor", "nobody", "stops", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_u1 = [first("u1"), V("u1", "still", 1), V("u1", "still", 2)], M_u1 = ["happy", "smug", "smug"];
      const T_u2 = [first("u2"), V("u2", "i", 2)], M_u2 = ["smug", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_u3 = [first("u3"), V("u3", "clear", 1), V("u3", "nobody", 1)], M_u3 = ["wow", "happy", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["sad"];
      const T_u4 = [first("u4"), V("u4", "don't", 1), V("u4", "help", 1)], M_u4 = ["calm", "sad", "sad"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'wedding', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      u1: { set: 'wedding', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_u1[idx(T_u1, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Ah, there he is.", "Still no job?", "Still no girlfriend?"][idx(T_u1, t)], pu(t, first("u1"))); }, },
      u2: { set: 'wedding', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_u2[idx(T_u2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["When I was your age,", "I had a house, two cows and a scooter."][idx(T_u2, t)], pu(t, first("u2"))); }, },
      n2: { set: 'wedding', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      u3: { set: 'wedding', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, shake: V('u3', 'Clear'), props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_u3[idx(T_u3, t)]], arms: 'cheer' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["My song.", "Clear the floor.", "Nobody stops this uncle."][idx(T_u3, t)], pu(t, first("u3"))); }, },
      n3: { set: 'wedding', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      u4: { set: 'wedding', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_u4[idx(T_u4, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I'm fine.", "Don't tell your aunty.", "Help me up slowly."][idx(T_u4, t)], pu(t, first("u4"))); }, },
      cta: { set: 'wedding', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
