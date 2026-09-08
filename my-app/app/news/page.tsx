import { prisma } from '@/lib/prisma';

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
          <div key={article.id} className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500">{article.author} - {article.category}</p>
            <p className="text-gray-700 mt-2">{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}