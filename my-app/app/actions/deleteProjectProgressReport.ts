'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectProgressReportAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteProjectProgressReport(formData: FormData) {
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) throw new Error('Invalid progress report.');
  await requireProjectProgressReportAccess(id);
  await prisma.projectProgressReport.delete({ where: { id } });
  redirect('/admin/progress-reports');
}
