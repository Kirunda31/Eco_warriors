import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireStaff, isProgramManager } from '@/lib/auth';

export default async function AdminReportsPage() {
  const user = await requireStaff();
  const reports = await prisma.report.findMany({ where: isProgramManager(user) ? { project: { is: { program: { managerId: user.id } } } } : {}, orderBy: { year: 'desc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Reports</h1>
        <Link href="/admin/reports/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">+ New Report</Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{report.title}</td>
                <td className="px-4 py-3 text-gray-500">{report.category}</td>
                <td className="px-4 py-3 text-gray-500">{report.year}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/reports/${report.id}/edit`} className="text-green-800 font-medium hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
