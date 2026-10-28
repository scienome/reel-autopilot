# First comments

Right after a reel is published, the posting job posts one comment from the account on it: a hot take or an emoji
vote that gives people something to argue with. Replies to an early comment push a reel to more people.

One file per series, `{ "<reel id>": "comment text" }`:
- `couch.json` (CouchSarcasm, `reels/`), `dave.json` (Gears & Glitches, `davereels/`), `toy.json` (toy reels, `toyreels/`).

A reel can also set `"first_comment"` in its own `meta.json` (that wins). These files sit outside every render
folder, so editing them never re-renders a video. Needs the Instagram token to include the
`instagram_business_manage_comments` permission; without it the post still goes out and the log shows a warning.
