'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateNews(formData: FormData) {
  const user = await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const featuredImage = formData.get('featuredImage') as string;
  const content = formData.get('content') as string;
  const author = formData.get('author') as string;
  const category = formData.get('category') as string;
  const tags = formData.get('tags') as string;
  const status = formData.get('status') as string;

  await prisma.news.update({
    where: { id },
    data: { title, slug, featuredImage: featuredImage || null, content, author, category, tags: tags || null, status },
  });

  redirect('/admin');
}
