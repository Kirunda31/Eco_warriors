import { createUser } from '@/app/actions/createUser';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export default async function NewUserPage() {
  await requireAdmin();
  const programs = await prisma.program.findMany({
    where: { managerId: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-lg">
      <h1 className="text-lg font-bold mb-2">Create staff account</h1>
      <p className="text-sm text-gray-500 mb-5">Only administrators can create accounts. Program managers must be assigned one program.</p>
      <form action={createUser} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col gap-4">
        <input name="name" placeholder="Full name" required className="border border-gray-300 rounded px-3 py-2" />
        <input name="username" placeholder="Username" autoComplete="username" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="email" name="email" placeholder="Email address" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="password" name="password" placeholder="Temporary password (minimum 8 characters)" minLength={8} autoComplete="new-password" required className="border border-gray-300 rounded px-3 py-2" />
        <label className="text-sm text-gray-600">Role</label>
        <select name="role" defaultValue="manager" className="border border-gray-300 rounded px-3 py-2">
          <option value="manager">Program manager</option>
          <option value="admin">Administrator</option>
          <option value="trustee">Trustee</option>
        </select>
        <label className="text-sm text-gray-600">Program to manage</label>
        <select name="programId" className="border border-gray-300 rounded px-3 py-2">
          <option value="">Select an unassigned program</option>
          {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
        </select>
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Create account</button>
      </form>
    </div>
  );
}
