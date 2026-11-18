'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { uploadFeaturedImage } from './uploadFeaturedImage';
import { deleteImageIfUnused } from '@/lib/imageStorage';

export async function updateNews(formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const existing = await prisma.news.findUnique({ where: { id }, select: { featuredImage: true } });
  if (!existing) throw new Error('Article not found.');
  const featuredImage = await uploadFeaturedImage(formData.get('featuredImage'), existing.featuredImage);
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const tags = formData.get('tags') as string;
  const status = formData.get('status') as string;

  await prisma.news.update({
    where: { id },
    data: { title, slug, featuredImage, content, author, category, tags: tags || null, status },
  });
  if (existing.featuredImage !== featuredImage) await deleteImageIfUnused(existing.featuredImage);

  redirect('/admin');
}
