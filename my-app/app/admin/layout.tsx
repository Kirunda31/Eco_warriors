import { requireStaff } from '@/lib/auth';
import Link from 'next/link';

const managerLinks = [['/admin', '📊 Dashboard'], ['/admin/implementation', '📈 Impact dashboard'], ['/admin/delivery', '📦 Delivery records'], ['/admin/beneficiaries', '🏫 Beneficiaries'], ['/admin/documents', '📚 Documents'], ['/admin/reminders', '🔔 Reminders'], ['/admin/programs', '🎯 My program'], ['/admin/projects', '📁 Projects'], ['/admin/progress-reports', '📝 Progress reports'], ['/admin/stories', '💬 Stories'], ['/admin/gallery', '🖼️ Gallery'], ['/admin/reports', '📄 Reports']] as const;
const adminGroups = [
  ['Overview', [['/admin', '📊 Dashboard'], ['/admin/implementation', '📈 Impact dashboard'], ['/admin/approvals', '✅ Approvals'], ['/admin/reminders', '🔔 Reminders']]],
  ['Programs & delivery', [['/admin/programs', '🎯 Programs'], ['/admin/projects', '📁 Projects'], ['/admin/delivery', '📦 Delivery records'], ['/admin/beneficiaries', '🏫 Beneficiaries'], ['/admin/progress-reports', '📝 Progress reports'], ['/admin/documents', '📚 Document library']]],
  ['Relationships', [['/admin/partners', '🤝 Partners & CRM'], ['/admin/volunteers', '🙋 Volunteers'], ['/admin/messages', '✉️ Messages']]],
  ['Public content', [['/admin/stories', '💬 Stories'], ['/admin/gallery', '🖼️ Gallery'], ['/admin/reports', '📄 Reports'], ['/admin/news', '📰 News'], ['/admin/events', '📅 Events'], ['/admin/impact', '📈 Impact metrics'], ['/admin/leadership', '👤 Leadership']]],
  ['System', [['/admin/users', '👥 Users']]],
] as const;

function NavLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="block px-5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">{children}</Link>; }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff(); const groups = user.role === 'manager' ? [['My program', managerLinks]] as const : adminGroups;
  return <div className="flex min-h-screen"><aside className="w-64 shrink-0 bg-gray-900 py-5"><div className="border-b border-gray-800 px-5 pb-4 text-lg font-bold text-white">🌿 Eco Warriors</div>{groups.map(([title, links]) => <section key={title} className="mt-5"><h4 className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{title}</h4>{links.map(([href, label]) => <NavLink key={href} href={href}>{label}</NavLink>)}</section>)}</aside><main className="flex-1 bg-gray-50"><header className="flex items-center justify-between border-b bg-white px-7 py-4"><h1 className="text-lg font-bold">{user.role === 'manager' ? 'My program' : 'Admin'}</h1><p className="text-sm text-gray-500">Logged in as <b className="text-green-800">{user.name}</b></p></header><div className="p-7">{children}</div></main></div>;
}
