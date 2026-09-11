'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { uploadFeaturedImage } from './uploadFeaturedImage';

export async function createEvent(formData: FormData) {
  await requireAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const registrationLink = formData.get('registrationLink') as string;
  const featuredImage = await uploadFeaturedImage(formData.get('featuredImage'), 'events');

  await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      time,
      location,
      registrationLink: registrationLink || null,
      featuredImage,
    },
  });

  redirect('/admin');
}
