import { prisma } from '@/lib/prisma';
import { requireStaff } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();

  if (user.role === 'manager') {
    return <div className="flex min-h-screen"><aside className="w-60 bg-gray-900 text-gray-300 py-5 flex-shrink-0"><div className="text-white font-bold px-5 pb-4 mb-4 border-b border-gray-800">🌿 Eco Warriors</div><div className="mb-5"><h4 className="text-[11px] uppercase tracking-wider text-gray-500 px-5 mb-2">My Program</h4><Link href="/admin" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">📊 Dashboard</Link><Link href="/admin/implementation" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">📈 Impact dashboard</Link><Link href="/admin/programs" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">🎯 My Program</Link><Link href="/admin/projects" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">📁 Projects</Link><Link href="/admin/progress-reports" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">📝 Progress reports</Link><Link href="/admin/stories" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">💬 Stories</Link><Link href="/admin/gallery" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">🖼️ Gallery</Link><Link href="/admin/reports" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">📄 Reports</Link></div></aside><main className="flex-1 bg-gray-50"><div className="flex items-center justify-between bg-white px-7 py-4 border-b border-gray-200"><h1 className="text-lg font-bold">My Program</h1><p className="text-sm text-gray-500">Logged in as <strong className="text-green-800">{user.name}</strong></p></div><div className="p-7">{children}</div></main></div>;
  }

  const [programCount, projectCount, storyCount, galleryCount, reportCount, newsCount, eventCount, partnerCount, leaderCount, impactCount, volunteerCount, messageCount, userCount] = await Promise.all([
  prisma.program.count(),
  prisma.project.count(),
  prisma.story.count(),
  prisma.galleryItem.count(),
  prisma.report.count(),
  prisma.news.count(),
  prisma.event.count(),
  prisma.partner.count(),
  prisma.leader.count(),
  prisma.impactMetric.count(),
  prisma.volunteer.count(),
  prisma.contactMessage.count(),
  prisma.user.count(),
]);

  return (
  
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-900 text-gray-300 py-5 flex-shrink-0">
        <div className="text-white font-bold px-5 pb-4 mb-4 border-b border-gray-800">
          🌿 Eco Warriors Admin
        </div>
    
        <div className="mb-5">
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 px-5 mb-2">Overview</h4>
          <Link href="/admin" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            📊 Dashboard
          </Link>
        </div>

          <div className="mb-5">
  <h4 className="text-[11px] uppercase tracking-wider text-gray-500 px-5 mb-2">System</h4>
  <Link href="/admin/users" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
    👥 Users <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{userCount}</span>
  </Link>
  </div>
  
        <div className="mb-5">
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 px-5 mb-2">Programs & Work</h4>
          <Link href="/admin/programs" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            🎯 Programs <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{programCount}</span>
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            📁 Projects <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{projectCount}</span>
          </Link>
          <Link href="/admin/implementation" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">📈 Impact dashboard</Link>
          <Link href="/admin/progress-reports" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">📝 Progress reports</Link>
        </div>

        <div className="mb-5">
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 px-5 mb-2">Content</h4>
          <Link href="/admin/stories" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            💬 Stories <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{storyCount}</span>
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            🖼️ Gallery <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{galleryCount}</span>
          </Link>
          <Link href="/admin/reports" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            📄 Reports <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{reportCount}</span>
          </Link>
          <Link href="/admin/news" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            📰 News <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{newsCount}</span>
          </Link>
          <Link href="/admin/events" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            📅 Events <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{eventCount}</span>
          </Link>
        </div>

        <div className="mb-5">
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 px-5 mb-2">Organization</h4>
          <Link href="/admin/partners" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            🤝 Partners & CRM <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{partnerCount}</span>
          </Link>
          <Link href="/admin/leadership" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            👤 Leadership <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{leaderCount}</span>
          </Link>
          <Link href="/admin/impact" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            📈 Impact Metrics <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{impactCount}</span>
          </Link>
        </div>

        <div className="mb-5">
          <h4 className="text-[11px] uppercase tracking-wider text-gray-500 px-5 mb-2">Inbox</h4>
          <Link href="/admin/volunteers" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            🙋 Volunteers <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{volunteerCount}</span>
          </Link>
          <Link href="/admin/messages" className="flex items-center gap-2 px-5 py-2 text-sm hover:bg-gray-800 hover:text-white">
            ✉️ Messages <span className="ml-auto bg-gray-700 text-gray-300 text-[11px] px-2 rounded-full">{messageCount}</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50">
        <div className="flex items-center justify-between bg-white px-7 py-4 border-b border-gray-200">
          <h1 className="text-lg font-bold">Admin</h1>
          <p className="text-sm text-gray-500">
            Logged in as <strong className="text-green-800">{user.name}</strong>
          </p>
        </div>
        <div className="p-7">{children}</div>
      </main>
    </div>
  );
}
