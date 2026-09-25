import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useFamilyCore from '../../hooks/useFamilyCore';
import useSports from '../../hooks/useSports';
import useAuth from '../../context/useAuth';

const inputClass = 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm';

export default function LockerRoomPage() {
  const navigate = useNavigate();
  const [toast, showToast] = useToast();
  const { family, membership } = useFamilyCore();
  const sports = useSports(family?.id);
  const { supabaseAuthEnabled } = useAuth();
  const isAdult = membership?.role === 'adult';

  const [teamId, setTeamId] = useState(null);
  const team = sports.teams.find((t) => t.id === teamId) ?? sports.teams[0] ?? null;
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: '', league: '' });
  const [eventForm, setEventForm] = useState({ kind: 'practice', title: '', when: '', location: '' });
  const [itemForm, setItemForm] = useState({ label: '', critical: false });
  const [contactForm, setContactForm] = useState({ name: '', role: '', phone: '', email: '' });

  const schedule = sports.events.filter((e) => e.team_id === team?.id);
  const checklist = sports.checklist.filter((i) => i.team_id === team?.id);
  const contacts = sports.contacts.filter((c) => c.team_id === team?.id);
  const packedCount = checklist.filter((i) => i.packed).length;

  const run = async (promise, success, reset) => {
    const outcome = await promise;
    showToast(outcome.ok ? success : outcome.message);
    if (outcome.ok) reset?.();
  };

  const addTeam = () => {
    if (!sports.live) return showToast('Sign in to a live family to add teams.');
    if (!isAdult) return showToast('An adult adds teams.');
    setShowTeamForm((v) => !v);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light pb-24">
      <Toast message={toast} />

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background-light/80 backdrop-blur-md border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-xl font-bold tracking-tight">Locker Room</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto w-full px-4 py-6 space-y-8">
        {sports.error && <p className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{sports.error}</p>}

        {/* Team Switcher */}
        <section>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {sports.teams.map((t) => (
              <button key={t.id} onClick={() => setTeamId(t.id)} className="flex flex-col items-center gap-2 min-w-[72px] focus:outline-none">
                <div className={`size-16 rounded-full p-0.5 ${t.id === team?.id ? 'border-4 border-primary bg-background-light' : 'border-2 border-slate-200 opacity-60'}`}>
                  <div className="w-full h-full rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-black">
                    {t.name.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <span className={`text-xs font-bold ${t.id === team?.id ? 'text-primary' : 'text-slate-500 font-medium'}`}>{t.name}</span>
              </button>
            ))}
            <button onClick={addTeam} disabled={supabaseAuthEnabled && !sports.live} className="flex flex-col items-center gap-2 min-w-[72px] opacity-60 disabled:opacity-30">
              <div className="size-16 rounded-full border-2 border-slate-200 flex items-center justify-center bg-slate-100">
                <span className="material-symbols-outlined text-slate-400">add</span>
              </div>
              <span className="text-xs font-medium">Add Team</span>
            </button>
          </div>
          {showTeamForm && (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(sports.addTeam(teamForm.name, teamForm.league), 'Team added', () => {
                  setTeamForm({ name: '', league: '' });
                  setShowTeamForm(false);
                });
              }}
            >
              <input value={teamForm.name} onChange={(e) => setTeamForm((f) => ({ ...f, name: e.target.value }))} placeholder="Team name" required className={`${inputClass} flex-1`} />
              <input value={teamForm.league} onChange={(e) => setTeamForm((f) => ({ ...f, league: e.target.value }))} placeholder="League" className={`${inputClass} w-28`} />
              <button type="submit" className="rounded-lg bg-primary px-3 text-sm font-bold text-white">Save</button>
            </form>
          )}
        </section>

        {/* Active Team Card */}
        {team ? (
          <section className="relative overflow-hidden rounded-xl bg-primary/10 border border-primary/20 p-5">
            <div className="relative z-10">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Active Team</span>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{team.name}</h2>
              {team.league && <p className="text-slate-600 text-sm mt-1">{team.league}</p>}
              {team.record && (
                <div className="mt-4 inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="material-symbols-outlined text-primary text-sm">leaderboard</span>
                  <span className="text-sm font-semibold">{team.record}</span>
                </div>
              )}
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl text-primary/10 -rotate-12 select-none">sports_soccer</span>
          </section>
        ) : (
          <section className="text-center py-10 text-slate-400 rounded-xl bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-4xl mb-2 block">sports_soccer</span>
            <p className="text-sm font-medium">No teams yet. Add your first team!</p>
          </section>
        )}

        {/* Schedule */}
        <section>
          <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            Schedule
          </h3>
          {schedule.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No upcoming events.</p>}
          <div className="space-y-3">
            {schedule.map((evt) => {
              const start = new Date(evt.starts_at);
              const isGame = evt.kind === 'game';
              return (
                <div key={evt.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                  <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg ${isGame ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                    <span className="text-xs font-bold uppercase">{start.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                    <span className="text-xl font-extrabold">{start.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold uppercase ${isGame ? 'text-primary' : 'text-slate-400'}`}>{evt.kind}</p>
                    <h4 className="font-bold text-slate-900">{evt.title}</h4>
                    {evt.location && (
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {evt.location}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-bold">{start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              );
            })}
          </div>
          {team && isAdult && (
            <form
              className="mt-3 grid grid-cols-2 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(sports.addEvent(team.id, eventForm.kind, eventForm.title, eventForm.when, eventForm.location), 'Event added', () =>
                  setEventForm({ kind: 'practice', title: '', when: '', location: '' })
                );
              }}
            >
              <select value={eventForm.kind} onChange={(e) => setEventForm((f) => ({ ...f, kind: e.target.value }))} aria-label="Event type" className={inputClass}>
                <option value="practice">Practice</option>
                <option value="game">Game</option>
                <option value="other">Other</option>
              </select>
              <input type="datetime-local" value={eventForm.when} onChange={(e) => setEventForm((f) => ({ ...f, when: e.target.value }))} required aria-label="Event time" className={inputClass} />
              <input value={eventForm.title} onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))} placeholder="Event title" required className={inputClass} />
              <input value={eventForm.location} onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))} placeholder="Location" className={inputClass} />
              <button type="submit" className="col-span-2 rounded-lg bg-primary py-2 text-sm font-bold text-white">Add event</button>
            </form>
          )}
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
                <span className="text-xs font-medium text-slate-400">{packedCount} of {checklist.length} packed</span>
              </div>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                      item.critical && !item.packed ? 'bg-white/10 border-primary/50' : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.packed}
                      onChange={() => run(sports.setPacked(item.id, !item.packed), item.packed ? 'Unpacked' : 'Packed')}
                      className="rounded border-white/20 text-primary focus:ring-primary bg-transparent size-5"
                    />
                    <span className={`flex-1 text-sm font-medium ${item.packed ? 'line-through opacity-50' : ''}`}>{item.label}</span>
                    {item.critical && !item.packed && <span className="text-[10px] font-bold text-primary uppercase">Critical</span>}
                  </label>
                ))}
              </div>
              {team && isAdult && (
                <form
                  className="mt-4 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    run(sports.addChecklistItem(team.id, itemForm.label, itemForm.critical), 'Item added', () => setItemForm({ label: '', critical: false }));
                  }}
                >
                  <input value={itemForm.label} onChange={(e) => setItemForm((f) => ({ ...f, label: e.target.value }))} placeholder="Item" required className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40" />
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={itemForm.critical} onChange={(e) => setItemForm((f) => ({ ...f, critical: e.target.checked }))} />
                    Critical
                  </label>
                  <button type="submit" className="rounded-lg bg-primary px-3 text-sm font-bold">Add</button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Team Contacts */}
        <section>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">groups</span>
            Team Contacts
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{contact.name.slice(0, 1).toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm">{contact.name}</h4>
                  <p className="text-xs text-slate-500">{contact.role}</p>
                </div>
                <div className="flex gap-2">
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} aria-label={`Call ${contact.name}`} className="p-2 bg-slate-100 rounded-full text-primary">
                      <span className="material-symbols-outlined text-sm">call</span>
                    </a>
                  )}
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} aria-label={`Email ${contact.name}`} className="p-2 bg-slate-100 rounded-full text-primary">
                      <span className="material-symbols-outlined text-sm">mail</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
            {team && isAdult && (
              <form
                className="grid grid-cols-2 gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  run(sports.addContact(team.id, contactForm.name, contactForm.role, contactForm.phone, contactForm.email), 'Contact added', () =>
                    setContactForm({ name: '', role: '', phone: '', email: '' })
                  );
                }}
              >
                <input value={contactForm.name} onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))} placeholder="Contact name" required className={inputClass} />
                <input value={contactForm.role} onChange={(e) => setContactForm((f) => ({ ...f, role: e.target.value }))} placeholder="Role (e.g. Coach)" className={inputClass} />
                <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone" className={inputClass} />
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className={inputClass} />
                <button type="submit" className="col-span-2 rounded-lg bg-primary py-2 text-sm font-bold text-white">Add contact</button>
              </form>
            )}
          </div>
        </section>

        {/* Open Team Chat Button */}
        <div>
          <button
            onClick={() => navigate(team ? `${paths.sportsChat}?team=${team.id}` : paths.sportsChat)}
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
