'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function subscribeNewsletter(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    redirect('/newsletter?status=invalid');
  }

  const existing = await prisma.contactMessage.findFirst({
    where: { email, category: 'Newsletter' },
  });

  if (existing) {
    await prisma.contactMessage.update({
      where: { id: existing.id },
      data: { status: 'unread', message: 'Newsletter subscription' },
    });
  } else {
    await prisma.contactMessage.create({
      data: {
        name: 'Newsletter subscriber',
        email,
        category: 'Newsletter',
        message: 'Newsletter subscription',
      },
    });
  }

  redirect('/newsletter?status=subscribed');
}
