import { prisma } from '@/lib/prisma';
import { updateUserRole } from '@/app/actions/updateUserRole';
import { updateUserPassword } from '@/app/actions/updateUserPassword';
import { requireAdmin } from '@/lib/auth';
import UserDeleteForm from '@/app/components/UserDeleteForm';
import Link from 'next/link';

export default async function EditUserPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ passwordUpdated?: string }> }) {
  const admin = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, name: true, email: true, role: true, _count: { select: { progressReports: true } } },
  });

  if (!user) return <h1>User not found</h1>;

  return (
    <div className="mx-auto w-full max-w-xl">
      <Link href="/admin/users" className="mb-4 inline-flex min-h-10 items-center text-sm font-semibold text-green-800 hover:underline">← Back to users</Link>
      <h1 className="mb-5 text-xl font-bold sm:text-2xl">Manage account</h1>
      <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Name</p>
        <p className="mb-4 break-words font-semibold text-gray-900">{user.name}</p>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Email</p>
        <p className="mb-4 break-all font-semibold text-gray-900">{user.email}</p>

        {query.passwordUpdated === '1' && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">Password updated successfully.</p>}

        <form action={updateUserRole} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={user.id} />
          <label className="grid gap-1.5 text-sm font-medium">Role
          <select name="role" defaultValue={user.role} className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 py-2">
             <option value="visitor">Visitor</option>
             <option value="manager">Program Manager</option>
            <option value="admin">Admin</option>
            <option value="trustee">Trustee</option>
          </select></label>
          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-green-800 px-4 font-semibold text-white hover:bg-green-900 sm:w-auto sm:self-start">
            Save Role
          </button>
        </form>

        <form action={updateUserPassword} className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5">
          <input type="hidden" name="id" value={user.id} />
          <h2 className="font-semibold">Set a new password</h2>
          <p className="text-sm text-gray-500">Choose a temporary password of at least 8 characters and share it with the user securely.</p>
          <label className="grid gap-1.5 text-sm font-medium">New password<input type="password" name="password" minLength={8} maxLength={72} autoComplete="new-password" required className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 font-normal" /></label>
          <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-green-800 px-4 font-semibold text-white hover:bg-green-900 sm:w-auto sm:self-start">Update password</button>
        </form>

        {user.id !== admin.id && <UserDeleteForm userId={user.id} userName={user.name} hasProgressReports={user._count.progressReports > 0} />}
      </div>
    </div>
  );
}
