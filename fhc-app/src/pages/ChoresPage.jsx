import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasks, rewards } from '../data/mockData';

export default function ChoresPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [completedIds, setCompletedIds] = useState([3]);
  const navigate = useNavigate();

  const toggleTask = (id) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="min-h-screen bg-background-light pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Tasks &amp; Rewards</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
          <span className="material-symbols-outlined text-amber-400 text-base">star</span>
          <span className="text-sm font-bold text-amber-700">450 pts</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'tasks'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            My Tasks
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'rewards'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Rewards Store
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Tasks tab */}
        {activeTab === 'tasks' && (
          <>
            {/* Progress summary */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  {completedIds.length} of {tasks.length} completed
                </span>
                <span className="text-sm font-bold text-primary">
                  {Math.round((completedIds.length / tasks.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(completedIds.length / tasks.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Task cards */}
            {tasks.map((task) => {
              const isDone = completedIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl p-4 border transition-colors ${
                    isDone ? 'border-green-100' : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isDone
                          ? 'bg-green-500 border-green-500'
                          : 'border-slate-300 hover:border-primary'
                      }`}
                    >
                      {isDone && (
                        <span className="material-symbols-outlined text-white text-sm leading-none">check</span>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`text-sm font-semibold ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </p>
                        <span className="text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">
                          +{task.points} pts
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-slate-400 font-medium">Due: {task.due}</span>
                        {task.requiresPhoto && !isDone && (
                          <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                            <span className="material-symbols-outlined text-sm leading-none">photo_camera</span>
                            Verify 📷
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Rewards tab */}
        {activeTab === 'rewards' && (
          <>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
              <p className="text-sm text-amber-800 font-medium">
                You have <span className="font-bold">450 pts</span> to spend in the store!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl">{reward.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{reward.title}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{reward.subtitle}</p>
                  </div>
                  <span className="text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2.5 py-0.5">
                    {reward.points} pts
                  </span>
                  <button
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                      450 >= reward.points
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                    disabled={450 < reward.points}
                  >
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
