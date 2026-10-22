import { createEvent } from '@/app/actions/createEvent';
import FeaturedImageForm from '@/app/components/FeaturedImageForm';

export default function NewEventPage() {
  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Event</h1>
      <FeaturedImageForm action={createEvent} className="flex flex-col gap-4">
        <input type="text" name="title" placeholder="Event Title" required className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="description" placeholder="Description" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="date" name="date" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="time" name="time" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="location" placeholder="Location" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="url" name="registrationLink" placeholder="Registration Link (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <label className="text-sm font-medium text-gray-700">Featured photo <span className="text-red-700">*</span><input type="file" name="featuredImage" accept="image/*" required className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" /><span className="mt-1 block text-xs font-normal text-gray-500">Maximum file size: 4 MB.</span></label>
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Add Event</button>
      </FeaturedImageForm>
    </div>
  );
}
