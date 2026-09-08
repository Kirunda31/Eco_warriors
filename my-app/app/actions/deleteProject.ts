'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteProject(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await requireProjectAccess(id);

  await prisma.project.delete({
    where: { id },
  });

  redirect('/admin');
}
