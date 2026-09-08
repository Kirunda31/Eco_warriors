'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function submitVolunteerApplication(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const country = formData.get('country') as string;
  const skills = formData.get('skills') as string;
  const interest = formData.get('interest') as string;
  const availability = formData.get('availability') as string;

  await prisma.volunteer.create({
    data: { name, email, country, skills, interest, availability },
  });

  redirect('/get-involved?submitted=true');
}