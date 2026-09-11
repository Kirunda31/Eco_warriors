'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { uploadFeaturedImage } from './uploadFeaturedImage';

export async function createNews(formData: FormData) {
  await requireAdmin();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const featuredImage = await uploadFeaturedImage(formData.get('featuredImage'), 'news');
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const tags = formData.get('tags') as string;
  const status = formData.get('status') as string;

  await prisma.news.create({
    data: {
      title,
      slug,
      featuredImage,
      content,
      author,
      category,
      tags: tags || null,
      status,
    },
  });

  redirect('/admin');
}
