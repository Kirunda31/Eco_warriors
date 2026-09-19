import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Route params retain percent-encoding for some URL-safe characters (such as
  // spaces). Database slugs are stored in their human-entered form, so decode
  // the path segment before using it in the lookup.
  let storySlug: string;
  try {
    storySlug = decodeURIComponent(slug);
  } catch {
    notFound();
  }
  const story = await prisma.story.findFirst({
    where: { slug: storySlug, status: 'published', OR: [{ projectId: null }, { project: { is: { status: 'active' } } }] },
    include: { project: true },
  });

  if (!story) notFound();

  return (
    <div>
      <section className="bg-emerald-950 px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-4xl">
          <Link href="/stories" className="text-sm font-semibold text-emerald-200 hover:text-white">← All stories</Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-lime-300">{story.project?.title ?? 'Eco Warriors Initiative'}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{story.headline}</h1>
          <p className="mt-6 text-lg font-semibold text-emerald-100">{story.personName}</p>
          {story.quote && <blockquote className="mt-8 max-w-3xl border-l-2 border-lime-300 pl-5 text-xl italic leading-8 text-white">“{story.quote}”</blockquote>}
        </div>
      </section>
      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        {story.photoUrl && <img src={story.photoUrl} alt={`Photo accompanying ${story.headline}`} className="mb-12 h-80 w-full rounded-2xl object-cover shadow-sm" />}
        <div className="grid gap-5 md:grid-cols-3"><section className="rounded-xl bg-rose-50 p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-rose-700">The challenge</p><p className="mt-3 text-sm leading-6 text-slate-700">{story.challenge}</p></section><section className="rounded-xl bg-amber-50 p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800">The response</p><p className="mt-3 text-sm leading-6 text-slate-700">{story.intervention}</p></section><section className="rounded-xl bg-lime-100 p-6"><p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">The outcome</p><p className="mt-3 text-sm leading-6 text-slate-700">{story.outcome}</p></section></div>
        <div className="mt-12 whitespace-pre-line text-lg leading-8 text-slate-700">{story.fullStory}</div>
        {story.videoUrl && <a href={story.videoUrl} target="_blank" rel="noreferrer" className="mt-10 inline-flex rounded-full bg-emerald-800 px-5 py-2.5 font-semibold text-white hover:bg-emerald-900">Watch the video on social media or YouTube ↗</a>}
        <div className="mt-12 flex flex-wrap gap-3 border-t border-slate-200 pt-8"><Link href="/stories" className="rounded-full border border-emerald-800 px-5 py-2.5 font-semibold text-emerald-800 hover:bg-emerald-50">More stories</Link>{story.project && <Link href={`/projects/${story.project.slug}`} className="rounded-full bg-emerald-800 px-5 py-2.5 font-semibold text-white hover:bg-emerald-900">Explore the project</Link>}</div>
      </article>
    </div>
  );
}
