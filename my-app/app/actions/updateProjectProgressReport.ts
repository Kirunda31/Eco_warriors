'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectProgressReportAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateProjectProgressReport(formData: FormData) {
  const id = Number(formData.get('id'));
  const reportingPeriod = String(formData.get('reportingPeriod') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim();
  const achievements = String(formData.get('achievements') ?? '').trim();
  const challenges = String(formData.get('challenges') ?? '').trim();
  const nextSteps = String(formData.get('nextSteps') ?? '').trim();
  const evidenceUrl = String(formData.get('evidenceUrl') ?? '').trim();
  if (!Number.isInteger(id) || !reportingPeriod || !summary || !achievements || !challenges || !nextSteps) throw new Error('Complete all progress-report fields.');
  await requireProjectProgressReportAccess(id);
  await prisma.projectProgressReport.update({ where: { id }, data: { reportingPeriod, summary, achievements, challenges, nextSteps, evidenceUrl: evidenceUrl || null } });
  redirect('/admin/progress-reports');
}
