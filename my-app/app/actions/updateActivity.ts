'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function updateActivity(formData: FormData) {
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

  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const projectId = parseInt(formData.get('projectId') as string);

  await prisma.activity.update({
    where: { id },
    data: { title, description, date: new Date(date), location, projectId },
  });

  redirect('/admin');
}