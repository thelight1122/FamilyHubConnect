# SPEC: Pattern-Mirror (the Reflection engine inside Accountability)

Spec ID: FHC-SPEC-PATTERNMIRROR-2026-09-18-001
Created: 2026-09-18
Author lane: Claude (per Totem §15)
Anchors to: `docs/SPEC-ACCOUNTABILITY-REFRAME-2026-09-18.md` (§6) and
`docs/TOTEM-FAMILY-POD-IMPLEMENTATION-PLAN-2026-09-18.md` (Totem ID FHC-POD-TOTEM-2026-09-18-001)
Status: Draft for review. This module has **no code yet** — it is net-new and is the heart
of Accountability.

---

## 0. Purpose

The pattern-mirror is the mechanism that makes Accountability *illuminate* rather than
*judge*. It captures a person's own words about an event, holds them, and returns them to
that person later — so the person recognizes their own pattern instead of being told it.
This spec details what §6 of the reframe spec names but does not fully specify.

---

## 1. Origin (the founding method — this is the design source of truth)

A grandmother had her granddaughter write in a journal at the time of an event, answering
a few questions about what happened and what she was thinking *while it was occurring.*
Two weeks later, the grandmother asked her to read what she had written. The child read her
own words and **saw the repeating pattern herself.** No one told her; no one judged her.

Every design choice below exists to reproduce that moment. Three moves:

```text
CAPTURE (in the moment)  →  HOLD (let time pass)  →  RE-ENCOUNTER (meet your own words)
```

**Self-illumination invariant:** the app surfaces *the person's own words* and asks a
question whose answer is self-evident once they read themselves. The app never states the
pattern, never interprets, never judges. (Totem §3.)

---

## 2. IDQRA mapping (Totem §7)

| IDQRA | Where it happens in the pattern-mirror |
|---|---|
| **I** — Identify what is present | Capture: "what's happening right now?" |
| **D** — Describe what it indicates | Capture: "what were you thinking / feeling while it happened?" |
| **Q** — Pose the question whose answer is self-evident from outside | Re-encounter: "here's what you wrote the last times — what do you notice?" |
| **R** — Reflect on the answer | Re-encounter: the person reads their own words across time |
| **A** — Acknowledge what has become visible | Re-encounter: optional new entry — "what do you see now?" |

---

## 3. Capture (in-the-moment)

A short, guided prompt set — **not a blank box** (the grandmother asked specific
questions). Low-friction so it can be done *during or right after* the event, before the
account gets smoothed over. The in-the-moment record is the honest one; it is kept
**distinct from any later retelling** (the take→conceal→confess loop is exactly why).

Core prompts (system register / child-facing register — RBC age-aware, Totem §7):

1. What's happening right now? · *"What's going on?"*
2. What were you thinking while it was happening? · *"What was going through your head?"*
3. What were you feeling? · *"How did it feel?"* (optional mood tag)
4. What did you want to happen? · *"What did you want?"*

Constraints:
- Answers are optional per-field; capturing *anything* beats a perfect entry.
- No "what should you have done?" at capture — that is retrospective and leading. It
  belongs (optionally) at re-encounter, as the person's own R+A, never as a prompt that
  pre-writes their conclusion.
- Capture can be initiated standalone (any time) **or** as the "give your account" step of
  an Accountability session (§7). When tied to a session, the account *is* the entry.

---

## 4. Hold + recurrence detection

Entries are held and become eligible to return in two ways:

1. **Time-delayed** — a deliberate delay before re-encounter (the founding method used
   ~2 weeks). Configurable.
2. **Recurrence-based** — when the same *shape* of event recurs, prior same-shape entries
   become eligible ("the last two times this happened…").

**Shape = structured, not prose.** Recurrence is detected on structured metadata only —
`triggerType` + `eventCategory` + optional tags — **never** by an AI reading the private
prose (Totem §9; see §8). A `Shape` is a deterministic key; when ≥ N prior entries share a
shape within a window, a recurrence re-encounter becomes eligible. Rule-based in v1
(Totem §7/§15: deterministic stubs before any model logic). No AI required to ship this.

Timing (delay length, N, window) is a family/values decision — see §13.

---

## 5. Re-encounter (the moment that heals)

Delivery is a **gentle invitation, never a summons** (mirrors "open, don't call to"):

```text
1. Invitation (opt-in): "You wrote about something like this before. Want to look together?"
2. Present the person's OWN prior same-shape entries, oldest→newest, verbatim.
3. Pose the self-evident question (IDQRA Q):
     "Read what you wrote. What do you notice?"
   — never "You did this again," never a stated pattern.
4. Optional NEW entry (IDQRA R+A): "What do you see now?" → becomes a new journal entry,
   extending the longitudinal thread.
5. The person may stop at any point. Stopping is a valid outcome, not a failure.
```

Modes:
- **Solo** — the person meets their own words privately.
- **Facilitated** — done *with* a guardian present (the grandmother-with-child mode). The
  guardian facilitates; the words still belong to, and are read by, the author. Mode is set
  by the family's visibility policy (§8, §13), not forced by the app.

---

## 6. Entry lifecycle

```text
captured  →  held  →  eligible (time and/or recurrence)  →  resurfaced  →  acknowledged
                                                                    ↓
                                                    (optional new entry → new thread node)
```

---

## 7. Relationship to Accountability (reframe spec §6)

- An **account** given in an Accountability session **is a journal entry**, tagged to that
  session's fracture (`eventRef`). So "give your account" and "capture" are the same act.
- The pattern-mirror also runs **standalone** — not every entry needs a fracture. A child
  (or parent) can journal freely; those entries participate in the same
  hold/re-encounter mechanics.
- Re-encounter is what feeds step 4 (Reflection) of the Accountability flow, and what turns
  a repeated fracture into self-seen pattern rather than repeated punishment.

---

## 8. Privacy & consent (critical — the mechanism depends on it)

The mechanism only works if the space feels **honest and safe**. If a child believes a
parent is auto-reading every entry, they write for the audience, not the truth — which
destroys the whole thing. So:

- **Prose is author-private by default.** The illumination is the person meeting *their
  own* words. Raw entry text is not guardian-visible unless the family's configured policy
  and the author's consent allow it.
- **Recurrence signal ≠ prose.** Because recurrence uses structured `Shape` metadata (§4),
  a guardian can be told *"a pattern is recurring"* and offered a facilitated re-encounter
  **without** the app exposing the child's private words. Support without surveillance.
- **No-Model by default (Totem §9).** Raw journal prose must never enter AI prompts,
  memory, logs, embeddings, or analytics. The Assistant operates on structured metadata and
  AI-safe shadows only. Journal prose is a **Tumbler Locking candidate** (Totem §10) —
  client-encrypted where feasible.
- **Guardian oversight is preserved** (family remains sovereign, Totem §16) via the
  recurrence signal, facilitated mode, and the family visibility policy — not via silent
  reading of a child's private prose.

Default visibility policy and age thresholds are a values decision — see §13.

---

## 9. Data model (extends reframe §8)

```ts
type JournalEntry = {
  id: string;
  authorId: string;
  role: 'child' | 'parent' | 'guardian' | 'other';
  prompts: {                            // the guided capture (§3); each optional
    happening?: string;
    thinking?: string;
    feeling?: string;
    moodTag?: string;
    wanted?: string;
  };
  capturedAt: string;                   // in-the-moment timestamp
  eventRef?: string;                    // links to an AccountabilitySession fracture, if any
  shape: Shape;                         // structured; drives recurrence (§4)
  visibility: 'author_private' | 'facilitated' | 'guardian_shared'; // per family policy (§8)
  resurfaceAfterDays?: number;          // time-delayed eligibility
  resurfacedAt?: string;                // when the person re-encountered it
  parentEntryId?: string;               // longitudinal thread: a "what do you see now?" node
};

type Shape = {                          // NON-prose recurrence key
  triggerType: 'unmet_commitment' | 'possible_concealment' | 'standalone';
  eventCategory: string;                // e.g. 'chore', 'belongings', 'truth-telling'
  tags?: string[];
};

type ReEncounter = {
  id: string;
  authorId: string;
  shape: Shape;
  entryIds: string[];                   // the prior same-shape entries, oldest→newest
  mode: 'solo' | 'facilitated';
  triggeredBy: 'time' | 'recurrence';
  outcome?: 'noticed' | 'new_entry' | 'stopped';
};
```

---

## 10. Assistant boundary (Totem §8, §16)

The Assistant **may**: initiate the gentle invitation, assemble and present the person's own
prior entries, and pose the fixed self-evident question. The Assistant **must not**:
summarize, interpret, name, or grade the pattern; read prose into any model context by
default; or conclude anything. It hands back the person's words; the person does the seeing.

---

## 11. Emotional & child safety

- Re-encountering your own words about a hard moment can sting. Framing is gentle; the
  invitation is opt-in; the person can stop anytime (§5).
- No streaks, scores, or "you've done this N times" counters shown to the person — that is
  tallying, not illumination (reframe §9).
- Age-aware wording throughout (RBC, Totem §7).
- If an entry surfaces a safety concern (harm, abuse), that is a separate escalation path —
  out of scope here, flagged for a safety spec.

---

## 12. Non-negotiables (this module)

- Surface the person's own words; never state the pattern (§1, §10).
- In-the-moment capture kept distinct from later retelling (§3).
- Recurrence on structured shape, never on AI-read prose (§4, §8).
- Prose author-private by default; support via recurrence signal, not surveillance (§8).
- Raw prose is No-Model; Tumbler candidate (§8; Totem §9, §10).
- Invitation, never summons; stopping is valid (§5).
- No scores/streaks/counters to the person (§11).

---

## 13. Open — needs Tracey

1. **Re-encounter timing.** Delay length (2 weeks?), recurrence threshold N, and window.
   (Same item as reframe §11.1.)
2. **Default visibility policy + age thresholds.** Is a young child's prose ever
   guardian-visible, and at what age does it become author-private by default? What is the
   default mode (solo vs. facilitated) by age? This is a family-values call; the mechanism
   argues for author-private prose as early as feasible, with facilitated re-encounter as
   the guardian-involved path.
3. **Capture prompt wording** per age band — draft in §3 is a starting point.

---

## 14. Build order (Codex lane, per Totem §15)

1. `JournalEntry` + `Shape` types and mock data (§9).
2. Capture UI — guided prompt set, standalone entry point (§3). Reuse `AppealPage` input
   patterns as the base component.
3. Hold + deterministic recurrence detection on `Shape` (§4). Rule-based; no AI.
4. Re-encounter UI — invitation → own entries verbatim → self-evident question → optional
   new entry (§5). Solo mode first.
5. Wire capture as the "give your account" step of an Accountability session (§7).
6. Facilitated mode + family visibility policy scaffolding (§5, §8) — behind the
   visibility decision (§13.2).
7. Enforce No-Model boundary: recurrence + Assistant read structured fields only; prose
   excluded from all AI payloads (§8, §10). Add a leak test (Totem §10 Phase 5 style).

Deterministic first; no model integration until boundaries above are enforced (Totem §17).

END SPEC
