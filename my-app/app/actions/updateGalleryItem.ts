'use server';

import { prisma } from '@/lib/prisma';
import { requireGalleryItemAccess, requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateGalleryItem(formData: FormData) {
  const user = await requireStaff();

  const id = parseInt(formData.get('id') as string);
  const imageUrl = formData.get('imageUrl') as string;
  const caption = formData.get('caption') as string;
  const projectIdRaw = formData.get('projectId') as string;
  await requireGalleryItemAccess(id);
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

  redirect('/admin');
}
