'use server';

import { prisma } from '@/lib/prisma';
import { requireStoryAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteStory(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await requireStoryAccess(id);

  await prisma.story.delete({
    where: { id },
  });

  redirect('/admin');
}
