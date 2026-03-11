import { useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { pets } from '../../data/mockData';

export default function PetHubPage() {
  const petData = pets ?? {
    name: 'Luna',
    breed: 'Golden Retriever',
    weight: '28 kg',
    age: '3 yrs',
    activity: 'High',
    feeding: [
      { label: 'Morning', amount: '1.5 cups', done: true },
      { label: 'Evening', amount: '1.5 cups', done: false },
    ],
    walks: [
      { time: '7:30 AM', distance: '1.8 km', duration: '22 min' },
      { time: '5:15 PM', distance: '1.8 km', duration: '25 min' },
    ],
    totalWalk: '3.6 km',
    vet: {
      month: 'OCT',
      day: '12',
      title: 'Annual Check-up',
      clinic: 'Happy Paws Clinic',
      time: '10:30 AM',
    },
  };

  const stats = [
    { label: 'Weight', value: petData.weight },
    { label: 'Age', value: petData.age },
    { label: 'Activity', value: petData.activity },
  ];

  const [walkDone, setWalkDone] = useState(() =>
    petData.walks.map((w) => w.done ?? false)
  );

  const toggleWalk = (idx) => {
    setWalkDone((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <BackHeader title="Pet Hub" rightIcon="notifications" />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Luna hero card */}
        <div className="flex flex-col items-center pt-6 pb-4 px-4">
          <div className="w-28 h-28 rounded-full ring-4 ring-[#4c8ce6]/20 bg-amber-50 flex items-center justify-center overflow-hidden mb-3">
            <span className="material-symbols-outlined text-amber-400 text-6xl">pets</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{petData.name}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{petData.breed}</p>
          <span className="mt-2 bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
            Healthy 🐾
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-3 flex flex-col items-center gap-1">
              <p className="text-base font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feeding Schedule */}
        <div className="px-4 mb-5">
          <h3 className="text-base font-bold text-slate-800 mb-3">Feeding Schedule</h3>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {petData.feeding.map((feed, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-3.5 ${idx < petData.feeding.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <span className={`material-symbols-outlined text-xl ${feed.done ? 'text-green-500' : 'text-slate-300'}`}>
                  {feed.done ? 'check_circle' : 'pending'}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{feed.time ?? feed.label}</p>
                  <p className="text-xs text-slate-400">{feed.amount}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${feed.done ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {feed.done ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Walks */}
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800">Daily Walks</h3>
            <span className="text-sm font-bold text-[#4c8ce6]">
              {petData.totalWalk ?? petData.walks?.reduce((sum, w) => sum + parseFloat(w.distance ?? 0), 0).toFixed(1) + ' km'} today
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {petData.walks.map((walk, idx) => {
              const done = walkDone[idx];
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-4 py-3.5 ${idx < petData.walks.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#4c8ce6]/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#4c8ce6] text-base">directions_walk</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{walk.label ?? walk.time}</p>
                    {walk.duration && <p className="text-xs text-slate-400">{walk.duration}</p>}
                  </div>
                  <button
                    onClick={() => toggleWalk(idx)}
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full mr-2 transition-colors ${
                      done ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    {done ? 'Done' : 'Pending'}
                  </button>
                  <span className="text-sm font-bold text-slate-600">{walk.distance}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vet Appointment card */}
        <div className="px-4 mb-4">
          <h3 className="text-base font-bold text-slate-800 mb-3">Upcoming Vet Visit</h3>
          {(petData.vetAppointment ?? petData.vet) && (() => {
            const vet = petData.vetAppointment ?? petData.vet;
            return (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="flex flex-col items-center bg-white rounded-xl px-3 py-2 border border-orange-100 flex-shrink-0">
                  <p className="text-xs font-bold text-orange-500">{vet.month}</p>
                  <p className="text-2xl font-black text-slate-800 leading-none">{vet.day}</p>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-sm">{vet.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{vet.clinic} &bull; {vet.time}</p>
                  <span className="mt-1.5 inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Reminder set
                  </span>
                </div>
                <span className="material-symbols-outlined text-orange-400 text-2xl">calendar_month</span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
