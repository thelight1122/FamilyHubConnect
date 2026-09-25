# Production Setup Checklist

The parts of production readiness that live in accounts and dashboards rather
than in this repository. Each needs the project owner. Code-side safeguards
(access rules, audit log, rate limits, input checks) are already in
`supabase/migrations/` and tested by `npm run test:db`.

Work top to bottom: later steps assume the earlier ones.

## 1. Environments

- [ ] Create a **staging** Supabase project alongside the production one
      (`FamilyHubConnect`, ref `ipgnwjuludnbiiydwsja`). Staging is where
      migrations and releases are tried first.
- [ ] Apply migrations to staging, check the app against it, then to production:
      ```
      npx supabase link --project-ref <staging-ref>
      npx supabase db push
      npx supabase link --project-ref ipgnwjuludnbiiydwsja
      npx supabase db push
      ```
      Production currently has only `20260920000100` applied; `0200`–`0600`
      are pending.
- [ ] After pushing, run **Database → Advisors** in the dashboard and clear any
      security warnings.

## 2. Sign-in (Supabase Auth)

Dashboard → **Authentication**.

- [ ] **URL configuration**: set Site URL to the production app URL; add the
      staging URL and `http://localhost:5173` to Redirect URLs.
- [ ] **Email**: turn on *Confirm email*. Minimum password length 8 or more
      (the local config already uses 8).
- [ ] **SMTP**: set a custom SMTP sender (the built-in sender is rate-limited
      and for testing only).
- [ ] **Email templates**: edit Confirm signup, Magic link, Reset password and
      Invite user so they name Family Hub Connect and read in the family's voice.
- [ ] **Google / Apple sign-in** (the login page shows both buttons): create the
      OAuth clients in Google Cloud and Apple Developer, then paste the client IDs
      and secrets under **Providers**. Until then, hide the buttons or expect them
      to fail.
- [ ] **Sign-ups**: decide whether anyone can create an account, or only
      invited people. Invites are not built yet (adults can add a member only
      by user id), so until they are, keep sign-ups on with email confirmation.

## 3. Secrets

- [ ] The app only needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
      (public by design; access is enforced by the database rules). Set them
      in the hosting provider's environment settings, per environment.
- [ ] Never put the **service role** key in the app, the repo or a `VITE_`
      variable. It bypasses every access rule. Only CI's local stack and
      server-side tools may use a service key.
- [ ] Keep `VITE_ENABLE_MOCK_AUTH` unset (or `false`) in every deployed
      environment.
- [ ] The local `.env` is git-ignored; confirm with `git ls-files .env` (should
      print nothing).

## 4. Hosting and releases

- [ ] Pick a static host (Vercel, Netlify or Cloudflare Pages all work: the app
      is a Vite build in `dist/`). Configure a rewrite of all paths to
      `/index.html` so deep links load.
- [ ] Connect the GitHub repo so `main` deploys to production and pull requests
      get preview deployments pointed at **staging**.
- [ ] Require the **CI** checks (`.github/workflows/ci.yml`) to pass before a
      pull request can merge: GitHub → Settings → Branches → branch protection
      on `main`.

### Release steps

1. Merge to `main` after CI passes.
2. `npx supabase db push` to staging; check the staging app.
3. `npx supabase db push` to production.
4. The host deploys `main`.

### Rollback

- **App**: redeploy the previous build from the host's deployment history.
- **Database**: migrations only move forward. Write a new migration that
  reverses the change, test it on staging, then push. Before any risky
  migration, take a backup (Database → Backups; point-in-time recovery needs a
  paid plan).

## 5. Monitoring and incidents

- [ ] Turn on email alerts for the Supabase project (usage, downtime).
- [ ] Add an error tracker to the app (for example Sentry) and send
      `ErrorBoundary` errors to it. Strip family content from reports; send
      error types and stack traces only.
- [ ] Review the in-app `audit_log` table (adults of a family can read their
      family's log) and the Supabase **Logs** when something looks wrong.
- [ ] Write down who is contacted when something breaks, and where families are
      told about an outage.

## 6. Privacy

- [ ] Publish a privacy policy that says what is stored (family records,
      accounts, amounts) and what is not (Arbiter analysis runs on the device).
- [ ] Decide how long closed Accountability sessions and audit log entries are
      kept, and add a scheduled cleanup (Supabase Cron) to match.
- [ ] Children's data: check the rules that apply where the family lives (COPPA
      in the US, GDPR-K in the EU) before opening sign-ups to the public.
