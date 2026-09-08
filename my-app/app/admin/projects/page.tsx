import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireStaff, isProgramManager } from '@/lib/auth';

export default async function AdminProjectsPage() {
  const user = await requireStaff();
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    orderBy: { createdAt: 'desc' },
    include: { program: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Projects</h1>
        <Link href="/admin/projects/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">
          + New Project
        </Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{project.title}</td>
                <td className="px-4 py-3 text-gray-500">{project.program.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{project.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/projects/${project.id}/edit`} className="text-green-800 font-medium hover:underline">Manage phases</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
