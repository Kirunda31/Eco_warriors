'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { deleteImageIfUnused } from '@/lib/imageStorage';

export async function deleteEvent(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const event = await prisma.event.findUnique({ where: { id }, select: { featuredImage: true } });
  await prisma.event.delete({ where: { id } });
  await deleteImageIfUnused(event?.featuredImage);

  redirect('/admin');
}
