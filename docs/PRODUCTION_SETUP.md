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
- [ ] **Sign-ups**: the app has a sign-up page and an invite flow (adults create a
      one-use code from the Family page; it expires after 7 days and can be locked
      to one email). Keep sign-ups on with *Confirm email* enabled. The sign-up
      page handles confirmation: the person follows the email link back to the app.
      Add the production URL + `/join` and `/chores` to Redirect URLs.
