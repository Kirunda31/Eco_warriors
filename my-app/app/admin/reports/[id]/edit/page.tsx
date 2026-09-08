import { prisma } from '@/lib/prisma';
import { updateReport } from '@/app/actions/updateReport';
import { deleteReport } from '@/app/actions/deleteReport';
import { isProgramManager, requireReportAccess, requireStaff } from '@/lib/auth';

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireStaff();
  await requireReportAccess(parseInt(id));
  const report = await prisma.report.findUnique({
    where: { id: parseInt(id) },
  });
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    select: { id: true, title: true },
  });

  if (!report) {
    return <h1>Report not found</h1>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Report</h1>

      <form action={updateReport} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={report.id} />
        <input
          type="text"
          name="title"
          defaultValue={report.title}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="description"
          defaultValue={report.description}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="url"
          name="fileUrl"
          defaultValue={report.fileUrl}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="url"
          name="coverImage"
          defaultValue={report.coverImage ?? ''}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="category"
          defaultValue={report.category}
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="Annual Impact Report">Annual Impact Report</option>
          <option value="Strategic Plan">Strategic Plan</option>
          <option value="Project Report">Project Report</option>
          <option value="Evaluation">Evaluation / Learning Document</option>
          <option value="Research">Research / Publication</option>
        </select>
        <input
          type="number"
          name="year"
          defaultValue={report.year}
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="projectId"
          defaultValue={report.projectId ?? ''}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {!isProgramManager(user) && <option value="">No project (General)</option>}
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900"
        >
          Save Changes
        </button>
      </form>

      <form action={deleteReport}>
        <input type="hidden" name="id" value={report.id} />
        <button
          type="submit"
          className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800"
        >
          Delete Report
        </button>
      </form>
    </div>
  );
}
