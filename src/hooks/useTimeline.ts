import useLiveQuery from './useLiveQuery';
import { uploadFamilyMedia } from '../lib/media';
import { failed } from './liveResult';

export type TimelineKind = 'achievement' | 'memory' | 'journal' | 'milestone';

export interface NewTimelineEntry {
  kind: TimelineKind;
  title: string;
  body: string;
  occurredOn: string;
  isPrivate: boolean;
  photo: File | null;
}

// Private entries come back only for their author (the database decides).
export default function useTimeline(familyId: string | undefined) {
  const query = useLiveQuery(familyId, [], (db, fid) =>
    db
      .from('timeline_entries')
      .select('id, author_id, kind, title, body, occurred_on, visibility, photo_path, created_at')
      .eq('family_id', fid)
      .order('occurred_on', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data, error }) => ({ data: data ?? [], error }))
  );

  const addEntry = async (entry: NewTimelineEntry) => {
    let photoPath: string | null = null;
    if (entry.photo && familyId) {
      const upload = await uploadFamilyMedia(familyId, entry.photo);
      if (!upload.ok) return failed(upload.message);
      photoPath = upload.path;
    }
    return query.write((db, fid, uid) =>
      db.from('timeline_entries').insert({
        family_id: fid,
        author_id: uid,
        kind: entry.kind,
        title: entry.title.trim(),
        body: entry.body.trim(),
        occurred_on: entry.occurredOn || undefined,
        visibility: entry.isPrivate ? 'private' : 'family',
        photo_path: photoPath,
      })
    );
  };

  return { entries: query.data, live: query.live, error: query.error, userId: query.userId, addEntry };
}
