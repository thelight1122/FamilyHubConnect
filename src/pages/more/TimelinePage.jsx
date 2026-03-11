import { useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { timeline } from '../../data/mockData';

export default function TimelinePage() {
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Achievements', 'Memories', 'Journal'];

  const timelineData = timeline ?? [
    {
      month: 'October 2024',
      entries: [
        {
          type: 'achievement',
          title: 'Leo scores hat-trick!',
          date: 'Oct 5',
          desc: 'Leo scored 3 goals in the match against Blue Eagles. The whole family cheered!',
        },
        {
          type: 'memory',
          title: 'Pumpkin Patch Trip',
          date: 'Oct 2',
          image: null,
          likes: 12,
          comments: 4,
        },
        {
          type: 'journal',
          text: 'Grateful for another beautiful autumn weekend with my family. Watched the leaves change colors together.',
          attribution: 'Mom',
          date: 'Oct 1',
        },
      ],
    },
    {
      month: 'September 2024',
      entries: [
        {
          type: 'milestone',
          title: 'Sarah starts ballet school',
          date: 'Sep 12',
          icon: 'star',
        },
        {
          type: 'achievement',
          title: 'Emma\'s science fair win',
          date: 'Sep 8',
          desc: 'Emma won 1st place at the school science fair with her solar-powered model!',
        },
        {
          type: 'memory',
          title: 'Back-to-School Breakfast',
          date: 'Sep 1',
          image: null,
          likes: 9,
          comments: 3,
        },
      ],
    },
  ];

  const filterMap = {
    all: null,
    achievements: 'achievement',
    memories: 'memory',
    journal: 'journal',
  };

  const filteredData = timelineData.map((group) => ({
    ...group,
    events: filter === 'All'
      ? (group.events ?? group.entries ?? [])
      : (group.events ?? group.entries ?? []).filter((e) => e.type === filterMap[filter.toLowerCase()]),
  })).filter((g) => g.events.length > 0);

  const dotColor = (type) => {
    switch (type) {
      case 'achievement': return 'bg-amber-400';
      case 'memory': return 'bg-[#4c8ce6]';
      case 'journal': return 'bg-rose-400';
      case 'milestone': return 'bg-green-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <BackHeader title="Family Timeline" rightIcon="filter_list" />

      {/* Filter pills */}
      <div className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-[#4c8ce6] text-white'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 px-4 pt-4">
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">event_note</span>
            <p className="text-slate-500 font-semibold">No {filter === 'All' ? '' : filter} entries yet</p>
            <p className="text-xs text-slate-400 mt-1">Start capturing family moments!</p>
          </div>
        )}
        {filteredData.map((group) => (
          <div key={group.month} className="mb-6">
            {/* Month label */}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{group.month}</p>

            {/* Entries */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-200" />

              <div className="flex flex-col gap-4">
                {group.events.map((entry, idx) => (
                  <div key={idx} className="flex gap-4">
                    {/* Dot */}
                    <div className="flex flex-col items-center flex-shrink-0 z-10">
                      <div className={`w-5 h-5 rounded-full ${dotColor(entry.type)} border-2 border-white shadow-sm mt-1`} />
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 mb-1">
                      {entry.type === 'achievement' && (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-amber-400 text-base">star</span>
                            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide">Achievement</span>
                          </div>
                          <p className="font-bold text-slate-800 text-sm">{entry.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 mb-1">{entry.date}</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{entry.desc}</p>
                        </>
                      )}

                      {entry.type === 'memory' && (
                        <>
                          {entry.image ? (
                            <img src={entry.image} alt={entry.title} className="w-full rounded-xl h-36 object-cover mb-3" />
                          ) : (
                            <div className="w-full rounded-xl h-28 bg-slate-100 flex items-center justify-center mb-3">
                              <span className="material-symbols-outlined text-slate-300 text-4xl">image</span>
                            </div>
                          )}
                          <p className="font-bold text-slate-800 text-sm">{entry.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 mb-2">{entry.date}</p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-xs text-slate-400">
                              <span className="material-symbols-outlined text-sm">favorite_border</span>
                              {entry.likes}
                            </button>
                            <button className="flex items-center gap-1 text-xs text-slate-400">
                              <span className="material-symbols-outlined text-sm">chat_bubble_outline</span>
                              {entry.comments}
                            </button>
                          </div>
                        </>
                      )}

                      {entry.type === 'journal' && (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-rose-400 text-base">menu_book</span>
                            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wide">Journal</span>
                          </div>
                          <p className="text-sm text-slate-600 italic leading-relaxed">&ldquo;{entry.text}&rdquo;</p>
                          <p className="text-xs text-slate-400 mt-2 font-medium">&mdash; {entry.author ?? entry.attribution} &bull; {entry.date}</p>
                        </>
                      )}

                      {entry.type === 'milestone' && (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-green-500 text-base">home_heart</span>
                            <span className="text-xs font-semibold text-green-500 uppercase tracking-wide">Milestone</span>
                          </div>
                          <p className="font-bold text-slate-800 text-sm">{entry.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{entry.date}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-5 w-14 h-14 bg-[#4c8ce6] text-white rounded-full flex items-center justify-center shadow-xl z-20">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}
