import { prisma } from '@/lib/prisma';
import { createProject } from '@/app/actions/createProject';

export default async function NewProjectPage() {
  const programs = await prisma.program.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <form action={createProject} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="slug"
          placeholder="Slug"
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
          type="text"
          name="location"
          placeholder="Location"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="programId"
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select a Program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}