import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/routes';
import { activeSportsTeam, sportsChecklist, sportsContacts, sportsSchedule, sportsTeams } from '../../data/selectors';

export default function LockerRoomPage() {
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState(
    Math.max(
      sportsTeams.findIndex((team) => team.active),
      0,
    ),
  );

  const selectedTeam = sportsTeams[activeTeam] ?? activeSportsTeam;
  const nextEvent = sportsSchedule[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8]">
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-white">
        <h1 className="text-2xl font-bold text-slate-800">Locker Room</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f6f7f8]">
          <span className="material-symbols-outlined text-slate-600">notifications</span>
        </button>
      </div>

      <div className="flex gap-2 px-4 py-3 bg-white border-b border-slate-100">
        {sportsTeams.map((team, idx) => (
          <button
            key={team.id}
            onClick={() => setActiveTeam(idx)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTeam === idx ? 'bg-[#4c8ce6] text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="mx-4 my-4 bg-[#4c8ce6] text-white rounded-2xl p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold">{selectedTeam.team}</h2>
              <p className="text-blue-100 text-sm mt-0.5">{selectedTeam.member}</p>
            </div>
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
              {selectedTeam.active ? 'Active Season' : 'Off Season'}
            </span>
          </div>
          <div className="mt-4 bg-white/15 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-white/80">calendar_today</span>
            <div>
              <p className="text-xs text-blue-100 uppercase tracking-wide font-medium">Next Event</p>
              <p className="text-white font-semibold text-sm">
                {nextEvent.date} - {nextEvent.time}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 mb-5">
          <h3 className="text-base font-bold text-slate-800 mb-3">Schedule</h3>
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            {sportsSchedule.map((item) => (
              <div
                key={item.id}
                className={`flex items-center px-4 py-3 gap-3 ${item.id < sportsSchedule.length ? 'border-b border-slate-100 last:border-b-0' : ''}`}
              >
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium">{item.date} - {item.time}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{item.opponent ?? item.type}</p>
                </div>
                {typeof item.isHome === 'boolean' && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.isHome ? 'bg-blue-50 text-[#4c8ce6]' : 'bg-slate-100 text-slate-500'}`}>
                    {item.isHome ? 'Home' : 'Away'}
                  </span>
                )}
                {!item.opponent && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                    Practice
                  </span>
                )}
                <span className="material-symbols-outlined text-slate-300 text-base">location_on</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-4 mb-5 bg-slate-800 text-white rounded-2xl p-4">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4c8ce6]">inventory_2</span>
            Equipment Checklist
          </h3>
          <div className="flex flex-col gap-2">
            {sportsChecklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-xl ${item.packed ? 'text-green-400' : 'text-slate-500'}`}>
                  {item.packed ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={`text-sm ${item.packed ? 'text-white' : 'text-slate-400'}`}>{item.item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-5">
          <h3 className="text-base font-bold text-slate-800 mb-3">Team Contacts</h3>
          <div className="flex gap-3">
            {sportsContacts.map((contact, idx) => (
              <div key={contact.id} className="flex-1 bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-[#4c8ce6]/10' : 'bg-amber-50'}`}>
                  <span className={`material-symbols-outlined text-3xl ${idx === 0 ? 'text-[#4c8ce6]' : 'text-amber-500'}`}>person</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800">{contact.name}</p>
                  <p className="text-xs text-slate-400">{contact.role}</p>
                </div>
                <button className="mt-1 w-full bg-[#f6f7f8] text-[#4c8ce6] text-xs font-semibold py-1.5 rounded-lg">
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 mb-4">
          <button
            onClick={() => navigate(paths.sportsChat)}
            className="w-full bg-[#4c8ce6] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base shadow-sm"
          >
            <span className="material-symbols-outlined">forum</span>
            Open Team Chat
          </button>
        </div>
      </div>
    </div>
  );
}
