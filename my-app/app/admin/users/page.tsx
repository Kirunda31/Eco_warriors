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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-xl font-bold">Users</h1><p className="mt-1 text-sm text-gray-500">Manage staff accounts, roles, and passwords.</p></div><Link href="/admin/users/new" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-green-800 px-4 text-sm font-semibold text-white hover:bg-green-900 sm:w-auto">+ Create staff account</Link></div>
      <div className="grid gap-3 xl:hidden">
        {users.map((user) => (
          <article key={user.id} className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <div className="min-w-0"><h2 className="break-words font-semibold text-gray-900">{user.name}</h2><p className="mt-1 break-all text-sm text-gray-500">{user.email}</p></div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{user.role}</span>
            </div>
            <dl className="mt-4 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 border-t border-gray-100 pt-3 text-sm">
              <dt className="text-gray-500">Username</dt><dd className="break-all font-medium text-gray-800">{user.username}</dd>
              <dt className="text-gray-500">Program</dt><dd className="break-words text-gray-800">{user.managedProgram?.name ?? '—'}</dd>
            </dl>
            <Link href={`/admin/users/${user.id}/edit`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-green-800 px-4 text-sm font-semibold text-green-800 hover:bg-green-50">Manage account</Link>
          </article>
        ))}
        {!users.length && <p className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">No accounts have been created yet.</p>}
      </div>
      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white xl:block">
        <table className="w-full min-w-[760px] text-sm">
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
                  <Link href={`/admin/users/${user.id}/edit`} className="inline-flex min-h-10 items-center text-green-800 font-medium hover:underline">Manage</Link>
                </td>
              </tr>
            ))}
            {!users.length && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No accounts have been created yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
