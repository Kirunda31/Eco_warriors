import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany();

  return (
    <div>
      <h1>Our Programs</h1>
      {programs.map((program) => (
        <div key={program.id}>
          <Link href={`/programs/${program.slug}`}>
            <h2>{program.name}</h2>
          </Link>
          <p>{program.description}</p>
        </div>
      ))}
    </div>
  );
}