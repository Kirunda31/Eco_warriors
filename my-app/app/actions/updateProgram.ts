'use server';

import { prisma } from '@/lib/prisma';
import { requireProgramAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateProgram(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const user = await requireProgramAccess(id);
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const goal = formData.get('goal') as string;
  const heroImageUrl = (formData.get('heroImageUrl') as string).trim();
  const managerIdRaw = formData.get('managerId') as string;

  if (heroImageUrl) {
    const galleryImage = await prisma.galleryItem.findFirst({ where: { imageUrl: heroImageUrl, project: { programId: id } }, select: { id: true } });
    if (!galleryImage) throw new Error('Choose a background image from a project in this program.');
  }

  await prisma.program.update({
    where: { id },
    data: { name, slug, description, goal, heroImageUrl: heroImageUrl || null, managerId: user.role === 'admin' ? (managerIdRaw ? parseInt(managerIdRaw) : null) : undefined },
  });

  redirect('/admin');
}
