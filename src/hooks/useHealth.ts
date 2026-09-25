import useLiveQuery, { combine } from './useLiveQuery';

export const HEALTH_EVENT_TYPES = ['Illness', 'Injury', 'Doctor Visit', 'Medication Change', 'Other'] as const;
export type HealthEventType = (typeof HEALTH_EVENT_TYPES)[number];

// The database returns only what this person may see: their own records,
// plus the children's if they are an adult.
export default function useHealth(familyId: string | undefined) {
  const query = useLiveQuery(familyId, { logs: [], medications: [] }, async (db, fid) =>
    combine({
      logs: await db
        .from('health_logs')
        .select('id, member_id, kind, note, logged_at')
        .eq('family_id', fid)
        .order('logged_at', { ascending: false })
        .limit(50),
      medications: await db
        .from('medications')
        .select('id, member_id, name, dose, schedule, active')
        .eq('family_id', fid)
        .eq('active', true)
        .order('name'),
    })
  );

  return {
    ...query.data,
    live: query.live,
    error: query.error,
    logEvent: (memberId: string, kind: HealthEventType, note: string) =>
      query.write((db, fid, uid) =>
        db.from('health_logs').insert({ family_id: fid, member_id: memberId, kind, note: note.trim(), created_by: uid })
      ),
    addMedication: (memberId: string, name: string, dose: string, schedule: string) =>
      query.write((db, fid) =>
        db.from('medications').insert({ family_id: fid, member_id: memberId, name: name.trim(), dose: dose.trim(), schedule: schedule.trim() })
      ),
  };
}
