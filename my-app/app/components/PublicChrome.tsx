'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function PublicChrome({ children, navbar, footer }: { children: ReactNode; navbar: ReactNode; footer: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && navbar}
      <main className="flex-1">{children}</main>
      {!isAdmin && footer}
    </>
  );
}
