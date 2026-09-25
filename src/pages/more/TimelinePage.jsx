import { useState } from 'react';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useFamilyCore from '../../hooks/useFamilyCore';
import useTimeline from '../../hooks/useTimeline';
import useSignedUrls from '../../hooks/useSignedUrls';
import useAuth from '../../context/useAuth';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

const FILTERS = ['All', 'Achievements', 'Memories', 'Journal'];

// Which entry kinds each filter shows.
const FILTER_KINDS = {
  Achievements: ['achievement'],
  Memories: ['memory', 'milestone'],
  Journal: ['journal'],
};

const KIND_ICONS = { achievement: 'emoji_events', memory: 'photo_camera', journal: 'edit_note', milestone: 'flag' };

const inputClass = 'w-full rounded-xl border border-slate-200 px-3 py-2 text-sm';

function MonthDivider({ month }) {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{month}</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}

function AchievementCard({ entry }) {
  return (
    <div className="px-4 mb-8">
      <div className="relative pl-8 border-l-2 border-primary/30 ml-4 py-2">
        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-white">
          <span className="material-symbols-outlined text-[12px] text-white">{entry.icon}</span>
        </div>
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-primary">{entry.title}</h4>
            <span className="text-xs text-slate-500">{entry.date}</span>
          </div>
          <p className="text-slate-700 text-sm">{entry.body}</p>
          {entry.sharedBy && (
            <div className="mt-3 flex items-center gap-2">
              <span className="flex w-6 h-6 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                {entry.sharedBy.slice(0, 1).toUpperCase()}
              </span>
              <span className="text-xs font-medium text-slate-500">Shared by {entry.sharedBy}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhotoCard({ entry }) {
  return (
    <div className="px-4 mb-8">
      <div className="relative pl-8 border-l-2 border-primary/30 ml-4 py-2">
        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-white">
          <span className="material-symbols-outlined text-[12px] text-white">{entry.icon}</span>
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-white">
          <div
            className="aspect-video w-full bg-center bg-cover"
            style={{ backgroundImage: `url('${entry.image}')` }}
          />
          <div className="p-4">
            <p className="font-bold text-lg mb-1">{entry.title}</p>
            <p className="text-slate-600 text-sm mb-4">{entry.body}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{entry.sharedBy}</span>
              <span className="text-xs text-slate-400">{entry.date}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JournalCard({ entry }) {
  return (
    <div className="px-4 mb-8">
      <div className="relative pl-8 border-l-2 border-primary/30 ml-4 py-2">
        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-white">
          <span className="material-symbols-outlined text-[12px] text-white">{entry.icon}</span>
        </div>
        <div className="relative bg-white rounded-xl p-5 border-l-4 border-primary shadow-sm">
          <span className="material-symbols-outlined text-primary/20 text-4xl absolute right-4 top-4">format_quote</span>
          <p className="italic text-slate-700 text-base leading-relaxed mb-4">{entry.quote}</p>
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 uppercase tracking-tighter">
            <span>Journal Entry by {entry.author}</span>
            <span>{entry.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ entry }) {
  return (
    <div className="px-4 mb-8">
      <div className="relative pl-8 border-l-2 border-primary/30 ml-4 py-2">
        <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center ring-4 ring-white">
          <span className="material-symbols-outlined text-[12px] text-slate-500">{entry.icon}</span>
        </div>
        <div className="flex items-center gap-4 bg-slate-50 rounded-full px-6 py-3 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary">outdoor_garden</span>
          </div>
          <div>
            <p className="font-bold text-sm">{entry.title}</p>
            <p className="text-xs text-slate-500">{entry.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineCard({ entry }) {
  switch (entry.cardStyle) {
    case 'achievement': return <AchievementCard entry={entry} />;
    case 'photo':       return <PhotoCard entry={entry} />;
    case 'journal':     return <JournalCard entry={entry} />;
    case 'milestone':   return <MilestoneCard entry={entry} />;
    default:            return null;
  }
}

const blankEntry = () => ({ kind: 'memory', title: '', body: '', occurredOn: new Date().toISOString().slice(0, 10), isPrivate: false, photo: null });

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [toast, showToast] = useToast();
  const { family, members } = useFamilyCore();
  const timeline = useTimeline(family?.id);
  const { supabaseAuthEnabled } = useAuth();
  const photoUrls = useSignedUrls(timeline.entries.map((e) => e.photo_path));
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState(blankEntry);
  const [saving, setSaving] = useState(false);

  const nameOf = (userId) => (userId === timeline.userId ? 'You' : members.find((m) => m.user_id === userId)?.display_name ?? 'Family member');

  // Database rows shaped for the existing timeline cards.
  const entries = timeline.entries.map((row) => {
    const date = new Date(`${row.occurred_on}T00:00:00`);
    const photo = row.photo_path ? photoUrls[row.photo_path] : null;
    return {
      id: row.id,
      kind: row.kind,
      month: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      icon: KIND_ICONS[row.kind],
      cardStyle: row.kind === 'journal' ? 'journal' : row.kind === 'achievement' ? 'achievement' : photo ? 'photo' : 'milestone',
      title: row.title,
      body: row.body,
      quote: row.body || row.title,
      image: photo,
      sharedBy: nameOf(row.author_id),
      author: nameOf(row.author_id),
      isPrivate: row.visibility === 'private',
    };
  });

  const filtered = activeFilter === 'All' ? entries : entries.filter((e) => FILTER_KINDS[activeFilter].includes(e.kind));
  const months = [...new Set(filtered.map((e) => e.month))];

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    const outcome = await timeline.addEntry(draft);
    setSaving(false);
    showToast(outcome.ok ? 'Added to the timeline' : outcome.message);
    if (outcome.ok) {
      setComposing(false);
      setDraft(blankEntry());
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
      <Toast message={toast} />
      <BackHeader title="Family Timeline" backTo={paths.more} />

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-slate-100">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              activeFilter === f
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {timeline.error && <p className="mx-4 mt-3 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{timeline.error}</p>}

      <main className="flex-1 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No {activeFilter} yet. Start capturing moments!
          </div>
        ) : (
          months.map(month => (
            <div key={month}>
              <MonthDivider month={month} />
              {filtered
                .filter(e => e.month === month)
                .map(entry => (
                  <div key={entry.id}>
                    {entry.isPrivate && (
                      <p className="ml-16 -mb-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Private · only you</p>
                    )}
                    <TimelineCard entry={entry} />
                  </div>
                ))}
            </div>
          ))
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => (timeline.live ? setComposing(true) : showToast('Sign in to a live family to add moments.'))}
        disabled={supabaseAuthEnabled && !timeline.live}
        aria-label="Add a moment"
        className="disabled:opacity-50 fixed bottom-28 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {composing && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40" onClick={() => setComposing(false)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-3 rounded-t-2xl bg-white p-6">
            <h3 className="text-lg font-bold">Add a moment</h3>
            <div className="flex gap-2">
              {['memory', 'achievement', 'milestone', 'journal'].map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setDraft((d) => ({ ...d, kind, isPrivate: kind === 'journal' ? d.isPrivate : false }))}
                  className={`flex-1 rounded-full border py-1.5 text-xs font-bold capitalize ${draft.kind === kind ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600'}`}
                >
                  {kind}
                </button>
              ))}
            </div>
            {draft.kind !== 'journal' && (
              <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Title" className={inputClass} />
            )}
            <textarea value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} placeholder={draft.kind === 'journal' ? 'Write your entry' : 'What happened?'} rows={3} className={inputClass} />
            <input type="date" value={draft.occurredOn} onChange={(e) => setDraft((d) => ({ ...d, occurredOn: e.target.value }))} aria-label="Date" className={inputClass} />
            {draft.kind === 'memory' && (
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" aria-label="Photo" onChange={(e) => setDraft((d) => ({ ...d, photo: e.target.files?.[0] ?? null }))} className="text-sm" />
            )}
            {draft.kind === 'journal' && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={draft.isPrivate} onChange={(e) => setDraft((d) => ({ ...d, isPrivate: e.target.checked }))} />
                Keep private (only I can see it)
              </label>
            )}
            <button type="submit" disabled={saving || (!draft.title.trim() && !draft.body.trim())} className="w-full rounded-xl bg-primary py-3 font-bold text-white disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
