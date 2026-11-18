import { prisma } from '@/lib/prisma';
import { createProjectProgressReport } from '@/app/actions/createProjectProgressReport';
import { isProgramManager, requireStaff } from '@/lib/auth';
import DocumentUploadForm from '@/app/components/DocumentUploadForm';

export default async function NewProgressReportPage() {
  const user = await requireStaff();
  const projects = await prisma.project.findMany({
    where: isProgramManager(user) ? { program: { managerId: user.id } } : {},
    select: { id: true, title: true, program: { select: { name: true } } },
    orderBy: { title: 'asc' },
  });

  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Submit project progress report</h1>
      <p className="mt-2 text-sm text-gray-500">This is an internal management update and is not published on the public website.</p>
      <DocumentUploadForm action={createProjectProgressReport} className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm font-medium">Project
          <select name="projectId" required className="rounded border border-gray-300 px-3 py-2 font-normal">
            <option value="">Select a project</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.program.name} — {project.title}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium">Reporting period<input name="reportingPeriod" placeholder="e.g. July–September 2026" required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Implementation summary<textarea name="summary" rows={5} required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Key achievements<textarea name="achievements" rows={5} required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Challenges and risks<textarea name="challenges" rows={5} required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Budget versus plan notes<textarea name="budgetNotes" rows={4} placeholder="Spend, variance and corrective action" className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Next steps<textarea name="nextSteps" rows={5} required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Upload evidence document <span className="font-normal text-gray-500">(optional; PDF, Office, CSV, or text)</span>
          <input name="evidenceFile" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt" className="rounded border border-gray-300 px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-medium">Or paste an evidence link <span className="font-normal text-gray-500">(optional)</span><input name="evidenceUrl" type="url" placeholder="https://…" className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Upload photos <span className="font-normal text-gray-500">(up to five; all report uploads combined must be 4 MB or smaller)</span>
          <input name="photoFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple className="rounded border border-gray-300 px-3 py-2 font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-medium">Or paste photo links <span className="font-normal text-gray-500">(optional; one URL per line)</span><textarea name="photoUrls" rows={3} className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <button type="submit" className="w-fit rounded bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900">Submit progress report</button>
      </DocumentUploadForm>
    </div>
  );
}
