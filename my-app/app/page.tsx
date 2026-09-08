import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ProjectGalleryHero from './components/ProjectGalleryHero';

export default async function Home() {
  const [programs, projects, metrics, featuredStory, partners, heroProjects, events] = await Promise.all([
    prisma.program.findMany({ take: 3 }),
    prisma.project.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { gallery: { orderBy: { createdAt: 'desc' }, take: 1, select: { imageUrl: true, caption: true } } },
    }),
    prisma.impactMetric.findMany({
      where: { status: 'published' },
      orderBy: [{ year: 'desc' }, { createdAt: 'asc' }],
      take: 4,
    }),
    prisma.story.findFirst({ where: { status: 'published', OR: [{ projectId: null }, { project: { is: { status: 'active' } } }] } }),
    prisma.partner.findMany({ orderBy: { displayOrder: 'asc' }, take: 6 }),
    prisma.project.findMany({
      where: { status: 'active' },
      orderBy: { title: 'asc' },
      select: {
        title: true,
        slug: true,
        gallery: { orderBy: { createdAt: 'desc' }, take: 1, select: { imageUrl: true, caption: true } },
      },
    }),
    prisma.event.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 2 }),
  ]);
  const heroSlides = heroProjects.flatMap((project) => project.gallery.map((image) => ({
    imageUrl: image.imageUrl,
    caption: image.caption,
    projectName: project.title,
    projectSlug: project.slug,
  })));

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <ProjectGalleryHero slides={heroSlides} />

      {metrics.length > 0 && (
        <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-6 sm:-mt-10">
          <div className="grid overflow-hidden rounded-2xl bg-emerald-900 text-white shadow-xl sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="border-b border-white/15 px-6 py-6 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                <p className="text-3xl font-bold tracking-tight text-amber-200 sm:text-4xl">{metric.value}</p>
                <p className="mt-1 text-sm font-medium text-emerald-100">{metric.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:items-center">
          <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Who we are</p><div className="mt-5 h-1 w-14 rounded-full bg-amber-400" /></div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Local action, lasting change.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">We work alongside communities to protect the environment, expand opportunity, and build resilient livelihoods.</p>
            <Link href="/about" className="mt-5 inline-block font-semibold text-emerald-800 hover:underline">Learn about Eco Warriors →</Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-emerald-50/70 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">What we do</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Our programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/programs/${program.slug}`}
              className="block rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-green-800">{program.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{program.description}</p>
            </Link>
          ))}
        </div>
        <Link href="/programs" className="inline-block mt-7 text-green-800 font-semibold hover:underline">
          View All Programs →
        </Link>
      </div></section>

      {/* Featured Projects */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">In the field</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Featured projects</h2></div><Link href="/projects" className="font-semibold text-emerald-800 hover:underline">View all projects →</Link></div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {project.gallery[0] ? <img src={project.gallery[0].imageUrl} alt={project.gallery[0].caption ?? `${project.title} project activity`} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-48 items-end bg-gradient-to-br from-emerald-900 to-teal-700 p-6"><span className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-100">Eco Warriors</span></div>}
                <div className="p-6"><h3 className="text-lg font-semibold text-emerald-950">{project.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{project.description}</p><span className="mt-5 inline-block text-sm font-semibold text-emerald-800">Discover the project →</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredStory && (
        <section className="bg-emerald-950 px-6 py-16 text-white sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-center"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-200">Story of change</p><p className="mt-4 text-7xl font-serif leading-none text-amber-300">“</p></div><div>
            <h2 className="text-2xl font-bold sm:text-3xl">{featuredStory.headline}</h2>
            <p className="mt-5 text-xl leading-8 text-emerald-50 italic">{featuredStory.quote ?? featuredStory.outcome}</p>
            <p className="mt-6 font-semibold text-amber-200">— {featuredStory.personName}</p>
            <Link href="/stories" className="mt-6 inline-block font-semibold text-white hover:text-amber-200">Read more community stories →</Link>
          </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section className="border-y border-slate-100 bg-slate-50 py-14">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Working with our partners</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Collaboration makes change possible.</h2>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              {partners.map((partner) => <div key={partner.id} className="flex h-20 min-w-36 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 shadow-sm">{partner.logo ? <img src={partner.logo} alt={partner.organizationName} className="max-h-12 max-w-28 object-contain" /> : <span className="text-sm font-semibold text-slate-700">{partner.organizationName}</span>}</div>)}
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Come along</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Upcoming events</h2></div><Link href="/events" className="font-semibold text-emerald-800 hover:underline">See all events →</Link></div><div className="mt-8 grid gap-5 md:grid-cols-2">{events.map((event) => <article key={event.id} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 sm:flex sm:gap-6"><div className="shrink-0 text-center sm:w-20"><p className="text-3xl font-bold text-emerald-800">{event.date.toLocaleDateString('en-UG', { day: '2-digit' })}</p><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">{event.date.toLocaleDateString('en-UG', { month: 'short' })}</p></div><div className="mt-4 sm:mt-0"><h3 className="text-lg font-bold">{event.title}</h3><p className="mt-1 text-sm text-slate-600">{event.time} · {event.location}</p><p className="mt-3 text-sm leading-6 text-slate-600">{event.description}</p></div></article>)}</div></section>
      )}

      {/* Call to Action */}
      <section className="bg-amber-100 px-6 py-16 text-center sm:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-800">Take action today</p><h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">A greener, fairer future starts with all of us.</h2><p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-700">Your time, voice, or contribution can help communities build lasting environmental change.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/donate" className="rounded-full bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900">
            Donate now
          </Link>
          <Link href="/get-involved" className="rounded-full border border-green-800 px-6 py-3 font-semibold text-green-800 hover:bg-amber-50">
            Volunteer with us
          </Link>
        </div>
      </section>
    </div>
  );
}
