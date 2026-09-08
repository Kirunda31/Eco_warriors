import { submitVolunteerApplication } from '@/app/actions/submitVolunteerApplication';

export default function GetInvolvedPage() {
  return (
    <div className="bg-amber-50 px-6 py-16 sm:py-20"><div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.85fr_1.15fr]"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Take action</p><h1 className="mt-3 text-4xl font-bold tracking-tight">Volunteer with us.</h1><p className="mt-5 leading-8 text-slate-600">Bring your experience, energy, and ideas to community-led work for people and planet.</p></div><form action={submitVolunteerApplication} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <input type="text" name="name" placeholder="Full name" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <input type="email" name="email" placeholder="Email address" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <input type="text" name="country" placeholder="Country" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <textarea name="skills" placeholder="Skills and experience" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <input type="text" name="interest" placeholder="Area of interest" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <input type="text" name="availability" placeholder="Availability" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <button type="submit" className="rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900">Submit application</button>
      </form></div></div>
  );
}
