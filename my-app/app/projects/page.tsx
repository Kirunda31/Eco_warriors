import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ where: { status: 'active' }, include: { program: true }, orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <section className="bg-amber-50 px-6 py-16 sm:py-20"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Our work in action</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Projects creating local change.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Explore the initiatives we are delivering with communities across Uganda.</p></div></section>
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20"><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Link href={`/projects/${project.slug}`}>
            <h2 className="text-xl font-bold text-emerald-900 hover:underline">{project.title}</h2>
          </Link>
          <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
          <div className="mt-5 flex justify-between text-xs font-semibold uppercase tracking-wide text-slate-500"><span>{project.program.name}</span><span>{project.location}</span></div>
        </article>
      ))}
      </div>{projects.length === 0 && <p className="text-slate-600">Project information will be available soon.</p>}</section>
    </div>
  );
}
