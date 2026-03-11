import { useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { creatorStudio } from '../../data/mockData';

const CREATE_TYPES = [
  {
    id: 'photo',
    label: 'Photo Story',
    icon: 'photo_camera',
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    id: 'voice',
    label: 'Voice Memo',
    icon: 'mic',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    id: 'poll',
    label: 'Family Poll',
    icon: 'poll',
    gradient: 'from-violet-400 to-violet-600',
  },
];

const TYPE_BADGE_COLORS = {
  'Photo Story': 'bg-pink-100 text-pink-600',
  'Family Poll': 'bg-violet-100 text-violet-600',
  'Voice Memo': 'bg-emerald-100 text-emerald-600',
};

export default function CreatorStudioPage() {
  const [showCreate, setShowCreate] = useState(false);

  const { stats, creations } = creatorStudio;

  return (
    <div className="min-h-dvh bg-[#f6f7f8] relative">
      <BackHeader title="Creator's Studio" backTo="/more" />

      <div className="pb-28">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-4">
          {/* Posts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[#4c8ce6] text-2xl">edit</span>
            <p className="text-lg font-black text-slate-900">{stats.posts}</p>
            <p className="text-xs text-slate-500">Posts</p>
          </div>

          {/* Views */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-blue-500 text-2xl">visibility</span>
            <p className="text-lg font-black text-slate-900">{stats.views}</p>
            <p className="text-xs text-slate-500">Views</p>
          </div>

          {/* Likes */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-rose-500 text-2xl">favorite</span>
            <p className="text-lg font-black text-slate-900">{stats.likes}</p>
            <p className="text-xs text-slate-500">Likes</p>
          </div>
        </div>

        {/* Create New */}
        <div className="px-4 mt-6">
          <h3 className="text-base font-bold text-slate-800 mb-3">Create New</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {CREATE_TYPES.map((type) => (
              <div
                key={type.id}
                className={`shrink-0 w-40 bg-gradient-to-br ${type.gradient} rounded-2xl p-4 flex flex-col gap-3`}
              >
                <span className="material-symbols-outlined text-white text-4xl">{type.icon}</span>
                <p className="text-white font-bold text-sm">{type.label}</p>
                <button className="mt-auto bg-white/20 text-white text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-white/30 transition-colors self-start">
                  Create →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Your Creations */}
        <div className="px-4 mt-6">
          <h3 className="text-base font-bold text-slate-800 mb-3">Your Creations</h3>
          <div className="space-y-3">
            {creations.map((creation) => (
              <div
                key={creation.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3"
              >
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                    creation.color === 'pink'
                      ? 'bg-pink-100'
                      : creation.color === 'violet'
                      ? 'bg-violet-100'
                      : 'bg-emerald-100'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      creation.color === 'pink'
                        ? 'text-pink-500'
                        : creation.color === 'violet'
                        ? 'text-violet-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {creation.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        TYPE_BADGE_COLORS[creation.type] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {creation.type}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">{creation.title}</p>
                  <p className="text-xs text-slate-400">{creation.date}</p>
                </div>

                <div className="shrink-0 text-right">
                  {creation.likes != null && (
                    <div className="flex items-center gap-1 text-rose-500">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                      <span className="text-xs font-semibold">{creation.likes}</span>
                    </div>
                  )}
                  {creation.responses != null && (
                    <div className="flex items-center gap-1 text-violet-500">
                      <span className="material-symbols-outlined text-sm">people</span>
                      <span className="text-xs font-semibold">{creation.responses}</span>
                    </div>
                  )}
                  {creation.duration != null && (
                    <div className="flex items-center gap-1 text-emerald-500">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="text-xs font-semibold">{creation.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-20 right-4 bg-[#4c8ce6] rounded-full w-14 h-14 shadow-xl flex items-center justify-center hover:bg-[#3b7bd4] transition-colors z-30"
      >
        <span className="material-symbols-outlined text-white text-3xl">add</span>
      </button>

      {/* Create Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center"
          onClick={() => setShowCreate(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white w-full max-w-md rounded-t-3xl p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-lg font-black text-slate-900 mb-4 text-center">
              Create New Content
            </h3>
            <div className="space-y-3">
              {CREATE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setShowCreate(false)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${type.gradient} text-left`}
                >
                  <span className="material-symbols-outlined text-white text-3xl">{type.icon}</span>
                  <p className="text-white font-bold text-base">{type.label}</p>
                  <span className="material-symbols-outlined text-white/70 ml-auto">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
