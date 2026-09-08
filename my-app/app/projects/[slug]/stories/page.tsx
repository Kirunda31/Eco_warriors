import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function ProjectStoriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findFirst({
    where: { slug, status: 'active' },
    include: {
      stories: {
        where: { status: 'published' },
      },
    },
  });

  if (!project) notFound();

  return (
    <div>
      <h1>{project.title} — Stories</h1>
      {project.stories.map((story) => (
        <div key={story.id}>
          <h2>{story.headline}</h2>
          <p><strong>{story.personName}</strong></p>
          <p>{story.outcome}</p>
        </div>
      ))}
    </div>
  );
}
