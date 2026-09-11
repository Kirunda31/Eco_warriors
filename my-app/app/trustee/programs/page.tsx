import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireTrustee } from '@/lib/auth';

export default async function TrusteeProgramsPage() {
  await requireTrustee();
  const programs = await prisma.program.findMany({ include: { _count: { select: { projects: true } }, manager: { select: { name: true } } }, orderBy: { name: 'asc' } });
  return <div><p className="text-sm font-semibold text-teal-700">Read-only register</p><h1 className="mt-1 text-2xl font-bold">Programs</h1><div className="mt-6 overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm"><thead><tr className="bg-slate-50 text-left text-xs uppercase text-slate-500"><th className="px-4 py-3">Program</th><th className="px-4 py-3">Manager</th><th className="px-4 py-3">Projects</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{programs.map(program => <tr key={program.id} className="border-t"><td className="px-4 py-3"><Link href={`/programs/${program.slug}`} className="font-medium text-teal-800 hover:underline">{program.name}</Link></td><td className="px-4 py-3 text-slate-600">{program.manager?.name ?? 'Unassigned'}</td><td className="px-4 py-3">{program._count.projects}</td><td className="px-4 py-3 capitalize">{program.status}</td></tr>)}</tbody></table></div></div>;
}
