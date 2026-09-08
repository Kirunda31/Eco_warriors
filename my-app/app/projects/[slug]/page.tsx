import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: { slug, status: 'active' },
    include: {
      program: true,
      stories: { where: { status: 'published' }, take: 3 },
      gallery: { orderBy: { createdAt: 'desc' }, take: 4 },
      reports: { orderBy: { year: 'desc' }, take: 3 },
    },
  });

  if (!project) {
    notFound();
  }

  const impactMetrics = await prisma.impactMetric.findMany({
    where: { project: project.title, status: 'published' },
    orderBy: [{ year: 'desc' }, { createdAt: 'asc' }],
  });
  const heroImageUrl = project.heroImageUrl;

  return (
    <div>
      <section className={`relative overflow-hidden px-6 py-16 text-white sm:py-20 ${heroImageUrl ? 'bg-black' : 'bg-emerald-900'}`}>
        {heroImageUrl && <img src={heroImageUrl} alt={`${project.title} project activity`} className="absolute inset-0 z-0 h-full w-full object-cover" />}
        {heroImageUrl && <div className="absolute inset-0 z-10 bg-black/55" />}
        <div className="relative z-20 mx-auto max-w-5xl">
          <Link href="/projects" className="text-sm font-semibold text-emerald-200 hover:text-white">← All projects</Link>
          <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">{project.program.name}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
          <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-8 text-emerald-100">{project.description}</p>
          <p className="mt-6 text-sm font-semibold text-emerald-200">{project.location}</p>
        </div>
      </section>
      {impactMetrics.length > 0 && <section className="border-b border-emerald-100 bg-emerald-50/70 px-6 py-12 sm:py-16"><div className="mx-auto max-w-5xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Project impact</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-emerald-950">Results from {project.title}</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{impactMetrics.map((metric) => <article key={metric.id} className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"><p className="text-3xl font-bold tracking-tight text-emerald-800">{metric.value}</p><h3 className="mt-2 text-sm font-bold text-slate-900">{metric.title}</h3>{metric.description && <p className="mt-2 text-sm leading-6 text-slate-600">{metric.description}</p>}<p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">{metric.year}</p></article>)}</div></div></section>}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Stories of change</p><h2 className="mt-2 text-2xl font-bold">Community voices</h2>{project.stories.length ? <div className="mt-5 space-y-4">{project.stories.map((story) => <article key={story.id} className="rounded-xl bg-emerald-50 p-5"><h3 className="font-bold">{story.headline}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{story.outcome}</p><p className="mt-3 text-sm font-semibold text-emerald-800">{story.personName}</p></article>)}</div> : <p className="mt-5 text-slate-600">Stories from this project will be shared soon.</p>}<Link href={`/projects/${project.slug}/stories`} className="mt-5 inline-block text-sm font-semibold text-emerald-800 hover:underline">View project stories →</Link></div>
        {(project.gallery.length > 0 || project.reports.length > 0) && <div className="mt-16 grid gap-10 border-t border-slate-200 pt-12 lg:grid-cols-2"><div><h2 className="text-2xl font-bold">Project gallery</h2>{project.gallery.length ? <div className="mt-5 grid grid-cols-2 gap-3">{project.gallery.map((item) => <img key={item.id} src={item.imageUrl} alt={item.caption ?? `Photo from ${project.title}`} className="h-36 w-full rounded-lg object-cover" />)}</div> : <p className="mt-4 text-slate-600">Photos will be added soon.</p>}<Link href={`/projects/${project.slug}/gallery`} className="mt-5 inline-block text-sm font-semibold text-emerald-800 hover:underline">View project gallery →</Link></div><div><h2 className="text-2xl font-bold">Reports and resources</h2>{project.reports.length ? <div className="mt-5 space-y-3">{project.reports.map((report) => <a key={report.id} href={report.fileUrl} className="block rounded-lg border border-slate-200 p-4 hover:border-emerald-300"><p className="font-semibold">{report.title}</p><p className="mt-1 text-sm text-slate-600">{report.category} · {report.year}</p></a>)}</div> : <p className="mt-4 text-slate-600">Project resources will be added soon.</p>}</div></div>}
      </section>
    </div>
  );
}
