import BackHeader from '../../components/BackHeader';
import { paths } from '../../config/paths';
import {
  aiAccessLevels,
  dataClassification,
  familyPod,
  standardOrbRegistry,
  transparencyBehaviors,
  vaultAccessRules,
} from '../../pod';

const STATUS_COPY = {
  [aiAccessLevels.NONE]: 'No model access',
  [aiAccessLevels.SUMMARY_ONLY]: 'Summary only',
  [aiAccessLevels.AI_SAFE_SHADOW_ONLY]: 'AI-safe shadow',
  [aiAccessLevels.GOVERNED_CONTEXT]: 'Governed context',
};

const STATUS_CLASS = {
  [aiAccessLevels.NONE]: 'bg-rose-50 text-rose-600 border-rose-100',
  [aiAccessLevels.SUMMARY_ONLY]: 'bg-blue-50 text-blue-600 border-blue-100',
  [aiAccessLevels.AI_SAFE_SHADOW_ONLY]: 'bg-amber-50 text-amber-700 border-amber-100',
  [aiAccessLevels.GOVERNED_CONTEXT]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

const boundaryRows = [
  {
    label: 'Assistant',
    value: 'Not enabled',
    detail: familyPod.assistantPlacement,
    icon: 'smart_toy',
  },
  {
    label: 'No-Model Vault',
    value: 'Protected',
    detail: 'Sensitive records stay out of model prompts and logs.',
    icon: 'lock',
  },
  {
    label: 'Transparency',
    value: 'Placeholder active',
    detail: 'Governance events can be shaped before live persistence.',
    icon: 'visibility',
  },
];

function formatToken(value) {
  return value.replaceAll('_', ' ');
}

export default function TransparencyPage() {
  const governedCount = standardOrbRegistry.filter((orb) => orb.aiAccessLevel === aiAccessLevels.GOVERNED_CONTEXT).length;
  const withheldCount = standardOrbRegistry.filter((orb) => (
    orb.aiAccessLevel === aiAccessLevels.NONE ||
    orb.vaultAccessRule === vaultAccessRules.NEVER_MODEL_ACCESSIBLE ||
    orb.transparencyBehavior === transparencyBehaviors.RECORD_WITHHELD_CONTEXT
  )).length;

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-[#f6f7f8] text-slate-900 overflow-x-hidden">
      <BackHeader title="Transparency" backTo={paths.more} />

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-28 space-y-5">
        <section className="rounded-3xl bg-white p-5 shadow-atmospheric border border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">POD Status</p>
              <h1 className="mt-2 text-2xl font-black leading-tight text-slate-900">{familyPod.label}</h1>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">
                {familyPod.illuminationInvariant}
              </p>
            </div>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined">hub</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">Orbs</p>
              <p className="mt-1 text-xl font-black text-slate-900">{standardOrbRegistry.length}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">Governed</p>
              <p className="mt-1 text-xl font-black text-slate-900">{governedCount}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase text-slate-400">Withheld</p>
              <p className="mt-1 text-xl font-black text-slate-900">{withheldCount}</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {boundaryRows.map((row) => (
            <article key={row.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <span className="material-symbols-outlined text-[20px]">{row.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-black text-slate-900">{row.label}</h2>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-600">
                      {row.value}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">{row.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Orb Boundaries</h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Read only</span>
          </div>

          <div className="space-y-3">
            {standardOrbRegistry.map((orb) => (
              <article key={orb.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-slate-900">{orb.label}</h3>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {formatToken(orb.dataClassification)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black ${STATUS_CLASS[orb.aiAccessLevel]}`}>
                    {STATUS_COPY[orb.aiAccessLevel]}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-500">
                  <div className="rounded-xl bg-slate-50 p-2">
                    <span className="block text-slate-400">Vault</span>
                    {formatToken(orb.vaultAccessRule)}
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2">
                    <span className="block text-slate-400">Transparency</span>
                    {formatToken(orb.transparencyBehavior)}
                  </div>
                </div>

                {orb.dataClassification === dataClassification.NO_MODEL_VAULT && (
                  <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-semibold leading-relaxed text-rose-600">
                    Raw sensitive records remain unavailable to model context.
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
