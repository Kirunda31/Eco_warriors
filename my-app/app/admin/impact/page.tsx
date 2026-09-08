import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminImpactPage() {
  await requireAdmin();
  const metrics = await prisma.impactMetric.findMany({ orderBy: [{ year: 'desc' }, { createdAt: 'asc' }] });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Impact Metrics</h1>
        <Link href="/admin/impact/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">+ New Metric</Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{metric.title}</td>
                <td className="px-4 py-3 text-gray-500 font-semibold">{metric.value}</td>
                <td className="max-w-48 truncate px-4 py-3 text-gray-500" title={metric.project ?? undefined}>{metric.project ?? 'Organisation-wide'}</td>
                <td className="px-4 py-3 text-gray-500">{metric.year}</td>
                <td className="max-w-56 truncate px-4 py-3 text-gray-500" title={metric.source ?? undefined}>{metric.source ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${metric.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {metric.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/impact/${metric.id}/edit`} className="text-green-800 font-medium hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {metrics.length === 0 && <p className="mt-4 text-sm text-gray-500">No impact metrics have been added yet. Use “New Metric” to publish a result to the public website.</p>}
    </div>
  );
}
