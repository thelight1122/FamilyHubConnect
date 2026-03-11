import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pendingInvites } from '../../data/mockData';

export default function InviteFamilyPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('adult');
  const [inviteMethod, setInviteMethod] = useState('link');
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [invites, setInvites] = useState(pendingInvites);

  const handleSendInvite = () => {
    if (email.trim()) {
      setShowToast(true);
      setEmail('');
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCancelInvite = (id) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-dvh relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-green-500 text-white text-sm font-semibold px-4 py-3 flex items-center gap-2">
          <span>✓ Invite sent successfully!</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center bg-white border-b border-slate-100 px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center text-lg font-bold text-slate-900">
          Invite Family Member
        </h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
      </header>

      <div className="px-4 pt-5 pb-24">
        {/* Who are you inviting? */}
        <section className="mb-6">
          <h3 className="text-base font-bold text-slate-800 mb-3">Who are you inviting?</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Adult Card */}
            <button
              onClick={() => setSelectedRole('adult')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                selectedRole === 'adult'
                  ? 'border-[#4c8ce6] bg-[#4c8ce6]/5'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <span
                className={`material-symbols-outlined text-4xl ${
                  selectedRole === 'adult' ? 'text-[#4c8ce6]' : 'text-slate-400'
                }`}
              >
                person
              </span>
              <p
                className={`text-sm font-semibold ${
                  selectedRole === 'adult' ? 'text-[#4c8ce6]' : 'text-slate-600'
                }`}
              >
                Adult / Parent
              </p>
            </button>

            {/* Child Card */}
            <button
              onClick={() => setSelectedRole('child')}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                selectedRole === 'child'
                  ? 'border-[#4c8ce6] bg-[#4c8ce6]/5'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <span
                className={`material-symbols-outlined text-4xl ${
                  selectedRole === 'child' ? 'text-[#4c8ce6]' : 'text-slate-400'
                }`}
              >
                child_care
              </span>
              <p
                className={`text-sm font-semibold ${
                  selectedRole === 'child' ? 'text-[#4c8ce6]' : 'text-slate-600'
                }`}
              >
                Child
              </p>
            </button>
          </div>
        </section>

        {/* Invite Method Tabs */}
        <section className="mb-6">
          <h3 className="text-base font-bold text-slate-800 mb-3">Invite Method</h3>
          <div className="flex gap-2 mb-4">
            {['link', 'email', 'qr'].map((method) => (
              <button
                key={method}
                onClick={() => setInviteMethod(method)}
                className={`flex-1 py-2 px-3 rounded-full text-sm font-semibold transition-all ${
                  inviteMethod === method
                    ? 'bg-[#4c8ce6] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {method === 'link' ? 'Share Link' : method === 'email' ? 'Email' : 'QR Code'}
              </button>
            ))}
          </div>

          {/* Share Link */}
          {inviteMethod === 'link' && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <p className="flex-1 text-sm text-slate-600 font-mono truncate">
                fhc.app/join/abc123
              </p>
              <button className="flex items-center justify-center text-[#4c8ce6] hover:text-[#3b7bd4]">
                <span className="material-symbols-outlined text-xl">copy_all</span>
              </button>
            </div>
          )}

          {/* Email */}
          {inviteMethod === 'email' && (
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4c8ce6] focus:border-transparent"
              />
              <button
                onClick={handleSendInvite}
                className="w-full bg-[#4c8ce6] text-white font-bold py-3 rounded-xl hover:bg-[#3b7bd4] transition-colors"
              >
                Send Invite
              </button>
            </div>
          )}

          {/* QR Code */}
          {inviteMethod === 'qr' && (
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-10">
              <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '6rem' }}>
                qr_code_2
              </span>
              <p className="text-sm text-slate-400 mt-2">Scan to join the family</p>
            </div>
          )}
        </section>

        {/* Pending Invites */}
        <section className="mb-6">
          <h3 className="text-base font-bold text-slate-800 mb-3">Pending Invites</h3>
          {invites.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No pending invites</p>
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{invite.email}</p>
                    <p className="text-xs text-slate-400">Sent {invite.sent}</p>
                  </div>
                  <span className="text-xs bg-blue-50 text-[#4c8ce6] px-2 py-0.5 rounded-full font-medium shrink-0">
                    {invite.role}
                  </span>
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    className="text-xs text-red-400 font-semibold hover:text-red-600 shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Done Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 px-4 py-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-[#4c8ce6] text-white font-bold py-4 rounded-2xl hover:bg-[#3b7bd4] transition-colors text-base"
        >
          Done
        </button>
      </div>
    </div>
  );
}
