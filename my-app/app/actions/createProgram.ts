'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createProgram(formData: FormData) {
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

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const goal = formData.get('goal') as string;

  await prisma.program.create({
    data: { name, slug, description, goal },
  });

  redirect('/admin');
}