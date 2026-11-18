'use server';

import { storeImage } from '@/lib/imageStorage';

export async function uploadStoryPhoto(value: FormDataEntryValue | null, existingUrl?: string | null) {
  if (!(value instanceof File) || value.size === 0) return existingUrl ?? null;
  return storeImage(value);
}
