import { prisma } from '@/lib/prisma';
import { updateVolunteerStatus } from '@/app/actions/updateVolunteerStatus';
import { deleteVolunteer } from '@/app/actions/deleteVolunteer';
import { requireAdmin } from '@/lib/auth';
import { createVolunteerAssignment, updateVolunteerAssignment } from '@/app/actions/operations';

export default async function AdminVolunteersPage() {
  await requireAdmin();
  const [volunteers, projects] = await Promise.all([prisma.volunteer.findMany({ include: { assignments: { include: { project: { select: { title: true } } }, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' } }), prisma.project.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } })]);

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
            <div className="mt-3 rounded border border-gray-100 bg-gray-50 p-3"><p className="text-xs font-bold uppercase text-gray-500">Skills matching, assignments & attendance</p><p className="mt-1 text-xs text-gray-500">Match the role to the applicant&apos;s listed skills and availability before assigning.</p><form action={createVolunteerAssignment} className="mt-2 grid gap-2 md:grid-cols-3"><input type="hidden" name="volunteerId" value={v.id}/><input name="role" required placeholder="Assignment role" className="rounded border px-2 py-1 text-xs"/><select name="projectId" className="rounded border px-2 py-1 text-xs"><option value="">No project</option>{projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select><select name="attendance" className="rounded border px-2 py-1 text-xs"><option value="pending">Attendance pending</option><option value="present">Present</option><option value="completed">Completed</option></select><input name="startDate" type="date" className="rounded border px-2 py-1 text-xs"/><input name="certificateUrl" type="url" placeholder="Certificate URL (optional)" className="rounded border px-2 py-1 text-xs"/><button className="rounded bg-green-800 px-3 py-1 text-xs text-white">Assign</button></form>{v.assignments.map(a => <form key={a.id} action={updateVolunteerAssignment} className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600"><input type="hidden" name="id" value={a.id}/><span>{a.role} · {a.project?.title ?? 'Organisation-wide'}</span><select name="attendance" defaultValue={a.attendance} className="rounded border px-2 py-1"><option value="pending">Pending</option><option value="present">Present</option><option value="completed">Completed</option><option value="absent">Absent</option></select><input name="certificateUrl" type="url" defaultValue={a.certificateUrl ?? ''} placeholder="Certificate URL" className="rounded border px-2 py-1"/><button className="rounded bg-white px-2 py-1 font-semibold text-green-800">Save</button></form>)}</div>

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
