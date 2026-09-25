import useLiveQuery, { combine } from './useLiveQuery';
import { uploadFamilyMedia } from '../lib/media';
import { failed } from './liveResult';

export type EventKind = 'game' | 'practice' | 'other';

export default function useSports(familyId: string | undefined) {
  const query = useLiveQuery(familyId, { teams: [], events: [], contacts: [], checklist: [], messages: [] }, async (db, fid) =>
    combine({
      teams: await db.from('teams').select('id, name, league, record').eq('family_id', fid).order('created_at'),
      events: await db
        .from('team_events')
        .select('id, team_id, kind, title, starts_at, location')
        .eq('family_id', fid)
        .gte('starts_at', new Date(Date.now() - 6 * 3600 * 1000).toISOString())
        .order('starts_at'),
      contacts: await db.from('team_contacts').select('id, team_id, name, role, phone, email').eq('family_id', fid).order('name'),
      checklist: await db.from('team_checklist').select('id, team_id, label, critical, packed').eq('family_id', fid).order('label'),
      messages: await db
        .from('team_messages')
        .select('id, team_id, author_id, body, attachment_path, created_at')
        .eq('family_id', fid)
        .order('created_at')
        .limit(200),
    })
  );

  const sendMessage = async (teamId: string, body: string, attachment: File | null = null) => {
    let attachmentPath: string | null = null;
    if (attachment && familyId) {
      const upload = await uploadFamilyMedia(familyId, attachment);
      if (!upload.ok) return failed(upload.message);
      attachmentPath = upload.path;
    }
    return query.write((db, fid, uid) =>
      db.from('team_messages').insert({ team_id: teamId, family_id: fid, author_id: uid, body: body.trim(), attachment_path: attachmentPath })
    );
  };

  return {
    ...query.data,
    live: query.live,
    error: query.error,
    userId: query.userId,
    addTeam: (name: string, league: string) =>
      query.write((db, fid) => db.from('teams').insert({ family_id: fid, name: name.trim(), league: league.trim() })),
    addEvent: (teamId: string, kind: EventKind, title: string, startsAt: string, location: string) =>
      query.write((db, fid) =>
        db.from('team_events').insert({
          team_id: teamId,
          family_id: fid,
          kind,
          title: title.trim(),
          starts_at: new Date(startsAt).toISOString(),
          location: location.trim(),
        })
      ),
    addContact: (teamId: string, name: string, role: string, phone: string, email: string) =>
      query.write((db, fid) =>
        db.from('team_contacts').insert({ team_id: teamId, family_id: fid, name: name.trim(), role: role.trim(), phone: phone.trim(), email: email.trim() })
      ),
    addChecklistItem: (teamId: string, label: string, critical: boolean) =>
      query.write((db, fid) => db.from('team_checklist').insert({ team_id: teamId, family_id: fid, label: label.trim(), critical })),
    setPacked: (itemId: string, packed: boolean) => query.write((db) => db.from('team_checklist').update({ packed }).eq('id', itemId)),
    sendMessage,
  };
}
