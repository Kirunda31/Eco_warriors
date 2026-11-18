import { prisma } from '@/lib/prisma';
import { createReport } from '@/app/actions/createReport';
import { isProgramManager, requireStaff } from '@/lib/auth';
import DocumentUploadForm from '@/app/components/DocumentUploadForm';

export default async function NewReportPage() {
  const user = await requireStaff();
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    select: { id: true, title: true },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Report</h1>
      <DocumentUploadForm action={createReport} className="flex flex-col gap-4">
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
        <label className="grid gap-1 text-sm font-medium">Upload a report from your device <span className="font-normal text-gray-500">PDF, Office, CSV, text, or common image files; maximum 4 MB.</span><input type="file" name="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.jpg,.jpeg,.png,.webp" className="border border-gray-300 rounded px-3 py-2 font-normal" /></label>
        <input
          type="url"
          name="fileUrl"
          placeholder="Or enter an external report URL"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="url"
          name="coverImage"
          placeholder="Cover Image URL (optional)"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <label className="grid gap-1 text-sm font-medium">Or upload a cover image from your device <span className="font-normal text-gray-500">Optional; if selected, this image will be used instead of the URL. JPEG, PNG, WebP, GIF, or AVIF; maximum 4 MB total with the report file.</span><input type="file" name="coverImageFile" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="border border-gray-300 rounded px-3 py-2 font-normal" /></label>
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
          Add Report
        </button>
      </DocumentUploadForm>
    </div>
  );
}
