import { prisma } from '@/lib/prisma';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response('Not found', { status: 404 });

  const image = await prisma.imageAsset.findUnique({
    where: { id },
    select: { contentType: true, data: true },
  });
  if (!image) return new Response('Not found', { status: 404 });

  return new Response(Buffer.from(image.data), {
    headers: {
      'Cache-Control': 'public, max-age=3600, immutable',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
      'Content-Type': image.contentType,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
