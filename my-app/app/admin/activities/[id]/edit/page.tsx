import { prisma } from '@/lib/prisma';
import { updateActivity } from '@/app/actions/updateActivity';
import { deleteActivity } from '@/app/actions/deleteActivity';

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await prisma.activity.findUnique({
    where: { id: parseInt(id) },
  });
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
  });

  if (!activity) {
    return <h1>Activity not found</h1>;
  }

  const dateForInput = activity.date.toISOString().split('T')[0];

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Activity</h1>

      <form action={updateActivity} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={activity.id} />
        <input
          type="text"
          name="title"
          defaultValue={activity.title}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="description"
          defaultValue={activity.description}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="date"
          name="date"
          defaultValue={dateForInput}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="location"
          defaultValue={activity.location}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="projectId"
          defaultValue={activity.projectId}
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
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
          Save Changes
        </button>
      </form>

      <form action={deleteActivity}>
        <input type="hidden" name="id" value={activity.id} />
        <button
          type="submit"
          className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800"
        >
          Delete Activity
        </button>
      </form>
    </div>
  );
}