import { prisma } from '@/lib/prisma';
import { isProgramManager, requireStaff } from '@/lib/auth';

export default async function AdminDashboard() {
  const user = await requireStaff();
  const programWhere = isProgramManager(user) ? { managerId: user.id } : {};
  const projectWhere = isProgramManager(user) ? { program: { managerId: user.id } } : {};
  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [programCount, projectCount, unreadMessages, pendingVolunteers, publishedImpactCount, newsletterCount, donationInterestCount, upcomingEventCount, viewsToday, viewsLast7Days, topPages] = await Promise.all([
    prisma.program.count({ where: programWhere }),
    prisma.project.count({ where: projectWhere }),
    isProgramManager(user) ? 0 : prisma.contactMessage.count({ where: { status: 'unread' } }),
    isProgramManager(user) ? 0 : prisma.volunteer.count({ where: { status: 'applicant' } }),
    isProgramManager(user) ? 0 : prisma.impactMetric.count({ where: { status: 'published' } }),
    isProgramManager(user) ? 0 : prisma.contactMessage.count({ where: { category: 'Newsletter' } }),
    isProgramManager(user) ? 0 : prisma.contactMessage.count({ where: { category: 'Donation' } }),
    isProgramManager(user) ? 0 : prisma.event.count({ where: { date: { gte: new Date() } } }),
    isProgramManager(user) ? null : prisma.siteVisitDaily.aggregate({ where: { day: today }, _sum: { pageViews: true } }),
    isProgramManager(user) ? null : prisma.siteVisitDaily.aggregate({ where: { day: { gte: sevenDaysAgo } }, _sum: { pageViews: true } }),
    isProgramManager(user) ? [] : prisma.siteVisitDaily.groupBy({
      by: ['path'],
      where: { day: { gte: sevenDaysAgo } },
      _sum: { pageViews: true },
      orderBy: { _sum: { pageViews: 'desc' } },
      take: 5,
    }),
  ]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-800">{programCount}</p>
          <p className="text-sm text-gray-500 mt-1">Programs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-800">{projectCount}</p>
          <p className="text-sm text-gray-500 mt-1">Projects</p>
        </div>
        {!isProgramManager(user) && <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-800">{unreadMessages}</p>
          <p className="text-sm text-gray-500 mt-1">Unread Messages</p>
        </div>}
        {!isProgramManager(user) && <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-bold text-green-800">{pendingVolunteers}</p>
          <p className="text-sm text-gray-500 mt-1">Pending Volunteers</p>
        </div>}
      </div>

      {!isProgramManager(user) && <>
        <h2 className="text-base font-bold mb-3">Website visits</h2>
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Website page views">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-2xl font-bold text-green-800">{viewsToday?._sum.pageViews ?? 0}</p>
            <p className="mt-1 text-sm text-gray-500">Page views today</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-2xl font-bold text-green-800">{viewsLast7Days?._sum.pageViews ?? 0}</p>
            <p className="mt-1 text-sm text-gray-500">Page views, last 7 days</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:col-span-2 lg:col-span-1">
            <p className="text-sm font-semibold text-gray-700">Most viewed pages · 7 days</p>
            {topPages.length ? <ol className="mt-2 space-y-1">{topPages.map((page) => <li key={page.path} className="flex justify-between gap-3 text-sm"><span className="min-w-0 truncate text-gray-600">{page.path}</span><span className="shrink-0 font-semibold text-green-800">{page._sum.pageViews ?? 0}</span></li>)}</ol> : <p className="mt-2 text-sm text-gray-500">No visits recorded yet.</p>}
          </div>
        </section>
        <h2 className="text-base font-bold mb-3">Engagement at a glance</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <a href="/admin/impact" className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-700"><p className="text-2xl font-bold text-green-800">{publishedImpactCount}</p><p className="mt-1 text-sm text-gray-500">Published impact metrics</p></a>
          <a href="/admin/messages" className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-700"><p className="text-2xl font-bold text-green-800">{newsletterCount}</p><p className="mt-1 text-sm text-gray-500">Newsletter subscribers</p></a>
          <a href="/admin/messages" className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-700"><p className="text-2xl font-bold text-green-800">{donationInterestCount}</p><p className="mt-1 text-sm text-gray-500">Donation enquiries</p></a>
          <a href="/admin/events" className="rounded-lg border border-gray-200 bg-white p-4 hover:border-green-700"><p className="text-2xl font-bold text-green-800">{upcomingEventCount}</p><p className="mt-1 text-sm text-gray-500">Upcoming events</p></a>
        </div>
      </>}

      <h2 className="text-base font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-3 gap-3">
        {!isProgramManager(user) && <a href="/admin/programs/new" className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:border-green-700">
          <span className="text-xl bg-green-50 w-9 h-9 rounded-lg flex items-center justify-center">🎯</span>
          <span className="font-semibold text-sm">+ New Program</span>
        </a>}
        <a href="/admin/projects/new" className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:border-green-700">
          <span className="text-xl bg-green-50 w-9 h-9 rounded-lg flex items-center justify-center">📁</span>
          <span className="font-semibold text-sm">+ New Project</span>
        </a>
        <a href="/admin/stories/new" className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3 hover:border-green-700">
          <span className="text-xl bg-green-50 w-9 h-9 rounded-lg flex items-center justify-center">💬</span>
          <span className="font-semibold text-sm">+ New Story</span>
        </a>
      </div>
    </div>
  );
}
