import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useFamilyCore from '../../hooks/useFamilyCore';
import useSports from '../../hooks/useSports';
import useSignedUrls from '../../hooks/useSignedUrls';
import useAuth from '../../context/useAuth';
import { FAMILY_NOT_READY } from '../../hooks/liveResult';

export default function TeamChatPage() {
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [toast, showToast] = useToast();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const { family, members } = useFamilyCore();
  const sports = useSports(family?.id);

  const team = sports.teams.find((t) => t.id === searchParams.get('team')) ?? sports.teams[0] ?? null;
  const liveMessages = sports.messages.filter((m) => m.team_id === team?.id);
  const attachmentUrls = useSignedUrls(liveMessages.map((m) => m.attachment_path));
  const nameOf = (userId) => members.find((m) => m.user_id === userId)?.display_name ?? 'Family member';
  const live = sports.live && Boolean(team);
  // Prototype mode (no live project) keeps messages on this screen only.
  const prototype = !useAuth().supabaseAuthEnabled;
  const nextEvent = sports.events.find((e) => e.team_id === team?.id);

  const messages = !prototype
    ? liveMessages.map((m) => ({
        id: m.id,
        sender: m.author_id === sports.userId ? 'You' : nameOf(m.author_id),
        text: m.body,
        time: new Date(m.created_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
        isMe: m.author_id === sports.userId,
        imageUrl: m.attachment_path ? attachmentUrls[m.attachment_path] : null,
      }))
    : localMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages.length]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!prototype && !live) {
      showToast(sports.live ? 'Add a team in the Locker Room first.' : FAMILY_NOT_READY);
      return;
    }
    if (live) {
      const outcome = await sports.sendMessage(team.id, message);
      if (!outcome.ok) {
        showToast(outcome.message);
        return;
      }
    } else {
      setLocalMessages((prev) => [...prev, { id: Date.now(), sender: 'You', text: message.trim(), time: 'Now', isMe: true }]);
    }
    setMessage('');
  };

  const attach = () => {
    if (prototype) {
      showToast('No live attachment storage configured yet.');
      return;
    }
    if (!live) {
      showToast(sports.live ? 'Add a team in the Locker Room first.' : FAMILY_NOT_READY);
      return;
    }
    fileInputRef.current?.click();
  };

  const sendAttachment = async (file) => {
    if (!file) return;
    const outcome = await sports.sendMessage(team.id, message, file);
    showToast(outcome.ok ? 'Photo sent' : outcome.message);
    if (outcome.ok) setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (prototype || live)) sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-background-light">
      <Toast message={toast} />

      <BackHeader title="Team Chat" backTo={paths.sports} />

      {/* Team members */}
      <div className="flex items-center px-4 py-3 justify-start gap-2 bg-white border-b border-primary/5 overflow-x-auto">
        <span className="text-sm font-bold text-slate-700">{team?.name ?? 'No team yet'}</span>
        <span className="text-xs text-slate-400">{live ? `${members.length} family members` : ''}</span>
      </div>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Announcement Card: the team's next event */}
        <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-xl">campaign</span>
            <p className="text-sm font-bold uppercase tracking-wider">Up next</p>
          </div>
          {nextEvent ? (
            <div className="space-y-1">
              <p className="font-bold text-slate-900">{nextEvent.title}</p>
              <p className="text-sm text-slate-600">
                {new Date(nextEvent.starts_at).toLocaleString(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
                {nextEvent.location ? ` · ${nextEvent.location}` : ''}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="font-bold text-slate-900">No live announcements</p>
              <p className="text-sm text-slate-600">Team announcements will appear here after entry.</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.length === 0 && <p className="text-center text-sm text-slate-400 py-6">No messages yet — be the first!</p>}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1 max-w-[85%] ${msg.isMe ? 'ml-auto items-end' : 'items-start'}`}>
              <p className={`text-[11px] font-bold uppercase ${msg.isMe ? 'text-slate-500 mr-1' : 'text-primary ml-1'}`}>{msg.sender}</p>
              {msg.text && (
                <div className={`rounded-2xl px-4 py-2.5 ${msg.isMe ? 'rounded-br-none bg-primary text-white shadow-md' : 'rounded-bl-none bg-white shadow-sm border border-slate-200'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              )}
              {msg.imageUrl && <img src={msg.imageUrl} alt={`Photo from ${msg.sender}`} className="max-w-[240px] rounded-xl border border-slate-200" />}
              <p className="text-[10px] text-slate-400 mx-1">{msg.time}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <footer className="p-4 bg-background-light border-t border-primary/10">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          aria-label="Attach a photo"
          onChange={(e) => {
            sendAttachment(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button onClick={attach} disabled={!prototype && !live} aria-label="Attach a photo" className="disabled:opacity-50 flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">add</span>
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message to the team..."
              className="w-full rounded-full border-slate-200 bg-white py-2.5 px-4 pr-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button onClick={attach} className="p-1.5 text-slate-400 hover:text-primary">
                <span className="material-symbols-outlined text-xl">image</span>
              </button>
            </div>
          </div>
          <button
            onClick={sendMessage}
            disabled={!prototype && !live}
            aria-label="Send"
            className="disabled:opacity-50 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <div className="h-2" />
      </footer>
    </div>
  );
}
