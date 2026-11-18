'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { MAX_STORED_IMAGE_BYTES } from '@/lib/uploadLimits';

export default function GalleryImageUploadForm({ action, children }: { action: (formData: FormData) => void | Promise<void>; children: ReactNode }) {
  const [error, setError] = useState('');

  function validateFiles(event: FormEvent<HTMLFormElement>) {
    const input = event.currentTarget.elements.namedItem('images');
    if (!(input instanceof HTMLInputElement)) return;
    const files = Array.from(input.files ?? []);
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (files.length > 5) {
      event.preventDefault();
      setError('Choose no more than five images.');
      return;
    }
    if (files.some((file) => file.size > MAX_STORED_IMAGE_BYTES) || totalBytes > MAX_STORED_IMAGE_BYTES) {
      event.preventDefault();
      setError('Choose up to five images with a combined size of 4 MB or less.');
      return;
    }
    setError('');
  }

  return (
    <form action={action} onSubmit={validateFiles} className="flex flex-col gap-4">
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {children}
    </form>
  );
}
