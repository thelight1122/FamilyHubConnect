import { useState, useRef } from 'react';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

// TODO: fetch from /api/chores/tasks
const TASKS = [];

// TODO: fetch from /api/chores/rewards
const REWARDS = [];

export default function ChoresPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [completedIds, setCompletedIds] = useState([]);
  const [verifyingId, setVerifyingId] = useState(null);
  const fileInputRef = useRef(null);
  const [toast, showToast] = useToast();

  const toggleTask = (idx) => {
    setCompletedIds((prev) =>
      prev.includes(idx) ? prev.filter((id) => id !== idx) : [...prev, idx]
    );
  };

  const handleVerifyClick = (idx) => {
    setVerifyingId(idx);
    fileInputRef.current.click();
  };

  const handleFileSelected = () => {
    if (verifyingId !== null) {
      setCompletedIds((prev) => (prev.includes(verifyingId) ? prev : [...prev, verifyingId]));
      showToast('Photo submitted — task verified!');
      setVerifyingId(null);
    }
  };

  const completedCount = completedIds.length;
  const totalTasks = TASKS.length;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-background-light pb-24">
      <Toast message={toast} />

      {/* Hidden file input for photo verify */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="flex size-12 shrink-0 items-center">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC0ngvLToV6V4frOIHVhOWxIvGrGEDqpvYfTCuxkiYvd7doL4cOsA87hDyMv4pMXlOsXbqOLV_aqbbpIex2QIa9_goJV6vdXuxRFRp-oSw8yUvVHE2jPd3hoEkaN7wdnWe-YAAU-eswd1xp1pj7NS6f3IPSgbeMzFgQGZoma2ikgdv4aRKpgJYh1e4oGt7HM4dJ090kAsI_jMiXIGq7pRx4bpvgEOqp38jSpiNPKZCaAJkcML6SpZEZQq-jVeEG2Xjel62csLX-YXg")',
              }}
            />
          </div>
          <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Leo's Dashboard
          </h1>
          <div className="flex w-12 items-center justify-end">
            <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4">
        {/* Hero */}
        <div className="py-6">
          <div className="flex gap-4 items-center">
            <div className="bg-primary/20 rounded-2xl p-4 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl">rocket_launch</span>
            </div>
            <div className="flex flex-col">
              <p className="text-slate-900 text-2xl font-bold leading-tight">Great job, Leo!</p>
              <p className="text-slate-600 text-base">You're almost at your weekly goal.</p>
            </div>
          </div>
        </div>

        {/* Point Balance Card */}
        <div className="mb-6">
          <div className="flex flex-row items-center justify-between gap-2 rounded-2xl p-6 bg-primary text-white shadow-lg shadow-primary/20">
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Current Balance</p>
              <p className="text-4xl font-bold">
                450 <span className="text-xl font-normal">pts</span>
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <span className="material-symbols-outlined text-4xl text-white">stars</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Today's Progress</span>
            <span className="text-primary text-sm font-bold">
              {completedCount}/{totalTasks} Done
            </span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'tasks'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Tasks
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'rewards'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Rewards Store
          </button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 text-xl font-bold">My Tasks for Today</h2>
            </div>
            {TASKS.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 block">task_alt</span>
                <p className="text-sm font-medium">No tasks yet. Check back soon!</p>
              </div>
            )}
            <div className="space-y-3">
              {TASKS.map((task) => {
                const isDone = completedIds.includes(task.id);
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${
                      isDone
                        ? 'bg-slate-100 opacity-75 border-transparent'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div
                      className={`size-12 rounded-xl flex items-center justify-center ${
                        isDone
                          ? 'bg-slate-200 text-slate-500'
                          : `${task.iconBg} ${task.iconColor}`
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl">{task.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-bold ${
                          isDone ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}
                      >
                        {task.label}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {isDone ? 'Completed!' : `Earn ${task.points} points`}
                      </p>
                    </div>
                    {isDone ? (
                      <div className="text-primary">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                      </div>
                    ) : task.verify ? (
                      <button
                        onClick={() => handleVerifyClick(task.id)}
                        className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                        Verify
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold"
                      >
                        Done
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 text-xl font-bold">Rewards Store</h2>
              <button className="text-primary text-sm font-bold">See All</button>
            </div>
            {REWARDS.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 block">redeem</span>
                <p className="text-sm font-medium">No rewards yet. Keep earning points!</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {REWARDS.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col"
                >
                  <div className="h-32 bg-slate-200 relative overflow-hidden">
                    <img
                      src={reward.img}
                      alt={reward.label}
                      className="w-full h-full object-cover"
                    />
                    {reward.badge && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        {reward.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h4 className="font-bold text-sm text-slate-800">{reward.label}</h4>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-primary font-bold text-sm">{reward.points} pts</span>
                      {reward.canRedeem ? (
                        <button
                          onClick={() => showToast(`${reward.label} redeemed!`)}
                          className="bg-primary/10 text-primary p-1 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-lg">shopping_basket</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-slate-100 text-slate-400 p-1 rounded-lg cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-lg">lock</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
