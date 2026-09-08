'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteProgram(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);

  await prisma.program.delete({
    where: { id },
  });

  redirect('/admin');
}
