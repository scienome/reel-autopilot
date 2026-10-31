# Claude skills for this repo

The custom skills, so any Claude account can install them from here.

| Skill | Use | Install file |
|---|---|---|
| `toystyle` | Brick Toy 9:16 reels (`toyreels/`, `youtube/`) | `zips/toystyle.zip` |
| `violetstyle` | Violet Room soft-3D reels (root `style/`, `povreels/`) | `zips/violetstyle.zip` |
| `mechanicskill` | Mechanic low-poly reels (`mechreels/`, `mechvideos/`, `davereels/`) | `zips/mechanicskill.zip` |
| `whatifstyle` | Flat Science "What if" explainer reels (no channel yet) | `zips/whatifstyle.zip` |

**Install on a new account (2 minutes):** download the zips from `skills/zips/` (open each file on GitHub →
"Download raw file"), then claude.ai → Settings → Capabilities → Skills → Upload skill, once per zip, and turn them on.

**Without installing:** a Claude session that has this repo cloned can read `skills/<name>/SKILL.md` directly and use
the files next to it. The repo's own series folders already contain every renderer, so the skills are a style guide,
never a blocker.

**Updating a skill:** edit the folder, then rebuild its zip from inside `skills/`:
`rm zips/<name>.zip && zip -qr zips/<name>.zip <name>` and commit both. Re-upload the zip on each Claude account.
