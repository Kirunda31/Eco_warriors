import { prisma } from '@/lib/prisma';
import { linkGalleryItem } from '@/app/actions/linkGalleryItem';

export default async function LinkGalleryItemPage() {
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Existing Bucket Image</h1>
      <form action={linkGalleryItem} className="flex flex-col gap-4">
        <input
          type="url"
          name="imageUrl"
          placeholder="Paste S3 image URL"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="caption"
          placeholder="Caption (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
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
          Add to Gallery
        </button>
      </form>
    </div>
  );
}