import { prisma } from '@/lib/prisma';
import { updateProject } from '@/app/actions/updateProject';
import { deleteProject } from '@/app/actions/deleteProject';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
  });
  const programs = await prisma.program.findMany({
    select: { id: true, name: true },
  });

  if (!project) {
    return <h1>Project not found</h1>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

      <form action={updateProject} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={project.id} />
        <input
          type="text"
          name="title"
          defaultValue={project.title}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="slug"
          defaultValue={project.slug}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="description"
          defaultValue={project.description}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="location"
          defaultValue={project.location}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="programId"
          defaultValue={project.programId}
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
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
          Save Changes
        </button>
      </form>

      <form action={deleteProject}>
        <input type="hidden" name="id" value={project.id} />
        <button
          type="submit"
          className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800"
        >
          Delete Project
        </button>
      </form>
    </div>
  );
}