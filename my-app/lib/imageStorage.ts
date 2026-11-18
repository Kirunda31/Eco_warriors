import 'server-only';

import { prisma } from '@/lib/prisma';
import { MAX_STORED_IMAGE_BYTES } from '@/lib/uploadLimits';

export { MAX_STORED_IMAGE_BYTES } from '@/lib/uploadLimits';

const supportedImageTypes = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export async function storeImage(file: File) {
  if (!supportedImageTypes.has(file.type)) {
    throw new Error('Use a JPEG, PNG, WebP, GIF, or AVIF image.');
  }
  if (file.size > MAX_STORED_IMAGE_BYTES) {
    throw new Error('Images must be 4 MB or smaller.');
  }

  const image = await prisma.imageAsset.create({
    data: {
      contentType: file.type,
      data: Buffer.from(await file.arrayBuffer()),
    },
    select: { id: true },
  });

  return `/api/images/${image.id}`;
}

export async function deleteImageIfUnused(imageUrl: string | null | undefined) {
  const match = imageUrl?.match(/^\/api\/images\/([0-9a-f-]{36})$/i);
  if (!match || !imageUrl) return;

  const counts = await Promise.all([
    prisma.galleryItem.count({ where: { imageUrl } }),
    prisma.story.count({ where: { photoUrl: imageUrl } }),
    prisma.news.count({ where: { featuredImage: imageUrl } }),
    prisma.event.count({ where: { featuredImage: imageUrl } }),
    prisma.project.count({ where: { heroImageUrl: imageUrl } }),
    prisma.program.count({ where: { heroImageUrl: imageUrl } }),
  ]);
  if (counts.some((count) => count > 0)) return;

  await prisma.imageAsset.deleteMany({ where: { id: match[1] } });
}
