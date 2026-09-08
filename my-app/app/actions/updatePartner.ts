'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updatePartner(formData: FormData) {
  await requireAdmin();

  const id = parseInt(formData.get('id') as string);
  const organizationName = formData.get('organizationName') as string;
  const logo = formData.get('logo') as string;
  const description = formData.get('description') as string;
  const website = formData.get('website') as string;
  const partnershipType = formData.get('partnershipType') as string;
  const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;

  await prisma.partner.update({
    where: { id },
    data: { organizationName, logo: logo || null, description, website: website || null, partnershipType, displayOrder },
  });

  redirect(`/admin/partners/${id}/edit`);
}
