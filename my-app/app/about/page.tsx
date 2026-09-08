import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About us' };

export default function AboutPage() {
  return (
    <div>
      <section className="bg-emerald-900 px-6 py-20 text-center text-white">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">About Eco Warriors</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Building a future where people and nature thrive together.</h1>
      </section>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:py-20 md:grid-cols-2">
        <div><h2 className="text-2xl font-bold">Our mission</h2><p className="mt-4 leading-7 text-slate-600">To empower communities through practical climate action, health, education, and sustainable livelihood initiatives.</p></div>
        <div><h2 className="text-2xl font-bold">Our vision</h2><p className="mt-4 leading-7 text-slate-600">A resilient Uganda where communities are equipped to care for the environment and create dignified, sustainable futures.</p></div>
      </section>
      <section className="bg-emerald-50 px-6 py-16"><div className="mx-auto max-w-5xl"><h2 className="text-2xl font-bold">How we work</h2><div className="mt-6 grid gap-4 sm:grid-cols-3"><p className="rounded-xl bg-white p-5 shadow-sm"><strong>Listen locally.</strong><br /><span className="text-sm text-slate-600">Community priorities guide our work.</span></p><p className="rounded-xl bg-white p-5 shadow-sm"><strong>Act together.</strong><br /><span className="text-sm text-slate-600">We build partnerships that turn ideas into action.</span></p><p className="rounded-xl bg-white p-5 shadow-sm"><strong>Grow lasting change.</strong><br /><span className="text-sm text-slate-600">We strengthen skills, resilience, and opportunity.</span></p></div><Link href="/about/leadership" className="mt-8 inline-block font-semibold text-emerald-800 hover:underline">Meet our leadership →</Link></div></section>
    </div>
  );
}
