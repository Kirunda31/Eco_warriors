'use server';

import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string).trim();
  const username = (formData.get('username') as string).trim();
  const email = (formData.get('email') as string).trim().toLowerCase();
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;
  const programIdValue = formData.get('programId') as string;
  const programId = programIdValue ? Number(programIdValue) : null;

  if (!name || !username || !email || password.length < 8 || !['admin', 'manager', 'trustee'].includes(role)) {
    throw new Error('Provide a name, unique username, email, an 8-character password, and a valid role.');
  }
  if (role === 'manager' && !programId) {
    throw new Error('A program manager must be assigned to a program.');
  }
  if ((role === 'admin' || role === 'trustee') && programId) {
    throw new Error('Only program managers can be assigned a program.');
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
    select: { id: true },
  });
  if (existingUser) throw new Error('That username or email address is already in use.');

  if (programId) {
    const program = await prisma.program.findUnique({
      where: { id: programId },
      select: { managerId: true },
    });
    if (!program || program.managerId) throw new Error('Choose an unassigned program.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, username, email, password: hashedPassword, role },
    });
    if (programId) {
      await tx.program.update({ where: { id: programId }, data: { managerId: user.id } });
    }
  });

  redirect('/admin/users');
}
