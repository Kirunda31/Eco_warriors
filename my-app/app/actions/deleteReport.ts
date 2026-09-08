'use server';

import { prisma } from '@/lib/prisma';
import { requireReportAccess } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteReport(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await requireReportAccess(id);

  await prisma.report.delete({
    where: { id },
  });

  redirect('/admin');
}
