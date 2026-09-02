import { prisma } from '@/lib/prisma';
import { createActivity } from '@/app/actions/createActivity';

export default async function NewActivityPage() {
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Activity</h1>
      <form action={createActivity} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Activity Title"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          name="date"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="projectId"
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select a Project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900"
        >
          Create Activity
        </button>
      </form>
    </div>
  );
}