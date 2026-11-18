import { prisma } from '@/lib/prisma';

const localOrigin = 'https://eco-warriors.invalid';

export async function POST(request: Request) {
  let path: unknown;
  try {
    ({ path } = await request.json());
  } catch {
    return new Response('Invalid request.', { status: 400 });
  }

  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) {
    return new Response('Invalid path.', { status: 400 });
  }

  let pathname: string;
  try {
    const parsed = new URL(path, localOrigin);
    if (parsed.origin !== localOrigin) return new Response('Invalid path.', { status: 400 });
    pathname = parsed.pathname;
  } catch {
    return new Response('Invalid path.', { status: 400 });
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  }

  const day = new Date().toISOString().slice(0, 10);
  const now = new Date();
  await prisma.siteVisitDaily.upsert({
    where: { day_path: { day, path: pathname } },
    create: { day, path: pathname, pageViews: 1, updatedAt: now },
    update: { pageViews: { increment: 1 }, updatedAt: now },
  });

  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
