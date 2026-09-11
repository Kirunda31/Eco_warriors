'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { uploadFeaturedImage } from './uploadFeaturedImage';

export async function updateEvent(formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const registrationLink = formData.get('registrationLink') as string;
  const existing = await prisma.event.findUnique({ where: { id }, select: { featuredImage: true } });
  if (!existing) throw new Error('Event not found.');
  const featuredImage = await uploadFeaturedImage(formData.get('featuredImage'), 'events', existing.featuredImage);

  await prisma.event.update({
    where: { id },
    data: { title, description, date: new Date(date), time, location, registrationLink: registrationLink || null, featuredImage },
  });

  redirect('/admin');
}
