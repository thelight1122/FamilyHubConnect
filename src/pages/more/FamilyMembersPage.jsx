import { useState } from 'react';
import { paths } from '../../config/paths';
import BackHeader from '../../components/BackHeader';
import Toast from '../../components/Toast';
import useToast from '../../hooks/useToast';
import useAuth from '../../context/useAuth';
import useFamilyCore from '../../hooks/useFamilyCore';
import useInvites, { inviteLink, inviteState } from '../../hooks/useInvites';

const inputClass = 'w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm';
const STATE_CLASS = {
  pending: 'bg-amber-50 text-amber-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  revoked: 'bg-slate-100 text-slate-500',
  expired: 'bg-slate-100 text-slate-500',
};

// Everyone sees who is in the family; adults also invite and remove people.
export default function FamilyMembersPage() {
  const [toast, showToast] = useToast();
  const { currentUser } = useAuth();
  const { family, membership, members, canUseLiveData, reload } = useFamilyCore();
  const isAdult = membership?.role === 'adult';
  const invites = useInvites(isAdult ? family?.id : undefined);
  const [form, setForm] = useState({ displayName: '', role: 'child', email: '' });
  const [latestCode, setLatestCode] = useState(null);

  const share = async (code, name) => {
    const url = inviteLink(code);
    try {
      if (navigator.share) {
        await navigator.share({ title: `Join ${family?.name ?? 'our family'}`, text: `${name}, here's your invite to Family Hub.`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showToast('Invite link copied');
    } catch {
      // Sharing was cancelled or the clipboard is unavailable; the link is shown on screen.
    }
  };

  const create = async (event) => {
    event.preventDefault();
    const outcome = await invites.createInvite(form);
    if (!outcome.ok) {
      showToast(outcome.message);
      return;
    }
    setLatestCode({ code: outcome.code, name: form.displayName });
    setForm({ displayName: '', role: 'child', email: '' });
    showToast('Invite created');
  };

  const remove = async (member) => {
    if (!window.confirm(`Remove ${member.display_name} from the family? They can rejoin with a new invite.`)) return;
    const outcome = await invites.removeMember(member.user_id);
    showToast(outcome.ok ? `${member.display_name} removed` : outcome.message);
    if (outcome.ok) reload();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto bg-white shadow-xl overflow-x-hidden">
      <Toast message={toast} />
      <BackHeader title="Family" backTo={paths.more} />

      <main className="flex-1 space-y-8 p-4 pb-28">
        {!canUseLiveData || !family ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
            Sign in to a live family to see members and invite people.
          </p>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-bold">{family.name}</h2>
              <ul className="mt-3 space-y-2">
                {members.map((member) => (
                  <li key={member.user_id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {member.display_name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">
                        {member.display_name}
                        {member.user_id === currentUser?.id && <span className="ml-1 text-xs font-medium text-slate-400">(you)</span>}
                      </p>
                      <p className="text-xs capitalize text-slate-500">{member.role}</p>
                    </div>
                    {isAdult && member.user_id !== currentUser?.id && (
                      <button onClick={() => remove(member)} className="rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50">
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {isAdult && (
              <section className="space-y-3">
                <h2 className="text-lg font-bold">Invite someone</h2>
                <form onSubmit={create} className="space-y-2 rounded-xl border border-slate-100 p-3" aria-label="Invite someone">
                  <input value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} placeholder="Their name" required className={inputClass} />
                  <div className="flex gap-2" role="radiogroup" aria-label="Role">
                    {['child', 'adult'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        role="radio"
                        aria-checked={form.role === role}
                        onClick={() => setForm((f) => ({ ...f, role }))}
                        className={`flex-1 rounded-lg border py-2 text-sm font-bold capitalize ${form.role === role ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Their email (optional: only this email can use it)"
                    className={inputClass}
                  />
                  <button type="submit" className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white">Create invite</button>
                </form>

                {latestCode && (
                  <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4" role="status">
                    <p className="text-sm font-semibold">Invite for {latestCode.name}. It works once and expires in 7 days.</p>
                    <p className="text-center font-mono text-2xl font-black tracking-[0.3em]" data-testid="invite-code">{latestCode.code}</p>
                    <p className="break-all text-center text-xs text-slate-500">{inviteLink(latestCode.code)}</p>
                    <button onClick={() => share(latestCode.code, latestCode.name)} className="w-full rounded-xl bg-primary py-2 text-sm font-bold text-white">
                      Share invite link
                    </button>
                  </div>
                )}

                {invites.error && <p className="text-sm font-semibold text-rose-600">{invites.error}</p>}
                {invites.invites.length > 0 && (
                  <ul className="space-y-2" aria-label="Invites">
                    {invites.invites.map((invite) => {
                      const state = inviteState(invite);
                      return (
                        <li key={invite.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold">{invite.display_name} <span className="text-xs font-medium capitalize text-slate-400">· {invite.role}</span></p>
                            <p className="font-mono text-xs tracking-widest text-slate-500">{invite.code}</p>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATE_CLASS[state]}`}>{state}</span>
                          {state === 'pending' && (
                            <>
                              <button onClick={() => share(invite.code, invite.display_name)} aria-label={`Share invite for ${invite.display_name}`} className="text-primary">
                                <span className="material-symbols-outlined text-lg">share</span>
                              </button>
                              <button
                                onClick={async () => {
                                  const outcome = await invites.revokeInvite(invite.id);
                                  showToast(outcome.ok ? 'Invite revoked' : outcome.message);
                                }}
                                className="text-xs font-bold text-slate-500"
                              >
                                Revoke
                              </button>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
