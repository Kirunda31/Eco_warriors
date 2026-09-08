import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({ where: { slug, status: 'active' }, include: { gallery: { orderBy: { createdAt: 'desc' } } } });
  if (!project) notFound();

  return <div><section className="bg-emerald-900 px-6 py-16 text-white"><div className="mx-auto max-w-5xl"><Link href={`/projects/${project.slug}`} className="text-sm font-semibold text-emerald-200 hover:text-white">← Back to project</Link><h1 className="mt-6 text-4xl font-bold">{project.title} gallery</h1></div></section><section className="mx-auto max-w-5xl px-6 py-16"><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{project.gallery.map((item) => <figure key={item.id}><img src={item.imageUrl} alt={item.caption ?? `Photo from ${project.title}`} className="h-60 w-full rounded-xl object-cover" />{item.caption && <figcaption className="mt-2 text-sm text-slate-600">{item.caption}</figcaption>}</figure>)}</div>{project.gallery.length === 0 && <p className="text-slate-600">Photos from this project will be shared soon.</p>}</section></div>;
}
