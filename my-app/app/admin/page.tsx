import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const userId = parseInt(sessionCookie.value);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const programs = await prisma.program.findMany();
  const projects = await prisma.project.findMany();
  const activities = await prisma.activity.findMany();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, admin {user.name}.</p>

      <div className="flex flex-col gap-3 mb-10">
        <Link href="/admin/programs/new" className="border border-gray-300 rounded px-4 py-3 hover:bg-gray-50">
          + Create New Program
        </Link>
        <Link href="/admin/projects/new" className="border border-gray-300 rounded px-4 py-3 hover:bg-gray-50">
          + Create New Project
        </Link>
        <Link href="/admin/activities/new" className="border border-gray-300 rounded px-4 py-3 hover:bg-gray-50">
          + Create New Activity
        </Link>
        <Link href="/admin/stories/new" className="border border-gray-300 rounded px-4 py-3 hover:bg-gray-50">
          + Create New Story
        </Link>
        <Link href="/admin/gallery/link" className="border border-gray-300 rounded px-4 py-3 hover:bg-gray-50">
          + Add Gallery Image
        </Link>
        <Link href="/admin/reports/new" className="border border-gray-300 rounded px-4 py-3 hover:bg-gray-50">
          + Add New Report
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Existing Programs</h2>
      <div className="flex flex-col gap-2">
        {programs.map((program) => (
          <div key={program.id} className="flex items-center justify-between border border-gray-200 rounded px-4 py-3">
            <span>{program.name}</span>
            <Link href={`/admin/programs/${program.id}/edit`} className="text-green-800 hover:underline">
              Edit
            </Link>
   
          </div>
        ))}
      </div>
           <h2 className="text-xl font-semibold mb-4 mt-10">Existing Projects</h2>
      <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between border border-gray-200 rounded px-4 py-3">
               <span>{project.title}</span>
               <Link href={`/admin/projects/${project.id}/edit`} className="text-green-800 hover:underline">
                 Edit
              </Link>
      </div>
  ))}
</div>
<h2 className="text-xl font-semibold mb-4 mt-10">Existing Activities</h2>
<div className="flex flex-col gap-2">
  {activities.map((activity) => (
    <div key={activity.id} className="flex items-center justify-between border border-gray-200 rounded px-4 py-3">
      <span>{activity.title}</span>
      <Link href={`/admin/activities/${activity.id}/edit`} className="text-green-800 hover:underline">
        Edit
      </Link>
    </div>
  ))}
</div>
    </div>
  );
}