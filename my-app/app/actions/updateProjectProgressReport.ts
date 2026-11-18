'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectProgressReportAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { storeDocumentFile, validateDocumentUploadFiles } from '@/lib/documentStorage';

export async function updateProjectProgressReport(formData: FormData) {
  const id = Number(formData.get('id'));
  const reportingPeriod = String(formData.get('reportingPeriod') ?? '').trim();
  const summary = String(formData.get('summary') ?? '').trim();
  const achievements = String(formData.get('achievements') ?? '').trim();
  const challenges = String(formData.get('challenges') ?? '').trim();
  const nextSteps = String(formData.get('nextSteps') ?? '').trim();
  const evidenceFileEntry = formData.get('evidenceFile');
  const evidenceFile = evidenceFileEntry instanceof File && evidenceFileEntry.size > 0 ? evidenceFileEntry : null;
  const photoFiles = formData.getAll('photoFiles').filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const evidenceUrlInput = String(formData.get('evidenceUrl') ?? '').trim();
  const photoUrlsInput = String(formData.get('photoUrls') ?? '').trim();
  const budgetNotes = String(formData.get('budgetNotes') ?? '').trim();
  if (!Number.isInteger(id) || !reportingPeriod || !summary || !achievements || !challenges || !nextSteps) throw new Error('Complete all progress-report fields.');
  if (photoFiles.length > 5) throw new Error('Choose no more than five photos.');
  validateDocumentUploadFiles([...photoFiles, ...(evidenceFile ? [evidenceFile] : [])]);
  if (photoFiles.some((file) => !['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type))) throw new Error('Use JPEG, PNG, WebP, GIF, or AVIF photos.');
  await requireProjectProgressReportAccess(id);
  const evidenceUrl = evidenceFile ? await storeDocumentFile(evidenceFile, 'reports') : evidenceUrlInput;
  const uploadedPhotoUrls = await Promise.all(photoFiles.map((file) => storeDocumentFile(file, 'reports')));
  const photoUrls = [photoUrlsInput, ...uploadedPhotoUrls].filter(Boolean).join('\n');
  await prisma.projectProgressReport.update({ where: { id }, data: { reportingPeriod, summary, achievements, challenges, nextSteps, evidenceUrl: evidenceUrl || null, photoUrls: photoUrls || null, budgetNotes: budgetNotes || null } });
  redirect('/admin/progress-reports');
}
