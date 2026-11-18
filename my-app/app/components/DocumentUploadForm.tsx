'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { MAX_DOCUMENT_UPLOAD_BYTES } from '@/lib/uploadLimits';

export default function DocumentUploadForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}) {
  const [error, setError] = useState('');

  function validateFiles(event: FormEvent<HTMLFormElement>) {
    const files = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="file"]'))
      .flatMap((input) => Array.from(input.files ?? []));
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (files.some((file) => file.size > MAX_DOCUMENT_UPLOAD_BYTES) || totalBytes > MAX_DOCUMENT_UPLOAD_BYTES) {
      event.preventDefault();
      setError('Choose files with a combined size of 4 MB or less.');
      return;
    }
    setError('');
  }

  return (
    <form action={action} onSubmit={validateFiles} encType="multipart/form-data" className={className}>
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {children}
    </form>
  );
}
