import { prisma } from '@/lib/prisma';
import { requireTrustee } from '@/lib/auth';

export default async function TrusteeImpactPage() {
  await requireTrustee();
  const metrics = await prisma.impactMetric.findMany({ orderBy: [{ year: 'desc' }, { title: 'asc' }] });
  return <div><p className="text-sm font-semibold text-teal-700">Read-only performance record</p><h1 className="mt-1 text-2xl font-bold">Impact metrics</h1><div className="mt-6 overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm"><thead><tr className="bg-slate-50 text-left text-xs uppercase text-slate-500"><th className="px-4 py-3">Metric</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Program / project</th><th className="px-4 py-3">Year</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{metrics.map(metric => <tr key={metric.id} className="border-t"><td className="px-4 py-3"><p className="font-medium">{metric.title}</p>{metric.description && <p className="mt-1 text-xs text-slate-500">{metric.description}</p>}</td><td className="px-4 py-3 font-semibold text-teal-800">{metric.value}</td><td className="px-4 py-3 text-slate-600">{[metric.program, metric.project].filter(Boolean).join(' · ') || 'Organisation-wide'}</td><td className="px-4 py-3">{metric.year}</td><td className="px-4 py-3 capitalize">{metric.status}</td></tr>)}</tbody></table></div></div>;
}
