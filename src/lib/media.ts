import { supabase } from './supabase';

// Family photos and voice memos live in the private "family-media" bucket
// under "<family_id>/...". The database only lets family members read and
// upload there, so links are short-lived signed URLs, never public ones.
const BUCKET = 'family-media';
const LINK_SECONDS = 60 * 60;

export type UploadResult = { ok: true; path: string } | { ok: false; message: string };

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
  'audio/mpeg': 'mp3',
};

export async function uploadFamilyMedia(familyId: string, file: Blob): Promise<UploadResult> {
  if (!supabase) return { ok: false, message: 'Media needs Supabase sign-in.' };
  const type = file.type.split(';')[0];
  const extension = EXTENSIONS[type];
  if (!extension) return { ok: false, message: 'That file type is not supported.' };

  const path = `${familyId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: type });
  return error ? { ok: false, message: error.message } : { ok: true, path };
}

// Resolves storage paths to signed URLs, skipping any that fail.
export async function signedMediaUrls(paths: (string | null | undefined)[]): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter((p): p is string => Boolean(p)))];
  if (!supabase || unique.length === 0) return {};
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(unique, LINK_SECONDS);
  return Object.fromEntries((data ?? []).filter((d) => d.signedUrl && d.path).map((d) => [d.path as string, d.signedUrl as string]));
}
