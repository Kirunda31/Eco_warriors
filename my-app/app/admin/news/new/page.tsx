import { createNews } from '@/app/actions/createNews';

export default function NewNewsPage() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add News Article</h1>
      <form action={createNews} className="flex flex-col gap-4">
        <input type="text" name="title" placeholder="Title" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="slug" placeholder="Slug" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="url" name="featuredImage" placeholder="Featured Image URL (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="content" placeholder="Content" required className="border border-gray-300 rounded px-3 py-2" rows={6} />
        <input type="text" name="author" placeholder="Author" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="category" placeholder="Category" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="tags" placeholder="Tags, comma separated (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <select name="status" defaultValue="draft" className="border border-gray-300 rounded px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Publish Article</button>
      </form>
    </div>
  );
}