'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deletePartner(formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  await prisma.partner.delete({ where: { id } });

  redirect('/admin/partners');
}
