'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updateImpactMetric(formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const title = formData.get('title') as string;
  const value = formData.get('value') as string;
  const projectId = Number(formData.get('projectId'));
  const relatedProject = projectId
    ? await prisma.project.findUnique({ where: { id: projectId }, include: { program: true } })
    : null;
  const year = parseInt(formData.get('year') as string);
  const description = formData.get('description') as string;
  const source = formData.get('source') as string;
  const status = formData.get('status') as string;

  await prisma.impactMetric.update({
    where: { id },
    data: { title, value, program: relatedProject?.program.name ?? null, project: relatedProject?.title ?? null, year, description: description || null, source: source || null, status },
  });

  redirect('/admin/impact');
}
