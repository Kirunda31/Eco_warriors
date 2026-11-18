import { prisma } from '@/lib/prisma';
import { updateUserRole } from '@/app/actions/updateUserRole';
import { updateUserPassword } from '@/app/actions/updateUserPassword';
import { requireAdmin } from '@/lib/auth';
import UserDeleteForm from '@/app/components/UserDeleteForm';

export default async function EditUserPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ passwordUpdated?: string }> }) {
  const admin = await requireAdmin();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, name: true, email: true, role: true, _count: { select: { progressReports: true } } },
  });

  if (!user) return <h1>User not found</h1>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-lg font-bold mb-5">Edit User</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <p className="text-sm text-gray-500 mb-1">Name</p>
        <p className="font-semibold mb-4">{user.name}</p>
        <p className="text-sm text-gray-500 mb-1">Email</p>
        <p className="font-semibold mb-4">{user.email}</p>

        {query.passwordUpdated === '1' && <p role="status" className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">Password updated successfully.</p>}

        <form action={updateUserRole} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={user.id} />
          <label className="text-sm text-gray-500">Role</label>
          <select name="role" defaultValue={user.role} className="border border-gray-300 rounded px-3 py-2">
             <option value="visitor">Visitor</option>
             <option value="manager">Program Manager</option>
            <option value="admin">Admin</option>
            <option value="trustee">Trustee</option>
</select>
          <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">
            Save Role
          </button>
        </form>

        <form action={updateUserPassword} className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5">
          <input type="hidden" name="id" value={user.id} />
          <h2 className="font-semibold">Set a new password</h2>
          <p className="text-sm text-gray-500">Choose a temporary password of at least 8 characters and share it with the user securely.</p>
          <label className="grid gap-1 text-sm font-medium">New password<input type="password" name="password" minLength={8} maxLength={72} autoComplete="new-password" required className="border border-gray-300 rounded px-3 py-2 font-normal" /></label>
          <button type="submit" className="w-fit bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Update password</button>
        </form>

        {user.id !== admin.id && <UserDeleteForm userId={user.id} userName={user.name} hasProgressReports={user._count.progressReports > 0} />}
      </div>
    </div>
  );
}
