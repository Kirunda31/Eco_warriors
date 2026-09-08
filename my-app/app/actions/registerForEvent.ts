'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function registerForEvent(formData: FormData) {
  const eventId = Number(formData.get('eventId'));
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || !name || !/^\S+@\S+\.\S+$/.test(email)) {
    redirect('/events?status=invalid');
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      category: 'Event registration',
      message: `Registration interest: ${event.title} (event ID ${event.id})`,
    },
  });

  redirect('/events?status=registered');
}
