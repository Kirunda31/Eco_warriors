'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { s3Client } from '@/lib/s3';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export async function uploadFeaturedImage(value: FormDataEntryValue | null, folder: 'events' | 'news', existingUrl?: string | null) {
  if (!(value instanceof File) || value.size === 0) {
    if (existingUrl) return existingUrl;
    throw new Error('A featured photo is required.');
  }
  if (!value.type.startsWith('image/')) throw new Error('Featured photo must be an image file.');
  if (value.size > MAX_IMAGE_SIZE) throw new Error('Featured photo must be 10 MB or smaller.');
  const extension = value.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'image';
  const key = `${folder}/${Date.now()}-${randomUUID()}.${extension}`;
  await s3Client.send(new PutObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key, Body: Buffer.from(await value.arrayBuffer()), ContentType: value.type }));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
