import { useState, useEffect, useMemo, useRef } from 'react';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useFamilyCore from '../../hooks/useFamilyCore';
import useCreatorStudio from '../../hooks/useCreatorStudio';
import useSignedUrls from '../../hooks/useSignedUrls';

const CREATE_TYPES = [
  { id: 'photo', label: 'Photo Story', icon: 'photo_camera', gradient: 'from-pink-400 to-rose-500' },
  { id: 'voice', label: 'Voice Memo', icon: 'mic', gradient: 'from-emerald-400 to-emerald-600' },
  { id: 'poll', label: 'Family Poll', icon: 'poll', gradient: 'from-violet-400 to-violet-600' },
];

const KIND_META = {
  photo: { type: 'Photo Story', icon: 'photo_camera', color: 'pink' },
  voice: { type: 'Voice Memo', icon: 'mic', color: 'emerald' },
  poll: { type: 'Family Poll', icon: 'poll', color: 'violet' },
};

const TYPE_BADGE_COLORS = {
  'Photo Story': 'bg-pink-100 text-pink-600',
  'Family Poll': 'bg-violet-100 text-violet-600',
  'Voice Memo': 'bg-emerald-100 text-emerald-600',
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export default function CreatorStudioPage() {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [toast, showToast] = useToast();
  const { family, members } = useFamilyCore();
  const studio = useCreatorStudio(family?.id);
  const mediaUrls = useSignedUrls(studio.posts.map((p) => p.media_path));

  // Prototype mode keeps creations on this screen only.
  const [localCreations, setLocalCreations] = useState([]);
  const [activeCreator, setActiveCreator] = useState(null); // 'photo', 'voice', 'poll'
  const [publishing, setPublishing] = useState(false);

  const [photoCaption, setPhotoCaption] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const photoPreview = useMemo(() => (photoFile ? URL.createObjectURL(photoFile) : null), [photoFile]);
  useEffect(() => () => photoPreview && URL.revokeObjectURL(photoPreview), [photoPreview]);

  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, done
  const [recordingTime, setRecordingTime] = useState(0);
  const [recording, setRecording] = useState(null); // { blob, url }
  const recorderRef = useRef(null);

  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  useEffect(() => {
    if (recordingState !== 'recording') return undefined;
    const interval = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [recordingState]);

  const resetRecording = () => {
    recorderRef.current?.stream?.getTracks().forEach((track) => track.stop());
    recorderRef.current = null;
    if (recording?.url) URL.revokeObjectURL(recording.url);
    setRecording(null);
    setRecordingState('idle');
    setRecordingTime(0);
  };

  const handleSelectCreator = (typeId) => {
    setShowCreateMenu(false);
    setActiveCreator(typeId);
    setPhotoCaption('');
    setPhotoFile(null);
    resetRecording();
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const startRecording = async () => {
    if (!studio.live) {
      setRecordingState('recording');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      showToast('This browser cannot record audio.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        setRecording({ blob, url: URL.createObjectURL(blob) });
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecordingTime(0);
      setRecordingState('recording');
    } catch {
      showToast('Microphone access was not allowed.');
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecordingState('done');
  };

  const publishLocally = (type) => {
    const meta = KIND_META[type];
    const title =
      type === 'photo' ? photoCaption || 'Untitled Story' : type === 'poll' ? pollQuestion || 'New Poll' : `Memo - ${new Date().toLocaleDateString()}`;
    setLocalCreations((prev) => [{ id: Date.now(), ...meta, title, date: 'Just now' }, ...prev]);
    showToast(`${meta.type} published successfully!`);
    setActiveCreator(null);
  };

  const handleCreateContent = async (type) => {
    if (!studio.live) {
      publishLocally(type);
      return;
    }

    setPublishing(true);
    let outcome;
    if (type === 'photo') {
      outcome = photoFile ? await studio.publishMedia('photo', photoFile, photoCaption, null) : { ok: false, message: 'Choose a photo first.' };
    } else if (type === 'voice') {
      outcome = recording ? await studio.publishMedia('voice', recording.blob, '', recordingTime) : { ok: false, message: 'Record something first.' };
    } else {
      outcome = await studio.publishPoll(pollQuestion, pollOptions);
    }
    setPublishing(false);

    if (!outcome.ok) {
      showToast(outcome.message);
      return;
    }
    showToast(`${KIND_META[type].type} published successfully!`);
    resetRecording();
    setActiveCreator(null);
  };

  const updatePollOption = (idx, value) => {
    setPollOptions((options) => options.map((option, i) => (i === idx ? value : option)));
  };

  const nameOf = (userId) => (userId === studio.userId ? 'You' : members.find((m) => m.user_id === userId)?.display_name ?? 'Family member');

  const creations = studio.live
    ? studio.posts.map((post) => {
        const options = studio.options.filter((o) => o.post_id === post.id);
        const votes = studio.votes.filter((v) => v.post_id === post.id);
        const likes = studio.likes.filter((l) => l.post_id === post.id);
        return {
          ...KIND_META[post.kind],
          id: post.id,
          kind: post.kind,
          title: post.caption || (post.kind === 'voice' ? 'Voice memo' : 'Photo story'),
          date: `${nameOf(post.author_id)} · ${new Date(post.created_at).toLocaleDateString()}`,
          mediaUrl: post.media_path ? mediaUrls[post.media_path] : null,
          duration: post.duration_seconds != null ? formatTime(post.duration_seconds) : null,
          options: options.map((o) => ({ ...o, count: votes.filter((v) => v.option_id === o.id).length })),
          myVote: votes.find((v) => v.voter_id === studio.userId)?.option_id ?? null,
          responses: post.kind === 'poll' ? votes.length : null,
          likes: post.kind === 'poll' ? null : likes.length,
          liked: likes.some((l) => l.user_id === studio.userId),
        };
      })
    : localCreations;

  const stats = {
    posts: creations.length,
    votes: studio.votes.length,
    likes: studio.likes.length,
  };

  const act = async (promise, success) => {
    const outcome = await promise;
    if (!outcome.ok || success) showToast(outcome.ok ? success : outcome.message);
  };

  return (
    <div className="min-h-dvh bg-[#f6f7f8] relative">
      <Toast message={toast} />
      <BackHeader title="Creator's Studio" backTo="/more" />

      <div className="pb-28">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 px-4 mt-4">
          {[
            { label: 'Posts', value: stats.posts, icon: 'edit', color: 'text-[#4c8ce6]' },
            { label: 'Votes', value: stats.votes, icon: 'how_to_vote', color: 'text-violet-500' },
            { label: 'Likes', value: stats.likes, icon: 'favorite', color: 'text-rose-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 flex flex-col items-center gap-1">
              <span className={`material-symbols-outlined ${stat.color} text-2xl`}>{stat.icon}</span>
              <p className="text-lg font-black text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {studio.error && <p className="mx-4 mt-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{studio.error}</p>}

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

        {/* Library */}
        <div className="px-4 mt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Library</h3>
          <div className="space-y-3">
            {creations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm">
                <span className="material-symbols-outlined text-3xl text-slate-300">auto_stories</span>
                <p className="mt-2 text-sm font-bold text-slate-600">No live creations yet</p>
                <p className="mt-1 text-xs font-medium text-slate-400">Photo stories, polls, and voice memos will appear here after entry.</p>
              </div>
            )}
            {creations.map((creation) => (
              <article key={creation.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
                      creation.color === 'pink' ? 'bg-pink-100 text-pink-500' : creation.color === 'violet' ? 'bg-violet-100 text-violet-500' : 'bg-emerald-100 text-emerald-500'
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
                      <button
                        onClick={() => studio.live && act(studio.toggleLike(creation.id, creation.liked))}
                        aria-label={creation.liked ? 'Unlike' : 'Like'}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${creation.liked ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">favorite</span>
                        <span className="text-xs font-bold text-slate-600">{creation.likes}</span>
                      </button>
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

                {creation.kind === 'photo' && creation.mediaUrl && (
                  <img src={creation.mediaUrl} alt={creation.title} className="w-full rounded-xl object-cover" />
                )}
                {creation.kind === 'voice' && creation.mediaUrl && <audio controls src={creation.mediaUrl} className="w-full" />}
                {creation.kind === 'poll' && creation.options?.length > 0 && (
                  <div className="space-y-2">
                    {creation.options.map((option) => {
                      const share = creation.responses ? Math.round((option.count / creation.responses) * 100) : 0;
                      const chosen = creation.myVote === option.id;
                      return (
                        <button
                          key={option.id}
                          disabled={Boolean(creation.myVote)}
                          onClick={() => act(studio.vote(creation.id, option.id), 'Vote counted')}
                          className={`relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-sm font-semibold ${chosen ? 'border-violet-400' : 'border-slate-200'}`}
                        >
                          {creation.myVote && <span className="absolute inset-y-0 left-0 bg-violet-100" style={{ width: `${share}%` }} />}
                          <span className="relative flex justify-between">
                            <span>{option.label}</span>
                            {creation.myVote && <span>{option.count}</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Main FAB Menu Trigger */}
      <button
        onClick={() => setShowCreateMenu(true)}
        aria-label="Create"
        className="fixed bottom-28 right-5 bg-slate-900 rounded-full w-14 h-14 shadow-2xl flex items-center justify-center hover:bg-slate-800 transition-colors z-30"
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
                <span className="material-symbols-outlined text-primary">{CREATE_TYPES.find((t) => t.id === activeCreator)?.icon}</span>
                New {activeCreator === 'photo' ? 'Photo Story' : activeCreator === 'voice' ? 'Voice Memo' : 'Poll'}
              </h3>
              <button
                onClick={() => {
                  resetRecording();
                  setActiveCreator(null);
                }}
                aria-label="Close"
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {activeCreator === 'photo' && (
                <div className="space-y-5">
                  <label className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer relative overflow-hidden">
                    {photoFile ? (
                      <img src={photoPreview} alt="Selected" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-5xl mb-2">add_photo_alternate</span>
                        <p className="font-bold text-sm">Tap to select photo</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      aria-label="Photo"
                      className="sr-only"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
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

              {activeCreator === 'voice' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div
                    className={`size-32 rounded-full border-4 flex items-center justify-center mb-6 transition-all duration-300 ${
                      recordingState === 'recording' ? 'border-rose-500 bg-rose-50 animate-pulse' : recordingState === 'done' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-5xl ${recordingState === 'recording' ? 'text-rose-500' : recordingState === 'done' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {recordingState === 'done' ? 'graphic_eq' : 'mic'}
                    </span>
                  </div>

                  <p className="text-4xl font-black tabular-nums tracking-tighter text-slate-800 mb-8">{formatTime(recordingTime)}</p>

                  {recordingState === 'idle' && (
                    <button onClick={startRecording} className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined">fiber_manual_record</span>
                      Start Recording
                    </button>
                  )}
                  {recordingState === 'recording' && (
                    <button onClick={stopRecording} className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined">stop_circle</span>
                      Stop Recording
                    </button>
                  )}
                  {recordingState === 'done' && (
                    <div className="flex w-full flex-col items-center gap-3">
                      {recording?.url && <audio controls src={recording.url} className="w-full" />}
                      <button onClick={resetRecording} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-full transition-colors">
                        Discard
                      </button>
                    </div>
                  )}
                </div>
              )}

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
                          <div className="w-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400">{idx + 1}</div>
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
                      <button
                        onClick={() => setPollOptions((options) => [...options, ''])}
                        className="mt-4 text-sm font-bold text-primary flex items-center gap-1 hover:text-primary-dark transition-colors bg-primary/5 px-4 py-2 rounded-lg"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => handleCreateContent(activeCreator)}
                disabled={publishing || (activeCreator === 'voice' && recordingState !== 'done')}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                {publishing ? 'Publishing…' : 'Publish to Family'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
