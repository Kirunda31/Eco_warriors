import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireStaff, isProgramManager } from '@/lib/auth';

export default async function AdminGalleryPage() {
  const user = await requireStaff();
  const items = await prisma.galleryItem.findMany({ where: isProgramManager(user) ? { project: { is: { program: { managerId: user.id } } } } : {}, orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Gallery</h1>
        <div className="flex gap-2">
          <Link href="/admin/gallery/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">+ Upload Image</Link>
          <Link href="/admin/gallery/link" className="border border-green-800 text-green-800 text-sm px-4 py-2 rounded hover:bg-green-50">+ Link Bucket Image</Link>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {items.map((item) => (
          <Link key={item.id} href={`/admin/gallery/${item.id}/edit`} className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-green-700">
            <img src={item.imageUrl} alt={item.caption ?? ''} className="w-full h-28 object-cover" />
            <p className="text-xs p-2 text-gray-600 truncate">{item.caption || 'Untitled'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
