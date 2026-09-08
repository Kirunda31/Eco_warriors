'use server';

import { prisma } from '@/lib/prisma';
import { requireGalleryItemAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteGalleryItem(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await requireGalleryItemAccess(id);

  await prisma.galleryItem.delete({
    where: { id },
  });

  redirect('/admin');
}
