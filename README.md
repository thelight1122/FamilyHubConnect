# FamilyHubConnect

**A mobile-first family management platform built with React 19 and Tailwind CSS.**

FamilyHubConnect brings together every aspect of family life — chores, finances, sports, health, pets, and governance — into a single, beautifully designed app optimised for mobile devices.

---

## Features

- **Dashboard** — Personalised home screen with schedule, points balance, and notifications
- **Finance Hub** — Family savings overview, member wallets, transaction history, and financial tools
- **Market Simulator** — Kid-friendly stock market game for teaching investing fundamentals
- **Family Bank** — Interest-free family loan management with repayment tracking
- **Chores & Rewards** — Task checklist with photo verification and a redeemable points rewards store
- **Sports & Locker Room** — Multi-team schedule, equipment checklist, contacts, and team chat
- **Health Logs** — Member health profiles, event logging, medication tracking, and history
- **Pet Hub** — Feeding schedule, walk tracking, and vet appointment reminders
- **Family Timeline** — Filterable memory board for achievements, memories, and journal entries
- **Family Constitution** — Mission statement, core values, and family rules
- **Family Governance** — Appeals system, jury pool, archived rulings, and rule book
- **Family Court** — Active consequences with progress tracking and mark-done functionality
- **Creator Studio** — Family content hub for photo stories, voice memos, and polls
- **Onboarding** — Values selector, rules setup, and family invite flow

---

## Tech Stack

| Layer | Technology |

| Framework | React 19.2 |
| Router | React Router DOM 7.13 |
| Build tool | Vite 7.3 |
| Styling | Tailwind CSS 3.4 |
| Icons | Material Symbols Outlined (Google Fonts CDN) |
| State | Context API + localStorage |
| Font | Plus Jakarta Sans (Google Fonts CDN) |

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# Clone the repository
git clone <repo-url>
cd FamilyHubConnect

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Demo Credentials

The app uses mock authentication — any password is accepted.

| Field | Value |

| Email | `david@thompson.family` |
| Password | *(any value)* |

---

## Available Scripts

| Script | Description |

| `npm run dev` | Start Vite dev server with HMR on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Project Structure

src/
├── components/         # Shared UI components
│   ├── AppLayout.jsx       # Root layout with bottom nav + page transitions
│   ├── BackHeader.jsx      # Reusable page header with back button
│   ├── BottomNav.jsx       # 5-tab navigation bar with badge support
│   ├── ErrorBoundary.jsx   # Top-level error boundary with recovery UI
│   ├── ProtectedRoute.jsx  # Auth guard wrapper
│   └── Toast.jsx           # Fixed-position toast notification
│
├── config/
│   ├── paths.js            # Route path constants (source of truth)
│   └── routes.jsx          # Route definitions + re-exports paths
│
├── context/
│   └── AuthContext.jsx     # Auth state + localStorage persistence
│
├── data/
│   ├── mockData.js         # All app data (family, finances, sports, etc.)
│   └── selectors.js        # Derived/computed data helpers
│
├── hooks/
│   └── useToast.js         # Toast state hook (auto-clears after 2.2s)
│
└── pages/
    ├── DashboardPage.jsx
    ├── ChoresPage.jsx
    ├── LoginPage.jsx
    ├── finance/            # FinancePage, MarketPage, LoanPage, LoanConfirmationPage
    ├── sports/             # LockerRoomPage, TeamChatPage
    ├── more/               # MorePage + 10 sub-pages
    └── onboarding/         # InviteFamilyPage, OnboardingValuesPage, OnboardingRulesPage

---

## Architecture Notes

### Circular Dependency Fix

Route path constants (`paths`) live in `src/config/paths.js` — separate from `src/config/routes.jsx`. This prevents a temporal dead zone (TDZ) error that occurs when page components import `paths` from `routes.jsx` while `routes.jsx` is still importing those same page components. `routes.jsx` re-exports `paths` for convenience:

```js
import { paths } from './paths';
export { paths } from './paths';
```

### Authentication

Auth state is managed by `AuthContext` and stored in `localStorage`. `ProtectedRoute` reads the context and redirects unauthenticated users to `/login`. The current implementation uses mock auth — replace `AuthContext.jsx` with a real auth provider for production.

### Mobile-First Layout

All pages are constrained to `max-w-md` (~428px) and centred on wider screens. The bottom navigation is `fixed` with a `z-50` stacking context. Page transitions use a CSS `page-fade-in` keyframe animation keyed by `pathname` in `AppLayout`.

### Data Layer

All data lives in `src/data/mockData.js`. Computed values (sorted members, filtered lists, derived totals) are in `src/data/selectors.js`. Replace these with API calls or a state management library when connecting a real backend.
