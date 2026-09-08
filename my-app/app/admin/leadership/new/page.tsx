import { createLeader } from '@/app/actions/createLeader';

export default function NewLeaderPage() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Leader / Team Member</h1>
      <form action={createLeader} className="flex flex-col gap-4">
        <input type="text" name="name" placeholder="Full Name" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="position" placeholder="Position" required className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="biography" placeholder="Biography" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="url" name="photo" placeholder="Photo URL (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="socialLinks" placeholder="Social Links (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="category" placeholder="Category (e.g. Leadership, Ambassador)" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="number" name="displayOrder" placeholder="Display Order" className="border border-gray-300 rounded px-3 py-2" />
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Add Team Member</button>
      </form>
    </div>
  );
}