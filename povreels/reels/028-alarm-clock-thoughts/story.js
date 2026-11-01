  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const table = (S) => { S.rbox((p) => add(p, [0, 0.5, -0.6]), 0.32, 0.5, 0.25, [150, 105, 70], { bevel: 0.15 }); };
  const DRAW = (S, t, mood, o) => { table(S); const sh = o && o.ring ? Math.sin(t * 60) * 0.012 : 0; S.rbox((p) => add(p, [sh, 1.14, -0.6]), 0.16, 0.14, 0.07, [220, 50, 60], { bevel: 0.5 });
    for (const sd of [-1, 1]) { S.ball([sd * 0.11 + sh, 1.31, -0.6], 0.05, [240, 200, 70]); S.limb([sd * 0.15 + sh, 0.98, -0.6], [sd * 0.16 + sh, 0.97, -0.5], 0.015, 0.015, [90, 90, 100]); } };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 1.15, -0.52], mood, t, 0.85);
  makeCouch({
    keys: ["six", "ring", "job", "snooze", "rude", "seven", "minutes", "years", "first", "believe", "early", "sick", "dream", "gently", "phone", "replace", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_a1 = [first("a1"), V("a1", "time", 1), V("a1", "i", 1)], M_a1 = ["happy", "happy", "happy"];
      const T_n2 = [first("n2")], M_n2 = ["sad"];
      const T_a2 = [first("a2"), V("a2", "seven", 1), V("a2", "that's", 1)], M_a2 = ["mad", "tired", "mad"];
      const T_n3 = [first("n3")], M_n3 = ["tired"];
      const T_a3 = [first("a3"), V("a3", "you've", 1), V("a3", "i", 1)], M_a3 = ["sad", "sad", "happy"];
      const T_n4 = [first("n4")], M_n4 = ["wow"];
      const T_a4 = [first("a4"), V("a4", "you're", 1), V("a4", "are", 1), V("a4", "is", 1)], M_a4 = ["wow", "wow", "wow", "wow"];
      const T_n5 = [first("n5")], M_n5 = ["happy"];
      const T_a5 = [first("a5"), V("a5", "please", 1)], M_a5 = ["happy", "sad"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'bedroom', cam: [[0, 1.25, 1.0], [0, 1.25, -0.6], [0.0, 1.24, 0.7], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); }, },
      a1: { set: 'bedroom', cam: [[0, 1.2, 0.6], [0, 1.25, -0.6], [0.0, 1.1949999999999998, 0.3], [0, 1.25, -0.6]], he: NOONE, she: NOONE, shake: first("a1"), props: (S, t) => {  DRAW(S, t, M_a1[idx(T_a1, t)], {"ring": true}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_a1[idx(T_a1, t)], t); thought(ctx, S, [0, 1.6, -0.6], ["Six a.m.", "Time to ring.", "I love my job."][idx(T_a1, t)], pu(t, first("a1"))); }, },
      n2: { set: 'bedroom', cam: [[0, 1.25, 1.0], [0, 1.25, -0.6], [0.0, 1.24, 0.7], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n2[idx(T_n2, t)], t); }, },
      a2: { set: 'bedroom', cam: [[0, 1.2, 0.6], [0, 1.25, -0.6], [0.0, 1.1949999999999998, 0.3], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_a2[idx(T_a2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_a2[idx(T_a2, t)], t); thought(ctx, S, [0, 1.6, -0.6], ["Rude.", "Seven more minutes.", "That's what you always say."][idx(T_a2, t)], pu(t, first("a2"))); }, },
      n3: { set: 'bedroom', cam: [[0, 1.2999999999999998, 1.6], [0, 1.25, -0.6], [0.0, 1.285, 1.3], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_n3[idx(T_n3, t)], t); }, },
      a3: { set: 'bedroom', cam: [[0, 1.2, 0.6], [0, 1.25, -0.6], [0.0, 1.1949999999999998, 0.3], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_a3[idx(T_a3, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); OFACE(ctx, S, M_a3[idx(T_a3, t)], t); thought(ctx, S, [0, 1.6, -0.6], ["I've known you six years.", "You've never once woken up on the first ring.", "I still believe in you."][idx(T_a3, t)], pu(t, first("a3"))); }, },
      n4: { set: 'bedroom', cam: [[0, 1.25, 1.0], [0, 1.25, -0.6], [0.0, 1.24, 0.7], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n4[idx(T_n4, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n4[idx(T_n4, t)], t); }, },
      a4: { set: 'bedroom', cam: [[0, 1.2, 0.6], [0, 1.25, -0.6], [0.0, 1.1949999999999998, 0.3], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_a4[idx(T_a4, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_a4[idx(T_a4, t)], t); thought(ctx, S, [0, 1.6, -0.6], ["What?", "You're early.", "Are you sick?", "Is this a dream?"][idx(T_a4, t)], pu(t, first("a4"))); }, },
      n5: { set: 'bedroom', cam: [[0, 1.2999999999999998, 1.6], [0, 1.25, -0.6], [0.0, 1.285, 1.3], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n5[idx(T_n5, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n5[idx(T_n5, t)], t); }, },
      a5: { set: 'bedroom', cam: [[0, 1.2, 0.6], [0, 1.25, -0.6], [0.0, 1.1949999999999998, 0.3], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_a5[idx(T_a5, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_a5[idx(T_a5, t)], t); thought(ctx, S, [0, 1.6, -0.6], ["Thank you.", "Please never replace me with your phone."][idx(T_a5, t)], pu(t, first("a5"))); }, fx: [{ k: 'hearts', at: first('a5'), n: 3, y: 560 }], },
      cta: { set: 'bedroom', cam: [[0, 1.25, 1.0], [0, 1.25, -0.6], [0.0, 1.24, 0.7], [0, 1.25, -0.6]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
