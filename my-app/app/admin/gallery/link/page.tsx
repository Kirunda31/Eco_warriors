import { prisma } from '@/lib/prisma';
import { linkGalleryItem } from '@/app/actions/linkGalleryItem';
import { isProgramManager, requireStaff } from '@/lib/auth';

export default async function LinkGalleryItemPage() {
  const user = await requireStaff();
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Add Existing Bucket Images</h1>
      <p className="text-sm text-gray-600 mb-6">Paste up to five image URLs to add them to the gallery at once.</p>
      <form action={linkGalleryItem} className="flex flex-col gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <input
            key={index}
            type="url"
            name="imageUrl"
            placeholder={index === 0 ? 'Paste S3 image URL' : `Image URL ${index + 1} (optional)`}
            required={index === 0}
            className="border border-gray-300 rounded px-3 py-2"
          />
        ))}
        <input
          type="text"
          name="caption"
          placeholder="Caption (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="projectId"
          required={isProgramManager(user)}
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
          Add Images to Gallery
        </button>
      </form>
    </div>
  );
}
