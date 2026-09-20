import { useMemo, useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { paths } from '../../config/paths';
import {
  aiAccessLevels,
  applyOutputBoundaries,
  classifyInput,
  inspectGovernanceEvent,
  recordGovernanceEvent,
  standardOrbRegistry,
} from '../../pod';

const EXAMPLE_REQUESTS = [
  'Help me prepare tonight\'s family meeting notes.',
  'Summarize what maintenance items need attention.',
  'Can you read the health records and tell me what is wrong?',
];

const ACCESS_COPY = {
  [aiAccessLevels.NONE]: 'No model access',
  [aiAccessLevels.SUMMARY_ONLY]: 'Summary only',
  [aiAccessLevels.AI_SAFE_SHADOW_ONLY]: 'AI-safe shadow only',
  [aiAccessLevels.GOVERNED_CONTEXT]: 'Governed context',
};

function buildAssistantPreview({ requestText, selectedOrb }) {
  const input = classifyInput({
    actorRole: 'adult',
    orbId: selectedOrb.id,
    route: selectedOrb.routes[0] ?? paths.moreAssistant,
    consentState: 'local-preview',
  });

  const inspection = inspectGovernanceEvent({
    classification: input.sensitivity,
    requestedAction: requestText.toLowerCase().includes('health records') ? 'sensitive_record_review' : 'draft_observation',
  });

  const allowedContext = [
    selectedOrb.label,
    ACCESS_COPY[selectedOrb.aiAccessLevel],
    input.modelEligible ? 'Current request may use governed app context.' : 'Current request cannot use model context.',
  ];

  const withheldContext = [
    ...(input.vaultRestricted ? ['Raw vault records'] : []),
    ...(inspection.triggered ? inspection.reasons : []),
  ];

  const bounded = applyOutputBoundaries({
    text: input.modelEligible
      ? 'I can prepare a bounded draft from visible app context and leave final choices with the family.'
      : 'I can explain the boundary, but this Orb does not allow model context.',
    requiresHumanApproval: true,
  });

  const transparencyRecord = recordGovernanceEvent({
    orbId: selectedOrb.id,
    eventType: 'assistant_preview',
    summary: 'Assistant shell previewed a bounded response without calling a model.',
    withheldContext,
  });

  return {
    allowedContext,
    bounded,
    inspection,
    transparencyRecord,
    withheldContext,
  };
}

export default function AssistantPage() {
  const assistantOrbs = useMemo(() => (
    standardOrbRegistry.filter((orb) => orb.routes.length > 0)
  ), []);
  const defaultAssistantOrb = useMemo(() => (
    assistantOrbs.find((orb) => orb.routes.includes(paths.moreAssistant)) ?? assistantOrbs[0]
  ), [assistantOrbs]);
  const [requestText, setRequestText] = useState(EXAMPLE_REQUESTS[0]);
  const [selectedOrbId, setSelectedOrbId] = useState(defaultAssistantOrb?.id ?? '');
  const selectedOrb = useMemo(() => (
    assistantOrbs.find((orb) => orb.id === selectedOrbId) ?? defaultAssistantOrb
  ), [assistantOrbs, defaultAssistantOrb, selectedOrbId]);

  const preview = useMemo(() => (
    buildAssistantPreview({ requestText, selectedOrb })
  ), [requestText, selectedOrb]);

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f6f7f8] text-slate-900 overflow-x-hidden">
      <BackHeader title="Assistant" backTo={paths.more} />

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-28 space-y-5">
        <section className="rounded-3xl bg-slate-900 p-5 text-white shadow-lifted">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Inside the POD</p>
              <h1 className="mt-2 text-2xl font-black leading-tight">Bounded Assistant Shell</h1>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-white/70">
                Local preview only. No model call is made from this screen.
              </p>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <span className="material-symbols-outlined">smart_toy</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400" htmlFor="assistant-orb">
            Orb context
          </label>
          <select
            id="assistant-orb"
            value={selectedOrb.id}
            onChange={(event) => setSelectedOrbId(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-primary"
          >
            {assistantOrbs.map((orb) => (
              <option key={orb.id} value={orb.id}>{orb.label}</option>
            ))}
          </select>

          <label className="mt-4 block text-xs font-black uppercase tracking-widest text-slate-400" htmlFor="assistant-request">
            Family request
          </label>
          <textarea
            id="assistant-request"
            value={requestText}
            onChange={(event) => setRequestText(event.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-relaxed text-slate-800 outline-none focus:border-primary"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_REQUESTS.map((request) => (
              <button
                key={request}
                onClick={() => setRequestText(request)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-black text-slate-500 transition-colors hover:border-primary hover:text-primary"
              >
                {request.split(' ').slice(0, 4).join(' ')}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined">forum</span>
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Preview response</h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                {preview.bounded.text}
              </p>
              <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-semibold leading-relaxed text-slate-500">
                {preview.bounded.boundary}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3">
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700">Context allowed</h2>
            <ul className="mt-3 space-y-2">
              {preview.allowedContext.map((item) => (
                <li key={item} className="flex gap-2 text-xs font-bold leading-relaxed text-emerald-800">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-rose-700">Context withheld</h2>
            {preview.withheldContext.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {preview.withheldContext.map((item) => (
                  <li key={item} className="flex gap-2 text-xs font-bold leading-relaxed text-rose-700">
                    <span className="material-symbols-outlined text-sm">block</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs font-bold leading-relaxed text-rose-700">
                No vault context requested by this preview.
              </p>
            )}
          </article>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-black text-slate-900">Transparency record</h2>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-500">
            {preview.transparencyRecord.summary}
          </p>
          <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {preview.transparencyRecord.orbLabel} / {preview.transparencyRecord.behavior}
          </p>
        </section>
      </main>
    </div>
  );
}
