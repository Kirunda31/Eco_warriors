import { prisma } from '@/lib/prisma';

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    where: { OR: [{ projectId: null }, { project: { is: { status: 'active' } } }] },
    orderBy: { year: 'desc' },
  });

  return <div><section className="bg-slate-100 px-6 py-16 sm:py-20"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Transparency and learning</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Reports and resources.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Explore our annual reports, plans, and project documentation.</p></div></section><section className="mx-auto max-w-5xl px-6 py-16 sm:py-20"><div className="flex flex-col gap-5">
        {reports.map((report) => (
          <article key={report.id} className="rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="mt-1 text-sm font-medium text-emerald-700">{report.category} · {report.year}</p><p className="mt-3 leading-7 text-slate-600">{report.description}</p>
            <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block font-semibold text-emerald-800 hover:underline">Download report →</a>
          </article>
        ))}
      </div>{reports.length === 0 && <p className="text-slate-600">Reports will be published here soon.</p>}</section></div>;
}
