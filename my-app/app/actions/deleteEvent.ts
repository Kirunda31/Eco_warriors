'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteEvent(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  await prisma.event.delete({ where: { id } });

  redirect('/admin');
}
