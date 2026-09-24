import { useState } from 'react';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';
import useAuth from '../context/useAuth';
import useFamilyCore from '../hooks/useFamilyCore';

export default function ChoresPage() {
  const { currentUser, supabaseAuthEnabled } = useAuth();
  const {
    family,
    chores,
    rewards,
    isLoading,
    error,
    createFamily,
    addChore,
    toggleChore,
    addReward,
  } = useFamilyCore();
  const [activeTab, setActiveTab] = useState('tasks');
  const [toast, showToast] = useToast();
  const [familyForm, setFamilyForm] = useState({ name: '', displayName: currentUser?.name ?? '' });
  const [choreForm, setChoreForm] = useState({ title: '', points: '0' });
  const [rewardForm, setRewardForm] = useState({ title: '', points: '1' });

  const completedCount = chores.filter((task) => task.completed_at).length;
  const progressPercent = Math.round((completedCount / chores.length) * 100) || 0;

  const handleCreateFamily = async (event) => {
    event.preventDefault();
    const result = await createFamily({
      name: familyForm.name,
      displayName: familyForm.displayName || currentUser?.name || currentUser?.email || 'Family Member',
    });
    showToast(result.ok ? 'Family created' : result.message);
  };

  const handleAddChore = async (event) => {
    event.preventDefault();
    const result = await addChore(choreForm);
    if (result.ok) {
      setChoreForm({ title: '', points: '0' });
    }
    showToast(result.ok ? 'Chore added' : result.message);
  };

  const handleToggleChore = async (chore) => {
    const result = await toggleChore(chore);
    showToast(result.ok ? (chore.completed_at ? 'Chore reopened' : 'Chore completed') : result.message);
  };

  const handleAddReward = async (event) => {
    event.preventDefault();
    const result = await addReward(rewardForm);
    if (result.ok) {
      setRewardForm({ title: '', points: '1' });
    }
    showToast(result.ok ? 'Reward added' : result.message);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-24 font-display flex flex-col">
      <Toast message={toast} />

      {/* Header / Profile Section */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto">
          <div className="flex size-10 shrink-0 items-center">
             <div className="rounded-full size-10 border-2 border-primary bg-primary/10 text-primary flex items-center justify-center font-black">
               {currentUser?.name?.slice(0, 1).toUpperCase() || 'F'}
             </div>
          </div>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Chores & Rewards</h1>
          <div className="flex items-center justify-end">
             <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-full px-3 py-1.5">
               <span className="material-symbols-outlined text-amber-500 text-base filled-icon">star</span>
               <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{chores.reduce((sum, chore) => sum + (chore.completed_at ? chore.points : 0), 0)}</span>
             </div>
          </div>
        </div>
        
        {/* Tab switcher inside sticky header */}
        <div className="px-4 pb-3 max-w-2xl mx-auto">
          <div className="flex gap-2 bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'rewards'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Rewards Store
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 flex-1">
        {!supabaseAuthEnabled && (
          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            Live data entry requires Supabase authentication. Configure Supabase and sign in to create your test family.
          </section>
        )}

        {error && (
          <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
            {error}
          </section>
        )}

        {supabaseAuthEnabled && !isLoading && !family && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Create Test Family</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">This creates the first live family record for your signed-in account.</p>
            <form className="mt-4 space-y-3" onSubmit={handleCreateFamily}>
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary"
                value={familyForm.name}
                onChange={(event) => setFamilyForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Family name"
                required
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-primary"
                value={familyForm.displayName}
                onChange={(event) => setFamilyForm((prev) => ({ ...prev, displayName: event.target.value }))}
                placeholder="Your display name"
                required
              />
              <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-black text-white" type="submit">
                Create Family
              </button>
            </form>
          </section>
        )}

        {activeTab === 'tasks' ? (
          <>
            {/* Hero Section */}
            <div className="py-6">
              <div className="flex w-full flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div className="bg-primary/20 rounded-2xl p-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl">rocket_launch</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-2xl font-bold leading-tight">{family?.name ?? 'Live Family Setup'}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{chores.length > 0 ? `You're ${progressPercent}% done for today.` : 'Add your first live chore to begin.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Tasks Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Tasks for Today</h2>
                <span className="text-primary text-sm font-bold">{completedCount}/{chores.length} Done</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-6">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {family && (
                <form className="mb-4 grid grid-cols-[1fr_88px_auto] gap-2" onSubmit={handleAddChore}>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
                    value={choreForm.title}
                    onChange={(event) => setChoreForm((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="New chore"
                    required
                  />
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
                    type="number"
                    min="0"
                    value={choreForm.points}
                    onChange={(event) => setChoreForm((prev) => ({ ...prev, points: event.target.value }))}
                    aria-label="Chore points"
                  />
                  <button className="rounded-xl bg-primary px-4 py-2 text-sm font-black text-white" type="submit">Add</button>
                </form>
              )}

              <div className="space-y-3">
                {chores.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
                    <span className="material-symbols-outlined text-3xl text-slate-300">checklist</span>
                    <h3 className="mt-2 font-bold text-slate-700 dark:text-slate-200">No live chores entered</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Use the form above to add your first test-family chore.</p>
                  </div>
                ) : chores.map((task, idx) => {
                  const isDone = Boolean(task.completed_at);
                  const icons = ["bed", "recycling", "auto_stories", "pet_supplies"];
                  const colors = ["blue", "green", "purple", "orange"];
                  const taskIcon = icons[idx % icons.length];
                  const colorTheme = colors[idx % colors.length];
                  
                  if (isDone) {
                    return (
                      <div key={task.id} className="bg-slate-100 dark:bg-slate-800/30 p-4 rounded-2xl flex items-center gap-4 opacity-75 transition-all">
                        <div className="size-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                          <span className="material-symbols-outlined text-3xl">{taskIcon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-400 line-through">{task.title}</h3>
                          <p className="text-sm text-slate-400">Completed!</p>
                        </div>
                        <button onClick={() => handleToggleChore(task)} className="text-primary bg-primary/10 rounded-full p-1">
                          <span className="material-symbols-outlined text-3xl filled-icon">check_circle</span>
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                      <button onClick={() => handleToggleChore(task)} className={`size-12 rounded-xl bg-${colorTheme}-100 dark:bg-${colorTheme}-900/30 flex items-center justify-center text-${colorTheme}-600 active:scale-95 transition-transform`}>
                        <span className="material-symbols-outlined text-3xl">{taskIcon}</span>
                      </button>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{task.title}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-amber-500 filled-icon">star</span>
                          Earn {task.points} pts
                        </p>
                      </div>
                      
                      <button onClick={() => handleToggleChore(task)} className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">
                        Done
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Rewards Store Tab */}
            <section className="py-6 mb-10">
              <h2 className="mb-4 text-xl font-bold">Rewards Store</h2>
              {family && (
                <form className="mb-4 grid grid-cols-[1fr_88px_auto] gap-2" onSubmit={handleAddReward}>
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
                    value={rewardForm.title}
                    onChange={(event) => setRewardForm((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="New reward"
                    required
                  />
                  <input
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
                    type="number"
                    min="1"
                    value={rewardForm.points}
                    onChange={(event) => setRewardForm((prev) => ({ ...prev, points: event.target.value }))}
                    aria-label="Reward points"
                  />
                  <button className="rounded-xl bg-primary px-4 py-2 text-sm font-black text-white" type="submit">Add</button>
                </form>
              )}
              {rewards.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
                  <span className="material-symbols-outlined text-3xl text-slate-300">redeem</span>
                  <h3 className="mt-2 font-bold text-slate-700 dark:text-slate-200">No live rewards entered</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">Use the form above to add your first test-family reward.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {rewards.map((reward, i) => {
                  const canAfford = completedCount > 0;
                  
                  return (
                    <div key={reward.id} className="bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
                      <div className="h-32 bg-primary/10 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-5xl">redeem</span>
                        {i === 0 && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">POPULAR</div>
                        )}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{reward.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5 mb-2">Live reward</p>
                        
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                          <span className={`font-bold text-sm flex items-center gap-0.5 ${canAfford ? 'text-primary' : 'text-slate-400'}`}>
                            {reward.points} <span className="text-[10px] font-medium">pts</span>
                          </span>
                          
                          {canAfford ? (
                            <button onClick={() => showToast(`Reward selected: ${reward.title}`)} className="bg-primary/10 text-primary p-1.5 rounded-lg hover:bg-primary/20 transition-colors active:scale-90">
                              <span className="material-symbols-outlined text-lg">shopping_basket</span>
                            </button>
                          ) : (
                            <button className="bg-slate-100 dark:bg-slate-700 text-slate-400 p-1.5 rounded-lg cursor-not-allowed">
                              <span className="material-symbols-outlined text-lg">lock</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
