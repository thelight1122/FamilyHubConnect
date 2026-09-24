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
- [ ] Configure production Supabase Auth providers, redirects, email templates, and invite policy.
- [ ] Replace mock domain data with authenticated, authorized reads and writes.
- [ ] Add server-side validation, audit logging, rate limits, and privacy controls.
- [ ] Configure secrets and deployment environments outside the repository.
- [ ] Run production-like acceptance tests against a non-production backend.
- [ ] Complete release, rollback, monitoring, and incident procedures.

## Boundary

The application must not claim production readiness until real authentication, persistent storage, authorization, privacy controls, and a tested deployment environment are present. Supabase Auth is wired as the production identity-provider seam when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured and mock auth is not enabled. The local mock flow remains available in development and E2E only.
