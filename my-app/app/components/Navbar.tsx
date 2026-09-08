import Link from 'next/link';
import { logoutUser } from '@/app/actions/logout';
import { getSessionUser } from '@/lib/auth';

export default async function Navbar() {
  let isAdmin = false;
  let isLoggedIn = false;

  const user = await getSessionUser();
  if (user) {
    isLoggedIn = true;
    if (user?.role === 'admin' || user?.role === 'manager') {
      isAdmin = true;
    }
  }

  return (
    <header className="border-b border-emerald-950/10 bg-white text-slate-800 shadow-sm">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
        <Link href="/" className="mr-auto flex items-center gap-2 font-bold tracking-tight text-emerald-900">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-800 text-lg text-white">🌿</span>
          <span>Eco Warriors</span>
        </Link>
        <div className="order-3 flex w-full items-center gap-4 overflow-x-auto text-sm font-medium sm:order-2 sm:w-auto">
          <Link href="/about" className="whitespace-nowrap hover:text-emerald-700">About</Link>
          <Link href="/programs" className="whitespace-nowrap hover:text-emerald-700">Programs</Link>
          <Link href="/projects" className="whitespace-nowrap hover:text-emerald-700">Projects</Link>
          <Link href="/impact" className="whitespace-nowrap hover:text-emerald-700">Impact</Link>
          <Link href="/get-involved" className="whitespace-nowrap hover:text-emerald-700">Get involved</Link>
        </div>
        <div className="order-2 flex items-center gap-3 sm:order-3">
          {isAdmin && <Link href="/admin" className="text-sm font-medium hover:text-emerald-700">Admin</Link>}
          {isLoggedIn ? (
            <form action={logoutUser}><button type="submit" className="text-sm font-medium text-emerald-800 hover:text-emerald-950">Log out</button></form>
          ) : null}
          <Link href="/donate" className="rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">Donate</Link>
        </div>
      </nav>
    </header>
  );
}
