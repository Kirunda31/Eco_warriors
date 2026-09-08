import { prisma } from '@/lib/prisma';
import { updateProgram } from '@/app/actions/updateProgram';
import { deleteProgram } from '@/app/actions/deleteProgram';
import { requireProgramAccess } from '@/lib/auth';

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireProgramAccess(parseInt(id));
  const program = await prisma.program.findUnique({
    where: { id: parseInt(id) },
    include: { projects: { select: { id: true, title: true, gallery: { select: { id: true, imageUrl: true, caption: true }, orderBy: { createdAt: 'desc' } } } } },
  });
  const users = user.role === 'admin'
    ? await prisma.user.findMany({
        where: { role: 'manager' },
        select: { id: true, name: true },
      })
    : [];

  if (!program) return <h1>Program not found</h1>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Program</h1>
      <form action={updateProgram} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={program.id} />
        <input type="text" name="name" defaultValue={program.name} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="slug" defaultValue={program.slug} required className="border border-gray-300 rounded px-3 py-2" />
        <label className="text-sm font-medium text-gray-700 -mb-2">Program description</label>
        <p className="text-xs text-gray-500 -mt-3">Use paragraphs to explain who the programme serves, how it works, and the change it seeks to make.</p>
        <textarea name="description" defaultValue={program.description} required rows={7} className="border border-gray-300 rounded px-3 py-2" />
        <label className="text-sm font-medium text-gray-700 -mb-2">Long-term goal</label>
        <textarea name="goal" defaultValue={program.goal} required rows={4} className="border border-gray-300 rounded px-3 py-2" />
        <label className="text-sm text-gray-600 -mb-2">Hero background image</label>
        <select name="heroImageUrl" defaultValue={program.heroImageUrl ?? ''} className="border border-gray-300 rounded px-3 py-2">
          <option value="">No background image</option>
          {program.projects.flatMap((project) => project.gallery.map((image) => <option key={image.id} value={image.imageUrl}>{project.title} — {image.caption || `Gallery image #${image.id}`}</option>))}
        </select>
        {!program.projects.some((project) => project.gallery.length) && <p className="text-sm text-gray-500">Upload gallery images to a project in this program first, then return here to choose the hero background.</p>}

        {user.role === 'admin' && <><label className="text-sm text-gray-500 -mb-2">Program Manager</label>
          <select name="managerId" defaultValue={program.managerId ?? ''} className="border border-gray-300 rounded px-3 py-2">
            <option value="">No manager assigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select></>}

        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Save Changes</button>
      </form>
      {user.role === 'admin' && <form action={deleteProgram}><input type="hidden" name="id" value={program.id} /><button type="submit" className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800">Delete Program</button></form>}
    </div>
  );
}
