'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createStory(formData: FormData) {
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

  const personName = formData.get('personName') as string;
  const headline = formData.get('headline') as string;
  const slug = formData.get('slug') as string;
  const challenge = formData.get('challenge') as string;
  const intervention = formData.get('intervention') as string;
  const outcome = formData.get('outcome') as string;
  const quote = formData.get('quote') as string;
  const fullStory = formData.get('fullStory') as string;
  const status = formData.get('status') as string;
  const projectIdRaw = formData.get('projectId') as string;

  await prisma.story.create({
    data: {
      personName,
      headline,
      slug,
      challenge,
      intervention,
      outcome,
      quote: quote || null,
      fullStory,
      status,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
    },
  });

  redirect('/admin');
}