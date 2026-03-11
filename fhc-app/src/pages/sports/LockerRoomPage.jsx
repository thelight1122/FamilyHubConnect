import { useNavigate } from 'react-router-dom';
import { sports } from '../../data/mockData';
import { useState } from 'react';

export default function LockerRoomPage() {
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState(0);

  const teams = ["Leo's Soccer", "Sarah's Ballet"];

  const schedule = [
    { date: 'Sat, Oct 14', time: '10:00 AM', opponent: 'Blue Eagles FC', type: 'game', home: true, },
    { date: 'Tue, Oct 17', time: '4:00 PM', opponent: 'Practice', type: 'practice', home: null, },
    { date: 'Sat, Oct 21', time: '11:00 AM', opponent: 'River Hawks', type: 'game', home: false, },
    { date: 'Tue, Oct 24', time: '4:00 PM', opponent: 'Practice', type: 'practice', home: null, },
  ];

  const checklist = [
    { item: 'Shin Guards', checked: true },
    { item: 'Cleats', checked: true },
    { item: 'Water Bottle', checked: true },
    { item: 'Team Jersey #9', checked: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white">
        <h1 className="text-2xl font-bold text-slate-800">Locker Room</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f7f8]">
          <span className="material-symbols-outlined text-slate-600">notifications</span>
        </button>
      </div>

      {/* Team selector pills */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-slate-100">
        {teams.map((team, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTeam(idx)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTeam === idx
                ? 'bg-[#4c8ce6] text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {team}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Active team hero card */}
        <div className="mx-4 my-4 bg-[#4c8ce6] text-white rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold">Tigers FC</h2>
              <p className="text-blue-100 text-sm mt-0.5">Midfielder #9</p>
            </div>
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
              Active Season
            </span>
          </div>
          <div className="mt-4 bg-white/15 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-white/80">calendar_today</span>
            <div>
              <p className="text-xs text-blue-100 uppercase tracking-wide font-medium">Next Game</p>
              <p className="text-white font-semibold text-sm">Sat, Oct 14 &bull; 10:00 AM</p>
            </div>
          </div>
        </div>

        {/* Schedule section */}
        <div className="px-4 mb-5">
          <h3 className="text-base font-bold text-slate-800 mb-3">Schedule</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center px-4 py-3 gap-3 ${idx < schedule.length - 1 ? 'border-b border-slate-100' : ''}`}
              >
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium">{item.date} &bull; {item.time}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.opponent}</p>
                </div>
                {item.home !== null && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.home ? 'bg-blue-50 text-[#4c8ce6]' : 'bg-slate-100 text-slate-500'}`}>
                    {item.home ? 'Home' : 'Away'}
                  </span>
                )}
                {item.type === 'practice' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                    Practice
                  </span>
                )}
                <span className="material-symbols-outlined text-slate-300 text-base">location_on</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Checklist */}
        <div className="mx-4 mb-5 bg-slate-800 text-white rounded-2xl p-4">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4c8ce6]">inventory_2</span>
            Equipment Checklist
          </h3>
          <div className="flex flex-col gap-2">
            {checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${item.checked ? 'text-green-400' : 'text-slate-500'}`}>
                  {item.checked ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={`text-sm ${item.checked ? 'text-white' : 'text-slate-400'}`}>{item.item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Contacts */}
        <div className="px-4 mb-5">
          <h3 className="text-base font-bold text-slate-800 mb-3">Team Contacts</h3>
          <div className="flex gap-3">
            {/* Coach Mike */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-[#4c8ce6]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#4c8ce6] text-3xl">person</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Coach Mike</p>
                <p className="text-xs text-slate-400">Head Coach</p>
              </div>
              <button className="mt-1 w-full bg-[#f6f7f8] text-[#4c8ce6] text-xs font-semibold py-1.5 rounded-lg">
                Message
              </button>
            </div>
            {/* Jordan / Captain */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 text-3xl">person</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Jordan</p>
                <p className="text-xs text-slate-400">Captain</p>
              </div>
              <button className="mt-1 w-full bg-[#f6f7f8] text-[#4c8ce6] text-xs font-semibold py-1.5 rounded-lg">
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Open Team Chat button */}
        <div className="px-4 mb-4">
          <button
            onClick={() => navigate('/sports/chat')}
            className="w-full bg-[#4c8ce6] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base shadow-sm"
          >
            <span className="material-symbols-outlined">forum</span>
            Open Team Chat 💬
          </button>
        </div>
      </div>
    </div>
  );
}
