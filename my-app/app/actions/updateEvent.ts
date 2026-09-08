'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateEvent(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const registrationLink = formData.get('registrationLink') as string;
  const featuredImage = formData.get('featuredImage') as string;

  await prisma.event.update({
    where: { id },
    data: { title, description, date: new Date(date), time, location, registrationLink: registrationLink || null, featuredImage: featuredImage || null },
  });

  redirect('/admin');
}
