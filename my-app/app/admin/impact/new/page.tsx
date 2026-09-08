import { createImpactMetric } from '@/app/actions/createImpactMetric';
import { prisma } from '@/lib/prisma';

export default async function NewImpactMetricPage() {
  const projects = await prisma.project.findMany({
    where: { status: 'active' },
    include: { program: true },
    orderBy: { title: 'asc' },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Impact Metric</h1>
      <form action={createImpactMetric} className="flex flex-col gap-4">
        <input type="text" name="title" placeholder="Metric Title (e.g. Youth & Women Trained)" required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="value" placeholder="Value (e.g. 140+)" required className="border border-gray-300 rounded px-3 py-2" />
        <select name="projectId" defaultValue="" className="border border-gray-300 rounded px-3 py-2">
          <option value="">Organisation-wide metric</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.title} · {project.program.name}</option>)}
        </select>
        <input type="number" name="year" placeholder="Year" required className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="description" placeholder="Description (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="source" placeholder="Verification / Source note (optional)" className="border border-gray-300 rounded px-3 py-2" />
        <select name="status" defaultValue="draft" className="border border-gray-300 rounded px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Add Metric</button>
      </form>
    </div>
  );
}
