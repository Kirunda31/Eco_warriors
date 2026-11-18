import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { s3Client } from '@/lib/s3';
import { MAX_DOCUMENT_UPLOAD_BYTES } from '@/lib/uploadLimits';

export async function storeDocumentFile(file: File, folder: 'documents' | 'reports') {
  if (file.size > MAX_DOCUMENT_UPLOAD_BYTES) {
    throw new Error('Documents must be 4 MB or smaller.');
  }

  const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'file';
  const key = `${folder}/${Date.now()}-${randomUUID()}.${extension}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type || 'application/octet-stream',
  }));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export function validateDocumentUploadFiles(files: File[]) {
  if (files.some((file) => file.size > MAX_DOCUMENT_UPLOAD_BYTES) || files.reduce((total, file) => total + file.size, 0) > MAX_DOCUMENT_UPLOAD_BYTES) {
    throw new Error('Choose files with a combined size of 4 MB or less.');
  }
}
