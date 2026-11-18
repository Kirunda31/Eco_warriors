'use server';

import { storeImage } from '@/lib/imageStorage';

export async function uploadFeaturedImage(value: FormDataEntryValue | null, existingUrl?: string | null) {
  if (!(value instanceof File) || value.size === 0) {
    if (existingUrl) return existingUrl;
    throw new Error('A featured photo is required.');
  }
  return storeImage(value);
}
