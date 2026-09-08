'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createProgram(formData: FormData) {
  const user = await requireAdmin();

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const goal = formData.get('goal') as string;

  await prisma.program.create({
    data: { name, slug, description, goal },
  });

  redirect('/admin');
}
