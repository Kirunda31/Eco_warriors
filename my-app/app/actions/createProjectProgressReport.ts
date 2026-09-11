'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createProjectProgressReport(formData: FormData) {
  const user = await requireStaff();
  const projectId = Number(formData.get('projectId'));
  const reportingPeriod = String(formData.get('reportingPeriod') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim();
  const achievements = String(formData.get('achievements') ?? '').trim();
  const challenges = String(formData.get('challenges') ?? '').trim();
  const nextSteps = String(formData.get('nextSteps') ?? '').trim();
  const evidenceUrl = String(formData.get('evidenceUrl') ?? '').trim();
  const photoUrls = String(formData.get('photoUrls') ?? '').trim();
  const budgetNotes = String(formData.get('budgetNotes') ?? '').trim();
  if (!Number.isInteger(projectId) || !reportingPeriod || !summary || !achievements || !challenges || !nextSteps) throw new Error('Complete all progress-report fields.');
  await requireProjectAccess(projectId);
  await prisma.projectProgressReport.create({ data: { projectId, submittedById: user.id, reportingPeriod, summary, achievements, challenges, nextSteps, evidenceUrl: evidenceUrl || null, photoUrls: photoUrls || null, budgetNotes: budgetNotes || null } });
  redirect('/admin/progress-reports');
}
