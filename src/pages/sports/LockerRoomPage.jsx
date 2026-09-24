import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

const TEAMS = [];
const CHECKLIST_ITEMS = [];
const SCHEDULE = [];
const CONTACTS = [];

export default function LockerRoomPage() {
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState(0);
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [toast, showToast] = useToast();

  const team = TEAMS[activeTeam] ?? null;

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item))
    );
  };

  const packedCount = checklist.filter((i) => i.packed).length;

  return (
    <div className="flex flex-col min-h-screen bg-background-light pb-24">
      <Toast message={toast} />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-md border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold tracking-tight">Locker Room</h1>
          <button className="flex items-center justify-center p-2 hover:bg-slate-200 rounded-full transition-colors text-primary">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full px-4 py-6 space-y-8">
        {/* Team Switcher */}
        <section>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {TEAMS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveTeam(idx)}
                className="flex flex-col items-center gap-2 min-w-[72px] focus:outline-none"
              >
                <div
                  className={`size-16 rounded-full p-0.5 ${
                    activeTeam === idx
                      ? 'border-4 border-primary bg-background-light'
                      : 'border-2 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span
                  className={`text-xs font-bold ${
                    activeTeam === idx ? 'text-primary' : 'text-slate-500 font-medium'
                  }`}
                >
                  {t.name}
                </span>
              </button>
            ))}
            <button className="flex flex-col items-center gap-2 min-w-[72px] opacity-60">
              <div className="size-16 rounded-full border-2 border-slate-200 flex items-center justify-center bg-slate-100">
                <span className="material-symbols-outlined text-slate-400">add</span>
              </div>
              <span className="text-xs font-medium">Add Team</span>
            </button>
          </div>
        </section>

        {/* Active Team Card */}
        {team ? (
          <section className="relative overflow-hidden rounded-xl bg-primary/10 border border-primary/20 p-5">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active Team
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{team.fullName}</h2>
              <p className="text-slate-600 text-sm mt-1">{team.league}</p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="material-symbols-outlined text-primary text-sm">emoji_events</span>
                  <span className="text-sm font-semibold">Rank: {team.rank}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="material-symbols-outlined text-primary text-sm">leaderboard</span>
                  <span className="text-sm font-semibold">{team.record}</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-primary/10 -rotate-12 select-none">
              sports_soccer
            </span>
          </section>
        ) : (
          <section className="text-center py-10 text-slate-400 rounded-xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-4xl mb-2 block">sports_soccer</span>
            <p className="text-sm font-medium">No teams yet. Add your first team!</p>
          </section>
        )}

        {/* Schedule */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              Schedule
            </h3>
            <button className="text-primary text-sm font-bold">View Full</button>
          </div>
          {SCHEDULE.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No upcoming events.</p>
          )}
          <div className="space-y-3">
            {SCHEDULE.map((evt) => (
              <div
                key={evt.id}
                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4"
              >
                <div
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg ${
                    evt.isGame
                      ? 'bg-primary/10 text-primary'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">{evt.day}</span>
                  <span className="text-xl font-extrabold">{evt.date}</span>
                </div>
                <div className="flex-1">
                  <p
                    className={`text-xs font-bold uppercase ${
                      evt.isGame ? 'text-primary' : 'text-slate-400'
                    }`}
                  >
                    {evt.type}
                  </p>
                  <h4 className="font-bold text-slate-900">{evt.title}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {evt.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{evt.time}</p>
                  {evt.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${evt.badge.cls}`}
                    >
                      {evt.badge.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equipment Checklist */}
        <section>
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">checklist</span>
                  Equipment Checklist
                </h3>
                <span className="text-xs font-medium text-slate-400">
                  {packedCount} of {checklist.length} packed
                </span>
              </div>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                      item.critical && !item.packed
                        ? 'bg-white/10 border-primary/50 shadow-[0_0_15px_rgba(236,91,19,0.2)]'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => toggleChecklist(item.id)}
                      className="rounded border-white/20 text-primary focus:ring-primary bg-transparent size-5"
                    />
                    <span
                      className={`flex-1 text-sm font-medium ${
                        item.packed ? 'line-through opacity-50' : ''
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.critical && !item.packed && (
                      <span className="text-[10px] font-bold text-primary uppercase">Critical</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full" />
          </div>
        </section>

        {/* Team Contacts */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">groups</span>
            Team Contacts
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3"
              >
                <div className="size-12 rounded-full bg-slate-200 overflow-hidden">
                  <img
                    src={contact.img}
                    alt={contact.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{contact.name}</h4>
                  <p className="text-xs text-slate-500">{contact.role}</p>
                </div>
                <div className="flex gap-2">
                  {contact.showCall && (
                    <button
                      onClick={() => showToast('No live contact action configured yet.')}
                      className="p-2 bg-slate-100 rounded-full text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                    </button>
                  )}
                  <button
                    onClick={() => showToast('No live contact action configured yet.')}
                    className="p-2 bg-slate-100 rounded-full text-primary"
                  >
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Team Chat Button */}
        <div>
          <button
            onClick={() => navigate(paths.sportsChat)}
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base shadow-sm"
          >
            <span className="material-symbols-outlined">forum</span>
            Open Team Chat
          </button>
        </div>
      </main>
    </div>
  );
}
