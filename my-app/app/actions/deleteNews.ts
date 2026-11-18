'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { deleteImageIfUnused } from '@/lib/imageStorage';

export async function deleteNews(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const article = await prisma.news.findUnique({ where: { id }, select: { featuredImage: true } });
  await prisma.news.delete({ where: { id } });
  await deleteImageIfUnused(article?.featuredImage);

  redirect('/admin');
}
