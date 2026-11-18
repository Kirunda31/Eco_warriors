'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteUser(formData: FormData) {
  const currentUser = await requireAdmin();
  const id = Number(formData.get('id'));

  if (!Number.isInteger(id) || id < 1) throw new Error('Select a valid user.');
  if (id === currentUser.id) throw new Error('You cannot delete your own account.');

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, _count: { select: { progressReports: true } } },
  });
  if (!user) throw new Error('User not found.');

  if (user.role === 'admin') {
    const adminCount = await prisma.user.count({ where: { role: 'admin' } });
    if (adminCount <= 1) throw new Error('The last administrator account cannot be deleted.');
  }
  if (user._count.progressReports > 0) {
    throw new Error('Delete this user’s project progress reports before deleting their account.');
  }
  await prisma.$transaction(async (tx) => {
    await tx.program.updateMany({ where: { managerId: id }, data: { managerId: null } });
    await tx.user.delete({ where: { id } });
  });

  redirect('/admin/users');
}
