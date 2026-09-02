import { prisma } from '@/lib/prisma';

export default async function StoriesPage() {
  const stories = await prisma.story.findMany({
    where: { status: 'published' },
  });

  return (
    <div>
      <h1>Stories of Change</h1>
      {stories.map((story) => (
        <div key={story.id}>
          <h2>{story.headline}</h2>
          <p><strong>{story.personName}</strong></p>
          <p>{story.outcome}</p>
        </div>
      ))}
    </div>
  );
}