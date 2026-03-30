import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pendingInvites } from '../../data/mockData';

export default function InviteFamilyPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('adult');
  const [inviteMethod, setInviteMethod] = useState('link'); // 'link', 'email', 'qr'
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [invites, setInvites] = useState(pendingInvites);

  const handleSendInvite = () => {
    if (email.trim()) {
      setShowToast(true);
      
      const newInvite = {
        id: Date.now(),
        email: email.trim(),
        role: selectedRole === 'adult' ? 'Adult' : 'Child',
        sent: 'Just now'
      };
      
      setInvites(prev => [newInvite, ...prev]);
      setEmail('');
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCancelInvite = (id) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-x-hidden font-display text-slate-900 dark:text-slate-100">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="material-symbols-outlined text-green-500">check_circle</span>
            <p className="text-xs text-green-700 dark:text-green-300 font-medium">Invitation sent successfully!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-slate-100 flex size-10 shrink-0 items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 ml-2">Invite Family</h2>
        <button className="text-primary flex size-10 shrink-0 items-center justify-center hover:bg-primary/10 rounded-full transition-colors">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Progress Section */}
        <div className="flex flex-col gap-3 p-4 px-6">
          <div className="flex gap-6 justify-between items-end">
            <p className="text-slate-900 dark:text-slate-100 text-sm font-semibold uppercase tracking-wider">Onboarding Progress</p>
            <p className="text-primary text-sm font-bold">3 of 3</p>
          </div>
          <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-2.5 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-6 pt-2 pb-4">
          <h1 className="text-2xl font-bold tracking-tight">Invite Family Members</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">Grow your digital home. Add members to share calendars, tasks, and photos securely.</p>
        </div>

        {/* Role Selection */}
        <div className="px-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Who are you inviting?</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setSelectedRole('adult')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'adult' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/50'
              }`}
            >
              <span className="material-symbols-outlined text-3xl mb-1">person_add</span>
              <span className="font-bold text-sm">Adult/Parent</span>
              <span className="text-[10px] opacity-80">Full permissions</span>
            </button>
            
            <button 
              onClick={() => setSelectedRole('child')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'child' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-primary/50'
              }`}
            >
              <span className="material-symbols-outlined text-3xl mb-1">child_care</span>
              <span className="font-bold text-sm">Child</span>
              <span className="text-[10px] opacity-80">Parental controls</span>
            </button>
          </div>
        </div>

        {/* Invitation Methods */}
        <section className="px-6 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Invitation Method</h3>
          <div className="space-y-3">
            
            {/* Share Link */}
            <div 
              onClick={() => setInviteMethod('link')}
              className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                inviteMethod === 'link' 
                  ? 'bg-primary/5 border-primary shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-full ${
                  inviteMethod === 'link' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'
                }`}>
                  <span className="material-symbols-outlined">link</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Share Invite Link</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">familyhub.app/join/xK92...</p>
                </div>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 2000);
                }}
                className={`text-xs font-bold py-2 px-4 rounded-lg transition-colors ${
                  inviteMethod === 'link' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Copy
              </button>
            </div>

            {/* Email Invite */}
            <div 
              onClick={() => setInviteMethod('email')}
              className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                inviteMethod === 'email' 
                  ? 'bg-primary/5 border-primary shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-full ${
                    inviteMethod === 'email' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'
                  }`}>
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Invite via Email</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Send direct invitation</p>
                  </div>
                </div>
                {inviteMethod !== 'email' && (
                  <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                )}
              </div>
              
              {/* Expandable Email Form */}
              {inviteMethod === 'email' && (
                <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleSendInvite}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div 
              onClick={() => setInviteMethod('qr')}
              className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                inviteMethod === 'qr' 
                  ? 'bg-primary/5 border-primary shadow-sm' 
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex size-10 items-center justify-center rounded-full ${
                    inviteMethod === 'qr' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'
                  }`}>
                    <span className="material-symbols-outlined">qr_code_2</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Scan QR Code</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Quick in-person setup</p>
                  </div>
                </div>
                {inviteMethod !== 'qr' && (
                  <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined">fullscreen</span>
                  </button>
                )}
              </div>
              
              {/* Expandable QR Display */}
              {inviteMethod === 'qr' && (
                <div className="mt-4 flex flex-col items-center justify-center py-6 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-slate-800 dark:text-slate-200" style={{ fontSize: '8rem' }}>
                    qr_code_2
                  </span>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Scan with camera to join</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Pending Invites */}
        <section className="px-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider">Pending Invites</h3>
            <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{invites.length} Active</span>
          </div>
          <div className="space-y-2">
            {invites.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4 italic">No pending invites</p>
            ) : (
              invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px]">{invite.email}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-orange-400"></span> {invite.sent} • {invite.role}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCancelInvite(invite.id)}
                    className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Bottom Action Footer */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-6 py-4 z-20">
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/onboarding/rules')}
            className="flex-1 py-4 px-6 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            Back
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-[2] py-4 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
          >
            Finish Setup
            <span className="material-symbols-outlined">done_all</span>
          </button>
        </div>
      </div>
    </div>
  );
}
