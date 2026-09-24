import { useState, useRef, useEffect } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

const ONLINE_AVATARS = [];
const INITIAL_MESSAGES = [];

export default function TeamChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [toast, showToast] = useToast();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'You',
        text: message.trim(),
        time: 'Now',
        isMe: true,
        avatarUrl: null,
      },
    ]);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-background-light">
      <Toast message={toast} />

      {/* Back Header */}
      <BackHeader title="Team Chat" backTo={paths.sports} />

      {/* Online Status Avatars */}
      <div className="flex items-center px-4 py-3 justify-start gap-1 bg-white border-b border-primary/5 overflow-x-auto">
        {ONLINE_AVATARS.map((avatar) => (
          <div key={avatar.id} className="relative flex-shrink-0">
            <div
              className={`bg-center bg-no-repeat aspect-square bg-cover border-2 ${avatar.border} bg-slate-200 rounded-full size-10`}
              style={{ backgroundImage: avatar.style.replace("background-image: ", "").replace(/^url\("/, '').replace(/"$/, '') }}
              role="img"
              aria-label={avatar.alt}
            />
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-background-light rounded-full" />
          </div>
        ))}
        <div className="flex-shrink-0 size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border-2 border-transparent">
          0
        </div>
      </div>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Announcement Card */}
        <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <span className="material-symbols-outlined text-6xl">campaign</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-xl">campaign</span>
            <p className="text-sm font-bold uppercase tracking-wider">Team Announcement</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900">No live announcements</p>
            <p className="text-sm text-slate-600">
              Team announcements will appear here after entry.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-primary hover:underline group">
            View Full Schedule
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest bg-slate-100 px-2 py-1 rounded">
              Today
            </span>
          </div>

          {messages.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-6">No messages yet — be the first!</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.isMe ? (
                /* Own message — right aligned */
                <div className="flex items-end gap-3 justify-end ml-auto max-w-[85%]">
                  <div className="flex flex-col gap-1 items-end">
                    <p className="text-slate-500 text-[11px] font-bold mr-1 uppercase">
                      {msg.sender}
                    </p>
                    <div className="rounded-2xl rounded-br-none px-4 py-2.5 bg-primary text-white shadow-md">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mr-1">{msg.time}</p>
                  </div>
                </div>
              ) : (
                /* Other message — left aligned */
                <div className="flex items-end gap-3 max-w-[85%]">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shrink-0 shadow-sm border border-primary/20"
                    style={{ backgroundImage: `url("${msg.avatarUrl}")` }}
                    role="img"
                    aria-label={msg.sender}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-primary text-[11px] font-bold ml-1 uppercase">
                      {msg.sender}
                    </p>
                    <div className="space-y-2">
                      <div className="rounded-2xl rounded-bl-none px-4 py-2.5 bg-white shadow-sm border border-slate-200">
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      {msg.attachment && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 max-w-[240px]">
                          <img
                            src={msg.attachment.imgUrl}
                            alt="Attachment"
                            className="w-full h-auto"
                          />
                          <div className="p-2 bg-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-medium truncate mr-2">
                              {msg.attachment.filename}
                            </span>
                            <span className="material-symbols-outlined text-primary text-sm">
                              download
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1">{msg.time}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <footer className="p-4 bg-background-light border-t border-primary/10">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => showToast('No live attachment storage configured yet.')}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:text-primary transition-colors"
          >
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
              <button
                onClick={() => showToast('No live attachment storage configured yet.')}
                className="p-1.5 text-slate-400 hover:text-primary"
              >
                <span className="material-symbols-outlined text-xl">image</span>
              </button>
              <button className="p-1.5 text-slate-400 hover:text-primary">
                <span className="material-symbols-outlined text-xl">mood</span>
              </button>
            </div>
          </div>
          <button
            onClick={sendMessage}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
        <div className="h-2" />
      </footer>
    </div>
  );
}
