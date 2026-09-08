'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function text(formData: FormData, field: string) {
  return String(formData.get(field) ?? '').trim();
}

function dateValue(formData: FormData, field: string) {
  const value = text(formData, field);
  if (!value) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Enter a valid ${field}.`);
  return date;
}

function commitmentData(formData: FormData) {
  const title = text(formData, 'title');
  const amount = Number(formData.get('amount'));
  const projectIdValue = text(formData, 'projectId');
  if (!title || !Number.isFinite(amount) || amount < 0) throw new Error('Enter a title and a valid non-negative amount.');
  const projectId = projectIdValue ? Number(projectIdValue) : null;
  if (projectId !== null && !Number.isInteger(projectId)) throw new Error('Select a valid project.');
  return {
    title,
    amount,
    projectId,
    type: text(formData, 'type') || 'grant',
    status: text(formData, 'status') || 'prospect',
    currency: text(formData, 'currency').toUpperCase() || 'UGX',
    pledgedOn: dateValue(formData, 'pledgedOn'),
    deadline: dateValue(formData, 'deadline'),
    reportDueDate: dateValue(formData, 'reportDueDate'),
    notes: text(formData, 'notes') || null,
  };
}

function refresh(partnerId: number) {
  revalidatePath(`/admin/partners/${partnerId}/edit`);
  revalidatePath('/admin/partners');
  revalidatePath('/admin');
}

export async function createFundingCommitment(formData: FormData) {
  await requireAdmin();
  const partnerId = Number(formData.get('partnerId'));
  if (!Number.isInteger(partnerId)) throw new Error('Select a valid partner.');
  await prisma.fundingCommitment.create({ data: { partnerId, ...commitmentData(formData) } });
  refresh(partnerId);
}

export async function updateFundingCommitment(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) throw new Error('Invalid funding record.');
  const commitment = await prisma.fundingCommitment.update({ where: { id }, data: commitmentData(formData), select: { partnerId: true } });
  refresh(commitment.partnerId);
}

export async function deleteFundingCommitment(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) throw new Error('Invalid funding record.');
  const commitment = await prisma.fundingCommitment.delete({ where: { id }, select: { partnerId: true } });
  refresh(commitment.partnerId);
}
