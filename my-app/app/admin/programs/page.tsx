import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireStaff, isProgramManager } from '@/lib/auth';

export default async function AdminProgramsPage() {
  const user = await requireStaff();
  const manager = isProgramManager(user);
  const programs = await prisma.program.findMany({ where: manager ? { managerId: user.id } : {}, orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Programs</h1>
        {!manager && <Link href="/admin/programs/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">
          + New Program
        </Link>}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{program.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                    {program.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/programs/${program.id}/edit`} className="text-green-800 font-medium hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
