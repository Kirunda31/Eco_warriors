import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project: selectedProject } = await searchParams;
  const items = await prisma.galleryItem.findMany({
    where: { OR: [{ projectId: null }, { project: { is: { status: 'active' } } }] },
    orderBy: { createdAt: 'desc' },
    include: { project: true },
  });
  const projects = Array.from(new Map(items.filter((item) => item.project).map((item) => [item.project!.slug, item.project!])).values());
  const visibleItems = selectedProject ? items.filter((item) => item.project?.slug === selectedProject) : items;
  const selectedTitle = projects.find((project) => project.slug === selectedProject)?.title;

  return (
    <div>
      <section className="bg-emerald-950 px-6 py-16 text-white sm:py-20"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-lime-300">In the field</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Photo gallery.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-100">Moments of community action, learning, and change across Eco Warriors projects.</p></div></section>
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {projects.length > 0 && <nav className="flex flex-wrap gap-2" aria-label="Filter gallery by project"><Link href="/gallery" className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!selectedProject ? 'bg-emerald-800 text-white' : 'border border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}>All photos</Link>{projects.map((project) => <Link key={project.slug} href={`/gallery?project=${project.slug}`} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedProject === project.slug ? 'bg-emerald-800 text-white' : 'border border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}>{project.title}</Link>)}</nav>}
        <div className="mt-9"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">{selectedTitle ?? 'All projects'}</p>{visibleItems.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visibleItems.map((item) => <figure key={item.id} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><img src={item.imageUrl} alt={item.caption ?? `${item.project?.title ?? 'Eco Warriors'} activity`} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />{(item.caption || item.project) && <figcaption className="p-4"><p className="text-sm font-medium text-slate-700">{item.caption ?? 'Eco Warriors activity'}</p>{item.project && <Link href={`/projects/${item.project.slug}`} className="mt-2 inline-block text-xs font-bold uppercase tracking-wide text-emerald-800 hover:underline">{item.project.title}</Link>}</figcaption>}</figure>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center text-slate-600">No photos have been added to this project yet.</div>}</div>
      </section>
    </div>
  );
}
