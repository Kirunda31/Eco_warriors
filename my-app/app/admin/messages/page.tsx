import { prisma } from '@/lib/prisma';
import { updateMessageStatus } from '@/app/actions/updateMessageStatus';
import { deleteContactMessage } from '@/app/actions/deleteContactMessage';
import { requireAdmin } from '@/lib/auth';

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 className="text-lg font-bold mb-5">Messages</h1>
      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">{msg.name} <span className="text-gray-400 font-normal">- {msg.email}</span></p>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${msg.status === 'unread' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                {msg.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{msg.category}</p>
            <p className="text-sm text-gray-700 mt-2">{msg.message}</p>
            <div className="flex gap-2 mt-3">
              <form action={updateMessageStatus} className="flex gap-2">
                <input type="hidden" name="id" value={msg.id} />
                <select name="status" defaultValue={msg.status} className="border border-gray-300 rounded px-2 py-1 text-xs">
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <button type="submit" className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Update</button>
              </form>
              <form action={deleteContactMessage}>
                <input type="hidden" name="id" value={msg.id} />
                <button type="submit" className="text-xs bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
