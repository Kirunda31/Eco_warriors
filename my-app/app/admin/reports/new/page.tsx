import { prisma } from '@/lib/prisma';
import { createReport } from '@/app/actions/createReport';

export default async function NewReportPage() {
  const projects = await prisma.project.findMany({
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Report</h1>
      <form action={createReport} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Report Title"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="url"
          name="fileUrl"
          placeholder="PDF URL (from S3 bucket)"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="url"
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="category"
          required
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select category</option>
          <option value="Annual Impact Report">Annual Impact Report</option>
          <option value="Strategic Plan">Strategic Plan</option>
          <option value="Project Report">Project Report</option>
          <option value="Evaluation">Evaluation / Learning Document</option>
          <option value="Research">Research / Publication</option>
        </select>
        <input
          type="number"
          name="year"
          placeholder="Year"
          required
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="projectId"
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">No project (General)</option>
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
          Add Report
        </button>
      </form>
    </div>
  );
}