# TOTEM: Family Hub Connect AEGIS Family POD Implementation Plan

Totem ID: FHC-POD-TOTEM-2026-09-18-001
Created: 2026-09-18
Repository: G:\AEGIS FAMILY-HUB-CONNECT
Purpose: Shared implementation anchor for Codex and Claude so both agents can split coding work while preserving the same architecture, boundaries, and product intent.

## 1. Core Product Thesis

Family Hub Connect is not a child-management app.

It is an AEGIS Family POD: a shared family operating environment where adults and children both have real reasons to be present, participate, communicate, and regulate the household environment together.

The central product insight is that most family apps fail because they focus on children while parents are reduced to app managers. Family Hub Connect must include practical adult-use Orbs so adults live inside the same app environment as the children.

Adult presence is especially important for Family Court, Family Governance, behavior events, restoration plans, and family messages. Remote or unavailable adults should be able to join or participate through video call, review, acknowledgement, and recorded participation workflows.

## 2. Top-Level Architecture

```text
Family Hub Connect
└── Family POD
    ├── AEGIS SEEDed AI Assistant
    ├── Model Governance Layer
    │   ├── PIM
    │   ├── IRG Gauge
    │   ├── IDQRA Logic Loop
    │   ├── RBC
    │   └── IDS, conditional
    ├── Tumbler Locking System
    ├── No-Model Vault
    ├── Transparency Orb
    ├── Steward Controls
    └── Domain Orbs
```

The POD is the bounded family environment.

The Orbs are the operating domains.

The AI Assistant lives inside the POD and may coordinate across Orbs only through approved governance pathways.

The family remains sovereign. The Assistant serves the structure; it does not own the Orbs, judge the family, or become the authority.

## 3. AEGIS Invariant

ALL of AEGIS is about illumination, never judgment.

Implementation language and UI copy must preserve this:

```text
AEGIS does not judge the person.
AEGIS illuminates the pattern.

AEGIS does not declare guilt.
AEGIS clarifies what is present.

AEGIS does not force agreement.
AEGIS invites reflection.

AEGIS does not replace family authority.
AEGIS makes context visible so the family can choose.
```

Avoid product language such as:

- judge
- verdict
- moral grade
- blame
- fault assignment
- diagnosis
- punishment recommendation

Use language such as:

- observation
- illumination
- integrity signal
- coherence signal
- visible pattern
- reflection prompt
- acknowledgement path
- context made clear

## 4. Standard Base Feature Set

Standard Family POD pricing target:

```text
$10/month for up to 4 family members
$2.50/month for each additional family member
```

Family members may include parents, children, grandparents, caregivers, trusted adults, or household members. This lets a single-parent family include a grandparent or caregiver within the base plan.

Standard Base Orbs:

- Family Governance Orb
- Family Court Orb
- Family Creed / Constitution Orb
- Chores & Rewards Orb
- Digital Desk Orb
- Medical & Care Vault Orb
- Calendar & Reminders Orb
- Family Timeline Orb
- Contacts & Emergency Info Orb
- Family Messages Orb
- Auto Maintenance Minder Orb
- Home Maintenance Custodian Orb
- Subscription Minder Orb
- Transparency Orb

Recommended optional / upgrade Orbs:

- Secure Transactions Orb
- Finance Learning Orb
- School Portal Orb
- Sports Team Orb
- Pet Care Orb
- Smart Home Orb
- Elder Care Orb
- Legal Documents Orb
- Insurance Management Orb
- Creator Studio Orb
- Advanced AI Steward Orb

## 5. Adult Engagement Requirement

Adult utility is a base-product requirement, not a side feature.

Adults need reasons to open the app daily:

- auto maintenance reminders
- home maintenance tasks
- subscription reminders
- household documents
- care reminders
- child appeals
- Family Court participation
- shared family messages
- household calendar
- digital desk tasks

The intended effect is that adults are already present inside the POD when family communication, discipline, governance, and care workflows need them.

## 6. Family Court Participation

Family Court must support shared adult participation.

Target workflow:

```text
Incident or behavior issue occurs
→ Family Court session opens
→ available adult joins in person or through the app
→ remote adult can join by video call or review flow
→ child can speak, write, or submit an appeal
→ IRG / IDQRA may be requested for illumination
→ restoration plan is created
→ adult participants acknowledge or add notes
→ resolution is recorded
```

The app should support both parents or guardians as equal and active participants in discipline and environment regulation.

## 7. Model Governance Layer

The model governance flow is:

```text
User / Orb Event
→ PIM
→ IRG Gauge, when requested or relevant
→ IDQRA Logic Loop, when requested or relevant
→ RBC
→ Assistant response or proposed action
→ IDS only if incoherence, drift, leak risk, coercion, or boundary conflict appears
→ Transparency Orb record
```

### PIM

Perception / input mediation.

Responsibilities:

- identify speaker
- identify role
- identify Orb source
- classify sensitivity
- determine consent state
- preserve context boundaries before routing

### IRG Gauge

Integrity Resonance Gauge.

The IRG mathematically gauges the integrity of a message across seven virtues.

Important boundary:

```text
IRG measures the integrity structure of the message.
IRG does not judge the person.
IRG does not assign moral worth.
IRG does not decide guilt.
```

The seven virtues need to be defined in a dedicated implementation spec before coding the scoring logic. Until then, build the IRG service interface with placeholder virtue keys, not final scoring claims.

Suggested interface shape:

```ts
type IrgGaugeResult = {
  messageId: string;
  virtues: Array<{
    key: string;
    label: string;
    signal: number;
    observation: string;
  }>;
  overallObservation: string;
  confidence: number;
};
```

### IDQRA Logic Loop

IDQRA is the reflective illumination sequence:

```text
I — Identify what is present
D — Describe what it indicates
Q — Pose the question whose answer is self-evident from the outside
R — Reflect on the answer
A — Acknowledge what has become visible
```

Boundary:

```text
IDQRA does not accuse.
IDQRA does not diagnose.
IDQRA does not decide guilt.
IDQRA does not force agreement.
IDQRA illuminates what is already present.
```

### RBC

Reflective Boundary Conditions.

Responsibilities:

- keep output non-force
- keep output proportional
- preserve child-safe and age-aware wording
- block shame, blame, coercion, diagnosis, and verdict language
- require human approval for any state-changing action

### IDS

Integrity Detection System.

Conditional, not always active.

Activates when:

- incoherence appears
- sensitive data leak risk appears
- prompt contamination appears
- AI output drifts toward judgment or coercion
- Orb permissions conflict
- a request crosses into No-Model Vault territory
- a transaction or external-risk workflow is attempted

IDS should reroute incoherence to its originator or to the appropriate review path. IDS is not a punishment gate.

## 8. AEGIS SEEDed AI Assistant

The Assistant lives inside the Family POD.

It is SEEDed with:

- AEGIS illumination-only invariant
- family-approved values
- Family Creed / Constitution
- role permissions
- consent rules
- age-aware language boundaries
- model governance behavior
- No-Model Vault restrictions

The Assistant may:

- summarize chores
- explain family rules
- help draft appeals
- prepare family meeting notes
- organize Digital Desk items
- summarize non-sensitive reminders
- assist with in-app allowance and savings flows
- present requested IRG / IDQRA observations
- propose next steps for guardian approval

The Assistant must not:

- access No-Model Vault raw data
- read medical records
- read insurance documents
- read school addresses
- read legal identity records
- access external financial records
- execute outside transactions
- contact outside parties without explicit human action
- bypass guardian approval
- issue judgments or verdicts

## 9. No-Model Vault

The No-Model Vault contains data the AI never needs access to.

No-Model Vault data includes:

- medical information
- insurance information
- children's legal names
- school names and addresses
- home addresses
- birthdates
- IDs and documents
- private family notes
- external financial records
- bank records
- card records
- real investment records
- outside transaction details

No-Model Data Rule:

```text
Sensitive identity, medical, insurance, school, address, legal, external-financial, and document data must never be included in AI prompts, AI memory, AI logs, embeddings, analytics, debugging payloads, or support views.
```

The app may create AI-safe operational shadows:

```text
Raw vault data:
"Emily Thompson, Lincoln Elementary, 123 School Rd..."

AI-safe shadow:
"Child A has a pickup reminder at 3:15 PM."
```

## 10. Tumbler Locking System

The Tumbler Locking system provides zero-knowledge sensitive data protection.

Goal:

```text
The client may use their data.
The backend may store encrypted data.
The service operator must not be able to read client data.
The AI model must not receive client private data.
```

Recommended pattern:

```text
Client Device
→ Tumbler Lock encrypts sensitive data locally
→ encrypted records sync to backend
→ backend stores ciphertext only
→ AI receives only user-approved, redacted, minimized operational context
```

Key structure:

```text
Family Master Key
├── Guardian Key
├── Device Key
├── Member Key
├── Orb Key
└── Record / Data Key
```

Implementation boundary:

- no backend-held master keys
- no plaintext vault fields in the database
- no raw vault records in AI prompts
- no raw vault records in logs
- no support/admin "view client data" tooling
- password reset must not silently recover encrypted family data

If true zero-knowledge is used, lost keys can mean lost data. Implement recovery deliberately:

- guardian recovery key
- printed recovery phrase
- second guardian approval
- trusted-device recovery
- optional encrypted family emergency export

## 11. Finance Boundary

The Finance Orb is for in-app family economy and education.

Allowed in standard / regular Finance Orb:

- allowance
- points
- chore rewards
- savings jars
- family loan requests
- mock market simulator
- age-appropriate financial education

External real-world finance is No-Model Vault and client-controlled:

- bank account records
- credit card data
- insurance payments
- real investment accounts
- payroll / income records
- outside purchases
- external transfers

Architecture rule:

```text
The AI Assistant may help manage the in-app family economy, including allowance, savings jars, rewards, family loans, and educational finance simulations. It must never access, analyze, store, or act on external financial records or real-world financial accounts. Outside transactions remain solely under client control.
```

## 12. Secure Transactions Orb, Optional Later

Real-world transactions should be isolated into a separate Secure Transactions Orb, not placed inside the normal Finance Orb.

Secure Transactions Orb requirements:

- no default AI access
- no stored account credentials
- no raw card / bank data in app database
- tokenized provider connections only
- explicit guardian authorization per action
- multi-step confirmation
- transaction preview before execution
- immutable audit record
- revocation controls
- spending limits
- provider-side compliance boundary
- human final consent required

The AI may explain the transaction screen or summarize non-sensitive pending approval metadata. It must not view full account data, initiate external transfers on its own, approve payments, bypass confirmation, store credentials, or make financial decisions.

## 13. Hosting / Runtime Recommendation

Use a split runtime:

```text
Vercel
└── shared web app / mobile-first frontend

Cloud Run
└── Family POD runtime
    ├── AEGIS SEEDed Assistant service
    ├── PIM
    ├── IRG
    ├── IDQRA
    ├── RBC
    ├── IDS
    ├── Orb context APIs
    ├── transparency writer
    └── model provider calls
```

Storage recommendation:

- Postgres for structured POD / Orb records
- encrypted object storage for vault documents
- append-only transparency / audit tables
- ciphertext-only storage for No-Model Vault data

AI calls should be server-side only through the Family POD runtime, never directly from the client.

## 14. Implementation Phases

### Phase 1: Repo and Architecture Inventory

- Identify active app source of truth.
- Map current routes to Orbs.
- Identify duplicate legacy module sets and decide import strategy.
- Document current data sources, auth, routes, and test coverage.
- Do not delete legacy folders until their contents are inventoried.

### Phase 2: Family POD Shell

- Create `src/pod/` or equivalent architecture layer.
- Define Family POD provider / context boundary.
- Define Orb registry.
- Define Orb contract:
  - id
  - label
  - route ownership
  - role permissions
  - data classification
  - AI access level
  - vault access rules
  - transparency behavior

### Phase 3: Convert Standard Modules Into Orbs

Start with existing implemented flows:

- Family Governance
- Family Court
- Constitution / Creed
- Chores
- Digital Desk
- Medical / Health
- Calendar / Reminders
- Timeline
- Messages

Then add adult utility Orbs:

- Auto Maintenance Minder
- Home Maintenance Custodian
- Subscription Minder

### Phase 4: Model Governance Interfaces

Create service interfaces before model logic:

- `pim.classifyInput`
- `irg.gaugeMessageIntegrity`
- `idqra.createReflection`
- `rbc.applyOutputBoundaries`
- `ids.inspectGovernanceEvent`
- `transparency.recordGovernanceEvent`

Use deterministic stubs first. Do not claim final IRG scoring until the seven virtues and math are specified.

### Phase 5: No-Model Vault and Tumbler Locking

- Define data classification enum.
- Define No-Model Vault record type.
- Build encrypted local vault proof of concept.
- Store ciphertext only.
- Create AI-safe shadow records.
- Add leak tests proving vault fields cannot enter AI payloads.

### Phase 6: Assistant Shell

- Build assistant panel inside the POD.
- Assistant starts in standard bounded mode.
- Assistant reads only AI-safe Orb context.
- Add visible "what was used / withheld" transparency output.
- Add refusal / redirect copy for vault data and external finance.

### Phase 7: Family Court IRG / IDQRA Workflow

- Add participant statement capture.
- Add requested analysis action.
- Route through PIM → IRG → IDQRA → RBC.
- Present only observation / illumination language.
- Allow guardian-visible review.
- Add Transparency Orb record.

### Phase 8: Adult Utility Orbs

- Auto Maintenance Minder
- Home Maintenance Custodian
- Subscription Minder

These should be part of Standard, because adult presence is core to the product thesis.

### Phase 9: Backend Split

- Keep web frontend on Vercel-compatible app.
- Add Cloud Run-ready POD runtime service.
- Move AI and governance calls server-side.
- Add database and object storage adapters.
- Add append-only audit / transparency records.

### Phase 10: Verification

Required tests:

- route / Orb registration tests
- role permission tests
- guardian approval tests
- No-Model Vault leak tests
- AI payload redaction tests
- Family Court workflow tests
- IRG / IDQRA wording tests
- RBC non-judgment language tests
- IDS boundary trigger tests
- mobile e2e tests for standard flows

## 15. Suggested Coding Split Between Codex and Claude

Codex can own:

- repo inventory
- active source identification
- Orb contract and registry scaffolding
- route/module refactor
- test setup
- e2e workflow verification
- frontend integration work

Claude can own:

- architecture spec refinement
- IRG seven-virtue formalization with Tracey
- IDQRA wording and reflection templates
- AEGIS illumination-only copy review
- Tumbler Locking threat model review
- No-Model Vault policy language

Shared checkpoints:

- agree active app source before moving files
- agree Orb contract before refactor
- agree No-Model data enum before assistant integration
- agree IRG seven virtues before scoring implementation
- agree assistant prompt boundaries before model calls

## 16. Non-Negotiable Boundaries

- AEGIS illuminates, never judges.
- The Assistant is inside the POD but is not the authority.
- Orbs own domain data and workflows.
- No-Model Vault data never enters model context.
- Tumbler Locking must prevent service-operator plaintext access to sensitive client data.
- External financial records remain client-only.
- Secure Transactions, if added, must be a separate Orb with stricter parameters.
- Adult utility belongs in Standard because parent presence is core to the product.
- The family remains sovereign.

## 17. Immediate Next Build Step

Begin with a scoped architecture branch or task:

```text
Implement Family POD + Orb Registry scaffolding
```

First deliverable:

- `src/pod/` architecture shell
- standard Orb registry
- data classification enum
- placeholder governance service interfaces
- Transparency Orb placeholder
- documentation links back to this Totem

No AI model integration should be added until the Orb boundaries, No-Model classification, and governance interfaces exist.

END TOTEM
