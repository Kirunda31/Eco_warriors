import { prisma } from '@/lib/prisma';
import { isProgramManager, requireStaff } from '@/lib/auth';

export default async function AdminDashboard() {
  const user = await requireStaff();
  const programWhere = isProgramManager(user) ? { managerId: user.id } : {};
  const projectWhere = isProgramManager(user) ? { program: { managerId: user.id } } : {};
  const [programCount, projectCount, unreadMessages, pendingVolunteers, publishedImpactCount, newsletterCount, donationInterestCount, upcomingEventCount] = await Promise.all([
    prisma.program.count({ where: programWhere }),
    prisma.project.count({ where: projectWhere }),
    isProgramManager(user) ? 0 : prisma.contactMessage.count({ where: { status: 'unread' } }),
    isProgramManager(user) ? 0 : prisma.volunteer.count({ where: { status: 'applicant' } }),
    isProgramManager(user) ? 0 : prisma.impactMetric.count({ where: { status: 'published' } }),
    isProgramManager(user) ? 0 : prisma.contactMessage.count({ where: { category: 'Newsletter' } }),
    isProgramManager(user) ? 0 : prisma.contactMessage.count({ where: { category: 'Donation' } }),
    isProgramManager(user) ? 0 : prisma.event.count({ where: { date: { gte: new Date() } } }),
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
