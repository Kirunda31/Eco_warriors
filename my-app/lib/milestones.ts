import 'server-only';

import { prisma } from '@/lib/prisma';

export type MilestoneStatus = 'planned' | 'in-progress' | 'completed';

function dayStamp(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function getMilestoneStatus(milestone: { startDate: Date; endDate: Date }, today = new Date()): MilestoneStatus {
  const currentDay = dayStamp(today);
  if (currentDay < dayStamp(milestone.startDate)) return 'planned';
  if (currentDay > dayStamp(milestone.endDate)) return 'completed';
  return 'in-progress';
}

export async function reconcileProjectStatus(projectId: number) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { status: true } });
  if (!project || project.status === 'paused' || project.status === 'cancelled') return project?.status;

  const today = new Date();
  const milestoneCount = await prisma.milestone.count({ where: { projectId } });
  const incompleteCount = milestoneCount === 0 ? 0 : await prisma.milestone.count({
    where: { projectId, endDate: { gte: new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())) } },
  });
  const status = milestoneCount > 0 && incompleteCount === 0 ? 'completed' : 'active';
  if (project.status !== status) await prisma.project.update({ where: { id: projectId }, data: { status } });
  return status;
}
