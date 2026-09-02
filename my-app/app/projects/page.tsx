import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany();

  return (
    <div>
      <h1>Our Projects</h1>
      {projects.map((project) => (
        <div key={project.id}>
          <Link href={`/projects/${project.slug}`}>
            <h2>{project.title}</h2>
          </Link>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
