'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateLeader(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const name = formData.get('name') as string;
  const position = formData.get('position') as string;
  const biography = formData.get('biography') as string;
  const photo = formData.get('photo') as string;
  const socialLinks = formData.get('socialLinks') as string;
  const category = formData.get('category') as string;
  const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;

  await prisma.leader.update({
    where: { id },
    data: { name, position, biography, photo: photo || null, socialLinks: socialLinks || null, category, displayOrder },
  });

  redirect('/admin');
}
