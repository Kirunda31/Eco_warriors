'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function linkGalleryItem(formData: FormData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const userId = parseInt(sessionCookie.value);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const imageUrl = formData.get('imageUrl') as string;
  const caption = formData.get('caption') as string;
  const projectIdRaw = formData.get('projectId') as string;

  await prisma.galleryItem.create({
    data: {
      imageUrl,
      caption: caption || null,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
    },
  });

  redirect('/admin');
}