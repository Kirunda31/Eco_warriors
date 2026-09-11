import { prisma } from '@/lib/prisma';
import { registerForEvent } from '@/app/actions/registerForEvent';

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
  });

  return <div><section className="bg-amber-50 px-6 py-16 sm:py-20"><div className="mx-auto max-w-6xl"><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Join the conversation</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Events and activities.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Find upcoming ways to learn, collaborate, and take action with Eco Warriors.</p></div></section><section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">{status === 'registered' && <div className="mb-6 rounded-xl bg-lime-100 p-4 text-sm font-medium text-emerald-950">Thanks for registering your interest. The Eco Warriors team will be in touch.</div>}{status === 'invalid' && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">Please enter your name and a valid email address.</div>}<div className="flex flex-col gap-5">
        {events.map((event) => (
          <article key={event.id} className="overflow-hidden rounded-xl border border-slate-200 shadow-sm sm:flex sm:gap-8">
            {event.featuredImage && <img src={event.featuredImage} alt={event.title} className="h-52 w-full object-cover sm:h-auto sm:w-64" />}<div className="p-6 sm:pl-0"><div className="shrink-0 text-sm font-bold uppercase tracking-wide text-emerald-700">{event.date.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' })}</div><div>
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{event.time} · {event.location}</p><p className="mt-3 leading-7 text-slate-600">{event.description}</p>
            {event.registrationLink && (
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 font-semibold text-emerald-800 hover:underline">Register →</a>
            )}
            {!event.registrationLink && <details className="mt-4"><summary className="cursor-pointer font-semibold text-emerald-800 hover:underline">Register your interest →</summary><form action={registerForEvent} className="mt-4 flex flex-col gap-3 rounded-lg bg-emerald-50 p-4"><input type="hidden" name="eventId" value={event.id} /><input type="text" name="name" required placeholder="Full name" className="rounded border border-slate-300 px-3 py-2" /><input type="email" name="email" required placeholder="Email address" className="rounded border border-slate-300 px-3 py-2" /><button type="submit" className="self-start rounded-full bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">Register interest</button></form></details>}
            </div></div></article>
        ))}
      </div>{events.length === 0 && <p className="text-slate-600">Events will be announced here soon.</p>}</section></div>;
}
