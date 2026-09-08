'use server';

import { prisma } from '@/lib/prisma';
import { requireMilestoneAccess } from '@/lib/auth';
import { reconcileProjectStatus } from '@/lib/milestones';
import { revalidatePath } from 'next/cache';

export async function deleteMilestone(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) throw new Error('Invalid phase.');
  await requireMilestoneAccess(id);
  const milestone = await prisma.milestone.delete({ where: { id }, select: { projectId: true } });
  await reconcileProjectStatus(milestone.projectId);
  revalidatePath(`/admin/projects/${milestone.projectId}/edit`);
}
