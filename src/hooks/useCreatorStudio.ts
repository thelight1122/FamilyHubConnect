import useLiveQuery, { combine } from './useLiveQuery';
import { uploadFamilyMedia } from '../lib/media';
import { failed, type LiveResult } from './liveResult';

export default function useCreatorStudio(familyId: string | undefined) {
  const query = useLiveQuery(familyId, { posts: [], options: [], votes: [], likes: [] }, async (db, fid) =>
    combine({
      posts: await db
        .from('creator_posts')
        .select('id, author_id, kind, caption, media_path, duration_seconds, created_at')
        .eq('family_id', fid)
        .order('created_at', { ascending: false }),
      options: await db.from('poll_options').select('id, post_id, label, position').eq('family_id', fid).order('position'),
      votes: await db.from('poll_votes').select('post_id, option_id, voter_id').eq('family_id', fid),
      likes: await db.from('post_likes').select('post_id, user_id').eq('family_id', fid),
    })
  );

  const publishMedia = async (kind: 'photo' | 'voice', file: Blob, caption: string, durationSeconds: number | null): Promise<LiveResult> => {
    if (!familyId) return failed('Create a family first.');
    const upload = await uploadFamilyMedia(familyId, file);
    if (!upload.ok) return failed(upload.message);
    return query.write((db, fid, uid) =>
      db.from('creator_posts').insert({
        family_id: fid,
        author_id: uid,
        kind,
        caption: caption.trim(),
        media_path: upload.path,
        duration_seconds: durationSeconds,
      })
    );
  };

  const publishPoll = async (question: string, options: string[]): Promise<LiveResult> => {
    const labels = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim()) return failed('Ask a question.');
    if (labels.length < 2) return failed('Give at least two options.');
    const postId = crypto.randomUUID();
    const created = await query.write((db, fid, uid) =>
      db.from('creator_posts').insert({ id: postId, family_id: fid, author_id: uid, kind: 'poll', caption: question.trim() })
    );
    if (!created.ok) return created;
    return query.write((db, fid) =>
      db.from('poll_options').insert(labels.map((label, position) => ({ post_id: postId, family_id: fid, label, position })))
    );
  };

  return {
    ...query.data,
    live: query.live,
    error: query.error,
    userId: query.userId,
    publishMedia,
    publishPoll,
    vote: (postId: string, optionId: string) =>
      query.write((db, fid, uid) => db.from('poll_votes').insert({ post_id: postId, option_id: optionId, family_id: fid, voter_id: uid })),
    toggleLike: (postId: string, liked: boolean) =>
      query.write((db, fid, uid) =>
        liked
          ? db.from('post_likes').delete().eq('post_id', postId).eq('user_id', uid)
          : db.from('post_likes').insert({ post_id: postId, family_id: fid, user_id: uid })
      ),
  };
}
