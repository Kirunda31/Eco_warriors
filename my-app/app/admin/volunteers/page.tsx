import { prisma } from '@/lib/prisma';
import { updateVolunteerStatus } from '@/app/actions/updateVolunteerStatus';
import { deleteVolunteer } from '@/app/actions/deleteVolunteer';
import { requireAdmin } from '@/lib/auth';

export default async function AdminVolunteersPage() {
  await requireAdmin();
  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <h1 className="text-lg font-bold mb-5">Volunteer Applications</h1>
      <div className="flex flex-col gap-3">
        {volunteers.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{v.name} <span className="text-gray-400 font-normal">- {v.email}</span></p>
                <p className="text-xs text-gray-500 mt-0.5">{v.country}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">{v.status}</span>
            </div>
            <p className="text-sm text-gray-700 mt-2"><strong>Skills:</strong> {v.skills}</p>
            <p className="text-sm text-gray-700"><strong>Interest:</strong> {v.interest}</p>
            <p className="text-sm text-gray-700"><strong>Availability:</strong> {v.availability}</p>

            <div className="flex gap-2 mt-3">
              <form action={updateVolunteerStatus} className="flex gap-2">
                <input type="hidden" name="id" value={v.id} />
                <select name="status" defaultValue={v.status} className="border border-gray-300 rounded px-2 py-1 text-xs">
                  <option value="applicant">Applicant</option>
                  <option value="approved">Approved</option>
                  <option value="active">Active</option>
                  <option value="alumni">Alumni</option>
                </select>
                <button type="submit" className="text-xs bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Update</button>
              </form>
              <form action={deleteVolunteer}>
                <input type="hidden" name="id" value={v.id} />
                <button type="submit" className="text-xs bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
