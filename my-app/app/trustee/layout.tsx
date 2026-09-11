import Link from 'next/link';
import { requireTrustee } from '@/lib/auth';

const links = [
  ['/', 'Overview'],
  ['/programs', 'Programs'],
  ['/projects', 'Projects'],
  ['/financial', 'Financial Overview'],
  ['/reports', 'Reports'],
  ['/impact', 'Impact Metrics'],
] as const;

export default async function TrusteeLayout({ children }: { children: React.ReactNode }) {
  const user = await requireTrustee();
  return <div className="flex min-h-screen bg-slate-50"><aside className="w-64 shrink-0 bg-teal-950 py-5 text-teal-50"><div className="border-b border-teal-800 px-5 pb-4"><p className="text-lg font-bold">🌿 Eco Warriors</p><span className="mt-3 inline-flex rounded-full bg-teal-700 px-2.5 py-1 text-[11px] font-bold tracking-wider text-teal-50">TRUSTEE</span></div><nav className="mt-5">{links.map(([href, label]) => <Link key={href} href={`/trustee${href}`} className="flex items-center justify-between px-5 py-3 text-sm font-medium text-teal-100 hover:bg-teal-900 hover:text-white"><span>{label}</span><span className="text-[10px] uppercase tracking-wide text-teal-400">View only</span></Link>)}</nav></aside><main className="min-w-0 flex-1"><header className="flex items-center justify-between border-b border-slate-200 bg-white px-7 py-4"><div><p className="text-lg font-bold text-slate-900">Trustee portal</p><p className="text-xs text-teal-700">Read-only governance view</p></div><p className="text-sm text-slate-500">Signed in as <b className="text-teal-800">{user.name}</b></p></header><div className="p-7">{children}</div></main></div>;
}
