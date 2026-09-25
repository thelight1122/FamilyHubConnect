# Production Readiness

Family Hub Connect is currently a verified local prototype. Production readiness is being handled as a gated transition so demo behavior is not mistaken for live family data or authentication.

## Current Gates

- [x] Archived older code for provenance.
- [x] Deterministic local UI behavior with model integration off.
- [x] Runtime error boundary.
- [x] Lint, production build, and browser coverage.
- [x] Production runtime distinguishes configured auth from local mock auth.
- [x] Add Supabase Auth as the production identity-provider seam.
- [x] Select Supabase as the production API/database foundation.
- [x] Role-aware access rules: members read their family's data, adults write it, with narrow tested exceptions for children.
- [x] Server-side validation, audit logging and per-user write rate limits (migration `0500`).
- [x] Continuous integration: lint, build, unit, prototype browser tests, database rule tests and live sign-in tests (`.github/workflows/ci.yml`).
- [x] Production-like acceptance tests against a non-production backend (`npm run test:e2e:live` against the local Supabase stack).
- [ ] Replace mock domain data with authenticated, authorized reads and writes. Done: chores, rewards, finance, constitution, Accountability sessions. Remaining: governance, health, pets, timeline, sports, creator studio.
- [ ] Configure production Supabase Auth providers, redirects, email templates, and invite policy. See `docs/PRODUCTION_SETUP.md` §2.
- [ ] Configure secrets and deployment environments outside the repository. See `docs/PRODUCTION_SETUP.md` §1, §3, §4.
- [ ] Complete release, rollback, monitoring, and incident procedures. Written in `docs/PRODUCTION_SETUP.md` §4–5; the accounts and tools still need setting up.
- [ ] Privacy controls: retention periods, privacy policy, children's data rules. See `docs/PRODUCTION_SETUP.md` §6.

## Boundary

The application must not claim production readiness until real authentication, persistent storage, authorization, privacy controls, and a tested deployment environment are present. Supabase Auth is wired as the production identity-provider seam when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured and mock auth is not enabled. The local mock flow remains available in development and E2E only.
