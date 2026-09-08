'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';

const MAX_GALLERY_LINKS = 5;

export async function linkGalleryItem(formData: FormData) {
  const user = await requireStaff();

  const imageUrls = formData
    .getAll('imageUrl')
    .map((entry) => String(entry).trim())
    .filter(Boolean);
  const caption = formData.get('caption') as string;
  const projectIdRaw = formData.get('projectId') as string;
  if (projectIdRaw) await requireProjectAccess(parseInt(projectIdRaw));
  else if (user.role === 'manager') redirect('/admin/gallery');

  if (imageUrls.length === 0) throw new Error('Provide at least one image URL.');
  if (imageUrls.length > MAX_GALLERY_LINKS) throw new Error(`You can add up to ${MAX_GALLERY_LINKS} images at a time.`);
  if (new Set(imageUrls).size !== imageUrls.length) throw new Error('Each image URL must be unique.');

  for (const imageUrl of imageUrls) {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      throw new Error('Provide valid image URLs.');
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Image URLs must use HTTP or HTTPS.');
  }

  await prisma.galleryItem.createMany({
    data: imageUrls.map((imageUrl) => ({
      imageUrl,
      caption: caption || null,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
    })),
  });

  redirect('/admin');
}
