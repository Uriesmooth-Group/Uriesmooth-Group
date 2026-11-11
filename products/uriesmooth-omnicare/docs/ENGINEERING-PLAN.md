# OmniCare Engineering Plan

## Initial acceptance criteria

1. App serves from Node.js 20+ and exposes a health endpoint.
2. Existing requested modules are represented without destructive device actions.
3. Repository panel obtains metadata, branches, commits, package.json and HTML from GitHub API; errors are explicit and never replaced with mock data.
4. GitHub credentials remain server-side and are read-only.
5. HTML export downloads as `uriesmooth_omnicare.html`; static export clearly excludes server-only GitHub integration.
6. No claim of device repair, file cleanup, battery tuning, synchronization, or deployment unless that behavior is implemented and verified.

## Planned phases

- Phase 1: UI and API scaffold (current).
- Phase 2: tests, CI, dependency/security review and human code review.
- Phase 3: authenticated repository configuration and verified source/manifest display against the selected project repository.
- Phase 4: deployment to an approved staging target; production only after explicit review and rollback planning.
- Phase 5: device integrations only after platform-specific threat modeling, user consent, authorization and safe rollback design.

## Open integration decision

The current source repository is the central Uriesmooth Group monorepo. The product API defaults to that repository. If OmniCare is later moved to a dedicated repository, update environment variables rather than hard-coding a browser token or API credential.
