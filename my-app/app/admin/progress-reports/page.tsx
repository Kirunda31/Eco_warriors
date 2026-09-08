import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { isProgramManager, requireStaff } from '@/lib/auth';

export default async function ProgressReportsPage() {
  const user = await requireStaff();
  const reports = await prisma.projectProgressReport.findMany({
    where: isProgramManager(user) ? { project: { program: { managerId: user.id } } } : {},
    include: { project: { select: { title: true, program: { select: { name: true } } } }, submittedBy: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return <div>
    <div className="mb-5 flex items-center justify-between"><div><h1 className="text-lg font-bold">Project progress reports</h1><p className="mt-1 text-sm text-gray-500">Internal implementation updates for projects and programme oversight.</p></div><Link href="/admin/progress-reports/new" className="rounded bg-green-800 px-4 py-2 text-sm text-white hover:bg-green-900">+ Submit update</Link></div>
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left text-xs uppercase text-gray-500"><th className="px-4 py-3">Period</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Submitted by</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3" /></tr></thead><tbody>{reports.map((report) => <tr key={report.id} className="border-t border-gray-100"><td className="px-4 py-3 font-medium">{report.reportingPeriod}</td><td className="px-4 py-3 text-gray-600"><p>{report.project.title}</p><p className="text-xs text-gray-400">{report.project.program.name}</p></td><td className="px-4 py-3 text-gray-600">{report.submittedBy.name}</td><td className="px-4 py-3 text-gray-600">{report.createdAt.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}</td><td className="px-4 py-3 text-right"><Link href={`/admin/progress-reports/${report.id}/edit`} className="font-medium text-green-800 hover:underline">View / edit</Link></td></tr>)}</tbody></table></div>
    {!reports.length && <p className="mt-4 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No progress reports yet. Submit the first implementation update.</p>}
  </div>;
}
