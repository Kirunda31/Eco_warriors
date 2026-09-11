import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireTrustee } from '@/lib/auth';

const money = (amount: number) => `UGX ${amount.toLocaleString('en-UG')}`;

export default async function TrusteeOverviewPage() {
  await requireTrustee();
  const [activeBudget, programCount, activeProjectCount, projects] = await Promise.all([
    prisma.milestone.aggregate({ where: { project: { status: 'active' } }, _sum: { budget: true } }),
    prisma.program.count(),
    prisma.project.count({ where: { status: 'active' } }),
    prisma.project.findMany({ include: { program: { select: { name: true } }, milestones: { select: { budget: true } } }, orderBy: { title: 'asc' } }),
  ]);
  return <div className="space-y-7"><div><p className="text-sm font-semibold text-teal-700">Governance overview</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Organisation at a glance</h1><p className="mt-2 text-sm text-slate-500">Read-only access to current programme, project, and financial planning data.</p></div><div className="grid gap-4 sm:grid-cols-3"><article className="rounded-xl border border-teal-100 bg-white p-5"><p className="text-2xl font-bold text-teal-800">{money(activeBudget._sum.budget ?? 0)}</p><p className="mt-1 text-sm text-slate-500">Active project milestone budget</p></article><article className="rounded-xl border border-teal-100 bg-white p-5"><p className="text-2xl font-bold text-teal-800">{programCount}</p><p className="mt-1 text-sm text-slate-500">Programs</p></article><article className="rounded-xl border border-teal-100 bg-white p-5"><p className="text-2xl font-bold text-teal-800">{activeProjectCount}</p><p className="mt-1 text-sm text-slate-500">Active projects</p></article></div><section className="overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">All projects</h2></div><table className="w-full text-sm"><thead><tr className="bg-slate-50 text-left text-xs uppercase text-slate-500"><th className="px-4 py-3">Project</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Total budget</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr></thead><tbody>{projects.map(project => { const budget = project.milestones.reduce((sum, milestone) => sum + milestone.budget, 0); return <tr key={project.id} className="border-t border-slate-100"><td className="px-4 py-3 font-medium">{project.title}</td><td className="px-4 py-3 text-slate-600">{project.program.name}</td><td className="px-4 py-3 text-slate-600">{money(budget)}</td><td className="px-4 py-3"><span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize text-teal-800">{project.status}</span></td><td className="px-4 py-3 text-right"><Link href={`/trustee/projects/${project.id}`} className="font-semibold text-teal-800 hover:underline">View Full Detail</Link></td></tr>; })}</tbody></table>{!projects.length && <p className="p-6 text-center text-sm text-slate-500">No projects recorded.</p>}</section></div>;
}
