import { requireStaff } from '@/lib/auth';
import Link from 'next/link';
import MobileAdminMenu from '@/app/components/MobileAdminMenu';

const managerLinks = [['/admin', '📊 Dashboard'], ['/admin/implementation', '📈 Impact dashboard'], ['/admin/delivery', '📦 Delivery records'], ['/admin/beneficiaries', '🏫 Beneficiaries'], ['/admin/documents', '📚 Documents'], ['/admin/reminders', '🔔 Reminders'], ['/admin/programs', '🎯 My program'], ['/admin/projects', '📁 Projects'], ['/admin/progress-reports', '📝 Progress reports'], ['/admin/stories', '💬 Stories'], ['/admin/gallery', '🖼️ Gallery'], ['/admin/reports', '📄 Reports']] as const;
const adminGroups = [
  ['Overview', [['/admin', '📊 Dashboard'], ['/admin/implementation', '📈 Impact dashboard'], ['/admin/approvals', '✅ Approvals'], ['/admin/reminders', '🔔 Reminders']]],
  ['Programs & delivery', [['/admin/programs', '🎯 Programs'], ['/admin/projects', '📁 Projects'], ['/admin/delivery', '📦 Delivery records'], ['/admin/beneficiaries', '🏫 Beneficiaries'], ['/admin/progress-reports', '📝 Progress reports'], ['/admin/documents', '📚 Document library']]],
  ['Relationships', [['/admin/partners', '🤝 Partners & CRM'], ['/admin/volunteers', '🙋 Volunteers'], ['/admin/messages', '✉️ Messages']]],
  ['Public content', [['/admin/stories', '💬 Stories'], ['/admin/gallery', '🖼️ Gallery'], ['/admin/reports', '📄 Reports'], ['/admin/news', '📰 News'], ['/admin/events', '📅 Events'], ['/admin/impact', '📈 Impact metrics'], ['/admin/leadership', '👤 Leadership']]],
  ['System', [['/admin/users', '👥 Users']]],
] as const;

function NavLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="flex min-h-11 items-center px-5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-green-300">{children}</Link>; }

function NavigationSections({ groups }: { groups: readonly (readonly [string, readonly (readonly [string, string])[]])[] }) {
  return <>{groups.map(([title, links]) => <section key={title} className="mt-5"><h4 className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{title}</h4>{links.map(([href, label]) => <NavLink key={href} href={href}>{label}</NavLink>)}</section>)}</>;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff(); const groups = user.role === 'manager' ? [['My program', managerLinks]] as const : adminGroups;
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="hidden shrink-0 bg-gray-900 py-5 md:block md:w-56 lg:w-60 xl:w-64">
        <div className="border-b border-gray-800 px-5 pb-4 text-lg font-bold text-white">🌿 Eco Warriors</div>
        <NavigationSections groups={groups} />
      </aside>
      <main className="flex min-w-0 flex-1 flex-col bg-gray-50">
        <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b bg-white px-4 py-3 sm:px-6 md:static md:px-7 md:py-4">
          <div className="flex items-center gap-3">
            <MobileAdminMenu>
                <div className="border-b border-gray-800 px-5 pb-4 text-lg font-bold text-white">🌿 Eco Warriors</div>
                <NavigationSections groups={groups} />
            </MobileAdminMenu>
            <h1 className="text-base font-bold sm:text-lg">{user.role === 'manager' ? 'My program' : 'Admin'}</h1>
          </div>
          <p className="ml-auto max-w-[45vw] truncate text-xs text-gray-500 sm:max-w-none sm:text-sm">Logged in as <b className="text-green-800">{user.name}</b></p>
        </header>
        <div className="min-w-0 p-4 sm:p-6 lg:p-7">{children}</div>
      </main>
    </div>
  );
}
