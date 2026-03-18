import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

{/* TODO: fetch timeline from /api/timeline */}

const FILTERS = ['All', 'Achievements', 'Memories', 'Journal'];

const TIMELINE_ENTRIES = [
  {
    id: 1,
    type: 'Achievements',
    month: 'June 2024',
    date: 'June 28',
    icon: 'emoji_events',
    title: 'Academic Achievement',
    body: "Leo got an A+ in his final math project! We are so proud of his hard work this semester.",
    sharedBy: 'Maria',
    sharedByAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaASiyoKULliUB-Mh8B6gJMRA3dZEA5QUBvQw6AdBw-CNf8QQTT5a58tgKHEqTlWTeLYbBJ7nzG2naAL8VM1GhHovv5qHWLnSe8zkwk4IDhkGHuCQWt-iwDVhUVEi9MTw174Ti_CQzD7Bj49rAbCSJASel65hEvu6Bl4msw1F33T3Un9H9Q4BXIWewiJ17rLfOJCGZgO3zzrFg4Ix6usqUOtbIMUMU75sFCVpbhfkNvZgyPQTjxcZeZ5aw29WPgg9Pe2Orzjrv-tQ',
    cardStyle: 'achievement',
  },
  {
    id: 2,
    type: 'Memories',
    month: 'June 2024',
    date: 'June 20',
    icon: 'image',
    title: 'Beach Day at the Coast',
    body: 'The weather was perfect and the kids loved building sandcastles all afternoon.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9D8qWSMP2mIO0LjqIwemJZuEDpIsup8-qsV_6PzbkpLmIjJg8zzJm3o9QurBvGax24yvYLyEaSYz7xGG7wT-P4VWK8FCFITkDumbNpMnxxqS3K7upNh5X1dTLw7qG2r1PapGmlh_MzzipsLgu1FoQZHzq1TQtGIWpXTqGfRToDe9gOlRJNF32DQ_tQuxffuAInwHkSlpVYZEH009ry7rtrDKtoi2UjSAkv3QT0UROsDSAQrkZtG2f6l0Hch168vVRLO60mJ6Pj2g',
    sharedBy: 'Sarah & 3 others',
    likes: 24,
    comments: 5,
    cardStyle: 'photo',
  },
  {
    id: 3,
    type: 'Journal',
    month: 'June 2024',
    date: 'June 10, 2024',
    icon: 'edit_note',
    quote: '"Today we sat in the garden for three hours just talking. No phones, no distractions. It reminded me why these small moments are the most important ones."',
    author: 'David',
    cardStyle: 'journal',
  },
  {
    id: 4,
    type: 'Achievements',
    month: 'May 2024',
    date: 'May 15',
    icon: 'auto_awesome',
    title: 'Established June 2024',
    body: 'Family Hub account created',
    cardStyle: 'milestone',
  },
];

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
              <img
                className="w-6 h-6 rounded-full object-cover"
                src={entry.sharedByAvatar}
                alt={`Shared by ${entry.sharedBy}`}
              />
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
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined text-lg">favorite</span>
                  <span className="text-xs font-bold">{entry.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined text-lg">chat_bubble</span>
                  <span className="text-xs font-bold">{entry.comments}</span>
                </div>
              </div>
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

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? TIMELINE_ENTRIES
    : TIMELINE_ENTRIES.filter(e => e.type === activeFilter);

  const months = [...new Set(filtered.map(e => e.month))];

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
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
                  <TimelineCard key={entry.id} entry={entry} />
                ))}
            </div>
          ))
        )}
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
}
