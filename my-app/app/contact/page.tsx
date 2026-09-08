import { submitContactMessage } from '@/app/actions/submitContactMessage';

export default function ContactPage() {
  return (
    <div className="bg-emerald-50 px-6 py-16 sm:py-20"><div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.85fr_1.15fr]"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Get in touch</p><h1 className="mt-3 text-4xl font-bold tracking-tight">Contact us.</h1><p className="mt-5 leading-8 text-slate-600">Have a question, partnership idea, or message for the Eco Warriors team? We would love to hear from you.</p></div><form action={submitContactMessage} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <input type="text" name="name" placeholder="Full name" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <input type="email" name="email" placeholder="Email address" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" />
        <select name="category" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600">
          <option value="">Select enquiry type</option>
          <option value="Partnership">Partnership</option>
          <option value="Volunteering">Volunteering</option>
          <option value="Media">Media</option>
          <option value="Donation">Donation</option>
          <option value="General">General</option>
        </select>
        <textarea name="message" placeholder="Your message" required className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600" rows={5} />
        <button type="submit" className="rounded-full bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-900">Send message</button>
      </form></div></div>
  );
}
