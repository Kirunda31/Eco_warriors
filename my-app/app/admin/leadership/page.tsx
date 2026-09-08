import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminLeadershipPage() {
  await requireAdmin();
  const leaders = await prisma.leader.findMany({ orderBy: { displayOrder: 'asc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Leadership</h1>
        <Link href="/admin/leadership/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">+ New Leader</Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader) => (
              <tr key={leader.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{leader.name}</td>
                <td className="px-4 py-3 text-gray-500">{leader.position}</td>
                <td className="px-4 py-3 text-gray-500">{leader.category}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/leadership/${leader.id}/edit`} className="text-green-800 font-medium hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
