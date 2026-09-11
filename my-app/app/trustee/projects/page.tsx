import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireTrustee } from '@/lib/auth';

export default async function TrusteeProjectsPage() {
  await requireTrustee();
  const projects = await prisma.project.findMany({ include: { program: { select: { name: true } }, milestones: { select: { budget: true } } }, orderBy: { title: 'asc' } });
  return <div><p className="text-sm font-semibold text-teal-700">Read-only register</p><h1 className="mt-1 text-2xl font-bold">Projects</h1><div className="mt-6 overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm"><thead><tr className="bg-slate-50 text-left text-xs uppercase text-slate-500"><th className="px-4 py-3">Project</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Budget</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr></thead><tbody>{projects.map(p => <tr key={p.id} className="border-t"><td className="px-4 py-3 font-medium">{p.title}</td><td className="px-4 py-3">{p.program.name}</td><td className="px-4 py-3">UGX {p.milestones.reduce((sum, item) => sum + item.budget, 0).toLocaleString('en-UG')}</td><td className="px-4 py-3 capitalize">{p.status}</td><td className="px-4 py-3 text-right"><Link href={`/trustee/projects/${p.id}`} className="font-semibold text-teal-800 hover:underline">View detail</Link></td></tr>)}</tbody></table></div></div>;
}
