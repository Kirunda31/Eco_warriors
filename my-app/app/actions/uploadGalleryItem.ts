'use server';

import { prisma } from '@/lib/prisma';
import { s3Client } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';

const MAX_GALLERY_UPLOADS = 5;

export async function uploadGalleryItem(formData: FormData) {
  const user = await requireStaff();

  const files = formData
    .getAll('images')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const caption = formData.get('caption') as string;
  const projectIdRaw = formData.get('projectId') as string;
  if (projectIdRaw) await requireProjectAccess(parseInt(projectIdRaw));
  else if (user.role === 'manager') redirect('/admin/gallery');

  if (files.length === 0) throw new Error('Choose at least one image to upload.');
  if (files.length > MAX_GALLERY_UPLOADS) throw new Error(`You can upload up to ${MAX_GALLERY_UPLOADS} images at a time.`);
  if (files.some((file) => !file.type.startsWith('image/'))) throw new Error('Only image files can be uploaded.');

  const uploadedItems = await Promise.all(
    files.map(async (file) => {
      const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'image';
      const fileName = `gallery/${Date.now()}-${randomUUID()}.${extension}`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
        })
      );
      return {
        imageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
        caption: caption || null,
        projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
      };
    })
  );

  await prisma.galleryItem.createMany({ data: uploadedItems });

  redirect('/admin');
}
