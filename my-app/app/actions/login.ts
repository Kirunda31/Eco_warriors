'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'No account found with that email' };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return { error: 'Incorrect password' };
  }

  const cookieStore = await cookies();
  cookieStore.set('session', user.id.toString(), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
  });

  return { success: true };
}