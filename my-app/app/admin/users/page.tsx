import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: { id: true, name: true, username: true, email: true, role: true, managedProgram: { select: { name: true } } },
    orderBy: { id: 'asc' },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5"><h1 className="text-lg font-bold">Users</h1><Link href="/admin/users/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">+ Create staff account</Link></div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.username}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{user.managedProgram?.name ?? '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/users/${user.id}/edit`} className="text-green-800 font-medium hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
