'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MAX_STORED_IMAGE_BYTES } from '@/lib/imageStorage';

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
  if (files.some((file) => !['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
    throw new Error('Use JPEG, PNG, WebP, GIF, or AVIF images.');
  }
  if (files.some((file) => file.size > MAX_STORED_IMAGE_BYTES) || files.reduce((total, file) => total + file.size, 0) > MAX_STORED_IMAGE_BYTES) {
    throw new Error('Choose up to five images with a combined size of 4 MB or less.');
  }

  await prisma.$transaction(async (tx) => {
    const uploadedItems = await Promise.all(files.map(async (file) => {
      const image = await tx.imageAsset.create({
        data: { contentType: file.type, data: Buffer.from(await file.arrayBuffer()) },
        select: { id: true },
      });
      return {
        imageUrl: `/api/images/${image.id}`,
        caption: caption || null,
        projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
      };
    }));
    await tx.galleryItem.createMany({ data: uploadedItems });
  });

  redirect('/admin');
}
