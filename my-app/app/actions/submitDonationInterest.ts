'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function submitDonationInterest(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const amount = String(formData.get('amount') ?? '').trim();
  const currency = String(formData.get('currency') ?? 'UGX');
  const note = String(formData.get('note') ?? '').trim();

  if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
    redirect('/donate?status=invalid');
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      category: 'Donation',
      message: `Donation interest${amount ? `: ${currency} ${amount}` : ''}${note ? `. Note: ${note}` : ''}`,
    },
  });

  redirect('/donate?status=received');
}
