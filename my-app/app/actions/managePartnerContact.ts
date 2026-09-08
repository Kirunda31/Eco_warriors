'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function text(formData: FormData, field: string) {
  return String(formData.get(field) ?? '').trim();
}

function partnerPath(partnerId: number) {
  return `/admin/partners/${partnerId}/edit`;
}

export async function createPartnerContact(formData: FormData) {
  await requireAdmin();
  const partnerId = Number(formData.get('partnerId'));
  const name = text(formData, 'name');
  if (!Number.isInteger(partnerId) || !name) throw new Error('Enter a partner and contact name.');
  await prisma.partnerContact.create({
    data: {
      partnerId,
      name,
      title: text(formData, 'title') || null,
      email: text(formData, 'email') || null,
      phone: text(formData, 'phone') || null,
      notes: text(formData, 'notes') || null,
      isPrimary: formData.get('isPrimary') === 'on',
    },
  });
  revalidatePath(partnerPath(partnerId));
  revalidatePath('/admin/partners');
}

export async function updatePartnerContact(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  const name = text(formData, 'name');
  if (!Number.isInteger(id) || !name) throw new Error('Enter a valid contact name.');
  const contact = await prisma.partnerContact.update({
    where: { id },
    data: { name, title: text(formData, 'title') || null, email: text(formData, 'email') || null, phone: text(formData, 'phone') || null, notes: text(formData, 'notes') || null, isPrimary: formData.get('isPrimary') === 'on' },
    select: { partnerId: true },
  });
  revalidatePath(partnerPath(contact.partnerId));
  revalidatePath('/admin/partners');
}

export async function deletePartnerContact(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) throw new Error('Invalid contact.');
  const contact = await prisma.partnerContact.delete({ where: { id }, select: { partnerId: true } });
  revalidatePath(partnerPath(contact.partnerId));
  revalidatePath('/admin/partners');
}
