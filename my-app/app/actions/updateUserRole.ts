'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateUserRole(formData: FormData) {
  const currentUser = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const role = formData.get('role') as string;

  if (id === currentUser.id) {
    redirect('/admin/users');
  }

  await prisma.user.update({
    where: { id },
    data: { role },
  });

  redirect('/admin/users');
}
