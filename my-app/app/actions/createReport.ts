'use server';

import { prisma } from '@/lib/prisma';
import { requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { storeDocumentFile } from '@/lib/documentStorage';

export async function createReport(formData: FormData) {
  const user = await requireStaff();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const fileEntry = formData.get('file');
  const uploadedFile = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
  const suppliedUrl = String(formData.get('fileUrl') ?? '').trim();
  const coverImage = formData.get('coverImage') as string;
  const category = formData.get('category') as string;
  const year = parseInt(formData.get('year') as string);
  const projectIdRaw = formData.get('projectId') as string;
  if (!title || !description || (!uploadedFile && !suppliedUrl) || !category || !Number.isInteger(year)) {
    throw new Error('Provide a title, description, category, year, and a report file or URL.');
  }
  if (projectIdRaw) await requireProjectAccess(parseInt(projectIdRaw));
  else if (user.role === 'manager') redirect('/admin/reports');

  const fileUrl = uploadedFile ? await storeDocumentFile(uploadedFile, 'reports') : suppliedUrl;

  await prisma.report.create({
    data: {
      title,
      description,
      fileUrl,
      coverImage: coverImage || null,
      category,
      year,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
      status: user.role === 'manager' ? 'submitted' : 'draft',
    },
  });

  redirect('/admin');
}
