'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createNews(formData: FormData) {
  const user = await requireAdmin();

  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const featuredImage = formData.get('featuredImage') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const tags = formData.get('tags') as string;
  const status = formData.get('status') as string;

  await prisma.news.create({
    data: {
      title,
      slug,
      featuredImage: featuredImage || null,
      content,
      author,
      category,
      tags: tags || null,
      status,
    },
  });

  redirect('/admin');
}
