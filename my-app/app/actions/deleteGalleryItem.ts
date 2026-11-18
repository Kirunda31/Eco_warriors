'use server';

import { prisma } from '@/lib/prisma';
import { requireGalleryItemAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { deleteImageIfUnused } from '@/lib/imageStorage';

export async function deleteGalleryItem(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await requireGalleryItemAccess(id);
  const item = await prisma.galleryItem.findUnique({ where: { id }, select: { imageUrl: true } });

  await prisma.galleryItem.delete({
    where: { id },
  });
  await deleteImageIfUnused(item?.imageUrl);

  redirect('/admin');
}
