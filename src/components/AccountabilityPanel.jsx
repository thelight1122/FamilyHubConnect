import { useState } from 'react';
import useAccountability from '../hooks/useAccountability';

const DOORS = {
  accountability: { label: 'Accountability', hint: 'An agreement or commitment that did not happen. Everyone gives their account.' },
  support: { label: 'Support', hint: 'An outcome someone may need help with. No account is owed.' },
};

// Live Accountability sessions. The wording is kept impersonal on purpose:
// "a question is open", never "you are accountable" (spec §1).
export default function AccountabilityPanel({ familyId, members, currentUserId, showToast }) {
  const accountability = useAccountability(familyId);
  const [door, setDoor] = useState('accountability');
  const [topic, setTopic] = useState('');
  const [participantIds, setParticipantIds] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [commonGround, setCommonGround] = useState({});

  const others = members.filter((m) => m.user_id !== currentUserId);
  const nameOf = (userId) => members.find((m) => m.user_id === userId)?.display_name ?? 'Family member';

  const run = async (promise, success) => {
    const outcome = await promise;
    showToast(outcome.ok ? success : outcome.message);
    return outcome.ok;
  };

  const open = async (event) => {
    event.preventDefault();
    const ok = await run(accountability.openSession({ door, topic, participantIds }), 'Question opened');
    if (ok) {
      setTopic('');
      setParticipantIds([]);
    }
  };

  return (
    <section className="px-4 py-4 space-y-4" aria-label="Open questions">
      <form onSubmit={open} className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-bold">Open a question</h2>
        <div className="flex gap-2">
          {Object.entries(DOORS).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => setDoor(key)}
              className={`flex-1 rounded-lg py-2 text-sm font-bold ${door === key ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">{DOORS[door].hint}</p>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What is the question about? (e.g. the screen-time agreement)"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        {others.length > 0 && (
          <fieldset className="space-y-1">
            <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">Who gives an account (you always do)</legend>
            {others.map((member) => (
              <label key={member.user_id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={participantIds.includes(member.user_id)}
                  onChange={(e) =>
                    setParticipantIds((ids) => (e.target.checked ? [...ids, member.user_id] : ids.filter((id) => id !== member.user_id)))
                  }
                />
                {member.display_name}
              </label>
            ))}
          </fieldset>
        )}
        <button type="submit" disabled={!topic.trim()} className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white disabled:opacity-50">
          Open question
        </button>
      </form>

      {accountability.error && <p className="text-sm font-semibold text-rose-700">{accountability.error}</p>}

      {accountability.sessions.map((session) => (
        <article key={session.id} className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <header>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {DOORS[session.door].label} · {session.status === 'open' ? 'A question is open' : 'Common ground reached'}
            </p>
            <h3 className="text-base font-bold">{session.topic}</h3>
            <p className="text-xs text-slate-500">With {session.participantIds.map(nameOf).join(', ')}</p>
          </header>

          {session.isParticipant && session.status === 'open' && !session.myAccount && (
            <div className="space-y-2">
              <textarea
                value={drafts[session.id] ?? ''}
                onChange={(e) => setDrafts((d) => ({ ...d, [session.id]: e.target.value }))}
                placeholder="Your account: what happened, from your side"
                className="min-h-[80px] w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                onClick={() => run(accountability.giveAccount(session.id, drafts[session.id] ?? ''), 'Account given')}
                disabled={!drafts[session.id]?.trim()}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
              >
                Give my account
              </button>
            </div>
          )}

          {session.myAccount && !session.everyoneHeard && (
            <p className="text-xs italic text-slate-500">Your account is in. Others' accounts appear once everyone has been heard.</p>
          )}

          {session.everyoneHeard && (
            <ul className="space-y-2">
              {session.accounts.map((account) => (
                <li key={account.user_id} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{nameOf(account.user_id)}</p>
                  <p>{account.body}</p>
                </li>
              ))}
            </ul>
          )}

          {session.status === 'open' && session.isParticipant && session.everyoneHeard && (
            <div className="space-y-2">
              <input
                value={commonGround[session.id] ?? ''}
                onChange={(e) => setCommonGround((c) => ({ ...c, [session.id]: e.target.value }))}
                placeholder="The common ground you agreed"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                onClick={() => run(accountability.closeSession(session.id, commonGround[session.id] ?? ''), 'Common ground recorded')}
                className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
              >
                Record common ground
              </button>
            </div>
          )}

          {session.status === 'closed' && session.common_ground && (
            <p className="text-sm font-semibold text-emerald-700">{session.common_ground}</p>
          )}
        </article>
      ))}
    </section>
  );
}
