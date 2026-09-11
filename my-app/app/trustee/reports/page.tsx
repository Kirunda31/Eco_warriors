import { prisma } from '@/lib/prisma';
import { requireTrustee } from '@/lib/auth';

export default async function TrusteeReportsPage() {
  await requireTrustee();
  const reports = await prisma.report.findMany({ include: { project: { select: { title: true, program: { select: { name: true } } } } }, orderBy: [{ year: 'desc' }, { title: 'asc' }] });
  return <div><p className="text-sm font-semibold text-teal-700">Read-only library</p><h1 className="mt-1 text-2xl font-bold">Reports</h1><div className="mt-6 overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm"><thead><tr className="bg-slate-50 text-left text-xs uppercase text-slate-500"><th className="px-4 py-3">Report</th><th className="px-4 py-3">Project / program</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Year</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{reports.map(report => <tr key={report.id} className="border-t"><td className="px-4 py-3"><a href={report.fileUrl} className="font-medium text-teal-800 hover:underline">{report.title}</a></td><td className="px-4 py-3 text-slate-600">{report.project ? `${report.project.program.name} · ${report.project.title}` : 'Organisation-wide'}</td><td className="px-4 py-3">{report.category}</td><td className="px-4 py-3">{report.year}</td><td className="px-4 py-3 capitalize">{report.status}</td></tr>)}</tbody></table></div></div>;
}
