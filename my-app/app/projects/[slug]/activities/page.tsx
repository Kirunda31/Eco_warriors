import { prisma } from '@/lib/prisma';

export default async function ProjectActivitiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { activities: true },
  });

  if (!project) {
    return <h1>Project not found</h1>;
  }

  return (
    <div>
      <h1>{project.title} — Activities</h1>
      {project.activities.map((activity) => (
        <div key={activity.id}>
          <h2>{activity.title}</h2>
          <p>{activity.description}</p>
          <p><strong>Location:</strong> {activity.location}</p>
        </div>
      ))}
    </div>
  );
}