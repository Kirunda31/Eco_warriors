'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createReport(formData: FormData) {
  const user = await requireStaff();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const fileUrl = formData.get('fileUrl') as string;
  const coverImage = formData.get('coverImage') as string;
  const category = formData.get('category') as string;
  const year = parseInt(formData.get('year') as string);
  const projectIdRaw = formData.get('projectId') as string;
  if (projectIdRaw) await requireProjectAccess(parseInt(projectIdRaw));
  else if (user.role === 'manager') redirect('/admin/reports');

  await prisma.report.create({
    data: {
      title,
      description,
      fileUrl,
      coverImage: coverImage || null,
      category,
      year,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
    },
  });

  redirect('/admin');
}
