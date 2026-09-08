import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== 'production') return 'eco-warriors-development-session-secret-change-before-production';
  throw new Error('SESSION_SECRET must be configured in production.');
}

function signature(payload: string) {
  return createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
}

export function createSessionValue(userId: number) {
  const expiresAt = Math.floor(Date.now() / 1000) + sessionLifetimeSeconds;
  const payload = `${userId}.${expiresAt}`;
  return `${payload}.${signature(payload)}`;
}

async function getSessionUserId() {
  const value = (await cookies()).get('session')?.value;
  if (!value) return null;
  const [id, expiresAt, providedSignature, ...extra] = value.split('.');
  if (extra.length || !id || !expiresAt || !providedSignature || !/^\d+$/.test(id) || !/^\d+$/.test(expiresAt)) return null;
  if (Number(expiresAt) < Math.floor(Date.now() / 1000)) return null;
  const expectedSignature = signature(`${id}.${expiresAt}`);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;
  return Number(id);
}

export async function getSessionUser() {
  const userId = await getSessionUserId();
  return userId ? prisma.user.findUnique({ where: { id: userId } }) : null;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') redirect('/login');
  return user;
}

export async function requireStaff() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) redirect('/login');
  return user;
}

export function isProgramManager(user: { role: string }) {
  return user.role === 'manager';
}

export async function requireProgramAccess(programId: number) {
  const user = await requireStaff();
  if (user.role === 'admin') return user;
  const program = await prisma.program.findFirst({ where: { id: programId, managerId: user.id }, select: { id: true } });
  if (!program) redirect('/admin/programs');
  return user;
}

export async function requireProjectAccess(projectId: number) {
  const user = await requireStaff();
  if (user.role === 'admin') return user;
  const project = await prisma.project.findFirst({
    where: { id: projectId, program: { managerId: user.id } },
    select: { id: true },
  });
  if (!project) redirect('/admin/projects');
  return user;
}

async function requireProjectContentAccess(
  projectId: number | null,
  destination: string,
) {
  const user = await requireStaff();
  if (user.role === 'admin') return user;
  if (!projectId) redirect(destination);
  return requireProjectAccess(projectId);
}

export async function requireMilestoneAccess(id: number) {
  const milestone = await prisma.milestone.findUnique({ where: { id }, select: { projectId: true } });
  return requireProjectContentAccess(milestone?.projectId ?? null, '/admin/projects');
}

export async function requireProjectProgressReportAccess(id: number) {
  const report = await prisma.projectProgressReport.findUnique({ where: { id }, select: { projectId: true } });
  return requireProjectContentAccess(report?.projectId ?? null, '/admin/progress-reports');
}

export async function requireStoryAccess(id: number) {
  const story = await prisma.story.findUnique({ where: { id }, select: { projectId: true } });
  return requireProjectContentAccess(story?.projectId ?? null, '/admin/stories');
}

export async function requireReportAccess(id: number) {
  const report = await prisma.report.findUnique({ where: { id }, select: { projectId: true } });
  return requireProjectContentAccess(report?.projectId ?? null, '/admin/reports');
}

export async function requireGalleryItemAccess(id: number) {
  const item = await prisma.galleryItem.findUnique({ where: { id }, select: { projectId: true } });
  return requireProjectContentAccess(item?.projectId ?? null, '/admin/gallery');
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: sessionLifetimeSeconds,
};
