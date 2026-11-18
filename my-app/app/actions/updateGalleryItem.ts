'use server';

import { prisma } from '@/lib/prisma';
import { requireGalleryItemAccess, requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { deleteImageIfUnused } from '@/lib/imageStorage';

export async function updateGalleryItem(formData: FormData) {
  const user = await requireStaff();

  const id = parseInt(formData.get('id') as string);
  const imageUrl = formData.get('imageUrl') as string;
  const caption = formData.get('caption') as string;
  const projectIdRaw = formData.get('projectId') as string;
  await requireGalleryItemAccess(id);
  const existing = await prisma.galleryItem.findUnique({ where: { id }, select: { imageUrl: true } });
  if (projectIdRaw) await requireProjectAccess(parseInt(projectIdRaw));
  else if (user.role === 'manager') redirect('/admin/gallery');

  await prisma.galleryItem.update({
    where: { id },
    data: {
      imageUrl,
      caption: caption || null,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
    },
  });
  if (existing?.imageUrl !== imageUrl) await deleteImageIfUnused(existing?.imageUrl);

  redirect('/admin');
}
