import { prisma } from '@/lib/prisma';
import { updateStory } from '@/app/actions/updateStory';
import { deleteStory } from '@/app/actions/deleteStory';
import { isProgramManager, requireStaff, requireStoryAccess } from '@/lib/auth';

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireStaff();
  await requireStoryAccess(parseInt(id));
  const story = await prisma.story.findUnique({
    where: { id: parseInt(id) },
  });
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    select: { id: true, title: true },
  });

  if (!story) {
    return <h1>Story not found</h1>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Story</h1>

      <form action={updateStory} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={story.id} />
        <input
          type="text"
          name="personName"
          defaultValue={story.personName}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="headline"
          defaultValue={story.headline}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="slug"
          defaultValue={story.slug}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="challenge"
          defaultValue={story.challenge}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="intervention"
          defaultValue={story.intervention}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="outcome"
          defaultValue={story.outcome}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="quote"
          defaultValue={story.quote ?? ''}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="fullStory"
          defaultValue={story.fullStory}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="status"
          defaultValue={story.status}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          name="projectId"
          defaultValue={story.projectId ?? ''}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {!isProgramManager(user) && <option value="">No project (General)</option>}
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

      <form action={deleteStory}>
        <input type="hidden" name="id" value={story.id} />
        <button
          type="submit"
          className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800"
        >
          Delete Story
        </button>
      </form>
    </div>
  );
}
