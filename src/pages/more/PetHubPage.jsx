import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

const WALKS = [];

export default function PetHubPage() {
  const [walkDone, setWalkDone] = useState(WALKS.map(() => false));

  const toggleWalk = (idx) =>
    setWalkDone(prev => prev.map((v, i) => (i === idx ? !v : v)));

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
      <BackHeader title="Pet Hub" backTo={paths.more} />

      <div className="flex-1 overflow-y-auto pb-8">
        {/* Pet Profile Header */}
        <div className="flex p-6">
          <div className="flex w-full flex-col gap-4 items-center">
            <div className="flex gap-4 flex-col items-center">
              <div className="relative">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/10 bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-6xl">pets</span>
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white">
                  <span className="material-symbols-outlined text-sm block">edit</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-slate-900 text-2xl font-bold leading-tight tracking-tight text-center">No live pet entered</h1>
                <p className="text-slate-500 text-sm font-medium text-center">Pet profile details will appear after entry.</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Awaiting live profile
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-6">
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Weight</p>
            <p className="text-slate-900 text-lg font-bold">--</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Age</p>
            <p className="text-slate-900 text-lg font-bold">--</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Activity</p>
            <p className="text-slate-900 text-lg font-bold">--</p>
          </div>
        </div>

        {/* Feeding Schedule Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">Feeding Schedule</h3>
            <button className="text-primary text-sm font-semibold">Update</button>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
              <span className="material-symbols-outlined text-3xl text-slate-300">restaurant</span>
              <p className="mt-2 text-sm font-bold text-slate-600">No live feeding schedule entered</p>
            </div>
          </div>
        </div>

        {/* Daily Walks Log */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">Daily Walks</h3>
            <button className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-bold">
              <span className="material-symbols-outlined text-sm">add</span> Add Walk
            </button>
          </div>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Distance Today</span>
                <span className="text-xl font-bold text-slate-900">0 km</span>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">directions_walk</span>
            </div>
            <div className="p-4 space-y-4">
              {WALKS.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-2">No walks recorded yet.</p>
              )}
              {WALKS.map((walk, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 flex justify-between text-sm">
                    <span className="font-medium">{walk.label}</span>
                    <span className="text-slate-500">{walk.detail}</span>
                  </div>
                  <button
                    onClick={() => toggleWalk(idx)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                      walkDone[idx]
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {walkDone[idx] ? 'Done ✓' : 'Pending'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Vet Appointments */}
        <div className="px-4 mb-8">
          <h3 className="text-slate-900 text-lg font-bold tracking-tight mb-4">Vet Appointments</h3>
          <div className="rounded-xl border border-dashed border-orange-100 bg-orange-50 p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-orange-300">event</span>
            <p className="mt-2 text-sm font-bold text-slate-600">No live vet appointments entered</p>
          </div>
        </div>
      </div>
    </div>
  );
}
