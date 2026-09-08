import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const reportMetrics = [
  { value: '10,230', label: 'reusable pads distributed', detail: 'Individual pads delivered through 3,410 reusable-pad kits since 2024.', source: 'Eco Menstruation Impact Report', tone: 'bg-emerald-900 text-white' },
  { value: '250', label: 'girls trained to sew pads', detail: 'Girls hand-trained to make and use their own reusable pads.', source: 'Eco Menstruation Impact Report', tone: 'bg-amber-100 text-emerald-950' },
  { value: '19+', label: 'schools reached', detail: 'School communities reached across Budondo, Buyala, and Buwagi.', source: 'Eco Menstruation Impact Report', tone: 'bg-rose-50 text-emerald-950' },
  { value: '410+', label: 'menstrual-health allies engaged', detail: 'Boys and men included in conversations and action around menstrual health.', source: 'Eco Menstruation Impact Report', tone: 'bg-lime-100 text-emerald-950' },
];

const impactAreas = [
  {
    number: '01',
    eyebrow: 'Opportunity',
    title: 'Period dignity starts with access',
    copy: 'Kick Out Period Poverty has put practical menstrual-health support directly into girls’ hands. Reusable pad kits make it easier for girls to manage their periods with confidence and stay engaged in school.',
    highlights: ['3,410 reusable-pad kits distributed', '10,230 individual reusable pads delivered', '2,000 disposable pads distributed separately through an NRG Radio outreach'],
  },
  {
    number: '02',
    eyebrow: 'Dignity',
    title: 'Skills that last beyond an outreach',
    copy: 'Hands-on pad-making training means girls can make reusable pads themselves. The programme also strengthens local capacity to keep production and peer support close to the communities it serves.',
    highlights: ['250 girls hand-trained to sew their own reusable pads', '4 industrial sewing machines unveiled for local pad production', '90+ peer educators and youth volunteers trained'],
  },
  {
    number: '03',
    eyebrow: 'Circularity',
    title: 'Whole-school reach, shared action',
    copy: 'The work reaches beyond individual distributions. It brings menstrual health into schools and community spaces, helping more people understand that period dignity is everyone’s responsibility.',
    highlights: ['19+ schools reached across Budondo, Buyala, and Buwagi', '410+ boys and men engaged as menstrual-health allies', '11 outreach events delivered'],
  },
  {
    number: '04',
    eyebrow: 'Wellbeing',
    title: 'Keeping girls in school',
    copy: 'By combining access to products, practical skills, and honest conversations, the programme tackles period poverty at its roots—so that menstruation does not have to interrupt a girl’s education.',
    highlights: ['March 2024–June 2026 reporting period', '11 distribution and outreach events detailed in the report', '“No girl should miss school because of her period.”'],
  },
];

export default async function ImpactPage() {
  const metrics = await prisma.impactMetric.findMany({
    where: { status: 'published' },
    orderBy: { year: 'desc' },
  });

  return (
    <main className="overflow-hidden bg-stone-50">
      <section className="relative isolate overflow-hidden bg-emerald-950 px-6 py-20 text-white sm:py-28">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_15%_20%,#84cc16_0,transparent_27%),radial-gradient(circle_at_85%_85%,#fbbf24_0,transparent_25%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-300">Kick Out Period Poverty</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Period dignity belongs in every girl’s future.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50">Through menstrual-health outreach, reusable-pad skills, and community campaigns, Eco Warriors is helping girls stay in school and participate with confidence.</p>
          </div>
          <div className="border-l border-white/20 pl-6 lg:pb-2">
            <p className="text-sm font-semibold text-lime-200">What the reports show</p>
            <p className="mt-3 text-xl leading-8 text-white">Since 2024, 3,410 reusable-pad kits have delivered 10,230 individual pads into girls’ hands.</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-6 sm:-mt-12">
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-emerald-950/10 sm:grid-cols-2 lg:grid-cols-4">
          {reportMetrics.map((metric) => (
            <article key={metric.label} className={`p-6 sm:p-7 ${metric.tone}`}>
              <p className="text-4xl font-bold tracking-tight">{metric.value}</p>
              <h2 className="mt-2 font-bold">{metric.label}</h2>
              <p className="mt-3 text-sm leading-6 opacity-80">{metric.detail}</p>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] opacity-60">{metric.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Where change takes root</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">Impact is more than a number.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Every result represents people learning together, taking action, and making their schools and communities stronger.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {impactAreas.map((area) => (
            <article key={area.number} className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold tracking-[0.18em] text-amber-600">{area.number}</p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">{area.eyebrow}</p>
              </div>
              <h3 className="mt-5 text-2xl font-bold tracking-tight text-emerald-950">{area.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{area.copy}</p>
              <ul className="mt-6 space-y-3 border-t border-emerald-100 pt-6 text-sm font-medium leading-6 text-emerald-900">
                {area.highlights.map((highlight) => <li key={highlight} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lime-500" />{highlight}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-emerald-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Reading the results</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-950">A practical response to period poverty.</h2>
            <p className="mt-5 leading-7 text-slate-600">The Eco Menstruation report documents outreach, pad-making training, and community campaigns in Jinja City and Budondo Division between March 2024 and June 2026.</p>
            <Link href="/reports" className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-800 hover:text-emerald-950 hover:underline">Explore reports and resources <span aria-hidden="true">→</span></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl bg-emerald-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lime-300">Annual Impact Report · 2025</p>
              <h3 className="mt-4 text-xl font-bold">The wider work of Eco Warriors</h3>
              <p className="mt-3 text-sm leading-6 text-emerald-100">The 2025 annual report captures the organisation’s wider work in skills, environmental action, and community partnership.</p>
            </article>
            <article className="rounded-2xl bg-amber-100 p-6 text-emerald-950">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Eco Menstruation Impact Report</p>
              <h3 className="mt-4 text-xl font-bold">Access, skills, and allyship</h3>
              <p className="mt-3 text-sm leading-6 text-emerald-900/80">Details how reusable-pad access, local production, and menstrual-health education work together to keep girls learning.</p>
            </article>
          </div>
        </div>
      </section>

      {metrics.length > 0 && (
        <section className="border-y border-emerald-100 bg-emerald-50/60 px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">More results</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-950">Progress we&apos;re continuing to measure</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((metric) => (
                <article key={metric.id} className="rounded-xl border border-emerald-100 bg-white p-6">
                  <p className="text-3xl font-bold text-emerald-800">{metric.value}</p>
                  <h3 className="mt-2 font-bold text-slate-900">{metric.title}</h3>
                  {metric.description && <p className="mt-3 text-sm leading-6 text-slate-600">{metric.description}</p>}
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-500">{metric.year}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-20 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Keep the momentum going</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl">A healthier, greener future needs all of us.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Your time, partnership, or contribution can help communities keep growing their own solutions.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/get-involved" className="rounded-full bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-900">Get involved</Link>
            <Link href="/donate" className="rounded-full border border-emerald-800 px-6 py-3 font-semibold text-emerald-800 transition hover:bg-emerald-50">Support the work</Link>
          </div>
          <p className="mt-8 text-xs leading-5 text-slate-500">Source: Eco Warriors Initiative 2025 Impact Report and Eco Menstruation Impact Report.</p>
        </div>
      </section>
    </main>
  );
}
