import { uploadGalleryItem } from '@/app/actions/uploadGalleryItem';
import { prisma } from '@/lib/prisma';
import { isProgramManager, requireStaff } from '@/lib/auth';

export default async function NewGalleryItemPage() {
  const user = await requireStaff();
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    select: { id: true, title: true },
  });
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Upload Gallery Images</h1>
      <p className="text-sm text-gray-600 mb-6">Choose up to five images to add them to the gallery at once.</p>
      <form
        action={uploadGalleryItem}
        className="flex flex-col gap-4"
      >
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="caption"
          placeholder="Caption (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select name="projectId" required={isProgramManager(user)} className="border border-gray-300 rounded px-3 py-2">
          {!isProgramManager(user) && <option value="">No project (General)</option>}
          {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
        </select>
        <button
          type="submit"
          className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900"
        >
          Upload Images
        </button>
      </form>
    </div>
  );
}
