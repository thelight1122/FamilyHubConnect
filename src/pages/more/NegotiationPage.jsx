import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import { appeal } from '../../data/mockData';

export default function NegotiationPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Leo',
      isChild: true,
      text: "Mom, I really need my phone for the group project tonight. Can we find a repair plan?",
      avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      id: 2,
      sender: 'Mom (Proposal)',
      isParent: true,
      isProposal: true,
      proposalTerms: [
        "Half-day screen adjustment (starts after project)",
        "Wash all dinner dishes tonight"
      ],
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      id: 3,
      sender: 'Leo',
      isChild: true,
      text: "That sounds fair. Can I do the dishes tomorrow instead? I have a lot of homework after the project.",
      avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const caseSummary = {
    caseId: appeal?.caseId ?? '12345',
    original: 'Screen time reflection',
    proposed: '1h adjustment + extra chores'
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    setMessages([
      ...messages, 
      {
        id: Date.now(),
        sender: 'Parent', // Let's mock the current user sending
        isParent: true,
        text: inputMessage,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
      }
    ]);
    setInputMessage('');
  };

  const executeResolution = () => {
    navigate(paths.moreAppealResolution);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-white dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* TopAppBar */}
      <div className="flex items-center p-4 pb-2 justify-between border-b border-primary/10">
        <div 
          onClick={() => navigate(-1)}
          className="text-primary flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-primary/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-lg font-bold leading-tight tracking-tight">Resolution Dialogue: Case #{caseSummary.caseId}</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accountability Protocol</p>
        </div>
        <div className="size-10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-2xl">gavel</span>
        </div>
      </div>

      {/* Progress/Status Area */}
      <div className="flex flex-col gap-2 p-4 bg-primary/5">
        <div className="flex gap-6 justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <p className="text-primary text-sm font-bold leading-normal">Resolution in Progress</p>
          </div>
          <p className="text-slate-500 text-xs font-bold leading-normal tracking-wide">MODERATION: 50%</p>
        </div>
        <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-1.5 overflow-hidden">
          <div className="h-full rounded-full bg-primary w-1/2"></div>
        </div>
      </div>

      {/* Reflection Summary Card */}
      <div className="p-4 bg-white dark:bg-background-dark shrink-0 z-10">
        <div className="flex flex-col items-stretch justify-start rounded-xl shadow-sm border border-primary/10 bg-white dark:bg-slate-800 overflow-hidden">
          <div className="flex w-full flex-col items-stretch justify-center gap-3 p-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="material-symbols-outlined text-primary text-xl">description</span>
              <p className="text-sm font-bold leading-tight">Reflection Summary</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Original</p>
                <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold">{caseSummary.original}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Proposed</p>
                <p className="text-slate-700 dark:text-slate-300 text-xs font-semibold">{caseSummary.proposed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <h4 className="text-slate-400 text-[11px] font-bold leading-normal tracking-widest uppercase text-center mb-6">Today</h4>
        
        {messages.map((msg) => {
          if (msg.isChild && !msg.isProposal) {
            return (
              <div key={msg.id} className="flex items-end gap-3 fade-in">
                <div className="bg-primary/20 aspect-square rounded-full w-8 shrink-0 flex items-center justify-center overflow-hidden border border-primary/30">
                  <img className="w-full h-full object-cover" alt="Child avatar" src={msg.avatar} />
                </div>
                <div className="flex flex-col gap-1 items-start max-w-[80%]">
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold ml-1 uppercase">{msg.sender}</p>
                  <div className="text-sm font-medium leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700/50">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          } else if (msg.isParent && msg.isProposal) {
            return (
              <div key={msg.id} className="flex items-end gap-3 flex-row-reverse fade-in">
                <div className="bg-primary aspect-square rounded-full w-8 shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                  <img className="w-full h-full object-cover" alt="Parent avatar" src={msg.avatar} />
                </div>
                <div className="flex flex-col gap-1 items-end max-w-[85%]">
                  <p className="text-primary text-[11px] font-bold mr-1 uppercase">{msg.sender}</p>
                  <div className="rounded-2xl rounded-br-none border-2 border-primary bg-primary/5 dark:bg-primary/10 p-4 shadow-md flex flex-col gap-3">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100/90">New Proposed Terms:</p>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 text-sm text-slate-600 dark:text-slate-300 border border-primary/20">
                      <ul className="space-y-1.5">
                        {msg.proposalTerms.map((term, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm font-medium">
                            <span className="material-symbols-outlined text-sm text-primary mt-0.5">check_circle</span>
                            {term}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                       {/* Real acceptance goes to ResolutionConfirmedPage */}
                      <button onClick={executeResolution} className="flex-1 bg-primary text-white text-xs font-bold py-2.5 rounded-lg shadow-sm shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all">
                        ACCEPT
                      </button>
                      <button className="flex-1 border bg-white dark:bg-slate-800 border-primary text-primary text-xs font-bold py-2.5 rounded-lg shadow-sm hover:bg-primary/5 transition-all">
                        COUNTER
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            // General Parent message
            return (
              <div key={msg.id} className="flex items-end gap-3 flex-row-reverse fade-in">
                <div className="bg-primary aspect-square rounded-full w-8 shrink-0 flex items-center justify-center overflow-hidden border border-primary/20 shadow-sm">
                  <img className="w-full h-full object-cover" alt="Parent avatar" src={msg.avatar} />
                </div>
                <div className="flex flex-col gap-1 items-end max-w-[80%]">
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mr-1 uppercase">{msg.sender}</p>
                  <div className="text-sm font-medium leading-relaxed rounded-2xl rounded-br-none px-4 py-3 bg-primary text-white shadow-sm shadow-primary/20">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-primary/10 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md">
        <div className="flex justify-center gap-4 mb-3">
          <button onClick={() => setInputMessage('I am setting up a proposal.')} className="flex flex-1 justify-center items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-primary uppercase transition-colors hover:bg-primary/5">
            <span className="material-symbols-outlined text-sm">handshake</span>
            Quick Proposal
          </button>
          <button className="flex flex-1 justify-center items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-500 uppercase transition-colors hover:text-slate-700 dark:hover:text-slate-300">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Set Deadline
          </button>
        </div>
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 rounded-full px-4 py-2 transition-all">
          <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-primary transition-colors">add_circle</span>
          <input 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 placeholder:text-slate-500 font-medium" 
            placeholder="Type a message or proposal..." 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            type="text"
          />
          <button 
            onClick={handleSendMessage}
            className={`rounded-full p-2 flex items-center justify-center transition-all ${inputMessage.trim() ? 'bg-primary text-white shadow-md shadow-primary/30 hover:brightness-110 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
            disabled={!inputMessage.trim()}
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
