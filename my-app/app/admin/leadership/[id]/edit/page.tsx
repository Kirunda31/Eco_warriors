import { prisma } from '@/lib/prisma';
import { updateLeader } from '@/app/actions/updateLeader';
import { deleteLeader } from '@/app/actions/deleteLeader';
import { requireAdmin } from '@/lib/auth';

export default async function EditLeaderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const leader = await prisma.leader.findUnique({ where: { id: parseInt(id) } });
  if (!leader) return <h1>Leader not found</h1>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Leader</h1>
      <form action={updateLeader} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={leader.id} />
        <input type="text" name="name" defaultValue={leader.name} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="position" defaultValue={leader.position} required className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="biography" defaultValue={leader.biography} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="url" name="photo" defaultValue={leader.photo ?? ''} className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="socialLinks" defaultValue={leader.socialLinks ?? ''} className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="category" defaultValue={leader.category} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="number" name="displayOrder" defaultValue={leader.displayOrder} className="border border-gray-300 rounded px-3 py-2" />
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Save Changes</button>
      </form>
      <form action={deleteLeader}>
        <input type="hidden" name="id" value={leader.id} />
        <button type="submit" className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800">Delete Leader</button>
      </form>
    </div>
  );
}
