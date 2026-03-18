import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

// TODO: fetch teams from /api/sports/teams
const TEAMS = [
  {
    id: 0,
    name: "Leo's Soccer",
    fullName: "Leo's Soccer - Tigers FC",
    league: 'U10 Regional League • Spring Season',
    rank: '3rd',
    record: '4-1-0',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbXUEHKF84ekcjfKN-giHAd_A0orABvNzOxKP3SKFqH23mjKaY4nfZzcOBwxZ-Z7QRqW5M2McT5BcRFpEK24p-4QeDuQzf6XTDoPmmvRrTOhjat-SO8NdDZ1j-4wKM3O1V8RJtWFPOsf5lV3O-aCocA9a5wtAVJ8XBYF7PG5z6_yZGjsjg_aL3MMQWHpg5cl-qzvaL6EjmzITLdtUXMZ6_t1-MWGykI5JE5HEOzc2MTyNqGylQ8gslCa-X74Zam2Q_71hrPA4Y1wI',
  },
  {
    id: 1,
    name: "Maya's Ballet",
    fullName: "Maya's Ballet - Studio B",
    league: 'Junior Division • Spring Season',
    rank: '1st',
    record: '5-0-0',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7UMMPz5c8Mn8F5es_lKw965A1CQDy_5TjE2JNTxvmd-chLvGfkqG16plCDTLrCRkhAjWedOt70rjK0LzIyIMUVmfJISqN0xfbmf4wdVMy1T5r_jM4ouTB0ADHB3F-5mEZmeUJ0m5ynEwa21XJFpuZWVfE2LUBXYjFF9argapbjp_xrNhQ4rGHv9L-_hpQ4Rv6agGaqI0K8nntV6M8PRSHDpnnXRqXV2-NIoOiWAlDIDIj9ITPNvuZYknRSVHWoTT2YmjCdmeBHA',
  },
];

const CHECKLIST_ITEMS = [
  { id: 0, label: 'Team Jersey (Home)', packed: true },
  { id: 1, label: 'Shin Guards', packed: true },
  { id: 2, label: 'Soccer Cleats', packed: true },
  { id: 3, label: 'Water Bottle (32oz)', packed: false, critical: true },
  { id: 4, label: 'Snack for Post-Game', packed: false },
];

const SCHEDULE = [
  {
    id: 0,
    day: 'Sat',
    date: '14',
    type: 'Game Day',
    title: 'Tigers vs. Hawks',
    location: 'Westside Park, Field 4',
    time: '9:00 AM',
    badge: { label: 'Confirmed', cls: 'bg-green-100 text-green-700' },
    isGame: true,
  },
  {
    id: 1,
    day: 'Tue',
    date: '17',
    type: 'Practice',
    title: 'Midweek Drills',
    location: 'Community Center',
    time: '5:30 PM',
    badge: null,
    isGame: false,
  },
];

const CONTACTS = [
  {
    id: 0,
    name: 'Coach Mike',
    role: 'Head Coach',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYECR27IDzxddN4wML17spxEAmw-tVkH2-fazaQOESnmvA_zwFmGlwEDuQPbXbYfWNdim1VNde2R0d2gym6hsJvmxbE2GZ4OX-P_XzzCtcEKldAMpR198NGpgTT_yoON1OxL_-LTX_6At8b9KbiyDGeOvq-LcU3-7vFMJRiW4q2M5nydofzPPEcZf7FekekbynV27iqBw1KpGi5jeQf0yMNZlIt4TTPl8XHcF2UjiqI4OptZJgcpxJEL9WwsIPiyBSzFUXKP1pOnI',
    showCall: true,
  },
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Carpool Buddy',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDon7Pgeue5cvycYpquoe0trp5oqfiBaT12VrKa1zBknT-rDOROkQ8uESlK6ZuUjOFxirMoscw97Id_vViidvUAkQtOuuJVvBBXKRMDKjIZghfNIlikI5wvv-3wJrzyOTaTRWepm642huTfGMxcUi_PU5G3KfR41bCUUoGKvn5GhCUOcMtvUmdAsD5n8Sl-GgxFZa3lAcM3FaGAlx7OedsfHZcuX6emKuWUbiFc-atzMiMOnbQcEGmwaMYfIQW3Y3sr0gocShFy3B8',
    showCall: false,
  },
];

export default function LockerRoomPage() {
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState(0);
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const [toast, showToast] = useToast();

  const team = TEAMS[activeTeam];

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
        {activeTeam === 0 && (
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
        )}

        {activeTeam === 1 && (
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
              sports
            </span>
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
                      onClick={() => showToast('Message feature coming soon!')}
                      className="p-2 bg-slate-100 rounded-full text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">call</span>
                    </button>
                  )}
                  <button
                    onClick={() => showToast('Message feature coming soon!')}
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
