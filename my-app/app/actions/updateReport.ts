'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess, requireReportAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { storeDocumentFile } from '@/lib/documentStorage';
import { storeImage } from '@/lib/imageStorage';

export async function updateReport(formData: FormData) {
  const user = await requireStaff();

  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const fileEntry = formData.get('file');
  const uploadedFile = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
  const suppliedUrl = String(formData.get('fileUrl') ?? '').trim();
  const coverImageUrl = String(formData.get('coverImage') ?? '').trim();
  const coverImageEntry = formData.get('coverImageFile');
  const coverImageFile = coverImageEntry instanceof File && coverImageEntry.size > 0 ? coverImageEntry : null;
  const category = formData.get('category') as string;
  const year = parseInt(formData.get('year') as string);
  const projectIdRaw = formData.get('projectId') as string;
  await requireReportAccess(id);
  if (projectIdRaw) await requireProjectAccess(parseInt(projectIdRaw));
  else if (user.role === 'manager') redirect('/admin/reports');

  const fileUrl = uploadedFile ? await storeDocumentFile(uploadedFile, 'reports') : suppliedUrl;
  if (!fileUrl) throw new Error('Keep the current report URL or upload a new report file.');
  const coverImage = coverImageFile ? await storeImage(coverImageFile) : coverImageUrl || null;

  await prisma.report.update({
    where: { id },
    data: {
      title,
      description,
      fileUrl,
      coverImage,
      category,
      year,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
      status: user.role === 'manager' ? 'submitted' : undefined,
    },
  });

  redirect('/admin');
}
