'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createProject(formData: FormData) {
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
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const programId = parseInt(formData.get('programId') as string);

  await prisma.project.create({
    data: { title, slug, description, location, programId },
  });

  redirect('/admin');
}