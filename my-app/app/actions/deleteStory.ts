'use server';

import { prisma } from '@/lib/prisma';
import { requireStoryAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { deleteImageIfUnused } from '@/lib/imageStorage';

export async function deleteStory(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await requireStoryAccess(id);
  const story = await prisma.story.findUnique({ where: { id }, select: { photoUrl: true } });

  await prisma.story.delete({
    where: { id },
  });
  await deleteImageIfUnused(story?.photoUrl);

  redirect('/admin');
}
