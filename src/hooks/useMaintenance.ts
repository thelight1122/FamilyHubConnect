import useLiveQuery from './useLiveQuery';

export type MaintenanceSection = 'vehicles' | 'home' | 'subscriptions';
export type MaintenanceStatus = 'Overdue' | 'Due soon' | 'Schedule' | 'Active' | 'Done';

const DAY = 24 * 3600 * 1000;

// Status comes from the dates: past due, due within two weeks, or later.
export function maintenanceStatus(item: { due_on: string | null; handled_at: string | null; section: string }): MaintenanceStatus {
  if (item.handled_at) return 'Done';
  if (!item.due_on) return item.section === 'subscriptions' ? 'Active' : 'Schedule';
  const days = (new Date(`${item.due_on}T00:00:00`).getTime() - Date.now()) / DAY;
  if (days < 0) return 'Overdue';
  if (days <= 14) return 'Due soon';
  return 'Schedule';
}

export default function useMaintenance(familyId: string | undefined) {
  const query = useLiveQuery(familyId, [], (db, fid) =>
    db
      .from('maintenance_items')
      .select('id, section, title, detail, due_on, monthly_cost_cents, handled_at')
      .eq('family_id', fid)
      .order('due_on', { ascending: true, nullsFirst: false })
      .then(({ data, error }) => ({ data: data ?? [], error }))
  );

  const items = query.data;
  const open = items.filter((i) => !i.handled_at);

  return {
    items,
    live: query.live,
    error: query.error,
    summary: {
      dueSoon: open.filter((i) => maintenanceStatus(i) === 'Due soon').length,
      overdue: open.filter((i) => maintenanceStatus(i) === 'Overdue').length,
      monthlySpend: Math.round(items.reduce((sum, i) => sum + (i.monthly_cost_cents ?? 0), 0) / 100),
    },
    addItem: (item: { section: MaintenanceSection; title: string; detail: string; dueOn: string; monthlyCost: string }) =>
      query.write((db, fid) =>
        db.from('maintenance_items').insert({
          family_id: fid,
          section: item.section,
          title: item.title.trim(),
          detail: item.detail.trim(),
          due_on: item.dueOn || null,
          monthly_cost_cents: item.monthlyCost ? Math.round(Number(item.monthlyCost) * 100) : null,
        })
      ),
    setHandled: (id: string, handled: boolean) =>
      query.write((db) => db.from('maintenance_items').update({ handled_at: handled ? new Date().toISOString() : null }).eq('id', id)),
  };
}
