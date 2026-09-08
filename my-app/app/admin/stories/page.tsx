import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireStaff, isProgramManager } from '@/lib/auth';

export default async function AdminStoriesPage() {
  const user = await requireStaff();
  const stories = await prisma.story.findMany({ where: isProgramManager(user) ? { project: { is: { program: { managerId: user.id } } } } : {}, orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Stories</h1>
        <Link href="/admin/stories/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">
          + New Story
        </Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Headline</th>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{story.headline}</td>
                <td className="px-4 py-3 text-gray-500">{story.personName}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${story.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {story.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/stories/${story.id}/edit`} className="text-green-800 font-medium hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
