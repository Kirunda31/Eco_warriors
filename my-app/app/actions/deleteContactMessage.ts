'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteContactMessage(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  await prisma.contactMessage.delete({ where: { id } });

  redirect('/admin/messages');
}
