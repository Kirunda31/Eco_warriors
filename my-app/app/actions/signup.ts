'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { requireAdmin } from '@/lib/auth';

export async function signupUser(formData: FormData) {
  await requireAdmin();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'An account with this email already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      username: email,
      password: hashedPassword,
    },
  });

  return { success: true, userId: newUser.id };
}
