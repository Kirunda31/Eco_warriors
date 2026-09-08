'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function submitContactMessage(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const category = formData.get('category') as string;
  const message = formData.get('message') as string;

  await prisma.contactMessage.create({
    data: { name, email, category, message },
  });

  redirect('/contact?submitted=true');
}