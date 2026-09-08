import Link from 'next/link';
import { subscribeNewsletter } from '@/app/actions/subscribeNewsletter';

export default async function NewsletterPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;

  return (
    <div className="bg-emerald-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Stay connected</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-emerald-950">Get Eco Warriors updates.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">Receive stories from the field, upcoming opportunities, and news about community-led action.</p>
        {status === 'subscribed' ? (
          <div className="mt-8 rounded-xl bg-lime-100 p-5 text-emerald-950"><p className="font-bold">You&apos;re on the list.</p><p className="mt-1 text-sm">Thank you for staying connected with Eco Warriors.</p></div>
        ) : (
          <form action={subscribeNewsletter} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input name="email" type="email" required placeholder="Email address" className="min-w-0 flex-1 rounded-full border border-slate-300 px-5 py-3 outline-none focus:border-emerald-700" />
            <button type="submit" className="rounded-full bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-900">Subscribe</button>
          </form>
        )}
        {status === 'invalid' && <p className="mt-4 text-sm font-medium text-red-700">Please enter a valid email address.</p>}
        <Link href="/" className="mt-8 inline-block text-sm font-semibold text-emerald-800 hover:underline">Back to home →</Link>
      </div>
    </div>
  );
}
