'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { createSessionValue, sessionCookieOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginUser(formData: FormData) {
  const username = (formData.get('username') as string).trim();
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: 'No account found with that username' };
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return { error: 'Incorrect password' };
  }

  const cookieStore = await cookies();
  cookieStore.set('session', createSessionValue(user.id), sessionCookieOptions);

  if (user.role === 'admin') redirect('/admin');
  if (user.role === 'manager') redirect('/admin/programs');
  if (user.role === 'trustee') redirect('/trustee');
  redirect('/');
}
