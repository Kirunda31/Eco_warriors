'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateMessageStatus(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const status = formData.get('status') as string;

  await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });

  redirect('/admin/messages');
}
