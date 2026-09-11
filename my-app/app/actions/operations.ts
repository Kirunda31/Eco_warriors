'use server';

import { prisma } from '@/lib/prisma';
import { requireAdmin, requireProjectAccess, requireStaff } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { s3Client } from '@/lib/s3';

const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();
const optionalDate = (value: string) => value ? new Date(`${value}T00:00:00.000Z`) : null;

export async function createBeneficiarySession(formData: FormData) {
  await requireStaff();
  const projectId = Number(text(formData, 'projectId'));
  const beneficiaryCount = Number(text(formData, 'beneficiaryCount'));
  const sessionDate = optionalDate(text(formData, 'sessionDate'));
  if (!Number.isInteger(projectId) || !Number.isInteger(beneficiaryCount) || beneficiaryCount < 0 || !sessionDate || !text(formData, 'organisation') || !text(formData, 'location') || !text(formData, 'sessionType')) throw new Error('Complete all beneficiary-session fields.');
  await requireProjectAccess(projectId);
  await prisma.beneficiarySession.create({ data: { projectId, beneficiaryCount, sessionDate, organisation: text(formData, 'organisation'), location: text(formData, 'location'), sessionType: text(formData, 'sessionType'), notes: text(formData, 'notes') || null } });
  redirect('/admin/beneficiaries');
}

export async function createDeliveryRecord(formData: FormData) {
  await requireStaff();
  const projectId = Number(text(formData, 'projectId'));
  const quantity = Number(text(formData, 'quantity'));
  const activityDate = optionalDate(text(formData, 'activityDate'));
  if (!Number.isInteger(projectId) || !Number.isInteger(quantity) || quantity < 0 || !activityDate || !text(formData, 'metricType')) throw new Error('Complete all delivery-record fields.');
  await requireProjectAccess(projectId);
  await prisma.deliveryRecord.create({ data: { projectId, quantity, activityDate, metricType: text(formData, 'metricType'), evidenceUrl: text(formData, 'evidenceUrl') || null, notes: text(formData, 'notes') || null } });
  redirect('/admin/delivery');
}

export async function reviewDeliveryRecord(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, 'id'));
  const status = text(formData, 'status');
  if (!Number.isInteger(id) || !['approved', 'rejected', 'submitted'].includes(status)) throw new Error('Invalid delivery-record review.');
  await prisma.deliveryRecord.update({ where: { id }, data: { status } });
  redirect('/admin/approvals');
}

export async function createDocument(formData: FormData) {
  const user = await requireStaff();
  const projectIdRaw = text(formData, 'projectId');
  const projectId = projectIdRaw ? Number(projectIdRaw) : null;
  const file = formData.get('file');
  const uploadedFile = file instanceof File && file.size > 0 ? file : null;
  const suppliedUrl = text(formData, 'fileUrl');
  if (!text(formData, 'title') || (!suppliedUrl && !uploadedFile) || !text(formData, 'category') || (projectIdRaw && !Number.isInteger(projectId))) throw new Error('Provide a title, category, and document file or URL.');
  if (uploadedFile && uploadedFile.size > 20 * 1024 * 1024) throw new Error('Documents must be 20 MB or smaller.');
  if (projectId) await requireProjectAccess(projectId);
  else if (user.role !== 'admin') throw new Error('Programme managers must link documents to their project.');
  let fileUrl = suppliedUrl;
  if (uploadedFile) {
    const extension = uploadedFile.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'file';
    const key = `documents/${Date.now()}-${randomUUID()}.${extension}`;
    await s3Client.send(new PutObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key, Body: Buffer.from(await uploadedFile.arrayBuffer()), ContentType: uploadedFile.type || 'application/octet-stream' }));
    fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }
  await prisma.document.create({ data: { title: text(formData, 'title'), fileUrl, category: text(formData, 'category'), description: text(formData, 'description') || null, visibility: text(formData, 'visibility') === 'public' ? 'public' : 'internal', projectId } });
  redirect('/admin/documents');
}

export async function reviewDocument(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, 'id'));
  const status = text(formData, 'status');
  if (!Number.isInteger(id) || !['approved', 'rejected', 'submitted'].includes(status)) throw new Error('Invalid document review.');
  await prisma.document.update({ where: { id }, data: { status } });
  redirect('/admin/approvals');
}

export async function reviewProgressReport(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, 'id'));
  const status = text(formData, 'status');
  if (!Number.isInteger(id) || !['approved', 'rejected', 'submitted'].includes(status)) throw new Error('Invalid report review.');
  await prisma.projectProgressReport.update({ where: { id }, data: { status } });
  redirect('/admin/approvals');
}

export async function createReminder(formData: FormData) {
  const user = await requireStaff();
  const projectIdRaw = text(formData, 'projectId');
  const projectId = projectIdRaw ? Number(projectIdRaw) : null;
  const dueDate = optionalDate(text(formData, 'dueDate'));
  if (!text(formData, 'title') || !text(formData, 'type') || !dueDate || (projectIdRaw && !Number.isInteger(projectId))) throw new Error('Complete all reminder fields.');
  if (projectId) await requireProjectAccess(projectId);
  else if (user.role !== 'admin') throw new Error('Programme managers must link reminders to their project.');
  await prisma.reminder.create({ data: { title: text(formData, 'title'), type: text(formData, 'type'), dueDate, notes: text(formData, 'notes') || null, projectId } });
  redirect('/admin/reminders');
}

export async function updateReminderStatus(formData: FormData) {
  const user = await requireStaff();
  const id = Number(text(formData, 'id'));
  const status = text(formData, 'status');
  if (!Number.isInteger(id) || !['open', 'done', 'dismissed'].includes(status)) throw new Error('Invalid reminder status.');
  const reminder = await prisma.reminder.findUnique({ where: { id }, select: { projectId: true } });
  if (!reminder) throw new Error('Reminder not found.');
  if (reminder.projectId) await requireProjectAccess(reminder.projectId);
  else if (user.role !== 'admin') throw new Error('Not authorized.');
  await prisma.reminder.update({ where: { id }, data: { status } });
  redirect('/admin/reminders');
}

export async function createVolunteerAssignment(formData: FormData) {
  await requireAdmin();
  const volunteerId = Number(text(formData, 'volunteerId'));
  const projectIdRaw = text(formData, 'projectId');
  const projectId = projectIdRaw ? Number(projectIdRaw) : null;
  if (!Number.isInteger(volunteerId) || (projectIdRaw && !Number.isInteger(projectId)) || !text(formData, 'role')) throw new Error('Complete all assignment fields.');
  await prisma.volunteerAssignment.create({ data: { volunteerId, projectId, role: text(formData, 'role'), startDate: optionalDate(text(formData, 'startDate')), endDate: optionalDate(text(formData, 'endDate')), attendance: text(formData, 'attendance') || 'pending', certificateUrl: text(formData, 'certificateUrl') || null, notes: text(formData, 'notes') || null } });
  redirect('/admin/volunteers');
}

export async function updateVolunteerAssignment(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, 'id'));
  const attendance = text(formData, 'attendance');
  const certificateUrl = text(formData, 'certificateUrl');
  if (!Number.isInteger(id) || !['pending', 'present', 'completed', 'absent'].includes(attendance)) throw new Error('Invalid assignment update.');
  await prisma.volunteerAssignment.update({ where: { id }, data: { attendance, certificateUrl: certificateUrl || null } });
  redirect('/admin/volunteers');
}

export async function reviewStory(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, 'id')); const status = text(formData, 'status');
  if (!Number.isInteger(id) || !['approved', 'rejected', 'submitted'].includes(status)) throw new Error('Invalid story review.');
  await prisma.story.update({ where: { id }, data: { status: status === 'approved' ? 'published' : status } });
  redirect('/admin/approvals');
}

export async function reviewReport(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, 'id')); const status = text(formData, 'status');
  if (!Number.isInteger(id) || !['approved', 'rejected', 'submitted'].includes(status)) throw new Error('Invalid report review.');
  await prisma.report.update({ where: { id }, data: { status: status === 'approved' ? 'published' : status } });
  redirect('/admin/approvals');
}

export async function reviewImpactMetric(formData: FormData) {
  await requireAdmin();
  const id = Number(text(formData, 'id')); const status = text(formData, 'status');
  if (!Number.isInteger(id) || !['approved', 'rejected', 'draft'].includes(status)) throw new Error('Invalid metric review.');
  await prisma.impactMetric.update({ where: { id }, data: { status: status === 'approved' ? 'published' : status } });
  redirect('/admin/approvals');
}
