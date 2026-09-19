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

  const phone = String(formData.get('phone') ?? '').trim();
  const guests = Math.max(0, Number(formData.get('guests') ?? 0) || 0);
  await prisma.eventRegistration.upsert({ where: { eventId_email: { eventId, email } }, update: { name, phone: phone || null, guests, status: 'registered' }, create: { eventId, name, email, phone: phone || null, guests } });

  redirect('/events?status=registered');
}
