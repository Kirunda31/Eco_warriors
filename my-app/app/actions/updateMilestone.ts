'use server';

import { prisma } from '@/lib/prisma';
import { requireMilestoneAccess } from '@/lib/auth';
import { reconcileProjectStatus } from '@/lib/milestones';
import { revalidatePath } from 'next/cache';

function dateValue(value: FormDataEntryValue | null) {
  const date = new Date(`${String(value)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new Error('Enter a valid date.');
  return date;
}

export async function updateMilestone(formData: FormData) {
  const id = Number(formData.get('id'));
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const startDate = dateValue(formData.get('startDate'));
  const endDate = dateValue(formData.get('endDate'));
  const budget = Number(formData.get('budget'));
  if (!Number.isInteger(id) || !title || !description || !Number.isFinite(budget) || budget < 0 || endDate < startDate) throw new Error('Enter complete, valid phase details.');
  await requireMilestoneAccess(id);
  const milestone = await prisma.milestone.update({ where: { id }, data: { title, description, startDate, endDate, budget }, select: { projectId: true } });
  await reconcileProjectStatus(milestone.projectId);
  revalidatePath(`/admin/projects/${milestone.projectId}/edit`);
}
