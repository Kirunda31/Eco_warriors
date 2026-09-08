import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({ orderBy: { name: 'asc' } });

  return (
    <div>
      <section className="bg-emerald-900 px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">Our work</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Programs rooted in community.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-emerald-100">Our programs bring together climate action, health, education, and sustainable livelihoods.</p></div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <article key={program.id} className="rounded-xl border border-slate-200 p-6 shadow-sm">
          <Link href={`/programs/${program.slug}`}>
            <h2 className="text-xl font-bold text-emerald-900 hover:underline">{program.name}</h2>
          </Link>
          <p className="mt-3 leading-7 text-slate-600">{program.description}</p>
          <Link href={`/programs/${program.slug}`} className="mt-5 inline-block text-sm font-semibold text-emerald-800 hover:underline">Explore program →</Link>
        </article>
      ))}
      </div>
      {programs.length === 0 && <p className="text-slate-600">Program information will be available soon.</p>}
      </section>
    </div>
  );
}
