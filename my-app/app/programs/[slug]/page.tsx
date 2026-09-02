import { prisma } from '@/lib/prisma';

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const program = await prisma.program.findUnique({
    where: { slug },
  });

  if (!program) {
    return <h1>Program not found</h1>;
  }

  return (
    <div>
      <h1>{program.name}</h1>
      <p>{program.description}</p>
      <p><strong>Goal:</strong> {program.goal}</p>
    </div>
  );
}