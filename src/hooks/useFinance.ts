import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import useAuth from '../context/useAuth';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';
import { NOT_LIVE, failed, fromError, type LiveResult } from './liveResult';

type Entry = Pick<Tables<'ledger_entries'>, 'id' | 'member_id' | 'amount_cents' | 'kind' | 'note' | 'created_at'>;
type Balance = { member_id: string | null; balance_cents: number | null };
type Goal = Pick<Tables<'savings_goals'>, 'id' | 'member_id' | 'title' | 'target_cents'>;
type Loan = Pick<Tables<'loan_requests'>, 'id' | 'borrower_id' | 'amount_cents' | 'purpose' | 'status' | 'created_at'>;

interface FinanceState {
  entries: Entry[];
  balances: Balance[];
  goals: Goal[];
  loans: Loan[];
}

const emptyState: FinanceState = {
  entries: [],
  balances: [],
  goals: [],
  loans: [],
};

export const toCents = (dollars: string | number) => Math.round(Number(dollars) * 100);
export const formatCents = (cents: number | null | undefined) => `$${(Number(cents || 0) / 100).toFixed(2)}`;

// Row-level security decides what comes back: a child gets only their own
// money, an adult gets the whole family's.
export default function useFinance(familyId: string | undefined) {
  const { currentUser } = useAuth();
  const [state, setState] = useState<FinanceState>(emptyState);
  const [error, setError] = useState<string | null>(null);
  const userId = currentUser?.id ?? null;
  const db = familyId && userId ? supabase : null;
  const live = Boolean(db);

  const load = useCallback(async () => {
    if (!db || !familyId) {
      setState(emptyState);
      return;
    }

    const [entries, balances, goals, loans] = await Promise.all([
      db
        .from('ledger_entries')
        .select('id, member_id, amount_cents, kind, note, created_at')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })
        .limit(50),
      db.from('member_balances').select('member_id, balance_cents').eq('family_id', familyId),
      db.from('savings_goals').select('id, member_id, title, target_cents').eq('family_id', familyId),
      db
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
  }, [db, familyId]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const afterWrite = useCallback(
    async ({ error: writeError }: { error: PostgrestError | null }): Promise<LiveResult> => {
      if (!writeError) await load();
      return fromError(writeError);
    },
    [load]
  );

  const requestLoan = useCallback(
    async ({ amount, purpose }: { amount: string | number; purpose: string }): Promise<LiveResult> => {
      if (!db || !familyId || !userId) return NOT_LIVE;
      const amountCents = toCents(amount);
      if (!amountCents || amountCents <= 0) return failed('Enter an amount above $0.');
      if (!purpose.trim()) return failed('Describe what the money is for.');
      return afterWrite(
        await db
          .from('loan_requests')
          .insert({ family_id: familyId, borrower_id: userId, amount_cents: amountCents, purpose: purpose.trim() })
      );
    },
    [afterWrite, db, familyId, userId]
  );

  const decideLoan = useCallback(
    async (id: string, approve: boolean): Promise<LiveResult> => {
      if (!db) return NOT_LIVE;
      return afterWrite(await db.rpc('decide_loan', { target_loan_id: id, approve }));
    },
    [afterWrite, db]
  );

  const myBalanceCents = Number(state.balances.find((b) => b.member_id === userId)?.balance_cents ?? 0);
  const familyTotalCents = state.balances.reduce((sum, b) => sum + Number(b.balance_cents ?? 0), 0);

  return useMemo(
    () => ({
      ...state,
      live,
      error,
      myBalanceCents,
      familyTotalCents,
      myEntries: state.entries.filter((e) => e.member_id === userId),
      myGoal: state.goals.find((g) => g.member_id === userId) ?? null,
      pendingLoans: state.loans.filter((l) => l.status === 'pending'),
      approvedLoans: state.loans.filter((l) => l.status === 'approved'),
      requestLoan,
      decideLoan,
    }),
    [decideLoan, error, familyTotalCents, live, myBalanceCents, requestLoan, state, userId]
  );
}
