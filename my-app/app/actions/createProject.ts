'use server';

import { prisma } from '@/lib/prisma';
import { requireProgramAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const programId = parseInt(formData.get('programId') as string);
  await requireProgramAccess(programId);

  await prisma.project.create({
    data: { title, slug, description, location, programId },
  });

  redirect('/admin');
}
