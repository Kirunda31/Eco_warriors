import { prisma } from '@/lib/prisma';
import { updateEvent } from '@/app/actions/updateEvent';
import { deleteEvent } from '@/app/actions/deleteEvent';
import { requireAdmin } from '@/lib/auth';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id: parseInt(id) } });
  if (!event) return <h1>Event not found</h1>;

  const dateForInput = event.date.toISOString().split('T')[0];

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
      <form action={updateEvent} encType="multipart/form-data" className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={event.id} />
        <input type="text" name="title" defaultValue={event.title} required className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="description" defaultValue={event.description} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="date" name="date" defaultValue={dateForInput} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="time" name="time" defaultValue={event.time} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="location" defaultValue={event.location} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="url" name="registrationLink" defaultValue={event.registrationLink ?? ''} className="border border-gray-300 rounded px-3 py-2" />
        <label className="text-sm font-medium text-gray-700">Featured photo {!event.featuredImage && <span className="text-red-700">*</span>}<input type="file" name="featuredImage" accept="image/*" required={!event.featuredImage} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" /><span className="mt-1 block text-xs font-normal text-gray-500">{event.featuredImage ? 'Leave blank to keep the current photo.' : 'A photo is required.'}</span></label>
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Save Changes</button>
      </form>
      <form action={deleteEvent}>
        <input type="hidden" name="id" value={event.id} />
        <button type="submit" className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800">Delete Event</button>
      </form>
    </div>
  );
}
