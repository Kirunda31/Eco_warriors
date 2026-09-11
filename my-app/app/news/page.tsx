import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function NewsPage() {
  const articles = await prisma.news.findMany({
    where: { status: 'published' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">News</h1>
      <div className="flex flex-col gap-6">
        {articles.map((article) => (
          <article key={article.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {article.featuredImage && <img src={article.featuredImage} alt={article.title} className="h-64 w-full object-cover" />}
            <div className="p-6">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500">{article.author} - {article.category}</p>
            <p className="mt-2 line-clamp-3 text-gray-700">{article.content}</p>
            <Link href={`/news/${article.slug}`} className="mt-4 inline-block font-semibold text-emerald-800 hover:underline">Read more →</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
