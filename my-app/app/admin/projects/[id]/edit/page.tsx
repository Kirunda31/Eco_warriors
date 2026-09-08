import { prisma } from '@/lib/prisma';
import { updateProject } from '@/app/actions/updateProject';
import { deleteProject } from '@/app/actions/deleteProject';
import { createMilestone } from '@/app/actions/createMilestone';
import { updateMilestone } from '@/app/actions/updateMilestone';
import { deleteMilestone } from '@/app/actions/deleteMilestone';
import { getMilestoneStatus, reconcileProjectStatus } from '@/lib/milestones';
import { isProgramManager, requireProjectAccess, requireStaff } from '@/lib/auth';

const pill = { planned: 'bg-gray-100 text-gray-700', 'in-progress': 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800' };
const inputDate = (date: Date) => date.toISOString().slice(0, 10);

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  const user = await requireStaff();
  await requireProjectAccess(projectId);
  const project = await prisma.project.findUnique({ where: { id: projectId }, include: { gallery: { select: { id: true, imageUrl: true, caption: true }, orderBy: { createdAt: 'desc' } }, milestones: { orderBy: [{ startDate: 'asc' }, { id: 'asc' }] } } });
  if (!project) return <h1>Project not found</h1>;
  const [automaticStatus, budgetSummary, programs] = await Promise.all([
    reconcileProjectStatus(project.id),
    prisma.milestone.aggregate({ where: { projectId: project.id }, _sum: { budget: true }, _count: true }),
    prisma.program.findMany({ where: isProgramManager(user) ? { managerId: user.id } : {}, select: { id: true, name: true } }),
  ]);
  const status = project.status === 'paused' || project.status === 'cancelled' ? project.status : automaticStatus ?? project.status;
  const projectPill = status === 'completed' ? 'bg-green-100 text-green-800' : status === 'paused' ? 'bg-amber-100 text-amber-800' : status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';

  return <div className="mx-auto max-w-5xl space-y-8">
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold text-green-800">Project implementation plan</p><h1 className="mt-1 text-3xl font-bold">{project.title}</h1><p className="mt-3 max-w-3xl text-gray-600">{project.description}</p></div><span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${projectPill}`}>{status}</span></div>
      <div className="mt-6 rounded-lg bg-green-800 px-5 py-4 text-white sm:flex sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-green-100">Total Planned Budget</p><p className="mt-1 text-3xl font-bold">UGX {(budgetSummary._sum.budget ?? 0).toLocaleString('en-UG')}</p></div><p className="mt-3 text-sm text-green-100 sm:mt-0">{budgetSummary._count} {budgetSummary._count === 1 ? 'phase' : 'phases'} planned</p></div>
      <p className="mt-4 text-sm text-gray-500">Phase status is date-based and automatic. Project status also updates automatically unless paused or cancelled.</p>
    </section>

    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Project details</h2>
      <form action={updateProject} className="mt-5 grid gap-4 md:grid-cols-2"><input type="hidden" name="id" value={project.id} />
        <label className="grid gap-1 text-sm font-medium">Title<input name="title" defaultValue={project.title} required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label><label className="grid gap-1 text-sm font-medium">Slug<input name="slug" defaultValue={project.slug} required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium md:col-span-2">Project description<span className="text-xs font-normal text-gray-500">Include the problem, people served, activities and expected change. Paragraphs are preserved on the public site.</span><textarea name="description" defaultValue={project.description} required rows={7} className="rounded border border-gray-300 px-3 py-2 font-normal" /></label><label className="grid gap-1 text-sm font-medium">Location<input name="location" defaultValue={project.location} required className="rounded border border-gray-300 px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Program<select name="programId" defaultValue={project.programId} required className="rounded border border-gray-300 px-3 py-2 font-normal">{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Hero background image<select name="heroImageUrl" defaultValue={project.heroImageUrl ?? ''} className="rounded border border-gray-300 px-3 py-2 font-normal"><option value="">No background image</option>{project.gallery.map((image) => <option key={image.id} value={image.imageUrl}>{image.caption || `Gallery image #${image.id}`}</option>)}</select></label>
        <label className="grid gap-1 text-sm font-medium">Project status<select name="status" defaultValue={project.status === 'paused' || project.status === 'cancelled' ? project.status : 'resume'} className="rounded border border-gray-300 px-3 py-2 font-normal"><option value="paused">Paused</option><option value="cancelled">Cancelled</option><option value="resume">Resume (return to automatic status)</option></select></label>
        <div className="md:col-span-2"><button type="submit" className="rounded bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900">Save project</button></div>
      </form>
    </section>

    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Milestone phases</h2><p className="mt-1 text-sm text-gray-500">Add, edit, or remove the phases that make up this project plan.</p>
      <form action={createMilestone} className="mt-6 grid gap-3 rounded-lg border border-green-100 bg-green-50 p-4 md:grid-cols-2"><input type="hidden" name="projectId" value={project.id} />
        <label className="grid gap-1 text-sm font-medium">Phase title<input name="title" required className="rounded border border-gray-300 bg-white px-3 py-2 font-normal" /></label><label className="grid gap-1 text-sm font-medium">Budget (UGX)<input name="budget" type="number" min="0" step="0.01" required className="rounded border border-gray-300 bg-white px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium">Start date<input name="startDate" type="date" required className="rounded border border-gray-300 bg-white px-3 py-2 font-normal" /></label><label className="grid gap-1 text-sm font-medium">End date<input name="endDate" type="date" required className="rounded border border-gray-300 bg-white px-3 py-2 font-normal" /></label>
        <label className="grid gap-1 text-sm font-medium md:col-span-2">Description<textarea name="description" required className="min-h-20 rounded border border-gray-300 bg-white px-3 py-2 font-normal" /></label><div><button type="submit" className="rounded bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900">+ Add Phase</button></div>
      </form>
      <div className="mt-6 space-y-4">{project.milestones.map((milestone) => { const milestoneStatus = getMilestoneStatus(milestone); return <article key={milestone.id} className="rounded-lg border border-gray-200 p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-bold">{milestone.title}</h3><p className="mt-1 text-sm text-gray-500">{milestone.startDate.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })} – {milestone.endDate.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${pill[milestoneStatus]}`}>{milestoneStatus.replace('-', ' ')}</span></div><p className="mt-3 text-gray-600">{milestone.description}</p><p className="mt-3 font-semibold text-green-800">Budget: UGX {milestone.budget.toLocaleString('en-UG')}</p><details className="mt-4"><summary className="cursor-pointer text-sm font-semibold text-green-800">Edit phase</summary><form action={updateMilestone} className="mt-4 grid gap-3 md:grid-cols-2"><input type="hidden" name="id" value={milestone.id} /><label className="grid gap-1 text-sm">Title<input name="title" defaultValue={milestone.title} required className="rounded border border-gray-300 px-3 py-2" /></label><label className="grid gap-1 text-sm">Budget (UGX)<input name="budget" type="number" min="0" step="0.01" defaultValue={milestone.budget} required className="rounded border border-gray-300 px-3 py-2" /></label><label className="grid gap-1 text-sm">Start date<input name="startDate" type="date" defaultValue={inputDate(milestone.startDate)} required className="rounded border border-gray-300 px-3 py-2" /></label><label className="grid gap-1 text-sm">End date<input name="endDate" type="date" defaultValue={inputDate(milestone.endDate)} required className="rounded border border-gray-300 px-3 py-2" /></label><label className="grid gap-1 text-sm md:col-span-2">Description<textarea name="description" defaultValue={milestone.description} required className="min-h-20 rounded border border-gray-300 px-3 py-2" /></label><div><button type="submit" className="rounded bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-900">Save phase</button></div></form></details><form action={deleteMilestone} className="mt-3"><input type="hidden" name="id" value={milestone.id} /><button type="submit" className="text-sm font-semibold text-red-700 hover:underline">Delete phase</button></form></article>; })}{!project.milestones.length && <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No phases yet. Add the first phase above.</p>}</div>
    </section>
    <form action={deleteProject}><input type="hidden" name="id" value={project.id} /><button type="submit" className="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">Delete project</button></form>
  </div>;
}
