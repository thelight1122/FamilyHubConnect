import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../config/paths';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';

// TODO: fetch from /api/invite/link
const INVITE_LINK = '';

// TODO: fetch from /api/invites/pending
const INITIAL_PENDING_INVITES = [];

const TABS = [
  { id: 'link',  label: 'Link',    icon: 'link'     },
  { id: 'email', label: 'Email',   icon: 'mail'     },
  { id: 'qr',    label: 'QR Code', icon: 'qr_code_2' },
];

export default function InviteFamilyPage() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [activeTab, setActiveTab] = useState('link');
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('adult');
  const [pendingInvites, setPendingInvites] = useState(INITIAL_PENDING_INVITES);

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://${INVITE_LINK}`).catch(() => {});
    showToast('Link copied to clipboard!');
  }

  function handleSendInvite() {
    if (!emailInput.trim()) {
      showToast('Please enter an email address.');
      return;
    }
    // TODO: POST email invite to /api/invite/email
    showToast('Invite sent!');
    setEmailInput('');
  }

  function handleCancelInvite(id) {
    setPendingInvites(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="relative flex min-h-screen w-full max-w-md mx-auto flex-col bg-white shadow-2xl overflow-x-hidden">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <header className="flex items-center bg-white p-4 sticky top-0 z-10 border-b border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-900 flex size-10 shrink-0 items-center justify-center hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight flex-1 ml-2">
          Invite Family
        </h2>
        <button className="text-primary flex size-10 shrink-0 items-center justify-center hover:bg-primary/10 rounded-full transition-colors">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-36">
        {/* Hero Section */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-slate-900 text-2xl font-bold tracking-tight">
            Invite Family Members
          </h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Grow your digital home. Add members to share calendars, tasks, and photos securely.
          </p>
        </div>

        {/* Role Selection */}
        <div className="px-4 mb-6">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider mb-3">
            Who are you inviting?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('adult')}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                selectedRole === 'adult'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-slate-100 bg-white text-slate-600 hover:border-primary/50'
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
                  : 'border-slate-100 bg-white text-slate-600 hover:border-primary/50'
              }`}
            >
              <span className="material-symbols-outlined text-3xl mb-1">child_care</span>
              <span className="font-bold text-sm">Child</span>
              <span className="text-[10px] opacity-80">Parental controls</span>
            </button>
          </div>
        </div>

        {/* Invitation Method */}
        <section className="px-4 mb-8">
          <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider mb-3">
            Invitation Method
          </h3>

          {/* Tab Buttons */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-4">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Link */}
          {activeTab === 'link' && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">link</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">Share Invite Link</p>
                  <p className="text-xs text-slate-500 italic truncate">{INVITE_LINK || 'Generating link…'}</p>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="ml-3 shrink-0 bg-primary text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Copy
              </button>
            </div>
          )}

          {/* Tab: Email */}
          {activeTab === 'email' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <p className="text-sm font-bold text-slate-900">Invite via Email</p>
              </div>
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendInvite()}
                placeholder="Enter email address…"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
              <button
                onClick={handleSendInvite}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors"
              >
                Send Invite
              </button>
            </div>
          )}

          {/* Tab: QR */}
          {activeTab === 'qr' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <span className="material-symbols-outlined">qr_code_2</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Scan QR Code</p>
                  <p className="text-xs text-slate-500">Quick in-person setup</p>
                </div>
              </div>
              {/* QR Code Placeholder */}
              <div className="flex flex-col items-center justify-center mx-auto w-48 h-48 rounded-xl border-2 border-dashed border-slate-300 bg-white gap-2">
                <span className="material-symbols-outlined text-slate-300" style={{ fontSize: '5rem' }}>
                  qr_code_2
                </span>
                <span className="text-xs text-slate-400 font-medium">QR Code</span>
              </div>
              <p className="text-xs text-slate-500 text-center mt-3">
                Have a family member scan this code to join instantly.
              </p>
            </div>
          )}
        </section>

        {/* Pending Invites */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider">
              Pending Invites
            </h3>
            {pendingInvites.length > 0 && (
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendingInvites.length} Active
              </span>
            )}
          </div>

          {pendingInvites.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No pending invites.</p>
          ) : (
            <div className="space-y-2">
              {pendingInvites.map(invite => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{invite.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-orange-400 inline-block" />
                        Sent {invite.sentAgo} &bull; {invite.role}
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
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-4 py-4">
        <button
          onClick={() => navigate(paths.dashboard)}
          className="w-full py-4 rounded-xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Done — Go to Dashboard
        </button>
        <button
          onClick={() => navigate(paths.dashboard)}
          className="w-full mt-2 py-2 text-sm text-slate-400 font-medium hover:text-slate-600 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
