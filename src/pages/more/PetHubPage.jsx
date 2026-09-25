import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useFamilyCore from '../../hooks/useFamilyCore';
import usePets from '../../hooks/usePets';

const inputClass = 'rounded-lg border border-slate-200 px-3 py-2 text-sm';

function ageOf(birthDate) {
  if (!birthDate) return '--';
  const years = (Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 3600 * 1000);
  return years < 1 ? `${Math.max(1, Math.round(years * 12))} mo` : `${Math.floor(years)} yr`;
}

export default function PetHubPage() {
  const [toast, showToast] = useToast();
  const { family, membership, members } = useFamilyCore();
  const pets = usePets(family?.id);
  const isAdult = membership?.role === 'adult';
  const [petId, setPetId] = useState(null);
  const pet = pets.pets.find((p) => p.id === petId) ?? pets.pets[0] ?? null;

  const [petForm, setPetForm] = useState({ name: '', species: '', birthDate: '', weightKg: '' });
  const [feedingForm, setFeedingForm] = useState({ label: '', time: '08:00' });
  const [walkForm, setWalkForm] = useState({ minutes: '20', km: '' });
  const [showWalkForm, setShowWalkForm] = useState(false);
  const [vetForm, setVetForm] = useState({ when: '', reason: '' });

  const feedings = pets.feedings.filter((f) => f.pet_id === pet?.id);
  const walks = pets.walks.filter((w) => w.pet_id === pet?.id);
  const appointments = pets.appointments.filter((a) => a.pet_id === pet?.id);
  const today = new Date().toDateString();
  const todayKm = walks.filter((w) => new Date(w.walked_at).toDateString() === today).reduce((sum, w) => sum + Number(w.distance_km ?? 0), 0);
  const weekMinutes = walks.reduce((sum, w) => sum + w.minutes, 0);
  const nameOf = (userId) => members.find((m) => m.user_id === userId)?.display_name ?? 'Family member';

  const run = async (promise, success, reset) => {
    const outcome = await promise;
    showToast(outcome.ok ? success : outcome.message);
    if (outcome.ok) reset?.();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
      <Toast message={toast} />
      <BackHeader title="Pet Hub" backTo={paths.more} />

      <div className="flex-1 overflow-y-auto pb-8">
        {pets.error && <p className="mx-4 mt-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{pets.error}</p>}

        {pets.pets.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 pt-4" aria-label="Pets">
            {pets.pets.map((p) => (
              <button key={p.id} onClick={() => setPetId(p.id)} className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-semibold ${p.id === pet?.id ? 'bg-primary text-white border-primary' : 'border-slate-200 text-slate-600'}`}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Pet Profile Header */}
        <div className="flex p-6">
          <div className="flex w-full flex-col gap-4 items-center">
            <div className="flex gap-4 flex-col items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/10 bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-6xl">pets</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-slate-900 text-2xl font-bold leading-tight tracking-tight text-center">{pet?.name ?? 'No live pet entered'}</h1>
                <p className="text-slate-500 text-sm font-medium text-center">{pet ? pet.species || 'Family pet' : 'Pet profile details will appear after entry.'}</p>
              </div>
            </div>
          </div>
        </div>

        {pets.live && isAdult && (
          <form
            className="mx-4 mb-6 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 p-3"
            aria-label="Add a pet"
            onSubmit={(e) => {
              e.preventDefault();
              run(pets.addPet(petForm), 'Pet added', () => setPetForm({ name: '', species: '', birthDate: '', weightKg: '' }));
            }}
          >
            <p className="col-span-2 text-xs font-bold uppercase tracking-wider text-slate-500">Add a pet</p>
            <input value={petForm.name} onChange={(e) => setPetForm((f) => ({ ...f, name: e.target.value }))} placeholder="Pet name" required className={inputClass} />
            <input value={petForm.species} onChange={(e) => setPetForm((f) => ({ ...f, species: e.target.value }))} placeholder="Species" className={inputClass} />
            <input type="date" value={petForm.birthDate} onChange={(e) => setPetForm((f) => ({ ...f, birthDate: e.target.value }))} aria-label="Birth date" className={inputClass} />
            <input type="number" step="0.1" min="0" value={petForm.weightKg} onChange={(e) => setPetForm((f) => ({ ...f, weightKg: e.target.value }))} placeholder="Weight (kg)" className={inputClass} />
            <button type="submit" className="col-span-2 rounded-lg bg-primary py-2 text-sm font-bold text-white">Add pet</button>
          </form>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 px-4 mb-6">
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Weight</p>
            <p className="text-slate-900 text-lg font-bold">{pet?.weight_kg ? `${pet.weight_kg} kg` : '--'}</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Age</p>
            <p className="text-slate-900 text-lg font-bold">{ageOf(pet?.birth_date)}</p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl p-4 bg-primary/5 border border-primary/10">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Activity</p>
            <p className="text-slate-900 text-lg font-bold">{pet ? `${weekMinutes}m/wk` : '--'}</p>
          </div>
        </div>

        {/* Feeding Schedule Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">Feeding Schedule</h3>
          </div>
          <div className="space-y-3">
            {feedings.map((feeding) => (
              <div key={feeding.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <span className="text-sm font-semibold">{feeding.label}</span>
                <span className="text-sm text-slate-500">{feeding.time_of_day.slice(0, 5)}</span>
              </div>
            ))}
            {feedings.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <span className="material-symbols-outlined text-3xl text-slate-300">restaurant</span>
                <p className="mt-2 text-sm font-bold text-slate-600">No live feeding schedule entered</p>
              </div>
            )}
            {pet && isAdult && (
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  run(pets.addFeeding(pet.id, feedingForm.label, feedingForm.time), 'Feeding added', () => setFeedingForm({ label: '', time: '08:00' }));
                }}
              >
                <input value={feedingForm.label} onChange={(e) => setFeedingForm((f) => ({ ...f, label: e.target.value }))} placeholder="Meal (e.g. 1 cup kibble)" required className={`${inputClass} flex-1`} />
                <input type="time" value={feedingForm.time} onChange={(e) => setFeedingForm((f) => ({ ...f, time: e.target.value }))} aria-label="Feeding time" className={inputClass} />
                <button type="submit" className="rounded-lg bg-primary px-3 text-sm font-bold text-white">Add</button>
              </form>
            )}
          </div>
        </div>

        {/* Daily Walks Log */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-lg font-bold tracking-tight">Daily Walks</h3>
            <button
              onClick={() => (pet ? setShowWalkForm((v) => !v) : showToast('Add a pet first.'))}
              className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-bold"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add Walk
            </button>
          </div>
          {showWalkForm && pet && (
            <form
              className="mb-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(pets.logWalk(pet.id, Number(walkForm.minutes), walkForm.km ? Number(walkForm.km) : null), 'Walk logged', () => {
                  setWalkForm({ minutes: '20', km: '' });
                  setShowWalkForm(false);
                });
              }}
            >
              <input type="number" min="1" value={walkForm.minutes} onChange={(e) => setWalkForm((f) => ({ ...f, minutes: e.target.value }))} aria-label="Minutes" className={`${inputClass} w-24`} />
              <input type="number" min="0" step="0.1" value={walkForm.km} onChange={(e) => setWalkForm((f) => ({ ...f, km: e.target.value }))} placeholder="km" className={`${inputClass} w-24`} />
              <button type="submit" className="flex-1 rounded-lg bg-primary text-sm font-bold text-white">Log walk</button>
            </form>
          )}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-bold uppercase">Total Distance Today</span>
                <span className="text-xl font-bold text-slate-900">{todayKm.toFixed(todayKm % 1 ? 1 : 0)} km</span>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">directions_walk</span>
            </div>
            <div className="p-4 space-y-4">
              {walks.length === 0 && <p className="text-sm text-slate-400 text-center py-2">No walks recorded yet.</p>}
              {walks.map((walk) => (
                <div key={walk.id} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 flex justify-between text-sm">
                    <span className="font-medium">{nameOf(walk.walked_by)} · {walk.minutes} min</span>
                    <span className="text-slate-500">{new Date(walk.walked_at).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Vet Appointments */}
        <div className="px-4 mb-8">
          <h3 className="text-slate-900 text-lg font-bold tracking-tight mb-4">Vet Appointments</h3>
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm font-bold">{appt.reason}</p>
                <p className="text-xs text-slate-500">{new Date(appt.scheduled_at).toLocaleString()}</p>
              </div>
            ))}
            {appointments.length === 0 && (
              <div className="rounded-xl border border-dashed border-orange-100 bg-orange-50 p-6 text-center">
                <span className="material-symbols-outlined text-3xl text-orange-300">event</span>
                <p className="mt-2 text-sm font-bold text-slate-600">No live vet appointments entered</p>
              </div>
            )}
            {pet && isAdult && (
              <form
                className="grid grid-cols-2 gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  run(pets.addAppointment(pet.id, vetForm.when, vetForm.reason), 'Appointment added', () => setVetForm({ when: '', reason: '' }));
                }}
              >
                <input type="datetime-local" value={vetForm.when} onChange={(e) => setVetForm((f) => ({ ...f, when: e.target.value }))} required aria-label="Appointment time" className={inputClass} />
                <input value={vetForm.reason} onChange={(e) => setVetForm((f) => ({ ...f, reason: e.target.value }))} placeholder="Reason" required className={inputClass} />
                <button type="submit" className="col-span-2 rounded-lg bg-primary py-2 text-sm font-bold text-white">Add appointment</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
