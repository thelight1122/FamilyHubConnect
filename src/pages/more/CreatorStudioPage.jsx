import { useState, useEffect } from 'react';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import { creatorStudio } from '../../data/mockData';

const CREATE_TYPES = [
  { id: 'photo', label: 'Photo Story', icon: 'photo_camera', gradient: 'from-pink-400 to-rose-500' },
  { id: 'voice', label: 'Voice Memo', icon: 'mic', gradient: 'from-emerald-400 to-emerald-600' },
  { id: 'poll', label: 'Family Poll', icon: 'poll', gradient: 'from-violet-400 to-violet-600' },
];

const TYPE_BADGE_COLORS = {
  'Photo Story': 'bg-pink-100 text-pink-600',
  'Family Poll': 'bg-violet-100 text-violet-600',
  'Voice Memo': 'bg-emerald-100 text-emerald-600',
};

export default function CreatorStudioPage() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [toast, showToast] = useToast();

  const [localStats, setLocalStats] = useState(creatorStudio.stats);
  const [localCreations, setLocalCreations] = useState(creatorStudio.creations);

  const [activeCreator, setActiveCreator] = useState(null); // 'photo', 'voice', 'poll'

  // Photo State
  const [photoCaption, setPhotoCaption] = useState('');
  
  // Voice State
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, done
  const [recordingTime, setRecordingTime] = useState(0);

  // Poll State
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  useEffect(() => {
    let interval;
    if (recordingState === 'recording') {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  const handleSelectCreator = (typeId) => {
    setShowCreateMenu(false);
    setActiveCreator(typeId);
    
    // reset states
    setPhotoCaption('');
    setRecordingState('idle');
    setRecordingTime(0);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleCreateContent = (type) => {
    let newCreation;
    
    if (type === 'photo') {
      newCreation = {
        id: Date.now(),
        type: 'Photo Story',
        title: photoCaption || 'Untitled Story',
        date: 'Just now',
        likes: 0,
        comments: 0,
        icon: 'photo_camera',
        color: 'pink'
      };
    } else if (type === 'voice') {
      newCreation = {
        id: Date.now(),
        type: 'Voice Memo',
        title: `Memo - ${new Date().toLocaleDateString()}`,
        date: 'Just now',
        duration: `0:0${Math.min(recordingTime, 9)}`,
        icon: 'mic',
        color: 'emerald'
      };
    } else if (type === 'poll') {
      newCreation = {
        id: Date.now(),
        type: 'Family Poll',
        title: pollQuestion || 'New Poll',
        date: 'Just now',
        responses: 0,
        icon: 'poll',
        color: 'violet'
      };
    }

    setLocalCreations(prev => [newCreation, ...prev]);
    setLocalStats(prev => ({ ...prev, posts: prev.posts + 1 }));
    showToast(`${newCreation.type} published successfully!`);
    setActiveCreator(null);
  };

  const handleAddPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const updatePollOption = (idx, value) => {
    const newOptions = [...pollOptions];
    newOptions[idx] = value;
    setPollOptions(newOptions);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-dvh bg-[#f6f7f8] relative">
      <Toast message={toast} />
      <BackHeader title="Creator's Studio" backTo="/more" />

      <div className="pb-28">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[#4c8ce6] text-2xl">edit</span>
            <p className="text-lg font-black text-slate-900">{localStats.posts}</p>
            <p className="text-xs text-slate-500 font-medium">Posts</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-blue-500 text-2xl">visibility</span>
            <p className="text-lg font-black text-slate-900">{localStats.views}</p>
            <p className="text-xs text-slate-500 font-medium">Views</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-rose-500 text-2xl">favorite</span>
            <p className="text-lg font-black text-slate-900">{localStats.likes}</p>
            <p className="text-xs text-slate-500 font-medium">Likes</p>
          </div>
        </div>

        {/* Quick Launch Carousel */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Quick Create</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {CREATE_TYPES.map((type) => (
              <div
                key={type.id}
                onClick={() => handleSelectCreator(type.id)}
                className={`shrink-0 w-36 bg-gradient-to-br ${type.gradient} rounded-2xl p-4 flex flex-col gap-3 shadow-sm cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98]`}
              >
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-white text-xl">{type.icon}</span>
                </div>
                <div className="mt-auto pt-2">
                  <p className="text-white font-bold text-sm tracking-wide">{type.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Creations */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Library</h3>
          <div className="space-y-3">
            {localCreations.map((creation) => (
              <div
                key={creation.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
                    creation.color === 'pink' ? 'bg-pink-100 text-pink-500' :
                    creation.color === 'violet' ? 'bg-violet-100 text-violet-500' :
                    'bg-emerald-100 text-emerald-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{creation.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`inline-block mb-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${TYPE_BADGE_COLORS[creation.type] || 'bg-slate-100 text-slate-600'}`}>
                    {creation.type}
                  </span>
                  <p className="text-sm font-bold text-slate-800 truncate">{creation.title}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{creation.date}</p>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  {creation.likes != null && (
                    <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">favorite</span>
                      <span className="text-xs font-bold text-slate-600">{creation.likes}</span>
                    </div>
                  )}
                  {creation.responses != null && (
                    <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">how_to_vote</span>
                      <span className="text-xs font-bold text-slate-600">{creation.responses}</span>
                    </div>
                  )}
                  {creation.duration != null && (
                    <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[14px]">graphic_eq</span>
                      <span className="text-xs font-bold text-slate-600">{creation.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main FAB Menu Trigger */}
      <button
        onClick={() => setShowCreateMenu(true)}
        className="fixed bottom-20 right-5 bg-slate-900 rounded-full w-14 h-14 shadow-2xl flex items-center justify-center hover:bg-slate-800 transition-colors z-30"
      >
        <span className="material-symbols-outlined text-white text-3xl">add</span>
      </button>

      {/* Creation Type Chooser Modal */}
      {showCreateMenu && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowCreateMenu(false)}>
          <div className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-12 animate-in slide-in-from-bottom-8 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-900 mb-6 text-center tracking-tight">What do you want to create?</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {CREATE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelectCreator(type.id)}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-b ${type.gradient} active:scale-95 transition-transform shadow-lg`}
                >
                  <span className="material-symbols-outlined text-white text-4xl">{type.icon}</span>
                  <p className="text-white font-bold text-sm tracking-wide">{type.label}</p>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowCreateMenu(false)}
              className="w-full py-4 text-slate-500 font-bold uppercase tracking-widest text-sm hover:bg-slate-50 rounded-xl transition-colors mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Detailed Creator Forms Overlay */}
      {activeCreator && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800 capitalize tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  {CREATE_TYPES.find(t => t.id === activeCreator)?.icon}
                </span>
                New {activeCreator === 'photo' ? 'Photo Story' : activeCreator === 'voice' ? 'Voice Memo' : 'Poll'}
              </h3>
              <button onClick={() => setActiveCreator(null)} className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Photo Story UI */}
              {activeCreator === 'photo' && (
                <div className="space-y-5">
                  <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 group hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer relative overflow-hidden">
                    <span className="material-symbols-outlined text-5xl mb-2 group-hover:text-primary transition-colors">add_photo_alternate</span>
                    <p className="font-bold text-sm group-hover:text-primary transition-colors">Tap to select photo</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Caption</label>
                    <textarea 
                      value={photoCaption}
                      onChange={(e) => setPhotoCaption(e.target.value)}
                      placeholder="Write a caption for your family..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Voice Memo UI */}
              {activeCreator === 'voice' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className={`size-32 rounded-full border-4 flex items-center justify-center mb-6 transition-all duration-300 ${
                    recordingState === 'recording' ? 'border-rose-500 bg-rose-50 shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse' : 
                    recordingState === 'done' ? 'border-emerald-500 bg-emerald-50' : 
                    'border-slate-200 bg-slate-50'
                  }`}>
                    <span className={`material-symbols-outlined text-5xl ${
                      recordingState === 'recording' ? 'text-rose-500' : 
                      recordingState === 'done' ? 'text-emerald-500' : 
                      'text-slate-400'
                    }`}>
                      {recordingState === 'done' ? 'graphic_eq' : 'mic'}
                    </span>
                  </div>
                  
                  <p className="text-4xl font-black tabular-nums tracking-tighter text-slate-800 mb-8">
                    {formatTime(recordingTime)}
                  </p>
                  
                  {recordingState === 'idle' && (
                    <button onClick={() => setRecordingState('recording')} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined">fiber_manual_record</span>
                      Start Recording
                    </button>
                  )}
                  {recordingState === 'recording' && (
                    <button onClick={() => setRecordingState('done')} className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined">stop_circle</span>
                      Stop Recording
                    </button>
                  )}
                  {recordingState === 'done' && (
                    <div className="flex items-center gap-3">
                      <button onClick={() => { setRecordingState('idle'); setRecordingTime(0); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-full transition-colors">
                        Discard
                      </button>
                      <button className="bg-primary/10 text-primary font-bold py-3 px-6 rounded-full flex items-center gap-2">
                        <span className="material-symbols-outlined">play_arrow</span>
                        Play
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Family Poll UI */}
              {activeCreator === 'poll' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Question</label>
                    <input 
                      type="text"
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      placeholder="Ask the family a question..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Options</label>
                    <div className="space-y-3">
                      {pollOptions.map((opt, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">
                            {idx + 1}
                          </div>
                          <input 
                            type="text"
                            value={opt}
                            onChange={(e) => updatePollOption(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    {pollOptions.length < 5 && (
                      <button onClick={handleAddPollOption} className="mt-4 text-sm font-bold text-primary flex items-center gap-1 hover:text-primary-dark transition-colors bg-primary/5 px-4 py-2 rounded-lg">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={() => handleCreateContent(activeCreator)}
                disabled={(activeCreator === 'voice' && recordingState !== 'done')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Publish to Family
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
