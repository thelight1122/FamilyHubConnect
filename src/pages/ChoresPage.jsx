import { useState, useRef } from 'react';
import { tasks, rewards } from '../data/mockData';
import { currentMember } from '../data/selectors';
import Toast from '../components/Toast';
import useToast from '../hooks/useToast';

export default function ChoresPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [completedIds, setCompletedIds] = useState([3]);
  const [verifyingId, setVerifyingId] = useState(null);
  const [toast, showToast] = useToast();
  const fileInputRef = useRef(null);

  const toggleTask = (id) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleVerifyClick = (taskId) => {
    setVerifyingId(taskId);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    if (e.target.files?.length > 0 && verifyingId != null) {
      setCompletedIds((prev) => [...new Set([...prev, verifyingId])]);
      showToast('✓ Photo submitted — task verified!');
    }
    setVerifyingId(null);
    e.target.value = '';
  };

  const handleRedeem = (reward) => {
    if (450 >= reward.points) {
      showToast(`🎉 Redeemed: ${reward.title}!`);
    }
  };

  const progressPercent = Math.round((completedIds.length / tasks.length) * 100) || 0;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen pb-24 font-display flex flex-col">
      <Toast message={toast} />

      {/* Hidden file input for photo verify */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Header / Profile Section */}
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto">
          <div className="flex size-10 shrink-0 items-center">
             <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary overflow-hidden">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJLjl6Ef7bK-u_B2NcS7dt7erjVSdao2IuOgK27fYvgiRYQ1c6TSjOn2sdLMrDArlKAERFzjINx7uZP06Noe9OuWk9booq3wx_Ryr2CnXiJmlGeFfkTTvbnQ2nyIl1AS87YfbZI6bo_EWwXAAb_y-FPf38D3Wjt2L_CCENy3dwziFH1GbRkcUEW70bREGv3h0R9w_7URV-lb-elowFiRVjBwBTZCHCe2qrwSOOSwX374fPBHyuCHdlgpBTKVSwwDgPaoq16c8oURM" alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Chores & Rewards</h1>
          <div className="flex items-center justify-end">
             <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 rounded-full px-3 py-1.5">
               <span className="material-symbols-outlined text-amber-500 text-base filled-icon">star</span>
               <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{currentMember.points}</span>
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
              Store
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 flex-1">
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
                    <p className="text-2xl font-bold leading-tight">Great job, {currentMember.name}!</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">You're {progressPercent}% done for today.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Tasks Section */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Tasks for Today</h2>
                <span className="text-primary text-sm font-bold">{completedIds.length}/{tasks.length} Done</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-6">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="space-y-3">
                {tasks.map((task, idx) => {
                  const isDone = completedIds.includes(task.id);
                  // Assign some fun colors based on index to mimic the colorful mockup
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
                        <button onClick={() => toggleTask(task.id)} className="text-primary bg-primary/10 rounded-full p-1">
                          <span className="material-symbols-outlined text-3xl filled-icon">check_circle</span>
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div key={task.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                      <button onClick={() => toggleTask(task.id)} className={`size-12 rounded-xl bg-${colorTheme}-100 dark:bg-${colorTheme}-900/30 flex items-center justify-center text-${colorTheme}-600 active:scale-95 transition-transform`}>
                        <span className="material-symbols-outlined text-3xl">{taskIcon}</span>
                      </button>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{task.title}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-amber-500 filled-icon">star</span>
                          Earn {task.points} pts
                        </p>
                      </div>
                      
                      {task.requiresPhoto ? (
                        <button onClick={() => handleVerifyClick(task.id)} className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-primary-dark transition-colors">
                          <span className="material-symbols-outlined text-sm">photo_camera</span>
                          Verify
                        </button>
                      ) : (
                        <button onClick={() => toggleTask(task.id)} className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">
                          Done
                        </button>
                      )}
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
              <div className="grid grid-cols-2 gap-4">
                {rewards.map((reward, i) => {
                  const canAfford = currentMember.points >= reward.points;
                  
                  // Add realistic placeholder images since the mockup had rich images
                  const images = [
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAMej0Wdsz3Xzgku3ZBCTZirLNz9e1rYuhgJ1pcPlWAbEpHrV9cKmrQDZFJZeM1g3ZBnmkfBX9h-YVIV4o38DMjzxxf1TvqwX-Hpk7rB3fVPCqnhlC6MSPk8iNWi8QFkYK3bjC1wdC-ngc-fSmttHCfaeXB6oONaq-yMGxCHxaPBb8cqkVVpd5DR-z8t83G-JKNTZv2BRBEseRjm1xWEzTFbV-poi4zKbWIBmue_NwZ0prtcNeKHN_I3Rgjk_fGLo-BZI4B1N6FcGg",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBSJI7-HJfJse6Sn4NflsNcXTYDmipvAlMZi32pfJMe9x1lmmqUkIjwdWBIXnln2p-Ck5kPeHhnvReERjIN0kn7c6ZzDRKmzLAHvOfLIt9SiBrjUzCb5Xm3nYuE41GTJHTobq4ohL-e3rABeDkha5SIMBVOIRZRE3PNpDUGKdBmAY21aGmJzh7AMZ4MJaeQltp5zzvd-oO-I6h3-McH64d1ad3tj6BFpf3BfzkMT-K8uHNQyPgp437Jc9y3FHBZDjdi3-rczISXvLM",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuB6gXHkOzN6WHGK6wbMTLyGcBKWKYy_3S1Oz2khRp5-cepRmYWDp49zO6yRk1FRe0KerZBHH9DeC_c5jDAZSTvlfAlTnmRQ076inuVZ_tPThLpNeZhsLvQfohpcy0wh5RSfWPLDWkv853mEljSYhewKvNlO9IjkFMKlwj9ubHqw5oVdvQprspyCCtwb34BOTnmij4zQyPOxaRRZuQx9OxMo3Qb9069B-GtL4ZH1ji6rmdrt-su73ByBcEOiy80zxCylDLE-IhKm-FQ",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDlRUOinb7Ek7TUWRb0zQAIe1ahCjhSPo5jWIkyDmLUYIkECl7tmMFqjNHQ7kS5pxVk9Q6RQt_KvyCGMmPPCto_ls5xEcHMHTsBbongEb30A9YJpVxQ4CNtr0KqUuFF31OhfF40es0779NRiGj8V-8huHTfwvtRl0_VtZ_DEqmkcURXlk414Y-72gLVeJaIwYG61ppo9b7JxM7bJkJINAeSpMKZSs3uI4Da-4u1DX-IMWd5MrlTzd3jMNCtdz9BdF_dIlU-NA5qu6E"
                  ];
                  
                  return (
                    <div key={reward.id} className="bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
                      <div className="h-32 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                        <img src={images[i % images.length]} alt={reward.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {i === 0 && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">POPULAR</div>
                        )}
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{reward.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5 mb-2">{reward.subtitle}</p>
                        
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                          <span className={`font-bold text-sm flex items-center gap-0.5 ${canAfford ? 'text-primary' : 'text-slate-400'}`}>
                            {reward.points} <span className="text-[10px] font-medium">pts</span>
                          </span>
                          
                          {canAfford ? (
                            <button onClick={() => handleRedeem(reward)} className="bg-primary/10 text-primary p-1.5 rounded-lg hover:bg-primary/20 transition-colors active:scale-90">
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
            </section>
          </>
        )}
      </main>
    </div>
  );
}
