'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess } from '@/lib/auth';
import { reconcileProjectStatus } from '@/lib/milestones';
import { revalidatePath } from 'next/cache';

function dateValue(value: FormDataEntryValue | null) {
  const date = new Date(`${String(value)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new Error('Enter a valid date.');
  return date;
}

export async function createMilestone(formData: FormData) {
  const projectId = Number(formData.get('projectId'));
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const startDate = dateValue(formData.get('startDate'));
  const endDate = dateValue(formData.get('endDate'));
  const budget = Number(formData.get('budget'));
  if (!Number.isInteger(projectId) || !title || !description || !Number.isFinite(budget) || budget < 0 || endDate < startDate) throw new Error('Enter complete, valid phase details.');
  await requireProjectAccess(projectId);
  await prisma.milestone.create({ data: { projectId, title, description, startDate, endDate, budget } });
  await reconcileProjectStatus(projectId);
  revalidatePath(`/admin/projects/${projectId}/edit`);
}
