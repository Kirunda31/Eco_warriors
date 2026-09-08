import type { Metadata } from 'next';
import Link from 'next/link';
import { submitDonationInterest } from '@/app/actions/submitDonationInterest';

export const metadata: Metadata = { title: 'Donate' };

export default async function DonatePage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;

  return (
    <div className="bg-emerald-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Support our work</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Help communities create lasting change.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Your support helps Eco Warriors grow community-led climate action, education, health, and sustainable livelihood initiatives.</p>
        <p className="mt-8 rounded-xl bg-amber-50 p-5 text-sm leading-6 text-slate-700">Online payment details are being prepared. Tell us how you would like to give and the team will share the right payment details.</p>
        {status === 'received' ? <div className="mt-6 rounded-xl bg-lime-100 p-5 text-sm text-emerald-950"><p className="font-bold">Thank you for choosing to support our work.</p><p className="mt-1">The Eco Warriors team will contact you with payment details.</p></div> : <form action={submitDonationInterest} className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2"><input name="name" required placeholder="Full name" className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700" /><input name="email" type="email" required placeholder="Email address" className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700" /><div className="grid grid-cols-[0.7fr_1.3fr] gap-3"><select name="currency" defaultValue="UGX" className="rounded-lg border border-slate-300 px-3 py-3"><option>UGX</option><option>USD</option><option>GBP</option><option>EUR</option></select><input name="amount" inputMode="decimal" placeholder="Amount (optional)" className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700" /></div><input name="note" placeholder="What would you like to support?" className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-700" /><button type="submit" className="sm:col-span-2 rounded-full bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900">Request payment details</button></form>}
        {status === 'invalid' && <p className="mt-4 text-sm font-medium text-red-700">Please enter your name and a valid email address.</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/contact" className="font-semibold text-emerald-800 hover:underline">Other ways to partner</Link><Link href="/get-involved" className="font-semibold text-emerald-800 hover:underline">Volunteer instead</Link></div>
      </div>
    </div>
  );
}
