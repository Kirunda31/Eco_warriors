import { prisma } from '@/lib/prisma';
import { updateNews } from '@/app/actions/updateNews';
import { deleteNews } from '@/app/actions/deleteNews';
import { requireAdmin } from '@/lib/auth';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const article = await prisma.news.findUnique({ where: { id: parseInt(id) } });
  if (!article) return <h1>Article not found</h1>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit News Article</h1>
      <form action={updateNews} encType="multipart/form-data" className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={article.id} />
        <input type="text" name="title" defaultValue={article.title} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="slug" defaultValue={article.slug} required className="border border-gray-300 rounded px-3 py-2" />
        <label className="text-sm font-medium text-gray-700">Featured photo {!article.featuredImage && <span className="text-red-700">*</span>}<input type="file" name="featuredImage" accept="image/*" required={!article.featuredImage} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" /><span className="mt-1 block text-xs font-normal text-gray-500">{article.featuredImage ? 'Leave blank to keep the current photo.' : 'A photo is required.'}</span></label>
        <textarea name="content" defaultValue={article.content} required className="border border-gray-300 rounded px-3 py-2" rows={6} />
        <input type="text" name="author" defaultValue={article.author} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="category" defaultValue={article.category} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="tags" defaultValue={article.tags ?? ''} className="border border-gray-300 rounded px-3 py-2" />
        <select name="status" defaultValue={article.status} className="border border-gray-300 rounded px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Save Changes</button>
      </form>
      <form action={deleteNews}>
        <input type="hidden" name="id" value={article.id} />
        <button type="submit" className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800">Delete Article</button>
      </form>
    </div>
  );
}
