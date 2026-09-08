'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateVolunteerStatus(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const status = formData.get('status') as string;

  await prisma.volunteer.update({
    where: { id },
    data: { status },
  });

  redirect('/admin/volunteers');
}
