'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function NavigationFeedback() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsLoading(false);
    document.documentElement.style.cursor = '';
    if (timeout.current) clearTimeout(timeout.current);

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href]');
      if (!(link instanceof HTMLAnchorElement) || link.target || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname && destination.search === window.location.search) return;

      setIsLoading(true);
      document.documentElement.style.cursor = 'progress';
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setIsLoading(false);
        document.documentElement.style.cursor = '';
      }, 12000);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      document.documentElement.style.cursor = '';
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div role="status" aria-live="polite" className="fixed inset-x-0 top-0 z-[100]">
      <div className="h-1 overflow-hidden bg-emerald-100">
        <div className="h-full w-1/3 animate-pulse bg-emerald-700" />
      </div>
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
