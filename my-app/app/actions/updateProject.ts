'use server';

import { prisma } from '@/lib/prisma';
import { requireProgramAccess, requireProjectAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateProject(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string;
  const heroImageUrl = (formData.get('heroImageUrl') as string).trim();
  const programId = parseInt(formData.get('programId') as string);
  const statusChoice = formData.get('status') as string;
  const latitudeRaw = String(formData.get('latitude') ?? '').trim();
  const longitudeRaw = String(formData.get('longitude') ?? '').trim();
  const latitude = latitudeRaw ? Number(latitudeRaw) : null;
  const longitude = longitudeRaw ? Number(longitudeRaw) : null;
  if ((latitudeRaw && (!Number.isFinite(latitude) || latitude! < -90 || latitude! > 90)) || (longitudeRaw && (!Number.isFinite(longitude) || longitude! < -180 || longitude! > 180))) throw new Error('Enter valid map coordinates.');
  await requireProjectAccess(id);
  await requireProgramAccess(programId);

  if (heroImageUrl) {
    const galleryImage = await prisma.galleryItem.findFirst({ where: { projectId: id, imageUrl: heroImageUrl }, select: { id: true } });
    if (!galleryImage) throw new Error('Choose a background image from this project’s gallery.');
  }

  await prisma.project.update({
    where: { id },
    data: { title, slug, description, location, heroImageUrl: heroImageUrl || null, programId, latitude, longitude, status: statusChoice === 'paused' || statusChoice === 'cancelled' ? statusChoice : 'active' },
  });

  redirect('/admin');
}
