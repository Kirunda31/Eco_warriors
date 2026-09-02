import { prisma } from '@/lib/prisma';
import { createStory } from '@/app/actions/createStory';

export default async function NewStoryPage() {
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Story</h1>
      <form action={createStory} className="flex flex-col gap-4">
        <input
          type="text"
          name="personName"
          placeholder="Person's Name"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="headline"
          placeholder="Headline"
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
          name="challenge"
          placeholder="Challenge"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="intervention"
          placeholder="Eco Warriors Intervention"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="outcome"
          placeholder="Outcome"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="quote"
          placeholder="Quote (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="fullStory"
          placeholder="Full Story"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="status"
          defaultValue="draft"
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          name="projectId"
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">No project (General)</option>
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
          Create Story
        </button>
      </form>
    </div>
  );
}