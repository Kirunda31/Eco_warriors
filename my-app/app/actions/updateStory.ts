'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess, requireStaff, requireStoryAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { uploadStoryPhoto } from './uploadStoryPhoto';
import { getVideoUrl } from './storyMedia';

export async function updateStory(formData: FormData) {
  const user = await requireStaff();

  const id = parseInt(formData.get('id') as string);
  const personName = formData.get('personName') as string;
  const headline = formData.get('headline') as string;
  const slug = formData.get('slug') as string;
  const challenge = formData.get('challenge') as string;
  const intervention = formData.get('intervention') as string;
  const outcome = formData.get('outcome') as string;
  const quote = formData.get('quote') as string;
  const fullStory = formData.get('fullStory') as string;
  const existing = await prisma.story.findUnique({ where: { id }, select: { photoUrl: true } });
  if (!existing) throw new Error('Story not found.');
  const photoUrl = await uploadStoryPhoto(formData.get('photo'), existing.photoUrl);
  const videoUrl = getVideoUrl(formData.get('videoUrl'));
  const requestedStatus = formData.get('status') as string;
  const status = user.role === 'manager' ? 'submitted' : (requestedStatus === 'published' ? 'published' : 'draft');
  const projectIdRaw = formData.get('projectId') as string;
  await requireStoryAccess(id);
  if (projectIdRaw) await requireProjectAccess(parseInt(projectIdRaw));
  else if (user.role === 'manager') redirect('/admin/stories');

  await prisma.story.update({
    where: { id },
    data: {
      personName,
      headline,
      slug,
      challenge,
      intervention,
      outcome,
      quote: quote || null,
      fullStory,
      photoUrl,
      videoUrl,
      status,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
    },
  });

  redirect('/admin');
}
