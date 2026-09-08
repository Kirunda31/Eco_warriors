import { prisma } from '@/lib/prisma';
import { updateImpactMetric } from '@/app/actions/updateImpactMetric';
import { deleteImpactMetric } from '@/app/actions/deleteImpactMetric';
import { requireAdmin } from '@/lib/auth';

export default async function EditImpactMetricPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const metric = await prisma.impactMetric.findUnique({ where: { id: parseInt(id) } });
  if (!metric) return <h1>Metric not found</h1>;
  const projects = await prisma.project.findMany({
    where: { status: 'active' },
    include: { program: true },
    orderBy: { title: 'asc' },
  });

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Impact Metric</h1>
      <form action={updateImpactMetric} className="flex flex-col gap-4 mb-6">
        <input type="hidden" name="id" value={metric.id} />
        <input type="text" name="title" defaultValue={metric.title} required className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="value" defaultValue={metric.value} required className="border border-gray-300 rounded px-3 py-2" />
        <select name="projectId" defaultValue={projects.find((project) => project.title === metric.project)?.id ?? ''} className="border border-gray-300 rounded px-3 py-2">
          <option value="">Organisation-wide metric</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.title} · {project.program.name}</option>)}
        </select>
        <input type="number" name="year" defaultValue={metric.year} required className="border border-gray-300 rounded px-3 py-2" />
        <textarea name="description" defaultValue={metric.description ?? ''} className="border border-gray-300 rounded px-3 py-2" />
        <input type="text" name="source" defaultValue={metric.source ?? ''} className="border border-gray-300 rounded px-3 py-2" />
        <select name="status" defaultValue={metric.status} className="border border-gray-300 rounded px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <button type="submit" className="bg-green-800 text-white rounded px-4 py-2 hover:bg-green-900">Save Changes</button>
      </form>
      <form action={deleteImpactMetric}>
        <input type="hidden" name="id" value={metric.id} />
        <button type="submit" className="bg-red-700 text-white rounded px-4 py-2 hover:bg-red-800">Delete Metric</button>
      </form>
    </div>
  );
}
