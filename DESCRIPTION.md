# FamilyHubConnect — Product Description

## Overview

FamilyHubConnect is a comprehensive family management platform designed to bring every aspect of modern family life into one cohesive, mobile-first application. It replaces a scattered mix of notes apps, spreadsheets, group chats, and wall charts with a single shared space where parents and children can coordinate, communicate, learn, and grow together.

The platform covers eight core domains: home management, personal finance, chores and rewards, sports and activities, health tracking, pet care, family governance, and creative content. Each domain is a self-contained module with its own set of interactive features, all connected through a unified identity and points system that encourages positive participation from every family member.

---

## Design Philosophy

### Mobile-First
Every screen is designed and optimised for a smartphone viewport (max-width: 428px). Cards, buttons, and touch targets are sized for fingers, not cursors. The layout centres gracefully on larger screens without breaking.

### Clarity Through Constraint
Rather than cluttering the interface with options, each page focuses on a single purpose. Bottom-sheet modals handle contextual actions, confirmation dialogs prevent accidental decisions, and toast notifications provide immediate feedback without interrupting flow.

### Consistent Feedback Loop
Every meaningful action produces visible feedback:
- Toast notifications confirm successful actions (photo submitted, reward redeemed, health event logged)
- Confirmation modals appear before irreversible decisions (appeal approval, consequence updates)
- Success states replace forms after submission (appeal submitted, loan approved)
- Progress bars and status badges make state visible at a glance

### Approachable for All Ages
The UI uses plain language, colour-coded statuses, and familiar icon metaphors (Material Symbols). Children can navigate their chores and rewards without adult assistance. Parents have deeper controls in governance and review interfaces.

---

## Feature Modules

### Dashboard
The home screen is personalised to the current user. It opens with a greeting and a summary of the day:

- **Points Balance** — current accumulated points and weekly allowance earned
- **Today's Schedule** — up to 3 upcoming events (practices, meals, activities) with times
- **Chores Progress** — a progress bar showing completed vs. total tasks for the day
- **Quick Actions** — a 4-tile grid linking to Finance, Sports, Pet Hub, and Family Court
- **Shout-Out Card** — a highlight celebrating a recent family member achievement
- **Notifications Overlay** — tapping the bell icon slides down a panel listing recent alerts (pending appeals, completed chores, rescheduled practices) with timestamps

### Finance Hub
The Finance module teaches and practises real financial concepts within the safety of the family.

- **Family Savings Hero Card** — total family savings displayed prominently with a monthly change indicator
- **AI Tip Banner** — a contextual financial tip surfaced to encourage learning
- **Finance Tools Grid** — quick-access tiles for four sub-features: Allowance, Savings Goals, Family Bank, and Market Simulator
- **Member Wallets** — each family member's current balance shown as a relative progress bar and dollar amount
- **Recent Activity** — a transaction list with icons, labels, dates, and explicit `+$X.XX` / `-$X.XX` prefixes for clarity (colour and symbol, not colour alone)

### Market Simulator
A gamified stock market experience designed to introduce children to investing fundamentals.

- **Portfolio Summary** — current portfolio value and daily percentage change
- **7-Day Performance Chart** — an SVG sparkline showing portfolio value over the past week
- **Stock Listings** — three mock companies (Ice Cream Inc, Toy Co, Pet Treats Ltd) with current price, daily change percentage, and Buy/Sell action buttons
- **AI Tip** — an investing insight surfaced contextually
- **Learning Disclaimer** — a clear notice that all trading is simulated, reinforcing that this is an educational tool

### Family Bank (Loans)
A structured loan management system that teaches responsible borrowing with 0% interest.

- **Family Balance Card** — the family pool available for lending
- **0% Interest Policy** — prominently communicated to set expectations
- **Active Loans** — each active loan shows: item name, total amount, amount paid, remaining balance, weekly payment amount, and a progress bar towards full repayment
- **Request New Loan** — a form with amount and purpose fields; submitted loans enter a pending review state
- **Loan History** — a record of past loans and their outcomes
- **How It Works** — an informational section explaining the borrowing process for younger users

### Chores & Rewards
The core accountability engine of the app, turning household tasks into a points-based game.

**My Tasks tab:**
- Checklist of assigned chores with due dates and point values
- Circle checkbox toggles for marking tasks complete
- Photo verification for tasks that require proof of completion — tapping "Verify" opens the device camera; submitting a photo marks the task complete and shows a toast confirmation
- A progress bar and completion counter at the top (e.g., "2 of 5 completed — 40%")

**Rewards Store tab:**
- A catalogue of redeemable rewards (Extra Screen Time, Movie Night, Pizza Night, Skip a Chore)
- Each reward shows its point cost and a Redeem button
- Redeeming a reward deducts points and confirms with a toast notification

### Sports & Locker Room
A team hub for tracking sports activities across multiple family members.

- **Team Switcher** — a sticky horizontal selector at the top for switching between family members' teams (e.g., Leo's Soccer, Sarah's Ballet)
- **Team Info Card** — team name, the family member it belongs to, active status, and next scheduled event
- **Schedule Section** — a list of upcoming games and practices with dates, times, home/away indicators, and location
- **Equipment Checklist** — items required for the next event with packed/unpacked status
- **Team Contacts** — coaches and team members with avatar, name, role, and a message button
- **Open Team Chat** — links directly to the Team Chat page for that team

### Team Chat
A real-time group messaging interface styled after familiar mobile chat apps.

- **Online Members Bar** — avatars with green active-status dots for currently online members
- **Announcement Banner** — a pinned card highlighting an important upcoming event
- **Message Thread** — own messages aligned right (blue), others' messages aligned left (grey) with sender name and timestamp
- **Typing Indicator** — three animated bouncing dots when another member is composing
- **Message Input** — a text field with an attachment button and send button

### Health Logs
A centralised health record for each family member, replacing paper logs and scattered app notes.

- **Member Profile Card** — name, age, blood type, known allergies, and vaccination status badges
- **Log New Health Event** — a bottom-sheet modal with:
  - Event type selector (pill buttons): Illness, Injury, Doctor Visit, Medication Change, Other
  - Notes textarea for details
  - Save button — on submission, the modal closes and a toast confirms the log
- **Active Medications** — a list of current medications with name, dosage, and days remaining
- **Health History Timeline** — past events displayed as a vertical timeline with colour-coded dots by category
- **Medical Disclaimer** — a clear notice that the app supplements but does not replace professional medical advice

### Pet Hub
A dedicated care tracker for the family pet.

- **Pet Hero Card** — large pet icon, name (Luna), breed (Golden Retriever), and a "Healthy" status badge
- **Stats Grid** — three metrics: Weight, Age, and Activity Level
- **Feeding Schedule** — morning and evening feeding entries with done/pending status icons; status is derived from static daily data
- **Daily Walks** — walk entries with time, duration, and distance; each has a tappable Done/Pending badge that toggles between states
- **Upcoming Vet Visit** — a card showing the appointment month, day, clinic name, time, and a "Reminder set" badge

### Family Timeline
A living family scrapbook capturing the moments, achievements, and reflections that define the family's story.

- **Filter Pills** — horizontal scrollable pills: All, Achievements, Memories, Journal. Selecting a filter shows only matching entries.
- **Empty State** — when a filter has no matching entries, a friendly icon and message invite the user to start capturing moments
- **Vertical Timeline** — entries are grouped by month with colour-coded dot indicators:
  - **Amber** — Achievements (star icon, bold title, description)
  - **Blue** — Memories (image placeholder, like and comment counts)
  - **Rose** — Journal entries (italic quote, author attribution, date)
  - **Green** — Milestones (icon, title, date badge)
- **Floating Add Button** — a `+` FAB for adding new entries (future feature)

### Family Constitution
The foundational document that defines what the family stands for.

- **Mission Statement** — a full-width prominent display of the family's stated purpose
- **Core Values Carousel** — horizontally scrollable colour-coded cards for each value (Kindness, Respect, Honesty, Curiosity, Resilience, Courage)
- **Family Rules** — a numbered checklist of agreed rules, each with a description
- **Signatories** — a list of all family members who have signed the constitution, with avatars and signature dates
- **Propose Amendment** — a button to initiate a formal amendment request through the governance system

### Family Governance
A structured system for resolving disputes, managing mediation, and maintaining order through fair process.

The page is organised into four tabs:

- **Resolution** — The active mediation space. Shows a "Request a Family Hearing" call-to-action card that routes to the Appeal submission form. Lists active mediations with status and details.
- **Jury Pool** — Lists family members eligible to serve as mediators, with their current role (Active Mediator or Standby) and availability dates. A green dot indicates the current active mediator.
- **Archive** — A record of past rulings with case IDs, parties, outcomes, and dates. Provides historical precedent for future decisions.
- **Rule Book** — A direct link to the Family Constitution for reference during governance proceedings.

### Appeal System
A two-sided interface for children to contest consequences and parents to review those contests fairly.

**Child's view (Submit Appeal — `/more/appeal`):**
- Active consequence displayed prominently (icon, title, violation reason)
- Form with three fields: Your Reason (required), Proposed Alternative, What I've Learned
- Evidence upload area — tapping opens the device file picker; the selected filename appears to confirm attachment
- Review as Parent link for switching to the parent view
- Submit button (disabled until Reason is filled)
- On submission: the form is replaced by a success screen showing "Appeal Submitted!", a "What Happens Next" checklist (Parent reviews → Decision within 24h → Notification sent), and a Back to More button

**Parent's view (Review Appeal — `/more/appeal/review`):**
- Case summary card with ID, child's name, charge, and "Pending Review" badge
- Original consequence displayed in a red-tinted card
- Child's argument shown as a blockquote
- Proposed alternative with a swap icon
- Evidence attachment indicator with "Tap to view" affordance
- Three decision buttons: Approve Appeal (green), Deny Appeal (red outline), Open Negotiation (blue)
- Confirmation modal before any decision is committed — shows the decision type, child's name, and Cancel/Confirm buttons
- After confirmation: the decision buttons disappear and a colour-coded result card appears with an icon and personalised message (e.g., "Your decision has been recorded and Leo Thompson has been notified")

### Family Court
The consequence tracking and management system for active family rules enforcement.

- **Stats Grid** — three headline metrics: Active Measures count, Weekly Resolution rate, and trend indicator
- **Active Consequences** — each entry shows: a category icon, consequence title, the rule violation that triggered it, a status badge (In Progress / Completed), a progress bar, and a "Mark Done" button
- Tapping "Mark Done" immediately marks the item as complete with a toast notification
- **Consequence History** — a list of past resolved consequences
- **System Integration Card** — shows the connection status to device-level controls (e.g., screen time sync)
- Floating "+" FAB for adding new consequences (future feature)

### Creator Studio
A family content hub for capturing and sharing creative work.

- **Stats Grid** — three engagement metrics: Total Posts, Total Views, Total Likes
- **Create New Section** — three creation type cards: Photo Story, Voice Memo, Family Poll. Each card has a title, description, and a "Create →" button.
- **Your Creations** — a list of past content with title, type badge, creation date, and engagement metrics (views, likes)
- **Floating "+" FAB** — opens a modal for selecting a new content type

### Onboarding
A three-step setup flow for new families.

**Step 1 — Family Values (`/onboarding/values`):**
- Progress indicator (33%)
- Six preset value tiles (Kindness, Respect, Honesty, Curiosity, Resilience, Courage) with toggle selection
- Defaults: Kindness and Honesty pre-selected
- Custom value input for values not in the presets
- Continue button to advance

**Step 2 — Family Rules (`/onboarding/rules`):**
- Progress indicator (66%)
- Four preset rules displayed as a checklist with toggle checkboxes
- Custom rule input field
- An informational callout that rules can always be updated later
- Back and Continue navigation

**Invite Family (`/invite`):**
- Three invite methods via tabs: Share Link (copy-to-clipboard), Email (manual entry + send), QR Code (scannable image)
- Pending invites list showing name, role (Adult/Child), and sent timestamp
- Resend and cancel actions per invite

---

## Technical Architecture

### Component Hierarchy
```
main.jsx
└── ErrorBoundary          ← catches any unhandled render errors
    └── BrowserRouter
        └── App.jsx
            └── AuthProvider
                └── Routes
                    ├── Public routes (Login, Invite, Onboarding)
                    └── ProtectedRoute
                        └── AppLayout
                            ├── <main key={pathname}>   ← fade-in keyed per route
                            │   └── <Outlet>            ← active page component
                            └── BottomNav
```

### Routing Strategy
Route paths are defined in `src/config/paths.js` as a single exported `paths` object. Route definitions (component mappings) live in `src/config/routes.jsx`. This separation breaks the circular import chain that would otherwise occur when page components import `paths` from `routes.jsx` while `routes.jsx` simultaneously imports those page components.

`routes.jsx` re-exports `paths` for convenience, so importing from either file works. All unmatched paths redirect to `/login` via a catch-all fallback route.

### Auth Context
`AuthContext` stores `{ user, token }` in `localStorage`. `ProtectedRoute` reads the context and redirects to `/login` if no valid session exists. The current implementation accepts any non-empty credentials against a hard-coded mock user — replace with a real identity provider for production.

### Shared Hooks
- **`useToast()`** — returns `[toast, showToast]`. Calling `showToast(message)` sets the toast string and clears it after 2200ms. Used across 8+ pages for action confirmation.

### Error Boundary
A class-based `ErrorBoundary` wraps the entire application in `main.jsx`. On any unhandled React error, it renders a friendly recovery screen with a "Refresh Page" button rather than a blank crash screen.

### Page Transitions
`AppLayout` uses React Router's `useLocation` hook to key the `<main>` element by `pathname`. Each route change unmounts the old page and mounts the new one with a `page-fade-in` CSS animation (15ms ease-out opacity + 6px Y translate). The keyframe is defined in `src/index.css`.

---

## UI Patterns

### BackHeader
A reusable `<BackHeader title="..." backTo="/path" rightIcon="icon_name" />` component used by every sub-page. Provides consistent back navigation and an optional right-side icon action.

### BottomNav with Badges
The five-tab bottom navigation renders a red circular badge when a tab's `badge` count is greater than zero. Currently: Sports shows `2` (unread chat messages), More shows `1` (pending appeal).

### Bottom Sheet Modals
Contextual actions that require input (Log Health Event, Select Content Type) use a slide-up bottom sheet pattern with a dimmed overlay. Tapping outside the sheet dismisses it.

### Confirmation Dialogs
Before irreversible decisions (appeal approve/deny/negotiate), a centred modal presents the decision name, the affected person, and Cancel/Confirm buttons. This prevents accidental state changes.

### Toast Notifications
A fixed-position pill (`top-4`, centred, `z-[200]`) appears for 2.2 seconds after successful actions. Used for: photo verification, reward redemption, health event logging, mark-done, and coming-soon placeholders.

---

## Data Layer

All application data is defined in `src/data/mockData.js`:

| Key | Contents |
|-----|----------|
| `familyMembers` | 4 members: Dad (Michael), Mom (Sarah), Leo (12, child), Sarah (9, child) |
| `tasks` | 5 chores with points, due dates, photo requirement flags |
| `rewards` | 4 redeemable rewards with point costs |
| `finances` | Total savings, recent transactions, active loan |
| `portfolio` | 3 mock stocks, portfolio value, 7-day performance series |
| `sports` | Two teams (Soccer, Ballet), schedule, equipment, contacts, chat messages |
| `pets` | Luna's profile, feeding schedule, walk records, vet appointment |
| `healthData` | Leo's health profile, medications, event history |
| `constitution` | Mission statement, core values, rules, signatories |
| `timeline` | 8 entries across October/September grouped by month |
| `pendingInvites` | 2 invited family members |
| `appeal` | Active case #12345 (curfew violation) |
| `governance` | Jury pool members, archived rulings |
| `familyCourt` | 3 active consequences, history, system sync status |
| `creatorStudio` | 3 past posts with engagement metrics |

Derived/computed values (sorted lists, aggregates, filtered sets) are in `src/data/selectors.js` and imported directly by page components.
