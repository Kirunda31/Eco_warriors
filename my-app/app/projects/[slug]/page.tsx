import { prisma } from '@/lib/prisma';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
  where: { slug },
  include: { program: true },
});

  if (!project) {
    return <h1>Project not found</h1>;
  }

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p><strong>Location:</strong> {project.location}</p>
      <p><strong>Program:</strong> {project.program.name}</p>
    </div>
  );
}