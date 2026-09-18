# SPEC: Accountability Reframe (formerly "Family Court")

Spec ID: FHC-SPEC-ACCOUNTABILITY-2026-09-18-001
Created: 2026-09-18
Author lane: Claude (per Totem §15 — architecture/spec/wording/illumination-copy)
Anchors to: `docs/TOTEM-FAMILY-POD-IMPLEMENTATION-PLAN-2026-09-18.md` (Totem ID FHC-POD-TOTEM-2026-09-18-001)
Status: Approved direction — ready to build. Two items still need Tracey (see §11).

---

## 0. Purpose

This spec reframes the module currently coded as **"Family Court"** into **"Accountability."**
It is a shared build anchor for Codex and Claude so both agents implement the same
vocabulary, trigger rules, flow, and boundaries. It is subordinate to the Totem and
inherits every non-negotiable in Totem §16 (AEGIS illuminates, never judges; family
remains sovereign; Assistant is not the authority).

The reframe is **not a teardown.** The existing React shell and most of the appeal /
negotiation surfaces are reused. What changes is (a) the framing and vocabulary of the
Court module, (b) the trigger and routing logic, and (c) one net-new module — the
pattern-mirror journal — that does not exist yet.

---

## 1. The naming decision

| From | To |
|---|---|
| Family Court | **Accountability** (Orb / module name) |
| Consequence Management | (removed — see §5) |

**Why "Accountability."** The word is used in its literal, etymological sense:
*accountable = able to give an account.* To hold someone accountable is not to declare
them guilty — it is to **hand them the floor** to say what happened, from their side.
The name therefore carries the remedy inside it: it answers the founding wound that
*neither parent nor child feels heard* (Totem §1, §6) by making "give your account" the
first act, every time.

**Two properties that must be preserved in implementation:**

1. **Impersonal.** The module names *"a question of accountability is open,"* never
   *"YOU are accountable."* Kept impersonal, the word is self-calibrating: it presses
   only on avoidance and passes over honesty, and it applies equally to a parent who is
   deflecting as to a child. Pointed at a named person, it becomes accusation and loses
   this property. **This is the load-bearing design rule.**
2. **Safe to become accountable.** Productive pressure needs a safe exit — restoration,
   not punishment (§7, and Totem §3). If owning up leads to punishment, the design
   manufactures more concealment (the exact take→conceal→confess loop it exists to heal).

`Reflection` was strongly considered and is retained as the name of the *activity inside*
Accountability (see §6), not the module. It was set aside as the module name because
schools have colonized "reflection" as a euphemism for detention, and because
"Accountability" names the *right granted* (the floor) rather than the task performed.

---

## 2. The arc

```text
Integrity Fracture      →   Accountability        →   Reflection            →   Common Ground
(what happened)             (give your account)       (pattern-mirror work)     (repair reached)
```

- **Integrity Fracture** — the event type that can open an Accountability. A break in the
  family's trust/coherence: an unmet commitment or a possible concealment. (Event term;
  system/parent register. See §4 for child-facing register.)
- **Accountability** — the space that opens. Both parties give their account. Nothing is
  concluded before everyone is heard.
- **Reflection** — the work done inside: the pattern-mirror journal (in-the-moment
  capture + time-delayed re-encounter). Maps to the **R (Reflect)** and **A (Acknowledge)**
  of IDQRA (Totem §7).
- **Common Ground** — the resolution: a restoration plan, agreed, fulfilled.

---

## 3. Core principle: what Accountability is and is not

```text
Accountability opens on an unmet commitment or a possible concealment.
It never presumes bad faith.
It opens the floor for the person to give their account —
and the account itself is what distinguishes a valid reason from an avoidance.
```

- It is **breach-triggered, not outcome-triggered** (see §4).
- It is **account-before-conclusion**: no finding is reached before every party has been heard.
- It is **mutual**: parent and child both give accounts; a deflecting adult is held by the
  same open question as a child.
- The account is **self-authored** — the person's own words — and therefore *is* the
  in-the-moment journal entry the pattern-mirror will hand back later (§6). The mechanism
  and the name are the same thing.

---

## 4. Trigger rule and two-door routing

The single most important logic in this module. A negative event is routed to one of two
doors by **what kind of thing it is**, not by how bad it is.

| Door | Fires on | Nature | Examples | Destination |
|---|---|---|---|---|
| **Support** | an *outcome / signal* | illuminates a **gap** | bad report card; lost a game; struggling with a subject | Support flow — help & curiosity ("what's getting in the way?"). Homework Helper / School / Care Orb. **No account owed.** |
| **Accountability** | an *unmet commitment* or *possible concealment* | a **fracture** (possible) | didn't do an agreed chore; said homework was done and it wasn't; hid the report card | Accountability flow (§6). Account given first; branch on the account. |

**Worked distinction (from design discussion):**

- *Bad report card* → an **outcome**. Nothing was promised-then-broken. Could mean
  struggle, a learning difference, something emotional, or teaching that didn't land.
  Routing this to Accountability would put a child who may need *help* on trial for a
  character failing — a re-wounding, and a violation of the self-calibrating property
  (a child who studied hard and still failed *is* being accountable → should feel no
  pressure). → **Support door.**
- *Undone chore* → an **unmet commitment**. They agreed; it didn't happen. → **Accountability
  door — but breach is not assumed.** The child gives their account:
  - *valid reason* ("I was sick," "I was helping Grandma," "didn't know it was today")
    → no fracture; may reroute to Support or simply resolve. They were being accountable.
  - *avoidance or cover story* → the fracture is real; the pattern-mirror now has
    something to reflect gently over time.

A report card only enters Accountability if a fracture is *wrapped around* it (a
concealment or a broken commitment), never for the grade itself.

---

## 5. Vocabulary map (retext of the coded module)

The active file `src/pages/more/FamilyCourtPage.jsx` currently uses judgment/punishment
language that the AEGIS invariant (Totem §3) forbids. Replace per this table. Where a term
has two registers, use the **dual register** (RBC age-aware wording, Totem §7): the
system/parent view may use the precise term; the child-facing label softens.

| Current (banned) | System / parent register | Child-facing register |
|---|---|---|
| Family Court | Accountability | Accountability |
| Consequence Management | — (removed) | — |
| Active Measures / consequences | Open accounts / restoration steps | "What we're working on" |
| Violation / Rule Violated | Integrity Fracture | "What happened" |
| Enact Consequence | Open an Accountability | "Talk it through" |
| Verdict / decision | (none — no verdicts) | (none) |
| Appeal | Your account / Share your side | "Your side" |
| Negotiation | Working it out / Finding common ground | "Working it out" |
| Resolution Confirmed | Common Ground reached | "We're good" / "Restored" |

**Copy guardrails (hard):** never emit *judge, verdict, guilty, blame, fault, violation,
punishment, offender, defendant, sentence.* Prefer *observation, account, what happened,
pattern, restoration, common ground, repair, acknowledge.*

---

## 6. The Accountability flow (target)

```text
1. An Integrity Fracture opens an Accountability (impersonal; no defendant named).
2. Each party gives their ACCOUNT — self-authored, captured in the moment,
   before the story is smoothed over. Parent accounts too. (Both are heard.)
3. Branch on the accounts:
     a. valid reason        → resolve, or reroute to Support. No fracture.
     b. avoidance / cover   → continue.
4. REFLECTION (pattern-mirror): the person's own prior accounts of similar events are
   surfaced after a deliberate delay, or when the same shape recurs. The person meets
   their own words and sees the pattern themselves (IDQRA R + A). Nobody tells them.
5. Working it out: both parties reach terms (reuse negotiation surface).
6. COMMON GROUND: a restoration plan (repair, not punishment), acknowledged and recorded.
7. Transparency Orb record written (Totem §7).
```

**The pattern-mirror (net-new; the heart).** Derived directly from the founding method:
a child wrote her thoughts *during* an event, and two weeks later re-read her own words and
saw the repeating pattern herself. Requirements:

- **In-the-moment capture** — low-friction; records thoughts *while/near* the event, kept
  distinct from any later retelling. The in-the-moment record is the honest one.
- **Time-delayed re-encounter** — the app *holds* entries and brings them back after a
  delay, or when the same fracture shape recurs ("here is what you wrote the last two
  times this happened — what do you notice?").
- **Self-illumination** — the app surfaces *the person's own words*; it never states a
  verdict or tells them the pattern. It poses the IDQRA question whose answer is
  self-evident once they read themselves.

---

## 7. Reuse map (against current code)

Active source of truth is **`src/`** (Vite + React JSX). `FHC-ALL-MODULES/` and
`OLD_FAMILY_HUB_CONNECT_FULL/` are legacy duplicate trees (Totem §14 Phase 1) — inventory,
do not import casually. `[confirmed]` = read during survey; `[verify]` = inferred from name
+ grep, confirm before relying.

| File | Action | Notes |
|---|---|---|
| `src/pages/more/FamilyCourtPage.jsx` | **Reframe** | `[confirmed]` Retext per §5; reshape data from `consequences[]` → `sessions[]/accounts[]/restorationPlan` (§8). Rename file to `AccountabilityPage.jsx`. |
| `src/pages/more/AppealPage.jsx` | **Reuse + build on** | `[confirmed]` Already captures structured self-reflection (`reason`, `alternative`, `learned`). This is the seed of "give your account." Generalize to any party. |
| `src/pages/more/NegotiationPage.jsx` | **Reuse** | `[confirmed]` Genuine both-voices surface (child/parent messages + proposals) → "Working it out." |
| `src/pages/more/ResolutionConfirmedPage.jsx` | **Reuse + reframe** | `[verify]` Becomes "Common Ground" — home of the restoration plan. |
| `src/pages/more/AppealReviewPage.jsx` | **Reuse + reframe** | `[verify]` Parent's account/response surface; keep mutual, not adjudicative. |
| `src/pages/more/TimelinePage.jsx` | **Reuse as substrate** | `[verify]` Data substrate the pattern-mirror draws from. |
| `src/pages/more/FamilyGovernancePage.jsx` | **Leave** | `[verify]` Separate Orb; keep distinct from Accountability. |
| Pattern-mirror journal | **Build new** | Does not exist. §6. The heart of the module. |
| React shell (router, mock data, Toast, modals, dark mode, ProtectedRoute, dashboards) | **Keep as-is** | Solid; no rework. |

Reusable share is high (~70–80% of shell + appeal/negotiation surfaces). Net change =
reframe of the Court module + one new module.

---

## 8. Data model sketch (mock-data layer, `src/data/`)

Reshape `familyCourt` (`stats/consequences/history`) into an account-first model. Illustrative:

```ts
type AccountabilitySession = {
  id: string;
  event: { type: 'integrity_fracture'; description: string };
  trigger: 'unmet_commitment' | 'possible_concealment';
  status: 'account_open' | 'reflecting' | 'working_it_out' | 'common_ground';
  accounts: Array<{                    // both parties; self-authored
    authorId: string;
    role: 'child' | 'parent' | 'guardian' | 'other';
    text: string;
    capturedAt: string;                // in-the-moment timestamp
  }>;
  outcome?: 'valid_reason' | 'rerouted_to_support' | 'restoration';
  restorationPlan?: { steps: string[]; acknowledgedBy: string[] };
  patternRefs?: string[];              // links to prior journal entries (the mirror)
};

type JournalEntry = {                  // the pattern-mirror engine
  id: string;
  authorId: string;
  text: string;
  capturedAt: string;
  eventRef?: string;
  resurfaceAfterDays?: number;         // deliberate delay before re-encounter
};
```

No verdict/consequence fields. No scalar "score" surfaced to users (see §9).

---

## 9. Relationship to IRG (Totem §7)

Per Totem, IRG's seven virtues and math are **not yet specified** — build against
placeholder virtue keys, no final scoring claims. For this module specifically: when IRG
is eventually wired in, **lead with the written observations, not the numbers.** The
founding method proves the point — healing came from the person's own words, not from a
score; not one number was in the room. IRG readings, when they exist, sit *behind* the
account as instrumentation, never as a grade shown to a child.

---

## 10. Non-negotiables (this module)

- Illumination, never judgment (Totem §3). Copy guardrails in §5 are hard.
- Impersonal ("a question of accountability"), never a named accusation (§1).
- Breach-triggered, not outcome-triggered (§4). Bad outcomes route to Support.
- Account-before-conclusion; mutual (both parties heard) (§3, §6).
- Safe to become accountable — restoration, not punishment (§1, §7).
- No IRG scalar shown to users; lead with words (§9).
- Family remains sovereign; the Assistant may organize/summarize accounts and present
  requested reflections but does not judge, decide, or conclude (Totem §8, §16).

---

## 11. Open — needs Tracey

1. **Re-encounter timing.** Fixed delay (e.g. 2 weeks, per the founding method),
   recurrence-based ("the 3rd time this shape appears"), or both? Affects the mirror.
2. **IRG seven virtues.** Still pending formalization (Totem §7, §15 shared checkpoint) —
   blocks any IRG scoring; does not block the account/reflection/restoration flow, which
   should be built first.

---

## 12. Suggested build order (Codex lane, per Totem §15)

1. Rename + retext `FamilyCourtPage.jsx` → `AccountabilityPage.jsx` (§5). No logic change yet.
2. Reshape mock data to the account-first model (§8).
3. Wire the two-door router: outcome→Support, commitment/concealment→Accountability (§4).
4. Generalize `AppealPage` into "give your account" for any party; make it mutual (§6 step 2).
5. Reuse `NegotiationPage` → "Working it out"; `ResolutionConfirmedPage` → "Common Ground" + restoration plan (§7).
6. Build the pattern-mirror journal: in-the-moment capture + delayed/recurrence re-encounter (§6). **Net-new; the heart.**
7. Transparency Orb record on close (Totem §7).

Do not wire IRG scoring until §11.2 is resolved (Totem §15 checkpoint).

END SPEC
