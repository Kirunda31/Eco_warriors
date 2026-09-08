import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const program = await prisma.program.findUnique({
    where: { slug },
    include: { projects: { where: { status: 'active' }, orderBy: { createdAt: 'desc' } } },
  });

  if (!program) {
    notFound();
  }

  return (
    <div>
      <section className={`relative overflow-hidden px-6 py-16 text-white sm:py-20 ${program.heroImageUrl ? 'bg-black' : 'bg-emerald-900'}`}>
        {program.heroImageUrl && <img src={program.heroImageUrl} alt={`${program.name} program activity`} className="absolute inset-0 z-0 h-full w-full object-cover" />}
        {program.heroImageUrl && <div className="absolute inset-0 z-10 bg-black/55" />}
        <div className="relative z-20 mx-auto max-w-5xl"><Link href="/programs" className="text-sm font-semibold text-emerald-200 hover:text-white">← All programs</Link><p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Program area</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{program.name}</h1><p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-8 text-emerald-100">{program.description}</p></div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <div className="rounded-xl bg-amber-50 p-7"><p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-800">Our goal</p><p className="mt-3 text-xl font-semibold leading-8 text-slate-800">{program.goal}</p></div>
        <div className="mt-14"><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Related work</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Projects in this program</h2>
          {program.projects.length ? <div className="mt-7 grid gap-5 md:grid-cols-2">{program.projects.map((project) => <Link key={project.id} href={`/projects/${project.slug}`} className="rounded-xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-md"><h3 className="text-lg font-bold text-emerald-900">{project.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{project.location}</p></Link>)}</div> : <p className="mt-5 text-slate-600">Projects in this program will be added soon.</p>}
        </div>
      </section>
    </div>
  );
}
