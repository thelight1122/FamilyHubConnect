import { useState, useRef, useEffect } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

// TODO: connect to real-time chat API

const ONLINE_AVATARS = [
  {
    id: 0,
    alt: "Coach Dave",
    style: 'background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLLWcTmIbuwgDOyk4_y5L7k3VWam2UpwQbZ5r5XqlBdDXNI7LBEn9xergosfxdydxJ46FE3gpr0MKkWnDjEmNYLEaACki4qm2G1jWrazix_YDkp9wxARRWbmp9g70eOeTCbr9TPfwR6Gkv6KSCVgQ4AfvcSWbypPbEFb3I8_JXvU3U-r_ntjjBuwDTg1w1d6W4tvuHxu9xpBRsKvfDwoIs-yl2Om-E0vSYH8YYn2USpRcGnjbvsORy15SnBdwA_HVxb3MdKeiVfNI")',
    border: 'border-primary',
  },
  {
    id: 1,
    alt: "Sarah's Mom",
    style: 'background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAdBnai83BD3iCTD4_zN9ef2ciqYTW4qWYhRbqKYOGXFZqc6NXMZAfJbkeBHZVWcYpH6ujsxqqYwz0mDaxxlDX1vjrW-UbL269pE-3mSO12B2WMAGTGUAkRY7j-Jcd_JzqfG7U0xRL0BLyIi0VjYT5k-6mZfB5GPyrkQEfSbiHh0WIAzhj-4iNIDurMB0Dc4gBDqJXnZ5yPDsai0HRDE_jDSLWE4pNzpwfn3X8CaTg31NcmyNeul0jxAtXEyxwi6ZdryaeGlzIBfxE")',
    border: 'border-transparent',
  },
  {
    id: 2,
    alt: "Leo's Dad",
    style: 'background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9u66aInloUA2LydiGAjb2eSG-ZceRskmLGlqT_uhe_PhUbA7GuJJKNind8XSUO2_NMmSvZecekL77aG2rH9bkupJqTtkaWW-520RpUJ5Tyc32Qvksg85O2BNCq6UHBPonKOGRSQf2pFT_UUPHuJ97hpbX4xN9Vif51ZqiJYxDGl1o1bCgldh4e6R8uKh_x2P4V1XFTF4V5wuMO6bXp6LuzOTv4uwpLVRUfHbFJ-MLxcNtEgiHajPxc109T2XbEveRb-Zxvtt8LVw")',
    border: 'border-transparent',
  },
  {
    id: 3,
    alt: 'Team Manager',
    style: 'background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtcWNOje0yfMmwE9Jm-G9lEnj6e-JlMM9jukNkgQGcDxXJR-xJSVzJl-PHKHqAB8NwHz-tF_xcjoH6c7siZ2JXLdyoibBsPy6avtkDkMvEqJHPUw4idPSjnayEUbmvIXmsvCXqy7vnnPjCgUYOecvbb73BvDANyYlRsMJZ9CanTmEXOMi0EqD3XthdpLcggnh-MUHZKhd88WTyKj-jTPzUcj50l6dMoo7OoaWZJrXoOpRuwaa7dsvhLGFfuSzZQ0VLEf02eMScPwM")',
    border: 'border-transparent',
  },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'Coach Dave',
    text: "Hey team, don't forget orange slices for Saturday's game! Also, we'll be wearing the away kits (white jerseys).",
    time: '10:24 AM',
    isMe: false,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmGqhGcitYyRzh3edEpuGnkRDeJZIvNLIZTXs3Tccl9VAdq5yd5KMS-aS4MaD4ilDcx8qZn9ZSMtATEcLa8sFRp23Iai5x1bjLAulmd_rPWKExl-YdAquL6fi5toh9h4E22gTFZ2vthym1Apv7jlKljXXqzqMr1IRdnRXZ95uUQpacg3RRjAHopXEROZDr4blDdchqpSBgjp9-Psn4lt3L81IE_d_rcmbNIxn9WF6OCczyTUk00WtJAPpBQj09IQrls4NmF9ZY90Y',
  },
  {
    id: 2,
    sender: "Sarah's Dad (You)",
    text: "Got it Coach. I'll bring the cooler too. Just checked the weather, looks like a clear day!",
    time: '10:31 AM',
    isMe: true,
    avatarUrl: null,
  },
  {
    id: 3,
    sender: "Sarah's Mom",
    text: "Here's the field map for the away game for anyone who hasn't been there yet!",
    time: '11:05 AM',
    isMe: false,
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClj_9PC5WQ3OD7S5JNqx5pBKxHCt98UBY7j7ASLVHOt8L99wNsgIcsGixcw3wxM__le36cCSjEm1ABkWhvQmdB9NdGcyEURlQK-nJzPTFz1zqWfc4JRDc3GG51-phdk_fUq1wpvsrw8k6gBUMbPTixxpAWf89Faw2krHutOzwpLD3gbs5XlDwkh9yOkGoS_weK7vWsf11hV9O1agfOoui1Kee1nMzFkbjfhmYkQZXt6Q27znoYMqLlA2Y9upn1qW1CMb2MceGMMUw',
    attachment: {
      imgUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC3kWmwHn51vXiwLcpGiSzRCfJOIXX6I3lI6OlxGCqxWNlSB9m88Brl_XE8UykBGJEBFacVN1qic8zrcSH_8fPxd1u4ZfMZM01Vh_w1erB7KT3Y7CIae8svuG6_mgOv6kTYbDJ69slf3t0gK1HpIAr1Ew9rBVPVEfFeAaGxNLdD646O0nhyQJS2WfAHH_Ats3MaRs7z_-VcgwWx0LqBP_RIA-V551wWqJIOhulnOdqkI9qfD0IrI0qosY0WqbuzBTojbA8wREfZP0k',
      filename: 'park_layout_v2.png',
    },
  },
];

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
          +14
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
            <p className="font-bold text-slate-900">Practice Location Change</p>
            <p className="text-sm text-slate-600">
              Practice moved to Field 4 this Thursday due to maintenance. Please arrive 15 minutes
              early for warmups.
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
            onClick={() => showToast('File attachments coming soon!')}
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
                onClick={() => showToast('File attachments coming soon!')}
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
