import { prisma } from '@/lib/prisma';
import { updateGalleryItem } from '@/app/actions/updateGalleryItem';
import { deleteGalleryItem } from '@/app/actions/deleteGalleryItem';
import { isProgramManager, requireGalleryItemAccess, requireStaff } from '@/lib/auth';

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireStaff();
  await requireGalleryItemAccess(parseInt(id));
  const item = await prisma.galleryItem.findUnique({
    where: { id: parseInt(id) },
  });
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    select: { id: true, title: true },
  });

  if (!item) {
    return <h1>Gallery item not found</h1>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Gallery Item</h1>

      <img src={item.imageUrl} alt={item.caption ?? ''} className="w-full h-48 object-cover rounded mb-4" />

      <form action={updateGalleryItem} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={item.id} />
        <input
          type="url"
          name="imageUrl"
          defaultValue={item.imageUrl}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="caption"
          defaultValue={item.caption ?? ''}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="projectId"
          defaultValue={item.projectId ?? ''}
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

      <form action={deleteGalleryItem}>
        <input type="hidden" name="id" value={item.id} />
        <button
          type="submit"
          className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800"
        >
          Delete Image
        </button>
      </form>
    </div>
  );
}
