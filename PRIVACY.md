# Privacy Policy

_Last updated: 27 October 2026_

reel-autopilot is a personal automation tool. It uploads videos made in this repository to the owner's own YouTube channel. It is not a public service, and nobody else signs in to it.

## What it accesses

When the channel owner signs in, reel-autopilot asks Google for one permission: `https://www.googleapis.com/auth/youtube.upload`. That permission lets it upload videos to the channel and set their title, description, tags, thumbnail, privacy status and scheduled publish time.

It does not read, change or delete any other YouTube data. It does not access email, contacts or any other Google account data.

## What it stores

- An OAuth client ID, client secret and refresh token, kept as encrypted GitHub Actions secrets in this repository.
- `youtube_posted.json`, which lists the video IDs, links, titles and publish times of uploads it has made, so nothing is uploaded twice.

No personal information about viewers or other users is collected, stored, sold or shared.

## Google API Services

reel-autopilot's use of information received from Google APIs follows the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements. It also uses the [YouTube API Services](https://developers.google.com/youtube/terms/api-services-terms-of-service). The [Google Privacy Policy](https://policies.google.com/privacy) applies to data handled by Google.

## Revoking access

You can remove reel-autopilot's access at any time at <https://myaccount.google.com/permissions>. You can also delete the repository secrets.

## Contact

For questions, open an issue at <https://github.com/scienome/reel-autopilot/issues>.
