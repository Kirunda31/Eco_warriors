import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-lg font-bold">🌿 Eco Warriors Initiative Uganda</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-emerald-100/80">
            Empowering communities through climate action, health, education, and sustainable livelihoods.
          </p>
          <div className="mt-6">
            <p className="text-sm font-semibold text-white">Connect with us</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://www.instagram.com/ecowarriors256?stkn=MXBiY3hzemxmYm03aw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Follow Eco Warriors on Instagram" className="rounded-full border border-emerald-700 px-3 py-1.5 text-sm font-semibold text-emerald-100 transition hover:border-lime-300 hover:bg-emerald-900 hover:text-white">Instagram</a>
              <a href="https://x.com/ecowarriors256?s=11" target="_blank" rel="noopener noreferrer" aria-label="Follow Eco Warriors on X" className="rounded-full border border-emerald-700 px-3 py-1.5 text-sm font-semibold text-emerald-100 transition hover:border-lime-300 hover:bg-emerald-900 hover:text-white">X / Twitter</a>
              <a href="https://www.tiktok.com/@eco.warriors1?_r=1&_t=ZS-99Wv75cScLv" target="_blank" rel="noopener noreferrer" aria-label="Follow Eco Warriors on TikTok" className="rounded-full border border-emerald-700 px-3 py-1.5 text-sm font-semibold text-emerald-100 transition hover:border-lime-300 hover:bg-emerald-900 hover:text-white">TikTok</a>
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-emerald-100/80">
            <Link href="/about" className="hover:text-white">About us</Link>
            <Link href="/programs" className="hover:text-white">Our programs</Link>
            <Link href="/projects" className="hover:text-white">Projects</Link>
            <Link href="/stories" className="hover:text-white">Stories of change</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Take action</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-emerald-100/80">
            <Link href="/get-involved" className="hover:text-white">Volunteer with us</Link>
            <Link href="/partners" className="hover:text-white">Partner with us</Link>
            <Link href="/contact" className="hover:text-white">Contact us</Link>
            <Link href="/donate" className="hover:text-white">Donate</Link>
            <Link href="/newsletter" className="hover:text-white">Newsletter</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-emerald-800 px-6 py-5 text-center text-xs text-emerald-100/70">
        © {new Date().getFullYear()} Eco Warriors Initiative Uganda. All rights reserved.
      </div>
    </footer>
  );
}
