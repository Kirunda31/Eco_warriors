'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createReport(formData: FormData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const userId = parseInt(sessionCookie.value);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const fileUrl = formData.get('fileUrl') as string;
  const coverImage = formData.get('coverImage') as string;
  const category = formData.get('category') as string;
  const year = parseInt(formData.get('year') as string);
  const projectIdRaw = formData.get('projectId') as string;

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