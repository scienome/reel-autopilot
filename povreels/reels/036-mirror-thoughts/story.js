  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const DRAW = (S, t, mood) => { S.rbox((p) => add(p, [0, 1.35, -0.75]), 0.36, 0.5, 0.03, [200, 160, 90], { bevel: 0.2 }); S.rbox((p) => add(p, [0, 1.35, -0.72]), 0.31, 0.45, 0.01, [200, 225, 240], { bevel: 0.1 }); S.ball([-0.15, 1.6, -0.7], [0.08, 0.02, 0.01], [255, 255, 255], { rim: false }); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 1.42, -0.7], mood, t, 0.9);
  makeCouch({
    keys: ["mirror", "thinks", "seven", "practise", "oscar", "speech", "heard", "hundred", "times", "tonight", "other", "perfect", "smile", "yourself", "finally", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_m1 = [first("m1"), V("m1", "oh", 1), V("m1", "not", 1)], M_m1 = ["tired", "wow", "sad"];
      const T_m2 = [first("m2"), V("m2", "i've", 1)], M_m2 = ["smug", "tired"];
      const T_n2 = [first("n2")], M_n2 = ["calm"];
      const T_m3 = [first("m3"), V("m3", "no", 1), V("m3", "stop", 1)], M_m3 = ["calm", "mad", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["happy"];
      const T_m4 = [first("m4"), V("m4", "i've", 1)], M_m4 = ["happy", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'bedroom', cam: [[0, 1.4, 1.7], [0, 1.3699999999999999, -0.7], [0, 1.385, 1.4], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); }, },
      m1: { set: 'bedroom', cam: [[0, 1.3499999999999999, 1.1], [0, 1.3699999999999999, -0.7], [0, 1.3399999999999999, 0.8], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m1[idx(T_m1, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_m1[idx(T_m1, t)], t); thought(ctx, S, [0.45, 1.9, -0.7], ["Seven a.m.", "Oh no.", "Not the hair."][idx(T_m1, t)], pu(t, first("m1"))); }, },
      m2: { set: 'bedroom', cam: [[0, 1.3499999999999999, 1.1], [0, 1.3699999999999999, -0.7], [0, 1.3399999999999999, 0.8], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m2[idx(T_m2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_m2[idx(T_m2, t)], t); thought(ctx, S, [0.45, 1.9, -0.7], ["You practise your Oscar speech in here.", "I've heard it four hundred times."][idx(T_m2, t)], pu(t, first("m2"))); }, },
      n2: { set: 'bedroom', cam: [[0, 1.4, 1.7], [0, 1.3699999999999999, -0.7], [0, 1.385, 1.4], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n2[idx(T_n2, t)], t); }, },
      m3: { set: 'bedroom', cam: [[0, 1.3499999999999999, 1.1], [0, 1.3699999999999999, -0.7], [0, 1.3399999999999999, 0.8], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m3[idx(T_m3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_m3[idx(T_m3, t)], t); thought(ctx, S, [0.45, 1.9, -0.7], ["Turn left.", "No, the other left.", "Stop. Perfect."][idx(T_m3, t)], pu(t, first("m3"))); }, },
      n3: { set: 'bedroom', cam: [[0, 1.4, 1.7], [0, 1.3699999999999999, -0.7], [0, 1.385, 1.4], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n3[idx(T_n3, t)], t); }, },
      m4: { set: 'bedroom', cam: [[0, 1.3499999999999999, 1.1], [0, 1.3699999999999999, -0.7], [0, 1.3399999999999999, 0.8], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m4[idx(T_m4, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); OFACE(ctx, S, M_m4[idx(T_m4, t)], t); thought(ctx, S, [0.45, 1.9, -0.7], ["Finally.", "I've waited years for you to like what you see."][idx(T_m4, t)], pu(t, first("m4"))); }, fx: [{ k: 'hearts', at: V('m4', 'like'), n: 4, y: 560 }], },
      cta: { set: 'bedroom', cam: [[0, 1.4, 1.7], [0, 1.3699999999999999, -0.7], [0, 1.385, 1.4], [0, 1.3699999999999999, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
