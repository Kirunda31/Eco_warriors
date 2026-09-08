import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';

export default async function AdminEventsPage() {
  await requireAdmin();
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold">Events</h1>
        <Link href="/admin/events/new" className="bg-green-800 text-white text-sm px-4 py-2 rounded hover:bg-green-900">+ New Event</Link>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-gray-100">
                <td className="px-4 py-3">{event.title}</td>
                <td className="px-4 py-3 text-gray-500">{event.date.toDateString()}</td>
                <td className="px-4 py-3 text-gray-500">{event.location}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/events/${event.id}/edit`} className="text-green-800 font-medium hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
