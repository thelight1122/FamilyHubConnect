import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';

{/* TODO: fetch pet data from /api/pets */}

// TODO: fetch from /api/pets/walks
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
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary/10"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8gwWwrIh9CMMcO5YonRelRVBmi8KZ3jQe6rYiJK6W5rmYjdp04bi-_i4KkKyUhTCg6FW787KljgHKNnSYrMEBCR-qOqnY3004kYsci-K3hxxVe9_5LF3Up_rX1kIP0Nuh0nHkuNa0YVTrFzr6jby-7qs9Fz7nUPJHCFR08SQ9XcdXZcWQ_WDgai_05YHhRctJ_lbXFqT8XfPzZzdzxPG8gfquSFB3fkKEBuoGXH9HtJTVIiETQj71OkrKOI5-VKXJ-qHwfVaET_E")' }}
                />
                <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white">
                  <span className="material-symbols-outlined text-sm block">edit</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-slate-900 text-2xl font-bold leading-tight tracking-tight text-center">Luna</h1>
                <p className="text-slate-500 text-sm font-medium text-center">Golden Retriever • 2 years old</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Healthy &amp; Active
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-6">
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Weight</p>
            <p className="text-slate-900 text-lg font-bold">30kg</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Age</p>
            <p className="text-slate-900 text-lg font-bold">2y 4m</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Activity</p>
            <p className="text-slate-900 text-lg font-bold">High</p>
          </div>
        </div>

        {/* Feeding Schedule Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">Feeding Schedule</h3>
            <button className="text-primary text-sm font-semibold">Update</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>wb_twilight</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 text-sm font-bold">Morning Meal</p>
                <p className="text-slate-500 text-xs">8:00 AM • 2 cups kibble</p>
              </div>
              <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 text-sm font-bold">Evening Meal</p>
                <p className="text-slate-500 text-xs">6:00 PM • 2 cups kibble</p>
              </div>
              <div className="h-6 w-6 rounded-full border-2 border-slate-200" />
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
                <span className="text-xl font-bold text-slate-900">4.2 km</span>
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
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-4">
            <div className="flex flex-col items-center justify-center bg-white rounded-lg p-2 min-w-[60px] shadow-sm">
              <span className="text-orange-500 text-xs font-bold uppercase">OCT</span>
              <span className="text-2xl font-black text-slate-900 leading-none">12</span>
            </div>
            <div className="flex-1">
              <p className="text-slate-900 font-bold">Annual Check-up</p>
              <p className="text-slate-500 text-sm">Happy Paws Clinic • 10:30 AM</p>
              <div className="flex items-center gap-1 mt-2 text-orange-600 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">event</span>
                Reminder set (2 days before)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
