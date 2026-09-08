import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

const money = (amount: number, currency: string) => `${currency} ${amount.toLocaleString('en-UG')}`;

export default async function AdminPartnersPage() {
  await requireAdmin();
  const today = new Date();
  const deadlineWindowEnd = new Date(today);
  deadlineWindowEnd.setDate(today.getDate() + 30);
  const [partners, openFunding, dueSoon] = await Promise.all([
    prisma.partner.findMany({ include: { _count: { select: { contacts: true, fundingCommitments: true } } }, orderBy: { organizationName: 'asc' } }),
    prisma.fundingCommitment.findMany({ where: { status: { in: ['prospect', 'submitted', 'pledged'] } }, select: { amount: true, currency: true } }),
    prisma.fundingCommitment.count({ where: { deadline: { gte: today, lte: deadlineWindowEnd }, status: { notIn: ['declined', 'completed'] } } }),
  ]);
  const openTotal = openFunding.reduce((sum, commitment) => sum + commitment.amount, 0);
  const currency = openFunding[0]?.currency ?? 'UGX';
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-green-800">Fundraising workspace</p><h1 className="mt-1 text-2xl font-bold">Partners & CRM</h1><p className="mt-2 text-sm text-gray-500">Manage organisations, relationships, funding opportunities and their project connections.</p></div><Link href="/admin/partners/new" className="rounded bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900">+ Add organisation</Link></div><div className="grid gap-4 sm:grid-cols-3"><article className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-2xl font-bold text-green-800">{partners.length}</p><p className="mt-1 text-sm text-gray-500">Organisations in CRM</p></article><article className="rounded-xl border border-gray-200 bg-white p-5"><p className="text-2xl font-bold text-green-800">{money(openTotal, currency)}</p><p className="mt-1 text-sm text-gray-500">Open funding pipeline</p></article><article className="rounded-xl border border-gray-200 bg-white p-5"><p className={`text-2xl font-bold ${dueSoon ? 'text-amber-700' : 'text-green-800'}`}>{dueSoon}</p><p className="mt-1 text-sm text-gray-500">Deadlines in the next 30 days</p></article></div><div className="overflow-hidden rounded-xl border border-gray-200 bg-white"><table className="w-full text-sm"><thead><tr className="bg-gray-50 text-left text-xs uppercase text-gray-500"><th className="px-4 py-3">Organisation</th><th className="px-4 py-3">Relationship</th><th className="px-4 py-3">Contacts</th><th className="px-4 py-3">Funding records</th><th className="px-4 py-3" /></tr></thead><tbody>{partners.map((partner) => <tr key={partner.id} className="border-t border-gray-100"><td className="px-4 py-3"><p className="font-semibold">{partner.organizationName}</p><p className="mt-0.5 text-xs text-gray-400">{partner.website ?? 'No website recorded'}</p></td><td className="px-4 py-3 text-gray-600">{partner.partnershipType}</td><td className="px-4 py-3 text-gray-600">{partner._count.contacts}</td><td className="px-4 py-3 text-gray-600">{partner._count.fundingCommitments}</td><td className="px-4 py-3 text-right"><Link href={`/admin/partners/${partner.id}/edit`} className="font-semibold text-green-800 hover:underline">Open CRM</Link></td></tr>)}</tbody></table>{!partners.length && <p className="p-8 text-center text-sm text-gray-500">No organisations yet. Add a donor, grant-maker, or delivery partner to begin.</p>}</div></div>;
}
