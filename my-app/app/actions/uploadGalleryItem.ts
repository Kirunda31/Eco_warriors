'use server';

import { prisma } from '@/lib/prisma';
import { s3Client } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function uploadGalleryItem(formData: FormData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    redirect('/login');
  }

  const userId = parseInt(sessionCookie.value);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const file = formData.get('image') as File;
  const caption = formData.get('caption') as string;
  const projectIdRaw = formData.get('projectId') as string;

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileName = `gallery/${Date.now()}-${file.name}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    })
  );

  const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  await prisma.galleryItem.create({
    data: {
      imageUrl,
      caption: caption || null,
      projectId: projectIdRaw ? parseInt(projectIdRaw) : null,
    },
  });

  redirect('/admin');
}