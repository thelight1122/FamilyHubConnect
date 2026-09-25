import { useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';

const emptyState = {
  entries: [],
  balances: [],
  goals: [],
  loans: [],
};

export const toCents = (dollars) => Math.round(Number(dollars) * 100);
export const formatCents = (cents) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

// Row-level security decides what comes back: a child gets only their own
// money, an adult gets the whole family's.
export default function useFinance(familyId) {
  const { currentUser } = useAuth();
  const [state, setState] = useState(emptyState);
  const [error, setError] = useState(null);
  const live = Boolean(supabase && familyId && currentUser?.id);

  const load = useCallback(async () => {
    if (!live) {
      setState(emptyState);
      return;
    }

    const [entries, balances, goals, loans] = await Promise.all([
      supabase
        .from('ledger_entries')
        .select('id, member_id, amount_cents, kind, note, created_at')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('member_balances').select('member_id, balance_cents').eq('family_id', familyId),
      supabase.from('savings_goals').select('id, member_id, title, target_cents').eq('family_id', familyId),
      supabase
        .from('loan_requests')
        .select('id, borrower_id, amount_cents, purpose, status, created_at')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false }),
    ]);

    const firstError = [entries, balances, goals, loans].find((r) => r.error)?.error;
    if (firstError) {
      setError(firstError.message);
      return;
    }

    setError(null);
    setState({
      entries: entries.data ?? [],
      balances: balances.data ?? [],
      goals: goals.data ?? [],
      loans: loans.data ?? [],
    });
  }, [familyId, live]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const afterWrite = useCallback(
    async ({ error: writeError }) => {
      if (writeError) return { ok: false, message: writeError.message };
      await load();
      return { ok: true };
    },
    [load]
  );

  const requestLoan = useCallback(
    ({ amount, purpose }) => {
      const amountCents = toCents(amount);
      if (!amountCents || amountCents <= 0) return Promise.resolve({ ok: false, message: 'Enter an amount above $0.' });
      if (!purpose?.trim()) return Promise.resolve({ ok: false, message: 'Describe what the money is for.' });
      return supabase
        .from('loan_requests')
        .insert({ family_id: familyId, borrower_id: currentUser.id, amount_cents: amountCents, purpose: purpose.trim() })
        .then(afterWrite);
    },
    [afterWrite, currentUser, familyId]
  );

  const decideLoan = useCallback(
    (id, approve) => supabase.rpc('decide_loan', { target_loan_id: id, approve }).then(afterWrite),
    [afterWrite]
  );

  const myBalanceCents = state.balances.find((b) => b.member_id === currentUser?.id)?.balance_cents ?? 0;
  const familyTotalCents = state.balances.reduce((sum, b) => sum + Number(b.balance_cents), 0);

  return useMemo(
    () => ({
      ...state,
      live,
      error,
      myBalanceCents,
      familyTotalCents,
      myEntries: state.entries.filter((e) => e.member_id === currentUser?.id),
      myGoal: state.goals.find((g) => g.member_id === currentUser?.id) ?? null,
      pendingLoans: state.loans.filter((l) => l.status === 'pending'),
      approvedLoans: state.loans.filter((l) => l.status === 'approved'),
      requestLoan,
      decideLoan,
    }),
    [currentUser, decideLoan, error, familyTotalCents, live, myBalanceCents, requestLoan, state]
  );
}
