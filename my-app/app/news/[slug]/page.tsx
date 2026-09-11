import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.news.findFirst({ where: { slug, status: 'published' } });
  if (!article) return <main className="mx-auto max-w-3xl px-6 py-16"><h1 className="text-2xl font-bold">Article not found</h1><Link href="/news" className="mt-4 inline-block font-semibold text-emerald-800 hover:underline">Back to news</Link></main>;
  return <main className="mx-auto max-w-3xl px-6 py-16"><Link href="/news" className="text-sm font-semibold text-emerald-800 hover:underline">← All news</Link><p className="mt-7 text-sm font-bold uppercase tracking-wide text-emerald-700">{article.category}</p><h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{article.title}</h1><p className="mt-3 text-sm text-slate-500">By {article.author} · {article.createdAt.toLocaleDateString('en-UG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>{article.featuredImage && <img src={article.featuredImage} alt={article.title} className="mt-8 h-80 w-full rounded-2xl object-cover" />}<div className="mt-8 whitespace-pre-line text-lg leading-8 text-slate-700">{article.content}</div></main>;
}
