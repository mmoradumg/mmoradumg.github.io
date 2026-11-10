# UMG Music Studio — Website integration (Preview 0.7)

This website is a **static GitHub Pages** site. The UMG Music interface is staged at \`/apps/music/\`. It includes real song-request forms, playback/listing code and a **deliberate release gate**.

**No real singing or GPU inference is live.** The button is disabled until a secure, authenticated API and a loaded music model have been verified. The model weights are not in GitHub Pages.

## Architecture

- Browser/PWA (iPhone, desktop) → UMG HTTPS API gateway → FastAPI business API → PostgreSQL → Redis queue → private GPU ACE-Step XL worker → object storage.
- A signed Flutter iOS app will be another client of this API. Device does not determine output quality; model configuration and server do.
- Existing alpha 0.6 Python Backend/Flutter sources are separate. They are **local prototype sources**, not a public-safe deployment. Do not expose the LAN token, SQLite jobs, or background tasks to the internet.

## Backend API contract

Required authenticated JSON endpoints: GET \`/api/health\` reporting \`ace_connected\`, GET \`/api/models\` with nonempty \`models\`, POST \`/api/jobs\`, GET \`/api/jobs\`, and protected GET \`/api/jobs/{uuid}/audio\`.

The frontend's \`apiBase\` constant stays empty until production readiness. For any cross-origin API, set CORS to the exact UMG origin and credentials, require same-site HTTPS secure sessions, validate user ownership for every job/audio file, enforce usage caps and per-user isolation. Never put bearer tokens in HTML/JS.

## Launch blockers

1. Dedicated isolated repository for backend/workers and reviewable deployment code.
2. PostgreSQL per-user job ownership, Redis durable workers, storage, authentication, quotas, billing controls, abuse prevention, consent and rights policy.
3. ACE-Step 1.5 XL on a GPU with a verified Arabic singing audio result.
4. Safe reverse proxy and verified SSL on UMG-owned domain.
5. Phone and desktop browser checks, iOS sign/build/tests, security review.

No paid service has been enabled and no main-branch deployment is performed by this PR.