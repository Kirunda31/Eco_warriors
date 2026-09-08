import { prisma } from '@/lib/prisma';
import { updateUserRole } from '@/app/actions/updateUserRole';
import { requireAdmin } from '@/lib/auth';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, name: true, email: true, role: true },
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

        <form action={updateUserRole} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={user.id} />
          <label className="text-sm text-gray-500">Role</label>
          <select name="role" defaultValue={user.role} className="border border-gray-300 rounded px-3 py-2">
             <option value="visitor">Visitor</option>
             <option value="manager">Program Manager</option>
            <option value="admin">Admin</option>
</select>
          <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">
            Save Role
          </button>
        </form>
      </div>
    </div>
  );
}
