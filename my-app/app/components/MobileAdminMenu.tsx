'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useRef } from 'react';

export default function MobileAdminMenu({ children }: { children: ReactNode }) {
  const menuRef = useRef<HTMLDetailsElement>(null);

  function closeAfterSelection(event: MouseEvent<HTMLDivElement>) {
    if (event.target instanceof Element && event.target.closest('a[href]')) {
      if (menuRef.current) menuRef.current.open = false;
    }
  }

  return (
    <details ref={menuRef} className="relative md:hidden">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-800 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700">
        <span aria-hidden="true" className="text-lg">☰</span><span>Menu</span>
      </summary>
      <div onClick={closeAfterSelection} className="absolute left-0 top-full z-50 mt-2 max-h-[min(75vh,32rem)] w-[min(90vw,22rem)] overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 py-3 shadow-2xl">
        {children}
      </div>
    </details>
  );
}
