import { useEffect, useRef, useState } from 'react';
import BackHeader from '../../components/BackHeader';
import { activeSportsTeam, onlineMembers } from '../../data/selectors';
import { sports } from '../../data/mockData';

export default function TeamChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sports.chatMessages);
  const [isTyping, setIsTyping] = useState(true);
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), sender: 'Leo', text: message, time: 'Now', isMe: true },
    ]);
    setMessage('');
    setIsTyping(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#f6f7f8]">
      <BackHeader title={`${activeSportsTeam.name} - ${activeSportsTeam.team}`} backTo="/sports" />

      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <div className="flex items-center gap-1">
          {onlineMembers.map((member) => (
            <div key={member.name} className="relative">
              <div className={`w-8 h-8 rounded-full ${member.color} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{member.name}</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">{onlineMembers.length} members online</p>
      </div>

      <div className="mx-4 mt-3 mb-2 bg-[#4c8ce6]/5 border border-[#4c8ce6]/20 rounded-xl px-4 py-3 flex items-start gap-3">
        <span className="material-symbols-outlined text-[#4c8ce6] text-xl mt-0.5">campaign</span>
        <p className="text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-[#4c8ce6]">Announcement: </span>
          Next game vs Blue Eagles FC - Sat Oct 14, 10 AM. Riverside Park!
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!msg.isMe && (
              <div className="w-8 h-8 rounded-full bg-[#4c8ce6]/10 flex items-center justify-center flex-shrink-0 mb-4">
                <span className="material-symbols-outlined text-[#4c8ce6] text-base">person</span>
              </div>
            )}
            <div className={`max-w-[70%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              {!msg.isMe && <p className="text-xs font-semibold text-slate-500 mb-1 ml-1">{msg.sender}</p>}
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.isMe ? 'bg-[#4c8ce6] text-white rounded-br-sm' : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'}`}>
                {msg.text}
              </div>
              <p className="text-xs text-slate-400 mt-1 mx-1">{msg.time}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-[#4c8ce6]/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#4c8ce6] text-base">person</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-2 sticky bottom-0">
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f6f7f8] text-slate-500 flex-shrink-0">
          <span className="material-symbols-outlined text-xl">add</span>
        </button>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
          placeholder="Message the team..."
          className="flex-1 bg-[#f6f7f8] rounded-full px-4 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
        <button onClick={sendMessage} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#4c8ce6] text-white flex-shrink-0">
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </div>
    </div>
  );
}
