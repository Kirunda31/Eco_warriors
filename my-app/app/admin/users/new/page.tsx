import { createUser } from '@/app/actions/createUser';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';

export default async function NewUserPage() {
  await requireAdmin();
  const programs = await prisma.program.findMany({
    where: { managerId: null },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="w-full max-w-xl">
      <Link href="/admin/users" className="mb-4 inline-flex min-h-10 items-center text-sm font-semibold text-green-800 hover:underline">← Back to users</Link>
      <h1 className="text-xl font-bold sm:text-2xl">Create staff account</h1>
      <p className="mb-5 mt-2 text-sm leading-6 text-gray-500">Only administrators can create accounts. Program managers must be assigned one program.</p>
      <form action={createUser} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <label className="grid gap-1.5 text-sm font-medium">Full name<input name="name" placeholder="Full name" required autoComplete="name" className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-medium">Username<input name="username" placeholder="Username" autoComplete="username" required className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-medium">Email address<input type="email" name="email" placeholder="name@example.com" autoComplete="email" required className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-medium">Initial password <span className="font-normal leading-5 text-gray-500">Set a temporary password of at least 8 characters, then share it with the user securely.</span><input type="password" name="password" placeholder="At least 8 characters" minLength={8} maxLength={72} autoComplete="new-password" required className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1.5 text-sm font-medium">Role
        <select name="role" defaultValue="manager" className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 py-2">
          <option value="manager">Program manager</option>
          <option value="admin">Administrator</option>
          <option value="trustee">Trustee</option>
        </select></label>
        <label className="grid gap-1.5 text-sm font-medium">Program to manage
        <select name="programId" className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 py-2">
          <option value="">Select an unassigned program</option>
          {programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}
        </select></label>
        <button type="submit" className="mt-1 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-green-800 px-4 font-semibold text-white hover:bg-green-900 sm:w-auto sm:self-start">Create account</button>
      </form>
    </div>
  );
}
