'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { MAX_FEATURED_IMAGE_BYTES } from '@/lib/uploadLimits';

type FeaturedImageFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  className?: string;
};

export default function FeaturedImageForm({ action, children, className }: FeaturedImageFormProps) {
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const image = formData.get('featuredImage');
    if (image instanceof File && image.size > MAX_FEATURED_IMAGE_BYTES) {
      event.preventDefault();
      setError('Choose an image that is 4 MB or smaller, then submit again.');
      return;
    }
    setError('');
  }

  return (
    <form action={action} onSubmit={handleSubmit} encType="multipart/form-data" className={className}>
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {children}
    </form>
  );
}
