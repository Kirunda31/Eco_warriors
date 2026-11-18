'use server';

import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateUserPassword(formData: FormData) {
  await requireAdmin();

  const id = Number(formData.get('id'));
  const password = String(formData.get('password') ?? '');
  if (!Number.isInteger(id) || id < 1) throw new Error('Select a valid user.');
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('Use a password of at least 8 characters and no more than 72 bytes.');
  }

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) throw new Error('User not found.');

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.update({ where: { id }, data: { password: hashedPassword } });

  redirect(`/admin/users/${id}/edit?passwordUpdated=1`);
}
